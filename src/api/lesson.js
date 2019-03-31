import request from '@/utils/request';

/***
 * 获取课程
 * */
export function getCourseInfo(params) {
  return request({
    url: '/course/getCourseInfo',
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
