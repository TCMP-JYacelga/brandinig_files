
function goToPage(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function approveReject(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	document.getElementById('txtAchTxnRefNum').value = selectedCheckBox;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function acceptTransaction(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	document.getElementById('txtAchTxnRefNum').value = selectedAcceptArray;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function goToTab(strUrl, frmId, type)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txnType").value=type;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function viewTransaction(strUrl, frmId, batchReference, txnType)
{
	var frm = document.getElementById(frmId);
	document.getElementById("batchReference").value = batchReference;
	document.getElementById("txnType").value = txnType;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showTransaction(strUrl, frmId, txtRecordIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = txtRecordIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function simpleBatchFilter(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "simpleFilterAchBatch.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function simpleFilter(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "achTxn_sfilter.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function createResponse(frmId, txnTypeId,txtRecordIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = txtRecordIndex;
	var strUrl;
	switch(txnTypeId)
	{
	case '1':
		strUrl="createReturn.form"
	  break;
	case '2':
		strUrl="createDishonor.form"
	  break;
	case '3':
		strUrl="createContest.form"
	  break;
	case '5':
		strUrl="createNoc.form"
	  break;
	case '6':
		strUrl="createRefusal.form"
	  break;
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function getAchTxnHistoryPopUp(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "achTxnHistory.hist";
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

function getAdvancedFilterPopup(frmId)
{
	$('#advancedFilterPopup').dialog({
		autoOpen : false,
		height : 545,
		width : 870,
		modal : true,
		buttons :
		{
			"Cancel" : function() {
				persistAdvanceFilterFields();				
				$("#orderByFirst,#orderBySecond,#orderByThird, #orderByFourth").change();					
				$(this).dialog("close");
			},
			"Filter" : function() {
				$(this).dialog("close");
				goToPage('achTxn_afilter.form', frmId);
			},
			"Save and Filter" : function() {
				$(this).dialog("close");
				goToPage('achTxn_saveandfilter.form', frmId);
			}
		}
	});
	$('#advancedFilterPopup').dialog("open");
}
function getAdvancedBatchFilterPopup(frmId)
{
	$('#advancedFilterPopup').dialog({
		autoOpen : false,
		height : 480,
		width : 750,
		modal : true,
		buttons :
		{
			"Cancel" : function() {
				$(this).dialog("close");
			},
			"Go" : function() {
				$(this).dialog("close");
				goToPage('achBatch_afilter.form', frmId);
			}
		}
	});
	$('#advancedFilterPopup').dialog("open");
}

function getAddNewPopUp(frmId)
{
	$('#addNewPopUp').dialog({
		autoOpen : false,
		height : 150,
		width : 300,
		modal : true
	});
	$('#addNewPopUp').dialog("open");
}

selectedCheckBox = new Array(); //This Array Used For Getting Selected Transactions.
invalidCheckBox = new Array();
selectedAcceptArray = new Array();
invalidAcceptArray = new Array();


function handleEnableDisableForApproveReject(checkBoxId,status,makerId, direction)
{
	var index;
	var invalidIndex;

	if(makerId != USER && status=="PendingAuth")
	{
       if ((index = selectedExists(checkBoxId.getAttribute("id"),selectedCheckBox)) != -1 && checkBoxId.checked==false)
		{
			selectedCheckBox.splice(index, 1);

		}else if(checkBoxId.checked==true)
		{
			if((index = selectedExists(checkBoxId.getAttribute("id"),selectedCheckBox)) == -1)
			{
			selectedCheckBox[selectedCheckBox.length] =checkBoxId.getAttribute("id");
			}
		}
	}
	else if((invalidIndex = selectedExists(checkBoxId.getAttribute("id"),invalidCheckBox)) != -1 && checkBoxId.checked==false)
	{
		invalidCheckBox.splice(invalidIndex, 1);
	}else
	{
		if((invalidIndex = selectedExists(checkBoxId.getAttribute("id"),invalidCheckBox)) == -1)
		{
		if(checkBoxId.checked==true)
		{
		invalidCheckBox[invalidCheckBox.length] =checkBoxId.getAttribute("id");
		}
		}
	}
	
	
	if(direction == "I" && (status == null || status==undefined || status == ""))
	{
       if ((index = selectedExists(checkBoxId.getAttribute("id"),selectedAcceptArray)) != -1 && checkBoxId.checked==false)
		{
    	   selectedAcceptArray.splice(index, 1);

		}else if(checkBoxId.checked==true)
		{
			if((index = selectedExists(checkBoxId.getAttribute("id"),selectedAcceptArray)) == -1)
			{
				selectedAcceptArray[selectedAcceptArray.length] =checkBoxId.getAttribute("id");
			}
		}
	}
	else if((invalidIndex = selectedExists(checkBoxId.getAttribute("id"),invalidAcceptArray)) != -1 && checkBoxId.checked==false)
	{
		invalidAcceptArray.splice(invalidIndex, 1);
	}else
	{
		if((invalidIndex = selectedExists(checkBoxId.getAttribute("id"),invalidAcceptArray)) == -1)
		{
		if(checkBoxId.checked==true)
		{
			invalidAcceptArray[invalidAcceptArray.length] =checkBoxId.getAttribute("id");
		}
		}
	}
	
    if(selectedCheckBox.length > 0 && invalidCheckBox.length==0 && CAN_AUTH == 'true')
	{
		ToggleAttribute('btnAppr',true,'href');
		ToggleAttribute('btnReject',true,'href');

		$('#btnAppr').unbind('click');
		$('#btnReject').unbind('click');

		$('#btnAppr').click(function()
		{
			approveReject('approveTransaction.form', 'frmMain');
		});

		$('#btnReject').click(function()
		{
			getAchTxnRejectPopup('frmMain');
		});

	}else
	{
		ToggleAttribute('btnAppr',false,'href');
		ToggleAttribute('btnReject',false,'href');

		$('#btnAppr').removeAttr('onclick').click(function()
				{
				});
		$('#btnAppr').unbind('click');

		$('#btnReject').removeAttr('onclick').click(function()
				{
				});
		$('#btnReject').unbind('click');
			
	}
    
    if(selectedAcceptArray.length > 0 && invalidAcceptArray.length==0)
	{
		ToggleAttribute('btnAcc',true,'href');
		
		$('#btnAcc').unbind('click');
		
		$('#btnAcc').click(function()
		{
			acceptTransaction('acceptTransaction.form', 'frmMain');
		});

	} else {
		ToggleAttribute('btnAcc',false,'href');
		
		$('#btnAcc').removeAttr('onclick').click(function()
				{
				});
		$('#btnAcc').unbind('click');	
	}
    
    enableDisableDownload();
}

function getAchTxnRejectPopup(frmId) 
{
	$('#rejectPopup').dialog( {
		autoOpen : false,
		height : 240,
		width : 420,
		modal : true,
		buttons :[
		{
			text:getLabel('btnOk','Ok'),
			click : function() {
				rejectAchTxn(frmId);
			}
		},
		{
			text:getLabel('btncancel','Cancel'),
			click : function() {
				$(this).dialog("close");
			}
		}
		]
	});
	$('#rejectPopup').dialog("open");
}

function rejectAchTxn(frmId) 
{
	frm = document.getElementById(frmId);
	document.getElementById("txtAchRejectReason").value = $('#txtAreaRejectRemark').val();		
	document.getElementById('txtAchTxnRefNum').value = selectedCheckBox;
	frm.action = "rejectTransaction.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function enableDisableDownload()
{
	if(selectedCheckBox.length > 0 || invalidCheckBox.length > 0)
	{
		ToggleAttribute('btnDownload',true,'href');
        $('#btnDownload').unbind('click');

		$('#btnDownload').click(function()
		{
			transactionDownload('downloadTransaction.seek','frmMain');
		});
	}else
	{
		ToggleAttribute('btnDownload',false,'href');
		$('#btnDownload').removeAttr('onclick').click(function()
				{
				});
		$('#btnDownload').unbind('click');
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

function selectedExists(checkID,array)
{
	for ( var i = 0; i < array.length; i++)
	{
		if (array[i] == checkID)
		{
			return i;
     	}
	}
	return -1;
}

function changeSortOrder(linkId,hiddenSortId)
{
	
	
	var sortVal= document.getElementById(hiddenSortId).value;
	switch (sortVal)
	{
	case 'D':
		document.getElementById(hiddenSortId).value="A";
		$('#' + linkId).removeClass("icon-collapse-blue");
		$('#' + linkId).addClass("icon-expand-blue");
		break;
	case 'A':
		document.getElementById(hiddenSortId).value="D";
		$('#' + linkId).removeClass("icon-expand-blue");
		$('#' + linkId).addClass("icon-collapse-blue");
		
		break;
	}

}

function transactionDownload(strUrl, frmId)
{
	var allTxn = new Array();

	for ( var i = 0; i < selectedCheckBox.length; i++)
	{
		allTxn[allTxn.length] = selectedCheckBox[i];

	}
	for ( var i = 0; i < invalidCheckBox.length; i++)
	{
		allTxn[allTxn.length] = invalidCheckBox[i];

	}

	var frm = document.getElementById(frmId);
	document.getElementById("txtAchTxnRefNum").value = allTxn;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
	frm.target = "";
}

selectedCheckBox = new Array();


function checkUncheck(field,headerCheckbox)
{		
	if(headerCheckbox.checked==true && field.length >0)
	{
		for (i = 0; i < field.length; i++)
		{
			field[i].checked = true ;
			handleEnableDisableForApproveReject(field[i],objStatusList[i+1],objMakerList[i+1],objDirectionList[i+1]);
		}
	}
	else if(field.length >0)
	{
		for (i = 0; i < field.length; i++)
		{
			field[i].checked = false ;
			handleEnableDisableForApproveReject(field[i],objStatusList[i+1],objMakerList[i+1],objDirectionList[i+1]);
		}
		ToggleAttribute('btnAcc',false,'href');
		ToggleAttribute('btnAppr',false,'href');
		ToggleAttribute('btnReject',false,'href');
		ToggleAttribute('btnDownload',false,'href');
	}
	else if(headerCheckbox.checked==true)
	{
	        field.checked = true ;
	        handleEnableDisableForApproveReject(field[0],objStatusList[1],objMakerList[1],objDirectionList[i+1]);
	}
	else
	{
	    field.checked = false ;
	    ToggleAttribute('btnAcc',false,'href');
		ToggleAttribute('btnAppr',false,'href');
		ToggleAttribute('btnReject',false,'href');
		ToggleAttribute('btnDownload',false,'href');
	}
	enableDisableDownload();	
}


function sortHandler(colName, sortOrder, colIndex) {
	var frm = document.getElementById('frmMain');
	if (!frm) {
		alert(_errMessages.ERR_NOFORM);
		return false;
	}
	if (!isEmpty(colIndex)) 
	{
		document.getElementById("txtSortColId").value=colIndex;
		document.getElementById("txtSortColName").value=colName;
		document.getElementById("txtSortOrder").value=sortOrder;
   		frm.action = 'achSortList.form';
   		frm.target = "";
   		frm.method = "POST";
   		frm.submit();
	}
	else {
	alert(_errMessages.ERR_NOFORM);
	return false;
	}
}

function getAchFilterData(ctrl) {
	var strData = {};
	var filterId = ctrl.options[ctrl.selectedIndex].value;
	
	if(filterId){	
	strData["recKeyNo"] = filterId;
	strData["screenId"] = 'Incoming ACH';
	strData[csrfTokenName] = csrfTokenValue;	
	$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
	$.ajax({
	        type: 'POST',	
	        data:strData,
	        url: "achTxnfilterValues.formx",	       
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
		changeSortIcons("orderByFourth_a", "fourthSort");	
	}
}


function resetSortIcon(){
	$("#firstSort").val('A');
	$("#secondSort").val('A');
	$("#thirdSort").val('A');
	$("#fourthSort").val('A');
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
function popupateAdvancedFilterData(data, filterId) {
	var filterData = data.FILTER_DATA;	
	if (filterData) {	
			resetForm('filterForm');
			$('#filtercode').val(filterId);				
			if(null!==filterData.filterFlag && 'P'==filterData.filterFlag)
			{	
				$('#publicFlag').attr('checked','checked');
			}
				$('#cboType').val(filterData.txnTypeCode);
				if(null!==filterData.txnDirection && filterData.txnDirection=='I')
					$('#txtDirection_I').attr('checked',true);
				else if(null!==filterData.txnDirection && filterData.txnDirection=='T')
					$('#txtDirection_T').attr('checked',true);
				else if(null!==filterData.txnDirection && filterData.txnDirection=='A')
					$('#txtDirection_A').attr('checked',true);				
				$('#cboStatus').val(filterData.txnStatusCode);
				$('#incomingDateCheck').val(filterData.incomingDateCheck);
				
				if (filterData.incomingDate !== undefined) {
					var vIncomingDate = filterData.incomingDate;		   
					var vFormattedDate = $.datepicker.parseDate("yy-mm-dd", vIncomingDate);		   
					var vFormattedDate = $.datepicker.formatDate(defaultDateFormat, vFormattedDate);
				$('#txtDateTime').val(vFormattedDate);
				}
				
				$('#effectiveDateCheck').val(filterData.effectiveDateCheck);
				if (filterData.effectiveDate !== undefined) {
					var vDate = filterData.effectiveDate;
					var vEffDate = $.datepicker.parseDate("yy-mm-dd", vDate);
					var vEffDate = $.datepicker.formatDate(defaultDateFormat, vEffDate);
					$('#txtEffective').val(vEffDate);	
				}
				
				$('#txtCompanyId').val(filterData.companyId);	
				$('#txtCompanyName').val(filterData.companyName);
				$('#txtSECCode').val(filterData.secCode);
				$('#txtTxnCode').val(filterData.txnCode);	
				$('#txtTrace').val(filterData.trace);
				$('#txtOrignalTrace').val(filterData.originalTrace);
				$('#txtBatchReference').val(filterData.batchReference);
				$('#senderStatus').val(filterData.senderStatus);
				$('#txtCorrectionCode').val(filterData.correctionCode);
				$('#txtServiceClass').val(filterData.serviceClass);
				$('#txtCustNameIdAcct').val(filterData.custInfo);	
				$('#txtAba').val(filterData.receivingBank);	
				$('#txtEntryDesc').val(filterData.entryDescription);	
				$('#txtDescretionary').val(filterData.descretionaryData);
				$('#orderByFirst').val(filterData.orderByFirstSort);
				$('#orderBySecond').val(filterData.orderBySecondSort);
				$('#orderByThird').val(filterData.orderByThirdSort);
				$('#orderByFourth').val(filterData.orderByFourthSort);
				$('#firstSort').val(filterData.firstSort);
				$('#secondSort').val(filterData.secondSort);
				$('#thirdSort').val(filterData.thirdSort);     
				$('#fourthSort').val(filterData.fourthSort);  
				$("#orderByFirst,#orderBySecond,#orderByThird, #orderByFourth").change();				
	}
	else
	{
		$("#filterCode").val(filterId);
		resetSortIcon();		
	}	
		changeSortIcons("orderByFirst_a", "firstSort");
		changeSortIcons("orderBySecond_a", "secondSort");
		changeSortIcons("orderByThird_a", "thirdSort");	
		changeSortIcons("orderByFourth_a", "fourthSort");			
}
