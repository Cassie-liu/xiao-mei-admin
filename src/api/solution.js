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

export function addSolution(data) {
  return request({
    url: '/solution/save',
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
 * 获取相关机构
 * */
export function getRelateOffice(params) {
  return request({
    url: '/solution/officeItems',
    method: 'GET',
    params
  })
}
