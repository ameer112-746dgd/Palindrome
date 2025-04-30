const express = require('express');
const app = express();
const router = express.Router();
const serverless = require('serverless-http');
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));


app.use(express.json());

const isPalindrome = (str) => {
  if (!str) return false;
  const cleaned = str.toLowerCase().replace(/[\W_]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
};

router.post('/check', (req, res) => {
  const { text } = req.body;
  if (typeof text !== 'string') {
    return res.status(400).json({ error: 'Text must be a string.' });
  }
  const result = isPalindrome(text);
  res.status(200).json({ palindrome: result });
});

router.get('/check', (req, res) => {
  const { text } = req.query;
  if (typeof text !== 'string') {
    return res.status(400).json({ error: 'Text must be a string.' });
  }
  const result = isPalindrome(text);
  res.status(200).json({ palindrome: result });
});

app.use('/api', router);
module.exports = app;
module.exports.handler = serverless(app);
