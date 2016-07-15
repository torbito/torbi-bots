
var johnnyApp = angular.module('johnnyApp', ['ngMaterial']);
johnnyApp.config(function($mdIconProvider) {
    $mdIconProvider
        .defaultIconSet('mdi.svg')
});

johnnyApp.controller('johnnyCtrl', function PhoneListController($scope, $http) {

    $scope.leds = [];
    $scope.items = [];
    $scope.animation = true;

    $scope.addRemoveLeds = function(quantity){
        console.log(quantity);
        if(quantity > $scope.items.length){
            $scope.items.push(createLed());
            $scope.addRemoveLeds(quantity);
        }else if(quantity < $scope.items.length){
            $scope.items.pop();
            $scope.addRemoveLeds(quantity);
        }
    }
    
    function createLed(){
        return {
            pin: 0,
            type: "LED",
            brightness: 0,
            status: false,
            animation: createAnimation()
        };
    }

    $scope.convertToServo = function(led){
        led.type = "SERVO";
        led.brightness = undefined;
        led.status = undefined;
        led.degrees = 90;
        led.animation = createServoAnimation();
    }

    $scope.convertToLed = function(servo){
        servo.type = "LED";
        servo.brightness = servo.degrees;
        servo.status = false;
        servo.degrees = undefined;
        servo.animation = createAnimation();
    }

    function createServo(){
        return {
            pin : 10,
            type: "SERVO",
            degrees: 90,
            animation: createServoAnimation()
        }
    }

    function createAnimation(){
        return {
            easing: "linear",
            duration: 2000,
            cuePoints: [0, 0.2, 0.4, 0.6, 0.8, 1],
            keyFrames: [0, 250, 25, 150, 100, 125]
        }
    }

    function createServoAnimation(){
        return {
            cuePoints: [0, 0.2, 0.4, 0.6, 0.8, 1],
            keyFrames: [0, {value: 90}, {value: 60},{value: 90}, {value: 60}, 180],
            duration: 3000,
        }
    }




    $scope.sendAnimation = function(item){
        if(item.type == 'LED'){
            $scope.sendLedAnimation(item);
        }else{
            $scope.sendServoAnimation(item);
        }
    }

    $scope.sendLedAnimation = function(led){
        $http.post('/led-animation', JSON.stringify(led));
    }

    $scope.sendServoAnimation = function(servo){
        console.log(servo);
        console.log(JSON.stringify(servo));
        $http.post('/servo-animation', JSON.stringify(servo)).success(function(){
            console.log("success");
        });
    }

    $scope.setLed = function(pin, doIt, value){
        $http.get('/led?pin='+pin+'&do='+doIt+'&value='+value);
    }

    $scope.animateAll = function(){
        $scope.items.forEach(function(item){
            $scope.sendAnimation(item);
        });
    }


    
    $scope.servoAngle = function(){
        $http.get('/servo?pin=10&do=to&deg='+$scope.servo.deg);
        console.log($scope.servo.deg);
    }

    $scope.playAnimation = function(){
        $http.get('/servo-animation?pin=10');
        $http.get('/servo-animation?pin=9');
    }



    

});
