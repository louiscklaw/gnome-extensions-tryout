#!/usr/bin/env bash

set -x

rm -rf refactor@example.com.shell-extension.zip
gnome-extensions pack ./src
ls -l refactor@example.com.shell-extension.zip

sleep 0.1
gnome-extensions install --force refactor@example.com.shell-extension.zip

sleep 0.1
rm -rf refactor@example.com.shell-extension.zip
