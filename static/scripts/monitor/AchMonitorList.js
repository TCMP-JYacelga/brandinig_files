function goToPage(strUrl, frmId, isTabClicked) {
	if(isTabClicked == 'T')
	{
		$('#filterData').val(null);
	}
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function searchAchMonitorFile()
{
	   var frm = document.getElementById("frmMain");
	   if ('7' != document.getElementById("searchKey").value)
	   {
		   if ('0' == document.getElementById("searchKey").value)
			{
				if (null != document.getElementById("achFileStart"))
				{
					document.getElementById("achFileStart").value = '';
				}
				if (null != document.getElementById("achFileEnd"))
				{
					document.getElementById("achFileEnd").value = '';
				}
			}	
		    document.getElementById("simpleDate").value = document.getElementById("searchKey").value;
		    document.getElementById("status").value = document.getElementById("cboStatus").value;
		    createJSONFromAdvFilterValues('advancedFilterPopup');
		    frm.action = "advanceFilterAchMonitorFile.form"; 
		    frm.target ="";
		    frm.method = "POST";    
		    frm.submit();
	   }
	   else
	   {
		   	handleDateChange(document.getElementById("searchKey").value);
			document.getElementById("startDate").hidden=false;
			document.getElementById("endDate").hidden=false;
			document.getElementById("goBtn").hidden=false;
	   }
	    	
}

function searchAchMonitorFileOnBtn()
{
	   var frm = document.getElementById("frmMain");
		   if ('0' == document.getElementById("searchKey").value)
			{
				if (null != document.getElementById("achFileStart"))
				{
					document.getElementById("achFileStart").value = '';
				}
				if (null != document.getElementById("achFileEnd"))
				{
					document.getElementById("achFileEnd").value = '';
				}
			}	
		    document.getElementById("simpleDate").value = document.getElementById("searchKey").value;
		    document.getElementById("status").value = document.getElementById("cboStatus").value;
		    createJSONFromAdvFilterValues('advancedFilterPopup');
		    frm.action = "advanceFilterAchMonitorFile.form"; 
		    frm.target ="";
		    frm.method = "POST";    
		    frm.submit();
	    	
}


function changeAchMonitorFileListsSort(sortCol, sortOrd,colId) {
	
	
	var frm = document.getElementById('frmMain');
	if (!frm) {
		alert(_errMessages.ERR_NOFORM);
		return false;
	}
	if (!isEmpty(sortCol)) 
	{
		document.getElementById("txtSortColName").value=sortCol;
		document.getElementById("txtSortOrder").value= sortOrd;
		document.getElementById("txtSortColId").value=colId;
		frm.action = 'sortAchMonitorFileCenter.form';
   		frm.target = "";
   		frm.method = "POST";
   		frm.submit();
	}
	else {
	alert(_errMessages.ERR_NOFORM);
	return false;
	}
}


function changeViewFileBatchSort(sortCol, sortOrd,colId) {
	
	
	var frm = document.getElementById('frmMain');
	document.getElementById("selectedIndex").value = 1;
	if (!frm) {
		alert(_errMessages.ERR_NOFORM);
		return false;
	}
	if (!isEmpty(sortCol)) 
	{
		document.getElementById("txtSortColName").value=sortCol;
		document.getElementById("txtSortOrder").value= sortOrd;
		document.getElementById("txtSortColId").value=colId;
		frm.action = 'sortViewAchMonitorFileDetail.form';
   		frm.target = "";
   		frm.method = "POST";
   		frm.submit();
	}
	else {
	alert(_errMessages.ERR_NOFORM);
	return false;
	}
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

function getAchMonitorFileAdvancedFilterPopup(strUrl, frmId) {
	var buttonsOpts = {};
	var quickStatus =  document.getElementById("cboStatus").value;
	resetForm(frmId);
	if('{}' != document.getElementById('filterData').value)
	{
		setAdvFilterValuesFromJSON('advancedFilterPopup',document.getElementById('filterData').value);
		setSimpleFilterFromJSON(document.getElementById('filterData').value);
	}
	if('7' != document.getElementById("searchKey").value)
	{
		 document.getElementById("startDate").hidden=true;
		 document.getElementById("endDate").hidden=true;
		 document.getElementById("goBtn").hidden=true;
	}
	document.getElementById("status").value = quickStatus ;
	document.getElementById("cboStatus").value = quickStatus ;
	/*buttonsOpts[btnsArray['filterBtn']] = function() {
		
		if ("Y" == $("#simpleDateFlag").val())
		{
			$("#searchKey").val('7');
			$("#simpleDate").val('7');
		}
		createJSONFromAdvFilterValues('advancedFilterPopup');
		
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
		createJSONFromAdvFilterValues('advancedFilterPopup');
		
		$(this).dialog("close");
		$(this).hide();
		goToPage('achMonitorFileCenterSaveAndFilter.form', frmId);
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		resetForm('advancedFilterPopup');
		resetOrderByComboValues();
		if('{}' != document.getElementById('filterData').value)
		{
			setAdvFilterValuesFromJSON('advancedFilterPopup',document.getElementById('filterData').value);
			setSimpleFilterFromJSON(document.getElementById('filterData').value);
		}
		$(this).dialog("close");
	};*/
	$('#advancedFilterPopup').dialog({
				autoOpen : false,
				minHeight : 156,
				maxHeight : 550,
				width : 735,
				resizable : false,
				draggable : false,
				modal : true,
				/*buttons : [
				           {
				        	   id: 'filterBtn',
				        	   text: 'Filter',
				        	   click: function(){
				        		   if ("Y" == $("#simpleDateFlag").val())
				        			{
				        				$("#searchKey").val('7');
				        				$("#simpleDate").val('7');
				        			}
				        			createJSONFromAdvFilterValues('advancedFilterPopup');
				        			
				        			$(this).dialog("close");
				        			$(this).hide();
				        			goToPage(strUrl, frmId);
				        	   }
				           },
				           {
				        	   id: 'saveFilterBtn',
				        	   text: 'Save and Filter',
				        	   click: function(){
				        		   if ("Y" == $("#simpleDateFlag").val())
				        			{
				        				$("#searchKey").val('7');
				        				$("#simpleDate").val('7');
				        			}
				        			createJSONFromAdvFilterValues('advancedFilterPopup');
				        			
				        			$(this).dialog("close");
				        			$(this).hide();
				        			goToPage('achMonitorFileCenterSaveAndFilter.form', frmId);
				        	   }
				           },
				           {
				        	   id: 'cancelBtn',
				        	   text: 'Cancel',
				        	   click: function(){
				        		   resetForm('advancedFilterPopup');
				        			resetOrderByComboValues();
				        			if('{}' != document.getElementById('filterData').value)
				        			{
				        				setAdvFilterValuesFromJSON('advancedFilterPopup',document.getElementById('filterData').value);
				        				setSimpleFilterFromJSON(document.getElementById('filterData').value);
				        			}
				        			$(this).dialog("close");
				        	   }
				           }
				],*/
				open: function(){
					/*$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset').css('float','none');
					$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset').css('margin-left','260px');
					$('#filterBtn span').prepend('<span><i class="fa fa-filter ux_icon-padding"></i></span>');
					$('#saveFilterBtn span').prepend('<span><i class="fa fa-save ux_icon-padding"></i></span>');
					$('#cancelBtn span').prepend('<span><i class="fa fa-minus-circle ux_icon-padding"></i></span>');*/
				}
			});
	$('#advancedFilterPopup').dialog("open");
	$('#advancedFilterPopup').dialog('option', 'position', 'center');
}

function cancelFilePopup(){
	resetForm('advancedFilterPopup');
	resetOrderByComboValues();
	if('{}' != document.getElementById('filterData').value)
	{
		setAdvFilterValuesFromJSON('advancedFilterPopup',document.getElementById('filterData').value);
		setSimpleFilterFromJSON(document.getElementById('filterData').value);
	}
	$('#advancedFilterPopup').dialog("close");
}	

function saveAndFilterFilePopup(){
	 if ("Y" == $("#simpleDateFlag").val())
		{
			$("#searchKey").val('7');
			$("#simpleDate").val('7');
		}
		createJSONFromAdvFilterValues('advancedFilterPopup');
		
		$('#advancedFilterPopup').dialog("close");
		$('#advancedFilterPopup').hide();
		goToPage('achMonitorFileCenterSaveAndFilter.form', "frmMain");
}

function filterFilePopup(){
	if ("Y" == $("#simpleDateFlag").val())
	{
		$("#searchKey").val('7');
		$("#simpleDate").val('7');
	}
	createJSONFromAdvFilterValues('advancedFilterPopup');
	
	$('#advancedFilterPopup').dialog("close");
	$('#advancedFilterPopup').hide();
	goToPage("advanceFilterAchMonitorFile.form", "frmMain");
}

function resetSortIcon(){
	$("#firstSort").val('A');
	$("#secondSort").val('A');
	$("#thirdSort").val('A');
}


function getFilterData(ctrl,url,popupId) {
	var strData = {};
	var filterId = ctrl.options[ctrl.selectedIndex].value;
	
	if(filterId){
	resetOrderByComboValues();
	strData["recKeyNo"] = filterId;
	strData["screenId"] = 'ALERTS_CENTER';
	strData[csrfTokenName] = csrfTokenValue;	
	$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
	$.ajax({
	        type: 'POST',	
	        data:strData,
	        url: url,	       
	        success: function(data)
	        {
	           if (data!=null) 
			   { 
	        	   popupateAdvancedFilterData(data, filterId, popupId);							   
			   }       	
	        }
	});
	} else {
		resetForm(popupId);
		resetSortIcon();
		changeSortIcons("orderByFirst_a", "firstSort");
		changeSortIcons("orderBySecond_a", "secondSort");
		changeSortIcons("orderByThird_a", "thirdSort");
		changeSortIcons("orderByFourth_a", "fourthSort");
	}
}

function popupateAdvancedFilterData(data, filterId, popupId) {

	var filterData = data.FILTER_DATA;
	resetForm(popupId);
	setAdvFilterValuesFromJSON('advancedFilterPopup',JSON.stringify(filterData));
	$("#filterCode").val('');
	
	changeSortIcons("orderByFirst_a", "firstSort");
	changeSortIcons("orderBySecond_a", "secondSort");
	changeSortIcons("orderByThird_a", "thirdSort");
	changeSortIcons("orderByFourth_a", "fourthSort");
}

function changeAchMonitorBatchSort(sortCol, sortOrd,colId,url) {
	var frm = document.getElementById('frmBatchMain');
	if (!frm) {
		alert(_errMessages.ERR_NOFORM);
		return false;
	}
	if (!isEmpty(sortCol)) 
	{
		document.getElementById("txtSortColName").value=sortCol;
		document.getElementById("txtSortOrder").value= sortOrd;
		document.getElementById("txtSortColId").value=colId;
		frm.action = 'sortAchMonitorBatchCenter.form';
   		frm.target = "";
   		frm.method = "POST";
   		frm.submit();
	}
	else {
	alert(_errMessages.ERR_NOFORM);
	return false;
	}
}
function searchBatch()
{
	    var frm = document.getElementById("frmBatchMain");
	    	  
	    if ('7' != document.getElementById("searchKey").value)
		   {
			    if ('0' == document.getElementById("searchKey").value)
				{
					if (null != document.getElementById("toCreateDate"))
					{
						document.getElementById("toCreateDate").value = '';
					}
					if (null != document.getElementById("fromCreateDate"))
					{
						document.getElementById("fromCreateDate").value = '';
					}
				}	
			    document.getElementById("simpleDate").value = document.getElementById("searchKey").value;
			    document.getElementById("status").value = document.getElementById("cboStatus").value;
			    createJSONFromAdvFilterValues('advancedFilterPopupAchMonitorBatch');
			    frm.action = "achMonitorBatchFilter.form"; 
			    frm.target ="";
			    frm.method = "POST";    
			    frm.submit();
		   }
	   else
		   {
			   handleDateChange(document.getElementById("searchKey").value);
			   document.getElementById("startDate").hidden=false;
			   document.getElementById("endDate").hidden=false;
			   document.getElementById("goBtn").hidden=false;
		   }
}

function searchAchMonitorFileOnGoBtn()
{
	   var frm = document.getElementById("frmBatchMain");
	    if ('0' == document.getElementById("searchKey").value)
		{
			if (null != document.getElementById("toCreateDate"))
			{
				document.getElementById("toCreateDate").value = '';
			}
			if (null != document.getElementById("fromCreateDate"))
			{
				document.getElementById("fromCreateDate").value = '';
			}
		}	
	    document.getElementById("simpleDate").value = document.getElementById("searchKey").value;
	    document.getElementById("status").value = document.getElementById("cboStatus").value;
	    createJSONFromAdvFilterValues('advancedFilterPopupAchMonitorBatch');
	    frm.action = "achMonitorBatchFilter.form"; 
	    frm.target ="";
	    frm.method = "POST";    
	    frm.submit();
	    	
}

function setSimpleFilterFromJSON(jsonString) {
	var json = JSON.parse(jsonString);
	if(undefined != json.achFileStart)
    {
	var startDate = $.datepicker.parseDate("yy-mm-dd", json.achFileStart);
    }
	if(undefined != json.achFileEnd){
	var endDate = $.datepicker.parseDate("yy-mm-dd", json.achFileEnd);	
	}
	if(undefined != startDate){
	var formattedStartDate = $.datepicker.formatDate(defaultDateFormat, startDate);
	}
	if( undefined != endDate){
	var formattedEndDate = $.datepicker.formatDate(defaultDateFormat, endDate);
	}		
	if(json.simpleDate==undefined)
	{
	$("#searchKey").val("0");
	}
	else
	{
		$("#searchKey").val(json.simpleDate);
		$("#startDate").datepicker('setDate',formattedStartDate);
		$("#endDate").datepicker('setDate',formattedEndDate);
	}
	$("#cboStatus").val(json.status);
	
}
function changeSimpleDateFlag() {
	$("#simpleDateFlag").val('Y');
}
function getAchMonitorBatchAdvancedFilterPopup(strUrl,frmId) {
	
	var quickStatus =  document.getElementById("cboStatus").value;
	resetForm(frmId);
	document.getElementById("status").value = quickStatus ;
	document.getElementById("cboStatus").value = quickStatus ;
	if('{}' != document.getElementById('filterData').value)
	{
		setAdvFilterValuesFromJSON('advancedFilterPopup',document.getElementById('filterData').value);
		setSimpleFilterFromJSON(document.getElementById('filterData').value);
	}
	if('7' != document.getElementById("searchKey").value)
	{
		 document.getElementById("startDate").hidden=true;
		 document.getElementById("endDate").hidden=true;
		 document.getElementById("goBtn").hidden=true;
	}
	
	/*var buttonsOpts = {};
	
	buttonsOpts[btnsArray['filterContinueBtn']] = function() {
		if ("Y" == $("#simpleDateFlag").val())
		{
			$("#searchKey").val('7');
			$("#simpleDate").val('7');
		}
		createJSONFromAdvFilterValues('advancedFilterPopupAchMonitorBatch');
		
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
		createJSONFromAdvFilterValues('advancedFilterPopupAchMonitorBatch');
		
		$(this).dialog("close");
		$(this).hide();
	    goToPage('achMonitorBatchSaveAndFilter.form', frmId);
	};
	
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		resetForm('advancedFilterPopupAchMonitorBatch');
		resetOrderByComboValues();
		if('{}' != document.getElementById('filterData').value)
		{
			setAdvFilterValuesFromJSON('advancedFilterPopupAchMonitorBatch',document.getElementById('filterData').value);
			setSimpleFilterFromJSON(document.getElementById('filterData').value);
		}
		$(this).dialog("close");
	};*/
	$('#advancedFilterPopupAchMonitorBatch').dialog({
				autoOpen : false,
				minHeight : 156,
				maxHeight : 550,
				width : 735,
				resizable : false,
				draggable : false,
				overflow : 'auto',
				modal : true,
				/*buttons : [
				           {
				        	   id: 'filterContinueBtn',
				        	   text: btnsArray['filterContinueBtn'],
				        	   click: function(){
				        		   if ("Y" == $("#simpleDateFlag").val())
				        			{
				        				$("#searchKey").val('7');
				        				$("#simpleDate").val('7');
				        			}
				        			createJSONFromAdvFilterValues('advancedFilterPopupAchMonitorBatch');
				        			
				        			$(this).dialog("close");
				        			$(this).hide();
				        		    goToPage(strUrl, frmId);
				        	   }
				           },
				           {
				        	   id: 'saveFilterBtn',
				        	   text: btnsArray['saveFilterBtn'],
				        	   click: function(){
				        		   if ("Y" == $("#simpleDateFlag").val())
				        			{
				        				$("#searchKey").val('7');
				        				$("#simpleDate").val('7');
				        			}
				        			createJSONFromAdvFilterValues('advancedFilterPopupAchMonitorBatch');
				        			
				        			$(this).dialog("close");
				        			$(this).hide();
				        		    goToPage('achMonitorBatchSaveAndFilter.form', frmId);
				        	   }
				           },
				           {
				        	   id: 'cancelBtn',
				        	   text:btnsArray['cancelBtn'],
				        	   click: function(){
				        		   resetForm('advancedFilterPopupAchMonitorBatch');
				        			resetOrderByComboValues();
				        			if('{}' != document.getElementById('filterData').value)
				        			{
				        				setAdvFilterValuesFromJSON('advancedFilterPopupAchMonitorBatch',document.getElementById('filterData').value);
				        				setSimpleFilterFromJSON(document.getElementById('filterData').value);
				        			}
				        			$(this).dialog("close");
				        	   }
				           }
				],*/
				open: function(){
					/*$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset').css('float','none');
					$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset').css('margin-left','260px');
					$('#filterContinueBtn span').prepend('<span><i class="fa fa-filter ux_icon-padding"></i></span>');
					$('#saveFilterBtn span').prepend('<span><i class="fa fa-save ux_icon-padding"></i></span>');
					$('#cancelBtn span').prepend('<span><i class="fa fa-minus-circle ux_icon-padding"></i></span>');*/
				}
			});
	$('#advancedFilterPopupAchMonitorBatch').dialog("open");	
	$('#advancedFilterPopupAchMonitorBatch').dialog('option', 'position', 'center');
}

function cancelBatchPopup(){
	resetForm('advancedFilterPopupAchMonitorBatch');
	resetOrderByComboValues();
	if('{}' != document.getElementById('filterData').value)
	{
		setAdvFilterValuesFromJSON('advancedFilterPopupAchMonitorBatch',document.getElementById('filterData').value);
		setSimpleFilterFromJSON(document.getElementById('filterData').value);
	}
	$('#advancedFilterPopupAchMonitorBatch').dialog("close");
}	

function saveAndFilterBatchPopup(){
	if ("Y" == $("#simpleDateFlag").val())
	{
		$("#searchKey").val('7');
		$("#simpleDate").val('7');
	}
	createJSONFromAdvFilterValues('advancedFilterPopupAchMonitorBatch');
	
	$('#advancedFilterPopupAchMonitorBatch').dialog("close");
	$('#advancedFilterPopupAchMonitorBatch').hide();
    goToPage('achMonitorBatchSaveAndFilter.form', "frmBatchMain");
}

function filterBatchPopup(){
	if ("Y" == $("#simpleDateFlag").val())
	{
		$("#searchKey").val('7');
		$("#simpleDate").val('7');
	}
	createJSONFromAdvFilterValues('advancedFilterPopupAchMonitorBatch');
	
	$('#advancedFilterPopupAchMonitorBatch').dialog("close");
	$('#advancedFilterPopupAchMonitorBatch').hide();
    goToPage("achMonitorBatchFilter.form", "frmBatchMain");
}

function showFileBatchSummary(strUrl, frmId, rowIndex) {	
	document.getElementById("selectedIndex").value = rowIndex;
	goToPage(strUrl, frmId);
}
function changeBatchTransactionSort(sortCol, sortOrd,colId) {
	
	var frm = document.getElementById('frmMain');
	document.getElementById("selectedIndex").value = 1;
	if (!frm) {
		alert(_errMessages.ERR_NOFORM);
		return false;
	}
	if (!isEmpty(sortCol)) 
	{
		document.getElementById("txtSortColName").value=sortCol;
		document.getElementById("txtSortOrder").value= sortOrd;
		document.getElementById("txtSortColId").value=colId;
		frm.action = 'sortViewAchMonitorBatchTransaction.form';
   		frm.target = "";
   		frm.method = "POST";
   		frm.submit();
	}
	else {
	alert(_errMessages.ERR_NOFORM);
	return false;
	}
}
function handleDateChange(index) {
	var me = this;
	var objDateParams = me.getDateParam(index, null);
	
	var fromDate = $("#startDate");
	var toDate = $("#endDate");

	if (fromDate && objDateParams.fieldValue1)
		fromDate.datepicker('setDate',objDateParams.fieldValue1);
	if (toDate && objDateParams.fieldValue2)
		toDate.datepicker('setDate',objDateParams.fieldValue2);

	if (index == '7') {
		var dtEntryDate = $.datepicker.parseDate(defaultDateFormat, dtApplicationDate);
		document.getElementById("startDate").hidden=false;
		document.getElementById("endDate").hidden=false;
		document.getElementById("goBtn").hidden=false;		
		
	} 
	
}
function getDateParam(index, dateType) {
	var me = this;
	var strAppDate = dtApplicationDate;
	var dtFormat = strExtApplicationDateFormat;
	
	var date = $.datepicker.parseDate(defaultDateFormat, strAppDate);		   
	var formattedDate = $.datepicker.formatDate("yy-mm-dd",date);
	var strSqlDateFormat = defaultDateFormat;
	var fieldValue1 = '', fieldValue2 = '', operator = '';
	var retObj = {};
	var dtJson = {};
	switch (index) {		
		case '7' :
			// Date Range
			var frmDate, toDate;
			 
			frmDate = null;
			toDate = null;
			
			frmDate = frmDate || date;
			toDate = toDate || frmDate;

			fieldValue1 = $.datepicker.formatDate(strSqlDateFormat,frmDate);
			fieldValue2 = $.datepicker.formatDate(strSqlDateFormat,toDate);
			operator = 'bt';
			break;
		
	}
	retObj.fieldValue1 = fieldValue1;
	retObj.fieldValue2 = fieldValue2;
	retObj.operator = operator;
	return retObj;
}
function clearPopup()
{
	$("#companyId").val("");
	$("#companyName").val("");
	$("#filterCode").val("");
	$("#batchType").val("");
	$("#transactionType").val("");
	$("#fromEffectiveDate").val("");
	$("#toEffectiveDate").val("");
	$("#fromProcessDate").val("");
	$("#toProcessDate").val("");
	$("#fromCreateDate").val("");
	$("#toCreateDate").val("");
	$("#totalCreditAmount").val("");
	$("#totalDebitAmount").val("");
	$("#transitFileName").val("");
	$("#onUsFileName").val("");
	$("#sendingAccount").val("");
	$("#batchId").val("");
	$("#originatingFI").val("");
	$("#customerName").val("");
	$("#hostConfirmation").val("");
	$("#rejectReason").val("");
	$("#orderByFirst").val("");
	$("#orderBySecond").val("");
	$("#orderByThird").val("");
	$("#orderByFourth").val("");
	$("#recordKeyNo").val("");
	$("#status").val("");	
	
}
function clearFilePopup()
{
	$("#filterCode").val("");
	$("#recordKeyNo").val("");
	$("#originatingFI").val("");
	$("#passThroughFlag").val("");
	$("#fileName").val("");
	$("#achFileStart").val("");
	$("#achFileEnd").val("");
	$("#totalCreditAmt").val("");
	$("#totalDebitAmt").val("");
	$("#creditCount").val("");
	$("#debitCount").val("");
	$("#batchCount").val("");
	$("#companiesCount").val("");
	$("#orderByFirst").val("");
	$("#orderBySecond").val("");
	$("#orderByThird").val("");
	$("#status").val("");
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
		var strUrl = 'userfilters/'+filterScreenCode+'/'+objFilterName+'/remove.srvc?'+ csrfTokenName + '=' + csrfTokenValue;
		$.ajax({
					url : strUrl,
					type: 'POST',
					success : function(response) {
						
					}
				});
	}
}