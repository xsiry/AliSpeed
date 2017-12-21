/**
 * Created by IntelliJ IDEA.
 * User: xsiry
 * Date: 2017/12/20
 * Time: 10:52
 */
define(function (require, exports, module) {
    var $ = require('jquery');
    require('bootstrap');
    require('jquery-confirm');
    require('moment');
    require('moment_zh_cn');
    require('bootstrap-datetimepicker');
    require.async('select2');

    require('echarts');

    var self_ = $('#x-index');

    module.exports = {
        init: function () {
            initDays();
            surveyTable();
            loadMap();
        },
        _bindUI: function () {
            // 按钮 查看渠道分成总额
            self_.on('click', '.x-agent-sum-btn', function() {
                tableConfirm($(this).data('range'));
            });
        }
    };

    // 概况表
    function surveyTable() {
        var moment = require('moment');
        var date = $('#index_time').data("DateTimePicker").date();
        var date_str = moment(date._d).format("YYYY-MM-DD");
        var params = {
            source: 'rep_survey',
            qhstr: JSON.stringify({
                qjson: [{'days': date_str}],
                qjsonkeytype: [{days: "LIKE_ALL"}]
            }),
            qtype: 'select'
        };
        self_.find('.x-new, .x-active, .x-rate, .x-total, .x-data').text(0);
        $.get('/survey', params, function(result) {
            $.each(result.rows[0], function(k, v) {
                $('.survey_table_block').find('.'+k).text(v);
            });
            $.each($('.survey_table_block').find('.x-rate'), function(i, o) {
                var active =  $(o).parent().find('.x-active').text();
                var total =  $(o).parent().parent().find('.x-total').text();
                if (active && total && total!=='0') {
                    var rate = (parseFloat(active)/parseFloat(total)*100).toFixed(2);
                    $(o).text(rate+"%");
                }
            });
        }, 'json');
        $('span').tooltip();
    }

    // 全国统计地图
    function loadMap() {
        $('.x-all-map').css('height', $('.x-all-map').width()*0.5);
        $('#map_main').css('height', getHeight());
        $.get('../plugins/echarts/china.json', function (chinaJson) {
            echarts.registerMap('china', chinaJson);
            var chart = echarts.init(document.getElementById('map_main'));
            $.get('/mac_user_province',{}, function(result) {
                var list = result.success? result.list : [];
                var macData = [];
                var userData = [];
                $.each(list, function(i, o) {
                    var machash = {};
                    var userhash = {};
                    machash['name'] = o.province;
                    machash['value'] = parseInt(o.mac_total);
                    macData.push(machash);
                    userhash['name'] = o.province;
                    userhash['value'] = parseInt(o.user_total);
                    userData.push(userhash);
                });
                chart.setOption(getChinaMapChartOption(macData, userData));
            }, 'json');
        });
    }

    // 全国统计地图参数
    function getChinaMapChartOption(macData, userData) {
        var myseries = [{
            name: '用户数',
            type: 'map', //图标类型
            map: 'china', //图标地图数据
            aspectScale:1,    //地图宽高比
            roam: false,     //是否开启鼠标缩放和地图拖动。默认不开启。如果只想要开启缩放或者拖动，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
            layoutCenter:['50%','50%'],        //地图中心点位置['50%','50%']代表在最中间
            layoutSize: '130%',        //地图大小，此处设置为100%
            label: {
                normal: {
                    show: true    //是否显示默认名称
                },
                emphasis: {
                    show: true    //鼠标悬浮是否显示默认地理名称
                }
            },
            mapLocation: {
                x: 'left',
                width: getWidth(),
            },
            selectedMode: 'single',
            itemStyle: {
                normal: {label: {show: true}},
                emphasis: {
                    // areaColor:'rgba(66, 78, 222, 0)',
                    label: {
                        show: true,
                        color: 'green',
                        textStyle: {
                            fontWeight:'bold',
                            color: "green"
                        }
                    }
                }
            },
            data: userData
        }, {
            name: '终端数',
            type: 'map', //图标类型
            map: 'china', //图标地图数据
            aspectScale:1,    //地图宽高比
            roam: false,     //是否开启鼠标缩放和地图拖动。默认不开启。如果只想要开启缩放或者拖动，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
            layoutCenter:['50%','50%'],        //地图中心点位置['50%','50%']代表在最中间
            layoutSize: '130%',        //地图大小，此处设置为100%
            label: {
                normal: {
                    show: true    //是否显示默认名称
                },
                emphasis: {
                    show: true    //鼠标悬浮是否显示默认地理名称
                }
            },
            // mapLocation: {
            //     x: 'left',
            //     width: getWidth(),
            // },
            selectedMode: 'single',
            itemStyle: {
                normal: {label: {show: true}},
                emphasis: {
                    // areaColor:'rgba(66, 78, 222, 0)',
                    label: {
                        show: true,
                        color: 'blue',
                        textStyle: {
                            fontWeight:'bold',
                            color: "blue"
                        }
                    }
                }
            },
            data: macData
        }];
        return {
            title: {
                text: '',
            },
            tooltip: {
                trigger: 'item',
                formatter:function(params){
                    //定义一个res变量来保存最终返回的字符结果,并且先把地区名称放到里面
                    var res=params.name+'<br />';
                    //循环遍历series数据系列
                    for(var i=0;i<myseries.length;i++){
                        //在内部继续循环series[i],从data中判断：当地区名称等于params.name的时候就将当前数据和名称添加到res中供显示
                        for(var k=0;k<myseries[i].data.length;k++){
                            //console.log(myseries[i].data[k].name);
                            //如果data数据中的name和地区名称一样
                            if(myseries[i].data[k].name==params.name){
                                //将series数据系列每一项中的name和数据系列中当前地区的数据添加到res中
                                res+= isNaN(myseries[i].data[k].value) ? '': myseries[i].name+'：'+myseries[i].data[k].value+'<br />';
                            }
                        }
                    }
                    //返回res
                    //console.log(res);
                    return res;
                },
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                data: ['终端数', '用户数'] // 增加数据点，在这里添加，并添加对应series
            },
            dataRange: {
                min: 0,
                max: 100000,   //此处由于echarts的bug 默认的max最小值为100且为100的整数倍
                color: ['#bf444c', '#f5e9a3'],
                text: ['高', '低'], // 文本，默认为数值文本
                calculable: true
            },
            visualMap: {
                min: 0,
                max: 1000,
                text:['High','Low'],
                realtime: true,
                calculable: true,
                inRange: {
                    color: ['lightskyblue','yellow', 'orangered']
                },
                textStyle:{
                    color:'#fff'
                }
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
            series: myseries,
            animation: true
        };
    }

    // 地图高
    function getHeight() {
        return $('.x-all-map').height()*0.85;
    }

    // 地图宽
    function getWidth() {
        return $('.x-all-map').width()*0.8;
    }

    // 时间控件
    function initDays() {
        var date = new Date();//获取当前时间
        date.setDate(date.getDate()-1);//设置天数 -1 天
        $('#index_time').datetimepicker({
            format: 'YYYY年MM月DD日',
            locale: 'zh-cn',
            defaultDate: date,
            maxDate: date
        }).on('dp.change', function(e) {
            surveyTable();
        });
    }

    // 渠道分成列表
    function tableConfirm(range) {
        var moment = require('moment');
        var date = $('#index_time').data("DateTimePicker").date();
        var date_str = moment(date._d).format("YYYY-MM-DD");
        $.confirm({
            title: date_str+"|渠道分成数据|近"+ range +"日报表|",
            content: 'url:../app/agent_statistics_table_dialog.html',
            columnClass: 'col-md-8 col-md-offset-2',
            buttons: {
                cancel: {
                    text: '关闭',
                    btnClass: 'waves-effect waves-button'
                }
            },
            onOpen: function () {
                var self = this;
                setTimeout(function (days, range) {
                    initTable(self.$content, self.$content.find('#days_table'), days, range);
                    $('select').select2();
                    // 搜索监听回车
                    self.$content.on("keypress", 'input[name="searchTextDay"]', function(e) {
                        if (e.which === 13) {
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
                }, 500, date_str, range);
            }
        });
    }

    function initTable(me, object, days, range) {
        require('bootstrap-table');
        require('bootstrap-table-zh-CN');
        // 引入导出相关插件
        require('bootstrap-table-export');
        require('tableExport');

        object.bootstrapTable({
            url: "/days_agent_mac/anget_sum_statistics",
            queryParams: function(params) {
                var x_params = {};
                x_params.days = days;
                x_params.range = range;
                x_params.searchWhere = me.find('select[name="searchWhereDay"]').val();
                x_params.searchText = me.find('input[name="searchTextDay"]').val();
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
            idField: "account",
            sortName: "account",
            sortOrder: "asc",
            pageNumber:1,      //初始化加载第一页，默认第一页
            pageList: [10, 25, 50, 100],  //可供选择的每页的行数（*）
            columns: require('./agent_columns'),
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
            pagination: false,
            paginationLoop: false,
            classes: 'table table-hover table-no-bordered',
            sidePagination: 'server',
            silentSort: false,
            smartDisplay: false,
            escape: true,
            maintainSelected: true,
            showExport: true,        //是否显示导出
            exportDataType: "basic", // 导出模式 列表中：'basic', 全部：'all', 选中：'selected'.
            exportTypes: ['excel', 'doc', 'csv', 'txt'], //所有类型 'json', 'xml', 'png', 'csv', 'txt', 'sql', 'doc', 'excel', 'xlsx', 'pdf'.
            toolbar: self_.find('#day_toolbar')
        }).on('all.bs.table', function(e, name, args) {
            $('[data-toggle="tooltip"]').tooltip();
            $('[data-toggle="popover"]').popover();
        });
    }
});