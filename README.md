# alpinejs-spring

A simple plugin that provides a utility for calculating spring-like motion. this was created by ripping out svelte's built-in motion library, and hooking it up to work with Alpine.

All contributions are welcome. To maintain this project one needs a certain level of understanding Alpine's inner workings and an understanding of spring animations, both of which I currently lack.

## Install

### With a CDN

```html
<script
  defer
  src="https://unpkg.com/alpinejs-spring@latest/dist/spring.min.js"
></script>

<script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### With a Package Manager

```shell
yarn add -D alpinejs-spring

npm install -D alpinejs-spring
```

```js
import Alpine from "alpinejs";
import spring from "alpinejs-spring";

Alpine.plugin(spring);

Alpine.start();
```

## Stats

![](https://img.shields.io/bundlephobia/min/alpinejs-spring)
![](https://img.shields.io/npm/v/alpinejs-spring)
![](https://img.shields.io/npm/dt/alpinejs-spring)
![](https://img.shields.io/github/license/markmead/alpinejs-spring)
