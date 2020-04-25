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

function getSingularTag(name) {
  results = document.getElementsByTagName(name);
  if(results.length == 1){
    return results[0]
  } else {
    return null
  }
}

function openNav() {
  document.getElementById("mySidenav").style.width = "40%";
  document.getElementById("main").style.marginLeft = "40%";
  setTimeout(resizeAllPlots, 200);
  stopPropagation(null);
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft= "0";
  setTimeout(resizeAllPlots, 200);
  stopPropagation(null);
}

