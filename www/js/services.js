angular.module('starter.services', [])

.factory('Drugs', function() {
  // Might use a resource here that returns a JSON array

    // Some fake testing data
    /*
  var chats = [{
    id: 0,
    name: 'Paracetamol',
    lastText: 'Next dose: 14:23',
    face: 'img/parecetamol.jpg',
    datePrescription: '22/05/2015',
    dose: '500 mg',
    frequency: '5 days every 8 hours',
    dateFirstDonse: '22/05/2015 13:54',
    reason: 'dsadsadsadsa',
      nextDose: 'Today at 22:34'
  }, {
    id: 1,
    name: 'iBuprofen',
    lastText: 'Waiting for first dose',
    face: 'img/ibuprofen.jpg',
      datePrescription: '22/05/2015',
      dose: '500 mg',
      frequency: '5 days every 8 hours',
    dateFirstDonse: '22/05/2015 13:54',
    reason: 'iBuprofen helps minimize the pain and reduce inflamation',
      nextDose: 'Today at 22:34'
  },{
    id: 2,
    name: 'Vitamin B12',
    lastText: 'Next dose: After lunch (aprox. 13:00)',
    face: 'img/b12.jpg',
    datePrescription: '22/05/2015',
    dose: '500 mg',
    frequency: '5 days every 8 hours',
    dateFirstDonse: 'Not taken',
    reason: 'Flu',
      nextDose: 'null'
  }
  ];*/

    var icons = new Array('img/parecetamol.jpg', 'img/ibuprofen.jpg', 'img/b12.jpg', 'img/b12.jpg', 'img/ibuprofen.jpg', 'img/parecetamol.jpg');
    console.log(icons);

    var drugs = JSON.parse(window.localStorage.getItem('dataPrescriptions'));

  return {
      all: function () {
          for (var i = 0; i < drugs.length; i++) 
                  drugs[i].face = icons[i];
        return drugs;
    },
    remove: function(chat) {
        drugs.splice(drugs.indexOf(chat), 1);
    },
    get: function(drugId) {
        for (var i = 0; i < drugs.length; i++) {
            if (drugs[i].idPrescription === parseInt(drugId)) {
                drugs[i].face = icons[i];
          return drugs[i];
        }
      }
      return null;
    },
    update: function () {
        drugas = [];
        drugs = JSON.parse(window.localStorage.getItem('dataPrescriptions'));
        return null;
    }
  };
})
.factory('claraAPI', ['$http', function ($http) {
    return {
        getPrescriptions: function () {
            return $http.get('http://hackrisk.utfapp.com/prescriptions', {
                headers: {
                }
            });
        },
        putPrescriptions: function (id, date) {
            $http.defaults.headers.common['startTime'] = date;
            return $http.put('http://hackrisk.utfapp.com/prescriptions/' + id, 
                {
                }
            );
        },
        postExam: function (value) {
            $http.defaults.headers.common['examValue'] = value;
            $http.defaults.headers.common['examType'] = "glycemia";
            return $http.post('http://hackrisk.utfapp.com/exams',
                {
                }
            );
        },
    }
}]);;
