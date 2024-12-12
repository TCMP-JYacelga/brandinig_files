var granularPrivfieldJson = [];
var isFilterApplied = false;
var featureMap = {};
var accountAssignedMap = {};
var allAccountsSelectedFlag = 'N';
Ext.define('GCP.view.ReversalPayGranularPriviligesPopup', {
	extend: 'Ext.window.Window',
	xtype: 'reversalPayGranularPriviligesPopup',
	minWidth : 400,
	maxWidth : 735,
	minHeight : 156,
	maxHeight : 550,
	overflowY: 'auto',
	overflowX: 'auto',
	cls : 'xn-popup',
	title: getLabel('reversalGranularPrivilege','Reversal Granular Privileges'),
	config: {
		modal : true,
		draggable : false,
		resizable:false,
		closeAction : 'hide',
		autoScroll : true,
		fnCallback : null,
		profileId : null,
		featureType : null,
		module : null,
		title : null
	},
	listeners : {
	'resize':function(){
		this.center();
	}
	},
	loadGranularFeaturs: function() {
	var me = this;
		if(mode === "VIEW"){
				Ext.Ajax.request({
					url : 'services/userCategory/accountPackagePrivileges.json',
					method : 'POST',
					async: false,
					params : { module: '02',categoryId:userCategory,serviceType:'RV'},
					success : function(response) {
					 	 reversePayGranularFeatureData = Ext.JSON.decode(response.responseText);
						return reversePayGranularFeatureData; 
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
		
		return reversePayGranularFeatureData;
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
	loadPrivilegesFeaturs: function() {
	var me = this;
		if(mode === "VIEW"){
				Ext.Ajax.request({
					url : 'services/userCategory/previlige.json',
					method : 'POST',
					async: false,
					params : { module: '02',categoryId:userCategory},
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
	loadAccounts: function() {
	var me = this;
		if(mode === "VIEW"){
				Ext.Ajax.request({
					url : 'services/userCategory/accounts.json',
					method : 'POST',
					async: false,
					params : { module: '02',categoryId:userCategory,$inlinecount:'allpages',$top:5000},
					success : function(response) {
					 	 paymentAccountsData = Ext.JSON.decode(response.responseText);
						return paymentAccountsData; 
					},
					failure : function() {
						var errMsg = "";
						Ext.MessageBox.show({
									title : getLabel(
											'instrumentErrorPopUpTitle',
											'Error'),
									msg : getLabel('instrumentErrorPopUpMsg',
											'Error while fetching Accounts data..!'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
					}
				});

		}
		return paymentAccountsData;
	},

	
	getStringBooleanvalue : function(value)
	{
		if(value && value == true)
		{
			return 'Y';
		}
		else
		{
			return 'N';
		}
	},

setPaymentAccounts : function()
	{
		var self = this;
			
		var privdata = self.loadAccounts();
		
		//in case there are no accounts for service check array is empty
		
		var filteredPrivData;
		
		if(privdata!== null  && privdata.length!== 0 ){
			filteredPrivData = privdata.d.details;
		}
		var selectedAccounts  = document.getElementById('selectedAccounts');
		var selectedAccountsObj; 
		if(typeof selectedAccounts!== undefined && selectedAccounts!==null && selectedAccounts.value){
		  selectedAccountsObj = Ext.decode(selectedAccounts.value);
		}
		
		var allPPFlag = document.getElementById('allbRAccountsSelectedFlag');
		if( self.isHiddenElementNotNull(allPPFlag)){
		  self.allAccountsSelectedFlag = allPPFlag.value;
		}
	 
		
		Ext.each(filteredPrivData, function(account, index) {
			var accountKey = account.accountNumber + '|'+ account.accountName;
			var isAssigned = account.isAssigned;
			var prevSelectedAccountObj;
			
			prevSelectedAccountObj = self.getAccountFromSelectedList(selectedAccountsObj,account);
			
			if(typeof prevSelectedAccountObj !== undefined && prevSelectedAccountObj!==null){
			     
				 isAssigned = prevSelectedAccountObj.assigned;
			 }
		
		    accountAssignedMap[accountKey] = isAssigned;
			
			
		});
		
	//console.log("accountAssignedMap :"+accountAssignedMap); 
		
	},
	 getAccountFromSelectedList: function(selectedBRAccountsObj,account){
	 
		 for(key in selectedBRAccountsObj){
		   var accountObj = selectedBRAccountsObj[key][0];
		   
		   if(account.accountNumber == accountObj.accountNumber){
				return accountObj;
		   }	   
		   
		 }
		 return null;
	 },
	
	setPaymentRights : function()
	{
		var self = this;
			
		var privdata = self.loadPrivilegesFeaturs();
		var filteredPrivData = this.filterFeatures(privdata);
		
		var viewRightsSerials  = document.getElementById('viewRightsSerials');
		var editRightsSerials  = document.getElementById('editRightsSerials');
		var authRightsSerials  = document.getElementById('authRightsSerials');
		
		var selectedViewRightsObj,selectedEditRightsObj,selectedAuthRightsObj; 
		
		if( self.isHiddenElementNotNull(viewRightsSerials) ){
		    selectedViewRightsObj = Ext.decode(viewRightsSerials.value);
		}
		
		if( self.isHiddenElementNotNull(editRightsSerials) ){
		    selectedEditRightsObj = Ext.decode(editRightsSerials.value);
		}
		
		if( self.isHiddenElementNotNull(authRightsSerials) ){
		    selectedAuthRightsObj = Ext.decode(authRightsSerials.value);
		}
		
		Ext.each(filteredPrivData, function(feature, index) {
			var key = feature.featureId;
			//var value = feature;
			var rightValue;
			var rmserial = feature.rmSerial;
			
			if(typeof selectedViewRightsObj!== undefined && selectedViewRightsObj){
			    rightValue = undefined;
			   if(selectedViewRightsObj.hasOwnProperty(rmserial)){
			     rightValue = selectedViewRightsObj[rmserial];
			   }
			   if(rightValue!== undefined)
			   feature.canView = self.getStringBooleanvalue(rightValue);
			
			}
			
			if(typeof selectedEditRightsObj!== undefined && selectedEditRightsObj){
			  rightValue = undefined;
			   if(selectedEditRightsObj.hasOwnProperty(rmserial)){
			     rightValue = selectedEditRightsObj[rmserial];
			   }
			   if(rightValue!== undefined)
			   feature.canEdit = self.getStringBooleanvalue(rightValue);
			
			}
			
			if(typeof selectedAuthRightsObj!== undefined && selectedAuthRightsObj){
			  rightValue = undefined;
			   if(selectedAuthRightsObj.hasOwnProperty(rmserial)){
			     rightValue = selectedAuthRightsObj[rmserial];
			   }
			   if(rightValue!== undefined)
			   feature.canAuth = self.getStringBooleanvalue(rightValue);
			
			}
						
			featureMap[key] = feature;
			
		});
		
		
		
		},
		
	reconfigure : function(){
		var thisClass = this;
		var searchField=Ext.getCmp('reversePayAccountIDFilterItemId');
		if(searchField!="" && searchField!=undefined)
		searchField.setRawValue('');
		Ext.getCmp('reversalPayGranPrivParametersSection').removeAll();
		Ext.getCmp('reversalPayGranularPrivHeader').removeAll();
		Ext.getCmp('reversalPayGranularPrivColumnHeader').removeAll();
		
		
		thisClass.setPaymentRights();
		thisClass.setPaymentAccounts();
		
		Ext.getCmp('reversalPayGranPrivParametersSection').add(thisClass.setUserReversalPayGranularRights() );
		Ext.getCmp('reversalPayGranularPrivHeader').add(thisClass.setPanelHeader('reversalPayGranularPrivHeader',getLabel('lbl.account','Account')));
		Ext.getCmp('reversalPayGranularPrivColumnHeader').add(thisClass.setColumnHeader());
	
	
	
	},	
	isHiddenElementNotNull: function(object){
	
	  if(typeof object!== undefined &&  object!==null && object.value){
	     return true;
	  }
	  return false;
	},
	
	updateFeatureIfPreviouslySelected:function( feature ,previouslySubmitedJsonObj) {
			 
		 for(key in previouslySubmitedJsonObj.accountPackagePrivileges){
			var previousSelectedObj = previouslySubmitedJsonObj.accountPackagePrivileges[key];
			if ( previousSelectedObj.accountId == feature.accountId && previousSelectedObj.packageId == feature.packageId)
			{
				if(previousSelectedObj.privileges.hasOwnProperty("VIEW") )
				 {
					feature.viewFlag = previousSelectedObj.privileges.VIEW ? true:false;
				  }
				 if(previousSelectedObj.privileges.hasOwnProperty("EDIT") )
				 {
					feature.editFlag = previousSelectedObj.privileges.EDIT ? true:false;
				  }
				
				if(previousSelectedObj.privileges.hasOwnProperty("AUTH") )
				 {
					feature.approveFlag = previousSelectedObj.privileges.AUTH ? true:false;
				  }	
				  
				/*if(previousSelectedObj.privileges.hasOwnProperty("QUICKAPPROVE") )
				 {
					feature.quickApproveFlag = previousSelectedObj.privileges.QUICKAPPROVE ? true:false;
				  }*/						  
					
				
			}
		  }
			 
		

	},
	
	setColumnHeader : function(serviceType)
	{
		var featureItems = [];
		featureItems.push({xtype: 'label',text:getLabel('lbl.type',"Type"),padding:'0 0 0 0',cls:'boldText label-lineHeight granular-privilege-label privilege-grid-main-header privilege-grid-type-label granular-privilege-type'});
		 if(featureMap["RVAL"] != undefined ) {
			if(featureMap["RVAL"].canView == 'Y' ){
		featureItems.push({xtype: 'label',text:getLabel("view","View"),padding:'0 0 0 5',cls:'boldText label-lineHeight granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
		}
		if(featureMap["RVAL"].canEdit == 'Y' ){
		featureItems.push({xtype: 'label',text:getLabel("edit","Edit"),padding:'0 0 0 5',cls:'boldText label-lineHeight granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
		}
		//if(featureMap["RVAL"].canEdit == 'Y' ){
		//featureItems.push({xtype: 'label',text: "Delete",padding:'0 0 0 5',cls:'boldText background'});
		//}
		if(featureMap["RVAL"].canAuth == 'Y' ){
			featureItems.push({xtype: 'label',text:getLabel("approve","Approve"),padding:'0 0 0 5',cls:'boldText label-lineHeight granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
		
		}
		//featureItems.push({xtype: 'label',text: "Detail Approve",padding:'0 0 0 5',cls:'boldText background'});
		}
		return featureItems;
	},
	setPanelHeader : function(id, title)
	{
		var featureItems = [];
		featureItems.push({xtype: 'label',text: getLabel('lbl.account','Account'),padding:'8 0 0 10',cls:'boldText granular-privilege-accountno granular-privilege-account-header',height:35 });
		featureItems.push({xtype: 'label',text: getLabel('accountName','Account Name'),padding:'8 0 0 10',cls:'boldText granular-privilege-accountno granular-privilege-account-header',height:35});
		 if(featureMap["RVAL"] != undefined ) {
			if(featureMap["RVAL"].canView == 'Y' ){
		/*featureItems.push({xtype: 'button',icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 20',width : 15, height : 20, itemId : id+"_viewIcon", border : 0,cls:'btn'});*/
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_viewIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});
		
		}
		if(featureMap["RVAL"].canEdit == 'Y' ){
		/*featureItems.push({xtype: 'button',icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 35',width : 15, height : 20, itemId : id+"_editIcon", border : 0,cls:'btn'});*/
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_editIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});
		
		}
		
		/*if(featureMap["RVAL"].canEdit == 'Y' ){
		featureItems.push({xtype: 'button',icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 45',width : 15, height : 20, itemId : id+"_deleteIcon", border : 0,cls:'btn'});
		//}*/
		
		if(featureMap["RVAL"].canAuth == 'Y' ){
		/*featureItems.push({xtype: 'button',icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 35',width : 15, height : 20, itemId : id+"_authIcon", border : 0,cls:'btn'});*/
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_authIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});
		
		/*featureItems.push({xtype: 'button',columnWidth:0.15,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 45',width : 15, height : 20, itemId : id+"_quickApproveIcon", border : 0,cls:'btn'});*/
		}
		
		}
	
	return featureItems;
	},
	
	setPriviligeMenu : function(feature,MODE,index)
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
		}
		/*else if(MODE == 'QUICKAPPROVE')
		{	
			
			obj.checked = this.getBooleanvalue(feature.quickApproveFlag);
		}else if(MODE == 'DELETE')
		{	
			
			obj.checked = this.getBooleanvalue(feature.deleteFlag);
		}*/
		
		obj.xtype="checkbox";
		if(index%2==0)
			obj.cls = 'granular-cellContent privilege-grid-odd granular-privilege-headers';
			else
			obj.cls = 'granular-cellContent privilege-grid-even granular-privilege-headers';
		//obj.columnWidth='0.10';
		obj.padding='0 0 0 0';
		obj.height=25;
		obj.itemId = feature.accountId+"_"+MODE;
		obj.mode = MODE;
		obj.accountId = feature.accountId;
		obj.packageId = feature.packageId;
		obj.checkChange = function(){
			var panelPointer = this.up('panel');
			checkReversalGranularViewIfNotSelected(this.value,panelPointer,obj);
		}
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
	
	setUserReversalPayGranularRights : function()
	{
		var self = this;
		var data = self.loadGranularFeaturs();
		var filteredData = this.filterFeatures(data);
		var featureItems = [];
		featureItems = self.createPrivilegesContainer(filteredData);
		return featureItems;
	},
	
	filterHandler :function(){
	  var self = this;
	  var filterCode = Ext.getCmp('reversePayAccountIDFilterItemId').getValue();
	  
	  Ext.getCmp('reversalPayGranPrivParametersSection').removeAll();
	   var filterResponse = [];
	   //console.log("filterCode "+filterCode);
		var filteredData ;
		if(filterCode)	{
			reversePayGranularFeatureData.forEach(function (arrayElem){ 
			if( (arrayElem.accountId === filterCode) || ((arrayElem.accountName.toUpperCase().indexOf(filterCode.toUpperCase()) > -1 )|| (arrayElem.accountNo.toUpperCase().indexOf(filterCode.toUpperCase()) > -1)) ){
			//console.log("arrayElem "+arrayElem);
			filterResponse.push(JSON.parse(JSON.stringify(arrayElem)));
			 //break;
			}
		});		
		
		   filteredData = filterResponse;
		   isFilterApplied =true;
		  }else{
			filteredData = this.filterFeatures(reversePayGranularFeatureData);
			 isFilterApplied =false;
		  }
		
		
		
		var featureItems = [];
		featureItems = self.createPrivilegesContainer(filteredData);
		 Ext.getCmp('reversalPayGranPrivParametersSection').add(featureItems);
	
	},
	
	createPrivilegesContainer : function(filteredData){
	var self = this;
	var featureItems = [];
	//priviously submited granular Permissiong
	var prevPositivePayGranularPermissions = document.getElementById("reversalPayGranularPermissions");
	

	Ext.each(filteredData, function(feature, index) {
			var panel = Ext.create('Ext.panel.Panel', {
				columnWidth:1,
				layout:'column',
				bodyStyle: {
					background: '#FAFAFA'
				}
			});
			var accountText = feature.accountNo + '|'+ feature.accountName;
			
			if(self.allAccountsSelectedFlag == 'Y' || accountAssignedMap[accountText] == true) {
			
			panel.insert({xtype: 'label',text: feature.accountNo  ,padding:'5 0 0 20',height:'auto',cls:'ux_text-elipsis granular-privilege-accountno privilege-grid-main-header privilege-grid-odd privilege-admin-rights', autoEl: {
                tag: 'label',
                'data-qtip': feature.accountNo
            } });
			panel.insert({xtype: 'label',text: feature.accountName  ,padding:'5 0 0 20',height:'auto',cls:'ux_text-elipsis granular-privilege-accountno privilege-grid-odd privilege-admin-rights', autoEl: {
                tag: 'label',
                'data-qtip': feature.accountName
            } });
			
			/*panel.insert({xtype: 'label',columnWidth:0.35,text: feature.accountNo  ,padding:'5 0 0 10',height:'auto',cls:'ux_text-elipsis', autoEl: {
                tag: 'label',
                'data-qtip': feature.accountNo
            } });
			panel.insert({xtype: 'label',columnWidth:0.35,text: feature.accountName  ,padding:'5 0 0 10',height:'auto',cls:'ux_text-elipsis', autoEl: {
                tag: 'label',
                'data-qtip': feature.accountName
            } });*/
			
				if( self.isHiddenElementNotNull(prevPositivePayGranularPermissions) ){
						var previouslySubmitedJsonObj =  Ext.decode(prevPositivePayGranularPermissions.value);
						self.updateFeatureIfPreviouslySelected(feature,previouslySubmitedJsonObj);
					
					}
		
			
		 if(featureMap["RVAL"] != undefined ) {
			if(featureMap["RVAL"].canView == 'Y' ){
				panel.insert(self.setPriviligeMenu(feature,"VIEW",index));
			}
			if(featureMap["RVAL"].canEdit == 'Y' ){
			panel.insert(self.setPriviligeMenu(feature,"EDIT",index));
			}
			
			//if(featureMap["RVAL"].canEdit == 'Y' ){
			//panel.insert(self.setPriviligeMenu(feature,"DELETE"));
			//}
			
			if(featureMap["RVAL"].canAuth == 'Y' ){
			panel.insert(self.setPriviligeMenu(feature,"AUTH",index));
			//panel.insert(self.setPriviligeMenu(feature,"QUICKAPPROVE"));
			}
			
			}
			
		
			featureItems.push(panel);
			
			}
		});
		
		for(var i=0;i<featureItems.length;i++){
				var panels=featureItems[i];
				var panelId=Ext.getCmp(panels.id);
				if(i%2==0){ //white privilege-grid-odd
					for(var j=0;j<panels.items.items.length;j++){
						if(panels.items.items[j].hasCls('privilege-grid-even')){
							panels.items.items[j].removeCls('privilege-grid-even');
							panels.items.items[j].addCls('privilege-grid-odd');
						}
					}
				}
				else{ //grey privilege-grid-even
					for(var k=0;k<panels.items.items.length;k++){
						if(panels.items.items[k].hasCls('privilege-grid-odd')){
							panels.items.items[k].removeCls('privilege-grid-odd');
							panels.items.items[k].addCls('privilege-grid-even');
						}
					}
				}
			}
		
		return featureItems;

	},
	
	initComponent: function() {
	var thisClass = this;
	thisClass.setPaymentRights();
	thisClass.setPaymentAccounts();
		thisClass.items = [{
					xtype:'panel',
					width : 'auto',
					items:[{
						xtype: 'panel',
						width : 'auto',
						id : 'ReversalPayGranularPrivFilterBox',
						layout:'column',
						cls: 'ft-padding-bottom',
						items: [
							{
								xtype : 'AutoCompleter',
								//margin : '0 0 12 0',
								//cls : 'autoCmplete-field ux_paddingb',
								fieldCls : 'xn-form-text xn-suggestion-box granular-autocompleter',
								id : 'reversePayAccountIDFilterItemId',
								itemId : 'reversePayAccountIDFilterItemId',
								name : 'reversePayAccountIDFilterItemId',
								matchFieldWidth : true,
								labelSeparator : '',
								//fieldLabel :  getLabel( 'accountID', 'Account' ),
								cfgUrl : 'services/userseek/accountSeekForReversalPay.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'reversePayAccountIDFilterItemId',
								cfgRootNode : 'd.preferences',
								cfgKeyNode : 'ID',
								cfgDataNode1 : 'DESCRIPTION',
								cfgStoreFields:['ID','CODE','DESCRIPTION']
								,
								cfgExtraParams : [
								   {
										key : '$filtercode1',
										value : catCorporationCode
									}],
									emptyText : getLabel('searchByAccNumberOrName','Search by Account number or name'),
								listeners : {
								'select':function(){
									thisClass.filterHandler(); 
									var selected = thisClass.down('component[itemId="clearLink"]');
          								  selected.show();									
								 },
								   'change':function(){
									 var filterContainer = thisClass.down('[itemId="reversePayAccountIDFilterItemId"]');
								   if(Ext.isEmpty(filterContainer.getValue())){
										var selected = thisClass.down('component[itemId="clearLink"]');
										selected.hide();
									  thisClass.filterHandler();
									  }
								 }
							 }
							},
							{
								xtype : 'component',
								layout : 'hbox',
								itemId : 'clearLink',
								hidden : true,
								cls : 'clearlink-a cursor_pointer page-content-font ft-padding-l',
								html: '<a>'+getLabel('clear','Clear')+'</a>',
								listeners: {
									'click': function() {
										var filterContainer = thisClass.down('[itemId="reversePayAccountIDFilterItemId"]');
										filterContainer.setValue("");
										var selected = thisClass.down('component[itemId="clearLink"]');
										selected.hide();
									},
									element: 'el',
									delegate: 'a'
								}
							}
							/*{
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
							}*/
							
						]
						
						
				  }]
			 },{
	    	xtype: 'container',
	    	width : 'auto',
	    	cls : 'privilege gran-privilege',
	    	overflowX: 'auto',
			overflowY: 'hidden',
			items:[{
					xtype:'panel',
					width : 'auto',
					items:[{
						xtype: 'panel',
						width : 'auto',
						id : 'reversalPayGranularPrivColumnHeader',
						layout: {
					        type: 'hbox'
					    },
						cls: 'mainHeader',
						padding: '0 0 0 10',
						items: thisClass.setColumnHeader()
				  }]
			 },{
			 		xtype:'panel',
					maxHeight : 1000,
					//overflowY:'auto',
					width : 'auto',		
					layout: {
						        type: 'vbox'
						    },
			 		items:[{
							xtype: 'panel',
							width : 'auto',
							id : 'reversalPayGranularPrivHeader',
							layout: {
						        type: 'column'
						    },
							cls:'red-bg',
							height : 35,
							items: thisClass.setPanelHeader('reversalPayGranularPrivHeader',getLabel('lbl.account','Account'))
						},
						{
							xtype: 'panel',
							//maxHeight : 300,
							width : 'auto',
							//maxWidth : thisClass.max_width,
							titleAlign : "left", 
							//collapsible : true,
							cls : 'xn-ribbon',
							collapseFirst : true,
							itemId : 'reversalPayGranPrivParametersSection',
							id : 'reversalPayGranPrivParametersSection',
							layout: {
							        type: 'vbox'
							    },
							items: thisClass.setUserReversalPayGranularRights()
						}]
			 }]
		}];
		if(mode === "VIEW"){
			thisClass.bbar=[
			          '->',{ 
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
							objReversalPayGranularPrivPriviligePopup= null;
							//thisClass.hide();
			        				}
			          }, '->',
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
									
															
									if('VIEW' == mode){
										jsonData[objectKey]['privileges']['VIEW'] = element.getValue();;
									}
									if('EDIT' == mode){
										jsonData[objectKey]['privileges']['EDIT'] = element.getValue();;
									}
									if('AUTH' == mode){
										jsonData[objectKey]['privileges']['AUTH'] = element.getValue();;
									}
									/*if('QUICKAPPROVE' == mode){
										jsonData[objectKey]['privileges']['QUICKAPPROVE'] = element.getValue();;
									}
									
									if('DELETE' == mode){
										jsonData[objectKey]['privileges']['DELETE'] = element.getValue();;
									}*/
									for(var mode in jsonData[objectKey]['privileges']) {
										if( !jsonData[objectKey]['privileges']['VIEW'] && jsonData[objectKey]['privileges'][mode]){
										   	jsonData[objectKey]['privileges']['VIEW'] = true;
										   	break;
										}
									}
							}
			});
			
			var jsonObj = {};
			jsonObj['serviceType'] = 'RV';
			jsonObj['moduleCode'] = '02';
			//console.log("available jsonData :"+JSON.stringify(jsonData));
			var jsonArray = [];
			//only add those records which are updated
			for (var index  in reversePayGranularFeatureDataBackup){
				var orginalObj = reversePayGranularFeatureDataBackup[index];
			    var accountId =orginalObj.accountId;
			    var pkgId =orginalObj.packageId;
				var objectKey = accountId+'_'+pkgId;
				var recordKeyNo = orginalObj.recordKeyNo;
			  	if((objectKey in jsonData)){ 
                       var newObj = jsonData[objectKey];
					 if( newObj['privileges']['VIEW'] == this.getBooleanvalue(orginalObj.viewFlag)  && 
						 newObj['privileges']['EDIT'] == this.getBooleanvalue(orginalObj.editFlag) &&
						 newObj['privileges']['AUTH'] == this.getBooleanvalue(orginalObj.approveFlag) 
						 /*&&
						 newObj['privileges']['QUICKAPPROVE'] == this.getBooleanvalue(orginalObj.quickApproveFlag)&&
						 newObj['privileges']['DELETE'] == this.getBooleanvalue(orginalObj.deleteFlag) */)
					 {
					 // if none of the values are changed no need to push into array
						 
					 }else{
					     jsonArray.push(newObj)
					 }
				}else{
				
						//recordKeyNo of record means its saved in db and if its not found in jsonData (i.e currently present in rows on screen) then make all flag N for that account
					
						if(recordKeyNo!== undefined && recordKeyNo!=null && recordKeyNo && !isFilterApplied)
						{
						
							if(  false  ===  this.getBooleanvalue(orginalObj.viewFlag)  && 
								 false  ===  this.getBooleanvalue(orginalObj.editFlag) &&
								 false  ===  this.getBooleanvalue(orginalObj.approveFlag) 
								 /*&&
								 false  ===  this.getBooleanvalue(orginalObj.quickApproveFlag) &&
								 false  ===  this.getBooleanvalue(orginalObj.deleteFlag)*/ )
							 {
							 // if all flags are N means record is previously removed no need to add into deleted array 
								 
							 }else{
								var newEntry = {};
								newEntry['accountId'] = accountId;
								newEntry['packageId'] = pkgId;
								var privileges = {'VIEW':false,'EDIT':false,'AUTH':false/*,'QUICKAPPROVE':false,'DELETE':false*/};
								newEntry['privileges'] = privileges;
								
								jsonArray.push(newEntry);
							 }
							
						}
				
				}
			}
			
			
			
			jsonObj['accountPackagePrivileges'] = jsonArray;
			//console.log("after adding deleted rows /columns length :"+jsonArray.length);
			//console.log("final jsonObj :"+JSON.stringify(jsonObj));
				if (!Ext.isEmpty(me.fnCallback)
						&& typeof me.fnCallback == 'function') {
					me.fnCallback(jsonObj);
					me.close();
				}
			}
});
function checkReversalGranularViewIfNotSelected(isSelected,panelPointer,obj){
	if(null != panelPointer && undefined != panelPointer){
		if (isSelected){
			var viewItemId =obj.accountId+"_VIEW";
			var view_chk_box = panelPointer.down('checkbox[itemId='+viewItemId+']');
			if(null != view_chk_box && undefined != view_chk_box && view_chk_box.value== false){
				view_chk_box.setValue(true);
			}
		}else{
			if("VIEW"===obj.mode){
				var editIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + '_EDIT' +']');
				if( editIconItemId )
				{
					editIconItemId.setValue( false );
					editIconItemId.defVal = false;
				}
				var authIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + '_AUTH' +']');
				if( authIconItemId )
				{
					authIconItemId.setValue( false );
					authIconItemId.defVal = false;
				}
			}
		}
	}
}