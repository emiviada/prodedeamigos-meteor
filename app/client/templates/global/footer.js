// Template: footer

// Helpers
Template.footer.helpers({
	currentYear: function() {
		return new Date().getFullYear();
	}
});

// Events
Template.footer.events({
	'click .terms': function(e) {
		e.preventDefault();
		Modal.show('terms');
	}
});
