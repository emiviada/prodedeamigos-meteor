/*** METEOR ACCOUNTS ***/
if (Accounts.emailTemplates) {
    Accounts.emailTemplates.siteName = 'Prode de Amigos';
    Accounts.emailTemplates.from = 'Prode de Amigos <no-reply@prodedeamigos.com>';
    Accounts.emailTemplates.resetPassword.subject = function(user, url) {
        return 'Recupera tu password';
    };
    Accounts.emailTemplates.resetPassword.text = function(user, url) {
        url = url.replace('#/', '')

        var body = 'Hola ' + user.getFullName() + ', \n\r\n\r';
        body += 'Para recuperar tu password, simplemente haz click en el link de abajo.\n\r\n\r';
        body += url + '\n\r\n\r';
        body += 'Gracias.'

        return body;
    };
}

/*** ADMIN ***/
AdminConfig = {
    name: 'Prode de Amigos',
    roles: ['admin'],
    skin: 'green',
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
        },
        Invites: {
            icon: 'link',
            color: 'green',
            tableColumns: [
                { label: 'Fantasy Tournament', name: 'fantasyTournamentId' },
                { label: 'Invitee', name: 'invitee' },
                { label: 'Referrer', name: 'referrerName' },
                { label: 'Token', name: 'token' },
                { label: 'Processed', name: 'processed' }
            ]
        }
    }
};