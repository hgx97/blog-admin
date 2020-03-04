import request from '@/utils/request'
import qs from 'qs'

export function listAuth(data) {
  return request({
    url: '/auth?' + qs.stringify(data),
    method: 'get'
  })
}

export function addAuth(data) {
  return request({
    url: '/auth',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function updateAuth(data) {
  return request({
    url: '/auth',
    method: 'put',
    data: qs.stringify(data)
  })
}

export function delAuth(data) {
  return request({
    url: '/auth?' + qs.stringify(data),
    method: 'delete'
  })
}
