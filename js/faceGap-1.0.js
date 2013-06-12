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
(function($) {
    
	var config = {
        'app_id'	: '',
        'secret'	: '',
        'host'		: '',
        'escope'	: 'publish_stream',
		'onLogin' 	: '',
		'onLogout' 	: ''
    };
	
	var facebook_token = "";
	var ref;
	var ref_logout;
	var _result = {
		status	: '',
		data	: '',
		token	: '',
		message	: ''
	};
		
	var methods = {
		init : function( settings ) { 
		
			if (settings){$.extend(config, settings);}
			
			var authorize_url = "https://www.facebook.com/dialog/oauth?";
			authorize_url += "client_id=" + config.app_id;
			authorize_url += "&redirect_uri=" + config.host+'/connect/login_success.html';
			authorize_url += "&display=touch";
			authorize_url += "&scope="+config.escope;
			
			ref = window.open(authorize_url, '_blank', 'location=no');
			ref.addEventListener('loadstart', function(event){
				methods.changeLogin(event.url);
			});
			ref.addEventListener('loadstop', function(event) { 
				methods.parseStop(event.url);
			});
			ref.addEventListener('loaderror', function(event) { 
				ref.close();
				_result.status = 0;
				_result.data = null;
				_result.message = event.message;
				_result.token = '';
				config.onLogin( _result );
			});
			ref.addEventListener('exit', function(event) { });
			
		},
		changeLogout : function( _url ) {
			var return_url = _url;
			if(return_url == config.host+"/connect/logout_success.html"){
				_result.status = 1;
				_result.message = 'Success';
				config.onLogout( _result );	
			}else{
				_result.status = 0;
				_result.message = 'unknown error';
				config.onLogout( _result );
			}
		},
		changeLogin : function( _url ) {
			var return_url = _url;
			var code = methods._getParameter("code",return_url);
			if (code.length > 0 ) {
				var codeUrl = 'https://graph.facebook.com/oauth/access_token?client_id='+config.app_id+'&client_secret='+config.secret+'&redirect_uri='+config.host+'/connect/login_success.html&code='+code;
				$.ajax({
					url: codeUrl,
					data: {},
					type: 'POST',
					async: false,
					cache: false,
					success: function(data, status){
						ref.close();
						facebook_token = data.split('=')[1].split('&')[0];						
						methods.getMe(facebook_token);
					},
					error: function(){
						ref.close();
						_result.status = 0;
						_result.data = null;
						_result.message = 'Error get access token';
						_result.token = '';
						config.onLogin( _result );	
					}
				});
			}
			
		},
		parseStop : function( _url ){
			var return_url = _url;
			var error_code = methods._getParameter("error_code",return_url);
			if(error_code == 200 || error_code == '200'){
				ref.close();
				_result.status = 0;
				_result.data = null;
				_result.message = 'Login canceled';
				_result.token = '';
				config.onLogin( _result );				
			}
			
		},
		getMe : function( _t ) {
			var url_me = "https://graph.facebook.com/me?access_token="+_t;
			$.ajax({
				url: url_me,
				dataType: "jsonp",
				async: false,
				cache: false,
				success: function(data, status){					
					ref.close();
					_result.status = 1;
					_result.data = data;
					_result.message = 'Success';
					_result.token = _t;
					config.onLogin( _result );
				},
				error: function(){
					if(methods._isFunction(config.onConnect)){
						_result.status = 0;
						_result.data = null;
						_result.message = 'Error get info user';
						_result.token = '';
						config.onLogin( _result );													
					}
				}
			});		
		},
		logout : function(){
			if(facebook_token != ""){
				var url_logout = "https://www.facebook.com/logout.php?access_token="+facebook_token+"&confirm=1&next="+config.host+"/connect/logout_success.html";			
				ref_logout = window.open(url_logout, '_blank', 'location=no');
				ref_logout.addEventListener('loadstart', function(event){
					methods.changeLogout(event.url);
				});
			}else{
				_result.status = 0;
				_result.message = 'No user in session';
				config.onLogout( _result );	
			}
		},
		fb_api : function(_config){
			if(facebook_token != ""){
				var url_me = "https://graph.facebook.com"+_config.path+"?access_token="+facebook_token;

				$.ajax({
					url: url_me,
					dataType: "jsonp",
					data: _config.params,
					async: false,
					cache: false,
					success: function(response, status){
						_result.status = 1;
						_result.message = 'success';
						_result.data = response;
						_config.cb( _result );
						
					},
					error: function(){
						_result.status = 0;
						_result.message = 'unknown error';
						_result.data = null;
						_config.cb( _result );
					}
				});	
				
			}else{
				_result.status = 0;
				_result.message = 'No user in session';
				_result.data = null;
				_config.cb( _result );	
			}
		},
		_getParameter : function(name, _url) {
			name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
			var regexS = "[\\?&]" + name + "=([^&#]*)";
			var regex = new RegExp(regexS);
			var results = regex.exec(_url);
			if (results == null)
				return "";
			else
				return results[1];
		}, 
		_isFunction : function(functionToCheck) {
			var getType = {};
			return functionToCheck && getType.toString.call(functionToCheck) == '[object Function]';
		}
	
    }
	
	$.fn.FaceGap = function( method ) {
    
		if ( methods[method] ) {
		  return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
		  return methods.init.apply( this, arguments );
		} else {
		  $.error( 'Method ' +  method + ' does not exist on jQuery.gProtocol' );
		}    
	  
	};
		
})( jQuery );