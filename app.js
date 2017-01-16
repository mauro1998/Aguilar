const path = require('path');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('*', (req, res) => {
  const index = path.join(__dirname, 'index.html');
  res.sendFile(index);
});

app.listen(port, () => {
  console.log('App running at 0.0.0.0:' + port);
});
