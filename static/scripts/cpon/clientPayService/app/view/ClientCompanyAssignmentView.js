Ext.define('GCP.view.ClientCompanyAssignmentView', {
			extend : 'Ext.window.Window',
			xtype : 'clientCompanyAssignmentView',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store','Ext.ux.gcp.AutoCompleter'],
			width : 470,
			autoHeight : true,
			modal : true,
			draggable : true,
			autoScroll : true,
			title : getLabel('companyid','Client Company Assignment'),
			config : {
				packageId : null,
				id :null
			},
			initComponent : function() {
				var me = this;
				var colModel = me.getColumns();
				
				companyFilter = Ext.create('Ext.ux.gcp.AutoCompleter', {
					padding : '1 0 0 0',
					fieldCls : 'xn-form-text w12 xn-suggestion-box',
					itemId : 'packageFilter',
					cfgUrl : 'cpon/clientServiceSetup/companyList.json?id='+ encodeURIComponent(parentkey),
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
							rowList : [ 5, 10, 15, 20, 25, 30 ],
							columnModel : colModel,
							hideRowNumbererColumn : true,
							storeModel : {
								fields : ['companyId','identifier','companyName','assigned','recordKeyNo','updated'],
								proxyUrl : 'cpon/clientServiceSetup/availableCompanyList.json',
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
					items : [companyFilter,
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
							itemId : 'savebtn',
							cls : 'xn-button',
							handler : function() {
								this.fireEvent("assignCompany",adminListView.getSelectedRecords(),me.id);
							}
						}];
				me.callParent(arguments);
			},
			
			searchPackages : function() {
					adminListView.refreshData();
				},

			getColumns : function() {
				arrColsPref = [{
							"colId" : "companyId",
							"colDesc" :  getLabel('companyId','Company ID')
						},{
							"colId" : "companyName",
							"colDesc" :  getLabel('companyName','Company Name')
						}];
				objWidthMap = {
					"companyId" : 150,
					"companyName" : 150
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
				strUrl = strUrl + '&packageId='+me.packageId;
				if (!Ext.isEmpty(companyFilter.getValue()))
				{
					strUrl = strUrl + ' and companyId lk \''+ companyFilter.getValue() +'\'';
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
								if (item.data.assigned) {
									selectedRecords.push(item)
								}
							}
							if (selectedRecords.length > 0)
								grid.getSelectionModel()
										.select(selectedRecords);
						}
					}
				}
				if(viewmode == 'VIEW'  || viewmode == "MODIFIEDVIEW" || pagemode == "VERIFY"){
					grid.getSelectionModel().setLocked(true);
				}
			}
			
		});
