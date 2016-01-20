// Template: resetPassword
var ERRORS_KEY = 'resetPasswordErrors';

// onCreated
Template.resetPassword.onCreated(function() {
    Session.set(ERRORS_KEY, {});
});

// Helpers
Template.resetPassword.helpers({
    errorClass: function(key) {
        return Session.get(ERRORS_KEY)[key] && 'error';
    }
});

// onRendered
Template.resetPassword.onRendered(function() {
    var validator = $('.resetPassword').validate({
        rules: {
            confirm: {
                equalTo: '#password'
            }
        },
        submitHandler: function(e) {
            var password = $('[name="password"]').val(),
            	btn = $('.btn-send');

            // Disable button
        	btn.attr('disabled', 'disabled');
            Accounts.resetPassword(Session.get('resetPassword'), password, function(err) {
		        if (err) {
		          	var errorMessage = '';
		          	if (err.message === 'Token expired [403]') {
		            	errorMessage = 'Este link ha expirado.';
		          	} else {
		            	errorMessage = 'Hubo un problema. Intenta luego nuevamente.';
		          	}
		          	var errors = {};
	                errors.password = errorMessage;
	                validator.showErrors({
	                    password: errors.password
	                });
	                Session.set(ERRORS_KEY, errors);
		        } else {
		          	Session.set('resetPassword', null);
		          	FlashMessages.sendSuccess("Tu nuevo password ha sido establecido y haz iniciado sesion.");
		          	Router.go('home');
		        }
	      	});
	      	btn.removeAttr('disabled');
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

// Events
Template.resetPassword.events({
    'submit form': function(e) {
        e.preventDefault();
    }
});
