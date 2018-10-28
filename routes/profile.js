var express = require('express');
var router = express.Router();

router.get('/edit', function(req, res, next) {

    var data = {
        "user" : req.user
    };

    res.render('profile/edit', data);
});

module.exports = router;
