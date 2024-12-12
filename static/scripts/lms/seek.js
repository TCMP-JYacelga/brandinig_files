function getHelp(inputId, elementId, seekId, descriptionId, validationType, forgeryToken)
{ 
	var criteria = ' ';
	var txtSecond = document.getElementById(elementId).value;
	var today = new Date();
	var winID = today.getTime();
	var bankIndicator = "";
	var strIndicator = "";
	var strRmWeight = "200";
	var strRmDepOn = "100";

	wind = "SeekNew.action?forgeryToken=" + forgeryToken
				+ "&rmDepOn=" + strRmDepOn + "&rmweight=" + strRmWeight 
				+ "&searchCriteriaArray=" + criteria + "&parent=" + elementId 
				+ "&seekId=" + seekId + "&descriptionLabel=" + descriptionId 
				+"&txtSecond=" + txtSecond + "&validationType=" + validationType; 
	
	var winPopUpObj = window.open(wind, 'winID','width=300,height=350,resizable=1,scrollbars=0');
	if (winPopUpObj != null)
		if (!(winPopUpObj.closed))
			winPopUpObj.focus();
}
