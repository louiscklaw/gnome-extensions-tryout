#!/usr/bin/env bash

set -x

gnome-extensions disable timezone@jwendell
gnome-extensions uninstall timezone@jwendell
rm -rf ~/.local/share/gnome-shell/extensions/timezone@jwendell

set -e

mkdir -p  ~/.local/share/gnome-shell/extensions/timezone@jwendell
cp -r . ~/.local/share/gnome-shell/extensions/timezone@jwendell

# echo 
# echo -e "\033[31m restart gnome shell by Alt+F2 \033[0m"
# read -p "Press Enter to continue..."
# echo 
killall -SIGQUIT gnome-shell

gnome-extensions enable timezone@jwendell
