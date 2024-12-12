var featurePaySIMap = [];
function getSIPrivilegesData(strUrl, dataPrivilegeJson, dataJson, strModule) {
	var objData = null;
	$.ajax({
				url : strUrl,
				type : 'POST',
				data : dataPrivilegeJson,
				async : false,
				success : function(data) {
					var filteredPrivData = data;
					$.each(filteredPrivData, function(index, feature) {
								// using key as below due to multiple weights
								// for same
								// feature id
								var key = feature.featureId + "_"
										+ feature.featureWeight;

								var rightValue;
								var rmserial = feature.rmSerial;

								featurePaySIMap[key] = feature;

							});

					getSIGranularPrivilegesData(
							'services/userCategory/getAllGranularPrivileges.json',
							dataJson, strModule)
				}

			});

}
function getSIGranularPrivilegesData(strUrl, dataJson, strModule) {
	var objData = null;
	$.ajax({
				url : strUrl,
				type : 'POST',
				data : dataJson,
				async : false,
				success : function(data) {
					paintSIGranularPrivilegesPopup(strModule, data);
				}
			});

}
function createSIGranularPopupData() {
	if (payServiceEnable == true) {
		var strModule = '02'
		var dataPrivilegeJson = {
			module : strModule,
			categoryId : userCategory
		};

		var dataJson = {
			module : strModule,
			categoryId : userCategory,
			serviceType : 'SI'
		};
		getSIPrivilegesData('services/userCategory/previlige.json',
				dataPrivilegeJson, dataJson, strModule);
	}
}
function paintSIGranularPrivilegesPopup(strModule, granularData) {
	if ('02' === strModule) {
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
					"colName" : getLabel('lbl.paymentPackage',
							'Payment Package'),
					"colId" : "accountName",
					"colType" : "SubSectionHeader",
					"hidden" : false
				}, {
					"colId" : "viewFlag",
					"colName" : getLabel("view", "View"),
					"colType" : "SectionHeader",
					"hidden" : featurePaySIMap["SIS_15"] != undefined
							&& featurePaySIMap["SIS_15"].canView === 'Y'
							? false
							: true
				}, {
					"colId" : "editFlag",
					"colName" : getLabel("edit", "Edit"),
					"colType" : "SectionHeader",
					"hidden" : featurePaySIMap["SIS_15"] != undefined
							&& featurePaySIMap["SIS_15"].canEdit === 'Y'
							? false
							: true
				}, {
					"colId" : "approveFlag",
					"colName" : getLabel("delete", "Delete"),
					"colType" : "SectionHeader",
					"hidden" : featurePaySIMap["SIS_383"] != undefined
							&& featurePaySIMap["SIS_383"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "approveFlag",
					"colName" : getLabel("approve", "Approve"),
					"colType" : "SectionHeader",
					"hidden" : featurePaySIMap["SIS_15"] != undefined
							&& featurePaySIMap["SIS_15"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "approveFlag",
					"colName" : getLabel("detailApprove", "Detail Approve"),
					"colType" : "SectionHeader",
					"hidden" : featurePaySIMap["SIS_386"] != undefined
							&& featurePaySIMap["SIS_386"].canAuth == 'Y'
							? false
							: true
				}];
		if (granularData && granularData.length > 0)
			renderGranularPrivilegesPopup(columnModel, granularData,
					'granularSIDiv', getLabel('siGranularPrivilege',
							'Standing Instruction Granular Privileges'));
	}

}

function paintSIGranularPrivilegesPopupTable(granularData, privilegeData) {
	if (privilegeData) {
		populateSIFeatureFeatureMap(privilegeData);
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
					"colName" : getLabel('lbl.paymentPackage',
							'Payment Package'),
					"colId" : "packageName",
					"colType" : "SubSectionHeader",
					"hidden" : false
				}, {
					"colId" : "viewFlag",
					"colName" : getLabel("view", "View"),
					"colType" : "SectionHeader",
					"hidden" : featurePaySIMap["SIS_15"] != undefined
							&& featurePaySIMap["SIS_15"].canView === 'Y'
							? false
							: true
				}, {
					"colId" : "editFlag",
					"colName" : getLabel("edit", "Edit"),
					"colType" : "SectionHeader",
					"hidden" : featurePaySIMap["SIS_15"] != undefined
							&& featurePaySIMap["SIS_15"].canEdit === 'Y'
							? false
							: true
				}, {
					"colId" : "approveFlag",
					"colName" : getLabel("delete", "Delete"),
					"colType" : "SectionHeader",
					"hidden" : featurePaySIMap["SIS_383"] != undefined
							&& featurePaySIMap["SIS_383"].canEdit == 'Y'
							? false
							: true
				}, {
					"colId" : "approveFlag",
					"colName" : getLabel("approve", "Approve"),
					"colType" : "SectionHeader",
					"hidden" : featurePaySIMap["SIS_15"] != undefined
							&& featurePaySIMap["SIS_15"].canAuth == 'Y'
							? false
							: true
				}, {
					"colId" : "approveFlag",
					"colName" : getLabel("detailApprove", "Detail Approve"),
					"colType" : "SectionHeader",
					"hidden" : featurePaySIMap["SIS_386"] != undefined
							&& featurePaySIMap["SIS_386"].canAuth == 'Y'
							? false
							: true
				}];
		if (granularData && granularData.length > 0)
			renderGranularPrivilegesPopup(columnModel, granularData,
					'granularSIDiv', getLabel('siGranularPrivilege',
							'Standing Instruction Granular Privileges'));
	}
}

function populateSIFeatureFeatureMap(privilegeData) {
	if (privilegeData) {
		$.each(privilegeData, function(index, feature) {
					var key = feature.featureId + "_" + feature.featureWeight;
					var rightValue;
					var rmserial = feature.rmSerial;
					featurePayMap[key] = feature;
				});
	}
}