const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const savedStrings = {}; // In-memory store (key: id, value: { text, palindrome })

// Helper function
const isPalindrome = (str) => {
  if (!str) return false;
  const cleaned = str.toLowerCase().replace(/[\W_]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
};

// 📘 GET /check?text=YourText
app.get('/check', (req, res) => {
  const text = req.query.text;
  if (typeof text !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid text parameter.' });
  }
  const result = isPalindrome(text);
  res.status(200).json({ palindrome: result });
});

// ➕ POST /check with JSON: { id: "1", text: "hello" }
app.post('/check', (req, res) => {
  const { id, text } = req.body;

  if (!id || typeof text !== 'string') {
    return res.status(400).json({ error: 'ID and valid text are required.' });
  }

  const result = isPalindrome(text);
  savedStrings[id] = { text, palindrome: result };
  res.status(201).json({ id, text, palindrome: result });
});

// 🔁 PUT /check/:id with JSON: { text: "new text" }
app.put('/check/:id', (req, res) => {
  const id = req.params.id;
  const { text } = req.body;

  if (!savedStrings[id]) {
    return res.status(404).json({ error: 'Record not found.' });
  }

  if (typeof text !== 'string') {
    return res.status(400).json({ error: 'Text must be a string.' });
  }

  const result = isPalindrome(text);
  savedStrings[id] = { text, palindrome: result };
  res.status(200).json({ id, text, palindrome: result });
});

// ❌ DELETE /check/:id
app.delete('/check/:id', (req, res) => {
  const id = req.params.id;

  if (!savedStrings[id]) {
    return res.status(404).json({ error: 'Record not found.' });
  }

  delete savedStrings[id];
  res.status(200).json({ message: `Record ${id} deleted.` });
});

// 🔊 Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
