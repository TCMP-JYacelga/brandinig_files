var fieldJson = [];
Ext.define('GCP.view.PayFeaturePopup', {
	extend: 'Ext.window.Window',
	xtype: 'payFeaturePopup',
	cls : 'non-xn-popup',
	width : 735,
	minHeight : 156,
	maxHeight : 550,
	draggable : false,
	resizable : false,
	title: getLabel('payAdvanceOptions','Payment Advance Options'),
	requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
	layout: 'fit',
	overflowY : 'auto',
	//componentCls : 'ux_no-padding',
	config: {
		layout: 'fit',
		modal : true,
		draggable : false,
		closeAction : 'hide',
		autoScroll : true,
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
		},
		show : function() {
			//var passthroughOptions = Ext.getCmp('passthroughOptions');
			//passthroughOptions.show();
			//this.showCheckedSection();
			// this.render();
		}
	},
	loadFeatures : function() {
		return featureData1;
	},
	setDaysField : function(feature) {
		var panel = Ext.create('Ext.panel.Panel', {					
					columnWidth : 1,
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
		obj.width = 40;
		obj.value ='999';
		if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned) {
			obj.value=feature.featureValue;
		}
		
		if(feature.readOnly == true){
			obj.readOnly = true;
		}
		obj.maxLength = 3;
		obj.enforceMaxLength = true;
		panel.insert(0, {
					xtype : 'label',
					columnWidth : 0.20,
					text : getLabel('filterrs','Filter Restrictions'),
					cls : 'ux_font-size14-normal',
					padding : '5 2 0 0'
				});
		panel.insert(1, obj);
		panel.insert(2, {
					xtype : 'label',
					columnWidth : 0.27,
					cls : 'label-font-normal',
					text : getLabel('days','Days'),
					padding : '5 0 0 3'
				});
		return panel;
	},
	setPayType : function() {
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data, 'PO', '');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					if(feature.profileFieldType != undefined){
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = '<span class="label-font-normal">' + feature.name + '</span>';
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.readOnly =feature.readOnly;
					obj.sequenceNo = feature.sequenceNo;
					obj.updated = feature.updated;
					obj.value = feature.value;
					obj.isAssigned = feature.isAssigned;
					obj.columnWidth = 0.33;
					if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned) {
						obj.checked = true; obj.defVal = true;
					}
					if(feature.readOnly == true)
						obj.disabled = true;
					else
						obj.disabled = false;
					featureItems.push(obj);
					fieldJson.push(obj);
				});
		return featureItems;
	},
	setPayFileType : function() {
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data, 'F', '');
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
						obj.columnWidth = 0.24;
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
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data, 'E', '');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					if(feature.profileFieldType != undefined){
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = '<span class="label-font-normal">' + feature.name + '</span>';
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.readOnly =feature.readOnly;
					obj.sequenceNo = feature.sequenceNo;
					obj.updated = feature.updated;
					obj.value = feature.value;
					obj.isAssigned = feature.isAssigned;
					obj.columnWidth = 0.33;
					if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned) {
						obj.checked = true; obj.defVal = true;
					}
					
					if(feature.readOnly == true)
					obj.disabled = true;
					else
					obj.disabled = false;
					
					featureItems.push(obj);
					fieldJson.push(obj);
				});
		return featureItems;
	},
	setPayViewOptions : function() {
		var self = this;
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data, 'V', '');
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
					obj.columnWidth = 0.24;
					obj.id = obj.featureId;
					obj.isAssigned = feature.isAssigned;

					if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned) {
						obj.checked = true; obj.defVal = true;
					}
					
					if(feature.readOnly == true)
					obj.disabled = true;
					else
					obj.disabled = false;
			
					/*if (obj.featureId == 'ID' || obj.featureId == 'DGE') {
						obj.handler = function() {
							self.comboBoxHandler();
						}
					}*/
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
		obj.labelWidth = '45px';
		obj.fieldWidth = '20px';
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
		obj.value="W";
		obj.featureValue = feature.featureValue;
		if(feature.profileId != undefined && feature.featureValue !=null && feature.featureValue !='null'){
			obj.value = feature.featureValue;
		}
		return obj;
	},
	setPayOptions : function() {
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data, 'O', '');
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
					obj.columnWidth = 0.24;
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
		var data = this.loadFeatures();
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
	
	setTempParams: function() {
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data,'O','TPL');
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
	 setACHParams: function() {
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data,'O','TPL');
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
		var data = this.loadFeatures();
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
	 setTemplatesOptions: function() {
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data,'T','');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
			var obj = new Object();
			if(feature.profileFieldType != undefined){
				obj.profileFieldType = feature.profileFieldType;
			}
			obj.boxLabel = '<span class="label-font-normal">' + feature.name + '</span>';
			obj.featureId = feature.value;
			obj.value = feature.featureValue;
			if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned){
				obj.checked = true;
			}
			
			if(feature.readOnly == true)
			obj.disabled = true;
			else
			obj.disabled = false;
					
			obj.featureType = feature.featureType;
			obj.featureSubsetCode = feature.featureSubsetCode;
			obj.columnWidth= 0.33;
			featureItems.push(obj);fieldJson.push(obj);
		});
		return featureItems;
	},
	 setTemplatesApprovalOptions : function() {
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data, 'AT', 'TPL');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					if (feature.profileFieldType != undefined) {
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = '<span class="label-font-normal">' + feature.name + '</span>';
					obj.featureId = feature.value;
					obj.value = feature.featureValue;
					if (feature.isAssigned != undefined
							&& feature.isAssigned != null && feature.isAssigned) {
						obj.checked = true;
					}

					if (feature.readOnly == true)
						obj.disabled = true;
					else
						obj.disabled = false;

					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.columnWidth= 0.33;
					featureItems.push(obj);
					fieldJson.push(obj);
				});
		return featureItems;
	},
	setOptions: function() {
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data,'O','');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
			var obj = new Object();
			if(feature.profileFieldType != undefined){
				obj.profileFieldType = feature.profileFieldType;
			}
			obj.boxLabel = '<span class="label-font-normal">' + feature.name + '</span>';
			obj.featureId = feature.value;
			obj.value = feature.featureValue;
			if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned){
				obj.checked = true;
			}
			
			if(feature.readOnly == true)
			obj.disabled = true;
			else
			obj.disabled = false;
			
			obj.featureType = feature.featureType;
			obj.featureSubsetCode = feature.featureSubsetCode;
			obj.columnWidth= 0.33;
			featureItems.push(obj);fieldJson.push(obj);
		});
		return featureItems;
	},
	setFileOptions: function() {
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data,'F','');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
			var obj = new Object();
			if(feature.profileFieldType != undefined){
				obj.profileFieldType = feature.profileFieldType;
			}
			obj.boxLabel = '<span class="label-font-normal">' + feature.name + '</span>';
			obj.featureId = feature.value;
			obj.value = feature.featureValue;
			if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned){
				obj.checked = true;
			}
			
			if(feature.readOnly == true)
			obj.disabled = true;
			else
			obj.disabled = false;
			
			obj.featureType = feature.featureType;
			obj.featureSubsetCode = feature.featureSubsetCode;
			obj.columnWidth= 0.33;
			featureItems.push(obj);fieldJson.push(obj);
		});
		return featureItems;
	},
	setAOComboBox : function(feature){
		var panel = Ext.create('Ext.panel.Panel', {
			columnWidth:0.26,
			layout:'column'
		});
			var obj = new Object();
			if(feature.profileFieldType != undefined){
				obj.profileFieldType = feature.profileFieldType;
			}
			obj.xtype = 'combo';
			//obj.labelWidth='2px';
			obj.width = 150;
			//obj.fieldLabel = feature.name;
			obj.featureId = feature.value;
			obj.featureType = feature.featureType;
			obj.featureSubsetCode = feature.featureSubsetCode;
			//obj.columnWidth= 0.26;
			
			obj.id = obj.featureId;
			//obj.editable= false;
			//obj.disabled = true;
			obj.store = new Ext.data.Store({
					data: [
							{"featureId":"MC", "name":getLabel("makerChecker","Maker Checker")},
							{"featureId":"SV", "name":getLabel("svm","Signatory Verification")},
							{"featureId":"AV", "name":getLabel("avm","Authorization Verification")}
						  ],
						fields: ['featureId', 'name']
				});
			obj.displayField= 'name';
			obj.valueField= 'featureId';
			if(feature.isAssigned != undefined && feature.featureValue !=null && feature.featureValue !='null' && feature.isAssigned){
				obj.value = feature.featureValue;
			}
			panel.insert(0,obj);
		return panel;
	},
	setScreenOptions:function(){
		var self=this;
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data,'SO','');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
			var obj = new Object();
			if(feature.profileFieldType != undefined){
				obj.profileFieldType = feature.profileFieldType;
			}
			obj.boxLabel = '<span class="label-font-normal">' + feature.name + '</span>';
			obj.featureId = feature.value;
			obj.value = feature.featureValue;
			if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned){
				obj.checked = true;
			}
			
			if(feature.readOnly == true)
			obj.disabled = true;
			else
			obj.disabled = false;
			
			obj.featureType = feature.featureType;
			obj.featureSubsetCode = feature.featureSubsetCode;
			obj.columnWidth= 0.33;
			fieldJson.push(obj);
			if (obj.featureId == 'DRD') {
				//featureItems.push(self.setDaysField(feature));
			} else {
				featureItems.push(obj);
			}
		});
		return featureItems;
	},
	setScreenDays : function() {
		var self = this;
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data, 'SO', '');
		var screenDaysPanel = [];
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					obj.featureId = feature.value;
					if (obj.featureId == 'DRD') {
						screenDaysPanel.push(self.setDaysField(feature));
					}
				});
		return screenDaysPanel;
	},
	setPaymentPackages:function(){
		var me=this;
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data,'PP','');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
			var obj = new Object();
			if(feature.profileFieldType != undefined){
				obj.profileFieldType = feature.profileFieldType;
			}
			obj.boxLabel = feature.name;
			obj.featureId = feature.value;
			obj.value = feature.featureValue;
			if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned){
				obj.checked = true;
			}
			
			if(feature.readOnly == false)
			obj.disabled = true;
			else
			obj.disabled = false;
			
			/*if(obj.featureId == "CLONEPACKAGE")
			obj.disabled=true;*/
			
			obj.featureType = feature.featureType;
			obj.featureSubsetCode = feature.featureSubsetCode;
			obj.columnWidth= 0.24;
			obj.handler=function(checkBox, value) {
									me.fireEvent('pmtPkgCheckBoxClicked', checkBox,value);
								}
			featureItems.push(obj);fieldJson.push(obj);
		});
		return featureItems;
	},
	setPWDOptions:function(){
		var data = this.loadFeatures();
		var filteredData = this.filterFeatures(data,'PWD','');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
			var obj = new Object();
			if(feature.profileFieldType != undefined){
				obj.profileFieldType = feature.profileFieldType;
			}
			obj.boxLabel = feature.name;
			obj.featureId = feature.value;
			obj.value = feature.featureValue;
			if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned){
				obj.checked = true;
			}
			
			
			if(feature.readOnly == true)
			obj.disabled = true;
			else
			obj.disabled = false;
					
			/*if(obj.featureId =='EDITSTNDWORKFLOW' || obj.featureId =='NEWWORKFLOWDEF')
				obj.disabled=true;*/
			
			obj.featureType = feature.featureType;
			obj.featureSubsetCode = feature.featureSubsetCode;
			obj.columnWidth= 0.24;
			featureItems.push(obj);fieldJson.push(obj);
		});
		return featureItems;
	},
	filterFeatures : function(data, featureType, subsetCode) {
		var allFeatures = new Ext.util.MixedCollection();
		allFeatures.addAll(data);
		var featureFilter = new Ext.util.Filter({
					filterFn : function(item) {
						return  item.featureType == featureType;
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
							cls : 't7-grid',
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
								gridPageChange : thisClass.handleLoadGridData,
								gridSortChange : thisClass.handleLoadGridData,
								gridRowSelectionChange : function(grid, record,
										recordIndex, records, jsonData) {
								}
							}
						});
	
	    thisClass.items = [{
	    	xtype: 'container',
			items: [{
					xtype: 'panel',
					items: [{
								xtype : 'panel',
								cls : 'ft-padding-bottom',
								items : [{
									xtype: 'checkboxgroup',
									fieldLabel: getLabel('paymentType',
											'Payment Type'),
									labelSeparator : "",
									labelAlign : 'top',
									layout: 'column',
									width: '100%',
									labelCls : 'ux_font-size14',
									vertical: true,
									items: thisClass.setPayType()
								}]
					        }, {
								xtype : 'panel',
								cls : 'ft-padding-bottom',
								id : 'templatesSection',
								items : [{
									xtype : 'checkboxgroup',
									featureId : 2,
									fieldLabel : getLabel('templates', 'Templates'),
									labelAlign : 'top',
									width : '100%',
									layout : 'column',
									vertical : true,
									labelCls : 'ux_font-size14',
									items : thisClass.setTemplatesOptions()
								}]
							}, {
								xtype : 'panel',
								cls : 'ft-padding-bottom',
								id : 'templatesApprovalSection',
								items : [{
									xtype : 'checkboxgroup',
									featureId : 2,
									fieldLabel : getLabel('approvaltemplate',
											'Approval Required for Templates'),
									labelAlign : 'top',
									width : '100%',
									layout : 'column',
									vertical : true,
									labelCls : 'ux_font-size14',
									items : thisClass
											.setTemplatesApprovalOptions()
								}]
							}, {
								xtype : 'panel',
					        	cls : 'ft-padding-bottom',
					        	items : [{
									xtype: 'checkboxgroup',
									featureId: 2,
									fieldLabel: getLabel('fileOptions','File Options'),
									labelAlign : 'top',
									labelStyle : 'vertical-align: top !important;',
									layout:'column',
									width: '100%',
									labelCls : 'ux_font-size14',
									vertical: true,
									items: thisClass.setFileOptions()
					        	}]
					        },
					        {
					        	xtype : 'panel',
					        	cls : 'ft-padding-bottom',
					        	items : [{
									xtype: 'checkboxgroup',
									featureId: 2,
									fieldLabel: getLabel('options','Options'),
									labelAlign : 'top',
									layout:'column',
									width: '100%',
									labelCls : 'ux_font-size14',
									vertical: true,
									items: thisClass.setOptions()
					        	}]
					        },{
					        	xtype : 'panel',
					        	cls : 'ft-padding-bottom',
					        	items : [{
									xtype: 'checkboxgroup',
									featureId: 2,
									fieldLabel: getLabel('screenOptions','Screen Options'),
									labelAlign : 'top',
									width: '100%',
									labelCls : 'ux_font-size14',
									layout:'column',
									vertical: true,
									items: thisClass.setScreenOptions()
					        	}]
					        },
							/*{
								xtype: 'checkboxgroup',
								featureId: 2,
								fieldLabel: getLabel('view','View'),
								layout : 'column',								
								width: '100%',
								labelCls : 'ux_font-size14',
								vertical: true,
								items: thisClass.setPayViewOptions()
							},*/
					        {
					        	xtype : 'panel',
					        	cls : 'ft-padding-bottom',
					        	items : [{
									xtype: 'checkboxgroup',
									featureId: 2,
									fieldLabel: getLabel('export','Export'),
									labelAlign : 'top',
									layout : 'column',
									width: '100%',
									labelCls : 'ux_font-size14',
									vertical: true,
									items: thisClass.setPayExportOptions()
								}]
					        },{
							xtype : 'container',
							itemId : 'restrictionDays',
							cls : 'ft-padding-bottom',
							layout : {
								type : 'vbox'
							},
							items : thisClass.setScreenDays()
						}
							/*,{
									xtype: 'checkboxgroup',
									itemId:'paymentPackages',
									layout:'column',
									fieldLabel: getLabel('paymentPackages','Payment Methods'),
									width: '100%',
									labelCls : 'ux_font-size14',
									vertical: true,
									items: thisClass.setPaymentPackages()											
							},{
									xtype: 'checkboxgroup',
									itemId:'paymentWorkflowDefinition',
									layout:'column',
									fieldLabel: getLabel('paymentWorkflowDefinition','Payment Workflow Definition'),
									width: '100%',
									labelCls : 'ux_font-size14',
									vertical: true,
									items: thisClass.setPWDOptions()											
							}*/
					,{
			    	xtype: 'panel',
					//title: getLabel('privileges','Privileges'),
					//collapsible : true,
					cls : 'xn-ribbon ft-padding-bottom',
					//collapseFirst : true,
					items: [featureGrid]
					
			    }
			    
			    ]
			}]
		}];
	  
		if(pagemode == "VERIFY"){
			thisClass.bbar = ['->',{
				text :getLabel('btnClose','Close'),
				handler : function(btn, opts) {
					thisClass.close();
				}
			}];
		}
		else{
	  thisClass.bbar=[
			          { 
			        	  text: getLabel('cancel','Cancel'),
			        	  handler : function(btn,opts) {
			        		thisClass.close();
			        				}
			          },'->',
			          { 
			        	  text: getLabel('submit','Submit'),
			        	  handler : function(btn,opts) {
			        	  	thisClass.saveItems();
			        		thisClass.close();
			        				}
			          }
			        ];
		}
	    this.callParent(arguments);
		this.comboBoxHandler();
	    if(viewmode == 'VIEW'  || viewmode == "MODIFIEDVIEW" || pagemode == "VERIFY"){
			this.setOldNewValueClass();
		}
	
	},
	getColumns : function() {
				arrColsPref = [{
							"colId" : "name",
							"colDesc" : getLabel('lblType','Type')
						}];
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				if (!Ext.isEmpty(arrColsPref)) {
					for (var i = 0; i < arrColsPref.length; i++) {
						objCol = arrColsPref[i];
						cfgCol = {};
						cfgCol.colHeader = objCol.colDesc;
						cfgCol.colId = objCol.colId;
						cfgCol.width = 200;
						cfgCol.fnColumnRenderer = me.columnRenderer;
						arrCols.push(cfgCol);
					}
				}
				if(viewmode == 'VIEW'  || viewmode == "MODIFIEDVIEW" || pagemode == "VERIFY"){
					arrCols.push(me.createViewAssignedActionColumn());
					arrCols.push(me.createViewAutoApproveActionColumn());
				}else{
					arrCols.push(me.createAssignedActionColumn());
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
			
			createViewAssignedActionColumn : function() {
				var me = this;
				var objActionCol = {
					colType : 'action',
					colId : 'isAssigned',
					colHeader : getLabel('assign','Assign'),	
					width : 200,
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
					colHeader : getLabel('autoapprove','Auto Approve'),	
					width : 200,
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
			},	
			isSectionChecked : function(featureId) {

				//if (selectedEntryFeatures == undefined)
				//	return false;
				//var result = $.grep(selectedEntryFeatures, function(e) {
				//			return e == featureId;
				//		});
				//return (result.length > 0);
			},
			saveItems : function() {
				var me = this;
				var grid = me.down('grid[itemId=payFeatureViewGrid]');
				var records = null;
				if((!Ext.isEmpty(grid)) && grid!=null)
				records = grid.store.data;
				Ext.each(fieldJson, function(field, index) {
				var featureId = field.featureId;
				var element = me.down('checkboxfield[featureId=' + featureId + ']');
				if (element != null && element != undefined) {
					field.featureValue = element.getValue();
					field.isAssigned = element.getValue();
				} else {
						var element = me.down('textfield[featureId=' + featureId + ']');
						if (element != null && element != undefined) {
							field.featureValue = element.getValue();
							field.value=element.featureId;
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

				});
				if (!Ext.isEmpty(me.fnCallback) && typeof me.fnCallback == 'function') {
					me.fnCallback(records, fieldJson);
					me.close();
				}
			},
			handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this;
				var module = null;
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,
						sorter);
				if (undefined == me.module) {
					module = me.up('window[itemId="payFeaturePopup"]').module;
				} else {
					module = me.module;
				}
				strUrl = strUrl + '&id='+encodeURIComponent(parentkey);
				if (!Ext.isEmpty(me.profileId)) {
					var url = Ext.String.format(
							'&featureType={0}&module={1}&profileId={2}',
							me.featureType,module, me.profileId);
					strUrl = strUrl + url;
				} else {
					var url = Ext.String.format('&featureType={0}&module={1}',
							me.featureType, module);
					strUrl = strUrl + url;
				}
				if (me.isAllSelected == "Y") {
					strUrl = strUrl + '&isAllSelected=Y';
				}
				grid.loadGridData(strUrl, null,null,false);
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