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
/**
 * 获取养生日记
 * */
export function getDiaryList(data) {
  return request({
    url: '/audit/notes',
    method: 'post',
    data
  })
}
/**-
 * 重新审核案例
 * */
export function reReviewCase(id) {
  return request({
    url: '/audit/reReviewCase/' + id,
    method: 'post',
  })
}
/**-
 * 删除审核案例
 * */
export function deleteCaseInfo(id) {
  return request({
    url: '/audit/deleteCase/' + id,
    method: 'delete'
  })
}
/**
 * 编辑案例
 * */
export function editCaseInfo(id) {
  return request({
    url: '/audit/caseInfo/' + id,
    method: 'get'
  })
}
