import request from '@/utils/request';

export function getCaseList(params) {
  return request({
    url: '/audit/list',
    method: 'GET'
  })
}
