Ext.define('CPON.view.PayProductCustomLayoutPopup', {
			extend : 'Ext.window.Window',
			xtype : 'payProductCustomLayoutPopup',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
			width : 450,
			height : 300,
			modal : true,
			draggable : true,
			closeAction : 'hide',
			autoScroll : true,
			title : 'Custom Layout Id',
			config : {
				columnName : null,
				strUrl : null,
				actionUrl : null,
				filterUrl : null
			},

			initComponent : function() {
				var me = this;
				var colModel = me.getColumns();

				adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							xtype : 'profileListView',
							itemId : 'profileListView',
							stateful : false,
							showEmptyRow : false,
							showCheckBoxColumn : false,
							padding : '5 0 0 0',
							minHeight : 100,
							minWidth : 100,
							pageSize : 5,
							showPager : true,
							rowList : [5, 10, 20],
							columnModel : colModel,
							storeModel : {
								fields : ['name','value'],
								proxyUrl : 'cpon/productCustomIds.json',
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
							},
							checkBoxColumnRenderer : function(value, metaData,
									record, rowIndex, colIndex, store, view) {
							}
						});

				me.items = [adminListView];
				adminListView.on('cellclick', function(view, td, cellIndex, record,
							tr, rowIndex, e, eOpts) {
						var linkClicked = (e.target.tagName == 'SPAN');
						if (linkClicked) {
							var className = e.target.className;
							if (!Ext.isEmpty(className)
									&& className.indexOf('activitiesLink') !== -1) {
								me.saveData(record);
							}
						}
					});
				me.buttons = [ {
							xtype : 'button',
							text : getLabel('cancel', 'Cancel'),
							cls : 'xn-button ux_button-background-color ux_cancel-button',
							glyph : 'xf056@fontawesome',
							handler : function() {
								me.close();
							}
						}];
				me.callParent(arguments);
			},
			
			saveData : function(record) {
				var custLayId = record.get('name');
				$('#customLayoutId').val(custLayId);
				$('#custLabel').text(custLayId);
				this.close();
			},

			getColumns : function() {
				arrColsPref = [{
							"colId" : "value",
							"colDesc" : "Custom Layout"
						}];
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				if (!Ext.isEmpty(arrColsPref)) {
					for (var i = 0; i < arrColsPref.length; i++) {
						objCol = arrColsPref[i];
						cfgCol = {};
						cfgCol.colHeader = objCol.colDesc;
						cfgCol.colId = objCol.colId;
						cfgCol.width = 330;
						cfgCol.fnColumnRenderer = me.columnRenderer;
						arrCols.push(cfgCol);
					}
				}
				return arrCols;
			},

			columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
				var strRetValue = "";
				if (colId === 'col_value'){
					strRetValue = '<span class="activitiesLink underlined cursor_pointer">'+value+'</span>';
				} else {
					strRetValue = value;
				}
				return strRetValue;
			},
			
			handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this;
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,
						sorter);
				grid.loadGridData(strUrl, null, null, false);
			},
			
			
		createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	searchPackages : function()
	{
		adminListView.refreshData();	
	}
});
