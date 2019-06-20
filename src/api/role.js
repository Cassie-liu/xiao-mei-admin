import request from '@/utils/request';

/**
 * 获取角色
 * */
export function getRolesList(params) {
  return request({
    url: '/roleManage/role',
    method: 'GET',
    params
  })
}

/**
 * 添加角色
 * */
export function addRole(data) {
  return request({
    url: '/roleManage/role',
    method: 'POST',
    data
  })
}

/**
 * 编辑角色
 * */
export function updateRole(data) {
  return request({
    url: '/roleManage/role',
    method: 'PUT',
    data
  })
}

/**
 * 删除角色
 * */
export function deleteRole(id) {
  return request({
    url: '/roleManage/role?roleId=' + id,
    method: 'DELETE'
  })
}
/**
 * 获取角色资源
 * */
export function getRoleResource() {
  return request({
    url: '/roleManage/getResource',
    method: 'GET'
  })
}
