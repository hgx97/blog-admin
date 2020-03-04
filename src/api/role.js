import request from '@/utils/request'
import qs from 'qs'

export function getRoles(data) {
  return request({
    url: '/role?' + qs.stringify(data),
    method: 'get'
  })
}

export function getRoleAuths(data) {
  return request({
    url: '/role/' + data.roleId + '/auth?' + qs.stringify({ menuId: data.menuId }),
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function updateRole(data) {
  return request({
    url: '/role',
    method: 'put',
    data: qs.stringify(data)
  })
}

export function deleteRole(data) {
  return request({
    url: '/role?' + qs.stringify(data),
    method: 'delete'
  })
}

export function addRoleAuth(data) {
  return request({
    url: '/role/' + data.roleId + '/auth',
    method: 'post',
    data: qs.stringify(data.authIds)
  })
}
