/**
 * Created by IntelliJ IDEA.
 * User: xsiry
 * Date: 2017/10/30
 * Time: 14:53
 */
define(function (require, exports, module) {
    var $ = require('jquery');
    $.index_ = $(document);

    require('device');
    require('fullPage');
    require('jdirk');
    require.async('toastr');

    var accountModule = require('./module_account');

    var menuModule = require('./module_menu');
    menuModule.init($.index_);

    var myIndexModule = require('./module_myindex');

    var click = device.mobile() ? 'touchstart' : 'click';

    module.exports = {
        init: function () {
            // Waves初始化
            require('waves');
            Waves.displayEffect();
            // 滚动条初始化
            require('mCustomScrollbar');
            $('#sidebar').mCustomScrollbar({
                theme: 'minimal-dark',
                scrollInertia: 100,
                axis: 'yx',
                mouseWheel: {
                    enable: true,
                    axis: 'y',
                    preventDefault: true
                }
            });

            // 显示cookie菜单
            require('cookie');
            var systemid = $.cookie('admin-systemid') || 1;
            var systemname = $.cookie('admin-systemname') || 'admin-server';
            var systemtitle = $.cookie('admin-systemtitle') || '阿里体育Beyond电竞平台管理后台';
            $('.system_menus').hide(0, function () {
                $('.system_' + systemid).show();
            });
            $('body').attr('id', systemname);
            $('#system_title').text(systemtitle);
            this._welcomeMsg();
            this._setProfile();
            this._bindUI();
        },
        _bindUI: function () {
            // 设置input特效
            $(document).on('focus', 'input[type="text"]', function () {
                $(this).parent().find('label').addClass('active');
            }).on('blur', 'input[type="text"]', function () {
                if ($(this).val() == '') {
                    $(this).parent().find('label').removeClass('active');
                }
            });
            $(document).on('focus', 'input[type="password"]', function () {
                $(this).parent().find('label').addClass('active');
            }).on('blur', 'input[type="password"]', function () {
                if ($(this).val() == '') {
                    $(this).parent().find('label').removeClass('active');
                }
            });
            // 侧边栏操作按钮
            $.index_.on(click, '#guide', function () {
                $(this).toggleClass('toggled');
                $('#sidebar').toggleClass('toggled');
            });
            // 侧边栏二级菜单
            $.index_.on(click, '.sub-menu a', function () {
                $(this).next().slideToggle(200);
                $(this).parent().toggleClass('toggled');
            });
            // 个人资料
            $.index_.on(click, '.s-profile a', function () {
                if ($(this).find('.x-relogin').length === 1) {
                    location.href = 'login_.html';
                }else {
                    $(this).next().slideToggle(200);
                    $(this).parent().toggleClass('toggled');
                }
            });

            $(window).resize(function () {
                resizeFrameHeight();
                initScrollShow();
                initScrollState();
            });

            // 全屏
            $.index_.on(click, '.x-fullscreen', function () {
                fullPage();
            });

            // 个人资料
            $.index_.on(click, '.x-account', function () {
                accountModule._showAccount();
            });

            // 修改密码
            $.index_.on(click, '.x-epassword', function () {
                accountModule._editPassword();
            });

            // 退出登录
            $.index_.on(click, '.x-logout', function () {
                accountModule._logout();
            });

            // 系统设置
            $.index_.on(click, '.x-settings', function () {
                var settingsModule = require('./module_settings');
                settingsModule._upSettings();
            });

            $.index_.on(click, '.x-heading-btn', function () {
                myIndexModule._repMonthGrid();
            });

            $.index_.on(click, '.x-withdrawal', function () {
                myIndexModule._repMonthGrid();
            });

            $.index_.on(click, '.x-withdrawal-record', function () {
                $('.x-menu[data-title="提现记录"]').trigger('click');
            });

            // 菜单点击
            $.index_.on(click, '.x-menu', function () {
                var title = $(this).data('title');
                var url = $(this).data('url');
                if (title && url && url !=='#') addTab(title, url);
            });

            $.index_.on(click, '.x-dropbox-tooltip', function() {
                $.confirm({
                    type: 'red',
                    theme: 'black',
                    animationSpeed: 300,
                    title: false,
                    autoClose: 'cancel|10000',
                    content: '确认打包吗？',
                    buttons: {
                        confirm: {
                            text: '确认',
                            btnClass: 'waves-effect waves-button',
                            action: function() {
                                $.post('/open/release/zip', {}, function(result) {
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
            });


            $.index_.on(click, '.x-download-tooltip', function() {
                $.confirm({
                    type: 'red',
                    theme: 'black',
                    animationSpeed: 300,
                    title: false,
                    autoClose: 'cancel|10000',
                    content: '确认下载推广包吗？',
                    buttons: {
                        confirm: {
                            text: '确认',
                            btnClass: 'waves-effect waves-button',
                            action: function() {
                                var msg;
                                toastr.options = {
                                    closeButton: false,
                                    progressBar: true,
                                    showMethod: 'slideDown',
                                    timeOut: 0
                                };
                                msg = "正在生成专属推广包，请稍等...";
                                toastr.info(msg);
                                $.post('/open/release/agent/zip', {}, function(result) {
                                    toastr.clear();
                                    toastr.options = {
                                        closeButton: true,
                                        progressBar: true,
                                        showMethod: 'slideDown',
                                        timeOut: 4000
                                    };
                                    if (result.success) {
                                        msg = "推广包生成成功，开始下载";
                                        toastr.success(msg);
                                        downloadFile(window.location.protocol+"//"+window.location.host + "/" + result.msg)
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
            });

            // 选项卡点击
            $.index_.on(click, '.content_tab li', function () {
                // 切换选项卡
                $('.content_tab li').removeClass('cur');
                $(this).addClass('cur');
                // 切换iframe
                $('.iframe').removeClass('cur');
                $('#iframe_' + $(this).data('index')).addClass('cur');
                var marginLeft = ($('#tabs').css('marginLeft').replace('px', ''));
                // 滚动到可视区域:在左侧
                if ($(this).position().left < marginLeft) {
                    var left = $('.content_tab>ul').scrollLeft() + $(this).position().left - marginLeft;
                    $('.content_tab>ul').animate({scrollLeft: left}, 200, function () {
                        initScrollState();
                    });
                }
                // 滚动到可视区域:在右侧
                if (($(this).position().left + $(this).width() - marginLeft) > document.getElementById('tabs').clientWidth) {
                    var left = $('.content_tab>ul').scrollLeft() + (($(this).position().left + $(this).width() - marginLeft) - document.getElementById('tabs').clientWidth);
                    $('.content_tab>ul').animate({scrollLeft: left}, 200, function () {
                        initScrollState();
                    });
                }
            });
            // 控制选项卡滚动位置
            $.index_.on(click, '.tab_left>a', function () {
                $('.content_tab>ul').animate({scrollLeft: $('.content_tab>ul').scrollLeft() - 300}, 200, function () {
                    initScrollState();
                });
            });
            // 向右箭头
            $.index_.on(click, '.tab_right>a', function () {
                $('.content_tab>ul').animate({scrollLeft: $('.content_tab>ul').scrollLeft() + 300}, 200, function () {
                    initScrollState();
                });
            });
            // 初始化箭头状态
        },
        _welcomeMsg: function () {
            setTimeout(function () {
                // toastr.options = {
                //     positionClass: "toast-top-center",
                //     closeButton: true,
                //     progressBar: true,
                //     showMethod: 'slideDown',
                //     timeOut: 2000
                // };
                // toastr.success('当前时间：' + getNowTime(), '欢迎进入，阿里体育竞技后台');
            }, 500);
        },
        _setProfile: function () {
            $('.x-dropbox-tooltip').tooltip();
            $.get('/user/info', {}, function (result) {
                $('.s-profile .sp-info span').text(result.rolename+' '+result.relname + '，你好！');
                $('.s-profile .sp-info span').append('<input type="hidden" class="x-rolename-hidden" value="'+ result.rolename +'"/>');
                if (result.rolename === "超级管理员") {
                    $('#x-index').text("欢迎登陆-阿里体育Beyond电竞平台管理后台");
                    var dropbox = '<li class="dropdown">'
                    + '<a class="waves-effect waves-light x-dropbox-tooltip" data-toggle="tooltip" href="javascript:;" data-placement="left" title="配置打包">'
                    + '<i class="him-icon zmdi zmdi-dropbox"></i></a></li>'
                    $('.x-avtools').prepend(dropbox);
                    var sysset = '<li><a class="waves-effect x-settings" href="javascript:;"><i class="zmdi zmdi-settings"></i> 系统设置</a></li>';
                    $('.x-systools').find('li').eq(0).after(sysset);
                }else if (result.rolename === "阿里体育推广员") {
                    myIndexModule._loadMyIndex();
                    $('#iframe_home #x-index .user_code').text(result.agent_id);
                    $('#iframe_home #x-index .user_code').append("<input type='hidden' class='x-user-id' value='"+ result.user_id +"'/>");
                    var dropbox = '<li class="dropdown">'
                        + '<a class="waves-effect waves-light x-download-tooltip" data-toggle="tooltip" href="javascript:;" data-placement="left" title="推广包下载">'
                        + '<i class="him-icon zmdi zmdi-download"></i></a></li>'
                    $('.x-avtools').prepend(dropbox);
                }else if(result.rolename === "渠道部" || result.rolename === "财务部") {
                    $('#x-index').text("欢迎登陆-阿里体育Beyond电竞菜单管理后台");
                }
                $('#x-index').show();
            }, 'json');
        }
    };

    /*
     * 生成菜单
     */
    function resizeFrameHeight() {
        $('.tab_iframe').css('height', document.documentElement.clientHeight - 118);
        $('md-tab-content').css('left', '0');
    }

    function initScrollShow() {
        if (document.getElementById('tabs').scrollWidth > document.getElementById('tabs').clientWidth) {
            $('.content_tab').addClass('scroll');
        } else {
            $('.content_tab').removeClass('scroll');
        }
    }

    function initScrollState() {
        if ($('.content_tab>ul').scrollLeft() == 0) {
            $('.tab_left>a').removeClass('active');
        } else {
            $('.tab_left>a').addClass('active');
        }
        if (($('.content_tab>ul').scrollLeft() + document.getElementById('tabs').clientWidth) >= document.getElementById('tabs').scrollWidth) {
            $('.tab_right>a').removeClass('active');
        } else {
            $('.tab_right>a').addClass('active');
        }
    }

    function fullPage() {
        if ($.util.supportsFullScreen) {
            if ($.util.isFullScreen()) {
                $.util.cancelFullScreen();
            } else {
                $.util.requestFullScreen();
            }
        } else {
            alert("当前浏览器不支持全屏 API，请更换至最新的 Chrome/Firefox/Safari 浏览器或通过 F11 快捷键进行操作。");
        }
    }

    function addTab(title, url) {
        console.log("Open Tab:=" + url);
        var x_content_height = document.documentElement.clientHeight - 118;
        var index = url.replace(/\./g, '_').replace(/\//g, '_').replace(/:/g, '_').replace(/\?/g, '_').replace(/,/g, '_').replace(/=/g, '_').replace(/&/g, '_');
        // 如果存在选项卡，则激活，否则创建新选项卡
        if ($('#tab_' + index).length == 0) {
            // 添加选项卡
            $('.content_tab li').removeClass('cur');
            var tab = '<li id="tab_' + index + '" data-index="' + index + '" class="cur"><a class="waves-effect waves-light">' + title + '</a></li>'; //<i class="zmdi zmdi-close"></i><
            $('.content_tab>ul').append(tab);
            // 添加iframe
            $('.iframe').removeClass('cur');
            var iframe = '<div id="iframe_' + index + '" class="iframe cur"><div data-url="' + url + '" class="tab_iframe x-content" style="height:' + x_content_height + 'px;"></div></div>';
            $('.content_main').append(iframe);
            loadURL(url, index);
            initScrollShow();
            $('.content_tab>ul').animate({scrollLeft: document.getElementById('tabs').scrollWidth - document.getElementById('tabs').clientWidth}, 200, function () {
                initScrollState();
            });
        } else {
            $('#tab_' + index).trigger('click');
        }
        // 关闭侧边栏
        $('#guide').trigger('click');
    }

    function closeTab($item) {
        var closeable = $item.data('closeable');
        if (closeable != false) {
            // 如果当前时激活状态则关闭后激活左边选项卡
            if ($item.hasClass('cur')) {
                $item.prev().trigger('click');
            }
            // 关闭当前选项卡
            var index = $item.data('index');
            $('#iframe_' + index).remove();
            $item.remove();
        }
        initScrollShow();
    }

    // 选项卡右键菜单
    require('BootstrapMenu');
    var menu = new BootstrapMenu('.tabs li', {
        fetchElementData: function (item) {
            return item;
        },
        actionsGroups: [
            ['close', 'refresh'],
            ['closeOther', 'closeAll'],
            ['closeRight', 'closeLeft']
        ],
        actions: {
            close: {
                name: '关闭',
                iconClass: 'zmdi zmdi-close',
                onClick: function (item) {
                    closeTab($(item));
                }
            },
            closeOther: {
                name: '关闭其他',
                iconClass: 'zmdi zmdi-arrow-split',
                onClick: function (item) {
                    var index = $(item).data('index');
                    $('.content_tab li').each(function () {
                        if ($(this).data('index') != index) {
                            Tab.closeTab($(this));
                        }
                    });
                }
            },
            closeAll: {
                name: '关闭全部',
                iconClass: 'zmdi zmdi-swap',
                onClick: function () {
                    $('.content_tab li').each(function () {
                        closeTab($(this));
                    });
                }
            },
            closeRight: {
                name: '关闭右侧所有',
                iconClass: 'zmdi zmdi-arrow-right',
                onClick: function (item) {
                    var index = $(item).data('index');
                    $($('.content_tab li').toArray().reverse()).each(function () {
                        if ($(this).data('index') != index) {
                            closeTab($(this));
                        } else {
                            return false;
                        }
                    });
                }
            },
            closeLeft: {
                name: '关闭左侧所有',
                iconClass: 'zmdi zmdi-arrow-left',
                onClick: function (item) {
                    var index = $(item).data('index');
                    $('.content_tab li').each(function () {
                        if ($(this).data('index') != index) {
                            closeTab($(this));
                        } else {
                            return false;
                        }
                    });
                }
            },
            refresh: {
                name: '刷新',
                iconClass: 'zmdi zmdi-refresh',
                onClick: function (item) {
                    var index = $(item).data('index');
                    var $iframe = $('#iframe_' + index).find('.x-content');
                    loadURL($iframe.data('url'), index);
                }
            }
        }
    })


    function loadURL(url, index) {
        var b = $('#iframe_' + index + ' .x-content');
        // return
        $.ajax({
            "type": "GET",
            "url": url,
            "dataType": "html",
            "cache": !0,
            "beforeSend": function () {
                b.removeData().html(""),
                    b.html('<div class="dropload-load"><div class="sk-folding-cube"><div class="sk-cube1 sk-cube"></div><div class="sk-cube2 sk-cube"></div><div class="sk-cube4 sk-cube"></div><div class="sk-cube3 sk-cube"></div></div></div>'),
                b[0] == $("#content")[0] && ($("body").find("> *").filter(":not(" + ignore_key_elms + ")").empty().remove(),
                    drawBreadCrumb(),
                    $("html").animate({
                        "scrollTop": 0
                    }, "fast"))
            },
            "success": function (url) {
                b.css({
                    "opacity": "0.0"
                }).html(url).delay(50).animate({
                    "opacity": "1.0"
                }, 300),
                    url = null,
                    b = null
            },
            "error": function (c, d, e) {
                b.html('<h4 class="ajax-loading-error"><i class="fa fa-warning txt-color-orangeDark"></i> Error requesting <span class="txt-color-red">' + url + "</span>: " + c.status + ' <span style="text-transform: capitalize;">' + e + "</span></h4>")
            },
            "async": !0
        })
    }

    /**
     * 获取当前时间
     */
    function getNowTime() {

        function p(s) {
            return s < 10 ? '0' + s : s;
        }

        var myDate = new Date();
        //获取当前年
        var year = myDate.getFullYear();
        //获取当前月
        var month = myDate.getMonth() + 1;
        //获取当前日
        var date = myDate.getDate();
        var h = myDate.getHours(); //获取当前小时数(0-23)
        var m = myDate.getMinutes(); //获取当前分钟数(0-59)
        var s = myDate.getSeconds();

        var now = [year, p(month), p(date)].join('-') + " " + [p(h), p(m), p(s)].join(':');
        return now;
    }

    /*
     * 文件下载
     */
    function downloadFile(url){
        console.log(url)
        var form=$("<form>");//定义form表单,通过表单发送请求
        form.attr("style","display:none");//设置为不显示
        form.attr("target","");
        form.attr("method","get");//设置请求类型
        form.attr("action",url);//设置请求路径
        $("body").append(form);//添加表单到页面(body)中
        form.submit();//表单提交
    }
});