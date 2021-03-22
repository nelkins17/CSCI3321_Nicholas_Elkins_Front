var a, b, displayLength, prevOpIndex, postfixString = "", stackString = "";
var stack = [];
var postfixStack = [];
var mathStack = [];

function updateDisplay(newValue) {
    let displayStr = document.getElementById("display").innerHTML;
    let lastEntry = displayStr.charAt(displayStr.length - 1);
    if(displayStr.length != 0) {
        if(!checkForOperator(lastEntry)) {
            document.getElementById('display').innerHTML += newValue;
            if(checkForOperator(newValue)) {
                num = parseInt(displayStr.substring(prevOpIndex + 1));
                stack.push(num)
                prevOpIndex = document.getElementById('display').innerHTML.length - 1;
            }
        } else {
            if(!checkForOperator(newValue)) 
                document.getElementById('display').innerHTML += newValue; 
        }
    } else {
        if(!checkForOperator(newValue)) 
            document.getElementById('display').innerHTML += newValue;
    }
}

function clearDisplay() {
    document.getElementById('display').innerHTML = "";
    a = null;
    b = null;
}

function solve() {
    if(document.getElementById('display').innerHTML.length == 0) {
        return;
    }

    if(checkForOperator(document.getElementById('display').innerHTML.charAt(document.getElementById('display').innerHTML.length - 1))) {
        document.getElementById('display').innerHTML = "Err";
        return;
    }

    while(postfixStack.length > 0) {                    
        postfixStack.pop();
    }

    while(mathStack.length > 0) {                       
        mathStack.pop();
    }
    displayLength = document.getElementById('display').innerHTML.length;
    manPost(document.getElementById('display').innerHTML);

    while(postfixStack.length > displayLength) {       
        postfixStack.pop();
    }
    calculateFromPostfix();
    document.getElementById('display').innerHTML = mathStack[0];
    if(document.getElementById('display').innerHTML == "undefined") {
        document.getElementById('display').innerHTML = "Err";
    }
}

function add(a, b) {
    return a+b;
}

function subtract(a, b) {
    return a-b;
}

function multiply(a, b) {
    return a*b;
}

function divide(a, b) {
    return a/b;
}

function checkForOperator(value) {
    switch(value) {
        case "+":
            return true;
        case "-":
            return true;
        case "*":
            return true;
        case "/":
            return true;
        default:
            return false;
    }
}

function calc(n) {
    let operator = n.item;
    if(getPrecedence(n.getLeft().item) == -1 && getPrecedence(n.getRight().item) == -1) {     // if leftChild and rightChild of node are not operators
        mathStack.push(calc2(operator, parseInt(n.getLeft().item), parseInt(n.getRight().item)));
    } else if(getPrecedence(n.getLeft().item) == -1) {
        mathStack.push(calc2(operator, parseInt(n.getLeft().item), parseInt(mathStack.pop())));
    } else if(getPrecedence(n.getRight().item) == -1) {
        mathStack.push(calc2(operator, parseInt(mathStack.pop()), parseInt(n.getRight().item)));
    } else {
        let rgt = mathStack.pop();
        let lft = mathStack.pop();
        mathStack.push(calc2(operator, parseInt(lft), parseInt(rgt)));
    }
}

function calc2(operator, left, right) {
    switch(operator) {
        case "+":
            val = add(left, right);
            break;
        case "-":
            val = subtract(left, right);
            break;
        case "*":
            val = multiply(left, right);
            break;
        case "/":
            val = divide(left, right);
            break;
        default:
            val = "";
    }
    return val;
}

function calculateFromPostfix() {
    for(i=0;i<postfixStack.length;i++) {
        n = new MyNode(postfixStack[i]);
        if(getPrecedence(n.item) == -1) {
            stack.push(n);
        } else {
            n.setRight(stack.pop());
            n.setLeft(stack.pop());
            calc(n);
            stack.push(n);
        }
    }
}

function manPost(str) {
    if(str.length == 0) {
        while(stack.length != 0) {
            postfixStack.push(stack.pop());
        }
        
    } else if(getPrecedence(str.substr(0,1)) == -1) {
        let i = 1;
        while(getPrecedence(str.charAt(i)) == -1 && str.length > i) {
            i++;
        }
        postfixStack.push(str.substr(0,i));
        return manPost(str.substring(i));
    } else if(stack.length == 0) { 
        stack.push(str.substr(0,1));
        return manPost(str.substring(1));
    } else {
        while(stack.length != 0 && getPrecedence(str.substr(0,1)) <= getPrecedence(stack[stack.length - 1])) {
            postfixStack.push(stack.pop());
        }
        stack.push(str.substr(0,1));
        return manPost(str.substring(1));
    }
}

function getPrecedence(operator) {
    switch(operator) {
        case "-":
            return 0;
        case "+":
            return 1;
        case "/":
            return 2;
        case "*":
            return 3;
        default:
            return -1;
    }
}

class MyNode {
    constructor(item) {
        this.item = item;
    }

    setLeft(left) {
        this.left = left;
    }

    setRight(right) {
        this.right = right;
    }

    getLeft() {
        return this.left;
    }

    getRight() {
        return this.right;
    }
}