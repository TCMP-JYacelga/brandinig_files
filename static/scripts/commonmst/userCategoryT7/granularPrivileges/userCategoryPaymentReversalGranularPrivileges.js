var featurePayReversalMap = [];
function getReversalPrivilegesData(strUrl, dataPrivilegeJson, dataJson,
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
								// using key as below due to multiple weights
								// for same
								// feature id
								var key = feature.featureId;

								var rightValue;
								var rmserial = feature.rmSerial;

								featurePayReversalMap[key] = feature;

							});

					getReversalGranularPrivilegesData(
							'services/userCategory/getAllGranularPrivileges.json',
							dataJson, strModule)
				}

			});

}
function getReversalGranularPrivilegesData(strUrl, dataJson, strModule) {
	var objData = null;
	$.ajax({
				url : strUrl,
				type : 'POST',
				data : dataJson,
				async : false,
				success : function(data) {
					paintReversalGranularPrivilegesPopup(strModule, data);
				}
			});

}
function createReversalGranularPopupData() {
	if (payServiceEnable == true) {
		var strModule = '02'
		var dataPrivilegeJson = {
			module : strModule,
			categoryId : userCategory
		};

		var dataJson = {
			module : strModule,
			categoryId : userCategory,
			serviceType : 'RV'
		};
		getReversalPrivilegesData('services/userCategory/previlige.json',
				dataPrivilegeJson, dataJson, strModule);
	}
}
function paintReversalGranularPrivilegesPopup(strModule, granularData) {
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
					"colId" : "viewFlag",
					"colName" : getLabel("view", "View"),
					"colType" : "SectionHeader",
					"hidden" : featurePayReversalMap["RVAL"] != undefined
							&& featurePayReversalMap["RVAL"].canView === 'Y'
							? false
							: true
				}, {
					"colId" : "editFlag",
					"colName" : getLabel("edit", "Edit"),
					"colType" : "SectionHeader",
					"hidden" : featurePayReversalMap["RVAL"] != undefined
							&& featurePayReversalMap["RVAL"].canEdit === 'Y'
							? false
							: true
				}, {
					"colId" : "approveFlag",
					"colName" : getLabel("approve", "Approve"),
					"colType" : "SectionHeader",
					"hidden" : featurePayReversalMap["RVAL"] != undefined
							&& featurePayReversalMap["RVAL"].canAuth == 'Y'
							? false
							: true
				}];
		if (granularData && granularData.length > 0)
			renderCommonGranularPrivilegesPopup(columnModel, granularData,
					'granularReversalDiv', getLabel(
							'reversalGranularPrivilege',
							'Reversal Granular Privileges'));
	}
}
function paintReversalGranularPrivilegesPopupTable(granularData, privilegeData) {
	if (privilegeData) {
		populateRevFeatureFeatureMap(privilegeData);
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
					"colId" : "viewFlag",
					"colName" : getLabel("view", "View"),
					"colType" : "SectionHeader",
					"hidden" : featurePayReversalMap["RVAL"] != undefined
							&& featurePayReversalMap["RVAL"].canView === 'Y'
							? false
							: true
				}, {
					"colId" : "editFlag",
					"colName" : getLabel("edit", "Edit"),
					"colType" : "SectionHeader",
					"hidden" : featurePayReversalMap["RVAL"] != undefined
							&& featurePayReversalMap["RVAL"].canEdit === 'Y'
							? false
							: true
				}, {
					"colId" : "approveFlag",
					"colName" : getLabel("approve", "Approve"),
					"colType" : "SectionHeader",
					"hidden" : featurePayReversalMap["RVAL"] != undefined
							&& featurePayReversalMap["RVAL"].canAuth == 'Y'
							? false
							: true
				}];
		if (granularData && granularData.length > 0)
			renderCommonGranularPrivilegesPopup(columnModel, granularData,
					'granularReversalDiv', getLabel(
							'reversalGranularPrivilege',
							'Reversal Granular Privileges'));
	}
}
function populateRevFeatureFeatureMap(privilegeData) {
	if (privilegeData) {
		$.each(privilegeData, function(index, feature) {
					var key = feature.featureId + "_" + feature.featureWeight;
					var rightValue;
					var rmserial = feature.rmSerial;
					featurePayMap[key] = feature;
				});
	}
}