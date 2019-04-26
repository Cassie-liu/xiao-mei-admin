import request from '@/utils/request';

/**
 * 获取banner列表
 * */
export function getBannerList(params) {
  return request({
    url: '/banner/home/list',
    method: 'GET',
    params
  })
}
/**
 * 获取某一banner图
 * */
export function getBannerById(id) {
  return request({
    url: '/banner/home/' + id,
    method: 'GET'
  })
}
/**
 * 新增banner图
 * */
export function addBannerImage(data) {
  return request({
    url: '/banner/home/create',
    method: 'POST',
    data
  })
}
/**
 * 更新banner图
 * */
export function updateBannerImage(data) {
  return request({
    url: '/banner/home/modify',
    method: 'POST',
    data
  })
}
/**
 * 删除banner图
 * */
export function deleteBannerImage(id) {
  return request({
    url: '/banner/home/' + id,
    method: 'DELETE'
  })
}
