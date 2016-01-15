// Template: changePassword
var ERRORS_KEY = 'changePasswordErrors';
// onCreated
Template.changePassword.onCreated(function() {
	Session.set(ERRORS_KEY, {});
});

// onRendered
Template.changePassword.onRendered(function() {
	//var currentUser = Meteor.user();
	// Form Validation
    var validator = $('.change-password-form').validate({
        rules: {
        	current: {
                required: true,
                minlength: 6
            },
            newone: {
                required: true,
                minlength: 6
            },
            newone_confirm: {
                required: true,
                minlength: 6,
                equalTo: '#newone'
            }
        },
        messages: {
        	current: {
	            required: 'Este campo es requerido',
                minlength: 'Por favor, ingresa al menos {0} caracteres'
	        },
	        newone: {
	            required: 'Este campo es requerido',
                minlength: 'Por favor, ingresa al menos {0} caracteres'
	        },
	        newone_confirm: {
	            required: 'Este campo es requerido',
	            equalTo: 'Los password no coinciden',
                minlength: 'Por favor, ingresa al menos {0} caracteres'
	        }
        },
        errorPlacement: function(error, element) {
		    error.insertAfter(element);
		},
		submitHandler: function(e) {
            var oldPassword = $('input[name="current"]').val(),
                newPassword = $('input[name="newone"]').val(),
                newPasswordConfirm = $('input[name="newone_confirm"]').val();

            Accounts.changePassword(oldPassword, newPassword, function(error) {
                if (error) {
                    var errors = {};
                    if (error.reason == "Incorrect password") {
                        errors.current = error.reason;
                        validator.showErrors({
                            current: "El password actual es incorrecto."
                        });
                    }
                    Session.set(ERRORS_KEY, errors);
                } else {
                    FlashMessages.sendSuccess("Tu password ha sido modificado exitosamente.");
                    Modal.hide('changePassword');
                }
                $('.btn-save').button('reset');
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
                $('.btn-save').button('reset');
            }, 100);
        }
    });
});

// Helpers
Template.changePassword.helpers({
	'errorClass': function(key) {
        return Session.get(ERRORS_KEY)[key] && 'error';
    }
});

// Events
Template.changePassword.events({
	'submit form': function(e) {
        e.preventDefault();
    },
    'click .btn-save': function(e) {
    	var btn = $(e.currentTarget);
    	btn.button('loading');
    },
    'keyup input[name="current"], keyup input[name="newone"], keyup input[name="newone_confirm"]': function(e) {
        var _this = $(e.currentTarget),
            parent = _this.closest('.form-group');

        if (parent.hasClass('error')) {
            parent.removeClass('error');
        }
    }
});
