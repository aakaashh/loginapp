var loginApp = angular.module('loginApp', ['ui.router', 'ngResource']);

loginApp.config(function($stateProvider, $urlRouterProvider){

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'partials/home.html',
            controller: 'homeCtrl',
            data: {
                requireLogin: true
            }
        })

        .state('login', {
            url: '/login',
            templateUrl: 'partials/login.html',
            controller: 'loginCtrl',

            data: {
                requireLogin: false
            }
        })

        .state('signup', {
            url: '/signup',
            templateUrl: 'partials/signup.html',
            controller: 'signupCtrl',
            data: {
                requireLogin: false
            }
        });
});
loginApp.run(function ($rootScope, $state, browserStore) {

    var setUser = function(){
        username = browserStore.getLocal('username');
        if(username !== null){
            $rootScope.currentUser = username;
        }
    };

    setUser();

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        var requireLogin = toState.data.requireLogin;

        if(requireLogin && typeof $rootScope.currentUser === 'undefined') {
            event.preventDefault();
            $state.go('login');
        }
    });



});


loginApp.controller('signupCtrl', function($scope, $resource, $state) {

    $scope.submitForm = function(){
        var Users = $resource('/api/users');
        Users.save($scope.form, function(res) {
            $state.go('login');
        });
    };

});

loginApp.controller('loginCtrl', function($scope, $resource, $state, $rootScope, browserStore) {

    $scope.submitForm = function() {
        var Users = $resource('/api/users/:username/:password');
        Users.get({ username: $scope.form.name, password: $scope.form.password}, function(response){
            if(response.username !== null){
                $rootScope.currentUser = response.username;
                browserStore.setLocal(['username', response.username]);
                $state.go('home');
            }else{
                $scope.errorMessage = response.error;
            }
        });

    };
});

loginApp.controller('homeCtrl', function($scope, $rootScope, $state, browserStore){

    $scope.currentUser = $rootScope.currentUser;

    $scope.logoutFn = function(){
        browserStore.removeLocal('username');
        $rootScope.currentUser = undefined;
        $state.go('login');
    };

});

loginApp.factory('browserStore', function(){

    var returnObject = {};

    returnObject.setLocal = function(keyValue){
        if(localStorage){
            localStorage.setItem(keyValue[0], keyValue[1]);
        }else{
            var d = new Date();
            d.setTime(d.getTime() + (30*24*60*60*1000));
            var expires = "expires="+d.toUTCString();
            document.cookie = keyValue[0] + "=" + keyValue[1] + "; " + expires;
        }
    };

    returnObject.removeLocal = function(key) {
        if(localStorage){
            localStorage.removeItem(key);
        }else{
            document.cookie = key+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
            console.log(document.cookie);
        }
    };

    returnObject.getLocal = function(key) {
        if(localStorage){
            return localStorage.getItem(key);
        }else{
            var name = key + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1);
                if (c.indexOf(name) == 0){
                    console.log(c.substring(name.length,c.length))
                    return c.substring(name.length,c.length);
                }
            }
            return null;
        }
    };

    return returnObject;

});
