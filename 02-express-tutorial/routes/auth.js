const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { name } = req.body;
  if (name) {
    res.status(200).send(`Welcome ${name}`);
  } else {
    res.send('Please provede your Credentials');
  }
});

module.exports = router;
