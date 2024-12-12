
/**
 * PO header identifier to be assigned to strHeaderIdentifier
 */

var strHeaderIdentifier = null;
var lineItemGridRowData = null;
var chrAllowGridLayoutEntry = 'N';
var intHdrDirtyBit = 0;
/**
 * Header service response to be stored in purchaseOrderHeaderData
 */
var purchaseOrderHeaderData = null;
var _mapUrl=getPurchaseOrderUrlMap();
var purchaseOrderLineItemData=null;
var strDetailIdentifier=null;
/*******************************************************************************
 * PO header entry start here
 ******************************************************************************/

// TODO : PO entry code to be written here
/**
 * This is used to get header fields for screen painting for add mode
 */
function loadHeaderFields() {
var strProductCode = strMyProduct;
	var strUrl = _mapUrl['loadPOHeaderUrl'] + "/(" + strHeaderIdentifier+").json";
//var strUrl='static/scripts/fsc/PurchaseOrder/data/PO_Header.json';
if(!isEmpty(strMyProduct)){
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
					paintErrors(arrError);
					blockPOUI(false);
				}
			},
			success : function(data) {
				if (data != null) {
					if (data.d
							&& data.d.message
							&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
						//TODO : To be handled
						doHandleEmptyScreenErrorForPOHeader(data.d.message.errors);
						blockPOUI(false);
					} else {
						purchaseOrderHeaderData = data;
						purchaseOrderHeaderData=data;
						jsonArgs = {};
						jsonArgs.action = 'SAVE';
						doRemoveStaticText("poEntryStep2A");
						paintHeaderUI(data);
					    initatePOHeaderValidation();
						handleEmptyEnrichmentDivs();
						blockPOUI(false);
						if(chrAllowGridLayoutEntry === 'Y'){
							toggleGridLayoutEntryAddRow(true);
							doHandleEntryGridLoading(false, true);
						}
						toggleHeaderDirtyBit(true);
					}
				}
			}
		});
	} else {
		//TODO : To be handled
		doHandleUnknownErrorForPO();
		blockPOUI(false);
	}
}
/**
 * This is used to get header fields for screen painting in Edit mode
 */
function readHeaderForEdit(strIdentifier) {

}
/**
 * This is used to get header fields for screen painting in View mode
 */
function readHeaderForView(strIdentifier) {

}
/**
 * This is used to paint header fields with values
 */
function paintHeaderUI(objData) {
	var data = objData, arrStdFields = [];
	if (data && data.d && data.d.poEntry) {

		if (data.d.poEntry.standardField) {
			arrStdFields = data.d.poEntry.standardField;
			paintPOHeaderStandardFields(data.d.poEntry.standardField);
		}

		if (data.d.poEntry.enrichments) {
			paintPOHdrEnrichments(data.d.poEntry.enrichments);
		}
 }
}

function doSavePurchaseOrderHeader() {
var jsonData = generatePOHeaderJson(), jsonArgs = {};
	var canSave = validateRequiredPOFields();
	jsonArgs.action = 'UPDATEANDNEXT';
	jsonArgs.isSilent = false;
	savePOHeader(jsonData, postHandleSavePOHeader, jsonArgs);
}

function doUpdatePurchaseOrderHeader() {
var jsonData = generatePOHeaderJson(), jsonArgs = {};
	var canSave = validateRequiredPOFields();
	jsonArgs.action = 'UPDATEANDNEXT';
	doUpdateAndNextPOHeader(jsonData, postHandleSavePOHeader, jsonArgs);
}
function doSavePurchaseOrderHeaderSilent() {
var jsonData = generatePOHeaderJson(), jsonArgs = {};
	var canSave = validateRequiredPOFields();
	jsonArgs.action = 'UPDATE';
	jsonArgs.isSilent = true;
	var success=savePOHeader(jsonData, postHandleSavePOHeader, jsonArgs);
	return success;
}

function postHandleSavePOHeader(data,args){
	if(isFileUploaded===true){
	$("#fileLink").removeClass("hidden");
	}
	else{
	$("#fileLink").addClass("hidden");
	}
	if(data && data.d && data.d.poEntry && data.d.poEntry.message && data.d.poEntry.message.success === 'FAILED'){
		paintErrors(data.d.poEntry.message.errors);
	}
	if(data && data.d && data.d.poEntry && data.d.poEntry.txnMetaData)
	$('#viewState').val(data.d.poEntry.txnMetaData._headerId);
	strHeaderIdentifier = data.d.poEntry.txnMetaData._headerId;
	var status = null, strPirNo = null, strUniqueRef = null;
	var action = args.action;
	if (data && data.d) {
		if (data.d.poEntry && data.d.poEntry.message
				&& data.d.poEntry.message.success) {
			status = data.d.poEntry.message.success;
			status = status.toUpperCase();
		}
		if (!isEmpty(status) && status === 'SUCCESS'
				|| status === 'SAVEWITHERROR') {
			if (status === 'SUCCESS'
					&& (action === 'SAVE' || action === 'UPDATE')) {
				arrFields = data.d.poEntry.standardField;
				doClearMessageSection();

			}
			if (status === 'SAVEWITHERROR') {
				if (data.d.poEntry.message.errors)
					paintErrors(data.d.poEntry.message.errors);
			}
			if (data.d.poEntry && data.d.__metadata
					&& data.d.__metadata._headerId)
				strHeaderIdentifier = data.d.poEntry.txnMetaData._headerId;
			paintPOHeaderActions('EDIT');
			togglerPOHeaderScreen();
			populatePOHeaderViewOnlySection(purchaseOrderHeaderData, 'EDIT');
			if (action === 'UPDATE') {
				blockPOUI(false);
			} else if (action !== 'UPDATEANDNEXT') {
				blockPOUI(false);
			}
			if (action === 'UPDATEANDNEXT' && status !== 'SAVEWITHERROR') {
				doPostHandleUpdateAndNextPOHeader();
				blockPOUI(false);
			}
		} else if (status === 'FAILED') {
			if (data.d.poEntry.message) {
					paintErrors(data.d.poEntry.message.errors);
					blockPOUI(false);
			}
		} else if (isEmpty(status) && data.d.poEntry.message.errors) {
			doClearMessageSection();
			paintErrors(data.d.poEntry.message.errors);
			blockPOUI(false);
	       autoFocusFirstElement();
		}
	}
}
function populatePOHeaderViewOnlySection(data,  strMode) {
	var arrStdFields = data && data.d && data.d.poEntry
			&& data.d.poEntry.standardField
			? data.d.poEntry.standardField
			: null;
	var strFieldName = null, strValue = null, mapFields = {}, strPostFix='_HdrInfo', arrFields = null;
	if (arrStdFields) {
		$.each(arrStdFields, function(index, cfg) {
					strFieldName = cfg.fieldName;
					strValue = getValueToDispayed(cfg);
					strValue = !isEmpty(strValue) ? strValue : '';
					ctrl = $('#' + cfg.fieldName + strPostFix);
					ctrlLabel=$('#'+cfg.fieldName+"HdrLbl");
					ctrlDiv = $('#' + cfg.fieldName + strPostFix + 'Div');
					if (ctrl) {
						ctrlDiv.removeClass('requiredField');
						if (ctrlDiv.hasClass('hidden'))
							ctrlDiv.removeClass('hidden');
						if (ctrl.hasClass('hidden'))
							ctrl.removeClass('hidden');
						if(ctrlLabel.hasClass('required'))
						    ctrlLabel.removeClass('required');
						  if(strFieldName=="poAmount"){
						     $("#poAmount_HdrInfo").autoNumeric("init",
							{
									aSep: strGroupSeparator,
									aDec: strDecimalSeparator,
									mDec: strAmountMinFraction
							});
							$("#poAmount_HdrInfo").autoNumeric('set', strValue);
						  }
						 else
						ctrl.html(strValue);
				
					}
				});
	}
	if (data && data.d && data.d.poEntry
			&& data.d.poEntry.enrichments && data.d.poEntry.enrichments.poEnrichments) {
		paintPOHdrViewOnlyEnrichments(data);
	}
	toggleContainerVisibility('poEntryStep2');
}
function paintPOHeaderViewOnlyEnrichmentsHelper(arrPrdEnr,intCounter,strTargetId){
	if(arrPrdEnr.length!=0)
	{
	$("#additionalHdrInfoDiv").removeClass("hidden");
	$('<div>').attr('class', 'clear')
					.appendTo($('#additionalHdrInfoBody'));
	}
var field = null, targetDiv = $('#' + strTargetId), label = null, span = null, div = null, enrRow = null, formGroup = null, innerDiv = null, intCnt = 1, sortArrPrdEnr, minCounter, maxCounter, arrLength;
	var sortArrPrdEnr;
	var enrField = null, colCls = 'col-sm-6';
	var row = $('<div>').attr({
				'class' : 'row'
			}), numberOfCols = 2, intNoOfEnrichDivsAdded = 0;
	
	if (!isEmpty(intCounter))
		intCnt = intCounter;
	if (arrPrdEnr && arrPrdEnr.length > 0) {
		sortArrPrdEnr = generateSortArrPrdEnr(arrPrdEnr);
		arrLength = arrPrdEnr.length;
		minCounter = sortArrPrdEnr[0].seq;
		maxCounter = sortArrPrdEnr[arrLength - 1].seq;
		for (var i = minCounter; i <= maxCounter; i++) {
			var enrField = null;
			enrField = getEnrField(arrPrdEnr, i);
			if (!isEmpty(enrField) && enrField != null) {
					enrRow= $('<div>').attr({
						'class' : 'row'
					});
				
					formGroup = $('<div>').attr({
								'class' : 'form-group'
							});
					div = $('<div>').attr({
								'id' : enrField.code + 'Div'
							});
				  if (!isEmpty(enrField.dataType) && enrField.dataType != 'C'
							&& enrField.dataType != 'R') {
						div.addClass(colCls);
					} else {
						var strAdditionalHelperCls = 'smallEnrichDiv';
						div.addClass(colCls + ' ' + strAdditionalHelperCls);
					}
					
					if (!isEmpty(enrField.dataType) && enrField.dataType != 'C'
							&& enrField.dataType != 'R') {
						div.addClass(colCls);
					} else {
						var strAdditionalHelperCls = 'smallEnrichDiv';
						div.addClass(colCls + ' ' + strAdditionalHelperCls);
					}
					label = $('<label>').attr('class', '')
					if(enrField.displayType !== 'C')
						label.text(enrField.label ).append("&nbsp;");
						
					field = $('<div>').attr({
								'id' : 'enrInfo_' + enrField.code,
								'style' : 'height:20px;'
							});
					if (enrField.value && enrField.dataType === 'C')
						$(field).html(getEnrichValueToDispayed(enrField));
					else 
						$(field).text(getEnrichValueToDispayed(enrField));	
					label.attr('for', enrField.code);
					label.appendTo(formGroup);
					field.appendTo(formGroup);
					
					formGroup.appendTo(div);
					div.appendTo(enrRow);
					
					if(enrField.fileUpld === 'Y')
					{
						var enrDiv = null, enrInnerDiv = null, enrLabel = null, enrAttachRowDiv = null, enrAttachColDiv = null;
						var strUploadedImageName = null;
						
						enrDiv= $('<div>').attr({
							'class' : 'col-sm-6 ',
							'id' : enrField.code + 'AttachmentDiv'
						});
						
						enrInnerDiv = $('<div>').attr({
							'class' : 'form-group ',
							'id' : enrField.code + '_AttachmentInnerDiv'
						});
						
						enrLabel = $('<label>').attr('class', '');
						enrLabel.text('Attachment');
						enrLabel.appendTo(enrInnerDiv);
						
						enrAttachRowDiv= $('<div>').attr({
							'class' : 'row'
						});
						
						enrAttachColDiv= $('<div>').attr({
							'class' : 'col-sm-12'
						});
						
						
						if ($('#poEnrFile_'+enrField.code) && $('#poEnrFile_'+enrField.code)[0] 
						&& $('#poEnrFile_'+enrField.code)[0].files && $('#poEnrFile_'+enrField.code)[0].files[0]) {
							strUploadedImageName = $('#poEnrFile_'+enrField.code)[0].files[0].name;
						}
						if(isEmpty(strUploadedImageName))
							strUploadedImageName = enrField.fileName;
						
						if(!isEmpty(strUploadedImageName))
						{
							var fName = $('<span>').attr('class', 'poEnrFileName_InfoSpan'+enrField.code);
							fName.text(strUploadedImageName).append("&nbsp;");
							fName.prop('title', strUploadedImageName);
							fName.appendTo(enrAttachColDiv);
							
							var fUpldFlag = $('<a>').attr('class', 't7-anchor');
							fUpldFlag.attr('id', 'viewEnrAttachment_' + enrField.code);
							fUpldFlag.attr('data-enrirch_code', enrField.code);
							fUpldFlag.text('View Attachment');
							fUpldFlag.unbind("click");
							fUpldFlag.click(function() {
								var enrcode = $(this).attr('data-enrirch_code');
								downloadEnrAttachment(enrcode);
							});
							fUpldFlag.appendTo(enrAttachColDiv);
						}
						
						enrAttachColDiv.appendTo(enrAttachRowDiv);
						enrAttachRowDiv.appendTo(enrInnerDiv);
						enrInnerDiv.appendTo(enrDiv);
						enrDiv.appendTo(enrRow);
					}
					
					enrRow.appendTo(targetDiv);
					
					intCnt++;
			} else {
				intCnt++;
			}
		}
	}
	return intCnt;
}
/*******************************************************************************
 * PO header entry ends here
 ******************************************************************************/

/*******************************************************************************
 * Line item detail entry start here
 ******************************************************************************/
function doHandleEntryGridLoading(isViewOnly, isGridActionEnabled) {
	if (typeof objLineItemEntryGrid != 'undefined' && objLineItemEntryGrid) {
		objLineItemEntryGrid.refreshData();
	} else {
		loadLineItemFieldsForGridLayout(strHeaderIdentifier);
		doCreateLineItemEntryGrid(lineItemGridRowData,
				chrAllowGridLayoutEntry, isViewOnly, strHeaderIdentifier,
				isGridActionEnabled);
	}
}
/**
 * This method is used to get line item fields to populate grid
 */
function loadLineItemFieldsForGridLayout(headerId, strUrl) {
	var returnData = null;
	if (!isEmpty(headerId)) {
		var url = strUrl || _mapUrl['loadLineItemFieldsUrl'] + "/(" + headerId
				+ ").json";
		$.ajax({
			type : "POST",
			url : url,
			data : {
				'_mode' : 'GRID'
			},
			async : false,
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
			success : function(data) {
				if (data != null) {
					if (data.d
							&& data.d.message
							&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
						paintErrors(data.d.message.errors);

					} else {
						lineItemGridRowData = data;
						strDetailIdentifier=data.d.__metadata._detailId;
						returnData = data;
						blockPOLineItemUI(false);
					}
				}
			}
		});
	}
	return returnData;
}
function getLineItemGrid() {
	var grid = null;
	if (typeof objLineItemEntryGrid != 'undefined' && objLineItemEntryGrid) {
		grid = objLineItemEntryGrid.getGrid();
	}
	return grid;
}
function handleLineItemDetailGridRowAction(grid, rowIndex, columnIndex, action,
		event, record) {
	var strAction = action;
	var  strPaintAction = null, strDivId = null, 
	strButtonMask = null, strRightsMask = null, strActionMask = null;
	var grid = getLineItemGrid();
	if (!isEmpty(strHeaderIdentifier) && !isEmpty(strAction)) {
		doClearMessageSection();
		resetLineItemForm();
		if (strAction === 'btnEdit' && intHdrDirtyBit > 0)
			doUpdatePOHeaderSilent();
		if (strAction === 'btnEdit')
			strPaintAction = 'UPDATE';
		else if (strAction === 'btnView') {
			strDivId = 'addLineItemViewPopup';
			strPaintAction = 'VIEW';
		} else if (strAction === 'btnError') {
			strPaintAction = 'ERROR';
		}

		if (strPaintAction === 'VIEW' || strPaintAction === 'UPDATE') {
			if (strPaintAction === 'VIEW') {
				var instGrid = getLineItemGrid();
				if (instGrid) {
					toggleLineItemPagination(strPaintAction);
					updatePagingParamsView(instGrid.getRowNumber(rowIndex + 1),
							instGrid.store.getCount());
				}
			}
			if (strPaintAction === 'UPDATE') {
				$('.instrumentEditPaginationBar').removeClass('hidden');
				var instGrid = getLineItemGrid();
				if (instGrid) {
					toggleLineItemPagination(strPaintAction);
					updatePagingParamsEdit(instGrid.getRowNumber(rowIndex + 1),
							instGrid.store.getCount());
				}
			}
			getLineItemPopup(strHeaderIdentifier, strPaintAction,
					strDivId,record);
		}
	}
}
function toggleLineItemPagination(strMode) {
	var classSuffix = strMode === 'UPDATE' ? 'Update' : '';
	$('.previousTxn' + classSuffix).unbind('click').bind('click', function() {
				handleLineItemPagination(-1, strMode);
			});
	$('.nextTxn' + classSuffix).unbind('click').bind('click', function() {
				handleLineItemPagination(1, strMode);
			});
}
function updatePagingParamsEdit(intCurrentIndex, intTotalRows) {
	$('.currentPageUpdate').html(intCurrentIndex);
	$('.totalPagesUpdate').html(intTotalRows);
}
function updatePagingParamsView(intCurrentIndex, intTotalRows) {
	$('.currentPage').html(intCurrentIndex);
	$('.totalPages').html(intTotalRows);
}

function handleLineItemPagination(intCount, strMode) {
	var classSuffix = (strMode === 'UPDATE') ? 'Update' : '';
	var intCurrentInst = parseInt($($('.currentPage' + classSuffix)[0]).text(),10);
	var grid = getLineItemGrid();
	var intPgSize = 0;
	var intTotalRecords = 0, intMoveTo = 0, intRecordIndex = 0, intCurrentPage, record, strInstIdentifier, strActionMask = null;
	if (grid) {
		intMoveTo = intCurrentInst + intCount;
		record = grid.getRecord(intMoveTo);

		if (record) {
			if (strHeaderIdentifier) {
				strPaymentInstrumentIde = '';
				doClearMessageSection();
				//blockUI(true);
				if (strMode === 'UPDATE') {
					editPaymentBatchInstrument(strHeaderIdentifier, 'UPDATE');
					updatePagingParamsEdit(intMoveTo, grid.store.getCount());
				} else if (strMode === 'VIEW') {
					viewPaymentBatchInstrument(strHeaderIdentifier, 'VIEW');
					updatePagingParamsView(intMoveTo, grid.store.getCount());
				}
			}
		}

	}
}
function getNoOfLineItemToBeAdded(intGridRecordCnt, intMaxApplicableCount) {
	// TODO : To be handled
	return null;
}

function toggleHeaderDirtyBit(blnApplyDirtyBit) {
	var field = null;
	intHdrDirtyBit = 0;
	if(blnApplyDirtyBit)
	$('#pageContentDiv :text, #pageContentDiv :file, #pageContentDiv :checkbox, #pageContentDiv :radio, #pageContentDiv select, #pageContentDiv textarea')
			.each(function() {
						field = $(this);
						if (field && field.length != 0) {
								field.focus(function dirtyBitFocus() {
									intHdrDirtyBit++;
										// console.log(dirtyBit);
									});
						}
					});
}
function toggleGridLayoutEntryAddRow(canBind) {
	if (canBind) {
		$('#btnAddRow').unbind('click');
		$('#btnAddRow').bind('click', function() {
					if (intHdrDirtyBit > 0)
						var result=doSavePurchaseOrderHeaderSilent();
						if(result && result.success && result.success==="FAILED"){
							var error=true;
						 if(result.errors){
						 	blockPOUI(false);
						 }
						 else{
						                    var arrError = new Array();
											arrError.push({
														"errorCode" : "Message",
														"errorMessage" : mapLbl['unknownErr']
													});
											doHandleUnknownError();
											blockPOUI(false);
						 }
						}
						$(document).trigger("addGridRow");
				});
	} else
		$('#btnAddRow').unbind('click');
}
function doUpdatePOHeader() {
	var jsonData = generatePOHeaderJson(), jsonArgs = {};
	var canSave = validateRequiredPOHeaderFields();
	jsonData.d.poEntry.txnMetaData._headerId = strHeaderIdentifier;
	jsonArgs.action = 'UPDATE';
	savePaymentHeader(jsonData, postHandleSavePaymentHeader, jsonArgs);
}
function doUpdatePOHeaderSilent(blnSilent){
	var jsonData = generatePOHeaderJson(), jsonArgs = {}, isSuccess = false, isSilent = isEmpty(blnSilent)
			? true
			: blnSilent;
	jsonArgs.action = 'UPDATE';
	var strUrl =  _mapUrl['savePOHeaderUrl']+'/'+strHeaderIdentifier+'.json';
	$.ajax({
				url : strUrl,
				type : 'POST',
				contentType : "application/json",
				async : false,
				data : JSON.stringify(jsonData),
				complete : function(XMLHttpRequest, textStatus) {
					if ("error" == textStatus) {
						var arrError = new Array();
						arrError.push({
									"errorCode" : "Message",
									"errorMessage" : mapLbl['unknownErr']
								});
						if (!isSilent)
							paintErrors(arrError);
					}
				},
				success : function(data) {
					var status = null;
					purchaseOrderHeaderData = data;
					if (data.d.poEntry && data.d.poEntry.message
							&& data.d.poEntry.message.success) {
						status = data.d.poEntry.message.success;
						status = status.toUpperCase();
					}
					if (data.d.poEntry && data.d.poEntry.txnMetaData)
						strHeaderIdentifier = data.d.poEntry.txnMetaData._headerId;
					toggleHeaderDirtyBit(false);
					if (!isSilent) {
						if (status === 'SAVEWITHERROR' || status === 'FAILED') {
							if (data.d.poEntry.message.errors)
								paintErrors(data.d.poEntry.message.errors);
							isSuccess = false;
						}
						else {
							doClearMessageSection();
							isSuccess = true;
						}
					}
				}
			});
		return isSuccess;
}
/*******************************************************************************
 * Line item detail entry ends here
 ******************************************************************************/
function paintPOHeaderActions(strAction) {
	var elt = null, btnBack = null, btnCancel = null, btnClose = null;
	$('#poActionButtonListLB, #poActionButtonListRB')
			.empty();
	var strBtnLTLB = '#poActionButtonListLB';
	var strBtnRTRB = '#poActionButtonListRB';
	btnBack = createButton('btnBack', 'S');
	btnBack.click(function() {
				goToPage(_mapUrl['cancelPOUrl'], 'frmMain');
			});
	btnCancel = createButton('btnCancel', 'L');
	btnCancel.click(function() {
				doCancelEditPOHeader();
			});
   if (strAction === 'VIEW') {
		btnBack.appendTo($(strBtnLTLB));
	} else if (strAction === 'SUBMIT') {
		elt = createButton('btnSubmit', 'P');
		elt.click(function(e) {
					e.stopImmediatePropagation();
					doSubmitPOHeader();
				});
		elt.appendTo($(strBtnRTRB));
		btnBack.unbind("click");
		btnBack.click(function() {
			if (objLineItemEntryGrid
							&& objLineItemEntryGrid.isRecordInEditMode()) {
						objLineItemEntryGrid.doHandleRecordSaveOnFocusOut(
								doBackPOVerification(),
								[null]);
					} else
						doBackPOVerification();
				});
		btnBack.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");

		btnClose = createButton('btnClose', 'L');
		btnClose.click(function() {
					goToPage(_mapUrl['cancelPOUrl'], 'frmMain');
				});

		btnClose.appendTo($(strBtnLTLB));
	}
	else if (strAction === 'EDIT') {
		elt = createButton('btnVerify', 'P');
		elt.mousedown(function() {
					if (objLineItemEntryGrid
							&& objLineItemEntryGrid.isRecordInEditMode()) {
								verifyClicked=true;
						objLineItemEntryGrid.doHandleRecordSaveOnFocusOut(
								doUpdatePurchaseOrderHeader, null);
					} else
					doUpdatePurchaseOrderHeader();
				});
		elt.appendTo($(strBtnRTRB));
		btnBack.unbind("click");
		btnBack = createHeaderBackButton(strAction);
		btnBack.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
		btnDiscard = createButton('btnDiscard', 'L');
	    btnDiscard.click(function() {
				getDiscardConfirmationPopup();
			});
		btnDiscard.appendTo($(strBtnLTLB));

	}
	else if (strAction === 'EDITNEXT') {
		elt = createButton('btnVerify', 'P');
		elt.mousedown(function() {
						if (objLineItemEntryGrid
							&& objLineItemEntryGrid.isRecordInEditMode()) {
								verifyClicked=true;
						objLineItemEntryGrid.doHandleRecordSaveOnFocusOut(
								doUpdatePurchaseOrderHeader, null);
					} else
					doUpdatePurchaseOrderHeader();
				});
		elt.appendTo($(strBtnRTRB));
		btnBack.unbind("click");
		btnBack = createHeaderBackButton(strAction);
		btnBack.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");

		elt = createButton('btnDiscard', 'L');
		elt.click(function() {
						getDiscardConfirmationPopup();
				});
		elt.appendTo($(strBtnLTLB));
	} else if (strAction === 'CANCELONLY') {
		btnBack.appendTo($(strBtnLTLB));
	}else if (strAction === 'ADD') {
		elt = createButton('btnVerify', 'P');
		elt.mousedown(function() {
			if (objLineItemEntryGrid
							&& objLineItemEntryGrid.isRecordInEditMode()) {
								verifyClicked=true;
						objLineItemEntryGrid.doHandleRecordSaveOnFocusOut(
								doSavePurchaseOrderHeader, null);
					} else
					doSavePurchaseOrderHeader();
				});
		elt.appendTo($(strBtnRTRB));
		btnBack.unbind("click");
		btnBack = createHeaderBackButton(strAction);
		btnBack.appendTo($(strBtnLTLB));
		btnDiscard = createButton('btnDiscard', 'L');
	    btnDiscard.click(function() {
				getDiscardConfirmationPopup('Q');
			});
		btnBack.appendTo($(strBtnLTLB));
		btnDiscard.appendTo($(strBtnLTLB));
	}
	autoFocusFirstElement();
}
function doUpdateAndNextPOHeader(jsonData, fnCallBack, args){
	var strActionStatus, blnStatusFlag = false;
	var view=$('#viewState').val();
	if (strHeaderIdentifier && strHeaderIdentifier != '') {
		var strUrl =  _mapUrl['savePOHeaderUrl']+'/'+strHeaderIdentifier+'.json';
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
					paintErrors(arrError);
					blockPOUI(false);
				}
			},
			success : function(data) {
				var objResponseData = data;
				/* Upload File */
					var poFile = $('#poFile')[0].files[0];
					var blnIsFileUpld = false;
					var formData = new FormData();
					
					if(poFile != undefined)
					{
						blnIsFileUpld = true;
						formData.append('files', $('#poFile')[0].files[0]);
						formData.append('enrichmentCodes', "FileName");
						formData.append('fileTypes', 'H');
					}
					
					/*$('input[id^=poEnrFile_]').each(function() {
						if(this.files[0] != undefined)
						{
							blnIsFileUpld = true;
							formData.append('files', this.files[0]);
							formData.append('fileTypes', 'E');
						}
					});*/
					
					$('input[id^=poEnr_]').each(function() {
						var enrcode = this.name;
						if ($('#poEnrFile_'+enrcode) && $('#poEnrFile_'+enrcode)[0] 
						&& $('#poEnrFile_'+enrcode)[0].files && $('#poEnrFile_'+enrcode)[0].files[0]) {
							blnIsFileUpld = true;
							formData.append('files', $('#poEnrFile_'+enrcode)[0].files[0]);
							formData.append('enrichmentCodes', enrcode);
							formData.append('fileTypes', 'E');
							
						}
					});
					
					if(blnIsFileUpld)
					{
						//var formData = new FormData();
						//formData.append('file', $('#poFile')[0].files[0]);
						//formData.append('fileName', "FileName");
						$.ajax({
							   url : _mapUrl['loadPOHeaderUrl'] + "/("+ strHeaderIdentifier+")/upload",
							   type : 'POST',
							   data : formData,
							   processData: false,  // tell jQuery not to process the data
							   contentType: false,  // tell jQuery not to set contentType
							   success : function() {
										if (!isEmpty(objResponseData)) {
												purchaseOrderHeaderData=objResponseData;
												fnCallBack(objResponseData,args)
												blockPOUI(false);
											} else if (isEmpty(objResponseData)
													&& objResponseData.d.poEntry.message.errors) {
												doClearMessageSection();
												paintErrors(objResponseData.d.poEntry.message.errors);
												blockPOUI(false);
											}
									
							   },
							   error : function(){
									if (!isEmpty(objResponseData)) {
										purchaseOrderHeaderData=objResponseData;
										fnCallBack(objResponseData,args)
										blockPOUI(false);
									} else if (isEmpty(objResponseData)
											&& objResponseData.d.poEntry.message.errors) {
										doClearMessageSection();
										paintErrors(objResponseData.d.poEntry.message.errors);
										blockPOUI(false);
									}
								}
							
						});
					}					
					else
					{
						if (!isEmpty(objResponseData)) {
							purchaseOrderHeaderData=objResponseData;
							fnCallBack(objResponseData,args)
							blockPOUI(false);
						} else if (isEmpty(objResponseData)
								&& objResponseData.d.poEntry.message.errors) {
							doClearMessageSection();
							paintErrors(objResponseData.d.poEntry.message.errors);
							blockPOUI(false);
						}
					}
				}
			
		});
	}
}
function doBackPOVerification(){
	blockPOUI(true);
	doClearMessageSection();
	$('#verificationStepDiv').addClass('hidden');
	$('#poEntryStep2')
			.removeClass('hidden');

	$('#txnStep1').removeClass('ft-status-bar-li-active')
			.addClass('ft-status-bar-li-done');
	$('#txnStep3').removeClass('ft-status-bar-li-active');
	$('#txnStep2').addClass('ft-status-bar-li-active').removeClass('ft-status-bar-li-done');
	blockPOUI(false);  
	if (objLineItemEntryGrid) {
		$('#poInstActionCt').appendTo($('#poInstActionParentCt'));
		objLineItemEntryGrid.removeAll(true);
		objLineItemEntryGrid.destroy(true);
	}
	objLineItemEntryGrid = null;
	$('#LineItemVerifyGridDiv').children("*")
			.appendTo($('#lineItemEntryGridParentDiv'));
		if(chrAllowGridLayoutEntry ==='Y')
	doHandleEntryGridLoading(false, true);
	paintPOHeaderActions('EDITNEXT');
	blockPOUI(false);
}
function createHeaderBackButton(strAction){
var btnBack = null;
  currentAction=strAction;
	btnBack = createButton('btnBack', 'S');
	if(strAction === 'ADD'){
	  btnBack.click(function() {
	  	if (objLineItemEntryGrid
						&& objLineItemEntryGrid.isRecordInEditMode()) {
					objLineItemEntryGrid.doHandleRecordSaveOnFocusOut(
							doHandleBackClick, [_mapUrl['entryBackUrl'],
									'frmMain',strAction]);
				} else {
					getHeaderBackConfirmationPopup(strAction);
				}
						
					});
	}
	else{
	 btnBack.click(function() {
				goToPage(_mapUrl['cancelPOUrl'], 'frmMain');
			});
	}
	return btnBack;
}
function doHandleBackClick() {
	getHeaderBackConfirmationPopup();
}
function getHeaderBackConfirmationPopup(strAction){
	var _objDialog = $('#backConfirmationPopup');
	if(isEmpty(strAction))
	action=currentAction;
	else
	action=strAction;
	_objDialog.dialog({
				bgiframe : true,
				autoOpen : false,
				modal : true,
				resizable : false,
				width : "320px",
				buttons : [
					    {
					      text: getLabel("btnOk","OK"),
					      click: function() {
								$(this).dialog("close");
								if(action==="ADD")
								goToPage(_mapUrl['entryBackUrl'], 'frmMain');
								else
								goToPage(_mapUrl['cancelPOUrl'], 'frmMain');
					      }
					    },
					    {
						      text: getLabel("btnCancel","Cancel"),
						      click: function() {
									$(this).dialog('destroy');
						      }
					    	
					    }
				          ]
					  			});
	_objDialog.dialog('open');
}
function getDiscardConfirmationPopup(strAction) {
	_objDialog = $('#discardConfirmationPopup');
	_objDialog.dialog({
				bgiframe : true,
				autoOpen : false,
				modal : true,
				resizable : false,
				draggable : false,
				width : "320px",
				buttons : [
				    {
				      text: getLabel("btnOk","OK"),
				      click: function() {
							$(this).dialog("close");
							if ('Q' === strAction)
								discardPurchaseOrderEntry(strAction);
							else
								doHandlePOHeaderActions('discard', true);
				      }
				    },
				    {
					      text: getLabel("btnCancel","Cancel"),
					      click: function() {
								$(this).dialog('destroy');
					      }
				    	
				    }
				   ]
	                });
	_objDialog.dialog('open');
};
function discardPurchaseOrderEntry(strAction){
	if(strAction==="Q"){
	goToPage(_mapUrl['cancelPOUrl'], 'frmMain');
	}
}
function paintPOHeaderStandardFields(data){
	var arrFields = [];
	var strDisplayMode = null, divId = null, fieldId = null, lblId = null, cfgAccountNo = {};
	var clsHide = 'hidden';
	var apply = true;
	if (data) {
		arrFields = data;
		if (arrFields && arrFields.length > 0) {
			$.each(arrFields, function(index, cfg) {
				fieldId = cfg.fieldName+'Hdr';
				if (apply) {
					strDisplayMode = cfg.displayMode;
					divId = fieldId + 'HdrDiv';
					lblId = fieldId + 'HdrLbl';
					if (!isEmpty(strDisplayMode)) {
						handleDisplayMode(strDisplayMode, fieldId);
					}
					if(cfg.code=="poCurrencyCode"){
					$("#poCurrencyCodeHdr").val(cfg.value);
					}
					if(cfg.code=="fileName"){
						if(!isEmpty(cfg.value)){
						var strUploadedImageName =cfg.value;
						$(".fileName_InfoSpan").text(strUploadedImageName);
						$('#inoviceFileRemoveLink').removeClass('hidden');
						$('#invoiceFileUploadFlagHdr').addClass('hidden');
						$("#fileNameHdr").val(strUploadedImageName);
						$('.fileName_InfoSpan').prop('title',strUploadedImageName);
						isFileUploaded=true;
						}
					}
					handlePOHeaderFieldPopulation(cfg);
				}
			});
		}
	}
}
function handlePOHeaderFieldPopulation(cfg){
	var dataType = cfg.dataType, defValue = cfg.value, fieldId = cfg.fieldName, blnReadOnly = cfg.readOnly;
	fieldId += 'Hdr';
	var field = $('#' + fieldId);
	var isReadonly = (!isEmpty(blnReadOnly) && blnReadOnly == 'true')
			? true
			: false;
	if (dataType) {
		switch (dataType) {
			case 'text' :
				populateTextFieldValue(fieldId, defValue);
				break;
			case 'seek' :
				populateSeekFieldValue(fieldId, defValue);
				break;
			case 'date' :
				populateDateFieldValue(fieldId, defValue);
				break;
			case 'amount' :
				populateAmountFieldValue(fieldId, defValue,cfg.poCurrencyCode,"poCurrencyCodeHdr");
				break;
		}
	}

	if (field && field.length != 0 && !isEmpty(blnReadOnly)
			&& blnReadOnly == 'true') {
		if (dataType === 'select' && !isEmpty(defValue))
			field.attr('disabled', 'disabled');
		else
			field.attr('readonly', isReadonly);
	}

}
function paintPOHdrEnrichments(data){
	var isVisible = false, clsHide = 'hidden', intCounter = 1, strTargetId = 'additionalInfoBody';
	$('#additionalInfoBody').empty();
	if (data && data.poEnrichments) {
		intCounter = poHeaderEnrichmentsHelper(
				data.poEnrichments, intCounter, strTargetId);
		isVisible = true;
	}
	if(data.poEnrichments.length!=0)
	$('#additioninfoDiv').removeClass(clsHide);
	if (isVisible) {
		if (intCounter >= 2)
			$('<div>').attr('class', 'clear')
					.appendTo($('#additionalInfoBody'));
	}
}
function poHeaderEnrichmentsHelper(arrPrdEnr, intCounter,
		strTargetId) {
	var field = null, targetDiv = $('#' + strTargetId), label = null, span = null, div = null, innerDiv = null, intCnt = 1, minCounter, maxCounter, arrLength;
	var divRow = null, fName = null, fUpldFlag = null, fRemLink = null, enrFile = null, filePresent = null;
	var div1=null, dateDiv=null,dateIcon=null,dateOuterDiv=null;
	var minCounter,maxCounter;
	if (!isEmpty(intCounter))
		intCnt = intCounter;
	if (arrPrdEnr && arrPrdEnr.length > 0) {
		sortArrPrdEnr = generateSortArrPrdEnr(arrPrdEnr);
		arrLength = sortArrPrdEnr.length;
		minCounter = sortArrPrdEnr[0].seq;
		maxCounter = sortArrPrdEnr[arrLength - 1].seq;
		for (var i = minCounter; i <=maxCounter; i++) {
			var enrField = null;
			enrField = getEnrField(arrPrdEnr, i);
			if(enrField){
			var strAdditionalHelperCls = (!isEmpty(enrField.dataType)
								&& (enrField.dataType === 'C'
								|| enrField.dataType === 'R'))
								? 'smallEnrichDiv'
								: '';	
			if (!isEmpty(enrField) && enrField != null) {
					divRow = $('<div>').attr({
						'class' : 'row'
					});
					
					div= $('<div>').attr({
								'class' : 'col-sm-6 ' + strAdditionalHelperCls,
								'id' : enrField.code + 'Div'
							});
					dateOuterDiv=$('<div>').attr({
								'class' : 'input-daterange'
							});
					dateDiv=	$('<div>').attr({
								'class':'input-group-addon has-icon'
							});
					dateIcon=$('<i>').attr({
					'class':'fa fa-calendar'
					});
					innerDiv = $('<div>').attr({
								'class' : 'form-group ',
								'id' : enrField.code + '_InnerDiv'
							});
					label = $('<label>').attr('class', '');
					label.text(enrField.label);
					field = createEnrichMentField(enrField);
					if (enrField.enableDisable != null) {
						if (enrField.enableDisable == 'disable') {
							field.attr('disabled', true);
						} else if (enrField.enableDisable == 'enable') {
							field.attr('disabled', false);
						}
					}
					if(!isEmpty(enrField.dataType) && enrField.dataType !== 'C' && enrField.dataType !== 'R')
								field.addClass('form-control');
					if (field) {
						field.attr('id', 'poEnr_' + enrField.code);
						label.attr('for', enrField.code);
						if (enrField.displayMode == "3")
							label.addClass('required');
						label.appendTo(innerDiv);
						
						if(enrField.dataType=="D"){
						field.appendTo(dateOuterDiv);
						dateIcon.appendTo(dateDiv);
						dateDiv.appendTo(dateOuterDiv);
						dateOuterDiv.appendTo(innerDiv);
						field.addClass('inputDateForEnrichment');
						}
						else
						field.appendTo(innerDiv);
						
						innerDiv.appendTo(div);
                        div.appendTo(divRow);
						intCnt++;
					}
					
					if(enrField.fileUpld === 'Y')
					{
						var enrDiv = null, enrInnerDiv = null, enrLabel = null, enrAttachRowDiv = null, enrAttachColDiv = null;
						
						enrDiv= $('<div>').attr({
							'class' : 'col-sm-6 ',
							'id' : enrField.code + 'AttachmentDiv'
						});
						
						enrInnerDiv = $('<div>').attr({
							'class' : 'form-group ',
							'id' : enrField.code + '_AttachmentInnerDiv'
						});
						
						enrLabel = $('<label>').attr('class', '');
						enrLabel.text('Attachment');
						enrLabel.appendTo(enrInnerDiv);
						
						enrAttachRowDiv= $('<div>').attr({
							'class' : 'row'
						});
						
						enrAttachColDiv= $('<div>').attr({
							'class' : 'col-sm-12'
						});
						
						
						fName = $('<span>').attr('class', 'poEnrFileName_InfoSpan'+enrField.code);
						fName.text('');
						fName.appendTo(enrAttachColDiv);
						
						fUpldFlag = $('<a>').attr('class', 't7-anchor');
						fUpldFlag.attr('style', 'font-style: italic');
						fUpldFlag.attr('id', 'poEnrFileUploadFlag_' + enrField.code);
						fUpldFlag.attr('data-enrirch_code', enrField.code);
						fUpldFlag.text('Upload Attachment');
						fUpldFlag.unbind("click");
						fUpldFlag.click(function() {
							var enrcode = $(this).attr('data-enrirch_code');
							showUploadEnrDialog(enrcode);
						});
						fUpldFlag.appendTo(enrAttachColDiv);
						
						fRemLink = $('<a>').attr('class', 't7-anchor hidden');
						fRemLink.attr('style', 'font-style: italic');
						fRemLink.attr('id', 'poEnrFileRemoveLink_' + enrField.code);
						fRemLink.attr('data-enrirch_code', enrField.code);
						fRemLink.text('Remove ');
						fRemLink.unbind("click");
						fRemLink.click(function() {
							var enrcode = $(this).attr('data-enrirch_code');
							removeEnrUploadedImage(enrcode);
						});
						fRemLink.appendTo(enrAttachColDiv);
						
						enrFile = $('<input>').attr({
							'id' : 'poEnrFile_'+enrField.code,
							'data-enrirch_code': enrField.code,
							'type' : 'file',
							'class' : 'hidden'
						});
						enrFile.change(function() {
							var enrcode = $(this).attr('data-enrirch_code');
							updateEnrFileName(enrcode);
						});
						enrFile.appendTo(enrAttachColDiv);
						
						filePresent = $('<input>').attr({
							'id' : 'fileUpldPresentFlag_'+enrField.code,
							'type' : 'hidden'
						});
						filePresent.appendTo(enrAttachColDiv);
												
						
						if(enrField.fileName != null && !isEmpty(enrField.fileName)){
							var viewAttach = $('<a>').attr('class', 't7-anchor');
							viewAttach.attr('id', 'viewEnrAttachment_' + enrField.code);
							viewAttach.attr('data-enrirch_code', enrField.code);
							viewAttach.text('View Attachment');
							viewAttach.unbind("click");
							viewAttach.click(function() {
								var enrcode = $(this).attr('data-enrirch_code');
								downloadEnrAttachment(enrcode);
							});
							viewAttach.appendTo(enrAttachColDiv);
						}
						
						enrAttachColDiv.appendTo(enrAttachRowDiv);
						enrAttachRowDiv.appendTo(enrInnerDiv);
						
						enrInnerDiv.appendTo(enrDiv);
						
						enrDiv.appendTo(divRow);
						
					}
					
					divRow.appendTo(targetDiv);
					if ((enrField.dataType == "T" || enrField.dataType=="N") && (enrField.availableValues.length!=0))
                        {
							$('#poEnr_' + enrField.code).niceSelect();
                        }
					if(enrField.fileName != null && !isEmpty(enrField.fileName)){
						var strUploadedImageName =enrField.fileName;
						$('.poEnrFileName_InfoSpan'+enrField.code).text(strUploadedImageName).append("&nbsp;");
						$('#poEnrFileRemoveLink_'+enrField.code).removeClass('hidden');
						$('#poEnrFileUploadFlag_'+enrField.code).addClass('hidden');
//							$("#fileNameHdr").val(strUploadedImageName);
						$('.poEnrFileName_InfoSpan'+enrField.code).prop('title',strUploadedImageName);
//							isFileUploaded=true;
					}					
					
			} else {
				div = $('<div>').attr({
							'class' : 'col-sm-6 emptyEnrichDiv'
						});
				div.appendTo(targetDiv);
				intCnt++;
			}
		}
		}
	}
	return intCnt;	
}

function showUploadEnrDialog(code) {
	$('#poEnrFile_'+code).trigger('click');
}
function removeEnrUploadedImage(code) {
	var control = $('#poEnrFile_'+code);
	control.replaceWith(control = control.clone(true));
	$('#poEnrFileRemoveLink_'+code).addClass('hidden');
	$('#poEnrFileUploadFlag_'+code).removeClass('hidden');
//	$(".fileName_InfoSpan").text('No File Uploaded');
	$(".poEnrFileName_InfoSpan"+code).text('');
//	$("#fileNameHdr").val("");
	$('.poEnrFileName_InfoSpan'+code).prop('title', '');
	$('#viewEnrAttachment_'+code).addClass('hidden');
//    removeFlag='Y';
//	isFileUploaded=false;
	$('#fileUpldPresentFlag_'+code).val('N');
	
}
function updateEnrFileName(code) {
	var control = $('#poEnrFile_'+code);
	if ($('#poEnrFile_'+code) && $('#poEnrFile_'+code)[0]
			&& $('#poEnrFile_'+code)[0].files && $('#poEnrFile_'+code)[0].files[0]) {
		var strUploadedImageName = $('#poEnrFile_'+code)[0].files[0].name;
		$(".poEnrFileName_InfoSpan"+code).text(strUploadedImageName).append("&nbsp;");
		$('#poEnrFileRemoveLink_'+code).removeClass('hidden');
		$('#poEnrFileUploadFlag_'+code).addClass('hidden');
//		$("#fileNameHdr").val(strUploadedImageName);
		$('.poEnrFileName_InfoSpan'+code).prop('title',strUploadedImageName);
//		isFileUploaded=true;
//		 removeFlag='N';
		$('#fileUpldPresentFlag_'+code).val('Y');
	}
}

function downloadEnrAttachment(enrcode){
	var strUrl=_mapUrl['loadPOHeaderUrl'] + "/("+ strHeaderIdentifier+")/enrichmentdownload";
	var frm = document.getElementById("frmMain");
	strUrl += '?$enrichCode=' + enrcode;
	frm.action = strUrl;
	frm.target = "hWinSeek";
	frm.method = "POST";
	frm.submit();
	frm.target = "";
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
		}
	});
}
function validateRequiredPOHeaderFields(){
	 var failedFields = 0, field = null, fieldId = null, tmpValid = true;
	$('#poEntryStep2A label.required').each(function() {
				tmpValid = true;
				fieldId = $(this).attr('for');
				field = $('#' + fieldId);
				if (!isEmpty(field) && !isEmpty(fieldId) && field.length != 0) {
					tmpValid = markRequired(field);
					if (tmpValid == false)
						failedFields++;
				}
			});
	return (failedFields == 0);
}
function savePOHeader(jsonData, fnCallback, args){
	var strUrl = _mapUrl['savePOHeaderUrl']+'/'+strHeaderIdentifier+'.json';
	var arrErrors=new Array();
	var isSilent=args.isSilent;
	blockPOUI(true);
	$.ajax({
				url : strUrl,
				type : 'POST',
				async : false,
				contentType : "application/json",
				data : JSON.stringify(jsonData),
				complete : function(XMLHttpRequest, textStatus) {
					if ("error" == textStatus) {
						var arrError = new Array();
						arrError.push({
									"errorCode" : "Message",
									"errorMessage" : mapLbl['unknownErr']
								});
						paintErrors(arrError);
						blockPOUI(false);
						autoFocusFirstElement();
					}
				},
				success : function(data) {
					if(data && data.d && data.d.poEntry && data.d.poEntry.message &&
					data.d.poEntry.message.success==="FAILED"){
						if(isSilent){
								    arrErrors=data.d.poEntry.message;
						}
						else{
							   doClearMessageSection();
							   if(data && data.d && data.d.poEntry
							   && data.d.poEntry.message &&
							   data.d.poEntry.message.errors)
					           paintErrors(data.d.poEntry.message.errors);
								blockPOUI(false);
						}
					}else{
					purchaseOrderHeaderData = data;
					strHeaderIdentifier = data.d.poEntry.txnMetaData._headerId;
					/* Upload File */
					var poFile = $('#poFile')[0].files[0];
					var blnIsFileUpld = false;
					var formData = new FormData();
					
					if(poFile != undefined)
					{
						blnIsFileUpld = true;
						formData.append('files', $('#poFile')[0].files[0]);
						formData.append('enrichmentCodes', '');
						formData.append('fileTypes', 'H');
					}
					
					$('input[id^=poEnr_]').each(function() {
						var enrcode = this.name;
						if ($('#poEnrFile_'+enrcode) && $('#poEnrFile_'+enrcode)[0] 
						&& $('#poEnrFile_'+enrcode)[0].files && $('#poEnrFile_'+enrcode)[0].files[0]) {
							blnIsFileUpld = true;
							formData.append('files', $('#poEnrFile_'+enrcode)[0].files[0]);
							formData.append('enrichmentCodes', enrcode);
							formData.append('fileTypes', 'E');
							
						}
					});
					
					/*$('input[id^=poEnrFile_]').each(function() {
						if(this.files[0] != undefined)
						{
							blnIsFileUpld = true;
							formData.append('files', this.files[0]);
							formData.append('fileTypes', 'E');
						}
						
					});*/
					
					if(blnIsFileUpld)
					{
						//var formData = new FormData();
						//formData.append('file', $('#poFile')[0].files[0]);
						//formData.append('fileName', "FileName");
						$.ajax({
							   url : _mapUrl['loadPOHeaderUrl'] + "/("+ strHeaderIdentifier+")/upload",
							   type : 'POST',
							   data : formData,
							   processData: false,  // tell jQuery not to process the data
							   contentType: false,  // tell jQuery not to set contentType
							   success : function() {
								    fnCallback(data, args);
									autoFocusFirstElement();
							   },
							   error : function(){
									fnCallback(data, args);
									autoFocusFirstElement();
							   }
						});
					}					
					else
					{
						fnCallback(data, args);
						autoFocusFirstElement();
				 	}
				 	blockPOUI(false);
				 }
				}
			});
			return arrErrors;
}
function generatePOHeaderJson(){
	var jsonPost = {}, jsonArrStdFields = [], jsonField = null;
	data = cloneObject(purchaseOrderHeaderData), field = null, canAdd = false, objVal = null, isLinkageAdded = false, blnAutoNumeric=true ;
	var arrFields = [], clsHide = 'hidden', strFieldName = null;
	if (data) {
		jsonPost = cloneObject(data);
		delete jsonPost['d']['poEntry']['message'];
		if (data && data.d && data.d.poEntry) {
			if (data.d.poEntry.standardField)
				arrFields = data.d.poEntry.standardField;
			// ============= Standard Field Node population =============
			$.each(arrFields, function(index, cfg) {
				canAdd = true;
				strFieldName = cfg.fieldName + 'Hdr';
				field = $('#' + strFieldName);
				if (field && field.length != 0) {
					 if (cfg.displayMode === '1')
						canAdd = false;

					if (canAdd) {
						objVal = null;
							// jquery autoNumeric formatting
						 if(strFieldName==='dealerVendorDescriptionHdr'){
						     objVal=field.val();
						     if(isEmpty(objVal)){
						     $('#dealerVendorCodeHdr').val("");
						     }
							}
							if( strFieldName === 'poAmountHdr' )
							{
								blnAutoNumeric = isAutoNumericApplied(strFieldName);
								if (blnAutoNumeric)
									objVal = $("#poAmountHdr").autoNumeric('get');
								else
									objVal = $("#poAmountHdr").val();
							}
							else if( strFieldName === 'poDateHdr'){
						    var dateval=$("#poDateHdr").val();
								objVal=dateval;
							}
							else if( strFieldName === 'fileNameHdr'){
						    var fname=$("#fileNameHdr").val();
						     objVal=fname;	
							}
							else if(strFieldName==='fileRemoveFlagHdr'){
						     objVal=removeFlag;
							}
							else
							{
								objVal = field.val();
							}
							jsonField = cloneObject(cfg);
							jsonField.value = objVal;
							jsonArrStdFields.push(jsonField);
					}
				}
			});
			jsonPost.d.poEntry.standardField = jsonArrStdFields;
			// ============= Enrichment Info Node population =============
			if (data.d.poEntry.enrichments) {
				arrFields = [];
				if (data.d.poEntry.enrichments.poEnrichments) {
					arrFields = data.d.poEntry.enrichments.poEnrichments;
					jsonPost.d.poEntry.enrichments.poEnrichments = getHeaderEnrichFieldJsonArray(
							arrFields, 'poEnr_');
				}

			}
		}
	}
	return jsonPost;
}
function getHeaderEnrichFieldJsonArray(arrFields, strPrefix){
 var field = null, canAdd = false, fieldName = null, jsonField = null;
	var arrRet = new Array();
	if (arrFields && arrFields.length > 0)
		$.each(arrFields, function(index, cfg) {
					jsonField = cloneObject(cfg);
					canAdd = true;
					fieldName = strPrefix + (cfg.fieldName || cfg.code);
					field = $('#' + fieldName);
					if (field && field.length != 0) {
						
						if ($('#fileUpldPresentFlag_'+cfg.code) && !isEmpty($('#fileUpldPresentFlag_'+cfg.code).val())) {
							jsonField.fileUpldPresentFlag = $('#fileUpldPresentFlag_'+cfg.code).val();
						}
						
						if (cfg.dataType === 'R') {
							var value = $("input[type='radio'][name="+"poEnr_"+cfg.code+"]:checked").val();
							if(!isEmpty(value))
							jsonField.value = value;
							arrRet.push(jsonField);
						} else if (cfg.dataType === 'C') {
							var checkValue = 'N';
							jsonField.value = checkValue;
							var c = $('input[id=' + "poEnr_"+cfg.code + ']')
									.is(':checked');
							if (c) {
								checkValue = 'Y';
							    jsonField.value=checkValue;
							}
							arrRet.push(jsonField);
						} else if (cfg.dataType === 'T' ) {
							var tvalue = isEmpty($(field).val()) ? $(field)
									.attr('editableValue') : $(field).val();
						    jsonField.value=tvalue;
							arrRet.push(jsonField);
						}
						else if(cfg.dataType === 'A'){
							var blnAutoNumeric = isAutoNumericApplied(fieldName);
							if (blnAutoNumeric)
								objVal = field.autoNumeric('get');
							else
								objVal = field.val();
						    jsonField.value=objVal;
							arrRet.push(jsonField);
						}
						else
						if (canAdd) {
							jsonField.value = field.val();
							arrRet.push(jsonField);
						}
					}
				});
	return arrRet;
}

function isAutoNumericApplied(strId) {
	var isAutoNumericApplied = false;
	$.each(($('#'+strId).data('events')||[]), function(i, event) {
				if (isAutoNumericApplied === true)
					return false;
				$.each(event, function(i, eventHandler) {
							if (eventHandler.namespace === 'autoNumeric')
								isAutoNumericApplied = true;
							return false;
						});
			});
	return isAutoNumericApplied;
}
 function paintPOHeaderActionsForView(){
	var elt = null, btnBack = null, btnDiscard = null, btnSubmit = null, btnDisable = null, btnEnable = null;
	$('#poActionButtonListLB, #poActionButtonListRB')
			.empty();
	var strBtnLTLB = '#poActionButtonListLB';
	var strBtnRTRB = '#poActionButtonListRB';
	btnBack = createButton('btnBack', 'S');
	btnBack.click(function() {
				goToPage(_mapUrl['cancelPOUrl'], 'frmMain');
			});

	btnDiscard = createButton('btnDiscard', 'P');
	btnDiscard.click(function() {
				getDiscardConfirmationPopup();
			});

	if (strAction === 'SUBMIT') {
		btnDiscard.appendTo($(strBtnRTRB));
		btnSubmit = createButton('btnSubmit', 'P');
		btnSubmit.click(function(e) {
					e.stopImmediatePropagation();
					doHandlePOHeaderActions('submit');
				});
		btnSubmit.appendTo($(strBtnRTRB));

		btnBack.appendTo($(strBtnLTLB));
	} else if (strAction === 'CANCELANDDISCARD') {
		btnDiscard.appendTo($(strBtnRTRB));
		btnBack.appendTo($(strBtnLTLB));
	} else if (strAction === 'CANCELDISABLE') {
		btnDisable = createButton('btnDisable', 'P');
		btnDisable.click(function() {
					doHandlePOHeaderActions('disable');
				});
		btnDisable.appendTo($(strBtnRTRB));

		btnBack.appendTo($(strBtnLTLB));
	} else if (strAction === 'CANCELENABLE') {
		btnEnable = createButton('btnEnable', 'P');
		btnEnable.click(function() {
					doHandlePOHeaderActions('enable');
				});
		btnEnable.appendTo($(strBtnRTRB));

		btnBack.appendTo($(strBtnLTLB));
	} else if (strAction === 'CANCELONLY') {
		btnBack.appendTo($(strBtnLTLB));
	}
}
function doHandlePOHeaderActions(strAction) {
	var arrayJson = new Array(), strMsg = '';
	var strUrl=_mapUrl['actionUrl']+strAction+'.json'
	arrayJson.push({
				serialNo : 0,
				identifier : strHeaderIdentifier,
				userMessage :''
			});
	Ext.Ajax.request({
		url : strUrl,
		type : "POST",
		async : false,
		jsonData : Ext.encode(arrayJson),
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
		success : function(jsonData) {
			var jsonRes = Ext.JSON.decode(jsonData.responseText);
	        if (jsonRes) {
	        	var arrResult=jsonRes;
	        	 if (arrResult && arrResult.length == 1) {
					if (arrResult[0].success === 'Y') {
						goToPage(_mapUrl['poCenterUrl'], 'frmMain');
					} 
	            }else if (arrResult[0].success === 'N') {
	               if (arrResult[0].errors) {
	                            doClearMessageSection();
								paintErrors(arrResult[0].errors);
								blockPOUI(false);
	               }
	            }
	        }
	       
		},
		failure : function() {
			var arrError = new Array();
			arrError.push({
						"errorCode" : "Message",
						"errorMessage" :mapLbl['unknownErr']
					});
			paintErrors(arrError);
		}
	});
}
function validateRequiredPOFields() {
	var failedFields = 0, field = null, fieldId = null, tmpValid = true;
	$('#poEntryStep2A label.required').each(function() {
				tmpValid = true;
				fieldId = $(this).attr('for');
				field = $('#' + fieldId);
				if (!isEmpty(field) && !isEmpty(fieldId) && field.length != 0) {
					tmpValid = markRequired(field);
					if (tmpValid == false)
						failedFields++;
				}
			});
	return (failedFields == 0);
}
function doPostHandleUpdateAndNextPOHeader(){
	doClearMessageSection();
	$('#txnStep1,#txnStep2').removeClass('ft-status-bar-li-active')
			.addClass('ft-status-bar-li-done');
	$('#txnStep3').addClass('ft-status-bar-li-active').removeClass('ft-status-bar-li-done');
	$('#verificationStepDiv').removeClass('hidden');
	$('#poEntryStep2').addClass('hidden');
	paintPOHeaderActions('SUBMIT');
	populatePOHeaderVerifyScreen(purchaseOrderHeaderData);
	if (data.d
			&& purchaseOrderHeaderData.d.poEntry
			&& purchaseOrderHeaderData.d.poEntry.message
			&& (purchaseOrderHeaderData.d.poEntry.message.errors && purchaseOrderHeaderData.d.poEntry.message.success === 'SUCCESS')) {
		paintErrors(purchaseOrderHeaderData.d.poEntry.message.errors);
	}

}
function populatePOHeaderVerifyScreen(data){
	var arrStdFields = data && data.d && data.d.poEntry
			&& data.d.poEntry.standardField
			? data.d.poEntry.standardField
			: null;
	var strFieldName = null, strValue = null, mapFields = {}, strPostFix = '_HdrInfo' ;
	if (arrStdFields) {
		$.each(arrStdFields, function(index, cfg) {
			strFieldName = cfg.fieldName;
			strValue = getValueToDispayed(cfg);
			strValue = !isEmpty(strValue) ? strValue : '';
			ctrl = $('.' + strFieldName + strPostFix);
			ctrlDiv = $('.' + strFieldName + strPostFix + 'Div');
			if (ctrl && ctrlDiv && ctrlDiv.hasClass('hidden'))
				ctrlDiv.removeClass('hidden');
				ctrl.html(strValue || '');
		});
	}
	if (data && data.d && data.d.poEntry
			&& data.d.poEntry.enrichments) {
		paintPOHdrViewOnlyEnrichments(data);
	}
	if(chrAllowGridLayoutEntry ==="Y"){
	$('#lineItemEntryGridParentDiv').children("*")
			.appendTo($('#LineItemVerifyGridDiv'));
	if (objLineItemEntryGrid) {
		$('#poInstActionCt').appendTo($('#poInstActionParentCt'));
		objLineItemEntryGrid.removeAll(true);
		objLineItemEntryGrid.destroy(true);
	}
	objLineItemEntryGrid = null;
	if(chrAllowGridLayoutEntry ==='Y')
	doHandleEntryGridLoading(true, false);
	}
	toggleContainerVisibility('verificationStepDiv');
}
function paintPOHdrViewOnlyEnrichments(data){
var isVisible = false, clsHide = 'hidden', intCounter = 1, strTargetId = 'additionalHdrInfoBody';
	$('#' + strTargetId).empty();
	if (data.d.poEntry && data.d.poEntry.enrichments && data.d.poEntry.enrichments.poEnrichments) {
		intCounter = paintPOHeaderViewOnlyEnrichmentsHelper(
				data.d.poEntry.enrichments.poEnrichments, intCounter, strTargetId);
		isVisible = true;
	}
	if (isVisible) {
		$('.' + strTargetId).removeClass(clsHide);
		$('#additionalHdrInfoBody').removeClass(clsHide);
	}
}
function doSubmitPOHeader() {
	var strUrl = _mapUrl['submitPOUrl'];
	if (isEmpty(strUrl))
		return false;
	var arrayJson = new Array();
	arrayJson.push({
								serialNo : 1,
								identifier : strHeaderIdentifier,
								userMessage : '',
								selectedClient:enteredByClient
							});
	blockPOUI(true);
	$.ajax({
		url : strUrl,
		type : 'POST',
		contentType : "application/json",
		data : JSON.stringify(arrayJson),
		complete : function(XMLHttpRequest, textStatus) {
			if ("error" == textStatus) {
				var arrError = new Array();
				arrError.push({
							"errorCode" : "Message",
							"errorMessage" : mapLbl['unknownErr']
						});
				paintErrors(arrError);
				blockPOUI(false);
			}
		},
		success : function(data) {
				var arrResult = data;
				var isError = false;
				if (arrResult && arrResult.length == 1) {
					if (arrResult[0].success === 'Y') {
						goToPage(_mapUrl['poCenterUrl'], 'frmMain');
					} else if (arrResult[0].success === 'N') {
						if (arrResult[0].errors) {
								doClearMessageSection();
								blockPOUI(false);
								var arrError = arrResult[0].errors, isProductCutOff = false, errCode = null;

								doClearMessageSection();
								paintErrors(arrResult[0].errors);
								blockPOUI(false);
							}
					} else if (arrResult[0].success === 'W02') {
						doClearMessageSection();
						var arrError = new Array();
						arrError.push({
							"errorCode" : "",
							"errorMessage" : getLabel('poSubmitMsg', 'PO submitted')
						});
						paintErrors(arrError);
						blockPOUI(false);
					}
				}
			
		}
	});

}

function uploadPoFile()
{
	var formData = new FormData();
	formData.append('file', $('#poFile')[0].files[0]);
	formData.append('fileName', "FileName");
	$.ajax({
	       url : _mapUrl['loadPOHeaderUrl'] + "/("+ strHeaderIdentifier+")/upload",
	       type : 'POST',
	       data : formData,
	       processData: false,  // tell jQuery not to process the data
	       contentType: false,  // tell jQuery not to set contentType
	       success : function(data) {
	           // Handle File Upload Success
	       }
	});
}

function doShowAddedLineItem(strIde, strAction, record){
	blockPOLineItemUI(true);
	if (strAction === 'UPDATE') {
		resetLineItemForm();
		editPOLineItem(strIde, strAction,record);
	}
	if (strAction === 'VIEW') {
		viewPOLineItem(strIde, strAction, record);
	}
}
function editPOLineItem(strIde, strAction,record){
 paintPOLineItemActions(strAction,false,record);
 $('#addLineItemPopupTitleSpan').text(getLabel("titleEditPO","Edit Purchase Order")+" >");
 var data=record.data;
 var fieldsLength=lineItemGridRowData.d.poEntry.standardField.length;
 var field=lineItemGridRowData.d.poEntry.standardField;
 var metaData=lineItemGridRowData.d.poEntry.__metadata;
  populatePOLineItemSection(lineItemGridRowData,field,strAction)
 for(i=0;i<fieldsLength;i++){
  var fieldCode=field[i].fieldName;
  var fieldValueName=fieldCode+'_stdField';
  var fieldValue=data[fieldValueName];
  if(!isEmpty(fieldValue))
  {
  	if(fieldCode==="lineAmount")
  	$("#lineAmount").autoNumeric('set',fieldValue);
  	else
    $('#'+fieldCode).val(fieldValue);
  }
 }
  blockPOLineItemUI(false);
  niceSelectUpdate();
}
function getSelectValueToSet(arr,val){
for(i=0;i<arr.length;i++){
if(val===arr[i].code)
var value=arr[i].description;
}
return value;
}
function viewPOLineItem(strIde, strAction, record){
	 paintPOLineItemActions(strAction,false,record);
	 var data=record.data;
	 var fieldsLength=lineItemGridRowData.d.poEntry.standardField.length;
	 var field=lineItemGridRowData.d.poEntry.standardField;
	 $.each(field, function( index, value ) {
       var fieldName=value.code+'_stdField';
        $('#'+fieldName).empty();
       if(fieldName==="lineAmount_stdField")
       {
        var obj = $('<input type="text">');
		obj.autoNumeric('init');
		obj.autoNumeric('set',data[fieldName]);
		strValue = obj.val();
		obj.remove();
		 $('#'+fieldName).text(strValue);
       }
       else
        if(fieldName==="lineCode_stdField")
       {
        var objVal=getSelectValueToSet(value.availableValues,data[fieldName]);
		 $('#'+fieldName).text(objVal);
       }
       else
       if(fieldName==="rate_stdField"){
       var ccySymbol=data['amountCurrencySymbol_stdField'];
       var val=data[fieldName];
       if(!isEmpty(val)){
        var objVal=ccySymbol+''+val;
        $('#'+fieldName).text(objVal);
        }
       }
       else
        $('#'+fieldName).text(data[fieldName]);
       });
 blockPOLineItemUI(false);
}
function doShowInstrumentForm(strAction){
	resetLineItemForm();
	$('#addLineItemPopupTitleSpan').text(getLabel("titleCreatePO","Create Purchase Order")+" >");
	blockPOLineItemUI(true);
	var reponseData=loadLineItemFieldsForGridLayout(strHeaderIdentifier);
	if (reponseData != null) {
					if (reponseData.d
							&& reponseData.d.message
							&& (reponseData.d.message.errors || reponseData.d.message.success === 'FAILED')) {
								var error=true;
						closeTransactionWizardPopup(strAction,error);
						paintErrors(reponseData.d.message.errors);
					} else {
						purchaseOrderLineItemData = reponseData;
						doRemoveStaticText("addLineItemPopup");
						initateValidation();
						var blnFlag =true
							var isBtnVisible = true;
						paintPOLineItemActions('ADD', isBtnVisible);
						populatePOLineItemSection(
								purchaseOrderLineItemData,
								reponseData.d.poEntry.standardField,
								'EDIT');
						toggleContainerVisibility('addLineItemPopup');
					}
				}
	
}
function niceSelectUpdate(){
                   $('#lineCode').niceSelect("update");
					$('#quantityUom').niceSelect("update");
					$('#rateUom').niceSelect("update");
					$('#countryOfOrigin').niceSelect("update");
}
function populatePOLineItemSection(data,standardField,action){
	var i=0;
		$('#detailSerialNumber').val('0');
		$('#quantity, #rate, #lineFactor').OnlyNumbers();
		$('#lineCode, #quantityUom, #rateUom, #countryOfOrigin').empty();
	for(i=0;i<standardField.length;i++){
		if(standardField[i].code==="lineCode"){
			if(standardField[i] && standardField[i].availableValues){
		     var arrOptions=standardField[i].availableValues;
			 var lineCodeField=$('#lineCode');
			  lineCodeField.append($("<option />").val("")
								.text(getLabel("select","Select")));
			 $.each(arrOptions, function(index, opt) {
			 lineCodeField.append($("<option />").val(opt.code)
								.text(opt.description));
			 });
			 lineCodeField.niceSelect();
			}
			else{
				var lineCodeField=$('#lineCode');
				  lineCodeField.append($("<option />").val("")
									.text(getLabel("select","Select")));
				 $.each(arrOptions, function(index, opt) {
				 lineCodeField.append($("<option />").val(opt.code)
									.text(opt.description));
				 });
			}
		}
		if(standardField[i].code==="lineAmount"){
		$('#lineAmount').autoNumeric("init",
					{
						aSep: strGroupSeparator,
						aDec: strDecimalSeparator,
						mDec: strAmountMinFraction
					});		
					$('#lineAmount').val("0.0");
		}
		if(standardField[i].code==="quantity" || standardField[i].code==="rate"){
		$('#'+standardField[i].code).OnlyNumbers();
		}
		if(standardField[i].code==="countryOfOrigin"){
		if(standardField[i] && standardField[i].availableValues){
		     var arrOptions=standardField[i].availableValues;
			 var countryField=$('#countryOfOrigin');
			 countryField.append($("<option />").val("")
								.text(getLabel("selectCountry","Select Country")));
			 $.each(arrOptions, function(index, opt) {
			 countryField.append($("<option />").val(opt.code)
								.text(opt.description));
			 });
			 countryField.niceSelect();
			}
		}
			if(standardField[i].code==="quantityUom" || standardField[i].code==="rateUom"){
			if(standardField[i] && standardField[i].availableValues){
		     var arrOptions=standardField[i].availableValues;
			 var umField=$('#'+standardField[i].code);
			 umField.append($("<option />").val("")
								.text(getLabel("selectUnit","Select Unit")));
			 $.each(arrOptions, function(index, opt) {
			 umField.append($("<option />").val(opt.code)
								.text(getLabel(opt.code,opt.description)));
			 });
			umField.niceSelect();
			}
		}
	}
	              niceSelectUpdate();
}
function doCancelLineItem(strAction){
	closeTransactionWizardPopup(strAction);
	blockPOUI(true);
	doClearMessageSection();
	blockPOUI(false);

}
function paintPOLineItemActions(strAction,isBtnVisible,record){
	var elt = null, eltCancel = null, eltDiscard = null;
	$('.poDtlActionButtonListLB,.poDtlActionButtonListRB')
			.empty();
	var strBtnLTLB = '.poDtlActionButtonListLB';
	var strBtnRTRB = '.poDtlActionButtonListRB';
	var canShow = true;
	eltCancel = createButton('btnClose', 'S');
	if (!isEmpty(isBtnVisible))
		canShow = isBtnVisible;

	eltCancel.click(function() {
				doCancelLineItem(strAction);
			});
	if (strAction === 'ADD') {
		if (canShow === true) {
			elt = createButton('btnSaveAndAddAother', 'L');
			elt.click(function() {
						doSaveAndAddLineItem(strAction);
					});
			elt.appendTo($(strBtnRTRB));
		}
		eltCancel.appendTo($(strBtnLTLB));
		elt = createButton('btnSave', 'P');
		elt.click(function() {
					doSaveAndExitlineItem(strAction);
				});
		elt.appendTo($(strBtnRTRB));
	} else if (strAction === 'UPDATE' || strAction === 'UPDATEWITHERROR') {
		elt = createButton('btnUpdate', 'P');
		elt.click(function() {
					doUpdateAndExitLineItem(record);
				});
		elt.appendTo($(strBtnRTRB));
		eltDiscard = createButton('btnDiscard', 'L');
		eltDiscard.click(function() {
			if(!isEmpty(record))
					doLineItemDiscard(record);
				});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
		eltDiscard.appendTo($(strBtnLTLB));
	} else if (strAction === 'VIEW') {
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
		eltCancel.unbind('click');
		eltCancel.bind('click', function() {
					doCancelLineItem(strAction);
				});
	} else if (strAction === 'CLOSE') {
		eltCancel = createButton('btnClose', 'P');
		eltCancel.click(function() {
					doCancelViewLineItem();
				});
		eltCancel.appendTo($(strBtnRTRB));
	}
}
function doLineItemDiscard(record){
var data=record.data;
var metaData=data.__metadata;
 var arrayJson=new Array();
arrayJson.push({
						serialNo : data.detailSerialNumber_stdField,
						identifier : metaData._detailId,
						userMessage :''
					});
 var strUrl = _mapUrl['deletelineitem']+'('+strHeaderIdentifier+').json';
	$.ajax({
				url : strUrl,
				type : 'POST',
				contentType : "application/json",
				data : JSON.stringify(arrayJson),
				complete : function(XMLHttpRequest, textStatus) {
					if ("error" == textStatus) {
						var arrError = new Array();
						arrError.push({
									"errorCode" : "Message",
									"errorMessage" : mapLbl['unknownErr']
								});
						doHandleUnknownError();
					}
				},
				success : function(jsonData) {
					var jsonRes = Ext.JSON
										.decode(jsonData.responseText);
								postHandleDiscardAction();
					
				},
				failure : function() {
								var arrError = new Array();
								arrError.push({
											"errorCode" : "Message",
											"errorMessage" : mapLbl['unknownErr']
										});
								paintErrors(arrError);
								groupView.setLoading(false);
							}
			});
}
function postHandleDiscardAction(){
	objLineItemEntryGrid.refreshData();
closeTransactionWizardPopup("EDIT");
}
function generatePOLineItemJson(){
var jsonPost = {}, jsonArrStdFields = [], jsonArrBeneFields = [],
strTxnReference='',
data = cloneObject(purchaseOrderLineItemData), field = null;
canAdd = false, objVal = null, isLinkageAdded = false,blnAutoNumeric = true;
	var arrFields = [], clsHide = 'hidden';
	if (data) {
		jsonPost.d = {};
		jsonPost.d.poEntry = {};
		jsonPost.d.__metadata = data.d['__metadata'] || {};
		jsonPost.d.__metadata._headerId = strHeaderIdentifier;
		if (data && data.d && data.d.poEntry) {
			if (data.d.poEntry.standardField)
				arrFields = cloneObject(data.d.poEntry.standardField);
			// ============= Standard Field Node population =============
			$.each(arrFields, function(index, cfg) {
				canAdd = true;
					field = $('#' + cfg.fieldName);
				if (field && field.length != 0) {
					if (canAdd) {
						var jsonField={
						fieldName:"",
						value:""
						};
					 if (cfg.fieldName === 'lineAmount') {
							// jquery autoNumeric formatting
							blnAutoNumeric = isAutoNumericApplied(cfg.fieldName);
								if (blnAutoNumeric)
									objVal = $("#lineAmount").autoNumeric('get');
								else
									objVal = $("#lineAmount").val();
							// jquery autoNumeric formatting
							jsonField.fieldName=cfg.fieldName;	
							jsonField.value = objVal;
							jsonArrStdFields.push(jsonField);
						} 
						else
						if(cfg.fieldName==='amountCurrency'){
							jsonField.fieldName=cfg.fieldName;	
							jsonField.value = ccy;
							jsonArrStdFields.push(jsonField);
						}
						else{
                            objVal = null;
							objVal = field.val();
							jsonField.fieldName=cfg.fieldName;	
							jsonField.value = objVal;
							jsonArrStdFields.push(jsonField);
						}	
					}
				}
			});
			jsonPost.d.poEntry.standardField = jsonArrStdFields;
		}
	}
	return {
			jsonPostData : jsonPost,
			txnReference : strTxnReference
		};
}
function doUpdateAndExitLineItem(record){
var action = 'SAVEANDEXIT';
var reponseData=loadLineItemFieldsForGridLayout(strHeaderIdentifier);
purchaseOrderLineItemData = reponseData;
if (intHdrDirtyBit > 0)
	var result=doSavePurchaseOrderHeaderSilent();
	if(result && result.success && result.success==="FAILED"){
		var error=true;
	closeTransactionWizardPopup(strAction,error);
	 if(result.errors){
	 	blockPOUI(false);
        paintErrors(result.errors);
	 }
	 else{
	                    var arrError = new Array();
						arrError.push({
									"errorCode" : "Message",
									"errorMessage" : mapLbl['unknownErr']
								});
						doHandleUnknownError();
	 }
	}
	else{
	var jsonData = generatePOLineItemJsonForUpdate(record), jsonArgs = {};
	var jsonPost=jsonData.jsonPostData;
	var canSave = validateRequiredFields();
	doClearMessageSection();
	savePOLineItem(jsonPost, postHandleSaveLineItem, action);
	}
}
function generatePOLineItemJsonForUpdate(record){
	var jsonArrStdFields = [], jsonArrBeneFields = [],
		strTxnReference='',
		field = null;
		canAdd = false, objVal = null, isLinkageAdded = false,blnAutoNumeric = true;
	var arrFields = [], clsHide = 'hidden';
	var recData=record.data;
	var jsonPost={};
	var strTxnReference="";
	data = cloneObject(purchaseOrderLineItemData);
	if (data) {
		jsonPost.d = {};
		jsonPost.d.poEntry = {};
		jsonPost.d.__metadata = recData['__metadata'] || {};
		jsonPost.d.__metadata._headerId = strHeaderIdentifier;
		if (data && data.d && data.d.poEntry) {
			if (data.d.poEntry.standardField)
				arrFields = cloneObject(data.d.poEntry.standardField);
			// ============= Standard Field Node population =============
			$.each(arrFields, function(index, cfg) {
				canAdd = true;
					field = $('#' + cfg.fieldName);
				if (field && field.length != 0) {
					if (canAdd) {
						var jsonField={
						fieldName:"",
						value:""
						};
					 if (cfg.fieldName === 'lineAmount') {
							// jquery autoNumeric formatting
							blnAutoNumeric = isAutoNumericApplied(cfg.fieldName);
								if (blnAutoNumeric)
									objVal = $("#lineAmount").autoNumeric('get');
								else
									objVal = $("#lineAmount").val();
							// jquery autoNumeric formatting
							jsonField.fieldName=cfg.fieldName;	
							jsonField.value = objVal;
							jsonArrStdFields.push(jsonField);
						} 
						else
						if(cfg.fieldName==='amountCurrency'){
							jsonField.fieldName=cfg.fieldName;	
							jsonField.value = ccy;
							jsonArrStdFields.push(jsonField);
						}
						else{
                            objVal = null;
							objVal = field.val();
							jsonField.fieldName=cfg.fieldName;	
							jsonField.value = objVal;
							jsonArrStdFields.push(jsonField);
						}	
					}
				}
			});
			jsonPost.d.poEntry.standardField = jsonArrStdFields;
		}
	}
	return {
			jsonPostData : jsonPost,
			txnReference : strTxnReference
		};
}
function doSaveAndExitlineItem(strAction){
	var action = 'SAVEANDEXIT';
	if (intHdrDirtyBit > 0)
	var result=doSavePurchaseOrderHeaderSilent();
	if(result && result.success && result.success==="FAILED"){
		var error=true;
	closeTransactionWizardPopup(strAction,error);
	 if(result.errors){
	 	blockPOUI(false);
        paintErrors(result.errors);
	 }
	 else{
	                    var arrError = new Array();
						arrError.push({
									"errorCode" : "Message",
									"errorMessage" : mapLbl['unknownErr']
								});
						doHandleUnknownError();
	 }
	}
	else{
	var jsonData = generatePOLineItemJson(), jsonArgs = {};
	strTxnReferenceNo = jsonData.txnReference;
    jsonPost = jsonData.jsonPostData;
	var canSave = validateRequiredFields();
	doClearMessageSection();
	savePOLineItem(jsonPost, postHandleSaveLineItem, action);	
 }
}
function doSaveAndAddLineItem(strAction){
	doClearLineItemMessageSection();
	if (intHdrDirtyBit > 0)
	doSavePurchaseOrderHeaderSilent();
		var result=doSavePurchaseOrderHeaderSilent();
	if(result && result.success && result.success==="FAILED"){
		var error=true;
	closeTransactionWizardPopup(strAction,error);
	 if(result.errors){
	 	blockPOUI(false);
        paintErrors(result.errors);
	 }
	 else{
	                    var arrError = new Array();
						arrError.push({
									"errorCode" : "Message",
									"errorMessage" : mapLbl['unknownErr']
								});
						doHandleUnknownError();
	 }
	}
	else{
	var jsonData = generatePOLineItemJson(), jsonArgs = {};
	strTxnReferenceNo = jsonData.txnReference;
    jsonPost = jsonData.jsonPostData;
	var canSave = validateRequiredFields();
	var action = 'SAVEANDADD';
	doClearMessageSection();
 	savePOLineItem(jsonPost, postHandleSaveLineItem, action);
	}
}
function savePOLineItem(jsonData,fnCallback,action){
 var strUrl = _mapUrl['saveLineItemUrl'];
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
					}
				},
				success : function(data) {
						if (data.d
						&& data.d.poEntry.message
						&& (data.d.poEntry.message.errors || data.d.poEntry.message.success === 'FAILED')) {
					    paintLineItemErrors(data.d.poEntry.message.errors);
				} 
				else{
					fnCallback(data,action);
						objLineItemEntryGrid.refreshData();
				}
				}
			});
	autoFocusFirstElement();
}
function postHandleSaveLineItem(data,action){
	if(action==="SAVEANDADD")
	doShowInstrumentForm(action);
	if(action==="SAVEANDEXIT")
	closeTransactionWizardPopup(action);
	if(action==="UPDATEANDEXIT")
	closeTransactionWizardPopup(action);
}
function closeTransactionWizardPopup(action,error) {
	refreshGridData=error;
	if(action==="VIEW"){
	$('#addLineItemViewPopup').dialog('close');
	}else
	$('#addLineItemPopup').dialog('close');
}
function doHandleUnknownError() {
	isScreenBroken = true;
	var arrError = [{
				errorMessage : mapLbl['unknownErr'],
				errorCode : 'ERR'
			}];
	doHandleEmptyScreenErrorForInstrument(arrError);
}
function toggleHeaderDirtyBit(blnApplyDirtyBit) {
	var field = null;
	intHdrDirtyBit = 0;
	if(blnApplyDirtyBit)
	$('#poEntryStep2A :text, #poEntryStep2A :file, #poEntryStep2A :checkbox, #poEntryStep2A :radio, #poEntryStep2A select, #poEntryStep2A textarea')
			.each(function() {
						field = $(this);
						if (field && field.length != 0) {
								field.focus(function dirtyBitFocus() {
									intHdrDirtyBit++;
									});
						}
					});
}
function doHandleEmptyScreenErrorForInstrument(arrError) {
	isScreenBroken = true;
	blockPOUI(false);
	paintErrors(arrError);
	$('#addLineItemPopup').addClass('hidden');
	$('#messageContentHeaderDiv').appendTo($('#emptyScreenErrorInstDiv'));
	$('#emptyScreenErrorInstDiv').toggleClass("ui-helper-hidden");
}