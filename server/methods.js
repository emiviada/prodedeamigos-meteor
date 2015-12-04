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
    },
    // Invites methods
    'sendInvite': function(object) {
    	var currentUser = Meteor.userId();

    	check(object, {invitee: String, referrerId: String, referrerName: String, token: String, fantasyTournamentId: String});

    	if (currentUser) {
            object.processed = false;
            object.createdAt = new Date();
            object.updatedAt = new Date();
            return Invites.insert(object);
        } else {
            throw new Meteor.Error("not-logged-in", "You're not logged-in.");
        }
    },
    // Send Email method
	sendEmail: function (to, from, subject, templateName, templateParams) {
	    check([to, from, subject, templateName], [String]);
	    check(templateParams, Object);

	    // Let other method calls from the same client start running,
	    // without waiting for the email sending to complete.
	    this.unblock();

	    Email.send({
	      	to: to,
	      	from: from,
	      	subject: subject,
	      	html: Handlebars.templates[templateName](templateParams)
	    });
  	}
});
