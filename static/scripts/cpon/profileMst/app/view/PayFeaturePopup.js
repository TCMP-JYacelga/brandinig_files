var fieldJson = [];
Ext.define('GCP.view.PayFeaturePopup', {
	extend: 'Ext.window.Window',
	xtype: 'payFeaturePopup',
	width : 1000,
	height : 650,
	title: 'Payment Options',
	layout: 'fit',
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
	setPaymentOptions: function() {
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'PO','');
		var featureItems = [];
		var tempOptions = document.getElementById('selectedPopupOptions').value;
		tempOptions = eval(tempOptions);		
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
			else 				
			{				
				if(null!=tempOptions)
				{					
					for(var i = 0; i < tempOptions.length; i++)
					{
						var tempObj = tempOptions[i].featureId;
						if(tempObj==feature.value)
						{
							obj.checked = true;	
						}					
					}
				}
			}			
			obj.featureType = feature.featureType;
			obj.featureSubsetCode = feature.featureSubsetCode;
			obj.columnWidth= 0.24;
			featureItems.push(obj);fieldJson.push(obj);
		});
		return featureItems;
	},
	setTemplatesOptions: function() {
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'T','');
		var featureItems = [];
		var tempOptions = document.getElementById('selectedPopupOptions').value;
		tempOptions = eval(tempOptions);		
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
			else 				
			{				
				if(null!=tempOptions)
				{					
					for(var i = 0; i < tempOptions.length; i++)
					{
						var tempObj = tempOptions[i].featureId;
						if(tempObj==feature.value)
						{
							obj.checked = true;	
						}					
					}
				}
			}			
			obj.featureType = feature.featureType;
			obj.featureSubsetCode = feature.featureSubsetCode;
			obj.columnWidth= 0.24;
			featureItems.push(obj);fieldJson.push(obj);
		});
		return featureItems;
	},
	setFileOptions: function() {
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'F','');
		var featureItems = [];	
		var tempOptions = document.getElementById('selectedPopupOptions').value;
		tempOptions = eval(tempOptions);
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
			else 				
			{				
				if(null!=tempOptions)
				{					
					for(var i = 0; i < tempOptions.length; i++)
					{
						var tempObj = tempOptions[i].featureId;
						if(tempObj==feature.value)
						{
							obj.checked = true;	
						}					
					}
				}
			}			
			obj.featureType = feature.featureType;
			obj.featureSubsetCode = feature.featureSubsetCode;
			obj.columnWidth= 0.24;
			featureItems.push(obj);fieldJson.push(obj);
		});
		return featureItems;
	},
	setOptions: function() {
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'O','');
		var featureItems = [];
		var tempOptions = document.getElementById('selectedPopupOptions').value;
		tempOptions = eval(tempOptions);		
		Ext.each(filteredData, function(feature, index) {
			var obj = new Object();
			if(feature.profileFieldType != undefined){
				obj.profileFieldType = feature.profileFieldType;
			}
			obj.boxLabel = feature.name;
			obj.featureId = feature.value;
			obj.value = feature.featureValue;
			if(feature.profileId != undefined && feature.profileId !=null){
				obj.checked = true;
			}
			else 				
			{				
				if(null!=tempOptions)
				{					
					for(var i = 0; i < tempOptions.length; i++)
					{
						var tempObj = tempOptions[i].featureId;
						if(tempObj==feature.value)
						{
							obj.checked = true;	
						}					
					}
				}
			}			
			obj.featureType = feature.featureType;
			obj.featureSubsetCode = feature.featureSubsetCode;
			obj.columnWidth= 0.24;
			featureItems.push(obj);fieldJson.push(obj);
		});
		return featureItems;
	},
	setScreenOptions:function(){
		var self=this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'SO','');
		var featureItems = [];
		var tempOptions = document.getElementById('selectedPopupOptions').value;
		tempOptions = eval(tempOptions);		
		Ext.each(filteredData, function(feature, index) {
			var obj = new Object();
			if(feature.profileFieldType != undefined){
				obj.profileFieldType = feature.profileFieldType;
			}
			obj.boxLabel = feature.name;
			obj.featureId = feature.value;
			obj.value = feature.featureValue;
			if(feature.profileId != undefined && feature.profileId !=null){
				obj.checked = true;
			}
			else 				
			{				
				if(null!=tempOptions)
				{					
					for(var i = 0; i < tempOptions.length; i++)
					{
						var tempObj = tempOptions[i].featureId;
						if(tempObj==feature.value)
						{
							obj.checked = true;	
						}					
					}
				}
			}			
			obj.featureType = feature.featureType;
			obj.featureSubsetCode = feature.featureSubsetCode;
			obj.columnWidth= 0.24;
			fieldJson.push(obj);
			if (obj.featureId == 'DRD') {
				featureItems.push(self.setDaysField(feature));
			} else {
				featureItems.push(obj);
			}
		});
		return featureItems;
	},
	setDaysField : function(feature) {
		var tempOptions = document.getElementById('selectedPopupOptions').value;
		tempOptions = eval(tempOptions);	
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
		obj.value= '0';
		if (feature.profileId != undefined && feature.profileId != null) {
			obj.value = feature.featureValue;
		}
		else 				
		{				
			if(null!=tempOptions)
			{					
				for(var i = 0; i < tempOptions.length; i++)
				{
					var tempObj = tempOptions[i].featureId;
					var tempVal = tempOptions[i].featureValue;
					if(tempObj==feature.value)
					{
						obj.value = tempVal;	
					}					
				}
			}
		}		
		if(feature.readOnly == true){
			obj.readOnly = true;
		}
		
		obj.maxLength = 3;
		obj.enforceMaxLength = true;
		panel.insert(0, {
					xtype : 'label',
					columnWidth : 0.34,
					text : getLabel('filterrs','Filter Restrictions'),
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
	setApprovalOptions:function() {
		var self=this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'AO','');
		var featureItems = [];
		var tempOptions = document.getElementById('selectedPopupOptions').value;
		tempOptions = eval(tempOptions);		
		Ext.each(filteredData, function(feature, index) {
			var obj = new Object();
			if(feature.profileFieldType != undefined){
				obj.profileFieldType = feature.profileFieldType;
			}
			obj.boxLabel = feature.name;
			obj.featureId = feature.value;
			obj.value = feature.featureValue;
			if(feature.profileId != undefined && feature.profileId !=null){
				obj.checked = true;
			}
			else 				
			{				
				if(null!=tempOptions)
				{					
					for(var i = 0; i < tempOptions.length; i++)
					{
						var tempObj = tempOptions[i].featureId;
						if(tempObj==feature.value)
						{
							obj.checked = true;	
						}					
					}
				}
			}			
			obj.featureType = feature.featureType;
			obj.featureSubsetCode = feature.featureSubsetCode;
			obj.columnWidth= 0.24;
			if(obj.featureId=='MC')
			{
				obj.checked = true;
				obj.readOnly=true;
			}
			
			if(obj.featureId =='APPRPASSTHRU'){
				if(passFlag == 'Y')
				obj.disabled=false;
				else 
				obj.disabled=true;
			}
			featureItems.push(obj);
			/*if(obj.featureId == 'DFAO')
				featureItems.push(self.setAOComboBox(feature));
			else
				featureItems.push(obj);*/
			fieldJson.push(obj);
				
		});
		return featureItems;
	},
	setAOComboBox : function(feature){
		var tempOptions = document.getElementById('selectedPopupOptions').value;
		tempOptions = eval(tempOptions);		
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
							{"featureId":"MC", "name":"Maker Checker"},
							{"featureId":"SV", "name":"Signatory Verification"},
							{"featureId":"AV", "name":"Authorization Verification"}
						  ],
						fields: ['featureId', 'name']
				});
			obj.displayField= 'name';
			obj.valueField= 'featureId';
			if(feature.isAssigned != undefined && feature.featureValue !=null && feature.featureValue !='null' && feature.isAssigned){
				obj.value = feature.featureValue;
			}
			else 				
			{				
				if(null!=tempOptions)
				{					
					for(var i = 0; i < tempOptions.length; i++)
					{
						var tempObj = tempOptions[i].featureId;
						var tempVal = tempOptions[i].featureValue;
						if(tempObj==feature.value)
						{
							obj.value = tempVal;	
						}					
					}
				}
			}	
			panel.insert(0,obj);
		return panel;
	},
	setExportOptions: function() {
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'E','');
		var featureItems = [];
		var tempOptions = document.getElementById('selectedPopupOptions').value;
		tempOptions = eval(tempOptions);		
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
			else 				
			{				
				if(null!=tempOptions)
				{					
					for(var i = 0; i < tempOptions.length; i++)
					{
						var tempObj = tempOptions[i].featureId;
						if(tempObj==feature.value)
						{
							obj.checked = true;	
						}					
					}
				}
			}			
			obj.featureType = feature.featureType;
			obj.featureSubsetCode = feature.featureSubsetCode;
			obj.columnWidth= 0.24;
			featureItems.push(obj);fieldJson.push(obj);
		});
		return featureItems;
	},
	setPaymentPackages:function(){
		var me=this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'PP','');
		var featureItems = [];
		var tempOptions = document.getElementById('selectedPopupOptions').value;
		tempOptions = eval(tempOptions);		
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
			else 				
			{				
				if(null!=tempOptions)
				{					
					for(var i = 0; i < tempOptions.length; i++)
					{
						var tempObj = tempOptions[i].featureId;
						if(tempObj==feature.value)
						{
							obj.checked = true;	
						}					
					}
				}
			}			
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
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'PWD','');
		var featureItems = [];
		var tempOptions = document.getElementById('selectedPopupOptions').value;
		tempOptions = eval(tempOptions);	
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
			else 				
			{				
				if(null!=tempOptions)
				{					
					for(var i = 0; i < tempOptions.length; i++)
					{
						var tempObj = tempOptions[i].featureId;
						if(tempObj==feature.value)
						{
							obj.checked = true;	
						}					
					}
				}
			}			
			/*if(obj.featureId =='EDITSTNDWORKFLOW' || obj.featureId =='NEWWORKFLOWDEF')
				obj.disabled=true;*/
				
			obj.featureType = feature.featureType;
			obj.featureSubsetCode = feature.featureSubsetCode;
			obj.columnWidth= 0.24;
			featureItems.push(obj);fieldJson.push(obj);
		});
		return featureItems;
	},
	setBRViewComboBox : function(feature){
		var tempOptions = document.getElementById('selectedPopupOptions').value;
		tempOptions = eval(tempOptions);	
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
							{"featureId":"DGE", "name":"Widget"},
							{"featureId":"ID", "name":"Grid"}
						  ],
						fields: ['featureId', 'name']
				});
			obj.displayField= 'name';
			obj.valueField= 'featureId';
			if(feature.isAssigned != undefined && feature.featureValue !=null && feature.featureValue !='null' && feature.isAssigned){
				obj.value = feature.featureValue;
			}
			else 				
			{
				if(null!=tempOptions)
				{					
					for(var i = 0; i < tempOptions.length; i++)
					{
						var tempObj = tempOptions[i].featureId;
						var tempVal = tempOptions[i].featureValue;
						if(tempObj==feature.value)
						{
							obj.value = tempVal;	
						}					
					}
				}
			}
			panel.insert(0,{xtype: 'label',columnWidth:0.2,text: feature.name,padding:'5 0 0 0',itemId:obj.featureId+'Label'});
			panel.insert(1,obj);
		return panel;
	},
	setViewOptions: function() {
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'V','');
		var featureItems = [];
		var tempOptions = document.getElementById('selectedPopupOptions').value;
		tempOptions = eval(tempOptions);		
		Ext.each(filteredData, function(feature, index) {
			var obj = new Object();
			if(feature.profileFieldType != undefined){
				obj.profileFieldType = feature.profileFieldType;
			}
			obj.boxLabel = feature.name;
			obj.featureId = feature.value;
			obj.value = feature.featureValue;
			obj.id = obj.featureId;
			if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned){
				obj.checked = true;
			}
			else 				
			{				
				if(null!=tempOptions)
				{					
					for(var i = 0; i < tempOptions.length; i++)
					{
						var tempObj = tempOptions[i].featureId;
						if(tempObj==feature.value)
						{
							obj.checked = true;	
						}					
					}
				}
			}			
			obj.featureType = feature.featureType;
			obj.featureSubsetCode = feature.featureSubsetCode;
			obj.columnWidth= 0.24;
			
		/*	if(obj.featureId == 'ID' || obj.featureId == 'DGE'){
				
				obj.handler = function() {
					self.comboBoxHandler();
				}
			}*/
			featureItems.push(obj);
			/*if(obj.featureId == 'DFUL')
				featureItems.push(self.setBRViewComboBox(feature));
			else
				featureItems.push(obj);*/
			
				fieldJson.push(obj);
		});
		return featureItems;
	},
	 
	comboBoxHandler : function(){
		var GRIV = Ext.getCmp('ID');
		var WIDV = Ext.getCmp('DGE');
		
		if(WIDV.getValue() == false && GRIV.getValue() == false)
		{
			WIDV.checked = true;
			WIDV.setValue(true);
		}
		
		if(WIDV.getValue() == true && GRIV.getValue() == false)
		{
			WIDV.setDisabled(true);
		}
		else if(GRIV.getValue() == true && WIDV.getValue() == false)
		{
			GRIV.setDisabled(true);
		}
		else
		{
			WIDV.setDisabled(false);
			GRIV.setDisabled(false);
		}
		
		
		var element = Ext.getCmp('DFUL');
		if(WIDV.getValue() && GRIV.getValue()){
			element.setDisabled(false);
			if(element.getValue() == null || element.getValue() == '')
			{
				element.setValue('DGE');
			}
		}
		else{
			element.setDisabled(true);
			element.setValue('');
		}
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
				if(feature.isAssigned != undefined && feature.isAssigned !=null && feature.isAssigned){
					obj.value = feature.featureValue;
				}
				obj.maxLength='3';
				obj.enforceMaxLength = true;
				panel.insert(0,obj);
				panel.insert(1,{xtype: 'label',columnWidth:0.3,text: getLabel('days','Days'),padding:'5 0 0 0'});
			return panel;
	},
		loadFeaturs: function() {
			return featureData;
		},
		filterFeatures: function(data,featureType,subsetCode) {
			
			   var allFeatures = new Ext.util.MixedCollection();
			   allFeatures.addAll(data);
			   var featureFilter = new Ext.util.Filter({
					filterFn: function(item) {
						return (item.featureType == featureType);
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
						items: [{
									xtype: 'checkboxgroup',
									itemId : 'paymentOptions',
									fieldLabel: getLabel(' ',' '),
									labelSeparator:' ',
									width: '100%',
									padding: '0 0 0 10',
									vertical: true,
									layout:'column',
									items: thisClass.setPaymentOptions()
								},{
									xtype: 'checkboxgroup',
									featureId: 2,
									fieldLabel: getLabel('templates','Templates'),
									width: '100%',
									id:'templatesSection',
									padding: '0 0 0 10',
									layout:'column',
									vertical: true,
									items: thisClass.setTemplatesOptions()
								},{
									xtype: 'checkboxgroup',
									featureId: 2,
									fieldLabel: getLabel('fileOptions','File Options'),
									labelStyle : 'vertical-align: top !important;',
									layout:'column',
									width: '100%',
									padding: '0 0 0 10',
									vertical: true,
									items: thisClass.setFileOptions()
								},{
									xtype: 'checkboxgroup',
									featureId: 2,
									fieldLabel: getLabel('options','Options'),
									layout:'column',
									width: '100%',
									padding: '0 0 0 10',
									vertical: true,
									items: thisClass.setOptions()
								},{
									xtype: 'checkboxgroup',
									itemId : 'options',
									fieldLabel: getLabel('approvalOptions','Approval Options'),
									width: '100%',
									padding: '0 0 0 10',
									vertical: true,
									layout:'column',
									items: thisClass.setApprovalOptions()
								},{
									xtype: 'checkboxgroup',
									featureId: 2,
									fieldLabel: getLabel('screenOptions','Screen Options'),
									width: '100%',
									padding: '0 0 0 10',
									layout:'column',
									vertical: true,
									items: thisClass.setScreenOptions()
								},{
									xtype: 'checkboxgroup',
									featureId: 2,
									fieldLabel: getLabel('view','View'),
									layout:'column',
									width: '100%',
									padding: '0 0 0 10',
									vertical: true,
									items: thisClass.setViewOptions()
								},{
									xtype: 'checkboxgroup',
									itemId : 'passthroughOptions',
									fieldLabel: getLabel('exportOptions','Export Options'),
									width: '100%',
									padding: '0 0 0 10',
									vertical: true,
									layout:'column',
									items: thisClass.setExportOptions()
								},{
									xtype: 'checkboxgroup',
									layout:'column',
									itemId:'paymentPackages',
									fieldLabel: getLabel('paymentPackages','Payment Methods'),
									width: '100%',
									padding: '0 0 0 10',
									vertical: true,
									items: thisClass.setPaymentPackages()											
								},{
									xtype: 'checkboxgroup',
									layout:'column',
									itemId:'paymentWorkflowDefinition',
									fieldLabel: getLabel('paymentWorkflowDefinition','Payment Workflow Definition'),
									width: '100%',
									padding: '0 0 0 10',
									vertical: true,
									items: thisClass.setPWDOptions()											
								}]
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
		if(pageMode == 'VIEW' || pageMode == 'SUBMIT'){
			this.disabledAllElement();
		}
	    if(viewPageMode == 'VIEW_CHANGES'){
			this.setOldNewValueClass();
		}
	
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
	showCheckedSection : function() {
		if (!this.isSectionChecked("TPL")) {
			var templatesSection = Ext.getCmp('templatesSection');
			templatesSection.hide();
		} else {
			var templatesSection = Ext.getCmp('templatesSection');
			templatesSection.show();
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
		saveItems : function() {
			var me = this;
			Ext.each(fieldJson, function(field, index) {
				var featureId = field.featureId;
				var element = me.down('checkboxfield[featureId='+featureId+']');
				if(element != null && element != undefined){
					field.featureValue = element.getValue();
				}else if (featureId == 'DFAO') {
					var element = me.down('combo[featureId=' + featureId + ']');
					if('null' != element.getValue() && null != element.getValue() && '' != element.getValue() ){
						field.featureValue = element.getValue();
					}
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
			});
			if (!Ext.isEmpty(me.fnCallback)
						&& typeof me.fnCallback == 'function') {
					me.fnCallback(fieldJson);
					me.close();
				}
		}	
});