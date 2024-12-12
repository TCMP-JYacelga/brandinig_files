var fieldJson = [];
Ext.define('GCP.view.LoanPriviligesPopup', {
	extend: 'Ext.window.Window',
	requires : ['Ext.toolbar.Spacer'],
	xtype: 'loanPriviligesPopup',
	width : 700,
	maxWidth : 735,
	//height : 250,
	minHeight : 156,
	maxHeight : 550,
	title: getLabel('loanPrivileges','Loan Privileges'),
//	layout: 'fit',
	cls : 'xn-popup',
//	overflowY: 'auto',
	config: {
//		layout: 'fit',
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
	
	loadFeaturs: function() {
	var me = this;
		if(mode === "VIEW"){
				Ext.Ajax.request({
					url : 'services/userCategory/previlige.json',
					method : 'POST',
					async: false,
					params : { module: '07',categoryId:userCategory},
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
		featureItems.push({xtype: 'label',columnWidth:0.20,text: getLabel("approve","Approve"),padding:'0 0 0 5',cls:'boldText privilege-label'});
		return featureItems;
	},
	setPanelHeader : function(id, title)
	{
		var featureItems = [];
		featureItems.push({xtype: 'label',columnWidth:0.40,text: title,padding:'5 0 0 10',cls:'boldText privilege-grid-header'});
		
		featureItems.push({
		xtype: 'panel',
		columnWidth:0.20,
		cls : 'privilege-grid-main-header',
		text: title,
		padding:'5 0 0 0',
		items : [{xtype: 'checkbox', margin: '0 0 0 0', width : '100%', height : 20, itemId : id+"_viewIcon", border : 0,cls:'privilege-grid-header cellContent',disabled:(mode == "VIEW")?true:false }]
		});
		
		featureItems.push({
		xtype: 'panel',
		columnWidth:0.20,
		cls : 'privilege-grid-main-header',
		text: title,
		padding:'5 0 0 0',
		items : [{xtype: 'checkbox', margin: '0 0 0 0', width : '100%', height : 20, itemId : id+"_editIcon", border : 0,cls:'privilege-grid-header cellContent',disabled:(mode == "VIEW")?true:false }]
		});
		
		featureItems.push({
		xtype: 'panel',
		columnWidth:0.20,
		//cls : 'privilege-grid-main-header',
		text: title,
		padding:'5 0 0 0',
		items : [{xtype: 'checkbox', margin: '0 0 0 0', width : '100%', height : 20, itemId : id+"_authIcon", border : 0,cls:'privilege-grid-header cellContent',disabled:(mode == "VIEW")?true:false }]
		});
		/*featureItems.push({xtype: 'button',columnWidth:0.20,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '0 0 0 59',width : 10, height : 20, itemId : id+"_viewIcon", border : 0,cls:'btn'});
		featureItems.push({xtype: 'button',columnWidth:0.20,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '0 0 0 118',width : 15, height : 20, itemId : id+"_editIcon", border : 0,cls:'btn'});
		featureItems.push({xtype: 'button',columnWidth:0.20,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '0 0 0 118',width : 15, height : 20, itemId : id+"_authIcon", border : 0,cls:'btn'});*/
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
			//obj.cls = 'cellContent';
			obj.checkChange = function(){
				var panelPointer = this.up('panel');
				checkLoanViewIfNotSelected(this.value,panelPointer,obj);
				}
		}
		else {
			obj.xtype="tbspacer";
			if(index%2==0)
			obj.cls = 'whitetext privilege-grid-odd';
			else
			obj.cls = 'whitetext privilege-grid-even';
			//obj.cls = 'whitetext';
			//obj.hidden = true;
		}
		if(null != obj.checked && undefined != obj.checked)
		{
			obj.defVal = obj.checked;
		}
		if(feature.featureId == 'HOME'){
			obj.readOnly = true;
			obj.checked = true;
			obj.defVal = true;
		}
		if(mode === "VIEW"){
			obj.readOnly = true;
		}
		fieldJson.push(obj);
		return obj;
	},
	
	setUserLoanRights : function()
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
			if(index%2 == 0){
			panel.insert({xtype: 'label',columnWidth:0.40,text: feature.featureName,padding:'5 0 0 25', cls : 'privilege-admin-rights privilege-grid-odd'});
			}
			else{
			panel.insert({xtype: 'label',columnWidth:0.40,text: feature.featureName,padding:'5 0 0 25', cls : 'privilege-admin-rights privilege-grid-even'});
			}
			panel.insert(self.setPriviligeMenu(feature,"VIEW",index));
			panel.insert(self.setPriviligeMenu(feature,"EDIT",index));
			panel.insert(self.setPriviligeMenu(feature,"AUTH",index));
			featureItems.push(panel);
		});
		return featureItems;
	},
	
	initComponent: function() {
	var thisClass = this;
		thisClass.items = [{
	    	xtype: 'container',
			//cls : 'border',
			cls : 'privilege',
			items: [
					{
						xtype: 'panel',
						cls: 'xn-ribbon',
						items:[
						{
							xtype: 'panel',
							id : 'loanColumnHeader',
							layout:'column',
							cls: 'mainHeader',
							//margin : '5 5 5 5',
							//padding: '0 0 0 10',
							items: thisClass.setColumnHeader()
						}]
					},
					{
						xtype:'panel',
						overflowY:'auto',
						//height:109,
						maxHeight : 355,
						items:[{
							xtype: 'panel',
							id : 'loanHeader',
							layout:'column',
							cls:'red-bg',
							//margin : '4 0 0 0',
							items: thisClass.setPanelHeader('loanHeader',getLabel('loans','Loans'))
						},
						{
							xtype: 'panel',
							//title: getLabel('positivePay','Positive Pay'),
							titleAlign : "left", 
							//collapsible : true,
							cls : 'xn-ribbon',
							collapseFirst : true,
							id : 'userLoanParametersSection',
							layout:'column',
							items: thisClass.setUserLoanRights()	
							
						}]
					}
					]
			    
			    }];
		
		if(mode === "VIEW"){
			thisClass.bbar=['->',
			          { 
			        	  text: getLabel('btnClose','Close'),
			        	  cls : 'ft-button-primary',
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
			        	  handler : function(btn,opts) {
			        		thisClass.destroy();
							objLoanPriviligePopup= null;
			        				}
			          },'->',
			          { 
			        	  text: getLabel('submit','Submit'),
			        	  cls : 'ft-button-primary',
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
function checkLoanViewIfNotSelected(isSelected,panelPointer,obj){
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