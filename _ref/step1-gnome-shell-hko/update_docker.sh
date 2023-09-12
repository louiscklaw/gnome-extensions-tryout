#!/usr/bin/env bash

set -e

# apt update
# apt install -qyy node-typescript make

rm -rf src/build
rm -rf dist

# echo 'press a key to compile...'
# read 

make compile_docker