var angle;


var Cylon = require('cylon');

Cylon.robot({
connections:{
arduino: { adaptor: 'firmata', port: '/dev/tty.usbmodem411'}
},
devices:{
sg90: { driver: 'servo', pin: 3, connection: 'arduino' }
},
work: function(my) {
  angle = my.sg90.currentAngle();
  every((0.5).second(), function() {
    if (angle > 160) {
      angle = 20;
    }
    my.sg90.angle(angle);
    console.log((String('the angle is ') + String(angle)));
    angle = angle + 20;
  });
}
}).start();

process.on('message', function(m) {
  console.log('worker got message:', m);
  process.exit();
});