function stopPropagation(e){
  if (!e)
    e = window.event;

  //IE9 & Other Browsers
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  //IE8 and Lower
  else {
    e.cancelBubble = true;
  }
}

function openNav() {
  document.getElementById("mySidenav").style.height = "750px";
  stopPropagation(null);
}

function closeNav() {
  document.getElementById("mySidenav").style.height = "0";
  stopPropagation(null);
}

