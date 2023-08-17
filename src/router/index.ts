import { createRouter, createWebHistory } from 'vue-router'
import UsersPage from '../views/UsersPage.vue'
import UserForm from '../views/UserForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      children: [
        {
          path: '',
          name: 'users',
          component: UsersPage
        },
        {
          path: 'user/create',
          name: 'userCreate',
          component: UserForm
        },
        {
          path: 'user/:id',
          name: 'userEdit',
          component: UserForm
        }
      ]
    }
  ]
})

export default router
