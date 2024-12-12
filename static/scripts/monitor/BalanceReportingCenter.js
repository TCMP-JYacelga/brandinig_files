selectedCheckBox = new Array();
function goToPage(strUrl, frmId) {
	var frm = document.getElementById(frmId);
	$('.disabled').removeAttr("disabled");
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function checkUncheckBalanceReporting(field, headerCheckbox) {
	
	selectedCheckBox.splice(0, selectedCheckBox.length);
	if (headerCheckbox.checked == true && field.length > 0) {
		for (i = 0; i < field.length; i++) {
			field[i].checked = true;
			selectedCheckBox[selectedCheckBox.length] = field[i]
					.getAttribute("id");
		}
	} else if (field.length > 0) {
		for (i = 0; i < field.length; i++) {
			field[i].checked = false;
		}
		selectedCheckBox.splice(0, selectedCheckBox.length);
	} else if (headerCheckbox.checked == true) {
		field.checked = true;
		selectedCheckBox[selectedCheckBox.length] = field.getAttribute("id");
	} else {
		field.checked = false;
		selectedCheckBox.splice(0, selectedCheckBox.length);
	}
	enableDisableBackoutLink();
	enableDisableReloadLink();
	enableDisableRestoreLink();
	enableDisableImportLink();
}
function rowSelect(checkBoxId, status, index) {
	var index;
	if ((index = selectedExists(checkBoxId.getAttribute("id"))) != -1) {
		if (checkBoxId.checked == true) {
			selectedCheckBox[selectedCheckBox.length] = checkBoxId
					.getAttribute("id");
		} else {
			$('#headerCheckbox').removeAttr("checked");
			selectedCheckBox.splice(index, 1);
		}
	}

	enableDisableBackoutLink();
	enableDisableReloadLink();
	enableDisableRestoreLink();
	enableDisableImportLink();
}
function fileActionSubmit(strUrl, frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("sessionNo").value = selectedCheckBox;	
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function selectedExists(checkID) {
	for ( var i = 0; i < selectedCheckBox.length; i++) {
		if (selectedCheckBox[i] == checkID) {
			return i;
		}
	}
	return 0;
}
function enableDisableBackoutLink() {
	var backOutValue;
	if (selectedCheckBox.length > 0) {
		var objstr = document.getElementById("TEXT" + selectedCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		backOutValue = obj.canBackOut;
	}
	for ( var i = 1; i < selectedCheckBox.length; i++) {
		var objstr = document.getElementById("TEXT" + selectedCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		backOutValue = backOutValue && obj.canBackOut;
	}
	if (String(backOutValue) == 'true' && CAN_BACKOUT=='true') {
		$('#btnBackout').unbind('click');
		ToggleAttribute("btnBackout", true, "href");
		$('#btnBackout').click(function() {
			fileActionSubmit('fileBackout.form','frmMain');
		});
	} else {
		ToggleAttribute("btnBackout", false, "href");
		$('#btnBackout').removeAttr('onclick').click(function() {
		});
		$('#btnBackout').unbind('click');
	}

}
function enableDisableReloadLink() {
	var reloadValue;
	if (selectedCheckBox.length > 0) {
		var objstr = document.getElementById("TEXT" + selectedCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		reloadValue = obj.canReload;
	}
	for ( var i = 1; i < selectedCheckBox.length; i++) {
		var objstr = document.getElementById("TEXT" + selectedCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		reloadValue = reloadValue && obj.canReload;
	}

	if (String(reloadValue) == 'true'  && CAN_RELOAD=='true') {
		$('#btnReload').unbind('click');
		ToggleAttribute("btnReload", true, "href");
		$('#btnReload').click(function() {
			fileActionSubmit('fileReload.form','frmMain');
		});
	} else {
		ToggleAttribute("btnReload", false, "href");
		$('#btnReload').removeAttr('onclick').click(function() {
		});
		$('#btnReload').unbind('click');

	}
}
function enableDisableRestoreLink() {
	var restoreValue;
	if (selectedCheckBox.length > 0) {
		var objstr = document.getElementById("TEXT" + selectedCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		restoreValue = obj.canRestore;
	}

	for ( var i = 1; i < selectedCheckBox.length; i++) {
		var objstr = document.getElementById("TEXT" + selectedCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		restoreValue = restoreValue && obj.canRestore;
	}
	if (String(restoreValue) == 'true'  && CAN_RESTORE=='true') {
		$('#btnRestore').unbind('click');
		ToggleAttribute("btnRestore", true, "href");
		$('#btnRestore').click(function() {
			fileActionSubmit('fileRestore.form','frmMain');
		});
	} else {
		ToggleAttribute("btnRestore", false, "href");
		$('#btnRestore').removeAttr('onclick').click(function() {
		});
		$('#btnRestore').unbind('click');
	}

}

function enableDisableImportLink() {

	if (CAN_IMPORT=='true') {
		$('#btnUpld').unbind('click');
		ToggleAttribute("btnUpld", true, "href");		
	} else {
		ToggleAttribute("btnUpld", false, "href");
		$('#btnUpld').removeAttr('onclick').click(function() {
		});
		$('#btnUpld').unbind('click');

	}
}

function ToggleAttribute(obj, DoEnable,TagName) {
	obj = document.getElementById(obj);
	if (DoEnable) {
		var TagValue = obj.getAttribute("back_" + TagName);
		if (TagValue != null) {
			obj.setAttribute(TagName, TagValue);
			obj.removeAttribute("back_" + TagName);
		}
		var cssClass = obj.getAttribute("class");
		cssClass = cssClass.replace(" grey ", " black ");
		obj.setAttribute("class", cssClass);
	} else {
		var TagValue = obj.getAttribute(TagName);
		if (TagValue != null) {
			obj.setAttribute("back_" + TagName, TagValue);
		}
		obj.removeAttribute(TagName);
		var cssClass = obj.getAttribute("class");
		cssClass = cssClass.replace(" black ", " grey ");
		obj.setAttribute("class", cssClass);
	}
}
function showErrorPopup() {
	$('#errorsPopup').dialog({
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

function getDetailEntry(strUrl,frmId,rowIndex){
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	$('.disabled').removeAttr("disabled");
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function getAdvancedFilterPopup(strUrl, frmId) {
	var buttonsOpts = {};
	/*buttonsOpts[btnsArray['goBtn']] = function() {
		$(this).dialog("close");
		goToPage(strUrl, frmId);
	};
	buttonsOpts[btnsArray['savenfilterBtn']] = function() {
		$(this).dialog("close");
		goToPage("saveBalanceReportingAdvanceFilter.form", frmId);
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		resetBalanceReportAdvFilterForm(frmId);
		 $("#orderByFirst,#orderBySecond,#orderByThird").change();
		$(this).dialog("close");
	};*/
	$('#advancedFilterPopup').dialog({
				autoOpen : false,
				minHeight : 156,
				maxHeight : 550,
				width : 740,
				resizable : false,
				draggable : false,
				modal : true,
				/*buttons : [
				           {
				        	   id: 'goBtn',
				        	   text: '    Filter',
				        	   click: function(){
				        		   $(this).dialog("close");
				        		   goToPage(strUrl, frmId);
				        	   }
				           },
				           {
				        	   id: 'savenfilterBtn',
				        	   text: 'Save and Filter',
				        	   click: function(){
				        		   $(this).dialog("close");
				        		   goToPage("saveBalanceReportingAdvanceFilter.form", frmId);
				        	   }
				           },
				           {
				        	   id: 'cancelBtn',
				        	   text: 'Cancel',
				        	   click: function(){
				        		   resetBalanceReportAdvFilterForm(frmId);
				        		   $("#orderByFirst,#orderBySecond,#orderByThird").change();
				        		   $(this).dialog("close");
				        	   }
				           }
				],*/
				open: function(){
					/*$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset').css('float','none');
					$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset').css('margin-left','120px');
					$('#goBtn').prepend('<span><i class="fa fa-filter ux_icon-padding"></i></span>');
					$('#savenfilterBtn').prepend('<span><i class="fa fa-save ux_icon-padding"></i></span>');
					$('#cancelBtn').prepend('<span><i class="fa fa-minus-circle ux_icon-padding"></i></span>');*/
				}
			});
	$('#advancedFilterPopup').dialog("open");
	clearPopup();
	$('#advancedFilterPopup').dialog('option', 'position', 'center');
}
function cancelPopup(){
	resetBalanceReportAdvFilterForm(frmId);
	   $("#orderByFirst,#orderBySecond,#orderByThird").change();
	   $('#advancedFilterPopup').dialog("close");
}	

function saveAndFilterPopup(){
	$('#advancedFilterPopup').dialog("close");
	   goToPage("saveBalanceReportingAdvanceFilter.form", "filterForm");
}

function filterPopup(){
	$('#advancedFilterPopup').dialog("close");
	   goToPage("advanceFilterBalanceReportingCenter.form", "filterForm");
}
function changeSortOrder(linkId, hiddenSortId) {
	var sortVal = $('#' + hiddenSortId).val();
	switch (sortVal) {
		case 'D' :
			document.getElementById(hiddenSortId).value = "A";
			$('#' + linkId).removeClass("icon-collapse-blue");
			$('#' + linkId).addClass("icon-expand-blue");
			break;
		case 'A' :
			document.getElementById(hiddenSortId).value = "D";
			$('#' + linkId).removeClass("icon-expand-blue");
			$('#' + linkId).addClass("icon-collapse-blue");
			break;
	}
}
function changeSortIcons(linkId, hiddenSortId) {
	var sortVal = $('#' + hiddenSortId).val();
	switch (sortVal) {
		case 'A' :
			$('#' + linkId).removeClass("icon-collapse-blue");
			$('#' + linkId).addClass("icon-expand-blue");
			break;
		case 'D' :
			$('#' + linkId).removeClass("icon-expand-blue");
			$('#' + linkId).addClass("icon-collapse-blue");
			break;
	}
}

function getFilterData(ctrl) {
	var strData = {};
	var filterId = ctrl.options[ctrl.selectedIndex].value;
	
	if(filterId){
	strData["recKeyNo"] = filterId;
	strData["screenId"] = 'BAL_REPORTING_CENTER';
	strData[csrfTokenName] = csrfTokenValue;	
	$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
	$.ajax({
	        type: 'POST',	
	        data:strData,
	        url: "balanceReportingfilterValues.formx",	       
	        success: function(data)
	        {
	           if (data!=null) 
			   { 
	        	   popupateAdvancedFilterData(data, filterId);							   
			   }       	
	        }
	});
	} else {
		resetForm('filterForm');
		resetSortIcon();
		changeSortIcons("orderByFirst_a", "firstSort");
		changeSortIcons("orderBySecond_a", "secondSort");
		changeSortIcons("orderByThird_a", "thirdSort");
	}
}


function resetSortIcon(){
	$("#firstSort").val('A');
	$("#secondSort").val('A');
	$("#thirdSort").val('A');
}

function popupateAdvancedFilterData(data, filterId) {

	var filterData = data.FILTER_DATA;
	resetForm('filterForm');
	if (filterData) {
		$("#filterCode").val(filterId);
		$("#userCode").val(filterData.userCode);
		$("#sessionId").val(filterData.sessionNo);
		$("#fileName").val(filterData.fileName);
		$("#totalGroups").val(filterData.totalGroups);
		$("#txnCode").val(filterData.format);		

		if (filterData.startFrom !== undefined) {
			var startFrom = filterData.startFrom;		   
			var startFromDate = $.datepicker.parseDate("yy-mm-dd", startFrom);		   
			var startFromDate = $.datepicker.formatDate(defaultDateFormat, startFromDate);
			$('#startFrom').val(startFromDate);
		}
		
		if (filterData.startTo !== undefined) {
			var startTo = filterData.startTo;		   
			var startToDate = $.datepicker.parseDate("yy-mm-dd", startTo);		   
			var startToDate = $.datepicker.formatDate(defaultDateFormat, startToDate);
			$('#startTo').val(startToDate);
		}
			
		if (filterData.endFrom !== undefined) {
			var endFrom = filterData.endFrom;		   
			var endFromDate = $.datepicker.parseDate("yy-mm-dd", endFrom);		   
			var endFromDate = $.datepicker.formatDate(defaultDateFormat, endFromDate);
			$('#endFrom').val(endFromDate);
		}
		
		if (filterData.endTo !== undefined) {
			var endTo = filterData.endTo;		   
			var endToDate = $.datepicker.parseDate("yy-mm-dd", endTo);		   
			var endToDate = $.datepicker.formatDate(defaultDateFormat, endToDate);
			$('#endTo').val(endToDate);
		}
		
		$("#type").val(filterData.type);
		$("#statusFilterId").val(filterData.status);
		$("#orderByFirst").val(filterData.orderByFirst);
		$("#orderBySecond").val(filterData.orderBySecond);
		$("#orderByThird").val(filterData.orderByThird);
		$("#firstSort").val(filterData.firstSort);
		$("#secondSort").val(filterData.secondSort);
		$("#thirdSort").val(filterData.thirdSort);
		$("#orderByFirst,#orderBySecond,#orderByThird").change();
	} else {
		$("#filterCode").val(filterId);
		resetSortIcon();
	}
	changeSortIcons("orderByFirst_a", "firstSort");
	changeSortIcons("orderBySecond_a", "secondSort");
	changeSortIcons("orderByThird_a", "thirdSort");
}

function resetForm(frmId) {
	$("#" + frmId).find(':input').each(function() {
				switch (this.type) {
					case 'password' :
					case 'select-multiple' :
					case 'select-one' :
					case 'text' :
					case 'textarea' :
						$(this).val('');
						break;
					case 'checkbox' :
					case 'radio' :
						this.checked = false;
				}
			});
}
jQuery.fn.ForceNoSpecialSymbol = function() {
	return this.each(function() {
				$(this).keydown(function(e) {
					var key = e.charCode || e.keyCode || 0;
					// allow backspace, tab, delete, numbers
					// keypad numbers, letters ONLY

					return (key == 8 || key == 9 || key == 46 || key == 190
							|| (key >= 37 && key <= 40)
							|| (key >= 48 && key <= 57)
							|| (key >= 96 && key <= 105) || (key >= 65 && key <= 90));
				})
			})
};
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

jQuery.fn.OnlyNumbers = function() {
	return this
			.each(function() {
				$(this)
						.keydown(function(event) {
							var prevKey = -1, prevControl = '';
							var keynum;							
							if (window.event) { // IE
								keynum = event.keyCode;
							}
							if (event.which) { // Netscape/Firefox/Opera
								keynum = event.which;
							}
							if (event.shiftKey)
							{
							  return false;
							}							
							return((keynum == 8 || keynum == 9 || keynum == 17 || keynum == 46 || (keynum >= 35 && keynum <= 40) || (keynum >= 48 && keynum <= 57) || (keynum >= 96 && keynum <= 105) || (keynum == 65 && prevKey == 17 && prevControl == event.currentTarget.id)));							
							})
			})
};
function getBalReportingHistoryPopUp(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "balanceReportingHistory.hist";
	frm.target = "hWinSeek";
	frm.method = "POST";
	var strAttr;
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 600)/2;
	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=700,height=300";
	var winPopup = window.open ("", "hWinSeek", strAttr);
	winPopup.focus();
	frm.submit();
	frm.target = "";
}
function showUploadPopup(fptrCallback)
{
	var strUrl;	
	strUrl = "uploadBalanceReportFile.form";
		
	var dlg = $('#uploadBAIFile');
	var btnsArr={};		
	btnsArr[labels.uploadBtn]=function() {$(this).dialog("close"); uploadFile(strUrl);};
	btnsArr[labels.cancel]=function() {$(this).dialog('close');};
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:570,title : labels.uploadFile,
					buttons: btnsArr});					
	dlg.dialog('open');
}
function uploadFile(strUrl) {
	var frm = document.forms["frmMain"];
	$('#frmMain').attr((this.encoding ? 'encoding' : 'enctype') , 'multipart/form-data');
	$('.disabled').removeAttr("disabled");
	
	$('#uploadBalanceReport').appendTo('#frmMain');
	var fileType = $('#file');
	var bankReport = $('#uploadBalanceReport');
	var formMain = $('#frmMain');
	fileType.addClass('hidden');
	fileType.appendTo(formMain);
	bankReport.appendTo(formMain);
	frm.setAttribute("Content-Type", 'multipart/form-data');
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	return false;
}

function clearPopup(){
	$("#filterCode").val("");
	$("#filterName").val("");
	$("#sessionId").val("");
	$("#fileName").val("");
	$("#totalGroups").val("");
	$("#txnCode").val("");
	$("#startFrom").val("");
	$("#endFrom").val("");
	$("#type").val("");
	$("#statusFilterId").val("");
	$("#userCode").val("");
	$("#orderByFirst").val("");
	$("#orderBySecond").val("");
	$("#orderByThird").val("");
}

function deleteFilterSet(filterCode) {
	var me = this;
	var objFilterName;
	var filter = null;
	if (filterCode)
		filter = filterCode.text;
	if (filter)
		objFilterName = filter.substring(0,filter.indexOf(' :'));
	
	deleteFilterCodeFromDb(objFilterName);
	
}

function deleteFilterCodeFromDb(objFilterName) {
	var me = this;
	if (objFilterName) {
		var strUrl = 'userfilters/BAL_REPORTING_CENTER/'+objFilterName+'/remove.srvc?'+ csrfTokenName + '=' + csrfTokenValue;
		$.ajax({
					url : strUrl,
					type: 'POST',
					success : function(response) {
						
					}
				});
	}
}

