var fieldJson = [];
Ext.define('GCP.view.OthersView', {
	extend: 'Ext.panel.Panel',
	xtype: 'othersPanel',
	width : 600,
	border: 1,
	height : 400,
	layout: 'fit',
	overflowY: 'auto',
	cls : 'border',
	config: {
		fnCallback : null,
		profileId : null,
		featureType : null,
		module : null,
		title : null
	},
	//listeners :  
	loadFeaturs: function() {
	var me = this;
		if(mode === "VIEW"){
				Ext.Ajax.request({
					url : 'services/userCategory/previlige.json',
					method : 'POST',
					async: false,
					params : { module: 'OTH',categoryId:userCategory},
					success : function(response) {
						featureData = Ext.JSON.decode(response.responseText);
						return featureData; 
					},
					failure : function() {
						var errMsg = "";
						Ext.MessageBox.show({
									title : getLabel(
											'instrumentErrorPopUpTitle',
											'Error'),
									msg : getLabel('instrumentErrorPopUpMsg',
											'Error while fetching data..!'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
					}
				});

		}
		return featureData;
	},
	filterFeatures: function(data,subsetCode) {
	   var allFeatures = new Ext.util.MixedCollection();
	   allFeatures.addAll(data);
	   var featureFilter = new Ext.util.Filter({
			filterFn: function(item) {
				return item.subsetCode == subsetCode;
			}
		});
		var featurs = allFeatures.filter(featureFilter);
		return featurs.items;
	},
	getBooleanvalue : function(strValue)
	{
		if(strValue == 'Y' || strValue == true)
		{
			return true;
		}
		else
		{
			return false;
		}
	},
	setColumnHeader : function()
	{
		var featureItems = [];
		featureItems.push({xtype: 'label',columnWidth:0.40,text: "Type",padding:'5 0 0 0',cls:'boldText'});
		featureItems.push({xtype: 'label',columnWidth:0.20,text: "View",padding:'5 0 0 5',cls:'boldText'});
		featureItems.push({xtype: 'label',columnWidth:0.20,text: "Edit",padding:'5 0 0 5',cls:'boldText'});
		featureItems.push({xtype: 'label',columnWidth:0.20,text: "Auth",padding:'5 0 0 5',cls:'boldText'});
		return featureItems;
	},
	setPanelHeader : function(id, title)
	{
		var featureItems = [];
		featureItems.push({xtype: 'label',columnWidth:0.40,text: title,padding:'5 0 0 10',cls:'boldText'});
		featureItems.push({xtype: 'button',columnWidth:0.20,icon: "/gcpuscash/static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 50',width : 10, height : 20, itemId : id+"_viewIcon", border : 0,cls:'btn'});
		featureItems.push({xtype: 'button',columnWidth:0.20,icon: "/gcpuscash/static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 95',width : 15, height : 20, itemId : id+"_editIcon", border : 0,cls:'btn',style:{
         color: 'red'
     }});
		featureItems.push({xtype: 'button',columnWidth:0.20,icon: "/gcpuscash/static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 95',width : 15, height : 20, itemId : id+"_authIcon", border : 0,cls:'btn'});
		return featureItems;
	},
	setPriviligeMenu : function(feature,MODE)
	{
		var obj = new Object();
		obj.xtype="checkbox";
		obj.columnWidth='0.20';
		obj.padding='0 0 0 0';
		obj.itemId = feature.featureWeight+"_"+MODE;
		obj.featureWeight = feature.featureWeight;
		obj.mode = MODE;
		obj.rmSerial = feature.rmSerial;
		obj.border = 1;
		obj.cls = 'cellContent';
		if(mode === "VIEW"){
			obj.readOnly = true;
		}
		if(MODE == 'VIEW')
		{
			obj.hidden = !this.getBooleanvalue(feature.rmForView);
			obj.checked = this.getBooleanvalue(feature.canView);
		}
		else if(MODE == 'EDIT')
		{
			obj.hidden = !this.getBooleanvalue(feature.rmForEdit);
			obj.checked = this.getBooleanvalue(feature.canEdit);
		}
		else if(MODE == 'AUTH')
		{
			obj.hidden = !this.getBooleanvalue(feature.rmForAuth);
			obj.checked = this.getBooleanvalue(feature.canAuth);
		}
		fieldJson.push(obj);
		return obj;
	},
	
	setPositivePayOptions : function()
	{
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'POSITIVEPAYPRM');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
			var panel = Ext.create('Ext.panel.Panel', {
				columnWidth:1,
				layout:'column'
			});
			panel.insert({xtype: 'label',columnWidth:0.40,text: feature.parentField,padding:'5 0 0 10'});
			panel.insert(self.setPriviligeMenu(feature,"VIEW"));
			panel.insert(self.setPriviligeMenu(feature,"EDIT"));
			panel.insert(self.setPriviligeMenu(feature,"AUTH"));
			featureItems.push(panel);
		});
		return featureItems;
	},
	setIncomingACHOptions : function()
	{
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'INCOMINGACHPRM');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
			var panel = Ext.create('Ext.panel.Panel', {
				columnWidth:1,
				layout:'column'
			});
			panel.insert({xtype: 'label',columnWidth:0.40,text: feature.parentField,padding:'5 0 0 10'});
			panel.insert(self.setPriviligeMenu(feature,"VIEW"));
			panel.insert(self.setPriviligeMenu(feature,"EDIT"));
			panel.insert(self.setPriviligeMenu(feature,"AUTH"));
			featureItems.push(panel);
		});
		return featureItems;
	},
	setChecksOptions: function()
	{
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'CHECKPRM');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
			var panel = Ext.create('Ext.panel.Panel', {
				columnWidth:1,
				layout:'column'
			});
			panel.insert({xtype: 'label',columnWidth:0.40,text: feature.parentField,padding:'5 0 0 10'});
			panel.insert(self.setPriviligeMenu(feature,"VIEW"));
			panel.insert(self.setPriviligeMenu(feature,"EDIT"));
			panel.insert(self.setPriviligeMenu(feature,"AUTH"));
			featureItems.push(panel);
		});
		return featureItems;
	},
	setReportSchedulingOptions: function()
	{
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'BKREPORTPRM');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
			var panel = Ext.create('Ext.panel.Panel', {
				columnWidth:1,
				layout:'column',
				cls : 'border'
			});
			panel.insert({xtype: 'label',columnWidth:0.40,text: feature.parentField,padding:'5 0 0 10'});
			panel.insert(self.setPriviligeMenu(feature,"VIEW"));
			panel.insert(self.setPriviligeMenu(feature,"EDIT"));
			panel.insert(self.setPriviligeMenu(feature,"AUTH"));
			featureItems.push(panel);
		});
		return featureItems;
	},
	initComponent: function() {
	    var thisClass = this;
		thisClass.items = [{
	    	xtype: 'container',
			items: [
					{
						xtype: 'panel',
						items:[
						{
							xtype: 'panel',
							id : 'othColumnHeader',
							layout:'column',
							cls: 'cellContent',
							margin : '5 5 5 5',
							padding: '5 5 5 5',
							items: thisClass.setColumnHeader()
						},
						{
							xtype: 'panel',
							id : 'pPayHeader',
							layout:'column',
							cls:'red-bg',
							margin : '4 0 0 0',
							items: thisClass.setPanelHeader('pPayHeader','Positive Pay')
						},
						{
							xtype: 'panel',
							//title: getLabel('positivePay','Positive Pay'),
							titleAlign : "left", 
							//collapsible : true,
							cls : 'xn-ribbon',
							collapseFirst : true,
							id : 'positivePaySection',
							layout:'column',
							items: thisClass.setPositivePayOptions()	
							
						},
						{
							xtype: 'panel',
							id : 'incomingHeader',
							layout:'column',
							cls:'red-bg',
							margin : '4 0 0 0',
							items: thisClass.setPanelHeader('incomingHeader','Incoming ACH')
						},
						{
							xtype: 'panel',
							//title: getLabel('incomingAch','Incoming ACH'),
							//collapsible : true,
							//cls : 'xn-ribbon',
							//collapseFirst : true,
							id : 'incomingAchSection',
							layout:'column',
							items: thisClass.setIncomingACHOptions()	
						},
						{
							xtype: 'panel',
							id : 'checksHeader',
							layout:'column',
							cls:'red-bg',
							margin : '4 0 0 0',
							items: thisClass.setPanelHeader('checksHeader','Checks')
						},
						{
							xtype: 'panel',
							//title: getLabel('checks','Checks'),
							//collapsible : true,
							cls : 'xn-ribbon',
							collapseFirst : true,
							id : 'checksSection',
							layout:'column',
							items: thisClass.setChecksOptions()	
						},
						{
							xtype: 'panel',
							id : 'reportHeader',
							cls:'red-bg',
							margin : '4 0 0 0',
							layout:'column',
							items: thisClass.setPanelHeader('reportHeader','Report Scheduling')
						},
						{
							xtype: 'panel',
							//title: getLabel('reportScheduling','Report Scheduling'),
							//collapsible : true,
							//cls : 'xn-ribbon',
							collapseFirst : true,
							id : 'reportSchedulingSection',
							layout:'column',
							items: thisClass.setReportSchedulingOptions()	
						}]
					}
					]
			    
			    }];
		this.callParent(arguments);
	},
	saveItems : function() {	
					var me = this;
					var viewSerials = {};
					var authSerials = {};
					var editSerials = {};
					Ext.each(fieldJson, function(field, index) {
						var featureId = field.itemId;
						var element = me.down('checkboxfield[itemId='+featureId+']');
						if(element != null && element != undefined && !element.hidden){
											//element.boxLabelCls =element.boxLabelCls+" newFieldValue";
									var mode = element.mode;
									if('VIEW' == mode){
										viewSerials[field.rmSerial] = element.getValue();
									}
									if('EDIT' == mode){
										editSerials[field.rmSerial] = element.getValue();
									}
									if('AUTH' == mode){
										authSerials[field.rmSerial] = element.getValue();
									}
							}
			});
				if (!Ext.isEmpty(me.fnCallback)
						&& typeof me.fnCallback == 'function') {
					me.fnCallback(viewSerials,authSerials,editSerials);
					me.close();
				}
			}
});