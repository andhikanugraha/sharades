<template>
  <router-view/>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import Font from 'fontfaceobserver-es';

export default defineComponent({
  setup() {
    onMounted(async () => {
      const font = new Font('Inter');
      await font.load();
      const app = document.getElementById('app');
      if (app) app.className = 'fonts-loaded';
    });
  },
});
</script>

<style>
:root {
  --font-family-system: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol";
  --font-family-base: var(--font-family-system);
  --font-size-base: 1rem;
  --font-size-primary: calc(1.6 * var(--font-size-base));
  --font-size-secondary: calc(1.2 * var(--font-size-base));
  --font-size-tertiary: var(--font-size-base);

  --spacer: calc(var(--font-size-secondary) / 2);
  --color-background: #1a5d63;
  --color-background-dark: #154a4f;
  --color-background-darker: hsla(185, 59%, 0%, 60%);
  --color-foreground: #fef0d5;
  --color-primary: #00beb2;
  --color-primary-dark: #00a49a;
  --color-primary-darker: #008b82;
  --color-secondary: #d81e5b;
  --color-secondary-dark: #c21b52;
  --color-secondary-darker: #ab1848;
  --border-width: calc(0.3 * var(--spacer));

  --border-radius: var(--spacer);
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
  min-height: 100%;
  flex-direction: column;
  text-align: center;
}
#app::backdrop {
  background: var(--color-background);
}
#app.fonts-loaded {
  --font-family-base: 'Inter', var(--font-family-system);
  font-family: var(--font-family-base);
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
  background: var(--color-background-darker);
  backdrop-filter: blur(5px);
  position: sticky;
  top: 0;
  z-index: 5;
}
main {
  display: flex;
  width: 100%;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  overflow: hidden;
}
nav {
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
  padding-bottom: var(--spacer)
}
nav p {
  padding: (var(--spacer) / 2);
}

#app:fullscreen {
  height: 100%;
}
#app:fullscreen header {
  position: relative;
  flex: 0;
}
#app:fullscreen main {
  position: relative;
  flex: 1;
}
#app:fullscreen .content {
  display: flex;
  height: 100%;
  overflow-y: scroll;
  justify-content: center;
  flex-direction: column;
}
#app:fullscreen nav {
  flex: 0;
}

@media (orientation: landscape) {
  nav {
    flex-direction: row-reverse;
  }
  header, nav {
    padding-left: calc(env(safe-area-inset-left) + (var(--spacer)));
    padding-right: calc(env(safe-area-inset-left) + (var(--spacer)));
  }
}
@media (orientation: portrait) {
  header {
    padding-top: calc(env(safe-area-inset-top) + (var(--spacer) * 2));
  }
  nav {
    flex-direction: column-reverse;
    padding-bottom: calc(env(safe-area-inset-bottom) + var(--spacer));
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
  margin: calc(var(--spacer) / 2);
  align-content: center;
}
main p {
  margin: var(--spacer);
  flex-grow: 0;
}
nav p {
  flex: 1;
}

button {
  --button-color: var(--color-primary);
  --button-color-hover: var(--color-primary-dark);
  --button-color-focus: var(--color-primary-darker);
  display: block;
  width: 100%;
  padding: calc(var(--spacer)) calc(var(--spacer) * 2);
  font-family: var(--font-family-base);
  font-weight: bold;
  font-size: var(--font-size-base);
  line-height: 1;
  border: none;
  border-radius: var(--border-radius);
  outline: none;
  touch-action: manipulation;
  cursor: pointer;
  -webkit-appearance: button;
  appearance: button;
  -webkit-tap-highlight-color: transparent;
  color: var(--color-foreground);
  background: var(--button-color);
  cursor: pointer;
}
nav button {
  padding: calc(var(--spacer) * 2);
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

svg[data-icon] {
  cursor: pointer;
}

#start, #correct {
  --button-color: var(--color-primary);
  --button-color-hover: var(--color-primary-dark);
  --button-color-focus: var(--color-primary-darker);
}
#skip, #reset, #random, button.destructive {
  --button-color: var(--color-secondary);
  --button-color-hover: var(--color-secondary-dark);
  --button-color-focus: var(--color-secondary-darker);
}

.delete-button {
  color: var(--color-secondary);
}

main.home {
  margin: 0 auto;
}
main.home .content {
  padding: calc(2 * var(--spacer)) 0;
}
#app:fullscreen main.home .content {
  display: block;
}
main.home .content > * {
  max-width: calc(60 * var(--font-size-base));
  margin-left: auto;
  margin-right: auto;
}
#create {
  color: var(--color-background-dark);
}
.topic-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: calc(var(--spacer) * 0.5) 0;
  margin-bottom: calc(-1 * var(--spacer));
  align-items: stretch;
  justify-content: center;
}
.topic-list p {
  width: 50%;
  padding: 0 calc(var(--spacer) * 0.5);
  margin: 0 0 var(--spacer);
}
.topic-list p button {
  height: 100%;
}
@media (min-width: 768px) {
  .topic-list p {
    width: 33.3%;
  }
}
@media (min-width: 1024px) {
  .topic-list p {
    width: 25%;
  }
}

main.editor {
  max-width: calc(30 * var(--font-size-base));
  margin: 0 auto;
  justify-content: flex-start;
}
main.editor p {
  position: relative;
}
input {
  user-select: text;
  display: block;
  width: 100%;
  font: inherit;
  font-size: var(--font-size-secondary);
  text-align: center;
  background: var(--color-background-dark);
  color: var(--color-foreground);
  border: var(--border-width) solid transparent;
  padding: var(--spacer);
  border-radius: var(--border-radius);
}
input:focus {
  outline: 0;
  border: var(--border-width) solid var(--color-primary);
}

span.item-delete {
  display: block;
  position: absolute;
  right: calc(var(--spacer) + var(--border-width));
  top: calc(var(--spacer) + var(--border-width));
  font-size: var(--font-size-secondary);
  color: var(--color-background);
}
input:focus + span.item-delete {
  visibility: visible;
  color: var(--color-primary);
}
button + span.item-delete {
  color: var(--color-background-dark);
}

.info {
  margin: calc(var(--spacer) * 2) 0;
}
.info .label {
  font-size: var(--font-size-tertiary);
  color: var(--color-foreground);
  padding-bottom: var(--spacer);
}
.info .value {
  font-weight: bold;
  font-size: var(--font-size-primary);
}
.info .option {
  display: inline-block;
  padding: 0 var(--spacer);
  color: var(--color-primary);
}
.info .option.selected {
  color: var(--color-foreground);
}

main.results .content {
  padding: calc(2 * var(--spacer)) var(--spacer);
}
main.results ol {
  list-style: none outside;
  margin: 0;
  padding: 0;
}
main.results li {
  display: inline-block;
  margin: 0 calc(var(--font-size-base));
  font-size: var(--font-size-secondary);
  margin-bottom: var(--font-size-base);
  color: var(--color-primary);
  text-decoration: line-through;
  font-weight: bold;
  break-inside: avoid;
}
main.results li:not(.correct)::before,
main.results li:not(.correct)::after {
  content: '\00a0';
}
main.results li.correct {
  color: var(--color-foreground);
  text-decoration: none;
}

hr {
  box-sizing: content-box;
  height: 0;
  margin: var(--spacer);
  border: solid var(--color-background-dark);
  border-width: var(--border-width) 0 0 0;
}
</style>
