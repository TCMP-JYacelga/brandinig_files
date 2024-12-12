var granularPrivfieldJson = [];
Ext.define('GCP.view.SIGranularPriviligesPopup', {
	extend: 'Ext.window.Window',
	xtype: 'siPayGranularPriviligesPopup',
	width : 1000,
	height : 500,
	title: 'Standing Instruction Granular Privileges',
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
	
	loadGranularFeaturs: function() {
	var me = this;
		if(mode === "VIEW"){
				Ext.Ajax.request({
					url : 'services/userCategory/accountPackagePrivileges.json',
					method : 'POST',
					async: false,
					params : { module: '02',categoryId:userCategory,serviceType:'SI'},
					success : function(response) {
					 	 siGranularFeatureData = Ext.JSON.decode(response.responseText);
						return siGranularFeatureData; 
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
		
		return siGranularFeatureData;
	},
	filterFeatures: function(data) {
	   var allFeatures = new Ext.util.MixedCollection();
	   allFeatures.addAll(data);
	   // var featurs = allFeatures.filter(featureFilter);
		return allFeatures.items;
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
	setColumnHeader : function(serviceType)
	{
		var featureItems = [];
		featureItems.push({xtype: 'label',columnWidth:0.60,text: "Type",padding:'0 0 0 0',cls:'boldText background'});
		featureItems.push({xtype: 'label',columnWidth:0.10,text: "View",padding:'0 0 0 5',cls:'boldText background'});
		featureItems.push({xtype: 'label',columnWidth:0.10,text: "Edit",padding:'0 0 0 5',cls:'boldText background'});
		featureItems.push({xtype: 'label',columnWidth:0.10,text: "Approve",padding:'0 0 0 5',cls:'boldText background'});
		featureItems.push({xtype: 'label',columnWidth:0.10,text: "Quick Approve",padding:'0 0 0 5',cls:'boldText background'});
		return featureItems;
	},
	setPanelHeader : function(id, title)
	{
		var featureItems = [];
		featureItems.push({xtype: 'label',columnWidth:0.30,text: title,padding:'5 0 0 10',cls:'boldText'});
		featureItems.push({xtype: 'label',columnWidth:0.30,text: 'Payment Package',padding:'5 0 0 0',cls:'boldText'});
		featureItems.push({xtype: 'button',columnWidth:0.10,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 30',width : 15, height : 20, itemId : id+"_viewIcon", border : 0,cls:'btn'});
		featureItems.push({xtype: 'button',columnWidth:0.10,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 73',width : 10, height : 20, itemId : id+"_editIcon", border : 0,cls:'btn'});
		featureItems.push({xtype: 'button',columnWidth:0.10,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 70',width : 15, height : 20, itemId : id+"_authIcon", border : 0,cls:'btn'});
		featureItems.push({xtype: 'button',columnWidth:0.10,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 73',width : 10, height : 20, itemId : id+"_quickApproveIcon", border : 0,cls:'btn'});
		return featureItems;
	},
	setPriviligeMenu : function(feature,MODE)
	{
		var obj = new Object();
		if(MODE == 'VIEW')
		{
			
			obj.checked = this.getBooleanvalue(feature.viewFlag);
		}
		else if(MODE == 'EDIT')
		{	
			
			obj.checked = this.getBooleanvalue(feature.editFlag);
		}
		else if(MODE == 'AUTH')
		{
			
			obj.checked = this.getBooleanvalue(feature.approveFlag);
		}else if(MODE == 'QUICKAPPROVE')
		{	
			
			obj.checked = this.getBooleanvalue(feature.quickApproveFlag);
		}
		
		obj.xtype="checkbox";
		obj.cls = 'cellContent';
		obj.columnWidth='0.10';
		obj.padding='0 0 0 0';
		obj.itemId = feature.accountId+"_"+feature.packageId+"_"+MODE;
		obj.mode = MODE;
		obj.accountId = feature.accountId;
		obj.packageId = feature.packageId;
		obj.border = 1;
		if(null != obj.checked && undefined != obj.checked)
		{
			obj.defVal = obj.checked;
		}
		
		if(mode === "VIEW"){
			obj.readOnly = true;
		}
		var flag ='N';
		for (var i in granularPrivfieldJson) {
		  if (granularPrivfieldJson[i].itemId == obj.itemId) {
			flag ='Y';
				break; //Stop this loop, we found it!
			}
     }
		if(flag==='N'){
			granularPrivfieldJson.push(obj);
		
		}
		return obj;
	},
	
	setSiGranularRights : function()
	{
		var self = this;
		var data = self.loadGranularFeaturs();
		var filteredData = this.filterFeatures(data);
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
			var panel = Ext.create('Ext.panel.Panel', {
				columnWidth:1,
				layout:'column',
				bodyStyle: {
					background: '#FAFAFA'
				}
			});
			var accountText = feature.accountNo + '|'+ feature.accountName;
			panel.insert({xtype: 'label',columnWidth:0.30,text: accountText  ,padding:'5 0 0 10',height:'auto',style : 'word-wrap: break-word'});
			panel.insert({xtype: 'label',columnWidth:0.30,text: feature.packageName  ,padding:'5 0 0 10'});
			panel.insert(self.setPriviligeMenu(feature,"VIEW"));
			panel.insert(self.setPriviligeMenu(feature,"EDIT"));
			panel.insert(self.setPriviligeMenu(feature,"AUTH"));
			panel.insert(self.setPriviligeMenu(feature,"QUICKAPPROVE"));
			featureItems.push(panel);
		});
		return featureItems;
	},
	
	initComponent: function() {
	var thisClass = this;
		thisClass.items = [{
					xtype:'panel',
					items:[{
						xtype: 'panel',
						id : 'siGranularPrivFilterBox',
						layout:'column',
						cls: 'alignCenter',
						margin : '5 5 5 5',
						padding: '10 10 10 10',
						items: [
							{
								xtype : 'AutoCompleter',
								margin : '10 0 0 0',
								cls : 'autoCmplete-field ux_paddingb',
								fieldCls : 'xn-form-text w12 x-form-empty-field',
								id : 'siAccountIDFilterItemId',
								itemId : 'siAccountIDFilterItemId',
								name : 'siAccountIDFilterItemId',
								matchFieldWidth : true,
								labelSeparator : '',
								fieldLabel :  getLabel( 'accountID', 'Account' ),
								cfgUrl : 'services/userseek/accountPackagesSeekForSI.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'siAccountIDFilterItemId',
								cfgRootNode : 'd.preferences',
								cfgKeyNode : 'ID',
								cfgDataNode1 : 'CODE',
								cfgDataNode2 : 'DESCRIPTION',
								cfgStoreFields:['ID','CODE','DESCRIPTION']
								,
								cfgExtraParams : [
								   {
										key : '$filtercode1',
										value : catCorporationCode
									}]
							},{
								xtype : 'AutoCompleter',
								margin : '10 0 0 0',
								cls : 'autoCmplete-field ux_paddingb',
								fieldCls : 'xn-form-text w12 x-form-empty-field',
								id : 'siPayPkgFilterItemId',
								itemId : 'siPayPkgFilterItemId',
								name : 'siPayPkgFilterItemId',
								matchFieldWidth : true,
								labelSeparator : '',
								fieldLabel :  getLabel( 'packageID', 'Package' ),
								cfgUrl : 'services/userseek/packagesSeekForSI.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'siPayPkgFilterItemId',
								cfgRootNode : 'd.preferences',
								cfgKeyNode : 'PKGID',
								cfgDataNode1 : 'PKGNAME',
								cfgStoreFields:['PKGID','PKGNAME']
								,
								cfgExtraParams : [
								   {
										key : '$filtercode1',
										value : catCorporationCode
									}]
							},
							{
								xtype : 'button',
								margin : '10 0 0 40',
								cls : 'xn-button ux_button-background-color ux_search-button',
								glyph : 'xf002@fontawesome',
								text : getLabel( 'btnSearch', 'Search' ),
								itemId :'searchBtnItemId',
								  handler : function(btn,opts) {
										//var me =this;
										thisClass.filterHandler();
			        				}
							}
							
						]
						
						
				  }]
			 },{
	    	xtype: 'container',
			cls : 'border',
			items:[{
					xtype:'panel',
					items:[{
						xtype: 'panel',
						id : 'siGranularPrivColumnHeader',
						layout:'column',
						cls: 'alignCenter',
						margin : '5 5 5 5',
						padding: '5 5 5 5',
						items: thisClass.setColumnHeader()
				  }]
			 },{
			 		xtype:'panel',
			 		//overflowY: 'auto',
					//autoScroll :true,
			 		items:[{
							xtype: 'panel',
							id : 'siGranularPrivHeader',
							layout:'column',
							cls:'red-bg',
							margin : '4 0 0 0',
							items: thisClass.setPanelHeader('siGranularPrivHeader','Account')
						},
						{
							xtype: 'panel',
							overflowY: 'auto',
							//autoScroll :true,
							height : 260,
							titleAlign : "left", 
							//collapsible : true,
							cls : 'xn-ribbon',
							collapseFirst : true,
							itemId : 'siGranPrivParametersSection',
							id : 'siGranPrivParametersSection',
							layout:'column',
							items: thisClass.setSiGranularRights()	
							
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
							objSIGranularPrivPriviligePopup= null;
							//thisClass.hide();
			        				}
			          }
			        ];
		}
		this.callParent(arguments);
	},
	
	filterHandler :function(){
	  var self = this;
	  var filterCode = Ext.getCmp('siAccountIDFilterItemId').getValue();
	  var packageName = Ext.getCmp('siPayPkgFilterItemId').getValue();
	  
	  Ext.getCmp('siGranPrivParametersSection').removeAll();
	   var filterResponse = [];
	   //console.log("filterCode "+filterCode);
		var filteredData ;
		if(filterCode && packageName){
			siGranularFeatureData.forEach(function (arrayElem){ 
				if((arrayElem.accountId === filterCode && arrayElem.packageId === packageName) || (((arrayElem.accountName.toUpperCase().indexOf(filterCode.toUpperCase()) > -1 )|| (arrayElem.accountNo.toUpperCase().indexOf(filterCode.toUpperCase()) > -1)) && (arrayElem.packageName.toUpperCase().indexOf(packageName.toUpperCase()) > -1 ) ) ){
				   //console.log("arrayElem "+arrayElem);
					filterResponse.push(JSON.parse(JSON.stringify(arrayElem)));
				   //break;
				}
			});		
			   filteredData = filterResponse;
		   }	
		else if(packageName){
			 siGranularFeatureData.forEach(function (arrayElem){ 
				if((arrayElem.packageId.toUpperCase() === packageName.toUpperCase()) || (arrayElem.packageName.toUpperCase().indexOf(packageName.toUpperCase()) > -1 )  ){
				   //console.log("arrayElem "+arrayElem);
					filterResponse.push(JSON.parse(JSON.stringify(arrayElem)));
				   //break;
				}
			});		
		
		   filteredData = filterResponse;
			 
		  } 	  
		  else if(filterCode)	{
				siGranularFeatureData.forEach(function (arrayElem){ 
				if((arrayElem.accountId === filterCode) || ((arrayElem.accountName.toUpperCase().indexOf(filterCode.toUpperCase()) > -1 )|| (arrayElem.accountNo.toUpperCase().indexOf(filterCode.toUpperCase()) > -1))  ){
				   //console.log("arrayElem "+arrayElem);
					filterResponse.push(JSON.parse(JSON.stringify(arrayElem)));
				   //break;
				}
			});		
		
		   filteredData = filterResponse;
		  }  		  
		  else{
			filteredData = this.filterFeatures(siGranularFeatureData);
		  }
		
		
		
		var featureItems = [];
		Ext.each(filteredData, function(feature, index) {
			var panel = Ext.create('Ext.panel.Panel', {
				columnWidth:1,
				layout:'column',
				bodyStyle: {
					background: '#FAFAFA'
				}
			});
			var accountText = feature.accountNo + '|'+ feature.accountName;
			panel.insert({xtype: 'label',columnWidth:0.30,text: accountText  ,padding:'5 0 0 10',height:'auto',style : 'word-wrap: break-word'});
			panel.insert({xtype: 'label',columnWidth:0.30,text: feature.packageName  ,padding:'5 0 0 10'});
			panel.insert(self.setPriviligeMenu(feature,"VIEW"));
			panel.insert(self.setPriviligeMenu(feature,"EDIT"));
			panel.insert(self.setPriviligeMenu(feature,"AUTH"));
			panel.insert(self.setPriviligeMenu(feature,"QUICKAPPROVE"));
			featureItems.push(panel);
		});		
		
		 Ext.getCmp('siGranPrivParametersSection').add(featureItems);
	},
	saveItems : function() {	
					var me = this;
					var jsonData = {};
					//var pkgId='NOPKG';
					Ext.each(granularPrivfieldJson, function(field, index) {
						var featureId = field.itemId;
						var accountId =field.accountId;
						var pkgId =field.packageId;
						var element = me.down('checkboxfield[itemId='+featureId+']');
						var objectKey = accountId+'_'+pkgId;
							
						if(element != null && element != undefined && !element.hidden){
										
									var mode = element.mode;
									//console.log("jsonData :"+JSON.stringify(jsonData));
								if(!(objectKey in jsonData)){ 
										//console.log("accountiD adding for first time :"+accountId);
										var newEntry = {};
										newEntry['accountId'] = accountId;
										newEntry['packageId'] = pkgId;
										newEntry['privileges'] = {};
							     		jsonData[objectKey] = newEntry;
									}
									
															
									if('VIEW' == mode){
										jsonData[objectKey]['privileges']['VIEW'] = element.getValue();
									}
									if('EDIT' == mode){
										jsonData[objectKey]['privileges']['EDIT'] = element.getValue();
									}
									if('AUTH' == mode){
										jsonData[objectKey]['privileges']['AUTH'] = element.getValue();
									}
									if('QUICKAPPROVE' == mode){
										jsonData[objectKey]['privileges']['QUICKAPPROVE'] = element.getValue();
									}
									
							}
			});
			
			var jsonObj = {};
			jsonObj['serviceType'] = 'SI';
			jsonObj['moduleCode'] = '02';
			var jsonArray = [];
			//only add those records which are updated
			for (var index  in siGranularFeatureData){
				var orginalObj = siGranularFeatureData[index];
			    var accountId =orginalObj.accountId;
			    var pkgId =orginalObj.packageId;
				var objectKey = accountId+'_'+pkgId;
			  	if((objectKey in jsonData)){ 
                       var newObj = jsonData[objectKey];
					 if(newObj['privileges']['VIEW'] == this.getBooleanvalue(orginalObj.viewFlag)  && 
						 newObj['privileges']['EDIT'] == this.getBooleanvalue(orginalObj.editFlag) &&
						 newObj['privileges']['AUTH'] == this.getBooleanvalue(orginalObj.approveFlag) &&
						 newObj['privileges']['QUICKAPPROVE'] == this.getBooleanvalue(orginalObj.quickApproveFlag) )
					 {
					 // if none of the values are changed no need to push into array
						 
					 }else{
					     jsonArray.push(newObj)
					 }
				
				}
			  
			
			
			}
			
			jsonObj['accountPackagePrivileges'] = jsonArray;
			//console.log("length :"+jsonArray.length);
			//console.log("jsonData :"+JSON.stringify(jsonObj));
				if (!Ext.isEmpty(me.fnCallback)
						&& typeof me.fnCallback == 'function') {
					me.fnCallback(jsonObj);
					me.close();
				}
			}
});