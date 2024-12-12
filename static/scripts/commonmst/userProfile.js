
function showAddNewForm(actionmode)
{
	var frm = document.forms["frmMain"]; 
	frm.method = "POST";
	
	if ("CategoryMode" == actionmode)
	{
		frm.action = "addUserProfile_Category.form";
	}
	else if("ClientMode" == actionmode)
	{
		frm.action = "addUserProfile_Client.form";
	}
	else if("AccountMode" == actionmode)
	{
		frm.action = "addUserProfile_Account.form";
	}
	else
	{
		frm.action = "addUserProfile_Product.form";
	}
	frm.submit();
}

function showWelcomePage()
{
	var frm = document.forms["frmMain"]; 
	frm.method = "POST";
	frm.action = "showWelcome.form";
	frm.submit();
}

function showViewForm(strAction, index, actionmode)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index-1;
	frm.target ="";
	if ("AUTH" == strAction)
		{
		frm.action = "viewAuthUser.form";		
		}
	else 
		{
		if ("CategoryMode" == actionmode)
			{
			frm.action = "viewUser_Category.form";
			}
		else if("ClientMode" == actionmode)
			{
			frm.action = "viewUser_Client.form";
			}
		else if("AccountMode" == actionmode)
			{
			frm.action = "viewUser_Account.form";
			}
		else
		{
			frm.action = "viewUser_Product.form";
		}
		}
	frm.method = "POST";
	frm.submit();
}

function showEditForm(index,actionmode)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index-1;
	frm.target ="";
	
	if ("CategoryMode" == actionmode)
			{
			frm.action = "editUser_Category.form";
			}
		else if("ClientMode" == actionmode)
			{
			frm.action = "editUser_Client.form";
			}
		else if("AccountMode" == actionmode)
			{
			frm.action = "editUser_Account.form";
			}
		else
		{
			frm.action = "editUser_Product.form";
		}
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
	document.getElementById("current_index").value = index-1;
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
	document.getElementById("current_index").value = index-1;
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
function enableRecord(ctrl, index,actionmode)
{
	var frm = document.forms["frmMain"]; 
	ctrl.className = "linkbox enablelink_grey";
	document.getElementById("current_index").value = index-1;
	frm.target ="";
	
	if ("CategoryMode" == actionmode)
	{
	frm.action = "enableUserProfile_category.form";
	}
	else if("ClientMode" == actionmode)
	{
	frm.action = "enableUserProfile_client.form";
	}
	else if("AccountMode" == actionmode)
	{
	frm.action = "enableUserProfile_account.form";
	}
	else
	{
	frm.action = "enableUserProfile_product.form";
	}

	frm.method = "POST";
	frm.submit();
}

function disableRecord(ctrl, index,actionmode)
{
	var frm = document.forms["frmMain"]; 
	ctrl.className = "linkbox disablelink_grey";
	document.getElementById("current_index").value = index-1;
	frm.target ="";
	
	if ("CategoryMode" == actionmode)
	{
	frm.action = "disableUserProfile_category.form";
	}
	else if("ClientMode" == actionmode)
	{
	frm.action = "disableUserProfile_client.form";
	}
	else if("AccountMode" == actionmode)
	{
	frm.action = "disableUserProfile_account.form";
	}
	else
	{
	frm.action = "disableUserProfile_product.form";
	}

	frm.method = "POST";
	frm.submit();
}


function undoRecord(arrData)
{
	var frm = document.forms["frmMain"];
	frm.current_index.value = arrData[1]-1;
	 
	if ("CategoryMode" == arrData[2])
	{
	frm.action = "undoUserProfile_category.form";
	}
	else if("ClientMode" == arrData[2])
	{
	frm.action = "undoUserProfile_client.form";
	}
	else if("AccountMode" == arrData[2])
	{
	frm.action = "undoUserProfile_account.form";
	}
	else
	{
	frm.action = "undoUserProfile_product.form";
	}
	frm.method = "POST";
	frm.target = "";	
	frm.submit();
}

function deleteRecord(arrData)
{
	var frm = document.forms["frmMain"];
	frm.current_index.value = arrData[1]-1;
	 
	if ("CategoryMode" == arrData[2])
	{
	frm.action = "deleteUserProfile_category.form";
	}
	else if("ClientMode" == arrData[2])
	{
	frm.action = "deleteUserProfile_client.form";
	}
	else if("AccountMode" == arrData[2])
	{
	frm.action = "deleteUserProfile_account.form";
	}
	else
	{
	frm.action = "deleteUserProfile_product.form";
	}

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

function goToPage(strUrl, frmId) {
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}