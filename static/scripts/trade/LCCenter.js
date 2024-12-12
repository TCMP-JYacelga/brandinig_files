function applySortOnLC(sortCol, sorOrd, colId)
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
		frm.action = "sortImportLcList.form";
		frm.target = "";
		frm.method = "POST";
		frm.submit();		
	}
}
function moreMenu(event)
{
	if (enableDisableActionMenu == 0) 
	{
		document.getElementById("moreActions_menu").style.display = "block";
	}
	document.getElementById("moreActions_menu").style.left = event.clientX - 70 + 'px';
	document.getElementById("moreActions_menu").style.top = event.clientY + 10 + 'px';
}

function disableActionMenu()
{
	document.getElementById("moreActions_menu").style.display = "none";
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

function getAdvancedFilterPopup(frmId) 
{
	$('#advancedFilterPopup').dialog({
		autoOpen : false,
		height : 450,
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
				filterLC(frmId);
			},
				
			"Clear" :  function() {
					$('#filterForm').each (function(){
							this.reset();
							$('#txtAmount').val("0.00");
							fromDate="";
							toDate="";
							$('#txtReference').val("");
					});
		     },
			"Cancel" : function() {
					$('#filterForm').each (function(){
							this.reset();
							$('#txtAmount').val("0.00");
							fromDate="";
							toDate="";
							$('#txtReference').val("");
							
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
function filterLC(frmId)
{
	var frm = document.getElementById(frmId);	
	var detailType;
	var statusIndex = document.getElementById('txtactionstatusfilter').selectedIndex;	
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
	document.getElementById("txtDetailType").value = detailType;
	frm.action = "advanceFilterImportLc.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function simpleActionStatusFilter(frmId)
{
	var frm = document.getElementById(frmId);
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
	frm.action = "simpleFilterImportLc.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function getRejectPopupNew(frmId) 
{
	$('#rejectPopup').dialog( {
		autoOpen : false,
		height : 240,
		width : 420,
		modal : true,
		buttons : {
			"OK" : function() 
			{
				rejectLC(frmId);
			},
			"Cancel" : function() 
			{
				$(this).dialog("close");
			}
		}
	});
	$('#rejectPopup').dialog("open");
}
function getCancelPopupNew(frmId) 
{
	$('#cancelPopup').dialog( {
		autoOpen : false,
		height : 240,
		width : 420,
		modal : true,
		buttons : {
			"OK" : function() 
			{
				cancelLC(frmId);
			},
			"Cancel" : function() 
			{
				$(this).dialog("close");
			}
		}
	});
	$('#cancelPopup').dialog("open");
}

function goToPage(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function changeLCPage(navType, newPage) 
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
			frm.action = 'importLcCenter_first.form';
			break;
		case 'prev':
			frm.action = 'importLcCenter_previous.form';
			break;
		case 'next':
			if(curPage==totPage)
				  return false;
			frm.action = 'importLcCenter_next.form';
			break;
		case 'last':
			frm.action = 'importLcCenter_last.form';
			break;
		case 'input':
			$('#page_number').val(curPage);
			frm.action = 'importLcCenter_goto.form';
			break;
		default:
			alert(_errMessages.ERR_NAVIGATE);
			return false;
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function getNewLCPopUp() 
{
	$('#newLCPopup').dialog( {
		autoOpen : false,
		resizable : false,
		width : 520,
		height : 330,
		modal : true,
		position : [ 'center', 'middle' ],
		buttons : {
			"Cancel" : function() {
				$(this).dialog("close");
			}
		}
	});
	$('#addImportLCClientDesc').val('');
	$('#addImportLCClientCode').val('');
	addImportLCClientFilter();
	$('#newLCPopup').dialog("open");
}

function showAddNewLCForm1(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "newImportLcFromMyProduct.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showAddNewLCForm2(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "newImportLcFromTemplate.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function editLCData(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "editImportLc.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function amendLCData(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "amendImportLc.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function viewLCData(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "viewImportLcMasterDetails.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function simpleFilter(frmId)
{
	var frm = document.getElementById(frmId);
	if($("#txtImportLCClientDesc").length)
	 {
		if($('#txtImportLCClientDesc').val()== null || $('#txtImportLCClientDesc').val()=='')
		{
			$('#txtImportLCClientCode').val('');
		}
		else
		{
			if($('#txtImportLCClientCode').val()== null|| $('#txtImportLCClientCode').val()=='')
			{
				$('#txtImportLCClientCode').val($('#txtImportLCClientDesc').val());  
			}		  
		}
	 }
	frm.action = "simpleFilterImportLc.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

//This Array Used For Getting Selected lcs
selectedCheckBox = new Array(); 						

//This Array Used For Getting "can auth" values of lcs
selectedAuthArray=new Array();

function rowSelect(checkBoxId, jsonString, canAuth)
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
	enableDisableSubmitLink();
	enableDisableAuthorizeLink();
	enableDisableSendLink();
	enableDisableDeleteLink();
	enableDisableRejectLink();
	enableDisableCancelLink();
}

function getHistoryPopUp(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "importLcHistory.hist";
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

function enableDisableAuthorizeLink()
{
	var authorizeValue;
	if (selectedCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[0]).value;
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
	for ( var i = 1; i < selectedCheckBox.length; i++) 
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[i]).value;
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
			authorizeLC('frmMain');
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
			deleteLC('frmMain');
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

function enableDisableCancelLink()
{
	var cancelValue;
	var billMatch = true;
	if (selectedCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		cancelValue = obj.canCancel;
		
		var objstr2 = document.getElementById("TEXTBILL" + selectedCheckBox[0]).value;
		var obj2 = eval("(" + objstr2 + ")");
		var bill1 = obj2.canLCCanceled;
	}
	for ( var i = 1; i < selectedCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		cancelValue = cancelValue && obj.canCancel;
		
		var objstr2 = document.getElementById("TEXTBILL" + selectedCheckBox[i]).value;
		var obj2 = eval("(" + objstr2 + ")");
		var bill2 = obj2.canLCCanceled;
		
		if(bill1 != bill2)
		{ billMatch = false;  break; }
	}
	if (cancelValue == true && CAN_EDIT == 'true' && bill1 == 'true' && billMatch) 
	{
		$('#btnCancel').unbind('click');
		ToggleAttribute("btnCancel", true, "href");
		$('#btnCancel').click(function()
		{
			getCancelPopupNew('frmMain');
		});
	} 
	else
	{
		ToggleAttribute("btnCancel", false, "href");
		$('#btnCancel').removeAttr('onclick').click(function()
		{});
		$('#btnCancel').unbind('click');
	}	
}

function enableDisableRejectLink()
{
	var rejectValue;
	if (selectedCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[0]).value;
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
	for ( var i = 1; i < selectedCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[i]).value;
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
			getRejectPopupNew('frmMain');
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
			lcDownload('frmMain');
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
	if (sendValue == true && (CAN_AUTH == 'true' || CAN_EDIT == 'true'))
	{
		$('#btnSend').unbind('click');
		ToggleAttribute("btnSend", true, "href");
		$('#btnSend').click(function()
		{
			sendLC('frmMain');
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
			submitLC('frmMain');
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

function submitLC(frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("txtLcRef").value = selectedCheckBox;
	frm.action = "submitImportLc.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function deleteLC(frmId) 
{	
	frm = document.getElementById(frmId);
	document.getElementById("txtLcRef").value = selectedCheckBox;
	frm.action = "deleteImportLc.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function lcDownload(frmId) 
{
	underDevelopement();
	var frm = document.getElementById(frmId);
	document.getElementById("txtLcRef").value = selectedCheckBox;
	//frm.action = "downloadImportLc.seek";
	//frm.method = "POST";
	//frm.submit();
	//frm.target = "";	
}	

function authorizeLC(frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("txtLcRef").value = selectedCheckBox;
	frm.action = "authorizeImportLc.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function amendLC(frmId)
{
	$('.disabled').removeAttr("disabled");
	frm = document.getElementById(frmId);
	document.getElementById("txtLcRef").value = selectedCheckBox;
	frm.action = "amendImportLc.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function sendLC(frmId) 
{
	frm = document.getElementById(frmId);
	document.getElementById("txtLcRef").value = selectedCheckBox;
	frm.action = "sendImportLc.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function issueLC(frmId) 
{
	frm = document.getElementById(frmId);
	document.getElementById("txtLcRef").value = selectedCheckBox;
	frm.action = "issueImportLc.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function rejectLC(frmId) 
{
	frm = document.getElementById(frmId);
	document.getElementById("txtLCRejectReason").value = $('#txtAreaRejectRemark').val();	
	document.getElementById("txtLcRef").value = selectedCheckBox;
	frm.action = "rejectImportLc.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function cancelLC(frmId) 
{
	frm = document.getElementById(frmId);
	document.getElementById("txtLCCancelReason").value = $('#txtAreaCancelRemark').val();	
	document.getElementById("txtLcRef").value = selectedCheckBox;
	frm.action = "cancelImportLc.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function underDevelopement()
{
	alert("Under Development.");
	return;
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
	enableDisableSubmitLink();
	enableDisableAuthorizeLink();
	enableDisableSendLink();
	enableDisableDeleteLink();
	enableDisableRejectLink();
	enableDisableCancelLink();
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

function attachLCDoc(strUrl)
{
  var frm = document.forms["frmMain"];
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
								$('#txtImportLCClientDesc').val(data.DESCR);
								$('#txtImportLCClientCode').val(data.CODE);
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

jQuery.fn.importLCClientAutoComplete= function() {
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
								$('#addImportLCClientDesc').val(data.DESCR);
								$('#addImportLCClientCode').val(data.CODE);
							}
							addImportLCClientFilter();
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