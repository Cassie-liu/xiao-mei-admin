import request from '@/utils/request';

/**
 * 获取疾病大类
 * */
export function getMajorDisease (params) {
  return request({
    url: '/disease/majorClass',
    method: 'get',
    params: params
  })
}
/**
 * 新增疾病大类
 * */
export function addMajorDisease (data) {
  return request({
    url: '/disease/addMajorClass',
    method: 'post',
    data
  })
}
/**
 * 修改疾病大类
 * */
export function updateMajorDisease(data) {
  return request({
    url: '/disease/updateMajorClass',
    method: 'post',
    data
  })
}
/**
 * 删除疾病大类
 * */
export  function deleteMajorDisease(id) {
  return request({
    url: '/disease/deleteDiseaseClass/' + id,
    method: 'post'
  })
}
/**
 * 获取疾病类目明细
 * */
export function getDiseaseDetail(params) {
  return request({
    url: '/diseaseDetail/majorDetails',
    method: 'get',
    params: params
  })
}
/**
 * 获取疾病类目
 * */
export function getDiseaseMajorCategory() {
  return request({
    url: '/diseaseDetail/majorClass',
    method: 'get'
  })
}
/**
 * 新增疾病小类
 * */
export function addDiseaseDetail(data) {
  return request({
    url: '/diseaseDetail/saveDiseaseDetail',
    method: 'post',
    data
  })
}
/**
 * 修改疾病小类
 * */
export function updateDiseaseDetail(data) {
  return request({
    url: '/diseaseDetail/updateDiseaseDetail',
    method: 'put',
    data
  })
}
/**
 * 修改疾病小类
 * */
export function deleteDiseaseDetail(id) {
  return request({
    url: '/diseaseDetail/deleteDiseaseDetail/' + id,
    method: 'delete'
  })
}
