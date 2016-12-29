if (typeof WebAssembly == "undefined") {
  alert('Your browser doesn\'t support WebAssembly')
}

var dump = dumpers();
var importObject = {
  mem : new WebAssembly.Memory({ init : 1, max : 2 })
}

fetch('./test.wasm').then(response => response.arrayBuffer())
.then(bytes => instantiate(bytes, importObject))
.then(instance => {
  console.log(instance);
  let mem = instance.exports.memory.buffer;
  let memLoc = instance.exports.test()

  console.log('internal', mem.byteLength)
  console.log('external', importObject.mem.buffer.byteLength)

  dump.uint8(mem)
  dump.int8(mem)
  dump.f32(mem)

  console.log(instance.exports.test())
})

function instantiate(bytes, imports) {
  let compiled = WebAssembly.compile(bytes)

  console.log('compiled')
  return compiled.then(m => new WebAssembly.Instance(m, imports))
}

function dumpers() {
  let dump = (buf, arrayType) => {
    let arr = new arrayType(buf);

    console.log(arr);
  }

  return {
    uint8  : (buf) => dump(buf, Uint8Array),
    uint16 : (buf) => dump(buf, Uint16Array),
    uint32 : (buf) => dump(buf, Uint32Array),
    int8  : (buf) => dump(buf, Int8Array),
    int16 : (buf) => dump(buf, Int16Array),
    int32 : (buf) => dump(buf, Int32Array),
    f32 : (buf) => dump(buf, Float32Array),
    f64 : (buf) => dump(buf, Float64Array)
  }
}
