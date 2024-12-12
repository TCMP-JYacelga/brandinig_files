Ext.define('GCP.view.TrayPanelView', {
	extend: 'Ext.panel.Panel',
	border: false,
	xtype: 'trayPanelView',
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
			hidden: (pagemode==='VIEW' || pagemode==='MODIFIEDVIEW') ? true : false,
			flex: 1,
			items: [{
				xtype: 'toolbar',
				itemId: 'btnAttachTrayToolBar',
				flex: 1,
				padding: '0 0 20 0',
				cls: 'ux_extralargepadding-top',
				items: [{
					xtype: 'button',
					border: 0,
					text: getLabel('attachTrayList','Attach Tray List'),
					cls: 'cursor_pointer ux_button-padding ux_button-background-color',
					glyph: 'xf055@fontawesome',
					margin: '0 0 0 10',
					padding: '4 0 2 0',
					itemId: 'btnAttachTray'
				}]
			}]
		}, {
			xtype: 'container',
			layout: 'hbox',
			hidden: (pagemode==='VIEW' || pagemode==='MODIFIEDVIEW') ? true : false,
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
			id: 'trayDetailsGrid',
			itemId: 'trayDetailsGrid',
			pageSize: 5,
			stateful: false,
			cls: 'ux_panel-transparent-background',
			padding: '5 10 10 10',
			rowList: [5, 10, 15, 20, 25, 30],
			height: 'auto',
			columnModel: arrCols,
			storeModel: storeModel,
			showEmptyRow: false,
			handleRowMoreMenuClick: me.handleRowMoreMenuClick,
			isRowIconVisible: me.isRowIconVisible,
			showCheckBoxColumn: (pagemode==='VIEW' || pagemode==='MODIFIEDVIEW') ? false : true,
			multiSort : false,
			showSorterToolbar : false,
			handleRowIconClick: me.handleRowIconClick
		});
		return gridView;
	},	
	getColumns: function() {
		var me = this;
		var cols = [];
		var colPref = [{ colId: 'viewTrayNo', colDesc: getLabel('viewTrayNo', 'View Tray No'), width: 260 },
		               { colId: 'actualTrayNo', colDesc: getLabel('actualTrayNo', 'Actual Tray No'), width: 200, sortable: false },
		               { colId: 'psrType', colDesc: getLabel('psrType', 'PSR Type'), width: 200, sortable: false }];
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
			fields: ['viewTrayNo', 'actualTrayNo', 'psrType', 'recordKeyNo', 'requestState', 'version', 'identifier'],
			proxyUrl: 'services/bankPrinterMstDetail/readDetails.json',
			rootNode: 'd.partnerDetails',
			totalRowsNode: 'd.metadata.__count'
		};
		return storeModel;
	},
	
	handleRowIconClick: function(gridview, rowIndex, columnIndex, btn, event, record) {
		var me = this;
		me.fireEvent('handleGridRowIconClick', gridview, rowIndex, columnIndex, btn, event, record);
	},
	
	getActionBar: function() {
		var actionBar = Ext.create('Ext.toolbar.Toolbar', {
			itemId: 'dtlsActionBar',
			componentCls: 'xn-custom xn-btn-default-toolbar-small xn-custom-toolbar',
			height: 18,
			width: '100%',
			items: [{
				text: getLabel('actionDiscard', 'Discard'),
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
		if(colId === 'col_psrType') {
			if(value.toString() === 'I') strRetValue = getLabel('I','Instrument');
			else if(value.toString() === 'A') strRetValue = getLabel('A','Advice');
			else if(value.toString() === 'W') strRetValue = getLabel('W','WHT');
		}
		if(pagemode==='MODIFIEDVIEW') {
			if(record.raw.changeState === 1) {
				clsName = 'modifiedFieldValue';
			} else if(record.raw.changeState === 2) {
				clsName = 'deletedFieldValue';
			}else if(record.raw.changeState === 2) {
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