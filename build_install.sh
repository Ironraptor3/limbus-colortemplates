#!/usr/bin/env bash

dir=$(dirname $0);
output=custom.colortemplate
cd "${dir}" && ./bin/createColorTemplate.mjs "$@" > "${output}" && vim "+Colortemplate! ~/.vim" "+q!" "${output}";
if [[ $? -ne 0 ]]; then
  echo "The command failed... printing usage!";
  echo "$(cd "${dir}" && ./bin/createColorTemplate.mjs --help)";
fi
