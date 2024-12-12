function goToCenter(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "exportLcCenter.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function showExportLCDetails(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "viewExportLc.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function showLCDetails1(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "viewExportLcDetails.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function showExportLCAmendDetails(frmId,rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtIndex").value = rowIndex;
	frm.action = "viewExportLcAmendmentMasterDetails.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function showExportLCCancelDetails(frmId,rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtIndex").value = rowIndex;
	frm.action = "viewExportLcCancellationMasterDetails.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function showLCDetails(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtIndex").value = rowIndex;
	frm.action = "viewExportLcFromUpdatesList.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function goBackToBillView(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "backToViewExportBillFromLc.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function showExpLCBillDetails(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtIndex").value = rowIndex;
	frm.action = "viewExportLcBillFromUpdatesList.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function viewExpLCBillDetails(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtIndex").value = rowIndex;
	document.getElementById("txtBillsDetailsFlag").value = true;
	frm.action = "viewExportLcBillFromDetails.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function underDevelopement()
{
	alert("Under Development.");
	return;
}
function goBackToLoanView(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "backToViewExportBillLoanFromLc.form";
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
	frm.action = "viewExportLcMasterDetails.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
};
function goBackToAmendMaster(frmId)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtIndex").value = 0;
	frm.action = "backToViewExpLcAmendmentMstDetails.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
};
function goBackToCancelMaster(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "viewExportLcCancellationMasterDetails.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
};
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
			showLoanRequestFromViewedLC('frmMain');
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
function showLoanRequestFromViewedLC(frmId)
{
	var frm = document.getElementById(frmId);	
	document.getElementById("isLCViewed").value = true;
	frm.action = "newLoanRequestFromExportLc.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}