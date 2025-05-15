const fs = require('fs');
const moo = require("moo");

const lexer = moo.compile({
  // Whitespace and comments
  WS:      /[ \t]+/,
  comment: /\/\/.*?$/,
  block_comment: { match: /\/\*[\s\S]*?\*\//, lineBreaks: true },

  // Literals
  number:  /(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?/,
  string:  /"(?:\\["\\bfnrt\/]|\\u[a-fA-F0-9]{4}|[^"\\])*"/,
  string_single: /'(?:\\['\\bfnrt\/]|\\u[a-fA-F0-9]{4}|[^'\\])*'/,
  template_string: /`(?:\\[`\\$]|[^`])*`/,

  // Identifiers and Keywords
  identifier: {
    match: /[a-zA-Z_$][a-zA-Z0-9_$]*/,
    type: moo.keywords({
      keyword: [
        'let', 'const', 'var', 'if', 'else', 'for', 'while', 'do',
        'function', 'return', 'class', 'extends', 'constructor',
        'new', 'try', 'catch', 'finally', 'throw',
        'await', 'async', 'break', 'continue',
        'switch', 'case', 'default', 'typeof', 'instanceof', 'in'
      ],
      boolean: ['true', 'false'],
      null: 'null',
      undefined: 'undefined'
    })
  },

  // Operators
  arrow: '=>',
  assign_op: ['+=', '-=', '*=', '/=', '%='],
  logical_op: ['&&', '||', '!'],
  bitwise_op: ['&', '|', '^', '~', '<<', '>>', '>>>'],
  comparison_op: ['==', '===', '!=', '!==', '<', '<=', '>', '>='],
  arithmetic_op: ['+', '-', '*', '/', '%'],
  increment: ['++', '--'],
  assign: '=',
  question: '?',
  colon: ':',

  // Brackets and punctuation
  lparen:  '(',
  rparen:  ')',
  lbrace:  '{',
  rbrace:  '}',
  lbracket: '[',
  rbracket: ']',
  semicolon: ';',
  comma:   ',',
  dot:     '.',

  // Newlines
  NL: { match: /\n/, lineBreaks: true },
});

// Export tokenizer
module.exports = function tokenize(input) {
  lexer.reset(input);
  const tokens = [];

  try {
    for (let token of lexer) {
      if (!['WS', 'comment', 'block_comment', 'NL'].includes(token.type)) {
        tokens.push({ type: token.type, value: token.value });
      }
    }
  } catch (err) {
    throw new Error(`Invalid syntax near "${lexer.buffer.slice(lexer.index, lexer.index + 10)}" at line ${lexer.line}, column ${lexer.col}`);
  }
  fs.writeFileSync('lexer.json', JSON.stringify(tokens, null, 2));

  return tokens;
};
