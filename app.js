const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname,"public")));

//app.use('/',(req,res) => res.sendFile('index.html'));

app.listen(port, () => console.log(`Listening to port ${port}`));

