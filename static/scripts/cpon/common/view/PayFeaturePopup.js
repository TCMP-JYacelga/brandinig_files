var fieldJson = [];
Ext.define('GCP.view.PayFeaturePopup', {
	extend: 'Ext.window.Window',
	xtype: 'payFeaturePopup',
	width : 1000,
	height : 600,
	title: getLabel('paymentfeatures','Payment Features'),
	requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
	layout: 'fit',
	overflowY : 'auto',
	config: {
		layout: 'fit',
		modal : true,
		draggable : false,
		autoScroll : true,
		fnCallback : null,
		profileId : null,
		featureType : null,
		module : null,
		title : null,
		isAllSelected : null
	},
	listeners : {

		show : function() {
			var passthroughOptions = Ext.getCmp('passthroughOptions');
			passthroughOptions.show();
			this.showCheckedSection();
			// this.render();
		}
	},
	loadFeaturs : function() {
		return featureData1;
	},
	setPayFilterRestriction :function(){
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data, 'FR', 'PAYPRM');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					if(feature.profileFieldType != undefined){
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.readOnly =feature.readOnly;
					obj.sequenceNo = feature.sequenceNo;
					obj.updated = feature.updated;
					obj.isAssigned = feature.isAssigned;
					obj.columnWidth = 0.33;
					fieldJson.push(obj);
					if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned){
						obj.checked = true;
					}
					if(feature.readOnly == true){
						obj.readOnly = true;
					}
					if (obj.featureId == 'DAT') {
						featureItems.push(self.setDaysField(feature));
					} else {
						featureItems.push(obj);
					}
				});
		return featureItems;
	},
	setDaysField : function(feature) {

		var panel = Ext.create('Ext.panel.Panel', {
					columnWidth : 0.33,
					layout : 'column'
				});
		var obj = new Object();
		if(feature.profileFieldType != undefined){
			obj.profileFieldType = feature.profileFieldType;
		}
		obj.xtype = 'textfield';
		obj.featureId = feature.value;
		obj.featureType = feature.featureType;
		obj.featureSubsetCode = feature.featureSubsetCode;
		obj.readOnly =feature.readOnly;
		obj.sequenceNo = feature.sequenceNo;
		obj.updated = feature.updated;
		obj.profileId = feature.profileId;
		obj.columnWidth = 0.2;
		obj.value='0';
		if (feature.profileId != undefined && feature.profileId != null) {
			obj.value = feature.featureValue;
		}
		if(feature.readOnly == true){
			obj.readOnly = true;
		}
		obj.maxLength = 3;
		obj.enforceMaxLength = true;
		panel.insert(0, {
					xtype : 'label',
					columnWidth : 0.34,
					text :getLabel('filterrs','Filter Restrictions'),
					padding : '5 0 0 0'
				});
		panel.insert(1, obj);
		panel.insert(2, {
					xtype : 'label',
					columnWidth : 0.27,
					text : getLabel('days','Days'),
					padding : '5 0 0 3'
				});
		return panel;
	},
	setPayType : function() {
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data, 'PO', 'PAYPRM');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					if(feature.profileFieldType != undefined){
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.readOnly =feature.readOnly;
					obj.sequenceNo = feature.sequenceNo;
					obj.updated = feature.updated;
					obj.value = feature.value;
					obj.isAssigned = feature.isAssigned;
					obj.columnWidth = 0.18;
					if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned) {
						obj.checked = true; obj.defVal = true;
					}
					if(feature.readOnly == true){
						obj.readOnly = true;
					}
					featureItems.push(obj);
					fieldJson.push(obj);
				});
		return featureItems;
	},
	setPayFileType : function() {
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data, 'F', 'PAYPRM');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					if(feature.profileFieldType != undefined){
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.readOnly =feature.readOnly;
					obj.sequenceNo = feature.sequenceNo;
					obj.updated = feature.updated;
					obj.value = feature.value;
					obj.isAssigned = feature.isAssigned;
					if(feature.value === 'TEMPLTAUTH')
						obj.columnWidth = 0.30;
					else	
						obj.columnWidth = 0.18;
					if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned) {
						obj.checked = true; obj.defVal = true;
					}
					if(feature.readOnly == true){
						obj.readOnly = true;
					}
					featureItems.push(obj);
					fieldJson.push(obj);
				});
		return featureItems;
	},
	setPayExportOptions : function() {
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data, 'E', 'PAYPRM');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					if(feature.profileFieldType != undefined){
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.readOnly =feature.readOnly;
					obj.sequenceNo = feature.sequenceNo;
					obj.updated = feature.updated;
					obj.value = feature.value;
					obj.isAssigned = feature.isAssigned;
					obj.columnWidth = 0.18;
					if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned) {
						obj.checked = true; obj.defVal = true;
					}
					if(feature.readOnly == true){
						obj.readOnly = true;
					}
					featureItems.push(obj);
					fieldJson.push(obj);
				});
		return featureItems;
	},
	setPayViewOptions : function() {
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data, 'V', 'PAYPRM');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					if(feature.profileFieldType != undefined){
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.readOnly =feature.readOnly;
					obj.sequenceNo = feature.sequenceNo;
					obj.updated = feature.updated;
					obj.value = feature.value;
					obj.columnWidth = 0.18;
					obj.id = obj.featureId;
					obj.isAssigned = feature.isAssigned;

					if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned) {
						obj.checked = true; obj.defVal = true;
					}
					if(feature.readOnly == true){
						obj.readOnly = true;
					}
					if (obj.featureId == 'ID') {
						obj.handler = function() {
							self.comboBoxHandler();
						}
					}
					featureItems.push(obj);
					/*if (obj.featureId == 'DFUL')
						featureItems.push(self.setBRViewComboBox(feature));
					else
						featureItems.push(obj);*/
					fieldJson.push(obj);
				});
		return featureItems;
	},
	comboBoxHandler : function() {
		var GRIV = Ext.getCmp('ID');
		var WIDV = Ext.getCmp('DGE');
		var element = Ext.getCmp('DFUL');
		if (element) {
			if (WIDV.getValue() && GRIV.getValue()) {
				element.setDisabled(false);
			} else {
				element.setDisabled(true);
			}
		}
	},
	setBRViewComboBox : function(feature) {
		var obj = new Object();
		if(feature.profileFieldType != undefined){
			obj.profileFieldType = feature.profileFieldType;
		}
		obj.xtype = 'combo';
		obj.labelWidth = '2px';
		obj.fieldWidth = '2px';
		obj.fieldLabel = feature.name;
		obj.featureId = feature.value;
		obj.featureType = feature.featureType;
		obj.featureSubsetCode = feature.featureSubsetCode;
		obj.readOnly =feature.readOnly;
		obj.sequenceNo = feature.sequenceNo;
		obj.updated = feature.updated;
		obj.columnWidth = 0.18;
		if(feature.readOnly == true){
			obj.readOnly = true;
		}
		obj.id = obj.featureId;
		obj.editable = false;
		obj.disabled = true;
		obj.store = Ext.create('Ext.data.Store', {
					data : [{
								"featureId" : "W",
								"name" : "Widget"
							}, {
								"featureId" : "G",
								"name" : "Grid"
							}],
					fields : ['featureId', 'name']
				});
		obj.displayField = 'name';
		obj.valueField = 'featureId';
		obj.featureValue = feature.featureValue;
		if(feature.profileId != undefined && feature.featureValue !=null && feature.featureValue !='null'){
			obj.value = feature.featureValue;
		}
		return obj;
	},
	setPayOptions : function() {
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data, 'O', 'PAYPRM');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					if(feature.profileFieldType != undefined){
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.readOnly =feature.readOnly;
					obj.sequenceNo = feature.sequenceNo;
					obj.updated = feature.updated;
					obj.value = feature.value;
					obj.columnWidth = 0.18;
					obj.isAssigned = feature.isAssigned;
					if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned) {
						obj.checked = true; obj.defVal = true;
					}
					if(feature.readOnly == true){
						obj.readOnly = true;
					}
					featureItems.push(obj);
					fieldJson.push(obj);
				});
		return featureItems;
	},
	setPassthroughOptions: function() {
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'O','PASSPRM');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
			if(feature.sequenceNo==1)
			{			
				var obj = new Object();
				if(feature.profileFieldType != undefined){
					obj.profileFieldType = feature.profileFieldType;
				}
				obj.boxLabel = feature.name;
				obj.featureId = feature.value;
				obj.value = feature.featureValue;
				obj.readOnly =feature.readOnly;
				obj.sequenceNo = feature.sequenceNo;
				obj.updated = feature.updated;
				obj.value = feature.value;
				obj.profileId = feature.profileId;	
				if(feature.profileId != undefined && feature.profileId !=null)
				{
					obj.checked = true;
				}
				if(feature.readOnly == true){
					obj.readOnly = true;
				}				
				obj.featureType = feature.featureType;
				obj.featureSubsetCode = feature.featureSubsetCode;
				obj.columnWidth= 0.50;
				featureItems.push(obj);
				fieldJson.push(obj);
			}
		});
		return featureItems;		
	 },	 
	 
	setLimits: function() {
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'O','PASSPRM');
		var featureItems = [];
		var count = 0;
		Ext.each(filteredData, function(feature, index) {
			if(feature.sequenceNo!=1)
			{
				var obj = new Object();
				if(feature.profileFieldType != undefined){
					obj.profileFieldType = feature.profileFieldType;
				}
				obj.xtype = 'textfield';		
				obj.fieldLabel = feature.name;
				obj.labelAlign = 'top';
				obj.defaultAlign = 'right';
				obj.width = 50;
				obj.featureId = feature.value;
				obj.isAssigned = feature.isAssigned;
				obj.profileId = feature.profileId;	
				if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned){
					obj.value = feature.featureValue;
				}
				if(feature.readOnly == true){
					obj.readOnly = true;
				}
				count++;
				if(count % 3 === 0)
					obj.cls = 'clearLeft';	
				obj.featureType = feature.featureType;
				obj.featureSubsetCode = feature.featureSubsetCode;
				obj.readOnly =feature.readOnly;
				obj.sequenceNo = feature.sequenceNo;
				obj.updated = feature.updated;
				obj.columnWidth= 0.25;
				obj.margin = '0 15 0 0 ';
				obj.maxLength = 20;
				obj.enforceMaxLength = true;			
				featureItems.push(obj);
				fieldJson.push(obj);
			}
		});
		return featureItems;		
	 },
	filterFeatures : function(data, featureType, subsetCode) {

		var allFeatures = new Ext.util.MixedCollection();
		allFeatures.addAll(data);
		var featureFilter = new Ext.util.Filter({
					filterFn : function(item) {
						return item.featureSubsetCode == subsetCode
								&& item.featureType == featureType;
					}
				});
		var featurs = allFeatures.filter(featureFilter);
		return featurs.items;
	},	
	filterFeature : function(data, featureId) {
		var allFeatures = new Ext.util.MixedCollection();
		allFeatures.addAll(data);
		var featureFilter = new Ext.util.Filter({
					filterFn : function(item) {
						return item.value == featureId;
					}
				});
		var featurs = allFeatures.filter(featureFilter);
		return featurs.items;
	},
	initComponent: function() {
	    var thisClass = this;
		var strUrl = 'cpon/clientServiceSetup/cponPermissionFeatures';
		var colModel = thisClass.getColumns();
		
		featureGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
							xtype : 'payFeatureViewGrid',
							itemId : 'payFeatureViewGrid',
							showPager : false,
							showAllRecords : true,
							stateful : false,
							showEmptyRow : false,
							showCheckBoxColumn : false,
							padding : '5 0 0 0',
							minHeight : 10,
							autoWidth: true,
							
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
									thisClass.handleLoadGridData(grid,
											grid.store.dataUrl, grid.pageSize,
											1, 1, null);
								},
								gridPageChange : thisClass.handleLoadGridDataForSort,
								gridSortChange : thisClass.handleLoadGridDataForSort,
								gridRowSelectionChange : function(grid, record,
										recordIndex, records, jsonData) {
								}
							}
						});
	
	    thisClass.items = [{
	    	xtype: 'container',
			items: [{
					xtype: 'panel',
					title: getLabel('summary','Summary'),
					collapsible : true,
					cls : 'xn-ribbon',
					collapseFirst : true,
					items: [{
								xtype: 'checkboxgroup',
								fieldLabel: " ",
								labelSeparator : "",
								layout: 'column',
								width: '100%',
								padding: '0 0 0 10',
								vertical: true,
								items: thisClass.setPayType()
							},{
								xtype: 'checkboxgroup',
								fieldLabel:" ",
								labelSeparator : "",
								width: '100%',
								layout : 'column',
								padding: '0 0 0 10',
								vertical: true,
								items: thisClass.setPayFileType()
							},{
								xtype : 'container',
								featureId : 2,
								layout : 'column',
								width : '100%',
								padding : '0 0 0 10',
								vertical : true,
								items : thisClass.setPayFilterRestriction()
							},{
								xtype: 'checkboxgroup',
								fieldLabel: getLabel('options','Options'),
								layout : 'column',
								width: '100%',
								padding: '0 0 0 10',
								vertical: true,
								items: thisClass.setPayOptions()
							}, {
								xtype: 'checkboxgroup',
								featureId: 2,
								fieldLabel: getLabel('export','Export'),
								layout : 'column',
								width: '100%',
								padding: '0 0 0 10',
								vertical: true,
								items: thisClass.setPayExportOptions()
							}, {
								xtype: 'checkboxgroup',
								featureId: 2,
								fieldLabel: getLabel('view','View'),
								layout : 'column',								
								width: '100%',
								padding: '0 0 0 10',
								vertical: true,
								items: thisClass.setPayViewOptions()
							}
					] },{
							xtype: 'panel',
							collapsible : true,
							cls : 'xn-ribbon',
							id : 'passthroughOptions',
							title: getLabel('passthroughParam','PassThrough Parameters'),
								items: [{
											xtype: 'checkboxgroup',
											itemId : 'passthroughOptions',
											width: '100%',
											padding: '0 0 0 10',
											vertical: true,
											layout:'column',
											items: thisClass.setPassthroughOptions()
										},
										{
											xtype: 'checkboxgroup',
											layout:'column',
											width: '100%',
											padding: '0 0 0 10',
											vertical: true,
											items: thisClass.setLimits()											
										}
								]
					},{
			    	xtype: 'panel',
					title: getLabel('privileges','Privileges'),
					collapsible : true,
					cls : 'xn-ribbon',
					collapseFirst : true,
					items: [featureGrid]
					
			    }]
	    }];
	  
	  thisClass.buttons=[
			          { 
			        	  text: getLabel('submit','Submit'),
			        	  cls : 'xn-button',
			        	  handler : function(btn,opts) {
			        	  	thisClass.saveItems();
			        		thisClass.close();
			        				}
			          },
			          { 
			        	  text: getLabel('cancel','Cancel'),
			        	  cls : 'xn-button',
			        	  handler : function(btn,opts) {
			        		thisClass.close();
			        				}
			          }
			        ];
	    this.callParent(arguments);
		this.comboBoxHandler();
	    if(viewmode == 'VIEW'  || viewmode == "MODIFIEDVIEW" || pagemode == "VERIFY"){
			this.setOldNewValueClass();
		}
	
	},
	getColumns : function() {
				arrColsPref = [{
							"colId" : "name",
							"colDesc" : 'Type'
						}];
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				if (!Ext.isEmpty(arrColsPref)) {
					for (var i = 0; i < arrColsPref.length; i++) {
						objCol = arrColsPref[i];
						cfgCol = {};
						cfgCol.colHeader = objCol.colDesc;
						cfgCol.colId = objCol.colId;
						cfgCol.width = 270;
						cfgCol.fnColumnRenderer = me.columnRenderer;
						arrCols.push(cfgCol);
					}
				}
				if(viewmode == 'VIEW'  || viewmode == "MODIFIEDVIEW" || pagemode == "VERIFY"){
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
					colHeader : 'Assign',	
					width : 270,
					align: 'center',
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
					colHeader : 'Auto Approve',	
					width : 270,
					align: 'center',
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
			setOldNewValueClass : function(){
				var me = this;
				Ext.each(fieldJson, function(field, index) {
					var featureId = field.featureId;
								var element = me.down('checkboxfield[featureId='+featureId+']');
								
									if(element != null && element != undefined){
										element.setReadOnly(true);
										if(viewmode == 'MODIFIEDVIEW'){
											element.boxLabelCls = me.getOldNewValueClass(field)+ " "+element.boxLabelCls;
										}
								}
								else {
									
										var element = me.down('textareafield[featureId='+featureId+']');
										if(element != null && element != undefined){
											element.setReadOnly(true);
											if(viewmode == 'MODIFIEDVIEW'){
												element.fieldCls = me.getOldNewValueClass(field);
											}
										}
										else{
										
										   var element = me.down('textfield[featureId='+featureId+']');
											if(element != null && element != undefined){
												element.setReadOnly(true);
												if(viewmode == 'MODIFIEDVIEW'){
													element.fieldCls = me.getOldNewValueClass(field);
												}
											}
										}
								}
				});
			},
			getOldNewValueClass : function(feature){
				
				if(feature.profileFieldType == 'MODIFIED')
					return "modifiedFieldValue ";
				else if(feature.profileFieldType == 'NEW')
					return "newFieldValue ";
				else if(feature.profileFieldType == 'DELETED')
					return "deletedFieldValue "; 
			},
			showCheckedSection : function() {
				if (!this.isSectionChecked("PSS")) {
					var passthroughOptions = Ext.getCmp('passthroughOptions');
					passthroughOptions.hide();
				}
			},	
			isSectionChecked : function(featureId) {

				if (selectedPayEntryFeatures == undefined)
					return false;
				var result = $.grep(selectedPayEntryFeatures, function(e) {
							return e == featureId;
						});
				return (result.length > 0);
			},
			saveItems : function() {
				var me = this;
				var grid = me.down('grid[itemId=payFeatureViewGrid]');
				var records = grid.store.data;
				Ext.each(fieldJson, function(field, index) {
				var featureId = field.featureId;
				var element = me.down('checkboxfield[featureId=' + featureId + ']');
				if (element != null && element != undefined) {
					field.featureValue = element.getValue();
					field.isAssigned = element.getValue();
				}  else {
						var element = me.down('textfield[featureId=' + featureId + ']');
						if (element != null && element != undefined) {
							field.featureValue = element.getValue();
							field.isAssigned = true;
						} else {
							var element = me.down('textareafield[featureId='
							+ featureId + ']');
							if (element != null && element != undefined) {
								field.featureValue = element.getValue();
								//field.profileId = element.getValue();	
							}	
						}

					}
					if (!me.isSectionChecked("PSS")) {
						var passthroughOptions = Ext.getCmp('passthroughOptions');
						passthroughOptions.hide();
					}

				});

				if (!Ext.isEmpty(me.fnCallback) && typeof me.fnCallback == 'function') {
					me.fnCallback(records, fieldJson);
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
				grid.loadGridData(strUrl, null);
			},
			handleLoadGridDataForSort : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this.up('payFeaturePopup');
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
				grid.loadGridData(strUrl, null);
			}
	
});