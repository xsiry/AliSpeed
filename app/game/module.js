/**
 * Created by IntelliJ IDEA.
 * User: xsiry
 * Date: 2017/11/08
 * Time: 12:14
 */

define(function(require, exports, module) {
    let $ = require('jquery');
    require('bootstrap');
    require('jquery-confirm');

    require('select2');
    // require('select2_zh_CN');
    require('webuploader');

    let self_ = $('.game');
    let $table = self_.find('#table');

    let url = '/game',
        table = 't_game',
        source_id = 'gameid',
        row_name = 'gamename',
        sort_name = 'gamename',
        sort_order = 'asc',
        validationInput = {
            gamename: {
                validators: {
                    notEmpty: {
                        message: '该项不能为空'
                    }
                }
            },
            url: {
                validators: {
                    notEmpty: {
                        message: '该项不能为空'
                    }
                }
            },
            parentid: {
                validators: {
                    notEmpty: {
                        message: '该项不能为空'
                    }
                }
            }
        };

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
            // 添加数据
            self_.on('click', '.create_act', function() {
                createAsUpdateAction();
            });
            // 上架状态查询
            self_.on('select2:select', 'select[name="status"]', function() {
                f_search();
            });
            // 数据表格动态高度
            $(window).resize(function() {
                self_.find('#table').bootstrapTable('resetView', {
                    height: getHeight()
                })
            });
        },
        _loadMain: function() {
            bsTable();
            $('select').select2();
        }
    };

    // 创建或修改
    function createAsUpdateAction(row) {
        $.confirm({
            type: 'blue',
            animationSpeed: 300,
            title: row? ('修改 ' + row[row_name]) : '新增',
            content: 'URL:../app/'+ url +'_dialog.html',
            buttons: {
                confirm: {
                    text: '确认',
                    btnClass: 'waves-effect btn-primary',
                    action: function () {
                        let self = this;
                        self.$content.find('form').submit();
                        return false;
                    }
                },
                cancel: {
                    text: '取消',
                    btnClass: 'waves-effect waves-button'
                }
            },
            onOpen: function () {
                let self = this;
                setTimeout(function () {
                    // 上传插件初始化
                    uploadFile([]);

                    // 添加游戏类型单选事件
                    self.$content.on('click', 'input[name="category"]', function() {
                        if ($(this).val() === "1") {
                            self.$content.find('.x-t-ico').hide();
                            self.$content.find('.x-t-btn').show();
                        } else {
                            self.$content.find('.x-t-btn').hide();
                            self.$content.find('.x-t-ico').show();
                        }
                    });

                    // 添加按钮类型单选事件
                    self.$content.on('click', 'input[name="showtype"]', function() {
                        if ($(this).val() === "1") {
                            self.$content.find('.x-t-pngbtn').show();
                        } else {
                            self.$content.find('.x-t-pngbtn').hide();
                        }
                    });

                    $.each(row, function (key, val) {
                        if (key === 'category'||key === 'showtype'||key === 'runtype') {
                            self.$content.find('input[name="' + key + '"][value="'+ val +'"]').trigger('click');
                        }else{
                            self.$content.find('label[for="' + key + '"]').addClass('active');
                            self.$content.find('input[name="' + key + '"]').val(val)
                        }
                        if (key === 'pngname') {
                            uploadFile(val.split(';'));
                            $('#x-picker').focus();
                        }
                    });

                    self.$content.find('form').formValidation(formFvConfig()).on('success.form.fv', function (e) {
                        $(self.$$confirm[0]).prop("disabled", true);
                        // Prevent form submission
                        e.preventDefault();

                        // Get the form instance
                        let $form = $(e.target);

                        let params = {};

                        $.each($form.serializeArray(), function (i, o) {
                            params[o.name] = o.value;
                        });

                        if (params['category'] === "0") {
                            delete params['showtype'];
                        } else {
                            delete params['runtype'];
                            delete params['namedes'];
                            delete params['offstarterpath'];
                        }

                        if ((params['category'] === "0" || params['showtype'] === "1") && self.$content.find('.x-upload-num').length !== 0 && !params['pngname']) {
                            $.alert({
                                title: '提示',
                                content: '请先选择或上传图片!',
                                confirm: {
                                    text: '确认',
                                    btnClass: 'waves-effect btn-primary'
                                }
                            });
                            $(self.$$confirm[0]).prop("disabled", false);
                            return;
                        }

                        if (params['category'] === "1" && params['showtype'] === "0") {
                            params['pngname'] = 'NULL';
                        }

                        $.post(url , params, function (result) {
                            let msg;
                            toastr.options = {
                                closeButton: true,
                                progressBar: true,
                                showMethod: 'slideDown',
                                timeOut: 4000
                            };
                            if (result.success) {
                                msg = result.msg;
                                toastr.success(msg);
                                self.close();
                                $table.bootstrapTable('refresh', {});
                            } else {
                                msg = result.msg;
                                toastr.error(msg);
                                $(self.$$confirm[0]).prop("disabled", false);
                            }
                        }, 'json');
                    });
                }, 500);
            }
        });
    }

    function initSelect() {
        $.getJSON(url + '/leveSelect', {}, function(json) {
            $('#game_menu').empty().append("<option></option>");
            $("select#game_menu").select2({
                language: 'zh-CN',
                placeholder: '请选择上架菜单',
                data : json
            });
        });
    }

    // 上传初始化
    function uploadFile(urls) {
        let option = {
            url: '/file/upload/game',
            field: 'pngname',
            upload_main: '#x-uploader',
            list_block: '#x-fileList',
            upload_btn: '#x-upload',
            pick_btn: '#x-picker'
        };
        let upload = require('upload');
        if (urls.length > 0){
            upload._addFilePreview(urls);
        } else {
            upload.init(option)
        }

    }

    // 删除
    function deleteAction(row) {
        $.confirm({
            type: 'red',
            animationSpeed: 300,
            title: false,
            autoClose: 'cancel|10000',
            content: '确认删除' + row[row_name] + '吗？',
            buttons: {
                confirm: {
                    text: '确认',
                    btnClass: 'waves-effect waves-button',
                    action: function() {
                        $.post(url + '/del', { tid: row[source_id], tname: table }, function(result) {
                            let msg;
                            toastr.options = {
                                closeButton: true,
                                progressBar: true,
                                showMethod: 'slideDown',
                                timeOut: 4000
                            };
                            if (result.success) {
                                msg = result.msg;
                                toastr.success(msg);
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
            }
        });
    }

    // fv表单控件参数
    function formFvConfig() {
        return {
            autoFocus: true,
            locale: 'zh_CN',
            message: '该值无效，请重新输入',
            err: {
                container: 'tooltip'
            },
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: validationInput
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
                let x_params = {};
                x_params.source = table;
                x_params.page = params.offset;
                x_params.pagesize = params.limit;
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
        let qjson = {};
        let qjsonkeytype = {};

        qjson[self_.find('select[name="searchWhere"]').val()] = self_.find('input[name="searchText"]').val();
        qjsonkeytype[self_.find('select[name="searchWhere"]').val()] = "LIKE_ALL";

        let status = self_.find('select[name="status"]').val();

        let gridparms = {
            source: table,
            qhstr: JSON.stringify({
                qjson: [qjson, {'status': status}],
                qjsonkeytype: [qjsonkeytype]
            })
        };
        $table.bootstrapTable('refresh', {query: gridparms});
    }
    // bs表格按钮事件
    window.actionEvents = {
        'click .edit': function(e, value, row, index) {
            createAsUpdateAction(row)
        },
        'click .remove': function(e, value, row, index) {
            deleteAction(row);
        },
        'click .apply': function(e, value, row, index) {
            updateStatus(row);
        }
    };

    window.pngnameEvents = {
        'mouseover .x-pre-img-btn': function(e, value, row, index) {
            $(this).parent().find('.x-pre-img').show();
            if (index < 5) $(this).parent().find('.x-pre-img').css({bottom:'-145px', top: '0'});
        },
        'mouseout .x-pre-img-btn': function(e, value, row, index) {
            $(this).parent().find('.x-pre-img').hide();
        }
    };

    function updateStatus(row) {
        let select = '<div style="margin-bottom: 15px;"><select id="game_menu" name="game_menu_id" style="width: 250px;"></select></div>';

        $.confirm({
            type: row.status === "0"? 'green': 'red',
            animationSpeed: 300,
            title: "是否确认"+ (row.status === "0"? '上架': '下架'),
            // autoClose: 'cancel|10000',
            content: ((row.category=== "0"&&row.status === "0")? select : ""),
            buttons: {
                confirm: {
                    text: '确认',
                    btnClass: 'waves-effect waves-button',
                    action: function() {
                        let self = this;
                        let params = {
                            gameid: row.gameid,
                            status: row.status === "0"?"1":"0"
                        };

                        if (row.category === "0") {
                            let gmid = self.$content.find('select[name="game_menu_id"]').val();
                            if (gmid) {
                                params['game_menu_id'] = gmid
                            } else {
                                if (row.status === "0") {
                                    $.alert({
                                        title: '提示',
                                        content: '请先选择上架的菜单!',
                                        confirm: {
                                            text: '确认',
                                            btnClass: 'waves-effect btn-primary'
                                        }
                                    });
                                    return false;
                                }
                            }
                        }

                        if (row.status === "1") params['game_menu_id'] = 0;

                        $.post(url, params, function(result) {
                            let msg;
                            toastr.options = {
                                closeButton: true,
                                progressBar: true,
                                showMethod: 'slideDown',
                                timeOut: 4000
                            };
                            if (result.success) {
                                msg = result.msg;
                                toastr.success(msg);
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
                initSelect();
            }
        });
    }

    // 动态高度
    function getHeight() {
        return $('.x-content').height() - 3;
    }
});