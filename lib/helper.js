
module.exports = {

    /***
      *     Small middlewear fn to ensure user is authenticated
      *     and redirect them back to the landing page if not
     ***/

    ensureAuthenticated: function( req, res, next ){
        if( req.isAuthenticated() ){
            return next();
        }
        res.redirect('/')
    }
}

