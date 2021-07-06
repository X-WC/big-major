$(function() {
    // 点击"去注册账号"的链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    });

    // 点击"去登录"的链接
    $('#link_login').on('click', function() {
        $('.reg-box').hide();
        $('.login-box').show();
    })

    // 自定义校验规则
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        // 登录页面
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 注册页面
        // 校验两次密码是否一致的规则
        repwd: function(value) {
            var pwd = $('.reg-box [name=password]').val();
            if (pwd != value) {
                return '两次密码不一致';
            }
        }
    });

    // 发起注册用户的ajax请求
    $('#form_reg').on('submit', function(e) {
        // 1.阻止表单的默认行为
        e.preventDefault();
        // 表单数据
        var data = {
            username: $('#form_reg [name=title]').val(),
            password: $('#form_reg [name=password]').val()
        };
        console.log(data);
        // 2.表单发起post请求
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功，请登录！');
            // 模拟人的点击行为
            $('#link_login').click();
        });
    });

    // 监听表单的提交事件
    // 登录页面
    $('#form_login').submit(function(e) {
        // 阻止表单的默认行为
        e.preventDefault();
        // var data = $(this).serialize();
        // console.log(data);
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单的数据
            data: {
                username: $('#form_login [name=title]').val(),
                password: $('#form_login [name=password]').val()
            },
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('登录失败');
                }
                layer.msg('登录成功');
                // 把token值存在本地存储中
                localStorage.setItem('token', res.token);
                // 跳转页面
                location.href = '/index.html'
            }
        })
    })
})