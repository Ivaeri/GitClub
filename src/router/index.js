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
      path: '/playerInGame/:id/:id2',
      name: 'playerInGameView',
      component: () => import('../views/playerInGameView.vue')
    },
    {
      path: '/lobby/',
      name: 'LobbyView:id',
      component: () => import('../views/LobbyView.vue')
    },
    {
      path: '/lobbyAll/:id',
      name: 'LobbyAllView',
      component: () => import('../views/LobbyAllView.vue')
    },
    {
      path:'/hostLobby/:id/:id2',
      name: 'lobbyForHost',
      component: () => import('../views/lobbyForHost.vue')

    },
    {
      path: '/inGameForHost/:id/:id2',
      name: 'inGameForHostView',
      component: () => import('../views/inGameForHostView.vue')

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
      path: '/winView/',
      name: 'WinView',
      component: () => import('../views/WinView.vue')
    },
    {
      path: '/lossView/',
      name: 'LossView',
      component: () => import('../views/LossView.vue')
    },
    {
      path: '/result/:id',
      name: 'ResultView',
      component: () => import('../views/ResultView.vue')
    }
  ]
});


export default router
