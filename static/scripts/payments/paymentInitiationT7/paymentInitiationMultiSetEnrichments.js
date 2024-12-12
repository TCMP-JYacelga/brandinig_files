/* Payment Bank Product Multi Enrichment */

var objPaymentBankProductMultiSetEnrichments = null;
var objPaymentBankProductMultiSetEnrichmentsParamArray = null;
var objPaymentBankProductMultiSetEnrichmentsMetaData = null;
var objPaymentBankProductMultiSetEnrichmentsParamArrayMetaData = null;
var objBankProductMultisetGrid = null;
var objEnrichType = null;
/* Payment My Product Multi Enrichment */
var objPaymentMyProductMultiSetEnrichments = null;
var objPaymentMyProductMultiSetEnrichmentsParamArray = null;
var objPaymentMyProductMultiSetEnrichmentsMetaData = null;
var objPaymentMyProductMultiSetEnrichmentsParamArrayMetaData = null;
var objMyProductMultisetGrid = null;
/* Payment Client Product Multi set Enrichment */
var objPaymentClientProductMultiSetEnrichments = null;
var objPaymentClientProductMultiSetEnrichmentsParamArray = null;
var objPaymentClientProductMultiSetEnrichmentsMetaData = null;
var objPaymentClientProductMultiSetEnrichmentsParamArrayMetaData = null;
var objClientProductMultisetGrid = null;
var discardedRecordsArray = [];
var confidentailsFields = [];
var confidentailsValues = [];

function paintPaymentBankProductMultiSetEnrichments(data, dataMetaData,
		intCounter, strTargetId, flag, isViewOnly) {

	objPaymentBankProductMultiSetEnrichments = data;
	objPaymentBankProductMultiSetEnrichmentsMetaData = dataMetaData;
	if (data && data.length > 0)
		objPaymentBankProductMultiSetEnrichmentsParamArray = data[0].parameters;
	if (dataMetaData && dataMetaData.length > 0) {
		objPaymentBankProductMultiSetEnrichmentsParamArrayMetaData = dataMetaData[0].parameters;
		for (var i = 0; i < objPaymentBankProductMultiSetEnrichmentsParamArrayMetaData.length; i++) {
			if (dataMetaData[0].parameters[i].formattedValue
					&& dataMetaData[0].parameters[i].formattedValue.indexOf("CONFIDENTIAL") != -1) {
				confidentailsFields.push(dataMetaData[0].parameters[i].code);
				confidentailsValues.push(dataMetaData[0].parameters[i].formattedValue);
			}
		}
	} else
		return;
	var targetDiv = $('#' + strTargetId), label = null, div = null, smartGirdDiv = null, popupDiv = null, linkDiv = null, ctrlBtn = null;
	targetDiv.removeClass('hidden');
	div = $('<div>').attr({
				'class' : 'col-sm-12 ft-no-padding',
				'id' : 'entricmentDiv'
			});
	$('#popupDiv').remove();
	popupDiv = $('<div>').attr({
		'class' : 'ui-helper-hidden extrapadding_bottom ux_panel-transparent-background',
		'id' : 'popupDiv'
	});
	if (isViewOnly !== true) {
		ctrlBtn = createButton('btnAddEnrichments', 'P');
		ctrlBtn.click(function() {
					getProdMultiSetEnrichmentsPopup('BANKPRDMSE');
				});
		ctrlBtn.removeClass('ft-margin-l');
		ctrlBtn.appendTo(div);
	}
	smartGirdDiv = $('<div>').attr({
				'class' : 'extrapadding_bottom',
				'id' : 'smartgrid',
				'height' : 750
			});
	smartGirdDiv.appendTo(div);
	popupDiv.appendTo(div);
	div.appendTo(targetDiv);
	createSmartGridOfPayBankProductMultiSetEnrich(dataMetaData,isViewOnly);
	addBankProdMultiSetEnrichFieldsToPopup("addEnrich");

	/* ENR - handling */
	doHandleENRValidation('BANKPRDMSE');
	/* ENR - handling */

	/* CTX - handling - Starts */
	CTXAmountCalculation();
	CTXFieldAdjustmentCodeDependentReset();
	doValidateCTXAmount('BANKPRDMSE',isViewOnly)
	/* CTX - handling - Ends */
}
function addBankProdMultiSetEnrichFieldsToPopup(callFrom) {
	var intCounter = 1;
	var paramArr = null;
	var argsData = {
		'strTargetDiv' : 'popupDiv',
		'strEnrichType' : 'BANKPRDMSE'
	};
	$("#popupDiv").empty();
	var errorMsgDiv = $('<div>').attr({
				'class' : 'ft-error-message ui-helper-hidden',
				'id' : 'errMsgBERN'
			});
	errorMsgDiv.appendTo('#popupDiv');

	if (callFrom === 'refreshEnrich')
		paramArr = objPaymentBankProductMultiSetEnrichmentsParamArray;
	else if (callFrom === 'addEnrich')
		paramArr = objPaymentBankProductMultiSetEnrichmentsParamArrayMetaData;
	else
		paramArr = objPaymentBankProductMultiSetEnrichmentsParamArrayMetaData;

	if (paramArr) {
		intCounter = paintPaymentEnrichmentsHelper(paramArr, intCounter,
				'popupDiv', 'Q', argsData, true);
		handlePayEnrichSelect(paramArr);
	}

	/* CTX - handling - Starts */
	CTXAmountCalculation();
	CTXFieldAdjustmentCodeDependentReset();
	/* CTX - handling - Ends */
	handleEmptyEnrichmentDivs();
}

function refreshMultiSetEnrichmentPopUp(data, argsData) {
	if (argsData && data && data.d && data.d.paymentEntry
			&& data.d.paymentEntry.enrichments) {
		var enrichData = data.d.paymentEntry.enrichments;
		var dataTemp = new Array(), dataTempMetaData = null;
		var strTargetDiv = (argsData && argsData.strTargetDiv)
				? argsData.strTargetDiv
				: '';
		var strEnrichType = (argsData && argsData.strEnrichType)
				? argsData.strEnrichType
				: '';
		var arrParam = new Array(), field = null, value = null;

		if (enrichData.bankProductMultiSet && strEnrichType === 'BANKPRDMSE') {
			dataTemp = enrichData.bankProductMultiSet;
			dataTempMetaData = enrichData.bankProductMultiSetMetadata;
			if (dataTemp) {
				objPaymentBankProductMultiSetEnrichments = dataTemp;
				objPaymentBankProductMultiSetEnrichmentsParamArray = dataTemp && dataTemp.length > 0 ? dataTemp[0].parameters: [];
				objPaymentBankProductMultiSetEnrichmentsParamArrayMetaData = dataTempMetaData[0].parameters;
				if (null == objPaymentBankProductMultiSetEnrichmentsParamArray
						|| objPaymentBankProductMultiSetEnrichmentsParamArray.length == 0)
					addBankProdMultiSetEnrichFieldsToPopup("addEnrich");
				else
					addBankProdMultiSetEnrichFieldsToPopup("refreshEnrich");
			}
		} else if (enrichData.myProductMultiSet
				&& strEnrichType === 'MYPPRDMSE') {
			dataTemp = enrichData.myProductMultiSet;
			dataTempMetaData = enrichData.myProductMultiSetMetadata;
			if (dataTemp) {
				objPaymentMyProductMultiSetEnrichments = dataTemp;
				objPaymentMyProductMultiSetEnrichmentsMetaData = dataTempMetaData;
				objPaymentMyProductMultiSetEnrichmentsParamArray = dataTemp && dataTemp.length > 0 ? dataTemp[0].parameters: [];
				objPaymentMyProductMultiSetEnrichmentsParamArrayMetaData = dataTempMetaData[0].parameters;
				if (null == objPaymentMyProductMultiSetEnrichmentsParamArray
						|| objPaymentMyProductMultiSetEnrichmentsParamArray.length == 0)
					addMyProdMultiSetEnrichFieldsToPopup("addEnrich");
				else	
					addMyProdMultiSetEnrichFieldsToPopup("refreshEnrich");
			}
		} else if (enrichData.clientMultiSet && strEnrichType === 'CLIPRDMSE') {
			dataTemp = enrichData.clientMultiSet;
			dataTempMetaData = enrichData.clientMultiSetMetadata;
			if (dataTemp) {
				objPaymentClientProductMultiSetEnrichments = dataTemp;
				objPaymentClientProductMultiSetEnrichmentsMetaData = dataTempMetaData;
				objPaymentClientProductMultiSetEnrichmentsParamArray = dataTemp && dataTemp.length > 0 ? dataTemp[0].parameters: [];
				objPaymentClientProductMultiSetEnrichmentsParamArrayMetaData = dataTempMetaData[0].parameters;
				if (null == objPaymentClientProductMultiSetEnrichmentsParamArray
						|| objPaymentClientProductMultiSetEnrichmentsParamArray.length == 0)
					addClientProdMultiSetEnrichFieldsToPopup("addEnrich");
				else	
					addClientProdMultiSetEnrichFieldsToPopup("refreshEnrich");
			}
		}
		// Populate The Popup values in case of Edit Enrichment
		if (dataTemp && dataTemp.length > 0) {
			$.each(dataTemp, function(index, cfg) {
						if (cfg.dirtyRow === true || cfg.dirtRowFlag === 'Y')
							arrParam = cfg.parameters;
					});
			if (arrParam && arrParam.length > 0) {
				$.each(arrParam, function(index, cfg) {
							field = $('#' + strTargetDivId)
									.find('#' + cfg.code);
							if (field)
								field.val(cfg.value);
						});
			}
		}

	}
}
function getProdMultiSetEnrichmentsPopup(strEnrichType) {
	if (!isEmpty(strEnrichType)) {
		var buttonsOpts = {};
		var canSave = null;
		var strDivId = getPopUpDivId(strEnrichType);
		var strErrDiv = null;

		if (strEnrichType === 'BANKPRDMSE')
			strErrDiv = '#errMsgBERN';
		else if (strEnrichType === 'MYPPRDMSE')
			strErrDiv = '#errMsgMPERN';
		else if (strEnrichType === 'CLIPRDMSE')
			strErrDiv = '#errMsgCPERN';

		$('#' + strDivId).find('input:text, textarea, select').each(
				function() {
					$(this).removeClass('requiredField');
				});
		
		if (!isEmpty(strDivId)) {
			doClearMultiSelectEnrichmentPopup(strEnrichType);
			$('#' + strDivId).dialog({
						autoOpen : false,
						width : 600,
						modal : true,
						//dialogClass : "hide-title-bar",
						 title : mapLbl['btnAddEnrichments'],
						//buttons : buttonsOpts
						 buttons : [{
								id : 'Save',
								text : mapLbl['btnSave'],
								click : function() {
				doClearMessageSection();
				canSave = validatePopupFields(strDivId);
				amountZeroFlag = validateAdjustmentAmntPopup();
				if (!canSave || amountZeroFlag) {
					$(strErrDiv).empty();
					if(!canSave)
					{
					element = $('<li class="error-msg-color">')
							.text("Please enter mandatory fields.");
					element.appendTo($(strErrDiv));
					}
					if(amountZeroFlag)
					{
						adjAmountError = $('<li class="error-msg-color">')
						.text("Adjustment amount should be greater than Zero.");
						adjAmountError.appendTo($(strErrDiv));
					}
					$(strErrDiv).removeClass('ui-helper-hidden');
					return false;
				} else {
					$(strErrDiv).addClass('ui-helper-hidden');
				}
				saveFieldValueToGridStore(strEnrichType);
				$(strErrDiv).addClass('ui-helper-hidden');
				$('#' + strDivId).dialog("close");
				if (strLayoutType === 'TAXLAYOUT')
					doHandleAmountSummation();
				doValidateCTXAmount(strEnrichType);					
				doClearMultiSelectEnrichmentPopup(strEnrichType);
				autoFocusOnFirstElement(null, "myprodentricmentDiv", true);									
								}
							},
							{
								id : 'Cancel',
								text : mapLbl['btnCancel'],
								click : function() {
				$('#' + strDivId).find('input:text, textarea, select').each(
						function() {
							$(this).removeClass('requiredField');
						});
				$(strErrDiv).addClass('ui-helper-hidden');
				$(this).dialog("close");
				doClearMultiSelectEnrichmentPopup(strEnrichType);
				$(this).dialog('destroy');
									setTimeout(function() { autoFocusOnFirstElement(null, "myprodentricmentDiv", true); }, 100);
								},
								blur : function() {
									autoFocusOnFirstElement(null, strDivId, true);
								}
							}
							]
					});
			var field =null;
			var fieldLabel =null;
			$('#' + strDivId).dialog("open");
			$('#' + strDivId).find('input:text, textarea, select').each(
					function() {
						field =  $('#' + this.id);
						fieldLabel =  $('#' + this.id+"Div label");
						if($(this).hasClass('jq-nice-select'))
							field = $('#' + this.id + "-niceSelect");
						if($(this).hasClass('jq-editable-combo'))
							field = $('#' + this.id + "_jq");

						if (field && field.length != 0 
								&& fieldLabel.hasClass('required')) {
							field.bind('blur', function() {markRequired($(this));});
							field.bind('focus', function() {removeMarkRequired($(this));});
						}
						
					});
			$("button").attr('tabindex','1');		
			autoFocusOnFirstElement(null, strDivId, true);
			setTimeout(function() { handleEmptyEnrichmentDivs(); }, 500);
		}
	}
}

function validatePopupFields(strDivId) {
	var fieldId = null, field = null, failedFields = 0;
	$('#' + strDivId + ' label.required').each(function() {
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
function validateAdjustmentAmntPopup() {
	if( $('#CTX11').length > 0 && $('#CTX10').length > 0 )
	{
		var adjustmentAmnt = parseInt($('#CTX11').val().replace(/[^0-9.]/g, ""),10);
		
		if('' != $('#CTX10').val() && isNaN(adjustmentAmnt))
		{
			return true;
		}
		else if ('' != $('#CTX10').val() && 0 >= adjustmentAmnt )
		{
			return true; 
		}
	}
	return false;
}
function createSmartGridOfPayBankProductMultiSetEnrich(data, isViewOnly) {
	if (!Ext.isEmpty(objBankProductMultisetGrid))
		Ext.destroy(objBankProductMultisetGrid);

	$('#smartgrid').empty();
	var gridData = data[0];
	var gridCols = new Array();
	var storeFieldArray = new Array();
	var arrCols = null;
	var dispType = null, gridColId = null, gridColDesc = null;
	for (var i = 0; i < gridData.parameters.length; i++) {
		if (gridData.parameters[i].displayType === 2 || gridData.parameters[i].displayType === 3)
			dispType = 'number';
		else
			dispType = 'content';
		storeFieldArray.push(gridData.parameters[i].code);
		gridColId = gridData.parameters[i].code;
		if (gridData.parameters[i].displayType === 4 || gridData.parameters[i].displayType === 11) {
			storeFieldArray.push(gridData.parameters[i].code + "desc");
			gridColId = gridData.parameters[i].code + "desc";
		}
		gridColDesc = gridData.parameters[i].description;
		if (gridData.parameters[i].mandatory && !isViewOnly)
		gridColDesc = '<span class="requiredLeft">' + gridColDesc + '</span>';
		gridCols.push({
					"colId" : gridColId,
					"colDesc" : gridColDesc,
					"colType" : dispType,
					"locked" : false,
					"lockable" : false,
					"sortable" : false,
					"hideable" : false,
					"draggable" : false,
					"menuDisabled" : true,
					"resizable" : true,
					"minWidth" : 120,
					"width" : 'auto'
				});

	}
	arrCols = getColumnsOfPayBankProdMultiSetEnrichGrid(gridCols, isViewOnly);
	Ext.application({
				name : 'GCP',
				launch : function() {
					objBankProductMultisetGrid = Ext.create(
							'Ext.ux.gcp.SmartGrid', {
								showPager : false,
								showAllRecords : true,
								itemId : 'enrichmentGrid',
								stateful : false,
								showEmptyRow : false,
								showCheckBoxColumn : false,
								padding : '5 0 0 0',
								minHeight : 150,
								enableColumnHeaderMenu : false,
								enableColumnMove : false,
								enableColumnAutoWidth : false,
								columnModel : arrCols,
								storeModel : {
									fields : storeFieldArray,
									autoLoad : false,
									rootNode : 'data'
								},
								handleRowIconClick : function(tableView,
										rowIndex, columnIndex, btn, event,
										record) {
									handleRowIconClick(tableView, rowIndex,
											columnIndex, btn, event, record,
											'BANKPRDMSE');
								},
								listeners : {
									afterrender : function(grid) {
										loadPayBankProdMultiSetEnrichGrid(grid);
									}
								}
							});
					var layout = Ext.create('Ext.container.Container',{
						width: 'auto',
                		items: [objBankProductMultisetGrid],
               			renderTo: 'smartgrid'
					});
				}
			});
}
function loadPayBankProdMultiSetEnrichGrid(grid) {
	if (objPaymentBankProductMultiSetEnrichments) {
		var arrGridStoreData = new Array();
		var objOfGridStore = {}, isRecordEmpty = false, intCnt = 0, objOfEachMultiSetEnrich = null, eachMultiEnrichDataObj = null, objOfEveryEnrichParam = null, objOfParam = null;
		for (var i = 0; i < objPaymentBankProductMultiSetEnrichments.length; i++) {
			if (objPaymentBankProductMultiSetEnrichments[i]) {
				objOfEachMultiSetEnrich = objPaymentBankProductMultiSetEnrichments[i];
				eachMultiEnrichDataObj = {};
				objOfEveryEnrichParam = objPaymentBankProductMultiSetEnrichments[i].parameters;
				if (objOfEveryEnrichParam) {
					intCnt = 0;
					for (var j = 0; j < objOfEveryEnrichParam.length; j++) {
						objOfParam = objOfEveryEnrichParam[j];
						/*
						 * if (isEmpty(objOfParam.value)) intCnt++;
						 */
						if (objOfParam && objOfParam.code && objOfParam.value) {
							if(objOfParam.displayType === 2) {
								// converting amount into local specific decimal format and then setting
								var amount = $("<input>").attr('type','hidden').autoNumeric("init",
                                        {
                                               aSep: strGroupSeparator,
                                               dGroup: strAmountDigitGroup,
                                               aDec: strDecimalSeparator,
                                               mDec: strAmountMinFraction
                                        }).autoNumeric('set', objOfParam.value).val();

								eachMultiEnrichDataObj[objOfParam.code] = amount;
							}else if (objOfParam.displayType === 4 || objOfParam.displayType === 11) {
								var objDispVal = getEnrichValueToDispayed(objOfParam);
								eachMultiEnrichDataObj[objOfParam.code + "desc"] = objDispVal;
								eachMultiEnrichDataObj[objOfParam.code] = objOfParam.value;
							} else
								eachMultiEnrichDataObj[objOfParam.code] = objOfParam.value;
						}
					}
					/*
					 * isRecordEmpty = (intCnt === objOfEveryEnrichParam.length &&
					 * intCnt !== 0); if (isRecordEmpty &&
					 * objPaymentBankProductMultiSetEnrichments.length <= 1)
					 * return;
					 */
				}
			}
			arrGridStoreData.push(eachMultiEnrichDataObj);
		}
		objOfGridStore["data"] = arrGridStoreData;
		if (objOfGridStore && grid) {
			grid.store.loadRawData(objOfGridStore, true);
		}
	}
}
function handleRowIconClick(tableView, rowIndex, columnIndex, btn, event,
		record, strEnrichType) {
	var actionName = btn.itemId;
	if (actionName === 'edit') {
		editMultiSetEnrichment(tableView, rowIndex, columnIndex, btn, event,
				record, strEnrichType);
	} else if (actionName === 'delete') {
		deleteMultiSetEnrichData(tableView, rowIndex, columnIndex, btn, event,
				record, strEnrichType);
	}
}

function editMultiSetEnrichment(tableView, rowIndex, columnIndex, btn, event,
		record, strEnrichType) {
	var strTargetDivId = getPopUpDivId(strEnrichType);
	var arrEnrichParam = [], field = null;
	var strErrDiv = null;

	if (strEnrichType === 'BANKPRDMSE') {
		if(record && record.data && record.data.CTX10 && record.data.CTX10 != 'None'  )
		{
			for (x in objPaymentBankProductMultiSetEnrichmentsParamArrayMetaData) 
			{
			    if( objPaymentBankProductMultiSetEnrichmentsParamArrayMetaData[x].code === 'CTX11' )
				{	
					objPaymentBankProductMultiSetEnrichmentsParamArrayMetaData[x].editable = true;
					$('#CTX11').removeAttr('disabled');
					$('#CTX11').removeClass('disabled');
				}
			}
		}
		arrEnrichParam = objPaymentBankProductMultiSetEnrichmentsParamArrayMetaData;
		strErrDiv = '#errMsgBERN';
	} else if (strEnrichType === 'CLIPRDMSE') {
		arrEnrichParam = objPaymentClientProductMultiSetEnrichmentsParamArrayMetaData;
		strErrDiv = '#errMsgCPERN';
	} else if (strEnrichType === 'MYPPRDMSE') {
		arrEnrichParam = objPaymentMyProductMultiSetEnrichmentsParamArrayMetaData;
		strErrDiv = '#errMsgMPERN';
	}

	$('#' + strTargetDivId).find('input:text, textarea, select').each(
			function() {
				$(this).removeClass('requiredField');
			});
	if (record.data && strTargetDivId) {

		var objbuttonsOpts = {};
		var objEditEnrichmentPopup;
		doClearMultiSelectEnrichmentPopup(strEnrichType);
		objEditEnrichmentPopup = $('#' + strTargetDivId).dialog({
					autoOpen : false,
					width : 600,
					modal : true,
					//dialogClass : "hide-title-bar",
					title : mapLbl['btnAddEnrichments'],
					//buttons : objbuttonsOpts
					buttons : [
					     {
							id : 'Update',
							tabindex :'1',
							text : mapLbl['btnUpdate'],
							click : function() {
			doClearMessageSection();
			canUpdate = validatePopupFields(strTargetDivId);
			amountZeroFlag = validateAdjustmentAmntPopup();
			if (!canUpdate || amountZeroFlag ) {
				$(strErrDiv).empty();
				element = $('<li class="error-msg-color">')
						.text(getLabel('enterMandatoryFieldslbl', 'Please enter mandatory fields.'));
				if(!canUpdate)
				{
					element = $('<li class="error-msg-color">')
					.text("Please enter mandatory fields.");						
				element.appendTo($(strErrDiv));
				}
				if(amountZeroFlag)
				{
					adjAmountError = $('<li class="error-msg-color">')
					.text("Adjustment amount should be greater than Zero.");
					adjAmountError.appendTo($(strErrDiv));
				}
				element.appendTo($(strErrDiv));
				$(strErrDiv).removeClass('ui-helper-hidden');
				return false;
			} else {
				$(strErrDiv).addClass('ui-helper-hidden');
			}
			saveEditValueToGrid(rowIndex, record, objEditEnrichmentPopup,
					arrEnrichParam, strEnrichType);
			if (strLayoutType === 'TAXLAYOUT')
				doHandleAmountSummation();
			doValidateCTXAmount(strEnrichType);			
			doClearMultiSelectEnrichmentPopup(strEnrichType);
								autoFocusOnFirstElement(null, "myprodentricmentDiv", true);
							}
						},
						   {
							id : 'Cancel',
							tabindex :'1',
							text : mapLbl['btnCancel'],
							click :function() {
			$(strErrDiv).addClass('ui-helper-hidden');
			$(this).dialog("close");
			doClearMultiSelectEnrichmentPopup(strEnrichType);
			$(this).dialog('destroy');
									autoFocusOnFirstElement(null, "myprodentricmentDiv", true);
								},
							blur : function() {
								autoFocusOnFirstElement(null, strTargetDivId, true);
							}
							}
						]
				});
		if (arrEnrichParam) {
			$.each(arrEnrichParam, function(index, cfg) {
						field = $('#' + strTargetDivId).find('#' + cfg.code);
						if (cfg.displayType === 11) {
							field = $('#' + strTargetDivId).find('input[name="'
									+ cfg.code + '"][id="'
									+ record.data[cfg.code] + '"]');
							$(field).attr('checked', true);
						} else if (cfg.displayType === 10 && !isEmpty(record.data[cfg.code]) && record.data[cfg.code]==='Y') {
							$(field).attr('checked', true);
						} else if(cfg.displayType === 4){
							if((field.attr('id')+'-niceSelect').length){
								field.val(record.data[cfg.code] || '');
								$(field).niceSelect('update');
							}
						} else {
							field.val(record.data[cfg.code] || '');
							if($(field).hasClass('amountBox'))
							{
								var obj = $('<input type="text">');
								obj.autoNumeric('init');
								obj.val(record.data[cfg.code]);
								strAmtValue = obj.autoNumeric('get');
								obj.remove();
								$(field).autoNumeric('set', strAmtValue || '0');
							}
						}
					});
		}
		objEditEnrichmentPopup.dialog('open');
		setTimeout(function() { handleEmptyEnrichmentDivs(); }, 100);
	}
}
function deleteMultiSetEnrichData(tableView, rowIndex, columnIndex, btn, event,
		record, strEnrichType) {
	var objGrid = null;

	if (strEnrichType === 'BANKPRDMSE')
		objGrid = objBankProductMultisetGrid;
	else if (strEnrichType === 'CLIPRDMSE')
		objGrid = objClientProductMultisetGrid;
	else if (strEnrichType === 'MYPPRDMSE')
		objGrid = objMyProductMultisetGrid;

	if (record && objGrid) {
		discardedRecordsArray.push(record);
		objGrid.getStore().remove(record);
		objGrid.getView().refresh();
		if (strLayoutType === 'TAXLAYOUT')
			doHandleAmountSummation();
	}

}
function doClearMultiSelectEnrichmentPopup(strEnrichType) {
	var strDivId = getPopUpDivId(strEnrichType);
	if (!isEmpty(strDivId)) {
		$('#' + strDivId).find('input:text, textarea, select, input:radio, input:checkbox').each(function() {
			if ($(this).is('select')) {
				if ($(this).find("option:contains('')"))
					$(this).val('');
				else
					$(this).find("option:first").attr('selected', 'selected');
				
				if ($('#'+$(this).attr('id')+'-niceSelect').length)
						$(this).niceSelect('update');
				
			} else if ($(this).is(':checkbox') || $(this).is(':radio')) {
				$('#' + strDivId + ' input:checkbox').removeAttr('checked');
				$('#' + strDivId + ' input:radio').removeAttr('checked');
			} else
				$('#' + strDivId + ' input').val('');
		});
	}
}
function getPopUpDivId(strEnrichType) {
	var strRetValue = null;
	switch (strEnrichType) {
		case 'BANKPRDMSE' :
			strRetValue = 'popupDiv';
			break;
		case 'CLIPRDMSE' :
			strRetValue = 'clientprodpopupDiv';
			break;
		case 'MYPPRDMSE' :
			strRetValue = 'myprodpopupDiv';
			break;
	}
	return strRetValue;
}
function saveEditValueToGrid(rowIndex, recordObj, objEditBankEnrichmentPopup,
		arrEnrichParam, strEnrichType) {
	var objFieldVal = null, field = null, code = null;
	if (strEnrichType === 'BANKPRDMSE') {
		arrEnrichParam = objPaymentBankProductMultiSetEnrichmentsParamArrayMetaData;
		objGrid = objBankProductMultisetGrid;
	} else if (strEnrichType === 'CLIPRDMSE') {
		arrEnrichParam = objPaymentClientProductMultiSetEnrichmentsParamArrayMetaData;
		objGrid = objClientProductMultisetGrid;
	} else if (strEnrichType === 'MYPPRDMSE') {
		arrEnrichParam = objPaymentMyProductMultiSetEnrichmentsParamArrayMetaData;
		objGrid = objMyProductMultisetGrid;
	}
	if (arrEnrichParam) {
		$.each(arrEnrichParam, function(index, cfg) {
					field = objEditBankEnrichmentPopup.find('#' + cfg.code);
					if (cfg.displayType === 11) {
						field = $('input[name=' + cfg.code + ']:radio');
						if ($('input[name=' + cfg.code + ']:radio').is(':checked'))
						{
							field = $('input[name=' + cfg.code + ']:radio:checked')
							objFieldVal = field[0].id;
						}
					} else if (cfg.displayType === 10) {
						if ($('input[id=' + cfg.code + ']:checkbox')
								.is(':checked'))
							objFieldVal = 'Y';
						else
							objFieldVal = 'N';
					} else if(isAutoNumericApplied(cfg.code)){
						objFieldVal = $('#' + cfg.code).autoNumeric('get'); 
					}else {
						objFieldVal = field.val() || '';
					}
					code = cfg.code;
					var desc = cfg.value;
					if (recordObj) {
						if(cfg.displayType === 4 || cfg.displayType === 11){
							$.each(cfg.lookupValues, function(index, objValue) {
								if(objFieldVal === objValue.key){
									desc = objValue.value;
								}
							});							
							if(desc !== null){
								recordObj.set(code, objFieldVal);
								recordObj.set(code+"desc",desc);
							}else{
								recordObj.set(code, objFieldVal);
							}
						}else if(isAutoNumericApplied(cfg.code)){
						//	objFieldVal = $('#' + cfg.code).autoNumeric('get');
							objFieldVal = $('#' + cfg.code).val();
							recordObj.set(code, objFieldVal);
						}else{
							recordObj.set(code, objFieldVal);
						}
					}
				});
	}
	if (objGrid) {
		objGrid.refreshData();
	}
	objEditBankEnrichmentPopup.dialog("close");
}

function getColumnsOfPayBankProdMultiSetEnrichGrid(arrColsPref, isViewOnly) {
	var me = this;
	objEnrichType = 'BANKPRDMSE';
	
	var arrCols = new Array(), objCol = null, cfgCol = null;
	if (isViewOnly !== true)
		arrCols.push(me.createActionColumnOfPayMultiSetEnrichGrid());
	if (!Ext.isEmpty(arrColsPref)) {
		for (var i = 0; i < arrColsPref.length; i++) {
			objCol = arrColsPref[i];
			cfgCol = {};
			cfgCol.colHeader = objCol.colDesc;
			cfgCol.sortable = objCol.sortable;
			cfgCol.colId = objCol.colId;
			if (!Ext.isEmpty(objCol.colType))
				cfgCol.colType = objCol.colType;
			cfgCol.width = 160;
			if (objCol.colType === 'number')
				cfgCol.align = 'right';
			if (Ext.isEmpty(cfgCol.fnColumnRenderer)) {
				cfgCol.fnColumnRenderer = function(value, meta, record,
						rowIndex, colIndex, store, view, colId) {
					var index=confidentailsFields.indexOf(colId.replace("col_",""));
					if (index >-1) {
						value = confidentailsValues[index];
					}
					meta.tdAttr = 'title="' + value + '"';
					return value;
				};
			}
			cfgCol.menuDisabled = true,
			cfgCol.sortable = false,
			cfgCol.draggable = false,
			cfgCol.resizable = true,
			cfgCol.hideable = false,
			cfgCol.lockable = false,
			cfgCol.locked = false,
			arrCols.push(cfgCol);
		}
	}
	return arrCols;
}
function createActionColumnOfPayMultiSetEnrichGrid() {
	var me = this;
	var objActionCol = {
		colType : 'actioncontent',
		colId : 'action',
		width : 108,
		colHeader : 'Actions',
		//align : 'right',
		sortable : false,
		locked : true,
		items : [{
			itemId : 'edit',
			itemCls : 'grid-row-action-icon icon-edit',
			toolTip : mapLbl['btnEdit'],
			itemLabel : getLabel('editRecordToolTip', 'Modify Record'),
			text : getLabel('editRecordToolTip', 'Modify Record'),
			fnClickHandler : function(tableView, rowIndex, columnIndex, btn,
					event, record) {
				editMultiSetEnrichment(tableView, rowIndex, columnIndex, btn,
						event, record, 'BANKPRDMSE');
			}
		}, {
			itemId : 'delete',
			itemCls : 'grid-row-action-icon icon-delete',
			toolTip : mapLbl['btnDelete'],
			itemLabel : getLabel('instrumentsActionDiscard', 'Discard'),
			text : getLabel('instrumentsActionDiscard', 'Discard'),
			fnClickHandler : function(tableView, rowIndex, columnIndex, btn,
					event, record) {
				deleteMultiSetEnrichData(tableView, rowIndex, columnIndex, btn,
						event, record, 'BANKPRDMSE');
			}
		}]
	};
	return objActionCol;
}
function saveFieldValueToGridStore(strEnrichType) {
	var objFieldVal = null, objGrid = null;
	var dataobj = {}, objOfGridStore = {};
	var arrGridStoreData = new Array(), arrEnrichParam = new Array();

	if (strEnrichType === 'BANKPRDMSE') {
		arrEnrichParam = objPaymentBankProductMultiSetEnrichmentsParamArrayMetaData;
		objGrid = objBankProductMultisetGrid;
	} else if (strEnrichType === 'CLIPRDMSE') {
		arrEnrichParam = objPaymentClientProductMultiSetEnrichmentsParamArrayMetaData;
		objGrid = objClientProductMultisetGrid;
	} else if (strEnrichType === 'MYPPRDMSE') {
		arrEnrichParam = objPaymentMyProductMultiSetEnrichmentsParamArrayMetaData;
		objGrid = objMyProductMultisetGrid;
	}

	if (arrEnrichParam) {
		$.each(arrEnrichParam, function(index, cfg) {
			var blnAutoNumeric = false;
					if (cfg.displayType === 11) {
						field = $('input[name=' + cfg.code + ']:radio');
						if ($('input[name=' + cfg.code + ']:radio').is(':checked'))
						{
							field = $('input[name=' + cfg.code + ']:radio:checked')
							objFieldVal = field[0].id;
						}
					} else if (cfg.displayType === 10) {
						if ($('input[id=' + cfg.code + ']:checkbox')
								.is(':checked'))
							objFieldVal = 'Y';
						else
							objFieldVal = 'N';
					} else if(cfg.displayType === 2){
						objFieldVal = $('#' + cfg.code).val();
					//	blnAutoNumeric = isAutoNumericApplied(cfg.code);
					//	if (blnAutoNumeric)
					//		objFieldVal = $('#' + cfg.code).autoNumeric('get');
						
					} else {
						objFieldVal = $('#' + cfg.code).val();
					}
					var code = cfg.code;
					if (objFieldVal) {
						dataobj[code] = objFieldVal;
					}
					var desc = cfg.value;
					if (objFieldVal) {
						if(cfg.displayType === 4 || cfg.displayType === 11){
							$.each(cfg.lookupValues, function(index, cfg) {
								if(objFieldVal == cfg.key){
									desc = cfg.value;
								}
							});							
							if(desc != null){
								dataobj[code] = objFieldVal;
								dataobj[code+"desc"] = desc;
							}else{
								dataobj[code] = objFieldVal;
							}
						}else{
							dataobj[code] = objFieldVal;
						}
					}
				});
		
		arrGridStoreData.push(dataobj);
		objOfGridStore["data"] = arrGridStoreData;
	}
	if (objGrid) {
		objGrid.store.loadRawData(objOfGridStore, true);
		objGrid.refreshData();
	}
}
function columnRenderer(value, meta, record, rowIndex, colIndex, store, view,
		colId) {
	var strRetValue = value;
	
	if (objEnrichType === 'BANKPRDMSE') {
		arrEnrichParam = objPaymentBankProductMultiSetEnrichmentsParamArrayMetaData;
	} else if (objEnrichType === 'CLIPRDMSE') {
		arrEnrichParam = objPaymentClientProductMultiSetEnrichmentsParamArrayMetaData;
	} else if (objEnrichType === 'MYPPRDMSE') {
		arrEnrichParam = objPaymentMyProductMultiSetEnrichmentsParamArrayMetaData;
	}
	
	if (arrEnrichParam) {
		$.each(arrEnrichParam, function(index, cfg) {
					if("col_"+cfg.code === colId && cfg.displayType === 2){
						obj = $('<input type="text">');
						obj.autoNumeric('init');
						obj.autoNumeric('set',value);
						strRetValue = obj.val();
						obj.remove();
					}
				});
	}
	meta.tdAttr = 'title="' + strRetValue + '"';
	if (!Ext.isEmpty(value))
		meta.tdAttr = 'title="' + value + '"';
	return strRetValue;
}
function getBankProductMultiSetEnrichmentJsonArray() {
	if (objBankProductMultisetGrid) {
		var objOfGridStore = objBankProductMultisetGrid.getStore();
		var arrOfGridRecord = new Array();
		var arrOfJsonObject = new Array();

		var records = objOfGridStore.queryBy(function(record) {
					arrOfGridRecord.push(record);
				});

		var objOfPayMultiEnrich = objPaymentBankProductMultiSetEnrichmentsMetaData[0];

		for (var i = 0; i < arrOfGridRecord.length; i++) {
			var objRecr = arrOfGridRecord[i].data;
			var cloneNewObj = createCopyOfMultiSetEnrichObj(objOfPayMultiEnrich);
			var objParam = cloneNewObj.parameters;
			for (var j = 0; j < objParam.length; j++) {
				var paramfirstobj = objParam[j];
				var codeObj = paramfirstobj.code;
				if(paramfirstobj.displayType == 2)
				{
                    var amount = $("<input>").attr('type','hidden').autoNumeric("init", { aSep: strGroupSeparator,dGroup: strAmountDigitGroup, aDec: strDecimalSeparator, mDec: strAmountMinFraction })
                    .val(objRecr[codeObj]).autoNumeric('get');
					paramfirstobj["value"] = amount;
					paramfirstobj["string"] = amount;
				}
				else
				{
					paramfirstobj["value"] = objRecr[codeObj];
					paramfirstobj["string"] = objRecr[codeObj];
				}
			}
			arrOfJsonObject.push(cloneNewObj);
		}
		
		doHandleDiscardedRecords(objOfPayMultiEnrich,arrOfJsonObject);

		return arrOfJsonObject;
	}
}
function createCopyOfMultiSetEnrichObj(p, c) {
	var c = c || {};
	for (var i in p) {
		if (typeof p[i] === 'object') {
			c[i] = (p[i].constructor === Array) ? [] : {};
			createCopyOfMultiSetEnrichObj(p[i], c[i]);
		} else
			c[i] = p[i];
	}
	return c;
}

/*--------- Bank Product Multi Set Enrichment Ends here -------- */

function paintPaymentMyProductMultiSetEnrichments(data, dataMetaData,
		intCounter, strTargetId, flag, isViewOnly) {
	objPaymentMyProductMultiSetEnrichments = data;
	objPaymentMyProductMultiSetEnrichmentsMetaData = dataMetaData;
	if (dataMetaData && dataMetaData.length > 0)
		objPaymentMyProductMultiSetEnrichmentsParamArrayMetaData = dataMetaData[0].parameters;
	else
		return;
	var myProdTargetDiv = $('#' + strTargetId), myProdlabel = null, myProddiv = null, myProdSmartGirdDiv = null, myProdPopupDiv = null, linkDiv = null;
	myProdTargetDiv.removeClass('hidden');
	myProddiv = $('<div>').attr({
				'class' : 'col-sm-12 ft-no-padding',
				'id' : 'myprodentricmentDiv',
				'style' : 'margin-top: 25px'
			});
	$("#myprodpopupDiv").remove();		
	myProdPopupDiv = $('<div>').attr({
		'class' : 'ui-helper-hidden extrapadding_bottom ux_panel-transparent-background',
		'id' : 'myprodpopupDiv'
		
	});

	if (isViewOnly !== true) {
		ctrlBtn = createButton('btnAddEnrichments', 'P');
		ctrlBtn.click(function() {
					getProdMultiSetEnrichmentsPopup('MYPPRDMSE');
				});
		ctrlBtn.removeClass('ft-margin-l');
		ctrlBtn.appendTo(myProddiv);
	}

	myProdSmartGirdDiv = $('<div>').attr({
				'class' : 'extrapadding_bottom',
				'id' : 'myprodsmartgrid',
				'height' : 750
			});
	myProdSmartGirdDiv.appendTo(myProddiv);
	myProdPopupDiv.appendTo(myProddiv);
	myProddiv.appendTo(myProdTargetDiv);
	createSmartGridOfPayMyProductMultiSetEnrich(dataMetaData,isViewOnly);
	addMyProdMultiSetEnrichFieldsToPopup("addEnrich");

	/* ENR - handling */
	doHandleENRValidation('MYPPRDMSE');
	/* ENR - handling */
}
function createSmartGridOfPayMyProductMultiSetEnrich(data, isViewOnly) {
	if (!Ext.isEmpty(objMyProductMultisetGrid))
		Ext.destroy(objMyProductMultisetGrid);
	$('#myProdSmartGirdDiv').empty();
	var myProdGridData = data[0];
	var myProdFGridCols = [];
	var storeFieldArray = [];
	var myProdArrCols = null, gridColId = null, gridColDesc = null;
	var dispType = null;
	for (var i = 0; i < myProdGridData.parameters.length; i++) {
		if (myProdGridData.parameters[i].displayType === 2 || myProdGridData.parameters[i].displayType === 3)
			dispType = 'number';
		else
			dispType = 'content';

		storeFieldArray.push(myProdGridData.parameters[i].code);
		gridColId = myProdGridData.parameters[i].code;
		if (myProdGridData.parameters[i].displayType === 4 || myProdGridData.parameters[i].displayType === 11) {
			storeFieldArray.push(myProdGridData.parameters[i].code + "desc");
			gridColId = myProdGridData.parameters[i].code + "desc";
		}
		gridColDesc = myProdGridData.parameters[i].description;
		if (myProdGridData.parameters[i].mandatory && !isViewOnly)
		gridColDesc = '<span class="requiredLeft">' + gridColDesc + '</span>';
		myProdFGridCols.push({
					"colId" : gridColId,
					"colDesc" : gridColDesc,
					"colType" : dispType,
					"locked" : false,
					"lockable" : false,
					"sortable" : false,
					"hideable" : false,
					"draggable" : false,
					"menuDisabled" : true,
					"resizable" : false,
					"minWidth" : 120
					});
		//myProdFGridCols.push({
		//			"colId" : myProdGridData.parameters[i].code,
		//			"colDesc" : myProdGridData.parameters[i].description,
		//			"colType" : dispType
		//			
		//		});
	}
	myProdArrCols = getColumnsOfPayMyProdMultiSetEnrichGrid(myProdFGridCols,
			isViewOnly);
	Ext.application({
				name : 'GCP',
				launch : function() {
					objMyProductMultisetGrid = Ext.create(
							'Ext.ux.gcp.SmartGrid', {
								showPager : false,
								showPagerForced : false,
								showAllRecords : true,
								itemId : 'myProdEnrichmentGrid',
								stateful : false,
								showEmptyRow : false,
								showCheckBoxColumn : false,
								enableColumnMove: false,
								padding : '5 0 0 0',
								minHeight : 150,
								enableColumnAutoWidth : false,
								columnModel : myProdArrCols,
								storeModel : {
									fields : storeFieldArray,
									autoLoad : false,
									rootNode : 'data'
								},
								handleRowIconClick : function(tableView,
										rowIndex, columnIndex, btn, event,
										record) {
									handleRowIconClick(tableView, rowIndex,
											columnIndex, btn, event, record,
											'MYPPRDMSE');
								},
								listeners : {
									afterrender : function(grid) {
										loadPayMyProdMultiSetEnrichGrid(grid);
									}
								}
							});
					var layout = Ext.create('Ext.container.Container',{
						width: 'auto',
                		items: [objMyProductMultisetGrid],
               			renderTo: 'myprodsmartgrid'
					});
				}
			});
}
function getColumnsOfPayMyProdMultiSetEnrichGrid(arrColsPref, isViewOnly) {
	var me = this;
	objEnrichType = 'MYPPRDMSE';
	var arrCols = new Array(), objCol = null, cfgCol = null;
	if (isViewOnly !== true)
		arrCols.push(me.createActionColumnOfPayMyProdMultiSetEnrichGrid());
	if (!Ext.isEmpty(arrColsPref)) {
		for (var i = 0; i < arrColsPref.length; i++) {
			objCol = arrColsPref[i];
			cfgCol = {};
			cfgCol.colHeader = objCol.colDesc;
			cfgCol.colId = objCol.colId;
			if (!Ext.isEmpty(objCol.colType))
				cfgCol.colType = objCol.colType;
			cfgCol.width = 160;
			if (objCol.colType === 'number')
				cfgCol.align = 'right';
			if (Ext.isEmpty(cfgCol.fnColumnRenderer)) {
				cfgCol.fnColumnRenderer = function(value, meta, record,
						rowIndex, colIndex, store, view, colId) {
					meta.tdAttr = 'title="' + value + '"';
					return value;
				};
			}
			cfgCol.menuDisabled = true,
			cfgCol.sortable = false,	
			cfgCol.draggable = false,
			cfgCol.resizable = true,
			cfgCol.hideable = false,
			cfgCol.lockable = false,
			cfgCol.locked = false,
			arrCols.push(cfgCol);
		}
	}
	return arrCols;
}
function createActionColumnOfPayMyProdMultiSetEnrichGrid() {
	var objActionCol = {
		colType : 'actioncontent',
		colId : 'action',
		width : 108,
		colHeader : getLabel('actions','Actions'),
		//align : 'right',
		sortable : false,
		resizable : false,
		locked : true,
		items : [{
			itemId : 'edit',
			itemCls : 'grid-row-action-icon icon-edit',
			toolTip : getLabel('editRecordToolTip', 'Modify Record'),
			itemLabel : getLabel('editRecordToolTip', 'Modify Record'),
			text : getLabel('editRecordToolTip', 'Modify Record'),
			fnClickHandler : function(tableView, rowIndex, columnIndex, btn,
					event, record) {
				editMultiSetEnrichment(tableView, rowIndex, columnIndex,
							btn, event, record, 'MYPPRDMSE');
			}
		}, {
			itemId : 'delete',
			itemCls : 'grid-row-action-icon icon-delete',
			toolTip : mapLbl['btnDelete'],
			itemLabel : getLabel('instrumentsActionDiscard', 'Discard'),
			text : getLabel('instrumentsActionDiscard', 'Discard'),
			fnClickHandler : function(tableView, rowIndex, columnIndex, btn,
					event, record) {
				deleteMultiSetEnrichData(tableView, rowIndex, columnIndex,
							btn, event, record, 'MYPPRDMSE');
			}
		}]
	};
	return objActionCol;
}
function addMyProdMultiSetEnrichFieldsToPopup(callFrom) {
	var intCounter = 1;
	var paramArr = null;
	var argsData = {
		'strTargetDiv' : 'myprodpopupDiv',
		'strEnrichType' : 'MYPPRDMSE'
	};
	$("#myprodpopupDiv").empty();
	var errorMsgDiv = $('<div>').attr({
				'class' : 'ft-error-message ui-helper-hidden',
				'id' : 'errMsgMPERN'
			});
	errorMsgDiv.appendTo('#myprodpopupDiv');
	if (callFrom === 'refreshEnrich')
		paramArr = objPaymentMyProductMultiSetEnrichmentsParamArray;
	else if (callFrom === 'addEnrich')
		paramArr = objPaymentMyProductMultiSetEnrichmentsParamArrayMetaData;
	else
		paramArr = objPaymentMyProductMultiSetEnrichmentsParamArrayMetaData;

	if (paramArr){
		intCounter = paintPaymentEnrichmentsHelper(paramArr, intCounter,
				'myprodpopupDiv', 'Q', argsData, true);
		handlePayEnrichSelect(paramArr);
	}
	
}
function loadPayMyProdMultiSetEnrichGrid(grid) {
	if (objPaymentMyProductMultiSetEnrichments) {
		var arrGridStoreData = [], isRecordEmpty = false, intCnt = 0;
		var objOfGridStore = {}, objOfParam = null, objOfEachMultiSetEnrich = null, eachMultiEnrichDataObj = null, objOfEveryEnrichParam = null;
		for (var i = 0; i < objPaymentMyProductMultiSetEnrichments.length; i++) {
			if (objPaymentMyProductMultiSetEnrichments[i]) {
				objOfEachMultiSetEnrich = objPaymentMyProductMultiSetEnrichments[i];
				eachMultiEnrichDataObj = {};
				objOfEveryEnrichParam = objPaymentMyProductMultiSetEnrichments[i].parameters;
				if (objOfEveryEnrichParam) {
					intCnt = 0;
					for (var j = 0; j < objOfEveryEnrichParam.length; j++) {
						objOfParam = objOfEveryEnrichParam[j];
						/*
						 * if (isEmpty(objOfParam.value)) intCnt++;
						 */
						if (objOfParam && objOfParam.code && objOfParam.value) {
							if(objOfParam.displayType === 2) {
								
								// converting amount into local specific decimal format and then setting
								var amount = $("<input>").attr('type','hidden').autoNumeric("init",
                                        {
                                               aSep: strGroupSeparator,
                                               dGroup: strAmountDigitGroup,
                                               aDec: strDecimalSeparator,
                                               mDec: strAmountMinFraction
                                        }).autoNumeric('set', objOfParam.value).val();

								eachMultiEnrichDataObj[objOfParam.code] = amount;
							}else if (objOfParam.displayType === 4 || objOfParam.displayType === 11) {
								var objDispVal = getEnrichValueToDispayed(objOfParam);
								eachMultiEnrichDataObj[objOfParam.code + "desc"] = objDispVal;
								eachMultiEnrichDataObj[objOfParam.code] = objOfParam.value;
							} else
								eachMultiEnrichDataObj[objOfParam.code] = objOfParam.value;
						}
						/*
						 * isRecordEmpty = (intCnt ===
						 * objOfEveryEnrichParam.length && intCnt !== 0); if
						 * (isRecordEmpty &&
						 * objPaymentMyProductMultiSetEnrichments.length <= 1)
						 * return;
						 */
					}
				}
			}
			arrGridStoreData.push(eachMultiEnrichDataObj);
		}
		objOfGridStore["data"] = arrGridStoreData;
		if (objOfGridStore && grid) {
			grid.store.loadRawData(objOfGridStore, true);
		}
	}
}
function getMyProductMultiSetEnrichmentJsonArray() {
	if (objMyProductMultisetGrid) {
		var objOfGridStore = objMyProductMultisetGrid.getStore();
		var arrOfGridRecord = new Array();
		var arrOfJsonObject = new Array();

		var records = objOfGridStore.queryBy(function(record) {
					arrOfGridRecord.push(record);
				});

		var objOfPayMultiEnrich = objPaymentMyProductMultiSetEnrichmentsMetaData[0];

		for (var i = 0; i < arrOfGridRecord.length; i++) {
			var objRecr = arrOfGridRecord[i].data;
			var cloneNewObj = createCopyOfMultiSetEnrichObj(objOfPayMultiEnrich);
			var objParam = cloneNewObj.parameters;
			for (var j = 0; j < objParam.length; j++) {
				var paramfirstobj = objParam[j];
				var codeObj = paramfirstobj.code;
				if(paramfirstobj.displayType == 2)
				{
                    var amount = $("<input>").attr('type','hidden').autoNumeric("init", { aSep: strGroupSeparator,dGroup: strAmountDigitGroup, aDec: strDecimalSeparator, mDec: strAmountMinFraction })
                    .val(objRecr[codeObj]).autoNumeric('get')
					paramfirstobj["value"] = amount;
					paramfirstobj["string"] = amount;
				}
				else
				{
					paramfirstobj["value"] = objRecr[codeObj];
					paramfirstobj["string"] = objRecr[codeObj];
				}
			}
			arrOfJsonObject.push(cloneNewObj);
		}
		
		doHandleDiscardedRecords(objOfPayMultiEnrich,arrOfJsonObject);
		
		return arrOfJsonObject;
	}
}

/*--------- My Product Multi Set Enrichment Ends here -------- */

function paintPaymentClientProductMultiSetEnrichments(data, dataMetaData,
		intCounter, strTargetId, flag, isViewOnly) {
	objPaymentClientProductMultiSetEnrichments = data;
	objPaymentClientProductMultiSetEnrichmentsMetaData = dataMetaData;
	if (data && data.length > 0)
		objPaymentClientProductMultiSetEnrichmentsParamArray = data[0].parameters;
	if (dataMetaData && dataMetaData.length > 0)
		objPaymentClientProductMultiSetEnrichmentsParamArrayMetaData = dataMetaData[0].parameters;
	else
		return;

	var clientProdTargetDiv = $('#' + strTargetId), clientProdlabel = null, clientProddiv = null, clientProdSmartGirdDiv = null, clientProdPopupDiv = null, clientlinkDiv = null;
	clientProdTargetDiv.removeClass('hidden');
	clientProddiv = $('<div>').attr({
				'class' : 'col-sm-12 ft-no-padding',
				'id' : 'clientprodentricmentDiv'
			});
	$('#clientprodpopupDiv').remove();		
	clientProdPopupDiv = $('<div>').attr({
		'class' : 'ui-helper-hidden extrapadding_bottom ux_panel-transparent-background',
		'id' : 'clientprodpopupDiv'
	});
	if (isViewOnly !== true) {
		ctrlBtn = createButton('btnAddEnrichments', 'P');
		ctrlBtn.click(function() {
					getProdMultiSetEnrichmentsPopup('CLIPRDMSE');
				});
		ctrlBtn.removeClass('ft-margin-l');
		ctrlBtn.appendTo(clientProddiv);
	}

	clientProdSmartGirdDiv = $('<div>').attr({
				'class' : 'extrapadding_bottom',
				'id' : 'clientprodsmartgrid',
				'height' : 750
			});
	clientProdSmartGirdDiv.appendTo(clientProddiv);
	clientProdPopupDiv.appendTo(clientProddiv);
	clientProddiv.appendTo(clientProdTargetDiv);
	createSmartGridOfPayClientProductMultiSetEnrich(dataMetaData,isViewOnly);
	addClientProdMultiSetEnrichFieldsToPopup("addEnrich");

	/* ENR - handling */
	doHandleENRValidation('CLIPRDMSE');
	/* ENR - handling */
}
function createSmartGridOfPayClientProductMultiSetEnrich(data, isViewOnly) {
	if (!Ext.isEmpty(objClientProductMultisetGrid))
		Ext.destroy(objClientProductMultisetGrid);

	$('#clientprodsmartgrid').empty();
	var clientProdGridData = data[0];
	var clientProdFGridCols = new Array();
	var storeFieldArray = new Array();
	var myProdArrCols = null;
	var dispType = null;
	var gridColDesc = null;
	for (var i = 0; i < clientProdGridData.parameters.length; i++) {
		if (clientProdGridData.parameters[i].displayType === 2 || clientProdGridData.parameters[i].displayType === 3)
			dispType = 'number';
		else
			dispType = 'content';
		storeFieldArray.push(clientProdGridData.parameters[i].code);
		gridColId = clientProdGridData.parameters[i].code;
		if (clientProdGridData.parameters[i].displayType === 4 || clientProdGridData.parameters[i].displayType === 11) {
			storeFieldArray
					.push(clientProdGridData.parameters[i].code + "desc");
			gridColId = clientProdGridData.parameters[i].code + "desc";
		}
		gridColDesc = clientProdGridData.parameters[i].description;
		if (clientProdGridData.parameters[i].mandatory)
		gridColDesc = '<span class="requiredLeft">' + gridColDesc + '</span>';
		clientProdFGridCols.push({
					"colId" : clientProdGridData.parameters[i].code,
					"colDesc" : gridColDesc,
					"colType" : dispType,
					"locked" : false,
					"sortable" : true,
					"hideable" : false,
					"draggable" : false,
					"menuDisabled" : true,
					"resizable" : true,
					"minWidth" : 120,
				});
	}
	clientProdArrCols = getColumnsOfPayClientProdMultiSetEnrichGrid(
			clientProdFGridCols, isViewOnly);
	Ext.application({
				name : 'GCP',
				launch : function() {
					objClientProductMultisetGrid = Ext.create(
							'Ext.ux.gcp.SmartGrid', {
								showPager : false,
								showAllRecords : true,
								itemId : 'clientProdEnrichmentGrid',
								stateful : false,
								showEmptyRow : false,
								showCheckBoxColumn : false,
								enableColumnMove: false,
								padding : '5 0 0 0',
								minHeight : 150,
								enableColumnAutoWidth : false,
								columnModel : clientProdArrCols,
								storeModel : {
									fields : storeFieldArray,
									autoLoad : false,
									rootNode : 'data'
								},
								handleRowIconClick : function(tableView,
										rowIndex, columnIndex, btn, event,
										record) {
									handleRowIconClick(tableView, rowIndex,
											columnIndex, btn, event, record,
											'CLIPRDMSE');
								},
								listeners : {
									afterrender : function(grid) {
										loadPayClientProdMultiSetEnrichGrid(grid);
									}
								}
							});
					var layout = Ext.create('Ext.container.Container',{
						width: 'auto',
                		items: [objClientProductMultisetGrid],
               			renderTo: 'clientprodsmartgrid'
					});
				}
			});
}

function getColumnsOfPayClientProdMultiSetEnrichGrid(arrColsPref, isViewOnly) {
	var me = this;
	objEnrichType = 'CLIPRDMSE';
	var arrCols = new Array(), objCol = null, cfgCol = null;
	if (isViewOnly !== true)
		arrCols.push(me.createActionColumnOfPayClientProdMultiSetEnrichGrid());
	if (!Ext.isEmpty(arrColsPref)) {
		for (var i = 0; i < arrColsPref.length; i++) {
			objCol = arrColsPref[i];
			cfgCol = {};
			cfgCol.colHeader = objCol.colDesc;
			cfgCol.colId = objCol.colId;
			if (!Ext.isEmpty(objCol.colType))
				cfgCol.colType = objCol.colType;
			cfgCol.width = 160;
			if (objCol.colType === 'number')
				cfgCol.align = 'right';
			if (Ext.isEmpty(cfgCol.fnColumnRenderer)) {
				cfgCol.fnColumnRenderer = function(value, meta, record,
						rowIndex, colIndex, store, view, colId) {
					meta.tdAttr = 'title="' + value + '"';
					return value;
				};
			}
			cfgCol.menuDisabled = true,
			cfgCol.sortable = false,
			cfgCol.draggable = false,
			cfgCol.resizable = true,
			cfgCol.hideable = false,
			cfgCol.lockable = false,
			cfgCol.locked = false,
			arrCols.push(cfgCol);
		}
	}
	return arrCols;
}
function createActionColumnOfPayClientProdMultiSetEnrichGrid() {
	var me = this;
	var objActionCol = {
		colType : 'actioncontent',
		colId : 'action',
		colHeader : 'Actions',
		width : 108,
		//align : 'right',
		sortable : false,
		locked : true,
		items : [{
			itemId : 'edit',
			itemCls : 'grid-row-action-icon icon-edit',
			toolTip : mapLbl['btnEdit'],
			text : getLabel('editRecordToolTip', 'Modify Record'),
			fnClickHandler : function(tableView, rowIndex, columnIndex, btn,
					event, record) {
				editMultiSetEnrichment(tableView, rowIndex, columnIndex, btn,
						event, record, 'CLIPRDMSE');
			}
		}, {
			itemId : 'delete',
			itemCls : 'grid-row-action-icon icon-delete',
			toolTip : mapLbl['btnDelete'],
			text : getLabel('instrumentsActionDiscard', 'Discard'),
			fnClickHandler : function(tableView, rowIndex, columnIndex, btn,
					event, record) {
				deleteMultiSetEnrichData(tableView, rowIndex, columnIndex, btn,
						event, record, 'CLIPRDMSE');
			}
		}]
	};
	return objActionCol;
}

function addClientProdMultiSetEnrichFieldsToPopup(callFrom) {
	var intCounter = 1;
	var paramArr = null;
	var argsData = {
		'strTargetDiv' : 'clientprodpopupDiv',
		'strEnrichType' : 'CLIPRDMSE'
	};
	$('#clientprodpopupDiv').empty();
	var errorMsgDiv = $('<div>').attr({
				'class' : 'ft-error-message ui-helper-hidden',
				'id' : 'errMsgCPERN'
			});
	errorMsgDiv.appendTo('#clientprodpopupDiv');

	if (callFrom === 'refreshEnrich')
		paramArr = objPaymentClientProductMultiSetEnrichmentsParamArray;
	else if (callFrom === 'addEnrich')
		paramArr = objPaymentClientProductMultiSetEnrichmentsParamArrayMetaData;
	else
		paramArr = objPaymentClientProductMultiSetEnrichmentsParamArrayMetaData;

	if (paramArr){
		intCounter = paintPaymentEnrichmentsHelper(paramArr, intCounter,
				'clientprodpopupDiv', 'Q', argsData, true);
		handlePayEnrichSelect(paramArr);
	}
}
function loadPayClientProdMultiSetEnrichGrid(grid) {
	if (objPaymentClientProductMultiSetEnrichments) {
		var arrGridStoreData = new Array();
		var objOfGridStore = {}, isRecordEmpty = false, intCnt = 0, objOfParam = null, eachMultiEnrichDataObj = null, objOfEachMultiSetEnrich = null, objOfEveryEnrichParam = null;
		for (var i = 0; i < objPaymentClientProductMultiSetEnrichments.length; i++) {
			if (objPaymentClientProductMultiSetEnrichments[i]) {
				objOfEachMultiSetEnrich = objPaymentClientProductMultiSetEnrichments[i];
				eachMultiEnrichDataObj = {};
				objOfEveryEnrichParam = objPaymentClientProductMultiSetEnrichments[i].parameters;
				if (objOfEveryEnrichParam) {
					intCnt = 0;
					for (var j = 0; j < objOfEveryEnrichParam.length; j++) {
						objOfParam = objOfEveryEnrichParam[j];
						/*
						 * if (isEmpty(objOfParam.value)) intCnt++;
						 */
						if (objOfParam && objOfParam.code && objOfParam.value) {
							if(objOfParam.displayType === 2) {
								
								// converting amount into local specific decimal format and then setting
								var amount = $("<input>").attr('type','hidden').autoNumeric("init",
                                        {
                                               aSep: strGroupSeparator,
                                               dGroup: strAmountDigitGroup,
                                               aDec: strDecimalSeparator,
                                               mDec: strAmountMinFraction
                                        }).autoNumeric('set', objOfParam.value).val();
								eachMultiEnrichDataObj[objOfParam.code] = amount;
							}else if (objOfParam.displayType === 4 || objOfParam.displayType === 11) {
								var objDispVal = getEnrichValueToDispayed(objOfParam);
								eachMultiEnrichDataObj[objOfParam.code + "desc"] = objDispVal;
								eachMultiEnrichDataObj[objOfParam.code] = objOfParam.value;
							} else
								eachMultiEnrichDataObj[objOfParam.code] = objOfParam.value;
						}
						/*
						 * isRecordEmpty = (intCnt ===
						 * objOfEveryEnrichParam.length && intCnt !== 0); if
						 * (isRecordEmpty &&
						 * objPaymentClientProductMultiSetEnrichments.length <=
						 * 1) return;
						 */
					}
				}
			}
			arrGridStoreData.push(eachMultiEnrichDataObj);
		}
		objOfGridStore["data"] = arrGridStoreData;
		if (objOfGridStore && grid) {
			grid.store.loadRawData(objOfGridStore, true);
		}
	}
}

function getClientProductMultiSetEnrichmentJsonArray() {
	if (objClientProductMultisetGrid) {
		var objOfGridStore = objClientProductMultisetGrid.getStore();
		var arrOfGridRecord = new Array();
		var arrOfJsonObject = new Array();

		var records = objOfGridStore.queryBy(function(record) {
					arrOfGridRecord.push(record);
				});

		var objOfClientPayMultiEnrich = objPaymentClientProductMultiSetEnrichmentsMetaData[0];

		for (var i = 0; i < arrOfGridRecord.length; i++) {
			var objRecr = arrOfGridRecord[i].data;
			var cloneNewObj = createCopyOfMultiSetEnrichObj(objOfClientPayMultiEnrich);
			var objParam = cloneNewObj.parameters;
			for (var j = 0; j < objParam.length; j++) {
				var paramfirstobj = objParam[j];
				var codeObj = paramfirstobj.code;
				
				if(paramfirstobj.displayType == 2)
				{
                    var amount = $("<input>").attr('type','hidden').autoNumeric("init", { aSep: strGroupSeparator,dGroup: strAmountDigitGroup, aDec: strDecimalSeparator, mDec: strAmountMinFraction })
                    .val(objRecr[codeObj]).autoNumeric('get')
					paramfirstobj["value"] = amount;
					paramfirstobj["string"] = amount;
				}
				else
				{
					paramfirstobj["value"] = objRecr[codeObj];
					paramfirstobj["string"] = objRecr[codeObj];
				}
			}
			arrOfJsonObject.push(cloneNewObj);
		}

		doHandleDiscardedRecords(objOfClientPayMultiEnrich,arrOfJsonObject);

		return arrOfJsonObject;
	}
}

function doHandleAmountSummation() {
	var amount = 0.00;
	var multiAmount = getAmountSummationOfMultiSetEnrichment();
	var singleAmount = getAmountSummationOfSingleSetEnrichment()
	amount = multiAmount + singleAmount;
	$('#amount').val(amount);
	blnAutoNumeric = isAutoNumericApplied('amount');
	if (blnAutoNumeric)
	{
		$('#amount').autoNumeric('destroy');
		//$('#amount').autoNumeric('set',amount);
		$('#amount').autoNumeric("init",
				{
						aSep: strGroupSeparator,
						dGroup: strAmountDigitGroup,
						aDec: strDecimalSeparator,
						mDec: strAmountMinFraction,
						vMin: 0.0000,
						vMax: 99999999999999.99
				});
	}
	$('#calculatedAmount').text($('#amount').val());
}
function getAmountSummationOfSingleSetEnrichment() {
	// return; //TODO: Handle properly with new table structure/
	var amount = 0.00;
	var field = null, fieldName = null;
	var discountFlag = false, discountSequence = null;
	if (paymentResponseInstrumentData)
		if (paymentResponseInstrumentData.d.paymentEntry.enrichments) {
			$.each(paymentResponseInstrumentData.d.paymentEntry.enrichments,
					function(key, value) {
						if ((key === 'udeEnrichment'
								|| key === 'productEnrichment'
								|| key === 'myproductEnrichment' || key === 'clientEnrichment')
								&& value.parameters) {
							arrFields = value.parameters;
							if (arrFields && arrFields.length > 0)
								$.each(arrFields, function(index, cfg) {
									fieldName = cfg.fieldName || cfg.code;
									field = $('#' + fieldName);
									var blnAutoNumeric = false;
									var objFieldVal = field.val();
									blnAutoNumeric = isAutoNumericApplied(fieldName);
									if (blnAutoNumeric)
										objFieldVal = parseFloat(field.autoNumeric('get'));
									
									if (objFieldVal == 'DISCOUNT') {
										discountFlag = true;
										discountSequence = (cfg.sequenceNmbr + 1);
									}
									if (cfg.includeInTotal === 'A'
											&& !discountFlag) {
										if (!isEmpty(objFieldVal)
												&& !isNaN(objFieldVal))
											amount += parseFloat(objFieldVal);
									} else if (cfg.includeInTotal === 'S') {
										if (!isEmpty(objFieldVal)
												&& !isNaN(objFieldVal))
											amount -= parseFloat(objFieldVal);
									} else if (discountFlag
											&& discountSequence == cfg.sequenceNmbr) {
										if (!isEmpty(objFieldVal)
												&& !isNaN(objFieldVal))
											amount -= parseFloat(objFieldVal);
										discountFlag = false;
										discountSequence = null;
									}

								});
						}
					});

		}
	return amount;
}
function getAmountSummationOfMultiSetEnrichment() {
	var amount = 0.00;
	amount += getAmountSummation('BANKPRDMSE');
	amount += getAmountSummation('MYPPRDMSE');
	amount += getAmountSummation('CLIPPRDMSE');
	return amount;
}
function getAmountSummation(strEnrType) {
	var arrCfg = new Array();
	var objGrid = null;
	var retValue = 0.00;
	if (strEnrType === 'BANKPRDMSE'
			&& objPaymentBankProductMultiSetEnrichmentsParamArrayMetaData) {
		arrCfg = objPaymentBankProductMultiSetEnrichmentsParamArrayMetaData;
		objGrid = objBankProductMultisetGrid;
	} else if (strEnrType === 'MYPPRDMSE'
			&& objPaymentMyProductMultiSetEnrichmentsParamArrayMetaData) {
		arrCfg = objPaymentMyProductMultiSetEnrichmentsParamArrayMetaData;
		objGrid = objMyProductMultisetGrid;
	} else if (strEnrType === 'CLIPPRDMSE'
			&& objPaymentClientProductMultiSetEnrichmentsParamArrayMetaData) {
		arrCfg = objPaymentClientProductMultiSetEnrichmentsParamArrayMetaData;
		objGrid = objClientProductMultisetGrid;
	}
	if (objGrid && arrCfg) {
		var store = objGrid.getStore();
		var tempData = null;
		if (!isEmpty(store) && !isEmpty(store.data)) {
			var objStoreItems = store.data.items;
			if (!isEmpty(objStoreItems)) {
				$.each(arrCfg, function(idx, obj) {
							// obj.code == 'ENCCDTAX2', obj.includeInTotal ==
							// 'Y'
							if (obj && obj.includeInTotal === 'A') {
								for (var i = 0; i < objStoreItems.length; i++) {
									tempData = objStoreItems[i].data;
									if (tempData
											&& !isEmpty(tempData[obj.code])
											&& !isNaN(tempData[obj.code])) {
										retValue += parseFloat(tempData[obj.code]);
									}
								}
							} else if (obj && obj.includeInTotal === 'S') {
								for (var i = 0; i < objStoreItems.length; i++) {
									tempData = objStoreItems[i].data;
									if (tempData
											&& !isEmpty(tempData[obj.code])
											&& !isNaN(tempData[obj.code])) {
										retValue -= parseFloat(tempData[obj.code]);
									}
								}
							}
						});
			}
		}
	} 

	return retValue;
}

function resetMultiSetEnrichVariable() {
	/* Payment Bank Product Multi Enrichment */
	objPaymentBankProductMultiSetEnrichments = null;
	objPaymentBankProductMultiSetEnrichmentsParamArray = null;
	objPaymentBankProductMultiSetEnrichmentsMetaData = null;
	objPaymentBankProductMultiSetEnrichmentsParamArrayMetaData = null;
	objBankProductMultisetGrid = null;
	/* Payment My Product Multi Enrichment */
	objPaymentMyProductMultiSetEnrichments = null;
	objPaymentMyProductMultiSetEnrichmentsParamArray = null;
	objPaymentMyProductMultiSetEnrichmentsMetaData = null;
	objPaymentMyProductMultiSetEnrichmentsParamArrayMetaData = null;
	objMyProductMultisetGrid = null;
	/* Payment Client Product Multi set Enrichment */
	objPaymentClientProductMultiSetEnrichments = null;
	objPaymentClientProductMultiSetEnrichmentsParamArray = null;
	objPaymentClientProductMultiSetEnrichmentsMetaData = null;
	objPaymentClientProductMultiSetEnrichmentsParamArrayMetaData = null;
	objClientProductMultisetGrid = null;
}

function CTXAmountCalculation() {
	/* CTX - handling - Starts */
	$('#CTX01').attr('disabled', 'disabled');
	$('#CTX01').addClass('disabled');
	$('#CTX05').focusout(function() {
				calculateAmount();
			});
	$('#CTX06').focusout(function() {
				calculateAmount();
			});
	$('#CTX11').focusout(function() {
				calculateAmount();
			});

	function calculateAmount() {
		var blnInvAmount=false,blnDiscAmount=false,blnAdjAmount=false;
		
		var invAmount = $('#CTX05').val();
		blnInvAmount = isAutoNumericApplied('CTX05');
		if (blnInvAmount)
			invAmount = $("#CTX05").autoNumeric('get');
		
		var discAmount = $('#CTX06').val();
		blnDiscAmount = isAutoNumericApplied('CTX06');
		if (blnDiscAmount)
			discAmount = $("#CTX06").autoNumeric('get');
		
		var adjAmount = $('#CTX11').val();
		blnAdjAmount = isAutoNumericApplied('CTX11');
		if (blnAdjAmount)
			adjAmount = $("#CTX11").autoNumeric('get');
		
		if (isEmpty(invAmount) || isNaN(invAmount)) {
			invAmount = 0;
		}
		if (isEmpty(discAmount) || isNaN(discAmount)) {
			discAmount = 0;
		}
		if (isEmpty(adjAmount) || isNaN(adjAmount)) {
			adjAmount = 0;
		}
		
		if(adjAmount < 0 ){ 
			adjAmount = -1*parseFloat(adjAmount);
		}		
		
		var payAmnt = parseFloat(invAmount) - parseFloat(discAmount) - parseFloat(adjAmount);
		$('#CTX01').autoNumeric('set',payAmnt);

	}

	if ( '' != $('#CTX10').val()) {
		$('#CTX12').removeAttr('disabled');
		$('#CTX12').removeClass('disabled');
		$('#CTX11').removeAttr('disabled');
		$('#CTX11').removeClass('disabled');
		$("label[for='CTX11']").addClass('required');
		//$('#CTX11').val('0.00');
		$('#CTX11').addClass('requiredField');
		$('#CTX11').bind('blur', function() {markRequired($(this));});
		$('#CTX11').bind('focus', function() {removeMarkRequired($(this));});
		$('#CTX10-niceSelect').removeClass('requiredField');
		
	} else {
		$('#CTX12').attr('disabled', 'disabled');
		$('#CTX12').addClass('disabled');
		$('#CTX11').attr('disabled', 'disabled');
		$('#CTX11').val('');
		$('#CTX11').addClass('disabled');
		$("label[for='CTX11']").removeClass('required');
		$('#CTX11').removeClass('requiredField');		
	}

	$('#CTX10').change(function() {
		// In case of Option 'Select' and 'None' 
				if ('' === $('#CTX10').val()) {
					$('#CTX12').val('');
					$('#CTX12').attr('disabled', 'disabled');
					$('#CTX12').addClass('disabled');
					$('#CTX11').val('');
					$('#CTX11').attr('disabled', 'disabled');
					$('#CTX11').addClass('disabled');
				} else {
					$('#CTX12').removeAttr('disabled');
					$('#CTX12').removeClass('disabled');
					$('#CTX11').removeAttr('disabled');
					$('#CTX11').removeClass('disabled');
				}
			});

	function populateDependentValues(enr) {
		$.each(enr, function(index, cfg) {
					var $optns = $("#" + cfg.enrichmentCode).empty();
					$optns.append("<option value=>Select</option>");
					$.each(cfg.keyValue, function() {
								$optns.append("<option value=" + this.key + ">"
										+ this.value + "</option>");
							});
				});
	}
	/* CTX - handling - Ends */
}
function CTXFieldAdjustmentCodeDependentReset(){
	$('#CTX10').change(function(){
		$('#CTX12').val('');
		//$('#CTX11').val('0.00');
		$('#CTX11').trigger('focusout');
		CTXAmountCalculation();
	})
}
function doAmmountCalculationForCTX(strEnrichType) {
	var arrCfg = new Array();
	var objGrid = null;
	var retValue = 0.00;

	if (strEnrichType === 'BANKPRDMSE'
			&& objPaymentBankProductMultiSetEnrichmentsParamArrayMetaData
			&& objPaymentBankProductMultiSetEnrichmentsMetaData) {
		// data = objPaymentBankProductMultiSetEnrichments
		// arrCfg = objPaymentBankProductMultiSetEnrichmentsParamArray;
		data = objPaymentBankProductMultiSetEnrichmentsMetaData;
		arrCfg = objPaymentBankProductMultiSetEnrichmentsParamArrayMetaData;
		objGrid = objBankProductMultisetGrid;
	} else
		return;

	if (data && data[0].profileId && data[0].profileId === 'CTX') {

		if (objGrid && arrCfg) {
			var store = objGrid.getStore();
			var tempData = null;
			if (!isEmpty(store) && !isEmpty(store.data)) {
				var objStoreItems = store.data.items;
				if (!isEmpty(objStoreItems)) {
					$.each(arrCfg, function(idx, obj) {
								if (obj.code === 'CTX01') {
									for (var i = 0; i < objStoreItems.length; i++) {
										tempData = objStoreItems[i].data;
										if (tempData
												&& !isEmpty(tempData[obj.code])
												&& !isNaN(tempData[obj.code])) {
											retValue += parseFloat(tempData[obj.code]);
										}
									}
								}
							});
				}
			}
		}
		return retValue;
		// doTransctionAmountHandleing(retValue); Commented for jira
		// FTREPUBLIC-82 as discussed.
	}
}

function getBankProductMultiSetEnrichmentJsonArrayForMetaData() {
	var arrOfJsonObject = new Array(), objOfPayMultiEnrich;
	if (!isEmpty(objPaymentBankProductMultiSetEnrichmentsMetaData)) {
		objOfPayMultiEnrich = objPaymentBankProductMultiSetEnrichmentsMetaData[0];
		arrOfJsonObject.push(objOfPayMultiEnrich);
	}
	return arrOfJsonObject;
}

function getMyProductMultiSetEnrichmentJsonArrayMetaData() {
	var arrOfJsonObject = new Array(), objOfPayMultiEnrich;
	if (!isEmpty(objPaymentMyProductMultiSetEnrichmentsMetaData)) {
		objOfPayMultiEnrich = objPaymentMyProductMultiSetEnrichmentsMetaData[0];
		arrOfJsonObject.push(objOfPayMultiEnrich);
	}
	return arrOfJsonObject;
}

function getClientProductMultiSetEnrichmentJsonArrayForMetaData() {
	var arrOfJsonObject = new Array(), objOfPayMultiEnrich;
	if (!isEmpty(objPaymentClientProductMultiSetEnrichmentsMetaData)) {
		objOfPayMultiEnrich = objPaymentClientProductMultiSetEnrichmentsMetaData[0];
		arrOfJsonObject.push(objOfPayMultiEnrich);
	}
	return arrOfJsonObject;
}

function generateJsonForDepenentField(argsData) {
	if (!isEmpty(argsData) && !isEmpty(argsData.strEnrichType)) {
		var arrEnrichParam = new Array(), strEnrichType, objArrEnrich, strTargetDivId, field, objFieldVal;
		strEnrichType = argsData.strEnrichType;
		strTargetDivId = getPopUpDivId(strEnrichType);
		var arrOfJsonObject = new Array();

		if (strEnrichType === 'BANKPRDMSE') {
			objArrEnrich = objPaymentBankProductMultiSetEnrichmentsMetaData[0];
		} else if (strEnrichType === 'CLIPRDMSE') {
			objArrEnrich = objPaymentClientProductMultiSetEnrichmentsMetaData[0];
		} else if (strEnrichType === 'MYPPRDMSE') {
			objArrEnrich = objPaymentMyProductMultiSetEnrichmentsMetaData[0];
		}

		if (objArrEnrich) {
			var cloneNewObj = createCopyOfMultiSetEnrichObj(objArrEnrich);
			arrEnrichParam = cloneNewObj.parameters;
			$.each(arrEnrichParam, function(index, cfg) {
						field = $('#' + strTargetDivId).find('#' + cfg.code);
						objFieldVal = field.val();

						var paramfirstobj = cfg;
						var codeObj = paramfirstobj.code;
						var disTyp = paramfirstobj.displayType;
						cfg["value"] = objFieldVal;
						cfg["string"] = objFieldVal;
					});
			arrOfJsonObject.push(cloneNewObj);
		}
		return arrOfJsonObject;
	}
}

function doHandleENRValidation(strEnrichType) {
	var strValidationFlag = null;
	var arrError = new Array();
	var strErrDiv = null;
	var strDivId = getPopUpDivId(strEnrichType);
	if (strEnrichType === 'BANKPRDMSE')
		strErrDiv = '#errMsgBERN';
	else if (strEnrichType === 'MYPPRDMSE')
		strErrDiv = '#errMsgMPERN';
	else if (strEnrichType === 'CLIPRDMSE')
		strErrDiv = '#errMsgCPERN';

	$('#' + strDivId + ' #EENR02').change(function() {
		var strValue = $('#' + strDivId + ' #EENR02').val();
		var msg = $("label[for='" + $(this).attr("id") + "']").text()
				+ " is not a valid Check Digit Number.";
		if (strValue.length == '9') {
			strValidationFlag = isValidFedAba(strValue);
			if (strValidationFlag === false) {
				$(strErrDiv).empty();
				element = $('<li class="error-msg-color">').text(msg);
				element.appendTo($(strErrDiv));
				$(strErrDiv).removeClass('ui-helper-hidden');
			} else {
				$(strErrDiv).empty();
				$(strErrDiv).addClass('ui-helper-hidden');
			}
		} else {
			$(strErrDiv).empty();
			element = $('<li class="error-msg-color">').text(msg);
			element.appendTo($(strErrDiv));
			$(strErrDiv).removeClass('ui-helper-hidden');
		}
	});
}
function doValidateCTXAmount(strEnrichType,isViewOnly) {
	var data = null, txnAmount = null,blnAutoNumeric = false;var objGrid = objBankProductMultisetGrid;
	var isViewOnly = !isEmpty(isViewOnly) ? isViewOnly : false;
	if (strEnrichType === 'BANKPRDMSE'
			&& objPaymentBankProductMultiSetEnrichmentsParamArrayMetaData
			&& objPaymentBankProductMultiSetEnrichmentsMetaData && objGrid && objGrid.getStore().data.items.length > 0) {
		data = objPaymentBankProductMultiSetEnrichmentsMetaData;		
	} else
		return;

	if (data && data[0].profileId && data[0].profileId === 'CTX') {
		var payAmount = $('#CTX01').val();
		if(isViewOnly === true){
			if(paymentResponseInstrumentData.d
					&& paymentResponseInstrumentData.d.paymentEntry
					&& paymentResponseInstrumentData.d.paymentEntry.standardField){
				arrStdFields = paymentResponseInstrumentData.d.paymentEntry.standardField;
				if (arrStdFields && arrStdFields.length > 0) {
					$.each(arrStdFields, function(index, cfg) {
						fieldId = cfg.fieldName;
						if(fieldId === 'amount')
							txnAmount = cfg.value;
					});
				}
			}
		}
		else{
			txnAmount = $('#amount').val();
			// jquery autoNumeric formatting
			blnAutoNumeric = isAutoNumericApplied('amount');
			if (blnAutoNumeric)
				txnAmount = $("#amount").autoNumeric('get');
			// jquery autoNumeric formatting
		}
		var payAmnt = doAmmountCalculationForCTX(strEnrichType);
		var txnAmnt = parseFloat(txnAmount);
		if (payAmnt !== txnAmnt) {
			var arrError = new Array();
			arrError.push({
						"errorCode" : "Message",
						"errorMessage" : mapLbl['ctxPayAmntTxnAmntMismatch']
					});
			paintErrors(arrError,null,getLabel('warnLbl','WARNING'));
			$("html, body").animate({
			scrollTop : 0
		}, "slow");
		}
	}
}

function doHandleDiscardedRecords(multisetEnrichdata,jsonDataObject){

	if(!Ext.isEmpty(discardedRecordsArray)){
		for (var i = 0; i < discardedRecordsArray.length; i++) {
			var objRecr = discardedRecordsArray[i].data;
			var cloneNewObj = createCopyOfMultiSetEnrichObj(multisetEnrichdata);
			var objParam = cloneNewObj.parameters;
			for (var j = 0; j < objParam.length; j++) {
				var paramfirstobj = objParam[j];
				var codeObj = paramfirstobj.code;
				paramfirstobj["value"] = objRecr[codeObj];
				paramfirstobj["string"] = objRecr[codeObj];
			}
			cloneNewObj.discardedFlag = true;
			jsonDataObject.push(cloneNewObj);
		}
		discardedRecordsArray=[];
	}
}

function handlePayEnrichSelect(arrPrdEnr){
	if (arrPrdEnr) {
		$.each(arrPrdEnr, function(index, cfg) {
			if(!isEmpty(cfg)){
				if(cfg.code){
					var objId = cfg.code;
					if(cfg.displayType === 4 && !cfg.allowAdhocValue){
						$('#'+objId).niceSelect("destroy");
						$('#'+objId).niceSelect();
						$('#'+objId).niceSelect("update");
						$('#'+objId+'-niceSelect').bind('blur', function mark() {
								markRequired($(this));
							});
					}
					
					if(cfg.code == 'CTX11' || cfg.code == 'CTXSD111'){
						   $('#'+objId).bind('blur', function() {
								markAmtNegative($(this));
								});
					   }
				}
			}
		});
	}
}

function markAmtNegative(me){
	if (me[0].value > 0)
		return me[0].value = '-' + me[0].value;
}