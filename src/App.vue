<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
*, *:before, *:after {
  box-sizing: border-box;
}
html {
  height: 100%;
}
body {
  height: 100%;
  margin: 0;
}
#app {
  height: 100%;
  font-family: sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
