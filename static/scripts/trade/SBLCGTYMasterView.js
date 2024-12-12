function goToBack(frmId)
{
	var frm = document.getElementById(frmId);
	var type = document.getElementById("type").value;
	if(type == "GTY")
	{	
		frm.action = "importGuaranteeCenter.form";
	}
	if(type == "SBLC")
	{	
		frm.action = "importStandbyLcCenter.form";
	}	
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function showSBLCGTYDetails(frmId)
{
	var frm = document.getElementById(frmId);
	var type = document.getElementById("type").value;	
	if(type == "SBLC")
	{	
		frm.action = "viewImportStandbyLc.form";
	}
	if(type == "GTY")
	{	
		frm.action = "viewImportGuarantee.form";
	}		
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function showAmendDetails(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtAmendIndex").value = rowIndex;
	var type = document.getElementById("type").value;
	if(type == "SBLC")
	{	
		frm.action = "viewImpStandbyLcAmendMstDetails.form";
	}
	if(type == "GTY")
	{	
		frm.action = "viewImpGuaranteeAmendMstDetails.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();		
}
function showDetails1(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtIndex").value = rowIndex;
	var type = document.getElementById("type").value;
	if(type == "SBLC")
	{	
		frm.action = "viewImpStandbyLcAmendMstDetailsFromUpdatesList.form";
	}
	if(type == "GTY")
	{	
		frm.action = "viewImpGuaranteeAmendMstDetailsFromUpdatesList.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function showDetails2(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtIndex").value = rowIndex;
	var type = document.getElementById("type").value;
	if(type == "SBLC")
	{	
		frm.action = "viewImpStandbyLcCancelMstDetailsFromUpdatesList.form";
	}
	if(type == "GTY")
	{	
		frm.action = "viewImpGuaranteeCancelMstDetailsFromUpdatesList.form";
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
		height : 170,
		width : 670,
		modal : true,
		position : [ 'center', 'middle' ],
		buttons : {
			"OK" : function() {
				$(this).dialog("close");
			}
		},
		open: function() {           
            $('.ui-dialog-buttonpane').find('button:contains("OK")').find('.ui-button-text').prepend('<span class="fa fa-check-circle">&nbsp;&nbsp</span>');
	}
	});
	$('#swiftPopup').dialog("open");
}