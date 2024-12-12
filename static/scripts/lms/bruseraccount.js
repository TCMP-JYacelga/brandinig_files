
function showHistoryForm(strUrl, index)
{	
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	var strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=390,height=300";

	var frm = document.forms["frmMain"];
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open ("", "hWinHistory", strAttr);
	frm.submit();
}

function getRejectRemarksDetails(strUrl, index)
{	
	var frm = document.forms["frmMain"]; 
	frm.txtIndex.value = strUrl[1];
	frm.rejectRemarks.value = index;
	frm.action = strUrl[0];
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

// Enable, Disable, Accept and Reject requests
function enableRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function filterList(strUrl)
{
	var frm = document.forms["frmMain"];
	
	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function disableRecord(strUrl, index)
{
	var frm = document.forms["frmMain"];

	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function acceptRecord(strUrl, index)
{
	var frm = document.forms["frmMain"];

	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "";		
	frm.method = 'POST';
	frm.submit();
}

function unassignRecord(strUrl, index)
{
	var frm = document.forms["frmMain"];

	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function assignRecord(strUrl, index, accountDesc, lmsAccMstId)
{
	var frm = document.forms["frmMain"]; 

	document.getElementById("txtIndex").value = index;
	document.getElementById("accountDesc").value = accountDesc;
	document.getElementById("lmsAccMstId").value = lmsAccMstId;
	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function discardRecord(strUrl, index)
{
	var frm = document.forms["frmMain"];

	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "";		
	frm.method = "POST";
	frm.submit();
}

function getRejectRemarks(strUrl)
{	
	var frm = window.opener.document.forms["frmMain"];

	window.opener.document.getElementById("rejectRemarks").value = document.getElementById("rejectRemarks").value;
	frm.action = strUrl;		
	frm.method = "POST";
	frm.submit();
	window.close();
}
