function getRandomVal(min, max) {
    //Math.random() * (max - min) + min;

    return (Math.random() * (max - min)) + min;
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

    constructor(width, height, data = null) {
        this.data = [];
        this.width = width;
        this.height = height;

        if (data == null)
            for (let h = 0; h < this.height; h++) {
                this.data.push([]);
                for (let w = 0; w < this.width; w++) {
                    this.data[h].push(0);
                }
            }
        else
            for (let h = 0; h < this.height; h++) {
                this.data.push([]);
                for (let w = 0; w < this.width; w++) {
                    this.data[h] = [...data[h]]
                }
            }
    }
    static copy(old) {
        return new Matrix(old.width, old.height, old.data);
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
    static applyFunction(a, func) {
        let newMatrix = new Matrix(a.width, a.height);

        for (let h = 0; h < a.height; h++) {
            for (let w = 0; w < a.width; w++) {
                newMatrix.data[h][w] = func(a.data[h][w]);
            }
        }
        return newMatrix

    }
    static randomMatrix(width, height, min = -1, max = 1) {

        let newMatrix = new Matrix(width, height);
        for (let h = 0; h < height; h++) {
            for (let w = 0; w < width; w++) {
                newMatrix.data[h][w] = getRandomVal(min, max);
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
            throw new Error('Matrix sum error, a.width != b.width\n' + a.toString() + "\n" + b.toString());
        }
        if (a.height != b.height) {
            throw new Error('Matrix sum error, a.height != b.height\n' + a.toString() + "\n" + b.toString());
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
        let stringRepresentation = "w: " + this.width + " h: " + this.height + "\n"

        for (let h = 0; h < this.height; h++) {
            for (let w = 0; w < this.width; w++) {
                stringRepresentation += this.data[h][w] + " ";
            }
            stringRepresentation += "\n"
        }
        return stringRepresentation;
    }

}

class DeepNet {
    // DeepNet([4,5,5, 1])
    constructor(netShape) {
        this.netShape = netShape;
        this.weights = []
        this.biases = []

        for (let i = 1; i < this.netShape.length; i++) {
            this.weights.push(Matrix.randomMatrix(netShape[i], netShape[i - 1]));
        }
        for (let i = 1; i < this.netShape.length; i++) {
            this.biases.push(Matrix.randomMatrix(this.netShape[i], 1));
        }
    }

    static copy(old) {
        let newNet = new DeepNet(old.netShape);

        for (let i = 0; i < newNet.weights.length; i++) {
            newNet.weights[i] = Matrix.copy(old.weights[i]);
        }
        for (let i = 0; i < newNet.biases.length; i++) {
            newNet.biases[i] = Matrix.copy(old.biases[i]);
        }
        return newNet
    }

    static ReLu(val) {
        if (val > 0) return val
        return 0

    }
    static Logistic(val) {
        return 1 / (1 + Math.pow(Math.E, -val))

    }

    forwardProp(input) {
        var next = Matrix.copy(input);
        for (let i = 0; i < this.netShape.length - 1; i++) {
            next = Matrix.multiply(next, this.weights[i])
            next = Matrix.sum(next, this.biases[i])
            next = Matrix.applyFunction(next, DeepNet.Logistic)
        }
        return next;
    }

    toString() {
        let stringRepresentation = "net shape: " + this.netShape
        stringRepresentation += "\nweights:\n";
        for (let i = 0; i < this.weights.length; i++) {
            stringRepresentation += this.weights[i].toString()
        }
        stringRepresentation += "\nbiases:\n";
        for (let i = 0; i < this.biases.length; i++) {
            stringRepresentation += this.biases[i].toString()
        }
        return stringRepresentation;

    }

    randomize(deviation) {
        for (let i = 0; i < this.weights.length; i++) {
            this.weights[i].randomize(deviation)
        }
        for (let i = 0; i < this.biases.length; i++) {
            this.biases[i].randomize(deviation)
        }

    }

}

class GenNetEngine {

    constructor(existingNet = null, deviation = 0) {
        if (existingNet == null)
            this.net = new DeepNet([4, 7, 1])
        else {
            this.net = DeepNet.copy(existingNet)
        }

        if (deviation != 0)
            this.net.randomize(deviation)
    }

    getDecision(playerYPosition, playerYAcceleration, obstacleYPosition, obstacleXPosition) {
        var input = new Matrix(4, 1)
        input.data[0][0] = playerYPosition
        input.data[0][1] = playerYAcceleration
        input.data[0][2] = obstacleXPosition
        input.data[0][3] = obstacleYPosition

        if (playerYPosition < 0 || playerYPosition > 1) throw ("playerYPosition: " + playerYPosition)
        if (playerYAcceleration < 0 || playerYAcceleration > 1) throw ("playerYAcceleration: " + playerYAcceleration)
        if (obstacleXPosition < 0 || obstacleXPosition > 1) throw ("obstacleXPosition: " + obstacleXPosition)
        if (obstacleYPosition < 0 || obstacleYPosition > 1) throw ("obstacleYPosition: " + obstacleYPosition)


        let result = this.net.forwardProp(input).data[0][0]

        return result > 0.5
    }

}
export { Matrix, DeepNet, GenNetEngine };