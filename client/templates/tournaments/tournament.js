if (Meteor.isClient) {
	// Template: tournament
	// Events
    Template.tournament.events($.extend(Events, {}));

    // Helpers
    Template.tournament.helpers({
        'members': function() {
            var members = [], membersIds = [], users, counter = 1;

            this.members.forEach(function(m) {
                membersIds.push(m.userId);
            });
            users = Meteor.users.find({_id: {$in: membersIds}});

            this.members.forEach(function(m) {
                users.map(function(user) {
                    m.pos = counter++;
                    m.user = user;
                    members.push(m);
                });
            });

            return members;
        },
        'games': function() {
            var tournamentId = this.tournamentId,
                fromDate = new Date().toLocaleString();

            return Games.find({ tournamentId: tournamentId, playDate: {$gte: new Date(fromDate)}}, {sort: {playDate: 1}});
        },
        'colspan': function() {
            return (this.matchExact)? 5 : 4;
        }
    });
}
