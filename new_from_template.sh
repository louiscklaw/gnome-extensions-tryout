#!/usr/bin/env bash

set -x

rm -rf /home/logic/.local/share/gnome-shell/extensions/example@gjs.guide

set -ex

gnome-extensions create \
  --uuid=example@gjs.guide \
  --name="Example Extension" \
  --description="An example extension" \
  --interactive

code /home/logic/.local/share/gnome-shell/extensions/example@gjs.guide
