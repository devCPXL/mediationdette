/**
 * Created by lakroubassi.n on 20/10/2016.
 */


MetronicApp.controller('MediationController', function($scope, $http, $timeout, Data, $window) {
    $scope.person = {};
    $scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax(); // initialize core components
        TableAdvanced.init();

    });
    //console.log(TableAdvanced.initTable1);

    $scope.people = {};
    Data.get('listDossier/').then(function(data){
        $scope.dossiers = data.data;
        //console.log(data);
    });

    $scope.changePerson = function(person){
        Data.get('memberFamily/'+person.dos_soc_dos).then(function(data){
            $scope.memberFamily = data;
        });
    };


});