#!/usr/bin/env bash
set -x

# dockerRunUbuntu
# inside docker 
# apt install node-typescript make
# make compile1

make pack

gnome-extensions install  /workspace/gnome-extensions-tryout/_ref/gnome-clipboard/gnome-clipboard@b00f.github.io.shell-extension.zip

killall -SIGQUIT gnome-shell

gnome-extensions enable gnome-clipboard@b00f.github.io
