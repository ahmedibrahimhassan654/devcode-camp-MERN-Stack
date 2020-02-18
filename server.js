const express = require('express');
const connectDB = require("./config/db");
const app = express();
const port = process.env.PORT || 5000;

connectDB();
app.use(express.json({ extended: false }));
app.get('/', (req, res) => { res.send('api running '); });
//define rotes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/auth', require('./routes/api/auth'));

app.listen(port, () => console.log(`devcoder  listening on port ${port}!`));