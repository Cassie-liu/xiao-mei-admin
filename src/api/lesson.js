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
