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

    var self_ = $('.agent_statistics');
    var $table = self_.find('#table');

    var url = '/month_agent_mac/anget_statistics',
        table = 'rep_agent_mac_month',
        source_id = 'months',
        sort_name = 'months',
        sort_order = 'asc';

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
            // 查看用户详情
            self_.on('click', '.x-anget-account-detail', function() {
                var account = $(this).data('value');
                accountDetail(account);
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
        $('#agent_month_time').datetimepicker({
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

    // bootstrap table初始化
    // http://bootstrap-table.wenzhixin.net.cn/zh-cn/documentation/
    function bsTable() {
        require('bootstrap-table');
        require('bootstrap-table-zh-CN');
        $table.bootstrapTable({
            url: url,
            queryParams: function(params) {
                var qjson = {};
                var date = $('#agent_month_time').data("DateTimePicker").date();
                qjson['months'] = formatDate(date._d.getFullYear(),(date._d.getMonth()+1));
                var queryrt = [];
                if (self_.find('select[name="searchWhere"]').val() === "account") {
                    queryrt = [{
                        reltb: 'sys_user',
                        reltbfield: 'account',
                        maintbfield: 'agent_id',
                        reltbfieldvalue: self_.find('input[name="searchText"]').val(),
                        qtype: 'LIKE_ALL'
                    }]
                } else {
                    qjson[self_.find('select[name="searchWhere"]').val()] = self_.find('input[name="searchText"]').val();
                }

                var qjsonkeytype = {};
                qjsonkeytype['months'] = "LIKE_ALL";
                qjsonkeytype[self_.find('select[name="searchWhere"]').val()] = "LIKE_ALL";

                var x_params = {};
                x_params.source = table;
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

    function accountDetail(account) {
        $.confirm({
            title: "账号 " + account + " 个人资料",
            closeIcon: true,
            content: 'url:../app/anget_account_detail_dialog.html',
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
                    $.get('/user/info_bank', {account: account}, function (result) {
                        self_.$content.find('.x-agent-account-detail').empty();
                        var nameKey = {
                            account: "账号",
                            qq: "QQ号",
                            mobile: "手机号",
                            email: "邮箱地址",
                            rece_name: "收款人",
                            bank: "开户行",
                            bank_branch: "开户支行",
                            bank_address: "支行地址",
                            bank_account: "银行账号",
                            company: "公司名称"};
                        $.each(result.user, function(k, v) {
                            var row = $('<tr><td>'+nameKey[k]+'</td><td>'+v+'</td></tr>');
                            if (nameKey[k]) self_.$content.find('.x-agent-account-detail').append(row);
                        });
                        $.each(result.bank, function(k, v) {
                            var row = $('<tr><td>'+nameKey[k]+'</td><td>'+v+'</td></tr>');
                            if (nameKey[k]) self_.$content.find('.x-agent-account-detail').append(row);
                        });
                    }, 'json')
                }, 500, self, account);
            }
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