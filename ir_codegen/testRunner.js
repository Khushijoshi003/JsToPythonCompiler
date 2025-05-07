const fs = require('fs');
const path = require('path');
const { generateIR } = require('./irGenerator.js');
const { generatePythonCode } = require('./codeGenerator.js');

// Default input file
const inputFile = process.argv[2] || './test_inputs/strings.json';

try {
  // Read AST from file
  const astPath = path.resolve(inputFile);
  const astData = fs.readFileSync(astPath, 'utf-8');
  const ast = JSON.parse(astData);

  // Generate Intermediate Representation (IR)
  const ir = generateIR(ast);
  console.log("✅ Generated IR:\n", JSON.stringify(ir, null, 2));

  // Generate Python code from IR
  const pythonCode = generatePythonCode(ir);
  console.log("\n✅ Generated Python Code:\n" + pythonCode);

} catch (err) {
  console.error("❌ Error:", err.message);
}
