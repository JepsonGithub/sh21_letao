/**
 * Created by Jepson on 2018/5/14.
 */

$(function() {

  // 功能1 一进入页面, 解析地址栏参数, 将搜索关键字赋值到 搜索框中
  var key = getSearch("key");
  $('.lt_search input').val( key );
  render();

  function render() {
    // 在每次需要更新新数据时, 先将 lt_product 置成 loading 状态
    $('.lt_product').html('<div class="loading"></div>');

    var params = {};
    // 搜索关键字从搜索框中进行读取, 是最合适的
    params.proName = $('.lt_search input').val();
    params.page = 1;
    params.pageSize = 100;

    // 如果选择了价格或者库存, 进行了高亮, 就说明需要排序, 就意味着需要传更多的参数
    // price 价格
    // num   库存
    // 找到了 lt_sort 下面所有 有 current 的 a
    var $current = $('.lt_sort a.current');

    if ($current.length > 0) {
      // 有高亮的元素, 需要进行排序, 需要传更多的参数
      // 按照价格排序 params.price = 2
      // 排序的键, price 或 num
      var sortName = $current.data("type");
      // 排序的值, （1升序，2降序）, 通过 箭头的类名可以判断
      var sortValue = $current.find("i").hasClass("fa-angle-down") ? 2 : 1;

      params[ sortName ] = sortValue;
    }

    // 模拟网络延迟
    setTimeout(function() {
      // 根据搜索框中的值, 进行 ajax 请求, 进行搜索渲染
      $.ajax({
        type: "get",
        url: "/product/queryProduct",
        data: params,
        success: function( info ) {
          console.log(info);
          // 根据ajax请求回来的搜索数据, 结合模板引擎渲染页面
          var htmlStr = template( "productTpl", info );
          $('.lt_product').html( htmlStr );
        }
      })
    }, 500);
  }


  // 功能2: 点击搜索按钮, 进行搜索渲染
  $('.lt_search button').click(function() {
    render();

    // 搜索完成, 还需要加搜索关键字存储到 本地历史记录中
    // 获取搜索关键字
    var key = $(".lt_search input").val();

    // 获取数组
    var history = localStorage.getItem( "search_list" ) || "[]";
    var arr = JSON.parse( history );

    // 如果有重复的删除
    var index = arr.indexOf( key );
    if ( index > -1 ) {
      arr.splice( index, 1 );
    }
    // 如果超过 10个, 删除最后一个
    if ( arr.length >= 10 ) {
      arr.pop();
    }

    // 添加到数组最前面
    arr.unshift( key );

    // 同步到本地存储中
    localStorage.setItem( "search_list", JSON.stringify( arr ) );
  });



  // 功能3: 点击排序按钮, 进行排序
  // (1) 给所有需要添加排序功能的按钮, 添加点击事件
  // (2) 如果当前的 a 标签, 有 current, 只需要切换箭头方向即可
  //     如果当前的 a 标签, 没有 current类, 让当前的添加 current, 其他的移除 current 类

  $('.lt_sort a[data-type]').click(function() {

    if ( $(this).hasClass("current") ) {
      // 说明有current 类, 切换子元素 i 的类, 以切换箭头方向  fa-angle-down  fa-angle-up
      $(this).find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    }
    else {
      // 说明没有 current 类
      $(this).addClass("current").siblings().removeClass("current");

      // 将其他的 a 里面子元素 i, 箭头方向重置成向下
      $(this).siblings().find("i").removeClass("fa-angle-up").addClass("fa-angle-down");
    }

    // 只需要调用 render方法, 在 render 方法, 会找到有 current 类的 a 进行 排序参数添加
    render();
  })

})
