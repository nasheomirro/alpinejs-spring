# alpinejs-spring

A simple plugin that provides a utility for calculating spring-like motion. This was created by yoinking svelte's built-in motion library, and hooking it up to work with Alpine.

All contributions are welcome. To maintain this project one needs a certain level of understanding Alpine's inner workings and an understanding of spring animations, both of which I currently lack. 🤷

[Try it out here!](https://codepen.io/shanuthrii/pen/MWROjqW)

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

## Usage

The plugin gives you a magic function `$spring`, this function would give you an object in which you can get and set the current values of the spring as well as it's configuration. To use this function simply pass it an initial value:

```html
<div
  x-data="{ width: $spring(0) }"
  @mousemove="width.set($event.clientX / $el.offsetWidth * 100)"
>
  <div :style="{ width: Math.abs(width.value) + 'px' }"></div>
</div>
```

you can access the current value of the spring by using `[key].value`, and you can tell it to animate towards a target value by calling `[key].set()`.

### Customizing the "springiness"

You can pass a second argument to `$spring` which will dictate the "springiness" of the values:

```html
<div
  x-data="{ width: $spring(0, { stiffness: 0.5, damping: 0.3, precision: 0.01 }) }"
></div>
```

Each property expects a number between 0 to 1, you don't have to provide all the values, just the ones you want changed. Each property has a default value assigned.

- `stiffness:` determines the "tightness" of the spring, where higher is tighter. Defaults to `0.15`
- `damping:` determines how springy the spring is, the lower the value, the springier. Defaults to `0.8`
- `precision:` determines how precise the spring will animate towards the target value, the lower the more precise. Defaults to `0.01`

You can also edit these properties after initialization. These properties are accessible through `[key].[property]`.

### Setting the value

To set the value, just call `[key].set()` and pass it the target value the spring should animate towards. You can also pass a second argument to tell the spring how you want it animated:

```html
<button @click="width.set(0, { hard: true })">reset</button>
<button @click="width.set(0, { soft: true })">reset</button>
<button @click="width.set(0, { soft: 0.5 })">reset</button>
```

if you want to set the value immediately then you can pass `{ hard: true }`. If you want the spring to preserve existing momentum before making the change you can pass `{ soft: n }`, where `n` is the number of seconds it preserves existing momentum, if this value is `true` it will default to `0.5` seconds.

#### using the update() function

You can also use the `[key].update()` function to set the values, but instead of passing a value, you pass a callback. This callback will be passed two arguments, the current target value and the current value, this is helpful when you want to know what the spring is currently animating towards:

```js
// this updates `width.value` to half of the target value instantly.
this.width.update((target, value) => target / 50, { hard: true });
```

## Pitfalls

### Values can go to the negatives

While animating, a spring value can go into negative values even when the target value is not. This might cause a problem when you're trying to animate a value you expect to be positive, for example the `width` of an element cannot be negative.

### Usage with `Alpine.data()`

You can get access to the `$spring` magic by using a normal function instead of an arrow function:

```js
Alpine.data("collapsable", function () {
  height: this.$spring(0);
});
```

## Stats

![](https://img.shields.io/bundlephobia/min/alpinejs-spring)
![](https://img.shields.io/npm/v/alpinejs-spring)
![](https://img.shields.io/npm/dt/alpinejs-spring)
