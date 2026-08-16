#!/usr/bin/env bash

dir=$(dirname $0);
output=custom.colortemplate
cd "${dir}" && ./bin/createColorTemplate.mjs "$@" > "${output}" && vim -T dumb "+Colortemplate! ${HOME}/.vim" "+q!" "${output}";
if [[ $? -ne 0 ]]; then
  echo "$(cd "${dir}" && ./bin/createColorTemplate.mjs --help)";
fi
