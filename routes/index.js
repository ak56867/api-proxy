const url = require('url');
const express = require('express');
const router = express.Router();
const needle = require('needle');
const apicache = require('apicache');

const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY_VARIABLE = process.env.API_KEY_VARIABLE;
const API_KEY_VALUE = process.env.API_KEY_VALUE;

let cache = apicache.middleware

router.get("/", cache('2 minute'), async(req,res) =>{
    try {

        const params = new URLSearchParams({
            [API_KEY_VARIABLE]: API_KEY_VALUE,
            ...url.parse(req.url,true).query,
        });
        const apiRes = await needle('get', `${API_BASE_URL}?${params}`);
        const data = apiRes.body;

        res.status(200).json(data);
    } catch(error) {
        console.log(error);
        res.status(500).json({error});
    }
});

module.exports = router;