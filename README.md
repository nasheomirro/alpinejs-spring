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
<div x-data="{ width: $spring(0) }"></div>
```

The initial value can be a number, an object, or an array, as long as all the object properties or array values are numbers:

```html
<div x-data="{ ball: $spring({ x: 0, y: 0 }) }"></div>
```

You can access the current value of the spring by using `[key].value`:

```html
<div x-data="{ width: $spring(0) }">
  <div :style="{ width: Math.abs(width.value) + 'px' }"></div>
</div>

<div x-data="{ ball: $spring({ x: 0, y: 0 }) }">
  <div :style="{ left: ball.value.x + 'px', top: ball.value.y + 'px' }"></div>
</div>
```

### Setting the value

To set the value, just call `[key].set()` and pass it the target value the spring should animate towards:

```html
<div
  x-data="{ width: $spring(0) }"
  @mousemove="width.set($event.clientX - $el.getBoundingClientRect().x)"
>
  <div :style="{ width: Math.abs(width.value) + 'px' }"></div>
</div>
```

You can also pass a second argument to tell the spring how you want it animated:

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

#### Updating non-primitives

To update objects or arrays, always pass the full object with all the expected keys:

```html
<button @click="ball.set({ x: 0, y: 0 })">reset</button>

<!-- will not work -->
<button @click="ball.set({ x: 0 })">reset</button>
```

💡 _Currently thinking of allowing partial updates, I'm leaning on just doing it shallowly, so nested objects still have to be given the full object. But in the meantime I don't see it as much of a nuisance, feel free to put up an issue if you'd like this feature._

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

You can also edit these properties after initialization. These properties are accessible through `[key].[property]`:

```html
<!-- 0 is exclusive, unless you want it to infinitely slide or never move! -->
<input type="range" min="0.01" max="1" step="0.01" x-model="width.stiffness" >
<input type="range" min="0.01" max="1" step="0.01" x-model="width.damping" >
<input type="range" min="0.01" max="1" step="0.01" x-model="width.precision" >
```

## Pitfalls

### Values can go to the negatives

While animating, a spring value can go into negative values even when the target value is not. This might cause a problem when you're trying to animate a value you expect to be positive, for example the `width` of an element cannot be negative.

### Usage with `Alpine.data()`

You can get access to the `$spring` magic by using a normal function instead of an arrow function:

```js
Alpine.data("collapsable", function () {
  return {
    height: this.$spring(0);
  }
});
```

## Stats

![](https://img.shields.io/bundlephobia/min/alpinejs-spring)
![](https://img.shields.io/npm/v/alpinejs-spring)
![](https://img.shields.io/npm/dt/alpinejs-spring)
