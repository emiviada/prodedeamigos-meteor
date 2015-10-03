if (Meteor.isServer) {

  	Meteor.startup(function () {
	  	// code to run on server at startup
	});

  	Meteor.publish("userData", function () {
	  	return Meteor.users.find({}, {fields: {'services': 1}});
	});

  	/*Meteor.publish('teams', function() {
        return Teams.find();
    });*/

    Meteor.publish('tournaments', function() {
        return Tournaments.find();
    });

    Meteor.publish('fantasyTournaments', function() {
        var currentUser = this.userId;
        return FantasyTournaments.find({members: {$in: [currentUser]}});
    });

    // Methods
    Meteor.methods({
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
        }
    });
}
