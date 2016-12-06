/**
 * Created by lakroubassi.n on 20/10/2016.
 */


MetronicApp.controller('CreditorController', function($scope, $http, $timeout, Data, $window) {
    TableEditable.init($scope, Data);

    //console.log(dataTable);

    $scope.person = {};
    $scope.creditors = {};

    $scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax(); // initialize core components
        //TableAdvanced.init();

    });
    //console.log(TableAdvanced.initTable1);

    $scope.people = {};
    Data.get('creditors/').then(function(data){
        $scope.creditors = data;
        //console.log(data);
    });




});