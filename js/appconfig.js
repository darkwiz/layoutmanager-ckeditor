//OLD module
define(function () {
    return {
        dialogId : '#container',
        // wrapper : '#open',
        canvas: '#mycanvas',
        rte: {
                    ckeditor: {
                        customConfig: 'config.js',
                        customValues: {
                          pins: [],
                          props: {},
                          picked:{}
                        }
                    }
        }
    }
  });
