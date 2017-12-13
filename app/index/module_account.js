/**
 * Created by IntelliJ IDEA.
 * User: xsiry
 * Date: 2017/11/02
 * Time: 16:39
 */
define(function (require, exports, module) {
    var $ = require('jquery');
    require('bootstrap');
    require('jquery-confirm');
    require('formValidation');
    require('fvbootstrap');
    require('fvzh_CN');

    var countdown = 60;

    module.exports = {
        init: function () {
        },
        _retrievePwd: function () {
            retrievePwd();
        },
        _register: function () {
            register();
        },
        _showAccount: function () {
            showAccount();
        },
        _editPassword: function () {
            editPassword();
        },
        _logout: function () {
            logout();
        }
    };

    function register() {
        $('#registerForm').formValidation({
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
                account: {
                    validators: {
                        notEmpty: {
                            message: '用户名不能为空'
                        },
                        regexp: {
                            regexp: /^[a-zA-z0-9_]+$/,
                            message: '用户名只能由数字、字母和下划线组成'
                        }
                    }
                },
                relname: {
                    validators: {
                        notEmpty: {
                            message: '真实姓名不能为空'
                        }
                    }
                },
                pwd: {
                    validators: {
                        notEmpty: {
                            message: '密码不能为空'
                        },
                        stringLength: {
                            min: 3,
                            max: 16,
                            message: '密码长度必须在3~16之间'
                        },
                        regexp: {
                            regexp: /^[a-zA-Z0-9]+$/,
                            message: '密码只能由大小写字母和数字组成'
                        },
                        identical: {
                            field: 'confirm_pwd',
                            message: '密码与验证密码不一致'

                        },
                    }
                },
                confirm_pwd: {
                    validators: {
                        notEmpty: {
                            message: '验证密码不能为空'
                        },
                        stringLength: {
                            min: 3,
                            max: 16,
                            message: '密码长度必须在3~16之间'
                        },
                        regexp: {
                            regexp: /^[a-zA-Z0-9]+$/,
                            message: '密码只能由大小写字母和数字组成'
                        },
                        identical: {
                            field: 'pwd',
                            message: '验证密码与密码不一致'

                        }
                    }
                },
                mobile: {
                    validators: {
                        notEmpty: {
                            message: '手机号不能为空'
                        },
                        regexp: {
                            regexp: /^1\d{10}$/,
                            message: '手机号格式不正确'
                        }
                    }
                },
                qq: {
                    validators: {
                        notEmpty: {
                            message: 'QQ不能为空'
                        },
                        regexp: {
                            regexp: /^[0-9]+$/,
                            message: 'QQ只能由纯数字组成'
                        }
                    }
                },
                email: {
                    validators: {
                        notEmpty: {
                            message: '邮箱不能为空'
                        },
                        regexp: {
                            regexp: /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.(?:com|cn)$/,
                            message: '邮箱格式不正确'
                        }
                    }
                }
            }
        }).on('success.form.fv', function (e) {
            $('.register_btn').prop("disabled", true);
            // Prevent form submission
            e.preventDefault();

            // Get the form instance
            var $form = $(e.target);

            var params = {};

            $.each($form.serializeArray(), function (i, o) {
                params[o.name] = o.value;
            });

            $.post('/user/register', params, function (result) {
                var msg = result.msg;
                $.alert({
                    type: result.success ? 'blue':'red',
                    animationSpeed: 300,
                    title: '提示',
                    icon:'glyphicon glyphicon-info-sign',
                    content: msg
                });
                if (result.success) {
                    $('#registerForm')[0].reset();
                    $('#registerForm').data('formValidation').resetForm();
                }
                $('.register_btn').removeClass('disabled');
                $('.register_btn').attr("disabled", false);
            }, 'json');
        });
    }

    function retrievePwd() {
        var title = "密码找回";
        $.confirm({
            title: title,
            content: 'url:../app/retrieve_pwd_dialog.html',
            buttons: {
                confirm: {
                    text: '确认',
                    btnClass: 'waves-effect waves-button x-hide',
                    action: function () {
                        var self = this;
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
                var self = this;
                setTimeout(function () {
                    // 设置input特效
                    self.$content.on('focus', 'input[type="text"]', function () {
                        $(this).parent().find('label').addClass('active');
                    }).on('blur', 'input[type="text"]', function () {
                        if ($(this).val() === '') {
                            $(this).parent().find('label').removeClass('active');
                        }
                    });
                    // 输入四位验证码后显示密码框
                    self.$content.on('input propertychange', 'input[name="rp_code"]', function() {
                        if ($(this).val().length === 4) {
                            self.$content.find('.x-retrieve-pwd-block').show();
                            $(self.$$confirm[0]).removeClass('x-hide');
                        }else {
                            self.$content.find('.x-retrieve-pwd-block').hide();
                            $(self.$$confirm[0]).addClass('x-hide');
                        }
                    });

                    self.$content.on('click', '.x-get-code', function() {
                        var account = self.$content.find('input[name="account"]').val();
                        var email = self.$content.find('input[name="email"]').val();
                        if (account === '') {
                            $.alert({
                                title: '提示',
                                icon:'glyphicon glyphicon-info-sign',
                                content: '用户名不能为空'
                            });
                            return false;
                        }
                        if (email === '') {
                            $.alert({
                                title: '提示',
                                icon:'glyphicon glyphicon-info-sign',
                                content: '邮箱不能为空'
                            });
                            return false;
                        }
                        setSendCodeTime($(this));

                        var params = {
                            account: account,
                            email: email
                        };
                        $.post('/retrieve_pwd/send_code', params, function(result) {
                            var msg = result.msg;
                            $.alert({
                                type: result.success ? 'blue':'red',
                                animationSpeed: 300,
                                title: '提示',
                                icon:'glyphicon glyphicon-info-sign',
                                content: msg
                            });
                            if (!result.success) {
                                countdown = 0;
                            }
                        }, 'json')
                    });

                    self.$content.find('form').formValidation({
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
                            account: {
                                validators: {
                                    notEmpty: {
                                        message: '用户名不能为空'
                                    },
                                    regexp: {
                                        regexp: /^[a-zA-z0-9_]+$/,
                                        message: '用户名只能由数字、字母和下划线组成'
                                    }
                                }
                            },
                            new_pwd: {
                                validators: {
                                    notEmpty: {
                                        message: '密码不能为空'
                                    },
                                    stringLength: {
                                        min: 3,
                                        max: 16,
                                        message: '密码长度必须在3~16之间'
                                    },
                                    regexp: {
                                        regexp: /^[a-zA-Z0-9]+$/,
                                        message: '密码只能由大小写字母和数字组成'
                                    },
                                    identical: {
                                        field: 'confirm_pwd',
                                        message: '密码与验证密码不一致'

                                    },
                                }
                            },
                            confirm_pwd: {
                                validators: {
                                    notEmpty: {
                                        message: '验证密码不能为空'
                                    },
                                    stringLength: {
                                        min: 3,
                                        max: 16,
                                        message: '密码长度必须在3~16之间'
                                    },
                                    regexp: {
                                        regexp: /^[a-zA-Z0-9]+$/,
                                        message: '密码只能由大小写字母和数字组成'
                                    },
                                    identical: {
                                        field: 'pwd',
                                        message: '验证密码与密码不一致'

                                    }
                                }
                            },
                            email: {
                                validators: {
                                    notEmpty: {
                                        message: '邮箱不能为空'
                                    },
                                    regexp: {
                                        regexp: /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.(?:com|cn)$/,
                                        message: '邮箱格式不正确'
                                    }
                                }
                            },
                            rp_code: {
                                validators: {
                                    notEmpty: {
                                        message: '验证码不能为空'
                                    },
                                    stringLength: {
                                        min: 4,
                                        max: 4,
                                        message: '验证码必须为四位'
                                    },
                                    regexp: {
                                        regexp: /^[a-zA-z0-9]+$/,
                                        message: '验证码只能由数字、字母组成'
                                    }
                                }
                            }
                        }
                    }).on('success.form.fv', function (e) {
                        $(self.$$confirm[0]).prop("disabled", true);
                        // Prevent form submission
                        e.preventDefault();

                        // Get the form instance
                        var $form = $(e.target);

                        var params = {};

                        $.each($form.serializeArray(), function (i, o) {
                            params[o.name] = o.value;
                        });

                        $.post('/retrieve_pwd/verify_and_up_pwd', params, function (result) {
                            var msg = result.msg;
                            $.alert({
                                type: result.success ? 'blue':'red',
                                animationSpeed: 300,
                                title: '提示',
                                icon:'glyphicon glyphicon-info-sign',
                                content: msg
                            });
                            if (result.success) {
                                self.close();
                            } else {
                                $(self.$$confirm[0]).prop("disabled", false);
                            }
                        }, 'json');
                    });
                }, 500);
            }
        });
    }

    function register1() {
        var title = "用户注册";
        $.confirm({
            type: 'blue',
            animationSpeed: 300,
            title: title,
            content: 'url:../app/register_dialog.html',
            buttons: {
                confirm: {
                    text: '确认',
                    btnClass: 'waves-effect waves-button',
                    action: function () {
                        var self = this;
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
                var self = this;
                setTimeout(function () {
                    self.$content.find('form').formValidation({
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
                            account: {
                                validators: {
                                    notEmpty: {
                                        message: '用户名不能为空'
                                    },
                                    regexp: {
                                        regexp: /^[a-zA-z0-9_]+$/,
                                        message: '用户名只能由数字、字母和下划线组成'
                                    }
                                }
                            },
                            relname: {
                                validators: {
                                    notEmpty: {
                                        message: '真实姓名不能为空'
                                    }
                                }
                            },
                            pwd: {
                                validators: {
                                    notEmpty: {
                                        message: '密码不能为空'
                                    },
                                    stringLength: {
                                        min: 3,
                                        max: 16,
                                        message: '密码长度必须在3~16之间'
                                    },
                                    regexp: {
                                        regexp: /^[a-zA-Z0-9]+$/,
                                        message: '密码只能由大小写字母和数字组成'
                                    },
                                    identical: {
                                        field: 'confirm_pwd',
                                        message: '密码与验证密码不一致'

                                    },
                                }
                            },
                            confirm_pwd: {
                                validators: {
                                    notEmpty: {
                                        message: '验证密码不能为空'
                                    },
                                    stringLength: {
                                        min: 3,
                                        max: 16,
                                        message: '密码长度必须在3~16之间'
                                    },
                                    regexp: {
                                        regexp: /^[a-zA-Z0-9]+$/,
                                        message: '密码只能由大小写字母和数字组成'
                                    },
                                    identical: {
                                        field: 'pwd',
                                        message: '验证密码与密码不一致'

                                    }
                                }
                            },
                            mobile: {
                                validators: {
                                    notEmpty: {
                                        message: '手机号不能为空'
                                    },
                                    regexp: {
                                        regexp: /^1\d{10}$/,
                                        message: '手机号格式不正确'
                                    }
                                }
                            },
                            qq: {
                                validators: {
                                    notEmpty: {
                                        message: 'QQ不能为空'
                                    },
                                    regexp: {
                                        regexp: /^[0-9]+$/,
                                        message: 'QQ只能由纯数字组成'
                                    }
                                }
                            },
                            email: {
                                validators: {
                                    notEmpty: {
                                        message: '邮箱不能为空'
                                    },
                                    regexp: {
                                        regexp: /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.(?:com|cn)$/,
                                        message: '邮箱格式不正确'
                                    }
                                }
                            }
                        }
                    }).on('success.form.fv', function (e) {
                        $(self.$$confirm[0]).prop("disabled", true);
                        // Prevent form submission
                        e.preventDefault();

                        // Get the form instance
                        var $form = $(e.target);

                        var params = {};

                        $.each($form.serializeArray(), function (i, o) {
                            params[o.name] = o.value;
                        });

                        $.post('/user/register', params, function (result) {
                            var msg;
                            toastr.options = {
                                closeButton: true,
                                progressBar: true,
                                showMethod: 'slideDown',
                                timeOut: 4000
                            };
                            if (result.success) {
                                msg = title + result.msg;
                                toastr.success(msg);
                                self.close();
                            } else {
                                msg = title + result.msg;
                                toastr.error(msg);
                                $(self.$$confirm[0]).prop("disabled", false);
                            }
                            ;
                        }, 'json');
                    });
                }, 500);
            }
        });
    }

    function showAccount() {
        var title = "个人资料";
        $.get('/user/info', {}, function (result) {
            $.confirm({
                type: 'dark',
                animationSpeed: 300,
                title: title,
                content: 'url:../app/personal_data_dialog.html',
                buttons: {
                    confirm: {
                        text: '确认',
                        type: 'submit',
                        btnClass: 'waves-effect waves-button',
                        action: function () {
                            var self = this;
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
                    var self = this;
                    setTimeout(function (result) {
                        $.each(result, function (key, val) {
                            self.$content.find('label[for="' + key + '"]').addClass('active');
                            self.$content.find('input[name="' + key + '"]').val(val);
                        });

                        self.$content.find('form').formValidation({
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
                                mobile: {
                                    validators: {
                                        notEmpty: {
                                            message: '手机号不能为空'
                                        },
                                        regexp: {
                                            regexp: /^1\d{10}$/,
                                            message: '手机号格式不正确'
                                        }
                                    }
                                },
                                qq: {
                                    validators: {
                                        notEmpty: {
                                            message: 'QQ不能为空'
                                        },
                                        regexp: {
                                            regexp: /^[0-9]+$/,
                                            message: 'QQ只能由纯数字组成'
                                        }
                                    }
                                },
                                email: {
                                    validators: {
                                        notEmpty: {
                                            message: '邮箱不能为空'
                                        },
                                        regexp: {
                                            regexp: /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.(?:com|cn)$/,
                                            message: '邮箱格式不正确'
                                        }
                                    }
                                }
                            }
                        }).on('success.form.fv', function (e) {
                            $(self.$$confirm[0]).prop("disabled", true);
                            // Prevent form submission
                            e.preventDefault();

                            // Get the form instance
                            var $form = $(e.target);

                            var params = {};

                            $.each($form.serializeArray(), function (i, o) {
                                params[o.name] = o.value;
                            });

                            $.post('/user/info', params, function (result) {
                                var msg = title + result.msg;;
                                $.alert({
                                    type: result.success ? 'blue':'red',
                                    animationSpeed: 300,
                                    title: '提示',
                                    icon:'glyphicon glyphicon-info-sign',
                                    content: msg
                                });
                                if (result.success) {
                                    self.close();
                                } else {
                                    $(self.$$confirm[0]).prop("disabled", false);
                                }
                                $(self.$$confirm[0]).removeClass('disabled');
                                $(self.$$confirm[0]).attr("disabled", false);
                            }, 'json');
                        });
                    }, 500, result);
                }
            });
        }, 'json')
    }

    function editPassword() {
        var title = "密码修改";
        $.confirm({
            type: 'red',
            animationSpeed: 300,
            title: title,
            content: 'url:../app/epassword_dialog.html',
            buttons: {
                confirm: {
                    text: '确认',
                    btnClass: 'waves-effect waves-button',
                    action: function () {
                        var self = this;
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
                var self = this;
                setTimeout(function () {
                    self.$content.find('form').formValidation({
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
                            old_password: {
                                validators: {
                                    notEmpty: {
                                        message: '旧密码不能为空'
                                    },
                                    stringLength: {
                                        min: 3,
                                        max: 16,
                                        message: '密码长度必须在3~16之间'
                                    },
                                    regexp: {
                                        regexp: /^[a-zA-Z0-9]+$/,
                                        message: '密码只能由大小写字母和数字组成'
                                    }
                                }
                            },
                            new_password: {
                                validators: {
                                    notEmpty: {
                                        message: '新密码不能为空'
                                    },
                                    stringLength: {
                                        min: 3,
                                        max: 16,
                                        message: '密码长度必须在3~16之间'
                                    },
                                    regexp: {
                                        regexp: /^[a-zA-Z0-9]+$/,
                                        message: '密码只能由大小写字母和数字组成'
                                    },
                                    identical: {
                                        field: 'confirm_password',
                                        message: '新密码与确认密码不一致'

                                    },
                                }
                            },
                            confirm_password: {
                                validators: {
                                    notEmpty: {
                                        message: '验证密码不能为空'
                                    },
                                    stringLength: {
                                        min: 3,
                                        max: 16,
                                        message: '密码长度必须在3~16之间'
                                    },
                                    regexp: {
                                        regexp: /^[a-zA-Z0-9]+$/,
                                        message: '密码只能由大小写字母和数字组成'
                                    },
                                    identical: {
                                        field: 'new_password',
                                        message: '确认密码与新密码不一致'

                                    }
                                }
                            }
                        }
                    }).on('success.form.fv', function (e) {
                        $(self.$$confirm[0]).prop("disabled", true);
                        // Prevent form submission
                        e.preventDefault();

                        // Get the form instance
                        var $form = $(e.target);

                        var params = {};

                        $.each($form.serializeArray(), function (i, o) {
                            params[o.name] = o.value;
                        });

                        $.post('/user/epassword', params, function (result) {
                            var msg = title + result.msg;;
                            $.alert({
                                type: result.success ? 'blue':'red',
                                animationSpeed: 300,
                                title: '提示',
                                icon:'glyphicon glyphicon-info-sign',
                                content: msg
                            });
                            if (result.success) {
                                self.close();
                            }
                            $(self.$$confirm[0]).removeClass('disabled');
                            $(self.$$confirm[0]).attr("disabled", false);
                        }, 'json');
                    });
                }, 500);
            }
        });
    }

    function logout() {
        $.get('/user/logout', {}, function (result) {
            var msg;
            toastr.options = {
                closeButton: true,
                progressBar: true,
                showMethod: 'slideDown',
                timeOut: 4000
            };
            if (result.success) {
                toastr.success(result.msg);
                window.location = 'login_.html';
            } else {
                msg = "退出登录失败！";
                toastr.error(msg);
            }
            ;
        }, 'json')
    }

    function setSendCodeTime(val) {
        if (countdown === 0) {
            val.removeClass('disabled');
            val.attr("disabled", false);
            val.text("获取验证码");
            countdown = 60;
            return false;
        } else {
            val.addClass('disabled');
            val.attr("disabled", true);
            val.text("重新发送(" + countdown + ")");
            countdown--;
        }
        setTimeout(function() {
            setSendCodeTime(val);
        },1000);
    }
});