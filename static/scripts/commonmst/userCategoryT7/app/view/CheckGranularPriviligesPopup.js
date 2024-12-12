var granularPrivfieldJson = [];
var featureMap = {};
var accountAssignedMap = {};
var allChecksAccountsSelectedFlag = 'N';
var isFilterApplied = false;
Ext.define('GCP.view.CheckGranularPriviligesPopup', {
	extend: 'Ext.window.Window',
	xtype: 'checkGranularPriviligesPopup',
	minWidth : 400,
	maxWidth : 735,
	minHeight : 156,
	maxHeight : 550,
	overflowY: 'auto',
	overflowX: 'auto',
	cls : 'xn-popup',
	title: getLabel('checkManagementGranularPrivilege','Check Management Granular Privileges'),

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
	
	loadPrivilegesFeaturs: function() {
	var me = this;
		if(mode === "VIEW"){
				Ext.Ajax.request({
					url : 'services/userCategory/previlige.json',
					method : 'POST',
					async: false,
					params : { module: '14',categoryId:userCategory},
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
					params : { module: '14',categoryId:userCategory,$inlinecount:'allpages',$top:5000},
					success : function(response) {
					 	 checksAccountsData = Ext.JSON.decode(response.responseText);
						return checksAccountsData; 
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
		return checksAccountsData;
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
		featureItems.push({xtype: 'label',text: getLabel("lbl.type","Type"),padding:'0 0 0 0',cls:'boldText granular-privilege-label privilege-grid-main-header privilege-grid-type-label granular-privilege-type'});
		
		if(featureMap["CHKINQ"] != undefined ) {
			if(featureMap["CHKINQ"].canView == 'Y' ){
				featureItems.push({xtype: 'label',text:getLabel("viewInquiry","View Inquiry"),padding:'0 0 0 5',cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
			}
			if(featureMap["CHKINQ"].canEdit == 'Y' ){
				featureItems.push({xtype: 'label',text:getLabel("createInquiry","Create Inquiry"),padding:'0 0 0 5',cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
			}
		}
		if(featureMap["CHKPAIDIMG"] != undefined ) {
			if(featureMap["CHKPAIDIMG"].canView == 'Y' ){
			featureItems.push({xtype: 'label',text: getLabel("viewPaidCheckImage","View Paid Check Image"),padding:'0 0 0 5',cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
			}
		}
		
		if(featureMap["CHKCSTP"] != undefined ) {
			if(featureMap["CHKCSTP"].canView == 'Y' ){
			featureItems.push({xtype: 'label',text: getLabel("viewCancelStopPay","View Cancel StopPay"),padding:'0 0 0 5',cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
		}
		if(featureMap["CHKCSTP"].canEdit == 'Y' ){
		featureItems.push({xtype: 'label',text:getLabel("createCancelStopPay","Create Cancel StopPay"),padding:'0 0 0 5',cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
		}
		if(featureMap["CHKCSTP"].canAuth == 'Y' ){
			featureItems.push({xtype: 'label',text:getLabel("cancelApprove","Cancel Approve"),padding:'0 0 0 5',cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
		}
		}
		
		if(featureMap["CHKSTP"] != undefined ) {
			if(featureMap["CHKSTP"].canView == 'Y' ){
		featureItems.push({xtype: 'label',text:getLabel("viewStopPay","View StopPay"),padding:'0 0 0 5',cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
		}
		if(featureMap["CHKSTP"].canEdit == 'Y' ){
		featureItems.push({xtype: 'label',text:getLabel("createStopPay","Create StopPay"),padding:'0 0 0 5',cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
		}
		if(featureMap["CHKSTP"].canAuth == 'Y' ){
		featureItems.push({xtype: 'label',text: getLabel("stopPayApprove","StopPay Approve"),padding:'0 0 0 5',cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
		}
		}
		return featureItems;
	},
	
		setPanelHeader : function(id, title)
	{
		var featureItems = [];
		
		featureItems.push({xtype: 'label',text:getLabel('lbl.account','Account'),padding:'8 0 0 10',cls:'boldText granular-privilege-accountno granular-privilege-account-header',height:35 });
		featureItems.push({xtype: 'label',text:getLabel('accountName','Account Name'),padding:'8 0 0 15',cls:'boldText granular-privilege-accountno granular-privilege-account-header',height:35});
		
		if(featureMap["CHKINQ"] != undefined ) {
			if(featureMap["CHKINQ"].canView == 'Y' ){
		/*featureItems.push({xtype: 'button',columnWidth:0.09,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 35',width : 15, height : 20, itemId : id+"_inquiryIcon", border : 0,cls:'btn'});*/
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_inquiryIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});
		
		}
		if(featureMap["CHKINQ"].canEdit == 'Y' ){
		/*featureItems.push({xtype: 'button',columnWidth:0.09,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 65',width : 15, height : 20, itemId : id+"_createInquiryIcon", border : 0,cls:'btn'});*/
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_createInquiryIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});
		
		}
		}
		
			if(featureMap["CHKPAIDIMG"] != undefined ) {
			if(featureMap["CHKPAIDIMG"].canView == 'Y' ){
		/*featureItems.push({xtype: 'button',columnWidth:0.09,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 65',width : 15, height : 20, itemId : id+"_viewPaidCheckImageIcon", border : 0,cls:'btn'});*/
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_viewPaidCheckImageIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});
		
		}
		}
		
			if(featureMap["CHKCSTP"] != undefined ) {
			if(featureMap["CHKCSTP"].canView == 'Y' ){
		/*featureItems.push({xtype: 'button',columnWidth:0.09,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 65',width : 15, height : 20, itemId : id+"_cancelStopPayIcon", border : 0,cls:'btn'});*/
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_cancelStopPayIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});
		
		}
		if(featureMap["CHKCSTP"].canEdit == 'Y' ){
		/*featureItems.push({xtype: 'button',columnWidth:0.09,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 65',width : 15, height : 20, itemId : id+"_createCancelStopPayIcon", border : 0,cls:'btn'});*/
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_createCancelStopPayIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});
		
		}
		if(featureMap["CHKCSTP"].canAuth == 'Y' ){
		/*featureItems.push({xtype: 'button',columnWidth:0.09,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 65',width : 10, height : 20, itemId : id+"_cancelApproveIcon", border : 0,cls:'btn'});*/
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_cancelApproveIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});
		
		}
		}
		
		if(featureMap["CHKSTP"] != undefined ) {
			if(featureMap["CHKSTP"].canView == 'Y' ){
		/*featureItems.push({xtype: 'button',columnWidth:0.09,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 65',width : 10, height : 20, itemId : id+"_stopPayIcon", border : 0,cls:'btn'});*/
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_stopPayIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});
		
		}
		if(featureMap["CHKSTP"].canEdit == 'Y' ){
		/*featureItems.push({xtype: 'button',columnWidth:0.09,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 65',width : 10, height : 20, itemId : id+"_createStopPayIcon", border : 0,cls:'btn'});*/
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_createStopPayIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});
		
		}
		if(featureMap["CHKSTP"].canAuth == 'Y' ){
		/*featureItems.push({xtype: 'button',columnWidth:0.09,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 65',width : 15, height : 20, itemId : id+"_stopPayApproveIcon", border : 0,cls:'btn'});*/
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_stopPayApproveIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});
		
		}
		}
		return featureItems;
	},
	setPriviligeMenu : function(feature,MODE,index)
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
			obj.viewMode = 'STOPPAY';
		}
		else if(MODE == 'CANCELSTOPPAYAPPROVE')
		{
			obj.viewMode = 'CANCELSTOPPAY';
			obj.checked = this.getBooleanvalue(feature.cancelStoppayApproveFlag);
		}
		
		else if(MODE == 'CREATE_INQUIRY_FLAG')
		{
			obj.viewMode = 'INQUIRY';
			obj.checked = this.getBooleanvalue(feature.createInquiryFlag);
		}
		else if(MODE == 'VIEW_PAID_CHECK_IMG_FLAG')
		{
			
			obj.checked = this.getBooleanvalue(feature.viewPaidCheckImageFlag);
		}
		else if(MODE == 'CREATE_CANCEL_STOPPAY_FLAG')
		{
			obj.viewMode = 'CANCELSTOPPAY';
			obj.checked = this.getBooleanvalue(feature.createCancelStoppayFlag);
		}
		else if(MODE == 'CREATE_STOPPAY_FLAG')
		{
			
			obj.checked = this.getBooleanvalue(feature.createStoppayFlag);
			obj.viewMode = 'STOPPAY';
		}	
		
		
		obj.xtype="checkbox";
		if(index%2==0)
			obj.cls = 'granular-cellContent privilege-grid-odd granular-privilege-headers';
			else
			obj.cls = 'granular-cellContent privilege-grid-even granular-privilege-headers';
		//obj.cls = 'cellContent';
		//obj.columnWidth='0.09';
		obj.padding='0 0 0 0';
		obj.itemId = feature.accountId+"_"+MODE;
		obj.mode = MODE;
		obj.accountId = feature.accountId;
		obj.packageId = feature.packageId;
		//obj.border = 1;
		obj.checkChange = function(){
			var panelPointer = this.up('panel');
			checkGranularViewIfNotSelected(this.value,panelPointer,obj);
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
	
 createPrivilegesContainer : function(filteredData){
	var self = this;
	var featureItems = [];
	//priviously submited granular Permissiong
	var prevPositivePayGranularPermissions = document.getElementById("checksGranularPermissions");
	
	
	
	Ext.each(filteredData, function(feature, index) {
			var panel = Ext.create('Ext.panel.Panel', {
				columnWidth:1,
				layout:'column',
				bodyStyle: {
					background: '#FAFAFA'
				}
			});
			var accountText = feature.accountNo + '|'+ feature.accountName;
			
			if(self.allChecksAccountsSelectedFlag == 'Y' || accountAssignedMap[accountText] == true) {
			
			panel.insert({xtype: 'label',text: feature.accountNo  ,padding:'5 0 0 20',height:'auto',cls:'ux_text-elipsis granular-privilege-accountno privilege-grid-main-header privilege-grid-odd privilege-admin-rights', autoEl: {
                tag: 'label',
                'data-qtip': feature.accountNo
            } });
			panel.insert({xtype: 'label',text: feature.accountName  ,padding:'5 0 0 20',height:'auto',cls:'ux_text-elipsis granular-privilege-accountno privilege-grid-odd privilege-admin-rights', autoEl: {
                tag: 'label',
                'data-qtip': feature.accountName
            } });
			
				if( self.isHiddenElementNotNull(prevPositivePayGranularPermissions) ){
						var previouslySubmitedJsonObj =  Ext.decode(prevPositivePayGranularPermissions.value);
						self.updateFeatureIfPreviouslySelected(feature,previouslySubmitedJsonObj);
					
					}
			
			if(featureMap["CHKINQ"] != undefined ) {
			if(featureMap["CHKINQ"].canView == 'Y' ){
				panel.insert(self.setPriviligeMenu(feature,"INQUIRY",index));
			}
			if(featureMap["CHKINQ"].canEdit == 'Y' ){
			panel.insert(self.setPriviligeMenu(feature,"CREATE_INQUIRY_FLAG",index));
			}}
				if(featureMap["CHKPAIDIMG"] != undefined ) {
			if(featureMap["CHKPAIDIMG"].canView == 'Y' ){
			panel.insert(self.setPriviligeMenu(feature,"VIEW_PAID_CHECK_IMG_FLAG",index));
			}}
			if(featureMap["CHKCSTP"] != undefined ) {
			if(featureMap["CHKCSTP"].canView == 'Y' ){
			panel.insert(self.setPriviligeMenu(feature,"CANCELSTOPPAY",index));
			}
			if(featureMap["CHKCSTP"].canEdit == 'Y' ){
			panel.insert(self.setPriviligeMenu(feature,"CREATE_CANCEL_STOPPAY_FLAG",index));
			}
			if(featureMap["CHKCSTP"].canAuth == 'Y' ){
			panel.insert(self.setPriviligeMenu(feature,"CANCELSTOPPAYAPPROVE",index));
			}
			}
			
			if(featureMap["CHKSTP"] != undefined ) {
			if(featureMap["CHKSTP"].canView == 'Y' ){
			panel.insert(self.setPriviligeMenu(feature,"STOPPAY",index));
			}
			if(featureMap["CHKSTP"].canEdit == 'Y' ){
			panel.insert(self.setPriviligeMenu(feature,"CREATE_STOPPAY_FLAG",index));
			}
			if(featureMap["CHKSTP"].canAuth == 'Y' ){
			panel.insert(self.setPriviligeMenu(feature,"STOPPAYAPPROVE",index));
			}}
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
	
	setUserCheckGranularRights : function()
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
			isFilterApplied=true;
		   filteredData = filterResponse;
		  }else{
			isFilterApplied=false;
			filteredData = this.filterFeatures(granularFeatureData);
		  }
		
		var featureItems = [];
		featureItems = self.createPrivilegesContainer(filteredData);
		
		Ext.getCmp('checkGranPrivParametersSection').add(featureItems);
	
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
setChecksAccounts : function()
	{
		var self = this;
			
		var privdata = self.loadAccounts();
		
		//in case there are no accounts for service check array is empty
		
		var filteredPrivData;
		
		if(privdata!== null  && privdata.length!== 0 ){
			filteredPrivData = privdata.d.details;
		}
		var selectedAccounts  = document.getElementById('selectedPositivePayAccounts');
		var selectedAccountsObj; 
		if(typeof selectedAccounts!== undefined && selectedAccounts!==null && selectedAccounts.value){
		  selectedAccountsObj = Ext.decode(selectedAccounts.value);
		}
		
		var allPPFlag = document.getElementById('allChecksAccountsSelectedFlag');
		if( self.isHiddenElementNotNull(allPPFlag)){
		  self.allChecksAccountsSelectedFlag = allPPFlag.value;
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
	
	setChecksRights : function()
	{
		var self = this;
			
		var privdata = self.loadPrivilegesFeaturs();
		var filteredPrivData = this.filterPrivFeatures(privdata,'CHECKPRM');
		
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
		var searchField=Ext.getCmp('checkAccountIDFilterItemId');
		if(searchField!="" && searchField!=undefined)
		searchField.setRawValue('');
		Ext.getCmp('checkGranPrivParametersSection').removeAll();
		Ext.getCmp('checkGranularPrivHeader').removeAll();
		Ext.getCmp('checkGranularPrivColumnHeader').removeAll();
		
		thisClass.setChecksRights();
		thisClass.setChecksAccounts();
		
		Ext.getCmp('checkGranPrivParametersSection').add(thisClass.setUserCheckGranularRights() );
		Ext.getCmp('checkGranularPrivHeader').add(thisClass.setPanelHeader('checkGranularPrivHeader','Account'));
		Ext.getCmp('checkGranularPrivColumnHeader').add(thisClass.setColumnHeader());
	
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
				if(previousSelectedObj.privileges.hasOwnProperty("INQUIRY") )
				 {
					feature.inquiryFlag = previousSelectedObj.privileges.INQUIRY ? true:false;
				  }
				 if(previousSelectedObj.privileges.hasOwnProperty("STOPPAY") )
				 {
					feature.stoppayFlag = previousSelectedObj.privileges.STOPPAY ? true:false;
				  }
				
				if(previousSelectedObj.privileges.hasOwnProperty("CANCELSTOPPAY") )
				 {
					feature.cancelStoppayFlag = previousSelectedObj.privileges.CANCELSTOPPAY ? true:false;
				  }				
					
				  if(previousSelectedObj.privileges.hasOwnProperty("STOPPAYAPPROVE") )
				 {
					feature.stoppayApproveFlag= previousSelectedObj.privileges.STOPPAYAPPROVE ? true:false;
				  }
				  if(previousSelectedObj.privileges.hasOwnProperty("CANCELSTOPPAYAPPROVE") )
				 {
					feature.cancelStoppayApproveFlag= previousSelectedObj.privileges.CANCELSTOPPAYAPPROVE ? true:false;
				  } 
				  if(previousSelectedObj.privileges.hasOwnProperty("CREATE_INQUIRY_FLAG") )
				 {
					feature.createInquiryFlag= previousSelectedObj.privileges.CREATE_INQUIRY_FLAG ? true:false;
				  } 
				  if(previousSelectedObj.privileges.hasOwnProperty("VIEW_PAID_CHECK_IMG_FLAG") )
				 {
					feature.viewPaidCheckImageFlag= previousSelectedObj.privileges.VIEW_PAID_CHECK_IMG_FLAG ? true:false;
				  } 
				    if(previousSelectedObj.privileges.hasOwnProperty("CREATE_CANCEL_STOPPAY_FLAG") )
				 {
					feature.createCancelStoppayFlag= previousSelectedObj.privileges.CREATE_CANCEL_STOPPAY_FLAG ? true:false;
				  } 
				    if(previousSelectedObj.privileges.hasOwnProperty("CREATE_STOPPAY_FLAG") )
				 {
					feature.createStoppayFlag= previousSelectedObj.privileges.CREATE_STOPPAY_FLAG ? true:false;
				  } 
			}
		  }
			 
		

	},
	
	
	initComponent: function() {
	var thisClass = this;
	 thisClass.setChecksRights();
	 thisClass.setChecksAccounts();
	
		thisClass.items = [{
					xtype:'panel',
					width : 'auto',
					items:[{
						xtype: 'panel',
						width : 'auto',
						id : 'checkGranularPrivFilterBox',
						layout:'column',
						cls: 'ft-padding-bottom',
						items: [
							{
								xtype : 'AutoCompleter',
								//cls : 'autoCmplete-field ux_paddingb',
								fieldCls : 'xn-form-text xn-suggestion-box granular-autocompleter',
								id : 'checkAccountIDFilterItemId',
								itemId : 'checkAccountIDFilterItemId',
								name : 'checkAccountIDFilterItemId',
								matchFieldWidth : true,
								labelSeparator : '',
								//fieldLabel :  getLabel( 'accountID', 'Account' ),
								cfgUrl : 'services/userseek/accountSeekForChecks.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'checkAccountIDFilterItemId',
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
									 var filterContainer = thisClass.down('[itemId="checkAccountIDFilterItemId"]');
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
										var filterContainer = thisClass.down('[itemId="checkAccountIDFilterItemId"]');
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
	    	cls : 'privilege gran-privilege',
			items:[{
					xtype:'panel',
					width : 'auto',
					items:[{
						xtype: 'panel',
						width : 'auto',
						layout: {
					        type: 'hbox'
					    },
						id : 'checkGranularPrivColumnHeader',
						//layout:'column',
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
							id : 'checkGranularPrivHeader',
							layout: {
						        type: 'column'
						    },
							cls:'red-bg',
							height : 35,
							items: thisClass.setPanelHeader('checkGranularPrivHeader',getLabel('lbl.account','Account'))
						},
						{
							xtype: 'panel',
							width : 'auto',
							minHeight : 25,
							maxHeight : 1323,
							titleAlign : "left", 
							//collapsible : true,
							cls : 'xn-ribbon',
							collapseFirst : true,
							itemId : 'checkGranPrivParametersSection',
							id : 'checkGranPrivParametersSection',
							layout: {
							        type: 'vbox'
							    },
							items: thisClass.setUserCheckGranularRights()	
							
						}]
			 }]
		}];
		if(mode === "VIEW"){
			thisClass.bbar=[
			          '->',{ 
			        	  text:getLabel('btnClose','Close'),
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
			        	  text:getLabel('btnCancel','Cancel'),
			        	  cls : 'ft-button-light',
			        	  handler : function(btn,opts) {
			        		thisClass.destroy();
							objChecksGranularPrivPriviligePopup= null;
							//thisClass.hide();
			        				}
			          },'->',
			          { 
			        	  text:getLabel('submit','Submit'),
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
										if(element.getValue())
											jsonData[objectKey]['privileges']['CANCELSTOPPAY'] = true;
									}
									if('STOPPAYAPPROVE' == mode){
										//editSerials[field.accountId] = element.getValue();
										jsonData[objectKey]['privileges']['STOPPAYAPPROVE'] = element.getValue();;
										if(element.getValue())
											jsonData[objectKey]['privileges']['STOPPAY'] = true;
									}
									
								
									
									if('CREATE_INQUIRY_FLAG' == mode){
										//editSerials[field.accountId] = element.getValue();
										jsonData[objectKey]['privileges']['CREATE_INQUIRY_FLAG'] = element.getValue();;
										if(element.getValue())
											jsonData[objectKey]['privileges']['INQUIRY'] = true;
									}
									if('VIEW_PAID_CHECK_IMG_FLAG' == mode){
										//editSerials[field.accountId] = element.getValue();
										jsonData[objectKey]['privileges']['VIEW_PAID_CHECK_IMG_FLAG'] = element.getValue();;
									}
									if('CREATE_CANCEL_STOPPAY_FLAG' == mode){
										//editSerials[field.accountId] = element.getValue();
										jsonData[objectKey]['privileges']['CREATE_CANCEL_STOPPAY_FLAG'] = element.getValue();;
										if(element.getValue())
											jsonData[objectKey]['privileges']['CANCELSTOPPAY'] = true;
									}
									if('CREATE_STOPPAY_FLAG' == mode){
										//editSerials[field.accountId] = element.getValue();
										jsonData[objectKey]['privileges']['CREATE_STOPPAY_FLAG'] = element.getValue();;
										if(element.getValue())
											jsonData[objectKey]['privileges']['STOPPAY'] = true;
									}
								
							}
			});
			
			var jsonObj = {};
			jsonObj['serviceType'] = 'CM';
			jsonObj['moduleCode'] = '14';
			//console.log("available jsonData :"+JSON.stringify(jsonData));
			var jsonArray = [];
			//only add those records which are updated
			for (var index  in ppGranularFeatureDataBackup){
				var orginalObj = ppGranularFeatureDataBackup[index];
			    var accountId =orginalObj.accountId;
			    var pkgId =orginalObj.packageId;
				var objectKey = accountId+'_'+pkgId;
				var recordKeyNo = orginalObj.recordKeyNo;
			  	// account row is currently selected 
			  	if((objectKey in jsonData)){ 
                       var newObj = jsonData[objectKey];
					 if( newObj['privileges']['INQUIRY'] == this.getBooleanvalue(orginalObj.inquiryFlag)  && 
						 newObj['privileges']['STOPPAY'] == this.getBooleanvalue(orginalObj.stoppayFlag) && 
						 newObj['privileges']['CANCELSTOPPAY'] == this.getBooleanvalue(orginalObj.cancelStoppayFlag) &&
						 newObj['privileges']['CANCELSTOPPAYAPPROVE'] == this.getBooleanvalue(orginalObj.cancelStoppayApproveFlag) && 
						 newObj['privileges']['STOPPAYAPPROVE'] == this.getBooleanvalue(orginalObj.stoppayApproveFlag) &&
						 
						 newObj['privileges']['CREATE_INQUIRY_FLAG'] == this.getBooleanvalue(orginalObj.createInquiryFlag) && 
						 newObj['privileges']['VIEW_PAID_CHECK_IMG_FLAG'] == this.getBooleanvalue(orginalObj.viewPaidCheckImageFlag) &&
						 newObj['privileges']['CREATE_CANCEL_STOPPAY_FLAG'] == this.getBooleanvalue(orginalObj.createCancelStoppayFlag) && 
						 newObj['privileges']['CREATE_STOPPAY_FLAG'] == this.getBooleanvalue(orginalObj.createStoppayFlag))
					 {
					 // if none of the values are changed no need to push into array
						 
					 }else{
					     jsonArray.push(newObj)
					 }
				}else{
				
						//recordKeyNo of record means its saved in db and if its not found in jsonData (i.e currently present in rows on screen) then make all flag N for that account
					
						if(recordKeyNo!== undefined && recordKeyNo!=null && recordKeyNo && !isFilterApplied)
						{
						
							if(  false  ===  this.getBooleanvalue(orginalObj.inquiryFlag)  && 
								 false  ===  this.getBooleanvalue(orginalObj.stoppayFlag) &&
								 false  ===  this.getBooleanvalue(orginalObj.cancelStoppayFlag) &&
								 false  ===  this.getBooleanvalue(orginalObj.cancelStoppayApproveFlag)	&&
								 false  ===  this.getBooleanvalue(orginalObj.stoppayApproveFlag) &&
								 false  ===  this.getBooleanvalue(orginalObj.createInquiryFlag) &&
								 false  ===  this.getBooleanvalue(orginalObj.viewPaidCheckImageFlag) &&
								 false  ===  this.getBooleanvalue(orginalObj.createCancelStoppayFlag)&&
								 false  ===  this.getBooleanvalue(orginalObj.createStoppayFlag))
							 {
							 // if all flags are N means record is previously removed no need to add into deleted array 
								 
							 }else{
								var newEntry = {};
								newEntry['accountId'] = accountId;
								newEntry['packageId'] = pkgId;
								var privileges = {'INQUIRY':false,'STOPPAY':false,'CANCELSTOPPAY':false,'CANCELSTOPPAYAPPROVE':false,'STOPPAYAPPROVE':false,'CREATE_INQUIRY_FLAG':false,'VIEW_PAID_CHECK_IMG_FLAG':false,'CREATE_CANCEL_STOPPAY_FLAG':false,'CREATE_STOPPAY_FLAG':false};
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
function checkGranularViewIfNotSelected(isSelected,panelPointer,obj){
	if(null != panelPointer && undefined != panelPointer){
	if(isSelected){
	if(null != panelPointer && undefined != panelPointer){
		var viewItemId =obj.accountId + "_" +obj.viewMode;
		var view_chk_box = panelPointer.down('checkbox[itemId='+viewItemId+']');
		if(null != view_chk_box && undefined != view_chk_box && view_chk_box.value== false){
			view_chk_box.setValue(true);}
		}
	}else{
		if("INQUIRY"===obj.mode){
				var createInquiryIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + '_CREATE_INQUIRY_FLAG' +']');
				if( createInquiryIconItemId )
				{
					createInquiryIconItemId.setValue( false );
					createInquiryIconItemId.defVal = false;
				}					
			}
		if("STOPPAY"===obj.mode){
				var createStopPayIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + '_CREATE_STOPPAY_FLAG' +']');
				if( createStopPayIconItemId )
				{
					createStopPayIconItemId.setValue( false );
					createStopPayIconItemId.defVal = false;
				}
				var approveStopPayIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + '_STOPPAYAPPROVE' +']');
				if( approveStopPayIconItemId )
				{
					approveStopPayIconItemId.setValue( false );
					approveStopPayIconItemId.defVal = false;
				}				
			}
		if("CANCELSTOPPAY"===obj.mode){
				var createCancelStopPayIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + '_CREATE_CANCEL_STOPPAY_FLAG' +']');
				if( createCancelStopPayIconItemId )
				{
					createCancelStopPayIconItemId.setValue( false );
					createCancelStopPayIconItemId.defVal = false;
				}
				var cancelStopPayApproveIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + '_CANCELSTOPPAYAPPROVE' +']');
				if( cancelStopPayApproveIconItemId )
				{
					cancelStopPayApproveIconItemId.setValue( false );
					cancelStopPayApproveIconItemId.defVal = false;
				}				
			}
		}
	}
}