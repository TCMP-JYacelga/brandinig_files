jQuery.fn.clientCodeSeekAutoCompleteAmend= function() {
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
								$('#txtAmendClientDesc').val(data.DESCR);
								$('#txtAmendClientCode').val(data.CODE);
							}
						}
						simpleFilterAmend('frmMain');
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
					filterSBLCGTYAmend(frmId);
				},
//				
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

function filterSBLCGTYAmend(frmId)
{
	var frm = document.getElementById(frmId);
	var type = document.getElementById('type').value;
	if(type == "SBLC")
	{	
		frm.action = "advanceFilterImportStandbyLcAmendment.form";
	}
	if(type == "GTY")
	{	
		frm.action = "advanceFilterImportGuaranteeAmendment.form";
	}
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
				rejectSBLCGTYAmend(frmId);
			},
			"Cancel" : function() 
			{
				$(this).dialog("close");
			}
		}
	});
	$('#rejectPopup').dialog("open");
}

function simpleFilterAmend(frmId)
{
	var frm = document.getElementById(frmId);
	var type = document.getElementById('type').value;
	
	if($("#txtAmendClientDesc").length)
	{
		if($('#txtAmendClientDesc').val()== null || $('#txtAmendClientDesc').val()=='')
		{
			$('#txtAmendClientCode').val('');
		}
	}
	if(type == "SBLC")
	{	
		frm.action = "simpleFilterImportStandbyLcAmendment.form";
	}
	if(type == "GTY")
	{	
		frm.action = "simpleFilterImportGuaranteeAmendment.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

selectedCheckBoxAmend = new Array(); 						
//This Array Used For Getting Selected lcs


//This Array Used For Getting "can auth" values of lcs
selectedAuthArray=new Array();

function rowSelectAmend(checkBoxId, jsonString, canAuth)
{
	var index;
	if ((index = selectedExists(checkBoxId.getAttribute("id"))) != -1)
	{
		if (checkBoxId.checked == true)
		{	
			selectedCheckBoxAmend[selectedCheckBoxAmend.length] = checkBoxId.getAttribute("id");
			selectedAuthArray[selectedAuthArray.length] = canAuth;
		}
		else
		{
			selectedCheckBoxAmend.splice(index, 1);
			selectedAuthArray.splice(index, 1);
		}
	}
	enableDisableSubmitLinkAmend();
	enableDisableAuthorizeLinkAmend();
	enableDisableRejectLinkAmend();
	enableDisableSendLinkAmend();
	enableDisableDeleteLinkAmend();
}

function getHistoryPopUpAmend(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	var type = document.getElementById('type').value;
	if(type == "SBLC")
	{	
		frm.action = "importStandbyLcAmendmentHistory.hist";
	}
	if(type == "GTY")
	{	
		frm.action = "importGuaranteeAmendmentHistory.hist";
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
	window.open ("", "hWinSeek", strAttr);
	frm.submit();
	frm.target = "";
}

function selectedExistsAmend(checkID) 
{
	for ( var i = 0; i < selectedCheckBoxAmend.length; i++) 
	{
		if (selectedCheckBoxAmend[i] == checkID)
		{
			return i;
     	}
	}
	return 0;
}

function enableDisableAuthorizeLinkAmend()
{
	var authorizeValue;
	if (selectedCheckBoxAmend.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBoxAmend[0]).value;
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
	for ( var i = 1; i < selectedCheckBoxAmend.length; i++) 
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBoxAmend[i]).value;
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
			authorizeSBLCGTYAmend('frmMain');
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

function enableDisableDeleteLinkAmend()
{
	var deleteValue;
	if (selectedCheckBoxAmend.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBoxAmend[0]).value;
		var obj = eval("(" + objstr + ')');
		deleteValue = obj.canDelete;
	}
	for ( var i = 1; i < selectedCheckBoxAmend.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBoxAmend[i]).value;
		var obj = eval("(" + objstr + ')');
		deleteValue = deleteValue && obj.canDelete;
	}
	if (deleteValue == true && CAN_EDIT == 'true') 
	{
		$('#btnDelete').unbind('click');
		ToggleAttribute("btnDelete", true, "href");
		$('#btnDelete').click(function()
		{
			deleteSBLCGTYAmend('frmMain');
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

function enableDisableRejectLinkAmend()
{
	var rejectValue;
	if (selectedCheckBoxAmend.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBoxAmend[0]).value;
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
	for ( var i = 1; i < selectedCheckBoxAmend.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBoxAmend[i]).value;
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

function enableDisableDownloadLinkAmend()
{
	var downloadValue;
	if (selectedCheckBoxAmend.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBoxAmend[0]).value;
		var obj = eval("(" + objstr + ')');
		downloadValue = obj.canDownload;
	}
	for ( var i = 1; i < selectedCheckBoxAmend.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBoxAmend[i]).value;
		var obj = eval("(" + objstr + ')');
		downloadValue = downloadValue && obj.canDownload;
	}
	if (downloadValue == true) 
	{
		$('#btnDownload').unbind('click');
		ToggleAttribute("btnDownload", true, "href");
		$('#btnDownload').click(function()
		{
			SblcGtyDownloadAmend('frmMain');
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

function enableDisableSendLinkAmend()
{
	var sendValue;
	if (selectedCheckBoxAmend.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBoxAmend[0]).value;
		var obj = eval("(" + objstr + ')');
		sendValue = obj.canSend;
	}
	for ( var i = 1; i < selectedCheckBoxAmend.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBoxAmend[i]).value;
		var obj = eval("(" + objstr + ')');
		sendValue = sendValue && obj.canSend;
	}
	if (sendValue == true && (CAN_AUTH == 'true' || CAN_EDIT == 'true'))
	{
		$('#btnSend').unbind('click');
		ToggleAttribute("btnSend", true, "href");
		$('#btnSend').click(function()
		{
			sendSBLCGTYAmend('frmMain');
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

function enableDisableSubmitLinkAmend()
{
	var submitValue;
	if (selectedCheckBoxAmend.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBoxAmend[0]).value;
		var obj = eval("(" + objstr + ')');
		submitValue = obj.canSubmit;
	}
	for ( var i = 1; i < selectedCheckBoxAmend.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBoxAmend[i]).value;
		var obj = eval("(" + objstr + ')');
		submitValue = submitValue && obj.canSubmit;
	}
	if (submitValue == true && CAN_EDIT == 'true')
	{
		$('#btnSubmit').unbind('click');
		ToggleAttribute("btnSubmit", true, "href");
		$('#btnSubmit').click(function()
		{
			submitSBLCGTYAmend('frmMain');
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

function selectedLC(invIntRefNumber)
{
	tmpInvIntRefNumber = invIntRefNumber;
}

function submitSBLCGTYAmend(frmId)
{
	var type = document.getElementById('type').value;
	frm = document.getElementById(frmId);
	document.getElementById("txtSBLcGtyRef").value = selectedCheckBoxAmend;
	if(type == "SBLC")
	{	
		frm.action = "submitImportStandbyLcAmendment.form";
	}
	if(type == "GTY")
	{	
		frm.action = "submitImportGuaranteeAmendment.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function deleteSBLCGTYAmend(frmId) 
{	
	var type = document.getElementById('type').value;
	frm = document.getElementById(frmId);
	document.getElementById("txtSBLcGtyRef").value = selectedCheckBoxAmend;
	if(type == "SBLC")
	{	
		frm.action = "deleteImportStandbyLcAmendment.form";
	}
	if(type == "GTY")
	{	
		frm.action = "deleteImportGuaranteeAmendment.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function SblcGtyDownloadAmend(frmId) 
{
	var type = document.getElementById('type').value;
	underDevelopement();
	var frm = document.getElementById(frmId);
	document.getElementById("txtSBLcGtyRef").value = selectedCheckBoxAmend;
	//frm.action = "downloadImportLc.seek";
	//frm.method = "POST";
	//frm.submit();
	//frm.target = "";	
}	

function authorizeSBLCGTYAmend(frmId)
{
	var type = document.getElementById('type').value;
	frm = document.getElementById(frmId);
	document.getElementById("txtSBLcGtyRef").value = selectedCheckBoxAmend;
	if(type == "SBLC")
	{	
		frm.action = "authorizeImportStandbyLcAmendment.form";
	}
	if(type == "GTY")
	{	
		frm.action = "authorizeImportGuaranteeAmendment.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function sendSBLCGTYAmend(frmId) 
{
	var type = document.getElementById('type').value;
	frm = document.getElementById(frmId);
	document.getElementById("txtSBLcGtyRef").value = selectedCheckBoxAmend;
	if(type == "SBLC")
	{	
		frm.action = "sendImportStandbyLcAmendment.form";
	}
	if(type == "GTY")
	{	
		frm.action = "sendImportGuaranteeAmendment.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function rejectSBLCGTYAmend(frmId) 
{
	var type = document.getElementById('type').value;
	frm = document.getElementById(frmId);
	document.getElementById("txtSBLCGTYRejectReason").value = $('#txtAreaRejectRemark').val();	
	document.getElementById("txtSBLcGtyRef").value = selectedCheckBoxAmend;
	if(type == "SBLC")
	{	
		frm.action = "rejectImportStandbyLcAmendment.form";
	}
	if(type == "GTY")
	{	
		frm.action = "rejectImportGuaranteeAmendment.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function viewSBLCGTYDataAmend(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	var type = document.getElementById('type').value;
	if(type == "SBLC")
	{	
		frm.action = "viewImportStandbyLcAmendmentMasterDetails.form";
	}
	if(type == "GTY")
	{	
		frm.action = "viewImportGuaranteeAmendmentMasterDetails.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function editSBLCGTYDataAmend(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	var type = document.getElementById('type').value;
	if(type == "SBLC")
	{	
		frm.action = "editImportStandbyLcAmendment.form";
	}
	if(type == "GTY")
	{	
		frm.action = "editImportGuaranteeAmendment.form";
	}
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
	var type = document.getElementById('type').value;	
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
		if(type == "SBLC")
		{	
			frm.action = "sortImportStandbyLcAmendmentList.form";
		}
		if(type == "GTY")
		{	
			frm.action = "sortImportGuaranteeAmendmentList.form";
		}
		frm.target = "";
		frm.method = "POST";
		frm.submit();		
	}
}

function changeAmendPage(navType, newPage) 
{	
	var type = document.getElementById('type').value;
	var frm = document.getElementById('frmMain');
	if (!frm) 
	{
		alert(_errMessages.ERR_NOFORM);
		return false;
	}	
	var curPage=$('.pcontrol input', this.pDiv).val();
	var totPage='<c:out value="${total_pages}"/>';
	var prefix;	
	if(type == "SBLC")
	{
		prefix = "importStandbyLc";		
	}
	if(type == "GTY")
	{
		prefix = "importGuarantee";	
	}	
	switch(navType) 
	{
		case 'first':
			frm.action = prefix+'AmendmentCenter_first.form';
			break;
		case 'prev':
			frm.action = prefix+'AmendmentCenter_previous.form';
			break;
		case 'next':
			if(curPage==totPage)
				  return false;
			frm.action = prefix+'AmendmentCenter_next.form';
			break;
		case 'last':
			frm.action = prefix+'AmendmentCenter_last.form';
			break;
		case 'input':
			$('#page_number').val(curPage);
			frm.action = prefix+'AmendmentCenter_goto.form';
			break;
		default:
			alert(_errMessages.ERR_NAVIGATE);
			return false;
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function checkUncheckLcAmendment(field,headerCheckbox)
{
		selectedCheckBoxAmend.splice(0, selectedCheckBoxAmend.length);
		selectedAuthArray.splice(0, selectedAuthArray.length);
		
	if(headerCheckbox.checked==true && field.length >0)
	{
		for (i = 0; i < field.length; i++)
		{
			field[i].checked = true ;
			selectedCheckBoxAmend[selectedCheckBoxAmend.length]=field[i].getAttribute("id");
			selectedAuthArray[selectedAuthArray.length]=objAuthData[i+1];
		}
	}
	else if(field.length >0)
	{
		for (i = 0; i < field.length; i++)
		{
			field[i].checked = false ;
		}
		selectedCheckBoxAmend.splice(0, selectedCheckBoxAmend.length);
		selectedAuthArray.splice(0, selectedAuthArray.length);
	}
	else if(headerCheckbox.checked==true)
	{
	        field.checked = true ;
	        selectedCheckBoxAmend[selectedCheckBoxAmend.length]=field.getAttribute("id");
	        selectedAuthArray[selectedAuthArray.length]=objAuthData[1];
	}
	else
	{
	    field.checked = false ;
	    selectedCheckBoxAmend.splice(0, selectedCheckBoxAmend.length);
		selectedAuthArray.splice(0, selectedAuthArray.length);
	}
	
	enableDisableSubmitLinkAmend();
	enableDisableAuthorizeLinkAmend();
	enableDisableRejectLinkAmend();
	enableDisableSendLinkAmend();
	enableDisableDeleteLinkAmend();
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