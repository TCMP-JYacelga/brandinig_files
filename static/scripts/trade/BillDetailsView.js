function goBackToBillCenter(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "importBillCenter.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function showExportLoanRequestForm(frmId)
{
	var frm = document.getElementById(frmId);
	document.getElementById("isBillViewFlag").value = true;
	frm.action = "newLoanRequestFromExportBill.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function goBackToExportBillCenter(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "exportBillCenter.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function goBackToLCMasterView(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "backToViewImpLcMstDetailsFromBill.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function goBackToExpLCMasterView(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "backToViewExpLcMstDetailsFromBill.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function showLCDetails(frmId)
{
	var frm = document.getElementById(frmId);
	document.getElementById("isLCViewedFromBill").value = true;
	frm.action = "viewImportLcMasterDetailsFromBill.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function showExportLCDetails(frmId)
{
	var frm = document.getElementById(frmId);
	document.getElementById("isLCViewedFromBill").value = true;
	frm.action = "viewExportLcMasterDetailsFromBill.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function showBillViewAcceptPopUp(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "acceptanceOfViewedImportBill.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showBillViewReturnPopUp(frmId)
{
	frm = document.getElementById(frmId);
	frm.action = "returnOfViewedImportBill.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function getBillViewAcceptPopUp(frmId) 
{
	$('#acceptImportBillPopup').dialog({
		autoOpen : false,
		height : 300,
		width : 600,
		modal : true,
		buttons : {
			"Save" : function() {
					$(this).dialog("close");
					acceptViewedBill(frmId);
			},
			"Cancel" : function() {
					$('#acceptReturnForm').each (function(){
							this.reset();
							
					});
					$(this).dialog("close");
			}
		}
	});
	$('#acceptImportBillPopup').dialog("open");
}
function getBillViewRejectPopup(frmId) 
{
	$('#rejectPopup').dialog( {
		autoOpen : false,
		height : 240,
		width : 420,
		modal : true,
		buttons : {
			"OK" : function() 
			{
				rejectViewedBill(frmId);
			},
			"Cancel" : function() 
			{
				$(this).dialog("close");
			}
		}
	});
	$('#rejectPopup').dialog("open");
}
function getBillViewReturnPopUp(frmId) 
{
	$('#returnImportBillPopup').dialog({
		autoOpen : false,
		height : 300,
		width : 600,
		modal : true,
		buttons : {				
			"Save" : function() {		
				$(this).dialog("close");
				returnViewedBill(frmId);
			},
			"Cancel" : function() {
				$('#acceptReturnForm').each (function(){
					this.reset();						
				});
				$(this).dialog("close");
			}
		}
	});
	$('#returnImportBillPopup').dialog("open");
}
function acceptViewedBill(frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("txtAcceptRef").value = $('#acceptRef').val();
	document.getElementById("txtAcceptRemark").value = $('#txtRemark').val();
	frm.action = "acceptViewedImportBill.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function returnViewedBill(frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("txtAcceptRef").value = $('#acceptRef').val();
	document.getElementById("txtAcceptRemark").value = $('#txtRemark').val();
	frm.action = "returnViewedImportBill.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function authorizeViewedBill(frmId)
{
	frm = document.getElementById(frmId);
	frm.action = "authorizeViewedImportBill.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function rejectViewedBill(frmId) 
{
	frm = document.getElementById(frmId);
	document.getElementById("txtBillRejectReason").value = $('#txtAreaRejectRemark').val();	
	frm.action = "rejectViewedImportBill.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showBillViewPaymentForm(frmId)
{
	var frm = document.getElementById(frmId);
	document.getElementById("isBillViewFlag").value = true;	
	frm.action = "payViewedImportBill.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showBillViewLoanRequestForm(frmId)
{
	var frm = document.getElementById(frmId);
	document.getElementById("isBillViewFlag").value = true;		
	frm.action = "newLoanRequestFromViewedImportBill.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function ToggleAttribute(obj, DoEnable, TagName) 
{    
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
function enableDisableAcceptLink()
{
	var objstr = document.getElementById("TEXT").value;
	var obj = eval("(" + objstr + ')');	
	var acceptValue = obj.canAccept;
	if (acceptValue == true && CAN_EDIT == 'true'  && billType != 'COLLECTION')
	{		
		$('.accept').unbind('click');
		$('.accept').each(function(){
			ToggleAttribute(this, true, "href");
		});
		$('.accept').click(function()
		{
			showBillViewAcceptPopUp('frmMain');
		});
	} 
	else
	{
		$('.accept').each(function(){
			ToggleAttribute(this, false, "href");
		});
		$('.accept').removeAttr('onclick').click(function() 
		{});
		$('.accept').unbind('click');
	}
}
function enableDisableReturnLink()
{
	var objstr = document.getElementById("TEXT").value;
	var obj = eval("(" + objstr + ')');	
	var returnValue = obj.canReturn;
	if (returnValue == true && CAN_EDIT == 'true' && billType != 'COLLECTION')
	{		
		$('.return').unbind('click');
		$('.return').each(function(){
			ToggleAttribute(this, true, "href");
		});
		$('.return').click(function()
		{
			showBillViewReturnPopUp('frmMain');
		});
	} 
	else
	{
		$('.return').each(function(){
			ToggleAttribute(this, false, "href");
		});
		$('.return').removeAttr('onclick').click(function() 
		{});
		$('.return').unbind('click');
	}
}
function enableDisablePayLink()
{
	var objstr = document.getElementById("TEXT").value;
	var obj = eval("(" + objstr + ')');	
	var payValue = obj.canPay;
	if (payValue == true && CAN_EDIT == 'true')
	{		
		$('.pay').unbind('click');
		$('.pay').each(function(){
			ToggleAttribute(this, true, "href");
		});
		$('.pay').click(function()
		{
			showBillViewPaymentForm('frmMain');
		});
	} 
	else
	{
		$('.pay').each(function(){
			ToggleAttribute(this, false, "href");
		});
		$('.pay').removeAttr('onclick').click(function() 
		{});
		$('.pay').unbind('click');
	}
}
function enableDisableLoanReqLink()
{
	var objstr = document.getElementById("TEXT").value;
	var obj = eval("(" + objstr + ')');	
	var loanReqValue = obj.canLoanReq;		
	if (loanReqValue == true && CAN_EDIT == 'true')
	{
		$('.loanReq').unbind('click');		
		$('.loanReq').each(function(){
			ToggleAttribute(this, true, "href");
		});
		$('.loanReq').click(function()
		{
			showBillViewLoanRequestForm('frmMain')
		});		
	} 
	else 
	{
		$('.loanReq').each(function(){
			ToggleAttribute(this, false, "href");
		});
		$('.loanReq').removeAttr('onclick').click(function() 
		{});
		$('.loanReq').unbind('click');
	}
}
function enableDisableAuthorizeLink(makerId)
{
	var objstr = document.getElementById("TEXT").value;
	var obj = eval("(" + objstr + ')');	
	var authValue = obj.canAuth;
	if (authValue == true && makerId != USER && CAN_AUTH == 'true')
	{		
		$('.auth').unbind('click');
		$('.auth').each(function(){
			ToggleAttribute(this, true, "href");
		});
		$('.auth').click(function()
				{
					authorizeViewedBill('frmMain');
				});
	} 
	else
	{
		$('.auth').each(function(){
			ToggleAttribute(this, false, "href");
		});
		$('.auth').removeAttr('onclick').click(function() 
		{});
		$('.auth').unbind('click');
	}
}
function enableDisableRejectLink(makerId)
{
	var objstr = document.getElementById("TEXT").value;
	var obj = eval("(" + objstr + ')');	
	var rejectValue = obj.canReject;
	if (rejectValue == true && makerId != USER &&  CAN_AUTH == 'true')
	{		
		$('.reject').unbind('click');
		$('.reject').each(function(){
			ToggleAttribute(this, true, "href");
		});
		$('.reject').click(function()
		{
			getBillViewRejectPopup('frmMain');
		});
	} 
	else
	{
		$('.reject').each(function(){
			ToggleAttribute(this, false, "href");
		});
		$('.reject').removeAttr('onclick').click(function() 
		{});
		$('.reject').unbind('click');
	}
}
function enableDisableExportLoanReqLink()
{
	var objstr = document.getElementById("TEXT").value;
	var obj = eval("(" + objstr + ')');	
	var loanReqValue = obj.canLoanReq;		
	if (loanReqValue == true && CAN_EDIT == 'true')
	{
		$('.exportloanReq').unbind('click');		
		$('.exportloanReq').each(function(){
			ToggleAttribute(this, true, "href");
		});
		$('.exportloanReq').click(function()
		{
			showExportLoanRequestForm('frmMain');
		});		
	} 
	else 
	{
		$('.exportloanReq').each(function(){
			ToggleAttribute(this, false, "href");
		});
		$('.exportloanReq').removeAttr('onclick').click(function() 
		{});
		$('.exportloanReq').unbind('click');
	}
}
function showBillErrorPopup() {
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
