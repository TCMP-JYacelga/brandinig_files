var fieldJson = [];
Ext.define('GCP.view.BRFeaturePopup', {
	extend : 'Ext.window.Window',
	xtype : 'brFeaturePopup',
	cls : 'non-xn-popup',
	width : 735,
	minHeight : 156,
	maxHeight : 550,
	resizable : false,
	title : getLabel('brAdvanceOptions', 'BR Advance Options'),
	componentCls : 'ux_no-padding',
	layout : 'fit',
	overflowY : 'auto',
	
	config : {
		layout : 'fit',
		modal : true,
		draggable : false,
		closeAction : 'hide',
		autoScroll : true,
		fnCallback : null,
		profileId : null,
		featureType : null,
		module : null,
		title : null
	},
	listeners : {
		resize : function(){
			this.center();
		},
		show : function() {
			//this.showCheckedSection();
			// this.render();
		}
	},
	loadFeaturs : function() {
		return featureData;
	},
	setTransactionParameters :function(){
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
					obj.columnWidth = 0.33;
					if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned) {
						obj.checked = true; 
						obj.defVal = true;
					}
					if(feature.readOnly == true){
						obj.readOnly = true;
					}
					featureItems.push(obj);
					fieldJson.push(obj);
				});
		return featureItems;
	},
	setVIFilterRestriction :function(){
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data, 'FR', 'DEPVW');
		var featureItems = [];
		var count = 0;
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					if(feature.profileFieldType != undefined){
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.columnWidth = 0.33;
					count++;
					if(feature.readOnly == true){
						obj.readOnly = true;
					}
					if (count % 3 == 1) {
						obj.cls = 'clearLeft';
					}
					// obj.fieldStyle = 'height:25px !important';
					fieldJson.push(obj);
					if (obj.featureId == 'DRTW') {
						featureItems.push(self.setDaysField(feature));
					} else {
						featureItems.push(obj);
					}
				});
		return featureItems;
	},
	setIPFilterRestriction :function(){
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data, 'FR', 'INVESTPRM');
		var featureItems = [];
		var count = 0;
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					if(feature.profileFieldType != undefined){
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.columnWidth = 0.33;
					count++;
					if(feature.readOnly == true){
						obj.readOnly = true;
					}
					if (count % 3 == 1) {
						obj.cls = 'clearLeft';
					}
					// obj.fieldStyle = 'height:25px !important';
					fieldJson.push(obj);
					if (obj.featureId == 'DRN') {
						featureItems.push(self.setDaysField(feature));
					} else {
						featureItems.push(obj);
					}
				});
		return featureItems;
	},
	setPOFilterRestriction :function(){
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data, 'FR', 'LOANPRM');
		var featureItems = [];
		var count = 0;
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					if(feature.profileFieldType != undefined){
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.columnWidth = 0.33;
					count++;
					if(feature.readOnly == true){
						obj.readOnly = true;
					}
					if (count % 3 == 1) {
						obj.cls = 'clearLeft';
					}
					// obj.fieldStyle = 'height:25px !important';
					fieldJson.push(obj);
					if (obj.featureId == 'DRTV') {
						featureItems.push(self.setDaysField(feature));
					} else {
						featureItems.push(obj);
					}
				});
		return featureItems;
	},
	setBRFilterRestriction :function(){
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data, 'FR', 'BRPRM');
		var featureItems = [];
		var count = 0;
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					if(feature.profileFieldType != undefined){
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.columnWidth = 0.33;
					count++;
					if(feature.readOnly == true){
						obj.readOnly = true;
					}
					if (count % 3 == 1) {
						obj.cls = 'clearLeft';
					}
					// obj.fieldStyle = 'height:25px !important';
					fieldJson.push(obj);
					if (obj.featureId == 'DRV') {
						featureItems.push(self.setDaysField(feature));
					} else {
						featureItems.push(obj);
					}
				});
		return featureItems;
	},
	setDaysField : function(feature) {

		var panel = Ext.create('Ext.panel.Panel', {
					columnWidth : 1,
					//cls : 'ux_extralargepaddingtb',
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
		obj.width=40;
		obj.margin = '0 5 0 5',
		obj.value ='0';
		if (feature.profileId != undefined && feature.profileId != null) {
			obj.value = feature.featureValue;
		}
		if(feature.readOnly == true){
						obj.readOnly = true;
					}
		
		panel.insert(0, {
					xtype : 'label',
					cls : 'ux_font-size14',
					columnWidth : 0.16,
					text : getLabel('filterrs','Data Restrictions'),
					padding : '5 0 0 0'
				});
		panel.insert(1, obj);
		panel.insert(2, {
					xtype : 'label',
					columnWidth : 0.27,
					cls : 'ux_font-size14-normal label-font-normal',
					padding : '5 0 0 3',
					text : getLabel('days','Days')
				});
		return panel;
	},
	setBRFilterOptions : function() {
		var data = this.loadFeaturs();
		//var filteredData = this.filterFeatures(data, 'O', 'BRPRM');
		var filteredData = this.getBRPopupFeatures(data, 'OPTION');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					if(feature.profileFieldType != undefined){
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = '<span class="label-font-normal">' + feature.name + '</span>';
					obj.featureId = feature.value;
					obj.value = feature.featureValue;
					if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned) {
						obj.checked = true; obj.defVal = true;
					}
					if(feature.readOnly == true){
						obj.readOnly = true;
					}
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.columnWidth = 0.33;
					featureItems.push(obj);
					fieldJson.push(obj);
				});
		return featureItems;
	},
	setBRExportOptions : function() {
		var data = this.loadFeaturs();
		//var filteredData = this.filterFeatures(data, 'E', 'BRPRM');
		var filteredData = this.getBRPopupFeatures(data, 'E');
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
					obj.columnWidth = 0.33;
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
	setBRPaymentOptions : function() {
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data, 'PO', 'BRPRM');
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
					obj.columnWidth = 0.33;
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
	setBROtherOptions : function() {
		var data = this.loadFeaturs();
		//var filteredData = this.filterFeatures(data, 'OTH', 'BRPRM');
		var filteredData = this.getBRPopupFeatures(data, 'SA');
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
					obj.columnWidth = 0.33;
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
		obj.cls='ux_trigger-height';
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
		if(feature.profileId != undefined && feature.featureValue !=null && feature.featureValue !='null'){
			obj.value = feature.featureValue;
		}
		return obj;
	},
	setBRViewOptions : function() {
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data, 'V', 'BRPRM');
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
					obj.columnWidth = 0.33;
					obj.id = obj.featureId;
					if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned) {
						obj.checked = true; obj.defVal = true;
					}
					if(feature.readOnly == true){
						obj.readOnly = true;
					}
					if (obj.featureId == 'GR' || obj.featureId == 'WGT') {
						obj.handler = function() {
							self.comboBoxHandler();
						}
					}
					featureItems.push(obj);
					/*if (obj.featureId == 'DFL')
						featureItems.push(self.setBRViewComboBox(feature));
					else
						featureItems.push(obj);*/
					fieldJson.push(obj);
				});
		return featureItems;
	},
	getBRPopupFeatures : function(data,featureType) {
		var allFeatures = new Ext.util.MixedCollection();
		allFeatures.addAll(data);
		var featureFilter = new Ext.util.Filter({
					filterFn : function(item) {
						return item.featureType == featureType;
					}
				});
		var featurs = allFeatures.filter(featureFilter);
		return featurs.items;
	},
	comboBoxHandler : function() {
		var BRGRIV = Ext.getCmp('GR');
		var BRWIDV = Ext.getCmp('WGT');
		var element = Ext.getCmp('DFL');
		if (element) {
			if (BRWIDV.getValue() && BRGRIV.getValue()) {
				element.setDisabled(false);
			} else {
				element.setDisabled(true);
			}
		}
	},
	setLOANPaymentOptions : function() {
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data, 'PO', 'LOANPRM');
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
					obj.columnWidth = 0.33;
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
	setMaxTextField : function(feature) {

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
		obj.columnWidth = 0.2;
		if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned) {
			obj.value = feature.featureValue;
		}
		if(feature.readOnly == true){
						obj.readOnly = true;
					}
		panel.insert(0, {
					xtype : 'label',
					columnWidth : 0.3,
					text : getLabel('maxdays','Max Days'),
					padding : '5 0 0 0'
				});
		panel.insert(1, obj);
		return panel;
	},
	setLOANOptions : function() {
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data, 'O', 'LOANPRM');
		var featureItems = [];
		var count = 0;
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					if(feature.profileFieldType != undefined){
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.columnWidth = 0.33;
					if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned) {
						obj.checked = true; obj.defVal = true;
					}
					if(feature.readOnly == true){
						obj.readOnly = true;
					}
					count++;
					if (count % 3 == 1) {
						obj.cls = 'clearLeft';
					}
					// obj.fieldStyle = 'height:25px !important';
					fieldJson.push(obj);
					if (obj.featureId == 'MFD' || obj.featureId == 'MBD') {
						featureItems.push(self.setMaxTextField(feature));
					} else {
						featureItems.push(obj);
					}
				});
		return featureItems;
	},
	setInvestInvstOption : function() {
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data, 'PO', 'INVESTPRM');
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
					obj.columnWidth = 0.33;
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
	setInvestOption : function() {
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data, 'O', 'INVESTPRM');
		var featureItems = [];
		var count = 0;
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					if(feature.profileFieldType != undefined){
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.columnWidth = 0.33;
					if (feature.profileId != undefined
							&& feature.profileId != null) {
						obj.checked = true; obj.defVal = true;
					}
					if(feature.readOnly == true){
						obj.readOnly = true;
					}
					count++;
					if (count % 3 == 1) {
						obj.cls = 'clearLeft';
					}
					// obj.fieldStyle = 'height:25px !important';
					fieldJson.push(obj);
					featureItems.push(obj);
					/*if (obj.featureId == 'MFDY') {
						featureItems.push(self.setMaxTextField(feature));
					} else {
						featureItems.push(obj);
					}*/
				});
		return featureItems;
	},
	setInvestDisclaimer : function() {
		var data = this.loadFeaturs();
		var self = this;
		var filteredData = this.filterFeatures(data, 'ID', 'INVESTPRM');
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
					obj.columnWidth = 0.20;
					obj.id = feature.value;
					obj.name = 'investDisclaim';
					if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned) {
						obj.checked = true; obj.defVal = true;
						if (obj.featureId == 'ITXTDISCLM') {
							obj.value = feature.featureValue;
						}
					}
					if(feature.readOnly == true){
						obj.readOnly = true;
					}
					fieldJson.push(obj);
					if (obj.featureId != 'ITXTDISCLM') {
						featureItems.push(obj);
					}

				});
		return featureItems;
	},
	setDepositViewImages : function() {
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data, 'V', 'DEPVW');
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
					obj.columnWidth = 0.33;
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
	initComponent : function() {
		var thisClass = this;
		thisClass.items = [{
			xtype : 'container',
			items : [{
				xtype : 'panel',
				id : 'brParametersSection',
				items : [{
							xtype : 'panel',
							cls : 'ft-padding-bottom',
							items : [{
								xtype : 'checkboxgroup',
								itemId : 'BRFilterOptions',
								//fieldLabel : getLabel('filterby', 'Filter By'),
								labelAlign : 'top',
								fieldLabel : getLabel('serviceaddons', 'Service Add-Ons'),
								width : '100%',
								labelCls : 'ux_font-size14',
								vertical : true,
								layout : 'column',
								//items : thisClass.setBRFilterOptions()
								items : thisClass.setBROtherOptions()
							}]
				         },
				         {
				        	xtype : 'panel',
							cls : 'ft-padding-bottom',
							items : [{ 
							xtype : 'checkboxgroup',
							featureId : 2,
							fieldLabel : getLabel('export', 'Export'),
							labelAlign : 'top',
							width : '100%',
							labelCls : 'ux_font-size14',
							layout : 'column',
							vertical : true,
							items : thisClass.setBRExportOptions()
							}]
				         },
				         {
				        	xtype : 'panel',
				        	cls : 'ft-padding-bottom',
				        	items : [{
							xtype : 'checkboxgroup',
							featureId : 2,
							//fieldLabel : getLabel('addons', 'Add-Ons'),
							fieldLabel : getLabel('options', 'Options'),
							labelAlign : 'top',
							layout : 'column',
							width : '100%',
							labelCls : 'ux_font-size14',
							vertical : true,
							//items : thisClass.setBROtherOptions()
							items : thisClass.setBRFilterOptions()
								}]
				         }, {
							xtype : 'container',
							featureId : 2,
							layout : 'column',
							width : '100%',
							labelCls : 'ux_font-size14',
							vertical : true,
							items : thisClass.setBRFilterRestriction()
						}
						/*, {
							xtype : 'checkboxgroup',
							featureId : 2,
							fieldLabel : getLabel('view', 'View'),
							layout : 'column',
							labelCls : 'ux_font-size14',
							width : '100%',
							vertical : true,
							items : thisClass.setBRViewOptions()
						}*/

				]
			}]
		}

		];

		if(pagemode == "VERIFY"){
			thisClass.bbar = ['->',{
				text :getLabel('btnClose','Close'),
				handler : function(btn, opts) {
					thisClass.close();
				}
			}];
		}
		else{	
		thisClass.bbar = [{
					text :getLabel('cancel','Cancel'),
					handler : function(btn, opts) {
						thisClass.close();
					}
				},'->',{
					text : getLabel('submit','Submit'),
					//hidden : (pagemode == "VERIFY") ? true : false,
					handler : function(btn, opts) {
						thisClass.saveItems();
						thisClass.close();
					}
				}];
		}
		this.callParent(arguments);
		// this.showCheckedSection();
		this.comboBoxHandler();
		if(viewmode == 'VIEW'  || viewmode == "MODIFIEDVIEW" || pagemode == "VERIFY"){
			this.setOldNewValueClass();
		}

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
						else if(featureId == 'DFL'){
							var element = me.down('combo[featureId='+featureId+']');
							element.setDisabled(true);
							if(viewmode == 'MODIFIEDVIEW'){
									element.labelCls = me.getOldNewValueClass(field)+ " "+element.labelCls;
									element.fieldCls = me.getOldNewValueClass(field);
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
	disabledAllElement : function() {
		var me = this;
		Ext.each(fieldJson, function(field, index) {
			var featureId = field.featureId;
			var element = me.down('checkboxfield[featureId=' + featureId + ']');
			if (element != null && element != undefined) {
				element.setReadOnly(true);
			} else if (featureId == 'DFL') {
				var element = me.down('combo[featureId=' + featureId + ']');
				element.setReadOnly(true);
			} else {
				var element = me.down('textfield[featureId=' + featureId + ']');
				if (element != null && element != undefined) {
					element.setReadOnly(true);
				}
			}
		});
	},
	showCheckedSection : function() {
		if (!this.isSectionChecked("ALTR")) {
			var transactionParametersSection = Ext.getCmp('transactionParametersSection');
			transactionParametersSection.hide();
		} else {
			var transactionParametersSection = Ext.getCmp('transactionParametersSection');
			transactionParametersSection.show();
		}
		
	},
	isSectionChecked : function(featureId) {
		if (selectedEntryFeatures == undefined)
			return false;
		var result = $.grep(selectedEntryFeatures, function(e) {
					return e == featureId;
				});
		return (result.length > 0);
	},

	saveItems : function() {
		var me = this;
		Ext.each(fieldJson, function(field, index) {
			var featureId = field.featureId;
			var element = me.down('checkboxfield[featureId=' + featureId + ']');
			if (element != null && element != undefined) {
				field.featureValue = element.getValue();
			} else if (featureId == 'DFL') {
				var element = me.down('combo[featureId=' + featureId + ']');
				if('null' != element.getValue() && null != element.getValue() && '' != element.getValue() ){
					field.featureValue = element.getValue();
					}
			} else {
				var element = me.down('textfield[featureId=' + featureId + ']');
				if (element != null && element != undefined) {
					field.featureValue = element.getValue();
				} else {
					var element = me.down('textareafield[featureId='
							+ featureId + ']');
					if (element != null && element != undefined) {
						field.featureValue = element.getValue();

					}
				}
				

			}
			if(!me.isSectionChecked("INV")){
							var subSetCode = field.featureSubsetCode;
							if(subSetCode == 'INVESTPRM'){
								field.featureValue = 'false';
							}
							
						}
						if(!me.isSectionChecked("LN")){
						var subSetCode = field.featureSubsetCode;
							if(subSetCode == 'LOANPRM'){
								field.featureValue = 'false';
							}
						}
						if(!me.isSectionChecked("DPW")){
						var subSetCode = field.featureSubsetCode;
							if(subSetCode == 'DEPVW'){
								field.featureValue = 'false';
							}
						}
						if(!me.isSectionChecked("ALTR")){
						var subSetCode = field.featureSubsetCode;
							if(subSetCode == 'TXNPRM'){
								field.featureValue = 'false';
							}
						}

		});

		if (!Ext.isEmpty(me.fnCallback) && typeof me.fnCallback == 'function') {
			me.fnCallback('', fieldJson);
			me.close();
		}

	}
});