selectedCheckBox = new Array();
closeFlagArray = new Array(); 
function rowSelect(checkBoxId, jsonString,closeFlag, recpCatagory, reconType, anchClient, clientMode, reconActionCenter, canReconInitiate)
{
	var index;
	if ((index = selectedExists(checkBoxId.getAttribute("id"))) != -1)
	{
		if (checkBoxId.checked == true)
		{	
			selectedCheckBox[selectedCheckBox.length] = checkBoxId.getAttribute("id");
			closeFlagArray[closeFlagArray.length] = closeFlag;
		}
		else
		{
			selectedCheckBox.splice(index, 1);
			closeFlagArray.splice(index, 1);
		}
	}
	
		
	if(recpCatagory != '6' && canReconInitiate == 'true')
	{
	enableDisableAcceptLink(closeFlag);
	enableDisableDeleteLink(closeFlag);
	enableDisableConfirmLink(closeFlag);
	enableDisableReverseLink(closeFlag);
		if(recpCatagory != '1' && reconType != 'A')
		{
		enableDisableUnmatchLink(closeFlag);
		}
	}
}

function invoiceRowSelect(checkBoxId, jsonString,closeFlag, reconActionCenter, clientMode, recpCatagory, reconType, canReconInitiate)
{
	var index;
	if ((index = selectedExists(checkBoxId.getAttribute("id"))) != -1)
	{
		if (checkBoxId.checked == true)
		{	
			selectedCheckBox[selectedCheckBox.length] = checkBoxId.getAttribute("id");
			closeFlagArray[closeFlagArray.length] = closeFlag;
		}
		else
		{
			selectedCheckBox.splice(index, 1);
			closeFlagArray.splice(index, 1);
		}
	}
	
	if(recpCatagory != '6' && canReconInitiate == 'true'){
	enableDisableAcceptLink(closeFlag);
	enableDisableDeleteLink(closeFlag);
	enableDisableConfirmLink(closeFlag);
	enableDisableReverseLink(closeFlag);
	if(recpCatagory != '1'  && reconType != 'A')
	{
		enableDisableUnmatchLink(closeFlag);
	}
	}
}


function selectedExists(checkID) 
{
	for ( var i = 0; i < selectedCheckBox.length; i++) 
	{
		if (selectedCheckBox[i] == checkID)
		{
			return i;
     	}
	}
	return 0;
}

function enableDisableAcceptLink(closeFlag)
{
	var authorizeValue;
	if (selectedCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		var closeFlag=closeFlagArray[0];
		if(closeFlag!="T")
		{
			authorizeValue = obj.canAuthorise && true;
		}
	}
	for ( var i = 1; i < selectedCheckBox.length; i++) 
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		var closeFlag=closeFlagArray[i];
		if(closeFlag!="T")
		{
			authorizeValue = authorizeValue && obj.canAuthorise;
		}
		
	}
	if (authorizeValue == true && closeFlag!='T' && CAN_AUTH == 'true') 
	{
		
		$('#btnAuth').unbind('click');
		ToggleAttribute("btnAuth", true, "href");
		$('#btnAuth').addClass("mousePointer");
		if(MODE=='INVOICE')
		{
		   $('#btnAuth').click(function()
			{
			   goToURL('acceptRecon.form','frmMain');
			});
		}
		else
		{
			$('#btnAuth').click(function()
			{
				goToURL('acceptReceiptRecon.form','frmMain');
			});
		}
	}
	else 
	{
		ToggleAttribute("btnAuth", false, "href");
		$('#btnAuth').removeAttr('onclick').click(function() 
		{
		});
		$('#btnAuth').unbind('click');
	}
	
}

function enableDisableConfirmLink(closeFlag)
{
	var authorizeValue;
	if (selectedCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		var closeFlag=closeFlagArray[0];
		if(closeFlag!="T")
		{
			authorizeValue = obj.canConfirm && true;
		}
		
	}
	for ( var i = 1; i < selectedCheckBox.length; i++) 
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		var closeFlag=closeFlagArray[i];
		if(closeFlag!="T")
		{
			authorizeValue = authorizeValue && obj.canConfirm;
		}
	}
	if (authorizeValue == true && closeFlag!='T' && CAN_EDIT=='true') 
	{
		
		$('#btnConfirm').unbind('click');
		ToggleAttribute("btnConfirm", true, "href");
		$('#btnConfirm').addClass("mousePointer");
		if(MODE=='INVOICE')
		{
		   $('#btnConfirm').click(function()
			 {
			   goToURL('confirmRecon.form','frmMain');
			  });
		}
		else
		{
			$('#btnConfirm').click(function()
			{
				goToURL('confirmReceiptRecon.form','frmMain')
			});
		}
	}
	else 
	{
		ToggleAttribute("btnConfirm", false, "href");
		$('#btnConfirm').removeAttr('onclick').click(function() 
		{
		});
		$('#btnConfirm').unbind('click');
	}
	
}

function enableDisableDeleteLink(closeFlag)
{
	var deleteValue;
	if (selectedCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		var closeFlag=closeFlagArray[0];
		if(closeFlag!="T")
		{
			deleteValue = obj.canDelete && true;
		}
		
	}
	for ( var i = 1; i < selectedCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		var closeFlag=closeFlagArray[i];
		if(closeFlag!="T")
		{
			deleteValue = deleteValue && obj.canDelete;
		}
			
	}
	if (deleteValue == true && closeFlag!='T' && CAN_EDIT=='true') 
	{
		$('#btnDelete').unbind('click');
		ToggleAttribute("btnDelete", true, "href");
		$('#btnDelete').addClass("mousePointer");
		if(MODE=='INVOICE')
		{
		 $('#btnDelete').click(function()
		{
			 goToURL('deleteRecon.form','frmMain');
		});
		}
		else
		{
			$('#btnDelete').click(function()
		  {
				goToURL('deleteReceiptRecon.form','frmMain');
		 });
		}
	} 
	else
	{
		ToggleAttribute("btnDelete", false, "href");
		$('#btnDelete').removeAttr('onclick').click(function()
		{});
		$('#btnDelete').unbind('click');
		
	}
}

function enableDisableReverseLink(closeFlag)
{
	var authorizeValue;
	if (selectedCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		var closeFlag=closeFlagArray[0];
		if(closeFlag!="T")
		{
			authorizeValue = obj.canReject && true;
		}
			
	}
	for ( var i = 1; i < selectedCheckBox.length; i++) 
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		var closeFlag=closeFlagArray[i];
		if(closeFlag!="T")
		{
			authorizeValue = authorizeValue && obj.canReject;
		}
		
	}
	if (authorizeValue == true && closeFlag!='T' && CAN_AUTH == 'true') 
	{
		
		$('#btnReverse').unbind('click');
		ToggleAttribute("btnReverse", true, "href");
		$('#btnReverse').addClass("mousePointer");
		if(MODE=='INVOICE')
		{
		 $('#btnReverse').click(function()
		 {
			   goToURL('reverseRecon.form','frmMain');
		 });
		}
		else
		{
			$('#btnReverse').click(function()
			{
				goToURL('reverseReceiptRecon.form','frmMain');
			});
		}
	}
	else 
	{
		ToggleAttribute("btnReverse", false, "href");
		$('#btnReverse').removeAttr('onclick').click(function() 
		{
		});
		$('#btnReverse').unbind('click');
	}
	
}

function enableDisableUnmatchLink(closeFlag)
{
	var authorizeValue;
	if (selectedCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		var closeFlag=closeFlagArray[0];
		if(closeFlag!="T")
		{
			authorizeValue = obj.canUnMatchPending && true;
		}
		
	}
	for ( var i = 1; i < selectedCheckBox.length; i++) 
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		var closeFlag=closeFlagArray[i];
		if(closeFlag!="T")
		{
			authorizeValue = authorizeValue && obj.canUnMatchPending;
		}
		
	}
	if (authorizeValue == true && closeFlag!='T' && CAN_EDIT=='true') 
	{
		
		$('#btnUnmatch').unbind('click');
		ToggleAttribute("btnUnmatch", true, "href");
		$('#btnUnmatch').addClass("mousePointer");
		if(MODE=='INVOICE')
		{
		   $('#btnUnmatch').click(function()
			{
			   goToURL('unmatchRecon.form','frmMain');
			});
		}
		else
		{
			$('#btnUnmatch').click(function()
			{
				goToURL('unmatchReceiptRecon.form','frmMain');
			});
		}
	}
	else 
	{
		ToggleAttribute("btnUnmatch", false, "href");
		$('#btnUnmatch').removeAttr('onclick').click(function() 
		{
		});
		$('#btnUnmatch').unbind('click');
	}
	
}
function ToggleAttribute(obj, DoEnable, TagName) 
{
    
	obj = document.getElementById(obj);
	if (DoEnable) 
	{
		var TagValue = obj.getAttribute("back_" + TagName);
		if (TagValue != null) 
		{
			obj.setAttribute(TagName, TagValue);
			obj.removeAttribute("back_" + TagName);
		}
		var cssClass = obj.getAttribute("class");
		cssClass = cssClass.replace(" grey ", " black mousePointer ");
		
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
		cssClass = cssClass.replace(" black mousePointer ", " grey ");
		obj.setAttribute("class", cssClass);
	}
}


function goToURL(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordKey").value = selectedCheckBox;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function getReconAdvancedFilterPopup(strUrl, frmId) {
	
	  var defaultFromDate=btns['defaultFromDate'];
		var defaultToDate=btns['defaultToDate'];
		var fromDate=$('#fromDate').val();
		var toDate= $('#toDate').val();
		var dueFromDate= $('#fromDueDate').val();
		var dueToDate= $('#toDueDate').val();
		if(fromDate==null || fromDate=="")
	     {
		 $('#fromDate').addClass('grey');
		 $('#fromDate').val(defaultFromDate);
		 }
		if(toDate==null || toDate=="")
		{
		 $('#toDate').addClass('grey');
		 $('#toDate').val(defaultToDate);
		}
	buttonsOpts[btns['cancelBtn']]= function() {
				$('form#filterForm').each (function(){
					this.reset();
							$('#txtAmount').val("0.00");
							});
					$(this).dialog("close");
					
				};
	buttonsOpts[btns['goBtn']]=function() {
					if ($('#fromDate').val() == defaultFromDate) {
						$('#fromDate').val("");
					}
					if ($('#fromDueDate').val() ==defaultFromDate) {
						$('#fromDueDate').val("");
					}
					if ($('#toDate').val() == defaultToDate) {
						$('#toDate').val("");
					}
					if ($('#toDueDate').val() == defaultToDate) {
						$('#toDueDate').val("");
					}
					if ($('#txtAmount').val() == "") {
						$('#txtAmount').val("0");
					}
			
					$(this).dialog("close");
					goToPage(strUrl, frmId);
				};
	buttonsOpts[btns['clearBtn']] = function() {
					var itemId, defaultItemValue;
					$('form#filterForm').find('input, select').each(function(index, item) {
						item = $(item);
						itemId = item.attr('id');
						defaultItemValue = '';
						if(itemId === 'fromDate') {
							defaultItemValue = defaultFromDate;
						} else if(itemId === 'toDate') {
							defaultItemValue = defaultToDate;
						}
						if(defaultItemValue !== '') {
							item.addClass('grey');
						}
						item.val(defaultItemValue);
					});
				};
	$('#advancedFilterPopup').dialog({
		autoOpen : false,
		height : 390,
		width : 473,
		modal : true,
		buttons : buttonsOpts,
		open: function(){
			$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset').addClass('nofloating centerAlign');
            
            $('.ui-dialog-buttonpane').find('button:contains("cancelBtn")').attr("title","Cancel");
            $('.ui-dialog-buttonpane').find('button:contains("cancelBtn")').find('.ui-button-text').prepend('<span class="fa fa-minus-circle">&nbsp;&nbsp</span>');

            $('.ui-dialog-buttonpane').find('button:contains("goBtn")').attr("title","Filter");
            $('.ui-dialog-buttonpane').find('button:contains("goBtn")').find('.ui-button-text').prepend('<span class="fa fa-filter">&nbsp;&nbsp</span>');
		}
	});
	$('#advancedFilterPopup').dialog("open");
}
function getReceiptAdvancedFilterPopup(strUrl, frmId) {

	var defaultFromDate=btns['defaultFromDate'];
		var defaultToDate=btns['defaultToDate'];
		var fromDate=$('#fromDate').val();
		var toDate= $('#toDate').val();
		var dueFromDate= $('#fromDueDate').val();
		var dueToDate= $('#toDueDate').val();
		if(fromDate==null || fromDate=="")
	     {
		 $('#fromDate').addClass('grey');
		 $('#fromDate').val(defaultFromDate);
		 }
		if(toDate==null || toDate=="")
		{
		 $('#toDate').addClass('grey');
		 $('#toDate').val(defaultToDate);
		}
	buttonsOpts[btns['cancelBtn']]= function() {
					$('#filterForm').each (function(){
					this.reset();
							$('#txtAmount').val("0.00");
							});
					$(this).dialog("close");
				};
				
	buttonsOpts[btns['goBtn']]=function() {
					if ($('#fromDate').val() == defaultFromDate) {
						$('#fromDate').val("");
					}
					if ($('#fromDueDate').val() ==defaultFromDate) {
						$('#fromDueDate').val("");
					}
					if ($('#toDate').val() == defaultToDate) {
						$('#toDate').val("");
					}
					if ($('#toDueDate').val() == defaultToDate) {
						$('#toDueDate').val("");
					}
					if ($('#txtAmount').val() == "") {
						$('#txtAmount').val("0");
					}
					if ($('#txtNetAmount').val() == "") {
						$('#txtNetAmount').val("0");
					}
			
					$(this).dialog("close");
					goToPage(strUrl, frmId);
				};
		buttonsOpts[btns['clearBtn']] = function() {
					var itemId, defaultItemValue;
					$('form#filterForm').find('input, select').each(function(index, item) {
						item = $(item);
						itemId = item.attr('id');
						defaultItemValue = '';
						if(itemId === 'fromDate') {
							defaultItemValue = defaultFromDate;
						} else if(itemId === 'toDate') {
							defaultItemValue = defaultToDate;
						}
						if(defaultItemValue !== '') {
							item.addClass('grey');
						}
						item.val(defaultItemValue);
					});
				};

	$('#advancedFilterPopup').dialog({
		autoOpen : false,
		height : 350,
		width : 473,
		modal : true,
		buttons : buttonsOpts,
		open: function(){
			$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset').addClass('nofloating centerAlign');
            
            $('.ui-dialog-buttonpane').find('button:contains("cancelBtn")').attr("title","Cancel");
            $('.ui-dialog-buttonpane').find('button:contains("cancelBtn")').find('.ui-button-text').prepend('<span class="fa fa-minus-circle">&nbsp;&nbsp</span>');

            $('.ui-dialog-buttonpane').find('button:contains("goBtn")').attr("title","Filter");
            $('.ui-dialog-buttonpane').find('button:contains("goBtn")').find('.ui-button-text').prepend('<span class="fa fa-filter">&nbsp;&nbsp</span>');
		}
	});
	$('#advancedFilterPopup').dialog("open");
}


function  fromDate_TextChanged()
{
	 var dateValue=$('#fromDate').val();
	  if (dateValue !='' || dateValue != null)
      {
		 $('#fromDate').removeClass('grey');
		 $('#fromDate').addClass('black');
	  }
	  if((dateValue == '' || dateValue == null))
       {
		 $('#fromDate').removeClass('black');
		 $('#fromDate').addClass('grey');
		 $('#fromDate').val(defaultFromDate);
	   }
}

function  toDate_TextChanged()
{
     var dateValue=$('#toDate').val();
     if (dateValue !='' || dateValue != null)
      {
		 $('#toDate').removeClass('grey');
		 $('#toDate').addClass('black');
	  }
	  if((dateValue == '' || dateValue == null))
       {
		 $('#toDate').removeClass('black');
		 $('#toDate').addClass('grey');
		 $('#toDate').val(defaultToDate);
	   }
}

function parentRowAction(strUrl, frmId,index)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordKey").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function reconRowAction(strUrl, frmId,index)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordKey").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function reconHistoryAction(strUrl, frmId,index)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordKey").value = index;
	frm.action = strUrl;
	
	frm.target = "hWinSeek";
	frm.method = "POST";
	var strAttr;
	var intTop = (screen.availHeight - 300) / 2;
	var intLeft = (screen.availWidth - 600) / 2;
	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=600,height=300";
	window.open("", "hWinSeek", strAttr);
	frm.submit();
	frm.target = "";
}

function searchRef(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	if($("#reconInvoiceClientDesc").length)
	 {
		if($('#reconInvoiceClientDesc').val()== null || $('#reconInvoiceClientDesc').val()=='')
		{
			$('#reconInvoiceClientCode').val('');
		}
		else
		{
			if($('#reconInvoiceClientCode').val()== null || $('#reconInvoiceClientCode').val()=='')
			{
				$('#reconInvoiceClientCode').val($('#reconInvoiceClientDesc').val());  
			}		  
		}
	 }
	var searchRef=document.getElementById("txtSearchReference").value;
	document.getElementById("txtRecordKey").value = searchRef;
	document.getElementById("reconInvoiceClientCode").value = document.getElementById("txtReconInvoiceClientCode").value;
	document.getElementById("reconInvoiceClientDesc").value = document.getElementById("txtReconInvoiceClientDesc").value;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function closePopup(strUrl, frmId,index)
{
 $('#closePopUp').dialog({
		autoOpen : false,
		height : 180,
		width : 300,
		modal : true,
		buttons : {
				"Cancel" : function() {
					
					$(this).dialog("close");
				},
				"Ok" : function() {
					
					parentRowAction(strUrl,frmId,index);
				}
			
				
		}
	});
	$('#closePopUp').dialog("open");
}

function getInvoiceDetailsPopup(invoiceNumber,invoiceAmount,invoiceDate,
		invoiceDueDate,acceptedAmount,reconciledAmount,payer,bene,payerName,beneName,
		clientDesc,taxAmnt,penalty,rebate,currencycode) {
	   
	   $('#invoiceRef').val(invoiceNumber);
	   $('#invoiceAmt').val(invoiceAmount);
	   $('#invoiceDate').val(invoiceDate);
	   $('#invoiceDueDate').val(invoiceDueDate);
	   $('#invoiceAcceptedAmt').val(acceptedAmount);
	   $('#reconciledAmount').val(reconciledAmount);
	   $('#invoicePayerCode').val(payer);
	   $('#invoicePayerName').val(payerName);
	   $('#invoiceBeneCode').val(bene);
	   $('#invoiceBeneName').val(beneName);
	   $('#invoiceTaxAmt').val(taxAmnt);
	   $('#invoicePenaltyAmt').val(penalty);
	   $('#invoiceRebateAmt').val(rebate);
	   $('.currencyLabel').text(currencycode);
	   
	    $('#invoiceRef').attr("disabled","disabled");
		$('#invoiceAmt').attr("disabled","disabled");
		$('#invoiceDate').attr("disabled","disabled");
		$('#invoiceDueDate').attr("disabled","disabled");
		$('#invoiceAcceptedAmt').attr("disabled","disabled");
		$('#reconciledAmount').attr("disabled","disabled");
		$('#invoicePayerCode').attr("disabled","disabled");
		$('#invoicePayerName').attr("disabled","disabled");
		$('#invoiceBeneCode').attr("disabled","disabled");
		$('#invoiceBeneName').attr("disabled","disabled");
		$('#invoiceTaxAmt').attr("disabled","disabled");
		$('#invoicePenaltyAmt').attr("disabled","disabled");
		$('#invoiceRebateAmt').attr("disabled","disabled");
		$('.currencyLabel').attr("disabled","disabled");
		$('#invoiceSettChargeAmt').attr("disabled","disabled");
		$('#invoiceDetailsPopup').dialog({
				autoOpen : false,
				height : 400,
				width : 540,
				modal : true,
				
				buttons : {
					"Ok" : function() {
						$(this).dialog("close");
					}
				},open: function(){
					$('#invoiceDetailsPopup').css('overflow-y','auto');
				}
			});
		$('#invoiceDetailsPopup').dialog("open");
}

function getPaymentDetailsPopup(receiptRefNo,receiptDate,receiptAmount,reconciledAmount,drawer,reconciliableAmnt,currencyCode,status,draweeBankdesc,receiptNetworkCharge) {

	$('#receiptRef').val(receiptRefNo);
	$('#receiptDate').val(receiptDate);
	$('#receiptAmount').val(receiptAmount);
	$('#reconciledAmt').val(reconciledAmount);
	$('#drawerCode').val(drawer);
	$('#receiptOsAmt').val((reconciliableAmnt - reconciledAmount).toFixed(2));
	$('.receiptCurrency').text(currencyCode);
	$('#clearingStatus').val(status);
	$('#payerBank').val(draweeBankdesc);
	$('#invoiceReceiptAmt').val(receiptNetworkCharge);
	
	$('#receiptRef').attr("disabled","disabled");
	$('#receiptDate').attr("disabled","disabled");
	$('#receiptAmount').attr("disabled","disabled");
	$('#reconciledAmt').attr("disabled","disabled");
	$('#drawerCode').attr("disabled","disabled");
	$('#receiptOsAmt').attr("disabled","disabled");
	$('.receiptCurrency').attr("disabled","disabled");
	$('#invoiceReceiptAmt').attr("disabled","disabled");		
	$('#clearingStatus').attr("disabled","disabled");
	$('#payerBank').attr("disabled","disabled");		
	$('#invoiceSettChargeAmt').attr("disabled","disabled");
	
	$('#receiptDetailPopup').dialog({
		autoOpen : false,
		height : 350,
		width : 540,
		modal : true,
		buttons : {
			"Ok" : function() {
				$(this).dialog("close");
			}
		}
	});
	$('#receiptDetailPopup').dialog("open");
}

function getRulesPopup() {

	$('#rulesPopup').dialog({
		autoOpen : false,
		height : 700,
		width : 800,
		modal : true,
		buttons : {
			"Ok" : function() {
				$(this).dialog("close");
			}
		}
	});
	$('#rulesPopup').dialog("open");
}

function showReceiptsTab(frmid,strUrl) 
{

	var frm = document.getElementById(frmid);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();

}

function showInvoiceTab() {

	$('#receiptDiv').hide();
	$('#invoiceDiv').show();
	$('#invoiceTab').addClass("ui-tabs-selected ui-state-active");
	$('#receiptTab').removeClass("ui-tabs-selected ui-state-active");

}
function showHide(id,element)
{
	if($(element).hasClass('expandlink'))
		{
			$("#"+id).removeClass("ui-helper-hidden");
			$(element).removeClass('expandlink');
			$(element).addClass('collapselink');
		}
	else if($(element).hasClass('collapselink'))
			{
				$("#"+id).addClass("ui-helper-hidden");
				$(element).addClass('expandlink');
				$(element).removeClass('collapselink');
		
			}
}
function showManualMatch(strUrl, frmId,index)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordKey").value =index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function changeMode(element,strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	if(element.value!=USERMODE)
	{
		frm.submit();
	}
}
function changeClientMode(element,frmId,pageMode)
{
var frm = document.getElementById(frmId);
 if (pageMode.toString() == 'INVOICE')
 {
  strUrl="changeInvoiceReconMode.form";
 }
 else if(pageMode.toString() ==  'RECEIPT')
  {
  strUrl="changeReceiptReconMode.form";
  }
 frm.action = strUrl;
 frm.target = "";
 frm.method = "POST";
 if(element.value != '' && element.value != USERMODE)
 {
  frm.submit();
 }
 element.selectedIndex = 0;
}

function showTab(frmid,strUrl,element) 
 {
  var frm = document.getElementById(frmid);
  frm.action = strUrl;
  frm.target = "";
  frm.method = "POST";
  frm.submit();
 }
function calculateNetworkCharge(matchElement)
{
  var matchAmt=parseFloat(matchElement.value);
  if (! isEmpty(document.getElementById("receiptAmount")))
 {	  
		  var receiptAmount=parseFloat(document.getElementById("receiptAmount").value);
		  var networkCharges=parseFloat(document.getElementById("receiptNetworkCharges").value);
		  var value=(matchAmt*networkCharges)/(receiptAmount);
		  value = value.toFixed(2);
		  if(isNaN(value))
		  {
			  $('#networkChares').val("0");
		  }
		  else
		  {
			  $('#networkChares').val(value);
		  }
    }
  else
	{
	  $('#networkChares').val("0");
	}  
}

function goToBack(strUrl, frmId)
{	
	if($('#dirtyBit').val()=="1")
		getConfirmationPopup(frmId, strUrl);
	else
		goToPage(strUrl, frmId);		
}

function getConfirmationPopup(frmId, strUrl)
{
	$('#confirmPopup').dialog( {
		autoOpen : false,
		height : 200,
		width : 420,
		modal : true,
		buttons : {
				"Yes" : function() {
					var frm = document.getElementById(frmId);
					frm.action = strUrl;
					frm.target = "";
					frm.method = "POST";
					frm.submit();
					},
				"No" : function() {
					$(this).dialog("close");
					}
		}
	});
	$('#confirmPopup').dialog("open");
}
function goToPage(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	$(":input").removeAttr('disabled'); 
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function setDirtyBit()
{
	document.getElementById("dirtyBit").value = "1";	
}

function confirmHelper(strUrl, frmId)
{
	$('#btnConfirm').removeAttr('onclick').click(function(){});
	$('#btnConfirm').unbind('click');
	$('#btnConfirm').removeClass('black');
	$('#btnConfirm').addClass('grey');
	goToURL(strUrl, frmId);
}

function authHelper(strUrl, frmId)
{
	$('#btnAuth').removeAttr('onclick').click(function(){});
	$('#btnAuth').unbind('click');
	$('#btnAuth').removeClass('black');
	$('#btnAuth').addClass('grey');
	goToURL(strUrl, frmId);
}

function unmatchHelper(strUrl, frmId)
{
	$('#btnUnmatch').removeAttr('onclick').click(function(){});
	$('#btnUnmatch').unbind('click');
	$('#btnUnmatch').removeClass('black');
	$('#btnUnmatch').addClass('grey');
	goToURL(strUrl, frmId);
}

function reverseHelper(strUrl, frmId)
{
	$('#btnReverse').removeAttr('onclick').click(function(){});
	$('#btnReverse').unbind('click');
	$('#btnReverse').removeClass('black');
	$('#btnReverse').addClass('grey');
	goToURL(strUrl, frmId);
}

function deleteHelper(strUrl, frmId)
{
	$('#btnDelete').removeAttr('onclick').click(function(){});
	$('#btnDelete').unbind('click');
	$('#btnDelete').removeClass('black');
	$('#btnDelete').addClass('grey');
	goToURL(strUrl, frmId);
}
jQuery.fn.SearchRefTextBox = function() {
	return this
			.each(function() {
				$(this)
						.keyup(function(e) {
							//Allow Enter key 
							if(e.keyCode==13)
							{
								javascript:searchRef('searchInvoiceRef.form','frmMain');
							}
							})
			})
};
jQuery.fn.ReceiptSearchRefTextBox = function() {
	return this
			.each(function() {
				$(this)
						.keyup(function(e) {
							//Allow Enter key 
							if(e.keyCode==13)
							{
								javascript:searchRef('searchReceiptRef.form','frmMain');
							}
							})
			})
};
jQuery.fn.reconInvoiceClientAutoComplete= function(strUrl) {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/userclients.json",
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term,
										$top:-1
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {														
														label : item.DESCR,														
														bankDtl : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						if (data) {
							if (!isEmpty(data.DESCR))
							{
								$('#txtReconInvoiceClientDesc').val(data.DESCR);
								$('#txtReconInvoiceClientCode').val(data.CODE);
							}
						}
						searchRef(strUrl,'frmMain');
					},
					open : function() {
						$(this).removeClass("ui-corner-all")
								.addClass("ui-corner-top");
					},
					close : function() {
						$(this).removeClass("ui-corner-top")
								.addClass("ui-corner-all");
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

jQuery.fn.ForceAlphaNumericAndPercentOnly = function() {
	return this
			.each(function(){
				$(this)
						.keypress(function(e) 
						{
							// allows only alphabets & numbers, backspace, tab
							var keycode = e.which || e.keyCode;						
							if ((keycode >= 48 && keycode <= 57) || (keycode >= 65 && keycode <= 90) || (keycode >= 97 && keycode <= 122)
									|| keycode == 8 || keycode == 9 || keycode == 37)
								return true;

							return false;
						})
			})
};

function isEmpty(val){
    return (val === undefined || val == null || val.length <= 0) ? true : false;
}

function getConfirmPopup(frmId, strUrl)
{
	if($("#dirtyBit").val()>0){
	$('#confirmPopup').dialog({
		autoOpen : false,
		maxHeight: 550,
		minHeight:'auto',
		width : 400,
		modal : true,
		resizable: false,
		draggable: false
	});
	$('#confirmPopup').dialog("open");

	$('#cancelConfirmMsg').bind('click',function(){
		$('#confirmPopup').dialog("close");
	});

	$('#doneConfirmMsgbutton').bind('click',function(){
		var frm = document.forms[frmId];
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	});
	$('#textContent').focus();
	}else{
		goToPage(strUrl,'frmMain');
	}
}

jQuery.fn.invoiceRefAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/invoiceRefSeek.json",
									type: "POST",
									dataType : "json",
									data : {
										$filtercode1: internalRefNo,
										$autofilter : request.term,
										$top: -1
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {														
														label : item.INV_NMBR
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						$('#invoiceRef').val(ui.item.value);
						goToPage('verifyInvoice.form','frmMain');
					},
					change : function(event, ui) {
						goToPage('verifyInvoice.form','frmMain');
					},
					open : function() {
						$(this).removeClass("ui-corner-all")
								.addClass("ui-corner-top");
					},
					close : function() {
						$(this).removeClass("ui-corner-top")
								.addClass("ui-corner-all");
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
					+ item.label +'</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

jQuery.fn.receiptRefAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/receiptRefSeek.json",
									type: "POST",
									dataType : "json",
									data : {
										$filtercode1: internalRefNo,
										$autofilter : request.term,
										$top: -1
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {														
														label : item.TRANSACTION_REF_NMBR
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						$('#receiptRef').val(ui.item.value);
						goToPage('verifyReceipt.form','frmMain');
					},
					open : function() {
						$(this).removeClass("ui-corner-all")
								.addClass("ui-corner-top");
					},
					close : function() {
						$(this).removeClass("ui-corner-top")
								.addClass("ui-corner-all");
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
					+ item.label +'</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

function setInvoiceDateDropDownMenu(renderToElementId){
	$('#'+renderToElementId).empty();
		dropDownContainer=Ext.create('Ext.Container', {
				itemId : 'invoiceDateContainer',
				renderTo:renderToElementId,
				items : [{
								xtype : 'label',
								forId:'invoiceDateLabel',
								text:getLabel('invoiceDateLabel','Invoice Date'),
								listeners: {
								       render: function(c) {
								    	   			var tip = Ext.create('Ext.tip.ToolTip', {
								    	   							xtype : 'tooltip',
												            	    target: c.getEl(),
												            	    listeners:{
												            	    	beforeshow:function(tip){
												            	    		if(invoice_date_opt === null)
													            	    		tip.update(getLabel('invoiceDateLabel','Invoice Date'));
													            	    	else
													            	    		tip.update(getLabel('invoiceDateLabel','Invoice Date') + invoice_date_opt);

												            	    	}
												            	    }
								        			});
								       	}	
								}
							},{
								xtype : 'button',
								border : 0,
								itemId : 'invoiceDateMonthButton',
								cls : 'ui-caret-dropdown',
								listeners : {
									click:function(event){
											var menus=getDateDropDownItems("invoiceDate",this);
											var xy=event.getXY();
											menus.showAt(xy[0],xy[1]+16);
											event.menu=menus;
									}
								}
							}
						]	
			});
			return dropDownContainer;
}

function getDateDropDownItems(filterType,buttonIns){
	var me = this;
	var intFilterDays = !Ext.isEmpty(filterDays)
		? parseInt(filterDays,10)
		: '';
		
		var arrMenuItem = [];
		if (intFilterDays >= 1 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
				text : getLabel('today', 'Today'),
				btnId : 'btnToday',
				btnValue : '1',
				handler : function(btn, opts) {
					$(document).trigger("filterDateChange",[filterType,btn,opts]);
					updateToolTip(filterType," (Today)");
				}
			});
		
		if (intFilterDays >= 2 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
				text : getLabel('yesterday', 'Yesterday'),
				btnId : 'btnYesterday',
				btnValue : '2',
				handler : function(btn, opts) {
					$(document).trigger("filterDateChange",[filterType,btn,opts]);
					updateToolTip(filterType," (Yesterday)");
				}
			});
		
		if (intFilterDays >= 7 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
					text : getLabel('thisweek', 'This Week'),
					btnId : 'btnThisweek',
					btnValue : '3',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (This Week)");
					}
				});
		if (intFilterDays >= 14 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
					text : getLabel('lastweektodate', 'Last Week To Date'),
					btnId : 'btnLastweek',
					btnValue : '4',
					handler : function(btn, opts) {
						$(document).trigger("filterDateChange",[filterType,btn,opts]);
						updateToolTip(filterType," (Last Week To Date)");
					}
				});
		if (intFilterDays >= 30 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
				text : getLabel('thismonth', 'This Month'),
				btnId : 'btnThismonth',
				btnValue : '5',
				handler : function(btn, opts) {
					$(document).trigger("filterDateChange",[filterType,btn,opts]);
					updateToolTip(filterType," (This Month)");
				}
			});
		if (intFilterDays >= 60 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastMonthToDate',
								'Last Month to date'),
						btnId : 'btnLastmonth',
						btnValue : '6',
						parent : me,
						handler : function(btn, opts) {
							$(document).trigger("filterDateChange",[filterType,btn,opts]);
							updateToolTip(filterType," (Last Month to date)");
						}
					});
		 if (lastMonthOnlyFilter===true || Ext.isEmpty(intFilterDays))
		   arrMenuItem.push({
				text : getLabel('lastmonthonly', 'Last Month Only'),
				btnId : 'btnLastmonthonly',
				btnValue : '14',
				handler : function(btn, opts) {
					$(document).trigger("filterDateChange",[filterType,btn,opts]);
					updateToolTip(filterType," (Last Month Only)");
				}
			});
		if (intFilterDays >= 90 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
				text : getLabel('thisquarter', 'This Quarter'),
				btnId : 'btnLastMonthToDate',
				btnValue : '8',
				handler : function(btn, opts) {
					$(document).trigger("filterDateChange",[filterType,btn,opts]);
					updateToolTip(filterType," (This Quarter)");
				}
			});
		if (intFilterDays >= 180 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastQuarterToDate',
						'Last Quarter To Date'),
						btnId : 'btnQuarterToDate',
						btnValue : '9',
						handler : function(btn, opts) {
							$(document).trigger("filterDateChange",[filterType,btn,opts]);
							updateToolTip(filterType," (Last Quarter To Date)");
						}
			});
		if (intFilterDays >= 365 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push( {
				text : getLabel('thisyear', 'This Year'),
				btnId : 'btnLastQuarterToDate',
				btnValue : '10',
				handler : function(btn, opts) {
					$(document).trigger("filterDateChange",[filterType,btn,opts]);
					updateToolTip(filterType," (This Year)");
				}
			});
		if (intFilterDays >= 730 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
				text : getLabel('lastyeartodate', 'Last Year To Date'),
				btnId : 'btnYearToDate',
				btnValue : '11',
				handler : function(btn, opts) {
					$(document).trigger("filterDateChange",[filterType,btn,opts]);
					updateToolTip(filterType," (Last Year To Date)");
				}
			});
		
		var dropdownMenu = Ext.create('Ext.menu.Menu', {
			itemId : 'DateMenu',
			cls : 'ext-dropdown-menu',
			items : arrMenuItem
		});

	return dropdownMenu;
}

function handleInvoiceAmountOperatorChange(me){
	var selectedAmountOperator=$("#amountOperator").val();
	if(selectedAmountOperator=='bt'){
		$("#invoiceAmountLabel").text(getLabel("amountFrom","Amount From"));
		$("#invoiceAmountTo").removeClass("hidden");
	}else{
		$("#invoiceAmountLabel").text(getLabel("amount","Amount"));
		$("#invoiceAmountTo").addClass("hidden");
	}
}

function handleNetReceivableAmountOperatorChange(me){
	var selectedReconcilableAmountOperator=$("#invoiceReceivableAmountOperator").val();
	if(selectedReconcilableAmountOperator=='bt'){
		$("#netReceivableAmountLabel").text(getLabel("netReceivableAmount","Net Receivable Amount From"));
		$("#netReceivableAmountTo").removeClass("hidden");
	}else{
		$("#netReceivableAmountLabel").text(getLabel("netReceivableAmount","Net Receivable Amount"));
		$("#netReceivableAmountTo").addClass("hidden");
	}
}

function getInvoiceAdvancedFilterValueJson(FilterCodeVal){
	var jsonArray = [];
	
	//invoice Reference
	var invoiceReference = $("#txtInvoice").val();
	if (!Ext.isEmpty(invoiceReference)) {
		jsonArray.push({
					field : 'invoiceNumber',
					operator : 'lk',
					value1 : encodeURIComponent(invoiceReference.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
					value2 : '',
					dataType : 0,
					displayType : 0,
					fieldLabel : getLabel('invoiceNumber','Invoice Number')
				});
	}
	
	//invoice Date
	if(!jQuery.isEmptyObject(selectedInvoiceDate)){
			jsonArray.push({
						field : 'invoiceDate',
						operator : selectedInvoiceDate.operator,
						value1 : Ext.util.Format.date(selectedInvoiceDate.fromDate, 'Y-m-d'),
						value2 : (!Ext.isEmpty( selectedInvoiceDate.toDate))? Ext.util.Format.date(selectedInvoiceDate.toDate, 'Y-m-d'): '',
						dataType : 1,
						displayType : 6,// 5,
						fieldLabel : getLabel('invoiceDate','Invoice Date')
					});
	}

	//invoice amount
	var invoiceAmountFrom=$("#txtAmount").val();
	if(!Ext.isEmpty(invoiceAmountFrom)){
		var invoiceAmountOperator = $("#amountOperator").val();
		var invoiceAmountTo=$("#amountFieldTo").val();
		if (!Ext.isEmpty(invoiceAmountOperator)) {
			jsonArray.push({
						field : 'invoiceAmount',
						operator : invoiceAmountOperator,							
						value1 : invoiceAmountFrom,
						value2 : invoiceAmountTo,
						dataType : 2,
						displayType :2,// 3,
						fieldLabel : getLabel('amount','Amount')
					});
		}
	}

	//net receivable amount
	var netAmountFrom=$("#txtNetAmount").val();
	if(!Ext.isEmpty(netAmountFrom)){
		var netAmountOperator = $("#invoiceReceivableAmountOperator").val();
		var netAmountTo=$("#netReceivableAmountFieldTo").val();
		if (!Ext.isEmpty(netAmountOperator)) {
			jsonArray.push({
						field : 'netReceivableAmount',
						operator : netAmountOperator,							
						value1 : netAmountFrom,
						value2 : netAmountTo,
						dataType : 2,
						displayType :2,// 3,
						fieldLabel : getLabel('netReceivableAmount','Net Receivable Amount')
					});
		}
	}
	
	//Liquidation Status
	var statusValue=$("#liquidationStatus").getMultiSelectValue();
	
	var statusValueDesc = [];
	$('#liquidationStatus :selected').each(function(i, selected){
		statusValueDesc[i] = $(selected).text();
	});

	var statusValueString=statusValue.join("and");
	var tempStatusValue;
	if (!Ext.isEmpty(statusValueString)) {
		if(!Ext.isEmpty(filterStatusCount)){
			var statusValueArray=statusValueString.split("and");
			 tempStatusValue=statusValueArray;
			if(filterStatusCount==statusValueArray.length)
				tempStatusValue='All';
		}
		if(tempStatusValue != "All")
			jsonArray.push({
						field : 'LiquidationStatus',
						operator : 'in',
						value1 : tempStatusValue,
						value2 : '',
						dataType : 0,
						displayType :11,// 6,
						fieldLabel : getLabel('liquidatationstatus','Status'),
						displayValue1 : statusValueDesc.toString()
						
					});
	}
	
	
	//Beneficiary
	var beneValue=$("#dropdownClientCode").val();
	var beneDesc = $("#dropdownClientCodeDescription").val();
	
	if(!Ext.isEmpty(beneValue)){
		jsonArray.push({
			field : 'Beneficiary',
			operator : 'in',
			value1 : encodeURIComponent(beneValue.replace(new RegExp("'", 'g'), "\''")),
			value2 : '',
			dataType : 0,
			displayType :11,// 6,
			fieldLabel : getLabel('buyerSeller','Buyer/Seller'),
			displayValue1 : beneDesc
			
		});
	}
	
	//product
	var productCode = $("#dropdownProduct").val();
	var productDesc = $("#dropdownProduct option:selected").text();
	if(!Ext.isEmpty(productCode)){
		jsonArray.push({
			field : 'scmMyProduct',
			operator : 'in',
			value1 : encodeURIComponent(productCode.replace(new RegExp("'", 'g'), "\''")),
			value2 : '',
			dataType : 0,
			displayType :11,// 6,
			fieldLabel : getLabel('package','Package'),
			displayValue1 : productDesc
			
		});
	}
	
	objJson = {};
	objJson.filterBy = jsonArray;
	if (FilterCodeVal && !Ext.isEmpty(FilterCodeVal))
		objJson.filterCode = FilterCodeVal;
	
	return objJson;	
}

function getInvoiceAdvancedFilterQueryJson(FilterCodeVal){
	var objJson = null;
	var jsonArray = [];

	
		
	//invoice Reference
	var invoiceReference = $("#txtInvoice").val();
	if (!Ext.isEmpty(invoiceReference)) {
		jsonArray.push({
					field : 'invoiceNumber',
					operator : 'lk',
					value1 : encodeURIComponent(invoiceReference.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
					value2 : '',
					dataType : 0,
					displayType : 0,
					fieldLabel : getLabel('invoiceNumber','Invoice Number')
				});
	}
	
	//invoice Date
	if(!jQuery.isEmptyObject(selectedInvoiceDate)){
			jsonArray.push({
						field : 'invoiceDate',
						operator : selectedInvoiceDate.operator,
						value1 : Ext.util.Format.date(selectedInvoiceDate.fromDate, 'Y-m-d'),
						value2 : (!Ext.isEmpty( selectedInvoiceDate.toDate))? Ext.util.Format.date(selectedInvoiceDate.toDate, 'Y-m-d'): '',
						dataType : 1,
						displayType : 6,// 5,
						fieldLabel : getLabel('invoiceDate','Invoice Date')
					});
	}

	//invoice amount
	var blnAutoNumeric = true;
	blnAutoNumeric = isAutoNumericApplied("txtAmount");
	if (blnAutoNumeric)
		invoiceAmountFrom = $("#txtAmount").autoNumeric('get');
	else
		invoiceAmountFrom = $("#txtAmount").val();

	if(!Ext.isEmpty(invoiceAmountFrom)){
		var invoiceAmountOperator = $("#amountOperator").val();
		
		blnAutoNumeric = isAutoNumericApplied("amountFieldTo");
		if (blnAutoNumeric)
			invoiceAmountTo = $("#amountFieldTo").autoNumeric('get');
		else
			invoiceAmountTo = $("#amountFieldTo").val();
		
		if (!Ext.isEmpty(invoiceAmountOperator)) {
			jsonArray.push({
						field : 'invoiceAmount',
						operator : invoiceAmountOperator,							
						value1 : invoiceAmountFrom,
						value2 : invoiceAmountTo,
						dataType : 2,
						displayType :2,// 3,
						fieldLabel : getLabel('amount','Amount')
					});
		}
	}

	//net receivable amount
	var blnAutoNumeric = true;
	blnAutoNumeric = isAutoNumericApplied("txtNetAmount");
	if (blnAutoNumeric)
		netAmountFrom = $("#txtNetAmount").autoNumeric('get');
	else
		netAmountFrom = $("#txtNetAmount").val();
	
	if(!Ext.isEmpty(netAmountFrom)){
		var netAmountOperator = $("#invoiceReceivableAmountOperator").val();
		
		blnAutoNumeric = isAutoNumericApplied("netReceivableAmountFieldTo");
		if (blnAutoNumeric)
			netAmountTo = $("#netReceivableAmountFieldTo").autoNumeric('get');
		else
			netAmountTo = $("#netReceivableAmountFieldTo").val();
		
		if (!Ext.isEmpty(netAmountOperator)) {
			jsonArray.push({
						field : 'netReceivableAmount',
						operator : netAmountOperator,							
						value1 : netAmountFrom,
						value2 : netAmountTo,
						dataType : 2,
						displayType :2,// 3,
						fieldLabel : getLabel('netReceivableAmount','Net Receivable Amount')
					});
		}
	}
	
	//Liquidation Status
	var statusValue=$("#liquidationStatus").getMultiSelectValue();
	
	var statusValueDesc = [];
	$('#liquidationStatus :selected').each(function(i, selected){
		statusValueDesc[i] = $(selected).text();
	});

	var statusValueString=statusValue.join("and");
	var tempStatusValue;
	if (!Ext.isEmpty(statusValueString)) {
		if(!Ext.isEmpty(filterStatusCount)){
			var statusValueArray=statusValueString.split("and");
			 tempStatusValue=statusValueArray;
			if(filterStatusCount==statusValueArray.length)
				tempStatusValue='All';
		}
		if(tempStatusValue != "All")
			jsonArray.push({
						field : 'LiquidationStatus',
						operator : 'in',
						value1 : tempStatusValue,
						value2 : '',
						dataType : 0,
						displayType :11,// 6,
						fieldLabel : getLabel('liquidatationstatus','Status'),
						displayValue1 : statusValueDesc.toString()
						
					});
	}
	
	//Beneficiary
	var beneValue=$("#dropdownClientCode").val();
	var beneDesc = $("#dropdownClientCodeDescription").val();
	
	
	if(!Ext.isEmpty(beneValue)){
		jsonArray.push({
			field : 'Beneficiary',
			operator : 'in',
			value1 : encodeURIComponent(beneValue.replace(new RegExp("'", 'g'), "\''")),
			value2 : '',
			dataType : 0,
			displayType :11,// 6,
			fieldLabel : selectedFilterLoggerDesc == 'SELLER' ?  getLabel('buyer','Buyer') : getLabel('seller','Seller'),
			displayValue1 : beneDesc
			
		});
	}
	
	//product
	var productCode = $("#dropdownProduct").val();
	var productDesc = $("#dropdownProductDesc").val();
	if(!(Ext.isEmpty(productCode) || Ext.isEmpty(productDesc))){
		jsonArray.push({
			field : 'scmMyProduct',
			operator : 'eq',
			value1 : encodeURIComponent(productCode.replace(new RegExp("'", 'g'), "\''")),
			value2 : '',
			dataType : 0,
			displayType :12,// 6,
			fieldLabel : getLabel('package','Package'),
			displayValue1 : productDesc
			
		});
	}
	objJson = jsonArray;
	
	return objJson;	
}

function setInvoiceStatusMenuItems(elementId) {
	$("#"+elementId).empty();
	var el = $("#"+elementId).multiselect();
	el.attr('multiple',true);
	if (typeof arrStatus != 'undefined' && arrStatus) {
		for(index=0;index<arrStatus.length;index++)
		{
			var opt = $('<option />', {
				value: arrStatus[index].code,
				text: arrStatus[index].desc
			});
			opt.attr('selected','selected');	
			opt.appendTo(el);
		}
		el.multiselect('refresh');
		filterStatusCount=arrStatus.length;
	}	
}

jQuery.fn.invoiceClientCodeAutoCompleter = function() {
	var buyerSellerUrl = "services/userseek/invoiceReconSeekBuyerSeller";
	return this.each(function() {
					$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : buyerSellerUrl,
									dataType : "json",
									type:'POST',
									data : {
										$filtercode1: clientCode, 
										$filtercode2 : (selectedFilterLoggerDesc == 'BUYER') ? 'B' : 'D', //drawer_beneficiary_flag1
										$filtercode3 : (selectedFilterLoggerDesc == 'BUYER') ? 'D': 'B',//drawer_beneficiary_flag2,
										$filtercode4 :USER,
										top:-1,
										$autofilter : request.term
									},
									success : function(data) {
											var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {
														label : item.DRAWER_DESCRIPTION,
														record : item
													}
												}));
										filterBeneCount=rec.length;
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.payerDtl;
						$('#dropdownClientCode').val(ui.item.record.DRAWER_CODE);
						counterparty = ui.item.record.BENE_CASHIN_CLIENT;
						
					},
					change : function(event, ui) { 							
					},
					open : function() {
						$(this).removeClass("ui-corner-all")
								.addClass("ui-corner-top");
					},
					close : function() {
						$(this).removeClass("ui-corner-top")
								.addClass("ui-corner-all");
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="t7-autocompleter"><ul>'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
}


jQuery.fn.invoiceProductCodeAutoCompleter = function(elementId) {
	var clientCode = '';
	if(selectedFilterClient != null && selectedFilterClient != 'all'){
		clientCode = selectedFilterClient;
	}else{
		clientCode = selectedClient;
	}
	
	var packageUrl = 'services/purchaseOrder/filterProducts/'+selectedFilterLoggerDesc+'.json';
	
	return this.each(function() {
					$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : packageUrl,
									dataType : "json",
									type:'POST',
									data:{
										$clientFilter:clientCode
									},
									success : function(data) {
										var rec = data;
										response($.map(rec, function(item) {
													return {
														label : item.description,
														record : item
													}
												}));
										filterBeneCount=rec.length;
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.payerDtl;
						$('#dropdownProduct').val(ui.item.record.code);
						
					},
					change : function(event, ui) {
						if(Ext.isEmpty(ui.item)) {
							$('#dropdownProduct').val('');
						}
					},
					search : function( event, ui ) {
						$('#dropdownProduct').val('');
					},
					open : function() {
						$(this).removeClass("ui-corner-all")
								.addClass("ui-corner-top");
					},
					close : function() {
						$(this).removeClass("ui-corner-top")
								.addClass("ui-corner-all");
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="t7-autocompleter"><ul>'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
}


function setInvoiceSavedFilterComboItems(element){
	$(element).empty();
	$.ajax({
		url : 'services/userfilterslist/InvoiceAdvFilter'+selectedFilterLoggerDesc+'.json',
		success : function(responseText) {
			$(element).empty();
			$(element).append($('<option>', { 
							value: "",
							text : getLabel("select","Select"),
							selected : false
							}));
			if(responseText && responseText.d && responseText.d.filters){
				 var responseData=responseText.d.filters;
				 if(responseData.length > 0){
					$.each(responseData,function(index,item){
						$(element).append($('<option>', { 
							value: responseData[index],
							text : responseData[index],
							selected : false
							}));
					});
				 }
			}
			
			$('#msSavedFilter').multiselect({ 
				  selectedList:1,
				  noneSelectedText:'Select Saved Filter',
					width : 500,
				  multiple: false,
				  header : false,
				  deleteIcon : true,
				  handleDelete : function(element,option){
					 $(document).trigger("deleteFilterEvent",[option.value]);
				  }
				 });
			$(element).multiselect('refresh');
		}
		
	});	
}


function resetAllMenuItemsInMultiSelect(elementId)
{
	$(elementId+' option').prop('selected', true);
	$(elementId).multiselect("refresh");
}

function changeBuyerOrSellerAndRefreshGrid(selectedLoggerCode,
		selectedLoggerDescription) {
	selectedFilterLogger = selectedLoggerCode;
	selectedFilterLoggerDesc = selectedLoggerCode;
	$(document).trigger("handleLoggerChangeInQuickFilter", false);
	
}