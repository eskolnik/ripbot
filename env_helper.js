module.exports = function() {
  if(process.env.NODE_ENV !== 'production') {
    return "https://5bca8ae0.ngrok.io";
  } else {
    return "https://taps-ripbot.herokuapp.com";
  }
}