const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const tokenize = require('./lexer');
const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Test route
app.get('/test', (req, res) => {
  res.send('Test working');
});

// Tokenize route
app.post('/tokenize', (req, res) => {
  const jsCode = req.body.code;
  try {
    const tokens = tokenize(jsCode);
    res.json({ success: true, tokens });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Auth routes
app.use('/api/login', loginRoute);
app.use('/api/register', registerRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
