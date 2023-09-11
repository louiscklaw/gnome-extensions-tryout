#!/usr/bin/env bash

sudo chown 1000:1000 -R ./dist
rm -rf ./dist

sleep 0.1

# docker build . -t temp_compile

docker run -it \
    -v .:/workspace \
    -w /workspace \
    temp_compile ./update_docker.sh

# suppose
rm -rf draft-gnome-shell-hko@louiscklaw.github.io.shell-extension.zip
gnome-extensions disable draft-gnome-shell-hko@louiscklaw.github.io
gnome-extensions uninstall draft-gnome-shell-hko@louiscklaw.github.io
rm -rf ~/.local/share/gnome-shell/extensions/draft-gnome-shell-hko@louiscklaw.github.io

rm -rf ./draft-gnome-shell-hko@louiscklaw.github.io.shell-extension.zip

sleep 0.1

echo 'press a key to continue...'
read 

make pack

gnome-extensions install  ./draft-gnome-shell-hko@louiscklaw.github.io.shell-extension.zip

killall -SIGQUIT gnome-shell

gnome-extensions enable draft-gnome-shell-hko@louiscklaw.github.io
