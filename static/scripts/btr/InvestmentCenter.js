function simpleInvFilter(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "simpleInvFilter.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function getInvHistoryPopUp(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "invHistory.hist";
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

function getAdvancedFilterPopup(strUrl, frmId) {
	var buttonsOpts = {};
	buttonsOpts[btnsArray['filterBtn']] = function() {
		$(this).dialog("close");
		goToPage(strUrl, frmId);
	};
	buttonsOpts[btnsArray['saveFilterBtn']] = function() {
		$(this).dialog("close");
		goToPage('saveAndFilterInvCenter.form', frmId);
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		$('#invAccNmbr').empty().append(
		        $('<option></option>').val("").html('Select'));
		resetInvestmentAdvanceFilterForm('filterForm');
		$(this).dialog("close");
	};
	$('#advancedFilterPopup').dialog({
				autoOpen : false,
				height : 482,
				width : 473,
				modal : true,
				buttons : buttonsOpts
			});
	$('#advancedFilterPopup').dialog("open");
}
function goToPage(strUrl, frmId) {
	var frm = document.getElementById(frmId);
	$('.disabled').removeAttr("disabled");
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

selectedInvestmentCheckBox = new Array(); 						
//This Array Used For Getting Selected Investments

//This Array Used For Getting "can auth" values of Investments
selectedInvestmentAuthArray=new Array();

function checkUncheckInvestment(field,headerCheckbox)
{
		selectedInvestmentCheckBox.splice(0, selectedInvestmentCheckBox.length);
		selectedInvestmentAuthArray.splice(0, selectedInvestmentAuthArray.length);
		
	if(headerCheckbox.checked==true && field.length >0)
	{
		for (i = 0; i < field.length; i++)
		{
			field[i].checked = true ;
			selectedInvestmentCheckBox[selectedInvestmentCheckBox.length]=field[i].getAttribute("id");
			selectedInvestmentAuthArray[selectedInvestmentAuthArray.length]=objAuthData[i+1];
		}
	}
	else if(field.length >0)
	{
		for (i = 0; i < field.length; i++)
		{
			field[i].checked = false ;
		}
		selectedInvestmentCheckBox.splice(0, selectedInvestmentCheckBox.length);
		selectedInvestmentAuthArray.splice(0, selectedInvestmentAuthArray.length);
	}
	else if(headerCheckbox.checked==true)
	{
	        field.checked = true ;
	        selectedInvestmentCheckBox[selectedInvestmentCheckBox.length]=field.getAttribute("id");
	        selectedInvestmentAuthArray[selectedInvestmentAuthArray.length]=objAuthData[1];
	}
	else
	{
	    field.checked = false ;
	    selectedInvestmentCheckBox.splice(0, selectedInvestmentCheckBox.length);
	    selectedInvestmentAuthArray.splice(0, selectedInvestmentAuthArray.length);
	}
	investmentEnableDisableAuthorizeLink();
	investmentEnableDisableSendLink();
	investmentEnableDisableDeleteLink();
	investmentEnableDisableRejectLink();
}

function rowInvestmentSelect(checkBoxId, jsonString, canAuth)
{
	var index;
	if ((index = selectedInvestmentExists(checkBoxId.getAttribute("id"))) != -1)
	{
		if (checkBoxId.checked == true)
		{	
			selectedInvestmentCheckBox[selectedInvestmentCheckBox.length] = checkBoxId.getAttribute("id");
			selectedInvestmentAuthArray[selectedInvestmentAuthArray.length] = canAuth;			
		}
		else
		{
			$('#headerCheckbox').removeAttr("checked");
			selectedInvestmentCheckBox.splice(index, 1);
			selectedInvestmentAuthArray.splice(index, 1);			
		}
	}
	investmentEnableDisableAuthorizeLink();
	investmentEnableDisableSendLink();
	investmentEnableDisableDeleteLink();
	investmentEnableDisableRejectLink();
}

function investmentEnableDisableAuthorizeLink()
{
	var authorizeValue;
	if (selectedInvestmentCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedInvestmentCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		var canAuth = selectedInvestmentAuthArray[0];
		if(canAuth=='false' || canAuth==false)
		{	
		authorizeValue = obj.canAuthorise && false;
		}
		else
		{
			authorizeValue = obj.canAuthorise;
		}
	}
	for ( var i = 1; i < selectedInvestmentCheckBox.length; i++) 
	{
		var objstr = document.getElementById("TEXT" + selectedInvestmentCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');		
		var canAuth = selectedInvestmentAuthArray[i];
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
		InvestmentToggleAttribute("btnAuth", true, "href");
		$('#btnAuth').click(function()
		{
			authorizeInvestment('frmMain');
		});
	}
	else 
	{
		InvestmentToggleAttribute("btnAuth", false, "href");
		$('#btnAuth').removeAttr('onclick').click(function() 
		{
		});
		$('#btnAuth').unbind('click');
	}	
}
function investmentEnableDisableSendLink()
{
	var sendValue;
	if (selectedInvestmentCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedInvestmentCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		sendValue = obj.canSend;
	}
	for ( var i = 1; i < selectedInvestmentCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedInvestmentCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		sendValue = sendValue && obj.canSend;
	}
	if (sendValue == true && (CAN_AUTH == 'true' || CAN_EDIT == 'true'))
	{
		$('#btnSend').unbind('click');
		InvestmentToggleAttribute("btnSend", true, "href");
		$('#btnSend').click(function()
		{
			sendInvestment('frmMain');
		});
	}
	else
	{
		InvestmentToggleAttribute("btnSend", false, "href");
		$('#btnSend').removeAttr('onclick').click(function()
		{});
		$('#btnSend').unbind('click');
	}
	
}
function investmentEnableDisableDeleteLink()
{
	var deleteValue;
	if (selectedInvestmentCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedInvestmentCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		deleteValue = obj.canDelete;
	}
	for ( var i = 1; i < selectedInvestmentCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedInvestmentCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		deleteValue = deleteValue && obj.canDelete;
	}
	if (deleteValue == true && CAN_EDIT == 'true') 
	{
		$('#btnDelete').unbind('click');
		InvestmentToggleAttribute("btnDelete", true, "href");
		$('#btnDelete').click(function()
		{
			deleteInvestment('frmMain');
		});
	} 
	else
	{
		InvestmentToggleAttribute("btnDelete", false, "href");
		$('#btnDelete').removeAttr('onclick').click(function()
		{});
		$('#btnDelete').unbind('click');		
	}	
}
function investmentEnableDisableRejectLink()
{
	var rejectValue;
	if (selectedInvestmentCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedInvestmentCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		var canAuth = selectedInvestmentCheckBox[0];
		if(canAuth=='false' || canAuth==false)
		{	
			rejectValue = obj.canReject && false;
		}
		else
		{
			rejectValue = obj.canReject;
		}
	}
	for ( var i = 1; i < selectedInvestmentCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedInvestmentCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		var canAuth = selectedInvestmentAuthArray[i];
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
		InvestmentToggleAttribute("btnReject", true, "href");
		$('#btnReject').click(function()
		{
			getInvestmentRejectPopup('frmMain');
		});
	} 
	else
	{
		InvestmentToggleAttribute("btnReject", false, "href");
		$('#btnReject').removeAttr('onclick').click(function()
		{});
		$('#btnReject').unbind('click');
	}
	
}

function authorizeInvestment(frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("hiddenInvestmentRef").value = selectedInvestmentCheckBox;
	frm.action = "authorizeInvestment.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function sendInvestment(frmId) 
{	
	frm = document.getElementById(frmId);
	document.getElementById("hiddenInvestmentRef").value = selectedInvestmentCheckBox;
	frm.action = "sendInvestment.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function getInvestmentRejectPopup(frmId) 
{
	$('#rejectPopup').dialog( {
		autoOpen : false,
		height : 240,
		width : 420,
		modal : true,
		buttons : {
			"Ok" : function() 
			{
				rejectInvestment(frmId);
			},
			"Cancel" : function() 
			{
				$(this).dialog("close");
			}
		}
	});
	$('#rejectPopup').dialog("open");
}

function rejectInvestment(frmId) 
{
	frm = document.getElementById(frmId);
	document.getElementById("txtInvestmentRejectReason").value = $('#txtAreaRejectRemark').val();	
	document.getElementById("hiddenInvestmentRef").value = selectedInvestmentCheckBox;
	frm.action = "rejectInvemstment.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function deleteInvestment(frmId) 
{	
	frm = document.getElementById(frmId);
	document.getElementById("hiddenInvestmentRef").value = selectedInvestmentCheckBox;
	frm.action = "deleteInvemstment.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function selectedInvestmentExists(checkID) 
{
	for ( var i = 0; i < selectedInvestmentCheckBox.length; i++) 
	{
		if (selectedInvestmentCheckBox[i] == checkID)
		{
			return i;
   	}
	}
	return 0;
}

function InvestmentToggleAttribute(obj, DoEnable, TagName) 
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

function resetForm(frmId){
	$("#"+frmId).find(':input').each(function() {
        switch(this.type) {
            case 'password':
            case 'select-multiple':
            case 'select-one':            
            case 'textarea':
			case 'textarea':
			case 'text':    
                $(this).val('');
                break;
            case 'checkbox':            
                this.checked = false;
        }
    });	
}

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

function getInvPurchasePopup(strUrl, frmId) 
{
	var buttonsOpts = {};
	buttonsOpts[btnsArray['submitBtn']] = function() {
		$(this).dialog("close");
		start_blocking(blockMsgText,this );
		goToPage(strUrl, frmId);
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		resetForm(frmId);
		$('#lblFundNameNav').text('');
		$("#paymentDebitAccount").get(0).options.length = 1;
		$("#rateType").attr("disabled","disabled");	
		$('#purRateTypeLab').removeClass('required');
		$('#invFundCodeRow').hide();
		$('#invAccountRow').show();				
		$(this).dialog("close");
	};
	$('#investmentPurchasePopup').dialog({
				autoOpen : false,
				height : 340,
				width : 650,
				modal : true,
				buttons : buttonsOpts
			});
	$('#investmentPurchasePopup').dialog("open");
}

function getInvRedeemPopup(strUrl, frmId) 
{
	var buttonsOpts = {};
	buttonsOpts[btnsArray['submitBtn']] = function() {
		$(this).dialog("close");
		start_blocking(blockMsgText,this );
		goToPage(strUrl, frmId);
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		resetForm(frmId);
		$("#paymentCreditAccount").get(0).options.length = 1;
		$("#redeemRateType").attr("disabled","disabled");	
		$('#rateTypeLab').removeClass('required');
		$(this).dialog("close");
	};
	$('#investmentRedemptionPopup').dialog({
				autoOpen : false,
				height : 390,
				width : 630,
				modal : true,
				buttons : buttonsOpts
			});
	$('#investmentRedemptionPopup').dialog("open");
}

function handleEnableDisablePaymentRateType(){
	var combo = document.getElementById('rateType');	
	var purNewOrAcc=$("input[id='purchaseNewOrFromAccount']:checked").val();
	
	if(purNewOrAcc== "New" ){
	        $("#rateType").attr("disabled","disabled");
			$('#purRateTypeLab').removeClass('required');
			combo.selectedIndex = 0;
	} else if((document.getElementById("paymentAmtCurr").value != document.getElementById("debitAmtCurr").value) && (""!=$('#paymentDebitAccount').val())){
			$("#rateType").removeAttr("disabled");
			$('#purRateTypeLab').addClass('required');
				
		} else {
			$("#rateType").attr("disabled","disabled");
			$('#purRateTypeLab').removeClass('required');
			combo.selectedIndex = 0;			
		}
}

function handleEnableDisableRedeemRateType(){
	var combo = document.getElementById('redeemRateType');	
		if((document.getElementById("amtCurr").value != document.getElementById("creditAmtCurr").value) && (""!=$('#paymentCreditAccount').val())){
			$("#redeemRateType").removeAttr("disabled");
			$('#rateTypeLab').addClass('required');
				
		} else {
			$("#redeemRateType").attr("disabled","disabled");
			$('#rateTypeLab').removeClass('required');
			combo.selectedIndex = 0;			
		}
}

function getInvPurAccCurrency()
{
	$('#paymentAmtCurr').val('');
	if(''!=$('#investmentPurAccNmbr').val())
	{		
		var strCurrency = $('#investmentPurAccNmbr option[value='+$('#investmentPurAccNmbr').val()+']').text();
		$('#paymentAmtCurr').val(strCurrency.substring(strCurrency.indexOf('-')+1,(strCurrency.indexOf('-')+4)));
	}
}

function getInvRedAccCurrency()
{
	$('#amtCurr').val('');
	if(''!=$('#investmentRedAccNmbr').val())
	{		
		var strCurrency = $('#investmentRedAccNmbr option[value='+$('#investmentRedAccNmbr').val()+']').text();
		$('#amtCurr').val(strCurrency.substring(strCurrency.indexOf('-')+1,(strCurrency.indexOf('-')+4)));
	}
}

function populateAdvancedFilterData(data, filterId) {
	var filterData = data.FILTER_DATA;
	if (filterData) {
		$("#filterCode").val(filterId);
		$("#reqReference").val(filterData.requestReference);
		$("#fundName").val(filterData.fundName);
		
		if (filterData.fromDate !== undefined) {
			var fromDate = filterData.fromDate;
			var vFromDate = $.datepicker.parseDate("yy-mm-dd", fromDate);		   
			var vFromDate = $.datepicker.formatDate(defaultDateFormat, vFromDate);
			$("#fromDate").val(vFromDate);
		}
		
		if (filterData.toDate !== undefined) {
			var toDate = filterData.toDate;		   
			var vToDate = $.datepicker.parseDate("yy-mm-dd", toDate);		   
			var vToDate = $.datepicker.formatDate(defaultDateFormat, vToDate);
			$("#toDate").val(vToDate);
		}
		
		$("#product").val(filterData.product);
		getProductAccount();
		$("#invAccNmbr").val(filterData.invAccNmbr);
		$("input[type=radio][value=" + filterData.requestType + "]").prop("checked",true);
		$("#amountFilterOption").val(filterData.amountFilterOption);
		$("#requestedAmnt").val(filterData.requestedAmnt);
		$("#statusFilter").val(filterData.stateFilter);
	} else {
		$("#filterCode").val(filterId);

	}
}

function resetAdvanceFilterData(frmId) {
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
            	$("input[type=radio][value=a]").prop("checked",true);
        }
    });	
}

function getFilterData(ctrl, strURL) {
	var filterCodeSelected = ctrl.options[ctrl.selectedIndex].value;
	if(filterCodeSelected == ""){
		resetAdvanceFilterData('filterForm');
	} else {
		
		var strData = {};
		strData['recKeyNo'] = ctrl.options[ctrl.selectedIndex].value;
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
		        		resetAdvanceFilterData('filterForm');
		        		ctrl.value = filterCodeSelected;
		        	  	populateAdvancedFilterData(data, filterCodeSelected);
				   	}
				}       	
		});
	}
}

function getMsgPopup() {
$('#confirmMsgPopup').dialog( {
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
$('#confirmMsgPopup').dialog('open');
}