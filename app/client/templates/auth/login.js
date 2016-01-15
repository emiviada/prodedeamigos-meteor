var ERRORS_KEY = 'loginErrors';

// Template: Login
Template.login.helpers({
    errorClass: function(key) {
        return Session.get(ERRORS_KEY)[key] && 'error';
    }
});
Template.login.events({
    'submit form': function(e) {
        e.preventDefault();
    },
    'click .btn-facebook': function(e) {
    	e.preventDefault();
    	Meteor.loginWithFacebook({}, function(err) {
            if (err) {
                throw new Meteor.Error("Facebook login failed");
            } else { // Success
            	// If user registered from invitation, join new user with tournament
                joinFromInvite();
                Router.go('home');
            }
        });
    },
    'click .btn-twitter': function(e) {
    	e.preventDefault();
    	Meteor.loginWithTwitter({}, function(err) {
            if (err) {
                throw new Meteor.Error("Twitter login failed");
            } else { // Success
            	// If user registered from invitation, join new user with tournament
                joinFromInvite();
                Router.go('home');
            }
        });
    }
});
Template.login.onCreated(function() {
    Session.set(ERRORS_KEY, {});
});

// onRendered hook
Template.login.onRendered(function() {
    var validator = $('.login').validate({
        submitHandler: function(e) {
            var email = $('[name="email"]').val(),
                password = $('[name="password"]').val();

            Meteor.loginWithPassword(email, password, function(error) {
                if (error) {
                    var errors = {};
                    if (error.reason == "User not found") {
                        errors.email = error.reason;
                        validator.showErrors({
                            email: 'El usuario no existe'
                        });
                    }
                    if (error.reason == "Incorrect password") {
                        errors.password = error.reason;
                        validator.showErrors({
                            password: 'Password incorrecto'
                        });
                    }
                    Session.set(ERRORS_KEY, errors);
                } else {
                    // If user logins from invitation, join the user with tournament
                    joinFromInvite();
                    var currentRoute = Router.current().route.getName();
                    if (currentRoute == "login") {
                        Router.go("dashboard");
                    }
                }
            });
        },
        invalidHandler: function(event, validator) {
            setTimeout(function() {
                var errors = {};
                $.each(validator.currentForm, function(i, elem) {
                    var input = $(elem);
                    if (input.hasClass('error')) {
                        errors[input.attr('name')] = 'error';
                    }
                });
                if (errors) {
                    Session.set(ERRORS_KEY, errors);
                }
            }, 100);
        }
    });
});
