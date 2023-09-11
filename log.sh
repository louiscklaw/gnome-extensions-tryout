#!/usr/bin/env bash

set -ex

clear

journalctl -f -o cat /usr/bin/gnome-shell
