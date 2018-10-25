module.exports = function(controller) {
    controller.on('slash_command', function(bot, message) {
      const ripRegex = /rip <@(\w+)(\|\w+)?>/
      const match = message.text.match(ripRegex);
      const userID = match[1]; // message.user; // This is the sender ID. need to extract from message text instead


      bot.replyPublicDelayed(message, "Burying " + message.text + " six feet under...", () => {
        bot.replyPublicDelayed(message, "My wife was killed by a tree")
      })
    })

}
