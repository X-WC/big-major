$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;

    };
    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    // 定义一个查询的参数对象 将来请求数据的事件
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值 默认从第一页开始
        pagesize: 2, // 默认每页显示2条数据
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的状态，可选值有：已发布、草稿
    };

    initTable();
    // 列表数据渲染
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败');
                }
                // 利用模版引擎渲染页面
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                renderPage(res.total);
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！');
                }
                // 调用模版引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res.data);
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr);
                // layui重新渲染表单
                form.render();
            }
        })
    }
    initCate();

    // 初始化文章状态的方法
    function initState() {
        $.ajax({
            url: '/my/article/list',
            method: 'GET',
            data: q,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章状态失败！');
                }
                // 调用模版引擎渲染分类的可选项
                var htmlStr = template('tpl-state', res.data);
                // console.log(htmlStr);
                $('[name=state]').html(htmlStr);
                // layui重新渲染表单
                form.render();
            }
        })
    }
    initState();


    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        // 获取表单中选中项的值
        var cate_id = $(['name=cate_id']).val();
        // var state = $(['name=state']).val();
        // 为查询对象的q对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的数据 重新渲染列表
        initTable();

    })


    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage.render()来渲染分页的结构
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, // 默认每页显示2条数据
            curr: q.pagenum, // 默认页码值
            layout: ['count', 'limit', 'prev', 'page', 'next'],
            limits: [2, 4, 6, 8, 10],
            // 分页发生切换的时候 触发jump回调
            jump: function(obj, first) {
                // console.log(obj.curr);
                q.pagenum = obj.curr;
                if (!first) {
                    initTable();
                }
            }
        });

    }

})