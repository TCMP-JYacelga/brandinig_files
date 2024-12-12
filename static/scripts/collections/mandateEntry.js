// Used for Bene Branch Description
jQuery.fn.BankByNameAutoComplete = function() {
	
	return this.each(function() {
					$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url :'services/userseek/beneBranchSeek.json',
									dataType : "json",
									type:'POST',
									data : {
										$top:20,
										$filtercode1:$('#sellerCode').val(),
										$autofilter : request.term,
										$filtercode2 : $('#displPayerBankIdType').val(),
										$filtercode3 : ''
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {
														label : item.BRANCHDESCRIPTION,
														bankDesc : item.BANKDESCRIPTION,
														value : item.BRANCHDESCRIPTION,
														bankDtl : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						var strText = '';
						if (data) 
						{
							if (!isEmpty(data.BANKCODE))
								$('#displPayerBankCode').val(data.BANKCODE);
							if (!isEmpty(data.BRANCHCODE))
								$('#displPayerBranchCode').val(data.BRANCHCODE);
							if (!isEmpty(data.BRANCHDESCRIPTION))
								$('#displBranchDesc').val(data.BRANCHDESCRIPTION);
							if (!isEmpty(data.ADDRESS_1))
								$('#displPayerAddress1').val(data.ADDRESS1);
							if (!isEmpty(data.ADDRESS_2))
								$('#displPayerAddress2').val(data.ADDRESS2);
							if (!isEmpty(data.ADDRESS_3))
								$('#displPayerAddress3').val(data.ADDRESS3);
							if (!isEmpty(data.ROUTINGNUMBER))
								$('#displPayerBankId').val(data.ROUTINGNUMBER);
							}
					},
					open : function() {
						$(this).removeClass("ui-corner-all")
								.addClass("ui-corner-top");
					},
					close : function() {
						$(this).removeClass("ui-corner-top")
								.addClass("ui-corner-all");
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="t7-autocompleter"><ul  >'
					+ item.label
					+ '</ul><ul  >'
					+ item.bankDesc + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

jQuery.fn.PayerAutoComplete = function() {
	
	return this.each(function() {
					$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url :'services/userseek/payerSeek.json',
									dataType : "json",
									type:'POST',
									data : {
										$top:20,
										$filtercode1:$('#sellerCode').val(),
										$autofilter : request.term,
										$filtercode2 : $('#clientId').val(),
										$filtercode3 : ''
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {
														label : item.PAYERCODE,
														payerDtl : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.payerDtl;
						if (data) 
						{
							$('#adhocPayerFlag').val("R");
							setPayerDetails(data);
							disablePayerDetails();
						}
					},
					change: function(event, ui) 
					{
						if(null == ui.item || ui.item == '' || ui.item == undefined)
						{
							$('#adhocPayerFlag').val("A");
							enablePayerDetails();
							clearPayerDetails();
						}
      				},
					open : function() {
						$(this).removeClass("ui-corner-all")
								.addClass("ui-corner-top");
					},
					close : function() {
						$(this).removeClass("ui-corner-top")
								.addClass("ui-corner-all");
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="xn-autocompleter"><ul >'
				+ item.label + '</ul></ol></a>';
			
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

jQuery.fn.CreditAcctNoAutoComplete = function() {
	return this.each(function() {
					$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url :'services/userseek/mandateCreditAccount.json',
									dataType : "json",
									type:'POST',
									data : {
										$top:20,
										$filtercode1:$('#sellerCode').val(),
										$autofilter : request.term,
										$filtercode2 : $('#clientId').val(),
										$filtercode3 : ''
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {
														label : item.GL_ID,
														accountDtl : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.accountDtl;
						if (data) 
						{
							$('#displCreditAcctNmbr').val(data.GL_ID);
						}
					},
					open : function() {
						$(this).removeClass("ui-corner-all")
								.addClass("ui-corner-top");
					},
					close : function() {
						$(this).removeClass("ui-corner-top")
								.addClass("ui-corner-all");
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="xn-autocompleter"><ul >'
				+ item.label + '</ul></ol></a>';
			
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

jQuery.fn.checkInfoFoundForBankID = function(infoType,displPayerBankIdTypeElement, infoMessageElement) {
	var textVal = this.val();
	if(textVal == '' || textVal == '%'){
		$('#messageArea').empty();
		$('#messageArea, #messageContentDiv').addClass('hidden');
		return;
	}
	$.ajax({
									url :"services/userseek/validateBeneEntryDrawerbank.json",
									dataType : "json",
									type:'POST',
									data : {
										$top:20,
										$filtercode1:(isEmpty($('#displPayerCountry').val())?$('#tempCountry').val():$('#displPayerCountry').val()),
										$filtercode2:$('#sellerCode').val(),
										$filtercode4 : textVal,
										$filtercode3 : ($('#'+displPayerBankIdTypeElement) == null || $('#'+displPayerBankIdTypeElement).val() == undefined)
														? 'BIC' : $('#'+displPayerBankIdTypeElement).val()
									},
									success : function(bankData) {
										var data = bankData.d.preferences[0];
										clearBankDetails(infoType);
										if(data == null || (data != null && data.length == 0)){
											$('#'+infoMessageElement).empty();
											$('#'+infoMessageElement).html(getWarningMessage());
											/*var strPaymentType = $('#paymentType').val();
											if(infoType == 'RECEIVER_BANK_ID' && strPaymentType!='03'){
												$('#receiverBranchName').addClass('required');
											}
											else if(infoType == 'CORR_BANK_ID'){
												$('#lblCorrBankBranchName').addClass('required');
											}
											else if(infoType == 'INT_BANK_ID'){
												$('#lblIntBankBranchName').addClass('required');
											}*/
										}
										else{
											if(infoType == 'RECEIVER_BANK_ID'){
													if (data) {
														$('#receiverBranchName').removeClass('required');
														$('#beneBankCode').attr("disabled","true");
														isReceiverBankIDSelected = true;
														if (!isEmpty(data.BANKCODE))
														{
															$('#displPayerBankId').val(data.ROUTINGNUMBER);
															$('#beneBankCode').val(data.BANKCODE);
														}
														if (!isEmpty(data.BRANCHCODE))
															$('#beneBranchCode').val(data.BRANCHCODE);
														if (!isEmpty(data.ADDRESS))
															$('#beneAddress2').val(data.ADDRESS);
														var strText = '';
														if (!isEmpty(data.BRANCHDESCRIPTION))
														$('#beneBranchDesc').val(data.BRANCHDESCRIPTION);
														if (!isEmpty(data.BANKDESCRIPTION))
														$('#beneBankDesc').val(data.BANKDESCRIPTION);
														if (!isEmpty(data.BANKDESCRIPTION))
															strText = data.BANKDESCRIPTION;
														if (!isEmpty(data.BRANCHDESCRIPTION))
															strText += ',&nbsp;' + data.BRANCHDESCRIPTION;
														if (!isEmpty(data.ROUTINGNUMBER))
															strText += ',&nbsp;' + data.ROUTINGNUMBER;
															$('#'+infoMessageElement).empty();
														$('#'+infoMessageElement).html(strText);
													}
											}
											else if(infoType == 'CORR_BANK_ID'){
													if (data) {
														$('#lblCorrBankBranchName').removeClass('required');
														$('#corrBankDetails1').attr("disabled","true");
														$('#corrBankDetails2').attr("disabled","true");
														if (!isEmpty(data.BANKCODE))
														{
															$('#corrBankSearchText').val(data.ROUTINGNUMBER);
															$('#corrBankDetails1').val(data.BANKCODE);
														}
														if (!isEmpty(data.BRANCHCODE))
															$('#corrBankDetails2').val(data.BRANCHCODE);
													}
											}
											else if(infoType == 'INT_BANK_ID'){
													if (data) {
														$('#lblIntBankBranchName').removeClass('required');
														$('#intBankDetails1').attr("disabled","true");
														$('#intBankDetails2').attr("disabled","true");
														if (!isEmpty(data.BANKCODE))
														{
															$('#interemBankSearchText').val(data.ROUTINGNUMBER);
															$('#intBankDetails1').val(data.BANKCODE);
														}
														if (!isEmpty(data.BRANCHCODE))
															$('#intBankDetails2').val(data.BRANCHCODE);
													}
											}
										}
									}
								});
};

function validateAndPaintReceiverBankIDsErrors(){
	var arrError = new Array();
	
	doBankIDValidation($('#displPayerBankIdType').val(), $('#displPayerBankId').val(), arrError, 'Receiver');
	
	var element = null, strMsg = null, strTargetDivId = 'messageArea', strErrorCode = '';
	if (arrError && arrError.length > 0) {
		$('#' + strTargetDivId).empty();
		$.each(arrError, function(index, error) {
					strErrorCode = error.errorCode || error.code;
					strMsg = !isEmpty(strErrorCode) ? strErrorCode : '';
					if (!isEmpty(strMsg))
						strMsg += ' : ';
					strMsg += error.errorMessage;
					if (!isEmpty(strErrorCode)) {
						$('#errorDiv').empty();
						element = $('<p>').text(error.errorMessage);
						element.appendTo($('#' + strTargetDivId));
						$('#' + strTargetDivId + ', #messageContentDiv')
								.removeClass('hidden');
					}
				});

	} else {
		$('#messageArea').empty();
		$('#' + strTargetDivId + ', #messageContentDiv').addClass('hidden');
	}

	if(arrError.length > 0)
		return true;
	else 
		return false;
}

jQuery.fn.BankIdAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				$.ajax({
							url : "services/userseek/drwMandEntryDrawerbank.json",
							type : 'POST',
							dataType : "json",
							data : {
								$top : 20,
								$filtercode1 : $('#sellerCode').val(),
								$autofilter : request.term,
								$filtercode2 : $('#displPayerBankIdType').val(),
								$filtercode3 : ''
							},
							success : function(data) {
								var rec = data.d.preferences;
								if (rec.length > 0) {
									response($.map(rec, function(item) {
												return {
													label : item.BRANCHDESCRIPTION,
													bankDesc : item.BANKDESCRIPTION,
													value : item.ROUTINGNUMBER,
													bankDtl : item
												}
											}));
								}
							}
						});
			},
			minLength : 1,
			select : function(event, ui) {
				var data = ui.item.bankDtl;
				var strText = '';
				if (data) 
				{
					$('#displPayerBankCode').attr("disabled", "true");
					if (!isEmpty(data.BANKCODE))
						$('#displPayerBankCode').val(data.BANKCODE);
					if (!isEmpty(data.ROUTINGNUMBER))
						$('#displPayerBankId').val(data.ROUTINGNUMBER);
					if (!isEmpty(data.BRANCHCODE))
						$('#displPayerBranchCode').val(data.BRANCHCODE);
					if (!isEmpty(data.BRANCHDESCRIPTION))
						$('#displBranchDesc').val(data.BRANCHDESCRIPTION);
				}
			},
			open : function() {
				/*
				 * $(this).removeClass("ui-corner-all")
				 * .addClass("ui-corner-top");
				 */
			},
			close : function() {
				/*
				 * $(this).removeClass("ui-corner-top")
				 * .addClass("ui-corner-all");
				 */
			}
		});/*.data("autocomplete")._renderItem = function(ul, item) {
			
			 * var inner_html = '<a><ol class="t7-autocompleter"><ul  >'
			 * +item.value +' - '+ item.label + '</ul><ul  >' + item.bankDesc + '</ul></ol></a>';
			 
			var inner_html = '<a><ol class="t7-autocompleter"><ul">'
					+ item.value + '  ' + '</ul><ul">' + item.label + '</ul></ol></a>';

			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

function setDirtyBit()
{
	dityBitSet=true;
}

function persistBeneficiaryBankDetails() {
	objOldBeneDetails['displPayerBankIdType'] = $('#displPayerBankIdType').val();
	objOldBeneDetails['displPayerBankCode'] = $('#displPayerBankCode').val();
	objOldBeneDetails['displPayerBranchCode'] = $('#displPayerBranchCode').val();
	objOldBeneDetails['displBranchDesc'] = $('#displBranchDesc').val();
	objOldBeneDetails['displPayerBankId'] = $('#displPayerBankId').val();
}

function clearReceiverBankDetails(){
	persistBeneficiaryBankDetails();
	$('#displPayerBankId').val('');
	$('#displBranchDesc').val('');	
}

jQuery.fn.clientAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/adminmandatecompany.json",
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term,
										$top:-1
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {
														label : item.DESCR,
														bankDtl : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) 
					{
						var data = ui.item.bankDtl;
						if (data)
						{
							if (!isEmpty(data.DESCR))
							{
								$('#clientDesc').val(data.DESCR);
								$('#clientId').val(data.CODE);
							}
							$('#adhocPayerFlag').val("A");
							$('#displPayerCode').removeAttr("readonly");
							$('#displPayerCode').val('');
							enablePayerDetails();
							clearPayerDetails();
						}
						if(strEntityTYpe == 0)
						{
							populateReceivablesPackage();
						}
						start_blocking(strBlockMessage, document.getElementById('clientDesc'));
					},
					open : function() {
						$(this).removeClass("ui-corner-all")
								.addClass("ui-corner-top");
					},
					close : function() {
						$(this).removeClass("ui-corner-top")
								.addClass("ui-corner-all");
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

function populateBankDtls(mode)
{
	if ("ADD" === mode)
	{
		var frm = document.forms["frmMain"];
		frm.action = "addMandate.form";
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
	else
	{
		return false;
	}
}

function setDates()
{
   $('#displEffectiveStartDate').datepicker({
		dateFormat : dateFormat,
		changeMonth: true,
	    changeYear: true,
		appendText : '',
		minDate: new Date(year, month - 1, parseInt(adjustDay,10)),
		defaultDate: new Date(year, month - 1, parseInt(adjustDay,10)),
		onSelect : function(selectedDate){
			var obj = $(this);
			setTimeout(function(){obj.trigger('blur');},300);
		},
		onClose: function( selectedDate ) {
			var strId = $(this).attr('id');
			var obj = $(this);
			if(strId === 'displEffectiveStartDate'){
				var dtStart = $(this).datepicker('getDate');
				if (dtStart != null) {
					dtStart.setDate(dtStart.getDate());
					$("#displEffectiveEndDate").datepicker("option", "minDate",
							dtStart);
				}
			}
			setTimeout(function(){obj.trigger('blur');},300);
	      }
	}).attr('readOnly',true);
   
   $('#displEffectiveEndDate').datepicker({
		dateFormat : dateFormat,
		changeMonth: true,
	    changeYear: true,
		appendText : '',
		minDate : null != $("#displEffectiveStartDate").datepicker(
				'getDate') ? $("#displEffectiveStartDate").datepicker(
				'getDate') : new Date(year, month - 1, parseInt(
				adjustDay, 10) + 1),
		defaultDate: new Date(year, month - 1, adjustDay),
		onSelect : function(selectedDate){
			var obj = $(this);
			setTimeout(function(){obj.trigger('blur');},300);
		},
		onClose: function( selectedDate ) {
			var strId = $(this).attr('id');
			var obj = $(this);
			if(strId === 'displEffectiveEndDate'){
				var dtStart = $(this).datepicker('getDate');
				if (dtStart) {
					dtStart.setDate(dtStart.getDate() + 1);
					$("#displEffectiveStartDate").datepicker("option",
							"maxDate", dtStart);
				}
			}
			setTimeout(function(){obj.trigger('blur');},300);
	      }
	}).attr('readOnly',true);
   if($("#displEffectiveStartDate").val() == null || $("#displEffectiveStartDate").val() == '')
   {
	   var prevDate = month+"/"+adjustDay+"/"+year;
	   var nextDate = new Date(prevDate);
	   nextDate.setDate(nextDate.getDate());
   	   $("#displEffectiveStartDate").datepicker({dateFormat:'mm/dd/yyyy'}).datepicker('setDate',nextDate);
   }
//   if($("#displEffectiveEndDate").val() == null || $("#displEffectiveEndDate").val() == '')
//   {
//	   $("#displEffectiveEndDate").val(adjustDay+"/"+(month)+"/"+year);
//   }
}

function saveProfile(mode)
{	
	$('input').removeAttr("disabled");
	$('select').removeAttr("disabled");
	if(!isEmpty($('#displMandateMinAmount').val()))
	$('#displMandateMinAmount').val($('#displMandateMinAmount').autoNumeric('get'));
	if(!isEmpty($('#displMandateMaxAmount').val()))
	$('#displMandateMaxAmount').val($('#displMandateMaxAmount').autoNumeric('get'));
	if(!isEmpty($('#displInvocationAmnt').val()))
	$('#displInvocationAmnt').val($('#displInvocationAmnt').autoNumeric('get'));
	var frm = document.forms['frmMain'];
	frm.action = '';
	frm.target = "";
	if (mode == "ADD" || mode == "SAVE" || mode == "ADD_MANDATE"){
		frm.action = "saveMandate.form";
	} else if (mode == "UPDATE"){
		frm.action = "updateMandate.form";
	} else if (mode == "NEXT"){
		frm.action = "verifyMandate.form";
	}
	frm.method='POST';
	frm.submit();
}

function submitForm(strUrl)
{
	$("input").removeAttr('disabled');
	$("select").removeAttr('disabled');
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showBackPage(strAction)
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	if (strAction == "AUTH_VIEW")
		frm.action = "authMandate.form";
	else
		frm.action = "mandateList.form";
	frm.method = 'POST';
	frm.submit();
	return true;
}

function showHideNotifyPayerDays(callEvent)
{
	var frm = document.forms["frmMain"];
	if (callEvent!=null && callEvent == 'toggle')
	{	
		$('#displNotifyPayerDays').removeAttr("disabled");	
		if (document.getElementById('chkNotifyPayer').checked)
		{
			frm.displNotifyPayer.value = 'Y';
			$("#displNotifyPayerDaysLbl").addClass('required');
		}
		else
		{
			frm.displNotifyPayer.value = 'N';
			$('#displNotifyPayerDays').val('');
			$('#displNotifyPayerDays').attr("disabled", "true");
			$("#displNotifyPayerDaysLbl").removeClass('required');
		}
	}
	else
	{
		if (strNotifyPayer == 'Y')
		{
			$('#displNotifyPayerDays').removeAttr("disabled");
			$("#displNotifyPayerDaysLbl").addClass('required');
		}
		else
		{
			$('#displNotifyPayerDays').val('');
			$('#displNotifyPayerDays').attr("disabled", "true");
			$("#displNotifyPayerDaysLbl").removeClass('required');
		}
	}
}

function showList(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function getCancelConfirmPopUp(strUrl) {
	$('#cancelConfirmMsg').bind('click',function(){
		$('#confirmMsgPopup').dialog("close");
	});

	$('#doneConfirmMsgbutton').bind('click',function(){
		$(this).dialog("close");
		gotoPage(strUrl);
	});
	if(dityBitSet)
	{
		$('#confirmMsgPopup').dialog({
			autoOpen : false,
			maxHeight: 550,
			minHeight:'auto',
			width : 400,
			modal : true,
			resizable: false,
			draggable: false
		});
		$('#confirmMsgPopup').dialog("open");
		$('#textContent').focus();
	}
	else
	{
		gotoPage(strUrl);
	}
}

function setMandateType(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();		
}
function reloadInvocation(mode, radioIndex)
{
	var frm = document.forms["frmMain"];
	setDates();
	$('#isRadioClicked').val(radioIndex);
	if (pageMode == 'EDIT' || pageMode == 'UPDATE')
	{
		$('input').removeAttr("disabled");
		$('select').removeAttr("disabled");
		frm.action = "reloadMandate.form";
	}
	else
	{	
		$('input').removeAttr("disabled");
		$('select').removeAttr("disabled");
		frm.action = "addMandate.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function setMandate(mode)
{
	var mndtReqTypeVal = document.getElementById('requestType').value;
	if("R" == mndtReqTypeVal)
	{
		$('textarea,select,input[type="text"],input[type="radio"]').removeAttr("disabled");
		$('#chkNotifyPayer').attr("disabled", false);
		$('.addNice').niceSelect('update');
	}
	else if("B" == mndtReqTypeVal || "F" == mndtReqTypeVal || "N" == mndtReqTypeVal || "S" == mndtReqTypeVal)
	{	
		$('#mandateStatus').removeAttr('disabled');
		$('#suspensionEndDate').removeAttr('disabled');
		$('#returnReasonCode').removeAttr('disabled');
		$('#returnReasonDescription').removeAttr('disabled');
		$('#mandateStatus').niceSelect('update');
		$('#returnReasonCode').niceSelect('update');
		if("N" == mndtReqTypeVal)
			enableFieldsOnChangeOfRequestType();
	}
	var frm = document.forms["frmMain"];
	if (pageMode == 'EDIT' || pageMode == 'UPDATE')
	{
		$('input').removeAttr("disabled");
		$('select').removeAttr("disabled");
		frm.action = "reloadMandate.form";
	}
	else
	{
		frm.action = "addMandate.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function setMandateDetailsOnMandateStatus(mode)
{
	var mndtReqTypeVal = document.getElementById('requestType').value;
	if("N" == mndtReqTypeVal)
	{
		$('textarea,select,input[type="text"],input[type="radio"]').removeAttr("disabled");
		$('#chkNotifyPayer').attr("disabled", false);
		$('.addNice').niceSelect('update');
	}
	var frm = document.forms["frmMain"];
	if (pageMode == 'EDIT' || pageMode == 'UPDATE')
	{
		frm.action = "reloadMandate.form";
	}
	else
	{
		frm.action = "addMandate.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function removeOptions(selectbox)
{
    var i;
    for(i=selectbox.options.length-1;i>=0;i--)
    {
        selectbox.remove(i);
    }
}
var gstrPeriod,gstrRef,gstrFreq;
/*var PeriodWeekArray = {"1":"1-Weekly","2":"2-Every 2nd Week","3":"3-Every 3rd Week","4":"4-Every 4th Week"};
var PeriodMonArray = {"1":"1-Monthly","2":"2-Every 2nd Month","3":"3-Every 3rd Month","4":"4-Every 4th Month","5":"5-Every 5th Month",
						"6":"6-Every 6th Month","7":"7-Every 7th Month","8":"8-Every 8th Month","9":"9-Every 9th Month",
						"10":"10-Every 10th Month","11":"11-Every 11th Month","12":"12-Every 12th Month"};
var PeriodDayArray = {"1":"1-Everyday","2":"2-Every 2nd Day","3":"3-Every 3rd Day","4":"4-Every 4th Day",
						"5":"5-Every 5th Day","6":"6-Every 6th Day","7":"7-Every 7th Day"};*/
var RefWeekDay = {"1":"Sun","2":"Mon","3":"Tue","4":"Wed","5":"Thu","6":"Fri","7":"Sat"};
var RefMonArray = {"1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","10":"10","11":"11","12":"12","13":"13","14":"14","15":"15","16":"16",
									"17":"17","18":"18","19":"19","20":"20","21":"21","22":"22","23":"23","24":"24","25":"25","26":"26","27":"27","28":"28","29":"29","30":"30","31":"31"};
var RefDay = {"0":"N/A"};

function GetPeriod(callEvent)
{
	var frm = document.forms["frmMain"];
	var i, intDay,intMonth ,intclear,intPeriod;
	var Freq = document.getElementById("displInvocationFreq").value;
	//var gstrPeriod = document.getElementById("frmPeriod").value;
	var gstrRef = document.getElementById("frmRefDays").value;	
//	if(!gstrPeriod)
//		gstrPeriod = 1;
	if (!gstrRef)
		gstrRef = 1;
	var invocationType = frm.invocationType;
	if (Freq == "") return false;
	if(invocationType[1].checked)
	{
		document.getElementById("displInvocationPeriod").length=0;
		document.getElementById("displFreqRefDay").length=0;
		if(callEvent!=null && callEvent=="reload")
		{
			$('#chkNotifyPayer').attr("disabled", false);
			$('#displInvocationPeriod').val('');
		}
			if (Freq =="W")
			{
				/*if(gstrPeriod > 4)
					gstrPeriod = 1;
				$.each(PeriodWeekArray, function(key, value) {
				$('#displInvocationPeriod')
				  .append($('<option>', { value : key })
				  .text(value));
			});
			if(callEvent!=null && callEvent=="onLoad")
			{				
				$('#displInvocationPeriod option')[gstrPeriod-1].selected = true;
			}*/
	
			$.each(RefWeekDay, function(key, value) {   
			$('#displFreqRefDay')
			  .append($('<option>', { value : key })
			  .text(value));
			});
			if(callEvent!=null && callEvent=="onLoad")
			{
				$('#displFreqRefDay option')[gstrRef-1].selected = true;
			}
		}
		else
		{
			if (Freq=="M")
			{
				/*if(gstrPeriod > 12)
					gstrPeriod = 1;
				$.each(PeriodMonArray, function(key, value) {   
				$('#displInvocationPeriod')
				  .append($('<option>', { value : key })
				 .text(value)); 
			});
				if(callEvent!=null && callEvent=="onLoad")
				{	
					$('#displInvocationPeriod option')[gstrPeriod-1].selected = true;
				}*/
	
				$.each(RefMonArray, function(key, value) {   
				$('#displFreqRefDay')
				  .append($('<option>', { value : key })
				  .text(value)); 
				});
				if(callEvent!=null && callEvent=="onLoad")
				{
					$('#displFreqRefDay option')[gstrRef-1].selected = true;
				}
			}	
			else
			{
				/*if(gstrPeriod > 7)
					gstrPeriod = 1;
				$.each(PeriodDayArray, function(key, value) {   
				$('#displInvocationPeriod')
				  .append($('<option>', { value : key })
				  .text(value)); 
				});
				
				if(callEvent!=null && callEvent=="onLoad")
				{
					$('#displInvocationPeriod option')[gstrPeriod-1].selected = true;
				}*/
				$.each(RefDay, function(key, value) {   
				$('#displFreqRefDay')
				  .append($('<option>', { value : key })
				  .text(value)); 
				});
			}
		}
	}
	else if(invocationType[0].checked)
	{
		if (Freq =="D")
			$("#frequencyDesc").text("Day(s)");
		else if(Freq =="W")
			$("#frequencyDesc").text("Week(s)");
		else
			$("#frequencyDesc").text("Month(s)");
	}
	$('#displFreqRefDay').niceSelect('update');
}

function showHideNotifyPayer(me)
{
	var frm = document.forms["frmMain"];
	var Freq = document.getElementById("displInvocationFreq").value;
	var Iprd = document.getElementById("displInvocationPeriod").value;
	if (Freq =="D" && Iprd ==1)
	{	
		    frm.displNotifyPayer.value = 'N';
			$('#chkNotifyPayer').prop('checked', false); 
			//$('input:checkbox[id="chkNotifyPayer"]').attr("disabled","true");
			$('#chkNotifyPayer').attr("disabled",true);
            $('#displNotifyPayerDays').val('');
			$('#displNotifyPayerDays').attr("disabled", "true");
	}
	else{
	    $('#chkNotifyPayer').attr("disabled",false);
	}
}

function validatePayerDays(me)
{
	var frm = document.forms["frmMain"];
	var Freq = document.getElementById("displInvocationFreq").value;
	var Iprd = document.getElementById("displInvocationPeriod").value;
	if (Freq =="D")
	{	
		var notifyPayerDays = $('#displNotifyPayerDays').val();
		if(parseInt(notifyPayerDays,10) >= parseInt(Iprd,10))
		{
			$('#displNotifyPayerDays').val('');
		}
	}
}

function enableDisableStatus(requestType)
{
	if(requestType.value == 'B' || requestType.value == 'R' || requestType.value == 'F' || requestType.value == 'S')
	{
		$('#mandateStatus').attr("disabled", "true");
		$('#mandateStatus').niceSelect('update');
	}
	else
	{
		$('#mandateStatus').removeAttr('disabled');
		$('#mandateStatus').niceSelect('update');
	}
}

function enableDisableSuspensionDate(mandateStatusObj)
{
	/*if (document.getElementById("invocationType1").checked)
	{		
	   var adjustDay = day;
	}
	if (document.getElementById("invocationType2").checked)
	{
		var adjustDay = parseInt(day) + 1;
	}*/
	if(mandateStatusObj.value == 'S')
	{
	   	$('#lblSuspensionEndDate').addClass("required");
	   	$('#suspensionEndDate').removeAttr("disabled");
	   	var fromStartDate = $.datepicker.parseDate(dateFormat,$('#displEffectiveStartDate').val());
	   	var dtApplDate = $.datepicker.parseDate(dateFormat,dtApplicationDate);
	   	if(fromStartDate<dtApplDate)
	   	    fromStartDate=dtApplDate;
	   	var toStartDate = $.datepicker.parseDate(dateFormat,$('#displEffectiveEndDate').val());
	   	var fromday=fromStartDate.getDate();
	    var frommonth = fromStartDate.getMonth();
	    var fromyear = fromStartDate.getFullYear();
	    var today=toStartDate.getDate();
	    var tomonth = toStartDate.getMonth();
	    var toyear = toStartDate.getFullYear();
	   	$('#suspensionEndDate').datepicker({ 
	   		dateFormat : dateFormat,
	   		changeMonth: true,
	   	    changeYear: true,
	   		appendText : '',
	   		minDate: new Date(parseInt(fromyear,10), parseInt(frommonth,10), parseInt(fromday,10) + 1),
	   		maxDate: new Date(parseInt(toyear,10), parseInt(tomonth,10), parseInt(today,10) - 1),
	   		defaultDate: new Date(year, month - 1, adjustDay)
	   	}).attr('readOnly',true);
	}
	else
	{
		if ($('#lblSuspensionEndDate').hasClass("required"))
			$('#lblSuspensionEndDate').removeClass("required");
	   	$('#suspensionEndDate').val('');
	   	$('#suspensionEndDate').attr("disabled","disabled");
	}
}

function validateRejectReason()
{
	if($('#returnReasonCode').val() ==null || $('#returnReasonCode').val() == '')
		{
			$('#returnReasonDescription').val('');
		}
}

function enableDisableRejectReasonOnReqStatus(reqStatusObj)
{
	var reqType =  $('#requestType').val();
	if((reqType == 'F' || reqType == 'B' || reqType == 'R') && reqStatusObj.value == 'R')
	{
		$('#lblReturnresultCode').addClass("required");
		$('#lblRejetcReason').addClass("required");
		$('#returnReasonCode').removeAttr('disabled');
		$('#returnReasonCode').niceSelect('update');
		if($('#returnReasonCode').val() == '31')		
			$('#returnReasonDescription').removeAttr('disabled');
		else
			$('#returnReasonDescription').attr("disabled","true");
		
		$('#mandateStatus').attr("disabled","true");
		if(reqStatusObj.value == 'R'){
			$('#mandateStatus').val('C');
			$('#mandateStatus').niceSelect('update');
		}
	}
	else if((reqType == 'F' || reqType == 'B') && reqStatusObj.value == 'A')
	{
		$('#mandateStatus').attr("disabled","true");
		$('#mandateStatus').val('A');
		$('#mandateStatus').niceSelect('update');
		setReturnReasonFields();
	}
	else if(reqType == 'N' || (reqType == 'R' && reqStatusObj.value == 'B'))
	{
		setReturnReasonFields();
	}
	else if(reqType == 'S' && strRequestState != '0' && strValidFlag != 'N')
	{
		if(reqStatusObj.value == 'B'){
			$('#mandateStatus').val('V');
			$('#mandateStatus').niceSelect('update');
		}
		else if(reqStatusObj.value == 'C'){
			$('#mandateStatus').val('C');
			$('#mandateStatus').niceSelect('update');
		}
		setReturnReasonFields();
	}
	else if(reqType == 'S' && strRequestState == '0' && strValidFlag == 'N')
	{
		setReturnReasonFields();		
		$('#requestType').attr("disabled","true");
		$('#requestStatus').attr("disabled","true");
		$('#mandateStatus').attr("disabled","true");
		$('#requestType').val('S');
		$('#requestStatus').val('B');
		$('#mandateStatus').val('V');
		$('#mandateStatus').niceSelect('update');
		$('#requestStatus').niceSelect('update');
		$('#requestType').niceSelect('update');
	}
	else if(reqType == 'S' && strRequestState == '7' && strValidFlag == 'N')
	{
	   if(reqStatusObj.value == 'B'){
       		setReturnReasonFields();
			$('#mandateStatus').val('V');
			$('#mandateStatus').niceSelect('update');
       }
       else if(reqStatusObj.value == 'C'){
       		$('#returnReasonCode').removeAttr('disabled');
        	$('#returnReasonCode').removeClass('disabled');
        	$('#returnReasonCode').niceSelect('update');
        	$('#returnReasonDescription').removeAttr('disabled');
        	$('#returnReasonDescription').removeClass('disabled');
        	$('#mandateStatus').val('C');
        	$('#mandateStatus').niceSelect('update');
        	if ($('#lblReturnresultCode').hasClass("required"))
				$('#lblReturnresultCode').removeClass("required");
			if ($('#lblRejetcReason').hasClass("required"))
				$('#lblRejetcReason').removeClass("required");
       }
	}
	else
	{
		$('#returnReasonCode').removeAttr('disabled');
		$('#returnReasonDescription').removeAttr('disabled');
		if ($('#lblReturnresultCode').hasClass("required"))
			$('#lblReturnresultCode').removeClass("required");
		if ($('#lblRejetcReason').hasClass("required"))
			$('#lblRejetcReason').removeClass("required");
		$('#returnReasonCode').niceSelect('update');
	}
}

function setReturnReasonFields()
{
	$('#returnReasonCode').val('');
	$('#returnReasonDescription').val('');
	$('#returnReasonCode').attr("disabled","true");
	$('#returnReasonDescription').attr("disabled","true");
	if ($('#lblReturnresultCode').hasClass("required"))
		$('#lblReturnresultCode').removeClass("required");
	if ($('#lblRejetcReason').hasClass("required"))
		$('#lblRejetcReason').removeClass("required");
	$('#returnReasonCode').niceSelect('update');
}
 
function EnableDisableTransactionCountLimit(freqTypeObj)
 {
    if(freqTypeObj.value != 'P')
	{
	   $('#mandateMaxTransactions').removeAttr("disabled");
	   $('#displMandateMinAmount').attr("disabled", "true");
	   $('#displMandateMinAmount').val('');
	}
	else
	{
	   $('#mandateMaxTransactions').attr("disabled", "true");
	   $('#mandateMaxTransactions').val('');
	   $('#displMandateMinAmount').removeAttr("disabled");
	}
}

function reloadMandate()
{
	$.blockUI({ overlayCSS: {opacity: 0 }, message : '<div id="loadingMsg"><img src="static/styles/Themes/t7-main/resources/images/T7/loading.gif" style="background-position: left center;"/><span style="vertical-align: text-top; margin-left: 5px;">Loading...</span></div>'});
	var frm = document.forms["frmMain"];
	$('input').removeAttr("disabled");
	$('select').removeAttr("disabled");
	frm.action = "addMandate.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function disableOutwardDrawer()
{
	var mandateType = $('#mandateType').val();
	if("O" === mandateType)
	{
		if((document.getElementById('displPayerCode') && $('#displPayerCode').val() != null) && '' === $('#recordKeyNo').val())
		{
			if ('R' === payerType)
			{
				$('#displPayerName').attr("disabled","true");
				$('#displPayerBranchCode').attr("disabled","true");
				$('#displBranchDesc').attr("disabled","true");
				$('#displPayerCountry').attr("disabled","true");
				$('#displPayerBankCode').attr("disabled","true");
				$('#displPayerAccountNmbr').attr("disabled","true");
				$('#displPayerEmail').attr("disabled", "true");
				$('#displPayerMobileNumber').attr("disabled", "true");
			}
		}
	}
}

function enableDisableRetryFields()
{
	if($('#displMandateRetry').val() == 'Y')
	{
		$('#displMandateRetryCount').removeAttr("disabled");
		$('#displMandateRetryInterval').removeAttr("disabled");
		$("label[for='displMandateRetryCount1']").addClass('required');
		$("label[for='displMandateRetryInterval1']").addClass('required');
	}
	else
	{
		$('#displMandateRetryCount').attr( "disabled", "disabled" );
		$('#displMandateRetryInterval').attr( "disabled", "disabled" );
		$("label[for='displMandateRetryCount1']").removeClass('required');
		$("label[for='displMandateRetryInterval1']").removeClass('required');
		$('#displMandateRetryCount').val('');
		$('#displMandateRetryInterval').val('');
	}
}

function populateReceivablesPackage()
{	
	var frm = document.forms["frmMain"];
	frm.action = "addMandate.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function clearPayerDetails()
{
	$('#displPayerName').val('');
	$('#displPayerAddress1').val('');
	$('#displPayerAddress2').val('');
	$('#displPayerAddress3').val('');
	$('#displPayerMobileNumber').val('');
	$('#displPayerEmail').val('');
	$('#displPayerAccountNmbr').val('');
	$('#displPayerAcctCcyCode').val('');
	$('#displPayerAccountType').val('');
	$('#displPayerBankIdType').val('');
	$('#displPayerBankId').val('');
	$('#displBranchDesc').val('');
	$('#displPayerBankCode').val('');
	$('#displPayerBranchCode').val('');
	$('#displPayerCountry').val('');
	$('#displPayerAccountType,#displPayerBankIdType').niceSelect('update');
}

function enablePayerDetails()
{
	$('#displPayerName').removeAttr("disabled");
	$('#displPayerAddress1').removeAttr('disabled');
	$('#displPayerAddress2').removeAttr('disabled');
	$('#displPayerAddress3').removeAttr('disabled');
	$('#displPayerMobileNumber').removeAttr('disabled');
	$('#displPayerEmail').removeAttr('disabled');
	$('#displPayerAccountNmbr').removeAttr('disabled');
	$('#displPayerAcctCcyCode').removeAttr('disabled');
	$('#displPayerAccountType').removeAttr('disabled');
	$('#displPayerBankIdType').removeAttr('disabled');
	$('#displPayerBankId').removeAttr('disabled');
	$('#displBranchDesc').removeAttr('disabled');
	$('#displPayerBankCode').removeAttr('disabled');
	$('#displPayerBranchCode').removeAttr('disabled');
	$('#displPayerCountry').removeAttr('disabled');
	$('#displPayerAccountType,#displPayerBankIdType').niceSelect('update');
}

function disablePayerDetails()
{
	$('#displPayerName').attr("disabled", "disabled");
	$('#displPayerAddress1').attr("disabled", "disabled");
	$('#displPayerAddress2').attr("disabled", "disabled");
	$('#displPayerAddress3').attr("disabled", "disabled");
	$('#displPayerMobileNumber').attr("disabled", "disabled");
	$('#displPayerEmail').attr("disabled", "disabled");
	$('#displPayerAccountNmbr').attr("disabled", "disabled");
	$('#displPayerAcctCcyCode').attr("disabled", "disabled");
	$('#displPayerAccountType').attr("disabled", "disabled");
	$('#displPayerBankIdType').attr("disabled", "disabled");
	$('#displPayerBankId').attr("disabled", "disabled");
	$('#displBranchDesc').attr("disabled", "disabled");
	$('#displPayerBankCode').attr("disabled", "disabled");
	$('#displPayerBranchCode').attr("disabled", "disabled");	
	$('#displPayerCountry').attr("disabled", "disabled");
	$('#displPayerBankIdType').niceSelect('update');
	$('#displPayerBankId').niceSelect('update');
	$('#displPayerAccountType').niceSelect('update');
}

function disablePayerDetailsPostAccept()
{
	$('#displPayerName').attr("disabled", "disabled");
	$('#displPayerAddress1').attr("disabled", "disabled");
	$('#displPayerAddress2').attr("disabled", "disabled");
	$('#displPayerAddress3').attr("disabled", "disabled");
	$('#displPayerMobileNumber').attr("disabled", "disabled");
	$('#displPayerEmail').attr("disabled", "disabled");
	$('#displPayerAccountNmbr').attr("disabled", "disabled");
	$('#displPayerAcctCcyCode').attr("disabled", "disabled");
	$('#displPayerAccountType').attr("disabled", "disabled");
	$('#displPayerBankIdType').attr("disabled", "disabled");
	$('#displPayerBankId').attr("disabled", "disabled");
	$('#displBranchDesc').attr("disabled", "disabled");
	$('#displPayerCountry').attr("disabled", "disabled");
	$('#displPayerBankIdType').niceSelect('update');
	$('#displPayerBankId').niceSelect('update');
	$('#displPayerAccountType').niceSelect('update');
}

function setPayerDetails(data)
{
	$('#displPayerCode').val(data.PAYERCODE);
	$('#displPayerName').val(data.PAYER_DESCRIPTION);
	$('#displPayerAddress1').val(data.ADDRESS_1);
	$('#displPayerAddress2').val(data.ADDRESS_2);
	$('#displPayerAddress3').val(data.ADDRESS_3);
	$('#displPayerMobileNumber').val(data.MOBILE_NMBR);
	$('#displPayerEmail').val(data.EMAIL_ID);
	$('#displPayerAccountNmbr').val(data.PAYER_ACCT_NMBR);
	$('#displPayerAcctCcyCode').val(data.PAYER_ACCOUNT_CCY);
	$('#displPayerAccountType').val(data.PAYER_ACCOUNT_TYPE);
	$('#displPayerBankIdType').val(data.PAYER_BANK_ID_TYPE);
	$('#displPayerBankId').val(data.BANK_ID);
	$('#displBranchDesc').val(data.ADHOC_BRANCH_DESCRIPTION);
	$('#displPayerBankCode').val(data.PAYER_BANK_CODE);
	$('#displPayerBranchCode').val(data.PAYER_BRANCH_CODE);
	$('#displPayerCountry').val(data.COUNTRY);
	$('#displPayerBankIdType').niceSelect('update');
	$('#displPayerAccountType').niceSelect('update');
}

function enableDisableMandateDetails()
{
	if(strMandateStatus == 'A')
	{
		$('#suspensionEndDate').attr("disabled","true");
		$('#displMandateDescription').attr("disabled","true");
		$('#clientDesc').attr("readonly","readonly");
		$('#invocationType1').attr("disabled","true");
		$('#invocationType2').attr("disabled","true");
		$('#displMandateMinAmount').attr("disabled","true");
		$('#displMandateMaxAmount').attr("disabled","true");
		$('#displMandatePaymentFreq').attr("disabled","true");
		$('#mandateMaxTransactions').attr("disabled","true");
		$('#displPayerCode').attr("readonly", "readonly");
		$('#returnReasonDescription').attr("disabled","true");
		$('#displEffectiveEndDate').attr("disabled","true");
		$('#displInvocationAmnt').attr("disabled","true");
		$('#displInvocationFreq').attr("disabled","true");
		$('#displInvocationPeriod').attr("disabled","true");
		$('#displFreqRefDay').attr("disabled","true");
		$('#displPayerAccountNmbr').attr("disabled","true");
		$('#displPayerAcctCcyCode').attr("disabled","true");
		$('#displPayerAccountType').attr("disabled","true");
		$('#displPayerBankIdType').attr("disabled","true");
		$('#displPayerBankId').attr("disabled","true");
		$('#displBranchDesc').attr("disabled","true");
	}
}
function populatePurposeDesc()
{	
	var index = document.getElementById("displPurposeCode").selectedIndex;
	var purposeCode = document.getElementById("displPurposeCode")[index].text;
	if(purposeCode != '' && purposeCode != null && purposeCode != 'undefined')
	{
		$('#displPurposeDesc').prop('title', '');
		var descIndex = purposeCode.indexOf("|");
		if(descIndex != -1)
		{
			var code=purposeCode.substring(0, descIndex);
			var desc=purposeCode.substring(descIndex+1, purposeCode.length);
			if(code === 'OTHER')
			{
				$('#displPurposeDesc').removeAttr("disabled");
			}
			else
			{
				$('#displPurposeDesc').attr("disabled","true");
				if(desc != '' && desc != null && desc != 'undefined')
				{
					$('#displPurposeDesc').prop('title', desc);
				}
			}
			$('#displPurposeDesc').val(desc);
		}
		
	}
}

function returnReasonDesc()
{	
	var index = document.getElementById("returnReasonCode").selectedIndex;
	var returnReasonCode = document.getElementById("returnReasonCode")[index].text;
	if(returnReasonCode != '' && returnReasonCode != null && returnReasonCode != 'undefined' && returnReasonCode != 'Select')
	{
		var modReturnReasonCode = returnReasonCode.split("-")
		if(modReturnReasonCode[0] === '31')//OTHER
		{
			$('#returnReasonDescription').removeAttr("disabled");
		}
		else
		{
			$('#returnReasonDescription').attr("disabled","true");
		}	
		$('#returnReasonDescription').val(modReturnReasonCode[1]);
	}
}

function enableDisablePayerDetails()
{	
	if(strRequestState != '0' && strValidFlag != 'N'){
		   disablePayerDetailsPostAccept();
	}
	else{
	if(strAdhocPayerFlag == 'R')
	{
		disablePayerDetails()
	}
	else
	{
		enablePayerDetails();	
	}
}
}

function isNumber(ctrl)
{
	var value = ctrl.value;	
	if (value && ((!value.match(/^\d+$/)) || (!value.match(/^([1-9])+([0-9])*$/))))
	{
		ctrl.value = '';
	}
}

function isValidAmount(ctrl)
{
	var value = ctrl.value;	
	if (value && (!value.match(/^[-]?\d*\.?\d*$/)))
	{
		ctrl.value = '';
	}
}

function showDownload(strUrl, docName)
{	
	var frm = document.forms["frmMain"];	
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function setImageValue()
{
	document.getElementById('tempFile').value = document.getElementById('file').value;
}

function showUploadPopup(fptrCallback, strUrl)
{
	$('#btnUploadCancel').bind('click', function(){
		$('#uploadMandateImgRef').dialog("close");
		removeUploadedImage();
		//setTimeout(function(){$("#btnUpld").focus();}, 300);
	});
	$('#uploadBtn').bind('click', function(){
		$('#uploadMandateImgRef').dialog("close");
		fptrCallback.call(null, strUrl);
	});
	$('#uploadMandateImgRef').dialog({
		bgiframe:true, 
		autoOpen:false, 
		height:"auto", 
		modal:true, 
		resizable:false, 
		draggable: false, 
		width:570,
		close:function() {
			removeUploadedImage();
			}
	});
	$('#uploadMandateImgRef').dialog('open');
}

function chooseFileClicked() {
	$('#file').click();
}

function newfileselected () {
	var filename = $('#file').val();
	if(filename) {
		$('#lblSelectedFileName').html(filename.substring(filename.lastIndexOf('\\')+1));
		$('#displImageName').val(filename.substring(filename.lastIndexOf('\\')+1));
		$('#uploadFileRemoveLink').removeClass('hidden');
		$('#btnUpld').addClass('hidden');
	} else {
		$('#lblSelectedFileName').html(noFileUpldText);
	}
	$('#lblSelectedFileName').attr('title', filename); 
}
function removeUploadedImage() {
	var control = $("#uploadFile");
	control.replaceWith(control = control.clone(true));
	$('#uploadFileRemoveLink').addClass('hidden');
	$('#btnUpld').removeClass('hidden');
	$('#lblSelectedFileName').html(noFileUpldText);
	$("#displImageName").val('');
	$('#viewAttachment').empty();
}

function uploadFile(strUrl)
{
	$('#uploadMandateImgRef').appendTo('#frmMain');
	$('#uploadMandateImgRef').hide();
	$('textarea,select,input[type="text"],input[type="radio"]').removeAttr("disabled");
	$('#chkNotifyPayer').attr("disabled", false);
	if(!isEmpty($('#displMandateMinAmount').val()))
		$('#displMandateMinAmount').val($('#displMandateMinAmount').autoNumeric('get'));
	if(!isEmpty($('#displMandateMaxAmount').val()))
		$('#displMandateMaxAmount').val($('#displMandateMaxAmount').autoNumeric('get'));
	if(!isEmpty($('#displInvocationAmnt').val()))
		$('#displInvocationAmnt').val($('#displInvocationAmnt').autoNumeric('get'));
	var frm = document.forms["frmMain"];
	frm.enctype = "multipart/form-data";
	frm.encoding = "multipart/form-data";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function enableDisableDebtorRef(mandateBankRef, displMndtDebtorRef, mndtDebtorRef)
{
	if(mandateBankRef == "Y")
	{
		$('#displDebtorReference1').removeAttr('readonly');
		$('#displDebtorReference1').addClass('required');
	}
	else
	{
		$('#displDebtorReference1').attr("readonly", "readonly");
		$('#displDebtorReference1').removeClass('required');
	}
	
	if(displMndtDebtorRef != mndtDebtorRef)
		$('#displDebtorReference').attr("title", mndtDebtorRef);
	else
		$('#displDebtorReference').attr("title", '');

	if (pageMode == "VIEW" || pageMode == "VERIFY")
	{
		$('#displDebtorReference1').removeClass('required');
	}
}

function setTabOrder(strEntityTYpe, mdmInvocationType)
{
	var i = 0;
	if(strEntityTYpe == '0')
	{
//		document.getElementById("requestType").tabIndex = ++i;
//		document.getElementById("requestStatus").tabIndex = ++i;
//		document.getElementById("mandateStatus").tabIndex = ++i;
//		document.getElementById("suspensionEndDate").tabIndex = ++i;
//		document.getElementById("returnReasonCode").tabIndex = ++i;
//		document.getElementById("returnReasonDescription").tabIndex = ++i;
//		i = setMandateDetailsTabOrder(i);
		
	}
	else
	{
//		i = setMandateDetailsTabOrder(i);
//		document.getElementById("mandateStatus").tabIndex = ++i;
//		document.getElementById("suspensionEndDate").tabIndex = ++i;
	}
//	i = setRecurrenceDetailsTabOrder(i);
	if(mdmInvocationType == 'A')
	{
//		i = setInvTypeAutoTabOrder(i);
	}
	else
	{
//		i = setInvTypeManualTabOrder(i);
	}
//	i = setRetryDetailsTabOrder(i);
//	i = setPayerDetailsTabOrder(i);
}

function setMandateDetailsTabOrder(i)
{
//	document.getElementById("clientDesc").tabIndex = ++i;
//	document.getElementById("displMandateDescription").tabIndex = ++i;
//	document.getElementById("displImageRef").tabIndex = ++i;
//	document.getElementById("displDebtorReference").tabIndex = ++i;
//	document.getElementById("displPurposeCode").tabIndex = ++i;
//	document.getElementById("displPurposeDesc").tabIndex = ++i;
//	return i;
}

function setRecurrenceDetailsTabOrder(i)
{
//	document.getElementById("displPackageId").tabIndex = ++i;
//	document.getElementById("displCreditAcctNmbr").tabIndex = ++i;
//	document.getElementById("displEffectiveStartDate").tabIndex = ++i;
//	document.getElementById("displEffectiveEndDate").tabIndex = ++i;
//	document.getElementById("invocationType1").tabIndex = ++i;
//	document.getElementById("invocationType2").tabIndex = ++i;
//	return i;
}

function setInvTypeAutoTabOrder(i)
{
	document.getElementById("displInvocationAmnt").tabIndex = ++i;
	document.getElementById("displHolidayAction").tabIndex = ++i;
	document.getElementById("displInvocationFreq").tabIndex = ++i;
	document.getElementById("displInvocationPeriod").tabIndex = ++i;
	document.getElementById("displFreqRefDay").tabIndex = ++i;
	document.getElementById("chkNotifyPayer").tabIndex = ++i;
	document.getElementById("displNotifyPayerDays").tabIndex = ++i;
	document.getElementById("displNotifyDaysBeforeExp").tabIndex = ++i;
	return i;
}

function setInvTypeManualTabOrder(i)
{
	document.getElementById("displMandatePaymentFreq").tabIndex = ++i;
	document.getElementById("displMandateMinAmount").tabIndex = ++i;
	document.getElementById("displMandateMaxAmount").tabIndex = ++i;
	document.getElementById("mandateMaxTransactions").tabIndex = ++i;
	return i;
}

function setRetryDetailsTabOrder(i)
{
//	document.getElementById("displMandateRetry").tabIndex = ++i;
//	document.getElementById("displMandateRetryCount").tabIndex = ++i;
//	document.getElementById("displMandateRetryInterval").tabIndex = ++i;
//	return i;
}

function setPayerDetailsTabOrder(i)
{
//	document.getElementById("displPayerCode").tabIndex = ++i;
//	document.getElementById("displPayerName").tabIndex = ++i;
//	document.getElementById("displPayerAddress1").tabIndex = ++i;
//	document.getElementById("displPayerAddress2").tabIndex = ++i;
//	document.getElementById("displPayerAddress3").tabIndex = ++i;
//	document.getElementById("displPayerCountry").tabIndex = ++i;
//	document.getElementById("displPayerMobileNumber").tabIndex = ++i;
//	document.getElementById("displPayerEmail").tabIndex = ++i;
//	document.getElementById("displPayerAdditionalInfo").tabIndex = ++i;
//	document.getElementById("displPayerAccountNmbr").tabIndex = ++i;
//	document.getElementById("displPayerAcctCcyCode").tabIndex = ++i;
//	document.getElementById("displPayerAccountType").tabIndex = ++i;
//	document.getElementById("displPayerBankIdType").tabIndex = ++i;
//	document.getElementById("displPayerBankId").tabIndex = ++i;
//	document.getElementById("displBranchDesc").tabIndex = ++i;
//	return i;
}

function disableMandateDetails(requestType)
{
	if(requestType.value == 'F' || requestType.value == 'N' || requestType.value == 'B')
	{
		$('textarea,select,input[type="text"],input[type="radio"]').attr('disabled',true);
		$('#chkNotifyPayer').attr("disabled", true);
		$('#requestType').attr("disabled", false);
		$('#requestStatus').attr("disabled", false);
		$('#mandateStatus').attr("disabled", false);
		$('#displPayerCode').attr("disabled", false);
		$('#displPayerCode').attr("readonly", "readonly");
		$('#mandateStatus, #requestStatus').niceSelect('update');
		$('#mandateUploadImageDiv').hide();
	}
	else
	{
		$('#mandateUploadImageDiv').show();
	}
}

function getCreditAcctDetails()
{
	var strUrl = 'getMandateCreditAcctDetails.formx';
	var strData = {};
	$.blockUI({message : '<div id="loadingMsg"><img src="static/styles/Themes/t7-main/resources/images/T7/loading.gif" style="background-position: left center;"/><span style="vertical-align: text-top; margin-left: 5px;">Loading...</span></div>'});
	strData["packageId"] = $('#displPackageId').val();
	strData["clientCode"] = $('#clientId').val();
	strData[csrfTokenName] = csrfTokenValue;	
	$.post(strUrl, strData, paintAccountDetails, "json");
	return false;
}

function paintAccountDetails(data)
{
	$.unblockUI();	
	document.body.style.cursor = 'default';
	var tokenValue;
	var element;
	var option;
	//tokenValue = data.csrfTokenName;
	if (data.hasOwnProperty("elements"))
	{
		$select = $('#displCreditAcctNmbr');
		$select.find('option').remove().end().append('<option value="">'+getLabel('selectAccount','Select')+'</option>').val('');
 		var	myOptions = data.elements.mapAccountInfo;		 
		if(myOptions != null && myOptions != '' && myOptions != undefined)
		{
			for (i = 0; i < myOptions.length; i++)
			{
				var $option = $('<option value="' + myOptions[i].filterCode + '">' + myOptions[i].filterValue + '</option>');
				$select.append($option);
				$select.niceSelect('update');
			}
		 }
	}
}

function enableFieldsOnChangeOfRequestType()
{
	$('#displMandateDescription').removeAttr("disabled");
	$('#invocationType1').removeAttr("disabled");
	$('#invocationType2').removeAttr("disabled");
	$('#displMandateMinAmount').removeAttr("disabled");
	$('#displMandateMaxAmount').removeAttr("disabled");
	$('#displMandatePaymentFreq').removeAttr("disabled");
	$('#mandateMaxTransactions').removeAttr("disabled");
	$('#displPayerCode').removeAttr("readonly");
	$('#displEffectiveEndDate').removeAttr("disabled");
	$('#displInvocationAmnt').removeAttr("disabled");
	$('#displInvocationFreq').removeAttr("disabled");
	$('#displInvocationPeriod').removeAttr("disabled");
	$('#displFreqRefDay').removeAttr("disabled");
	$('#displPayerAccountNmbr').removeAttr("disabled");
	$('#displPayerAcctCcyCode').removeAttr("disabled");
	$('#displPayerAccountType').removeAttr("disabled");
	$('#displPayerBankIdType').removeAttr("disabled");
	$('#displPayerBankId').removeAttr("disabled");
	$('#displBranchDesc').removeAttr("disabled");
	$('#mandateStatus').removeAttr('disabled');
	$('#suspensionEndDate').removeAttr('disabled');
	$('#returnReasonCode').removeAttr('disabled');
	$('#returnReasonDescription').removeAttr('disabled');
}

function getDiscardConfirmPopUp(strUrl){
	$('#cancelDiscardConfirmMsg').bind('click',function(){
		$('#discardMsgPopup').dialog("close");
	});
	$('#doneConfirmDiscardbutton').bind('click',function(){
		$(this).dialog("close");
		discardProfile(strUrl);
	});
	$('#discardMsgPopup').dialog({
		autoOpen : false,
		maxHeight: 550,
		width : 400,
		modal : true,
		resizable: false,
		draggable: false
	});
	$('#discardMsgPopup').dialog("open");
	$('#textContent').focus();
}
function discardProfile(strUrl){
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	$("input").removeAttr('disabled');
	$("select").removeAttr('disabled');
	if(strEntityTYpe=='1')
	{
		$('#clientDesc').val(strClientDesc);	
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

jQuery.fn.ForceNoSpecialSymbol = function() {
	return this.each(function() {
				$(this).keydown(function(event) {
					var key = event.charCode || event.keyCode || 0;
					// allow backspace, tab, delete, numbers
					// keypad numbers, letters ONLY
					if (window.event) { // IE
						key = event.keyCode;
					}
					if (event.which) { // Netscape/Firefox/Opera
						key = event.which;
					}
					if ((event.shiftKey )&&( key == 35 ||  key == 36 ||key == 37 || key == 39 || key == 9)) {
						return true;
					}
					else if(event.shiftKey){
						return false;
					}
					return (key == 8 || key == 9 || key == 46 || key == 190
							|| (key >= 35 && key <= 40)
							|| (key >= 48 && key <= 57)
							|| (key >= 96 && key <= 105) || (key >= 65 && key <= 90));
				})
			})
};

function clientChange(frmId) 
{
	$("#displEffectiveStartDate").val('');
	var frm = document.getElementById(frmId);
	frm.action = "addMandate.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}