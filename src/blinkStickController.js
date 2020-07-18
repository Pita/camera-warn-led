const blinkstick = require("blinkstick");
const usbDetect = require("usb-detection");
const TWEEN = require("@tweenjs/tween.js");

const VENDOR_ID = 0x20a0,
  PRODUCT_ID = 0x41e5;

let device = blinkstick.findFirst();
usbDetect.startMonitoring();

usbDetect.on(`add:${VENDOR_ID}:${PRODUCT_ID}`, function (addedDevice) {
  setTimeout(() => {
    device = blinkstick.findFirst();
    console.log("try to find new blinkstick", device);
  }, 300);
});

usbDetect.on(`remove:${VENDOR_ID}:${PRODUCT_ID}`, function (removedDevice) {
  device = null;
});

process.on("SIGINT", () => {
  usbDetect.stopMonitoring();
  if (device) {
    device.turnOff();
  }
  process.exit();
});

module.exports.turnedOn = true;
const initBlinking = () => {
  const color = { r: 0, g: 0, b: 0 };
  const green = new TWEEN.Tween(color)
    .to({ r: 255, g: 0, b: 0 }, 2000)
    .repeat(Infinity)
    .yoyo(true)
    .easing(TWEEN.Easing.Cubic.InOut);
  green.start();

  const tick = () => {
    TWEEN.update();
    if (module.exports.turnedOn && device != null) {
      device.setColor(color.r, color.g, color.b, (err) => {
        if (err) {
          console.error(err);
        }
        setTimeout(tick, 20);
      });
    } else {
      if (device) {
        device.turnOff();
      }
      setTimeout(tick, 20);
    }
  };
  tick();
};

initBlinking();
