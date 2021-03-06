/**
 * Created by IntelliJ IDEA.
 * User: xsiry
 * Date: 2017/11/06
 * Time: 12:04
 */

define(function(require, exports, module) {
    let $ = require('jquery');
    require('bootstrap');
    require('jquery-confirm');

    require('select2');
    // require('select2_zh_CN');
    require('webuploader');

    let self_ = $('.bank_main');
    // let $table = self_.find('#table');

    let url = '/user_bank',
        table = 'sys_user_bank',
        // source_id = 'user_bank_id',
        // sort_name = 'company',
        // sort_order = 'asc',
        validationInput = {
            company: {
                validators: {
                    notEmpty: {
                        message: '该项不能为空'
                    }
                }
            },
            rece_name: {
                validators: {
                    notEmpty: {
                        message: '该项不能为空'
                    }
                }
            },
            bank_account: {
                validators: {
                    notEmpty: {
                        message: '该项不能为空'
                    }
                }
            },
            bank_branch: {
                validators: {
                    notEmpty: {
                        message: '该项不能为空'
                    }
                }
            },
            bank_address: {
                validators: {
                    notEmpty: {
                        message: '该项不能为空'
                    }
                }
            }
        };

    module.exports = {
        init: function() {
            this._loadMain();
            this._bindUI();
        },
        _bindUI: function() {
            // 搜索监听回车
            // self_.on("keypress", 'input[name="searchText"]', function(e) {
            //     if (e.which === 13) f_search();
            // });
            // 搜索内容为空时，显示全部
            // self_.on('input propertychange', 'input[name="searchText"]', function() {
            //     if ($(this).val().length === 0) f_search();
            // });
            // 添加数据
            // self_.on('click', '.create_act', function() {
            //     createAsUpdateAction();
            // });
            // 数据表格动态高度
            // $(window).resize(function() {
            //     self_.find('#table').bootstrapTable('resetView', {
            //         height: getHeight()
            //     })
            // });
        },
        _loadMain: function() {
            // bsTable();
            getBank();
            postBank();
            $('select').select2();
        }
    };

    function getBank() {
        var params = {
            source: table,
            qtype: 'select',
            qhstr: JSON.stringify({
                qjson: [{user_id: $('.x-user-id').val()}]
            })
        };
        $.get(url, params, function(result) {
            var row = result.rows[0];
            // select2初始化
            if (!row) initSelect();
            // 上传插件初始化
            uploadFile([]);

            $.each(row, function (key, val) {
                if(key === 'bank') {
                    initSelect(val);
                }else if (key === 'buslic_img') {
                    uploadFile(val.split(';'));
                } else {
                    self_.find('label[for="' + key + '"]').addClass('active');
                    self_.find('input[name="' + key + '"]').val(val);
                }
            });
        }, 'json');
    }

    function postBank() {
        self_.find('form').formValidation(formFvConfig()).on('success.form.fv', function (e) {
            self_.find('button.x-submit').attr("disabled", true);
            // Prevent form submission
            e.preventDefault();

            // Get the form instance
            let $form = $(e.target);

            let params = {};

            $.each($form.serializeArray(), function (i, o) {
                params[o.name] = o.value;
            });

            if ( !params['buslic_img'] && self_.find('.x-uploaded').length === 0) {
                $.alert({
                    title: '提示',
                    content: '请先选择或上传图片!',
                    confirm: {
                        text: '确认',
                        btnClass: 'waves-effect btn-primary'
                    }
                });
                self_.find('button.x-submit').removeClass('disabled');
                self_.find('button.x-submit').attr("disabled", false);
                return;
            }

            params['user_id'] = $('.x-user-id').val();

            $.post(url , params, function (result) {
                var msg = result.msg;
                $.alert({
                    type: result.success ? 'blue':'red',
                    animationSpeed: 300,
                    title: '提示',
                    icon:'glyphicon glyphicon-info-sign',
                    content: msg
                });
                if (result.success) {
                    var uimg = $('.remove-this').parent();
                    $('.x-uploaded img').prop('src', uimg.find('img').prop('src'));
                    if($('.x-uploaded img').length > 0) uimg.remove();
                    self_.find('button.x-submit').removeClass('disabled');
                    self_.find('button.x-submit').attr("disabled", false);
                } else {
                    self_.find('button.x-submit').removeClass('disabled');
                    self_.find('button.x-submit').attr("disabled", false);
                }

            }, 'json');
        });
    }

    // bootstrap table初始化
    // http://bootstrap-table.wenzhixin.net.cn/zh-cn/documentation/
    // function bsTable() {
    //     require('bootstrap-table');
    //     require('bootstrap-table-zh-CN');
    //     $table.bootstrapTable({
    //         url: url,
    //         queryParams: function(params) {
    //             var qjson = {};
    //             qjson[self_.find('select[name="searchWhere"]').val()] = self_.find('input[name="searchText"]').val();
    //             var qjsonkeytype = {};
    //             qjsonkeytype[self_.find('select[name="searchWhere"]').val()] = "LIKE_ALL";
    //
    //             var x_params = {};
    //             x_params.source = table;
    //             x_params.qhstr = JSON.stringify({
    //                 qjson: [qjson],
    //                 qjsonkeytype: [qjsonkeytype]
    //             });
    //
    //             if(params.offset!==null&&params.limit) {
    //                 x_params.page = params.offset/params.limit+1;
    //                 x_params.pagesize = params.limit;
    //             }else {
    //                 x_params.qtype = 'select';
    //             }
    //             x_params.sortname = params.sort;
    //             x_params.sortorder = params.order;
    //             return x_params;
    //         },
    //         idField: source_id,
    //         sortName: sort_name,
    //         sortOrder: sort_order,
    //         pageNumber:1,      //初始化加载第一页，默认第一页
    //         pageList: [10, 25, 50, 100],  //可供选择的每页的行数（*）
    //         columns: require('./columns'),
    //         height: getHeight(),
    //         striped: true,
    //         search: false,
    //         searchOnEnterKey: true,
    //         showRefresh: true,
    //         showToggle: true,
    //         showColumns: true,
    //         minimumCountColumns: 2,
    //         showPaginationSwitch: false,
    //         clickToSelect: true,
    //         detailView: false,
    //         detailFormatter: '',
    //         pagination: true,
    //         paginationLoop: false,
    //         classes: 'table table-hover table-no-bordered',
    //         sidePagination: 'server',
    //         silentSort: false,
    //         smartDisplay: false,
    //         escape: true,
    //         maintainSelected: true,
    //         toolbar: self_.find('#toolbar')
    //     }).on('all.bs.table', function(e, name, args) {
    //         $('[data-toggle="tooltip"]').tooltip();
    //         $('[data-toggle="popover"]').popover();
    //     });
    // }
    // // 搜索
    // function f_search() {
    //     $table.bootstrapTable('refresh', {});
    // }
    // // bs表格按钮事件
    // window.actionEvents = {
    //     'click .edit': function(e, value, row, index) {
    //         createAsUpdateAction(row)
    //     },
    //     'click .remove': function(e, value, row, index) {
    //         deleteAction(row);
    //     }
    // };
    //
    // window.licenseEvents = {
    //     'mouseover .x-pre-img-btn': function(e, value, row, index) {
    //         $(this).parent().find('.x-pre-img').show();
    //         if (index < 5) $(this).parent().find('.x-pre-img').css({bottom:'-145px', top: '0'});
    //     },
    //     'mouseout .x-pre-img-btn': function(e, value, row, index) {
    //         $(this).parent().find('.x-pre-img').hide();
    //     }
    // };

    // 创建或修改
    // function createAsUpdateAction(row) {
    //     $.confirm({
    //         type: 'blue',
    //         animationSpeed: 300,
    //         title: row? ('修改' + row.company) : '新增',
    //         content: 'URL:../app/bank_dialog.html',
    //         buttons: {
    //             confirm: {
    //                 text: '确认',
    //                 btnClass: 'waves-effect btn-primary',
    //                 action: function () {
    //                     let self = this;
    //                     self.$content.find('form').submit();
    //                     return false;
    //                 }
    //             },
    //             cancel: {
    //                 text: '取消',
    //                 btnClass: 'waves-effect waves-button'
    //             }
    //         },
    //         onOpen: function () {
    //             let self = this;
    //             setTimeout(function () {
    //                 // select2初始化
    //                 if (!row) initSelect();
    //                 // 上传插件初始化
    //                 uploadFile([]);
    //
    //                 $.each(row, function (key, val) {
    //                     if(key === 'bank') {
    //                         initSelect(val);
    //                     }else if (key === 'buslic_img') {
    //                         uploadFile(val.split(';'));
    //                     } else {
    //                         self.$content.find('label[for="' + key + '"]').addClass('active');
    //                         self.$content.find('input[name="' + key + '"]').val(val);
    //                     }
    //                 });
    //
    //                 self.$content.find('form').formValidation(formFvConfig()).on('success.form.fv', function (e) {
    //                     $(self.$$confirm[0]).prop("disabled", true);
    //                     // Prevent form submission
    //                     e.preventDefault();
    //
    //                     // Get the form instance
    //                     let $form = $(e.target);
    //
    //                     let params = {};
    //
    //                     $.each($form.serializeArray(), function (i, o) {
    //                         params[o.name] = o.value;
    //                     });
    //
    //                     if ( !params['buslic_img'] && self.$content.find('.x-uploaded').length === 0) {
    //                         $.alert({
    //                             title: '提示',
    //                             content: '请先选择或上传图片!',
    //                             confirm: {
    //                                 text: '确认',
    //                                 btnClass: 'waves-effect btn-primary'
    //                             }
    //                         });
    //                         $(self.$$confirm[0]).prop("disabled", false);
    //                         return;
    //                     }
    //
    //                     $.post(url , params, function (result) {
    //                         let msg;
    //                         toastr.options = {
    //                             closeButton: true,
    //                             progressBar: true,
    //                             showMethod: 'slideDown',
    //                             timeOut: 4000
    //                         };
    //                         if (result.success) {
    //                             msg = result.msg;
    //                             toastr.success(msg);
    //                             self.close();
    //                             $table.bootstrapTable('refresh', {});
    //                         } else {
    //                             msg = result.msg;
    //                             toastr.error(msg);
    //                             $(self.$$confirm[0]).prop("disabled", false);
    //                         }
    //                     }, 'json');
    //                 });
    //             }, 500);
    //         }
    //     });
    // }
    // 删除
    // function deleteAction(row) {
    //      $.confirm({
    //         type: 'red',
    //         animationSpeed: 300,
    //         title: false,
    //         autoClose: 'cancel|10000',
    //         content: '确认删除' + row.company + '吗？',
    //         buttons: {
    //             confirm: {
    //                 text: '确认',
    //                 btnClass: 'waves-effect waves-button',
    //                 action: function() {
    //                     $.post(url + '/del', { tid: row[source_id], tname: table }, function(result) {
    //                         let msg;
    //                         toastr.options = {
    //                             closeButton: true,
    //                             progressBar: true,
    //                             showMethod: 'slideDown',
    //                             timeOut: 4000
    //                         };
    //                         if (result.success) {
    //                             msg = result.msg;
    //                             toastr.success(msg);
    //                             $table.bootstrapTable('refresh', {});
    //                         } else {
    //                             msg = result.msg;
    //                             toastr.error(msg);
    //                         }
    //                     }, 'json');
    //                 }
    //             },
    //             cancel: {
    //                 text: '取消',
    //                 btnClass: 'waves-effect waves-button'
    //             }
    //         }
    //     });
    // }
    // fv表单控件参数
    function formFvConfig() {
        return {
            autoFocus: true,
            locale: 'zh_CN',
            message: '该值无效，请重新输入',
            err: {
                container: 'tooltip'
            },
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: validationInput
        };
    }

    function initSelect(val) {
        // var params = {
        //     source: '',
        //     qtype: ''
        // };
        // $.getJSON('/factory', params, function(json) {
        //     var arr = [];
        //     for (var i = 0; i < json.length; i ++) {
        //         var data = {};
        //         data.id = json[i].factory_id;
        //         data.text = json[i].factory;
        //         arr.push(data);
        //     }
        //     $('#bank').empty().append("<option></option>");
            var select = $("select#bank").select2({
                language: 'zh-CN',
                placeholder: '请选择开户银行',
                // data : arr
            });
            if (val) select.val(val).trigger("change");
        // });
    }

    // 动态高度
    function getHeight() {
        return $('.x-content').height() - 3;
    }

    // 上传初始化
    function uploadFile(urls) {
        let option = {
            url: '/file/upload/bank',
            field: 'buslic_img',
            upload_main: '#x-uploader',
            list_block: '#x-fileList',
            upload_btn: '#x-upload',
            pick_btn: '#x-picker'
        };
        let upload = require('upload');
        if (urls.length > 0){
            upload._addFilePreview(urls);
        } else {
            upload.init(option)
        }
    }
});