Ext.define('GCP.view.AccAssignmentPopupView', {
			extend : 'Ext.window.Window',
			xtype : 'accAssignmentPopupView',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store','Ext.ux.gcp.AutoCompleter'],
			width : 470,
			autoHeight : true,
			//closeAction : 'hide',
			modal : true,
			draggable : true,
			autoScroll : true,
			title : getLabel('accountname','Account Name'),
			config : {
				itemId : null,
				packageId : null,
				id : null
			},
			initComponent : function() {
				var me = this;
				var colModel = me.getColumns();
				
				accountFilter = Ext.create('Ext.ux.gcp.AutoCompleter', {
					padding : '1 0 0 0',
					fieldCls : 'xn-form-text w12 xn-suggestion-box',
					itemId : 'packageFilter',
					cfgUrl : 'cpon/clientServiceSetup/availableAccounts.json',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					//cfgSeekId : 'payAccountSeek',
					cfgRootNode : 'd.accounts',
					cfgDataNode1 : 'acctName'
				});
				

				adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							stateful : false,
							showEmptyRow : false,
							padding : '5 0 0 0',
							minHeight : 150,
							pageSize : 5,
							columnModel : colModel,
							hideRowNumbererColumn : true,
							storeModel : {
								fields : ['accountName','identifier','accountNmbr','isAssigned','accountId'],
								proxyUrl : 'cpon/clientServiceSetup/availableAccounts.json',
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
							},
							checkBoxColumnRenderer : function(value, metaData,
									record, rowIndex, colIndex, store, view) {

							}

						});

				me.items = [{
					xtype : 'container',
					layout : 'hbox',
					items : [accountFilter,
						{
							xtype : 'button',
							itemId : 'btnSearchPackage',
							text : getLabel('search', 'Search'),
							cls : 'xn-button',
							margin : '4 0 0 15',
							handler : function() {
								me.searchPackages();
							}
						}
					]
				},adminListView];
				
				me.buttons = [ {
							xtype : 'button',
							text : getLabel('cancel', 'Cancel'),
							cls : 'xn-button',
							handler : function() {
								me.close();
							}
				},
							{
							xtype : 'button',
							text : getLabel('submit', 'Submit'),
							itemId : 'btnSubmitPackage',
							cls : 'xn-button',
							handler : function() {
								this.fireEvent("assignAccounts",adminListView.getSelectedRecords(),me.id);
							}
						}];
				me.callParent(arguments);
			},
			
			searchPackages : function() {
					adminListView.refreshData();
				},

			getColumns : function() {
				arrColsPref = [{
							"colId" : "accountNmbr",
							"colDesc" :  getLabel('accountNumber','Account')
						},{
							"colId" : "accountName",
							"colDesc" :  getLabel('accountname','Account Name')
						}];
				objWidthMap = {
					"acctNmbr" : 150,
					"acctName" : 150
				};
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				if (!Ext.isEmpty(arrColsPref)) {
					for (var i = 0; i < arrColsPref.length; i++) {
						objCol = arrColsPref[i];
						cfgCol = {};
						cfgCol.colHeader = objCol.colDesc;
						cfgCol.colId = objCol.colId;
						if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}

						cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;
						//cfgCol.fnColumnRenderer = me.columnRenderer;
						arrCols.push(cfgCol);
					}
				}
				return arrCols;
			},

			
			
			handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this;
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,
						sorter);
				strUrl = strUrl + '&id='+encodeURIComponent(parentkey);
				strUrl = strUrl + '&$select='+me.packageId;
				strUrl = strUrl + '&$filter=acctUsagePay eq \'Y\'';
				if (!Ext.isEmpty(accountFilter.getValue()))
				{
					strUrl = strUrl + ' and acctNmbr lk \''+ accountFilter.getValue() +'\'';
				}
				grid.loadGridData(strUrl, me.updateSelection, grid, false);
			},

			updateSelection : function(grid, responseData, args) {
			
				var me = this;
				var selectAll = args.selectAllCheckBox;
				if (!Ext.isEmpty(grid)) {
				
					var store = grid.getStore();
					var records = store.data;
					if (!Ext.isEmpty(records)) {
						var items = records.items;
						if (!Ext.isEmpty(items)) {
							var selectedRecords = new Array();
							for (var i = 0; i < items.length; i++) {
								var item = items[i];
								if (item.data.isAssigned === true) {
									selectedRecords.push(item)
								}
							}
							if (selectedRecords.length > 0)
								grid.getSelectionModel()
										.select(selectedRecords);
						}
					}
				}
			}
			
		});
