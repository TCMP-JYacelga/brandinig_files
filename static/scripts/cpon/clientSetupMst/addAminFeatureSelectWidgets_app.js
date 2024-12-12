var objWidgetsSelectionPopup = null;
var objActionsSelectionPopup = null;
var objMessageSelectionPopup = null;
var objAdminFeaturePopup = null;
var objBrFeatureIntradayAccountsPopup = null;
var objBrFeaturePrevdayAccountsPopup = null;
var objAdminProfileSeek = null;
var objBRProfileSeek = null;
var objBrWidgetsSelectionPopup = null;
var objBrActionsSelectionPopup = null;
var objThemeProfileFilterPopup = null;
var objReportProfileFilterPopup = null;
var objAlertProfileFilterPopup = null;
var objInterfaceProfileFilterPopup = null;
var objBillingProfileFilterPopup = null;
var objTypeProfileFilterPopup = null;
var objFxProfileFilterPopup = null;
var isAdminWidgetsAllSelected = 'N';
var isHomeActionLinksAllSelected = 'N';
var isAdminOptionsAllSelected = 'N';
var objBRFeaturePopup = null;
Ext.Loader.setConfig({
			enabled : true,
			setPath : {
				'Ext' : 'static/js/extjs4.2.1/src',
				'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
			}
		});
		
Ext.Loader.setPath('GCP', 'static/scripts/cpon/common');

Ext.application({
			name : 'CPON',
			// appFolder : 'app',
			requires : ['GCP.view.WidgetSelectionPopup', 'GCP.view.BRFeaturePopup','Ext.util.MixedCollection','Ext.util.Filter',
					'GCP.view.AdminFeaturePopup','GCP.view.CopyProfileSeek','GCP.view.ProfileFilterPopup'],
			launch : function() {
				objBRFeaturePopup = Ext.create('GCP.view.BRFeaturePopup',
						{
							itemId : 'brFeaturePopup',
							fnCallback : setSelectedBRFeatureItems,
							profileId : adminFeatureProfileId,
							featureType : 'P',
							module : '01'
//							title : getLabel("brfeatureProfile", "BR Feature")
						});
				objWidgetsSelectionPopup = Ext.create(
						'GCP.view.WidgetSelectionPopup', {
							itemId : 'widgetSelectionPopup',
							fnCallback : setSelectedWidgetItems,
							profileId : adminFeatureProfileId,
							featureType : 'W',
							module : '03',
							title : getLabel('widget', 'Widget'),
							columnName : getLabel('widgetName', 'Widget Name')
						});
				objActionsSelectionPopup = Ext.create(
						'GCP.view.WidgetSelectionPopup', {
							itemId : 'actionSelectionPopup',
							fnCallback : setSelectedActionItems,
							profileId : adminFeatureProfileId,
							featureType : 'L',
							module : '03',
							title : getLabel('actionlinks', 'Action Links'),
							columnName : getLabel('actionlinksName','Action Links Name')
						});
				objMessageSelectionPopup = Ext.create(
						'GCP.view.WidgetSelectionPopup', {
							itemId : 'messageSelectionPopup',
							fnCallback : setSelectedMessageItems,
							profileId : adminFeatureProfileId,
							featureType : 'M',
							module : '03',
							title : getLabel('adminMessage', 'Message'),
							columnName : getLabel('adminMessageName',
									'Message Name')
						});
				objAdminFeaturePopup = Ext.create('GCP.view.AdminFeaturePopup',
						{
							itemId : 'adminFeaturePopup',
							fnCallback : setSelectedAdmFeatureItems,
							profileId : adminFeatureProfileId,
							featureType : 'P',
							module : '03',
							title : getLabel('adminFeature', 'Admin Options'),
							isAllSelected : isAdminOptionsAllSelected 
						});
				objAdminProfileSeek = Ext.create('GCP.view.CopyProfileSeek',
						{
							itemId : 'adminProfileSeek',
							title : getLabel('copyadminprofile', 'Copy Admin Feature Profile'),
							columnName : getLabel('admfeatureprfname', 'Admin Feature Profile Name'),
							actionUrl : 'doCopyAdminProfile.form'
						});
				objBRProfileSeek = Ext.create('GCP.view.CopyBRProfileSeek',
						{
							itemId : 'brProfileSeek',
							title : getLabel('copybrprofile', 'Copy BR Feature Profile'),
							columnName : getLabel('brfeatureprfname', 'BR Feature Profile Name'),
							actionUrl : 'doCopyBRProfile.form'
						});
				objBrWidgetsSelectionPopup = Ext.create(
						'GCP.view.WidgetSelectionPopup', {
							itemId : 'brWidgetSelectionPopup',
							fnCallback : setSelectedWidgetItems,
							profileId : adminFeatureProfileId,
							featureType : 'W',
							module : '01',
							title : getLabel('widget', 'Widget'),
							columnName : getLabel('widgetName', 'Widget Name')
						});
				objBrActionsSelectionPopup = Ext.create(
						'GCP.view.WidgetSelectionPopup', {
							itemId : 'brActionSelectionPopup',
							fnCallback : setSelectedActionItems,
							profileId : adminFeatureProfileId,
							featureType : 'L',
							module : '01',
							title : getLabel('actionlinks', 'Action Links'),
							columnName : getLabel('actionlinksName',
									'Action Links Name')
						});
				objBrFeatureIntradayAccountsPopup= Ext.create('GCP.view.BRFeatureAccountsPopup',
						{
					itemId : 'brAccountFeaturePopup',
					fnCallback : setSelectedBRIntraAccountItems,
					profileId : adminFeatureProfileId,
					featureType : 'IA',
					module : '01',
					title : getLabel('intradayaccounts', 'Intra Day Accounts'),
					columnName : getLabel('accountNmbr','Account')
				});
				objBrFeaturePrevdayAccountsPopup= Ext.create('GCP.view.BRFeatureAccountsPopup',
				{
					itemId : 'brAccountFeaturePopup',
					fnCallback : setSelectedBRPrevAccountItems,
					profileId : adminFeatureProfileId,
					featureType : 'PA',
					module : '01',
					title : getLabel('predeayaccounts', 'Previous Day Accounts'),
					columnName : getLabel('accountNmbr','Account')
				});
				
				objThemeProfileFilterPopup = Ext.create('GCP.view.ProfileFilterPopup',
						{
					fnCallback : showSelectedFields
				});
				objReportProfileFilterPopup = Ext.create('GCP.view.ProfileFilterPopup',
						{
					fnCallback : showSelectedFields
				});
				objAlertProfileFilterPopup = Ext.create('GCP.view.ProfileFilterPopup',
						{
					fnCallback : showSelectedFields
				});
				objInterfaceProfileFilterPopup = Ext.create('GCP.view.ProfileFilterPopup',
						{
					fnCallback : showSelectedFields
				});
				objBillingProfileFilterPopup = Ext.create('GCP.view.ProfileFilterPopup',
						{
					fnCallback : showSelectedFields
				});
				objTypeProfileFilterPopup = Ext.create('GCP.view.ProfileFilterPopup',
						{
					fnCallback : showSelectedFields
				});
				objFxProfileFilterPopup = Ext.create('GCP.view.ProfileFilterPopup',
						{
					fnCallback : showSelectedFields
				});
			}
		});
function getBRFeaturePopup() {

		if($('#chkAllBRFeaturesSelectedFlag').attr('src')=='static/images/icons/icon_checked.gif')
		{
			var brCheckBoxes = objBRFeaturePopup.query('checkboxgroup');
			for(var i = 0; i<brCheckBoxes.length; i++ ){
				var cBox = brCheckBoxes[i].query('checkbox');
				for(var j=0; j<cBox.length;j++){
					cBox[j].setValue(true);						
				}	
			}
			objBRFeaturePopup.show();
		}
		else
		{
			var brCheckBoxes = objBRFeaturePopup.query('checkboxgroup');
			for(var i = 0; i<brCheckBoxes.length; i++ ){
			
				if(brCheckBoxes[i] != undefined)
				{
					var cBox = brCheckBoxes[i].query('checkbox');
					for(var j=0; j<cBox.length;j++){
					if(cBox[j].defVal !== true)
						cBox[j].setValue(false);						
					}
				}
			}
			objBRFeaturePopup.show();
		}
}

function setSelectedBRFeatureItems(records, objJson) {
	var selectedAdminFItems = new Array();
	/*
	 * var msgCount='('+records.length+')'; $("#msgCnt").text(msgCount);
	 */
	strBrPrevililegesList = JSON.stringify(selectedAdminFItems);
	if ('S' === clientType) {
		var selectedNonReadOnlyItems = new Array();
		for (i = 0; i < objJson.length; i++) {
			if (undefined == objJson[i].readOnly || true != objJson[i].readOnly) {
				selectedNonReadOnlyItems.push(objJson[i]);
			}
		}
		strBrFeatureList = JSON.stringify(selectedNonReadOnlyItems);
	} else {
		strBrFeatureList = JSON.stringify(objJson);
	}
	popupBrFeaturesSelectedValue = 'Y';
}
function getSelectWidgetsPopup() {
	var selectFlag=$('#allWidgetsSelectedFlag').val();
	var widgets;
	if(!Ext.isEmpty(homeWidgetSelected)){
		widgets=homeWidgetSelected.split(",");
		isAdminWidgetsAllSelected = 'N';
	}else{
	if(!Ext.isEmpty(selectFlag)){
	isAdminWidgetsAllSelected=selectFlag;
	}
	else{
	isAdminWidgetsAllSelected = 'N';
	}
	}
	
	if(!Ext.isEmpty(objWidgetsSelectionPopup)){
		 objWidgetsSelectionPopup = Ext.create('GCP.view.WidgetSelectionPopup',
			{
				itemId : 'widgetSelectionPopup',
				fnCallback : setSelectedWidgetItems,
				profileId : adminFeatureProfileId,
				featureType : 'W',
				lastSelectedWidgets:widgets,
				module : '03',
				title : getLabel('widget', 'Widget'),
				columnName : getLabel('widgetName', 'Widget Name'),
				isAllSelected : isAdminWidgetsAllSelected
			});
		
			objWidgetsSelectionPopup.show();
	}
}


function getSelectActionLinkPopup() {
	selectedr=[];
	var selectFlag=$('#allLinksSelectedFlag').val();
	if(!Ext.isEmpty(selectFlag))
	isHomeActionLinksAllSelected=selectFlag;
	else
	isHomeActionLinksAllSelected = 'N';
	
	if(!Ext.isEmpty(objActionsSelectionPopup)){
		
		 objActionsSelectionPopup = Ext.create('GCP.view.WidgetSelectionPopup',
			{
				itemId : 'actionSelectionPopup',
				fnCallback : setSelectedActionItems,
				profileId : adminFeatureProfileId,
				featureType : 'L',
				module : '03',
				title : getLabel('actionlinks', 'Action Links'),
				columnName : getLabel('actionlinksName','Action Links Name'),
				isAllSelected : isHomeActionLinksAllSelected
				
			});
		objActionsSelectionPopup.show();
	}
}

function getSelectMessagePopup() {
	selectedr=[];
	if (null != objMessageSelectionPopup) {
		objMessageSelectionPopup.show();
	}
}

function getSelectAdminFeaturePopup() {
	var selectFlag=$('#allAdmFeaturesSelectedFlag').val();
	if(!Ext.isEmpty(selectFlag))
		isAdminOptionsAllSelected=selectFlag;
	else
		isAdminOptionsAllSelected = 'N';
	
	if(!Ext.isEmpty(objAdminFeaturePopup)){
		objAdminFeaturePopup = Ext.create('GCP.view.AdminFeaturePopup',
						{
							itemId : 'adminFeaturePopup',
							fnCallback : setSelectedAdmFeatureItems,
							profileId : adminFeatureProfileId,
							featureType : 'P',
							module : '03',
							title : getLabel('adminFeature', 'Admin Options'),
							isAllSelected : isAdminOptionsAllSelected 
						});
		objAdminFeaturePopup.show();
	}
}
function showAdminProfileSeek() {
	if (null != objAdminProfileSeek) {
		objAdminProfileSeek.show();
	}
}
function showBRProfileSeek() {
	if (null != objBRProfileSeek) {
		objBRProfileSeek.show();
	}
}

function getSelectBrWidgetsPopup() {
	selectedr=[];
	if (null != objBrWidgetsSelectionPopup) {
		objBrWidgetsSelectionPopup.show();
	}
}

function getSelectBrActionLinkPopup() {
	selectedr=[];
	if (null != objBrActionsSelectionPopup) {
		objBrActionsSelectionPopup.show();
	}
}


function getSelectBRFeatureIntraAccountsPopup() {
	if (null != objBrFeatureIntradayAccountsPopup) {
		objBrFeatureIntradayAccountsPopup.show();
	}
}

function getSelectBRFeaturePrevAccountsPopup() {
	if (null != objBrFeaturePrevdayAccountsPopup) {
		objBrFeaturePrevdayAccountsPopup.show();
	}
}

function setSelectedWidgetItems(records) {
	var selectedWidgetItems = "";
	if ('M' == clientType) {
		for ( var i = 0; i < records.length; i++) {
			var val = records[i];
			selectedWidgetItems = selectedWidgetItems + val;
			if (i < records.length - 1) {
				selectedWidgetItems = selectedWidgetItems + ',';
			}
		}
	} else {
		for ( var i = 0; i < records.length; i++) {
			var val = records[i];
			if(undefined !=val.readOnly || true !=val.readOnly)
			selectedWidgetItems = selectedWidgetItems + val;
			if (i < records.length - 1) {
				selectedWidgetItems = selectedWidgetItems + ',';
			}
		}
	}
	var widgetCount = '(' + records.length + ')';
	$("#widgetCnt").text(widgetCount);
	selectedWidgetList = selectedWidgetItems;
	popupWidgetsSelectedValue = 'Y';
}

function setSelectedActionItems(records) {
	var selectedActionItems = "";
	for (var i = 0; i < records.length; i++) {
		var val = records[i];
		selectedActionItems = selectedActionItems + val;
		if (i < records.length - 1) {
			selectedActionItems = selectedActionItems + ',';
		}
	}
	var actionCount='('+records.length+')';
	 $("#actionCnt").text(actionCount);
	selectedActionList = selectedActionItems;
	popupLinksSelectedValue = 'Y';
}

function setSelectedMessageItems(records) {
	var selectedMessageItems = "";
	for (var i = 0; i < records.length; i++) {
		var val = records[i];
		selectedMessageItems = selectedMessageItems + val;
		if (i < records.length - 1) {
			selectedMessageItems = selectedMessageItems + ',';
		}
	}
	var msgCount='('+records.length+')';
	 $("#msgCnt").text(msgCount);
	selectedMessageList = selectedMessageItems;
	allSelectedRecords=[];
	popupMessagessSelectedValue='Y';
}

function setSelectedAdmFeatureItems(records) {
	var selectedAdminFItems = new Array();
	var items = records.items;
	for (var i = 0; i < items.length; i++) {
		var val = items[i].data;
		var obj = {
			name : val.name,
			value : val.value,
			profileId : val.profileId,
			isAssigned : val.isAssigned,
			isAutoApproved : val.isAutoApproved

		};
		selectedAdminFItems.push(obj);

	}
	selectedAdminFeatureList = JSON.stringify(selectedAdminFItems);	
	popupAdmFeaturesSelectedValue ='Y';
}

function setSelectedBRIntraAccountItems(records) {
	var selectedWidgetItems = "";
	for (var i = 0; i < records.length; i++) {
		var val = records[i];
		selectedWidgetItems = selectedWidgetItems + val;
		if (i < records.length - 1) {
			selectedWidgetItems = selectedWidgetItems + ',';
		}
	}
	var intradayCnt='('+records.length+')';
	 $("#intradayCnt").text(intradayCnt);
	 selectedIntraDayAccountList = selectedWidgetItems;
	 popupIntraDayAcctSelectedValue = 'Y';
}

function setSelectedBRPrevAccountItems(records) {
	var selectedWidgetItems = "";
	for (var i = 0; i < records.length; i++) {
		var val = records[i];
		selectedWidgetItems = selectedWidgetItems + val;
		if (i < records.length - 1) {
			selectedWidgetItems = selectedWidgetItems + ',';
		}
	}
	var intradayCnt='('+records.length+')';
	 $("#previousdayCnt").text(intradayCnt);
	 selectedPrevDayAccountList = selectedWidgetItems;
	 popupPrevDayAcctSelectedValue = 'Y';
}

function showThemesProfileFilterPopup(service,dropdownId){
	if (null != objThemeProfileFilterPopup){
		objThemeProfileFilterPopup.setService(service);
		objThemeProfileFilterPopup.setDropdownId(dropdownId);
		objThemeProfileFilterPopup.setDropdownType('H');
		objThemeProfileFilterPopup.show();
	}
}

function showAlertsProfileFilterPopup(service,dropdownId,alertType){
	if (null != objAlertProfileFilterPopup){
		objAlertProfileFilterPopup.setService(service);
		objAlertProfileFilterPopup.setDropdownId(dropdownId);
		objAlertProfileFilterPopup.setDropdownType('A');
		objAlertProfileFilterPopup.setAlertType(alertType);
		objAlertProfileFilterPopup.show();
	}
}

function showReportsProfileFilterPopup(service,dropdownId){
	if (null != objReportProfileFilterPopup){
		objReportProfileFilterPopup.setService(service);
		objReportProfileFilterPopup.setDropdownId(dropdownId);
		objReportProfileFilterPopup.setDropdownType('R');
		objReportProfileFilterPopup.show();
	}
}

function showInterfacesProfileFilterPopup(service,dropdownId){
	if (null != objInterfaceProfileFilterPopup){
		objInterfaceProfileFilterPopup.setService(service);
		objInterfaceProfileFilterPopup.setDropdownId(dropdownId);
		objInterfaceProfileFilterPopup.setDropdownType('I');
		objInterfaceProfileFilterPopup.show();
	}
}

function showBillingProfileFilterPopup(service,dropdownId){
	if (null != objBillingProfileFilterPopup){
		objBillingProfileFilterPopup.setService(service);
		objBillingProfileFilterPopup.setDropdownId(dropdownId);
		objBillingProfileFilterPopup.setDropdownType('B');
		objBillingProfileFilterPopup.show();
	}	
}

function showTypeProfileFilterPopup(service,dropdownId){
		if (null != objTypeProfileFilterPopup){
		objTypeProfileFilterPopup.setService(service);
		objTypeProfileFilterPopup.setDropdownId(dropdownId);
		objTypeProfileFilterPopup.setDropdownType('T');
		objTypeProfileFilterPopup.show();
	}
}


function showSelectedFields(service, dropdownId, dropdownType, seachType, category1, category2, alertType){
	var strUrl = 'cpon/clientServiceSetup/filterProfile.json';
	strUrl = strUrl + '?&type='+seachType+'&category='+category1+'&subcategory='+category2+'&service='+service+'&dropdownType='+dropdownType;
	
	strUrl = strUrl + '&alertType='+alertType;
	var strRegex = /[?&]([^=#]+)=([^&#]*)/g, objParam = {}, arrMatches, strGeneratedUrl;
	while (arrMatches = strRegex.exec(strUrl)) {
				objParam[arrMatches[1]] = arrMatches[2];
	}
	strGeneratedUrl = strUrl.substring(0, strUrl
							.indexOf('?'));
	strUrl=strGeneratedUrl;		
	Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						params:objParam,
						success : function(response) {
							var data = Ext.decode(response.responseText);
							var combo = document.getElementById(dropdownId);
							combo.innerHTML="";
							var option = document.createElement("option");
								option.text = getLabel('select','Select');
								option.value = '';
								combo.appendChild(option);
							for(var i =0;i<data.length;i++)
							{
								var option = document.createElement("option");
								option.text = data[i].profile_name;
								option.value = data[i].profile_id;
								combo.appendChild(option);
							}
						},
						failure : function(response) {
							//console.log("Ajax Get data Call Failed");
						}

					});
}

function showFxProfileFilterPopup(service,dropdownId){
	if (null != objFxProfileFilterPopup){
		objFxProfileFilterPopup.setService(service);
		objFxProfileFilterPopup.setDropdownId(dropdownId);
		objFxProfileFilterPopup.setDropdownType('F');
		objFxProfileFilterPopup.show();
	}	
}