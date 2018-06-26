<template>
  <router-view/>
</template>

<script lang="ts">
import 'typeface-fira-mono';
import Vue from 'vue';
export default Vue;
</script>

<style lang="scss">
$font-family-monospace: 'Fira Mono', monospace;
$font-family-base: $font-family-monospace;
$font-size-base: 1rem !default;

/*! normalize.css v8.0.0 | MIT License | github.com/necolas/normalize.css */

/* Document
   ========================================================================== */

/**
 * 1. Correct the line height in all browsers.
 * 2. Prevent adjustments of font size after orientation changes in iOS.
 */

html {
  font-family: $font-family-base;
  line-height: 1.15; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
}

/* Sections
   ========================================================================== */

/**
 * Remove the margin in all browsers.
 */

body {
  margin: 0;
}

/**
 * Correct the font size and margin on `h1` elements within `section` and
 * `article` contexts in Chrome, Firefox, and Safari.
 */

h1 {
  font-size: 2em;
  margin: 0.67em 0;
}

/* Text-level semantics
   ========================================================================== */

/**
 * Remove the gray background on active links in IE 10.
 */

a {
  background-color: transparent;
}

/**
 * Add the correct font weight in Chrome, Edge, and Safari.
 */

b,
strong {
  font-weight: bolder;
}

/* Embedded content
   ========================================================================== */

/**
 * Remove the border on images inside links in IE 10.
 */

img {
  border-style: none;
}

/* Forms
   ========================================================================== */

/**
 * 1. Change the font styles in all browsers.
 * 2. Remove the margin in Firefox and Safari.
 */

button,
input,
optgroup,
select,
textarea {
  font-family: inherit; /* 1 */
  font-size: 100%; /* 1 */
  line-height: 1.15; /* 1 */
  margin: 0; /* 2 */
}

/**
 * Show the overflow in IE.
 * 1. Show the overflow in Edge.
 */

button,
input { /* 1 */
  overflow: visible;
}

/**
 * Remove the inheritance of text transform in Edge, Firefox, and IE.
 * 1. Remove the inheritance of text transform in Firefox.
 */

button,
select { /* 1 */
  text-transform: none;
}

/**
 * Correct the inability to style clickable types in iOS and Safari.
 */

button,
[type="button"],
[type="reset"],
[type="submit"] {
  -webkit-appearance: button;
}

/**
 * Remove the inner border and padding in Firefox.
 */

button::-moz-focus-inner,
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner {
  border-style: none;
  padding: 0;
}

/**
 * Restore the focus styles unset by the previous rule.
 */

button:-moz-focusring,
[type="button"]:-moz-focusring,
[type="reset"]:-moz-focusring,
[type="submit"]:-moz-focusring {
  outline: 1px dotted ButtonText;
}

/**
 * Add the correct vertical alignment in Chrome, Firefox, and Opera.
 */

progress {
  vertical-align: baseline;
}

/**
 * Remove the default vertical scrollbar in IE 10+.
 */

textarea {
  overflow: auto;
}

*, *:before, *:after {
  box-sizing: border-box;
}
html {
  height: 100%;
  color: #FEF0D5;
  background: #1A5D63;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body {
  height: 100%;
}


$spacer: 2vmax;
$font-size-secondary: 4vmax;
$font-size-tertiary: 3vmax;
$white: #FEF0D5;
$red: #D81E5B;
$primary: #00BEB2;

.root {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  text-align: center;
}

h3 {
  font-size: $font-size-secondary;
  margin: ($spacer * 2) 0;
}

main {
  position: relative;
  display: flex;
  width: 100%;
  overflow-y: auto;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  align-content: center;
}

h1 {
  margin: 0;
  height: auto;
  line-height: 1;
  font-weight: bold;
}

#timer {
  color: $primary;
  font-weight: 400;
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

p {
  position: relative;
  margin: ($spacer / 2);
  flex-grow: 1;
  align-content: center;
}

main p {
  margin: $spacer ($spacer * 3);
  flex-grow: 0;
}

@mixin btn($color) {
  background-color: $color;
  color: $white;

  &:hover {
    background-color: darken($color, 5%);
  }

  &:active, &:focus {
    background-color: darken($color, 10%);
  }
}

button {
  font-weight: bold;
  display: block;
  width: 100%;
  font-size: $font-size-secondary;
  line-height: 1;
  border-radius: ($spacer * 2 + $font-size-secondary) / 2;
  padding: $spacer;
  border: none;
  cursor: pointer;
  @include btn($primary);
}

#start, #correct {
  @include btn($primary);
}
#skip, #reset {
  @include btn($red);
}

main div {
  height: 100%;
}
ol {
  margin: 0 ($spacer * 2);
  column-width: 8 * $font-size-tertiary;
  column-gap: $spacer * 2;
  list-style: none outside;
  padding: 0;
  font-size: $font-size-tertiary;
}
li {
  padding-bottom: $spacer;
  color: $primary;
  font-weight: bold;
  break-inside: avoid;
}
.correct {
  font-weight: bold;
  color: $white;
}

</style>
