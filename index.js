const express = require('express');
const app = express();
const PORT = 3000;
const userAuth = require('./routes/authRoutes');

// Register middleware before routes
app.use(express.json());

app.use('/auth', userAuth);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});