import Vue from "vue";
import Router from "vue-router";
import Nokia from "@/components/Nokia"

Vue.use(Router)

var userRightVos = JSON.parse(sessionStorage.getItem('userRightVos'))
// console.log('router====>', userRightVos)

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      redirect: "/nokia"
    },
    {
      meta: {
        requireAuth: true // ���ô���������ҳ��ǰ�ж��Ƿ���Ҫ��½
      },
      path: "/nokia",
      component: Nokia
    },
    
  ]
});
