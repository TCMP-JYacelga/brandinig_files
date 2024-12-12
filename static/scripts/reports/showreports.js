
function showReportParam(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showPregenerated(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index;
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}

function GenerateReport(strUrl)
{
	var frm = document.forms["frmMain"]; 	
	frm.target ="";
	var strTxtCurrent = document.getElementById("txtCurrent").value;
	var viewState = document.getElementById("viewState").value;
	document.getElementById("current_index").value = strTxtCurrent;	
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}

function showViewReports(strUrl)
{
	var frm = document.forms["frmMain"]; 	
	frm.target ="";
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}

function getRecord(json,elementId)
{		  
	var myJSONObject = JSON.parse(json);
    var inputIdArray = elementId.split("|");
	
    for(i=0; i<inputIdArray.length; i++)
	{
    	var field = inputIdArray[i];
    	if(document.getElementById(inputIdArray[i]))
    	{
    	var type = document.getElementById(inputIdArray[i]).type;
    	if(type=='text'){
    	 document.getElementById(inputIdArray[i]).value = JSON.parse(myJSONObject).columns[0].value;}
    	else {
    	 document.getElementById(inputIdArray[i]).innerHTML = JSON.parse(myJSONObject).columns[0].value;} 
    	}
	}    
}

function savePrefReports(strUrl,index)
{
	var temp = document.getElementById("btnSave");
	if (temp.className.startsWith("rightAlign imagelink grey"))
	{
		return;
	}
	else
	{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
	}
}

function showMsgBoxforSavePref(yesRep,cancelRep,navType,newPage) {
	$('#confirmSave').dialog({
		autoOpen : false,				
		width : 500,
		modal : true,
		buttons: [{
                          id:"btn-no-rep",
                          text: cancelRep,
                          click: function() {
                        	  changePage(navType, newPage);
                                }
                        },{
                        	id:"btn-yes-rep",
                            text: yesRep,
                            click: function() {
							  savePrefReports('reportSavePrefernce.form');
                                }
                        }],
		bgiframe:true, 
		height: 155,
		open : function()
		{
		$('#btn-no-rep').blur();
		$('#btn-yes-rep').blur();
		}
	});
	$('#confirmSave').dialog("open"); 
}

function showMsgBoxRepMax(btnOkRep) {
	var confirmbuttonsReportsMax = {};
	var confirmBtnsArrayMax = new Array();
	confirmBtnsArrayMax['btnOkRepMax'] = btnOkRep;
		
	confirmbuttonsReportsMax[confirmBtnsArrayMax['btnOkRepMax']] = function() {
		$(this).dialog("close");
	};

	$('#confirmMaxLimit').dialog({
		autoOpen : true,				
		width : 500,
		modal : true,
		buttons : confirmbuttonsReportsMax,				
		bgiframe:true, 
		height: 155
	});
	$('#confirmMaxLimit').dialog("open"); 
}

function toggleFavorite(ctrl, strRep, intPage, intIdx,nooffav)
{
	var frm, strTmp, arrTmp;
	var blnPresent = false;

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
		// We need to either remove the clicked account if it is not already a favorite account or mark it as to be removed
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
		// Clicked account is to be marked as either favorite or non-favorite
		var objJson = {};
		objJson['report'] = strRep;
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
			
			if(arrFavorites[objJson['report']]){
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
			if(arrFavorites[objJson['report']]){
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

