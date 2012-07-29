seajs.use([
  'talk-client',
  'jquery',
  'template'
], function (talk) {
  var content = $('#content'),
    poText = $('#po-text'),
    poSubmit = $('#po-submit'),
    localStorage= window.localStorage;


    localStorage.setItem('user',{'face':0,'name':'czy'});

  var talkClient = talk.create(
    function (data) {// 聊天信息
      var html = template.render('item', {
        data:data
      });
      $(html).appendTo(content);
    }, //msgCallback
    function (data) {
      var tmp = '<h1>' + data.sysMsg + '<h1>'
      $(tmp).appendTo(content);
    }, //systemCallback
    function () {
      var tmp = '对方已经离开';
      $(tmp).appendTo(content);
    }    //opleaveCallback
  );

  talkClient.enterRoom('11:12');
  poSubmit.click(function () {
    talkClient.sendMsg(poText.val());
    poText.val('');

  });

  template.openTag = "{%";
  template.closeTag = "%}";

});