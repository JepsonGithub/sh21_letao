/**
 * Created by Jepson on 2018/6/25.
 */

// 实现进度条功能 (给 ajax 请求加), 注意需要给所有的 ajax 都加
// 发送 ajax 开启进度条, ajax结束, 关闭进度条

// 开启进度条
//NProgress.start();
//
//setTimeout(function() {
//  // 关闭进度条
//  NProgress.done();
//}, 500);


// ajax 全局事件
// .ajaxComplete()  每个ajax完成时调用, (不管成功还是失败)
// .ajaxSuccess()   每个ajax成功时调用
// .ajaxError()     每个ajax失败时调用
// .ajaxSend()      每个ajax发送前调用

// .ajaxStart()     第一个ajax发送时调用
// .ajaxStop()      所有的ajax请求都完成时调用

// 第一个ajax发送时, 开启进度条
$(document).ajaxStart(function() {
  NProgress.start();
});

// 所有的ajax请求完成时调用, 关闭进度条
$(document).ajaxStop(function() {

  // 模拟网络延迟
  setTimeout(function() {
    NProgress.done();
  }, 500)

});



