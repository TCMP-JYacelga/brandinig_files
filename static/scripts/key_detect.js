if (navigator.appName != 'Microsoft Internet Explorer')
{ 
  document.onkeypress = function (evt) {
    	var r = '';
  	if (document.all) {
   	 	r += event.ctrlKey ? 'Ctrl_' : '';
   	 	r += event.altKey ? 'Alt-' : '';
   		r += event.keyCode;
  	}
  	else if (document.getElementById) {
   	 	r += evt.ctrlKey ? 'Ctrl_' : '';
   	 	r += evt.altKey ? 'Alt-' : '';
    		r += evt.charCode;
  	}
  	else if (document.layers) {
   	 	r += evt.modifiers & Event.CONTROL_MASK ? 'Ctrl_' : '';
    	 	r += evt.modifiers & Event.ALT_MASK ? 'Alt-' : '';
   	 	r += evt.which;
 	 }
	 var kk;
	 kk = r.split("_");
	 
	 if (kk[0] == 'Ctrl')
	  {
  		return false;
	 }
	 else
		window.captureEvents(Event.KEYPRESS);
		       
   		
	}

}
