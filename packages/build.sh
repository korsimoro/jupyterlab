#!/bin/bash
cd docmanager-extension && yarn build &
cd filebrowser-extension && yarn build &
cd services && yarn build &
cd application && yarn build &
cd apputils-extension && yarn build &
wait
