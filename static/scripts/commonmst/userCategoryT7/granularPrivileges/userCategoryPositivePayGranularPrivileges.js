var featurePositivePayMap = [];
function getPositivePayPrivilegesData(strUrl, dataPrivilegeJson, dataJson,
		strModule) {
	var objData = null;
	$.ajax({
				url : strUrl,
				type : 'POST',
				data : dataPrivilegeJson,
				async : false,
				success : function(data) {
					var filteredPrivData = data;
					$.each(filteredPrivData, function(index, feature) {
								var key = feature.featureId;

								var rightValue;
								var rmserial = feature.rmSerial;

								featurePositivePayMap[key] = feature;

							});

					getPositivePayGranularPrivilegesData(
							'services/userCategory/getAllGranularPrivileges.json',
							dataJson, strModule)
				}

			});

}
function getPositivePayGranularPrivilegesData(strUrl, dataJson, strModule) {
	var objData = null;
	$.ajax({
				url : strUrl,
				type : 'POST',
				data : dataJson,
				async : false,
				success : function(data) {
					paintPositivePayGranularPrivilegesPopup(strModule, data);
				}
			});

}
function createPositivePayGranularPopupData() {
	if (positivePayServiceEnable == true) {
		var strModule = '13'
		var dataPrivilegeJson = {
			module : strModule,
			categoryId : userCategory
		};

		var dataJson = {
			module : strModule,
			categoryId : userCategory,
			serviceType : 'PP'
		};
		getPositivePayPrivilegesData('services/userCategory/previlige.json',
				dataPrivilegeJson, dataJson, strModule);
	}
}
function paintPositivePayGranularPrivilegesPopup(strModule, granularData) {
	if ('13' === strModule) {
		var columnModel = [{
					"feature_code" : "none",
					"colId" : "type",
					"colName" : getLabel('lbl.type', "Type"),
					"colType" : "MainSectionHeader",
					"hidden" : false
				}, {
					"colName" : "Account",
					"colId" : "accountNo",
					"colType" : "SubSectionHeader",
					"hidden" : false
				}, {
					"colName" : getLabel('accountName', 'Account Name'),
					"colId" : "accountName",
					"colType" : "SubSectionHeader",
					"hidden" : false
				}, {
					"colId" : "editIssueFlag",
					"colName" : getLabel("editIssue", "Edit Issue"),
					"colType" : "SectionHeader",
					"hidden" : featurePositivePayMap["ISSNC"] != undefined
							&& featurePositivePayMap["ISSNC"].canView === 'Y'
							? false
							: true
				}, {
					"colId" : "viewIssueFlag",
					"colName" : getLabel("viewIssue", "View Issue"),
					"colType" : "SectionHeader",
					"hidden" : featurePositivePayMap["ISSNC"] != undefined
							&& featurePositivePayMap["ISSNC"].canEdit === 'Y'
							? false
							: true
				}, {
					"colId" : "approveIssueFlag",
					"colName" : getLabel("approveIssue", "Approve Issue"),
					"colType" : "SectionHeader",
					"hidden" : featurePositivePayMap["ISSNC"] != undefined
							&& featurePositivePayMap["ISSNC"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "viewExceptionFlag",
					"colName" : getLabel("viewException", "View Exception"),
					"colType" : "SectionHeader",
					"hidden" : featurePositivePayMap["EXDE"] != undefined
							&& featurePositivePayMap["EXDE"].canView == 'Y'
							? false
							: true
				}, {
					"colId" : "createDecisionFlag",
					"colName" : getLabel("createDecision", "Create Decision"),
					"colType" : "SectionHeader",
					"hidden" : featurePositivePayMap["EXDE"] != undefined
							&& featurePositivePayMap["EXDE"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "approveDecisionFlag",
					"colName" : getLabel("approveDecision", "Approve Decision"),
					"colType" : "SectionHeader",
					"hidden" : featurePositivePayMap["EXDE"] != undefined
							&& featurePositivePayMap["EXDE"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "viewPassthruFlag",
					"colName" : getLabel("viewPassthru", "View Passthru"),
					"colType" : "SectionHeader",
					"hidden" : featurePositivePayMap["PPPT"] != undefined
							&& featurePositivePayMap["PPPT"].canView == 'Y'
							? false
							: true
				}, {
					"colId" : "createPassthruFlag",
					"colName" : getLabel("createPassthru", "Create Passthru"),
					"colType" : "SectionHeader",
					"hidden" : featurePositivePayMap["PPPT"] != undefined
							&& featurePositivePayMap["PPPT"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "approvePassthruFlag",
					"colName" : getLabel("approvePassthru", "Approve Passthru"),
					"colType" : "SectionHeader",
					"hidden" : featurePositivePayMap["PPPT"] != undefined
							&& featurePositivePayMap["PPPT"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "viewCheckImageFlag",
					"colName" : getLabel("viewCheckImage", "View Check Image"),
					"colType" : "SectionHeader",
					"hidden" : featurePositivePayMap["IMPC"] != undefined
							&& featurePositivePayMap["IMPC"].canView == 'Y'
							? false
							: true
				}];
		if (granularData && granularData.length > 0)
			renderCommonGranularPrivilegesPopup(columnModel, granularData,
					'granularPositivePayDiv', getLabel('positivePayGranularPrivileges','Positive Pay Granular Privileges'));
	}

}
function paintPositivePayGranularPrivilegesPopupTable( granularData,privilegeData) {
	if (privilegeData) {
		 populatePositivePayFeatureMap(privilegeData);
		var columnModel = [{
					"feature_code" : "none",
					"colId" : "type",
					"colName" : getLabel('lbl.type', "Type"),
					"colType" : "MainSectionHeader",
					"hidden" : false
				}, {
					"colName" : "Account",
					"colId" : "accountNo",
					"colType" : "SubSectionHeader",
					"hidden" : false
				}, {
					"colName" : getLabel('accountName', 'Account Name'),
					"colId" : "accountName",
					"colType" : "SubSectionHeader",
					"hidden" : false
				}, {
					"colId" : "editIssueFlag",
					"colName" : getLabel("editIssue", "Edit Issue"),
					"colType" : "SectionHeader",
					"hidden" : featurePositivePayMap["ISSNC"] != undefined
							&& featurePositivePayMap["ISSNC"].canView === 'Y'
							? false
							: true
				}, {
					"colId" : "viewIssueFlag",
					"colName" : getLabel("viewIssue", "View Issue"),
					"colType" : "SectionHeader",
					"hidden" : featurePositivePayMap["ISSNC"] != undefined
							&& featurePositivePayMap["ISSNC"].canEdit === 'Y'
							? false
							: true
				}, {
					"colId" : "approveIssueFlag",
					"colName" : getLabel("approveIssue", "Approve Issue"),
					"colType" : "SectionHeader",
					"hidden" : featurePositivePayMap["ISSNC"] != undefined
							&& featurePositivePayMap["ISSNC"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "viewExceptionFlag",
					"colName" : getLabel("viewException", "View Exception"),
					"colType" : "SectionHeader",
					"hidden" : featurePositivePayMap["EXDE"] != undefined
							&& featurePositivePayMap["EXDE"].canView == 'Y'
							? false
							: true
				}, {
					"colId" : "createDecisionFlag",
					"colName" : getLabel("createDecision", "Create Decision"),
					"colType" : "SectionHeader",
					"hidden" : featurePositivePayMap["EXDE"] != undefined
							&& featurePositivePayMap["EXDE"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "approveDecisionFlag",
					"colName" : getLabel("approveDecision", "Approve Decision"),
					"colType" : "SectionHeader",
					"hidden" : featurePositivePayMap["EXDE"] != undefined
							&& featurePositivePayMap["EXDE"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "viewPassthruFlag",
					"colName" : getLabel("viewPassthru", "View Passthru"),
					"colType" : "SectionHeader",
					"hidden" : featurePositivePayMap["PPPT"] != undefined
							&& featurePositivePayMap["PPPT"].canView == 'Y'
							? false
							: true
				}, {
					"colId" : "createPassthruFlag",
					"colName" : getLabel("createPassthru", "Create Passthru"),
					"colType" : "SectionHeader",
					"hidden" : featurePositivePayMap["PPPT"] != undefined
							&& featurePositivePayMap["PPPT"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "approvePassthruFlag",
					"colName" : getLabel("approvePassthru", "Approve Passthru"),
					"colType" : "SectionHeader",
					"hidden" : featurePositivePayMap["PPPT"] != undefined
							&& featurePositivePayMap["PPPT"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "viewCheckImageFlag",
					"colName" : getLabel("viewCheckImage", "View Check Image"),
					"colType" : "SectionHeader",
					"hidden" : featurePositivePayMap["IMPC"] != undefined
							&& featurePositivePayMap["IMPC"].canView == 'Y'
							? false
							: true
				}];
		if (granularData && granularData.length > 0)
			renderCommonGranularPrivilegesPopup(columnModel, granularData,
					'granularPositivePayDiv', getLabel('positivePayGranularPrivileges','Positive Pay Granular Privileges'));
	}

}
function populatePositivePayFeatureMap(privilegeData) {
	if (privilegeData) {
		$.each(privilegeData, function(index, feature) {
					var key = feature.featureId;
					var rightValue;
					var rmserial = feature.rmSerial;
					featurePositivePayMap[key] = feature;

				});
	}
}