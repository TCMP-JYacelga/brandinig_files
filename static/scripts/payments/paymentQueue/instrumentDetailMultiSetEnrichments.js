/* Payment Bank Product Multi Enrichment */

var objPaymentBankProductMultiSetEnrichments = null;
var objPaymentBankProductMultiSetEnrichmentsParamArray = null;
var objPaymentBankProductMultiSetEnrichmentsMetaData = null;
var objPaymentBankProductMultiSetEnrichmentsParamArrayMetaData = null;
var objBankProductMultisetGrid = null;
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

function paintPaymentBankProductMultiSetEnrichments(data, dataMetaData,
		intCounter, strTargetId, flag, isViewOnly) {

	objPaymentBankProductMultiSetEnrichments = data;
	objPaymentBankProductMultiSetEnrichmentsMetaData = dataMetaData;
	if (data && data.length > 0)
		objPaymentBankProductMultiSetEnrichmentsParamArray = data[0].parameters;
	if (dataMetaData && dataMetaData.length > 0)
		objPaymentBankProductMultiSetEnrichmentsParamArrayMetaData = dataMetaData[0].parameters;
	else
		return;
	var targetDiv = $('#' + strTargetId), label = null, div = null, smartGirdDiv = null, popupDiv = null, linkDiv = null, ctrlBtn = null;
	targetDiv.removeClass('hidden');
	div = $('<div>').attr({
				'class' : 'col-sm-12',
				'id' : 'entricmentDiv'
			});
	$('#popupDiv').remove();
	popupDiv = $('<div>').attr({
		'class' : 'ui-helper-hidden extrapadding_bottom ux_panel-transparent-background',
		'id' : 'popupDiv'
	});
	if (isViewOnly !== true) {
		ctrlBtn = createButton('btnAddEnrichments', 'S');
		ctrlBtn.click(function() {
					getProdMultiSetEnrichmentsPopup('BANKPRDMSE');
				});
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
	/* CTX - handling - Ends */
}
function addBankProdMultiSetEnrichFieldsToPopup(callFrom) {
	var intCounter = 1;
	var paramArr = null;
	var argsData = {
		'strTargetDiv' : 'popupDiv',
		'strEnrichType' : 'BANKPRDMSE'
	};
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

	}
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
				objPaymentBankProductMultiSetEnrichmentsParamArray = dataTemp[0].parameters;
				objPaymentBankProductMultiSetEnrichmentsParamArrayMetaData = dataTempMetaData[0].parameters;
				addBankProdMultiSetEnrichFieldsToPopup("refreshEnrich");
			}
		} else if (enrichData.myProductMultiSet
				&& strEnrichType === 'MYPPRDMSE') {
			dataTemp = enrichData.myProductMultiSet;
			dataTempMetaData = enrichData.myProductMultiSetMetadata;
			if (dataTemp) {
				objPaymentMyProductMultiSetEnrichments = dataTemp;
				objPaymentMyProductMultiSetEnrichmentsMetaData = dataTempMetaData;
				objPaymentMyProductMultiSetEnrichmentsParamArray = dataTemp[0].parameters;
				objPaymentMyProductMultiSetEnrichmentsParamArrayMetaData = dataTempMetaData[0].parameters;
				addMyProdMultiSetEnrichFieldsToPopup("refreshEnrich");
			}
		} else if (enrichData.clientMultiSet && strEnrichType === 'CLIPRDMSE') {
			dataTemp = enrichData.clientMultiSet;
			dataTempMetaData = enrichData.clientMultiSetMetadata;
			if (dataTemp) {
				objPaymentClientProductMultiSetEnrichments = dataTemp;
				objPaymentClientProductMultiSetEnrichmentsMetaData = dataTempMetaData;
				objPaymentClientProductMultiSetEnrichmentsParamArray = dataTemp[0].parameters;
				objPaymentClientProductMultiSetEnrichmentsParamArrayMetaData = dataTempMetaData[0].parameters;
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

		if (!isEmpty(strDivId)) {
			buttonsOpts[mapLbl['btnSave']] = function() {
				doClearMessageSection();
				canSave = validatePopupFields(strDivId);
				if (!canSave) {
					$(strErrDiv).empty();
					element = $('<li class="error-msg-color">')
							.text("Please enter mandatory fields.");
					element.appendTo($(strErrDiv));
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
			};
			buttonsOpts[mapLbl['btnCancel']] = function() {
				$('#' + strDivId).find('input:text, textarea, select').each(
						function() {
							$(this).removeClass('requiredField');
						});
				$(strErrDiv).addClass('ui-helper-hidden');
				$(this).dialog("close");
				doClearMultiSelectEnrichmentPopup(strEnrichType);
				$(this).dialog('destroy');
			};

			$('#' + strDivId).dialog({
						autoOpen : false,
						width : 600,
						modal : true,
						dialogClass : "hide-title-bar",
						// title : mapLbl['btnAddEnrichments'],
						buttons : buttonsOpts
					});
			$('#' + strDivId).dialog("open");
			handleEmptyEnrichmentDivs();
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
function createSmartGridOfPayBankProductMultiSetEnrich(data, isViewOnly) {
	if (!Ext.isEmpty(objBankProductMultisetGrid))
		Ext.destroy(objBankProductMultisetGrid);

	$('#smartgrid').empty();
	var gridData = data[0];
	var gridCols = new Array();
	var storeFieldArray = new Array();
	var arrCols = null;
	var dispType = null, gridColId = null;
	for (var i = 0; i < gridData.parameters.length; i++) {
		if (gridData.parameters[i].displayType === 3)
			dispType = 'number';
		else
			dispType = 'content';
		storeFieldArray.push(gridData.parameters[i].code);
		gridColId = gridData.parameters[i].code;
		if (gridData.parameters[i].displayType === 4) {
			storeFieldArray.push(gridData.parameters[i].code + "desc");
			gridColId = gridData.parameters[i].code + "desc";
		}
		gridCols.push({
					"colId" : gridColId,
					"colDesc" : gridData.parameters[i].description,
					"colType" : dispType,
					"locked" : false,
					"lockable" : false,
					"sortable" : false,
					"hideable" : false,
					"draggable" : false,
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
						if (objOfParam && objOfParam.code) {
							if (objOfParam.displayType === 4) {
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
	var arrEnrichParam = new Array(), field = null;
	var strErrDiv = null;

	if (strEnrichType === 'BANKPRDMSE') {
		arrEnrichParam = objPaymentBankProductMultiSetEnrichmentsParamArrayMetaData;
		strErrDiv = '#errMsgBERN';
	} else if (strEnrichType === 'CLIPRDMSE') {
		arrEnrichParam = objPaymentClientProductMultiSetEnrichmentsParamArrayMetaData;
		strErrDiv = '#errMsgCPERN';
	} else if (strEnrichType === 'MYPPRDMSE') {
		arrEnrichParam = objPaymentMyProductMultiSetEnrichmentsParamArrayMetaData;
		strErrDiv = '#errMsgMPERN';
	}

	if (record.data && strTargetDivId) {

		var objbuttonsOpts = {};
		var objEditEnrichmentPopup;
		doClearMultiSelectEnrichmentPopup(strEnrichType);
		objbuttonsOpts[mapLbl['btnUpdate']] = function() {
			doClearMessageSection();
			canUpdate = validatePopupFields(strTargetDivId);
			if (!canUpdate) {
				$(strErrDiv).empty();
				element = $('<li class="error-msg-color">')
						.text(getLabel('enterMandatoryFieldslbl', 'Please enter mandatory fields.'));
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
		};
		objbuttonsOpts[mapLbl['btnCancel']] = function() {
			$(strErrDiv).addClass('ui-helper-hidden');
			$(this).dialog("close");
			doClearMultiSelectEnrichmentPopup(strEnrichType);
			$(this).dialog('destroy');
		};
		objEditEnrichmentPopup = $('#' + strTargetDivId).dialog({
					autoOpen : false,
					width : 600,
					modal : true,
					dialogClass : "hide-title-bar",
					// title : mapLbl['btnAddEnrichments'],
					buttons : objbuttonsOpts
				});
		if (arrEnrichParam) {
			$.each(arrEnrichParam, function(index, cfg) {
						field = $('#' + strTargetDivId).find('#' + cfg.code);
						field.val(record.data[cfg.code] || '');
					});
		}
		objEditEnrichmentPopup.dialog('open');
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
		objGrid.getStore().remove(record);
		objGrid.getView().refresh();
		if (strLayoutType === 'TAXLAYOUT')
			doHandleAmountSummation();
	}

}
function doClearMultiSelectEnrichmentPopup(strEnrichType) {
	var strDivId = getPopUpDivId(strEnrichType);
	if (!isEmpty(strDivId)) {
		$('#' + strDivId).find('input:text, textarea, select').each(function() {
					if ($(this).is('select')) {
						if ($(this).find("option:contains('')"))
							$(this).val('');
						else
							$(this).find("option:first").attr('selected',
									'selected');
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
		arrEnrichParam) {
	var objFieldVal = null, field = null, code = null;
	if (arrEnrichParam) {
		$.each(arrEnrichParam, function(index, cfg) {
					field = objEditBankEnrichmentPopup.find('#' + cfg.code);
					objFieldVal = field.val() || '';
					code = cfg.code;
					if (recordObj) {
						recordObj.set(code, objFieldVal);
					}
				});
	}
	objEditBankEnrichmentPopup.dialog("close");
}

function getColumnsOfPayBankProdMultiSetEnrichGrid(arrColsPref, isViewOnly) {
	var me = this;
	var arrCols = new Array(), objCol = null, cfgCol = null;
	if (isViewOnly !== true)
		arrCols.push(me.createActionColumnOfPayMultiSetEnrichGrid());
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
			cfgCol.fnColumnRenderer = me.columnRenderer;
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
		width : 70,
		align : 'right',
		sortable : false,
		locked : true,
		items : [{
					itemId : 'edit',
					itemCls : 'grid-row-action-icon icon-edit',
					toolTip : mapLbl['btnEdit']
				}, {
					itemId : 'delete',
					itemCls : 'grid-row-action-icon icon-delete',
					toolTip : mapLbl['btnDelete']
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
					objFieldVal = $('#' + cfg.code).val();
					var code = cfg.code;
					if (objFieldVal) {
						dataobj[code] = objFieldVal;
					}
					var desc = cfg.value;
					if (objFieldVal) {
						if(cfg.displayType === 4){
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
	var strRetValue = "";
	strRetValue = value;
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
			var objRecr = arrOfGridRecord[i].data, arrRecord = [];;
			var cloneNewObj = createCopyOfMultiSetEnrichObj(objOfPayMultiEnrich);
			var objParam = cloneNewObj.parameters;
			for (var j = 0; j < objParam.length; j++) {
				//var paramfirstobj = objParam[j];
				var codeObj = objParam[j].code;
				var paramfirstobj = {'code' : codeObj};
				paramfirstobj["value"] = objRecr[codeObj];
				paramfirstobj["string"] = objRecr[codeObj];
				arrRecord.push(paramfirstobj);
			}
			cloneNewObj.parameters = arrRecord;
			arrOfJsonObject.push(cloneNewObj);
		}

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
				'class' : 'col-sm-12',
				'id' : 'myprodentricmentDiv'
			});
	myProdPopupDiv = $('<div>').attr({
		'class' : 'ui-helper-hidden extrapadding_bottom ux_panel-transparent-background',
		'id' : 'myprodpopupDiv'
	});

	if (isViewOnly !== true) {
		ctrlBtn = createButton('btnAddEnrichments', 'S');
		ctrlBtn.click(function() {
					getProdMultiSetEnrichmentsPopup('MYPPRDMSE');
				});
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
	$('#myprodsmartgrid').empty();
	var myProdGridData = data[0];
	var myProdFGridCols = new Array();
	var storeFieldArray = new Array();
	var myProdArrCols = null, gridColId = null;
	var dispType = null;
	for (var i = 0; i < myProdGridData.parameters.length; i++) {
		if (myProdGridData.parameters[i].displayType === 3)
			dispType = 'number';
		else
			dispType = 'content';

		storeFieldArray.push(myProdGridData.parameters[i].code);
		gridColId = myProdGridData.parameters[i].code;
		if (myProdGridData.parameters[i].displayType === 4) {
			storeFieldArray.push(myProdGridData.parameters[i].code + "desc");
			gridColId = myProdGridData.parameters[i].code + "desc";
		}
		myProdFGridCols.push({
					"colId" : myProdGridData.parameters[i].code,
					"colDesc" : myProdGridData.parameters[i].description,
					"colType" : dispType
					
				});
	}
	myProdArrCols = getColumnsOfPayMyProdMultiSetEnrichGrid(myProdFGridCols,
			isViewOnly);
	Ext.application({
				name : 'GCP',
				launch : function() {
					objMyProductMultisetGrid = Ext.create(
							'Ext.ux.gcp.SmartGrid', {
								showPager : false,
								showAllRecords : true,
								itemId : 'myProdEnrichmentGrid',
								stateful : false,
								showEmptyRow : false,
								showCheckBoxColumn : false,
								padding : '5 0 0 0',
								minHeight : 150,
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
			cfgCol.fnColumnRenderer = me.columnRenderer;
			arrCols.push(cfgCol);
		}
	}
	return arrCols;
}
function createActionColumnOfPayMyProdMultiSetEnrichGrid() {
	var me = this;
	var objActionCol = {
		colType : 'actioncontent',
		colId : 'action',
		width : 70,
		align : 'right',
		sortable : false,
		locked : true,
		items : [{
					itemId : 'edit',
					itemCls : 'grid-row-action-icon icon-edit',
					toolTip : mapLbl['btnEdit']
				}, {
					itemId : 'delete',
					itemCls : 'grid-row-action-icon icon-delete',
					toolTip : mapLbl['btnDelete']
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

	if (paramArr)
		intCounter = paintPaymentEnrichmentsHelper(paramArr, intCounter,
				'myprodpopupDiv', 'Q', argsData, true);
}
function loadPayMyProdMultiSetEnrichGrid(grid) {
	if (objPaymentMyProductMultiSetEnrichments) {
		var arrGridStoreData = new Array(), isRecordEmpty = false, intCnt = 0;
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
						if (objOfParam && objOfParam.code) {
							if (objOfParam.displayType === 4) {
								var objDispVal = getEnrichValueToDispayed(objOfParam);
								eachMultiEnrichDataObj[objOfParam.code + "desc"] = objDispVal;
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
			var objRecr = arrOfGridRecord[i].data,arrRecord = [];
			var cloneNewObj = createCopyOfMultiSetEnrichObj(objOfPayMultiEnrich);
			var objParam = cloneNewObj.parameters;
			for (var j = 0; j < objParam.length; j++) {
				//var paramfirstobj = objParam[j];
				var codeObj = objParam[j].code;
				var paramfirstobj = {'code' : codeObj};
				paramfirstobj["value"] = objRecr[codeObj];
				paramfirstobj["string"] = objRecr[codeObj];
				arrRecord.push(paramfirstobj);
			}
			cloneNewObj.parameters = arrRecord;
			arrOfJsonObject.push(cloneNewObj);
		}
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
				'class' : 'col-sm-12',
				'id' : 'clientprodentricmentDiv'
			});
	clientProdPopupDiv = $('<div>').attr({
		'class' : 'ui-helper-hidden extrapadding_bottom ux_panel-transparent-background',
		'id' : 'clientprodpopupDiv'
	});
	if (isViewOnly !== true) {
		ctrlBtn = createButton('btnAddEnrichments', 'S');
		ctrlBtn.click(function() {
					getProdMultiSetEnrichmentsPopup('CLIPRDMSE');
				});
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
	for (var i = 0; i < clientProdGridData.parameters.length; i++) {
		if (clientProdGridData.parameters[i].displayType === 3)
			dispType = 'number';
		else
			dispType = 'content';
		storeFieldArray.push(clientProdGridData.parameters[i].code);
		gridColId = clientProdGridData.parameters[i].code;
		if (clientProdGridData.parameters[i].displayType === 4) {
			storeFieldArray
					.push(clientProdGridData.parameters[i].code + "desc");
			gridColId = clientProdGridData.parameters[i].code + "desc";
		}
		clientProdFGridCols.push({
					"colId" : clientProdGridData.parameters[i].code,
					"colDesc" : clientProdGridData.parameters[i].description,
					"colType" : dispType,
					"locked" : false,
					"sortable" : false,
					"hideable" : false,
					"draggable" : false,
					"minWidth" : 120,
					"width" : 'auto'
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
								padding : '5 0 0 0',
								minHeight : 150,
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
			cfgCol.fnColumnRenderer = me.columnRenderer;
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
		width : 70,
		align : 'right',
		sortable : false,
		locked : true,
		items : [{
					itemId : 'edit',
					itemCls : 'grid-row-action-icon icon-edit',
					toolTip : mapLbl['btnEdit']
				}, {
					itemId : 'delete',
					itemCls : 'grid-row-action-icon icon-delete',
					toolTip : mapLbl['btnDelete']
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

	if (paramArr)
		intCounter = paintPaymentEnrichmentsHelper(paramArr, intCounter,
				'clientprodpopupDiv', 'Q', argsData, true);
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
							if (objOfParam.displayType === 4) {
								var objDispVal = getValueToDispayed(objOfParam);
								eachMultiEnrichDataObj[objOfParam.code + "desc"] = objDispVal;
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
			var objRecr = arrOfGridRecord[i].data, arrRecord=[];
			var cloneNewObj = createCopyOfMultiSetEnrichObj(objOfClientPayMultiEnrich);
			var objParam = cloneNewObj.parameters;
			for (var j = 0; j < objParam.length; j++) {
				//var paramfirstobj = objParam[j];
				var codeObj = objParam[j].code;
				var paramfirstobj = {'code' : codeObj};
				paramfirstobj["value"] = objRecr[codeObj];
				paramfirstobj["string"] = objRecr[codeObj];
				arrRecord.push(paramfirstobj);
			}
			cloneNewObj.parameters = arrRecord;
			arrOfJsonObject.push(cloneNewObj);
		}
		return arrOfJsonObject;
	}
}

function doHandleAmountSummation() {
	var amount = 0.00;
	var multiAmount = getAmountSummationOfMultiSetEnrichment();
	var singleAmount = getAmountSummationOfSingleSetEnrichment()
	amount = multiAmount + singleAmount;
	amount = parseFloat(amount).toFixed(2)
	$('#amount').val(amount);
	$('#calculatedAmount').text(amount);
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
									if (field.val() == 'DISCOUNT') {
										discountFlag = true;
										discountSequence = (cfg.sequenceNmbr + 1);
									}
									if (cfg.includeInTotal === 'A'
											&& !discountFlag) {
										if (!isEmpty(field.val())
												&& !isNaN(field.val()))
											amount += parseFloat(field.val());
									} else if (cfg.includeInTotal === 'S') {
										if (!isEmpty(field.val())
												&& !isNaN(field.val()))
											amount -= parseFloat(field.val());
									} else if (discountFlag
											&& discountSequence == cfg.sequenceNmbr) {
										if (!isEmpty(field.val())
												&& !isNaN(field.val()))
											amount -= parseFloat(field.val());
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
				var txnAmount = $('#CTX05').val();
				if (!isEmpty(txnAmount) && !isNaN(txnAmount)) {
					txnAmount = parseFloat(txnAmount);
					$('#CTX05').val(txnAmount.toFixed(2));
				} else {
					$('#CTX05').val('');
				}
			});
	$('#CTX06').focusout(function() {
				calculateAmount();
				var txnAmount = $('#CTX06').val();
				if (!isEmpty(txnAmount) && !isNaN(txnAmount)) {
					txnAmount = parseFloat(txnAmount);
					$('#CTX06').val(txnAmount.toFixed(2));
				} else {
					$('#CTX06').val('');
				}
			});
	$('#CTX11').focusout(function() {
				calculateAmount();
				var txnAmount = $('#CTX11').val();
				if (!isEmpty(txnAmount) && !isNaN(txnAmount)) {
					txnAmount = parseFloat(txnAmount);
					$('#CTX11').val(txnAmount.toFixed(2));
				} else {
					$('#CTX11').val('');
				}
			});

	function calculateAmount() {
		var invAmount = $('#CTX05').val();
		var discAmount = $('#CTX06').val();
		var adjAmount = $('#CTX11').val();
		if (isEmpty(invAmount) || isNaN(invAmount)) {
			invAmount = 0;
		}
		if (isEmpty(discAmount) || isNaN(discAmount)) {
			discAmount = 0;
		}
		if (isEmpty(adjAmount) || isNaN(adjAmount)) {
			adjAmount = 0;
		}
		var payAmnt = parseFloat(invAmount).toFixed(2)
				- parseFloat(discAmount).toFixed(2)
				- parseFloat(adjAmount).toFixed(2);
		payAmnt = parseFloat(payAmnt).toFixed(2);
		$('#CTX01').val(payAmnt);

	}

	if ('None' != $('#CTX10').val()) {
		$('#CTX12').removeAttr('disabled');
		$('#CTX12').removeClass('disabled');
		$('#CTX11').removeAttr('disabled');
		$('#CTX11').removeClass('disabled');
	} else {
		$('#CTX12').attr('disabled', 'disabled');
		$('#CTX12').addClass('disabled');
		$('#CTX11').attr('disabled', 'disabled');
		$('#CTX11').addClass('disabled');
	}

	$('#CTX10').change(function() {
				if ('None' === $('#CTX10').val()) {
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
		$('#CTX11').val('0.00');
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
				+ "is not a valid Check Digit Number.";
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
function doValidateCTXAmount(strEnrichType) {
	var data = null, blnAutoNumeric = false;
	if (strEnrichType === 'BANKPRDMSE'
			&& objPaymentBankProductMultiSetEnrichmentsParamArrayMetaData
			&& objPaymentBankProductMultiSetEnrichmentsMetaData) {
		data = objPaymentBankProductMultiSetEnrichmentsMetaData;
	} else
		return;

	if (data && data[0].profileId && data[0].profileId === 'CTX') {
		var payAmount = $('#CTX01').val(),txnAmount = $('#amount').val(), payAmnt = 0, txnAmnt = 0, arrError = null;
		blnAutoNumeric = isAutoNumericApplied('amount');
		if(blnAutoNumeric){
			txnAmount = $("#amount").autoNumeric('get');
		}
		payAmnt = doAmmountCalculationForCTX(strEnrichType);
		txnAmnt = parseFloat(txnAmount).toFixed(2);
		if (payAmnt != txnAmnt) {
			arrError = new Array();
			arrError.push({
						"errorCode" : "Message",
						"errorMessage" : mapLbl['ctxPayAmntTxnAmntMismatch']
					});
			paintErrors(arrError);
			$("html, body").animate({
			scrollTop : 0
		}, "slow");
		}
	}
}