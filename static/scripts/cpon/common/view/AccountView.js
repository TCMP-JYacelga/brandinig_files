Ext.define('GCP.view.AccountView', {
			extend : 'Ext.panel.Panel',
			xtype : 'accountview',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
			
			initComponent : function() {
				var me = this;
				this.title = me.title;
				var strUrl = 'cpon/clientServiceSetup/accPkgAssignmentList.json';
				var colModel = me.getColumns();
				adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							pageSize : 5,
							xtype : 'profileListView',
							itemId : 'profileListView',
							stateful : false,
							showEmptyRow : false,
							showCheckBoxColumn : false,
							padding : '0 0 3 0',
							minHeight : 0,
							columnModel : colModel,
							storeModel : {
					fields : ['accountName','packageDesc'],
					proxyUrl : 'cpon/clientServiceSetup/accPkgAssignmentList.json',
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
				this.items = [adminListView];
				this.callParent(arguments);
			},

			getColumns : function() {
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				var arrColsPref = [{
							"colId" : "accountName",
							"colDesc" : "Account Name"
						}, {
							"colId" : "packageDesc",
							"colDesc" : "Packages",
							"colType" : "number"

						}];
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

				cfgCol.width = 120;
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
				
			}
		}
		return arrCols;
	},

	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
		view, colId) {
		var strRetValue = "";
		if (colId === 'col_productCode'){
			strRetValue = '<span class="activitiesLink underlined">'+value+'</span>';
		} else {
			strRetValue = value;
		}
		if(record.raw.isUpdated === true)
			strRetValue='<span class="color_change">'+strRetValue+'</span>';
		return strRetValue;
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
