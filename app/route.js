// app/routes.js

//To communicate between client-side and server-side, CORS must be enabled,
//and the respond sent to the client side is a string, or an object for
//performing checks for redirecting at the client-side. 
//the res.redirect() or res.render() is not used because the client-side
//application pages is not saved on the server.

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
	
	// process the login form
	app.post('/login', function(req,res,next){
		// console.log('body '+JSON.stringify(req.body));
		passport.authenticate('local-login', function(err, user, info) {
			//error from passport authentication
			if (err) { return next(err);} 
			//authentication failed (user account found, but cannot login)
			if (user == false) { 
				req.session.messages =  [info.message]; 
				return res.jsonp(info.message);
			}    
			//establish session after the user is successfully returned from passport authentication
			req.logIn(user, function(err) {  
				if (err) { return next(err); }      
				//successfully set up session
				return res.send(user);    
			});
		})(req, res, next);
	});

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
		// console.log('body '+JSON.stringify(req.body));
		passport.authenticate('local-signup', function(err, user, info) {
			//return values from passport middleware
			//check and return error, if any
			if (err) { return next(err);} 
			//if no user returned, the user is already registered
			if (!user) { 
				req.session.messages =  [info.message]; 
				return res.jsonp('redirectSignup');
			}
			//set up session when user is successfully returned from authentication
			req.logIn(user, function(err) {  
				if (err) { return next(err); }
				//successfully set up session
				return res.send(user);    
			});
		})(req, res, next);
			
	});


	//check authentication, if false, ajax reply sends redirect message (in isLoggedIn())
	app.get('/upload', isLoggedIn, function(req, res) {
		//check authentication returned true (next())
		//perform uploading by saving data to database
		
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

	// if they aren't return response to ajax call with redirect message
	res.send('redirect');
}

