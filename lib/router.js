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
    onBeforeAction: onBeforeActions.loginRequired
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
        return [Meteor.subscribe('fantasyTournaments'), Meteor.subscribe('tournaments')];
    }
});
