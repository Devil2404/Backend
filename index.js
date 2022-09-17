const connectToMongoo = require("./db");
const express = require('express');


connectToMongoo();
const app = express();
const port = 5000;

app.use(express.json());
app.use('/api/admin', require('./Rotues/admin'))
app.use('/api/teacher', require('./Rotues/teacher'))
app.use('/api/student', require('./Rotues/students'))



app.listen(port, () => {
    console.log(`Your backend run on : http://localhost:${port}`);
})