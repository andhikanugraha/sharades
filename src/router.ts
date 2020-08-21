import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const Home = () => import('./views/Home.vue');
const BuiltInTopic = () => import('./views/BuiltInTopic.vue');
const StoredTopic = () => import('./views/StoredTopic.vue');
const NewTopic = () => import('./views/NewTopic.vue');
const Edit = () => import('./views/Edit.vue');

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
    component: NewTopic,
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
