selectedCheckBox = new Array();
allAccountNumberArray = new Array();
selectedAccountNumberArray = new Array();
function goToPage(strUrl, frmId) {
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function switchTab(strUrl, frmId, accountNo, txnCategoryId,fromDate ) {
	document.getElementById("txtAccountNumber").value=accountNo;
	document.getElementById("txtTxnCategoryId").value=txnCategoryId;
	document.getElementById("txtFromDate").value=fromDate;
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function retrieveAccountFilterValues(data){
	for (key in data.FILTER_DATA) {
	     switch (key) {
		    case 'filterCode':
		            break;
	        case 'filterName':
	            document.getElementById('filterName').value = '';
	            break;
	        case 'txnCategory':
	            document.getElementById('txnCategory').value = data.FILTER_DATA[key];
	            break;
	        case 'accountName':
	            document.getElementById('accountName').value = data.FILTER_DATA[key];
	            break;
	        case 'accountNmbr':
	            document.getElementById('accountNumber').value = data.FILTER_DATA[key];
	            break;
	        case 'fromDate':
	        	var vDate = data.FILTER_DATA[key];		   
	      	    var vFromDate = $.datepicker.parseDate("yy-mm-dd", vDate);		   
	     		var vFromDate = $.datepicker.formatDate(defaultDateFormat, vFromDate);	
	            document.getElementById('fromDate').value = vFromDate;
	            break;
	        case 'creditCountFilterOption':
	            document.getElementById('creditCountFilterOption').value = data.FILTER_DATA[key];
	            break;
	            
	        case 'creditsFilterOption':
	            document.getElementById('creditsFilterOption').value = data.FILTER_DATA[key];
	            break;
	        case 'debitCountFilterOption':
	            document.getElementById('debitCountFilterOption').value = data.FILTER_DATA[key];
	            break;
	        case 'debitsFilterOption':
	            document.getElementById('debitsFilterOption').value = data.FILTER_DATA[key];
	            break;
	        
	        case 'floatFilterOption':
	            document.getElementById('floatFilterOption').value = data.FILTER_DATA[key];
	            break;
	            
	            
	        case 'creditCount':
	            document.getElementById('creditCount').value = data.FILTER_DATA[key];
	            break;
	            
	        case 'credits':
	            document.getElementById('credits').value = data.FILTER_DATA[key];
	            break;
	        case 'debitCount':
	            document.getElementById('debitCount').value = data.FILTER_DATA[key];
	            break;
	        case 'debits':
	            document.getElementById('debits').value = data.FILTER_DATA[key];
	            break;
	        
	        case 'float':
	            document.getElementById('floatValue').value = data.FILTER_DATA[key];
	            break;
	     }
	}
}
function resetForm(frmId){
	$("#"+frmId).find(':input').each(function() {
        switch(this.type) {
            case 'password':
            case 'select-multiple':
            case 'select-one':
            case 'text':
            case 'textarea':
                $(this).val('');
                break;
            case 'checkbox':
            case 'radio':
                this.checked = false;
        }
    });	
}
function getFilterData(ctrl, strURL, screenId) {
	var key = ctrl.options[ctrl.selectedIndex].value;
	if(ctrl.options[ctrl.selectedIndex].value == ""){
		resetForm('filterForm');
	} else {
		var strData = {};
		strData['recKeyNo'] = key;
		strData["screenId"] = screenId;
		strData[csrfTokenName] = csrfTokenValue;	
		$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
		$.ajax({
		        type: 'POST',	
		        data:strData,
		        url: strURL,     
		        success: function(data)
		        {
		           if (data!=null) 
				   { 
		        	  if(screenId != null && screenId != '' && screenId != undefined){
		        	  		resetForm('filterForm');
		        	  		 ctrl.value = key;
				   			if(screenId == 'Cash Pos Acct Center'){
				   				retrieveAccountFilterValues(data);
				   			}else if (screenId == 'CP_Txn_Category'){
		        	      		valuesRetrieved(data);
		        	      	}else if (screenId == 'CP_Transaction'){
		        	      		retrieveTransactionFilterValues(data,key);
		        	      	}
				   		}
				   }       	
		        }
		});
	}
}
function valuesRetrieved(data) {
	 for (key in data.FILTER_DATA) {
	     switch (key) {
	     case 'filterCode':
	            break;
       case 'filterName':
           document.getElementById('filterName').value = '';
           break;
       case 'txnCategory':
           document.getElementById('txnCategory').value = data.FILTER_DATA[key];
           break;
       case 'fromDate':
    	   var vDate = data.FILTER_DATA[key];		   
     	   var vFromDate = $.datepicker.parseDate("yy-mm-dd", vDate);		   
    	   var vFromDate = $.datepicker.formatDate(defaultDateFormat, vFromDate);	
           document.getElementById('fromDate').value = vFromDate;           
           break;
       case 'creditCountFilterOption':
           document.getElementById('creditCountFilterOption').value = data.FILTER_DATA[key];
           break;
       case 'creditCount':
       	document.getElementById('creditCount').value = data.FILTER_DATA[key];
           break;
       case 'creditsFilterOption':
           document.getElementById('creditsFilterOption').value = data.FILTER_DATA[key];
           break;
       case 'credits':
       	 document.getElementById('credits').value = data.FILTER_DATA[key];
           break;
       case 'debitCountFilterOption':
           document.getElementById('debitCountFilterOption').value = data.FILTER_DATA[key];
           break;
       case 'debitCount':
           document.getElementById('debitCount').value = data.FILTER_DATA[key];
           break;
       case 'debitsFilterOption':
           document.getElementById('debitsFilterOption').value = data.FILTER_DATA[key];
           break;
       case 'debits':
           document.getElementById('debits').value = data.FILTER_DATA[key];
           break;
       case 'floatFilterOption':
           document.getElementById('floatFilterOption').value = data.FILTER_DATA[key];
           break;
       case 'floatValue':
           document.getElementById('floatValue').value = data.FILTER_DATA[key];
           break;
       case 'accounts' :
    	   {
    	   var accArray = data.FILTER_DATA[key];
	    	   for(var i = 0, j=0; i < allAccountNumberArray.length, j<accArray.length; i++, j++)
	    		{
	    		   if(accArray[j] == allAccountNumberArray[i])
	    				 $("input[type=checkbox][id=" + allAccountNumberArray[i] + "]").prop("checked",true);
	    		}
    	   }
    	   break;
	     }
	}
}

function getAdvancedFilterPopup(strUrl, frmId, saveFilterUrl) {
	var buttonsOpts = {};	
	buttonsOpts[btnsArray['filterBtn']] = function() {
		$(this).dialog("close");
		goToPage(strUrl, frmId);
	};
	buttonsOpts[btnsArray['saveFilterBtn']] = function() {
		$(this).dialog("close");
		goToPage(saveFilterUrl, frmId);
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		resetCashPositionAccountAdvFilter(frmId);		
		$(this).dialog("close");
	};
	$('#advancedFilterPopup').dialog({
				autoOpen : false,
				height : 500,
				width : 512,
				modal : true,
				buttons : buttonsOpts
				//open : preHandleDatePlaceHolder,
			});
	$('#advancedFilterPopup').dialog("open");
}

function showHideErrorDiv(){
	$("#errorDiv").hide();		
}

function getTransactionDetailAdvFilterPopup(strUrl, frmId,saveFilterUrl) {
	var buttonsOpts = {};
	buttonsOpts[btnsArray['filterBtn']] = function() {	
		$(this).dialog("close");
		goToPage(strUrl, frmId);
	};
		buttonsOpts[btnsArray['saveFilterBtn']] = function() {		
		$(this).dialog("close");
		goToPage(saveFilterUrl, frmId);
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		resetCashPositionTransactionAdvFilter(frmId);
		$("#errorDiv").hide();		
		$(this).dialog("close");
	};
	$('#advancedFilterPopup').dialog({
				autoOpen : false,
				height : 450,
				width : 480,
				modal : true,
				buttons : buttonsOpts
				//open : preHandleDatePlaceHolder,
				//close : postHandleDatePlaceHolder
			});
	$('#advancedFilterPopup').dialog("open");
}


function getTxnCatagoryAdvancedFilterPopup(strUrl, frmId) {
	var buttonsOpts = {};
	buttonsOpts[btnsArray['filterBtn']] = function() {
		rowSelect(frmId);
		document.getElementById("accountsList").value=selectedCheckBox;
		$(this).dialog("close");		
		goToPage(strUrl, frmId);
	};
	buttonsOpts[btnsArray['saveFilterBtn']] = function() {
		rowSelect(frmId);
		document.getElementById("accountsList").value=selectedCheckBox;
		$(this).dialog("close");
		goToPage('cashPositionSaveAndFilter.form', frmId);
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		resetCashPositionCatagoryAdvFilter('filterForm', selectedAccountNumberArray, allAccountNumberArray);
		$(this).dialog("close");
	};
	$('#advancedFilterPopup').dialog({
				autoOpen : false,				
				width : 620,
				modal : true,
				buttons : buttonsOpts,				
				bgiframe:true, 
				height: 460,
				open: function(event, ui)
				{
					$("ul.tabs li").removeClass("active"); // Remove any "active" class
					$("ul.tabs li:first-child").addClass("active"); //Make first tab active
					$(".tab_content").hide(); // Hide all tab content		
					$(".tab_content:first").show();// Show first tab content
				    var activeTab = $(this).find("a").attr("href"); // Find the href attribute value to identify the active tab + content
				    $(activeTab).fadeIn(); // Fade in the active ID content
					return false;
				}
				//open : preHandleDatePlaceHolder,
			});
			//alert("teste")
	$('#advancedFilterPopup').dialog("open");
}


datePlaceHolder = function() {
	var id = $(this).attr('id');
	var value = $(this).val();
	if (id === 'toDate') {
		if (value == '')
			$(this).val('To Date');
	}
	if (id === 'fromDate') {
		if (value == '')
			$(this).val('From Date');
	}
};

preHandleDatePlaceHolder = function() {
	if ($("#toDate").val() === '')
		$("#toDate").val('To Date')
	if ($("#fromDate").val() === '')
		$("#fromDate").val('From Date')
}

postHandleDatePlaceHolder = function() {
	if ($("#toDate").val() === 'To Date')
		$("#toDate").val('');
	if ($("#fromDate").val() === 'From Date')
		$("#fromDate").val('');
}

function onChangeOfAccount(id)
{
	var accountId =$("#"+id).val();
	$("#accountName").val(accountId);
	$("#accountNumber").val(accountId);
}


function onChangeOfSimpleFilterAccount(id)
{
	var accountId =$("#"+id).val();
	$("#accountNumFilter").val(accountId);
	$("#accountNameFilter").val(accountId);
}

function changeCurrency(strUrl, frmId) {
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function checkUncheck(field,headerCheckbox)
{
	selectedCheckBox.splice(0, selectedCheckBox.length);		
	if(headerCheckbox.checked==true && field.length >0)
	{
		for (i = 0; i < field.length; i++)
		{
			field[i].checked = true ;
			selectedCheckBox[selectedCheckBox.length]=field[i].getAttribute("id");			
		}
	}
	else if(field.length >0)
	{
		for (i = 0; i < field.length; i++)
		{
			field[i].checked = false ;
		}
		selectedCheckBox.splice(0, selectedCheckBox.length);		
	}
	else if(headerCheckbox.checked==true)
	{
	        field.checked = true ;
	        selectedCheckBox[selectedCheckBox.length]=field.getAttribute("id");			
	}
	else
	{
	    field.checked = false ;
		selectedCheckBox.splice(0, selectedCheckBox.length);	
	}
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

function rowSelect(frmId)
{	
	var accountList = document.forms[frmId].elements['checkList'];
	for(i=0;i<accountList.length;i++){
		if(accountList[i].checked){
			selectedCheckBox[selectedCheckBox.length]  = accountList[i].id;
		}
	}	
}

function retrieveTransactionFilterValues(data,key)
{
	var filterData = data.FILTER_DATA;
	resetForm('filterForm');
	if(filterData)
	{
	    $('#filterName').val('');
	    $('#filterCode').val(key);
	    $('#txnCategory').val(filterData.txnCategory);
	    $('#accountName').val(filterData.accountName);
	    $('#accountNumber').val(filterData.accountNumber);
	    
	    if (filterData.fromDate !== undefined) {
	    	var vDate = filterData.fromDate;		   
	    	var vFromDate = $.datepicker.parseDate("yy-mm-dd", vDate);		   
	    	var vFromDate = $.datepicker.formatDate(defaultDateFormat, vFromDate);                   
	    	$('#fromDate').val(vFromDate);
	    }	
	    
	    $('#creditsFilterOption').val(filterData.creditsFilterOption);
	    $('#transactionAmt').val(filterData.txnAmount);
	    $('#typeCode').val(filterData.typeCode);
	    $('#bankReference').val(filterData.bankReference);
	    $('#customerReference').val(filterData.customerReference);
	}
}
function cashpositionDownload(strUrl)
{
	var frm = document.forms["frmMain"];
	if ($('#btnWithHeader').hasClass('icon-checkbox-checked')) {
		frm.elements["withHeader"].value = "Y";
		
	} else {
		frm.elements["withHeader"].value = "N";
	}
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function showExportPoup(frmId)
{
	var url;
	var buttonsOpts = {};
	buttonsOpts[btnsArray['okBtn']] = function() {
		url = $("#fileFormat").val();
		if ('' == url)
		{
			$("#exportErrorDiv").show();
		}
		else
		{
			$(this).dialog("close");
			console.log(url);
			cashpositionDownload(url);
		}
		
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		$("#fileFormat").val("");
		if ($("#btnWithHeader").hasClass("icon-checkbox-unchecked"))
		{
			$("#btnWithHeader").toggleClass("icon-checkbox-checked icon-checkbox-unchecked");
			$("#btnWithHeader").trigger('show');
		}
		$(this).dialog("close");
	};
	$("#fileFormat").val("");
	if ($("#btnWithHeader").hasClass("icon-checkbox-unchecked"))
		{
			$("#btnWithHeader").toggleClass("icon-checkbox-checked icon-checkbox-unchecked");
			$("#btnWithHeader").trigger('show');
		}
	$("#withHeader").val("Y");
	$("#exportErrorDiv").hide();
	$('#cpExportPopup').dialog({
				autoOpen : false,
				height : 240,
				width : 410,
				modal : true,
				buttons : buttonsOpts
			});
	$('#cpExportPopup').dialog("open");
}