var granularPrivfieldJson = [];
var featureMap = {};
var accountAssignedMap = {};
var allPPAccountsSelectedFlag = 'N';
var isFilterApplied=false;
//var granularFeatureData;
Ext.define('GCP.view.PositivePayGranularPriviligesPopup', {
	extend: 'Ext.window.Window',
	xtype: 'positivePayGranularPriviligesPopup',
	minWidth : 400,
	maxWidth : 735,
	minHeight : 156,
	maxHeight : 550,
	overflowY: 'auto',
	overflowX: 'auto',
	cls : 'xn-popup',
	title: getLabel('positivePayGranularPrivileges','Positive Pay Granular Privileges'),

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
	
	loadGranularFeaturs: function() {
	var me = this;
		if(mode === "VIEW"){
				Ext.Ajax.request({
					url : 'services/userCategory/accountPackagePrivileges.json',
					method : 'POST',
					async: false,
					params : { module: '13',categoryId:userCategory,serviceType:'PP'},
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
	loadPrivilegesFeaturs: function() {
	var me = this;
		if(mode === "VIEW"){
				Ext.Ajax.request({
					url : 'services/userCategory/previlige.json',
					method : 'POST',
					async: false,
					params : { module: '13',categoryId:userCategory},
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
	loadPPAccounts: function() {
	var me = this;
		if(mode === "VIEW"){
				Ext.Ajax.request({
					url : 'services/userCategory/accounts.json',
					method : 'POST',
					async: false,
					params : { module: '13',categoryId:userCategory,$inlinecount:'allpages',$top:5000},
					success : function(response) {
					 	 ppAccountsData = Ext.JSON.decode(response.responseText);
						return ppAccountsData; 
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
		return ppAccountsData;
	},
	
	filterPrivFeatures: function(data,subsetCode) {
	   var allFeatures = new Ext.util.MixedCollection();
	   allFeatures.addAll(data);
	   var featureFilter = new Ext.util.Filter({
			filterFn: function(item) {
				return item.subsetCode == subsetCode;
			}
		});
		var featurs = allFeatures.filter(featureFilter);
		return featurs.items;
	}
	,
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
	setColumnHeader : function(serviceType)
	{
		var featureItems = [];
		var self =this;		
		
		featureItems.push({xtype: 'label',columnWidth:0.20,text:getLabel("lbl.type","Type"),padding:'0 0 0 0',cls:'boldText granular-privilege-label privilege-grid-main-header privilege-grid-type-label granular-privilege-type'});
		
		
			if(featureMap["ISSNC"] != undefined ) {
					if(featureMap["ISSNC"].canView == 'Y' ){
						featureItems.push({xtype: 'label',columnWidth:0.08,text:getLabel("viewIssue","View Issue"),padding:'0 0 0 5',cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
					}
					if(featureMap["ISSNC"].canEdit == 'Y' ){
						featureItems.push({xtype: 'label',columnWidth:0.08,text:getLabel("editIssue","Edit Issue"),padding:'0 0 0 5',cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
					}
					if(featureMap["ISSNC"].canAuth == 'Y' ){
					 featureItems.push({xtype: 'label',columnWidth:0.08,text: getLabel("approveIssue","Approve Issue"),padding:'0 0 0 5',cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
					}
					
			}
			if(featureMap["EXDE"] != undefined ) {
				if(featureMap["EXDE"].canView == 'Y' ){
					featureItems.push({xtype: 'label',columnWidth:0.08,text: getLabel("viewException","View Exception"),padding:'0 0 0 5',cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
				}
				if(featureMap["EXDE"].canEdit == 'Y' ){
						featureItems.push({xtype: 'label',columnWidth:0.08,text: getLabel("createDecision","Create Decision"),padding:'0 0 0 5',cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
				}
				if(featureMap["EXDE"].canAuth == 'Y' ){
						featureItems.push({xtype: 'label',columnWidth:0.08,text: getLabel("approveDecision","Approve Decision"),padding:'0 0 0 5',cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
				}
			
			}
			
			if(featureMap["PPPT"] != undefined ) {
				if(featureMap["PPPT"].canView == 'Y' ){
					featureItems.push({xtype: 'label',columnWidth:0.08,text: getLabel("viewPassthru","View Passthru"),padding:'0 0 0 5',cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
				}
				if(featureMap["PPPT"].canEdit == 'Y' ){
						featureItems.push({xtype: 'label',columnWidth:0.08,text:getLabel("createPassthru","Create Passthru"),padding:'0 0 0 5',cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
				}
				if(featureMap["PPPT"].canAuth == 'Y' ){
						featureItems.push({xtype: 'label',columnWidth:0.08,text: getLabel("approvePassthru","Approve Passthru"),padding:'0 0 0 5',cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
				}
			
			}
			
			
			if(featureMap["IMPC"] != undefined ) {
				if(featureMap["IMPC"].canView == 'Y' ){
					featureItems.push({xtype: 'label',columnWidth:0.08,text:getLabel("viewCheckImage","View Check Image"),padding:'0 0 0 5',cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
				}
			}	
		
		
		
		
		
	
	
		return featureItems;
	},
	
	setPanelHeader : function(id, title)
	{
		var featureItems = [];
		var self =this;	
		
	
		featureItems.push({xtype: 'label',columnWidth:0.10,text:getLabel('lbl.account','Account'),padding:'8 0 0 10',cls:'boldText granular-privilege-accountno granular-privilege-account-header',height:35 });
		featureItems.push({xtype: 'label',columnWidth:0.10,text:getLabel('accountName','Account Name'),padding:'8 0 0 10',cls:'boldText granular-privilege-accountno granular-privilege-account-header',height:35});
		
		if(featureMap["ISSNC"] != undefined ) {
			if(featureMap["ISSNC"].canView == 'Y' ){
				/*featureItems.push({xtype: 'button',columnWidth:0.08,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 55',width : 10, height : 20, itemId : id+"_viewIcon", border : 0,cls:'btn'});*/
			featureItems.push({
			xtype: 'panel',
			columnWidth:0.08,
			cls : 'privilege-grid-main-header granular-privilege-headers',
			text: title,
			padding:'5 0 0 10',
			items : [{xtype: 'checkbox',columnWidth:0.08,margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_viewIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
			});
			}
		if(featureMap["ISSNC"].canEdit == 'Y' ){	
		/*featureItems.push({xtype: 'button',columnWidth:0.08,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 30',width : 15, height : 20, itemId : id+"_editIcon", border : 0,cls:'btn'});*/
		featureItems.push({
		xtype: 'panel',
		columnWidth:0.08,
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',columnWidth:0.08,margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_editIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});
		}
			if(featureMap["ISSNC"].canAuth == 'Y' ){
				/*featureItems.push({xtype: 'button',columnWidth:0.08,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 55',width : 15, height : 20, itemId : id+"_authIcon", border : 0,cls:'btn'});*/
			featureItems.push({
			xtype: 'panel',
			columnWidth:0.08,
			cls : 'privilege-grid-main-header granular-privilege-headers',
			text: title,
			padding:'5 0 0 10',
			items : [{xtype: 'checkbox',columnWidth:0.08,margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_authIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
			});
			}
		}
		if(featureMap["EXDE"] != undefined ) {
			if(featureMap["EXDE"].canView == 'Y' ){
				/*featureItems.push({xtype: 'button',columnWidth:0.08,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 55',width : 10, height : 20, itemId : id+"_viewExceptionIcon", border : 0,cls:'btn'});*/
			featureItems.push({
			xtype: 'panel',
			columnWidth:0.08,
			cls : 'privilege-grid-main-header granular-privilege-headers',
			text: title,
			padding:'5 0 0 10',
			items : [{xtype: 'checkbox',columnWidth:0.08,margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_viewExceptionIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
			});	
			}
			if(featureMap["EXDE"].canEdit == 'Y' ){
					/*featureItems.push({xtype: 'button',columnWidth:0.08,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 55',width : 15, height : 20, itemId : id+"_createDecisionIcon", border : 0,cls:'btn'});*/
			featureItems.push({
			xtype: 'panel',
			columnWidth:0.08,
			cls : 'privilege-grid-main-header granular-privilege-headers',
			text: title,
			padding:'5 0 0 10',
			items : [{xtype: 'checkbox',columnWidth:0.08,margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_createDecisionIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
			});		
			}
			if(featureMap["EXDE"].canAuth == 'Y' ){
					/*featureItems.push({xtype: 'button',columnWidth:0.08,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 55',width : 15, height : 20, itemId : id+"_ApproveIssueIcon", border : 0,cls:'btn'});*/
			featureItems.push({
			xtype: 'panel',
			columnWidth:0.08,
			cls : 'privilege-grid-main-header granular-privilege-headers',
			text: title,
			padding:'5 0 0 10',
			items : [{xtype: 'checkbox',columnWidth:0.08,margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_ApproveIssueIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
			});		
			}
		
		}
		
		if(featureMap["PPPT"] != undefined ) {
			if(featureMap["PPPT"].canView == 'Y' ){
				/*featureItems.push({xtype: 'button',columnWidth:0.08,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 55',width : 10, height : 20, itemId : id+"_viewPassthruIcon", border : 0,cls:'btn'});*/
			featureItems.push({
			xtype: 'panel',
			columnWidth:0.08,
			cls : 'privilege-grid-main-header granular-privilege-headers',
			text: title,
			padding:'5 0 0 10',
			items : [{xtype: 'checkbox',columnWidth:0.08,margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_viewPassthruIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
			});
			}
			if(featureMap["PPPT"].canEdit == 'Y' ){
					/*featureItems.push({xtype: 'button',columnWidth:0.08,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 55',width : 15, height : 20, itemId : id+"_createPassthruIcon", border : 0,cls:'btn'});*/
			featureItems.push({
			xtype: 'panel',
			columnWidth:0.08,
			cls : 'privilege-grid-main-header granular-privilege-headers',
			text: title,
			padding:'5 0 0 10',
			items : [{xtype: 'checkbox',columnWidth:0.08,margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_createPassthruIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
			});	
			}
			if(featureMap["PPPT"].canAuth == 'Y' ){
					/*featureItems.push({xtype: 'button',columnWidth:0.08,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 55',width : 15, height : 20, itemId : id+"_approvePassthruIcon", border : 0,cls:'btn'});*/
			featureItems.push({
			xtype: 'panel',
			columnWidth:0.08,
			cls : 'privilege-grid-main-header granular-privilege-headers',
			text: title,
			padding:'5 0 0 10',
			items : [{xtype: 'checkbox',columnWidth:0.08,margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_approvePassthruIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
			});		
			}
		
		}
		
			if(featureMap["IMPC"] != undefined ) {
				if(featureMap["IMPC"].canView == 'Y' ){
					/*featureItems.push({xtype: 'button',columnWidth:0.08,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 55',width : 10, height : 20, itemId : id+"_viewCheckImageIcon", border : 0,cls:'btn'});*/
					featureItems.push({
					xtype: 'panel',
					columnWidth:0.08,
					cls : 'privilege-grid-main-header granular-privilege-headers',
					text: title,
					padding:'5 0 0 10',
					items : [{xtype: 'checkbox',columnWidth:0.08,margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_viewCheckImageIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
					});	
				}
			
			}
	
		
		
		
		return featureItems;
	},
	setPriviligeMenu : function(feature,MODE,index)
	{
		var obj = new Object();
		if(MODE == 'VIEW')
		{
			
			obj.checked = this.getBooleanvalue(feature.viewIssueFlag);
		}
		else if(MODE == 'EDIT')
		{	
			obj.viewMode = 'VIEW';
			obj.checked = this.getBooleanvalue(feature.editIssueFlag);
		}
		else if(MODE == 'AUTH')
		{
			obj.viewMode = 'VIEW';
			obj.checked = this.getBooleanvalue(feature.approveIssueFlag);
		}else if(MODE == 'VIEWEXCEPTION')
		{	
			
			obj.checked = this.getBooleanvalue(feature.viewExceptionFlag);
		}
		else if(MODE == 'CREATEDECISION')
		{
			obj.viewMode = 'VIEWEXCEPTION';
			obj.checked = this.getBooleanvalue(feature.createDecisionFlag);
		}else if(MODE == 'APPROVEDECISION')
		{
			obj.viewMode = 'VIEWEXCEPTION';
			obj.checked = this.getBooleanvalue(feature.approveDecisionFlag);
		}else if(MODE == 'VIEWCHECKIMAGE')
		{
			
			obj.checked = this.getBooleanvalue(feature.viewCheckImageFlag);
		}
		
		else if(MODE == 'PP_VIEW_PASSTHRU')
		{
			
			obj.checked = this.getBooleanvalue(feature.viewPassthruFlag);
		}else if(MODE == 'PP_EDIT_PASSTHRU')
		{
			obj.viewMode = 'PP_VIEW_PASSTHRU';
			obj.checked = this.getBooleanvalue(feature.createPassthruFlag);
		}else if(MODE == 'PP_APPROVE_PASSTHRU')
		{
			obj.viewMode = 'PP_VIEW_PASSTHRU';
			obj.checked = this.getBooleanvalue(feature.approvePassthruFlag);
		}
		
		obj.xtype="checkbox";
		if(index%2==0)
			obj.cls = 'granular-cellContent privilege-grid-odd granular-privilege-headers';
			else
			obj.cls = 'granular-cellContent privilege-grid-even granular-privilege-headers';
		obj.columnWidth='0.08';
		obj.padding='0 0 0 0';
		obj.itemId = feature.accountId+"_"+MODE;
		obj.mode = MODE;
		obj.accountId = feature.accountId;
		obj.packageId = feature.packageId;
		//obj.border = 1;
		obj.checkChange = function(){
			var panelPointer = this.up('panel');
			checkPPGranularViewIfNotSelected(this.value,panelPointer,obj);
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
	
	setPPAccounts : function()
	{
		var self = this;
			
		var privdata = self.loadPPAccounts();
		
		//in case there are no accounts for service check array is empty
		
		var filteredPrivData;
		
		if(privdata!== null  && privdata.length!== 0 ){
			filteredPrivData = privdata.d.details;
		}
		var selectedPositivePayAccounts  = document.getElementById('selectedPositivePayAccounts');
		var selectedPositivePayAccountsObj; 
		if(typeof selectedPositivePayAccounts!== undefined && selectedPositivePayAccounts!==null && selectedPositivePayAccounts.value){
		  selectedPositivePayAccountsObj = Ext.decode(selectedPositivePayAccounts.value);
		}
		
		var allPPFlag = document.getElementById('allPositivePayAccountsSelectedFlag');
		if( self.isHiddenElementNotNull(allPPFlag)){
		  self.allPPAccountsSelectedFlag = allPPFlag.value;
		}
	 
		
		Ext.each(filteredPrivData, function(account, index) {
			var accountKey = account.accountNumber + '|'+ account.accountName;
			var isAssigned = account.isAssigned;
			var prevSelectedAccountObj;
			
			prevSelectedAccountObj = self.getAccountFromSelectedList(selectedPositivePayAccountsObj,account);
			
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
	
	setUserPositivePayRights : function()
	{
		var self = this;
			
		var privdata = self.loadPrivilegesFeaturs();
		var filteredPrivData = this.filterPrivFeatures(privdata,'POSITIVEPAYPRM');
		
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
			var rightValue ;
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
		var searchField=Ext.getCmp('accountIDFilterItemId');
		if(searchField!="" && searchField!=undefined)
		searchField.setRawValue('');
		Ext.getCmp('userGranPrivParametersSection').removeAll();
		Ext.getCmp('ppGranularPrivHeader').removeAll();
		Ext.getCmp('granularPrivColumnHeader').removeAll();
		
		thisClass.setUserPositivePayRights();
		thisClass.setPPAccounts();
		
		Ext.getCmp('userGranPrivParametersSection').add(thisClass.setUserPositivePayGranularRights() );
		Ext.getCmp('ppGranularPrivHeader').add(thisClass.setPanelHeader('ppGranularPrivHeader','Account'));
		Ext.getCmp('granularPrivColumnHeader').add(thisClass.setColumnHeader());
	
	
	
	},	
	setUserPositivePayGranularRights : function()
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
	  var filterCode = Ext.getCmp('accountIDFilterItemId').getValue();
	  
	 Ext.getCmp('userGranPrivParametersSection').removeAll();
	 
	   var filterResponse = [];
	   //console.log("filterCode "+filterCode);
		var filteredData ;
		if(filterCode)	{
			granularFeatureData.forEach(function (arrayElem){ 
				if( (arrayElem.accountId === filterCode) || ((arrayElem.accountName.toUpperCase().indexOf(filterCode.toUpperCase()) > -1 ) || (arrayElem.accountNo.toUpperCase().indexOf(filterCode.toUpperCase()) > -1)) ){
				//console.log("arrayElem "+arrayElem);
				filterResponse.push(JSON.parse(JSON.stringify(arrayElem)));
				 //break;
				}
			});		
		 isFilterApplied=true;
		   filteredData = filterResponse;
		  }else{
		  isFilterApplied=false;
			filteredData = this.filterFeatures(granularFeatureData);
		  }
		
		
		
		var featureItems = [];
		featureItems = self.createPrivilegesContainer(filteredData);
		
		Ext.getCmp('userGranPrivParametersSection').add(featureItems);
	
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
					feature.viewIssueFlag = previousSelectedObj.privileges.VIEW ? true:false;
				  }
				 if(previousSelectedObj.privileges.hasOwnProperty("EDIT") )
				 {
					feature.editIssueFlag = previousSelectedObj.privileges.EDIT ? true:false;
				  }
				
				if(previousSelectedObj.privileges.hasOwnProperty("AUTH") )
				 {
					feature.approveIssueFlag = previousSelectedObj.privileges.AUTH ? true:false;
				  }				
					
				  if(previousSelectedObj.privileges.hasOwnProperty("VIEWEXCEPTION") )
				 {
					feature.viewExceptionFlag= previousSelectedObj.privileges.VIEWEXCEPTION ? true:false;
				  }
				  if(previousSelectedObj.privileges.hasOwnProperty("CREATEDECISION") )
				 {
					feature.createDecisionFlag= previousSelectedObj.privileges.CREATEDECISION ? true:false;
				  } 
				  if(previousSelectedObj.privileges.hasOwnProperty("APPROVEDECISION") )
				 {
					feature.approveDecisionFlag= previousSelectedObj.privileges.APPROVEDECISION ? true:false;
				  } 
				  if(previousSelectedObj.privileges.hasOwnProperty("VIEWCHECKIMAGE") )
				 {
					feature.viewCheckImageFlag= previousSelectedObj.privileges.VIEWCHECKIMAGE ? true:false;
				  } 
				  
				  if(previousSelectedObj.privileges.hasOwnProperty("PP_VIEW_PASSTHRU") )
				 {
					feature.viewPassthruFlag= previousSelectedObj.privileges.PP_VIEW_PASSTHRU ? true:false;
				  } 
				  if(previousSelectedObj.privileges.hasOwnProperty("PP_EDIT_PASSTHRU") )
				 {
					feature.createPassthruFlag= previousSelectedObj.privileges.PP_EDIT_PASSTHRU ? true:false;
				  } 
				  if(previousSelectedObj.privileges.hasOwnProperty("PP_APPROVE_PASSTHRU") )
				 {
					feature.approvePassthruFlag= previousSelectedObj.privileges.PP_APPROVE_PASSTHRU ? true:false;
				  } 
				  
			}
		  }
			 
		

	},
	
  createPrivilegesContainer : function(filteredData){
	var self = this;
	var featureItems = [];
	//priviously submited granular Permissiong
	var prevPositivePayGranularPermissions = document.getElementById("positivePayGranularPermissions");
	
	Ext.each(filteredData, function(feature, index) {
			var panel = Ext.create('Ext.panel.Panel', {
				columnWidth:1,
				layout:'column',
				bodyStyle: {
					background: '#FAFAFA'
				}
			});
			var accountText = feature.accountNo + '|'+ feature.accountName;
			
			if(self.allPPAccountsSelectedFlag == 'Y' || accountAssignedMap[accountText] == true) {
				panel.insert({xtype: 'label',columnWidth:0.10,text: feature.accountNo  ,padding:'5 0 0 20',height:'auto',cls:'ux_text-elipsis granular-privilege-accountno privilege-grid-main-header privilege-grid-odd privilege-admin-rights', autoEl: {
                tag: 'label',
                'data-qtip': feature.accountNo
            } });
				panel.insert({xtype: 'label',columnWidth:0.10,text: feature.accountName  ,padding:'5 0 0 20',height:'auto',cls:'ux_text-elipsis granular-privilege-accountno privilege-grid-main-header privilege-grid-odd privilege-admin-rights', autoEl: {
                tag: 'label',
                'data-qtip': feature.accountName
            } });
			
				if( self.isHiddenElementNotNull(prevPositivePayGranularPermissions) ){
						var previouslySubmitedJsonObj =  Ext.decode(prevPositivePayGranularPermissions.value);
						self.updateFeatureIfPreviouslySelected(feature,previouslySubmitedJsonObj);
					
					}
			
			if(featureMap["ISSNC"] != undefined ) {
				if(featureMap["ISSNC"].canView == 'Y' ){
					panel.insert(self.setPriviligeMenu(feature,"VIEW",index));
				}
				if(featureMap["ISSNC"].canEdit == 'Y' ){
					panel.insert(self.setPriviligeMenu(feature,"EDIT",index));
				}
				if(featureMap["ISSNC"].canAuth == 'Y' ){
				panel.insert(self.setPriviligeMenu(feature,"AUTH",index));
				}
			}
			
			if(featureMap["EXDE"] != undefined ) {
			
				if(featureMap["EXDE"].canView == 'Y' ){
					panel.insert(self.setPriviligeMenu(feature,"VIEWEXCEPTION",index));
				}
				if(featureMap["EXDE"].canEdit == 'Y' ){
					panel.insert(self.setPriviligeMenu(feature,"CREATEDECISION",index));
				}
				if(featureMap["EXDE"].canAuth == 'Y' ){
					panel.insert(self.setPriviligeMenu(feature,"APPROVEDECISION",index));
				}
			
			}
			
			if(featureMap["PPPT"] != undefined ) {
			
				if(featureMap["PPPT"].canView == 'Y' ){
					panel.insert(self.setPriviligeMenu(feature,"PP_VIEW_PASSTHRU",index));
				}
				if(featureMap["PPPT"].canEdit == 'Y' ){
					panel.insert(self.setPriviligeMenu(feature,"PP_EDIT_PASSTHRU",index));
				}
				if(featureMap["PPPT"].canAuth == 'Y' ){
					panel.insert(self.setPriviligeMenu(feature,"PP_APPROVE_PASSTHRU",index));
				}
			
			}
			
			
			if(featureMap["IMPC"] != undefined ) {
			
				if(featureMap["IMPC"].canView == 'Y' ){
					panel.insert(self.setPriviligeMenu(feature,"VIEWCHECKIMAGE",index));
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
		thisClass.setUserPositivePayRights();
		thisClass.setPPAccounts();
		
		thisClass.items = [{
					xtype:'panel',
					width : 'auto',
					items:[{
						xtype: 'panel',
						width : 'auto',
						id : 'ppGranularPrivFilterBox',
						layout:'column',
						cls: 'ft-padding-bottom',
						items: [
							{
								xtype : 'AutoCompleter',
								fieldCls : 'xn-form-text xn-suggestion-box granular-autocompleter',
								id : 'accountIDFilterItemId',
								itemId : 'accountIDFilterItemId',
								name : 'accountIDFilterItemId',
								matchFieldWidth : true,
								labelSeparator : '',
								//fieldLabel :  getLabel( 'accountID', 'Account' ),
								cfgUrl : 'services/userseek/accountSeekForPositivePay.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'accountIDFilterItemId',
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
									 var filterContainer = thisClass.down('[itemId="accountIDFilterItemId"]');
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
										var filterContainer = thisClass.down('[itemId="accountIDFilterItemId"]');
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
			maxHeight : 2372,
			width : 'auto',
			overflowX: 'auto',
			overflowY: 'hidden',
	    	cls : 'privilege  gran-privilege',
			items:[{
					xtype:'panel',
					width : 'auto',
					items:[{
						xtype: 'panel',
						width : 'auto',
						id : 'granularPrivColumnHeader',
						layout: {
					        type: 'hbox'
					    },
						cls: 'mainHeader',
						padding: '0 0 0 10',
						items: thisClass.setColumnHeader()
				  }]
			 },{
			 		xtype:'panel',
			 		maxHeight : 1323,
					width : 'auto',		
					layout: {
						        type: 'vbox'
						    },
			 		items:[{
							xtype: 'panel',
							width : 'auto',
							id : 'ppGranularPrivHeader',
							layout: {
						        type: 'column'
						    },
							cls:'red-bg',
							height : 35,
							items: thisClass.setPanelHeader('ppGranularPrivHeader',getLabel('lbl.account','Account'))
						},
						{
							xtype: 'panel',
							minHeight : 25,
							maxHeight : 1323,
							width : 'auto',
							//title: getLabel('granularPrivileges','Positive Pay'),
							titleAlign : "left", 
							//collapsible : true,
							cls : 'xn-ribbon',
							collapseFirst : true,
							itemId : 'userGranPrivParametersSection',
							id : 'userGranPrivParametersSection',
							layout: {
							        type: 'vbox'
							    },
							items: thisClass.setUserPositivePayGranularRights()
						}]
			 }]
		}];
		if(mode === "VIEW"){
			thisClass.bbar=[
			         '->', { 
			        	  text: getLabel('btnClose','Close'),
			        	  cls : 'ft-button-primary',
			        	  /*handler : function(btn,opts) {
			        		thisClass.close();
			        				}*/
							listeners: {
							  click : function(){
							  thisClass.close();
							  }
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
							objPPGranularPrivPriviligePopup= null;
							//thisClass.hide();
			        				}
			          },'->',
					  { 
			        	  text: getLabel('submit','Submit'),
			        	  cls : 'ft-button-primary',
			        	  /*handler : function(btn,opts) {
			        	  	thisClass.saveItems();
			        		thisClass.close();
			        				}*/
							listeners: {
							  click : function(){
							  thisClass.saveItems();
							  thisClass.close();
							  }
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
										if(element.getValue())
											jsonData[objectKey]['privileges']['VIEW'] = true;
									}
									if('AUTH' == mode){
										jsonData[objectKey]['privileges']['AUTH'] = element.getValue();;
										if(element.getValue())
											jsonData[objectKey]['privileges']['VIEW'] = true;
									}
									if('VIEWEXCEPTION' == mode){
										jsonData[objectKey]['privileges']['VIEWEXCEPTION'] = element.getValue();;
									}
									if('CREATEDECISION' == mode){
										jsonData[objectKey]['privileges']['CREATEDECISION'] = element.getValue();;
										if(element.getValue())
											jsonData[objectKey]['privileges']['VIEWEXCEPTION'] = true;
									}
									if('APPROVEDECISION' == mode){
										jsonData[objectKey]['privileges']['APPROVEDECISION'] = element.getValue();;
										if(element.getValue())
											jsonData[objectKey]['privileges']['VIEWEXCEPTION'] = true;
									}
									if('VIEWCHECKIMAGE' == mode){
										jsonData[objectKey]['privileges']['VIEWCHECKIMAGE'] = element.getValue();;
									}
									
									if('PP_VIEW_PASSTHRU' == mode){
										jsonData[objectKey]['privileges']['PP_VIEW_PASSTHRU'] = element.getValue();;
									}
									if('PP_EDIT_PASSTHRU' == mode){
										jsonData[objectKey]['privileges']['PP_EDIT_PASSTHRU'] = element.getValue();;
										if(element.getValue())
											jsonData[objectKey]['privileges']['PP_VIEW_PASSTHRU'] = true;
									}
									if('PP_APPROVE_PASSTHRU' == mode){
										jsonData[objectKey]['privileges']['PP_APPROVE_PASSTHRU'] = element.getValue();;
										if(element.getValue())
											jsonData[objectKey]['privileges']['PP_VIEW_PASSTHRU'] = true;
									}
							}
			});
			
			var jsonObj = {};
			jsonObj['serviceType'] = 'PP';
			jsonObj['moduleCode'] = '13';
			var jsonArray = [];
			//console.log("available jsonData :"+JSON.stringify(jsonData));
		
			//only add those records which are updated
			for (var index  in granularFeatureData){
				var orginalObj = granularFeatureData[index];
			    var accountId =orginalObj.accountId;
			    var pkgId =orginalObj.packageId;
				var objectKey = accountId+'_'+pkgId;
				var recordKeyNo = orginalObj.recordKeyNo;
			  	// account row is currently selected 
			  	if((objectKey in jsonData)){ 
                       var newObj = jsonData[objectKey];
					 if( newObj['privileges']['VIEW'] == this.getBooleanvalue(orginalObj.viewIssueFlag)  && 
						 newObj['privileges']['EDIT'] == this.getBooleanvalue(orginalObj.editIssueFlag) &&
						 newObj['privileges']['AUTH'] == this.getBooleanvalue(orginalObj.approveIssueFlag) &&
						 newObj['privileges']['VIEWEXCEPTION'] == this.getBooleanvalue(orginalObj.viewExceptionFlag) && 
						 newObj['privileges']['CREATEDECISION'] == this.getBooleanvalue(orginalObj.createDecisionFlag) &&
						 newObj['privileges']['APPROVEDECISION'] == this.getBooleanvalue(orginalObj.approveDecisionFlag) &&
						 newObj['privileges']['VIEWCHECKIMAGE'] == this.getBooleanvalue(orginalObj.viewCheckImageFlag) &&
						 
						 newObj['privileges']['PP_VIEW_PASSTHRU'] == this.getBooleanvalue(orginalObj.viewPassthruFlag) &&
						 newObj['privileges']['PP_EDIT_PASSTHRU'] == this.getBooleanvalue(orginalObj.createPassthruFlag) &&
						 newObj['privileges']['PP_APPROVE_PASSTHRU'] == this.getBooleanvalue(orginalObj.approvePassthruFlag) )
					 {
					 // if none of the values are changed no need to push into array
						 
					 }else{
					     jsonArray.push(newObj)
					 }
				}else{
				
						//recordKeyNo of record means its saved in db and if its not found in jsonData (i.e currently present in rows on screen) then make all flag N for that account
					
						if(recordKeyNo!== undefined && recordKeyNo!=null && recordKeyNo  && !isFilterApplied)
						{
						
							if(  false  ===  this.getBooleanvalue(orginalObj.viewIssueFlag)  && 
								 false  ===  this.getBooleanvalue(orginalObj.editIssueFlag) &&
								 false  ===  this.getBooleanvalue(orginalObj.approveIssueFlag) &&
								 false  ===  this.getBooleanvalue(orginalObj.viewExceptionFlag)	&&
								 false  ===  this.getBooleanvalue(orginalObj.createDecisionFlag) &&
								 false  ===  this.getBooleanvalue(orginalObj.approveDecisionFlag) &&
								 false  ===  this.getBooleanvalue(orginalObj.viewCheckImageFlag) &&
								 
								 false  ===  this.getBooleanvalue(orginalObj.viewPassthruFlag) &&
								 false  ===  this.getBooleanvalue(orginalObj.createPassthruFlag) &&
								 false  ===  this.getBooleanvalue(orginalObj.approvePassthruFlag) )
							 {
							 // if all flags are N means record is previously removed no need to add into deleted array 
								 
							 }else{
								 var newEntry = {};
								newEntry['accountId'] = accountId;
								newEntry['packageId'] = pkgId;
								var privileges = {'VIEW':false,'EDIT':false,'AUTH':false,'VIEWEXCEPTION':false,'CREATEDECISION':false,'APPROVEDECISION':false,'VIEWCHECKIMAGE':false,'PP_VIEW_PASSTHRU':false,'PP_EDIT_PASSTHRU':false,'PP_APPROVE_PASSTHRU':false };
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
function checkPPGranularViewIfNotSelected(isSelected,panelPointer,obj){
	if(null != panelPointer && undefined != panelPointer){
	if(isSelected){
	if(null != panelPointer && undefined != panelPointer){
		var viewItemId =obj.accountId + "_" +obj.viewMode;
		var view_chk_box = panelPointer.down('checkbox[itemId='+viewItemId+']');
		if(null != view_chk_box && undefined != view_chk_box && view_chk_box.value== false){
			view_chk_box.setValue(true);}
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
		if("VIEWEXCEPTION"===obj.mode){
				var createDecisionIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + '_CREATEDECISION' +']');
				if( createDecisionIconItemId )
				{
					createDecisionIconItemId.setValue( false );
					createDecisionIconItemId.defVal = false;
				}
				var decisionApproveIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + '_APPROVEDECISION' +']');
				if( decisionApproveIconItemId )
				{
					decisionApproveIconItemId.setValue( false );
					decisionApproveIconItemId.defVal = false;
				}				
			}
		if("PP_VIEW_PASSTHRU"===obj.mode){
				var editPassthruIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + '_PP_EDIT_PASSTHRU' +']');
				if( editPassthruIconItemId )
				{
					editPassthruIconItemId.setValue( false );
					editPassthruIconItemId.defVal = false;
				}
				var approvePassthruIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + '_PP_APPROVE_PASSTHRU' +']');
				if( approvePassthruIconItemId )
				{
					approvePassthruIconItemId.setValue( false );
					approvePassthruIconItemId.defVal = false;
				}				
			}
		}
	}
}