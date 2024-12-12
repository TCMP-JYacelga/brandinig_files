var fieldJson = [];
Ext.define('GCP.view.BRFeaturePopup', {
	extend: 'Ext.window.Window',
	xtype: 'brFeaturePopup',
	width : 920,
	height : 600,
	title: 'BR Options',
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
		var filteredData = this.filterFeatures(data,'O','BRPRM');
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
		var filteredData = this.filterFeatures(data,'E','BRPRM');
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
	setTXNPaymentOptions : function(){
	var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'PO','PAYPRM');
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
			if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned){
				obj.checked = true;
			}
			featureItems.push(obj);
			fieldJson.push(obj);
		});
		return featureItems;
	},
	setDaysTextField : function(feature){
		var panel = Ext.create('Ext.panel.Panel', {
			columnWidth:0.33,
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
			obj.value = '0';
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
			else{
				featureItems.push(obj);
			}
		});
		return featureItems;
	},
	setBROtherOptions :function(){
	var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'OTH','BRPRM');
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
			if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned){
				obj.checked = true;
			}
			featureItems.push(obj);
			fieldJson.push(obj);
		});
		return featureItems;
	},
	setBRViewComboBox : function(feature){
		var panel = Ext.create('Ext.panel.Panel', {
			columnWidth:0.30,
			layout:'column'
		});
		
			var obj = new Object();
			if(feature.profileFieldType != undefined){
				obj.profileFieldType = feature.profileFieldType;
			}
			obj.xtype = 'combo';
			//obj.labelWidth='2px';
			//obj.fieldWidth='2px';
			//obj.fieldLabel = feature.name;
			obj.featureId = feature.value;
			obj.featureType = feature.featureType;
			obj.featureSubsetCode = feature.featureSubsetCode;
			obj.columnWidth= 0.26;
			
			obj.id = obj.featureId;
			obj.editable= false;
			obj.disabled = true;
			obj.store = new Ext.data.Store({
					data: [
							{"featureId":"BRWIDV", "name":"Widget"},
							{"featureId":"BRGRIV", "name":"Grid"}
						  ],
						fields: ['featureId', 'name']
				});
			obj.displayField= 'name';
			obj.valueField= 'featureId';
			if(feature.isAssigned != undefined && feature.featureValue !=null && feature.featureValue !='null' && feature.isAssigned){
				obj.value = feature.featureValue;
			}
			panel.insert(0,{xtype: 'label',columnWidth:0.2,text: feature.name,padding:'5 0 0 0',itemId:obj.featureId+'Label'});
			panel.insert(1,obj);
		return panel;
	},
	setBRViewOptions : function(){
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'V','BRPRM');
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
			if(obj.featureId == 'GR' || obj.featureId == 'WGT'){
			
				obj.handler = function() {
					self.comboBoxHandler();
				}
			}
			featureItems.push(obj);
			/*if(obj.featureId == 'DFL')
				featureItems.push(self.setBRViewComboBox(feature));
			 else
				featureItems.push(obj);*/
				fieldJson.push(obj);
		});
		return featureItems;
	},
	comboBoxHandler : function(){
		var BRGRIV = Ext.getCmp('GR');
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
		}
	},
	setLOANPaymentOptions : function(){
	var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'PO','LOANPRM');
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
			obj.columnWidth= 0.33;
			if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned){
				obj.checked = true;
			}
			featureItems.push(obj);
			fieldJson.push(obj);
		});
		return featureItems;
	},
	setMaxTextField : function(feature){
	
		var panel = Ext.create('Ext.panel.Panel', {
			columnWidth:0.33,
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
			panel.insert(0,{xtype: 'label',columnWidth:0.3,text: getLabel('maxdays','Max Days'),padding:'5 0 0 0',itemId:obj.featureId+'Label'});
			panel.insert(1,obj);		
		return panel;
	},
	setLOANOptions : function(){
	var self = this;
	var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'O','LOANPRM');
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
			if(obj.featureId == 'LMAXD' || obj.featureId == 'LMAXABDD'){
				featureItems.push(self.setMaxTextField(feature));
			}
			else{
				featureItems.push(obj);
			}
		});
		return featureItems;
	},
	setLOANDisclaimTextArea : function(feature){
			var obj = new Object();
			if(feature.profileFieldType != undefined){
				obj.profileFieldType = feature.profileFieldType;
			}
			obj.xtype = 'textfield';
			obj.labelWidth='100';
			//obj.maxWidth ='160';
			obj.fieldLabel = feature.name;
			obj.featureId = feature.value;
			obj.featureType = feature.featureType;
			obj.featureSubsetCode = feature.featureSubsetCode;
			obj.fieldStyle = 'width:10 !important';
			obj.columnWidth= 0.20;
			if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned){
				obj.checked = true;
			}					
		return obj;
	},
	setTextArea : function(featureId,elementId){
			var data = this.loadFeaturs();
			var obj = new Object();
			var filteredData = this.filterFeature(data,featureId);
			Ext.each(filteredData, function(feature, index) {
				
				if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned){
					obj.value = feature.featureValue;
				}	
			});
			obj.xtype = 'textareafield';
			obj.id = elementId;
			obj.featureId = featureId;
			obj.columnWidth= 0.75;
			obj.disabled = true;
			obj.grow = true;
			obj.margin = '0 0 10 104';		
		return obj;
	},
	setLOANRepayDisclaimer : function(){
		var data = this.loadFeaturs();
		var self = this;
		var filteredData = this.filterFeatures(data,'RD','LOANPRM');
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
			obj.columnWidth= 0.20;
			obj.id = feature.value;
			obj.name="repayDisclaimer";
			if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned){
				obj.checked = true;
				if(obj.featureId == 'LRTXTDISCLM'){
					obj.value = feature.featureValue;
				}
			}
			/*if(obj.featureId == 'LRDFDISCLM' ){
				obj.handler = function() {
					self.radioButtonClickHandler('LRDFDISCLM','LRCSDISCLM','repayDisclaimTextArea');
					}
			}*/
			fieldJson.push(obj);
			if(obj.featureId != 'LRTXTDISCLM'){
				featureItems.push(obj);
			}
			
		});
		return featureItems;
	},
	setLOANDrawDownDisclaimer : function(){
		var data = this.loadFeaturs();
		var self = this;
		var filteredData = this.filterFeatures(data,'LD','LOANPRM');
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
			obj.columnWidth= 0.20;
			obj.id = feature.value;
			obj.name ='drawDownDisclaimer';
			if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned){
				obj.checked = true;
				if(obj.featureId == 'LTXTDISCLM'){
					obj.value = feature.featureValue;
				}
			}
			if(obj.featureId == 'LDFDISCLM' || obj.featureId == 'LCSDISCLM'){
				obj.handler = function() {
					self.radioButtonClickHandler('LDFDISCLM','LCSDISCLM','drawdownDisclaimTxt');
					}
			}
			fieldJson.push(obj);
			if(obj.featureId != 'LTXTDISCLM'){
				featureItems.push(obj);
			}
			
		});
		return featureItems;
	},
	setInvestInvstOption : function(){
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'PO','INVESTPRM');
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
			obj.columnWidth= 0.33;
			if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned){
				obj.checked = true;
			}
			featureItems.push(obj);
			fieldJson.push(obj);
		});
		return featureItems;
	},
	setInvestOption : function(){
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'O','INVESTPRM');
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
			if(obj.featureId == 'IMAXD'){
				featureItems.push(self.setMaxTextField(feature));
			}
			else{
				featureItems.push(obj);
			}
		});
		return featureItems;
	},
	setInvestDisclaimer : function(){
		var data = this.loadFeaturs();
		var self = this;
		var filteredData = this.filterFeatures(data,'ID','INVESTPRM');
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
			obj.columnWidth= 0.20;
			obj.id = feature.value;
			obj.name = 'investDisclaim';
			if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned){
				obj.checked = true;
				if(obj.featureId == 'ITXTDISCLM'){
					obj.value = feature.featureValue;
				}
			}
			if(obj.featureId == 'IDFDISCLM' || obj.featureId == 'ICSDISCLM'){
				obj.handler = function() {
					self.radioButtonClickHandler('IDFDISCLM','ICSDISCLM','investDisclaimTextArea');
				}
			}
			fieldJson.push(obj);
			if(obj.featureId != 'ITXTDISCLM'){
				featureItems.push(obj);
			}
			
		});
		return featureItems;
	},
	setRedemptionDisclaimer : function(){
		var data = this.loadFeaturs();
		var self = this;
		var filteredData = this.filterFeatures(data,'RD','INVESTPRM');
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
			obj.columnWidth= 0.20;
			obj.name="redemptionDisclaimer";
			obj.id = feature.value;
			if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned){
				obj.checked = true;
				if(obj.featureId == 'IRTXTDISCLM'){
					obj.value = feature.featureValue;
				}
			}
			if(obj.featureId == 'IRDFDISCLM' || obj.featureId == 'IRCSDISCLM'){
				obj.handler = function() {
					self.radioButtonClickHandler('IRDFDISCLM','IRCSDISCLM','redemptionDisclaimTextArea');
				}
			}
			fieldJson.push(obj);
			if(obj.featureId != 'IRTXTDISCLM'){
				featureItems.push(obj);
			}
			
		});
		return featureItems;
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
	setDepositViewImages : function(){
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'V','DEPVW');
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
			obj.columnWidth= 0.31;
			if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned){
				obj.checked = true;
			}
			featureItems.push(obj);
			fieldJson.push(obj);
		});
		return featureItems;
	},
	setBRCheckImagesOptions : function(){
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'CHK','BRPRM');
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
			obj.columnWidth= 0.31;
			if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned){
				obj.checked = true;
			}
			featureItems.push(obj);
			fieldJson.push(obj);
		});
		return featureItems;
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
					xtype: 'panel',
					
					title: getLabel('brparams','BR Parameters'),
					collapsible : true,
					cls : 'xn-ribbon',
					collapseFirst : true,
					id : 'brParametersSection',
					items: [{
								xtype: 'checkboxgroup',
								itemId : 'BRFilterOptions',
								fieldLabel: getLabel('filteroptions','Filter Options'),
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
								fieldLabel: getLabel('others','Others'),
								layout:'column',
								width: '100%',
								padding: '0 0 0 10',
								vertical: true,
								items: thisClass.setBROtherOptions()
							},
							{
								xtype: 'checkboxgroup',
								featureId: 2,
								fieldLabel: getLabel('filterrs','Filter Restrictions'),
								layout:'column',
								width: '100%',
								padding: '0 0 0 10',
								vertical: true,
								items: thisClass.setFilterRestrictionsOptions('DRV','FR','BRPRM')
							},
							{
								xtype: 'checkboxgroup',
								featureId: 2,
								fieldLabel: getLabel('view','View'),
								layout:'column',
								width: '100%',
								padding: '0 0 0 10',
								vertical: true,
								items: thisClass.setBRViewOptions()
							},
							{
								xtype: 'checkboxgroup',
								featureId: 2,
								//fieldLabel: getLabel('view','View'),
								layout:'column',
								width: '100%',
								padding: '0 0 0 10',
								vertical: true,
								items: thisClass.setBRCheckImagesOptions()
							}
							
					]
			    }, {

					xtype: 'panel',
					
					title: getLabel('txninitparams','Transation Initiation Parameters'),
					collapsible : true,
					cls : 'xn-ribbon',
					collapseFirst : true,
					id : 'transactionParametersSection',
					items: [{
							xtype: 'checkboxgroup',
							featureId: 2,
							fieldLabel: getLabel('payoptions','Payment Options'),
							columns: 6,
							width: '100%',
							padding: '0 0 0 10',
							layout:'column',
							vertical: true,
							items: thisClass.setTXNPaymentOptions()
						}
					]
			    }]
	    }
	    
	  ];
	  
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
			        	  text:  getLabel('cancel','Cancel'),
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
		if (!this.isSectionChecked("ALTR")) {
			var transactionParametersSection = Ext.getCmp('transactionParametersSection');
			transactionParametersSection.hide();
		} else {
			var transactionParametersSection = Ext.getCmp('transactionParametersSection');
			transactionParametersSection.show();
		}
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