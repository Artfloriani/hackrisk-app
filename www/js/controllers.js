angular.module('starter.controllers', [])

.controller('DashCtrl', function ($scope, $state) {
    $scope.prescription = function () {
        $state.go('tab.prescription');
    }

    $scope.exams = function () {
        $state.go('tab.exams');
    }
})

.controller('ChatsCtrl', function($scope, Drugs, claraAPI, $timeout) {
    


  $scope.$on('$stateChangeSuccess', function (event, toState) {
      claraAPI.getPrescriptions().success(function (data) {
          window.localStorage.setItem('dataPrescriptions', JSON.stringify(data));
          Drugs.update();
      });
  });

  $scope.prescription = [];

  $scope.process = function () {

      claraAPI.getPrescriptions().success(function (data) {
          window.localStorage.setItem('dataPrescriptions', JSON.stringify(data));


          Drugs.update();

          var temp = Drugs.all();

          if (temp.length != $scope.prescription.length){
              $scope.prescription = temp;
              


              var today = new Date();
              for (var i = 0; i < $scope.prescription.length; i++) {
                  var dose = new Date($scope.prescription[i].start);
                  if ($scope.prescription[i].start != null) {
                      while (dose < today) {
                          var frequency = $scope.prescription[i].frequency * 1;
                          dose.setHours(dose.getHours() + 24 / frequency);
                      }

                      var hours = (dose - today);
                      hours = hours / 3600000;

                      var minutes = Math.round((((hours % 1) * 60) * 10) / 10);

                      hours = Math.floor(hours);

                      $scope.prescription[i].hours = hours;
                      $scope.prescription[i].minutes = minutes;

                  }
                  else {
                      $scope.prescription[i].hours = 0;
                  }
              }

              function compare(a, b) {
                  if (a.nextDose < b.nextDose)
                      return -1;
                  if (a.nextDose > b.nextDose)
                      return 1;
                  return 0;
              }

              var temp = $scope.prescription;

              temp.sort(function (a, b) { return parseFloat(a.hours) - parseFloat(b.hours) });

              $scope.prescription = temp;

              for (var i = 0; i < $scope.prescription.length; i++) {
                  if ($scope.prescription[i].start == null) {
                      $scope.prescription[i].nextDose = 'Not taken yet';
                  } else {
                      $scope.prescription[i].nextDose = 'Next dose in ' + $scope.prescription[i].hours + ' hours and ' + $scope.prescription[i].minutes + ' minutes';
                  }

              }
          }
         });
      
  
  $timeout(function () { $scope.process(); }, 1000);
  }

  $scope.process();

  

  
})



.controller('ChatDetailCtrl', function ($scope, $stateParams, Drugs, claraAPI, $timeout) {
    $scope.takenDose = true;

    $scope.drug = Drugs.get($stateParams.prescriptionId);

    if ($scope.drug.start == null) {
        $scope.drug.start = 'Not taken yet'
        $scope.takenDose = false;
    } else {
        var startDate = new Date($scope.drug.start);
        $scope.drug.startText = startDate.getDate() + '/' + startDate.getMonth() + '/' + startDate.getFullYear() + ' at ' + startDate.getHours() + ':' + startDate.getMinutes();
        var startDate = new Date($scope.drug.date);
        $scope.drug.date = startDate.getDate() + '/' + startDate.getMonth() + '/' + startDate.getFullYear() + ' at ' + startDate.getHours() + ':' + startDate.getMinutes();

    }
    


    
    $scope.processDetail = function () {

       

        var today = new Date();
        var dose = new Date($scope.drug.start);
        while (dose < today) {
            var frequency = $scope.drug.frequency * 1;
            dose.setHours(dose.getHours() + 24 / frequency);
        }

        var hours = (dose - today);
        hours = hours / 3600000;

        var minutes = Math.round((((hours % 1) * 60) * 10) / 10);

        hours = Math.floor(hours);

        $scope.drug.hours = hours;


        $scope.drug.nextDose = 'In ' + hours + ' hours and ' + minutes + ' minutes';

        $timeout(function () { $scope.processDetail(); }, 1000);
    }

    

    $scope.recordDose = function () {
        var d = new Date();
        var month = d.getMonth() * 1 + 1;
        if (month < 10) {
            month = '0' + month;
        }
        $scope.drug.startText = d.getDate() + '/' + month + '/' + d.getFullYear() + ' - ' + d.getHours() + ':' + d.getMinutes();

        var date2 = d.getFullYear() + '-' + month + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();

        claraAPI.putPrescriptions($stateParams.prescriptionId, date2).success(function (data) {
            claraAPI.getPrescriptions().success(function (data) {
                window.localStorage.setItem('dataPrescriptions', JSON.stringify(data));

                Drugs.update();
                $scope.drug = Drugs.get($stateParams.prescriptionId);

                if ($scope.drug.start == null) {
                    $scope.drug.start = 'Not taken yet'
                    $scope.takenDose = false;
                } else {
                    var startDate = new Date($scope.drug.start);
                    $scope.drug.startText = startDate.getDate() + '/' + startDate.getMonth() + '/' + startDate.getFullYear() + ' at ' + startDate.getHours() + ':' + startDate.getMinutes();
                    var startDate = new Date($scope.drug.date);
                    $scope.drug.date = startDate.getDate() + '/' + startDate.getMonth() + '/' + startDate.getFullYear() + ' at ' + startDate.getHours() + ':' + startDate.getMinutes();

                }

                $scope.takenDose = true;


                $scope.processDetail();
                
            });
        });
        
    }

   

    $scope.processDetail();

    

})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})
.controller('ExamsCtrl', function ($scope, claraAPI) {

    $scope.saveGlucose = function (value) {
        if (!isNaN(value) && value > 0 && value < 1000)
        {
            claraAPI.postExam(value).success(function (data) {
                
            });
        }
     

    }
});
