var rect = require('./rectangle');

function solveRect(l, b){
    console.log("\n\nSolving for rectangle with l= "+ l+ " and b= "+ b);
    
    rect(l, b, (err, rectangle)=> {
        if(err){
            console.log("ERROR: ", err.message);
        }
        else{
            console.log(" Area: ", rectangle.area());
            console.log(" Perimeter: ", rectangle.perimeter());            
        }
    });
    
    console.log("This is after call to rect()");
}

solveRect(2, 4);
solveRect(3, 5);
solveRect(0, 5);
solveRect(-3, 5);
