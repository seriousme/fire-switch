window.addEventListener("load", function() {
  var busy=false;

function showError(err){
	var el = document.getElementById('ftr');
	el.innerHTML = err;
}

function getJSON(url,handler,errHandler){
	var xhr=new XMLHttpRequest({mozSystem: true});
	xhr.responseType="json";
	xhr.onreadystatechange=function(){
		if (xhr.readyState==4){
				if ( xhr.response){
					handler(xhr.response);
					}
				else{
					errHandler(Error(xhr.statusText));
				}
		}
	}
	xhr.open("GET",url,true);
	xhr.send();
}

function setState(serviceResponse) {
	for (var item in serviceResponse){
		var val = ( serviceResponse[item] === 'on');
		var el = document.getElementById(item);
		if (el){
			var cv = el.checked;
			if (cv != val) {
				busy=true;
				el.click();
				busy=false;
			}
		}
	}
	// zap potential error text
	showError("");
}

function callService(id, value) {
	var serviceUrl = 'http://ngw-lan/cgi-bin/switch';
    var url = serviceUrl + '?sid='+Math.random();
	if (value){
	    if (id != "auto"){
			id = "device" + id;
		}
		url = url + '&' + id + '=' + value;
	}
    //showError(url);
	getJSON(url, setState, showError );
}


callService();

var inputs = document.getElementsByTagName("input");
for (var i=0; i < inputs.length; i++){
	var inp = inputs[i];
	inp.onchange=function(){ 
		if (! busy){
			callService(this.getAttribute('data-device'), this.checked ? "on" : "off");
		}
	};
}
var buttons = document.getElementsByTagName("button");
for (var j=0; j < buttons.length; j++){
	var bt = buttons[j];
	bt.onclick = function(){ 
		if (! busy){
			callService(this.getAttribute('data-device'), this.getAttribute('data-value'));
		}
	};
}
});
