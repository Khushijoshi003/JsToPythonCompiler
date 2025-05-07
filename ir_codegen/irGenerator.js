function generateIR(ast) {
    const ir = [];
  
    function walk(node) {
      switch (node.type) {
        case "Program":
          node.body.forEach(walk);
          break;
  
        case "VariableDeclaration":
          for (const decl of node.declarations) {
            ir.push({
              op: "assign",
              target: decl.id.name,
              value: extractExpr(decl.init)
            });
          }
          break;
  
        case "ExpressionStatement":
          walk(node.expression);
          break;
  
        case "AssignmentExpression":
          ir.push({
            op: "assign",
            target: node.left.name,
            value: extractExpr(node.right)
          });
          break;
  
        case "BinaryExpression":
          return {
            op: node.operator,
            left: extractExpr(node.left),
            right: extractExpr(node.right)
          };
  
        case "IfStatement":
          ir.push({ op: "if", test: extractExpr(node.test) });
          walk(node.consequent);
          if (node.alternate) {
            ir.push({ op: "else" });
            walk(node.alternate);
          }
          ir.push({ op: "endif" });
          break;
  
        case "WhileStatement":
          ir.push({ op: "while", test: extractExpr(node.test) });
          walk(node.body);
          ir.push({ op: "endwhile" });
          break;
  
        case "ForStatement":
          walk(node.init);
          ir.push({ op: "for", test: extractExpr(node.test), update: extractExpr(node.update) });
          walk(node.body);
          ir.push({ op: "endfor" });
          break;
  
        case "FunctionDeclaration":
          ir.push({
            op: "function",
            name: node.id.name,
            params: node.params.map(p => p.name)
          });
          walk(node.body);
          ir.push({ op: "endfunction" });
          break;
  
        case "CallExpression":
          ir.push({
            op: "call",
            callee: node.callee.name,
            args: node.arguments.map(extractExpr)
          });
          break;
  
        case "ReturnStatement":
          ir.push({
            op: "return",
            value: extractExpr(node.argument)
          });
          break;
  
        case "TryStatement":
          ir.push({ op: "try" });
          walk(node.block);
          ir.push({ op: "catch", param: node.handler.param.name });
          walk(node.handler.body);
          ir.push({ op: "endtry" });
          break;
  
        case "BlockStatement":
          node.body.forEach(walk);
          break;
  
        default:
          console.warn("Unhandled node type:", node.type);
      }
    }
  
    function extractExpr(expr) {
      if (!expr) return null;
  
      switch (expr.type) {
        case "NumericLiteral":
        case "StringLiteral":
          return expr.value;
  
        case "Identifier":
          return expr.name;
  
        case "BinaryExpression":
          return {
            op: expr.operator,
            left: extractExpr(expr.left),
            right: extractExpr(expr.right)
          };
  
        case "CallExpression":
          return {
            op: "call",
            callee: expr.callee.name,
            args: expr.arguments.map(extractExpr)
          };
  
        case "ArrayExpression":
          return expr.elements.map(extractExpr);
  
        case "ObjectExpression":
          return Object.fromEntries(
            expr.properties.map(prop => [
              prop.key.name || prop.key.value,
              extractExpr(prop.value)
            ])
          );
  
        default:
          return "<unsupported>";
      }
    }
  
    walk(ast);
    return ir;
  }
  
  module.exports = { generateIR };
  