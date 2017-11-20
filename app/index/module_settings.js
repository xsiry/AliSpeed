/**
 * Created by IntelliJ IDEA.
 * User: xsiry
 * Date: 2017/11/17
 * Time: 14:22
 */
define(function (require, exports, module) {
    var $ = require('jquery');
    require('bootstrap');
    require('jquery-confirm');
    require('select2');

    module.exports = {
        init: function () {},
        _upSettings: function () {
            upSettings();
        }
    };

    function upSettings() {
        var select = '<div style="margin-bottom: 15px;"><select id="settings" name="ss_key" style="width: 150px;"></select><input type="text" name="ss_val" class="form-control" style="display: inline-block; margin-left: 10px; padding-top: 2px; width: 60px;height: 28px;"></div>';

        $.confirm({
            type: 'green',
            animationSpeed: 300,
            title: "系统设置",
            // autoClose: 'cancel|10000',
            content: select,
            buttons: {
                confirm: {
                    text: '确认',
                    btnClass: 'waves-effect waves-button',
                    action: function() {
                        var self = this;
                        var params = {
                            ss_key: self.$content.find('select[name="ss_key"]').val().split('-')[0],
                            ss_val: self.$content.find('input[name="ss_val"]').val()
                        };

                        $.post('/dict', params, function(result) {
                            var msg;
                            toastr.options = {
                                closeButton: true,
                                progressBar: true,
                                showMethod: 'slideDown',
                                timeOut: 4000
                            };
                            if (result.success) {
                                msg = result.msg;
                                toastr.success(msg);
                            } else {
                                msg = result.msg;
                                toastr.error(msg);
                            }
                        }, 'json');
                    }
                },
                cancel: {
                    text: '取消',
                    btnClass: 'waves-effect waves-button'
                }
            },
            onOpen: function () {
                var self = this;
                self.$content.on('change', 'select[name="ss_key"]', function() {
                    var val = $(this).val().split('-')[1];
                    self.$content.find('input[name="ss_val"]').val(val);
                });
                // select2初始化
                initSelect();
            }
        });
    }

    function initSelect(val) {
        var params = {
            source: 'dict_systemset',
            qtype: 'select',

        };
        $.getJSON('/dict', params, function(json) {
            var arr = [];
            for (var i = 0; i < json.length; i ++) {
                var data = {};
                data.id = json[i].ss_key +"-"+ json[i].ss_val;
                data.text = json[i].remark;
                arr.push(data);
            }
            $('#settings').empty().append("<option></option>");
            var select = $("select#settings").select2({
                language: 'zh-CN',
                placeholder: '请选择设置',
                data : arr
            });
            if (val) select.val(val).trigger("change");
        });
    }
});