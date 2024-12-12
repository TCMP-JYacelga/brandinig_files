function getAccounts(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "importBillPayment.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function getCurrency(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "importBillPayment.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function goBackToBillView(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "lcBillDetails_view3.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function changeOFRate(ctrl)
{
	if(null == ctrl)
		return;
	if(ctrl.value == "CONTRACT_RATE")
	{
		$('#contractLabel').attr('class','frmLabel required');
		$("#contractRef").removeAttr("disabled");
	}
	else
	{
		$('#contractLabel').attr('class','frmLabel');
		$("#contractRef").attr("disabled","disabled");
	}
}
function goToPage(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function addPaymentEntryData(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "saveImportBillPayment.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function messagePopup() 
{
	$('#messagePopup').dialog( {
		autoOpen : true,
		height : 150,
		width : 350,
		modal : true,
		buttons : {
				"OK" : function() {
					$(this).dialog('close');
				}
		}
	});
	$('#messagePopup').dialog('open');
}