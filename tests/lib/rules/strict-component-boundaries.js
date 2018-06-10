const {RuleTester} = require('eslint');
const rule = require('../../../lib/rules/strict-component-boundaries');

const ruleTester = new RuleTester();
const parserOptions = {
  ecmaVersion: 6,
  sourceType: 'module',
};

const errors = [
  {
    type: 'ImportDeclaration',
    message: 'Strict component boundaries.',
  },
];

ruleTester.run('strict-component-boundaries', rule, {
  valid: [
    {code: `import {something} from './components';`, parserOptions},
    {
      code: `import {something} from 'components';`,
      parserOptions,
    },
  ],
  invalid: [
    {
      code: `import something from '../OtherComponent/any-path';`,
      parserOptions,
      errors,
    },
    {
      code: `import something from './components/SomeComponent';`,
      parserOptions,
      errors,
    },
    {
      code: `import something from './components/SomeComponent/any-path';`,
      parserOptions,
      errors,
    },
  ],
});
