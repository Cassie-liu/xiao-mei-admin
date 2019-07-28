import request from '@/utils/request';

/**
 * 获取公司介绍
 * */
export function getCompanyIntro() {
  return request({
    url: '/companyProfile/getOne',
    method: 'GET'
  })
}
/**
 * 更新公司介绍
 * */
export function updateCompanyIntro(data) {
  return request({
    url: '/companyProfile/save',
    method: 'POST',
    data
  })
}
