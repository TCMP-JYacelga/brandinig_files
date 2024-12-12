Ext.define('CPON.view.ReportFilterPopup', {
	extend : 'Ext.window.Window',
	xtype : 'reportFilterPopup',
	modal : true,
	requires : [ 'Ext.ux.gcp.SmartGrid', 'Ext.data.Store' ],
	height : 320,
	width : 400,
	config : {
		bankReportCode : null,
		showCheckBoxColumn : true
	},
	initComponent : function() {
		var me = this;
		clientListView = Ext.create('Ext.ux.gcp.SmartGrid', {
			pageSize : 5,
			stateful : false,
			showEmptyRow : false,
			showCheckBoxColumn : false,
			padding : '5 0 0 0',
			rowList : [ 5, 10, 15, 20, 25, 30 ],
			minHeight : 190,
			columnModel : [ {
				colHeader : getLabel('fieldName', 'Field Name'),
				colId : 'fieldId',
				width : 130
			}, {
				colHeader : getLabel('fieldDescription', 'Field Description'),
				colId : 'description',
				width : 210
			} ],
			storeModel : {

				fields : [ 'description', 'fieldId', 'identifier' ],

				proxyUrl : 'cpon/clientServiceSetup/bankReportsFields.json',
				rootNode : 'd.accounts',
				totalRowsNode : 'd.count'
			},
			listeners : {
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData,
				gridRowSelectionChange : function(grid, record, recordIndex,
						records, jsonData) {
				}
			}
		});

		me.items = [ clientListView ];

		me.buttons = [ {
			xtype : 'button',
			text : getLabel('ok', 'OK'),
			cls : 'xn-button ux_button-background-color ux_cancel-button',
			glyph : 'xf058@fontawesome',
			handler : function() {
				me.close();
			}
		} ];

		this.callParent(arguments);
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + '&id='+encodeURIComponent(parentkey)+'&$select=' + me.bankReportCode;
		grid.loadGridData(strUrl, me.updateSelection, null, false);
	},
	updateSelection : function(grid, responseData, args) {
		if (viewmode === 'VIEW' || viewmode === 'MODIFIEDVIEW')
			grid.getSelectionModel().setLocked(true);
	}
});
