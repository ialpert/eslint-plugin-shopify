const {RuleTester} = require('eslint');
const rule = require('../../../lib/rules/jsx-prefer-fragment-wrappers');

const ruleTester = new RuleTester();
const parserOptions = {ecmaVersion: 9, ecmaFeatures: {jsx: true}};

function errorWithTagName(tagName) {
  return [
    {
      type: 'JSXElement',
      message: `replace wrapping ${tagName} with fragment shorthand`,
    },
  ];
}

ruleTester.run('jsx-prefer-fragment-wrappers', rule, {
  valid: [
    {code: '<div className={className}>{foo}{bar}<Baz /></div>', parserOptions},
    {code: '<div><Bar /></div>', parserOptions},
    {code: '<Foo><Bar /><Baz /></Foo>', parserOptions},
    {code: '<Foo>{someFunction()}</Foo>', parserOptions},
    {code: '<Foo>Some content</Foo>', parserOptions},
    {
      code: '<React.Fragment><Foo /><Bar /><Baz /></React.Fragment>',
      parserOptions,
    },
    {
      code: '<Foo.Bar><Foo /><Bar /><Baz /></Foo.Bar>',
      parserOptions,
    },
  ],
  invalid: [
    {
      code: '<span>{things}{things}</span>',
      parserOptions,
      errors: errorWithTagName('span'),
    },
    {
      code: '<div>{things}{things}</div>',
      parserOptions,
      errors: errorWithTagName('div'),
    },
    {
      code: '<div><Foo /><Bar /><Baz><Foo /></Baz></div>',
      parserOptions,
      errors: errorWithTagName('div'),
    },
  ],
});
