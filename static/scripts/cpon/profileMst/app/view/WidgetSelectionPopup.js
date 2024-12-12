Ext.define('GCP.view.WidgetSelectionPopup', {
			extend : 'Ext.window.Window',
			xtype : 'widgetSelectionPopup',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
			width : 450,
			height : 300,
			modal : true,
			draggable : false,
			closeAction : 'hide',
			autoScroll : true,
			config : {
				fnCallback : null,
				profileId : null,
				featureType : null,
				module : null,
				title : null,
				columnName : null
			},

			initComponent : function() {
				var me = this;
				this.title = me.title;
				var strUrl = 'cpon/cponFeatures';
				var colModel = me.getColumns();
				widgetListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							showPager : false,
							showAllRecords : true,
							xtype : 'widgetListView',
							itemId : 'widgetListViewId',
							stateful : false,
							showEmptyRow : false,
							showCheckBoxColumn : true,
							padding : '5 0 0 0',
							minHeight : 150,
							columnModel : colModel,
							storeModel : {
								fields : ['name', 'value', 'isAssigned'],
								proxyUrl : strUrl,
								rootNode : 'd.filter',
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
				this.items = [widgetListView];
				this.buttons = [{
							xtype : 'button',
							text : getLabel('ok', 'Ok'),
							cls : 'xn-button',
							handler : function() {
								me.saveItems();
							}
						}, {
							xtype : 'button',
							text : getLabel('cancel', 'Cancel'),
							cls : 'xn-button',
							handler : function() {
								me.close();
							}
						}];
				this.callParent(arguments);
			},
			getColumns : function() {
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				var arrColsPref = [{
							colDesc : me.columnName,
							colId : 'name',
							width : 330
						}];
				if (!Ext.isEmpty(arrColsPref)) {
					for (var i = 0; i < arrColsPref.length; i++) {
						objCol = arrColsPref[i];
						cfgCol = {};
						cfgCol.colHeader = objCol.colDesc;
						cfgCol.colId = objCol.colId;
						cfgCol.width = objCol.width;
						if (!Ext.isEmpty(objCol.colType)) {
							cfgCol.colType = objCol.colType;
							if (cfgCol.colType === "number")
								cfgCol.align = 'right';
						}

						cfgCol.fnColumnRenderer = me.columnRenderer;
						arrCols.push(cfgCol);

					}
				}
				return arrCols;
			},

			columnRenderer : function(value, meta, record, rowIndex, colIndex,
					store, view, colId) {
				var strRetValue = "";
				if (colId === 'col_productCode') {
					strRetValue = '<span class="activitiesLink underlined">'
							+ value + '</span>';
				} else {
					strRetValue = value;
				}
				if (record.raw.isUpdated === true
						&& viewPageMode == 'VIEW_CHANGES')
					strRetValue = '<span class="color_change">' + strRetValue
							+ '</span>';
				return strRetValue;
			},
			saveItems : function() {
				var me = this;
				var grid = me.down('grid[itemId=widgetListViewId]');
				var records = grid.getSelectedRecords();

				if (!Ext.isEmpty(me.fnCallback)
						&& typeof me.fnCallback == 'function') {
					var totalCount = 0; // giving error :
										// grid.getStore().records.items.length;
					me.fnCallback(records, totalCount);
					me.close();
				}

			},

			handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this;
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,
						sorter);
				if (!Ext.isEmpty(me.profileId)) {
					var url = Ext.String.format(
							'&featureType={0}&module={1}&profileId={2}',
							me.featureType, me.module, me.profileId);
					strUrl = strUrl + url;
				} else {
					var url = Ext.String.format('&featureType={0}&module={1}',
							me.featureType, me.module);
					strUrl = strUrl + url;
				}
				grid.loadGridData(strUrl, me.updateSelection, grid, false);
			},

			updateSelection : function(grid, responseData, args) {
				var me = this;
				// var grid = args.grid;
				var selectAll = args.selectAllCheckBox;
				var storedWidgets = document.getElementById('selectedWidgets').value;	
				var storedActLinks = document.getElementById('selectedActionLinks').value;
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
							{
								grid.getSelectionModel()
										.select(selectedRecords);
							}	
							else
							{
								if (null!=storedWidgets)
								{
									for (var i = 0; i < items.length; i++) {
										var item = items[i];
										var tempSelectedWidgets = new Array();
										tempSelectedWidgets = storedWidgets.split(",");									
										if (tempSelectedWidgets.indexOf(item.data.value)>-1) {
											selectedRecords.push(item);												
										}
									}
									if (selectedRecords.length > 0)
									{
										grid.getSelectionModel()
												.select(selectedRecords);
									}									
								}
								if (null!=storedActLinks)
								{
									for (var i = 0; i < items.length; i++) {
										var item = items[i];
										var tempSelectedActLinks = new Array();
										tempSelectedActLinks = storedActLinks.split(",");
										if (tempSelectedActLinks.indexOf(item.data.value)>-1) {
											selectedRecords.push(item);
										}
									}
									if (selectedRecords.length > 0)
									{
										grid.getSelectionModel()
												.select(selectedRecords);
									}									
								}								
							}							
						}
					}
					if (pageType == 'VIEW') {
						grid.selModel.setLocked(true);
					}
				}
			}
		});