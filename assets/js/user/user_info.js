$(function() {
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1～6个字符之间！';
            }
        }
    })
    initUsrInfo();
});
// 获取用户的昵称
function initUsrInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败！');
            }
            // console.log(res.data.username);
            // 调用form.val()快速赋值
            var form = layui.form;
            form.val('formUserInfo', res.data);
        }
    })
}

// 阻止表单的默认重置行为 重新获取用户信息
// 重置表单的数据
$('#btnReset').on('click', function(e) {
    // 阻止表单的默认行为
    e.preventDefault();
    // 再重新渲染用户信息
    initUsrInfo();
});

// 发起请求更新用户的信息
$('.layui-form').on('submit', function(e) {
    // 阻止表单的默认行为
    e.preventDefault();
    // 发起ajax请求
    $.ajax({
        method: 'POST',
        url: '/my/userinfo',
        data: $(this).serialize(),
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg("更新用户失败");
            }
            layer.msg("更新用户信息成功");
            // 调用父页面中的方法 重新渲染用户的信息
            window.parent.getUserInfo();
        }

    })
})