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
      component: () => import('../views/playerInGameView.vue'),
      beforeEnter: (to, from, next) => {
        next();
      }
      },
      {
        path: '/inGameForHost/:id/:id2/:id3',
        name: 'inGameForHostView',
        component: () => import('../views/inGameForHostView.vue'),
        beforeEnter: (to, from, next) => {
          next();
        }
        },
    
    {
      path: '/lobby/',
      name: 'LobbyView:id',
      component: () => import('../views/LobbyView.vue')
    },
    {
      path: '/lobbyAll/:id/:id2',
      name: 'LobbyAllView',
      component: () => import('../views/LobbyAllView.vue')
    },
    {
      path:'/hostLobby/:id/:id2/:id3',
      name: 'lobbyForHost',
      component: () => import('../views/lobbyForHost.vue')

    },

    {
      path: '/submitword/',
      name: 'WordSubmission',
      component: () => import('../views/WordSubmission.vue')

    },
    {
      path: '/winView/:id/:id2',
      name: 'WinView',
      component: () => import('../views/WinView.vue'),
      beforeEnter: (to, from, next) => {
        next();
      }
    },
    {
      path: '/lossView/:id/:id2',
      name: 'LossView',
      component: () => import('../views/LossView.vue')
    },
    
    {
    path: '/ChooseNewWord/:id/:id2/',
    name: 'ChooseNewWord',
    component: () => import('../views/ChooseNewWord.vue')
    }
  ]
});


export default router
