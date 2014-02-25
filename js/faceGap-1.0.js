/**
 The MIT License

 Copyright (c) 2013 Studio Sóton ( http://studiosoton.com  )
 by: Daniel Furini - dna.furini[at]gmail.com
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 **/  
(function ($) {
    var config = {
        app_id: "",
        secret: "",
        host: "",
        scope: "publish_stream",
        onLogin: "",
        onLogout: ""
    };
    var facebook_graph = "https://graph.facebook.com";
    var facebook_base = "https://www.facebook.com";
    var facebook_token = "";
    var ref;
    var ref_logout;
    var _hasLogin = false;
    var _result = {
        status: "",
        data: "",
        token: "",
        message: ""
    };
    var methods = {
        init: function (settings) {
            if (settings) {
                $.extend(config, settings);
            }
            var authorize_url = facebook_graph + "/oauth/authorize?type=user_agent&client_id=" + config.app_id + "&redirect_uri=" + config.host + "/connect/login_success.html&display=touch&scope=" + config.scope;
            ref = window.open(authorize_url, "_blank", "location=no");
            ref.addEventListener("loadstart", function (event) {
                methods.changeLogin(event.url);
            });
            ref.addEventListener("loadstop", function (event) {
                methods.parseStop(event.url);
            });
            ref.addEventListener("loaderror", function (event) {
                ref.close();
                if (methods._isFunction(config.onLogin)) {
                    _result.status = 0;
                    _result.data = null;
                    _result.message = event.message;
                    _result.token = "";
                    config.onLogin(_result);
                }
            });
            ref.addEventListener("exit", function (event) {});
        },
        changeLogout: function (_url) {
            var return_url = _url;
            if (return_url == config.host + "/connect/logout_success.html") {
                ref_logout.close();
                if (methods._isFunction(config.onLogout)) {
                    _result.status = 1;
                    _result.message = "Success";
                    config.onLogout(_result);
                }
            } else {
                ref_logout.close();
                if (methods._isFunction(config.onLogout)) {
                    _result.status = 0;
                    _result.message = "unknown error";
                    config.onLogout(_result);
                }
            }
        },
        changeLogin: function (_url) {
            var return_url = _url;
            var arr_data = return_url.split("access_token=");
            if (arr_data.length > 0) {
                facebook_token = arr_data[1].split("&")[0];
                methods.getMe(facebook_token);
            }
        },
        parseStop: function (_url) {
            var return_url = _url;
            $.ajax({
                url: return_url,
                dataType: "jsonp",
                async: false,
                cache: false,
                success: function (data, status) {
                    if (data.error.code > 0) {
                        ref.close();
                        if (methods._isFunction(config.onLogin)) {
                            _result.status = 0;
                            _result.data = null;
                            _result.message = "code: " + data.error.code + " message: " + data.error.message;
                            _result.token = "";
                            config.onLogin(_result);
                        }
                    }
                }
            });
        },
        getMe: function (_t) {
            if (!_hasLogin) {
                var url_me = facebook_graph+"/me?access_token=" + _t;
                $.ajax({
                    url: url_me,
                    dataType: "jsonp",
                    async: false,
                    cache: false,
                    success: function (data, status) {
                        ref.close();
                        _hasLogin = true;
                        if (methods._isFunction(config.onLogin)) {
                            _result.status = 1;
                            _result.data = data;
                            _result.message = "Success";
                            _result.token = _t;
                            config.onLogin(_result);
                        }
                    },
                    error: function () {
                        ref.close();
                        if (methods._isFunction(config.onLogin)) {
                            _result.status = 0;
                            _result.data = null;
                            _result.message = "Error get info user";
                            _result.token = "";
                            config.onLogin(_result);
                        }
                    }
                });
            } else {
                if (methods._isFunction(config.onLogin)) {
                    _result.status = 0;
                    _result.data = null;
                    _result.message = "unknown error";
                    _result.token = "";
                    config.onLogin(_result);
                }
            }
        },
        logout: function () {
            if (facebook_token !== "") {
                var url_logout = facebook_base + "/logout.php?access_token=" + facebook_token + "&confirm=1&next=" + config.host + encodeURIComponent("/connect/logout_success.html");
                ref_logout = window.open(url_logout, "_blank", "location=no");
                ref_logout.addEventListener("loadstop", function (event) {
                    methods.changeLogout(event.url);
                });
            } else {
                if (methods._isFunction(config.onLogout)) {
                    _result.status = 0;
                    _result.message = "No user in session";
                    config.onLogout(_result);
                }
            }
        },
        fb_ui: function (_config) {
            $.extend(_config, {redirect_uri : config.host, display : "popup"});
            var ui_url = facebook_base + "/dialog/" + _config.method + "?app_id=" + config.app_id;
            for (var elements in _config)
            {
                if (elements != "method" && elements != "cb")
                {
                    var value = _config[elements];
                    if (typeof value !== "string")
                        value = JSON.stringify(value);
                    ui_url += "&"+elements+"="+encodeURIComponent(value);
                }
            }
            ref = window.open(ui_url, "_blank", "location=no");
            ref.addEventListener("loadstart", function (event) {
                var pos = event.url.indexOf(config.host);
                if (pos !== -1 && methods._isFunction(_config.cb))
                {
                    ref.close();
                    var data = event.url.substring(pos+config.host.length+1).replace("?", "").replace("/", "");
                    var data_arr = data.split("=");
                    data = {};
                    data[data_arr[0]] = data_arr[1];
                    _config.cb({status : 1, data : data, message : "success"});
                }
            });
            ref.addEventListener("exit", function (event) {
                if (methods._isFunction(_config.cb))
                    _config.cb({status : 0, data : null, message : "Popup closed"});
            });
        },
        fb_api: function (_config) {
            if (facebook_token !== "") {
                var url_me = facebook_graph + _config.path + "?access_token=" + facebook_token;
                $.ajax({
                    url: url_me,
                    dataType: "jsonp",
                    data: _config.params,
                    async: false,
                    cache: false,
                    success: function (response, status) {
                        if (methods._isFunction(_config.cb)) {
                            _result.status = 1;
                            _result.message = "success";
                            _result.data = response;
                            _config.cb(_result);
                        }
                    },
                    error: function () {
                        if (methods._isFunction(_config.cb)) {
                            _result.status = 0;
                            _result.message = "unknown error";
                            _result.data = null;
                            _config.cb(_result);
                        }
                    }
                });
            } else {
                if (methods._isFunction(_config.cb)) {
                    _result.status = 0;
                    _result.message = "No user in session";
                    _result.data = null;
                    _config.cb(_result);
                }
            }
        },
        _getParameter: function (name, _url) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(_url);
            if (results === null) {
                return "";
            } else {
                return results[1];
            }
        },
        _isFunction: function (functionToCheck) {
            var getType = {};
            return functionToCheck && getType.toString.call(functionToCheck) == "[object Function]";
        }
    };
    $.fn.FaceGap = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else {
            if (typeof method === "object" || !method) {
                return methods.init.apply(this, arguments);
            } else {
                $.error("Method " + method + " does not exist on jQuery.FaceGap");
            }
        }
    };
})(jQuery);
