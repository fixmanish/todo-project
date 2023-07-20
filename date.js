// exporting function as a module
// this makes the code also get reusable
// this reduces the code blocks

// exporting date.js as module
// not activating the function
// don't use () outside the function name then

// fetching date and modifying according to requirements
exports.getDate = function (){
    const today = new Date();
    
    // formatting date info output
    
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    
    let day = today.toLocaleDateString("en-US", options);
    
    return day;
}


exports.getDay = function (){
    const today = new Date();
    
    // formatting date info output
    
    var options = {
        weekday: "long",
    };
    
    let day = today.toLocaleDateString("en-US", options);
    
    return day;
}

