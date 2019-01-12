import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Game from "./views/Game.vue";
import Edit from "./views/Edit.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/g/:encodedCategory",
      name: "game",
      component: Game
    },
    {
      path: "/g/:timeLimit/:encodedCategory",
      name: "game-time-limit",
      component: Game
    },
    {
      path: "/e/:encodedCategory",
      name: "edit",
      component: Edit
    }
  ]
});
