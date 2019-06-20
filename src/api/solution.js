import request from '@/utils/request';

/**
 * 获取相关课程option
 * */
export function getSolutionInfo(params) {
  return request({
    url: '/solution/courseItems',
    method: 'GET',
    params: params
  })
}
/**
 * 新增解决方案
 * */
export function addSolution(data) {
  return request({
    url: '/solution/save',
    method: 'POST',
    data
  })
}
/**
 * 更新解决方案
 * */
export  function updateSolution(data) {
  return request({
    url: '/solution/modify',
    method: 'POST',
    data
  })
}
/**
 * 获取解决方案列表
 * */
export function getSolutionList(data) {
  return request({
    url: '/solution/list',
    method: 'post',
    data
  })
}
/**
 * 查询单个解决方案
 * */
export function getSolutionById (id) {
  return request({
    url: '/solution/' + id,
    method: 'GET'
  })
}
/**
 * 获取相关机构
 * */
export function getRelateOffice(params) {
  return request({
    url: '/solution/officeItems',
    method: 'GET',
    params
  })
}
/**
 * 获取解决方案下拉框
 * */
export function getSolutionOptions() {
  return request({
    url: '/common/solutionOptions',
    method: 'GET'
  })
}
/**
 * 获取相关商品下拉框
 * */
export function getCommodityOptions() {
  return request({
    url: '/solution/commodities',
    method: 'GET'
  })
}
/**
 * 删除解决方案
 * */
export function deleteSolutionById(id) {
  return request({
    url: '/solution/' + id,
    method: 'DELETE'
  })
}
