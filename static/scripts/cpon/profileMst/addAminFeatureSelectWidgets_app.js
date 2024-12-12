var objWidgetsSelectionPopup = null;
var objActionsSelectionPopup = null;
var objMessageSelectionPopup = null;
var objAdminFeaturePopup = null;
var objReportProfileFilterPopup = null;
var objAlertProfileFilterPopup = null;
var objInterfaceProfileFilterPopup = null;
var objBillingProfileFilterPopup = null;
var objFxProfileFilterPopup = null;
Ext.Loader.setConfig({
			enabled : true,
			setPath : {
				'Ext' : 'static/js/extjs4.2.1/src',
				'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
			}
		});
Ext.application({
			name : 'GCP',
			appFolder : 'static/scripts/cpon/profileMst/app',
			// appFolder : 'app',
			requires : ['GCP.view.WidgetSelectionPopup',
					'GCP.view.AdminFeaturePopup'],
			launch : function() {
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
							columnName : getLabel('actionlinksName',
									'Action Links Name')
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
							title : getLabel('adminFeature', 'Admin Feature')
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
				objFxProfileFilterPopup = Ext.create('GCP.view.ProfileFilterPopup',
						{
					fnCallback : showSelectedFields
				});			
				
			}
		});

function getSelectWidgetsPopup() {
	if (null != objWidgetsSelectionPopup) {
		objWidgetsSelectionPopup.show();
	}
}

function getSelectActionLinkPopup() {
	if (null != objActionsSelectionPopup) {
		objActionsSelectionPopup.show();
	}
}

function getSelectMessagePopup() {
	if (null != objMessageSelectionPopup) {
		objMessageSelectionPopup.show();
	}
}

function getSelectAdminFeaturePopup() {
	if (null != objAdminFeaturePopup) {
		objAdminFeaturePopup.show();
	}
}

function setSelectedWidgetItems(records,totalCount) {
	var selectedWidgetItems = "";
	for (var i = 0; i < records.length; i++) {
		var val = records[i].data.value;
		selectedWidgetItems = selectedWidgetItems + val;
		if (i < records.length - 1) {
			selectedWidgetItems = selectedWidgetItems + ',';
		}
	}
	var widgetCount='('+records.length+')';
	 $("#widgetCnt").text(widgetCount);
	 if(widgetCount != totalCount)
	 {
	 	//TODO: FIX this issue.
		 //$('#chkAllWidgetsSelectedFlag').
	 }
	selectedWidgetList = selectedWidgetItems;
	popupWidgetsSelectedFlag = 'Y';
}

function setSelectedActionItems(records) {
	var selectedActionItems = "";
	for (var i = 0; i < records.length; i++) {
		var val = records[i].data.value;
		selectedActionItems = selectedActionItems + val;
		if (i < records.length - 1) {
			selectedActionItems = selectedActionItems + ',';
		}
	}
	var actionCount='('+records.length+')';
	 $("#actionCnt").text(actionCount);
	selectedActionList = selectedActionItems;
	popupLinksSelectedFlag = 'Y';
}

function setSelectedMessageItems(records) {
	var selectedMessageItems = "";
	for (var i = 0; i < records.length; i++) {
		var val = records[i].data.value;
		selectedMessageItems = selectedMessageItems + val;
		if (i < records.length - 1) {
			selectedMessageItems = selectedMessageItems + ',';
		}
	}
	var msgCount='('+records.length+')';
	 $("#msgCnt").text(msgCount);
	selectedMessageList = selectedMessageItems;
	popupMessagessSelectedFlag = 'Y';
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
	popupAdmFeaturesSelectedFlag = 'Y';
}

function showAlertsProfileFilterPopup(service,dropdownId){
	if (null != objAlertProfileFilterPopup){
		objAlertProfileFilterPopup.setService(service);
		objAlertProfileFilterPopup.setDropdownId(dropdownId);
		objAlertProfileFilterPopup.setDropdownType('A');
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

function showFxProfileFilterPopup(service,dropdownId){
	if (null != objFxProfileFilterPopup){
		objFxProfileFilterPopup.setService(service);
		objFxProfileFilterPopup.setDropdownId(dropdownId);
		objFxProfileFilterPopup.setDropdownType('F');
		objFxProfileFilterPopup.show();
	}	
}

function showSelectedFields(service, dropdownId, dropdownType, seachType, category1, category2){
	var strUrl = 'services/adminFeatureProfileMst/filterProfile.json';
	strUrl = strUrl + '?&type='+seachType+'&category='+category1+'&subcategory='+category2+'&service='+service+'&dropdownType='+dropdownType;
	Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
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
						}
					});
}
