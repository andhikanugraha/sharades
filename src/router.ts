import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const Home = () => import(/* webpackChunkName: "home" */ './views/Home.vue');
const BuiltInTopic = () => import(/* webpackChunkName: "built-in" */ './views/BuiltInTopic.vue');
const StoredTopic = () => import(/* webpackChunkName: "by-string" */ './views/StoredTopic.vue');
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
    component: StoredTopic,
    props: true,
  },
  {
    path: '/b/:builtInTopicTitle',
    name: 'game-built-in',
    component: BuiltInTopic,
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
