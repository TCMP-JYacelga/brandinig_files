/* Payment Bank Product Multi Enrichment */

var objPaymentBankProductMultiSetEnrichments = null;
var objPaymentBankProductMultiSetEnrichmentsParamArray = null;
var objBankProductMultisetGrid = null;
var strPaymentInstrumentIde = null;
/* Payment My Product Multi Enrichment */
var objPaymentMyProductMultiSetEnrichments = null;
var objPaymentMyProductMultiSetEnrichmentsParamArray = null;
var objMyProductMultisetGrid = null;
/* Payment Client Product Multi set Enrichment */
var objPaymentClientProductMultiSetEnrichments = null;
var objPaymentClientProductMultiSetEnrichmentsParamArray = null;
var objClientProductMultisetGrid = null;
var instruProduct = null,recordKey=null,layout=null,intCurrentInst=null;

function readPaymentBatchInstrument(identifier, strPaintAction) {
	// TODO : To be finalize paymentinstrument/ paymententry
	// var url = "services/paymententry(" + identifier + ").json";
	$('.canClear').text('');
	toggleContainerDisplayMode('instCtDiv', true);
	toggleContainerVisibility('instCtDiv');
	paymentaction = $('#payaction').val();
	// Temporary commented for testing
	var url = 'services/paymententry/id.json';
	// var url = "static/scripts/payments/paymentQueue/data/paymentEntry.json";
	$.ajax({
	    type : "POST",
	    url : url,
	    async : false,
	    data : {
			$id: identifier,
		    $paymentOrQueue : 'Q'
	    },
	    complete : function(XMLHttpRequest, textStatus) {
		    if ("error" == textStatus) {
			    blockInstrumentUI(false);
			    paintPaymentUI(null);
			    // TODO : Error handling to be done.
			    // alert("Unable to complete your request!");
		    }
	    },
	    success : function(data) {
		    if (data && data.d && data.d.__metadata && data.d.__metadata._myproduct) {
			    instruProduct = data.d.__metadata._myproduct;
		    }
		    if (data && data.d && data.d.paymentEntry && data.d.paymentEntry.paymentHeaderInfo
		            && data.d.paymentEntry.paymentHeaderInfo.phdnumber) {
			    recordKey = data.d.paymentEntry.paymentHeaderInfo.phdnumber;
		    }
		    if (data && data.d && data.d.paymentEntry && data.d.paymentEntry.paymentHeaderInfo
		            && data.d.paymentEntry.paymentHeaderInfo.hdrPaymentLayout) {
			    layout = data.d.paymentEntry.paymentHeaderInfo.hdrPaymentLayout;
		    }
		    if (data.d && data.d.__metadata && data.d.__metadata._detailId) {
			    strPaymentInstrumentIde = data.d.__metadata._detailId;
		    }
		    if (layout != 'ACCTRFLAYOUT') {
			    $('#drawerAccountNameBDiv').hide();
		    }
		    paintPaymentUI(data);
		    if (data && data.d && data.d.paymentEntry && data.d.paymentEntry.paymentMetaData
		            && data.d.paymentEntry.paymentMetaData.docVerificationRules) {
			    $("#verificationRulesDiv").removeClass("hidden");
			    paintPaymentTransactionVerificationRulesGrid(data.d.paymentEntry.paymentMetaData.docVerificationRules);
		    }
		    else {
			    $("#verificationRulesDiv").addClass("hidden");
		    }
		    if (data && data.d && data.d.paymentEntry && data.d.paymentEntry.paymentMetaData
		            && data.d.paymentEntry.paymentMetaData._docFileName) {
			    $("#uploadedDocumentsDiv").removeClass("hidden");
			    paintPaymentTransactionUploadedDocumentsGrid(data.d.paymentEntry.paymentMetaData._docFileName);
		    }
		    else {
			    $("#uploadedDocumentsDiv").addClass("hidden");
		    }
		    paintPaymentTransactionAuditInfoGrid(identifier);
		    handleLimitPopup(identifier);
		    toggleContainerVisibility('instCtDiv');
	    }
	});
}

function getReportPaymentTxnDetail(){
	var screenType = 'ViewTransaction';
	var strUrl = '';
	strUrl = 'services/getBankProcessingQueueList/getProcessingQueueViewTransactionReport.pdf';
	form = document.createElement( 'FORM' );
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', csrfTokenName, tokenValue ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', '$Recordkey', recordKey ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', '$screenType', 'ViewTransaction' ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', '$PaymentCategory', instruProduct ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', '$LayoutType',  layout ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', '$InstNumber', intCurrentInst ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', '$strPaymentInstrumentIde', strPaymentInstrumentIde ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', '$strPaymentQueueType', strPaymentQueueType ) );
	form.action = strUrl;
	document.body.appendChild( form );
	form.submit();
	document.body.removeChild( form );	
}

function paintPaymentUI(data) {
	if (data && data.d && data.d.paymentEntry) {
		if (data.d.paymentEntry.standardField) {
			paintPaymentStandardFields(data.d.paymentEntry.standardField);
		}
		if (data.d.paymentEntry.paymentFIInfo) {
			paintPaymentFIInfo(data.d.paymentEntry.paymentFIInfo);
		}
		if (data.d.paymentEntry.additionalInfo && data.d.paymentEntry.additionalInfo.orderingParty) {
			paintPaymentOrderingPartyDetails(data.d.paymentEntry.additionalInfo.orderingParty);
		}
		if (data.d.paymentEntry.beneficiary) {
			paintPaymentReceiverDetails(data.d.paymentEntry.beneficiary);
		}
		if (data.d.paymentEntry.payCancelInfo) {
			paintCancelInfoDetails(data.d.paymentEntry.payCancelInfo);
		}
		if (data.d.paymentEntry.liquidationInfo) {
			paintLiquidationDetails(data.d.paymentEntry.liquidationInfo);
		}
		if (data.d.paymentEntry.enrichments) {
			paintPaymentEnrichments(data.d.paymentEntry.enrichments);
		}
		else {
			$('#addendaSectionDiv').addClass('hidden');
		}
		if (data.d.paymentEntry.paymentHeaderInfo) {
			paintPaymentHeaderInfo(data.d.paymentEntry.paymentHeaderInfo);
		}
		if (data.d.paymentEntry.paymentMetaData) {
			paintPaymentMetaInfo(data.d.paymentEntry.paymentMetaData);
		}
		if (data.d.paymentEntry.paymentCompanyInfo) {
			paintPaymentCompanyInfo(data.d.paymentEntry.paymentCompanyInfo);
		}
		if (data.d.paymentEntry.paymentMetaData.instrumentId) {
			hidePhysicalInfo(data.d.paymentEntry.paymentMetaData.instrumentId);
		}
	}
}

function hidePhysicalInfo(instrumentId) {
	var isPhysicalPay = instrumentId == '01' || instrumentId == '02' || instrumentId == '07';
	var isQueryScreen = strPaymentQueueType == 'Q' || strPaymentQueueType == 'I';
	var isQueueScreen = !isQueryScreen;
	$('#paymentCancellationDiv').addClass('hidden');
	if (isQueryScreen && isPhysicalPay) {
		$('#paymentCancellationDiv').removeClass('hidden');
	}
	$('#paymentLiquidationDiv').addClass('hidden');
	if (isQueryScreen) {
		$('#paymentLiquidationDiv').removeClass('hidden');
	}
	if (isQueueScreen) {
		$('#paymentCancellationDiv').addClass('hidden');
		$('#paymentLiquidationDiv').addClass('hidden');
		$('#expClrDateDiv').addClass('hidden');
		$('#phyPaymentDetails1Div').addClass('hidden');
		$('#instStatusDiv').addClass('hidden');
		$('#phyPaymentDetails2Div').addClass('hidden');
	}
}

function paintPaymentCompanyInfo(data) {
	$(".companyDetailsSpan").text(data.company + '\n' + data.companyAddress);
	$(".companyDetailsSpan").attr("title",$('.companyDetailsSpan').text());
}
function paintPaymentHeaderInfo(data) {
	if (data) {
		arrFields = data;
		for (var prop in arrFields) {
			if (arrFields[prop])
				$('.' + prop + 'Span').text(arrFields[prop]);
		    	$('.' + prop + 'Span').attr("title",$('.' + prop + 'Span').text());
		}
	}
}
function paintPaymentMetaInfo(data) {
	if (data) {
		arrFields = data;
		for (var prop in arrFields) {
			if (arrFields[prop])
				$('.' + prop + 'Span').text(arrFields[prop]);
			    $('.' + prop + 'Span').attr("title",$('.' + prop + 'Span').text());
		}
	}
}

function paintPaymentStandardFields(data) {
	var arrFields = [], strValue = null, strDisplayMode = null, fieldId = null;
	if (data) {
		arrFields = data;
		if (arrFields && arrFields.length > 0) {
			$.each(arrFields, function(index, cfg) {
						fieldId = cfg.fieldName;
						strDisplayMode = cfg.displayMode;
						handleDisplayMode(strDisplayMode, fieldId, 'Q');
						strValue = getValueToDispayed(cfg);
						if (strValue)
						{
							if (fieldId === 'payLocation') {
								if (!Ext.isEmpty(strValue))
								{
									var availableValues=cfg.availableValues;
									if (availableValues) {
				                        $.each(availableValues, function(index,item)
				                        {
				                            if(item.code == strValue)
				                            {
				                            	strValue = item.code+':'+item.description;
				                                return false;
				                            }
				                        });
				                    }
								}
							}
							$('.' + fieldId + 'Span').text(strValue);
						}
						$('.'+ fieldId + 'Span').attr("title",$('.'+fieldId + 'Span').text());
						if (fieldId === 'accountNo') {
							$('.accountNoSpan').text(cfg.value);
							$('.accountNameSpan').text(strValue);
							$('.accountNameSpan').attr("title",strValue);
						}
						if (fieldId === 'drawerAccountNo') {
							$('.drawerAccountNoSpan').text(cfg.value);
							$('.drawerAccountNameBSpan').text(strValue);
							$('.drawerAccountNameBSpan').attr("title",strValue);
						}
					});
		}
	}
}
function paintPaymentFIInfo(data) {
	var arrFields = data;
	if (data) {
		if (arrFields) {
			$.each(arrFields, function(index, cfg) {
						$('.' + index + 'Span').text(cfg);
						$('.' + index + 'Span').attr("title",$('.'+index + 'Span').text());
					});
		}
	}
}

function paintPaymentAdditionalInfo(data) {
	var arrFields = data, clsHide = 'ui-helper-hidden';
	/*
	 * if(arrFields.additionalReferenceInfo){ arrFields =
	 * arrFields.additionalReferenceInfo;
	 * $('#additionalInfoOuterDiv').removeClass('ui-helper-hidden'); if (data) {
	 * if (arrFields) { $.each(arrFields, function(index, cfg) { fieldId =
	 * cfg.fieldName; strValue = getValueToDispayed(cfg);
	 * $('#'+fieldId+'AISpan').text(strValue); }); } } }
	 */
	if (data.additionalReferenceInfo) {
		if (data.additionalReferenceInfo.length > 0) {
			paintPaymentAdditionalInformationField(
					data.additionalReferenceInfo, $('#additionalInfoDiv'));
		}
	}
}
function paintBankToBankInfo(data) {
	var arrFields = data, clsHide = 'ui-helper-hidden';
	/*
	 * if(arrFields.additionalReferenceInfo){
	 * $('#bankToBankInfo').removeClass('ui-helper-hidden'); if (data) { if
	 * (arrFields) { $.each(arrFields, function(index, cfg) { fieldId =
	 * cfg.fieldName; strValue = getValueToDispayed(cfg);
	 * $('#'+fieldId+'Span').text(strValue); }); } } }
	 */
	if (data.bankToBankInfo) {
		if (data.bankToBankInfo.length > 0) {
			paintPaymentAdditionalInformationField(data.bankToBankInfo,
					$('#AddBankInfoInnerDiv'));
			$('#bank2BankInfoOuterDiv').removeClass(clsHide);
		}
	}
}
function paintPaymentAdditionalInformationField(arrFields, targetDiv) {
	var field = null, label = null, clsHide = 'ui-helper-hidden', div = null;
	if (arrFields) {
		$.each(arrFields, function(index, cfg) {
					div = $('<div>').attr({
								'class' : 'extrapadding_bottom ux_div-padding',
								'id' : cfg.fieldName + 'Div'
							});
					label = $('<label>').attr({
								'class' : 'fieldLabel',
								'id' : cfg.fieldName + 'Lbl',
								'for' : cfg.fieldName
							});
					label.text(cfg.label);
					field = createAdditionalInfoField(cfg);
					if (field) {
						if (cfg.displayMode == '3')
							label.addClass('required');
						label.attr('for', field.id);
						label.appendTo(div);
						$('<br/>').appendTo(div);
						field.appendTo(div);
						div.appendTo(targetDiv);

						if ((index + 1) % 2 == 0) {
							div.addClass('col_2_2');
							$('<div>').attr('class', 'clear')
									.appendTo(targetDiv);
						} else
							div.addClass('col_1_2');
						if (arrFields.length === index + 1)
							$('<div>').attr('class', 'clear')
									.appendTo(targetDiv);
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
function paintPaymentReceiverDetails(data) {
	var arrFields = data, strDisplayMode = null, fieldId = null;
	if (arrFields && arrFields.adhocBene || arrFields.registeredBene) {
		if (arrFields.drawerRegistedFlag) {
			if (arrFields.drawerRegistedFlag === 'y'
					|| arrFields.drawerRegistedFlag === 'Y'
					|| arrFields.drawerRegistedFlag === 'R')
				arrFields = arrFields.registeredBene;
			else
				arrFields = arrFields.adhocBene;
		} else {
			arrFields = arrFields.registeredBene
					? arrFields.registeredBene
					: arrFields.adhocBene;
		}
		if (arrFields.length > 1) {
			$.each(arrFields, function(index, cfg) {
						fieldId = cfg.fieldName;
						strDisplayMode = cfg.displayMode;
						handleDisplayMode(strDisplayMode, fieldId + 'B', 'Q');
						strValue = getValueToDispayed(cfg);
						if (strValue) {
						    if (fieldId === 'phyDrawerBankCode' || fieldId === 'phyDrawerBranchCode') {
                                if (!Ext.isEmpty(strValue))
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
                                }
                              }
							$('.' + fieldId + 'BSpan').text(strValue);
						    $('.' + fieldId + 'BSpan').attr("title",strValue);
						}
					});
		}
	}
}
function paintCancelInfoDetails(data) {
	var arrFields = data;
	var instAmt;
	if (data)
	{
		if (arrFields) 
		{
			$.each(arrFields, function(index, cfg) 
			{
				if(index === 'instAmount'  && (typeof cfg != 'undefined' && cfg))
				{					
					instAmt = !isEmpty(arrFields["ccysymbol"])? arrFields["ccysymbol"].concat(setDigitAmtGroupFormat(cfg)): setDigitAmtGroupFormat(cfg);	
					$('.' + index + 'Span').text(instAmt);
					$('.' + index + 'Span').attr("title",$('.'+index + 'Span').text());					
				}
				else
				{
					$('.' + index + 'Span').text(cfg);
					$('.' + index + 'Span').attr("title",$('.'+index + 'Span').text());				
				}						
			});
		}	
	}	
}
function paintLiquidationDetails(data) {
	var arrFields = data;
	if (data) {
		if (arrFields) {
			$.each(arrFields, function(index, cfg) {
						$('.' + index + 'Span').text(cfg);
						$('.' + index + 'Span').attr("title",$('.'+index + 'Span').text());
					});
		}
	}
}
function paintPaymentOrderingPartyDetails(data) {
	var arrFields = data, strDisplayMode = null, fieldId = null;
	if (arrFields) {
		if (arrFields.orderingPartyRegisteredFlag) {
			if (arrFields.orderingPartyRegisteredFlag === 'y'
					|| arrFields.orderingPartyRegisteredFlag === 'Y'
					|| arrFields.orderingPartyRegisteredFlag === 'R')
				arrFields = arrFields.registeredOrderingParty;
			else
				// needs to verify
				arrFields = arrFields.adhocOrderingParty;
		} else {
			arrFields = (arrFields.registeredOrderingParty
					? arrFields.registeredOrderingParty
					: arrFields.adhocOrderingParty)
					|| [];
		}
		if (data) {
			if (arrFields) {
				$.each(arrFields, function(index, cfg) {
							fieldId = cfg.fieldName;
							strValue = getValueToDispayed(cfg);
							strDisplayMode = cfg.displayMode;
							handleDisplayMode(strDisplayMode, fieldId + 'O',
									'Q');
							if (strValue)
								$('.' + fieldId + 'OSpan').text(strValue);
						    $('.' + fieldId + 'OSpan').attr("title",$('.' + fieldId + 'OSpan').text());
						});
			}
		}
	}
}
function getValueToDispayed(cfg) {
	var dataType = cfg.dataType, defValue = cfg.value, fieldId = cfg.fieldName, blnReadOnly = cfg.readOnly;
	var strReturnValue = '', strTemp = '';
	if (dataType) {
		switch (dataType) {
			case 'multiselect' : break; // need to handle
			case 'select' :
				if (cfg.availableValues) {
					//$.each(cfg.availableValues, function(index, opt) {
								strTemp = getObjectFormJsonArray(defValue,
										cfg.availableValues);
								strTemp = strTemp && strTemp.description
										? strTemp.description
										: '';
								if (strTemp) {
									strReturnValue += strTemp;
									/*if (index != cfg.availableValues.length - 1)
										strReturnValue += ',';*/
								}
						//	});
				}
				break;
			case 'text' :
			case 'seek' :
			case 'date' :
			case 'amount' :
				if(fieldId == 'contractRefNo'||(fieldId == 'fxRate' && (typeof defValue != 'undefined' && defValue)))
				{
					if(cfg.formattedValue != null && cfg.formattedValue != '' && !isNaN(cfg.formattedValue))
					{
						var amount = $("<input>").attr('type','hidden').autoNumeric("init",
	                            {
			                        aSep: strGroupSeparator,
			                        dGroup: strAmountDigitGroup,
			                        aDec: strDecimalSeparator,
			                        mDec: strRatePrecision 
	                            }).autoNumeric('set', cfg.formattedValue).val();
						
	                    strReturnValue = amount;
					}
					else
					{
				strReturnValue = !isEmpty(cfg.formattedValue)
						? cfg.formattedValue
						: defValue;
					}
				}
				else if((fieldId == 'debitCcyAmount'|| fieldId == 'amount')  && (typeof defValue != 'undefined' && defValue))
				{
					
					strReturnValue = !isEmpty(cfg.ccysymbol)? cfg.ccysymbol.concat(setDigitAmtGroupFormat(defValue)): setDigitAmtGroupFormat(defValue);					
				}
				else
				{
					strReturnValue = !isEmpty(cfg.formattedValue)
					? cfg.formattedValue
					: defValue;					
				}
				break;
			case 'radio' :
			case 'checkBox' :
				strReturnValue = getObjectFormJsonArray(cfg.value,
						cfg.availableValues);
				strReturnValue = strReturnValue && strReturnValue.description
						? strReturnValue.description
						: '';
				break;
		}
	}
	return strReturnValue;
}

function getObjectFormJsonArray(strKey, arrValues) {
	var retValue = null;
	if (arrValues)
		$.each(arrValues, function(index, opt) {
					if (strKey == opt.code) {
						retValue = opt;
						return false;
					}
				});
	return retValue;
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
		paintPaymentEnrichmentAsSetName(mapEnrichSet,
				data.clientEnrichment.parameters, strTargetId);
		isVisible = true;
	}
	if (data.productEnrichmentStdFields
			&& data.productEnrichmentStdFields.parameters) {
		intConterForTransAddenda = paintPaymentEnrichmentsHelper(
				data.productEnrichmentStdFields.parameters,
				intConterForTransAddenda, strTransAddendaTargetId, 'Q');
		isVisibleTransAddenda = true;
		isVisible = true;
	}
	if (data.myproductEnrichmentStdFields
			&& data.myproductEnrichmentStdFields.parameters) {
		intConterForTransAddenda = paintPaymentEnrichmentsHelper(
				data.myproductEnrichmentStdFields.parameters,
				intConterForTransAddenda, strTransAddendaTargetId, 'Q');
		isVisibleTransAddenda = true;
		isVisible = true;
	}
	if (data.clientEnrichmentStdFields
			&& data.clientEnrichmentStdFields.parameters) {
		intConterForTransAddenda = paintPaymentEnrichmentsHelper(
				data.clientEnrichmentStdFields.parameters,
				intConterForTransAddenda, strTransAddendaTargetId, 'Q');
		isVisibleTransAddenda = true;
		isVisible = true;
	}
	if (data.udeEnrichmentStdFields && data.udeEnrichmentStdFields.parameters) {
		intConterForTransAddenda = paintPaymentEnrichmentsHelper(
				data.udeEnrichmentStdFields.parameters,
				intConterForTransAddenda, strTransAddendaTargetId, 'Q');
		isVisibleTransAddenda = true;
		isVisible = true;
	}
	if (data.myProductMultiSet && data.myProductMultiSetMetadata) {
		paintPaymentMyProductMultiSetEnrichments(data.myProductMultiSet,
				data.myProductMultiSetMetadata, intCounter,
				'myProductMultiSetEnrichDiv', 'Q', true);
		isVisible = true;
	}
	if (data.bankProductMultiSet && data.bankProductMultiSetMetadata) {
		paintPaymentBankProductMultiSetEnrichments(data.bankProductMultiSet,
				data.bankProductMultiSetMetadata, intCounter,
				'bankProductMultiSetEnrichDiv', 'Q', true);
		isVisible = true;
	}
	if (data.clientMultiSet && data.clientMultiSetMetadata) {
		paintPaymentClientProductMultiSetEnrichments(data.clientMultiSet,
				data.clientMultiSetMetadata, intCounter,
				'clientMultiSetEnrichDiv', 'Q', true);
		isVisible = true;
	}

	if (isVisibleTransAddenda) {
		$('#addendaInfoEnrichInTransctionDiv').removeClass(clsHide);
	}
	if (isVisible)
		$('#addendaSectionDiv').removeClass(clsHide);
	else
		$('#addendaSectionDiv').addClass(clsHide);

	return (isVisible);

}
function paintPaymentEnrichmentAsSetName(setNameMap, arrPrdEnr, strTargetId) {
	var field = null, targetDiv = $('#' + strTargetId), label = null, div = null, innerDiv = null, intCnt, tempObj, mainDiv = null, fieldSetDiv = null, fieldset = null, legend = null, strLabel = null;
	var strSetName = null, blnNewRow = true, enrField = null, enrFieldSeqNo = 0;
	var colCls = 'col-sm-4';
	var chkBoxDiv = null, chkBoxLbl = null, wrapperDiv = null, internalWrapperDiv = null, internalShadedDiv = null, rowDiv = null;

	if (arrPrdEnr) {
		$.each(arrPrdEnr, function(index, cfg) {
			if (cfg.enrichmentSetName) {
				strSetName = (cfg.enrichmentSetName).replace(/ /g, '_');
				if (setNameMap[strSetName]) {
					tempObj = setNameMap[strSetName];
				} else {
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

					rowDiv = $('<div>').attr({
								'class' : 'row '
							});
					chkBoxDiv = $('<div>').attr({
								'id' : strSetName + '_ChkBoxDiv'
							}).appendTo(fieldSetDiv);

					chkBoxLbl = $('<label>').attr({
								'style' : 'font-style:italic',
								'class' : 'fieldLabel'
							}).appendTo(chkBoxDiv);

					internalWrapperDiv = $('<div>').attr({
								'id' : strSetName + '_InternalWrapperDiv',
								'class' : 'col-sm-12 '
							}).appendTo(rowDiv);
					rowDiv.appendTo(wrapperDiv);

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
						div = $('<div>').attr({
									'class' : colCls,
									'id' : cfg.code + 'Div'
								});
						innerDiv = $('<div>').attr({
									'class' : 'form-group',
									'id' : cfg.code + '_InnerDiv'
								});
						label = $('<label>').attr({
									'class' : 'fieldLabel'
								});
						label.html(cfg.description);
						field = $('<span>').attr({
							'class' : 'rounded inline_block disabled ofcontents form-control canClear w16'
									+ cfg.code + '_InnerDiv',
							'id' : cfg.code + '_InnerDiv',
							'title' : cfg.value
						});
						field.text(cfg.value);
						
						if (field) {
							label.attr('for', cfg.code);
							label.appendTo(innerDiv);
							field.appendTo(innerDiv);
							innerDiv.appendTo(div);
							if (!isEmpty(cfg.sequenceNmbr)) {
								var seqno = cfg.sequenceNmbr;
								if (seqno % 2 != 0) {
									div.addClass(colCls);
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
												$('<div>').attr({
													'class' : colCls
															+ ' emptyEnrichDiv'
												}).appendTo(tempObj['mainDiv'
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
}
function paintPaymentEnrichmentsHelper(arrPrdEnr, intCounter, strTargetId,
		strPmtType, argsData, isMultiset) {
	var field = null, targetDiv = $('#' + strTargetId), label = null, div = null, wrappingDiv = null, intCnt = 1, sortArrPrdEnr, minCounter, maxCounter, arrLength;
	var colCls = 'col-sm-4';
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
								'class' : colCls + ' ',
								'id' : enrField.code + 'wrappDiv'
							});
					div = $('<div>').attr({
								'class' : 'form-group',
								'id' : enrField.code + 'Div'
							});
					label = $('<label>').attr('class', 'fieldLabel');
					// label = $('<label>').attr('class', 'payment-font-bold');

					label.text(enrField.description);
					field = $('<span>').attr({
						'class' : 'rounded inline_block disabled ofcontents form-control canClear w16 '
								+ enrField.code,
						'id' : enrField.code
					});
					field.text(enrField.value);
					if (field) {
						label.attr('for', enrField.code);
						label.appendTo(div);
						field.appendTo(div);
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
/**
 * The generic function handleDisplayMode used to handle the hide/show and
 * mandatory/non-mandatory of the UI field based on the response JSON.
 * 
 * @param {String}
 *            displayMode The displayMode used to hide/show and
 *            mandatory/non-mandatory of the UI field. The possible values for
 *            displayMode are 1,2,3,4 These stands as : 1-Hidden(Not to post
 *            while saving the transaction), 2-Non Mandatory,
 *            3-Mandatory,4-Confidential
 * 
 * @param {String}
 *            fieldId The JSON node name of the field. Should be same on UI,
 *            only string postfix will appended based on single/multiple payment
 * 
 * @param {String}
 *            strPaymentType The identifier to identify the Single/Multiple
 *            payment. The possible values are Q and B respectively
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
 * The logic is as below 1. The outer DIV's id should be jsonNode.fieldName +
 * 'Div' / jsonNode.fieldName + 'HdrDiv'. e.g companyIdDiv (Single Payment) and
 * companyIdHdrDiv(Multiple Payment) 2. The field label's id should be
 * jsonNode.fieldName + 'Lbl' / jsonNode.fieldName + 'HdrLbl' e.g companyIdLbl
 * (Single Payment) and companyIdHdrLbl(Multiple Payment). The label attribute
 * "for" should have the fields id value 3. The field id / name should be
 * jsonNode.fieldName/jsonNode.fieldName+'Hdr' e.g companyId(Single Payment) and
 * companyIdHdr(Multiple Payment)
 * 
 * Now ,if displayMode is 1 then css class 'hidden' will be added to the outer
 * div. if displayMode is 2 then css class 'hidden' will be removed from the
 * outer div. if displayMode is 3 then css class 'hidden' will be removed from
 * the outer div and css class 'required' will be added to the label.
 */
function handleDisplayMode(displayMode, fieldId, strPaymentType) {
	var clsHide = 'hidden';
	var divId = null, strDivPostFix = 'Div', strLblPostfix = 'Lbl', strSelector = null;
	divId = fieldId + strDivPostFix;
	strSelector = '#' + divId + ',.' + divId;
	$('#' + divId).addClass(clsHide);
	$('.' + divId).addClass(clsHide);
	if (displayMode) {
		switch (displayMode) {
			case '1' :
				$('#' + divId).addClass(clsHide);
				$('.' + divId).addClass(clsHide);
				break;
			case '2' :
			case '3' :
				$('#' + divId).removeClass(clsHide);
				$('.' + divId).removeClass(clsHide);
				break;
			case '4' :
				break;

		}
	}
}

function toggleContainerDisplayMode(strTargetCtId, blnShow) {
	var clsHide = 'hidden';
	if (blnShow === true)
		$('.canHide').addClass(clsHide);
	else
		$('.canHide').removeClass(clsHide);
}
function toggleContainerVisibility(strTargetDivId) {
	$((strTargetDivId ? '#' + strTargetDivId + ' ' : '') + '.canParentHide')
			.each(function() {
				if ($(this).find('.canHide').length === $(this)
						.find('.canHide.hidden').length) {
					$(this).addClass('hidden');
				} else
					$(this).removeClass('hidden');
			});
	$((strTargetDivId ? '#' + strTargetDivId + ' ' : '') + '.canContainerHide')
			.each(function() {
				if ($(this).find('.canParentHide').length === $(this)
						.find('.canParentHide.hidden').length) {
					$(this).addClass('hidden');
				} else
					$(this).removeClass('hidden');
			});
}
function paintPaymentTransactionAuditInfoGrid(strInstId) {
	var renderToDiv = 'auditInfoGridDiv';
	$('#' + renderToDiv).empty();
	var store = createAuditInfoGridStore(strInstId);
	var grid = Ext.create('Ext.grid.Panel', {
	    store : store,
	    popup : true,
	    columns : [ {
	        dataIndex : 'userCode',
	        text : mapLbl['txnUser'],
	        width : 200,
	        draggable : false,
	        resizable : false,
	        hideable : false,
	        sortable : false
	    }, {
	        dataIndex : 'logDate',
	        text : mapLbl['txnDateTime'],
	        width : 220,
	        draggable : false,
	        resizable : false,
	        hideable : false,
	        sortable : false
	    }, {
	        dataIndex : 'requestState',
	        text : mapLbl['txnAction'],
	        width : 150,
	        draggable : false,
	        resizable : false,
	        hideable : false,
	        sortable : false
	    }, {
	        dataIndex : 'remarks',
	        text : mapLbl['txnRemarks'],
	        flex : 1,
	        draggable : false,
	        resizable : false,
	        hideable : false,
	        sortable : false
	    } ],
	    renderTo : renderToDiv
	});
	var layout = Ext.create('Ext.container.Container', {
	    width : 'auto',
	    items : [ grid ],
	    renderTo : renderToDiv
	});
	auditGrid = layout;
	return layout;
}

function createAuditInfoGridStore(strInstId) {
	var myStore = Ext.create('Ext.data.Store', {
				fields : ['zone', 'version', 'recordKeyNo', 'userCode',
						'logDate', 'requestState', 'phdClient', 'logNumber',
						'pirNumber', 'pirSerial', 'avmLevel', 'remarks',
						'__metadata', 'action','internalTxnNmbr'],
				// data : jsonData,
				proxy : {
					type : 'ajax',
					url :'services/payments/id/history.json',
					actionMethods : {
						read : "POST",
					},
					extraParams:{$id:strInstId},		
					reader : {
						type : 'json',
						root : 'd.paymentsHistory'
					}
				},
				autoLoad : true
			});
	return myStore;
}
function generateSortArrPrdEnr(arrPrdEnr) {
	var arrRet = new Array();
	if (arrPrdEnr)
		arrRet = arrPrdEnr.sort(function(valA, valB) {
					return valA.sequenceNmbr - valB.sequenceNmbr
				});
	return arrRet;
}
function getEnrField(arrPrdEnr, seqNo) {
	var retField = null;
	for (var i = 0; i < arrPrdEnr.length; i++) {
		if (arrPrdEnr[i].sequenceNmbr === seqNo)
			retField = arrPrdEnr[i];

	}
	return retField;
}
function showBatchView() {
	if (strInstQuery == 'Y') {
		var form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(createFormField('INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue));
		form.action = 'showPaymentInstQuery.srvc';
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	}
	else {
		location.reload();
	}
}
function getEnrichValueToDispayed(cfg) {
	var displayType = cfg.displayType;
	var strReturnValue = '', strTemp = '', defValue = cfg.value;
	if (isEmpty(displayType))
		displayType = 0;
	switch (displayType) {

		case 4 : // COMBOBOX
			if (!isEmpty(cfg.value)) {
				strReturnValue = getObjectFormJsonKeyValueArray(cfg.value,
						cfg.lookupValues);
				strReturnValue = strReturnValue && strReturnValue.value
						? strReturnValue.value
						: '';
			}
			break;
		case 5 : // SELECTBOX
			break;
		case 8 : // SEEKBOX
			break;
		case 1 : // TEXTAREA
		case 2 : // AMOUNTBOX
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
/* Limit Popup Changes starts */
function handleLimitPopup(strIdentifier) {
	var fieldName = null;
	$('#warningLimitInfoDiv').addClass('hidden');
	strPaymentAdditionalInfoData = getPaymentAddtionInformationData(strIdentifier);
	if (strPaymentAdditionalInfoData) {
		$.each(strPaymentAdditionalInfoData, function(fieldName, fieldValue) {
					if (fieldName === 'limitProfile' && !isEmpty(fieldValue)) {
						$('#warningLimitInfoDiv').removeClass('hidden');
						$("#limitTabs").barTabs();
						paintLimitPopup(strIdentifier);
					} else if (fieldName === 'hostMessage' && !isEmpty(fieldValue)) {
						$("#reasonsDiv").removeClass('hidden');
						$("#txtAreaReasons").val(fieldValue);
					}
				});
	}

}
function getPaymentAddtionInformationData(strIdentifier) {
	var objResponseData = null;
	if (strIdentifier && strIdentifier != '') {
		var strUrl = 'services/pirAdditionalInfo.json';
		$.ajax({
					url : strUrl,
					type : 'POST',
					async : false,
					data : {
						'$id' : strIdentifier
					},
					contentType : "application/json",
					complete : function(XMLHttpRequest, textStatus) {
						if ("error" == textStatus) {
							// TODO : Error handling to be done.
							// alert("Unable to complete your request!");
							// blockPaymentUI(true);
						}
					},
					success : function(data) {
						if (data && data.d)
							objResponseData = data.d;
					}
				});
	}
	return objResponseData;
}
function getLimitsPopupInfo(strIdentifier) {
	var jsonData = null;
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
							/*
							 * var arrError = new Array(); arrError.push({
							 * "errorCode" : "Message", "errorMessage" :
							 * mapLbl['unknownErr'] }); paintErrors(arrError);
							 */
						}
					}
				});
	}
	return jsonData;
}
function paintLimitPopup(strIdentifier) {
	var clsHide = 'hidden', data = null;
	data = getLimitsPopupInfo(strIdentifier);
	// Remove following comment for unit testing.
	// data = dummyLimitsPopupData;
	$('#limitTabs .canClear').text('');
	if (data && data.d) {
		$.each(data.d, function(key, sectionData) {
			if (key != "metadata") {
				$("." + key + "Tab").removeClass(clsHide);
				$('#tabs-' + key).removeClass(clsHide);
				// var sectionLimitData = sectionData;
				$.each(sectionData, function(sectionDataPtr, sectionDataObj) {
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
										.text(sectionDataObj.transaction.credit);
							if (sectionDataObj.transaction.debit)
								$(".section" + key + "_" + sectionDataPtr
										+ "_txnDebitLimit")
										.text(sectionDataObj.transaction.debit);
						}

						if (sectionDataObj.cumulative) {
							$(".section" + key + "_" + sectionDataPtr
									+ "_CumulativeDiv").removeClass(clsHide);
							if (sectionDataObj.cumulative.header)
								$(".section" + key + "_" + sectionDataPtr
										+ "_cumulativeheader")
										.text(sectionDataObj.cumulative.header);
							if (sectionDataObj.cumulative.transferCreditLimit
									&& sectionDataObj.cumulative.transferCreditOS) {
								$(".section" + key + "_" + sectionDataPtr
										+ "_transferCreditDiv")
										.removeClass(clsHide);
								$(".section" + key + "_" + sectionDataPtr
										+ "_transferCreditLimit")
										.text(sectionDataObj.cumulative.transferCreditLimit);
								$(".section" + key + "_" + sectionDataPtr
										+ "_transferCreditOS")
										.text(sectionDataObj.cumulative.transferCreditOS);
								if (sectionDataObj.cumulative.markTransferCreditLimit
										&& sectionDataObj.cumulative.markTransferCreditLimit === 'Y')
									$(".section" + key + "_" + sectionDataPtr
											+ "_transferCreditLimit").attr(
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

							if (sectionDataObj.cumulative.transferDebitLimit
									&& sectionDataObj.cumulative.transferDebitOS) {
								$(".section" + key + "_" + sectionDataPtr
										+ "_transferDebitDiv")
										.removeClass(clsHide);
								$(".section" + key + "_" + sectionDataPtr
										+ "_transferDebitLimit")
										.text(sectionDataObj.cumulative.transferDebitLimit);
								$(".section" + key + "_" + sectionDataPtr
										+ "_transferDebitOS")
										.text(sectionDataObj.cumulative.transferDebitOS);
								if (sectionDataObj.cumulative.markTransferDebitLimit
										&& sectionDataObj.cumulative.markTransferDebitLimit === 'Y')
									$(".section" + key + "_" + sectionDataPtr
											+ "_transferDebitLimit").attr(
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
											+ "_warningDebitOS").attr('style',
											'color:red');
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
}
$.fn.barTabs = function(config) {
	var tabs = $('#' + this[0].id).tabs();
	var headers = $(tabs[0].childNodes[1]);
	headers.addClass('ui-bar-tabs');
}
/* Limit Popup Changes ends */

function pageInstOnLoad(){
    $("#paymentInfoLink").click(
            function() {
                $('#paymentInfoLink').toggleClass(
                        "icon-expand icon-collapse");
                $('#paymentInfoDiv').slideToggle("fast");
                return false;
            });
    $("#operationalDetailsLink").click(
            function() {
                $('#operationalDetailsLink').toggleClass(
                        "icon-expand icon-collapse");
                $('#operationalDetailsDiv').slideToggle("fast");
                return false;
            });
    $("#clientSummaryLink").click(
            function() {
                $('#clientSummaryLink').toggleClass(
                        "icon-expand icon-collapse");
                $('#clientSummaryDiv').slideToggle("fast");
                return false;
            });
    $("#senderDetailsLink").click(
            function() {
                $('#senderDetailsLink').toggleClass(
                        "icon-expand icon-collapse");
                $('#senderDetailsDiv').slideToggle("fast");
                return false;
            });
    $("#paymentDetailsLink").click(
            function() {
                $('#paymentDetailsLink').toggleClass(
                        "icon-expand icon-collapse");
                $('#paymentDetailsDiv').slideToggle("fast");
                return false;
            });
    $("#cancellationInfoLink").click(
            function() {
                $('#cancellationInfoLink').toggleClass(
                        "icon-expand icon-collapse");
                $('#cancellationInfoDiv').slideToggle("fast");
                return false;
            });
    $("#divPayOutAndDeliveryLink").click(
            function() {
                $('#divPayOutAndDeliveryLink').toggleClass(
                        "icon-expand icon-collapse");
                $('#payOutAndDeliveryDiv').slideToggle("fast");
                return false;
            });
    $("#liquidationInfoLink").click(
            function() {
                $('#liquidationInfoLink').toggleClass(
                        "icon-expand icon-collapse");
                $('#liquidationInfoDiv').slideToggle("fast");
                return false;
            });
    $("#txnRelatedInfoLink").click(
            function() {
                $('#txnRelatedInfoLink').toggleClass(
                        "icon-expand icon-collapse");
                $('#txnRelatedInfoDiv').slideToggle("fast");
                return false;
            });
    $("#additionalInfoLink").click(
            function() {
                $('#additionalInfoLink').toggleClass(
                        "icon-expand icon-collapse");
                $('#additionalInfoDiv').slideToggle("fast");
                return false;
            });
    $("#orderingPartyLink").click(
            function() {
                $('#orderingPartyLink').toggleClass(
                        "icon-expand icon-collapse");
                $('#orderingPartyInfoDiv').slideToggle("fast");
                return false;
            });
    $("#addendaInfoLink").click(
            function() {
                $('#addendaInfoLink').toggleClass(
                        "icon-expand icon-collapse");
                $('#addendaInfoDiv').slideToggle("fast");
                return false;
            });
}

