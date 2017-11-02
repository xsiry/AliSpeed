/**
 * Created by IntelliJ IDEA.
 * User: xsiry
 * Date: 2017/10/30
 * Time: 14:53
 */
define(function(require, exports, module) {
    var $ = require('jquery');
    $.index_ = $(document);

    require('device');
    var click = device.mobile() ? 'touchstart' : 'click';

    module.exports = {
        init: function() {
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
            var systemtitle = $.cookie('admin-systemtitle') || 'Admin系统';
            $('.system_menus').hide(0, function() {
                $('.system_' + systemid).show();
            });
            $('body').attr('id', systemname);
            $('#system_title').text(systemtitle);
            this._menusAjax(this, []);
            this._bindUI();
        },
        _bindUI: function() {
            // 侧边栏操作按钮
            $.index_.on(click, '#guide', function() {
                $(this).toggleClass('toggled');
                $('#sidebar').toggleClass('toggled');
            });
            // 侧边栏二级菜单
            $.index_.on('click', '.sub-menu a', function() {
                $(this).next().slideToggle(200);
                $(this).parent().toggleClass('toggled');
            });
            // 个人资料
            $.index_.on('click', '.s-profile a', function() {
                $(this).next().slideToggle(200);
                $(this).parent().toggleClass('toggled');
            });

            // 切换系统
            $.index_.on('click', '.switch-systems', function() {
                var systemid = $(this).attr('systemid');
                var systemname = $(this).attr('systemname');
                var systemtitle = $(this).attr('systemtitle');
                $('.system_menus').hide(0, function() {
                    $('.system_' + systemid).show();
                });
                $('body').attr("id", systemname);
                $('#system_title').text(systemtitle);
                $.cookie('admin-systemid', systemid);
                $.cookie('admin-systemname', systemname);
                $.cookie('admin-systemtitle', systemtitle);
            });

            $(window).resize(function() {
                resizeFrameHeight();
                initScrollShow();
                initScrollState();
            });

            // 菜单点击
            $.index_.on('click', '.x-menu', function() {
                var title = $(this).data('title');
                var url = $(this).data('url');
                if (title && url && url != '#') addTab(title, url);
            })

            // 选项卡点击
            $.index_.on('click', '.content_tab li', function() {
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
                    $('.content_tab>ul').animate({ scrollLeft: left }, 200, function() {
                        initScrollState();
                    });
                }
                // 滚动到可视区域:在右侧
                if (($(this).position().left + $(this).width() - marginLeft) > document.getElementById('tabs').clientWidth) {
                    var left = $('.content_tab>ul').scrollLeft() + (($(this).position().left + $(this).width() - marginLeft) - document.getElementById('tabs').clientWidth);
                    $('.content_tab>ul').animate({ scrollLeft: left }, 200, function() {
                        initScrollState();
                    });
                }
            });
            // 控制选项卡滚动位置
            $.index_.on('click', '.tab_left>a', function() {
                $('.content_tab>ul').animate({ scrollLeft: $('.content_tab>ul').scrollLeft() - 300 }, 200, function() {
                    initScrollState();
                });
            });
            // 向右箭头
            $.index_.on('click', '.tab_right>a', function() {
                $('.content_tab>ul').animate({ scrollLeft: $('.content_tab>ul').scrollLeft() + 300 }, 200, function() {
                    initScrollState();
                });
            });
            // 初始化箭头状态
        },
        _menusAjax: function (me, data) {
            $.get('/menu/userMenus', {}, function (result) {
                me.menus = menuMap(result.Rows);
                me._menusGenerate();
            }, 'json')
        },
        _menusGenerate: function () {
            var lis = this.menus.join('');
            $('.x-menus').prepend(lis);
            // $('#side-menu >li:has(a[href="' + window.location.hash + '"])').addClass('active');
        },
        _welcomeMsg: function () {
            setTimeout(function () {
                toastr.options = {
                    closeButton: true,
                    progressBar: true,
                    showMethod: 'slideDown',
                    timeOut: 4000
                };
                toastr.success('当前时间：' + getNowTime(), '欢迎进入 方格子●广告发布系统');
            }, 1300);
        },
        setProfile: function () {
            $.get('/user/info', {}, function(result) {
                // $('ul#side-menu .profile_img').attr('src', user.img);
                // $('ul#side-menu .profile_name').text(result.username);
                // $('ul#side-menu .profile_role').text(result.rolename);
            }, 'json');
        }

    };

    /*
     * 生成菜单
     */
    function menuMap(data) {
        return data.map(function (menu) {
            return rootMenu(menu);
        });
    }

    function rootMenu(menu) {
        var m = "<li class="+ (menu.children.length > 0?'sub-menu system_menus':'')+">";
        m += "<a class='waves-effect x-menu' href='javascript:;' data-url=" + menu.href + " data-title=" + menu.name + ">";
        m += menu.level == 1 ? ("<i class='" + menu.icon + "'></i>" + menu.name) : menu.name;

        if (menu.children.length > 0) {
            m += childMenu(menu);
        } else {
            m += "</a></li>";
        }

        return m;
    }

    function childMenu(rootMenu) {
        var child = "</a><ul style='margin-left:" + 5*rootMenu.level + "px;'>";
        rootMenu.children.map(function (menu) {
            child += "<li class="+ (menu.children.length > 0?'sub-menu system_menus':'')+">";
            child += "<a class='waves-effect x-menu'  data-title='" + menu.name + "' data-url=" + menu.href + ">" + menu.name;
            if (menu.children.length > 0) {
                child += childMenu(menu);
            } else {
                child += "</a></li>";
            }
        })
        child += "</ul></li>";
        return child;
    }


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
            var iframe = '<div id="iframe_' + index + '" class="iframe cur"><div data-url="' + url + '" class="tab_iframe x-content" style="height:'+x_content_height+'px;"></div></div>';
            $('.content_main').append(iframe);
            loadURL(url, index);
            initScrollShow();
            $('.content_tab>ul').animate({ scrollLeft: document.getElementById('tabs').scrollWidth - document.getElementById('tabs').clientWidth }, 200, function() {
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
        fetchElementData: function(item) {
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
                onClick: function(item) {
                    closeTab($(item));
                }
            },
            closeOther: {
                name: '关闭其他',
                iconClass: 'zmdi zmdi-arrow-split',
                onClick: function(item) {
                    var index = $(item).data('index');
                    $('.content_tab li').each(function() {
                        if ($(this).data('index') != index) {
                            Tab.closeTab($(this));
                        }
                    });
                }
            },
            closeAll: {
                name: '关闭全部',
                iconClass: 'zmdi zmdi-swap',
                onClick: function() {
                    $('.content_tab li').each(function() {
                        closeTab($(this));
                    });
                }
            },
            closeRight: {
                name: '关闭右侧所有',
                iconClass: 'zmdi zmdi-arrow-right',
                onClick: function(item) {
                    var index = $(item).data('index');
                    $($('.content_tab li').toArray().reverse()).each(function() {
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
                onClick: function(item) {
                    var index = $(item).data('index');
                    $('.content_tab li').each(function() {
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
                onClick: function(item) {
                    var index = $(item).data('index');
                    var $iframe = $('#iframe_' + index).find('.x-content');
                    loadURL($iframe.data('url'), index);
                }
            }
        }
    })


    function loadURL(url, index) {
        var b = $('#iframe_'+ index + ' .x-content');
        // return
        $.ajax({
            "type": "GET",
            "url": url,
            "dataType": "html",
            "cache": !0,
            "beforeSend": function() {
                b.removeData().html(""),
                    b.html('<div class="dropload-load"><div class="sk-folding-cube"><div class="sk-cube1 sk-cube"></div><div class="sk-cube2 sk-cube"></div><div class="sk-cube4 sk-cube"></div><div class="sk-cube3 sk-cube"></div></div></div>'),
                    b[0] == $("#content")[0] && ($("body").find("> *").filter(":not(" + ignore_key_elms + ")").empty().remove(),
                        drawBreadCrumb(),
                        $("html").animate({
                            "scrollTop": 0
                        }, "fast"))
            },
            "success": function(url) {
                b.css({
                        "opacity": "0.0"
                    }).html(url).delay(50).animate({
                        "opacity": "1.0"
                    }, 300),
                    url = null,
                    b = null
            },
            "error": function(c, d, e) {
                b.html('<h4 class="ajax-loading-error"><i class="fa fa-warning txt-color-orangeDark"></i> Error requesting <span class="txt-color-red">' + a + "</span>: " + c.status + ' <span style="text-transform: capitalize;">' + e + "</span></h4>")
            },
            "async": !0
        })
    }
})