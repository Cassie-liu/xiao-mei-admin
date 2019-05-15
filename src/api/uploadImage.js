import request from '@/utils/request';


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
 * 删除图片
 * */
export function deleteImage(imageId) {
  return request({
    url: '/common/deleteImage/' + imageId,
    method: 'DELETE'
  })
}

