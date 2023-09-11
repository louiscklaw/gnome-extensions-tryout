#!/usr/bin/env bash

set -x

rm -rf refactor@example.com.shell-extension.zip
gnome-extensions disable refactor@example.com
gnome-extensions uninstall refactor@example.com

set -e

gnome-extensions pack src
ls -l refactor@example.com.shell-extension.zip

gnome-extensions install --force refactor@example.com.shell-extension.zip
rm -rf refactor@example.com.shell-extension.zip

# echo 
# echo -e "\033[31m restart gnome shell by Alt+F2 \033[0m"
# read -p "Press Enter to continue..."
# echo 
killall -SIGQUIT gnome-shell

gnome-extensions enable refactor@example.com
