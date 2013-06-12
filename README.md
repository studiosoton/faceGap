faceGap ( Phonegap + Facebook )
===============================

Jquery PhoneGap Facebook Connect Plugin - without native plugin

This plugin connects to facebook without using native plugin (Android, iOS, etc)<br>
Plugin working mode "Site Login with Facebook"


Supported on PhoneGap (Cordova) v2.3.0 and above. ( InAppBrowser ).

Facebook Requirements and Set-Up
--------------------------------

To use this plugin you need to make sure you registered your application Facebook profile with Facebook and have a App id and App Secret  (https://developers.facebook.com/apps).

Include Jquery and FaceGap
--------------------------

<code>&lt;script type="text/javascript" src="cordova.js"&gt;&lt;/script&gt;</code><br>
<code>&lt;script type="text/javascript" src="js/jquery-X.X.X.js"&gt;&lt;/script&gt;</code><br>
<code>&lt;script type="text/javascript" src="js/faceGap-1.0.js"&gt;&lt;/script&gt;</code>

Start Plugin - Login / Logout
-----------------------------

<pre>
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {	
	
	//Config Plugin
	var config = {
		app_id		: '',
		secret		: '',
		escope		: 'publish_stream,email',
		host		: '', //App Domain ( Facebook Developer ).
		onLogin 	: _onLogin,
		onLogout 	: _onLogout
	};
	
	//Login Facebook
	$(document).FaceGap(config);
	//Logout Facebook
	//$(document).FaceGap('logout');
	
	//Callback Login
	function _onLogin( event ){		
		alert('status > '+event.status); // 1 - success, 0 - error
		alert('data > '+event.data); //Object response (id, name, email, etc);
		alert('token > '+event.token); // token user login
		alert('message > '+event.message);	
	}
	
	//Callback Logout
	function _onLogout( event ){
		alert('status > '+event.status); // 1 - success, 0 - error
		alert('message > '+event.message);
	}	
}
</pre>

FB API
------
<pre>	
	//Function callback response
	function _callback( event ){
		alert('_callback status > '+event.status);
		alert('_callback data > '+event.data);
		alert('_callback message > '+event.message);
	}
	
	//Config Object FB API
	var _fb = {
		path	:	'/me/friends',
		method	:	'GET',
		params	:	{ limit : 5 },
		cb	:	_callback //Function callback response
	};
	
	//Get FB API
	$(document).FaceGap('fb_api', _fb);	
</pre>
