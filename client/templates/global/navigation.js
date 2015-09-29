if (Meteor.isClient) {
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
