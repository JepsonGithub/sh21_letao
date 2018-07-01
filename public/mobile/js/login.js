/**
 * Created by Jepson on 2018/5/15.
 */


$(function() {

  // 需求: 实现登录功能
  // 1. 点击登录按钮
  // 2. 获取用户输入的用户名和密码
  // 3. 发送 ajax 请求, 进行登陆

  $('#loginBtn').click(function() {

    var username = $('[name="username"]').val().trim();
    var password = $('[name="password"]').val().trim();

    if ( username === "" ) {
      mui.toast("请输入用户名");
      return;
    }

    if ( password === "" ) {
      mui.toast("请输入密码");
      return;
    }

    // 通过用户输入的用户名和密码, 进行发送 ajax 登录请求
    $.ajax({
      type: "post",
      url: "/user/login",
      data: {
        username: username,
        password: password
      },
      success: function( info ) {
        console.log( info );
        if ( info.error === 403 ) {
          mui.toast("用户名或者密码错误");
        }

        if ( info.success ) {
          // 说明用户登录成功
          // (1) 如果是从其他页面拦截过来的, 比如商品详情页, 将来要跳回去
          // (2) 如果是直接访问的 login.html, 跳转到会员中心

          // 通过 判断地址栏参数, 有没有 retUrl 进行区分
          if ( location.href.indexOf( "retUrl" ) > -1 ) {
            // 说明有 retUrl 需要跳转回去
            // ?retUrl=http://localhost:3000/front/product.html?productId=4
            var url = location.search.replace("?retUrl=", "");
            location.href = url;
          }
          else {
            location.href = "member.html";
          }

        }
      }
    })


  })


})