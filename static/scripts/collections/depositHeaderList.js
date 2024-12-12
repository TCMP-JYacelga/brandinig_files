
function showAddNewForm(strUrl)
{
	window.location = strUrl;
}

function showWelcomePage()
{
	window.location = "showWelcome.form";
}

function showViewForm(strAction, index)
{
	var frm = document.forms["frmFilter"]; 
	document.getElementById("current_index").value = index;
	frm.target ="";
	if ("AUTH" == strAction)
		frm.action = "";
	else
		frm.action = "viewDepositHeader.form";
	frm.method = "POST";
	frm.submit();
}

function showEditForm(index)
{
	var frm = document.forms["frmFilter"]; 
	document.getElementById("current_index").value = index;
	frm.target ="";
	frm.action = "editDepositHeader.form";
	frm.method = "POST";
	frm.submit();
}

function acceptRecord(ctrl, index)
{
	var frm = document.forms["frmFilter"]; 
	ctrl.className = "linkbox acceptedlink";
	document.getElementById("current_index").value = index;
	frm.target ="";
	frm.action = "";
	frm.method = 'POST';
	frm.submit();
}

function rejectRecord(arrData, strRemarks)
{
	var frm = document.forms["frmFilter"];

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
		frm.action = "";
		frm.method = 'POST';
		frm.submit();
	}
}

function deleteRecord(ctrl, index)
{
	var frm = document.forms["frmFilter"];
	ctrl.className = "linkbox discardedlink";
	document.getElementById("current_index").value = index;
	frm.target ="";
	frm.action = "deleteDepositHeader.form";
	frm.method = "POST";
	frm.submit();
}

function filter(strAction)
{
	var frm = document.forms["frmFilter"];
	frm.target ="";
	if ("AUTH" == strAction)
		frm.action = "";
	else
		frm.action = "depositHeaderList.form"
	frm.method = "POST";
	frm.submit();
}
