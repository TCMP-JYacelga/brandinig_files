/**
 * @class GCP.controller.BatchViewController
 * @extends Ext.app.Controller
 * @author Vinay Thube
 */
/**
 * This controller is prime controller in Payment Queue View which handles all
 * measure events fired from Grid.
 */
Ext.define('GCP.controller.BatchViewController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.DateUtil'],
	views : ['GCP.view.PaymentQueueGridView', 'GCP.view.HistoryPopup',
			'GCP.view.PaymentQueueActionResult',
			'GCP.view.PaymentQueueRemarkPopup'],
	refs : [{
				ref : 'paymentQueueGridView',
				selector : 'paymentQueueGridView[itemId="paymentQueueInstrumentGrid"]'
			}, {
				ref : 'actionResult',
				selector : 'paymentQueueActionResult'
			}],
	config : {
		processingQueueTypeCode : strPaymentQueueType,
		sellerCode : null,
		clientCode : null,
		processingQueueTypeDesc : null,//getLabel('verifyQueue', 'Verify'),
		processingQueueSourceType : 'I',
		strDefaultMask : '0000000000000000',
		intMaskSize : 16
	},
	init : function() {
		var me = this;
		me.updateConfig();
		me.control({
			'paymentQueueGridView[itemId="paymentQueueInstrumentGrid"]' : {
				'render' : function(panel) {
					me.handleGridReconfigure();
				}
			},
			'paymentQueueGridView[itemId="paymentQueueInstrumentGrid"] smartgrid' : {
				'render' : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
				},
				'gridPageChange' : function(objGrid, strDataUrl, intPgSize,
						intNewPgNo, intOldPgNo, jsonSorter) {
					me.handleLoadGridData(objGrid, strDataUrl, intPgSize,
							intNewPgNo, intOldPgNo, jsonSorter);
				},
				'gridSortChange' : function(objGrid, strDataUrl, intPgSize,
						intNewPgNo, intOldPgNo, jsonSorter) {
					me.handleLoadGridData(objGrid, strDataUrl, intPgSize,
							intNewPgNo, intOldPgNo, jsonSorter);
				},
				'gridRowSelectionChange' : function(objGrid, objRecord,
						intRecordIndex, arrSelectedRecords, jsonData) {
					me.doHandleGridRowSelectionChange(objGrid, objRecord,
							intRecordIndex, arrSelectedRecords, jsonData);
				},
				'handleRowIconClick' : function(grid, rowIndex, columnIndex,
						strAction, event, record) {
					me.doHandleRowIconClick(grid, rowIndex, columnIndex,
							strAction, event, record)
				},
				'performGroupAction' : function(btn, opts) {
					me.handleGroupActions((btn.actionName || btn.itemId), opts,
							'groupAction');
				}
			}
		});
	},
	updateConfig : function() {
		var me = this;
		me.processingQueueTypeCode = strPaymentQueueType;
		me.sellerCode = strSellerCode || null;
		me.clientCode = strClientCode || null;
		me.pirNumber = strPirNumber || null;
	},
	handleGridReconfigure : function() {
		var me = this;
		var gridView = me.getPaymentQueueGridView();
		gridView.reconfigureBatchGrid(me.processingQueueTypeCode);
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this, gridView = me.getPaymentQueueGridView();;
		var strUrl = url;
		me.setDataForQuickFilter();
		// TODO : Service should be same
		/*if (!Ext.isEmpty(me.processingQueueTypeCode)
				&& 'R' == me.processingQueueTypeCode) {
			strUrl = 'getBankProcessingRepairQueueList.srvc';
		}*/
		strUrl = grid.generateUrl(strUrl, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + me.getFilterUrl();
		strUrl += "&$batchInstFltr=" + me.processingQueueSourceType;
		strUrl += "&$queueTypeFltr=" + me.processingQueueTypeCode;
		if(!Ext.isEmpty(strSubQueueType)) {
			strUrl += "&$queueSubType=" + strSubQueueType;
		}
		strUrl += "&" + csrfTokenName + "=" + csrfTokenValue;
		if (gridView)
			gridView.enableDisableGroupActions(me.strDefaultMask);
		grid.loadGridData(strUrl, me.postHandleLoadGridData, null, true, me);
	},
	postHandleLoadGridData : function() {
		var me = this;
		var gridView = me.getPaymentQueueGridView();
		blockPaymentUI(false);
		if(gridView){
			gridView.hide();
			gridView.show();
		}
	},
	doHandleGridRowSelectionChange : function(grid, record, recordIndex,
			selectedRecords, jsonData) {
		var me = this, buttonMask = me.strDefaultMask;
		var maskArray = new Array(), actionMask = '', objData = null;;
		var gridView = me.getPaymentQueueGridView();

		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask)) {
			buttonMask = jsonData.d.__buttonMask;
		}
		maskArray.push(buttonMask);
		for (var index = 0; index < selectedRecords.length; index++) {
			objData = selectedRecords[index];
			maskArray.push(objData.get('__metadata').__rightsMap);
		}
		actionMask = doAndOperation(maskArray, me.intMaskSize);
		if (gridView)
			gridView.enableDisableGroupActions(actionMask);
	},
	doHandleRowIconClick : function(tableView, rowIndex, columnIndex,
			actionName, event, record) {
		var me = this;
		var popup = null, strActionUrl = '';
		intCurrentInst = rowIndex +1;
		if (actionName === 'btnHistory') {
			var recHistory = record.get('history');
			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(record.get('history').__deferred.uri, record
								.get('identifier'));
			}
		} else if (actionName === 'btnAddRemark'
				|| actionName === 'btnViewRemark') {
			strActionUrl = Ext.String
					.format('{0}?&$batchInstFltr={1}&{2}={3}', record
									.get('remark').__deferred.uri,
							me.processingQueueSourceType, csrfTokenName,
							csrfTokenValue);
			popup = Ext.create('GCP.view.PaymentQueueRemarkPopup', {
						strRemark : record.get('makerRemark') || null,
						strAction : actionName === 'btnAddRemark'
								? 'ADD'
								: 'VIEW'
					});
			popup.show();
			popup.on('addRemark', function(strRemark) {
						me.preHandleGroupActions(strActionUrl, strRemark,
								record, null, actionName);
					});

		}
		//Added temporary for testing
		else if(actionName === 'btnView') {
		var identifier = record.get('identifier');
			//blockInstrumentUI(true);
			$('#viewFormDiv').hide();
			$('#queueHdrActionTopDiv').hide();
			$('#queueHdrActionBottomDiv').hide();
			$('#gridDiv').hide();
			$('#instrumentPageDiv').show();
			readPaymentBatchInstrument(identifier, 'VIEW');
		}	
		else {
			me.handleGroupActions(actionName, null, 'rowAction', record);
		}
	},
	showHistory : function(url, identifier) {
		Ext.create('GCP.view.HistoryPopup', {
					historyUrl : url + '?&' + csrfTokenName + '='
							+ csrfTokenValue,
					identifier : identifier
				}).show();
	},
	handleGroupActions : function(strAction, opts, strActionType, record) {
		var me = this;
		var strUrl = me.getGridActionUrl(strAction);
		if (me.processingQueueTypeCode === 'V' && (strAction === 'reject')) {
			me.captureRemark(strAction, strUrl, record, strActionType);

		} else if (me.processingQueueTypeCode === 'W'
				&& (strAction === 'reject')) {
			me.captureRemark(strAction, strUrl, record, strActionType);

		} else if (me.processingQueueTypeCode === 'D'
				&& (strAction === 'reject')) {
			me.captureRemark(strAction, strUrl, record, strActionType);

		} else if (me.processingQueueTypeCode === 'R'
				&& (strAction === 'repairReject' || strAction === 'repairValidate' )) {
			me.captureRemark(strAction, strUrl, record, strActionType);

		} else if((me.processingQueueTypeCode === 'C' || me.processingQueueTypeCode === 'W' || me.processingQueueTypeCode === 'D' || me.processingQueueTypeCode === 'R' || me.processingQueueTypeCode === 'L') && strAction === 'changeDate'){
			me.captureChangeDate(strAction, strUrl, record, strActionType);
		}
		else if (me.processingQueueTypeCode === 'V' && (strAction === 'verificationCancle')) {
			me.captureRemark(strAction, strUrl, record, strActionType);

		}
		else if (me.processingQueueTypeCode === 'V' && (strAction === 'verificationVerify')) {
			me.captureRemark(strAction, strUrl, record, strActionType);

		}
		else {
			me.preHandleGroupActions(strUrl, '', record, strActionType,
					strAction);
		}
	},
	captureRemark : function(strAction, strActionUrl, record, strActionType) {
		var me = this;
		var titleMsg = getLabel('paymentQueue.field.lbl.remark',
				'Please enter remark'), fieldLbl = getLabel(
				'paymentQueue.lbl.remark', 'Remark');
		Ext.Msg.show({
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					multiline : 4,
					style : {
						height : 400
					},
					bodyPadding : 0,
					fn : function(btn, text) {
						if (btn == 'ok') {
							me.preHandleGroupActions(strActionUrl, text,
									record, strActionType, strAction);
						}
					}
				});
	},
	
	captureChangeDate : function(strAction, strUrl, record, strActionType) {
		var me = this;
		var groupView = me.getPaymentQueueGridView();
		var grid = groupView.down('smartgrid'), popup = null;
		var records = grid.getSelectedRecords();
		var intInstrumentCount = 0, intBatchCount = 0;
		records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
				? records
				: [record];

		Ext.each(records, function(rec) {
					intInstrumentCount += parseInt(rec.get("totalTxns"),10);
				});
		intBatchCount = records.length;
		popup = Ext.create('GCP.view.PaymentQueueChangeDatePopup', {
					'batchCount' : intBatchCount,
					'instCount' : intInstrumentCount,
					'batchOrInstrument' : 'instrument'
					
				});
		popup.show();
		popup.on('queueDateChange', function(strDate, strRemark) {
					me.preHandleGroupActions(strUrl, strRemark, record,
							strActionType, strAction, strDate);
				});
	},
	preHandleGroupActions : function(strUrl, remark, record, strActionType,
			strAction, changedDate) {
		var me = this;
		var gridView = me.getPaymentQueueGridView();
		var grid = gridView.down('smartgrid[itemId="queueGrid"]'), objJson = null;
		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
			var records = grid.getSelectedRecords();
			records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
					? records
					: [record];
			for (var index = 0; index < records.length; index++) {
				objJson = {
					serialNo : grid.getStore().indexOf(records[index]) + 1,
					identifier : records[index].data.identifier,
					userMessage : remark
				}
				if (changedDate)
					objJson['recalcOffsetDateFlag'] = changedDate;
				arrayJson.push(objJson);
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});
			Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							var jsonRes = Ext.JSON
									.decode(response.responseText);
							me.postHandleGroupAction(jsonRes, strActionType,
									strAction, record);
						},
						failure : function() {
							var errMsg = "";
							Ext.MessageBox.show({
										title : getLabel(
												'paymentQueue.error.title',
												'Error'),
										msg : getLabel(
												'paymentQueue.error.msg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}

	},
	postHandleGroupAction : function(jsonData, strActionType, strAction,
			records) {
		var me = this;
		var msg = '', strIsProductCutOff = 'N', errCode = '', actionMsg = [], actionData, record = '';
		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d)
				&& !Ext.isEmpty(jsonData.d.instrumentActions))
			actionData = jsonData.d.instrumentActions;
		var gridView = me.getPaymentQueueGridView();
		var grid = gridView.getGrid();

		var strActionSuccess = getLabel('instrumentActionPopUpSuccessMsg',
				'Action Successful');
		var warnLimit = getLabel('warningLimit', 'Warning limit exceeded!');
		Ext.each(actionData, function(result) {
			record = grid.store.getAt(parseInt(result.serialNo,10) - 1);
			msg = '';
			strIsProductCutOff = 'N';
			Ext.each(result.errors, function(error) {
						msg = msg + error.code + ' : ' + error.errorMessage
								+ '<br/>';
						errCode = error.code;
						if (!Ext.isEmpty(errCode)
								&& errCode.substr(0, 4) === 'WARN')
							strIsProductCutOff = 'Y';
					});

			actionMsg.push({
				success : result.success,
				actualSerailNo : result.serialNo,
				isProductCutOff : strIsProductCutOff,
				actionTaken : 'N',
				reference : Ext.isEmpty(record) ? '' : record.get('cwInstNmbr'),
				actionMessage : result.success === 'Y'
						? strActionSuccess
						: (result.success === 'W02' ? warnLimit : msg)
			});

		});
		if (!Ext.isEmpty(actionMsg)) {
			var actionResult = me.getActionResult();
			if (actionResult) {
				actionResult.addRecords(actionMsg);
				actionResult.show();
			}
		}
		gridView.refreshData();
	},
	getGridActionUrl : function(strAction) {
		var me = this, strQueueType = null;
		if (me.processingQueueTypeCode == 'D')
			strQueueType = "debitQueue";
		else if (me.processingQueueTypeCode == 'C')
			strQueueType = "clearingQueue";
		else if (me.processingQueueTypeCode == 'R')
			strQueueType = "repairQueue";
		else if (me.processingQueueTypeCode == 'W')
			strQueueType = "warehouseQueue";
		else if (me.processingQueueTypeCode == 'L')
			strQueueType = "liquidationQueue";
		else
			strQueueType = "verificationQueue";

		return Ext.String.format(
				'{0}List/{1}.srvc?&$batchInstFltr={2}&{3}={4}', strQueueType,
				strAction, me.processingQueueSourceType, csrfTokenName,
				csrfTokenValue);
	},
	getFilterUrl : function() {
		var me = this;
		var strQuickFilterUrl = '', strActionStatusUrl = '', strAdvancedFilterUrl = '', strUrl = '', isFilterApplied = false;
		strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
		if (!Ext.isEmpty(strQuickFilterUrl)) {
			strUrl = strQuickFilterUrl;
			isFilterApplied = true;
		}
		return strUrl;
	},
	generateUrlWithQuickFilterParams : function(thisClass) {
		var filterData = thisClass.filterData;
		var isFilterApplied = false;
		var strFilter = '&$filter=';
		var strTemp = '';
		var strFilterParam = '';
		for (var index = 0; index < filterData.length; index++) {
			if (isFilterApplied)
				strTemp = strTemp + ' and ';
			switch (filterData[index].operatorValue) {
				case 'bt' :
					if (filterData[index].dataType === 'D') {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' '
								+ 'date\'' + filterData[index].paramValue1
								+ '\'' + ' and ' + 'date\''
								+ filterData[index].paramValue2 + '\'';
					} else {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' ' + '\''
								+ filterData[index].paramValue1 + '\''
								+ ' and ' + '\''
								+ filterData[index].paramValue2 + '\'';
					}
					break;
				default :
					// Default opertator is eq
					if (filterData[index].dataType === 'D') {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' '
								+ 'date\'' + filterData[index].paramValue1
								+ '\'';
					} else {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' ' + '\''
								+ filterData[index].paramValue1 + '\'';
					}
					break;
			}
			isFilterApplied = true;
		}
		if (isFilterApplied)
			strFilter = strFilter + strTemp;
		else
			strFilter = '';
		return strFilter;
	},

	isInCondition : function(data) {
		var retValue = false;
		var displayType = data.displayType;
		var strValue = data.value1;
		var reg = new RegExp(/^\((\d\d*,)*\d\d*\)$/);
		if (displayType && displayType === 4 && strValue && strValue.match(reg)) {
			retValue = true;
		}

		return retValue;

	},
	setDataForQuickFilter : function(filterJson) {
		var me = this, arrFilter = [];;
		arrFilter.push({
					paramName : 'queueType',
					paramValue1 : (me.processingQueueTypeCode || 'V'),
					operatorValue : 'eq',
					dataType : 'S'
				});
		arrFilter.push({
					paramName : 'sourceType',
					paramValue1 : me.config.processingQueueSourceType,
					operatorValue : 'eq',
					dataType : 'S'
				});
		if (!Ext.isEmpty(me.sellerCode))
			arrFilter.push({
						paramName : 'seller',
						paramValue1 : me.sellerCode,
						operatorValue : 'eq',
						dataType : 'S'
					});
		if (!Ext.isEmpty(me.clientCode))
			arrFilter.push({
						paramName : 'client',
						paramValue1 : me.clientCode,
						operatorValue : 'eq',
						dataType : 'S'
					});
		if (!Ext.isEmpty(me.pirNumber))
				arrFilter.push({
						paramName : 'pirNmbr',
					paramValue1 : me.pirNumber,
					operatorValue : 'eq',
					dataType : 'S'
				});
		if (me.processingQueueTypeCode ==='L' && !Ext.isEmpty(strInternalTxnNmbr))
				arrFilter.push({
					paramName : 'cwInstNmbr',
					paramValue1 : strInternalTxnNmbr,
					operatorValue : 'eq',
					dataType : 'S'
				});

		me.filterData = arrFilter;;
	}
});