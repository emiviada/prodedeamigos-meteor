if (Meteor.isClient) {
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
            }
        }
    });

    // Function to get user's name
    userFullname = function() {
        var currentUser = Meteor.user(),
            name = 'unknown';

        if (currentUser) {
            if (currentUser.profile) {
                name = currentUser.profile.name;
            } else if (currentUser.emails.length) {
                name = currentUser.emails[0].address;
            }
        }

        return name;
    };

    // Template: navigation
    Template.navigation.onRendered(function() {
        var monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
        var dayNames = ["Dom, ", "Lun, ", "Mar, ", "Mie, ", "Jue, ", "Vie, ", "Sab, "]
        var newDate = new Date();

        $('#Date').html(dayNames[newDate.getDay()] + " " + newDate.getDate() + ' ' + monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear());

        //clock
        $('#digital-clock').clock({
            offset: '-3', // TimeZone (ARG is -3)
            type: 'digital'
        });

        // newsTicker
        var nt_title = $('#nt-title').newsTicker({
            row_height: 18,
            max_rows: 1,
            duration: 5000,
            pauseOnHover: 0
        });
    });
    Template.navigation.helpers({
        'username': function() {
            return userFullname();
        }
    });
    Template.navigation.events({
        'click .logout': function(e) {
          e.preventDefault();
          if (Meteor.userId()) {
              Meteor.logout(function(err) {
                  if (!err) {
                      Router.go('home');
                  }
              });
          }
        }
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

/*** ADMIN ***/
AdminConfig = {
    name: 'Prode de Amigos',
    roles: ['admin'],
    collections: {
        Teams: {}
    }
};
