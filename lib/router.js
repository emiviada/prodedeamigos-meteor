// Routes
Router.configure({
    /*layoutTemplate: 'main',
    loadingTemplate: 'loading',
    waitOn: function() {
        return [Meteor.subscribe('users'), Meteor.subscribe('projects')];
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
