if [ ! -d "typings" ]; then
  typings init
fi

typings install dt~es6-shim --global --save

typings install dt~cuid --save --global

