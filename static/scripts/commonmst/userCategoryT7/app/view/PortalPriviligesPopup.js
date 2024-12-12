var fieldJson = [];
Ext.define('GCP.view.PortalPriviligesPopup', {
	extend: 'Ext.window.Window',
	requires : ['Ext.toolbar.Spacer'],
	xtype: 'portalPriviligesPopup',
	width : 400,
	maxWidth : 735,
//	height : 500,
	title: getLabel('portalPrivileges','Portal Privileges'),
	minHeight : 156,
	maxHeight : 550,
	cls : 'xn-popup',
	config: {
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
					params : { module: '19',categoryId:userCategory},
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
		featureItems.push({xtype: 'label',columnWidth:0.60, padding:'0 0 0 10', text: getLabel("lbl.type","Type"),cls:'boldText privilege-label privilege-grid-main-header privilege-grid-type-label ft-align-left'});
		featureItems.push({xtype: 'label',columnWidth:0.40, padding:'0 0 0 5', text: getLabel("view","View"),padding:'0 0 0 0',margin:'0 0 0 0',cls:'boldText privilege-label ft-summary-settings-label'});
	//	featureItems.push({xtype: 'label',columnWidth:0.20,text: "Edit",padding:'0 0 0 5',cls:'boldText background'});
	//	featureItems.push({xtype: 'label',columnWidth:0.20,text: "Auth",padding:'0 0 0 5',cls:'boldText background'});
		return featureItems;
	},
    setPanelHeader : function(id, title)
	{       
		var featureItems = [];
		featureItems.push({xtype: 'label',columnWidth:0.60,text: title,padding:'5 0 0 10',cls:'boldText privilege-grid-header'});
		
		featureItems.push({
		xtype: 'panel',
		columnWidth:0.40,
		cls : 'privilege-grid-main-header',
		text: title,
		padding:'5 0 0 0',
		items : [{
		xtype: 'checkbox', margin: '0 0 0 0', width : '100%', height : 20, itemId : id+"_viewIcon", border : 0,cls:'privilege-grid-header cellContent',disabled:(mode == "VIEW")?true:false 
		}]
		});
		/*featureItems.push({xtype: 'button',columnWidth:0.40,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '0 0 0 55',width : 10, height : 20, itemId : id+"_viewIcon", border : 0,cls:'btn'});*/
		
	//	featureItems.push({xtype: 'button',columnWidth:0.20,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '0 0 0 118',width : 15, height : 20, itemId : id+"_editIcon", border : 0,cls:'btn'});
	//	featureItems.push({xtype: 'button',columnWidth:0.20,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '0 0 0 118',width : 15, height : 20, itemId : id+"_authIcon", border : 0,cls:'btn'});
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
	/*	else if(MODE == 'EDIT')
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
			if(index%2==0)
			obj.cls = 'cellContent privilege-grid-even';
			else
			obj.cls = 'cellContent privilege-grid-odd';
			//obj.cls = 'cellContent';
		}
		else {
			obj.xtype="tbspacer";
			if(index%2==0)
			obj.cls = 'whitetext privilege-grid-even';
			else
			obj.cls = 'whitetext privilege-grid-odd';
			//obj.cls = 'whitetext';
			//obj.hidden = true;
		}
		obj.columnWidth='0.4';
		obj.padding='0 0 0 0';
       // obj.margin='0 34 0 0';
		obj.itemId = feature.featureWeight+"_"+MODE;
		obj.featureWeight = feature.featureWeight;
		obj.mode = MODE;
		obj.rmSerial = feature.rmSerial;
		//obj.border = 1;
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
	
	setPortalSetupRights : function()
	{
		var self = this;
		var data = this.loadFeaturs();
		var filteredData = this.filterFeatures(data,'PORTALPRM');
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
			var panel = Ext.create('Ext.panel.Panel', {
				columnWidth:1,
				layout:'column',
				bodyStyle: {
					background: ' #FAFAFA '
				}
			});
			if((featureItems.length+1) %2 == 0){
			panel.insert({xtype: 'label',columnWidth:0.60,text: feature.featureName,padding:'5 0 0 25', cls: 'privilege-admin-rights privilege-grid-even'});
			}
			else{
			panel.insert({xtype: 'label',columnWidth:0.60,text: feature.featureName,padding:'5 0 0 25', cls: 'privilege-admin-rights privilege-grid-odd'});
			}
		//	panel.insert(self.setPriviligeMenu(feature,"EDIT"));
		//	panel.insert(self.setPriviligeMenu(feature,"AUTH"));
			panel.insert(self.setPriviligeMenu(feature,"VIEW",featureItems.length+1));
			featureItems.push(panel);
		});

		return featureItems;
	},
	

	showCheckedSection : function(){
			var me = this;
			var portalSetupHeader = me.down('panel[itemId="portalSetupHeader"]');//Ext.getCmp('portalSetupHeader');
			portalSetupHeader.show();
			/*var portalSetupSection = Ext.getCmp('portalSetupSection');
			portalSetupSection.show();		*/		

		
	},
	initComponent: function() {
	    var thisClass = this;
		thisClass.items = [{
		    	xtype: 'container',
				cls : 'privilege',
				items:[{
						xtype:'panel',
					    cls: 'xn-ribbon',
						items:[{
							xtype: 'panel',
							//itemId : 'portalColumnHeader',
							layout:'column',
							cls: 'mainHeader',
							//margin : '5 5 5 5',
							//padding: '5 5 5 5',
							items: thisClass.setColumnHeader()
						}]
				},{
					    xtype:'panel',
					   // overflowY:'auto',
					   // height:350,
					    items:[{
								xtype: 'panel',
								itemId : 'portalSetupHeader',
								layout:'column',
								cls:'red-bg',
								//margin : '4 0 0 0',
								items: thisClass.setPanelHeader('portalSetupHeader','Portal Setup')
							},
							{
								xtype: 'panel',
								//title: getLabel('positivePay','Positive Pay'),
								titleAlign : "left", 
							    overflowY:'auto',								
								maxHeight : 350,								
								//collapsible : true,
								cls : 'xn-ribbon',
								collapseFirst : true,
								itemId : 'portalSetupSection',
								layout:'column',
								items: thisClass.setPortalSetupRights()	
								
							}]
				}]  
		 }];

		
			if(mode === "VIEW"){
				thisClass.bbar=['->',
			          { 
			        	  text: getLabel('btnClose','Close'),//'Cancel',
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
			        	  handler : function(btn,opts) {
			        		  thisClass.close();
			        		  objColPopup = null;
			        				}
			          },'->',
			          { 
			        	  text: getLabel('submit','Submit'),
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
							}
			});
				if (!Ext.isEmpty(me.fnCallback)
						&& typeof me.fnCallback == 'function') {
					me.fnCallback(viewSerials,authSerials,editSerials);
					me.close();
				}
			}
});