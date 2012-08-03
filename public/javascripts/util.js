/**
 * Created with JetBrains WebStorm.
 * User: czy
 * Date: 12-8-1
 * Time: 上午10:09
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {
    require('cookie');


    dataStorage = {
        set:function (key, data) {
            if (typeof data == 'object') {
                data = JSON.stringify(data);
            }
            $.cookie(key, data, {path:'/' });
        },
        get:function (key) {
            var data = $.cookie(key);

            try {
                data = JSON.parse(data);
            } finally {
                return data;
            }
        },
        remove:function (key) {
            $.cookie(key, null);
        }
    }


    module.exports = {
        'dataStorage':dataStorage
    };
});
