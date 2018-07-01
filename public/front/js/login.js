/**
 * Created by Jepson on 2018/7/1.
 */

$(function() {


  // 点击登陆功能
  // 1. 绑定点击事件
  // 2. 获取输入框的值 (用户名和密码)
  // 3. 发送 ajax 请求, 进行登录
  //    如果传递过来了 url 地址, 根据 url 地址跳回去
  //    如果没传 url 地址, 默认跳转到会员中心

  $('#loginBtn').click(function() {
    var username = $('[name="username"]').val();
    var password = $('[name="password"]').val();

    // 非空校验
    if ( !username ) {
      mui.toast("请输入用户名");
      return;
    }
    if ( !password ) {
      mui.toast("请输入密码");
      return;
    }

    $.ajax({
      type: "post",
      url: "/user/login",
      data: {
        username: username,
        password: password
      },
      dataType: "json",
      success: function( info ) {
        console.log( info );

        if ( info.error ) {
          mui.toast("用户名或者密码错误" );
        }

        if ( info.success ) {
          // 登录成功, 需要跳转
          // (1) 传地址了, 跳到地址页面
          // (2) 没传地址, 跳到会员中心
          // 只需要看 location.search 中有没有 retUrl

          if ( location.search.indexOf( "retUrl" ) > -1 ) {
            // 说明传地址了
            var retUrl = location.search.replace("?retUrl=", "");
            location.href = retUrl; // 跳转过去
          }
          else {
            // 没传地址, 跳会员中心
            location.href = "user.html";
          }

        }
      }
    })

  });

})
