import request from '@/utils/request';

/**
 * 获取行善过失类型列表
 * */
export function getCharityFaultTypeList(params) {
  return request({
    url: '/charityFault/type',
    method: 'GET',
    params
  })
}

/**
 * 新增行善过失类型列表
 * */
export function addCharityFaultType(data) {
  return request({
    url: '/charityFault/type',
    method: 'POST',
    data
  })
}

/**
 * 新增行善过失类型列表
 * */
export function updateCharityFaultType(data) {
  return request({
    url: '/charityFault/type',
    method: 'PUT',
    data
  })
}
/**
 * 新增行善过失类型列表
 * */
export function deleteCharityFaultType(id) {
  return request({
    url: '/charityFault/type/' + id,
    method: 'DELETE'
  })
}

/**
 * 获取行善过失类型内容
 * */
export function getCharityFaultContentList(params) {
  return request({
    url: '/charityFault/type/content',
    method: 'GET',
    params
  })
}
/**
 * 新增行善过失类型内容
 * */
export function addCharityFaultContent(data) {
  return request({
    url: '/charityFault/type/content',
    method: 'POST',
    data
  })
}
/**
 * 修改行善过失类型内容
 * */
export function updateCharityFaultContent(data) {
  return request({
    url: '/charityFault/type/content',
    method: 'PUT',
    data
  })
}
/**
 * 删除行善过失类型内容
 * */
export function deleteCharityFaultContent(id) {
  return request({
    url: '/charityFault/type/content?id=' + id,
    method: 'DELETE'
  })
}
