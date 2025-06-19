const readline = require("readline")

const add = (a,b) => {
    return a + b;
}
const sub = (a,b) => {
   return a - b;
}
const div = (a,b) => {
    return a / b;
}
const mul = (a,b) => {
    return a * b;
}
const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

read.question("Select the Method (add,sub,mul,div) :", (op) => {
    read.question("Enter the First Number :", (a) => {
        read.question("Enter the Second Number :", (b) => {
            let num1 = Number(a);
            let num2 = Number(b);
            let result;
            switch(op) {
                case "add" : result = add(num1,num2); break;
                case "sub" : result = sub(num1,num2); break;
                case "mul" : result = mul(num1,num2); break;
                case "div" : result = div(num1,num2); break;
                default : result = "Invalid method";
            }

            console.log("Result :", result);
            read.close();
        })
    })
    })

