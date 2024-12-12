Ext.define('GCP.view.PriorityRuleView', {
			extend : 'Ext.panel.Panel',
			xtype : 'priorityruleview',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
			
			initComponent : function() {
				var me = this;
				this.title = me.title;
				var strUrl = 'cpon/clientServiceSetup/productPriorityList.json';
				var colModel = me.getColumns();
				adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							pageSize : _GridSizeMaster,
							xtype : 'profileListView',
							itemId : 'profileListView',
							stateful : false,
							showEmptyRow : false,
							showCheckBoxColumn : false,
							padding : '0 0 3 0',
							rowList : _AvailableGridSize,
							minHeight : 0,
							columnModel : colModel,
							storeModel : {
								fields : ['ruleDesc','productCode','arrangementCode', 
									'activeFlag', 'identifier','reportProfileId',
									'alertProfileId', 'history'],
								proxyUrl : 'cpon/clientServiceSetup/productPriorityList.json',
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
							"colId" : "ruleDesc",
							"colDesc" : getLabel("prdRuledesc","Rule Description")
						}, {
							"colId" : "productCode",
							"colDesc" : getLabel("ruleProduct","Product")
						}, {
							"colId" : "arrangementCode",
							"colDesc" : getLabel("arrangement","Arrangement")
						}, {
							"colId" : "activeFlag",
							"colDesc" : getLabel("status","Status")
						}];
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
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
		if(colId == 'col_activeFlag') {
			if (!Ext.isEmpty(record.get('activeFlag')) && "Y" == record.get('activeFlag'))
			{
				strRetValue = getLabel('active','Active');
			}
			else if (!Ext.isEmpty(record.get('activeFlag')) && "N" == record.get('activeFlag'))
			{
				strRetValue = getLabel('inactive','Inactive');
			}
		}else{
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
			grid.loadGridData(strUrl, me.enableEntryButtons, null, false);
	},
	enableEntryButtons:function(){
		gridCountAfterRender++;
		enableDisableGridButtons(false);
	}
});