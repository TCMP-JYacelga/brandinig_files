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
								$('#txtLCMyClientDesc').val(data.DESCR);
								$('#txtLCMyClientCode').val(data.CODE);
							}
							if(TYPE == 'IMPORT_LOAN')
								goToPage('simpleFilterImportLoan.form','frmMain');
							if(TYPE == 'EXPORT_LOAN')
								goToPage('simpleFilterExportLoan.form','frmMain');
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

function goToPage(strUrl, frmId)
{
	var frm = document.getElementById(frmId);

	if($("#txtLCMyClientDesc").length)
	 {
		if($('#txtLCMyClientDesc').val()== null || $('#txtLCMyClientDesc').val()=='')
		{
			$('#txtLCMyClientCode').val('');
		}
		else
		{
			if($('#txtLCMyClientCode').val()== null || $('#txtLCMyClientCode').val()=='')
			{
				$('#txtLCMyClientCode').val($('#txtLCMyClientDesc').val());  
			}		  
		}
	 }
	
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showImportLoanEntryForm(frmId)
{
	var frm = document.getElementById(frmId);	
	frm.action = "newImportLoan.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showExportLoanEntryForm(frmId)
{
	var frm = document.getElementById(frmId);	
	frm.action = "newExportLoan.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

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
		var type = document.getElementById("loanType").value;
		if(type == "IMPORT_LOAN")
		{
			frm.action = 'sortImportLoanList.form';
		}
		if(type == "EXPORT_LOAN")
		{
			frm.action = 'sortExportLoanList.form';
		}
		frm.target = "";
		frm.method = "POST";
		frm.submit();		
	}
}
function changeLoanPage(navType, newPage) 
{
	var frm = document.getElementById('frmMain');
	if (!frm) 
	{
		alert(_errMessages.ERR_NOFORM);
		return false;
	}	
	var curPage=$('.pcontrol input', this.pDiv).val();
	var totPage='<c:out value="${total_pages}"/>';
	
	var type = document.getElementById("loanType").value;
	var strPrefix = "";
	if(type == "IMPORT_LOAN")
	{
		strPrefix = "import";
	}
	if(type == "EXPORT_LOAN")
	{
		strPrefix = "export";
	}
	switch(navType) 
	{
		case 'first':
			frm.action = strPrefix+'LoanCenter_first.form';
			break;
		case 'prev':
			frm.action = strPrefix+'LoanCenter_previous.form';
			break;
		case 'next':
			if(curPage>=totPage)
				  return false;
			frm.action = strPrefix+'LoanCenter_next.form';
			break;
		case 'last':
			frm.action = strPrefix+'LoanCenter_last.form';
			break;
		case 'input':
			$('#page_number').val(curPage);
			frm.action = strPrefix+'LoanCenter_goto.form';
			break;
		default:
			alert(_errMessages.ERR_NAVIGATE);
			return false;
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function filterLoans(frmId)
{
	var frm = document.getElementById(frmId);
	var type = document.getElementById("loanType").value;
	if(type == "IMPORT_LOAN")
	{
	frm.action = "advanceFilterImportLoan.form";
	}
	if(type == "EXPORT_LOAN")
	{
	frm.action = "advanceFilterExportLoan.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function getAdvancedLoanFilterPopup(frmId) 
{
	$('#advancedFilterPopup').dialog({
		autoOpen : false,
		height : 340,
		width : 473,
		modal : true,
		buttons : {
			"Search" : function() {
				filterLoans(frmId);
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
            
            $('.ui-dialog-buttonpane').find('button:contains("Search")').attr("title","Search");
            $('.ui-dialog-buttonpane').find('button:contains("Search")').find('.ui-button-text').prepend('<span class="fa fa-filter">&nbsp;&nbsp</span>');
        }
	});
	$('#advancedFilterPopup').dialog("open");
}	
selectedLoanCheckBox = new Array(); 						
//This Array Used For Getting Selected lcs

//This Array Used For Getting "can auth" values of loans
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
function rowLoanSelect(checkBoxId, jsonString, canAuth)
{
	var index;
	if ((index = selectedLoanExists(checkBoxId.getAttribute("id"))) != -1)
	{
		if (checkBoxId.checked == true)
		{	
			selectedLoanCheckBox[selectedLoanCheckBox.length] = checkBoxId.getAttribute("id");
			selectedLoanAuthArray[selectedLoanAuthArray.length] = canAuth;			
		}
		else
		{
			selectedLoanCheckBox.splice(index, 1);
			selectedLoanAuthArray.splice(index, 1);			
		}
	}
	
	loanEnableDisableSubmitLink();	
	loanEnableDisableAuthorizeLink();
	loanEnableDisableSendLink();
	loanEnableDisableDeleteLink();
	loanEnableDisableRejectLink();
	loanEnableDisableRepayLink();
}
function loanEnableDisableSubmitLink()
{	
	var submitValue;
	if (selectedLoanCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedLoanCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		submitValue = obj.canSubmit;
	}
	for ( var i = 1; i < selectedLoanCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedLoanCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		submitValue = submitValue && obj.canSubmit;
	}
	if (submitValue == true && CAN_EDIT == 'true')
	{
		
		$('#btnSubmit').unbind('click');
		LoanToggleAttribute("btnSubmit", true, "href");
		$('#btnSubmit').click(function()
		{
			submitLoan('frmMain');
		});
	} 
	else
	{
		LoanToggleAttribute("btnSubmit", false, "href");
		$('#btnSubmit').removeAttr('onclick').click(function() 
		{});
		$('#btnSubmit').unbind('click');
	}	
}
function loanEnableDisableAuthorizeLink()
{
	var authorizeValue;
	if (selectedLoanCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedLoanCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		var canAuth = selectedLoanAuthArray[0];
		if(canAuth=='false' || canAuth==false)
		{	
		authorizeValue = obj.canAuthorise && false;
		}
		else
		{
			authorizeValue = obj.canAuthorise;
		}
	}
	for ( var i = 1; i < selectedLoanCheckBox.length; i++) 
	{
		var objstr = document.getElementById("TEXT" + selectedLoanCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');		
		var canAuth = selectedLoanAuthArray[i];
		if(canAuth=='false' || canAuth==false)
		{	
			authorizeValue = authorizeValue && obj.canAuthorise && false;
		}
		else
		{
			authorizeValue = authorizeValue && obj.canAuthorise;
		}
	}
	if (authorizeValue == true && CAN_AUTH == 'true') 
	{		
		$('#btnAuth').unbind('click');
		LoanToggleAttribute("btnAuth", true, "href");
		$('#btnAuth').click(function()
		{
			authorizeLoan('frmMain');
		});
	}
	else 
	{
		LoanToggleAttribute("btnAuth", false, "href");
		$('#btnAuth').removeAttr('onclick').click(function() 
		{
		});
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
function loanEnableDisableRejectLink()
{
	var rejectValue;
	if (selectedLoanCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedLoanCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		var canAuth = selectedLoanAuthArray[0];
		if(canAuth=='false' || canAuth==false)
		{	
			rejectValue = obj.canReject && false;
		}
		else
		{
			rejectValue = obj.canReject;
		}
	}
	for ( var i = 1; i < selectedLoanCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedLoanCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		var canAuth = selectedLoanAuthArray[i];
		if(canAuth=='false' || canAuth==false)
		{	
			rejectValue = rejectValue && obj.canReject && false;
		}
		else
		{
			rejectValue = rejectValue && obj.canReject;
		}
	}
	if (rejectValue == true && CAN_AUTH == 'true') 
	{
		$('#btnReject').unbind('click');
		LoanToggleAttribute("btnReject", true, "href");
		$('#btnReject').click(function()
		{
			getLoanRejectPopup('frmMain');
		});
	} 
	else
	{
		LoanToggleAttribute("btnReject", false, "href");
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
function simpleLoanFilter(frmId)
{
	var frm = document.getElementById(frmId);
	var type = document.getElementById("loanType").value;
	if(type == "IMPORT_LOAN")
	{
		frm.action = "simpleFilterImportLoan.form";
	}
	if(type == "EXPORT_LOAN")
	{
		frm.action = "simpleFilterExportLoan.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
jQuery.fn.LoanRefTextBox = function() {
	return this
			.each(function() {
				$(this)
						.keyup(function(e) {
							//Allow Enter key 
							if(e.keyCode==13)
							{
								javascript:simpleLoanFilter('frmMain');
							}
							})
			})
};

function simpleActionStatusFilter(frmId)
{
	var frm = document.getElementById(frmId);
	//var type = document.getElementById('type').value;
	var detailType;
	var statusIndex = document.getElementById('cboactionstatusfilter').selectedIndex;
	switch(statusIndex) 
	{
		case 0:
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
		case 6:
			detailType="";
			break;
		case 7:
		case 8:
		case 9:
		case 10:
		case 11:
		case 12:
			detailType="A";
			break;
		case 13:
		case 14:
		case 15:
		case 16:
		case 17:
		case 18:
			detailType="C";
			break;			
	}
	document.getElementById("detailType").value = detailType;
	frm.action = "simpleFilterImportLoan.form";
	//if(type == "SBLC"){ frm.action = "simpleFilterImportStandbyLc.form";}
	//if(type == "GTY"){ frm.action = "simpleFilterImportGuarantee.form";	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function getLoanHistoryPopUp(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	var type = document.getElementById("loanType").value;
	if(type == "IMPORT_LOAN")
	{
		frm.action = "importLoanHistory.hist";
	}
	if(type == "EXPORT_LOAN")
	{
		frm.action = "exportLoanHistory.hist";
	}
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
function viewLoanData(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	var type = document.getElementById("loanType").value;
	if(type == "IMPORT_LOAN")
	{
		frm.action = "viewImportLoan.form";
	}
	if(type == "EXPORT_LOAN")
	{
		frm.action = "viewExportLoan.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function submitLoan(frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("hiddenLoanRef").value = selectedLoanCheckBox;
	var type = document.getElementById("loanType").value;
	if(type == "IMPORT_LOAN")
	{
		frm.action = "submitImportLoan.form";
	}
	if(type == "EXPORT_LOAN")
	{
		frm.action = "submitExportLoan.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function authorizeLoan(frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("hiddenLoanRef").value = selectedLoanCheckBox;
	var type = document.getElementById("loanType").value;
	if(type == "IMPORT_LOAN")
	{
		frm.action = "authorizeImportLoan.form";
	}
	if(type == "EXPORT_LOAN")
	{
		frm.action = "authorizeExportLoan.form";
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
			"Ok" : function() 
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
function rejectLoan(frmId) 
{
	frm = document.getElementById(frmId);
	document.getElementById("txtLoanRejectReason").value = $('#txtAreaRejectRemark').val();	
	document.getElementById("hiddenLoanRef").value = selectedLoanCheckBox;
	var type = document.getElementById("loanType").value;
	if(type == "IMPORT_LOAN")
	{
		frm.action = "rejectImportLoan.form";
	}
	if(type == "EXPORT_LOAN")
	{
		frm.action = "rejectExportLoan.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function deleteLoan(frmId) 
{	
	frm = document.getElementById(frmId);
	document.getElementById("hiddenLoanRef").value = selectedLoanCheckBox;
	var type = document.getElementById("loanType").value;
	if(type == "IMPORT_LOAN")
	{
		frm.action = "deleteImportLoan.form";
	}
	if(type == "EXPORT_LOAN")
	{
		frm.action = "deleteExportLoan.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function sendLoan(frmId) 
{	
	frm = document.getElementById(frmId);
	document.getElementById("hiddenLoanRef").value = selectedLoanCheckBox;
	var type = document.getElementById("loanType").value;
	if(type == "IMPORT_LOAN")
	{
		frm.action = "sendImportLoan.form";
	}
	if(type == "EXPORT_LOAN")
	{
		frm.action = "sendExportLoan.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function repayLoan(frmId) 
{	
	frm = document.getElementById(frmId);
	document.getElementById("hiddenLoanRef").value = selectedLoanCheckBox;
	var type = document.getElementById("loanType").value;
	if(type == "IMPORT_LOAN")
	{
		frm.action = "importLoanRepayment.form";
	}
	if(type == "EXPORT_LOAN")
	{
		frm.action = "exportLoanRepayment.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function repaySingleLoan(frmId, rowIndex) 
{	
	frm = document.getElementById(frmId);
	document.getElementById("hiddenLoanRef").value = rowIndex;
	var type = document.getElementById("loanType").value;
	if(type == "IMPORT_LOAN")
	{
		frm.action = "importLoanRepayment.form";
	}
	if(type == "EXPORT_LOAN")
	{
		frm.action = "exportLoanRepayment.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function editImpLoanData(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "editImportLoan.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function editExpLoanData(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "editExportLoan.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function checkUncheckLoan(field,headerCheckbox)
{
		selectedLoanCheckBox.splice(0, selectedLoanCheckBox.length);
		selectedLoanAuthArray.splice(0, selectedLoanAuthArray.length);
		
	if(headerCheckbox.checked==true && field.length >0)
	{
		for (i = 0; i < field.length; i++)
		{
			field[i].checked = true ;
			selectedLoanCheckBox[selectedLoanCheckBox.length]=field[i].getAttribute("id");
			selectedLoanAuthArray[selectedLoanAuthArray.length]=objAuthData[i+1];
		}
	}
	else if(field.length >0)
	{
		for (i = 0; i < field.length; i++)
		{
			field[i].checked = false ;
		}
		selectedLoanCheckBox.splice(0, selectedLoanCheckBox.length);
		selectedLoanAuthArray.splice(0, selectedLoanAuthArray.length);
	}
	else if(headerCheckbox.checked==true)
	{
	        field.checked = true ;
	        selectedLoanCheckBox[selectedLoanCheckBox.length]=field.getAttribute("id");
	        selectedLoanAuthArray[selectedLoanAuthArray.length]=objAuthData[1];
	}
	else
	{
	    field.checked = false ;
	    selectedLoanCheckBox.splice(0, selectedLoanCheckBox.length);
		selectedLoanAuthArray.splice(0, selectedLoanAuthArray.length);
	}
	loanEnableDisableSubmitLink();	
	loanEnableDisableAuthorizeLink();
	loanEnableDisableSendLink();
	loanEnableDisableDeleteLink();
	loanEnableDisableRejectLink();
	loanEnableDisableRepayLink();
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