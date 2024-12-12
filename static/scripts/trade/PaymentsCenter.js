jQuery.fn.clientCodeSeekAutoCompletePmt= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/userclients.json",
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term,
										$top : -1
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
								$('#txtImportBillPmtClientDesc').val(data.DESCR);
								$('#txtImportBillPmtClientCode').val(data.CODE);
							}
							simplePaymentFilter('frmMain');
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
function changeSortLoan(sortCol, sorOrd, colId)
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
		frm.action = "sortImportBillLoanList.form";
		frm.target = "";
		frm.method = "POST";
			frm.submit();		
		}
	}
	function filterPayments(frmId)
	{
		var frm = document.getElementById(frmId);
		frm.action = "advanceFilterImportBillPayments.form";
	frm.target = "";
	frm.method = "POST";
		frm.submit();	
	}
	function getAdvancedPaymentFilterPopup(frmId) 
	{
		$('#advancedFilterPopup').dialog({
		autoOpen : false,
		height : 350,
		width : 473,
		modal : true,
		buttons : {
			"Search" : function() {
				filterPayments(frmId);
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
	selectedCheckBox = new Array(); 						
	// This Array Used For Getting Selected lcs
	
	// This Array Used For Getting "can auth" values of loans
	selectedLoanAuthArray=new Array();
	
	function selectedLoanExists(checkID) 
	{
		for ( var i = 0; i < selectedLoanCheckBox.length; i++) 
		{
			if (selectedLoanCheckBox[i] == checkID)
			{
				return i;
	     	}
		}
		return 0;
	}
	function LoanToggleAttribute(obj, DoEnable, TagName) 
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
	function rowPaymentSelect(checkBoxId, jsonString, canAuth)
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
		
		paymentEnableDisableAuthorizeLink();
		paymentEnableDisableRejectLink();
	}
	function paymentEnableDisableAuthorizeLink()
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
			authorizePayment('frmMain');
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
	function loanEnableDisableSendLink()
	{
		var sendValue;
		if (selectedLoanCheckBox.length > 0)
		{
			var objstr = document.getElementById("TEXT" + selectedLoanCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		sendValue = obj.canSend;
	}
	for ( var i = 1; i < selectedLoanCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedLoanCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		sendValue = sendValue && obj.canSend;
	}
	if (sendValue == true && (CAN_AUTH == 'true' || CAN_EDIT == 'true'))
	{
		$('#btnSend').unbind('click');
		LoanToggleAttribute("btnSend", true, "href");
		$('#btnSend').click(function()
		{
			sendLoan('frmMain');
		});
	}
	else
	{
		LoanToggleAttribute("btnSend", false, "href");
		$('#btnSend').removeAttr('onclick').click(function()
		{});
		$('#btnSend').unbind('click');
		}
		
	}
	function loanEnableDisableDeleteLink()
	{
		var deleteValue;
		if (selectedLoanCheckBox.length > 0)
		{
			var objstr = document.getElementById("TEXT" + selectedLoanCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		deleteValue = obj.canDelete;
	}
	for ( var i = 1; i < selectedLoanCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedLoanCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		deleteValue = deleteValue && obj.canDelete;
	}
	if (deleteValue == true && CAN_EDIT == 'true') 
	{
		$('#btnDelete').unbind('click');
		LoanToggleAttribute("btnDelete", true, "href");
		$('#btnDelete').click(function()
		{
			deleteLoan('frmMain');
		});
	} 
	else
	{
		LoanToggleAttribute("btnDelete", false, "href");
		$('#btnDelete').removeAttr('onclick').click(function()
		{});
		$('#btnDelete').unbind('click');		
		}	
	}
	function paymentEnableDisableRejectLink()
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
			getPaymentRejectPopup('frmMain');
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
	function loanEnableDisableRepayLink()
	{
		var repayValue;
		var ccy1;
		var ccyMatch = true;
		
		if (selectedLoanCheckBox.length > 0)
		{
			var objstr = document.getElementById("TEXT" + selectedLoanCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		repayValue = obj.canRepay;
		
		var objstr1 = document.getElementById("TEXTLOAN" + selectedLoanCheckBox[0]).value;
		var obj1 = eval("(" + objstr1 + ")");
		ccy1 = obj1.currency;
		
	}
	for ( var i = 1; i < selectedLoanCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedLoanCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		repayValue = repayValue && obj.canRepay;
		
		var objstr2 = document.getElementById("TEXTLOAN" + selectedLoanCheckBox[i]).value;
		var obj2 = eval("(" + objstr2 + ")");
		var ccy2 = obj2.currency;
		
		if(ccy1 != ccy2)
			{ ccyMatch = false;  break; }
	}
	if (repayValue == true  && CAN_EDIT == 'true' && ccyMatch) 
	{
		$('#btnRePay').unbind('click');
		LoanToggleAttribute("btnRePay", true, "href");
		$('#btnRePay').click(function()
		{
			repayLoan('frmMain');
		});
	} 
	else
	{
		LoanToggleAttribute("btnRePay", false, "href");
		$('#btnRePay').removeAttr('onclick').click(function()
		{});
		$('#btnRePay').unbind('click');
		}
		
	}
	function simplePaymentFilter(frmId)
	{
		var frm = document.getElementById(frmId);
		
		if($("#txtImportBillPmtClientDesc").length)
		{
			if($('#txtImportBillPmtClientDesc').val()== null || $('#txtImportBillPmtClientDesc').val()=='')
			{
				$('#txtImportBillPmtClientCode').val('');
			}
			else
			{
				if($('#txtImportBillPmtClientCode').val()== null || $('#txtImportBillPmtClientCode').val()=='')
				{
					$('#txtImportBillPmtClientCode').val($('#txtImportBillPmtClientDesc').val());  
				}		  
			}
		}
		frm.action = "simpleFilterImportBillPayment.form";
		frm.target = "";
		frm.method = "POST";
		frm.submit();	
	}
	jQuery.fn.LoanRefTextBox = function() {
		return this
				.each(function() {
					$(this)
							.keyup(function(e) {
								// Allow Enter key
							if(e.keyCode==13)
							{
								javascript:simpleLoanFilter('frmMain');
								}
								})
				})
	};
	function viewBillPaymentData(frmId, rowIndex)
	{
		var frm = document.getElementById(frmId);
		document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "viewImportBillPayment.form";
	frm.target = "";
	frm.method = "POST";
		frm.submit();
	}
	function authorizePayment(frmId)
	{
		frm = document.getElementById(frmId);
		document.getElementById("hiddenLoanRef").value = selectedCheckBox;
		frm.action = "authorizeImportBillPayment.form";
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
	function getPaymentRejectPopup(frmId) 
	{
		$('#rejectPopup').dialog( {
		autoOpen : false,
		height : 240,
		width : 420,
		modal : true,
		buttons : {
			"Ok" : function() 
			{
				rejectPayment(frmId);
			},
			"Cancel" : function() 
			{
				$(this).dialog("close");
			}
		}
	});
	$('#rejectPopup').dialog("open");
	}
	function rejectPayment(frmId) 
	{
		frm = document.getElementById(frmId);
		document.getElementById("txtPayRejectReason").value = $('#txtAreaRejectRemark').val();	
		document.getElementById("hiddenLoanRef").value = selectedCheckBox;
		frm.action = "rejectImportBillPayment.form";
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
	function deleteLoan(frmId) 
	{	
		frm = document.getElementById(frmId);
		document.getElementById("hiddenLoanRef").value = selectedLoanCheckBox;
	frm.action = "deleteImportBillLoan.form";
	frm.target = "";
	frm.method = "POST";
		frm.submit();
	}
	function sendLoan(frmId) 
	{	
		frm = document.getElementById(frmId);
		document.getElementById("hiddenLoanRef").value = selectedLoanCheckBox;
	frm.action = "sendImportBillLoan.form";
	frm.target = "";
	frm.method = "POST";
		frm.submit();
	}
	function repayLoan(frmId) 
	{	
		frm = document.getElementById(frmId);
		document.getElementById("hiddenLoanRef").value = selectedLoanCheckBox;
	frm.action = "importBillLoanRepayment.form";
	frm.target = "";
	frm.method = "POST";
		frm.submit();
	}
	function repaySingleLoan(frmId, rowIndex) 
	{	
		frm = document.getElementById(frmId);
		document.getElementById("hiddenLoanRef").value = rowIndex;
	frm.action = "importBillLoanRepayment.form";
	frm.target = "";
	frm.method = "POST";
		frm.submit();
	}
	function getBillPayHistoryPopUp(frmId, rowIndex)
	{
		var frm = document.getElementById(frmId);
		document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "importBillPaymentHistory.hist";
	frm.target = "hWinSeek";
	frm.method = "POST";
	var strAttr;
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 600)/2;
	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=700,height=300";
	window.open ("", "hWinSeek",strAttr);
	frm.submit();
	frm.target = "";
	}
	function changePaymentPage(navType, newPage) 
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
			frm.action = 'importBillPaymentCenter_first.form';
			break;
		case 'prev':
			frm.action = 'importBillPaymentCenter_previous.form';
			break;
		case 'next':
			if(curPage>=totPage)
				  return false;
			frm.action = 'importBillPaymentCenter_next.form';
			break;
		case 'last':
			frm.action = 'importBillPaymentCenter_last.form';
			break;
		case 'input':
			$('#page_number').val(curPage);
			frm.action = 'importBillPaymentCenter_goto.form';
			break;
		default:
			alert(_errMessages.ERR_NAVIGATE);
			return false;
	}
	frm.target = "";
	frm.method = "POST";
		frm.submit();
	}
	
	function checkUncheckBillPayment(field,headerCheckbox)
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
		paymentEnableDisableAuthorizeLink();
		paymentEnableDisableRejectLink();
	}
	function showLoanErrorPopup() {
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
	function messagePopup() 
	{
		$('#messagePopup').dialog( {
		autoOpen : true,
		height : 150,
		width : 350,
		modal : true,
		buttons : {
				"OK" : function() {
					$(this).dialog('close');
				}
		}
	});
	$('#messagePopup').dialog('open');
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