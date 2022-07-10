const randInt = (max) => {
  return Math.floor(Math.random() * max);
};
exports.randInt = randInt;

exports.selectRandom = (arr) => {
  return arr[randInt(arr.length)];
};

exports.toNumber = (value) => {
  if (typeof value == "function") {
    return value();
  } else if (typeof value == "number") {
    return value;
  } else {
    throw new Error("not a function or a number: " + typeof value);
  }
};

exports.arrayToJSON = (array) => {
  return array.map((x) => {
    return x.toJSON();
  });
};

exports.parseJSON = (input) => {
  return typeof input === "string" ? JSON.parse(input) : input;
};

//
// arrays
//

const sumArray = (array, getValue = (x) => x) => {
  return array.map(getValue).reduce((a, b) => a + b, 0);
};
exports.sumArray = sumArray;

exports.computeAverage = (array, getValue) => {
  return sumArray(array, getValue) / array.length;
};

//
// objects
//

exports.apply = (obj, fn) => {
  /* applies fn to each value in object */
  output = {};
  for (const [key, value] of Object.entries(obj)) {
    output[key] = fn(value);
  }
  return output;
};

// returns a promise that resolves when boolFn returns true
// TODO limit the number of attempts so never an infinite loop?
exports.waitUntil = (boolFn, updateMilliseconds = 300) => {
  const tryAgain = (resolve, reject) => {
    if (boolFn()) {
      // console.log("done waiting!");

      resolve();
    } else {
      // console.log("value", boolFn());

      setTimeout(() => {
        tryAgain(resolve, reject);
      }, updateMilliseconds);
    }
  };

  // console.log("start waiting");
  return new Promise((resolve, reject) => {
    tryAgain(resolve, reject);
  });
};
