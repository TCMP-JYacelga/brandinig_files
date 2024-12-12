Ext.define('GCP.view.CompanyVerifyPopup', {
			extend : 'Ext.window.Window',
			xtype : 'companyverifypopup',
			modal : true,
			width : 500,
			minHeight : 156,
			maxHeight : 550,
			cls : 'non-xn-popup',
			resizable : false,
			draggable : false,
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
			closeAction: 'hide',
			title : getLabel('liqCompId','Company Id'),
			listeners : {
				resize : function(){
					this.center();
				}
			},
			initComponent : function() {
				var me = this;
				clientListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							cls : 't7-grid',
							height : 'auto',
							minHeight : 40,
							maxHeight : 400,
							scroll : 'vertical',
							xtype : 'companyListView',
							pageSize : _GridSizeMaster,
							stateful : false,
							rowList : _AvailableGridSize,
							showEmptyRow : false,
							showPager : true,
							showCheckBoxColumn : false,
							columnModel : [{
										colId : "companyId",
										colHeader :  getLabel('companyId','Company ID')
									}, {
										colId : "companyName",
										colHeader :  getLabel('companyName','Company Name')
									}, {
										colId : "defaultAccNumber",
										colHeader :  getLabel('defAccount','Default Account')
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

				me.bbar = ['->',{
							xtype : 'button',
							text : getLabel('btnClose', 'Close'),
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
