function setDirtyBit()
{
	dityBitSet=true;
}

function createFormField(element, type, name, value) {
	var inputField;
	inputField = document.createElement(element);
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}

function getCancelConfirmPopUp(strUrl) {
	var buttonsOpts = {};
	buttonsOpts[btnsArray['okBtn']] = function() {
		$(this).dialog("close");
		gotoPage(strUrl);
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		$(this).dialog("close");
	};
	if(dityBitSet)
	{
	$('#confirmMsgPopup').dialog({
				autoOpen : false,
				height : 150,
				width : 430,
				modal : true,
				buttons : buttonsOpts
			});
	$('#confirmMsgPopup').dialog("open");
	}
	else
	{
		gotoPage(strUrl);
	}
}

function saveProfile(strUrl)
{
	$("#lowerWarnLimitAmt").val($("#lowerWarnLimitAmt").autoNumeric('get')); 
	$("#higherWarnLimitAmt").val($("#higherWarnLimitAmt").autoNumeric('get')); 
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	$("input").removeAttr('disabled');
	frm.target = "";
	frm.appendChild(createFormField('INPUT', 'HIDDEN',csrfTokenName, csrfTokenValue)); 
	frm.method = "POST";
	frm.submit();	
}

function gotoPage(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function showList(strUrl)
{
	if (frmName == "Entry")
			strUrl = "lmsAccountList.form";
	else if(frmName=="View")
	{
		if(mode == "AUTH_VIEW" )
				strUrl = "lmsAccountAuthList.form";
		else
				strUrl = "lmsAccountList.form";
	}
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
	if ("AUTH" == strAction)
		frm.action = "lmsAccountAuthHistory.hist";
	else
		frm.action = "lmsAccountHistory.hist";
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open ("", "hWinHistory", strAttr);
	frm.submit();
}

function showViewForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	if(mode == "AUTH")
	{
			strUrl = "authViewLmsAccount.form";
	}
	else
	{
			strUrl ="viewLmsAccount.form";
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showEditForm(strUrl, index)
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
		frm.action = "rejectLmsAccount.form";
		frm.method = "POST";
		frm.submit();
	}
}
function discardRecord(arrData)
{
	var strUrl;
	var frm = document.forms["frmMain"]; 
	strUrl = arrData[0];
	frm.txtIndex.value = arrData[1];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function filter(mode,type)
{
	var strUrl = null; 
	var frm = document.forms["frmMain"];
	frm.target ="";
	if(mode == "AUTH" || mode == "ACCEPT" || mode == "REJECT"|| mode =="AUTH_FILTER")
		strUrl = "lmsAccountAuthFilterList.form";
	else
		strUrl ="lmsAccountFilterList.form";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function update(strUrl)
{
	var frm = document.forms["frmMain"];	
	frm.target = "";
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
function getRecord(json,elementId)
{	
	var myJSONObject = JSON.parse(json);
    var inputIdArray = elementId.split("|");
    for (i=0; i < inputIdArray.length; i++)
	{
    	if (document.getElementById(inputIdArray[i]) && myJSONObject.columns[i])
    	{
			if (null == myJSONObject.columns[i].value)
				myJSONObject.columns[i].value = "";
    		var type = document.getElementById(inputIdArray[i]).type;
    		if (type == 'text')
    			document.getElementById(inputIdArray[i]).value = myJSONObject.columns[i].value;
    		else
    			document.getElementById(inputIdArray[i]).innerHTML = myJSONObject.columns[i].value; 
    	}
	}    
}
function enableDisableRecAmnt()
{
	if (document.getElementById("dailyRecptLimitFlag1").checked)
	{
		document.getElementById("dailyRecptLimitFlag1").value = "Y";
		document.getElementById("receiptAmnt").disabled = false;
	}
	else
	{
		document.getElementById("dailyRecptLimitFlag1").value = "N";
		document.getElementById("receiptAmnt").value = "0.00";
		document.getElementById("receiptAmnt").disabled = true;
	}
}
function enableDisablePayAmnt()
{
	if (document.getElementById("dailyPayLimitFlag1").checked)
	{
		document.getElementById("dailyPayLimitFlag1").value = "Y";
		document.getElementById("payoutAmnt").disabled = false;
	}
	else
	{
		document.getElementById("dailyPayLimitFlag1").value = "N";
		document.getElementById("payoutAmnt").value = "0.00";
		document.getElementById("payoutAmnt").disabled = true;
	}
}

function submitForm(strUrl)
{
	$("#lowerWarnLimitAmt").val($("#lowerWarnLimitAmt").autoNumeric('get')); 
	$("#higherWarnLimitAmt").val($("#higherWarnLimitAmt").autoNumeric('get'));
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.appendChild(createFormField('INPUT', 'HIDDEN',csrfTokenName, csrfTokenValue)); 
	frm.method = "POST";
	frm.target = "";
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