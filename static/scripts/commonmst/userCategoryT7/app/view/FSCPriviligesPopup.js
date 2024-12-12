var fieldJson = [];
Ext.define('GCP.view.FSCPriviligesPopup', {
	extend: 'Ext.window.Window',
	requires : ['Ext.toolbar.Spacer'],
	xtype: 'fscPriviligesPopup',
	width : 700,
	maxWidth : 735,
	minHeight : 156,
	maxHeight : 550,
	title: getLabel('fscPrivileges','SCF Privileges'),
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
		featureItems.push({xtype: 'label',columnWidth:0.40,text: getLabel("lbl.type","Type"),padding:'0 0 0 10',cls:'boldText privilege-label privilege-grid-main-header privilege-grid-type-label'});
		featureItems.push({xtype: 'label',columnWidth:0.20,text: getLabel("view","View"),padding:'0 0 0 5',cls:'boldText privilege-label privilege-grid-main-header'});
		featureItems.push({xtype: 'label',columnWidth:0.20,text: getLabel("edit","Edit"),padding:'0 0 0 5',cls:'boldText privilege-label privilege-grid-main-header'});
		featureItems.push({xtype: 'label',columnWidth:0.20,text: getLabel("auth","Auth"),padding:'0 0 0 5',cls:'boldText privilege-label'});
		return featureItems;
	},
	setPanelHeader : function(id, title)
	{
		var featureItems = [];
		featureItems.push({xtype: 'label',columnWidth:0.40,text: title,padding:'5 0 0 10',cls:'boldText privilege-grid-header'});
		/*featureItems.push({xtype: 'button',columnWidth:0.20,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '0 0 0 59',width : 10, height : 20, itemId : id+"_viewIcon", border : 0,cls:'btn'});
		featureItems.push({xtype: 'button',columnWidth:0.20,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '0 0 0 118',width : 15, height : 20, itemId : id+"_editIcon", border : 0,cls:'btn'});
		featureItems.push({xtype: 'button',columnWidth:0.20,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '0 0 0 118',width : 15, height : 20, itemId : id+"_authIcon", border : 0,cls:'btn'});*/
		
		featureItems.push({
			xtype: 'panel',
			columnWidth:0.20,
			cls : 'privilege-grid-main-header',
			text: title,
			padding:'5 0 0 0',
			items : [{xtype: 'checkbox', margin: '0 0 0 0', width : '100%', height : 20, itemId : id+"_viewIcon", border : 0,cls:'privilege-grid-header cellContent', disabled:(mode == "VIEW")?true:false }]});
		
		featureItems.push({
			xtype: 'panel',
			columnWidth:0.20,
			cls : 'privilege-grid-main-header',
			text: title,
			padding:'5 0 0 0',
			items : [{xtype: 'checkbox', margin: '0 0 0 0', width : '100%', height : 20, itemId : id+"_editIcon", border : 0,cls:'privilege-grid-header cellContent', disabled:(mode == "VIEW")?true:false }]});
		
		featureItems.push({
			xtype: 'panel',
			columnWidth:0.20,
			//cls : 'privilege-grid-main-header',
			text: title,
			padding:'5 0 0 0',
			items : [{xtype: 'checkbox', margin: '0 0 0 0', width : '100%', height : 20, itemId : id+"_authIcon", border : 0,cls:'privilege-grid-header cellContent', disabled:(mode == "VIEW")?true:false }]});
		
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
		obj.columnWidth='0.20';
		obj.padding='0 0 0 0';
		obj.itemId = feature.featureWeight+"_"+MODE;
		obj.featureWeight = feature.featureWeight;
		obj.mode = MODE;
		obj.rmSerial = feature.rmSerial;
		//obj.border = 1;
		if(i === false){
			obj.xtype="checkbox";
			if(index%2==0)
			obj.cls = 'cellContent privilege-grid-odd';
			else
			obj.cls = 'cellContent privilege-grid-even';
			
			obj.checkChange = function(){
					var panelPointer = this.up('panel');
					checkFSCViewIfNotSelected(this.value,panelPointer,obj);
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
			if(index%2 == 0){
				panel.insert({xtype: 'label',columnWidth:0.40,text: feature.featureName,padding:'5 0 0 25',cls : 'privilege-admin-rights privilege-grid-odd'});	
			}
			else{
				panel.insert({xtype: 'label',columnWidth:0.40,text: feature.featureName,padding:'5 0 0 25',cls : 'privilege-admin-rights privilege-grid-even'});
			}
			panel.insert(self.setPriviligeMenu(feature,"VIEW",index));
			panel.insert(self.setPriviligeMenu(feature,"EDIT",index));
			panel.insert(self.setPriviligeMenu(feature,"AUTH",index));
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
			if(index%2==0){
				panel.insert({xtype: 'label',columnWidth:0.40,text: feature.featureName,padding:'5 0 0 25',cls : 'privilege-admin-rights privilege-grid-odd'});
			}
			else{
				panel.insert({xtype: 'label',columnWidth:0.40,text: feature.featureName,padding:'5 0 0 25',cls : 'privilege-admin-rights privilege-grid-even'});	
			}
			
			panel.insert(self.setPriviligeMenu(feature,"VIEW",index));
			panel.insert(self.setPriviligeMenu(feature,"EDIT",index));
			panel.insert(self.setPriviligeMenu(feature,"AUTH",index));
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
			if(index%2==0){
				panel.insert({xtype: 'label',columnWidth:0.40,text: feature.featureName,padding:'5 0 0 25',cls : 'privilege-admin-rights privilege-grid-odd'});
			}
			else{
				panel.insert({xtype: 'label',columnWidth:0.40,text: feature.featureName,padding:'5 0 0 25',cls : 'privilege-admin-rights privilege-grid-even'});
			}
			panel.insert(self.setPriviligeMenu(feature,"VIEW",index));
			panel.insert(self.setPriviligeMenu(feature,"EDIT",index));
			panel.insert(self.setPriviligeMenu(feature,"AUTH",index));
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
			cls : 'privilege',
			items: [
					{
						xtype: 'panel',
						items:[
						{
							xtype: 'panel',
							id : 'fscColumnHeader',
							layout:'column',
							cls: 'mainHeader',
							items: thisClass.setColumnHeader()
						}]
					},
					{
						xtype:'panel',
						overflowY:'auto',
						maxHeight : 355,
						items:[	{
							xtype: 'panel',
							id : 'fscHeader',
							layout:'column',
							cls:'red-bg',
							items: thisClass.setPanelHeader('fscHeader',getLabel('fscSetup','SCF Setup'))
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
							items: thisClass.setPanelHeader('ftxnsHeader',getLabel('collTxn','Transactions'))
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
							items: thisClass.setPanelHeader('flupHeader',getLabel('import','Import'))
						},
						{
							xtype: 'panel',
							titleAlign : "left", 
							cls : 'xn-ribbon',
							collapseFirst : true,
							id : 'flupSection',
							layout:'column',
							items: thisClass.setFileOptions()	
							
						}
						]
					}
					]
			    
			    }];
		
			if(mode === "VIEW"){
				thisClass.bbar=['->',
			          { 
			        	  text: getLabel('btnClose','Close'),
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
							  text: getLabel('btnCancel','Cancel'),
							  cls : 'ft-button-light',
							  //cls : 'ux_button-padding ux_button-background-color',
							  handler : function(btn,opts) {
								thisClass.close();
										}
						},'->',
			          { 
			        	  text: getLabel('submit','Submit'),
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
function checkFSCViewIfNotSelected(isSelected,panelPointer,obj){
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