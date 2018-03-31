var passport = require('passport');
var User = require('../api/models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done){
 done(null, user.id);
});
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
}); 

passport.use('local.signup', new LocalStrategy({
    usernameField: 'name',
     passwordField: 'password',
     passReqToCallback: true
    }, function(req, name, password, done){
        User.findOne({'name': name}), function(err, user){
            if (err){
                return done(err);
            }
            if(user){
                  return done(null, false, {message: 'utilisateur existant'});
            }
            var newUser = new User();
            newUser.name = name ;
            newUser.password = newUser.encryptPassword(password);
            newUser.save(function(err, result){
                if (err){
                    return done(err);
                }
                return done(null, newUser);
            });

        }
     

}));