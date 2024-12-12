function addExportLcLoanReqData(frmId)
{
	var frm = document.getElementById(frmId);
	$('.disabled').removeAttr("disabled");	
	frm.action = "saveExportLcLoanRequest.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function setDirtyBit()
{
	document.getElementById("dirtyBit").value = "1";	
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
function goToPage(strUrl, frmId)
{
	if($('#dirtyBit').val()=="1")
	{	
		getConfirmationPopup(frmId, strUrl);
	}	
	else
    {
		var frm = document.getElementById(frmId);
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
    }
}
function getCurrency(frmId)
{
	var frm = document.getElementById(frmId);
	$('.disabled').removeAttr("disabled");
	frm.action = "newLoanRequestFromExportLc.form";
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
function getConfirmationPopup(frmId, strUrl)
{
	$('#confirmPopup').dialog( {
		autoOpen : false,
		height : 200,
		width : 420,
		modal : true,
		buttons : {
				"Yes" : function() {
					var frm = document.getElementById(frmId);
					frm.action = strUrl;
					frm.target = "";
					frm.method = "POST";
					frm.submit();
					},
				"No" : function() {
					$(this).dialog("close");
					}
		}
	});
	$('#confirmPopup').dialog("open");
}