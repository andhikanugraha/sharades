<template>
  <router-view/>
</template>

<script lang="ts">
import "inter-ui";
import Vue from "vue";
export default Vue;
</script>

<style lang="scss">
@import "/node_modules/normalize.css/normalize.css";

$font-family-monospace: "Inter", monospace;
$font-family-base: $font-family-monospace;
$font-size-secondary: 3vmax;
$font-size-tertiary: 2vmax;
$font-size-base: $font-size-tertiary;

$spacer: $font-size-secondary / 2;
$color-background: #1a5d63;
$color-dark: darken($color-background, 5%);
$color-foreground: #fef0d5;
$color-primary: #00beb2;
$color-secondary: #d81e5b;
$border-width: 0.2 * $spacer;

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
  overscroll-behavior-y: contain;
}
body {
  margin: 0;
  height: 100%;
  background: $color-background;
}

.root {
  background: $color-background;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  text-align: center;
}

.close-button,
.pull-left {
  position: absolute;
  left: 0;
  font-size: $font-size-secondary;
  padding: 0 ($spacer * 2);
  color: $color-primary;
  &.close-button {
    color: $color-secondary;
  }
}
.pull-right {
  position: absolute;
  right: 0;
  color: $color-primary;
  font-size: $font-size-secondary;
  padding: 0 ($spacer * 2);
  svg {
    margin-left: ($spacer * 2);
  }
}

header {
  padding: ($spacer * 2) $spacer;
  background: darken($color-background, 5%);
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

  p {
    padding: ($spacer / 2);
  }

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
  // font-weight: normal;
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
    margin: $spacer;
    flex-grow: 0;
  }
}

.item-delete {
  display: block;
  position: absolute;
  right: $spacer + $border-width;
  top: $spacer + $border-width;
  font-size: $font-size-secondary;
  color: $color-primary;
  input:focus + & {
    color: $color-secondary;
  }
  button + & {
    color: $color-dark;
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
#create {
  @include btn($color-dark);
}

.delete-button {
  color: $color-secondary;
}

input {
  user-select: text;
  display: block;
  width: 100%;
  font: inherit;
  font-size: $font-size-secondary;
  font-weight: bold;
  text-align: center;
  background: darken($color-background, 5%);
  color: $color-foreground;
  border: $border-width solid transparent;
  padding: $spacer;
  border-radius: 4vmax;
  &:focus {
    background: $color-foreground;
    color: $color-background;
    border: $border-width solid $color-primary;
  }
}

main > div.scrollable {
  // position: absolute;
  // top: 0;
  // left: 0;
  // width: 100%;
  // height: 100%;
  overflow-y: auto;
}

div.info {
  margin: ($spacer * 2) 0;

  .label {
    font-size: $font-size-tertiary;
    color: $color-primary;
    padding-bottom: $spacer / 2;
  }
  .value {
    font-weight: bold;
    font-size: 1.5 * $font-size-secondary;
    .option {
      display: inline-block;
      padding: 0 $spacer;
      color: $color-primary;
      &.selected {
        color: $color-foreground;
      }
    }
  }
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

hr {
  margin: $spacer;
  border: solid $color-dark;
  border-width: $border-width 0 0 0;
}
</style>
