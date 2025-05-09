/*This grammar handles general assignment expressions with addition.*/

@{%
const lexer = require("./lexer");

// AST node factory
function node(type, value = null, children = []) {
  return { type, value, children };
}
%}

@lexer lexer

Program -> Statement:+ {% 
  d => node("Program", null, d[0]) 
%}

Statement -> identifier assign Expression semicolon {% 
  d => node("Assign", null, [
    node("Variable", d[0].value),
    d[2]
  ]) 
%}

Expression -> Expression plus Term {% 
  d => node("Add", null, [d[0], d[2]]) 
%}
           | Term {% 
  d => d[0] 
%}

Term -> number {% 
  d => node("Number", parseInt(d[0].value)) 
%}
     | identifier {% 
  d => node("Variable", d[0].value) 
%}
