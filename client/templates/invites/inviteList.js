// Template: inviteList
// Helpers
Template.inviteList.helpers({
    processed: function() {
        return this.processed;
    }
});

// onRendered
Template.inviteList.onRendered(function() {
	joinFromInvite();
});
