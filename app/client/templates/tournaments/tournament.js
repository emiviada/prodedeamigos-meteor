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
        users = Meteor.users.find({_id: {$in: membersIds}}, {fields: {'services': 1, 'emails': 1, 'profile': 1}});

        this.members.forEach(function(m) {
            users.map(function(user) {
                if (m.userId === user._id) {
                    m.user = user;
                    members.push(m);
                }
            });
        });

        return members.sort(function(a, b) {
            return a.points < b.points;
        });
    },
    'pos': function(index) {
        return index + 1;
    },
    'games': function() {
        var tournamentId = this.tournamentId,
            fromDate = new Date().toLocaleString();

        return Games.find({ tournamentId: tournamentId, playDate: {$gte: new Date(fromDate)}}, {sort: {playDate: 1}});
    },
    'previousGames': function() {
        var tournamentId = this.tournamentId,
            fromDate = new Date().toLocaleString();

        return Games.find(
            {
                tournamentId: tournamentId,
                playDate: {$lte: new Date(fromDate)}
            },
            {
                sort: {playDate: -1},
                limit: 30
            }
        );
    },
    'colspan': function() {
        return (this.matchExact)? 5 : 4;
    }
});

// onRendered
/*Template.tournament.onRendered(function() {
    // Tabs
    $(".wizard-tab").steps({
        headerTag: "h2",
        bodyTag: "section",
        transitionEffect: "none",
        enableFinishButton: false,
        enablePagination: false,
        enableAllSteps: true,
        titleTemplate: "#title#",
        cssClass: "tabcontrol"
    });
});*/
