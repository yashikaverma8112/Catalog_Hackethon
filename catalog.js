const fs = require('fs');

function decodeValue(base, value) {
    return parseInt(value, base);
}

function lagrangeInterpolation(points, k) {
    let result = 0;

    for (let i = 0; i < k; i++) {
        let xi = points[i].x;
        let yi = points[i].y;

        let li = 1;
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                let xj = points[j].x;
                li *= (0 - xj) / (xi - xj);  
            }
        }
        result += yi * li;
    }

    return result;
}

function findConstantTerm(inputJSON) {
    const input = JSON.parse(inputJSON);
    const n = input.keys.n;
    const k = input.keys.k;

    let points = [];

    for (let i = 1; i <= n; i++) {
        if (input[i]) {
            let base = parseInt(input[i].base);
            let value = input[i].value;
            let x = parseInt(i); 
            let y = decodeValue(base, value); 
            points.push({x: x, y: y});
        }
    }

    if (points.length < k) {
        throw new Error("Not enough points to solve for the polynomial");
    }

    const constantTerm = lagrangeInterpolation(points, k);

    return constantTerm;
}


const filePath = './input.json';  

// Read the file
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading file:", err.message);
        return;
    }

    try {
        const result = findConstantTerm(data);
        console.log("The constant term (secret) is:", result);
    } catch (error) {
        console.error("Error:", error.message);
}
});