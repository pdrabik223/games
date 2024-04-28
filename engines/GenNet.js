function getRandomVal(min, max) {
    return min + Math.random() * (max - min);
}

class Matrix {
    // 
    // let test = new Matrix(2, 2)
	// test.data[0][0] = 3
	// test.data[0][1] = 5
	// test.data[1][0] = 4
	// test.data[1][1] = 6
	

	// let test2 = new Matrix(2, 2)
	// test2.data[0][0] = 1
	// test2.data[0][1] = 2
	// test2.data[1][0] = 3
	// test2.data[1][1] = 4

	// console.log(test.toString())
	// console.log("x")
	// console.log(test2.toString())
	// console.log("=")
	// console.log(Matrix.sum(test, test2).toString())
	// console.log("---------")

    constructor(width, height) {
        this.data = [];
        this.width = width;
        this.height = height;

        for (let h = 0; h < this.height; h++) {
            this.data.push([]);
            for (let w = 0; w < this.width; w++) {
                this.data[h].push(0);
            }
        }
    }

    fillRandom() {
        for (let h = 0; h < this.height; h++) {
            for (let w = 0; w < this.width; w++) {
                this.data[h][w] = getRandomVal(-1, 1);
            }
        }
    }

    randomize(deviation) {
        for (let h = 0; h < this.height; h++) {
            for (let w = 0; w < this.width; w++) {
                this.data[h][w] += getRandomVal(-deviation, deviation);
            }
        }
    }

    static fromMatrix(old) {
        let newMatrix = new Matrix(old.width, old.height);

        for (let h = 0; h < old.height; h++) {
            for (let w = 0; w < old.width; w++) {
                newMatrix.data[h][w] = old.data[h][w];
            }
        }
        return newMatrix

    }
    static multiply(a, b) {
        if (a.width != b.height) {
            throw new Error('Matrix multiplication error, a.width != b.height');
        }
        var result = new Matrix(b.width, a.height);

        for (let h = 0; h < result.height; h++) {
            for (let w = 0; w < result.width; w++) {
                for (let t = 0; t < b.height; t++) {

                    result.data[h][w] += a.data[h][t] * b.data[t][w];

                }
            }
        }
        return result;
    }
    static sum(a, b) {
        if (a.width != b.width) {
            throw new Error('Matrix sum error, a.width != b.width');
        }
        if (a.height != b.height) {
            throw new Error('Matrix sum error, a.height != b.height');
        }
        var result = new Matrix(a.width, a.height);

        for (let h = 0; h < result.height; h++) {
            for (let w = 0; w < result.width; w++) {
                result.data[h][w] = a.data[h][w] + b.data[h][w];
            }
        }
        return result;
    }


    toString() {
        let stringRepresentation = ""

        for (let h = 0; h < this.height; h++) {
            for (let w = 0; w < this.width; w++) {
                stringRepresentation += this.data[h][w] + " ";
            }
            stringRepresentation += "\n"
        }
        return stringRepresentation;
    }

}



export { Matrix };