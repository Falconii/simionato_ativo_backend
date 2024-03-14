const express = require('express');
const router = express.Router();



router.get('/api/splash', function(req, res) {

    setTimeout(function() {
        res.status(200).json({ message: 'Sistema No Ar!' });
    }, 3000);


})

router.get('/api/hello', function(req, res) {

    console.log(req.query)

    res.status(200).json({ message: 'Sistema No Ar!' });

})

router.get('/api/getcode', function(req, res) {

    console.log(req.query)

    res.status(200).json(req.query);

})
module.exports = router;