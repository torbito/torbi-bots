'use strict'
var express = require('express');
var router = express.Router();
var five, board, servo;

var connectBoard = function(){
  try{
    five = require('johnny-five');
    board = new five.Board({ port: "/dev/ttyACM3" });

    board.on("ready", function() {

      var led = new five.Led(5);
      led.on();
      /*
            var led = new five.Led(5);

            led.fade({
              easing: "linear",
              duration: 1000,
              cuePoints: [0, 0.2, 0.4, 0.6, 0.8, 1],
              keyFrames: [0, 250, 25, 150, 100, 125],
              onstop: function() {
                console.log("Animation stopped");
              }
            });

            var led2 = new five.Led(6);

            led2.fade({
              easing: "linear",
              duration: 1500,
              cuePoints: [0, 0.2, 0.4, 0.6, 0.8, 1],
              keyFrames: [0, 250, 25, 150, 100, 125],
              onstop: function() {
                console.log("Animation stopped");
              }
            });

      */

    });


  }catch (e){
    console.log(e.stack);
  }

}


connectBoard();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/led', function(req, res, next){
  console.log(req.query.pin);

  let led = new five.Led(req.query.pin);

  switch (req.query.do){
    case 'on':
        led.on();
      break;
    case 'off':
        led.off();
      break;
    case 'stop':
        led.stop();
      break;
    case 'brightness':
      led.brightness(req.query.value);
      break;
  }
  res.end();
});

router.get('/servo', function(req, res, next){
  if(!board.isConnected){
    console.log("reconnecting")
    board.connect("/dev/ttyACM3", function(){
      console.log("reconnected")
      if(servo == undefined){
        servo = new five.Servo(10);
      }
    });
  }else{
    if(servo == undefined){
      servo = new five.Servo(req.param('pin'));
    }
  }

  switch (req.param('do')){
    case 'min':
      servo.min();
      break;
    case 'max':
      servo.max();
      break;
    case 'to':
      servo.to(req.param('deg'))
      break;
  }

  res.end();

});

router.post('/led-animation', function(req, res, next){
  console.log(req.body);

  var led = new five.Led(req.body.pin);

  led.fade(req.body.animation);


  res.end();
});



router.post('/servo-animation', function(req, res, next){
  console.log(req.body);
  console.log(req.body.animation);
/*
  if(servo == undefined){
    servo = new five.Servo(req.body.pin);
  }
*/
  var servo1 = new five.Servo({pin:req.body.pin, startAt:90, range: [ 80, 110 ]});
  var animation = new five.Animation(servo1);

  req.body.animation.loop = true;

  animation.enqueue(req.body.animation);

  res.end();

});


router.get('/servo-animation', function(req, res, next){
  console.log(req.query);

  if(servo == undefined){
    servo = new five.Servo(req.query.pin);
  }

  var animation = new five.Animation(servo);

  animation.enqueue({
    cuePoints: [0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1],
    keyFrames: [90,90,85,85,80,80,90,90,100,100],
    duration: 10000

  });


  res.end();

});


router.get('/servo-animations', function(req, res, next){
  var servo1 = new five.Servo(9);
  var servo2 = new five.Servo(10);

  var servos = new five.Servos([servo1,servo2]);

  var animation = new five.Animation(servos);


  var sleep = {
    duration: 500,
    cuePoints: [0, 0.5, 1.0],
    keyFrames: [
      [null, false, { degrees: 45, easing: "outCirc" }],
      [null, { degrees: 136, easing: "inOutCirc" }, { degrees: 180, easing: "inOutCirc" }]
    ]
  };



  animation.enqueue(sleep);


  res.end();

});




module.exports = router;
