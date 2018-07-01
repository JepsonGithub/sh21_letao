/**
 * Created by Jepson on 2018/5/14.
 */

$(function() {


  // 要实现本地历史记录管理  localStorage.setItem( key, value)
  // 需要约定一个存取的 键名, 我们约定 键名: search_list
  // 通过这两行, 添加假数据, 进行渲染
  // var arr = ["耐克", "阿迪", "阿迪王", "耐克王"];
  // localStorage.setItem( "search_list", JSON.stringify( arr ) );


  // 功能1: 实现渲染历史记录功能, 一进入页面调用 render即可
  render();

  // 封装了一个方法, 专门用于读取 search_list 历史记录, 转换成 数组, 进行返回
  function getHistory() {
    // 1. 从本地存储中读取历史记录
    var history = localStorage.getItem( "search_list" ) || "[]";
    // 2. 转换成复杂数据类型, 这里是转成数组
    var arr = JSON.parse( history );
    return arr;
  }

  // 封装了一个方法, 专门通过读取的到 本地历史记录数组, 通过模板引起进行页面更新
  function render() {
    var arr = getHistory();
    // 通过模板引擎渲染
    // 模板引擎第二个参数必须是对象, 所以需要包装一下
    $('.lt_history').html( template( "historyTpl", { arr: arr } ) );
  }



  // 功能2: 清空历史记录
  // (1) 给清空历史记录按钮添加点击事件, 注意: 是动态渲染, 需要通过事件委托
  // (2) 将本地存储中 search_list 删除
  // (3) 读取本地存储
  // (4) 重新渲染
  $('.lt_history').on("click", ".btn_empty", function() {

    // 添加确认框
    // 参数1: 提示框显示的内容
    // 参数2: 提示框标题
    // 参数3: 按钮文本的数组
    // 参数4: 回调函数
    mui.confirm( "你确认要清空所有历史记录么", "温馨提示", ["取消", "确认"], function( e ) {
      console.log( e );
      // e.index 指的是点击的按钮的索引
      if ( e.index === 1 ) {
        // 点击了确认按钮
        localStorage.removeItem("search_list");
        // 通过 render 方法读取本地存储, 重新渲染
        render();
      }

    })

  });


  // 功能3: 删除某一条
  // (1) 添加点击事件(事件委托)
  // (2) 获取要删除的数组索引, 通过 data 方法可以获取索引
  // (3) 调用getHistory获取数组, 删除数组里面对应索引的项(?)
  // (4) 更新到本地存储中
  // (5) 调用 render() 方法重新进行渲染

  $('.lt_history').on("click", ".btn_delete", function() {

    // 暂存外面的 this
    var that = this;
    // mui 确认框
    // 内容, 标题, 按钮数组, 回调函数
    mui.confirm("你确认要删除这条信息么?", "温馨提示", ["确认", "取消"], function(e) {

      if ( e.index === 0 ) {
        // 获取存的索引
        var index = $(that).data("index");
        // 获取数组
        var arr = getHistory();
        // 删除数组对应索引的项 splice
        // splice( start, num, arg1, arg2.. );
        arr.splice( index, 1 );

        // 将数组同步到 localStorage 中去, 持久化到本地存储到才行
        localStorage.setItem( "search_list", JSON.stringify( arr ) );

        // 通过 render 重新渲染
        render();
      }
    })



  });


  // 功能4: 添加一条搜索记录
  // (1) 给搜索按钮, 添加点击事件
  // (2) 获取搜索框输入的值
  // (3) 获取数组
  // (4) 添加到数组最前面
  // (5) 同步到本地存储中
  // (6) 重新渲染历史记录列表
  $('.lt_search button').click(function() {

    // 获取搜索框输入的值
    var key = $(".lt_search input").val().trim();

    if ( key === "" ) {
      // 说明用户没有输入
      // 给提示框
      mui.toast("请输入搜索关键字")
      return;
    }

    // 获取数组
    var arr = getHistory();

    // 需求1: 如果有重复的项, 删除
    var index = arr.indexOf(key);
    if ( index > -1 ) {
      // 说明有重复项, 要删除该项
      arr.splice( index, 1 );
    }

    // 需求2: 如果历史记录长度大于 10, 删掉最后一个, 最老的一个
    if ( arr.length >= 10 ) {
      arr.pop();
    }


    // 添加到数组最前面
    arr.unshift( key );

    // 持久化到本地存储中, 同步到本地存储中
    localStorage.setItem( "search_list", JSON.stringify( arr ) );

    // 页面重新渲染
    render();

    // 清空搜索框
    $('.lt_search input').val("");

    // 跳转到搜索列表页, 通过地址栏, 可以进行页面与页面之间的传参
    location.href = "searchList.html?key=" + key;

  })




});
