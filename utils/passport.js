var User = require('../app/models').User,
	LocalStrategy = require('passport-local').Strategy,
	passport = require('passport')


module.exports = passport;


passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.find(id).then(function(user) {
		done(null, user);
	}).catch(function(err) {
		done(err, null);
	});
});

// use local strategy
passport.use(new LocalStrategy(
	function(username, password, done) {
		User.find({
			where: {
				username: username
			}
		}).then(function(user) {
			if (!user) {
				return done(null, false);
			}
			if (user.password != password) {
				return done(null, false);
			}
			return done(null, user);
		}).catch(function(err) {
			return done(err, false);
		});
	}
));