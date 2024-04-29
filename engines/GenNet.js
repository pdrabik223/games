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

    static fromDeepNet(newNet) {
        this.netShape = newNet.netShape;
        this.weights = []
        this.biases = []

        for (let i = 1; i < this.netShape.length; i++) {
            this.weights.push(Matrix.fromMatrix(newNet.weights[i]));
        }
        for (let i = 1; i < this.netShape.length; i++) {
            this.biases.push(Matrix.fromMatrix(newNet.biases[i]));
        }

    }
    static ReLu(val) {
        if (val > 0) return val
        return 0

    }
    static Logistic(val) {
        return 1 / (1 + Math.pow(Math.E, -val))

    }

    forwardProp(input) {
        var next = input;
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
    static topHugger() {

        let weights1 = [
            [-0.8867005956360696, 0.14216048756588773, -0.7914172355074012, -0.6363826635797438, -0.25305428017548337],
            [0.5928356004400319, -0.5291748864316479, 0.8869020996191912, 0.9671748187755882, 0.8645860896236384],
            [0.16074836436675577, 0.5455896257644004, 0.2729909305633531, 0.2762572210955718, 0.9571850254731284],
            [0.7686864694008171, -0.8275284627930999, 0.009942402315313625, 0.3156622044682962, -0.2454215793831236]]
        let weights2 = [
            [0.018166849981612554, -0.5072796662997097, -0.32552125017104583, -0.886285208361584, -0.050688950954975276],
            [0.38735288996324746, 0.16190418292130904, 0.1916722633364567, 0.5858337346487366, 0.49101660836331185],
            [-0.43250602807293514, -0.9562404268523408, 0.47678850613392676, 0.5223003572479934, 0.4682888427524752],
            [0.32207961387581996, 0.2481130483034586, -0.0017842564325372123, 0.3293760513740409, -0.6538076459069777],
            [0.5657149088288347, -0.9592228224464279, -0.8620517580080747, -0.9399430572534859, 0.7703761948364365]]
        let weights3 = [
            [0.2596893944198637],
            [-0.978068290828928],
            [-0.33412624263973933],
            [0.17557805920860403],
            [0.036608047717853864]]

        let bias1 =
            [[0.9650993136404447, 0.10449741993160533, -0.8612107269742686, -0.7748080487920892, -0.926490064273604]]
        let bias2 =
            [[0.8863930448952728, 0.8624563426458542, 0.14694107870791528, -0.5329746534796729, -0.4704845148991299]]
        let bias3 =
            [[0.38839406679671873]]
        let netShape = [4, 5, 5, 1]
        let net = new DeepNet(netShape)
        net.weights = [weights1, weights2, weights3]
        net.biases = [bias1, bias2, bias3]
        return net
    }
}

class GenNetEngine {
    // top_slugger
    // weights1 = [
    //     [-0.8867005956360696, 0.14216048756588773, -0.7914172355074012, -0.6363826635797438, -0.25305428017548337],
    //     [0.5928356004400319, -0.5291748864316479, 0.8869020996191912, 0.9671748187755882, 0.8645860896236384],
    //     [0.16074836436675577, 0.5455896257644004, 0.2729909305633531, 0.2762572210955718, 0.9571850254731284],
    //     [0.7686864694008171, -0.8275284627930999, 0.009942402315313625, 0.3156622044682962, -0.2454215793831236]]
    // weights1 = [
    //     [0.018166849981612554, -0.5072796662997097, -0.32552125017104583, -0.886285208361584, -0.050688950954975276],
    //     [0.38735288996324746, 0.16190418292130904, 0.1916722633364567, 0.5858337346487366, 0.49101660836331185],
    //     [-0.43250602807293514, -0.9562404268523408, 0.47678850613392676, 0.5223003572479934, 0.4682888427524752],
    //     [0.32207961387581996, 0.2481130483034586, -0.0017842564325372123, 0.3293760513740409, -0.6538076459069777],
    //     [0.5657149088288347, -0.9592228224464279, -0.8620517580080747, -0.9399430572534859, 0.7703761948364365]]
    // weights2 = [
    //     [0.2596893944198637],
    //     [-0.978068290828928],
    //     [-0.33412624263973933],
    //     [0.17557805920860403],
    //     [0.036608047717853864]]

    // // biasses:
    // bias1 =
    //     [[0.9650993136404447, 0.10449741993160533, -0.8612107269742686, -0.7748080487920892, -0.926490064273604]]
    // bias2 =
    //     [[0.8863930448952728, 0.8624563426458542, 0.14694107870791528, -0.5329746534796729, -0.4704845148991299]]
    // bias3 =
    //     [[0.38839406679671873]]

    constructor(existingNet = null, deviation = 0) {
        if (existingNet == null)
            this.net = new DeepNet([4, 7, 5, 1])
        else
            this.net = existingNet

        if (deviation != 0)
            this.net.randomize(deviation)
        // console.log(this.net.toString())
    }

    getDecision(playerYPosition, playerYAcceleration, obstacleYPosition, obstacleXPosition) {
        var input = new Matrix(4, 1)
        input.data[0][0] = playerYPosition
        input.data[0][1] = playerYAcceleration
        input.data[0][2] = obstacleXPosition
        input.data[0][3] = obstacleYPosition
        let result = this.net.forwardProp(input).data[0][0]

        return result > 0.5
    }

}
export { Matrix, DeepNet, GenNetEngine };