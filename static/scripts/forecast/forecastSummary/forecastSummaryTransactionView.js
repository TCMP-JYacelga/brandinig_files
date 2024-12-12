function handleForecastDetailViewGridRowAction(grid, rowIndex, columnIndex, action,
		event, record) {
	var strAction = action;
	var strForecastIdentifier = null, strPaintAction = null, strDivId = null, strButtonMask = null, strRightsMask = null, strActionMask = null;
	var grid = getForecastSummaryGrid();
	var currentPage = grid.store.currentPage;
	if (record) {
		if (record.data &&  record.data.identifier)
			strForecastIdentifier = record.data.identifier;

		if (record.data && record.data.__metadata && record.data.__metadata
				&& record.data.__metadata.__rightsMap)
			strRightsMask = record.data.__metadata.__rightsMap;

		var maskArray = new Array();
		var intMaskSize = !isEmpty(strButtonMask)
				? strButtonMask.length
				: (!isEmpty(strRightsMask) ? strRightsMask.length : 0);
		strActionMask = doAndOperation(maskArray, intMaskSize);
	}
	if (!isEmpty(strAction)) {
		doClearMessageSection();
		resetForecastForm();
		if (strAction === 'btnViewTxn') {
			strDivId = 'transactionWizardViewPopup';
			strPaintAction = 'VIEW';
		}
		
		if (strPaintAction === 'VIEW') {
			var forecastTxnSummaryGrid = getForecastSummaryGrid();
			if (forecastTxnSummaryGrid) {
				toggleForecastPagination(strPaintAction);
				updatePagingParamsView(forecastTxnSummaryGrid.getRowNumber(rowIndex + 1),
						((currentPage - 1) * grid.pageSize) + grid.store.getCount());
			}
			showTransactionWizardPopup(strForecastIdentifier, strPaintAction,
					strDivId, strActionMask, record);
		}
	}
}

function getForecastSummaryGrid() {
	var grid = null;
	if (typeof groupView != 'undefined' && groupView) {
		grid = groupView.getGrid();
	}
	return grid;
}

function doClearMessageSection() {
	$('#messageArea').empty();
	$('#successMessageArea, #messageArea, #messageContentDiv, #enrichMessageContentDiv')
			.addClass('hidden');
}

function resetForecastForm() {
	$('#transactionWizardPopup')
			.find('input:text, input:hidden, textarea, select, input:checkbox, input:radio')
			.each(function() {
				if ($(this).is(':checkbox')) {
					$(this).attr("checked", false);
				} else if ($(this).is(':radio'))
					$(this).attr("checked", false);
				else if ($(this).is('select')) {
					if ($(this).find("option:contains('')"))
						$(this).val('');
					else
						$(this).find("option:first").attr('selected',
								'selected');
				} else if ($(this).attr('type') !== 'button')
					$(this).val('');
				$(this).removeClass('requiredField');
			});
	
	$('#forecastAdditionalInfoSection').empty();
}

function toggleForecastPagination(strMode) {
	var classSuffix = strMode === 'UPDATE' ? 'Update' : '';
	$('.previousTxn' + classSuffix).unbind('click').bind('click', function() {
				handleForecastPagination(-1, strMode);
			});
	$('.nextTxn' + classSuffix).unbind('click').bind('click', function() {
				handleForecastPagination(1, strMode);
			});
}

function handleForecastPagination(intCount, strMode) {
	var classSuffix = (strMode === 'UPDATE') ? 'Update' : '';
	var intCurrentForecast = parseInt($($('.currentPage' + classSuffix)[0]).text(),10);
	var grid = getForecastSummaryGrid();
	var pageSize = grid.store.pageSize;
	var currentPage = grid.store.currentPage;
	var intPgSize = 0;
	var intTotalRecords = 0, intMoveTo = 0, intRecordIndex = 0, intCurrentPage, record, strForecastIdentifier, strActionMask = null, intMoveIndex = 0;;
	var strButtonMask = null, strRightsMask = null;
	if (grid) {
		intMoveIndex = (intCurrentForecast - ((currentPage - 1) * pageSize)) + intCount;
		intMoveTo = intCurrentForecast + intCount;
		record = grid.getRecord(intMoveIndex);
	
		if (record) {
			if (record && record.data && record.data.identifier)
				strForecastIdentifier = record.data.identifier;
				

			var maskArray = new Array();
			var intMaskSize = !isEmpty(strButtonMask)
					? strButtonMask.length
					: (!isEmpty(strRightsMask) ? strRightsMask.length : 0);
			strActionMask = doAndOperation(maskArray, intMaskSize);
		
			if (strForecastIdentifier) {
				doClearMessageSection();
				blockForecastUI(true);
				if (strMode === 'VIEW') {
					viewForecastTransaction(strForecastIdentifier, 'VIEW', strActionMask);
					updatePagingParamsView(intMoveTo, ((currentPage - 1) * grid.pageSize) + grid.store.getCount());
				}
			}
		}

	}
}

function updatePagingParamsEdit(intCurrentIndex, intTotalRows) {
	$('.currentPageUpdate').html(intCurrentIndex);
	$('.totalPagesUpdate').html(intTotalRows);
}

function updatePagingParamsView(intCurrentIndex, intTotalRows) {
	$('.currentPage').html(intCurrentIndex);
	$('.totalPages').html(intTotalRows);
}

function showTransactionWizardPopup(strIde, strAction, strPopUpDivId,
		strActionMask) {
	blockForecastUI(true);
	var strDivId = strPopUpDivId || 'transactionWizardPopup';
	$("#" + strDivId).dialog({
		autoOpen : false,
		resizable : false,
		draggable : false,
		modal : true,
		maxHeight : 500,
		width : 869,
		dialogClass : "hide-title-bar",
		open : function(event, ui) {
			var strMsgDivId = '#messageContentForecastTxnViewDiv';
			$('#messageContentDiv').appendTo($(strMsgDivId));
			$('#enrichMessageContentDiv').appendTo($(strMsgDivId));
			doClearMessageSection();
			$(this).data['strTxnWizardAction']= strAction;
			if (strAction === 'VIEW')
				doShowAddedForecast(strIde, strAction, strActionMask);
			$('.transaction-wizard :input:not(:checkbox):not(:radio):not([readonly]):visible:enabled:first')
					.focus();
			blockForecastUI(false);
		},
		close : function(event, ui) {
			$('#messageContentDiv').appendTo($('#messageContentHeaderDiv'));
			forecastResponseData = null;
			var strTxnWizardAction =$(this).data['strTxnWizardAction'];
			if((strTxnWizardAction=== 'ADD' || strTxnWizardAction=== 'UPDATE') && typeof groupView != 'undefined'
					&& groupView) {
				groupView.refreshData();
			}
		}
	});
	//opening the transaction n=info pop up and positioning it to center
	$("#" + strDivId).dialog("open");
	$("#" + strDivId).dialog('option','position','center');
}

function closeTransactionWizardPopup() {
	$('#transactionWizardPopup').dialog('close');
}
function closeViewTransactionWizardPopup() {
	$('#transactionWizardViewPopup').dialog('close');
}

function blockForecastUI(blnBlock) {
	if (blnBlock === true) {
		$(".transactionWizardInnerDiv").addClass('hidden');
		$('.blockForecastUIDiv').removeClass('hidden');
		$('.blockForecastUIDiv').block({
			overlayCSS : {
				opacity : 0
			},
			baseZ : 2000,
			message : '<div id="loadingMsg"><img src="static/styles/Themes/t7-main/resources/images/T7/loading.gif" style="background-position: left center;"/><span style="vertical-align: text-top; margin-left: 5px;">Loading...</span></div>',
			css : {
			}
		});
	} else {
		$(".transactionWizardInnerDiv").removeClass('hidden');
		$('.blockForecastUIDiv').addClass('hidden');
		$('.blockForecastUIDiv').unblock();
	}
	//$('.transaction-wizard :input:visible:enabled:first').focus();
}

function doShowAddedForecast(strIde, strAction, strActionMask) {
	blockForecastUI(true);
	if (strAction === 'VIEW') {
		viewForecastTransaction(strIde, strAction, strActionMask);
	}
}

function viewForecastTransaction(strIde, strAction, strActionMask) {
	identifier = strIde;
	var url = 'services/forecastSummaryTxnViewInfo/id.json';
	$.ajax({
		type : "POST",
		url : url,		
		data : {'id':strIde},
		async : false,	
		complete : function(XMLHttpRequest, textStatus) {
			if ("error" == textStatus) {
				closeViewTransactionWizardPopup();
				blockForecastUI(false);
				var arrError = new Array();
				arrError.push({
							"errorCode" : "Message",
							"errorMessage" : 'Unable to process your request at this moment.Please contact Admin!'
						});
				paintErrors(arrError);
			}
		},
		success : function(data) {
			if (data != null) {
				if (data.d
						&& data.d.message
						&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
					closeViewTransactionWizardPopup();
					paintErrors(data.d.message.errors);
				} else {
					forecastResponseData = data;

					resetForecastTransactionViewOnlyUI();
					paintForecastTransactionViewOnlyUI(data,
							null);

					paintForecastTransactionActions('CLOSE', false);

					toggleContainerVisibility('transactionWizardViewPopup');
					blockForecastUI(false);
					handleEmptyEnrichmentDivs();
				}
			}
		}
	});
}

function paintErrors(arrError) {
	doHandlePaintErrors(arrError, 'CASHWEB');
}

function doHandlePaintErrors(arrError, strErrorType) {
	var element = null, strMsg = null, strTargetDivId = 'messageArea', strErrorCode = '';
	/*
	 * if (strErrorType === 'CASHIN') strTargetDivId = 'cashinMessageArea';
	 */
	if (arrError && arrError.length > 0) {
		$('#' + strTargetDivId).empty();
		$.each(arrError, function(index, error) {
					strMsg = error.errorMessage;
					strErrorCode = error.errorCode || error.code;
					strMsg += !isEmpty(strErrorCode) ? ' (' + strErrorCode
							+ ')' : '';
					/*
					 * if (!isEmpty(strMsg)) strMsg += ' : ';
					 */
					if (!isEmpty(strErrorCode)) {
						if (strErrorCode.toUpperCase().indexOf("WARN") >= 0) {
							var msg = mapLbl['warnMsg']
							if (!isEmpty(msg))
								msg += ' : ';
							// element = $('<li>').text(msg+strMsg);
							$('#successMessageArea').empty();
							element = $('<p>').text(msg + error.errorMessage);
							// element.appendTo($('#successMessageArea'));
							element.appendTo($('#' + strTargetDivId));
							$('#' + strTargetDivId + ', #messageContentDiv')
									.removeClass('hidden');
						} else {
							element = $('<p>').text(strMsg);
							if (strErrorCode === 'P22') {
								$("<a id='hrefValidate' href='#'>").css({
											"display" : "block",
											"float" : "right"
										}).addClass('t7-anchor')
										.text('Validate').appendTo(element)
										.click(function() {
													doRRValidateHeader();
												});
							}
							element.appendTo($('#' + strTargetDivId));
							$('#' + strTargetDivId + ', #messageContentDiv')
									.removeClass('hidden');
						}

					}
				});

	}
}

function resetForecastTransactionViewOnlyUI() {
	$(".transactionWizardInnerDiv").find(".canClear").html('');
	$(".transactionWizardInnerDiv").find(".canCollapse").addClass('hidden');
	$('#forecastAdditionalInfoSection').empty();
}

function paintForecastTransactionViewOnlyUI(objForecastTxnData, objHdrData) {
	var arrStdFields = null, clsHide = 'hidden';
	var strFieldName = null, strValue = null, mapFields = {}, strPostFix = null, arrFields = null, ctrl = null;
	var objHdrInfo = null, objMetaData = null, forecastTxnInfo = null, beneficiary = null, canShowEnrichmentSection = false, canShowAdditionalInfoSection = false;
	if (objForecastTxnData && objForecastTxnData.d) {
		if (objForecastTxnData.d.forecastBean) {
			forecastTxnInfo = objForecastTxnData.d.forecastBean;
			recordKey = forecastTxnInfo.recordKeyNo;
			txnViewClient = forecastTxnInfo.clientId;
			txnViewSeller = forecastTxnInfo.sellerCode;
			if (forecastTxnInfo.productDesc) {
				$('.hdrMyProductDescriptionTitle')
						.text(forecastTxnInfo.productDesc || '');
				cffProduct = forecastTxnInfo.productDesc || '';
			}
			
			if (forecastTxnInfo.glId) {
				$('#txnView_accountNumber')
						.text(forecastTxnInfo.glId || '');
			}
			
			if (forecastTxnInfo.forecastDate) {
				$('#txnView_effectiveDate')
						.text(forecastTxnInfo.forecastDate || '');
			}
			
			if (forecastTxnInfo.transactionAmount) {
				$('#txnView_transactionAmount')
						.text(forecastTxnInfo.transactionAmount || '');
			}
			
			if (forecastTxnInfo.forecastAmount) {
				$('#txnView_forecastAmount')
						.text(forecastTxnInfo.forecastAmount || '');
			}
			
			if (forecastTxnInfo.forecastType) {
				$('#txnView_forecastType')
						.text((forecastTxnInfo.forecastType) || '');
			}
			
			if (forecastTxnInfo.forecastExpectation) {
				$('#txnView_expectation')
						.text((forecastTxnInfo.forecastExpectation) || '');
			}
			
			if (forecastTxnInfo.settledAmount) {
				$('#txnView_settledAmount')
						.text((forecastTxnInfo.settledAmount) || '');
			}
			
			if (forecastTxnInfo.transactionType) {
				$('#txnView_transactionType')
						.text((forecastTxnInfo.transactionType == 'C' ? 'Credit' : 'Debit') || '');
			}
			
			if (forecastTxnInfo.forecastReference) {
				$('#txnView_forecastReference')
						.text((forecastTxnInfo.forecastReference) || '');
			}
			
			if (forecastTxnInfo.ccyCode) {
				$('.forecastCcyCode')
						.text(('('+ forecastTxnInfo.ccyCode +')') || '');
			}
			
			if (objForecastTxnData.d.enrichmentDefinition && objForecastTxnData.d.enrichmentDefinition.length > 0) {
				$('#additioninfoDiv').show();
				paintForecastEnrichmentsViewOnlyFields(objForecastTxnData.d.enrichmentDefinition, objForecastTxnData.d.enrichmentDtls);
			}
			else{
				$('#additioninfoDiv').hide();
			}
		}
	}

}

function paintForecastEnrichmentsViewOnlyFields(enrichDefList, forecastSavedEnrichments){
	var rowDiv = null, enrichmentDiv = null, formGroupDiv = null,label = null, spanDiv = null;
	var targetDiv = $('#forecastAdditionalInfoSection');
	var enrichmentslength = enrichDefList.length;
	$.each(enrichDefList, function(index, cfg) {
		if(index % 3 == 0){
			if(rowDiv != null)
				$(rowDiv).appendTo(targetDiv);
			rowDiv = null;
			rowDiv = $("<div>").attr({
				'class' : 'row'
			});
		}
		
		enrichmentDiv = $('<div>').attr({
			'id' : cfg.enrichmentCode + '_WrapperDiv','class' : 'col-sm-4'
		});
		
		formGroupDiv = $('<div>').attr({
			'class' : 'form-group'
		});
		
		label = $('<label>').html(cfg.enrichmentLabel);
		
		label.appendTo(formGroupDiv);
		$('</br>').appendTo(formGroupDiv);
		
		spanDiv = $('<span>').html(forecastSavedEnrichments[cfg.enrichmentCode]);
		$(spanDiv).appendTo(formGroupDiv);
		
		formGroupDiv.appendTo(enrichmentDiv);
		
		enrichmentDiv.appendTo(rowDiv);
		
		if(index == (enrichmentslength -1)){
			if(rowDiv != null)
				$(rowDiv).appendTo(targetDiv);
		}
	});
}

function paintForecastTransactionActions(strAction, isBtnVisible) {
	var elt = null, eltCancel = null, eltDiscard = null;
	$('#forecastDtlActionButtonListLT,#forecastDtlActionButtonListRT, #forecastDtlActionButtonListLB, #forecastDtlActionButtonListRB')
			.empty();
	var strBtnLTLB = '#forecastDtlActionButtonListLT,#forecastDtlActionButtonListLB';
	var strBtnRTRB = '#forecastDtlActionButtonListRB';
	var canShow = true;
	eltCancel = createForecastButton('btnClose', 'S', 'Close');
	eltCancel.click(function() {
				doCancelViewForecastTxn();
			});
	eltCancel.appendTo($(strBtnLTLB));
}

function toggleContainerVisibility(strTargetDivId) {
	$((strTargetDivId ? '#' + strTargetDivId + ' ' : '') + '.canParentHide')
			.each(function() {
				if ($(this).find('.canHide').length === $(this)
						.find('.canHide.hidden').length && $(this).find('.canHide').length > 0) {
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

function doCancelViewForecastTxn(strAction) {
	closeViewTransactionWizardPopup();
	blockForecastUI(true);
	doClearMessageSection();
	blockForecastUI(false);
}

function createForecastButton(btnKey, charIsPrimary, btnText) {
	var strCls = charIsPrimary === 'P'
			? 'ft-button canDisable ft-button-primary ft-margin-l'
			: (charIsPrimary === 'L' ? 'ft-btn-link canDisable ' : 'ft-button canDisable ft-button-light');
			
	var elt = null;
	elt = $('<input>').attr({
				'type' : 'button',
				'tabindex':1,
				'class' : strCls,
				'id' : 'button_' + btnKey,
				'value' : btnText
			});
	return elt;
}

function getReportForecastTxnDetail(){
	var screenType = 'ViewTransaction';
	var strUrl = '';
	var formMain = null;
	strUrl = 'services/forecastAccountSummaryList/getForecastViewTransactionReport.pdf';
	formMain = document.createElement( 'FORM' );
	formMain.name = 'txnViewPopup';
	formMain.id = 'txnViewPopup';
	formMain.method = 'POST';
	formMain.appendChild( createFormField( 'INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue ) );
	formMain.appendChild( createFormField( 'INPUT', 'HIDDEN', '$recordKey', recordKey ) );
	formMain.appendChild( createFormField( 'INPUT', 'HIDDEN', '$screenType', 'ViewTransaction' ) );
	formMain.appendChild( createFormField( 'INPUT', 'HIDDEN', '$client', txnViewClient ) );
	formMain.appendChild( createFormField( 'INPUT', 'HIDDEN', '$seller', txnViewSeller ) );
	formMain.action = strUrl;
	document.body.appendChild( formMain );
	formMain.submit();
	document.body.removeChild(formMain );	
}