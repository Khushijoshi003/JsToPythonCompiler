import re

def lexer(code):
    token_spec = [
        ('NUMBER',   r'\d+(\.\d*)?'),       # Integer or decimal number
        ('ID',       r'[A-Za-z_]\w*'),      # Identifiers
        ('STRING',   r'"[^"]*"'),            # Double quoted strings
        ('OP',       r'[+\-*/=<>!]'),        # Operators (one char)
        ('EQ',       r'=='),                 # Equality operator
        ('NEQ',      r'!='),                 # Not equal
        ('LE',       r'<='),                 # Less or equal
        ('GE',       r'>='),                 # Greater or equal
        ('LPAREN',   r'\('),
        ('RPAREN',   r'\)'),
        ('LBRACE',   r'\{'),
        ('RBRACE',   r'\}'),
        ('COMMA',    r','),
        ('SEMI',     r';'),
        ('NEWLINE',  r'\n'),
        ('SKIP',     r'[ \t]+'),
        ('UNKNOWN',  r'.'),
    ]
    tok_regex = '|'.join(f'(?P<{name}>{regex})' for name, regex in token_spec)
    tokens = []
    for mo in re.finditer(tok_regex, code):
        kind = mo.lastgroup
        value = mo.group()
        if kind == 'SKIP' or kind == 'NEWLINE':
            continue
        tokens.append({'type': kind, 'value': value})
    return tokens
