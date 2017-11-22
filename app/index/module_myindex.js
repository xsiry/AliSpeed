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
        Highcharts.chart('mac_container', {
            title: {
                text: null
            },
            yAxis: {
                title: {
                    text: '终端(台)'
                }
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
            tooltip: {
                headerFormat: '<b>日期：</b>{point.x:%Y年%m月%d日}<br>',
                pointFormat: '<b>终端：</b>{point.y:.0f}台'
            },
            legend: {
                enabled: false
            },
            series: [{
                name: '终端数',
                data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
            }],
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
            credits: { enabled: false } //不显示LOGO
        });

        Highcharts.chart('equity_container', {
            title: {
                text: null
            },
            yAxis: {
                title: {
                    text: '权益(元)'
                }
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
            tooltip: {
                headerFormat: '<b>日期：</b>{point.x:%Y年%m月%d日}<br>',
                pointFormat: '<b>权益：</b>{point.y:.2f}元'
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
            series: [{
                name: '权益值',
                data: [{
                    x: Date.UTC(2013,5,2),
                    y: 0.7648,
                    name: "Point2",
                    color: "#00FF00"
                }, {
                    x: Date.UTC(2013,5,4),
                    y: 0.7645,
                    name: "Point1",
                    color: "#FF00FF"
                }, {
                    x: Date.UTC(2013,5,5),
                    y: 0.7645,
                    name: "Point1",
                    color: "#FF00FF"
                }]
            }],
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
        });
    }
});