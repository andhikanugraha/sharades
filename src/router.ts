import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const Home = () => import(/* webpackChunkName: "home" */ './views/Home.vue');
const GameBuiltIn = () => import(/* webpackChunkName: "built-in" */ './views/GameBuiltIn.vue');
const GameByEncodedTopic = () => import(/* webpackChunkName: "by-string" */ './views/GameByEncodedTopic.vue');
const GameById = () => import(/* webpackChunkName: "by-id" */ './views/GameById.vue');
const Edit = () => import(/* webpackChunkName: "edit" */ './views/Edit.vue');

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/g/:encodedTopic',
    name: 'game',
    component: GameByEncodedTopic,
    props: true,
  },
  {
    path: '/b/:builtInTopicTitle',
    name: 'game-built-in',
    component: GameBuiltIn,
    props: true,
  },
  {
    path: '/u/:id',
    name: 'game-stored-topic',
    component: GameById,
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
