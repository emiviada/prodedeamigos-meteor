// Hooks
// After a game's finished, calculate points
Games.after.update(function (userId, doc, fieldNames, modifier, options) {
	if (doc.finished && !this.previous.finished) {
		var fts = FantasyTournaments.find({tournamentId: doc.tournamentId}),
			predictions = Predictions.find({gameId: doc._id}),
			setObj, inc = [], inc2 = [];
		if (fts.count() && predictions.count()) {
			fts.map(function(ft) { // Walk through every fantasy tournament
				predictions.map(function (prediction) { // Walk through every prediction
					setObj = {hit: false, hitExact: false};
					if (!inc[prediction.userId]) {
						inc[prediction.userId] = 0;
					}
					if (!inc2[prediction.userId]) {
						inc2[prediction.userId] = 0;
					}

					if (doc.goalsHome == prediction.goalsHome && doc.goalsAway == prediction.goalsAway) {
						setObj.hit = true;
						setObj.hitExact = true;
						inc[prediction.userId]++;
						inc2[prediction.userId]++;
					} else if (doc.goalsHome > doc.goalsAway && prediction.goalsHome > prediction.goalsAway) {
						setObj.hit = true;
						inc[prediction.userId]++;
					} else if (doc.goalsHome == doc.goalsAway && prediction.goalsHome == prediction.goalsAway) {
						setObj.hit = true;
						inc[prediction.userId]++;
					} else if (doc.goalsHome < doc.goalsAway && prediction.goalsHome < prediction.goalsAway) {
						setObj.hit = true;
						inc[prediction.userId]++;
					}

					// Update the prediction
					Predictions.update({_id: prediction._id}, {$set: setObj});
				});

				// Update each tournament's user
				var points;
				ft.members.forEach(function(member) {
					points = 0;
					if (inc[member.userId] || inc2[member.userId]) {
						points = inc[member.userId] * ft.pointsPerGame;
						if (ft.matchExact) {
							points += inc2[member.userId] * ft.pointsPerExact;
						}
						FantasyTournaments.update(
							{'members.userId': member.userId},
							{$inc: {
								'members.$.hits': inc[member.userId],
								'members.$.hitsExact': inc2[member.userId],
								'members.$.points': points
							}}
						);
					}
				});
			});
		}
	}
});

// If FantasyTournament's owner changed pointsPerGame, update members points
FantasyTournaments.after.update(function (userId, doc, fieldNames, modifier, options) {
	if (doc.pointsPerGame != this.previous.pointsPerGame ||
		(doc.matchExact && doc.pointsPerExact != this.previous.pointsPerExact)) {
			var points;
			doc.members.forEach(function(member) {
				points = member.hits * doc.pointsPerGame;
				if (doc.matchExact) {
					points += member.hitsExact * doc.pointsPerExact;
				}
				FantasyTournaments.update(
					{'members.userId': member.userId},
					{$set: {
						'members.$.points': points
					}}
				);
			});
	}
});
