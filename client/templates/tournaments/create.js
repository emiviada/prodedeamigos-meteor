if (Meteor.isClient) {
	// Template: createTournament
	Template.createTournament.onRendered(function() {
		// Jquery Wizard
		$("#wizard_vertical").steps({
            headerTag: "h2",
            bodyTag: "section",
            transitionEffect: "slideLeft",
            stepsOrientation: "vertical",
            enableKeyNavigation: false,
            enablePagination: false,
            enableCancelButton: false,
            enableFinishButton: false
        });

        // Pretty check: jquery iCheck
        $('.pretty-check').iCheck({
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
                var matchExact = $('#exact').is(':checked'),
                    object = {
                        tournamentId: $('#tournament').val(),
                        name: $('#fname').val(),
                        pointsPerGame: $('select[name="points"]').val(),
                        matchExact: matchExact,
                        pointsPerExact: (matchExact)? $('select[name="points-exact"]').val() : null
                    };

                Meteor.call('createFantasyTournament', object, function(error, result) {
                    if (!error) {
                        var ft = FantasyTournaments.findOne({_id: result});
                        Router.go('editTournament', { slug: ft.slug }); // Redirect to just created tournament
                        $('.btn-save').button('reset');
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
                    /*if (errors) {
                        Session.set(ERRORS_KEY, errors);
                    }*/
                    $('.btn-save').button('reset');
                }, 100);
            }
        });
	});
    Template.createTournament.helpers({
        'tournaments': function() {
            return Tournaments.find({active: true});
        }
    });
	Template.createTournament.events({
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
}
