Ext.define('GCP.view.CompanyVerifyPopup', {
			extend : 'Ext.window.Window',
			xtype : 'companyverifypopup',
			modal : true,
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
			closeAction: 'hide',
			title : 'Company Id',
			initComponent : function() {
				var me = this;
				clientListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							xtype : 'companyListView',
							pageSize : 5,
							stateful : false,
							rowList : _AvailableGridSize,
							showEmptyRow : false,
							showCheckBoxColumn : false,
							padding : '5 0 0 0',
							height : 170,
							width : 420,
							columnModel : [{
										colId : "companyId",
										colHeader :  getLabel('companyId','Company ID')
									}, {
										colId : "companyName",
										colHeader :  getLabel('companyName','Company Name')
									}, {
										colId : "defaultAccNumber",
										colHeader :  getLabel('default','Default Account')
									}],
							storeModel : {

								fields : ['companyName','companyId','defaultAccNumber'],

								proxyUrl : 'cpon/clientServiceSetup/companyList.json',
								rootNode : 'd.accounts',
								totalRowsNode : 'd.__count'
							},
							listeners : {
								render : function(grid) {
									me.handleLoadGridData(grid,
											grid.store.dataUrl, grid.pageSize,
											1, 1, null);
								},
								gridPageChange : me.handleLoadGridData,
								gridSortChange : me.handleLoadGridData,
								gridRowSelectionChange : function(grid, record,
										recordIndex, records, jsonData) {
								}
							}
						});

				me.items = [clientListView];

				me.buttons = [{
							xtype : 'button',
							text : getLabel('btnOk', 'OK'),
							cls : 'xn-button',
							handler : function() {
								me.hide();
							}
						}];

				this.callParent(arguments);
			},
			handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this;
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,
						sorter);
				strUrl = strUrl + '&id='+encodeURIComponent(parentkey);
				grid.loadGridData(strUrl, null, null, false);
			}

		});
