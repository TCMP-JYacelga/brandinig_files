function goBackToAmendCenter(frmId)
{
	var frm = document.getElementById(frmId);
	var type = document.getElementById("type").value;
	if(type == "SBLC")
	{	
		frm.action = "importStandbyLcAmendmentCenter.form";
	}
	if(type == "GTY")
	{	
		frm.action = "importGuaranteeAmendmentCenter.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function showAmendDetails(frmId)
{
	var frm = document.getElementById(frmId);
	var type = document.getElementById("type").value;
	if(type == "SBLC")
	{	
		frm.action = "viewImportStandbyLcAmendmentDetails.form";
	}
	if(type == "GTY")
	{	
		frm.action = "viewImportGuaranteeAmendmentDetails.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function showAmendDetails2(frmId)
{
	var frm = document.getElementById(frmId);
	var type = document.getElementById("type").value;
	if(type == "SBLC")
	{	
		frm.action = "viewImportStandbyLcAmendment.form";
	}
	if(type == "GTY")
	{	
		frm.action = "viewImportGuaranteeAmendment.form";
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