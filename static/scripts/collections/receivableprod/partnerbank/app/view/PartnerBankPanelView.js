/**
 * @class PartnerBankPanelView
 * @extends Ext.panel.Panel
 * @author Gaurav Kabra
 */

Ext.define('GCP.view.PartnerBankPanelView', {
	extend: 'Ext.panel.Panel',
	border: false,
	xtype: 'partnerBankPanelView',
	requires: ['Ext.ux.gcp.SmartGrid'],
	autoHeight: true,
	cls: 'ux_panel-background ux_no-padding',
	initComponent: function() {
		var me = this;
		var actionBar = me.getActionBar();
		var gridView = me.getGridView();
		me.items = [{
			xtype: 'container',
			layout: 'hbox',
			flex: 1,
			items: [{
				xtype: 'toolbar',
				itemId: 'btnAttachPartnerToolBar',
				flex: 1,
				padding: '0 0 20 0',
				cls: 'ux_extralargepadding-top',
				items: [{
					xtype: 'button',
					border: 0,
					hidden: (pagemode==='VIEW' || pagemode==='MODIFIEDVIEW') ? true : false,
					text: getLabel('attachPartnerBank', 'Attach Partner Bank'),
					cls: 'cursor_pointer ux_button-padding ux_button-background-color',
					glyph: 'xf055@fontawesome',
					margin: '0 0 0 10',
					padding: '4 0 2 0',
					itemId: 'btnAttachPartner'
				}]
			}]
		}, {
			xtype: 'container',
			layout: 'hbox',
			cls: 'ux_panel-transparent-background',
			itemId: 'attachPartnerActionsView',
			items: [{
				xtype: 'label',
				text: getLabel('actions', 'Actions') + ':',
				cls: 'font_bold ux_font-size14',
				padding: '5 0 0 10'
			}, actionBar, {
				xtype: 'label',
				text: '',
				flex: 1
			}]
		}, gridView];
		me.callParent(arguments);	
	},
	getGridView: function() {
		var me = this;
		var arrCols = me.getColumns();
		var storeModel = me.getStoreModel();
		var gridView = Ext.create('Ext.ux.gcp.SmartGrid', {
			id: 'partnerDetailsGrid',
			itemId: 'partnerDetailsGrid',
			pageSize: 5,
			stateful: false,
			cls: 'ux_panel-transparent-background',
			padding: '5 10 10 10',
			rowList: [5, 10, 15, 20, 25, 30],
			height: 'auto',
			columnModel: arrCols,
			storeModel: storeModel,
			showEmptyRow: false,
			/*isRowMoreMenuVisible: me.isRowMoreMenuVisible,*/
			handleRowMoreMenuClick: me.handleRowMoreMenuClick,
			isRowIconVisible: me.isRowIconVisible,
			showCheckBoxColumn: true,
			multiSort : false,
			showSorterToolbar : false,
			handleRowIconClick: me.handleRowIconClick/*,
			handleRowMoreMenuItemClick: function(menu, event) {
				var dataParams = menu.ownerCt.dataParams;
				me.handleRowIconClick(dataParams.view, dataParams.rowIndex,
						dataParams.columnIndex, this, event, dataParams.record);
			}*/
		});
		return gridView;
	},
	
	getColumns: function() {
		var me = this;
		var cols = [];
		var colPref = [{ colId: 'patnerBankDesc', colDesc: 'Partner Bank', width: 260 },
		               { colId: 'arrangment', colDesc: 'Arrangement', width: 200, sortable: false },
		               { colId: 'defArrangementCode', colDesc: 'Default Arrangement', width: 200, sortable: false },
		               { colId: 'lineDesc', colDesc: 'Line', width: 200 },
		               { colId: 'requestState', colDesc: 'Status', sortable: false }];
		var actions = [{ itemId: 'btnEdit', itemCls: 'grid-row-action-icon icon-edit', toolTip: getLabel('editToolTip', 'Edit') },
		               { itemId: 'btnView', itemCls: 'grid-row-action-icon icon-view', toolTip: getLabel('viewToolTip', 'View') }];
		cols.push({
			colType: 'actioncontent', colId: 'actioncontent', width: 80,
			align: 'right', locked: true, sortable: false, items: actions
		});
		Ext.each(colPref, function(objCol) {
			var cfgCol = {};
			cfgCol.colId = objCol.colId;
			cfgCol.colHeader = objCol.colDesc;
			cfgCol.colType = objCol.colType;
			cfgCol.hidden = (Ext.isEmpty(objCol.hidden)) ? false : objCol.hidden;
			cfgCol.width = (Ext.isEmpty(objCol.width)) ? 120 : objCol.width;
			cfgCol.sortable = (Ext.isEmpty(objCol.sortable)) ? true : objCol.sortable;
			cfgCol.fnColumnRenderer = me.columnRenderer;
			cols.push(cfgCol);
		});
		return cols;
	},
	
	getStoreModel: function() {
		var storeModel = {
			fields: ['arrangment', 'holidayAction', 'line', 'lineDesc', 'nostroAccounting', 'partnerBank', 'patnerBankDesc', 'paymentDays',
			         'productCode', 'recordKeyNo', 'requestState', 'scheduleFormat', 'scheduleSplitFlag','liqPaymentFlag', 'version', 'identifier',
			         'profileId','defArrangementCode','defArrangementProfileId'],
			proxyUrl: 'services/receivableProducMstDetail/readDetails.json',
			rootNode: 'd.partnerDetails',
			totalRowsNode: 'd.metadata.__count'
		};
		return storeModel;
	},
	
	handleRowMoreMenuClick: function() {
		
	},
	
	handleRowIconClick: function(gridview, rowIndex, columnIndex, btn, event, record) {
		var grid = this;
		grid.fireEvent('handleGridRowIconClick', gridview, rowIndex, columnIndex, btn, event, record);
	},
	
	getActionBar: function() {
		var actionBar = Ext.create('Ext.toolbar.Toolbar', {
			itemId: 'dtlsActionBar',
			componentCls: 'xn-custom xn-btn-default-toolbar-small xn-custom-toolbar',
			height: 18,
			width: '100%',
			items: [{
				text: getLabel('discard', 'Discard'),
				disabled: true,
				itemId: 'discardBtn',
				actionName: 'discard'
			}]
		});
		return actionBar;
	},
	
	columnRenderer: function(value, meta, record, rowIndex, colIndex, store, view, colId) {
		var strRetValue = value;
		var clsName = '';
		if(colId === 'col_requestState') {
			if(value.toString() === '0') strRetValue = 'New';
			else if(value.toString() === '1') strRetValue = 'Approved';
			else if(value.toString() === '2') strRetValue = 'Modified';
		}
		if(pagemode === 'MODIFIEDVIEW' && blnViewOld==='TRUE') {
			if(record.raw.changeState === 1) {
				clsName = 'modifiedFieldValue';
			} else if(record.raw.changeState === 2) {
				clsName = 'deletedFieldValue';
			}else if(record.raw.changeState === 3) {
				clsName = 'newFieldGridValue';
			}
		}
		return '<span class="' + clsName + '">' + strRetValue + '</span>';
	},
	
	isRowIconVisible: function(store, record, jsonData, itmId, maskPosition) {
		if(itmId === 'btnEdit') {
			if(pagemode==='VIEW' || pagemode==='MODIFIEDVIEW') {
				return false;
			}
		} 
		return true;
	}
});