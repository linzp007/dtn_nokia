function addSelectListener(layers) {
  this.selectInteraction = new ol.interaction.Select({
    condition: ol.events.condition.singleClick,
    layers: layers,
    multi: false,
    style: function (feature) {
      return getSelectSourceImageStyle(feature)
    }
  })

  // Map = ol.Map
  map.addInteraction(this.selectInteraction)
  //   this.SelectInteraction.on("select", function(event){
  //     getSelectStation(event,selectStation);
  //   }, this);

  return this.selectInteraction
}

function addSelectAltMoreListener(layers) {
  this.selectInteraction = new ol.interaction.Select({
    addCondition: ol.events.condition.altKeyOnly,
    // condition: ol.events.condition.altKeyOnly,
    // toggleCondition: ol.events.condition.altKeyOnly,
    layers: layers,
    multi: true,
    style: function (feature) {
      return getPolygonSelectStyle(feature)
    }
  })

  // Map = ol.Map
  map.addInteraction(this.selectInteraction)
  //   this.SelectInteraction.on("select", function(event){
  //     getSelectStation(event,selectStation);
  //   }, this);

  return this.selectInteraction
}

function addSelectDragboxListener(layers) {
  let selectDragInteraction = new ol.interaction.Select({
    layers: layers,
    style: function (feature) {
      return getPolygonSelectStyle(feature)
    }
  })

  map.addInteraction(selectDragInteraction)

  return selectDragInteraction
}

function getSelectStation(event) {
  var selectSrc = getSelectInfo(event)
  return selectSrc
}

function getSelectInfo(event) {
  var selectSrc = {
    deselected: null,
    selected: null,
    type: null
  }

  if (event.selected.length == 0 && event.deselected.length == 1) {
    // click outside of polygon with previously selected
    selectSrc.type = 'deselect'
    selectSrc.deselected = {
      feature: event.deselected[0],
      id: event.deselected[0].getId()
    }
  } else if (event.deselected.length == 0 && event.selected.length == 1) {
    // click on polygon without previously selected
    selectSrc.type = 'select'
    selectSrc.selected = {
      feature: event.selected[0],
      id: event.selected[0].getId()
    }
  } else if (event.deselected.length == 1 && event.selected.length == 1) {
    // click on polygon with previously selected
    selectSrc.type = 'switch'
    selectSrc.deselected = {
      feature: event.deselected[0],
      id: event.deselected[0].getId()
    }
    selectSrc.selected = {
      feature: event.selected[0],
      id: event.selected[0].getId()
    }
  } else {
    selectSrc.type = 'out'
  }

  return selectSrc
}

function getPolygonSelectStyle(feature) {
  var stationType = feature.get('stationType');
  if (stationType == 'baseStationCell') {
    let cloneStyle = checkedCellPolygonStyle.clone();
    return cloneStyle
  } else if (stationType == 'station') {
    //台站
    let cloneStyle = checkedStationPolygonStyle.clone();
    return cloneStyle
  } else if (stationType == 'polygon') {
    return checkedPolygonStyle.clone();
  }
}

function getSelectStyle(feature) {
  var stationType = feature.get('stationType');
  if (stationType == 'baseStationCell') {
    let scale = getStationScale(1.2);
    //小区
    var angle = feature.get('angle')
    let cloneStyle = selectedSectorStyle.clone();
    var icon = cloneStyle.getImage()
    icon.setRotation((angle * Math.PI) / 180.0)
    icon.setScale(scale);
    return cloneStyle
  } else if (stationType == 'station') {
    //台站
    let scale = getStationScale(1.1);
    let cloneStyle = selectedStaionStyleProSi.clone();
    cloneStyle.getImage().setScale(scale);
    return cloneStyle
  } else if (stationType == 'polygon') {
    return checkedPolygonStyle.clone();
  }
}

function getSelectSourceImageStyle(feature) {
  var stationType = feature.get('stationType');
  if (stationType == 'baseStationCell' || stationType == 'baseStationCellTemp' || stationType == 'HBbaseStationCell') {
    //小区
    var angle = feature.get('angle')
    let cloneStyle = selectedSectorStyle.clone();
    var icon = cloneStyle.getImage()
    icon.setRotation((angle * Math.PI) / 180.0)
    return cloneStyle
  }
}

function createIconStyle(url, imgSize, scale, revert) {
  var iconStyle = new ol.style.Style({
    image: new ol.style.Icon(
      /** @type {olx.style.IconOptions} */
      ({
        anchor: [0.5, 0.5],
        size: [imgSize, imgSize],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        opacity: 1,
        src: url,
        scale: scale
      })
    )
  })
  iconStyle.getImage().load()
  return iconStyle
}

function addStation(stationId, lng, lat, transformGcj02) {
  var geometry = null
  if (transformGcj02) {
    var coord = GPS.gcj_encrypt(lat, lng)
    geometry = new ol.geom.Point([coord.lng, coord.lat])
  } else {
    geometry = new ol.geom.Point([lng, lat])
  }
  feature = new ol.Feature(geometry)
  feature.setId(stationId)
  feature.set('stationType', 'baseStation')
  baseStaionData.addFeature(feature)
}

function addSector(sectorType, sectorSource, angle, sectorId, lng, lat, transformGcj02, id) {
  var geometry = null;
  if (transformGcj02) {
    var coord = GPS.gcj_encrypt(lat, lng);
    geometry = new ol.geom.Point([coord.lng, coord.lat]);
  } else {
    geometry = new ol.geom.Point([lng, lat]);
  }
  feature = new ol.Feature(geometry);
  feature.setId(sectorId);

  var style = createIconStyle('./resource/sector.png', 54, 1); //sectorStyle.clone();
  if(sectorType == 'baseStationCellTemp'){
    style = createIconStyle('./resource/sector4.png', 54, 1);
  }
  feature.setStyle(style);
  feature.set("angle", angle);
  feature.set("id", id);
  feature.set("stationType", sectorType);
  var icon = feature.getStyle().getImage();
  //  icon.setRotateWithView(true);
  icon.setRotation(angle * Math.PI / 180.0);

  sectorSource.addFeature(feature);
}

// todo 台站数据，台站feature
function addBaseStationProSi(stationId, lng, lat, transformGcj02) {
  var geometry = null
  if (transformGcj02) {
    var coord = GPS.gcj_encrypt(lat, lng)
    geometry = new ol.geom.Point([coord.lng, coord.lat])
  } else {
    geometry = new ol.geom.Point([lng, lat])
  }
  feature = new ol.Feature(geometry)
  feature.setId(stationId)
  feature.set('stationType', 'station')
  baseStaionDataProSi.addFeature(feature)
}

function caculateExtent(leftLng, bottomLat, radius) {
  var leftBottom = ol.proj.transform([leftLng, bottomLat], 'EPSG:4326', 'EPSG:3857')
  var x = leftBottom[0]
  var y = leftBottom[1]

  var right = x + 2 * radius

  var top = y + 2 * radius

  //[minx, miny, maxx, maxy];
  var mapExtent = [x, y, right, top]
  return ol.proj.transformExtent(mapExtent, 'EPSG:3857', 'EPSG:4326')
}

function addBaseStation(stationId, lng, lat, transformGcj02) {
  var geometry = null
  if (transformGcj02) {
    var coord = GPS.gcj_encrypt(lat, lng)
    geometry = new ol.geom.Point([coord.lng, coord.lat])
  } else {
    geometry = new ol.geom.Point([lng, lat])
  }
  feature = new ol.Feature(geometry)
  feature.setId(stationId)
  baseStaionData.addFeature(feature)
}


//加载分析结果图片
function createTileLayer(layname, mapURL, minZoom, maxZoom, extent, zIndex) {
  if (layname == null) {
    throw 'layname ==null'
  }

  if (typeof layname != 'string') {
    throw "typeof layname  != 'string' "
  }

  if (layname.length < 1) {
    throw ' layname.length<1 '
  }
  var dstExtent = extent

  // if (extent && extent[0]<10000)
  //   dstExtent =ol.proj.transformExtent(extent, "EPSG:4326", "EPSG:3857");
  var layer = new ol.layer.Tile({
    //   extent: m_mapExtent,
    // preload: Infinity,
    zIndex: zIndex,
    extent: dstExtent,
    source: new ol.source.XYZ({
      attributions: '',
      tilePixelRatio: 1, // THIS IS IMPORTANT
      minZoom: minZoom,
      maxZoom: maxZoom,
      crossOrigin: '*'
    })
  })

  layer.set('name', layname)
  return layer
}

function getOverviewMap(baseMapURL) {
  var m_mapMinZoom = 0
  var m_mapMaxZoom = 20

  var mapURL = !baseMapURL ? '/osm_tiles/{z}/{x}/{y}.png' : baseMapURL
  var overviewMap = new ol.control.OverviewMap({
    // see in overviewmap-custom.html to see the custom CSS used
    //
    className: 'ol-overviewmap ol-custom-overviewmap',
    layers: [
      new ol.layer.Tile({
        //   extent: m_mapExtent,
        source: new ol.source.XYZ({
          attributions: '',
          url: mapURL,
          tilePixelRatio: 10, // THIS IS IMPORTANT
          minZoom: m_mapMinZoom,
          maxZoom: m_mapMaxZoom,
          zIndex: 1
        })
      })
    ],
    collapseLabel: '\u00BB',
    label: '\u00AB',
    collapsed: false
  })

  return overviewMap
}

function getBaseMapLayer(baseMapURL) {
  var m_mapMinZoom = 0
  var m_mapMaxZoom = 20

  var mapURL = !baseMapURL ? '/osm_tiles/{z}/{x}/{y}.png' : baseMapURL
  baseMapLayer = new ol.layer.Tile({
    //   extent: m_mapExtent,
    preload: Infinity,
    crossOrigin: '*',
    source: new ol.source.XYZ({
      attributions: '',
      url: mapURL,
      tilePixelRatio: 1, // THIS IS IMPORTANT
      minZoom: m_mapMinZoom,
      maxZoom: m_mapMaxZoom,
      zIndex: 1
    })
  })

  return baseMapLayer;
}

function LngLat(coords, coords2) {

  if (coords2 == null) {
    this.m_Lng = coords[0];
    this.m_Lat = coords[1];
  } else {
    this.m_Lng = coords;
    this.m_Lat = coords2;
  }

  this.getLng = function () {
    return this.m_Lng;
  }
  this.getLat = function () {
    return this.m_Lat;
  }
}

function LatLngBounds(southWest, northEast) {
  this.m_SouthWest = southWest;
  this.m_NorthEast = northEast;
  this.getSouthWest = function () {
    return this.m_SouthWest;
  }
  this.getNorthEast = function () {
    return this.m_NorthEast;
  }
}

function getBounds(mapView) {
  var ext = mapView.calculateExtent();
  return new LatLngBounds(new LngLat(ext[0], ext[1]), new LngLat(ext[2], ext[3]));
}


function parseParam(param, key) {
  var paramStr = ''
  if (param instanceof String || param instanceof Number || param instanceof Boolean) {
    paramStr += '&' + key + '=' + encodeURIComponent(param)
  } else {
    $.each(param, function (i) {
      var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
      paramStr += '&' + parseParam(this, k)
    })
  }
  return paramStr.substr(1)
}

function indexOfJS(arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == val) return i
  }
  return -1
}

function removeJS(arr, val) {
  var index = indexOfJS(arr, val)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

function copy(obj) {
  return JSON.parse(JSON.stringify(obj))
}



function UrlExists(url) {
  var http = new XMLHttpRequest();
  http.open('HEAD', url, false);
  http.send();
  return http.status != 404;
}

function addClass(elm, newclass) {
  var classes = elm.className.split(' ');
  classes.push(newclass);
  elm.className = classes.join(' ');
}

function removeClass(elm, oldClass) {
  var classes = elm.className.split(' ');
  removeJS(classes, oldClass);
  elm.className = classes.join(' ');
}

function getStationScale(num) {
  let zoom = map.getView().getZoom();
  let scale = Number.parseInt(zoom) / 13;
  if (scale == 1) {
    scale = 0.8;
  } else {
    scale = zoom / 13;
    scale = scale > 1 ? scale * num : scale * 0.5;
  }

  return scale;
}

function transform4326To3857Point(point) {
  let dstPoint = ol.proj.transform(point, 'EPSG:4326', 'EPSG:3857');
  return dstPoint;
}

function transform3857To4326Point(point) {
  let dstPoint = ol.proj.transform(point, 'EPSG:3857', 'EPSG:4326');
  return dstPoint;
}

function transform4326To3857Extent(extent) {
  let dstExtent = ol.proj.transformExtent(extent, 'EPSG:4326', 'EPSG:3857')
  return dstExtent;
}


function getMathRandom(max, min) {
  let random = parseInt(Math.random() * (max - min + 1) + min, 10);
  return random;
}

var format = new ol.format.GeoJSON();

function isConvexPolygon(polygonGeometry) {
  var coordinates = polygonGeometry.getCoordinates();
  var features = [];
  for (var i = 1; i < coordinates[0].length; i++) {
    var feature = new ol.Feature({
      geometry: new ol.geom.LineString([coordinates[0][i - 1], coordinates[0][i]])
    });

    features.push(feature);
  }
  var isNormal = true;
  for (var i = 0; i < features.length; i++) {
    var geom = features[i].getGeometry().getType();
    if (geom == 'LineString' || geom == 'Polygon') {
      var pointsNum = 0;
      for (var j = 0; j < features.length; j++) {
        if (i == j) continue;
        var geom = features[j].getGeometry().getType();
        if (geom == 'LineString' || geom == 'Polygon') {
          var line1 = format.writeFeatureObject(features[i]);
          var line2 = format.writeFeatureObject(features[j]);
          var intersects = turf.lineIntersect(line1, line2);
          var points = format.readFeatures(intersects);
          pointsNum += points.length;
        }
      }
      if (pointsNum > 2) {
        isNormal = false;
        break;
      }
    }
  }
  return isNormal;
}

function createCellFeature(polygonId, desPoint, angle) {
  let distance = 200;
  let pointAngel1 = (-angle * Math.PI) / 180 + (5 * Math.PI) / 12;
  let pointAngel2 = (-angle * Math.PI) / 180 + (7 * Math.PI) / 12;
  let point1 = [desPoint[0] + distance * Math.cos(pointAngel1), desPoint[1] + distance * Math.sin(pointAngel1)];
  let point2 = [desPoint[0] + distance * Math.cos(pointAngel2), desPoint[1] + distance * Math.sin(pointAngel2)];


  var coordinatesPolygon = new Array()
  coordinatesPolygon.push(desPoint);
  coordinatesPolygon.push(point1);
  coordinatesPolygon.push(point2);
  coordinatesPolygon.push(desPoint);

  //多边形此处注意一定要是[坐标数组]
  var plygon = new ol.geom.Polygon([coordinatesPolygon])
  //多边形要素类
  var feature = new ol.Feature({
    geometry: plygon
  })
  feature.setId(polygonId)
  feature.set('stationType', 'baseStationCell');
  return feature;
}

function createCircleFeature(id, centerPoint, r, featureName) {
  //圆形,中心点和半径
  var cricle = new ol.geom.Circle(centerPoint, r);

  var feature = new ol.Feature({
    geometry: cricle,
    labelPoint: new ol.geom.Point(centerPoint),
    name: '' + id
  });
  feature.setId(id)
  feature.set('stationType', featureName)
  return feature;
}

function createSquareFeature(epsg, polygonId, point, radius, featureType) {
  let desPoint = point;
  switch (epsg) {
    case '4326':
      desPoint = transform4326To3857Point(point)
      break;
  }
  let sourceLng = desPoint[0];
  let sourceLat = desPoint[1];
  let point1 = [sourceLng - radius, sourceLat + radius];
  let point2 = [sourceLng - radius, sourceLat - radius];
  let point3 = [sourceLng + radius, sourceLat - radius];
  let point4 = [sourceLng + radius, sourceLat + radius];
  let point5 = [sourceLng - radius, sourceLat + radius];

  switch (epsg) {
    case '4326':
      point1 = transform3857To4326Point(point1);
      point2 = transform3857To4326Point(point2);
      point3 = transform3857To4326Point(point3);
      point4 = transform3857To4326Point(point4);
      point5 = transform3857To4326Point(point5);
      break;
  }

  var coordinatesPolygon = new Array()
  coordinatesPolygon.push(point1);
  coordinatesPolygon.push(point2);
  coordinatesPolygon.push(point3);
  coordinatesPolygon.push(point4);
  coordinatesPolygon.push(point5);

  //多边形此处注意一定要是[坐标数组]
  var plygon = new ol.geom.Polygon([coordinatesPolygon])
  //多边形要素类
  var feature = new ol.Feature({
    geometry: plygon
  })
  feature.setId(polygonId)
  feature.set('stationType', featureType);
  return feature;
}

function setFeatureStyle(featureStyle, color) {
  let cloneStyle = stationPolygonStyle.clone();
  var fill = new ol.style.Fill({
    color: color
  });
  var stroke = new ol.style.Stroke({
    color: color,
    width: 1.25
  });

  cloneStyle.setFill(fill);
  cloneStyle.setStroke(stroke);
  return cloneStyle;
}

function getMapCenter() {
  var mapExtent = map.getView().calculateExtent(map.getSize());
  var point = ol.extent.getCenter(mapExtent)
  return point;
}

function showCell(cells, featureType) {
  //j小于数组长度
  for (var j = 0; j < cells.length; j++) {
    var cellId = cells[j].cellId;
    var bsId = cells[j].bsId;
    var coordinate2 = cells[j].coordinate;
    var coord2 = GPS.gcj_encrypt(coordinate2.lat, coordinate2.lng);
    var cellLng = coord2.lng;
    var cellLat = coord2.lat;
    var angle = cells[j].angle;
    //    addSector("baseStationCell",sectorData,angle, cellId, cellLng, cellLat, false, bsId);
    addSector(featureType, sectorData, angle, cellId, cellLng, cellLat, false, bsId);
  }
}

function addImageToLayer(singleSimLayer, imageUrl, leftTopPoint, rightBottomPoint) {
  var imageExtent = [leftTopPoint.lng, rightBottomPoint.lat, rightBottomPoint.lng, leftTopPoint.lat];
  let resultImgData = new ol.source.ImageStatic({
    url: imageUrl,
    crossOrigin: '',
    projection: 'EPSG:4326',
    imageExtent: imageExtent
  });
  singleSimLayer.setSource(resultImgData);
  singleSimLayer.setVisible(true);
}
