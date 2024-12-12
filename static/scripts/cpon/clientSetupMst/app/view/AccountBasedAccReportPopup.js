Ext.define('GCP.view.AccountBasedAccReportPopup', {
	extend : 'Ext.window.Window',
	xtype : 'accountBasedAccReportPopup',
	modal : true,
	requires : [ 'Ext.ux.gcp.SmartGrid', 'Ext.data.Store' ],
	minHeight : 350,
	width : 420,
	config : {
		bankReportCode : null,
		showCheckBoxColumn : true
	},
	initComponent : function() {
		var me = this;
		this.title = getLabel('accounts', 'Accounts');
		
		clientListView = Ext.create('Ext.ux.gcp.SmartGrid', {
			pageSize : 5,
			stateful : false,
			showEmptyRow : false,
			showCheckBoxColumn : me.showCheckBoxColumn,
			padding : '5 0 0 0',
			rowList : [ 5, 10, 15, 20, 25, 30 ],
			minHeight : 190,
			columnModel : [ {
				colHeader : getLabel('accountno', 'Account'),
				colId : 'accountNmbr',
				width : 130
			}, {
				colHeader : getLabel('accountName', 'Account Name'),
				colId : 'accountName',
				width : 210
			} ],
			storeModel : {

				fields : [ 'accountNmbr', 'accountName','recordKeyNo' ],

				proxyUrl : 'cpon/clientServiceSetup/bankReportAccounts.json',
				rootNode : 'd.accounts',
				totalRowsNode : 'd.__count'
			},
			listeners : {
				render : function(grid) {
					me.handlePagingData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handlePagingData,
				gridRowSelectionChange : function(grid, record, recordIndex,
						records, jsonData) {
				}
			}
		});

		me.items = [ {
			xtype : 'panel',
			layout : 'hbox',
			items : [

			{
				xtype : 'panel',
				width : 175,
				layout : 'vbox',
				items : [ {
					xtype : 'label',
					cls : 'ux_font-size14',
					text : getLabel('reportName', 'Report Name')
				}, {
					xtype : 'label',
					cls : 'ux_font-size14-normal',
					text : '',
					itemId : 'aReportName'
				} ]

			}, {

				xtype : 'panel',
				width : 175,
				layout : 'vbox',
				items : [ {
					xtype : 'label',
					cls : 'ux_font-size14',
					text : getLabel('type', 'Type')
				}, {
					xtype : 'label',
					cls : 'ux_font-size14-normal',
					text : getLabel('account', 'Account')
				} ]

			} ]
		}, clientListView ];

		me.buttons = [ {
			xtype : 'button',
			text : '&nbsp;&nbsp;&nbsp;&nbsp;'+getLabel('cancel', 'Cancel'),
			cls : 'xn-button ux_button-background-color ux_cancel-button',
			glyph : 'xf056@fontawesome',
			handler : function() {
				me.close();
			}
		} ];

		this.callParent(arguments);
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		var isAssigned = 'false';
		if(!me.up('accountBasedAccReportPopup').showCheckBoxColumn)
			isAssigned = 'true';
			
		strUrl = strUrl + '&id='+ encodeURIComponent(parentkey)+ '&$select=' + me.up('accountBasedAccReportPopup').bankReportCode
		 + '&$isAssigned=' + isAssigned ;
			
		grid.loadGridData(strUrl, me.up('accountBasedAccReportPopup').updateSelection, null, false);
	},
	handlePagingData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		var isAssigned = 'false';
		if(!me.showCheckBoxColumn)
			isAssigned = 'true';
			
		strUrl = strUrl + '&id='+ encodeURIComponent(parentkey)+ '&$select=' + me.bankReportCode
		  + '&$isAssigned=' + isAssigned ;

		grid.loadGridData(strUrl, me.updateSelection, null, false);
	},
	updateSelection : function(grid, responseData, args) {
		var me = this;
				if (!Ext.isEmpty(grid)) {
					var store = grid.getStore();
					var records = store.data;
					if (!Ext.isEmpty(records)) {
						var items = records.items;
						var selectedRecords = new Array();
						if (!Ext.isEmpty(items)) {
							for (var i = 0; i < items.length; i++) {
								var item = items[i];
								var isSelected = item.data.recordKeyNo;
								if (!Ext.isEmpty(isSelected))
								{
									selectedRecords.push(item);
								}
							}
						}
						if (selectedRecords.length > 0){
							grid.suspendEvent('beforeselect');
							grid.getSelectionModel().select(selectedRecords);
							grid.resumeEvent('beforeselect');
						}
					}
				}
		if (viewmode === 'VIEW' || viewmode === 'MODIFIEDVIEW')
			grid.getSelectionModel().setLocked(true);
	}
});
