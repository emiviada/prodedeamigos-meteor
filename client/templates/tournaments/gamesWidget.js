if (Meteor.isClient) {
	// Template: tournamentGamesWidget
	// Events
    Template.tournamentGamesWidget.events($.extend(Events, {}));

    // Helpers
    Template.tournamentGamesWidget.helpers({
        'games': function() {
            var tournamentId = this.tournamentId,
                fromDate = new Date().toLocaleString();

            return Games.find({ tournamentId: tournamentId, playDate: {$gte: new Date(fromDate)}}, {sort: {playDate: 1}});
        }
    });
}
