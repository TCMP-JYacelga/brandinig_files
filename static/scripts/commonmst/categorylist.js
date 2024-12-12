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
		frm.action = "showAuthHistoryUserCategory.hist";
	else
		frm.action = "showHistoryUserCategory.hist";
		
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open ("", "hWinHistory", strAttr);
	frm.submit();
}

function showCategory(index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index;
	frm.target ="";
	frm.action = "viewUserCategory.form";
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


function acceptRecord(ctrl, index)
{
	var frm = document.forms["frmMain"]; 
	ctrl.className = "linkbox acceptedlink";
	document.getElementById("current_index").value = index;
	frm.target ="";
	frm.action = "acceptUserCategory.form";
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
		frm.action = "rejectUserCategory.form";
		frm.method = 'POST';
		frm.submit();
	}
}

function newCategoryForm(strUrl)
{
	var frm = document.forms["frmMain"]; 
	frm.method = "POST";
	frm.action = strUrl;
	frm.submit();
}

function showWelcomePage()
{
	var frm = document.forms["frmMain"]; 
	frm.target ="";
	frm.action = "showWelcome.form";
	frm.method = 'POST';
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

function showEditForm(index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index;
	frm.target ="";
	frm.action = "editUserCategory.form";
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
function enableRecord(ctrl, index)
{
	var frm = document.forms["frmMain"]; 
	ctrl.className = "linkbox disablelink_grey";
	document.getElementById("current_index").value = index;
	frm.target ="";
	frm.action = "enableUserCategory.form";
	frm.method = "POST";
	frm.submit();
}

function disableRecord(ctrl, index)
{
	var frm = document.forms["frmMain"]; 
	ctrl.className = "linkbox enablelink_grey";
	document.getElementById("current_index").value = index;
	frm.target ="";
	frm.action = "disableUserCategory.form";
	frm.method = "POST";
	frm.submit();
}

function showViewForm(strAction, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index;
	frm.target ="";
	if ("AUTH" == strAction || "AUTHFILTER" == strAction || "REJECT" == strAction || "ACCEPT" ==strAction )
		frm.action = "viewAuthUserCategory.form";
	else
		frm.action = "viewUserCategory.form";
	frm.method = "POST";
	frm.submit();
}
function showClonePopup(index)
{
	var buttonsOpts = {};
	buttonsOpts[btns['saveBtn']]=function() {
		var catCode = document.getElementById("cpCategoryCode").value;
		var catDesc = document.getElementById("cpCategoryDesc").value;
		if ('' != catCode && '' != catDesc)
		{
			var errDiv = document.getElementById('errDiv');
			if(null!= errDiv && errDiv.childNodes[0] != null)
				{
					errDiv.removeChild(errDiv.childNodes[0]);
				}
			$(this).dialog("close");
			cloneRecord(index,catCode,catDesc);
		}
		else
		{
			var msg1 = '';
			var msg2= '';
			if ('' == catCode)
			{
				msg1 = locMessages.ERR_CATEGORYCODE;
			}
			if ('' == catDesc)
			{
				msg2 = locMessages.ERR_CATEGORYDESC;
			}
			
			var newdiv = document.createElement('div');
			var errorMsg = "<div id='messageArea' class='errors'><span>"+locMessages.ERROR+"</span><ul>";
			if ('' != msg1)
				errorMsg = errorMsg +  "<li>" + msg1 + "</li>";
			if ('' != msg2)
				errorMsg = errorMsg +  "<li>" + msg2 + "</li>";
			
			errorMsg = errorMsg +  "</ul></div>";
			newdiv.innerHTML = errorMsg;
			var errDiv = document.getElementById('errDiv');
			if(null!= errDiv && errDiv.childNodes[0] != null)
				{
					errDiv.removeChild(errDiv.childNodes[0]);
				}
			errDiv.appendChild(newdiv);
					    return;
		}
		
	};
	buttonsOpts[btns['cancelBtn']]=function() {
		$('#clonePopupForm').each (function(){
				this.reset();
		});
		var errDiv = document.getElementById('errDiv');
		if(null!= errDiv && errDiv.childNodes[0] != null)
			{
				errDiv.removeChild(errDiv.childNodes[0]);
			}
		$(this).dialog("close");
	};
	$('#clonePopup').dialog({
		autoOpen : false,
		height : 250,
		width : 570,
		modal : true,
		buttons : buttonsOpts,
		close : function (){
			$('#clonePopupForm').each (function(){
				this.reset();
		});
			var errDiv = document.getElementById('errDiv');
			if(null!= errDiv && errDiv.childNodes[0] != null)
				{
					errDiv.removeChild(errDiv.childNodes[0]);
				}
		}
		});
		$('#clonePopup').dialog("open");
}
function cloneRecord(index,code,desc)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index;
	document.getElementById("cloneCategoryCode").value = code;
	document.getElementById("cloneCategoryDesc").value = desc;
	frm.target ="";
	frm.action = "cloneUserCategory.form";
	frm.method = "POST";
	frm.submit();
}