var granularPrivfieldJson = [];
var featureMap = {};
var accountAssignedMap = {};
//var brGranularFeatureDataBackup;
var allBRAccountsSelectedFlag = 'N';
var isFilterApplied = false;
Ext.define('GCP.view.BrGranularPriviligesPopup', {
	extend: 'Ext.window.Window',
	xtype: 'brGranularPriviligesPopup',
	minWidth : 400,
	maxWidth : 735,
	minHeight : 156,
	maxHeight : 550,
	overflowY: 'auto',
	overflowX: 'auto',
	cls : 'xn-popup',
	title: getLabel('brReportGranularPrivilege','Balance Reporting Granular Privileges'),
	config: {
		modal : true,
		selectedAccounts : null,
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
					params : { module: '01',categoryId:userCategory,serviceType:'BR'},
					success : function(response) {
					 	 brGranularFeatureData = Ext.JSON.decode(response.responseText);
						// brGranularFeatureDataBackup =  JSON.parse(JSON.stringify(brGranularFeatureData));
						return brGranularFeatureData; 
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
		
		return brGranularFeatureData;
	},
	loadBRAccounts: function() {
	var me = this;
		if(mode === "VIEW"){
				Ext.Ajax.request({
					url : 'services/userCategory/accounts.json',
					method : 'POST',
					async: false,
					params : { module: '01',categoryId:userCategory,$inlinecount:'allpages',$top:5000},
					success : function(response) {
					 	 brAccountsData = Ext.JSON.decode(response.responseText);
						return brAccountsData; 
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
		return brAccountsData;
	},
	
	loadFeaturs: function() {
	var me = this;
		if(mode === "VIEW"){
				Ext.Ajax.request({
					url : 'services/userCategory/previlige.json',
					method : 'POST',
					async: false,
					params : { module: '01',categoryId:userCategory},
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
	
	setUserBRRights : function()
	{
		var self = this;
			
		var privdata = self.loadFeaturs();
		var filteredPrivData = this.filterFeatures(privdata);
		var viewRightsSerials  = document.getElementById('viewRightsSerials');
		var selectedViewRightsObj; 
		if(typeof viewRightsSerials!== undefined && viewRightsSerials!==null && viewRightsSerials.value){
		  selectedViewRightsObj = Ext.decode(document.getElementById('viewRightsSerials').value);
		}
		
		Ext.each(filteredPrivData, function(feature, index) {
			
			var key = feature.featureId;
			var rmserial = feature.rmSerial;
			var value = feature.canView;
			if(typeof selectedViewRightsObj!== undefined && selectedViewRightsObj){
			
			   if(selectedViewRightsObj.hasOwnProperty(rmserial)){
			     value = selectedViewRightsObj[rmserial];
			   }
			   featureMap[key] = self.getStringBooleanvalue(value);
			
			}else{
				 featureMap[key] = value;
			}	 
			
		});
		
		//console.log("self.featureMap "+featureMap);
		
	},
	
	setBRAccounts : function()
	{
		var self = this;
			
		var privdata = self.loadBRAccounts();
		var filteredPrivData;
		
		if(privdata!== null && privdata.length!== 0 ){
			filteredPrivData = privdata.d.details;
		}
			var selectedBRAccounts  = document.getElementById('selectedBRAccounts');
		var selectedBRAccountsObj; 
		if(typeof selectedBRAccounts!== undefined && selectedBRAccounts!==null && selectedBRAccounts.value){
		  selectedBRAccountsObj = Ext.decode(selectedBRAccounts.value);
		}
		
		var allBRFlag = document.getElementById('allbRAccountsSelectedFlag');
		if(typeof allBRFlag!== undefined && allBRFlag!==null && allBRFlag.value){
		  self.allBRAccountsSelectedFlag = allBRFlag.value;
		}
	 
		
		Ext.each(filteredPrivData, function(account, index) {
			var accountKey = account.accountNumber + '|'+ account.accountName;
			var isAssigned = account.isAssigned;
			var prevSelectedAccountObj;
			prevSelectedAccountObj = self.getAccountFromSelectedList(selectedBRAccountsObj,account);
			
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
		featureItems.push({xtype: 'label',text: getLabel("lbl.type","Type"),padding:'0 0 0 0',cls:'boldText granular-privilege-label privilege-grid-main-header privilege-grid-type-label granular-privilege-type'});
		
		
		if(featureMap["ALLOWTXN"] == 'Y'){
		   featureItems.push({xtype: 'label',text: getLabel("allowTransaction","Allow Transactions"),padding:'0 0 0 0',cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-headers'});
		}
		
		if(featureMap["TRS"] == 'Y'){
		   featureItems.push({xtype: 'label',text: getLabel('transactionSearch',"Transaction Search"),padding:'0 0 0 5',cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-headers'});
		}
		if(featureMap["IRD"] == 'Y'){
			featureItems.push({xtype: 'label',text:getLabel("intraDaySummary","Intra Day Summary"),padding:'0 0 0 5',cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-headers'});
		}
		if(featureMap["PRV"] == 'Y'){
		featureItems.push({xtype: 'label',text:getLabel("previousDaySummary", "Previous Day Summary"),padding:'0 0 0 0',cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-headers'});
		}
		if(featureMap["INTRAACT"] == 'Y'){
		featureItems.push({xtype: 'label',text:getLabel("intraDayActivity", "Intra Day Activity"),padding:'0 0 0 10',cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-headers'});
		}
		if(featureMap["PREVACT"] == 'Y'){
		featureItems.push({xtype: 'label',text:getLabel("previousDayActivity", "Previous Day Activity"),padding:'0 0 0 5',cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-headers'});
		}
		if(featureMap["PREVVCIMG"] == 'Y'){
		featureItems.push({xtype: 'label',text:getLabel("prevDayDetailsViewImage", "Prev Day Detail - View Images"),padding:'0 0 0 5',cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-headers'});
		}
		if(featureMap["VCIMG"] == 'Y'){
		featureItems.push({xtype: 'label',text:getLabel("intraDayDetailsViewImage", "Intra Day Detail - View Images"),padding:'0 0 0 5',cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-headers'});
		}
		if(featureMap["F_SRV_BR_PRV_CP"] == 'Y'){
		featureItems.push({xtype: 'label',text:getLabel("cashPositionSummary", "Cash Position Summary"),padding:'0 0 0 5',width:105,cls:'boldText granular-privilege-label privilege-grid-main-header'});
		if(hasfeatureAccount.toLowerCase() ==='true'){
		featureItems.push({xtype: 'label',text: getLabel("cashPositionAccount","Cash Position Account"),padding:'0 0 0 5',width:105,cls:'boldText granular-privilege-label privilege-grid-main-header'});
		}
		if(hasfeatureAccountDetails.toLowerCase() ==='true'){
		featureItems.push({xtype: 'label',text:getLabel("cashPositionTransactions", "Cash Position Transactions"),padding:'0 0 0 5',width:105,cls:'boldText granular-privilege-label privilege-grid-main-header'});
		}
		}
		return featureItems;
	},
	setPanelHeader : function(id, title)
	{
		var featureItems = [];
		featureItems.push({xtype: 'label',text: getLabel('lbl.account','Account'),padding:'8 0 0 10',cls:'boldText granular-privilege-accountno granular-privilege-account-header',height:35 });
		featureItems.push({xtype: 'label',text: getLabel('accountName','Account Name'),padding:'8 0 0 10',cls:'boldText granular-privilege-accountno granular-privilege-account-header',height:35 });
		
			
		if(featureMap["ALLOWTXN"] == 'Y'){
		/*featureItems.push({xtype: 'button',columnWidth:0.07,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 50', width : 10, height : 20, itemId : id+"_allowTxnIcon", border : 0,cls:'btn'});*/
		
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_allowTxnIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});
		}
		
		if(featureMap["TRS"] == 'Y'){
		/*featureItems.push({xtype: 'button',columnWidth:0.07,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 55', width : 10, height : 20, itemId : id+"_txnSearchIcon", border : 0,cls:'btn'});*/
		
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_txnSearchIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});
		}
		
		if(featureMap["IRD"] == 'Y'){
		/*featureItems.push({xtype: 'button',columnWidth:0.07,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 55',width : 10, height : 20, itemId : id+"_intraDaySummaryIcon", border : 0,cls:'btn'});*/
		
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_intraDaySummaryIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});
		}
		if(featureMap["PRV"] == 'Y'){
		/*featureItems.push({xtype: 'button',columnWidth:0.07,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 55',width : 10, height : 20, itemId : id+"_previousDaySummaryIcon", border : 0,cls:'btn'});*/
		
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_previousDaySummaryIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});
		}
		if(featureMap["INTRAACT"] == 'Y'){
		/*featureItems.push({xtype: 'button',columnWidth:0.07,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 50',width : 10, height : 20, itemId : id+"_intraDayActivityIcon", border : 0,cls:'btn'});*/
		
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_intraDayActivityIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});
		}
		if(featureMap["PREVACT"] == 'Y'){
		/*featureItems.push({xtype: 'button',columnWidth:0.07,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 50',width : 10, height : 20, itemId : id+"_previousDayActivityIcon", border : 0,cls:'btn'});*/
		
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_previousDayActivityIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});
		}
		if(featureMap["PREVVCIMG"] == 'Y'){
		/*featureItems.push({xtype: 'button',columnWidth:0.08,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 60',width : 10, height : 20, itemId : id+"_prevDayDetailViewImgIcon", border : 0,cls:'btn'});*/
		
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_prevDayDetailViewImgIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});
		}
		if(featureMap["VCIMG"] == 'Y'){
		/*featureItems.push({xtype: 'button',columnWidth:0.08,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 60',width : 10, height : 20, itemId : id+"_intraDayDetailViewImgIcon", border : 0,cls:'btn'});*/
		
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_intraDayDetailViewImgIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});
		}
		if(featureMap["F_SRV_BR_PRV_CP"] == 'Y'){
		/*featureItems.push({xtype: 'button',columnWidth:0.7,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 45',width : 10, height : 20, itemId : id+"_cashPositionSummaryIcon", border : 0,cls:'btn'});
		featureItems.push({xtype: 'button',columnWidth:0.07,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 45',width : 10, height : 20, itemId : id+"_cashPositionAccountIcon", border : 0,cls:'btn'});
		featureItems.push({xtype: 'button',columnWidth:0.07,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 45',width : 10, height : 20, itemId : id+"_cashPositionDetailIcon", border : 0,cls:'btn'});*/
		
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header',
		text: title,
		width: 105,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 35', width : 10, height : 20, itemId : id+"_cashPositionSummaryIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});
		
		if(hasfeatureAccount.toLowerCase() ==='true'){
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header',
		text: title,
		width: 105,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 35', width : 10, height : 20, itemId : id+"_cashPositionAccountIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});
		}
		
		if(hasfeatureAccountDetails.toLowerCase() ==='true'){
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header',
		text: title,
		width: 105,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 35', width : 10, height : 20, itemId : id+"_cashPositionDetailIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});
		}
		}
		return featureItems;
	},
	setPriviligeMenu : function(feature,MODE,index)
	{
		var obj = new Object();
		
		
		if(MODE == 'ALLOWTXN')
		{
			obj.checked = this.getBooleanvalue(feature.allowTxnFlag);
		}
		else if(MODE == 'INTRADAYSUMMARY')
		{	
			
			obj.checked = this.getBooleanvalue(feature.intraDaySummaryFlag);
		}
		else if(MODE == 'PREVIOUSDAYSUMMARY')
		{
			
			obj.checked = this.getBooleanvalue(feature.previousDaySummaryFlag);
		}else if(MODE == 'INTRADAYACTIVITY')
		{	
			
			obj.checked = this.getBooleanvalue(feature.intraDayActivityFlag);
		}else if(MODE == 'PREVIOUSDAYACTIVITY')
		{	
			
			obj.checked = this.getBooleanvalue(feature.previousDayActivityFlag);
		}
		else if(MODE == 'PREVDAYDETAILVIEWIMG')
		{
			
			obj.checked = this.getBooleanvalue(feature.prevDayDetailViewImgFlag);
			
		}else if(MODE == 'INTRADAYDETAILVIEWIMG')
		{	
			
			obj.checked = this.getBooleanvalue(feature.intraDayDetailViewImgFlag);
			
		}
	
		else if(MODE == 'TXNSEARCH')
		{	
			
			obj.checked = this.getBooleanvalue(feature.transactionSearchFlag);
		}
		else if(MODE == 'CASHPOSITIONSUMMARY')
		{
			obj.checked = this.getBooleanvalue(feature.cashPositionSummaryFlag);
		}
		else if(MODE == 'CASHPOSITIONACCOUNT')
		{
			obj.checked = this.getBooleanvalue(feature.cashPositionAccountFlag);
		}
		else if(MODE == 'CASHPOSITIONDETAIL')
		{
			obj.checked = this.getBooleanvalue(feature.cashPositionDetailFlag);
		}
		
		obj.xtype="checkbox";
		
		if(index%2==0){
			if(MODE=='CASHPOSITIONSUMMARY' || MODE=='CASHPOSITIONACCOUNT' || MODE=='CASHPOSITIONDETAIL') {
				obj.cls = 'granular-cellContent privilege-grid-odd granular-accnt-privilege-headers';
			} else {
				obj.cls = 'granular-cellContent privilege-grid-odd granular-privilege-headers';
			}
		} else {
			if(MODE=='CASHPOSITIONSUMMARY' || MODE=='CASHPOSITIONACCOUNT' || MODE=='CASHPOSITIONDETAIL') {
				obj.cls = 'granular-cellContent privilege-grid-even granular-accnt-privilege-headers';
			} else {	
				obj.cls = 'granular-cellContent privilege-grid-even granular-privilege-headers';
			}	
		}
		obj.padding='0 0 0 0';
		obj.itemId = feature.accountId+"_"+feature.packageId+"_"+MODE;
		obj.mode = MODE;
		obj.accountId = feature.accountId;
		obj.packageId = feature.packageId;
		//obj.border = 1;
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
	
	updateFeatureIfPreviouslySelected:function( feature ,previouslySubmitedJsonObj) {
      
	   
			 
		 for(key in previouslySubmitedJsonObj.accountPackagePrivileges){
			var previousSelectedObj = previouslySubmitedJsonObj.accountPackagePrivileges[key];
			if ( previousSelectedObj.accountId == feature.accountId && previousSelectedObj.packageId == feature.packageId)
			{
				if(previousSelectedObj.privileges.hasOwnProperty("ALLOWTXN") )
				 {
					feature.allowTxnFlag = previousSelectedObj.privileges.ALLOWTXN ? true:false;
				  }
				
				
				if(previousSelectedObj.privileges.hasOwnProperty("TXNSEARCH") )
				 {
					feature.transactionSearchFlag = previousSelectedObj.privileges.TXNSEARCH ? true:false;
				  }				
					
				  if(previousSelectedObj.privileges.hasOwnProperty("INTRADAYSUMMARY") )
				 {
					feature.intraDaySummaryFlag= previousSelectedObj.privileges.INTRADAYSUMMARY ? true:false;
				  } if(previousSelectedObj.privileges.hasOwnProperty("PREVIOUSDAYSUMMARY") )
				 {
					feature.previousDaySummaryFlag= previousSelectedObj.privileges.PREVIOUSDAYSUMMARY ? true:false;
				  } if(previousSelectedObj.privileges.hasOwnProperty("INTRADAYACTIVITY") )
				 {
					feature.intraDayActivityFlag= previousSelectedObj.privileges.INTRADAYACTIVITY ? true:false;
				  } if(previousSelectedObj.privileges.hasOwnProperty("PREVIOUSDAYACTIVITY") )
				 {
					feature.previousDayActivityFlag= previousSelectedObj.privileges.PREVIOUSDAYACTIVITY ? true:false;
				  } if(previousSelectedObj.privileges.hasOwnProperty("PREVDAYDETAILVIEWIMG") )
				 {
					feature.prevDayDetailViewImgFlag= previousSelectedObj.privileges.PREVDAYDETAILVIEWIMG ? true:false;
				  } if(previousSelectedObj.privileges.hasOwnProperty("INTRADAYDETAILVIEWIMG") )
				 {
					feature.intraDayDetailViewImgFlag= previousSelectedObj.privileges.INTRADAYDETAILVIEWIMG ? true:false;
				  }
			}
		  }
			 
		

	},
	
	setBRGranularRights : function()
	{
		var self = this;
		var data = self.loadGranularFeaturs();
		var filteredData = this.filterFeatures(data);
		var featureItems = [];
		
	    featureItems = self.createPrivilegesContainer(filteredData);
		
		
		return featureItems;
	},
	
	
  createPrivilegesContainer : function(filteredData){
	var self = this;
	var featureItems = [];
	var prevbrGranularPermissions = document.getElementById("brGranularPermissions");
	
	Ext.each(filteredData, function(feature, index) {
				var panel = Ext.create('Ext.panel.Panel', {
					columnWidth:1,
					layout:'column',
					bodyStyle: {
						background: '#FAFAFA'
					}
				});
				var accountText = feature.accountNo + '|'+ feature.accountName;
				
				if(self.allBRAccountsSelectedFlag == 'Y' || accountAssignedMap[accountText] == true) {
					
					panel.insert({xtype: 'label',text: feature.accountNo  ,padding:'5 0 0 20',height:'auto',cls:'ux_text-elipsis granular-privilege-accountno privilege-grid-main-header privilege-grid-odd privilege-admin-rights', autoEl: {
					tag: 'label',
					'data-qtip': feature.accountNo
					} });
					panel.insert({xtype: 'label',text: feature.accountName  ,padding:'5 0 0 10',height:'auto',cls:'ux_text-elipsis granular-privilege-accountno privilege-grid-odd privilege-admin-rights', autoEl: {
					tag: 'label',
					'data-qtip': feature.accountName
					} });
					
					if(typeof prevbrGranularPermissions!== undefined &&  prevbrGranularPermissions!==null && prevbrGranularPermissions.value){
						var previouslySubmitedJsonObj =  Ext.decode(prevbrGranularPermissions.value);
						self.updateFeatureIfPreviouslySelected(feature,previouslySubmitedJsonObj);
					
					}
				
					if(featureMap["ALLOWTXN"] == 'Y'){
					
					   panel.insert(self.setPriviligeMenu(feature,"ALLOWTXN",index));
					}
					if(featureMap["TRS"] == 'Y'){
					
					   panel.insert(self.setPriviligeMenu(feature,"TXNSEARCH",index));
					}
					if(featureMap["IRD"] == 'Y'){
					panel.insert(self.setPriviligeMenu(feature,"INTRADAYSUMMARY",index));
					}
					if(featureMap["PRV"] == 'Y'){
					panel.insert(self.setPriviligeMenu(feature,"PREVIOUSDAYSUMMARY",index));
					}
					if(featureMap["INTRAACT"] == 'Y'){
					panel.insert(self.setPriviligeMenu(feature,"INTRADAYACTIVITY",index));
					}
					if(featureMap["PREVACT"] == 'Y'){
					panel.insert(self.setPriviligeMenu(feature,"PREVIOUSDAYACTIVITY",index));
					}
					if(featureMap["PREVVCIMG"] == 'Y'){
					panel.insert(self.setPriviligeMenu(feature,"PREVDAYDETAILVIEWIMG",index));
					}
					if(featureMap["VCIMG"] == 'Y'){
					panel.insert(self.setPriviligeMenu(feature,"INTRADAYDETAILVIEWIMG",index));
					}
					
					if(featureMap["F_SRV_BR_PRV_CP"] == 'Y'){
					panel.insert(self.setPriviligeMenu(feature,"CASHPOSITIONSUMMARY",index));
					if(hasfeatureAccount.toLowerCase() ==='true'){
					panel.insert(self.setPriviligeMenu(feature,"CASHPOSITIONACCOUNT",index));
					}
					if(hasfeatureAccountDetails.toLowerCase() ==='true'){
					panel.insert(self.setPriviligeMenu(feature,"CASHPOSITIONDETAIL",index));
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
	thisClass.setUserBRRights();
	thisClass.setBRAccounts();
	
		thisClass.items = [{
					xtype:'panel',
					width : 'auto',
					items:[{
						xtype: 'panel',
						width : 'auto',
						id : 'brGranularPrivFilterBox',
						layout:'column',
						cls: 'ft-padding-bottom',
						items: [
							{
								xtype : 'AutoCompleter',
								//cls : 'autoCmplete-field ux_paddingb',
								fieldCls : 'xn-form-text xn-suggestion-box granular-autocompleter', //xn-form-text w12 x-form-empty-field 
								id : 'brAccountIDFilterItemId',
								itemId : 'brAccountIDFilterItemId',
								name : 'brAccountIDFilterItemId',
								matchFieldWidth : true,
								labelSeparator : '',
								//fieldLabel :  getLabel( 'accountID', 'Account' ),
								cfgUrl : 'services/userseek/accountPackagesSeekForBR.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'brAccountIDFilterItemId',
								cfgRootNode : 'd.preferences',
								cfgKeyNode : 'ID',
								cfgDataNode1 : 'DESCRIPTION',
								//cfgDataNode2 : 'DESCRIPTION',
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
									 var filterContainer = thisClass.down('[itemId="brAccountIDFilterItemId"]');
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
										var filterContainer = thisClass.down('[itemId="brAccountIDFilterItemId"]');
										filterContainer.setValue("");
										var selected = thisClass.down('component[itemId="clearLink"]');
										selected.hide();
									},
									element: 'el',
									delegate: 'a'
								}
							}
							/*,
							{
								xtype : 'button',
								margin : '0 0 12 40',
								cls : 'xn-button ux_button-background-color ux_search-button',
								glyph : 'xf002@fontawesome',
								text : getLabel( 'btnSearch', 'Search' ),
								itemId :'searchBtnItemId',
								  handler : function(btn,opts) {
										
										
										thisClass.filterHandler();
										
										 
			        				}
							}*/
							
						]
						
						
				  }]
			 },{
	    	xtype: 'container',
			maxHeight : 1323,//2372,
			overflowX: 'auto',
			overflowY: 'hidden',
			width : 'auto',
	    	cls : 'privilege',
			items:[{
					xtype:'panel',
					width : 'auto',
					items:[{
						xtype: 'panel',
						width : 'auto',
						id : 'brGranularPrivColumnHeader',
						layout: {
					        type: 'hbox'
					    },
						cls: 'mainHeader',
						padding: '0 0 0 10',
						items: thisClass.setColumnHeader()
				  }]
			 },{
			 		xtype:'panel',
					width : 'auto',		
					layout: {
						        type: 'vbox'
						    },
					maxHeight : 1323,
			 		items:[{
							xtype: 'panel',
							id : 'brGranularPrivHeader',
							width : 'auto',
							layout: {
						        type: 'column'
						    },
							cls:'red-bg',
							height : 35,
							items: thisClass.setPanelHeader('brGranularPrivHeader',getLabel('lbl.account','Account'))
						},
						{
							xtype: 'panel',
							width : 'auto',
							minHeight : 25,
							maxHeight : 1323,//350,
							maxWidth : thisClass.max_width,
							titleAlign : "left", 
							//collapsible : true,
							cls : 'xn-ribbon',
							collapseFirst : true,
							itemId : 'brGranPrivParametersSection',
							id : 'brGranPrivParametersSection',
							layout: {
							        type: 'vbox'
							    },
							items: thisClass.setBRGranularRights()
						}]
			 }]
		}];
		if(mode === "VIEW"){
			thisClass.bbar=[
			          '->',{ 
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
							objBrGranularPrivPriviligePopup= null;
							//thisClass.hide();
			        				}
			          },'->',
			          { 
			        	  text: getLabel('btnSubmit','Submit'),
			        	  cls : 'ft-button-primary',
			        	  /*handler : function(btn,opts) {
			        	  	thisClass.saveItems();
			        		thisClass.close();
			        				},*/
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
	
	reconfigure : function(){
		var thisClass = this;
		var searchField=Ext.getCmp('brAccountIDFilterItemId');
		if(searchField!="" && searchField!=undefined)
		searchField.setRawValue('');
		Ext.getCmp('brGranPrivParametersSection').removeAll();
		Ext.getCmp('brGranularPrivHeader').removeAll();
		Ext.getCmp('brGranularPrivColumnHeader').removeAll();
		
		
		thisClass.setUserBRRights();
		thisClass.setBRAccounts();
		
		Ext.getCmp('brGranPrivParametersSection').add(thisClass.setBRGranularRights() );
		Ext.getCmp('brGranularPrivHeader').add(thisClass.setPanelHeader('brGranularPrivHeader',getLabel('lbl.account','Account')));
		Ext.getCmp('brGranularPrivColumnHeader').add(thisClass.setColumnHeader());
	
	
	
	},
	
	
	filterHandler :function(){
	  var self = this;
	  var filterCode = Ext.getCmp('brAccountIDFilterItemId').getValue();
	   
	  Ext.getCmp('brGranPrivParametersSection').removeAll();
	 
		//Ext.getBody().mask("dasd", 'loading');
	   var filterResponse = [];
	   //console.log("filterCode "+filterCode);
		var filteredData ;
		if(filterCode)	{
			brGranularFeatureData.forEach(function (arrayElem){ 
				if( (arrayElem.accountId === filterCode) || ((arrayElem.accountName.toUpperCase().indexOf(filterCode.toUpperCase()) > -1 )|| (arrayElem.accountNo.toUpperCase().indexOf(filterCode.toUpperCase()) > -1)) ){
				//console.log("arrayElem "+arrayElem);
				filterResponse.push(JSON.parse(JSON.stringify(arrayElem)));
				 //break;
				}
			});		
		
		   filteredData = filterResponse;
		   isFilterApplied=true;
		  }else{
		  isFilterApplied=false;
			filteredData = this.filterFeatures(brGranularFeatureData);
		  }
		
		
		
		var featureItems = [];
		featureItems = self.createPrivilegesContainer(filteredData);
		
		
		 Ext.getCmp('brGranPrivParametersSection').add(featureItems);
	},
	saveItems : function() {	
					var me = this;
					var jsonData = {};
					var pkgId='DEFAULT';
					Ext.each(granularPrivfieldJson, function(field, index) {
						var featureId = field.itemId;
						var accountId =field.accountId;
						//var pkgId = field.packageId;
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
									
															
									if('ALLOWTXN' == mode){
										jsonData[objectKey]['privileges']['ALLOWTXN'] = element.getValue();
									}
									
									if('TXNSEARCH' == mode){
										jsonData[objectKey]['privileges']['TXNSEARCH'] = element.getValue();
									}
									if('INTRADAYSUMMARY' == mode){
										jsonData[objectKey]['privileges']['INTRADAYSUMMARY'] = element.getValue();
									}
									if('PREVIOUSDAYSUMMARY' == mode){
										jsonData[objectKey]['privileges']['PREVIOUSDAYSUMMARY'] = element.getValue();
									}
									if('INTRADAYACTIVITY' == mode){
										jsonData[objectKey]['privileges']['INTRADAYACTIVITY'] = element.getValue();
									}
									if('PREVIOUSDAYACTIVITY' == mode){
										jsonData[objectKey]['privileges']['PREVIOUSDAYACTIVITY'] = element.getValue();
									}
									if('PREVDAYDETAILVIEWIMG' == mode){
										jsonData[objectKey]['privileges']['PREVDAYDETAILVIEWIMG'] = element.getValue();
									}
									if('INTRADAYDETAILVIEWIMG' == mode){
										jsonData[objectKey]['privileges']['INTRADAYDETAILVIEWIMG'] = element.getValue();
									}
									if('CASHPOSITIONSUMMARY' == mode){
										jsonData[objectKey]['privileges']['CASHPOSITIONSUMMARY'] = element.getValue();
									}
									if('CASHPOSITIONACCOUNT' == mode){
										jsonData[objectKey]['privileges']['CASHPOSITIONACCOUNT'] = element.getValue();
									}
									if('CASHPOSITIONDETAIL' == mode){
										jsonData[objectKey]['privileges']['CASHPOSITIONDETAIL'] = element.getValue();
									}
									
							}
			});
			
			var jsonObj = {};
			jsonObj['serviceType'] = 'BR';
			jsonObj['moduleCode'] = '01';
			
			//console.log("jsonData :"+JSON.stringify(jsonData));
			var jsonArray = [];
			//only add those records which are updated
			
			for (var index  in brGranularFeatureDataBackup){
			
				var orginalObj = brGranularFeatureDataBackup[index];
			    var accountId =orginalObj.accountId;
			    var pkgId =orginalObj.packageId;
				var objectKey = accountId+'_'+pkgId;
				var recordKeyNo = orginalObj.recordKeyNo;
			  	// account row is currently selected 
				if((objectKey in jsonData)){ 
                       var newObj = jsonData[objectKey];
					 if( newObj['privileges']['ALLOWTXN'] === this.getBooleanvalue(orginalObj.allowTxnFlag)  &&
						 newObj['privileges']['TXNSEARCH'] === this.getBooleanvalue(orginalObj.transactionSearchFlag)  &&		
						 newObj['privileges']['INTRADAYSUMMARY']  ===  this.getBooleanvalue(orginalObj.intraDaySummaryFlag) &&
						 newObj['privileges']['PREVIOUSDAYSUMMARY']  ===  this.getBooleanvalue(orginalObj.previousDaySummaryFlag) &&
						 newObj['privileges']['INTRADAYACTIVITY']  ===  this.getBooleanvalue(orginalObj.intraDayActivityFlag)	&&
						 newObj['privileges']['PREVIOUSDAYACTIVITY']  ===  this.getBooleanvalue(orginalObj.previousDayActivityFlag) &&
						 newObj['privileges']['PREVDAYDETAILVIEWIMG']  ===  this.getBooleanvalue(orginalObj.prevDayDetailViewImgFlag) &&
						 newObj['privileges']['INTRADAYDETAILVIEWIMG']  ===  this.getBooleanvalue(orginalObj.intraDayDetailViewImgFlag) &&
						 newObj['privileges']['CASHPOSITIONSUMMARY']  ===  this.getBooleanvalue(orginalObj.cashPositionSummaryFlag)&&
						 newObj['privileges']['CASHPOSITIONACCOUNT']  ===  this.getBooleanvalue(orginalObj.cashPositionAccountFlag)&&
						 newObj['privileges']['CASHPOSITIONDETAIL']  ===  this.getBooleanvalue(orginalObj.cashPositionDetailFlag) )
					 {
					 // if none of the values are changed no need to push into array
						 
					 }else{
					     jsonArray.push(newObj);
					 }
				
				}else{
				
						//recordKeyNo of record means its saved in db and if its not found in jsonData (i.e currently present in rows on screen) then make all flag N for that account
					
						if(recordKeyNo!== undefined && recordKeyNo!=null && recordKeyNo && !isFilterApplied)
						{
						
							if(  false  ===  this.getBooleanvalue(orginalObj.allowTxnFlag)  && 
								 false  ===  this.getBooleanvalue(orginalObj.intraDaySummaryFlag) &&
								 false  ===  this.getBooleanvalue(orginalObj.previousDaySummaryFlag) &&
								 false  ===  this.getBooleanvalue(orginalObj.intraDayActivityFlag)	&&
								 false  ===  this.getBooleanvalue(orginalObj.previousDayActivityFlag) &&
								 false  ===  this.getBooleanvalue(orginalObj.prevDayDetailViewImgFlag) &&
								 false  ===  this.getBooleanvalue(orginalObj.intraDayDetailViewImgFlag) &&
								  false  ===  this.getBooleanvalue(orginalObj.cashPositionSummaryFlag) &&
								   false  ===  this.getBooleanvalue(orginalObj.cashPositionAccountFlag) &&
								    false  ===  this.getBooleanvalue(orginalObj.cashPositionDetailFlag) &&
								 false  ===  this.getBooleanvalue(orginalObj.transactionSearchFlag))
							 {
							 // if all flags are N means record is previously removed no need to add into deleted array 
								 
							 }else{
								 var newEntry = {};
								newEntry['accountId'] = accountId;
								newEntry['packageId'] = pkgId;
								var privileges = {'ALLOWTXN':false,'TXNSEARCH':false,'INTRADAYSUMMARY':false,'PREVIOUSDAYSUMMARY':false,'INTRADAYACTIVITY':false,'PREVIOUSDAYACTIVITY':false,
								'PREVDAYDETAILVIEWIMG':false,'CASHPOSITIONSUMMARY':false,'CASHPOSITIONACCOUNT':false,'CASHPOSITIONDETAIL':false,'INTRADAYDETAILVIEWIMG':false};
								newEntry['privileges'] = privileges;
								
								jsonArray.push(newEntry);
							 }
							
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