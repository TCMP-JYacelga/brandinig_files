selectedCheckBox = new Array();
selectedMakerArray=new Array();

function getRejectPopup() {
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
					loanSubmit("rejectLoan.form", "frmMain");
				}
		}
	});
	$('#rejectPopup').dialog("open");
}

function getAdvancedFilterPopup(strUrl, frmId) {
	var buttonsOpts = {};
	buttonsOpts[btnsArray['filterBtn']] = function() {
		$(this).dialog("close");
		goToPage(strUrl, frmId);
	};
	buttonsOpts[btnsArray['saveFilterBtn']] = function() {
		$(this).dialog("close");
		goToPage('loanCenterSaveAndFilter.form', frmId);
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		resetLoanAdvanceFilterForm(frmId);
		$(this).dialog("close");
	};
	$('#advancedFilterPopup').dialog({
				autoOpen : false,
				height : 450,
				width : 473,
				modal : true,
				buttons : buttonsOpts
			});
	$('#advancedFilterPopup').dialog("open");
}
function goToPage(strUrl, frmId) {
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function simpleLoanFilter(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "simpleFilterLoan.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function getLoanHistoryPopUp(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "loanHistory.hist";
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
// This Array Used For Getting Selected loans.

function loanSubmit(strUrl, frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("txtIntRefNum").value = selectedCheckBox;	
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function checkUncheckLoan(field,headerCheckbox)
{
		selectedCheckBox.splice(0, selectedCheckBox.length);		
		selectedMakerArray.splice(0, selectedMakerArray.length);
		
	if(headerCheckbox.checked==true && field.length >0)
	{
		for (i = 0; i < field.length; i++)
		{
			field[i].checked = true ;
			selectedCheckBox[selectedCheckBox.length]=field[i].getAttribute("id");			
			selectedMakerArray[selectedMakerArray.length]=objAuthData[i+1];
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
			selectedMakerArray[selectedMakerArray.length]=objAuthData[1];
	}
	else
	{
	    field.checked = false ;
		selectedCheckBox.splice(0, selectedCheckBox.length);		
		selectedMakerArray.splice(0, selectedMakerArray.length);
	}
	enableDisableAuthorizeLink();	
	enableDisableSendLink();
	enableDisableRejectLink();
	enableDisableDeleteLink();
}

function rowSelect(checkBoxId, jsonString, isAuth)
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
	
	enableDisableAuthorizeLink();
	enableDisableSendLink();
	enableDisableRejectLink();	
	enableDisableDeleteLink();	
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
		var maker=selectedMakerArray[0];
		if(maker=='false' || maker==false)
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
		var maker=selectedMakerArray[i];
		if(maker=='false' || maker==false)
		{	
			authorizeValue = authorizeValue && obj.canAuthorise && false;
		}
		else
		{
			authorizeValue = authorizeValue && obj.canAuthorise;
		}
	}	
	if (String(authorizeValue) == 'true' && CAN_AUTH == 'true') 
	{
		$('#btnAuth').unbind('click');
		ToggleAttribute("btnAuth", true, "href");
		$('#btnAuth').click(function()
		{
			loanSubmit('authorizeLoan.form','frmMain');
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
	
	if (String(deleteValue) == 'true' && CAN_EDIT == 'true') 
	{
		$('#btnDelete').unbind('click');
		ToggleAttribute("btnDelete", true, "href");
		$('#btnDelete').click(function()
				{
			loanSubmit('deleteLoan.form','frmMain')
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

function enableDisableRejectLink()
{
	var rejectValue;
	if (selectedCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		var maker=selectedMakerArray[0];
		if(maker=='false' || maker==false)
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
		var maker=selectedMakerArray[i];
		if(maker=='false' || maker==false)
		{	
			rejectValue = rejectValue && obj.canReject && false;
		}
		else
		{
			rejectValue = rejectValue && obj.canReject;
		}
	}
	if (String(rejectValue) == 'true' && CAN_AUTH == 'true') 
	{
		$('#btnReject').unbind('click');
		ToggleAttribute("btnReject", true, "href");
		$('#btnReject').click(function()
				{
			getRejectPopup();
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
	CAN_AUTH == 'true';
	if (String(sendValue) == 'true' && CAN_AUTH == 'true')
	{
		$('#btnSend').unbind('click');
		ToggleAttribute("btnSend", true, "href");
		$('#btnSend').click(function()
		{
			loanSubmit('sendLoan.form','frmMain');
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

function getFilterData(ctrl) {
var filterCode=ctrl.options[ctrl.selectedIndex].value;
	if(filterCode)
	{
	var strData = {};
		strData['recKeyNo'] = filterCode;
		strData["screenId"] = 'Loan Center';
		strData[csrfTokenName] = csrfTokenValue;	
		$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
		$.ajax({
		        type: 'POST',	
		        data:strData,
		        url: "loanfilterValues.formx",	       
		        success: function(data)
		        {
		           if (data!=null) 
				   { 
		        	   advFilterResetForm('filterForm');
		        	   ctrl.value = filterCode;
		        	   valuesRetrieved(data);							   
				   }       	
		        }
		});
		}
		else{
		advFilterResetForm('filterForm');
		}
	
}

function advFilterResetForm(frmId) {
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

function valuesRetrieved(data) {

	 for (key in data.FILTER_DATA) {
	     switch (key) {
	     case 'filterCode':
	            break;
       case 'filterName':
           document.getElementById('filterName').value = '';
           break;
       case 'requestReference':
           document.getElementById('requestReferenceAdv').value = data.FILTER_DATA[key];
           break;
       case 'loanAccNmbr':
           document.getElementById('loanAccNmbr').value = data.FILTER_DATA[key];
           break;
       case 'amountFilterOption':
           document.getElementById('amountFilterOption').value = data.FILTER_DATA[key];
           break;
       case 'requestedAmnt':
       	document.getElementById('requestedAmnt').value = data.FILTER_DATA[key];
           break;
       case 'fromDate':
    	   var vDate = data.FILTER_DATA[key];		   
    	   var vFromDate = $.datepicker.parseDate("yy-mm-dd", vDate);		   
   		   var vFromDate = $.datepicker.formatDate(defaultDateFormat, vFromDate);		   
           document.getElementById('fromDate').value = vFromDate;
           break;
       case 'toDate':
		   var vDate = data.FILTER_DATA[key];		   
    	   var vToDate = $.datepicker.parseDate("yy-mm-dd", vDate);		   
   		   var vToDate = $.datepicker.formatDate(defaultDateFormat, vToDate);	
   		   document.getElementById('toDate').value = vToDate;
           break;
       case 'beneName':
           document.getElementById('beneName').value = data.FILTER_DATA[key];
           break;
       case 'paymentType':
           document.getElementById('paymentType').value = data.FILTER_DATA[key];
           break;
       case 'stateFilter':
           document.getElementById('advStateFilter').value = data.FILTER_DATA[key];
           break;
	     }
	}
}