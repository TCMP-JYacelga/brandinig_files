selectedCheckBox = new Array();
function goToPage(strUrl, frmId) {
	var frm = document.getElementById(frmId);
	$('.disabled').removeAttr("disabled");
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function uploadFile(strUrl) {
	var frm = document.forms["frmMain"];
	//$('#frmMain').attr((this.encoding ? 'encoding' : 'enctype') , 'multipart/form-data');
	//$('.disabled').removeAttr("disabled");
	var fileType = $('#file');
	var bankReport = $('#uploadBankReport');
	var formMain = $('#frmMain');
	if( strUrl === '' )
	{
		strUrl = "uploadBankReportFile.form";
	}
	fileType.appendTo(formMain);
	bankReport.appendTo(formMain);
	//frm.setAttribute("Content-Type", 'multipart/form-data');
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	return false;
}
function fetchUnmatchedDistributionIds(fileName,serviceId)
{
	var strData = {};
	var strUrl = 'bankReportUnmatchedIDGridList.srvc';
	strData[ '$fileName' ] = fileName;
	strData[ '$serviceId'] = serviceId;
	strData[ csrfTokenName ] = csrfTokenValue;
 
	$.ajax(
	{
		cache : false,
		data : strData,
		dataType : 'json',
		success : function( response )
		{
			loadDistributionIdList( response.filter );
		},
		error : ajaxError,
		url : strUrl,
		type : 'POST'
	} );

}
function ajaxError()
{
	alert( "AJAX error, please contact admin!" );
}
function loadDistributionIdList( distributionIdList )
{
	var field = $( '#distributionIdtxtArea' );
	
	if(distributionIdList.length > 0)
	{
		$('#distributionIdDiv').removeClass('hidden');
		for( var i = 0 ; i < distributionIdList.length ; i++ )
		{
			if(i == 0)
				field.val( distributionIdList[i].filterCode)
			else	
				field.val( field.val() + "\n" + distributionIdList[i].filterCode);
		}
	}
}
function getBankReportViewPopup(index){
//	var buttonsOpts = {};
//	buttonsOpts[btnsArray['closeBtn']] = function() {
//		$(this).dialog("close");
//	};
	
	var strJson = document.getElementById("TEXTJSON"+index).value;
	var obj = JSON.parse(strJson);
	var field = $( '#distributionIdtxtArea' );
	field.val('');
	$('#distributionIdDiv').addClass('hidden');
	if(obj && obj.fileName)
	{
		fetchUnmatchedDistributionIds(obj.fileName,obj.serviceId)
	}
	$('#reportname').text(obj.bankReportName);
	$('#reportname').prop('title',obj.bankReportName);
	
	$('#currentstatus').text(obj.status);
	$('#currentstatus').prop('title',obj.status);
	
	$('#filename').text(obj.fileName);
	$('#filename').prop('title',obj.fileName);
	
	if ('A' == obj.distributionMethod)
	{
		$('#distributionmethod').text(txtDistA);
		$('#distributionmethod').prop('title',txtDistA);
		$('#msgDiv').hide();
	}
	else if ('G' == obj.distributionMethod)
	{
		$('#distributionmethod').text(txtDistG);
		$('#distributionmethod').prop('title',txtDistG);
		$('#msgDiv').hide();
	}
	else if ('F' == obj.distributionMethod)
	{
		$('#distributionmethod').text(txtDistF);
		$('#distributionmethod').prop('title',txtDistF);
		$('#msgDiv').show();
	}
	
	$('#numberIdentifiersReported').text(obj.idReported);
	$('#numberIdentifiersUpdated').text(obj.idUpdated);
	$('#numberIdentifiersUnmatched').text(obj.idUnmatched);
	$('#endDateTime').text(obj.endDateTime);
	$('#fileDateTime').text(obj.fileDateTime);
	$('#startDateTime').text(obj.startDateTime);
	$('#messages').text(obj.status);
	
	$('#numberIdentifiersReported').prop('title',obj.idReported);
	$('#numberIdentifiersUpdated').prop('title',obj.idUpdated);
	$('#numberIdentifiersUnmatched').prop('title',obj.idUnmatched);
	$('#endDateTime').prop('title',obj.endDateTime);
	$('#fileDateTime').prop('title',obj.fileDateTime);
	$('#startDateTime').prop('title',obj.startDateTime);
	$('#messages').prop('title',obj.status);
	
$('#bankReportViewPopup').dialog({
			autoOpen : false,
			maxHeight: 550,
			minHeight:156,
			width : 735,
			modal : true,
			resizable: false,
			draggable: false
			//buttons : buttonsOpts
		});
$('#bankReportViewPopup').dialog("open");
	
	$('#closeBtn').bind('click',function(){
		$('#bankReportViewPopup').dialog("close");
	});

$('#filenameDiv').focus();
}
		
function getBankReportHistoryPopUp(frmId, rowIndex) {
	
			
			var frm = document.getElementById(frmId);
			document.getElementById("selectedIndex").value = rowIndex;
			frm.action = "bankReporting.hist";
			frm.target = "hWinSeek";
			frm.method = "POST";
			var strAttr;
			var intTop  = (screen.availHeight - 350)/2;
			var intLeft = (screen.availWidth - 785)/2;
			strAttr = "dependent=yes,scrollbars=no,resizable=no,";
			strAttr = strAttr + "left=" + intLeft + ",";
			strAttr = strAttr + "top=" + intTop + ",";
			strAttr = strAttr + "width=600,height=375";
			var winPopup = window.open ("", "hWinSeek", strAttr);
			winPopup.focus();
			frm.submit();
			frm.target = "";
}

function checkUncheckBankReport(checkList, checkBox) {
	selectedCheckBox.splice(0, selectedCheckBox.length);
	if (checkBox.checked == true && checkList.length > 0) {
		for (i = 0; i < checkList.length; i++) {
			checkList[i].checked = true;
			selectedCheckBox[selectedCheckBox.length] = checkList[i]
					.getAttribute("id");
		}
	} else if (checkList.length > 0) {
		for (i = 0; i < checkList.length; i++) {
			checkList[i].checked = false;
		}
		selectedCheckBox.splice(0, selectedCheckBox.length);
	} else if (checkBox.checked == true) {
		checkList.checked = true;
		selectedCheckBox[selectedCheckBox.length] = checkList.getAttribute("id");
	} else {
		checkList.checked = false;
		selectedCheckBox.splice(0, selectedCheckBox.length);
	}
//	enableDisableBackoutLink();
//	enableDisableReloadLink();
}

function enableDisableBackoutLink() {
	var backOutValue;
	if (selectedCheckBox.length > 0) {
		var objstr = document.getElementById("TEXTJSON" + selectedCheckBox[0]).value;
		var obj = eval("(" + objstr + ")");
		if ('PARTIAL' == obj.status || 'UPDATED' == obj.status)
		{
			backOutValue = true;
		}
		else
		{
			backOutValue = false;
		}
		
	}
	for ( var i = 1; i < selectedCheckBox.length; i++) {
		var objstr = document.getElementById("TEXTJSON" + selectedCheckBox[i]).value;
		var obj = eval("(" + objstr + ")");
		if ('PARTIAL' == obj.status || 'UPDATED' == obj.status)
		{
			backOutValue = backOutValue && true;
		}
		else
		{
			backOutValue = backOutValue && false;
		}
		
	}
	if (String(backOutValue) == 'true' && CAN_EDIT=='true') {
		$('#btnBankRepBackout').unbind('click');
		ToggleAttribute("btnBankRepBackout", true, "href");
		$('#btnBankRepBackout').click(function() {
			actionSubmit('bankRepFileBackout.form','frmMain');
		});
	} else {
		ToggleAttribute("btnBankRepBackout", false, "href");
		$('#btnBankRepBackout').removeAttr('onclick').click(function() {
		});
		$('#btnBankRepBackout').unbind('click');
	}

}

function enableDisableReloadLink() {
	var reloadValue;
	if (selectedCheckBox.length > 0) {
		var objstr = document.getElementById("TEXTJSON" + selectedCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		if ('BACKED_OUT' == obj.status)
		{
			reloadValue = true;
		}
		else
		{
			reloadValue = false;
		}
	}

	for (var i = 1; i < selectedCheckBox.length; i++) {
		var objstr = document.getElementById("TEXTJSON" + selectedCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		if ('BACKED_OUT' == obj.status)
		{
			reloadValue = reloadValue && true;
		}
		else
		{
			reloadValue = reloadValue && false;
		}
	}
	if (String(reloadValue) == 'true'  && CAN_EDIT=='true') {
		$('#btnBankRepReload').unbind('click');
		ToggleAttribute("btnBankRepReload", true, "href");
		$('#btnBankRepReload').click(function() {
			actionSubmit('bankRepFileReload.form','frmMain');
		});
	} else {
		ToggleAttribute("btnBankRepReload", false, "href");
		$('#btnBankRepReload').removeAttr('onclick').click(function() {
		});
		$('#btnBankRepReload').unbind('click');
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

function rowSelect(checkBoxId, status, index) {
	var index;
	
	if ((index = selectedExists(checkBoxId.getAttribute("id"))) != -1) {
		if (checkBoxId.checked == true) {
			selectedCheckBox[selectedCheckBox.length] = checkBoxId
					.getAttribute("id");
			if(selectedCheckBox.length == totalRowCount) {
				$('#headerCheckbox').attr('checked', 'checked');
			}
		} else {
			$('#headerCheckbox').removeAttr("checked");
			selectedCheckBox.splice(index, 1);
		}
	}
	//enableDisableBackoutLink();
	//enableDisableReloadLink();
}

function selectedExists(checkID) {
	for ( var i = 0; i < selectedCheckBox.length; i++) {
		if (selectedCheckBox[i] == checkID) {
			return i;
		}
	}
	return 0;
}

function actionSubmit(strUrl, frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("selectedIndex").value = selectedCheckBox;	
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function changeSort(sortCol, sortOrd, colId) {
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
   		frm.action = 'bankReportingCenter.form';
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
	   if('7' == document.getElementById("searchKey").value){
			handleDateChange(document.getElementById("searchKey").value);
	    }
	    else 
	    {
			var frm = document.getElementById("frmMain");
		    if ('0' == document.getElementById("searchKey").value)
			{
				if (null != document.getElementById("toFileDate"))
				{
					document.getElementById("toFileDate").value = '';
				}
				if (null != document.getElementById("fromFileDate"))
				{
					document.getElementById("fromFileDate").value = '';
				}
			}	
		    document.getElementById("simpleDate").value = document.getElementById("searchKey").value;
		    document.getElementById("status").value = document.getElementById("cboStatus").value;
		    createJSONFromAdvFilterValues('advancedFilterPopupBankReporting');
		    frm.action = "bankReportingFilter.form"; 
		    frm.target ="";
		    frm.method = "POST";    
		    frm.submit();	
	    }	
}

function searchBankReportOnCustomRange()
{
	   var frm = document.getElementById("frmMain");
		document.getElementById("simpleDate").value = document.getElementById("searchKey").value;
	    document.getElementById("status").value = document.getElementById("cboStatus").value;
	    createJSONFromAdvFilterValues('advancedFilterPopupBankReporting');
	    frm.action = "bankReportingFilter.form";
	    frm.target ="";
	    frm.method = "POST";
	    frm.submit();
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
	var strSqlDateFormat = "mm/dd/yy";
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

function getAdvancedFilterPopup(strUrl,frmId) {
	var buttonsOpts = {};
	//$("#firstSortCol,#secondSortCol,#thirdSortCol").change();
	/*buttonsOpts[btnsArray['filterContinueBtn']] = function() {
		if ("Y" == $("#simpleDateFlag").val())
		{
			$("#searchKey").val('7');
			$("#simpleDate").val('7');
		}
		createJSONFromAdvFilterValues('advancedFilterPopupBankReporting');
		
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
		createJSONFromAdvFilterValues('advancedFilterPopupBankReporting');
		
		$(this).dialog("close");
		$(this).hide();
	    goToPage('bankReportingSaveAndApplyFilter.form', frmId);
	};
	
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		resetForm('advancedFilterPopupBankReporting');
		resetComboValue();
		if('{}' != document.getElementById('filterData').value)
		{
			setAdvFilterValuesFromJSON('advancedFilterPopupBankReporting',document.getElementById('filterData').value);
			setSimpleFilterFromJSON(document.getElementById('filterData').value);
		}
		//$("#firstSortCol,#secondSortCol,#thirdSortCol").change();
		$(this).dialog("close");
	};*/
	$('#advancedFilterPopupBankReporting').dialog({
				autoOpen : false,
				minHeight : 156,
				maxHeight : 550,
				width : 735,
				resizable : false,
				draggable : false,
				modal : true,
				/*buttons : [
				           {
				        	   id: 'filterContinueBtn',
				        	   text: labels.filter,
				        	   click: function(){
				        		   if ("Y" == $("#simpleDateFlag").val())
				        			{
				        				$("#searchKey").val('7');
				        				$("#simpleDate").val('7');
				        			}
				        			createJSONFromAdvFilterValues('advancedFilterPopupBankReporting');
				        			
				        			$(this).dialog("close");
				        			$(this).hide();
				        		    goToPage(strUrl, frmId);
				        	   }
				           },
				           {
				        	   id: 'saveFilterBtn',
				        	   text: labels.saveAndFilter,
				        	   click: function(){
				        		   if ("Y" == $("#simpleDateFlag").val())
				        			{
				        				$("#searchKey").val('7');
				        				$("#simpleDate").val('7');
				        			}
				        			createJSONFromAdvFilterValues('advancedFilterPopupBankReporting');
				        			
				        			$(this).dialog("close");
				        			$(this).hide();
				        		    goToPage('bankReportingSaveAndApplyFilter.form', frmId);
				        	   }
				           },
				           {
				        	   id: 'cancelBtn',
				        	   text: labels.cancel,
				        	   click: function(){
				        		   resetForm('advancedFilterPopupBankReporting');
				        			resetComboValue();
				        			if('{}' != document.getElementById('filterData').value)
				        			{
				        				setAdvFilterValuesFromJSON('advancedFilterPopupBankReporting',document.getElementById('filterData').value);
				        				setSimpleFilterFromJSON(document.getElementById('filterData').value);
				        			}
				        			//$("#firstSortCol,#secondSortCol,#thirdSortCol").change();
				        			$(this).dialog("close");
				        	   }
				           }
				],*/
				open: function(){
					/*$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset').css('float','none');
					$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset').css('margin-left','120px');
					$('#filterContinueBtn span').prepend('<span><i class="fa fa-filter ux_icon-padding"></i></span>');
					$('#saveFilterBtn span').prepend('<span><i class="fa fa-save ux_icon-padding"></i></span>');
					$('#cancelBtn span').prepend('<span><i class="fa fa-minus-circle ux_icon-padding"></i></span>');*/
				}
			});
	$('#advancedFilterPopupBankReporting').dialog("open");
	$('#advancedFilterPopupBankReporting').dialog('option', 'position', 'center');

	changeSortIcons("orderByFirst_a", "firstSort");
	changeSortIcons("orderBySecond_a", "secondSort");
	changeSortIcons("orderByThird_a", "thirdSort");
}
function cancelPopup(){
	resetForm('advancedFilterPopupBankReporting');
	resetComboValue();
	if('{}' != document.getElementById('filterData').value)
	{
		setAdvFilterValuesFromJSON('advancedFilterPopupBankReporting',document.getElementById('filterData').value);
		setSimpleFilterFromJSON(document.getElementById('filterData').value);
	}
	$('#advancedFilterPopupBankReporting').dialog("close");
}	

function saveAndFilterPopup(){
	if(isEmpty(	$("#filterCode").val())){
		paintError('#advancedFilterErrorDiv',
					'#advancedFilterErrorMessage', 'Please Enter Filter Name');
		markRequired('#filterCode');
		return;
	}
	if ("Y" == $("#simpleDateFlag").val())
	{
		$("#searchKey").val('7');
		$("#simpleDate").val('7');
	}
	createJSONFromAdvFilterValues('advancedFilterPopupBankReporting');
	
	$('#advancedFilterPopupBankReporting').dialog("close");
	$('#advancedFilterPopupBankReporting').hide();
    goToPage('bankReportingSaveAndApplyFilter.form', 'frmMain');
 }

function filterPopup(){
	if ("Y" == $("#simpleDateFlag").val())
	{
		$("#searchKey").val('7');
		$("#simpleDate").val('7');
	}
	createJSONFromAdvFilterValues('advancedFilterPopupBankReporting');
	
	$('#advancedFilterPopupBankReporting').dialog("close");
	$('#advancedFilterPopupBankReporting').hide();
    goToPage('bankReportingFilter.form', 'frmMain');
}
/*function setSimpleFilterFromJSON(jsonString) {
	var json = JSON.parse(jsonString);
	if(json.simpleDate==undefined)
	{
	$("#searchKey").val("0");
	}
	else
	{
	$("#searchKey").val(json.simpleDate);
	}
	$("#cboStatus").val(json.status);
	
}*/

function setSimpleFilterFromJSON(jsonString) {
	var json = JSON.parse(jsonString);
	if(undefined != json.achFileStart)
    {
	var startDate = $.datepicker.parseDate("yy-mm-dd", json.fromStartDate);
    }
	if(undefined != json.achFileEnd){
	var endDate = $.datepicker.parseDate("yy-mm-dd", json.fromEndDate);	
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
function getFilterData(ctrl) {
	var strData = {};
	var filterId = ctrl.options[ctrl.selectedIndex].value;
	
	if(filterId){
	resetComboValue();
	strData["recKeyNo"] = filterId;
	strData["screenId"] = 'BANK_REPORTING';
	strData[csrfTokenName] = csrfTokenValue;	
	$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
	$.ajax({
	        type: 'POST',	
	        data:strData,
	        url: "bankReporingFilterValues.formx",	       
	        success: function(data)
	        {
	           if (data!=null) 
			   { 	
	        	   populateAdvancedFilterData(data, filterId);							   
			   }       	
	        }
	});
	} else {
		resetForm('advancedFilterPopupBankReporting');
		resetSortIcon();
		changeSortIcons("orderByFirst_a", "firstSort");
		changeSortIcons("orderBySecond_a", "secondSort");
		changeSortIcons("orderByThird_a", "thirdSort");
	}
}

function resetComboValue()
{
	var option = "";
	previous = '';
	$("select[id$='SortCol'] option").remove();
	$("select[id$='SortCol']").append($('<option value="">None</option>'));
	
	for(var i=0 ; i<valueArray.length;i++)
	{
		option = $('<option value="'+valueArray[i].key+'">'+valueArray[i].value+'</option>');
		$("select[id$='SortCol']").append(option);
	}
	
}

function populateAdvancedFilterData(data, filterId) {
	var filterData = data.FILTER_DATA;
	resetForm('advancedFilterPopupBankReporting');
	setAdvFilterValuesFromJSON('advancedFilterPopupBankReporting',JSON.stringify(filterData));
	//$("#filterCode").val('');
	//$("#firstSortCol,#secondSortCol,#thirdSortCol").change();
	changeSortIcons("orderByFirst_a", "firstSort");
	changeSortIcons("orderBySecond_a", "secondSort");
	changeSortIcons("orderByThird_a", "thirdSort");
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

function resetSortIcon(){
	$("#firstSort").val('A');
	$("#secondSort").val('A');
	$("#thirdSort").val('A');
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
function getMsgPopup() {
	$('#bankReportConfirmMsgPopup').dialog( {
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
	$('#bankReportConfirmMsgPopup').dialog('open');
}

function showUploadPopup(fptrCallback)
{
	var strUrl;	
	
	strUrl = "uploadBankReportFile.form";
	
	
	var dlg = $('#uploadInstrumentFile');
	var btnsArr={};		
	//btnsArr[labels.uploadBtn]=function() {$(this).dialog("close"); uploadFile(strUrl);};
	//btnsArr[labels.cancel]=function() {$(this).dialog('close');};
	dlg.dialog({
		bgiframe:true, 
		autoOpen:false, 
		minHeight:156, 
		maxHeight:550, 
		modal:true, 
		resizable:false, 
		draggable:false,
		width:500,
		title : labels.uploadFile
	});
	//Cancel: function() {$(this).dialog('close');}}});
	dlg.dialog('open');
}

function cancelFileUpload(){
	$('#uploadInstrumentFile').dialog('close');
}

function uploadBankReportFile(){
	$('#uploadInstrumentFile').dialog('close');
	uploadFile('uploadBankReportFile.form');
}

function newfileselected () {
	var filename = $('#file').val();
	if(filename) {
		$('#lblSelectedFileName').html(filename.substring(filename.lastIndexOf('\\')+1));
	} else {
		$('#lblSelectedFileName').html(labels.lblNoFileSelected);
	}
	$('#lblSelectedFileName').attr('title', filename); 
}

function chooseFileClicked() {
	$('#file').click();
}
function formatDate(reportDate)
{
	var rptDate,rptTime;
	if (!isEmpty(reportDate)) {
		rptDate = new Date(reportDate);
		rptTime = rptDate.toLocaleTimeString();
		rptDate = rptDate.format(strExtApplicationDateFormat);
		reportDate = rptDate+' '+rptTime;
	}
	return reportDate;
}
function clearPopup(){
	$("#recordKeyNo").val("");
	$("#bankReportName").val("");
	$("#filterCode").val("");
	$("#fileName").val("");
	$("#status").val("");
	$("#distributionMethod").val("");
	$("#fromFileDate").val("");
	$("#toFileDate").val("");
	$("#fromStartDate").val("");
	$("#toStartDate").val("");
	$("#fromEndDate").val("");
	$("#toEndDate").val("");
	$("#firstSortCol").val("");
	$("#secondSortCol").val("");
	$("#thirdSortCol").val("");
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
		var strUrl = 'userfilters/BANK_REPORTING/'+objFilterName+'/remove.srvc?'+ csrfTokenName + '=' + csrfTokenValue;
		$.ajax({
					url : strUrl,
					type: 'POST',
					success : function(response) {
						
					}
				});
	}
}