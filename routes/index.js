const url = require('url');
const express = require('express');
const router = express.Router();
const needle = require('needle');
const apicache = require('apicache');


const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY_VARIABLE = process.env.API_KEY_VARIABLE;
const API_KEY_VALUE = process.env.API_KEY_VALUE;
const CACHE_DURATION = parseInt(process.env.CACHE_DURATION, 10) || 60 * 60 * 1000;

let cache = apicache.middleware

router.get("/", cache(CACHE_DURATION), async(req,res) =>{
    try {

        const params = new URLSearchParams({
            [API_KEY_VARIABLE]: API_KEY_VALUE,
            ...url.parse(req.url,true).query,
        });
        const apiRes = await needle('get', `${API_BASE_URL}?${params}`);
        const data = apiRes.body;

        res.status(200).json(data);
    } catch(error) {
        if (error.response) {
            // Server responded with a status other than 200 range
            console.error('Response error:', error.response.status);
            res.status(error.response.status).send(error.response.data);
          } else if (error.request) {
            // No response was received
            console.error('No response received:', error.request);
            res.status(504).send({ error: 'No response received from external API' });
          } else if (error.code === 'ECONNABORTED') {
            // Timeout error
            console.error('Timeout error:', error.message);
            res.status(504).send({ error: 'Request to external API timed out' });
          } else {
            // Other errors
            console.error('Error:', error.message);
            res.status(500).send({ error: 'An error occurred while processing your request' });
          }
    }
});

module.exports = router;