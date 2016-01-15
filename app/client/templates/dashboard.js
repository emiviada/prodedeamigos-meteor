// Template: dashboard
// onRendered
Template.dashboard.onRendered(function() {
	joinFromInvite();
});

// Helpers
Template.dashboard.helpers({
	'tournaments': function() {
		var currentUser = Meteor.userId();
		return FantasyTournaments.find({'members.userId': currentUser});
	}
});
