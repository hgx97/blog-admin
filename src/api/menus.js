import request from '@/utils/request'
import qs from 'qs'

export function getMenusList(data) {
  return request({
    url: '/menu?' + qs.stringify(data),
    method: 'get'
  })
}

export function putMenu(data) {
  return request({
    url: '/menu',
    method: 'put',
    data: qs.stringify(data)
  })
}

export function addMenu(data) {
  return request({
    url: '/menu',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function deleteMenu(data) {
  return request({
    url: '/menu?' + qs.stringify(data),
    method: 'delete'
  })
}
