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
