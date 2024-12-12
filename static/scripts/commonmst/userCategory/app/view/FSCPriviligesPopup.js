var fieldJson = [];
Ext.define('GCP.view.FSCPriviligesPopup', {
	extend: 'Ext.window.Window',
	xtype: 'fscPriviligesPopup',
	width : 700,
	height : 500,
	title: 'FSC Privileges',
	config: {
		modal : true,
		resizable:false,
		draggable : true,
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
	var me = this;
		if(mode === "VIEW"){
				Ext.Ajax.request({
					url : 'services/userCategory/previlige.json',
					method : 'POST',
					async: false,
					params : { module: '06',categoryId:userCategory},
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
		featureItems.push({xtype: 'label',columnWidth:0.40,text: "Type",padding:'0 0 0 0',cls:'boldText background'});
		featureItems.push({xtype: 'label',columnWidth:0.20,text: "View",padding:'0 0 0 5',cls:'boldText background'});
		featureItems.push({xtype: 'label',columnWidth:0.20,text: "Edit",padding:'0 0 0 5',cls:'boldText background'});
		featureItems.push({xtype: 'label',columnWidth:0.20,text: "Auth",padding:'0 0 0 5',cls:'boldText background'});
		return featureItems;
	},
	setPanelHeader : function(id, title)
	{
		var featureItems = [];
		featureItems.push({xtype: 'label',columnWidth:0.40,text: title,padding:'5 0 0 10',cls:'boldText'});
		featureItems.push({xtype: 'button',columnWidth:0.20,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 55',width : 10, height : 20, itemId : id+"_viewIcon", border : 0,cls:'btn'});
		featureItems.push({xtype: 'button',columnWidth:0.20,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 113',width : 15, height : 20, itemId : id+"_editIcon", border : 0,cls:'btn'});
		featureItems.push({xtype: 'button',columnWidth:0.20,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 110',width : 15, height : 20, itemId : id+"_authIcon", border : 0,cls:'btn'});
		return featureItems;
	},
	setPriviligeMenu : function(feature,MODE)
	{
		var obj = new Object();
		if(MODE == 'VIEW')
		{
			var i=!this.getBooleanvalue(feature.rmForView);
			//obj.hidden = !this.getBooleanvalue(feature.rmForView);
			obj.checked = this.getBooleanvalue(feature.canView);
		}
		else if(MODE == 'EDIT')
		{	
			var i=!this.getBooleanvalue(feature.rmForEdit);
			//obj.hidden = !this.getBooleanvalue(feature.rmForEdit);
			obj.checked = this.getBooleanvalue(feature.canEdit);
		}
		else if(MODE == 'AUTH')
		{
			var i= !this.getBooleanvalue(feature.rmForAuth);
			//obj.hidden = !this.getBooleanvalue(feature.rmForAuth);
			obj.checked = this.getBooleanvalue(feature.canAuth);
		}
		if(i === false){
			obj.xtype="checkbox";
			obj.cls = 'cellContent';
		}
		else {
			obj.xtype="label";
			obj.text=".";
			obj.cls = 'whitetext';
			//obj.hidden = true;
		}
		obj.columnWidth='0.20';
		obj.padding='0 0 0 0';
		obj.itemId = feature.featureWeight+"_"+MODE;
		obj.featureWeight = feature.featureWeight;
		obj.mode = MODE;
		obj.rmSerial = feature.rmSerial;
		obj.border = 1;
		if(null != obj.checked && undefined != obj.checked)
		{
			obj.defVal = obj.checked;
		}
		if(mode === "VIEW"){
			obj.readOnly = true;
		}
		fieldJson.push(obj);
		return obj;
	},
	
	setFSCSetup : function()
	{
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'FSCSETUP');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
			var panel = Ext.create('Ext.panel.Panel', {
				columnWidth:1,
				layout:'column',
				bodyStyle: {
					background: ' #FAFAFA '
				}
			});
			panel.insert({xtype: 'label',columnWidth:0.40,text: feature.featureName,padding:'5 0 0 10'});
			panel.insert(self.setPriviligeMenu(feature,"VIEW"));
			panel.insert(self.setPriviligeMenu(feature,"EDIT"));
			panel.insert(self.setPriviligeMenu(feature,"AUTH"));
			featureItems.push(panel);
		});
		
		
		return featureItems;
	},
	setTransactions : function()
	{
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'TXNPRM');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
			var panel = Ext.create('Ext.panel.Panel', {
				columnWidth:1,
				layout:'column',
				bodyStyle: {
					background: ' #FAFAFA '
				}
			});
			panel.insert({xtype: 'label',columnWidth:0.40,text: feature.featureName,padding:'5 0 0 10'});
			panel.insert(self.setPriviligeMenu(feature,"VIEW"));
			panel.insert(self.setPriviligeMenu(feature,"EDIT"));
			panel.insert(self.setPriviligeMenu(feature,"AUTH"));
			featureItems.push(panel);
		});
		return featureItems;
	},
	setFileOptions : function()
	{
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'FILEOPPRM');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
			var panel = Ext.create('Ext.panel.Panel', {
				columnWidth:1,
				layout:'column',
				bodyStyle: {
					background: ' #FAFAFA '
				}
			});
			panel.insert({xtype: 'label',columnWidth:0.40,text: feature.featureName,padding:'5 0 0 10'});
			panel.insert(self.setPriviligeMenu(feature,"VIEW"));
			panel.insert(self.setPriviligeMenu(feature,"EDIT"));
			panel.insert(self.setPriviligeMenu(feature,"AUTH"));
			featureItems.push(panel);
		});
		return featureItems;
	},
	showCheckedSection : function(){
		var fsc = document.getElementById("chkImg_fscSetup");
		var txn = document.getElementById("chkImg_txn");
		var query = document.getElementById("chkImg_fileupload");
		
		
		if (fsc.src.indexOf("icon_unchecked.gif") > -1)
		{
			var fscHeader = Ext.getCmp('fscHeader');
			var fscSection = Ext.getCmp('fscSection');
			fscSection.hide();
			fscHeader.hide();
		}
		else
		{
			var fscHeader = Ext.getCmp('fscHeader');
			fscHeader.show();
			var fscSection = Ext.getCmp('fscSection');
			fscSection.show();				
		}
		
		
		if (txn.src.indexOf("icon_unchecked.gif") > -1)
		{
			var txnHeader = Ext.getCmp('ftxnsHeader');
			var txnSection = Ext.getCmp('ftxnsSection');
			txnSection.hide();
			txnHeader.hide();
		}
		else
		{
			var txnHeader = Ext.getCmp('ftxnsHeader');
			txnHeader.show();
			var txnSection = Ext.getCmp('ftxnsSection');
			txnSection.show();				
		}
		
		if (query.src.indexOf("icon_unchecked.gif") > -1)
		{
			var queryHeader = Ext.getCmp('flupHeader');
			var querySection = Ext.getCmp('flupSection');
			querySection.hide();
			queryHeader.hide();
		}
		else
		{
			var queryHeader = Ext.getCmp('flupHeader');
			var querySection = Ext.getCmp('flupSection');
			querySection.show();
			queryHeader.show();
			
		}
		
	},
	initComponent: function() {
	    var thisClass = this;
		thisClass.items = [{
	    	xtype: 'container',
			cls : 'border',
			items:[{
							xtype: 'panel',
							id : 'fscColumnHeader',
							layout:'column',
							cls: 'alignCenter',
							margin : '5 5 5 5',
							padding: '5 5 5 5',
							items: thisClass.setColumnHeader()
					},{
							xtype:'panel',
							overflowY:'auto',
							height:355,
							items:[{
									xtype: 'panel',
									id : 'fscHeader',
									layout:'column',
									cls:'red-bg',
									margin : '4 0 0 0',
									items: thisClass.setPanelHeader('fscHeader','FSC Setup')
								},
								{
									xtype: 'panel',
									titleAlign : "left", 
									cls : 'xn-ribbon',
									collapseFirst : true,
									id : 'fscSection',
									layout:'column',
									items: thisClass.setFSCSetup()	
									
								},
								{
									xtype: 'panel',
									id : 'ftxnsHeader',
									layout:'column',
									cls:'red-bg',
									margin : '4 0 0 0',
									items: thisClass.setPanelHeader('ftxnsHeader','Transactions')
								},
								{
									xtype: 'panel',
									titleAlign : "left", 
									cls : 'xn-ribbon',
									collapseFirst : true,
									id : 'ftxnsSection',
									layout:'column',
									items: thisClass.setTransactions()	
									
								},
								{
									xtype: 'panel',
									id : 'flupHeader',
									layout:'column',
									cls:'red-bg',
									margin : '4 0 0 0',
									items: thisClass.setPanelHeader('flupHeader','Import')
								},
								{
									xtype: 'panel',
									titleAlign : "left", 
									cls : 'xn-ribbon',
									collapseFirst : true,
									id : 'flupSection',
									layout:'column',
									items: thisClass.setFileOptions()	
									
								}]
					}]
			    }];
		
			if(mode === "VIEW"){
				thisClass.buttons=[
			          { 
			        	  text: 'Cancel',
			        	  cls : 'ux_button-padding ux_button-background-color',
			        	  handler : function(btn,opts) {
			        		thisClass.close();
			        				}
			          }
			        ];
			}
			else
			{
				thisClass.buttons=[
			          { 
			        	  text: 'Submit',
			        	  cls : 'ux_button-padding ux_button-background-color ux_largemargin-right',
			        	  handler : function(btn,opts) {
			        	  	thisClass.saveItems();
			        		thisClass.close();
			        				}
			          },
			          { 
			        	  text: 'Cancel',
			        	  cls : 'ux_button-padding ux_button-background-color',
			        	  handler : function(btn,opts) {
			        		thisClass.close();
			        				}
			          }
			        ];
			}
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