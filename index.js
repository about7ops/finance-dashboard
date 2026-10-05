const express = require('express');
const app = express();
const userAuth = require('./routes/userAuthRoutes');
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
  console.log('Response: ', res);
});

app.use('/userAuthRoutes', userAuth);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});