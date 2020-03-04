import request from '@/utils/request'
import qs from 'qs'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/loginOut',
    method: 'post'
  })
}

export function list(data) {
  return request({
    url: '/user?' + qs.stringify(data),
    method: 'get'
  })
}

export function addUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function addUserRole(data) {
  return request({
    url: '/user/role',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function getUserRole(data) {
  return request({
    url: '/user/role?' + qs.stringify(data),
    method: 'get'
  })
}

export function delUser(data) {
  return request({
    url: '/user?' + qs.stringify(data),
    method: 'delete'
  })
}

export function updateUser(data) {
  return request({
    url: '/user/' + data.userId,
    method: 'patch',
    data: qs.stringify(data)
  })
}
