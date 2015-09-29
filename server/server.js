if (Meteor.isServer) {

  	Meteor.publish('teams', function() {
        return Teams.find();
    });

	Meteor.startup(function () {
	  	// code to run on server at startup
	});
}
