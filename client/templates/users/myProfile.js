// Template: myProfile
// onCreated
Template.myProfile.onCreated(function() {
	var self = this;
	this.autorun(function() {
		self.subscribe('teams');
	});
});
