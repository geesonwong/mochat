// 实现一个命名空间
namespace = {};
namespace.register = function (name) {
  var parent = window;
  var arr = name.split('.');
  for (var i = 0; i < arr.length; i++) {
    if (!parent[arr[i]]) {
      parent[arr[i]] = {};
    }
    parent = parent[arr[i]];
  }
};

$(function () {

  // ==============事件绑定==============

  // feed框：点击
  $('.feed').click(function () {
    if ($('#cover').css('display') == 'block') {// 关闭评论
      $('#cover').click();
    } else {// 打开评论
      $(this).children('.feed-god').toggleClass('feed-god-change');
      $(this).children('.feed-god').toggleClass('feed-god');
      $('#cover').css('display', 'block');
      var pos = $(this).offset().top - 120;
      $('html,body').animate({scrollTop:pos}, 500);
      $(this).toggleClass('opening');
      $(this).css('width', '500px');
      $(this).css('border-left', '0');
      $(this).css('border-top-left-radius', '0');
      $(this).css('border-bottom-left-radius', '0');
      $('#comments').css('display', 'block');
    }
  });

  // cover层：点击
  $('#cover').click(function () {
    $($('.opening')[0]).children('.feed-god-change').toggleClass('feed-god');
    $($('.opening')[0]).children('.feed-god-change').toggleClass('feed-god-change');
    $($('.opening')[0]).css('width', '600px');
    $($('.opening')[0]).css('border', '2px solid black');
    $($('.opening')[0]).css('border-radius', '15px');
    $('.opening').toggleClass('closing');
    $('.opening').toggleClass('opening');
    $('#cover').css('display', 'none');
    $('#comments').css('display', 'none');
    setTimeout(function(){
      $('.closing').toggleClass('closing');
    },800);
  });

  $('footer').click(function(){
    $('html,body').animate({scrollTop:0}, 500);
  });

});