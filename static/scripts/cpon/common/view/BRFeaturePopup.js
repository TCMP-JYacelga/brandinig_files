var fieldJson = [];
Ext.define('GCP.view.BRFeaturePopup', {
	extend : 'Ext.window.Window',
	xtype : 'brFeaturePopup',
	cls : 'non-xn-popup',
	width : 735,
	minHeight : 156,
	maxHeight : 550,
	draggable : false,
	resizable : false,
	title : getLabel('brAdvanceOptions', 'BR Advance Options'),
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

		show : function() {
			//this.showCheckedSection();
			// this.render();
		}
	},
	loadFeaturs : function() {
		return featureData;
	},
	setTransactionParameters : function() {
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data, 'PO', 'PAYPRM');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					if (feature.profileFieldType != undefined) {
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.columnWidth = 0.33;
					if (feature.isAssigned != undefined
							&& feature.isAssigned != null && feature.isAssigned) {
						obj.checked = true;
						obj.defVal = true;
					}
					if (feature.readOnly == true)
						obj.disabled = true;
					else
						obj.disabled = false;
					featureItems.push(obj);
					fieldJson.push(obj);
				});
		return featureItems;
	},
	setTransactionOptions : function() {
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data, 'O', 'PAYPRM');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					if (feature.profileFieldType != undefined) {
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.columnWidth = 0.33;
					if (feature.isAssigned != undefined
							&& feature.isAssigned != null && feature.isAssigned) {
						obj.checked = true;
						obj.defVal = true;
					}
					if (feature.readOnly == true)
						obj.disabled = true;
					else
						obj.disabled = false;
					featureItems.push(obj);
					fieldJson.push(obj);
				});
		return featureItems;
	},
	setVIFilterRestriction : function() {
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data, 'FR', 'DEPVW');
		var featureItems = [];
		var count = 0;
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					if (feature.profileFieldType != undefined) {
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.columnWidth = 0.33;
					count++;
					if (feature.readOnly == true)
						obj.disabled = true;
					else
						obj.disabled = false;
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
	setIPFilterRestriction : function() {
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data, 'FR', 'INVESTPRM');
		var featureItems = [];
		var count = 0;
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					if (feature.profileFieldType != undefined) {
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.columnWidth = 0.33;
					count++;
					if (feature.readOnly == true)
						obj.disabled = true;
					else
						obj.disabled = false;
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
	setPOFilterRestriction : function() {
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data, 'FR', 'LOANPRM');
		var featureItems = [];
		var count = 0;
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					if (feature.profileFieldType != undefined) {
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.columnWidth = 0.33;
					count++;
					if (feature.readOnly == true)
						obj.disabled = true;
					else
						obj.disabled = false;
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
	setBRFilterRestriction : function() {
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data, 'FR', 'BRPRM');
		var featureItems = [];
		var count = 0;
		Ext.each(filteredData, function(feature, index) {
					var obj = new Object();
					if (feature.profileFieldType != undefined) {
						obj.profileFieldType = feature.profileFieldType;
					}
					if(Ext.isDefined(feature.featureId)){
						feature.value = feature.featureId;
					}
					obj.profileId = feature.profileId;
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.columnWidth = 0.33;
					count++;
					if (feature.readOnly == true)
						obj.disabled = true;
					else
						obj.disabled = false;
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
		if(Ext.isDefined(feature.featureId)){
			feature.value = feature.featureId;
		}
		obj.xtype = 'numberfield';
		obj.featureId = feature.value;
		obj.featureType = feature.featureType;
		obj.featureSubsetCode = feature.featureSubsetCode;
		obj.readOnly =feature.readOnly;
		obj.sequenceNo = feature.sequenceNo;
		obj.updated = feature.updated;
		obj.profileId = feature.profileId;
		obj.width = 40;
		obj.margin = '0 5 0 5',
		obj.hideTrigger = true,
		obj.value = resDaysBR;
		if (feature.profileId != undefined && feature.profileId != null || errorExists) {
			obj.value = feature.featureValue;
		}
		if(feature.readOnly == true){
			obj.readOnly = true;
		}
		obj.maxLength = 3;
		obj.enforceMaxLength = true;
		panel.insert(0, {
					xtype : 'label',
					cls : 'ux_font-size14',
					columnWidth : 0.37,
					text : getLabel('filterrs','Filter Restrictions'),
					padding : '5 0 0 0'
				});
		panel.insert(1, obj);
		panel.insert(2, {
					xtype : 'component',
					cls : 'ux_font-size14-normal',
					columnWidth : 0.27,
					autoEl : {
						tag : 'span',
						html : getLabel('days', 'Days')
					},
					//text : getLabel('days','Days'),
					padding : '5 0 0 0'
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
					if (feature.profileFieldType != undefined) {
						obj.profileFieldType = feature.profileFieldType;
					}
					if(Ext.isDefined(feature.featureId)){
						feature.value = feature.featureId;
					}
					if(Ext.isDefined(feature.checked)){
						feature.isAssigned = feature.checked;
					}
					if(Ext.isDefined(feature.disabled)){
						feature.readOnly = feature.disabled;
					}
					obj.xtype = 'checkbox';
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.value = feature.featureValue;
					obj.defVal = "";
					if (feature.isAssigned != undefined && feature.isAssigned != null && feature.isAssigned) {
						obj.checked = true;
						obj.defVal = true;
					}
					if (feature.readOnly == true)
						obj.disabled = true;
					else
						obj.disabled = false;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.columnWidth = 0.3333;
					obj.profileId = feature.profileId;
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
					if (feature.profileFieldType != undefined) {
						obj.profileFieldType = feature.profileFieldType;
					}
					if(Ext.isDefined(feature.featureId)){
						feature.value = feature.featureId;
					}
					if(Ext.isDefined(feature.checked)){
						feature.isAssigned = feature.checked;
					}
					if(Ext.isDefined(feature.disabled)){
						feature.readOnly = feature.disabled;
					}
					obj.xtype = 'checkbox';
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.profileId = feature.profileId;
					obj.columnWidth = 0.3333;
					if (feature.isAssigned != undefined
							&& feature.isAssigned != null && feature.isAssigned) {
						obj.checked = true;
						obj.defVal = true;
					}
					if (feature.readOnly == true)
						obj.disabled = true;
					else
						obj.disabled = false;
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
					if (feature.profileFieldType != undefined) {
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.columnWidth = 0.33;
					if (feature.isAssigned != undefined
							&& feature.isAssigned != null && feature.isAssigned) {
						obj.checked = true;
						obj.defVal = true;
					}
					if (feature.readOnly == true)
						obj.disabled = true;
					else
						obj.disabled = false;
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
		var filterPref = null;
		var hasDefaultFilterFeature = false;
		Ext.each(filteredData, function(feature, index) {
			if(Ext.isDefined(feature.featureId)){
				feature.value = feature.featureId;
			}
			if(Ext.isDefined(feature.checked)){
				feature.isAssigned = feature.checked;
			}
			if(Ext.isDefined(feature.disabled)){
				feature.readOnly = feature.disabled;
			}
			
			if(feature.value === 'FBTR-000002'){
				filterPref = feature.featureValue;
				hasDefaultFilterFeature = true;
			}
			
			if(feature.value !== 'FBTR-000002' && feature.value !== 'FBTR-000003'){
					var obj = new Object();
					if (feature.profileFieldType != undefined) {
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.xtype = 'checkbox';
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.profileId = feature.profileId;
					obj.columnWidth = 0.3333;
					if (feature.isAssigned != undefined
							&& feature.isAssigned != null && feature.isAssigned) {
						obj.checked = true;
						obj.defVal = true;
					}
					if (feature.readOnly == true)
						obj.disabled = true;
					else
						obj.disabled = false;
					featureItems.push(obj);
					fieldJson.push(obj);
			}
		});
		if(hasDefaultFilterFeature){
			var objXDays = new Object();
			var objDefaultFilter = new Object();
			var filterDataStore = Ext.create('Ext.data.Store', {
        	fields: ['code', 'desc'],
			      data : [
			      	{'code' : '16', 'desc' : getLabel('selectedDate','Selected Record Date')},
			      	{'code' : '2', 'desc' : getLabel('yesterday','Yesterday')},
			      	{'code' : '3', 'desc' : getLabel('thisWeek','This Week')},
			      	{'code' : '4', 'desc' : getLabel('lastWeek','Last Week to Date')},
			      	{'code' : '5', 'desc' : getLabel('thisMonth','This Month')},
			      	{'code' : '6', 'desc' : getLabel('lastMonth','Last Month to Date')},
			      	{'code' : '8', 'desc' : getLabel('thisQuarter','This Quarter')},
			      	{'code' : '9', 'desc' : getLabel('lastQuarter','Last Quarter to Date')},
			      	{'code' : '10', 'desc' : getLabel('thisYear','This Year')},
			      	{'code' : '11', 'desc' : getLabel('lastYear','Last Year to Date')},
			      	{'code' : '14', 'desc' : getLabel('xDays','Last X Days')}
			      ]
			});
			var panel = Ext.create('Ext.panel.Panel', {
						columnWidth : 1,
						layout : 'vbox'
			});
			panel.insert(0, {
						xtype : 'label',
						cls : 'ux_font-size14-normal',
						columnWidth : 0.37,
						text : getLabel('detailFilter','Default Activity Date Filter'),
						padding : '5 0 0 0'
			});
			Ext.each(filteredData, function(feature, index) {
				if(feature.value === 'FBTR-000002'){
					objDefaultFilter.xtype = 'combo';
			        objDefaultFilter.queryMode = 'local';
			        objDefaultFilter.displayField = 'desc';
			        objDefaultFilter.valueField = 'code';
			        objDefaultFilter.emptyText  = getLabel('select', 'Select');
					objDefaultFilter.featureType = feature.featureType;
					objDefaultFilter.featureId = feature.value;
					objDefaultFilter.featureSubsetCode = feature.featureSubsetCode;
					objDefaultFilter.readOnly =feature.readOnly;
					objDefaultFilter.sequenceNo = feature.sequenceNo;
					objDefaultFilter.updated = feature.updated;
					objDefaultFilter.profileId = feature.profileId;
					if(Ext.isEmpty(feature.featureValue) || feature.featureValue =="null"){
						objDefaultFilter.value = "";
						}else{	
							objDefaultFilter.value = feature.featureValue;
						}
					objDefaultFilter.store = filterDataStore;
				    objDefaultFilter.listeners = {
				        change: function (field, newValue) {
				        	var xdaysField = Ext.getCmp('xDays');
				        	var xdaysLabel = Ext.getCmp('xDaysLbl');
				            if(newValue === '14'){
				            	xdaysField.setReadOnly(false);
				            	xdaysField.setVisible(true);
				            	xdaysLabel.setVisible(true);
				            }
				            else{
				            	xdaysField.setReadOnly(true);
				            	xdaysField.setVisible(false);
				            	xdaysLabel.setVisible(false);
				            	xdaysField.setValue('');
				            }
				        }
				    };
					fieldJson.push(objDefaultFilter)
				}
				if(feature.value === 'FBTR-000003'){
					if(feature.profileFieldType !== undefined){
						objXDays.profileFieldType = feature.profileFieldType;
					}
					objXDays.xtype = 'numberfield';
					objXDays.featureId = feature.value;
					objXDays.itemId =  'xDays';
					objXDays.id =  'xDays';
					objXDays.featureType = feature.featureType;
					objXDays.featureSubsetCode = feature.featureSubsetCode;
					objXDays.readOnly =feature.readOnly;
					objXDays.sequenceNo = feature.sequenceNo;
					objXDays.updated = feature.updated;
					objXDays.profileId = feature.profileId;
					objXDays.width = 40;
					objXDays.margin = '0 0 0 5',
					objXDays.hideTrigger = true;
					if (feature.profileId != undefined && feature.profileId != null) {
						objXDays.value = feature.featureValue;
					}
					if(feature.readOnly == true ){
						objXDays.readOnly = true;
					}
					if(filterPref !== '14'){
						objXDays.readOnly = true;
						objXDays.hidden = true;
					}
					objXDays.maxLength = 3;
					objXDays.enforceMaxLength = true;
					fieldJson.push(objXDays);
				}
			});
			panel.insert(1, {
						xtype : 'container',
						layout : {
							type : 'hbox'
						},
						items : [
							objDefaultFilter,
							{
								xtype : 'component',
								padding : '5 0 0 10',
								cls : 'ux_font-size14-normal',
								itemId : 'xDaysLbl',
								id : 'xDaysLbl',
								hidden : filterPref !== '4',
								autoEl : {
									tag : 'span',
									html : getLabel('xdays', 'X (Days)')
								}
							},
							objXDays
						]
			});
			featureItems.push(panel);
		}
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
	
	setBRViewComboBox : function(feature) {
		var obj = new Object();
		if (feature.profileFieldType != undefined) {
			obj.profileFieldType = feature.profileFieldType;
		}
		obj.xtype = 'combo';
		obj.labelWidth = '45px';
		obj.fieldWidth = '20px';
		obj.fieldLabel = feature.name;
		obj.featureId = feature.value;
		obj.featureType = feature.featureType;
		obj.featureSubsetCode = feature.featureSubsetCode;
		obj.cls = 'ux_trigger-height';
		obj.columnWidth = 0.18;
		if (feature.readOnly == true)
			obj.disabled = true;
		else
			obj.disabled = false;
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
		if (feature.profileId != undefined && feature.featureValue != null
				&& feature.featureValue != 'null') {
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
					if (feature.profileFieldType != undefined) {
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.columnWidth = 0.33;
					obj.id = obj.featureId;
					if (feature.isAssigned != undefined
							&& feature.isAssigned != null && feature.isAssigned) {
						obj.checked = true;
						obj.defVal = true;
					}
					if (feature.readOnly == true)
						obj.disabled = true;
					else
						obj.disabled = false;
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
	comboBoxHandler : function() {
		var me = this;
		var errorMsgLabel = me.down('label[itemId=errorLabel]');
		if (!Ext.isEmpty(errorMsgLabel))
			errorMsgLabel.hide();
		var BRGRIV = Ext.getCmp('GR');
		var BRWIDV = Ext.getCmp('WGT');
		var element = Ext.getCmp('DFL');
		if(!Ext.isEmpty(BRWIDV) && !BRWIDV.getValue()){
			BRGRIV.setValue(true);
			element.setValue("G");
		}
		if(!Ext.isEmpty(BRGRIV) && !BRGRIV.getValue()){
			BRWIDV.setValue(true);
			element.setValue("W");
		}
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
					if (feature.profileFieldType != undefined) {
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.columnWidth = 0.33;
					if (feature.isAssigned != undefined
							&& feature.isAssigned != null && feature.isAssigned) {
						obj.checked = true;
						obj.defVal = true;
					}
					if (feature.readOnly == true)
						obj.disabled = true;
					else
						obj.disabled = false;
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
		if (feature.profileFieldType != undefined) {
			obj.profileFieldType = feature.profileFieldType;
		}
		obj.xtype = 'textfield';
		obj.featureId = feature.value;
		obj.featureType = feature.featureType;
		obj.featureSubsetCode = feature.featureSubsetCode;
		obj.columnWidth = 0.2;
		if (feature.isAssigned != undefined && feature.isAssigned != null
				&& feature.isAssigned) {
			obj.value = feature.featureValue;
		}
		if (feature.readOnly == true)
			obj.disabled = true;
		else
			obj.disabled = false;
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
					if (feature.profileFieldType != undefined) {
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.columnWidth = 0.33;
					if (feature.isAssigned != undefined
							&& feature.isAssigned != null && feature.isAssigned) {
						obj.checked = true;
						obj.defVal = true;
					}
					if (feature.readOnly == true)
						obj.disabled = true;
					else
						obj.disabled = false;
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
					if (feature.profileFieldType != undefined) {
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.columnWidth = 0.33;
					if (feature.isAssigned != undefined
							&& feature.isAssigned != null && feature.isAssigned) {
						obj.checked = true;
						obj.defVal = true;
					}
					if (feature.readOnly == true)
						obj.disabled = true;
					else
						obj.disabled = false;
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
					if (feature.profileFieldType != undefined) {
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.columnWidth = 0.33;
					if (feature.profileId != undefined
							&& feature.profileId != null) {
						obj.checked = true;
						obj.defVal = true;
					}
					if (feature.readOnly == true)
						obj.disabled = true;
					else
						obj.disabled = false;
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
					if (feature.profileFieldType != undefined) {
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.columnWidth = 0.20;
					obj.id = feature.value;
					obj.name = 'investDisclaim';
					if (feature.isAssigned != undefined
							&& feature.isAssigned != null && feature.isAssigned) {
						obj.checked = true;
						obj.defVal = true;
						if (obj.featureId == 'ITXTDISCLM') {
							obj.value = feature.featureValue;
						}
					}
					if (feature.readOnly == true)
						obj.disabled = true;
					else
						obj.disabled = false;
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
					if (feature.profileFieldType != undefined) {
						obj.profileFieldType = feature.profileFieldType;
					}
					obj.boxLabel = feature.name;
					obj.featureId = feature.value;
					obj.featureType = feature.featureType;
					obj.featureSubsetCode = feature.featureSubsetCode;
					obj.columnWidth = 0.33;
					if (feature.isAssigned != undefined
							&& feature.isAssigned != null && feature.isAssigned) {
						obj.checked = true;
						obj.defVal = true;

					}
					if (feature.readOnly == true)
						obj.disabled = true;
					else
						obj.disabled = false;
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
			itemId  :'brContainer',
			items : [{
					xtype : 'label',
					itemId : 'errorLabel',
					cls : 'error-msg-color',
					padding : '0 0 5 6',
					hidden : true,
					text : getLabel('ErrorMsg',
							'Either Grid View or Widget View should be selected')
				},
					
						
				{
					xtype : 'panel',
					id : 'brParametersSection',
					items : [{
							xtype : 'container',
							cls : 'ft-padding-bottom',
							itemId : 'servaddons_id',
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
											text : getLabel('serviceaddons',
													'Service Add-Ons'),
											width : '100%'
										}/*, {
											xtype : 'container',
											itemId : 'servaddons_links',
											width : '100%',
											hidden : thisClass.enableDisableLinks('SA',''),
											margin : '0 0 3 15',
											items : [{
												xtype : 'button',
												cls : 'xn-account-filter-btnmenu',
												border : 0,
												width : (screen.width) > 1024 ? 54 : 45,
												text : '<span style="font-size:13px" class="button_underline ux_no-padding-left thePointer">'
														+ getLabel('selectAll',
																'Select All')
														+ '</span>',
												handler : function() {
													thisClass
															.selectAll_Clear(
																	this
																			.up('container[itemId=servaddons_id]')
																			.down('container[itemId=servaddons_chkBox]'),
																	true);
												}
											}, {
												xtype : 'button',
												text : '<span style="font-size:13px" class="button_underline thePointer">'
														+ getLabel('clear', 'Clear')
														+ '</span>',
												cls : 'xn-account-filter-btnmenu ux_verylargemargin-left',
												handler : function() {
													thisClass
															.selectAll_Clear(
																	this
																			.up('container[itemId=servaddons_id]')
																			.down('container[itemId=servaddons_chkBox]'),
																	false);
												}
											}]
										}*/]
							}, {
								xtype : 'container',
								featureId : 2,
								// fieldLabel : getLabel('serviceaddons', 'Service
								// Add-Ons'),
								itemId : 'servaddons_chkBox',
								layout : 'column',
								width : '100%',
								padding : '0 0 0 0',
								vertical : false,
								items : thisClass.setBROtherOptions()
							}]
						}, {
							xtype : 'container',
							cls : 'ft-padding-bottom',
							itemId : 'brexport_id',
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
										}/*, {
											xtype : 'container',
											itemId : 'brexport_links',
											width : '100%',
											hidden : thisClass.enableDisableLinks('E',
													''),
											margin : '0 0 3 15',
											items : [{
												xtype : 'button',
												cls : 'xn-account-filter-btnmenu',
												border : 0,
												width : (screen.width) > 1024 ? 54 : 45,
												text : '<span style="font-size:13px" class="button_underline ux_no-padding-left thePointer">'
														+ getLabel('selectAll',
																'Select All')
														+ '</span>',
												handler : function() {
													thisClass
															.selectAll_Clear(
																	this
																			.up('container[itemId=brexport_id]')
																			.down('container[itemId=brexport_chkBox]'),
																	true);
												}
											}, {
												xtype : 'button',
												text : '<span style="font-size:13px" class="button_underline thePointer">'
														+ getLabel('clear', 'Clear')
														+ '</span>',
												cls : 'xn-account-filter-btnmenu ux_verylargemargin-left',
												handler : function() {
													thisClass
															.selectAll_Clear(
																	this
																			.up('container[itemId=brexport_id]')
																			.down('container[itemId=brexport_chkBox]'),
																	false);
												}
											}]
										}*/]
							},		
							{
								xtype : 'container',
								featureId : 2,
								// fieldLabel : getLabel('export', 'Export'),
								itemId : 'brexport_chkBox',
								width : '100%',
								labelCls : 'font_bold',
								padding : '0 0 0 0',
								layout : 'column',
								vertical : true,
								items : thisClass.setBRExportOptions()
							}]
						},{
							xtype : 'container',
							cls : 'ft-padding-bottom',
							itemId : 'BRFilterOptions_id',
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
										}/*, {
											xtype : 'container',
											itemId : 'BRFilterOptions_links',
											width : '100%',
											hidden : thisClass.enableDisableLinks('OPTION',
													''),
											margin : '0 0 3 15',
											items : [{
												xtype : 'button',
												cls : 'xn-account-filter-btnmenu',
												border : 0,
												width : (screen.width) > 1024 ? 54 : 45,
												text : '<span style="font-size:13px" class="button_underline ux_no-padding-left thePointer">'
														+ getLabel('selectAll',
																'Select All')
														+ '</span>',
												handler : function() {
													thisClass
															.selectAll_Clear(
																	this
																			.up('container[itemId=BRFilterOptions_id]')
																			.down('container[itemId=BRFilterOptions]'),
																	true);
												}
											}, {
												xtype : 'button',
												text : '<span style="font-size:13px" class="button_underline thePointer">'
														+ getLabel('clear', 'Clear')
														+ '</span>',
												cls : 'xn-account-filter-btnmenu ux_verylargemargin-left',
												handler : function() {
													thisClass
															.selectAll_Clear(
																	this
																			.up('container[itemId=BRFilterOptions_id]')
																			.down('container[itemId=BRFilterOptions]'),
																	false);
												}
											}]
										}*/]
							},					
						
					{
						xtype : 'container',
						itemId : 'BRFilterOptions',
						labelCls: 'font_bold',
						//fieldLabel : getLabel('options', 'Options'),
						width : '100%',
						padding : '0 0 0 0',
						vertical : true,
						layout : 'column',
						items : thisClass.setBRFilterOptions()
					}]
					},{
						xtype : 'container',
						featureId : 2,
						cls : 'ft-padding-bottom',
						itemId : 'restrictionDays',
							layout : {
								type : 'vbox'
							},
						vertical : true,
						items : thisClass.setBRFilterRestriction()
					}/*, {
						xtype : 'checkboxgroup',
						featureId : 2,
						fieldLabel : getLabel('view', 'View'),
						layout : 'column',
						width : '100%',
						labelCls: 'font_bold',
						padding : '0 0 0 10',
						vertical : true,
						itemId : 'viewCheckBoxGroup',
						items : thisClass.setBRViewOptions()
					}*/
	
					]
			}]
		}

		];

		thisClass.bbar = (viewmode == 'VIEW' || viewmode == "MODIFIEDVIEW"
						|| viewmode == "VERIFY") ?['->',{
					text : getLabel('cancel','Cancel'),
					//glyph : 'xf056@fontawesome',
					handler : function(btn, opts) {
						thisClass.close();
					}
				}]:[{
					text : getLabel('cancel','Cancel'),
					//glyph : 'xf056@fontawesome',
					handler : function(btn, opts) {
						thisClass.close();
					}
				}, '->',{
					text : getLabel('submit','Submit'),
					//glyph : 'xf058@fontawesome',
					handler : function(btn, opts) {
						thisClass.saveItems();
					}
				}];
		this.doLayout();
		this.callParent(arguments);
		// this.showCheckedSection();
		this.comboBoxHandler();
		if (viewmode == 'VIEW' || viewmode == "MODIFIEDVIEW"
				|| pagemode == "VERIFY") {
			this.setOldNewValueClass();
		}

	},
	setOldNewValueClass : function() {
		var me = this;
		Ext.each(fieldJson, function(field, index) {
			var featureId = field.featureId;
			var element = me.down('checkboxfield[featureId=' + featureId + ']');

			if (element != null && element != undefined) {
				element.setReadOnly(true);
				if (viewmode == 'MODIFIEDVIEW') {
					if (field.profileFieldType == 'MODIFIED')
						element.boxLabel = '<span class="modifiedFieldValue">'
								+ element.boxLabel + '</span>';
					else if (field.profileFieldType == 'NEW')
						element.boxLabel = '<span class="newFieldValue">'
								+ element.boxLabel + '</span>';
					else if (field.profileFieldType == 'DELETED')
						element.boxLabel = '<span class="deletedFieldValue">'
								+ element.boxLabel + '</span>';
				}
			}  else {

				var element = me.down('textareafield[featureId=' + featureId
						+ ']');
				if (element != null && element != undefined) {
					element.setReadOnly(true);
					if (viewmode == 'MODIFIEDVIEW') {
						element.fieldCls = me.getOldNewValueClass(field);
					}
				} else {

					var element = me.down('textfield[featureId=' + featureId
							+ ']');
					if (element != null && element != undefined) {
						element.setReadOnly(true);
						if (viewmode == 'MODIFIEDVIEW') {
							element.fieldCls = me.getOldNewValueClass(field);
							if ('MODIFIED' == field.profileFieldType
									&& !Ext.isEmpty(objOldFieldValues)) {
								element.on('render', function() {
									Ext.create('Ext.tip.ToolTip', {
												target : element.id,
												html : objOldFieldValues[featureId]
											});
								});
							}
						}
					}
				}
			}
		});
	},
	getOldNewValueClass : function(feature) {

		if (feature.profileFieldType == 'MODIFIED')
			return "modifiedFieldValue ";
		else if (feature.profileFieldType == 'NEW')
			return "newFieldValue ";
		else if (feature.profileFieldType == 'DELETED')
			return "deletedFieldValue ";
	},
	disabledAllElement : function() {
		var me = this;
		Ext.each(fieldJson, function(field, index) {
			var featureId = field.featureId;
			var element = me.down('checkboxfield[featureId=' + featureId + ']');
			if (element != null && element != undefined) {
				element.setReadOnly(true);
			}  else {
				var element = me.down('textfield[featureId=' + featureId + ']');
				if (element != null && element != undefined) {
					element.setReadOnly(true);
				}
			}
		});
	},
	showCheckedSection : function() {
		if (!this.isSectionChecked("ALTR")) {
			var transactionParametersSection = Ext
					.getCmp('transactionParametersSection');
			transactionParametersSection.hide();
		} else {
			var transactionParametersSection = Ext
					.getCmp('transactionParametersSection');
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
		var viewCheckBoxGroupRef = me
				.down('checkboxgroup[itemId=viewCheckBoxGroup]');
		var blnViewFlag = true;
		var objCpFeatureChecked = document.getElementById('chkImg_F_SRV_BR_PRV_CP');
		var errorMsgLabel = me.down('label[itemId=errorLabel]');
		Ext.each(fieldJson, function(field, index) {
			var featureId = field.featureId;
			var element = me.down('checkboxfield[featureId=' + featureId + ']');
			if (element != null && element != undefined) {
				field.featureValue = element.getValue();
				field.checked = element.checked;
				field.defVal = element.checked;
				if(featureId=='CASHPOSTRANS' || featureId=='CASHPOSACNT')
				{
					if(objCpFeatureChecked && (objCpFeatureChecked.src.indexOf("icon_unchecked.gif") > -1 || objCpFeatureChecked.src.indexOf("icon_unchecked_grey.gif") > -1))
					{
						field.checked=false;
						field.defVal = false;
						field.featureValue = 'false';
					}
				}				
			}  else {
				var element = me.down('textfield[featureId=' + featureId + ']');
				if (element != null && element != undefined) {
					if(element.getValue()==null)
						field.featureValue = '16';
					else
						
					field.featureValue = element.getValue();
				} else {
					var element = me.down('textareafield[featureId='
							+ featureId + ']');
					if (element != null && element != undefined) {
						field.featureValue = element.getValue();

					}
				}

			}
			if (!me.isSectionChecked("INV")) {
				var subSetCode = field.featureSubsetCode;
				if (subSetCode == 'INVESTPRM') {
					field.featureValue = 'false';
				}

			}
			if (!me.isSectionChecked("LN")) {
				var subSetCode = field.featureSubsetCode;
				if (subSetCode == 'LOANPRM') {
					field.featureValue = 'false';
				}
			}
			if (!me.isSectionChecked("DPW")) {
				var subSetCode = field.featureSubsetCode;
				if (subSetCode == 'DEPVW') {
					field.featureValue = 'false';
				}
			}
			if (!me.isSectionChecked("ALTR")) {
				var subSetCode = field.featureSubsetCode;
				if (subSetCode == 'TXNPRM') {
					field.featureValue = 'false';
				}
			}
			if(featureId=='FBTR-000003' || featureId=='FBTR-000002'){
				field.store = null;
				field.listeners = null;
				field.change = null;
			}
		});

		if (!Ext.isEmpty(viewCheckBoxGroupRef)) {
			var groupItems = viewCheckBoxGroupRef.items;
			for (var index = 0; index < groupItems.length; index++) {
				var currentItem = groupItems.items[index];
				if (currentItem instanceof Ext.form.field.Checkbox) {
					if (currentItem.getValue() === true) {
						blnViewFlag = true;
						break;
					}
				}
			}
		}

		if (blnViewFlag == true) {
			if (!Ext.isEmpty(errorMsgLabel))
				errorMsgLabel.hide();
			if (!Ext.isEmpty(me.fnCallback)
					&& typeof me.fnCallback == 'function') {
				me.fnCallback('', fieldJson);
				me.close();
			}
		}
	}/*,
	selectAll_Clear : function(parentContainer, flag) {
		var checkboxArray = parentContainer.items.items;
		for (var i = 0; i < checkboxArray.length; i++) {
			if (checkboxArray[i].xtype === 'checkbox') {
				if (!checkboxArray[i].isDisabled()) {
					if (flag === true) {
						checkboxArray[i].setValue(true)
					} else {
						checkboxArray[i].setValue(false)
					}
				}
			}
		}
	},
	enableDisableLinks : function(fId, fGroup) {
		if(viewmode === 'VIEW' || pagemode == "VERIFY" || viewmode == "MODIFIEDVIEW")
			return true;
		else{
			var data = this.loadFeaturs();
			var filteredData = this.getBRPopupFeatures(data, fId, fGroup);
			var featureItems = [];
			for (var i = 0; i < filteredData.length; i++) {
				if (filteredData[i].readOnly === false)
					return false;
			}
			return true;
		}
	}*/
});