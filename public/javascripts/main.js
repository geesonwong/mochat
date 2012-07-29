seajs.use([
    'jquery',
    'socket.io',
    'talk-client'
], function($, sio,talk){
        var talkClient=talk.create(
                function(){

                },   //msgCallback
                function(){

                },   //systemCallback
                function(){

                }    //opleaveCallback
        )




});