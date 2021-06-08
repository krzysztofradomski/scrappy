const express = require('express');
const app = express();

app.use(express.static('static'));

app.listen(3003);
console.log('Frontend available on http://127.0.0.1:3003')