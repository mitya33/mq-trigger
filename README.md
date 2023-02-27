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

## Use with reactive JS

To follow...