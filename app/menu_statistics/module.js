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

    var self_ = $('.menu_statistics');
    var $table = self_.find('#table');

    var url = '/click_statistics',
        table = 'rep_menu_click_month',
        source_id = 'rep_month',
        sort_name = 'rep_month',
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
            self_.on('click', '.x-menu-stat-btn', function() {
                chartsDayConfirm();
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
        $('#menu_days_time').datetimepicker({
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

    // 游戏点击当月日走势图
    function chartsDayConfirm() {
        var date = $('#menu_days_time').data("DateTimePicker").date();
        var date_str = formatDate(date._d.getFullYear(),(date._d.getMonth()+1));
        $.confirm({
            title: "菜单点击|日走势图|" + date_str,
            content: 'url:../app/menu_statistics_charts_dialog.html',
            columnClass: 'col-md-8 col-md-offset-2',
            buttons: {
                cancel: {
                    text: '关闭',
                    btnClass: 'waves-effect waves-button'
                }
            },
            onOpen: function () {
                setTimeout(function (days) {
                    initCharts(days);
                }, 500, date_str);
            }
        });
    }

    function initCharts(days) {
        $.get('/click_statistics/q_menu_charts', {date: days? days: 'all'}, function(result) {
            var option = chartsOption();
            var series = [];
            var name = undefined;
            var object = undefined;
            for(var i = 0; i <= result.data.length; i++) {
                var o = result.data[i];
                var node;
                if (o) {
                    var split = o.rep_day.split('-');
                    var date = Date.UTC(split[0], split[1]-1, split[2]);
                    node = [date, parseInt(o.click)];
                }
                if (o && name === o.menu) {
                    object.data.push(node);
                }else {
                    if (!!object) series.push(object);
                    name = o? o.menu:'';
                    object = {name: name, data: [node]};
                }
            }

            option['yAxis'] = {
                title: {
                    text: '点击数(次)'
                }
            };
            option['series'] = series;

            option['tooltip'] = {
                headerFormat: '<b>日期：</b>{point.x:%Y年%m月%d日}<br>',
                pointFormat: '<b>{series.name}：</b>{point.y:.0f}次'
            };

            Highcharts.chart('menu_statistics_charts', option);
        }, 'json');
    }

    function chartsOption() {
        return {
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
                var date = $('#menu_days_time').data("DateTimePicker").date();
                qjson['rep_month'] = formatDate(date._d.getFullYear(),(date._d.getMonth()+1));
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
        $table.bootstrapTable('refresh', {});
    }

    // 动态高度
    function getHeight() {
        return $('.x-content').height() - 3;
    }
});