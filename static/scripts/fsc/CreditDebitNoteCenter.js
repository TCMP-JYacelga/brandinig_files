selectedCheckBox = new Array(); 						//This Array Used For Getting Selected Invoices.

function rowCreditDebitSelect(checkBoxId, jsonString,isAuth)
{
	var index;
	if ((index = selectedExists(checkBoxId.getAttribute("id"))) != -1)
	{
		if (checkBoxId.checked == true)
		{	
			selectedCheckBox[selectedCheckBox.length] = checkBoxId.getAttribute("id");
			selectedMakerArray[selectedMakerArray.length]=isAuth;
		}
		else
		{
			$('#headerCheckbox').removeAttr("checked");
			selectedCheckBox.splice(index, 1);
			selectedMakerArray.splice(index, 1);
		}
	}
	enableDisableCreditDebitAuthorizeLink(true);
	enableDisableCreditDebitSendLink();
	enableDisableCreditDebitRejectLink(true);
	enableDisableCreditDebitDeleteLink();
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

function enableDisableCreditDebitAuthorizeLink(isAuth)
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
		if(MODE=='DEBIT_NOTE')
		{
			$('#btnAuth').click(function()
			{
				gridActions('authorizeDebitNote.form','frmMain');
			});
		}
		else
		{
			$('#btnAuth').click(function()
					{
				gridActions('authorizeCreditNote.form','frmMain');
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
function enableDisableCreditDebitDeleteLink()
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
	if (deleteValue == true) 
	{
		$('#btnDelete').unbind('click');
		ToggleAttribute("btnDelete", true, "href");
		if(MODE=='DEBIT_NOTE')
		{
		   $('#btnDelete').click(function()
			 {
			   gridActions('deleteDebitNote.form','frmMain');
			 });
		}
		else
		{
		  $('#btnDelete').click(function()
		  {
			  gridActions('deleteCreditNote.form','frmMain');
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

function enableDisableCreditDebitFinanceLink()
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
		if(MODE=='DEBIT_NOTE')
		{
		   $('#btnReqFinance').click(function()
			{
			   
			});
		}
		else
		{
			 $('#btnReqFinance').click(function()
						{
						   
						});
		}
	} 
	else
	{
		ToggleAttribute("btnReqFinance", false, "href");
		$('#btnReqFinance').removeAttr('onclick').click(function()
		{});
		$('#btnReqFinance').unbind('click');
		
	}
	
}

function enableDisableCreditDebitRejectLink(isAuth)
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
	if (rejectValue == true && CAN_AUTH == 'true') 
	{
		$('#btnReject').unbind('click');
		ToggleAttribute("btnReject", true, "href");
		if(MODE=='DEBIT_NOTE')
		{
		   $('#btnReject').click(function()
			{
			   getDebitNoteRejectPopup();
			});
		}
		else
		{
			 $('#btnReject').click(function()
			{
				 getCreditNoteRejectPopup();	   
			});
		}
	} 
	else
	{
		ToggleAttribute("btnReject", false, "href");
		$('#btnReject').removeAttr('onclick').click(function()
		{});
		$('#btnReject').unbind('click');
	}
}

function enableDisableCreditDebitDownloadLink()
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
		$('#btnDownload').click(download_link_onclick);
	} 
	else
	{
		ToggleAttribute("btnDownload", false, "href");
		$('#btnDownload').removeAttr('onclick').click(function()
		{});
		$('#btnDownload').unbind('click');
		
	}	
}

function enableDisableCreditDebitSendLink()
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
		if(MODE=='DEBIT_NOTE')
		{
		   $('#btnSend').click(function()
			{
			   gridActions('sendDebitNote.form','frmMain');
			});
		}
		else
		{
			$('#btnSend').click(function()
			{
				gridActions('sendCreditNote.form','frmMain');	   
			});
		}
	}
	else
	{
		ToggleAttribute("btnSend", false, "href");
		$('#btnSend').removeAttr('onclick').click(function()
		{});
		$('#btnSend').unbind('click');
	}
}

function enableDisableCreditDebitSubmitLink()
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
		$('#btnSubmit').click(submit_link_onclick);
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

function getDebitNoteAdvancedFilterPopup(strUrl, frmId) {

	var defaultFromDate=btns['defaultFromDate'];
	var defaultToDate=btns['defaultToDate'];
	var fromDate=$('#fromDate').val();
	var toDate= $('#toDate').val();
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
	
	buttonsOpts[btns['cancelBtn']]=function() {
					$('#filterForm').each (function(){
							this.reset();
							$('#txtAmount').val("0.00");
							fromDate="";
							toDate="";
							dueFromDate="";
							dueToDate="";
							
					});
					$(this).dialog("close");
				};
	buttonsOpts[btns['clearBtn']] = function() {
		var itemId, defaultItemValue;
		$('form#filterForm').find('input:visible, select:visible').each(function(index, item) {
			item = $(item);
			itemId = item.attr('id');
			defaultItemValue = '';
			if(itemId === 'fromDate' || itemId === 'fromDueDate') {
				defaultItemValue = defaultFromDate;
			} else if(itemId === 'toDate' || itemId === 'toDueDate') {
				defaultItemValue = defaultToDate;
			}
			if(defaultItemValue !== '') {
				item.addClass('grey');
			}
			item.val(defaultItemValue);
		});
	};
	buttonsOpts[btns['goBtn']]=function() {
					if ($('#fromDate').val() == "From Date") {
						$('#fromDate').val("");
					}
					if ($('#toDate').val() == "To Date") {
						$('#toDate').val("");
					}
					if ($('#txtAmount').val() == "") {
						$('#txtAmount').val("0");
					}
			
					$(this).dialog("close");
					goToPage(strUrl, frmId);
				};	
				
	$('#advancedFilterPopup').dialog({
		autoOpen : false,
		height : 345,
		width : 535,
		modal : true,
		buttons : buttonsOpts,
		open: function(){
			$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset').addClass('nofloating centerAlign');
			$('.ui-dialog-buttonpane').find('button:contains("cancelBtn")').attr("title","Cancel");
            $('.ui-dialog-buttonpane').find('button:contains("cancelBtn")').find('.ui-button-text').prepend('<span class="fa fa-minus-circle">&nbsp;&nbsp</span>');
            $('.ui-dialog-buttonpane').find('button:contains("goBtn")').attr("title","Go");
            $('.ui-dialog-buttonpane').find('button:contains("goBtn")').find('.ui-button-text').prepend('<span class="fa fa-check-circle">&nbsp;&nbsp</span>');
		}
	});
	$('#advancedFilterPopup').dialog("open");
}
function getCreditDebitNoteHistoryPage(strUrl,frmId,invoiceNumber)
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
function checkUncheckCreditDebit(field,headerCheckbox)
{
 		selectedCheckBox.splice(0, selectedCheckBox.length);
		selectedMakerArray.splice(0, selectedMakerArray.length);
	if(headerCheckbox.checked==true && field.length >0)
	{
		for (i = 0; i < field.length; i++)
		{
			field[i].checked = true ;
			selectedCheckBox[selectedCheckBox.length]=field[i].getAttribute("id");
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
		selectedMakerArray.splice(0, selectedMakerArray.length);
	}
	else if(headerCheckbox.checked==true)
	{
	        field.checked = true ;
	        selectedCheckBox[selectedCheckBox.length]=field.getAttribute("id");
			selectedMakerArray[selectedMakerArray.length]=objMakerData[1];
	}
	else
	{
	    field.checked = false ;
		selectedCheckBox.splice(0, selectedCheckBox.length);
		selectedMakerArray.splice(0, selectedMakerArray.length);
	}
	enableDisableCreditDebitAuthorizeLink(true);
	enableDisableCreditDebitSendLink();
	enableDisableCreditDebitRejectLink(true);
	enableDisableCreditDebitDeleteLink();
}
function rowAction(strUrl, frmId,rowindex)
{
	frm = document.getElementById(frmId);
	document.getElementById("txtInvIntRefNum").value = rowindex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function gridActions(strUrl, frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("txtInvIntRefNum").value = selectedCheckBox;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function getCreditNoteRejectPopup() {
	$('#rejectPopup').dialog( {
		autoOpen : false,
		height : 200,
		width : 420,
		modal : true,
		buttons : {
				"Cancel" : function() {
				$(this).dialog("close");
				},
				"Go" : function() {
					rejectCreditDebitNote("rejectCreditNote.form", "frmMain");
				}
		}
	});
	$('#rejectPopup').dialog("open");
}

function getDebitNoteRejectPopup() {
	$('#rejectPopup').dialog( {
		autoOpen : false,
		height : 200,
		width : 420,
		modal : true,
		buttons : {
				"Cancel" : function() {
				$(this).dialog("close");
				},
				"Go" : function() {
					rejectCreditDebitNote("rejectDebitNote.form", "frmMain");
				}
		}
	});
	$('#rejectPopup').dialog("open");
}

function rejectCreditDebitNote(strUrl, frmId)
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

function authHelper(strUrl, frmId)
{
	$('#btnAuth').removeAttr('onclick').click(function(){});
	$('#btnAuth').unbind('click');
	$('#btnAuth').removeClass('black');
	$('#btnAuth').addClass('grey');
	gridActions(strUrl, frmId);
}

function sendHelper(strUrl, frmId)
{
	$('#btnSend').removeAttr('onclick').click(function(){});
	$('#btnSend').unbind('click');
	$('#btnSend').removeClass('black');
	$('#btnSend').addClass('grey');
	gridActions(strUrl, frmId);
}

function deleteHelper(strUrl, frmId)
{
	$('#btnDelete').removeAttr('onclick').click(function(){});
	$('#btnDelete').unbind('click');
	$('#btnDelete').removeClass('black');
	$('#btnDelete').addClass('grey');
	gridActions(strUrl, frmId);
}

jQuery.fn.creditNoteClientCodeSeekAutoComplete= function() {
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
						}
						goToPage('simpleFilterCreditNote.form','frmMain');
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

jQuery.fn.debitNoteClientCodeSeekAutoComplete= function() {
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
						}
						goToPage('simpleFilterDebitNote.form','frmMain');
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