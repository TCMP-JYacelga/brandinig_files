function showLCDetails(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "viewImportLcCancellation.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function showLCDetails2(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "viewImportLcCancellationDetails.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function goBackToLCMaster(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "backToImportLcMasterDetails.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function goBackToCancelCenter(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "importLcCancellationCenter.form";
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
		width : 580,
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