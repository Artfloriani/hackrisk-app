function clearNotifications() {

    cordova.plugins.notification.local.clearAll(function () {
        cordova.plugins.notification.local.cancelAll(function () {
            updateNotifications();
        }, this);
    }, this);
}

function updateNotifications() {

    var prescriptions = JSON.parse(localStorage.getItem("dataPrescriptions"));

    var identifier = 100;

    var today = new Date();

    if (prescriptions != null) {
       
        for (var i = 0; i < prescriptions.length; i++) {

            var dose = new Date(prescriptions[i].start);
            console.log(prescriptions[i]);
            if (prescriptions[i].start != null) {
                
                while (dose < today) {
                    var frequency = prescriptions[i].frequency * 1;
                    if (24.0 / frequency >= 1.0) {
                        dose.setHours(dose.getHours() + 24.0 / frequency);
                    }
                    else {

                        dose.setMinutes(dose.getMinutes() + (24.0 / frequency) * 60);
                    }
                }

                

                var hours = (dose - today);
                hours = hours / 3600000.0;

                var minutes = Math.round((((hours % 1) * 60) * 10) / 10);

                if (minutes == 60) {
                    minutes = 0;
                    hours = hours * 1 + 1;
                }

                hours = Math.floor(hours);

                prescriptions[i].hours = hours;

                if (minutes < 10) {
                    minutes = '0' + minutes;
                }

                var freq = prescriptions[i].days / prescriptions[i].frequency;

                freq = freq * 60 * 1000;

                console.log(prescriptions[i])


                cordova.plugins.notification.local.schedule({
                    id: identifier,
                    title: prescriptions[i].nameDrug + ' ' + prescriptions[i].dose + prescriptions[i].doseUnit,
                    text: 'Next dose in '+hours+' hours and '+ minutes +' minutes',
                    at: dose,
                    every: freq,
                    led: "FF69B4",
                    sound: null
                });

                identifier++;
            }
        }

    }


}