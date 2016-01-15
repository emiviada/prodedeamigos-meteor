// Template: lastResults
GAMES_AMOUNT = 15;
// onCreated
Template.lastResults.onCreated(function() {
	var self = this;
	this.autorun(function() {
		self.subscribe('games');
	});
});

// helpers
Template.lastResults.helpers({
	'games': function() {
		return Games.find({finished: true}, {sort: {playDate: -1}, limit: GAMES_AMOUNT});
	}
});
