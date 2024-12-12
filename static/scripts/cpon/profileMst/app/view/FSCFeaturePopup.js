var fieldJson = [];
Ext.define('GCP.view.FSCFeaturePopup', {
	extend: 'Ext.window.Window',
	xtype: 'fscFeaturePopup',
	width : 700,
	height : 220,
	title: 'SCF Options',
	layout: 'fit',
	overflowY: 'auto',
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
		title : null
	},
	listeners:{
	
			 show:function(){
			    this.showCheckedSection();
						//this.render();
                        }
	},
	loadFeaturs: function() {
	
		return featureData;
	},
	setBRFilterOptions: function() {
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'SO','FSCFPRM');
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
			obj.featureType = feature.featureType;
			obj.featureSubsetCode = feature.featureSubsetCode;
			obj.columnWidth= 0.24;
			featureItems.push(obj);fieldJson.push(obj);
		});
		return featureItems;
	},
	setBRExportOptions : function(){
	var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'E','FSCFPRM');
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
			obj.columnWidth= 0.24;
			if(feature.isAssigned != undefined && feature.isAssigned !=null){
				obj.checked = true;
			}
			featureItems.push(obj);
			fieldJson.push(obj);
		});
		return featureItems;
	},
	setDaysTextField : function(feature){
		var panel = Ext.create('Ext.panel.Panel', {
			columnWidth:0.80,
			layout:'column'
		});
			var obj = new Object();
			if(feature.profileFieldType != undefined){
				obj.profileFieldType = feature.profileFieldType;
			}
			obj.xtype = 'textfield';
			obj.featureId = feature.value;
			obj.featureType = feature.featureType;
			obj.featureSubsetCode = feature.featureSubsetCode;
			obj.columnWidth= 0.2;
			if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned){
				obj.value = feature.featureValue;
			}
			obj.maxLength='3';
			obj.enforceMaxLength = true;
			panel.insert(0,obj);
			panel.insert(1,{xtype: 'label',columnWidth:0.3,text: getLabel('days','Days'),padding:'5 0 0 0',itemId:obj.featureId+'Label'});
		return panel;
	},
	setFilterRestrictionsOptions : function(featureId,featureType,featureSubsetCode){
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,featureType,featureSubsetCode);
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
			obj.columnWidth= 0.33;
			
			if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned){
				obj.checked = true;
			}
			count++;
			if(count % 3 == 1)
			{
				obj.cls= 'clearLeft';
			}
			//obj.fieldStyle = 'height:25px !important';
			fieldJson.push(obj);
			if(obj.featureId == featureId){
				featureItems.push(self.setDaysTextField(feature));
			}
		});
		return featureItems;
	},
	setBRViewOptions : function(){
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'O','FSCFPRM');
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
			obj.columnWidth= 0.24;
			obj.id = obj.featureId;
			
			if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned){
				obj.checked = true;
			}
			if(obj.featureId == 'FSCFILRST'){
				
			}
			 else
				featureItems.push(obj);
				fieldJson.push(obj);
		});
		return featureItems;
	},
	comboBoxHandler : function(){
		/*var BRGRIV = Ext.getCmp('GR');
		var BRWIDV = Ext.getCmp('WGT');
		if(BRWIDV.getValue() == false && BRGRIV.getValue() == false)
		{
			BRWIDV.checked = true;
		}
		
		if(BRWIDV.getValue() == true && BRGRIV.getValue() == false)
		{
			BRWIDV.setDisabled(true);
		}
		else if(BRGRIV.getValue() == true && BRWIDV.getValue() == false)
		{
			BRGRIV.setDisabled(true);
		}
		else
		{
			BRWIDV.setDisabled(false);
			BRGRIV.setDisabled(false);
		}
		
		
		var element = Ext.getCmp('DFL');
		if(BRWIDV.getValue() && BRGRIV.getValue()){
			element.setDisabled(false);
			if(element.getValue() == null || element.getValue() == '')
			{
				element.setValue('BRWIDV');
			}
		}
		else{
			element.setDisabled(true);
			element.setValue('');
		}*/
	},
	
	

	radioButtonClickHandler : function(defaultOption,customOption,textAreaElm){
		var txtArea = Ext.getCmp(textAreaElm);
		var IRDFDISCLM = Ext.getCmp(defaultOption);
		var IRCSDISCLM = Ext.getCmp(customOption);
		if(undefined != IRDFDISCLM && IRDFDISCLM.getValue()){
			txtArea.setDisabled(true);
		}
		if(undefined != IRCSDISCLM && IRCSDISCLM.getValue()){
			txtArea.setDisabled(false);
		}
	},

	filterFeatures: function(data,featureType,subsetCode) {
	
	   var allFeatures = new Ext.util.MixedCollection();
	   allFeatures.addAll(data);
	   var featureFilter = new Ext.util.Filter({
			filterFn: function(item) {
				return item.featureSubsetCode == subsetCode && item.featureType == featureType;
			}
		});
		var featurs = allFeatures.filter(featureFilter);
		return featurs.items;
	},
	filterFeature: function(data,featureId) {
	   var allFeatures = new Ext.util.MixedCollection();
	   allFeatures.addAll(data);
	   var featureFilter = new Ext.util.Filter({
			filterFn: function(item) {
				return item.value == featureId;
			}
		});
		var featurs = allFeatures.filter(featureFilter);
		return featurs.items;
	},
	initComponent: function() {
	    var thisClass = this;
		        
		thisClass.items = [{
	    	       xtype: 'container',
			       items: [{
								xtype: 'checkboxgroup',
								featureId: 2,
								fieldLabel: getLabel(' ',' '),
								labelSeparator:' ',
								layout:'column',
								width: '100%',
								padding: '0 0 0 10',
								vertical: true,
								items: thisClass.setBRViewOptions()
			       		   }, {
								xtype: 'checkboxgroup',
								itemId : 'BRFilterOptions',
								fieldLabel: getLabel('options','Options'),
								width: '100%',
								padding: '0 0 0 10',
								vertical: true,
								layout:'column',
								items: thisClass.setBRFilterOptions()
							}, {
								xtype: 'checkboxgroup',
								featureId: 2,
								fieldLabel: getLabel('export','Export'),
								width: '100%',
								padding: '0 0 0 10',
								layout:'column',
								vertical: true,
								items: thisClass.setBRExportOptions()
							},
							{
								xtype: 'checkboxgroup',
								featureId: 2,
								fieldLabel: getLabel('filterrs','Filter Restrictions'),
								layout:'column',
								width: '100%',
								padding: '0 0 0 10',
								vertical: true,
								items: thisClass.setFilterRestrictionsOptions('FSCFILRST','FR','FSCFPRM')
							}]
	    }];
	  
	  thisClass.buttons=[
			          { 
			        	  text:  getLabel('submit','Submit'),
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
		//this.showCheckedSection();
		this.radioButtonClickHandler('IRDFDISCLM','IRCSDISCLM','redemptionDisclaimTextArea');
		this.radioButtonClickHandler('LDFDISCLM','LCSDISCLM','drawdownDisclaimTxt');
		this.radioButtonClickHandler('IDFDISCLM','ICSDISCLM','investDisclaimTextArea');
		//this.radioButtonClickHandler('LRDFDISCLM','LRCSDISCLM','repayDisclaimTextArea');
		this.comboBoxHandler();
		if(pageMode == 'VIEW' || pageMode == 'SUBMIT'){
			this.disabledAllElement();
		}
		if(viewPageMode == 'VIEW_CHANGES'){
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
								if(viewPageMode == 'VIEW_CHANGES'){
									element.boxLabelCls = me.getOldNewValueClass(field)+ " "+element.boxLabelCls;
								}
						}
						else {
							
								var element = me.down('textareafield[featureId='+featureId+']');
								if(element != null && element != undefined){
									element.setReadOnly(true);
									if(viewPageMode == 'VIEW_CHANGES'){
										element.fieldCls = me.getOldNewValueClass(field);
									}
								}
								else{
								
								   var element = me.down('textfield[featureId='+featureId+']');
									if(element != null && element != undefined){
										element.setReadOnly(true);
										if(viewPageMode == 'VIEW_CHANGES'){
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
	disabledAllElement : function(){
		var me = this;
		Ext.each(fieldJson, function(field, index) {
			var featureId = field.featureId;
						var element = me.down('checkboxfield[featureId='+featureId+']');
						
							if(element != null && element != undefined){
							//element.boxLabelCls =element.boxLabelCls+" newFieldValue";
							element.setReadOnly(true);
						}
						else {
								var element = me.down('textfield[featureId='+featureId+']');
								if(element != null && element != undefined){
									element.setReadOnly(true);
								}
								else{
								   var element = me.down('textareafield[featureId='+featureId+']');
									if(element != null && element != undefined){
										element.setReadOnly(true);
									}
								}
						}
		});
	},
	showCheckedSection : function(){
		/*if (!this.isSectionChecked("ALTR")) {
			var transactionParametersSection = Ext.getCmp('transactionParametersSection');
			transactionParametersSection.hide();
		} else {
			var transactionParametersSection = Ext.getCmp('transactionParametersSection');
			transactionParametersSection.show();
		}*/
	},
	isSectionChecked : function(featureId){
		
		if(selectedEntryFeatures == undefined)
			return false;
		var result = $.grep(selectedEntryFeatures, function(e){ return e == featureId; });
		return (result.length > 0);
	},
	
	saveItems : function() {
				var me = this;
				Ext.each(fieldJson, function(field, index) {
						var featureId = field.featureId;
						var element = me.down('checkboxfield[featureId='+featureId+']');
						if(element != null && element != undefined){
							field.featureValue = element.getValue();
						}
						else {
								var element = me.down('textfield[featureId='+featureId+']');
								if(element != null && element != undefined){
									field.featureValue = element.getValue();
								}
								else{
								   var element = me.down('textareafield[featureId='+featureId+']');
									if(element != null && element != undefined){
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
						
				});
				
				if (!Ext.isEmpty(me.fnCallback)
						&& typeof me.fnCallback == 'function') {
					me.fnCallback('',fieldJson);
					me.close();
				}

			}
});