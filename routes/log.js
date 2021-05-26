const express = require('express');
const router = express.Router();
const read_log = require('../bin/read_log');

router.get('/', async function(req, res, next) {
    const data = await read_log.getLog();
    res.json({data});
  });

  
module.exports = router;