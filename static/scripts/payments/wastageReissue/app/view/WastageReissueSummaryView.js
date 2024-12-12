Ext.define('GCP.view.WastageReissueSummaryView', {
	extend : 'Ext.container.Container',
	xtype : 'wastageReissueSummaryView',
	requires : [ 'Ext.container.Container', 'Ext.ux.gcp.GroupView', 'GCP.view.WastageReissueFilterView' ],
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
		if (objWastageReissuePref) {
			var objJsonData = Ext.decode(objWastageReissuePref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences && objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols ? objJsonData.d.preferences.ColumnSetting.gridCols
					: (WASTAGE_REISSUE_COLUMNS || '[]');
		}

		if (objSaveLocalStoragePref) {
			var objLocalData = Ext.decode(objSaveLocalStoragePref);
			objLocalPageSize = objLocalData && objLocalData.d.preferences && objLocalData.d.preferences.tempPref
					&& objLocalData.d.preferences.tempPref.pageSize ? objLocalData.d.preferences.tempPref.pageSize : '';
			objLocalSubGroupCode = objLocalData && objLocalData.d.preferences && objLocalData.d.preferences.tempPref
					&& objLocalData.d.preferences.tempPref.subGroupCode ? objLocalData.d.preferences.tempPref.subGroupCode : null;
		}

		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			cfgGroupByUrl : 'services/grouptype/wastageReissueSummary/groupBy.json?$filterGridId=GRD_PAY_WASTEREISSUE',
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
					xtype : 'wastageReissueFilterView'
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
					fields : [ 'pdtReference', 'statusDesc', 'status','pdtProductDesc','pdtBnkProductDesc', 'phdReference', 'pdtBeneficiary', 'instrumentDate', 'oldInstNo','newInstNo',
					           'pdtInstAmount', 'pdtDebitCcy', 'wastageRemarks','makerId','makerStamp','checkerId','checkerStamp', 'outsourcedPrintType', 'identifier','__metadata', 
					           'pdtPriPayLocDesc','pdtPickupBranchDesc','pdtAuthPersonName','pdtAuthPersonIdTypeDesc','pdtAuthPersonId',
					           'whtApplicable','whtTotalAmount','receiverTaxId','whtFormCode','certificateRefNo'],
					proxyUrl : 'services/getWastageReissueList.json',
					rootNode : 'd.list',
					totalRowsNode : 'd.__count'
				},
				groupActionModel : me.getGroupActionModel(),
				defaultColumnModel : me.getColumnModel(WASTAGE_REISSUE_COLUMNS),
				fnRowIconVisibilityHandler : me.isRowIconVisible,
				fnColumnRenderer : me.columnRenderer

			}
		});
		return groupView;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store, view, colId) {
		var strRetValue = value;
		if(colId === 'col_whtApplicable')
		{
			strRetValue = ('Y' === strRetValue) ? getLabel('yes','Yes') : getLabel('no','No');
		}
		return strRetValue;
	},
	getGroupActionModel : function(arrAvaliableActions) {
		var retArray = [];
		var arrActions = (arrAvaliableActions || ['Wastage','Approve', 'Reject', 'Discard']);
		var objActions = {
			'Wastage' : {
				actionName : 'wastage',
				itemText : getLabel('wastage', 'Wastage'),
				maskPosition : 1
			},
			'Approve' : {
				actionName : 'accept',
				itemText : getLabel('approve', 'Approve'),
				maskPosition : 3
			},
			'Reject' : {
				actionName : 'reject',
				itemText : getLabel('reject', 'Reject'),
				maskPosition : 4
			},
			'Discard' : {
				actionName : 'discard',
				itemText : getLabel('discard', 'Discard'),
				maskPosition : 5
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
		return retValue;
	},
	getColumnModel : function(arrCols) {
		return arrCols;
	},
	createGroupActionColumn : function() {
		var me = this;
		var colItems = [];
		var actionsForWidget = [ 'Wastage', 'Reissue', 'Approve', 'Reject', 'Discard' ];
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
					case 'Wastage':
						itemsArray.push({
							text : getLabel('wastage', 'Wastage'),
							actionName : 'wastage',
							itemId : 'wastage',
							maskPosition : 1
						});
						break;
					case 'Reissue':
						itemsArray.push({
							text : getLabel('reissue', 'Wastage And Reissue'),
							actionName : 'reissue',
							itemId : 'reissue',
							maskPosition : 2
						});
						break;
					case 'Approve':
						itemsArray.push({
							text : getLabel('approve', 'Approve'),
							itemId : 'accept',
							actionName : 'accept',
							maskPosition : 3
						});
						break;
					case 'Reject':
						itemsArray.push({
							text : getLabel('reject', 'Reject'),
							itemId : 'reject',
							actionName : 'reject',
							maskPosition : 4
						});
						break;
					case 'Discard':
						itemsArray.push({
							text : getLabel('discard', 'Discard'),
							itemId : 'discard',
							actionName : 'discard',
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