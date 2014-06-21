// app/routes.js
module.exports = function(app, passport) {

	
	// =====================================
	// LOGIN ===============================
	// =====================================
	
	// process the login form
	// app.post('/login', do all our passport stuff here);

	// =====================================
	// SIGNUP ==============================
	// =====================================

	// process the signup form
	app.post('/signup', function(req,res,next){
		passport.authenticate('local-signup', function(err,user,info){
			if(err) {return next(err);}
			if(!user){req.session.messages = [info.message]; return res.send('redirectSignup');}
			req.logIn(user,function(err) {
				if(err){return next(err);}
				console.log(JSON.stringify(user));
				return res.send('redirectProfile');
			});
		})(req,res,next);
	});


	// =====================================
	// PROFILE SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	// app.get('/profile', isLoggedIn, function(req, res) {
		// res.render('profile.ejs', {
			// user : req.user // get the user out of session and pass to template
		// });
	// });

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.send('loggedout');
	});
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.send('redirect');
}

