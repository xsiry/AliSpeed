/**
 * Created by IntelliJ IDEA.
 * User: xsiry
 * Date: 2017/11/08
 * Time: 12:14
 */

define(function (require, exports, module) {
    var $ = require('jquery');
    require('echarts');

    var self_ = $('.echarts_statistcs');
    var $table = self_.find('#table');

    var curIndx = 0;
    var mapType = [ // 23个省
        '江苏', '青海', '四川', '海南', '陕西',
        '甘肃', '云南', '湖南', '湖北', '黑龙江',
        '贵州', '山东', '江西', '河南', '河北',
        '山西', '安徽', '福建', '浙江', '广东',
        '吉林', '辽宁', '台湾',
        // 5个自治区
        '新疆', '广西', '宁夏', '内蒙古', '西藏',
        // 4个直辖市
        '北京', '天津', '上海', '重庆',
        // 2个特别行政区
        '香港', '澳门'
    ];

    var pcChart;
    var myChart;
    var colorList;

    var url = '/all_data',
        table = 'rep_all_data_days',
        source_id = 'days',
        sort_name = 'days',
        sort_order = 'asc';

    module.exports = {
        init: function () {
            this._loadMain();
            this._bindUI();
        },
        _bindUI: function () {
            // 搜索监听回车
            self_.on("keypress", 'input[name="searchText"]', function (e) {
                if (e.which === 13) f_search();
            });
            // 搜索内容为空时，显示全部
            self_.on('input propertychange', 'input[name="searchText"]', function () {
                if ($(this).val().length === 0) f_search();
            });
            // 按钮 查看走势图
            self_.on('click', '.x-data-stat-btn', function () {
            });
        },
        _loadMain: function () {
            // colorList = require('zrender/tool/color').getGradientColors(
            //     ['red','yellow','lightskyblue'], 10
            // );
            // console.log(echarts)
            // myChart = echarts.init(document.getElementById('map_main'));
            self_.find('#map_main').css('height', getHeight());
            $.get('../plugins/echarts/china.json', function (chinaJson) {
                echarts.registerMap('china', chinaJson);
                var chart = echarts.init(document.getElementById('map_main'));
                $.get('/mac_user_province',{}, function(result) {
                    var list = result.success? result.list : [];
                    var data = [];
                    $.each(list, function(i, o) {
                        var hash = {};
                        hash['name'] = o.province;
                        hash['value'] = o.mac_total;
                        data.push(hash)
                    });
                    chart.setOption(getChinaMapChartOption(data));
                }, 'json');
            });
        }
    };

    function getChinaMapChartOption(data) {
        return {
            title: {
                text: '全国终端分布图',
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                data: ['系统用户数量']
            },
            dataRange: {
                min: 0,
                max: 100000,   //此处由于echarts的bug 默认的max最小值为100且为100的整数倍
                color: ['#bf444c', '#f5e9a3'],
                text: ['高', '低'], // 文本，默认为数值文本
                calculable: true
            },
            toolbox: {
                show: false,
                orient: 'vertical',
                x: 'right',
                y: 'center',
                feature: {
                    mark: true,
                    dataView: {readOnly: true},
                    restore: true,
                    saveAsImage: true
                }
            },
            series: [{
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        var val = isNaN(params.value) ? '-' : params.value;
                        return "地区：" + params.name + "<br />终端数：" + val;
                    }
                },
                name: '终端数',
                type: 'map',
                map: 'china',
                mapLocation: {
                    x: 'left',
                    width: getHeight(),
                },
                selectedMode: 'single',
                itemStyle: {
                    normal: {label: {show: true}},
                    emphasis: {
                        // areaColor:'rgba(66, 78, 222, 0)',
                        label: {
                            show: true,
                            color: 'red',
                            textStyle: {
                                // fontWeight:'bold',
                                color: "red"
                            }
                        }
                    }
                },
                data: data
            }],
            animation: false
        };
    }
    // 市级显示
    // function mapSelected(param) {
    //     var len = mapType.length;
    //     var mt = mapType[curIndx % len];
    //     var selected = param.selected;
    //     for (var i in selected) {
    //         if (selected[i]) {
    //             mt = i;
    //             while (len--) {
    //                 if (mapType[len] == mt) {
    //                     curIndx = len;
    //                 }
    //             }
    //             break;
    //         }
    //     }
    //     $.post('${pageContext.request.contextPath}/usermanager!ajaxUserAreaJson.action', {'provinceName': mt},
    //         function (data) {
    //             datas = eval('(' + data + ')');
    //             var option = {
    //                 title: {
    //                     text: '江苏',
    //                 },
    //                 tooltip: {
    //                     trigger: 'item',
    //                     //formatter: '{b}'
    //                 },
    //                 legend: {
    //                     orient: 'vertical',
    //                     x: 'right',
    //                     data: ['系统用户数量']
    //                 },
    //                 dataRange: {
    //                     min: 0,
    //                     max: 100,   //此处由于echarts的bug 默认的max最小值为100且为100的整数倍
    //                     color: ['orange', 'yellow'],
    //                     text: ['高', '低'], // 文本，默认为数值文本
    //                     calculable: true
    //                 },
    //                 toolbox: {
    //                     show: false,
    //                     orient: 'vertical',
    //                     x: 'right',
    //                     y: 'center',
    //                     feature: {
    //                         mark: true,
    //                         dataView: {readOnly: true},
    //                         restore: true,
    //                         saveAsImage: true
    //                     }
    //                 },
    //                 series: [
    //                     {
    //                         name: '系统用户数量',
    //                         type: 'map',
    //                         mapType: 'china',
    //                         selectedMode: 'single',
    //                         itemStyle: {
    //                             normal: {label: {show: true}},
    //                             emphasis: {label: {show: true}}
    //                         },
    //                         data: datas
    //                     }
    //                 ]
    //             };
    //             option.tooltip.formatter = '{b}：{c}';
    //             option.series[0].mapType = mt;
    //             option.title.text = mt + "-系统用户分布";
    //             pcChart.setOption(option, true);
    //         });
    // }


    // 动态高度
    function getHeight() {
        return $('.x-content').height() - 3;
    }
});