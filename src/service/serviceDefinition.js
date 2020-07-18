const Service = require("node-mac").Service;

// Create a new service object
const svc = new Service({
  name: "Camera-warn-light",
  description:
    "Turns on a blinkstick led whenever the camera or microphone is on",
  script: require("path").resolve(__dirname, "../index.js"),
  env: [
    {
      name: "ORIGINAL_USER",
      value: process.env.SUDO_USER,
    },
    {
      name: "ORIGINAL_USER_ID",
      value: process.env.SUDO_UID,
    },
  ],
  // logOnAsUser: true,
});

module.exports = svc;
