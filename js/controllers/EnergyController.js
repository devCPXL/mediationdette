'use strict';

/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */

MetronicApp.filter('propsFilter', function() {
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function(item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});

MetronicApp.controller('EnergyController', function($scope, $http, $timeout, Data, $window) {
    //$scope.personselected = {};
    $scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax(); // initialize core components
        TableAdvanced.init();

    });
    //console.log(TableAdvanced.initTable1);

    $scope.people = {};
    Data.get('listMazout/').then(function(data){
        $scope.people = data.data;
        //console.log(data);
    });

    $scope.listMazout = {};
    $scope.changePerson = function(person){
        console.log(person);
        Data.get('listMazout/'+person.dos_jaar+'/'+person.dos_number).then(function(data){
            $scope.listMazout = data;
            $scope.people.selected = person;
            //console.log($scope.listMazout);
        });
    };

    $scope.open_extra_mazout = function(requestMz){
        console.log(requestMz);
        var str = document.URL;
        //myService.set(stock);
        var n = str.indexOf("#");
        var host = str.substring(0, n);

        $window.Mazout = {
            "person" : $scope.people.selected,
            "requestMz" : requestMz
        };
        $window.open(host+'#/energie/ListMazout/extra', '_blank');
    };

    // rapport journalier
    $scope.open_extra_rapportJournalier = function(requestMz){
        console.log(requestMz);
        var str = document.URL;
        //myService.set(stock);
        var n = str.indexOf("#");
        var host = str.substring(0, n);

        $window.Mazout = {
            "person" : $scope.people.selected,
            "requestMz" : requestMz
        };
        $window.open(host+'#/energie/RapportJournalier/extra', '_blank');
    };
});

MetronicApp.controller('ExtraMazoutController', function($scope, $http, $timeout, Data, $window) {
    console.log('ExtraMazoutController');

    $scope.user = {
        name: 'awesome user'
    };

    console.log($window.opener.Mazout);
    $scope.person = $window.opener.Mazout.person;
    $scope.requestMz = $window.opener.Mazout.requestMz;

    Data.get('memberFamily/'+$scope.person.dos_soc_dos).then(function(data){
        $scope.memberFamily = data;
        console.log(data);
    });

    //listeEnergy/previousPayments
    Data.get('listeEnergy/previousPayments/'+$scope.person.dos_jaar+'/'+$scope.person.dos_number).then(function(data){
        $scope.previousPayments = data;
        console.log(data);
    });

    $scope.categoryDescription = [
        "Statut BIM",
        "Personne à bas revenu",
        "Personne surendettée (Médiation de dettes)",
        "Personne à revenu modeste"
    ];

});

MetronicApp.controller('ExtraRapportJournalierController', function($scope, $http, $timeout, Data, $window) {
    console.log('ExtraRapportJournalierController');

    $scope.user = {
        name: 'awesome user'
    };

    console.log($window.opener.Mazout);
    $scope.person = $window.opener.Mazout.person;
    $scope.requestMz = $window.opener.Mazout.requestMz;

    Data.get('memberFamily/'+$scope.person.dos_soc_dos).then(function(data){
        $scope.memberFamily = data;
        console.log(data);
    });

    //listeEnergy/previousPayments
    Data.get('listeEnergy/previousPayments/'+$scope.person.dos_jaar+'/'+$scope.person.dos_number).then(function(data){
        $scope.previousPayments = data;
        console.log(data);
    });

    $scope.categoryDescription = [
        "Statut BIM",
        "Personne à bas revenu",
        "Personne surendettée (Médiation de dettes)",
        "Personne à revenu modeste"
    ];

});