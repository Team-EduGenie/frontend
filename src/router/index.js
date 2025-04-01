import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StudentLogin from '../views/StudentLogin.vue'
import StudentSignin from '../views/StudentSignin.vue'
import StudentMenu from '../views/StudentMenu.vue'
import StudentDashboard from '../views/StudentDashboard.vue'
import GroupCreate from '../views/GroupCreate.vue'
import Exam from '@/views/Exam.vue'
import ProblemCreate from '@/views/ProblemCreate.vue'
import GroupMenu from '../views/GroupMenu.vue'
import GroupParticipate from '../views/GroupParticipate.vue'
import ExamResult from '../views/ExamResult.vue'
import ManagerDashboard from '../views/ManagerDashboard.vue'
import GroupChoice from '../views/GroupChoice.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/studentlogin',
      name: 'studentlogin',
      component: StudentLogin
    },
    {
      path: '/studentsignin',
      name: 'studentsignin',
      component: StudentSignin
    },
    {
      path: '/studentmenu',
      name: 'studentmenu',
      component: StudentMenu
    },
    {
      path: '/student-dashboard',
      name: 'student-dashboard',
      component: StudentDashboard
    },
    {
      path: '/group',
      name: 'group',
      component: GroupCreate
    },
    {
      path: '/exam',
      name: 'exam',
      component: Exam
    },
    {
      path: '/problem-create',
      name: 'problem-create',
      component: ProblemCreate
    },
    {
      path: '/group-menu',
      name: 'group-menu',
      component: GroupMenu
    },
    {
      path: '/join-group',
      name: 'join-group',
      component: GroupParticipate
    },
    {
      path: '/exam-result',
      name: 'exam-result',
      component: ExamResult
    },
    {
      path: '/managerdashboard',
      name: 'ManagerDashboard',
      component: ManagerDashboard
    },
    {
      path: '/group-choice',
      name: 'group-choice',
      component: GroupChoice
    }
  ]
})

export default router

//path는 주소창에 입력하는 경로
//name은 라우터의 이름
//component는 해당 경로에 매핑될 컴포넌트