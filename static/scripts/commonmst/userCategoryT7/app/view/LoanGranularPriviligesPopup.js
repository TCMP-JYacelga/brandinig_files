var granularPrivfieldJson = [];
var featureMap = {};
var accountAssignedMap = {};
var allLoanAccountsSelectedFlag = 'N';
var isFilterApplied = false;
//var granularFeatureData;
Ext.define('GCP.view.LoanGranularPriviligesPopup', {
    extend: 'Ext.window.Window',
    xtype: 'loanGranularPriviligesPopup',
	minWidth : 400,
	maxWidth : 735,
	minHeight : 156,
	maxHeight : 550,
	//overflowY: 'auto',
	overflowX: 'auto',
	cls : 'xn-popup',
	title: getLabel('loanGranularPrivilege','Loan Granular Privileges'),
	//cls : 't7-grid',
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
		resize : function(){
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

	loadPrivilegesFeaturs: function() {
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
	loadAccounts: function() {
	var me = this;
		if(mode === "VIEW"){
				Ext.Ajax.request({
					url : 'services/userCategory/accounts.json',
					method : 'POST',
					async: false,
					params : { module: '07',categoryId:userCategory,$inlinecount:'allpages',$top:5000},
					success : function(response) {
					 	 loansAccountsData = Ext.JSON.decode(response.responseText);
						return loansAccountsData; 
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
		return loansAccountsData;
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
setLoansAccounts : function()
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

		var allPPFlag = document.getElementById('allLoanAccountsSelectedFlag');
		if( self.isHiddenElementNotNull(allPPFlag)){
		  self.allLoanAccountsSelectedFlag = allPPFlag.value;
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

	setLoansRights : function()
	{
		var self = this;

		var privdata = self.loadPrivilegesFeaturs();
		var filteredPrivData = this.filterPrivFeatures(privdata,'LOANPRM');

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
			if(feature.featureId === 'LOANS' && (feature.featureWeight ==='390' || feature.featureWeight ==='391')){
					key=feature.featureId +'_'+feature.featureWeight;
			}
			var rightValue;
			var rmserial = feature.featureWeight;

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
		var searchField=Ext.getCmp('loanAccountIDFilterItemId');
		if(searchField!="" && searchField!=undefined)
		searchField.setRawValue('');
		Ext.getCmp('loanGranPrivParametersSection').removeAll();
		Ext.getCmp('loanGranularPrivHeader').removeAll();
		Ext.getCmp('loanGranularPrivColumnHeader').removeAll();

		thisClass.setLoansRights();
		thisClass.setLoansAccounts();

		Ext.getCmp('loanGranPrivParametersSection').add(thisClass.setUserLoanGranularRights() );
		Ext.getCmp('loanGranularPrivHeader').add(thisClass.setPanelHeader('loanGranularPrivHeader',getLabel('lbl.account','Account')));
		Ext.getCmp('loanGranularPrivColumnHeader').add(thisClass.setColumnHeader());

	

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
				if(previousSelectedObj.privileges.hasOwnProperty("VIEW_SCHEDULE_TRANSFER_FLAG") )
				 {
					feature.viewScheduleTransferFlag = previousSelectedObj.privileges.VIEW_SCHEDULE_TRANSFER_FLAG ? true:false;
				  }
				 /*if(previousSelectedObj.privileges.hasOwnProperty("EDIT_SCHEDULE_TRANSFER_FLAG") )
				 {
					feature.editScheduleTransferFlag = previousSelectedObj.privileges.EDIT_SCHEDULE_TRANSFER_FLAG ? true:false;
				  }*/

				if(previousSelectedObj.privileges.hasOwnProperty("VIEW_INVOICES_FLAG") )
				 {
					feature.viewInvoicesFlag = previousSelectedObj.privileges.VIEW_INVOICES_FLAG ? true:false;
				  }
				if(previousSelectedObj.privileges.hasOwnProperty("EDIT_INVOICES_FLAG") )
				 {
					feature.editInvoicesFlag = previousSelectedObj.privileges.EDIT_INVOICES_FLAG ? true:false;
				  }						  
					
				 
				  if(previousSelectedObj.privileges.hasOwnProperty("APPROVE_INVOICES_FLAG") )
				 {
					feature.approveInvoicesFlag= previousSelectedObj.privileges.APPROVE_INVOICES_FLAG ? true:false;
				  } 

				  if(previousSelectedObj.privileges.hasOwnProperty("ADVANCE") )
				 {
					feature.advanceFlag= previousSelectedObj.privileges.ADVANCE ? true:false;
				  }
				  if(previousSelectedObj.privileges.hasOwnProperty("CREATE_ADVANCE_FLAG") )
				 {
					feature.createAdvanceFlag= previousSelectedObj.privileges.CREATE_ADVANCE_FLAG ? true:false;
				  }
				  if(previousSelectedObj.privileges.hasOwnProperty("APPROVE_ADVANCE_FLAG") )
				 {
					feature.approveAdvanceFlag= previousSelectedObj.privileges.APPROVE_ADVANCE_FLAG ? true:false;
				  }
				    if(previousSelectedObj.privileges.hasOwnProperty("PAYDOWN") )
				 {
					feature.paydownFlag= previousSelectedObj.privileges.PAYDOWN ? true:false;
				  }
				    if(previousSelectedObj.privileges.hasOwnProperty("CREATE_PAYDOWN_FLAG") )
				 {
					feature.createPaydownFlag= previousSelectedObj.privileges.CREATE_PAYDOWN_FLAG ? true:false;
				  }
				   if(previousSelectedObj.privileges.hasOwnProperty("APPROVE_PAYDOWN_FLAG") )
				 {
					feature.approvePaydownFlag= previousSelectedObj.privileges.APPROVE_PAYDOWN_FLAG ? true:false;
				  }
				   if(previousSelectedObj.privileges.hasOwnProperty("PARTIAL_PAYDOWN") )
				  {
					feature.partialPaydownFlag= previousSelectedObj.privileges.PARTIAL_PAYDOWN ? true:false;
				  }
				    if(previousSelectedObj.privileges.hasOwnProperty("CREATE_PARTIAL_PAYDOWN_FLAG") )
				  {
					feature.createPartialPaydownFlag= previousSelectedObj.privileges.CREATE_PARTIAL_PAYDOWN_FLAG ? true:false;
				  }
				   if(previousSelectedObj.privileges.hasOwnProperty("APPROVE_PARTIAL_PAYDOWN_FLAG") )
				  {
					feature.approvePartialPaydownFlag= previousSelectedObj.privileges.APPROVE_PARTIAL_PAYDOWN_FLAG ? true:false;
				  }
				   if(previousSelectedObj.privileges.hasOwnProperty("LOAN_REPAYMENT") )
				  {
					feature.loanRepaymentFlag = previousSelectedObj.privileges.LOAN_REPAYMENT ? true:false;
				  }
				   if(previousSelectedObj.privileges.hasOwnProperty("ADVANCE_DEPOSITE") )
				  {
					feature.advancePaydownFlag= previousSelectedObj.privileges.ADVANCE_DEPOSITE ? true:false;
				  }
			}
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
		featureItems.push({xtype: 'label',text: getLabel('lbl.type',"Type"),padding:'0 0 0 0',height:65,cls:'boldText granular-privilege-label privilege-grid-main-header privilege-grid-type-label granular-loanprivilege-type'});

		if(featureMap["AST"] != undefined ) {
			if(featureMap["AST"].canView == 'Y' ){

		featureItems.push({xtype: 'label',text:getLabel('viewScheduleTransfer',"View Schedule Transfer"),padding:'0 0 0 5',height:65,cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
		}
		}
		/*if(featureMap["AST"].canEdit == 'Y' ){
		featureItems.push({xtype: 'label',text: "Edit Schedule Transfer",padding:'0 0 0 5',cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-headers'});
		}*/

		if(featureMap["LNI"] != undefined ) {
			if(featureMap["LNI"].canView == 'Y' ){
		featureItems.push({xtype: 'label',text: getLabel("viewInvoices","View Invoices"),padding:'0 0 0 5',height:65,cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
		}
		
			if(featureMap["LNI"].canEdit == 'Y' ){
		featureItems.push({xtype: 'label',text: getLabel("payInvoices","Pay Invoices"),padding:'0 0 0 5',height:65,cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
		}
			if(featureMap["LNI"].canAuth == 'Y' ){
		featureItems.push({xtype: 'label',text: getLabel("approveInvoices","Approve Invoices"),padding:'0 0 0 5',height:65,cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
		}		
			}



		if(featureMap["LDO"] != undefined ) {
			if(featureMap["LDO"].canView == 'Y' ){
		featureItems.push({xtype: 'label',text: getLabel("viewAdvance","View Advance"),padding:'0 0 0 5',height:65,cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
		}
			if(featureMap["LDO"].canEdit == 'Y' ){
		featureItems.push({xtype: 'label',text: getLabel("createAdvance","Create Advance"),padding:'0 0 0 5',height:65,cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
		}
			if(featureMap["LDO"].canAuth == 'Y' ){
		featureItems.push({xtype: 'label',text:getLabel("approveAdvance","Approve Advance"),padding:'0 0 0 5',height:65,cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
		}}

		if(featureMap["RPY"] != undefined ) {
			if(featureMap["RPY"].canView == 'Y' ){
		featureItems.push({xtype: 'label',text:getLabel("viewFullPaydown","View Full PayDown"),padding:'0 0 0 5',height:65,cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
		}
			if(featureMap["RPY"].canEdit == 'Y' ){
		featureItems.push({xtype: 'label',text: getLabel("createFullPaydown","Create Full PayDown"),padding:'0 0 0 5',height:65,cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
		}
			if(featureMap["RPY"].canAuth == 'Y' ){
		featureItems.push({xtype: 'label',text: getLabel("approveFullPaydown","Approve Full PayDown"),padding:'0 0 0 5',height:65,cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
		}}

		if(featureMap["FLON_000001"] != undefined ) {
			if(featureMap["FLON_000001"].canView == 'Y' ){
		featureItems.push({xtype: 'label',text:getLabel("viewPartialPaydown","View Partial PayDown"),padding:'0 0 0 5',height:65,cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
		}
			if(featureMap["FLON_000001"].canEdit == 'Y' ){
		featureItems.push({xtype: 'label',text: getLabel("createPartialPaydown","Create Partial PayDown"),padding:'0 0 0 5',height:65,cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
		}
			if(featureMap["FLON_000001"].canAuth == 'Y' ){
		featureItems.push({xtype: 'label',text: getLabel("approvePartialPaydown","Approve Partial PayDown"),padding:'0 0 0 5',height:65,cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
		}}

		if(featureMap["LOANS_390"] != undefined ) {
			if(featureMap["LOANS_390"].canEdit == 'Y' ){
		featureItems.push({xtype: 'label',text:getLabel("loanRepayment","Use for Loan Repayment"),padding:'0 0 0 5',height:65,cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
		}
		}

		if(featureMap["LOANS_391"] != undefined ) {
			if(featureMap["LOANS_391"].canEdit == 'Y' ){
		featureItems.push({xtype: 'label',text:getLabel("advanceDeposite","Use for Advance Deposit"),padding:'0 0 0 5',height:65,cls:'boldText granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'});
		}
		}
		return featureItems;
	},

	setPanelHeader : function(id, title)
	{
		var featureItems = [];

		featureItems.push({xtype: 'label',text: getLabel('obligorID','Obligor ID'),padding:'8 0 0 10',cls:'boldText granular-privilege-headers granular-privilege-account-header',height:35 });
		featureItems.push({xtype: 'label',text: getLabel('ObligationID','Obligation ID'),padding:'8 0 0 0',cls:'boldText granular-privilege-account-header',height:35, width:95 });
		featureItems.push({xtype: 'label',text: getLabel('accountName','Account Name'),padding:'8 0 0 10',cls:'boldText boldText granular-privilege-accountno granular-privilege-account-header',height:35});

		if(featureMap["AST"] != undefined ) {
			if(featureMap["AST"].canView == 'Y' ){
				var parentCheck=false;
				if((featureMap["LDO"] != undefined && featureMap["LDO"].canEdit == 'Y')  || (featureMap["RPY"] != undefined && featureMap["RPY"].canEdit == 'Y'))
				{
				parentCheck=true;	
				}

		/*featureItems.push({xtype: 'button',columnWidth:0.08,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '0 0 0 32',width : 15, height : 20, itemId : id+"_viewScheduleTransferIcon", border : 0,cls:'btn'});*/
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_viewScheduleTransferIcon", border : 0,disabled:(parentCheck == true || mode == "VIEW")?true:false}]
		});

		}
		/*if(featureMap["AST"].canEdit == 'Y' ){
			var parentCheck=false;
				if(featureMap["LDO"].canEdit == 'Y'  || featureMap["RPY"].canEdit == 'Y')
				{
				parentCheck=true;
				}
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_editScheduleTransferIcon", border : 0,disabled:(parentCheck == true || mode == "VIEW")?true:false}]
		});
		}*/
		}


		if(featureMap["LNI"] != undefined ) {
			if(featureMap["LNI"].canView == 'Y' ){
		/*featureItems.push({xtype: 'button',columnWidth:0.08,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '0 0 0 60',width : 15, height : 20, itemId : id+"_viewInvoicesIcon", border : 0,cls:'btn'});*/
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_viewInvoicesIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});

		}
			if(featureMap["LNI"].canEdit == 'Y' ){
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_editInvoicesIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});
		}
			if(featureMap["LNI"].canAuth == 'Y' ){
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_authInvoicesIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});
		}}


		if(featureMap["LDO"] != undefined ) {
			if(featureMap["LDO"].canView == 'Y' ){		
		/*featureItems.push({xtype: 'button',columnWidth:0.08,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '0 0 0 60',width : 15, height : 20, itemId : id+"_viewAdvanceIcon", border : 0,cls:'btn'});*/
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_viewAdvanceIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});
		}
			if(featureMap["LDO"].canEdit == 'Y' ){
		/*featureItems.push({xtype: 'button',columnWidth:0.08,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '0 0 0 60',width : 15, height : 20, itemId : id+"_editAdvanceIcon", border : 0,cls:'btn'});*/
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_editAdvanceIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});

		}
			if(featureMap["LDO"].canAuth == 'Y' ){
		/*featureItems.push({xtype: 'button',columnWidth:0.08,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '0 0 0 60',width : 15, height : 20, itemId : id+"_authAdvanceIcon", border : 0,cls:'btn'});*/
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_authAdvanceIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});

		}}

		if(featureMap["RPY"] != undefined ) {
			if(featureMap["RPY"].canView == 'Y' ){
		/*featureItems.push({xtype: 'button',columnWidth:0.08,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '0 0 0 60',width : 15, height : 20, itemId : id+"_viewPayDownIcon", border : 0,cls:'btn'});*/
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_viewPayDownIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});

		}
			if(featureMap["RPY"].canEdit == 'Y' ){
		/*featureItems.push({xtype: 'button',columnWidth:0.08,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '0 0 0 60',width : 15, height : 20, itemId : id+"_editPayDownIcon", border : 0,cls:'btn'});*/
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_editPayDownIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});

		}
			if(featureMap["RPY"].canAuth == 'Y' ){
		/*featureItems.push({xtype: 'button',columnWidth:0.08,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '0 0 0 60',width : 15, height : 20, itemId : id+"_authPayDownIcon", border : 0,cls:'btn'});*/
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_authPayDownIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});

		}}

		if(featureMap["FLON_000001"] != undefined ) {
			if(featureMap["FLON_000001"].canView == 'Y' ){
		/*featureItems.push({xtype: 'button',columnWidth:0.08,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '0 0 0 60',width : 15, height : 20, itemId : id+"_viewPayDownIcon", border : 0,cls:'btn'});*/
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_viewPartialPayDownIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});

		}
			if(featureMap["FLON_000001"].canEdit == 'Y' ){
		/*featureItems.push({xtype: 'button',columnWidth:0.08,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '0 0 0 60',width : 15, height : 20, itemId : id+"_editPayDownIcon", border : 0,cls:'btn'});*/
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_editPartialPayDownIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});

		}
			if(featureMap["FLON_000001"].canAuth == 'Y' ){
		/*featureItems.push({xtype: 'button',columnWidth:0.08,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '0 0 0 60',width : 15, height : 20, itemId : id+"_authPayDownIcon", border : 0,cls:'btn'});*/
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_authPartialPayDownIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});

		}}

		if(featureMap["LOANS_390"] != undefined ) {
			if(featureMap["LOANS_390"].canEdit == 'Y' ){
		/*featureItems.push({xtype: 'button',columnWidth:0.08,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '0 0 0 60',width : 15, height : 20, itemId : id+"_viewPayDownIcon", border : 0,cls:'btn'});*/
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_editLoanRepaymentIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});

		}}

		if(featureMap["LOANS_391"] != undefined ) {
			if(featureMap["LOANS_391"].canEdit == 'Y' ){
		/*featureItems.push({xtype: 'button',columnWidth:0.08,icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '0 0 0 60',width : 15, height : 20, itemId : id+"_viewPayDownIcon", border : 0,cls:'btn'});*/
		featureItems.push({
		xtype: 'panel',
		cls : 'privilege-grid-main-header granular-privilege-headers',
		text: title,
		padding:'5 0 0 10',
		items : [{xtype: 'checkbox',margin: '2 5 2 28', width : 10, height : 20, itemId : id+"_editAdvanceDepositeIcon", border : 0,disabled:(mode == "VIEW")?true:false}]
		});

		}}
		return featureItems;
	},
	setPriviligeMenu : function(feature,MODE,index)
	{
		var obj = new Object();
		var me = this;
		var i = false;
		var createAdv = false , createPay = false;
		if(MODE === 'ADVANCE')
		{
			if(this.getBooleanvalue(feature.acctUsageAdvPay)){
				obj.checked = this.getBooleanvalue(feature.advanceFlag);
			}
			else{
					obj.disabled = true;
			}
		}
		else if(MODE === 'PAYDOWN')
		{
			if(this.getBooleanvalue(feature.acctUsagePaydown)){
				obj.checked = this.getBooleanvalue(feature.paydownFlag);
			}
			else{
					obj.disabled = true;
			}
		}
		else if(MODE === 'PARTIAL_PAYDOWN')
		{
			if(this.getBooleanvalue(feature.acctUsagePaydown)){
				obj.checked = this.getBooleanvalue(feature.partialPaydownFlag);
			}
			else{
					obj.disabled = true;
			}
		}
		else if(MODE === 'VIEW_SCHEDULE_TRANSFER_FLAG')
		{
			i = !this.getBooleanvalue(feature.viewScheduleTransferFlag);
			createPay = this.getBooleanvalue(feature.createPaydownFlag);
			createAdv= this.getBooleanvalue(feature.createAdvanceFlag);
			if( !createAdv && !createPay )
			{
				obj.disabled = true;
			}
			else
			obj.checked = this.getBooleanvalue(feature.viewScheduleTransferFlag);
		}
		/*else if(MODE === 'EDIT_SCHEDULE_TRANSFER_FLAG')
		{
			obj.viewMode = 'VIEW_SCHEDULE_TRANSFER_FLAG';
			createPay = this.getBooleanvalue(feature.createPaydownFlag);
			createAdv= this.getBooleanvalue(feature.createAdvanceFlag);
			if( !createAdv && !createPay )
			{
				obj.disabled = true;
			}else
			obj.checked = this.getBooleanvalue(feature.editScheduleTransferFlag);
		}*/
		else if(MODE === 'VIEW_INVOICES_FLAG')
		{
			if(this.getBooleanvalue(feature.acctUsageInvPay)){
				obj.checked = this.getBooleanvalue(feature.viewInvoicesFlag);
			}
			else{
					obj.disabled = true;
			}
		}
		else if(MODE == 'EDIT_INVOICES_FLAG')
		{	
			obj.viewMode = 'VIEW_INVOICES_FLAG';
			if(this.getBooleanvalue(feature.acctUsageInvPay)){
				obj.checked = this.getBooleanvalue(feature.editInvoicesFlag);
			}
			else{
					obj.disabled = true;
			}
		}
		
		else if(MODE == 'APPROVE_INVOICES_FLAG')
		{	
			obj.viewMode = 'VIEW_INVOICES_FLAG';
			if(this.getBooleanvalue(feature.acctUsageInvPay)){
			 	obj.checked = this.getBooleanvalue(feature.approveInvoicesFlag);
			}
			else{
					obj.disabled = true;
			}
		}
		else if(MODE === 'CREATE_ADVANCE_FLAG')
		{
			obj.viewMode = 'ADVANCE';
			if(this.getBooleanvalue(feature.acctUsageAdvPay)){
				obj.checked = this.getBooleanvalue(feature.createAdvanceFlag);
			}
			else{
					obj.disabled = true;
			}
		}
		else if(MODE === 'APPROVE_ADVANCE_FLAG')
		{
			obj.viewMode = 'ADVANCE';
			if(this.getBooleanvalue(feature.acctUsageAdvPay)){
				obj.checked = this.getBooleanvalue(feature.approveAdvanceFlag);
			}
			else{
					obj.disabled = true;
			}
		}
		else if(MODE === 'CREATE_PAYDOWN_FLAG')
		{
			obj.viewMode = 'PAYDOWN';
			if(this.getBooleanvalue(feature.acctUsagePaydown)){
				obj.checked = this.getBooleanvalue(feature.createPaydownFlag);
			}
			else{
					obj.disabled = true;
			}
		}
		else if(MODE === 'CREATE_PARTIAL_PAYDOWN_FLAG')
		{
			obj.viewMode = 'PARTIAL_PAYDOWN';
			if(this.getBooleanvalue(feature.acctUsagePaydown)){
				obj.checked = this.getBooleanvalue(feature.createPartialPaydownFlag);
			}
			else{
					obj.disabled = true;
			}
		}
		else if(MODE === 'APPROVE_PAYDOWN_FLAG')
		{
			obj.viewMode = 'PAYDOWN';
			if(this.getBooleanvalue(feature.acctUsagePaydown)){
				obj.checked = this.getBooleanvalue(feature.approvePaydownFlag);
			}
			else{
					obj.disabled = true;
			}
		}
		else if(MODE === 'APPROVE_PARTIAL_PAYDOWN_FLAG')
		{
			obj.viewMode = 'PARTIAL_PAYDOWN';
			if(this.getBooleanvalue(feature.acctUsagePaydown)){
				obj.checked = this.getBooleanvalue(feature.approvePartialPaydownFlag);
			}
			else{
					obj.disabled = true;
			}
		}
		else if(MODE === 'LOAN_REPAYMENT')
		{
			if(this.getBooleanvalue(feature.acctLoanRepaymentPay)){
				obj.checked = this.getBooleanvalue(feature.loanRepaymentFlag);
			}
			else{
					obj.disabled = true;
			}
		}
		else if(MODE === 'ADVANCE_DEPOSITE')
		{
			if(this.getBooleanvalue(feature.acctAdvanceDepositePay)){
				obj.checked = this.getBooleanvalue(feature.advancePaydownFlag);
			}
			else{
					obj.disabled = true;
			}
		}

		obj.xtype="checkbox";
		if(index%2==0)
			obj.cls = 'granular-cellContent privilege-grid-odd granular-privilege-headers';
			else
			obj.cls = 'granular-cellContent privilege-grid-even granular-privilege-headers';
		//obj.columnWidth='0.08';
		obj.padding='0 0 0 0';
		obj.itemId = feature.accountId+"_"+MODE;
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
		if( mode === "EDIT")
		{
			obj.handler = function( btn, e, opts )
			{
				me.checkRowIcon( btn, MODE, feature.accountId );
			}
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
	checkRowIcon : function( btn, mode, accountId )
	{
		var me = this;
		if( btn.checked )
		{
			if( mode === 'CREATE_ADVANCE_FLAG' || mode === 'CREATE_PAYDOWN_FLAG' || mode === 'CREATE_PARTIAL_PAYDOWN_FLAG' )
			{
				var viewIconItemId = me.down( 'checkboxfield[itemId=' + accountId + '_VIEW_SCHEDULE_TRANSFER_FLAG' + ']' );
				if( viewIconItemId )
				{
					var createAdvAllCheckBox = me.down( 'checkboxfield[itemId=loanGranularPrivHeader_editAdvanceIcon' + ']' );
					var createPaydwnAllCheckBox = me.down( 'checkboxfield[itemId=loanGranularPrivHeader_editPayDownIcon' + ']' );
					var createPartialPaydwnAllCheckBox = me.down( 'checkboxfield[itemId=loanGranularPrivHeader_editPartialPayDownIcon' + ']' );
					var scheduleAdvAllCheckBox = me.down( 'checkboxfield[itemId=loanGranularPrivHeader_viewScheduleTransferIcon' + ']' );
					if(createAdvAllCheckBox.getValue() || createPaydwnAllCheckBox.getValue() || createPartialPaydwnAllCheckBox.getValue())
					{
						scheduleAdvAllCheckBox.setDisabled(false);
					}
					viewIconItemId.setDisabled(false);
				}
			}

			if( !(mode === 'ADVANCE' || mode === 'PAYDOWN' || mode === 'PARTIAL_PAYDOWN_FLAG'||mode === 'LOAN_REPAYMENT' ||mode==='ADVANCE_DEPOSITE'))
			{
				var viewAdvIconItemId = me.down( 'checkboxfield[itemId=' + accountId + '_' + btn.viewMode + ']' );
				if( viewAdvIconItemId )
				{
					viewAdvIconItemId.setValue( true );
					viewAdvIconItemId.defVal = true;
				}
			}
		}
		else
		{
			if( mode === 'CREATE_ADVANCE_FLAG' ||  mode === 'CREATE_PAYDOWN_FLAG' ||  mode === 'CREATE_PARTIAL_PAYDOWN_FLAG' )
			{
				var createAdvAllCheckBox = me.down( 'checkboxfield[itemId=loanGranularPrivHeader_editAdvanceIcon' + ']' );
					var createPaydwnAllCheckBox = me.down( 'checkboxfield[itemId=loanGranularPrivHeader_editPayDownIcon' + ']' );
					var createPartialPaydwnAllCheckBox = me.down( 'checkboxfield[itemId=loanGranularPrivHeader_editPartialPayDownIcon' + ']' );
					var scheduleAdvAllCheckBox = me.down( 'checkboxfield[itemId=loanGranularPrivHeader_viewScheduleTransferIcon' + ']' );
					if(!createAdvAllCheckBox.getValue())
					{
						scheduleAdvAllCheckBox.setDisabled(true);
					}
					if(!createPaydwnAllCheckBox.getValue())
					{
						scheduleAdvAllCheckBox.setDisabled(true);
					}
					if(!createPartialPaydwnAllCheckBox.getValue())
					{
						scheduleAdvAllCheckBox.setDisabled(true);
					}

				var viewIconItemId = me.down( 'checkboxfield[itemId=' + accountId + '_VIEW_SCHEDULE_TRANSFER_FLAG' + ']' );
				var createAdvaceFlag = me.down( 'checkboxfield[itemId=' + accountId + '_CREATE_ADVANCE_FLAG' + ']' );	
				var createPaydownFlag = me.down( 'checkboxfield[itemId=' + accountId + '_CREATE_PAYDOWN_FLAG' + ']' );
				var createPartialPaydownFlag = me.down( 'checkboxfield[itemId=' + accountId + '_CREATE_PARTIAL_PAYDOWN_FLAG' + ']' );

				if( !createAdvaceFlag.getValue() && !createPaydownFlag.getValue() && !createPartialPaydownFlag.getValue())
				{
						viewIconItemId.setValue(false);
						viewIconItemId.setDisabled(true);
				}
			}
			if(mode === 'ADVANCE'){
				var apprAdvIconItemId = me.down( 'checkboxfield[itemId=' + accountId + '_APPROVE_ADVANCE_FLAG'+ ']' );
				if( apprAdvIconItemId )
				{
					apprAdvIconItemId.setValue( false );
					apprAdvIconItemId.defVal = false;
				}
				var createAdvIconItemId = me.down( 'checkboxfield[itemId=' + accountId + '_CREATE_ADVANCE_FLAG'+ ']' );
				if( createAdvIconItemId )
				{
					createAdvIconItemId.setValue( false );
					createAdvIconItemId.defVal = false;
				}
			}else if( mode === 'PAYDOWN'){
				var apprAdvIconItemId = me.down( 'checkboxfield[itemId=' + accountId + '_APPROVE_PAYDOWN_FLAG'+ ']' );
				if( apprAdvIconItemId )
				{
					apprAdvIconItemId.setValue( false );
					apprAdvIconItemId.defVal = false;
				}
				var createAdvIconItemId = me.down( 'checkboxfield[itemId=' + accountId + '_CREATE_PAYDOWN_FLAG'+ ']' );
				if( createAdvIconItemId )
				{
					createAdvIconItemId.setValue( false );
					createAdvIconItemId.defVal = false;
				}
			} else if( mode === 'PARTIAL_PAYDOWN'){
				var apprAdvIconItemId = me.down( 'checkboxfield[itemId=' + accountId + '_APPROVE_PARTIAL_PAYDOWN_FLAG'+ ']' );
				if( apprAdvIconItemId )
				{
					apprAdvIconItemId.setValue( false );
					apprAdvIconItemId.defVal = false;
				}
				var createAdvIconItemId = me.down( 'checkboxfield[itemId=' + accountId + '_CREATE_PARTIAL_PAYDOWN_FLAG'+ ']' );
				if( createAdvIconItemId )
				{
					createAdvIconItemId.setValue( false );
					createAdvIconItemId.defVal = false;
				}
			}else if( mode === 'VIEW_INVOICES_FLAG'){
				var apprAdvIconItemId = me.down( 'checkboxfield[itemId=' + accountId + '_EDIT_INVOICES_FLAG'+ ']' );
				if( apprAdvIconItemId )
				{
					apprAdvIconItemId.setValue( false );
					apprAdvIconItemId.defVal = false;
				}
				var createAdvIconItemId = me.down( 'checkboxfield[itemId=' + accountId + '_APPROVE_INVOICES_FLAG'+ ']' );
				if( createAdvIconItemId )
				{
					createAdvIconItemId.setValue( false );
					createAdvIconItemId.defVal = false;
				}
			}
		}

	},

 createPrivilegesContainer : function(filteredData){
	var self = this;
	var featureItems = [];
	//priviously submited granular Permissiong
	var prevPositivePayGranularPermissions = document.getElementById("loanGranularPermissions");


	Ext.each(filteredData, function(feature, index) {
			var panel = Ext.create('Ext.panel.Panel', {
				columnWidth:1,
				layout:'column',
				bodyStyle: {
					background: '#FAFAFA'
				}
			});
			var accountText = feature.accountNo + '|'+ feature.accountName;

			if(self.allLoanAccountsSelectedFlag == 'Y' || accountAssignedMap[accountText] == true) {

			panel.insert({xtype: 'label',text: feature.accountNo  ,padding:'5 0 0 20',height:'auto',cls:'ux_text-elipsis granular-privilege-headers privilege-grid-main-header privilege-grid-odd privilege-admin-rights', autoEl: {
                tag: 'label',
                'data-qtip': feature.accountNo
            } });
			panel.insert({xtype: 'label',text: feature.obligationId  ,padding:'5 0 0 20', height:'auto',cls:'ux_text-elipsis granular-obli-privilege-headers privilege-grid-main-header privilege-grid-odd privilege-admin-rights', autoEl: {
                tag: 'label',
                'data-qtip': feature.obligationId
            } });
			panel.insert({xtype: 'label',text: feature.accountName  ,padding:'5 0 0 20',height:'auto',cls:'ux_text-elipsis granular-privilege-accountno privilege-grid-odd privilege-admin-rights', autoEl: {
                tag: 'label',
                'data-qtip': feature.accountName
            } });

				if( self.isHiddenElementNotNull(prevPositivePayGranularPermissions) ){
						var previouslySubmitedJsonObj =  Ext.decode(prevPositivePayGranularPermissions.value);
						self.updateFeatureIfPreviouslySelected(feature,previouslySubmitedJsonObj);

					}


			if(featureMap["AST"] != undefined ) {
			if(featureMap["AST"].canView == 'Y' ){
				panel.insert(self.setPriviligeMenu(feature,"VIEW_SCHEDULE_TRANSFER_FLAG",index));
			}
			/*if(featureMap["AST"].canEdit == 'Y' ){
			panel.insert(self.setPriviligeMenu(feature,"EDIT_SCHEDULE_TRANSFER_FLAG"));
			}*/
			}

			if(featureMap["LNI"] != undefined ) {
			if(featureMap["LNI"].canView == 'Y' ){
			panel.insert(self.setPriviligeMenu(feature,"VIEW_INVOICES_FLAG",index));
			}
			if(featureMap["LNI"].canEdit == 'Y' ){
				panel.insert(self.setPriviligeMenu(feature,"EDIT_INVOICES_FLAG"));
			}
			if(featureMap["LNI"].canAuth == 'Y' ){
			panel.insert(self.setPriviligeMenu(feature,"APPROVE_INVOICES_FLAG"));
			}

			}

			if(featureMap["LDO"] != undefined ) {
			if(featureMap["LDO"].canView == 'Y' ){
				panel.insert(self.setPriviligeMenu(feature,"ADVANCE",index));
			}
			if(featureMap["LDO"].canEdit == 'Y' ){
			panel.insert(self.setPriviligeMenu(feature,"CREATE_ADVANCE_FLAG",index));
			}
			if(featureMap["LDO"].canAuth == 'Y' ){
			panel.insert(self.setPriviligeMenu(feature,"APPROVE_ADVANCE_FLAG",index));
			}
			}

			if(featureMap["RPY"] != undefined ) {
			if(featureMap["RPY"].canView == 'Y' ){
			panel.insert(self.setPriviligeMenu(feature,"PAYDOWN",index));	
			}
			if(featureMap["RPY"].canEdit == 'Y' ){
			panel.insert(self.setPriviligeMenu(feature,"CREATE_PAYDOWN_FLAG",index));
			}
			if(featureMap["RPY"].canAuth == 'Y' ){
			panel.insert(self.setPriviligeMenu(feature,"APPROVE_PAYDOWN_FLAG",index));
			}}

			if(featureMap["FLON_000001"] != undefined ) {
				if(featureMap["FLON_000001"].canView == 'Y' ){
				panel.insert(self.setPriviligeMenu(feature,"PARTIAL_PAYDOWN",index));	
				}
				if(featureMap["FLON_000001"].canEdit == 'Y' ){
				panel.insert(self.setPriviligeMenu(feature,"CREATE_PARTIAL_PAYDOWN_FLAG",index));
				}
				if(featureMap["FLON_000001"].canAuth == 'Y' ){
				panel.insert(self.setPriviligeMenu(feature,"APPROVE_PARTIAL_PAYDOWN_FLAG",index));
				}}


			if(featureMap["LOANS_390"] != undefined ) {
				if(featureMap["LOANS_390"].canEdit == 'Y' ){
					panel.insert(self.setPriviligeMenu(feature,"LOAN_REPAYMENT",index));	
				}
			}

			if(featureMap["LOANS_391"] != undefined ) {
				if(featureMap["LOANS_391"].canEdit == 'Y' ){
					panel.insert(self.setPriviligeMenu(feature,"ADVANCE_DEPOSITE",index));	
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


	setUserLoanGranularRights : function()
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
			isFilterApplied=true;
		  }else{
			isFilterApplied=false;
			filteredData = this.filterFeatures(granularFeatureData);
		  }



		var featureItems = [];
			featureItems = self.createPrivilegesContainer(filteredData);
		 Ext.getCmp('loanGranPrivParametersSection').add(featureItems);

	},

	initComponent: function() {
	var thisClass = this;
	thisClass.setLoansRights();
	thisClass.setLoansAccounts();

		thisClass.items = [{
					xtype:'panel',
					width : 'auto',
					items:[{
						xtype: 'panel',
						width : 'auto',
						id : 'loanGranularPrivFilterBox',
						layout:'column',
						cls: 'ft-padding-bottom',
						items: [
							{
								xtype : 'AutoCompleter',
								//cls : 'autoCmplete-field ux_paddingb',
								fieldCls : 'xn-form-text xn-suggestion-box granular-autocompleterLarge',
								id : 'loanAccountIDFilterItemId',
								itemId : 'loanAccountIDFilterItemId',
								name : 'loanAccountIDFilterItemId',
								matchFieldWidth : true,
								labelSeparator : '',
								//fieldLabel :  getLabel( 'accountID', 'Account' ),
								cfgUrl : 'services/userseek/accountSeekForLoan.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'loanAccountIDFilterItemId',
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
								emptyText : getLabel('searchByObligorIdOrAccNumber','Search by Obligor id or Account name'),
								listeners : {
								'select':function(){
									thisClass.filterHandler();
									var selected = thisClass.down('component[itemId="clearLink"]');
          								  selected.show();
								 },
								   'change':function(){
									 var filterContainer = thisClass.down('[itemId="loanAccountIDFilterItemId"]');
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
										var filterContainer = thisClass.down('[itemId="loanAccountIDFilterItemId"]');
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
			maxHeight : 1323,
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
						id : 'loanGranularPrivColumnHeader',
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
							id : 'loanGranularPrivHeader',
							layout: {
						        type: 'column'
						    },
							cls:'red-bg',
							height : 35,
							items: thisClass.setPanelHeader('loanGranularPrivHeader',getLabel('limitAccount','Account'))
						},
						{
							xtype: 'panel',
							minHeight : 25,
							maxHeight : 1323,
							width : 'auto',
							overflowY: 'auto',
							//title: getLabel('granularPrivileges','Positive Pay'),
							titleAlign : "left",
							//collapsible : true,
							cls : 'xn-ribbon',
							collapseFirst : true,
							itemId : 'loanGranPrivParametersSection',
							id : 'loanGranPrivParametersSection',
							layout: {
							        type: 'vbox'
							    },
							items: thisClass.setUserLoanGranularRights()
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
							objLoanGranularPrivPriviligePopup= null;
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

									if('VIEW_SCHEDULE_TRANSFER_FLAG' == mode){
										jsonData[objectKey]['privileges']['VIEW_SCHEDULE_TRANSFER_FLAG'] = element.getValue();
									}
									/*if('EDIT_SCHEDULE_TRANSFER_FLAG' == mode){
										jsonData[objectKey]['privileges']['EDIT_SCHEDULE_TRANSFER_FLAG'] = element.getValue();
									}*/

									if('VIEW_INVOICES_FLAG' == mode){
										jsonData[objectKey]['privileges']['VIEW_INVOICES_FLAG'] = element.getValue();
									}
									if('EDIT_INVOICES_FLAG' == mode){
										jsonData[objectKey]['privileges']['EDIT_INVOICES_FLAG'] = element.getValue();
									}
									if('APPROVE_INVOICES_FLAG' == mode){
										jsonData[objectKey]['privileges']['APPROVE_INVOICES_FLAG'] = element.getValue();
									}


									if('ADVANCE' == mode){
										jsonData[objectKey]['privileges']['ADVANCE'] = element.getValue();
									}
									if('CREATE_ADVANCE_FLAG' == mode){
										jsonData[objectKey]['privileges']['CREATE_ADVANCE_FLAG'] = element.getValue();
									}
									if('APPROVE_ADVANCE_FLAG' == mode){
										jsonData[objectKey]['privileges']['APPROVE_ADVANCE_FLAG'] = element.getValue();
									}

									if('PAYDOWN' == mode){
										jsonData[objectKey]['privileges']['PAYDOWN'] = element.getValue();
									}
									if('CREATE_PAYDOWN_FLAG' == mode){
										jsonData[objectKey]['privileges']['CREATE_PAYDOWN_FLAG'] = element.getValue();
									}
									if('APPROVE_PAYDOWN_FLAG' == mode){
										jsonData[objectKey]['privileges']['APPROVE_PAYDOWN_FLAG'] = element.getValue();
									}

									if('PARTIAL_PAYDOWN' == mode){
										jsonData[objectKey]['privileges']['PARTIAL_PAYDOWN'] = element.getValue();
									}
									if('CREATE_PARTIAL_PAYDOWN_FLAG' == mode){
										jsonData[objectKey]['privileges']['CREATE_PARTIAL_PAYDOWN_FLAG'] = element.getValue();
									}
									if('APPROVE_PARTIAL_PAYDOWN_FLAG' == mode){
										jsonData[objectKey]['privileges']['APPROVE_PARTIAL_PAYDOWN_FLAG'] = element.getValue();
									}
									if('LOAN_REPAYMENT' == mode){
										jsonData[objectKey]['privileges']['LOAN_REPAYMENT'] = element.getValue();
									}
									if('ADVANCE_DEPOSITE' == mode){
										jsonData[objectKey]['privileges']['ADVANCE_DEPOSITE'] = element.getValue();
									}

							}
			});
			//console.log("available jsonData :"+JSON.stringify(jsonData));
			var jsonObj = {};
			jsonObj['serviceType'] = 'LN';
			jsonObj['moduleCode'] = '07';
			var jsonArray = [];
			//only add those records which are updated
			for (var index  in loanGranularFeatureDataBackup){
				var orginalObj = loanGranularFeatureDataBackup[index];
			    var accountId = orginalObj.accountId;
			    var pkgId =orginalObj.packageId;
				var objectKey = accountId+'_'+pkgId;
				var recordKeyNo = orginalObj.recordKeyNo;
			  	if((objectKey in jsonData)){
                       var newObj = jsonData[objectKey];
					 if( newObj['privileges']['ADVANCE'] == this.getBooleanvalue(orginalObj.advanceFlag) && 
						 newObj['privileges']['PAYDOWN'] == this.getBooleanvalue(orginalObj.paydownFlag) &&
						 newObj['privileges']['PARTIAL_PAYDOWN'] == this.getBooleanvalue(orginalObj.partialPaydownFlag) &&
						 newObj['privileges']['VIEW_SCHEDULE_TRANSFER_FLAG'] == this.getBooleanvalue(orginalObj.viewScheduleTransferFlag) && 
						 /*newObj['privileges']['EDIT_SCHEDULE_TRANSFER_FLAG'] == this.getBooleanvalue(orginalObj.editScheduleTransferFlag) &&*/
						 newObj['privileges']['VIEW_INVOICES_FLAG'] == this.getBooleanvalue(orginalObj.viewInvoicesFlag) && 
						 newObj['privileges']['EDIT_INVOICES_FLAG'] == this.getBooleanvalue(orginalObj.editInvoicesFlag) && 
						 newObj['privileges']['APPROVE_INVOICES_FLAG'] == this.getBooleanvalue(orginalObj.approveInvoicesFlag) && 
						 newObj['privileges']['CREATE_ADVANCE_FLAG'] == this.getBooleanvalue(orginalObj.createAdvanceFlag) && 
						 newObj['privileges']['APPROVE_ADVANCE_FLAG'] == this.getBooleanvalue(orginalObj.approveAdvanceFlag) && 
						 newObj['privileges']['CREATE_PAYDOWN_FLAG'] == this.getBooleanvalue(orginalObj.createPaydownFlag) && 
						 newObj['privileges']['APPROVE_PAYDOWN_FLAG'] == this.getBooleanvalue(orginalObj.approvePaydownFlag)&&
						 newObj['privileges']['CREATE_PARTIAL_PAYDOWN_FLAG'] == this.getBooleanvalue(orginalObj.createPartialPaydownFlag) && 
						 newObj['privileges']['APPROVE_PARTIAL_PAYDOWN_FLAG'] == this.getBooleanvalue(orginalObj.approvePartialPaydownFlag) &&
						 newObj['privileges']['LOAN_REPAYMENT'] == this.getBooleanvalue(orginalObj.loanRepaymentFlag) && 
						 newObj['privileges']['ADVANCE_DEPOSITE'] == this.getBooleanvalue(orginalObj.advancePaydownFlag))
					 {
					 // if none of the values are changed no need to push into array

					 }else{
					     jsonArray.push(newObj)
					 }
				}else{

						//recordKeyNo of record means its saved in db and if its not found in jsonData (i.e currently present in rows on screen) then make all flag N for that account

						if(recordKeyNo!== undefined && recordKeyNo!=null && recordKeyNo && !isFilterApplied)
						{

							if(  false  ===  this.getBooleanvalue(orginalObj.advanceFlag)  &&
								 false  ===  this.getBooleanvalue(orginalObj.paydownFlag) &&
								 false  ===  this.getBooleanvalue(orginalObj.partialPaydownFlag) &&
								 false  ===  this.getBooleanvalue(orginalObj.viewScheduleTransferFlag) &&
								 //false  ===  this.getBooleanvalue(orginalObj.editScheduleTransferFlag)	&&
								 false  ===  this.getBooleanvalue(orginalObj.viewInvoicesFlag) &&
								 false  ===  this.getBooleanvalue(orginalObj.editInvoicesFlag) &&
								 false  ===  this.getBooleanvalue(orginalObj.approveInvoicesFlag) &&
								 false  ===  this.getBooleanvalue(orginalObj.createAdvanceFlag)&&
								 false  ===  this.getBooleanvalue(orginalObj.approveAdvanceFlag) &&
								 false  ===  this.getBooleanvalue(orginalObj.createPaydownFlag)&&
								 false  ===  this.getBooleanvalue(orginalObj.approvePaydownFlag)&&
								 false  ===  this.getBooleanvalue(orginalObj.createPartialPaydownFlag)&&
								 false  ===  this.getBooleanvalue(orginalObj.approvePartialPaydownFlag) &&
								 false  ===  this.getBooleanvalue(orginalObj.loanRepaymentFlag)&&
								 false  ===  this.getBooleanvalue(orginalObj.advancePaydownFlag))
							 {
							 // if all flags are N means record is previously removed no need to add into deleted array 

							 }else{
								var newEntry = {};
								newEntry['accountId'] = accountId;
								newEntry['packageId'] = pkgId;
								var privileges = {'VIEW_SCHEDULE_TRANSFER_FLAG':false,'VIEW_INVOICES_FLAG':false,'ADVANCE':false,'CREATE_ADVANCE_FLAG':false,'APPROVE_ADVANCE_FLAG':false,'PAYDOWN':false,'CREATE_PAYDOWN_FLAG':false,'APPROVE_PAYDOWN_FLAG':false,'PARTIAL_PAYDOWN':false,'CREATE_PARTIAL_PAYDOWN_FLAG':false,'APPROVE_PARTIAL_PAYDOWN_FLAG':false,'LOAN_REPAYMENT':false,'ADVANCE_DEPOSITE':false};
								newEntry['privileges'] = privileges;

								jsonArray.push(newEntry);
							 }

						}

				}
			}


			jsonObj['accountPackagePrivileges'] = jsonArray;
			//console.log("after adding deleted rows /columns length :"+jsonArray.length);
			//console.log("final jsonObj :"+JSON.stringify(jsonObj));


				if (!Ext.isEmpty(me.fnCallback) && typeof me.fnCallback == 'function') {
					me.fnCallback(jsonObj);
					me.close();
				}
			}
});