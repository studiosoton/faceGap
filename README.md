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
		scope		: 'publish_stream,email',
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


FB UI
------
<pre>	
	//Function callback response
	function _callback( event ){
		alert('_callback status > '+event.status);
		alert('_callback data > '+event.data);
		alert('_callback message > '+event.message);
	}
	
	//Config Object FB UI
	var _fb = {
                method      : "feed", //only method accepted actually
                link        : "https://www.link.to.share/",
                caption     : "My Caption",
                description : "My Description",
                picture     : "http://my.path/my.image.png",
                actions     : { name : "custom name", link : 'http://my.custom.link/'},
		cb	    :	_callback //Function callback response
	};
	
	//Get FB API
	$(document).FaceGap('fb_ui', _fb);	
</pre>

BUGS AND CONTRIBUTIONS
----------------------

Post issues on <a href="https://github.com/studiosoton/faceGap/issues">Github</a>

LICENSE
-------

Copyright 2013 Daniel Furini. All rights reserved.

The MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


