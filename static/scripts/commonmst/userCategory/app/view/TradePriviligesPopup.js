var fieldJson = [];
Ext.define('GCP.view.TradePriviligesPopup', {
	extend: 'Ext.window.Window',
	xtype: 'tradePriviligesPopup',
	width : 700,
	height : 500,
	title: 'eTrade Privileges',
	config: {
		resizable:false,
		modal : true,
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
					params : { module: '09',categoryId:userCategory},
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
	
	setETradeSetupRights : function()
	{
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'TRADEPRM');
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
		filteredData = this.filterFeatures(data,'PAYMENTPRM');
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
	setETradeImportSetupRights : function()
	{
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'TRADEIMPPRM');
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
	setETradeExportSetupRights : function()
	{
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'TRADEEXPPRM');
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
	setETradeLoansRights : function()
	{
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'TRADELOANPRM');
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
		var chk_eTradeSetup = document.getElementById("chkImg_eTradeSetup");
		var chk_eTradeImpSetupHeader = document.getElementById("chkImg_impTransactions");
		var chk_eTradeExpSetupHeader = document.getElementById("chkImg_expTransactions");
		var chk_loans = document.getElementById("chkImg_eTradeLoans");
				
		if (chk_eTradeSetup.src.indexOf("icon_unchecked.gif") > -1)
		{
			var eTradeSetupHeader = Ext.getCmp('eTradeSetupHeader');
			var eTradeSetupSection = Ext.getCmp('eTradeSetupSection');
			eTradeSetupSection.hide();
			eTradeSetupHeader.hide();
		}
		else
		{
			var eTradeSetupHeader = Ext.getCmp('eTradeSetupHeader');
			eTradeSetupHeader.show();
			var eTradeSetupSection = Ext.getCmp('eTradeSetupSection');
			eTradeSetupSection.show();				
		}
		
		if (chk_eTradeImpSetupHeader.src.indexOf("icon_unchecked.gif") > -1)
		{
			var eTradeImpSetupHeader = Ext.getCmp('eTradeImpSetupHeader');
			var eTradeImpSetupSection = Ext.getCmp('eTradeImpSetupSection');
			eTradeImpSetupHeader.hide();
			eTradeImpSetupSection.hide();
		}
		else
		{
			var eTradeImpSetupHeader = Ext.getCmp('eTradeImpSetupHeader');
			var eTradeImpSetupSection = Ext.getCmp('eTradeImpSetupSection');
			eTradeImpSetupHeader.show();
			eTradeImpSetupSection.show();
		}
		
		if (chk_eTradeExpSetupHeader.src.indexOf("icon_unchecked.gif") > -1)
		{
			var eTradeExpSetupHeader = Ext.getCmp('eTradeExpSetupHeader');
			var eTradeExpSetupSection = Ext.getCmp('eTradeExpSetupSection');
			eTradeExpSetupHeader.hide();
			eTradeExpSetupSection.hide();
		}
		else
		{
			var eTradeExpSetupHeader = Ext.getCmp('eTradeExpSetupHeader');
			var eTradeExpSetupSection = Ext.getCmp('eTradeExpSetupSection');
			eTradeExpSetupHeader.show();
			eTradeExpSetupSection.show();
		}
		
		if (chk_loans.src.indexOf("icon_unchecked.gif") > -1)
		{
			var eTradeLoansHeader = Ext.getCmp('eTradeLoansHeader');
			var eTradeLoansSection = Ext.getCmp('eTradeLoansSection');
			eTradeLoansHeader.hide();
			eTradeLoansSection.hide();
		}
		else
		{
			var eTradeLoansHeader = Ext.getCmp('eTradeLoansHeader');
			var eTradeLoansSection = Ext.getCmp('eTradeLoansSection');
			eTradeLoansHeader.show();
			eTradeLoansSection.show();
		}
				
	},
	initComponent: function() {
	    var thisClass = this;
		thisClass.items = [{
	    	xtype: 'container',
			cls : 'border',
			items:[{
							xtype: 'panel',
							id : 'tradeColumnHeader',
							layout:'column',
							cls: 'alignCenter',
							margin : '5 5 5 5',
							padding: '5 5 5 5',
							items: thisClass.setColumnHeader()
					},{
							xtype:'panel',
							overflowY:'auto',
							height:350,
							items:[{
								xtype: 'panel',
								id : 'eTradeSetupHeader',
								layout:'column',
								cls:'red-bg',
								margin : '4 0 0 0',
								items: thisClass.setPanelHeader('eTradeSetupHeader','eTrade Setup')
							},
							{
								xtype: 'panel',
								//title: getLabel('positivePay','Positive Pay'),
								titleAlign : "left", 
								//collapsible : true,
								cls : 'xn-ribbon',
								collapseFirst : true,
								id : 'eTradeSetupSection',
								layout:'column',
								items: thisClass.setETradeSetupRights()	
							},
							{
								xtype: 'panel',
								id : 'eTradeImpSetupHeader',
								layout:'column',
								cls:'red-bg',
								margin : '4 0 0 0',
								items: thisClass.setPanelHeader('eTradeImpSetupHeader','eTrade Import Setup')
							},
							{
								xtype: 'panel',
								//title: getLabel('incomingAch','Incoming ACH'),
								//collapsible : true,
								//cls : 'xn-ribbon',
								//collapseFirst : true,
								id : 'eTradeImpSetupSection',
								layout:'column',
								items: thisClass.setETradeImportSetupRights()	
							},
							{
								xtype: 'panel',
								id : 'eTradeExpSetupHeader',
								layout:'column',
								cls:'red-bg',
								margin : '4 0 0 0',
								items: thisClass.setPanelHeader('eTradeExpSetupHeader','eTrade Export Setup')
							},
							{
								xtype: 'panel',
								//title: getLabel('incomingAch','Incoming ACH'),
								//collapsible : true,
								//cls : 'xn-ribbon',
								//collapseFirst : true,
								id : 'eTradeExpSetupSection',
								layout:'column',
								items: thisClass.setETradeExportSetupRights()	
							},
							{
								xtype: 'panel',
								id : 'eTradeLoansHeader',
								layout:'column',
								cls:'red-bg',
								margin : '4 0 0 0',
								items: thisClass.setPanelHeader('eTradeLoansHeader','eTrade Loans')
							},
							{
								xtype: 'panel',
								//title: getLabel('incomingAch','Incoming ACH'),
								//collapsible : true,
								//cls : 'xn-ribbon',
								//collapseFirst : true,
								id : 'eTradeLoansSection',
								layout:'column',
								items: thisClass.setETradeLoansRights()	
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
			        		  thisClass.destroy();
			        		  objTradePriviligePopup = null;
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