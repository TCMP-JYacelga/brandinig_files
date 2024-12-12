Ext.define('GCP.view.AdminFeaturePopup', {
			extend : 'Ext.window.Window',
			xtype : 'adminFeaturePopup',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
			width : 450,
			height : 300,
			modal : true,
			draggable : false,
			autoScroll : true,
			config : {
				fnCallback : null,
				profileId : null,
				featureType : null,
				module : null,
				title : null,
				isAllSelected : null
			},

			initComponent : function() {
				var me = this;
				this.title = me.title;
				var strUrl = 'cpon/clientServiceSetup/cponPermissionFeatures';
				var colModel = me.getColumns();

				adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							showPager : false,
							showAllRecords : true,
							xtype : 'adminFeatureView',
							itemId : 'adminFeatureViewId',
							stateful : false,
							showEmptyRow : false,
							showCheckBoxColumn : false,
							padding : '5 0 0 0',
							minHeight : 150,
							columnModel : colModel,
							storeModel : {
								fields : ['name', 'isAssigned', 'value',
										'isAutoApproved', 'profileId','readOnly'],
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
							},
							checkBoxColumnRenderer : function(value, metaData,
									record, rowIndex, colIndex, store, view) {

							}

						});

				this.items = [adminListView];
				this.buttons = [{
							xtype : 'button',
							text : '&nbsp;&nbsp;'+getLabel('btnOk', 'Ok'),
							margin : '0 10 0 0',
							cls : 'ux_button-padding ux_button-background-color ux_largemargin-right',
							glyph : 'xf058@fontawesome',
							handler : function() {
								me.saveItems();
							}
						}, {
							xtype : 'button',
							text : '&nbsp;&nbsp;&nbsp;&nbsp;'+getLabel('cancel', 'Cancel'),
							cls : 'ux_button-padding ux_button-background-color',
							glyph : 'xf056@fontawesome',
							handler : function() {
								me.close();
							}
						}];
				this.callParent(arguments);
			},

			getColumns : function() {
				arrColsPref = [{
							"colId" : "name",
							"colDesc" : getLabel('type', 'Type')
						}];
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
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
				if(viewmode == 'VIEW'  || viewmode =="MODIFIEDVIEW" || pagemode == "VERIFY"){
					arrCols.push(me.createViewAssingedActionColumn());
					arrCols.push(me.createViewAutoApproveActionColumn());
				}else{
					arrCols.push(me.createAssingedActionColumn());
					arrCols.push(me.createAutoApproveActionColumn());
				}
				return arrCols;
			},
			columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
				view, colId) {
				var strRetValue = "";
				if(record.raw.updated === 1 && viewmode === 'MODIFIEDVIEW')
					strRetValue='<span class="newFieldValue">'+value+'</span>';
				else if(record.raw.updated === 2 && viewmode === 'MODIFIEDVIEW')
					strRetValue='<span class="modifiedFieldValue">'+value+'</span>';
				else if(record.raw.updated === 3 && viewmode === 'MODIFIEDVIEW')
					strRetValue='<span class="deletedFieldValue">'+value+'</span>';
				else 
					strRetValue = value;
				
				return strRetValue;
			},
	
			createViewAssingedActionColumn : function() {
				var me = this;
				var objActionCol = {
					colType : 'action',
					colId : 'isAssigned',
					colHeader : getLabel('assigned', 'Assigned'),
					width : 70,
					items : [{
						itemId : 'isAssigned',
						fnIconRenderer : function(value, metaData, record,
								rowIndex, colIndex, store, view) {
							if (!record.get('isEmpty')) {
								if (record.data.isAssigned === true) {
									var iconClsClass = 'icon-checkbox-checked';
									return iconClsClass;
								} else {
									var iconClsClass = 'icon-checkbox-unchecked';
									return iconClsClass;
								}
							}
						}
					}]
				};
				return objActionCol;
			},

			createViewAutoApproveActionColumn : function() {
				var me = this;
				var objActionCol = {
					colType : 'action',
					colId : 'isAutoApproved',
					colHeader : getLabel('autoapprove', 'Auto Approve'),
					width : 75,
					items : [{
						itemId : 'isAutoApproved',
						fnIconRenderer : function(value, metaData, record,
								rowIndex, colIndex, store, view) {
							if (!record.get('isEmpty')) {
								if (record.data.isAutoApproved === true) {
									var iconClsClass = 'icon-checkbox-checked';
									return iconClsClass;
								} else {
									var iconClsClass = 'icon-checkbox-unchecked';
									return iconClsClass;
								}
							}
						}
					}]
				};
				return objActionCol;
			},
			createAssingedActionColumn : function() {
				var me = this;
				var objActionCol = {
					colType : 'action',
					colId : 'isAssigned',
					colHeader : getLabel('assigned', 'Assigned'),
					width : 70,
					items : [{
						itemId : 'isAssigned',
						fnClickHandler : function(tableView, rowIndex,
								columnIndex, btn, event, record) {
							if(record.data.readOnly === false){		
							if (record.data.isAssigned === false) {
								record.set("isAssigned", true);
							} else {
								record.set("isAssigned", false);
							}}
							
						},
						fnIconRenderer : function(value, metaData, record,
								rowIndex, colIndex, store, view) {
							if (!record.get('isEmpty')) {
								if (record.data.isAssigned === true) {
									var iconClsClass = 'icon-checkbox-checked';
									return iconClsClass;
								} else {
									var iconClsClass = 'icon-checkbox-unchecked';
									return iconClsClass;
								}
							}
						}
					}]
				};
				return objActionCol;
			},

			createAutoApproveActionColumn : function() {
				var me = this;
				var objActionCol = {
					colType : 'action',
					colId : 'isAutoApproved',
					colHeader : getLabel('autoapprove', 'Auto Approve'),
					width : 75,
					items : [{
						itemId : 'isAutoApproved',
						fnClickHandler : function(tableView, rowIndex,
								columnIndex, btn, event, record) {
							if(record.data.readOnly === false){	
							if (record.data.isAutoApproved === false) {
								record.set("isAutoApproved", true);
							} else {
								record.set("isAutoApproved", false);
							}}
						},
						fnIconRenderer : function(value, metaData, record,
								rowIndex, colIndex, store, view) {
							if (!record.get('isEmpty')) {
								if (record.data.isAutoApproved === true) {
									var iconClsClass = 'icon-checkbox-checked';
									return iconClsClass;
								} else {
									var iconClsClass = 'icon-checkbox-unchecked';
									return iconClsClass;
								}
							}
						}
					}]
				};
				return objActionCol;
			},

			saveItems : function() {
				var me = this;
				var grid = me.down('grid[itemId=adminFeatureViewId]');
				var records = grid.store.data;
				if (!Ext.isEmpty(me.fnCallback)
						&& typeof me.fnCallback == 'function') {
					me.fnCallback(records);
					me.close();
				}

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
				} else {
					var url = Ext.String.format('&featureType={0}&module={1}',
							me.featureType, me.module);
					strUrl = strUrl + url;
				}
				if (me.isAllSelected == "Y") {
					strUrl = strUrl + '&isAllSelected=Y';
				}
				grid.loadGridData(strUrl, null, null, false);
			}
		});