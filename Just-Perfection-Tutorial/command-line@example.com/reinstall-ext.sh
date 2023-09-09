#!/usr/bin/env bash

set -x

pushd ..
    rm -rf command-line@example.com.shell-extension.zip
    gnome-extensions uninstall command-line@example.com
popd

set -ex

pushd ..
    gnome-extensions pack command-line@example.com
    ls -l command-line@example.com.shell-extension.zip

    gnome-extensions install command-line@example.com.shell-extension.zip
    rm -rf command-line@example.com.shell-extension.zip
popd
