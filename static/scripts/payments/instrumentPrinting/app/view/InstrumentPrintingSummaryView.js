Ext.define('GCP.view.InstrumentPrintingSummaryView', {
	extend : 'Ext.container.Container',
	xtype : 'instrumentPrintingSummaryView',
	requires : [ 'Ext.container.Container', 'Ext.ux.gcp.GroupView', 'GCP.view.InstrumentPrintingFilterView' ],
	initComponent : function() {
		var me = this;
		var groupView = me.createGroupView();
		me.items = [ groupView ];
		me.callParent(arguments);
	},
	createGroupView : function() {
		var me = this, groupView = null;
		var objGroupByPref = {};
		var objLocalPageSize = null;
		var objLocalSubGroupCode = null;
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		if (objInstrumentPrintingPref) {
			var objJsonData = Ext.decode(objInstrumentPrintingPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences && objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols ? objJsonData.d.preferences.ColumnSetting.gridCols
					: (INSTR_PRINT_COLUMNS || '[]');
		}

		if (objSaveLocalStoragePref) {
			var objLocalData = Ext.decode(objSaveLocalStoragePref);
			objLocalPageSize = objLocalData && objLocalData.d.preferences && objLocalData.d.preferences.tempPref
					&& objLocalData.d.preferences.tempPref.pageSize ? objLocalData.d.preferences.tempPref.pageSize : '';
			objLocalSubGroupCode = objLocalData && objLocalData.d.preferences && objLocalData.d.preferences.tempPref
					&& objLocalData.d.preferences.tempPref.subGroupCode ? objLocalData.d.preferences.tempPref.subGroupCode : null;
		}

		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			cfgGroupByUrl : 'services/grouptype/instrumentPrintingSummary/groupBy.json?$filterGridId=GRD_PAY_INSTRPRINT',
			cfgParentCt : me,
			cls : 't7-grid',
			cfgShowFilter : true,
			cfgShowAdvancedFilterLink : false,
			cfgShowRefreshLink : false,
			cfgSmartGridSetting : false,
			cfgAutoGroupingDisabled : true,
			cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgSubGroupCode : (allowLocalPreference === 'Y') ? objLocalSubGroupCode : null,
			cfgFilterModel : {
				cfgContentPanelItems : [ {
					xtype : 'instrumentPrintingFilterView'
				} ],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},
			getActionColumns : function() {
				return [ me.createGroupActionColumn() ];
			},
			cfgGridModel : {
				pageSize : objLocalPageSize || objGridSetting.defaultRowPerPage || _GridSizeMaster,
				rowList : _AvailableGridSize,
				stateful : false,
				showSorterToolbar : _charEnableMultiSort,
				heightOption : objGridSetting.defaultGridSize,
				columnHeaderFilterCfg : {},
				showEmptyRow : false,
				showPager : true,
				minHeight : 100,
				/* heightOption : objGridSetting.defaultGridSize, */
				checkBoxColumnWidth : 39,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				showPagerRefreshLink : false,
				storeModel : {
					fields : [ 'pdfFileName', 'adviceFileName', 'whtFileName', 'adviceIncluded', 'whtIncluded', 'phdReference', 'status', 'decodeStatus', 'printNmbr',
					           'createdDate', 'printBy', 'printDate', 'printConfirmBy', 'printConfirmDate', 'clientId','product', 'identifier','__metadata'],
					proxyUrl : 'services/getInstrumentPrintList.json',
					rootNode : 'd.list',
					totalRowsNode : 'd.__count'
				},
				groupActionModel : me.getGroupActionModel(),
				defaultColumnModel : me.getColumnModel(INSTR_PRINT_COLUMNS),
				fnRowIconVisibilityHandler : me.isRowIconVisible,
				fnColumnRenderer : me.columnRenderer

			}
		});
		return groupView;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store, view, colId) {
		var strRetValue = value;
		if('col_adviceIncluded' === colId){
			strRetValue = (!Ext.isEmpty(record.data.adviceFileName)) ? getLabel('yes','Yes') : getLabel('no','No');
		}
		else if('col_whtIncluded' === colId){
			strRetValue = (!Ext.isEmpty(record.data.whtFileName)) ? getLabel('yes','Yes') : getLabel('no','No');
		}
		return strRetValue;
	},
	getGroupActionModel : function(arrAvaliableActions) {
		var retArray = [];
		var arrActions = (arrAvaliableActions || [ 'Confirm', 'Assign']);
		var objActions = {
			'Confirm' : {
				actionName : 'confirm',
				itemText : getLabel('printConfirm', 'Print Confirm'),
				maskPosition : 2
			},
			'Assign' : {
				actionName : 'assign',
				itemText : getLabel('AssignToBank', 'Assign To Bank'),
				maskPosition : 3
			}
		};

		for (var i = 0; i < arrActions.length; i++) {
			if (!Ext.isEmpty(objActions[arrActions[i]])) {
				retArray.push(objActions[arrActions[i]]);
			}
		}
		return retArray;
	},

	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 5;
		var maskArray = [];
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var buttonMask = '';
		var retValue = true;
		var bitPosition = '';
		if (!Ext.isEmpty(maskPosition)) {
			bitPosition = parseInt(maskPosition,10) - 1;
			maskSize = maskSize;
		}
		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask)) {
			buttonMask = jsonData.d.__buttonMask;
		}
		maskArray.push(buttonMask);
		maskArray.push(rightsMap);
		actionMask = doAndOperation(maskArray, maskSize);
		if (Ext.isEmpty(bitPosition)) {
			return retValue;
		}
		retValue = isActionEnabled(actionMask, bitPosition);
		if(1 === maskPosition && true === retValue)
		{
			if (('adviceFile' === itmId && Ext.isEmpty(record.data.adviceFileName)) ||
					('whtFile' === itmId && Ext.isEmpty(record.data.whtFileName)) ) {
				retValue = false;
			}
		}
		return retValue;
	},
	getColumnModel : function(arrCols) {
		return arrCols;
	},
	createGroupActionColumn : function() {
		var me = this;
		var colItems = [];
		var actionsForWidget = [ 'InstrumentFile', 'AdviceFile', 'WhtFile', 'Confirm', 'Assign', 'View', 'LotInfo' ];
		var arrRowActions = [];
		colItems = me.getGroupActionColItems(actionsForWidget);
		var objActionCol = {
			colId : 'actioncontent',
			colHeader : getLabel('actions', 'Actions'),
			colType : 'actioncontent',
			width : 108,
			locked : true,
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
					case 'InstrumentFile':
						itemsArray.push({
							text : getLabel('downloadInstrument', 'Download Instrument'),
							actionName : 'instrumentFile',
							itemId : 'instrumentFile',
							maskPosition : 1
						});
						break;
					case 'AdviceFile':
						itemsArray.push({
							text : getLabel('downloadAdvice', 'Download Advice'),
							actionName : 'adviceFile',
							itemId : 'adviceFile',
							maskPosition : 1
						});
						break;
					case 'WhtFile':
						itemsArray.push({
							text : getLabel('downloadWht', 'Download WHT'),
							actionName : 'whtFile',
							itemId : 'whtFile',
							maskPosition : 1
						});
						break;
					case 'Confirm':
						itemsArray.push({
							text : getLabel('printConfirm', 'Print Confirm'),
							actionName : 'confirm',
							itemId : 'confirm',
							maskPosition : 2
						});
						break;
					case 'Assign':
						itemsArray.push({
							text : getLabel('assignToBank', 'Assign To Bank'),
							itemId : 'assign',
							actionName : 'assign',
							maskPosition : 3
						});
						break;
					case 'View':
						itemsArray.push({
							text : getLabel('view', 'View'),
							itemId : 'view',
							actionName : 'view',
							maskPosition : 4
						});
						break;
					case 'LotInfo':
						itemsArray.push({
							text : getLabel('lotInfo', 'Lot Info'),
							itemId : 'lotInfo',
							actionName : 'lotInfo',
							maskPosition : 5
						});
						break;
					default :
						break;
				}
			}
		}
		return itemsArray;
	}
});