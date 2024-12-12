var granularPrivfieldJson = [];
var isFilterApplied = false;
var featureMap = {};
var accountAssignedMap = {};
var payPackageAssignedMap = {};
var allAccountsSelectedFlag = 'N';
var allPackagesSelectedFlag = 'N';
var granularSPageNo = 1;
var granularSCount = 1;
var granularSPageSize = 10;
var granularSTotalPage = 1;
var granularSTotalNumberOfRecord = 1;
var granularSPrivfieldJsonTemp = [];
var jsonSArrayGlobal = [];

var totalSIRecordFrmServer = 1;
var totalSIDisplay = 50;
var totalSIRecordsDisplay = [];
var currentSIBunchOfPage = 0;
var granularSIOverAllTTotalPage = 1;
var granularSIOverAllTPageNo = 1;
var prevSIRecordMaxCount=0;
var nextSIMinRecordCount=0;
var numberSIRecordsToDisplay = 0;
var granularSITotalRecordPage;
var navigationSIVisible=true;

var totalNumberSIRecordsDisplayed = 0;
Ext.define('GCP.view.SIGranularPriviligesPopup', {
	extend: 'Ext.window.Window',
	xtype: 'siPayGranularPriviligesPopup',
	minWidth : 400,
	maxWidth : 735,
	minHeight : 156,
	maxHeight : 550,
	overflowY: 'auto',
	title: getLabel('siGranularPrivilege','Standing Instruction Granular Privileges'),
	cls : 'xn-popup',
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
	},
	'afterrender':function(){
	if(this.header.body.dom.firstElementChild.clientWidth != this.header.body.dom.firstElementChild.firstElementChild.clientWidth)
	{
	this.header.body.dom.firstElementChild.firstElementChild.className="";
	}
	}
	
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
		featureItems.push({xtype: 'label',text:getLabel("type","Type"),padding:'0 0 0 0',cls:'boldText label-lineHeight granular-privilege-label privilege-grid-main-header privilege-grid-type-label granular-payprivilege-type'});
		
		 if (featureMap["SIS_15"] != undefined) {
			if (featureMap["SIS_15"].canView == 'Y') {
				featureItems.push({
					xtype : 'label',
					text : getLabel("view", "View"),
					padding : '0 0 0 5',
					cls : 'boldText label-lineHeight granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'
				});
			}
			if (featureMap["SIS_15"].canEdit == 'Y') {
				featureItems.push({
					xtype : 'label',
					text : getLabel("edit", "Edit"),
					padding : '0 0 0 5',
					cls : 'boldText label-lineHeight granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'
				});
			}
		 }
		 
		 if (featureMap["SIS_383"] != undefined
				&& featureMap["SIS_383"].canEdit == 'Y') {
			featureItems.push({
					xtype : 'label',
					text : getLabel("delete", "Delete"),
					padding : '0 0 0 5',
					cls : 'boldText label-lineHeight granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'
				});
		}
			// if(featureMap["RVAL"].canEdit == 'Y' ){
			// featureItems.push({xtype: 'label',columnWidth:0.10,text:
			// "Delete",padding:'0 0 0 5',cls:'boldText background'});
			// }

			if (featureMap["SIS_15"] != undefined && featureMap["SIS_15"].canAuth == 'Y') {
				featureItems.push({
					xtype : 'label',
					text : getLabel("quickApprove", "Quick Approve"),
					padding : '0 0 0 5',
					cls : 'boldText label-lineHeight granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'
				});
				//featureItems.push({xtype: 'label',columnWidth:0.10,text: "Detail Approve",padding:'0 0 0 5',cls:'boldText background'});
			}
		if (featureMap["SIS_386"] != undefined
				&& featureMap["SIS_386"].canAuth == 'Y') {
			featureItems.push({
					xtype : 'label',
					text : getLabel("detailApprove", "Detail Approve"),
					padding : '0 0 0 5',
					cls : 'boldText label-lineHeight granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'
				});
		}
		
		return featureItems;
	},
	setPanelHeader : function(id, title) {
		var featureItems = [];
		featureItems.push({
			xtype : 'label',
			text : getLabel('lbl.account', 'Account'),
			padding : '8 0 0 10',
			cls : 'boldText granular-privilege-accountno granular-privilege-account-header',
			height : 50
		});
		featureItems.push({
			xtype : 'label',
			text : getLabel('accountName', 'Account Name'),
			padding : '8 0 0 10',
			cls : 'boldText granular-privilege-accountno granular-privilege-account-header',
			height : 50
		});
		featureItems.push({
			xtype : 'label',
			text : getLabel('lbl.paymentPackage', 'Payment Package'),
			padding : '8 0 0 10',
			cls : 'boldText granular-privilege-headers granular-privilege-account-header',
			height : 50
		});

		if (featureMap["SIS_15"] != undefined) {
			if (featureMap["SIS_15"].canView == 'Y') {
				/*
				 * featureItems.push({xtype: 'button',icon:
				 * "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2
				 * 25',width : 15, height : 20, itemId : id+"_viewIcon", border :
				 * 0,cls:'btn'});
				 */
				featureItems.push({
					xtype : 'panel',
					cls : 'privilege-grid-main-header granular-privilege-headers',
					text : title,
					padding : '5 0 0 10',
					items : [{
								xtype : 'checkbox',
								margin : '2 5 2 28',
								width : 10,
								height : 20,
								itemId : id + "_viewIcon",
								border : 0,
								disabled : (mode == "VIEW") ? true : false
							}]
				});
			}
			if (featureMap["SIS_15"].canEdit == 'Y') {
				/*
				 * featureItems.push({xtype: 'button',icon:
				 * "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2
				 * 45',width : 15, height : 20, itemId : id+"_editIcon", border :
				 * 0,cls:'btn'});
				 */
				featureItems.push({
					xtype : 'panel',
					cls : 'privilege-grid-main-header granular-privilege-headers',
					text : title,
					padding : '5 0 0 10',
					items : [{
								xtype : 'checkbox',
								margin : '2 5 2 28',
								width : 10,
								height : 20,
								itemId : id + "_editIcon",
								border : 0,
								disabled : (mode == "VIEW") ? true : false
							}]
				});
			}

			if (featureMap["SIS_383"] != undefined
					&& featureMap["SIS_383"].canEdit == 'Y') {
				featureItems.push({
					xtype : 'panel',
					cls : 'privilege-grid-main-header granular-privilege-headers',
					text : title,
					padding : '5 0 0 10',
					items : [{
								xtype : 'checkbox',
								margin : '2 5 2 28',
								width : 10,
								height : 20,
								itemId : id + "_deleteIcon",
								border : 0,
								disabled : (mode == "VIEW") ? true : false
							}]
				});
			}
			/*
			 * if(featureMap["RVAL"].canEdit == 'Y' ){ featureItems.push({xtype:
			 * 'button',columnWidth:0.10,icon:
			 * "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2
			 * 75',width : 15, height : 20, itemId : id+"_deleteIcon", border :
			 * 0,cls:'btn'}); }
			 */

			if (featureMap["SIS_15"].canAuth == 'Y') {
				/*
				 * featureItems.push({xtype: 'button',icon:
				 * "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2
				 * 45',width : 15, height : 20, itemId : id+"_authIcon", border :
				 * 0,cls:'btn'});
				 */
				featureItems.push({
					xtype : 'panel',
					cls : 'privilege-grid-main-header granular-privilege-headers',
					text : title,
					padding : '5 0 0 10',
					items : [{
								xtype : 'checkbox',
								margin : '2 5 2 28',
								width : 10,
								height : 20,
								itemId : id + "_authIcon",
								border : 0,
								disabled : (mode == "VIEW") ? true : false
							}]
				});
				/*
				 * featureItems.push({xtype: 'button',columnWidth:0.10,icon:
				 * "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2
				 * 75',width : 15, height : 20, itemId : id+"_quickApproveIcon",
				 * border : 0,cls:'btn'});
				 */
			}

			if (featureMap["SIS_386"] != undefined
					&& featureMap["SIS_386"].canAuth == 'Y') {
				featureItems.push({
					xtype : 'panel',
					cls : 'privilege-grid-main-header granular-privilege-headers',
					text : title,
					padding : '5 0 0 10',
					items : [{
								xtype : 'checkbox',
								margin : '2 5 2 28',
								width : 10,
								height : 20,
								itemId : id + "_quickApproveIcon",
								border : 0,
								disabled : (mode == "VIEW") ? true : false
							}]
				});
			}
		}

		return featureItems;
	},
	setPriviligeMenu : function(feature,MODE,index, flag)
	{
		var obj = new Object();
		if(Ext.isEmpty(flag))
			flag = false;
		if (MODE == 'VIEW') {
			obj.checked = this.getBooleanvalue(feature.viewFlag);
		} else if (MODE == 'EDIT') {
			obj.checked = this.getBooleanvalue(feature.editFlag);
		} else if (MODE == 'DELETE') {
			obj.checked = this.getBooleanvalue(feature.deleteFlag);
		} else if (MODE == 'AUTH') {
			obj.checked = this.getBooleanvalue(feature.approveFlag);
		} else if (MODE == 'QUICKAPPROVE') {
			obj.checked = this.getBooleanvalue(feature.quickApproveFlag);
		} 
		if(flag)
			obj.checked = flag;
		obj.xtype="checkbox";
		if(index%2==0)
		obj.cls = 'granular-cellContent privilege-grid-odd granular-privilege-headers';
		else
		obj.cls = 'granular-cellContent privilege-grid-even granular-privilege-headers';
		obj.padding='0 0 0 0';
		obj.height=25;
		obj.itemId = feature.accountId+"_"+feature.packageId+"_"+MODE;
		obj.mode = MODE;
		obj.accountId = feature.accountId;
		obj.packageId = feature.packageId;
				obj.checkChange = function(){
					var panelPointer = this.up('panel');
					var viewItemId =feature.accountId + "_" + feature.packageId +  "_VIEW";
						checkSIGranularViewIfNotSelected(this.value,panelPointer,obj);
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
	},setSplitSIData : function(){
		var self = this;
		var data = self.loadGranularFeaturs();
		var filteredData = this.filterFeatures(data);
		totalSIRecordFrmServer = filteredData.length;
		var temp = totalSIRecordFrmServer/totalSIDisplay;
		granularSITotalRecordPage = totalSIRecordFrmServer/granularSPageSize;
		numberSIRecordsToDisplay = 0;
		totalNumberSIRecordsDisplayed = 0;
		navigationSIVisible = true;
		Ext.each(filteredData, function(feature, index) {
			var accountText = feature.accountNo + '|' + feature.accountName;
			var packageKey = feature.productCategoryCode + '|'
					+ feature.packageId;

			if (self.allPackagesSelectedFlag == 'Y'
					|| payPackageAssignedMap[packageKey] == true) {
				if (self.allAccountsSelectedFlag == 'Y'
						|| accountAssignedMap[accountText] == true) {
					numberSIRecordsToDisplay++;	
				}
			}
		});
		for(var i=0;i<temp;i++)
		{
			if((totalSIRecordFrmServer)<=(((i+1)*totalSIDisplay)-1))
				totalSIRecordsDisplay.push(totalSIRecordFrmServer-(totalSIDisplay*i));
			else
				totalSIRecordsDisplay.push(totalSIDisplay);
		}
		granularSIOverAllTTotalPage = totalSIRecordsDisplay.length;
	},
	getSplitSIData : function(calledFrom,filteredData,prevRecordMaxCountLoc,nextMinRecordCountLoc){
		if(totalSIRecordFrmServer<totalSIDisplay && calledFrom=='onLoad')
			return filteredData;
		var filteredDataTemp = [];
		if(calledFrom=='onLoad')
		{
			for(var k=0;k<totalSIRecordsDisplay[0];k++){
				filteredDataTemp.push(filteredData[k])
			}
		}
		else//Calling from pagination
		{
			for(var k=prevRecordMaxCountLoc;k<nextMinRecordCountLoc;k++){
				filteredDataTemp.push(filteredData[k])
			}
		}
		return filteredDataTemp;
	},
	setSiGranularRightsNew : function(calledFrom,prevRecordMaxCountLoc,nextMinRecordCountLoc)
	{
		var self = this;
		var data = self.loadGranularFeaturs();
		var filteredData = this.filterFeatures(data);
		var featureItems = [];
		var splitFilterData = this.getSplitSIData(calledFrom,filteredData,prevRecordMaxCountLoc,nextMinRecordCountLoc);
		featureItems = self.createPrivilegesContainer(splitFilterData);
		//featureItems = self.createPrivilegesContainer(filteredData);
		granularSPrivfieldJsonTemp = [];
		var featureItemsTemp = [];
		for (var i in featureItems) {
			granularSPrivfieldJsonTemp.push(featureItems[i]);
		}
		granularSTotalNumberOfRecord = granularSPrivfieldJsonTemp.length;
		granularSTotalPage = granularSTotalNumberOfRecord/granularSPageSize;
	},
	setSiGranularRights : function()
	{
		var self = this;
		var data = self.loadGranularFeaturs();
		var filteredData = this.filterFeatures(data);
		var featureItems = [];
		var splitFilterData = this.getSplitSIData('onLoad',filteredData,'','');
		featureItems = self.createPrivilegesContainer(splitFilterData);
		//featureItems = self.createPrivilegesContainer(filteredData);
		if(featureItems.length<granularSPageSize || numberSIRecordsToDisplay<=100)
		{
			featureItems = [];
			featureItems = self.createPrivilegesContainer(filteredData);
			navigationSIVisible = false;
			return featureItems;
		}
		var featureItemsTemp = [];
		var tempPageSize = granularSPageSize;
		if(featureItems.length<granularSPageSize)
			tempPageSize = featureItems.length;
		for(var k=0;k<tempPageSize;k++){
			featureItemsTemp.push(featureItems[k])
			totalNumberSIRecordsDisplayed++;
		}
		return featureItemsTemp;
		//return featureItems;
	},loadGranularFeatursNew : function(){
		return granularSPrivfieldJsonTemp;
	},resetPaginationValues : function(){
		granularSPageNo = 1;
		granularSCount = 1;
		granularSPageSize = 10
		granularSTotalPage = 1;
		granularSTotalNumberOfRecord = 1;
	},resetAll : function(){
		var thisClass = this;
		currentSIBunchOfPage = 0;
		granularSIOverAllTTotalPage = 1;
		granularSIOverAllTPageNo = 1;
		prevSIRecordMaxCount=0;
		nextSIMinRecordCount=0;
		numberSIRecordsToDisplay = 0;
		granularSITotalRecordPage=0;
		totalSIRecordsDisplay = [];
		thisClass.resetPaginationValues();
	},showError : function(calledFrom){
		var errMsg ="Navigation not Allowed";
		if(calledFrom=='navigationNotAllowed')
			errMsg = "Navigation not Allowed" ;
		else if(calledFrom=='first')
			errMsg = "Navigation not Allowed, Already in First Page" ;
		else if(calledFrom=='last')
			errMsg = "Navigation not Allowed, Already in Last Page" ;
		else if(calledFrom=='next')
			errMsg = "Navigation not Allowed, Already in Last Page" ;
		else if(calledFrom=='previous')
			errMsg = "Navigation not Allowed, Already in First Page" ;
			
		Ext.MessageBox.show({
			title : getLabel(
			'granularNavigationError',
			'Error'),
			msg : errMsg,
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
		});
		
	},
	nextItems : function() {
		var thisClass = this;
		if(!navigationSIVisible)
		{
			thisClass.showError('navigationNotAllowed');
			return;
		}
		if((granularSTotalPage<granularSPageNo && granularSIOverAllTPageNo>granularSIOverAllTTotalPage) 
			|| totalNumberSIRecordsDisplayed==numberSIRecordsToDisplay)
		{
			thisClass.showError('next');
			return;
		}
		thisClass.saveItemsTemp();
		Ext.getCmp('siGranPrivParametersSection').removeAll();
		
		if((granularSTotalPage<=granularSPageNo && granularSIOverAllTPageNo<=granularSIOverAllTTotalPage) 
					&& granularSITotalRecordPage>granularSTotalPage)
		{
			prevSIRecordMaxCount = prevSIRecordMaxCount + totalSIRecordsDisplay[currentSIBunchOfPage];
			currentSIBunchOfPage = currentSIBunchOfPage+1;
			nextSIMinRecordCount = totalSIRecordsDisplay[currentSIBunchOfPage];
			thisClass.setSiGranularRightsNew('pagination',prevSIRecordMaxCount,prevSIRecordMaxCount+nextSIMinRecordCount);
			granularSIOverAllTPageNo = granularSIOverAllTPageNo + 1;
			granularSPageNo = 0;
		}
		else if(currentSIBunchOfPage==0)
			thisClass.setSiGranularRightsNew('onLoad','','');
		else{
			var tempPrevSI = totalSIRecordsDisplay[currentSIBunchOfPage]*(granularSIOverAllTPageNo-1);
			var tempNextSI = totalSIRecordsDisplay[currentSIBunchOfPage];
			thisClass.setSiGranularRightsNew('pagination',tempPrevSI,tempNextSI+tempPrevSI);
		}
		var temp1 = granularSPageSize*granularSPageNo;
		granularSPageNo = granularSPageNo+1;
		var featureItems = [];
		var temp = granularSPageSize*granularSPageNo;
		var granularPrivfieldJsonTempNew = thisClass.loadGranularFeatursNew();
		if(temp>granularPrivfieldJsonTempNew.length)
			temp = granularPrivfieldJsonTempNew.length;
		for(var k=temp1;k<temp;k++){
			featureItems.push(granularPrivfieldJsonTempNew[k]);
			totalNumberSIRecordsDisplayed++;
		}
		Ext.getCmp('siGranPrivParametersSection').add(featureItems);
	},
	lastItems : function() {
		var thisClass = this;
		if(!navigationSIVisible)
		{
			thisClass.showError('navigationNotAllowed');
			return;
		}
		if((granularSTotalPage<granularSPageNo && granularSIOverAllTPageNo>granularSIOverAllTTotalPage) 
			|| totalNumberSIRecordsDisplayed==numberSIRecordsToDisplay)
		{
			thisClass.showError('last');
			return;
		}
		thisClass.saveItemsTemp();
		Ext.getCmp('siGranPrivParametersSection').removeAll();
		thisClass.resetAll();
		thisClass.setSplitSIData();
		prevSIRecordMaxCount = totalSIDisplay * (granularSIOverAllTTotalPage-1);
		nextSIMinRecordCount = prevSIRecordMaxCount + totalSIRecordsDisplay[granularSIOverAllTTotalPage-1];
		currentSIBunchOfPage = granularSIOverAllTTotalPage-1;
		thisClass.setSiGranularRightsNew('pagination',prevSIRecordMaxCount,nextSIMinRecordCount);
		granularSIOverAllTPageNo = granularSIOverAllTTotalPage;
		//granularPageNo = 0;
		var granularPrivfieldJsonTempNew = thisClass.loadGranularFeatursNew();
		while(granularPrivfieldJsonTempNew.length==0 && granularSIOverAllTPageNo>1)
		{		
			granularSIOverAllTPageNo = currentSIBunchOfPage;
			currentSIBunchOfPage--;
			prevSIRecordMaxCount = totalSIDisplay * (currentSIBunchOfPage);
			nextSIMinRecordCount = prevSIRecordMaxCount + totalSIRecordsDisplay[currentSIBunchOfPage];
			thisClass.setSiGranularRightsNew('pagination',prevSIRecordMaxCount,nextSIMinRecordCount);
			granularPrivfieldJsonTempNew = thisClass.loadGranularFeatursNew();
		}
		granularSPageNo = Math.ceil(granularSTotalPage);
		var temp1 = granularSPageSize*(granularSPageNo-1);
		//granularPageNo = granularPageNo+1;
		var featureItems = [];
		var temp = granularSPageSize*granularSPageNo;
		if(temp>granularPrivfieldJsonTempNew.length)
			temp = granularPrivfieldJsonTempNew.length;
		for(var k=temp1;k<temp;k++){
			featureItems.push(granularPrivfieldJsonTempNew[k])
		}
		totalNumberSIRecordsDisplayed=numberSIRecordsToDisplay;
		Ext.getCmp('siGranPrivParametersSection').add(featureItems);
		
	},
	firstItems : function(){
		var thisClass = this;
		if(!navigationSIVisible)
		{
			thisClass.showError('navigationNotAllowed');
			return;
		}
		if(granularSPageNo==1 && granularSIOverAllTPageNo==1)
		{
			thisClass.showError('first');
			return;
		}
		thisClass.saveItemsTemp();
		Ext.getCmp('siGranPrivParametersSection').removeAll();
		thisClass.resetAll();
		thisClass.setSplitSIData();
		thisClass.setSiGranularRightsNew('onLoad');
		Ext.getCmp('siGranPrivParametersSection').add(thisClass.setSiGranularRights() );
	},
	previousItems : function() {
		var self = this;
		if(!navigationSIVisible)
		{
			self.showError('navigationNotAllowed');
			return;
		}
		if(granularSPageNo==1 && granularSIOverAllTPageNo==1)
		{
			self.showError('previous');
			return;
		}	
		self.saveItemsTemp();
		Ext.getCmp('siGranPrivParametersSection').removeAll();
		
		if((granularSPageNo == 1 && granularSIOverAllTPageNo<=granularSIOverAllTTotalPage) 
					&& granularSITotalRecordPage>granularSTotalPage)
		{
			//prevPaymentRecordMaxCount = totalPaymentRecordsDisplay[currentPaymentBunchOfPage]*(granularPaymentOverAllTPageNo-1);
			prevSIRecordMaxCount = totalSIDisplay*currentSIBunchOfPage;
			currentSIBunchOfPage = currentSIBunchOfPage-1;
			nextSIMinRecordCount = totalSIRecordsDisplay[currentSIBunchOfPage];
			self.setSiGranularRightsNew('pagination',prevSIRecordMaxCount-nextSIMinRecordCount,prevSIRecordMaxCount);
			granularSIOverAllTPageNo = granularSIOverAllTPageNo - 1;
			granularSPageNo = Math.ceil(granularSTotalPage)+1;
		}
		else if(prevSIRecordMaxCount==0)
			self.setSiGranularRightsNew('onLoad','','');
		else
		{
			//var tempPrevPayment = totalPaymentRecordsDisplay[currentPaymentBunchOfPage]*(granularPaymentOverAllTPageNo);
			var tempPrevSI = totalSIDisplay*currentSIBunchOfPage;
			var tempNextSI = totalSIRecordsDisplay[currentSIBunchOfPage];
			self.setSiGranularRightsNew('pagination',tempPrevSI,tempPrevSI+tempNextSI);
		}
		
		
		
		if(granularSPageNo>1)
		{
			granularSPageNo = granularSPageNo-1;
		}
		var temp1 = granularSPageSize*granularSPageNo;
		var featureItems1 = [];
		var temp = temp1 - granularSPageSize;
		var granularPrivfieldJsonTempNew = self.loadGranularFeatursNew();
		for(var kk=temp;kk<temp1;kk++){
			featureItems1.push(granularPrivfieldJsonTempNew[kk]);
			totalNumberSIRecordsDisplayed--;
		}
		if(granularSPageNo==1 && granularSIOverAllTPageNo==1)
		{
			prevSIRecordMaxCount = 0;
			nextSIMinRecordCount = 0;
			totalNumberSIRecordsDisplayed = temp+temp1;
		}
		Ext.getCmp('siGranPrivParametersSection').add(featureItems1);
	},
		filterHandler : function() {
		var self = this;
		var filterCode = Ext.getCmp('siAccountIDFilterItemId').getValue();
		var packageName = Ext.getCmp('siPayPkgFilterItemId').getValue();

		/*
		 * Ext.getCmp('siGranPrivParametersSection').removeAll(); var width =
		 * Ext.getCmp('siGranPrivParametersSection').getWidth(); width = 690;
		 * Ext.getCmp('siGranPrivParametersSection').width = width;
		 */
		Ext.getCmp('siGranPrivParametersSection').removeAll();
		var filterResponse = [];
		// console.log("filterCode "+filterCode);
		var filteredData;
		if (filterCode && packageName) {
			siGranularFeatureData.forEach(function(arrayElem) {
				if ((arrayElem.accountId === filterCode && arrayElem.packageId === packageName)
						|| ((arrayElem.accountId === filterCode)
								&& ((arrayElem.packageName.toUpperCase()
										.indexOf(packageName.toUpperCase()) > -1) || (arrayElem.packageId === packageName)))) {
					// console.log("arrayElem "+arrayElem);
					filterResponse.push(JSON.parse(JSON.stringify(arrayElem)));
					// break;
				}
			});
			isFilterApplied = true;
			navigationSIVisible = false;
			filteredData = filterResponse;
		} else if (packageName) {
			siGranularFeatureData.forEach(function(arrayElem) {
						if ((arrayElem.packageId.toUpperCase() === packageName
								.toUpperCase())
								|| (arrayElem.packageName.toUpperCase()
										.indexOf(packageName.toUpperCase()) > -1)) {
							// console.log("arrayElem "+arrayElem);
							filterResponse.push(JSON.parse(JSON
									.stringify(arrayElem)));
							// break;
						}
					});
			isFilterApplied = true;
			navigationSIVisible = false;
			filteredData = filterResponse;

		} else if (filterCode) {
			siGranularFeatureData.forEach(function(arrayElem) {
				if (arrayElem.accountId === filterCode) {
					// console.log("arrayElem "+arrayElem);
					filterResponse.push(JSON.parse(JSON.stringify(arrayElem)));
					// break;
				}
			});
			isFilterApplied = true;
			navigationSIVisible = false;
			filteredData = filterResponse;
		} else {
			isFilterApplied = false;
			filteredData = this.filterFeatures(siGranularFeatureData);
		}
		var featureItems = [];
		if(!isFilterApplied)
			{
				var filteredDataTemp = this.getSplitSIData('onLoad',filteredData,'','');
				featureItems = self.createPrivilegesContainer(filteredDataTemp);
				if(featureItems.length<granularSPageSize || numberSIRecordsToDisplay<=100)
				{	
					var featureItemsTemp = [];
					featureItemsTemp = self.createPrivilegesContainer(filteredData);
					navigationSIVisible = false;
				}
				else
				{
					navigationSIVisible = true;
					self.resetPaginationValues();
					var featureItemsTemp = [];
					var temp = granularSPageSize;
					if(featureItems.length<granularSPageSize)
						temp = featureItems.length;
					for(var k=0;k<temp;k++){
						featureItemsTemp.push(featureItems[k])
					}
				}
				Ext.getCmp('siGranPrivParametersSection').add(featureItemsTemp);
			}
			else{
				featureItems = self.createPrivilegesContainer(filteredData);
				Ext.getCmp('siGranPrivParametersSection').add(featureItems);
			}
		
	},
	
	createPrivilegesContainer : function(filteredData){
	var self = this;
	var featureItems = [];
	//priviously submited granular Permissiong
	var prevPositivePayGranularPermissions = document.getElementById("siGranularPermissions");

	var siGranularPrivHeaderViewIcon = Ext.ComponentQuery.query('checkbox[itemId=siGranularPrivHeader_viewIcon]');
	if(!Ext.isEmpty(siGranularPrivHeaderViewIcon))
		siGranularPrivHeaderViewIcon=siGranularPrivHeaderViewIcon[0].checked;
	var siGranularPrivHeaderquickApproveIcon = Ext.ComponentQuery.query('checkbox[itemId=siGranularPrivHeader_quickApproveIcon]');
	if(!Ext.isEmpty(siGranularPrivHeaderquickApproveIcon))
		siGranularPrivHeaderquickApproveIcon=siGranularPrivHeaderquickApproveIcon[0].checked;
	var siGranularPrivHeadereditIcon = Ext.ComponentQuery.query('checkbox[itemId=siGranularPrivHeader_editIcon]');
	if(!Ext.isEmpty(siGranularPrivHeadereditIcon))
		siGranularPrivHeadereditIcon=siGranularPrivHeadereditIcon[0].checked;
	var siGranularPrivHeaderapproveIcon = Ext.ComponentQuery.query('checkbox[itemId=siGranularPrivHeader_authIcon]');
	if(!Ext.isEmpty(siGranularPrivHeaderapproveIcon))
		siGranularPrivHeaderapproveIcon=siGranularPrivHeaderapproveIcon[0].checked;
	var siGranularPrivHeaderdeleteIcon = Ext.ComponentQuery.query('checkbox[itemId=siGranularPrivHeader_deleteIcon]');
	if(!Ext.isEmpty(siGranularPrivHeaderdeleteIcon))
		siGranularPrivHeaderdeleteIcon=siGranularPrivHeaderdeleteIcon[0].checked;

	Ext.each(filteredData, function(feature, index) {
			var panel = Ext.create('Ext.panel.Panel', {
						columnWidth : 1,
						layout : 'column',
						bodyStyle : {
							background : '#FAFAFA'
						}
					});
			var accountText = feature.accountNo + '|' + feature.accountName;
			var packageKey = feature.productCategoryCode + '|'
					+ feature.packageId;

			if (self.allPackagesSelectedFlag == 'Y'
					|| payPackageAssignedMap[packageKey] == true) {
				if (self.allAccountsSelectedFlag == 'Y'
						|| accountAssignedMap[accountText] == true) {

					panel.insert({
						xtype : 'label',
						text : feature.accountNo,
						padding : '5 0 0 20',
						height : 'auto',
						cls : 'ux_text-elipsis granular-privilege-accountno privilege-grid-main-header privilege-grid-odd privilege-admin-rights',
						autoEl : {
							tag : 'label',
							'data-qtip' : feature.accountNo
						}
					});
					panel.insert({
						xtype : 'label',
						text : feature.accountName,
						padding : '5 0 0 10',
						height : 'auto',
						cls : 'ux_text-elipsis granular-privilege-accountno privilege-grid-odd privilege-admin-rights',
						autoEl : {
							tag : 'label',
							'data-qtip' : feature.accountName
						}
					});
					panel.insert({
						xtype : 'label',
						text : feature.packageName,
						padding : '5 0 0 10',
						height : 'auto',
						cls : 'ux_text-elipsis granular-privilege-headers privilege-grid-odd privilege-admin-rights',
						autoEl : {
							tag : 'label',
							'data-qtip' : feature.packageName
						}
					});

					if (self
							.isHiddenElementNotNull(prevPositivePayGranularPermissions)) {
						var previouslySubmitedJsonObj = Ext
								.decode(prevPositivePayGranularPermissions.value);
						self.updateFeatureIfPreviouslySelected(feature,
								previouslySubmitedJsonObj);

					}

					if (featureMap["SIS_15"] != undefined) {
						if (featureMap["SIS_15"].canView == 'Y') {
							panel.insert(self.setPriviligeMenu(feature, "VIEW",
									index,siGranularPrivHeaderViewIcon));
						}
						if (featureMap["SIS_15"].canEdit == 'Y') {
							panel.insert(self.setPriviligeMenu(feature, "EDIT",
									index,siGranularPrivHeadereditIcon));
						}

					}
					if (featureMap["SIS_383"] != undefined
							&& featureMap["SIS_383"].canEdit == 'Y') {
						panel.insert(self.setPriviligeMenu(feature, "DELETE",
								index,siGranularPrivHeaderdeleteIcon));
					}
					// if(featureMap["RVAL"].canEdit == 'Y' ){
					// panel.insert(self.setPriviligeMenu(feature,"DELETE"));
					// }

					if (featureMap["SIS_15"] != undefined
							&& featureMap["SIS_15"].canAuth == 'Y') {
						panel.insert(self.setPriviligeMenu(feature, "AUTH",
								index,siGranularPrivHeaderapproveIcon));
						// panel.insert(self.setPriviligeMenu(feature,"QUICKAPPROVE"));
					}
					if (featureMap["SIS_386"] != undefined
							&& featureMap["SIS_386"].canAuth == 'Y') {
						panel.insert(self.setPriviligeMenu(feature,
								"QUICKAPPROVE", index,siGranularPrivHeaderquickApproveIcon));
					}

					featureItems.push(panel);

				}
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
	loadAccounts : function() {
		var me = this;
		if (mode === "VIEW") {
			Ext.Ajax.request({
				url : 'services/userCategory/accounts.json',
				method : 'POST',
				async : false,
				params : {
					module : '02',
					categoryId : userCategory,
					$inlinecount : 'allpages',
					$top : 5000
				},
				success : function(response) {
					paymentAccountsData = Ext.JSON
							.decode(response.responseText);
					return paymentAccountsData;
				},
				failure : function() {
					var errMsg = "";
					Ext.MessageBox.show({
								title : getLabel('instrumentErrorPopUpTitle',
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
	
	loadPaymentPackages: function() {
	var me = this;
		if(mode === "VIEW"){
				Ext.Ajax.request({
					url : 'services/userCategory/catPackageList.json',
					method : 'POST',
					async: false,
					params : { module: '02',categoryId:userCategory,$inlinecount:'allpages',$top:5000},
					success : function(response) {
					 	 paymentPackagesData = Ext.JSON.decode(response.responseText);
						return paymentPackagesData; 
					},
					failure : function() {
						var errMsg = "";
						Ext.MessageBox.show({
									title : getLabel(
											'instrumentErrorPopUpTitle',
											'Error'),
									msg : getLabel('instrumentErrorPopUpMsg',
											'Error while fetching Payment Packages data..!'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
					}
				});

		}
		return paymentPackagesData;
	},

	
	getStringBooleanvalue : function(value) {
		if (value && value == true) {
			return 'Y';
		} else {
			return 'N';
		}
	},
	
setPaymentPackagesData : function()
	{
		var self = this;
		
		var privdata = self.loadPaymentPackages();
		
		//in case there are no packages for service check array is empty
		
		var filteredPrivData;
		
		if(privdata!== null  && privdata.length!== 0 ){
			filteredPrivData = privdata.d.details;
		}
		var selectedPackages  = document.getElementById('selectedPackages');
		var selectedPackagesObj; 
		if(typeof selectedPackages!== undefined && selectedPackages!==null && selectedPackages.value){
		  selectedPackagesObj = Ext.decode(selectedPackages.value);
		}
		
		var allPPFlag = document.getElementById('allPackagesSelectedFlag');
		if( self.isHiddenElementNotNull(allPPFlag)){
		  self.allPackagesSelectedFlag = allPPFlag.value;
		}
	 
		
		Ext.each(filteredPrivData, function(payPackage, index) {
			var payPackageKey = payPackage.productCategoryCode + '|'+ payPackage.productCode;
			var isAssigned = payPackage.assignmentStatus === 'Assigned' ? true :false ;
			var prevSelectedPayPackageObj;
			
			prevSelectedPayPackageObj = self.getPayPackageFromSelectedList(selectedPackagesObj,payPackage);
			
			if(typeof prevSelectedPayPackageObj !== undefined && prevSelectedPayPackageObj!==null){
			     
				 isAssigned = prevSelectedPayPackageObj.assigned;
			 }
		
		    payPackageAssignedMap[payPackageKey] = isAssigned;
			
			
		});
		
	//console.log("payPackageAssignedMap :"+payPackageAssignedMap); 
		
	},
	
	 getPayPackageFromSelectedList: function(selectedPackagesObj,payPackage){
	 
		 for(key in selectedPackagesObj){
		   var payPkgObj = selectedPackagesObj[key][0];
		   
		   if(payPackage.productCategoryCode == payPkgObj.productCategoryCode && payPackage.productCode == payPkgObj.productCode ){
				return payPkgObj;
		   }	   
		   
		 }
		 return null;
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
	
	setPaymentRights : function() {
		var self = this;

		var privdata = self.loadPrivilegesFeaturs();
		var filteredPrivData = this.filterFeatures(privdata);

		var viewRightsSerials = document.getElementById('viewRightsSerials');
		var editRightsSerials = document.getElementById('editRightsSerials');
		var authRightsSerials = document.getElementById('authRightsSerials');

		var selectedViewRightsObj, selectedEditRightsObj, selectedAuthRightsObj;

		if (self.isHiddenElementNotNull(viewRightsSerials)) {
			selectedViewRightsObj = Ext.decode(viewRightsSerials.value);
		}

		if (self.isHiddenElementNotNull(editRightsSerials)) {
			selectedEditRightsObj = Ext.decode(editRightsSerials.value);
		}

		if (self.isHiddenElementNotNull(authRightsSerials)) {
			selectedAuthRightsObj = Ext.decode(authRightsSerials.value);
		}

		Ext.each(filteredPrivData, function(feature, index) {

			var key = feature.featureId + "_" + feature.featureWeight;
			// Recurring Payments
			// if(key ==='SIS' && feature.featureWeight ==='15' ){
			// var value = feature;
			var rightValue;
			var rmserial = feature.rmSerial;

			if (typeof selectedViewRightsObj !== undefined
					&& selectedViewRightsObj) {
				rightValue = undefined;
				if (selectedViewRightsObj.hasOwnProperty(rmserial)) {
					rightValue = selectedViewRightsObj[rmserial];
				}
				if (rightValue !== undefined)
					feature.canView = self.getStringBooleanvalue(rightValue);

			}

			if (typeof selectedEditRightsObj !== undefined
					&& selectedEditRightsObj) {
				rightValue = undefined;
				if (selectedEditRightsObj.hasOwnProperty(rmserial)) {
					rightValue = selectedEditRightsObj[rmserial];
				}
				if (rightValue !== undefined)
					feature.canEdit = self.getStringBooleanvalue(rightValue);

			}

			if (typeof selectedAuthRightsObj !== undefined
					&& selectedAuthRightsObj) {
				rightValue = undefined;
				if (selectedAuthRightsObj.hasOwnProperty(rmserial)) {
					rightValue = selectedAuthRightsObj[rmserial];
				}
				if (rightValue !== undefined)
					feature.canAuth = self.getStringBooleanvalue(rightValue);

			}

			featureMap[key] = feature;
				// }
			});
	},
		
	reconfigure : function(){
		var thisClass = this;
		Ext.getCmp('siGranPrivParametersSection').removeAll();
		Ext.getCmp('siGranularPrivHeader').removeAll();
		Ext.getCmp('siGranularPrivColumnHeader').removeAll();
		
		
		thisClass.setPaymentRights();
		thisClass.setPaymentPackagesData();
		thisClass.setPaymentAccounts();
		thisClass.setSplitSIData();
		thisClass.resetPaginationValues();
		thisClass.setSiGranularRightsNew('onLoad');
		Ext.getCmp('siGranPrivParametersSection').add(thisClass.setSiGranularRights() );
		Ext.getCmp('siGranularPrivHeader').add(thisClass.setPanelHeader('siGranularPrivHeader',getLabel('lbl.account','Account')));
		Ext.getCmp('siGranularPrivColumnHeader').add(thisClass.setColumnHeader());
	
	
	
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
				if (previousSelectedObj.privileges.hasOwnProperty("VIEW")) {
					feature.viewFlag = previousSelectedObj.privileges.VIEW
							? true
							: false;
				}
				if (previousSelectedObj.privileges.hasOwnProperty("EDIT")) {
					feature.editFlag = previousSelectedObj.privileges.EDIT
							? true
							: false;
				}
				if (previousSelectedObj.privileges.hasOwnProperty("DELETE")) {
					feature.deleteFlag = previousSelectedObj.privileges.DELETE
							? true
							: false;
				}

				if (previousSelectedObj.privileges.hasOwnProperty("AUTH")) {
					feature.approveFlag = previousSelectedObj.privileges.AUTH
							? true
							: false;
				}
				if (previousSelectedObj.privileges
						.hasOwnProperty("QUICKAPPROVE")) {
					feature.quickApproveFlag = previousSelectedObj.privileges.QUICKAPPROVE
							? true
							: false;
				}			  
			}
		  }
			 
		

	},
	
	
	initComponent: function() {
	var thisClass = this;
	
		thisClass.setPaymentRights();
		thisClass.setPaymentPackagesData();
		thisClass.setPaymentAccounts();
		thisClass.setSplitSIData();
		thisClass.resetPaginationValues();
		thisClass.setSiGranularRightsNew('onLoad');
		thisClass.items = [{
					xtype:'panel',
					width : 'auto',
					items:[{
						xtype: 'panel',
						width : 'auto',
						id : 'siGranularPrivFilterBox',
						layout:'column',
						cls: 'ft-padding-bottom',
						items: [
							{
								xtype : 'AutoCompleter',
								//cls : 'autoCmplete-field ux_paddingb',
								fieldCls : 'xn-form-text xn-suggestion-box granular-autocompleter',
								id : 'siAccountIDFilterItemId',
								itemId : 'siAccountIDFilterItemId',
								name : 'siAccountIDFilterItemId',
								matchFieldWidth : true,
								labelSeparator : '',
								labelAlign : 'top',
								labelCls : 'ft-bold-font page-content-font',
								fieldLabel :  getLabel( 'lbl.account', 'Account' ),
								emptyText : getLabel('searchByAccNumberOrName','Search by Account number or name'),
								cfgUrl : 'services/userseek/accountPackagesSeekForSI.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'siAccountIDFilterItemId',
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
								listeners : {
								'select':function(){
									thisClass.filterHandler(); 
									var selected = thisClass.down('component[itemId="accountClearLink"]');
          								  selected.show();									
								 },
								   'change':function(){
									 var filterContainer = thisClass.down('[itemId="siAccountIDFilterItemId"]');
								   if(Ext.isEmpty(filterContainer.getValue())){
										var selected = thisClass.down('component[itemId="accountClearLink"]');
										selected.hide();
									  thisClass.filterHandler();
									  }
								 }
							 }
							},{
								xtype : 'component',
								layout : 'hbox',
								itemId : 'accountClearLink',
								hidden : true,
								style : {
									'line-height' : 4
								},
								cls : 'clearlink-a cursor_pointer page-content-font ft-padding-l',
								html: '<a>'+getLabel('clear','Clear')+'</a>',
								listeners: {
									'click': function() {
										var filterContainer = thisClass.down('[itemId="siAccountIDFilterItemId"]');
										filterContainer.setValue("");
										var selected = thisClass.down('component[itemId="accountClearLink"]');
										selected.hide();
										thisClass.filterHandler();
									},
									element: 'el',
									delegate: 'a'
								}
							},{
								margin : '0 0 0 40',
								xtype : 'AutoCompleter',
								//cls : 'autoCmplete-field ux_paddingb',
								fieldCls : 'xn-form-text xn-suggestion-box popup-searchBox ',
								id : 'siPayPkgFilterItemId',
								itemId : 'siPayPkgFilterItemId',
								name : 'siPayPkgFilterItemId',
								matchFieldWidth : true,
								labelSeparator : '',
								labelAlign : 'top',
								labelCls : 'ft-bold-font page-content-font',
								fieldLabel :  getLabel('pmtPackage', 'Package' ),
								emptyText : getLabel('searchByPmtPackage','Search by Payment Package'),
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
									}],
								listeners : {
								'select':function(){
									thisClass.filterHandler(); 
									var selected = thisClass.down('component[itemId="paypkgClearLink"]');
          								  selected.show();									
								 },
								   'change':function(){
									 var filterContainer = thisClass.down('[itemId="siPayPkgFilterItemId"]');
								   if(Ext.isEmpty(filterContainer.getValue())){
										var selected = thisClass.down('component[itemId="paypkgClearLink"]');
										selected.hide();
									  thisClass.filterHandler();
									  }
								 }
							 }
							},{
								xtype : 'component',
								layout : 'hbox',
								itemId : 'paypkgClearLink',
								hidden : true,
								style : {
									'line-height' : 4
								},
								cls : 'clearlink-a cursor_pointer page-content-font ft-padding-l',
								html: '<a>'+getLabel('clear','Clear')+'</a>',
								listeners: {
									'click': function() {
										var filterContainer = thisClass.down('[itemId="siPayPkgFilterItemId"]');
										filterContainer.setValue("");
										var selected = thisClass.down('component[itemId="paypkgClearLink"]');
										selected.hide();
										thisClass.filterHandler();
									},
									element: 'el',
									delegate: 'a'
								}
							}
							
						]
						
						
				  }]
			 },{
	    	xtype: 'container',
			maxHeight : 2200,
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
						id : 'siGranularPrivColumnHeader',
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
			 		maxHeight : 2200,
			 		items:[{
							xtype: 'panel',
							width : 'auto',
							id : 'siGranularPrivHeader',
							layout: {
						        type: 'column'
						    },
							cls:'red-bg',
							height : 50,
							items: thisClass.setPanelHeader('siGranularPrivHeader',getLabel('lbl.account','Account'))
						},
						{
							xtype: 'panel',
							width : 'auto',
							//overflowY: 'auto',
							maxHeight : 2200,
							//maxWidth : thisClass.max_width,
							titleAlign : "left", 
							//collapsible :  true,
							cls : 'xn-ribbon',
							collapseFirst : true,
							itemId : 'siGranPrivParametersSection',
							id : 'siGranPrivParametersSection',
							layout: {
							        type: 'vbox'
							    },
							items: thisClass.setSiGranularRights()
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
							objSIGranularPrivPriviligePopup= null;
							document.getElementById("siGranularPermissions").value='';
							//thisClass.hide();
			        				}
			          },'->',{ 
			        	  text: getLabel('First','First'),
			        	  cls : 'ft-button-primary',
						  //hidden  : !isNavigationVisible(),
			        	  /*handler : function(btn,opts) {
			        	  	thisClass.saveItems();
			        		thisClass.close();
			        				}*/
						 listeners: {
						  click : function(){
						  thisClass.firstItems();
						  }
							}			
			          },
					  { 
			        	  text: getLabel('Previous','Previous'),
			        	  cls : 'ft-button-primary',
			        	  /*handler : function(btn,opts) {
			        	  	thisClass.saveItems();
			        		thisClass.close();
			        				}*/
						 listeners: {
						  click : function(){
						  thisClass.previousItems();
						  }
							}			
			          },
					  { 
			        	  text: getLabel('Next','Next'),
			        	  cls : 'ft-button-primary',
			        	  /*handler : function(btn,opts) {
			        	  	thisClass.saveItems();
			        		thisClass.close();
			        				}*/
						 listeners: {
						  click : function(){
						  thisClass.nextItems();
						  }
							}			
			          },{ 
			        	  text: getLabel('Last','Last'),
			        	  cls : 'ft-button-primary',
						  //hidden  : !isNavigationVisible(),
			        	  /*handler : function(btn,opts) {
			        	  	thisClass.saveItems();
			        		thisClass.close();
			        				}*/
						 listeners: {
						  click : function(){
						  thisClass.lastItems();
						  }
							}			
			          },
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
	},setPayGranularOptionsTemp : function(jsonObj) {
				document.getElementById("siGranularPermissions").value = JSON.stringify(jsonObj);
	},
	saveItemsTemp : function() {
		var me = this;
		var jsonData = {};
		//var pkgId='NOPKG';
		Ext.each(granularPrivfieldJson, function(field, index) {
					var featureId = field.itemId;
					var accountId = field.accountId;
					var pkgId = field.packageId;
					var element = me.down('checkboxfield[itemId=' + featureId
							+ ']');
					var objectKey = accountId + '_' + pkgId;

					if (element != null && element != undefined
							&& !element.hidden) {

						var mode = element.mode;
						//console.log("jsonData :"+JSON.stringify(jsonData));
						if (!(objectKey in jsonData)) {
							//console.log("accountiD adding for first time :"+accountId);
							var newEntry = {};
							newEntry['accountId'] = accountId;
							newEntry['packageId'] = pkgId;
							newEntry['privileges'] = {};
							jsonData[objectKey] = newEntry;
						}

						if ('VIEW' == mode) {
							jsonData[objectKey]['privileges']['VIEW'] = element
									.getValue();
						}
						if ('EDIT' == mode) {
							jsonData[objectKey]['privileges']['EDIT'] = element
									.getValue();
						}
						if ('AUTH' == mode) {
							jsonData[objectKey]['privileges']['AUTH'] = element
									.getValue();
						}
						if ('QUICKAPPROVE' == mode) {
							jsonData[objectKey]['privileges']['QUICKAPPROVE'] = element
									.getValue();
						}
						if ('DELETE' == mode) {
							jsonData[objectKey]['privileges']['DELETE'] = element
									.getValue();;
						}
						for(var mode in jsonData[objectKey]['privileges']) {
							if( !jsonData[objectKey]['privileges']['VIEW'] && jsonData[objectKey]['privileges'][mode]){
							   	jsonData[objectKey]['privileges']['VIEW'] = true;
							   	break;
							}
						}
					}
				});

		/*var jsonObj = {};
		jsonObj['serviceType'] = 'SI';
		jsonObj['moduleCode'] = '02';
		//console.log("available jsonData :"+JSON.stringify(jsonData));
		var jsonArray = [];
		//only add those records which are updated
		for (var index in siGranularFeatureDataBackup) {
			var orginalObj = siGranularFeatureDataBackup[index];
			var accountId = orginalObj.accountId;
			var pkgId = orginalObj.packageId;
			var objectKey = accountId + '_' + pkgId;
			var recordKeyNo = orginalObj.recordKeyNo;
			if ((objectKey in jsonData)) {
				var newObj = jsonData[objectKey];
				if (newObj['privileges']['VIEW'] == this
						.getBooleanvalue(orginalObj.viewFlag)
						&& newObj['privileges']['EDIT'] == this
								.getBooleanvalue(orginalObj.editFlag)
						&& newObj['privileges']['AUTH'] == this
								.getBooleanvalue(orginalObj.approveFlag)
						&& newObj['privileges']['QUICKAPPROVE'] == this
								.getBooleanvalue(orginalObj.quickApproveFlag)
						&& newObj['privileges']['DELETE'] == this
								.getBooleanvalue(orginalObj.deleteFlag)) {
					// if none of the values are changed no need to push into
					// array

				} else {
					jsonArray.push(newObj)
				}

			} else {

				// recordKeyNo of record means its saved in db and if its not
				// found in jsonData (i.e currently present in rows on screen)
				// then make all flag N for that account

				if (recordKeyNo !== undefined && recordKeyNo != null
						&& recordKeyNo && !isFilterApplied) {

					if (false === this.getBooleanvalue(orginalObj.viewFlag)
							&& false === this
									.getBooleanvalue(orginalObj.editFlag)
							&& false === this
									.getBooleanvalue(orginalObj.approveFlag)
							&& false === this
									.getBooleanvalue(orginalObj.quickApproveFlag)
							&& false === this
									.getBooleanvalue(orginalObj.deleteFlag)) {
						// if all flags are N means record is previously removed
						// no need to add into deleted array

					} else {
						var newEntry = {};
						newEntry['accountId'] = accountId;
						newEntry['packageId'] = pkgId;
						var privileges = {
							'VIEW' : false,
							'EDIT' : false,
							'AUTH' : false,
							'QUICKAPPROVE' : false,
							'DELETE' : false
						};
						newEntry['privileges'] = privileges;

						jsonArray.push(newEntry);
					}

				}
			}
		}
		*/
		var jsonObj = {};
			var jsonArray = [];
			jsonObj['serviceType'] = 'SI';
			jsonObj['moduleCode'] = '02';
			for (var index  in jsonData){
				var orginalObj = jsonData[index];
			    var accountId =orginalObj.accountId;
			    var pkgId =orginalObj.packageId;
				var objectKey = accountId+'_'+pkgId;
				var recordKeyNo = orginalObj.recordKeyNo;
			  	if((objectKey in jsonData)){ 
                       var newObj = jsonData[objectKey];
					   jsonArray.push(newObj);
					   
				}
			}
			var v1 =true;
			Ext.each(jsonArray, function(field, index) {
					var accountId =field.accountId;
					var pkgId =field.packageId;
					var objectKey = accountId+'_'+pkgId;
				//if(objectKey in jsonData) {
					var newObj = jsonData[objectKey];
					Ext.each(jsonSArrayGlobal, function(fieldNew, indexNew) {
						var accountIdNew =fieldNew.accountId;
						var pkgIdNew =fieldNew.packageId;
						var objectKeyNew = accountIdNew+'_'+pkgIdNew;
						//if(objectKeyNew in jsonArrayGlobal) {
							if(objectKeyNew==objectKey){ 
								v1=false;
								var newObj1 = jsonData[objectKeyNew];
								if(!Ext.isEmpty(newObj) && !Ext.isEmpty(newObj1))
								{
								  if (newObj1.privileges.VIEW!= newObj['privileges']['VIEW']
									||newObj1.privileges.EDIT!= newObj['privileges']['EDIT']
									||newObj1.privileges.AUTH!= newObj['privileges']['AUTH']
									||newObj1.privileges.QUICKAPPROVE!= newObj['privileges']['QUICKAPPROVE']
									||newObj1.privileges.DELETE!= newObj['privileges']['DELETE'])
									{
										jsonSArrayGlobal[indexNew].privileges=jsonArray[index].privileges;
									}
								}
						//}
							}	
					});
				//}
			});
			if (Ext.isEmpty(jsonSArrayGlobal)){
				jsonSArrayGlobal = jsonArray;
			}else if(v1){
				jsonSArrayGlobal = jsonSArrayGlobal.concat(jsonArray);
			}
			//jsonArray = $.extend( jsonArray, jsonArrayGlobal );
			//jsonArray = mergeJSON(jsonArray,jsonArrayGlobal);
			//jsonArray = $.extend({}, jsonArray, jsonArrayGlobal);
			//jsonArray.concat(jsonArrayGlobal)
		jsonObj['accountPackagePrivileges'] = jsonData;
		//console.log("length :"+jsonArray.length);
		//console.log("jsonData :"+JSON.stringify(jsonObj));
		if (!Ext.isEmpty(me.fnCallback) && typeof me.fnCallback == 'function') {
			me.setPayGranularOptionsTemp(jsonObj);
		}
	},
	saveItems : function() {
		var me = this;
		var jsonData = {};
		//var pkgId='NOPKG';
		Ext.each(granularPrivfieldJson, function(field, index) {
					var featureId = field.itemId;
					var accountId = field.accountId;
					var pkgId = field.packageId;
					var element = me.down('checkboxfield[itemId=' + featureId
							+ ']');
					var objectKey = accountId + '_' + pkgId;

					if (element != null && element != undefined
							&& !element.hidden) {

						var mode = element.mode;
						//console.log("jsonData :"+JSON.stringify(jsonData));
						if (!(objectKey in jsonData)) {
							//console.log("accountiD adding for first time :"+accountId);
							var newEntry = {};
							newEntry['accountId'] = accountId;
							newEntry['packageId'] = pkgId;
							newEntry['privileges'] = {};
							jsonData[objectKey] = newEntry;
						}

						if ('VIEW' == mode) {
							jsonData[objectKey]['privileges']['VIEW'] = element
									.getValue();
						}
						if ('EDIT' == mode) {
							jsonData[objectKey]['privileges']['EDIT'] = element
									.getValue();
						}
						if ('AUTH' == mode) {
							jsonData[objectKey]['privileges']['AUTH'] = element
									.getValue();
						}
						if ('QUICKAPPROVE' == mode) {
							jsonData[objectKey]['privileges']['QUICKAPPROVE'] = element
									.getValue();
						}
						if ('DELETE' == mode) {
							jsonData[objectKey]['privileges']['DELETE'] = element
									.getValue();;
						}
						for(var mode in jsonData[objectKey]['privileges']) {
							if( !jsonData[objectKey]['privileges']['VIEW'] && jsonData[objectKey]['privileges'][mode]){
							   	jsonData[objectKey]['privileges']['VIEW'] = true;
							   	break;
							}
						}
					}
				});

		var jsonObj = {};
		jsonObj['serviceType'] = 'SI';
		jsonObj['moduleCode'] = '02';
		//console.log("available jsonData :"+JSON.stringify(jsonData));
		var jsonArray = [];
		//only add those records which are updated
		for (var index in siGranularFeatureDataBackup) {
			var orginalObj = siGranularFeatureDataBackup[index];
			var accountId = orginalObj.accountId;
			var pkgId = orginalObj.packageId;
			var objectKey = accountId + '_' + pkgId;
			var recordKeyNo = orginalObj.recordKeyNo;
			if ((objectKey in jsonData)) {
				var newObj = jsonData[objectKey];
				if (newObj['privileges']['VIEW'] == this
						.getBooleanvalue(orginalObj.viewFlag)
						&& newObj['privileges']['EDIT'] == this
								.getBooleanvalue(orginalObj.editFlag)
						&& newObj['privileges']['AUTH'] == this
								.getBooleanvalue(orginalObj.approveFlag)
						&& newObj['privileges']['QUICKAPPROVE'] == this
								.getBooleanvalue(orginalObj.quickApproveFlag)
						&& newObj['privileges']['DELETE'] == this
								.getBooleanvalue(orginalObj.deleteFlag)) {
					// if none of the values are changed no need to push into
					// array
						//jsonArray.push(newObj)
				} else {
					jsonArray.push(newObj)
				}

			} else {

				// recordKeyNo of record means its saved in db and if its not
				// found in jsonData (i.e currently present in rows on screen)
				// then make all flag N for that account

				if (recordKeyNo !== undefined && recordKeyNo != null
						&& recordKeyNo && !isFilterApplied) {

					if (false === this.getBooleanvalue(orginalObj.viewFlag)
							&& false === this
									.getBooleanvalue(orginalObj.editFlag)
							&& false === this
									.getBooleanvalue(orginalObj.approveFlag)
							&& false === this
									.getBooleanvalue(orginalObj.quickApproveFlag)
							&& false === this
									.getBooleanvalue(orginalObj.deleteFlag)) {
						// if all flags are N means record is previously removed
						// no need to add into deleted array

					} else {
						if(!isFilterApplied && navigationSIVisible)
						{
							var newEntry = {};
							newEntry['accountId'] = accountId;
							newEntry['packageId'] = pkgId;
							var privileges = {
								'VIEW' : false,
								'EDIT' : false,
								'AUTH' : false,
								'QUICKAPPROVE' : false,
								'DELETE' : false
							};
							newEntry['privileges'] = privileges;

							jsonArray.push(newEntry);
						}
					}

				}
			}
		}
		var v1 =true;
			Ext.each(jsonArray, function(field, index) {
					var accountId =field.accountId;
					var pkgId =field.packageId;
					var objectKey = accountId+'_'+pkgId;
				//if(objectKey in jsonData) {
					var newObj = jsonData[objectKey];
					Ext.each(jsonSArrayGlobal, function(fieldNew, indexNew) {
						var accountIdNew =fieldNew.accountId;
						var pkgIdNew =fieldNew.packageId;
						var objectKeyNew = accountIdNew+'_'+pkgIdNew;
						//if(objectKeyNew in jsonData) {
							if(objectKeyNew==objectKey){ 
								v1=false;
								var newObj1 = jsonSArrayGlobal[indexNew];
							if(!Ext.isEmpty(newObj) && !Ext.isEmpty(newObj1))
							{
							  if (newObj1.privileges.VIEW!= newObj['privileges']['VIEW']
								||newObj1.privileges.EDIT!= newObj['privileges']['EDIT']
								||newObj1.privileges.AUTH!= newObj['privileges']['AUTH']
								||newObj1.privileges.QUICKAPPROVE!= newObj['privileges']['QUICKAPPROVE']
								||newObj1.privileges.DELETE!= newObj['privileges']['DELETE'])
								{
									jsonSArrayGlobal[indexNew].privileges=jsonArray[index].privileges;
								}
							}	
							}
						//}
					});
				//}	
			});
			if (Ext.isEmpty(jsonSArrayGlobal)){
				jsonSArrayGlobal = jsonArray;
			}else if(v1){
				jsonSArrayGlobal = jsonSArrayGlobal.concat(jsonArray);
			}
			if(!isFilterApplied && navigationSIVisible){
				var headerViewIcon = me.down('checkbox[itemId=siGranularPrivHeader_viewIcon]');
				var headerEditIcon = me.down('checkbox[itemId=siGranularPrivHeader_editIcon]');
				var headerDeleteIcon = me.down('checkbox[itemId=siGranularPrivHeader_deleteIcon]');
				var headerApproveIcon = me.down('checkbox[itemId=siGranularPrivHeader_authIcon]');
				var headerQuickApproveIcon = me.down('checkbox[itemId=siGranularPrivHeader_quickApproveIcon]');
				var newEntryJsonAll = [];
				for (var index  in siGranularFeatureDataBackup){
					var orginalObj = siGranularFeatureDataBackup[index];
					var accountId =orginalObj.accountId;
					var pkgId =orginalObj.packageId;
					var objectKey = accountId+'_'+pkgId;
					//var recordKeyNo = orginalObj.recordKeyNo;
					var tempFlag=true;
					Ext.each(jsonSArrayGlobal, function(fieldNew, indexNew) {
						var accountIdNew =fieldNew.accountId;
						var pkgIdNew =fieldNew.packageId;
						var objectKeyNew = accountIdNew+'_'+pkgIdNew;
						if(objectKeyNew==objectKey)
						{
							tempFlag = false;
							if(headerViewIcon && headerViewIcon.checked){
								jsonSArrayGlobal[indexNew].privileges.VIEW =true;
							}
							if(headerEditIcon && headerEditIcon.checked){
								jsonSArrayGlobal[indexNew].privileges.EDIT = true;
							}
							if(headerDeleteIcon && headerDeleteIcon.checked){
								jsonSArrayGlobal[indexNew].privileges.DELETE = true;
							}
							if(headerApproveIcon && headerApproveIcon.checked){
								jsonSArrayGlobal[indexNew].privileges.APPROVE = true;
							}
							if(headerQuickApproveIcon && headerQuickApproveIcon.checked){
								jsonSArrayGlobal[indexNew].privileges.QUICKAPPROVE = true;
							}
						}
					});
					if(tempFlag)
					{
						var accountText = orginalObj.accountNo + '|' + orginalObj.accountName;
						var packageKey = orginalObj.productCategoryCode + '|'
										+ orginalObj.packageId;
							if (me.allPackagesSelectedFlag == 'Y'
							|| payPackageAssignedMap[packageKey] == true) {
								if (me.allAccountsSelectedFlag == 'Y'
									|| accountAssignedMap[accountText] == true)
								{
									var newEntryJson = {};
									newEntryJson['accountId'] = accountId;
									newEntryJson['packageId'] = pkgId;
									var view=false;
									var edit=false;
									var auth=false;
									var quickapprove=false;
									var recall=false;
									var cancel=false;
									var cancelapprove=false;
									var vDelete=false;
									var vImport=false;
									var flagUpdate = false;
									
									if(headerViewIcon && headerViewIcon.checked){
										view =true;
										flagUpdate = true;
									}
									if(headerEditIcon && headerEditIcon.checked){
										edit = true;
										flagUpdate = true;
									}
									if(headerDeleteIcon && headerDeleteIcon.checked){
										vDelete = true;
										flagUpdate = true;
									}
									if(headerApproveIcon && headerApproveIcon.checked){
										auth = true;
										flagUpdate = true;
									}
									if(headerQuickApproveIcon && headerQuickApproveIcon.checked){
										quickapprove = true;
										flagUpdate = true;
									}
									var privileges = {'VIEW':view,'EDIT':edit,'AUTH':auth,'QUICKAPPROVE':quickapprove,'DELETE':vDelete};
									newEntryJson['privileges'] = privileges;
									if(flagUpdate)
										newEntryJsonAll.push(newEntryJson);
								}
							}	
					}
				}
			}
		if(!Ext.isEmpty(newEntryJsonAll))
			jsonSArrayGlobal = jsonSArrayGlobal.concat(newEntryJsonAll);
		jsonObj['accountPackagePrivileges'] = jsonSArrayGlobal;
		//console.log("length :"+jsonArray.length);
		//console.log("jsonData :"+JSON.stringify(jsonObj));
		if (!Ext.isEmpty(me.fnCallback) && typeof me.fnCallback == 'function') {
			me.fnCallback(jsonObj);
			me.close();
		}
	}
});

function checkSIGranularViewIfNotSelected(isSelected,panelPointer,obj){
	if(null != panelPointer && undefined != panelPointer){
	if(isSelected){
	if(null != panelPointer && undefined != panelPointer){
		var viewItemId =obj.accountId + "_" + obj.packageId + "_VIEW";
		var view_chk_box = panelPointer.down('checkbox[itemId='+viewItemId+']');
		if(null != view_chk_box && undefined != view_chk_box && view_chk_box.value== false){
			view_chk_box.setValue(true);}
		}
	}else{
		if("VIEW"===obj.mode){
				var editIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + "_" + obj.packageId + '_EDIT' +']');
				if( editIconItemId )
				{
					editIconItemId.setValue( false );
					editIconItemId.defVal = false;
				}
				var authIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + "_" + obj.packageId + '_AUTH' +']');
				if( authIconItemId )
				{
					authIconItemId.setValue( false );
					authIconItemId.defVal = false;
				}
				var quickauthIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + "_" + obj.packageId + '_QUICKAPPROVE' +']');
				if( quickauthIconItemId )
				{
					quickauthIconItemId.setValue( false );
					quickauthIconItemId.defVal = false;
				}
				var deleteIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + "_" + obj.packageId + '_DELETE' +']');
				if( deleteIconItemId )
				{
					deleteIconItemId.setValue( false );
					deleteIconItemId.defVal = false;
				}
				
			}
		}
	}
}