Meteor.publish("userData", function () {
  	return Meteor.users.find({}, {fields: {'services': 1, 'emails': 1, 'profile': 1, 'createdAt': 1}});
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

Meteor.publish('gamePredictions', function(gameId) {
    return Predictions.find({gameId: gameId});
});

Meteor.publish('invites', function() {
    return Invites.find();
});

Meteor.publish('messages', function(ftId) {
    return Messages.find({fantasyTournamentId: ftId});
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
