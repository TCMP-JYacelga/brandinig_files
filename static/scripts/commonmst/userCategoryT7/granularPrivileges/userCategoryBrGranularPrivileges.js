var featureBRMap = [];
function getBRPrivilegesData(strUrl, dataPrivilegeJson, dataJson, strModule) {
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

								featureBRMap[key] = feature;

							});

					getBrGranularPrivilegesData(
							'services/userCategory/getAllGranularPrivileges.json',
							dataJson, strModule)
				}

			});

}
function getBrGranularPrivilegesData(strUrl, dataJson, strModule) {
	var objData = null;
	$.ajax({
				url : strUrl,
				type : 'POST',
				data : dataJson,
				async : false,
				success : function(data) {
					paintBrGranularPrivilegesPopup(strModule, data);
				}
			});

}
function createBRGranularPopupData() {
	if (brServiceEnable == true) {
		var strModule = '01'
		var dataPrivilegeJson = {
			module : strModule,
			categoryId : userCategory
		};

		var dataJson = {
			module : strModule,
			categoryId : userCategory,
			serviceType : 'BR'
		};
		getBRPrivilegesData('services/userCategory/previlige.json',
				dataPrivilegeJson, dataJson, strModule);
	}
}
function paintBrGranularPrivilegesPopup(strModule, granularData) {
	if ('01' === strModule) {

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
					"colName" : "Account Name",
					"colId" : "accountName",
					"colType" : "SubSectionHeader",
					"hidden" : false
				}, {

					"colId" : "allowTxnFlag",
					"colName" : getLabel("allowTransaction",
							"Allow Transactions"),
					"colType" : "SectionHeader",
					"hidden" : featureBRMap["ALLOWTXN"] != undefined
							&& featureBRMap["ALLOWTXN"].canView === 'Y'
							? false
							: true
				}, {

					"colId" : "intraDaySummaryFlag",
					"colName" : getLabel("intraDaySummary", "Intra Day Summary"),
					"colType" : "SectionHeader",
					"hidden" : featureBRMap["IRD"] != undefined
							&& featureBRMap["IRD"].canView === 'Y'
							? false
							: true
				}, {
					"colId" : "previousDaySummaryFlag",
					"colName" : getLabel("previousDaySummary",
							"Previous Day Summary"),
					"colType" : "SectionHeader",
					"hidden" : featureBRMap["PRV"] != undefined
							&& featureBRMap["PRV"].canView == 'Y'
							? false
							: true
				}, {
					"colId" : "intraDayActivityFlag",
					"colName" : getLabel("intraDayActivity",
							"Intra Day Activity"),
					"colType" : "SectionHeader",
					"hidden" : featureBRMap["INTRAACT"] != undefined
							&& featureBRMap["INTRAACT"].canView == 'Y'
							? false
							: true
				}, {
					"colId" : "previousDayActivityFlag",
					"colName" : getLabel("previousDayActivity",
							"Previous Day Activity"),
					"colType" : "SectionHeader",
					"hidden" : featureBRMap["PREVACT"] != undefined
							&& featureBRMap["PREVACT"].canView == 'Y'
							? false
							: true
				}, {
					"colId" : "prevDayDetailViewImgFlag",
					"colName" : getLabel("prevDayDetailsViewImage",
							"Prev Day Detail - View Images"),
					"colType" : "SectionHeader",
					"hidden" : featureBRMap["PREVVCIMG"] != undefined
							&& featureBRMap["PREVVCIMG"].canView == 'Y'
							? false
							: true
				}, {
					"colId" : "intraDayDetailViewImgFlag",
					"colName" : getLabel("intraDayDetailsViewImage",
							"Intra Day Detail - View Images"),
					"colType" : "SectionHeader",
					"hidden" : featureBRMap["VCIMG"] != undefined
							&& featureBRMap["VCIMG"].canView == 'Y'
							? false
							: true
				}, {
					"colId" : "transactionSearchFlag",
					"colName" : getLabel('transactionSearch',
							"Transaction Search"),
					"colType" : "SectionHeader",
					"hidden" : featureBRMap["TRS"] != undefined
							&& featureBRMap["TRS"].canView == 'Y'
							? false
							: true
				}, {
					"colId" : "cashPositionSummaryFlag",
					"colName" : getLabel("cashPositionSummary",
							"Cash Position Summary"),
					"colType" : "SectionHeader",
					"hidden" : featureBRMap["F_SRV_BR_PRV_CP"] != undefined
							&& featureBRMap["F_SRV_BR_PRV_CP"].canView == 'Y'
							? false
							: true
				}, {
					"colId" : "cashPositionAccountFlag",
					"colName" : getLabel("cashPositionAccount",
							"Cash Position Account"),
					"colType" : "SectionHeader",
					"hidden" : featureBRMap["F_SRV_BR_PRV_CP"] != undefined
							&& featureBRMap["F_SRV_BR_PRV_CP"].canView == 'Y'
							? false
							: true
				}, {
					"colId" : "cashPositionDetailFlag",
					"colName" : getLabel("cashPositionTransactions",
							"Cash Position Transactions"),
					"colType" : "SectionHeader",
					"hidden" : featureBRMap["F_SRV_BR_PRV_CP"] != undefined
							&& featureBRMap["F_SRV_BR_PRV_CP"].canView == 'Y'
							? false
							: true
				}];
		if (granularData && granularData.length > 0)
			renderCommonGranularPrivilegesPopup(columnModel, granularData,
					'granularBrDiv', getLabel('brReportGranularPrivilege',
							'Balance Reporting Granular Privileges'));
	}
}

function paintBrGranularPrivilegesPopupTable(granularData, privilegeData) {
	if (privilegeData) {
		populateBRFeatureMap(privilegeData);
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
					"colName" : "Account Name",
					"colId" : "accountName",
					"colType" : "SubSectionHeader",
					"hidden" : false
				}, {

					"colId" : "allowTxnFlag",
					"colName" : getLabel("allowTransaction",
							"Allow Transactions"),
					"colType" : "SectionHeader",
					"hidden" : featureBRMap["ALLOWTXN"] != undefined
							&& featureBRMap["ALLOWTXN"].canView === 'Y'
							? false
							: true
				}, {

					"colId" : "intraDaySummaryFlag",
					"colName" : getLabel("intraDaySummary", "Intra Day Summary"),
					"colType" : "SectionHeader",
					"hidden" : featureBRMap["IRD"] != undefined
							&& featureBRMap["IRD"].canView === 'Y'
							? false
							: true
				}, {
					"colId" : "previousDaySummaryFlag",
					"colName" : getLabel("previousDaySummary",
							"Previous Day Summary"),
					"colType" : "SectionHeader",
					"hidden" : featureBRMap["PRV"] != undefined
							&& featureBRMap["PRV"].canView == 'Y'
							? false
							: true
				}, {
					"colId" : "intraDayActivityFlag",
					"colName" : getLabel("intraDayActivity",
							"Intra Day Activity"),
					"colType" : "SectionHeader",
					"hidden" : featureBRMap["INTRAACT"] != undefined
							&& featureBRMap["INTRAACT"].canView == 'Y'
							? false
							: true
				}, {
					"colId" : "previousDayActivityFlag",
					"colName" : getLabel("previousDayActivity",
							"Previous Day Activity"),
					"colType" : "SectionHeader",
					"hidden" : featureBRMap["PREVACT"] != undefined
							&& featureBRMap["PREVACT"].canView == 'Y'
							? false
							: true
				}, {
					"colId" : "prevDayDetailViewImgFlag",
					"colName" : getLabel("prevDayDetailsViewImage",
							"Prev Day Detail - View Images"),
					"colType" : "SectionHeader",
					"hidden" : featureBRMap["PREVVCIMG"] != undefined
							&& featureBRMap["PREVVCIMG"].canView == 'Y'
							? false
							: true
				}, {
					"colId" : "intraDayDetailViewImgFlag",
					"colName" : getLabel("intraDayDetailsViewImage",
							"Intra Day Detail - View Images"),
					"colType" : "SectionHeader",
					"hidden" : featureBRMap["VCIMG"] != undefined
							&& featureBRMap["VCIMG"].canView == 'Y'
							? false
							: true
				}, {
					"colId" : "transactionSearchFlag",
					"colName" : getLabel('transactionSearch',
							"Transaction Search"),
					"colType" : "SectionHeader",
					"hidden" : featureBRMap["TRS"] != undefined
							&& featureBRMap["TRS"].canView == 'Y'
							? false
							: true
				}, {
					"colId" : "cashPositionSummaryFlag",
					"colName" : getLabel("cashPositionSummary",
							"Cash Position Summary"),
					"colType" : "SectionHeader",
					"hidden" : featureBRMap["F_SRV_BR_PRV_CP"] != undefined
							&& featureBRMap["F_SRV_BR_PRV_CP"].canView == 'Y'
							? false
							: true
				}, {
					"colId" : "cashPositionAccountFlag",
					"colName" : getLabel("cashPositionAccount",
							"Cash Position Account"),
					"colType" : "SectionHeader",
					"hidden" : featureBRMap["F_SRV_BR_PRV_CP"] != undefined
							&& featureBRMap["F_SRV_BR_PRV_CP"].canView == 'Y'
							? false
							: true
				}, {
					"colId" : "cashPositionDetailFlag",
					"colName" : getLabel("cashPositionTransactions",
							"Cash Position Transactions"),
					"colType" : "SectionHeader",
					"hidden" : featureBRMap["F_SRV_BR_PRV_CP"] != undefined
							&& featureBRMap["F_SRV_BR_PRV_CP"].canView == 'Y'
							? false
							: true
				}];
		if (granularData && granularData.length > 0)
			renderCommonGranularPrivilegesPopup(columnModel, granularData,
					'granularBrDiv', getLabel('brReportGranularPrivilege',
							'Balance Reporting Granular Privileges'));
	}
}
function populateBRFeatureMap(privilegeData) {
	if (privilegeData) {
		$.each(privilegeData, function(index, feature) {
					var key = feature.featureId;
					var rightValue;
					var rmserial = feature.rmSerial;
					featureBRMap[key] = feature;
				});
	}
}