_strInvalidPage="Invalid Page Number";
var filterBeneCount = '';
function showErrorPopup() {
	
	$('#errorsPopup').dialog( {
		autoOpen : true,
		height : 220,
		width : 473,
		modal : true,
		buttons : {
			"OK" : function() {
				$(this).dialog('close');
				if(!existErrors()) {
					var formId = 'frmMain';
					var redirectUrl = '';
					if(MODE=='VERIFY' && (INVOICEACTION=='Accept' || INVOICEACTION=='Reject' || INVOICEACTION == 'Deletion')) {
						redirectUrl = 'verificationCenter.form';
					} else if(MODE =='INVOICE' && INVOICEACTION == 'Deletion') {
						redirectUrl = 'invoiceCenter.form';
					} else if(MODE =='DEBIT_NOTE' && INVOICEACTION == 'Deletion') {
						redirectUrl = 'debitNoteCenter.form';
					} else if(MODE =='CREDIT_NOTE' && INVOICEACTION == 'Deletion') {
						redirectUrl = 'creditNoteCenter.form';
					} else if(MODE =='FINANCE' && INVOICEACTION == 'Deletion') {
						redirectUrl = 'financeCenter.form';
					} else if(INVOICEACTION == 'Finance' || INVOICEACTION == 'Payment_Bond') {
						redirectUrl = 'financeCenter.form';
					} else if(INVOICEACTION == 'Accept' || INVOICEACTION == 'Deletion') {
						redirectUrl = 'acceptanceCenter.form';
					}
					if(redirectUrl !== '') {
						goToPage(redirectUrl, formId);
					}
				}
			}
		}
	});
	$('#errorsPopup').dialog('open');
	$('.ui-dialog-buttonset button:eq(0)').focus();
}
function goToPage(strUrl, frmId)
{ 
	 if($("#txtLCMyClientDesc").length)
	 {
		 if($('#txtLCMyClientDesc').val()== null || $('#txtLCMyClientDesc').val()=='')
		 {
			 $('#txtLCMyClientCode').val('');
		 }
		 else
		 {
			 if($('#txtLCMyClientCode').val()== null|| $('#txtLCMyClientCode').val()=='')
			 {
				// $('#txtLCMyClientCode').val($('#txtLCMyClientDesc').val());  
			 }		  
		 }
	 }
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showCollection(strUrl, frmId,index)
{
	selectedCheckBox.splice(0, selectedCheckBox.length);
	selectedCheckBox[0] = index;
	var frm = document.getElementById(frmId);
	document.getElementById("txtInvIntRefNum").value =index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showFinanceEntry(strUrl,frmId,index)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtInvIntRefNum").value =index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showAcceptance(strUrl, frmId,index)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtInvIntRefNum").value =index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function statusSubmit(strUrl, frmId) 
{
	var selectedMenu = document.getElementById("cbostatusfilter");
	var index = selectedMenu.selectedIndex;
	var selectedOptionText = selectedMenu.options[index].text;
	document.getElementById("txtSelectedState").setAttribute("value",selectedOptionText);
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function collectionInvoices(strUrl, frmId)
{
	var txtInvIntRefNumstr="";
	for(var i=0;i<selectedCheckBox.length-1;i++)
	{
		txtInvIntRefNumstr=txtInvIntRefNumstr+selectedCheckBox[i]+",";
	}
	if(selectedCheckBox.length>0)
	{
		txtInvIntRefNumstr=txtInvIntRefNumstr+selectedCheckBox[i];
	}
	document.getElementById("txtInvIntRefNum").value =txtInvIntRefNumstr;
	// document.getElementById("txtAreaRejectRemarks").value
	// =document.getElementById("txtAreaRejectRemark").value;
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	$('#btnPayNow').removeAttr('onclick').click(function(){});
	$('#btnPayNow').unbind('click');
	$('#btnPayNow').removeClass('black');
	$('#btnPayNow').addClass('grey');
}

function invoicePayments(strUrl, frmId)
{
	var txtInvIntRefNumstr="";
	for(var i=0;i<selectedCheckBox.length-1;i++)
	{
		txtInvIntRefNumstr=txtInvIntRefNumstr+selectedCheckBox[i]+",";
	}
	if(selectedCheckBox.length>0)
	{
	var	txtInvPayIntRefNum=txtInvIntRefNumstr+selectedCheckBox[i];
	}

	//document.getElementById("txtInvPayIntRefNum2").value =txtInvIntRefNumstr;

	// document.getElementById("txtAreaRejectRemarks").value
	// =document.getElementById("txtAreaRejectRemark").value;
	var frm = document.getElementById(frmId);

	frm.action = strUrl;
	frm.target = "";
	frm.txtInvPayIntRefNum.value = txtInvPayIntRefNum;
	frm.method = "POST";
	frm.submit();
	$('#btnPayNow').removeAttr('onclick').click(function(){});
	$('#btnPayNow').unbind('click');
	$('#btnPayNow').removeClass('black');
	$('#btnPayNow').addClass('grey');
}

function rejectInvoices(strUrl, frmId)
{
	var txtInvIntRefNumstr="";
	for(var i=0;i<selectedCheckBox.length-1;i++)
	{
		txtInvIntRefNumstr=txtInvIntRefNumstr+selectedCheckBox[i]+",";
	}
	if(selectedCheckBox.length>0)
	{
		txtInvIntRefNumstr=txtInvIntRefNumstr+selectedCheckBox[i];
	}
	document.getElementById("txtInvIntRefNum").value =txtInvIntRefNumstr;
	document.getElementById("txtAreaRejectRemarks").value =document.getElementById("txtAreaRejectRemark").value;
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function getHistoryPage(strUrl,frmId,invoiceNumber)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtInvIntRefNum").value = invoiceNumber;
	frm.action = strUrl;
	frm.target = "hWinSeek";
	frm.method = "POST";
	var strAttr;
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 600)/2;
	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=600,height=300";
	window.open ("", "hWinSeek", strAttr);
	frm.submit();
	frm.target = "";
}

function viewInvoiceData(strUrl, frmId, invoiceInternalReferenceNumber)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtInvIntRefNum").value = invoiceInternalReferenceNumber;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function editInvoiceLineItem(strUrl, frmId, invoiceInternalReferenceNumber,	detailSerialNumber)
{
	document.getElementById("txtInvNum").value = invoiceInternalReferenceNumber;
	document.getElementById("txtItemNo").value = detailSerialNumber;
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

selectedCheckBox = new Array();
selectedVerifyArray=new Array();
selectedAcceptArray=new Array();
selectedMakerArray=new Array();
 // This Array Used For Getting Selected Invoices.

function rowSelect(checkBoxId, jsonString,isAuth,canVerify,canAccept)
{
	var index;
	if ((index = selectedExists(checkBoxId.getAttribute("id"))) != -1)
	{
		if (checkBoxId.checked == true)
		{	
			selectedCheckBox[selectedCheckBox.length] = checkBoxId.getAttribute("id");
			selectedVerifyArray[selectedVerifyArray.length]=canVerify;
			selectedAcceptArray[selectedAcceptArray.length]=canAccept;
			selectedMakerArray[selectedMakerArray.length]=isAuth;
		}
		else
		{
			$('#headerCheckbox').removeAttr("checked");
			selectedCheckBox.splice(index, 1);
			selectedVerifyArray.splice(index, 1);
			selectedAcceptArray.splice(index, 1);
			selectedMakerArray.splice(index, 1);
		}
	}
	enableDisableAuthorizeLink(true);
	enableDisableSubmitLink();
	enableDisableSendLink();
	enableDisableRejectLink(true);
	enableDisableDownloadLink();
	enableDisableDeleteLink();
	enableDisablePaymentLink();
	enableDisableFinanceLink();
	if(USERMODE=="BUYER")
	{
	  enableDisableAcceptLink(canAccept);
	  enableDisableDirectDebitLink();
	  enableDisablePaymentBondLink();
	}
	else if(USERMODE=="SELLER")
	{
	  enableDisableVerifyLink(canVerify);
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


function enableDisableAuthorizeLink(isAuth)
{
	var authorizeValue;
	if (selectedCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		var canAuth=selectedMakerArray[0];
		authorizeValue = obj.canAuthorise && isAuth && canAuth;
	}
	for ( var i = 1; i < selectedCheckBox.length; i++) 
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		var canAuth=selectedMakerArray[i];
		authorizeValue = authorizeValue && obj.canAuthorise && isAuth && canAuth;
	}
	if (authorizeValue == true && CAN_AUTH == 'true') 
	{
		$('#btnAuth').unbind('click');
		ToggleAttribute("btnAuth", true, "href");
		
		
		$('#btnAuth').click(function()
		{
			authorizeInvoice('authInvoice.form','frmMain');
		});
		
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
function enableDisableDeleteLink()
{
	
	var deleteValue;
	if (selectedCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		deleteValue = obj.canDelete;
	}
	for ( var i = 1; i < selectedCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		deleteValue = deleteValue && obj.canDelete;
	}
	if (deleteValue == true && CAN_EDIT == 'true') 
	{
		$('#btnDelete').unbind('click');
		ToggleAttribute("btnDelete", true, "href");
		
		$('#btnDelete').click(function()
				{
			invoiceDelete('deleteInvoice.form','frmMain')
				});
	} 
	else
	{
		ToggleAttribute("btnDelete", false, "href");
		$('#btnDelete').removeAttr('onclick').click(function()
		{});
		$('#btnDelete').unbind('click');
		
	}
	
}

function enableDisableFinanceLink()
{
	var financeValue;
	if (selectedCheckBox.length > 0)
	{
		var objstr = document.getElementById("FINANCE" + selectedCheckBox[0]);
		if(objstr==null)
		{ 
			financeValue=false;
		}
		else
		{
			financeValue=true;
		}
	}
	for ( var i = 1; i < selectedCheckBox.length; i++)
	{
		var objstr = document.getElementById("FINANCE" + selectedCheckBox[i]);
		var objValue;
		if(objstr==null)
		{ 
		 objValue=false;
		}
		else
		{
		 objValue=true;
		}
		financeValue = financeValue && objValue;
		
	}
	if (financeValue == true && canFinanceInitiate=='true') 
	{
		$('#btnReqFinance').unbind('click');
		ToggleAttribute("btnReqFinance", true, "href");
		$('#btnReqFinance').click(function()
				{
			acceptFinanceRecords('financeInvoices.form','frmMain');
				});
	} 
	else
	{
		ToggleAttribute("btnReqFinance", false, "href");
		$('#btnReqFinance').removeAttr('onclick').click(function()
		{});
		$('#btnReqFinance').unbind('click');
		
	}
	
}

function enableDisableRejectLink(isAuth)
{
	var rejectValue;
	if (selectedCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		var canAuth=selectedMakerArray[0];
		rejectValue = obj.canReject && isAuth && canAuth;
	}
	for ( var i = 1; i < selectedCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		var canAuth=selectedMakerArray[i];
		rejectValue = rejectValue && obj.canReject && isAuth && canAuth;
	}
	if (rejectValue == true && (CAN_AUTH == 'true')) 
	{
		$('#btnReject').unbind('click');
		ToggleAttribute("btnReject", true, "href");
		$('#btnReject').click(function()
				{
			getRejectPopup();
				});
	} 
	else
	{
		ToggleAttribute("btnReject", false, "href");
		$('#btnReject').removeAttr('onclick').click(function()
		{});
		$('#btnReject').unbind('click');
	}
}

function enableDisableDownloadLink()
{
	var downloadValue;
	if (selectedCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		downloadValue = obj.canDownload;
	}
	for ( var i = 1; i < selectedCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		downloadValue = downloadValue && obj.canDownload;
	}
	if (downloadValue == true) 
	{
		$('#btnDownload').unbind('click');
		ToggleAttribute("btnDownload", true, "href");
		$('#btnDownload').click(function()
		{
			invoiceDownload('invoiceDownload.seek','frmMain')
		});
	} 
	else
	{
		ToggleAttribute("btnDownload", false, "href");
		$('#btnDownload').removeAttr('onclick').click(function()
		{});
		$('#btnDownload').unbind('click');
		
	}
}

function enableDisableSendLink()
{
	
	var sendValue;
	if (selectedCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		sendValue = obj.canSend;
	}
	for ( var i = 1; i < selectedCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		sendValue = sendValue && obj.canSend;
	}
	if (sendValue == true &&(CAN_AUTH == 'true' || CAN_EDIT == 'true'))
	{
		$('#btnSend').unbind('click');
		ToggleAttribute("btnSend", true, "href");
		
		
		$('#btnSend').click(function()
		{
			sendInvoice('sendInvoice.form','frmMain');
		});
		
	}
	else
	{
		ToggleAttribute("btnSend", false, "href");
		$('#btnSend').removeAttr('onclick').click(function()
		{});
		$('#btnSend').unbind('click');
	}
}

function enableDisableSubmitLink()
{
	
	var submitValue;
	if (selectedCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		submitValue = obj.canSubmit;
	}
	for ( var i = 1; i < selectedCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		submitValue = submitValue && obj.canSubmit;
	}
	if (submitValue == true && CAN_EDIT == 'true')
	{
		$('#btnSubmit').unbind('click');
		ToggleAttribute("btnSubmit", true, "href");
		
		
		$('#btnSubmit').click(function()
		{
		  invoiceSubmit('submitInvoice.form','frmMain');
		});
		
	} 
	else
	{
		ToggleAttribute("btnSubmit", false, "href");
		$('#btnSubmit').removeAttr('onclick').click(function() 
		{
		});
		$('#btnSubmit').unbind('click');
	}
}

function enableDisableAcceptLink(canAccept)
{
	var acceptValue;
	
	if (selectedCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		var isAccept=selectedAcceptArray[0];
		if(isAccept=='false' || isAccept==false)
		{
		acceptValue = obj.canAccept && false;
		}
		else
		{
		acceptValue = obj.canAccept;
		}
		
	}
	for ( var i = 1; i < selectedCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		var isAccept=selectedAcceptArray[i];
		if(isAccept=='false')
		{
		 acceptValue = acceptValue && obj.canAccept && false;
		}
		else
		{
		 acceptValue = acceptValue && obj.canAccept;
		}
	}
	if (acceptValue == true && canAcceptanceInitiate == 'true' && canAccept == 'true')
	{
		$('#btnAccept').unbind('click');
		ToggleAttribute("btnAccept", true, "href");
		$('#btnAccept').click(function()
		{
				acceptInvoiceRecords('acceptInvoices.form','frmMain');
			
		});
	} 
	else
	{
		ToggleAttribute("btnAccept", false, "href");
		$('#btnAccept').removeAttr('onclick').click(function() 
		{
		});
		$('#btnAccept').unbind('click');
	}
}
function enableDisableVerifyLink(canVerify)
{
 
	var verifyValue;
	if (selectedCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		var isVerify=selectedVerifyArray[0];
		if(isVerify=='false')
		{
		 verifyValue = obj.canVerify && false;
		}
		else
		{
		 verifyValue = obj.canVerify;
		}
	}
	for ( var i = 1; i < selectedCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		var isVerify=selectedVerifyArray[i];
		if(isVerify=='false' || isVerify==false)
		{
		 verifyValue = verifyValue && obj.canVerify && false;
		}
		else
		{
		 verifyValue = verifyValue && obj.canVerify;
		}
	}
	if (verifyValue == true && canVerificationInitiate == 'true')
	{
		$('#btnVerify').unbind('click');
		ToggleAttribute("btnVerify", true, "href");
		$('#btnVerify').click(verifyInvoiceData);
	} 
	else
	{
		ToggleAttribute("btnVerify", false, "href");
		$('#btnVerify').removeAttr('onclick').click(function() 
		{
		});
		$('#btnVerify').unbind('click');
	}
}

function enableDisablePaymentLink()
{
		var paymentValue;
	if (selectedCheckBox.length > 0)
	{
		var objstr = document.getElementById("COLLECTION" + selectedCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		paymentValue = obj;
	}
	for ( var i = 1; i < selectedCheckBox.length; i++)
	{
		var objstr = document.getElementById("COLLECTION" + selectedCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		paymentValue = paymentValue && obj;
	}
	if(USERMODE=="BUYER")
	{
		canPaymentCollectionInitiate=canPaymentInitiate;
	}
	else if(USERMODE=="SELLER")
	{
		canPaymentCollectionInitiate=canCollectionInitiate;
	}
	if (paymentValue == true && canPaymentCollectionInitiate =='true')
	{
		$('#btnPayNow').unbind('click');
		ToggleAttribute("btnPayNow", true, "href");
		
		if(USERMODE=="BUYER")
		{
			$('#btnPayNow').click(function()
			{
				invoicePayments('invoicePayment.form','frmMain');
			});
		}
		else if(USERMODE=="SELLER")
		{
			$('#btnPayNow').click(function()
			{
				collectionInvoices('InvoiceCollectionCenter.form','frmMain');
			});
		}
	} 
	else
	{
		ToggleAttribute("btnPayNow", false, "href");
		$('#btnPayNow').removeAttr('onclick').click(function() 
		{
		});
		$('#btnPayNow').unbind('click');
	}
}
	
function enableDisableDirectDebitLink()
{
	var paymentValue;
	if (selectedCheckBox.length > 0)
	{
		var objstr = document.getElementById("COLLECTION" + selectedCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		paymentValue = obj;
	}
	for ( var i = 1; i < selectedCheckBox.length; i++)
	{
		var objstr = document.getElementById("COLLECTION" + selectedCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		paymentValue = paymentValue && obj;
	}
	if (paymentValue == true && canPaymentInitiate=='true')
	{
		$('#btnDirectDebit').unbind('click');
		ToggleAttribute("btnDirectDebit", true, "href");
		$('#btnDirectDebit').click(function()
				{
			invoicePayments('payDirectDebit.form','frmMain');
				});
	} 
	else
	{
		ToggleAttribute("btnDirectDebit", false, "href");
		$('#btnDirectDebit').removeAttr('onclick').click(function() 
		{
		});
		$('#btnDirectDebit').unbind('click');
	}
}

function ToggleAttribute(obj, DoEnable, TagName) 
{
    
	obj = document.getElementById(obj);
	if(null == obj )
	{
		return;
	}
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

function selectedInvoice(invIntRefNumber)
{
	tmpInvIntRefNumber = invIntRefNumber;
}

function invoiceSubmit(strUrl, frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("txtInvIntRefNum").value = selectedCheckBox;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	$('#btnSubmit').removeAttr('onclick');
	$('#btnSubmit').unbind('click');
	$('#btnSubmit').removeClass('black');
	$('#btnSubmit').addClass('grey');
	
}
function invoiceDelete(strUrl, frmId) 
{
	
	frm = document.getElementById(frmId);
	document.getElementById("txtInvIntRefNum").value = selectedCheckBox;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	$('#btnDelete').removeAttr('onclick').click(function(){});
	$('#btnDelete').unbind('click');
	$('#btnDelete').removeClass('black');
	$('#btnDelete').addClass('grey');
}
function invoiceDownload(strUrl, frmId) 
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtInvIntRefNum").value = selectedCheckBox;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}	

function authorizeInvoice(strUrl, frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("txtInvIntRefNum").value = selectedCheckBox;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	$('#btnAuth').removeAttr('onclick');
	$('#btnAuth').unbind('click');
	$('#btnAuth').removeClass('black');
	$('#btnAuth').addClass('grey');
}
function acceptInvoiceRecords(strUrl, frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("txtInvIntRefNum").value = selectedCheckBox;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	$('#btnAccept').removeAttr('onclick').click(function(){});
	$('#btnAccept').unbind('click');
	$('#btnAccept').removeClass('black');
	$('#btnAccept').addClass('grey');
}

function acceptFinanceRecords(strUrl, frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("txtInvIntRefNum").value = selectedCheckBox;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	$('#btnReqFinance').removeAttr('onclick').click(function(){});
	$('#btnReqFinance').unbind('click');
	$('#btnReqFinance').removeClass('black');
	$('#btnReqFinance').addClass('grey');
}

function invoiceVerify(strUrl, frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("txtInvIntRefNum").value = selectedCheckBox;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function sendInvoice(strUrl, frmId) 
{
	frm = document.getElementById(frmId);
	document.getElementById("txtInvIntRefNum").value = selectedCheckBox;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	$('#btnSend').removeAttr('onclick');
	$('#btnSend').unbind('click');
	$('#btnSend').removeClass('black');
	$('#btnSend').addClass('grey');
}

function editInvoiceData(strUrl, frmId, invoiceInternalReferenceNumber) 
{
	frm = document.getElementById(frmId);
	document.getElementById("txtInvNum").value = invoiceInternalReferenceNumber;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function addInvoice(strUrl, frmId, productCode, productName, productRelClient, productWorkflow, prodClient)
{
	frm = document.getElementById(frmId);
	document.getElementById("txtProductCode").value = productCode;
	document.getElementById("txtProductName").value = productName;
	document.getElementById("txtProductWorkflow").value = productWorkflow;	
	document.getElementById("txtProductRelClient").value = productRelClient;
	document.getElementById("txtProductClient").value = prodClient;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function sendViewedInvoice(strUrl, frmId, viewedInvoiceInternalReferenceNumber)
{
	frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function authorizeViewedInvoice(strUrl, frmId, viewedInvoiceInternalReferenceNumber)
{
	frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function submitViewedInvoice(strUrl, frmId, viewedInvoiceInternalReferenceNumber)
{
	frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function rejectViewedInvoice(strUrl, frmId, viewedInvoiceInternalReferenceNumber)
{
	frm = document.getElementById(frmId);
	document.getElementById("txtAreaRejectRemarks").value=document.getElementById("txtAreaRejectRemark").value;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function checkUncheck(field,headerCheckbox)
{
		selectedCheckBox.splice(0, selectedCheckBox.length);
		selectedVerifyArray.splice(0, selectedVerifyArray.length);
		selectedAcceptArray.splice(0, selectedAcceptArray.length);
		selectedMakerArray.splice(0, selectedMakerArray.length);
		
	if(headerCheckbox.checked==true && field.length >0)
	{
		for (i = 0; i < field.length; i++)
		{
			field[i].checked = true ;
			selectedCheckBox[selectedCheckBox.length]=field[i].getAttribute("id");
			selectedVerifyArray[selectedVerifyArray.length]=objVerifyData[i+1];
			selectedAcceptArray[selectedAcceptArray.length]=objAcceptData[i+1];
			selectedMakerArray[selectedMakerArray.length]=objMakerData[i+1];
		}
	}
	else if(field.length >0)
	{
		for (i = 0; i < field.length; i++)
		{
			field[i].checked = false ;
		}
		selectedCheckBox.splice(0, selectedCheckBox.length);
		selectedVerifyArray.splice(0, selectedVerifyArray.length);
		selectedAcceptArray.splice(0, selectedAcceptArray.length);
		selectedMakerArray.splice(0, selectedMakerArray.length);
	}
	else if(headerCheckbox.checked==true)
	{
	        field.checked = true ;
	        selectedCheckBox[selectedCheckBox.length]=field.getAttribute("id");
			selectedVerifyArray[selectedVerifyArray.length]=objVerifyData[1];
			selectedAcceptArray[selectedAcceptArray.length]=objAcceptData[1];
			selectedMakerArray[selectedMakerArray.length]=objMakerData[1];
	}
	else
	{
	    field.checked = false ;
		selectedCheckBox.splice(0, selectedCheckBox.length);
		selectedVerifyArray.splice(0, selectedVerifyArray.length);
		selectedAcceptArray.splice(0, selectedAcceptArray.length);
		selectedMakerArray.splice(0, selectedMakerArray.length);
	}
	enableDisableAuthorizeLink(true);
	enableDisableSubmitLink();
	enableDisableSendLink();
	enableDisableRejectLink(true);
	enableDisableDownloadLink();
	if(USERMODE=="BUYER")
	{
	  enableDisableAcceptLink();
	  enableDisableDirectDebitLink();
	  enableDisablePaymentBondLink();
	}
	else if(USERMODE=="SELLER")
	{
	   enableDisableVerifyLink();
	}
}

function showInvoiceLineDetails(frmId,strUrl,invIntRefNumber,detailSerialNumber)
{
	frm = document.getElementById(frmId);
	document.getElementById("txtViewedInvIntRefNum").value = invIntRefNumber;
	document.getElementById("txtViewedInvDetailSerialNum").value = detailSerialNumber;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function viewInvoiceAttachment(strUrl, frmId, invoiceInternalRefNumber, enrichcode)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtInvNum").value = invoiceInternalRefNumber;
	document.getElementById("txtItemNo").value = enrichcode;	
	frm.action = strUrl;
	frm.target = "hWinSeek";
	frm.method = "POST";
	var strAttr;
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=400,height=350";
	window.open ("", "hWinSeek", strAttr);
	frm.submit();
	frm.target = "";
}

jQuery.fn.dateTextBox = function() {
	return this
			.each(function() {
				$(this)
						.keydown(function(e) {
							var key = e.charCode || e.keyCode || 0;
							// allow backspace, tab, delete, arrows, numbers and
							// keypad for TAB
							return (key == 9 || key==8 || key==46);
							})
			})
};

jQuery.fn.pagerTextBox = function() {
	return this
			.each(function() {
				$(this)
						.keyup(function(e) {
							// Allow Enter key
							if(e.keyCode==13)
							{
								javascript:_pager.goToPage(this, 'invoiceCenter', 'frmMain');
							}
							})
			})
};

function verifyInvoiceRecord(rowIndex)
{
	selectedCheckBox.splice(0, selectedCheckBox.length);
	selectedCheckBox[0] = rowIndex;
	verifyInvoiceData();
}
function verifyInvoiceData() 
{
	
	$('#verifyPopup').dialog( {
		autoOpen : false,
		height : 150,
		width : 420,
		modal : true,
		buttons : {
				"Cancel" : function() 
				{
					for (i = 0; i < selectedCheckBox.length; i++)
					{
						document.getElementById(selectedCheckBox[i]).checked = false;
					}
					selectedCheckBox.splice(0, selectedCheckBox.length);
				$(this).dialog("close");
				},
				
				"Accept":function() 
				{
					acceptInvoiceVerification('addAcceptVerification.form','frmMain');
					$(this).dialog("close");
				},
				
				"Reject":function() {
					rejectInvoiceVerification('addRejectVerification.form','frmMain');
					$(this).dialog("close");
				}
		}
	});
	 $('#verifyPopup').bind('dialogclose', function(event) {
		 for (i = 0; i < selectedCheckBox.length; i++)
			{
				document.getElementById(selectedCheckBox[i]).checked = false;
			}
			selectedCheckBox.splice(0, selectedCheckBox.length);
		
			ToggleAttribute("btnVerify", false, "href");
	 });
	$('#verifyPopup').dialog("open");
	$('#btnVerify').removeAttr('onclick').click(function(){});
	$('#btnVerify').unbind('click');
	ToggleAttribute("btnVerify", false, "href");
	
}

function verifyInvoiceDataFromInvoiceView() 
{
	
	$('#verifyPopup').dialog( {
		autoOpen : false,
		height : 150,
		width : 420,
		modal : true,
		buttons : {
				"Cancel" : function() {
				$(this).dialog("close");
				},
				"Accept":function() 
				{
					acceptInvoiceVerification('addAcceptVerificationOfViewdInvoice.form','frmMain');
				},
				"Reject":function() {
					
					rejectInvoiceVerification('addRejectVerificationOfViewdInvoice.form','frmMain');
					
				}
		}
	});
	$('#verifyPopup').dialog("open");
	
}

function acceptInvoiceVerification(strUrl, frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("txtInvIntRefNum").value = selectedCheckBox;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function rejectInvoiceVerification(strUrl, frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("txtInvIntRefNum").value = selectedCheckBox;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function  fromDate_TextChanged(element,defaultFromDate)
{
     var dateValue=$(element).val();
	 if (dateValue !='' || dateValue != null)
      {
		  $(element).removeClass('grey');;
		 $(element).addClass('black');
	  }
	  if((dateValue == '' || dateValue == null))
       {
		 $(element).removeClass('black');;
		 $(element).addClass('grey');
		 $(element).val(defaultFromDate);
	   }
}
function  toDate_TextChanged(element,defaultToDate)
{
     var dateValue=$(element).val();
     if (dateValue !='' || dateValue != null)
      {
		     $(element).removeClass('grey');;
			 $(element).addClass('black');
	  }
	  if((dateValue == '' || dateValue == null))
       {
		 $(element).removeClass('black');;
		 $(element).addClass('grey');
		 $(element).val(defaultToDate);
	   }
}

function enableDisablePaymentBondLink(isPaymentBond)
{
	var financeValue;
	if (selectedCheckBox.length > 0)
	{
		var objstr = document.getElementById("PAYMENTBOND" + selectedCheckBox[0]);
		if(objstr==null)
		{ 
			financeValue=false;
		}
		else
		{
			financeValue=true;
		}
	}
	for ( var i = 1; i < selectedCheckBox.length; i++)
	{
		var objstr = document.getElementById("PAYMENTBOND" + selectedCheckBox[i]);
		var objValue;
		if(objstr==null)
		{ 
		 objValue=false;
		}
		else
		{
		 objValue=true;
		}
		financeValue = financeValue && objValue;
		
	}
	if (financeValue == true && canFinanceInitiate=='true') 
	{
		$('#btnPaymentBond').unbind('click');
		ToggleAttribute("btnPaymentBond", true, "href");
		$('#btnPaymentBond').click(function()
				{
			acceptPaymentBondRecords('paymentBondInvoices.form','frmMain');
				});
	} 
	else
	{
		ToggleAttribute("btnPaymentBond", false, "href");
		$('#btnPaymentBond').removeAttr('onclick').click(function()
		{});
		$('#btnPaymentBond').unbind('click');
		
	}
	
}

function showPaymentBondEntry(strUrl,frmId,index)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtInvIntRefNum").value =index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function acceptPaymentBondRecords(strUrl, frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("txtInvIntRefNum").value = selectedCheckBox;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	$('#btnPaymentBond').removeAttr('onclick').click(function(){});
	$('#btnPaymentBond').unbind('click');
	$('#btnPaymentBond').removeClass('black');
	$('#btnPaymentBond').addClass('grey');
}
function getAdvancedFilterPopup(strUrl, frmId) {
	$('#advancedFilterPopup').dialog({
		autoOpen : false,
		maxHeight: 580,
		minHeight: (screen.width) > 1024 ? 156 : 0 ,
		width : 840,
		dialogClass: 'ft-dialog',
		resizable: false,
		draggable: false,
		title : getLabel('advancedFilter','Advanced Filter'),
		modal : true,
	open:function(){
			var buyerSellerLbl = getLabel('buyer','Buyer'),buyerSellerPlaceholder = getLabel('searchbybuyer','Search By Buyer');
      	  if(selectedFilterLoggerDesc =='BUYER'){
      	  	 buyerSellerLbl=getLabel('seller','Seller'),buyerSellerPlaceholder=getLabel('searchbyseller','Search By Seller');
      	  }
      	  $('#buyerSellerLbl').text(buyerSellerLbl);
      	  $('#dropdownClientCodeDescription').attr('placeholder',buyerSellerPlaceholder);
      	  $('#advancedFilterPopup').dialog('option', 'position', 'center');
      },
	  close : function(){
	  }
	});
	$('#advancedFilterPopup').dialog("open");

}

jQuery.fn.ClientCodeAutoCompleter = function() {
	var buyerSellerUrl = "services/userseek/invoiceReconReceiptSeekBuyerSeller";
	return this.each(function() {
					$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : buyerSellerUrl,
									dataType : "json",
									type:'POST',
									data : {
										$filtercode1: selectedFilterClient,										
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
function setReceiptDateDropDownMenu(renderToElementId){
	$('#'+renderToElementId).empty();
		dropDownContainer=Ext.create('Ext.Container', {
				itemId : 'receiptDateContainer',
				renderTo:renderToElementId,
				items : [{
								xtype : 'label',
								forId:'receiptDateLabel',
								text:getLabel('receiptDateLabel','Receipt Date'),
								listeners: {
								       render: function(c) {
								    	   			var tip = Ext.create('Ext.tip.ToolTip', {
								    	   							xtype : 'tooltip',
												            	    target: c.getEl(),
												            	    listeners:{
												            	    	beforeshow:function(tip){
												            	    		if(receipt_date_opt === null)
													            	    		tip.update(getLabel('receiptDateLabel','Receipt Date'));
													            	    	else
													            	    		tip.update(getLabel('receiptDateLabel','Receipt Date')+ receipt_date_opt);

												            	    	}
												            	    }
								        			});
								       	}	
								}
							},{
								xtype : 'button',
								border : 0,
								itemId : 'receiptDateDateButton',
								cls : 'ui-caret-dropdown',
								listeners : {
									click:function(event){
											var menus=getDateDropDownItems("receiptDate",this);
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
function hideErrorPanel(errorDivId){
	if($(errorDivId).is(':visible')){
		$(errorDivId).addClass('ui-helper-hidden');
	}
}

function handleAmountOperatorChange(me){
	var selectedAmountOperator=$("#amountOperator").val();
	if(selectedAmountOperator=='bt'){
		$("#msAmountLabel").text(getLabel("amountFrom","Amount From"));
		$("#amountTo").removeClass("hidden");
	}else{
		$("#msAmountLabel").text(getLabel("receiptAmount","Amount"));
		$("#amountTo").addClass("hidden");
	}
}

function handleReceiptReconcilableAmountOperatorChange(me){
	var selectedReconcilableAmountOperator=$("#receiptReconcilableAmountOperator").val();
	if(selectedReconcilableAmountOperator=='bt'){
		$("#msReconciliationAmountLabel").text(getLabel("reconAmountFrom","Reconciliation Amount From"));
		$("#reconcilableamountTo").removeClass("hidden");
	}else{
		$("#msReconciliationAmountLabel").text(getLabel("reconAmount","Reconciliation Amount"));
		$("#reconcilableamountTo").addClass("hidden");
	}
}

function getAdvancedFilterValueJson(FilterCodeVal){
	var jsonArray = [];

	//Client
	var clientCodesData =$("select[id='msClient']").getMultiSelectValueString(); 	
	selectedClientDesc=$("#msClient option:selected").text()
	var tempCodesData=clientCodesData;
	var selClientDesc = selectedClientDesc;
	if (!Ext.isEmpty(tempCodesData)) {
		if(!Ext.isEmpty(filterClientCount)){
			var clientCodeArray=clientCodesData.split(',');
			if(filterClientCount==clientCodeArray.length)
				tempCodesData='all';
		}
		if((tempCodesData!='all' && tempCodesData!='ALL') && selClientDesc != 'All companies'){
		jsonArray.push({
					field : 'Client',
					operator : 'eq',
					value1 : encodeURIComponent(tempCodesData.replace(new RegExp("'", 'g'), "\''")),
					dataType : 'S',
					displayType : 5,
					fieldLabel : getLabel('companyName','Comapny Name'),
					displayValue1 : selClientDesc
				});
		}
	}
	
	
	//receipt Reference
	var receiptReference = $("#txtReceipt").val();
	if (!Ext.isEmpty(receiptReference)) {
		jsonArray.push({
					field : 'ReceiptReference',
					operator : 'lk',
					value1 : encodeURIComponent(receiptReference.replace(new RegExp("'", 'g'), "\''")),
					value2 : '',
					dataType : 0,
					displayType : 0,
					fieldLabel : getLabel('receiptNumber','Receipt Number')
				});
	}
	
	//receipt Date
	if(!jQuery.isEmptyObject(selectedReceiptDate)){
			jsonArray.push({
						field : 'ReceiptDate',
						operator : selectedReceiptDate.operator,
						value1 : Ext.util.Format.date(selectedReceiptDate.fromDate, 'Y-m-d'),
						value2 : (!Ext.isEmpty( selectedReceiptDate.toDate))? Ext.util.Format.date(selectedReceiptDate.toDate, 'Y-m-d'): '',
						dataType : 1,
						displayType : 6,// 5,
						fieldLabel : getLabel('receiptDate','Receipt Date')
					});
	}

	//receipt amount
	var receiptAmountFrom=$("#txtAmount").val();
	if(!Ext.isEmpty(receiptAmountFrom)){
		var receiptAmountOperator = $("#amountOperator").val();
		var receiptAmountTo=$("#receiptAmountFieldTo").val();
		if (!Ext.isEmpty(receiptAmountOperator)) {
			jsonArray.push({
						field : 'ReceiptAmount',
						operator : receiptAmountOperator,							
						value1 : receiptAmountFrom,
						value2 : receiptAmountTo,
						dataType : 2,
						displayType :2,// 3,
						fieldLabel : getLabel('amount','Receipt Amount')
					});
		}
	}

	//receipt reconciable amount
	var receiptReconAmountFrom=$("#txtReconcilableAmount").val();
	if(!Ext.isEmpty(receiptReconAmountFrom)){
		var receiptReconAmountOperator = $("#receiptReconcilableAmountOperator").val();
		var receiptReconAmountTo=$("#receiptReconcilableAmountFieldTo").val();
		if (!Ext.isEmpty(receiptReconAmountOperator)) {
			jsonArray.push({
						field : 'ReceiptReconciableAmount',
						operator : receiptReconAmountOperator,							
						value1 : receiptReconAmountFrom,
						value2 : receiptReconAmountTo,
						dataType : 2,
						displayType :2,// 3,
						fieldLabel : getLabel('amount','Receipt Reconcialble Amount')
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
						fieldLabel : getLabel('liquidatationstatus','Liquidation Status'),
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
	
	objJson = {};
	objJson.filterBy = jsonArray;
	if (FilterCodeVal && !Ext.isEmpty(FilterCodeVal))
		objJson.filterCode = FilterCodeVal;
	
	return objJson;	
}

function getAdvancedFilterQueryJson(FilterCodeVal){
	var objJson = null;
	var jsonArray = [];

	
	//Client
	var clientCodesData =$("select[id='msClient']").getMultiSelectValueString(); 
	selectedClientDesc=$("#msClient option:selected").text();
	var tempCodesData=clientCodesData;
	var selClientDesc = selectedClientDesc;
	if (!Ext.isEmpty(tempCodesData)) {
		if(!Ext.isEmpty(filterClientCount)){
			var clientCodeArray=clientCodesData.split(',');
			if(filterClientCount==clientCodeArray.length)
				tempCodesData='all';
		}
		if((tempCodesData!='all' && tempCodesData!='ALL') && selClientDesc != 'All companies'){
		jsonArray.push({
					field : 'Client',
					operator : 'eq',
					value1 : encodeURIComponent(tempCodesData.replace(new RegExp("'", 'g'), "\''")),
					dataType : 'S',
					displayType :5,
					fieldLabel : getLabel('companyName','Company Name'),
					displayValue1 : selClientDesc
				});
		}
	}
	
	//receipt Reference
	var receiptReference = $("#txtReceipt").val();
	if (!Ext.isEmpty(receiptReference)) {
		jsonArray.push({
					field : 'ReceiptReference',
					operator : 'lk',
					value1 : encodeURIComponent(receiptReference.replace(new RegExp("'", 'g'), "\''")),
					value2 : '',
					dataType : 0,
					displayType : 0,
					fieldLabel : getLabel('receiptNumber','Receipt Number')
				});
	}
	
	//receipt Date
	if(!jQuery.isEmptyObject(selectedReceiptDate)){
			jsonArray.push({
						field : 'ReceiptDate',
						operator : selectedReceiptDate.operator,
						value1 : Ext.util.Format.date(selectedReceiptDate.fromDate, 'Y-m-d'),
						value2 : (!Ext.isEmpty( selectedReceiptDate.toDate))? Ext.util.Format.date(selectedReceiptDate.toDate, 'Y-m-d'): '',
						dataType : 1,
						displayType : 6,// 5,
						fieldLabel : getLabel('receiptDate','Receipt Date')
					});
	}

	//receipt amount
	var blnAutoNumeric = true;
	blnAutoNumeric = isAutoNumericApplied("txtAmount");
	if (blnAutoNumeric)
		receiptAmountFrom = $("#txtAmount").autoNumeric('get');
	else
		receiptAmountFrom = $("#txtAmount").val();
	
	if(!Ext.isEmpty(receiptAmountFrom)){
		var receiptAmountOperator = $("#amountOperator").val();
	
		blnAutoNumeric = isAutoNumericApplied("receiptAmountFieldTo");
		if (blnAutoNumeric)
			receiptAmountTo = $("#receiptAmountFieldTo").autoNumeric('get');
		else
			receiptAmountTo = $("#receiptAmountFieldTo").val();
		if (!Ext.isEmpty(receiptAmountOperator)) {
			jsonArray.push({
						field : 'ReceiptAmount',
						operator : receiptAmountOperator,							
						value1 : receiptAmountFrom,
						value2 : receiptAmountTo,
						dataType : 2,
						displayType :2,// 3,
						fieldLabel : getLabel('amount','Receipt Amount')
					});
		}
	}

	//receipt reconciable amount
	var blnAutoNumeric = true;
	blnAutoNumeric = isAutoNumericApplied("txtReconcilableAmount");
	if (blnAutoNumeric)
		receiptReconAmountFrom = $("#txtReconcilableAmount").autoNumeric('get');
	else
		receiptReconAmountFrom = $("#txtReconcilableAmount").val();
	
	if(!Ext.isEmpty(receiptReconAmountFrom)){
	
		var receiptReconAmountOperator = $("#receiptReconcilableAmountOperator").val();
	
		blnAutoNumeric = isAutoNumericApplied("receiptReconcilableAmountFieldTo");
		if (blnAutoNumeric)
			receiptReconAmountTo = $("#receiptReconcilableAmountFieldTo").autoNumeric('get');
		else
			receiptReconAmountTo = $("#receiptReconcilableAmountFieldTo").val();
		if (!Ext.isEmpty(receiptReconAmountOperator)) {
			jsonArray.push({
						field : 'ReceiptReconciableAmount',
						operator : receiptReconAmountOperator,							
						value1 : receiptReconAmountFrom,
						value2 : receiptReconAmountTo,
						dataType : 2,
						displayType :2,// 3,
						fieldLabel : getLabel('amount','Receipt Reconcialble Amount')
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
						fieldLabel : getLabel('liquidatationstatus','Liquidation Status'),
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
	
	
	
	objJson = jsonArray;
	
	return objJson;	
}
function isAutoNumericApplied(strId) {
	var isAutoNumericApplied = false;
	$.each(($('#'+strId).data('events')||[]), function(i, event) {
				if (isAutoNumericApplied === true)
					return false;
				$.each(event, function(i, eventHandler) {
							if (eventHandler.namespace === 'autoNumeric')
								isAutoNumericApplied = true;
							return false;
						});
			});
	return isAutoNumericApplied;
}

function setSavedFilterComboItems(element){
	$(element).empty();
	$.ajax({
		url : 'services/userfilterslist/ReceiptAdvFilter'+selectedFilterLoggerDesc+'.json',
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

function setStatusMenuItems(elementId) {
	$("#"+elementId).empty();
	var el = $("#"+elementId).multiselect();
	el.attr('multiple',true);
	if (typeof arrLiquidationStatus != 'undefined' && arrLiquidationStatus) {
		for(index=0;index<arrLiquidationStatus.length;index++)
		{
			var opt = $('<option />', {
				value: arrLiquidationStatus[index].code,
				text: arrLiquidationStatus[index].desc
			});
			opt.attr('selected','selected');	
			opt.appendTo(el);
		}
		el.multiselect('refresh');
		filterStatusCount=arrLiquidationStatus.length;
	}	
}

function changeBuyerOrSellerAndRefreshGrid(selectedLoggerCode,
		selectedLoggerDescription) {
	selectedFilterLogger = selectedLoggerCode;
	selectedFilterLoggerDesc = selectedLoggerCode;
	$(document).trigger("handleLoggerChangeInQuickFilter", false);
	
}

function resetAllMenuItemsInMultiSelect(elementId)
{
	$(elementId+' option').prop('selected', true);
	$(elementId).multiselect("refresh");
}

function setClientMenuItems(elementId){
	$.ajax({
		url : 'services/userseek/userclients.json',
		success : function(responseText) {
			var responseData=responseText.d.preferences;
			var defaultOpt = $('<option />', {
				value : "all",
				text : getLabel('allCompanies', 'All companies')
				});
			defaultOpt.appendTo(elementId);
			$.each(responseData,function(index,item){
				$(elementId).append($('<option>', { 
					value: responseData[index].CODE,
					text : responseData[index].DESCR
					}));
			});
			filterClientCount=$(elementId+" option").length;
			$("#msClient").niceSelect();
		}
		
	});	
}

function resetValuesOnClientChange(){
	blnClientSelectionChanged=true;
	selectedClient=$("#msClient").val();
	if(!isEmpty(selectedClient) && 'all' !=selectedClient)
		selectedClientDesc=$("#msClient option:selected").text();
	else{
		selectedClient='';
		selectedClientDesc='';
	}	
	//selectedClient=strClient;
	if(!isEmpty(selectedClient)){
		$("#dropdownClientCodeDescription").val("");
		$("#dropdownClientCode").val("");
	}
}

function changeClientAndRefreshGrid(selectedClientCode,
		selectedClientDescription) {
	selectedFilterClient = selectedClientCode;
	selectedFilterClientDesc = selectedClientDescription;
	$(document).trigger("handleClientChangeInQuickFilter", false);
	
}