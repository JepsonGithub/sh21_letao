/**
 * Created by Jepson on 2018/5/15.
 */

$(function() {

  // 一进入页面, 请求购物车信息数据
  function render() {
    setTimeout(function() {
      $.ajax({
        type: "get",
        url: "/cart/queryCart",
        success: function( info ) {
          console.log(info);
          if ( info.error === 400 ) {
            // 说明没登陆, 跳转到登录页面, 而且将来登录完成还要跳转回来
            location.href = "login.html?retUrl=" + location.href;
            return;
          }

          // 已经登录了  注意: 登录成功 info 是一个数组
          var htmlStr = template( "cartTpl", { list: info } );
          $('#cartList').html( htmlStr );

          // 当页面渲染完成后, 需要关闭正在刷新的文本提示
          mui(".mui-scroll-wrapper").pullRefresh().endPulldownToRefresh();

        }
      });
    }, 500);
  }

  // 1. 配置下拉刷新
  mui.init({
    pullRefresh : {
      container:".mui-scroll-wrapper",
      // 配置下拉刷新
      down : {
        auto: true,
        callback: function() {
          // 请求数据, 进行页面刷新渲染
          render()
        }
      }
    }
  });

  // 2. 点击删除按钮, 实现删除功能, 事件委托来实现
  //    注意: 要使用 tap 事件, 因为是 a 标签, 默认 click 被阻止了
  $('.lt_main').on("tap", ".btn_delete", function() {

    var that = this;
    mui.confirm("你是否要删除该商品", "温馨提示", ["确认", "取消"], function( e ) {
      if ( e.index === 0 ) {
        // 获取要删除的购物车 id
        var id = $(that).data("id");
        $.ajax({
          type: "get",
          url: "/cart/deleteCart",
          data: {
            // 注意: 传递的是购物车id数组
            id: [ id ]
          },
          success: function( info ) {
            console.log(info);
            if ( info.success ) {
              // 说明删除成功了
              // 触发一次下拉刷新即可
              mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
            }
          }
        })
      }

    })

  });

  // 3. 修改功能
  // (1) 给所有的修改按钮, 添加点击事件  (事件委托, tap事件)
  // (2) 弹出确认框
  $('.lt_main').on("tap", ".btn_edit", function() {
    // 购物车 id
    var id = this.dataset.id;

    // 需要拿到存在 编辑按钮中的所有数据, 通过自定义属性拿
    console.log(this.dataset);
    var htmlStr = template( "editTpl", this.dataset );

    // 注意: mui.confirm 在进行渲染时, 会将传进来的模板中的 \n 替换成 br
    // 我们不需要这些 br, 我们只需要将所有的 \n 去掉即可
    htmlStr = htmlStr.replace( /\n/g, "" );

    mui.confirm( htmlStr, "编辑商品", ["确认", "取消"], function( e ) {

      if ( e.index === 0 ) {

        // 发送ajax请求进行修改, 需要 id, 尺码, 数量
        var size = $('.lt_size span.current').text();
        var num = $('.lt_num .mui-numbox-input').val();

        $.ajax({
          type: "post",
          url: "/cart/updateCart",
          data: {
            id: id,
            size: size,
            num: num
          },
          success: function( info ) {
            console.log(info);
            if ( info.success ) {
              // 重新进行一次下拉刷新即可
              mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
            }
          }
        })

      }


    })

    // 在confirm 生成后, 执行 numbox 进行初始化
    mui(".mui-numbox").numbox();

  })


  // 4. 添加尺码选择功能
  $('body').on("click", ".lt_size span", function() {
    $(this).addClass("current").siblings().removeClass("current");
  })


  // 5. 计算价格功能
  // 给所有 checkbox 添加点击事件
  $('.lt_main').on("click", ".ck", function() {

    // 总价格
    var total = 0;
    // 选中的盒子
    var $checkBoxes = $('.lt_main .ck:checked');

    $checkBoxes.each(function() {
      // 获取存储的价格
      var price = $(this).data("price");
      // 获取存储的数量
      var num = $(this).data("num");

      total += price * num;
    })

    console.log(total);
    // toFixed 表示保留两位小数
    total = total.toFixed(2);

    // 设置到 totalPrice 文本中, 让用户看
    $('#totalPrice').text( total );

  })

})
