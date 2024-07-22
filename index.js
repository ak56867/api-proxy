const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const url = require('url');
const morgan = require('morgan');

require('dotenv').config();

const app = new express();

const PORT = process.env.PORT || 4000;

const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000;
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX, 10) || 100;


app.use(cors());

//rate limiting
const limiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_MAX,
    handler: (req,res) => {
        res.status(429).send({error: 'Requests limit exceeded, please try again later.'});
    },
})
app.use(limiter);
app.set('trust proxy', 1);


//logging
morgan.token('timestamp',() => new Date().toISOString());
morgan.token('client-ip', (req) => req.ip);

app.use(
    morgan(':timestamp :client-ip :method :url :status :response-time ms - rate limit remaining :res[x-ratelimit-remaining]')
)


//Routes
app.use('/api', require('./routes/index'));

app.listen(PORT, () => console.log(`Proxy server listening at port ${PORT}`));