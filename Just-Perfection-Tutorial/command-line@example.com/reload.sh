#!/usr/bin/env bash

set -x

pushd ..
    rm -rf command-line@example.com.shell-extension.zip
    gnome-extensions disable command-line@example.com
    gnome-extensions uninstall command-line@example.com
popd

set -ex

pushd ..
    gnome-extensions pack command-line@example.com
    ls -l command-line@example.com.shell-extension.zip

    gnome-extensions install --force command-line@example.com.shell-extension.zip
    rm -rf command-line@example.com.shell-extension.zip


    echo 
    echo -e "\033[31m restart gnome shell by Alt+F2 \033[0m"
    read -p "Press Enter to continue..."
    echo 
    killall -SIGQUIT gnome-shell

    gnome-extensions enable command-line@example.com
popd
