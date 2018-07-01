$(function() {

  // 功能1: 页面一进来, 需要渲染一次, 将地址栏参数解析到 input 框中,  proName 来自于 input 框
  var key = getSearch( "key" );
  $('.lt_search input').val( key );

  // 标记当前页
  var currentPage = 1;
  // 标记每页多少条
  var pageSize = 2;


  // 一开始: render 方法作用, 配置参数, 发送 ajax 请求, 进行页面渲染
  // 改造后: render 方法作用, 配置参数, 请求数据, 真正的渲染操作, 由 callback 进行配置
  function render( callback ) {
    //$('.lt_product').html('<div class="loading"></div>');

    var obj = {};
    // 这是必传参数
    obj.proName = $('.lt_search input').val();  // 搜索关键字
    obj.page = currentPage;
    obj.pageSize = pageSize;

    // 还有两个可传可不传的参数 price num
    var $current = $('.lt_sort a.current');

    if ( $current.length > 0 ) {
      // 需要排序, 需要加参数  （1升序，2降序）
      var sortName = $current.data("type");
      var sortValue = $current.find("i").hasClass("fa fa-angle-down") ? 2 : 1;
      obj[ sortName ] = sortValue;
    }

    setTimeout(function() {
      $.ajax({
        type: "get",
        url: "/product/queryProduct",
        data: obj,
        success: function( info ) {
          console.log( info )
          // 下拉刷新 和 上拉加载 请求数据的过程是一样, 只是拿到数据后处理的方式不一样
          // 下拉刷新, 拿到数据 => 进行覆盖渲染整个页面 html
          // 上拉加载, 拿到数据 => 在原有的数据基础上追加, append
          // 考虑将 拿到数据后的操作封装成函数, 通过参数的方式传递进来, 进行配置
          callback( info );
        }
      })
    }, 500);
  }

  // 配置了下拉刷新
  // 1. 下拉刷新初始化
  // 2. 配置回调函数, 在下拉刷新时, 进行 ajax 请求, 渲染页面 => render()
  // 3. 渲染完页面, 关闭正在刷新中的状态
  mui.init({
    pullRefresh : {
      // 指定区域滚动容器作为下拉刷新的容器
      container:".mui-scroll-wrapper",
      // 配置下拉刷新, 渲染时需要将原有的内容, 覆盖
      down : {
        // 表示一进入页面, 就进行一次下拉刷新
        auto: true,
        callback : function() {
          // 下拉刷新, 请求第一页的数据
          currentPage = 1;

          // 下拉刷新的回调函数, 想要实现刷新内容, 应该通过 ajax 发送请求, 获取最新数据, 进行页面渲染
          render(function( info ) {
            $('.lt_product').html( template( "productTpl", info ) );

            // 需要在 ajax 请求回来最新数据, 渲染完页面之后, 需要关闭下拉刷新中的状态
            // mui('.mui-scroll-wrapper').pullRefresh() 可以生成下拉刷新实例
            // 注意天坑: 文档中, 还没有更新方法, 需要先通过 pullRefresh() 生成实例
            //          通过 endPulldownToRefresh() 进行关闭我们的下拉刷新状态
            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();


            // 下拉刷新完成后, 因为进行了重新渲染, 需要重新启用上拉加载功能
            mui('.mui-scroll-wrapper').pullRefresh().enablePullupToRefresh();
          });
        }
      },

      // 配置上拉加载更多, 渲染时, 需要在原有的内容基础之上, 追加
      up: {
        callback: function() {
          console.log("上拉加载更多时调用的回调函数");
          // 应该请求下一页的数据, 追加到页面的后面
          currentPage++;
          render(function( info ) {
            // 上拉加载, 有两种,
            // 1. 还有更多数据, 还可以继续加载更多
            // 2. 没有更多数据了, 提示没有更多数据可以加载了

            if ( info.data.length > 0 ) {
              // 将数据追加到页面的最后面
              $('.lt_product').append( template( "productTpl", info ) );

              // 数据追加完成之后, 需要关闭正在加载的提示, 通过 endPullupToRefresh() 关闭正在加载中
              mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh();
            }
            else {
              // 不需要追加, 而且要提示用户, 没有更多数据了,
              // 配置参数 为 true 可以显示 没有更多数据的提示, 也会默认禁用上拉加载更多
              mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh( true );
            }
          });
        }
      }
    }
  });






  // 功能2: 点击搜索按钮, 需要渲染一次, 并持久化到历史记录中
  $('.lt_search button').click(function() {
    // 只需要触发一次下拉刷新即可
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();

    // 搜索关键字
    var key = $('.lt_search input').val();
    var history = localStorage.getItem("search_list") || '[]';
    var arr = JSON.parse( history );

    // 1. 不能有重复的
    var index = arr.indexOf( key );
    if ( index > -1 ) {
      arr.splice( index, 1 );
    }
    // 2. 不能超过 10 个, 删除最后一项
    if ( arr.length >= 10 ) {
      arr.pop();
    }
    // 添加到最前面
    arr.unshift( key );
    // 持久化到本地存储
    localStorage.setItem( "search_list", JSON.stringify( arr ) );
  })



  // 功能3: 点击排序的时候, 需要渲染一次(传递更多的参数)
  // 天坑: 在mui中下拉刷新和上拉加载容器中, 默认禁用的 a 标签的 click 事件
  //       mui 认为 click 事件 有 300ms 延时, 为了提高性能, 解决bug,  iphone
  //       认为 要通过 tap 事件 进行事件注册
  $('.lt_sort a[data-type]').on( 'tap', function() {

    console.log(1111);

    // 判断有没有 current 类即可
    if ( $(this).hasClass("current") ) {
      // 有类的情况
      $(this).find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    }
    else {
      $(this).addClass("current").siblings().removeClass("current");
      // 重置其他箭头
      $(this).siblings().find("i").removeClass("fa-angle-up").addClass("fa-angle-down");
    }

    // 只需要触发一次下拉刷新即可
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();

  })


})