_strInvalidPage="Invalid Page Number";
function showErrorPopup() {
	
	$('#errorsPopup').dialog( {
		autoOpen : true,
		height : 220,
		width : 473,
		modal : true,
		buttons : {
				"OK" : function() {
					$(this).dialog('close');
					if(MODE=='VERIFY' && (POACTION=='Accept' || POACTION=='Reject') && !existErrors())
					{
						goToPage("poVerificationCenter.form","frmMain");
					}
					else if(POACTION=='Finance' && !existErrors())
					{
						goToPage("poFinanceCenter.form","frmMain");
					}
					else if(POACTION=='Payment_Bond' && !existErrors())
					{
						goToPage("poFinanceCenter.form","frmMain");
					}
					else if(POACTION=='Accept' && !existErrors())
					{
						goToPage("poAcceptanceCenter.form","frmMain");
					}
				}
		}
	});
	$('#errorsPopup').dialog('open');
	$('.ui-dialog-buttonset button:eq(0)').focus();
}
function goToPage(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	if($("#txtPOCenterClientDesc").length)
	{
		if($('#txtPOCenterClientDesc').val()== null || $('#txtPOCenterClientDesc').val()=='')
		{
			$('#txtPOCenterClientCode').val('');
		}
		else
		{
			if($('#txtPOCenterClientCode').val()== null || $('#txtPOCenterClientCode').val()=='')
			{
				//$('#txtPOCenterClientCode').val($('#txtPOCenterClientDesc').val());  
			}		  
		}
	 }
	 if(poEnteredByClientCode && !isEmpty(poEnteredByClientCode))
	  frm.appendChild(createFormField('INPUT', 'HIDDEN', 'poEnteredByClient',	poEnteredByClientCode));
	  if(counterPartyName && !isEmpty(counterPartyName))
	   frm.appendChild(createFormField('INPUT', 'HIDDEN', 'counterPartyName',	counterPartyName));
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
		txtInvIntRefNumstr=txtInvIntRefNumstr+selectedCheckBox[i];
	}
	document.getElementById("txtPoPayIntRefNum").value =txtInvIntRefNumstr;
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
	if(USERMODE=="SELLER")
	{
	  enableDisableAcceptLink(canAccept);
	  enableDisableDirectDebitLink();
	}
	else if(USERMODE=="BUYER")
	{
	  enableDisableVerifyLink(canVerify);
	  enableDisablePaymentBondLink();
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
			authorizeInvoice('authPurchaseOrder.form','frmMain');
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
			invoiceDelete('deletePurchaseOrder.form','frmMain')
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
			acceptFinanceRecords('financePurchaseOrders.form','frmMain');
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
			invoiceDownload('purchaseOrderDownload.seek','frmMain')
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
			sendInvoice('sendPurchaseOrder.form','frmMain');
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
		  invoiceSubmit('submitPurchaseOrder.form','frmMain');
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
				acceptInvoiceRecords('acceptPurchaseOrders.form','frmMain');
			
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
				invoicePayments('purchaseOrdrPayment.form','frmMain');
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
	frm.method = "POST";
	frm.submit();
	frm.target = "";
	$('#btnDownload').removeAttr('onclick').click(function(){});
	$('#btnDownload').unbind('click');
	$('#btnDownload').removeClass('black');
	$('#btnDownload').addClass('grey');
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

function addInvoice(strUrl, frmId, productCode, productName, productRelClient, productWorkflow,prodClient)
{
	frm = document.getElementById(frmId);
	document.getElementById("txtProductCode").value = productCode;
	document.getElementById("txtProductName").value = productName;
	document.getElementById("txtProductWorkflow").value = productWorkflow;
	document.getElementById("txtProductRelClient").value = productRelClient;
	document.getElementById("txtProductClient").value = prodClient;
	document.getElementById("txtClientMode").value = selectedFilterLoggerDesc;
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
	if(USERMODE=="SELLER")
	{
	  enableDisableAcceptLink();
	  enableDisableDirectDebitLink();
	  enableDisablePaymentBondLink();
	}
	else if(USERMODE=="BUYER")
	{
	   enableDisableVerifyLink();
	   enableDisablePaymentBondLink(true);
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
	frm.submit();
	
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
		draggable : false,
		buttons : {
				"Cancel" : function() {
					for (i = 0; i < selectedCheckBox.length; i++)
					{
						document.getElementById(selectedCheckBox[i]).checked = false;
					}
					selectedCheckBox.splice(0, selectedCheckBox.length);
				
				$(this).dialog("close");
				},
				
				"Accept":function() 
				{
					acceptInvoiceVerification('addAcceptPoVerification.form','frmMain');
					$(this).dialog("close");
				},
				
				"Reject":function() {
					rejectInvoiceVerification('addRejectPoVerification.form','frmMain');
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
		draggable:false,
		buttons : {
				"Cancel" : function() {
				$(this).dialog("close");
				},
				"Accept":function() 
				{
					acceptInvoiceVerification('addAcceptVerificationOfViewdPo.form','frmMain');
				},
				"Reject":function() {
					
					rejectInvoiceVerification('addRejectVerificationOfViewdPo.form','frmMain');
					
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

function addInvoiceFromPo(strUrl, frmId, productCode, productName, productRelClient, productWorkflow, poReference, dealerVendorCode,poInternalReference, myClient)
{
	frm = document.getElementById(frmId);
	document.getElementById("txtProductCode").value = productCode;
	document.getElementById("txtProductName").value = productName;
	document.getElementById("txtProductWorkflow").value = productWorkflow;
	document.getElementById("txtProductRelClient").value = productRelClient;
	document.getElementById("txtPoRef").value = poReference;
	document.getElementById("txtPoInternalReference").value = poInternalReference;
	document.getElementById("dealerVendorFromPO").value = dealerVendorCode;
	document.getElementById("txtProductClient").value = myClient;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
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
			acceptPaymentBondRecords('paymentBondPurchaseOrders.form','frmMain');
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

function showPaymentBondEntry(strUrl,frmId,index)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtInvIntRefNum").value =index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showPayment(strUrl, frmId, index)
{
	document.getElementById("txtPoPayIntRefNum").value =index;
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
jQuery.fn.clientCodeSeekAutoComplete= function() {
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
								$('#txtPOCenterClientDesc').val(data.DESCR);
								$('#txtPOCenterClientCode').val(data.CODE);
							}
						}
						goToPage('simpleFilterPurchaseOrder.form','frmMain');
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

function getPOProductPopUp() {
	$('#productPopup').dialog( {
		autoOpen : false,
		resizable : false,
		width : 480,
		height : 350,
		modal : true,
		position : [ 'center', 'middle' ],
		buttons : {
			"Cancel" : function() {
				$(this).dialog("close");
			}
		},
		open:function(){
			$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset').addClass('nofloating centerAlign');
			$('.ui-dialog-buttonpane').find('button:contains("Cancel")').attr("title","Cancel");
            $('.ui-dialog-buttonpane').find('button:contains("Cancel")').find('.ui-button-text').prepend('<span class="fa fa-minus-circle">&nbsp;&nbsp</span>');
		}
	});
	if(selectedFilterLoggerDesc == 'BUYER')
	{
		$('#pSellersDiv').show();
		$('#pBuyersDiv').hide();
		
		$('#tBuyersDiv').hide();
		$('#tSellersDiv').show();
	}
	else
	{
		$('#pSellersDiv').hide();
		$('#pBuyersDiv').show();
		
		$('#tBuyersDiv').show();
		$('#tSellersDiv').hide();
	}
	$('#productPopup').dialog("open");
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

function getAdvancedFilterSortByJson()
{
}

function showVerifyPopup(arrSelectedRecords) {
	$('#verifyPopup').dialog( {
		autoOpen : false,
		resizable : false,
		width : 480,
		height : 'auto',
		modal : true,
		draggable : false,
		position : [ 'center', 'middle' ],
		open:function(){
			$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset').addClass('nofloating centerAlign');
			$('.ui-dialog-buttonpane').find('button:contains("Cancel")').attr("title","Cancel");
            $('.ui-dialog-buttonpane').find('button:contains("Cancel")').find('.ui-button-text').prepend('<span class="fa fa-minus-circle">&nbsp;&nbsp</span>');
		}
	});
	$('#verifyPopup').dialog("open");
	
	$('#poRejectButton').unbind('click');
	$('#poRejectButton').click(function(){
		$(document).trigger('handlePOverifyAction', ['services/purchaseOrder/verifyReject.json', arrSelectedRecords, 'verifyReject']);
		$('#verifyPopup').dialog("close");
	});
	
	$('#poAcceptButton').unbind('click');
	$('#poAcceptButton').click(function(){
		$(document).trigger('handlePOverifyAction', ['services/purchaseOrder/verifyAccept.json', arrSelectedRecords, 'verifyAccept']);
		$('#verifyPopup').dialog("close");
	});
	
	$('#poCancelButton').unbind('click');
	$('#poCancelButton').click(function(){
		$('#verifyPopup').dialog("close");
	});
}
