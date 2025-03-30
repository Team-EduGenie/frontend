import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StudentLogin from '@/views/StudentLogin.vue'
import StudentSignin from '@/views/StudentSignin.vue'
import StudentManage from '../views/StudentManage.vue'
import StudentMenu from '@/views/StudentMenu.vue'
import Quiz from '@/views/Quiz.vue'
import StudentDashboard from '@/views/StudentDashboard.vue'
import Group from '@/views/Group.vue'
import GroupManage from '@/views/GroupManage.vue'
import Exam from '@/views/Exam.vue'
import SubjectGroupSelect from '@/views/SubjectGroupSelect.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/signup',
      name: 'signup',
      component: StudentSignin
    },
    {
      path: '/students',
      name: 'students',
      component: StudentManage
    },
    {
      path: '/studentlogin',
      name: 'studentlogin',
      component: StudentLogin
    },
    {
      path: '/studentmenu',
      name: 'studentmenu',
      component: StudentMenu
    },
    {
      path: '/quiz',
      name: 'quiz',
      component: Quiz
    },
    {
      path: '/student-dashboard',
      name: 'student-dashboard',
      component: StudentDashboard
    },
    {
      path: '/group',
      name: 'group',
      component: Group
    },
    {
      path: '/group-manage',
      name: 'group-manage',
      component: GroupManage
    },
    {
      path: '/exam',
      name: 'exam',
      component: Exam
    },
    {
      path: '/subject-group-select',
      name: 'subject-group-select',
      component: SubjectGroupSelect
    }
  ]
})

export default router

//path는 주소창에 입력하는 경로
//name은 라우터의 이름
//component는 해당 경로에 매핑될 컴포넌트