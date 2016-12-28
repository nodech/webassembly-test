#!/bin/sh

# Configure Build Tools
LLVM=$(realpath ../build/llvm/build/bin)
BINARYEN=$(realpath ../build/binaryen/build/bin)
WABT=$(realpath ../wabt/out)

export PATH="$PATH:$LLVM:$BINARYEN:$WABT"
