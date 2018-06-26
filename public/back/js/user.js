/**
 * Created by Jepson on 2018/6/26.
 */

$(function() {
  var currentPage = 1; // 当前页
  var pageSize = 5; // 每页多少条

  // 1. 一进入页面, 发送 ajax 请求, 从后台获取数据, 通过模板引擎渲染
  render();
  function render() {
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function( info ) {
        console.log( info )
        // 参数1: 模板id
        // 参数2: 数据对象
        // 在模板中, 可以任意使用数据对象中的属性
        var htmlStr = template( "tpl", info );
        $('tbody').html( htmlStr );


        // 分页初始化
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3, // 需要定义版本号, 在结构中使用  ul
          // 总共多少页
          totalPages: Math.ceil( info.total / info.size ),
          // 当前第几页
          currentPage: info.page,
          // 配置按钮点击事件, page 表示当前点击的页码
          onPageClicked(a, b, c, page) {
            console.log( page );
            // 更新当前页
            currentPage = page;

            // 重新调用 render
            render();
          }
        })

      }
    });
  }




})
