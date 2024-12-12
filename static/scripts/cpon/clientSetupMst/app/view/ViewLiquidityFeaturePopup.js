Ext.define('GCP.view.ViewLiquidityFeaturePopup', {
			extend : 'Ext.window.Window',
			xtype : 'liquidityFeaturePopup',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
			width : 450,
			minHeight : 156,
			maxHeight : 550,
			cls : 'non-xn-popup',
			modal : true,
			draggable : false,
			resizable : false,
			closeAction : 'hide',
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

				liquidityListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							showPager : false,
							pageSize : 5,
							rowList : _AvailableGridSize,
							showAllRecords : true,
							xtype : 'liquidityFeatureView',
							itemId : 'liquidityFeatureViewId',
							stateful : false,
							showEmptyRow : false,
							showCheckBoxColumn : false,
							minHeight : 50,
							maxHeight : 400,
							scroll : 'vertical',
							cls : 't7-grid',
							columnModel : colModel,
							storeModel : {
								fields : ['name', 'isAssigned', 'value','featureValue',
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
						itemId : 'forecastexport_id',
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
							itemId : 'forecastexport_chkBox',
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
						itemId : 'forecastoptions_id',
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
							itemId : 'forecastexport_chkBox',
							width : '100%',
							labelCls : 'font_bold',
							padding : '0 0 0 0',
							layout : 'column',
							vertical : true,
							items : me.getOptions()
						}]
					
					}]
				},liquidityListView];
				this.bbar = ['->', {
							xtype : 'button',
							text : getLabel('btnClose', 'Close'),
							handler : function() {
								me.close();
							}
						}];
				this.callParent(arguments);
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
						fieldJson.push(obj);
						exportFeatures.push(obj);
					}
				});
				
				return exportFeatures;
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
				if(viewmode == 'VIEW'  || viewmode =="MODIFIEDVIEW" || pagemode == "VERIFY"){
					arrCols.push(me.createViewAssingedActionColumn());					
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
					align : 'center',
					items : [{
						itemId : 'isAssigned',
						fnIconRenderer : function(value, metaData, record,
								rowIndex, colIndex, store, view) {
							if (!record.get('isEmpty')) {
								if (record.data.isAssigned === true || record.data.featureValue == 1) {
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