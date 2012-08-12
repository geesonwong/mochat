/**
 * config file
 *
 */

var path = require('path');

exports.config = {

    dbc:{
        host:'localhost',
        db:'chatnow',
        port:'27017',
        username:'',
        password:'',
        auto_reconnect:true,

        /*用于程序启动时，数据库自检*/
        collections_count:1,
        indexes_count:0
    }



}