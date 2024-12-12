var selectedr = new Array();
var strDestinationName = null;
Ext.define('GCP.view.DestinationSelectionPopup', {
			extend : 'Ext.window.Window',
			xtype : 'destinationSelectionPopup',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
			width : 450,
			modal : true,
			draggable : false,
			autoScroll : true,
			config : {
				fnCallback : null,
				title : null
			},

			initComponent : function() {
				var me = this;
				this.title = me.title;
				var strUrl = 'services/adminUserRoles.json';
				var colModel = me.getColumns();
				destinationListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							pageSize : 5,
							stateful : false,
							showEmptyRow : false,
							rowList : _AvailableGridSize,
							minHeight : 150,
							xtype : 'destinationListView',
							itemId : 'destinationListViewId',
							profileId : me.profileId,
							featureType : me.featureType,
							module : me.module,
							showCheckBoxColumn : true,
							columnModel : colModel,
							storeModel : {
								fields : ['categoryDesc', 'categoryCode'],
								proxyUrl : strUrl,
								rootNode : 'd.bankAdminCategoryList',
								totalRowsNode : 'd.__count'
							},
							listeners : {
								render : function(grid) {
									me.handlePagingData(grid,
											grid.store.dataUrl, grid.pageSize,
											1, 1, null);
								},
								beforeselect : me.handleBeforeSelect,
								beforedeselect : me.handleBeforeSelect,
								select : me.addSelected,
								deselect : me.removeDeselected,
								gridPageChange : me.handleLoadGridData,
								gridSortChange : me.handlePagingData,
								gridRowSelectionChange : function(grid, record,
										recordIndex, records, jsonData) {
								}
							}

						});

				this.items = [{
					xtype : 'panel',
					cls : 'xn-filter-toolbar',
					layout : 'vbox',
					align : 'stretch',
					flex : 0.9,
					items : [{
								xtype : 'label',
								text : getLabel('destName', 'Destination Name'),
								cls : 'frmLabel',
								padding : '0 0 0 6'
							}, {
										xtype : 'textfield',
										width : 200,
										enforceMaxLength : true,
										maxLength : 50,
										fieldCls : 'x-form-text inline_block',
										triggerBaseCls : 'xn-form-trigger',
										itemId : 'destinationName',
										maskRe :/[0-9.a-z.A-Z]/
							}]
				    },{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						layout : 'vbox',
						align : 'stretch',
						flex : 0.9,
						items : [{
									xtype : 'label',
									text : getLabel('selectRoles', 'Select Roles'),
									cls : 'frmLabel',
									padding : '0 0 0 6'
								}]
					    },
				              destinationListView];
				this.buttons = [{
							xtype : 'button',
							text : getLabel('btnSave', 'Save'),
							cls : 'ft-button-primary',
							handler : function() {
								me.saveItems();
							}
						}, {
							xtype : 'button',
							text : getLabel('cancel', 'Cancel'),
							cls : 'xn-button ux_button-background-color ux_cancel-button',
							glyph : 'xf056@fontawesome',
							handler : function() {
								selectedr=[];
								me.close();
							}
						}];
				this.callParent(arguments);
			},
			getColumns : function() {
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				var arrColsPref = [	{
										colDesc : getLabel('lblRole','Role'),
										colId : 'categoryCode',
										width : 150
									},{
										colDesc : getLabel('lblRoleDesc','Role Description'),
										colId : 'categoryDesc',
										width : 200
									}
								  ];
				
					if (!Ext.isEmpty(arrColsPref)) {
						for (var i = 0; i < arrColsPref.length; i++) {
							objCol = arrColsPref[i];
							cfgCol = {};
							cfgCol.colHeader = objCol.colDesc;
							cfgCol.colId = objCol.colId;
							cfgCol.width = objCol.width;
							cfgCol.fnColumnRenderer = me.columnRenderer;
							arrCols.push(cfgCol);	
						}
					}
					return arrCols;
				},
			columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
				view, colId) {
				return value;
			},
			handleBeforeSelect : function(me, record, index, eOpts){
				if(record.data.readOnly === true )
					return false;
			},
			addSelected : function(row, record, index , eopts){
				var allreadyPresent = false;
				for(var i=0; i<selectedr.length;i++) {
					if(selectedr[i]===record.data.categoryCode){	
						allreadyPresent = true;			
						break;
					}
				}
				if(!allreadyPresent) {
					selectedr.push(record.data.categoryCode);
					record.raw.isAssigned=true;
					allreadyPresent = false;
				}
			},	
			
			removeDeselected : function(row, record, index , eopts){
				var index= -1;
				for(var i=0; i<selectedr.length;i++) {
					if(selectedr[i]===record.data.categoryCode){	
						index = i;		
						break;
					}
				}
				if (index > -1) {
					selectedr.splice(index, 1);
				}
			},
			saveItems : function() {
				var me = this;
				var records = selectedr;
				var strDestName = me.down('textfield[itemId="destinationName"]');
				if (!Ext.isEmpty(me.fnCallback)
						&& typeof me.fnCallback == 'function') {
					me.fnCallback(records,strDestName.getValue());
					selectedr=[];
					me.close();
				}
			},

			handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this;
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,
						sorter);
				grid.loadGridData(strUrl, me.up('destinationSelectionPopup').updateLoadSelection, grid, false);
			},

			handlePagingData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this;
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,
						sorter);	
				grid.loadGridData(strUrl, me.updateSelection, grid, false);
			},

			updateSelection : function(grid, responseData, args) {
				var me = this;
					//var selectedArray = responseData.d.selectedValues;
					//for ( var i = 0; i < selectedArray.length; i++) {
						//selectedr.push(selectedArray[i].value);
					//}
				if (!Ext.isEmpty(grid)) {
					var store = grid.getStore();
					var records = store.data;
					if (!Ext.isEmpty(records)) {
						var items = records.items;
						var selectedRecords = new Array();
						if (!Ext.isEmpty(items)) {
							for (var i = 0; i < items.length; i++) {
								var item = items[i];
								var isInSelectedr = false;
								for(var j=0; j<selectedr.length;j++) {
									if(selectedr[j]===item.data.value){	
										isInSelectedr = true;			
										break;
									}
								}
								if(isInSelectedr){
									selectedRecords.push(item);
								}
							}
						}
						if (selectedRecords.length > 0){
							grid.suspendEvent('beforeselect');
							grid.getSelectionModel().select(selectedRecords);
							grid.resumeEvent('beforeselect');
						}
					}
				}
			},
			updateLoadSelection : function(grid, responseData, args) {
				var me = this;
				if (!Ext.isEmpty(grid)) {
					var store = grid.getStore();
					var records = store.data;
					if (!Ext.isEmpty(records)) {
						var items = records.items;
						var selectedRecords = new Array();
						if (!Ext.isEmpty(items)) {
							for (var i = 0; i < items.length; i++) {
								var item = items[i];
								var isInSelectedr = false;
								for(var j=0; j<selectedr.length; j++) {
									if(selectedr[j]===item.data.categoryCode){	
										isInSelectedr = true;			
										break;
									}
								}
								if(isInSelectedr){
									selectedRecords.push(item);
								}
							}
						}
						if (selectedRecords.length > 0){
							grid.suspendEvent('beforeselect');
							grid.getSelectionModel().select(selectedRecords);
							grid.resumeEvent('beforeselect');
						}
					}
				}
			}
		});