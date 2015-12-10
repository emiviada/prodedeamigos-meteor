
var ERRORS_KEY = 'joinErrors';

// Template: Join
Template.join.helpers({
    errorClass: function(key) {
        return Session.get(ERRORS_KEY)[key] && 'error';
    }
});
Template.join.events({
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
Template.join.onCreated(function() {
    Session.set(ERRORS_KEY, {});
});

// onRendered hook
Template.join.onRendered(function() {
    var validator = $('.join').validate({
        rules: {
            confirm: {
                equalTo: '#password'
            }
        },
        submitHandler: function(e) {
            var email = $('[name="email"]').val(),
                password = $('[name="password"]').val();
            Accounts.createUser({
                email: email,
                password: password
            }, function(error) {
                if (error) {
                    var errors = {};
                    if (error.reason == "Email already exists.") {
                        errors.email = error.reason;
                        validator.showErrors({
                            email: "El email ya se encuentra registrado por otro usuario."
                        });
                    }
                    Session.set(ERRORS_KEY, errors);
                } else {
                    // If user registered from invitation, join new user with tournament
                    joinFromInvite();
                    Router.go('home');
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
                if (errors) {console.log(errors);
                    Session.set(ERRORS_KEY, errors);
                }
            }, 100);
        }
    });
});
