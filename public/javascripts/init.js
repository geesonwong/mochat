/**
 * Created with JetBrains WebStorm.
 * User: czy
 * Date: 12-7-29
 * Time: 下午1:02
 * To change this template use File | Settings | File Templates.
 */
(function() {
    var alias = {
       'jquery':'jquery/jquery-1.8b2.js',
        'jquery-ui':'jquery/jquery-ui-1.8.21.custom.min.js',
        'socket.io':'socket.io.min.js',
        'main':'main.js',
        'talk':'talk-client.js'
    };

    var map = [

    ];

    var preload = [
       // 'jquery'
    ];

    seajs.config({
        base: '/javascripts',
        alias: alias,
        preload: preload,
        //map: map,
        charset: 'utf-8'
    });

})();
