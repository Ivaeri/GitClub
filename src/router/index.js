import { createRouter, createWebHistory } from 'vue-router'
import StartView from '../views/StartView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Start',
      component: StartView
    },
      {
      path: '/poll/:id',
      name: 'PollView',
      component: () => import('../views/PollView.vue')
    },
    {
      path: '/lobby/',
      name: 'LobbyView:id',
      component: () => import('../views/LobbyView.vue')
    },
    {
      path: '/lobbyAll/',
      name: 'LobbyAllView',
      component: () => import('../views/LobbyAllView.vue')
    },
    {
      path:'/hostLobby/',
      name: 'lobbyForHost',
      component: () => import('../views/lobbyForHost.vue')

    },
    {
      path: '/create/',
      name: 'CreateView',
      component: () => import('../views/CreateView.vue')
    },
    {
      path: '/submitword/',
      name: 'WordSubmission',
      component: () => import('../views/WordSubmission.vue')

    },
    {
      path: '/result/:id',
      name: 'ResultView',
      component: () => import('../views/ResultView.vue')
    }
  ]
});


export default router
