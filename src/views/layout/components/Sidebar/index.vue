<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  data() {
    return {
      permission_routes: []
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  watch: {
    permission_routes: {
      handler(curVal, oldVal) {
        this.$forceUpdate()
      }
    }
  },
  mounted() {
    const roleMaps = [
      'USER_MANAGEMENT',
      'CASE_REVIEW',
      'SOLUTION_MANAGEMENT',
      'COURSE_REGISTRATION',
      'COURSE_CONFIGURATION',
      'REGISTRATION_MANAGEMENT',
      'COMMODITY_MANAGEMENT',
      'SYSTEM_SETTING',
      'BANNER_SETTING',
      'COURSE_TYPE_CONFIGURATION',
      'DISEASE_CONFIGURATION',
      'HEALTH_CONFIGURATION',
      'HEALTH_RESULT_CONFIGURATION',
      'GOOD_FAULT_CONFIGURATION',
      'HEART_HEALTH_INTRO',
      'PHYSICAL_EXAM_INDEX_CONFIGURATION',
      'VERSION_UPDATE',
      'CASE_ENTRY',
      'OTHER_CONFIGURATION',
      'SYSTEM_OPERATION',
      'ACCOUNT_MANAGEMENT',
      'ROLE_MANAGEMENT'
    ]
    this.permission_routes = this.handleMenuPermission(this.routes, roleMaps)
    console.log(this.permission_routes)
  },
  methods: {
    handleMenuPermission(menus, permission) {
      for (const menu of menus) {
        if (!menu.hidden) {
          if (menu.hasOwnProperty('requiredPermission')) {
            if (permission.indexOf(menu.requiredPermission) === -1) {
              menu.hidden = true
            }
            if (menu.hasOwnProperty('children')) {
              this.handleMenuPermission(menu.children, permission)
            }
          }
        }
      }
      return menus
    }
  }
}
</script>
