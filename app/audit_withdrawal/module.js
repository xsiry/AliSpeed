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
    require('bootstrap-touchspin');

    var self_ = $('.audit_withdrawal');
    var $table = self_.find('#table');

    var url = '/agent_cashapply',
        table = 'rep_agent_cashapply',
        source_id = 'cash_month',
        sort_name = 'cash_time',
        sort_order = 'desc';

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

    function initTouchspin() {
        $("input[name='tallage']").TouchSpin({
            prefix: "代扣税",
            min: 0,
            max: 1000000000,
            step: 0.01,
            decimals: 2,
            boostat: 5,
            maxboostedstep: 100,
            postfix: '元'
        });

        $("input[name='cash_costs']").TouchSpin({
            prefix: "手续费",
            min: 0,
            max: 1000000000,
            step: 0.01,
            decimals: 2,
            boostat: 5,
            maxboostedstep: 100,
            postfix: '元'
        });

        $("input[name='last_money']").TouchSpin({
            prefix: "实际提现",
            min: 0,
            max: 1000000000,
            step: 0.01,
            decimals: 2,
            boostat: 5,
            maxboostedstep: 100,
            postfix: '元'
        });
    }

    // 创建或修改
    function createAsUpdateAction(row) {
        var rolename = $('.x-rolename-hidden').val();
        var title = '';
        var content = '';
        if (rolename==="渠道部") {
            title = '提现审核';
            content = '<div style="margin-bottom: 15px;">'+
                '<select id="agent_audit" style="width: 150px;">'+
                '<option value="3">审核通过</option>' +
                '<option value="4">审核失败</option></select>'+
                '<div class="form-group" style="margin-top: 15px"><label for="agent_audit">审核备注(失败必填)<span class="x-error"></span></label><input id="agent_audit" type="text" class="form-control x-agent-audit-remarks"></div>';
        }else if (rolename==="财务部") {
            title = '提现打款';
            content = '<div class="form-group" style="margin-top: 15px"><input id="tallage" type="text" name="tallage" class="form-control x-intfloat" value="0.00" style="padding-left: 10px;"></div>' +
                '<div class="form-group" style="margin-top: 15px"><input id="cash_costs" type="text" name="cash_costs" class="form-control x-intfloat" value="0.00" style="padding-left: 10px;"></div>' +
                '<div class="form-group" style="margin-top: 15px"></label><input id="last_money" type="text" name="last_money" class="form-control x-intfloat" value="0.00" style="padding-left: 10px;"></div>';
        }
        $.confirm({
            type: 'blue',
            animationSpeed: 300,
            title: title +' 账号：' + row['account'],
            content: content,
            buttons: {
                confirm: {
                    text: '确认',
                    btnClass: 'waves-effect btn-primary',
                    action: function () {
                        var params = {
                            cash_month: row['cash_month'],
                            agent_id: row['agent_id']
                        };

                        if (rolename === "渠道部") {
                            params['status'] = $('#agent_audit').val();
                            params['remarks'] =  $('.x-agent-audit-remarks').val();

                            if ($('#agent_audit').val() === "4" && $('.x-agent-audit-remarks').val() === "") {
                                $.alert({
                                    title: '错误!',
                                    content: '失败审核备注不能为空!',
                                    confirm: {
                                        text: '确认',
                                        btnClass: 'waves-effect btn-primary'
                                    }
                                });
                                return false;
                            }
                        }else if (rolename === "财务部") {
                            params['tallage'] = $('#tallage').val();
                            params['cash_costs'] = $('#cash_costs').val();
                            params['last_money'] = $('#last_money').val();
                            params['status'] = 8;
                        }

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
                    }
                },
                cancel: {
                    text: '取消',
                    btnClass: 'waves-effect waves-button'
                }
            },
            onOpen: function () {
                setTimeout(function () {
                    $('select').select2();
                    initTouchspin();
                }, 500);
            }
        });
    }

    // bootstrap table初始化
    // http://bootstrap-table.wenzhixin.net.cn/zh-cn/documentation/
    function bsTable() {
        require('bootstrap-table');
        require('bootstrap-table-zh-CN');
        var rolename = $('.x-rolename-hidden').val();
        var status = 0;
        if (rolename === "财务部") {
            status = "3@8";
        } else if (rolename === "渠道部") {
            status = "2@3@4";
        } else if (rolename === "超级管理员") {
            status = "2@3@4@8";
        }
        $table.bootstrapTable({
            url: url,
            queryParams: function(params) {
                var qjson = {};
                qjson[self_.find('select[name="searchWhere"]').val()] = self_.find('input[name="searchText"]').val();
                var qjsonkeytype = {};
                qjsonkeytype[self_.find('select[name="searchWhere"]').val()] = "LIKE_ALL";

                var x_params = {};
                x_params.source = table;
                x_params.qhstr = JSON.stringify({
                    qjson: [qjson, {status: status}],
                    qjsonkeytype: [qjsonkeytype, {status: "OR"}]
                });

                if(params.offset!==null&&params.limit) {
                    x_params.page = params.offset/params.limit+1;
                    x_params.pagesize = params.limit;
                }else {
                    x_params.qtype = 'select';
                }
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
            showPaginationSwitch: false,
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
        $table.bootstrapTable('selectPage', 1);
        $table.bootstrapTable('refresh', {});
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