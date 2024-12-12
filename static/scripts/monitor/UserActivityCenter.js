function getAdvancedFilterPopup(strUrl, frmId) {
	var buttonsOpts = {};
	buttonsOpts[btnsArray['goBtn']] = function() {
		$(this).dialog("close");
		goToPage(strUrl, frmId);
	};
	buttonsOpts[btnsArray['savenfilterBtn']] = function() {
		$(this).dialog("close");
		goToPage("saveAdvanceFilterUserActivity.form", frmId);
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		resetUserActAdvFilterForm(frmId);
		$("#orderByFirst,#orderBySecond,#orderByThird").change();
		$(this).dialog("close");
	};
	$('#advancedFilterPopup').dialog({
				autoOpen : false,
				height : 500,
				width : 550,
				modal : true,
				buttons : buttonsOpts
			});
	$('#advancedFilterPopup').dialog("open");
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

function goToPage(strUrl, frmId) {
	var frm = document.getElementById(frmId);
	$('.disabled').removeAttr("disabled");
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
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

function checkUncheckUserActivity(field, headerCheckbox) {
	selectedCheckBoxArray.splice(0, selectedCheckBoxArray.length);

	if (headerCheckbox.checked == true && field.length > 0) {
		for (i = 0; i < field.length; i++) {
			if (field[i].value == 'Y') {
				field[i].checked = true;
				selectedCheckBoxArray[selectedCheckBoxArray.length] = field[i]
						.getAttribute("id");
			}
		}
	} else if (field.length > 0) {
		for (i = 0; i < field.length; i++) {
			field[i].checked = false;
		}
		selectedCheckBoxArray.splice(0, selectedCheckBoxArray.length);
	} else if (headerCheckbox.checked == true) {
		if (field.value == "Y") {
			field.checked = true;
			selectedCheckBoxArray[selectedCheckBoxArray.length] = field
					.getAttribute("id");
		}
	} else {
		field.checked = false;
		selectedCheckBoxArray.splice(0, selectedCheckBoxArray.length);
	}
	enableDisableCancelLink();
}

function rowUserActivitySelect(checkBoxId) {
	var index;
	if ((index = selectedUserActivityExists(checkBoxId.getAttribute("id"))) != -1) {
		if (checkBoxId.checked == true) {
			selectedCheckBoxArray[selectedCheckBoxArray.length] = checkBoxId
					.getAttribute("id");
		} else {
			$('#headerCheckbox').removeAttr("checked");
			selectedCheckBoxArray.splice(index, 1);
		}
	}
	enableDisableCancelLink();
}
function selectedUserActivityExists(checkID) {
	for (var i = 0; i < selectedCheckBoxArray.length; i++) {
		if (selectedCheckBoxArray[i] == checkID) {
			return i;
		}
	}
	return 0;
}
function cancelSessions(frmId) {
	if (selectedCheckBoxArray.length > 0) {
		frm = document.getElementById(frmId);
		$('#hiddenUserActivityRef').val(selectedCheckBoxArray);
		frm.action = "cancelSessions.form";
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
}

function enableDisableCancelLink() {
	if (selectedCheckBoxArray.length > 0) {
		$('#btnReject').unbind('click');
		ToggleAttribute("btnReject", true, "href");
		$('#btnReject').click(function() {
					cancelSessions('frmMain');
				});
	} else {
		ToggleAttribute("btnReject", false, "href");
		$('#btnReject').removeAttr('onclick').click(function() {
				});
		$('#btnReject').unbind('click');
	}
}
function ToggleAttribute(obj, DoEnable, TagName) {
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

function getFilterData(ctrl) {
	var strData = {};
	var filterId = ctrl.options[ctrl.selectedIndex].value;
	if(filterId){	
	strData["recKeyNo"] = filterId;
	strData["screenId"] = 'USER_ACTIVITY_CENTER';
	strData[csrfTokenName] = csrfTokenValue;	
	$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
	$.ajax({
	        type: 'POST',	
	        data:strData,
	        url: "userActivityfilterValues.formx",	       
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
				$('#userName').val(filterData.userName);
				$('#userCode').val(filterData.userCode);
				$('#userCategory').val(filterData.userCategory);
				$('#clientName').val(filterData.clientName);
				
				if (filterData.sessionStartFromDate !== undefined) {
					var sessionStartFromDate = filterData.sessionStartFromDate;		   
					var vSessionStartFromDate = $.datepicker.parseDate("yy-mm-dd", sessionStartFromDate);		   
					var vSessionStartFromDate = $.datepicker.formatDate(defaultDateFormat, vSessionStartFromDate);
					$('#sessionStartFromDate').val(vSessionStartFromDate);
				}
				
				if (filterData.sessionStartToDate !== undefined) {
					var sessionStartToDate = filterData.sessionStartToDate;		   
					var vSessionStartToDate = $.datepicker.parseDate("yy-mm-dd", sessionStartToDate);		   
					var vSessionStartToDate = $.datepicker.formatDate(defaultDateFormat, vSessionStartToDate);
					$('#sessionStartToDate').val(vSessionStartToDate);
				}
				
				if (filterData.lastRequestFromDate !== undefined) {
					var lastRequestFromDate = filterData.lastRequestFromDate;		   
					var vLastRequestFromDate = $.datepicker.parseDate("yy-mm-dd", lastRequestFromDate);		   
					var vLastRequestFromDate = $.datepicker.formatDate(defaultDateFormat, vLastRequestFromDate);
					$('#lastRequestFromDate').val(vLastRequestFromDate);
				}
				
				if (filterData.lastRequestToDate !== undefined) {
					var lastRequestToDate = filterData.lastRequestToDate;		   
					var vLastRequestToDate = $.datepicker.parseDate("yy-mm-dd", lastRequestToDate);		   
					var vLastRequestToDate = $.datepicker.formatDate(defaultDateFormat, vLastRequestToDate);
					$('#lastRequestToDate').val(vLastRequestToDate);
				}			
				
				$('#corporationName').val(filterData.corporationName);
				$('#orderByFirst').val(filterData.orderByFirst);
				$('#orderBySecond').val(filterData.orderBySecond);
				$('#orderByThird').val(filterData.orderByThird);
				$('#firstSort').val(filterData.firstSort);
				$('#secondSort').val(filterData.secondSort);
				$('#thirdSort').val(filterData.thirdSort);     		
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