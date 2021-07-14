import request from '@/utils/request'

export function getAntennaNameList(params) {
    return request({
        url: '/radial/getAntennaNameList',
        method: 'get',
        params
    })
}

export function add(data) {
    return request({
        url: 'interfainterfceHandler/2002',
        method: 'post',
        data
    })
}

export default { }
