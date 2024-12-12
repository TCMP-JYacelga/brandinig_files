function goToBack(frmId)
{
	var frm = document.getElementById(frmId);
	var type = document.getElementById("type").value;
	if(type == 'SBLC')
	{
		frm.action = "exportLcCenter.form";
	}	
	if(type == 'GTY')
	{
		frm.action = "exportGuaranteeCenter.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showSBLCGTYDetails(frmId)
{
	var frm = document.getElementById(frmId);
	var type = document.getElementById("type").value;
	if(type == 'SBLC')
	{
		frm.action = "exportSBLCDetails_view.form";
	}
	if(type == 'GTY')
	{
		frm.action = "exportGTYDetails_view.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function showSBLCGTYDetails1(frmId)
{
	var frm = document.getElementById(frmId);
	var type = document.getElementById("type").value;
	if(type == 'SBLC')
	{
		frm.action = "viewExportStandbyLc.form";
	}
	if(type == 'GTY')
	{
		frm.action = "viewExportGuarantee.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function viewSBLCGTYDetails(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtIndex").value = rowIndex;
	var type = document.getElementById("type").value;
	if(type == 'SBLC')
	{
		frm.action = "viewExportStandbyLcFromUpdatesList.form";
	}
	if(type == 'GTY')
	{
		frm.action = "viewExportGuaranteeFromUpdatesList.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function viewSBLCGTYAmendDetails(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtIndex").value = rowIndex;
	var type = document.getElementById("type").value;
	if(type == 'SBLC')
	{
		frm.action = "viewExpStandbyLcAmendmentMstDetails.form";
	}
	if(type == 'GTY')
	{
		frm.action = "viewExpGuaranteeAmendmentMstDetails.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function viewSBLCGTYCancelDetails(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtIndex").value = rowIndex;
	var type = document.getElementById("type").value;
	if(type == 'SBLC')
	{
		frm.action = "viewExpStandbyLcCancellationMstDetails.form";
	}
	if(type == 'GTY')
	{
		frm.action = "viewExpGuaranteeCancellationMstDetails.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function getSwiftMessagePopUp() 
{
	$('#swiftPopup').dialog({
		autoOpen : false,
		height : 530,
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
function goBackToMaster(frmId)
{
	var frm = document.getElementById(frmId);
	var type = document.getElementById("type").value;
	if(type == 'SBLC')
	{
		frm.action = "viewExportStandbyLcMasterDetails.form";
	}	
	if(type == 'GTY')
	{
		frm.action = "viewExportGuaranteeMasterDetails.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}