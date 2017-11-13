/**
 * Created by IntelliJ IDEA.
 * User: xsiry
 * Date: 2017/11/08
 * Time: 12:14
 */

define(function(require, exports, module) {
    var $ = require('jquery');
    require('bootstrap');
    require('jquery-confirm');

    require('select2');
    // require('select2_zh_CN');

    var self_ = $('.game_menu');
    var $table = self_.find('#table');

    var url = '/game_menu',
        table = 't_game_menu',
        source_id = 'game_menu_id',
        row_name = 'menuname',
        sort_name = 'menuorder',
        sort_order = 'asc',
        validationInput = {
            menuname: {
                validators: {
                    notEmpty: {
                        message: '该项不能为空'
                    }
                }
            },
            level: {
                validators: {
                    notEmpty: {
                        message: '该项不能为空'
                    }
                }
            },
            parentid: {
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
                    // select2初始化
                    initSelect();

                    // 添加单选事件
                    self.$content.on('click', 'input[name="showtype"]', function() {
                        $(this).val() === "1"? self.$content.find('.x-url').show():self.$content.find('.x-url').hide();
                    });

                    $.each(row, function (key, val) {
                        if (key === 'showtype') {
                            self.$content.find('input[name="' + key + '"][value="'+ val +'"]').trigger('click');
                        }else if(key === 'parentid'){
                            initSelect(val+'-'+(parseInt(row.level)-1));
                        } else{
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

                        params['level'] = parseInt(params['parentid'].split('-')[1])+1;
                        params['parentid'] = params['parentid'].split('-')[0];


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
        $.getJSON(url + '/leveSelect', {}, function(json) {
            var arr = [{id: '0-0', text: 'root'}];
            for (var i = 0; i < json.length; i ++) {
                var data = {};
                data.id = json[i].id+'-'+json[i].level;
                data.text = json[i].text;
                arr.push(data);
            }
            $('#parent').empty().append("<option></option>");
            var select = $("select#parent").select2({
                language: 'zh-CN',
                placeholder: '请选择上级菜单',
                data : arr
            });
            select.val(val).trigger("change");
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
                x_params.qhstr = JSON.stringify({
                    qjson: [{parentid: 0}]
                });
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
        var qjson = {};
        qjson[self_.find('select[name="searchWhere"]').val()] = self_.find('input[name="searchText"]').val();
        var qjsonkeytype = {};
        qjsonkeytype[self_.find('select[name="searchWhere"]').val()] = "LIKE_ALL";

        var gridparms = {
            source: table,
            qhstr: JSON.stringify({
                qjson: [qjson, {parentid: 0}],
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

    // 动态高度
    function getHeight() {
        return $('.x-content').height() - 3;
    }
});