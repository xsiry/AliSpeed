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

    var self_ = $('.order');
    var $table = self_.find('#table');

    var url = '/product_order',
        table = 'rep_product_order',
        source_id = 'order_code',
        sort_name = 'order_time',
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
            self_.on('select2:select', 'select[name="pay_status"]', function() {
                f_search();
            });
            // 订单类型查询
            self_.on('select2:select', 'select[name="order_type"]', function() {
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
            bsTable();
            initDays();
            $('select').select2();
        }
    };

    function initDays() {
        $('#started_time').datetimepicker({
            format: 'YYYY-MM-DD HH:mm:ss',
            locale: 'zh-cn',

        }).on('dp.change', function(e) {
            $('#ended_time').data("DateTimePicker").minDate(e.date);
            f_search();
        });

        $('#ended_time').datetimepicker({
            format: 'YYYY-MM-DD HH:mm:ss',
            locale: 'zh-cn',
            useCurrent: false,
        }).on('dp.change', function(e) {
            $('#started_time').data("DateTimePicker").maxDate(e.date);
            f_search();
        });
    }

    // bootstrap table初始化
    // http://bootstrap-table.wenzhixin.net.cn/zh-cn/documentation/
    function bsTable() {
        require('bootstrap-table');
        require('bootstrap-table-zh-CN');
        $table.bootstrapTable({
            url: url,
            queryParams: function(params) {
                var pay_status = self_.find('select[name="pay_status"]').val();
                var order_type = self_.find('select[name="order_type"]').val();

                var qjson = [{pay_status: pay_status}, {order_type: order_type}];
                var qjsonkeydatetype = [];

                if ($('#started_time').val() && $('#ended_time').val()) {
                    var moment = require('moment');
                    var startedat = $('#started_time').data("DateTimePicker").date();
                    var endedat = $('#ended_time').data("DateTimePicker").date();
                    var startedatStr = moment(startedat._d).format('YYYY-MM-DD HH:mm:ss');
                    var endedatStr = moment(endedat._d).format('YYYY-MM-DD HH:mm:ss');
                    qjson.push({order_time: startedatStr+"~"+endedatStr});
                    qjsonkeydatetype.push({order_time: "BetweenEqual"})
                }

                var whash = {};
                var vhash = {};
                whash[self_.find('select[name="searchWhere"]').val()] = self_.find('input[name="searchText"]').val();
                vhash[self_.find('select[name="searchWhere"]').val()] = "LIKE_ALL";

                qjson.push(whash);
                qjsonkeydatetype.push(vhash);

                var x_params = {};
                x_params.source = table;
                x_params.qhstr = JSON.stringify({
                    qjson: qjson,
                    qjsonkeytype: qjsonkeydatetype
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