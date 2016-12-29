if (typeof WebAssembly == "undefined") {
  alert('Your browser doesn\'t support WebAssembly')
}

var dump = typedOp((buf, arrType) => console.log(new arrType(buf)))
var cast = typedOp((buf, arrType) => new arrType(buf))

var importObject = {
  mem : new WebAssembly.Memory({ init : 1, max : 2 })
}

fetch('./test.wasm').then(response => response.arrayBuffer())
.then(bytes => instantiate(bytes, importObject))
.then(instance => {
  let mem = instance.exports.memory.buffer;
  let int32arr = cast.int32(mem);

  instance.exports.memory.grow(10);

  console.log('internal', mem.byteLength)
  console.log('external', importObject.mem.buffer.byteLength)

  // test average
  testAverage(instance.exports, int32arr);
})

function testAverage(exports, int32mem) {
  let count = 20000;

  //generate array
  var arr = function (arr, count) {
    for (let i = 0; i < count; i++)
      arr.push(Math.round(Math.random() * 10000))
    return arr;
  }([], count)

  //insert into memory
  let writenow = performance.now()

  let offset = 100;
  for (let i = 0; i < count; i++) {
    int32mem[i + offset] = arr[i]
  }
  console.log('Write to Memory:', performance.now() - writenow)

  let wasmnow = performance.now()
    exports.mathAverage(offset * 4, count)
  console.log('WASM:', performance.now() - wasmnow)

  let jsnow = performance.now()
    js.mathAverage(arr)
  console.log('JS:', performance.now() - jsnow)

  //console.log(resWASM, resJS);
}

function instantiate(bytes, imports) {
  let compiled = WebAssembly.compile(bytes)

  console.log('compiled')
  return compiled.then(m => new WebAssembly.Instance(m, imports))
}

function typedOp(fn) {
  return {
    uint8  : (buf) => fn(buf, Uint8Array),
    uint16 : (buf) => fn(buf, Uint16Array),
    uint32 : (buf) => fn(buf, Uint32Array),
    int8  : (buf) => fn(buf, Int8Array),
    int16 : (buf) => fn(buf, Int16Array),
    int32 : (buf) => fn(buf, Int32Array),
    f32 : (buf) => fn(buf, Float32Array),
    f64 : (buf) => fn(buf, Float64Array)
  }
}
