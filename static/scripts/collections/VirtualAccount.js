
function showAddNewForm(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function showPopulateNewForm(strAction)
{
	var frm = document.forms["frmMain"];
	if("EDIT" == strAction || "UPDATE" == strAction || "POPULATE_EDIT" == strAction)
		frm.action = "virtualAccountsIssuancePopulateEdit.form";
	else
	    frm.action = "virtualAccountsIssuancePopulate.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function filterList(strAction)
{
	var frm = document.forms["frmMain"];
	if("LIST" == strAction)
		frm.action = "virtualAccountsIssuanceList.form";
	else if("AUTH" == strAction)
	    frm.action = "virtualAccountsIssuanceAuthList.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function showHistoryForm(strAction, index)
{
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	var strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=400,height=300";

	var frm = document.forms["frmMain"];
	document.getElementById("txtIndex").value = index;
	
	if ("AUTH" == strAction)
		frm.action = "virtualAccountAuthHistory.hist";
	else
		frm.action = "virtualAccountHistory.hist";
	
	frm.target = "hWinHistory";
	frm.method = "POST";
	window.open ("", "hWinHistory", strAttr);
	frm.submit();
}

function showViewForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}


// Enable, Disable, Accept and Reject requests
function enableRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function disableRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function acceptRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target = "";
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}


function rejectRecord(arrData,strRemarks)
{
	var frm = document.forms["frmMain"];		
	if (strRemarks.length > 255)
	{
		alert("Reject Remarks Length Cannot Be Greater than 255 Characters!");	
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;			
		frm.txtIndex.value = arrData[0];
		frm.target = "";
	    frm.action = "virtualAccountsIssuanceReject.form";		
		frm.method = 'POST';
		frm.submit();
	}
}
function discardRecord(arrData)
{
	var frm = document.forms["frmMain"];
	strUrl = arrData[0];
	frm.txtIndex.value = arrData[1];
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";	
	frm.submit();
}
function filter(mode,type)
{
	var strUrl = null; 
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function update(strUrl)
{
	var frm = document.forms["frmMain"];	
	frm.target ="";
	frm.action = strUrl;	
	frm.method = "POST";
	frm.submit();
}
function checkKey()
{
   if(window.event.keyCode == 13)
   {
   		var totalpage = document.getElementById("total_pages").value;
   		goPgNmbr(mode,totalpage);
   }
}	

function LTrim( value ) {
	
	var re = /\s*((\S+\s*)*)/;
	return value.replace(re, "$1");
	
}

function RTrim( value ) {
	
	var re = /((\s*\S+)*)\s*/;
	return value.replace(re, "$1");
	
}

function trim( value ) {
	
	return LTrim(RTrim(value));
	
}
function enableCheckbox(me, chkelmentId)
{
	var elementVal	=	trim(me.value);
	if (elementVal.length > 0)
	{
		chkelmentId.value="Y";
		chkelmentId.disabled=false;
	}
	else
	{
		chkelmentId.value="N";	
		chkelmentId.disabled=true;
	}	
}

function getRecord(json,elementId)
{		  
	var myJSONObject = JSON.parse(json);
    var inputIdArray = elementId.split("|");
    for(i=0; i<inputIdArray.length; i++)
	{
    	var field = inputIdArray[i];
    	if(document.getElementById(inputIdArray[i]) && myJSONObject.columns[i])
    	{
			var type = document.getElementById(inputIdArray[i]).type;
			if(type=='text'){
				document.getElementById(inputIdArray[i]).value=myJSONObject.columns[i].value;}
			else if (type == 'hidden') {
				document.getElementById(inputIdArray[i]).value=myJSONObject.columns[i].value;}
			else {
				document.getElementById(inputIdArray[i]).innerHTML=myJSONObject.columns[i].value;} 
    	}
	}    
}
function showEditForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
}