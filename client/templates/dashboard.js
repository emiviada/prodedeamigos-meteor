if (Meteor.isClient) {
	// Template: dashboard
	// Helpers
	Template.dashboard.helpers({
		'tournaments': function() {
			var currentUser = Meteor.userId();
			return FantasyTournaments.find({'members.userId': currentUser});
		}
	});
}
