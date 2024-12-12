Ext.define('GCP.view.CourierDlyDtlView', {
	extend: 'Ext.panel.Panel',
	border: false,
	xtype: 'courierDlyDtlView',
	requires: ['Ext.ux.gcp.SmartGrid'],
	autoHeight: true,
	cls: 'ux_panel-background ux_no-padding',
	initComponent: function() {
		var me = this;
		var gridView = me.getGridView();
		me.items = [gridView];
		me.callParent(arguments);	
	},
	getGridView: function() {
		var me = this;
		var arrCols = me.getColumns();
		var storeModel = me.getStoreModel();
		var gridView = Ext.create('Ext.ux.gcp.SmartGrid', {
			id: 'courierDlyDtlGrid',
			itemId: 'courierDlyDtlGrid',
			pageSize: 50,
			stateful: false,
			showEmptyRow: false,
			cls: 'ux_panel-transparent-background',
			rowList : _AvailableGridSize,
			padding: '5 10 10 10',
			minHeight : 0,
			maxHeight: 435,
			columnModel: arrCols,
			storeModel: storeModel,
			handleRowMoreMenuClick: me.handleRowMoreMenuClick,
			isRowIconVisible: me.isRowIconVisible,
			showCheckBoxColumn: (pageMode ==='VIEW' || pageMode ==='EDIT' || 
			                     pageMode ==='UPDATEERROR' || pageMode ==='SUBMITUPDATEERROR') ? false : true,
			multiSort : false,
			showSorterToolbar : false,
			handleRowIconClick: me.handleRowIconClick
		});
		return gridView;
	},	
	getColumns: function() {
		var me = this;
		var cols = [];
		var colPref = [{ colId: 'uniqueReferenceId', colDesc: getLabel('uniqueReferenceId', 'Unique Ref ID'), width: 200,sortable: true },
		               { colId: 'clientName', colDesc: getLabel('clientDesc', 'Client Name'), width: 260, sortable: true },
		               { colId: 'productDesc', colDesc: getLabel('productDesc', 'Product'), width: 260, sortable: true },
		               { colId: 'dispatchDate', colDesc: getLabel('collectedDispatchDate', 'Dispatch Date'), width: 120, sortable: true },
		               { colId: 'beneficiaryCode', colDesc: getLabel('beneficiaryCode', 'Receiver Code'), width: 120, sortable: true },
		               { colId: 'beneficiaryDesc', colDesc: getLabel('beneficiaryDesc', 'Receiver Name'), width: 260, sortable: true },
		               { colId: 'instNmbr', colDesc: getLabel('instrumentNumber', 'Instrument Number'), width: 200, sortable: true },
		               { colId: 'instrumentAmount', colDesc: getLabel('instrumentAmount', 'Instrument Amount'), width: 200, sortable: true },
		               { colId: 'printBranchDesc', colDesc: getLabel('printBranch', 'Print Branch'), width: 260, sortable: true },
		               { colId: 'dlyStatusDesc', colDesc: getLabel('dlyStatusDesc', 'Delivery Status'), width: 200, sortable: true }];
		var actions = [{ itemId: 'btnEdit', itemCls: 'grid-row-action-icon icon-edit', toolTip: getLabel('editToolTip', 'Edit') },
		               { itemId: 'btnView', itemCls: 'grid-row-action-icon icon-view', toolTip: getLabel('viewToolTip', 'View') }];

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
    columnRenderer : function(value, meta, record, rowIndex, colIndex, store, view, colId){
        var strRetVal = value;
        if(!Ext.isEmpty(strRetVal)) {
            meta.tdAttr = 'title="' + strRetVal + '"';
        }
        return strRetVal;
    },
	getStoreModel: function() {
		var storeModel = {
			fields: ['uniqueReferenceId', 'clientName','clientCode' ,'productCode','productDesc','dispatchDate',
			         'beneficiaryCode','beneficiaryDesc','instNmbr', 'instrumentAmount','printBranch','printBranchDesc',
			         'deliveryStatus','dlyStatusDesc','recordKeyNo', 'requestState', 'version', 'identifier'],
			proxyUrl: 'services/courierDlyMaintDtl.json',
			rootNode: 'd.profile',
			totalRowsNode: 'd.__count'
		};
		return storeModel;
	},
	
	handleRowIconClick: function(gridview, rowIndex, columnIndex, btn, event, record) {
		var me = this;
		me.fireEvent('handleGridRowIconClick', gridview, rowIndex, columnIndex, btn, event, record);
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