// Methods
Meteor.methods({
    // Users methods
    'updateProfile': function(info) {
        var currentUser = Meteor.userId();

        check(info, {firstname: String, lastname: String, email: String, supportedTeam: String, about: String});

        if (currentUser) {
            if (info.email !== Meteor.user().getEmailAddress) { // Update email
                Meteor.users.update({_id: currentUser}, {$set: {"emails.0.address": info.email}});
                delete info.email;
            }
            info.name = info.firstname + ' ' + info.lastname;
            return Meteor.users.update({_id: currentUser}, {$set: {"profile": info}});
        } else {
            throw new Meteor.Error("not-logged-in", "You're not logged-in.");
        }
    },
    'updateProfilePicture': function(pictureId) {
        var currentUser = Meteor.userId();

        check(pictureId, String);

        if (currentUser) {
            return Meteor.users.update({_id: currentUser}, {$set: {"profile.picture": pictureId}});
        } else {
            throw new Meteor.Error("not-logged-in", "You're not logged-in.");
        }
    },
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
  	},
    // Join from an invite (received by email)
    joinFromInvite: function(token) {
        check(token, String);
        // Find Invite
        var invite = Invites.findOne({token: token, processed: false});
        if (invite) {
            var newMember = {
                userId: Meteor.userId(),
                hits: 0,
                hitsExact: 0,
                points: 0
            };
            // Update FantasyTournament
            FantasyTournaments.update({_id: invite.fantasyTournamentId}, {$push: {members: newMember}});
            // Update Invite
            Invites.update({token: token, processed: false}, {$set: {processed: true}});
        }
    },
    // Join from a tournament invite (link)
    joinFromTournamentInvite: function(ftid) {
        check(ftid, String);
        // Find the Fantasy Tournament
        var ft = FantasyTournaments.findOne({_id: ftid});
        if (ft) {
            // Check if user already is joined
            var inviteeEmail = Meteor.user().getEmailAddress(),
                existingInvite = Invites.findOne({fantasyTournamentId: ftid, invitee: inviteeEmail});

            if (!existingInvite) {
                // Create an Invite
                var newInvite = {
                    invitee: inviteeEmail,
                    referrerId: ft.ownerId,
                    referrerName: ft.ownerId,
                    token: Random.hexString(10),
                    fantasyTournamentId: ftid,
                    processed: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                Invites.insert(newInvite);

                // Join the user with the fantasy tournament
                var newMember = {
                    userId: Meteor.userId(),
                    hits: 0,
                    hitsExact: 0,
                    points: 0
                };
                FantasyTournaments.update({_id: ftid}, {$push: {members: newMember}});
            }
        }
    }
});
