var fieldJson = [];
Ext.define('GCP.view.BRPriviligesPopup', {
	extend: 'Ext.window.Window',
	xtype: 'bRPriviligesPopup',
	width : 400,
	height : 321,
	title: 'BR Reporting Privileges',
	config: {
		modal : true,
		draggable : true,
		resizable:false,
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
			   // this.showCheckedSection();
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
					params : { module: '01',categoryId:userCategory},
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
		featureItems.push({xtype: 'label',columnWidth:0.60,text: "Type",cls:'boldText background'});		
		featureItems.push({xtype: 'label',columnWidth:0.20,text: "View",padding:'0 0 0 5',cls:'boldText background'});
	//	featureItems.push({xtype: 'label',columnWidth:0.20,text: "Edit",padding:'0 0 0 5',cls:'boldText background'});
	//	featureItems.push({xtype: 'label',columnWidth:0.20,text: "Auth",padding:'0 0 0 5',cls:'boldText background'});
		return featureItems;
	},
	setPanelHeader : function(id, title)
	{
		var featureItems = [];
		featureItems.push({xtype: 'label',columnWidth:0.60,text: title,padding:'5 0 0 10',cls:'boldText'});
		featureItems.push({xtype: 'button',columnWidth:0.20,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 10',width : 10, height : 20, itemId : id+"_viewIcon", border : 0,cls:'btn'});
	/*	featureItems.push({xtype: 'button',columnWidth:0.20,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 113',width : 15, height : 20, itemId : id+"_editIcon", border : 0,cls:'btn'});
		featureItems.push({xtype: 'button',columnWidth:0.20,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 110',width : 15, height : 20, itemId : id+"_authIcon", border : 0,cls:'btn'});*/
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
		/*else if(MODE == 'EDIT')
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
		}*/
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
		obj.columnWidth='0.60';
		obj.padding='0 0 0 0';
		obj.margin='0 34 0 0';
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
	
	setBRRights : function()
	{
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'PAYPRM');
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
		//	panel.insert(self.setPriviligeMenu(feature,"EDIT"));
		//	panel.insert(self.setPriviligeMenu(feature,"AUTH"));
			featureItems.push(panel);
		});
		
		filteredData = this.filterFeatures(data,'ENTRY');
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
		//	panel.insert(self.setPriviligeMenu(feature,"EDIT"));
		//	panel.insert(self.setPriviligeMenu(feature,"AUTH"));
			featureItems.push(panel);
		});
		
		filteredData = this.filterFeatures(data,'BRPRM');
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
		//	panel.insert(self.setPriviligeMenu(feature,"EDIT"));
		//	panel.insert(self.setPriviligeMenu(feature,"AUTH"));
			featureItems.push(panel);
		});
		
		return featureItems;
	},
	setLoansRights : function()
	{
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'LOANPRM');
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
		//	panel.insert(self.setPriviligeMenu(feature,"EDIT"));
		//	panel.insert(self.setPriviligeMenu(feature,"AUTH"));
			featureItems.push(panel);
		});
		return featureItems;
	},
	setInvestRights : function()
	{
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'INVESTPRM');
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
		//	panel.insert(self.setPriviligeMenu(feature,"EDIT"));
		//	panel.insert(self.setPriviligeMenu(feature,"AUTH"));
			featureItems.push(panel);
		});
		return featureItems;
	},
	showCheckedSection : function(){
		var br = document.getElementById("chkImg_BR");
		var loans = document.getElementById("chkImg_loans");
		var incWires = document.getElementById("chkImg_incWires");
		var depView = document.getElementById("chkImg_depView");
		var investments = document.getElementById("chkImg_investments");
		
		if (br.src.indexOf("icon_unchecked.gif") > -1)
		{
			var brHeader = Ext.getCmp('brHeader');
			var brSection = Ext.getCmp('brSection');
			brSection.hide();
			brHeader.hide();
		}
		else
		{
			var brHeader = Ext.getCmp('brHeader');
			brHeader.show();
			var brSection = Ext.getCmp('brSection');
			brSection.show();				
		}
		
		
		if (loans.src.indexOf("icon_unchecked.gif") > -1)
		{
			var loanHeader = Ext.getCmp('loanHeader');
			var loansSection = Ext.getCmp('loanSection');
			loansSection.hide();
			loanHeader.hide();
		}
		else
		{
			var loanHeader = Ext.getCmp('loanHeader');
			loanHeader.show();
			var loansSection = Ext.getCmp('loanSection');
			loansSection.show();				
		}
		
		if (incWires.src.indexOf("icon_unchecked.gif") > -1)
		{
			var incomingWireHeader = Ext.getCmp('incomingWireHeader');
			//var loansSection = Ext.getCmp('loansSection');
			//loansSection.hide();
			incomingWireHeader.hide();
		}
		else
		{
			var incomingWireHeader = Ext.getCmp('incomingWireHeader');
			incomingWireHeader.show();
			//var loansSection = Ext.getCmp('loansSection');
			//loansSection.show();				
		}
		
		if (depView.src.indexOf("icon_unchecked.gif") > -1)
		{
			var depviewHeader = Ext.getCmp('depviewHeader');
			//var loansSection = Ext.getCmp('loansSection');
			//loansSection.hide();
			depviewHeader.hide();
		}
		else
		{
			var depviewHeader = Ext.getCmp('depviewHeader');
			depviewHeader.show();
			//var loansSection = Ext.getCmp('loansSection');
			//loansSection.show();				
		}
		
			
		if (investments.src.indexOf("icon_unchecked.gif") > -1)
		{
			var investHeader = Ext.getCmp('investHeader');
			//var loansSection = Ext.getCmp('loanSection');
			//loansSection.hide();
			investHeader.hide();
		}
		else
		{
			var investHeader = Ext.getCmp('investHeader');
			investHeader.show();
			//var loansSection = Ext.getCmp('loansSection');
			//loansSection.show();				
		}
		
		
	},
	initComponent: function() {
	    var thisClass = this;
		thisClass.items = [{
	    	xtype: 'container',
			cls : 'border',
			items:[{
					xtype:'panel',
					items:[{
							xtype: 'panel',
							id : 'brColumnHeader',
							layout:'column',
							cls: 'alignLeft',
							margin : '5 5 5 5',
							padding: '5 5 5 5',
							items: thisClass.setColumnHeader()
				}]
			},{
					xtype:'panel',
					overflowY:'auto',
					height:180,
					items:[{
								xtype: 'panel',
								id : 'brHeader',
								layout:'column',
								cls:'red-bg',
								margin : '4 0 0 0',
								items: thisClass.setPanelHeader('brHeader','BR')
							},
							{
								xtype: 'panel',
								//title: getLabel('positivePay','Positive Pay'),
								titleAlign : "left", 
								//collapsible : true,
								cls : 'xn-ribbon',
								collapseFirst : true,
								id : 'brSection',
								layout:'column',
								items: thisClass.setBRRights()	
								
					}]
			}]
		}];
		
			if(mode === "VIEW"){
				thisClass.buttons=[
			          { 
			        	  text: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Cancel',
			        	  cls : 'ux_button-padding ux_button-background-color',
			        	  glyph: 'xf056@fontawesome',
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
			        		objAdminPriviligePopup = null;
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