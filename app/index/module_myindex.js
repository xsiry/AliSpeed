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
        $.get('/rep_days_agent_mac', {date: date}, function(result) {
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
});