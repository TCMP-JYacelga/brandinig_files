/**
 * The strPaymentInstrumentIde is used to hold the instrument identifier
 */
var strPaymentInstrumentIde = null;
var isControlTotalMandatory = false;
var paymentResponseInstrumentData = null;
var strReceiverType = null, strOrderingPartyType = 'R', isAdhocReceiverAllowed = false, isAdhocOrderingPartyAllowed = false;
var strPaymentAdditionalInfoData = null;
var strAccountBalanceData = null;
var arrTemplateUsersInst = [];
var debitAccountLvl = 'I';
var paymentApprovalStructureData = {};
var strSecCode = null;
var strInfoCallFrom = "HEADER";
var blnAddendaDisclaimerVisibiliity = false, blnTransDisclaimerVisibiliity = false;
var objApiEnrichmentType ={};
var objWhtDetails = null;
var strTxnDate = null;
var strOldAnyIdFalg = null;
var anyIdMismatchMsgCloseBtnA = 'N';
var anyIdMismatchMsgCloseBtnR = 'N';
var canAnyIdProductCheck = true;
var countdownInstTimerVal = null;
var isInstCutOff = false ;
var instRowIndex = 0;
var cutoffProductList = null ;
var txnWizardProduct = null ;
var txnWizardProductDesc = null ;
function getReceiverUrl(strProduct, charPaymentType) {
	var strUrl = 'services/recieverseek';
	var productLevel = null;
	if (!isEmpty(strProduct))
		strUrl += '/' + strProduct;
	if(paymentResponseInstrumentData
		&& paymentResponseInstrumentData.d
		&& paymentResponseInstrumentData.d.paymentEntry
		&& paymentResponseInstrumentData.d.paymentEntry.paymentHeaderInfo
		&& paymentResponseInstrumentData.d.paymentEntry.paymentHeaderInfo.productLevel){
			productLevel = paymentResponseInstrumentData.d.paymentEntry.paymentHeaderInfo.productLevel;
	}
	if(null != productLevel
		&& productLevel === 'I'
		&& charPaymentType === "B"){
		if ($('#bankProduct').val() != '') {
			strUrl += "/" + $('#bankProduct').val() + ".json"
		}
	}
	else if ($('#bankProduct' + (charPaymentType === "B" ? 'Hdr' : '')).val() != '') {
		strUrl += "/"
				+ $('#bankProduct' + (charPaymentType === "B" ? 'Hdr' : ''))
						.val() + ".json"
	} else {
		strUrl += ".json";
	}
		strUrl += '?$top=-1';
	return strUrl;
}
jQuery.fn.ReceiverAutoComplete = function(strProduct, strBankProduct,
		charPaymentType, isRegistered) {
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				$.ajax({
							url : getReceiverUrl(strProduct,charPaymentType),
							dataType : "json",
							data : {
								qfilter : request.term,
								anyIdFlag : paymentResponseInstrumentData.d.paymentEntry.paymentMetaData.anyIdPaymentFlag 
											? paymentResponseInstrumentData.d.paymentEntry.paymentMetaData.anyIdPaymentFlag
											: "N"
							},
							success : function(data) {
								if (data && data.d && data.d.receivers) {
									var rec = data.d.receivers;
									response($.map(rec, function(item) {
												return {
													label : item.receiverName,
													value : item.receiverDesc,
													beneCode : item.receiverCode,
													receiverId : item.receiverIdentifier,
													details : item
												}
											}));
								} else{
									if($("#drawerDescriptionA,#drawerDescriptionR").hasClass("ui-corner-top")){
										$("#drawerDescriptionA,#drawerDescriptionR").removeClass("ui-corner-top").addClass("ui-corner-all");
										$(".ui-menu").hide();
									}
								}
								$("#drawerDescriptionR").focus();
								$("#drawerDescriptionR").val('');
								setBeneDetailsOnReceiverChange({
									details : {}
								});
							}
						});
			},
			focus: function( event, ui ) {
                $(".ui-autocomplete > li").attr("title", ui.item.label);
            },
			minLength : 1,
			select : function(event, ui) {
				if (ui.item) {
					var _strBankProduct = $('#bankProduct').val();
					var beneData = ui.item;
					// TODO : To be handled
					if (isRegistered !== true)
						toggleReceiver('R', true);
					if (!isEmpty(charPaymentType)) {
						if(strLayoutType === 'TAXLAYOUT'){
						if (charPaymentType === 'Q')
							refreshPaymentFieldsOnBeneChange(strMyProduct,
									_strBankProduct, beneData.beneCode);
						else if (charPaymentType === 'B')
							refreshPaymentBatchInstrumentFieldsOnBeneChange(
									_strBankProduct, beneData.beneCode);
						}
						applyControlFieldsValidation(strPaymentType);			
					}
					/**
					 * This is used when products supports both Registered/Adhoc
					 * Receiver, othere wise it will shows Registered Receiver
					 * as default
					 */
					
					$('.adhocReceiver').addClass('hidden');
					toggleRegisteredReceiverMoreDetails(beneData.beneCode);
					setBeneDetailsOnReceiverChange(beneData);
					anyIdToggle(ui.item.details.anyIdFlag,"R");
					if(ui.item.details.anyIdFlag == "Y")
					{
						populateAnyIdDetails("R");						
					}
				}
				$("#drawerDescriptionR").focus();
			},
			change : function() {
				if ($('#drawerDescriptionR').attr('oldValue') && ($('#drawerDescriptionR').attr('oldValue') !== $('#drawerDescriptionR')
						.val())) {
					setBeneDetailsOnReceiverChange({
								details : {}
							});
				}
			},
			open : function() {
				$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
			},
			close : function() {
				$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
				$("#drawerDescriptionR").focus();
			}
		});/*.data("autocomplete")._renderItem = function(ul, item) {
			var val = item.beneCode;
			if (strLayoutType === 'TAXLAYOUT') {
				val = '';
			}
			var inner_html = '<a><ol class="t7-autocompleter"><ul>' + val
					+ '</ul>'+(val=='' ? '' : '|')+' <ul>'+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});

};

jQuery.fn.PaymentLocationAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				$.ajax({
							url : 'services/userseek/paymentLocation.json',
							dataType : "json",
							data : {
								top : -1,
								$autofilter : request.term,
								$filtercode1 : $('#bankProduct').val()
							},
							success : function(data) {
								if (data && data.d && data.d.preferences) {
									var rec = data.d.preferences;
									response($.map(rec, function(item) {
												return {
													label : item.CODE+':'+item.DESCRIPTION,
													details : item
										}
									}));
								}
								else{
									if($(this).hasClass("ui-corner-top")){
										$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
										$(".ui-menu").hide();
									}
								}
								$("#payLocation").val('');
								$(this).focus();
							}
						});
			},
			focus: function( event, ui ) {
                $(".ui-autocomplete > li").attr("title", ui.item.label);
            },
			minLength : 1,
			select : function(event, ui) 
			{
				if (ui.item)
				{
					$("#payLocation").val(ui.item.details.CODE);
					$(this).attr('oldValue',ui.item.label);
				}
			},
			change : function() {
				if ($(this).attr('oldValue') && ($(this).attr('oldValue') !== $(this).val()))
				{
					$("#payLocation").val('');
					$(this).val('');
				}
			},
			open : function() {
				$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
			},
			close : function() {
				$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
				$(this).focus();
			}
		});
		$(this).on('blur',function(){
			if(!$('.ui-autocomplete.ui-widget:visible').length) {
				if ($('#payLocation').val() == '')
			 	{  
					$(this).val('');
			 	}				
				if ($(this).val() == '')
				{
					$('#payLocation').val('');
				}
			}
			else
			{
				$(this).focus();
			}
		});
	});
};

jQuery.fn.PrintBranchAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				$.ajax({
							url : 'services/userseek/printBranch.json',
							dataType : "json",
							data : {
								top : -1,
								$autofilter : request.term
							},
							success : function(data) {
								if (data && data.d && data.d.preferences) {
									var rec = data.d.preferences;
									response($.map(rec, function(item) {
												return {
													label : item.DESCRIPTION,
													details : item
										}
									}));
								}
								else{
									if($(this).hasClass("ui-corner-top")){
										$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
										$(".ui-menu").hide();
									}
								}
								$("#printBranch").val('');
								$(this).focus();
								onChangePrintBranch();
							}
						});
			},
			focus: function( event, ui ) {
                $(".ui-autocomplete > li").attr("title", ui.item.label);
            },
			minLength : 1,
			select : function(event, ui) 
			{
				if (ui.item)
				{
					$("#printBranch").val(ui.item.details.CODE);
					$(this).attr('oldValue',ui.item.label);
					onChangePrintBranch();
				}
			},
			change : function() {
				if ($(this).attr('oldValue') && ($(this).attr('oldValue') !== $(this).val()))
				{
					$("#printBranch").val('');
					$(this).val('');
					onChangePrintBranch();
				}
			},
			open : function() {
				$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
			},
			close : function() {
				$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
				$(this).focus();
			}
		});
		$(this).on('blur',function(){
			if(!$('.ui-autocomplete.ui-widget:visible').length) {
				if ($('#printBranch').val() == '')
			 	{  
					$(this).val('');
			 	}
				if ($(this).val() == '')
				{
					$('#printBranch').val('');
				}
			}
			else
			{
				$(this).focus();
			}
		});
	});
};

function setBeneDetailsOnReceiverChange(objBeneDtl) {
	
	
		$('#drawerCodeR').val(objBeneDtl.beneCode || '');
		$('#drawerDescriptionR').val(objBeneDtl.value || '');
		$('#drawerDescriptionR').attr('oldValue',objBeneDtl.value || '');
	if(strSecCode === 'RCK')
	{
		$('#receiverIDRDiv').addClass('hidden');
	}	
		$('#receiverIDR').val(objBeneDtl.details.receiverIdentifier || '');
		$('#drawerMail_RInfoLbl').html(objBeneDtl.details.email || '');
		$('#drawerMailR').val(objBeneDtl.details.email || '');
		$('#receiverCodeR').val(objBeneDtl.details.drawerCode || '');
	if(strSecCode === 'XCK')
	{
		$('#receiverIDRDiv').addClass('hidden');
		$('#drawerDescriptionR').addClass('hidden');
	}
	$('#drawerAccountNo_RInfoLbl').html(objBeneDtl.details.accountNumber || '');
	$('#drawerAccountNoR').val(objBeneDtl.details.accountNumber || '');
	$('#beneficiaryBankIDCode_RInfoLbl')
			.html(objBeneDtl.details.bankCode || '');
			
	if(objBeneDtl.details.anyIdFlag == "Y")
	{
		$('#anyIdTypeR').val(objBeneDtl.details.anyIdType || '');
		$('#anyIdValueR').val(objBeneDtl.details.anyIdValue || '');
	}	
    else
	{
		$('#beneficiaryBankIDCodeR').val(objBeneDtl.details.bankCode || '');
		$('#beneficiaryBankIDTypeR').val(objBeneDtl.details.bankType || '');
	}
		
	if(strLayoutType !== 'TAXLAYOUT'){
		/**
		 * This will work in case screen repaint is not called on change of the
		 * receiver
		 */
		/*Text Only value population start */
		$('.drawerMailR_InstView').html(objBeneDtl.details.email || '');
		$('.receiverCodeR_InstView').html(objBeneDtl.details.drawerCode || '');
		if(strSecCode === 'RCK' || strSecCode === 'XCK')
		{
			if(strSecCode === 'XCK')
				$('#drawerDescriptionR').addClass('hidden');
			$('#drawerMailRDIV').addClass('hidden');
		}	
		$('.drawerAccountNoR_InstView').html(objBeneDtl.details.accountNumber || '');
		$('.beneAccountTypeR_InstView').html(objBeneDtl.details.accountType || '');
		$('.drawerCurrencyR_InstView').html(objBeneDtl.details.receiverCcy || '');
		$('.beneficiaryBranchDescriptionR_InstView').html(objBeneDtl.details.adhocBrnchdesc || '');
		if(objBeneDtl.details.anyIdFlag == "Y")
		{
			$('.anyIdTypeR_InstView').html(objBeneDtl.details.anyIdTypeDesc || '');			
			$('.anyIdValueR_InstView').html(objBeneDtl.details.anyIdValue || '');
			
		}	
		else
		{
			$('.beneficiaryBankIDTypeR_InstView').html(objBeneDtl.details.bankType || '');			
			$('.beneficiaryBankIDCodeR_InstView').html(objBeneDtl.details.bankCode || '');
		}
		if(null!=objBeneDtl.details.bankType && "IBAN National ID"==objBeneDtl.details.bankType)
		{
			//$('#ibanDivR').show();
			$('#bankIdDiv').hide();
			$('#bankBranchNameDiv').hide();
			$('.ibanR_InstView').html(objBeneDtl.details.iban || '');
			$('#beneficiaryBankIDCodeRDiv').hide();
		}
		else
		{
			$('#bankIdDiv').show();
			$('#bankBranchNameDiv').show();
			$('#beneficiaryBankIDCodeRDiv').show();
			//$('#ibanDivR').hide();
		}
		$('.drawerAddress1R_InstView').html(objBeneDtl.details.address1 || '');
		$('.drawerAddress2R_InstView').html(objBeneDtl.details.address2 || '');
		$('.drawerAddress3R_InstView').html(objBeneDtl.details.address3 || '');
		
		$('.corrBankIdTypeR_InstView').html(objBeneDtl.details.corrBankIdType || '');
		$('.corrBankIDCodeR_InstView').html(objBeneDtl.details.corrBankBic || '');
		$('.corrBankDetails1R_InstView').html(objBeneDtl.details.corrBankDetails1 || '');
		$('.corrBankDetails2R_InstView').html(objBeneDtl.details.corrBankDetails2 || ''); 
		$('.corrBankDetails3R_InstView').html(objBeneDtl.details.corrBankDetails3 || ''); 
		$('.corrBankDetails4R_InstView').html(objBeneDtl.details.corrBankDetails4 || ''); 
		$('.corrBankNostroAccR_InstView').html(objBeneDtl.details.corrNostroAccount || ''); 
		
		$('.intBankIDTypeR_InstView').html(objBeneDtl.details.interBankType || '');
		$('.intBankIDCodeR_InstView').html(objBeneDtl.details.interBankBic || '');
		$('.intBankDetails1R_InstView').html(objBeneDtl.details.interBankDetails1 || '');
		$('.intBankDetails2R_InstView').html(objBeneDtl.details.interBankDetails2 || ''); 
		$('.intBankDetails3R_InstView').html(objBeneDtl.details.interBankDetails3 || ''); 
		$('.intBankDetails4R_InstView').html(objBeneDtl.details.interBankDetails4 || ''); 
		$('.intBankNostroAccR_InstView').html(objBeneDtl.details.corrNostroAccount || '');
		
		$('.rBankAddress1R_InstView').html(objBeneDtl.details.bankAddress1 || '');
		$('.rBankAddress2R_InstView').html(objBeneDtl.details.bankAddress2 || '');
		$('.rBankAddress3R_InstView').html(objBeneDtl.details.bankAddress3 || '');
		$('.drawerCellNoR_InstView').html(objBeneDtl.details.mobileNumber || '');
		
		/*Text Only value population ends */
	}
	$('#receiverLeiTypeR').val(objBeneDtl.details.receiverLeiType || '');
	$('#receiverLeiCodeR').val(objBeneDtl.details.receiverLeiCode || '');		
	$('.receiverLeiCodeR_InstView').html(objBeneDtl.details.receiverLeiCode || '');
	if(null != objBeneDtl.details.receiverLeiType && "I" == objBeneDtl.details.receiverLeiType){
		$('.receiverLeiTypeR_InstView').html(getLabel('receiverLeiType.'+objBeneDtl.details.receiverLeiType ,'Individual' ));
		$(".receiverLeiCodeR_InstViewDiv").addClass('hidden');
	}
	else if(null != objBeneDtl.details.receiverLeiType && "C" == objBeneDtl.details.receiverLeiType){
		$('.receiverLeiTypeR_InstView').html(getLabel('receiverLeiType.'+objBeneDtl.details.receiverLeiType ,'Corporate' ));
		$(".receiverLeiCodeR_InstViewDiv").removeClass('hidden');
	}
	
	checkIfAdhocReceiverAllowed();
}
function checkIfAdhocReceiverAllowed()
{
	if (isAdhocReceiverAllowed === false && isEmpty($('#drawerDescriptionR').val())) {
		var arrError = [];
		arrError.push({
					"errorCode" : "WARNING",
					"errorMessage" : getLabel('advocReceiverNtAlwd', 'Adhoc receiver not allowed!')
				});
		paintErrors(arrError);
	}else{
		doClearMessageSection();
	}
}
function getAccountsUrl(strPmtType) {
	var strPostFix = strPmtType === 'B' ? 'Hdr' : '';
	var strTempType = $('input[name="templateType' + strPostFix
			+ '"]:radio:checked').val();
	strTempType = strTempType ? strTempType : '1';
	if (strEntryType && strEntryType === 'TEMPLATE' && strTempType
			&& strTempType === '1') {
		return "services/userseek/clientAccountNonRepSeek.json";
	} else
		return "services/userseek/clientAccountSeek.json";
}
jQuery.fn.ReceivingAccountAutoComplete = function(strPmtType) {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : getAccountsUrl(strPmtType),
									dataType : "json",
									data : {
										$autofilter : request.term,
										$filtercode1 : $('#accountNo').val(),
										$infilter : getMultipleAccounts(strPmtType)
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {
														label : item.DESCRIPTION,
														value : item.CODE,
														bankDtl : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						if (data) {
							displayFiInfoForRecevingAccount(data, false);
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
			var inner_html = '<a><ol class="t7-autocompleter"><ul>'
					+ item.value + '</ul><ul>' + item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};
function getMultipleAccounts(strPmtType){
	var strPostFix = strPmtType === 'B' ? 'Hdr' : '';
	var arrAccts = $('#accountNo'+strPostFix).val();
	var ret = '';
	if(arrAccts && arrAccts.length > 0){
		for(i=0; i< arrAccts.length; i++){
			ret+=arrAccts[i];
			if(i < arrAccts.length -1){
				ret+=',';
			}
		}
			return ret;
	}
	return "___";
}
jQuery.fn.OrderingPartyAutoComplete = function(strProduct, isRegistered) {
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				$.ajax({
							url : "services/orderingparty/" + strProduct
									+ ".json?$top=10",
							dataType : "json",
							data : {
								$autofilter : request.term
							},
							success : function(data) {
								var rec = data;
								if (rec) {
									if (rec.length > 0 && rec[0].code != '') {
										response($.map(rec, function(item) {
												return {
													label : item.description,
													value : item.code,
													data : item
												}
											}));
									}
								} else {
									if ($("#orderingPartyDescription_OA").hasClass("ui-corner-top")) {
										$("#orderingPartyDescription_OA").removeClass("ui-corner-top").addClass("ui-corner-all");
										$(".ui-menu").hide();
									}
								}
								$("#orderingPartyDescription").val('');
								$('#orderingPartyMoreDetailsLink').unbind('click');
                                $('#orderingPartyMoreDetailsLink').bind('click', function() {
                                    if ($("#plusIconA").hasClass('fa-plus')) {
                                        $('#registeredOrderingPartyDetails').removeClass('hidden');
                                        $("#plusIconA").removeClass('fa-plus');
                                        $("#plusIconA").addClass('fa-minus');
                                        doClearMoreDetailsForRegisteredOrderingParty();
                                    } else if ($("#plusIconA").hasClass('fa-minus')) {
										$('#registeredOrderingPartyDetails').addClass('hidden');
										$("#plusIconA").removeClass('fa-minus');
										$("#plusIconA").addClass('fa-plus');
									}
                                });
							}
						});
			},
			minLength : 1,
			focus: function( event, ui ) {
				$(".ui-autocomplete > li").attr("title", ui.item.value+" | "+ui.item.label);
			},
			select : function(event, ui) {
				var strDetails = '';
				if (ui.item.value) {
					var ctrl = $('#orderingPartyMoreDetailsLink');
					if ($("#plusIconA").hasClass('fa-minus')) {
						$('#registeredOrderingPartyDetails').addClass('hidden');
						$("#plusIconA").removeClass('fa-minus');
						$("#plusIconA").addClass('fa-plus');
					}
					//ctrl.text(getLabel('additionalDetails', 'Contact Info'));
					ctrl.unbind('click');
					ctrl.bind('click', function() {
								doPaintMoreDetailsForRegisteredOrderingParty(
										ui.item.value,
										'registeredOrderingPartyDetails', false);
							});
					$('#orderingPartyLbl').val(ui.item.label);
					$('#orderingParty').val(ui.item.value);
					$('#orderingPartyDescription').val(ui.item.label);
					$('#emailIdNmbr').val(ui.item.data.additionalInfo.EMAIL ||'');
					$("#emailIdNmbr_ORInfoLbl").text(ui.item.data.additionalInfo.EMAIL||'');
					if (isRegistered !== true)
						toggleOrderingParty('R', true);
					doClearMessageSection();
					if (isAdhocOrderingPartyAllowed === false && isEmpty(ui.item.label)) {
								var arrError = [];
								arrError.push({
											"errorCode" : "WARNING",
											"errorMessage" : getLabel('advocOrderingPartyNtAlwd', 'Adhoc ordering party not allowed!')
										});
								paintErrors(arrError);
								$('#orderingPartyDescription').val('');
					}
					$('#orderDescription_ORInfoLbl').text(ui.item.label);
					// $('#emailIdNmbr_ORInfoLbl').text(ui.item.details.);
					$('.adhocOrderingParty').addClass('hidden');
					$('.registeredOrderingParty').removeClass('hidden');
					$('#orderingPartyDescription').focus(); 
				}
			},
			change : function(event, ui) {
				if (ui.item === null) {
					doClearMessageSection();
					doClearMoreDetailsForRegisteredOrderingParty();
					var ctrl = $('#orderingPartyMoreDetailsLink');
					if (isAdhocOrderingPartyAllowed === false && !isEmpty($('#orderingPartyDescription').val())) {
							var arrError = [];
							arrError.push({
										"errorCode" : "WARNING",
										"errorMessage" : getLabel('advocOrderingPartyNtAlwd', 'Adhoc ordering party not allowed!')
									});
							paintErrors(arrError);
							$('#orderingPartyDescription').val('');
						}
					//ctrl.text('Contact Info');
					$("#plusIconA").removeClass('fa-minus');
					$("#plusIconA").addClass('fa-plus');
					$('#registeredOrderingPartyDetails').addClass('hidden');
				}
			},
			open : function() {
				$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
			},
			close : function() {
				$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
			}
		});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="t7-autocompleter"><ul>'
					+ item.value + '</ul><ul>' + item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

jQuery.fn.ContractRefNoAutoComplete = function(buyCcy, sellCcy) {
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				var txnDate = null;
				if(strPaymentType && strPaymentType == 'BATCHPAY' && paymentResponseHeaderData && paymentResponseHeaderData.d 
						&& paymentResponseHeaderData.d.paymentEntry 
						&& paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.dateLevel=='B')
				{
					txnDate = $('#txnDateHdr').val();
				}
				else
				{
					txnDate = $('#txnDate').val();
				}
				$.ajax({
							url : "services/contractrefseek/" + sellCcy + "/"
									+ buyCcy + ".json?$top=-1",
							dataType : "json",
							data : {
								qfilter : request.term,
								txnDate : txnDate
							},
							success : function(data) {
								var rec = data;
								response($.map(rec, function(item) {
											return {
												label : item.description,
												value : item.code,
												rate  : item.additionalInfo ? item.additionalInfo['RATE'] : ''
											}
										}));
							}
						});
			},
			minLength : 1,
			select : function(event, ui) {
				if(!isEmpty(ui.item.rate)) {
					$('#contractFxLabel,#contractFxHdrLabel').text(ui.item.rate);
					$('#contractRefNo,#contractRefNoHdr').val(ui.item.value);
					handleAmountCcyChange();
				}
				// log(ui.item ? "Selected: " + ui.item.label + " -show lbl:"
				// + ui.item.lbl : "Nothing selected, input was "
				// + this.value);
			},
			open : function() {
				$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
			},
			close : function() {
				$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
			},
			blur : function() {
				if (isEmpty($(this).val()))
					{
						$('#contractFxLabel').val('');
						$('#contractFxLabel').text('');
			}
			}
		});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="t7-autocompleter"><ul>'
					+ item.value + '</ul><ul>' + item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	})
};
jQuery.fn.CountryAutoComplete = function(chrBeneType) {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/country.json?$top=10",
									dataType : "json",
									data : {
										$autofilter : request.term
									},
									success : function(data) {
										var rec = data.d.preferences;
										$('#benCountry_OA').attr('optionSelected',false);
										response($.map(rec, function(item) {
													return {
														label : item.DESCRIPTION,
														value : item.CODE
													}
												}));
									}
								});
					},
					minLength : 1,
					focus: function( event, ui ) {
						$(".ui-autocomplete > li").attr("title", ui.item.value+" | "+ui.item.label);
					},
					select : function(event, ui) {
						if (chrBeneType === 'B')
							$('#beneficiaryCityA, #beneficiaryStateA').val('');
						else if (chrBeneType === 'O')
							$('#benCityAOP, #benStateAOP').val('');
						else if(chrBeneType == null && chrBeneType == '')
							$("#benCountry_OA").val(ui.item.value);
						$('#benCountry_OA').attr('optionSelected',true);
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
			var inner_html = '<a><ol class="t7-autocompleter"><ul>'
					+ item.value + '</ul><ul>' + item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};
jQuery.fn.StateAutoComplete = function(chrBeneType) {
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				var strUrl = "services/userseek/state.json?$top=10";
				if (chrBeneType === 'B') {
					if (!isEmpty($('#beneficiaryCountryA').val())) {
						strUrl += '&$filtercode1='
								+ $('#beneficiaryCountryA').val();
					} else
						return false;
				} else if (chrBeneType === 'O') {
					if (!isEmpty($('#benCountry_OA').val())) {
						strUrl += '&$filtercode1=' + $('#benCountry_OA').val();
					} else
						return false;
				}
				$.ajax({
							url : strUrl,
							dataType : "json",
							data : {
								$autofilter : request.term
							},
							success : function(data) {
								var rec = data.d.preferences;
								response($.map(rec, function(item) {
											return {
												label : item.DESCRIPTION,
												value : item.CODE
											}
										}));
							}
						});
			},
			minLength : 1,
			focus: function( event, ui ) {
				$(".ui-autocomplete > li").attr("title", ui.item.value+" | "+ui.item.label);
			},
			select : function(event, ui) {
				if (chrBeneType === 'B')
					$('#beneficiaryCityA').val('');
				else if (chrBeneType === 'O')
					$('#benCityAOP').val('');
			},
			open : function() {
				$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
			},
			close : function() {
				$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
			}
		});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="t7-autocompleter"><ul>'
					+ item.value + '</ul><ul>' + item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};
jQuery.fn.AdhocReceiverCityAutoComplete = function(chrBeneType) {
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				var strUrl = "services/userseek/city.json?$top=10";
				if (chrBeneType === 'B') {
					if (!isEmpty($('#beneficiaryCountryA').val())
							&& !isEmpty($('#beneficiaryStateA').val())) {
						strUrl += '&$filtercode1='
								+ $('#beneficiaryCountryA').val()
								+ '&$filtercode2='
								+ $('#beneficiaryStateA').val();
					} else
						return false;
				} else if (chrBeneType === 'O') {
					if (!isEmpty($('#benCountryAOP').val())
							&& !isEmpty($('#benStateAOP').val())) {
						strUrl += '&$filtercode1=' + $('#benCountryAOP').val()
								+ '&$filtercode2=' + $('#benStateAOP').val();
					} else
						return false;
				}
				$.ajax({
							url : strUrl,
							dataType : "json",
							data : {
								$autofilter : request.term
							},
							success : function(data) {
								var rec = data.d.preferences;
								response($.map(rec, function(item) {
											return {
												label : item.DESCRIPTION,
												value : item.CODE
											}
										}));
							}
						});
			},
			minLength : 1,
			select : function(event, ui) {
			},
			open : function() {
				$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
			},
			close : function() {
				$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
			}
		}).data("autocomplete")._renderItem = function(ul, item) {
			var titleText= item.value + ' | '+item.label ;
			var inner_html = '<a title="'+titleText+'"><ol class="t7-autocompleter"><ul>'
					+ item.value + '</ul> | <ul>' + item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};
	});
};

jQuery.fn.PaymentCcyAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/paymentccy.json",
									dataType : "json",
									data : {
										$autofilter : request.term
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {
														label : item.DESCRIPTION ? item.DESCRIPTION : item.DESCR,
														value : item.CODE
													}
												}));
									}
								});
					},
					minLength : 1,
					focus: function( event, ui ) {
						$(".ui-autocomplete > li").attr("title", ui.item.value+" | "+ui.item.label);
					},
					select : function(event, ui) {
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
			var inner_html = '<a><ol class="t7-autocompleter"><ul>'
					+ item.value + '</ul> | <ul>' + item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

var urlBank = "services/userseek/drawerbank.json";
jQuery.fn.BankIdAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				var urlDrawerBank = "services/userseek/drawerbank.json";
				populateBeneficiaryBankIDType();
				$.ajax({
							url : urlDrawerBank,
							dataType : "json",
							data : {
								$autofilter : request.term,
								$filtercode1 : getDisabledFieldValue($('#beneficiaryBankIDTypeA')),
								$filtercode2 : achSeccode == 'IAT'? '' : strPaymentCategory,
								$top : autocompleterSize
							},
							success : function(data) {
								var rec = data.d.preferences;
								response($.map(rec, function(item) {
											return {
												label : item.ROUTINGNUMBER+' | '+item.BRANCHDESCRIPTION,
												value : item.ROUTINGNUMBER
														? item.ROUTINGNUMBER
														: '',
												bankDtl : item
											}
										}));
							}
						});
			},
			focus: function( event, ui ) {
                $(".ui-autocomplete > li").attr("title", ui.item.label);
            },
			minLength : 1,
			select : function(event, ui) {
				var data = ui.item.bankDtl;
				if (data) {
					if (!isEmpty(data.ROUTINGNUMBER))
						$('#beneficiaryBankIDCodeA').val(data.ROUTINGNUMBER);
					$("#beneficiaryBankIDCodeAutoCompleter").attr("title", data.ROUTINGNUMBER);
					if (!isEmpty(data.BANKCODE))
						$('#drawerBankCodeA').val(data.BANKCODE);
					if (!isEmpty(data.BRANCHCODE))
						$('#drawerBranchCodeA').val(data.BRANCHCODE);
					if (data.BANKDESCRIPTION && data.BRANCHDESCRIPTION) {
						$("#beneficiaryBankIDCodeAutoCompleter")
								.val(data.BANKDESCRIPTION);
						$("#beneficiaryBranchDescriptionA")
								.val(data.BRANCHDESCRIPTION);
					} else {
						if (data.BANKDESCRIPTION)
							$("#beneficiaryBankIDCodeAutoCompleter")
									.val(data.BANKDESCRIPTION);
						if (data.BRANCHDESCRIPTION)
							$("#beneficiaryBranchDescriptionA")
									.val(data.BRANCHDESCRIPTION);
					}
					$("#beneficiaryBranchDescriptionA").attr("title", data.BRANCHDESCRIPTION);
					$('#rBankAddress1A,#rBankAddress2A,#rBankAddress3A').val('');
					$('#rBankAddress1A,#rBankAddress2A,#rBankAddress3A').removeClass("disabled");	
					$('#rBankAddress1A,#rBankAddress2A,#rBankAddress3A').attr('disabled',false);
					if (!isEmpty(data.ADDRESS) && data.ADDRESS!= undefined)//
					{
						$('#rBankAddress1A').val(data.ADDRESS.substring(0,35));
						$('#rBankAddress1A').attr('disabled',true);				
						$('#rBankAddress1A').addClass("disabled");	
						$('#rBankAddress2A').val(data.ADDRESS.substring(35,70));
						$('#rBankAddress2A').attr('disabled',true);				
						$('#rBankAddress2A').addClass("disabled");
						$('#rBankAddress3A').val(data.COL1);	
						$('#rBankAddress3A').attr('disabled',true);				
						$('#rBankAddress3A').addClass("disabled");
					}
					
					$('.noInfoFound').remove();
				}
				doBankIDValidation(true);
			},
			open : function() {
				$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
			},
			close : function() {
				$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
			}
		});/*.data("autocomplete")._renderItem = function(ul, item) {
			var titleText= item.value + ' | '+item.label ;
			var inner_html = '<a title="'+titleText+'"><ol class="t7-autocompleter"><ul">'
					+ item.value +' | '+' <ul">' + item.label + '</ul"></ul"></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
		$(this).on('blur',function(){
			if(!$('.ui-autocomplete.ui-widget:visible').length) {
				if (isEmpty($('#beneficiaryBankIDCodeAutoCompleter').val())
						|| ($('#beneficiaryBankIDCodeAutoCompleter').val() !== $('#beneficiaryBankIDCodeA').val())) {
					$('#drawerBankCodeA, #drawerBranchCodeA,#beneficiaryBankIDCodeA,#beneficiaryBranchDescriptionA')
							.val('');// #beneficiaryBankIDCodeA
					$("#beneficiaryAdhocbankFlag").val('A');
					$("#beneficiaryBankIDCodeA")
							.val($("#beneficiaryBankIDCodeAutoCompleter").val());// beneficiaryBankDescriptionA
					$('#rBankAddress1A,#rBankAddress2A,#rBankAddress3A').val('');
					$('#rBankAddress1A,#rBankAddress2A,#rBankAddress3A').removeClass("disabled");	
					$('#rBankAddress1A,#rBankAddress2A,#rBankAddress3A').attr('disabled',false);
				}
				if(!isEmpty($('#beneficiaryBankIDCodeAutoCompleter').val()))
					doBankIDValidation(true);
			}
			else
			{
				$(this).focus();
			}
		});
	});
};
jQuery.fn.CorrBankIdAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/drawerbank.json?$top=20",
									dataType : "json",
									data : {
										$autofilter : request.term,
										$filtercode1 : $('#corrBankIdTypeA').val() ? $('#corrBankIdTypeA').val() :'BIC',
										$filtercode2 : achSeccode == 'IAT'? '' : strPaymentCategory
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {
														label : item.ROUTINGNUMBER+' | '+item.BRANCHDESCRIPTION,
														value : item.ROUTINGNUMBER,
														bankDtl : item
													}
												}));
									}
								});
					},
					focus: function( event, ui ) {
		                $(".ui-autocomplete > li").attr("title", ui.item.label);
		            },
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						if (data) {
							if (!isEmpty(data.BANKCODE))
							{
								$('#corrBankIDDescA').val(data.BRANCHCODE);
								$('#corrBankDetails1A').val(data.BRANCHDESCRIPTION);
						}
							
							if (!isEmpty(data.ADDRESS) && data.ADDRESS!= undefined)//
							{
								$('#corrBankDetails2A').val(data.ADDRESS.substring(0,34));
								$('#corrBankDetails2A').attr('disabled',true);				
								$('#corrBankDetails2A').addClass("disabled");
								$('#corrBankDetails3A').val(data.ADDRESS.substring(34,69));
								$('#corrBankDetails3A').attr('disabled',true);				
								$('#corrBankDetails3A').addClass("disabled");
								$('#corrBankDetails4A').val(data.COL1);	
								$('#corrBankDetails4A').attr('disabled',true);				
								$('#corrBankDetails4A').addClass("disabled");
							}
							else
							{
								$('#corrBankDetails2A,#corrBankDetails3A,#corrBankDetails4A').val("");	
								$('#corrBankDetails2A,#corrBankDetails3A,#corrBankDetails4A').removeClass("disabled");	
								$('#corrBankDetails2A,#corrBankDetails3A,#corrBankDetails4A').attr('disabled',false);
							}
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
			var inner_html = '<a><ol class="t7-autocompleter"><ul>'
					+ item.value + '</ul><ul>' + item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul).attr('title',item.value+' '+item.label);
		};*/
		
		$(this).on('blur',function(){
			if(!$('.ui-autocomplete.ui-widget:visible').length) {
				if (isEmpty($('#corrBankIDCodeA').val()) ) {
					$('#corrBankDetails1A,#corrBankDetails2A,#corrBankDetails3A,#corrBankDetails4A').val("");	
					$('#corrBankDetails1A,#corrBankDetails2A,#corrBankDetails3A,#corrBankDetails4A').removeClass("disabled");	
					$('#corrBankDetails1A,#corrBankDetails2A,#corrBankDetails3A,#corrBankDetails4A').attr('disabled',false);
				}
			}
			else
			{
				$(this).focus();
			}
		});
	});
};
jQuery.fn.IntBankIdAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				$.ajax({
							url : urlBank,
							dataType : "json",
							data : 
							{
								$top:autocompleterSize,
								$autofilter : request.term,
								$filtercode1 : $('#intBankIDTypeA').val() ? $('#intBankIDTypeA').val() :'BIC',
								$filtercode2 : achSeccode == 'IAT'? '' : strPaymentCategory
							},
							success : function(data) {
								var rec = data.d.preferences;
								response($.map(rec, function(item) {
											return {
												label : item.ROUTINGNUMBER+' | '+item.BRANCHDESCRIPTION,
												value : item.ROUTINGNUMBER,
												bankDtl : item
											}
										}));
							}
						});
			},
			focus: function( event, ui ) {
                $(".ui-autocomplete > li").attr("title", ui.item.label);
            },
			minLength : 1,
			select : function(event, ui) {
				var data = ui.item.bankDtl;
				if (data) {
					if (!isEmpty(data.BANKCODE))
					{
						$('#intBankDetails1A').val(data.BRANCHDESCRIPTION);
						$('#intBankIDDescA').val(data.BRANCHCODE);
				}
						
					if (!isEmpty(data.ADDRESS) && data.ADDRESS!= undefined)//
					{
						$('#intBankDetails2A').val(data.ADDRESS.substring(0,34));
						$('#intBankDetails2A').attr('disabled',true);				
						$('#intBankDetails2A').addClass("disabled");
						$('#intBankDetails3A').val(data.ADDRESS.substring(34,69));
						$('#intBankDetails3A').attr('disabled',true);				
						$('#intBankDetails3A').addClass("disabled");
						$('#intBankDetails4A').val(data.COL1);	
						$('#intBankDetails4A').attr('disabled',true);				
						$('#intBankDetails4A').addClass("disabled");
					}
					else
					{
						$('#intBankDetails2A,#intBankDetails3A,#intBankDetails4A').val("");	
						$('#intBankDetails2A,#intBankDetails3A,#intBankDetails4A').removeClass("disabled");	
						$('#intBankDetails2A,#intBankDetails3A,#intBankDetails4A').attr('disabled',false);
					}
				}
			},
			open : function() {
				$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
			},
			close : function() {
				$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
			}
		});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="t7-autocompleter"><ul>'
					+ item.value + '</ul><ul>' + item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul).attr('title',item.value+' '+item.label);
		};*/
		
		$(this).on('blur',function(){
			if(!$('.ui-autocomplete.ui-widget:visible').length) {
				if (isEmpty($('#intBankIDCodeA').val()) ) {
					$('#intBankDetails1A,#intBankDetails2A,#intBankDetails3A,#intBankDetails4A').val("");	
					$('#intBankDetails1A,#intBankDetails2A,#intBankDetails3A,#intBankDetails4A').removeClass("disabled");	
					$('#intBankDetails1A,#intBankDetails2A,#intBankDetails3A,#intBankDetails4A').attr('disabled',false);
				}
			}
			else
			{
				$(this).focus();
			}
		});
	});
};

function enableDisableAddressDetails()
{
	if(!isEmpty($('#intBankIDCodeA').val()))
	{
		$('#intBankDetails1A,#intBankDetails2A,#intBankDetails3A,#intBankDetails4A').addClass("disabled");	
		$('#intBankDetails1A,#intBankDetails2A,#intBankDetails3A,#intBankDetails4A').attr('disabled',true);
	}
	if(!isEmpty($('#corrBankIDCodeA').val()))
	{
		$('#corrBankDetails2A,#corrBankDetails3A,#corrBankDetails4A').addClass("disabled");	
		$('#corrBankDetails2A,#corrBankDetails3A,#corrBankDetails4A').attr('disabled',true);
	}
	if(!isEmpty($('#beneficiaryBankIDCodeAutoCompleter').val()))
	{
		$('#rBankAddress1A,#rBankAddress2A,#rBankAddress3A').addClass("disabled");	
		$('#rBankAddress1A,#rBankAddress2A,#rBankAddress3A').attr('disabled',true);
	}
}

jQuery.fn.IntBankBranchAutoComplete = function() {
	return this.each(function() {
		// TODO: To be verified
		$(this).autocomplete({
			source : function(request, response) {
			populateBeneficiaryBankIDType();
			var allowAdhocBranch = paymentResponseInstrumentData.d.paymentEntry.paymentHeaderInfo.allowAdhocBank ;
				$.ajax({
							url : "services/userseek/beneEntryByName.json?$top=20",
							dataType : "json",
							data : {
								$autofilter : request.term,
								$filtercode1 :  $('#beneficiaryBankIDTypeA-niceSelect').is(':hidden')
										? 'FED'
										: $('#beneficiaryBankIDTypeA').val(),//getDisabledFieldValue($('#beneficiaryBankIDTypeA-niceSelect')),
								$filtercode2 : strPaymentCategory
							},
							success : function(data) {
								var rec = data.d.preferences;
								response($.map(rec, function(item) {
											return {
												label : item.BRANCHDESCRIPTION,
												value : item.BRANCHDESCRIPTION,
												bankDesc : item.BANKDESCRIPTION,
												bankDtl : item
											}
										}));
								
								$('#intBankDetails1ALbl')
										.removeClass("required");
							}
						});
			},
			minLength : 1,
			focus: function( event, ui ) {
				$(".ui-autocomplete > li").attr("title", ui.item.label+" | "+ui.item.value);
			},
			select : function(event, ui) {
				var data = ui.item.bankDtl;
				if (data) {
					if (!isEmpty(data.BRANCHDESCRIPTION))
						$('#beneficiaryBranchDescriptionA')
								.val(data.BRANCHDESCRIPTION);

					if (!isEmpty(data.ROUTINGNUMBER)) {
						$('#beneficiaryBankIDCodeA').val(data.ROUTINGNUMBER);
						$("#beneficiaryBankIDCodeAutoCompleter")
								.val(data.ROUTINGNUMBER);
						$('#beneficiaryBankIDCodeAutoCompleter').removeClass('requiredField');
					}

					if (!isEmpty(data.BANKCODE))
						$('#drawerBankCodeA').val(data.BANKCODE);
					if (!isEmpty(data.BRANCHCODE))
						$('#drawerBranchCodeA').val(data.BRANCHCODE);
					if (!isEmpty(data.BRANCHDESCRIPTION)) {
						$('#beneficiaryBranchDescriptionA')
								.val(data.BRANCHDESCRIPTION);
					}
					if (!isEmpty(data.BANKDESCRIPTION)) {
						$('#beneficiaryBankDescriptionA')
								.val(data.BANKDESCRIPTION);
					}
					if (!isEmpty(data.ROUTINGNUMBER)) {
						$('#beneficiaryBankIDCodeA').val(data.ROUTINGNUMBER);
						$("#beneficiaryBankIDCodeAutoCompleter")
								.val(data.ROUTINGNUMBER);
					}
					$('#rBankAddress1A,#rBankAddress2A,#rBankAddress3A').val('');
					$('#rBankAddress1A,#rBankAddress2A,#rBankAddress3A').removeClass("disabled");	
					$('#rBankAddress1A,#rBankAddress2A,#rBankAddress3A').attr('disabled',false);
					if (!isEmpty(data.ADDRESS) && data.ADDRESS!= undefined)//
					{
						$('#rBankAddress1A').val(data.ADDRESS.substring(0,35));
						$('#rBankAddress1A').attr('disabled',true);				
						$('#rBankAddress1A').addClass("disabled");	
						$('#rBankAddress2A').val(data.ADDRESS.substring(35,70));
						$('#rBankAddress2A').attr('disabled',true);				
						$('#rBankAddress2A').addClass("disabled");
						if (!isEmpty(data.COL1))
						{
							$('#rBankAddress3A').val(data.COL1);	
						}
						$('#rBankAddress3A').attr('disabled',true);				
						$('#rBankAddress3A').addClass("disabled");
					}
					// $('#bankBranchDtlSpan').html(strText);
					if (!isEmpty(data.ADDRESS))
						$('#drawerBankAddressA').val(data.ADDRESS);

					setBankIDValue($('#beneficiaryBankIDTypeA').val(),
							$('#beneficiaryBankIDCodeA'), data);
					$('#drawerBankBranchDescALbl').removeClass("required");
					
				}
				else
				{
					if(allowAdhocBranch == 'N' && $('#beneficiaryBankIDTypeA').val() == "IBAN")
					{
						$('#beneficiaryBranchDescriptionA').val("");
						$('#messageArea').append("Bank Branch Not Defined");
						$('#messageArea, #messageContentDiv').removeClass('hidden');
					}
				}
			},
			open : function() {
				$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
			},
			close : function() {
				$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
			}
		});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="t7-autocompleter"><ul>'
					+ item.label + '</ul><ul> | '+ item.value + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
		$(this).on('blur',function(){
			if(!$('.ui-autocomplete.ui-widget:visible').length) {
				if (isEmpty($('#beneficiaryBranchDescriptionA').val())) {
					$('#rBankAddress1A,#rBankAddress2A,#rBankAddress3A').val('');
					$('#rBankAddress1A,#rBankAddress2A,#rBankAddress3A').removeClass("disabled");	
					$('#rBankAddress1A,#rBankAddress2A,#rBankAddress3A').attr('disabled',false);
				}
			}
			else
			{
				$(this).focus();
			}
		});
	});
};

jQuery.fn.BankBranchAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				$.ajax({
							url : urlBank,
							dataType : "json",
							data : {
								$top:autocompleterSize,
								$autofilter : request.term,
								$filtercode1 : getDisabledFieldValue($('#beneficiaryBankIDTypeA')),
								$filtercode2 : strPaymentCategory
							},
							success : function(data) {
								var rec = data.d.preferences;
								response($.map(rec, function(item) {
											return {
												label : item.BANKDESCRIPTION,
												value : item.BANKCODE,
												bankDtl : item
											}
										}));
							}
						});
			},
			minLength : 1,
			select : function(event, ui) {
				var data = ui.item.bankDtl;
				if (data) {
					if (!isEmpty(data.ROUTINGNUMBER))
						$('#beneficiaryBankIDCodeA').val(data.ROUTINGNUMBER);
					if (!isEmpty(data.BANKCODE))
						$('#drawerBankCodeA').val(data.BANKCODE);
					if (!isEmpty(data.BRANCHCODE))
						$('#drawerBranchCodeA').val(data.BRANCHCODE);
				}
			},
			open : function() {
				$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
			},
			close : function() {
				$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
			},
			change : function() {
				if (isEmpty($(this).val())
						|| ($(this).val() !== $('#drawerBankCodeA').val()))
					$('#drawerBankCodeA, #drawerBranchCodeA, #beneficiaryBankIDCodeA')
							.val('');
			}
		});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="t7-autocompleter"><ul>'
					+ item.value + '</ul><ul>' + item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};
jQuery.fn.CorrBankBranchAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/drawerbank.json?$top=20",
									dataType : "json",
									data : {
										$autofilter : request.term,
										$filtercode1 : getDisabledFieldValue($('#beneficiaryBankIDTypeA')),
										$filtercode2 : strPaymentCategory
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {
														label : item.BANKDESCRIPTION,
														value : item.BANKCODE,
														bankDtl : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						if (data) {
							if (!isEmpty(data.BANKCODE))
								$('#corrBankDetails1A').val(data.BANKCODE);
							if (!isEmpty(data.BRANCHCODE))
								$('#corrBankDetails3A').val(data.BRANCHCODE);
							if (!isEmpty(data.ROUTINGNUMBER))
								$('#corrBankIDCodeA').val(data.ROUTINGNUMBER);
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
			var inner_html = '<a><ol class="t7-autocompleter"><ul>'
					+ item.value + '</ul><ul>' + item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};
function savePaymentInstrument(jsonData, fnCallback, args) {
	var strUrl = _mapUrl['saveInstrumentUrl'];
	blockPaymentInstrumentUI(true);
	$.ajax({
				url : strUrl,
				type : 'POST',				
				contentType : "application/json",
				data : JSON.stringify(jsonData),
				complete : function(XMLHttpRequest, textStatus) {
					if ("error" == textStatus) {
						var arrError = new Array();
						arrError.push({
									"errorCode" : "Message",
									"errorMessage" : mapLbl['unknownErr']
								});
						doHandleUnknownError();
						if(data)
							fnChkRecValRes(data);	// Added for Receiver Validation. Used in ECO Bank. Good to have feature in product.
						blockPaymentInstrumentUI(false);
					}
					scrollToTop();
				},
				success : function(data) {
					if(!data.d.auth)
						{
							blockPaymentInstrumentUI(false);
							if(data)
								fnChkRecValRes(data);	// Added for Receiver Validation. Used in ECO Bank. Good to have feature in product.									
							fnCallback(data, args);
							if(args.action == 'UPDATEANDNEXT' && strPaymentType === 'BATCHPAY')
							{
								loadTxnWizardOnNavigation(args.intCount,args.strMode);
							}
						}
				}
			});
	if(strPaymentType === 'QUICKPAY')
		autoFocusFirstElement();
}
// Added for Receiver Validation. Used in ECO Bank. Good to have feature in product.
function fnChkRecValRes(data) {
    if (data.d.paymentEntry.message && data.d.paymentEntry.message.errors) {
        data.d.paymentEntry.message.errors.forEach(function(e) {
            if (e.errorCode === "RECVAL003") {
                $('#receiverVal').val('S');
                $('#successMessageDiv').removeClass('hidden');
                $('#successMessageDiv').addClass('ft-error-message');
                if ($('#successMessage') != null){
                	$('#successMessage').html(e.errorMessage);
                }
            } else if (e.errorCode === "RECVAL004") {
                $('#receiverVal').val('W');
                $('#warnMessageDiv').removeClass('hidden');
                $('#warnMessageDiv').addClass('ft-error-message');
            }
        });
    }

    if ($('#saveandadd') != null) {
        if ($('#saveandadd').val() === "SAA") {
            if ($('#receiverVal') != null) {
                if ($('#receiverVal').val() === "W") {
                	document.getElementById("receiverVal").value = "";
                	document.getElementById("saveandadd").value = "";
                    receiverWarningMessagePopUp();
                } else if ($('#receiverVal').val() === "S") {
                	document.getElementById("receiverVal").value = "";
                	document.getElementById("saveandadd").value = "";
                    openreceiverSuccessMessagePopup();
                }
            }
        }
    }
}

function clearStandardFileds(clearFields) {
	if (clearFields === true) {
		$('#coAuthPersonName,#coAuthPersonIC,#coAuthPersonIdType').val('');
		
		}
	}

function paintPaymentInstrumentUI(objData, strPmtType) {
	var data = objData, arrStdFields = [],arrWhtHeaderFields=[], arrAggregatorFields=[];
	var canShowEnrichmentSection = false, canShowAdditionalInfoSection = false;
	if (data && data.d && data.d.paymentEntry) {
		
		if (data.d.paymentEntry.paymentHeaderInfo) {
			var objInfo = data.d.paymentEntry.paymentHeaderInfo;
			if('BILLPAYLAYOUT' === strLayoutType){
				strBillerOrAggregator = objInfo.isBiller;
				strReceiptFlag = objInfo.receiptFlag;
			}
		}
		
		if (data.d.paymentEntry.standardField) {
			arrStdFields = data.d.paymentEntry.standardField;
		if(data.d.paymentEntry.whtFields && data.d.paymentEntry.whtFields.whtHeader)
			arrWhtHeaderFields = data.d.paymentEntry.whtFields.whtHeader
		if(!isEmpty(arrWhtHeaderFields))
			arrStdFields = arrStdFields.concat(arrWhtHeaderFields);
		
		if(strBillerOrAggregator === 'A' && data.d.paymentEntry.billerDetails && data.d.paymentEntry.billerDetails.billerStdFields){
			arrAggregatorFields = data.d.paymentEntry.billerDetails.billerStdFields;
			if(!isEmpty(arrAggregatorFields))
				arrStdFields = arrStdFields.concat(arrAggregatorFields);
		}
		paintPaymentStandardFields(arrStdFields);
		}
		
		if(strBillerOrAggregator === 'A'){
			if(data.d.paymentEntry.billerDetails && data.d.paymentEntry.billerDetails.billerProductFields){
				paintBillerAggProductField(data.d.paymentEntry.billerDetails.billerProductFields);
			}
			if(data.d.paymentEntry.billerDetails && data.d.paymentEntry.billerDetails.billerReqEnrFields){
				paintAggregatorRequestField(data.d.paymentEntry.billerDetails.billerReqEnrFields);
			}
			if(data.d.paymentEntry.billerDetails && !data.d.paymentEntry.billerDetails.billerResDetails 
					&& !data.d.paymentEntry.billerDetails.billerResEnrDetails)
			{
				$('#aggResponseDetailsDiv').addClass('hidden');
				$('#amount').val(null);
			}
			if(data.d.paymentEntry.billerDetails && data.d.paymentEntry.billerDetails.billerResDetails){
				paintAggregatorResponceFields(data.d.paymentEntry.billerDetails);
				$('#aggResponseDiv').removeClass('hidden');
			}
			else{
				$('#aggResponseDiv').empty();
				$('#aggResponseDiv').addClass('hidden');
			}
			
			if(data.d.paymentEntry.billerDetails && data.d.paymentEntry.billerDetails.billerResEnrDetails){
				paintAggregatorResponceFields(data.d.paymentEntry.billerDetails);
				$('#aggResponseEnrDiv').removeClass('hidden');
			}
			else{
				$('#aggResponseEnrDiv').empty();
				$('#aggResponseEnrDiv').addClass('hidden');
			}
		}

		if(data.d.paymentEntry.whtFields && data.d.paymentEntry.whtFields.whtDetails){
			objWhtDetails = data.d.paymentEntry.whtFields.whtDetails;
			paintPaymentWHTAdditionalDetailsGrid(objWhtDetails,false);
		}
		// TODO : To be handled
		if (false && data.d.paymentEntry.adminFields && strEntityType === '0')
			paintPaymentAdminFields(data.d.paymentEntry.adminFields);

		if (data.d.paymentEntry.beneficiary) {
			paintPaymentReceiverFields(data.d.paymentEntry.beneficiary,
					data.d.paymentEntry.paymentHeaderInfo,
					data.d.__metadata._pirMode);
		}
		
		if (data.d.paymentEntry.enrichments)
			canShowEnrichmentSection = paintPaymentEnrichments(data.d.paymentEntry.enrichments);
		else {
			resetEnrichmentSection();
			if (strLayoutType === 'TAXLAYOUT')
				canShowEnrichmentSection = true;
		}

		if (data.d.paymentEntry.additionalInfo)
		{
			canShowAdditionalInfoSection = paintPaymentAdditionalInformation(
					data.d.paymentEntry.additionalInfo, false);
			}
			
		else{
			resetAdditionalInfoSection();
			canShowAdditionalInfoSection=false;
		}	
		var noOfDenoms = 0;
		if (data.d.paymentEntry.cashwithdrawalDetails && data.d.paymentEntry.cashwithdrawalDetails.denomination){
			noOfDenoms = paintPaymentDenominationsHelper(data.d.paymentEntry.cashwithdrawalDetails.denomination,'','cashwithdrawalDiv','');
		}
		if(noOfDenoms > 0)
				$('#cashwihdrawaldetails').removeClass('hidden');
			else
				$('#cashwihdrawaldetails').addClass('hidden');
				
		showHideAddendaSection(canShowEnrichmentSection,
				canShowAdditionalInfoSection);

		if (data.d.paymentEntry.paymentCompanyInfo) {
			var objInfo = data.d.paymentEntry.paymentCompanyInfo;
			var strText = !isEmpty(objInfo.company) ? objInfo.company : '';
			strText += '<br/>'
					+ (!isEmpty(objInfo.companyAddress)
							? objInfo.companyAddress
							: '');
			$('.companyInfo').html(strText);
		}

		if (data.d.paymentEntry.paymentHeaderInfo) {
			var objInfo = data.d.paymentEntry.paymentHeaderInfo, strCssClass = null;
			if (objInfo.singleOrBatch && 'B' === objInfo.singleOrBatch) {
				if (!isEmpty(objInfo.hdrDrCrFlag)) {

					if ((strPaymentType === 'QUICKPAY' || strPaymentType === 'QUICKPAYSTI')
							|| (strPaymentType === 'BATCHPAY' && (strLayoutType === 'TAXLAYOUT' ||strLayoutType === 'WIRESWIFTLAYOUT')))
						strCssClass = 'col-sm-12';

					if (objInfo.hdrDrCrFlag != 'B') {
						var strDrCrLabel = !isEmpty(mapDrCrReadonlyLabel[strPaymentType][objInfo.hdrDrCrFlag][strLayoutType])
								? mapDrCrReadonlyLabel[strPaymentType][objInfo.hdrDrCrFlag][strLayoutType]
								: objInfo.hdrDrCrFlag === 'D'
										? getLabel('debitTransaction', 'Debit')
										: getLabel('creditTransaction', 'Credit');
						$('#txnInfoLink').remove();
						$('<div class="form-group"><label>'+ getLabel('transactionType', 'Transaction Type') +'</label><br><span>'
								+ strDrCrLabel + '</span>')
								.appendTo($('<div id="txnInfoLink" class="'
										+ strCssClass + '">')
										.appendTo($('#drCrFlagDiv')));
						$("#drCrFlagDiv .col-sm-6,#drCrFlagDiv .radio-inline")
								.addClass('hidden');
						$('#drCrFlagDiv').removeClass('hidden');
					} else {
						//$('#txnInfoLink').remove();
						$("#drCrFlagDiv .col-sm-6,#drCrFlagDiv .radio-inline")
								.removeClass('hidden');
					}

					if (strLayoutType === 'ACCTRFLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT') {
						toggleAccountTransferAccountLabel(objInfo.hdrDrCrFlag);
						var strSellerCcy = $('#txnCurrency').val();// Transaction
						// Currency
						toggleCurrencyLabel(strSellerCcy);
					}
				}
			}
			var prodDesc = null;
			prodDesc = objInfo.hdrMyProductDescription;
			if('BILLPAYLAYOUT' === strLayoutType){
		         $('.hdrMyProductDescriptionTitle').attr("title",objInfo.billerDesc);
			     $('.hdrMyProductDescriptionTitle').html(objInfo.billerDesc || '');
			}else{
				 $('.hdrMyProductDescriptionTitle').attr("title",objInfo.hdrMyProductDescription);
                 $('.hdrMyProductDescriptionTitle').html(prodDesc || '');
			}
			$('#productCuttOffInfoSpan').html(objInfo.hdrCutOffTime || '');

			//$('.lastUpdateDateTimeText').html("You saved on "
			//		+ objInfo.lastUpdateTime || '');
					
			if (!isEmpty(objInfo.hdrTemplateNoOfExec)) {
				$('#templateNoOfExecSpan')
						.html(objInfo.hdrTemplateNoOfExec);
			} else {
				$('#templateNoOfExecSpan').html('0');
			}		
			// if (strEntryType === 'PAYMENT' || strEntryType === 'SI')
			// $('.batchStatusText').html("Batch Status : " + objInfo.hdrStatus
			// || '');

			if (strAction === 'ADD' && isEmpty($('#referenceNo').val()) && strShowPayRef === 'Y') {
				(!Ext.isEmpty(objInfo.hdrMyProductDescription) &&  objInfo.hdrMyProductDescription.length > referenceLength) ?
					$('#referenceNo').val(objInfo.hdrMyProductDescription.substr(0,referenceLength)  || '') : $('#referenceNo').val(objInfo.hdrMyProductDescription || '') ;
			}

			if (objInfo.hdrSource) {
				$('.hdrSourceInfoSpan').text(objInfo.hdrSource || '');
			}
			//FTMNTBANK-1334
			if (strEntryType === 'PAYMENT' || strEntryType === 'SI') {
				if(!isEmpty(objInfo.hdrTemplateName) && !isEmpty(objInfo.hdrClonnedFromTxn)){
					handleHoldZeroDollarFlag('Q',true);
					handleHoldUntilFlag('Q',true);
				}else {
					handleHoldZeroDollarFlag('Q',false);
					handleHoldUntilFlag('Q',false);
				}
			}

			if (strPaymentType === 'BATCHPAY') {
				var chrDebitAccountLevel = objInfo.accountLevel
						? objInfo.accountLevel
						: 'B';
				var chrDateLevel = objInfo.dateLevel ? objInfo.dateLevel : 'B';
				var chrProductLevel = objInfo.productLevel
						? objInfo.productLevel
						: 'B';
				handleDebitLevelAtInstrumentFields(chrDebitAccountLevel,
						chrDateLevel, chrProductLevel, 'Q');
			}
			
			if (!isEmpty(objInfo.minPaymentDate)) {
				handleOffsetDays(objInfo.minPaymentDate, 'Q')
			}
		}
	}
	if (strEntryType === 'TEMPLATE') {
		onChangeHoldUntil();
		if (strPmtType === 'Q' /*&& strPaymentType==='QUICKPAY'*/) {
			var strTemplateType = getInstrumentTemplateType(arrStdFields);
			if (isEmpty(strPaymentInstrumentIde)) {
				handleDefaultLockFieldValues(data, 'Q');
			} else {
				if (strTemplateType === '1')
					toggleAccountFieldBehaviour(true, 'Q');
				else
					toggleAccountFieldBehaviour(false, 'Q');
			}
			doDisableDefaultLockFields('Q', strTemplateType);
		}
	}
	if (strLayoutType === 'ACCTRFLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT') {
		var strDebitPaymentAmntFlag = $('input[name="accTrfType"]:radio:checked')
				.val();
		if (strPaymentType === 'BATCHPAY' && data.d.paymentEntry.paymentMetaData && data.d.paymentEntry.paymentMetaData.accTrfType) {
			strDebitPaymentAmntFlag = data.d.paymentEntry.paymentMetaData.accTrfType;
		}			
		strDebitPaymentAmntFlag = strDebitPaymentAmntFlag
				? strDebitPaymentAmntFlag
				: 'A';
			if (!isEmpty(strDebitPaymentAmntFlag)){
				if(strPaymentType === 'BATCHPAY')
					toggleTxnWizardAmountLabel(strDebitPaymentAmntFlag);
				else
					toggleAmountLabel(strDebitPaymentAmntFlag);
			}		
		//$('#drawerAccountNo').editablecombobox('refresh');
	}
	
	createTemplateCheckBoxGroup('#holdUntilFlag,#prenote');
	togglePrenoteValue();
	handleLayoutBasedScreenRendering('Q',data);
	
	if (data && data.d && data.d.paymentEntry
			&& data.d.paymentEntry.paymentHeaderInfo)
		paintPaymentDtlAdditionalInformationSection(null, 'Q','VERIFY');
	
	toggleContainerVisibility('transactionWizardPopup');
	toggleContainerVisibility('paymentInstrumentEntryExtraFieldsDiv');
	// TODO : We kept this call as it is, added by FT, need more understanding
	// on this
	postHandleClientEnrichments();
	if (data.d && data.d.__metadata && data.d.__metadata._detailId) {
	// jsonObj.d.__metadata._headerId = strPaymentHeaderIde;
		strPaymentInstrumentIde = data.d.__metadata._detailId;
	}
	if(data.d.paymentEntry.paymentMetaData._secCode)
		strSecCode = data.d.paymentEntry.paymentMetaData._secCode;
	
	if(data.d.paymentEntry.paymentMetaData._docUploadEnabled){
		hideShowUploadFileDivForEdit(data.d.paymentEntry.paymentMetaData);
	}
	
	if(strLayoutType === 'CASHLAYOUT'){
		handleTotalDenomAmountCcy();
	}
	
	if(strLayoutType === 'MIXEDLAYOUT'){
		handleElectronicAndPhysicalInstrumentFieldsHideAndShow(data.d.paymentEntry);
		var instrumentId = data.d.paymentEntry.paymentMetaData.instrumentId;
         if ('01' === instrumentId || '02' === instrumentId || '07' === instrumentId) {
             $('#beneficiaryBranchDescriptionADiv').addClass('hidden'); 
             $('#bankBranchDiv').addClass('hidden');    
             $('#drawerAccountNoADiv').addClass('hidden');
             $("#drawerAccountIbanDiv").addClass("hidden");
         }
	}
	
	if(strLayoutType === 'CHECKSLAYOUT'){
        handleBankToBankInformationSectionHideAndShow(data.d.paymentEntry);
        handlePayOutDeliverySectionHideAndShow(data.d.paymentEntry);
    }
    
	if( strLayoutType && strLayoutType =='ACHLAYOUT')
	{
		if(achSeccode == 'PPD' || achSeccode == 'PPDPLUS' || achSeccode == 'TEL' || achSeccode == 'WEB' || achSeccode == 'CIE' || achSeccode == 'CIEPLUS' || achSeccode == 'RCK')
		{
			$('#drawerDescriptionALbl,#drawerDescriptionRLbl').text( getLabel('editableGridIndivdualName','Individual Name'));
			if(achSeccode != 'RCK')
			$('#receiverIDALbl,#receiverIDRLbl').text(getLabel('editableGridIndivdualID','Individual Identification Number'));
		}
	}
	if(strLayoutType && strLayoutType =='WIRESWIFTLAYOUT' && strLayoutSubType === 'DRAWDOWN')
	{
		$('#drawerDescriptionALbl,#drawerDescriptionRLbl').text( getLabel('debitPartyName','Debit Party Name'));
		$('#receiverCodeRInstLbl,#receiverCodeRLbl').text( getLabel('debitReceiverCode','Debit Party Code'));
	}
    if( strLayoutType && strLayoutType =='TAXLAYOUT')
    {
        doHandleAmountSummation();
    }
    if ( strLayoutType && strLayoutType === 'MIXEDLAYOUT' || strLayoutType === 'WIRESWIFTLAYOUT')
    {
    	var strPrdID = data.d.paymentEntry.paymentMetaData.instrumentId;
    	if(beneValidationOnSave === 'N' && strPrdID === '04' && readonlyFields)
        {
        	enableDisableBeneFields();
        }
	}
   
//	anyIdToggle(data.d.paymentEntry.paymentMetaData.anyIdPaymentFlag,data.d.paymentEntry.beneficiary.adhocBene ? 'A' : 'R');	
}

function handleBankToBankInformationSectionHideAndShow(data){
    arrFields = data.standardField;
    var paymentMetaData = data.paymentMetaData;
    var instrumentId = paymentMetaData.instrumentId;
    if (('01' === instrumentId || '02' === instrumentId || '07' === instrumentId) && displayBankToBankInformationSectionInfo(arrFields,instrumentId)) {
    	$('#bankToBankInformationSectionInfoDiv').removeClass('hidden');
    }
    else
    {
    	$('#bankToBankInformationSectionInfoDiv').addClass('hidden');
    }
    if ('02' === instrumentId || '07' === instrumentId)
    {
    	$('#instrumentDate').attr('disabled','disabled');
    	$('#instrumentDateIconDiv').addClass('disabled','disabled');
    }
    else
    {
		$('#instrumentDate').removeAttr('disabled');
    	$('#instrumentDateIconDiv').removeClass('disabled');
	}
}
function handlePayOutDeliverySectionHideAndShow(data){
    arrFields = data.standardField;
    var paymentMetaData = data.paymentMetaData;
    var instrumentId = paymentMetaData.instrumentId;
    if (('01' === instrumentId || '02' === instrumentId || '07' === instrumentId) && displayPayOutDeliverySectionInfo(arrFields,instrumentId)) {
    	$('#payoutanddeliveryDetailsSectionInfoDiv').removeClass('hidden');
    }
    else
    {
    	$('#payoutanddeliveryDetailsSectionInfoDiv').addClass('hidden');
    }
}
function displayBankToBankInformationSectionInfo(arrFields,instrumentId) {
	var displayBankToBankInformationSectionInfo = false;
	if (instrumentId && '00' !== instrumentId) {
		$.each(arrFields, function(index, cfg) {
			 if('swiftSenderInfo1' === cfg.fieldName || 'swiftSenderInfo2' === cfg.fieldName || 'swiftSenderInfo3' === cfg.fieldName ||'swiftSenderInfo4' === cfg.fieldName){
                if('1' !== cfg.displayMode){
                    displayBankToBankInformationSectionInfo = true ;
                }
            }
		});
	}

  return displayBankToBankInformationSectionInfo;
}
function displayPayOutDeliverySectionInfo(arrFields,instrumentId) {
	var displayPayOutDeliverySectionInfo = false;
	if (instrumentId && '00' !== instrumentId) {
		$.each(arrFields, function(index, cfg) {
			 if('coAuthPersonIC' === cfg.fieldName || 'coAuthPersonIdType' === cfg.fieldName || 'coAuthPersonName' === cfg.fieldName 
					 ||'coDraweeBranch' === cfg.fieldName || 'drawerDeliveryMode' === cfg.fieldName ||'payLocation' === cfg.fieldName){
                if('1' !== cfg.displayMode){
                	displayPayOutDeliverySectionInfo = true ;
                }
            }
		});
	}

  return displayPayOutDeliverySectionInfo;
}
function paintPaymentWHTHeaderFieldsViewOnly(arrWHTHdrData){
	var strValue = '', strFieldName = '', ctrlDiv = null ,ctrl = null;
	if (arrWHTHdrData) {
		$.each(arrWHTHdrData, function(index, cfg) {
			strFieldName = cfg.fieldName;
			strValue = getValueToDispayed(cfg);
			
			strValue = !isEmpty(strValue) ? strValue : '';
			ctrlDiv = $('.' + strFieldName +  '_InstViewDiv');
			if (ctrlDiv && ctrlDiv.hasClass('hidden'))
				ctrlDiv.removeClass('hidden');
			ctrl = $('.' + strFieldName + '_InstView');
			if(strFieldName ==='whtCertificatePrinting'){
				if(cfg.value && cfg.value ==='Y')
					ctrl.removeClass('hidden');
				else
					ctrl.addClass('hidden');
			} else if(strFieldName === 'whtTotalAmount'){
				ctrl.autoNumeric("init",
					{
						aSep: strGroupSeparator,
						dGroup: strAmountDigitGroup,
						aDec: strDecimalSeparator,
						mDec: strAmountMinFraction
					});
				ctrl.autoNumeric("set",strValue);
			} 
			  else ctrl.html(strValue);
		});
	}
}

function handleTotalDenomAmountCcy(){
	var strPayCcy = '';
	strPayCcy = $('#txnCurrency').val();
	
	if(!isEmpty(strPayCcy))
		$('.totalDenomCcy').text(' ('+strPayCcy+') ');
	
}

function showHideAddendaSection(isEnrichAvailable, isAdditionalInfoAvailable,
		strPostFix) {
	// if (isEnrichAvailable && strLayoutType ==='ACCTRFLAYOUT')
	// isEnrichAvailable=false;

	if (isAdditionalInfoAvailable
			&& (strLayoutType === 'ACCTRFLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT' || strLayoutType === 'ACHLAYOUT')) {
		isAdditionalInfoAvailable = false;
		$('#additionlInfoSectionDiv').addClass('hidden');
	}
	if (/*strLayoutType === 'TAXLAYOUT' ||*/ strLayoutType === 'MIXEDLAYOUT' || strLayoutType === 'WIRESWIFTLAYOUT') {
		isEnrichAvailable = true;
		// $('#additionlInfoSectionDiv').addClass('hidden');
	}
	if (isEnrichAvailable || isAdditionalInfoAvailable)
	{
		$("#addendaSectionDiv").removeClass('hidden');
	}
	else
	{
		$("#addendaSectionDiv").addClass('hidden');
	}
		
}
function showHideAddendaViewOnlySection(isEnrichAvailable,
		isAdditionalInfoAvailable, strPostFix) {
	// if (isEnrichAvailable && strLayoutType ==='ACCTRFLAYOUT')
	// isEnrichAvailable=false;

	if (isAdditionalInfoAvailable
			&& (strLayoutType === 'ACCTRFLAYOUT' ||strLayoutType === 'SIMPLEACCTRFLAYOUT' || strLayoutType === 'ACHLAYOUT')) {
		isAdditionalInfoAvailable = false;
		$('#additionlInfoSectionDiv_InstView').addClass('hidden');
	}
	if (/*strLayoutType === 'TAXLAYOUT' ||*/ strLayoutType === 'MIXEDLAYOUT' || strLayoutType === 'WIRESWIFTLAYOUT') {
		isEnrichAvailable = true;
		// $('#additionlInfoSectionDiv').addClass('hidden');
	}
	if (isEnrichAvailable || isAdditionalInfoAvailable)
		$("#addendaSectionDiv_InstView").removeClass('hidden');
	else 
		$("#addendaSectionDiv_InstView").addClass('hidden');
}
function repaintPaymentInstrumentFields(onLoad) {
	var strProductCode = strMyProduct;
	var strBankProduct = $('#bankProduct').val();
	// below code will execute only on product change
	if (onLoad === undefined)
	{
		clearReceiver(strReceiverType, true);
		$('#amount').val('');
		$("#receiverCode"+strReceiverType).val('');
	}
	if (strLayoutType === 'MIXEDLAYOUT' && isEmpty(strBankProduct)){
		return false;
	}
	if ((strLayoutType =='CHECKSLAYOUT' || strLayoutType == 'MIXEDLAYOUT') && !isEmpty(strBankProduct)){
		$('#printBranchDiv').addClass('hidden');
	}
	var strUrl = _mapUrl['loadInstrumentFieldsUrl'] + "/" + strMyProduct
			+ ".json";
	var jsonObj = null;
	if (!isEmpty(strBankProduct)){
		strUrl += '/' + strBankProduct;
		strUrl += '.json';
	}


	blockPaymentInstrumentUI(true);
	arrFields = [];
	jsonObj = generatePaymentInstrumentJson();
	$('#beneficiaryBankIDCodeA,#beneficiaryBankIDCodeAutoCompleter,#drawerBankCodeA,#drawerBranchCodeA,#beneficiaryBranchDescriptionA,#beneficiaryBankDescriptionA,#drawerBankAddressA, #beneficiaryBankIDTypeA, #anyIdTypeA')
	.val('');
	if (jsonObj.d.paymentEntry.standardField) {
		arrFields = jsonObj.d.paymentEntry.standardField;
		$.each(arrFields, function(index, cfg) {
					if (cfg.fieldName == 'txnDate') {
						cfg.value = null;
					}if(cfg.fieldName == 'whtReqFlag' && jsonObj.d.paymentEntry.paymentMetaData.instrumentId &&  '00' === jsonObj.d.paymentEntry.paymentMetaData.instrumentId){
						cfg.value = 'N';
					}
				});

	}
	if (jsonObj.d && jsonObj.d.__metadata && strPaymentInstrumentIde) {
		// jsonObj.d.__metadata._headerId = strPaymentHeaderIde;
		jsonObj.d.__metadata._detailId = strPaymentInstrumentIde;
	}
	if(strLayoutType === 'MIXEDLAYOUT'){
		$('.canHide').addClass('hidden');
		$('#transactionWizardPopup .canClear').empty();
		$('#beneficiaryBankIDTypeA').niceSelect('destroy');
	}
	
	$.ajax({
				type : "POST",
				url : strUrl,
				async : false,
				contentType : "application/json",
				data : JSON.stringify(jsonObj),
				complete : function(XMLHttpRequest, textStatus) {
					if ("error" == textStatus) {
						var arrError = new Array();
						arrError.push({
									"errorCode" : "Message",
									"errorMessage" : mapLbl['unknownErr']
								});
						doHandleUnknownError();
						blockPaymentInstrumentUI(false);
					}
				},
				success : function(data) {
					if (data != null) {
						paymentResponseInstrumentData = data;
						doRemoveStaticText("transactionWizardPopup");
						if (strLayoutType === 'MIXEDLAYOUT') {
							if(charPaymentType === 'B')
							doHandleContainerCollapseHdr();
							else
							doHandleContainerCollapse();
						}
						if(!isEmpty(strSelectedReceiver))
						{
							refreshPaymentFieldsOnBeneChange(strMyProduct,
									strBankProduct, strSelectedReceiver);
						}
						else
						{
							paintPaymentInstrumentUI(data, 'Q');
							initateValidation();
						}
						
						if(typeof payFromAnyidReceiver !== 'undefined'
								&& payFromAnyidReceiver == 'Y' && strAction == 'ADD'
								&& data.d.paymentEntry.paymentMetaData.anyIdPaymentFlag == 'N')
						{
							strOldAnyIdFalg = 'Y';
							payFromAnyidReceiver = '';
							$('#errorDiv').empty();
							$('#messageArea').empty();
							$('#messageArea').append("Selected Payment Product is non Any ID. Please select non Any ID receiver");
							$('#messageArea, #messageContentDiv').removeClass('hidden');
							
						}
						else if(typeof payFromAnyidReceiver !== 'undefined'
								&& payFromAnyidReceiver == 'N' && strAction == 'ADD'
								&& data.d.paymentEntry.paymentMetaData.anyIdPaymentFlag == 'Y')
						{
							strOldAnyIdFalg = 'N';
							payFromAnyidReceiver = '';
							$('#errorDiv').empty();
							$('#messageArea').empty();
							$('#messageArea').append("Selected Payment Product is Any ID. Please select Any ID receiver");
							$('#messageArea, #messageContentDiv').removeClass('hidden');
						}
						checkAnyIdProductChange(data.d.paymentEntry.paymentMetaData.anyIdPaymentFlag);
						canAnyIdProductCheck = true;
						blockPaymentInstrumentUI(false);
						doHandleTextValidator();
					}
				}
			});
}
function doHandleContainerCollapse(){
	var strBankProduct = $('#bankProduct').val();
	if (strBankProduct == "") {
		$("#advanceSettingToggle,#payorInformationToggle,#paymentDetailsToggle,#additionalInfoToggle").removeAttr('style').addClass("collapseDiv");
		$("#payorInformationToggleCaret,#paymentDetailsToggleCaret,#additionalInfoToggleCaret,#advanceSettingToggleCaret").removeClass("fa-caret-up").addClass("fa-caret-down avoid-clicks");
	}else {
		$("#advanceSettingToggle,#payorInformationToggle,#paymentDetailsToggle,#additionalInfoToggle").removeClass("collapseDiv").removeAttr('style').css("display","block").css("overflow","hidden");
		$("#payorInformationToggleCaret,#paymentDetailsToggleCaret,#additionalInfoToggleCaret,#advanceSettingToggleCaret").removeClass("fa-caret-down avoid-clicks").addClass("fa-caret-up");
	}
}
function refreshPaymentFieldsOnBeneChange(productCode, bankProductCode,
		beneCode) {
	if (!isEmpty(productCode) && !isEmpty(bankProductCode)
			&& !isEmpty(beneCode)) {
		blockPaymentInstrumentUI(true);
		var url = _mapUrl['loadInstrumentFieldsUrl'] + "/" + productCode + "/"
				+ bankProductCode + "/" + beneCode + ".json";
		var jsonObj = generatePaymentInstrumentJson();
		if (jsonObj.d && jsonObj.d.__metadata && strPaymentInstrumentIde)
			jsonObj.d.__metadata._detailId = strPaymentInstrumentIde;
		$.ajax({
					type : "POST",
					url : url,
					async : false,
					contentType : "application/json",
					data : JSON.stringify(jsonObj),
					complete : function(XMLHttpRequest, textStatus) {
						if ("error" == textStatus) {
							var arrError = new Array();
							arrError.push({
										"errorCode" : "Message",
										"errorMessage" : mapLbl['unknownErr']
									});
							doHandleUnknownError();
							blockPaymentInstrumentUI(false);
						}
					},
					success : function(data) {
						if (data != null) {
							paymentResponseInstrumentData = data;
							doRemoveStaticText("transactionWizardPopup");
							paintPaymentInstrumentUI(data, 'Q');
							initateValidation();
							blockPaymentInstrumentUI(false);
							handleEmptyEnrichmentDivs();
							if(strAction == 'ADD')
							{
								populateAnyIdDetails('R');
							}
						}
					}
				});
	}
}
// TODO: To be tested
function refreshPaymentFieldsOnEnrichChange(obj, strEnrichType, fnPointer,
		argsData) {
	return;
	if (!isEmpty(obj)) {
		var enrichId = obj.attr('id');
		var url = _mapUrl['refreshEnrichmentsUrl'];		
		if (!isEmpty(strPaymentInstrumentIde))
			url += +'/(' + strPaymentInstrumentIde + ')';
		url += '/' + enrichId + '.json';
		var strEnriTyp = argsData.strEnrichType;
		var jsonObj = generatePaymentInstrumentJson();
		if (jsonObj.d && jsonObj.d.__metadata && strDetailId)
			jsonObj.d.__metadata._detailId = strPaymentInstrumentIde;

		if (strEnrichType === 'M') {
			var obj = generateJsonForDepenentField(argsData);
			if (!isEmpty(strEnriTyp) && strEnriTyp === 'BANKPRDMSE') {
				if (jsonObj.d
						&& jsonObj.d.paymentEntry
						&& jsonObj.d.paymentEntry.enrichments
						&& jsonObj.d.paymentEntry.enrichments.bankProductMultiSet)
					jsonObj.d.paymentEntry.enrichments['bankProductMultiSet'] = obj;
			} else if (!isEmpty(strEnriTyp) && strEnriTyp === 'CLIPRDMSE') {
				if (jsonObj.d && jsonObj.d.paymentEntry
						&& jsonObj.d.paymentEntry.enrichments
						&& jsonObj.d.paymentEntry.enrichments.clientMultiSet)
					jsonObj.d.paymentEntry.enrichments['clientMultiSet'] = obj;
			} else if (!isEmpty(strEnriTyp) && strEnriTyp === 'MYPPRDMSE') {
				if (jsonObj.d && jsonObj.d.paymentEntry
						&& jsonObj.d.paymentEntry.enrichments
						&& jsonObj.d.paymentEntry.enrichments.myProductMultiSet)
					jsonObj.d.paymentEntry.enrichments['myProductMultiSet'] = obj;
			}
		}
		blockPaymentInstrumentUI(true);
		$.ajax({
			type : "POST",
			url : url,
			async : false,
			contentType : "application/json",
			data : JSON.stringify(jsonObj),
			complete : function(XMLHttpRequest, textStatus) {
				if ("error" == textStatus) {
					// TODO : Error handling to be done.
					// alert("Unable to complete your request!");
				}
			},
			success : function(data) {
				if (data != null) {
					if (data.d
							&& data.d.message
							&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
						paintErrors(data.d.message.errors);
						blockPaymentInstrumentUI(false);

					} else {
						if (!isEmpty(strEnrichType) && strEnrichType === 'M') {
							paymentResponseInstrumentData = data;
							// This will call the repaint enrich popup function
							// i.e paymentInitiationMultiSetEnrichments.js >
							// refreshMultiSetEnrichmentPopUp
							if (!isEmpty(fnPointer)
									&& typeof fnPointer === 'function') {
								fnPointer(data, argsData);
							}
							blockPaymentInstrumentUI(false);
						} else {
							paymentResponseInstrumentData = data;
							doRemoveStaticText("transactionWizardPopup");
							paintPaymentInstrumentUI(data, 'Q');
							initateValidation();
							blockPaymentInstrumentUI(false);
						}
					}
				}
			}
		});
	}
}
function refreshPaymentBatchInstrumentFieldsOnBeneChange(bankProductCode,
		beneCode) {
	if (!isEmpty(strPaymentHeaderIde) && !isEmpty(bankProductCode)
			&& !isEmpty(beneCode)) {
		blockPaymentInstrumentUI(true);
		var url = _mapUrl['loadBatchInstrumentFieldsUrl'] + "/("
				+ strPaymentHeaderIde + ")/" + bankProductCode + "/" + beneCode
				+ ".json";
		var jsonObj = generatePaymentInstrumentJson();
		if (jsonObj.d && jsonObj.d.__metadata && strPaymentInstrumentIde) {
			jsonObj.d.__metadata._headerId = strPaymentHeaderIde;
			jsonObj.d.__metadata._detailId = strPaymentInstrumentIde;
		} else {
			jsonObj.d.__metadata._headerId = strPaymentHeaderIde;
		}
		$.ajax({
					type : "POST",
					url : url,
					async : false,
					contentType : "application/json",
					data : JSON.stringify(jsonObj),
					complete : function(XMLHttpRequest, textStatus) {
						if ("error" == textStatus) {
							// TODO : Error handling to be done.
							// alert("Unable to complete your request!");
						}
					},
					success : function(data) {
						if (data != null) {
							paymentResponseInstrumentData = data;
							doRemoveStaticText("transactionWizardPopup");
							paintPaymentInstrumentUI(data, 'Q');
							initateValidation();
							blockPaymentInstrumentUI(false);
						}
					}
				});
	}
}
function paintPaymentInstrumentVerifyScreen(data, charBatch) {
	var clsHide = 'hidden', canShowEnrichmentSection = false, canShowAdditionalInfoSection = false, ctrlDiv = null, isExtraInfoAvailable = false;
	var strRateType = '', cfgAmount = null, cfgDebitCcyAmount = null, chrDebitPaymentAmntFlag='',objHdrInfo = null, arrAggregatorFields=[];
	var arrStdFields = data && data.d && data.d.paymentEntry
			&& data.d.paymentEntry.standardField
			? data.d.paymentEntry.standardField
			: null;
    if(isBiller === 'A' && data.d.paymentEntry.billerDetails && data.d.paymentEntry.billerDetails.billerStdFields){
            arrAggregatorFields = data.d.paymentEntry.billerDetails.billerStdFields;
            if(!isEmpty(arrAggregatorFields))
                arrStdFields = arrStdFields.concat(arrAggregatorFields);
        }			
	var strFieldName = null, strValue = null, mapFields = {}, strPostFix = charBatch === 'Y'
			? '_HdrInfo'
			: '_InfoSpan', arrFields = null, ctrl = null;
	var strHdrEnteredNo = '', strHdrEnteredAmount = '', strHdrTotalNo = '', strTotalAmount = '';
	if (arrStdFields) {
		$.each(arrStdFields, function(index, cfg) {
			strFieldName = cfg.fieldName;
			if( strLayoutType == 'ACCTRFLAYOUT' && cfg.value == "--CONFIDENTIAL--")
			{
				strValue = cfg.value;
			}
			else
			{
				strValue = getValueToDispayed(cfg);
			}
			strValue = !isEmpty(strValue) ? strValue : '';
			ctrlDiv = $('.' + strFieldName + strPostFix + 'Div');
			if (ctrlDiv && ctrlDiv.hasClass('hidden') && '1' !=cfg.displayMode){
				ctrlDiv.removeClass('hidden');
			}
				
			ctrl = $('.' + strFieldName + strPostFix);
		
			//dynamic binding of label field
			if(cfg.label && cfg.dataType != 'radio' && cfg.dataType != 'checkBox'){
				$("label[for=" +cfg.fieldName+ "]").text(cfg.label);
			}
			
			if (strFieldName === 'prenote'
					|| strFieldName === 'useInMobilePayments'
					|| strFieldName === 'confidentialFlag'
					|| strFieldName === 'hold') {
				if (cfg && cfg.value === 'Y')
					ctrl.removeClass('hidden');
				else
					ctrl.addClass('hidden');

			} else if (strFieldName === 'accountNo'
					|| strFieldName === 'templateUsers'
					|| strFieldName === 'templateRoles') {
				if (cfg.values && cfg.values.length > 1) {
					strValue = strValue.replace(/,/g, '<br/>');
					ctrl.html(cfg.values.length + '&nbsp;Selected');
					$('.' + cfg.fieldName + 'Title' + strPostFix)
							.html(cfg.values.length + '&nbsp;Selected');
					$('.' + cfg.fieldName + strPostFix).each(function(i, obj) {
								$(this).addClass('t7-anchor');
								showToolTip($(this), strValue);
							});
					$('.' + cfg.fieldName + 'Title' + strPostFix + 'Div')
							.hasClass('hidden')
					$('.' + cfg.fieldName + 'Title' + strPostFix + 'Div')
							.removeClass('hidden');
					$('.' + cfg.fieldName + 'Title' + strPostFix).each(
							function(i, obj) {
								$(this).addClass('t7-anchor');
								showToolTip($(this), strValue);
							});
				} else {
					$('.' + cfg.fieldName + strPostFix).each(function(i, obj) {
								$(this).removeClass('t7-anchor');
								destroyToolTip($(this));
							});
					$('.' + cfg.fieldName + 'Title' + strPostFix).each(
							function(i, obj) {
								$(this).removeClass('t7-anchor');
								destroyToolTip($(this));
							});
					$('.' + cfg.fieldName + 'Title' + strPostFix)
							.html(strValue);
					$('.' + cfg.fieldName + 'Title' + strPostFix + 'Div')
							.hasClass('hidden')
					$('.' + cfg.fieldName + 'Title' + strPostFix + 'Div')
							.removeClass('hidden');
					if(strFieldName === 'accountNo')
					{
						ctrl.html(splitAccountSting(strValue));
					}
					else
					{
						ctrl.html(strValue);
					}
				}
				if (strEntryType === 'PAYMENT' || strEntryType === 'SI')
					handleAccountNoRefreshLink(cfg);
			} else if (strFieldName === 'lockFieldsMask') {
				var arrDispVal = strValue.split(',');
				if (arrDispVal && arrDispVal.length > 1) {
					strValue = strValue.replace(/,/g, '<br/>');
					ctrl.html(arrDispVal.length + '&nbsp;Selected');

					$('.' + cfg.fieldName + strPostFix).each(function(i, obj) {
								$(this).addClass('t7-anchor');
								showToolTip($(this), strValue);
							});
				} else {
					$('.' + cfg.fieldName + strPostFix).each(function(i, obj) {
								$(this).removeClass('t7-anchor');
								destroyToolTip($(this));
							});

					ctrl.html(strValue);
				}

			} else if (strFieldName === 'drawerAccountNo' && strLayoutType
					&& (strLayoutType === 'ACCTRFLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT')) {
				ctrl.html(strValue || '');
				handleDrawerAccountInfoPopulation(strValue);
			} else if (strFieldName === 'paymentSaveWithSI') {
				if (strValue === 'Y')
					ctrl.removeClass('hidden');
				else
					ctrl.addClass('hidden');
			} else if (strFieldName === 'txnDate') {
				strTxnDate = strValue;
				$(".txnDateInfoDiv").removeClass('hidden');
				ctrl.html(strValue || '');
			} else if (strFieldName === 'accTrfType' && strLayoutType !== 'ACCTRFLAYOUT') {
				$('.' + cfg.fieldName + 'Field').addClass('hidden');
				if (cfg.value && cfg.displayMode != 1)
					$('.' + cfg.fieldName + cfg.value + strPostFix)
							.removeClass('hidden');
			} else if ((strFieldName === 'pdtNotes' || strFieldName === 'pdtAlerts')
					&& !isEmpty(strValue)) {
				isExtraInfoAvailable = true;
				ctrl.html(strValue || '');
			} else if (strFieldName === 'amount') {
				cfgAmount = cfg;
				strValue = cfg.formattedValue ? cfg.formattedValue : strValue;
				ctrl.html(setDigitAmtGroupFormat(strValue) || '');
			} else if (strFieldName === 'debitCcyAmount') {
				cfgDebitCcyAmount = cfg;
				strValue = cfg.formattedValue ? cfg.formattedValue : strValue;
				ctrl.html(setDigitAmtGroupFormat(strValue) || '');
			} else if (strFieldName === 'debitPaymentAmntFlag') {
				if (strLayoutType
						&& (strLayoutType === 'WIRELAYOUT'
								|| strLayoutType === 'ACCTRFLAYOUT' || strLayoutType === 'WIRESWIFTLAYOUT'
								|| strLayoutType === 'MIXEDLAYOUT' || strLayoutType === 'CHECKSLAYOUT')
						&& getCurrencyMissMatchValueForViewOnly())
						chrDebitPaymentAmntFlag = cfg.value;
					$('.debitPaymentAmntFlag' + strPostFix).text( strValue
							+ ' : ');

			} else if (strFieldName === 'drCrFlag') {
				handleDrCrFlagOnViewPaymentInstrument(cfg, strPostFix, strValue);
				if(cfg.displayMode=='1'){
					$('.' + cfg.fieldName + cfg.value + strPostFix).addClass('hidden');
				}
				if (strLayoutType && (strLayoutType === 'ACCTRFLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT' || strLayoutSubType === 'DRAWDOWN'))
					toggleAccountLabel(null, cfg.value, true);
			} else if (strFieldName === 'rateType'
					|| strFieldName === 'contractRefNo') {
				if (getCurrencyMissMatchValueForViewOnly()) {
					if (strFieldName === 'rateType') {
						$(".rateType" + strPostFix + 'Div')
								.removeClass('hidden');
							$(".rateType" + strPostFix + 'Div')
									.removeClass('hidden');
							if (cfg.value && "1" === cfg.value){
								$(".contractRefNo" + strPostFix + 'Div')
										.removeClass('hidden');
								$(".fxRate" + strPostFix + 'Div')
										.addClass('hidden');
							}
							else if(cfg.value && "3" === cfg.value){
								$(".contractRefNo" + strPostFix + 'Div')
										.addClass('hidden');
								$(".fxRate" + strPostFix + 'Div')
										.removeClass('hidden');
							}
							else {
								$(".contractRefNo" + strPostFix + 'Div')
										.addClass('hidden');
								$(".fxRate" + strPostFix + 'Div')
										.addClass('hidden');
							}
						strRateType = strValue;	
					}
					if (strFieldName === 'contractRefNo') {
						if (strRateType && ( "1" === strRateType || "4" === strRateType))
							$(".contractRefNo" + strPostFix + 'Div')
									.removeClass('hidden');
						else			
							$(".contractRefNo" + strPostFix + 'Div')
									.addClass('hidden');
					}
					ctrl.html(strValue || ' ');			
				} else {
					$(".rateType" + strPostFix + 'Div').addClass('hidden');
					$(".contractRefNo" + strPostFix + 'Div').addClass('hidden');
				}
			} else if ((strFieldName === 'bankProduct')
					&& !isEmpty(strValue)) {
				var posOfCurrency = strValue.indexOf('(');
				var strCurrency = strValue.substr(posOfCurrency+1,3);
				strValue = strValue.substr(0,posOfCurrency-1);
				ctrl.attr('title',strCurrency);
				ctrl.html(strValue || '&nbsp;');
				handleLableChangeForPhisicalPaymentFields(cfg);
				handleDisplayPhysicalPaymentFields(strPrdID);
			} else if (strFieldName === 'defineApprovalMatrix'){
				// Handling for AVM Grid Start
				if(strValue === 'Y' && strEntryType === 'TEMPLATE' && !Ext.isEmpty(data && data.d
						&& data.d.paymentEntry 
						&& data.d.paymentEntry.templateApprovalMatrix)){
					$(".templateApprovalMatrix"+strPostFix).removeClass('hidden');
					defineAVMGrid('verify', 'Q');
				} else if(strValue === 'N'){
					$(".templateApprovalMatrix"+strPostFix).addClass('hidden');
				}
				// Handling for AVM Grid End
			} else if (strFieldName === 'activationTime'){
				if(Ext.isEmpty(cfg.value)){
					ctrlDiv = $('.' + strFieldName + strPostFix + 'Div');
					$(ctrlDiv).addClass('hidden');
				} else if(!Ext.isEmpty(cfg.value)){
					ctrl = $('.' + strFieldName + strPostFix);
					ctrl.html(strValue || '&nbsp;');
					$('[class*=activationTime]').removeClass('hidden');
				}
			} else if (strFieldName === 'txnCurrency' && strLayoutType === 'CASHLAYOUT'){
				ctrl.html(strValue || '&nbsp;');
				$('.totalDenomCcy_View').text('');
				$('.totalDenomCcy_View').text('('+ cfg.value +')');
			} else if(strFieldName === 'whtApplicable' || strFieldName === 'whtReqFlag'){
				if(cfg.value && cfg.value === 'Y'){
					$('#whtFieldsSectionInfoViewDiv').removeClass('hidden');
					$('.whtApplicable_InfoSpan').removeClass('hidden');
				} else{
					$('#whtFieldsSectionInfoViewDiv').addClass('hidden');
					$('.whtApplicable_InfoSpan').addClass('hidden');
				}
			}  else if(strFieldName === 'whtReqFlag'){
				if(cfg.value && cfg.value === 'Y'){
					$('#whtFieldsSectionInfoViewDiv').removeClass('hidden');
					$('.whtReqFlag_InfoSpan').removeClass('hidden');
				} else{
					$('#whtFieldsSectionInfoViewDiv').addClass('hidden');
					$('.whtReqFlag_InfoSpan').addClass('hidden');
				}
			} else if(strFieldName === 'drawerRegisteredFlag'){
				if(strValue != 'S'){
					$(".savedrawerCode" + strPostFix + 'Div').addClass('hidden');
				}
			} else if(strFieldName === 'payLocation' || strFieldName === 'printBranch')
			{
				if(strValue)
				{
					var availableValues=cfg.availableValues;
					if (availableValues) {
                        $.each(availableValues, function(index,item)
                        {
                            if(item.code == strValue)
                            {
                            	if(strFieldName === 'payLocation')
                            		strValue = item.code+':'+item.description;
                            	else
                            		strValue = item.description;
                                return false;
                            }
                        });
                    }
				}
				ctrl.html(strValue || '&nbsp;');
			} else {
				if (strFieldName === 'customId1' || strFieldName === 'customId2' || strFieldName === 'customId3')
				{
					ctrl.text(strValue || '');
				}
				else
					ctrl.html(strValue || '&nbsp;');
			}
		});
	}

	if(!isEmpty(chrDebitPaymentAmntFlag))
		paintDebitCcyAmount(cfgAmount,cfgDebitCcyAmount,chrDebitPaymentAmntFlag,strPostFix);

	if (data && data.d && data.d.paymentEntry
			&& data.d.paymentEntry.paymentHeaderInfo) {
		objHdrInfo = data.d.paymentEntry.paymentHeaderInfo;
		if (objHdrInfo) {
			strHdrEnteredNo = objHdrInfo.hdrEnteredNo;
			strHdrEnteredAmount = objHdrInfo.hdrEnteredAmount;
			strHdrTotalNo = objHdrInfo.hdrTotalNo;
			strTotalAmount = objHdrInfo.totalAmount;
		}

		if (objHdrInfo) {
			/*$('.bankProduct' + strPostFix)
					.html(objHdrInfo.hdrMyProductDescription || '');*/
			$('.productCuttOff' + strPostFix).html(objHdrInfo.hdrCutOffTime
					|| '');
			/*
			 * $('.templateName' + strPostFix).html(objHdrInfo.hdrTemplateName ||
			 * '');
			 */
			$('.templateType' + strPostFix).html(objHdrInfo.hdrTemplateType
					|| '');
			var prodDesc = null;
			prodDesc = objHdrInfo.hdrMyProductDescription;
			if('BILLPAYLAYOUT' === strLayoutType){
                 $('.hdrMyProductDescriptionTitle').attr("title",objHdrInfo.billerDesc);
                 $('.hdrMyProductDescriptionTitle').html(objHdrInfo.billerDesc || '');
            }else{
                 $('.hdrMyProductDescriptionTitle').attr("title",objHdrInfo.hdrMyProductDescription);
                 $('.hdrMyProductDescriptionTitle').html(prodDesc || '');
            }
			//$('.lastUpdateDateTimeText').html("You saved on "
			//		+ objHdrInfo.lastUpdateTime || '');

			if (strEntryType === 'PAYMENT' || strEntryType === 'SI')
				$('.batchStatusText').html((strPaymentType === 'QUICKPAY' ? "Status : " : "Batch Status : ")
						+ objHdrInfo.hdrStatus || '');
			$('.siStatus' + strPostFix).text(objHdrInfo.hdrStatus || '');

			/*
			 * if (objHdrInfo.hdrDrCrFlag) { var drCrFlag =
			 * objHdrInfo.hdrDrCrFlag; if (strLayoutType === 'ACCTRFLAYOUT')
			 * toggleAccountTransferAccountLabel(drCrFlag); if (drCrFlag ===
			 * 'B') { $('.drCrFlagC' + strPostFix + ',.drCrFlagD' + strPostFix)
			 * .removeClass(clsHide); } else if (drCrFlag === 'C' || drCrFlag
			 * === 'D') { $('.drCrFlag' + drCrFlag + strPostFix)
			 * .removeClass('hidden'); } else { $('.drCrFlagC' + strPostFix +
			 * ',.drCrFlagD' + strPostFix) .addClass(clsHide); } }
			 */

			if (objHdrInfo.hdrSource) {
				$('.hdrSource_HdrInfo').text(objHdrInfo.hdrSource || '');
			}
			if (!isEmpty(objHdrInfo.hdrTemplateNoOfExec)) {
				$('#templateNoOfExecSpanView')
						.html(objHdrInfo.hdrTemplateNoOfExec);
			} else {
				$('#templateNoOfExecSpanView').html('0');
			}
			
			if('BILLPAYLAYOUT' === strLayoutType){
				strBillerOrAggregator = objHdrInfo.isBiller;
				strReceiptFlag = objHdrInfo.receiptFlag;
			}
		}	
	}

	if (strEntryType === 'PAYMENT' || strEntryType === 'SI') {
		var Freq = null, gstrPeriod = null, gstrRef = null, strExecutionDate = null;
		if (arrStdFields) {
			var stdFieldData = arrStdFields;
			if (stdFieldData && stdFieldData.length > 0) {
				$.each(stdFieldData, function(index, cfg) {
							fieldId = cfg.fieldName;
							if (fieldId === 'period') {
								if (!isEmpty(cfg.value))
									gstrPeriod = cfg.value;
							}
							if (fieldId === 'refDay') {
								if (!isEmpty(cfg.value))
									gstrRef = cfg.value;
							}
							if (fieldId === 'siFrequencyCode') {
								if (!isEmpty(cfg.value))
									Freq = cfg.value;
							}
						});
			}
		}
		populateSIProcessingViewOnlyFields('Q', Freq, gstrPeriod, gstrRef,
				strPostFix);
		if (strEntryType === 'PAYMENT')
			toggleRecurringPaymentParameterDtlFieldsViewOnlySectionVisibility();
	}
	paintFXForDetailViewOnlySection();

	if (data && data.d && data.d.paymentEntry.beneficiary) {
		paintReceiverViewOnlyDetails(data.d.paymentEntry.beneficiary, objHdrInfo);
	}

	if (data.d && data.d.paymentEntry && data.d.paymentEntry.paymentCompanyInfo) {
		var objInfo = data.d.paymentEntry.paymentCompanyInfo;
		var strText = !isEmpty(objInfo.company) ? objInfo.company : '';
		strText += '<br/>'
				+ (!isEmpty(objInfo.companyAddress)
						? objInfo.companyAddress
						: '');
		$('.companyInfoHdr,.companyInfo').html(strText);
	}

	if (data.d.paymentEntry.additionalInfo) {
			canShowAdditionalInfoSection = paintPaymentAdditionalInformationViewOnly(data.d.paymentEntry.additionalInfo);
		}

	if (isExtraInfoAvailable) {
		$('.extraInfoAvailable_InfoSpan').removeClass('hidden');
		$('.noExtraInfoAvailable_InfoSpan').addClass('hidden');
	}

	if (data.d && data.d.paymentEntry && data.d.paymentEntry.enrichments) {
		canShowEnrichmentSection = paintPaymentEnrichmentsViewOnlyFields(data.d.paymentEntry.enrichments);
	}
	else {
		if (strLayoutType === 'TAXLAYOUT')
			canShowEnrichmentSection = true;
	}
	var noOfDenoms = 0;
	if (data.d.paymentEntry.cashwithdrawalDetails && data.d.paymentEntry.cashwithdrawalDetails.denomination) {
		noOfDenoms = paintPaymentDenominationsHelperViewOnly(data.d.paymentEntry.cashwithdrawalDetails.denomination,'','cashwithdrawal_InstViewDiv','');
		
	}
	if(noOfDenoms > 0)
			$('#cashwihdrawaldetailsView').removeClass('hidden');
		else
			$('#cashwihdrawaldetailsView').addClass('hidden');
	
	if(data.d.paymentEntry.whtFields && data.d.paymentEntry.whtFields.whtHeader)
		paintPaymentWHTHeaderFieldsViewOnly(data.d.paymentEntry.whtFields.whtHeader);	
		
	if(data.d.paymentEntry.whtFields && data.d.paymentEntry.whtFields.whtDetails){
		objWhtDetails = data.d.paymentEntry.whtFields.whtDetails;
		paintPaymentWHTAdditionalDetailsGrid(objWhtDetails,true);
	}
	if ((data.d.paymentEntry.billerDetails) && ('BILLPAYLAYOUT' === strLayoutType && 'A' === strBillerOrAggregator) ) {
        paintAggrigatorPaymentEnrichmentsViewOnly(data.d.paymentEntry.billerDetails);
        if(!isEmpty(data.d.paymentEntry.billerDetails.billerProductFields) && data.d.paymentEntry.billerDetails.billerProductFields.length > 0){
        	$('#billerProdViewDiv').removeClass('hidden');
        	paintBillerAggProductFieldViewMode(data.d.paymentEntry.billerDetails.billerProductFields);
        }
        else
        	$('#billerProdViewDiv').addClass('hidden');
    }
	
	showHideAddendaViewOnlySection(canShowEnrichmentSection,
			canShowAdditionalInfoSection);

	if (data && data.d && data.d.paymentEntry
			&& data.d.paymentEntry.paymentHeaderInfo
 			&& data.d.paymentEntry.paymentHeaderInfo.hdrIdentifier)
		paintPaymentDtlAdditionalInformationSection(
				data.d.paymentEntry.paymentHeaderInfo.hdrIdentifier, 'Q','VERIFY');
	toggleContainerVisibility('verificationStepDiv');
	toggleContainerVisibility('paymentVerifyExtraDiv');
	if(!isEmpty(strLayoutType) && strLayoutType==='WIRESWIFTLAYOUT')
		toggleSwiftSectionVisibility(strPostFix);
	
	if(data.d.paymentEntry.paymentMetaData._docUploadEnabled){
		if(data.d.paymentEntry.paymentMetaData._docUploadEnabled === 'Y'){
			//$("#uploadedFileDiv").removeClass('hidden');
			if(data.d.paymentEntry.paymentMetaData._docFileName){
				$("#uploadedFileDiv").removeClass('hidden');
				var docName = data.d.paymentEntry.paymentMetaData._docFileName;
				$("#uploadedFileLink").empty().append(docName);
				$("#uploadedFileLink").attr("title",docName);
			}
		}
	}
	
	if(strLayoutType === 'MIXEDLAYOUT'){
		handleElectronicAndPhysicalInstrumentFieldsHideAndShowView(data.d.paymentEntry);
	}
	if(strLayoutType && strLayoutType =='WIRESWIFTLAYOUT' && strLayoutSubType === 'DRAWDOWN')
	{
		$('#drawerDescriptionALbl,#drawerDescriptionRLbl').text( getLabel('debitPartyName','Debit Party Name'));
		$('#receiverCodeRInstLbl,#receiverCodeRLbl').text( getLabel('debitReceiverCode','Debit Party Code'));
	}
	if(strLayoutType === 'CHECKSLAYOUT'){
        handleBankToBankInformationSectionHideAndShowView(data.d.paymentEntry);
        handlePayOutDeliverySectionHideAndShowView(data.d.paymentEntry);
    }
}

function handleBankToBankInformationSectionHideAndShowView(data){
    arrFields = data.standardField;
    var paymentMetaData = data.paymentMetaData;
    var instrumentId = paymentMetaData.instrumentId;
    if (('01' === instrumentId || '02' === instrumentId || '07' === instrumentId) && displayBankToBankInformationSectionInfo(arrFields,instrumentId)) {
            $('#bankToBankInformationSectionInfoDivView').removeClass('hidden');    
        }
    else{
            $('#bankToBankInformationSectionInfoDivView').addClass('hidden');
        }
}

function handlePayOutDeliverySectionHideAndShowView(data){
    arrFields = data.standardField;
    var paymentMetaData = data.paymentMetaData;
    var instrumentId = paymentMetaData.instrumentId;
    if (('01' === instrumentId || '02' === instrumentId || '07' === instrumentId) && displayBankToBankInformationSectionInfo(arrFields,instrumentId)) {
            $('#payoutanddeliveryDetailsSectionInfoDivView').removeClass('hidden');    
        }
    else{
            $('#payoutanddeliveryDetailsSectionInfoDivView').addClass('hidden');
        }
}

function paintPaymentInstrumentViewOnlyFields(arrStdFields, strPostFix) {
	var ctrlDiv = null, isExtraInfoAvailable = false,cfgAmount = null, cfgDebitCcyAmount = null, chrDebitPaymentAmntFlag='';
	var strRateType = $('#rateType').val();
	if (arrStdFields) {
		$.each(arrStdFields, function(index, cfg) {
			strFieldName = cfg.fieldName;
			strValue = getValueToDispayed(cfg);
			strValue = !isEmpty(strValue) ? strValue : '';
			ctrl = $('.' + strFieldName + strPostFix);
			ctrlDiv = $('.' + strFieldName + strPostFix + 'Div');
			if (ctrlDiv && ctrlDiv.hasClass('hidden') && !isEmpty(cfg.displayMode) && '1' !=cfg.displayMode)
				ctrlDiv.removeClass('hidden');
			
			//dynamic binding of label field
			if(cfg.label && cfg.dataType != 'radio' && cfg.dataType != 'checkBox'){
				$("label[for=" +cfg.fieldName+ "]").text(cfg.label);
			}
			
			if (strFieldName === 'prenote')
			{
				if (strValue === 'Y' && strEntryType != "PAYMENT")
				{
					 ctrl.removeClass('hidden');
				}
				else
				{
					ctrl.addClass('hidden');
				}
			} else if (strFieldName === 'confidentialFlag'
					|| strFieldName === 'hold'
					|| strFieldName === 'holdUntilFlag') {
				if (strValue === 'Y')
					 ctrl.removeClass('hidden');
				else
					ctrl.addClass('hidden');

			} else if (strFieldName === 'drCrFlag') {
				handleDrCrFlagOnViewPaymentInstrument(cfg, strPostFix, strValue);
				if('1' == cfg.displayMode){
					ctrlDiv.addClass('hidden');
				}
			} else if (strFieldName === 'accountNo') {
				/*
				 * if (cfg.values && cfg.values.length > 1) {
				 * ctrl.html(cfg.values.length + '&nbsp;Selected')
				 * .attr('title', strValue); } else ctrl.html(strValue ||
				 * '').attr('title', '');
				 */

				if (cfg.values && cfg.values.length > 1) {
					strValue = strValue.replace(/,/g, '<br/>');
					ctrl.html(cfg.values.length + '&nbsp;Selected');
					$('.' + cfg.fieldName + strPostFix).each(function(i, obj) {
								$(this).addClass('t7-anchor');
								showToolTip($(this), strValue);
							});
					$('.' + cfg.fieldName + 'Title' + strPostFix)
							.html(cfg.values.length + '&nbsp;Selected');
					$('.' + cfg.fieldName + 'Title' + strPostFix).each(
							function(i, obj) {
								$(this).addClass('t7-anchor');
								showToolTip($(this), strValue);
							});
					if (strEntryType === 'PAYMENT' || strEntryType === 'SI')
						handleAccountNoRefreshLink(cfg);
				} else {
					$('.' + cfg.fieldName + strPostFix).each(function(i, obj) {
								$(this).removeClass('t7-anchor');
								destroyToolTip($(this));
							});
					ctrl.html(splitAccountSting(strValue));
					$('.' + cfg.fieldName + 'Title' + strPostFix).each(
							function(i, obj) {
								$(this).removeClass('t7-anchor');
								destroyToolTip($(this));
							});
					if ($('.' + cfg.fieldName + 'Title' + strPostFix + 'Div')
							.hasClass('hidden'))
						$('.' + cfg.fieldName + 'Title' + strPostFix + 'Div')
								.removeClass('hidden');
					$('.' + cfg.fieldName + 'Title' + strPostFix)
							.html(splitAccountStingForAccountName(strValue));
					if(strFieldName === 'accountNo')
					{
						ctrl.html(splitAccountSting(strValue));
					}
					else
					{
						ctrl.html(strValue);
					}

					if (strEntryType === 'PAYMENT' || strEntryType === 'SI')
						handleAccountNoRefreshLink(cfg);
				}

			} else if (strFieldName === 'lockFieldsMask') {
				var arrDispVal = strValue.split(',');
				if (arrDispVal && arrDispVal.length > 1) {
					strValue = strValue.replace(/,/g, '<br/>');
					ctrl.html(arrDispVal.length + '&nbsp;Selected');

					$('.' + cfg.fieldName + strPostFix).each(function(i, obj) {
								$(this).addClass('t7-anchor');
								showToolTip($(this), strValue);
							});
				} else {
					$('.' + cfg.fieldName + strPostFix).each(function(i, obj) {
								$(this).removeClass('t7-anchor');
								destroyToolTip($(this));
							});

					ctrl.html(strValue);
				}

			} else if (strFieldName === 'drawerAccountNo'
					&& (strLayoutType === 'ACCTRFLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT')) {
				ctrl.html(strValue || '');
				if (cfg.value) {
					var data = getAccountAsReceiverMoreDetails(strValue);
					if (data) {
						if (data.DESCRIPTION) {
							$('.drawerAccountNoName_InstView')
									.html(data.DESCRIPTION || '');
						}
						if (data.ACCOUNTCCY)
							$('.drawerAccountNoCcy_InstView')
									.html(data.ACCOUNTCCY || '');
					}
				}
			} else if ((strFieldName === 'phdNotes' || strFieldName === 'phdAlerts')
					&& !isEmpty(strValue)) {
				isExtraInfoAvailable = true;
			} else if (strFieldName === 'debitPaymentAmntFlag') {
				if(strLayoutType
						&& (strLayoutType === 'WIRELAYOUT'
								|| strLayoutType === 'ACCTRFLAYOUT'
								|| strLayoutType === 'MIXEDLAYOUT' || strLayoutType === 'CHECKSLAYOUT')
						&& getCurrencyMissMatchValueForViewOnly())
					chrDebitPaymentAmntFlag = cfg.value;	
				$('.debitPaymentAmntFlag' + strPostFix).text( strValue
						+ ' : ');
			} else if (strFieldName === 'amount') {
				cfgAmount = cfg;
				strValue = cfg.formattedValue ? cfg.formattedValue : strValue;
				ctrl.html(setDigitAmtGroupFormat(strValue) || '');
				var clsHide = 'hidden';
				if (gAmountTransferType === 'P') {
					$('.transactionWizardInnerDiv #thresholdAmountLabelHdr').removeClass(clsHide);
					$('.transactionWizardInnerDiv #amountLabelHdr').addClass(clsHide);
				} else {
					$('.transactionWizardInnerDiv #thresholdAmountLabelHdr').addClass(clsHide);
					$('.transactionWizardInnerDiv #amountLabelHdr').removeClass(clsHide);
				}
			} else if (strFieldName === 'debitCcyAmount') {
				cfgDebitCcyAmount = cfg;
				strValue = cfg.formattedValue ? cfg.formattedValue : strValue;
				ctrl.html(setDigitAmtGroupFormat(strValue) || '');
			} else if (strFieldName === 'rateType' || strFieldName ==='contractRefNo') {
				if (getCurrencyMissMatchValueForViewOnly()) {
					if (strFieldName === 'rateType') {
						$(".rateType" + strPostFix + 'Div')
								.removeClass('hidden');
									$(".rateType" + strPostFix + 'Div')
											.removeClass('hidden');
							if (cfg.value && "1" === cfg.value){
								$(".contractRefNo" + strPostFix + 'Div')
										.removeClass('hidden');
								$(".fxRate" + strPostFix + 'Div')
										.addClass('hidden');
							}
							else if(cfg.value && "3" === cfg.value){
								$(".contractRefNo" + strPostFix + 'Div')
										.addClass('hidden');
								$(".fxRate" + strPostFix + 'Div')
										.removeClass('hidden');
							}
							else if(cfg.value && "4" === cfg.value){
								$(".contractRefNo" + strPostFix + 'Div')
										.removeClass('hidden');
								$(".fxRate" + strPostFix + 'Div')
										.removeClass('hidden');
							}
							else {
								$(".contractRefNo" + strPostFix + 'Div')
										.addClass('hidden');
								$(".fxRate" + strPostFix + 'Div')
										.addClass('hidden');
							}
						strRateType = cfg.value;	
					}
					if (strFieldName === 'contractRefNo') {
						if (strRateType && ("1" === strRateType || "4" === strRateType))
							$(".contractRefNo" + strPostFix + 'Div')
									.removeClass('hidden');
						else			
							$(".contractRefNo" + strPostFix + 'Div')
									.addClass('hidden');
					}
					ctrl.html(strValue || ' ');			
				} else {
					$(".rateType" + strPostFix + 'Div').addClass('hidden');
					$(".contractRefNo" + strPostFix + 'Div').addClass('hidden');
				}
			} else if ((strFieldName === 'bankProduct')
					&& !isEmpty(strValue)) {
				txnWizardProduct = cfg.value ;
				txnWizardProductDesc = strValue ;
				var posOfCurrency = strValue.indexOf('(');
				var strCurrency = strValue.substr(posOfCurrency+1,3);
				strValue = strValue.substr(0,posOfCurrency-1);
				ctrl.attr('title',strCurrency);
				ctrl.html(strValue || '&nbsp;');
			} 
			else if ((strFieldName === 'referenceNo')
					&& !isEmpty(strValue)) {
				ctrl.addClass('wrap-word');
				ctrl.html(strValue || '&nbsp;');
			} else if (strFieldName === 'activationTime'){
				if(cfg.value === undefined || (!Ext.isEmpty(cfg.value) && cfg.value === "00:00")){
					ctrlDiv = $('.' + strFieldName + strPostFix + 'Div');
					$(ctrlDiv).addClass('hidden');
				} else if(!Ext.isEmpty(cfg.value)){
					ctrl = $('.' + strFieldName + strPostFix);
					ctrl.html(strValue || '&nbsp;');
					$('[class*=activationTime]').removeClass('hidden');
				}
			}  else if (strFieldName === 'txnCurrency' && strLayoutType === 'CASHLAYOUT'){
				ctrl.html(strValue || '&nbsp;');
				$('.totalDenomCcy_View').text('');
				$('.totalDenomCcy_View').text('('+ cfg.value +')');
			} else if(strFieldName === 'whtApplicable' ){
				if(cfg.value && cfg.value === 'Y'){
					$('#whtFieldsSectionInfoViewDiv').removeClass('hidden');
					$('.whtApplicable_InfoSpan').removeClass('hidden');
				} else{
					$('#whtFieldsSectionInfoViewDiv').addClass('hidden');
					$('.whtApplicable_InfoSpan').addClass('hidden');
				}
			} else if(strFieldName === 'whtReqFlag'){
				if(cfg.value && cfg.value === 'Y'){
					$('#whtFieldsSectionInfoViewDiv').removeClass('hidden');
					$('.whtReqFlag_InfoSpan').removeClass('hidden');
				} else{
					$('#whtFieldsSectionInfoViewDiv').addClass('hidden');
					$('.whtReqFlag_InfoSpan').addClass('hidden');
				}
			} else if(strFieldName === 'payLocation' || strFieldName === 'printBranch')
			{
				if(strValue)
				{
					var availableValues=cfg.availableValues;
					if (availableValues) {
                        $.each(availableValues, function(index,item)
                        {
                            if(item.code == strValue)
                            {
                            	if(strFieldName === 'payLocation')
                            		strValue = item.code+':'+item.description;
                            	else
                            		strValue = item.description;
                                return false;
                            }
                        });
                    }
				}
				ctrl.html(strValue || '&nbsp;');
			} else {
				if(strFieldName === 'txnDate'){
					strTxnDate = strValue;
				}
				
				if (strFieldName === 'customId1' || strFieldName === 'customId2' || strFieldName === 'customId3')
				{
					ctrl.text(strValue || '');
				}
				else
					ctrl.html(strValue || '&nbsp;');
				
			}
		});
		
		if( strLayoutType && strLayoutType =='ACHLAYOUT')
		{
			if(achSeccode == 'PPD' || achSeccode == 'PPDPLUS' || achSeccode == 'TEL' || achSeccode == 'WEB' || achSeccode == 'CIE' || achSeccode == 'CIEPLUS' || achSeccode == 'RCK')
			{
				$('#drawerDescriptionR_InstViewLbl').text( getLabel('editableGridIndivdualName','Individual Name'));
				if(achSeccode != 'RCK')
				$('#receiverIDR_InstViewLbl').text(getLabel('editableGridIndivdualID','Individual Identification Number'));
			}
		}
		if(strLayoutType && strLayoutType =='WIRESWIFTLAYOUT' && strLayoutSubType === 'DRAWDOWN')
		{
			$('#drawerDescriptionALbl,#drawerDescriptionRLbl').text( getLabel('debitPartyName','Debit Party Name'));
			$('#receiverCodeRInstLbl,#receiverCodeRLbl').text( getLabel('debitReceiverCode','Debit Party Code'));
		}
		if(!isEmpty(chrDebitPaymentAmntFlag))
			paintDebitCcyAmount(cfgAmount,cfgDebitCcyAmount,chrDebitPaymentAmntFlag,strPostFix);
			
		// Handle Verification Page Extra Info Label
		if (isExtraInfoAvailable) {
			$('.extraInfoAvailable_InfoSpan').removeClass('hidden');
			$('.noExtraInfoAvailable_InfoSpan').addClass('hidden');
		}
		if(strLayoutType === 'CASHLAYOUT'){
			//handleTotalDenomAmountCcy();
		}
	}
}
function paintPaymentInstrumentReceiverViewOnlyFields(arrStdFields, strPostFix) {
	var strBankAccountInfo = '', strCurrency = '', strAccountType = '', clsHide='hidden', strTag57Type='',strTag54Type = '', strTag56Type='';
	if (arrStdFields) {
		$.each(arrStdFields, function(index, cfg) {
			handleDisplayMode(cfg.displayMode, cfg.fieldName + 'V');
			strFieldName = cfg.fieldName;
			strValue = getValueToDispayed(cfg);
			strValue = isEmpty(strValue)
					? (cfg.value ? cfg.value : '')
					: strValue;
			// strValue = !isEmpty(strValue) ? strValue : '';
			ctrl = $('.' + strFieldName + strPostFix);
			
			paintRegisteredReceiverInfoFields(strFieldName, strPostFix, cfg);
			
			if (strFieldName === 'drawerAccountNo'
					&& (strLayoutType === 'ACCTRFLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT')) {
				ctrl.html(strValue || '');
				if (cfg.value) {
					var data = getAccountAsReceiverMoreDetails(strValue);
					if (data) {
						if (data.DESCRIPTION) {
							$('.drawerAccountNoName_InstView')
									.html(data.DESCRIPTION || '');
						}
						if (data.ACCOUNTCCY)
							$('.drawerAccountNoCcy_InstView')
									.html(data.ACCOUNTCCY || '');
					}
				}
			} else if((strFieldName == 'phyDrawerBankCode' || strFieldName == 'phyDrawerBranchCode') && !isEmpty(strValue) &&
                 (strLayoutType ==='CHECKSLAYOUT'|| strLayoutType ==='MIXEDLAYOUT'))
            {
                var availableValues=cfg.availableValues;
                if (availableValues) {
                    $.each(availableValues, function(index,item)
                    {
                        if(item.code == strValue)
                        {
                            strValue = item.code+' | '+item.description;
                            return false;
                        }
                    });
                }
               $(ctrl).text(strValue);
            }else if ((strFieldName === 'beneAccountType')
					&& !isEmpty(strLayoutType)
					&& (strLayoutType !== 'WIRELAYOUT' && strLayoutType !== 'WIRESIMPLELAYOUT')) {
				strAccountType = strValue;
			} else if (strFieldName === 'drawerCurrency') {
				strCurrency = strValue;
			} else if (strFieldName === 'beneficiaryBankIDType') {
				ctrl.html('(' + strValue + ')');
			}else if (strFieldName === 'anyIdType') {
				ctrl.html(strValue);
			}/* else if ((strFieldName === 'tag57Type'
					|| strFieldName === 'tag54Type' || strFieldName === 'tag56Type')
					&& strValue) {
				handleReceiverTagDetailsSectionForRegisteredReceiver(
						strPostFix, cfg, clsHide);
				if(strFieldName === 'tag57Type') strTag57Type=strValue;
				if(strFieldName === 'tag54Type') strTag54Type=strValue;
				if(strFieldName === 'tag56Type') strTag56Type=strValue;
				
			}*/
			else if ('saveBeneFlag' === strFieldName) {
				if ('Y' === strValue) {
					$('.savedrawerCode_InfoSpanDiv').removeClass('hidden');
				} else {
					$('.savedrawerCode_InfoSpanDiv').addClass('hidden');
				}
			}else {
				ctrl.html(strValue || '');
			}
		});
		if (strAccountType && strCurrency)
			strBankAccountInfo = '(' + strAccountType + ' ,' + strCurrency
					+ ')';
		else if (strAccountType)
			strBankAccountInfo = '(' + strAccountType + ')';
		else if (strCurrency)
			strBankAccountInfo = '(' + strCurrency + ')';

		$('.beneAccountInfo' + strPostFix).html(strBankAccountInfo);
		if (!isEmpty($('.beneficiaryBankDescriptionR_InstView').val())
				&& !isEmpty($('.beneficiaryBranchDescriptionR_InstView').val()))
			$('.beneficiaryBankDescriptionR_InstView')
					.text($('.beneficiaryBankDescriptionR_InstView').val()
							+ ' ,');
		//handleTagFieldValueSectionShowHide(strTag57Type,strTag54Type,strTag56Type);				
	}
}
function paintPaymentAdditionalInformation(data) {
	var clsHide = 'hidden', canShow = false, isExist = true;
	$('#additionalRefInfoDiv, #bankToBankInfoDiv, #orderingPartyInfoDiv, #additionlInfoSectionDiv')
			.addClass(clsHide);
	$('#AddRefInfo, #AddOrdInfo').addClass(clsHide); // Removed #AddBankInfo
	$('#AddRefInfoInnerDiv, #AddBankInfoInnerDiv').empty();

	if (data) {
		// if (data.additionalReferenceInfo) {
		// paintPaymentAdditionalInformationField(
		// data.additionalReferenceInfo, $('#AddRefInfoInnerDiv'));
		// $('#additionalRefInfoDiv').removeClass(clsHide);
		// canShow = true;
		// if (isExist) {
		// $('#additionalRefInfo').attr('checked', true);
		// $('#AddRefInfo').removeClass(clsHide);
		// }
		//
		// }
		// // Bank To Bank Information Reference
		// if (data.bankToBankInfo) {
		// if (data.bankToBankInfo.length > 0) {
		// paintPaymentAdditionalInformationField(data.bankToBankInfo,
		// $('#AddBankInfoInnerDiv'));
		// $('#bankToBankInfoDiv').removeClass(clsHide);
		// canShow = true;
		// if (isExist) {
		// $('#bankToBankInfo').attr('checked', true);
		// $('#AddBankInfo').removeClass(clsHide);
		// }
		// }
		// }
		// Ordering Party
		if (data.orderingParty) {
			$('#orderingPartyInfoDiv, .adhocOrderingParty, .registeredOrderingParty')
					.addClass(clsHide);
			paintPaymentAdditionalInfoOrderingPartyFields(data.orderingParty);
			$('#orderingPartyInfoDiv').removeClass(clsHide);
			if (strLayoutType === 'WIRESWIFTLAYOUT' || strLayoutType === 'WIRESIMPLELAYOUT' || strLayoutType === 'MIXEDLAYOUT')
				canShow = true;// Ordering Party section should be visible to
			// only WIRELAYOUT
			if (isExist) {
				$('#orderingPartyInfo').attr('checked', true);
				$('#AddOrdInfo').removeClass(clsHide);
			}
		}
		if (strLayoutType === 'TAXLAYOUT' || strLayoutType === 'ACCTRFLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT')
			canShow = false;// Additional Info section should be hidden for

		if (canShow) {
			$('#additionlInfoSectionDiv').removeClass(clsHide);
		}
		return canShow;
	}
}
function resetAdditionalInfoSection(){
	$('#AddRefInfoInnerDiv, #AddBankInfoInnerDiv').empty();
}
function paintPaymentAdditionalInformationViewOnly(data, isViewOnly) {
	var canShowOrderingParty = false, canShowAdditionalRefInfo = false, canShowBankToBankInfo = false, clsHide = 'hidden', canShow = false;
	if (data.orderingParty) {
		canShowOrderingParty = paintPaymentAdditionalInfoOrderingPartyViewOnlyFields(data.orderingParty);
	}
	// Additional Info
	// if (data.additionalReferenceInfo && data.additionalReferenceInfo.length >
	// 0)
	// {
	// paintPaymentAdditionalInformationViewOnlyField(
	// data.additionalReferenceInfo, $('#AddRefInfoInnerDiv_InstView'));
	// $('#additionalRefInfoDiv_InstView').removeClass(clsHide);
	// canShowAdditionalRefInfo = true;
	// $('#additionalRefInfo_InstView').attr('checked', true);
	// $('#AddRefInfo_InstView').removeClass(clsHide);
	//
	// }
	// // Bank To Bank Information Reference
	// if (data.bankToBankInfo && data.bankToBankInfo.length > 0) {
	// paintPaymentAdditionalInformationViewOnlyField(data.bankToBankInfo,
	// $('#AddBankInfoInnerDiv_InstView'));
	// $('#bankToBankInfoDiv_InstView').removeClass(clsHide);
	// canShowBankToBankInfo = true;
	// $('#bankToBankInfo_InstView').attr('checked', true);
	// $('#AddBankInfo_InstView').removeClass(clsHide);
	// }

	if (strLayoutType === 'ACCTRFLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT') {
		canShowOrderingParty = false;
		canShowAdditionalRefInfo = false;
		canShowBankToBankInfo = false;
	}
	if(strLayoutType === 'WIRESWIFTLAYOUT' || strLayoutType === 'MIXEDLAYOUT')
		canShowAdditionalRefInfo = true;
	if (canShowOrderingParty || canShowAdditionalRefInfo
			|| canShowBankToBankInfo)
		canShow = true;

	if (canShow)
		$('#additionlInfoSectionDiv_InstView').removeClass('hidden');
	
	if(strLayoutType === 'WIRESWIFTLAYOUT' && canShowOrderingParty){
		$('#orderingPartyMoreDetailsViewOnlyLink').click();
	}

	return canShow;
}
function paintPaymentAdditionalInfoOrderingPartyFields(data) {
	var arrFields = [];
	var strDisplayMode = null, fieldId = null, lblId = null;
	var blnOnlyRegisteredOrderingParty = false;
	var regDivSuffix = '_ORDiv';
	var regLblSuffix = '_ORLbl';
	var adhSuffix = '_OA';
	var regSuffix = '_ORInfo';
	var mainDivId = 'registeredOrderingPartyDetails';
	var linkIdSuffix = 'Link';
	if (data) {
		if (data.registeredOrderingParty) {
			arrFields = data.registeredOrderingParty;
			if (arrFields && arrFields.length > 0) {

				$.each(arrFields, function(index, cfg) {
					fieldId = cfg.fieldName;
					strDisplayMode = cfg.displayMode;
					handleDisplayMode(strDisplayMode, fieldId);
					handleFieldPopulation(cfg, cfg.fieldName);
					if (fieldId === 'emailIdNmbr') {
						if ($("#" + lblId).length != 0) {
							$("#" + lblId).text(cfg.value);
						}
					}
					if (fieldId === 'orderingParty') {
						$('#orderingPartyMoreDetails' + linkIdSuffix)
								.unbind('click');
						$('#orderingPartyMoreDetails' + linkIdSuffix).bind(
								'click', function() {
									doPaintMoreDetailsForRegisteredOrderingParty(
											cfg.value, mainDivId);
								});
					}
						// TODO : Ordering Party Email to be set
				});
			}
		}
		arrFields = [];
		if (data.adhocOrderingParty) {
			isAdhocOrderingPartyAllowed = true;
			arrFields = data.adhocOrderingParty;
			if (arrFields && arrFields.length > 0) {
				$.each(arrFields, function(index, cfg) {
							fieldId = cfg.fieldName;
							handleDisplayMode(cfg.displayMode, fieldId
											+ adhSuffix);
							handleDisplayMode(cfg.displayMode, fieldId + regSuffix);
							handleFieldPopulation(cfg, cfg.fieldName
											+ adhSuffix);
							if(cfg.apiDependent)
							{
								doHandleApiCall(cfg,adhSuffix);
							}
				});
			}
		} else {
			blnOnlyRegisteredOrderingParty = true;
		}
		if (!isEmpty(data.orderingPartyRegisteredFlag)) {
			if (data.orderingPartyRegisteredFlag == 'N'
					|| data.orderingPartyRegisteredFlag == 'A') {
				$("#cbRegristeredOrderingParty").attr("checked", false);
				$("#cbAdhocOrderingParty").attr("checked", true);
				toggleOrderingParty('A', false);
			}
			else if('S' === data.orderingPartyRegisteredFlag)
			{
				$("#cbRegristeredOrderingParty").attr("checked", false);
				$("#cbAdhocOrderingParty").attr("checked", true);
				toggleOrderingParty('A', false);
				$("#saveOrderingParty_OA").attr("checked", true);
				toggleOrderingPartyCodeNecessity();
			}
			else if (data.orderingPartyRegisteredFlag == 'Y'
					|| data.orderingPartyRegisteredFlag == 'R') {
				$("#cbRegristeredOrderingParty").attr("checked", true);
				$("#cbAdhocOrderingParty").attr("checked", false);
				toggleOrderingParty('R', false);
				if (blnOnlyRegisteredOrderingParty) {
					$('#switchToAdhocOrderingPartyLink').addClass('hidden');
				}
			}
		} else {
			if (blnOnlyRegisteredOrderingParty) {
				$('.adhocOrderingParty, #switchToAdhocOrderingPartyLink')
						.empty();
				toggleOrderingParty('R', false);
			} else
				toggleOrderingParty('A', false);
		}
	}
}
function paintPaymentAdditionalInfoOrderingPartyViewOnlyFields(data) {
	var arrFields = [];
	var strDisplayMode = null, divId = null, fieldId = null, lblId = null, canShow = false;
	var clsHide = 'hidden';
	var DivSuffix = '_OVInfoDiv';
	var LblSuffix = '_OVInfoLbl';
	var mainDivId = 'viewOrderingPartyMoreDetailsDiv';
	var linkIdSuffix = 'ViewOnlyLink';
	var regSuffix = '_OVInfo';
	if (data && data.orderingPartyRegisteredFlag) {
		if ('R' === data.orderingPartyRegisteredFlag && data.registeredOrderingParty) {
			arrFields = data.registeredOrderingParty;
		}
		if (('A' === data.orderingPartyRegisteredFlag || 'S' === data.orderingPartyRegisteredFlag) 
				&& data.registeredOrderingParty) {
			arrFields = data.adhocOrderingParty;
		}
		if (arrFields && arrFields.length > 0) {
			$.each(arrFields, function(index, cfg) {
				fieldId = cfg.fieldName;
				strDisplayMode = cfg.displayMode;
				handleDisplayMode(strDisplayMode, fieldId + "_OVInfo");
				divId = fieldId + DivSuffix;
				lblId = fieldId + LblSuffix;
				if ($("#" + lblId).length != 0) {
					$("#" + lblId).text(cfg.value);
				}
				if (fieldId === 'orderingParty' && !isEmpty(cfg.value)) {
					canShow = true;
					$('#orderingPartyMoreDetails' + linkIdSuffix).unbind('click');
					$('#orderingPartyMoreDetails' + linkIdSuffix).bind('click', function() {
						doPaintMoreDetailsForRegisteredOrderingParty(cfg.value, mainDivId, true);
					});
					$('#orderingPartyMoreDetails' + linkIdSuffix).trigger('click');
				}
			});
		}
		if ('R' === data.orderingPartyRegisteredFlag && data.registeredOrderingParty && data.adhocOrderingParty) {
			adhocCustomFieldHide(data.adhocOrderingParty,regSuffix);
		}
	}
	if (canShow)
		$('#orderingPartyInfoDiv_InstView').removeClass(clsHide);
	return canShow;
}
function paintPaymentAdditionalInformationField(arrFields, targetDiv) {
	var field = null, label = null, div = null, innerDiv = null;
	if (arrFields) {
		$.each(arrFields, function(index, cfg) {
					div = $('<div>').attr({
								'class' : 'col-sm-4 ',
								'id' : cfg.fieldName + 'Div'
							});
					innerDiv = $('<div>').attr({
								'class' : 'form-group ',
								'id' : cfg.fieldName + '_InnerDiv'
							});
					label = $('<label>').attr({
								'class' : 'fieldLabel',
								'id' : cfg.fieldName + 'Lbl',
								'for' : cfg.fieldName
							});
					label.text(cfg.label);
					field = createAdditionalInfoField(cfg);
					if (field) {
						field.attr('class', 'form-control');
						if (cfg.displayMode == '3')
							label.addClass('required');
						label.attr('for', field.id);
						label.appendTo(innerDiv);
						if (cfg && !isEmpty(cfg.value))
							field.val(cfg.value);
						field.appendTo(innerDiv);
						innerDiv.appendTo(div);
						div.appendTo(targetDiv);
					}
				});
	}
}
function paintPaymentAdditionalInformationViewOnlyField(arrFields, targetDiv) {
	var label = null, div = null, innerDiv = null, strValue = null, valueSpan = null;
	if (arrFields) {
		$(targetDiv).empty();
		$.each(arrFields, function(index, cfg) {
					div = $('<div>').attr({
								'class' : 'col-sm-4 ',
								'id' : cfg.fieldName + 'Div_InstView'
							});
					innerDiv = $('<div>').attr({
								'class' : 'form-group ',
								'id' : cfg.fieldName + '_InnerDiv_InstView'
							});
					label = $('<label>').attr({
								'class' : 'fieldLabel',
								'id' : cfg.fieldName + 'Lbl',
								'for' : cfg.fieldName
							});
					label.text(cfg.label + ' : ');
					strValue = getValueToDispayed(cfg);
					// TODO : ellipsis
					valueSpan = $('<span>').html(!isEmpty(strValue)
							? strValue
							: '');
					$(valueSpan).attr('id', cfg.fieldName);
					// valueSpan = createAdditionalInfoField(cfg);
					if (valueSpan) {
						// field.attr('class', 'form-control');
						if (cfg.displayMode == '3')
							label.addClass('required');
						label.attr('for', valueSpan.id);
						label.appendTo(innerDiv);
						valueSpan.appendTo(innerDiv);
						innerDiv.appendTo(div);
						div.appendTo(targetDiv);
					}
				});
	}
}
function paintPaymentEnrichmentsViewOnlyFields(objData) {
	var data = objData;
	var setNameMap = {}, isVisible = false, isVisibleTransAddenda = false, clsHide = 'hidden', intConterForTransAddenda = 1, intCounter = 1, strTargetId = 'addendaInfoEnrichDiv_InstView', strTransAddendaTargetId = 'addendaInfoEnrichInTransctionDiv_InstView';
	// Edit Instrument Enrichments Cleared here
	$('#addendaInfoEnrichDiv, #bankProductMultiSetEnrichDiv, #myProductMultiSetEnrichDiv, #clientMultiSetEnrichDiv , #addendaInfoEnrichInTransctionDiv')
			.empty();
	$('#addendaInfoEnrichDiv_InstView, #bankProductMultiSetEnrichDiv_InstView, #myProductMultiSetEnrichDiv_InstView, #clientMultiSetEnrichDiv_InstView , #addendaInfoEnrichInTransctionDiv_InstView')
			.empty();
	mapEnrichSet = {};
	if (data.udeEnrichment && data.udeEnrichment.parameters) {
		paintPaymentEnrichmentAsSetNameViewOnly(mapEnrichSet,
				data.udeEnrichment.parameters, strTargetId);
		isVisible = true;
	}

	if (data.productEnrichment && data.productEnrichment.parameters) {
		paintPaymentEnrichmentAsSetNameViewOnly(mapEnrichSet,
				data.productEnrichment.parameters, strTargetId);
		isVisible = true;
	}

	if (data.myproductEnrichment && data.myproductEnrichment.parameters) {
		paintPaymentEnrichmentAsSetNameViewOnly(mapEnrichSet,
				data.myproductEnrichment.parameters, strTargetId);
		isVisible = true;
	}
	// billpay enrichments view handling starts
	if (data.clientEnrichment && data.clientEnrichment.parameters) {
		if ('BILLPAYLAYOUT' === strLayoutType && 'B' === strBillerOrAggregator ) {
			paintBillPaymentEnrichmentsViewOnly(data);
		}// billpay enrichments view handling ends		
		else {
			paintPaymentEnrichmentAsSetNameViewOnly(mapEnrichSet,
					data.clientEnrichment.parameters, strTargetId);
			isVisible = true;
		}
	} 
	if (data.productEnrichmentStdFields
			&& data.productEnrichmentStdFields.parameters) {
		intConterForTransAddenda = paintPaymentEnrichmentsHelperViewOnly(
				data.productEnrichmentStdFields.parameters,
				intConterForTransAddenda, strTransAddendaTargetId, 'Q');
		isVisibleTransAddenda = false;
	}
	if (data.myproductEnrichmentStdFields
			&& data.myproductEnrichmentStdFields.parameters) {
		intConterForTransAddenda = paintPaymentEnrichmentsHelperViewOnly(
				data.myproductEnrichmentStdFields.parameters,
				intConterForTransAddenda, strTransAddendaTargetId, 'Q');
		isVisibleTransAddenda = false;
	}
	if (data.clientEnrichmentStdFields
			&& data.clientEnrichmentStdFields.parameters) {
		intConterForTransAddenda = paintPaymentEnrichmentsHelperViewOnly(
				data.clientEnrichmentStdFields.parameters,
				intConterForTransAddenda, strTransAddendaTargetId, 'Q');
		isVisibleTransAddenda = false;
	}
	resetMultiSetEnrichVariable();
	if (data.myProductMultiSet && data.myProductMultiSetMetadata) {
		paintPaymentMyProductMultiSetEnrichments(
				data.myProductMultiSet,data.myProductMultiSetMetadata, intCounter,
				'myProductMultiSetEnrichDiv_InstView', 'Q', true);
		isVisible = true;
	}
	if (data.bankProductMultiSet && data.bankProductMultiSetMetadata) {
		paintPaymentBankProductMultiSetEnrichments(
				data.bankProductMultiSet,data.bankProductMultiSetMetadata, intCounter,
				'bankProductMultiSetEnrichDiv_InstView', 'Q', true);
		isVisible = true;
	}
	if (data.clientMultiSet && data.clientMultiSetMetadata) {
		paintPaymentClientProductMultiSetEnrichments(
				data.clientMultiSet,data.clientMultiSetMetadata, intCounter,
				'clientMultiSetEnrichDiv_InstView', 'Q', true);
		isVisible = true;
	}
	
	if (isVisibleTransAddenda) {
		$('#addendaInfoEnrichInTransctionDiv_InstView').removeClass(clsHide);
	}
	if (isVisible) {
		$('#AddBankInfo_InstView').removeClass(clsHide);// addendaSectionDiv_InstView
	}

	if ((isVisibleTransAddenda || isVisible) && strLayoutType != 'ACCTRFLAYOUT' && strLayoutType !== 'SIMPLEACCTRFLAYOUT')
		$('#addendaInfoDiv_InstView').removeClass(clsHide);
	
	if (!isVisible && 'TAXLAYOUT' === strLayoutType) {
		isVisible = verifyPaymentCustomizationEnrich(data);
	}

	return (isVisibleTransAddenda || isVisible);
}
function paintPaymentEnrichmentAsSetNameViewOnly(setNameMap, arrPrdEnr,
		strTargetId) {
	if (strLayoutType === 'WIRELAYOUT' || strLayoutType === 'WIRESIMPLELAYOUT') {
		var arrWireEnrichments = new Array(), arrPrdEnrDummy = new Array();
		if (arrPrdEnr) {
			$.each(arrPrdEnr, function(index, cfg) {
				if (cfg.enrichmentSetName
						&& (cfg.enrichmentSetName === 'BANK TO BANK INFO' || cfg.enrichmentSetName === 'INSTRUCTION CODE'))
					arrWireEnrichments.push(arrPrdEnr[index]);
				else
					arrPrdEnrDummy.push(arrPrdEnr[index]);
			});
		}
		paintPaymentEnrichmentAsSetNameNonWireLayoutViewOnly(setNameMap,
				arrPrdEnrDummy, strTargetId);
		paintPaymentEnrichmentAsSetNameWireLayoutViewOnly(setNameMap,
				arrWireEnrichments, strTargetId);
	} else
		paintPaymentEnrichmentAsSetNameNonWireLayoutViewOnly(setNameMap,
				arrPrdEnr, strTargetId);
}
function paintPaymentEnrichmentAsSetNameNonWireLayoutViewOnly(setNameMap,
		arrPrdEnr, strTargetId) {
	var valueSpan = null, targetDiv = $('#' + strTargetId), label = null, div = null, innerDiv = null, intCnt, tempObj, mainDiv = null, fieldSetDiv = null, fieldset = null, legend = null;
	var strSetName = null, enrField = null, enrFieldSeqNo = 0;
	var colCls = (strLayoutType === 'WIRESWIFTLAYOUT' || strLayoutType === 'ACHIATLAYOUT') ? 'col-sm-6' : 'col-sm-4';
	var chkBoxDiv = null, chkBoxLbl = null, wrapperDiv = null, strValue = null, internalWrapperDiv = null, internalShadedDiv = null;
	// if (strLayoutType === 'WIRELAYOUT') {
	// paintPaymentEnrichmentAsSetNameWireLayoutViewOnly(setNameMap,
	// arrPrdEnr, strTargetId);
	// } else {
	if (arrPrdEnr && !isEmpty(targetDiv) && targetDiv.length > 0) {
		$.each(arrPrdEnr, function(index, cfg) {
			if (cfg.enrichmentSetName) {
				strSetName = (cfg.enrichmentSetName).replace(/ /g, '_');
				if (setNameMap[strSetName]) {
					tempObj = setNameMap[strSetName];
				} else {
					targetDiv.removeClass('hidden');
					wrapperDiv = $('<div>').attr({
								'id' : strSetName + '_WrapperDiv'
							}).appendTo(targetDiv);

					fieldSetDiv = $('<div>').attr({
								'class' : 'col-sm-12 ',
								'id' : strSetName + '_FieldSetDiv'
							}).appendTo(wrapperDiv);

					chkBoxDiv = $('<div>').attr({
								'id' : strSetName + '_ChkBoxDiv'
							}).appendTo(fieldSetDiv);

					chkBoxLbl = $('<label>').attr({
								'style' : 'font-style:italic'
							}).appendTo(chkBoxDiv);

					if (strLayoutType === 'WIRELAYOUT' || strLayoutType === 'WIRESIMPLELAYOUT')
						$('<i>').attr({
									'class' : 'fa fa-check'
								}).appendTo(chkBoxLbl);

					/*
					 * $('<input>').attr({ 'type' : 'checkbox', 'id' :
					 * strSetName + '_ChkBox', 'checked' : true }).on('click',
					 * function() { // $('#' + strSetName).toggle('hidden'); var
					 * strId = $(this).attr('id'); if (strId) { strId =
					 * strId.replace('_ChkBox', ''); $('#' +
					 * strId).toggleClass('hidden'); } }).appendTo(chkBoxLbl);
					 */

					//chkBoxLbl.append(' ' + cfg.enrichmentSetName);

					internalWrapperDiv = $('<div>').attr({
								'id' : strSetName
										+ '_InternalWrapperViewOnlyDiv',
								'class' : 'col-sm-12 '
							}).appendTo(wrapperDiv);

					//internalShadedDiv = $('<div>').attr({
					//			'id' : strSetName + '_shadedViewOnlyDiv',
					//			'class' : 'well'
					//		}).appendTo(internalWrapperDiv);

					mainDiv = $('<div>').attr({
								'id' : strSetName,
								'class' : 'row'
							}).appendTo(internalWrapperDiv);

					tempObj = {};
					tempObj['mainDiv' + strSetName] = mainDiv;
					tempObj['fieldSetDiv' + strSetName] = fieldSetDiv;
					tempObj[strSetName + 'Counter'] = 1;
					setNameMap[strSetName] = tempObj;
				}
				if (!isEmpty(tempObj)) {
					intCnt = tempObj[strSetName + 'Counter'];
					if (cfg.enrichmentType == 'S' || cfg.enrichmentType == 'M') {
						var strAdditionalHelperCls = (!isEmpty(cfg.displayType)
								&& (cfg.displayType === 10
								|| cfg.displayType === 11))
								? 'smallEnrichDiv'
								: '';
						div = $('<div>').attr({
									'class' : colCls +' '+ strAdditionalHelperCls,
									'id' : cfg.code + 'Div'
								});
						innerDiv = $('<div>').attr({
									'class' : 'form-group',
									'id' : cfg.code + '_InnerDiv'
								});
						
						if(!isEmpty(cfg.displayType) && cfg.displayType != 10)		
							label = $('<label>').html(cfg.description);
						else	
							label = $('<label>').html("");
						

						strValue = getEnrichValueToDispayed(cfg);
						if(!isEmpty(strValue))
						{
							if(strValue.length < 60)
							{
								strValue = strValue +'&nbsp;<br/><br/>';
							}
						}
						else
						{
							strValue = '&nbsp;<br/><br/>';
						}

						valueSpan = $('<div class ="largeText">').html(' ' + strValue);						

						if (valueSpan) {
							label.attr('for', cfg.code);
							// if (cfg.mandatory == true)
							// label.addClass('required');
							label.appendTo(innerDiv);

							valueSpan.appendTo(innerDiv);
							innerDiv.appendTo(div);
							if (!isEmpty(cfg.sequenceNmbr)) {
								var seqno = cfg.sequenceNmbr;
								if (seqno % 2 != 0) {
									if (cfg.displayType === 9)// LONGTEXTBOX
									{
										div
												.attr('style',
														'overflow:visible;overflow-wrap:break-word;');
									} else {
										if (!isEmpty(cfg.displayType)
												&& cfg.displayType != 10
												&& cfg.displayType != 11) {
											div.addClass(colCls);
										} else {
											var strAdditionalHelperCls = 'smallEnrichDiv';
											div.addClass(colCls
													+' '+ strAdditionalHelperCls);
										}
									}
									div
											.appendTo(tempObj['mainDiv'
													+ strSetName]);
									if (arrPrdEnr.length > 1) {
										enrField = arrPrdEnr[index + 1];
										enrFieldSeqNo = enrField
												? enrField.sequenceNmbr
												: 1; // 1 if index is 1;

										if (enrFieldSeqNo % 2 != 0) {
											if (cfg.displayType !== 9)// LONGTEXTBOX
												$('<div>')
														.attr({
																	'class' : colCls
																})
														.appendTo(tempObj['mainDiv'
																+ strSetName]);
										}
									} else {
										if (cfg.displayType !== 9)// LONGTEXTBOX
											$('<div>').attr({
														'class' : 'col-sm-12'
													})
													.appendTo(tempObj['mainDiv'
															+ strSetName]);
									}

								} else if (seqno % 2 == 0) {
									if (arrPrdEnr.length > 1) {
										enrField = arrPrdEnr[index - 1];
										enrFieldSeqNo = enrField
												? enrField.sequenceNmbr
												: 2; // 2 if index is 1
										if (enrFieldSeqNo % 2 == 0) {
											$('<div>').attr({
														'class' : colCls
													})
													.appendTo(tempObj['mainDiv'
															+ strSetName]);
										}

									} else {
										$('<div>').attr({
													'class' : colCls
												}).appendTo(tempObj['mainDiv'
												+ strSetName]);
									}

									div
											.appendTo(tempObj['mainDiv'
													+ strSetName]);
								}
							}
						}
					}
				}
				tempObj[strSetName + 'Counter'] = intCnt;
			}
		});
	}
	// }
}
function paintPaymentEnrichmentAsSetNameWireLayoutViewOnly(setNameMap,
		arrPrdEnr, strTargetId) {
	var field = null, dependentField = null, targetDiv = $('#' + strTargetId), label = null, div = null, innerDiv = null, inlineDiv = null, intCnt, tempObj, mainDiv = null, fieldSetDiv = null, fieldset = null, legend = null;
	var strSetName = null, enrField = null, enrFieldSeqNo = 0, strValue = null, strDependentFldValue = null;
	var colCls = 'col-sm-6';
	var chkBoxDiv = null, chkBoxLbl = null, wrapperDiv = null, internalWrapperDiv = null, internalShadedDiv = null;

	if (arrPrdEnr) {
		for (var i = 0; i < arrPrdEnr.length; i = i + 2) {
			cfg = arrPrdEnr[i];
			if (cfg.enrichmentSetName) {
				strSetName = (cfg.enrichmentSetName).replace(/ /g, '_');
				if (setNameMap[strSetName]) {
					tempObj = setNameMap[strSetName];
				} else {
					targetDiv.removeClass('hidden');
					wrapperDiv = $('<div>').attr({
								'id' : strSetName + '_WrapperDiv'
							}).appendTo(targetDiv);

					fieldSetDiv = $('<div>').attr({
								'class' : 'col-sm-12 ',
								'id' : strSetName + '_FieldSetDiv'
							}).appendTo(wrapperDiv);

					chkBoxDiv = $('<div>').attr({
								'id' : strSetName + '_ChkBoxDiv'
							}).appendTo(fieldSetDiv);

					chkBoxLbl = $('<label>').attr({
								'style' : 'font-style:italic;font-weight: bold;'
							}).appendTo(chkBoxDiv);

					$('<i>').attr({
								'class' : 'fa fa-check'
							}).appendTo(chkBoxLbl);

					/*
					 * $('<input>').attr({ 'type' : 'checkbox', 'id' :
					 * strSetName + '_ChkBox', 'checked' : true }).on('click',
					 * function() { // $('#' + strSetName).toggle('hidden'); var
					 * strId = $(this).attr('id'); if (strId) { strId =
					 * strId.replace('_ChkBox', ''); $('#' +
					 * strId).toggleClass('hidden'); } }).appendTo(chkBoxLbl);
					 */

					chkBoxLbl.append(' ' + cfg.enrichmentSetName);

					internalWrapperDiv = $('<div>').attr({
								'id' : strSetName + '_InternalWrapperDiv',
								'class' : 'col-sm-12 '
							}).appendTo(wrapperDiv);

					internalShadedDiv = $('<div>').attr({
								'id' : strSetName + '_shadedDiv',
								'class' : 'well'
							}).appendTo(internalWrapperDiv);

					mainDiv = $('<div>').attr({
								'id' : strSetName,
								'class' : 'row'
							}).appendTo(internalShadedDiv);

					tempObj = {};
					tempObj['mainDiv' + strSetName] = mainDiv;
					tempObj['fieldSetDiv' + strSetName] = fieldSetDiv;
					tempObj[strSetName + 'Counter'] = 1;
					setNameMap[strSetName] = tempObj;
				}
				if (!isEmpty(tempObj)) {
					intCnt = tempObj[strSetName + 'Counter'];
					if (cfg.enrichmentType == 'S' || cfg.enrichmentType == 'M') {
						var strAdditionalHelperCls = (!isEmpty(cfg.displayType)
								&& (cfg.displayType === 10
								|| cfg.displayType === 11))
								? 'smallEnrichDiv'
								: '';
						div = $('<div>').attr({
									'class' : colCls + ' ' +strAdditionalHelperCls,
									'id' : cfg.code + 'Div'
								});
						innerDiv = $('<div>').attr({
									'class' : 'form-group',
									'id' : cfg.code + '_InnerDiv'
								});
						label = $('<label>').html(cfg.description + ' : ');
						inlineDiv = $('<div>').attr({
									'class' : 'form-inline'
								});
						field = $('<span>').attr({
									'class' : '',
									'id' : cfg.code + '_EnrichInfoSpan',
									'title':cfg.value
								});; // createEnrichMentField(cfg);
						/*
						 * if (cfg.enableDisable != null) { if
						 * (cfg.enableDisable == 'disable') {
						 * field.attr('disabled', true); } else if
						 * (cfg.enableDisable == 'enable') {
						 * field.attr('disabled', false); } }
						 */
						if (field) {
							label.attr('for', cfg.code);
							if (cfg.mandatory == true)
								label.addClass('required');
							label.appendTo(innerDiv);
							// $('<br/>').appendTo(div);
							if (cfg.enrichmentType === 'S') {
								if ('A' === cfg.includeInTotal
										|| 'S' === cfg.includeInTotal) {
									handleAmmountCalculationOnSingleSetEnrichment(
											field, cfg);
								}
								if (!isEmpty(cfg.apiName))
									handlePageRefreshOnSingleSetEnrichmentChange(
											field, cfg);
								/*
								 * else if (strLayoutType === 'TAXLAYOUT')
								 * handleAmmountCalculationOnSingleSetEnrichment(
								 * field, cfg);
								 */
							} else if (cfg.enrichmentType === 'M'
									&& !isEmpty(cfg.apiName))
								handlePageRefreshOnMultiSetEnrichmentChange(
										field, cfg, argsData,cfg.enrichmentType);
							field.appendTo(inlineDiv);
							if (cfg.value) {
								strValue = getEnrichValueToDispayed(cfg);
								field.html(' ' + strValue);
							}
							// field.attr('class', 'form-control');
							field.attr('style', 'width:29%;margin-right:5px;');
							if (i + 1 < arrPrdEnr.length) {
								dependentFieldObj = arrPrdEnr[i + 1];
								if (dependentFieldObj) {
									var dependentField = $('<span>').attr({
										'id' : dependentFieldObj.code
												+ '_EnrichInfoSpan'
									});// createEnrichMentField(dependentFieldObj);
									if (dependentFieldObj.enableDisable != null) {
										if (dependentFieldObj.enableDisable == 'disable') {
											dependentField.attr('disabled',
													true);
										} else if (dependentFieldObj.enableDisable == 'enable') {
											dependentField.attr('disabled',
													false);
										}
									}
									if (dependentFieldObj.value) {
										strDependentFldValue = getEnrichValueToDispayed(dependentFieldObj);
										dependentField
												.html(strDependentFldValue);
									}
									// dependentField.attr('class',
									// 'form-control');
									dependentField.attr('style', 'width:68%');
									dependentField.appendTo(inlineDiv);
								}
							}
							inlineDiv.appendTo(innerDiv);
							innerDiv.appendTo(div);
							if (!isEmpty(cfg.sequenceNmbr)) {
								var seqno = cfg.sequenceNmbr;
								if (seqno % 2 != 0) {
									if (cfg.displayType === 9) // LONGTEXTBOX
									{
										div
												.attr('style',
														'overflow:visible;overflow-wrap:break-word');
									} else
										div.addClass(colCls);
									div
											.appendTo(tempObj['mainDiv'
													+ strSetName]);
									if (arrPrdEnr.length > 1) {
										enrField = arrPrdEnr[i + 1];
										enrFieldSeqNo = enrField
												? enrField.sequenceNmbr
												: 1; // 1 if index is 1;

										if (enrFieldSeqNo % 2 != 0) {
											if (cfg.displayType !== 9) // LONGTEXTBOX
												$('<div>')
														.attr({
																	'class' : colCls
																})
														.appendTo(tempObj['mainDiv'
																+ strSetName]);
										}
									} else {
										if (cfg.displayType !== 9) // LONGTEXTBOX
											$('<div>').attr({
														'class' : 'col-sm-12'
													})
													.appendTo(tempObj['mainDiv'
															+ strSetName]);
									}

								} else if (seqno % 2 == 0) {
									if (cfg.displayType === 9) // LONGTEXTBOX
									{
										div
												.attr('style',
														'overflow:visible;overflow-wrap:break-word');
									}
									if (arrPrdEnr.length > 1) {
										enrField = arrPrdEnr[i - 1];
										enrFieldSeqNo = enrField
												? enrField.sequenceNmbr
												: 2; // 2 if index is 1
										if (enrFieldSeqNo % 2 == 0) {
											$('<div>').attr({
														'class' : colCls
													});
											// .appendTo(tempObj['mainDiv'
											// + strSetName]);
										}

									} else {
										$('<div>').attr({
													'class' : colCls
												});// .appendTo(tempObj['mainDiv'
										// + strSetName]);
									}

									// div.appendTo(tempObj['mainDiv'
									// + strSetName]);
								}
							}
						}
					}
				}
				tempObj[strSetName + 'Counter'] = intCnt;
			}
		};
		$('<div>').attr({
					'class' : 'clear',
					'id' : 'clearDiv'
				}).appendTo(targetDiv);
	}
}
function paintPaymentEnrichmentsHelperViewOnly(arrPrdEnr, intCounter,
		strTargetId, strPmtType, argsData) {
	var targetDiv = $('#' + strTargetId), label = null, div = null, wrappingDiv = null, intCnt = 1, sortArrPrdEnr, minCounter, maxCounter, arrLength;
	var colCls = 'col-sm-6';
	var strValue = null, valueSpan = null;
	if (!isEmpty(intCounter))
		intCnt = intCounter;
	if (arrPrdEnr) {
		sortArrPrdEnr = generateSortArrPrdEnr(arrPrdEnr);
		arrLength = sortArrPrdEnr.length;
		minCounter = sortArrPrdEnr[0].sequenceNmbr;
		maxCounter = sortArrPrdEnr[arrLength - 1].sequenceNmbr;
		for (var i = minCounter; i <= maxCounter; i++) {
			var enrField = null;
			enrField = getEnrField(arrPrdEnr, i);
			if (!isEmpty(enrField) && enrField != null) {
				if (enrField.enrichmentType == 'S'
						|| enrField.enrichmentType == 'M') {
					var strAdditionalHelperCls = (!isEmpty(enrField.displayType)
								&& (enrField.displayType === 10
								|| enrField.displayType === 11))
								? 'smallEnrichDiv'
								: '';		
					wrappingDiv = $('<div>').attr({
								'class' : colCls + ' ' + strAdditionalHelperCls,
								'id' : enrField.code + 'wrappDiv'
							});
					div = $('<div>').attr({
								'class' : 'form-group',
								'id' : enrField.code + 'Div'
							});
					// label = $('<label>').attr('class', 'fieldLabel');
					label = $('<label>').attr('class', 'payment-font-bold');
					strValue = getEnrichValueToDispayed(enrField);
					strValue = !isEmpty(strValue) ? strValue : '';

					valueSpan = $('<span>').html(' '+strValue).attr('style','word-wrap : break-word;');
					if(!isEmpty(enrField.displayType) && enrField.displayType != 10)
						label.html(enrField.description);
					label.appendTo(div);
					valueSpan.appendTo(div);
					div.appendTo(wrappingDiv);
					wrappingDiv.appendTo(targetDiv);
					intCnt++;
				}
			} else {
				div = $('<div>').attr({
							'class' : colCls
						});
				div.appendTo(targetDiv);
				intCnt++;
			}
		}
	}
	return intCnt;
}
function isInstrumentDiscardAllowed(){
	blnRetValue = false;
	if (paymentResponseInstrumentData
			&& paymentResponseInstrumentData.d
			&& paymentResponseInstrumentData.d.paymentEntry
			&& paymentResponseInstrumentData.d.paymentEntry.paymentHeaderInfo
			&& (paymentResponseInstrumentData.d.paymentEntry.paymentHeaderInfo.hdrActionStatus === '0'
					|| paymentResponseInstrumentData.d.paymentEntry.paymentHeaderInfo.hdrActionStatus === '101' || paymentResponseInstrumentData.d.paymentEntry.paymentHeaderInfo.hdrActionStatus === '4' || paymentResponseInstrumentData.d.paymentEntry.paymentHeaderInfo.hdrActionStatus === '9'))
		blnRetValue = true;
	return blnRetValue;
	
}
function createInstrumentBackButton() {
	var btnBack = null, blnDiscardAllowed = false;
	btnBack = createButton('btnBack', 'S');
	btnBack.click(function() {
		goToPage(_mapUrl['cancelInstrumentUrl'], 'frmMain');
	});
	/**
	 * This is used to navigate back to 1st step from 2nd step in add mode.
	 * Currently handled for payment , template only, will be handled for SI/TEmplate in
	 * next sprint sprint 4
	 */
	if ((strEntryType === 'PAYMENT' || strEntryType === 'TEMPLATE' || strEntryType === 'SI') && (strAction === 'ADD' || strAction === 'TEMPLATE' )) {
		btnBack.unbind("click");
		blnDiscardAllowed = isInstrumentDiscardAllowed();
		if (blnDiscardAllowed) {
			btnBack.click(function() {
				getBackConfirmationPopup();
			});

		} else {
			btnBack.click(function() {
				goToPage(_mapUrl['backInstumentUrl'], 'frmMain');
			});
		}
	}
	return btnBack;
}

function getBackConfirmationPopup(){
	var _objDialog = $('#backConfirmationPopup');
	_objDialog.dialog({
				bgiframe : true,
				autoOpen : false,
				modal : true,
				resizable : false,
				width : "320px",
				buttons :[{
					text :getLabel('btnOk','Ok'),
					tabindex :1,
					id: 'btnBackOk',
					click : function() {
						blockUI();
						$(this).dialog("close");
						doDiscardPaymentInstrument('ignore', '',
								'backInstumentUrl');
						goToPage(_mapUrl['backInstumentUrl'], 'frmMain');
					},
					blur : function()
					{ 
						$("#btnBackCancel").focus();
					}
				},
				{
					text  : getLabel('btncancel','Cancel'),
					tabindex : 1,
					id: 'btnBackCancel',
					click : function() {
						$(this).dialog('destroy');
					},
					blur : function()
					{ 
						$("#btnBackOk").focus();
					}
				}]
			});
	_objDialog.dialog('open');
	_objDialog.dialog('option','position','center');
	$("#btnBackCancel").focus();
}

function paintTemplateInstrumentActions(strAction, isBtnVisible) {
	var elt = null, btnBack = null, btnClose = null, btnVerify = null, canShow = true, blnDiscardAllowed = false;
	$('#paymentDtlActionButtonListLT,#paymentDtlActionButtonListRT, #paymentDtlActionButtonListLB, #paymentDtlActionButtonListRB')
			.empty();
	var strBtnLTLB = '#paymentDtlActionButtonListLT,#paymentDtlActionButtonListLB';
	var strBtnRTRB = '#paymentDtlActionButtonListRT,#paymentDtlActionButtonListRB';
	btnBack = createButton('btnBack', 'S');
	btnBack.click(function() {
				  getTmpBackConfirmationPopup();
			});

    if (strAction === 'EDIT') {

		btnVerify = createButton('btnVerify', 'P');
		btnVerify.click(function() {
					doUpdateAndNextPaymentInstrument();
				});
		btnVerify.bind('keydown',function() {
			autoFocusOnFirstElement(event, 'frmMain',false);
		});
		btnVerify.appendTo($(strBtnRTRB));
		
		btnBack = createButton('btnBack', 'S');
		btnBack.click(function() {
					getTmpBackConfirmationPopup();
				});
		btnBack.appendTo($(strBtnLTLB));
	} 
	autoFocusFirstElement();
}

function paintPaymentInstrumentActions(strAction, isBtnVisible) {
	var elt = null, btnBack = null, btnClose = null, btnVerify = null, canShow = true;
	$('#paymentDtlActionButtonListLT,#paymentDtlActionButtonListRT, #paymentDtlActionButtonListLB, #paymentDtlActionButtonListRB')
			.empty();
	var strBtnLTLB = '#paymentDtlActionButtonListLT,#paymentDtlActionButtonListLB';
	var strBtnRTRB = '#paymentDtlActionButtonListRT,#paymentDtlActionButtonListRB';
	btnBack = createButton('btnBack', 'S');
	btnBack.click(function() {
				goToPage(_mapUrl['cancelInstrumentUrl'], 'frmMain');
			});

	if (strAction === 'VIEW') {
		btnBack.appendTo($(strBtnLTLB));
	}
	if (strAction === 'ADD') {
	if (!('BILLPAYLAYOUT' === strLayoutType && _IsEmulationMode == true)){
		elt = createButton('btnVerify', 'P');
		elt.click(function() {
					//doSavePaymentInstrument();
			 		var obj = $(this);
			 		obj.prop('disabled', true);
					doSaveAndNextPaymentInstrument();
			        setTimeout(function () {obj.prop('disabled', false); }, 1000);
				});
		elt.bind('keydown',function() {
			autoFocusOnFirstElement(event, 'frmMain',false);
		});
		elt.appendTo($(strBtnRTRB));
		}
		//$(strBtnRTRB).append("&nbsp;");
		btnBack = createInstrumentBackButton();
		btnBack.appendTo($(strBtnLTLB));
	} else if (strAction === 'EDIT') {
		//elt = createButton('btnUpdate', 'P');
		//elt.click(function() {
		//			doUpdatePaymentInstrument();
		//		});
		//elt.appendTo($(strBtnRTRB));
		////$(strBtnRTRB).append("&nbsp;");
		btnVerify = createButton('btnVerify', 'P');
		btnVerify.click(function() {
					var obj = $(this);
					obj.prop('disabled', true);
					doUpdateAndNextPaymentInstrument();
					setTimeout(function () {obj.prop('disabled', false); }, 1000);
				});
		btnVerify.bind('keydown',function() {
			autoFocusOnFirstElement(event, 'frmMain',false);
		});
		btnVerify.appendTo($(strBtnRTRB));
		//$(strBtnRTRB).append("&nbsp;");
		btnBack = createInstrumentBackButton();
		btnBack.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
		if(!Ext.isEmpty(user_button_mask) && isActionEnabled(user_button_mask,8)) {
			eltDiscard = createButton('btnDiscard', 'L');
			eltDiscard.click(function() {
					// doHandlePaymentInstrumentAction('discard');
					getDiscardConfirmationPopup();
				});
			eltDiscard.appendTo($(strBtnLTLB));
		}

	} else if (strAction === 'SUBMIT') {
		elt = createButton('btnSubmit', 'P');
		elt.click(function() {
					elt.prop('disabled', true);
					doHandlePaymentInstrumentAction('submit', true, null, null, function(){
						elt.prop('disabled', false);
					});
				});
		elt.appendTo($(strBtnRTRB));
		//$(strBtnRTRB).append("&nbsp;");

		btnBack.unbind("click");
		btnBack.click(function() {
					togglePaymentInstrumentEditScreen(false);
				});

		btnBack.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");

		btnClose = createButton('btnClose', 'L');
		btnClose.click(function() {
					goToPage(_mapUrl['cancelBatchUrl'], 'frmMain');
				});

		btnClose.appendTo($(strBtnLTLB));

	} else if (strAction === 'UPDATE' || strAction === 'UPDATEWITHERROR') {
		//elt = createButton('btnUpdate', 'P');
		//elt.click(function() {
		//			doUpdatePaymentInstrument();
		//		});
		//elt.appendTo($(strBtnRTRB));
		//$(strBtnRTRB).append("&nbsp;");

		btnVerify = createButton('btnVerify', 'P');
		btnVerify.click(function() {
					doUpdateAndNextPaymentInstrument();
				});
		btnVerify.bind('keydown',function() {
			autoFocusOnFirstElement(event, 'frmMain',false);
		});
		btnVerify.appendTo($(strBtnRTRB));
		//$(strBtnRTRB).append("&nbsp;");

		if (canShow === true) {
			// TODO: Remove after not required confirmation
			// elt = createButton('btnUpdateAndAdd', 'P');
			// elt.click(function() {
			// // doUpdateAndAddPaymentInstrument();
			// });
			// elt.appendTo($(strBtnRTRB));
			// $(strBtnRTRB).append("&nbsp;");
			// Kept false as we are showing pop-up on SAVEWITHERROR
			if (false && strAction === 'UPDATEWITHERROR') {
				elt = createButton('btnIgonreErrorAndAdd', 'P');
				elt.click(function() {
							// doIgnoreErrorAndAddPaymentInstrument();
						});
				elt.appendTo($(strBtnRTRB));
				//$(strBtnRTRB).append("&nbsp;");
			}
		}
		btnBack.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
		eltDiscard = createButton('btnDiscard', 'S');
		eltDiscard.click(function() {
					// doHandlePaymentInstrumentAction('discard');
					getDiscardConfirmationPopup();
				});
		eltDiscard.appendTo($(strBtnLTLB));
	}
	autoFocusFirstElement();
}
function paintPaymentInstrumentActionsForView(strAction) {
	var btnBack = null, btnDiscard = null, btnSubmit = null, btnDisable = null, btnEnable = null;
	$('#paymentDtlActionButtonListLT,#paymentDtlActionButtonListRT, #paymentDtlActionButtonListLB, #paymentDtlActionButtonListRB')
			.empty();
	var strBtnLTLB = '#paymentDtlActionButtonListLT,#paymentDtlActionButtonListLB';
	var strBtnRTRB = '#paymentDtlActionButtonListRT,#paymentDtlActionButtonListRB';
	btnBack = createButton('btnBack', 'S');
	
	btnBack.click(function() {
				blockUI();
				goToPage(_mapUrl['cancelBatchUrl'], 'frmMain');
			});

	btnDiscard = createButton('btnDiscard', 'S');
	btnDiscard.click(function() {
				// doHandlePaymentInstrumentAction('discard');
				getDiscardConfirmationPopup();
			});

	if (strAction === 'SUBMIT') {
		btnDiscard.appendTo($(strBtnRTRB));
		//$(strBtnRTRB).append("&nbsp;");

		btnSubmit = createButton('btnSubmit', 'P');
		btnSubmit.click(function() {
					btnSubmit.prop('disabled', true);
					doHandlePaymentInstrumentAction('submit', true, null, null, function(){
						btnSubmit.prop('disabled', false);
					});
				});
		btnSubmit.appendTo($(strBtnRTRB));
		btnSubmit.bind('keydown',function (){autoFocusOnFirstElement(event, 'frmMain',false)});
		btnBack.appendTo($(strBtnLTLB));
	} else if (strAction === 'CANCELANDDISCARD') {
		btnDiscard.appendTo($(strBtnRTRB));
		btnBack.appendTo($(strBtnLTLB));
	} else if (strAction === 'CANCELDISABLE') {
		btnDisable = createButton('btnDisable', 'S');
		btnDisable.click(function() {
					doHandlePaymentInstrumentAction('disable', true);
				});
		btnDisable.appendTo($(strBtnRTRB));

		btnBack.appendTo($(strBtnLTLB));
	} else if (strAction === 'CANCELENABLE') {
		btnEnable = createButton('btnEnable', 'S');
		btnEnable.click(function() {
					doHandlePaymentInstrumentAction('enable', true);
				});
		btnEnable.appendTo($(strBtnRTRB));

		btnBack.appendTo($(strBtnLTLB));
	} else if (strAction === 'CANCELONLY') {
		btnBack.appendTo($(strBtnLTLB));
		//btnBack.bind('keydown',function (){restrictTabKey(event)});
	}
}
function paintPaymentInstrumentGroupActions(strMask, strAction, strAuthLevel,
		strParentId, strDetailId, strShowAdvice, isReKeyApplicable) {
	if (!isEmpty(strMask)) {
		var elt = null, linkCancel = null;
		var isAuth = isActionEnabled(strMask, 0);
		var isReject = isActionEnabled(strMask, 1);
		var isSend = isActionEnabled(strMask, 2);
		var isHold = isActionEnabled(strMask, 3);
		var isRelease = isActionEnabled(strMask, 4);
		var isStop = isActionEnabled(strMask, 5);
		var isVerify = isActionEnabled(strMask, 6);
		var isDiscard = isActionEnabled(strMask, 7);
		var strBtnRTRB = '#paymentDtlActionButtonListRT,#paymentDtlActionButtonListRB';

		if (isAuth === true) {
			if(strEntityType == '1' && isPulledToBank == 'Y'){
				$(strBtnRTRB).empty();
			}
			else
			{
				$(strBtnRTRB).empty();
				elt = createButton('btnApprove', 'P');
				elt.click(function() {
							if('Y' === isReKeyApplicable && strEntryType==='PAYMENT')
								showReKeyViewScreenPopup ();
							else if('Y' === chrApprovalConfirmationAllowed && strEntryType==='PAYMENT')
								showApprovalConfirmationPopup('auth','Q');
							else	
								doHandlePaymentInstrumentAction('auth', true);
						});
				elt.appendTo($(strBtnRTRB));
				//$(strBtnRTRB).append("&nbsp;");
			}
		}
		if (isReject === true) {
			if(strEntityType == '1' && isPulledToBank == 'Y'){
				$(strBtnRTRB).empty();
			}
			else
			{
				if (!isAuth)
					$(strBtnRTRB).empty();
	
				elt = createButton('btnReject', 'P');
				elt.click(function() {
							doHandleRejectAction('reject', 'Q', true);
						});
				elt.appendTo($(strBtnRTRB));
			}

		}
		if (isSend === true) {
			if(strEntityType == '1' && isPulledToBank == 'Y'){
				$(strBtnRTRB).empty();
			}
			else
			{
				$(strBtnRTRB).empty();
				elt = createButton('btnSend', 'P');
				elt.click(function() {
							doHandlePaymentInstrumentAction('send', true);
						});
				elt.appendTo($(strBtnRTRB));
				//$(strBtnRTRB).append("&nbsp;");
			}
		}

		if (isHold === true) {
			elt = createButton('btnHold', 'P');
			elt.click(function() {
						doHandlePaymentInstrumentAction('hold', true);
					});
			//$(strBtnRTRB).append("&nbsp;");
			elt.appendTo($(strBtnRTRB));
		}

		if (isRelease === true) {
			elt = createButton('btnRelease', 'P');
			elt.click(function() {
						doHandlePaymentInstrumentAction('release', true);
					});
			//$(strBtnRTRB).append("&nbsp;");
			elt.appendTo($(strBtnRTRB));
		}

		if (isStop === true) {
			elt = createButton('btnStop', 'P');
			elt.click(function() {
					getTxnCancelConfirmationPopup('Q');
					});
			//$(strBtnRTRB).append("&nbsp;");
			elt.appendTo($(strBtnRTRB));
		}

		if (isVerify === true) {
			elt = createButton('btnVerify', 'P');
			elt.click(function() {
						//doHandlePaymentInstrumentAction('verify', true);
						showVerifyConfirmationPopup('verify','Q');
					});
			elt.bind('keydown',function() {
				autoFocusOnFirstElement(event, 'frmMain',false);
			});		
			//$(strBtnRTRB).append("&nbsp;");
			elt.appendTo($(strBtnRTRB));
		}

		/*if (isDiscard === true) {
			elt = createButton('btnDiscard', 'P');
			elt.click(function() {
						// doHandlePaymentInstrumentAction('discard');
						getDiscardConfirmationPopup();
					});
			//$(strBtnRTRB).append("&nbsp;");
			elt.appendTo($(strBtnRTRB));
		}*/
		if(strShowAdvice === 'Y'){
			elt = createButton('btnPaymentAdvice', 'S');
			$(strBtnRTRB).prepend("&nbsp;");
			$(strBtnRTRB).prepend(elt);
			elt.click(function() {
				var arrayJson = new Array()
				arrayJson.push({
							serialNo : 0,
							identifier : strPaymentInstrumentIde
						});
						$.download(_mapUrl['paymentAdvice'], arrayJson);
				});
		}

	}

}
function isActionEnabled(arrInputMask, bitPosition) {
	var retValue = false;
	if (arrInputMask.charAt(bitPosition)
			&& arrInputMask.charAt(bitPosition) * 1 === 1)
		retValue = true;
	return retValue;
}
function getEnrichValueToDispayed(cfg) {
	var displayType = cfg.displayType;
	var strReturnValue = '', field = '', defValue = cfg.value, enrichval = '';;
	if (isEmpty(displayType))
		displayType = 0;
	switch (displayType) {

		case 4 : // COMBOBOX
			if (isEmpty(cfg.value) || cfg.value == undefined) {
				enrichval = cfg.defaultValue;
			}
			else {
				enrichval = cfg.value;
			}
			if (!isEmpty(enrichval)) {
				strReturnValue = getObjectFormJsonKeyValueArray(enrichval,
						cfg.lookupValues);
				strReturnValue = strReturnValue && strReturnValue.value
						? strReturnValue.value
						: '';
			}
			if ((!isEmpty(cfg.value) || !isEmpty(enrichval)) && isEmpty(strReturnValue) && cfg.allowAdhocValue) {
				strReturnValue = cfg.value;
			}
			break;
		case 5 : // SELECTBOX
			break;
		case 8 : // SEEKBOX
			break;
		case 10 : //CHECKBOX
			strReturnValue = cfg.value === 'Y' ? '<i class="fa fa-check"></i> ' + cfg.description : cfg.description;
			break;
		case 11 : //RADIOBUTTON
			if (!isEmpty(cfg.value)) {
				strReturnValue = getObjectFormJsonKeyValueArray(cfg.value,
						cfg.lookupValues);
				strReturnValue = strReturnValue && strReturnValue.value
						? strReturnValue.value
						: '';
			}
			break;
		case 1 : // TEXTAREA
		case 2 : // AMOUNTBOX
			if (!isEmpty(cfg.value) && cfg.formattedValue != '--CONFIDENTIAL--')
			{
				field = createAmountBox(cfg.code, cfg.code, cfg.value, false,
						cfg.maxLength);
				strReturnValue = field.val();
			}
			else
			{
				strReturnValue = cfg.formattedValue;
			}
			
			break;
		case 3 : // NUMBERBOX
		case 6 : // DATEBOX
		case 7 : // TIMEBOX
		case 9 : // LONGTEXTBOX
		case 0 : // TEXTBOX
		default :
			strReturnValue = defValue;
			break;
	}
	return strReturnValue;
}
function getObjectFormJsonKeyValueArray(strKey, arrValues) {
	var retValue = null;
	if (arrValues)
		$.each(arrValues, function(index, opt) {
					if (strKey === opt.key) {
						retValue = opt;
						return false;
					}
				});
	return retValue;
}
function paintPaymentStandardFields(data, filter) {
	var arrFields = [];
	var strDisplayMode = null, divId = null, fieldId = null, lblId = null, cfgAccountNo = {};
	var blnUseInMobile = false;
	clearStandardFileds(true);
	if (strEntryType && 'TEMPLATE' === strEntryType)
		handleContractRateInTemplate(data, 'Q');
	if (data) {
		arrFields = data;
		if (arrFields && arrFields.length > 0) {
			$.each(arrFields, function(index, cfg) {
						fieldId = cfg.fieldName;
						strDisplayMode = cfg.displayMode;
						divId = fieldId + 'Div';
						lblId = fieldId + 'Lbl';
						if(false && cfg.fieldName ==='drawerAccountNo' && strLayoutType === 'ACCTRFLAYOUT'){
							var isSuggestionBox = cfg.availableValues && cfg.availableValues.length>10 ? true : false;
							toggleDrawerAccountFieldBehaviour(isSuggestionBox);
						}
						if(strEntryType === "PAYMENT" && fieldId == 'prenote')
						{
							strDisplayMode = "1" ;
						}
						handleDisplayMode(strDisplayMode, fieldId, 'Q');
						if (fieldId === 'accountNo') {
							cfgAccountNo = cfg;
							// if(strEntryType==='PAYMENT' || strEntryType
							// ==='SI')
							// handleAccountNoRefreshLink(cfg);
						}
						handleFieldPopulation(cfg, cfg.fieldName);
						if (cfg.fieldName === 'useInMobilePayments') {
							blnUseInMobile = true;
						}
						if (cfg.fieldName === 'templateType') {
							var arrOfAvalVal = cfg.availableValues;
							if (arrOfAvalVal && arrOfAvalVal.length > 0) {
								$.each(arrOfAvalVal, function(idx, opt) {
											if (opt.code === '1') {
												$('#divNonRepetative')
														.removeClass('hidden');
												$('#useInMobilePaymentsDiv').addClass('hidden');
											} else if (opt.code === '2') {
												$('#divRepetative')
														.removeClass('hidden');
											} else if (opt.code === '3') {
												$('#divSemiRepetative')
														.removeClass('hidden');
												$('#useInMobilePaymentsDiv').addClass('hidden');														
											}
										});
							}
						} else if ('drCrFlag' === cfg.fieldName) {
							handleDrCrFlagPaymentInstrument(cfg);
						} else if ('debitPaymentAmntFlag' === cfg.fieldName) {
							handleDebitPaymentAmntFlagPopulation(cfg);
						} else if('defineApprovalMatrix' === cfg.fieldName){
							// Handling for AVM Grid Start
							if ($("#defineApprovalMatrix").prop('checked') == true) {
								defineAVMGrid('edit', 'Q');
							}
							// Handling for AVM Grid End
						} else if('activationTime' === cfg.fieldName){
							handleEffectiveTimeFieldPopulation(cfg,false);
						}else if('bankProduct' === cfg.fieldName){
							handleLableChangeForPhisicalPaymentFields(cfg);
						} else if('whtApplicable' === cfg.fieldName){
							if(cfg.value === 'Y'){
								$('#whtApplicable').attr('checked','true');
								$('#whtApplicable').val('Y');
								$('#whtFieldsSectionInfoDiv').removeClass('hidden');
							}/*else{
								$('#whtApplicable').attr('checked','false');
								$('#whtApplicable').val('N');
								$('#whtFieldsSectionInfoDiv').addClass('hidden');
							}*/
						}else if('whtReqFlag' === cfg.fieldName){
							if(cfg.value === 'Y'){
								$('#whtReqFlag').attr('checked','true');
								$('#whtReqFlag').val('Y');
								$('#whtFieldsSectionInfoDiv').removeClass('hidden');
							}
						}
						else if ('whtCertificatePrinting' === cfg.fieldName && cfg.value === 'Y' ){
							$('#whtCertificatePrinting').attr('checked','true');
							$('#whtCertificatePrinting').val('Y');
						} else if('receiverTaxId' === cfg.fieldName){
							toggleCertificatePrinting();
						} else if('txnCurrency' === cfg.fieldName ){
                            $('#txnCurrencySpan').text('('+cfg.value+')');
                        }else if('ibanNo' === cfg.fieldName ){
                			$('#ibanNo').ForceNoSpecialSymbolWithoutSpace();
                        } else if (cfg.fieldName === 'payLocation' || cfg.fieldName === 'printBranch') {
                            var strValue='';
                            if(cfg.value)
                            {
                                var availableValues=cfg.availableValues;
                                if (availableValues) {
                                    $.each(availableValues, function(index,item)
                                    {
                                        if(item.code == cfg.value)
                                        {
                                        	if(cfg.fieldName === 'payLocation')
                                        		strValue = item.code+':'+item.description;
                                        	else
                                        		strValue = item.description;
                                            $('#'+cfg.fieldName+'Desc').val(strValue);
                                            return false;
                                        }
                                    });
                                }
                            }
                        }
						
						if(cfg.label && cfg.dataType != 'radio' && cfg.dataType != 'checkBox'){
							$("label[for=" +cfg.fieldName+ "]").text(getLabel(cfg.fieldName,cfg.label));
						}
						if(cfg.apiDependent)
						{
							doHandleApiCall(cfg);
						}
						if ('instrumentDate' === cfg.fieldName) {
							maxxBackDays = !isEmpty(cfg.maxxBackDays)? cfg.maxxBackDays:0; 
							if(strLayoutType === "CHECKSLAYOUT" || strLayoutType === "MIXEDLAYOUT"){
								$('#instrumentDate' ).datepicker( "option", "minDate", new Date(year, month - 1, parseInt(day-maxxBackDays,10) ));
							}
						}
						if('accountNo' === fieldId)
							$('#accountNo_jq').addClass('line-height0');
						if('referenceNo' === fieldId)
							$('#referenceNo').addClass('line-height1');
					});
			if ((strEntryType === 'PAYMENT' || strEntryType === 'SI')
					&& strPaymentType != 'BATCHPAY') {
				var Freq = null, gstrPeriod = null, gstrRef = null;
				if (arrFields) {
					var stdFieldData = arrFields;
					if (stdFieldData && stdFieldData.length > 0) {
						$.each(stdFieldData, function(index, cfg) {
									fieldId = cfg.fieldName;
									if (fieldId === 'period') {
										if (!isEmpty(cfg.value))
											gstrPeriod = cfg.value;
									}
									if (fieldId === 'refDay') {
										if (!isEmpty(cfg.value))
											gstrRef = cfg.value;
									}
									if (fieldId === 'siFrequencyCode') {
										if (!isEmpty(cfg.value))
											Freq = cfg.value;
									}
								});
					}
				}
				populateSIProcessing('Q', Freq, gstrPeriod, gstrRef);
				toggleRecurringPaymentParameterDtlFieldsSectionVisibility();
			} else if (strEntryType === 'TEMPLATE') {
				if (strPaymentType === 'QUICKPAY') {
					var strTemplateType = getInstrumentTemplateType(arrFields);
					if (strTemplateType === '1')
						toggleAccountFieldBehaviour(true, 'Q');
					else
						toggleAccountFieldBehaviour(false, 'Q');
					if(strTemplateType === '2' && blnUseInMobile === true)
						$('#useInMobilePaymentsDiv').removeClass('hidden');
					else
						$('#useInMobilePaymentsDiv').addClass('hidden');					
					handleFieldPopulation(cfgAccountNo, cfgAccountNo.fieldName);
					applyControlFieldsValidation(strPaymentType);
				}
				// Receiver Fields mandatory on change of receiver
				$('#prenote').unbind('click');
				$('#prenote').bind('click', function() {
							toggleCheckBoxValue("prenote");
							handleReceiverFieldsOnPrenoteChange();
						});
			}
			//FTMNTBANK-841 handleCompanyIdChange(false);
		}
		
		doHandleForex();
		if(strLayoutType === 'CASHLAYOUT' || strLayoutType === 'CHECKSLAYOUT' || ($.inArray(strPrdID, ['01','02','07']) >= 0))
		{
			if(strLayoutType === 'CHECKSLAYOUT' || strLayoutType === 'MIXEDLAYOUT' ){
				handlePrintBranchField();
			}
			handleDisplayPhysicalPaymentFields(strPrdID);
		}
	}
}
function handlePrintBranchField(){
	var defValue,data,fieldId=null,objPrintBranch=null;
	objPrintBranch = $('#printBranch');
	if (paymentResponseInstrumentData
			&& paymentResponseInstrumentData.d
			&& paymentResponseInstrumentData.d.paymentEntry
			&& paymentResponseInstrumentData.d.paymentEntry.standardField){
		data = paymentResponseInstrumentData.d.paymentEntry.standardField;
		if (data && data.length > 0) {
			$.each(data, function(index, cfg) {
				fieldId = cfg.fieldName;
				if(fieldId === 'printBranch'){
					if(cfg.value)
						objPrintBranch.val(cfg.value);
				}
			});
		}
	}
}
function paintPaymentReceiverFields(data, headerInfo, pirmode) {
	var fieldId = null, lblId = null, cfgBeneDetails = null, cfgBeneRegistered = null, cfgBeneAdhoc = null, blnRegisteredOnly = false;
	var strPostFix = 'R_InstView';
	var chrBankBeneLevel = getPaymentMethodReceiverLevel(headerInfo);
	var blnIsSystemReceiver = isBatchPaymentForSystemBene(headerInfo);
	if (data) {
		cfgBeneDetails = data;
		blnRegisteredOnly = cfgBeneDetails.adhocBene ? false : true;
		clearReceiver('B', true);
		if (cfgBeneDetails.registeredBene) {
			cfgBeneRegistered = cfgBeneDetails.registeredBene;
			if (blnIsSystemReceiver && strLayoutType==='MIXEDLAYOUT') {
			toggleReceiver('T', false);
		}
			if (cfgBeneRegistered && cfgBeneRegistered.length > 0) {
				$.each(cfgBeneRegistered, function(index, cfg) {
					fieldId = cfg.fieldName;
					if (fieldId === 'drawerCode'
							&& (!isEmpty(cfg.value) || ('QUICKPAY' === strPaymentType
									&& 'B' === strPayUsing && !isEmpty(strSelectedReceiver)))) {
						if (cfg.readOnly === 'true' || (chrBankBeneLevel==='B' && 'QUICKPAY' !== strPaymentType)) {
							$('#drawerDescriptionR').attr("disabled",
									cfg.readOnly);
							$('#drawerDescriptionR').addClass("disabled");
						}
						var _strSelectedReceiverCode = cfg.value == null
								? strSelectedReceiver
								: cfg.value;
						toggleRegisteredReceiverMoreDetails(_strSelectedReceiverCode);
					} /*else if ((fieldId === 'tag57Type'
							|| fieldId === 'tag54Type' || fieldId === 'tag56Type')) {
								handleReceiverTagDetailsSectionForRegisteredReceiver(strPostFix,cfg,clsHide);
					}*/
					paintRegisteredReceiverInfoFields(fieldId, strPostFix, cfg);
					handleDisplayMode(cfg.displayMode, fieldId + 'R');
					handleFieldPopulation(cfg, cfg.fieldName + 'R');
					if(fieldId == 'beneficiaryBranchDescription')
					{
						$("#beneficiaryBranchDescriptionR").attr("title", cfg.value);
					}
					if(fieldId == 'beneficiaryBankIDCode')
					{
						$("#beneficiaryBankIDCodeAutoCompleter").attr("title", cfg.value);
					}
					
					if(cfg.apiDependent)
					{
						doHandleApiCall(cfg,'R');
					}
					if('beneficiaryBankIDType'==fieldId)
					{
						if("IBAN"==cfg.value)
						{						
							$('#bankIdDiv').hide();
							$('#beneficiaryBankIDCodeRDiv').hide();
						}
						else
						{
							$('#bankIdDiv').show();
							$('#beneficiaryBankIDCodeRDiv').show();
						}
					}					
				});
			}
			handleReceiverTagDetailsSection(true);
		}
		if (cfgBeneDetails.adhocBene) {
			isAdhocReceiverAllowed = true;
			cfgAdhocBeneBank = null, cfgAdhocBank = null, cfgAdhocBeneBankID = null;
			cfgBeneAdhoc = cfgBeneDetails.adhocBene;
			if (cfgBeneAdhoc && cfgBeneAdhoc.length > 0) {
				$.each(cfgBeneAdhoc, function(index, cfg) {
							fieldId = cfg.fieldName;
							if (fieldId === 'beneficiaryBankDescription') {
								cfgAdhocBeneBank = cfg;
							} else if (fieldId === 'beneficiaryAdhocbankFlag') {
								cfgAdhocBank = cfg;
							} else if (fieldId === 'beneficiaryBankIDCode') {
								cfgAdhocBeneBankID = cfg;
								$("#beneficiaryBankIDCodeAutoCompleter").attr("title", cfg.value);
							}
							if(fieldId == 'beneficiaryBranchDescription')
							{
								$("#beneficiaryBranchDescriptionA").attr("title", cfg.value);
							}
							if (fieldId === 'drawerCode')
								handleDisplayMode('1', fieldId + 'A');
							else								
								handleDisplayMode(cfg.displayMode, fieldId + 'A');
							
							handleFieldPopulation(cfg, cfg.fieldName + 'A');
							if( cfg.fieldName == 'beneficiaryBankIDType' && cfg.availableValues
								&& cfg.availableValues.length == 1)
							{
								populateBankDetails();
							}
							if(cfg.apiDependent)
							{
								doHandleApiCall(cfg,'A');
							}
							if((cfg.fieldName == 'phyDrawerBankCode' || cfg.fieldName == 'phyDrawerBranchCode' )&& !isEmpty(cfg.value)
                                            && (strLayoutType ==='CHECKSLAYOUT'|| strLayoutType ==='MIXEDLAYOUT'))
                            {
                                var strValue = '';
                                if(cfg.value)
                                {
                                    var availableValues=cfg.availableValues;
                                    if (availableValues) {
                                        $.each(availableValues, function(index,item)
                                        {
                                            if(item.code == cfg.value)
                                            {
                                               strValue = item.code+' | '+item.description;
                                               return false;
                                            }
                                        });
                                    }
                                }
                              $('#'+cfg.fieldName+'ADesc').val(strValue);
                            }
							//dynamic binding of label field
							if(cfg.label){
								if("drawerDescription" === cfg.fieldName){
									
									$("label[for='drawerDescriptionA']").text(getLabel(cfg.fieldName,cfg.label));
								} else if("drawerAccountNo" === cfg.fieldName || "drawerAccountNoA" === cfg.fieldName){
									
									$("label[for='drawerAccountNoA']").text(cfg.label);
								} else if("drawerMail" === cfg.fieldName){
									
									$("label[for='drawerMailA']").text(cfg.label);
								}else{
								
									$("label[for=" +cfg.fieldName+ "]").text(cfg.label);
								}
								
							}
							if('beneficiaryBankIDType'==fieldId)
							{
								if("IBAN"==cfg.value)
								{									
									$('#beneficiaryBankIDCodeAutoCompleter').hide();
									$('#beneficiaryBankIDCodeAutoCompleterLbl').hide();
									$('#ibanLbl').attr('checked', true);
									$('#ibanLbl').attr('disabled', 'disabled');
									$('#accountIbanNoLbl').attr('disabled', 'disabled');
								}
								else
								{
									$('#beneficiaryBankIDCodeAutoCompleter').show();
									$('#beneficiaryBankIDCodeAutoCompleterLbl').show();
									$('#ibanLbl').removeAttr('disabled');
									$('#accountIbanNoLbl').removeAttr('disabled');
								}
							}
							
						});
					
				//if (strLayoutType && strLayoutType === 'ACHLAYOUT')
				//	$("#beneficiaryBankIDTypeA").val("FED");

				if($('#beneficiaryBankIDTypeA') && $('#beneficiaryBankIDTypeA')[0] && $('#beneficiaryBankIDTypeA')[0].length > 1 ){
					$('#beneficiaryBankIDTypeA').niceSelect('update'); 
				}				
				if($('#anyIdTypeA') && $('#anyIdTypeA')[0] && $('#anyIdTypeA')[0].length > 1 ){
					$('#anyIdTypeA').niceSelect('update'); 
				}
				 if($('#corrBankIdTypeA') && $('#corrBankIdTypeA')[0] && $('#corrBankIdTypeA')[0].length > 1 ){
					$('#corrBankIdTypeA').niceSelect('update'); 
				}
				 if($('#intBankIDTypeA') && $('#intBankIDTypeA')[0] && $('#intBankIDTypeA')[0].length > 1 ){
					$('#intBankIDTypeA').niceSelect('update'); 
				}
				 if($('#rateType') && $('#rateType')[0] && $('#rateType')[0].length > 1 ){
					$('#rateType').niceSelect('update'); 
				}
				 if($('#charges') && $('#charges')[0] && $('#charges')[0].length > 1){
					$('#charges').niceSelect('update'); 
				}
				if (cfgAdhocBank && cfgAdhocBank.value) {
					if (cfgAdhocBank.value == 'A') {
						$('#beneficiaryAdhocbankFlagA').val('Y');
					}
				}
				
				if (cfgAdhocBeneBankID) {
					if (cfgAdhocBeneBankID.value)
						$("#beneficiaryBankIDCodeAutoCompleter")
								.val(cfgAdhocBeneBankID.value);
					if (cfgAdhocBeneBankID.displayMode
							&& cfgAdhocBeneBankID.displayMode === "3")
						$("#beneficiaryBankIDCodeAutoCompleterLbl").addClass('required');				}
				
			}
			handleReceiverTagDetailsSection(false);
		}
		if (blnIsSystemReceiver && strLayoutType==='MIXEDLAYOUT') {
			toggleReceiver('T', false);
		} else if (!isEmpty(cfgBeneDetails.drawerRegistedFlag) && strLayoutType
		/* && strLayoutType != 'TAXLAYOUT' */) {
			if (cfgBeneDetails.drawerRegistedFlag == 'N'
					|| cfgBeneDetails.drawerRegistedFlag == 'A') {
				toggleReceiver('A', false);
			} else if (cfgBeneDetails.drawerRegistedFlag == 'Y'
					|| cfgBeneDetails.drawerRegistedFlag == 'R') {
				toggleReceiver('R', false);
			}
		} else if (isEmpty(cfgBeneDetails.drawerRegistedFlag) && strLayoutType
				&& strLayoutType != 'TAXLAYOUT' && !blnRegisteredOnly) {
			toggleReceiver('A', false);
		}
		if (blnRegisteredOnly) {
			$('.adhocReceiver,.adhocReceiverR,.adhocReceiverR, #switchToAdhocReceiverDiv')
					.empty();
			$('#drawerDescriptionR').attr({
						'readonly' : false,
						'placeholder' : 'Enter Keyword or %'
					});
			toggleReceiver('R', false);
		}
		
		if(strAction == 'EDIT')
		{
			//$('#saveBeneFlagA').attr("disabled", true);
			$('#saveBeneFlagA').attr('checked', false);
			$('#saveBeneFlagA').val('N');
		}
		else
		{
		toggleReceiverCodeNecessity();
		}
		
		/**
		 * Note : This is handled for payment using template
		 */
		if (!isEmpty(headerInfo.hdrTemplateName) && headerInfo.templateType ==='3'
				&& strEntryType === 'PAYMENT' ) {
			$('#switchToAdhocReceiverDiv').empty();
		}
		if (cfgBeneDetails.registeredBene && typeof payFromAnyidReceiver !== 'undefined'
				&& payFromAnyidReceiver == 'Y' && strAction == 'ADD')
		{
			populateAnyIdDetails('R');
			anyIdPaymentFlag = 'Y'; 
			anyIdToggle(anyIdPaymentFlag,'R');
		}
		else if (cfgBeneDetails.registeredBene && typeof payFromAnyidReceiver !== 'undefined'
				&& payFromAnyidReceiver == 'N' && strAction == 'ADD')
		{
			anyIdPaymentFlag = 'N'; 
			anyIdToggle(anyIdPaymentFlag,'R');
		}
		
			 enableDisableLEICode($('#receiverLeiTypeA').val());
			 if($('#receiverLeiTypeR').val() === 'I' ){
			    	$(".receiverLeiCodeR_InstViewDiv").addClass('hidden');
			    }	
		    else if($('#receiverLeiTypeR').val() === 'C'){
		    	    $(".receiverLeiCodeR_InstViewDiv").removeClass('hidden');
		    }
		
	}
}
function paintPaymentEnrichments(objData) {
	var data = objData;
	var setNameMap = {}, isVisible = false, isVisibleTransAddenda = false, clsHide = 'hidden', intConterForTransAddenda = 1, intCounter = 1, strTargetId = 'addendaInfoEnrichDiv', strTransAddendaTargetId = 'addendaInfoEnrichInTransctionDiv';
	$('#addendaInfoEnrichDiv, #bankProductMultiSetEnrichDiv, #myProductMultiSetEnrichDiv, #clientMultiSetEnrichDiv , #addendaInfoEnrichInTransctionDiv')
			.empty();
	mapEnrichSet = {};
	if (data.udeEnrichment && data.udeEnrichment.parameters) {
		paintPaymentEnrichmentAsSetName(mapEnrichSet,
				data.udeEnrichment.parameters, strTargetId);
		isVisible = true;
	}
	if (data.productEnrichment && data.productEnrichment.parameters) {
		paintPaymentEnrichmentAsSetName(mapEnrichSet,
				data.productEnrichment.parameters, strTargetId);
		isVisible = true;
	}
		
	if (data.myproductEnrichment && data.myproductEnrichment.parameters) {
		paintPaymentEnrichmentAsSetName(mapEnrichSet,
				data.myproductEnrichment.parameters, strTargetId);
		isVisible = true;
	}

	if (data.clientEnrichment && data.clientEnrichment.parameters) {
		// billpay enrichments handling starts
		if ('BILLPAYLAYOUT' === strLayoutType && strBillerOrAggregator === 'B') {
			paintBillPaymentEnrichments(data);
		} // billpay enrichments handling ends
		else {
				paintPaymentEnrichmentAsSetName(mapEnrichSet,
						data.clientEnrichment.parameters, strTargetId);
				isVisible = true;
		}
	}
	if (data.productEnrichmentStdFields
			&& data.productEnrichmentStdFields.parameters) {
		intConterForTransAddenda = paintPaymentEnrichmentsHelper(
				data.productEnrichmentStdFields.parameters,
				intConterForTransAddenda, strTransAddendaTargetId, 'Q');
		isVisibleTransAddenda = true;
		handlePayEnrichSelect(data.productEnrichmentStdFields.parameters);
	}
	if (data.myproductEnrichmentStdFields
			&& data.myproductEnrichmentStdFields.parameters) {
		intConterForTransAddenda = paintPaymentEnrichmentsHelper(
				data.myproductEnrichmentStdFields.parameters,
				intConterForTransAddenda, strTransAddendaTargetId, 'Q');
		isVisibleTransAddenda = true;
		handlePayEnrichSelect(data.myproductEnrichmentStdFields.parameters);
	}
	if (data.clientEnrichmentStdFields
			&& data.clientEnrichmentStdFields.parameters) {
		intConterForTransAddenda = paintPaymentEnrichmentsHelper(
				data.clientEnrichmentStdFields.parameters,
				intConterForTransAddenda, strTransAddendaTargetId, 'Q');
		isVisibleTransAddenda = true;
		handlePayEnrichSelect(data.clientEnrichmentStdFields.parameters);
	}
	if (data.udeEnrichmentStdFields && data.udeEnrichmentStdFields.parameters) {
		intConterForTransAddenda = paintPaymentEnrichmentsHelper(
				data.udeEnrichmentStdFields.parameters,
				intConterForTransAddenda, strTransAddendaTargetId, 'Q');
		isVisibleTransAddenda = true;
		handlePayEnrichSelect(data.udeEnrichmentStdFields.parameters);
	}
	resetMultiSetEnrichVariable();
	if (data.myProductMultiSet && data.myProductMultiSetMetadata) {
		paintPaymentMyProductMultiSetEnrichments(data.myProductMultiSet,
				data.myProductMultiSetMetadata, intCounter,
				'myProductMultiSetEnrichDiv', 'Q');
		isVisible = true;
	}
	if (data.bankProductMultiSet && data.bankProductMultiSetMetadata) {
		paintPaymentBankProductMultiSetEnrichments(data.bankProductMultiSet,
				data.bankProductMultiSetMetadata, intCounter,
				'bankProductMultiSetEnrichDiv', 'Q');
		isVisible = true;
	}
	if (data.clientMultiSet && data.clientMultiSetMetadata) {
		paintPaymentClientProductMultiSetEnrichments(data.clientMultiSet,
				data.clientMultiSetMetadata, intCounter,
				'clientMultiSetEnrichDiv', 'Q');
		isVisible = true;
	}

	if (isVisibleTransAddenda) {
		$('#addendaInfoEnrichInTransctionDiv').removeClass(clsHide);	
	}
	if (isVisible) {
		$('#AddBankInfo').removeClass(clsHide);
	}
	
	if (!isVisible && 'TAXLAYOUT' === strLayoutType) {
		isVisible = verifyPaymentCustomizationEnrich(data);
	}
	showEditableFieldDisclaimerText();
	
	return (isVisible);

}
function verifyPaymentCustomizationEnrich(data)
{
	if (data && data.paymentCustomization
			&& data.paymentCustomization.parameters) {
		var param = data.paymentCustomization.parameters;
		$.each(param, function(index, cfg) {
			if(cfg.visibility != 'H') {
				return true;
			}
		});
	}
	else
		return true;
	
	return false;
}
function resetEnrichmentSection(){
	$('#addendaInfoEnrichDiv, #bankProductMultiSetEnrichDiv, #myProductMultiSetEnrichDiv, #clientMultiSetEnrichDiv , #addendaInfoEnrichInTransctionDiv')
			.empty();
}
function handleEmptyEnrichmentDivs() {
	var intNonEmptyDivHeight = 0;
	$('.emptyEnrichDiv').each(function() {
		if (intNonEmptyDivHeight != 0)
			$(this).attr('style', 'height:' + intNonEmptyDivHeight);
		else {
			var objNonEmptyDivId = $(this).prev().attr('id');
			if (objNonEmptyDivId) {
				intNonEmptyDivHeight = $('#' + objNonEmptyDivId).height();
				$(this).attr('style', 'height:' + intNonEmptyDivHeight);
			}
		}
		if (!$(this).prev().children() || $(this).prev().children().length == 0) {
			$(this).prev().remove();
			$(this).remove();
		}
	});
	intNonEmptyDivHeight = 0;
	$('.smallEnrichDiv').each(function() {
		if (intNonEmptyDivHeight !== 0)
			$(this).attr('style', 'height:' + intNonEmptyDivHeight);
		else {
			var objNonEmptyDivId = $(this).prev().attr('id');
			if (objNonEmptyDivId) {
				intNonEmptyDivHeight = $('#' + objNonEmptyDivId).height();
				$(this).attr('style', 'height:' + intNonEmptyDivHeight);
			}else{
				 objNonEmptyDivId = $(this).next().attr('id');
				 intNonEmptyDivHeight = $('#' + objNonEmptyDivId).height();
				$(this).attr('style', 'height:' + intNonEmptyDivHeight);
			}
		}
		if (!$(this).prev().children() || $(this).prev().children().length == 0) {
			$(this).prev().remove();
			//$(this).remove();
		}
	});
}
function paintPaymentEnrichmentAsSetName(setNameMap, arrPrdEnr, strTargetId) {
	if (strLayoutType === 'WIRELAYOUT') {
		var arrWireEnrichments = new Array(), arrPrdEnrDummy = new Array();
		if (arrPrdEnr) {
			$.each(arrPrdEnr, function(index, cfg) {
				if (cfg.enrichmentSetName
						&& (cfg.enrichmentSetName === 'BANK TO BANK INFO' || cfg.enrichmentSetName === 'INSTRUCTION CODE'))
					arrWireEnrichments.push(arrPrdEnr[index]);
				else
					arrPrdEnrDummy.push(arrPrdEnr[index]);
			});
		}
		paintPaymentEnrichmentAsSetNameNonWireLayout(setNameMap,
				arrPrdEnrDummy, strTargetId);
		handlePayEnrichSelect(arrPrdEnrDummy);
		paintPaymentEnrichmentAsSetNameWireLayout(setNameMap,
				arrWireEnrichments, strTargetId);
		handlePayEnrichSelect(arrWireEnrichments);
	} else{
		paintPaymentEnrichmentAsSetNameNonWireLayout(setNameMap, arrPrdEnr,
				strTargetId);
		handlePayEnrichSelect(arrPrdEnr);
	}
}

function handlePayEnrichSelect(arrPrdEnr){
	if (arrPrdEnr) {
		$.each(arrPrdEnr, function(index, cfg) {
			if(!isEmpty(cfg)){
				if(cfg.code){
					var objId = cfg.code;
					if(cfg.displayType === 4 && $('#' + objId).hasClass('jq-editable-combo'))
						{
							if(cfg.mandatory != undefined && cfg.mandatory)
							{
								$('#'+objId+'_jq').bind('blur', function mark() {
									markRequired($(this));
								});
								$('#'+objId+'_jq').bind('focus', function() {
									removeMarkRequired($(this));
								});
							}
						}
					if(cfg.displayType === 4 && !cfg.allowAdhocValue){
						$('#'+objId).niceSelect("destroy");
						$('#'+objId).niceSelect();
						$('#'+objId).niceSelect("update");
						if(cfg.mandatory != undefined && cfg.mandatory)
						{
							$('#'+objId+'-niceSelect').bind('blur', function mark() {
								markRequired($(this));
							});
							$('#'+objId+'-niceSelect').bind('focus', function() {
								removeMarkRequired($(this));
							});
						}
					}
				}
			}
		});
	}
}

function paintPaymentEnrichmentAsSetNameNonWireLayout(setNameMap, arrPrdEnr,
		strTargetId) {
	var field = null, targetDiv = $('#' + strTargetId), label = null, div = null, innerDiv = null, intCnt, tempObj, mainDiv = null, fieldSetDiv = null, fieldset = null, legend = null;
	var strSetName = null, enrField = null, enrFieldSeqNo = 0;
	var colCls = 'col-sm-6';
	var chkBoxDiv = null, chkBoxLbl = null, wrapperDiv = null, internalWrapperDiv = null, internalShadedDiv = null, rowDiv = null;

	if (arrPrdEnr) {
		$.each(arrPrdEnr, function(index, cfg) {
			if (cfg.enrichmentSetName) {
				strSetName = (cfg.enrichmentSetName).replace(/ /g, '_');
				if (setNameMap[strSetName]) {
					tempObj = setNameMap[strSetName];
				} else {
					targetDiv.removeClass('hidden');
					wrapperDiv = $('<div>').attr({
								'id' : strSetName + '_WrapperDiv'
							}).appendTo(targetDiv);
					rowDiv = $('<div>').attr({
								'class' : 'row '
							});
					fieldSetDiv = $('<div>').attr({
								'class' : 'col-sm-12 ',
								'id' : strSetName + '_FieldSetDiv'
							}).appendTo(rowDiv);
					rowDiv.appendTo(wrapperDiv);

					chkBoxDiv = $('<div>').attr({
								'id' : strSetName + '_ChkBoxDiv'
							}).appendTo(fieldSetDiv);

					chkBoxLbl = $('<label>').attr({
								'style' : 'font-style:italic;font-weight: bold;'
							}).appendTo(chkBoxDiv);

					if (strLayoutType === 'WIRELAYOUT' || strLayoutType === 'WIRESIMPLELAYOUT') {
						chkBoxLbl = $('<label>').attr({
									'class' : 'checkbox-inline',
									'style' : 'font-style:italic;font-weight: bold;'
								}).appendTo(chkBoxDiv);

						$('<input>').attr({
									'type' : 'checkbox',
									'id' : strSetName + '_ChkBox',
									'checked' : true
								}).on('click', function() {
									// $('#' + strSetName).toggle('hidden');
									var strId = $(this).attr('id');
									if (strId) {
										strId = strId.replace('_ChkBox', '_InternalWrapperDiv');
										$('#' + strId).toggleClass('hidden');
									}
								}).appendTo(chkBoxLbl);

						chkBoxLbl.append(cfg.enrichmentSetName);
					}
					rowDiv = $('<div>').attr({
								'class' : 'row '
							});
					internalWrapperDiv = $('<div>').attr({
								'id' : strSetName + '_InternalWrapperDiv',
								'class' : 'col-sm-12 '
							}).appendTo(rowDiv);
					rowDiv.appendTo(wrapperDiv);
					if (strLayoutType === 'WIRELAYOUT' || strLayoutType === 'WIRESIMPLELAYOUT') {
						internalShadedDiv = $('<div>').attr({
									'id' : strSetName + '_shadedDiv',
									'class' : 'well'
								}).appendTo(internalWrapperDiv);

						mainDiv = $('<div>').attr({
									'id' : strSetName+'_mainDiv',
									'class' : 'row'
								}).appendTo(internalShadedDiv);
					} else {
						mainDiv = $('<div>').attr({
									'id' : strSetName+'_mainDiv',
									'class' : 'row'
								}).appendTo(internalWrapperDiv);
					}

					tempObj = {};
					tempObj['mainDiv' + strSetName] = mainDiv;
					tempObj['fieldSetDiv' + strSetName] = fieldSetDiv;
					tempObj[strSetName + 'Counter'] = 1;
					setNameMap[strSetName] = tempObj;
				}
				if (!isEmpty(tempObj)) {
					intCnt = tempObj[strSetName + 'Counter'];
					if (cfg.enrichmentType == 'S' || cfg.enrichmentType == 'M') {
						var strAdditionalHelperCls = (!isEmpty(cfg.displayType)
								&& (cfg.displayType === 10
								|| cfg.displayType === 11))
								? 'smallEnrichDiv'
								: '';
						div = $('<div>').attr({
									'class' : colCls +' '+strAdditionalHelperCls,
									'id' : cfg.code + 'Div'
								});
						innerDiv = $('<div>').attr({
									'class' : 'form-group',
									'id' : cfg.code + '_InnerDiv'
								});
						if(!isEmpty(cfg.displayType) && cfg.displayType != 10)		
							label = $('<label>').html(cfg.description);
						else	
							label = $('<label>').html("");
						field = createEnrichMentField(cfg);
						if (cfg.enableDisable != null) {
							if (cfg.enableDisable == 'disable') {
								field.attr('disabled', true);
							} else if (cfg.enableDisable == 'enable') {
								field.attr('disabled', false);
							} else if (cfg.enableDisable == 'disableFV') {
								field.attr('disabled', true);
							}
						}
						if (field) {
							label.attr('for', cfg.code);
							if (cfg.mandatory == true)
								label.addClass('required');
							label.appendTo(innerDiv);
							// $('<br/>').appendTo(div);
							if (cfg.enrichmentType === 'S') {
								if ('A' === cfg.includeInTotal
										|| 'S' === cfg.includeInTotal) {
									handleAmmountCalculationOnSingleSetEnrichment(
											field, cfg);
								}
								if (!isEmpty(cfg.apiName))
									handlePageRefreshOnSingleSetEnrichmentChange(
											field, cfg);
								else if (strLayoutType === 'TAXLAYOUT')
									handleAmmountCalculationOnSingleSetEnrichment(
											field, cfg);
							} else if (cfg.enrichmentType === 'M'
									&& !isEmpty(cfg.apiName))
								handlePageRefreshOnMultiSetEnrichmentChange(
										field, cfg, argsData,cfg.enrichmentType);
							if (cfg.code == 'NTDAKOT317')
							{
								handleComboBoxChangeEvent(field, cfg);
							}
							
							if (cfg.displayType === 6)// DATEBOX
							{
								var dateDiv = $('<div>').attr({
											'class' : 'input-daterange'
										});
								field.attr('style','width:90%');
								field.addClass('form-control ft-datepicker hasDatepicker');
								field.appendTo(dateDiv);
								$('<div class="input-group-addon has-icon"><i class="fa fa-calendar"></i></div>').appendTo(dateDiv);
								dateDiv.appendTo(innerDiv);
							} else
								field.appendTo(innerDiv);
							
							if(!isEmpty(cfg.displayType) && cfg.displayType !== 10 && cfg.displayType !== 11)
								field.addClass('form-control');
								
							if (cfg.allowAdhocValue) {
								if (field.hasClass('jq-editable-combo')) {
									field.editablecombobox("destroy");
								}

								$(field).editablecombobox({
											emptyText : 'Select ' + cfg.description,
											maxLength : 5,
											adhocValueAllowed : cfg.allowAdhocValue,
											adhocEnteredValue : cfg.value,
											title : mapLbl['lblAdhocFieldDisclaimer']
										});
								$(field).editablecombobox('refresh');
								var spanIndicator = $('<span>').attr({
									'style' : 'color:red'
								});
								spanIndicator.text(' '+ mapLbl['lblAdhocFieldIndicator']);
								spanIndicator.appendTo(label);
								blnAddendaDisclaimerVisibiliity = true;
							}
							innerDiv.appendTo(div);
							if (!isEmpty(cfg.sequenceNmbr)) {
								var seqno = cfg.sequenceNmbr;
								if (seqno % 2 !== 0) {
										if (!isEmpty(cfg.displayType)
												&& cfg.displayType != 10
												&& cfg.displayType != 11) {
											div.addClass(colCls);
										} else {
											var strAdditionalHelperCls = 'smallEnrichDiv';
											div.addClass(colCls
													+' '+ strAdditionalHelperCls);
										}
									div
											.appendTo(tempObj['mainDiv'
													+ strSetName]);
									if (arrPrdEnr.length > 1) {
										enrField = arrPrdEnr[index + 1];
										enrFieldSeqNo = enrField
												? enrField.sequenceNmbr
												: 1; // 1 if
										// index
										// is
										// 1;

										if (enrFieldSeqNo % 2 != 0) {
											if (cfg.displayType !== 9)// LONGTEXTBOX
												$('<div>')
														.attr({
																	'class' : colCls +' emptyEnrichDiv'
																})
														.appendTo(tempObj['mainDiv'
																+ strSetName]);
										}
									} else {
										if (cfg.displayType !== 9)// LONGTEXTBOX
											$('<div>').attr({
														'class' : 'col-sm-12'
													})
													.appendTo(tempObj['mainDiv'
															+ strSetName]);
									}

								} else if (seqno % 2 == 0) {
									if (arrPrdEnr.length > 1) {
										enrField = arrPrdEnr[index - 1];
										enrFieldSeqNo = enrField
												? enrField.sequenceNmbr
												: 2; // 2 if
										// index
										// is 1
										if (enrFieldSeqNo % 2 == 0) {
											$('<div>').attr({
														'class' : colCls 
													})
													.appendTo(tempObj['mainDiv'
															+ strSetName]);
										}

									} else {
										$('<div>').attr({
													'class' : colCls
												}).appendTo(tempObj['mainDiv'
												+ strSetName]);
									}

									div
											.appendTo(tempObj['mainDiv'
													+ strSetName]);
								}
							}
						}
					}
				}
				tempObj[strSetName + 'Counter'] = intCnt;
			}
		});
		$('<div>').attr({
					'class' : 'clear',
					'id' : 'clearDiv'
				}).appendTo(targetDiv);
	}
	// }

}
function paintPaymentEnrichmentAsSetNameWireLayout(setNameMap, arrPrdEnr,
		strTargetId) {
	var field = null, dependentField = null, targetDiv = $('#' + strTargetId), label = null, div = null, innerDiv = null, inlineDiv = null, intCnt, tempObj, mainDiv = null, fieldSetDiv = null, fieldset = null, legend = null;
	var strSetName = null, enrField = null, enrFieldSeqNo = 0;
	var colCls = 'col-sm-6';
	var chkBoxDiv = null, chkBoxLbl = null, wrapperDiv = null, internalWrapperDiv = null, internalShadedDiv = null,rowDiv = null;

	if (arrPrdEnr) {
		for (var i = 0; i < arrPrdEnr.length; i = i + 2) {
			cfg = arrPrdEnr[i];
			if (cfg.enrichmentSetName) {
				strSetName = (cfg.enrichmentSetName).replace(/ /g, '_');
				if (setNameMap[strSetName]) {
					tempObj = setNameMap[strSetName];
				} else {
					targetDiv.removeClass('hidden');
					wrapperDiv = $('<div>').attr({
								'id' : strSetName + '_WrapperDiv'
							}).appendTo(targetDiv);
					rowDiv = $('<div>').attr({
						'class' : 'row '
					});
					fieldSetDiv = $('<div>').attr({
								'class' : 'col-sm-12 ',
								'id' : strSetName + '_FieldSetDiv'
							}).appendTo(rowDiv);
					rowDiv.appendTo(wrapperDiv);

					chkBoxDiv = $('<div>').attr({
								'class' : 'checkbox ',
								'id' : strSetName + '_ChkBoxDiv'
							}).appendTo(fieldSetDiv);

					chkBoxLbl = $('<label>').attr({
								'class' : 'checkbox-inline',
								'style' : 'font-style:italic;font-weight: bold;'
							}).appendTo(chkBoxDiv);

					$('<input>').attr({
								'type' : 'checkbox',
								'id' : strSetName + '_ChkBox',
								'checked' : true
							}).on('click', function() {
								// $('#' + strSetName).toggle('hidden');
								var strId = $(this).attr('id');
								if (strId) {
									strId = strId.replace('_ChkBox', '_InternalWrapperDiv');
									$('#' + strId).toggleClass('hidden');
								}
							}).appendTo(chkBoxLbl);

					chkBoxLbl.append(cfg.enrichmentSetName);

					rowDiv = $('<div>').attr({
						'class' : 'row '
					});
					internalWrapperDiv = $('<div>').attr({
								'id' : strSetName + '_InternalWrapperDiv',
								'class' : 'col-sm-12 '
							}).appendTo(rowDiv);
					rowDiv.appendTo(wrapperDiv);

					internalShadedDiv = $('<div>').attr({
								'id' : strSetName + '_shadedDiv',
								'class' : 'well'
							}).appendTo(internalWrapperDiv);

					mainDiv = $('<div>').attr({
								'id' : strSetName,
								'class' : 'row'
							}).appendTo(internalShadedDiv);

					tempObj = {};
					tempObj['mainDiv' + strSetName] = mainDiv;
					tempObj['fieldSetDiv' + strSetName] = fieldSetDiv;
					tempObj[strSetName + 'Counter'] = 1;
					setNameMap[strSetName] = tempObj;
				}
				if (!isEmpty(tempObj)) {
					intCnt = tempObj[strSetName + 'Counter'];
					if (cfg.enrichmentType == 'S' || cfg.enrichmentType == 'M') {
						div = $('<div>').attr({
									'class' : colCls,
									'id' : cfg.code + 'Div'
								});
						innerDiv = $('<div>').attr({
									'class' : 'form-group',
									'id' : cfg.code + '_InnerDiv'
								});
						label = $('<label>').html(cfg.description);
						inlineDiv = $('<div>').attr({
									'class' : 'form-inline'
								});
						field = createEnrichMentField(cfg);
						if (cfg.enableDisable != null) {
							if (cfg.enableDisable == 'disable') {
								field.attr('disabled', true);
							} else if (cfg.enableDisable == 'enable') {
								field.attr('disabled', false);
							}
						}
						if (field) {
							label.attr('for', cfg.code);
							if (cfg.mandatory == true)
								label.addClass('required');
							label.appendTo(innerDiv);
							// $('<br/>').appendTo(div);
							if (cfg.enrichmentType === 'S') {
								if ('A' === cfg.includeInTotal
										|| 'S' === cfg.includeInTotal) {
									handleAmmountCalculationOnSingleSetEnrichment(
											field, cfg);
								}
								if (!isEmpty(cfg.apiName))
									handlePageRefreshOnSingleSetEnrichmentChange(
											field, cfg);
								/*
								 * else if (strLayoutType === 'TAXLAYOUT')
								 * handleAmmountCalculationOnSingleSetEnrichment(
								 * field, cfg);
								 */
							} else if (cfg.enrichmentType === 'M'
									&& !isEmpty(cfg.apiName))
								handlePageRefreshOnMultiSetEnrichmentChange(
										field, cfg, argsData,cfg.enrichmentType);
							field.appendTo(inlineDiv);
							field.attr('class', 'form-control');
							field.attr('style', 'width:29%;margin-right:5px;');
							if (cfg.allowAdhocValue) {
								if (field.hasClass('jq-editable-combo')) {
									field.editablecombobox("destroy");
								}

								$(field).editablecombobox({
											emptyText : 'Select '+cfg.description ,
											maxLength : 5,
											adhocValueAllowed : cfg.allowAdhocValue,
											adhocEnteredValue : cfg.value,
											title : mapLbl['lblAdhocFieldDisclaimer']
										});
								$(field).editablecombobox('refresh');
								var spanIndicator = $('<span>').attr({
									'style' : 'color:red'
								});
								spanIndicator.text(' '+ mapLbl['lblAdhocFieldIndicator']);
								spanIndicator.appendTo(label);
							}
							if (i + 1 < arrPrdEnr.length) {
								dependentFieldObj = arrPrdEnr[i + 1];
								if (dependentFieldObj) {
									var dependentField = createEnrichMentField(dependentFieldObj);
									if (dependentFieldObj.enableDisable != null) {
										if (dependentFieldObj.enableDisable == 'disable') {
											dependentField.attr('disabled',
													true);
										} else if (dependentFieldObj.enableDisable == 'enable') {
											dependentField.attr('disabled',
													false);
										}
									}
									dependentField
											.attr('class', 'form-control');
									dependentField.attr('style', 'width:68%');
									if (cfg.allowAdhocValue) {
										if (field.hasClass('jq-editable-combo')) {
											field.editablecombobox("destroy");
										}
		
										$(field).editablecombobox({
													emptyText : 'Select '+cfg.description,
													maxLength : 5,
													adhocValueAllowed : cfg.allowAdhocValue,
													adhocEnteredValue : cfg.value,
													title : mapLbl['lblAdhocFieldDisclaimer']
												});
										$(field).editablecombobox('refresh');
										var spanIndicator = $('<span>').attr({
											'style' : 'color:red'
										});
										spanIndicator.text(' '+ mapLbl['lblAdhocFieldIndicator']);
										spanIndicator.appendTo(label);
										blnAddendaDisclaimerVisibiliity = true;
									}
									dependentField.appendTo(inlineDiv);
								}
							}
							inlineDiv.appendTo(innerDiv);
							innerDiv.appendTo(div);
							if (!isEmpty(cfg.sequenceNmbr)) {
								var seqno = cfg.sequenceNmbr;
								if (seqno % 2 != 0) {
										div.addClass(colCls);
									div
											.appendTo(tempObj['mainDiv'
													+ strSetName]);
									if (arrPrdEnr.length > 1) {
										enrField = arrPrdEnr[i + 1];
										enrFieldSeqNo = enrField
												? enrField.sequenceNmbr
												: 1; // 1 if index is 1;

										if (enrFieldSeqNo % 2 != 0) {
											if (cfg.displayType !== 9) // LONGTEXTBOX
												$('<div>')
														.attr({
																	'class' : colCls
																})
														.appendTo(tempObj['mainDiv'
																+ strSetName]);
										}
									} else {
										if (cfg.displayType !== 9) // LONGTEXTBOX
											$('<div>').attr({
														'class' : 'col-sm-12'
													})
													.appendTo(tempObj['mainDiv'
															+ strSetName]);
									}

								} else if (seqno % 2 == 0) {
									 
									if (arrPrdEnr.length > 1) {
										enrField = arrPrdEnr[i - 1];
										enrFieldSeqNo = enrField
												? enrField.sequenceNmbr
												: 2; // 2 if index is 1
										if (enrFieldSeqNo % 2 == 0) {
											$('<div>').attr({
														'class' : colCls
													})
													.appendTo(tempObj['mainDiv'
															+ strSetName]);
										}

									} else {
										$('<div>').attr({
													'class' : colCls
												}).appendTo(tempObj['mainDiv'
												+ strSetName]);
									}

									div
											.appendTo(tempObj['mainDiv'
													+ strSetName]);
								}
							}
						}
					}
				}
				tempObj[strSetName + 'Counter'] = intCnt;
			}
		};
		$('<div>').attr({
					'class' : 'clear',
					'id' : 'clearDiv'
				}).appendTo(targetDiv);
	}
}

function paintPaymentEnrichmentsHelper(arrPrdEnr, intCounter, strTargetId,
		strPmtType, argsData, isMultiset) {
	var field = null, targetDiv = $('#' + strTargetId), label = null, div = null, wrappingDiv = null, intCnt = 1, sortArrPrdEnr, minCounter, maxCounter, arrLength;
	var colCls = 'col-sm-6';
	if (!isEmpty(intCounter))
		intCnt = intCounter;

	if (arrPrdEnr) {
		sortArrPrdEnr = generateSortArrPrdEnr(arrPrdEnr);
		arrLength = sortArrPrdEnr.length;
		minCounter = sortArrPrdEnr[0].sequenceNmbr;
		maxCounter = sortArrPrdEnr[arrLength - 1].sequenceNmbr;
		for (var i = minCounter; i <= maxCounter; i++) {
			var enrField = null;
			enrField = getEnrField(arrPrdEnr, i);
			if (!isEmpty(enrField) && enrField != null) {
				if (enrField.enrichmentType == 'S'
						|| enrField.enrichmentType == 'M') {
					
					wrappingDiv = $('<div>').attr({
								'class' : colCls,
								'id' : enrField.code + 'wrappDiv'
							});
					div = $('<div>').attr({
								'class' : 'form-group',
								'id' : enrField.code + 'Div',
								'title':enrField.value
							});
					// label = $('<label>').attr('class', 'fieldLabel');
					label = $('<label>').attr('class', 'payment-font-bold');

					
					if(!isEmpty(enrField.displayType) && enrField.displayType != 10)		
						label.text(enrField.description);
					else	
						label.text("");
					
					field = createEnrichMentField(enrField);
					if (field) {
						label.attr('for', enrField.code);
						if (enrField.mandatory == true)
							label.addClass('required');
						label.appendTo(div);
						// $('<br/>').appendTo(div);
						// TODO : To be handled
						//if (false) {
							if (enrField.enrichmentType === 'S'
								&& !isEmpty(enrField.apiName))
							handlePageRefreshOnSingleSetEnrichmentChange(field,
									enrField);
						else if (enrField.enrichmentType === 'M'
								&& !isEmpty(enrField.apiName)) {
							handlePageRefreshOnMultiSetEnrichmentChange(field,
									enrField, argsData, enrField.enrichmentType);
							if (!isEmpty(enrField.defaultValue))
								$(enrField).trigger("change");
						}
						// }
						if( !isEmpty(enrField.displayType) && enrField.displayType != 10 && enrField.displayType != 11)
							field.addClass('form-control')
							
							if (enrField.displayType === 6)// DATEBOX
							{
								field
									.addClass('form-control ft-datepicker hasDatepicker');
								var dateDiv = $('<div>').attr({
											'class' : 'input-daterange'
										});
								field.attr('style','width:90%');
								field.appendTo(dateDiv);
								$('<div class="input-group-addon has-icon"><i class="fa fa-calendar"></i></div>').appendTo(dateDiv);
								dateDiv.appendTo(div);
							} else 
							field.appendTo(div);	
						if (enrField.allowAdhocValue && enrField.displayType != 11) {
							if (field.hasClass('jq-editable-combo')) {
								field.editablecombobox("destroy");
							}

							$(field).editablecombobox({
										emptyText : 'Select '+ enrField.description,
										maxLength : 5,
										adhocValueAllowed : enrField.allowAdhocValue,
										adhocEnteredValue : enrField.value,
										title : mapLbl['lblAdhocFieldDisclaimer']
									});
							$(field).editablecombobox('refresh');
							var spanIndicator = $('<span>').attr({
								'style' : 'color:red'
							});
							spanIndicator.text(' '+ mapLbl['lblAdhocFieldIndicator']);
							spanIndicator.appendTo(label);
							blnTransDisclaimerVisibiliity = true;
						}			
						
						div.appendTo(wrappingDiv);
						wrappingDiv.appendTo(targetDiv);
						intCnt++;
					}
				}
			} else {
				div = $('<div>').attr({
							'class' : colCls + ' emptyEnrichDiv'
						});
				div.appendTo(targetDiv);
				intCnt++;
			}
		}
	}
	return intCnt;
}
function paintPaymentDenominationsHelper(arrPrdEnr, intCounter, strTargetId, strPmtType) {
	var field = null, targetDiv = $('#' + strTargetId), label = null, div = null, wrappingDiv = null, rowDiv = null, intCnt = 0, sortArrPrdEnr, arrLength;
	var colCls = 'col-sm-4';
	if (!isEmpty(intCounter))
		intCnt = intCounter;
	targetDiv.empty();
	if (arrPrdEnr) {
		sortArrPrdEnr = generateSortArrDenominations(arrPrdEnr);
		arrLength = sortArrPrdEnr.length;
		for (var i = 0; i < arrLength; i++) {
			var denomField = null,denomParams = [],denomCode = null;
			denomParams = getDenomField(arrPrdEnr, i);
			rowDiv = $('<div>').attr({
				'class' : 'row',
				'id' : denomParams[0].code +'_'+ denomParams[0].parentEnrichCode + '_rowDiv'
			});
			for(var j = 0; j < denomParams.length; j++){
				denomField = denomParams[j];
				if(denomField.code == 'denomination' && !isEmpty(denomField.value)){
					denomCode = denomField.value;
					denomDesc = denomField.enrichmentSetName;
					denomPrntEnrch=denomField.parentEnrichCode;
					denomPrntEnrch = !isEmpty(denomPrntEnrch) ? denomPrntEnrch.toString().replace('.', '_') : denomPrntEnrch;
				}
				if (!isEmpty(denomField) && denomField != null) {
					wrappingDiv = $('<div>').attr({
								'class' : colCls,
								'id' : denomField.code +'_'+ denomPrntEnrch + '_wrappDiv'
							});
					div = $('<div>').attr({
								'class' : 'form-group',
								'id' : denomField.code +'_'+ denomPrntEnrch +  '_Div'
							});
					
					field = createEnrichMentField(denomField);
					
					if (field) {
						if (denomField.editable == false)
							field.attr('disabled','disabled');
						
						field.attr('denomCode',denomCode);
						field.attr('id',field.attr('id')+'_'+denomPrntEnrch);
						field.attr('denomPrntEnrch',denomPrntEnrch);
						if(denomField.code == 'denomination' ){
							field.attr('value',denomDesc);
							field.removeClass('amountBox');
						}
						if(denomField.code == 'amount'){
							field.addClass('denomAmount');
						} 
						if(denomField.code == 'pieces'){
							handleAmountCalculationOnPiecesChange(field,denomField);
						} 
						field.addClass('form-control')
						field.appendTo(div);	
						
						div.appendTo(wrappingDiv);
						$('<br/>').appendTo(wrappingDiv);
						wrappingDiv.appendTo(rowDiv);
						intCnt++;
					}
				}
			}
			rowDiv.appendTo(targetDiv);
			doHandleDenomAmountSum();
		}
	}
	return intCnt;
}

function paintPaymentDenominationsHelperViewOnly(arrPrdEnr, intCounter, strTargetId, strPmtType) {
	var targetDiv = $('#' + strTargetId), label = null, div = null, wrappingDiv = null, rowDiv = null, valueSpan = null, intCnt = 0, sortArrPrdEnr, arrLength,strValue='';
	var colCls = 'col-sm-4',totalAmount = 0;
	if (!isEmpty(intCounter))
		intCnt = intCounter;
	targetDiv.empty();
	if (arrPrdEnr) {
		sortArrPrdEnr = generateSortArrDenominations(arrPrdEnr);
		arrLength = sortArrPrdEnr.length;
		for (var i = 0; i < arrLength; i++) {
			var denomField = null,denomParams = [],denomCode = null;
			denomParams = getDenomField(arrPrdEnr, i);
			rowDiv = $('<div>').attr({
				'class' : 'row',
				'id' : denomParams[0].code +'_'+ denomParams[0].parentEnrichCode + '_rowDiv'
			});
			if(denomParams[1].value>0){
				for(var j = 0; j < denomParams.length; j++){
					denomField = denomParams[j];
					if(denomField.code == 'denomination' && !isEmpty(denomField.value)){
						denomCode = denomField.parentEnrichCode;
						denomCode = !isEmpty(denomCode) ? denomCode.toString().replace('.', '_') : denomCode;
						denomDesc = denomField.enrichmentSetName;
						strValue = denomField.enrichmentSetName;
					}
					else
					strValue = denomField.value;
					if (!isEmpty(denomField) && denomField != null) {
						
						wrappingDiv = $('<div>').attr({
									'class' : colCls,
									'id' : denomField.code +'_'+ denomCode + '_wrappDiv'
								});
						div = $('<div>').attr({
									'class' : 'form-group',
									'id' : denomField.code +'_'+ denomCode +  '_Div'
								});
						
						valueSpan = $('<span class="center-block">');
						if(denomField.code == 'denomination' ){
							valueSpan.html(' ' + denomDesc || '&nbsp;');
						}
						else if(denomField.code == 'amount') { 
							valueSpan.autoNumeric("init",
								{
									aSep: strGroupSeparator,
									dGroup: strAmountDigitGroup,
									aDec: strDecimalSeparator,
									mDec: strAmountMinFraction
								});
							valueSpan.autoNumeric("set",strValue);
							totalAmount = totalAmount + strValue;
						} else
							valueSpan.html(' ' + strValue || '&nbsp;');
						valueSpan.appendTo(div);	
						div.appendTo(wrappingDiv);
						$('<br/>').appendTo(wrappingDiv);
						wrappingDiv.appendTo(rowDiv);
						
						$('.totalDenomAmount').autoNumeric("init",
						{
							aSep: strGroupSeparator,
							dGroup: strAmountDigitGroup,
							aDec: strDecimalSeparator,
							mDec: strAmountMinFraction
						});
						$('.totalDenomAmount').autoNumeric('set',totalAmount);
						intCnt++;
					}
				}
				rowDiv.appendTo(targetDiv);
			}
		}
	}
	return intCnt;
}

function handleAmountCalculationOnPiecesChange(field, cfg) {
	var displayType = cfg.displayType;
	var strEventName = '';
	if (isEmpty(displayType))
		displayType = 0;
	strEventName = getEnrichFieldEventName(displayType);
	if (!isEmpty(strEventName))
		field.on(strEventName, function() {
					doHandleAmountCalculation($(this));
				});
}

function doHandleAmountCalculation(elem){
	var denomCode = '', noOfPieces = 0, denomAmount = 0, strAmountFieldName ='';
		noOfPieces = elem.val();
		denomCode = elem.attr('denomCode');
		var denomPrntEnrch = elem.attr('denomPrntEnrch');
		strAmountFieldName = 'amount_'+denomPrntEnrch;
		if(denomCode.indexOf('_') > -1)
			denomCode = denomCode.replace('_','.');
		if((!isNaN(noOfPieces) && !isNaN(denomCode) && !isEmpty(denomCode) && !isEmpty(noOfPieces))){
			denomAmount = noOfPieces * denomCode;
			if(!isEmpty(denomAmount) && denomAmount.toString().length >13)
				doHandleDenomAmountErrorPaint();
		}
		$('#'+strAmountFieldName).autoNumeric('set',denomAmount);		
		doHandleDenomAmountSum();
}
function doHandleDenomAmountSum(){
	var totalAmount = 0;
	doClearMessageSection();
	$('.denomAmount').each(function() {
		var amnt = 0 , denom = 0;
		denom = $(this).attr('denomCode');
		var denomPrntEnrch = $(this).attr('denomPrntEnrch');
		var blnAutoNumeric = isAutoNumericApplied('amount_'+ denomPrntEnrch);
			if( blnAutoNumeric )
				amnt = $('#amount_'+ denomPrntEnrch).autoNumeric( 'get' );
			else
				amnt = $('#amount_'+ denomPrntEnrch).val();
            if((!isNaN(amnt) && !isEmpty(amnt))) {
            	totalAmount = totalAmount + parseFloat(amnt);
            	if(!isEmpty(totalAmount) && totalAmount.toString().length >13)
    				doHandleDenomAmountErrorPaint();
            }
    });
 	$('.totalDenomAmount').autoNumeric('init',
	{
		aSep: strGroupSeparator,
		dGroup: strAmountDigitGroup,
		aDec: strDecimalSeparator,
		mDec: strAmountMinFraction,
		vMax : '99999999999999.99'
	});
    $('.totalDenomAmount').autoNumeric('set',totalAmount);
    
    if(strPaymentType === 'BATCHPAY'){
		$('#amount').val(totalAmount);
    }
}
function doHandleDenomAmountErrorPaint(){
	var arrError = [];
		arrError.push({
			"errorCode" : "ERR",
			"errorMessage" : 'Total Amount exceeds the allowed Limit.'
		});
		paintErrors(arrError,null,getLabel('Error','Error'));
		scrollToTop();
}

function createEnrichMentField(cfg) {
	var displayType = cfg.displayType;
	var field = null, value = null;
	if (isEmpty(displayType))
		displayType = 0;
	value = cfg.value;
	switch (displayType) {
		case 1 : // TEXTAREA
			field = createTextArea(cfg.code, cfg.code, value, false,
					cfg.maxLength, 3, 50);
			field.addClass('w14_8 ml12');
			break;
		case 2 : // AMOUNTBOX
			field = createAmountBox(cfg.code, cfg.code, value, false,
					cfg.maxLength, cfg);
			field.addClass('w14_8 ml12');
			break;
		case 3 : // NUMBERBOX
			field = createNumberBox(cfg.code, cfg.code, value, false,
					cfg.maxLength);
			field.addClass('w14_8 ml12');
			break;
		case 4 : // COMBOBOX
			value = value || cfg.defaultValue;
			field = createComboBox(cfg.code, cfg.code, value, false,
					cfg.lookupValues, false, cfg.allowAdhocValue);
			field.addClass('w15_7 ml12');
			break;
		case 5 : // SELECTBOX
			break;
		case 6 : // DATEBOX
			var dateFormat = convertEnrichmentDateFormat(cfg.dateFormat);
			if(isEmpty(dateFormat))
			dateFormat = strApplicationDateFormat
					? strApplicationDateFormat
					: 'mm/dd/yyyy';
			field = createEnrichmentDateBox(cfg.code, cfg.code, value, true,
					cfg.maxLength, dateFormat, cfg.mandatory, cfg);
			field.addClass('w14_8 ml12');
			break;
		case 7 : // TIMEBOX
			break;
		case 8 : // SEEKBOX
			// field = createSeekBox(cfg.code, cfg.code, null, cfg.maxLength,
			// 'services/recieverseek.json?&$top=-1', 'd.receivers',
			// 'receiverCode', 'receiverName');
			// field.addClass('w14 ml12');
			break;
		case 9 : // LONGTEXTBOX
			field = createTextBox(cfg.code, cfg.code, value, false,
					cfg.maxLength);
			field.addClass('w46 ml12');
			//field.ForceNoSpecialSymbol();
			break;
		case 10 : // CHECKBOX
			field = createEnrichmentCheckBox(cfg.code, cfg.description, cfg.value, cfg.mandatory);
			break;
		case 11 : // RADIOBOX
			field = createEnrichmentRadioButton(cfg.code, value, cfg.lookupValues, cfg.mandatory);
			break;
		case 0 : // TEXTBOX
		default :
			field = createTextBox(cfg.code, cfg.code, value, false,
					 cfg.maxLength);
			field.addClass('w14_8 ml12');
			if(cfg.dateFormat == 'NSChar')
			{
				field.ForceNoSpecialSymbolWithoutSpace();
			}
			break;
	}
	return field;
}

function handleEnrichFieldPopulation(cfg, fieldId) {
	var displayType = cfg.displayType, defValue = cfg.value;
	var field = null;
	if (isEmpty(displayType))
		displayType = 0;
	switch (displayType) {
		case 1 : // TEXTAREA
			break;
		case 2 : // AMOUNTBOX
			populateTextFieldValue(fieldId, defValue);
			break;
		case 3 : // NUMBERBOX
			populateTextFieldValue(fieldId, defValue);
			break;
		case 4 : // COMBOBOX
			break;
		case 5 : // SELECTBOX
			populateSelectFieldValue(fieldId, cfg.lookupValues, defValue);
			break;
		case 6 : // DATEBOX
			populateDateFieldValue(fieldId, defValue);
			break;
		case 7 : // TIMEBOX
			break;
		case 8 : // SEEKBOX
			populateSeekFieldValue(fieldId, defValue);
			break;
		case 0 : // TEXTBOX
			populateTextFieldValue(fieldId, defValue);
			break;
		default :
			populateTextFieldValue(fieldId, defValue);
			break;
	}
	return field;
}

/**
 * The generic function handleFieldPopulation used to handle the field value
 * population and editable/non-editable of the UI field based on the response
 * JSON.
 * 
 * @param {JSON}
 *            cfg The JSON node from response
 * 
 * @param {Stirng}
 *            fieldId The JSON node name of the field. Should be same on UI,
 *            only string postfix will appended based on single/multiple payment
 * 
 * 
 * @example
 * The field syantax on UI should be as <div id="companyIdDiv"
 *          class="col_1_2 hidden extrapadding_bottom"> <label class="frmLabel"
 *          id="companyIdLbl" for="companyId"> <spring:message
 *          code="lbl.pir.companyid" text="Company Id" /></label><br/> <select
 *          name="companyId" id="companyId" class="rounded w14 ml12"> <option
 *          value=""> <spring:message code="lbl.payments.selectcompany"
 *          text="Select Company" /> </option> </select> </div>
 * 
 * The field details in JSON response : { fieldName: "companyId", label:
 * "Company Id", displayMode: "3", readOnly: "true", availableValues: [ { code:
 * "PAY0001", description: "PAY0001 - PAY" }, { code: "PAY0002", description:
 * "PAY0002 - PAY" } ], dataType: "select" }
 * 
 * The logic is as below : If readOnly is true/false in response JSON and
 * dataType is 'select' or 'checkBox' or 'radio' then the field's disabled
 * attribute will set to true/false If readOnly is true/false in response JSON
 * and dataType is 'text' or 'mask' or 'multiselect' or 'seek' or 'date' or
 * 'amount' then the field's readonly attribute will set to true/false
 * 
 */
function handleFieldPopulation(cfg, fieldId) {
	var dataType = cfg.dataType, defValue = cfg.value, blnReadOnly = cfg.readOnly;
	var field = $('#' + fieldId);
	var blnAmountDisabled = false;
	var isReadonly = (!isEmpty(blnReadOnly) && blnReadOnly == 'true')
			? true
			: false;

	if (dataType) {
		switch (dataType) {
			case 'text' :
				populateTextFieldValue(fieldId, defValue);
				break;
			case 'select' :
			case 'mask' :
				if (fieldId === 'lockFieldsMask')
					populateLockFieldValue(fieldId, cfg.availableValues,
							defValue);
				/*else if (fieldId === 'bankProduct' && charPaymentType === 'B') {  // to fix issue DHGCP441-2563 this else if block is commented. 
					populateSelectFieldValue(fieldId, cfg.availableValues,
							defValue, true);
				}*/ else
					populateSelectFieldValue(fieldId, cfg.availableValues,
							defValue);
				if(fieldId=== 'txnCurrency')
					toggleCurrencyLabel(cfg.txnCurrency);
				break;
			case 'multiselect' :
				if (!isEmpty(strEntryType)
						&& strEntryType === 'TEMPLATE'
						&& (fieldId === 'accountNo'
								|| fieldId === 'templateRoles' || fieldId === 'templateUsers')) {
					populateMultiSelectFieldValue(fieldId, cfg.availableValues,
							cfg.values);
					if (fieldId === 'templateUsers')
						arrTemplateUsersInst = cfg.values || [];
				}
				break;
			case 'seek' :
				populateSeekFieldValue(fieldId, defValue);
				break;
			case 'date' :
				populateDateFieldValue(fieldId, defValue);
				break;
			case 'amount' :
				populateAmountFieldValue(fieldId, cfg.availableValues,
						defValue, cfg.txnCurrency, 'txnCurrency');
				//toggleCurrencyLabel(cfg.txnCurrency);
				if(fieldId=='amount'  && isReadonly)
				{
					var fldRadioDebitPaymentAmnt = $("input[name='debitPaymentAmntFlag']");
					if(fldRadioDebitPaymentAmnt && fldRadioDebitPaymentAmnt.lengh != 0)
					{
						fldRadioDebitPaymentAmnt.attr("disabled", true);
					}
				}
				break;
			case 'radio' :
				populateRadioFieldValue(fieldId, defValue);
				if (fieldId === 'drCrFlag') {
					if (strLayoutType === 'ACCTRFLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT' || strLayoutSubType === 'DRAWDOWN') {
						toggleAccountLabel(null, defValue);
					}
					if ((defValue === 'C' || defValue === 'D')
							&& charPaymentType === 'B') {
						// $('#drCrFlagDiv').addClass('hidden');
						$('#drCrFlagD, #drCrFlagC').attr("checked", false);
						populateRadioFieldValue(fieldId, defValue);
						// $('#drCrFlagD, #drCrFlagC').attr('disabled', true);
					} else if ((defValue === 'C' || defValue === 'D')
							&& charPaymentType === 'Q') {
						$('#drCrFlagD, #drCrFlagC').attr("checked", false);
						populateRadioFieldValue(fieldId, defValue);
					} else if (defValue === 'B') {
						$('#drCrFlagD').attr("checked", false);
						$('#drCrFlagC').attr("checked", true);
						if (strLayoutType === 'ACCTRFLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT' || strLayoutSubType === 'DRAWDOWN') {
							toggleAccountLabel(null, 'C');
						}
					}
				} else if (fieldId === 'templateType') {
					$('input:radio[name="templateType"]').attr('disabled',
							isReadonly);
				}else if (fieldId === 'accTrfType') {
					$('input:radio[name="accTrfType"]').attr('disabled',
							isReadonly);
				}
				if (!isEmpty(cfg.value)) {
					var fldRadio = $("input[name='" + fieldId + "']");
					if(fieldId == 'drCrFlag') {
						fldRadio = $("input[name='" + fieldId + "'][value='" + cfg.value + "']");
					}
					if (fldRadio && fldRadio.length != 0
							&& !isEmpty(blnReadOnly) && blnReadOnly == 'true'
							&& !isEmpty(cfg.value)) {
						fldRadio.attr("disabled", true);
						fldRadio.val(cfg.value);
					}
				}
				break;
			case 'checkBox' :
				populateCheckBoxFieldValue(fieldId, defValue);
				if (field && field.length != 0) {
					if (defValue === 'Y') {
						field.attr('checked', true);
					} else {
						field.attr('checked', false);
					}
					if (isReadonly === true)
						field.attr('disabled', true);
				}
				var fldCheckbox = $('input[name="' + fieldId + '"]:checkbox');
				if (fldCheckbox && fldCheckbox.length != 0
						&& !isEmpty(blnReadOnly) && blnReadOnly == 'true'
						&& !isEmpty(cfg.value)) {
					fldCheckbox.attr("disabled", true);
					fldCheckbox.val(cfg.value);
				}
				break;
		}
	}
	if (field && field.length != 0 && !isEmpty(blnReadOnly)
			&& blnReadOnly == 'true' && !isEmpty(cfg.value)) {
		if (dataType === 'select' && !isEmpty(defValue)) {
			if('accountNo' === fieldId || 'drawerAccountNo' === fieldId || 'beneficiaryBankIDTypeA' === fieldId
				|| 'anyIdTypeA' === fieldId){
				$('#'+fieldId+'_jq').attr('disabled', 'disabled');
				$('#'+fieldId+'-niceSelect').attr('disabled', 'disabled');
				$('#'+fieldId+'-niceSelect').attr('readonly', 'readonly');
				$('#'+fieldId+'-niceSelect').addClass('disabled');
				if('beneficiaryBankIDTypeA' === fieldId)
				{
					$('#bankBranchSelector').hide();	
			}
				else
				{
					$('#bankBranchSelector').show();
				}
			}
			field.attr("disabled", "disabled");
			field.attr('readonly', 'readonly');
			field.addClass('disabled');
			field.val(cfg.value);
		} else if('amount' !== fieldId ) {
			if (fieldId === 'beneficiaryBankIDCodeA') {
				$('#beneficiaryBankIDCodeAutoCompleter').attr({
							'readonly' : 'readonly'
						}, {
							"disabled" : "disabled"
						});
			}
			field.attr('readonly', 'readonly');
			field.attr("disabled", "disabled");
			field.val(cfg.value);
		}
	}
	if('drawerAccountNoA' === fieldId || 'drawerAccountNoR' === fieldId || 'intBankIDDescA' === fieldId || 'corrBankIDDescA' === fieldId)
	{
		field.val(cfg.value);
	}
	if('certificateRefNo' === fieldId){
		if(field && field.length != 0 && !isEmpty(blnReadOnly) && blnReadOnly == 'true') {
			field.attr("disabled", "disabled");
			field.attr('readonly', 'readonly');
			field.addClass('disabled');
			field.val(cfg.value);
			$('#certificateRefNoLbl').removeClass('required');
		} else {	
			field.removeAttr("disabled");
			field.removeAttr('readonly');
			field.removeClass('disabled');
			$('#certificateRefNoLbl').addClass('required');
		}
	}
	if('micrNo' === fieldId){
		if(field && field.length != 0 && !isEmpty(blnReadOnly) && blnReadOnly == 'true') {
			field.attr("disabled", "disabled");
			field.attr('readonly', 'readonly');
			field.addClass('disabled');
			field.val(cfg.value);
			$('#micrNo').removeClass('required');
		} else {	
			field.removeAttr("disabled");
			field.removeAttr('readonly');
			field.removeClass('disabled');
		}
	}
	
	if(field && field.length != 0 && 'whtTotalAmount' === fieldId)
		$('#whtTotalAmountLbl').addClass('required'); 
	else if(field && field.length != 0 && 'whtFormCode' === fieldId)
		$('#whtFormCodeLbl').addClass('required');
	else if(field && field.length != 0 && 'invoiceDate' === fieldId)
		$('#invoiceDateLbl').addClass('required');
	
	if('amount' === fieldId){
		if(field && field.length != 0 && !isEmpty(blnReadOnly) && blnReadOnly == 'true') {
			field.attr("disabled", "disabled");
			field.attr('readonly', 'readonly');
			field.addClass('disabled');
		} else {	
			field.removeAttr("disabled");
			field.removeAttr('readonly');
			field.removeClass('disabled');
		}
	}
}
function handleAmmountCalculationOnSingleSetEnrichment(field, cfg) {
	var displayType = cfg.displayType;
	var strEventName = 'focusout';
	if (isEmpty(displayType))
		displayType = 0;
	 
	strEventName = getEnrichFieldEventName(displayType);
	if (!isEmpty(strEventName) && cfg.code != "IAT08")
		field.on(strEventName, function() {
					doHandleAmountSummation();
				});
}
function handlePageRefreshOnSingleSetEnrichmentChange(field, cfg) {
	var displayType = cfg.displayType;
	var strApiName = cfg.apiName;
	var strEventName = '';
	var copyFlag = "copy";
	var checkDigitVal = "ChkDigitVal";
	if (isEmpty(displayType))
		displayType = 0;
	if (!isEmpty(strApiName)
			&& (strApiName.substr(0, copyFlag.length) != copyFlag)
			&& (strApiName != checkDigitVal)) {
		strEventName = getEnrichFieldEventName(displayType);
		if (!isEmpty(strEventName))
			field.on(strEventName, function() {
						if (strLayoutType === 'TAXLAYOUT')
							doHandleAmountSummation();
						if (charPaymentType === 'Q')
							doHandelRefreshBatchInstrumentFieldsOnEnrichChange(
									$(this), null, null, null, charPaymentType);
						else if (charPaymentType === 'B') {
							// doHandelRefreshPaymentFieldsOnEnrichChange($(this));
							doHandelRefreshBatchInstrumentFieldsOnEnrichChange(
									$(this), null, null, null, charPaymentType);
						}
					});
	}

}

function handlePageRefreshOnMultiSetEnrichmentChange(field, cfg, argsData,strEnrichType) {
	var displayType = cfg.displayType;
	var strApiName = cfg.apiName;
	var strEventName = '';
	var copyFlag = "copy";
	var checkDigitVal = "ChkDigitVal";
	if (isEmpty(displayType))
		displayType = 0;
	if (!isEmpty(strApiName)
			&& (strApiName.substr(0, copyFlag.length) != copyFlag)
			&& (strApiName != checkDigitVal)) {
		strEventName = getEnrichFieldEventName(displayType);
		if (!isEmpty(strEventName))
			field.on(strEventName, function() {
						if (strLayoutType === 'TAXLAYOUT')
							doHandleAmountSummation();
						if (charPaymentType === 'Q')
							doHandelRefreshBatchInstrumentFieldsOnEnrichChange(
									$(this), strEnrichType, refreshMultiSetEnrichmentPopUp, argsData, charPaymentType);
						else if (charPaymentType === 'B') {
							// doHandelRefreshPaymentFieldsOnEnrichChange($(this));
							doHandelRefreshBatchInstrumentFieldsOnEnrichChange(
									$(this), strEnrichType, refreshMultiSetEnrichmentPopUp, argsData, charPaymentType);
						}
					});
	}

}

function doHandelRefreshBatchInstrumentFieldsOnEnrichChange(obj, strEnrichType,
		fnPointer, argsData, charPaymentType) {
	refreshBatchInstrumentFieldsOnEnrichChange(obj, strEnrichType, fnPointer,
			argsData, charPaymentType);
}
function refreshBatchInstrumentFieldsOnEnrichChange(obj, strEnrichType,
		fnPointer, argsData, charPaymentType) {
	if (!isEmpty(obj)) {
		var enrichId;
		var enrichValue;
		if(strEnrichType == "paymentCustomization")
		{
			enrichId = obj.enrichmentCode;
			enrichValue=$('#'+obj.fieldName).val();
		}
		else
		{
			enrichId = obj.attr('id');
			enrichValue = obj.attr('value');
			
		}
		if(Ext.isEmpty(enrichValue))
		{
			enrichValue=objApiEnrichmentType[enrichId]+'@empty';
		}
		var addendOffset = $(window).scrollTop();
		var strEnriTyp = (!isEmpty(argsData) && !isEmpty(argsData.strEnrichType))
				? argsData.strEnrichType
				: '';
		var url = _mapUrl['refreshEnrichmentsUrl'];
		if (!isEmpty(strPaymentInstrumentIde))
			url = url + "/(" + strPaymentInstrumentIde + ")";
		url += '/' + enrichId;
		url += '/' + enrichValue;
		url += '/' + objApiEnrichmentType[enrichId] + '.json';		
		var jsonObj = generatePaymentInstrumentJson();
		if (jsonObj.d && jsonObj.d.__metadata && strPaymentInstrumentIde) {
			jsonObj.d.__metadata._detailId = strPaymentInstrumentIde;
		}
		if (charPaymentType == 'B' && jsonObj.d && jsonObj.d.__metadata
				&& strPaymentHeaderIde) {
			jsonObj.d.__metadata._headerId = strPaymentHeaderIde;
		}
		jsonObj.d.__metadata._pirMode = strEntryType;

		if (strEnrichType === 'M') {
			var obj = generateJsonForDepenentField(argsData);
			if (!isEmpty(strEnriTyp) && strEnriTyp === 'BANKPRDMSE') {
				if (jsonObj.d
						&& jsonObj.d.paymentEntry
						&& jsonObj.d.paymentEntry.enrichments
						&& jsonObj.d.paymentEntry.enrichments.bankProductMultiSet) {
					jsonObj.d.paymentEntry.enrichments['bankProductMultiSet'] = obj;
					jsonObj.d.paymentEntry.enrichments['bankProductMultiSetMetadata'] = obj;
				}
			} else if (!isEmpty(strEnriTyp) && strEnriTyp === 'CLIPRDMSE') {
				if (jsonObj.d && jsonObj.d.paymentEntry
						&& jsonObj.d.paymentEntry.enrichments
						&& jsonObj.d.paymentEntry.enrichments.clientMultiSet) {
					jsonObj.d.paymentEntry.enrichments['clientMultiSet'] = obj;
					jsonObj.d.paymentEntry.enrichments['clientMultiSetMetadata'] = obj;
				}
			} else if (!isEmpty(strEnriTyp) && strEnriTyp === 'MYPPRDMSE') {
				if (jsonObj.d && jsonObj.d.paymentEntry
						&& jsonObj.d.paymentEntry.enrichments
						&& jsonObj.d.paymentEntry.enrichments.myProductMultiSet) {
					jsonObj.d.paymentEntry.enrichments['myProductMultiSet'] = obj;
					jsonObj.d.paymentEntry.enrichments['myProductMultiSetMetadata'] = obj;
				}
			}
		}
		doClearMessageSection();
		// blockPaymentUI(true);
		$.ajax({
			type : "POST",
			url : url,
			async : false,
			contentType : "application/json",
			data : JSON.stringify(jsonObj),
			complete : function(XMLHttpRequest, textStatus) {
				if ("error" == textStatus) {
					// TODO : Error handling to be done.
					// alert("Unable to complete your request!");
				}
			},
			success : function(data) {
				if (data.d
						&& data.d.message
						&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
					paintErrors(data.d.message.errors);
					blockPaymentInstrumentUI(false);

				} else if (data != null) {
					if (data.d
							&& data.d.message
							&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
						paintErrors(data.d.message.errors);
						blockPaymentInstrumentUI(false);

					}if (data.d
							&& data.d.paymentEntry
							&& data.d.paymentEntry.message
							&& (data.d.paymentEntry.message.errors || data.d.paymentEntry.message.success === 'SAVEWITHERROR')) {
						paintErrors(data.d.paymentEntry.message.errors);
					} else {
						if (!isEmpty(strEnrichType) && strEnrichType === 'M') {
							paymentResponseInstrumentData = data;
							// This will call the repaint enrich popup function
							// i.e paymentInitiationMultiSetEnrichments.js >
							// refreshMultiSetEnrichmentPopUp
							if (!isEmpty(fnPointer)
									&& typeof fnPointer === 'function') {
								fnPointer(data, argsData);
							}
							blockPaymentInstrumentUI(false);
						} else {
							paymentResponseInstrumentData = data;
							paintPaymentInstrumentUI(data, 'Q');
							initateValidation();
							blockPaymentInstrumentUI(false);
							handleEmptyEnrichmentDivs();
						}
					}
				}
			}
		});
		//$('#'+enrichId).focus();
		$(document).scrollTop(addendOffset);
	}
}
function getEnrichFieldEventName(strDisplayType) {
	var strEventName = null
	switch (strDisplayType) {
		case 1 : // TEXTAREA
			strEventName = 'blur';
			break;
		case 2 : // AMOUNTBOX
			strEventName = 'blur';
			break;
		case 3 : // NUMBERBOX
			strEventName = 'blur';
			break;
		case 4 : // COMBOBOX
			strEventName = 'change';
			break;
		case 5 : // SELECTBOX
			break;
		case 6 : // DATEBOX
			strEventName = 'blur';
			break;
		case 7 : // TIMEBOX
			break;
		case 8 : // SEEKBOX
			break;
		case 0 : // TEXTBOX
		default :
			strEventName = 'blur';
			break;
	}
	return strEventName;
}
function postHandleClientEnrichments() {
	var data = paymentResponseInstrumentData;
	var displaySequenceNo = null;
	var parentCode = null;
	if (data && data.d && data.d.paymentEntry
			&& data.d.paymentEntry.enrichments
			&& data.d.paymentEntry.enrichments.clientEnrichment
			&& data.d.paymentEntry.enrichments.clientEnrichment.parameters) {
		var param = data.d.paymentEntry.enrichments.clientEnrichment.parameters;
		$.each(param, function(index, cfg) {
			var strDependencyType = cfg.dependencyType ?  cfg.dependencyType : '';
			if (cfg.amountType == 'AmtTypeNone') {
				$('#' + cfg.code).on('change',
						function(field, newValue, oldValue) {
							var code = $('#' + this.id).data('nextEnrichment');
							if (null != this.value && this.value != ''
									&& this.value != 'NONE') {
								$('#' + code).attr('disabled', false);
							} else {
								$('#' + code).attr('disabled', true);
								$('#' + code).val('');
							}
						});
				displaySequenceNo = (cfg.sequenceNmbr + 1);
				parentCode = cfg.code;
				if (null != displaySequenceNo
						&& cfg.sequenceNmbr == displaySequenceNo) {
					$('#' + parentCode).data('nextEnrichment', cfg.code);
					$('#' + cfg.code).attr('disabled', true);
					displaySequenceNo = null;
					parentCode = null;
				}
			} else if (cfg.amountType == 'AmtTypeDiscount') {
				if (cfg.mandatory) {
					$('#' + cfg.code).on('change',
							function(field, newValue, oldValue) {
								doHandleAmountSummation();
							});
				} else if (!cfg.mandatory) {
					$('#' + cfg.code).on('change',
							function(field, newValue, oldValue) {
								var code = $('#' + this.id)
										.data('nextEnrichment');
								if (null != this.value && this.value != ''
										&& this.value != 'NONE') {
									$('#' + code).attr('disabled', false);
									doHandleAmountSummation();
								} else {
									$('#' + code).attr('disabled', true);
									$('#' + code).val('');
									doHandleAmountSummation();
								}
							});
					displaySequenceNo = (cfg.sequenceNmbr + 1);
					parentCode = cfg.code;

				}
			} else if (!isEmpty(strDependencyType)) {
				$('#' + cfg.code).on('change',
						function(field, newValue, oldValue) {
							var code = $('#' + this.id).data('nextEnrichment');
							if (null != this.value && this.value != ''
									&& this.value != 'ADHOC') {
								$('#' + code).attr('disabled', false);
								//doHandleAmountSummation();
							} else {
								$('#' + code).attr('disabled', true);
								$('#' + code).val('ADHOC');
								//doHandleAmountSummation();
							}
						});
			}
			
			if (null != displaySequenceNo
					&& cfg.sequenceNmbr == displaySequenceNo) {
				$('#' + parentCode).data('nextEnrichment', cfg.code);
				if ('' == cfg.value || null == cfg.value || 'NONE' == cfg.value) {
					$('#' + cfg.code).attr('disabled', true);
				} else {
					$('#' + cfg.code).attr('disabled', false);
				}
				displaySequenceNo = null;
				parentCode = null;
				parentValue = null;
			}
		});
	}
}

function createAdditionalInfoField(cfg) {
	var displayType = cfg.dataType;
	var field = null;
	if (isEmpty(displayType))
		displayType = 'text';
	switch (displayType) {
		case 'amount' : // AMOUNTBOX
			field = createAmountBox(cfg.fieldName, cfg.fieldName, null, false,
					cfg.maxLength);
			field.addClass('w14_8 ml12');
			break;
		case 'select' : // COMBOBOX
			field = createComboBox(cfg.fieldName, cfg.fieldName, null, false,
					cfg.availableValues, cfg.mandatory);
			field.addClass('w15_7 ml12');
			break;
		case 'radio' : // RADIO
			break;
		case 'date' : // DATEBOX
			var dateFormat = strApplicationDateFormat
					? strApplicationDateFormat
					: 'mm/dd/yyyy';
			field = createDateBox(cfg.fieldName, cfg.fieldName, null, true,
					cfg.maxLength, dateFormat);
			field.addClass('w14_8 ml12');
			break;
		case 'seek' : // SEEKBOX
			field = createSeekBox(cfg.code, cfg.code, null, cfg.maxLength,
					'services/' + seekId + '.json?&$top=-1', '', 'code',
					'description');
			field.addClass('w14 ml12');
			break;
		case 'text' : // TEXTBOX
		default :
			field = createTextBox(cfg.fieldName, cfg.fieldName, null, false,
					cfg.maxLength);
			field.addClass('w14_8 ml12');
			break;
	}
	return field;
}
function isDebitCcyAmountValid() {
	if (strLayoutType
			&& (strLayoutType === 'ACCTRFLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT'
					|| strLayoutType === 'WIRELAYOUT' || strLayoutType === 'WIRESIMPLELAYOUT' || strLayoutType === 'CHECKSLAYOUT' || strLayoutType === 'MIXEDLAYOUT')) {
		var strAmntCcyType = $('input[name=debitPaymentAmntFlag]:checked')
				.val();
		var data = paymentResponseInstrumentData;
		if ((strAmntCcyType && strAmntCcyType === 'D') && data && data.d
				&& data.d.paymentEntry && data.d.paymentEntry.paymentHeaderInfo
				&& data.d.paymentEntry.paymentHeaderInfo.crossCcy
				&& data.d.paymentEntry.paymentHeaderInfo.crossCcy === 'Y') {
			return true;
		} else
			return false;
	} else
		return false;
}
function paintDebitCcyAmount(cfgAmount, cfgDebitCcyAmount,
		chrDebitPaymentAmntFlag, strPostFix) {
	var strFieldName = 'amount', strFormattedValue = '';
	if (chrDebitPaymentAmntFlag == 'D') {
		strFormattedValue = cfgDebitCcyAmount.formattedValue
				? cfgDebitCcyAmount.formattedValue
				: cfgDebitCcyAmount.value;
	} else {
		strFormattedValue = cfgAmount.formattedValue
				? cfgAmount.formattedValue
				: cfgAmount.value;
	}
	$('.' + strFieldName + strPostFix).text(setDigitAmtGroupFormat(strFormattedValue));
}
function generatePaymentInstrumentJson() {
	var jsonPost = {}, jsonArrStdFields = [], jsonArrBeneFields = [], data = cloneObject(paymentResponseInstrumentData), field = null, canAdd = false, objVal = null, isLinkageAdded = false,blnAutoNumeric = true;
	var arrFields = [], clsHide = 'hidden',strFieldName = null;
	var isCcyMismatch = isCurrencyMissMatch(), blnForexAtInstLevel = isForexAtInstrumentLevel();
	var arrRegisteredReceiverFields = [], arrAdhocReceiverFields = [], jsonArrRegisteredReceiverFields = [], jsonArrAdhocReceiverFields = [];
	var beneType = strReceiverType && strReceiverType === 'A' ? 'A' : 'R';
	var jsonArrBillerAggStdFields =[];
	if (data) {
		jsonPost.d = {};
		jsonPost.d.paymentEntry = {};
		if(strLayoutType=='ACHIATLAYOUT'){
		jsonPost.d.paymentEntry.addenda=data.d.paymentEntry.addenda;
			}
		jsonPost.d.__metadata = {
			_myproduct : data.d.__metadata._myproduct
		};
		
		if(charPaymentType == 'B'){
			jsonPost.d.__metadata._headerId = data.d.__metadata._headerId;
		}
		if (data && data.d && data.d.paymentEntry) {
			jsonPost.d.paymentEntry.paymentCompanyInfo = data.d.paymentEntry.paymentCompanyInfo
					|| {};
			jsonPost.d.paymentEntry.paymentHeaderInfo = data.d.paymentEntry.paymentHeaderInfo
					|| {};
			jsonPost.d.paymentEntry.paymentMetaData	= data.d.paymentEntry.paymentMetaData 
					||{};
					
			if (data.d.paymentEntry.standardField)
				arrFields = cloneObject(data.d.paymentEntry.standardField);
			// ============= Standard Field Node population =============
			$.each(arrFields, function(index, cfg) {
				canAdd = true;
				if(strLayoutType === 'TAXLAYOUT' && (cfg.fieldName === "discretionaryData" || cfg.fieldName === "discretionaryDataHdr"))
					strFieldName = cfg.fieldName + 'Hdr';
				else
					strFieldName = cfg.fieldName;
				if (cfg.dataType === 'radio') {
					// if (cfg.fieldName === 'drCrFlag')
					// field = $('input[name=' + cfg.fieldName + ']:checkbox');
					// else
					field = $('input[name=' + strFieldName + ']:radio');
				} else
					field = $('#' + strFieldName);

				if (field && field.length != 0) {
					if ((strFieldName === 'rateType') || (strFieldName === "contractRefNo" && ($('#rateType').val() == '1'|| $('#rateType').val() == '4'))) {
						canAdd = (isCcyMismatch && blnForexAtInstLevel)
								? true
								: false;
					}
					else if ((strFieldName === 'fxRate' || ($('#rateType')
							.val() == '3'))) {
						canAdd = (isCcyMismatch && blnForexAtInstLevel)
								? true
								: false;
					} else if (strFieldName === 'amount') {
						canAdd = true;
						//NOTE : txnCurrency node to be used from standarField instead of amount.txnCurrency node
						/*jsonArrStdFields.push({
									fieldName : 'txnCurrency',
									value : $('#txnCurrency').val()
								});*/

					} else if (cfg.displayMode === '1')
						canAdd = false;

					if (canAdd) {
						objVal = null;
						if (cfg.dataType === 'radio') {
							if (strFieldName === 'drCrFlag') {
								var isCrChecked = $('#drCrFlagC')
										.is(':checked');
								var isDrChecked = $('#drCrFlagD')
										.is(':checked');
								if (isCrChecked && isDrChecked)
									objVal = 'B';
								else if (isCrChecked)
									objVal = 'C';
								else if (isDrChecked)
									objVal = 'D';
							} else
								objVal = $('input[name=' + strFieldName
										+ ']:radio:checked').val();
						} else if (cfg.dataType === 'checkBox') {
							objVal = 'N';
							var c = $('input[name=' + strFieldName + ']')
									.is(':checked');
							if (c) {
								objVal = field.val();
							}
						} else {
							if(cfg.fieldName === "discretionaryData" || cfg.fieldName === "discretionaryDataHdr")
								objVal = cfg.value;
							else
							objVal = field.val();

							var	freq = $("#siFrequencyCode").val();
							if (strFieldName === 'refDay' && freq === 'SPECIFICDAY') {
								objVal = $("#refDay").getMultiSelectValue().join(',');
							}
						}
						/**
						 * The bbelow code block will be used for single payment
						 * template entry. Comment to be removed.
						 */
						if (strFieldName === 'lockFieldsMask') {
							var arrObj = generateSortAvalValArray(cfg.availableValues);
							$('#lockFieldsMask option').attr('disabled', false);
							var strTempType = $('input[name="templateType"]:radio:checked')
										.val();
							objVal = generateControFiledMask(arrObj, field
											.val(), strTempType);
							doDisableDefaultLockFields('Q', strTempType);
						}
						if (strEntryType === 'TEMPLATE') {
							if (strFieldName === 'accountNo') {
								var strTempType = $('input[name="templateType"]:radio:checked')
										.val();
								if (strTempType === '1') {
									jsonField = cloneObject(cfg);
									jsonField.values = $('#accountNo').val();
									jsonField.value = "";
									jsonField.dataType = 'multiselect';
									jsonArrStdFields.push(jsonField);
								} else {
									jsonField = cloneObject(cfg);
									jsonField.value = $('#accountNo').val();
									jsonField.values = [];
									jsonField.dataType = 'select';
									jsonArrStdFields.push(jsonField);
								}

							} else if ((strFieldName === 'templateRoles'
									|| strFieldName === 'templateUsers') && charPaymentType === 'Q') {
								jsonField = cloneObject(cfg);
								jsonField.values = $('#' + strFieldName).val()
										|| [];
								jsonArrStdFields.push(jsonField);
							} else if (strFieldName === 'amount'
									&& !isDebitCcyAmountValid()) {
								jsonField = cloneObject(cfg);
								// jquery autoNumeric formatting
								blnAutoNumeric = isAutoNumericApplied(strFieldName);
								if (blnAutoNumeric)
									objVal = $("#amount").autoNumeric('get');
								else
									objVal = $("#amount").val();
								// jquery autoNumeric formatting
								jsonField.value = objVal;
								jsonArrStdFields.push(jsonField);
							}
							else if (strFieldName === 'debitCcyAmount') {
								jsonField = cloneObject(cfg);
								// jquery autoNumeric formatting
								blnAutoNumeric = isAutoNumericApplied(cfg.fieldName);
									if (blnAutoNumeric)
										objVal = $("#debitCcyAmount").autoNumeric('get');
									else
										objVal = $("#debitCcyAmount").val();
								// jquery autoNumeric formatting
								jsonField.value = objVal;
								jsonArrStdFields.push(jsonField);
							}
							else if (strFieldName === 'fxRate'
									&& !isDebitCcyAmountValid()) {
								jsonField = cloneObject(cfg);
								// jquery autoNumeric formatting
								blnAutoNumeric = isAutoNumericApplied(strFieldName);
								if (blnAutoNumeric)
									objVal = $("#fxRate").autoNumeric('get');
								else
									objVal = $("#fxRate").val();
								// jquery autoNumeric formatting
								jsonField.value = objVal;
								jsonArrStdFields.push(jsonField);
							}							/*
							 * Commented for FTGCPBDB-4445 else if
							 * (cfg.fieldName == 'holdUntilFlag') { var
							 * isHoldChecked = $('#holdUntilFlag')
							 * .is(':checked'); if (isHoldChecked) {
							 * jsonArrStdFields.push({ fieldName :
							 * cfg.fieldName, value : 'Y' }); } }
							 */
							else {
								jsonField = cloneObject(cfg);
								jsonField.value = objVal;
								jsonArrStdFields.push(jsonField);
							}
						} else if (strFieldName === 'amount'
								&& !isDebitCcyAmountValid()) {
							jsonField = cloneObject(cfg);
							// jquery autoNumeric formatting
							blnAutoNumeric = isAutoNumericApplied(strFieldName);
								if (blnAutoNumeric)
									objVal = $("#amount").autoNumeric('get');
								else
									objVal = $("#amount").val();
							// jquery autoNumeric formatting
							jsonField.value = objVal;
							jsonArrStdFields.push(jsonField);
						} 
						else if (strFieldName === 'debitCcyAmount') {
                            jsonField = cloneObject(cfg);
                            // jquery autoNumeric formatting
                            blnAutoNumeric = isAutoNumericApplied(strFieldName);
                                if (blnAutoNumeric)
                                    objVal = $("#debitCcyAmount").autoNumeric('get');
                                else
                                    objVal = $("#debitCcyAmount").val();
                            // jquery autoNumeric formatting
                            jsonField.value = objVal;
                            jsonArrStdFields.push(jsonField);
					    }
						else if (strFieldName === 'fxRate'
								&& !isDebitCcyAmountValid()) {
							jsonField = cloneObject(cfg);
							// jquery autoNumeric formatting
							blnAutoNumeric = isAutoNumericApplied(strFieldName);
								if (blnAutoNumeric)
									objVal = $("#fxRate").autoNumeric('get');
								else
									objVal = $("#fxRate").val();
							// jquery autoNumeric formatting
							jsonField.value = objVal;
							jsonArrStdFields.push(jsonField);
						} else if(strFieldName === 'activationTime') {
							jsonField = cloneObject(cfg);
							var effTimeHr, effTimeMin = null;
							if(strPaymentType === 'QUICKPAY'|| strPaymentType === 'QUICKPAYSTI') {
								effTimeHr = 'effectiveTimeHr';
								effTimeMin = 'effectiveTimeMin';
							} else if(strPaymentType === 'BATCHPAY' || strPaymentType === 'BATCHPAYSTI' ) {
								if($('#activationTimeHdr').hasClass('hidden')){
									effTimeHr = 'effectiveTimeHr';
									effTimeMin = 'effectiveTimeMin';
								}else{
									effTimeHr = 'effectiveTimeHrHdr';
									effTimeMin = 'effectiveTimeMinHdr';
								}
							}
							var hours = $('#'+effTimeHr).val();
							var minutes = $('#'+effTimeMin).val();
							objVal = hours + ":" + minutes;
							jsonField.value = objVal;
							jsonArrStdFields.push(jsonField);
						}else if(strFieldName === 'remittanceInfo1') {
							jsonField = cloneObject(cfg);
							objVal = $("#remittanceInfo1").val();
							jsonField.value = objVal;
							jsonArrStdFields.push(jsonField);
						}else {
							jsonField = cloneObject(cfg);
							jsonField.value = objVal;
							jsonArrStdFields.push(jsonField);
						}
					}
				}

					/*
				 * if (strEntryType === 'PAYMENT' || strEntryType === 'SI') {
				 * jsonPost.d.paymentEntry.multipartFile =
				 * document.getElementById('paymentImageFile').files[0]; }
				 */

			});
			jsonPost.d.paymentEntry.standardField = jsonArrStdFields;
			// ============= Beneficiary Node population =============
			if (data.d.paymentEntry.beneficiary) {
				jsonPost.d.paymentEntry.beneficiary = {};
				if (data.d.paymentEntry.beneficiary.registeredBene) {
					arrRegisteredReceiverFields = data.d.paymentEntry.beneficiary.registeredBene
							? data.d.paymentEntry.beneficiary.registeredBene
							: [];
					jsonArrRegisteredReceiverFields = getRegisteredReceiverFieldJsonArray(arrRegisteredReceiverFields);
					jsonPost.d.paymentEntry.beneficiary.registeredBene = jsonArrRegisteredReceiverFields;
				}

				if (data.d.paymentEntry.beneficiary.adhocBene) {
					arrAdhocReceiverFields = data.d.paymentEntry.beneficiary.adhocBene
							? data.d.paymentEntry.beneficiary.adhocBene
							: [];
					jsonArrAdhocReceiverFields = getAdhocReceiverFieldJsonArray(arrAdhocReceiverFields);
					jsonPost.d.paymentEntry.beneficiary.adhocBene = jsonArrAdhocReceiverFields;
				}

				if (beneType === 'R') {
					jsonPost.d.paymentEntry.beneficiary.drawerRegistedFlag = 'R';
				} else {
					jsonPost.d.paymentEntry.beneficiary.drawerRegistedFlag = 'A';
				}
				
				if(strLayoutType === "BILLPAYLAYOUT" && jsonPost.d.paymentEntry.paymentHeaderInfo 
						&& jsonPost.d.paymentEntry.paymentHeaderInfo.isBiller 
						&& jsonPost.d.paymentEntry.paymentHeaderInfo.isBiller === "A")
				{
					jsonPost.d.paymentEntry.beneficiary.drawerRegistedFlag = null;
				}
			}
			// ============= Additional Info Node population =============
			if (data.d.paymentEntry.additionalInfo) {
				arrFields = [];
				jsonPost.d.paymentEntry.additionalInfo = {};
				$.each(data.d.paymentEntry.additionalInfo,
						function(key, value) {
							if (key === 'additionalReferenceInfo'
									|| key === 'bankToBankInfo') {
								if (data.d.paymentEntry.additionalInfo[key]) {
									arrFields = data.d.paymentEntry.additionalInfo[key];
									jsonPost.d.paymentEntry.additionalInfo[key] = getFieldJsonArray(arrFields);
								}
							}
							if (key === 'orderingParty') {
								arrFields = [];
								var orderingPartyType = !isEmpty(strOrderingPartyType) ? strOrderingPartyType : 'R';
								jsonPost.d.paymentEntry.additionalInfo.orderingParty = {};
								if (data.d.paymentEntry.additionalInfo.orderingParty.registeredOrderingParty) {
									arrFields = data.d.paymentEntry.additionalInfo.orderingParty.registeredOrderingParty;
									jsonPost.d.paymentEntry.additionalInfo.orderingParty.registeredOrderingParty = getFieldJsonArray(arrFields);
								}
								if (data.d.paymentEntry.additionalInfo.orderingParty.adhocOrderingParty) {
									arrFields = data.d.paymentEntry.additionalInfo.orderingParty.adhocOrderingParty
											? data.d.paymentEntry.additionalInfo.orderingParty.adhocOrderingParty
											: [];
									jsonPost.d.paymentEntry.additionalInfo.orderingParty.adhocOrderingParty = getAdhocOrderingPartyFieldJsonArray(arrFields);
								}
								jsonPost.d.paymentEntry.additionalInfo.orderingParty.orderingPartyRegisteredFlag = orderingPartyType;
							}
						});
			}

			// ============= Enrichment Info Node population =============
			if (data.d.paymentEntry.enrichments) {
				jsonPost.d.paymentEntry.enrichments = {};
				$.each(data.d.paymentEntry.enrichments, function(key, value) {
					if ((key === 'udeEnrichment' || key === 'productEnrichment'
							|| key === 'myproductEnrichment'
							|| key === 'clientEnrichment'
							|| key === 'productEnrichmentStdFields'
							|| key === 'myproductEnrichmentStdFields'
							|| key === 'clientEnrichmentStdFields' || key === 'udeEnrichmentStdFields'
							|| key === 'paymentCustomization')
							&& value.parameters) {
						arrFields = cloneObject(value.parameters);
						jsonPost.d.paymentEntry.enrichments[key] = {
							parameters : getEnrichFieldJsonArray(arrFields,key),
							apiDependent : value.apiDependent,
							profileId : value.profileId
						};
					}
					if (key === 'myProductMultiSet')
						jsonPost.d.paymentEntry.enrichments[key] = getMyProductMultiSetEnrichmentJsonArray();
					if (key === 'myProductMultiSetMetadata')
						jsonPost.d.paymentEntry.enrichments[key] = getMyProductMultiSetEnrichmentJsonArrayMetaData();
					if (key === 'bankProductMultiSet')
						jsonPost.d.paymentEntry.enrichments[key] = getBankProductMultiSetEnrichmentJsonArray();
					if (key === 'bankProductMultiSetMetadata')
						jsonPost.d.paymentEntry.enrichments[key] = getBankProductMultiSetEnrichmentJsonArrayForMetaData();
					if (key === 'clientMultiSet')
						jsonPost.d.paymentEntry.enrichments[key] = getClientProductMultiSetEnrichmentJsonArray();
					if (key === 'clientMultiSetMetadata')
						jsonPost.d.paymentEntry.enrichments[key] = getClientProductMultiSetEnrichmentJsonArrayForMetaData();
				});

			}
			
			//======================== AVM definationjson population ================
			if(strEntryType === 'TEMPLATE'){
				if(data.d.paymentEntry.templateApprovalMatrix){
					if($("#defineApprovalMatrix").prop('checked') == true)
						jsonPost.d.paymentEntry.templateApprovalMatrix = generateJsonForApprovalMatrix();
					else
						jsonPost.d.paymentEntry.templateApprovalMatrix = [];
				}
			}
			//======================== Dinomination info json population ================
			if(data.d.paymentEntry.cashwithdrawalDetails && data.d.paymentEntry.cashwithdrawalDetails.denomination){
				jsonPost.d.paymentEntry.cashwithdrawalDetails = {};
				jsonPost.d.paymentEntry.cashwithdrawalDetails.denomination = generateJsonForDenominationData(data.d.paymentEntry.cashwithdrawalDetails.denomination);
			}
			// ======================== WHT json population ================
			if(data.d.paymentEntry.whtFields){
				jsonPost.d.paymentEntry.whtFields = {};
				if(data.d.paymentEntry.whtFields.whtHeader){
					jsonPost.d.paymentEntry.whtFields.whtHeader=generateJsonForWHTHeader(data.d.paymentEntry.whtFields.whtHeader);
				}
				if(data.d.paymentEntry.whtFields.whtDetails){
					jsonPost.d.paymentEntry.whtFields.whtDetails=getWHTDetailsJsonArray();
				}
			}
			if(data && data.d && data.d.paymentEntry && data.d.paymentEntry.billerDetails)
				jsonPost.d.paymentEntry.billerDetails={};
			// =========================== Biller Aggregator info json population ===============
			if (data && data.d && data.d.paymentEntry && data.d.paymentEntry.billerDetails && data.d.paymentEntry.billerDetails.billerStdFields){
				arrFields = cloneObject(data.d.paymentEntry.billerDetails.billerStdFields);
				$.each(arrFields, function(index, cfg) {
					var field = $('#' + cfg.fieldName);
					var objVal = field.val();
					jsonField = cloneObject(cfg);
					jsonField.value = objVal;
					jsonArrBillerAggStdFields.push(jsonField);
				});
				
				jsonPost.d.paymentEntry.billerDetails.billerStdFields = jsonArrBillerAggStdFields;
			}
			// ========================== Biller Aggregator select product json population ==========
			if(data && data.d && data.d.paymentEntry && data.d.paymentEntry.billerDetails && data.d.paymentEntry.billerDetails.billerProductFields){
			jsonPost.d.paymentEntry.billerDetails.billerProductFields = {};
				if (data.d.paymentEntry.billerDetails.billerProductFields){
					var objProductValue = $('#aggProd').val();
					var objCloneProd = cloneObject(data.d.paymentEntry.billerDetails.billerProductFields);
					$.each(objCloneProd,function(i, cfg){
						var objParam = cfg.parameters;
						$.each(objParam, function(j,objNode) {
							if(objNode.description === objProductValue)
							cfg.isSelected = 'Y';	
						});
					});
					jsonPost.d.paymentEntry.billerDetails.billerProductFields = objCloneProd;
				}
			}
			// ========================== Biller Aggregator Request fields json population ==========
			if(data && data.d && data.d.paymentEntry && data.d.paymentEntry.billerDetails && data.d.paymentEntry.billerDetails.billerReqEnrFields){
			jsonPost.d.paymentEntry.billerDetails.billerReqEnrFields = {};
				if (data.d.paymentEntry.billerDetails.billerReqEnrFields.parameters){
					var value = data.d.paymentEntry.billerDetails.billerReqEnrFields;
					var arrFields = cloneObject(value.parameters);
					jsonPost.d.paymentEntry.billerDetails.billerReqEnrFields = {
						parameters : getEnrichFieldJsonArray(arrFields),
						apiDependent : value.apiDependent,
						profileId : value.profileId
					};
				}
			}
			// ========================== Biller Aggregator Single Responces fields json population ==========
			if(data && data.d && data.d.paymentEntry && data.d.paymentEntry.billerDetails && data.d.paymentEntry.billerDetails.billerResDetails){
			jsonPost.d.paymentEntry.billerDetails.billerResDetails = {};
				if (data.d.paymentEntry.billerDetails.billerResDetails.parameters){
					var value = data.d.paymentEntry.billerDetails.billerResDetails;
					var arrFields = cloneObject(value.parameters);
					jsonPost.d.paymentEntry.billerDetails.billerResDetails = {
						parameters : getEnrichFieldJsonArray(arrFields),
						apiDependent : value.apiDependent,
						profileId : value.profileId
					};
				}
			}
			// ========================== Biller Aggregator multi Responces fields json population ==========
			if(data && data.d && data.d.paymentEntry && data.d.paymentEntry.billerDetails && data.d.paymentEntry.billerDetails.billerResEnrDetails){
				jsonPost.d.paymentEntry.billerDetails.billerResEnrDetails = {};
					if (data.d.paymentEntry.billerDetails.billerResEnrDetails.parameters){
						var value = data.d.paymentEntry.billerDetails.billerResEnrDetails;
						var arrFields = cloneObject(value.parameters);
						jsonPost.d.paymentEntry.billerDetails.billerResEnrDetails = {
							parameters : getEnrichFieldJsonArray(arrFields),
							apiDependent : value.apiDependent,
							profileId : value.profileId
						};
					}
				}
			
			if(data && data.d && data.d.paymentEntry && data.d.paymentEntry.billerDetails 
					&& data.d.paymentEntry.billerDetails.sessionId){
				jsonPost.d.paymentEntry.billerDetails.sessionId = data.d.paymentEntry.billerDetails.sessionId;
			}
			if(data && data.d && data.d.paymentEntry && data.d.paymentEntry.billerDetails 
					&& data.d.paymentEntry.billerDetails.refNo){
				jsonPost.d.paymentEntry.billerDetails.refNo = data.d.paymentEntry.billerDetails.refNo;
			}
			if(data && data.d && data.d.paymentEntry && data.d.paymentEntry.billerDetails){
				jsonPost.d.paymentEntry.billerDetails.fetchBillEnable = data.d.paymentEntry.billerDetails.fetchBillEnable;
			}
		}
	}
	return jsonPost;
}
function getFieldJsonArray(arrFields) {
	var field = null, canAdd = false, fieldName = null;
	var arrRet = new Array();
	if (arrFields && arrFields.length > 0) {
		var arrItems = cloneObject(arrFields);
		$.each(arrItems, function(index, cfg) {
					canAdd = true;
					fieldName = cfg.fieldName || cfg.code;
					field = $('#' + fieldName);
					if (field && field.length != 0) {
						if (cfg.displayMode === '1')
							canAdd = false;

						if (canAdd && !isEmpty(cfg.code)) {
							cfg.value = field.val()
							arrRet.push(cfg);
						} else if (canAdd) {
							cfg.value = field.val()
							arrRet.push(cfg);
						}
					}
				});
	}
	return arrRet;

}
function getRegisteredReceiverFieldJsonArray(arrFields) {
	var field = null, canAdd = false, fieldName = null;
	var arrRet = new Array();
	if (arrFields && arrFields.length > 0) {
		var arrItems = cloneObject(arrFields);
		$.each(arrItems, function(index, cfg) {
					canAdd = true;
					fieldName = cfg.fieldName || cfg.code;
					field = $('#' + fieldName + 'R');
					if (field && field.length != 0) {
						if (cfg.displayMode === '1')
							canAdd = false;
						if (canAdd) {
							if(fieldName != "anyIdType" || isEmpty(cfg.value))
							{
								cfg.value = field.val();
							}
							arrRet.push(cfg);
						}
					}
				});
	}
	return arrRet;
}

function getAdhocReceiverFieldJsonArray(arrFields) {
	var field = null, canAdd = false, fieldName = null;
	var arrRet = new Array();
	if (arrFields && arrFields.length > 0) {
		var arrItems = cloneObject(arrFields);
		$.each(arrItems, function(index, cfg) {
					canAdd = true;
					fieldName = cfg.fieldName || cfg.code;
					if(fieldName == 'ibanValidationFlag')
					{
						cfg.fieldName = 'ibanValidationFlag';
						cfg.value = $('input[name="ibanValidationFlagA"]:radio:checked').val();
						arrRet.push(cfg);
						return true;
					}
					else
					field = $('#' + fieldName + 'A');
					if (field && field.length != 0) {
						if (cfg.displayMode === '1')
							canAdd = false;

						if (canAdd && !isEmpty(cfg.code)) {
							cfg.value = field.val();
							arrRet.push(cfg);
						} /*else if(canAdd && fieldName ==='draweePayDetail'){
						 	cfg.value =getTagFieldLine1Value(cfg,'draweePayDetailTag57TypeD','draweePayDetailA','tag57Type');
						 	arrRet.push(cfg);
						}  else if(canAdd && fieldName ==='corrBankDetails1'){
						 	cfg.value =getTagFieldLine1Value(cfg,'corrBankDetails1ATtag54TypeD','corrBankDetails1A','tag54Type');
						 	arrRet.push(cfg);
						}  else if(canAdd && fieldName ==='intBankDetails1'){
						 	cfg.value =getTagFieldLine1Value(cfg,'intBankDetails1ATag56TypeD','intBankDetails1A','tag56Type');
						 	arrRet.push(cfg);
						}  */else if (canAdd) {
							cfg.value = field.val();
							arrRet.push(cfg);
						}
					}
				});
	}
	return arrRet;

}
function getTagFieldLine1Value(cfg,textFieldId,selectFieldId,tagType){
	var strRetValue = '',strTag57Val = $('input[name="'+tagType+'A"]:radio:checked').val();
	
	strTag57Val = strTag57Val ? strTag57Val : 'A';
	if(strTag57Val=='A')
		strRetValue = $('#'+selectFieldId).val();
	else if(strTag57Val=='D')
		strRetValue = $('#'+textFieldId).val();
	return 	strRetValue;
}
function getAdhocOrderingPartyFieldJsonArray(arrFields) {
	var field = null, canAdd = false, fieldName = null;
	var arrRet = new Array();
	if (arrFields && arrFields.length > 0) {
		var arrItems = cloneObject(arrFields);
		$.each(arrItems, function(index, cfg) {
					canAdd = true;
					fieldName = cfg.fieldName || cfg.code;
					field = $('#' + fieldName + '_OA');
					if (field && field.length != 0) {
						if (cfg.displayMode === '1')
							canAdd = false;

						if (canAdd && !isEmpty(cfg.code)) {
							cfg.value = field.val()
							arrRet.push(cfg);
						} else if (canAdd) {
							cfg.value = field.val()
							arrRet.push(cfg);
						}
					}
				});
	}
	return arrRet;

}
function getEnrichFieldJsonArray(arrFields,key) {
	var field = null, canAdd = false, fieldName = null;
	var arrRet = [];
	if (arrFields && arrFields.length > 0)
		$.each(arrFields, function(index, cfg) {
					canAdd = true;
					fieldName = cfg.fieldName || cfg.code;
					field = $('#' + fieldName);
					if(key && key === 'paymentCustomization')
						field = $('#' + cfg.customField);
					if (cfg.displayType === 11)
						field = $('input[name=' + cfg.code + ']:radio');
					if (cfg.displayType === 10)
					{
						field = $('input[id=' + cfg.code + ']:checkbox');
					}

					if(field && field.length != 0) {
						if (cfg.displayMode === '1')
							canAdd = false;
							
						if (cfg.displayType === 11) {
							cfg.value = $('input[name=' + cfg.code
									+ ']:radio:checked').val();
							cfg.string = cfg.value;
							arrRet.push(cfg);
						} else if (cfg.displayType === 10) {
							cfg.value = 'N';
							cfg.string = cfg.value;
							var c = $('input[id=' + cfg.code + ']')
									.is(':checked');
							if (c) {
								cfg.value = 'Y';
								cfg.string = cfg.value;
							}
							arrRet.push(cfg);
						} else if (cfg.displayType === 4 && cfg.allowAdhocValue) {
							cfg.value = isEmpty($(field).val()) ? $(field).attr('editableValue') : $(field).val();
							cfg.string = cfg.value;
							arrRet.push(cfg);
						}else if(isAutoNumericApplied (fieldName)){
							cfg.value = field.autoNumeric( 'get' );
							cfg.string = field.autoNumeric( 'get' );
							arrRet.push(cfg);
						}else if (canAdd) {
							cfg.value = field.val();
							cfg.string = field.val();
							arrRet.push(cfg);
						}
					}
				});
	return arrRet;
}

function generateJsonForDenominationData(arrFields) {
	var field = null, canAdd = false, fieldName = null;
	if (arrFields && arrFields.length > 0) {
		var arrItems = cloneObject(arrFields);
		$.each(arrItems, function(index, cfgItem) {
			var arrParams = cfgItem.parameters;
			var denomCode = 0;
			$.each(arrParams, function(indx, cfg) {
					canAdd = true;
					fieldName = cfg.code;
					if(fieldName== 'denomination' && !isEmpty(cfg.parentEnrichCode)){
						denomCode = cfg.parentEnrichCode;
					}
					denomCode = !isEmpty(denomCode) ? denomCode.toString().replace('.', '_') : '';
					
					field = $('#' + fieldName + '_'+denomCode);
					if (field && field.length != 0) {
						if (canAdd) {
							if(fieldName== 'amount'){
								cfg.string = field.val();
								cfg.value = field.autoNumeric( 'get' );
							} else if(fieldName== 'pieces'){
								cfg.string = !isEmpty(field.val()) ? field.val() : '0';
								cfg.value = !isEmpty(field.val()) ? field.val() : '0';
							} else{
								cfg.string = field.val();
								cfg.value = field.val();
							}
						}
					}
				});	
		});
	}
	return arrItems;
}
function generateJsonForWHTHeader(arrHeaderFields){
	var field = null, canAdd = false, fieldName = null;
	var arrFields = cloneObject(arrHeaderFields);
	var arrRet = new Array();
	if (arrFields && arrFields.length > 0) {
		var arrItems = cloneObject(arrFields);
		$.each(arrItems, function(index, cfg) {
					canAdd = true;
					fieldName = cfg.fieldName || cfg.code;
					field = $('#' + fieldName);
					if (field && field.length != 0) {
						if (cfg.displayMode === '1')
							canAdd = false;
						if (canAdd) {
							cfg.value = field.val()
							if(isAutoNumericApplied (fieldName)){
								cfg.value = field.autoNumeric( 'get' );
								//cfg.string = field.autoNumeric( 'get' );
							}
							if(fieldName === 'whtCertificatePrinting'){
								if($('#'+fieldName).is(':checked'))
									cfg.value = 'Y';
								else 
									cfg.value = 'N';
							}
							arrRet.push(cfg);
						}
					}
				});
	}
	return arrRet;
}

/*---------- Helper Function Starts --------------------*/
// FTGCPBDB-4321 : To be removed Contract Rate on Template
function handleContractRateInTemplate(data, strPmtType) {
	var arrFields = [];
	if (data) {
		arrFields = data;
		if (arrFields && arrFields.length > 0) {
			$.each(arrFields, function(index, cfg) {
						if (cfg.fieldName === 'rateType') {
							var arrAvailableValues = cfg.availableValues;
							var indexContractRate = null;
							if (arrAvailableValues
									&& arrAvailableValues.length > 0) {
								$.each(arrAvailableValues,
										function(index, item) {
											if ('1' === item.code)
												indexContractRate = item.code;
										});
								arrAvailableValues.splice($.inArray(
												indexContractRate,
												arrAvailableValues), 1);
							}
							if (strPmtType === 'Q') {
								$('#rateType1').parent().remove();
							}
						}
					});
		}
	}
}
function toggleAmountLabel(strAmountType) {
	var clsHide = 'hidden';
	if (strAmountType === 'P') {
		$('#thresholdAmountLabel').removeClass(clsHide);
		$('#amountLabel').addClass(clsHide);
	} else {
		$('#thresholdAmountLabel').addClass(clsHide);
		$('#amountLabel').removeClass(clsHide);
	}
}

function toggleAccountLabel(cntrl, crDrFlag, isViewOnly) {
	var clsHide = 'hidden';
	var isCrChecked = $('#drCrFlagC').is(':checked');
	var isDrChecked = $('#drCrFlagD').is(':checked');
	if (crDrFlag === 'B' || (isCrChecked && isDrChecked) && !isViewOnly) {
		$('#accountNo_credit').addClass(clsHide);
		$('#accountNo_debit').removeClass(clsHide);

		$('#receivingaccountNo_credit').addClass(clsHide);
		$('#receivingaccountNo_debit').removeClass(clsHide);

	} else if (crDrFlag === 'C' && !isDrChecked && !isViewOnly) {
		$(".accountcreditLbl,.accountcreditHdrLbl").removeClass(clsHide);//rvcng accnt
		$(".accountdebitLbl,.accountdebitHdrLbl").addClass(clsHide);

	} else if (crDrFlag === 'D' && !isCrChecked && !isViewOnly) {
		$(".accountcreditLbl,.accountcreditHdrLbl").addClass(clsHide);//rvcng accnt
		$(".accountdebitLbl,.accountdebitHdrLbl").removeClass(clsHide);
	} else if (isViewOnly) {
		if (crDrFlag === 'C') {
			$(".accountcreditLbl").removeClass(clsHide);//rvcng accnt
			$(".accountdebitLbl").addClass(clsHide);
		} else if (crDrFlag === 'D') {
			$(".accountcreditLbl,.accountcreditHdrLbl").addClass(clsHide);//rvcng accnt
			$(".accountdebitLbl,.accountdebitHdrLbl").removeClass(clsHide);
		}
	}
}
//NOTBEINGUSED
function toggleAdvancedSettingVerifyScreen() {
	$("#advancedSettingVerifyScreePopup").toggleClass('hidden');
}
function handleTemplateTypeChangeQ(strTemplateType) {
	var blnUseInMobile=false;
	blnUseInMobile = isUseInMobileApplicable(paymentResponseInstrumentData);
	handleTemplateTypeChange(strTemplateType, 'Q',blnUseInMobile);
	applyControlFieldsValidation();
}
function applyControlFieldsValidation(strPayType,blnIsPrenoteChecked) {
	var data = paymentResponseInstrumentData, arrJSON = null, field = null, label = null;
	var mapCtrlFields = {}, key = '', isSelected = false;
	var strPostFix = strPaymentType && "BATCHPAY" === strPaymentType ? 'Hdr' : '';
	var arrSelected = $('#lockFieldsMask' + strPostFix).multiselect("getChecked") || [];
	var arrValues = [];
	$.each(arrSelected, function(index, item) {
				arrValues.push(item.value);
			});
	if ($('#lockFieldsMask'+strPostFix).has('option').length > 0) {
		$('#lockFieldsMask'+ strPostFix + ' option').each(function() {
					key = $(this).attr('value');
					isSelected = jQuery.inArray(key, arrValues) != -1
							? true
							: false;
					if (!isEmpty(key)) {
						mapCtrlFields[key] = {};
						mapCtrlFields[key]['isSelected'] = isSelected;
						
						if(key==="drawerCode" && blnIsPrenoteChecked===true)
							pushReceiverFieldsIntoArray(mapCtrlFields,data,true,true);
						else if(key==="drawerCode" && blnIsPrenoteChecked===false)
							pushReceiverFieldsIntoArray(mapCtrlFields,data,isSelected || false,false);
						else if(key==="drawerCode")
							pushReceiverFieldsIntoArray(mapCtrlFields,data,isSelected || isPrenoteChecked(),true);
					}
				});
	}
	if (data && data.d && data.d.paymentEntry) {
		arrJSON = data.d.paymentEntry.standardField;
		if (arrJSON && arrJSON.length > 0) {
			$.each(arrJSON, function(index, cfg) {
				if (mapCtrlFields[cfg.fieldName] && cfg.fieldName!=="drawerAccountNo") {
					mapCtrlFields[cfg.fieldName]['isRequiredDefault'] = (cfg.displayMode === '3' || false);
				}
			});
		}
	}
	$.each(mapCtrlFields, function(key, value) {
		key =  getMapCtrlKeyName(key);
		field =$('#' + key);
		label = $('#' + key + "Lbl");
		
		if (key !== 'accountNo' )
			updateFieldDisplayMode(field, label, value);
			/*
		 * if (key === 'accountNo')
		 * updateFieldDisplayMode($('#companyIdHdr'), $('#companyIdHdrLbl'),
		 * value);
		 */
		});
	initateValidation();
}
// TODO : To be verified
function getAccountAsReceiverMoreDetails(strDrawerAccountNo) {
	var accountDetails = null;
	$.ajax({
				type : "GET",
				url : "services/userseek/clientAccountSeek.json?code1"
						+ strDrawerAccountNo,
				complete : function(XMLHttpRequest, textStatus) {
					if ("error" == textStatus) {
						arrError.push({
									"errorCode" : "Message",
									"errorMessage" : mapLbl['unknownErr']
								});
						paintErrors(arrError);
					}
				},
				async : false,
				data : null,
				success : function(data) {
					if (data && data.d && data.d.preferences) {
						accountDetails = data.d.preferences[0];
					}
				}
			});
	return accountDetails;
}

function toggleAccountTransferAccountLabel(crDrFlag) {
	var clsHide = 'hidden';
	if (crDrFlag === 'C') {
		$(".accountcreditLbl").removeClass(clsHide);
		$(".accountdebitLbl").addClass(clsHide);

	} else if (crDrFlag === 'D') {
		$(".accountcreditLbl").addClass(clsHide);
		$(".accountdebitLbl").removeClass(clsHide);
	}
}
function advanceSettingPopupOpen() {
	$("#advancedSettingPopup").toggleClass('hidden');
	if ($("#plusIcon").hasClass('fa-plus')) {
		$("#plusIcon").removeClass('fa-plus');
		$("#plusIcon").addClass('fa-minus');
	} else {
		$("#plusIcon").removeClass('fa-minus');
		$("#plusIcon").addClass('fa-plus');
	}
}
function createTemplateCheckBoxGroup(strCheckBoxIds) {
	$(strCheckBoxIds).on('click', {
				ids : strCheckBoxIds
			}, function(e) {
				var me = $(this), strId = me.attr('id');
				var intCount = 0;
				// #hold,#holdUntilFlag,#prenote
				if (!$('#holdDiv').hasClass('hidden')
						&& $('#holdDiv').length != 0)
					intCount++;
				if (!$('#holdUntilFlagDiv').hasClass('hidden')
						&& $('#holdUntilFlagDiv').length != 0)
					intCount++;
				if (!$('#prenoteDiv').hasClass('hidden')
						&& $('#prenoteDiv').length != 0)
					intCount++;
				// This condition will work even only one checkbox is there
				if (me.is(':checked') && intCount > 1)
					$('#holdUntilFlag,#prenote').not($(this)).prop({
								'checked' : false,
								'value' : 'N'
							});
				// TODO: Added the comment
				if (false) {
					if (strId === 'hold') {
						toggleHoldZeroDollerValue();
					} else if (strId === 'holdUntilFlag') {
						onChangeHoldUntil();
					} else if (strId === 'prenote') {
						togglePrenoteValue();
					}
				}
				toggleHoldZeroDollerValue();
				onChangeHoldUntil();
				togglePrenoteValue();
			});
}

function onChangeOfCurrency()
{
	blockUIWithLoading(true);
	setTimeout(function()
	{
		handleCurrencyMissmatch();
		repopulateBankProductField();
	}, 10);
	setTimeout(function()
	{
		blockUIWithLoading(false);
	}, 100);
}

function handleCurrencyMissmatch(isOnchange) {
	var regExp = /\(([^)]+)\)$/;
	var matches = null, buyerCcy = null;
	var sellerCcy = $('#txnCurrency').val();// Transaction Currency
	var clsHide = 'hidden', clsReq = 'required';
	var isCcyMissMatch = false, blnForexAtInstLevel = isForexAtInstrumentLevel();
	$('#accountNoCcy').text('');
	buyerCcy = getBuyerCcyForInstrument();
	$('#accountNoCcy').text(!isEmpty(buyerCcy) ? '('+buyerCcy+')' : '');
	toggleCurrencyLabel(sellerCcy);
	isCcyMissMatch = isCurrencyMissMatch();
	if (isCcyMissMatch
			&& (strEntryType === 'PAYMENT' || strEntryType === 'SI' || (strEntryType === 'TEMPLATE' && (strLayoutType === 'WIRELAYOUT' || strLayoutType ==='MIXEDLAYOUT')))) {
		getFXForDetail(buyerCcy, sellerCcy);
		$('#amount').blur(function() {
			var sellerCcy = $('#txnCurrency').val();// Transaction
			// Currency
			var buyerCcy = getBuyerCcyForInstrument();
			if (strEntryType === 'PAYMENT'
					|| strEntryType === 'SI'
					|| (strEntryType === 'TEMPLATE' && (strLayoutType === 'WIRELAYOUT' || strLayoutType ==='MIXEDLAYOUT')))
				getFXForDetail(buyerCcy, sellerCcy);
		});
		if(strLayoutType 
			&& (strLayoutType==='ACCTRFLAYOUT' || strLayoutType==='WIRELAYOUT'
		|| strLayoutType ==='CHECKSLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT' || strLayoutType === 'WIRESIMPLELAYOUT' || strLayoutType ==='MIXEDLAYOUT' || strLayoutType ==='WIRESWIFTLAYOUT' ))
		$('#debitCcyAmount').blur(function() {
			var sellerCcy = $('#txnCurrency').val();// Transaction
			// Currency
			var buyerCcy = getBuyerCcyForInstrument();
			if (strEntryType === 'PAYMENT'
					|| strEntryType === 'SI'
					|| (strEntryType === 'TEMPLATE' && (strLayoutType === 'WIRELAYOUT' || strLayoutType ==='MIXEDLAYOUT')))
				getFXForDetail(buyerCcy, sellerCcy);
			/*if (!isEmpty($('#debitCcyAmount').val())) {
				var txnAmount = $('#debitCcyAmount').val();
				txnAmount = parseFloat(txnAmount);
				$('#debitCcyAmount').val(txnAmount.toFixed(2));
			}*/
		});
	}
	else{
		if(strEntryType === 'PAYMENT' || strEntryType === 'SI' || (strEntryType === 'TEMPLATE' && (strLayoutType === 'WIRELAYOUT' || strLayoutType ==='MIXEDLAYOUT'))){
			$('#amount').removeClass('hidden');
			$('#debitCcyAmount').addClass('hidden');
			if (!isEmpty($('#debitCcyAmount').val())) {
				var txnAmount = $('#debitCcyAmount').val();
				txnAmount = parseFloat(txnAmount);
				$('#debitCcyAmount').val(txnAmount.toFixed(2));
			}
		}
	}
	if(isCcyMissMatch && strPrdID === '55')
	{
		$("#rateType").val('4');
		$('#rateTypeDiv, #contractRefNoDiv').removeClass(clsHide);
		$('#rateTypeLbl, #contractRefNoLbl').removeClass(clsReq);
		$('#contractRefNo').removeAttr("disabled");
		$('#contractRefNo').removeAttr('placeholder');
		$('#contractRefNo').removeClass('disabled');
		$('#contractRefNo').removeClass('disabled');
		$('#contractRefNoDiv').find("label").slice(1, 2).remove();
		$('#rateType').unbind('blur');
		$('#rateType').removeClass('requiredField');
		$('#debitPaymentAmntFlag1').attr('disabled', true);
		$('#fxSpan, .fxSpan').remove();
	}
	else if (isCcyMissMatch && blnForexAtInstLevel && isFxContractAvlbl() ) {
		$('#rateTypeDiv').removeClass(clsHide);
		$('#rateTypeLbl').addClass(clsReq);
		$('#contractRefNo').ContractRefNoAutoComplete(buyerCcy, sellerCcy);
		$('#contractRefNo').blur(function mark() {
			if (isEmpty($('#contractRefNo').val()))
			{
				$('#contractFxLabel').val('');
				$('#contractFxLabel').text('');
			}
			else
			{
				if(event.relatedTarget.id !="ui-active-menuitem")
				{
					handleAmountCcyChange();
					$('.ui-autocomplete[style*="block"]').css("display","none");
				}
			}
		});
		$('#rateType').blur(function mark() {
					markRequired($(this));
				});
		$('#rateType').focus(function() {
					removeMarkRequired($(this));
				});
	} else {
		$("#rateType").val('0');
		$('#rateTypeDiv, #contractRefNoDiv').addClass(clsHide);
		$('#rateTypeLbl, #contractRefNoLbl').removeClass(clsReq);
		$('#contractRefNo').attr('disabled', true);
		$('#contractRefNo').addClass('disabled');
		$('#rateType').unbind('blur');
		$('#rateType').removeClass('requiredField');
		$('#fxSpan, .fxSpan').remove();
	}
	toggleAmountCcyField();
	var instrumentId = paymentResponseInstrumentData.d.paymentEntry.paymentMetaData.instrumentId;
	if(instrumentId == '93' || instrumentId == '94' ){
		var debitAccountLevel = null;
		
		if(charPaymentType == 'Q'){
			debitAccountLevel = paymentResponseInstrumentData.d.paymentEntry.paymentHeaderInfo.accountLevel;
		}else if(charPaymentType == 'B'){
			debitAccountLevel = paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.accountLevel;
		}
		setIbanNoField(charPaymentType,debitAccountLevel,isOnchange);
	}
}
function setIbanNoField(charPaymentType,debitAccountLevel,isOnchange){
	var fieldId = 'ibanNo';
	var strIbanNo = null;
	var templateMultiSelect =  null;
	if(strEntryType === 'TEMPLATE' && (!isEmpty($( "#accountNo").val()) || !isEmpty($( "#accountNoHdr").val())))	{
		var isChecked = $('#templateType1').attr('checked') ? true : false;
		if(isChecked && $( "#accountNo option:selected" ).length > 1){			
			$("#accountNo > option").each(function() {
				if(isEmpty(this.attributes.ibanno)){
					templateMultiSelect = true;
				}			   
			});
		}else{
			strIbanNo = $( "#accountNo option:selected" ).attr("ibanNo");
			if (charPaymentType === 'B' && debitAccountLevel==='B'){
				strIbanNo =  $( "#accountNoHdr option:selected" ).attr("ibanNo");
			}
		}			
		if (isEmpty(strIbanNo) || templateMultiSelect) {
			var arrError = [];
			arrError.push({
						"errorCode" : "WARNING",
						"errorMessage" : 'IBAN not defined for the specified account.'//getLabel('advocReceiverNtAlwd', 'Adhoc receiver not allowed!')
					});
			paintErrors(arrError);
			autoFocusFirstElement();
		}else{
			doClearMessageSection();
		}
	}else{
		
		if(isOnchange){
			strIbanNo = $( "#accountNo option:selected" ).attr("ibanNo");
			if (charPaymentType === 'B' && debitAccountLevel==='B'){
				strIbanNo =  $( "#accountNoHdr option:selected" ).attr("ibanNo");
				fieldId = 'ibanNoHdr';
			}
			if(!isEmpty(strIbanNo)){
				$('#' + fieldId).ForceNoSpecialSymbolWithoutSpace();
				$('#' + fieldId).val(strIbanNo);
				$('#' + fieldId).attr('disabled', true);
				$('#' + fieldId).addClass('disabled');
			}else{
				$('#' + fieldId).ForceNoSpecialSymbolWithoutSpace();
				$('#' + fieldId).val(strIbanNo);
				$('#' + fieldId).attr('disabled', false);
				$('#' + fieldId).removeClass('disabled');
			}
		}else{
			strIbanNo = $('#ibanNo').val();
			if(isEmpty(strIbanNo)){			
				$('#' + fieldId).val("");
				$('#' + fieldId).attr('disabled', false);
				$('#' + fieldId).removeClass('disabled');
			}else if(strIbanNo === $( "#accountNo option:selected" ).attr("ibanNo")){
				$('#' + fieldId).val(strIbanNo);
				$('#' + fieldId).attr('disabled', true);
				$('#' + fieldId).addClass('disabled');
			}else if(strIbanNo != $( "#accountNo option:selected" ).attr("ibanNo")){
				$('#' + fieldId).ForceNoSpecialSymbolWithoutSpace();
				$('#' + fieldId).val(strIbanNo);
				$('#' + fieldId).attr('disabled', false);
				$('#' + fieldId).removeClass('disabled');
			}
		}		
	}
}
function isFxContractAvlbl() {
	var blnRet = false;
	var data = paymentResponseInstrumentData;
	if (data && data.d && data.d.paymentEntry
			&& data.d.paymentEntry.paymentHeaderInfo
			&& !isEmpty(data.d.paymentEntry.paymentHeaderInfo.allowContractFX)
			&& data.d.paymentEntry.paymentHeaderInfo.allowContractFX == true)
		blnRet = true;
	return blnRet;
}
function toggleAmountCcyField() {
	var data = cloneObject(paymentResponseInstrumentData || {}), objStdField, isFieldPresent = false, isCcyMissMatch = isCurrencyMissMatch();
	if (data && data.d.paymentEntry && data.d.paymentEntry.standardField) {
		objStdField = data.d.paymentEntry.standardField;
		$.each(objStdField, function(index, cfg) {
					fieldId = cfg.fieldName;
					if (fieldId === 'debitPaymentAmntFlag') {
						isFieldPresent = true;
						return false;
					}
				});
	}
	if (isFieldPresent) {
		if (isCcyMissMatch)
			$('#debitPaymentAmntFlagDiv').removeClass('hidden');
		else
			$('#debitPaymentAmntFlagDiv').addClass('hidden');
	}
}
function getBuyerCcyForInstrument() {
	var regExp = /\(([^)]+)\)$/;
	var matches = null, strBuyerCcy = null;
	var chrDebitAccountlevel = 'B';
	var data = paymentResponseInstrumentData;
	if (data && data.d && data.d.paymentEntry
			&& data.d.paymentEntry.paymentHeaderInfo
			&& data.d.paymentEntry.paymentHeaderInfo.accountLevel)
		chrDebitAccountlevel = data.d.paymentEntry.paymentHeaderInfo.accountLevel;
	var strAccount = $('#accountNo :selected').text();
	if (/* strEntryType === 'TEMPLATE' && */charPaymentType === 'B' && chrDebitAccountlevel==='B')
		strAccount = $('#accountNoHdr :selected').text();
	if (strAccount) {
		matches = regExp.exec(strAccount)
		if (matches && matches[0]) {
			strBuyerCcy = matches[0].replace(/[()]/g, '');
		}
	}
	return strBuyerCcy;
}
function getFxRateTypeForInstrument(chrFxRateLevel) {
	var strFxRateType = '';
	if (strPaymentType && strPaymentType == 'BATCHPAY') {
		var data = paymentResponseHeaderData;
		if (data && data.d && data.d.paymentEntry
				&& data.d.paymentEntry.standardField) {
			var arrFields = data.d.paymentEntry.standardField;
			if (arrFields.length > 0) {
				$.each(arrFields, function(index, cfg) {
							if (cfg.fieldName == 'rateType') {
								strFxRateType = cfg.value;
							}
						});
				if(Ext.isEmpty(strFxRateType))
					strFxRateType = $("#rateType").val();
				return strFxRateType;
			}
		}
	} else {
		strFxRateType = $("#rateType").val();
		return strFxRateType;
	}
}
//TODO : call to this service should be changed, existing logic is as expected, but call to this function is getFXForDetail(buyccy,sellccy), which creates confusion
function getFXForDetail(sellccy, buyccy) {
	if('AUTH' === showFxRateLevel) return;
	var data = paymentResponseInstrumentData;
		if(strPaymentType  === "BATCHPAY")
			data = paymentResponseHeaderData; 
	var strFromCcy = null, strToCcy = null, strAmountLabel = 'Transaction Amount',strAmntCcyType ='amount';
	var fxLevel = 'B';
	if (Ext.isDefined(data) && Ext.isDefined(data.d)
			&& Ext.isDefined(data.d.paymentEntry.paymentHeaderInfo)
			&& Ext.isDefined(data.d.paymentEntry.paymentHeaderInfo.fxLevel)) {
		fxLevel = data.d.paymentEntry.paymentHeaderInfo.fxLevel;
	}
	if (Ext.isDefined(data)
			&& Ext.isDefined(data.d)
			&& Ext.isDefined(data.d.paymentEntry.paymentHeaderInfo)
			&& Ext
					.isDefined(data.d.paymentEntry.paymentHeaderInfo.singleOrBatch)) {
		if (fxLevel != 'I' && charPaymentType === 'B') {
			// return;
		}
	}
	strAmntCcyType = $('input[name=debitPaymentAmntFlag]:checked').val();
	if(isEmpty(strAmntCcyType) ){
		strAmntCcyType = 'P';
	}
	var strAmountFieldName = (strLayoutType &&
			/*commenting for FTMNTBANK-3964 as there is no such field exists with name "debitPaymentAmntFlag" in case of Account Transfer Category
			strLayoutType === 'ACCTRFLAYOUT'||*/
			strLayoutType === 'WIRELAYOUT' || strLayoutType === 'CHECKSLAYOUT' || strLayoutType === 'MIXEDLAYOUT' || strLayoutType ==='WIRESWIFTLAYOUT' )
			? (strAmntCcyType && strAmntCcyType === 'P'
					? 'amount'
					: 'debitCcyAmount')
			: 'amount';
	var strBuySellFlag = (strAmntCcyType && strAmntCcyType ==='P') ? 'S' : 'B';
//	var txnAmount = $('#'+strAmountFieldName).val();
	var txnAmount = '0.00';
	
	// jquery autoNumeric formatting
	var blnAutoNumeric = isAutoNumericApplied( strAmountFieldName );
	if( blnAutoNumeric )
		txnAmount = $( '#' + strAmountFieldName ).autoNumeric( 'get' );
	else
		txnAmount = $( '#' + strAmountFieldName ).val();
	// jquery autoNumeric formatting
	var contractRef = $('#contractRefNo').val();
	if (!contractRef) {
		contractRef = "";
	}
	if (txnAmount && txnAmount > 0) {
		txnAmount = parseFloat(txnAmount);
	}
	var fxRateType = getFxRateTypeForInstrument(fxLevel);

	if ($("#fxSpan").length > 0) {
		$('#fxSpan').remove();
	}
	
	if ( strPrdID != '55' && buyccy != sellccy) {
		
		if (strAmntCcyType && strAmntCcyType === 'D') {
			strFromCcy = sellccy;
			strToCcy = buyccy;
			strAmountLabel = getLabel('transactionAmount', 'Transaction Amount');
		} else {
			strFromCcy = buyccy;
			strToCcy = sellccy;
			strAmountLabel = getLabel('debitAmount', 'Debit Amount');
		}
		var urlSeek = "services/fxrate/" + strFromCcy + "/" + strToCcy + "/" + strBuySellFlag
				+ ".json";
				
		var sendData = {"$ratetype" : fxRateType};
		
		if(!isEmpty(txnAmount) && ! isEmpty(contractRef) ){
			sendData['$amount'] = txnAmount;
			sendData['$qfilter'] = contractRef;
		}
			
		else if(!isEmpty(txnAmount))
			sendData['$amount'] = txnAmount;
		else 
			sendData['$qfilter'] = contractRef;
			
		// FTMNTBANK-2399
		if (!isEmpty(strPaymentInstrumentIde) && fxRateType=="2") {
			sendData['$detailId'] = strPaymentInstrumentIde;
		}	
		// blockPaymentInstrumentUI(true);
		$.ajax({
					type : 'POST',
					url : urlSeek,
					complete : function(XMLHttpRequest, textStatus) {
						$.unblockUI();
						if ("error" == textStatus){
							var arrError = new Array();
							arrError.push({
										"errorCode" : "Message",
										"errorMessage" : mapLbl['unknownErr']
									});
							//doHandleUnknownError();
							//blockPaymentInstrumentUI(false);
						}
					},
					data : sendData,
					success : function(data) {
						$('.fxSpan').remove();
						$('#fxSpan').remove();
						if (data && data.d && data.d.error) {
							$("<span>").attr({
										'id' : 'fxSpan'
									}).html(strFromCcy + " - " + strToCcy
									+ ": " + data.d.error)
									.insertAfter('#amount');
						} else if (data && data.d && data.d.fxRate) {
							var htmlFx = null;
							
							if (strEntryType === 'TEMPLATE') {
								htmlFx = getLabel('lblFxRateIndicative','Fx Rate(Indicative)')+" : "
										+ data.d.fxRate;
							} else {
								htmlFx = getLabel('lblFxIndicativeRate','Indicative Rate') +" (" + sellccy + " - "
								+ buyccy + ") : " + data.d.fxRate;

								if (data.d.debitAmount) {
//									if (strAmntCcyType && strAmntCcyType === 'D') {
//										$('#amount').val(data.d.debitAmount);
//									}else{
//										$('#debitCcyAmount').val(data.d.debitAmount);
//									}
									htmlFx += "<br />" + strAmountLabel + ' : '
											+ " " + data.d.debitAmount;
								}
							}
							htmlFx += "<br />" +getLabel('lblIndicativeRate','');
							$("<span>").attr({
										'class' : 'fxSpan'
									}).html(htmlFx).insertAfter('#amount');
							paintChangedFxDetails(data,'fxSpan');
						}
						// blockPaymentInstrumentUI(false);
					}
				});
	}
}

function paintFXForDetailViewOnlySection() {
	if('AUTH' === showFxRateLevel) return;
	var data = paymentResponseInstrumentData, fieldId = null, isCcyMissMatch = false, strAmntCcyType = '', strFromCcy='', strToCcy = '';
	var txnAmount = null, contractRef = null, regExp = /\(([^)]+)\)$/, matches = null, buyerCcy = null, sellerCcy = null, debitAmount = null;
	var fxRateType = '0', strAccount = '', tempAccountObj = '', arrAccounts = null, strAccountList = null, strAmountLabel = 'Transaction Amount';
	var clsHide = 'hidden';
	var status = data.d.paymentEntry.paymentMetaData._status, fxRate = '0';
	
	if (data && data.d && data.d.paymentEntry
			&& data.d.paymentEntry.standardField) {
		var arrStdFields = data.d.paymentEntry.standardField;
		if (arrStdFields && arrStdFields.length > 0) {
			$.each(arrStdFields, function(index, cfg) {
						fieldId = cfg.fieldName;
						switch (fieldId) {
							case 'amount' :
								txnAmount = cfg.value;
								break;
							case 'debitCcyAmount':
								debitAmount = cfg.value;
								break;
							case 'contractRefNo' :
								contractRef = cfg.value;
								break;
							case 'rateType' :
								fxRateType = cfg.value;
								break;
							case 'txnCurrency' :
								sellerCcy = cfg.value;
								break;
							case 'accountNo' :
								if (cfg.values && cfg.values.length > 0)
									arrAccounts = cfg.values;
								else
									strAccount = cfg.value;
								strAccountList = cfg.availableValues;
								break;
							case 'debitPaymentAmntFlag'	:
								strAmntCcyType = cfg.value;
								break;
							case 'fxRate'	:
								fxRate = cfg.value;
								break;
						}
					});
		}
	}

	var fxLevel = 'B';
	if (Ext.isDefined(data) && Ext.isDefined(data.d)
			&& Ext.isDefined(data.d.paymentEntry.paymentHeaderInfo)
			&& Ext.isDefined(data.d.paymentEntry.paymentHeaderInfo.fxLevel)) {
		fxLevel = data.d.paymentEntry.paymentHeaderInfo.fxLevel;
	}
	if (Ext.isDefined(data)
			&& Ext.isDefined(data.d)
			&& Ext.isDefined(data.d.paymentEntry.paymentHeaderInfo)
			&& Ext
					.isDefined(data.d.paymentEntry.paymentHeaderInfo.singleOrBatch)) {
		if (fxLevel != 'I' && charPaymentType === 'B') {
			// return;
		}
	}
	
	var strBuySellFlag = (strAmntCcyType && strAmntCcyType ==='P') ? 'S' : 'B';
	
	var strAmountFieldValue = (strLayoutType && strLayoutType === 'ACCTRFLAYOUT'  || strLayoutType === 'WIRESWIFTLAYOUT'
			|| strLayoutType === 'WIRELAYOUT' || strLayoutType === 'CHECKSLAYOUT' || strLayoutType === 'MIXEDLAYOUT')
			? (strAmntCcyType && strAmntCcyType === 'P'
					? txnAmount
					: debitAmount)
			: txnAmount;
	if ((arrAccounts && arrAccounts.length > 0) || strAccount) {
		if (arrAccounts && arrAccounts.length) {
			$.each(arrAccounts, function(index) {
						tempAccountObj = getObjectFormJsonArray(
								arrAccounts[index], strAccountList);
						if (tempAccountObj && tempAccountObj.description)
							strAccount += tempAccountObj.description;
					});
		} else {
			strAccount = getObjectFormJsonArray(strAccount, strAccountList);
			if (strAccount)
				strAccount = strAccount.description
		}
		matches = regExp.exec(strAccount);
		if (matches && matches[0]) {
			buyerCcy = matches[0].replace(/[()]/g, '');
			isCcyMissMatch = isCurrencyMissMatchForViewOnly(sellerCcy, buyerCcy);
		}
	}
	
	if ($(".fxInfo_InstView").length > 0) {
		$(".fxInfo_InstView").empty();
	}

	if (isCcyMissMatch) {
		if (strAmountFieldValue && strAmountFieldValue > 0) {
			strAmountFieldValue = parseFloat(strAmountFieldValue);
		}
		
		if(fxLevel=='B') fxRateType = getFxRateTypeForInstrument(fxLevel);
		
		if (strAmntCcyType && strAmntCcyType === 'D') {
			strFromCcy = buyerCcy;
			strToCcy = sellerCcy;
			strAmountLabel =  getLabel('transactionAmount', 'Transaction Amount');
		} else {
			strFromCcy =sellerCcy;
			strToCcy =buyerCcy ;
			strAmountLabel = getLabel('debitAmount', 'Debit Amount');
		}
		var urlSeek = "services/fxrate/" +  strFromCcy + "/" + strToCcy + "/"+strBuySellFlag+".json";
		/*var sendData = "$ratetype=" + fxRateType + !isEmpty(txnAmount)
				? ("&$amount=" + txnAmount)
				: '' + "&$qfilter=" + contractRef;*/
		var sendData = {"$ratetype" : fxRateType};
		if(!isEmpty(strAmountFieldValue) && ! isEmpty(contractRef) ){
		//	sendData['$amount'] = txnAmount;
			sendData['$amount'] = strAmountFieldValue;
			sendData['$qfilter'] = contractRef;
		}
		else if(!isEmpty(strAmountFieldValue))
			sendData['$amount'] = strAmountFieldValue;
		else
			sendData['$qfilter'] = contractRef;
		
		sendData['$channelCode'] = paymentResponseInstrumentData.d.__metadata.channelCode;
			
		// FTMNTBANK-2399
		if (!isEmpty(strPaymentInstrumentIde) && fxRateType=="2" ) {
			sendData['$detailId'] = strPaymentInstrumentIde;
		}
		if(!isEmpty(strTxnDate))
		{
			sendData['$txnDate'] = strTxnDate;
		}
		$.ajax({
			type : 'POST',
			url : urlSeek,
			complete : function(XMLHttpRequest, textStatus) {
				$.unblockUI();
				if ("error" == textStatus){
						var arrError = new Array();
						arrError.push({
									"errorCode" : "Message",
									"errorMessage" : mapLbl['unknownErr']
								});
						//doHandleUnknownError();
						//blockPaymentInstrumentUI(false);
				}
			},
			data : sendData,
			success : function(data) {
				if (data && data.d && data.d.error) {
				} else if (data && data.d && data.d.fxRate) {
					if (strEntryType
							&& (strEntryType === 'PAYMENT' || strEntryType === 'SI')) {
						var htmlFx = getLabel('lblFxIndicativeRate','Indicative Rate')+" ("+ strToCcy + " - "
								+ strFromCcy + ") : ";
						if (status === 'Processed'|| status === 'Debited') {
							htmlFx += fxRate;
						} else {
							htmlFx += data.d.fxRate;
						}
						if (data.d.debitAmount) {
							if (status === 'Processed'|| status === 'Debited') {
								if (strAmntCcyType && strAmntCcyType === 'D' && charPaymentType === 'Q'){
									htmlFx += "<br />" + strAmountLabel+ " : " + strToCcy + " "+ txnAmount;
								}else{
									htmlFx += "<br />" + strAmountLabel+ " : " + strToCcy + " "+ debitAmount;
								}
							} else {
								htmlFx += "<br />" + strAmountLabel+ " : " + data.d.debitAmount;
							}
						}
						htmlFx += "<br />" +getLabel('lblIndicativeRate','');
						$("<span>").html(htmlFx).appendTo('.fxInfo_InstView');
						$(".fxInfo_InstView").removeClass(clsHide);
					} else if (strEntryType
							&& (strEntryType === 'TEMPLATE' && strLayoutType === 'WIRELAYOUT')) {
						var htmlFx = getLabel('lblFxRateIndicative','Fx Rate(Indicative)') +" : " + data.d.fxRate;
						htmlFx += "<br />" +getLabel('lblIndicativeRate','Rates as subject to change');
						$("<span>").html(htmlFx).appendTo('.fxInfo_InstView');
						$(".fxInfo_InstView").removeClass(clsHide);
					} else {
						$(".sheetRateInfoDiv").removeClass(clsHide);
						$(".sheetRateInfo").html(data.d.fxRate);
					}
					paintChangedFxDetails(data,'fxInfo_InstView');
				}
				// blockPaymentInstrumentUI(false);
			}
		});
	}
}
function getChangeRateTypeInfo() {
	var strRateType = $('#rateType').val();
	if (strRateType === '1') {
		$('#contractRefNo').attr('disabled', false);
		$('#contractRefNo').removeClass('disabled');
		$('#contractRefNoLbl').addClass('required');
		$('#contractRefNoDiv').removeClass('hidden');
		$('#contractRefNo').blur(function mark() {
					markRequired($(this));
				});
		$('#contractRefNo').focus(function() {
					removeMarkRequired($(this));
				});
		$('#fxRateDiv').addClass('hidden');
		$('#fxRateLbl').removeClass('required');
		$('#fxRate').attr('disabled', 'disabled');
	} else if(strRateType === '3'){ 
		$('#contractRefNo').attr('disabled', true);
		$('#contractRefNo').addClass('disabled');
		$('#contractRefNo').removeClass('requiredField');
		$('#contractRefNo').val('');
		$('#contractFxLabel').text('');
		$('#contractRefNo').unbind('blur');
		$('#contractRefNoLbl').removeClass('required');
		$('#contractRefNoDiv').addClass('hidden');
		$('#fxRateDiv').removeClass('hidden');
		$('#fxRateLbl').addClass('required');
		$('#fxRate').removeAttr('disabled');
	}
	else if (strRateType === '4') {
		$('#contractRefNo').attr('disabled', false);
		$('#contractRefNo').removeClass('disabled');
		$('#contractRefNoLbl').removeClass('required');
		$('#contractRefNoDiv').removeClass('hidden');
		$('#fxRateDiv').addClass('hidden');
		$('#fxRateLbl').removeClass('required');
		$('#fxRate').attr('disabled', 'disabled');
	}else {
		$('#contractRefNo').attr('disabled', true);
		$('#contractRefNo').addClass('disabled');
		$('#contractRefNo').removeClass('requiredField');
		$('#contractRefNo').val('');
		$('#contractFxLabel').text('');
		$('#contractRefNo').unbind('blur');
		$('#contractRefNoLbl').removeClass('required');
		$('#contractRefNoDiv').addClass('hidden');
		$('#fxRateDiv').addClass('hidden');
		$('#fxRateLbl').removeClass('required');
		$('#fxRate').attr('disabled', 'disabled');
	}
	handleCurrencyMissmatch();
}
function handleForex() {
	// var strRateTypeVal = $('input[name="rateType"]:radio:checked').val();
	getChangeRateTypeInfo();
}
function isCurrencyMissMatch() {
	var buyerCcy = null, retvalue = false;
	var sellerCcy = $('#txnCurrency').val();// Transaction Currency
	buyerCcy = getBuyerCcyForInstrument();
	if (!isEmpty(buyerCcy) && !isEmpty(sellerCcy) && (buyerCcy != sellerCcy))
		retvalue = true;
	return retvalue;
}
function getCurrencyMissMatchValueForViewOnly() {
	var data = paymentResponseInstrumentData, fieldId = null, isCcyMissMatch = false;
	var regExp = /\(([^)]+)\)$/, matches = null, buyerCcy = null, sellerCcy = null;
	var fxRateType = '0', strAccount = '', tempAccountObj = '', arrAccounts = null, strAccountList = null;

	if (data && data.d && data.d.paymentEntry
			&& data.d.paymentEntry.standardField) {
		var arrStdFields = data.d.paymentEntry.standardField;
		if (arrStdFields && arrStdFields.length > 0) {
			$.each(arrStdFields, function(index, cfg) {
						fieldId = cfg.fieldName;
						switch (fieldId) {
							case 'txnCurrency' :
								sellerCcy = cfg.value;
								break;
							case 'accountNo' :
								if (cfg.values && cfg.values.length > 0)
									arrAccounts = cfg.values;
								else
									strAccount = cfg.value;
								strAccountList = cfg.availableValues;
								break;
						}
					});
		}
	}

	if ((arrAccounts && arrAccounts.length > 0) || strAccount) {
		if (arrAccounts && arrAccounts.length) {
			$.each(arrAccounts, function(index) {
						tempAccountObj = getObjectFormJsonArray(
								arrAccounts[index], strAccountList);
						if (tempAccountObj && tempAccountObj.description)
							strAccount += tempAccountObj.description;
					});
		} else {
			strAccount = getObjectFormJsonArray(strAccount, strAccountList);
			if (strAccount)
				strAccount = strAccount.description
		}
		matches = regExp.exec(strAccount);
		if (matches && matches[0]) {
			buyerCcy = matches[0].replace(/[()]/g, '');
			isCcyMissMatch = isCurrencyMissMatchForViewOnly(sellerCcy, buyerCcy);
		}
	}
	return isCcyMissMatch;
}	
function isCurrencyMissMatchForViewOnly(sellerCcy, buyerCcy) {
	var retvalue = false;
	if (!isEmpty(buyerCcy) && !isEmpty(sellerCcy) && (buyerCcy != sellerCcy))
		retvalue = true;
	return retvalue;
}
function isForexAtInstrumentLevel() {
	var blnRet = false;
	var data = paymentResponseInstrumentData;
	if (data && data.d && data.d.paymentEntry
			&& data.d.paymentEntry.paymentHeaderInfo
			&& data.d.paymentEntry.paymentHeaderInfo.fxLevel
			&& data.d.paymentEntry.paymentHeaderInfo.fxLevel === 'I')
		blnRet = true;
	return blnRet;
}
function togglePrenoteValue() {
	if ($('#prenote').is(':checked')) {
		$('#prenote').val('Y');
		$('#holdUntilDiv').addClass('hidden');
		$('#holdUntil').val('');
		$('#holdUntilFlag').val('N');
		// $('#amount').val('0.0');
		// $('#amount').attr('disabled', true);
	} else {
		$('#prenote').val('N');
		// $('#amount').attr('disabled', false);
	}
}
function onChangeHoldUntil() {
	var clsHide = 'hidden', clsReq = 'required';
	if ($('#holdUntilFlag').is(':checked')) {
		$('#holdUntilFlag').val('Y');
		$('#holdUntilDiv').removeClass(clsHide);
		$('#holdUntilDiv').find("label").addClass(clsReq);
		$('#holdUntil').blur(function mark() {
			markRequired($(this));
		});
		$('#holdUntil').focus(function() {
			removeMarkRequired($(this));
		});
	} else {
		$('#holdUntilDiv').addClass(clsHide);
		$('#holdUntilDiv').find("label").removeClass(clsReq);
		$('#holdUntil').val('');
		$('#holdUntilFlag').val('N');
	}
}
function onChangeHoldUntil(strPmtType) {
	var clsHide = 'hidden',  clsReq = 'required', strPostFix = strPmtType === 'B' ? 'Hdr' : '';
	if ($('#holdUntilFlag'+strPostFix).is(':checked')) {
		$('#holdUntilFlag'+strPostFix).val('Y');
		$('#holdUntil'+strPostFix+'Div').removeClass(clsHide);	
		$('#holdUntilDiv').find("label").addClass(clsReq);
		$('#holdUntil').blur(function mark() {
			markRequired($(this));
		});
		$('#holdUntil').focus(function() {
			removeMarkRequired($(this));
		});
	} else {
		$('#holdUntil'+strPostFix+'Div').addClass(clsHide);
		$('#holdUntilDiv').find("label").removeClass(clsReq);
		$('#holdUntil'+strPostFix).val('');
		$('#holdUntilFlag'+strPostFix).val('N');
	}
}
function toggleHoldZeroDollerValue() {
	if ($('#hold').is(':checked')) {
		$('#hold').val('Y');
	} else
		$('#hold').val('N');
}
function toggleReceiverCodeNecessity() {
	var clsReq = 'required';
	if ($('#saveBeneFlagA').is(':checked')) {
		
		//$('#drawerCodeA').addClass('instrumentRequired');
		//$('#drawerCodeALbl').addClass(clsReq);
		//$('#drawerCodeA').removeAttr('disabled');
		$('#saveBeneFlagA').val('Y');
		//$('#drawerCodeA').blur(function mark() {
			//		markRequired($(this));
				//});
		//$('#drawerCodeA').focus(function() {
			//		removeMarkRequired($(this));
				//});
		
		$('#receiverCodeA').addClass('instrumentRequired');
		//$('#drawerCodeA').alphanumericOnly();
		//$('#receiverCodeA').alphanumericOnly();
		$('#receiverCodeALbl').addClass(clsReq);
		$('#receiverCodeA').removeAttr('disabled');
		$('#receiverCodeA').blur(function mark() {
					markRequired($(this));
					//populateDrawerCode();
				});
		$('#receiverCodeA').focus(function() {
					removeMarkRequired($(this));
				});
		$('#defaultAccountFlag').removeClass('hidden')
		
	} else {
		$('#drawerCodeALbl').removeClass(clsReq);
		$('#drawerCodeA').removeClass('instrumentRequired');
		$('#saveBeneFlagA').val('N');
		$('#drawerCodeA').val('');
		$('#drawerCodeA').attr('disabled','disabled'); 
		$('#drawerCodeA').unbind('blur');
		$('#drawerCodeA').removeClass('requiredField');
		
		$('#receiverCodeALbl').removeClass(clsReq);
		$('#receiverCodeA').removeClass('instrumentRequired');
		$('#receiverCodeA').val('');
		$('#receiverCodeA').attr('disabled','disabled'); 
		$('#receiverCodeA').unbind('blur');
		$('#receiverCodeA').removeClass('requiredField');
		$('#defaultAccountFlag').addClass('hidden');
	}
	
	if(ben_multi_acct == 'N')
	{
        $("#receiverCodeA").attr("maxlength", 10);
		$('#drawerCodeA').attr('disabled','disabled'); 
		$('#drawerCodeA').unbind('blur');
		$('#drawerCodeALbl').removeClass('required');
		$('#receiverCodeA').blur(function mark() {
			$('#drawerCodeA').val($('#receiverCodeA').val());
		});
	}
}
function toggleAdhocBeneCheckBox()
{
	if (!$('#saveBeneFlagA').is(':checked')) {
	$('#saveBeneFlagA').attr('checked', false);
	$('#saveBeneFlagA').attr("disabled", false);
	$('#saveBeneFlagA').val('N');
	if(strAction != 'EDIT'){
			$('#drawerCodeA').attr("disabled", true);
			$('#drawerCodeALbl').removeClass('required');
			$('#drawerCodeA').removeClass('instrumentRequired');
			$('#drawerCodeA').val('');
			$('#drawerCodeA').attr('disabled','disabled'); 
			$('#drawerCodeA').unbind('blur');
			$('#drawerCodeA').removeClass('requiredField');
		}
	}
		
}
function doHandleForex() {
	var strRateTypeVal = $('input[name=rateType]:radio:checked').val();
	getChangeRateTypeInfo(strRateTypeVal);
}
// TODO : TO be verified WIRE, Account Transfer, Checks Layout
function handleAmountCcyChange() {
	var strCurrency = $('#txnCurrency').val();
	var strBuyerCurrency = getBuyerCcyForInstrument();
	var strAmntCcyType = $('input[name=debitPaymentAmntFlag]:checked').val();
	if (!isEmpty(strCurrency)) {
		var strPostFix = isEmpty(strAmntCcyType) || isEmpty(strBuyerCurrency)
				? strCurrency
				: ((strAmntCcyType === 'P') ? strCurrency : strBuyerCurrency);
		$('#txnCurrencySpan').html('(' + (strPostFix ? strPostFix : '') + ')');
	} else
		$('#txnCurrencySpan').html('');

	if ((!isEmpty(strBuyerCurrency) && !isEmpty(strCurrency) && (strBuyerCurrency != strCurrency))
			&& (strEntryType === 'PAYMENT' || strEntryType === 'SI' || (strEntryType === 'TEMPLATE' && strLayoutType === 'WIRELAYOUT')))
		getFXForDetail(strBuyerCurrency, strCurrency);
	if(strPaymentType && strPaymentType == 'BATCHPAY' && paymentResponseHeaderData && paymentResponseHeaderData.d 
			&& paymentResponseHeaderData.d.paymentEntry 
			&& paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.dateLevel=='B')
	{
		var sellerCcy = $('#txnCurrencyHdr').val();
		getFXForHeader(strBuyerCurrency, sellerCcy);
	}
		
	if(strAmntCcyType && strAmntCcyType==='D'){
		$('#amount').addClass('hidden');
		$('#amount').val('0.00');
		$('#debitCcyAmount').removeClass('hidden');
	} else{
		$('#amount').removeClass('hidden');
		$('#debitCcyAmount').val('0.00');
		$('#debitCcyAmount').addClass('hidden');
	} 	
}
function handleDebitPaymentAmntFlagPopulation(cfg)
{
	if(cfg && cfg.value && cfg.value==='D'){
		$('#amount').addClass('hidden');
		//$('#amount').val('0.00');
		$('#debitCcyAmount').removeClass('hidden');
	} else{
		$('#amount').removeClass('hidden');
		$('#debitCcyAmount').val('0.00');
		$('#debitCcyAmount').addClass('hidden');
	}
}
//FTMNTBANK-841
//function handleCompanyIdInstrumentChange() {
//	var strTempType = $('input[name="templateType"]:radio:checked').val();
//	var strCompanyId = $('#companyId').val();
//	//var strOldAccountNo = $("#accountNo").val();
//	var data = paymentResponseInstrumentData;
//	if (strEntryType
//			&& ((strEntryType != 'TEMPLATE') || (strEntryType === 'TEMPLATE'
//					&& strTempType && strTempType !== '1'))) {
//		if (data && data.d && data.d.paymentEntry
//				&& data.d.paymentEntry.standardField) {
//			var arrFields = [];
//			var lstAvailableValues = [];
//			arrFields = data.d.paymentEntry.standardField;
//			$("#accountNo").val("");
//			if (arrFields && arrFields.length > 0) {
//				$.each(arrFields, function(index, cfg) {
//							if ('companyId' === cfg.fieldName) {
//								lstAvailableValues = cfg.availableValues
//							}
//						});
//			}
//			if (lstAvailableValues && lstAvailableValues.length > 0)
//				$.each(lstAvailableValues, function(index, cfg) {
//					if (cfg && strCompanyId === cfg.code && cfg.defaultAccount) {
//						$("#accountNo").val(cfg.defaultAccount);
//					}
//				});
//			//if (isEmpty($("#accountNo").val()))
//				//$("#accountNo").val(strOldAccountNo);
//		}
//	}
//}
function handleDebitAccountInstrumentChange() {
	var strTempType = $('input[name="templateType"]:radio:checked').val();
	//var strCompanyId = $('#companyIdHdr').val();
	var strAccountNo = $('#accountNo').val();
	//var strOldAccountNo = $("#accountNoHdr").val();
	//var strOldCompanyId = $("#companyId").val();
	var data = paymentResponseInstrumentData;
	if ((strEntryType && strEntryType != 'TEMPLATE')
			|| (strEntryType && strEntryType === 'TEMPLATE'
					&& !isEmpty(strTempType) && strTempType !== '1')) {
		if (data && data.d && data.d.paymentEntry
				&& data.d.paymentEntry.standardField) {
			var arrFields = [];
			var lstAvailableValues = [];
			arrFields = data.d.paymentEntry.standardField;

			if (arrFields && arrFields.length > 0) {
				$.each(arrFields, function(index, cfg) {
							if ('companyId' === cfg.fieldName) {
								lstAvailableValues = cfg.availableValues
							}
						});
			}
			if (lstAvailableValues && lstAvailableValues.length > 0)
				if (lstAvailableValues.length > 1)
					$("#companyId").val("");
			$.each(lstAvailableValues, function(index, cfg) {
						if (cfg /*&& strCompanyId === cfg.code */
								&& cfg.defaultAccount
								&& cfg.defaultAccount === strAccountNo) {
							$("#companyId").val(cfg.code);
						}else{
							$("#companyId").removeAttr('disabled');
							$("#companyId").removeAttr('readonly');
						}
					});
			//if(isEmpty($("#companyId").val()))
			//	$("#companyId").val(strOldCompanyId);
		}
	}
}
function initateValidation() {
	var field = null, fieldId = null;
	$('.transactionWizardInnerDiv label.required').each(function() {
				fieldId = $(this).attr('for');
				field = $('#' + fieldId);
				if($('#' + fieldId).hasClass('jq-editable-combo'))
					field = $('#' + fieldId + "_jq");
				if($('#' + fieldId).hasClass('jq-nice-select'))
					field = $('#' + fieldId + "-niceSelect");	
				if (field && field.length != 0) {
					field.bind('blur', function mark() {
								markRequired($(this));
							});
					field.bind('focus', function() {
								removeMarkRequired($(this));
							});
				}
							});
				
}
// Function field validation
function validateRequiredFields() {
	var failedFields = 0, field = null, fieldId = null, tmpValid = true;
	$('label.required').each(function() {
				tmpValid = true;
				fieldId = $(this).attr('for');
				field = $('#' + fieldId);
				if($('#' + fieldId).hasClass('jq-editable-combo'))
					field = $('#' + fieldId + "_jq");
				if($('#' + fieldId).hasClass('jq-nice-select'))
					field = $('#' + fieldId + "-niceSelect");	
				if (!isEmpty(field) && !isEmpty(fieldId) && field.length != 0) {
					tmpValid = markRequired(field);
					if (tmpValid == false)
						failedFields++;
				}
			});
	return (failedFields == 0);
}
// Function for field validation
function getValueToDispayed(cfg) {
	var dataType = cfg.dataType, defValue = cfg.value, fieldId = cfg.fieldName, blnReadOnly = cfg.readOnly;
	var strReturnValue = '', strTemp = '';
	if (dataType) {
		switch (dataType) {
			case 'multiselect' :
			case 'select' :
				if (cfg.values && cfg.values.length > 0) {
					$.each(cfg.values, function(index, opt) {
								strTemp = getObjectFormJsonArray(opt,
										cfg.availableValues);
								strTemp = strTemp && strTemp.description
										? strTemp.description
										: '';
								if (strTemp) {
									strReturnValue += strTemp;
									if (index != cfg.values.length - 1)
										strReturnValue += ',';
								}
							});
				} else if (!isEmpty(cfg.value)) {
					if(cfg.value === "--CONFIDENTIAL--")
					{
						strReturnValue =  cfg.value;
						break;
					}
					strReturnValue = getObjectFormJsonArray(cfg.value,
							cfg.availableValues);
					strReturnValue = strReturnValue
							&& strReturnValue.description
							? strReturnValue.description
							: '';
				}
				break;
			case 'text' :
			case 'seek' :
			case 'date' :
			case 'amount' :
			case 'time' :
				strReturnValue = defValue;
				break;
			case 'radio' :
			case 'checkBox' :
				strReturnValue = getObjectFormJsonArray(cfg.value,
						cfg.availableValues);
				strReturnValue = strReturnValue && strReturnValue.description
						? strReturnValue.description
						: (defValue);
				break;
			case 'mask' :
				var availValsArr = cfg.availableValues;
				var objSortAvalArray = null;
				var objDefValArray = new Array();
				objSortAvalArray = generateSortAvalValArray(availValsArr);
				if (!isEmpty(objSortAvalArray)) {
					$.each(objSortAvalArray, function(index, opt) {
								if (isControlFieldPresent(defValue, opt.seq)) {
									objDefValArray.push(opt.seq);
								}
							});
				}
				if (objDefValArray && objDefValArray.length > 0) {

					$.each(objDefValArray, function(index, opt) {
						strTemp = getMaskObjectFormJsonArray(opt, availValsArr);
						strTemp = strTemp && strTemp.description
								? strTemp.description
								: '';
						if (strTemp) {
							strReturnValue += strTemp;
							if (index != objDefValArray.length - 1)
								strReturnValue += ',';
						}
					});
				} else if (!isEmpty(objDefValArray)) {
					strReturnValue = getObjectFormJsonArray(objDefValArray,
							availValsArr);
					strReturnValue = strReturnValue
							&& strReturnValue.description
							? strReturnValue.description
							: '';
				}
				break;
		}
	}
	return strReturnValue;
}
function getMaskObjectFormJsonArray(strKey, arrValues) {
	var retValue = null;
	if (arrValues)
		$.each(arrValues, function(index, opt) {
					if (strKey === opt.seq) {
						retValue = opt;
						return retValue;
					}
				});
	return retValue;
}
function doRemoveStaticText(parentDivId) {
	$("#" + parentDivId + " .canRemove").remove();
	
}
function toggleReceiver(charReceiverType, clearFields) {
	if (!isEmpty(charReceiverType)) {
		if (charReceiverType === 'A') {
			strReceiverType = 'A';
			
			$('#drawerCodeALbl').removeClass('required');
			$('#drawerCodeA').removeClass('instrumentRequired');
			if(!$('#saveBeneFlagA').is(':checked'))
			{
				$('#saveBeneFlagA').val('N');
				$('#drawerCodeA').attr('disabled','disabled'); 
				$('#drawerCodeA').unbind('blur');
				$('#drawerCodeA').removeClass('requiredField');
				if(clearFields)
				{
					$('#receiverCodeA').val('');
					$('#drawerCodeA').val('');
				}
				$('#receiverCodeA').attr('disabled','disabled'); 
				$('#receiverCodeA').unbind('blur');
				$('#receiverCodeA').removeClass('requiredField');
				$('#receiverCodeA').removeClass('instrumentRequired');
				$('#receiverCodeALbl').removeClass('required');
			}
			$('.adhocReceiver').removeClass('hidden');
			$('#registeredReceiverDiv').addClass('hidden');
			$("#switchToAdhocReceiverDiv").addClass("hidden");
			if ($("#switchToAdhocReceiverDiv1"))
				$("#switchToAdhocReceiverDiv1").removeClass("hidden")
			$('#beneficiaryBankIDTypeA').change(function(){
				resetAdhocReceiverBankDetails();
				if($('#beneficiaryBankIDTypeA').val() == 'SYSTEM')
				{
					populateBankDetails();
				}
			});
			showHideIban($('#beneficiaryBankIDTypeA'));
			autoFocusOnFirstElement(null,'adhocReceiverDiv',true);
			if(paymentResponseInstrumentData)
			{
                anyIdToggle(paymentResponseInstrumentData.d.paymentEntry.paymentMetaData.anyIdPaymentFlag,"A");
                if(strLayoutType === 'MIXEDLAYOUT' || strLayoutType === 'CHECKSLAYOUT'){
                    var instrumentId = paymentResponseInstrumentData.d.paymentEntry.paymentMetaData.instrumentId;
                    if ('01' === instrumentId || '02' === instrumentId || '07' === instrumentId) {
                        $('#beneficiaryBranchDescriptionADiv').addClass('hidden');
                        $('#bankBranchDiv').addClass('hidden');
                        $('#drawerAccountNoADiv').addClass('hidden');
                        $("#drawerAccountIbanDiv").addClass("hidden");
                    }
                }
            }
		} else if (charReceiverType === 'R') {
			strReceiverType = 'R';
			$('.adhocReceiver').addClass('hidden');
			$('#registeredReceiverDiv').removeClass('hidden');
			if ($("#switchToAdhocReceiverDiv"))
				$("#switchToAdhocReceiverDiv").removeClass("hidden")
			if ($("#switchToAdhocReceiverDiv1"))	
			$("#switchToAdhocReceiverDiv1").addClass("hidden");	
			if(paymentResponseInstrumentData)
			{
				anyIdToggle(paymentResponseInstrumentData.d.paymentEntry.paymentMetaData.anyIdPaymentFlag,"R");
			}
			
		} else if (charReceiverType === 'T') {
			charReceiverType = 'R';
			strReceiverType = 'R';
			$("#switchToAdhocReceiverDiv").remove();
			$('.adhocReceiver').remove();
			$('#registeredReceiverDiv').remove();
			$('.systemReceiver').removeClass('hidden');
			$("#drawerDescriptionR").ReceiverAutoComplete(strMyProduct,null,'Q',true);
		}
		clearReceiver(charReceiverType, clearFields);
	}
}

function populateBankDetails()
{

	var urlDrawerBank = "services/userseek/drawerbank.json";
	$.ajax({
			url : urlDrawerBank,
			dataType : "json",
			data : 
			{
				$top:autocompleterSize,
				$filtercode1 : getDisabledFieldValue($('#beneficiaryBankIDTypeA')),
				$filtercode2 : strPaymentCategory
			},
			success : function(data) {
				var rec = data.d.preferences;
				if (rec && rec.length == 1) {
					if (!isEmpty(rec[0].ROUTINGNUMBER))
					{
						$('#beneficiaryBankIDCodeA').val(rec[0].ROUTINGNUMBER);
						$("#beneficiaryBankIDCodeAutoCompleter").val(rec[0].ROUTINGNUMBER);
					}
					if (!isEmpty(rec[0].BANKCODE))
						$('#drawerBankCodeA').val(rec[0].BANKCODE);
					if (!isEmpty(rec[0].BRANCHCODE))
						$('#drawerBranchCodeA').val(rec[0].BRANCHCODE);
					if (rec[0].BANKDESCRIPTION && rec[0].BRANCHDESCRIPTION) {
						$("#beneficiaryBranchDescriptionA").val(rec[0].BRANCHDESCRIPTION);
					} else {
						if (rec[0].BANKDESCRIPTION)
							$("#beneficiaryBankIDCodeAutoCompleter").val(rec[0].BANKDESCRIPTION);
						if (rec[0].BRANCHDESCRIPTION)
							$("#beneficiaryBranchDescriptionA").val(rec[0].BRANCHDESCRIPTION);
					}
					$('.noInfoFound').remove();
				}
			}
		});
}

function clearReceiver(charReceiverType, clearFields) {
	if (clearFields === true) {
		if (charReceiverType === 'B' || charReceiverType === 'A')
			$('#drawerDescriptionA,#drawerCodeA,#receiverCodeA,#receiverIDA,#drawerMailA,#drawerAccountNoA,#beneficiaryBankIDCodeA,#beneficiaryBankIDCodeAutoCompleter')
					.val('');
		$('#beneficiaryBankIDTypeA').niceSelect("destroy");
		$('#beneficiaryBankIDTypeA').val('');
		$('#beneficiaryBankIDTypeA').niceSelect('update');
		$('#beneficiaryBranchDescriptionA').val('');
		$('#anyIdValueA').val('');
		$('#anyIdTypeA').val('');
		$('#anyIdTypeA').niceSelect('update');
		enableDisableLEICode('');
		$('#receiverLeiTypeA').niceSelect("destroy");
		$('#receiverLeiTypeA').val('');
		if (charReceiverType === 'B' || charReceiverType === 'R') {
			$('#drawerMail_RInfoLbl,#drawerAccountNo_RInfoLbl,#drawerBankCode_RInfoLbl')
					.html('');
			$('#drawerDescriptionR,#drawerCodeR,#receiverIDR,#drawerAccountNoR,#drawerMailR,#beneficiaryBankIDCodeR,#beneficiaryBankIDTypeR')
					.val('');
		}
		if('CHECKSLAYOUT' === strLayoutType || 'MIXEDLAYOUT'===strLayoutType){
		     $('#phyDrawerAccountNoA,#phyDrawerBankCodeA,#phyDrawerBranchCodeA,#phyBeneficiaryBankIDCodeA').val('');
		     $('#phyDrawerBankCodeADesc,#phyDrawerBranchCodeADesc').val('');
		}
		$('#drawerAddress1A,#drawerAddress2A,#drawerAddress3A,#drawerCellNoA').val('');
		$('#rBankAddress1A,#rBankAddress2A,#rBankAddress3A').val('');
		$('#corrBankDetails1A,#corrBankDetails2A,#corrBankDetails3A,#corrBankDetails4A,#corrBankIDCodeA').val('');
		$('#intBankDetails1A,#intBankDetails2A,#intBankDetails3A,#intBankDetails4A,#intBankIDCodeA').val('');
		$('#corrBankIdTypeA,#intBankIDTypeA').val('');
		$('#corrBankIdTypeA,#intBankIDTypeA').niceSelect('update');
	}
	$("#beneficiaryBankIDCodeAInfoMessage").empty();
}
function resetAdhocReceiverBankDetails() {
	$('#beneficiaryBankIDCodeA,#beneficiaryBankIDCodeAutoCompleter,#drawerBankCodeA,#drawerBranchCodeA,#beneficiaryBranchDescriptionA,#beneficiaryBankDescriptionA,#drawerBankAddressA,#rBankAddress1A,#rBankAddress2A,#rBankAddress3A')
	.val('');
	$('#beneficiaryAdhocbankFlagA').val('Y');
	$("#beneficiaryBankIDCodeAInfoMessage").empty();
	doBankIDValidation();
}
function toggleDirtyBit(blnApplyDirtyBit) {
	var field = null;
	dirtyBit = 0;
	$('#transactionWizardPopup :text, #transactionWizardPopup :file, #transactionWizardPopup :checkbox, #transactionWizardPopup :radio, #transactionWizardPopup select, #transactionWizardPopup textarea')
			.each(function() {
						field = $(this);
						if (field && field.length != 0) {
							if (blnApplyDirtyBit)
								field.focus(function dirtyBitFocus() {
									dirtyBit++;
										// console.log(dirtyBit);
									});
							else
								field.unbind('focus');
						}
					});
}
function toggleCurrencyLabel(strCcy) {
	if ('WIRELAYOUT' === strLayoutType
			|| ('ACCTRFLAYOUT' === strLayoutType && strEntryType === 'TEMPLATE')
			|| 'CHECKSLAYOUT' === strLayoutType || strLayoutType === 'SIMPLEACCTRFLAYOUT' || strLayoutType === 'WIRESIMPLELAYOUT' || strLayoutType ==='MIXEDLAYOUT' || strLayoutType ==='WIRESWIFTLAYOUT') {
		handleAmountCcyChange();
	} else {
		if (!isEmpty(strCcy))
			$('#txnCurrencySpan').html('(' + strCcy + ')');
		else
			$('#txnCurrencySpan').html('');
	}
}
function createCrDrCheckBoxGroup(strCheckBoxIds) {
	$(strCheckBoxIds).on('click', function() {
		var me = $(this), name = me.prop('name');
		if (me.is(':checked')
				&& $(':checkbox[name="' + name + '"]:checked').length > 0)
			$(':checkbox[name="' + name + '"]').not($(this)).prop('checked',
					false);
		else
			me.attr('checked', true);
		if (strLayoutType && (strLayoutType === 'ACCTRFLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT' || strLayoutSubType === 'DRAWDOWN'))
			toggleAccountLabel(me, me.val());
		populateBankProductFieldDetail();
	});
}
/*
 * function toggleCurrencyLabel(strCcy) { if (!isEmpty(strCcy))
 * $('#txnCurrencySpan').html('(' + strCcy + ')'); else
 * $('#txnCurrencySpan').html(''); }
 */
function handleBankBranchToggleForAdhocReceiver(strCheckBoxIds) {
	$(strCheckBoxIds).on('click', function() {
		var me = $(this), name = me.prop('name');
		if ($(this).attr('id') === 'cbBankRoutingCodeA') {
			$('#beneficiaryBankIDCodeALbl').html('Routing Number');
			$('#beneficiaryBankIDCodeAutoCompleter').autocomplete("destroy");
			$('#beneficiaryBankIDCodeAutoCompleter').BankIdAutoComplete();
		} else if ($(this).attr('id') === 'cbBankAndBranchNameA') {
			$('#beneficiaryBankIDCodeALbl').html('Search Bank and Branch Name');
			$('#beneficiaryBankIDCodeAutoCompleter').autocomplete("destroy");
			$('#beneficiaryBankIDCodeAutoCompleter').BankBranchAutoComplete();
		}
		$('#drawerBankCodeA, #drawerBranchCodeA, #beneficiaryBankIDCodeA')
				.val('');
	});
	if(!isScreenBroken && strLayoutType && strLayoutType !='TAXLAYOUT')
		doBankIDValidation();
}
function showHideSection(sectionId) {
	$('#' + sectionId).toggleClass("ui-helper-hidden");
}
function advanceSettingInstrumentPopupOpen() {
	$("#advancedSettingInstrumentPopup").toggleClass('hidden');
	if ($("#plusIcon").hasClass('fa-plus')) {
		$("#plusIcon").removeClass('fa-plus');
		$("#plusIcon").addClass('fa-minus');
	} else {
		$("#plusIcon").removeClass('fa-minus');
		$("#plusIcon").addClass('fa-plus');
	}
}
function handleForexForPaymentInstrument() {
	handleChangeRateType();
}
function handleChangeRateTypeForInstrument(strValue) {
	var strRateType = !isEmpty(strValue) ? strValue : $('#rateType').val();
	if (strRateType === '1') {
		$('#fxRateDiv').addClass('hidden');
		$('#contractRefNo').attr('disabled', false);
		$('#contractRefNo').removeClass('disabled');
		$('#contractRefNoLbl').addClass('required');
		$('#contractFxLabel').text('');
		$('#contractRefNoDiv').removeClass('hidden');
		$('#contractRefNo').blur(function mark() {
					markRequired($(this));
				});
		$('#contractRefNo').focus(function() {
					removeMarkRequired($(this));
				});
	} 
	else if (strRateType === '3') {
		$('#contractRefNo').attr('disabled', 'disabled');
		$('#contractRefNo').addClass('disabled');
		//$('#contractRefNoDiv').addClass('hidden');
		
		$('#fxRate').removeAttr('disabled');
		$('#fxRateLbl').addClass('required');
		$('#fxRateDiv').removeClass('hidden');
		$('#fxRate').blur(function mark() {
					markRequired($(this));
				});
		$('#fxRate').focus(function() {
					removeMarkRequired($(this));
				});
	}
	else if (strRateType === '4') {
		$('#fxRateDiv').addClass('hidden');
		$('#contractRefNo').attr('disabled', false);
		$('#contractRefNo').removeClass('disabled');
		$('#contractRefNoLbl').addClass('required');
		$('#contractRefNoDiv').removeClass('hidden');
		$('#contractRefNo').blur(function mark() {
					markRequired($(this));
				});
	}
	else {
		$('#contractRefNo').attr('disabled', true);
		$('#contractRefNo').addClass('disabled');
		$('#contractRefNo').removeClass('requiredField');
		$('#contractRefNo').val('');
		$('#contractRefNo').unbind('blur');
		$('#contractRefNoLbl').removeClass('required');
		$('#contractRefNoDiv').addClass('hidden');
		$('#fxRateDiv').addClass('hidden');
	}
	handleCurrencyMissmatch();
}
function getPaymentMethodReceiverLevel(data){
	var chrBankBeneLevel = 'I';
	if (!isEmpty(data) && !isEmpty(data.bankBeneLevel)) {
		chrBankBeneLevel = data.bankBeneLevel;
	}
	return chrBankBeneLevel;
}
function isBatchPaymentForSystemBene(data) {
	var chrIsSystemBenePayment = 'N';
	if (!isEmpty(data) && !isEmpty(data.systemBenePayment)) {
		chrIsSystemBenePayment = data.systemBenePayment;
	}
	return chrIsSystemBenePayment === 'Y' ? true : false;
}
function showFetchAdviceMultiInfoPopup(){
	
	showFetchAdviceInstrumentInfoPopup('Multi');
}
function repopulateBankProductField() {
	var _strMyProduct = strMyProduct;
	var _strCcy = $('#txnCurrency').val();
	var _strdrCrFlag = 'B';
	var isCrChecked = $('#drCrFlagC').is(':checked');
	var isDrChecked = $('#drCrFlagD').is(':checked');
	var strUrl = 'services/bankproduct/'
	if (isCrChecked && isDrChecked)
		_strdrCrFlag = 'B';
	else if (isCrChecked)
		_strdrCrFlag = 'C';
	else if (isDrChecked)
		_strdrCrFlag = 'D';
	if (isEmpty(_strCcy) && 'MIXEDLAYOUT' === strLayoutType) {
		var field = "#bankProduct";
		$(field).removeClass('hidden');
		$(field + 'ListSpan').remove();
		$(field).removeClass('disabled');
		$(field).removeAttr('disabled');
		$(field).removeAttr('readonly');
		var selectedVal = $(field).val();
		$(field).find('option[value='+selectedVal+']').remove();
		
		$("#advanceSettingToggle,#payorInformationToggle,#paymentDetailsToggle,#additionalInfoToggle").removeAttr('style').addClass("collapseDiv");
		$("#payorInformationToggleCaret,#paymentDetailsToggleCaret,#additionalInfoToggleCaret,#advanceSettingToggleCaret").removeClass("fa-caret-up").addClass("fa-caret-down avoid-clicks");
	}
	if (!isEmpty(_strMyProduct) && !isEmpty(_strCcy) && !isEmpty(_strdrCrFlag)) {
		strUrl += _strMyProduct + '/' + _strCcy + '/' + _strdrCrFlag + '.json';
		//blockPaymentInstrumentUI(true);
		blockUIWithLoading(true);
		doClearMessageSection();
		$.ajax({
					type : "POST",
					url : strUrl,
					async : false,
					complete : function(XMLHttpRequest, textStatus) {
						if ("error" == textStatus) {
							var arrError = new Array();
							arrError.push({
										"errorCode" : "Message",
										"errorMessage" : mapLbl['unknownErr']
									});
							doHandleUnknownError();
							blockPaymentInstrumentUI(false);
						}
					},
					success : function(data) {
						if (data != null) {
							if (data && data.d && data.d && data.d.seek) {
								var obj = data.d.seek;
								var arrData = new Array();
								if ($.isArray(obj)) {
									arrData = obj[0];
									if (arrData) {
										populateSelectFieldValue('bankProduct',
												arrData, '');
										blockPaymentInstrumentUI(false);
										if (arrData.length === 1) {
											repaintPaymentInstrumentFields(true);
											$('#drCrFlagD, #drCrFlagC').attr(
													"checked", false);
											if (_strdrCrFlag === 'B') {
												$('#drCrFlagD, #drCrFlagC')
														.attr("checked", true);
											} else
												populateRadioFieldValue(
														'drCrFlag',
														_strdrCrFlag);
										} else {
											//$('#bankProduct').show();
											if (strLayoutType === 'MIXEDLAYOUT') {
												if (charPaymentType === 'B')
													doHandleContainerCollapseHdr();
												else
													doHandleContainerCollapse();
											}
											// $('#bankProductHdrSpan').hide();
											$('#bankProduct').attr('disabled',
													false);
											handleLayoutBasedScreenRendering('Q',paymentResponseInstrumentData);		
										}
									}

								} else if (obj.error) {
									var errObj = [{
										errorMessage : mapLbl['drCrFlagError_'
												+ _strdrCrFlag],
										errorCode : 'ERR'
									}];
									paintErrors(errObj);
									blockPaymentInstrumentUI(false);
								}
							}

						}
					}
				});
		$('#txnCurrency-niceSelect').focus();
	}
}
function togglePaymentInstrumentEditScreen(showVerifyScreen) {
	if (showVerifyScreen) {
		// TODO: Verify whether Update and Next or only Next
		doClearMessageSection();
		$('#txnStep1,#txnStep2').removeClass('ft-status-bar-li-active')
				.addClass('ft-status-bar-li-done');
		$('#txnStep3').addClass('ft-status-bar-li-active');
		$('#transactionWizardPopup').addClass('hidden');
		$('#verificationStepDiv').removeClass('hidden');
		paintPaymentInstrumentActions('SUBMIT');
		paintPaymentInstrumentVerifyScreen(paymentResponseInstrumentData, 'N');
		handleEmptyEnrichmentDivs();
		anyIdToggle(paymentResponseInstrumentData.d.paymentEntry.paymentMetaData.anyIdPaymentFlag,"V");	
	} else {
		doClearMessageSection();
		$('#txnStep1').removeClass('ft-status-bar-li-active')
				.addClass('ft-status-bar-li-done');
		$('#txnStep3').removeClass('ft-status-bar-li-done ft-status-bar-li-active');
		$('#txnStep2').addClass('ft-status-bar-li-active').removeClass('ft-status-bar-li-done');
		$('#transactionWizardPopup').removeClass('hidden');
		$('#verificationStepDiv').addClass('hidden');
		doRemoveStaticText("transactionWizardPopup");
		paintPaymentInstrumentUI(paymentResponseInstrumentData, 'Q');
		if(strEntryType == 'TEMPLATE')
		{
			paintTemplateInstrumentActions('EDIT');
		}
		else
		{
		paintPaymentInstrumentActions('EDIT');
		}
		handleEmptyEnrichmentDivs();
	}
}
function doViewPaymentInstrument() {
	doClearMessageSection();
	// $('#txnStep1,#txnStep2').removeClass('ft-status-bar-li-active')
	// .addClass('ft-status-bar-li-done');
	// $('#txnStep3').addClass('ft-status-bar-li-active');
	$('#txnStep1,#txnStep2,#txnStep3').addClass('hidden');
	$('#transactionWizardPopup').addClass('hidden');
	$('#verificationStepDiv').removeClass('hidden');
	paintPaymentInstrumentVerifyScreen(paymentResponseInstrumentData, 'N');
	anyIdToggle(paymentResponseInstrumentData.d.paymentEntry.paymentMetaData.anyIdPaymentFlag,"V");
	setTimeout(function() { handleEmptyEnrichmentDivs(); }, 5000);
}
// TODO: To be verified
function loadPaymentInstrumentBankProductFields() {
	var strProductCode = strMyProduct;
	var strBankProduct = $('#bankProduct').val();
	var strUrl = _mapUrl['loadInstrumentFieldsUrl'] + "/" + strProductCode;
	var jsonObj = null;

	if (!isEmpty(strBankProduct))
		strUrl += '/' + strBankProduct;
	strUrl += '.json';
	// TODO : To be handled
	/*
	 * $('#regDrawerCode').autocomplete("destroy");
	 * $("#regDrawerCode").ReceiverAutoComplete(strMyProduct, strBankProduct,
	 * 'Q'); $('#receiverDtlDiv').addClass('ui-helper-hidden');
	 */
	blockPaymentInstrumentUI(true);
	jsonObj = generatePaymentInstrumentJson();
	if (jsonObj.d && jsonObj.d.__metadata && strPaymentInstrumentIde)
		jsonObj.d.__metadata._detailId = strPaymentInstrumentIde;
	$.ajax({
				type : "POST",
				url : strUrl,
				async : false,
				contentType : "application/json",
				data : JSON.stringify(jsonObj),
				complete : function(XMLHttpRequest, textStatus) {
					if ("error" == textStatus) {
						var arrError = new Array();
						arrError.push({
									"errorCode" : "Message",
									"errorMessage" : mapLbl['unknownErr']
								});
						doHandleUnknownError();
						blockPaymentInstrumentUI(false);
					}
				},
				success : function(data) {
					if (data != null) {
						paymentResponseInstrumentData = data;
						doRemoveStaticText("transactionWizardPopup");
						paintPaymentInstrumentUI(data, 'Q');
						initateValidation();
						blockPaymentInstrumentUI(false);
						handleEmptyEnrichmentDivs();
					}
				}
			});
}

function getInstrumentTemplateType(arrStdFields) {
	var strRetValue = null;
	var arrFields = arrStdFields || [];
	if (arrFields && arrFields.length > 0) {
		$.each(arrFields, function(index, cfg) {
					if (cfg.fieldName === 'templateType') {
						strRetValue = cfg.value;
						return false;
					}
				});
	}
	return strRetValue;
}

function setSelectedReceiver(record) {
	$('#drawerCodeR, #regDrawerCode').val(record['code']);
	$('#drawerDescriptionR').val(record['receiverName']);
	$('#receiverIDR').val(record['code']);
	$('#drawerCodeR, #drawerDescriptionR,#receiverIDR')
			.removeClass('requiredField');
	toggleReceiver('R', false);
	// FIXME: Following fields to be populated
	// $('#drawerMail_RInfoLbl').html(receiverDetails.beneEmailId || '');
	// $('#drawerAccountNo_RInfoLbl').html(ui.item.details.accountNumber);
	// $('#drawerBankCode_RInfoLbl').html(ui.item.details.bankCode);
}
function setBankIDValue(bankIdSelected, bankIdElement, data) {
	/*if ('BIC' === bankIdSelected) {
		$(bankIdElement).val(data.BIC);
	}
	if ('CHIPS' === bankIdSelected) {
		$(bankIdElement).val(data.CHIPS);
	}
	if ('FED' === bankIdSelected) {
		$(bankIdElement).val(data.FEDABA);
	}
	if ('NCC' === bankIdSelected) {
		$(bankIdElement).val(data.NCC);
	}
	if ('SORT' === bankIdSelected) {
		$(bankIdElement).val(data.SORT);
	}
	else {
			$(bankIdElement).val(data.ROUTINGNUMBER);
	} */
	$(bankIdElement).val(data.ROUTINGNUMBER);
}
function doPopulateADhocReceiverSwiftMsg57(code) {
	var beneBranchCode = $('#drawerBranchCodeA');
	var add1 = $('#drawerBankAddressA');
	var benCountry = $('#beneficiaryCountryA');
	var line4;
	if (!isEmpty(beneBranchCode))
		$('#swift57aline1A').val(beneBranchCode.val().substring(0, 35));
	if (!isEmpty(add1)) {
		line4 = add1.val().substring(70, 95);
		$('#swift57aline2A').val(add1.val().substring(0, 35));
		$('#swift57aline3A').val(add1.val().substring(35, 70));
	}
	if (!isEmpty(benCountry))
		line4 = line4 + benCountry.val().substring(0, 10);
	if (!isEmpty(line4))
		$('#swift57aline4A').val(line4.substring(0, 35));
}

jQuery.fn.initiateCheckBankIDListener = function(bankIdTypeElement, infoMessageElement, infoType) 
{
	var isBankIDSelected = null;
	$(this).focusout(function() {
		if (!isBankIDSelected) {
		//	$(this).checkInfoFoundForBankID(bankIdTypeElement, infoMessageElement, infoType);
		}
	}).blur(function() {
				if (!isBankIDSelected) {
					// $('#bankSearchText').validateBankID();
				}
			});
	$(this).keydown(function(event) {});
};
function getAdhocBankWarningMessage() {
	/* Need to Remove inline Styles */
	var warningMsgHtmlText = '<span class="ux_info-icon floatLeft noInfoFound" style="float:left !important;padding:1px 0px 0px 0px !important;color:#FFBE23 !important">&nbsp;</span> <span style="color:#FFBE23 !important" class="noInfoFound"> Information not found in library</span>';
	return warningMsgHtmlText;
}

var checkBankIDInLibraryURL = "services/userseek/checkDrawerbank.json?$top=20&$filtercode2=";
jQuery.fn.checkInfoFoundForBankID = function(bankIdTypeElement,
		infoMessageElement, infoType) {
	var textVal = this.val();
	if (textVal == '' || textVal == '%') {
		return;
	}
	$.ajax({
		url : checkBankIDInLibraryURL,
		dataType : "json",
		data : {
			$filtercode4 : textVal,
			$filtercode1 : (infoType == 'RECEIVER_BANK_INFO'
					? getDisabledFieldValue(bankIdTypeElement)
					: 'BIC')
		},
		success : function(bankData) {
			var data = bankData.d.preferences[0];
			if (data == null || (data != null && data.length == 0)) {
				$('#' + infoMessageElement).empty();
				$('#' + infoMessageElement).html(getAdhocBankWarningMessage());
				/* Clears the Bank Details if Already Set */
				clearBankDetails(infoType);
				if (infoType == 'RECEIVER_BANK_INFO') {
					$('#beneficiaryAdhocbankFlagA').val('Y');
					$('#beneficiaryBranchDescriptionALbl').addClass("required");
				}/*
				 * else if (infoType == 'RECEIVER_CORR_BANK_INFO') {
				 * $('#corrBankTypeA').val('A');
				 * $('#corrBankDetails1ALbl').addClass("required"); } if
				 * (infoType == 'RECEIVER_INT_BANK_INFO') {
				 * $('#intBankTypeA').val('A');
				 * $('#intBankDetails1ALbl').addClass("required"); }
				 */
				enableDisableBankDetailsFields(false, infoType);
			} else {
				enableDisableBankDetailsFields(true, infoType);
				if (data) {
					if (infoType == 'RECEIVER_BANK_INFO'
							&& !isEmpty(strLayoutType)
							&& (strLayoutType === 'ACHLAYOUT' || strLayoutType === 'MIXEDLAYOUT')) {
						setAdhocReceiverBankInfo(data, infoMessageElement);
						$('#beneficiaryBranchDescriptionALbl')
								.removeClass("required");
					} /*
					 * else if (infoType == 'RECEIVER_CORR_BANK_INFO') {
					 * setAdhocReceiverCorrBankInfo(data,
					 * infoMessageElement); $('#corrBankDetails1ALbl')
					 * .removeClass("required"); } if (infoType ==
					 * 'RECEIVER_INT_BANK_INFO') {
					 * setAdhocReceiverIntBankInfo(data,
					 * infoMessageElement); $('#intBankDetails1ALbl')
					 * .removeClass("required"); }
					 */
				}
				// Populate other Information
			}
		}
	});
};
function enableDisableBankDetailsFields(blnReadOnly, strInfoType) {
	if (strInfoType == 'RECEIVER_BANK_INFO') {
		enableDisableField($('#drawerBankCodeA'), blnReadOnly);
		enableDisableField($('#drawerBranchCodeA'), blnReadOnly);
		enableDisableField($('#drawerBankAddressA'), blnReadOnly);
	}
	// else if(strInfoType == 'RECEIVER_CORR_BANK_INFO'){
	// enableDisableField($('#corrBankDetails1A'),blnReadOnly);
	// enableDisableField($('#corrBankDetails3A'),blnReadOnly);
	// }
	// if(strInfoType == 'RECEIVER_INT_BANK_INFO'){
	// enableDisableField($('#intBankDetails1A'),blnReadOnly);
	// enableDisableField($('#intBankDetails3A'),blnReadOnly);
	// }
}
function clearBankDetails(infoType) {
	if (infoType == 'RECEIVER_BANK_INFO') {
		$('#drawerBankCodeA').val('');
		$('#drawerBranchCodeA').val('');
		$('#drawerBankAddressA').val('');
		$('#beneficiaryBankDescriptionA').val('');
		$('#beneficiaryBranchDescriptionA').val('');
	}
	// else if(infoType == 'RECEIVER_CORR_BANK_INFO'){
	// $('#corrBankDetails1ARM').val('');
	// $('#corrBankDetails3ARM').val('');
	// }
	// if(infoType == 'RECEIVER_INT_BANK_INFO'){
	// $('#intBankDetails1ARM').val('');
	// $('#intBankDetails3ARM').val('');
	// }
}

function setAdhocReceiverBankInfo(objData, infoMessageElement) {
	$('#beneficiaryAdhocbankFlagA').val('N');
	if (!isEmpty(objData.ROUTINGNUMBER))
		$('#beneficiaryBankIDCodeA').val(objData.ROUTINGNUMBER);
	if (!isEmpty(objData.BANKCODE))
		$('#drawerBankCodeA').val(objData.BANKCODE);
	if (!isEmpty(objData.BRANCHCODE))
		$('#drawerBranchCodeA').val(objData.BRANCHCODE);
	if (!isEmpty(objData.BANKDESCRIPTION)) {
		strText = objData.BANKDESCRIPTION;
		$('#beneficiaryBankDescriptionA').val(objData.BANKDESCRIPTION);
	}
	if (!isEmpty(objData.BRANCHDESCRIPTION)) {
		strText += ',&nbsp;' + objData.BRANCHDESCRIPTION;
		$('#beneficiaryBranchDescriptionA').val(objData.BRANCHDESCRIPTION);
	}
	if (!isEmpty(objData.ROUTINGNUMBER))
		strText += ',&nbsp;' + objData.ROUTINGNUMBER;
	$('#' + infoMessageElement).empty();
	$('#' + infoMessageElement).html(strText);
	if (!isEmpty(objData.ADDRESS))
		$('#drawerBankAddressA').val(objData.ADDRESS);

}

function displayFiInfoForRecevingAccount(data, isViewOnly) {
	var strAccountInfo = null;
	var fieldPostFix = isViewOnly ? '_InstView' : 'InfoSpan';
	var fieldDivID = isViewOnly
			? 'receivingaccountViewDivInfo'
			: 'receivingaccountDivInfo';
	// $("#drawerAccountNoStatic" + fieldPostFix).text("");
	if (data) {
		$("#drawerAccountNoStatic" + fieldPostFix).removeClass('hidden');
		strAccountInfo = (data.ACCOUNTCCY) ? data.ACCOUNTCCY : '';
		strAccountInfo += strAccountInfo ? ', ' : '';
		strAccountInfo += (data.SELLER) ? data.SELLER : '';
		strAccountInfo += strAccountInfo ? ', ' : '';
		strAccountInfo += (data.CORPORATION) ? data.CORPORATION : '';
		strAccountInfo += strAccountInfo ? ', ' : '';
		strAccountInfo += (data.CLIENT) ? data.CLIENT : '';
		// var parentWidth = $("#drawerAccountNoStatic" + fieldPostFix).width();
		$("#drawerAccountNoStatic" + fieldPostFix).text(strAccountInfo);
		$("#" + fieldDivID).css({
					"overflow" : "hidden",
					"text-overflow" : "ellipsis"/*,
					"white-space" : "nowrap"*/
				});
		/*$("#drawerAccountNoStatic" + fieldPostFix)
				.attr("title", strAccountInfo);*/
	}
}
function toggleRecurringPaymentParameterDtlFieldsSectionVisibility() {
	var isChecked = $('#paymentSaveWithSI').is(':checked');
	if (isChecked === true) {
		$('#siProcessingParameterInfoDiv').removeClass('ui-helper-hidden');
	} else {
		$('#siProcessingParameterInfoDiv').addClass('ui-helper-hidden');
	}
}
function toggleRecurringPaymentParameterDtlFieldsViewOnlySectionVisibility(
		strPostFix) {
	var isChecked = $('#paymentSaveWithSI' + strPostFix).is(':checked');
	if (isChecked === true || strEntryType === 'SI') {
		$('#siProcessingParameterInfoDiv').removeClass('ui-helper-hidden');
	} else {
		$('#siProcessingParameterInfoDiv').addClass('ui-helper-hidden');
	}
}
function toggleSaveSIDtlCheckBoxValue(id) {
	var isChecked = $('#' + id).attr('checked') ? true : false;
	if (isChecked)
		$('#' + id).val('Y');
	else
		$('#' + id).val('N');
	toggleRecurringPaymentParameterDtlFieldsSectionVisibility();
	if(isChecked === false){
		$('#siEffectiveDate,#siTerminationDate,#siNextExecutionDate').val('');
		$("#siFrequencyCode option:first").attr('selected', 'selected');
		$("#period option:first").attr('selected', 'selected');
		if (startDayOfWeek) {
			$('#refDay').val(startDayOfWeek);
		}else {
		$("#refDay option:first").attr('selected', 'selected');
		}
		$("#holidayAction option:first").attr('selected', 'selected');
		if ($('#siFrequencyCode-niceSelect').length)
			$("#siFrequencyCode").niceSelect('update');
		if ($('#holidayAction-niceSelect').length)
			$("#holidayAction").niceSelect('update');
		var arrFields = paymentResponseInstrumentData
				&& paymentResponseInstrumentData.d
				&& paymentResponseInstrumentData.d.paymentEntry
				&& paymentResponseInstrumentData.d.paymentEntry.standardField
				? paymentResponseInstrumentData.d.paymentEntry.standardField
				: [];
		if (arrFields.length > 0) {
			$.each(arrFields, function(index, item) {
						if (item.fieldName === 'siEffectiveDate'
								&& !isEmpty(item.value)) {
							$('#siEffectiveDate').val(item.value);
							showNextDateOnPaymentScreen(strPaymentType);
						}
					});
		}
		populateSIProcessing('Q');
	}
}
function handleDrCrFlagPaymentInstrument(cfg) {
	var strCssClass = '';
	if ((strPaymentType === 'QUICKPAY' || strPaymentType === 'QUICKPAYSTI')
			|| (strPaymentType === 'BATCHPAY' &&( strLayoutType === 'TAXLAYOUT' || strLayoutType === 'WIRESWIFTLAYOUT' )))
		strCssClass = 'col-sm-12';
	if ('true' === cfg.readOnly && cfg.value) {
		var strDrCrLabel = !isEmpty(mapDrCrReadonlyLabel[strPaymentType][cfg.value][strLayoutType])
				? mapDrCrReadonlyLabel[strPaymentType][cfg.value][strLayoutType]
				: cfg.value === 'D' ? getLabel('debitTransaction', 'Debit') : getLabel('creditTransaction', 'Credit');
		$('#txnInfoLink').remove();
		var objTxnInfoLink = $('<div>').attr({
					'class' : strCssClass,
					'id' : 'txnInfoLink'
				});
		$('<div class="form-group"><label>'+ getLabel('transactionType', 'Transaction Type') +'</label><br><span>' + strDrCrLabel + '</span>')
				.appendTo(objTxnInfoLink);
		objTxnInfoLink.appendTo($('#drCrFlagDiv'));
		$("#drCrFlagDiv .col-sm-6, #drCrFlagDiv .radio-inline,#drCrFlagDiv .checkbox-inline, #drCrFlagDiv .checkboxLbl")
				.addClass('hidden');
				$('#drCrFlagDiv').removeClass('hidden');
	} else if (cfg.value) {
		$('#txnInfoLink').remove();
		var objTxnInfoLink1 = $('<div>').attr({
			'class' : strCssClass,
			'id' : 'txnInfoLink'
		});
		$('#drCrFlagDiv').removeClass('hidden');
		$('<div class="form-group"><label>'+ getLabel('transactionType', 'Transaction Type') +' : </label><br/><span> '
				+ '</span></div>').appendTo(objTxnInfoLink1);
		$('#drCrFlagDiv').prepend(objTxnInfoLink1);
	}
}
function handleDrCrFlagOnViewPaymentInstrument(cfg, strPostFix, strValue) {
	if (cfg && cfg.value && cfg.readOnly && 'true' === cfg.readOnly) {
		var strDrCrLabel = cfg.value!=='B' && !isEmpty(mapDrCrReadonlyLabel[strPaymentType][cfg.value][strLayoutType])
				? mapDrCrReadonlyLabel[strPaymentType][cfg.value][strLayoutType]
				: cfg.value === 'D' ? getLabel('debitTransaction', 'Debit') : getLabel('creditTransaction', 'Credit');
		if ('D' === cfg.value) {
			$('.drCrFlagD' + strPostFix).empty();
			$('.drCrFlagC' + strPostFix).remove();
			//$('.drCrFlagD' + strPostFix).removeClass('col-sm-6');
			//$('.drCrFlagD' + strPostFix).addClass('col-sm-12');
			$('.drCrFlagD' + strPostFix).removeClass('hidden');
			$('<div class="form-group"><label>'+ getLabel('transactionType', 'Transaction Type') +' : </label><br/><span> '
					+ strDrCrLabel + '</span></div>').appendTo($('.drCrFlagD'
					+ strPostFix));
		} else if ('C' === cfg.value) {
			$('.drCrFlagC' + strPostFix).empty();
			$('.drCrFlagD' + strPostFix).remove();
			//$('.drCrFlagC' + strPostFix).removeClass('col-sm-6');
			//$('.drCrFlagC' + strPostFix).addClass('col-sm-12');
			$('.drCrFlagC' + strPostFix).removeClass('hidden');
			$('<div class="form-group"><label>'+ getLabel('transactionType', 'Transaction Type') +' : </label><br/><span> '
					+ strDrCrLabel + '</span></div>').appendTo($('.drCrFlagC'
					+ strPostFix));
		} else if ('B' === cfg.value) {
			$('.drCrFlagC' + strPostFix).removeClass('hidden');
			$('.drCrFlagD' + strPostFix).removeClass('hidden');
		}

	} else {
		if (cfg.value && 'B' !== cfg.value) {
			$('.drCrFlagD' + strPostFix).addClass('hidden');
			$('.drCrFlagC' + strPostFix).addClass('hidden');
		}
		if (strValue === 'Debit')
			$('.drCrFlagD' + strPostFix).removeClass('hidden');
		if (strValue === 'Credit')
			$('.drCrFlagC' + strPostFix).removeClass('hidden');
	}
	$('.drCrFlag' + strPostFix).text('(' + strValue + ')');
	if (strLayoutType === 'ACCTRFLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT')
		toggleAccountTransferAccountLabel(cfg.value);
}
function fetchClientAccountData(strDrawerAccountNo) {
	var jsonData = null;
	$.ajax({
				async : false,
				url : "services/userseek/clientAccountSeek.json",
				dataType : "json",
				data : {
					$autofilter : strDrawerAccountNo
				},
				success : function(data) {
					jsonData = data.d.preferences[0];
				}
			});
	return jsonData;
}
function handleDrawerAccountInfoPopulation(strDrawerAccountNo) {
	var drawerAccountData = fetchClientAccountData(strDrawerAccountNo);
	displayFiInfoForRecevingAccount(drawerAccountData, true);
}
function handleAccountNoRefreshLink(cfg) {
	if (cfg && cfg.values && cfg.values.length > 1) {
		$('.accountNoBalanceRefreshLink, .accountNoBalanceInfoSpan')
				.addClass('hidden');
		$('.accountNoLinkLabel').removeClass('hidden');
	} else if (cfg && cfg.values && cfg.values.length == 1) {
		var ctrl = $('.accountNoBalanceRefreshLink');
		if (ctrl) {
			ctrl.unbind('click');
			ctrl.bind('click', function() {
				if (strPaymentType === 'BATCHPAY' && !isEmpty(cfg.values[0]))
					paintPaymentAccountBalance(cfg.values[0],
							strPaymentHeaderIde, true);
				if (strPaymentType === 'QUICKPAY' && !isEmpty(cfg.values[0]))
					paintPaymentAccountBalance(cfg.values[0],
							strPaymentInstrumentIde, true);
				if (strPaymentType === 'QUICKPAYSTI' && !isEmpty(cfg.values[0]))
					paintPaymentAccountBalance(cfg.values[0],
							strPaymentInstrumentIde, true);
			});
			if (strPaymentType === 'BATCHPAY' && !isEmpty(cfg.values[0]))
				paintPaymentAccountBalance(cfg.values[0], strPaymentHeaderIde);
			if (strPaymentType === 'QUICKPAY' && !isEmpty(cfg.values[0]))
				paintPaymentAccountBalance(cfg.values[0],
						strPaymentInstrumentIde);
			if (strPaymentType === 'QUICKPAYSTI' && !isEmpty(cfg.values[0]))
				paintPaymentAccountBalance(cfg.values[0],
						strPaymentInstrumentIde);
			$('.accountNoLinkLabel').addClass('hidden');
			$('.accountNoBalanceRefreshLink').removeClass('hidden');
		}
	} else if (cfg && cfg.value) {
		var ctrl = $('.accountNoBalanceRefreshLink');
		if (ctrl) {
			ctrl.unbind('click');
			ctrl.bind('click', function() {
						if (strPaymentType === 'BATCHPAY'
								&& !isEmpty(cfg.value))
							paintPaymentAccountBalance(cfg.value,
									strPaymentHeaderIde, true);
						if (strPaymentType === 'QUICKPAY'
								&& !isEmpty(cfg.value))
							paintPaymentAccountBalance(cfg.value,
									strPaymentInstrumentIde, true);
						if (strPaymentType === 'QUICKPAYSTI'
								&& !isEmpty(cfg.value))
							paintPaymentAccountBalance(cfg.value,
									strPaymentInstrumentIde, true);
					});
			if (strPaymentType === 'BATCHPAY' && !isEmpty(cfg.value))
				paintPaymentAccountBalance(cfg.value, strPaymentHeaderIde);
			if (strPaymentType === 'QUICKPAY' && !isEmpty(cfg.value))
				paintPaymentAccountBalance(cfg.value, strPaymentInstrumentIde);
			if (strPaymentType === 'QUICKPAYSTI' && !isEmpty(cfg.value))
				paintPaymentAccountBalance(cfg.value, strPaymentInstrumentIde);
			//$('.accountNoLinkLabel').addClass('hidden');
			$('.accountNoBalanceRefreshLink').removeClass('hidden');
		}
	}
}
function getPaymentAccountBalance(strAccountNo, strIdentifier) {
	var jsonData = null;
	if (!isEmpty(strIdentifier)) {
		$.ajax({
					type : "POST",
					url : 'services/getBalance/('+ strAccountNo + ').json',
					async : false,
					data : {
						'$id' : strIdentifier
					},
					complete : function(XMLHttpRequest, textStatus) {
						// $.unblockUI();
						// if ("error" == textStatus)
						// alert("Unable to complete your request!");
					},
					success : function(data) {
						if (data && data.d && data.d.SUCCESS
								&& data.d.SUCCESS === 'SUCCESS') {
							jsonData = setDigitAmtGroupFormat(data.d.value);
							if(!Ext.isEmpty(data.d.hostCcy)) 
								jsonData = data.d.hostCcy + " " + jsonData;
						}
					}
				});
		return jsonData;
	}
}

function paintPaymentAccountBalance(strAccountNo, strIdentifier, isRefresh) {
    // explicitly return  - FTMNTBANK-4080
    //if(true) return;
    /*var spanClass = 'accountNoBalanceInfoSpan';
    if (isEmpty(strAccountBalanceData) || isRefresh)
          strAccountBalanceData = getPaymentAccountBalance(strAccountNo,
                        strIdentifier);*/
    if(isBalanceVisible == 'Y')
    {
          strAccountBalanceData = getPaymentAccountBalance(strAccountNo,
                        strIdentifier);
          
          if ($(".accountNoBalanceInfoSpan").hasClass('hidden'))
                 $(".accountNoBalanceInfoSpan").removeClass('hidden');
          $(".accountNoBalanceInfoSpan").html('Balance : ' + strAccountBalanceData);          
    }
}
/**
 * To be shown for Template and Payment using Template if checked
 */
function handleHoldZeroDollarFlag(strPmtType, isPaymentUsingTemplate) {
	var fieldDiv = strPmtType === 'B' ? 'holdHdrDiv' : 'holdDiv';
	if (!isEmpty(strPmtType)) {
		if (strPmtType === 'Q')
			var chrHoldZeroDollar = $('input[name="hold"]:checkbox:checked')
					.val()
		if (isPaymentUsingTemplate
				&& ((isEmpty(chrHoldZeroDollar) || chrHoldZeroDollar === 'N')
				|| (chrHoldZeroDollar === 'Y' && isEmpty(strPaymentInstrumentIde)))) {
			var ctrlDiv = $('#' + fieldDiv);
			if (ctrlDiv)
				$(ctrlDiv).addClass('hidden');
		} else if (!isPaymentUsingTemplate) {
			var ctrlDiv = $('#' + fieldDiv);
			if (ctrlDiv)
				$(ctrlDiv).empty();
		} else if (strPmtType === 'B') {
			var ctrlDiv = $('#' + fieldDiv);
			if (ctrlDiv)
				$(ctrlDiv).empty();
		}
	}
}
/**
 * To be shown for Template and Payment using Template if checked
 */
function handleHoldUntilFlag(strPmtType) {
	var fieldDiv = strPmtType === 'B'
			? 'holdUntilFlagHdrDiv'
			: 'holdUntilFlagDiv';
	var ctrlDiv = $('#' + fieldDiv);
	if (ctrlDiv)
		$(ctrlDiv).empty();
}
function handleDebitLevelAtInstrumentFields(chrDebitAccountLevel,
		chrValueDateLevel, chrProductLevel, strPmtType) {
	var strPostFix = strPmtType === 'B' ? 'HdrDiv' : 'Div';
	var strViewPostFix = strPmtType === 'B' ? '' : '_InstViewDiv'; //Only for Instrument
	if (strEntryType === 'PAYMENT' || strEntryType === 'SI') {
		if (chrDebitAccountLevel === 'B' && strPmtType === 'Q') {
			$('#accountNo' + strPostFix).addClass('hidden');
			$('#ibanNo' + strPostFix).addClass('hidden');
			$('#companyId' + strPostFix).addClass('hidden');
			$('.accountNo'+strViewPostFix+',companyId'+strViewPostFix+',.ibanNo'+strViewPostFix).addClass('hidden');
		}
		if (chrDebitAccountLevel === 'I') {
			$('#accountNo').bind("click", function() {
						handleDebitAccountChange(false);
					});
			if (!isEmpty($('#accountNo').val()))
				$('#accountNo').trigger('click');
		}
		if (chrValueDateLevel === 'B' && strPmtType === 'Q'){
			$('#txnDate' + strPostFix+ ',.txnDate'+strViewPostFix).addClass('hidden');
			$('#activationTime').addClass('hidden');
		}

	} else {
		if (chrDebitAccountLevel === 'B' && strPmtType === 'Q') {
			$('#accountNo' + strPostFix).addClass('hidden');
			$('#ibanNo' + strPostFix).addClass('hidden');
			$('#companyId' + strPostFix).addClass('hidden');
			$('.accountNo'+strViewPostFix+',companyId'+strViewPostFix+',.ibanNo'+strViewPostFix).addClass('hidden');
		}
		if (chrValueDateLevel === 'B' && strPmtType === 'Q'){
			$('#txnDate' + strPostFix).addClass('hidden');
			$('#txnDate' + strViewPostFix).addClass('hidden');
			$('#activationTime').addClass('hidden');
		}
		//else if(chrValueDateLevel ==='I')
		//	$('#txnDate'+postFix).removeClass('hidden');

	}
	//if(chrDebitAccountLevel ==='I' || chrValueDateLevel==='I')
	//	$('.batchHeaderSectionLbl').text('Sender Details');
	if (chrProductLevel && chrProductLevel === 'I' && strPaymentType
			&& strPaymentType === 'BATCHPAY' && strPaymentHeaderIde
			&& !isEmpty(strPaymentHeaderIde)) {
		$('#txnCurrencyHdr').attr('disabled', 'disabled');

	}
}
function paintChangedFxDetails(data, strClassName) {
	var objOnHoverInfo = [];
	if (data.d.changedFxRate) {
		var objInfo = new Object();
		objInfo['label'] = getLabel('lblChangedFxRate', "Original FX Rate");
		objInfo['value'] = data.d.changedFxRate;
		objOnHoverInfo.push(objInfo);
	}
	if (data.d.changedPaymentAmount) {
		var objInfo = new Object();
		objInfo['label'] = getLabel('lblChangedPaymentAmnt',
				"Original Payment Amount");
		objInfo['value'] = data.d.changedPaymentAmount;
		objOnHoverInfo.push(objInfo);
	}
	if (data.d.changedDebitAmount) {
		var objInfo = new Object();
		objInfo['label'] = getLabel('lblChangedDebitAmnt',
				"Original Debit Amount");
		objInfo['value'] = data.d.changedDebitAmount;
		objOnHoverInfo.push(objInfo);
	}
	if (objOnHoverInfo && objOnHoverInfo.length > 0)
		paintChangedFxDetailsOnHover(objOnHoverInfo, strClassName);
}
function paintChangedFxDetailsOnHover(data, strClassName) {
	
	var strHtml = $('<div id="changedFxDetails">');
	if (data) {
		$.each(data, function(index, objInfo) {
					if (objInfo) {
						// var strClassName = objInfo.colSize ?
						// 'col-sm-'+objInfo.colSize : 'col-sm-6';
						var strLabel = objInfo.label ? objInfo.label : '';
						var strValue = objInfo.value ? objInfo.value : '';
						// var blnOnSameRow = objInfo.onSameRow
						var objInfoDiv = $('<div>').attr('class', 'row');
						var objColumnDiv = $('<div>')
								.attr('class', 'col-sm-12');
						var objInternalDiv = $('<div>').attr('class',
								'form-group');
						var objLabel = $('<label>').text(strLabel + ' :');
						var objValue = $('<span>').text(' ' +strValue);
						$(objLabel).appendTo($(objInternalDiv));
						$(objValue).appendTo($(objInternalDiv));
						$(objInternalDiv).appendTo($(objColumnDiv));
						$(objColumnDiv).appendTo($(objInfoDiv));
						$(objInfoDiv).appendTo($(strHtml));
					}
				});
	}

	$('.' + strClassName).bind('mouseover', function(e) {
				$(strHtml).css({
							'position' : 'absolute',
							'border' : '1px solid #868686',
							'min-height' : '37px',
							'overflow' : 'auto',
							'min-width' : '250px',
							'z-index' : '1000',
							'padding' : '6px 12px 0 12px',
							'color' : '#333333',
							'background-color' : '#F1F1F1',
							'width' : 'auto'
						}).appendTo($('.' + strClassName));
			});

	$('.' + strClassName).bind('mouseout', function(e) {
				$('#changedFxDetails').remove();
			});
}
function pushReceiverFieldsIntoArray(mapCtrlFields, objData, blnIsSelected,blnDefaultSelected) {
	var data = objData, arrRcvrFlds = {}, fieldId = '';
	var chrBeneType = strReceiverType && strReceiverType === 'A' ? 'A' : 'R';
	if (data && data.d && data.d.paymentEntry
			&& data.d.paymentEntry.beneficiary)
		arrRcvrFlds = data.d.paymentEntry.beneficiary;

	if (arrRcvrFlds) {
		if ("R" === chrBeneType && arrRcvrFlds.registeredBene) {
			if (arrRcvrFlds.registeredBene
					&& arrRcvrFlds.registeredBene.length > 0) {
				$.each(arrRcvrFlds.registeredBene, function(index, cfg) {
					fieldId = cfg.fieldName;
					if (fieldId === 'drawerCode'
							|| fieldId === 'drawerDescription') {
						mapCtrlFields[fieldId] = {};
						mapCtrlFields[fieldId]['isSelected'] = blnIsSelected;
						mapCtrlFields[fieldId]['isRequiredDefault'] = (cfg.displayMode === '3' && blnDefaultSelected==true || false);
					}
				});
			}
		}
		if ("A" === chrBeneType && arrRcvrFlds.adhocBene) {
			if (arrRcvrFlds.adhocBene && arrRcvrFlds.adhocBene.length > 0) {
				$.each(arrRcvrFlds.adhocBene, function(index, cfg) {
					fieldId = cfg.fieldName;
					if (fieldId === 'drawerCode'
							|| fieldId === 'drawerDescription'
							|| fieldId === 'drawerAccountNo'
							|| fieldId === 'beneficiaryBankIDType'
							|| fieldId === 'beneAccountType'
							|| ((strLayoutType === 'ACHLAYOUT'
									|| strLayoutType === 'ACHIATLAYOUT' || strLayoutType === 'MIXEDLAYOUT') && (fieldId === 'receiverID' || fieldId === 'beneficiaryBankIDCode'))) {
						mapCtrlFields[fieldId] = {};
						mapCtrlFields[fieldId]['isSelected'] = blnIsSelected;
						mapCtrlFields[fieldId]['isRequiredDefault'] = (blnDefaultSelected==true && (cfg.displayMode === '3' || false));
					}
				});
			}
		}
	}
}
function isPrenoteChecked(chrPayType) {
	var strPostFix = strPaymentType === "BATCHPAY" ? 'Hdr' : '';
	var blnPrenoteChecked = $('input[name="prenote"]').is(':checked');
	return blnPrenoteChecked
}
function getMapCtrlKeyName(key) {
	var strPostFix = strReceiverType && strReceiverType === 'A' ? 'A' : 'R';
	switch (key) {
		case 'drawerCode' :
			key = '';
			break;
		case 'drawerDescription' :
		case 'drawerAccountNo' :
		case 'beneficiaryBankIDType' :
		case 'beneAccountType' :
		case 'receiverID' : 
			key = key + strPostFix;
			break;
		case 'beneficiaryBankIDCode' :
			key = 'beneficiaryBankIDCodeAutoCompleter';
			break;
	}
	return key;
}
function handleReceiverFieldsOnPrenoteChange() {
	applyControlFieldsValidation(strPaymentType, isPrenoteChecked());
}
function toggleSwiftSectionVisibility(strPostFix) {
	var arrFields = ['remittanceInfo2', 'remittanceInfo3', 'remittanceInfo4',
			'regulatoryReporting2', 'regulatoryReporting3', 'swiftInfoCode3','swiftInfoCode4',
			'swiftInfoCode5', 'swiftInfoCode6', 'swiftInstructionField3',
			'swiftInstructionField4', 'swiftInstructionField5',
			'swiftInstructionField6'];
	$.each(arrFields, function(index) {
				var strFieldId = arrFields[index];
				if (!isSwiftParentSectionVisible(strFieldId,strPostFix))
					$('.' + strFieldId + strPostFix + 'Div').addClass('hidden');
			});
			
}
function isSwiftParentSectionVisible(id, strPostFix) {
	var countOfTotalFields = $('.' + id + strPostFix + 'Div .isEmpty').length;
	var countOfEmptyFields = 0;
	var arrFields = $('.' + id + strPostFix + 'Div .isEmpty');
	$.each(arrFields, function(index) {
				var objField = arrFields[index];
				var strFieldValue = $(objField).text();
				if (isEmpty(strFieldValue) || isEmpty(jQuery.trim(strFieldValue)))
					countOfEmptyFields++;
			});
	if (countOfTotalFields === countOfEmptyFields)
		return false;
	return true;
}
/*---------- Helper Function Ends --------------------*/

/*---------- Registered Receiver More Details Starts --------------------*/
function toggleRegisteredReceiverMoreDetails(strBeneCode) {
	var ctrl = $('#regReceiverMoreDetailsLink')
	ctrl.unbind('click');
	ctrl.bind('click', function() {
				var ctrl = $('.registeredReceiverdetails')
				var isHidden = ctrl.hasClass('hidden');
				//var receiverDetails = getRegisteredReceiverMoreDetails(strBeneCode);
				if (isHidden) {
					//doClearMoreDetailsForRegisteredReceiver();
					$("#plusIconR").removeClass('fa-plus');
					$("#plusIconR").addClass('fa-minus');
					//$("#regReceiverMoreDetailsLink").text("Contact Info");
				} else {
					//$("#regReceiverMoreDetailsLink").text("Contact Info");
					$("#plusIconR").removeClass('fa-minus');
					$("#plusIconR").addClass('fa-plus');
				}
				//if (receiverDetails)
				//	$.each(receiverDetails, function(index, value) {
//								var divId = index + "_RInfoDiv";
//								var fieldId = index + "_RInfoLbl";
//								if ($("#" + fieldId).length != 0) {
//									// TODO : Hiding divs which are not present
//									// Division into Sections
//									// $("#" + divId).removeClass("hidden");
//									$("#" + fieldId).text(value);
//								}
//							});
				ctrl.toggleClass('hidden');
			});
}

function getRegisteredReceiverMoreDetails(strBeneCode) {
	var receiverDetails = null;
	$.ajax({
				type : "POST",
				url : "services/reciverdetailseek/" + strBeneCode + ".json",
				complete : function(XMLHttpRequest, textStatus) {
					if ("error" == textStatus) {
						var arrError = new Array();
						arrError.push({
									"errorCode" : "Message",
									"errorMessage" : mapLbl['unknownErr']
								});
						paintErrors(arrError);
					}
				},
				async : false,
				data : null,
				success : function(data) {
					receiverDetails = data;
				}
			});
	return receiverDetails;
}

function doClearMoreDetailsForRegisteredReceiver() {
	$('#registeredReceiverdetails').find('span').each(function() {
				$(this).val('');
			});
}
function toggleRegisteredReceiverInstViewMoreDetails(strBeneCode) {
	var ctrl = $('#registeredReceiverDetailsLinkInstView');
	if (ctrl) {
		ctrl.unbind('click');
		//$('.registeredReceiverDetailsInstView').addClass('hidden');
		ctrl.bind('click', function() {
			var ctrl1 = $('.registeredReceiverDetailsInstView')
			var isHidden = ctrl1.hasClass('hidden');
			if (isHidden) {
				// Data being painted with paymententry json
				//var receiverDetails = getRegisteredReceiverMoreDetails(strBeneCode);
				//if (receiverDetails)
				//	$.each(receiverDetails, function(key, value) {
				//				$("." + key + 'R_InstView').html(value);
				//			});
				/*$("#registeredReceiverDetailsLinkInstView")
						.text("Contact Info");*/
			} else {
				/*$("#registeredReceiverDetailsLinkInstView")
						.text("Contact Info");*/
			}
			ctrl1.toggleClass('hidden');
		});
	}
}

// TODO: To be implemented
function handleDrawerAccountNo() {
	var accNoVal = $('#drawerAccountNo').val();
	if (isEmpty(accNoVal)) {
		$('#receivingAccfiInfSpan').text('');
	}
}
/*---------- Registered Receiver More Details Ends --------------------*/

/*---------- Registered Odering Party More Details Starts --------------------*/
function toggleRegisteredOrderingPartyMoreDetails() {
	var ctrl = $('#registeredOrderingPartyDetails')
	ctrl.toggleClass('hidden');
}

function doPaintMoreDetailsForRegisteredOrderingParty(code, elementId,
		isViewMode) {
	var ctrl = $('#' + elementId);
	var isHidden = ctrl.hasClass('hidden');
	var divPostFix = isViewMode ? '_OVInfoDiv' : '_ORInfoDiv';
	var lblPostFix = isViewMode ? '_OVInfoLbl' : '_ORInfoLbl';
	var linkId = isViewMode
			? 'orderingPartyMoreDetailsViewOnlyLink'
			: 'orderingPartyMoreDetailsLink';
	togglePlusIcon(isHidden, code, linkId, divPostFix, lblPostFix, isViewMode);
	ctrl.toggleClass('hidden');
}
function togglePlusIcon(isHidden, code, linkId, divPostFix, lblPostFix,
		isViewMode) {
	if (isHidden) {
		doClearMoreDetailsForRegisteredOrderingParty();
		if (!isEmpty(code)) {
			var orderingPartyDetails = getRegisteredOrderingPartyDetails(code);
			var line4 = null;
			if(orderingPartyDetails && typeof orderingPartyDetails =='object'){
			$.each(orderingPartyDetails, function(index, value) {
						var divId = index + divPostFix;
						var fieldId = index + lblPostFix;
						if ($("#" + fieldId).length != 0) {
							$("#" + fieldId).text(value);
						}
					});		
			$("#line1" + lblPostFix).text(orderingPartyDetails.orderDescription);
			$("#line2" + lblPostFix).text(orderingPartyDetails.addr1.substring(0,35));
			$("#line3" + lblPostFix).text(orderingPartyDetails.addr1.substring(35,70));
			if (!isEmpty(orderingPartyDetails.benCountry))
				line4 = orderingPartyDetails.benCountry.substring(0,10);
			if (!isEmpty(orderingPartyDetails.benState)  && orderingPartyDetails.benState != 'NONE')
				line4 = line4 + orderingPartyDetails.benState.substring(0,10);
			if (!isEmpty(orderingPartyDetails.benCity))
				line4 = line4 + orderingPartyDetails.benCity.substring(0,10);
			if (!isEmpty(orderingPartyDetails.benPostCode))
				line4 = line4 + orderingPartyDetails.benPostCode;
			if (!isEmpty(line4))
				$("#line4" + lblPostFix).text(line4.substring(0,35)); 
			} else {
				var orderDescription = $("#orderingPartyDescription" + lblPostFix).text();
				var addr1 = $("#addr1" + lblPostFix).text();
				var benCountry = $("#benCountry" + lblPostFix).text();
				var benState = $("#benState" + lblPostFix).text();
				var benCity = $("#benCity" + lblPostFix).text();
				var benPostCode = $("#benPostCode" + lblPostFix).text();
				
				$("#line1" + lblPostFix).text(orderDescription);
				$("#line2" + lblPostFix).text(addr1.substring(0,35));
				$("#line3" + lblPostFix).text(addr1.substring(35,70));
				if (!isEmpty(benCountry))
					line4 = benCountry.substring(0,10);
				if (!isEmpty(benState)  && benState != 'NONE')
					line4 = line4 + benState.substring(0,10);
				if (!isEmpty(benCity))
					line4 = line4 + benCity.substring(0,10);
				if (!isEmpty(benPostCode))
					line4 = line4 + benPostCode;
				if (!isEmpty(line4))
					$("#line4" + lblPostFix).text(line4.substring(0,35)); 
			} 
		}
		//$("#" + linkId).text(getLabel('lessDetails', 'Contact Info'));
		if (isViewMode) {
			$("#plusIconOV").removeClass('fa-plus');
			$("#plusIconOV").addClass('fa-minus');
		} else {
			$("#plusIconA").removeClass('fa-plus');
			$("#plusIconA").addClass('fa-minus');
		}
	} else {
		//$("#" + linkId).text(getLabel('additionalDetails', 'Contact Info'));
		if (isViewMode) {
			$("#plusIconOV").removeClass('fa-minus');
			$("#plusIconOV").addClass('fa-plus');
		} else {
			$("#plusIconA").removeClass('fa-minus');
			$("#plusIconA").addClass('fa-plus');
		}
	}
}

function getRegisteredOrderingPartyDetails(code) {
	var orderingPartyDetails = null;
	$.ajax({
				type : "POST",
				url : "services/ordpartydetailseek/" + code + ".json",
				complete : function(XMLHttpRequest, textStatus) {
					if ("error" == textStatus) {
						arrError.push({
									"errorCode" : "Message",
									"errorMessage" : mapLbl['unknownErr']
								});
						paintErrors(arrError);
					}
				},
				async : false,
				data : null,
				success : function(data) {
					orderingPartyDetails = data;

				}
			});
	return orderingPartyDetails;
}

function doClearMoreDetailsForRegisteredOrderingParty() {
	$('#registeredOrderingPartyDetails').find('span').each(function() {
		$(this).val('');
		$(this).text('');
	});
	
	$('#emailIdNmbr_ORInfoDiv').find('span').each(function() {
		$(this).val('');
		$(this).text('');
	});
}

/*---------- Adhoc Ordering Party Details Starts -----------------------*/
function toggleOrderingParty(charOrderingPartyType, clearFields) {
	var clsHide = 'hidden';
	if (!isEmpty(charOrderingPartyType)) {
		if (charOrderingPartyType === 'A') {
			strOrderingPartyType = 'A';
			$('.adhocOrderingParty').removeClass(clsHide);
			$('.registeredOrderingParty').addClass(clsHide);
			// populateCountryValuesInDropdown('benCountry_OA');

			$('#benCountry_OA').unbind('change');
			// $('#benCountry_OA').bind('change', function() {
			// populateStateValuesInDropdown('benState_OA',
			// 'benCountry_OA');
			// });
		} else if (charOrderingPartyType === 'R') {
			strOrderingPartyType = 'R';
			$('.adhocOrderingParty').addClass(clsHide);
			$('.registeredOrderingParty').removeClass(clsHide);
		}
		clearOrderingParty(charOrderingPartyType, clearFields);
	}
}

function clearOrderingParty(charOrderingPartyType, clearFields) {
	if (clearFields === true) {
		if (charOrderingPartyType === 'B' || charOrderingPartyType === 'A')
			$('#orderingParty,#orderingPartyEmail_R').val('');
		if (charOrderingPartyType === 'B' || charOrderingPartyType === 'R') {
			$('#orderingPartyDescription_OA,#orderingParty_OA,#emailIdNmbr_OA,#benCountry_OA,#benState_OA,#benCity_OA,#benPostCode_OA')
					.val('');
		}
	}

}

function toggleOrderingPartyCodeNecessity() {
	var clsReq = 'required';
	if ($('#saveOrderingParty_OA').is(':checked')) {
		$('#orderingPartyDescription_OALbl,#orderingParty_OALbl,#benCountry_OALbl,#addr1_OALbl').addClass(clsReq);
		$('#saveOrderingParty_OA').val('Y');
		$('#orderingPartyDescription_OA,#orderingParty_OA,#benCountry_OA,#addr1_OA')
				.blur(function mark() {
							markRequired($(this));
						});
		$('#orderingPartyDescription_OA,#orderingParty_OA,#benCountry_OA,#addr1_OA')
				.focus(function() {
							removeMarkRequired($(this));
						});
		strOrderingPartyType = "S";
	} else {
		$('#orderingPartyDescription_OALbl,#orderingParty_OALbl,#benCountry_OALbl,#addr1_OALbl').removeClass(clsReq);
		$('#orderingPartyDescription_OA,#orderingParty_OA,#benCountry_OA,#addr1_OA').removeClass('requiredField');
		$('#orderingPartyDescription_OA,#orderingParty_OA,#benCountry_OA,#addr1_OA').unbind('blur');
		$('#orderingPartyDescription_OA,#orderingParty_OA,#benCountry_OA,#addr1_OA').unbind('focus');
		$('#saveOrderingParty_OA').val('N');
		strOrderingPartyType = "A";
		//$('#orderingPartyDescriptionAOP').unbind('blur');
		//$('#orderingPartyDescriptionAOP').removeClass('requiredField');
	}
}
// TODO : Population of Tag 50a fields,to be verified
function refreshSwiftMsg() {
	var modelOrderCode = $("#orderingParty_OA").val();
		var orderCode = document.getElementById("orderingPartyDescription_OA");
		var add1 = document.getElementById("addr1_OA");
		var benCountry = document.getElementById("benCountry_OA");
		var benState = document.getElementById("benState_OA");
		var benCity = document.getElementById("benCity_OA");
		var benPostCode = document.getElementById("benPostCode_OA");
		var line4;
		if (orderCode != null)
			$("#line1_OA").val(orderCode.value);
		else
			$("#line1_OA").val(modelOrderCode);
		if (add1 != null) {
			$("#line2_OA").val(add1.value.substring(0,
					35));
			$("#line3_OA").val(add1.value.substring(
					35, 70));
		}
		if (benCountry != null)
			line4 = benCountry.value.substring(0, 10);
		if (benState != null && benState.value != 'NONE')
			line4 = line4 + benState.value.substring(0, 10);
		if (benCity != null)
			line4 = line4 + benCity.value.substring(0, 10);
		if (benPostCode != null)
			line4 = line4 + benPostCode.value.substring(0, 6);
		if (line4 != null)
			$("#line4_OA").val(line4.substring(0, 35));
}
function ordPartyAddressEnforce(val)
{
	if(!Ext.isEmpty(val))
	{
		$('#addr1_OA').addClass('requiredField');
		 
	}
	else
	{
		$('#addr1_OA').removeClass('requiredField');
	}
}

function dovalidateCountry()
{
		var benCountry = document.getElementById("benCountry_OA");
		var benState = document.getElementById("benState_OA");
		if(($("#benCountry_OA").val().length > 10)) {
							var arrError = [];
						arrError.push({
									"errorCode" : "ERR",
									"errorMessage" :  Ext.String
									.format(
											'Please select proper Country Code' )
								});
						paintErrors(arrError);
		}
		else if (($("#benState_OA").val().length > 10)) {
			var arrError = [];
			arrError.push({
						"errorCode" : "ERR",
						"errorMessage" :  Ext.String
						.format(
								'Please select proper State Code' )
					});
			paintErrors(arrError);
		}
}

/*---------- Adhoc Ordering Party Details Ends ------------------------*/

/*---------- Single Instruments Handling Starts Here-------------------*/
function loadPaymentInstrument(strMyProduct) {
	var _intCountBankProduct = 1,objData = '';
	if (!isEmpty(strMyProduct)) {
		var url = _mapUrl['loadInstrumentFieldsUrl'] + "/" + strMyProduct
				+ ".json";
		if(strLayoutType === 'BILLPAYLAYOUT'){
			url = _mapUrl['loadInstrumentFieldsUrl'] + "/billPay/" + strMyProduct + "/" + strSelectedReceiver
			+ ".json";
			objData = strSelectedBills;
		}
		$.ajax({
			type : "POST",
			url : url,
			async : false,
			contentType : "application/json",
			data : objData,
			complete : function(XMLHttpRequest, textStatus) {
				if ("error" == textStatus) {
					var arrError = new Array();
					arrError.push({
								"errorCode" : "Message",
								"errorMessage" : mapLbl['unknownErr']
							});
					doHandleUnknownError()
					blockPaymentInstrumentUI(false);
				}
			},
			success : function(data) {
				if (data != null) {
					if (data.d
							&& data.d.message
							&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
						doHandleEmptyScreenErrorForInstrument(data.d.message.errors);
						blockPaymentInstrumentUI(false);
					}
					else if (data.d
								&& data.d.paymentEntry.message
								&& (data.d.paymentEntry.message.errors || data.d.paymentEntry.message.success === 'FAILED')) {
							doHandleEmptyScreenErrorForInstrument(data.d.paymentEntry.message.errors);
							blockPaymentInstrumentUI(false);
					}
					else {
						// Checks for Bank Product, if single bank product is
						// found, then fetches product and receiver specific
						// data
						paymentResponseInstrumentData = data;
						if ('B' === strPayUsing && data.d
								&& data.d.paymentEntry
								&& data.d.paymentEntry.standardField && strLayoutType !== 'BILLPAYLAYOUT')
						{
							var arrFields = [];
							var _strBankProduct = null;
							arrFields = data.d.paymentEntry.standardField;
							if (arrFields && arrFields.length > 0) {
								$.each(arrFields, function(index, cfg) {
									if ('bankProduct' === cfg.fieldName) {
										_intCountBankProduct = cfg.availableValues
												? cfg.availableValues.length
												: 0;
										if (_intCountBankProduct == 1)
											_strBankProduct = cfg.value;
									}
								});
							}
							if (!isEmpty(_strBankProduct)) {
								refreshPaymentFieldsOnBeneChange(strMyProduct,
										_strBankProduct, strSelectedReceiver);
							} else {
								doRemoveStaticText("transactionWizardPopup");
								paintPaymentInstrumentUI(data, 'Q');
								initateValidation();
								blockPaymentInstrumentUI(false);
								handleEmptyEnrichmentDivs();
								if (data.d
										&& data.d.paymentEntry
										&& data.d.paymentEntry.message
										&& (data.d.paymentEntry.message.errors || data.d.paymentEntry.message.success === 'FAILED')) {
									paintErrors(data.d.paymentEntry.message.errors);
								}
							}
						paintPaymentInstrumentActions('ADD');
						}
						else {
							doRemoveStaticText("transactionWizardPopup");
							paintPaymentInstrumentUI(data, 'Q');
							initateValidation();
							blockPaymentInstrumentUI(false);
							handleEmptyEnrichmentDivs();
							paintPaymentInstrumentActions('ADD');
							if (data.d
									&& data.d.paymentEntry
									&& data.d.paymentEntry.message
									&& (data.d.paymentEntry.message.errors || data.d.paymentEntry.message.success === 'FAILED')) {
								paintErrors(data.d.paymentEntry.message.errors);
							}
						}
						populateApiEnrichmentType(data);
					}
				}
			}
		});
	} else {
		doHandleUnknownError();
		blockPaymentInstrumentUI(false);
	}
}
function readPaymentInstrumentForEdit(strIde, strPhdNumber, strAction) {
	if (strIde) {
		var url = _mapUrl['readSavedBatchInstrumentUrl'] + "/id.json";		
		$.ajax({
			type : "POST",
			url : url,			
			async : false,
			data : {
				'$id' : strIde,
				'_mode' : 'EDIT'
				},
			complete : function(XMLHttpRequest, textStatus) {
				if ("error" == textStatus) {
					doHandleUnknownError();
					blockPaymentInstrumentUI(false);
				}
			},
			success : function(data) {
				if (data != null) {
					if (data.d
							&& data.d.message
							&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
						doHandleEmptyScreenErrorForInstrument(data.d.message.errors);
						blockPaymentInstrumentUI(false);
					} else {
						paymentResponseInstrumentData = data;
				   if (paymentResponseInstrumentData
				      && paymentResponseInstrumentData.d
				      && paymentResponseInstrumentData.d.paymentEntry
				      && paymentResponseInstrumentData.d.paymentEntry.paymentHeaderInfo
				      && paymentResponseInstrumentData.d.paymentEntry.paymentHeaderInfo.hdrIdentifier) {
			            var strIdentifier = paymentResponseInstrumentData.d.paymentEntry.paymentHeaderInfo.hdrIdentifier;
			            paintPaymentInformation('', strIdentifier, 'Q', false, '');
			       }
						doRemoveStaticText("transactionWizardPopup");
						paintPaymentInstrumentUI(data, 'Q');
						if(strEntryType == 'TEMPLATE')
						{
							paintTemplateInstrumentActions('EDIT');
						}
						else
						{
						paintPaymentInstrumentActions('EDIT');
						}
						initateValidation();
						if (data.d
								&& data.d.paymentEntry
								&& data.d.paymentEntry.message
								&& (data.d.paymentEntry.message.errors || data.d.paymentEntry.message.success === 'SAVEWITHERROR')) {
							paintErrors(data.d.paymentEntry.message.errors);
						}
						// Paint CashIn Errors
						if (data.d && data.d.paymentEntry
								&& data.d.paymentEntry.adminMessage
								&& data.d.paymentEntry.adminMessage.errors) {
							paintCashInErrors(data.d.adminMessage.errors)
						}
						blockPaymentInstrumentUI(false);
						handleEmptyEnrichmentDivs();
						populateApiEnrichmentType(data);
						if(isEmpty(strOldAnyIdFalg))
						{
							strOldAnyIdFalg = data.d.paymentEntry.paymentMetaData.anyIdPaymentFlag;
						}
					}
				}
			}
		});
	} else {
		doHandleUnknownError();
		blockPaymentInstrumentUI(false);
	}
}
function readPaymentInstrumentForView(strIde, strPhdNumber, strAction) {
	if (strIde) {
		var url = _mapUrl['readSavedBatchInstrumentUrl'] + "/id.json";
		$.ajax({
			type : "POST",
			url : url,
			async : false,
			data : {
				'$id' : strIde,
				'_mode' : 'VIEW'
			},
			complete : function(XMLHttpRequest, textStatus) {
				if ("error" == textStatus) {
					var arrError = new Array();
					arrError.push({
								"errorCode" : "Message",
								"errorMessage" : mapLbl['unknownErr']
							});
					doHandleUnknownError();
					blockPaymentInstrumentUI(false);
				}
			},
			success : function(data) {
				if (data != null) {
					if (data.d
							&& data.d.message
							&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
						doHandleEmptyScreenErrorForInstrument(data.d.message.errors);
						blockPaymentInstrumentUI(false);
					} else {
						paymentResponseInstrumentData = data;
						if (data.d && data.d.__metadata
								&& data.d.__metadata._detailId) {
							strPaymentInstrumentIde = data.d.__metadata._detailId;
						}
						doViewPaymentInstrument();

						if (strEntityType == data.d.paymentEntry.paymentHeaderInfo.hdrModule  && canEdit == 'true'
								&& (strActionStatus === 'Draft' 
										|| strActionStatus === 'Pending Submit' || strActionStatus === 'Modification Pending For Submit')) {
							paintPaymentInstrumentActionsForView('SUBMIT');

							toggleBreadCrumbs('tab_3');
						} else {
							//TODO : This is to handled through data.d.paymentEntry.paymentHeaderInfo.hdrActionsMask
							if (strEntityType == data.d.paymentEntry.paymentHeaderInfo.hdrModule && canEdit == 'true'
									&& data.d.paymentEntry.paymentHeaderInfo.hdrActionStatus  ) {
								var hdrActionState = data.d.paymentEntry.paymentHeaderInfo.hdrActionStatus;
								if (hdrActionState == '0'
										|| hdrActionState == '101'
										|| hdrActionState == '2'
										|| (hdrActionState == '4' &&  data.d.paymentEntry.paymentHeaderInfo.pirMode == 'TP')
										|| hdrActionState == '5')
									paintPaymentInstrumentActionsForView('CANCELANDDISCARD');
								else if (hdrActionState == '33' || (hdrActionState == '4' &&  data.d.paymentEntry.paymentHeaderInfo.pirMode == 'SI'))
									paintPaymentInstrumentActionsForView('CANCELDISABLE');
								else if (hdrActionState == '82')
									paintPaymentInstrumentActionsForView('CANCELENABLE');
								else if (hdrActionState == '83'
										|| hdrActionState == '87'
										|| hdrActionState == '86'
										|| hdrActionState == '94'
										|| hdrActionState == '95'
										|| hdrActionState == '79'
										|| hdrActionState == '80'
										|| hdrActionState == '73'
										|| hdrActionState == '9')//pendingRepair
									paintPaymentInstrumentActionsForView('CANCELANDDISCARD');
								else
									paintPaymentInstrumentActionsForView('CANCELONLY');
							} else
								paintPaymentInstrumentActionsForView('CANCELONLY');
							toggleBreadCrumbs('tab_3');

							if (data.d.paymentEntry.paymentHeaderInfo.hdrActionsMask) {
								var strAuthLevel = data.d.paymentEntry.paymentHeaderInfo.authLevel;
								var strDetailId = data.d.__metadata._detailId;
								var strParentId = data.d.paymentEntry.paymentHeaderInfo.hdrIdentifier;
								var isReKeyApplicable = data.d.paymentEntry.paymentHeaderInfo.recKeyValidation;
								paintPaymentInstrumentGroupActions(
										data.d.paymentEntry.paymentHeaderInfo.hdrActionsMask,
										'VIEW', strAuthLevel, strParentId,
										strDetailId, data.d.paymentEntry.paymentHeaderInfo.showPaymentAdvice,isReKeyApplicable);
							}
						}
						if (data.d
								&& data.d.paymentEntry
								&& data.d.paymentEntry.message
								&& (data.d.paymentEntry.message.errors || data.d.paymentEntry.message.success === 'SAVEWITHERROR')) {
							paintErrors(data.d.paymentEntry.message.errors);
						}
						// Paint CashIn Errors
						if (data.d && data.d.paymentEntry
								&& data.d.paymentEntry.adminMessage
								&& data.d.paymentEntry.adminMessage.errors) {
							paintCashInErrors(data.d.adminMessage.errors)
						}
						blockPaymentInstrumentUI(false);
					}
				}
			}
		});
	} else {
		doHandleUnknownError();
		blockPaymentInstrumentUI(false);
	}
}
function createPaymentUsingTemplate(strIdentifier) {
	// blockPaymentUI(true);
	if (!isEmpty(strIdentifier)) {
		var url = _mapUrl['createInstrumentUsingTemplateUrl'] + ".json?"+ csrfTokenName + "=" + csrfTokenValue;
		$.ajax({
			type : "POST",
			url : url,
			data:{'id': strIdentifier }, 
			async : false,
			complete : function(XMLHttpRequest, textStatus) {
				if ("error" == textStatus) {
					// TODO : Error handling to be done.
					// alert("Unable to complete your request!");
					doHandleUnknownError();
					blockPaymentInstrumentUI(false);
				}
			},
			success : function(data) {
				if (data != null) {
					if (data.d
							&& data.d.message
							&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
						doHandleEmptyScreenErrorForInstrument(data.d.message.errors);
						if(data)
							fnChkRecValRes(data);	// Added for Receiver Validation. Used in ECO Bank. Good to have feature in product.
						blockPaymentInstrumentUI(false);

					} else {

						fnChkRecValRes(data);	// Added for Receiver Validation. Used in ECO Bank. Good to have feature in product.
						
						var jsonArgs = {
							action : 'SAVE'
						};
						strMyProduct = data.d.__metadata._myproduct;
						paymentResponseInstrumentData = data;
						// savePaymentResponseData = data;
						paintPaymentInstrumentUI(data, 'Q');
						$("#drawerDescriptionR").ReceiverAutoComplete(
								strMyProduct, null, 'Q', true);
						$('#orderingPartyDescription')
								.OrderingPartyAutoComplete(strMyProduct, true);
						$("#drawerDescriptionA").ReceiverAutoComplete(strMyProduct,null,'Q',false);
       					$("#drawerDescriptionR").ReceiverAutoComplete(strMyProduct,null,'Q',true);
       					initateValidation();
						// toggleDirtyBit(true);
						postHandleSavePaymentInstrument(data, jsonArgs);
						paintPaymentInstrumentActions('EDIT');
						if (data.d
								&& data.d.paymentEntry
								&& data.d.paymentEntry.message
								&& (data.d.paymentEntry.message.errors || data.d.paymentEntry.message.success === 'SAVEWITHERROR')) {
							paintErrors(data.d.paymentEntry.message.errors);
						}

						blockPaymentInstrumentUI(false);
					}
				}
			}
		});
	} else {
		doHandleUnknownError();
		if(data)
			fnChkRecValRes(data);
		blockPaymentInstrumentUI(false);
	}
}
function doHandleUnknownError() {
	isScreenBroken = true;
	var arrError = [{
				errorMessage : mapLbl['unknownErr'],
				errorCode : 'ERR'
			}];
	doHandleEmptyScreenErrorForInstrument(arrError);
}
function doHandleEmptyScreenErrorForInstrument(arrError) {
	// TODO : Error Handling to be done here
	isScreenBroken = true;
	paintErrors(arrError);
	$('#transactionWizardPopup').addClass('hidden');
	$('#messageContentHeaderDiv').appendTo($('#emptyScreenErrorInstDiv'));
	$('#emptyScreenErrorInstDiv').toggleClass("ui-helper-hidden");
	paintPaymentInstrumentActionsForView('CANCELONLY');
}
function doSavePaymentInstrument(blnPrdCutOff) {
	if (!doValidateAccounts())
		return false;
		
	if (strLayoutType && strLayoutType === 'CASHLAYOUT') {
		if (!doValidateEnteredAndTotalAmount())
			return false;
	}
	var jsonData = generatePaymentInstrumentJson(), jsonArgs = {};
	var canSave = validateRequiredFields();
	if (blnPrdCutOff === true) {
		jsonData.d.paymentEntry.standardField.push({
					fieldName : 'prdCutoffFlag',
					value : 'Y'
				});
	}
	jsonArgs.action = 'SAVE';
	jsonArgs.jsonData = jsonData;
	doClearMessageSection();
	savePaymentInstrument(jsonData, postHandleSavePaymentInstrument, jsonArgs);
}
function doSaveAndNextPaymentInstrument(blnPrdCutOff) {
	if (!doValidateAccounts())
		return false;
	if (strLayoutType && strLayoutType === 'CASHLAYOUT'){
		if(!doValidateEnteredAndTotalAmount())
			return false;
	}
	var jsonData = generatePaymentInstrumentJson(), jsonArgs = {};
	if(!isEmpty(strPaymentInstrumentIde))
	jsonData.d.__metadata._detailId = strPaymentInstrumentIde;
	var canSave = validateRequiredFields();
	if (blnPrdCutOff === true) {
		jsonData.d.paymentEntry.standardField.push({
					fieldName : 'prdCutoffFlag',
					value : 'Y'
				});
	}
	jsonArgs.action = 'SAVEANDNEXT';
	jsonArgs.jsonData = jsonData;
	doClearMessageSection();
	savePaymentInstrument(jsonData, postHandleSavePaymentInstrument, jsonArgs);
}
function doUpdatePaymentInstrument(blnPrdCutOff) {
	if (!doValidateAccounts())
		return false;
	if (strLayoutType && strLayoutType === 'CASHLAYOUT'){
		if(!doValidateEnteredAndTotalAmount())
			return false;
	}
	var jsonData = generatePaymentInstrumentJson(), jsonArgs = {};
	var canSave = validateRequiredFields();
	// jsonData.d.__metadata._headerId = strPaymentHeaderIde;
	jsonData.d.__metadata._detailId = strPaymentInstrumentIde;
	if (blnPrdCutOff === true) {
		jsonData.d.paymentEntry.standardField.push({
					fieldName : 'prdCutoffFlag',
					value : 'Y'
				});
	}
	jsonArgs.action = 'UPDATE';
	jsonArgs.jsonData = jsonData;
	doClearMessageSection();
	savePaymentInstrument(jsonData, postHandleSavePaymentInstrument, jsonArgs);
	// doSavePaymentInstrument(blnPrdCutOff);
}
function doUpdateAndNextPaymentInstrument(blnPrdCutOff) {
	if (!doValidateAccounts())
		return false;
	if (strLayoutType && strLayoutType === 'CASHLAYOUT'){
		if(!doValidateEnteredAndTotalAmount())
			return false;
	}
	var jsonData = generatePaymentInstrumentJson(), jsonArgs = {};
	var canSave = validateRequiredFields();
	// jsonData.d.__metadata._headerId = strPaymentHeaderIde;
	jsonData.d.__metadata._detailId = strPaymentInstrumentIde;
	if (blnPrdCutOff === true) {
		jsonData.d.paymentEntry.standardField.push({
					fieldName : 'prdCutoffFlag',
					value : 'Y'
				});
	}
	jsonArgs.action = 'UPDATEANDNEXT';
	jsonArgs.jsonData = jsonData;
	doClearMessageSection();
	savePaymentInstrument(jsonData, postHandleSavePaymentInstrument, jsonArgs);
	// doSavePaymentInstrument(blnPrdCutOff);
}
function getDiscardConfirmationPopup(strPmtType) {
	_objDialog = $('#discardConfirmationPopup');
	_objDialog.dialog({
				bgiframe : true,
				autoOpen : false,
				modal : true,
				resizable : false,
				width : "320px",
				buttons :[{
						text :getLabel('btnOk','Ok'),
						tabindex :1,
						id: 'btnDiscardOk',
						click : function() {
							$(this).dialog("close");
							if (strPaymentType === 'BATCHPAY') {
								if ('Q' === strPmtType)
									doDiscardBatchInstrumentFromTxnWizard();
								else
									doHandlePaymentHeaderActions('discard');
							} else {
								doHandlePaymentInstrumentAction('discard', true);
							}
						},
						blur : function()
						{ 
							$("#btnDiscardCancel").focus();
						}
					},
					{
						text  : getLabel('btncancel','Cancel'),
						tabindex : 1,
						id: 'btnDiscardCancel',
						click : function() {
							$(this).dialog('destroy');
						},
						blur : function()
						{ 
							$("#btnDiscardOk").focus();
						}
					}]
	});
	_objDialog.dialog('open');
	_objDialog.dialog('option', 'position', 'center');
	$("#btnDiscardCancel").focus();	
};

function getTmpBackConfirmationPopup(strPmtType) {
	_objDialog = $('#cancelConfirmationPopup');
	_objDialog.dialog({
				bgiframe : true,
				autoOpen : false,
				modal : true,
				resizable : false,
				width : "320px",
					buttons :[{
						text : "Ok" ,
						tabindex :1,
						id: 'btnBackOk',
						click : function(){
						$(this).dialog("close");
						if (strPaymentType === 'BATCHPAY') {
							if(_IsEmulationMode == true)
							{
								goToPage(_mapUrl['cancelInstrumentUrl'],'frmMain');
							}
							else
							{
								if ('Q' === strPmtType)
									doDiscardBatchInstrumentFromTxnWizard();
								else
									doHandlePaymentHeaderActions('discard',true);
							}
						} else {
							doHandlePaymentInstrumentAction('discard', true);
						}
					},
						blur : function()
						{ 
							$("#btnBackCancel").focus();
						}
					},
					{
						text  : "Cancel",
						tabindex : 1,
						id: 'btnBackCancel',
						click : function() {
						$(this).dialog('destroy');
						},
						blur : function()
						{ 
							$("#btnBackOk").focus();
					}
					}]
			});
	_objDialog.dialog('open');
	_objDialog.dialog('option', 'position', 'center');
};
function getCancelConfirmationPopup(strPmtType) {
	_objDialog = $('#cancelConfirmationPopup');
	_objDialog.dialog({
				bgiframe : true,
				autoOpen : false,
				modal : true,
				resizable : false,
				width : "320px",
			buttons : [ {
			text : "Ok",
			tabindex : 1,
			id : 'btnCanConfOk',
			click : function() {
						$(this).dialog("close");
							if ('Q' === strPmtType)
								doHandlePaymentInstrumentAction('stop', true);
							else
								doHandlePaymentHeaderActions('stop');
					},
			blur : function() {
				$("#btnCanConfCancel").focus();
			}
		}, {
			text : "Cancel",
			tabindex : 1,
			id : 'btnCanConfCancel',
			click : function() {
				$(this).dialog('destroy');
			},
			blur : function() {
				$("#btnCanConfOk").focus();
			}
		} ]
			});
	_objDialog.dialog('open');
	_objDialog.dialog('option', 'position', 'center');
};

function getTxnCancelConfirmationPopup(strPmtType) {
	_objDialog = $('#txnCancelConfirmationPopup');
	_objDialog.dialog({
				bgiframe : true,
				autoOpen : false,
				modal : true,
				resizable : false,
				width : "320px",
			buttons : [ {
			text : "Yes",
			tabindex : 1,
			id : 'btnCanConfOk',
			click : function() {
						$(this).dialog("close");
							if ('Q' === strPmtType)
								doHandlePaymentInstrumentAction('stop', true);
							else
								doHandlePaymentHeaderActions('stop');
					},
			blur : function() {
				$("#btnCanConfCancel").focus();
			}
		}, {
			text : "No",
			tabindex : 1,
			id : 'btnCanConfCancel',
			click : function() {
				$(this).dialog('destroy');
			},
			blur : function() {
				$("#btnCanConfOk").focus();
			}
		} ]
			});
	_objDialog.dialog('open');
	_objDialog.dialog('option', 'position', 'center');
};

function showCutoffRejectRemarkPopUp(strAction, strPmtType, blnRedirectToSummary,cutoffProduct) {
	
	doClearMessageSection();
	var fieldLbl = getLabel('instrumentReturnRemarkPopUpTitle',
			'Please Enter Reject Remark');
	var titleMsg = getLabel('instrumentReturnRemarkPopUpFldLbl',
				'Reject Remark');
	
	var msgbox = Ext.Msg.show({
				title : titleMsg,
				msg : fieldLbl,
				buttons : Ext.Msg.OKCANCEL,
				buttonText:{ok:getLabel('btnOk','OK'),cancel:getLabel('btnCancel','Cancel')},
				multiline : 4,
				cls : 't7-popup',
				width: 355,
				height : 270,
				bodyPadding : 0,
				fn : function(btn, text) {
					if (btn == 'ok') {
						if(text == null || text == "")
						{
							Ext.MessageBox.show({
								title : getLabel(
										'instrumentErrorPopUpTitle',
										'Error'),
								msg : getLabel(
										'RejError',
										'Reject Remarks cannot be blank'),
								buttons : Ext.MessageBox.OK,
								buttonText: {
						            ok: getLabel('btnOk', 'OK')
									}, 
								cls : 'xn-popup message-box',
								icon : Ext.MessageBox.ERROR
							});
						}
						else
						{
							_setRemarksDetail(text,strPmtType, blnRedirectToSummary,cutoffProduct);
							$('#fxPopupDiv').dialog("close");
						}
					}
				}
			});
	msgbox.textArea.enforceMaxLength = true;
	msgbox.textArea.inputEl.set({
				maxLength : 255,
				id : 'txtrejectRemark',
				cols :"43" ,
				rows : "4",
				cls : "x-form-field",
				style : "resize: none;"
			});
	$('#txtrejectRemark').bind('blur',function(){
		markRequired(this);
	});
	$('#txtrejectRemark').bind('focus',function(){
		removeMarkRequired(this);
	});
}

function doHandleRejectAction(strAction, strPmtType, blnRedirectToSummary) {
	doClearMessageSection();
	showRejectVerifyPopUp(strAction, strPmtType, blnRedirectToSummary);
}

function showRejectVerifyPopUp(strAction, strPmtType, blnRedirectToSummary) {
	var titleMsg = '', fieldLbl = '';
	/*
	 * if (strAction === 'verify') { titleMsg =
	 * getLabel('instrumentVerifyRemarkPopUpTitle', 'Please enter verify
	 * remark'); fieldLbl = getLabel('instrumentVerifyRemarkPopUpFldLbl',
	 * 'Verify Remark'); } else
	 */
	if (strAction === 'reject') {
		fieldLbl = getLabel('instrumentReturnRemarkPopUpTitle',
				'Please Enter Reject Remark');
		titleMsg = getLabel('instrumentReturnRemarkPopUpFldLbl',
				'Reject Remark');
	}
	getRemarksPopup(270, titleMsg, fieldLbl, strPmtType, blnRedirectToSummary);
}

function getRemarksPopup(intHeight, strTitle, lblTitle, strPmtType,
		blnRedirectToSummary) {
	/*if (fld) {
		fld.value = "";
	}*/
	_objDialog = $('#rrDialog');
	$('#rrField').text(lblTitle);
	_objDialog.dialog({
				bgiframe : true,
				autoOpen : false,
				modal : true,
				resizable : false,
				height : intHeight,
				width : "360px",
				title : strTitle,
				'z-index':'99999 !important',
				open : function() {
					document.getElementById('taRemarks').focus();
				},
				buttons : [{
					text:getLabel('btnOk','Ok'),
					id:   "btnOk",
					tabindex :'1',
					click:function(){
						var fld = document.getElementById('taRemarks');
						if(fld.value == null || fld.value == "")
						{
							showrejectWarningPopup();
							return false;
						}
						else
						{
						//$(this).dialog('destroy');
						_setRemarksDetail(document.getElementById('taRemarks'),
								strPmtType, blnRedirectToSummary);
						$('#taRemarks').val('');
						}
					}
				},{
					text:getLabel('btncancel','Cancel'),
					id:   "btnCancel",
					tabindex :'1',
					keydown : function()
					{ 
						//$("#taRemarks").focus();
						autoFocusOnFirstElement(event,'rrDialog',false);
					},
					click:function() {	
						$(this).dialog('destroy');
					}
				}]
			});
	_objDialog.dialog('open');
	_objDialog.dialog('option', 'position', 'center');
	$('#taRemarks').focus();
}

function _setRemarksDetail(ctrl, strPmtType, blnRedirectToSummary,cutoffProduct) {
	var _strRemarks = null;
	if (ctrl && ctrl.value != undefined) {
		_strRemarks = ctrl.value;
	}
	else
	{
		_strRemarks = ctrl;
	}
	_objDialog.dialog('destroy');
	if (strPmtType === 'B') {
		doHandlePaymentHeaderActions('reject', _strRemarks,'','',cutoffProduct);
	} else if (strPmtType === 'Q' || strPmtType === 'W') {
		if (cutoffProduct != null && strPmtType != 'W' )
		{
			doHandlePaymentIntrumentCutoffAction('reject',false,_strRemarks,'',cutoffProduct);
		}
		else
		{
			doHandlePaymentInstrumentAction('reject', blnRedirectToSummary,
					_strRemarks);
		}
	}
}

function doHandlePaymentInstrumentAction(strAction, blnRedirectToSummary,
		strRemarks,recKeyIdentifier, callbackfunctionOnAjaxComplete) {
	if(_IsEmulationMode == true)
	{
		strAction = 'Emulation'	;
	}
	if (strAction) {
		switch (strAction) {
			case 'discard' :
				doDiscardPaymentInstrument(strAction, strRemarks,'',blnRedirectToSummary);
				break;
			case 'submit' :
				doSubmitPaymentInstrument(strAction, strRemarks, callbackfunctionOnAjaxComplete);
				break;
			case 'Emulation' :	
				goToPage(_mapUrl['cancelInstrumentUrl'],'frmMain');
				break;
			default :
				doHandlePaymentInstrumentGroupAction(strAction, strRemarks,
						blnRedirectToSummary,recKeyIdentifier);
		}
	}
}
function getIndexFromJsonArray(rowJsonData,keyIndex)
{
	var retValue = 0 ;
	if (rowJsonData)
	{
	    $.each(rowJsonData, function(index, opt) {
            if (keyIndex == opt.serialNo) {
            	retValue = index ;
                return retValue;
            }
        });
	}
    return retValue;
}
function doHandlePaymentIntrumentCutoffAction(strAction,blnRedirectToSummary ,
		strRemarks	,recKeyIdentifier,cutoffProduct)
{
	var arrayJson = new Array();
	var cutOffInst =   {"instruments":[]};
	var strMsg = '',strUrl = null;
	
	if (!isEmpty(strPaymentType) && strPaymentType === 'BATCHPAY' && rowJsonData != null )
	{
		for (var index = 0; index < rowJsonData.length; index++) 
		{
			if(rowJsonData[index].filterValue2 == cutoffProduct)
			{
				arrayJson.push({
					serialNo : rowJsonData[index].serialNo,
					identifier : rowJsonData[index].identifier,
					userMessage : strRemarks,
					flipProduct	: flipProduct,
					filterValue1: isEmpty(recKeyIdentifier) ? '' : recKeyIdentifier,
					filterValue2 : cutoffProduct
				});
			}
		}
	}
	else
	{
		arrayJson.push({
			serialNo : 0,
			identifier : strDtlIdentifierForInfo,
			userMessage : strRemarks,
			flipProduct	: flipProduct,
			filterValue1: isEmpty(recKeyIdentifier) ? '' : recKeyIdentifier,
			filterValue2: cutoffProduct 
		});
	}
	strUrl =_mapUrl['gridGroupActionUrl'] + '/' + strAction + '.json';
	strUrl = strUrl + "?" + csrfTokenName + "=" + csrfTokenValue;
	
	$.ajax({
		url : strUrl,
		contentType : "application/json",
		data : JSON.stringify(arrayJson),
		type : 'POST',
		complete : function(XMLHttpRequest, textStatus) {
			if ("error" == textStatus) {
				var arrError = new Array();
				arrError.push({
							"errorCode" : "Message",
							"errorMessage" : mapLbl['unknownErr']
						});
				paintErrors(arrError);
				blockPaymentUI(false);
			}
		},
		success : function(jsonRes) {
			if (jsonRes && jsonRes.d && jsonRes.d.instrumentActions) {
				var arrResult = jsonRes.d.instrumentActions;
				var flag = 'N'
				var flipProductList;
				if (arrResult && arrResult.length == 1) {
					if (arrResult[0].success === 'Y'
							&& blnRedirectToSummary) {
						if (typeof objInstrumentEntryGrid != 'undefined'
							&& objInstrumentEntryGrid) {
							objInstrumentEntryGrid.refreshData();
							$('#transactionWizardViewPopup').dialog('close');
							}
						if((strAction ==='send' || strAction ==='auth' || strAction === 'submit' || strAction ==='InstSend') && arrResult[0].isWarning === 'Y'){
							doClearMessageSection();
							paintErrors(arrResult[0].errors,'',mapLbl['warnMsg']);
							if (arrResult[0].updatedStatus === 'Sent To Bank'){
								$('#button_btnApprove').attr('disabled', true);
						 		$('#button_btnReject').attr('disabled', true);
						 		$('#button_btnSend').attr('disabled', true);
							}
							var strBtnId = 'button_btn'+(strAction.substr(0, 1).toUpperCase() + strAction.substr(1));
					 		$('#'+strBtnId).unbind('click');
					 		$('#'+strBtnId).bind('click', function(){
					 			goToPage(_mapUrl['cancelInstrumentUrl'], 'frmMain');
					 		});
						}
						else
							goToPage(_mapUrl['cancelInstrumentUrl'], 'frmMain');
					} if (arrResult[0].success === 'Y'
							&& strPaymentType==="BATCHPAY") {
						if (typeof objInstrumentEntryGrid != 'undefined'
							&& objInstrumentEntryGrid) {
							objInstrumentEntryGrid.refreshData();
							$('#transactionWizardViewPopup').dialog('close');
							}
					} else if (arrResult[0].success === 'N') {
						if (arrResult[0].errors) {
							var arrError = arrResult[0].errors, isProductCutOff = false, errCode = null;
							if (arrError && arrError.length > 0) {
								$.each(arrError, function(index, error) {
											strMsg = strMsg + error.code + ' : ' + error.errorMessage;
											//strMsg = error.errorMessage;
											errCode = error.code;
											if (errCode
													&& (errCode
															.toUpperCase()
															.indexOf("WARN") >= 0)
													|| errCode === 'GD0002') {
												isProductCutOff = true;
											}
										});
							}

							if (isProductCutOff) {
								var strIsRollover = 'N', strIsReject = 'N', strIsDiscard = 'N';
								strMsg = strMsg
										|| mapLbl['instrumentProductCutoffMsg'];
								if (strAction === 'auth'
										|| strAction === 'release') {
									if (!Ext.isEmpty(errCode)
											&& errCode.substr(0, 4) === 'WARN') {
										strIsRollover = 'Y';
										strIsReject = 'Y';
										strIsDiscard = 'Y';
									} else if (!Ext.isEmpty(errCode)
											&& errCode === 'GD0002') {
										strIsReject = 'Y';
										strIsDiscard = 'Y';
									}
								} else if (strAction === 'save'
										|| strAction === 'send'
										|| strAction === 'submit'
										|| strAction === 'InstSend') {
									if (!Ext.isEmpty(errCode)
											&& errCode.substr(0, 4) === 'WARN') {
										strIsRollover = 'Y';
										strIsDiscard = 'Y';
									} else if (!Ext.isEmpty(errCode)
											&& errCode === 'GD0002') {
										strIsDiscard = 'Y';
										strMsg = mapLbl['lblErrMsgCutOffDiscard'];
									}
								}
								doClearMessageSection();
								var strTitle = mapLbl['warnMsg'];
								blockPaymentUI(false);
								var args = {};
								args.strRemarks = 'Y';
								showPaymentEntryCutoffAlert(
										212,
										350,
										strTitle,
										strMsg,
										postHandlePaymentInstrumentActionsProductCutOff,
										args);
							} else {
								doClearMessageSection();
								// paintErrors(arrError);
								paintErrors(arrResult[0].errors);
								blockPaymentInstrumentUI(false);
							}
						}
					}else if(arrResult[0].success === 'FX'){
					if (arrResult[0].errors) {
						var arrError = arrResult[0].errors, isFxRateError = false, errCode = null;
						if (arrError && arrError.length > 0) {
							$.each(arrError, function(index, error) {
										strMsg = strMsg + error.code
												+ ' : '
												+ error.errorMessage;
										errCode = error.code;
										if (errCode && (errCode.indexOf( 'SHOWPOPUP') != -1 || errCode.indexOf( 'WARN') != -1) || errCode.indexOf( 'GD0002') != -1 ) {
												isFxRateError = true;
												if(errCode.indexOf('SHOWPOPUP,CUTOFF,ROLLOVER,FLIP') != -1 || 'Y' == error.flag )
													{
													  flipProductList = error.productMap;
													  flag = error.flag ;
													  if(!isEmpty(error.disableCutoffBtn)){
														  disableCutoffBtns = error.disableCutoffBtn;  
													  }
													}
										}
										
											
									});
						}
						if (isFxRateError) 
						{
							if(isNaN(fxTimer)) 
								{
									fxTimer = 10;
								}	
							cutOffInst.instruments.push({
							    "paymentFxInfo": arrResult[0].paymentFxInfo,
							    "strAction":strAction,
							    "errorCode" : errCode
							  });
							if(cutOffInst && cutOffInst.instruments && cutOffInst.instruments.length > 0)
							{
								countdownInstTimerVal = null;
								isInstCutOff=  true;
								if (isNaN(fxTimer))
									fxTimer = 10;
								var countdown_number = 60 * fxTimer;
								countdownInstTimerVal = countdown_number;
								takeCutOffInstrumentAction(cutOffInst,0, flipProductList,flag);
								showCutOffTimer(countdownInstTimerVal);
							}
						}
						 else {
							doClearMessageSection();
							paintErrors(arrResult[0].errors);
							blockPaymentInstrumentUI(false);
						}
					}
				}
				}
				else
				{
					if (typeof objInstrumentEntryGrid != 'undefined'
						&& objInstrumentEntryGrid) {
						objInstrumentEntryGrid.refreshData();
						$('#transactionWizardViewPopup').dialog('close');
						}
				}
				$('#transactionWizardViewPopup').dialog('close');
				//searchPopup();
			}
		},
		failure : function() {
			var arrError = new Array();
			arrError.push({
						"errorCode" : "Message",
						"errorMessage" : mapLbl['unknownErr']
					});
			paintErrors(arrError);
		}
	});
	
}
function doHandlePaymentInstrumentGroupAction(strAction, strRemarks,
		blnRedirectToSummary,recKeyIdentifier) {
	var arrayJson = new Array(), strMessage = !isEmpty(strRemarks) ? strRemarks : '';
	var jsonIndex = 0 ;
	var cutOffInst =   {"instruments":[]};
		var strIdentifier = null, strMsg = '',strUrl = null,srNmbr=null;
	if(strAction === 'InstSend' )
		strUrl = _mapUrl['gridGroupActionUrl'] + '/' + strAction + '.json';
	else
		strUrl = _mapUrl['batchHeaderActionUrl'] + '/' + strAction + '.json';
	
	if (!isEmpty(strPaymentType) && strPaymentType === 'BATCHPAY') {
		if((rowAction === "rowAction" || rowAction === "groupAction") && rowJsonData != null){
			if(strAction === 'InstSend' && rowJsonData.length > 1){
				strIdentifier = rowJsonData[rowJsonData.length-1].identifier;
				srNmbr = rowJsonData[rowJsonData.length-1].serialNo;
				rowJsonData.length=rowJsonData.length-1;
			}
			else if(rowAction === "groupAction")
			{
				//jsonIndex = rowJsonData.findIndex(rowJson => rowJson.serialNo === parseInt(instRowIndex,10));
				jsonIndex = getIndexFromJsonArray(rowJsonData,parseInt(instRowIndex,10));
				strIdentifier = rowJsonData[jsonIndex].identifier;
				srNmbr = rowJsonData[jsonIndex].serialNo;
			}
			else
			{
				strIdentifier = rowJsonData[0].identifier;
				srNmbr = rowJsonData[0].serialNo;
			}
		}
		else{
			strIdentifier = strDtlIdentifierForInfo;
		}
		strUrl =_mapUrl['gridGroupActionUrl'] + '/' + strAction + '.json';
	} else {
		if (paymentResponseInstrumentData
				&& paymentResponseInstrumentData.d
				&& paymentResponseInstrumentData.d.paymentEntry
				&& paymentResponseInstrumentData.d.paymentEntry.paymentHeaderInfo
				&& paymentResponseInstrumentData.d.paymentEntry.paymentHeaderInfo.hdrIdentifier) {
			strIdentifier = paymentResponseInstrumentData.d.paymentEntry.paymentHeaderInfo.hdrIdentifier;
		}
	}
	if(strAction === 'InstSend' && strIdentifier == null)
		strIdentifier = strPaymentHeaderIde;
	if (strIdentifier) {
			if(rowJsonData != null && rowAction != "Q"){
				arrayJson.push({
					serialNo : srNmbr,
					identifier : strIdentifier,
					userMessage : strMessage,
					flipProduct	: flipProduct,
					filterValue1: isEmpty(recKeyIdentifier) ? '' : recKeyIdentifier,
					filterValue2: isEmpty(txnWizardProduct) ? '' : txnWizardProduct
				});
			}else{
				arrayJson.push({
							serialNo : 0,
							identifier : strIdentifier,
							userMessage : strMessage,
							flipProduct	: flipProduct,
							filterValue1: isEmpty(recKeyIdentifier) ? '' : recKeyIdentifier,
							filterValue2: isEmpty(txnWizardProduct) ? '' : txnWizardProduct 
						});
			}
		strUrl = strUrl + "?" + csrfTokenName + "=" + csrfTokenValue; 
		$.ajax({
			url : strUrl,
			contentType : "application/json",
			data : JSON.stringify(arrayJson),
			type : 'POST',
			complete : function(XMLHttpRequest, textStatus) {
				if ("error" == textStatus) {
					var arrError = new Array();
					arrError.push({
								"errorCode" : "Message",
								"errorMessage" : mapLbl['unknownErr']
							});
					paintErrors(arrError);
					blockPaymentUI(false);
				}
			},
			success : function(jsonRes) {
				if (jsonRes && jsonRes.d && jsonRes.d.instrumentActions) {
					var arrResult = jsonRes.d.instrumentActions;
					var isError = false;
					var flag = 'N'
					var flipProductList;
					if (arrResult && arrResult.length == 1) {
						if (arrResult[0].success === 'Y'
								&& blnRedirectToSummary) {
							if (typeof objInstrumentEntryGrid != 'undefined'
								&& objInstrumentEntryGrid) {
								objInstrumentEntryGrid.refreshData();
								$('#transactionWizardViewPopup').dialog('close');
								}
							if((strAction ==='send' || strAction ==='auth' || strAction === 'submit' || strAction ==='InstSend') && arrResult[0].isWarning === 'Y'){
								doClearMessageSection();
								paintErrors(arrResult[0].errors,'',mapLbl['warnMsg']);
								if (arrResult[0].updatedStatus === 'Sent To Bank'){
									$('#button_btnApprove').attr('disabled', true);
							 		$('#button_btnReject').attr('disabled', true);
							 		$('#button_btnSend').attr('disabled', true);
								}
								var strBtnId = 'button_btn'+(strAction.substr(0, 1).toUpperCase() + strAction.substr(1));
						 		$('#'+strBtnId).unbind('click');
						 		$('#'+strBtnId).bind('click', function(){
						 			goToPage(_mapUrl['cancelInstrumentUrl'], 'frmMain');
						 		});
							}
							else
								goToPage(_mapUrl['cancelInstrumentUrl'], 'frmMain');
						} if (arrResult[0].success === 'Y'
								&& strPaymentType==="BATCHPAY") {
							if (typeof objInstrumentEntryGrid != 'undefined'
								&& objInstrumentEntryGrid) {
								objInstrumentEntryGrid.refreshData();
								$('#transactionWizardViewPopup').dialog('close');
								}
							doCancelBatchInstrument(strAction);
						} else if (arrResult[0].success === 'N') {
							if (arrResult[0].errors) {
								var arrError = arrResult[0].errors, isProductCutOff = false, errCode = null;
								if (arrError && arrError.length > 0) {
									$.each(arrError, function(index, error) {
												strMsg = strMsg + error.code + ' : ' + error.errorMessage;
												//strMsg = error.errorMessage;
												errCode = error.code;
												if (errCode
														&& (errCode
																.toUpperCase()
																.indexOf("WARN") >= 0)
														|| errCode === 'GD0002') {
													isProductCutOff = true;
												}
											});
								}

								if (isProductCutOff) {
									var strIsRollover = 'N', strIsReject = 'N', strIsDiscard = 'N';
									strMsg = strMsg
											|| mapLbl['instrumentProductCutoffMsg'];
									if (strAction === 'auth'
											|| strAction === 'release') {
										if (!Ext.isEmpty(errCode)
												&& errCode.substr(0, 4) === 'WARN') {
											strIsRollover = 'Y';
											strIsReject = 'Y';
											strIsDiscard = 'Y';
										} else if (!Ext.isEmpty(errCode)
												&& errCode === 'GD0002') {
											strIsReject = 'Y';
											strIsDiscard = 'Y';
										}
									} else if (strAction === 'save'
											|| strAction === 'send'
											|| strAction === 'submit'
											|| strAction === 'InstSend') {
										if (!Ext.isEmpty(errCode)
												&& errCode.substr(0, 4) === 'WARN') {
											strIsRollover = 'Y';
											strIsDiscard = 'Y';
										} else if (!Ext.isEmpty(errCode)
												&& errCode === 'GD0002') {
											strIsDiscard = 'Y';
											strMsg = mapLbl['lblErrMsgCutOffDiscard'];
										}
									}
									doClearMessageSection();
									var strTitle = mapLbl['warnMsg'];
									blockPaymentUI(false);
									var args = {};
									args.action = strAction;
									args.isRollover = strIsRollover;
									args.isReject = strIsReject;
									args.isDiscard = strIsDiscard;
									args.strRemarks = 'Y';
									showPaymentEntryCutoffAlert(
											212,
											350,
											strTitle,
											strMsg,
											postHandlePaymentInstrumentActionsProductCutOff,
											args);
								} else {
									doClearMessageSection();
									// paintErrors(arrError);
									paintErrors(arrResult[0].errors);
									blockPaymentInstrumentUI(false);
								}
							}
						}else if(arrResult[0].success === 'FX'){
						if (arrResult[0].errors) {
							var arrError = arrResult[0].errors, isFxRateError = false, errCode = null;
							if (arrError && arrError.length > 0) {
								$.each(arrError, function(index, error) {
											strMsg = strMsg + error.code
													+ ' : '
													+ error.errorMessage;
											errCode = error.code;
											if (errCode && (errCode.indexOf( 'SHOWPOPUP') != -1 || errCode.indexOf( 'WARN') != -1) || errCode.indexOf( 'GD0002') != -1 ) {
													isFxRateError = true;
													if(errCode.indexOf('SHOWPOPUP,CUTOFF,ROLLOVER,FLIP') != -1 || 'Y' == error.flag )
														{
														  flipProductList = error.productMap;
														  flag = error.flag ;
														  if(!isEmpty(error.disableCutoffBtn)){
															  disableCutoffBtns = error.disableCutoffBtn;  
														  }
														}
											}
											
												
										});
							}
							if (isFxRateError) 
							{
								if(isNaN(fxTimer)) 
									{
										fxTimer = 10;
									}	
								cutOffInst.instruments.push({
								    "paymentFxInfo": arrResult[0].paymentFxInfo,
								    "strAction":strAction,
								    "errorCode" : errCode,
								    "cutoffProduct":txnWizardProduct,
								    "cutoffProductDesc":txnWizardProductDesc
								  });
								if(cutOffInst && cutOffInst.instruments && cutOffInst.instruments.length > 0)
								{
									countdownInstTimerVal = null;
									isInstCutOff=  true;
									if (isNaN(fxTimer))
										fxTimer = 10;
									var countdown_number = 60 * fxTimer;
									countdownInstTimerVal = countdown_number;
									takeCutOffInstrumentAction(cutOffInst,0, flipProductList,flag);
									showCutOffTimer(countdownInstTimerVal);
								}
							}
							 else {
								doClearMessageSection();
								paintErrors(arrResult[0].errors);
								blockPaymentInstrumentUI(false);
							}
						}
					}
					}
					$('#transactionWizardViewPopup').dialog('close');
					//searchPopup();
				}
			},
			failure : function() {
				var arrError = new Array();
				arrError.push({
							"errorCode" : "Message",
							"errorMessage" : mapLbl['unknownErr']
						});
				paintErrors(arrError);
			}
		});
	}
}

function takeCutOffInstrumentAction(cutOffInst,index, productList,flipFlag)
{
	if(cutOffInst.instruments.length > index )
	{	
		if(countdownInstTimerVal > 0)
			countdownTriggerOnEntry(cutOffInst,index, productList,flipFlag);
	}
	else if(countdownInstTimerVal > 0)
	{
		// when no instrument is pending to take action and timer is still running, clear it out.
		clearTimeout(countdown);
		isInstCutOff=  false;
		if (strPaymentType==="BATCHPAY" && (rowAction === "rowAction" || rowAction === "groupAction") && 
				typeof objInstrumentEntryGrid != 'undefined'
			&& objInstrumentEntryGrid) {
			//objInstrumentEntryGrid.refreshData();
			}
	}
	else
	{	// when cutoff times has expired and cutoff popup action not taken or not yet completed
		isInstCutOff=  false;
		// to close all popup windows if any open. fr example of reject action, reject Remark
	//	var win = Ext.WindowManager.getActive();
	//	if(!Ext.isEmpty(win))
	//		win.close();
		// to close all Open window popup. fr example of reject action, reject Remark
		if (typeof objInstrumentEntryGrid != 'undefined'
			&& objInstrumentEntryGrid) {
			objInstrumentEntryGrid.refreshData();
			}
	}
}
function showCutOffTimer(countdown_number) 
{
	var inLabel = "in " ;
	var colen = ":";
		
		mins = Math.floor(countdown_number / 60);
		var sec = countdown_number % 60;
		if (mins <= 9) {
			mins = "0" + mins;
		}
		if (sec <= 9) {
			sec = "0" + sec;
		}
		if (mins < 1) {
			mins = "00";
		}
		
		if (countdown_number > 0) {
			countdown_number--;
			countdownInstTimerVal = countdown_number;
			if (countdown_number > 0) {
				countdown = setTimeout(function() {
							$("#timePartDisplay").text(getLabel('fxPopupDisclaimer', 'Take Action ') + inLabel + mins
									+ colen + sec);
							$("#timePartInfoIcon").addClass('fa fa-info-circle');
							showCutOffTimer(countdown_number);	
						}, 1000);
			} else {
				$('#fxPopupDiv').dialog("close");
				clearTimeout(countdown);
			}
		}			
}

function countdownTriggerOnEntry(cutOffInst, index,productList,flag) {
		var paymentFxInfo = cutOffInst.instruments[index].paymentFxInfo;
		var strAction = cutOffInst.instruments[index].strAction;
		var errorCode = cutOffInst.instruments[index].errorCode;
		instRowIndex = cutOffInst.instruments[index].serialNo;
		var fxRateVal = paymentFxInfo.fxInfoRate;
		var cutoffProduct = cutOffInst.instruments[index].cutoffProduct;
		var cutoffProductDesc = cutOffInst.instruments[index].cutoffProductDesc;
		if (typeof fxRateVal == "undefined") {
			fxRateVal = '';
		}

		if(FXCNTRGET == 'Y' && paymentFxInfo.debitCurrency !=  paymentFxInfo.paymentCurrency )
		{			
			var fxRateRef = document.getElementById("fxRateInfo");
			fxRateRef.innerHTML = fxRateVal;
			fxRateRef.setAttribute('title', fxRateVal);
			$('#fxRateInfoDiv').removeClass('hidden');
			$('#debitAmtDiv').removeClass('hidden');
		}
		else
		{
			$('#fxRateInfoDiv').addClass('hidden');
			$('#debitAmtDiv').addClass('hidden');
		}
		
		var debitAmntVal = paymentFxInfo.debitAmount;
		debitAmntVal = "";
		if (typeof debitAmntVal == "undefined") {
			debitAmntVal = '';
		}
		else
		{
			$('#fxPopupDiv').dialog({
				title : getLabel('fxPopupTitle', 'Cutoff time or effective date has lapsed. Continue with changed effective date?'),
				autoOpen : false,
				maxHeight : 550,
				minHeight : 156,
				width : 1000,
				modal : true,
				resizable : false,
				draggable : false,
				close: function(event, ui)
	     	   	{
					takeCutOffInstrumentAction(cutOffInst,index+1,productList,flag);
	        	}
			});
			$('#fxPopupDiv').dialog("open");
					$('#fxPopupDiv').dialog('option', 'position', 'center');
			 $('#fxPopupDiv').on('dialogclose', function(event) {
				 $('#flipProductList').addClass('hidden');
				 $('#productListselectDiv div').empty();
				 $('#messageContentDivFlip').addClass('hidden');
					clearTimeout(countdown);
			 });
			$('#cancelFxBtn').unbind('click');
			$('#cancelFxBtn').bind('click', function() {
						clearTimeout(countdown);
						$('#fxPopupDiv').dialog("close");
						takeCutOffInstrumentAction(cutOffInst,index+1,productList,flag);
					});
			$('#okFxBtn').unbind('click');
			$('#okFxBtn').bind('click', function() {
				if(strPaymentType==="BATCHPAY"){
					doHandlePaymentHeaderActions(strAction,
						paymentFxInfo.encryptedFxInfo);
				}else if(strPaymentType==="QUICKPAY"){
					doHandlePaymentInstrumentAction(strAction,true,
						paymentFxInfo.encryptedFxInfo);}
				$('#fxPopupDiv').dialog("close");
				takeCutOffInstrumentAction(cutOffInst,index+1,productList,flag);
			});
			$('#discardBtn,#discardBtnNoRollover,#discardBtnForWARN,#discardPopupBtn').unbind('click');
			$('#discardBtn,#discardBtnNoRollover,#discardBtnForWARN,#discardPopupBtn').bind('click', function() {
				if(strPaymentType==="BATCHPAY"){
					if(rowAction === "rowAction" || rowAction === "groupAction")
					{
						doHandlePaymentIntrumentCutoffAction('discard',false,
								paymentFxInfo.encryptedFxInfo,amtKeyValdation,cutoffProduct);				
					}
					else if(rowAction === "Q")
					{
						doHandlePaymentInstrumentGroupAction('discard',paymentFxInfo.encryptedFxInfo,false,amtKeyValdation);	
					}
					else
					{
						doHandlePaymentHeaderActions('discard',paymentFxInfo.encryptedFxInfo,'',
								amtKeyValdation,cutoffProduct);					
					}
				}else if(strPaymentType==="QUICKPAY"){
					doHandlePaymentInstrumentAction('discard',true,
							paymentFxInfo.encryptedFxInfo,amtKeyValdation);}
				$('#fxPopupDiv').dialog("close");
				takeCutOffInstrumentAction(cutOffInst,index+1,productList,flag);
			});
			$('#rolloverBtn,#rolloverBtnForWARN,#rolloverBtnForWARNFlip').unbind('click');
			$('#rolloverBtn,#rolloverBtnForWARN,#rolloverBtnForWARNFlip').bind('click', function() {
				if(strPaymentType==="BATCHPAY"){
					if(rowAction === "rowAction" || rowAction === "groupAction")
					{
						doHandlePaymentIntrumentCutoffAction(strAction,false
								,paymentFxInfo.encryptedFxInfo,amtKeyValdation,cutoffProduct);			
					}
					else if(rowAction === "Q")
					{
						doHandlePaymentInstrumentGroupAction(strAction,paymentFxInfo.encryptedFxInfo,false,amtKeyValdation);	
					}
					else
					{
						doHandlePaymentHeaderActions(strAction,paymentFxInfo.encryptedFxInfo,'',
								amtKeyValdation,cutoffProduct);				
					}
					
				}else if(strPaymentType==="QUICKPAY"){
					doHandlePaymentInstrumentAction(strAction,true,
							paymentFxInfo.encryptedFxInfo,amtKeyValdation);}
				$('#fxPopupDiv').dialog("close");
				takeCutOffInstrumentAction(cutOffInst,index+1,productList,flag);
			});		
			$('#discardBtnForWARNFlip').unbind('click');
			$('#discardBtnForWARNFlip').bind('click', function() {
				if(strPaymentType==="BATCHPAY"){
					doHandelBatchPayAction('discard',paymentFxInfo.encryptedFxInfo,cutoffProduct);
				}else if(strPaymentType==="QUICKPAY"){
					doHandlePaymentInstrumentAction('discard',true,
							paymentFxInfo.encryptedFxInfo);}
				$('#fxPopupDiv').dialog("close");
				takeCutOffInstrumentAction(cutOffInst,index+1,productList,flag);
			});
			$('#discardFlipNRBtn').unbind('click');
			$('#discardFlipNRBtn').bind('click', function() {
				if(strPaymentType==="BATCHPAY"){
					doHandelBatchPayAction('discard',paymentFxInfo.encryptedFxInfo,cutoffProduct);
				}else if(strPaymentType==="QUICKPAY"){
					doHandlePaymentInstrumentAction('discard',true,
							paymentFxInfo.encryptedFxInfo);}
				$('#fxPopupDiv').dialog("close");
				takeCutOffInstrumentAction(cutOffInst,index+1,productList,flag);
			});
			
			
			$('#discardPopupFlipBtn').unbind('click');
			$('#discardPopupFlipBtn').bind('click', function() {
				if(strPaymentType==="BATCHPAY"){
					doHandelBatchPayAction('discard',paymentFxInfo.encryptedFxInfo,cutoffProduct);
				}else if(strPaymentType==="QUICKPAY"){
					doHandlePaymentInstrumentAction('discard',true,
							paymentFxInfo.encryptedFxInfo);}
				$('#fxPopupDiv').dialog("close");
				takeCutOffInstrumentAction(cutOffInst,index+1,productList,flag);
			});
			$('#rejectPopupFlipBtn').unbind('click');
			$('#rejectPopupFlipBtn').bind('click', function() {
				if(strPaymentType==="BATCHPAY"){
					if(rowAction === "rowAction" || rowAction === "groupAction"){
						showCutoffRejectRemarkPopUp('reject', 'Q', false,cutoffProduct);
					}
					else if(rowAction === "Q")
					{
						showCutoffRejectRemarkPopUp('reject', 'W', false,cutoffProduct);
					}
					else{	
						showCutoffRejectRemarkPopUp('reject', 'B', true,cutoffProduct);
					}		
				}else if(strPaymentType==="QUICKPAY"){
					showCutoffRejectRemarkPopUp('reject', 'Q', true,cutoffProduct);}
				
			});
			$('#flipBtnForWARNBtn').unbind('click');
			$('#flipBtnForWARNBtn').bind('click', function() {
				//clearTimeout(countdown);
				$('#flipProductList').removeClass('hidden');
				if(null == productList)
				{
					$('#productErrorDiv').removeClass('hidden');
					$('#productListDiv').addClass('hidden');
					$('#breachedProductListDiv').addClass('hidden');
					$('#breachedProductListDiv').addClass('hidden');
					$('#productListselectDiv').addClass('hidden');
					$('#cancelFlipButonsUl').removeClass('hidden');
					$('#FlipButonsUl').addClass('hidden');
					
				}
				else{
					
					$("#productListselectDiv").empty();
					createFlipView(productList,cutoffProduct,strAction);
				}			
			});
			$('#flipNRBtn').unbind('click');
			$('#flipNRBtn').bind('click', function() {
				clearTimeout(countdown);
				$('#flipProductList').removeClass('hidden');
				if(null == productList)
				{
					$('#productErrorDiv').removeClass('hidden');
					$('#productListDiv').addClass('hidden');
					$('#breachedProductListDiv').addClass('hidden');
					$('#breachedProductListDiv').addClass('hidden');
					$('#productListselectDiv').addClass('hidden');
					$('#cancelFlipButonsUl').removeClass('hidden');
					$('#FlipButonsUl').addClass('hidden');				
				}
				else{				
					$("#productListselectDiv").empty();
					createFlipView(productList,cutoffProduct,strAction);
				}			
			});
			
			$('#flipPopupBtn').unbind('click');
			$('#flipPopupBtn').bind('click', function() {
				clearTimeout(countdown);
				$('#flipProductList').removeClass('hidden');
				if(null == productList)
				{
					$('#productErrorDiv').removeClass('hidden');
					$('#productListDiv').addClass('hidden');
					$('#breachedProductListDiv').addClass('hidden');
					$('#productListselectDiv').addClass('hidden');
					$('#cancelFlipButonsUl').removeClass('hidden');
					$('#FlipButonsUl').addClass('hidden');
					
				}
				else{				
					$("#productListselectDiv").empty();
					createFlipView(productList,cutoffProduct,strAction);
				}			
			});
			
			$('#discardFlipBtn').unbind('click');
			$('#discardFlipBtn').bind('click', function() {
				if(strPaymentType==="BATCHPAY"){
					if(rowAction === "rowAction" || rowAction === "groupAction" ){
						doHandlePaymentIntrumentCutoffAction('discard',false,
								paymentFxInfo.encryptedFxInfo,amtKeyValdation,cutoffProduct);
					}
					else if(rowAction === "Q")
					{
						doHandlePaymentInstrumentGroupAction('discard',paymentFxInfo.encryptedFxInfo,false,amtKeyValdation);	
					}
					else{	
						doHandlePaymentHeaderActions('discard',paymentFxInfo.encryptedFxInfo,'',
								amtKeyValdation,cutoffProduct);	
					}
				}else if(strPaymentType==="QUICKPAY"){
					doHandlePaymentInstrumentAction('discard',true,
							paymentFxInfo.encryptedFxInfo);
				}
				$('#fxPopupDiv').dialog("close");
			});
			$('#rejectFlipBtn').unbind('click');
			$('#rejectFlipBtn').bind('click', function() {
				if(strPaymentType==="BATCHPAY"){
					if(rowAction === "rowAction" || rowAction === "groupAction" ){
						showCutoffRejectRemarkPopUp('reject', 'Q', false,cutoffProduct);
					}
					else if(rowAction === "Q")
					{
						showCutoffRejectRemarkPopUp('reject', 'W', false,cutoffProduct);
					}
					else{	
						showCutoffRejectRemarkPopUp('reject', 'B', true,cutoffProduct);
					}				
				}else if(strPaymentType==="QUICKPAY"){
					showCutoffRejectRemarkPopUp('reject', 'Q', true,cutoffProduct);
				}
			});
			$('#rolloverFlipBtn').unbind('click');
			$('#rolloverFlipBtn').bind('click', function() {
				if(strPaymentType==="BATCHPAY"){
					if(rowAction === "rowAction" || rowAction === "groupAction" ){
						doHandlePaymentIntrumentCutoffAction(strAction,false,
								paymentFxInfo.encryptedFxInfo,amtKeyValdation,cutoffProduct);
					}
					else if(rowAction === "Q")
					{
						doHandlePaymentInstrumentGroupAction(strAction,paymentFxInfo.encryptedFxInfo,false,amtKeyValdation);	
					}
					else{	
						doHandlePaymentHeaderActions(strAction,paymentFxInfo.encryptedFxInfo,'',
								amtKeyValdation,cutoffProduct);
					}
				}else if(strPaymentType==="QUICKPAY"){
					doHandlePaymentInstrumentAction(strAction,true,
							paymentFxInfo.encryptedFxInfo,amtKeyValdation);}
				$('#fxPopupDiv').dialog("close");
			});				
			$('#okFlipBtn').unbind('click');
			$('#okFlipBtn').bind('click', function() {	
				
				var newproductmap = getNewProductMap();
				if(newproductmap == ""){
					$('#messageContentDivFlip').removeClass('hidden');
					$('#messageAreaFlip').empty().removeClass('hidden').append("Please select flip product for all products or take other cut off action.")
					return false;
				}
				clearTimeout(countdown);
				flipProduct = newproductmap;
				if(strPaymentType==="BATCHPAY"){
					if(rowAction === "rowAction" || rowAction === "groupAction" || rowAction === "Q"){
						doHandlePaymentIntrumentCutoffAction(strAction,false,
								paymentFxInfo.encryptedFxInfo,amtKeyValdation,cutoffProduct);
					}
					else if(rowAction === "Q")
					{
						doHandlePaymentInstrumentGroupAction(strAction,paymentFxInfo.encryptedFxInfo,false,amtKeyValdation);	
					}
					else{	
						doHandlePaymentHeaderActions(strAction,paymentFxInfo.encryptedFxInfo,'',
								amtKeyValdation,cutoffProduct);
					}					
				}else if(strPaymentType==="QUICKPAY"){
					doHandlePaymentInstrumentAction(strAction,true,
							paymentFxInfo.encryptedFxInfo,amtKeyValdation);
				}
				flipProduct = undefined ;
				$('#fxPopupDiv').dialog("close");
				$('#flipProductList').addClass('hidden');
			});
			$('#flipBtn').unbind('click');
			$('#flipBtn').bind('click', function() {
				//clearTimeout(countdown);
				$('#flipProductList').removeClass('hidden');
				if(null == productList)
				{
					$('#productErrorDiv').removeClass('hidden');
					$('#productListDiv').addClass('hidden');
					$('#breachedProductListDiv').addClass('hidden');
					$('#productListselectDiv').addClass('hidden');
					$('#cancelFlipButonsUl').removeClass('hidden');
					$('#FlipButonsUl').addClass('hidden');
					
				}
				else{				
					$("#productListselectDiv").empty();
					createFlipView(productList,cutoffProduct,strAction);
				}
			});
			$('#rejectBtn,#rejectPopupBtn').unbind('click');
			$('#rejectBtn,#rejectPopupBtn').bind('click', function() {
				if(strPaymentType==="BATCHPAY"){
					if(rowAction === "rowAction" || rowAction === "groupAction" )
					{
						showCutoffRejectRemarkPopUp('reject', 'Q', false,cutoffProduct);
					}
					else if(rowAction === "Q")
					{
						showCutoffRejectRemarkPopUp('reject', 'W', false,cutoffProduct);
					}
					else
					{
						showCutoffRejectRemarkPopUp('reject', 'B', true,cutoffProduct);
					}
				}else if(strPaymentType==="QUICKPAY"){
					showCutoffRejectRemarkPopUp('reject', 'Q', true,cutoffProduct);
				}
				
			});
			$('#flipProductList,#cutoffRLFlipButtonsUl,#cutoffNRFlipButtonsUl,#cutoffAuthNRFlipButtonsUl,#cutoffAuthRLFPButtonsUl').addClass('hidden');
			if('auth' === strAction && (errorCode == 'SHOWPOPUP,CUTOFF,ROLLOVER' || errorCode == 'SHOWPOPUP,FX,CUTOFF,ROLLOVER')){
				$('#cutoffAuthRLButtonsUl').removeClass('hidden');
				$('#cutoffAuthNRButtonsUl,#cutoffRLButtonsUl,#cutoffNRButtonsUl,#fxButonsUl').addClass('hidden');
			}
			else if('auth' === strAction && (errorCode == 'SHOWPOPUP,CUTOFF,ROLLOVER,FLIP' || errorCode == 'SHOWPOPUP,FX,CUTOFF,ROLLOVER,FLIP')){
				$('#cutoffAuthRLFPButtonsUl').removeClass('hidden');
				$('#cutoffAuthNRButtonsUl,#cutoffRLButtonsUl,#cutoffNRButtonsUl,#fxButonsUl,#cutoffAuthRLButtonsUl,#cutoffRLFlipButtonsUl, #cutoffNRFlipButtonsUl,#cutoffAuthNRFlipButtonsUl').addClass('hidden');
			}
			else if('auth' === strAction && (errorCode == 'SHOWPOPUP,CUTOFF,DISCARD,FLIP' || errorCode == 'SHOWPOPUP,FX,CUTOFF,DISCARD,FLIP')){
				$('#cutoffAuthNRFlipButtonsUl').removeClass('hidden');
				$('#cutoffAuthRLButtonsUl,#cutoffRLButtonsUl,#cutoffNRButtonsUl,#fxButonsUl,#cutoffAuthRLFPButtonsUl,#cutoffRLFlipButtonsUl, #cutoffNRFlipButtonsUl').addClass('hidden');
			}
			else if('auth' === strAction && (errorCode == 'SHOWPOPUP,CUTOFF,DISCARD' || errorCode == 'SHOWPOPUP,FX,CUTOFF,DISCARD')){
				$('#cutoffAuthNRButtonsUl').removeClass('hidden');
				$('#cutoffAuthRLButtonsUl,#cutoffRLButtonsUl,#cutoffNRButtonsUl,#fxButonsUl').addClass('hidden');
			}
			else if(errorCode == 'SHOWPOPUP,CUTOFF,ROLLOVER,FLIP' || errorCode == 'SHOWPOPUP,FX,CUTOFF,ROLLOVER,FLIP'){
				$('#cutoffRLFlipButtonsUl').removeClass('hidden');
				$('#cutoffAuthRLButtonsUl,#cutoffAuthNRButtonsUl,#cutoffNRButtonsUl,#fxButonsUl,#cutoffRLButtonsUl,#cutoffAuthRLFPButtonsUl, #cutoffNRFlipButtonsUl, #cutoffAuthNRFlipButtonsUl').addClass('hidden');
			}
			else if(errorCode == 'SHOWPOPUP,CUTOFF,DISCARD,FLIP' || errorCode == 'SHOWPOPUP,FX,CUTOFF,DISCARD,FLIP'){
				$('#cutoffNRFlipButtonsUl').removeClass('hidden');
				$('#cutoffAuthRLButtonsUl,#cutoffAuthNRButtonsUl,#cutoffRLButtonsUl,#fxButonsUl,#cutoffAuthRLFPButtonsUl,#cutoffRLFlipButtonsUl, #cutoffAuthNRFlipButtonsUl').addClass('hidden');
			}
			else if(errorCode == 'SHOWPOPUP,CUTOFF,ROLLOVER' || errorCode == 'SHOWPOPUP,FX,CUTOFF,ROLLOVER'){
				$('#cutoffRLButtonsUl').removeClass('hidden');
				$('#cutoffAuthRLButtonsUl,#cutoffAuthNRButtonsUl,#cutoffNRButtonsUl,#fxButonsUl,#cutoffRLFlipButtonsUl, #cutoffAuthNRFlipButtonsUl').addClass('hidden');
			}
			else if(errorCode == 'SHOWPOPUP,CUTOFF,DISCARD' || errorCode == 'SHOWPOPUP,FX,CUTOFF,DISCARD'){
				$('#cutoffNRButtonsUl').removeClass('hidden');
				$('#cutoffAuthRLButtonsUl,#cutoffAuthNRButtonsUl,#cutoffRLButtonsUl,#fxButonsUl,#cutoffRLFlipButtonsUl, #cutoffAuthNRFlipButtonsUl').addClass('hidden');
			}
			
			else if(errorCode == 'SHOWPOPUP,FX'){
				$('#fxButonsUl').removeClass('hidden');
				$('#cutoffAuthRLButtonsUl,#cutoffAuthNRButtonsUl,#cutoffRLButtonsUl,#cutoffNRButtonsUl').addClass('hidden');
			}
			if(errorCode.indexOf('FX') != -1 && errorCode.indexOf('CUTOFF') != -1){
				$('#disclaimerTextcutoffFXDivView').removeClass('hidden');
				$('#disclaimerTextcutoffDivView, #disclaimerTextFXDivView').addClass('hidden');
				$('#fxDiscalimer').removeClass('hidden');
			}
			else if(errorCode.indexOf('CUTOFF') != -1){
				$('#disclaimerTextcutoffDivView').removeClass('hidden');
				$('#disclaimerTextcutoffFXDivView, #disclaimerTextFXDivView').addClass('hidden');
				$('#fxDiscalimer').addClass('hidden');
			}
			else if(errorCode.indexOf('FX') != -1){
				$('#disclaimerTextFXDivView').removeClass('hidden');
				$('#disclaimerTextcutoffDivView, #disclaimerTextcutoffFXDivView').addClass('hidden');
				$('#fxDiscalimer').removeClass('hidden');
			}
			else if (errorCode.indexOf('WARN') != -1 && 'Y' == flag) {
				$('#disclaimerTextcutoffDivView').removeClass('hidden');
				$('#disclaimerTextcutoffFXDivView, #disclaimerTextFXDivView')
						.addClass('hidden');
				$('#fxDiscalimer').addClass('hidden');
				$('#cutoffAuthRLButtonsUl,#cutoffAuthNRButtonsUl,#cutoffRLButtonsUl,#cutoffNRButtonsUl,#cutoffAuthRLFPButtonsUl').addClass('hidden');
				$('#cutoffRLFlipButtonsUl').removeClass('hidden');
			}	
			else if (errorCode.indexOf('WARN') != -1) {
				$('#disclaimerTextcutoffDivView').removeClass('hidden');
				$('#disclaimerTextcutoffFXDivView, #disclaimerTextFXDivView')
						.addClass('hidden');
				$('#fxDiscalimer').addClass('hidden');
				$('#cutoffRLButtonsUl').removeClass('hidden');
				$('#cutoffRLFlipButtonsUl').addClass('hidden');
			}	
			else if (errorCode.indexOf('GD0002') != -1 && 'Y' == flag) {
				$('#disclaimerTextcutoffDivView').removeClass('hidden');
				$('#disclaimerTextcutoffFXDivView, #disclaimerTextFXDivView')
						.addClass('hidden');
				$('#fxDiscalimer').addClass('hidden');
				$('#cutoffAuthRLButtonsUl,#cutoffAuthNRButtonsUl,#cutoffRLButtonsUl,#cutoffNRButtonsUl,#cutoffAuthRLFPButtonsUl').addClass('hidden');
				$('#cutoffNRFlipButtonsUl').removeClass('hidden');
			}	
			else if (errorCode.indexOf('GD0002') != -1) {
				$('#disclaimerTextcutoffDivView').removeClass('hidden');
				$('#disclaimerTextcutoffFXDivView, #disclaimerTextFXDivView')
						.addClass('hidden');
				$('#fxDiscalimer').addClass('hidden');			
				$('#cutoffNRButtonsUl').removeClass('hidden');			
			}
			
			
			var confidentialFlag = paymentFxInfo.confidentialFlag;
			var formattedAmtValue = paymentFxInfo.formattedAmtValue;
			
			var debitCcy = paymentFxInfo.debitCurrency;
			if (typeof debitCcy == "undefined") {
				debitCcy = '';
			}
			var paymentCcy = paymentFxInfo.paymentCurrency;
			if (typeof paymentCcy == "undefined") {
				paymentCcy = '';
			}
			if('auth' === strAction && strAuthLevelGlb == 'I')
			{
				$("#batchCutoffPopup").addClass('hidden');
				var cutoffPaymentProduct = document.getElementById("cutoffPaymentProduct");
				cutoffPaymentProduct.innerHTML  = cutoffProductDesc;
				$("#cutOffPaymentProductDiv").removeClass('hidden');
			}
			else
			{
				if(confidentialFlag)
				{
					var debitAmtRef = document.getElementById("debitAmt");
					debitAmtRef.innerHTML  = formattedAmtValue;
					var debitCcyRef = document.getElementById("debitCcy");
					debitCcyRef.innerHTML  = "";
					debitAmtRef.setAttribute('title', formattedAmtValue);
					debitCcyRef.setAttribute('title', formattedAmtValue);
					var paymentAmtRef = document.getElementById("paymentAmt");
					paymentAmtRef.innerHTML  = formattedAmtValue;
					var paymentCcyRef = document.getElementById("paymentCcy");
					paymentCcyRef.innerHTML  = "";
					paymentAmtRef.setAttribute('title', formattedAmtValue);
					paymentCcyRef.setAttribute('title', formattedAmtValue);
				}			
				else
				{
					var debitAmtRef = document.getElementById("debitAmt");
					debitAmtRef.innerHTML  = debitAmntVal;
					var debitCcyRef = document.getElementById("debitCcy");
					debitCcyRef.innerHTML  = debitCcy;
					debitAmtRef.setAttribute('title', debitAmntVal+' '+paymentFxInfo.debitCurrency);
					debitCcyRef.setAttribute('title', debitAmntVal+' '+paymentFxInfo.debitCurrency);
					
				var paymentAmtRef = document.getElementById("paymentAmt");
					paymentAmtRef.innerHTML  = paymentFxInfo.paymentAmount;
					var paymentCcyRef = document.getElementById("paymentCcy");
					paymentCcyRef.innerHTML  = paymentCcy;
					paymentAmtRef.setAttribute('title', paymentFxInfo.paymentAmount+' '+paymentFxInfo.paymentCurrency);
					paymentCcyRef.setAttribute('title', paymentFxInfo.paymentAmount+' '+paymentFxInfo.paymentCurrency);
				}
			}
			
			var fxRateRef = document.getElementById("fxRateInfo");
			fxRateRef.innerHTML  = fxRateVal;
			fxRateRef.setAttribute('title', fxRateVal);
			var valueDateRef = document.getElementById("valueDate");
			valueDateRef.innerHTML  = paymentFxInfo.valueDate;
			var paymentRef = document.getElementById("paymentRef");
			if (typeof paymentFxInfo.paymentRef == "undefined")	
			{
				paymentRef.innerHTML = '';
			}
			else
			{
			paymentRef.innerHTML  = paymentFxInfo.paymentRef;
			}
			paymentRef.setAttribute('title', paymentFxInfo.paymentRef);
		}
	
		
}

function doHandelBatchPayAction(strAction,fxInfo,cutoffProduct)
{
	if(rowAction === "rowAction" || rowAction === "groupAction" )
	{
		doHandlePaymentIntrumentCutoffAction(strAction,false,
				fxInfo,amtKeyValdation,cutoffProduct);
	}
	else if(rowAction === "Q")
	{
		doHandlePaymentInstrumentGroupAction(strAction,fxInfo,false,amtKeyValdation);
	}
	else
	{
		doHandlePaymentHeaderActions(strAction,fxInfo,'',
				amtKeyValdation,cutoffProduct);
	}
}

function countdownClear() {
	clearTimeout(countdown);
}
function doSubmitPaymentInstrument(strAction, strRemarks, callbackfunctionOnAjaxComplete) {
	var arrayJson = new Array();
	var cutOffInst =   {"instruments":[]};
	var strMsg = !isEmpty(strRemarks) ? strRemarks : '';
	if (strPaymentInstrumentIde) {
			arrayJson.push({
						serialNo : 0,
						identifier : strPaymentInstrumentIde,
						userMessage : strMsg
					});
		$('#button_btnBack').attr('disabled', true);
		Ext.Ajax.request({
			url : _mapUrl['submitInstrumentUrl'] + '.json',
			//	contentType : "application/json",
			jsonData : Ext.encode(arrayJson),
			method : 'POST',
			requestcomplete : function(XMLHttpRequest, textStatus) {
				if ("error" == textStatus) {
					var arrError = new Array();
					arrError.push({
								"errorCode" : "Message",
								"errorMessage" : mapLbl['unknownErr']
							});
					paintErrors(arrError);
					blockPaymentInstrumentUI(false);
				}
			},
			success : function(response) {
				var jsonRes = Ext.decode( response.responseText );
				var productList;
				if (jsonRes && jsonRes.d && jsonRes.d.instrumentActions) {
					var arrResult = jsonRes.d.instrumentActions,objResult  = null,isError = false;
					if (arrResult && arrResult.length == 1) {
						objResult = arrResult[0];
						if (objResult.success === 'Y') {
							if(objResult.updatedStatusCode === '7' && strPayProductCategoryType === 'R')
							{
								 var pirsFound = processRealTimePirs(jsonRes,'','instEntrySubmit');
								 if(!pirsFound){
								 	if (objResult.isWarning === 'Y') {
								 		doClearMessageSection();
										paintErrors(objResult.errors,'',mapLbl['warnMsg'])
								 		$('#button_btnSubmit').unbind('click');
										if (objResult.updatedStatusCode !='7')
										{
												$('#button_btnBack').attr('disabled', false);
												$('#button_btnSubmit').bind('click', function(){
										 			goToPage(_mapUrl['cancelInstrumentUrl'],'frmMain');
												});
										}	
									} else
									goToPage(_mapUrl['cancelInstrumentUrl'], 'frmMain');
								 }
							}
							else
							{
								if (objResult.isWarning === 'Y') {
										doClearMessageSection();
										paintErrors(objResult.errors,'',mapLbl['warnMsg']);
								 		$('#button_btnSubmit').unbind('click');
								 		if (objResult.updatedStatusCode !='7')
										{
												$('#button_btnBack').attr('disabled', false);
												$('#button_btnSubmit').bind('click', function(){
										 			goToPage(_mapUrl['cancelInstrumentUrl'],'frmMain');
												});
										}
									} else
								goToPage(_mapUrl['cancelInstrumentUrl'], 'frmMain');
							}
						} else if (objResult.success === 'N') {
							if (objResult.errors) {
								doClearMessageSection();
								blockPaymentInstrumentUI(false);
								var arrError = objResult.errors, isProductCutOff = false, errCode = null;
								if (arrError && arrError.length > 0) {
									$.each(arrError, function(index, error) {
												strMsg = error.errorMessage;
												errCode = error.code;
												if (errCode
														&& (errCode
																.toUpperCase()
																.indexOf("WARN") >= 0)
														|| errCode === 'GD0002') {
													isProductCutOff = true;
												}
												
											});
								}

								if (isProductCutOff) {
									var strIsRollover = 'N', strIsReject = 'N', strIsDiscard = 'N',strTitle = mapLbl['warnMsg'],args = {};;
									var strMsg = mapLbl['instrumentProductCutoffMsg'];
									if (!Ext.isEmpty(errCode)
											&& errCode.substr(0, 4) === 'WARN') {
										strIsRollover = 'Y';
										strIsDiscard = 'Y';
									} else if (!Ext.isEmpty(errCode)
											&& errCode === 'GD0002') {
										strIsDiscard = 'Y';
										strMsg = mapLbl['lblErrMsgCutOffDiscard'];
									}
									args.action = strAction;
									args.isRollover = strIsRollover;
									args.isReject = strIsReject;
									args.isDiscard = strIsDiscard;
									showPaymentEntryCutoffAlert(
											212,
											350,
											strTitle,
											strMsg,
											postHandlePaymentInstrumentActionsProductCutOff,
											args);
								}
								else {
									doClearMessageSection();
									// paintErrors(arrError);
									$('#button_btnBack').attr('disabled', false);
									paintErrors(objResult.errors);
									blockPaymentInstrumentUI(false);
								}
							}
						}
						else if(objResult.success === 'FX'){
								var arrError = objResult.errors , errCode = null;
								if (arrError && arrError.length > 0) {
									$.each(arrError, function(index, error) {
											errCode = error.code;
									});
								}
							if(isNaN(fxTimer))  fxTimer = 10;
							cutOffInst.instruments.push({
							    "paymentFxInfo": objResult.paymentFxInfo,
							    "strAction":strAction,
							    "errorCode" : errCode
							  });
							if(cutOffInst && cutOffInst.instruments && cutOffInst.instruments.length > 0)
							{
								countdownInstTimerVal = null;
								isInstCutOff=  true;
								if (isNaN(fxTimer))
									fxTimer = 10;
								var countdown_number = 60 * fxTimer;
								countdownInstTimerVal = countdown_number;
								takeCutOffInstrumentAction(cutOffInst,0, productList,null);
								showCutOffTimer(countdownInstTimerVal);
							}
						}
					}
				}
				else if (jsonRes && jsonRes.d.auth == "AUTHREQ" )
				{
					$('#button_btnBack').attr('disabled', false);
					$('#button_btnSubmit').attr('disabled', false);
				}
				/*if(!Ext.isEmpty(callbackfunctionOnAjaxComplete)) {
					Ext.callback(callbackfunctionOnAjaxComplete);
				}*/
			},
			failure : function() {
				var arrError = new Array();
				arrError.push({
							"errorCode" : "Message",
							"errorMessage" : mapLbl['unknownErr']
						});
				paintErrors(arrError);
				blockPaymentInstrumentUI(false);
				if(!Ext.isEmpty(callbackfunctionOnAjaxComplete)) {
					Ext.callback(callbackfunctionOnAjaxComplete);
				}
			}
		});
	}
}
function doDiscardPaymentInstrument(strAction, strRemarks, strUrl,blnRedirectToSummary) {
	var arrayJson = new Array();
	var strURLl = _mapUrl['batchHeaderActionUrl'] + '/' + strAction + '.json';
	var jsonIndex = 0 ;

	if((rowAction === "rowAction" || rowAction === "groupAction"))
	{
		if(rowJsonData != null)
		{			
			jsonIndex = getIndexFromJsonArray(rowJsonData,parseInt(instRowIndex,10));		
			strPaymentInstrumentIde = rowJsonData[jsonIndex].identifier;			
		}
		else
		{
			strPaymentInstrumentIde = strDtlIdentifierForInfo;
		}
		strURLl = _mapUrl['gridGroupActionUrl'] + '/' + strAction + '.json';
	}
	else if(rowAction === "Q"){
		strURLl = _mapUrl['gridGroupActionUrl'] + '/' + strAction + '.json';
		strPaymentInstrumentIde = strDtlIdentifierForInfo;
	}
	
	if (strPaymentInstrumentIde) {
		if (isEmpty(strRemarks)) {
			arrayJson.push({
						serialNo : 0,
						identifier : strPaymentInstrumentIde,
						userMessage : ''
					});
		} else {
			arrayJson.push({
						serialNo : 0,
						identifier : strPaymentInstrumentIde,
						userMessage : strRemarks
					});
		}
		$.ajax({
			url : strURLl,
			contentType : "application/json",
			data : JSON.stringify(arrayJson),
			type : 'POST',
			async : false,
			complete : function(XMLHttpRequest, textStatus) {
				if ("error" == textStatus) {
					var arrError = new Array();
					arrError.push({
								"errorCode" : "Message",
								"errorMessage" : mapLbl['unknownErr']
							});
					paintErrors(arrError);
					blockPaymentUI(false);
				}
			},
			success : function(jsonRes) {
				if (jsonRes && jsonRes.d && jsonRes.d.instrumentActions) {
					var arrResult = jsonRes.d.instrumentActions;
					var isError = false;
					if (arrResult && arrResult.length == 1) {
						if (arrResult[0].success === 'Y') {
							if(blnRedirectToSummary)
							{
								goToPage(_mapUrl[(strUrl || 'cancelInstrumentUrl')], 'frmMain');
							}
							else
							{
								if (typeof objInstrumentEntryGrid != 'undefined'
									&& objInstrumentEntryGrid) {
									objInstrumentEntryGrid.refreshData();
									$('#transactionWizardViewPopup').dialog('close');
									}
							}
						} 
						else if (arrResult[0].success === 'N') {
							doClearMessageSection();
							paintErrors(arrResult[0].errors);
						}
					}
					if(isEmpty(jsonRes.d.instrumentActions) && jsonRes.d.__count === 0)
					{
						if(blnRedirectToSummary)
							{
								goToPage(_mapUrl[(strUrl || 'cancelInstrumentUrl')], 'frmMain');
							}
							else
							{
								if (typeof objInstrumentEntryGrid != 'undefined'
									&& objInstrumentEntryGrid) {
									objInstrumentEntryGrid.refreshData();
									$('#transactionWizardViewPopup').dialog('close');
									}
							}
					}
				}
				else
				{
					if (typeof objInstrumentEntryGrid != 'undefined'
						&& objInstrumentEntryGrid) {
						objInstrumentEntryGrid.refreshData();
						$('#transactionWizardViewPopup').dialog('close');
						}
				}
			},
			failure : function() {
				var arrError = new Array();
				arrError.push({
							"errorCode" : "Message",
							"errorMessage" : mapLbl['unknownErr']
						});
				paintErrors(arrError);
			}
		});
	}
}
function postHandleSavePaymentInstrument(data, args) {
	var status = null, isBtnVisible = true, isFileUpload = true;
	var action = args.action;
	if (data && data.d) {
		paymentResponseInstrumentData = data;
		if (data.d.paymentEntry && data.d.paymentEntry.message
				&& data.d.paymentEntry.message.success)
			status = data.d.paymentEntry.message.success;
		// This is used to handle the control total validation
		// var blnFlag = doValidationForControlTotal();
		// isBtnVisible = blnFlag ? isAddAnotherTxnButtonVisible(data) : true;

		if (status === 'SUCCESS' || status === 'SAVEWITHERROR') {
			if (data.d.paymentEntry && data.d.__metadata
					&& data.d.__metadata._detailId) {
				strPaymentInstrumentIde = data.d.__metadata._detailId;
			}
			toggleDirtyBit(true);
			// TODO: To be verified
			// if (data.d.paymentEntry && data.d.paymentEntry.paymentHeaderInfo)
			// {
			// populatePaymentHeaderViewOnlySection(null,
			// data.d.paymentEntry.paymentHeaderInfo, 'Y');
			// //
			// updatePaymentSummaryHeaderInfo(data.d.paymentEntry.paymentHeaderInfo);
			// }

			if (!isEmpty(data.d.paymentEntry.message.pirNo)) {
				var msgDtls = {
					'pirNo' : data.d.paymentEntry.message.pirNo,
					'uniqueRef' : data.d.paymentEntry.message.uniqueRef,
					'txnReference' : $('#referenceNo').val()
				};
				// paintSuccessMsg(msgDtls, 'Q');
			}
			
			if(data.d.paymentEntry.paymentMetaData._docUploadEnabled){
				if(data.d.paymentEntry.paymentMetaData._docUploadEnabled === 'Y'){
					if ($("#paymentImageFile") && $("#paymentImageFile")[0]
					&& $("#paymentImageFile")[0].files && $("#paymentImageFile")[0].files[0]) {
						isFileUpload = uploadAttachedDocumentFile(strPaymentInstrumentIde);
					}
				}
			}
			
			if (status === 'SUCCESS' || status === 'SAVEWITHERROR'
					|| status === 'UPDATEWITHERROR') {
				switch (action) {
					case 'SAVE' :
						paintPaymentInstrumentActions('UPDATE', isBtnVisible);
						doClearMessageSection();
						break;
					case 'UPDATE' :
						paintPaymentInstrumentActions('UPDATE', isBtnVisible);
						doClearMessageSection();
						break;
					case 'SAVEANDADD' :
					case 'UPDATEANDADD' :
						if (status !== 'SAVEWITHERROR') {
							postHandleSaveAndAddPaymentInstrument();
						}
						break;
					case 'UPDATEANDNEXT' :
						if (status != 'UPDATEWITHERROR' && status != 'SAVEWITHERROR' && isFileUpload === true) {
							togglePaymentInstrumentEditScreen(true);
						}
						break;
					case 'SAVEANDNEXT' :
						if (status != 'UPDATEWITHERROR' && status != 'SAVEWITHERROR' && isFileUpload === true) {
							togglePaymentInstrumentEditScreen(true);
						}
						break;
					default :
						break;
				}
				if (action === 'SAVE' || action === 'UPDATE'
						|| action === 'SAVEANDADD' || action === 'UPDATEANDADD'
						|| action === 'SAVEANDEXIT'
						|| action === 'UPDATEANDEXIT') {
					// if (!isEmpty(data.d.paymentEntry.paymentHeaderInfo)) {
					// var payHeaderInfo =
					// data.d.paymentEntry.paymentHeaderInfo;
					// var flagControlTotal = doValidationForControlTotal();
					// // Update control total amount and number of instruments
					// // if control total validation is not set.
					// if ((!isEmpty(payHeaderInfo.hdrTotalNo))
					// && (!isEmpty(payHeaderInfo.totalAmount))
					// && !flagControlTotal) {
					// $('#totalNoHdr').val(payHeaderInfo.hdrTotalNo);
					// $('#amountHdr').val(payHeaderInfo.totalAmount);
					// }
					// }
				}
				if (status === 'SAVEWITHERROR') {
					if (data.d.paymentEntry.message.errors)
						paintErrors(data.d.paymentEntry.message.errors);
					if (action === 'SAVEANDADD' || action === 'UPDATEANDADD'
							|| action === 'SAVEANDEXIT'
							|| action === 'UPDATEANDEXIT') {
						paintPaymentInstrumentActions('UPDATEWITHERROR',
								isBtnVisible);
						// doShowSaveWithErrorConfirmationDialog(action);
					}
					if(!isEmpty(strPaymentInstrumentIde))
					{
						paintPaymentInstrumentActions('EDIT',
								isBtnVisible);
					}
					var arrError = data.d.paymentEntry.message.errors;
					var isProductCutOff = false;
					var strMsg = getLabel('instrumentProductCutoffMsg',
							'Cut Off time Exceeded, Do you want to Proceed ?'), errCode = null;
					if (arrError && arrError.length > 0) {
						$.each(arrError, function(index, error) {
							// strMsg = error.errorMessage;
							errCode = error.errorCode;
							if (errCode
									&& (errCode.toUpperCase().indexOf("WARN") >= 0)) {
								isProductCutOff = true;
							}
						});
					}
					if (isProductCutOff) {
						doClearMessageSection();
						var strTitle = mapLbl['warnMsg'];
						showAlert(160, 350, strTitle, strMsg,
								handleProductCutOffForInstrument, args);
					} else {
						if (data.d.paymentEntry.message.errors)
							paintErrors(data.d.paymentEntry.message.errors);
						// paintErrors(data.d.paymentEntry.message.errors);
					}

				}
			}
		} else if (status === 'FAILED') {
			if (data.d.paymentEntry.message) {
				var arrError = data.d.paymentEntry.message.errors;
				var isProductCutOff = false;
				var strMsg = mapLbl['instrumentProductCutoffMsg'], errCode = null;
				if (arrError && arrError.length > 0) {
					$.each(arrError, function(index, error) {
						// strMsg = error.errorMessage;
						errCode = error.errorCode;
						if (errCode
								&& (errCode.toUpperCase().indexOf("WARN") >= 0)) {
							isProductCutOff = true;
						}
					});
				}
				if (isProductCutOff) {
					doClearMessageSection();
					var strTitle = mapLbl['warnMsg'];
					showAlert(130, 300, strTitle, strMsg,
							handleProductCutOffForInstrument, args);
				} else {
					paintErrors(data.d.paymentEntry.message.errors);
				}
			}
		} else if (isEmpty(status) && data.d && data.d.paymentEntry && data.d.paymentEntry.message && data.d.paymentEntry.message.errors) {
			// $('#successMessageArea').addClass('hidden');
			paintErrors(data.d.paymentEntry.message.errors);
		}
	}
}

function handleProductCutOffForInstrument(blnCanContinue, args) {
	var strAction = args.action;
	if (strAction && blnCanContinue) {
		switch (strAction) {
			case 'SAVE' :
				doSavePaymentInstrument(true);
				break;
			case 'UPDATE' :
				doUpdatePaymentInstrument(true);
				break;
			case 'UPDATEANDNEXT' :
				doUpdateAndNextPaymentInstrument(true);
				break;
		}
	}
}

// TODO: To be verified
function populateBankProductFieldDetail() {
	var _strMyProduct = strMyProduct;
	var _strCcy = $('#txnCurrency').val();
	var _strdrCrFlag = 'B';
	var isCrChecked = $('#drCrFlagC').is(':checked');
	var isDrChecked = $('#drCrFlagD').is(':checked');
	var strUrl = 'services/bankproduct/'
	if (isCrChecked && isDrChecked)
		_strdrCrFlag = 'B';
	else if (isCrChecked)
		_strdrCrFlag = 'C';
	else if (isDrChecked)
		_strdrCrFlag = 'D';
	if (!isEmpty(_strMyProduct) && !isEmpty(_strCcy) && !isEmpty(_strdrCrFlag)) {
		strUrl += _strMyProduct + '/' + _strCcy + '/' + _strdrCrFlag + '.json';
		blockPaymentInstrumentUI(true);
		doClearMessageSection();
		$.ajax({
			type : "POST",
			url : strUrl,
			async : false,
			complete : function(XMLHttpRequest, textStatus) {
				if ("error" == textStatus) {
					blockPaymentInstrumentUI(false);
					var arrError = new Array();
					arrError.push({
								"errorCode" : "Message",
								"errorMessage" : mapLbl['unknownErr']
							});
					paintErrors(arrError);
				}
			},
			success : function(data) {
				if (data != null) {
					if (data && data.d && data.d && data.d.seek) {
						var obj = data.d.seek;
						var arrData = new Array();
						if ($.isArray(obj)) {
							arrData = obj[0];
							if (arrData) {
								populateSelectFieldValue('bankProduct',
										arrData, '');
								if (arrData.length === 1) {
									loadPaymentInstrumentBankProductFields();
									$('#drCrFlagD, #drCrFlagC').attr("checked",
											false);
									populateRadioFieldValue('drCrFlag',
											_strdrCrFlag);
									if (strLayoutType
											&& (strLayoutType === 'ACCTRFLAYOUT' || strLayoutType === 'SIMPLEACCTRFLAYOUT' || strLayoutSubType === 'DRAWDOWN'))
										toggleAccountLabel(null, _strdrCrFlag);
									//blockPaymentInstrumentUI(false);	
								}
								blockPaymentInstrumentUI(false);
							}

						} else if (obj.error) {
							var errObj = [{
								errorMessage : mapLbl['drCrFlagError_'
										+ _strdrCrFlag],
								errorCode : 'ERR'
							}];
							paintErrors(errObj);
							blockPaymentInstrumentUI(false);
						}
					}

				}
			}
		});
	}
}

function paintPaymentDtlAdditionalInformationSection(strIdentifier, strPmtType, strMode) {
	var strPostFix = '_InfoSpan';
	var blnCollapsed = false;
	 strDtlIdentifier = strIdentifier;
	 strInfoCallFrom = "DETAIL";
	$('#paymentInstrumentTrasanctionSummaryDiv .canClear').empty();
	//$('#paymentInstrumentTrasanctionSummaryDiv').removeClass('hidden');
	if ($('#paymentInstrumentTrasanctionSummaryDiv .vertical-collapsible-contents')
			.hasClass('content-display-none')) {
		$('#paymentInstrumentTrasanctionSummaryDiv span.expand-vertical')
				.trigger('click');
		blnCollapsed = true;
	}
	paintPaymentInformation(strPostFix, strIdentifier, strPmtType, blnCollapsed, strMode);
}

/** Additional Information Section handling starts here * */

function paintPaymentInformation(strPostFix, strIdentifier, strPmtType, blnCollapsed, strMode) {
	var strPostFix = '_InfoSpan', fieldName = null, strValueToBeDisplayed = null, intMaxFieldLength = 20, blnHistoryExists = false, strAuthLevel = 'B',strhdrActionStatus ='',strPaymentAdditionalData = null, arrInstStdFields=[], selectedBankProductCode = null, selectedBankProductDesc = null,strApprovalStructData = null;
	//strIdentifierForInfo = strIdentifier;
	// if (isEmpty(strPaymentAdditionalInfoData))

		if(strPmtType === 'B'){
	 if (paymentResponseHeaderData
				&& paymentResponseHeaderData.d
				&& paymentResponseHeaderData.d.paymentEntry
				&& paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo
				&& paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo)
		strPaymentAdditionalData = paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo;	
		
		if (paymentResponseHeaderData
				&& paymentResponseHeaderData.d
				&& paymentResponseHeaderData.d.paymentEntry
				&& paymentResponseHeaderData.d.paymentEntry.paymentCompanyInfo
				&& paymentResponseHeaderData.d.paymentEntry.paymentCompanyInfo.company
				&& paymentResponseHeaderData.d.paymentEntry.paymentCompanyInfo.companyAddress){
			strCompany = paymentResponseHeaderData.d.paymentEntry.paymentCompanyInfo.company;		
			companyAddress = paymentResponseHeaderData.d.paymentEntry.paymentCompanyInfo.companyAddress;
			$(".hdrCompanyDetails_InfoSpan").text(strCompany + ' '+ companyAddress);
		}
		}
		if (paymentResponseInstrumentData
				&& paymentResponseInstrumentData.d
				&& paymentResponseInstrumentData.d.paymentEntry
				&& paymentResponseInstrumentData.d.paymentEntry.standardField)			{
			arrInstStdFields = paymentResponseInstrumentData.d.paymentEntry.standardField;
			if (arrInstStdFields && arrInstStdFields.length > 0) {
				$.each(arrInstStdFields, function(index, cfg) {
					if("drCrFlag"==cfg.fieldName){
						updateTxnType(cfg.value);
					}
					if("bankProduct" === cfg.fieldName
							&& cfg.availableValues
							&& cfg.availableValues.length === 1
							&& cfg.availableValues[0].description){
						$('.bankProductDescription_InfoSpan').text(cfg.availableValues[0].description);										
					} else if("bankProduct" === cfg.fieldName
							&& cfg.availableValues
							&& cfg.availableValues.length > 1
							&& !isEmpty(cfg.value)){
						var selectedBankProductCode = cfg.value;
						$.each(cfg.availableValues, function(index, availableValue) {
							if(availableValue.code === selectedBankProductCode){
								selectedBankProductDesc = availableValue.description;
							}
						});
						if(!isEmpty(selectedBankProductDesc))
							$('.bankProductDescription_InfoSpan').text(selectedBankProductDesc);
					}else if("accTrfType" === cfg.fieldName
							&& !isEmpty(cfg.value)){
							if(cfg.value === 'P')
								$('.hdrRemarks_InfoSpanDiv').removeClass('hidden');
					}
				});
			}
		} else if (paymentResponseHeaderData
				&& paymentResponseHeaderData.d
				&& paymentResponseHeaderData.d.paymentEntry
				&& paymentResponseHeaderData.d.paymentEntry.standardField){
			arrInstStdFields = paymentResponseHeaderData.d.paymentEntry.standardField;
			if (arrInstStdFields && arrInstStdFields.length > 0) {
				$.each(arrInstStdFields, function(index, cfg) {
					if("bankProduct" === cfg.fieldName
							&& cfg.availableValues
							&& cfg.availableValues.length === 1
							&& cfg.availableValues[0].description){
						$('.bankProductDescription_InfoSpan').text(cfg.availableValues[0].description);
					} else if("bankProduct" === cfg.fieldName
							&& cfg.availableValues
							&& cfg.availableValues.length > 1
							&& !isEmpty(cfg.value)){
						var selectedBankProductCode = cfg.value;
						$.each(cfg.availableValues, function(index, availableValue) {
							if(availableValue.code === selectedBankProductCode){
								selectedBankProductDesc = availableValue.description;
							}
						});
						if(!isEmpty(selectedBankProductDesc))
							$('.bankProductDescription_InfoSpan').text(selectedBankProductDesc);
					}else if("accTrfType" === cfg.fieldName
							&& !isEmpty(cfg.value)){
							if(cfg.value === 'P')
								$('.hdrRemarks_InfoSpanDiv').removeClass('hidden');
					}
				});
			}
		}
		if (strPmtType === 'Q'
			&& paymentResponseInstrumentData
			&& paymentResponseInstrumentData.d
			&& paymentResponseInstrumentData.d.paymentEntry
			&& paymentResponseInstrumentData.d.paymentEntry.paymentHeaderInfo
			&& paymentResponseInstrumentData.d.paymentEntry.paymentHeaderInfo)
		strPaymentAdditionalData = paymentResponseInstrumentData.d.paymentEntry.paymentHeaderInfo;
		if (strPmtType === 'Q'
			&& paymentResponseInstrumentData
			&& paymentResponseInstrumentData.d
			&& paymentResponseInstrumentData.d.paymentEntry
			&& paymentResponseInstrumentData.d.paymentEntry.paymentCompanyInfo
			&& paymentResponseInstrumentData.d.paymentEntry.paymentCompanyInfo.company
			&& paymentResponseInstrumentData.d.paymentEntry.paymentCompanyInfo.companyAddress){
			strCompany = paymentResponseInstrumentData.d.paymentEntry.paymentCompanyInfo.company;
			companyAddress = paymentResponseInstrumentData.d.paymentEntry.paymentCompanyInfo.companyAddress;
			$(".hdrCompanyDetails_InfoSpan").text(strCompany + ' '+ companyAddress);				
			}

	strPaymentAdditionalInfoData = getPaymentAddtionInformationData(strInfoCallFrom,strIdentifier, function(strPaymentAdditionalInfoData) {
	if (strPaymentAdditionalInfoData) {
		if (strPmtType === 'Q'
				&& paymentResponseInstrumentData
				&& paymentResponseInstrumentData.d
				&& paymentResponseInstrumentData.d.paymentEntry
				&& paymentResponseInstrumentData.d.paymentEntry.paymentHeaderInfo
				&& paymentResponseInstrumentData.d.paymentEntry.paymentHeaderInfo.authLevel)
			strAuthLevelGlb = strAuthLevel = paymentResponseInstrumentData.d.paymentEntry.paymentHeaderInfo.authLevel;
		else if (paymentResponseHeaderData
				&& paymentResponseHeaderData.d
				&& paymentResponseHeaderData.d.paymentEntry
				&& paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo
				&& paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.authLevel)
			strAuthLevelGlb = strAuthLevel = paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.authLevel;
		if (strPmtType === 'Q'
				&& paymentResponseInstrumentData
				&& paymentResponseInstrumentData.d
				&& paymentResponseInstrumentData.d.paymentEntry
				&& paymentResponseInstrumentData.d.paymentEntry.paymentHeaderInfo
				&& paymentResponseInstrumentData.d.paymentEntry.paymentHeaderInfo.hdrActionStatus)
			strhdrActionStatus = paymentResponseInstrumentData.d.paymentEntry.paymentHeaderInfo.hdrActionStatus;
		else if (paymentResponseHeaderData
				&& paymentResponseHeaderData.d
				&& paymentResponseHeaderData.d.paymentEntry
				&& paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo
				&& paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.hdrActionStatus)
			strhdrActionStatus = paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.hdrActionStatus;
		
		hdrActionStatusTmp = strhdrActionStatus ; 
        strApprovalStructData = paintApprovalStructureInformation(strPostFix, strIdentifier);
      
		$.each(strPaymentAdditionalInfoData, function(fieldName, fieldValue) {
			intMaxFieldLength = strPmtType && strPmtType ==='Q' ? 20 : 25;
			if (fieldName === 'importedFilesCount' && fieldValue != "0") {
				$("." + fieldName + strPostFix).unbind('click');
				$("." + fieldName + strPostFix).bind('click', function() {
							openFilesImportedPopup(strIdentifier);
						});
			} else {

			}
			if (fieldName === 'history' && !isEmpty(fieldValue) 
			&& ((strAuthLevel === 'B' && strPmtType === 'B') || (strAuthLevel === 'I' && strPmtType === 'Q') || (strPaymentType==='QUICKPAY' || strPaymentType==='QUICKPAYSTI'))) {
				blnHistoryExists = true;
				//objAuditInfoHdrData = fieldValue;
				paintPaymentTransactionAuditInfoGrid(fieldValue, strPmtType, strMode);
			}
			if (fieldName === 'history' && !isEmpty(fieldValue)){
				objAuditInfoHdrData = fieldValue;
			}
			if (fieldName === 'hostMessage') {
				intMaxFieldLength = 60;
			}
			if (fieldName === 'enrichmentProfile') {
				intMaxFieldLength = strPmtType && strPmtType ==='Q' ? 17 : intMaxFieldLength;
			}
			if (fieldName === 'approvalName' && !isEmpty(fieldValue)) {
				fieldValue = !isEmpty(strApprovalStructData.name) ? strApprovalStructData.name : fieldValue ;
			}		
			if (fieldName === 'pendingApprovals' && !isEmpty(fieldValue)) {
			$('.hdrStatusInfoDiv').removeClass('hidden');
				if(strApprovalStructData.matrixType == 'S' )
				{
					fieldValue = 'NA';
				}
				else
				{
					fieldValue = (!isEmpty(strApprovalStructData.pendApprlCrntLvl) ? strApprovalStructData.pendApprlCrntLvl : '');
				}
			}
			
			strValueToBeDisplayed = fieldValue || 'None';
			if (fieldName != 'history')
			{
				strValueToBeDisplayed = fieldValue
				&& fieldValue.length > intMaxFieldLength
				? getTruncatedStringByLengthWithTooltip("." + fieldName
								+ strPostFix, fieldValue, intMaxFieldLength)
				: fieldValue;
			}
			
			$("." + fieldName + strPostFix).text(strValueToBeDisplayed);
			
			if (fieldName === 'limitProfile' && !isEmpty(fieldValue)) {
				if (strLayoutType && (strLayoutType == 'ACHLAYOUT' || strLayoutType == 'WIRESWIFTLAYOUT'
					|| strLayoutType == 'TAXLAYOUT' || strLayoutType == 'ACHIATLAYOUT' || strLayoutType == 'ACCTRFLAYOUT' )) {
					$("." + fieldName + strPostFix).text("");
					$("#paymentAdditionalInfolimitsPopup")
							.removeClass('hidden');
					$('#paymentAdditionalInfolimitsContainer,#paymentAdditionalInfolimitsInstrContainer')
							.removeClass('hidden');
					$("#limitTabs").barTabs();
					paintLimitPopup(strPmtType);
				} else {
					$("." + fieldName + strPostFix).unbind('click');
					$("." + fieldName + strPostFix).bind('click', function() {
								showLimitsPopup(strPmtType);
							});
					$("." + fieldName + strPostFix).addClass("t7-anchor");
				}
			}
			
			
		});
		
		/* START: Audit for Flipped Product */
		if (isEmpty(strPaymentAdditionalInfoData.orignalProduct)) {
			$(".orignalProduct" + strPostFix).text("");
			$(".flippedProduct" + strPostFix).text("");
			$("#flipProductInfo").addClass('hidden');
		}
		else {
			$("#flipProductInfo").removeClass('hidden');
		}
		/*END: Audit for Flipped Product*/
		
		$(".importedFilesCount_InfoSpan").addClass('t7-anchor');
		if (isEmpty(strPaymentAdditionalInfoData.importedFilesCount)) {
			$(".importedFilesCount_InfoSpan").text('None')
					.removeClass('t7-anchor');
			$("#importedTxnDetailsInfoGrid").addClass('hidden');					
			$("#importFileHdr").addClass('hidden');
			$("#importFileGridRow").addClass('hidden');
			$("#importFileHdr").removeClass('hideifdraft');
			$("#importFileGridRow").removeClass('hideifdraft');			
		}
		if (!isEmpty(strPaymentAdditionalInfoData.instrumentStatus)) {
			$('.instrumentStatus_HdrInfoSpan')
					.text(strPaymentAdditionalInfoData.instrumentStatus);
		}if (!isEmpty(strPaymentAdditionalInfoData.pendingApprovals)) {
			$('.hdrStatusInfoDiv').removeClass('hidden');
			$('.pendingApprovals_HdrInfoSpan')
					.text('('+strPaymentAdditionalInfoData.pendingApprovals+')');
		}

		if(strLayoutType === 'MIXEDLAYOUT' || strLayoutType === 'CHECKSLAYOUT' )
		{
			var strPayMethod = strPaymentAdditionalInfoData.paymentMethod;
			var checkDetailsDiv = (strPmtType === 'B' || strPaymentType==='QUICKPAY' || strPaymentType==='QUICKPAYSTI') ? $('#checkDetailsHeaderInfoDiv') : $('#checkDetailsInstrumentInfoDiv');
			checkDetailsDiv.removeClass('hidden');
			if (isEmpty(strPaymentAdditionalInfoData.pendingApprovals)) {
				$('.pendingApprovals'+strPostFix).text("0");
			}
			if(strPmtType ==='B')
			{
				checkDetailsDiv.addClass('hidden');
			}
			else
			{
				if (strLayoutType === 'MIXEDLAYOUT' && strPmtType ==='Q' && (isEmpty(strPayMethod) || ($.inArray(strPayMethod, ['01','02','07']) < 0)))
				{
					checkDetailsDiv.addClass('hidden');
				}
				if('02' === strPayMethod || '07' === strPayMethod)
				{
					checkDetailsDiv.find('.newCheckNo_InfoSpan').prev().text(getLabel('newCheckNo'+strPayMethod,'Check No.'));
					checkDetailsDiv.find('.newCheckDate_InfoSpan').prev().text(getLabel('newCheckDate'+strPayMethod,'Check Date'));
					checkDetailsDiv.find('.checkPrintDate_InfoSpan').prev().text(getLabel('checkPrintDate'+strPayMethod,'Check Print Date'));
				}
			}
		}
	}

	
	});

	    strInfoCallFrom = "HEADER";
		if (strPaymentAdditionalData) {
			$.each(strPaymentAdditionalData, function(fieldName, fieldValue) {
				strValueToBeDisplayed = fieldValue || 'None';
				if(fieldName == 'hdrDrCrFlag'){
					strValueToBeDisplayed =  fieldValue =='C' ? mapDrCrReadonlyLabel[strPaymentType]['C'][strLayoutType] :  fieldValue =='D' ? mapDrCrReadonlyLabel[strPaymentType]['D'][strLayoutType] : 
											 mapDrCrReadonlyLabel[strPaymentType]['C'][strLayoutType] +',<br/> '+ mapDrCrReadonlyLabel[strPaymentType]['D'][strLayoutType];					
					$("." + fieldName + strPostFix).html(strValueToBeDisplayed);
				}else if (fieldName !='templateAuthMatrix'
							&& fieldName !='templateWorkflow'
							&& fieldName != 'templateType'){ // Values populated in paintPaymentInstrumentVerifyScreen are getting overridden here hence added this condition.
					$("." + fieldName + strPostFix).text(strValueToBeDisplayed);
				}
				
				if(fieldName == 'hdrActionStatus'){
					hdrActionStatusTmp = fieldValue;
					//fieldValue='0';
					if (fieldValue == '0') {// Draft
					/*$('.hideifdraft, .hideifdraftpendingsubmit')
							.removeClass('hidden');*/
					$('.forPendingApproval,.auditInformationInfoHdrDiv,.hideifdraftpendingsubmit,.txnLimits').addClass('hidden');
				} else if (fieldValue == '101' || fieldValue == '9') {// Pending Submit and Pending Repair
					$('.hideifdraftpendingsubmit').addClass('hidden');
					$('.hideifdraft,.forDraft').removeClass('hidden');
					//$('.forPendingApproval').addClass('hidden');
					$('.auditInformationInfoHdrDiv, .auditInformationInfoDtlDiv,.instrStatus,.forPendingApproval').addClass('hidden');
				} else if (fieldValue == '1') {// Pending Approval
					//$('.forDraft').addClass('hidden');
					$('.forPendingApproval').addClass('hidden');
					$('.hideifdraft,.hideifdraftpendingsubmit,.auditInformationInfoHdrDiv,.auditInformationInfoDtlDiv,.txnLimits')
							.removeClass('hidden');
				} else {
					//$('.forDraft').addClass('hidden');
					$('.forPendingApproval').addClass('hidden');
					$('.hideifdraft,.hideifdraftpendingsubmit,.auditInformationInfoHdrDiv,.auditInformationInfoDtlDiv,.hdrStatusInfoDiv,.txnLimits')
							.removeClass('hidden');
				}
				if(fieldValue == '7' || (strPaymentAdditionalInfoData && !isEmpty(strPaymentAdditionalInfoData.hostMessage))){//Sent To Bank
					$('.instrStatus,.hostMessage,.hostRefrence').removeClass('hidden');
				}
				if((fieldValue == '18' || fieldValue == '13' || fieldValue == '8') && (strPaymentAdditionalInfoData && !isEmpty(strPaymentAdditionalInfoData.BankBatchRemarks))){//Cancelled
					$('.BankBatchRemarks').removeClass('hidden');
				}
				if(strPaymentAdditionalInfoData){//Sent To Bank
					$('.instrStatus,.hostMessage,.hostRefrence').removeClass('hidden');
				}
					
				}
			});
			if(strPaymentAdditionalData.productLevel == 'I' && strPmtType != 'Q')
				{
					$('#bankProductDescriptionDiv').addClass('hidden');						
				}
				if(strPaymentAdditionalInfoData && !isEmpty(strPaymentAdditionalInfoData.BankInstRemarks) && (strPaymentAdditionalInfoData.instActionStatus == 18 || strPaymentAdditionalInfoData.instActionStatus == 13 || strPaymentAdditionalInfoData.instActionStatus == 8)){//Cancelled
				$('.BankInstRemarks').removeClass('hidden');
			}
			 
		}else{
			$('.hideifdraft, .hideifdraftpendingsubmit, .forPendingApproval').addClass('hidden');
		}
	if (strAuthLevel === 'B' && strPmtType === 'B') {
		$(".approvalName" + strPostFix + 'Div').addClass('hidden');
		$(".pendingApprovals" + strPostFix + 'Div').addClass('hidden');
	}

	if (!blnHistoryExists && blnCollapsed && strMode && strMode !=='VERIFY')
		handleAdditionalInfoSectionCollapsed(strPmtType);
	if(strhdrActionStatus ==='0' || strhdrActionStatus ==='9'){
		$('.approvalName'+ strPostFix +'Div').addClass('hidden');
		$('.pendingApprovals'+ strPostFix +'Div').addClass('hidden');
	}
	else{
		$('.approvalName'+ strPostFix +'Div').removeClass('hidden');
		$('.pendingApprovals'+ strPostFix +'Div').removeClass('hidden');
	}
	toggleContainerVisibility('paymentHeadeerTrasanctionSummaryDiv');
}
function updateTxnType(cfgValue){
	var displayValue ='';
	if(mapDrCrReadonlyLabel[strPaymentType][cfgValue]){
		displayValue = mapDrCrReadonlyLabel[strPaymentType][cfgValue][strLayoutType];
	}
	else{
		displayValue = 'Invalid ('+  cfgValue + ')' ;
	}
	$('.txnDrCrFlag_InfoSpan').text(displayValue);
}
function handleAdditionalInfoSectionCollapsed(strPmtType) {
	if (strPaymentType && strPaymentType === 'QUICKPAY')
		$('#paymentInstrumentTrasanctionSummaryDiv span.expand-vertical')
				.trigger('click');
	else if (strPmtType === 'B')
		$('#paymentHeadeerTrasanctionSummaryDiv span.expand-vertical')
				.trigger('click');
	else
		$('#paymentInstrumentTrasanctionSummaryDiv span.expand-vertical')
				.trigger('click');
}
function getPaymentAddtionInformationData(infoScreenMode,strIdentifier, callback) {
	var objResponseData = null;
	if (strIdentifier && strIdentifier != '') {
		var strUrl = 'services/pirAdditionalInfo.json';
		$.ajax({
					url : strUrl,
					type : 'POST',
					async : false,
					data : {
						'$id' : strIdentifier,
						'$infoScreenMode' : infoScreenMode
					},
					//contentType : "application/json",
					complete : function(XMLHttpRequest, textStatus) {
						if ("error" == textStatus) {
							// TODO : Error handling to be done.
							// alert("Unable to complete your request!");
							// blockPaymentUI(true);
						}
					},
					success : function(data) {
						if (data && data.d) {
							objResponseData = data.d;
							if (callback)
							   callback(objResponseData)
					}
					}
				});
	}
	/*
	 * Remove comments to test with Dummay data if (isEmpty(objResponseData)) {
	 * objResponseData = dummayAdditionalInfoJson; }
	 */
	return objResponseData;
}
function paintApprovalStructureInformation(strPostFix, strIdentifier) {
	var data = null, ctrl = null;
	data = getApprovalStructureData(strIdentifier);
	var ctrl = $('.approvalName' + strPostFix);
	
	if (data) {
		if(data.name)
		{
			$(".approvalName_InfoSpan").text(data.name);
		}
		if (data.matrixType) {
			var chrMatrixType = data.matrixType;
			if (chrMatrixType) {
				switch (chrMatrixType) {
					case 'M' :
						paintApprovalStructureMakerCheckerPopup(data, ctrl);
						break;
					case 'S' :
						paintApprovalStructureSVMPopup(data, ctrl);
						break;
					case 'A' :
						paintApprovalStructureAVMPopup(data, ctrl);
						break;
					default :
						paintApprovalStructureMakerCheckerPopup(data, ctrl);
						break;
				}
			} else {
				paintApprovalStructureMakerCheckerPopup(data, ctrl);
			}
		}else{
			if(!$(ctrl).hasClass('openLink'))
			{
				$(ctrl).replaceWith(function(){
					return $('<span/>', {
						html: this.innerHTML,
						'class': 'approvalName' + strPostFix
					});			
				});
			}
		}
	}
	return data;
}
function getApprovalStructureData(strIdentifier) {
	if (!isEmpty(strIdentifier)
			&& (isEmpty(paymentApprovalStructureData[strIdentifier]))) {

		$.ajax({
					url : 'services/authStructure.json',
					type : 'POST',
					data : {
						'$id' : strIdentifier,
						'$infoScreenMode': strInfoCallFrom
					},
					async : false,
					complete : function(XMLHttpRequest, textStatus) {
						// $.unblockUI();
						// if ("error" == textStatus)
						// alert("Unable to complete your request!");
					},
					success : function(data) {
						if (data && data.d)
						paymentApprovalStructureData[strIdentifier] = data.d;
					}
				});
	}
	/*
	 * if (isEmpty(jsonData)) jsonData = dummyApprovalInfoJson.d;
	 */
	return paymentApprovalStructureData[strIdentifier];
}
function paintApprovalStructureMakerCheckerPopup(data, ctrl) {
	if(data.name != undefined && data.name != 'Set To Auto Approve' && data.name != 'Instrument Level Auth')
	{
		ctrl.unbind('mouseover');
		ctrl.bind('mouseover', function(e) {
			var width = '300px';
			var strHtml = '<div class="row"><div class="col-sm-7"><div class="form-group"><label>Matrix Name : </label><span> '
					+ data.rule+'</span></div></div>';

			var userHtml = '<div class="col-sm-5"><div class="form-group"><label>No. of Users : </label><span> '
					+ (!isEmpty(data.approvers) ? data.approvers : '')
					+ '</span></div></div>';

			if(!isEmpty(data.approvers))
			{
				strHtml = strHtml + userHtml;
				width = '400px';
			}

			strHtml = strHtml + '</div>';

			$('<div>').html(strHtml).css({
						'position' : 'relative',
						'border' : '1px solid #868686',
						'min-height' : '37px',
						'overflow' : 'auto',
						'min-width' : width,
						'z-index' : '1000',
						'padding' : '6px 12px',
						'color' : '#333333',
						'background-color' : '#F1F1F1',
						'width' : 'auto'
					}).appendTo(ctrl);
		});

		ctrl.bind('mouseout', function(e) {
				$(this).find('div').remove();
					
				});
		ctrl.addClass('openLink');
	}
	
}
function getSVMRuleForTier(rule)
{
	var strTemp ,intI , ruleValue;
	var arrRule = rule.split('||');
	var	intLen = arrRule.length;

	for (intI = 0; intI <= intLen - 1; intI++) {
		strTemp = arrRule[intI];
		if(intI == 0)
		{
			ruleValue = ShowRuleDesc((strTemp || '').split(','));
		}
		else
		{
			ruleValue = ruleValue + '<hr>' + ShowRuleDesc((strTemp || '').split(','));
		}
	}
	return ruleValue ;
}
function paintApprovalStructureSVMPopup(data, ctrl) {
	
	if(data.name != undefined && data.name != 'Set To Auto Approve' && data.name != 'Instrument Level Auth')
	{
		ctrl.unbind('mouseover');
		ctrl.unbind('click');
		ctrl.bind('click', function(e) {
			var rule = getSVMRuleForTier(data.rule);
			var strHtml = '<div>' + ' ' + rule + '</div>';
			
			$("#paymentAdditionalInfo_ApprovalSVMPopup").dialog({
				resizable : false,
				modal : true,
				width : 550,
				minHeight : 150,
				maxHeight : 250,
				title : 'Signatory Matrix Rule',
				// dialogClass : "hide-title-bar",
				open : function(event, ui) {
					$("#paymentAdditionalInfo_ApprovalSVMPopup").html(strHtml);
					$("#paymentAdditionalInfo_ApprovalSVMPopup").css({height:"250px", overflow:"auto"});
				},
				close : function(event, ui) {
					$(this).dialog("close");
				},
				buttons : {
					'Cancel' : function() {
						$(this).dialog("close");
					}
				}
			});
			$('#paymentAdditionalInfo_ApprovalSVMPopup').dialog('option', 'position', 'center');
		});
	}
	
}
function paintApprovalStructureAVMPopup(data, ctrl) {
	if(data.name != undefined && data.name != 'Set To Auto Approve' && data.name != 'Instrument Level Auth')
	{
		ctrl.unbind('mouseover');
		ctrl.unbind('click');
		ctrl.bind('click', function() {
					openApprovalStructureAVMPopup(data.slabs,ctrl);
				});
	}
	
	if(hdrActionStatusTmp != 0 && hdrActionStatusTmp != 1 && hdrActionStatusTmp != 2 && hdrActionStatusTmp != 9)
	{
		$(".approvalName_InfoSpan").unbind('click');
	}
}
function openApprovalStructureAVMPopup(data,ctrl) {
	var matrixNameGrid = null;
	$("#paymentAdditionalInfo_ApprovalMatrixPopup").dialog({
				resizable : false,
				modal : true,
				width : 550,
				maxHeight : 150,
				title : mapLbl['txnMatrixName'],
				// dialogClass : "hide-title-bar",
				open : function(event, ui) {
					// if (!matrixNameGrid) {
					matrixNameGrid = createApprovalStructureAVMDataGrid(data);
					$('body').css('overflow','true');
					// }
				},
				close : function(event, ui) {
				},
				buttons : {
					'Cancel' : function() {
						$(this).dialog("close");
					}
				}
			});
			$('#paymentAdditionalInfo_ApprovalMatrixPopup').dialog('option', 'position', 'center');
}
function createApprovalStructureAVMDataGrid(data) {
	var store = createApprovalStructureGridStore(data);
	$('#matrixNameGrid').empty();
	var grid = Ext.create('Ext.grid.Panel', {
				store : store,
				popup : true,
				maxHeight : 150,
				columns : [{
							text : mapLbl['type'],
							dataIndex : 'TYPE',
							width : 60,
							draggable : false,
							resizable : false,
							hideable : false,
							renderer: function(value){
								if(!Ext.isEmpty(value))
								{
									if(value == 0)
										return mapLbl['typeAvm'];	
									else
										return mapLbl['typeSvm'];	
															
								}
							}
						}, {
							text : mapLbl['txnLevel'],
							dataIndex : 'level',
							width : 60,
							draggable : false,
							resizable : false,
							hideable : false,
							renderer: function(value){
								if(!Ext.isEmpty(value))
								{
								return Number(value);
								}
							}
						}, {
							text : mapLbl['txnNoodCheckers'],
							dataIndex : 'checkers',
							width : 130,
							draggable : false,
							resizable : false,
							hideable : false,
							renderer: function(value){
								if(!Ext.isEmpty(value))
								{
								return Number(value);
								}
							}
							
						}, {
							text : mapLbl['txnName'],
							dataIndex : 'users',
							flex : 1,
							draggable : false,
							resizable : false,
							hideable : false,
							renderer : function(value, metadata) {
							if(!Ext.isEmpty(value) && value.length > 11){
								metadata.tdAttr = 'title="' + value + '"';
							}
							return value;
						}
						}],
				renderTo : 'matrixNameGrid'
			});
	return grid;
}
function createApprovalStructureGridStore(jsonData) {
	var myStore = Ext.create('Ext.data.Store', {
				id : 'matrixStore',
				fields : ['TYPE', 'level', 'checkers', 'users'],
				data : jsonData,
				autoLoad : true
			});
	return myStore;
}

function paintPaymentTransactionAuditInfoGrid(data, strPmtType, strMode) {
	var renderToDiv = null;
	if (strPmtType && strPmtType === 'B') {
		renderToDiv = 'auditInfoGridDiv';
		$(".auditInformationInfoHdrDiv").removeClass('hidden');
	} else if (strPaymentType && strPaymentType === 'QUICKPAY') {
		renderToDiv = 'auditInfoInstrumentGridDiv';
		$(".auditInformationInfoDtlDiv").removeClass('hidden');
	} else {
		renderToDiv = 'auditInfoInstrumentGridDiv';
		$(".auditInformationInfoDtlDiv").removeClass('hidden');
	}
	
	if (!isEmpty(renderToDiv)) {
		$('#'+renderToDiv).empty();
		var store = createAuditInfoGridStore(data);
		var grid = Ext.create('Ext.grid.Panel', {
			store : store,
			popup : true,
			columns : [{
						dataIndex : 'userCode',
						text : mapLbl['txnUser'],
						width : 150,
						draggable : false,
						resizable : false,
						sortable : false,
						hideable : false,
						renderer : function(value, metadata, record) {
								if(!Ext.isEmpty(value) && value.length > 1){
									metadata.tdAttr = 'title="' + value + '"';
								}
								return value;
						}
					}, {
						dataIndex : 'logDate',
						text : mapLbl['popuptxnDateTime'],
						width : 200,
						draggable : false,
						resizable : false,
						sortable : false,
						hideable : false,
						renderer : function(value, metadata) {
								if(!Ext.isEmpty(value) && value.length > 1){
									metadata.tdAttr = 'title="' + value + '"';
								}
								return value;
						}
					}, {
						dataIndex : 'action',
						text : mapLbl['txnAction'],
						width : 150,
						draggable : false,
						resizable : false,
						sortable : false,
						hideable : false,
						renderer : function(value, metadata) {
							if(!Ext.isEmpty(value) && value.length > 1){
								metadata.tdAttr = 'title="' + value + '"';
							}
							return value;
						}
					}, {
						dataIndex : 'remarks',
						text : mapLbl['txnRemarks'],
						flex : 1,
						draggable : false,
						resizable : false,
						sortable : false,
						hideable : false,
						renderer : function(value, metadata) {
								if(!Ext.isEmpty(value) && value.length > 1){
									metadata.tdAttr = 'title="' + value + '"';
								}
								return value;
						}
					}],
			renderTo : renderToDiv
			/*
			 * , afterRender : function() { if(strPmtType==='Q')
			 * $('#paymentInstrumentTrasanctionSummaryDiv
			 * span.expand-vertical').trigger('click'); else
			 * if(strPmtType==='B') $('#paymentHeadeerTrasanctionSummaryDiv
			 * span.expand-vertical').trigger('click'); }
			 */
			});
		grid.on('afterlayout', function() {
			if (strMode && strMode !== 'VERIFY') {
				if (strPaymentType
						&& (strPaymentType === 'QUICKPAY' || strPaymentType === 'QUICKPAYSTI'))
					$('#paymentInstrumentTrasanctionSummaryDiv span.expand-vertical')
							.trigger('click');
				else if (strPmtType === 'B')
					$('#paymentHeadeerTrasanctionSummaryDiv span.expand-vertical')
							.trigger('click');
				else
					$('#paymentInstrumentTrasanctionSummaryDiv span.expand-vertical')
							.trigger('click');
			}			
		});
		var layout = Ext.create('Ext.container.Container',{
			width: 'auto',
			items: [grid],
           renderTo: renderToDiv
		});
		auditGrid=layout;
		return layout;
	}
}/**/

function createAuditInfoGridStore(jsonData) {
	var myStore = Ext.create('Ext.data.Store', {
				fields : ['zone', 'version', 'recordKeyNo', 'userCode', 'userName',
						'logDate', 'requestState', 'phdClient', 'logNumber',
						'pirNumber', 'pirSerial', 'avmLevel', 'remarks',
						'__metadata', 'action'],
				data : jsonData,
				autoLoad : true
			});
	return myStore;
}

function openFilesImportedPopup(strIdentifier) {
	var matrixNameGrid;
	$("#importedTxnDetailsPopup").dialog({
		resizable : false,
		modal : true,
		width : 700,
		height : 300,
		title : mapLbl['txnImportedTxnDetails'] + ' : ',
		// dialogClass : "hide-title-bar",
		open : function(event, ui) {
			if (!matrixNameGrid) {
				matrixNameGrid = createTxnDetailsGrid('importedTxnDetailsGrid',
						strIdentifier);
			}
		},
		close : function(event, ui) {
		},
		buttons : {
			'Cancel' : function() {
				$(this).dialog("close");
				$("#importedTxnDetailsGrid").empty();
			}
		}
	});
	$('#importedTxnDetailsPopup').dialog('option', 'position', 'center');
}
function createTxnDetailsGrid(divId, strIdentifier) {
	var renderToDiv = !isEmpty(divId) ? divId : 'txnDetailsGridDiv';
	var store = createTxnDetailsGridStore(strIdentifier);
	var grid = Ext.create('Ext.grid.Panel', {
				store : store,
				maxHeight : 200,
				autoScroll:true,
				//scroll : 'vertical',
				cls : 't7-grid',
				popup : true,
				enableColumnHeaderMenu :false,
				listeners: {
					cellclick: function(view, td, cellIndex, record,tr, rowIndex, e, eOpts) {
						if(record.data.statusCode === 'E' || record.data.statusCode === 'T' || record.data.statusCode === 'P'){
				    		showUploadErrorReport(record.data);;
						}

					}
				},
				columns : [
						{
							text : getLabel('actions', 'Action'),
							width : 70,
							draggable : false,
							resizable : false,
							sortable : false,
							hideable : false,
							colType : 'action',
							renderer: function(value, metaData, record, rowIndex, colIndex, store){
								if(record.data.statusCode === 'E' || record.data.statusCode === 'T' || record.data.statusCode === 'P'){
						    		//return '<i class="fa fa-exclamation-circle" style="color:#F78181"></i>';
									return '<a class="grey cursor_pointer action-link-align grid-row-action-icon icon-error" name="btnViewError" title="'+getLabel('lblViewReport', 'View Report')+'">&nbsp;&nbsp;</a>';
								}
								if(record.data.statusCode === 'Q' || record.data.statusCode === 'R'){
						    		return '<i class="fa fa-spinner"></i>';
								}
								if(record.data.statusCode === 'N'){ 
									return '<a></a>';
								}
								else{
									 return '<a class="grey cursor_pointer action-link-align grid-row-action-icon icon-completed" name="btnViewOk" title="'+getLabel('lblCompleted', 'Completed')+'">&nbsp;&nbsp;</a>';
								}
							 }
							
						},{
							text : getLabel('lblFileName', 'File Name'),
							dataIndex : 'fileName',
							width : 110,
							draggable : false,
							resizable : false,
							hideable : false,
							//sortable : false,
							menuDisabled:true,
							multiColumnSort : true,
							renderer: function(value, metaData, record, rowIndex, colIndex, store){
							return columnRender(value, metaData, record, rowIndex, colIndex, store);
							 }
						}, {
							text : getLabel('lblCreatedOn', 'Import DateTime'),
							dataIndex : 'createdOn',
							width : 130,
							draggable : false,
							resizable : false,
							hideable : false,
							menuDisabled:true,
							//sortable : false,
							multiColumnSort : true,
							renderer: function(value, metaData, record, rowIndex, colIndex, store){
								return columnRender(value, metaData, record, rowIndex, colIndex, store);
							 }
						}, {
							text : getLabel('lblTotalinstruments', 'Total Transactions'),
							dataIndex : 'totalinstruments',
							width : 110,
							draggable : false,
							resizable : false,
							hideable : false,
						//	sortable : false,
							menuDisabled:true,
							enableColumnHeaderMenu :false,
							multiColumnSort : true,
							align : 'right',
							renderer: function(value, metaData, record, rowIndex, colIndex, store){
								return columnRender(value, metaData, record, rowIndex, colIndex, store);
							 }
						}, {
							text : getLabel('lblTotalAmount', 'Total Amount'),
							dataIndex : 'totalAmount',
							width : 110,
							draggable : false,
							resizable : false,
							hideable : false,
							//sortable : false,
							menuDisabled:true,
							multiColumnSort : true,
							align : 'right',
							renderer: function(value, metaData, record, rowIndex, colIndex, store){	
								return columnRender(value, metaData, record, rowIndex, colIndex, store);
							 }
						}, {
							text : getLabel('lblTotalrejected', 'Rejected Transactions'),
							dataIndex : 'totalrejected',
							width : 110,
							draggable : false,
							resizable : false,
							hideable : false,
							//sortable : false,
							menuDisabled:true,
							multiColumnSort : true,
							align : 'right',
							renderer: function(value, metaData, record, rowIndex, colIndex, store){
								return columnRender(value, metaData, record, rowIndex, colIndex, store);
							 }
						}, {
							text : getLabel('lblRemarks', 'Status'),
							dataIndex : 'remarks',
							flex : 1,
							draggable : false,
							resizable : false,
							hideable : false,
							menuDisabled:true,
							sortable : false,
							multiColumnSort : true,
							renderer: function(value, metaData, record, rowIndex, colIndex, store){		
								var	coulumnValue = value.trim();										
								if(coulumnValue.substring(coulumnValue.length-1)==":")
								{
									value = coulumnValue.replace(":","");
								}
								return columnRender(value, metaData, record, rowIndex, colIndex, store);
							 }
						}],
				renderTo : renderToDiv
			});
	return grid;
}

function columnRender(value, metaData, record, rowIndex, colIndex, store) {
	return '<span title="' + value + '">' + value + '</span>';
}

function createTxnDetailsGridStore(strIdentifier) {
	var jsonData = null;
	if (!isEmpty(strIdentifier)) {
		$.ajax({
					url : 'services/ach/transactionStatus/id.json',
					type : 'POST',
					data : {
						'id' : strIdentifier						
					},
					async: false,
					complete : function(XMLHttpRequest, textStatus) {
					},
					success : function(data) {
						if (data && data.d && data.d.status){
							jsonData = data.d.status;
							for (var i = 0; i < jsonData.length; i++) {
								if ("N" === jsonData[i].statusCode || "R" === jsonData[i].statusCode || "Q" === jsonData[i].statusCode) {
									intervalFlag = true;
									refreshFlag = true;
					}
							}
						}
					}
				});
	}
	var myStore = Ext.create('Ext.data.Store', {
				id : 'matrixStore',
				fields : ['fileName', 'createdOn', 'totalinstruments',
						'totalAmount', 'totalrejected', 'totalAmountRejected',
						'totaluploaded', 'remarks', 'statusCode', 'ahtskdata', 'ahtskclient'],
				data : jsonData,
				autoLoad : true
			});
	return myStore;
}
/** Additional Information Section handling ends here * */
function getPaymentHeaderInfo(strIdentifier) {
	var jsonData = null;
	if (!isEmpty(strIdentifier)) {
		$.ajax({
					url : 'services/paymentheaderinfo.json',
					type : 'POST',
					async : false,
					data : {
						'$id' : strIdentifier,
						'csrfTokenName' : tokenValue
					},
					complete : function(XMLHttpRequest, textStatus) {
						// $.unblockUI();
						// if ("error" == textStatus)
						// alert("Unable to complete your request!");
					},
					success : function(data) {
						if (data && data.d)
							jsonData = data.d;
					}
				});
	}

	return jsonData;
}
/* Image Upload Handling starts here 
function showFileUploadDialog() {
	$('#paymentImageFile').trigger('click');
}
function updateFileName() {
	if ($("#paymentImageFile") && $("#paymentImageFile")[0]
			&& $("#paymentImageFile")[0].files) {
		var strUploadedImageName = $("#paymentImageFile")[0].files[0].name;
		$(".fileName_InfoSpan").text(strUploadedImageName);
		$('#paymentImageFileRemoveLink').removeClass('hidden');
		$('#paymentImageFileLink').addClass('hidden');
	}
}
function removeUploadedImage() {
	var control = $("#paymentImageFile");
	control.replaceWith(control = control.clone(true));
	$('#paymentImageFileRemoveLink').addClass('hidden');
	$('#paymentImageFileLink').removeClass('hidden');
	$(".fileName_InfoSpan").text(getLabel('noFileUploaded', 'No File Uploaded'));
}
 Image Upload Handling ends here*/

function showPaymentInfoPopup(strPmtType) {
	$('#paymentHeadeerTrasanctionSummaryDiv').dialog({
				autoOpen : false,
				maxHeight : 620,
				width : 690,
				modal : true,
				dialogClass : 'ft-dialog',
				title :  getLabel('batchinfo', 'Batch Information'),
				open : function() {
					$('#paymentHeadeerTrasanctionSummaryDiv').removeClass('hidden');
						$("#importedTxnDetailsInfoGrid").empty();
						createTxnDetailsGrid('importedTxnDetailsInfoGrid',strIdentifierForInfo);
						if(hdrActionStatusTmp && hdrActionStatusTmp !='0' /*&& hdrActionStatusTmp !='101'*/&& hdrActionStatusTmp !='9')
						{
							paintApprovalStructureInformation("_InfoSpan", strIdentifierForInfo);
							var auditData = getPaymentAddtionInformationData("HEADER",strIdentifierForInfo);
							if(auditData != null)
							{
								var auditApprovalName = auditData.approvalName ;
								if(auditApprovalName != null && auditApprovalName != undefined)
								{
									$(".approvalName_InfoSpan").text(auditApprovalName);
									if(auditApprovalName == "Set To Auto Approve" || auditApprovalName == "Instrument Level Auth")
									{
										$(".approvalName_InfoSpan").unbind('click');
										$(".approvalName_InfoSpan").unbind('mouseover');
									}
								}
								if((auditData.matrixType != null && auditData.matrixType == 'S') || auditData.approvalName == 'Set To Auto Approve')
								{
									$(".pendingApprovals_InfoSpanHdrDiv").addClass('hidden');
								}
							if(auditData.history.length>0)
								paintPaymentTransactionAuditInfoGrid(auditData.history, 'B', '');
						}
					}
						$('#paymentHeadeerTrasanctionSummaryDiv').dialog('option','position','center'); 
						autoFocusOnFirstElement(null, 'paymentHeadeerTrasanctionSummaryDiv', true);
				}
			});
	$('#paymentHeadeerTrasanctionSummaryDiv').dialog("open");
	$('#paymentHeadeerTrasanctionSummaryDiv').dialog('option','position','center');
}

function showPaymentInstrumentInfoPopup(strPmtType) {
	$('#paymentInstrumentTrasanctionSummaryDiv').dialog({
				autoOpen : false,
				maxHeight : 1000,
				width : 690,
				modal : true,
				dialogClass : 'ft-dialog',
				title :getLabel('txninfo', 'Transaction Information') ,
				open : function() {
					$('#paymentInstrumentTrasanctionSummaryDiv').removeClass('hidden');
					if(hdrActionStatusTmp && hdrActionStatusTmp !='0' && hdrActionStatusTmp !='101' && strPmtType =='TXNWIZARD'){
						$(".approvalName_InfoSpan").unbind('click');
						var auditData = getPaymentAddtionInformationData("DETAIL",strDtlIdentifierForInfo);
						if(auditData != null)
						{
							if(auditData.matrixType == 'S')
							{
								$("#paymentAdditionalInfo_ApprovalSVMPopup").html("");
							}
							else
							{
								$("#matrixNameGrid").empty();
							}
							if(strAuthLevelGlb == 'I')
							{
								paintApprovalStructureInformation("_InfoSpan", strDtlIdentifierForInfo);
							}
							else
							{
								paintApprovalStructureInformation("_InfoSpan", strIdentifierForInfo);
							}
							var auditApprovalName = auditData.approvalName ;
							if(auditApprovalName != null && auditApprovalName != undefined)
							{
								if(auditApprovalName == "Set To Auto Approve" || auditApprovalName == "Instrument Level Auth")
								{
									$(".approvalName_InfoSpan").unbind('click');
									$(".approvalName_InfoSpan").unbind('mouseover');
									$(".approvalName_InfoSpan").text(auditApprovalName);
								}
							}
							if(auditData.matrixType == 'A' && auditData.instActionStatus != 0 && auditData.instActionStatus != 1 && auditData.instActionStatus != 2 && auditData.instActionStatus != 9)
							{
								$(".approvalName_InfoSpan").unbind('click');
								$(".approvalName_InfoSpan").unbind('mouseover');
							}
							if((auditData.matrixType != null && auditData.matrixType == 'S') || auditData.approvalName == 'Set To Auto Approve')
							{
								$(".pendingApprovals_InfoSpanDiv").addClass('hidden');
							}
							if(auditData.matrixType == 'M')
							{
								$(".approvalName_InfoSpan").text(auditApprovalName);
							}
							if(auditData.history != null && auditData.history.length>0 && strAuthLevelGlb ==="I"){
									paintPaymentTransactionAuditInfoGrid(auditData.history, 'Q', '');
								}else{
									$(".auditInformationInfoDtlDiv").addClass('hidden');
								}
						}
							
					}if (hdrActionStatusTmp && hdrActionStatusTmp !='0' /*&& hdrActionStatusTmp !='101'*/ && strPmtType ==='SINGLE'){
						paintPaymentTransactionAuditInfoGrid(objAuditInfoHdrData, 'Q', '');
					}
					
					if(strPaymentType == 'BATCHPAY')
						paintLimitPopup('B');
					else
						paintLimitPopup('Q');
					
					$('#paymentInstrumentTrasanctionSummaryDiv').dialog('option','position','center'); 
					autoFocusOnFirstElement(null, 'paymentInstrumentTrasanctionSummaryDiv', true);
				}
			});
	$('#paymentInstrumentTrasanctionSummaryDiv').dialog("open");
	$('#paymentInstrumentTrasanctionSummaryDiv').dialog("option","position","center");
}
/* Limits pop up Handling starts here */
function showLimitsPopup(strPmtType) {
	$('#paymentAdditionalInfolimitsPopup').dialog({
				autoOpen : false,
				maxHeight : 620,
				width : 690,
				modal : true,
				dialogClass : 'ft-tab-bar',
				open : function() {
					$("#limitTabs").barTabs();
					paintLimitPopup(strPmtType);
				},
				close : function() {
				},
				buttons : {
					'Close' : function() {
						$(this).dialog("close");
					}
				}
			});
	$('#paymentAdditionalInfolimitsPopup').dialog("open");
	$('#paymentAdditionalInfolimitsPopup').dialog("option","position","center");
}
/* Fetch Advice pop up  */
function showFetchAdviceInstrumentInfoPopup(strPmtType) {
	$('#paymentInstrumentFetchAdviceDiv').dialog({
				autoOpen : false,
				maxHeight : 1000,
				width : 690,
				modal : true,
				dialogClass : 'ft-dialog',
				title : 'Fetch Advice Information',
				open : function() {
					$('#paymentInstrumentFetchAdviceDiv').removeClass('hidden');
					
					$('#paymentInstrumentFetchAdviceDiv').dialog('option','position','center'); 
					autoFocusOnFirstElement(null, 'paymentInstrumentFetchAdviceDiv', true);
				}
			});
	$('#paymentInstrumentFetchAdviceDiv').dialog("open");
	$('#paymentInstrumentFetchAdviceDiv').dialog("option","position","center");
}
function paintLimitPopup(strPmtType) {
	var clsHide = 'hidden', data = null;
	data = getLimitsPopupInfo(strPmtType);
	// Remove following comment for unit testing.
	// data = dummyLimitsPopupData;
	$("#limitTabs").barTabs();
	$('#limitTabs .canClear').text('');
	if (data && data.d) {
	if('clientLimits' in data.d || 'accountLimits' in data.d || 'makerLimits' in data.d  || 'approverLimits' in data.d ){
		$('#limitTabs').removeClass('hidden');
		$('.limitProfile_InfoSpan').text('');
		$('.limitsDiv,.limitsPopup').removeClass('hidden');
		$('#paymentAdditionalInfolimitsContainer,#paymentAdditionalInfolimitsInstrContainer')
		.removeClass('hidden');
	}else{
		$('#limitTabs').addClass('hidden');
		$('.limitsDiv,.limitsPopup,.txnLimits').addClass('hidden');
		$('.limitProfile_InfoSpan').text('None');
		$('.limitsDiv,.txnLimits,').removeClass('hideifdraft');
		$('.txnLimits').removeClass('hideifdraft');		
		$('.txnLimits').removeClass('txnLimits');
		$('#paymentAdditionalInfolimitsContainer,#paymentAdditionalInfolimitsInstrContainer')
		.addClass('hidden');
	}
		$.each(data.d, function(key, sectionData) {
			if (key != "metadata") {
				$("." + key + "Tab").removeClass(clsHide);
				$('#tabs-' + key).removeClass(clsHide);
				// var sectionLimitData = sectionData;
				$.each(sectionData, function(sectionDataPtr, sectionDataObj) {
					var limitCurrencySymbol ="";
					if(sectionDataObj.currencySymbol)
					{
						limitCurrencySymbol = sectionDataObj.currencySymbol;
					}
					if (sectionDataPtr != 'sectionLabel' && sectionDataObj) {
						$(".section" + key + "_" + sectionDataPtr)
								.removeClass(clsHide);
						if (sectionDataObj.label) {
							$(".section" + key + "_" + sectionDataPtr
									+ "_label").text(sectionDataObj.label);
						}
						if (sectionDataObj.transaction) {
							$(".section" + key + "_" + sectionDataPtr
									+ "_TransactionDiv").removeClass(clsHide);
							if (sectionDataObj.transaction.credit)
								$(".section" + key + "_" + sectionDataPtr
										+ "_txnCreditLimit")
										.text(limitCurrencySymbol+" "+sectionDataObj.transaction.credit);
							if (sectionDataObj.transaction.debit)
								$(".section" + key + "_" + sectionDataPtr
										+ "_txnDebitLimit")
										.text(limitCurrencySymbol+" "+sectionDataObj.transaction.debit);
						}

						if (sectionDataObj.cumulative) {
							$(".section" + key + "_" + sectionDataPtr
									+ "_CumulativeDiv").removeClass(clsHide);
							if (sectionDataObj.cumulative.header)
								$(".section" + key + "_" + sectionDataPtr
										+ "_cumulativeheader")
										.text(sectionDataObj.cumulative.header);
							if (sectionDataObj.cumulative.cumulativetransferCreditLimit
									&& sectionDataObj.cumulative.transferCreditOS) {
								$(".section" + key + "_" + sectionDataPtr
										+ "_transferCreditDiv")
										.removeClass(clsHide);
								$(".section" + key + "_" + sectionDataPtr
										+ "_cumulativeTransferCreditLimit")
										.text(limitCurrencySymbol+" "+sectionDataObj.cumulative.cumulativeTransferCreditLimit);
								$(".section" + key + "_" + sectionDataPtr
										+ "_transferCreditOS")
										.text(limitCurrencySymbol+" "+sectionDataObj.cumulative.transferCreditOS);
								if (sectionDataObj.cumulative.markTransferCreditLimit
										&& sectionDataObj.cumulative.markTransferCreditLimit === 'Y')
									$(".section" + key + "_" + sectionDataPtr
											+ "_cumulativeTransferCreditLimit").attr(
											'style', 'color:red');
							}

							if (sectionDataObj.cumulative.warningCreditLimit
									&& sectionDataObj.cumulative.warningCreditOS) {
								$(".section" + key + "_" + sectionDataPtr
										+ "_warningCreditDiv")
										.removeClass(clsHide);
								$(".section" + key + "_" + sectionDataPtr
										+ "_warningCreditLimit")
										.text(sectionDataObj.cumulative.warningCreditLimit);
								$(".section" + key + "_" + sectionDataPtr
										+ "_warningCreditOS")
										.text(sectionDataObj.cumulative.warningCreditOS);
								if (sectionDataObj.cumulative.markWarningCreditLimit
										&& sectionDataObj.cumulative.markWarningCreditLimit === 'Y')
									$(".section" + key + "_" + sectionDataPtr
											+ "_warningCreditLimit").attr(
											'style', 'color:red');
							}

							if (sectionDataObj.cumulative.cumulativetransferDebitLimit
									&& sectionDataObj.cumulative.transferDebitOS) {
								$(".section" + key + "_" + sectionDataPtr
										+ "_transferDebitDiv")
										.removeClass(clsHide);
								$(".section" + key + "_" + sectionDataPtr
										+ "_cumulativeTransferDebitLimit")
										.text(sectionDataObj.cumulative.cumulativeTransferDebitLimit);
								$(".section" + key + "_" + sectionDataPtr
										+ "_transferDebitOS")
										.text(sectionDataObj.cumulative.transferDebitOS);
								if (sectionDataObj.cumulative.markTransferDebitLimit
										&& sectionDataObj.cumulative.markTransferDebitLimit === 'Y')
									$(".section" + key + "_" + sectionDataPtr
											+ "_cumulativeTransferDebitLimit").attr(
											'style', 'color:red');
							}

							if (sectionDataObj.cumulative.warningDebitLimit
									&& sectionDataObj.cumulative.transferDebitOS) {
								$(".section" + key + "_" + sectionDataPtr
										+ "_warningDebitDiv")
										.removeClass(clsHide);
								$(".section" + key + "_" + sectionDataPtr
										+ "_warningDebitLimit")
										.text(sectionDataObj.cumulative.warningDebitLimit);
								$(".section" + key + "_" + sectionDataPtr
										+ "_warningDebitOS")
										.text(sectionDataObj.cumulative.warningDebitOS);
								if (sectionDataObj.cumulative.markWarningDebitLimit
										&& sectionDataObj.cumulative.markWarningDebitLimit === 'Y')
									$(".section" + key + "_" + sectionDataPtr
											+ "_warningDebitOS").attr(
											'style', 'color:red');
							}

							if (sectionDataObj.cumulative.transferCountLimit
									&& sectionDataObj.cumulative.transferCountOS) {
								$(".section" + key + "_" + sectionDataPtr
										+ "_transferCountDiv")
										.removeClass(clsHide);
								$(".section" + key + "_" + sectionDataPtr
										+ "_transferCountLimit")
										.text(sectionDataObj.cumulative.transferCountLimit);
								$(".section" + key + "_" + sectionDataPtr
										+ "_transferCountOS")
										.text(sectionDataObj.cumulative.transferCountOS);
								if (sectionDataObj.cumulative.markTransferCountLimit
										&& sectionDataObj.cumulative.markTransferCountLimit === 'Y')
									$(".section" + key + "_" + sectionDataPtr
											+ "_transferCountLimit").attr(
											'style', 'color:red');
							}
						}
					}
				});
			}

		});

	}
	else{
		$('#paymentAdditionalInfolimitsContainer,#paymentAdditionalInfolimitsInstrContainer')
		.addClass('hidden');
	}
}
function getLimitsPopupInfo(strPmtType) {
	var jsonData = null, strIdentifier = null;

	if (strPmtType) {
		if (strPmtType === 'Q'){
			strIdentifier = (!isEmpty(strPaymentInstrumentIde) && strPaymentType =="BATCHPAY") ? strPaymentHeaderIde :strPaymentInstrumentIde ;
		}
		if (strPmtType === 'B')
			strIdentifier = strPaymentHeaderIde;
		if (!isEmpty(strIdentifier)) {
			$.ajax({
						url : 'services/limits/fetch.json',
						type : 'POST',
						async : false,
						data : {
							'$id' : strIdentifier
						},
						complete : function(XMLHttpRequest, textStatus) {
							// $.unblockUI();
							// if ("error" == textStatus)
							// alert("Unable to complete your request!");
						},
						success : function(data) {
							if (data && data.d)
								jsonData = data;
							else {
								var arrError = new Array();
								arrError.push({
											"errorCode" : "Message",
											"errorMessage" : mapLbl['unknownErr']
										});
								paintErrors(arrError);
							}
						}
					});
		}
	}
	if (isEmpty(jsonData)) {
		$('#paymentAdditionalInfolimitsPopup').dialog("close");
	}
	return jsonData;
}

/* Limits pop up Handling ends here */

/* Templates Roles/Users handling starts here */
function populateUsers() {
	var field = $('#templateRoles' + (charPaymentType === 'B' ? 'Hdr' : ''));
	var strVal = field.val();
	if (strVal && $.isArray(strVal))
		strVal = strVal.toString();
	$.ajax({
				url : "services/userseek/categoryUserList.json?$top=-1&$filtercode1="
						+ strMyProduct + '&$filtercode2=' + strVal,
				dataType : "json",
				success : function(data) {
					populateTemplateUserValues(data.d.preferences, []);
				}
			});
}

function populateTemplateUserValues(arrAvilableValues, strSelectedValues) {
	var field = $('#templateUsers' + (charPaymentType === 'B' ? 'Hdr' : '')), opt = null, isSelected = false;
	var arrUser = charPaymentType === 'B'
			? arrTemplateUsersHdr
			: arrTemplateUsersInst;
	field.empty();
	if (arrAvilableValues && arrAvilableValues.length > 0)
		$.each(arrAvilableValues, function(index, cfg) {
			if(arrUser.length == 0)
			{
				isSelected = true;
			}
			else
			{
				isSelected = jQuery.inArray(cfg.CODE, arrUser) != -1 ? true : false;
			}
			opt = $('<option />', {
						value : cfg.CODE,
						text : cfg.DESCRIPTION
					});
			if (isSelected)
				opt.attr('selected', true);
			opt.appendTo(field);
		});
	else {
		charPaymentType === 'B'
				? arrTemplateUsersHdr = []
				: arrTemplateUsersInst = [];
	}
	field.multiselect("refresh");
}
function persistTemplateUsers() {
	var field = $('#templateUsers' + (charPaymentType === 'B' ? 'Hdr' : ''));
	charPaymentType === 'B'
			? arrTemplateUsersHdr = (field.val() || [])
			: arrTemplateUsersInst = (field.val() || []);
}
/* Templates Roles/Users handling ends here */

/* Receiver AccountInstitution, IntermidiaryBank, ReceiverCorrespondent handling starts here */
function paintReceiverViewOnlyDetails(data,dataHdrInfo) {
	var beneficiary = data, strPostFix ='R_InstView',clsHide='hidden', fieldId =null;
	if( $('#beneficiaryDetailsId').length != 0){
	   $('#beneficiaryDetailsId').addClass('hidden');
	}
	if (beneficiary.drawerRegistedFlag == 'Y'
			|| beneficiary.drawerRegistedFlag == 'R') {
		arrStdFields = beneficiary.registeredBene
				? beneficiary.registeredBene
				: null;
		paintPaymentInstrumentReceiverViewOnlyFields(arrStdFields, strPostFix);
		if (arrStdFields) {
			$.each(arrStdFields, function(index, cfg) {
				fieldId=cfg.fieldName;
				if (cfg.fieldName === 'drawerCode' && !isEmpty(cfg.value)) {
					 toggleRegisteredReceiverInstViewMoreDetails(cfg.value);
				} /*else if ((cfg.fieldName === 'tag57Type'
						|| cfg.fieldName === 'tag54Type' || cfg.fieldName === 'tag56Type')) {
					handleReceiverTagDetailsSectionForRegisteredReceiver(
							 strPostFix, cfg, clsHide);
				}*/
				//paintRegisteredReceiverInfoFields(fieldId, strPostFix, cfg);
			});
		}
	} else {
		arrStdFields = beneficiary.adhocBene ? beneficiary.adhocBene : null;
		var instrumentId = paymentResponseInstrumentData.d.paymentEntry.paymentMetaData.instrumentId;
		ctrl = $('#registeredReceiverDetailsLinkInstView');
		ctrl.unbind('click');
		ctrl.bind('click', function() {
			$('.adhocReceiverDetailsInstView').toggleClass(clsHide);
			/*var isHidden = $('.adhocReceiverDetailsInstView').hasClass(clsHide);
			if (isHidden)
				$("#registeredReceiverDetailsLinkInstView")
						.text("View Additional Details");
			else
				$("#registeredReceiverDetailsLinkInstView")
						.text("View Less Details");*/
		});
		if('01' == instrumentId || '02' == instrumentId || '07' == instrumentId){
		     $('#beneficiaryDetailsId').removeClass('hidden');
		}
		paintPaymentInstrumentReceiverViewOnlyFields(arrStdFields, 'R_InstView');
	}
	handleReceiverTagDetailsSection(true);
	
	var blnIsSystemReceiver = isBatchPaymentForSystemBene(dataHdrInfo);
	if(blnIsSystemReceiver && strLayoutType==='MIXEDLAYOUT')
		toggleReceiverSystemBeneSection(blnIsSystemReceiver);
	if(strLayoutType === 'WIRESWIFTLAYOUT'){
		$('#registeredReceiverDetailsLinkInstView').click();
	}
	 
    enableDisableLEICode($('#receiverLeiTypeA').val());
    if($('#receiverLeiTypeR').val() === 'I'){
    	$(".receiverLeiCodeR_InstViewDiv").addClass('hidden');
    }	
    else if($('#receiverLeiTypeR').val() === 'C'){
    	$(".receiverLeiCodeR_InstViewDiv").removeClass('hidden');
    }
	
}
function handleReceiverTagDetailsSection(isViewOnly) {
	var data = paymentResponseInstrumentData, objHdrInfo = null, strClsHidden = 'hidden';
	if (data && data.d && data.d.paymentEntry
			&& data.d.paymentEntry.paymentHeaderInfo)
		objHdrInfo = data.d.paymentEntry.paymentHeaderInfo;

	// if (!isEmpty(strLayoutType) && (strLayoutType == 'WIRELAYOUT')) {
	if (!isEmpty(objHdrInfo)) {
		if (!isEmpty(objHdrInfo.receiverAccountWithInst)
				&& (objHdrInfo.receiverAccountWithInst == 'Y')) {
			$('.accWithInsMainADiv').removeClass(strClsHidden);
		} else
			$('.accWithInsMainADiv').addClass(strClsHidden);
		if (!isEmpty(objHdrInfo.receiverCorrBank)
				&& (objHdrInfo.receiverCorrBank == 'Y')) {
			$('.recCorrMainADiv').removeClass(strClsHidden);
		} else
			$('.recCorrMainADiv').addClass(strClsHidden);
		if (!isEmpty(objHdrInfo.receiverIntBank)
				&& (objHdrInfo.receiverIntBank == 'Y')) {
			$('.interBankMainADiv').removeClass(strClsHidden);
		} else
			$('.interBankMainADiv').addClass(strClsHidden);
	}
//	if(!isViewOnly){
//	var strTag57Val = $('input[name="tag57TypeA"]:radio:checked').val();
//	strTag57Val = strTag57Val ? strTag57Val : 'A';
//	if (!isEmpty(strTag57Val))
//		handleTagMsgTypeChange('tag57Type', strTag57Val);
//
//	var strTag54Val = $('input[name="tag54TypeA"]:radio:checked').val();
//	strTag54Val = strTag54Val ? strTag54Val : 'A';
//	if (!isEmpty(strTag54Val))
//		handleTagMsgTypeChange('tag54Type', strTag54Val);
//
//	var strTag56Val = $('input[name="tag56TypeA"]:radio:checked').val();
//	strTag56Val = strTag56Val ? strTag56Val : 'A';
//	if (!isEmpty(strTag56Val))
//		handleTagMsgTypeChange('tag56Type', strTag56Val);
//		}
}
//function handleTagMsgTypeChange(tagType, value) {
//	var clsHide = 'hidden';
//	if (!isEmpty(tagType) && !isEmpty(value)) {
//		if (tagType === 'tag57Type') {
//			if (value == 'A') {
//				$('.tag57TypeA').removeClass(clsHide);
//				$('.tag57TypeD').addClass(clsHide);
//			} else if (value == 'D') {
//				$('.tag57TypeA').addClass(clsHide);
//				$('.tag57TypeD').removeClass(clsHide);
//				$('#draweePayDetailTag57TypeD').val($('#draweePayDetailA').val());
//			} else {
//				$('.tag57TypeA').addClass(clsHide);
//				$('.tag57TypeD').addClass(clsHide);
//			}
//		} else if (tagType === 'tag54Type') {
//			if (value == 'A') {
//				$('.tag54TypeA').removeClass(clsHide);
//				$('.tag54TypeD').addClass(clsHide);
//			} else if (value == 'D') {
//				$('.tag54TypeA').addClass(clsHide);
//				$('.tag54TypeD').removeClass(clsHide);
//					$('#corrBankDetails1ATtag54TypeD').val($('#corrBankDetails1A').val());
//			} else {
//				$('.tag54TypeA').addClass(clsHide);
//				$('.tag54TypeD').addClass(clsHide);
//			}
//		} else if (tagType === 'tag56Type') {
//			if (value == 'A') {
//				$('.tag56TypeA').removeClass(clsHide);
//				$('.tag56TypeD').addClass(clsHide);
//			} else if (value == 'D') {
//				$('.tag56TypeA').addClass(clsHide);
//				$('.tag56TypeD').removeClass(clsHide);
//				$('#intBankDetails1ATag56TypeD').val($('#intBankDetails1A').val());
//			} else {
//				$('.tag56TypeA').addClass(clsHide);
//				$('.tag56TypeD').addClass(clsHide);
//			}
//		}
//	}
//}
function handleReceiverTagDetailsSectionForRegisteredReceiver(
		strPostFix, cfg, clsHide) {
	if (cfg && !isEmpty(cfg.value)) {
		var strFieldId = cfg.fieldName;
		$('.' + strFieldId + strPostFix + 'Div').removeClass(clsHide);
		$('.' + strFieldId + strValue + strPostFix + 'Div').removeClass(clsHide);
		var strValue = cfg.value;
		if (strValue == 'A') {
			$('.' + strFieldId + 'A' + strPostFix).removeClass(clsHide);
			$('.' + strFieldId + 'D' + strPostFix).addClass(clsHide);
			$('.' + strFieldId + 'A').removeClass(clsHide);
			$('.' + strFieldId + 'D').addClass(clsHide);
		} else if (strValue == 'D') {
			$('.' + strFieldId + 'D' + strPostFix).removeClass(clsHide);
			$('.' + strFieldId + 'A' + strPostFix).addClass(clsHide);
			$('.' + strFieldId + 'D').removeClass(clsHide);
			$('.' + strFieldId + 'A').addClass(clsHide);
		}
		handleTagMsgTypeChange(strFieldId, strValue);
	}
}
function paintRegisteredReceiverInfoFields(fieldId, strPostFix, cfg) {
	var strFieldId = cfg.fieldName;
	var strValue = getValueToDispayed(cfg);
	strValue = isEmpty(strValue) ? (cfg.value ? cfg.value : '') : strValue;
	ctrlLbl = $('.' + strFieldId + strPostFix);
	var valueLbl = $('#' + strFieldId + "R");
	
	if (valueLbl.length != 0) {
		if(cfg.fieldName == 'anyIdType' || cfg.fieldName == 'receiverLeiType')
		{
			valueLbl.val(cfg.value);
		}
		else
		{
			valueLbl.val(strValue);
		}
		
	}
	
	if (ctrlLbl.length != 0) {
		ctrlLbl.text(strValue);
	}
	var ctrl = $('.' + strFieldId + strPostFix);
	if ((cfg && !isEmpty(cfg.displayMode)
			&& (cfg.displayMode === "2" || cfg.displayMode === "3") && ctrl && ctrl.length > 0)){
		var ctrlClassSelector = $('.' + strFieldId + strPostFix + 'Div');
		if (ctrlClassSelector && ctrlClassSelector.hasClass('hidden'))
			ctrlClassSelector.removeClass('hidden');
		
		//dynamic binding of label field
		if(cfg.label){
			if("drawerDescription" === cfg.fieldName){
				
				$("label[for='drawerDescriptionR']").text(getLabel(cfg.fieldName,cfg.label));
			
			}else {
			
				$("label[for=" +cfg.fieldName+ "]").text(cfg.label);
			}
		}
	}
}
//function handleTagFieldValueSectionShowHide(strTag57Type,strTag54Type,strTag56Type)
//{
//	handleTagMsgTypeChange('tag57Type', strTag57Type);
//	handleTagMsgTypeChange('tag54Type', strTag54Type);
//	handleTagMsgTypeChange('tag56Type', strTag56Type);
//}
/*
 * Receiver AccountInstitution, IntermidiaryBank, ReceiverCorrespondent handling
 * ends here
 */
/* Payment Entry Cutoff handling for group actions starts here */
function showPaymentEntryCutoffAlert(intHeight, intWidth, strTitle, strMsg,
		fptrCallback, arrData) {
	_objCutOffDialog = $("#paymentEntryCutOffMessageDialog");
	_objCutOffDialog.text(strMsg);
	_objCutOffDialog.dialog({
				bgiframe : true,
				autoOpen : false,
				minHeight : intHeight,
				height : intHeight,
				modal : true,
				resizable : false,
				width : intWidth,
				title : strTitle,
				buttons : $
						.extend(
								(arrData && arrData.isRollover && arrData.isRollover == 'Y')
										? {
											"Roll Over" : function() {
												$(this).dialog("close");
												_cutOffAlertResult(
														arrData.action,
														fptrCallback, arrData);
											}
										}
										: {},
								(arrData && arrData.isReject && arrData.isReject == 'Y')
										? {
											"Reject" : function() {
												$(this).dialog("close");
												_cutOffAlertResult('reject',
														fptrCallback, arrData);
											}
										}
										: {},
								(arrData && arrData.isReject && arrData.isDiscard == 'Y' && arrData.isRollover == 'N' && arrData.isReject == 'N')
										? {
											//FTMNTBANK-1780 Only Discard action is available
											"Ok" : function() {
												$(this).dialog("close");
												_cutOffAlertResult('discard',
														fptrCallback, arrData);
											}
										}
										: {},		
								(arrData && arrData.isDiscard && arrData.isDiscard == 'Y' && !(arrData.isRollover == 'N' && arrData.isReject == 'N'))
										? {
											"Discard" : function() {
												$(this).dialog("close");
												_cutOffAlertResult('discard',
														fptrCallback, arrData);
											}
										}
										: {})
			});

	_objCutOffDialog.dialog('open');
	_objCutOffDialog.dialog("option","position","center");
}

function _cutOffAlertResult(strAction, fptrCallback, arrData) {
	_objCutOffDialog.dialog('destroy');
	fptrCallback(strAction, arrData);
};
function postHandlePaymentInstrumentActionsProductCutOff(strAction, args,strRemarks) {
	doHandlePaymentInstrumentAction(strAction, true, 'Y');
}
/* Payment Entry Cutoff handling for group actions ends here */
/* MIXED Layout handling starts here*/
function handleLayoutBasedScreenRendering(strPayType, objPaymentResponseData) {
	if (strLayoutType === 'MIXEDLAYOUT') {
		var strPostFix = strPayType == 'B' ? 'Hdr' : '';
		var strDivPostFix = strPayType == 'B' ? 'HdrDiv' : 'Div';
		var strBankProdVal = $('#bankProduct' + strPostFix).val();
		var chrProductLevel = 'B';
		toggleContainerVisibility('paymentHeaderEntryStep2A');

		if (objPaymentResponseData && objPaymentResponseData.d
				&& objPaymentResponseData.d.paymentEntry
				&& objPaymentResponseData.d.paymentEntry.paymentHeaderInfo.productLevel) {
			chrProductLevel = objPaymentResponseData.d.paymentEntry.paymentHeaderInfo.productLevel;
		}
		
		if (chrProductLevel == 'B') {
			if (isEmpty(strBankProdVal)) {
				handleVerticalPanelCollapse(true, 'paymentInformation'
								+ strDivPostFix);
				if (strPayType == 'Q') {
					handleVerticalPanelCollapse(true, 'senderDetails'
									+ strDivPostFix);
					handleVerticalPanelCollapse(true, 'paymentDetails'
									+ strDivPostFix);
					handleVerticalPanelCollapse(true, 'addendaSection'
									+ strDivPostFix);
					if(strEntryType == 'SI')				
					handleVerticalPanelCollapse(true, 'siParametersSection');				
				}else{
					shiftDrCrSectionForBatchLevelParameters();
				}
			} else {
				handleVerticalPanelCollapse(false, 'paymentInformation'
								+ strDivPostFix);
				if (strPayType == 'Q') {
					handleVerticalPanelCollapse(false, 'senderDetails'
									+ strDivPostFix);
					handleVerticalPanelCollapse(false, 'paymentDetails'
									+ strDivPostFix);
					handleVerticalPanelCollapse(false, 'addendaSection'
									+ strDivPostFix);
					if(strEntryType == 'SI')				
						handleVerticalPanelCollapse(false, 'siParametersSection');				
				}else{
					shiftDrCrSectionForBatchLevelParameters();
				}
			}
		} else if (chrProductLevel == 'I') {
			if (isEmpty(strBankProdVal)) {
				if (strPayType == 'Q') {
					handleVerticalPanelCollapse(true, 'senderDetails'
									+ strDivPostFix);
					handleVerticalPanelCollapse(true, 'paymentDetails'
									+ strDivPostFix);
					handleVerticalPanelCollapse(true, 'addendaSection'
									+ strDivPostFix);
									
					if(strEntryType == 'SI')				
					handleVerticalPanelCollapse(true, 'siParametersSection');				
				}
			} else {
				if (strPayType == 'Q') {
					handleVerticalPanelCollapse(false, 'senderDetails'
									+ strDivPostFix);
					handleVerticalPanelCollapse(false, 'paymentDetails'
									+ strDivPostFix);
					handleVerticalPanelCollapse(false, 'addendaSection'
									+ strDivPostFix);
									
					if(strEntryType == 'SI')				
						handleVerticalPanelCollapse(false, 'siParametersSection');				
				}
			}
		}
	}
	else if (strLayoutType === 'WIRESWIFTLAYOUT'){
		$('#additionalInfoValue').attr('checked',true);
		$('#swiftInfoValue').attr('checked',true);
		$('#swiftInstructionValue').attr('checked',true);
		$('#regulatoryInfoValue').attr('checked',true);
		$('#referInfoValue').attr('checked',true);
	}
}
function shiftDrCrSectionForBatchLevelParameters() {
	if ($('#DrCrSectionColumn').length == 0) {
		var objDrCrColumn = $('<div id="DrCrSectionColumn" class="col-sm-4"></div>');
		$('#drCrFlagDiv,#prenoteDiv,#confidentialFlagDiv,#holdDiv,#holdUntilFlagDiv')
				.appendTo(objDrCrColumn);
		objDrCrColumn.insertBefore($('#txnWizardProductColumn'));
	}
}
function handleVerticalPanelCollapse(collpse, divId) {
	// collapse if currently expanded
	if (collpse
			&& !isEmpty(divId)
			&& !$('#' + divId + ' .vertical-collapsible-contents')
					.hasClass('content-display-none')) {
		$('#' + divId + ' span.expand-vertical').trigger('click');
	}
	//expand if currently collapsed
	else if (!collpse
			&& !isEmpty(divId)
			&& $('#' + divId + ' .vertical-collapsible-contents')
					.hasClass('content-display-none')) {
		$('#' + divId + ' span.expand-vertical').trigger('click');
	}
}
/* MIXED Layout handling ends here*/

function getReportPaymentDetail(screenType,actionName,strIdentifier){
	var strUrl = '';
	var strExtension = '';
	var withHeaderFlag = '';
	if(null != document.getElementById("headerCheckbox"))
		withHeaderFlag = document.getElementById("headerCheckbox").checked;
	var arrExtension = {
		downloadCsv : 'csv',
		downloadPdf : 'pdf',
		downloadTsv : 'tsv',
        downloadXls : 'xls'
	};	
	strExtension = arrExtension[actionName];
	if (actionName == 'downloadNacha') {
		var arrJson = new Array();
		arrJson.push({
					identifier : strIdentifier
				});
		if (!Ext.isEmpty(arrJson))
		{
			form = document.createElement( 'FORM' );
			form.name = 'frmMain';
			form.id = 'frmMain';
			form.method = 'POST';
			form.appendChild( createFormField( 'INPUT', 'HIDDEN', csrfTokenName, tokenValue ) );
			form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'identifier', strIdentifier ) );
			form.action = 'services/paymentsbatch/nachadownload';
			document.body.appendChild( form );
			form.submit();
			document.body.removeChild( form );
		}
			//$.download('services/paymentsbatch/nachadownload', arrJson);
		//alert('Nacha');
	}
	else{	
		strUrl = 'services/getPaymentViewRecordDetailReport.' + strExtension;
		form = document.createElement( 'FORM' );
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', csrfTokenName, tokenValue ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', '$Recordkey', strRecKey ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', '$screenType', screenType ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', '$PaymentCategory', strPaymentCategory ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', '$LayoutType', strLayoutType ) );
		form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'txtCSVFlag', withHeaderFlag) );	
		form.action = strUrl;
		document.body.appendChild( form );
		form.submit();
		document.body.removeChild( form );
	}	
}

function getReportPaymentTxnDetail(){
	var screenType = 'ViewTransaction';
	var intCurrentInst = null;
	//var intCurrentInst = parseInt($($('.currentPage')[0]).text());
	if(paymentResponseInstrumentData
			&& paymentResponseInstrumentData.d
			&& paymentResponseInstrumentData.d.__metadata
			&& paymentResponseInstrumentData.d.__metadata._serial){
		intCurrentInst = paymentResponseInstrumentData.d.__metadata._serial;
	}
	var strUrl = '';
	strUrl = 'services/getPaymentViewRecordDetailReport.pdf';
	form = document.createElement( 'FORM' );
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', csrfTokenName, tokenValue ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', '$Recordkey', strRecKey ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', '$screenType', screenType ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', '$PaymentCategory', strPaymentCategory ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', '$InstNumber', intCurrentInst ) );
	form.action = strUrl;
	document.body.appendChild( form );
	form.submit();
	document.body.removeChild( form );	
}

function createFormField(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
}

function showUploadErrorReport(record) {
		var me = this;
		var importType = 'Y';
		if(record.statusCode == 'E')
			importType = 'N';
		var strUrl = 'services/getFileUploadCenterList/getUploadErrorReport.pdf'
		form = document.createElement( 'FORM' );
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName,  csrfTokenValue ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'taskid', record.ahtskdata ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'isImportReport', importType ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'client', record.ahtskclient) );
		form.action = strUrl;
		document.body.appendChild( form );
		form.submit();
		document.body.removeChild( form );
	}
function toggleReceiverSystemBeneSection(blnSwitchToSystemReceiver) {
	if (blnSwitchToSystemReceiver) {
		$('.systemReceiverViewOnly').removeClass('hidden');
		$('.nonSystemReceiverViewOnly').addClass('hidden');
	} else {
		$('.systemReceiverViewOnly').addClass('hidden');
		$('.nonSystemReceiverViewOnly').removeClass('hidden');
	}
}

function populateSingleAccounts(me)
{
	var strData = {};
	var strUrl = 'services/getSendingAccountData.json';
	var companyId = me.value;
	strData[ '$companyId' ] = companyId;
	strData[ csrfTokenName ] = csrfTokenValue;
	if( !Ext.isEmpty(companyId) )
	{
		$( '#companyId > option' ).remove();
		eval( "document.getElementById('companyId').options[0]=" + "new Option('" + getLabel('selectCompany','Select Company') + "','" + '' + "')" );
		
		if(!isEmpty(paymentResponseInstrumentData)){
			if (paymentResponseInstrumentData && paymentResponseInstrumentData.d && paymentResponseInstrumentData.d.paymentEntry) {
				if (paymentResponseInstrumentData.d.paymentEntry.standardField){
					arrFields = paymentResponseInstrumentData.d.paymentEntry.standardField;
						$.each(arrFields, function(index, cfg) {
						if(cfg.fieldName === 'companyId'){
							$.each(cfg['availableValues'],function(i,v){
								if( companyId == v.code )
								{
									opt = document.createElement("option");
						            document.getElementById("companyId").options.add(opt);
						            opt.text = v.description;
						            opt.value = v.code;
						            opt.selected = true;
								}
							});
							return false;
						}
					});
				}
			}
			$('#companyId').niceSelect("destroy");
			$('#companyId').niceSelect();
		}
	}
	if( $('#accountNo').val() == "" || companyId == "" )
	{
		$.ajax(
				{
					url : strUrl,
					method : 'POST',
					data : strData,
					contentType : "application/json",
					complete : function(XMLHttpRequest, textStatus) {
						if ("error" == textStatus) {
							var arrError = new Array();
							arrError.push({
										"errorCode" : "Message",
										"errorMessage" : mapLbl['unknownErr']
									});
							paintErrors(arrError);
							blockPaymentUI(false);
						}
					},
					success : function( response )
					{
						loadSingleSendingAccountBox( response );
						if(companyId == "")
							populateSingleCompanyId(' ');
					}
				} );
	}
}

function loadSingleSendingAccountBox(accountList)
{
	$( '#accountNo > option' ).remove();
	eval( "document.getElementById('accountNo').options[0]=" + "new Option('" + getLabel('selectAccount','Select Account') + "','" + '' + "')" );
	for( var i = 0 ; i < accountList.length ; i++ )
	{
        	opt = document.createElement("option");
            document.getElementById("accountNo").options.add(opt);
            opt.text = accountList[i].description;
            opt.value = accountList[i].code;
            if(accountList.length == 1)
            	opt.selected = true;
	}
	
	$('#accountNo').niceSelect("destroy");
	$('#accountNo').niceSelect();
	
	if(!isEmpty(paymentResponseInstrumentData)){
		if (paymentResponseInstrumentData && paymentResponseInstrumentData.d && paymentResponseInstrumentData.d.paymentEntry) {
			if (paymentResponseInstrumentData.d.paymentEntry.standardField){
				arrFields = paymentResponseInstrumentData.d.paymentEntry.standardField;
					$.each(arrFields, function(index, cfg) {
						if(cfg.fieldName === 'accountNo'){
							cfg['availableValues'] = (!isEmpty(accountList)) ? accountList :[];
							return false;
						}
					});
				}
			}
		}
}

function populateSingleCompanyId(me)
{
	var strData = {};
	var strUrl = 'services/getCompanyIDData.json';
	var accountId = me.value;
	strData[ '$accountId' ] = accountId;
	strData[ csrfTokenName ] = csrfTokenValue;
	if(strPrdID === '62')
	{
	if( !Ext.isEmpty(accountId) )
	{
		$( '#accountNo > option' ).remove();
		eval( "document.getElementById('accountNo').options[0]=" + "new Option('" + getLabel('selectAccount','Select Account') + "','" + '' + "')" );
		
		if(!isEmpty(paymentResponseInstrumentData)){
			if (paymentResponseInstrumentData && paymentResponseInstrumentData.d && paymentResponseInstrumentData.d.paymentEntry) {
				if (paymentResponseInstrumentData.d.paymentEntry.standardField){
					arrFields = paymentResponseInstrumentData.d.paymentEntry.standardField;
						$.each(arrFields, function(index, cfg) {
						if(cfg.fieldName === 'accountNo'){
							$.each(cfg['availableValues'],function(i,v){
								if( accountId == v.code )
								{
									opt = document.createElement("option");
						            document.getElementById("accountNo").options.add(opt);
						            opt.text = v.description;
						            opt.value = v.code;
						            opt.selected = true;
								}
							});
							return false;
						}
					});
				}
			}
			$('#accountNo').niceSelect("destroy");
			$('#accountNo').niceSelect();
		}
	}
	if( $('#companyId').val() == "" || accountId == "" )
	{
	$.ajax(
	{
		url : strUrl,
		method : 'POST',
		data : strData,
		contentType : "application/json",
		complete : function(XMLHttpRequest, textStatus) {
			if ("error" == textStatus) {
				var arrError = new Array();
				arrError.push({
							"errorCode" : "Message",
							"errorMessage" : mapLbl['unknownErr']
						});
				paintErrors(arrError);
				blockPaymentUI(false);
			}
		},
		success : function( response )
		{
			loadSingleCompanyIDBox( response );
				if(accountId == "")
					populateSingleAccounts(' ');
		}
	} );
}
}
}
function loadSingleCompanyIDBox( companyList )
{
	$( '#companyId > option' ).remove();
		eval( "document.getElementById('companyId').options[0]=" + "new Option('" + getLabel('selectCompany','Select Company') + "','" + '' + "')" );
	
	for( var i = 0 ; i < companyList.length ; i++ )
	{
        	opt = document.createElement("option");
            document.getElementById("companyId").options.add(opt);
            opt.text = companyList[i].description;
            opt.value = companyList[i].code;
            if(companyList.length == 1)
            	opt.selected = true;
	}
	$('#companyId').niceSelect("destroy");
	$('#companyId').niceSelect();
	if(!isEmpty(paymentResponseInstrumentData)){
		if (paymentResponseInstrumentData && paymentResponseInstrumentData.d && paymentResponseInstrumentData.d.paymentEntry) {
			if (paymentResponseInstrumentData.d.paymentEntry.standardField){
				arrFields = paymentResponseInstrumentData.d.paymentEntry.standardField;
					$.each(arrFields, function(index, cfg) {
						if(cfg.fieldName === 'companyId'){
							cfg['availableValues'] = (!isEmpty(companyList)) ? companyList :[];
							return false;
						}
					});
				}
			}
		}
}
function showApprovalConfirmationPopup(strAction,chrPaymentTypeValue) {
	_objDialog = $('#approvalConfirmationPaymentViewScreenPopup');
	_objDialog.dialog({
				bgiframe : true,
				autoOpen : false,
				modal : true,
				resizable : false,
				width : "320px",
				chrPaymentTypeValue:chrPaymentTypeValue,
				strAction:strAction,
				close : function() {
					$('#approveMsg').removeClass('hidden');
					$('#approveAllMsg').addClass('hidden');
				}
			});
	_objDialog.dialog('open');
	_objDialog.dialog('option','position','center');
}
function showVerifyConfirmationPopup(strAction,chrPaymentTypeValue) {
	_objDialog = $('#verifyAllConfirmationPaymentViewScreenPopup');
	_objDialog.dialog({
				bgiframe : true,
				autoOpen : false,
				modal : true,
				resizable : false,
				width : "320px",
				chrPaymentTypeValue:chrPaymentTypeValue,
				strAction:strAction,
				close : function() {
					$('#verifyAllMsg').addClass('hidden');
				}
			});
	_objDialog.dialog('open');
	_objDialog.dialog('option','position','center');
}
function showVerifySubmitConfirmationPopup() {
	_objDialog = $('#verifySubmitConfirmationPaymentScreenPopup');
	_objDialog.dialog({
				bgiframe : true,
				autoOpen : false,
				modal : true,
				resizable : false,
				width : "320px",
				close : function() {
					//$('#verifyAllMsg').addClass('hidden');
				}
			});
	_objDialog.dialog('open');
	_objDialog.dialog('option','position','center');
}
function approvalConfirmationApprove() {
	var chrPaymentTypeValue = $("#approvalConfirmationPaymentViewScreenPopup").dialog("option", "chrPaymentTypeValue");
	var strAction = $("#approvalConfirmationPaymentViewScreenPopup").dialog("option", "strAction");
	$('#approvalConfirmationPaymentViewScreenPopup').dialog("close");	
	if (chrPaymentTypeValue === 'B')
		doHandlePaymentHeaderActions(strAction);
	else if (chrPaymentTypeValue === 'Q' && strPaymentType ==='BATCHPAY'){
		rowAction = "Q";
		doHandlePaymentInstrumentAction(strAction, false);
	}
	else if (chrPaymentTypeValue === 'Q' && strPaymentType ==='QUICKPAY')
		doHandlePaymentInstrumentAction(strAction, true);	
}
function approvalConfirmationClose() {
	$('#approvalConfirmationPaymentViewScreenPopup').dialog("close");
}
function sendAllConfirmationClose() {
	$('#sendAllConfirmationPaymentViewScreenPopup').dialog("close");
}
function sendAllConfirmationApprove() {
	doHandlePaymentHeaderActions('InstSend');	
	$('#sendAllConfirmationPaymentViewScreenPopup').dialog("close");
}
function verifyAllConfirmationClose() {
	$('#verifyAllConfirmationPaymentViewScreenPopup').dialog("close");
}
function verifyAllConfirmationApprove() {
	//doHandlePaymentHeaderActions('verify');
	var chrPaymentTypeValue = $("#verifyAllConfirmationPaymentViewScreenPopup").dialog("option", "chrPaymentTypeValue");
	var strAction = $("#verifyAllConfirmationPaymentViewScreenPopup").dialog("option", "strAction");
	if (chrPaymentTypeValue === 'B')
		doHandlePaymentHeaderActions(strAction);
	else if (chrPaymentTypeValue === 'Q' && strPaymentType ==='BATCHPAY'){
		rowAction = "Q";
		doHandlePaymentInstrumentAction(strAction, false);
	}
	else if (chrPaymentTypeValue === 'Q' && strPaymentType ==='QUICKPAY')
		doHandlePaymentInstrumentAction(strAction, true);	
	$('#verifyAllConfirmationPaymentViewScreenPopup').dialog("close");
}
function showSendAllConfirmationPopup(strAction,chrPaymentTypeValue) {
	_objDialog = $('#sendAllConfirmationPaymentViewScreenPopup');
	_objDialog.dialog({
				bgiframe : true,
				autoOpen : false,
				modal : true,
				resizable : false,
				width : "320px",
				strAction:strAction,
				close : function() {
					$('#sendAllMsg').addClass('hidden');
				}
			});
	_objDialog.dialog('open');
	_objDialog.dialog('option','position','center');
};
function cancelPaymentInstrumentAdditionalInfoPopup(){
	$('#paymentInstrumentTrasanctionSummaryDiv').dialog('close');
}
function setTemplateMaxUsageValue(strPmtType){
	//Function is being used in Advance Settings popup but not defined. Need to verify
}

function showNextDateOnPaymentScreen(strPaymentType){
	var strPostFix = (strPaymentType === 'QUICKPAY' || strPaymentType === 'QUICKPAYSTI') ?  strPostFix = '' : strPostFix = 'Hdr',strRefDay='';
	if($('#refDay'+strPostFix).hasClass('jq-multiselect')){
		strRefDay = $('#refDay'+strPostFix).getMultiSelectValue().toString();
	}else{
		strRefDay = isEmpty($('#refDay'+strPostFix).val()) ? '' : $('#refDay'+strPostFix).val().toString();
		
			//strRefDay = $('#refDay'+strPostFix).val();		
	}	
	var siTerminationDate = $('#siTerminationDate'+strPostFix).val();
	siTerminationDate = isEmpty(siTerminationDate) ? '12/31/2099' : siTerminationDate;
	if(!isEmpty(siTerminationDate)){	
	$.ajax({
		url : "services/getSiNextExecutionDate",
		type : 'POST',
		dataType : "json",
		data : {
			$bankProduct : $('#bankProduct'+strPostFix).val(),
			$startDate : $('#siEffectiveDate'+strPostFix).val(),
			$endDate : siTerminationDate,
			$typeOfDate : $('#siExecutionDate'+strPostFix).val(),
			$frequency : $('#siFrequencyCode'+strPostFix).val(),
			$period : isEmpty($('#period'+strPostFix).val()) ? '' : $('#period'+strPostFix).val(),
			$referenceDay : strRefDay,
			$holidayAction : $('#holidayAction'+strPostFix).val()
		},
		success : function(data) {
			if (data && data.d && data.d.siNextExecutionDate) {
				var value = data.d.siNextExecutionDate;
				 $('#siNextExecutionDate'+strPostFix).val(value);
			}
		}
	});
	}
}

function handleEffectiveTimeFieldPopulation(cfg, fromHeader){
	var effTimeHr, effTimeMin = null;
	if(strPaymentType === 'QUICKPAY') {
		$('#txnDateWraperDiv').removeClass('col-sm-12');
		$('#txnDateWraperDiv').addClass('col-sm-6');
		$('#activationTime').removeClass('hidden');
		effTimeHr = 'effectiveTimeHr';
		effTimeMin = 'effectiveTimeMin';
	} else if(strPaymentType === 'QUICKPAYSTI') {
		$('#activationTime').removeClass('hidden');
		effTimeHr = 'effectiveTimeHr';
		effTimeMin = 'effectiveTimeMin';
	} else if(strPaymentType === 'BATCHPAY') {
		if(fromHeader){
			effTimeHr = 'effectiveTimeHrHdr';
			effTimeMin = 'effectiveTimeMinHdr';
			$('#txnDateHdrWraperDiv').removeClass('col-sm-12');
			$('#txnDateHdrWraperDiv').addClass('col-sm-6');
			$('#activationTimeHdr').removeClass('hidden');
		} else {
			effTimeHr = 'effectiveTimeHr';
			effTimeMin = 'effectiveTimeMin';
			$('#activationTime').removeClass('hidden');
		}
		if($('#txnDateHdrDiv').hasClass('hidden')){
			$('#txnDateHdrWraperDiv').addClass('hidden');
		}
	}
	
	if(cfg.value){
		var time = cfg.value;
		var arrTime = time.split(':');
		if(!Ext.isEmpty(arrTime) && arrTime.length == 2){
			$('#'+effTimeHr).val(arrTime[0]);
			$('#'+effTimeMin).val(arrTime[1]);
			$('#'+effTimeHr).niceSelect("destroy");
			$('#'+effTimeMin).niceSelect("destroy");
			//$('#'+effTimeHr,'#'+effTimeMin).niceSelect();
			$('#'+effTimeHr).niceSelect();
			$('#'+effTimeMin).niceSelect();
			//$('#'+effTimeHr+'-niceSelectList','#'+effTimeMin+'-niceSelectList').attr('style','min-width:5%');
			$('#'+effTimeHr+'-niceSelectList').attr('style','min-width:5%');
			$('#'+effTimeMin+'-niceSelectList').attr('style','min-width:5%');
		}
	} else {
		var serverdate = new Date(currenttime);
		var effHour = serverdate.getHours();
		var effMinute = serverdate.getMinutes();
		if(effHour < 10)
			effHour = "0"+effHour;
		if(effMinute < 10)
			effMinute = "0"+effMinute;
		$('#'+effTimeHr).niceSelect("destroy");
		$('#'+effTimeMin).niceSelect("destroy");
		$('#'+effTimeHr).niceSelect();
		$('#'+effTimeMin).niceSelect();
		$('#'+effTimeHr).val(effHour);
		$('#'+effTimeMin).val(effMinute);
		$('#'+effTimeHr).niceSelect("update");
		$('#'+effTimeMin).niceSelect("update");
		$('#'+effTimeHr+'-niceSelectList').attr('style','min-width:5%');
		$('#'+effTimeMin+'-niceSelectList').attr('style','min-width:5%');
	}
}

function toggleTxnWizardAmountLabel(strAmountType) {
	var clsHide = 'hidden';
	if (strAmountType === 'P') {
		$('#thresholdAmountLabel').removeClass(clsHide);
		$('.transactionWizardInnerDiv #amountLabel').addClass(clsHide);
	} else {
		$('#thresholdAmountLabel').addClass(clsHide);
		$('.transactionWizardInnerDiv #amountLabel').removeClass(clsHide);
	}
}
function handleLableChangeForPhisicalPaymentFields(data,mode) {
	var productList = data.availableValues;
	var productType;
	if(!Ext.isEmpty(productList)){
		$.each(productList, function(index, cfg) {
			if(cfg.code ===data.value){
				productType = cfg.additionalInfo.PAY_COLL_DETAIL;
				strPrdID = productType
			}		
		});
	}
	if (productType==='01') {
		/*$('#micrNoLbl').text(getLabel('micrno','Check Number'));
		$('#instrumentDateLbl').text(getLabel('instrumentDateLbl','Check Date'));*/
		
		$("label[for='micrNo']").text(getLabel('micrno','Check Number'));
		$("label[for='instrumentDate']").text(getLabel('checkinstrumentDateDDLbl','Check Date'));
	} else if (productType==='02') {
		/*$('#micrNoLbl').text(getLabel('micrno','DD Number'));
		$('#instrumentDateLbl').text(getLabel('instrumentDateLbl','DD Date'));*/
	
		$("label[for='micrNo']").text(getLabel('micrnoDD','DD Number'));
		$("label[for='instrumentDate']").text(getLabel('ddinstrumentDateDDLbl','DD Date'));
	}else if (productType==='07')  {
		/*$('#micrNoLbl').text(getLabel('micrno','DD Number'));
		$('#instrumentDateLbl').text(getLabel('instrumentDateLbl','DD Date'));*/
	
		$("label[for='micrNo']").text(getLabel('micrnoPO','PO Number'));
		$("label[for='instrumentDate']").text(getLabel('poinstrumentDateDDLbl','PO Date'));
	}
}
function doValidateEnteredAndTotalAmount(){
	var strPayAmount,strTotalDenomAmount,retValue = true;
	strPayAmount = $('#amount').val();
	strTotalDenomAmount = $('#totalDenomAmount').val();
	if(isEmpty(strPayAmount)) 
		strPayAmount = "0.00";
	if(!$('#cashwihdrawaldetails').is(":hidden")){	
	if (!isEmpty(strPayAmount) && !isEmpty(strTotalDenomAmount)) {
		if (strPayAmount !== strTotalDenomAmount) {
			var arrError = [{
						errorMessage : mapLbl['CashPaymentAmountTotalAmountErrorMsg'],
						errorCode : 'VAL-0006'
					}];
			paintErrors(arrError);
			scrollToTop();
			retValue = false;
		} else
			retValue = true;
		}
	}	
	return retValue;
}

function doValidateInvoiceDate(){
	var retValue = true;
	var invoiceDate = $('#invoiceDate').val();
	if(isEmpty(invoiceDate)) {
		var arrError = [{
					errorMessage : mapLbl['WHTInvoiceDateErrorMsg'],
					errorCode : 'VAL-0008'
				}];
		paintWhtPopupErrors(arrError,'whtPopupDetailsMessageDiv');
		retValue = false;
	}	
	return retValue;
}

function populateApiEnrichmentType(data,strPrefix)
{
	if(data.d
			&& data.d.paymentEntry
			&& data.d.paymentEntry.enrichments)
	{
		$.each(data.d.paymentEntry.enrichments, function(key,enrichment)
		{
			if(enrichment)
			{
				if(enrichment.parameters)
				{
					$.each(enrichment.parameters, function(sequence,parameter)
					{
						if(parameter && !Ext.isEmpty(parameter.apiName))
						{
							var fieldId;
							if(!Ext.isEmpty(strPrefix)){
								fieldId = strPrefix+parameter.code;
							}
							else{
								fieldId = parameter.code;
							}
							objApiEnrichmentType[fieldId] = key;		
						}
					});
				}
				else
				{
					$.each(enrichment, function(sequence,multiset)
					{
						$.each(multiset.parameters, function(multisetSeq,multiSetParameter)
						{
							if(multiSetParameter && !Ext.isEmpty(multiSetParameter.apiName))
							{
								var fieldId;
								if(!Ext.isEmpty(strPrefix)){
									fieldId = strPrefix+multiSetParameter.code;
								}
								else{
									fieldId = multiSetParameter.code;
								}
								objApiEnrichmentType[fieldId] = key;	
							}
						});
					});
				}
			}
			
		});
	}
}

function doHandleApiCall(cfg,idPostFix)
{
	if(!Ext.isEmpty(idPostFix) && cfg)
	{
		cfg.fieldName+=idPostFix;
	}
	var fieldName='#'+cfg.fieldName;
	$(fieldName).unbind('blur.apiCall');
	$(fieldName).on('blur.apiCall',function(){
		doHandelRefreshBatchInstrumentFieldsOnEnrichChange(cfg,"paymentCustomization");
	});
}


function checkCountrySelected() {
	var attribute = $('#benCountry_OA').attr('optionSelected');
	if(attribute != 'true')
		$("#benCountry_OA").val('');
}

function paintWhtPopupErrors(arrError,errorDivPanel,strErrTitle) {
	var errorPanel =  '#'+errorDivPanel;
	strErrTitle = !isEmpty(strErrTitle) ? strErrTitle : getLabel('errorlbl','ERROR');
	var strTargetDivId = errorPanel+' #whtMessageArea';
	var element = null, strMsg = null, strErrorCode = '';
	
	$(strTargetDivId).empty();
    if(!isEmpty(strErrTitle)){
		$(errorPanel+' '+'#whtMessageCodeSpan').empty();
		$(errorPanel+' '+'#whtMessageCodeSpan').text(strErrTitle+':');
	}
    
	$.each(arrError, function(index, error) {
		strMsg = error.errorMessage;
		strErrorCode = error.errorCode || error.code;
		strMsg += !isEmpty(strErrorCode) ? ' (' + strErrorCode + ')' : '';
		element = $('<p>').text(strMsg);
		element.appendTo($(strTargetDivId));

    });
	$(errorPanel+' ,'+strTargetDivId+', '+errorPanel+' #whtMessageContentDiv').removeClass('hidden');
}

function onIbanBlur()
{
	var bankIdTypeVal = $('#beneficiaryBankIDTypeA').val();
	var acctNumber = $('#drawerAccountNoA').val();
	var paymentType = achSeccode == 'IAT'? '' : strPaymentCategory;
	if( !Ext.isEmpty(bankIdTypeVal) && bankIdTypeVal == "IBAN" )
	{
		$.ajax({
			url : 'services/userseek/drawerbank.json?$top=20&$filtercode1=IBAN&$filtercode2='+paymentType+'&$autofilter='+acctNumber.toUpperCase(),
			type : 'GET',
			contentType : "application/json",
			success : function(data) {
				if( data && data.d && data.d.preferences && data.d.preferences.length > 0)
				{
					$('#beneficiaryBranchDescriptionA').val( data.d.preferences[0].BRANCHDESCRIPTION );
					$('#beneficiaryAdhocbankFlagA').val('R');
				}
				else
				{
					$('#beneficiaryBranchDescriptionA').val('');
				}
			}
		});
	}
}

function showHideOrderbyHdrDiv(calledfrom) {
	if (calledfrom == 'NEW') {
		$("#templateOrderbyHdr").val('asc');
		 makeNiceSelect('templateOrderbyHdr', true);
	}

	if (!Ext.isEmpty($("#templateOrderbyColumnHdr").val())) {
		$("#templateOrderbyHdrDiv").show();
	} else {
		$("#templateOrderbyHdrDiv").hide();
		$("#templateOrderbyHdr").val('asc');
		makeNiceSelect('templateOrderbyHdr', true);
	}

}
function refreshTxnDetailseGrid(refreshFlag)
{
		$("#txnDetailsGridDiv").empty();
		createTxnDetailsGrid('txnDetailsGridDiv',strPaymentHeaderIde);
		if( refreshFlag && countr < refreshCount && intervalFlag && refreshIntervalTime)
		{
			intervalFlag = false;
			countr++;
			setTimeout( function()
			{
				refreshTxnDetailseGrid(refreshFlag);
			}, refreshIntervalTime * 1000 );
		}
}
function createFlipView(productList,cutoffProduct,strAction){
	var rows = 1;
	for(m in productList){
		
		 var select = $("<select></select>").attr("id", "flipList"+rows).attr("name",  "flipList"+rows).attr("cssClass", "w15_7 rounded ux_no-margin").attr("class", "nice-select form-control jq-nice-select").attr("maxlength","40");
		 select.append($("<option></option>").attr("value", "").text("Select Product").attr("selected", "true"));
		 for(var i=0; i<productList[m].length;i++){
			var newProduct = productList[m][i];
			var optionValue =newProduct.substring(0,newProduct.indexOf(":"));
			var optionText = newProduct.substring(eval(newProduct.indexOf(":")+1));
			if(!isEmpty($.trim(newProduct))){
				select.append($("<option></option>").attr("value", optionValue).text(optionText));
			}	
		}
		 var flipproductKey = m.substring(m.indexOf("-")+1) ;
		 var flipproductCurrencyKey = m.substring(0,m.indexOf("-")) ;
		 var divBreached = $("<div>"+flipproductKey+"</div>").attr("class", "col-sm-3 form-group");
		 select.attr("oldproduct" ,  m.substring(0, m.indexOf("-")))
		 var divNew = $("<div></div>").attr("class", "col-sm-3 ").append(select);
	     var flipRowDiv = $("<div></div").attr("class", "row form-group").append(divBreached).append(divNew);
		 if('auth' === strAction && strAuthLevelGlb == 'I')
		 {
			 if(flipproductCurrencyKey ===  cutoffProduct)
			 {
				 $("#productListselectDiv").append(flipRowDiv); 
			 }
		 }
		 else
		 {
			 $("#productListselectDiv").append(flipRowDiv);
		 }
		
		rows++;
	}
}
function getNewProductMap(){
		
		var newProductMap = {};
		var newProductSelectlist = $("select[id^='flipList']");
		for(var i=0; i<newProductSelectlist.size();i++){
			if($(newProductSelectlist[i]).attr("value") != undefined && $(newProductSelectlist[i]).attr("value") !="" ){
				newProductMap[$(newProductSelectlist[i]).attr("oldproduct")] = $(newProductSelectlist[i]).attr("value");
			}else{
				newProductMap = "";
				break;
			}
		}
		
		return newProductMap;
}
function populateIbanDetails() {
	if (paymentResponseInstrumentData && paymentResponseInstrumentData.d
			&& paymentResponseInstrumentData.d.paymentEntry
			&& paymentResponseInstrumentData.d.paymentEntry.paymentMetaData) {
		var instrumentId = paymentResponseInstrumentData.d.paymentEntry.paymentMetaData.instrumentId?paymentResponseInstrumentData.d.paymentEntry.paymentMetaData.instrumentId:'';
		var ibanValidationFlag = paymentResponseInstrumentData.d.paymentEntry.paymentMetaData.ibanValidationFlag?paymentResponseInstrumentData.d.paymentEntry.paymentMetaData.ibanValidationFlag:'';
		var myProduct = paymentResponseInstrumentData.d.paymentEntry.paymentMetaData._myproduct;
	}
	
	if (paymentResponseInstrumentData && paymentResponseInstrumentData.d
			&& paymentResponseInstrumentData.d.paymentEntry
			&& paymentResponseInstrumentData.d.paymentEntry.paymentHeaderInfo.clientId) {
	var strClientId = paymentResponseInstrumentData.d.paymentEntry.paymentHeaderInfo.clientId;
	}
	var accNmbr = $("#drawerAccountNoA").val().toUpperCase();
	$("#drawerAccountNoA").val(accNmbr);
	
	if((instrumentId== '93'|| instrumentId=='94') && ibanValidationFlag == 'Y' && !isEmpty($('#drawerAccountNoA').val())){
		 $('#errorDiv').empty();
		 $('#messageArea').empty();	
		 $('#messageArea, #messageContentDiv').addClass('hidden');
		 $.ajax({
			 url : './services/receiver/ibandetails/'+$("#drawerAccountNoA").val(accNmbr)+'.json',
			data : {
				"sellerId": paymentResponseInstrumentData.d.paymentEntry.paymentFIInfo.fi
			},
			method : 'GET',
			success : function(responseData) {
				var isError =  false;
				var errorMsg = "";
				if(responseData.systemAllowValidate)
				{
					$('#showBankBranchPopupDiv').hide();
					$('#beneficiaryBranchDescriptionA').attr('disabled', true);
					$('#beneficiaryBankIDCodeAutoCompleter').attr('disabled', true);
					if(responseData.valid){
						var bicNumber = responseData.bic;
						var bank = responseData.bank;
						var branch = responseData.branch;
						$("#beneficiaryBankIDTypeA").val("BIC");
						$("#beneficiaryBankIDTypeA").niceSelect("update");
						showHideIban($('#beneficiaryBankIDTypeA'));
						$("#beneficiaryBankIDCodeAutoCompleter").val(bicNumber);
						$("#beneficiaryBankIDCodeA").val(bicNumber);
						populateIbanResponse(bicNumber,bank,branch);
												
					}else{
						isError = true;

						$("#beneficiaryBankIDTypeA").val("");
						$("#beneficiaryBankIDTypeA").niceSelect("update");
						showHideIban($('#beneficiaryBankIDTypeA'));
						$('#beneficiaryBranchDescriptionA').val("");
						$('#beneficiaryBankIDCodeAutoCompleter').val("");
						$("#beneficiaryBankIDCodeA").val("");
						$('#showBankBranchPopupDiv').show();
						if(responseData.errors){
							$( responseData.errors ).each(function( index ) {
							  errorMsg = errorMsg + "<p>"+responseData.errors[index]+"</p>";
							});
						}											
					}
					if(isError && errorMsg != ""){
						$('#errorDiv').empty();
						$('#messageArea').empty();
						$('#messageArea').append(errorMsg);
						$('#messageArea, #messageContentDiv')
							.removeClass('hidden');
					}
				}else
				{
					$('#showBankBranchPopupDiv').show();
					$("#beneficiaryBankIDTypeA").val("");
					$("#beneficiaryBankIDTypeA").niceSelect("update");
					showHideIban($('#beneficiaryBankIDTypeA'));
					$('#beneficiaryBranchDescriptionA').attr('disabled', false);
					$('#beneficiaryBankIDCodeAutoCompleter').attr('disabled', false);
					$('#beneficiaryBranchDescriptionA').val("");
					$('#beneficiaryBankIDCodeAutoCompleter').val("");
					$("#beneficiaryBankIDCodeA").val("");		
				}				
			}
		});
	}
	else if(instrumentId== '04' && beneValidationOnSave == 'N' && !isEmpty($('#drawerAccountNoA').val())){
		 $('#errorDiv').empty();
		 $('#messageArea').empty();	
		 $('#messageArea, #messageContentDiv').addClass('hidden');
		 $.ajax({
			 url : 'services/receiver/receiverdetails/'+accNmbr+'.json',
			data : {
				"sellerId": paymentResponseInstrumentData.d.paymentEntry.paymentFIInfo.fi,
				"clientId" :strClientId,
				"$payType" : instrumentId,
				"$payPackage": myProduct 
			},
			method : 'GET',
			success : function(responseData) {
				var isError =  false;
				var errorMsg = "";
				if(!isEmpty(responseData))
				{				
					if(responseData.ISVALIDFLAG)
					{	
						if(!isEmpty(responseData.ACCTNAME))
						{	
							$('#drawerDescriptionA').val(responseData.ACCTNAME);
							$('#drawerDescriptionA').attr("disabled", true);
							$('#drawerDescriptionA').removeClass("requiredField");
						}	
						$("#beneficiaryBankIDTypeA").val("SYSTEM");
						$("#beneficiaryBankIDTypeA").niceSelect("update");
						if(!isEmpty(responseData.ACCTCCY))
						{	
							$("#drawerCurrencyA").val(responseData.ACCTCCY);
							$('#drawerCurrencyA').attr("disabled", true);
						}
						if(!isEmpty(responseData.ACCTBRANCH))
						{	
							$('#showBankBranchPopupDiv').hide();
							$('#beneficiaryBranchDescriptionA').attr('disabled', true);
							$('#beneficiaryBankIDCodeAutoCompleter').attr('disabled', true);
							var branch = responseData.ACCTBRANCH;
							validateEQResponse(branch);	
						}	
					}
					else
					{
						isError = true;
						$("#beneficiaryBankIDTypeA").val("");
						$("#beneficiaryBankIDTypeA").niceSelect("update");						
						$('#beneficiaryBranchDescriptionA').val("");
						$('#beneficiaryBankIDCodeAutoCompleter').val("");
						$("#beneficiaryBankIDCodeA").val("");
						$('#showBankBranchPopupDiv').show();
						if(responseData.errors){
							$( responseData.errors ).each(function( index ) {
							  errorMsg = errorMsg + "<p>"+responseData.errors[index]+"</p>";
							});
						}											
					}
					if(isError && errorMsg != "")
					{
						$('#errorDiv').empty();
						$('#messageArea').empty();
						$('#messageArea').append(errorMsg);
						$('#messageArea, #messageContentDiv')
							.removeClass('hidden');
					}
				}else
				{
					$('#showBankBranchPopupDiv').show();
					$("#beneficiaryBankIDTypeA").val("");
					$("#beneficiaryBankIDTypeA").niceSelect("update");					
					$('#beneficiaryBranchDescriptionA').attr('disabled', false);
					$('#beneficiaryBankIDCodeAutoCompleter').attr('disabled', false);
					$('#beneficiaryBranchDescriptionA').val("");
					$('#beneficiaryBankIDCodeAutoCompleter').val("");
					$("#beneficiaryBankIDCodeA").val("");		
				}				
			}
		});
	}
	else
	{	
		$('#showBankBranchPopupDiv').show();
		$('#beneficiaryBranchDescriptionA').attr('disabled', false);
		$('#beneficiaryBankIDCodeAutoCompleter').attr('disabled', false);
		$('#beneficiaryBranchDescriptionA').val("");
		$('#beneficiaryBankIDCodeAutoCompleter').val("");
		$('#errorDiv').empty();
		$('#messageArea').empty();	
		$('#messageArea, #messageContentDiv').addClass('hidden');
	}
}

function populateIbanResponse(bicNumber,bank,branch) {
	$.ajax({
		url : 'services/userseek/beneEntryDrawerbank.json',
		data : {
			$top : 20,
			$filtercode1 : paymentResponseInstrumentData.d.paymentEntry.paymentFIInfo.fi,
			$autofilter : bicNumber,
			$filtercode2 : $('#beneficiaryBankIDTypeA').val()
					? $('#beneficiaryBankIDTypeA').val() :'BIC',
			$filtercode3 : ''
		},
		method : 'POST',
		success : function(responseData) {
			var rec = responseData.d.preferences;
			var allowAdhocBank = paymentResponseInstrumentData.d.paymentEntry.paymentHeaderInfo.allowAdhocBank;
			if (rec.length > 0) {
				$.map(rec, function(item) {
					var data = item;
					if (data) {
						$('#beneficiaryBranchDescriptionA').attr("disabled", "true");
						$('#showBankBranchPopupDiv').attr('disabled', true);
						isReceiverBankIDSelected = true;						
						if (!isEmpty(data.BANKCODE)) {
							$('#drawerBankCodeA').val(data.BANKCODE);							
						}
						if(!isEmpty(data.ROUTINGNUMBER)){
							$('#beneficiaryBankIDCodeA').val(data.ROUTINGNUMBER);
							$('#beneficiaryBankIDCodeAutoCompleter').val(data.ROUTINGNUMBER);
						}	
						if (!isEmpty(data.BRANCHCODE))
							$('#drawerBranchCodeA').val(data.BRANCHCODE);
						if (!isEmpty(data.BRANCHDESCRIPTION))
							$('#beneficiaryBranchDescriptionA').val(data.BRANCHDESCRIPTION);
					}
				});					
			}
			else
			{
				if(allowAdhocBank === 'N' ){
					$('#beneficiaryBranchDescriptionA').val("");
					$('#drawerBranchCodeA').val("");
					$("#beneficiaryBankIDCodeAutoCompleter").val("");
					$("#beneficiaryBankIDCodeA").val("");
					$('#errorDiv').empty();
					$('#messageArea').empty();
					ibanErrorFlag = true;
					$('#messageArea').append("BIC ("+bicNumber+") not present in the system for bank ("+bank+") and branch ("+branch+")");
					$('#messageArea, #messageContentDiv').removeClass('hidden');
				}else{
					$('#drawerBankCodeA').attr("disabled", "true");
					isReceiverBankIDSelected = true;
					$('#drawerBankCodeA').val(bicNumber);	
					$('#beneficiaryBankIDCodeA').val(bank);
					$('#beneficiaryBankIDCodeAutoCompleter').val(bicNumber);
					$('#beneficiaryBranchDescriptionA').val(branch);
					$('#drawerBranchCodeA').val('');
					$('#drawerBankCodeA').val('');
				}
			}
		}
	});
}

function populateAnyIdDetails(type) {
	
	var instrumentId = paymentResponseInstrumentData.d.paymentEntry.paymentMetaData.instrumentId;
	var anyIdPaymentFlag = paymentResponseInstrumentData.d.paymentEntry.paymentMetaData.anyIdPaymentFlag;
	var sellerCode = paymentResponseInstrumentData.d.paymentEntry.paymentFIInfo.fi ? paymentResponseInstrumentData.d.paymentEntry.paymentFIInfo.fi : "";
	if(anyIdPaymentFlag == 'Y' && 
		!isEmpty($('#anyIdType'+type).val()) && 
		!isEmpty($('#anyIdValue'+type).val()) && 
		!(type == 'R' && (strEntryType == 'TEMPLATE' || strEntryType == 'SI')) )
	{
		 $('#errorDiv').empty();
		 $('#messageArea').empty();	
		 $('#messageArea, #messageContentDiv').addClass('hidden');
		 $("#frmMain input[type=button]").attr("disabled","disabled");
		 $.ajax({
			 url : './services/receiver/anyIdDetails/'+$("#anyIdType"+type).val()+'/'+$("#anyIdValue"+type).val()+'.json',
			data : {
				"sellerId": sellerCode
			},
			method : 'GET',
			success : function(responseData) {
				$("#frmMain input[type=button]").removeAttr("disabled");
				var isError = false;
				var errorMsg = "";
				if (responseData.systemAllowValidate && responseData.valid)
				{
					if(type == "A")
					{
						processAnyIdResponseA(responseData,type);
					}
					else if(type == "R")
					{
						processAnyIdResponseR(responseData,type);
					}
				}
				else if (responseData.validationsCheck)
				{
					isError = true;
					$.each(responseData.validationsCheck, function(key, value) {
						errorMsg = errorMsg + "<p>" + value + "</p>";
					});
					$('#drawerDescriptionA').val('');
					$('#beneficiaryBranchDescriptionA').val('');
					$('#drawerDescriptionR').val('');
					$('#drawerCodeR').val('');
					$('.beneficiaryBranchDescriptionR_InstView').html('');	
					$('#drawerDescriptionA').focus();
				}
				else if (responseData.errors)
				{
					isError = true;
					$(responseData.errors).each(function(index) {
						errorMsg = errorMsg + "<p>" + responseData.errors[index] + "</p>";
					});
					$('#drawerDescriptionA').val('');
					$('#beneficiaryBranchDescriptionA').val('');
					$('#drawerDescriptionR').val('');
					$('#drawerCodeR').val('');
					$('.beneficiaryBranchDescriptionR_InstView').html('');	
					$('#drawerDescriptionA').focus();
				}
				if (isError && errorMsg != "")
				{
					$('#errorDiv').empty();
					$('#messageArea').empty();
					$('#messageArea').append(errorMsg);
					$('#messageArea, #messageContentDiv').removeClass('hidden');
				}								
			},
			complete: function(data) {$("#frmMain input[type=button]").removeAttr("disabled");},
			error: function(jqXHR, exception) {$("#frmMain input[type=button]").removeAttr("disabled");}
		});
	}
	else
	{
		if(isEmpty($('#anyIdValueA').val()))
		{
			$("#beneficiaryBranchDescriptionA").val('');
		}
	}
}

function processAnyIdResponseA(responseData)
{
	$('#beneficiaryBranchDescriptionA').val(responseData.branch);
	if(!isEmpty(responseData.branch))
	{
		$('#beneficiaryBranchDescriptionA').removeClass("requiredField");
	}
	$('#beneficiaryBranchDescriptionA').attr("disabled","disabled");
	if (responseData.receiverName && !isEmpty(responseData.receiverName))
	{
		if (!isEmpty($('#drawerDescriptionA').val()) && $('#drawerDescriptionA').val().toLowerCase() != responseData.receiverName.toLowerCase())
		{
			showAnyIdMismatchMsgPopupA(responseData.receiverName,responseData.branch);
		}
		else
		{
			$('#drawerDescriptionA').val(responseData.receiverName);			
		}
	}
}

function processAnyIdResponseR(responseData)
{
	if (responseData.receiverName && !isEmpty(responseData.receiverName))
	{
		if (!isEmpty($('#drawerDescriptionR').val()) && $('#drawerDescriptionR').val().toLowerCase() != responseData.receiverName.toLowerCase() )
		{
			showAnyIdMismatchMsgPopupR(responseData.receiverName,responseData.branch);
		}
		else
		{
			$('#drawerDescriptionR').val(responseData.receiverName);
		}
	}
}

function showAnyIdMismatchMsgPopupA(receiverName,branchDesc) {
    vReceiverName = receiverName;
    $('#mismatchMsgPopup_A').dialog({
                autoOpen : false,
                maxHeight: 550,
                minHeight:'auto',
                width : 400,
                modal : true,
                resizable: false,
                draggable: false,
				close: function() {
                	anyIdMismatchMsgPopupAClose();					
                }
            });
    $('#noMismatchMsgbutton_A').bind('click',function(){
		anyIdMismatchMsgCloseBtnA = 'N';	
		$('#mismatchMsgPopup_A').dialog("close");
    });
    $('#yesMismatchMsgbutton_A').bind('click',function(){
		anyIdMismatchMsgCloseBtnA = 'Y';
        $('#drawerDescriptionA').val(vReceiverName);
		$('#beneficiaryBranchDescriptionA').val(branchDesc);
		if(!isEmpty(branchDesc))
		{
			$('#beneficiaryBranchDescriptionA').removeClass("requiredField");
		}
        $('#mismatchMsgPopup_A').dialog("close");
    });
    $('#mismatchMsgPopup_A').dialog("open");
    $('#receivedReceiverName_A').text(receiverName);
}

function anyIdMismatchMsgPopupAClose()
{
	if(anyIdMismatchMsgCloseBtnA == 'N')
	{
		$('#drawerDescriptionA').val('');
		$('#beneficiaryBranchDescriptionA').val('');
		$('#drawerDescriptionA').focus();
	}
}

function showAnyIdMismatchMsgPopupR(receiverName,branchDesc) {
    vReceiverName = receiverName;
    $('#mismatchMsgPopup_R').dialog({
                autoOpen : false,
                maxHeight: 550,
                minHeight:'auto',
                width : 400,
                modal : true,
                resizable: false,
                draggable: false,
				close: function() {
					anyIdMismatchMsgCloseBtnR = 'N';
                	anyIdMismatchMsgPopupRClose();
                }
            });
    $('#noMismatchMsgbutton_R').bind('click',function(){
		anyIdMismatchMsgCloseBtnR = 'N';
		$('#mismatchMsgPopup_R').dialog("close");
    });
    $('#yesMismatchMsgbutton_R').bind('click',function(){
		anyIdMismatchMsgCloseBtnR = 'Y';
		toggleReceiver('A',true);	
		$('#anyIdValueA').val($("#anyIdValueR").val());	
		$('#beneficiaryBranchDescriptionA').val(branchDesc);
		if(!isEmpty(branchDesc))
		{
			$('#beneficiaryBranchDescriptionA').removeClass("requiredField");
		}
        $('#drawerDescriptionA').val(vReceiverName);
		$('#anyIdTypeA').val($("#anyIdTypeR").val());
		$('#anyIdTypeA').niceSelect("update");
        $('#mismatchMsgPopup_R').dialog("close");
    });
    $('#mismatchMsgPopup_R').dialog("open");
    $('#receivedReceiverName_R').text(receiverName);
}

function anyIdMismatchMsgPopupRClose()
{
	if(anyIdMismatchMsgCloseBtnR == 'N')
	{
		$('#drawerDescriptionR').val('');
		$('#drawerCodeR').val('');
		$('.beneficiaryBranchDescriptionR_InstView').html('');	
		$('#drawerDescriptionR').focus();
	}
}

function anyIdToggle(anyIdPaymentFlag,type)
{
	if(!type)
	{
		type = "A";
	}
	if(type == "A")
	{
		if(anyIdPaymentFlag == 'Y')
		{
			$("#anyIdPayDiv").removeClass("hidden");
			$("#drawerAccountNoADiv").addClass("hidden");
			$("#drawerAccountIbanDiv").addClass("hidden");
			$("#bankBranchDiv").addClass("hidden");
			$("#beneficiaryBranchDescriptionA").removeAttr("placeholder");
			$('#beneficiaryBranchDescriptionA').attr("disabled","disabled");
		}
		else
		{
			$("#bankBranchDiv").removeClass("hidden");
			$("#drawerAccountNoADiv").removeClass("hidden");
			$("#drawerAccountIbanDiv").removeClass("hidden");
			$("#anyIdPayDiv").addClass("hidden");
			$("#beneficiaryBranchDescriptionA").attr("placeholder","Enter Keyword or %");
			$('#beneficiaryBranchDescriptionA').removeAttr("disabled");
		}
	}
	else if(type == "R")
	{
		if(anyIdPaymentFlag == 'Y')
		{
			$("#anyIdPayRDiv").removeClass("hidden");
			$("#drawerAccountNoRDiv").addClass("hidden");
			$("#drawerAccountIbanDiv").addClass("hidden");
			$("#drawerBankBranchDetailsRDiv").addClass("hidden");
		}
		else
		{
			$("#drawerBankBranchDetailsRDiv").removeClass("hidden");
			$("#drawerAccountNoRDiv").removeClass("hidden");
			$("#drawerAccountIbanDiv").removeClass("hidden");
			$("#anyIdPayRDiv").addClass("hidden");
		}
	}
	else if(type == "V")
	{
		if(anyIdPaymentFlag == 'Y')
		{
			$(".anyIdPayDiv").removeClass("hidden");
			$(".drawerBankBranchAndAccountDetailsViewDiv").addClass("hidden");
		}
		else
		{
		    var instrumentId = paymentResponseInstrumentData.d.paymentEntry.paymentMetaData.instrumentId;
            if (!('01' === instrumentId || '02' === instrumentId || '07' === instrumentId))
            {
			 $(".drawerBankBranchAndAccountDetailsViewDiv").removeClass("hidden");
			}
			$(".anyIdPayDiv").addClass("hidden");
		}
	}
}

function resetAnyIdFields(ele)
{
	$("#anyIdValueA").val("");
	$("#beneficiaryBranchDescriptionA").val("");	
}

function checkAnyIdProductChange(currentAnyIDFlag)
{
	if(canAnyIdProductCheck)
	{
		if(strOldAnyIdFalg != undefined && strOldAnyIdFalg != null)
		{
			if(strOldAnyIdFalg != currentAnyIDFlag)
			{
				strOldAnyIdFalg = currentAnyIDFlag;
				toggleReceiver('A',true);
				
			}
		}
		else
		{
			strOldAnyIdFalg = currentAnyIDFlag;
		}
	}	
}

function onFileSelect()
{
	var fullpath = document.getElementById('transactionImportFile').value;
	var sepIndex = fullpath.lastIndexOf('/');
	if(sepIndex == -1)
	{
		sepIndex = fullpath.lastIndexOf('\\');
	}
	var filename = fullpath.substr(sepIndex + 1);
	$("#transactionImportFileName").html(filename);
	$("#transactionImportFileName").attr("title",filename);
}

function showEffectiveDateOnPaymentScreen(strPaymentType){
	var strPostFix = (strPaymentType === 'QUICKPAY' || strPaymentType === 'QUICKPAYSTI') ?  strPostFix = '' : strPostFix = 'Hdr',strRefDay='';
	/*if($('#refDay'+strPostFix).hasClass('jq-multiselect')){
		strRefDay = $('#refDay'+strPostFix).getMultiSelectValue().toString();
	}else{
		strRefDay = $('#refDay'+strPostFix).val();
	}*/
	var effectiveDate = $('#txnDate'+strPostFix).val();
	//	siTerminationDate = isEmpty(siTerminationDate) ? '12/31/2099' : siTerminationDate;*/
	if(!isEmpty(effectiveDate)){	
	$.ajax({
		url : "services/getSiStartDate",
		type : 'POST',
		dataType : "json",
		data : {
			$effectiveDate :effectiveDate,
			$bankProduct : $('#bankProduct'+strPostFix).val()
			
		},
		success : function(data) {
			if (data && data.d && data.d.siStartDate) {
				var value = data.d.siStartDate;
				 $('#siEffectiveDate'+strPostFix).val(value);
				 $('#siEffectiveDate'+strPostFix).datepicker( "option", "minDate", value );
				// return value;
			}
		}
	});
	}
}

function handleComboBoxChangeEvent(field, cfg) {
	var displayType = cfg.displayType;
	var strEventName = 'focusout';
	if (isEmpty(displayType))
		displayType = 0;
	strEventName = getEnrichFieldEventName(displayType);
	if (!isEmpty(strEventName))
	{	field.on(strEventName, function() {
				//if(cfg.parentEnrichCode)
					fetchAmoutTypeForTaxType($(this),cfg);
				});
	}

}

function fetchAmoutTypeForTaxType(obj,cfg)
{
	var url = 'services/amoutTypeForTaxType';
	var jsonObj = generatePaymentInstrumentJson();
	url += '/' + "NTDAKOT319";
	url += '/' + "NTDAKOT317" + '.json';
	jsonObj.d.__metadata._pirMode = strEntryType;
	$.ajax({
		type : "POST",
		url : url,
		async : false,
		contentType : "application/json",
		data : JSON.stringify(jsonObj),
		success : function(data) 
		{
			var arrOptions = data;
			var target = $('#NTDAKOT319');
			if (arrOptions && arrOptions.length > 0) 
			{
				target.empty();
				$.each(arrOptions, function(index, opt) {
						target.append($("<option />").val(opt.key)
								.text(opt.value));
								
				});
				target.niceSelect();
				target.niceSelect("update");
			}
		}
	}); 
}

function syncDDPODateasEffectiveDate()
{
	if ('02' === strPrdID || '07' === strPrdID)
	{
	   $('#instrumentDate').val($('#txnDate').val());
	}
}

function populateBeneficiaryBankIDType()
{
    if (paymentResponseInstrumentData && paymentResponseInstrumentData.d && paymentResponseInstrumentData.d.paymentEntry
        && paymentResponseInstrumentData.d.paymentEntry.beneficiary &&  paymentResponseInstrumentData.d.paymentEntry.beneficiary.adhocBene) {
        var result = paymentResponseInstrumentData.d.paymentEntry.beneficiary.adhocBene.filter(function (obj) {
                return obj.fieldName=== "beneficiaryBankIDType";
         })[0];
        if(result.availableValues.length===1){
            $('#beneficiaryBankIDTypeA').val(result.availableValues[0].code)  
        }
    }
}
function validateEQResponse(branch) {	
	$.ajax({
		url : 'services/userseek/beneEntryDrawerbank.json',
		data : {
			$top : 20,
			$filtercode1 : paymentResponseInstrumentData.d.paymentEntry.paymentFIInfo.fi,
			$autofilter : branch,
			$filtercode2 : $('#beneficiaryBankIDTypeA').val()
			? $('#beneficiaryBankIDTypeA').val() :'BIC',
			$filtercode3 : ''
		},
		method : 'POST',
		success : function(responseData) {
			var rec = responseData.d.preferences;
			if (rec.length > 0) {
				$.map(rec, function(item) {
					var data = item;
					if (data)
					{
						$('#beneficiaryBranchDescriptionA').attr("disabled", "true");
						$('#showBankBranchPopupDiv').attr('disabled', true);						
						isReceiverBankIDSelected = true;
						
						if (!isEmpty(data.BANKCODE)) {
							$('#drawerBankCodeA').val(data.BANKCODE);							
						}
						if(!isEmpty(data.ROUTINGNUMBER)){
							$('#beneficiaryBankIDCodeA').val(data.ROUTINGNUMBER);
							$('#beneficiaryBankIDCodeAutoCompleter').val(data.ROUTINGNUMBER);
						}	
						if (!isEmpty(data.BRANCHCODE))
							$('#drawerBranchCodeA').val(data.BRANCHCODE);
						if (!isEmpty(data.BRANCHDESCRIPTION))
							$('#beneficiaryBranchDescriptionA').val(data.BRANCHDESCRIPTION);										
					}
					
				});				
			}
			else
			{
				$('#beneficiaryBranchDescriptionA').val("");
				$('#drawerBranchCodeA').val("");
				$("#beneficiaryBankIDCodeAutoCompleter").val("");
				$("#beneficiaryBankIDCodeA").val("");
				$('#errorDiv').empty();
				$('#messageArea').empty();								
				$('#messageArea').append("Adhoc bank ("+branch+") not allowed .");
				$('#messageArea, #messageContentDiv')
					.removeClass('hidden');
			}
		}
	});
}
function enableDisableBeneFields()
{
	if(!isEmpty($('#drawerDescriptionA').val()))
		$('#drawerDescriptionA').attr("disabled", true);
	else
		$('#drawerDesc').attr("disabled", false);
	
	if(!isEmpty($('#drawerCurrencyA').val()))
		$('#drawerCurrencyA').attr("disabled", true);
	else
		$('#drawerCurrencyA').attr("disabled", false);	 
	
	if(!isEmpty($('#beneficiaryBranchDescriptionA').val()))
		$('#beneficiaryBranchDescriptionA').attr('disabled', true);
	else
		$('#beneficiaryBranchDescriptionA').attr('disabled', false);
	
	if(!isEmpty($('#beneficiaryBankIDCodeAutoCompleter').val()))
		$('#beneficiaryBankIDCodeAutoCompleter').attr('disabled', true);
	else
		$('#beneficiaryBankIDCodeAutoCompleter').attr('disabled', false);		
	
}

function adhocCustomFieldHide(arrFields,suffix)
{	
	if (arrFields && arrFields.length > 0) {
		$.each(arrFields, function(index, cfg) {
			fieldId = cfg.fieldName;
			var displayMode=cfg.displayMode;
			if(displayMode == '1')
			{
				handleDisplayMode(cfg.displayMode, fieldId + suffix);
			}
		});
	}
}

function populateDrawerCode()
{
	if ($('#receiverCodeA').val() != '')
 	{  
		$('#drawerCodeA').val($('#receiverCodeA').val());
 	}
	
}
function doHandleTextValidator()
{
	$("#drawerDescriptionA").unbind('.ValidateTextKeydown .ValidateTextBlur .ValidateTextInput .ValidateTextPropertychange');
	$("#receiverCodeA").unbind('.ValidateTextKeydown .ValidateTextBlur .ValidateTextInput .ValidateTextPropertychange');
	setPatternValidator(true);
	
}
function trimBeneAcctNmbr(){
	var beneAcctNmbr = $.trim($('#drawerAccountNoA').val());
	$('#drawerAccountNoA').val(beneAcctNmbr);
}
function enableDisableLEICode(code){
	
	if(code == 'I' || code == '')
	{
		$('#receiverLeiCodeA').val('');
		$("#receiverLeiCodeADiv").addClass("hidden");
	}
	else if(code == 'C')
	{
		$("#receiverLeiCodeADiv").removeClass("hidden");
	   $('#corporate').attr('checked','checked');
	   $('#receiverLeiCode').val($('#receiverLeiCode').val());
	   $('#receiverLeiCode').removeAttr('disabled');
	   $('#receiverLeiCodeA').ForceNoSpecialSymbolWithoutSpace();
	}
}

jQuery.fn.BenefBankIdAutoComplete = function() {
    return this.each(function() {
        $(this).autocomplete({
            source : function(request, response) {
                $.ajax({
                            url : 'services/userseek/benefBank.json',
                            dataType : "json",
                            data : {
                                top : -1,
                                $autofilter : request.term
                            },
                            success : function(data) {
                                if (data && data.d && data.d.preferences) {
                                    var rec = data.d.preferences;
                                    response($.map(rec, function(item) {
                                                return {
                                                    label : item.CODE+' | '+item.DESCRIPTION,
                                                    details : item
                                        }
                                    }));
                                }
                                else{
                                    if($(this).hasClass("ui-corner-top")){
                                        $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                                        $(".ui-menu").hide();
                                    }
                                }
                                $("#phyDrawerBankCodeA").val('');
                                $(this).focus();
                            }
                        });
            },
            focus: function( event, ui ) {
                $(".ui-autocomplete > li").attr("title", ui.item.label);
            },
            minLength : 1,
            select : function(event, ui) 
            {
                if (ui.item)
                {
                    $("#phyDrawerBankCodeA").val(ui.item.details.CODE);
                    $(this).attr('oldValue',ui.item.label);
                }
                $("#phyDrawerBranchCodeA").val('');
                $("#phyDrawerBranchCodeADesc").val('');
            },
            change : function() {
                if ($(this).attr('oldValue') && ($(this).attr('oldValue') !== $(this).val())) {
                    $("#phyDrawerBankCodeA").val('');
                    $(this).val('');
                    $("#phyDrawerBranchCodeA").val('');
                    $("#phyDrawerBranchCodeADesc").val('');
                }
            },
            open : function() {
                $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
            },
            close : function() {
                $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                $(this).focus();
            }
        });
        $(this).on('blur',function(){
            if(!$('.ui-autocomplete.ui-widget:visible').length) {
                if ($('#phyDrawerBankCodeA').val() == '')
                {  
                    $(this).val('');
                }               
                if ($(this).val() == '')
                {
                    $('#phyDrawerBankCodeA').val('');
                }
            }
            else
            {
                $(this).focus();
            }
        });
    });
};

jQuery.fn.BenefBranchIdAutoComplete = function() {
    return this.each(function() {
        $(this).autocomplete({
            source : function(request, response) {
                $.ajax({
                            url : 'services/userseek/benefBranch.json',
                            dataType : "json",
                            data : {
                                top : -1,
                                $autofilter : request.term,
                                $filtercode1 : $('#phyDrawerBankCodeA').val()
                            },
                            success : function(data) {
                                if (data && data.d && data.d.preferences) {
                                    var rec = data.d.preferences;
                                    response($.map(rec, function(item) {
                                                return {
                                                    label : item.CODE+' | '+item.DESCRIPTION,
                                                    details : item
                                        }
                                    }));
                                }
                                else{
                                    if($(this).hasClass("ui-corner-top")){
                                        $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                                        $(".ui-menu").hide();
                                    }
                                }
                                $("#phyDrawerBranchCodeA").val('');
                                $(this).focus();
                            }
                        });
            },
            focus: function( event, ui ) {
                $(".ui-autocomplete > li").attr("title", ui.item.label);
            },
            minLength : 1,
            select : function(event, ui) 
            {
                if (ui.item)
                {
                    $("#phyDrawerBranchCodeA").val(ui.item.details.CODE);
                    $(this).attr('oldValue',ui.item.label);
                }
            },
            change : function() {
                if ($(this).attr('oldValue') && ($(this).attr('oldValue') !== $(this).val())) {
                    $("#phyDrawerBranchCodeA").val('');
                    $(this).val('');
                }
            },
            open : function() {
                $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
            },
            close : function() {
                $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                $(this).focus();
            }
        });
        $(this).on('blur',function(){
            if(!$('.ui-autocomplete.ui-widget:visible').length) {
                if ($('#phyDrawerBranchCodeA').val() == '')
                {  
                    $(this).val('');
                }               
                if ($(this).val() == '')
                {
                    $('#phyDrawerBranchCodeA').val('');
                }
            }
            else
            {
                $(this).focus();
            }
        });
    });
};

