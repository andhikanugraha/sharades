import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const Home = () => import(/* webpackChunkName: "Home" */ '../views/Home.vue');
const Game = () => import(/* webpackChunkName: "Game" */ '../views/Game.vue');
const Edit = () => import(/* webpackChunkName: "Edit" */ '../views/Edit.vue');

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/g/:encodedTopic',
    name: 'game',
    component: Game,
    props: true,
  },
  {
    path: '/b/:builtInTopicTitle',
    name: 'game-built-in',
    component: Game,
    props: true,
  },
  {
    path: '/u/:id',
    name: 'game-stored-topic',
    component: Game,
    props: true,
  },
  {
    path: '/e',
    name: 'edit-new',
    component: Edit,
    props: true,
  },
  {
    path: '/e/:id',
    name: 'edit',
    component: Edit,
    props: true,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
