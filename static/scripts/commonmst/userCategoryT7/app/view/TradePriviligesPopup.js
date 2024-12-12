var fieldJson = [];
Ext.define('GCP.view.TradePriviligesPopup', {
	extend: 'Ext.window.Window',
	requires : ['Ext.toolbar.Spacer'],
	xtype: 'tradePriviligesPopup',
	width : 700,
	maxWidth : 735,
	minHeight : 156,
	maxHeight : 550,
	title: getLabel('eTradePrivlege','eTrade Privileges'),
//	layout: 'fit',
	cls : 'xn-popup',
//	overflowY: 'auto',
	config: {
	//	layout: 'fit',
		modal : true,
		resizable:false,
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
		resize : function(){
			this.center();
		},
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
		featureItems.push({xtype: 'label',columnWidth:0.37,text: getLabel("lbl.type","Type"),padding:'0 0 0 10',cls:'boldText privilege-label privilege-grid-main-header privilege-grid-type-label'});
		featureItems.push({xtype: 'label',columnWidth:0.21,text: getLabel("view","View"),padding:'0 0 0 5',cls:'boldText privilege-label privilege-grid-main-header'});
		featureItems.push({xtype: 'label',columnWidth:0.21,text: getLabel("edit","Edit"),padding:'0 0 0 5',cls:'boldText privilege-label privilege-grid-main-header'});
		featureItems.push({xtype: 'label',columnWidth:0.21,text: getLabel("auth","Auth"),padding:'0 0 0 5',cls:'boldText privilege-label'});
		return featureItems;
	},
	setPanelHeader : function(id, title)
	{
		var featureItems = [];
		featureItems.push({xtype: 'label',columnWidth:0.37,text: title,padding:'5 0 0 10',cls:'boldText privilege-grid-header'});
		
		featureItems.push({
			xtype: 'panel',
			columnWidth:0.21,
			cls : 'privilege-grid-main-header',
			text: title,
			padding:'5 0 0 0',
			items : [{xtype: 'checkbox',margin: '0 0 0 0',width : '100%', height : 20, itemId : id+"_viewIcon", border : 0,cls:'privilege-grid-header cellContent',disabled:(mode == "VIEW")?true:false }]
		});
		
		featureItems.push({
			xtype: 'panel',
			columnWidth:0.21,
			cls : 'privilege-grid-main-header',
			text: title,
			padding:'5 0 0 0',
			items : [{xtype: 'checkbox',margin: '0 0 0 0',width : '100%', height : 20, itemId : id+"_editIcon", border : 0,cls:'privilege-grid-header cellContent',disabled:(mode == "VIEW")?true:false }]
		});
		
		featureItems.push({
			xtype: 'panel',
			columnWidth:0.21,
			//cls : 'privilege-grid-main-header',
			text: title,
			padding:'5 0 0 0',
			items : [{xtype: 'checkbox',margin: '0 0 0 0',width : '100%', height : 20, itemId : id+"_authIcon", border : 0,cls:'privilege-grid-header cellContent',disabled:(mode == "VIEW")?true:false }]
		});
		
		/*featureItems.push({xtype: 'button',columnWidth:0.21,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '0 0 0 59',width : 10, height : 20, itemId : id+"_viewIcon", border : 0,cls:'btn'});
		featureItems.push({xtype: 'button',columnWidth:0.21,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '0 0 0 118',width : 15, height : 20, itemId : id+"_editIcon", border : 0,cls:'btn'});
		featureItems.push({xtype: 'button',columnWidth:0.21,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '0 0 0 118',width : 15, height : 20, itemId : id+"_authIcon", border : 0,cls:'btn'});*/
		return featureItems;
	},
	setPriviligeMenu : function(feature,MODE,index)
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
		obj.columnWidth='0.21';
		obj.padding='0 0 0 0';
		obj.itemId = feature.featureWeight+"_"+MODE;
		obj.featureWeight = feature.featureWeight;
		obj.mode = MODE;
		obj.rmSerial = feature.rmSerial;
		if(i === false){
			obj.xtype="checkbox";
			if(index%2==0)
				obj.cls = 'cellContent privilege-grid-odd';
			else
				obj.cls = 'cellContent privilege-grid-even';
			obj.checkChange = function(){
			var panelPointer = this.up('panel');
			checkTradeViewIfNotSelected(this.value,panelPointer,obj);
			}
		}
		else {
			obj.xtype="tbspacer";
			if(index%2==0)
				obj.cls = 'whitetext privilege-grid-odd';
			else
				obj.cls = 'whitetext privilege-grid-even';
			//obj.hidden = true;
		}
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
			if(index%2==0){
				panel.insert({xtype: 'label',columnWidth:0.37,text: feature.featureName,padding:'5 0 0 25',cls: 'privilege-admin-rights privilege-grid-odd'});
			}
			else{
				panel.insert({xtype: 'label',columnWidth:0.37,text: feature.featureName,padding:'5 0 0 25',cls : 'privilege-admin-rights privilege-grid-even'});	
			}
			panel.insert(self.setPriviligeMenu(feature,"VIEW",index));
			panel.insert(self.setPriviligeMenu(feature,"EDIT",index));
			panel.insert(self.setPriviligeMenu(feature,"AUTH",index));
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
			if(index%2==0){
				panel.insert({xtype: 'label',columnWidth:0.37,text: feature.featureName,padding:'5 0 0 25',cls: 'privilege-admin-rights privilege-grid-odd'});
			}
			else{
				panel.insert({xtype: 'label',columnWidth:0.37,text: feature.featureName,padding:'5 0 0 25',cls : 'privilege-admin-rights privilege-grid-even'});
			}
			panel.insert(self.setPriviligeMenu(feature,"VIEW",index));
			panel.insert(self.setPriviligeMenu(feature,"EDIT",index));
			panel.insert(self.setPriviligeMenu(feature,"AUTH",index));
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
			if(index%2==0){
				panel.insert({xtype: 'label',columnWidth:0.37,text: feature.featureName,padding:'5 0 0 25',cls: 'privilege-admin-rights privilege-grid-odd'});
			}
			else{
				panel.insert({xtype: 'label',columnWidth:0.37,text: feature.featureName,padding:'5 0 0 25',cls : 'privilege-admin-rights privilege-grid-even'});	
			}
			panel.insert(self.setPriviligeMenu(feature,"VIEW",index));
			panel.insert(self.setPriviligeMenu(feature,"EDIT",index));
			panel.insert(self.setPriviligeMenu(feature,"AUTH",index));
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
			if(index%2==0){
				panel.insert({xtype: 'label',columnWidth:0.37,text: feature.featureName,padding:'5 0 0 25',cls: 'privilege-admin-rights privilege-grid-odd'});
			}
			else{
				panel.insert({xtype: 'label',columnWidth:0.37,text: feature.featureName,padding:'5 0 0 25',cls : 'privilege-admin-rights privilege-grid-even'});
			}
			panel.insert(self.setPriviligeMenu(feature,"VIEW",index));
			panel.insert(self.setPriviligeMenu(feature,"EDIT",index));
			panel.insert(self.setPriviligeMenu(feature,"AUTH",index));
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
			if(index%2==0){
				panel.insert({xtype: 'label',columnWidth:0.37,text: feature.featureName,padding:'5 0 0 25',cls: 'privilege-admin-rights privilege-grid-odd'});
			}
			else{
				panel.insert({xtype: 'label',columnWidth:0.37,text: feature.featureName,padding:'5 0 0 25',cls : 'privilege-admin-rights privilege-grid-even'});
			}
			panel.insert(self.setPriviligeMenu(feature,"VIEW",index));
			panel.insert(self.setPriviligeMenu(feature,"EDIT",index));
			panel.insert(self.setPriviligeMenu(feature,"AUTH",index));
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
			if(chk_eTradeSetup.src.indexOf("icon_unchecked.gif") <= -1){
				eTradeImpSetupHeader.removeCls('red-bg');
				eTradeImpSetupHeader.addCls('red-bg1');
			}
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
			if(chk_eTradeSetup.src.indexOf("icon_unchecked.gif") <= -1){
				eTradeExpSetupHeader.removeCls('red-bg');
				eTradeExpSetupHeader.addCls('red-bg1');
			}
			if(chk_eTradeImpSetupHeader.src.indexOf("icon_unchecked.gif") <= -1){
				eTradeExpSetupHeader.removeCls('red-bg');
				eTradeExpSetupHeader.addCls('red-bg1');
			}
			if((chk_eTradeSetup.src.indexOf("icon_unchecked.gif") <= -1) && (chk_eTradeImpSetupHeader.src.indexOf("icon_unchecked.gif") <= -1)){
				eTradeExpSetupHeader.removeCls('red-bg1');
				eTradeExpSetupHeader.addCls('red-bg');
			}
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
			if((chk_eTradeSetup.src.indexOf("icon_unchecked.gif") <= -1) || (chk_eTradeImpSetupHeader.src.indexOf("icon_unchecked.gif") <= -1) || (chk_eTradeExpSetupHeader.src.indexOf("icon_unchecked.gif") <= -1)){
				eTradeLoansHeader.removeCls('red-bg');
				eTradeLoansHeader.addCls('red-bg1');
			}
			if((chk_eTradeSetup.src.indexOf("icon_unchecked.gif") <= -1) && (chk_eTradeImpSetupHeader.src.indexOf("icon_unchecked.gif") <= -1) && (chk_eTradeExpSetupHeader.src.indexOf("icon_unchecked.gif") <= -1)){
				eTradeLoansHeader.removeCls('red-bg');
				eTradeLoansHeader.addCls('red-bg1');
			}
		}
				
	},
	initComponent: function() {
	    var thisClass = this;
		thisClass.items = [{
	    	xtype: 'container',
			cls : 'privilege',
			items: [
					{
						xtype: 'panel',
						items:[
						{
							xtype: 'panel',
							id : 'tradeColumnHeader',
							layout:'column',
							cls: 'mainHeader',
							items: thisClass.setColumnHeader()
						}]
					},
					{
					xtype:'panel',
					overflowY:'auto',
					maxHeight : 355,
					items:[{
							xtype: 'panel',
							id : 'eTradeSetupHeader',
							layout:'column',
							cls:'red-bg',
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
							items: thisClass.setPanelHeader('eTradeImpSetupHeader',getLabel('eTradeImportSetup','eTrade Import Setup'))
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
							items: thisClass.setPanelHeader('eTradeExpSetupHeader',getLabel('eTradeExportSetup','eTrade Export Setup'))
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
							items: thisClass.setPanelHeader('eTradeLoansHeader',getLabel('eTradeLoans','eTrade Loans'))
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
						}
						]
					}
					]
			    
			    }];
		
		if(mode === "VIEW"){
			thisClass.bbar=['->',
			          { 
			        	  text:getLabel('btnClose','close'),
			        	  cls : 'ft-button-primary',
			        	  //cls : 'ux_button-padding ux_button-background-color',
			        	  handler : function(btn,opts) {
			        		thisClass.close();
			        				}
			          }
			        ];
		}
		else
		{
			thisClass.bbar=[
			          { 
			        	  text:getLabel('btnCancel','Cancel'),
			        	  cls : 'ft-button-light',
			        	  //cls : 'ux_button-padding ux_button-background-color',
			        	  handler : function(btn,opts) {
			        		  thisClass.destroy();
			        		  objTradePriviligePopup = null;
			        				}
			          },'->',{ 
			        	  text:getLabel('submit','Submit'),
			        	  cls : 'ft-button-primary',
			        	  //cls : 'ux_button-padding ux_button-background-color ux_largemargin-right',
			        	  handler : function(btn,opts) {
			        	  	thisClass.saveItems();
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
									if(('VIEW' != mode && viewSerials[field.rmSerial]=== false) && 
									(editSerials[field.rmSerial] === true || authSerials[field.rmSerial] === true)){
										viewSerials[field.rmSerial] = true;
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
function checkTradeViewIfNotSelected(isSelected,panelPointer,obj){
	if(null != panelPointer && undefined != panelPointer){
		if (isSelected){
			var viewItemId =obj.featureWeight+"_VIEW";
			var view_chk_box = panelPointer.down('checkbox[itemId='+viewItemId+']');
			if(null != view_chk_box && undefined != view_chk_box && view_chk_box.value== false){
				view_chk_box.setValue(true);
			}
		}else{
			if("VIEW"===obj.mode){
				var editIconItemId = panelPointer.down('checkbox[itemId='+obj.featureWeight + '_EDIT' +']');
				if( editIconItemId )
				{
					editIconItemId.setValue( false );
					editIconItemId.defVal = false;
				}
				var authIconItemId = panelPointer.down('checkbox[itemId='+obj.featureWeight + '_AUTH' +']');
				if( authIconItemId )
				{
					authIconItemId.setValue( false );
					authIconItemId.defVal = false;
				}
			}
		}
	}
}