/**
 * @class GCP.controller.MobileDeviceRevocation
 * @extends Ext.panel.panel
 * @author Gaurav Kabra
 */

Ext.define('GCP.view.MobileDeviceRevocationView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.GroupView', 'GCP.view.MobileDeviceRevocationFilterView', 'GCP.view.MobileDeviceRevocationGridPopup'],
	xtype : 'mobileDeviceRevocationView',
	initComponent : function() {
		var me = this;
		var groupView = me.createGroupView();
		me.items = [groupView];
		me.callParent(arguments);
	},
	createGroupView : function() {
		var me = this,
			groupView = null;
		var objGroupByPref = {}
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		if (objMobileRevocaionPref) {
			var objJsonData = Ext.decode(objMobileRevocaionPref);
			//objGroupByPref = objJsonData.d.preferences.gridView || {};
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					:(MOB_DEVICE_REVOCATION_COLUMNS || '[]');
		}
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			cfgGroupByUrl : 'static/scripts/commonmst/mobileDeviceRevocation/data/groupBy.json',
			cfgParentCt : me,
			cls : 't7-grid',
			cfgShowFilter : true,
			cfgShowAdvancedFilterLink : false,
			cfgShowRefreshLink : false,
			cfgSmartGridSetting : false,
			cfgAutoGroupingDisabled : true,
			cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
			//TODO : This has to be driven from system_parameter_mst
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgFilterModel : {
				cfgContentPanelItems : [{
					xtype : 'mobileDeviceRevocationFilterView'
				}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},
			cfgGridModel : {
				pageSize : objGridSetting.defaultRowPerPage || _GridSizeTxn,
				rowList : _AvailableGridSize,
				stateful : false,
				showSorterToolbar : _charEnableMultiSort,
				heightOption : objGridSetting.defaultGridSize,
				columnHeaderFilterCfg : {},
				showEmptyRow : false,
				showPager : true,
				minHeight : 100,
				/*heightOption : objGridSetting.defaultGridSize,*/
				checkBoxColumnWidth : _GridCheckBoxWidth,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				showPagerRefreshLink : false,
				storeModel : {
					fields : ['userName', 'userId', 'deviceId', 'deviceName', 'mobileNumber', 'email', 'lastLogin', 'identifier', '__metadata', 'mapUid'],
					proxyUrl : 'services/mobileRevocationGridList.json',
					rootNode : 'd.summary',
					totalRowsNode : 'd.__count'
				},
				groupActionModel : me.getGroupActions(['revoke']),
				defaultColumnModel : /*(arrGenericColumnModel ||*/ me.getColumnModel(MOB_DEVICE_REVOCATION_COLUMNS) || []/*)*/,
				fnRowIconVisibilityHandler : me.isRowIconVisible,
				fnColumnRenderer : me.columnRenderer
				
			},
			columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
			{
				meta.tdAttr = 'title="' + value + '"';
				return value;
			}
		});
		return groupView;
	},

	getColumnModel : function(arrCols) {
		var me = this;
		var colGroupAction = me.createActionColumn();
		var arrColumns = [colGroupAction];
		return arrColumns.concat(arrCols || []);

	},
	
	createActionColumn : function() {
		var me = this;
		var colItems = [],
			groupItems = [];
		groupItems = me.getGroupActions(['revoke']);
		groupItems.forEach(function(item){
			colItems.push({
				text : item.itemText,
				itemId : item.itemId,
				actionName : item.actionName,
				maskPosition : item.maskPosition
			});
		});
		var objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			width : 108,
			colHeader : getLabel("actions", "Actions"),
			locked : true,
			sortable : false,
			hideable : false,
			items : colItems,
			visibleRowActionCount : 1
		};
		return objActionCol;
	},
	
	getGroupActions : function(availableActions) {
		var itemsArray = [];
		if (!Ext.isEmpty(availableActions)) {
			for (var i = 0; i < availableActions.length; i++) {
				if(availableActions[i] === 'revoke') {
					itemsArray.push({
						itemText : getLabel('revoke', 'Revoke'),
						itemId : 'revoke',
						isGroupAction : true,
						actionName : 'revoke',
						maskPosition : 1
					});
				}
			}
		}
		return itemsArray;
	},
	
	isRowIconVisible : function(store, record, jsonData, itmId,
			maskPosition) {
		var maskSize = 11;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var buttonMask = '1';
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
		if (Ext.isEmpty(bitPosition))
			return retValue;
		retValue = isActionEnabled(actionMask, bitPosition);
		if ((maskPosition === 1 && retValue)) {
			retValue = retValue
		}
		return retValue;
	}
});