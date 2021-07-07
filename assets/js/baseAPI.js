// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // console.log(options.url);
    // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    // 统一为有权限的接口，设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || '',
        }
    }

    // 统一挂载complete回调函数
    // 禁止直接输入网址进入登录页
    // 无论成功/失败都会调用此函数
    options.complete = function(res) {
        // res.responseJSON.message === "身份认证失败！" 防止输入假token
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // 1.强行清空token
            localStorage.removeItem('token');
            // 2.强行跳转页面
            location.href = '/login.html';
        }

    }
})