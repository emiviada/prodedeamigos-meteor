/*** ADMIN ***/
AdminConfig = {
    name: 'Prode de Amigos',
    roles: ['admin'],
    collections: {
        FantasyTournaments: {
            icon: 'trophy',
            color: 'orange',
            extraFields: ['tournamentId', 'ownerId'],
            tableColumns: [
                { label: 'Name', name: 'name' },
                { label: 'Based on', name: 'tournament().name' },
                { label: 'Owner', name: 'owner().getFullName()' },
                { label: 'Pts per game', name: 'pointsPerGame' },
                { label: 'Exact', name: 'matchExact' },
                { label: 'Pts per exact', name: 'pointsPerExact' }
            ],
            routes: {
                'view': {
                    waitOn: function () { return Meteor.subscribe('tournaments'); }
                }
            }
        },
        Games: {
            icon: 'futbol-o',
            color: 'aqua',
            extraFields: ['tournamentId', 'teamHomeId', 'teamAwayId', 'goalsHome', 'goalsAway'],
            tableColumns: [
                { label: 'Tournament', name: 'tournament().name' },
                { label: 'Game', name: 'v()' },
                { label: 'Result', name: 'result()' },
                { label: 'Play Date', name: 'playDate' },
                { label: 'Finished', name: 'finished' }
            ],
            routes: {
                'view': {
                    waitOn: function() { return [Meteor.subscribe('tournaments'), Meteor.subscribe('teams')]; }
                },
                'new': {
                    waitOn: function() { return [Meteor.subscribe('tournaments'), Meteor.subscribe('teams')]; }
                },
                'edit': {
                    waitOn: function() { return [Meteor.subscribe('tournaments'), Meteor.subscribe('teams')]; }
                }
            }
        },
        Teams: {
            icon: 'futbol-o',
            color: 'green',
            tableColumns: [
                { label: 'Name', name: 'name' }
            ],
            routes: {
                'new': {
                    waitOn: function () { return Meteor.subscribe('images'); }
                },
                'view': {
                    waitOn: function () { return Meteor.subscribe('images'); }
                },
                'edit': {
                    waitOn: function () { return Meteor.subscribe('images'); }
                }
            }
        },
        Tournaments: {
            icon: 'trophy',
            color: 'yellow',
            tableColumns: [
                { label: 'Name', name: 'name' },
                { label: 'Active', name: 'active' }
            ],
            routes: {
                'new': {
                    waitOn: function () { return Meteor.subscribe('teams'); }
                },
                'edit': {
                    waitOn: function () { return Meteor.subscribe('teams'); }
                }
            }
        }
    }
};