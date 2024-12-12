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
								$('#txtBillMyClientDesc').val(data.DESCR);
								$('#txtBillMyClientCode').val(data.CODE);
							}
							simpleFilter('frmMain');
						}
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
function changeBillPage(navType, newPage) 
{
	var frm = document.getElementById('frmMain');
	if (!frm) 
	{
		alert(_errMessages.ERR_NOFORM);
		return false;
	}	
	var curPage=$('.pcontrol input', this.pDiv).val();
	var totPage='<c:out value="${total_pages}"/>';		
	switch(navType) 
	{
		case 'first':
		frm.action = 'importBillCenter_first.form';
		break;
		case 'prev':
		frm.action = 'importBillCenter_previous.form';
		break;
		case 'next':
		if(curPage>=totPage)
			return false;
		frm.action = 'importBillCenter_next.form';
		break;
		case 'last':
		frm.action = 'importBillCenter_last.form';
		break;
		case 'input':
		$('#page_number').val(curPage);
		frm.action = 'importBillCenter_goto.form';
		break;
		default:
			alert(_errMessages.ERR_NAVIGATE);
			return false;
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function changeSort(sortCol, sorOrd, colId)
{
	var frm = document.getElementById('frmMain');
	if (!frm) 
	{
		alert(_errMessages.ERR_NOFORM);
		return false;
	}
	if(!isEmpty(colId))
	{
		document.getElementById("txtSortColId").value = colId;
		if(!isEmpty(sortCol))
		{
			document.getElementById("txtSortColName").value = sortCol;
		}
		if(!isEmpty(sorOrd))
		{
			document.getElementById("txtSortOrder").value = sorOrd;			
		}
		frm.action = "sortImportBillList.form";
		frm.target = "";
		frm.method = "POST";
		frm.submit();		
	}
}
function goToPage(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function simpleFilter(frmId)
{
	var frm = document.getElementById(frmId);
	
	if($("#txtBillMyClientDesc").length)
	{
		if($('#txtBillMyClientDesc').val()== null || $('#txtBillMyClientDesc').val()=='')
		{
			$('#txtBillMyClientCode').val('');
		}
		else
		{
			if($('#txtBillMyClientCode').val()== null || $('#txtBillMyClientCode').val()=='')
			{
				$('#txtBillMyClientCode').val($('#txtBillMyClientDesc').val());  
			}		  
		}
	 }
	
	frm.action = "simpleFilterImportBill.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function filterBill(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "advanceFilterImportBill.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function viewBillData(frmId, rowIndex)
{
	document.getElementById("txtRecordIndex").value = rowIndex;
	var frm = document.getElementById(frmId);
	frm.action = "viewImportBill.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();		
}
function showLoanRequestForm(frmId)
{
	var frm = document.getElementById(frmId);
	document.getElementById("hiddenBillRef").value = selectedCheckBox;
	frm.action = "newLoanRequestFromImportBill.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showAcceptPopUp(frmId)
{
	var frm = document.getElementById(frmId);
	document.getElementById("hiddenBillRef").value = selectedCheckBox;
	frm.action = "importBillAcceptance.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function addBillDetails(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "addBillEntry.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();		
}
function addDocDetails(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "addDocEntry.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();		
}

function getAdvancedBillFilterPopup(frmId) 
{
	$('#advancedFilterPopup').dialog({
		autoOpen : false,
		height : 350,
		width : 473,
		modal : true,
		buttons : {			
			"Search" : function() {
				filterBill(frmId);
			
			},				
			"Clear" : function() {
				$('#filterForm').each (function(){
					this.reset();
						$('#txtAmount').val("0.00");
						fromDate="";
						toDate="";
						$('#txtReference').val("");
						$('#dropdownBeneCode').val("");
				});
			},							
			"Cancel" : function() {
				$('#filterForm').each (function(){
					this.reset();
						$('#txtAmount').val("0.00");
						fromDate="";
						toDate="";
						$('#txtReference').val("");	
						$('#dropdownBeneCode').val("");
				});
				$(this).dialog("close");
			}
		},
		open: function() {
			$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset').addClass('nofloating centerAlign');
            $('.ui-dialog-buttonpane').find('button:contains("Clear")').attr("title","Clear");
            
            $('.ui-dialog-buttonpane').find('button:contains("Cancel")').attr("title","Cancel");
            $('.ui-dialog-buttonpane').find('button:contains("Cancel")').find('.ui-button-text').prepend('<span class="fa fa-minus-circle">&nbsp;&nbsp</span>');
            
            $('.ui-dialog-buttonpane').find('button:contains("Search")').attr("title","Filter");   
            $('.ui-dialog-buttonpane').find('button:contains("Search")').find('.ui-button-text').prepend('<span class="fa fa-filter">&nbsp;&nbsp</span>');
        }
	});
	$('#advancedFilterPopup').dialog("open");
}

function getDocPopUp(frmId) 
{
	$('#docPopup').dialog({
		autoOpen : false,
		height : 270,
		width : 500,
		modal : true,
		buttons : 
		{		
			"Add" : function() 
			{		
				$(this).dialog("close");
				addDocDetails(frmId);
			},
			"Cancel" : function() 
			{
				$('#docForm').each (function(){
					this.reset();						
				});
				$(this).dialog("close");
			}
		}
	});
	$('#docPopup').dialog("open");
}
function getBillPopUp(frmId) 
{
	$('#billPopup').dialog({
		autoOpen : false,
		height : 400,
		width : 500,
		modal : true,
		buttons : {				
			"Add" : function() 
			{		
				$(this).dialog("close");
				addBillDetails(frmId);
			},
			"Cancel" : function() 
			{
				$('#billForm').each (function(){
					this.reset();						
				});
				$(this).dialog("close");
			}
		}
	});
	$('#billPopup').dialog("open");
}
function getAcceptPopUp(frmId) 
{
	$('#acceptImportBillPopup').dialog({
		autoOpen : false,
		height : 270,
		width : 630,
		modal : true,
		buttons : {		
			"Save" : function() {
				$(this).dialog("close");
				acceptBill(frmId);
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

function getRejectPopup(frmId) 
{
	$('#rejectPopup').dialog( {
		autoOpen : false,
		height : 240,
		width : 420,
		modal : true,
		buttons : {
			"OK" : function() 
			{
				rejectBill(frmId);
			},
			"Cancel" : function() 
			{
				$(this).dialog("close");
			}			
		}
	});
	$('#rejectPopup').dialog("open");
}

function acceptBill(frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("txtAcceptRef").value = $('#acceptRef').val();
	document.getElementById("txtAcceptRemark").value = $('#txtRemark').val();
	frm.action = "acceptImportBill.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function returnBill(frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("txtAcceptRef").value = $('#acceptRef').val();
	document.getElementById("txtAcceptRemark").value = $('#txtRemark').val();
	frm.action = "returnImportBill.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function authorizeBill(frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("hiddenBillRef").value = selectedCheckBox;
	frm.action = "authorizeImportBill.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function rejectBill(frmId) 
{
	frm = document.getElementById(frmId);
	document.getElementById("txtBillRejectReason").value = $('#txtAreaRejectRemark').val();	
	document.getElementById("hiddenBillRef").value = selectedCheckBox;
	frm.action = "rejectImportBill.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showReturnPopUp(frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("hiddenBillRef").value = selectedCheckBox;
	frm.action = "importBillReturn.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function getBillHistoryPopUp(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "importBillHistory.hist";
	frm.target = "hWinSeek";
	frm.method = "POST";
	var strAttr;
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 600)/2;
	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=700,height=300";
	window.open ("", "hWinSeek", strAttr);
	frm.submit();
	frm.target = "";
}

function getReturnPopUp(frmId) 
{
	$('#returnImportBillPopup').dialog({
		autoOpen : false,
		height : 270,
		width : 630,
		modal : true,
		buttons : {			
			"Save" : function() {		
				$(this).dialog("close");
				returnBill(frmId);
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
selectedCheckBox = new Array(); 						
// This Array Used For Getting Selected bills

//This Array Used For Getting "can auth" values of bills
selectedAuthArray=new Array();

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
function rowBillSelect(checkBoxId, jsonString, canAuth)
{
	var index;
	if ((index = selectedExists(checkBoxId.getAttribute("id"))) != -1)
	{
		if (checkBoxId.checked == true)
		{	
			selectedCheckBox[selectedCheckBox.length] = checkBoxId.getAttribute("id");
			selectedAuthArray[selectedAuthArray.length] = canAuth;
		}
		else
		{
			selectedCheckBox.splice(index, 1);
			selectedAuthArray.splice(index, 1);
		}
	}	
	enableDisableAcceptLink();
	enableDisableAuthorizeLink();
	enableDisableReturnLink();
	enableDisablePayLink();
	enableDisableLoanReqLink();
	enableDisableRejectLink();
}
function enableDisableDeleteLink()
{
	var acceptValue;
	if (selectedCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[0]).value;
		var obj = eval("(" + objstr + ")");
		acceptValue = obj.canDelete;
	}
	for ( var i = 1; i < selectedCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[i]).value;
		var obj = eval("(" + objstr + ")");
		acceptValue = acceptValue && obj.canDelete;
	}
	if (acceptValue == true && CAN_EDIT == 'true')
	{		
		$('#btnDelete').unbind('click');
		ToggleAttribute("btnDelete", true, "href");
		$('#btnDelete').click(delete_link_onclick);
	} 
	else
	{
		ToggleAttribute("btnDelete", false, "href");
		$('#btnDelete').removeAttr('onclick').click(function() 
		{});
		$('#btnDelete').unbind('click');
	}
}
function enableDisableAcceptLink()
{
	var acceptValue;
	var ccy1;
	var ccyMatch = true;
	var typeMismatch = true;
	if (selectedCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[0]).value;
		var obj = eval("(" + objstr + ")");
		acceptValue = obj.canAccept;
		
		var objstr2 = document.getElementById("TEXTBILL" + selectedCheckBox[0]).value;
		var obj2 = eval("(" + objstr2 + ")");
		var billType = obj2.billType;
		if(billType == 'COLLECTION')
			typeMismatch = false;
		ccy1 = obj2.currency;
	}
	for ( var i = 1; i < selectedCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[i]).value;
		var obj = eval("(" + objstr + ")");
		acceptValue = acceptValue && obj.canAccept;
		
		var objstr2 = document.getElementById("TEXTBILL" + selectedCheckBox[i]).value;
		var obj2 = eval("(" + objstr2 + ")");
		var billType = obj2.billType;
		if(billType == 'COLLECTION')
			typeMismatch = false;
		var ccy2 = obj2.currency;
		
		if(ccy1 != ccy2)
		{ ccyMatch = false;  break; }
	}
	if (acceptValue == true && CAN_EDIT == 'true'  && billType != 'COLLECTION' && typeMismatch && ccyMatch)
	{		
		$('#btnAccept').unbind('click');
		ToggleAttribute("btnAccept", true, "href");
		$('#btnAccept').click(function()
		{	
			showAcceptPopUp('frmMain');
		});
	} 
	else
	{
		ToggleAttribute("btnAccept", false, "href");
		$('#btnAccept').removeAttr('onclick').click(function() 
		{});
		$('#btnAccept').unbind('click');
	}
}
function enableDisableReturnLink()
{
	var returnValue;
	var ccy1;
	var ccyMatch = true;
	if (selectedCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[0]).value;
		var obj = eval("(" + objstr + ")");
		returnValue = obj.canReturn;
		
		var objstr2 = document.getElementById("TEXTBILL" + selectedCheckBox[0]).value;
		var obj2 = eval("(" + objstr2 + ")");
		ccy1 = obj2.currency;
	}
	for ( var i = 1; i < selectedCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[i]).value;
		var obj = eval("(" + objstr + ")");
		returnValue = returnValue && obj.canReturn;
		
		var objstr2 = document.getElementById("TEXTBILL" + selectedCheckBox[i]).value;
		var obj2 = eval("(" + objstr2 + ")");
		var ccy2 = obj2.currency;
		
		if(ccy1 != ccy2)
		{ ccyMatch = false;  break; }
	}
	if (returnValue == true && CAN_EDIT == 'true'&& ccyMatch)
	{		
		$('#btnReturn').unbind('click');
		ToggleAttribute("btnReturn", true, "href");
		$('#btnReturn').click(function()
		{
			showReturnPopUp('frmMain');
		});
	} 
	else
	{
		ToggleAttribute("btnReturn", false, "href");
		$('#btnReturn').removeAttr('onclick').click(function() 
		{});
		$('#btnReturn').unbind('click');
	}
}
function enableDisablePayLink()
{
	var payValue;
	var ccy1;
	var ccyMatch = true;
	
	if (selectedCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[0]).value;
		var obj = eval("(" + objstr + ")");
		payValue = obj.canPay;
		
		var objstr1 = document.getElementById("TEXTBILL" + selectedCheckBox[0]).value;
		var obj1 = eval("(" + objstr1 + ")");
		 ccy1 = obj1.currency;
	}
	for ( var i = 1; i < selectedCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[i]).value;
		var obj = eval("(" + objstr + ")");
		payValue = payValue && obj.canPay;
		
		var objstr2 = document.getElementById("TEXTBILL" + selectedCheckBox[i]).value;
		var obj2 = eval("(" + objstr2 + ")");
		var ccy2 = obj2.currency;
		
		if(ccy1 != ccy2)
			{ ccyMatch = false;  break; }
	}
	if (payValue == true && CAN_EDIT == 'true' && ccyMatch)
	{		
		$('#btnPay').unbind('click');
		ToggleAttribute("btnPay", true, "href");
		$('#btnPay').click(function()
		{
			showPaymentForm('frmMain');
		});
	} 
	else
	{
		ToggleAttribute("btnPay", false, "href");
		$('#btnPay').removeAttr('onclick').click(function() 
		{});
		$('#btnPay').unbind('click');
	}
}
function enableDisableLoanReqLink()
{
	var loanReqValue;
	var ccy1;
	var ccyMatch = true;
	
	if (selectedCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[0]).value;
		var obj = eval("(" + objstr + ")");
		loanReqValue = obj.canLoanReq;
		
		var objstr1 = document.getElementById("TEXTBILL" + selectedCheckBox[0]).value;
		var obj1 = eval("(" + objstr1 + ")");
		 ccy1 = obj1.currency;
		
	}
	for ( var i = 1; i < selectedCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[i]).value;
		var obj = eval("(" + objstr + ")");
		loanReqValue = loanReqValue && obj.canLoanReq;
		
		var objstr2 = document.getElementById("TEXTBILL" + selectedCheckBox[i]).value;
		var obj2 = eval("(" + objstr2 + ")");
		var ccy2 = obj2.currency;
		
		if(ccy1 != ccy2)
			{ ccyMatch = false;  break; }
		
	}
	if (loanReqValue == true && CAN_EDIT == 'true' && ccyMatch)
	{
		$('#btnLoanReq').unbind('click');		
		ToggleAttribute("btnLoanReq", true, "href");
		$('#btnLoanReq').click(function()
		{
			showLoanRequestForm('frmMain');
		});		
	} 
	else 
	{
		ToggleAttribute("btnLoanReq", false, "href");
		$('#btnLoanReq').removeAttr('onclick').click(function() 
		{});
		$('#btnLoanReq').unbind('click');
	}
}
function enableDisableAuthorizeLink()
{
	var authValue;
	if (selectedCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[0]).value;
		var obj = eval("(" + objstr + ")");		
		var canAuth = selectedAuthArray[0];
		if(canAuth=='false' || canAuth==false)
		{	
			authValue = obj.canAuth && false;
		}
		else
		{
			authValue = obj.canAuth;
		}		
	}
	for ( var i = 1; i < selectedCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[i]).value;
		var obj = eval("(" + objstr + ")");		
		var canAuth = selectedAuthArray[i];
		if(canAuth=='false' || canAuth==false)
		{	
			authValue = authValue && obj.canAuth && false;
		}
		else
		{
			authValue = authValue && obj.canAuth;
		}		
	}
	if (authValue == true && CAN_AUTH == 'true')
	{		
		$('#btnAuth').unbind('click');
		ToggleAttribute("btnAuth", true, "href");
		$('#btnAuth').click(function()
		{
			authorizeBill('frmMain');
		});
	} 
	else
	{
		ToggleAttribute("btnAuth", false, "href");
		$('#btnAuth').removeAttr('onclick').click(function() 
		{});
		$('#btnAuth').unbind('click');
	}
}

function enableDisableRejectLink()
{
	var rejectValue;
	if (selectedCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[0]).value;
		var obj = eval("(" + objstr + ")");
		var canAuth = selectedAuthArray[0];
		if(canAuth=='false' || canAuth==false)
		{	
			rejectValue = obj.canReject && false;
		}
		else
		{
			rejectValue = obj.canReject;
		}
	}
	for ( var i = 1; i < selectedCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[i]).value;
		var obj = eval("(" + objstr + ")");
		var canAuth = selectedAuthArray[i];
		if(canAuth=='false' || canAuth==false)
		{	
			rejectValue = rejectValue && obj.canReject && false;
		}
		else
		{
			rejectValue = rejectValue && obj.canReject;
		}
	}
	if (rejectValue == true &&  CAN_AUTH == 'true')
	{		
		$('#btnReject').unbind('click');
		ToggleAttribute("btnReject", true, "href");
		$('#btnReject').click(function()
		{
			getRejectPopup('frmMain');
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
function showPaymentForm(frmId)
{
	var frm = document.getElementById(frmId);
	document.getElementById("hiddenBillRef").value = selectedCheckBox;
	frm.action = "importBillPayment.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showSingleBillPaymentForm(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("hiddenBillRef").value = rowIndex;
	frm.action = "importBillPayment.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function checkUncheck(field,headerCheckbox)
{
		selectedCheckBox.splice(0, selectedCheckBox.length);
		selectedAuthArray.splice(0, selectedAuthArray.length);
		
	if(headerCheckbox.checked==true && field.length >0)
	{
		for (i = 0; i < field.length; i++)
		{
			field[i].checked = true ;
			selectedCheckBox[selectedCheckBox.length]=field[i].getAttribute("id");
			selectedAuthArray[selectedAuthArray.length]=objAuthData[i+1];
		}
	}
	else if(field.length >0)
	{
		for (i = 0; i < field.length; i++)
		{
			field[i].checked = false ;
		}
		selectedCheckBox.splice(0, selectedCheckBox.length);
		selectedAuthArray.splice(0, selectedAuthArray.length);
	}
	else if(headerCheckbox.checked==true)
	{
	        field.checked = true ;
	        selectedCheckBox[selectedCheckBox.length]=field.getAttribute("id");
	        selectedAuthArray[selectedAuthArray.length]=objAuthData[1];
	}
	else
	{
	    field.checked = false ;
		selectedCheckBox.splice(0, selectedCheckBox.length);
		selectedAuthArray.splice(0, selectedAuthArray.length);
	}
	enableDisableAcceptLink();
	enableDisableAuthorizeLink();
	enableDisableReturnLink();
	enableDisablePayLink();
	enableDisableLoanReqLink();
	enableDisableRejectLink();
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