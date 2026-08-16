#!/usr/bin/env bash

dir=$(dirname $0)
script="${dir}"/build_install.sh;
if [ ! -d ${dir}/colors ]; then
  export VIMDATA=${dir};
  "${script}" --name limbus;
  "${script}" --name limbus_avg_light -e -1 -o -1;
  "${script}" --name limbus_avg_sat -s -1;
  "${script}" --name limbus_avg_all -e -1 -o -1 -s -1;
  "${script}" --name limbus_full_sat -s 1;
  "${script}" --name limbus_bright -e 0.5 -o 0.7;
  "${script}" --name limbus_full_sat_bright -s 1 -e 0.5 -o 0.7;
  zip -r colors colors
else
  echo "Colors directory already exists, failing cowardly!";
fi
