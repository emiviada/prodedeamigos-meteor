if (Meteor.isServer) {

  	Meteor.publish("userData", function () {
	  	return Meteor.users.find({}, {fields: {'services': 1}});
	});

  	Meteor.publish('teams', function() {
        return Teams.find();
    });

	Meteor.startup(function () {
	  	// code to run on server at startup
	});
}
