import request from '@/utils/request';

/**
 * 获取热门搜索
 * */
export function getHotWordsList(params) {
  return request({
    url: '/search/list',
    method: 'GET',
    params
  })
}
/**
 * 添加热门搜索
 * */
export function addHotWords(data) {
  return request({
    url: '/search/entity',
    method: 'POST',
    data
  })
}
/**
 * 更新热门搜索
 * */
export function updateHotWords(data) {
  return request({
    url: '/search/entity',
    method: 'PUT',
    data
  })
}
/**
 * 更新热门搜索
 * */
export function deleteHotWords(id) {
  return request({
    url: '/search/entity?id=' + id,
    method: 'DELETE'
  })
}
