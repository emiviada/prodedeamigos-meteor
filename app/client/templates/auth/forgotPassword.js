// Template: forgotPassword
var ERRORS_KEY = 'forgotPasswordErrors';

// onCreated
Template.forgotPassword.onCreated(function() {
    Session.set(ERRORS_KEY, {});
});

// onRendered hook
Template.forgotPassword.onRendered(function() {
    var validator = $('.forgotPassword').validate({
    	rules: {
    		email: true,
    	},
        submitHandler: function(e) {
            var btn = $('.btn-primary'),
            	input = $('[name="email"]'),
            	email = input.val().toLowerCase();

			// Disable button
        	btn.attr('disabled', 'disabled');
            Accounts.forgotPassword({email: email}, function(err) {
		        if (err) {
		          	var errorMessage = '';
		          	if (err.message === 'User not found [403]') {
		            	errorMessage = 'La direccion de email no existe.';
		          	} else {
		            	errorMessage = 'Hubo un problema. Intenta luego nuevamente.';
		          	}
		          	var errors = {};
	                errors.email = errorMessage;
	                validator.showErrors({
	                    email: errors.email
	                });
	                Session.set(ERRORS_KEY, errors);
		        } else {
		          	FlashMessages.sendSuccess("Se te ha enviado un email para reestablecer tu password.");
		          	input.val('');
		        }
		        btn.removeAttr('disabled');
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

// Helpers
Template.forgotPassword.helpers({
    errorClass: function(key) {
        return Session.get(ERRORS_KEY)[key] && 'error';
    }
});

// Events
Template.forgotPassword.events({
    'submit form': function(e) {
        e.preventDefault();
    },
    'keyup input[name="email"]': function(e) {
	    if (e.keyCode == 13) {
	    	return;
	    }

	    var _this = $(e.currentTarget),
	        parent = _this.closest('.form-group');

	    if (parent.hasClass('error')) {
	        parent.removeClass('error');
	    }
	}
});
