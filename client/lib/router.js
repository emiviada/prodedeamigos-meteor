// Global variable to define generic events
Events = {};

var onBeforeActions;

onBeforeActions = {
    loginRequired: function() {
        var currentUser = Meteor.userId();
        if (currentUser) {
            this.next();
        } else {
            this.layout('auth-layout');
            this.render('login');
        }
    },
    alreadyLoggedIn: function () {
        var currentUser = Meteor.userId();
        if (currentUser) {
            Router.go('dashboard');
        } else {
            this.next();
        }
    }
};

// Routes
Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: "notFound"
    /*loadingTemplate: 'loading',
    waitOn: function() {
        var currentUser = Meteor.userId();
        if (currentUser) {
            return Meteor.subscribe('fantasyTournaments');
        } else {
            this.next();
        }
    }*/
});
Router.route('home', {
    path: '/',
    action: function() {
        var currentUser = Meteor.userId(),
            redirectTo = (currentUser)? 'dashboard' : 'login';
        Router.go(redirectTo);
    }
});
Router.route('/login', {
    layoutTemplate: 'auth-layout',
    onBeforeAction: onBeforeActions.alreadyLoggedIn
});
Router.route('/join', {
    layoutTemplate: 'auth-layout',
    onBeforeAction: onBeforeActions.alreadyLoggedIn
});
Router.route('/dashboard', {
    onBeforeAction: onBeforeActions.loginRequired,
    waitOn: function() {
        return [
            Meteor.subscribe('fantasyTournaments'),
            Meteor.subscribe('games'),
            Meteor.subscribe('predictions'),
            Meteor.subscribe('teams'),
            Meteor.subscribe('images')
        ];
    }
});
Router.route('/torneo/crear', {
    name: 'createTournament',
    template: 'createTournament',
    onBeforeAction: onBeforeActions.loginRequired,
    waitOn: function() {
        return Meteor.subscribe('tournaments');
    }
});
Router.route('/torneo/editar/:slug', {
    name: 'editTournament',
    template: 'editTournament',
    onBeforeAction: onBeforeActions.loginRequired,
    data: function() {
        var currentTournament = this.params.slug,
            currentUser = Meteor.userId();

        return FantasyTournaments.findOne({ slug: currentTournament, ownerId: currentUser});
    },
    waitOn: function() {
        return [
            Meteor.subscribe('fantasyTournaments'),
            Meteor.subscribe('tournaments'),
            Meteor.subscribe('invites')
        ];
    }
});
Router.route('/torneo/:slug', {
    name: 'seeTournament',
    template: 'tournament',
    onBeforeAction: onBeforeActions.loginRequired,
    data: function() {
        var currentTournament = this.params.slug,
            currentUser = Meteor.userId();

        return FantasyTournaments.findOne({ slug: currentTournament, 'members.userId': currentUser});
    },
    waitOn: function() {
        return [
            Meteor.subscribe('fantasyTournaments'),
            Meteor.subscribe('games'),
            Meteor.subscribe('predictions'),
            Meteor.subscribe('teams'),
            Meteor.subscribe('images')
        ];
    }
});
Router.route('/torneo/:slug/invitar/:_id', {
    name: 'tournamentInvitation',
    template: 'tournamentInvitation',
    onBeforeAction: onBeforeActions.loginRequired,
    data: function() {
        Session.set('tournamentInvitationToken', this.params._id);

        return;
    },
    onAfterAction: function() {
        if (this.ready()) {
            Router.go('home');
        }
    }
});
Router.route('/invite/:token', {
    name: 'inviteList',
    template: 'inviteList',
    onBeforeAction: onBeforeActions.loginRequired,
    data: function() {
        var invite = Invites.findOne({token: this.params.token, processed: false});
        if (invite) {
            Session.set('invitationToken', this.params.token);
        }

        return invite;
    },
    onAfterAction: function() {
        if (this.ready() && this.data() === undefined) {
            Router.go('home');
        }
    },
    waitOn: function() {
        return Meteor.subscribe('invites');
    }
});

// General events
Events = {
    'click .nav-toggle-alt': function(e) {
        e.preventDefault();
        //get collapse content selector
        var _this = $(e.currentTarget),
            collapse_content_selector = _this.attr('href');

        //make the collapse content to be shown or hide
        var toggle_switch = _this;
        $(collapse_content_selector).slideToggle(function() {
            if (_this.css('display') == 'block') {
                //change the button label to be 'Show'
                toggle_switch.html('<span class="entypo-up-open"></span>');
            } else {
                //change the button label to be 'Hide'
                toggle_switch.html('<span class="entypo-down-open"></span>');
            }
        });

        return false;
    }
};
