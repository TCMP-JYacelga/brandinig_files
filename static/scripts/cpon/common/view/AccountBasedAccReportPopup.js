Ext.define('GCP.view.AccountBasedAccReportPopup', {
	extend : 'Ext.window.Window',
	xtype : 'accountBasedAccReportPopup',
	modal : true,
	requires : [ 'Ext.ux.gcp.SmartGrid', 'Ext.data.Store' ],
	height : 350,
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
					text : getLabel('reportName', 'Report Name')
				}, {
					xtype : 'label',
					text : '',
					itemId : 'aReportName'
				} ]

			}, {

				xtype : 'panel',
				width : 175,
				layout : 'vbox',
				items : [ {
					xtype : 'label',
					text : getLabel('type', 'Type')
				}, {
					xtype : 'label',
					text : getLabel('account', 'Account')
				} ]

			} ]
		}, clientListView ];

		me.buttons = [ {
			xtype : 'button',
			text : getLabel('ok', 'OK'),
			cls : 'xn-button',
			handler : function() {
				var selection = me.down('grid').getSelectedRecords();
				if (selection[0]) {
					var arrayJson = new Array();
					var grid = me.down('grid');
					var records = grid.getSelectedRecords();
					for ( var index = 0; index < records.length; index++) {
						var usrMsgJson = {
							bankReportCode : me.bankReportCode,
							accountNmbr : records[index].data.accountNmbr,
							recordKeyNo : records[index].data.recordKeyNo
						};
						arrayJson.push({
							identifier : records[index].data.identifier,
							userMessage : Ext.encode(usrMsgJson)
						});
					}
					if (arrayJson)
						arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});
					Ext.Ajax.request({
						url : 'cpon/clientServiceSetup/assignBankReportAccount.json',
						params : {id:parentkey},
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							var accGrid = me.down('grid');
							accGrid.refreshData();
							me.close();
						},
						failure : function() {
							var errMsg = "";
							Ext.MessageBox.show({
								title : getLabel('instrumentErrorPopUpTitle',
										'Error'),
								msg : getLabel('instrumentErrorPopUpMsg',
										'Error while fetching data..!'),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							});
						}
					});

				} else
					{
						var arrayJson = new Array();
					var grid = me.down('grid');
					
						var usrMsgJson = {
							bankReportCode : me.bankReportCode
						};
						arrayJson.push({
							userMessage : Ext.encode(usrMsgJson)
						});
					
					
					Ext.Ajax.request({
						url : 'cpon/clientServiceSetup/assignBankReportAccount.json',
						params : {id:parentkey},
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							
							var accGrid = me.down('grid');
							accGrid.refreshData();
							me.close();
						},
						failure : function() {
							var errMsg = "";
							Ext.MessageBox.show({
								title : getLabel('instrumentErrorPopUpTitle',
										'Error'),
								msg : getLabel('instrumentErrorPopUpMsg',
										'Error while fetching data..!'),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							});
						}
					});
					}

			}
		} ];

		this.callParent(arguments);
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + '&id='+ encodeURIComponent(parentkey)+ '&$select=' + me.bankReportCode;
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
