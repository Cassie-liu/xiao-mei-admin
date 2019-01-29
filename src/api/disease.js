import request from '@/utils/request';

export function getMajorDisease (params) {
  return request({
    url: '/disease/majorClass',
    method: 'get',
    params: params
  })
}
export function addMajorDisease (data) {
  return request({
    url: '/disease/addMajorClass',
    method: 'post',
    data
  })
}
export function updateMajorDisease(data) {
  return request({
    url: '/disease/updateMajorClass',
    method: 'post',
    data
  })
}
export  function deleteMajorDisease(id) {
  return request({
    url: '/disease/deleteDiseaseClass/' + id,
    method: 'post'
  })
}
