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
