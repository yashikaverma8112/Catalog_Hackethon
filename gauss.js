
const inputData = require('./input.json');

function decodeValue(base, value) {
    return parseInt(value, base);
}

function gaussianElimination(matrix, constants) {
    const n = matrix.length;

    for (let i = 0; i < n; i++) {
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(matrix[k][i]) > Math.abs(matrix[maxRow][i])) {
                maxRow = k;
            }
        }

        [matrix[i], matrix[maxRow]] = [matrix[maxRow], matrix[i]];
        [constants[i], constants[maxRow]] = [constants[maxRow], constants[i]];

        for (let k = i + 1; k < n; k++) {
            const factor = matrix[k][i] / matrix[i][i];
            for (let j = i; j < n; j++) {
                matrix[k][j] -= factor * matrix[i][j];
            }
            constants[k] -= factor * constants[i];
        }
    }

    const solution = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        let sum = 0;
        for (let j = i + 1; j < n; j++) {
            sum += matrix[i][j] * solution[j];
        }
        solution[i] = (constants[i] - sum) / matrix[i][i];
    }

    return solution;
}

function findConstantTerm(input) {
    const n = input.keys.n;
    const k = input.keys.k;

    let points = [];

    for (let i = 1; i <= n; i++) {
        if (input[i]) {
            let base = parseInt(input[i].base);
            let value = input[i].value;
            let x = parseInt(i);
            let y = decodeValue(base, value);
            points.push({ x: x, y: y });
        }
    }

    if (points.length < k) {
        throw new Error("Not enough points to solve for the polynomial");
    }

   
    const matrix = [];
    const constants = [];

    for (let i = 0; i < k; i++) {
        const row = [];
        let xi = points[i].x;
        for (let j = k - 1; j >= 0; j--) {
            row.push(Math.pow(xi, j));  
        }
        matrix.push(row);
        constants.push(points[i].y); 
    }

    const coefficients = gaussianElimination(matrix, constants);

    const constantTerm = coefficients[coefficients.length - 1];

    return constantTerm;
}

try {
    const result = findConstantTerm(inputData);
    console.log("The constant term (secret) is:", result);
} catch (error) {
    console.error("Error:", error.message);
}
