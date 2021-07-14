import request from '@/utils/request'
import { proxy } from '@/api/proxy'

export function login(data) {
    return request({
        url: '/userLogin',
        method: 'post',
        data
    })
}

export default { }
