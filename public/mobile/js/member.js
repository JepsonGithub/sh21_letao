/**
 * Created by Jepson on 2018/5/15.
 */

$(function() {

  // 1. 一进入页面, 需要进行一次个人信息的 ajax 请求
  $.ajax({
    type: "get",
    url: "/user/queryUserMessage",
    success: function( info ) {
      console.log(info);

      if ( info.error === 400 ) {
        // 说明当前用户没有登录, 跳转到登录页面去
        location.href = "login.html";
        return;
      }

      // 说明当前用户登录了, 需要进行页面模板渲染
      var htmlStr = template("userTpl", info);
      $('#userInfo').html( htmlStr );

    }
  });



  // 2. 点击退出按钮, 进行退出
  $('#logoutBtn').click(function() {

    $.ajax({
      type: "get",
      url: "/user/logout",
      success: function( info ) {
        console.log( info );
        if ( info.success ) {
          // 退出成功, 跳转到登录页
          location.href = "login.html";
        }
      }
    })

  })

})
