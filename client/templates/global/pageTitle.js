if (Meteor.isClient) {
	// Template: pageTitle
    Template.pageTitle.helpers({
        'username': function() {
            return userFullname();
        }
    });
}
