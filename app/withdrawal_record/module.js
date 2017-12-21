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

    var self_ = $('.withdrawal_record');
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
            // 交易状态查询
            self_.on('select2:select', 'select[name="status"]', function() {
                f_search();
            });
            // 数据表格动态高度
            $(window).resize(function() {
                self_.find('#table').bootstrapTable('resetView', {
                    height: getHeight()
                })
            });
        },
        _loadMain: function() {
            initDays();
            bsTable();
            $('select').select2();
        }
    };

    function initDays() {
        $('#withdrawal_days_time').datetimepicker({
            format: 'YYYY年MM月',
            locale: 'zh-cn'
        }).on('dp.change', function(e) {
            f_search();
        });
    }

    function formatDate(year, month) {
        month = month<10? ('0'+month): month;
        return year+'-'+month;
    }

    // bootstrap table初始化
    // http://bootstrap-table.wenzhixin.net.cn/zh-cn/documentation/
    function bsTable() {
        require('bootstrap-table');
        require('bootstrap-table-zh-CN');
        $table.bootstrapTable({
            url: url,
            queryParams: function(params) {
                var qjson = {};
                var date = $('#withdrawal_days_time').data("DateTimePicker").date();
                if (!!date) qjson['cash_month'] = formatDate(date._d.getFullYear(),(date._d.getMonth()+1));
                var qjsonkeytype = {};
                qjsonkeytype['cash_month'] = "LIKE_ALL";

                var status = self_.find('select[name="status"]').val();
                var noStatus = status === "1" ? {status: "NotEquery"}:{};
                var x_params = {};
                x_params.source = table;
                x_params.qhstr = JSON.stringify({
                    qjson: [qjson, {status: status}],
                    qjsonkeytype: [qjsonkeytype, noStatus]
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