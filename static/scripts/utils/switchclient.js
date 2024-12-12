function showList(strUrl)
{
	window.location = strUrl;
}
function switchClient(strUrl,clientCode,index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "";	
	frm.appendChild(createFormField('INPUT', 'HIDDEN',csrfTokenName, csrfTokenValue));
	frm.method = "POST";
	frm.submit();
}
function filter(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.appendChild(createFormField('INPUT', 'HIDDEN',csrfTokenName, csrfTokenValue));
	frm.submit();
}
function showMsgBoxRepMax(v) {
	alert('Only 5 clients allowed in favorites.');
}

function toggleFavorite(ctrl, strRep, intPage, intIdx,nooffav)
{
	var frm, strTmp, arrTmp;
	var blnPresent = false;
	var btnOkRep = "OK";
	
	if (arrFavorites[strRep])
		blnPresent = true;
	
	frm = document.forms["frmMain"];
	strTmp = frm.favorites.value;
	
	if (isEmpty(strTmp))
		arrTmp = {};
	else
		arrTmp = JSON.parse(strTmp);
		
	var strKey = intPage + "_" + intIdx;
	
	if (arrTmp[strKey])
	{
		// We need to either remove the clicked client if it is not already a favorite client or mark it as to be removed
		// if it is already a favorite
	
		var objJson = arrTmp[strKey]
		
		var flg =objJson['remove'];
			
		if (!blnPresent)
		{
			if (flg){
			
				if(totmarkedfavcount<5)
				{
					objJson['remove'] = false;	
					$(ctrl).removeClass('icon-misc-nonfavorite');
					$(ctrl).addClass('icon-misc-selfavorite');
				}
				else
				{
					showMsgBoxRepMax(btnOkRep);
				}
			}
			else {
			objJson['remove'] = true;
			$(ctrl).removeClass('icon-misc-selfavorite');
			$(ctrl).addClass('icon-misc-nonfavorite');
			totmarkedfavcount--;
			}
		}
		else
		{
			if (flg)
			{
			
				if(totmarkedfavcount<5)
				{
					objJson['remove'] = false;	
					$(ctrl).removeClass('icon-misc-nonfavorite');
					$(ctrl).addClass('icon-misc-favorite');
				}
				else
				{
					showMsgBoxRepMax(btnOkRep);
				}
			}
		else {
			objJson['remove'] = true;
			$(ctrl).removeClass('icon-misc-favorite');
			$(ctrl).addClass('icon-misc-nonfavorite');
			totmarkedfavcount--;
			}
		}
	}
	else
	{
		// Clicked clicked is to be marked as either favorite or non-favorite
		var objJson = {};
		objJson['favClient'] = strRep;
		if (blnPresent){
			objJson['remove'] = true;
			$(ctrl).removeClass('icon-misc-favorite');
			$(ctrl).addClass('icon-misc-nonfavorite');
			totmarkedfavcount--;
			}
		else {
			
				if(totmarkedfavcount<5)
				{
					objJson['remove'] = false;	
					$(ctrl).removeClass('icon-misc-nonfavorite');
					$(ctrl).addClass('icon-misc-selfavorite');
				}
				else
				{
					showMsgBoxRepMax(btnOkRep);
				}
			}

		if(totmarkedfavcount<5)
		{	
		arrTmp[strKey] = objJson;
		}
	}

	frm.favorites.value = JSON.stringify(arrTmp);

		var removereports = 0;
		var addreports = 0;
		var totalReportsCount=0;


		for(key in arrTmp)
		{
		var objJson = arrTmp[key];

		if(null != objJson)
		{
			var flg =objJson['remove'];
			
			if(arrFavorites[objJson['favClient']]){
				if(flg){
				removereports++;
				}
			}
			else 
			{
				if(!flg){
				addreports++;
				}
			}
		}
		}
		
		totFavcount = nooffav-removereports;
		
		totalReportsCount=totFavcount+addreports;
		
		totmarkedfavcount=totalReportsCount;
		

		for(key in arrTmp){
		var objJson = arrTmp[key];
		if(null != objJson){
			var flg =objJson['remove'];
			if(arrFavorites[objJson['favClient']]){
				if(flg){
					document.getElementById("btnSave").className ="imagelink black inline button-icon icon-button-submit font_bold";
					break;
				} else {
					document.getElementById("btnSave").className ="imagelink grey inline_block button-icon icon-button-save font_bold";
				}	
			} else {
				if(!flg){
					document.getElementById("btnSave").className ="imagelink black inline button-icon icon-button-submit font_bold";
					break;
				} else {
					document.getElementById("btnSave").className ="imagelink grey inline_block button-icon icon-button-save font_bold";					
				}
			}
		}
	}
	return false;
}
function saveFavClients(strUrl)
{
	var frm = document.forms["frmMain"];
	if (frm.favorites.value=='') {
	return false;}
	frm.target ="";
	frm.action = strUrl;
	frm.appendChild(createFormField('INPUT', 'HIDDEN',csrfTokenName, csrfTokenValue));
	frm.method = "POST";
	frm.submit();
}
function createFormField( element, type, name, value )
{
	var inputField;
	inputField = document.createElement( element );
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}