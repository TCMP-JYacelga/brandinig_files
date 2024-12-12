function getAdvancedFilterPopup(strUrl, frmId) {
	var buttonsOpts = {};
	buttonsOpts[btnsArray['filterBtn']] = function() {
		$(this).dialog("close");
		goToPage(strUrl, frmId);
	};
	buttonsOpts[btnsArray['saveFilterBtn']] = function() {
		$(this).dialog("close");
		goToPage('incomingWiresSaveAndFilter.form', frmId);
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		resetIncomingAdvFilterForm(frmId);
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
	$("#advancedFilterPopup").dialog('option','position','center');
}

jQuery.fn.dateTextBox = function() {
	return this.each(function() {
				$(this)
						.keydown(function(e) {
							var key = e.charCode || e.keyCode || 0;
							// allow backspace, tab, delete, arrows, numbers and
							// keypad for TAB
							return (key == 9 || key==8 || key==46);
							})
			})
};
function goToPage(strUrl, frmId) {
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function getWireDetails(strUrl,frmId,rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function getFilterData(ctrl) {
	var filterCode=ctrl.options[ctrl.selectedIndex].value;
	if(filterCode)
	{
	var strData = {};
	strData['recKeyNo'] = ctrl.options[ctrl.selectedIndex].value;
	strData["screenId"] = 'Loan Center';
	strData[csrfTokenName] = csrfTokenValue;	
	$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
	$.ajax({
	        type: 'POST',	
	        data:strData,
	        url: "incomingWiresfilterValues.formx",	       
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
        case 'senderName':
            document.getElementById('senderNameAdv').value = data.FILTER_DATA[key];
            break;
        case 'fromDate':
        	var vDate = data.FILTER_DATA[key];		   
     	    var vFromDate = $.datepicker.parseDate("yy-mm-dd", vDate);		   
    		var vFromDate = $.datepicker.formatDate(defaultDateFormat, vFromDate);	
            document.getElementById('fromDateAdv').value = vFromDate;
            break;
        case 'toDate':
        	var vDate = data.FILTER_DATA[key];		   
      	    var vToDate = $.datepicker.parseDate("yy-mm-dd", vDate);		   
     		var vToDate = $.datepicker.formatDate(defaultDateFormat, vToDate);	
            document.getElementById('toDateAdv').value = vToDate;
            break;
        case 'amountFilterOption':
        	document.getElementById('amountFilterOption').value = data.FILTER_DATA[key];
            break;
        case 'paymentAmount':
            document.getElementById('paymentAmount').value = data.FILTER_DATA[key];
            break;
        case 'fedReference':
        	 document.getElementById('fedReference').value = data.FILTER_DATA[key];
            break;
        case 'receiverAccNmbr':
            document.getElementById('receiverAccNmbr').value = data.FILTER_DATA[key];
            break;
        case 'sendingBankABA':
            document.getElementById('sendingBankABA').value = data.FILTER_DATA[key];
            break;
        case 'sendingBankName':
            document.getElementById('sendingBankName').value = data.FILTER_DATA[key];
            break;
	     }
	}
}
function generateCreditReport(strUrl,reckey){
	strUrl = strUrl+"?$strRecKey="+reckey+"&$strRepCode=CREDITAD" ;
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
	}