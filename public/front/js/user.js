/**
 * Created by Jepson on 2018/7/1.
 */


$(function() {


  // 1. 一进入页面, 需要获取当前用户用户信息, 进行渲染
  $.ajax({
    type: "get",
    url: "/user/queryUserMessage",
    dataType: "json",
    success: function( info ) {
      console.log( info );

      if ( info.error === 400 ) {
        // 说明当前用户没登陆, 直接跳转登陆页
        location.href = "login.html";
        return;
      }

      // 获取到用户信息, 结合模板引擎渲染
      var htmlStr = template( "tpl", info );
      $('#userInfo').html( htmlStr );
    }
  });


  // 2. 点击退出按钮, 实现退出功能, 跳转到登录页
  $('.logoutBtn').click(function() {

    $.ajax({
      type: "get",
      url: "/user/logout",
      dataType: "json",
      success: function( info ) {
        console.log( info )

        if ( info.success ) {
          // 退出成功
          location.href = "login.html";
        }
      }
    })

  })


})