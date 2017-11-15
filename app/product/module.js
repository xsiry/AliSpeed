/**
 * Created by IntelliJ IDEA.
 * User: xsiry
 * Date: 2017/11/13
 * Time: 16:10
 */

define(function(require, exports, module) {
    var $ = require('jquery');
    require('bootstrap');
    require('jquery-confirm');

    require('select2');
    // require('select2_zh_CN');
    require('bootstrap-touchspin');

    var self_ = $('.product');
    var $table = self_.find('#table');

    var url = '/product',
        table = 't_product',
        source_id = 'product_id',
        row_name = 'product',
        sort_name = 'product',
        sort_order = 'asc',
        validationInput = {
            product: {
                validators: {
                    notEmpty: {
                        message: '该项不能为空'
                    }
                }
            },
            factory_id: {
                validators: {
                    notEmpty: {
                        message: '该项不能为空'
                    }
                }
            },
            price: {
                validators: {
                    notEmpty: {
                        message: '该项不能为空'
                    }
                }
            },
            days: {
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

                    initTouchspin();

                    $.each(row, function (key, val) {
                        if(key === 'factory_id'){
                            initSelect(val);
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
                            if (o.value) params[o.name] = o.value;
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

    function initTouchspin() {
        $("input[name='days']").TouchSpin({
            prefix: "有效天数",
            min: 0,
            max: 1000000000,
            step: 1,
            decimals: 0,
            boostat: 5,
            maxboostedstep: 100,
            postfix: '天'
        });

        $("input[name='price']").TouchSpin({
            prefix: "商品价格",
            min: 0,
            max: 1000000000,
            step: 0.01,
            decimals: 2,
            boostat: 5,
            maxboostedstep: 100,
            postfix: '元'
        });

        $("input[name='factory_rate']").TouchSpin({
            prefix: "上游分成",
            min: 0,
            max: 100,
            step: 0.1,
            decimals: 2,
            boostat: 5,
            maxboostedstep: 10,
            postfix: '%'
        });

        $("input[name='agent_rate']").TouchSpin({
            prefix: "渠道分成",
            min: 0,
            max: 100,
            step: 0.1,
            decimals: 2,
            boostat: 5,
            maxboostedstep: 10,
            postfix: '%'
        });
    }

    function initSelect(val) {
        var params = {
            source: 't_factory',
            qtype: 'select'
        };
        $.getJSON('/factory', params, function(json) {
            var arr = [];
            for (var i = 0; i < json.length; i ++) {
                var data = {};
                data.id = json[i].factory_id;
                data.text = json[i].factory;
                arr.push(data);
            }
            $('#factory').empty().append("<option></option>");
            var select = $("select#factory").select2({
                language: 'zh-CN',
                placeholder: '请选择所属厂商',
                data : arr
            });
            if (val) select.val(val).trigger("change");
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