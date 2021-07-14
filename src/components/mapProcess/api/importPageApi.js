import request from '@/utils/request'
// 8	批量导入-路测数据
export function roadTestImport(data) {
    return request({
        url: '/android/roadTestImport',
        method: 'post',
        data
    })
}
// 9	批量导入-投诉数据
export function complaintDataImport(data) {
    return request({
        url: '/android/complaintDataImport',
        method: 'post',
        data
    })
}
// 10	批量导入-mr数据
export function mrDataImport(data) {
    return request({
        url: '/android/mrDataImport',
        method: 'post',
        data
    })
}

export default { }