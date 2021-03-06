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
    require('highcharts');
    require('moment');
    require('moment_zh_cn');
    require('bootstrap-datetimepicker');

    var self_ = $('.sale_statistics');
    var $table = self_.find('#table');

    var url = '/sale_statistics',
        table = 'rep_sale_month',
        source_id = 'months',
        sort_name = 'months',
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
            // 按钮 查看日报表
            self_.on('click', '.x-sale-stat-btn', function() {
                tableDayConfirm();
            });
            // 数据表格动态高度
            $(window).resize(function() {
                self_.find('#table').bootstrapTable('resetView', {
                    height: getHeight()
                })
            });
        },
        _loadMain: function() {
            $('select').select2();
            initDays();
            bsTable();
        }
    };

    function initDays() {
        $('#sale_days_time').datetimepicker({
            format: 'YYYY年MM月',
            locale: 'zh-cn',
            defaultDate: new Date()
        }).on('dp.change', function(e) {
            f_search();
        });
    }

    function formatDate(year, month) {
        month = month<10? ('0'+month): month;
        return year+'-'+month;
    }

    function tableDayConfirm() {
        var date = $('#sale_days_time').data("DateTimePicker").date();
        var date_str = formatDate(date._d.getFullYear(),(date._d.getMonth()+1));
        $.confirm({
            title: "销售数据|日报表|" + date_str,
            content: 'url:../app/sale_statistics_table_dialog.html',
            columnClass: 'col-md-8 col-md-offset-2',
            buttons: {
                cancel: {
                    text: '关闭',
                    btnClass: 'waves-effect waves-button'
                }
            },
            onOpen: function () {
                var self = this;
                setTimeout(function (days) {
                    initTable(self.$content, self.$content.find('#days_table'), days);
                    $('select').select2();
                    // 搜索监听回车
                    self.$content.on("keypress", 'input[name="searchTextDay"]', function(e) {
                        if (e.which === 13)  {
                            self.$content.find('#days_table').bootstrapTable('selectPage', 1);
                            self.$content.find('#days_table').bootstrapTable('refresh', {});
                        }
                    });
                    // 搜索内容为空时，显示全部
                    self.$content.on('input propertychange', 'input[name="searchTextDay"]', function() {
                        if ($(this).val().length === 0) {
                            self.$content.find('#days_table').bootstrapTable('selectPage', 1);
                            self.$content.find('#days_table').bootstrapTable('refresh', {});
                        }
                    });
                }, 500, date_str);
            }
        });
    }

    function initTable(me, object, days) {
        require('bootstrap-table');
        require('bootstrap-table-zh-CN');
        object.bootstrapTable({
            url: "/sale_statistics/anget_statistics",
            queryParams: function(params) {
                var qjson = {};
                qjson['days'] = days;
                var queryrt = [];
                if (me.find('select[name="searchWhereDay"]').val() === "account") {
                    queryrt = [{
                        reltb: 'sys_user',
                        reltbfield: 'account',
                        maintbfield: 'agent_id',
                        reltbfieldvalue: me.find('input[name="searchTextDay"]').val(),
                        qtype: 'LIKE_ALL'
                    }]
                } else {
                    qjson[me.find('select[name="searchWhereDay"]').val()] = me.find('input[name="searchTextDay"]').val();
                }

                var qjsonkeytype = {};
                qjsonkeytype['days'] = "LIKE_ALL";
                qjsonkeytype[me.find('select[name="searchWhereDay"]').val()] = "LIKE_ALL";

                var x_params = {};
                x_params.source = "rep_sale_day";
                x_params.qhstr = JSON.stringify({
                    qjson: [qjson],
                    qjsonkeytype: [qjsonkeytype],
                    queryrt: queryrt
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
            idField: "days",
            sortName: "days",
            sortOrder: "desc",
            pageNumber:1,      //初始化加载第一页，默认第一页
            pageList: [10, 25, 50, 100],  //可供选择的每页的行数（*）
            columns: require('./columns_day'),
            height: 500,
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
            toolbar: self_.find('#day_toolbar')
        }).on('all.bs.table', function(e, name, args) {
            $('[data-toggle="tooltip"]').tooltip();
            $('[data-toggle="popover"]').popover();
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
                var qjson = {};
                var date = $('#sale_days_time').data("DateTimePicker").date();
                qjson['months'] = formatDate(date._d.getFullYear(),(date._d.getMonth()+1));
                qjson[self_.find('select[name="searchWhere"]').val()] = self_.find('input[name="searchText"]').val();
                var qjsonkeytype = {};
                qjsonkeytype[self_.find('select[name="searchWhere"]').val()] = "LIKE_ALL";

                var x_params = {};
                x_params.source = table;
                x_params.qhstr = JSON.stringify({
                    qjson: [qjson],
                    qjsonkeytype: [qjsonkeytype]
                })
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

    // 动态高度
    function getHeight() {
        return $('.x-content').height() - 3;
    }
});