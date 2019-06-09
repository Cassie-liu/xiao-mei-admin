import request from '@/utils/request';

/**
 * 获取客服列表
 * */
export function getCustomList (params){
  return request({
    url: '/custom/list',
    method: 'GET',
    params
  })
}
/**
 * 新增客服
 * */
export function addCustom(data) {
  return request({
    url: '/custom/create',
    method: 'POST',
    data
  })
}
/**
 * 修改客服
 * */
export function updateCustom(data) {
  return request({
    url: '/custom/modify',
    method: 'PUT',
    data
  })
}
/**
 * 删除客服
 * */
export function deleteCustom(id) {
  return request({
    url: '/custom/delete/' + id,
    method: 'DELETE'
  })
}
/**
 * 版本更新
 * */
export function getAppVersion() {
  return request({
    url: '/system/getAppVersion',
    method: 'get'
  })
}
/**
 * 上传app更新
 * */
export function updateApp(data) {
  return request({
    url: '/system/uploadApp',
    method: 'post',
    data
  })
}
