/* Callback to resize plot width to its container width */
function resizeAllPlots(){
    for(const name in allPlots){
        if(document.getElementById(name)){
            allPlots[name].options.width = document.getElementById(name).clientWidth;
            allPlots[name].build(); /* poke poke poke into the private API? */
        }
    }
}

/* Register callbacks */
document.getElementsByTagName("BODY")[0].onresize = resizeAllPlots; /*Trigger when page resizes */
document.getElementsByTagName("BODY")[0].onload = resizeAllPlots;   /*Trigger once after page inital load */

  