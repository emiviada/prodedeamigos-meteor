// Template: formTournament
Template.formTournament.onRendered(function() {
	// Pretty check: jquery iCheck
    var prettyCheck = $('.pretty-check');
    prettyCheck.iCheck({
        checkboxClass: 'icheckbox_flat-blue',
        radioClass: 'iradio_flat-blue'
    }).on('ifChanged', function(e){
	  	var checkbox = $(e.currentTarget);

	  	checkbox.attr('checked', !checkbox.attr('checked'));
	  	checkbox.trigger('change');
	});

    // Form Validation
    var validator = $('.tournament-form').validate({
        rules: {
            fname: {
                minlength: 3
            }
        },
        errorPlacement: function(error, element) {
		    error.insertBefore(element);
		},
		submitHandler: function(e) {
            var form = $(e),
                matchExact = $('#exact').is(':checked'),
                object = {
                    tournamentId: $('#tournament').val(),
                    name: $('#fname').val(),
                    pointsPerGame: $('select[name="points"]').val(),
                    matchExact: matchExact,
                    pointsPerExact: (matchExact)? $('select[name="points-exact"]').val() : null
                };

            // Edit
            if (form.hasClass('edit')) {
                var _id = form.data('ftid');
                // In edit mode, remove tournamentId property
                delete object.tournamentId;
                Meteor.call('editFantasyTournament', _id, object, function(error, result) {
                    if (!error) {
                        var ft = FantasyTournaments.findOne({_id: _id});
                        Router.go('editTournament', { slug: ft.slug });
                        $('.btn-save').button('reset');
                        FlashMessages.sendSuccess("Torneo editado exitosamente.");
                    }
                });
            // Create
            } else {
                Meteor.call('createFantasyTournament', object, function(error, result) {
                    if (!error) {
                        var ft = FantasyTournaments.findOne({_id: result});
                        Router.go('editTournament', { slug: ft.slug }); // Redirect to just created tournament
                        $('.btn-save').button('reset');
                        FlashMessages.sendSuccess("Torneo creado exitosamente. Ahora puedes invitar amigos.");
                    }
                });
            }
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
                $('.btn-save').button('reset');
            }, 100);
        }
    });
});
Template.formTournament.helpers({
    'tournaments': function() {
        return Tournaments.find({active: true});
    },
    'editingClass': function() {
        return (Router.current().route.getName() == 'editTournament') && 'edit';
    },
    'disabledMode': function() {
        return (Router.current().route.getName() == 'editTournament')? 'disabled' : '';
    },
    'btnLabel': function() {
        return (Router.current().route.getName() == 'editTournament')? 'Editar' : 'Crear Torneo';
    },
    'btnLoadingText': function() {
        return (Router.current().route.getName() == 'editTournament')? 'Editando...' : 'Creando...';
    },
    'checked': function() {
        var prettyCheck = $('.pretty-check');
        if (this.matchExact) {
            prettyCheck.iCheck('check');
        } else {
            prettyCheck.iCheck('uncheck');
        }
        return;
    },
    'displayMatchExactDropdown': function() {
        return (this.matchExact)? 'inline-block' : 'none';
    }
});
Template.formTournament.events({
	'submit form': function(e) {
        e.preventDefault();
    },
    'click .btn-save': function(e) {
    	var btn = $(e.currentTarget);
    	btn.button('loading');
    },
	'change #exact': function(e) {
		var check = $(e.currentTarget),
			exactSelect = $('#points-exact-wrapper');

		if (check.is(':checked')) {
			exactSelect.show();
			exactSelect.find('select').attr('required', 'required');
		} else {
			exactSelect.hide();
			exactSelect.find('select').removeAttr('required');
		}

		return;
	}
});
