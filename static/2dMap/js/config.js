var CONFIG = {
  ipAndPort: "nqi.gmcc.net:20443",
  protocol: "https://"
};
var url1 = window.location.href.split("/")[3];
var req_back_url = "";
var req_simulation_url = "";
if (url1 == "pre-dtn-specializedanalysis" || url1 == "pre-simulationplan") {
  req_back_url =
    CONFIG.protocol + CONFIG.ipAndPort + "/pre-dtn-specializedanalysis";
  req_simulation_url =
    CONFIG.protocol + CONFIG.ipAndPort + "/pre-dtn-specializedanalysis/Result";
} else if (
  url1 == "dev-dtn-specializedanalysis" ||
  url1 == "dev-simulationplan"
) {
  req_back_url =
    CONFIG.protocol + CONFIG.ipAndPort + "/dev-dtn-specializedanalysis";
  req_simulation_url =
    CONFIG.protocol + CONFIG.ipAndPort + "/dev-dtn-specializedanalysis/Result";
} else if (url1 == "pro-dtn-specializedanalysis" || url1 == "simulationplan") {
  req_back_url =
    CONFIG.protocol + CONFIG.ipAndPort + "/pro-dtn-specializedanalysis";
  req_simulation_url =
    CONFIG.protocol + CONFIG.ipAndPort + "/pro-dtn-specializedanalysis/Result";
}
// var req_back_url = "http://218.205.192.26:8090/dtn"; //请求后台的url
// var req_simulation_url = "http://218.205.192.26:8090/pic"; //请求仿真结果路径的url
// DTN北京常用外网版本地址
//  var req_back_url = "http://218.205.192.26:8070/dtn"; //请求后台的url
//  var req_simulation_url = "http://218.205.192.26:8070/pic"; //请求仿真结果路径的url
//  var single_simulation_url = "http://218.205.192.26:8070/home/DTNWeb/DTNData/Result"; //请求仿真结果路径的url

//  var req_back_url = "http://172.168.40.47:9201/dtn"; //请求后台的url
//  var req_simulation_url = "http://172.168.40.47:9201/pic"; //请求仿真结果路径的url
//  var single_simulation_url = "http://172.168.40.47:9201/home/DTNWeb/DTNData/Result"; //请求仿真结果路径的url

//测试环境
var req_back_url = "http://10.254.218.124:8091/dtn"; //请求后台的url
var req_simulation_url = "http://10.254.218.124:8091/pic"; //请求仿真结果路径的url
var single_simulation_url = "http://10.254.218.124:8091/home/DTNWeb/DTNData/Result"; //请求仿真结果路径的url

// var req_back_url = "http://10.254.218.107:8091/dtn"; //请求后台的url
// var req_simulation_url = "http://10.254.218.107:8091/pic"; //请求仿真结果路径的url
//    // var single_simulation_url = "./test/home/DTNWeb/DTNData/Result"; //请求仿真结果路径的url
// var single_simulation_url = "http://10.254.218.107:8091/home/DTNWeb/DTNData/Result"; //请求仿真结果路径的url

// 湖北内网地址
// var req_back_url = "http://10.25.225.90:8070/dtn"; //请求后台的url
// var req_simulation_url = "http://10.25.225.90:8070/pic"; //请求仿真结果路径的url
// var single_simulation_url = "http://10.25.225.90:8070/home/DTNWeb/DTNData/Result"; //请求仿真结果路径的url
 
//湖北环境
//  let provinceCode = 420000;
 //北京环境
 let provinceCode = 110000;
let defaultCoverPolygonColor = "rgba(255,0,0,102)";
