function getNextHighestZindex(obj)
{
	var highestIndex = 0;
   	var currentIndex = 0;
   	var elArray = Array();

   	if (obj)
	{
		elArray = obj.getElementsByTagName('*');
	}
	else
	{
		elArray = document.getElementsByTagName('*');
	}
   	for (var i = 0; i < elArray.length; i++)
	{
   		if (elArray[i].currentStyle)
		{
			currentIndex = parseFloat(elArray[i].currentStyle['zIndex']);
		}
		else if(window.getComputedStyle)
		{
  			currentIndex = parseFloat(document.defaultView.getComputedStyle(elArray[i],null).getPropertyValue('z-index'));
  		}
  		if(!isNaN(currentIndex) && currentIndex > highestIndex){ highestIndex = currentIndex; }
  	}
	return(highestIndex+1);
}

function writeMessage(strReceiver, intType)
{
	var h,w;
	toggleBackground(true);
	if (typeof(window.innerWidth) == 'number')
	{
		//Non-IE
    	w = (window.innerWidth - 300) / 2;
    	h = (window.innerHeight - 255) / 2;
	}
	else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight))
	{
		//IE 6+ in 'standards compliant mode'
    	w = (document.documentElement.clientWidth - 300) / 2;
    	h = (document.documentElement.clientHeight - 255) / 2;
	}
	else if (document.body && (document.body.clientWidth || document.body.clientHeight))
	{
    	//IE 4 compatible
    	w = (document.body.clientWidth - 300) / 2;
    	h = (document.body.clientHeight - 255) / 2;
	}

	//alert(Math.floor(w) + "x" + Math.floor(h));
	jQuery("#contactFormContainer").css({"left": w, "top": h, "display": "block"});
	jQuery("#contactForm").css("display", "block");
	document.frmMain.receiver.value = strReceiver;
	document.frmMain.receiverType.value = intType;
}

function sendMessage()
{
    jQuery("#contactFormContainer").css("display", "none");
    jQuery("#contactForm").css("display", "none");
    toggleBackground(false);
    document.frmMain.submit();
}

function toggleBackground(blnShow)
{
	if (blnShow)
	{
		jQuery("#backgroundPopup").css({"height": document.documentElement.clientHeight, "display": "block"});
	}
	else
    	jQuery("#backgroundPopup").css("display", "none");
}
