import request from '@/utils/request'
/**  /android/roadComplaintMrFileList     路测,投诉，mr文件列表
 *  get请求  带分页      参数type  类型（0路测  1 投诉  2mr）pageNo页码   pageSize页数
 * */
//获取dt Mr 和投诉数据文件夹列表;
export function dtComplaintMrFileList (data) {
    return request({
        url: '/android/roadComplaintMrFileList',
        method: 'get',
        params:data
    })
}
/** 接口： /android/getRoadTestListByFileName   根据文件名查询具体路测数据
 *   get 请求 带分页   参数fileName   文件名    pageNo页码   pageSize页数
*/ 
export function getRoadTestListByFileName(data) {
    return request({
        url: '/android/getRoadTestListByFileName',
        method: 'get',
        params:data
    })
}
/** 接口： /android/getComplaintListByFileName  根据文件名查询具体投诉数据,响应结果带有经纬度,北京用;
 *   get 请求   带分页   参数fileName   文件名    pageNo页码   pageSize页数*/
export function getComplaintListByFileName(data) {
    return request({
        url: '/android/getComplaintListByFileName',
        method: 'get',
        params:data
    })
}
/** 湖北项目接口： /android/getComplaintListByFileNameHb  根据文件名查询具体投诉数据*/
export function getComplaintListByFileNameHb(data) {
    return request({
        url: '/android/getComplaintListByFileNameHb',
        method: 'get',
        params:data
    })
}
/**接口：/android/getMrListByFileName  根据文件名查询具体mr数据
 *   get 请求   带分页   参数fileName   文件名    pageNo页码   pageSize页数 */
export function getMrListByFileName(data) {
    return request({
        url: '/android/getMrListByFileName',
        method: 'get',
        params:data
    })
}
export default { }