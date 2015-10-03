// Routes
Router.configure({
    layoutTemplate: 'layout',
    /*loadingTemplate: 'loading',*/
    waitOn: function() {
        var currentUser = Meteor.userId();
        if (currentUser) {
            return Meteor.subscribe('fantasyTournaments');
        } else {
            this.next();
        }
    }
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
    layoutTemplate: 'auth-layout'
});
Router.route('/join', {
    layoutTemplate: 'auth-layout'
});
Router.route('/dashboard', {
    onBeforeAction: function() {
        var currentUser = Meteor.userId();
        if (currentUser) {
            this.next();
        } else {
            this.layout('auth-layout');
            this.render('login');
        }
    }
});
Router.route('/torneo/crear', {
    name: 'createTournament',
    template: 'createTournament',
    waitOn: function() {
        return Meteor.subscribe('tournaments');
    }
});
Router.route('/torneo/editar/:slug', {
    name: 'editTournament',
    template: 'editTournament'/*,
    waitOn: function() {
        return Meteor.subscribe('tournaments');
    }*/
});
