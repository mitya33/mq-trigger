# mq-trigger

Media Query Trigger is a tiny JS utility to get notified when a CSS media query becomes matching or non-matching.

It's particularly useful for bridging two forms of reactivity - media queries and reactive JS frameworks, such that stateful data can be updated when CSS variables are updated by media queries.

## Examples

**Example 1**: Listen for all media queries to change their matching vs. non-matching state and log the result.

```
document.addEventListener('mqChange', evt => {
    const status = evt.detail.matches ? 'matches' : 'fails to match';
    console.log(`
        Query with constraints "${evt.detail.query}" is now ${status}
    `);
});
mqTrigger();
```

**Example 2:** Listen for a particular CSS variable to be updated by media queries as they match or fail to match.

HTML:

```
<p></p>
```

CSS:

```
@media (max-width: 700px) {
    p { --foo: 1; }
}
@media (min-width: 701px) and (max-width: 800px) {
    p { --foo: 2; }
}
@media (min-width: 801px) {
    p { --foo: 3; }
}
```

JS:

```
const p = document.querySelector('p');
p.addEventListener('mqChange', evt =>
    p.textContent = evt.detail.vars.foo
);
```

## Usage

Install MQT via NPM or Yarn:

```
npm install mq-trigger
#or
yarn mq-trigger
```

Import via:

```
import { mqTrigger } from 'mq-trigger'
```

MQT is then used by first binding an `mqChange` event to an element, and then calling `mqTrigger(element, filter, stylesheet)`. All arguments are optional, and work as follows:

- `element` (element reference) - the element to scope MQT to. If omitted, this will be `document`. Useful when working with components in reactive frameworks.
- `filter` (array) - an array of strings with which to filter media queries, e.g. `["700px"]` will consider only media queries whose constraint(s) mention "700px". Only matching media queries will be considered. Useful where the DOM contains a great many CSS sheets and it may impact performance to apply MQT to all of them.
- `stylesheet` (stylesheet object) - a specific stylesheet object for MQT to use, rather than iterating over all the stylesheets under `document.stylesheets`. Again, useful if the DOM contains many attached stylesheets.

The event will fire once on page load (for initial setup) and then again whenever relevant media queries change state.

The event callback is passed an event object, which contains a sub-object, `detail`, containing:

- `query` (string) - the constraint text of the media query whose status changed
- `matches` (bool) - the media query's status - true if currently matches, false if it doesn't
- `vars` (obj) - a map of CSS variable names to values present on the element to which MQT was scoped (see `element` argument above)

Note: CSS variables are reported in `vars` without the `--` prefix e.g. `--myCSSVar` becomes the property `myCSSVar`.

## Use with reactive JS

MQT can be particularly useful when used with a reactive JavaScript framework such as Vue. This is because it can bridge between the reactivity of the framework and the reactivity of media queries.

Consider a Vue component that uses a carousel child component (example). The number of carousel slides visible at any one time is controlled by a prop passed to the carousel, `:items-to-show`, which we'll bind to a component ref, `itemsToShow`.

We want our carousel to be responsive, and so as the screen width changes, we want to change this number.

```
<template>
    <div class='container' ref='container'>
        <carousel :items-to-show='' :data='data' />
    </div>
</template>

<script setup>

//prep
import { ref } from 'vue';
import { mqTrigger } from 'mq-trigger'

//set up itemsToShow ref - data set later by mqTrigger callback
const itemsToShow = ref(null);

//set up container ref, to scope MQT to the container element
const container = ref(null);
mqTrigger(form.value);

//set up MQT
container.value.addEventListener('mqChange', evt => {
    itemsToShow.value = parseInt(evt.detail.vars.itemsToShow);
});
mqTrigger(container.value);
</script>

<style scoped>
.container { --itemsToShow: 4; }
@media (max-width: 800px) {
    .container { --itemsToShow: 3; }
}
@media (max-width: 600px) {
    .container { --itemsToShow: 2; }
}
</style>
```

Et voila! Now our carousle is responsive, and we don't have to listen to window.onresize events in JavaScript to make it so!

## Like this?

If I've helped you, consider being amazing and [buying me a coffee](https://ko-fi.com/mitya) - thank you!