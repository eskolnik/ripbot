var Jimp = require('jimp');
var fs = require('fs');
var getURL = require('../env_helper');

module.exports = function(controller) {
  const ripRegex = /rip <@(\w+)(\|\w+)?>/
  controller.hears([ripRegex], 'direct_message,direct_mention', function(bot, message) {
    const match = message.text.match(ripRegex);
    const userID = match[1]; 

    // Hash the user id into an int
    const obfuscID = userID.split('').reduce((a, e, i) => a + (e.charCodeAt(0) ** (i % 5)), 0)

    const assetPath = getURL() + "/static";
    const newPath = "./assets/tmp/"+obfuscID+"_rip.png"
    const newPathStatic = assetPath + "/tmp/" + obfuscID + "_rip.png"

    if (fs.existsSync(newPath)) {
      bot.reply(message, '<@'+userID+'> has been buried six feet under.\n' + newPathStatic);
    } else {
      bot.api.users.info({user: userID}, (err, response) => {
        const user = response.user;
        const profile = user.profile;
        const profileImagePath = profile.image_48 // use small image

        const tombstonePath = assetPath + "/rip.png";

        console.log(`Loading images into JIMP: ${profileImagePath} ${tombstonePath}`);

        Promise.all([
          Jimp.read(tombstonePath),
          Jimp.read(profileImagePath)
        ])
        .then(([tombstoneImg, profileImage]) => {
          console.log("images loaded, compositing new image...");
          return tombstoneImg
            .composite(profileImage, 45, 90)
            .write(newPath);
        })
        .then(() => {
          bot.reply(message, '<@'+userID+'> has been buried six feet under.\n' + newPathStatic);
        })
        .catch((e) => {
          console.log("Error constructing rip image", e);
          bot.reply(message, "That doesn't make any sense! (Something went wrong on our end, try again in a little while)");
        })
      })
    }
  })
}
