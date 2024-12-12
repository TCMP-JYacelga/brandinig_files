
function showAddNewForm(strUrl)
{
	var frm = document.forms["frmMain"]; 
	frm.method = "POST";
	frm.action = strUrl;
	frm.submit();
}

function showWelcomePage()
{
	var frm = document.forms["frmMain"]; 
	frm.method = "POST";
	frm.action = "showWelcome.form";
	frm.submit();
}

function showViewForm(strAction, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index;
	frm.target ="";
	if ("AUTH" == strAction)
		frm.action = "viewAuthUser.form";
	else
		frm.action = "viewUser.form";
	frm.method = "POST";
	frm.submit();
}

function showEditForm(index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index;
	frm.target ="";
	frm.action = "editUser.form";
	frm.method = "POST";
	frm.submit();
}

function showHistory(strAction, index)
{
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	var strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=400,height=300";

	var frm = document.forms["frmMain"];
	document.getElementById("current_index").value = index;
	if ("AUTH" == strAction)
		frm.action = "showAuthHistoryUser.hist";
	else
		frm.action = "showHistoryUser.hist";
	frm.target = "hWinHistory";
	frm.method = "POST";
	window.open ("", "hWinHistory", strAttr);
	frm.submit();
	frm.target = "";
}

function acceptRecord(ctrl, index)
{
	var frm = document.forms["frmMain"]; 
	ctrl.className = "linkbox acceptedlink";
	document.getElementById("current_index").value = index;
	frm.target ="";
	frm.action = "acceptUser.form";
	frm.method = 'POST';
	frm.submit();
}

function rejectRecord(arrData, strRemarks)
{
	var frm = document.forms["frmMain"];

	if (strRemarks.length > 255)
	{
		alert(locMessages.ERR_REMARKS);	
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;
		frm.current_index.value = arrData[0];
		frm.target = "";
		frm.action = "rejectUser.form";
		frm.method = 'POST';
		frm.submit();
	}
}


// Enable, Disable, Undo requests
function enableRecord(ctrl, index)
{
	var frm = document.forms["frmMain"]; 
	ctrl.className = "linkbox enablelink_grey";
	document.getElementById("current_index").value = index;
	frm.target ="";
	frm.action = "enableUser.form";
	frm.method = "POST";
	frm.submit();
}

function disableRecord(ctrl, index)
{
	var frm = document.forms["frmMain"]; 
	ctrl.className = "linkbox disablelink_grey";
	document.getElementById("current_index").value = index;
	frm.target ="";
	frm.action = "disableUser.form";
	frm.method = "POST";
	frm.submit();
}


function undoRecord(arrData)
{
	var frm = document.forms["frmMain"];
	frm.current_index.value = arrData[1];
	frm.action = arrData[0];
	frm.method = "POST";
	frm.target = "";	
	frm.submit();
}

function deleteRecord(arrData)
{
	var frm = document.forms["frmMain"];
	frm.current_index.value = arrData[1];
	frm.action = arrData[0];
	frm.method = "POST";
	frm.target = "";	
	frm.submit();
}

function filter(strAction)
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	if ("AUTH" == strAction)
		frm.action = "userAuthList.form";
	else
		frm.action = "userList.form"
	frm.method = "POST";
	frm.submit();
}

function goToPage(strAction, frmId) {
	var frm = document.getElementById(frmId);
	if ("AUTH" == strAction)
		frm.action = "userAuthList.form";
	else
		frm.action = "userList.form";	
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function filterData(strUrl, frmId) {
	var frm = document.getElementById(frmId);
	frm.action = strUrl;	
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
