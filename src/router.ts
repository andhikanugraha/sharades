import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("./views/Home.vue"),
    },
    {
      path: "/g/:encodedTopic",
      name: "game",
      component: () => import("./views/Game.vue"),
      props: true,
    },
    {
      path: "/b/:builtInTopicTitle",
      name: "game-built-in",
      component: () => import("./views/Game.vue"),
      props: true,
    },
    {
      path: "/u/:id",
      name: "game-stored-topic",
      component: () => import("./views/Game.vue"),
      props: true,
    },
    {
      path: "/e",
      name: "edit-new",
      component: () => import("./views/Edit.vue"),
      props: true,
    },
    {
      path: "/e/:id",
      name: "edit",
      component: () => import("./views/Edit.vue"),
      props: true,
    },
  ],
});
