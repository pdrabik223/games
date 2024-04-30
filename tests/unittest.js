import { Matrix, DeepNet, GenNetEngine } from "../engines/GenNet.js"


document.getElementById("runUnit").addEventListener("click", runAll);

function assert(testResult) {
    if (!testResult) throw ("Assert fail")
}
function runAll() {
    var passed = true;
    passed = passed && matrixConstructor();
    passed = passed && matrixSum();
    passed = passed && matrixCopy();
    passed = passed && matrixApplyFunction();

    passed = passed && deepNetConstructor();


    if (passed)
        document.getElementById("runUnit").innerHTML = "All good";
    else
        document.getElementById("runUnit").innerHTML = "Failed";
}
function matrixConstructor() {

    let test = new Matrix(2, 2)
    test.data[0][0] = 3
    test.data[0][1] = 5
    test.data[1][0] = 4
    test.data[1][1] = 6


    let test2 = new Matrix(2, 2)
    test2.data[0][0] = 1
    test2.data[0][1] = 2
    test2.data[1][0] = 3
    test2.data[1][1] = 4

    assert(test.data[0][0] == 3)
    assert(test.data[0][1] == 5)
    assert(test.data[1][0] == 4)
    assert(test.data[1][1] == 6)

    assert(test2.data[0][0] == 1)
    assert(test2.data[0][1] == 2)
    assert(test2.data[1][0] == 3)
    assert(test2.data[1][1] == 4)
    // assert(false)
    return true;
}

function matrixSum() {

    let test = new Matrix(2, 2)
    test.data[0][0] = 3
    test.data[0][1] = 5
    test.data[1][0] = 4
    test.data[1][1] = 6


    let test2 = new Matrix(2, 2)
    test2.data[0][0] = 1
    test2.data[0][1] = 2
    test2.data[1][0] = 3
    test2.data[1][1] = 4


    var test3 = Matrix.sum(test, test2)

    assert(test3.data[0][0] == 4)
    assert(test3.data[0][1] == 7)
    assert(test3.data[1][0] == 7)
    assert(test3.data[1][1] == 10)

    assert(test.data[0][0] == 3)
    assert(test.data[0][1] == 5)
    assert(test.data[1][0] == 4)
    assert(test.data[1][1] == 6)

    assert(test2.data[0][0] == 1)
    assert(test2.data[0][1] == 2)
    assert(test2.data[1][0] == 3)
    assert(test2.data[1][1] == 4)
    // assert(false)
    return true;
}

function matrixCopy() {

    let test = new Matrix(2, 2)
    test.data[0][0] = 3
    test.data[0][1] = 5
    test.data[1][0] = 4
    test.data[1][1] = 6

    var test3 = Matrix.copy(test)

    assert(test3.data[0][0] == 3)
    assert(test3.data[0][1] == 5)
    assert(test3.data[1][0] == 4)
    assert(test3.data[1][1] == 6)

    assert(test.data[0][0] == 3)
    assert(test.data[0][1] == 5)
    assert(test.data[1][0] == 4)
    assert(test.data[1][1] == 6)

    test3.randomize(15)

    assert(test3.data[0][0] != 3)
    assert(test3.data[0][1] != 5)
    assert(test3.data[1][0] != 4)
    assert(test3.data[1][1] != 6)

    assert(test.data[0][0] == 3)
    assert(test.data[0][1] == 5)
    assert(test.data[1][0] == 4)
    assert(test.data[1][1] == 6)

    return true;
}


function matrixApplyFunction() {

    let test = new Matrix(2, 2)
    test.data[0][0] = 3
    test.data[0][1] = 5
    test.data[1][0] = 4
    test.data[1][1] = 6

    var test3 = Matrix.applyFunction(test, (x) => { return 2 * x })

    assert(test3.data[0][0] == 6)
    assert(test3.data[0][1] == 10)
    assert(test3.data[1][0] == 8)
    assert(test3.data[1][1] == 12)

    assert(test.data[0][0] == 3)
    assert(test.data[0][1] == 5)
    assert(test.data[1][0] == 4)
    assert(test.data[1][1] == 6)

    return true;
}

function deepNetConstructor() {
    let net = new DeepNet([4, 5, 5, 1])
    let copyNet = DeepNet.copy(net)
    console.log(copyNet.toString())
    console.log(net.toString())

    net.randomize(5)

    console.log(copyNet.toString())
    console.log(net.toString())



}