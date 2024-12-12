/**
 * @class GCP.view.SweepTxnView
 * @extends Ext.panel.Panel
 * @author Vivek Bhurke
 */
Ext.define('GCP.view.SweepTxnView', {
	extend : 'Ext.panel.Panel',
	xtype : 'sweepTxnViewType',
	requires : ['Ext.ux.gcp.GroupView', 'GCP.view.SweepTxnFilterView'],
	autoHeight : true,
	initComponent : function() {
		var me = this;
		var groupView = me.createGroupView();
		me.items = [groupView];
		me.on('resize', function() {
					me.doLayout();
				});

		me.callParent(arguments);
	},
	createGroupView : function() {
		var me = this;
		var groupView = null, blnShowAdvancedFilter = true;
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		var objLocalPageSize = '',objLocalSubGroupCode = null;
		if (objSweepTxnSummaryPref) {
			var objJsonData = Ext.decode(objSweepTxnSummaryPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: SWEEP_TXN_GENERIC_COLUMN_MODEL || [];
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
		blnShowAdvancedFilter = false;
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			cfgGroupByUrl : 'static/scripts/lms/sweepTxnSummaryNewUX/data/sweepTxnGroupBy.json',
			cfgSummaryLabel : getLabel('sweepTransactions', 'SWEEP TRANSACTIONS'),
			cfgGroupByLabel : 'Grouped By',
			cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
			cfgSubGroupCode : (allowLocalPreference === 'Y') ? objLocalSubGroupCode : null,
			cfgParentCt : me,
			cls : 't7-grid',
			cfgShowFilter : true,
			cfgShowAdvancedFilterLink : blnShowAdvancedFilter,
			cfgShowRefreshLink : false,
			cfgSmartGridSetting : false,
			cfgAutoGroupingDisabled : true,
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'sweepTxnFilterViewType'
						}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				},
				collapsed : false
			},
			getActionColumns : function() {
				return [me.createGroupActionColumn()]
			},
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgGridModel : {
				pageSize : (allowLocalPreference === 'Y' && !Ext.isEmpty(objLocalPageSize)) ? objLocalPageSize : objGridSetting.defaultRowPerPage || _GridSizeTxn,
				rowList : _AvailableGridSize,
				stateful : false,
				showSorterToolbar : _charEnableMultiSort,
				showEmptyRow : false,
				showPager : true,
				minHeight : 100,
				heightOption : objGridSetting.defaultGridSize,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				showPagerRefreshLink : false,
				columnHeaderFilterCfg : {
					remoteFilter : true,
					filters : [{
								type : 'list',
								colId : 'actionStatus',
								options :  []
							}]
				},
				storeModel : {
					fields : [
								'changeId','agreementCode', 'agreementName', 'clientDesc', 'sellerDesc',
								'__metadata','identifier','history','transactionType','transactionRemarks','noPostStructure'
							],
					proxyUrl : 'getLmsSweepTxnList.srvc',
					rootNode : 'd.sweepTxnList',
					totalRowsNode : 'd.__count'
				},
				
				groupActionModel : me
						.getGroupActionModel(availableGroupActionForGrid.group_level_actions),
				defaultColumnModel : ( SWEEP_TXN_GENERIC_COLUMN_MODEL || []),
				
				fnColumnRenderer : me.columnRenderer,
				
				fnRowIconVisibilityHandler : me.isRowIconVisible
			}
		});
		return groupView
	},
	getColumnModel : function(arrCols) {
		return arrCols;
	},

	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 8;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var buttonMask = '';
		var retValue = true;
		var bitPosition = '';
		if( !Ext.isEmpty( maskPosition ) )
		{
			bitPosition = parseInt( maskPosition,10 ) - 1;
			maskSize = maskSize;
		}
		if( !Ext.isEmpty( jsonData ) && !Ext.isEmpty( jsonData.d.__buttonMask ) )
			buttonMask = jsonData.d.__buttonMask;
		maskArray.push( buttonMask );
		maskArray.push( rightsMap );
		actionMask = doAndOperation( maskArray, maskSize );
		var isSameUser = true;
		if( record.raw.makerId === USER )
		{
			isSameUser = false;
		}
		if( Ext.isEmpty( bitPosition ) )
			return retValue;
		retValue = isActionEnabled( actionMask, bitPosition );
		if( ( maskPosition === 7 && retValue ) )
		{
			retValue = retValue && isSameUser;
		}
		else if( maskPosition === 8 && retValue )
		{
			retValue = retValue && isSameUser;
		}
		return retValue;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,view, colId) {
		if (record.get('isEmpty')) {
				if (rowIndex === 0 && colIndex === 0) {
					meta.style = "display:inline;text-align:left;position:absolute;white-space: nowrap !important;empty-cells:hide;";
					return getLabel('gridNoDataMsg','No records found !!!');											
				}
			} else
				return value;
	},

	getGroupActionModel : function(arrAvaliableActions) {
		var retArray = [];
		var arrActions = (arrAvaliableActions || ['Approve','Reject']);
		
		var objActions = {
			'Approve' : {
				actionName : 'approve',
				isGroupAction : true,
				itemText : getLabel( 'approve', 'Approve' ),
				maskPosition : 7
			},
			'Reject' : {
				actionName : 'reject',
				isGroupAction : true,
				itemText : getLabel( 'reject', 'Reject' ),
				maskPosition : 8
				
			}
		};

		for (var i = 0; i < arrActions.length; i++) {
			if (!Ext.isEmpty(objActions[arrActions[i]]))
				retArray.push(objActions[arrActions[i]])
		}
		return retArray;
	},
	createGroupActionColumn : function() {
		var me = this;
		var colItems = [];
		var arrRowActions = [ {
			itemId : 'btnHistory',
			itemCls : 'grid-row-action-icon icon-history',
			itemLabel : getLabel( 'historyToolTip', 'View History' ),
			toolTip : getLabel( 'historyToolTip', 'View History' ),
			maskPosition : 1
		}/*, {
			itemId : 'accept',
			itemCls : 'grid-row-text-icon icon-auth-text',
			itemLabel : getLabel('approve', 'Approve'),
			toolTip : getLabel('approve', 'Approve'),
			maskPosition : 2
		}, {
			itemId : 'reject',
			itemCls : 'grid-row-text-icon icon-reject-text',
			itemLabel : getLabel('reject', 'Reject'),
			toolTip : getLabel('reject', 'Reject'),
			maskPosition : 3
		} */];
		var actionsForWidget = availableGroupActionForGrid.row_level_actions;
		var objActionCol = null;

		colItems = me.getGroupActionColItems(actionsForWidget);
		objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			colHeader : getLabel('actions','Actions'),
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
					case 'Approve' :
						itemsArray.push({
							text : getLabel( 'approve', 'Approve' ),
							actionName : 'approve',
							itemId : 'approve',
							maskPosition : 7
						});
						break;
					
					case 'Reject' :
						itemsArray.push({
							text : getLabel( 'reject', 'Reject' ),
							actionName : 'reject',
							itemId : 'reject',
							maskPosition : 8
						});
						break;
				}
			}
		}
		return itemsArray;
	}

});
