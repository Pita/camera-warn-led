const os = require("os");
if (os.userInfo().uid === 0) {
  console.error("Downgrade to ", parseInt(process.env.ORIGINAL_USER_ID, 10));
  process.setuid(parseInt(process.env.ORIGINAL_USER_ID, 10));
}

console.log("started as user", os.userInfo());

const Tail = require("tail").Tail;
const lineHasGoodTimeRange = require("./timeRange");
const blinkStickController = require("./blinkStickController");
const _ = require("lodash");

const tail = new Tail(
  `/Users/${
    process.env.ORIGINAL_USER || process.env.USER
  }/Library/Application Support/Objective-See/OverSight/OverSight.log`,
  { fromBeginning: true }
);

const activeRegex = /Device became active \((.*?),/;
const inActiveRegex = /Device became inactive \((.*)\)/;

const devices = {};
const onUpdate = _.debounce(() => {
  blinkStickController.turnedOn = _.some(devices, (device) => device === "on");
  console.log(
    `light is turned ${blinkStickController.turnedOn ? "on" : "off"}`
  );
}, 100);

tail.on("line", function (line) {
  if (!lineHasGoodTimeRange(line)) {
    return;
  }

  const activeMatch = activeRegex.exec(line);
  if (activeMatch !== null) {
    const deviceName = activeMatch[1];
    devices[deviceName] = "on";
    console.log(`${deviceName} is on`);
  }

  const inactiveMatch = inActiveRegex.exec(line);
  if (inactiveMatch !== null) {
    const deviceName = inactiveMatch[1];
    devices[deviceName] = "off";
    console.log(`${deviceName} is off`);
  }

  onUpdate();
});
