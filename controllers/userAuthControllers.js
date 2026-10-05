const db = require('../db');

// Controller handles the actual business logic
exports.getUserById = (req, res) => {
  const user = db.findOne({ id: req.params.id });
  if (user) {
    res.send(user);
  } else {
    res.status(404).send('User not found');
  }
};