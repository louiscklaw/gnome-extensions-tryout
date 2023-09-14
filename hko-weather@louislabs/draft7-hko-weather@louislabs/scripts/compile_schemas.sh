#!/usr/bin/env bash

set -ex

pushd src
    glib-compile-schemas schemas/
popd