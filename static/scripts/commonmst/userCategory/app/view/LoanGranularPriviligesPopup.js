var granularPrivfieldJson = [];
//var granularFeatureData;
Ext.define('GCP.view.LoanGranularPriviligesPopup', {
	extend: 'Ext.window.Window',
	xtype: 'loanGranularPriviligesPopup',
	width : 700,
	height : 500,
	title: 'Loan Granular Privileges',

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
					params : { module: '07',categoryId:userCategory,serviceType:'LN'},
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
		featureItems.push({xtype: 'label',columnWidth:0.25,text: "Advance",padding:'0 0 0 5',cls:'boldText background'});
		featureItems.push({xtype: 'label',columnWidth:0.20,text: "Pay Down",padding:'0 0 0 5',cls:'boldText background'});
		return featureItems;
	},

	setPanelHeader : function(id, title)
	{
		var featureItems = [];
		featureItems.push({xtype: 'label',columnWidth:0.50,text: title,padding:'5 0 0 10',cls:'boldText'});
		featureItems.push({xtype: 'button',columnWidth:0.25,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 65',width : 15, height : 20, itemId : id+"_advanceIcon", border : 0,cls:'btn'});
		featureItems.push({xtype: 'button',columnWidth:0.25,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 140',width : 10, height : 20, itemId : id+"_payDownIcon", border : 0,cls:'btn'});
		return featureItems;
	},
	setPriviligeMenu : function(feature,MODE)
	{
		var obj = new Object();
		if(MODE == 'ADVANCE')
		{
			
			obj.checked = this.getBooleanvalue(feature.advanceFlag);
		}
		else if(MODE == 'PAYDOWN')
		{	
			
			obj.checked = this.getBooleanvalue(feature.paydownFlag);
		}
		
		obj.xtype="checkbox";
		obj.cls = 'cellContent';
		obj.columnWidth='0.25';
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
	
	setUserLoanGranularRights : function()
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
			panel.insert(self.setPriviligeMenu(feature,"ADVANCE"));
			panel.insert(self.setPriviligeMenu(feature,"PAYDOWN"));
			featureItems.push(panel);
		});
		return featureItems;
	},
		filterHandler :function(){
	  var self = this;
	  var filterCode = Ext.getCmp('loanAccountIDFilterItemId').getValue();
	  
	  Ext.getCmp('loanGranPrivParametersSection').removeAll();
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
			panel.insert(self.setPriviligeMenu(feature,"ADVANCE"));
			panel.insert(self.setPriviligeMenu(feature,"PAYDOWN"));
			featureItems.push(panel);
		});		
		
		 Ext.getCmp('loanGranPrivParametersSection').add(featureItems);
	
	},
	
	initComponent: function() {
	var thisClass = this;
		thisClass.items = [{
					xtype:'panel',
					items:[{
						xtype: 'panel',
						id : 'loanGranularPrivFilterBox',
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
								id : 'loanAccountIDFilterItemId',
								itemId : 'loanAccountIDFilterItemId',
								name : 'loanAccountIDFilterItemId',
								matchFieldWidth : true,
								labelSeparator : '',
								fieldLabel :  getLabel( 'accountID', 'Account' ),
								cfgUrl : 'services/userseek/accountSeekForLoan.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'loanAccountIDFilterItemId',
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
						id : 'loanGranularPrivColumnHeader',
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
							id : 'loanGranularPrivHeader',
							layout:'column',
							cls:'red-bg',
							margin : '4 0 0 0',
							items: thisClass.setPanelHeader('loanGranularPrivHeader','Account')
						},
						{
							xtype: 'panel',
							overflowY: 'auto',
							//autoScroll :true,
							height : 260,
							//title: getLabel('granularPrivileges','Positive Pay'),
							titleAlign : "left", 
							//collapsible : true,
							cls : 'xn-ribbon',
							collapseFirst : true,
							itemId : 'loanGranPrivParametersSection',
							id : 'loanGranPrivParametersSection',
							layout:'column',
							items: thisClass.setUserLoanGranularRights()	
							
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
							objLoanGranularPrivPriviligePopup= null;
							//thisClass.hide();
			        				}
			          }
			        ];
		}
		this.callParent(arguments);
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
									
									if('ADVANCE' == mode){
										jsonData[objectKey]['privileges']['ADVANCE'] = element.getValue();;
									}
									if('PAYDOWN' == mode){
										jsonData[objectKey]['privileges']['PAYDOWN'] = element.getValue();;
									}
									
							}
			});
			
			var jsonObj = {};
			jsonObj['serviceType'] = 'LN';
			jsonObj['moduleCode'] = '07';
			var jsonArray = [];
			//only add those records which are updated
			for (var index  in granularFeatureData){
				var orginalObj = granularFeatureData[index];
			    var accountId =orginalObj.accountId;
			    var pkgId =orginalObj.packageId;
				var objectKey = accountId+'_'+pkgId;
			  	if((objectKey in jsonData)){ 
                       var newObj = jsonData[objectKey];
					 if( newObj['privileges']['ADVANCE'] == this.getBooleanvalue(orginalObj.advanceFlag)  && 
						 newObj['privileges']['PAYDOWN'] == this.getBooleanvalue(orginalObj.paydownFlag)  )
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
			
				if (!Ext.isEmpty(me.fnCallback) && typeof me.fnCallback == 'function') {
					me.fnCallback(jsonObj);
					me.close();
				}
			}
});