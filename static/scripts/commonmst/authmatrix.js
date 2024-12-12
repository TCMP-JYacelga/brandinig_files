function showList(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();		
}

function showAddNewForm(strUrl)
{
	var strUrl = null;
	if(null != document.getElementById("cboAxmType") && document.getElementById("cboAxmType").value ==1)
			strUrl = 'addSignatoryMatrix.form';
	else
		strUrl = "addAuthMatrix.form";
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
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
	if ("AUTH" == strAction || "AUTH_SIG" == strAction)
		frm.action = "authMatrixAuthHistory.hist";
	else
		frm.action = "authMatrixHistory.hist";
	frm.target = "hWinHistory";
	frm.method = "POST";
	window.open ("", "hWinHistory", strAttr);
	frm.submit();
}

function showViewForm(mode, index)
{
	var frm = document.forms["frmMain"]; 
	var strUrl = null;
	document.getElementById("txtIndex").value = index;
	frm.target ="";
	if(null != document.getElementById("cboAxmType") && document.getElementById("cboAxmType").value ==1)
	{
		if(mode == "AUTH")
			strUrl = "authViewSignatoryMatrix.form";
		else 
			strUrl = "viewSignatoryMatrix.form";	
	}
	else
	{
		if(mode == "AUTH")
			strUrl = "authViewAuthMatrix.form";
		else 
			strUrl = "viewAuthMatrix.form";	
	}
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function showViewDetailForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	if(mode=="AUTH_VIEW")
		frm.action = "authViewAuthMatrixDetail.form";
	else
		frm.action = strUrl;
	frm.action = strUrl;
	frm.target ="";
	frm.method = "POST";
	frm.submit();
}

function showEditForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	if(null != document.getElementById("cboAxmType") && document.getElementById("cboAxmType").value ==1)
		strUrl="editSignatoryMatrix.form";
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
	if(null != document.getElementById("cboAxmType") && document.getElementById("cboAxmType").value ==1)
		frm.action = "enableSignatoryMatrix.form";
	else
		frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

// Enable, Disable, Accept and Reject requests
function deleteRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function disableRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	if(null != document.getElementById("cboAxmType") && document.getElementById("cboAxmType").value ==1)
		frm.action = "disableSignaotoryMatrix.form";
	else
		frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function acceptRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	if(null != document.getElementById("cboAxmType") && document.getElementById("cboAxmType").value ==1)
		frm.action = "acceptSignatoryMatrix.form";
	else
		frm.action = strUrl;
	frm.target = "";
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
		if(null != document.getElementById("cboAxmType") && document.getElementById("cboAxmType").value ==1)
			frm.action = "rejectSignatoryMatrix.form";
		else
			frm.action = "rejectAuthMatrix.form";
		frm.method = "POST";
		frm.submit();
	}
}

// Details
function deleteDetail(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function viewDetailForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function editDetailForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showAddDetail(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
}
function showBackDetail(strUrl)
{
	var frm = document.forms["frmMain"];
	
	if (document.getElementById("axmPrdoracc")!= null)
		document.getElementById("axmPrdoracc").value = "" ;
	if (strUrl != 'approvalMatrixList.form') {
		if (formName == "SigView" || formName == "SigEntry")
		{
			if (mode == "AUTH_VIEW" )
				strUrl = "authSignatoryMatrixList.form";
			else
				strUrl ="signatoryMatrixList.form";
		}
		else
		{
			if (mode == "AUTH_VIEW" )
				strUrl = "authAuthMatrixList.form";
			else
				strUrl ="authMatrixList.form";
		}
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function filter(mode,type)
{
	var strUrl = null; 
	var frm = document.forms["frmMain"];
	frm.txtFilter.value=type
	frm.target ="";
	if(null != document.getElementById("cboAxmType") && document.getElementById("cboAxmType").value ==1)
	{
		if(mode == "AUTH" || mode == "ACCEPT" ||mode == "REJECT")
			strUrl = "authSignatoryMatrixList.form";
		else
			strUrl ="signatoryMatrixList.form";
	}
	else
	{
	if(mode == "AUTH" || mode == "ACCEPT" ||mode == "REJECT")
		strUrl = "authAuthMatrixList.form";
	else
		strUrl ="authMatrixList.form";
	}
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function getAccountType()
{
	var frm = document.forms["frmMain"]; 
	var axmMyproduct = document.getElementById("axmMyproduct").value;
	if (document.getElementById("txtRule"))
		document.getElementById("txtRule").value="";
	if (document.getElementById("axmRule"))
		document.getElementById("axmRule").value="";
	if (axmMyproduct != "SELECT")
	{
		if(document.getElementById("axmType").value==1)
			frm.action = "signatoryAccType.form";
		else
			frm.action = "accountType.form";
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}	
}

function discardRecord(arrData)
{
	var frm = document.forms["frmMain"];
	strUrl = arrData[0];
	if(null != document.getElementById("cboAxmType") && document.getElementById("cboAxmType").value ==1)
		frm.action = "undoSignatoryMatrix.form";
	else
		frm.action = strUrl;
	frm.txtIndex.value = arrData[1];
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";	
	frm.submit();
}
function Save()
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = actionUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	return true;
}

function checkKey()
{
   if(window.event.keyCode == 13)
   {
   		var totalpage = document.getElementById("total_pages").value;
   		goPgNmbr(mode,totalpage);
   }
}

function submitForm(strUrl, authorsign)
{
	var titleMessage = "";
	if (authorsign == "AUTH")
		titleMessage = "Auth Matrix Entry";
	else
		titleMessage = "Signatory Matrix Entry";
		
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
	/*var axmMyproduct = document.getElementById("axmMyproduct").value;
	if (axmMyproduct != "SELECT")
	{
		frm.action = strUrl;
		frm.method = "POST";
		frm.target = "";
		frm.submit();
	}
	else
	{
		$('#AuthMatrixMsgDialog').dialog( {autoOpen: false, width : 300,title : titleMessage, modal : true});
		$('#AuthMatrixMsgDialog').dialog('open');
	}	*/
}

function submitMainForm(requestState, strUrl, authorsign)
{
	if(requestState!=="3" && requestState!=="1"){
		submitForm(strUrl, authorsign);
		return;
	}
	var buttonsOpts = {};
	buttonsOpts[btnsArray['okBtn']] = function() {
		submitForm(strUrl, authorsign);
		$(this).dialog("close");
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		$(this).dialog("close");
	};
	$('#AuthMatrixMsgDialog').dialog({
				autoOpen : true,
				height : 230,
				width : 430,
				modal : true,
				buttons : buttonsOpts
			});
	$('#AuthMatrixMsgDialog').dialog("open");
}

/* This Function Modify the JSON value if it modify on entry screen
*/
function modifyJSONValue(filterSourceValue, newValueTobeModify, objFilterJSON, jsonPropertyName)
{
	if(!isEmpty(filterSourceValue) && !isEmpty(newValueTobeModify) && filterSourceValue != newValueTobeModify){
		objFilterJSON[jsonPropertyName] = newValueTobeModify;
	}
}

function isEmpty(strValue)
{
	
	if(strValue == null || strValue == undefined || strValue.length == 0)
		return true;
		
	return false;
}

function closeAuthMatrixMsg(){
	$('#AuthMatrixMsgDialog').dialog('close');
}
