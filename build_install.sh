#!/usr/bin/env bash

dir=$(dirname $0);
output=custom.colortemplate
vimdata=${VIMDATA:-~/.vim};
cd "${dir}" && ./bin/createColorTemplate.mjs "$@" > "${output}" && vim "+Colortemplate! ${vimdata}" "+q!" "${output}";
if [[ $? -ne 0 ]]; then
  echo "$(cd "${dir}" && ./bin/createColorTemplate.mjs --help)";
fi
