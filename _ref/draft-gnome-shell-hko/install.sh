#!/usr/bin/env bash
set -x

# dockerRunUbuntu
# inside docker 
# apt install node-typescript make
# make compile1

rm -rf draft-gnome-shell-hko@louiscklaw.github.io.shell-extension.zip
gnome-extensions disable draft-gnome-shell-hko@louiscklaw.github.io
gnome-extensions uninstall draft-gnome-shell-hko@louiscklaw.github.io
rm -rf ~/.local/share/gnome-shell/extensions/draft-gnome-shell-hko@louiscklaw.github.io

# rm -rf dist
rm -rf ./draft-gnome-shell-hko@louiscklaw.github.io.shell-extension.zip

sleep 0.1

echo 'press a key to continue...'
read 

make pack

gnome-extensions install  ./draft-gnome-shell-hko@louiscklaw.github.io.shell-extension.zip

killall -SIGQUIT gnome-shell

gnome-extensions enable draft-gnome-shell-hko@louiscklaw.github.io
