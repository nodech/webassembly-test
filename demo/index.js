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
  testAverage(instance.exports);
})

function testAverage(exports) {
  let int32mem = cast.int32(exports.memory.buffer)
  let count = 10000;

  //generate array
  var arr = function (arr, count) {
    for (let i = 0; i < count; i++)
      arr.push(Math.round(Math.random() * 1000))
    return arr;
  }([], count)

  //insert into wasm/memory
  let writeperf = performance.now()

  let offset = 100
  for (let i = 0; i < count; i++) {
    int32mem[i + offset] = arr[i]
  }

  writeperf = performance.now() - writeperf
  console.log('Write to Memory:', writeperf)


  //call WASM/mathAverage
  let wasmperf = performance.now()

  for(var i = 0; i < 5000; i++)
    exports.mathAverage(offset * 4, count)

  wasmperf = performance.now() - wasmperf

  console.log('WASM:', wasmperf)
  console.log('MEMWRITE + WASM:', wasmperf + writeperf);

  let jsperf = performance.now()

  for(var i = 0; i < 1000; i++)
    js.mathAverage(arr)

  jsperf = performance.now() - jsperf;
  console.log('JS:', jsperf)

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
