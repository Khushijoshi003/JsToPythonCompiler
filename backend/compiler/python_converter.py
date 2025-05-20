def indent(lines, level=1):
    return ['    ' * level + line for line in lines]

def generate_python(ir):
    if isinstance(ir, list):
        return '\n'.join(generate_python(stmt) for stmt in ir)

    t = ir['type']
    if t == 'VarDecl':
        if ir['init'] is not None:
            return f"{ir['name']} = {generate_python(ir['init'])}"
        else:
            return f"{ir['name']} = None"

    if isinstance(ir, int) or isinstance(ir, str):
        return str(ir)

    if t == 'BinOp':
        return f"{generate_python(ir['left'])} {ir['operator']} {generate_python(ir['right'])}"

    if t == 'Call':
        if ir['callee'] == 'console.log':
            args = ', '.join(generate_python(arg) for arg in ir['arguments'])
            return f"print({args})"
        else:
            args = ', '.join(generate_python(arg) for arg in ir['arguments'])
            return f"{ir['callee']}({args})"

    if t == 'If':
        code = f"if {generate_python(ir['test'])}:\n"
        code += '\n'.join(indent(generate_python(ir['consequent']).split('\n')))
        if ir['alternate']:
            code += f"\nelse:\n"
            code += '\n'.join(indent(generate_python(ir['alternate']).split('\n')))
        return code

    if t == 'For':
        # Assuming init is var i = 0; test is i < N; update is i = i + 1
        # Extract start, end
        init = ir['init']
        test = ir['test']
        update = ir['update']

        if init['type'] == 'VarDecl' and test['type'] == 'BinOp' and update['type'] == 'BinOp':
            var = init['name']
            start = generate_python(init['init'])
            # Only handle 'i < N' test operator '<'
            if test['operator'] == '<' and test['left'] == var:
                end = generate_python(test['right'])
                body_code = '\n'.join(indent(generate_python(ir['body']).split('\n')))
                return f"for {var} in range({start}, {end}):\n{body_code}"
        return "# Unsupported for-loop pattern"

    if t == 'While':
        code = f"while {generate_python(ir['test'])}:\n"
        code += '\n'.join(indent(generate_python(ir['body']).split('\n')))
        return code

    if t == 'Function':
        params = ', '.join(ir['params'])
        code = f"def {ir['name']}({params}):\n"
        body = generate_python(ir['body'])
        if not body.strip():
            body = 'pass'
        code += '\n'.join(indent(body.split('\n')))
        return code

    if t == 'Return':
        if ir['argument'] is not None:
            return f"return {generate_python(ir['argument'])}"
        else:
            return "return"

    return "# Unsupported IR node"
