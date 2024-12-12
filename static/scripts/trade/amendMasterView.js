function showLCDetails(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "viewImportLc.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function showAmendDetails(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "viewImportLcAmendmentDetails.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function showAmendDetails2(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "viewImportLcAmendment.form";
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
function goBackToAmendCenter(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "importLcAmendmentCenter.form";
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