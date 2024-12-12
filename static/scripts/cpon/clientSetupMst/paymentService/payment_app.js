var objPaymentProfileSeek = null;
var objPayFeaturePopup = null;
var objProfileFilterPopup = null;
var objPayCompanyIdPopup = null;
var isPaymentOptionsAllSelected = null;
var objAlertProfileFilterPopup = null;
var objReportProfileFilterPopup = null;
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
			name : 'CPON',
			appFolder : 'static/scripts/cpon/clientSetupMst/paymentService/app',
			requires : ['CPON.view.PayFeaturePopup','CPON.view.CopyProfileSeek','CPON.view.ProfileFilterPopup','Ext.ux.gcp.FilterPopUpView'],
			launch : function() {
				objPaymentProfileSeek = Ext.create('CPON.view.CopyProfileSeek', {
					itemId : 'paymentProfileseek',
					title : getLabel('copypaymentprofile', 'Copy Payment Feature Profile'),
					strUrl : 'services/copyProfile/paymentProfileSeek.json',
					columnName : getLabel('pmtfeatureprfname', 'Payment Feature Profile Name'),
					actionUrl : 'doCopyPaymentProfile.form'
						});
				
				objWidgetsSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
						{
							fnCallback : setSelectedWidgetItems,
							title :  getLabel('widget', 'Widget'),
							labelId : 'widgetCnt',
							keyNode : 'value',
							itemId : 'widgetSelectionPopup',
							checkboxId:'chkAllWidgetsSelectedFlag',
							displayCount:true,
							profileId :adminFeatureProfileId,
							featureType:'W',
							responseNode :'filter',
							cfgModel : {
							     pageSize : 5,
								storeModel : {
									fields : ['name', 'value','isAssigned','readOnly'],
							proxyUrl : 'cpon/clientServiceSetup/cponFeatures',
							rootNode : 'd.filter',
							totalRowsNode : 'd.count'
							      },
							columnModel : [{
												colDesc : 'Widget Name',
												colId : 'name',
												colHeader : 'Widget Name',
												width : 330
											}]
							   },
							cfgShowFilter:true,
							userMode: viewmode,
							cfgFilterLabel:'Widgets',
							 cfgAutoCompleterUrl:'cponFeatures',
								cfgUrl:'cpon/clientServiceSetup/{0}',
								paramName:'filterName',
								dataNode:'name',
								rootNode : 'd.filter',
								autoCompleterExtraParam:
									[{
										key:'featureType',value:'W'
									},{
										key:'module',value: '02'
									},{
										key:'profileId',value: adminFeatureProfileId
									},{
										key:'id',value: encodeURIComponent(parentkey)
									}],
							module : '02',
							hiddenValueField : 'selectedWidgets',
							hiddenValuePopUpField :'popupWidgetsSelectedFlag'
						});
			
			
				objActionsSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
						{
							fnCallback : setSelectedActionItems,
							title : getLabel('actionlinks', 'Action Links'),
							labelId : 'widgetCnt',
							keyNode : 'value',
							itemId : 'actionSelectionPopup',
							checkboxId:'chkAllLinksSelectedFlag',
							displayCount:true,
							profileId :adminFeatureProfileId,
							featureType:'L',
							responseNode :'filter',
							cfgModel : {
							     pageSize : 5,
								storeModel : {
									fields : ['name', 'value','isAssigned','readOnly'],
							proxyUrl : 'cpon/clientServiceSetup/cponFeatures',
							rootNode : 'd.filter',
							totalRowsNode : 'd.count'
							      },
							columnModel : [{
												colDesc : 'Widget Name',
												colId : 'name',
												colHeader : 'Message Name',
												width : 330
											}]
							   },
							cfgShowFilter:true,
							userMode: viewmode,
							cfgFilterLabel:'Action Links',
							 cfgAutoCompleterUrl:'cponFeatures',
								cfgUrl:'cpon/clientServiceSetup/{0}',
								paramName:'filterName',
								dataNode:'name',
								rootNode : 'd.filter',
								autoCompleterExtraParam:
									[{
										key:'featureType',value:'L'
									},{
										key:'module',value: '02'
									},{
										key:'profileId',value: adminFeatureProfileId
									},{
										key:'id',value: encodeURIComponent(parentkey)
									}],
							module : '02',
							hiddenValueField : 'selectedWidgets',
							hiddenValuePopUpField :'popupWidgetsSelectedFlag'
						});
			
				
				objFXProfileFilterPopup = Ext.create('CPON.view.ProfileFilterPopup',
						{
					fnCallback : showSelectedFields
				});
				objWorkflowProfileFilterPopup = Ext.create('CPON.view.ProfileFilterPopup',
						{
					fnCallback : showSelectedFields
				});
				objAlertProfileFilterPopup = Ext.create('CPON.view.ProfileFilterPopup',
						{
					fnCallback : showSelectedFields
				});
				objReportProfileFilterPopup = Ext.create('CPON.view.ProfileFilterPopup',
						{
					fnCallback : showSelectedFields
				});
				objBillingProfileFilterPopup = Ext.create('CPON.view.ProfileFilterPopup',
						{
					fnCallback : showSelectedFields
				});
				
				objSystemReceiverProfileFilterPopup = Ext.create('CPON.view.ProfileFilterPopup',
						{
					fnCallback : showSelectedFields
				});
				
			}
		});

function showPaymentProfileSeek() {
	if (null != objPaymentProfileSeek) {
		objPaymentProfileSeek.show();
	}
}

function getPaymentFeaturePopup() {
	var selectFlag = $('#allPaymentFeaturesSelectedFlag').val();
	if (!Ext.isEmpty(selectFlag))
		isPaymentOptionsAllSelected = selectFlag;
	else
		isPaymentOptionsAllSelected = 'N';
	if (Ext.isEmpty(objPayFeaturePopup)) {
		objPayFeaturePopup = Ext.create('CPON.view.PayFeaturePopup', {
			itemId : 'payFeaturePopup',
			fnCallback : setSelectedPayFeatureItems,
			profileId : adminFeatureProfileId,
			featureType : 'P',
			module : '02',
			title : getLabel('adminFeature', 'Payment Options'),
			isAllSelected : isPaymentOptionsAllSelected
		});
		if ('Y' === isPaymentOptionsAllSelected) {
			var brCheckBoxes = objPayFeaturePopup.query('checkboxgroup');
			for ( var i = 0; i < brCheckBoxes.length; i++) {
				var cBox = brCheckBoxes[i].query('checkbox');
				for ( var j = 0; j < cBox.length; j++) {
					cBox[j].setValue(true);
				}
			}
		}
		else if('N' === isPaymentOptionsAllSelected && 
		'Y'===allOptionsSelectionInModel)
		{
			var brCheckBoxes = objPayFeaturePopup.query('checkboxgroup');
			for ( var i = 0; i < brCheckBoxes.length; i++) {
				var cBox = brCheckBoxes[i].query('checkbox');
				for ( var j = 0; j < cBox.length; j++) {
					cBox[j].setValue(false);
				}
			}
		}
		objPayFeaturePopup.show();
	} else {
		objPayFeaturePopup = Ext.create('CPON.view.PayFeaturePopup', {
			itemId : 'payFeaturePopup',
			fnCallback : setSelectedPayFeatureItems,
			profileId : adminFeatureProfileId,
			featureType : 'P',
			module : '02',
			title : getLabel('adminFeature', 'Payment Options'),
			isAllSelected : isPaymentOptionsAllSelected
		});
		objPayFeaturePopup.isAllSelected = isPaymentOptionsAllSelected;
		if ('Y' === isPaymentOptionsAllSelected) {
			var brCheckBoxes = objPayFeaturePopup.query('checkboxgroup');
			for ( var i = 0; i < brCheckBoxes.length; i++) {
				var cBox = brCheckBoxes[i].query('checkbox');
				for ( var j = 0; j < cBox.length; j++) {
					cBox[j].setValue(true);
				}
			}
		}
		else if('N' === isPaymentOptionsAllSelected && 
		'Y'===allOptionsSelectionInModel)
		{
			var brCheckBoxes = objPayFeaturePopup.query('checkboxgroup');
			for ( var i = 0; i < brCheckBoxes.length; i++) {
				var cBox = brCheckBoxes[i].query('checkbox');
				for ( var j = 0; j < cBox.length; j++) {
					cBox[j].setValue(false);
				}
			}
		}
		objPayFeaturePopup.show();
	}
}
function getPayCompanyIdPopup() {
	objPayCompanyIdPopup = Ext.create('CPON.view.PayCompanyIDPopup');
	if (null != objPayCompanyIdPopup) {
		objPayCompanyIdPopup.show();
	}
}
function setSelectedPayFeatureItems(records, objJson) {
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
	/*var msgCount='('+records.length+')';
	 $("#featureCnt").text(msgCount);*/
	strPaymentPrevililegesList = JSON.stringify(selectedAdminFItems);	
	strPaymentFeatureList = JSON.stringify(objJson);
	allpaySelectedrecords = [];
	popupPayFeaturesSelectedValue ='Y';
}

function getPaySelectWidgetsPopup() {
	selectedr=[];
	if (null != objWidgetsSelectionPopup) {	
		objWidgetsSelectionPopup.show();
	}
}

function getPaySelectActionLinkPopup() {
	selectedr=[];
	if (null != objActionsSelectionPopup) {
		objActionsSelectionPopup.show();
	}
}


function setSelectedWidgetItems(records) {
	var selectedWidgetItems = "";
	for (var i = 0; i < records.length; i++) {
		var val = records[i];
		selectedWidgetItems = selectedWidgetItems + val;
		if (i < records.length - 1) {
			selectedWidgetItems = selectedWidgetItems + ',';
		}
	}
	var widgetCount='('+records.length+')';
	 $("#widgetCnt").text(widgetCount);
	selectedWidgetList = selectedWidgetItems;
	allpaySelectedrecords = [];
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
	allpaySelectedrecords = [];
	popupLinksSelectedValue = 'Y';
}

function showPayFcyRateProfileFilterPopup(service,dropdownId){
	if (null != objFXProfileFilterPopup){
		objFXProfileFilterPopup.setService(service);
		objFXProfileFilterPopup.setDropdownId(dropdownId);
		objFXProfileFilterPopup.setDropdownType('F');
		objFXProfileFilterPopup.show();
	}
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
	var strUrl = 'services/clientServiceSetup/filterProfile.json';
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
