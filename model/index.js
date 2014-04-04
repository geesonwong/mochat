var mongo = require('mongoskin');
var dbc = require('../config').config.dbc;

var connection = dbc.host + ':' + dbc.port + '/' + dbc.db;

var db = mongo.db(connection);
var skinDb = new mongo.SkinDb(db, dbc.username, dbc.password);

skinDb.open(function (err, db) {
    if (err) {
        console.log('====== skinDb.open : connect server faild, err:' + err);
        process.exit(1);
    }
});

/*数据库自检，目前只检查集合个数*/
skinDb.collectionNames(function (err, collections) {
    if (err)
        console.log('====== skinDb.collectionNames : list collections faild, err:' + err);
    console.log('====== count of collections is:' + collections.length);
    if (collections.length != dbc.collections_count) {//检查失败，需要重建数据库
        /* room */
        db.createCollection('room', function (err, collection) {
            if (err)
                console.log('====== skinDb.collectionNames : create collection faild, err:' + err);
        })
    }
})

//skinDb.collection('room').indexInformation(function (err, indexInfo) {
//    if (err)
//        console.log('====== skinDb.collectionNames : list collections faild, err:' + err);
//    console.log('====== count of collections is:' + indexInfo);
//})
