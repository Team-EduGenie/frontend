import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StudentLogin from '@/views/StudentLogin.vue'
import StudentSignin from '@/views/StudentSignin.vue'
import StudentManage from '../views/StudentManage.vue'
import TeacherMenu from '../views/TeacherMenu.vue'
import StudentMenu from '@/views/StudentMenu.vue'
import Unit from '@/views/Unit.vue'
import Quiz from '@/views/Quiz.vue'
import StudentDashboard from '@/views/StudentDashboard.vue'
import TeacherSubject from '../views/TeacherSubject.vue'
import Subject from '../views/Subject.vue'
import DailyQuiz from '@/views/DailyQuiz.vue'
import PointShop from '@/views/PointShop.vue'

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
      path: '/teachermenu',
      name: 'teachermenu',
      component: TeacherMenu
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
      path: '/subject',
      name: 'subject',
      component: Subject
    },
    {
      path: '/unit',
      name: 'unit',
      component: Unit
    },
    {
      path: '/quiz',
      name: 'quiz',
      component: Quiz
    },
    {
      path: '/teachersubject',
      name: 'teachersubject',
      component: TeacherSubject
    },
    {
      path: '/student-dashboard',
      name: 'student-dashboard',
      component: StudentDashboard
    },
    {
      path: '/daily-quiz',
      name: 'daily-quiz',
      component: DailyQuiz
    },
    {
      path: '/point-shop',
      name: 'point-shop',
      component: PointShop
    }
  ]
})

export default router

//path는 주소창에 입력하는 경로
//name은 라우터의 이름
//component는 해당 경로에 매핑될 컴포넌트