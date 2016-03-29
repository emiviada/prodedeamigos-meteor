// Template: tournamentGamesWidget
// Events
Template.tournamentGamesWidget.events($.extend(Events, {}));

// Helpers
Template.tournamentGamesWidget.helpers({
    'games': function() {
        var tournamentId = this.tournamentId;

        return Games.find({
	        	tournamentId: tournamentId,
	        	playDate: {$gte: new Date()}
	        },
	        {sort: {playDate: 1}}
        );
    }
});
