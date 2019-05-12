import request from '@/utils/request';

/**
 * 获取养生大类列表
 * */
export function getHealthList(params) {
  return request({
    url: '/health/list',
    method: 'get',
    params: params
  })
}
/**
 * 新增养生大类
 * */
export function addHealth(data) {
  return request({
    url: '/health/create',
    method: 'POST',
    data
  })
}

/**
 * 更新养生大类
 * */
export function updateHealth(data) {
  return request({
    url: '/health/modify',
    method: 'PUT',
    data
  })
}
/**
 * 删除养生大类
 * */
export function deleteHealth(id) {
  return request({
    url: '/health/' + id,
    method: 'DELETE'
  })
}
/**
 * 获取养生方式列表
 * */
export function getHealthWay(params) {
  return request({
    url: '/health/healthWay',
    method: 'GET',
    params
  })
}
/**
 * 新增养生方式列表
 * */
export function addHealthWay(data) {
  return request({
    url: '/health/healthWay',
    method: 'POST',
    data
  })
}
/**
 * 修改养生方式列表
 * */
export function updateHealthWay(data) {
  return request({
    url: '/health/healthWay',
    method: 'PUT',
    data
  })
}
/**
 * 删除养生方式列表
 * */
export function deleteHealthWay(id) {
  return request({
    url: '/health/healthWay/' + id,
    method: 'DELETE'
  })
}
/**
 * 获取体检指标
 * */
export function getHelthNormalType(params) {
  return request({
    url: '/journeyHealth/healthNormType',
    method: 'get',
    params: params
  })
}
/**
 * 新增或修改体检指标
 * */
export function updateHelthNormalType(data) {
  return request({
    url: '/journeyHealth/addOrUpdateHealthNormType',
    method: 'post',
    data
  })
}
/**
 * 删除体检指标
 * */
export function deleteHealthNormalType(data) {
  return request({
    url: '/journeyHealth/deleteHealthNormType',
    method: 'post',
    data
  })
}

