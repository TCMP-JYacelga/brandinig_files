function showLCDetails(frmId,rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;	
	document.getElementById("isLCViewedFromLoan").value = true;
	if('${type}' == 'EXPORT_BILL')
	{
		frm.action = "ExportLCDetails_view2.form";
	}
	else
	{
		frm.action = "viewImportLcMasterDetailsFromLoan.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function LoanToggleAttribute(obj, DoEnable, TagName) 
{    
	//obj = document.getElementById(obj);
	if (isEmpty(obj)) {return;}
	if (DoEnable) 
	{
		var TagValue = obj.getAttribute("back_" + TagName);
		if (TagValue != null) 
		{
			obj.setAttribute(TagName, TagValue);
			obj.removeAttribute("back_" + TagName);
		}
		var cssClass = obj.getAttribute("class");
		cssClass = cssClass.replace(" grey ", " black ");
		obj.setAttribute("class", cssClass);
	}
	else 
	{
		var TagValue = obj.getAttribute(TagName);
		if (TagValue != null)
		{
			obj.setAttribute("back_" + TagName, TagValue);
		}
		obj.removeAttribute(TagName);
		var cssClass = obj.getAttribute("class");
		cssClass = cssClass.replace(" black ", " grey ");
		obj.setAttribute("class", cssClass);
	}
}

function loanEnableDisableSubmitLink()
{
	var objstr = document.getElementById("TEXT").value;
	var obj = eval("(" + objstr + ')');
	var submitValue = obj.canSubmit;
	if (submitValue == true && CAN_EDIT == 'true')
	{
		$('.submit').unbind('click');
		$('.submit').each(function(){
			LoanToggleAttribute(this, true, "href");
		  });
		$('.submit').click(function()
		{
			submitLoan('frmMain');
		});
	}
	else
	{
		$('.submit').each(function(){
			LoanToggleAttribute(this, false, "href");
		  });
		$('.submit').removeAttr('onclick').click(function()
		{});
		$('.submit').unbind('click');
	}	
}

function loanEnableDisableAuthorizeLink(makerId)
{
	var objstr = document.getElementById("TEXT").value;
	var obj = eval("(" + objstr + ')');
	var authorizeValue = obj.canAuthorise;		
	if (authorizeValue == true && makerId!=USER && CAN_AUTH == 'true') 
	{		
		$('.auth').unbind('click');
		$('.auth').each(function(){
			LoanToggleAttribute(this, true, "href");
		  });
		$('.auth').click(function()
		{
			authorizeLoan('frmMain');
		});
	}
	else 
	{
		$('.auth').each(function(){
			LoanToggleAttribute(this, false, "href");
		  });
		$('.auth').removeAttr('onclick').click(function() 
		{
		});
		$('.auth').unbind('click');
	}	
}
function loanEnableDisableSendLink()
{
	var objstr = document.getElementById("TEXT").value;
	var obj = eval("(" + objstr + ')');
	var sendValue = obj.canSend;
	if (sendValue == true && (CAN_AUTH == 'false' || CAN_EDIT == 'true'))
	{
		$('.send').unbind('click');
		$('.send').each(function(){
			LoanToggleAttribute(this, true, "href");
		  });
		$('.send').click(function()
		{
			sendLoan('frmMain');
		});
	}
	else
	{
		$('.send').each(function(){
			LoanToggleAttribute(this, false, "href");
		  });
		$('.send').removeAttr('onclick').click(function()
		{});
		$('.send').unbind('click');
	}	
}
function loanEnableDisableDeleteLink()
{
	var objstr = document.getElementById("TEXT").value;
	var obj = eval("(" + objstr + ')');
	var deleteValue = obj.canDelete;
	if (deleteValue == true && CAN_EDIT == 'true') 
	{
		$('.delete').unbind('click');
		$('.delete').each(function(){
			LoanToggleAttribute(this, true, "href");
		  });
		$('.delete').click(function()
		{
			deleteLoan('frmMain');
		});
	} 
	else
	{
		$('.delete').each(function(){
			LoanToggleAttribute(this, false, "href");
		  });
		$('.delete').removeAttr('onclick').click(function()
		{});
		$('.delete').unbind('click');		
	}	
}
function loanEnableDisableRejectLink(makerId)
{
	var objstr = document.getElementById("TEXT").value;
	var obj = eval("(" + objstr + ')');
	var rejectValue = obj.canReject;
	if (rejectValue == true && makerId!=USER && CAN_AUTH == 'true') 
	{
		$('.reject').unbind('click');
		$('.reject').each(function(){
			LoanToggleAttribute(this, true, "href");
		  });
		$('.reject').click(function()
		{
			getLoanRejectPopup('frmMain');
		});
	} 
	else
	{
		$('.reject').each(function(){
			LoanToggleAttribute(this, false, "href");
		  });
		$('.reject').removeAttr('onclick').click(function()
		{});
		$('.reject').unbind('click');
	}	
}
function loanEnableDisableRepayLink(makerId)
{
	var objstr = document.getElementById("TEXT").value;
	var obj = eval("(" + objstr + ')');
	var repayValue = obj.canRepay;
	if (repayValue == true  && CAN_EDIT == 'true') 
	{
		$('.rePay').unbind('click');
		$('.rePay').each(function(){
			LoanToggleAttribute(this, true, "href");
		  });
		$('.rePay').click(function()
		{
			repayLoan('frmMain');
		});
	} 
	else
	{
		$('.rePay').each(function(){
			LoanToggleAttribute(this, false, "href");
		  });
		$('.rePay').removeAttr('onclick').click(function()
		{});
		$('.rePay').unbind('click');
	}	
}
function rejectLoan(frmId) 
{
	frm = document.getElementById(frmId);
	document.getElementById("txtLoanRejectReason").value = $('#txtAreaRejectRemark').val();	
	document.getElementById("hiddenLoanRef").value = 1;
	var type = document.getElementById('type').value;
	if(type == 'IMPORT_LOAN')
	{
		frm.action = "rejectViewedImportLoan.form";
	}
	else if(type == 'EXPORT_LOAN')
	{
		frm.action = "rejectViewedExportLoan.form";
	}
	else if(type == 'EXPORT_BILL')
	{
		frm.action = "rejectViewedExportBillLoan.form";
	}
	else
	{
		frm.action = "rejectViewedImportBillLoan.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function deleteLoan(frmId) 
{	
	frm = document.getElementById(frmId);
	document.getElementById("hiddenLoanRef").value = 1;
	var type = document.getElementById('type').value;
	if(type == 'IMPORT_LOAN')
	{
		frm.action = "deleteViewedImportLoan.form";
	}
	else if(type == 'EXPORT_LOAN')
	{
		frm.action = "deleteViewedExportLoan.form";
	}
	else if(type == 'EXPORT_BILL')
	{
		frm.action = "deleteViewedExportBillLoan.form";
	}
	else
	{
		frm.action = "deleteViewedImportBillLoan.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function sendLoan(frmId) 
{	
	frm = document.getElementById(frmId);
	document.getElementById("hiddenLoanRef").value = 1;
	var type = document.getElementById('type').value;
	if(type == 'IMPORT_LOAN')
	{
		frm.action = "sendViewedImportLoan.form";
	}
	else if(type == 'EXPORT_LOAN')
	{
		frm.action = "sendViewedExportLoan.form";
	}
	else if(type == 'EXPORT_BILL')
	{
		frm.action = "sendViewedExportBillLoan.form";
	}
	else
	{
		frm.action = "sendViewedImportBillLoan.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function repayLoan(frmId) 
{	
	frm = document.getElementById(frmId);
	document.getElementById("hiddenLoanRef").value = 1;
	var type = document.getElementById('type').value;
	if(type == 'IMPORT_LOAN')
	{
		frm.action = "importLoanRepayment.form";
	}
	else if(type == 'EXPORT_LOAN')
	{
		frm.action = "exportLoanRepayment.form";
	}
	else if(type == 'EXPORT_BILL')
	{
		frm.action = "exportBillLoanRepayment.form";
	}
	else
	{
		frm.action = "importBillLoanRepayment.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function getLoanRejectPopup(frmId) 
{
	$('#rejectPopup').dialog( {
		autoOpen : false,
		height : 240,
		width : 420,
		modal : true,
		buttons : {
			"OK" : function() 
			{
				rejectLoan(frmId);
			},
			"Cancel" : function() 
			{
				$(this).dialog("close");
			}
		}
	});
	$('#rejectPopup').dialog("open");
}
function authorizeLoan(frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("hiddenLoanRef").value = 1;
	var type = document.getElementById('type').value;
	if(type == 'IMPORT_LOAN')
	{
		frm.action = "authorizeViewedImportLoan.form";
	}
	else if(type == 'EXPORT_LOAN')
	{
		frm.action = "authorizeViewedExportLoan.form";
	}
	else if(type == 'EXPORT_BILL')
	{
		frm.action = "authorizeViewedExportBillLoan.form";
	}
	else
	{
		frm.action = "authorizeViewedImportBillLoan.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function submitLoan(frmId) 
{	
	frm = document.getElementById(frmId);
	document.getElementById("hiddenLoanRef").value = 1;
	var type = document.getElementById('type').value;
	if(type == 'IMPORT_LOAN')
	{
		frm.action = "submitViewedImportLoan.form";
	}
	else
	{
		frm.action = "submitViewedExportLoan.form";
	}

	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showErrorPopup() {
	$('#errorsPopup').dialog( {
		autoOpen : true,
		height : 220,
		width : 473,
		modal : true,
		buttons : {
				"OK" : function() {
					$(this).dialog('close');
					
				}
		}
	});
	$('#errorsPopup').dialog('open');
}