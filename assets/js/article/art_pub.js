$(function() {
    var layer = layui.layer;
    var form = layui.form;

    function initCate() {
        // 定义加载文章的分类的方法
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！');
                }
                // 调用模版引擎 渲染下拉菜单
                var htmlStr = template('tpl-cate', res.data);
                $('[name=cate_id').html(htmlStr);
                // 重新渲染
                form.render();
            }
        })
    }
    initCate();
    // 初始化富文本编辑器
    initEditor();

    // 1. 初始化图片裁剪器
    var $image = $('#image');

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };

    // 3. 初始化裁剪区域
    $image.cropper(options);


    // 为选择封面的按钮 绑定点击事件
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click();
    })

    // 将选择的图片设置到剪裁区域中
    $('#coverFile').on('change', function(e) {
        // 获取到文件的列表数据
        var files = e.target.files[0];
        // console.log(file);
        if (files.length === 0) {
            return
        }
        // 根据文件 创建对应的URL地址
        var newImgURL = URL.createObjectURL(files);
        console.log(newImgURL);
        $image.cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    })


    // 定义一个发布状态默认为已发布
    var art_state = '已发布';
    // 为存为草稿按钮绑定点击事件
    $('#btnSave2').on('click', function() {
        art_state = '草稿';
    })

    // 为表单form-pub绑定提交事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        // 创建一个FormData对象
        var fd = new FormData($(this)[0]);

        // 将文章发布的状态 存到fd中
        fd.append('state', art_state);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                fd.append('cover_img', blob);
                // 得到文件对象后，进行后续的操作
                // 发起ajax请求
                publishArticle(fd);
            })
    })


    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！');
                }
                layer.msg('发布文章成功！');
                location.href = '/article/art_list.html'
            }
        })
    }


})