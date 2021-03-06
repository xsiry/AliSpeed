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

    var self_ = $('.data_statistics');
    var $table = self_.find('#table');

    var url = '/all_data',
        table = 'rep_all_data_days',
        source_id = 'days',
        sort_name = 'days',
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
            // 按钮 查看走势图
            self_.on('click', '.x-data-stat-btn', function() {
                chartsConfirm();
            });
            // 查看日详情
            self_.on('click', '.x-day-alldata-detail', function() {
                var day = $(this).data('value');
                dayDataDetail(day);
            });
            // 导出
            self_.on('click', '.x-export-btn', function() {
                var date = $('#days_time').data("DateTimePicker").date();
                var dateStr = formatDate(date._d.getFullYear(),(date._d.getMonth()+1));
                window.open("/all_data/export?where=days&text="+dateStr);
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
        }
    };

    function initDays() {
        $('#days_time').datetimepicker({
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

    // 走势图模态窗
    function chartsConfirm() {
        var date = $('#days_time').data("DateTimePicker").date();
        $.confirm({
            title: "数据统计走势图",
            content: 'url:../app/data_statistics_charts_dialog.html',
            buttons: {
                cancel: {
                    text: '关闭',
                    btnClass: 'waves-effect waves-button'
                }
            },
            onOpen: function () {
                setTimeout(function (days) {
                    initCharts(days);
                }, 500, formatDate(date._d.getFullYear(),(date._d.getMonth()+1)));
            }
        });
    }

    // 走势图
    function initCharts(days) {
        $.get('/all_data/q_charts', {date: days? days: 'all'}, function(result) {
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
                    enabled: true
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

            var history_mac = [],
                new_mac = [],
                active_mac = [],
                history_users = [],
                new_users = [],
                active_users = [],
                sales_amount = [],
                agent_amount = [],
                agent_total = [];

            $.each(result.data, function(i, o) {
                var split = o.days.split('-');
                var date = Date.UTC(split[0], split[1]-1, split[2]);

                history_mac.push([date, parseInt(o.history_mac)]);
                new_mac.push([date, parseInt(o.new_mac)]);
                active_mac.push([date, parseInt(o.active_mac)]);

                history_users.push([date, parseInt(o.history_users)]);
                new_users.push([date, parseInt(o.new_users)]);
                active_users.push([date, parseInt(o.active_users)]);

                sales_amount.push([date, parseInt(o.sales_amount)]);
                agent_amount.push([date, parseInt(o.agent_amount)]);
                agent_total.push([date, parseInt(o.agent_total)]);
            });

            option['yAxis'] = {
                title: {
                    text: '数值(台、个、元)'
                }
            };
            option['series'] = [{
                name: '历史终端数',
                data: history_mac
            },{
                name: '当日新增终端',
                data: new_mac
            },{
                name: '当日活跃终端',
                data: active_mac
            },{
                name: '历史用户数',
                data: history_users
            },{
                name: '当日新增用户',
                data: new_users
            },{
                name: '当日活跃用户',
                data: active_users
            },{
                name: '日销售金额',
                data: sales_amount
            },{
                name: '日渠道分成金额',
                data: agent_amount
            },{
                name: '日渠道数量',
                data: agent_total
            }];

            option['tooltip'] = {
                headerFormat: '',
                formatter: function() {
                    var date = '<b>日期：</b>'+ Highcharts.dateFormat('%Y年%m月%d日', this.point.x) +'<br>';
                    var val = '<b>'+this.series.name+'：</b>'+this.point.y;
                    var com_hash = {
                        '历史终端数': '台', '当日新增终端': '台', '当日活跃终端': '台',
                        '历史用户数': '个', '当日新增用户': '个', '当日活跃用户': '个',
                        '日销售金额': '元', '日渠道分成金额': '元', '日渠道数量': '元'
                    };
                    var company = com_hash[this.series.name];
                    return date + val + company;
                }
            };

            Highcharts.chart('data_statistics_charts', option);
        }, 'json');
    }

    // 日详情
    function dayDataDetail(day) {
        $.confirm({
            title: "全国数据统计|" + day,
            closeIcon: true,
            content: 'url:../app/data_statistics_detail_dialog.html',
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
                setTimeout(function (self_, account) {
                    var params = {
                        source: table,
                        qtype: 'select',
                        qhstr: JSON.stringify({
                            qjson: [{days: day}],
                            qjsonkeytype: [{'days': 'LIKE_ALL'}]
                        })
                    }
                    $.get('/all_data', params, function (result) {
                        self_.$content.find('.x-data-statistics-detail').empty();
                        var nameKey = {
                            history_mac: "历史终端数(台)",
                            new_mac: "日新增终端(台)",
                            active_mac: "日活跃终端(台)",
                            history_users: "历史用户数(个)",
                            new_users: "当日新增用户(个)",
                            active_users: "当日活跃用户(个)",
                            sales_amount: "日销售金额(元)",
                            agent_amount: "日渠道分成金额(元)",
                            agent_total: "日渠道数量(个)"
                        };
                        $.each(result.rows[0], function(k, v) {
                            var row = $('<tr><td>'+nameKey[k]+'</td><td>'+v+'</td></tr>');
                            if (nameKey[k]) self_.$content.find('.x-data-statistics-detail').append(row);
                        });
                    }, 'json')
                }, 500, self, day);
            }
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
                var date = $('#days_time').data("DateTimePicker").date();
                qjson['days'] = formatDate(date._d.getFullYear(),(date._d.getMonth()+1));
                var qjsonkeytype = {};
                qjsonkeytype['days'] = "LIKE_ALL";

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