function generatePythonCode(irList) {
    const lines = [];
    const indentStack = [""];
    
    for (const instr of irList) {
      const indent = indentStack[indentStack.length - 1];
  
      switch (instr.op) {
        case "assign":
          lines.push(`${indent}${instr.target} = ${formatValue(instr.value)}`);
          break;
  
        case "function":
          lines.push(`${indent}def ${instr.name}(${instr.params.join(", ")}):`);
          indentStack.push(indent + "    ");
          break;
  
        case "endfunction":
          indentStack.pop();
          break;
  
        case "if":
          lines.push(`${indent}if ${formatValue(instr.test)}:`);
          indentStack.push(indent + "    ");
          break;
  
        case "else":
          indentStack.pop();
          lines.push(`${indent}else:`);
          indentStack.push(indent + "    ");
          break;
  
        case "endif":
          indentStack.pop();
          break;
  
        case "while":
          lines.push(`${indent}while ${formatValue(instr.test)}:`);
          indentStack.push(indent + "    ");
          break;
  
        case "endwhile":
          indentStack.pop();
          break;
  
        case "for":
          lines.push(`${indent}while ${formatValue(instr.test)}:  # JS for loop mapped to while`);
          indentStack.push(indent + "    ");
          break;
  
        case "endfor":
          indentStack.pop();
          break;
  
        case "call":
          lines.push(`${indent}${instr.callee}(${instr.args.map(formatValue).join(", ")})`);
          break;
  
        case "return":
          lines.push(`${indent}return ${formatValue(instr.value)}`);
          break;
  
        case "try":
          lines.push(`${indent}try:`);
          indentStack.push(indent + "    ");
          break;
  
        case "catch":
          indentStack.pop();
          lines.push(`${indent}except Exception as ${instr.param}:`);
          indentStack.push(indent + "    ");
          break;
  
        case "endtry":
          indentStack.pop();
          break;
  
        default:
          lines.push(`${indent}# Unsupported IR op: ${instr.op}`);
      }
    }
  
    return lines.join("\n");
  }
  
  function formatValue(val) {
    if (typeof val === "string") return `"${val}"`;
    if (typeof val === "object") {
      if (val.op === "call") {
        return `${val.callee}(${val.args.map(formatValue).join(", ")})`;
      } else if (val.op && val.left && val.right) {
        return `(${formatValue(val.left)} ${val.op} ${formatValue(val.right)})`;
      } else if (Array.isArray(val)) {
        return `[${val.map(formatValue).join(", ")}]`;
      } else {
        return JSON.stringify(val); // object literal
      }
    }
    return val;
  }
  
  module.exports = { generatePythonCode };
  