module.exports = [
  {
    id: 'USER_MANAGEMENT',
    label: '用户管理'
  },
  {
    id: 'CASE_REVIEW',
    label: '案例审核'
  },
  {
    id: 'SOLUTION_MANAGEMENT',
    label: '解决方案管理'
  },
  {
    id: 'COURSE_REGISTRATION',
    label: '课程报名',
    children: [
      {
        id: 'COURSE_CONFIGURATION',
        label: '课程配置'
      },
      {
        id: 'REGISTRATION_MANAGEMENT',
        label: '报名管理'
      }
    ]
  },
  {
    id: 'COMMODITY_MANAGEMENT',
    label: '商品管理'
  },
  {
    id: 'SYSTEM_SETTING',
    label: '系统设置',
    children: [
      {
        id: 'BANNER_SETTING',
        label: '轮播图设置'
      },
      {
        id: 'COURSE_TYPE_CONFIGURATION',
        label: '课程类型配置'
      },
      {
        id: 'DISEASE_CONFIGURATION',
        label: '疾病配置'
      },
      {
        id: 'HEALTH_CONFIGURATION',
        label: '养生配置'
      },
      {
        id: 'HEALTH_RESULT_CONFIGURATION',
        label: '养生成果配置'
      },
      {
        id: 'GOOD_FAULT_CONFIGURATION',
        label: '行善过失配置'
      },
      {
        id: 'HEART_HEALTH_INTRO',
        label: '爱心养生介绍'
      },
      {
        id: 'PHYSICAL_EXAM_INDEX_CONFIGURATION',
        label: '体检指标配置'
      },
      {
        id: 'VERSION_UPDATE',
        label: '版本更新'
      },
      {
        id: 'OTHER_CONFIGURATION',
        label: '其他配置'
      }
    ]
  },
  {
    id: 'SYSTEM_OPERATION',
    label: '系统运维',
    children: [
      {
        id: 'ACCOUNT_MANAGEMENT',
        label: '账号管理'
      },
      {
        id: 'ROLE_MANAGEMENT',
        label: '角色管理'
      }
    ]
  }
]
