function getAdvancedFilterPopupCancel(frmId) 
{
	$('#advancedFilterPopup').dialog( {
		autoOpen : false,
		height : 430,
		width : 473,
		modal : true,
		buttons : {
			"Search" : function() {
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
				filterCancellations(frmId);
			},
				
				"Clear" : function() {
					$('#filterForm').each (function(){
							this.reset();
							$('#txtAmount').val("0.00");
							fromDate="";
							toDate="";							
					});
				},
				
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
            $('.ui-dialog-buttonpane').find('button:contains("Clear")').attr("title","Clear");
            
            $('.ui-dialog-buttonpane').find('button:contains("Cancel")').attr("title","Cancel");
            $('.ui-dialog-buttonpane').find('button:contains("Cancel")').find('.ui-button-text').prepend('<span class="fa fa-minus-circle">&nbsp;&nbsp</span>');

            $('.ui-dialog-buttonpane').find('button:contains("Search")').attr("title","Search");
            $('.ui-dialog-buttonpane').find('button:contains("Search")').find('.ui-button-text').prepend('<span class="fa fa-filter">&nbsp;&nbsp</span>');
        }          
	});
	$('#advancedFilterPopup').dialog("open");
}

function filterCancellations(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "advanceFilterImportLcCancellation.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function getRejectPopupCancel(frmId) 
{
	$('#rejectPopup').dialog( {
		autoOpen : false,
		height : 240,
		width : 420,
		modal : true,
		buttons : {
			"OK" : function() 
			{
				rejectCancel(frmId);
			},
			"Cancel" : function() 
			{
				$(this).dialog("close");
			}
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

function changeCancelPage(navType, newPage) 
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
			frm.action = 'importLcCancellationCenter_first.form';
			break;
		case 'prev':
			frm.action = 'importLcCancellationCenter_previous.form';
			break;
		case 'next':
			if(curPage==totPage)
				  return false;
			frm.action = 'importLcCancellationCenter_next.form';
			break;
		case 'last':
			frm.action = 'importLcCancellationCenter_last.form';
			break;
		case 'input':
			$('#page_number').val(curPage);
			frm.action = 'importLcCancellationCenter_goto.form';
			break;
		default:
			alert(_errMessages.ERR_NAVIGATE);
			return false;
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function editCancelData(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "cancelCenter_edit.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function viewCancelData(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "viewImportLcCancellationMasterDetails.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function simpleFilterCancel(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "simpleFilterImportLcCancellation.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

selectedCancelCheckBox = new Array(); 						
//This Array Used For Getting Selected lcs

//This Array Used For Getting "can auth" values of lcs
selectedAuthArray=new Array();

function rowCancelSelect(checkBoxId, jsonString, canAuth)
{
	var index;
	if ((index = selectedCancelExists(checkBoxId.getAttribute("id"))) != -1)
	{
		if (checkBoxId.checked == true)
		{	
			selectedCancelCheckBox[selectedCancelCheckBox.length] = checkBoxId.getAttribute("id");
			selectedAuthArray[selectedAuthArray.length] = canAuth;
		}
		else
		{
			selectedCancelCheckBox.splice(index, 1);
			selectedAuthArray.splice(index, 1);
		}
	}
	enableDisableCancelAuthorizeLink();
	enableDisableCancelSendLink();
	enableDisableCancelDeleteLink();
	enableDisableCancelRejectLink();
}

function getCancelHistoryPopUp(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "importLcCancellationHistory.hist";
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

function selectedCancelExists(checkID) 
{
	for ( var i = 0; i < selectedCancelCheckBox.length; i++) 
	{
		if (selectedCancelCheckBox[i] == checkID)
		{
			return i;
     	}
	}
	return 0;
}

function enableDisableCancelAuthorizeLink()
{
	var authorizeValue;
	if (selectedCancelCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCancelCheckBox[0]).value;
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
	for ( var i = 1; i < selectedCancelCheckBox.length; i++) 
	{
		var objstr = document.getElementById("TEXT" + selectedCancelCheckBox[i]).value;
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
			authorizeCancel('frmMain');
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

function enableDisableCancelDeleteLink()
{
	var deleteValue;
	if (selectedCancelCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCancelCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		deleteValue = obj.canDelete;
	}
	for ( var i = 1; i < selectedCancelCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedCancelCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		deleteValue = deleteValue && obj.canDelete;
	}
	if (deleteValue == true && CAN_EDIT == 'true') 
	{
		$('#btnDelete').unbind('click');
		ToggleAttribute("btnDelete", true, "href");
		$('#btnDelete').click(function()
		{
			deleteCancel('frmMain');
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

function enableDisableCancelRejectLink()
{
	var rejectValue;
	if (selectedCancelCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCancelCheckBox[0]).value;
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
	for ( var i = 1; i < selectedCancelCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedCancelCheckBox[i]).value;
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
			getRejectPopupCancel('frmMain');
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

function enableDisableCancelDownloadLink()
{
	var downloadValue;
	if (selectedCancelCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCancelCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		downloadValue = obj.canDownload;
	}
	for ( var i = 1; i < selectedCancelCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedCancelCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		downloadValue = downloadValue && obj.canDownload;
	}
	if (downloadValue == true) 
	{
		$('#btnDownload').unbind('click');
		ToggleAttribute("btnDownload", true, "href");
		$('#btnDownload').click(function()
		{
			cancelDownload('frmMain');
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

function enableDisableCancelSendLink()
{
	var sendValue;
	if (selectedCancelCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCancelCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		sendValue = obj.canSend;
	}
	for ( var i = 1; i < selectedCancelCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedCancelCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		sendValue = sendValue && obj.canSend;
	}
	if (sendValue == true && (CAN_AUTH == 'true' || CAN_EDIT == 'true'))
	{
		$('#btnSend').unbind('click');
		ToggleAttribute("btnSend", true, "href");
		$('#btnSend').click(function()
		{
			sendCancel('frmMain');
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

function selectedCancel(invIntRefNumber)
{
	tmpInvIntRefNumber = invIntRefNumber;
}

function deleteCancel(frmId) 
{	
	frm = document.getElementById(frmId);
	document.getElementById("txtLcRef").value = selectedCancelCheckBox;
	frm.action = "deleteImportLcCancellation.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function cancelDownload(frmId) 
{
	underDevelopement();
	var frm = document.getElementById(frmId);
	document.getElementById("txtLcRef").value = selectedCancelCheckBox;
	//frm.action = "downloadImportLcCancellation.seek";
	//frm.method = "POST";
	//frm.submit();
	//frm.target = "";	
}	

function authorizeCancel(frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("txtLcRef").value = selectedCancelCheckBox;
	frm.action = "authorizeImportLcCancellation.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function sendCancel(frmId) 
{
	frm = document.getElementById(frmId);
	document.getElementById("txtLcRef").value = selectedCancelCheckBox;
	frm.action = "sendImportLcCancellation.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function rejectCancel(frmId) 
{
	frm = document.getElementById(frmId);
	document.getElementById("txtLCRejectReason").value = $('#txtAreaRejectRemark').val();	
	document.getElementById("txtLcRef").value = selectedCancelCheckBox;
	frm.action = "rejectImportLcCancellation.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function underDevelopement()
{
	alert("Under Development.");
	return;
}

function applySortOnCancel(sortCol, sorOrd, colId)
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
		frm.action = "sortImportLcCancellationList.form";
		frm.target = "";
		frm.method = "POST";
		frm.submit();		
	}
}

function checkUncheckLcCancellation(field,headerCheckbox)
{
		selectedCancelCheckBox.splice(0, selectedCancelCheckBox.length);
		selectedAuthArray.splice(0, selectedAuthArray.length);
		
	if(headerCheckbox.checked==true && field.length >0)
	{
		for (i = 0; i < field.length; i++)
		{
			field[i].checked = true ;
			selectedCancelCheckBox[selectedCancelCheckBox.length]=field[i].getAttribute("id");
			selectedAuthArray[selectedAuthArray.length]=objAuthData[i+1];
		}
	}
	else if(field.length >0)
	{
		for (i = 0; i < field.length; i++)
		{
			field[i].checked = false ;
		}
		selectedCancelCheckBox.splice(0, selectedCancelCheckBox.length);
		selectedAuthArray.splice(0, selectedAuthArray.length);
	}
	else if(headerCheckbox.checked==true)
	{
	        field.checked = true ;
	        selectedCancelCheckBox[selectedCancelCheckBox.length]=field.getAttribute("id");
	        selectedAuthArray[selectedAuthArray.length]=objAuthData[1];
	}
	else
	{
	    field.checked = false ;
	    selectedCancelCheckBox.splice(0, selectedCancelCheckBox.length);
		selectedAuthArray.splice(0, selectedAuthArray.length);
	}
	
	enableDisableCancelAuthorizeLink();
	enableDisableCancelSendLink();
	enableDisableCancelDeleteLink();
	enableDisableCancelRejectLink();
}

function showCancellationErrorPopup() {
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

jQuery.fn.importCancelClientAutoComplete= function() {
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
								$('#txtImportCancelClientDesc').val(data.DESCR);
								$('#txtImportCancelClientCode').val(data.CODE);
							}
							simpleFilterCancel('frmMain');
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