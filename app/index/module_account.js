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

    module.exports = {
        init: function () {
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
                var msg;
                toastr.options = {
                    closeButton: true,
                    progressBar: true,
                    showMethod: 'slideDown',
                    timeOut: 4000
                };
                if (result.success) {
                    msg = '注册' + result.msg;
                    toastr.success(msg);
                    $('#registerForm')[0].reset();
                    $('#registerForm').data('formValidation').resetForm();
                } else {
                    msg = '注册' + result.msg;
                    toastr.error(msg);
                    $('.register_btn').prop("disabled", false);
                }
                ;
            }, 'json');
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
});