const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const url = require('url');


require('dotenv').config();


const app = new express();

const PORT = process.env.PORT || 4000;

app.use(cors());

//rate limiting
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5
})
app.use(limiter);
app.set('trust proxy', 1);

//Routes
app.use('/api', require('./routes'));

app.listen(PORT, () => console.log(`Proxy server listening at port ${PORT}`));