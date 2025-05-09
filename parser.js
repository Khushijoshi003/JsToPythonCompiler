

const nearley = require("nearley");
const grammar = require("./grammar.js"); // compiled grammar.ne

function parseToAST(input) {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  
  try {
    parser.feed(input);
    if (parser.results.length > 1) {
      throw new Error("Ambiguous grammar detected.");
    }
    return parser.results[0]; // The AST
  } catch (err) {
    console.error("Parse error:", err.message);
    return null;
  }
}

// Example: use any input string
const inputCode = process.argv.slice(2).join(" ") || "x = 2 + y;";
const ast = parseToAST(inputCode);
if (ast) {
  console.log(JSON.stringify(ast, null, 2));
}
