// Template: tournamentMessages

// Helpers
Template.tournamentMessages.helpers({
	'messages': function() {
		return Messages.find({fantasyTournamentId: this._id});
	}
});

// events
Template.tournamentMessages.events({
	'submit form': function(e) {
        e.preventDefault();
        var input = $('.new-message');

        if (input.val()) {
        	var newMsg = {
        		fantasyTournamentId: this._id,
        		authorId: Meteor.userId(),
        		message: $.trim(input.val())
        	}

        	Meteor.call('leaveMessage', newMsg, function(error) {
        		if (!error) {
        			input.val('');
        		}
        	});
        }
    }
});
