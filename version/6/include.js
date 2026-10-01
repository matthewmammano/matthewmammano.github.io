document.addEventListener("DOMContentLoaded", function(event) {
  var x = 0;

  var comm = setInterval(commencement, 2000);

  function commencement() {
    document.getElementsByClassName("title1")[0].style.webkitAnimationPlayState = "running";
    document.getElementsByClassName("title2")[0].style.webkitAnimationPlayState = "running";
    document.getElementsByClassName("socialLinks")[0].style.webkitAnimationPlayState = "running";
  }


// var distTop = 0;
// var scrolly = window.setInterval(function() {
//   distTop = window.scrollY;
//   if (distTop > 0) movingSocials("left");
// }, 20);
//
// function movingSocials(pos) {
//   var el = document.getElementsByClassName("socialLinks")[0];
//   if (pos == "left") {
//     var start = 0;
//     var lefty = window.setInterval(function() {
//       if (start > 150) window.clearInterval(lefty);
//       start = el.style.bottom;
//       el.style.bottom = start;
//       start += 1;
//     }, 20);
//   }
// }


  var x = 0;
  var loading = window.setInterval(function() {
    if (x > 5) window.clearInterval(loading);
    document.getElementsByClassName("titleContainer")[0].style.width = document.getElementById("MContainerOuter").offsetWidth + "px";
    x++;
  }, 20);


});
