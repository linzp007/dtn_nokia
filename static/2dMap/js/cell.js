function getXmlHttpReqObj() {
  var xhr = {
    getXHR: function () {
      var XHR = null;
      if (typeof window.ActiveXObject != 'undefined') {
        XHR = xhr.createActiveXObject();
      } else {
        XHR = xhr.createStandardXHR();
      }
      return XHR;
    },
    createActiveXObject: function () {
      try {
        return new window.ActiveXObject("Mscrosoft.XMLHttp");
      } catch (e) {}
    },
    createStandardXHR: function () {
      try {
        return new window.XMLHttpRequest();
      } catch (e) {}
    },

    onreadystatechange: function (xhr, callback) {
      if (!callback) {
        return;
      }
      if (xhr.readyState == 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
          callback(xhr.responseText);
        }
      }
    },
    //IE8+
    ontimeout: function (callback) {
      if (!callback) {
        return;
      }
      callback();
    },
    onprogress: function (event, callback) {
      console.log("dsss");
      if (!callback) {
        return;
      }
      callback(event);
    }
  };

  return xhr;
}

function isExistsFile(url) {
  let xhr = getXmlHttpReqObj();
  var XHR = xhr.getXHR();
  XHR.open('HEAD', url, false);
  XHR.send();
  return XHR.status != 404;
}

function readTextFileServer(url, token) {
  var xmlHttpReq = null;
  if (window.ActiveXObject) {
    xmlHttpReq = new ActiveXObject('Microsoft.XMLHTTP');
  } else if (window.XMLHttpRequest) {
    xmlHttpReq = new XMLHttpRequest();
  }
  let okStatus = document.location.protocol === "file:" ? 0 : 200;

  //此处为服务器端脚本文件的地址
  xmlHttpReq.open('GET', url, false);
  if (token) {
    xhr.setRequestHeader("token", token);
  }
  xmlHttpReq.overrideMimeType("text/html;charset=utf-8"); //默认为utf-8                        
  xmlHttpReq.send(null);
  return xmlHttpReq.status === okStatus ? xmlHttpReq.responseText : null;
}

function readTextFile(textFileUrl, token) {
  let xhr = new XMLHttpRequest(),
    okStatus = document.location.protocol === "file:" ? 0 : 200;
  xhr.open('GET', textFileUrl, false);
  xhr.overrideMimeType("text/html;charset=utf-8"); //默认为utf-8
  if (token) {
    xhr.setRequestHeader("token", token);
  }
  xhr.send();
  return xhr.status === okStatus ? xhr.responseText : null;
}

function csvToObject(csvString, headersParam) {
  var csvarry = csvString.split("\r\n");
  var datas = [];
  var headers = csvarry[0].split(",");
  let index = 1;
  if (headersParam) {
    headers = headersParam.split(",");
    index = 0;
  }
  for (var i = index; i < csvarry.length; i++) {
    var data = {};
    var temp = csvarry[i].split(",");
    for (var j = 0; j < temp.length; j++) {
      data[headers[j]] = temp[j];
    }
    datas.push(data);
  }
  return datas;
}

function txtToObject(csvString, headersParam) {
  var csvarry = csvString.split("\n");
  var datas = [];
  var headers = csvarry[0].split(",");
  let index = 1;
  if (headersParam) {
    headers = headersParam.split(",");
    index = 0;
  }
  for (var i = index; i < csvarry.length; i++) {
    if(!csvarry[i]) continue;
    var data = {};
    var temp = csvarry[i].split(",");
    for (var j = 0; j < temp.length; j++) {
      data[headers[j]] = temp[j];
    }
    datas.push(data);
  }
  return datas;
}

function getCsvDatasByFileUrls(textFileUrls, fileNames) {
  if (!textFileUrls || !fileNames) return null;
  let csvDatas = [];
  let jobIds = [];
  let jobUrls = [];
  for (let i = 0; i < textFileUrls.length; i++) {
    let frontUrl = textFileUrls[i];
    let fileName = fileNames[i];
    let allUrl = frontUrl + "/" + fileName;
    let data = readTextFileServer(allUrl);
    if (!data) continue;
    csvDatas.push(data);
    let jobId = frontUrl.substring(frontUrl.lastIndexOf("/") + 1, frontUrl.length);
    jobIds.push(jobId);
    jobUrls.push(frontUrl);
  }
  if (csvDatas.length == 0) {
    return null;
  }

  let csvObjects = [];
  for (let i = 0; i < csvDatas.length; i++) {
    let csvData = csvDatas[i];
    let jobId = jobIds[i];
    let jobUrl = jobUrls[i];
    let csvObjectArr = csvToObject(csvData);
    if (!csvObjectArr || csvObjectArr.length == 0) continue;
    for (let j = 0; j < csvObjectArr.length; j++) {
      csvObject = csvObjectArr[j];
      csvObject.jobId = jobId;
      csvObject.jobUrl = jobUrl;
      csvObjects.push(csvObject);
    }

  }

  return csvObjects;
}

function jsonToEcgiKeyMap(csvObjects) {
  if (!csvObjects || csvObjects.length == 0) return null;

  let ret = {};
  for (let i = 0; i < csvObjects.length; i++) {
    let csvObj = csvObjects[i];
    let ECGI = csvObj.ECGI;
    ret[ECGI] = csvObj
  }
  return ret;
}

//显示单站仿真
function showSingleSimResult(singleSimLayer, singleSimModel) {
  singleSimLayer.setVisible(false);
  if (!singleSimModel) return;

  let imageName = singleSimModel.Image;
  let jobUrl = singleSimModel.jobUrl;
  let imageUrl = jobUrl + "/" + imageName;
  let leftTopPoint = GPS.gcj_encrypt(parseFloat(singleSimModel.North), parseFloat(singleSimModel.West));
  let rightBottomPoint = GPS.gcj_encrypt(parseFloat(singleSimModel.South), parseFloat(singleSimModel.East));
  addImageToLayer(singleSimLayer, imageUrl, leftTopPoint, rightBottomPoint);
  // map.getView().setCenter([(leftTopPoint.lng + rightBottomPoint.lng) / 2, (leftTopPoint.lat +
  //     rightBottomPoint.lat) / 2]);
}

//清除单站仿真
function clearSingleSimResult(singleSimLayer) {
  singleSimLayer.setVisible(false);
  singleSimulationCellsMap = null;
}

function readCsv() {
  let textFileUrls = ['./test/home/DTNWeb/DTNData/Result/JobID3889275'];
  let fileNames = ['cellRSRP.csv'];
  let csvObjects = getCsvDatasByFileUrls(textFileUrls, fileNames);
  let retMap = jsonToEcgiKeyMap(csvObjects);
  console.log(JSON.stringify(retMap));
}


function isContainsValue(values, singleValue) {
  if (!values) return false;

  let ret = false;

  for (let i = 0; i < values.length; i++) {
    if (singleValue == values[i]) {
      ret = true;
      break;
    }
  }

  return ret;
}

//0:其他省份小区;1:湖北正式表小区;2:湖北临时表小区 根据小区表类型，获取小区类型
function getCellType(sourceTableType) {
  switch (sourceTableType) {
    case 0:
      return "baseStationCell";
    case 1:
      return "HBbaseStationCell";
    case 2:
      return "baseStationCellTemp";
    default:
      return "baseStationCell";
  }
}



function gettxtDatasByFileUrls(textFileUrls) {
  if (!textFileUrls) return null;
  let txtDatas = [];
  for (let i = 0; i < textFileUrls.length; i++) {
    let allUrl = textFileUrls[i];
    let data = readTextFileServer(allUrl);
    if (!data) continue;
    txtDatas.push(data);
  }
  if (txtDatas.length == 0) {
    return null;
  }

  let txtObjects = [];
  let headers = "lng,lat";
  for (let i = 0; i < txtDatas.length; i++) {
    let txtData = txtDatas[i];
    let txtObjectArr = txtToObject(txtData, headers);
    if (!txtObjectArr || txtObjectArr.length == 0) continue;
    for(let j=0;j<txtObjectArr.length;j++){
      txtObjects.push(txtObjectArr[j]);
    }

  }

  if(txtObjects.length == 0) return [];
  let ret = [];
  let temObj = txtObjects[0];
  let temArr = [];
  for(let i=1;i<txtObjects.length;i++){
    let item = txtObjects[i];
    temArr.push(item);
    if(temObj.lng == item.lng && temObj.lat == item.lat){
      ret.push(temArr);
      temArr = [];
      let temIndex = (i+1)<txtObjects.length ?(i+1):(txtObjects.length-1);
      temObj = txtObjects[temIndex];
      i = temIndex;
    }
  }


  return ret;
}

function showConverPolygons(jobIds) {
  polygonCoverSource.refresh();
  if (!jobIds) return;

  let textFileUrls = [];
  for (let i = 0; i < jobIds.length; i++) {
    let jobId = jobIds[i];
    let url = req_simulation_url + "/" + jobId + "_WeakCover/" + jobId + ".txt";
    let isExistUrl = isExistFileJquery(url);
    if (!isExistUrl) continue;
    textFileUrls.push(url);
  }
  let retDatas = gettxtDatasByFileUrls(textFileUrls);
  if (!retDatas) {
    window.parent['getAlertMsg']("选择区域内无弱覆盖栅格", false);
    return;
  }

  //polygonCoverSource
  for (var m = 0; m < retDatas.length; m++) {
    var polygon = retDatas[m];
    let firstPoint = [];
    var coordinatesPolygon = new Array();
    for (let i = 0; i < polygon.length; i++) {
      let point = polygon[i];
      let coord = GPS.gcj_encrypt(parseFloat(point.lat), parseFloat(point.lng));
      let destPoint = [coord.lng, coord.lat];
      coordinatesPolygon.push(destPoint);

      if(i==0){
        firstPoint = destPoint;
      }
    }


    //多边形此处注意一定要是[坐标数组]
    var polygonGeom = new ol.geom.Polygon([coordinatesPolygon])
    //多边形要素类
    var feature = new ol.Feature({
      geometry: polygonGeom,
    });

    polygonCoverSource.addFeature(feature);
    polygonCoverSource.changed();

    if (retDatas.length - 1 == m) {
      map.getView().setCenter(firstPoint);
    }
  }
}
