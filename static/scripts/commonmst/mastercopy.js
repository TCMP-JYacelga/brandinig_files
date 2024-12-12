
function showList(strUrl)
{
	window.location = strUrl;
}

function showAddNewForm(strUrl)
{
	window.location = strUrl;
}

function showHistoryForm(strUrl, index)
{
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	var strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=400,height=300";

	var frm = document.forms["frmMain"];
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open ("", "hWinHistory", strAttr);
	frm.submit();
}

function showViewForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function acceptRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target ="";
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}
function rejectRecord(arrData, strRemarks)
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
		frm.action = "rejectMasterCopy.form";
		frm.method = 'POST';
		frm.submit();
	}
}
function showBack(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function getMasterToCopy(strUrl)
{
	var frm = document.forms["frmMain"]; 
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function changeCase(ctrl)
{
	if (ctrl)
		ctrl.value = ctrl.value.toUpperCase().replace(/([^0-9A-Z])/g, "");
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
    	else {
    	 document.getElementById(inputIdArray[i]).innerHTML=myJSONObject.columns[i].value;} 
    	}
	}    
}
