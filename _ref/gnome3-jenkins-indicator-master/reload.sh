#!/usr/bin/env bash

set -x

gnome-extensions disable jenkins-indicator@philipphoffmann.de
gnome-extensions uninstall jenkins-indicator@philipphoffmann.de
rm -rf ~/.local/share/gnome-shell/extensions/jenkins-indicator@philipphoffmann.de

set -e

mkdir -p  ~/.local/share/gnome-shell/extensions/jenkins-indicator@philipphoffmann.de
cp -r . ~/.local/share/gnome-shell/extensions/jenkins-indicator@philipphoffmann.de

# echo 
# echo -e "\033[31m restart gnome shell by Alt+F2 \033[0m"
# read -p "Press Enter to continue..."
# echo 
killall -SIGQUIT gnome-shell

gnome-extensions enable jenkins-indicator@philipphoffmann.de
