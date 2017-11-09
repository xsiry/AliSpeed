/**
 * Created by IntelliJ IDEA.
 * User: xsiry
 * Date: 2017/10/30
 * Time: 14:28
 */

define(function (require, exports, module) {
    let $ = require('jquery');
    require('bootstrap');

    let accountModule = require('../index/module_account');

    let login_ = $('#login-window');
    let url = "/user/login";

    module.exports = {
        init: function () {
            // Waves初始化
            require('waves');
            Waves.displayEffect();
            xValidator();
            checkCookie();
            this._bindUI();
        },
        _bindUI: function () {
            // 输入框获取焦点后出现下划线
            login_.on("focus", '.form-control', function () {
                $(this).parent().addClass('fg-toggled');
            });
            login_.on("blur", '.form-control', function () {
                $(this).parent().removeClass('fg-toggled');
            });
            // bind login
            login_.on("click", '#login-bt', function () {
                $('#loginForm').submit();
            });
            // bind login
            login_.on("keypress", '#username, #password', function (e) {
                if (e.which === "13") $('#loginForm').submit();
            });
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
            // bind register_btn
            $('body').on("click", '.register_btn', function() {
                accountModule._register();
            })
        }
    };

    // 登录
    function xValidator() {
        require('formValidation');
        require('fvbootstrap');
        require('fvzh_CN');

        $('.fg-line:first').addClass('fg-toggled');
        $('#loginForm').formValidation({
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
            fields: {
                username: {
                    validators: {
                        notEmpty: {
                            message: '账号不能为空'
                        },
                        regexp: {
                            regexp: /^[a-zA-Z0-9_]+$/
                        }
                    }
                },
                password: {
                    validators: {
                        notEmpty: {
                            message: '密码不能为空'
                        }
                    }
                }
            }
        }).on('success.form.fv', function (e) {
            // if (!validateCode()) {
            //     return false;
            // }
            // Prevent form submission
            e.preventDefault();

            // Get the form instance
            let $form = $(e.target);

            // Get the FormValidation instance
            let bv = $form.data('formValidation');

            // Use Ajax to submit form data
            $.post(url, $form.serialize(), function (result) {
                require('toastr');
                toastr.options = {
                    closeButton: true,
                    progressBar: true,
                    showMethod: 'slideDown',
                    timeOut: 4000
                };
                if (result.success) {
                    saveUserInfo();
                    location.href = "index_.html";
                    toastr.success('登录成功！');
                } else {
                    toastr.error(result.msg);
                    return false;
                }
            }, 'json');
        });
    };

    // 检查Cookie，并设置
    function checkCookie() {
        require('cookie');

        // 记住密码选中时，记住账号则自动选中 反之
        $("#rmbPassWord").click(function () {
            $("#rmbPassWord").is(':checked') === true ? $("#rmbUser").prop("checked", 'true') : $("#rmbUser").prop("checked", false);
        });

        //初始化页面时验证是否记住了帐号
        if ($.cookie("rmbUser") === "true") {
            $("#rmbUser").prop("checked", true);
            $("#username").val($.cookie("userName"));
        }
        ;

        //初始化页面时验证是否记住了密码
        if ($.cookie("rmbPassWord") === "true") {
            $("#rmbPassWord").prop("checked", true);
            $("#password").val($.cookie("passWord"));
        }
        ;
    };

    //保存用户信息，存储一个带7天期限的 cookie 或者 清除 cookie
    function saveUserInfo() {
        // 保存帐号和密码
        if ($("#rmbUser").is(':checked') === true && $("#rmbPassWord").is(':checked') === true) {
            let userName = $("#username").val();
            let passWord = $("#password").val();

            $.cookie("rmbUser", "true", {expires: 7});
            $.cookie("rmbPassWord", "true", {expires: 7});
            $.cookie("userName", userName, {expires: 7});
            $.cookie("passWord", passWord, {expires: 7});

            // 只保存帐号
        } else if ($("#rmbUser").is(':checked') === true) {
            let username = $("#username").val();

            $.cookie("rmbUser", "true", {expires: 7});
            $.cookie("userName", username, {expires: 7});

            $.cookie("rmbPassWord", "false", {expires: -1});
            $.cookie("passWord", '', {expires: -1});
            // 清除用户信息的 cookie
        } else {
            $.cookie("rmbUser", "false", {expires: -1});
            $.cookie("rmbPassWord", "false", {expires: -1});
            $.cookie("userName", '', {expires: -1});
            $.cookie("passWord", '', {expires: -1});
        }
    }
});