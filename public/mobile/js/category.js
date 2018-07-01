/**
 * Created by Jepson on 2018/5/12.
 */


$(function() {

  // 一进入页面发送 ajax 请求, 获取左侧列表数据, 进行渲染
  $.ajax({
    type: "get",
    url: "/category/queryTopCategory",
    success: function( info ) {
      console.log( info );
      // 根据数据进行渲染页面
      var htmlStr = template("leftTpl", info);
      $('.lt_category_left ul').html( htmlStr );

      // 一进入页面, 应该渲染第一个一级分类对应的二级分类
      renderSecondById( info.rows[0].id );
    }
  });


  // 给左侧一级列表添加点击事件, 通过事件委托
  $('.lt_category_left ul').on("click", "a", function() {

    // 获取当前点击的 a 的 id
    var id = $(this).data("id");

    // 根据 id 渲染二级分类列表
    renderSecondById( id );

    // 让自己高亮, 让其他 a 不高亮
    $(this).addClass("current").parent().siblings().find("a").removeClass("current");
  })





  // 这个方法用于根据一级分类的 id 进行渲染二级分类
  function renderSecondById( id ) {

    // 发送 ajax, 请求二级分类数据, 将来通过模板引擎进行渲染
    $.ajax({
      type: "get",
      url: "/category/querySecondCategory",
      data: {
        id: id
      },
      success: function( info ) {
        console.log( info );
        var htmlStr = template( "rightTpl", info );
        $('.lt_category_right ul').html( htmlStr );
      }
    })

  }

});