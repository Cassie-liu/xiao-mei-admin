import request from '@/utils/request';

/**
 * 获取举报类型列表
 * */
export function getReportTypeList (){
  return request({
    url: '/userReport/types',
    method: 'GET'
  })
}
/**
 * 获取举报类型列表
 * */
export function getReportData (data){
  return request({
    url: '/userReport/datas',
    method: 'POST',
    data
  })
}

/**
 * 获取举报审核明细
 * */
export function getReportDetail(id) {
  return request({
    url: `/userReport/detail/${id}`,
    method: 'GET'
  })
}

/**
 * 审核通过/驳回
 * */
export function reportCheck(data) {
  return request({
    url: '/userReport/check',
    method: 'POST',
    data
  })
}

/**
 * 获取已审核和待审核数量
 * */
export function getReportCount() {
  return request({
    url: '/userReport/counts',
    method: 'GET'
  })
}
