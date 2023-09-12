#!/usr/bin/env bash


sudo chown 1000:1000 -R ./dist ./src/build
rm -rf ./dist ./src/build
mkdir -p ./dist ./src/build

sleep 0.1

# for debugging docker image
# docker build . -t temp_compile
# docker run -it \
#     -v .:/workspace \
#     -w /workspace \
#     temp_compile bash

# exit 0

docker run -t \
    -v .:/workspace \
    -w /workspace \
    temp_compile ./update_docker.sh

# suppose
rm -rf draft-gnome-shell-hko@louiscklaw.github.io.shell-extension.zip
gnome-extensions disable draft-gnome-shell-hko@louiscklaw.github.io
gnome-extensions uninstall draft-gnome-shell-hko@louiscklaw.github.io
rm -rf ~/.local/share/gnome-shell/extensions/draft-gnome-shell-hko@louiscklaw.github.io
rm -rf ./draft-gnome-shell-hko@louiscklaw.github.io.shell-extension.zip

make pack
gnome-extensions install  ./draft-gnome-shell-hko@louiscklaw.github.io.shell-extension.zip

echo 'press a key to restart shell...'
read 

killall -SIGQUIT gnome-shell

gnome-extensions enable draft-gnome-shell-hko@louiscklaw.github.io
