var jsondataNodeName = {};
String.prototype.unquoted = function() {
	return this.replace(/(^")|("$)/g, '')
}
function paintRolesVerifyScreen() {
	//console.log(objVerifyJson);
	// objVerifyJson = objVerifyJson.replace(/\"/g, "");
	
	objVerifyJson = objVerifyJson.replace(/boxLabel/g, "name");
	objVerifyJson = objVerifyJson.replace(/fieldLabel/g, "name");
	objVerifyJson = objVerifyJson.replace(/&#034;/g, '"');
	console.log(objVerifyJson);

	if (!isEmpty(objVerifyJson)) {
		jsondataNodeName = JSON.parse(objVerifyJson.unquoted());

		var mapdataNodeName = [{
					"module" : "00",
					"dataNodeName" : "subsidiaries",
					"descriptionField" : "clientDesc",
					"serviceEnabled" : true
				}, {
					"module" : "03",
					"dataNodeName" : "messages",
					"descriptionField" : "messageDesc",
					"serviceEnabled" : adminServiceEnable
				}, {
					"module" : "03",
					"dataNodeName" : "reports",
					"descriptionField" : "reportDesc",
					"serviceEnabled" : adminServiceEnable
				}, {
					"module" : "03",
					"dataNodeName" : "alerts",
					"descriptionField" : "alertDesc",
					"serviceEnabled" : adminServiceEnable
				}, {
					"module" : "03",
					"dataNodeName" : "widgets",
					"descriptionField" : "widgetDesc",
					"serviceEnabled" : adminServiceEnable
				}, {
					"module" : "01",
					"dataNodeName" : "reports",
					"descriptionField" : "reportDesc",
					"serviceEnabled" : brServiceEnable
				}, {
					"module" : "01",
					"dataNodeName" : "alerts",
					"descriptionField" : "alertDesc",
					"serviceEnabled" : brServiceEnable
				}, {
					"module" : "01",
					"dataNodeName" : "widgets",
					"descriptionField" : "widgetDesc",
					"serviceEnabled" : brServiceEnable
				}, {
					"module" : "02",
					"dataNodeName" : "reports",
					"descriptionField" : "reportDesc",
					"serviceEnabled" : payServiceEnable
				}, {
					"module" : "02",
					"dataNodeName" : "alerts",
					"descriptionField" : "alertDesc",
					"serviceEnabled" : payServiceEnable
				}, {
					"module" : "02",
					"dataNodeName" : "widgets",
					"descriptionField" : "widgetDesc",
					"serviceEnabled" : payServiceEnable
				}, {
					"module" : "02",
					"dataNodeName" : "payPackages",
					"descriptionField" : "productDescription",
					"serviceEnabled" : payServiceEnable
				}, {
					"module" : "02",
					"dataNodeName" : "companyIds",
					"descriptionField" : "companyName",
					"serviceEnabled" : payServiceEnable
				}, {
					"module" : "02",
					"dataNodeName" : "templates",
					"descriptionField" : "templateName",
					"serviceEnabled" : payServiceEnable
				}, {
					"module" : "16",
					"dataNodeName" : "alerts",
					"descriptionField" : "alertDesc",
					"serviceEnabled" : depositServiceEnable
				}, {
					"module" : "16",
					"dataNodeName" : "widgets",
					"descriptionField" : "widgetDesc",
					"serviceEnabled" : depositServiceEnable
				}, {
					"module" : "07",
					"dataNodeName" : "reports",
					"descriptionField" : "reportDesc",
					"serviceEnabled" : loanServiceEnable
				}, {
					"module" : "07",
					"dataNodeName" : "alerts",
					"descriptionField" : "alertDesc",
					"serviceEnabled" : loanServiceEnable
				}, {
					"module" : "07",
					"dataNodeName" : "widgets",
					"descriptionField" : "widgetDesc",
					"serviceEnabled" : loanServiceEnable
				}, {
					"module" : "13",
					"dataNodeName" : "reports",
					"descriptionField" : "reportDesc",
					"serviceEnabled" : positivePayServiceEnable
				}, {
					"module" : "13",
					"dataNodeName" : "alerts",
					"descriptionField" : "alertDesc",
					"serviceEnabled" : positivePayServiceEnable
				}, {
					"module" : "13",
					"dataNodeName" : "widgets",
					"descriptionField" : "widgetDesc",
					"serviceEnabled" : positivePayServiceEnable
				}, {
					"module" : "14",
					"dataNodeName" : "reports",
					"descriptionField" : "reportDesc",
					"serviceEnabled" : checkServiceEnable
				}, {
					"module" : "14",
					"dataNodeName" : "alerts",
					"descriptionField" : "alertDesc",
					"serviceEnabled" : checkServiceEnable
				}, {
					"module" : "14",
					"dataNodeName" : "widgets",
					"descriptionField" : "widgetDesc",
					"serviceEnabled" : checkServiceEnable
				}, {
					"module" : "04",
					"dataNodeName" : "reports",
					"descriptionField" : "reportDesc",
					"serviceEnabled" : lmsServiceEnable
				}, {
					"module" : "04",
					"dataNodeName" : "notionalAgreements",
					"descriptionField" : "agreementName",
					"serviceEnabled" : lmsServiceEnable
				}, {
					"module" : "04",
					"dataNodeName" : "sweepAgreements",
					"descriptionField" : "agreementName",
					"serviceEnabled" : lmsServiceEnable
				}, {
					"module" : "04",
					"dataNodeName" : "widgets",
					"descriptionField" : "widgetDesc",
					"serviceEnabled" : lmsServiceEnable
				}, {
					"module" : "06",
					"dataNodeName" : "reports",
					"descriptionField" : "reportDesc",
					"serviceEnabled" : fscServiceEnable
				}, {
					"module" : "06",
					"dataNodeName" : "alerts",
					"descriptionField" : "alertDesc",
					"serviceEnabled" : fscServiceEnable
				}, {
					"module" : "06",
					"dataNodeName" : "widgets",
					"descriptionField" : "widgetDesc",
					"serviceEnabled" : fscServiceEnable
				}, {
					"module" : "10",
					"dataNodeName" : "packages",
					"descriptionField" : "productDescription",
					"serviceEnabled" : forecastServiceEnable
				}, {
					"module" : "10",
					"dataNodeName" : "widgets",
					"descriptionField" : "widgetDesc",
					"serviceEnabled" : forecastServiceEnable
				}, {
					"module" : "05",
					"dataNodeName" : "reports",
					"descriptionField" : "reportDesc",
					"serviceEnabled" : colServiceEnable
				}, {
					"module" : "05",
					"dataNodeName" : "alerts",
					"descriptionField" : "alertDesc",
					"serviceEnabled" : colServiceEnable
				}, {
					"module" : "05",
					"dataNodeName" : "widgets",
					"descriptionField" : "widgetDesc",
					"serviceEnabled" : colServiceEnable
				}, {
					"module" : "05",
					"dataNodeName" : "packages",
					"descriptionField" : "productDescription",
					"serviceEnabled" : colServiceEnable
				}, {
					"module" : "09",
					"dataNodeName" : "packages",
					"descriptionField" : "productDescription",
					"serviceEnabled" : portalServiceEnable
				}, {
					"module" : "09",
					"dataNodeName" : "widgets",
					"descriptionField" : "widgetDesc",
					"serviceEnabled" : portalServiceEnable
				}];

		for (var i in mapdataNodeName) {
			var objMapInfo = mapdataNodeName[i];
			var strModule = objMapInfo['module'];
			var blnIsServiceEnabled = objMapInfo['serviceEnabled'];
			if (blnIsServiceEnabled) {
				objMapInfoDetails = jsondataNodeName[strModule];
				if (!isEmpty(objMapInfoDetails)) {
					objSection = objMapInfoDetails[objMapInfo.dataNodeName];
					var strCSV = createCommaSeparatedString(objSection,
							objMapInfo.descriptionField);
					if (!isEmpty(strCSV)) {
						$('.' + objMapInfo.module + '_'
								+ objMapInfo.dataNodeName).text(strCSV);
						$('.' + objMapInfo.module + '_'
								+ objMapInfo.dataNodeName + 'Div')
								.removeClass('hidden');
					} else {
						$('.' + objMapInfo.module + '_'
								+ objMapInfo.dataNodeName + 'Div')
								.addClass('hidden');
					}
				}
			}
		}

		mapdataNodeName = null;
		paintPrivilegeGrids();
		paintGranularPrivilegeGrids();
		//Following method paints Payment granular popup as data is not being provided by backend. 
		paintGranularPopups();
		paintAccountsGrids();
		paintInterfaceGrid();
		if(bankReportServiceEnable)
			fetchBankReportsData('15',userCategory);
		jsondataNodeName = null;
	}
}
function paintInterfaceGrid() {
	var strModule = '03';
	objMapInfoDetails = jsondataNodeName[strModule];
	if (!isEmpty(objMapInfoDetails)) {
		objData = objMapInfoDetails['interfaces'];
		paintInterfaceTable(objData, 'adminInterfaceParentDiv')
	}
}
function paintPrivilegeGrids() {
	var objPrivilegeData = null;
	var mapdataPrivilegeName = [{
				"module" : "03",
				"dataNodeName" : "privileges",
				"divId" : "adminPrivilegesParentDiv",
				"serviceEnabled" : adminServiceEnable
			}, {
				"module" : "01",
				"dataNodeName" : "privileges",
				"divId" : "brPrivilegesParentDiv",
				"serviceEnabled" : brServiceEnable
			}, {
				"module" : "02",
				"dataNodeName" : "privileges",
				"divId" : "paymentPrivilegesParentDiv",
				"serviceEnabled" : payServiceEnable
			}, {
				"module" : "16",
				"dataNodeName" : "privileges",
				"divId" : "depositPrivilegesParentDiv",
				"serviceEnabled" : depositServiceEnable
			}, {
				"module" : "07",
				"dataNodeName" : "privileges",
				"divId" : "loanPrivilegesParentDiv",
				"serviceEnabled" : loanServiceEnable
			}, {
				"module" : "13",
				"dataNodeName" : "privileges",
				"divId" : "positivePayPrivilegesParentDiv",
				"serviceEnabled" : positivePayServiceEnable
			}, {
				"module" : "14",
				"dataNodeName" : "privileges",
				"divId" : "checkMgmtPrivilegesParentDiv",
				"serviceEnabled" : checkServiceEnable
			}, {
				"module" : "04",
				"dataNodeName" : "privileges",
				"divId" : "liquidityPrivilegesParentDiv",
				"serviceEnabled" : lmsServiceEnable
			}, {
				"module" : "06",
				"dataNodeName" : "privileges",
				"divId" : "fscPrivilegesParentDiv",
				"serviceEnabled" : fscServiceEnable
			}, {
				"module" : "10",
				"dataNodeName" : "privileges",
				"divId" : "forecastPrivilegesParentDiv",
				"serviceEnabled" : forecastServiceEnable
			}, {
				"module" : "05",
				"dataNodeName" : "privileges",
				"divId" : "collectionPrivilegesParentDiv",
				"serviceEnabled" : colServiceEnable
			}, {
				"module" : "09",
				"dataNodeName" : "privileges",
				"divId" : "tradePrivilegesParentDiv",
				"serviceEnabled" : tradeServiceEnable
			}, {
				"module" : "19",
				"dataNodeName" : "privileges",
				"divId" : "portalPrivilegesParentDiv",
				"serviceEnabled" : portalServiceEnable
			}, {
				"module" : "20",
				"dataNodeName" : "privileges",
				"divId" : "mobilePrivilegesParentDiv",
				"serviceEnabled" : mobileServiceEnable
			}];

	for (var i in mapdataPrivilegeName) {
		var objMapInfo = mapdataPrivilegeName[i];
		var strModule = objMapInfo['module'];
		var strDivId = objMapInfo['divId'];
		var blnIsServiceEnabled = objMapInfo['serviceEnabled'];
		objMapInfoDetails = jsondataNodeName[strModule];
		if (blnIsServiceEnabled) {
			objPrivilegeData = fetchPrivilegeData(strModule, userCategory,
					strDivId);
		}
		// if (!isEmpty(objMapInfoDetails)) {
		// objSectionData = objMapInfoDetails[objMapInfo.dataNodeName];
		// objMapInfoDetails[objMapInfo.dataNodeName]=objPrivilegeData;
		// paintPrivilegesTable(objPrivilegeData, strDivId);
		// }
	}
}

function fetchPrivilegeData(paramModule, paramCategoryId, strDivId) {
	$.ajax({
				url : "services/userCategory/previlige.json",
				type : "POST",
				dataType : "json",
				async : false,
				data : {
					module : paramModule,
					categoryId : paramCategoryId
				},
				complete : function(response) {
					// objMapInfoDetails = ;
					// objMapInfoDetails[strNodeName]=response;
					var strResText = response && response.responseText
							? response.responseText
							: '';
					if (isEmpty(jsondataNodeName[paramModule]))
						jsondataNodeName[paramModule] = {};
					strResText = JSON.parse(strResText.unquoted());
					jsondataNodeName[paramModule]['privileges'] = strResText;
					paintPrivilegesTable(strResText, strDivId);
				}
			});

}
function paintGranularPrivilegeGrids() {
	/*, {
				"module" : "02",
				"serviceType" : "PAY",
				"dataNodeName" : "privileges",
				"divId" : "paymentPrivilegesParentDiv",
				"dataGranularNodeName" : "granularPrivilegesPAY",
				"hidden" : payServiceEnable && isPaymentGrnularEnable
			}, {
				"module" : "02",
				"serviceType" : "SI",
				"dataNodeName" : "privileges",
				"divId" : "paymentPrivilegesParentDiv",
				"dataGranularNodeName" : "granularPrivilegesSI",
				"hidden" : payServiceEnable && isPaymentGrnularEnable
			}, {
				"module" : "02",
				"serviceType" : "REV",
				"dataNodeName" : "privileges",
				"divId" : "paymentPrivilegesParentDiv",
				"dataGranularNodeName" : "granularPrivilegesRV",
				"hidden" : payServiceEnable && isPaymentGrnularEnable
			}, {
				"module" : "02",
				"serviceType" : "TEMP",
				"dataNodeName" : "privileges",
				"divId" : "paymentPrivilegesParentDiv",
				"dataGranularNodeName" : "granularPrivilegesTEMP",
				"hidden" : payServiceEnable && isPaymentGrnularEnable
			}, */
	var mapdataPrivilegeName = [{
				"module" : "01",
				"serviceType" : "BR",
				"dataNodeName" : "privileges",
				"divId" : "brPrivilegesParentDiv",
				"dataGranularNodeName" : "granularPrivileges",
				"hidden" : brServiceEnable && isBrGrnularEnable
			},{
				"module" : "07",
				"serviceType" : "LN",
				"dataNodeName" : "privileges",
				"divId" : "loanPrivilegesParentDiv",
				"dataGranularNodeName" : "granularPrivileges",
				"hidden" : loanServiceEnable && isLoanGrnularEnable
			}, {
				"module" : "13",
				"serviceType" : "PP",
				"dataNodeName" : "privileges",
				"divId" : "positivePayPrivilegesParentDiv",
				"dataGranularNodeName" : "granularPrivileges",
				"hidden" : positivePayServiceEnable && isPPGrnularEnable
			}, {
				"module" : "14",
				"serviceType" : "CK",
				"dataNodeName" : "privileges",
				"divId" : "checkMgmtPrivilegesParentDiv",
				"dataGranularNodeName" : "granularPrivileges",
				"hidden" : checkServiceEnable && isChecksGrnularEnable
			}];
	for (var i in mapdataPrivilegeName) {
		var objMapInfo = mapdataPrivilegeName[i];
		var strModule = objMapInfo['module'];
		var blnIsServiceEnable = objMapInfo['hidden'];
		if (blnIsServiceEnable) {
			if (strModule === '01') {
				var objModuleData = jsondataNodeName[strModule];
				if (!isEmpty(objModuleData[objMapInfo.dataNodeName])) {
					var objPrivilegeData = objModuleData[objMapInfo.dataNodeName];
					var objGranularPrivilegeData = objModuleData[objMapInfo.dataGranularNodeName];
					paintBrGranularPrivilegesPopupTable(
							objGranularPrivilegeData, objPrivilegeData);
				}
			} else if (strModule === '02') {
				var strServiceType = objMapInfo['serviceType'];
				var objModuleData = jsondataNodeName[strModule];
				if ('PAY' === strServiceType) {
					var objPrivilegeData = objModuleData[objMapInfo.dataNodeName];
					var objGranularPrivilegeData = objModuleData[objMapInfo.dataGranularNodeName];
					paintPaymentGranularPrivilegesPopupTable(
							objGranularPrivilegeData, objPrivilegeData);
				} else if ('SI' === strServiceType) {
					var objPrivilegeData = objModuleData[objMapInfo.dataNodeName];
					var objGranularPrivilegeData = objModuleData[objMapInfo.dataGranularNodeName];
					paintSIGranularPrivilegesPopupTable(
							objGranularPrivilegeData, objPrivilegeData);
				} else if ('REV' === strServiceType) {
					var objPrivilegeData = objModuleData[objMapInfo.dataNodeName];
					var objGranularPrivilegeData = objModuleData[objMapInfo.dataGranularNodeName];
					paintReversalGranularPrivilegesPopupTable(
							objGranularPrivilegeData, objPrivilegeData);
				} else if ('TEMP' === strServiceType) {
					var objPrivilegeData = objModuleData[objMapInfo.dataNodeName];
					var objGranularPrivilegeData = objModuleData[objMapInfo.dataGranularNodeName];
					paintTemplateGranularPrivilegesPopupTable(
							objGranularPrivilegeData, objPrivilegeData);
				}
			} else if (strModule === '07') {
				var objModuleData = jsondataNodeName[strModule];
				var objPrivilegeData = objModuleData[objMapInfo.dataNodeName];
				var objGranularPrivilegeData = objModuleData[objMapInfo.dataGranularNodeName];
				paintLoansGranularPrivilegesPopupTable(
						objGranularPrivilegeData, objPrivilegeData);
			} else if (strModule === '13') {
				var objModuleData = jsondataNodeName[strModule];
				var objPrivilegeData = objModuleData[objMapInfo.dataNodeName];
				var objGranularPrivilegeData = objModuleData[objMapInfo.dataGranularNodeName];
				paintPositivePayGranularPrivilegesPopupTable(
						objGranularPrivilegeData, objPrivilegeData);
			} else if (strModule === '14') {
				var objModuleData = jsondataNodeName[strModule];
				var objPrivilegeData = objModuleData[objMapInfo.dataNodeName];
				var objGranularPrivilegeData = objModuleData[objMapInfo.dataGranularNodeName];
				paintChecksGranularPrivilegesPopupTable(
						objGranularPrivilegeData, objPrivilegeData);
			}
		}
	}
}
function paintAccountsGrids() {
	var mapdataPrivilegeName = [{
				"module" : "02",
				"dataNodeName" : "payAccounts",
				"divId" : "tempPaymentAccounts"
			}, {
				"module" : "01",
				"dataNodeName" : "payAccounts",
				"divId" : "tempBRAccounts"
			}, {
				"module" : "16",
				"dataNodeName" : "payAccounts",
				"divId" : "tempDepositAccounts"
			}, {
				"module" : "07",
				"dataNodeName" : "payAccounts",
				"divId" : "tempLoansAccounts"
			}, {
				"module" : "13",
				"dataNodeName" : "payAccounts",
				"divId" : "tempPositiveAccounts"
			}, {
				"module" : "14",
				"dataNodeName" : "payAccounts",
				"divId" : "tempCheckManagementAccounts"
			}, {
				"module" : "05",
				"dataNodeName" : "payAccounts",
				"divId" : "collectionAccountsParentDiv"
			}, {
				"module" : "19",
				"dataNodeName" : "payAccounts",
				"divId" : "portalAccountsParentDiv"
			}];

	for (var i in mapdataPrivilegeName) {
		var objMapInfo = mapdataPrivilegeName[i];
		var strModule = objMapInfo['module'];
		var strDivId = objMapInfo['divId'];
		objMapInfoDetails = jsondataNodeName[strModule];
		if (!isEmpty(objMapInfoDetails)) {
			objData = objMapInfoDetails[objMapInfo.dataNodeName];
			// paintPrivilegesTable(objSectionData, strDivId);
			paintAccountsTable(objData, strDivId);
		}
	}

}
function createCommaSeparatedString(arrJson, keynode) {
	var stringCSV = "";
	for (var i in arrJson) {
		var objNode = arrJson[i];
		if (!isEmpty(objNode[keynode])) {
			stringCSV += objNode[keynode];
			if (i < arrJson.length - 1)
				stringCSV += ', ';
		}
	}
	return stringCSV;
}