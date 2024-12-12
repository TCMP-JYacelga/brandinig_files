var objWidgetsSelectionPopup = null;
var objActionsSelectionPopup = null;
var objWorkflowProfileFilterPopup = null;
var objReportProfileFilterPopup = null;
var objAlertProfileFilterPopup = null;
var objBillingProfileFilterPopup = null;
var objSystemReceiverProfileFilterPopup = null;

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
			requires : ['GCP.view.WidgetSelectionPopup'],
			launch : function() {
				objWidgetsSelectionPopup = Ext.create(
						'GCP.view.WidgetSelectionPopup', {
							itemId : 'widgetSelectionPopup',
							fnCallback : setSelectedWidgetItems,
							profileId : payProfileFeatureId,
							featureType : 'W',
							module : '02',
							title : getLabel('widget', 'Widget'),
							columnName : getLabel('widgetName', 'Widget Name')
						});
				objActionsSelectionPopup = Ext.create(
						'GCP.view.WidgetSelectionPopup', {
							itemId : 'widgetSelectionPopup',
							fnCallback : setSelectedActionItems,
							profileId : payProfileFeatureId,
							featureType : 'L',
							module : '02',
							title : getLabel('actionlinks', 'Action Links'),
							columnName : getLabel('actionlinksName',
									'Action Links Name')
						});
				objWorkflowProfileFilterPopup = Ext.create('GCP.view.ProfileFilterPopup',
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
				objBillingProfileFilterPopup = Ext.create('GCP.view.ProfileFilterPopup',
						{
					fnCallback : showSelectedFields
				});
				objSystemReceiverProfileFilterPopup = Ext.create('GCP.view.ProfileFilterPopup',
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

function setSelectedWidgetItems(records) {
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

function showPayWorkflowProfileFilterPopup(service,dropdownId){
	if (null != objWorkflowProfileFilterPopup){
		objWorkflowProfileFilterPopup.setService(service);
		objWorkflowProfileFilterPopup.setDropdownId(dropdownId);
		objWorkflowProfileFilterPopup.setDropdownType('W');
		objWorkflowProfileFilterPopup.show();
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

function showAlertsProfileFilterPopup(service,dropdownId,alertType){
	if (null != objAlertProfileFilterPopup){
		objAlertProfileFilterPopup.setService(service);
		objAlertProfileFilterPopup.setDropdownId(dropdownId);
		objAlertProfileFilterPopup.setDropdownType('A');
		objAlertProfileFilterPopup.setAlertType(alertType);
		objAlertProfileFilterPopup.show();
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

function showSystemReceiverProfileFilterPopup(service,dropdownId){
	if (null != objSystemReceiverProfileFilterPopup){
		objSystemReceiverProfileFilterPopup.setService(service);
		objSystemReceiverProfileFilterPopup.setDropdownId(dropdownId);
		objSystemReceiverProfileFilterPopup.setDropdownType('S');
		objSystemReceiverProfileFilterPopup.show();
	}	
}

function showSelectedFields(service, dropdownId, dropdownType, seachType, category1, category2, alertType){
	var strUrl = 'services/payFeatureProfileMst/filterProfile.json';
	strUrl = strUrl + '?&type='+seachType+'&category='+category1+'&subcategory='+category2+'&service='+service+'&dropdownType='+dropdownType;
	strUrl = strUrl + '&alertType='+alertType;
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
