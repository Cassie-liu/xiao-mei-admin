import request from '@/utils/request';

/**
 * 案例录入
 * */

/**
 * 获取疾病
 * */
export function getDisease() {
  return request({
    url: '/case/getDisease',
    method: 'GET'
  })
}
/**
 * 获取养生
 * */
export function getHealth () {
  return request({
    url: '/case/getHealth',
    method: 'GET'
  })
}
/**
 * 获取体检指标
 * */
export function getHealthNormType() {
  return request({
    url: '/case/getHealthNormType',
    method: 'GET'
  })
}
/**
 * 获取治疗效果
 * */
export function getHealthResult() {
  return request({
    url: '/case/getHealthResult',
    method: 'GET'
  })
}
/**
 获取解决方案
 * */
export function getSolution() {
  return request({
    url: '/case/getSolution',
    method: 'GET'
  })
}
/**
 * 添加案例
 * */
export function addCaseEntry(data) {
  return request({
    url: '/case/caseEntry',
    method: 'POST',
    data
  })
}
/**
 * 修改案例
 * */
export function updateCaseEntry(data) {
  return request({
    url: '/audit/modifyCase',
    method: 'POST',
    data
  })
}
/**
 * 获取商品
 * */
export function getCommodity() {
  return request({
    url: '/case/commodity',
    method: 'GET'
  })
}

/**
 * 获取课程
 * */
export function getCourse() {
  return request({
    url: '/case/course',
    method: 'GET'
  })
}
