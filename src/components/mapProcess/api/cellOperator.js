import request from '@/utils/request'
import {urlConfig} from '@/components/mapProcess/api/defaultUrl'

export function getById(params) {
    return request({
        url: urlConfig.getCelllByIdUrl,
        method: 'get',
        params
    })
}

export function getTempById(data) {
    return request({
        url: urlConfig.getTemCelllByIdUrl,
        method: 'post',
        data
    })
}

export function update(data) {
    return request({
        url:  urlConfig.updateCellUrl,
        method: 'post',
        data
    })
}

export function updateBj(params) {
    return request({
        url: urlConfig.updateCellUrl,
        method: 'get',
        params
    })
}

export function delCellByIdApi(data) {
    return request({
        url: urlConfig.delCellByIdApi+data,
        method: 'delete'
    })
}

export function checkCellData(data) {
    return request({
        url:  urlConfig.checkCellDataUrl,
        method: 'post',
        data
    })
}

export function save(data) {
    return request({
        url: urlConfig.saveCellUrl,
        method: 'post',
        data
    })
}

export default { }
