$(function() {
    var layer = layui.layer;
    var form = layui.form;
    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }
    initArtCateList();

    var indexAdd = null;
    // 利用layer.open 渲染弹出层
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            title: ['添加文章分类'],
            type: 1,
            area: ['500px', '250px'],
            content: $('#dialog_add').html(),
            // skin: 'layui-form'
        });
    })


    // 通过代理的模式 为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
        // 阻止表单默认行为
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！');
                }
                initArtCateList();
                layer.msg('新增分类成功');
                // 根据索引关闭指定层
                layer.close(indexAdd);
            }
        })
    })

    var indexEdit = null;
    // 通过代理的模式 为btn-edit添加点击事件
    $('tbody').on('click', '.btn-edit', function() {
        // 弹出一个文章分类信息的层
        indexEdit = layer.open({
            title: ['修改文章分类'],
            type: 1,
            area: ['500px', '250px'],
            content: $('#dialog_edit').html(),
            // skin: 'layui-form'
        });

        var id = $(this).attr('data-id');
        // console.log(id);
        // 发起请求获取分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data);
            }
        })
    })

    // 通过代理的模式 为form-edit表单绑定submit事件
    $('body').on('submit', '#form-edit', function(e) {
        // 阻止表单默认行为
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败！');
                }
                layer.msg('更新分类信息成功！');
                // 根据索引关闭指定层
                layer.close(indexEdit);
                initArtCateList();
            }
        })
    })

    // 通过代理的模式 为btn-del添加点击事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        // console.log(id);
        // 提示用户是否要删除
        layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！');
                    }
                    layer.msg('删除分类成功！');
                    layer.close(index);
                    initArtCateList();
                }
            })
        });


    })

})