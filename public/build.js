({
    baseUrl: "./src",
    dir: "./dist",
    optimize: "uglify",
    optimizeCss: "standard",
    removeCombined: false,

//    mainConfigFile: "../js/main.js",
//    fileExclusionRegExp: /^\./,
    shim: {
        'socketio': {
            exports: 'io'
        },
        'iscroll': {
            exports: 'iscroll'
        }
    },
    paths: {
        'jquery': 'lib/jquery/jquery-1.11.0.min',
        'socketio': 'lib/socket-io/socket.io',
        'template': 'lib/template/template',
        'bootstrap': 'lib/bootstrap/js/bootstrap.min',
        'iscroll': 'lib/iscroll/iscroll'
    },
    modules: [
        {
            name: "javascript/webapp/main"
        }
    ]
})