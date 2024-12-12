Ext.define('GCP.view.AgreementFrequencyView', {
	extend : 'Ext.container.Container',
	xtype : 'agreementFrequencyView',
	requires : ['Ext.container.Container','Ext.ux.gcp.GroupView','GCP.view.AgreementFrequencyFilterView'],
	width : '100%',
	autoHeight : true,
	//minHeight : 600,
	initComponent : function() {
		var me = this;
		var groupView = me.createGroupView();
		this.items = [groupView];
		me.callParent(arguments);
	},
	createGroupView : function() {
	var me = this;
	var groupView = null;
	var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
	var objGroupByPref = {}
	var objLocalPageSize = '',objLocalSubGroupCode = null;
	
	if (objAgreeFreqMstPref) {			
		var objJsonData = Ext.decode(objAgreeFreqMstPref);
		objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
		objGridSetting = objJsonData.d.preferences.GridSetting || {};
		arrColumnSetting = objJsonData && objJsonData.d.preferences
				&& objJsonData.d.preferences.ColumnSetting
				&& objJsonData.d.preferences.ColumnSetting.gridCols
				? objJsonData.d.preferences.ColumnSetting.gridCols
				: (AGREEMENT_FREQUENCY_GENERIC_COLUMN_MODEL || '[]');
	}
	if(objSaveLocalStoragePref){
		var objLocalData = Ext.decode(objSaveLocalStoragePref);
		objLocalPageSize = objLocalData && objLocalData.d.preferences
							&& objLocalData.d.preferences.tempPref 
							&& objLocalData.d.preferences.tempPref.pageSize ? objLocalData.d.preferences.tempPref.pageSize : '';
		objLocalSubGroupCode = objLocalData && objLocalData.d.preferences
							&& objLocalData.d.preferences.tempPref 
							&& objLocalData.d.preferences.tempPref.subGroupCode ? objLocalData.d.preferences.tempPref.subGroupCode : null;
	}
	groupView = Ext.create('Ext.ux.gcp.GroupView', {
		itemId : 'agreeFreqGroupView',
		cfgGroupByUrl : 'services/grouptype/agreementFrequency/groupBy.json?$filterscreen=groupViewFilter&$filterGridId=GRD_AGREE_SCHEDULE',
		cfgSummaryLabel : 'Agreement Frequency List',
		cfgGroupByLabel : 'Grouped By',
		cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
		cfgSubGroupCode : (allowLocalPreference === 'Y') ? objLocalSubGroupCode : (objGroupByPref.subGroupCode || null),
		cfgShowAdvancedFilterLink : false,
		cfgParentCt : me,
		cfgAutoGroupingDisabled : true,
		cfgSmartGridSetting : true,
		cls:'t7-grid',
		cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
		cfgPrefferedColumnModel : arrColumnSetting,
		cfgShowFilter : true,
		cfgShowFilterInfo : true,
		cfgFilterModel : {
			cfgContentPanelItems : [{
						xtype : 'agreementFrequencyFilterView'
					}],
			cfgContentPanelLayout : {
				type : 'vbox',
				align : 'stretch'
			}
		},
		getActionColumns : function() {
			return [me.createGroupActionColumn()]
		},
		cfgGridModel : {
			pageSize : objGridSetting.defaultRowPerPage ||_GridSizeMaster,
			rowList : _AvailableGridSize,
			stateful : false,
			enableQueryParam:false,
			showEmptyRow : false,
			showPager : true,
			minHeight : 100,
			heightOption : objGridSetting.defaultGridSize,
			checkBoxColumnWidth : 40,
			hideRowNumbererColumn : true,
			enableColumnAutoWidth : _blnGridAutoColumnWidth,
			enableColumnHeaderFilter : true,
			showSorterToolbar : _charEnableMultiSort,
			columnHeaderFilterCfg : {
				remoteFilter : true,
				filters : [{
							type : 'list',
							colId : 'actionStatus',
							options : arrActionColumnStatus || []
						}]
			},
			storeModel : {
				fields : [ 'agreementCode', 'agreementName',
						'clientName', 'frequencyDesc', 'priority',
						'bankReferenceTimeDesc',
						'agreementFreqTypeDesc','frequencyType', 'nextExecDate',
						'status', 'identifier', 'viewState',
						'__metadata', 'history', 'requestStateDesc' ],
				proxyUrl : 'services/agreementFrequencyMst.srvc',
				rootNode : 'd.agreementFrequencyList',
				totalRowsNode : 'd.__count'
			},
			groupActionModel : me.getGroupActionModel(),
			defaultColumnModel : me
					.getColumnModel(AGREEMENT_FREQUENCY_GENERIC_COLUMN_MODEL),
			fnColumnRenderer : me.columnRenderer,
			// fnSummaryRenderer : function(value, summaryData, dataIndex,
			// rowIndex, colIndex, store, view, colId) {
			// },
			fnRowIconVisibilityHandler : me.isRowIconVisible
		}
	});
	return groupView
	},
	getGroupActionModel : function(arrAvaliableActions) {
		var retArray = [];
		var arrActions = (arrAvaliableActions || ['Submit', 
				'Discard', 'Accept','Reject']);
		if(entityType == 0)
		{
			arrActions.push('Enable');
			arrActions.push('Disable');
			arrActions.push('Verify');
		}
		else if(entityType == 1)
		{
			arrActions.push('Send');
		}
		var objActions = {
			'Submit' : {
				actionName : 'submit',
				isGroupAction : true,
				itemText : getLabel('prfMstActionSubmit', 'Submit'),
				maskPosition : 1
			},
			'Reject' : {
				actionName : 'reject',
				itemText : getLabel('prfMstActionReject', 'Reject'),
				maskPosition : 3

			},
			'Discard' : {
				actionName : 'discard',
				itemText : getLabel('prfMstActionDiscard', 'Discard'),
				maskPosition : 6
			},
			'Accept' : {
				actionName : 'accept',
				itemText : getLabel('prfMstActionApprove', 'Approve'),
				maskPosition : 2
			},
			'Enable' :
			{
				actionName : 'enable',
				itemText : getLabel('prfMstActionEnable', 'Enable'),
				maskPosition : 4
			},
			'Disable' :
			{
				actionName : 'disable',
				itemText : getLabel('prfMstActionDisable', 'Disable'),
				maskPosition : 5
			},
			'Verify' :
			{
				actionName : 'verify',
				itemText : getLabel('prfMstActionVerify', 'Verify'),
				maskPosition : 10
			},
			'Send' :
			{
				actionName : 'send',
				itemText : getLabel('prfMstActionSend', 'Send'),
				maskPosition : 11
			}
		};

		for (var i = 0; i < arrActions.length; i++) {
			if (!Ext.isEmpty(objActions[arrActions[i]]))
				retArray.push(objActions[arrActions[i]])
		}
		return retArray;
	},
	getColumnModel : function(arrCols){
	return arrCols;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
		view, colId) {
		if(colId === "col_frequencyType")
		{
			value = record.raw.frequencyTyp[value];
		}
		return value;
	},
	isRowIconVisible : function(store, record, jsonData, itmId,
			maskPosition) {
		var maskSize = 11;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		
		var buttonMask = '';
		var retValue = true;
		var bitPosition = '';
		if (!Ext.isEmpty(maskPosition)) {
			bitPosition = parseInt(maskPosition,10) - 1;
			maskSize = maskSize;
		}
		if (!Ext.isEmpty(jsonData)
				&& !Ext.isEmpty(jsonData.d.__buttonMask))
			buttonMask = jsonData.d.__buttonMask;
		maskArray.push(buttonMask);
		maskArray.push(rightsMap);
		actionMask = doAndOperation(maskArray, maskSize);
		var isSameUser = true;
		if (record.raw.makerId === USER) {
			isSameUser = false;
		}

		if (Ext.isEmpty(bitPosition))
			return retValue;
		retValue = isActionEnabled(actionMask, bitPosition);
		if ((maskPosition === 2 && retValue)) {
			retValue = retValue && isSameUser;
		} else if (maskPosition === 3 && retValue) {
			retValue = retValue && isSameUser;
		} else if (maskPosition === 8 && retValue) {
			retValue = true;
		}
		return retValue;
	},
	createGroupActionColumn : function() {
		var me = this;
		var colItems = [];
		var actionsForWidget = ['Submit','Discard','Approve','Reject'];
		if(entityType == 0)
		{
			actionsForWidget.push('Enable');
			actionsForWidget.push('Disable');
			actionsForWidget.push('Verify');
		}
		else if(entityType == 1)
		{
			actionsForWidget.push('Send');
		}
		var arrRowActions = [{
			itemId : 'btnEdit',
			itemCls : 'grid-row-action-icon icon-edit',
			toolTip : getLabel('editRecordToolTip', 'Modify Record'),
			itemLabel : getLabel('editRecordToolTip', 'Modify Record'),
			maskPosition : 8
		}, {
			itemId : 'btnView',
			itemCls : 'grid-row-action-icon icon-view',
			toolTip : getLabel('viewToolTip', 'View Record'),
			itemLabel : getLabel('viewToolTip', 'View Record'),
			maskPosition : 7
		}, {
			itemId : 'btnHistory',
			itemCls : 'grid-row-action-icon icon-history',
			itemLabel : getLabel('historyToolTip', 'View History'),
			toolTip : getLabel('historyToolTip', 'View History'),
			maskPosition : 9
		}
		];
		colItems = me.getGroupActionColItems(actionsForWidget);
		var objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			width : 108,
			locked : true,
			colHeader : getLabel('lms.grid.actions','Actions'),
			lockable : false,
			sortable : false,
			hideable : false,
			items : arrRowActions.concat(colItems || []),
			visibleRowActionCount : 1
		};
		return objActionCol;
	},
		getGroupActionColItems : function(availableActions) {
		var itemsArray = [];
		if (!Ext.isEmpty(availableActions)) {
			for (var count = 0; count < availableActions.length; count++) {
				switch (availableActions[count]) {
					case 'Submit' :
						itemsArray.push({
							text :  getLabel('prfMstActionSubmit', 'Submit'),
							actionName : 'submit',
							itemId : 'submit',
							maskPosition : 1
						});
						break;
					case 'Discard' :
						itemsArray.push({
							text : getLabel('prfMstActionDiscard', 'Discard'),
							actionName : 'discard',
							itemId : 'discard',
							maskPosition : 6
							});
						break;
					case 'Approve' :
						itemsArray.push({
							text : getLabel('prfMstActionApprove', 'Approve'),
							itemId : 'accept',
							actionName : 'accept',
							maskPosition : 2
						});
						break;
					case 'Reject' :
						itemsArray.push({
							text : getLabel('prfMstActionReject', 'Reject'),
							itemId : 'reject',
							actionName : 'reject',
							maskPosition : 3
							});
						break;
					case 'Enable' :
						itemsArray.push({
							text : getLabel('prfMstActionEnable', 'Enable'),
							itemId : 'enable',
							actionName : 'enable',
							maskPosition : 4
							});
						break;
					case 'Disable' :
						itemsArray.push({
							text : getLabel('prfMstActionDisable', 'Disable'),
							itemId : 'disable',
							actionName : 'disable',
							maskPosition : 5
							});
						break;
					case 'Verify' :
						itemsArray.push({
							text : getLabel('prfMstActionVerify', 'Verify'),
							itemId : 'verify',
							actionName : 'verify',
							maskPosition : 10
							});
						break;		
					case 'Send' :
						itemsArray.push({
							text : getLabel('prfMstActionSend', 'Send'),
							itemId : 'send',
							actionName : 'send',
							maskPosition : 11
							});
						break;
				}
			}
		}
		return itemsArray;
	}
});