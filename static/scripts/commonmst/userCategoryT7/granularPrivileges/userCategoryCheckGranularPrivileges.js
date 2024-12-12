var featureCheckMap = [];
function getChecksPrivilegesData(strUrl, dataPrivilegeJson, dataJson, strModule) {
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
								featureCheckMap[key] = feature;

							});

					getChecksGranularPrivilegesData(
							'services/userCategory/getAllGranularPrivileges.json',
							dataJson, strModule)
				}

			});

}
function getChecksGranularPrivilegesData(strUrl, dataJson, strModule) {
	var objData = null;
	$.ajax({
				url : strUrl,
				type : 'POST',
				data : dataJson,
				async : false,
				success : function(data) {
					paintChecksGranularPrivilegesPopup(strModule, data);
				}
			});

}
function createChecksGranularPopupData() {
	if (checkServiceEnable == true) {
		var strModule = '14'
		var dataPrivilegeJson = {
			module : strModule,
			categoryId : userCategory
		};

		var dataJson = {
			module : strModule,
			categoryId : userCategory,
			serviceType : 'CM'
		};
		getChecksPrivilegesData('services/userCategory/previlige.json',
				dataPrivilegeJson, dataJson, strModule);
	}
}
function paintChecksGranularPrivilegesPopup(strModule, granularData) {
	if ('14' === strModule) {
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
					"colId" : "inquiryFlag",
					"colName" : getLabel("viewInquiry", "View Inquiry"),
					"colType" : "SectionHeader",
					"hidden" : featureCheckMap["CHKINQ"] != undefined
							&& featureCheckMap["CHKINQ"].canView === 'Y'
							? false
							: true
				}, {
					"colId" : "createInquiryFlag",
					"colName" : getLabel("createInquiry", "Create Inquiry"),
					"colType" : "SectionHeader",
					"hidden" : featureCheckMap["CHKINQ"] != undefined
							&& featureCheckMap["CHKINQ"].canEdit === 'Y'
							? false
							: true
				}, {
					"colId" : "cancelStoppayFlag",
					"colName" : getLabel("viewCancelStopPay",
							"View Cancel StopPay"),
					"colType" : "SectionHeader",
					"hidden" : featureCheckMap["CHKCSTP"] != undefined
							&& featureCheckMap["CHKCSTP"].canView == 'Y'
							? false
							: true
				}, {
					"colId" : "createCancelStoppayFlag",
					"colName" : getLabel("createCancelStopPay",
							"Create Cancel StopPay"),
					"colType" : "SectionHeader",
					"hidden" : featureCheckMap["CHKCSTP"] != undefined
							&& featureCheckMap["CHKCSTP"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "cancelStoppayApproveFlag",
					"colName" : getLabel("cancelApprove", "Cancel Approve"),
					"colType" : "SectionHeader",
					"hidden" : featureCheckMap["CHKCSTP"] != undefined
							&& featureCheckMap["CHKCSTP"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "stoppayFlag",
					"colName" : getLabel("viewStopPay", "View StopPay"),
					"colType" : "SectionHeader",
					"hidden" : featureCheckMap["CHKSTP"] != undefined
							&& featureCheckMap["CHKSTP"].canView == 'Y'
							? false
							: true
				}, {
					"colId" : "createStoppayFlag",
					"colName" : getLabel("createStopPay", "Create StopPay"),
					"colType" : "SectionHeader",
					"hidden" : featureCheckMap["CHKSTP"] != undefined
							&& featureCheckMap["CHKSTP"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "stoppayApproveFlag",
					"colName" : getLabel("stopPayApprove", "StopPay Approve"),
					"colType" : "SectionHeader",
					"hidden" : featureCheckMap["CHKSTP"] != undefined
							&& featureCheckMap["CHKSTP"].canAuth == 'Y'
							? false
							: true
				}];
		if (granularData && granularData.length > 0)
			renderCommonGranularPrivilegesPopup(columnModel, granularData,
					'granularChecksDiv',getLabel('checkManagementGranularPrivilege','Check Management Granular Privileges'));
	}

}
function paintChecksGranularPrivilegesPopupTable(granularData,privilegeData) {
	if (privilegeData) {
		populateCheckManagementFeatureMap(privilegeData);
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
					"colId" : "inquiryFlag",
					"colName" : getLabel("viewInquiry", "View Inquiry"),
					"colType" : "SectionHeader",
					"hidden" : featureCheckMap["CHKINQ"] != undefined
							&& featureCheckMap["CHKINQ"].canView === 'Y'
							? false
							: true
				}, {
					"colId" : "createInquiryFlag",
					"colName" : getLabel("createInquiry", "Create Inquiry"),
					"colType" : "SectionHeader",
					"hidden" : featureCheckMap["CHKINQ"] != undefined
							&& featureCheckMap["CHKINQ"].canEdit === 'Y'
							? false
							: true
				}, {
					"colId" : "cancelStoppayFlag",
					"colName" : getLabel("viewCancelStopPay",
							"View Cancel StopPay"),
					"colType" : "SectionHeader",
					"hidden" : featureCheckMap["CHKCSTP"] != undefined
							&& featureCheckMap["CHKCSTP"].canView == 'Y'
							? false
							: true
				}, {
					"colId" : "createCancelStoppayFlag",
					"colName" : getLabel("createCancelStopPay",
							"Create Cancel StopPay"),
					"colType" : "SectionHeader",
					"hidden" : featureCheckMap["CHKCSTP"] != undefined
							&& featureCheckMap["CHKCSTP"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "cancelStoppayApproveFlag",
					"colName" : getLabel("cancelApprove", "Cancel Approve"),
					"colType" : "SectionHeader",
					"hidden" : featureCheckMap["CHKCSTP"] != undefined
							&& featureCheckMap["CHKCSTP"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "stoppayFlag",
					"colName" : getLabel("viewStopPay", "View StopPay"),
					"colType" : "SectionHeader",
					"hidden" : featureCheckMap["CHKSTP"] != undefined
							&& featureCheckMap["CHKSTP"].canView == 'Y'
							? false
							: true
				}, {
					"colId" : "createStoppayFlag",
					"colName" : getLabel("createStopPay", "Create StopPay"),
					"colType" : "SectionHeader",
					"hidden" : featureCheckMap["CHKSTP"] != undefined
							&& featureCheckMap["CHKSTP"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "stoppayApproveFlag",
					"colName" : getLabel("stopPayApprove", "StopPay Approve"),
					"colType" : "SectionHeader",
					"hidden" : featureCheckMap["CHKSTP"] != undefined
							&& featureCheckMap["CHKSTP"].canAuth == 'Y'
							? false
							: true
				}];
		if (granularData && granularData.length > 0)
			renderCommonGranularPrivilegesPopup(columnModel, granularData,
					'granularChecksDiv',getLabel('checkManagementGranularPrivilege','Check Management Granular Privileges'));
	}

}

function populateCheckManagementFeatureMap(privilegeData) {
	if (privilegeData) {
		$.each(privilegeData, function(index, feature) {
					var key = feature.featureId;
					var rightValue;
					var rmserial = feature.rmSerial;
					featureCheckMap[key] = feature;

				});
	}
}