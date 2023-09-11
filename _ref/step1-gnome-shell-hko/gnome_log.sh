#!/usr/bin/env bash

set -ex

journalctl -f -o cat /usr/bin/gnome-shell
