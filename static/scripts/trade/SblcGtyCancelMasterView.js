function showLCDetails(frmId)
{
	var frm = document.getElementById(frmId);
	var type = document.getElementById('type').value;
	if(type == "SBLC")
	{	
		frm.action = "viewImportStandbyLcCancellationDetails.form";
	}
	if(type == "GTY")
	{	
		frm.action = "viewImportGuaranteeCancellationDetails.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function showLCDetails2(frmId)
{
	var frm = document.getElementById(frmId);
	var type = document.getElementById('type').value;
	if(type == "SBLC")
	{	
		frm.action = "viewImportStandbyLcCancellation.form";
	}
	if(type == "GTY")
	{	
		frm.action = "viewImportGuaranteeCancellation.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function goBackToSBLCGTYMaster(frmId)
{
	var frm = document.getElementById(frmId);
	var type = document.getElementById('type').value;
	if(type == "SBLC")
	{	
		frm.action = "backToViewImportStandbyLcMstDetails.form";
	}
	if(type == "GTY")
	{	
		frm.action = "backToViewImportGuaranteeMstDetails.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function goBackToCancelCenter(frmId)
{
	var frm = document.getElementById(frmId);
	var type = document.getElementById('type').value;
	if(type == "SBLC")
	{	
		frm.action = "importStandbyLcCancellationCenter.form";
	}
	if(type == "GTY")
	{	
		frm.action = "importGuaranteeCancellationCenter.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function underDevelopement()
{
	alert("Under Development.");
	return;
}
function getSwiftMessagePopUp() 
{
	$('#swiftPopup').dialog({
		autoOpen : false,
		height : 350,
		width : 670,
		modal : true,
		position : [ 'center', 'middle' ],
		buttons : {
			"OK" : function() {
				$(this).dialog("close");
			}
		}		
	});
	$('#swiftPopup').dialog("open");
}