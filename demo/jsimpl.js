if (typeof global == "undefined") {
  global = window;
}

let js = {};

global.js = js;

js.mathAverage = function (array) {
  let sum = 0;
  
  for (let i = 0; i < array.length; i++)
    sum += array[i];

  return sum / array.length;
}
