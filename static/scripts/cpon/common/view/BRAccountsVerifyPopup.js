Ext.define('GCP.view.BRAccountsVerifyPopup', {
			extend : 'Ext.window.Window',
			xtype : 'servicesverifypopup',
			modal : true,
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
			config : {
				seekUrl : null,
				title : null,
				columnName : null,
				profileId : null,
				featureType : null,
				module : null,
				assigned : null
			},
			closeAction: 'hide',
			initComponent : function() {
				var me = this;
				clientListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							xtype : 'detailsListView',
							pageSize : 5,
							stateful : false,
							showAllRecords : true,
							showEmptyRow : false,
							showCheckBoxColumn : false,
							//padding : '5 0 0 0',
							height : 190,
							profileId : me.profileId,
							featureType : me.featureType,
							module : me.module,
							assigned : 'Y',
							columnModel : [{
										colHeader : me.columnName,
										colId : 'name',
										width : 200
									}],
							storeModel : {

								fields : ['name'],

								proxyUrl : '' + me.seekUrl + '.json',
								rootNode : 'd.filter',
								totalRowsNode : 'd.count'
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
							text : getLabel('cancel', 'Cancel'),
							cls : 'xn-button ux_button-background-color ux_cancel-button',
							glyph : 'xf056@fontawesome',
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
				if (!Ext.isEmpty(me.profileId)) {
					var url = Ext.String.format(
							'&featureType={0}&module={1}&profileId={2}',
							me.featureType, me.module, me.profileId);
					strUrl = strUrl + url;
					if (me.assigned == 'Y')
					{
						strUrl = strUrl + '&assigned=\'Y\'';
					}
				} else {
					var url = Ext.String.format('&featureType={0}&module={1}',
							me.featureType, me.module);
					strUrl = strUrl + url;
				}
				grid.loadGridData(strUrl, null, null, false);
			}

		});
