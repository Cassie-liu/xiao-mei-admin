import request from '@/utils/request';

/**
 * 获取账号信息
 * */
export function getAccountList(params) {
  return request({
    url: '/sysUser/list',
    method: 'GET',
    params
  })
}
/**
* 新增用户
* */
export function addAccount(data) {
  return request({
    url: '/sysUser/save',
    method: 'POST',
    data
  })
}
/**
 * 修改用户
 * */
export function modifyAccount(data) {
  return request({
    url: '/sysUser/modify',
    method: 'POST',
    data
  })
}

/**
 * 删除账号
 * */
export function deleteAccount(id) {
  return request({
    url: '/sysUser/' + id,
    method: 'DELETE'
  })
}

/**
 * 根据id查询账号
 */
export function getAccountById(id) {
  return request({
    url: '/sysUser/' + id,
    method: 'GET'
  })
}
