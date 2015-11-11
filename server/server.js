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
        return FantasyTournaments.find({members: {$in: [currentUser]}});
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
                object.members = [currentUser]; // Join the owner to this
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
}
