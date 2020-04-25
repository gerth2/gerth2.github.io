var allPlots = [];

/* Wraps our fplot library to allow for dynamic resize on page resize */
function fplotWrapper(options){
    var name = options.target.replace(/^#/, '');;
    allPlots[name] = functionPlot(options);
    return allPlots[name];
}

