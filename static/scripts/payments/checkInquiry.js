function getCheckInquiryEntryPopup(strUrl, frmId,index) {
	var buttonsOpts = {};
	var title='';
	buttonsOpts[btnsArray['submitBtn']] = function() {
		var radiobuttons = $('.radio');
		for (var i=0 ; i < radiobuttons.length ; i++)
		{
			if((radiobuttons[i].checked)&&(radiobuttons[i].value === 'S'))
			{
			     $('#checkTo').val($('#checkFrom').val());
			}
		}
		
		goToPage(strUrl, frmId);
		$(this).dialog("close");
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		$(this).dialog("close");
	};
	if(document.getElementById('retry').value=='Y')
		{
		if(document.getElementById('isErr').value=='N')
		{
			resetCheckInquiryEntryForm('checkInquiryEntryForm');
		}
		$('#chkReference').attr('readonly',true);
			title = retryTitle
		var strJson = document.getElementById("TEXTJSON"+index).value;
		var obj = JSON.parse(strJson);
		
		$('#chkReference').val(obj.chkReference);
		$('#checkNoType').val(obj.checkNoType);
		$('#checkFrom').val(obj.checkFrom);
		$('#checkTo').val(obj.checkTo);
		$('#accountNumber').val(obj.accountNumber);
		$('#checkAmount').val(obj.checkAmount);
		if(obj.checkDate!=null)
		{
		var valueDate = $.datepicker.parseDate("yy-mm-dd",  obj.checkDate);
	    var valueCheckDate = $.datepicker.formatDate(datePickDateFormat,valueDate);	
		$('#checkDate').val(valueCheckDate);
		}
		
		$('#checkEntryPayee').val(obj.checkEntryPayee);
		$('#checkStatus').val(obj.checkStatus);
		$('#currency').text(obj.accountCCY);
		$('#accountCCY').val(obj.accountCCY);
		$('#checkAttempts').val(obj.checkAttempts);
		}
	else
		{
		if(document.getElementById('isErr').value=='N')
		{
			resetCheckInquiryEntryForm('checkInquiryEntryForm');
		}
		$('#chkReference').attr('readonly',false);
			title =newTitle
		}
	$('#checkInquiryEntryPopup').dialog({
				autoOpen : false,
				height : 350,
				width : 550,
				modal : true,
				title : title,
				buttons : buttonsOpts
			});
	$('#checkInquiryEntryPopup').dialog("open");
}
function getCheckInquiryViewPopup(index) {
	var buttonsOpts = {};
	buttonsOpts[btnsArray['closeBtn']] = function() {
		$(this).dialog("close");
	};

		var strJson = document.getElementById("TEXTJSON"+index).value;
		var obj = JSON.parse(strJson);
		var status=document.getElementById("statusLabel"+index).value;
		
		$('#message').text(obj.message);
		$('#checkStatus').text(status);

		var valueDate = $.datepicker.parseDate("yy-mm-dd",  obj.checkDate);
	    var valueCheckDate = $.datepicker.formatDate(datePickDateFormat,valueDate);	
		
		$('#checkDate').text(valueCheckDate);
		$('#checkAmount').text(obj.checkAmount);
		$('#bankRef').text(obj.BankRef);
		$('#trackingNo').text(obj.trackingNo);
		$('#checkPayee').text(obj.checkEntryPayee);
		
	$('#checkInquiryViewPopup').dialog({
				autoOpen : false,
				height : 350,
				width : 473,
				modal : true,
				buttons : buttonsOpts
			});
	$('#checkInquiryViewPopup').dialog("open");
}

function getMsgPopup() {
	$('#checkInquiryConfirmMsgPopup').dialog( {
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
	$('#checkInquiryConfirmMsgPopup').dialog('open');
}

function goToViewPage(strUrl, frmId,index)
{
	var strJson = document.getElementById("TEXTJSON"+index).value;
	var obj = JSON.parse(strJson);
	document.getElementById("txtRecIndex").value = index;	
	document.getElementById("accno").value = obj.accountNumber;	
	goToPage(strUrl, frmId);
}
function goToPage(strUrl, frmId) {
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showBackPage(strUrl)
{
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function changeCheckInquirySort(sortCol, sortOrd, colId) {
	var frm = document.getElementById('frmMain');
	if (!frm) {
		alert(_errMessages.ERR_NOFORM);
		return false;
	}
	if (!isEmpty(colId)) 
	{
		document.getElementById("txtSortColId").value=colId;
		document.getElementById("txtSortColName").value=sortCol;
		document.getElementById("txtSortOrder").value=sortOrd;
   		frm.action = 'checkInquiryList.form';
   		frm.target = "";
   		frm.method = "POST";
   		frm.submit();
	}
	else {
	alert(_errMessages.ERR_NOFORM);
	return false;
	}
}

function search()
{
	    var frm = document.getElementById("frmMain");
	    if ('0' == document.getElementById("searchKey").value)
		{
			if (null != document.getElementById("toEntryDate"))
			{
				document.getElementById("toEntryDate").value = '';
			}
			if (null != document.getElementById("fromEntryDate"))
			{
				document.getElementById("fromEntryDate").value = '';
			}
		}	
	    document.getElementById("simpleDate").value = document.getElementById("searchKey").value;
	    document.getElementById("checkInquiryStatus").value = document.getElementById("cboCheckInquiryStatus").value;
	    createJSONFromAdvFilterValues('advancedFilterPopupCheckInquiry');
	    frm.action = "checkInquiryAdvFilter.form"; 
	    frm.target ="";
	    frm.method = "POST";    
	    frm.submit();		
}

function getCheckInquiryHistoryPopUp(frmId, rowIndex) {
	
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecIndex").value = rowIndex;
	frm.action = "checkInquiry.hist";
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

function getCheckedRadio() {
	var radiobuttons = document.getElementsByName('checkType');
		for (var i=0; i < radiobuttons.length; i++) {
			if((radiobuttons[i].checked) && (radiobuttons[i].value === 'S'))
			{
					document.getElementById('checkNoTo').value = document.getElementById('checkNoFrom').value; 
				    break;
			}
		}
}

function getAdvancedFilterPopupCheckInquiry(strUrl,frmId) {
	var buttonsOpts = {};
	$("#firstSortCol,#secondSortCol,#thirdSortCol").change();
	buttonsOpts[btnsArray['filterContinueBtn']] = function() {
		if ("Y" == $("#simpleDateFlag").val()) {
			$("#searchKey").val('7');
			$("#simpleDate").val('7');
		}
		getCheckedRadio();
		createJSONFromAdvFilterValues('advancedFilterPopupCheckInquiry');
		
		$(this).dialog("close");
		$(this).hide();
	    goToPage(strUrl, frmId);
	};
	buttonsOpts[btnsArray['saveFilterBtn']] = function() {
		if ("Y" == $("#simpleDateFlag").val())
		{
			$("#searchKey").val('7');
			$("#simpleDate").val('7');
		}
		getCheckedRadio();
		createJSONFromAdvFilterValues('advancedFilterPopupCheckInquiry');
		
		$(this).dialog("close");
		$(this).hide();
	    goToPage('checkInquirySaveAndApplyFilter.form', frmId);
	};
	
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		resetForm('advancedFilterPopupCheckInquiry');
		if('{}' != document.getElementById('filterData').value)
		{
			setAdvFilterValuesFromJSON('advancedFilterPopupCheckInquiry',document.getElementById('filterData').value);
			setSimpleFilterFromJSON(document.getElementById('filterData').value);
			var filter = JSON.parse(document.getElementById('filterData').value);
			if(null != filter.checkType) {
				$("input[type=radio][name=checkType][value=" + filter.checkType + "]").prop("checked",true);
				//to retain the fields on cancel
				if(filter.checkType === "S") {
					$('#singleCheckEntry').hide();
				} else {
					$('#singleCheckEntry').show();
				}
			}
		}
		$("#firstSortCol,#secondSortCol,#thirdSortCol").change();
		$(this).dialog("close");
	};
	$('#advancedFilterPopupCheckInquiry').dialog({
				autoOpen : false,
				height : 555,
				width : 550,
				modal : true,
				buttons : buttonsOpts
			});
	$('#advancedFilterPopupCheckInquiry').dialog("open");
}

function setSimpleFilterFromJSON(jsonString) {
	var json = JSON.parse(jsonString);
	if(json.simpleDate==undefined)
	{
	$("#searchKey").val("0");
	}
	else
	{
	$("#searchKey").val(json.simpleDate);
	}
	$("#cboCheckInquiryStatus").val(json.checkInquiryStatus);
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
				}
			});
}

function changeSimpleDateFlag() {
	$("#simpleDateFlag").val('Y');
}

function getFilterDataforCheckInquiry(ctrl) {
	var strData = {};
	var filterId = ctrl.options[ctrl.selectedIndex].value;
	
	if(filterId){
	strData["recKeyNo"] = filterId;
	strData["screenId"] = 'CHECK_INQUIRY';
	strData[csrfTokenName] = csrfTokenValue;	
	$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
	$.ajax({
	        type: 'POST',	
	        data:strData,
	        url: "checkInquiryFilterValues.formx",	       
	        success: function(data)
	        {
	           if (data!=null) 
			   { 
	        	   populateAdvancedFilterDataforCheckInquiry(data, filterId);							   
			   }       	
	        }
	});
	} else {
		resetForm('advancedFilterPopupCheckInquiry');
	}
}

function populateAdvancedFilterDataforCheckInquiry(data, filterId) {
	var filterData = data.FILTER_DATA;
	resetForm('advancedFilterPopupCheckInquiry');
	setAdvFilterValuesFromJSON('advancedFilterPopupCheckInquiry',JSON.stringify(filterData));
	if(null != filterData.checkType) {
				$("input[type=radio][value=" + filterData.checkType + "]").prop("checked",true);
				if(filterData.checkType === "S") {
					$('#singleCheckEntry').hide();
				} else {
					$('#singleCheckEntry').show();
				}
			}
	$("#filterCode").val('');
	$("#firstSortCol,#secondSortCol,#thirdSortCol").change();
}

function toggleCheckNotype(cntrl) {
		if(cntrl.value==="S") {
			$('#singleCheckEntry').hide();
		}
		else {
			$('#singleCheckEntry').show();
		}
} 

