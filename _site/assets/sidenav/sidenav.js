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
  document.getElementById("mySidenav").style.width = "550px";
  getSingularTag("main").style.marginLeft = "550px";
  stopPropagation(null);
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  getSingularTag("main").style.marginLeft= "0";
  stopPropagation(null);
}

