class Parser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.pos = 0

    def peek(self):
        if self.pos < len(self.tokens):
            return self.tokens[self.pos]
        return {'type': 'EOF', 'value': ''}

    def consume(self, expected_type=None):
        token = self.peek()
        if expected_type and token['type'] != expected_type:
            raise Exception(f"Expected {expected_type}, got {token['type']}")
        self.pos += 1
        return token

    def parse(self):
        statements = []
        while self.peek()['type'] != 'EOF':
            statements.append(self.parse_statement())
        return {'type': 'Program', 'body': statements}

    def parse_statement(self):
        token = self.peek()

        if token['type'] == 'ID':
            if token['value'] == 'if':
                return self.parse_if()
            elif token['value'] == 'for':
                return self.parse_for()
            elif token['value'] == 'while':
                return self.parse_while()
            elif token['value'] == 'function':
                return self.parse_function()
            elif token['value'] == 'return':
                return self.parse_return()
            elif token['value'] == 'var' or token['value'] == 'let' or token['value'] == 'const':
                return self.parse_variable_declaration()
            else:
                return self.parse_expression_statement()

        else:
            return self.parse_expression_statement()

    def parse_if(self):
        self.consume('ID')  # consume 'if'
        self.consume('LPAREN')
        test = self.parse_expression()
        self.consume('RPAREN')
        consequent = self.parse_block()
        alternate = None
        if self.peek()['type'] == 'ID' and self.peek()['value'] == 'else':
            self.consume('ID')  # consume 'else'
            alternate = self.parse_block()
        return {'type': 'IfStatement', 'test': test, 'consequent': consequent, 'alternate': alternate}

    def parse_for(self):
        self.consume('ID')  # 'for'
        self.consume('LPAREN')
        init = self.parse_variable_declaration()  # assuming var declaration in init
        self.consume('SEMI')
        test = self.parse_expression()
        self.consume('SEMI')
        update = self.parse_expression()
        self.consume('RPAREN')
        body = self.parse_block()
        return {'type': 'ForStatement', 'init': init, 'test': test, 'update': update, 'body': body}

    def parse_while(self):
        self.consume('ID')  # 'while'
        self.consume('LPAREN')
        test = self.parse_expression()
        self.consume('RPAREN')
        body = self.parse_block()
        return {'type': 'WhileStatement', 'test': test, 'body': body}

    def parse_function(self):
        self.consume('ID')  # 'function'
        name = self.consume('ID')['value']
        self.consume('LPAREN')
        params = []
        while self.peek()['type'] != 'RPAREN':
            params.append(self.consume('ID')['value'])
            if self.peek()['type'] == 'COMMA':
                self.consume('COMMA')
        self.consume('RPAREN')
        body = self.parse_block()
        return {'type': 'FunctionDeclaration', 'name': name, 'params': params, 'body': body}

    def parse_return(self):
        self.consume('ID')  # 'return'
        argument = None
        if self.peek()['type'] != 'SEMI':
            argument = self.parse_expression()
        self.consume('SEMI')
        return {'type': 'ReturnStatement', 'argument': argument}

    def parse_variable_declaration(self):
        kind = self.consume('ID')['value']  # var, let, const
        id_ = self.consume('ID')['value']
        init = None
        if self.peek()['type'] == 'OP' and self.peek()['value'] == '=':
            self.consume('OP')
            init = self.parse_expression()
        if self.peek()['type'] == 'SEMI':
            self.consume('SEMI')
        return {'type': 'VariableDeclaration', 'kind': kind, 'id': id_, 'init': init}

    def parse_block(self):
        self.consume('LBRACE')
        statements = []
        while self.peek()['type'] != 'RBRACE':
            statements.append(self.parse_statement())
        self.consume('RBRACE')
        return statements

    def parse_expression_statement(self):
        expr = self.parse_expression()
        if self.peek()['type'] == 'SEMI':
            self.consume('SEMI')
        return {'type': 'ExpressionStatement', 'expression': expr}

    def parse_expression(self):
        # For simplicity, parse only identifiers, literals, and simple binary expressions
        token = self.peek()
        if token['type'] == 'NUMBER':
            self.consume('NUMBER')
            return {'type': 'Literal', 'value': int(token['value'])}
        elif token['type'] == 'STRING':
            self.consume('STRING')
            return {'type': 'Literal', 'value': token['value'].strip('"')}
        elif token['type'] == 'ID':
            id_token = self.consume('ID')
            # handle simple function calls like console.log(...)
            if self.peek()['type'] == 'LPAREN':
                self.consume('LPAREN')
                args = []
                while self.peek()['type'] != 'RPAREN':
                    args.append(self.parse_expression())
                    if self.peek()['type'] == 'COMMA':
                        self.consume('COMMA')
                self.consume('RPAREN')
                return {'type': 'CallExpression', 'callee': id_token['value'], 'arguments': args}
            else:
                return {'type': 'Identifier', 'name': id_token['value']}
        elif token['type'] == 'LPAREN':
            self.consume('LPAREN')
            expr = self.parse_expression()
            self.consume('RPAREN')
            return expr
        else:
            # very basic binary expr parsing for "a > 0"
            left = self.parse_simple_primary()
            if self.peek()['type'] == 'OP' or self.peek()['type'] in ['EQ', 'NEQ', 'LE', 'GE']:
                op = self.consume()['value']
                right = self.parse_simple_primary()
                return {'type': 'BinaryExpression', 'operator': op, 'left': left, 'right': right}
            return left

    def parse_simple_primary(self):
        token = self.peek()
        if token['type'] == 'NUMBER':
            self.consume('NUMBER')
            return {'type': 'Literal', 'value': int(token['value'])}
        elif token['type'] == 'ID':
            id_token = self.consume('ID')
            return {'type': 'Identifier', 'name': id_token['value']}
        else:
            raise Exception(f"Unexpected token {token}")

# Usage:
# parser = Parser(tokens)
# ast = parser.parse()
