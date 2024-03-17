// router/index.js
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Popup',
    redirect: '/welcome',
    component: () => import('../Popup.vue'),
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: () => import('../components/Welcome.vue'),
  },
  {
    path: '/getdanmu',
    name: 'Getdanmu',
    component: () => import('../components/DanmuFunctions.vue'),
  },
  {
    path: '/sentianalysis',
    name: 'SentiAnalysis',
    component: () => import('../components/SentimentAnalysis.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
