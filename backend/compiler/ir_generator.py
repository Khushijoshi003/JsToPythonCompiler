def generate_ir(node):
    if node['type'] == 'Program':
        return [generate_ir(stmt) for stmt in node['body']]

    if node['type'] == 'VariableDeclaration':
        init = generate_ir(node['init']) if node['init'] else None
        return {'type': 'VarDecl', 'name': node['id'], 'init': init}

    if node['type'] == 'Literal':
        return node['value']

    if node['type'] == 'Identifier':
        return node['name']

    if node['type'] == 'BinaryExpression':
        left = generate_ir(node['left'])
        right = generate_ir(node['right'])
        return {'type': 'BinOp', 'operator': node['operator'], 'left': left, 'right': right}

    if node['type'] == 'ExpressionStatement':
        return generate_ir(node['expression'])

    if node['type'] == 'CallExpression':
        args = [generate_ir(arg) for arg in node['arguments']]
        return {'type': 'Call', 'callee': node['callee'], 'arguments': args}

    if node['type'] == 'IfStatement':
        test = generate_ir(node['test'])
        consequent = [generate_ir(stmt) for stmt in node['consequent']]
        alternate = [generate_ir(stmt) for stmt in node['alternate']] if node['alternate'] else None
        return {'type': 'If', 'test': test, 'consequent': consequent, 'alternate': alternate}

    if node['type'] == 'ForStatement':
        init = generate_ir(node['init'])
        test = generate_ir(node['test'])
        update = generate_ir(node['update'])
        body = [generate_ir(stmt) for stmt in node['body']]
        return {'type': 'For', 'init': init, 'test': test, 'update': update, 'body': body}

    if node['type'] == 'WhileStatement':
        test = generate_ir(node['test'])
        body = [generate_ir(stmt) for stmt in node['body']]
        return {'type': 'While', 'test': test, 'body': body}

    if node['type'] == 'FunctionDeclaration':
        body = [generate_ir(stmt) for stmt in node['body']]
        return {'type': 'Function', 'name': node['name'], 'params': node['params'], 'body': body}

    if node['type'] == 'ReturnStatement':
        arg = generate_ir(node['argument']) if node['argument'] else None
        return {'type': 'Return', 'argument': arg}

    raise Exception(f"Unsupported AST node {node['type']}")
