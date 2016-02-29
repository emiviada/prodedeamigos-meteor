// Template: editProfile
var ERRORS_KEY = 'editProfileErrors';
// onCreated
Template.editProfile.onCreated(function() {
	var self = this;
	this.autorun(function() {
		self.subscribe('teams');
	});
	Session.set(ERRORS_KEY, {});
});

// onRendered
Template.editProfile.onRendered(function() {
	var currentUser = Meteor.user();
	// Select2
	$('#teams').select2({
		placeholder: (currentUser.profile && currentUser.profile.supportedTeam)? currentUser.getSupportedTeam.alias : '--',
		allowClear: true
	});

	// Form Validation
    var validator = $('.edit-profile-form').validate({
        rules: {
        	email: {
        		email: true
        	}
        },
        messages: {
        	firstname: {
	            required: 'Este campo es requerido'
	        },
	        lastname: {
	            required: 'Este campo es requerido'
	        },
	        email: {
	            required: 'Este campo es requerido',
	            email: 'Por favor, ingresa un email valido'
	        }
        },
        errorPlacement: function(error, element) {
		    error.insertAfter(element);
		},
		submitHandler: function(e) {
            var info = {
            	supportedTeam: $('#teams').val(),
            	about: $('input[name="about"]').val()
            };

            if (currentUser.isTwitterUser) {
            	info.email = $('input[name="email"]').val();
            }
            if (currentUser.isNormalUser) {
            	info.firstname = $('input[name="firstname"]').val();
            	info.lastname = $('input[name="lastname"]').val();
            	info.email = $('input[name="email"]').val();
            }

            Meteor.call('updateProfile', info, function(error, result) {
            	if (error) {
					var errors = {};
                    errors.email = error.reason;
                    validator.showErrors({
                        email: error.reason
                    });
                    Session.set(ERRORS_KEY, errors);
            	} else {
            		Router.go('myProfile');
                    FlashMessages.sendSuccess("Tu perfil ha sido editado exitosamente.");
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
Template.editProfile.helpers({
	'teams': function() {
		return Teams.find({}, {sort: {alias: 1}});
	},
	'errorClass': function(key) {
        return Session.get(ERRORS_KEY)[key] && 'error';
    }
});

// Events
Template.editProfile.events($.extend(Events, {
	'change .profile-pic-uploader': function(e, template) {
		FS.Utility.eachFile(event, function(file) {
		    Images.insert(file, function (err, fileObj) {
		        Meteor.call('updateProfilePicture', fileObj._id, function(error, result) {
		        	if (!error) {
						FlashMessages.sendSuccess("Tu foto de perfil ha sido editada exitosamente.");
	            	}
		        });
		    });
	    });
	},
	'submit form': function(e) {
        e.preventDefault();
    },
    'click .btn-save': function(e) {
    	var btn = $(e.currentTarget);
    	btn.button('loading');
    },
    'keyup input[name="firstname"], keyup input[name="lastname"], keyup input[name="email"]': function(e) {
    	var _this = $(e.currentTarget),
    		parent = _this.closest('.form-group');

		if (parent.hasClass('error')) {
    		parent.removeClass('error');
		}
    },
    'click .change-password': function(e) {
    	e.preventDefault();
    	Modal.show('changePassword');
    }
}));
