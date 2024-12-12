Ext.define('GCP.view.AttachPackagePopup', {
			extend : 'Ext.window.Window',
			xtype : 'attachPackagePopup',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store','Ext.ux.gcp.AutoCompleter'],
			width : 420,
			autoHeight : true,
			modal : true,
			draggable : true,
			//closeAction : 'hide',
			autoScroll : true,
			title : getLabel('attachpkg','Attach Payment Methods'),
			config : {
				filterVal : null
			},
			initComponent : function() {
				var me = this;
				var colModel = me.getColumns();
				
				packageFilterfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
					padding : '1 0 0 0',
					fieldCls : 'xn-form-text w12 xn-suggestion-box',
					itemId : 'packageFilter',
					cfgUrl : 'cpon/cponseek/{0}.json',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'validPackageSeek',
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name'
				});
				

				adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							stateful : false,
							showEmptyRow : false,
							padding : '5 0 0 0',
							minHeight : 150,
							pageSize : 5,
							rowList : [5, 10, 15, 20, 25, 30],
							columnModel : colModel,
							hideRowNumbererColumn : true,
							storeModel : {
								fields : ['packageName','productCatType','dtlCount','identifier'],
								proxyUrl : 'cpon/clientServiceSetup/getAllPaymentPackages.json',
								rootNode : 'd.profile',
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
					items : [packageFilterfield,
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
								if(!Ext.isEmpty(adminListView.getSelectedRecords())){
									this.fireEvent("submitPackages",adminListView.getSelectedRecords());
								}else{
									me.close();
								}
							}
						}];
				me.callParent(arguments);
			},
			
			searchPackages : function() {
					adminListView.refreshData();
				},

			getColumns : function() {
				arrColsPref = [{
							"colId" : "packageName",
							"colDesc" :  getLabel('paymentPackages','Payment Methods')
						},{
							"colId" : "productCatType",
							"colDesc" :  getLabel('type','Type')
						},{
							"colId" : "dtlCount",
							"colDesc" :  getLabel('products','Products'),
							"colType" : "number"
						}];
				objWidthMap = {
					"packageName" : 120,
					"type" : 120,
					"dtlCount" : 120
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
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,sorter);
				strUrl = strUrl + '&id='+encodeURIComponent(parentkey);
				strUrl = strUrl + '&$filter=validFlag eq \'Y\'';
				
				if(selectedCategories.length!=0)
				{
					strUrl = strUrl + ' and ( '
				}
				for (var i = 0; i < selectedCategories.length; i++) 
				{
					strUrl = strUrl + ' productCatType lk \'' + selectedCategories[i] + '\'';
					if((i+1)<selectedCategories.length)
					{	
						strUrl = strUrl + ' or '
					}
				}
				
				if(selectedCategories.length!=0)
				{
					strUrl = strUrl + ' ) '
				}
				if (!Ext.isEmpty(packageFilterfield.getValue()))
				{
					strUrl = strUrl + ' and packageName lk \''+ packageFilterfield.getValue() +'\'';
				}
				grid.loadGridData(strUrl, null, null, false);
			}
			
		});
