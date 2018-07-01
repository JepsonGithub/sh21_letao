/**
 * Created by Jepson on 2018/7/1.
 */


$(function() {

  // 1. 一进入页面, 获取购物车数据, 进行模板渲染
  function render() {
    setTimeout(function() {

      $.ajax({
        type: "get",
        url: "/cart/queryCart",
        dataType: "json",
        success: function( info ) {
          console.log( info );
          var htmlStr = template( "tpl", { arr: info } );
          $('.lt_main .mui-table-view').html( htmlStr );

          // 页面渲染完成结束下拉刷新
          mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
        }
      });

    }, 500);
  }


  // 2. 配置下拉刷新
  mui.init({
    pullRefresh : {
      container:".mui-scroll-wrapper",
      down : {
        auto: true,// 首次加载自动下拉刷新一次
        callback: function() {
          // 发送ajax请求, 渲染页面
          render();
        }
      }
    }
  });


  // 3. 删除购物车商品功能
  // (1) 给删除按钮, 添加点击事件 (事件委托) tap事件绑定
  // (2) 获取当前删除的商品 id, 已通过自定义属性存储id
  // (3) 发送 ajax 请求, 删除商品

  $('.lt_main').on("tap", ".btn_delete", function() {
    var id = $(this).data("id");

    $.ajax({
      type: "get",
      url: "/cart/deleteCart",
      data: {
        id: [ id ]
      },
      dataType: "json",
      success: function( info ) {
        console.log( info )
        if( info.success ) {
          // 删除成功, 重新渲染
          // 重新调用一次下拉刷新
          mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
        }
      }
    })
  });



  // 4. 编辑功能
  $('.lt_main').on("tap", ".btn_edit", function() {

    // 获取自定义属性
    var obj = this.dataset;
    var id = obj.id;
    console.log( obj );
    var htmlStr = template( "editTpl", obj );
    // mui 默认会将模板中的 \n 替换成 br 标签
    // 我们需要让传入确认框中的 字符串模板中 没有 \n 就可以了
    htmlStr = htmlStr.replace(/\n/g, "");

    // 显示确认框
    mui.confirm( htmlStr, "编辑商品", ["确认", "取消"], function( e ) {

      if ( e.index === 0 ) {
        var size = $(".lt_size span.current").text(); // 获取尺码
        var num = $('.mui-numbox-input').val(); // 获取数量

        $.ajax({
          type: "post",
          url: "/cart/updateCart",
          data: {
            id: id,
            size: size,
            num: num
          },
          dataType: "json",
          success: function( info ) {
            console.log( info )
            if( info.success ) {
              mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
            }
          }
        })

      }

    });

    // 手动初始化数字框
    mui(".mui-numbox").numbox()

  });



  // 添加尺码选择功能
  $('body').on("click", ".lt_size span", function() {
    $(this).addClass("current").siblings().removeClass("current");
  });



  // 5. 计价功能
  // (1) 添加事件委托, 给所有的 checkbox 添加点击事件
  // (2) 获取所有被选中的 checkbox, 进行遍历, 取出num和price 进行计价
  // (3) 将计算出来的总价格, 设置给总价

  $('.lt_main').on("click", ".ck", function() {


    var $all = $('.lt_main .ck:checked');  // 所有被选中的checkbox

    var total = 0; // 总价
    $all.each(function( index, element ) {
      // 获取 num 和 price
      var num = $(this).data("num");
      var price = $(this).data("price");

      total += num * price;
    });

    // 保留两位小数
    total = total.toFixed(2);

    // 设置总价
    $('#totalText').text( total );

  });

})