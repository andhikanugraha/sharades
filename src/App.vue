<template>
  <router-view/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({});
</script>

<style>
:root {
  --font-family-system: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol";
  --font-family-base: "Inter", var(--font-family-system);
  --font-size-base: 1rem;
  --font-size-secondary: calc(1.5 * var(--font-size-base));
  --font-size-tertiary: var(--font-size-base);

  --spacer: calc(var(--font-size-secondary) / 2);
  --color-background: #1a5d63;
  --color-background-dark: #154a4f;
  --color-background-darker: #0f373b;
  --color-foreground: #fef0d5;
  --color-primary: #00beb2;
  --color-primary-dark: #00a49a;
  --color-primary-darker: #008b82;
  --color-secondary: #d81e5b;
  --color-secondary-dark: #c21b52;
  --color-secondary-darker: #ab1848;
  --border-width: calc(0.2 * var(--spacer));
}

@font-face {
  font-family: "Inter";
  font-weight: 400;
  src: url("/fonts/Inter-Regular.woff2"), local("Inter");
}

@font-face {
  font-family: "Inter";
  font-weight: bold;
  src: url("/fonts/Inter-Bold.woff2"), local("Inter");
}

* {
  box-sizing: border-box;
  user-select: none;
}
html {
  height: 100%;
  background: var(--color-background);
  color: var(--color-foreground);
  font-family: var(--font-family-base);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  letter-spacing: -0.03em;
  line-height: 1;
  overscroll-behavior-y: contain;
}
body {
  margin: 0;
  height: 100%;
  background: var(--color-background);
}

#app {
  background: var(--color-background);
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  text-align: center;
}
#app::backdrop {
  background: var(--color-background);
}

.close-button,
.pull-left {
  position: absolute;
  left: 0;
  font-size: var(--font-size-secondary);
  padding: 0 calc(var(--spacer) * 2);
  color: var(--color-primary);
}
.close-button {
  color: var(--color-secondary);
}
.pull-right {
  position: absolute;
  right: 0;
  color: var(--color-primary);
  font-size: var(--font-size-secondary);
  padding: 0 calc(var(--spacer) * 2);
}
.pull-right svg {
  margin-left: calc(var(--spacer) * 2);
}

header {
  padding: calc(var(--spacer) * 2) var(--spacer);
  background: var(--color-background-dark);
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
}
nav p {
  padding: (var(--spacer) / 2);
}

@media (orientation: landscape) {
  nav {
    flex-direction: row-reverse;
  }
  header, nav {
    padding-left: calc(env(safe-area-inset-left) + (var(--spacer)));
    padding-right: calc(env(safe-area-inset-left) + (var(--spacer)))
  }
}
@media (orientation: portrait) {
  header {
    padding-top: calc(env(safe-area-inset-top) + (var(--spacer) * 2));
  }
  nav {
    flex-direction: column-reverse;
    padding-bottom: calc(env(safe-area-inset-bottom) + (var(--spacer) * 2));
  }
  nav button {
    padding: calc(var(--spacer) * 2) calc(var(--spacer));
  }
}

h1 {
  margin: 0;
  /* font-size will be dynamic using VFit */
}
h3 {
  margin: 0;
  font-size: var(--font-size-secondary);
}

#timer {
  color: var(--color-primary);
  font-weight: 400;
}

p {
  position: relative;
  margin: calc(var(--spacer) / 2);
  flex-basis: 0;
  flex-grow: 1;
  align-content: center;
}
main p {
  margin: var(--spacer);
  flex-grow: 0;
}

.item-delete {
  display: block;
  position: absolute;
  right: calc(var(--spacer) + var(--border-width));
  top: calc(var(--spacer) + var(--border-width));
  font-size: var(--font-size-secondary);
  color: var(--color-primary);
}

input:focus + .item-delete {
  color: var(--color-secondary);
}
button + .item-delete {
  color: var(--color-background-dark);
}

button {
  --button-color: var(--color-primary);
  --button-color-hover: var(--color-primary-dark);
  --button-color-focus: var(--color-primary-darker);
  display: block;
  width: 100%;
  padding: var(--spacer);
  font-family: var(--font-family-base);
  font-weight: bold;
  font-size: var(--font-size-secondary);
  line-height: 1;
  border: none;
  border-radius: calc((var(--spacer) * 2 + var(--font-size-secondary)) / 2);
  outline: none;
  touch-action: manipulation;
  cursor: pointer;
  -webkit-appearance: button;
  -webkit-tap-highlight-color: transparent;
  color: var(--color-foreground);
  background: var(--button-color);
}
button:hover {
  background-color: var(--button-color-hover);
}
button:active, button:focus {
  background-color: var(--button-color-focus);
  border: none;
  outline: 0;
}
button::-moz-focus-inner {
  border-style: none;
  padding: 0;
}
button .icon {
  margin-right: .2em;
}

#start, #correct {
  --button-color: var(--color-primary);
  --button-color-hover: var(--color-primary-dark);
  --button-color-focus: var(--color-primary-darker);
}
#skip, #reset, #random {
  --button-color: var(--color-secondary);
  --button-color-hover: var(--color-secondary-dark);
  --button-color-focus: var(--color-secondary-darker);
}
#create {
  --button-color: var(--color-background-dark);
  --button-color-hover: var(--color-background-darker);
  --button-color-focus: var(--color-background-darker);
}

.delete-button {
  color: var(--color-secondary);
}

input {
  user-select: text;
  display: block;
  width: 100%;
  font: inherit;
  font-size: var(--font-size-secondary);
  font-weight: bold;
  text-align: center;
  background: var(--color-background-dark);
  color: var(--color-foreground);
  border: var(--border-width) solid transparent;
  padding: var(--spacer);
  border-radius: 4vmax;
}
input:focus {
  outline: 0;
  background: var(--color-foreground);
  color: var(--color-background);
  border: var(--border-width) solid var(--color-primary);
}

main > div.scrollable {
  overflow-y: auto;
}

div.info {
  margin: calc(var(--spacer) * 2) 0;
}
div.info .label {
  font-size: var(--font-size-tertiary);
  color: var(--color-primary);
  padding-bottom: calc(var(--spacer) / 2);
}
div.info .value {
  font-weight: bold;
  font-size: calc(1.5 * var(--font-size-secondary));
}
div.info .option {
  display: inline-block;
  padding: 0 var(--spacer);
  color: var(--color-primary);
}
div.info .option.selected {
  color: var(--color-foreground);
}

ol {
  margin: 0 var(--spacer);
  column-width: calc(8 * var(--font-size-tertiary));
  column-gap: var(--spacer);
  list-style: none outside;
  padding: 0;
  font-size: var(--font-size-tertiary);
}
li {
  padding-bottom: var(--spacer);
  color: var(--color-primary);
  font-weight: bold;
  break-inside: avoid;
}
.correct {
  color: var(--color-foreground);
}

hr {
  box-sizing: content-box;
  height: 0;
  margin: var(--spacer);
  border: solid var(--color-background-dark);
  border-width: var(--border-width) 0 0 0;
}
</style>
