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
  {
    path: '/themeanalysis',
    name: 'ThemeAnalysis',
    component: () => import('../components/ThemeAnalysis.vue'),
  },
  {
    path: '/keywordsanalysis',
    name: 'keywordsAnalysis',
    component: () => import('../components/keywordsAnalysis.vue'),
  },
  {
    path: '/timeanalysis',
    name: 'timeAnalysis',
    component: () => import('../components/TimeAnalysis.vue'),
  },
  {
    path: '/dateanalysis',
    name: 'dateAnalysis',
    component: () => import('../components/DateAnalysis.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
