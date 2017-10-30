/**
 * Created by IntelliJ IDEA.
 * User: xsiry
 * Date: 2017/10/30
 * Time: 14:28
 */

define(function(require, exports, module) {
    $.login_ = $('#login-window');
    var url = "/login";

    module.exports = {
        init: function() {
            // Waves初始化
            Waves.displayEffect();
            this._bindUI();
        },
        _bindUI: function() {
            // 输入框获取焦点后出现下划线
            $.login_.on("focus", '.form-control', function() {
                $(this).parent().addClass('fg-toggled');
            })
            $.login_.on("blur", '.form-control', function() {
                $(this).parent().removeClass('fg-toggled');
            })
            // bind .name_search_btn
            $.login_.on("click", '#login-bt', function() {
                login();
            })
            // bind .name_search
            $.login_.on("keypress", '#username, #password', function(e) {
                if (e.which == "13") login();
            })
        }
    };

    // 登录
    function login() {
        // $.ajax({
        //     url: url,
        //     type: 'POST',
        //     data: {
        //         username: $('#username').val(),
        //         password: $('#password').val(),
        //         rememberMe: $('#rememberMe').is(':checked'),
        //     },
        //     beforeSend: function() {

        //     },
        //     success: function(json) {
        //         if (json.code == 1) {
                    location.href = "index.html";
        //         } else {
        //             alert(json.data);
        //             if (10101 == json.code) {
        //                 $('#username').focus();
        //             }
        //             if (10102 == json.code) {
        //                 $('#password').focus();
        //             }
        //         }
        //     },
        //     error: function(error) {
        //         console.log(error);
        //     }
        // });
    }
})