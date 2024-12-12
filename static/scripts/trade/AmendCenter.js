function getAdvancedFilterPopupAmend(frmId) 
{
	$('#advancedFilterPopup').dialog( {
		autoOpen : false,
		height : 440,
		width : 473,
		modal : true,
		buttons : {
				"Filter" : function() {
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
					filterAmendments(frmId);
				},
				
//				"Clear" : function() {
//					$('#filterForm').each (function(){
//							this.reset();
//							$('#txtAmount').val("0.00");
//							fromDate="";
//							toDate="";							
//					});
//				},
				"Cancel" : function() {
					$('#filterForm').each (function(){
							this.reset();
							$('#txtAmount').val("0.00");
							fromDate="";
							toDate="";
							
					});
					$(this).dialog("close");
				}			
		},
		
		open: function() {
			$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset').addClass('nofloating centerAlign');
//            $('.ui-dialog-buttonpane').find('button:contains("Clear")').attr("title","Clear");
            
            $('.ui-dialog-buttonpane').find('button:contains("Cancel")').attr("title","Cancel");
            $('.ui-dialog-buttonpane').find('button:contains("Cancel")').find('.ui-button-text').prepend('<span class="fa fa-minus-circle">&nbsp;&nbsp</span>');

            $('.ui-dialog-buttonpane').find('button:contains("Filter")').attr("title","Filter");
            $('.ui-dialog-buttonpane').find('button:contains("Filter")').find('.ui-button-text').prepend('<span class="fa fa-filter">&nbsp;&nbsp</span>');
        }            
	});
	$('#advancedFilterPopup').dialog("open");
}

function filterAmendments(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "advanceFilterImportLcAmendment.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function getRejectPopupAmend(frmId) 
{
	$('#rejectPopup').dialog( {
		autoOpen : false,
		height : 240,
		width : 420,
		modal : true,
		buttons : {
			"OK" : function() 
			{
				rejectAmend(frmId);
			},
			"Cancel" : function() 
			{
				$(this).dialog("close");
			}
		},
		open: function() {
            $('.ui-dialog-buttonpane').find('button:contains("Cancel")').find('.ui-button-text').prepend('<span class="fa fa-minus-circle">&nbsp;&nbsp</span>');
            $('.ui-dialog-buttonpane').find('button:contains("OK")').find('.ui-button-text').prepend('<span class="fa fa-check-circle">&nbsp;&nbsp</span>');
	}
	});
	$('#rejectPopup').dialog("open");
	
}

function goToPage(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function changeAmendPage(navType, newPage) 
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
			frm.action = 'importLcAmendmentCenter_first.form';
			break;
		case 'prev':
			frm.action = 'importLcAmendmentCenter_previous.form';
			break;
		case 'next':
			if(curPage==totPage)
				  return false;
			frm.action = 'importLcAmendmentCenter_next.form';
			break;
		case 'last':
			frm.action = 'importLcAmendmentCenter_last.form';
			break;
		case 'input':
			$('#page_number').val(curPage);
			frm.action = 'importLcAmendmentCenter_goto.form';
			break;
		default:
			alert(_errMessages.ERR_NAVIGATE);
			return false;
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function editAmendData(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "editImportLcAmendment.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function viewAmendData(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "viewImportLcAmendmentMasterDetails.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function viewMasterLCData(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "backToImportLcMasterDetails.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function simpleFilterAmend(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "simpleFilterImportLcAmendment.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

selectedAmendCheckBox = new Array(); 						
//This Array Used For Getting Selected lcs


//This Array Used For Getting "can auth" values of lcs
selectedAuthArray=new Array();

function rowAmendSelect(checkBoxId, jsonString, canAuth)
{
	var index;
	if ((index = selectedAmendExists(checkBoxId.getAttribute("id"))) != -1)
	{
		if (checkBoxId.checked == true)
		{	
			selectedAmendCheckBox[selectedAmendCheckBox.length] = checkBoxId.getAttribute("id");
			selectedAuthArray[selectedAuthArray.length] = canAuth;
		}
		else
		{
			selectedAmendCheckBox.splice(index, 1);
			selectedAuthArray.splice(index, 1);
		}
	}
	enableDisableAmendSubmitLink();
	enableDisableAmendAuthorizeLink();
	enableDisableAmendSendLink();
	enableDisableAmendDeleteLink();
	enableDisableAmendRejectLink();
}

function getAmendHistoryPopUp(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "importLcAmendmentHistory.hist";
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

function selectedAmendExists(checkID) 
{
	for ( var i = 0; i < selectedAmendCheckBox.length; i++) 
	{
		if (selectedAmendCheckBox[i] == checkID)
		{
			return i;
     	}
	}
	return 0;
}

function enableDisableAmendAuthorizeLink()
{
	var authorizeValue;
	if (selectedAmendCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedAmendCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		var canAuth = selectedAuthArray[0];
		if(canAuth=='false' || canAuth==false)
		{	
		authorizeValue = obj.canAuthorise && false;
		}
		else
		{
			authorizeValue = obj.canAuthorise;
		}
	}
	for ( var i = 1; i < selectedAmendCheckBox.length; i++) 
	{
		var objstr = document.getElementById("TEXT" + selectedAmendCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');		
		var canAuth = selectedAuthArray[i];
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
		ToggleAttribute("btnAuth", true, "href");
		$('#btnAuth').click(function()
		{
			authorizeAmend('frmMain');
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

function enableDisableAmendDeleteLink()
{
	var deleteValue;
	if (selectedAmendCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedAmendCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		deleteValue = obj.canDelete;
	}
	for ( var i = 1; i < selectedAmendCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedAmendCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		deleteValue = deleteValue && obj.canDelete;
	}
	if (deleteValue == true && CAN_EDIT == 'true') 
	{
		$('#btnDelete').unbind('click');
		ToggleAttribute("btnDelete", true, "href");
		$('#btnDelete').click(function()
		{
			deleteAmend('frmMain');
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

function enableDisableAmendRejectLink()
{
	var rejectValue;
	if (selectedAmendCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedAmendCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
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
	for ( var i = 1; i < selectedAmendCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedAmendCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
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
	if (rejectValue == true && CAN_AUTH == 'true') 
	{
		$('#btnReject').unbind('click');
		ToggleAttribute("btnReject", true, "href");
		$('#btnReject').click(function()
		{
			getRejectPopupAmend('frmMain');
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

function enableDisableAmendDownloadLink()
{
	var downloadValue;
	if (selectedAmendCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedAmendCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		downloadValue = obj.canDownload;
	}
	for ( var i = 1; i < selectedAmendCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedAmendCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		downloadValue = downloadValue && obj.canDownload;
	}
	if (downloadValue == true) 
	{
		$('#btnDownload').unbind('click');
		ToggleAttribute("btnDownload", true, "href");
		$('#btnDownload').click(function()
		{
			amendDownload('frmMain');
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

function enableDisableAmendSendLink()
{
	var sendValue;
	if (selectedAmendCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedAmendCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		sendValue = obj.canSend;
	}
	for ( var i = 1; i < selectedAmendCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedAmendCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		sendValue = sendValue && obj.canSend;
	}
	if (sendValue == true &&(CAN_AUTH == 'true' || CAN_EDIT == 'true'))
	{
		$('#btnSend').unbind('click');
		ToggleAttribute("btnSend", true, "href");
		$('#btnSend').click(function()
		{
			sendAmend('frmMain');
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

function enableDisableAmendSubmitLink()
{
	var submitValue;
	if (selectedAmendCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedAmendCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		submitValue = obj.canSubmit;
	}
	for ( var i = 1; i < selectedAmendCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedAmendCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		submitValue = submitValue && obj.canSubmit;
	}
	if (submitValue == true && CAN_EDIT == 'true')
	{
		$('#btnSubmit').unbind('click');
		ToggleAttribute("btnSubmit", true, "href");
		$('#btnSubmit').click(function()
		{
			submitAmend('frmMain');
		});
	} 
	else
	{
		ToggleAttribute("btnSubmit", false, "href");
		$('#btnSubmit').removeAttr('onclick').click(function() 
		{});
		$('#btnSubmit').unbind('click');
	}
	
}

function selectedAmend(invIntRefNumber)
{
	tmpInvIntRefNumber = invIntRefNumber;
}

function submitAmend(frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("txtLcRef").value = selectedAmendCheckBox;
	frm.action = "submitImportLcAmendment.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function deleteAmend(frmId) 
{	
	frm = document.getElementById(frmId);
	document.getElementById("txtLcRef").value = selectedAmendCheckBox;
	frm.action = "deleteImportLcAmendment.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function amendDownload(frmId) 
{
	underDevelopement();
	var frm = document.getElementById(frmId);
	//document.getElementById("txtLcRef").value = selectedAmendCheckBox;
	//frm.action = "downloadImportLcAmendment.seek";
	//frm.method = "POST";
	//frm.submit();
	//frm.target = "";	
}	

function authorizeAmend(frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("txtLcRef").value = selectedAmendCheckBox;
	frm.action = "authorizeImportLcAmendment.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function sendAmend(frmId) 
{
	frm = document.getElementById(frmId);
	document.getElementById("txtLcRef").value = selectedAmendCheckBox;
	frm.action = "sendImportLcAmendment.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function rejectAmend(frmId) 
{
	frm = document.getElementById(frmId);
	document.getElementById("txtLCRejectReason").value = $('#txtAreaRejectRemark').val();	
	document.getElementById("txtLcRef").value = selectedAmendCheckBox;
	frm.action = "rejectImportLcAmendment.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function underDevelopement()
{
	alert("Under Development.");
	return;
}

function applySortOnAmend(sortCol, sorOrd, colId)
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
		frm.action = "sortImportLcAmendmentList.form";
		frm.target = "";
		frm.method = "POST";
		frm.submit();		
	}
}

function checkUncheckLcAmendment(field,headerCheckbox)
{
		selectedAmendCheckBox.splice(0, selectedAmendCheckBox.length);
		selectedAuthArray.splice(0, selectedAuthArray.length);
		
	if(headerCheckbox.checked==true && field.length >0)
	{
		for (i = 0; i < field.length; i++)
		{
			field[i].checked = true ;
			selectedAmendCheckBox[selectedAmendCheckBox.length]=field[i].getAttribute("id");
			selectedAuthArray[selectedAuthArray.length]=objAuthData[i+1];
		}
	}
	else if(field.length >0)
	{
		for (i = 0; i < field.length; i++)
		{
			field[i].checked = false ;
		}
		selectedAmendCheckBox.splice(0, selectedAmendCheckBox.length);
		selectedAuthArray.splice(0, selectedAuthArray.length);
	}
	else if(headerCheckbox.checked==true)
	{
	        field.checked = true ;
	        selectedAmendCheckBox[selectedAmendCheckBox.length]=field.getAttribute("id");
	        selectedAuthArray[selectedAuthArray.length]=objAuthData[1];
	}
	else
	{
	    field.checked = false ;
	    selectedAmendCheckBox.splice(0, selectedAmendCheckBox.length);
		selectedAuthArray.splice(0, selectedAuthArray.length);
	}
	
	enableDisableAmendSubmitLink();
	enableDisableAmendAuthorizeLink();
	enableDisableAmendSendLink();
	enableDisableAmendDeleteLink();
	enableDisableAmendRejectLink();
}
function showAmendmentErrorPopup() {
	$('#errorsPopup').dialog( {
		autoOpen : true,
		height : 220,
		width : 473,
		modal : true,
		buttons : {
				"OK" : function() {
					$(this).dialog('close');				
				}	
		},
		open: function() {
            $('.ui-dialog-buttonpane').find('button:contains("OK")').find('.ui-button-text').prepend('<span class="fa fa-check-circle">&nbsp;&nbsp</span>');
	}
	});
	$('#errorsPopup').dialog('open');
}

jQuery.fn.importAmendClientAutoComplete= function() {
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
								$('#txtImportAmendClientDesc').val(data.DESCR);
								$('#txtImportAmendClientCode').val(data.CODE);
							}
							simpleFilterAmend('frmMain');
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
				})/*.data("autocomplete")._renderItem = function(ul, item) {
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