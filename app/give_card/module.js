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
    require('bootstrap-touchspin');

    var self_ = $('.give_card');
    var $table = self_.find('#table');

    var url = '/give_card',
        table = 't_card',
        source_id = 'card_id',
        sort_name = 'created_at',
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
            // 类型查询
            self_.on('select2:select', 'select[name="card_type"]', function() {
                f_search();
            });
            // 卡生成
            self_.on('click', '.x-generate-btn', function() {
                generateCard();
            });
            // 导出
            self_.on('click', '.x-export-btn', function() {
                window.open("/give_card/export?where="+self_.find('select[name="searchWhere"]').val()+"&text="+self_.find('input[name="searchText"]').val()+"&product_id="+self_.find('select[name="card_type"]').val());
            });
            // 数据表格动态高度
            $(window).resize(function() {
                self_.find('#table').bootstrapTable('resetView', {
                    height: getHeight()
                })
            });
        },
        _loadMain: function() {
            initInfo();
            bsTable();
            $('select[name="searchWhere"]').select2({});
            initSelect2('card_type', true);
        }
    };

    function initInfo() {
        $.get('/give_card/q_info', {}, function(result) {
            self_.find('.x-card-total').text(result.total);
            self_.find('.x-card-act').text(result.act);
            self_.find('.x-card-noact').text(result.noact);
        }, 'json')
    }

    function initSelect2(name, isall) {
        var params = {
            source: 't_product',
            qtype: 'select'
        };
        $.getJSON('/product', params, function(json) {
            var arr = [];
            for (var i = 0; i < json.rows.length; i ++) {
                var data = {};
                data.id = json.rows[i].product_id;
                data.text = json.rows[i].product;
                arr.push(data);
            }
            $('select[name="'+name+'"]').empty().append(isall? "<option>全部</option>": "");
            $('select[name="'+name+'"]').select2({
                language: 'zh-CN',
                placeholder: '请选择所属厂商',
                data : arr
            });
        });

    }

    function initTouchspin() {
        $("input[name='count']").TouchSpin({
            prefix: "生成数量",
            min: 0,
            max: 1000000000,
            step: 1,
            decimals: 0,
            boostat: 5,
            maxboostedstep: 100,
            postfix: '张'
        });
    }


    function generateCard() {
        var select = '<div style="margin:0 15px;">'+
            '<div class="form-group">' +
            '<input type="text" name="count" value="0" class="form-control" style="padding-left: 10px;">' +
            '</div>' +
            '<select name="g_card_type" style="width: 250px;"></select>'+
            '</div>';

        $.confirm({
            type: 'green',
            animationSpeed: 300,
            title: "赠送卡生成窗口",
            autoClose: 'cancel|30000',
            content: select,
            buttons: {
                confirm: {
                    text: '确认',
                    btnClass: 'waves-effect waves-button',
                    action: function() {
                        var self = this;

                        var count = self.$content.find('input[name="count"]').val();
                        if (!count) {
                            $.alert({
                                title: '提示',
                                content: '生成数目不能为空!',
                                confirm: {
                                    text: '确认',
                                    btnClass: 'waves-effect btn-primary'
                                }
                            });
                            return false;
                        }

                        var params = {
                            count: count,
                            product_id: self.$content.find('select[name="g_card_type"]').val(),
                            ispwd: false
                        };

                        $.post(url+'/generate', params, function(result) {
                            var msg;
                            toastr.options = {
                                closeButton: true,
                                progressBar: true,
                                showMethod: 'slideDown',
                                timeOut: 4000
                            };
                            if (result.success) {
                                msg = result.msg;
                                toastr.success(msg);
                                initInfo();
                                $table.bootstrapTable('refresh', {});
                            } else {
                                msg = result.msg;
                                toastr.error(msg);
                            }
                        }, 'json');
                    }
                },
                cancel: {
                    text: '取消',
                    btnClass: 'waves-effect waves-button'
                }
            },
            onOpen: function () {
                // select2初始化
                initSelect2('g_card_type', false);
                initTouchspin();
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
                var qjsonarry = [];
                var qjson = {};
                qjson[self_.find('select[name="searchWhere"]').val()] = self_.find('input[name="searchText"]').val();
                qjsonarry.push(qjson);
                var qjsonkeytype = {};
                qjsonkeytype[self_.find('select[name="searchWhere"]').val()] = "LIKE_ALL";

                var product = self_.find('select[name="card_type"]').val();
                if (product !== "全部") qjsonarry.push({product_id: product})
                var x_params = {};
                x_params.source = table;
                x_params.qhstr = JSON.stringify({
                    qjson: qjsonarry,
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