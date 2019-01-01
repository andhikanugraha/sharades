<template>
  <router-view/>
</template>

<script lang="ts">
import "typeface-fira-mono";
import Vue from "vue";
export default Vue;
</script>

<style lang="scss">
@import "/node_modules/normalize.css/normalize.css";

$font-family-monospace: "Fira Mono", monospace;
$font-family-base: $font-family-monospace;
$font-size-secondary: 3vmax;
$font-size-tertiary: 2vmax;
$font-size-base: $font-size-tertiary;

$spacer: $font-size-secondary / 2;
$color-background: #1a5d63;
$color-foreground: #fef0d5;
$color-primary: #00beb2;
$color-secondary: #d81e5b;

* {
  box-sizing: border-box;
  user-select: none;
}
html {
  height: 100%;
  background: $color-background;
  color: $color-foreground;
  font-family: $font-family-base;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1;
}
body {
  margin: 0;
  height: 100%;
}

.root {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  text-align: center;
}

header {
  padding: ($spacer * 2) 0;
}
main {
  position: relative;
  display: flex;
  width: 100%;
  flex-grow: 1;
  flex-basis: 0;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  overflow: hidden;
}
nav {
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
  padding: ($spacer / 2);

  @media (orientation: landscape) {
    flex-direction: row-reverse;
  }
  @media (orientation: portrait) {
    flex-direction: column;
  }
}

h1 {
  margin: 0;
  // font-size will be dynamic using VFit
}
h3 {
  margin: 0;
  font-size: $font-size-secondary;
}

#timer {
  color: $color-primary;
  font-weight: 400;
}

p {
  position: relative;
  margin: ($spacer / 2);
  flex-basis: 0;
  flex-grow: 1;
  align-content: center;

  main & {
    margin: 0;
    padding: ($spacer / 2);
    flex-grow: 0;
  }
}

@mixin btn($color) {
  background-color: $color;
  color: $color-foreground;

  &:hover {
    background-color: darken($color, 5%);
  }

  &:active,
  &:focus {
    background-color: darken($color, 10%);
    border: none;
  }
}

button {
  display: block;
  width: 100%;
  padding: $spacer;
  font-family: $font-family-base;
  font-weight: bold;
  font-size: $font-size-secondary;
  line-height: 1;
  border: none;
  border-radius: ($spacer * 2 + $font-size-secondary) / 2;
  outline: none;
  touch-action: manipulation;
  cursor: pointer;
  @include btn($color-primary);
  -webkit-tap-highlight-color: transparent;
}
#start,
#correct {
  @include btn($color-primary);
}
#skip,
#reset,
#random {
  @include btn($color-secondary);
}

input {
  user-select: text;
  display: block;
  width: 100%;
  font: inherit;
  font-size: 4vmax;
  text-align: center;
  background: $color-foreground;
  color: $color-background;
  border: 0.25vmax solid $color-primary;
  padding: 1.75vmax;
  border-radius: 4vmax;
}

main div {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
ol {
  margin: 0 $spacer;
  column-width: 8 * $font-size-tertiary;
  column-gap: $spacer;
  list-style: none outside;
  padding: 0;
  font-size: $font-size-tertiary;
}
li {
  padding-bottom: $spacer;
  color: $color-primary;
  font-weight: bold;
  break-inside: avoid;
}
.correct {
  color: $color-foreground;
}
</style>
