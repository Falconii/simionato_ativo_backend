const express = require('express');
const router = express.Router();



router.get('/api/splash', function(req, res) {

    setTimeout(function() {
        res.status(200).json({ message: 'Sistema No Ar!' });
    }, 3000);


})

router.get('/api/hello', function(req, res) {

    res.status(200).json({ message: 'Sistema No Ar!' });

})
module.exports = router;