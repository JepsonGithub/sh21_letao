/**
 * Created by Jepson on 2018/6/29.
 */

$(function() {
  var currentPage = 1; // 表示当前页
  var pageSize = 2; // 每页 2 条数据

  // 获取搜索框的值, 发送ajax请求, 获取数据, 真正需要进行的渲染操作, 通过传参的方式调用
  function render( callback ) {
    // 三个必传的参数
    var params = {};
    params.proName = $('.search_input').val();
    params.page = currentPage;
    params.pageSize = pageSize;

    // 还有两个可传的参数 price 和 num
    // 根据当前高亮的 a 来决定按什么排序,  1升序，2降序
    var $current = $('.lt_sort .current');
    if ( $current.length > 0 ) {
      // 说明有高亮的, 需要排序
      var sortName = $current.data("type");  // 排序名称
      var sortValue = $current.find("i").hasClass("fa-angle-down") ? 2 : 1;  // 排序的值
      params[ sortName ] = sortValue;
    }
    console.log(params);

    // 模拟网络延迟
    setTimeout(function() {

      $.ajax({
        type: "get",
        url: "/product/queryProduct",
        data: params,
        dataType: "json",
        success: function( info ) {
          console.log(info);
          callback && callback( info );
        }
      })

    }, 500);

  };


  mui.init({
    pullRefresh : {
      container:".mui-scroll-wrapper",// 配置下拉刷新容器
      // 配置下拉刷新
      down : {
        auto: true, // 一进入页面自动下拉刷新一次
        callback: function() {
          console.log( "下拉刷新, 发送 ajax 请求, 重新获取数据渲染" )

          // 下拉刷新, 需要渲染第一页
          currentPage = 1;
          // 获取数据, 直接覆盖原有的数据
          render(function( info ) {
            var htmlStr = template( "productTpl", info );
            $('.lt_product').html( htmlStr );
            // 数据回来之后, 需要关闭下拉刷新
            // console.log( mui('.mui-scroll-wrapper').pullRefresh() )
            // mui('.mui-scroll-wrapper').pullRefresh().endPulldown();
            // 注意: 文档中没有更新, 需要通过 pullRefresh 创建实例, 通过原型找到 结束下拉刷新的的方法
            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();


            // 下拉刷新完成后, 重新渲染了第一页, 又有更多数据可以加载了
            // 需要重新启用 上拉加载
            mui('.mui-scroll-wrapper').pullRefresh().enablePullupToRefresh();
          });

        }
      },
      //  配置上拉加载
      up: {
        callback: function() {
          console.log( "上拉加载更多" );
          // 发送 ajax 请求, 请求下一页的数据, 追加到原有的数据列表中
          currentPage++;
          render(function( info ) {

            // 渲染追加完成, 需要关闭上拉加载
            // 给 endPullupToRefresh 传参 true 就会显示 没有更多数据了, 并且禁用上拉加载了
            if ( info.data.length === 0 ) {
              // 没有数据了, 结束上拉加载, 并且显示没有更多数据
              mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh( true );
            }
            else {
              // 如果有数据, 需要进行渲染, 渲染完成, 正常关闭上拉加载
              var htmlStr = template( "productTpl", info );
              $('.lt_product').append( htmlStr );
              mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh();
            }

          });
        }
      }
    }
  });





  //// 1. 一进入页面, 解析地址栏参数, 将值设置给input, 再进行页面渲染
  //// 获取搜索关键字
  //var key = getSearch("key");
  //$('.search_input').val( key );
  //render();
  //
  //// 2. 点击搜索按钮, 进行搜索功能, 历史记录管理
  //$('.search_btn').click(function() {
  //  // 搜索成功, 需要更新历史记录
  //  var key = $('.search_input').val();
  //  if ( key === "" ) {
  //    mui.toast("请输入搜索关键字");
  //    return;
  //  }
  //
  //  // 调用 render 方法, 重新根据搜索框的值进行页面渲染
  //  render();
  //
  //  // 获取数组
  //  var history = localStorage.getItem("search_list") || '[]';
  //  var arr = JSON.parse( history );
  //
  //  // 1. 不能重复
  //  var index = arr.indexOf( key );
  //  if ( index > -1 ) {
  //    arr.splice( index, 1 );
  //  }
  //  // 2. 不能超过 10 个
  //  if ( arr.length >= 10 ) {
  //    arr.pop();
  //  }
  //  // 添加到数组最前面
  //  arr.unshift( key );
  //  // 存到 localStorage 里面去
  //  localStorage.setItem( "search_list", JSON.stringify( arr ) );
  //
  //  // 清空搜索框
  //  $('.search_input').val("");
  //});
  //
  //// 3. 添加排序功能
  //// (1) 添加点击事件
  //// (2) 如果没有current, 就要加上current, 并且其他 a 需要移除 current
  ////     如果有 current, 切换小箭头方向即可
  //// (3) 页面重新渲染
  //$('.lt_sort a[data-type]').click(function() {
  //
  //  if ( $(this).hasClass("current") ) {
  //    // 如果有 current, 切换小箭头方向
  //    $(this).find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
  //  }
  //  else {
  //    // 没有 current, 加上 current
  //    $(this).addClass("current").siblings().removeClass("current");
  //  }
  //  // 调用 render 进行重新渲染
  //  render();
  //})



})
