import request from '@/utils/request';

/**
 * 获取案例审核列表
 * @audit 是否审核
 *      0 --- 未审核
 *      1 --- 已审核
 * @recoverCase  是否评为案例
 *      0 --- 不是
 *      1 --- 是
 * */
export function getCaseList(params) {
  return request({
    url: '/audit/list',
    method: 'GET',
    params
  })
}

/**
 * 案例审核
 * */
export function doAuditforCase(data) {
  return request({
    url: '/audit/doAudit',
    method: 'POST',
    data
  })
}
