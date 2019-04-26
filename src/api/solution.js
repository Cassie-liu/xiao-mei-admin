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
export function getSolutionList(params) {
  return request({
    url: '/solution/list',
    method: 'GET',
    params
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
