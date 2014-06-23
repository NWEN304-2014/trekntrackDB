// app/routes.js
module.exports = function(app, passport) {

	//enable cross-domain-sharing
app.all('*',function(req,res,next){
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");
	next();
});
	// =====================================
	// LOGIN ===============================
	// =====================================
	
	// show login form
	app.get('/login', function(req,res){
		res.render('home.html');
	});
	
	// process the login form
	// app.post('/login', do all our passport stuff here);

	// =====================================
	// SIGNUP ==============================
	// =====================================
	
	//for testing
	app.get('/signup',function(req,res){
	console.log('GET signup');
		res.jsonp("some message");
	});
	
	// process the signup form
	app.post('/signup', function(req,res,next){
			console.log('body '+JSON.stringify(req.body));
			passport.authenticate('local-signup', function(err, user, info) {
			
				if (err) { return next(err);} 
				if (!user) { 
					req.session.messages =  [info.message]; 
					return res.jsonp('redirectLogin');
				}    
				req.logIn(user, function(err) {  
				if (err) { return next(err); }      
					return res.jsonp(user+'redirectProfile');    
				});
			})(req, res, next);
			// res.send("post message return");
	});



	// =====================================
	// PROFILE SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.html', {
			user : req.user // get the user out of session and pass to template
		});
	});

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

