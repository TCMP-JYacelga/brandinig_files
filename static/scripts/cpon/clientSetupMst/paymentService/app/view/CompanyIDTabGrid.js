Ext.define('CPON.view.CompanyIDTabGrid', {
	extend : 'Ext.panel.Panel',
	requires:['Ext.grid.column.Action'],
	xtype : 'companyIDTabGrid',
	selType : 'rowmodel',
	itemId : "companyIDTabGrid",
	padding : '10 0 0 0',
	autoHeight : true,
	minHeight : 200,
	width : 450,
	cls : 'xn-grid-cell-inner',
	initComponent : function() {
				var me = this;
				var colModel = me.getColumns();
				
				adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							stateful : false,
							showEmptyRow : false,
							padding : '5 0 0 0',
							minHeight : 150,
							//pageSize : 5,
							columnModel : colModel,
							hideRowNumbererColumn : true,
							storeModel : {
								fields : ['companyName','companyId','defaultAccNumber'],
								proxyUrl : 'cpon/clientServiceSetup/companyList.json?id='+encodeURIComponent(parentkey),
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

				me.items = [adminListView];
				
				me.callParent(arguments);
			},
			
			getColumns : function() {
				arrColsPref = [{
							"colId" : "companyId",
							"colDesc" :  getLabel('companyId','Company ID')
						}, {
							"colId" : "companyName",
							"colDesc" :  getLabel('companyName','Company Name')
						}];
				objWidthMap = {
					"companyId" : 130,
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
				var strUrl = url;/*grid.generateUrl(url, pgSize, newPgNo, oldPgNo,
						sorter);*/
				//strUrl = strUrl + '&$select='+me.packageId;
				//strUrl = strUrl + '&$filter=acctUsagePay eq \'Y\'';
				
				grid.loadGridData(strUrl, me.updateSelection, grid, false);
			},

			updateSelection : function(grid, responseData, args) {
				var me = this;
				var selectAll = args.selectAllCheckBox;/*
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
				}*/
			}
			
		});
