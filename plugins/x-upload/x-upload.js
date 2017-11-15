/**
 * Created by IntelliJ IDEA.
 * User: xsiry
 * Date: 2017/11/08
 * Time: 09:50
 */
seajs.use("x-upload/x-upload.css");
// 图片上传
define(function(require, exports, module) {
    var $ = require('jquery');
    var $list;
    module.exports = {
        init: function (option) {
            option = option || {};
            uploader(option);
        },
        _addFilePreview: function(list_block, urls) {
            addFilePreview(list_block, urls)
        }
    };

    function uploader(option) {
        $list = $(option.list_block);   //图片预览列表
        var $upload = $(option.upload_btn);   //开始上传
        var thumbnailWidth = 100;   //缩略图高度和宽度 （单位是像素），当宽高度是0~1的时候，是按照百分比计算，具体可以看api文档
        var thumbnailHeight = 100;
        // 初始化Web Uploader
        var uploader = WebUploader.create({

            // 选完文件后，是否自动上传。
            auto: false,

            // swf文件路径
            swf: '../webuploader-0.1.5/Uploader.swf',

            // 文件接收服务端。
            server: option.url,

            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: {
                id: option.pick_btn,
                multiple: option.multiple || false
            },

            // 只允许选择图片文件。
            accept: {
                title: '类型',
                extensions: option.extensions || 'gif,jpg,jpeg,bmp,png',
                mimeTypes: option.mimeTypes || 'image/*'
            },
            // 可上传文件个数
            fileNumLimit: option.file_num || 1
        });

        $upload.on('click', function () {
            uploader.upload();
        });

        // 当有文件添加进来的时候
        uploader.on('fileQueued', function (file) {
            var $li = $(
                '<div id="' + file.id + '" class="x-upload-num file-item thumbnail"><a data-fileid="' + file.id + '" href="javascript:;" class="remove-this">X</a>' +
                '<img>' +
                '<div class="info">' + file.name + '</div>' +
                '</div>'
                ).on('click', '.remove-this', function () {
                    $(this).parent().remove();
                    uploader.removeFile($(this).data('fileid'), true);
                }),
                $img = $li.find('img');


            // $list为容器jQuery实例
            $list.append($li);

            // 创建缩略图
            // 如果为非图片文件，可以不用调用此方法。
            // thumbnailWidth x thumbnailHeight 为 100 x 100
            uploader.makeThumb(file, function (error, src) {
                if (error) {
                    $img.replaceWith('<span>不能预览</span>');
                    return;
                }

                $img.attr('src', src);
            }, thumbnailWidth, thumbnailHeight);
        });

        // 文件上传过程中创建进度条实时显示。
        uploader.on('uploadProgress', function (file, percentage) {
            var $li = $('#' + file.id),
                $percent = $li.find('.progress span');

            // 避免重复创建
            if (!$percent.length) {
                $percent = $('<p class="progress"><span></span></p>')
                    .appendTo($li)
                    .find('span');
            }

            $percent.css('width', percentage * 100 + '%');
        });

        // 文件上传成功，给item添加成功class, 用样式标记上传成功。
        uploader.on('uploadSuccess', function (file, result) {
            $('#' + file.id).addClass('upload-state-done');
            if (result.success) {
                var url = result.result.join(';');
                var main = $(option.upload_main);
                var inputUrl = main.find('input[name="'+option.field+'"]');
                inputUrl.length>0? inputUrl.val(url): $('<input type="hidden" name='+option.field+' value="'+ url +'">').appendTo(main);
            }
        });

        // 文件上传失败，显示上传出错。
        uploader.on('uploadError', function (file) {
            var $li = $('#' + file.id),
                $error = $li.find('div.error');

            // 避免重复创建
            if (!$error.length) {
                $('#' + file.id).addClass('no-upload-state-done');
                $error = $('<div class="error"></div>').appendTo($li);
            }

            $error.text('请重新添加上传');
        });

        // 完成上传完了，成功或者失败，先删除进度条。
        uploader.on('uploadComplete', function (file) {
            $('#' + file.id).find('.progress').remove();
        });
    }

    function addFilePreview(urls) {
        $.each(urls, function(i, u) {
            var $li = $(
                '<div class="file-item thumbnail">' +
                '<img src="'+ u +'" />' +
                '<div class="info">已上传(重传删除)</div>' +
                '</div>'
                );
            // $list为容器
            $list.append($li);
        })
    }
});