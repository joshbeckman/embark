(function(window, document){
  var uid = document.getElementById('uid').content,
    embark = {
      uid: uid
    };
  window.embark = embark;
  window.onload = function(){
    window.socket = io.connect(window.location.hostname);
    socket.on('mySocketEvent', mySocketEvent);
  };

  function mySocketEvent (data) {
    
  }

  Number.prototype.toHHMMSS = function () {
    var sec_num = this;
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = Math.round(sec_num - (hours * 3600) - (minutes * 60));

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
  }
})(this, this.document);