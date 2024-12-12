function authorizeViewedLoan(frmId)
{
	frm = document.getElementById(frmId);
	frm.action = "authViewedLoanEntry.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function getLoanViewRejectPopup(frmId) 
{
	$('#rejectPopup').dialog( {
		autoOpen : false,
		height : 240,
		width : 420,
		modal : true,
		buttons : {
			"Ok" : function() 
			{
				rejectViewedLoan(frmId);
			},
			"Cancel" : function() 
			{
				$(this).dialog("close");
			}
		}
	});
	$('#rejectPopup').dialog("open");
}
function rejectViewedLoan(frmId) 
{
	frm = document.getElementById(frmId);
	document.getElementById("txtLoanRejectReason").value = $('#txtAreaRejectRemark').val();		
	frm.action = "rejectViewedLoanEntry.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function sendViewedLoan(frmId) 
{	
	frm = document.getElementById(frmId);
	frm.action = "sendViewedLoanEntry.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function repayViewedLoan(frmId) 
{	
	frm = document.getElementById(frmId);
	document.getElementById("isLoanViewFlag").value = true;
	frm.action = "repayViewedImportBillLoan.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}