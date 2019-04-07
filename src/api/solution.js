import request from '@/utils/request';

/**
 * 获取相关课程option
 * */
export function getSolutionInfo(params) {
  return request({
    url: '/solution/courseItems',
    method: 'GET',
    params: params
  })
}

export function addSolution(data) {
  return request({
    url: '/solution/save',
    method: 'POST',
    data
  })
}
