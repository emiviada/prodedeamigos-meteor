if (Meteor.isClient) {
	// Template: editTournament
	// onRendered
    Template.editTournament.onRendered(function() {
        var ftId = this.data._id;
        // Form Validation
        var validator = $('.invite-form').validate({
            rules: {
                emails: { required: true, multiemails: true }
            },
            messages: {
                emails: {
                    required: "Debes ingresar al menos una direccion de email.",
                    multiemails: "Alguna de las direcciones de email no es valida."
                }
            },
            errorPlacement: function(error, element) {
                error.insertBefore(element);
            },
            submitHandler: function(e) {
                var form = $(e),
                    field = form.find('.multiemails'),
                    emails = field.val().split(/[;,]+/), // split element by , and ;
                    invite = {};

                for (var i in emails) { // Create an invite for each email
                    invite = {
                        invitee: $.trim(emails[i]),
                        referrerId: Meteor.userId(),
                        referrerName: Meteor.user().getFullName(),
                        token: Random.hexString(10),
                        fantasyTournamentId: ftId
                    }
                    Meteor.call('sendInvite', invite, function(error, result) {
                        if (!error) {
                            var invite = Invites.findOne({_id: result}),
                                ft = FantasyTournaments.findOne({_id: invite.fantasyTournamentId});

                            // Send email
                            if (invite && ft) {
                                var token = invite.token,
                                    url = window.location.origin + '/invite/' + token,
                                    tournamentName = ft.name,
                                    referrerName = invite.referrerName;

                                Meteor.call('sendEmail',
                                    invite.invitee,
                                    "Prode de amigos <" + invite.referrer + ">",
                                    invite.referrer + " te ha invitado a participar de un torneo!",
                                    'send-invite',
                                    {
                                        url: url,
                                        referrerName: referrerName,
                                        tournamentName: tournamentName
                                    }
                                );
                            }
                        }
                    });
                } // end FOR

                FlashMessages.sendSuccess("Las invitaciones han sido enviadas.");
                field.val('');
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

    // Events
    Template.editTournament.events({
		'mousedown .delete, click .delete': function(e) {
			e.preventDefault();
            var id = this._id,
                confirm = window.confirm('Deseas eliminar este torneo?');
            if (confirm) {
                Meteor.call('removeFantasyTournament', id, function(error) {
                	if (!error) {
                		Router.go('home');
                        FlashMessages.sendInfo("El torneo ha sido eliminado exitosamente.");
                	}
                });
            }
		},
        'submit form.invite-form': function(e) {
            e.preventDefault();
        }
	});
}
