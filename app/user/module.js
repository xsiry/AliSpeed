/**
 * Created by IntelliJ IDEA.
 * User: xsiry
 * Date: 2017/11/13
 * Time: 15:32
 */

define(function(require, exports, module) {
    var $ = require('jquery');
    require('bootstrap');
    require('jquery-confirm');

    require('select2');
    // require('select2_zh_CN');

    var self_ = $('.user');
    var $table = self_.find('#table');

    var url = '/user',
        table = 'sys_user',
        source_id = 'user_id',
        row_name = 'account',
        sort_name = 'account',
        sort_order = 'asc',
        validationInput = {
            account: {
                validators: {
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                    regexp: {
                        regexp: /^[a-zA-z0-9_]+$/,
                        message: '用户名只能由数字、字母和下划线组成'
                    }
                }
            },
            relname: {
                validators: {
                    notEmpty: {
                        message: '真实姓名不能为空'
                    }
                }
            },
            pwd: {
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    stringLength: {
                        min: 3,
                        max: 16,
                        message: '密码长度必须在3~16之间'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9]+$/,
                        message: '密码只能由大小写字母和数字组成'
                    },
                    identical: {
                        field: 'confirm_pwd',
                        message: '密码与确认密码不一致'

                    },
                }
            },
            confirm_pwd: {
                validators: {
                    notEmpty: {
                        message: '确认密码不能为空'
                    },
                    stringLength: {
                        min: 3,
                        max: 16,
                        message: '密码长度必须在3~16之间'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9]+$/,
                        message: '密码只能由大小写字母和数字组成'
                    },
                    identical: {
                        field: 'pwd',
                        message: '确认密码与密码不一致'

                    }
                }
            },
            rid: {
                validators: {
                    notEmpty: {
                        message: '用户角色不能为空'
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
            $('select').select2();
        }
    };

    // 创建或修改
    function createAsUpdateAction(row) {
        $.confirm({
            type: 'blue',
            animationSpeed: 300,
            title: row? ('修改 ' + row[row_name]) : '新增',
            content: 'URL:../app/'+ url +'_dialog.html',
            buttons: {
                confirm: {
                    text: '确认',
                    btnClass: 'waves-effect btn-primary',
                    action: function () {
                        var self = this;
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
                var self = this;
                setTimeout(function () {
                    initSelect();

                    $.each(row, function (key, val) {
                        if(key === 'rid'){
                            initSelect(val);
                        } else if (key === 'pwd') {
                            self.$content.find('label[for="' + key + '"]').parent().remove();
                            self.$content.find('label[for="confirm_pwd"]').parent().remove();
                        } else {
                            self.$content.find('label[for="' + key + '"]').addClass('active');
                            self.$content.find('input[name="' + key + '"]').val(val)
                        }
                    });

                    self.$content.find('form').formValidation(formFvConfig()).on('success.form.fv', function (e) {
                        $(self.$$confirm[0]).prop("disabled", true);
                        // Prevent form submission
                        e.preventDefault();

                        // Get the form instance
                        var $form = $(e.target);

                        var params = {};

                        $.each($form.serializeArray(), function (i, o) {
                            params[o.name] = o.value;
                        });

                        $.post(url , params, function (result) {
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

    function initSelect(val) {
        var params = {
            source: 't_role',
            qtype: 'select'
        };
        $.getJSON('/user', params, function(json) {
            var arr = [];
            for (var i = 0; i < json.length; i ++) {
                var data = {};
                data.id = json[i].rid;
                data.text = json[i].rolename;
                arr.push(data);
            }
            $('#rid').empty().append("<option></option>");
            var select = $("select#rid").select2({
                language: 'zh-CN',
                placeholder: '请选择账号角色',
                data : arr
            });
            if (val) select.val(val).trigger("change");
        });
    }

    // 用户禁用启用
    function lockAction(row) {
        $.confirm({
            type: 'blue',
            animationSpeed: 300,
            title: false,
            autoClose: 'cancel|10000',
            content: '确认'+ (row.status === '1'? '禁用 ':'启用 ') + row[row_name] + '吗？',
            buttons: {
                confirm: {
                    text: '确认',
                    btnClass: 'waves-effect waves-button',
                    action: function() {
                        var params = {
                            user_id: row.user_id,
                            status: row.status === '1'?2:1
                        };
                        $.post(url+'/set_status', params, function(result) {
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

    // 删除
    function deleteAction(row) {
        $.confirm({
            type: 'red',
            animationSpeed: 300,
            title: false,
            autoClose: 'cancel|10000',
            content: '确认删除' + row[row_name] + '吗？',
            buttons: {
                confirm: {
                    text: '确认',
                    btnClass: 'waves-effect waves-button',
                    action: function() {
                        $.post(url + '/del', { tid: row[source_id], tname: table }, function(result) {
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

    // bootstrap table初始化
    // http://bootstrap-table.wenzhixin.net.cn/zh-cn/documentation/
    function bsTable() {
        require('bootstrap-table');
        require('bootstrap-table-zh-CN');
        $table.bootstrapTable({
            url: url,
            queryParams: function(params) {
                var x_params = {};
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
            detailView: false,
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
        var qjson = {};
        qjson[self_.find('select[name="searchWhere"]').val()] = self_.find('input[name="searchText"]').val();
        var qjsonkeytype = {};
        qjsonkeytype[self_.find('select[name="searchWhere"]').val()] = "LIKE_ALL";

        var gridparms = {
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
        'click .lock': function(e, value, row, index) {
            lockAction(row);
        },
        'click .edit': function(e, value, row, index) {
            createAsUpdateAction(row);
        },
        'click .remove': function(e, value, row, index) {
            deleteAction(row);
        }
    };

    // 动态高度
    function getHeight() {
        return $('.x-content').height() - 3;
    }
});