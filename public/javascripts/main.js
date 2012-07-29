seajs.use([
    'talk-client',
    'jquery'
], function(talk){
        var content=$('#content'),
            poText=$('#po-text'),
            poSubmit=$('#po-submit');

        var talkClient=talk.create(
                function(data){
                  //  <img src="http://img.xiami.com/res/loop/img/avatar/head_front_lime.png">
                        var tmp= '<div class="bubble self">'
                            +'<p>'+data.msg+'</p>'
                          +' <span class="time"></span>'
                       +' </div>';

                    $(tmp).appendTo(content);
                },   //msgCallback
                function(data){
                    var tmp= '<h1>'+data.sysMsg+'</h1>';


                    $(tmp).appendTo(content);
                },   //systemCallback
                function(){
                    var tmp= '<h6>对方已经离开</h6>';


                    $(tmp).appendTo(content);
                }    //opleaveCallback
        );

    talkClient.enterRoom('11:12')
    poSubmit.click(function(){
        talkClient.sendMsg(poText.val());
        poText.val('');

    });



});