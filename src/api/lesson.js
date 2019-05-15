import request from '@/utils/request';

/***
 * 获取课程
 * */
export function getCourseInfo(params) {
  return request({
    url: '/course/list',
    method: 'GET',
    params: params
  })
}
/**
 * 上传图片
 * */
export function uploadSingleImage(params) {
  return request({
    url: '/common/uploadImage',
    method: 'POST',
    headers: {
      'Content-type': 'multipart/form-data'
    },
    data: params
  })
}
/**
 * 新增课程
 * */

export function addCourse(data) {
  return request({
    url: '/course/add',
    method: 'POST',
    data
  })
}
/**
 * 修改课程
 * */
export function updateCourse(data) {
  return request({
    url: '/course/modify',
    method: 'PUT',
    data
  })
}
/**
 * 删除课程
 * */
export function deleteCourse(id) {
  return request({
    url: '/course/delete/' + id,
    method: 'DELETE'
  })
}
/**
 * 获取课程报名类型
 * */
export function getCourseType() {
  return request({
    url: '/course/courseType',
    method: 'GET'
  })
}
/**
 * 获取课程类型列表
 * */
export function getCourseTypeList(params) {
  return request({
    url: '/course/type',
    method: 'GET',
    params
  })
}
/**
 * 新增课程类型
 * */
export function addCourseType(data) {
  return request({
    url: '/course/type',
    method: 'POST',
    data
  })
}
/**
 * 修改课程类型
 * */
export function updateCourseType(data) {
  return request({
    url: '/course/type',
    method: 'PUT',
    data
  })
}
/**
 * 删除课程类型
 * */
export function deleteCourseType(id) {
  return request({
    url: '/course/type/' + id,
    method: 'DELETE'
  })
}
