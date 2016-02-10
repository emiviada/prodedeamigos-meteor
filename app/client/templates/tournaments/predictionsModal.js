// Template: predictionsModal

// onCreated
Template.predictionsModal.onCreated(function() {
	var data = this.data,
		self = this;
	this.autorun(function() {
		self.subscribe('gamePredictions', data.gameId);
	});
});

// helpers
Template.predictionsModal.helpers({
	'game': function() {
		return Games.findOne({_id: this.gameId});
	},
	'predictions': function() {
		return Predictions.find({fantasyTournamentId: this.ftid, gameId: this.gameId});
	},
	'getPoints': function(game, prediction) {
		if (game.finished) {
			var ft = FantasyTournaments.findOne({_id: prediction.fantasyTournamentId}),
				points = 0;
			if (ft) {
				if (prediction.hit) {
					points += ft.pointsPerGame;
				}
				if (ft.matchExact && prediction.hitExact) {
					points += ft.pointsPerExact;
				}
			}

			return '(sumo ' + points + ' puntos)';
		}

		return;
	}
});
