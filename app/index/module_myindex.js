/**
 * Created by IntelliJ IDEA.
 * User: xsiry
 * Date: 2017/11/21
 * Time: 17:35
 */
define(function (require, exports, module) {
    var $ = require('jquery');
    require('bootstrap');
    require('jquery-confirm');
    require('select2');
    require('highcharts');
    require('moment');
    require('moment_zh_cn');
    require('bootstrap-datetimepicker');

    module.exports = {
        init: function () {},
        _loadMyIndex: function () {
            loadMyIndex();
        },
        _repMonthGrid: function () {
            repMonthGrid();
        }
    };

    function loadMyIndex() {
        initInfo();
        initSelectMac();
        initSelectEquity();
        initChart();
    }

    function initSelectMac() {
        $('#mac_time').datetimepicker({
            format: 'YYYY年MM月',
            locale: 'zh-cn',
            defaultDate: new Date()
        }).on('dp.change', function(e) {
            var date = formatDate(e.date._d.getFullYear(),(e.date._d.getMonth()+1));
            initChart('mac', date);
        });
        var date = $('#mac_time').data("DateTimePicker").date();
        initChart('mac', formatDate(date._d.getFullYear(),(date._d.getMonth()+1)));
    }

    function initSelectEquity() {
        $('#equity_time').datetimepicker({
            format: 'YYYY年MM月',
            locale: 'zh-cn',
            defaultDate: new Date()
        }).on('dp.change', function(e) {
            var date = formatDate(e.date._d.getFullYear(),(e.date._d.getMonth()+1));
            initChart('equity', date);
        });
        var date = $('#equity_time').data("DateTimePicker").date();
        initChart('equity', formatDate(date._d.getFullYear(),(date._d.getMonth()+1)));
    }

    function formatDate(year, month) {
        month = month<10? ('0'+month): month;
        return year+'-'+month;
    }

    function initInfo() {

    }

    function initChart(type, date) {
        $.get('/days_agent_mac', {date: date}, function(result) {
            var option = {
                global: {
                    useUTC: false
                },
                title: {
                    text: null
                },
                xAxis: {
                    type: 'datetime',
                        dateTimeLabelFormats: {
                        day: '%m月%d日',
                            week: '%m月%d日',
                            month: '%Y年%m月',
                            year: '%Y年'
                    },
                    labels: {
                        rotation: -45
                    }
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        label: {
                            connectorAllowed: false
                        }
                    }
                },
                    responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            legend: {
                                layout: 'horizontal',
                                align: 'center',
                                verticalAlign: 'bottom'
                            }
                        }
                    }]
                },
                credits: { enabled: false }
            };

            var mac = [];
            var equity = [];
            var total_equity = 0;
            $.each(result.data, function(i, o) {
                var split = o.days.split('-');
                var date = Date.UTC(split[0], split[1]-1, split[2]);
                mac.push([date, o.total_mac.toFloat()]);
                equity.push([date, o.total_profit.toFloat()]);
                total_equity += o.total_profit.toFloat();
            });

            if (type === 'mac') {
                option['yAxis'] = {
                    title: {
                        text: '终端(台)'
                    }
                };
                option['series'] = [{
                    name: '终端数',
                    data: mac
                }];

                option['tooltip'] = {
                    headerFormat: '<b>日期：</b>{point.x:%Y年%m月%d日}<br>',
                    pointFormat: '<b>终端：</b>{point.y:.0f}台'
                };

                Highcharts.chart('mac_container', option);
            }

            if (type === 'equity') {
                $('.x-total-equity').text(total_equity);
                option['yAxis'] = {
                    title: {
                        text: '权益(元)'
                    }
                };
                option['series'] = [{
                    name: '权益值',
                    data: equity
                }];

                option['tooltip'] = {
                    headerFormat: '<b>日期：</b>{point.x:%Y年%m月%d日}<br>',
                    pointFormat: '<b>权益：</b>{point.y:.2f}元'
                };

                Highcharts.chart('equity_container', option);
            }
        }, 'json');
    }

    function repMonthGrid() {
        $.confirm({
            title: "月度终端收益报表",
            closeIcon: true,
            columnClass: 'col-md-8 col-md-offset-2',
            content: 'url:../app/index_month_agent_mac_dialog.html',
            // cancelButton: false, // hides the cancel button.
            // confirmButton: false, // hides the confirm button.
            buttons: {
                cancel: {
                    text: '关闭',
                    btnClass: 'waves-effect waves-button'
                }
            },
            onOpen: function () {
                var self = this;
                setTimeout(function (self_) {
                    initMonth();
                    bsTable(self_);
                    // $('select').select2();

                }, 500, self);
            }
        });
    }

    // bootstrap table初始化
    // http://bootstrap-table.wenzhixin.net.cn/zh-cn/documentation/
    function bsTable(self_) {
        require('bootstrap-table');
        require('bootstrap-table-zh-CN');
        self_.$content.find('#mamTable').bootstrapTable({
            url: "/month_agent_mac",
            queryParams: function(params) {
                var qjson = {};
                qjson['months'] = self_.$content.find('#month_time').data("DateTimePicker").date()._d.getFullYear();
                var qjsonkeytype = {};
                qjsonkeytype['months'] = "LIKE_ALL";

                var x_params = {};
                x_params.source = "rep_month_agent_mac";
                x_params.qhstr = JSON.stringify({
                    qjson: [qjson, {agent_id: $('#iframe_home .user_code').text()}],
                    qjsonkeytype: [qjsonkeytype]
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
            idField: "months",
            sortName: "months",
            sortOrder: "asc",
            pageNumber:1,      //初始化加载第一页，默认第一页
            pageList: [10, 25, 50, 100],  //可供选择的每页的行数（*）
            columns: require('./mam_columns'),
            height: 500,
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
            toolbar: self_.$content.find('#toolbar')
        }).on('all.bs.table', function(e, name, args) {
            $('[data-toggle="tooltip"]').tooltip();
            $('[data-toggle="popover"]').popover();
        });
    }

    // bs表格按钮事件
    window.actionEvents = {
        'click .withdrawal': function(e, value, row, index) {
            lockAction(row);
        },
        'click .detail': function(e, value, row, index) {
            createAsUpdateAction(row);
        }
    };

    function initMonth() {
        $('#month_time').datetimepicker({
            format: 'YYYY年',
            locale: 'zh-cn',
            defaultDate: new Date()
        }).on('dp.change', function(e) {
            $(this).parent().parent().parent().parent().find('#mamTable').bootstrapTable('refresh', {});
        });
    }
});