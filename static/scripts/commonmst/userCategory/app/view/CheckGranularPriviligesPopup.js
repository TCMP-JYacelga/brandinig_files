var granularPrivfieldJson = [];
//var granularFeatureData;
Ext.define('GCP.view.CheckGranularPriviligesPopup', {
	extend: 'Ext.window.Window',
	xtype: 'checkGranularPriviligesPopup',
	width : 1000,
	height : 500,
	title: 'Check Management Granular Privileges',

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
					params : { module: '14',categoryId:userCategory,serviceType:'CM'},
					success : function(response) {
					 	 granularFeatureData = Ext.JSON.decode(response.responseText);
						return granularFeatureData; 
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
		
		return granularFeatureData;
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
		featureItems.push({xtype: 'label',columnWidth:0.50,text: "Type",padding:'0 0 0 0',cls:'boldText background'});
		featureItems.push({xtype: 'label',columnWidth:0.10,text: "Inquiry",padding:'0 0 0 5',cls:'boldText background'});
		featureItems.push({xtype: 'label',columnWidth:0.10,text: "Stop Pay",padding:'0 0 0 5',cls:'boldText background'});
		featureItems.push({xtype: 'label',columnWidth:0.10,text: "Cancel StopPay",padding:'0 0 0 5',cls:'boldText background'});
		featureItems.push({xtype: 'label',columnWidth:0.10,text: "Cancel Approve",padding:'0 0 0 5',cls:'boldText background'});
		featureItems.push({xtype: 'label',columnWidth:0.10,text: "StopPay Approve",padding:'0 0 0 5',cls:'boldText background'});
		return featureItems;
	},
	
	setPanelHeader : function(id, title)
	{
		var featureItems = [];
		featureItems.push({xtype: 'label',columnWidth:0.50,text: title,padding:'5 0 0 10',cls:'boldText'});
		featureItems.push({xtype: 'button',columnWidth:0.10,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 38',width : 15, height : 20, itemId : id+"_inquiryIcon", border : 0,cls:'btn'});
		featureItems.push({xtype: 'button',columnWidth:0.10,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 73',width : 10, height : 20, itemId : id+"_stopPayIcon", border : 0,cls:'btn'});
		featureItems.push({xtype: 'button',columnWidth:0.10,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 74',width : 15, height : 20, itemId : id+"_cancelStopPayIcon", border : 0,cls:'btn'});
		featureItems.push({xtype: 'button',columnWidth:0.10,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 73',width : 10, height : 20, itemId : id+"_cancelApproveIcon", border : 0,cls:'btn'});
		featureItems.push({xtype: 'button',columnWidth:0.10,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 74',width : 15, height : 20, itemId : id+"_stopPayApproveIcon", border : 0,cls:'btn'});
		
		return featureItems;
	},
	setPriviligeMenu : function(feature,MODE)
	{
		var obj = new Object();
		if(MODE == 'INQUIRY')
		{
			
			obj.checked = this.getBooleanvalue(feature.inquiryFlag);
		}
		else if(MODE == 'STOPPAY')
		{	
			
			obj.checked = this.getBooleanvalue(feature.stoppayFlag);
		}
		else if(MODE == 'CANCELSTOPPAY')
		{
			
			obj.checked = this.getBooleanvalue(feature.cancelStoppayFlag);
		}else if(MODE == 'STOPPAYAPPROVE')
		{	
			
			obj.checked = this.getBooleanvalue(feature.stoppayApproveFlag);
		}
		else if(MODE == 'CANCELSTOPPAYAPPROVE')
		{
			
			obj.checked = this.getBooleanvalue(feature.cancelStoppayApproveFlag);
		}
		obj.xtype="checkbox";
		obj.cls = 'cellContent';
		obj.columnWidth='0.10';
		obj.padding='0 0 0 0';
		obj.itemId = feature.accountId+"_"+MODE;
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
	
	setUserCheckGranularRights : function()
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
			panel.insert({xtype: 'label',columnWidth:0.50,text: accountText  ,padding:'5 0 0 10'});
			panel.insert(self.setPriviligeMenu(feature,"INQUIRY"));
			panel.insert(self.setPriviligeMenu(feature,"STOPPAY"));
			panel.insert(self.setPriviligeMenu(feature,"CANCELSTOPPAY"));
			panel.insert(self.setPriviligeMenu(feature,"CANCELSTOPPAYAPPROVE"));
			panel.insert(self.setPriviligeMenu(feature,"STOPPAYAPPROVE"));
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
						id : 'checkGranularPrivFilterBox',
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
								id : 'checkAccountIDFilterItemId',
								itemId : 'checkAccountIDFilterItemId',
								name : 'checkAccountIDFilterItemId',
								matchFieldWidth : true,
								labelSeparator : '',
								fieldLabel :  getLabel( 'accountID', 'Account' ),
								cfgUrl : 'services/userseek/accountSeekForChecks.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'checkAccountIDFilterItemId',
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
						id : 'checkGranularPrivColumnHeader',
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
							id : 'checkGranularPrivHeader',
							layout:'column',
							cls:'red-bg',
							margin : '4 0 0 0',
							items: thisClass.setPanelHeader('checkGranularPrivHeader','Account')
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
							itemId : 'checkGranPrivParametersSection',
							id : 'checkGranPrivParametersSection',
							layout:'column',
							items: thisClass.setUserCheckGranularRights()	
							
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
							objChecksGranularPrivPriviligePopup= null;
							//thisClass.hide();
			        				}
			          }
			        ];
		}
		this.callParent(arguments);
	},
	
	filterHandler :function(){
	  var self = this;
	  var filterCode = Ext.getCmp('checkAccountIDFilterItemId').getValue();
	  Ext.getCmp('checkGranPrivParametersSection').removeAll();
	  var filterResponse = [];
	   //console.log("filterCode "+filterCode);
		var filteredData ;
		if(filterCode)	{
			granularFeatureData.forEach(function (arrayElem){ 
				if( (arrayElem.accountId === filterCode) || ((arrayElem.accountName.toUpperCase().indexOf(filterCode.toUpperCase()) > -1 )|| (arrayElem.accountNo.toUpperCase().indexOf(filterCode.toUpperCase()) > -1)) ){
				//console.log("arrayElem "+arrayElem);
				filterResponse.push(JSON.parse(JSON.stringify(arrayElem)));
				 //break;
				}
			});		
		
		   filteredData = filterResponse;
		  }else{
			filteredData = this.filterFeatures(granularFeatureData);
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
			panel.insert({xtype: 'label',columnWidth:0.50,text: accountText  ,padding:'5 0 0 10'});
			panel.insert(self.setPriviligeMenu(feature,"INQUIRY"));
			panel.insert(self.setPriviligeMenu(feature,"STOPPAY"));
			panel.insert(self.setPriviligeMenu(feature,"CANCELSTOPPAY"));
			panel.insert(self.setPriviligeMenu(feature,"CANCELSTOPPAYAPPROVE"));
			panel.insert(self.setPriviligeMenu(feature,"STOPPAYAPPROVE"));
			featureItems.push(panel);
		});		
		
		 Ext.getCmp('checkGranPrivParametersSection').add(featureItems);
	
	},
	saveItems : function() {	
					var me = this;
					var jsonData = {};
					var pkgId='DEFAULT';
					Ext.each(granularPrivfieldJson, function(field, index) {
						var featureId = field.itemId;
						var accountId =field.accountId;
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
									
															
									if('INQUIRY' == mode){
										//viewSerials[field.accountId] = element.getValue();
										jsonData[objectKey]['privileges']['INQUIRY'] = element.getValue();;
									}
									if('STOPPAY' == mode){
										//editSerials[field.accountId] = element.getValue();
										jsonData[objectKey]['privileges']['STOPPAY'] = element.getValue();;
									}
									if('CANCELSTOPPAY' == mode){
										//authSerials[field.accountId] = element.getValue();
										jsonData[objectKey]['privileges']['CANCELSTOPPAY'] = element.getValue();;
									}
									if('CANCELSTOPPAYAPPROVE' == mode){
										//viewSerials[field.accountId] = element.getValue();
										jsonData[objectKey]['privileges']['CANCELSTOPPAYAPPROVE'] = element.getValue();;
									}
									if('STOPPAYAPPROVE' == mode){
										//editSerials[field.accountId] = element.getValue();
										jsonData[objectKey]['privileges']['STOPPAYAPPROVE'] = element.getValue();;
									}
								
							}
			});
			
			var jsonObj = {};
			jsonObj['serviceType'] = 'CM';
			jsonObj['moduleCode'] = '14';
			var jsonArray = [];
			//only add those records which are updated
			for (var index  in granularFeatureData){
				var orginalObj = granularFeatureData[index];
			    var accountId =orginalObj.accountId;
			    var pkgId =orginalObj.packageId;
				var objectKey = accountId+'_'+pkgId;
			  	if((objectKey in jsonData)){ 
                       var newObj = jsonData[objectKey];
					 if( newObj['privileges']['INQUIRY'] == this.getBooleanvalue(orginalObj.inquiryFlag)  && 
						 newObj['privileges']['STOPPAY'] == this.getBooleanvalue(orginalObj.stoppayFlag) && 
						 newObj['privileges']['CANCELSTOPPAY'] == this.getBooleanvalue(orginalObj.cancelStoppayFlag) &&
						 newObj['privileges']['CANCELSTOPPAYAPPROVE'] == this.getBooleanvalue(orginalObj.cancelStoppayApproveFlag) && 
						 newObj['privileges']['STOPPAYAPPROVE'] == this.getBooleanvalue(orginalObj.stoppayApproveFlag) )
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