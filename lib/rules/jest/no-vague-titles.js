module.exports = {
  meta: {
    docs: {
      description: 'Prevent the usage of vague words in test statements.',
      category: 'Best Practices',
      recommended: false,
      uri:
        'https://github.com/Shopify/eslint-plugin-shopify/blob/master/docs/rules/jest/no-vague-titles.md',
    },
  },
  create(context) {
    const ignored = (context.options[0] && context.options[0].ignore) || [];

    function isIgnoredFunctionName(node) {
      if (node.type === 'MemberExpression') {
        return ignored.some((method) => method === node.object.name);
      }
      return ignored.some((method) => method === node.callee.name);
    }

    function validate(node) {
      if (
        notTestFunction(node) ||
        isIgnoredFunctionName(node) ||
        hasEmptyDescription(node)
      ) {
        return;
      }

      const description = getDescription(node);

      if (containsVagueWord(description)) {
        context.report({
          message: `{{ method }} description should not contain vague words. Be sure the description meaningfully illustrates the purpose of this test.`,
          data: {method: node.callee ? node.callee.name : node.object.name},
          node,
        });
      }
    }

    return {
      MemberExpression(node) {
        validate(node);
      },
      CallExpression(node) {
        validate(node);
      },
    };
  },
};

function notTestFunction(node) {
  if (node.type === 'MemberExpression') {
    return node.object && !matchTestFunctionName(node.object.name);
  }

  return node.callee && !matchTestFunctionName(node.callee.name);
}

function matchTestFunctionName(functionName) {
  return (
    functionName === 'it' ||
    functionName === 'xit' ||
    functionName === 'fit' ||
    functionName === 'test' ||
    functionName === 'xtest' ||
    functionName === 'describe' ||
    functionName === 'fdescribe' ||
    functionName === 'xdescribe'
  );
}

function hasEmptyDescription(node) {
  const args = node.arguments || node.parent.arguments || [];
  return (
    !args ||
    !args[0] ||
    (args[0].type !== 'Literal' && args[0].type !== 'TemplateLiteral')
  );
}

function getDescription(node) {
  const args = node.arguments || node.parent.arguments || [];
  const firstArgument = args[0];

  if (firstArgument.type === 'TemplateLiteral') {
    return firstArgument.quasis
      .map((templateLiteral) => {
        return templateLiteral.value.raw;
      })
      .join('');
  }

  return firstArgument && firstArgument.value;
}

function containsVagueWord(description) {
  return description.match(/correct/i) || description.match(/appropriate/i);
}
