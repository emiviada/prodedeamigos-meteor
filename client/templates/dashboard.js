if (Meteor.isClient) {
	// Template: dashboard
	Template.dashboard.events({
		'click .logout': function(e) {
			e.preventDefault();
			if (Meteor.userId()) {
				Meteor.logout();
				Router.go('home');
			}
		}
	});
}
