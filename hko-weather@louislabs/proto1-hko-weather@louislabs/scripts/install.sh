#!/usr/bin/env bash

set -x

gnome-extensions pack src
ls -l api-request@example.com.shell-extension.zip

gnome-extensions install --force api-request@example.com.shell-extension.zip
rm -rf api-request@example.com.shell-extension.zip
