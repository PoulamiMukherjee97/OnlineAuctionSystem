const express = require('express');
const cors = require('cors');

const authRouter = require('./routers/authRouter');
const assetRouter = require('./routers/assetRouter');
const tokenRouter = require('./routers/tokenRouter');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/asset', assetRouter);
app.use('/api/token', tokenRouter);


app.listen(5000, () => console.log("Server listening to port 5000"));

