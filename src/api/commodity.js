import request from '@/utils/request';

/**
 * 查询商品列表
 * */
export function getCommodityList(data) {
  return request({
    url: '/commodity/list',
    method: 'post',
    data
  })
}
/**
 * 新增商品
 * */
export function addCommmodity(data) {
  return request({
    url: '/commodity/entity',
    method: 'post',
    data
  })
}

export function getCommodityDetails(commodityId) {
  return request({
    url: `/commodity/entity/${commodityId}`,
    method: 'get'
  })
}
/**
 * 更新商品
 * */
export function updateCommmodity(data) {
  return request({
    url: '/commodity/entity',
    method: 'put',
    data
  })
}
/**
 * 删除商品
 * */
export function deleteCommmodity(commodityId) {
  return request({
    url: '/commodity/entity?commodityId=' + commodityId,
    method: 'delete'
  })
}
/**
* 售卖/停售商品
* */
export function sellCommodity(data) {
  return request({
    url: `/commodity/sell?commodityId=${data.commodityId}&opType=${data.opType}`,
    method: 'put'
  })
}
