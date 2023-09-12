#!/usr/bin/env bash

set -ex

nodemon \
    --ignore ./dist  \
    --ignore ./src/build \
    --ignore **/node_moodule/** \
    --ignore **/*.zip \
    --watch src \
    --ext '*' --exec "./docker_compile.sh"
