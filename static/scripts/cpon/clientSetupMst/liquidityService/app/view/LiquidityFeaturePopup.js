var fieldJson = [];
Ext.define('CPON.view.LiquidityFeaturePopup', {
			extend : 'Ext.window.Window',
			xtype : 'liquidityFeaturePopup',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
			width : 450,
			minHeight : 156,
			closeAction:'hide',
			maxHeight : 550,
			cls : 'non-xn-popup',
			modal : true,
			draggable : false,
			resizable : false,
			autoScroll : true,
			config : {
				fnCallback : null,
				profileId : null,
				featureType : null,
				module : null,
				title : null,
				isAllSelected : null
			},
			listeners : {
				resize : function(){
					this.center();
				}
			},
			initComponent : function() {
				var me = this;
				this.title = me.title;
				var strUrl = 'cpon/clientServiceSetup/cponPermissionFeatures';
				var colModel = me.getColumns();

				adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							showPager : false,
							showAllRecords : true,
							xtype : 'lmsFeatureView',
							itemId : 'lmsFeatureViewId',
							stateful : false,
							showEmptyRow : false,
							showCheckBoxColumn : false,
							minHeight : 50,
							//maxHeight : 400,
							scroll : 'vertical',
							cls : 't7-grid',
							columnModel : colModel,
							storeModel : {
								fields : ['name', 'isAssigned', 'value', 'featureValue',
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

				this.items = [{
							xtype : 'panel',
							cls : 'ft-padding-bottom',
							items : [{
								xtype : 'container',
								cls : 'ft-padding-bottom',
								itemId : 'liquidityexport_id',
								layout : {
									type : 'vbox'
								},
								items : [{
									xtype : 'container',
									layout : {
										type : 'hbox'
									},
									items : [{
										xtype : 'label',
										text : getLabel('export', 'Export'),
										width : '100%'
									}]
								}, {
									xtype : 'container',
									itemId : 'liquidityexport_chkBox',
									width : '100%',
									labelCls : 'font_bold',
									padding : '0 0 0 0',
									layout : 'column',
									vertical : true,
									items : me.getExportOptions()
								}]
							}, {
								xtype : 'container',
								cls : 'ft-padding-bottom',
								itemId : 'liquidityoptions_id',
								layout : {
									type : 'vbox'
								},
								items : [{
									xtype : 'container',
									layout : {
										type : 'hbox'
									},
									items : [{
										xtype : 'label',
										text : getLabel('options', 'Options'),
										width : '100%'
									}]
								}, {
									xtype : 'container',
									itemId : 'liquidityexport_chkBox',
									width : '100%',
									labelCls : 'font_bold',
									padding : '0 0 0 0',
									layout : 'column',
									vertical : true,
									items : me.getOptions()
								}]
							
							}]
						},
				adminListView];
			if(viewmode === 'VIEW' ){	
				this.bbar = ['->',{
							xtype : 'button',
							//cls : 'xn-button ux_button-background-color ux_cancel-button ux_largemargin-left',
							//glyph :'xf058@fontawesome',
							text : getLabel('btnClose', 'Close'),							
							handler : function() {
								me.close();
							}
						}];
			}else{
				this.bbar = [{
							xtype : 'button',
							//cls : 'xn-button ux_button-background-color ux_cancel-button ux_largemargin-left',
							//glyph : 'xf056@fontawesome',						
							text : getLabel('cancel', 'Cancel'),							
							handler : function() {
								me.close();
							}
						},'->',{
							xtype : 'button',
							//cls : 'xn-button ux_button-background-color ux_cancel-button ux_largemargin-left',
							//glyph :'xf058@fontawesome',
							text : getLabel('btnDone', 'Done'),							
							handler : function() {
								me.saveItems();
							}
						}];
			}
				this.callParent(arguments);
			},

			getColumns : function() {
				arrColsPref = [{
							"colId" : "name",
							"colDesc" : getLabel('privileges', 'Privileges')
						}];
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				if (!Ext.isEmpty(arrColsPref)) {
					for (var i = 0; i < arrColsPref.length; i++) {
						objCol = arrColsPref[i];
						cfgCol = {};
						cfgCol.colHeader = objCol.colDesc;
						cfgCol.colId = objCol.colId;
						cfgCol.width = 250;
						cfgCol.fnColumnRenderer = me.columnRenderer;
						arrCols.push(cfgCol);
					}
				}
				if(viewmode == 'VIEW'  || viewmode =="MODIFIEDVIEW" || pagemode == "VERIFY" || clientType==='S'){
					arrCols.push(me.createViewAssingedActionColumn());
					//arrCols.push(me.createViewAutoApproveActionColumn());
				}else{
					arrCols.push(me.createAssingedActionColumn());
					//arrCols.push(me.createAutoApproveActionColumn());
				}
				return arrCols;
			},
			columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
				view, colId) {
				var strRetValue = "";
				if (!Ext.isEmpty(record.raw) && !Ext.isEmpty(record.raw.featureId)) {
					value = getLabel(record.raw.featureId, value);
				}
				
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
					align : 'center',
					items : [{
						itemId : 'isAssigned',
						fnIconRenderer : function(value, metaData, record,
								rowIndex, colIndex, store, view) {
							if (!record.get('isEmpty')) {
								if (record.data.isAssigned === true) {
									var iconClsClass = 'icon-checkbox-checked-grey';
									return iconClsClass;
								} else {
									var iconClsClass = 'icon-checkbox-unchecked-grey';
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
					align : 'center',
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
					align : 'center',
					items : [{
						itemId : 'isAssigned',
						fnClickHandler : function(tableView, rowIndex,
								columnIndex, btn, event, record) {
							var panel = tableView.up('window');
							var target = panel.getTargetEl();
							if(record.data.readOnly === false){	
								var arrXY = target.getScroll();
							if (record.data.isAssigned === false) {
								record.set("isAssigned", true);
								target.scrollTo('top',arrXY.top);
							} else {
								record.set("isAssigned", false);
								target.scrollTo('top',arrXY.top);
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
							var panel = tableView.up('window');
							var target = panel.getTargetEl();
							if(record.data.readOnly === false){	
								var arrXY = target.getScroll();
							if (record.data.isAutoApproved === false) {
								record.set("isAutoApproved", true);
								target.scrollTo('top',arrXY.top);
							} else {
								record.set("isAutoApproved", false);
								target.scrollTo('top',arrXY.top);
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
				var grid = me.down('grid[itemId=lmsFeatureViewId]');
				var records = grid.store.data;
				Ext.each(fieldJson, function(field, index) {
					var featureId = field.featureId;
					var element = me.down('checkboxfield[featureId=' + featureId + ']');
					if (element != null && element != undefined) {
						field.featureValue = element.getValue();
						field.checked = element.checked;
						field.defVal = element.checked;				
					} 
				});
				if (!Ext.isEmpty(me.fnCallback)	&& typeof me.fnCallback == 'function') {
					me.fnCallback(records, fieldJson);
					me.close();
				}
				

			},
			
			updateCheckboxSelection : function(grid, responseData, args) {
				var me = this;
				if (!(selectedLiquidityFeatureList instanceof Array)) {
					selectedLiquidityFeatureList = jQuery
							.parseJSON(selectedLiquidityFeatureList);
				}
		
				if (!Ext.isEmpty(selectedLiquidityFeatureList)) {
					var previousSelectedData = selectedLiquidityFeatureList;
					if (!Ext.isEmpty(grid)) {
						var store = grid.getStore();
						var records = store.data;
						if (!Ext.isEmpty(records)) {
							var items = records.items;
							if (!Ext.isEmpty(items)) {
								for (var index = 0; index < items.length; index++) {
									var item = items[index].data;
									item.isAssigned = false;
									item.isAutoApproved = false;
								}
		
								for (var index = 0; index < previousSelectedData.length; index++) {
									var currentData = previousSelectedData[index];
									for (var i = 0; i < items.length; i++) {
										var item = items[i].data;
										if (currentData.value == item.value) {
											item.isAssigned = currentData.isAssigned;
											item.isAutoApproved = currentData.isAutoApproved;
										}
									}
								}
							}
						}
					}
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
				grid.loadGridData(strUrl, me.updateCheckboxSelection, grid, false);
			},
			loadFeaturs : function() {
					return lmsFeatureData;
			},
			getExportOptions : function() {
				var me = this;
				var data = me.loadFeaturs();
				var exportFeatures = [];
				
				Ext.each(data, function(item) {
					if(item.featureType === 'E') {
						var obj = {};
						if (item.profileFieldType != undefined) {
							obj.profileFieldType = item.profileFieldType;
						}
						if(Ext.isDefined(item.featureId)) {
							item.value = item.featureId;
						}
						if(Ext.isDefined(item.checked)) {
							item.isAssigned = item.checked;
						}
						if(Ext.isDefined(item.disabled)) {
							item.readOnly = item.disabled;
						}
						obj.xtype = 'checkbox';
						obj.boxLabel = '<span class="font_normal">' + item.name + '</span>';
						obj.featureId = item.value;
						obj.featureType = item.featureType;
						obj.featureSubsetCode = item.featureSubsetCode;
						obj.profileId = item.profileId;
						obj.columnWidth = 0.3333;
						if (!Ext.isEmpty(item.isAssigned) && item.isAssigned) {
							obj.checked = true;
							obj.defVal = true;
						}
						
						obj.readOnly = item.readOnly;
						if(item.readOnly == true){
							obj.readOnly = true;
						}
						fieldJson.push(obj);
						exportFeatures.push(obj);
					}
				});
				
				return exportFeatures;
			},
			getOptions : function() {
				var me = this;
				var data = me.loadFeaturs();
				var optionFeatures = [];
				
				Ext.each(data, function(item) {
					if(item.featureType === 'AO') {
						var obj = {};
						if (item.profileFieldType != undefined) {
							obj.profileFieldType = item.profileFieldType;
						}
						if(Ext.isDefined(item.featureId)) {
							item.value = item.featureId;
						}
						if(Ext.isDefined(item.checked)) {
							item.isAssigned = item.checked;
						}
						if(Ext.isDefined(item.disabled)) {
							item.readOnly = item.disabled;
						}
						obj.xtype = 'checkbox';
						obj.boxLabel = '<span class="font_normal">' + item.name + '</span>';
						obj.featureId = item.value;
						obj.featureType = item.featureType;
						obj.featureSubsetCode = item.featureSubsetCode;
						obj.profileId = item.profileId;
						obj.columnWidth = 0.3333;
						if (!Ext.isEmpty(item.isAssigned) && item.isAssigned) {
							obj.checked = true;
							obj.defVal = true;
						}
						
						obj.readOnly = item.readOnly;
						fieldJson.push(obj);
						optionFeatures.push(obj);
					}
				});
				
				return optionFeatures;
			}
		});