# Prevent module imports between components. (strict-component-boundaries)

Components should have everything they need co-located in a single directory. This makes it easy to move components to a more appropriate spot, and makes it easy for future developers to find, understand, and update everything about a component in one place.

## Rule Details

This rule prevents developers from importing across component directories.

Examples of **incorrect** code for this rule:

```js
import {something} from './components/SomeComponent';
import something from './SomeComponent/anything';
```

Examples of **correct** code for this rule:

```js
import {somthing} from './components';
import something from 'utilities/anything';
```

## When Not To Use It

If you do not wish to enforce strict component boundaries, you can safely disable this rule.
