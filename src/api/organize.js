import request from '@/utils/request';

/**
 * 获取机构列表
 * */
export function getOrganizeList(params) {
  return request({
    url: '/office/list',
    method: 'GET',
    params
  })
}
/**
 * 新增机构
 * */
export function addOrganize(data) {
  return request({
    url: '/office/create',
    method: 'POST',
    data
  })
}
/**
 * 修改机构
 * */
export function updateOrganize(data) {
  return request({
    url: '/office/modify',
    method: 'PUT',
    data
  })
}
/**
 * 获取某个机构详细信息
 * */
export function getOfficeById(officeId) {
  return request({
    url: '/office/list/' + officeId,
    method: 'GET'
  })
}
/**
 * 删除机构
 * */
export function deleteOrganize(id) {
  return request({
    url: '/office/delete/' + id,
    method: 'DELETE'
  })
}
