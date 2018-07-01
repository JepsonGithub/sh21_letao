/**
 * Created by Jepson on 2018/7/1.
 */

$(function() {


  // 1. 一进入页面, 获取地址栏商品 id, 发送 ajax 请求, 获取数据渲染页面
  var productId = getSearch("productId");

  $.ajax({
    type: "get",
    url: "/product/queryProductDetail",
    data: {
      id: productId
    },
    dataType: "json",
    success: function( info ) {
      console.log( info );
      var htmlStr = template( "productTpl", info );
      $('.lt_main .mui-scroll').html( htmlStr );


      // 在页面 html执行之后, 才有轮播结构
      //获得slider插件对象, 调用 mui 方法进行 轮播图初始化
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval:5000 //自动轮播周期，若为0则不自动播放，默认为0；
      });

      // 初始化数字框
      mui('.mui-numbox').numbox()
    }
  });


  // 用户选择尺码功能
  $('.lt_main').on("click", ".lt_size span", function() {
    $(this).addClass("current").siblings().removeClass("current");
  });


  // 2. 加入购物车功能
  // (1) 给按钮添加点击事件
  // (2) 获取用户选择的尺码和数量,  (用户要能选)
  // (3) 发送 ajax 请求, 加入购物车
  $('#goCart').click(function() {

    var size = $('.lt_size span.current').text();  // 尺码
    var num = $('.mui-numbox-input').val(); // 数量

    if ( !size ) {
      mui.toast( "请选择尺码" );
      return;
    }

    $.ajax({
      type: "post",
      url: "/cart/addCart",
      data: {
        productId: productId,
        num: num,
        size: size
      },
      dataType: "json",
      success: function( info ) {
        console.log( info )
        if ( info.success ) {
          // 已登陆, 加入购物车成功
          // 通过 mui 确认框, 提示用户加入成功
          mui.confirm( "添加成功", "温馨提示", ["去购物车", "继续浏览"], function( e ) {
            if ( e.index === 0 ) {
              // 前往购物车
              location.href = "cart.html";
            }
          })
        }
        if ( info.error === 400 ) {
          // 跳转到登陆页, 将来登陆成功需要跳回来, 需要将当前的url传递过去
          location.href = "login.html?retUrl=" + location.href;
        }
      }
    })

  });

});
