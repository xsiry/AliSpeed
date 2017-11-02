/**
 * Created by IntelliJ IDEA.
 * User: xsiry
 * Date: 2017/10/30
 * Time: 15:42
 */

define(function(require, exports, module) {
    let $ = require('jquery');
    require('bootstrap');
    require('jquery-confirm');

    let crud_ = $('.crud_main');
    let $table = $('#table');

    module.exports = {
        init: function() {
            // select2初始化
            // require('select2');
            // $('select').select2();

            this._loadMain();
            this._bindUI();
        },
        _bindUI: function() {
            // 添加
            crud_.on('click', '.create_act', function() {
                createAction();
            })

            // 修改
            crud_.on('click', '.update_act', function() {
                updateAction();
            })

            // 删除
            crud_.on('click', '.delete_act', function() {
                deleteAction();
            })

            // 数据表格动态高度
            $(window).resize(function() {
                $('#table').bootstrapTable('resetView', {
                    height: getHeight()
                })
            })
        },
        _loadMain() {
            bsTable();
        }
    };

    // bootstrap table初始化
    // http://bootstrap-table.wenzhixin.net.cn/zh-cn/documentation/
    function bsTable() {
        require('bootstrap-table');
        require('bootstrap-table-zh-CN');
        $table.bootstrapTable({
            url: './app/crud/data1.json',
            height: getHeight(),
            striped: true,
            search: true,
            searchOnEnterKey: true,
            showRefresh: true,
            showToggle: true,
            showColumns: true,
            minimumCountColumns: 2,
            showPaginationSwitch: true,
            clickToSelect: true,
            detailView: true,
            detailFormatter: 'detailFormatter',
            pagination: true,
            paginationLoop: false,
            classes: 'table table-hover table-no-bordered',
            //sidePagination: 'server',
            //silentSort: false,
            smartDisplay: false,
            idField: 'id',
            sortName: 'id',
            sortOrder: 'asc',
            escape: true,
            searchOnEnterKey: true,
            idField: 'systemId',
            maintainSelected: true,
            toolbar: '#toolbar',
            columns: require('./columns')
        }).on('all.bs.table', function(e, name, args) {
            $('[data-toggle="tooltip"]').tooltip();
            $('[data-toggle="popover"]').popover();
        });
    }

    // 动态高度
    function getHeight() {
        return $('.x-content').height() - 3;
    }
    // 数据表格展开内容
    function detailFormatter(index, row) {
        let html = [];
        $.each(row, function(key, value) {
            html.push('<p><b>' + key + ':</b> ' + value + '</p>');
        });
        return html.join('');
    }
    // 初始化input特效
    function initMaterialInput() {
        $('form input[type="text"]').each(function() {
            if ($(this).val() != '') {
                $(this).parent().find('label').addClass('active');
            }
        });
    }

    window.actionEvents = {
        'click .like': function(e, value, row, index) {
            alert('You click like icon, row: ' + JSON.stringify(row));
            console.log(value, row, index);
        },
        'click .edit': function(e, value, row, index) {
            alert('You click edit icon, row: ' + JSON.stringify(row));
            console.log(value, row, index);
        },
        'click .remove': function(e, value, row, index) {
            alert('You click remove icon, row: ' + JSON.stringify(row));
            console.log(value, row, index);
        }
    };

    function detailFormatter(index, row) {
        let html = [];
        $.each(row, function(key, value) {
            html.push('<p><b>' + key + ':</b> ' + value + '</p>');
        });
        return html.join('');
    }
    // 新增
    function createAction() {
        $.confirm({
            type: 'dark',
            animationSpeed: 300,
            title: '新增系统',
            content: 'url:../app/crud_dialog.html',
            buttons: {
                confirm: {
                    text: '确认',
                    btnClass: 'waves-effect waves-button',
                    action: function() {
                        $.alert('确认');
                    }
                },
                cancel: {
                    text: '取消',
                    btnClass: 'waves-effect waves-button'
                }
            }
        });
    }
    // 编辑
    function updateAction() {
        let rows = $table.bootstrapTable('getSelections');
        if (rows.length == 0) {
            $.confirm({
                title: false,
                content: '请至少选择一条记录！',
                autoClose: 'cancel|3000',
                backgroundDismiss: true,
                buttons: {
                    cancel: {
                        text: '取消',
                        btnClass: 'waves-effect waves-button'
                    }
                }
            });
        } else {
            $.confirm({
                type: 'blue',
                animationSpeed: 300,
                title: '编辑系统',
                content: 'URL:../app/crud_dialog.html',
                buttons: {
                    confirm: {
                        text: '确认',
                        btnClass: 'waves-effect waves-button',
                        action: function() {
                            $.alert('确认');
                        }
                    },
                    cancel: {
                        text: '取消',
                        btnClass: 'waves-effect waves-button'
                    }
                }
            });
        }
    }
    // 删除
    function deleteAction() {
        let rows = $table.bootstrapTable('getSelections');
        if (rows.length == 0) {
            $.confirm({
                title: false,
                content: '请至少选择一条记录！',
                autoClose: 'cancel|3000',
                backgroundDismiss: true,
                buttons: {
                    cancel: {
                        text: '取消',
                        btnClass: 'waves-effect waves-button'
                    }
                }
            });
        } else {
            $.confirm({
                type: 'red',
                animationSpeed: 300,
                title: false,
                content: '确认删除该系统吗？',
                buttons: {
                    confirm: {
                        text: '确认',
                        btnClass: 'waves-effect waves-button',
                        action: function() {
                            let ids = new Array();
                            for (let i in rows) {
                                ids.push(rows[i].systemId);
                            }
                            $.alert('删除：id=' + ids.join("-"));
                        }
                    },
                    cancel: {
                        text: '取消',
                        btnClass: 'waves-effect waves-button'
                    }
                }
            });
        }
    }
})