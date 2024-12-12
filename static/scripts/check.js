var chk=0;
var r='';
var Alt=null;
var screenType = null;
var keycd=0;
var key="0";

function keyPressed()
{ 
var e = window.event;

		if (e.keyCode >= 112 && e.keyCode <= 123)
		{
	        e.cancelBubble = false;
			switch (e.keyCode)
			{
				case 112:
					document.onhelp=disableFuncKey;
					break;
				case 113:
					if(key=="F2")
					{
						enableMe(document.getElementById(key));
						break;
					}
					else
					{				
						if(document.getElementById("F2")!=null && !document.getElementById("F2").disabled)
						{
							call('F2');
							key="F2";
							disableMe(document.getElementById("F2"));
						}	
					}
						break;
				case 114:
					if(key=="F3")
					{
						enableMe(document.getElementById(key));
						break;
					}
					else
					{
						if(document.getElementById("F3")!=null && !document.getElementById("F3").disabled)
						{
							call('F3');
							window.event.keyCode = 65;
							window.event.cancelBubble = true;
					        window.event.returnValue = false;
					    }
				    }
					break;
				case 115:
					if(key=="F4")
					{
						enableMe(document.getElementById(key));
						break;
					}
					else
					{	
						if(document.getElementById("F4")!=null && !document.getElementById("F4").disabled)
						{				
							call('F4');
							key="F4";
							disableMe(document.getElementById("F4"));
							window.event.keyCode = 66;
							window.event.cancelBubble = true;
					    	window.event.returnValue = false;
					    }
				    }
					break;
				case 116:
				if(key=="F5")
					{
						enableMe(document.getElementById(key));
						break;
					}
					else
					{
						if(document.getElementById("F5")!=null && !document.getElementById("F5").disabled)
						{
							call('F5');
							key="F5";
							disableMe(document.getElementById("F5"));
							window.event.keyCode = 66;
							window.event.cancelBubble = true;
					    	window.event.returnValue = false;
					    }
				    }
					break;
				case 117:
					if(key=="F6")
					{
						enableMe(document.getElementById(key));
						break;
					}
					else
					{
						if(document.getElementById("F6")!=null && !document.getElementById("F6").disabled)
						{
							call('F6');
							key="F6";
							disableMe(document.getElementById("F6"));
							window.event.keyCode = 66;
							window.event.cancelBubble = true;
					    	window.event.returnValue = false;
					    }
				    }
					break;
				case 118:
					if(key=="F7")
					{
						enableMe(document.getElementById(key));
						break;
					}
					else
					{
						if(document.getElementById("F7")!=null && !document.getElementById("F7").disabled)
						{
							call('F7');
							key="F7";
							disableMe(document.getElementById("F7"));
						}
					}
					break;
				case 119:
					if(key=="F8")
					{
						enableMe(document.getElementById(key));
						break;
					}
					else
					{
						if(document.getElementById("F8")!=null && !document.getElementById("F8").disabled)
						{
							call('F8');
							key="F8";			
							disableMe(document.getElementById("F8"));
						}
					}
					break;
				case 120:
					if(key=="F9")
					{
						enableMe(document.getElementById(key));
						break;
					}
					else
					{
						if(document.getElementById("F9")!=null && !document.getElementById("F9").disabled)
						{
							call('F9');
							key="F9";
							disableMe(document.getElementById("F9"));
						}
					}
					break;
				case 121:
					if(key=="F10")
					{
						enableMe(document.getElementById(key));
						break;
					}
					else
					{
						if(document.getElementById("F10")!=null && !document.getElementById("F10").disabled)
						{
							call('F10');
							key="F10";
							disableMe(document.getElementById("F10"));
							window.event.keyCode = 66;
							window.event.cancelBubble = true;
					    	window.event.returnValue = false;
					    }
				    }
					break;
				case 122:
				
					if( key=="F11")
					{					
						enableMe(document.getElementById(key));
						break;
					}
					else
					{
						if(document.getElementById("F11")!=null && !document.getElementById("F11").disabled)
						{
							call('F11');
							key="F11";
							window.event.keyCode = 67;
							disableMe(document.getElementById("F11"));
							window.event.cancelBubble = true;
						   	window.event.returnValue = false;
						}
					}
					break;
				case 123:
					if(key=="F12")
					{
						enableMe(document.getElementById(key));
						break;
					}
					else
					{
						if(document.getElementById("F12")!=null && !document.getElementById("F12").disabled)
						{
							call('F12');
							key="F12";
							disableMe(document.getElementById("F12"));
						}
					}
					break;
			}
			e.cancelBubble = true;
		}
		else
		{
			if(key!="0")
				enableMe(document.getElementById(key));
			key="0";
		}
	
	if(e.keyCode=='13')
	
		MapKeyDown();
}

function disableFuncKey(){
	call('F1');
	genHelp('F1');
	return false;
}



function detect()
{
	if (navigator.appName != "Microsoft Internet Explorer")
	{
	 	window.captureEvents(Event.KEYPRESS);
		window.onkeypress = browserhandler;
	}
	else
	{
		keyPressed();
	}
}

function MapKeyDown(loEvent) {
		loEvent = loEvent||event;
        var nKeyCode = loEvent.which||loEvent.keyCode;
		var flag=0;
		if (event.ctrlKey)
		{
			 flag = 1;
			 if (nKeyCode == 65) 
			{
				window.event.cancelBubble = true;
				window.event.returnValue = false;
			}
			if (nKeyCode == 66) 
			{
			window.event.keyCode = 100;
			window.event.cancelBubble = true;
			window.event.returnValue = false;
			}

			if (nKeyCode == 68) 
			{
			window.event.keyCode = 100;
			window.event.cancelBubble = true;
			window.event.returnValue = false;
			}

			if (nKeyCode == 69) 
			{
			window.event.keyCode = 100;
			window.event.cancelBubble = true;
			window.event.returnValue = false;
			}

			if (nKeyCode == 70) 
			{
			window.event.keyCode = 100;
			window.event.cancelBubble = true;
			window.event.returnValue = false;
			}
	
			if (nKeyCode == 71) 
			{
			window.event.keyCode = 100;
			window.event.cancelBubble = true;
			window.event.returnValue = false;
			}
			
						
			if (nKeyCode == 72) {
			window.event.keyCode = 100;
			window.event.cancelBubble = true;
			window.event.returnValue = false;
			}

			if (nKeyCode == 73) {
			window.event.keyCode = 100;
			window.event.cancelBubble = true;
			window.event.returnValue = false;
			}
	
			if (nKeyCode == 74) 
			{
			window.event.keyCode = 100;
			window.event.cancelBubble = true;
			window.event.returnValue = false;
			}
	
			if (nKeyCode == 75) 
			{
			window.event.keyCode = 100;
			window.event.cancelBubble = true;
			window.event.returnValue = false;
			}
	
			if (nKeyCode == 76) 
			{
			window.event.keyCode = 100;
			window.event.cancelBubble = true;
			window.event.returnValue = false;
			}
	
				
			if (nKeyCode == 77)  {
			window.event.keyCode = 100;
			window.event.cancelBubble = true;
			window.event.returnValue = false;
			return;
			}
				
			if (nKeyCode == 78) {
			window.event.keyCode = 100;
			window.event.cancelBubble = true;
			window.event.returnValue = false;
			}

			
			if (nKeyCode == 79) {
			window.event.keyCode = 100;
			window.event.cancelBubble = true;
			window.event.returnValue = false;
			}
			
			if (nKeyCode == 80) {
			window.event.keyCode = 100;
			window.event.cancelBubble = true;
			window.event.returnValue = false;
			}


			if (nKeyCode == 81) {
			window.event.keyCode = 100;
			window.event.cancelBubble = true;
			window.event.returnValue = false;
			}

			if (nKeyCode == 82) {
			window.event.keyCode = 100;
			window.event.cancelBubble = true;
			window.event.returnValue = false;
			}

			if (nKeyCode == 83) {
			window.event.keyCode = 100;
			window.event.cancelBubble = true;
			window.event.returnValue = false;
			}


			if (nKeyCode == 85) {
			window.event.keyCode = 100;
			window.event.cancelBubble = true;
			window.event.returnValue = false;
			}


			if (nKeyCode == 87) {
			window.event.keyCode = 100;
			window.event.cancelBubble = true;
			window.event.returnValue = false;
			}


			if (nKeyCode == 89) {
			window.event.keyCode = 100;
			window.event.cancelBubble = true;
			window.event.returnValue = false;
			}

			if (nKeyCode == 90) {
			window.event.keyCode = 100;
			window.event.cancelBubble = true;
			window.event.returnValue = false;
			}
	
    }
	MapKeyUp(flag);
}
   function MapKeyUp(flag)
	{	
	if (event.KeyCode == 65)
		

	    if(flag==1) {

		if (event.KeyCode == 65)
		{
			window.event.cancelBubble = true;
			window.event.returnValue = false;
			return false;
		}

		if (event.KeyCode == 66) 
		{
		window.event.keyCode = 100;
		window.event.cancelBubble = true;
		window.event.returnValue = false;
		}
		if (event.KeyCode == 67) {
			

		}
		if (event.KeyCode == 68) {}
		
		if (event.KeyCode == 69) {
			window.event.keyCode = 100;
			window.event.cancelBubble = true;
			window.event.returnValue = false;
			}
		
		if (event.KeyCode == 70) {}
		
		
		if (event.KeyCode == 71) {}
		
		if (event.KeyCode == 72) {}
		
		
		if (event.KeyCode == 73) {}
		
		
		if (event.KeyCode == 74) {}
			

		if (event.KeyCode == 75) {}
			
		
		if (event.KeyCode == 76) {}
			
		
		if (event.KeyCode == 77) {}
			
		
		if (event.KeyCode == 78) {}
			
		
		if (event.KeyCode == 79) {}
			
		
		if (event.KeyCode == 80)  {
			window.event.keyCode = 100;
			window.event.cancelBubble = true;
			window.event.returnValue = false;
			return;

			}
		
		if (event.KeyCode == 81) {}
					
		if (event.KeyCode == 82) {}
		
		if (event.KeyCode == 83) {}
		
		if (event.KeyCode == 84) {}
	
		if (event.KeyCode == 85) {}
					
		if (event.KeyCode == 86) {}
			

		if (event.KeyCode == 87) {
		    return false;
			}

		if (event.KeyCode == 88) {}
			

		if (event.KeyCode == 89) {}
			
		if (event.KeyCode == 90) {}
			
				return false;
	}
}
function browserhandler(e)
{
	if (e.keyCode >=112 && e.keyCode<=123) 
	{
		if (chk==0) {
			if (e.keyCode >= 112 && e.keyCode <= 123)
			{
				chk =1;
				switch (e.keyCode)
				{
					case 112:
						call('F1');
						window.event.keyCode = 65;
						window.event.cancelBubble = true;
						window.event.returnValue = false;
		
						break;
					case 113:
						call('F2');
						window.event.keyCode = 65;
						window.event.cancelBubble = true;
						window.event.returnValue = false;
		
						break;
					case 114:
						call('F3');
						return false;
						break;
					case 115:
						call('F4');
						window.event.keyCode = 66;
						window.event.cancelBubble = true;
						window.event.returnValue = false;
						break;
					case 116:
						call('F5');
						return false;
						break;
					case 117:
						call('F6');
						return false;
						break;
					case 118:
						call('F7');
						return false;
		
						break;
					case 119:
						call('F8');
						window.event.keyCode = 65;
						window.event.cancelBubble = true;
						window.event.returnValue = false;
		
						break;
					case 120:
						call('F9');
						window.event.keyCode = 65;
						window.event.cancelBubble = true;
						window.event.returnValue = false;
		
						break;
					case 121:
						call('F10');
						return false;
		
						break;
					case 122:
						call('F11');
						return false;
						break;
					case 123:
						call('F12');
						window.event.keyCode = 65;
						window.event.cancelBubble = true;
						window.event.returnValue = false;
						break;
						
				}
				
			}
		}
		chk=0;
	}
	
} 



function detectKey(me)
{
	if (navigator.appName != "Microsoft Internet Explorer")
	{
	 	window.captureEvents(Event.KEYPRESS);
		window.onkeypress = browserhandler;
	}
	else

		tabKeyPressed();
}
function tabKeyPressed(me)
{ 
	
	var e = window.event;
	if(e.keyCode == 13)
	{
	}
}	
	
	
