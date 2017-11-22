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

    function initSelectMac(val) {
        var params = {
            source: 'dict_systemset',
            qtype: 'select',

        };
        $.getJSON('/dict', params, function(json) {
            var arr = [];
            for (var i = 0; i < json.length; i ++) {
                var data = {};
                data.id = json[i].ss_key +"-"+ json[i].ss_val;
                data.text = json[i].remark;
                arr.push(data);
            }
            var select = $('select#mac_time').empty().append("<option></option>").select2({
                language: 'zh-CN',
                placeholder: '请选择设置',
                data : arr
            });
            if (val) select.val(val).trigger("change");
        });
    }

    function initSelectEquity(val) {
        var params = {
            source: 'dict_systemset',
            qtype: 'select',

        };
        $.getJSON('/dict', params, function(json) {
            var arr = [];
            for (var i = 0; i < json.length; i ++) {
                var data = {};
                data.id = json[i].ss_key +"-"+ json[i].ss_val;
                data.text = json[i].remark;
                arr.push(data);
            }
            var select = $("select#equity_time").empty().append("<option></option>").select2({
                language: 'zh-CN',
                placeholder: '请选择设置',
                data : arr
            });
            if (val) select.val(val).trigger("change");
        });
    }

    function initInfo() {

    }

    function initChart() {
        $.get('/rep_days_agent_mac', {}, function(result) {
            var option = {
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
            $.each(result.data, function(i, o) {
                var split = o.days.split('-');
                var date = Date.UTC(split[0], split[1], split[2]);
                mac.push([date, o.total_mac.toFloat()]);
                equity.push([date, o.total_profit.toFloat()]);
            });

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
        }, 'json');
    }
});