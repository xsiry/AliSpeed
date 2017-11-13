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
    let $table = self_.find('#table');

    let url = '/user_bank',
        table = 'sys_user_bank',
        source_id = 'user_bank_id',
        sort_name = 'company',
        sort_order = 'asc',
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
            self_.on("keypress", 'input[name="searchText"]', function(e) {
                if (e.which === 13) f_search();
            });
            // 搜索内容为空时，显示全部
            self_.on('input propertychange', 'input[name="searchText"]', function() {
                if ($(this).val().length === 0) f_search();
            });
            // 添加数据
            self_.on('click', '.create_act', function() {
                createAsUpdateAction();
            });
            // 数据表格动态高度
            $(window).resize(function() {
                self_.find('#table').bootstrapTable('resetView', {
                    height: getHeight()
                })
            });
        },
        _loadMain: function() {
            bsTable();
        }
    };

    // bootstrap table初始化
    // http://bootstrap-table.wenzhixin.net.cn/zh-cn/documentation/
    function bsTable() {
        require('bootstrap-table');
        require('bootstrap-table-zh-CN');
        $table.bootstrapTable({
            url: url,
            queryParams: function(params) {
                let x_params = {};
                x_params.source = table;
                x_params.page = params.offset;
                x_params.pagesize = params.limit;
                x_params.sortname = params.sort;
                x_params.sortorder = params.order;
                return x_params;
            },
            idField: source_id,
            sortName: sort_name,
            sortOrder: sort_order,
            pageNumber:1,      //初始化加载第一页，默认第一页
            pageList: [10, 25, 50, 100],  //可供选择的每页的行数（*）
            columns: require('./columns'),
            height: getHeight(),
            striped: true,
            search: false,
            searchOnEnterKey: true,
            showRefresh: true,
            showToggle: true,
            showColumns: true,
            minimumCountColumns: 2,
            showPaginationSwitch: true,
            clickToSelect: true,
            detailView: true,
            detailFormatter: 'detailFormatter',
            pagination: true,
            paginationLoop: false,
            classes: 'table table-hover table-no-bordered',
            sidePagination: 'server',
            silentSort: false,
            smartDisplay: false,
            escape: true,
            maintainSelected: true,
            toolbar: self_.find('#toolbar')
        }).on('all.bs.table', function(e, name, args) {
            $('[data-toggle="tooltip"]').tooltip();
            $('[data-toggle="popover"]').popover();
        });
    }
    // 搜索
    function f_search() {
        let qjson = {};
        qjson[self_.find('select[name="searchWhere"]').val()] = self_.find('input[name="searchText"]').val();
        let qjsonkeytype = {};
        qjsonkeytype[self_.find('select[name="searchWhere"]').val()] = "LIKE_ALL";

        let gridparms = {
            source: table,
            qhstr: JSON.stringify({
                qjson: [qjson],
                qjsonkeytype: [qjsonkeytype]
            })
        };
        $table.bootstrapTable('refresh', {query: gridparms});
    }
    // bs表格按钮事件
    window.actionEvents = {
        'click .edit': function(e, value, row, index) {
            createAsUpdateAction(row)
        },
        'click .remove': function(e, value, row, index) {
            deleteAction(row);
        }
    };
    // 创建或修改
    function createAsUpdateAction(row) {
        $.confirm({
            type: 'blue',
            animationSpeed: 300,
            title: row? ('修改' + row.company) : '新增',
            content: 'URL:../app/bank_dialog.html',
            buttons: {
                confirm: {
                    text: '确认',
                    btnClass: 'waves-effect btn-primary',
                    action: function () {
                        let self = this;
                        self.$content.find('form').submit();
                        return false;
                    }
                },
                cancel: {
                    text: '取消',
                    btnClass: 'waves-effect waves-button'
                }
            },
            onOpen: function () {
                let self = this;
                setTimeout(function () {
                    let urls = [];
                    $.each(row, function (key, val) {
                        self.$content.find('label[for="' + key + '"]').addClass('active');
                        self.$content.find('input[name="' + key + '"]').val(val);
                    });

                    // select2初始化
                    initBank();
                    // 上传插件初始化
                    uploadFile(urls);

                    self.$content.find('form').formValidation(formFvConfig).on('success.form.fv', function (e) {
                        $(self.$$confirm[0]).prop("disabled", true);
                        // Prevent form submission
                        e.preventDefault();

                        // Get the form instance
                        let $form = $(e.target);

                        let params = {};

                        $.each($form.serializeArray(), function (i, o) {
                            params[o.name] = o.value;
                        });

                        $.post(url , params, function (result) {
                            let msg;
                            toastr.options = {
                                closeButton: true,
                                progressBar: true,
                                showMethod: 'slideDown',
                                timeOut: 4000
                            };
                            if (result.success) {
                                msg = result.msg;
                                toastr.success(msg);
                                self.close();
                                $table.bootstrapTable('refresh', {});
                            } else {
                                msg = result.msg;
                                toastr.error(msg);
                                $(self.$$confirm[0]).prop("disabled", false);
                            }
                        }, 'json');
                    });
                }, 500);
            }
        });
    }
    // 删除
    function deleteAction(row) {
         $.confirm({
            type: 'red',
            animationSpeed: 300,
            title: false,
            autoClose: 'cancel|10000',
            content: '确认删除' + row.company + '吗？',
            buttons: {
                confirm: {
                    text: '确认',
                    btnClass: 'waves-effect waves-button',
                    action: function() {
                        $.post(url + '/del', { tid: row[source_id], tname: table }, function(result) {
                            let msg;
                            toastr.options = {
                                closeButton: true,
                                progressBar: true,
                                showMethod: 'slideDown',
                                timeOut: 4000
                            };
                            if (result.success) {
                                msg = result.msg;
                                toastr.success(msg);
                                $table.bootstrapTable('refresh', {});
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
            }
        });
    }
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

    function initBank() {
        // $.getJSON('/zheng-upms-server/manage/permission/list', {systemId: systemId, type: pidType, limit: 10000}, function(json) {
        //     let datas = [{id: 0, text: '请选择上级'}];
        //     for (let i = 0; i < json.rows.length; i ++) {
        //         let data = {};
        //         data.id = json.rows[i].permissionId;
        //         data.text = json.rows[i].name;
        //         datas.push(data);
        //     }
        //     $('#bank').empty();
            $("select#bank").select2({
                language: 'zh-CN',
                placeholder: '请选择开户银行'
                // data : datas
            });
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
            field: 'url',
            upload_main: '#x-uploader',
            list_block: '#x-fileList',
            upload_btn: '#x-upload',
            pick_btn: '#x-picker'
        };
        let upload = require('upload');
        upload.init(option);
        upload._addFilePreview('#x-fileList', urls);
    }
});