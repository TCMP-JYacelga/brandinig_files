function showNewReceiptForm(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function saveReceipt(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function goToBack(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function setDirtyBit() {
	document.getElementById("dirtyBit").value = "1";
}

function getReceiptEntryBuyerSellerRecord(json,code,elementId,codeElementId,misDrawerCode,counterPartyClientCode)
{		  
    document.getElementById(elementId).value=json; 
	document.getElementById(codeElementId).value=code;
	document.getElementById("misDrawerCode").value=misDrawerCode;
	document.getElementById("loginMode").value=clientMode;
	if(isEmpty(counterPartyClientCode))
	{
		$('#dealerVendorDtls').hide();
	}
	else
	{
		goToEntryPage('receiptEntry.form', 'frmMain');
		$('#dealerVendorDtls').show();
	}
}

function goToEntryPage(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}