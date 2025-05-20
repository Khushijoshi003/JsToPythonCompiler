from flask import Flask, request, jsonify
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)


import re

# -----------------------
# STAGE 1: Lexer (extended)
# -----------------------
def lexer(js_code):
    tokens = []
    # Simple split for ; and also for function blocks by detecting braces
    js_code = js_code.strip()
    # Regex for function
    function_pattern = re.compile(r'function\s+(\w+)\s*\((.*?)\)\s*\{([^}]*)\}', re.DOTALL)

    # Find all functions
    for func_match in function_pattern.finditer(js_code):
        name = func_match.group(1)
        params = func_match.group(2).strip()
        body = func_match.group(3).strip()
        tokens.append({
            'type': 'function_declaration',
            'name': name,
            'params': [p.strip() for p in params.split(',')] if params else [],
            'body': body
        })
        # Remove this function code from js_code to avoid double processing
        js_code = js_code.replace(func_match.group(0), '')

    # Process remaining lines for variable declarations
    lines = [line.strip() for line in js_code.split(';') if line.strip() != '']

    for line in lines:
        match = re.match(r'^(let|const|var)\s+(\w+)\s*=\s*(.+)$', line)
        if match:
            tokens.append({
                'type': 'declaration',
                'kind': match.group(1),
                'name': match.group(2),
                'value': match.group(3).strip()
            })
        else:
            tokens.append({'type': 'unknown', 'code': line})
    return tokens


# -----------------------
# STAGE 2: Parser (extended)
# -----------------------
class Parser:
    def __init__(self, tokens):
        self.tokens = tokens

    def parse(self):
        ast = []
        for token in self.tokens:
            if token['type'] == 'declaration':
                ast.append({
                    'type': 'VariableDeclaration',
                    'kind': token['kind'],
                    'identifier': token['name'],
                    'value': token['value']
                })
            elif token['type'] == 'function_declaration':
                # For simplicity, parse function body as variable declarations or return statements
                body_lines = [line.strip() for line in token['body'].split(';') if line.strip()]
                body_ast = []
                for line in body_lines:
                    ret_match = re.match(r'^return\s+(.+)$', line)
                    decl_match = re.match(r'^(let|const|var)\s+(\w+)\s*=\s*(.+)$', line)
                    if ret_match:
                        body_ast.append({'type': 'ReturnStatement', 'value': ret_match.group(1).strip()})
                    elif decl_match:
                        body_ast.append({
                            'type': 'VariableDeclaration',
                            'kind': decl_match.group(1),
                            'identifier': decl_match.group(2),
                            'value': decl_match.group(3).strip()
                        })
                    else:
                        body_ast.append({'type': 'Unknown', 'code': line})
                ast.append({
                    'type': 'FunctionDeclaration',
                    'name': token['name'],
                    'params': token['params'],
                    'body': body_ast
                })
        return ast


# -----------------------
# STAGE 3: Intermediate Representation (IR) (extended)
# -----------------------
def generate_ir(ast):
    ir = []
    for node in ast:
        if node['type'] == 'VariableDeclaration':
            ir.append({
                'op': 'assign',
                'target': node['identifier'],
                'value': node['value']
            })
        elif node['type'] == 'FunctionDeclaration':
            # IR for function: name, params, body instructions (which we also convert recursively)
            body_ir = generate_ir(node['body'])
            ir.append({
                'op': 'function_def',
                'name': node['name'],
                'params': node['params'],
                'body': body_ir
            })
        elif node['type'] == 'ReturnStatement':
            ir.append({
                'op': 'return',
                'value': node['value']
            })
        # Ignore unknown for now
    return ir


# -----------------------
# STAGE 4: Python Code Generator (extended)
# -----------------------
def generate_python(ir, indent=0):
    lines = []
    indent_str = '    ' * indent
    for instruction in ir:
        if instruction['op'] == 'assign':
            lines.append(f"{indent_str}{instruction['target']} = {instruction['value']}")
        elif instruction['op'] == 'function_def':
            lines.append(f"{indent_str}def {instruction['name']}({', '.join(instruction['params'])}):")
            if instruction['body']:
                # Recursively generate body with increased indent
                body_code = generate_python(instruction['body'], indent + 1)
                lines.append(body_code)
            else:
                # Empty function body
                lines.append(f"{indent_str}    pass")
        elif instruction['op'] == 'return':
            lines.append(f"{indent_str}return {instruction['value']}")
    return "\n".join(lines)

# -----------------------
# FLASK API ROUTE
# -----------------------
@app.route('/convert', methods=['POST'])
def convert_code():
    data = request.get_json()
    js_code = data.get('code', '')

    if not js_code:
        return jsonify({"message": "No code provided"}), 400

    try:
        tokens = lexer(js_code)
        print(tokens)
        parser = Parser(tokens)
        ast = parser.parse()
        ir = generate_ir(ast)
        python_code = generate_python(ir)

        return jsonify({
            "tokens": tokens,
            "ast": ast,
            "ir": ir,
            "python": python_code
        })

    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True)
