if (Meteor.isServer) {

  	Meteor.startup(function () {
	  	// code to run on server at startup
	});

  	Meteor.publish("userData", function () {
	  	return Meteor.users.find({}, {fields: {'services': 1}});
	});

  	Meteor.publish('teams', function() {
        return Teams.find();
    });

    Meteor.publish('tournaments', function() {
        return Tournaments.find();
    });

    Meteor.publish('fantasyTournaments', function() {
        var currentUser = this.userId;
        return FantasyTournaments.find({'members.userId': currentUser});
    });

    Meteor.publish('games', function() {
        return Games.find();
    });

    Meteor.publish('predictions', function() {
		var currentUser = this.userId;
    	return Predictions.find({userId: currentUser});
    });

    Meteor.publish('images', function() {
        return Images.find();
    });

    Images.allow({
		'insert': function () {
		    // add custom authentication code here
		    return true;
		},
		'update': function () {
		    // add custom authentication code here
		    return true;
		},
		'download': function () {
		    // add custom authentication code here
		    return true;
		}
	});

    // Methods
    Meteor.methods({
    	// FantasyTournaments methods
    	'createFantasyTournament': function(object) {
            var currentUser = Meteor.userId();
            if (currentUser) {

                check(object.name, String);
                object.ownerId = currentUser;
                object.members = [{userId: currentUser, hits: 0, hitsExact: 0, points: 0}]; // Join the owner to this
                object.createdAt = new Date();
                object.updatedAt = new Date();

                return FantasyTournaments.insert(object);

            } else {
                throw new Meteor.Error("not-logged-in", "You're not logged-in.");
            }
        },
        'editFantasyTournament': function(id, object) {
        	var currentUser = Meteor.userId();
            if (currentUser) {

                check(object.name, String);
                object.updatedAt = new Date();
                FantasyTournaments.update({_id: id, ownerId: currentUser}, {$set: object});

                return id;

            } else {
                throw new Meteor.Error("not-logged-in", "You're not logged-in.");
            }
        },
        'removeFantasyTournament': function(id) {
        	var currentUser = Meteor.userId();
            if (currentUser) {

                return FantasyTournaments.remove({_id: id, ownerId: currentUser});

            } else {
                throw new Meteor.Error("not-logged-in", "You're not logged-in.");
            }
        },
        // Prediction methods
        'createPrediction': function(object) {
        	return Meteor.call('savePrediction', object, 'create');
        },
        'editPrediction': function(object) {
        	return Meteor.call('savePrediction', object, 'edit');
        },
        'savePrediction': function(object, mode) {
        	var currentUser = Meteor.userId();
            if (currentUser) {
                if (mode === 'create') {
                	object.hit = false;
                	object.hitExact = false;
                	object.createdAt = new Date();
                	object.updatedAt = new Date();
                	return Predictions.insert(object);
                } else if (mode === 'edit') {
                	object.updatedAt = new Date();
                	return Predictions.update({_id: object._id}, {$set: object});
                }
            } else {
                throw new Meteor.Error("not-logged-in", "You're not logged-in.");
            }
        }
    });

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

						if (doc.goalsHome === prediction.goalsHome && doc.goalsAway === prediction.goalsAway) {
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
}
