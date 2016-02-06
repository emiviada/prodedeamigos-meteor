
// General Subscriptions
Meteor.subscribe('userData');
Meteor.subscribe('teams');

// Reset Password
if (Accounts._resetPasswordToken) {
    Session.set('resetPassword', Accounts._resetPasswordToken);
}

// Set validator defaults
$.validator.setDefaults({
    rules: {
        password: {
            minlength: 6
        }
    },
    messages: {
        email: {
            required: 'Este campo es requerido',
            email: 'Por favor, ingresa un email valido'
        },
        password: {
            required: 'Este campo es requerido',
            minlength: 'Por favor, ingresa al menos {0} caracteres'
        },
        confirm: {
            required: 'Este campo es requerido',
            minlength: 'Por favor, ingresa al menos {0} caracteres',
            equalTo: 'Los passwords no coindiden'
        },
        tournament: {
            required: 'Este campo es requerido'
        },
        fname: {
            required: 'Este campo es requerido',
            minlength: 'Por favor, ingresa al menos {0} caracteres'
        }
    }
});

// Added customized method in validator to validate multiple email addresses
$.validator.addMethod(
    'multiemails',
    function(value, element) {
        if (this.optional(element)) { // return true on optional element
            return true;
        }
        var emails = value.split(/[;,]+/); // split element by , and ;
        valid = true;
        for (var i in emails) {
            value = emails[i];
            valid = valid && $.validator.methods.email.call(this, $.trim(value), element);
        }
        return valid;
    },
    $.validator.messages.email
);

// Function to check which dropdown's option is selected
UI.registerHelper('selected', function(a, b) {
    var selected = (a == b)? 'selected' : '';
    return selected;
});

// Function to format date with momentJS
UI.registerHelper('formatDate', function(date, format) {
    var r = null;
    if (date && format) {
        r = moment(date).format(format);
    }
    return r;
});

// Global functions
joinFromInvite = function() {
    // Individual invitation (by email)
    if (Session.get('invitationToken')) {
        Meteor.call('joinFromInvite', Session.get('invitationToken'), function(error) {
            if (!error) {
                FlashMessages.sendSuccess("Te has unido al torneo exitosamente.");
            }
        });
        Session.set('invitationToken', null);
    }
    // Tournament invitation (link)
    if (Session.get('tournamentInvitationToken')) {
        Meteor.call('joinFromTournamentInvite', Session.get('tournamentInvitationToken'), function(error) {
            if (!error) {
                FlashMessages.sendSuccess("Te has unido al torneo exitosamente.");
            }
        });
        Session.set('tournamentInvitationToken', null);
    }
};

// Window resizing
window.addEventListener('resize', function(event){
    var width = $(window).width();
    if (width < 768) {
        setTimeout(function(){ $("#skin-select #toggle").addClass('active').trigger('click'); }, 10);
    }
});
