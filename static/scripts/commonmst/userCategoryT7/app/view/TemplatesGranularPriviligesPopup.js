var granularPrivfieldJson = [];
// flag to hide/show 3 sections
var repetitiveFlag = 'N';
var nonRepetitiveFlag = 'N';
var semiRepetitiveFlag = 'N';
var isFilterApplied = false;
var featureMap = {};
var viewColumnCreated = false, editColumnCreated = false, deleteColumnCreated = false, authColumnCreated = false, detailApproveColumnCreated = false;

var importColumnCreated = false;
var accountAssignedMap = {};
var payPackageAssignedMap = {};
var allAccountsSelectedFlag = 'N';
var allPackagesSelectedFlag = 'N';
var granularTPageNo = 1;
var granularTCount = 1;
var granularTPageSize = 10;
var granularTTotalPage = 1;
var granularTTotalNumberOfRecord = 1;
var granularTPrivfieldJsonTemp = [];
var jsonArrayTGlobal = [];

var totalTPRecordFrmServer = 1;
var totalTPDisplay = 50;
var totalTPRecordsDisplay = [];
var currentTPBunchOfPage = 0;
var granularTPOverAllTTotalPage = 1;
var granularTPOverAllTPageNo = 1;
var prevTPRecordMaxCount=0;
var nextTPMinRecordCount=0;
var numberTPRecordsToDisplay = 0;
var granularTPTotalRecordPage;
var navigationTPVisible=true;

var totalNumberTPRecordsDisplayed = 0;

Ext.define('GCP.view.TemplatesGranularPriviligesPopup', {
	extend : 'Ext.window.Window',
	xtype : 'templatesGranularPriviligesPopup',
	// width : 1000,
	minWidth : 400,
	maxWidth : 735,
	minHeight : 156,
	maxHeight : 550,
	overflowY : 'auto',
	overflowX : 'auto',
	cls : 'xn-popup',
	title : getLabel('templateGranularPrivilege',
			'Templates Granular Privileges'),
	// cls : 't7-grid',
	config : {
		modal : true,
		draggable : false,
		resizable : false,
		closeAction : 'hide',
		autoScroll : true,
		fnCallback : null,
		profileId : null,
		featureType : null,
		module : null,
		title : null,
		featureWidth : null
	},
	listeners : {
		'resize' : function() {
			this.center();
		},
		'afterrender' : function() {
			if (this.header.body.dom.firstElementChild.clientWidth != this.header.body.dom.firstElementChild.firstElementChild.clientWidth) {
				this.header.body.dom.firstElementChild.firstElementChild.className = "";
			}
		}
	},
	loadGranularFeaturs : function() {
		var me = this;
		if (mode === "VIEW") {
			Ext.Ajax.request({
						url : 'services/userCategory/accountPackagePrivileges.json',
						method : 'POST',
						async : false,
						params : {
							module : '02',
							categoryId : userCategory,
							serviceType : 'TEMP'
						},
						success : function(response) {
							templateGranularFeatureData = Ext.JSON
									.decode(response.responseText);
							return templateGranularFeatureData;
						},
						failure : function() {
							var errMsg = "";
							Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : getLabel(
												'instrumentErrorPopUpMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}

		return templateGranularFeatureData;
	},
	filterFeatures : function(data) {
		var allFeatures = new Ext.util.MixedCollection();
		allFeatures.addAll(data);
		// var featurs = allFeatures.filter(featureFilter);
		return allFeatures.items;
	},
	getBooleanvalue : function(strValue) {
		if (strValue == 'Y' || strValue == true) {
			return true;
		} else {
			return false;
		}
	},
	loadPrivilegesFeaturs : function() {
		var me = this;
		if (mode === "VIEW") {
			Ext.Ajax.request({
						url : 'services/userCategory/previlige.json',
						method : 'POST',
						async : false,
						params : {
							module : '02',
							categoryId : userCategory
						},
						success : function(response) {
							featureData = Ext.JSON
									.decode(response.responseText);
							return featureData;
						},
						failure : function() {
							var errMsg = "";
							Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : getLabel(
												'instrumentErrorPopUpMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}
		return featureData;
	},
	loadAccounts : function() {
		var me = this;
		if (mode === "VIEW") {
			Ext.Ajax.request({
				url : 'services/userCategory/accounts.json',
				method : 'POST',
				async : false,
				params : {
					module : '02',
					categoryId : userCategory,
					$inlinecount : 'allpages',
					$top : 5000
				},
				success : function(response) {
					paymentAccountsData = Ext.JSON
							.decode(response.responseText);
					return paymentAccountsData;
				},
				failure : function() {
					var errMsg = "";
					Ext.MessageBox.show({
								title : getLabel('instrumentErrorPopUpTitle',
										'Error'),
								msg : getLabel('instrumentErrorPopUpMsg',
										'Error while fetching Accounts data..!'),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							});
				}
			});
		}
		return paymentAccountsData;
	},
	loadPaymentPackages : function() {
		var me = this;
		if (mode === "VIEW") {
			Ext.Ajax.request({
				url : 'services/userCategory/catPackageList.json',
				method : 'POST',
				async : false,
				params : {
					module : '02',
					categoryId : userCategory,
					$inlinecount : 'allpages',
					$top : 5000
				},
				success : function(response) {
					paymentPackagesData = Ext.JSON
							.decode(response.responseText);
					return paymentPackagesData;
				},
				failure : function() {
					var errMsg = "";
					Ext.MessageBox.show({
						title : getLabel('instrumentErrorPopUpTitle', 'Error'),
						msg : getLabel('instrumentErrorPopUpMsg',
								'Error while fetching Payment Packages data..!'),
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
				}
			});
		}
		return paymentPackagesData;
	},
	getStringBooleanvalue : function(value) {
		if (value && value == true) {
			return 'Y';
		} else {
			return 'N';
		}
	},
	setPaymentPackagesData : function() {
		var self = this;

		var privdata = self.loadPaymentPackages();

		// in case there are no packages for service check array is empty

		var filteredPrivData;

		if (privdata !== null && privdata.length !== 0) {
			filteredPrivData = privdata.d.details;
		}
		var selectedPackages = document.getElementById('selectedPackages');
		var selectedPackagesObj;
		if (self.isHiddenElementNotNull(selectedPackages)) {
			selectedPackagesObj = Ext.decode(selectedPackages.value);
		}

		var allPPFlag = document.getElementById('allPackagesSelectedFlag');
		if (self.isHiddenElementNotNull(allPPFlag)) {
			self.allPackagesSelectedFlag = allPPFlag.value;
		}

		Ext.each(filteredPrivData, function(payPackage, index) {
					var payPackageKey = payPackage.productCategoryCode + '|'
							+ payPackage.productCode;
					var isAssigned = payPackage.assignmentStatus === 'Assigned'
							? true
							: false;
					var prevSelectedPayPackageObj;

					prevSelectedPayPackageObj = self
							.getPayPackageFromSelectedList(selectedPackagesObj,
									payPackage);

					if (typeof prevSelectedPayPackageObj !== undefined
							&& prevSelectedPayPackageObj !== null) {

						isAssigned = prevSelectedPayPackageObj.assigned;
					}

					payPackageAssignedMap[payPackageKey] = isAssigned;

				});

		// console.log("payPackageAssignedMap :"+payPackageAssignedMap);

	},

	getPayPackageFromSelectedList : function(selectedPackagesObj, payPackage) {

		for (key in selectedPackagesObj) {
			var payPkgObj = selectedPackagesObj[key][0];

			if (payPackage.productCategoryCode == payPkgObj.productCategoryCode
					&& payPackage.productCode == payPkgObj.productCode) {
				return payPkgObj;
			}

		}
		return null;
	},

	setPaymentAccounts : function() {
		var self = this;

		var privdata = self.loadAccounts();

		// in case there are no accounts for service check array is empty

		var filteredPrivData;

		if (privdata !== null && privdata.length !== 0) {
			filteredPrivData = privdata.d.details;
		}
		var selectedAccounts = document.getElementById('selectedAccounts');
		var selectedAccountsObj;
		if (self.isHiddenElementNotNull(selectedAccounts)) {
			selectedAccountsObj = Ext.decode(selectedAccounts.value);
		}

		var allPPFlag = document.getElementById('allbRAccountsSelectedFlag');
		if (self.isHiddenElementNotNull(allPPFlag)) {
			self.allAccountsSelectedFlag = allPPFlag.value;
		}

		Ext.each(filteredPrivData, function(account, index) {
					var accountKey = account.accountNumber + '|'
							+ account.accountName;
					var isAssigned = account.isAssigned;
					var prevSelectedAccountObj;

					prevSelectedAccountObj = self.getAccountFromSelectedList(
							selectedAccountsObj, account);

					if (typeof prevSelectedAccountObj !== undefined
							&& prevSelectedAccountObj !== null) {

						isAssigned = prevSelectedAccountObj.assigned;
					}

					accountAssignedMap[accountKey] = isAssigned;

				});

		// console.log("accountAssignedMap :"+accountAssignedMap);

	},
	getAccountFromSelectedList : function(selectedBRAccountsObj, account) {

		for (key in selectedBRAccountsObj) {
			var accountObj = selectedBRAccountsObj[key][0];

			if (account.accountNumber == accountObj.accountNumber) {
				return accountObj;
			}

		}
		return null;
	},

	setPaymentRights : function() {
		var self = this;

		var privdata = self.loadPrivilegesFeaturs();
		var filteredPrivData = this.filterFeatures(privdata);

		// set flag for sections to enable/disable
		var repetitiveFlagEl = document.getElementById('repetitiveFlag');
		var nonRepetitiveFlagEl = document.getElementById('nonRepetitiveFlag');
		var semiRepetitiveFlagEl = document
				.getElementById('semiRepetitiveFlag');

		if (self.isHiddenElementNotNull(repetitiveFlagEl)) {
			self.repetitiveFlag = repetitiveFlagEl.value;
		}

		if (self.isHiddenElementNotNull(nonRepetitiveFlagEl)) {
			self.nonRepetitiveFlag = nonRepetitiveFlagEl.value;
		}

		if (self.isHiddenElementNotNull(semiRepetitiveFlagEl)) {
			self.semiRepetitiveFlag = semiRepetitiveFlagEl.value;
		}

		var viewRightsSerials = document.getElementById('viewRightsSerials');
		var editRightsSerials = document.getElementById('editRightsSerials');
		var authRightsSerials = document.getElementById('authRightsSerials');

		var selectedViewRightsObj, selectedEditRightsObj, selectedAuthRightsObj;

		if (self.isHiddenElementNotNull(viewRightsSerials)) {
			selectedViewRightsObj = Ext.decode(viewRightsSerials.value);
		}

		if (self.isHiddenElementNotNull(editRightsSerials)) {
			selectedEditRightsObj = Ext.decode(editRightsSerials.value);
		}

		if (self.isHiddenElementNotNull(authRightsSerials)) {
			selectedAuthRightsObj = Ext.decode(authRightsSerials.value);
		}

		Ext.each(filteredPrivData, function(feature, index) {
					// using key as below due to multiple weights for same
					// feature id
					var key = feature.featureId + "_" + feature.featureWeight;
					// var value = feature;
					var rightValue;
					var rmserial = feature.rmSerial;

					if ((key === 'TPL_976' && feature.featureWeight === '976')
							|| (key === 'TPL_382' && feature.featureWeight === '382')
							|| (key === 'TPL_384' && feature.featureWeight === '384')
							|| feature.featureWeight === '380') {

						if (typeof selectedViewRightsObj !== undefined
								&& selectedViewRightsObj) {
							rightValue = undefined;
							if (selectedViewRightsObj.hasOwnProperty(rmserial)) {
								rightValue = selectedViewRightsObj[rmserial];
							}
							if (rightValue !== undefined)
								feature.canView = self
										.getStringBooleanvalue(rightValue);

						}

						if (typeof selectedEditRightsObj !== undefined
								&& selectedEditRightsObj) {
							rightValue = undefined;
							if (selectedEditRightsObj.hasOwnProperty(rmserial)) {
								rightValue = selectedEditRightsObj[rmserial];
							}
							if (rightValue !== undefined)
								feature.canEdit = self
										.getStringBooleanvalue(rightValue);

						}

						if (typeof selectedAuthRightsObj !== undefined
								&& selectedAuthRightsObj) {
							rightValue = undefined;
							if (selectedAuthRightsObj.hasOwnProperty(rmserial)) {
								rightValue = selectedAuthRightsObj[rmserial];
							}
							if (rightValue !== undefined)
								feature.canAuth = self
										.getStringBooleanvalue(rightValue);

						}
						featureMap[key] = feature;
					}
				});
	},

	reconfigure : function() {
		var thisClass = this;
		var searchField = Ext.getCmp('templateAccountIDFilterItemId');
		if (searchField != "" && searchField != undefined)
			searchField.setRawValue('');
		var searchField = Ext.getCmp('templatePayPkgFilterItemId');
		if (searchField != "" && searchField != undefined)
			searchField.setRawValue('');

		Ext.getCmp('templateGranPrivParametersSection').removeAll();
		Ext.getCmp('templateGranularPrivHeader').removeAll();
		Ext.getCmp('templateGranularPrivColumnHeaderTop').removeAll();
		Ext.getCmp('templateGranularPrivColumnHeader').removeAll();

		thisClass.setPaymentRights();
		thisClass.setPaymentPackagesData();
		thisClass.setPaymentAccounts();
		thisClass.setSplitTemplateData();
		thisClass.resetPaginationValues();
		thisClass.setTemplateGranularRightsNew('onLoad');
		Ext.getCmp('templateGranPrivParametersSection').add(thisClass
				.setTemplateGranularRights());
		Ext.getCmp('templateGranularPrivHeader').add(thisClass.setPanelHeader(
				'templateGranularPrivHeader', getLabel('lbl.account',
						'Account')));
		Ext.getCmp('templateGranularPrivColumnHeaderTop').add(thisClass
				.setTemplateColumnHeader());
		Ext.getCmp('templateGranularPrivColumnHeader').add(thisClass
				.setColumnHeader());

	},
	isHiddenElementNotNull : function(object) {

		if (typeof object !== undefined && object !== null && object.value) {
			return true;
		}
		return false;
	},

	updateFeatureIfPreviouslySelected : function(feature,
			previouslySubmitedJsonObj) {

		for (key in previouslySubmitedJsonObj.accountPackagePrivileges) {
			var previousSelectedObj = previouslySubmitedJsonObj.accountPackagePrivileges[key];
			if (previousSelectedObj.accountId == feature.accountId
					&& previousSelectedObj.packageId == feature.packageId) {
				if (previousSelectedObj.privileges.hasOwnProperty("VIEW")) {
					feature.viewFlag = previousSelectedObj.privileges.VIEW
							? true
							: false;
				}
				if (previousSelectedObj.privileges.hasOwnProperty("EDIT")) {
					feature.editFlag = previousSelectedObj.privileges.EDIT
							? true
							: false;
				}

				if (previousSelectedObj.privileges.hasOwnProperty("AUTH")) {
					feature.approveFlag = previousSelectedObj.privileges.AUTH
							? true
							: false;
				}

				if (previousSelectedObj.privileges.hasOwnProperty("SRVIEW")) {
					feature.srViewFlag = previousSelectedObj.privileges.SRVIEW
							? true
							: false;
				}
				if (previousSelectedObj.privileges.hasOwnProperty("SREDIT")) {
					feature.srEditFlag = previousSelectedObj.privileges.SREDIT
							? true
							: false;
				}

				if (previousSelectedObj.privileges.hasOwnProperty("SRAUTH")) {
					feature.srApproveFlag = previousSelectedObj.privileges.SRAUTH
							? true
							: false;
				}

				if (previousSelectedObj.privileges.hasOwnProperty("NRVIEW")) {
					feature.nrViewFlag = previousSelectedObj.privileges.NRVIEW
							? true
							: false;
				}
				if (previousSelectedObj.privileges.hasOwnProperty("NREDIT")) {
					feature.nrEditFlag = previousSelectedObj.privileges.NREDIT
							? true
							: false;
				}

				if (previousSelectedObj.privileges.hasOwnProperty("NRAUTH")) {
					feature.nrApproveFlag = previousSelectedObj.privileges.NRAUTH
							? true
							: false;
				}
			}
		}
	},
	setTemplateColumnHeader : function(serviceType) {
		viewColumnCreated = false, editColumnCreated = false, deleteColumnCreated = false, authColumnCreated = false, detailApproveColumnCreated = false;
		importColumnCreated = false;
		var featureItems = [];
		var self = this, featureWidth = 0;
		featureItems.push({
			xtype : 'label',
			style : {
				'line-height' : '2'
			},
			height : 30,
			text : getLabel("accountPackages", "Account Packages"),
			padding : '0 0 0 0',
			cls : 'boldText label-lineHeight granular-privilege-label privilege-grid-main-header privilege-grid-type-label granular-payprivilege-type'
		});
		if (self.repetitiveFlag == 'Y') {
			self.setParticularTemplateTypeColumnHeader(featureItems, getLabel(
							"repetitiveTemplate", "Repetitive Template"));
		}
		if (self.semiRepetitiveFlag == 'Y') {
			self.setParticularTemplateTypeColumnHeader(featureItems, getLabel(
							"semiRepetitiveTemplate",
							"Semi-Repetitive Template"));
		}
		if (self.nonRepetitiveFlag == 'Y') {
			self
					.setParticularTemplateTypeColumnHeader(featureItems,
							getLabel("nonRepetitiveTemplate",
									"Non-Repetitive Template"));
		}

		return featureItems;
	},
	setParticularTemplateTypeColumnHeader : function(featureItems, headerLabel) {
		var isViewflagSelected = false, isEditFlagSelected = false, isAuthFlagSelected = false, isDeleteFlagSelected = false, isDetailApproveFlagSelected = false, featureWidth = 0;
		var isImportFlagSelected = false;
		
		if (featureMap["TPL_976"] != undefined) {
			if (featureMap["TPL_976"].canView == 'Y')
				isViewflagSelected = true;
			if (featureMap["TPL_976"].canEdit == 'Y')
				isEditFlagSelected = true;
			if (featureMap["TPL_976"].canAuth == 'Y')
				isAuthFlagSelected = true;
		}
		if (featureMap["TPL_382"] != undefined) {
			if (featureMap["TPL_382"].canView == 'Y')
				isViewflagSelected = true;
			if (featureMap["TPL_382"].canEdit == 'Y') {
				isEditFlagSelected = true;
				isDeleteFlagSelected = true;
			}
		}
		if (featureMap["PYB_380"] != undefined) {
			if (featureMap["PYB_380"].canEdit == 'Y') {
				isImportFlagSelected = true;
			}
		}

		if (featureMap["TPL_384"] != undefined) {
			if (featureMap["TPL_384"].canView == 'Y')
				isViewflagSelected = true;

			if (featureMap["TPL_384"].canAuth == 'Y') {
				isAuthFlagSelected = true;
				isDetailApproveFlagSelected = true;

			}
			if (isViewflagSelected) {
				featureWidth += 90;
				viewColumnCreated = true;
			}
			if (isEditFlagSelected) {

				featureWidth += 90;
				editColumnCreated = true;

			}
			if (isDeleteFlagSelected) {
				featureWidth += 90;
				deleteColumnCreated = true;

			}
			if (isAuthFlagSelected) {

				featureWidth += 90;
				authColumnCreated = true;

			}
			if (isDetailApproveFlagSelected) {
				featureWidth += 90;
				detailApproveColumnCreated = true;

			}
			if(isImportFlagSelected){
				featureWidth += 90;
				importColumnCreated = true;
			}
			featureItems.push({
				xtype : 'label',
				height : 30,
				width : featureWidth,
				/*text : getLabel("nonRepetitiveTemplate",
						"Non-Repetitive Template"),*/
				text : headerLabel,
				padding : '0 0 0 0',
				style : {
					'text-align' : 'center'
				},
				cls : 'boldText label-lineHeight granular-privilege-label privilege-grid-main-header privilege-grid-type-label'
			});
		}

	},
	setColumnHeader : function(serviceType) {
		var featureItems = [];
		var self = this;

		featureItems.push({
			xtype : 'label',
			style : {
				'line-height' : '2'
			},
			height : 30,
			text : getLabel('lbl.type', "Type"),
			padding : '0 0 0 0',
			cls : 'boldText label-lineHeight granular-privilege-label privilege-grid-main-header privilege-grid-type-label granular-payprivilege-type'
		});

		if (self.repetitiveFlag == 'Y') {
			self.setColumnHeaderForTemplateType(featureItems);
		}
		if (self.semiRepetitiveFlag == 'Y') {
			self.setColumnHeaderForTemplateType(featureItems);
		}
		if (self.nonRepetitiveFlag == 'Y') {
			self.setColumnHeaderForTemplateType(featureItems);

		}
		return featureItems;
	},
	/*
	 * function is user for setting column header for each selected template
	 * type(repetitive/semiRepetitive/nonRepetitive)
	 */
	setColumnHeaderForTemplateType : function(featureItems) {

		if (viewColumnCreated) {

			featureItems.push({
				xtype : 'label',
				style : {
					'line-height' : '2'
				},
				height : 30,
				text : getLabel("view", "View"),
				padding : '0 0 0 5',
				cls : 'boldText label-lineHeight granular-privilege-label privilege-grid-main-header granular-privilege-headers'
			});
		}
		if (editColumnCreated) {

			featureItems.push({
				xtype : 'label',
				style : {
					'line-height' : '2'
				},
				height : 30,
				text : getLabel("edit", "Edit"),
				padding : '0 0 0 5',
				cls : 'boldText label-lineHeight granular-privilege-label privilege-grid-main-header granular-privilege-headers'
			});
		}
		if (deleteColumnCreated) {

			featureItems.push({
				xtype : 'label',
				style : {
					'line-height' : '2'
				},
				height : 30,
				text : getLabel("delete", "Delete"),
				padding : '0 0 0 5',
				cls : 'boldText label-lineHeight granular-privilege-label privilege-grid-main-header granular-privilege-headers'
			});
		}
		if (authColumnCreated) {

			featureItems.push({
				xtype : 'label',
				style : {
					'line-height' : '2'
				},
				height : 30,
				text : getLabel("quickApprove", "Quick Approve"),
				padding : '0 0 0 0',
				cls : 'boldText label-lineHeight granular-privilege-label privilege-grid-main-header granular-privilege-headers'
			});

		}
		if (detailApproveColumnCreated) {

			featureItems.push({
				xtype : 'label',
				style : {
					'line-height' : '2'
				},
				height : 30,
				text : getLabel("detailApprove", "Approve"),
				padding : '0 0 0 0',
				cls : 'boldText label-lineHeight granular-privilege-label privilege-grid-main-header granular-privilege-headers'
			});
		}

		if (importColumnCreated) {

			featureItems.push({
				xtype : 'label',
				style : {
					'line-height' : '2'
				},
				height : 30,
				text : getLabel("import", "Import"),
				padding : '0 0 0 0',
				cls : 'boldText label-lineHeight granular-privilege-label privilege-grid-main-header granular-privilege-headers'
			});
		}
	},
	setPanelHeader : function(id, title) {
		var self = this;
		var featureItems = [];

		featureItems.push({
			xtype : 'label',
			text : getLabel('lbl.account', 'Account'),
			padding : '5 0 0 10',
			cls : 'boldText granular-privilege-accountno granular-privilege-account-header',
			height : 50
		});
		featureItems.push({
			xtype : 'label',
			text : getLabel('accountName', 'Account Name'),
			padding : '5 0 0 10',
			cls : 'boldText granular-privilege-accountno granular-privilege-account-header',
			height : 50
		});
		featureItems.push({
			xtype : 'label',
			text : getLabel('lbl.paymentPackage', 'Payment Package'),
			padding : '5 0 0 10',
			cls : 'boldText  granular-privilege-headers granular-privilege-account-header',
			height : 50
		});

		if (self.repetitiveFlag == 'Y') {
			self.setPanelHeaderCheckbox(featureItems, id, title, '');

		}
		if (self.semiRepetitiveFlag == 'Y') {
			self.setPanelHeaderCheckbox(featureItems, id, title, 'sr');

		}
		if (self.nonRepetitiveFlag == 'Y') {
			self.setPanelHeaderCheckbox(featureItems, id, title, 'nr');

		}

		return featureItems;
	},
	/*
	 * function is user for setting column header checkbox for each selected
	 * template type(repetitive/semiRepetitive/nonRepetitive)
	 */
	setPanelHeaderCheckbox : function(featureItems, id, title, tmpType) {
		var isViewflagSelected = false, isEditFlagSelected = false, isAuthFlagSelected = false, isDeleteFlagSelected = false, isDetailApproveFlagSelected = false;
		isImportFlagSelected = false;
		if (featureMap["TPL_976"] != undefined) {
			if (featureMap["TPL_976"].canView == 'Y')
				isViewflagSelected = true;
			if (featureMap["TPL_976"].canEdit == 'Y')
				isEditFlagSelected = true;
			if (featureMap["TPL_976"].canAuth == 'Y')
				isAuthFlagSelected = true;

		}
		if (featureMap["TPL_382"] != undefined) {
			if (featureMap["TPL_382"].canView == 'Y')
				isViewflagSelected = true;
			if (featureMap["TPL_382"].canEdit == 'Y') {
				isEditFlagSelected = true;
				isDeleteFlagSelected = true;
			}

		}
		if (featureMap["TPL_384"] != undefined) {
			if (featureMap["TPL_384"].canView == 'Y')
				isViewflagSelected = true;
			if (featureMap["TPL_384"].canAuth == 'Y') {
				isAuthFlagSelected = true;
				isDetailApproveFlagSelected = true;
			}

		}
		if (featureMap["PYB_380"] != undefined) {
			if (featureMap["PYB_380"].canEdit === 'Y')
				isImportFlagSelected = true;
		}

		if (isViewflagSelected) {
			featureItems.push({
						xtype : 'panel',
						cls : 'privilege-grid-main-header granular-privilege-headers',
						text : title,
						padding : '5 0 0 10',
						items : [{
									xtype : 'checkbox',
									margin : '2 5 2 29',
									width : 30,
									height : 20,
									itemId : id + "_" + tmpType + "viewIcon",
									border : 0,
									disabled : (mode == "VIEW") ? true : false
								}]
					});

		}
		if (isEditFlagSelected) {
			featureItems.push({
						xtype : 'panel',
						cls : 'privilege-grid-main-header granular-privilege-headers',
						text : title,
						padding : '5 0 0 10',
						items : [{
									xtype : 'checkbox',
									margin : '2 5 2 29',
									width : 30,
									height : 20,
									itemId : id + "_" + tmpType + "editIcon",
									border : 0,
									disabled : (mode == "VIEW") ? true : false
								}]
					});

		}
		if (isDeleteFlagSelected) {
			featureItems.push({
						xtype : 'panel',
						cls : 'privilege-grid-main-header granular-privilege-headers',
						text : title,
						padding : '5 0 0 10',
						items : [{
									xtype : 'checkbox',
									margin : '2 5 2 29',
									width : 30,
									height : 20,
									itemId : id + "_" + tmpType + "deleteIcon",
									border : 0,
									disabled : (mode == "VIEW") ? true : false
								}]
					});

		}
		if (isAuthFlagSelected) {
			featureItems.push({
						xtype : 'panel',
						cls : 'privilege-grid-main-header granular-privilege-headers',
						text : title,
						padding : '5 0 0 10',
						items : [{
									xtype : 'checkbox',
									margin : '2 5 2 29',
									width : 30,
									height : 20,
									itemId : id + "_" + tmpType + "authIcon",
									border : 0,
									disabled : (mode == "VIEW") ? true : false
								}]
					});

		}
		if (isDetailApproveFlagSelected) {
			featureItems.push({
						xtype : 'panel',
						cls : 'privilege-grid-main-header granular-privilege-headers',
						text : title,
						padding : '5 0 0 10',
						items : [{
									xtype : 'checkbox',
									margin : '2 5 2 29',
									width : 30,
									height : 20,
									itemId : id + "_" + tmpType
											+ "quickApproveIcon",
									border : 0,
									disabled : (mode == "VIEW") ? true : false
								}]
					});

		}
		
		if (isImportFlagSelected) {
			featureItems.push({
						xtype : 'panel',
						cls : 'privilege-grid-main-header granular-privilege-headers',
						text : title,
						padding : '5 0 0 10',
						items : [{
									xtype : 'checkbox',
									margin : '2 5 2 29',
									width : 30,
									height : 20,
									itemId : id + "_" + tmpType
											+ "importIcon",
									border : 0,
									disabled : (mode == "VIEW") ? true : false
								}]
					});

		}
	},
	setPriviligeMenu : function(feature, MODE, index, flag, strLastColumnMode) {
		var obj = new Object();
		var objMapModeAndValue = [];
		if(Ext.isEmpty(flag))
			flag = false;
		objMapModeAndValue['VIEW'] = feature.viewFlag;
		objMapModeAndValue['EDIT'] = feature.editFlag;
		objMapModeAndValue['DELETE'] = feature.deleteFlag;
		objMapModeAndValue['AUTH'] = feature.approveFlag;
		objMapModeAndValue['QUICKAPPROVE'] = feature.quickApproveFlag;
		objMapModeAndValue['IMPORT'] = feature.importFlag;

		objMapModeAndValue['SRVIEW'] = feature.srViewFlag;
		objMapModeAndValue['SREDIT'] = feature.srEditFlag;
		objMapModeAndValue['SRDELETE'] = feature.srDeleteFlag;
		objMapModeAndValue['SRAUTH'] = feature.srApproveFlag;
		objMapModeAndValue['SRQUICKAPPROVE'] = feature.srQuickApproveFlag;
		objMapModeAndValue['SRIMPORT'] = feature.srimportFlag;

		objMapModeAndValue['NRVIEW'] = feature.nrViewFlag;
		objMapModeAndValue['NREDIT'] = feature.nrEditFlag;
		objMapModeAndValue['NRDELETE'] = feature.nrDeleteFlag;
		objMapModeAndValue['NRAUTH'] = feature.nrApproveFlag;
		objMapModeAndValue['NRQUICKAPPROVE'] = feature.nrQuickApproveFlag;
		objMapModeAndValue['NRIMPORT'] = feature.nrimportFlag;
		obj.checked = this.getBooleanvalue(objMapModeAndValue[MODE]);
		if(flag)
			obj.checked = flag;
		obj.itemId = feature.accountId + "_" + feature.packageId + "_" + MODE;

		obj.mode = MODE;
		obj.accountId = feature.accountId;
		obj.packageId = feature.packageId;

		// obj.border = 1;
		if (null != obj.checked && undefined != obj.checked) {

			obj.defVal = obj.checked;
		}
		if (((MODE === "VIEW" || MODE === "EDIT" || MODE === "DELETE"
				|| MODE === "AUTH" || MODE === "QUICKAPPROVE") && !feature.isApplicableRep)
				|| ((MODE === "SRVIEW" || MODE === "SREDIT"
						|| MODE === "SRDELETE" || MODE === "SRAUTH" || MODE === "SRQUICKAPPROVE") && !feature.isApplicableSemiRep)
				|| ((MODE === "NRVIEW" || MODE === "NREDIT"
						|| MODE === "NRDELETE" || MODE === "NRAUTH" || MODE === "NRQUICKAPPROVE") && !feature.isApplicableNonRep)
				|| (MODE === "IMPORT" && (!feature.isApplicableImport || !feature.isApplicableRep))
				|| (MODE === "SRIMPORT" && (!feature.isApplicableImport || !feature.isApplicableSemiRep))
				|| (MODE === "NRIMPORT" && (!feature.isApplicableImport || !feature.isApplicableNonRep))) {
			obj.xtype = 'tbspacer';
			if (index % 2 == 0)
				obj.cls = 'whitetext privilege-grid-odd granular-privilege-headers';
			else
				obj.cls = 'whitetext privilege-grid-even granular-privilege-headers';
		} else {
			obj.xtype = "checkbox";
			if (index % 2 == 0)
				obj.cls = ' granular-cellContent privilege-grid-odd granular-privilege-headers';
			else
				obj.cls = ' granular-cellContent privilege-grid-even granular-privilege-headers';
			obj.height = 25;
			obj.padding = '0 0 0 0';
			obj.checkChange = function(){
			var panelPointer = this.up('panel');
			var TMPL_MODE = MODE.startsWith("SR") ? "SRVIEW" : MODE.startsWith("NR") ? "NRVIEW" : "VIEW";
				checkTmplGranularViewIfNotSelected(this.value,panelPointer,obj,TMPL_MODE);
			}
		}

		if (mode === "VIEW") {
			obj.readOnly = true;
		}
		var flag = 'N';
		for (var i in granularPrivfieldJson) {
			if (granularPrivfieldJson[i].itemId == obj.itemId) {
				flag = 'Y';
				break; // Stop this loop, we found it!
			}
		}

		if (flag === 'N') {
			granularPrivfieldJson.push(obj);

		}
		objMapModeAndValue = null;
		return obj;
	},

	createPrivilegesContainer : function(filteredData) {
		var self = this;
		var featureItems = [];
		// priviously submited granular Permissiong
		var prevPositivePayGranularPermissions = document
				.getElementById("templateGranularPermissions");
		var objTempMapModeAndValue =[];
		var objTempSrMapModeAndValue =[];
		var objTempNrMapModeAndValue =[];
		var templateGranularPrivHeaderViewIcon = Ext.ComponentQuery.query('checkbox[itemId=templateGranularPrivHeader_viewIcon]');
		if(!Ext.isEmpty(templateGranularPrivHeaderViewIcon))
			objTempMapModeAndValue['VIEW'] =templateGranularPrivHeaderViewIcon[0].checked;
		var templateGranularPrivHeaderquickApproveIcon = Ext.ComponentQuery.query('checkbox[itemId=templateGranularPrivHeader_quickApproveIcon]');
		if(!Ext.isEmpty(templateGranularPrivHeaderquickApproveIcon))
			objTempMapModeAndValue['QUICKAPPROVE']=templateGranularPrivHeaderquickApproveIcon[0].checked;
		var templateGranularPrivHeadereditIcon = Ext.ComponentQuery.query('checkbox[itemId=templateGranularPrivHeader_editIcon]');
		if(!Ext.isEmpty(templateGranularPrivHeadereditIcon))
			objTempMapModeAndValue['EDIT'] =templateGranularPrivHeadereditIcon[0].checked;
		var templateGranularPrivHeaderapproveIcon = Ext.ComponentQuery.query('checkbox[itemId=templateGranularPrivHeader_authIcon]');
		if(!Ext.isEmpty(templateGranularPrivHeaderapproveIcon))
			objTempMapModeAndValue['AUTH'] =templateGranularPrivHeaderapproveIcon[0].checked;
		var templateGranularPrivHeaderimportIcon = Ext.ComponentQuery.query('checkbox[itemId=templateGranularPrivHeader_importIcon]');
		if(!Ext.isEmpty(templateGranularPrivHeaderimportIcon))
			objTempMapModeAndValue['IMPORT'] =templateGranularPrivHeaderimportIcon[0].checked;
		var templateGranularPrivHeaderdeleteIcon = Ext.ComponentQuery.query('checkbox[itemId=templateGranularPrivHeader_deleteIcon]');
		if(!Ext.isEmpty(templateGranularPrivHeaderdeleteIcon))
			objTempMapModeAndValue['DELETE']=templateGranularPrivHeaderdeleteIcon[0].checked;
	//sr//nr
		var templateGranularPrivHeadersrViewIcon = Ext.ComponentQuery.query('checkbox[itemId=templateGranularPrivHeader_srviewIcon]');
		if(!Ext.isEmpty(templateGranularPrivHeadersrViewIcon))
			objTempSrMapModeAndValue['SRVIEW']=templateGranularPrivHeadersrViewIcon[0].checked;
		var templateGranularPrivHeadersrquickApproveIcon = Ext.ComponentQuery.query('checkbox[itemId=templateGranularPrivHeader_srquickApproveIcon]');
		if(!Ext.isEmpty(templateGranularPrivHeadersrquickApproveIcon))
			objTempSrMapModeAndValue['SRQUICKAPPROVE']=templateGranularPrivHeadersrquickApproveIcon[0].checked;
		var templateGranularPrivHeadersreditIcon = Ext.ComponentQuery.query('checkbox[itemId=templateGranularPrivHeader_sreditIcon]');
		if(!Ext.isEmpty(templateGranularPrivHeadersreditIcon))
			objTempSrMapModeAndValue['SREDIT']=templateGranularPrivHeadersreditIcon[0].checked;
		var templateGranularPrivHeadersrapproveIcon = Ext.ComponentQuery.query('checkbox[itemId=templateGranularPrivHeader_srauthIcon]');
		if(!Ext.isEmpty(templateGranularPrivHeadersrapproveIcon))
			objTempSrMapModeAndValue['SRAUTH']=templateGranularPrivHeadersrapproveIcon[0].checked;
		var templateGranularPrivHeadersrimportIcon = Ext.ComponentQuery.query('checkbox[itemId=templateGranularPrivHeader_srimportIcon]');
		if(!Ext.isEmpty(templateGranularPrivHeadersrimportIcon))
			objTempSrMapModeAndValue['SRIMPORT']=templateGranularPrivHeadersrimportIcon[0].checked;
		var templateGranularPrivHeadersrdeleteIcon = Ext.ComponentQuery.query('checkbox[itemId=templateGranularPrivHeader_srdeleteIcon]');
		if(!Ext.isEmpty(templateGranularPrivHeadersrdeleteIcon))
			objTempSrMapModeAndValue['SRDELETE']=templateGranularPrivHeadersrdeleteIcon[0].checked;
			
		var templateGranularPrivHeadernrViewIcon = Ext.ComponentQuery.query('checkbox[itemId=templateGranularPrivHeader_nrviewIcon]');
		if(!Ext.isEmpty(templateGranularPrivHeadernrViewIcon))
			objTempNrMapModeAndValue['NRVIEW']=templateGranularPrivHeadernrViewIcon[0].checked;
		var templateGranularPrivHeadernrquickApproveIcon = Ext.ComponentQuery.query('checkbox[itemId=templateGranularPrivHeader_nrquickApproveIcon]');
		if(!Ext.isEmpty(templateGranularPrivHeadernrquickApproveIcon))
			objTempNrMapModeAndValue['NRQUICKAPPROVE']=templateGranularPrivHeadernrquickApproveIcon[0].checked;
		var templateGranularPrivHeadernreditIcon = Ext.ComponentQuery.query('checkbox[itemId=templateGranularPrivHeader_nreditIcon]');
		if(!Ext.isEmpty(templateGranularPrivHeadernreditIcon))
			objTempNrMapModeAndValue['NREDIT']=templateGranularPrivHeadernreditIcon[0].checked;
		var templateGranularPrivHeadernrapproveIcon = Ext.ComponentQuery.query('checkbox[itemId=templateGranularPrivHeader_nrauthIcon]');
		if(!Ext.isEmpty(templateGranularPrivHeadernrapproveIcon))
			objTempNrMapModeAndValue['NRAUTH']=templateGranularPrivHeadernrapproveIcon[0].checked;
		var templateGranularPrivHeadernrimportIcon = Ext.ComponentQuery.query('checkbox[itemId=templateGranularPrivHeader_nrimportIcon]');
		if(!Ext.isEmpty(templateGranularPrivHeadernrimportIcon))
			objTempNrMapModeAndValue['NRIMPORT']=templateGranularPrivHeadernrimportIcon[0].checked;
		var templateGranularPrivHeadernrdeleteIcon = Ext.ComponentQuery.query('checkbox[itemId=templateGranularPrivHeader_nrdeleteIcon]');
		if(!Ext.isEmpty(templateGranularPrivHeadernrdeleteIcon))
			objTempNrMapModeAndValue['NRDELETE']=templateGranularPrivHeadernrdeleteIcon[0].checked;
		
		
		
		
		Ext.each(filteredData, function(feature, index) {
			var panel = Ext.create('Ext.panel.Panel', {
						columnWidth : 1,
						layout : 'column',
						bodyStyle : {
							background : '#FAFAFA'
						}
					});
			var accountText = feature.accountNo + '|' + feature.accountName;
			var packageKey = feature.productCategoryCode + '|'
					+ feature.packageId;

			if (self.allPackagesSelectedFlag == 'Y'
					|| payPackageAssignedMap[packageKey] == true) {
				if (self.allAccountsSelectedFlag == 'Y'
						|| accountAssignedMap[accountText] == true) {

					panel.insert({
						xtype : 'label',
						text : feature.accountNo,
						padding : '5 0 0 10',
						height : 'auto',
						cls : 'ux_text-elipsis granular-privilege-accountno privilege-grid-main-header privilege-grid-odd privilege-admin-rights',
						autoEl : {
							tag : 'label',
							'data-qtip' : feature.accountNo
						}
					});
					panel.insert({
						xtype : 'label',
						text : feature.accountName,
						padding : '5 0 0 10',
						height : 'auto',
						cls : 'ux_text-elipsis granular-privilege-accountno privilege-grid-odd privilege-admin-rights',
						autoEl : {
							tag : 'label',
							'data-qtip' : feature.accountName
						}
					});
					panel.insert({
						xtype : 'label',
						text : feature.packageName,
						padding : '5 0 0 10',
						height : 'auto',
						cls : 'ux_text-elipsis granular-privilege-headers privilege-grid-odd privilege-admin-rights',
						autoEl : {
							tag : 'label',
							'data-qtip' : feature.packageName
						}
					});

					if (self
							.isHiddenElementNotNull(prevPositivePayGranularPermissions)) {
						var previouslySubmitedJsonObj = Ext
								.decode(prevPositivePayGranularPermissions.value);
						self.updateFeatureIfPreviouslySelected(feature,
								previouslySubmitedJsonObj);

					}

					if (self.repetitiveFlag == 'Y') {
						self.createPrivilegeContainerForTemplateType(panel,
								feature, index, '',objTempMapModeAndValue);
					}

					if (self.semiRepetitiveFlag == 'Y') {
						self.createPrivilegeContainerForTemplateType(panel,
								feature, index, 'SR',objTempSrMapModeAndValue);
					}

					if (self.nonRepetitiveFlag == 'Y') {
						self.createPrivilegeContainerForTemplateType(panel,
								feature, index, 'NR',objTempNrMapModeAndValue);

					}
					featureItems.push(panel);
				}
			}
		});

		for (var i = 0; i < featureItems.length; i++) {
			var panels = featureItems[i];
			var panelId = Ext.getCmp(panels.id);
			if (i % 2 == 0) { // white privilege-grid-odd
				for (var j = 0; j < panels.items.items.length; j++) {
					if (panels.items.items[j].hasCls('privilege-grid-even')) {
						panels.items.items[j].removeCls('privilege-grid-even');
						panels.items.items[j].addCls('privilege-grid-odd');
					}
				}
			} else { // grey privilege-grid-even
				for (var k = 0; k < panels.items.items.length; k++) {
					if (panels.items.items[k].hasCls('privilege-grid-odd')) {
						panels.items.items[k].removeCls('privilege-grid-odd');
						panels.items.items[k].addCls('privilege-grid-even');
					}
				}
			}
		}

		return featureItems;

	},
	createPrivilegeContainerForTemplateType : function(panel, feature, index,
			tempType,objTempMapModeAndValue) {
		var self = this;
		// var strLastColumnMode = self.getLastPrivilegeColumn();
		if (viewColumnCreated)
			panel.insert(self.setPriviligeMenu(feature, tempType + "VIEW",
					index,objTempMapModeAndValue[tempType + "VIEW"]));
		if (editColumnCreated)
			panel.insert(self.setPriviligeMenu(feature, tempType + "EDIT",
					index,objTempMapModeAndValue[tempType + "EDIT"]));
		if (deleteColumnCreated)
			panel.insert(self.setPriviligeMenu(feature, tempType + "DELETE",
					index,objTempMapModeAndValue[tempType + "DELETE"]));
		if (authColumnCreated)
			panel.insert(self.setPriviligeMenu(feature, tempType + "AUTH",
					index,objTempMapModeAndValue[tempType + "AUTH"]));
		if (detailApproveColumnCreated)
			panel.insert(self.setPriviligeMenu(feature, tempType
							+ "QUICKAPPROVE", index,objTempMapModeAndValue[tempType + "QUICKAPPROVE"]));
		if (importColumnCreated)
			panel.insert(self.setPriviligeMenu(feature, tempType
							+ "IMPORT", index,objTempMapModeAndValue[tempType + "IMPORT"]));
	},
	setSplitTemplateData : function(){
		var self = this;
		var data = self.loadGranularFeaturs();
		var filteredData = this.filterFeatures(data);
		totalTPRecordFrmServer = filteredData.length;
		var temp = totalTPRecordFrmServer/totalTPDisplay;
		granularTPTotalRecordPage = totalTPRecordFrmServer/granularTPageSize;
		numberTPRecordsToDisplay = 0;
		totalNumberTPRecordsDisplayed = 0;
		navigationTPVisible = true;
		Ext.each(filteredData, function(feature, index) {
			var accountText = feature.accountNo + '|' + feature.accountName;
			var packageKey = feature.productCategoryCode + '|'
					+ feature.packageId;

			if (self.allPackagesSelectedFlag == 'Y'
					|| payPackageAssignedMap[packageKey] == true) {
				if (self.allAccountsSelectedFlag == 'Y'
						|| accountAssignedMap[accountText] == true) {
					numberTPRecordsToDisplay++;	
				}
			}
		});
		for(var i=0;i<temp;i++)
		{
			if((totalTPRecordFrmServer)<=(((i+1)*totalTPDisplay)-1))
				totalTPRecordsDisplay.push(totalTPRecordFrmServer-(totalTPDisplay*i));
			else
				totalTPRecordsDisplay.push(totalTPDisplay);
		}
		granularTPOverAllTTotalPage = totalTPRecordsDisplay.length;
	},
	getSplitTemplateData : function(calledFrom,filteredData,prevRecordMaxCountLoc,nextMinRecordCountLoc){
		if(totalTPRecordFrmServer<totalTPDisplay && calledFrom=='onLoad')
			return filteredData;
		var filteredDataTemp = [];
		if(calledFrom=='onLoad')
		{
			for(var k=0;k<totalTPRecordsDisplay[0];k++){
				filteredDataTemp.push(filteredData[k])
			}
		}
		else//Calling from pagination
		{
			for(var k=prevRecordMaxCountLoc;k<nextMinRecordCountLoc;k++){
				filteredDataTemp.push(filteredData[k])
			}
		}
		return filteredDataTemp;
	},setTemplateGranularRightsNew : function(calledFrom,prevRecordMaxCountLoc,nextMinRecordCountLoc){
			var self = this;
			var data = self.loadGranularFeaturs();
			var filteredData = this.filterFeatures(data);
			var featureItems = [];
			var splitFilterData = this.getSplitTemplateData(calledFrom,filteredData,prevRecordMaxCountLoc,nextMinRecordCountLoc);
			featureItems = self.createPrivilegesContainer(splitFilterData);
			//featureItems = self.createPrivilegesContainer(filteredData);
			granularTPrivfieldJsonTemp = [];
			for (var i in featureItems) {
				granularTPrivfieldJsonTemp.push(featureItems[i]);
			}
			granularTTotalNumberOfRecord = granularTPrivfieldJsonTemp.length;
			granularTTotalPage = granularTTotalNumberOfRecord/granularTPageSize;
	},
	setTemplateGranularRights : function() {
		var self = this;
		var data = self.loadGranularFeaturs();
		var filteredData = this.filterFeatures(data);
		var featureItems = [];
		
		var splitFilterData = this.getSplitTemplateData('onLoad',filteredData,'','');
		featureItems = self.createPrivilegesContainer(splitFilterData);
		if(featureItems.length<granularTPageSize || numberTPRecordsToDisplay<=100)
		{
			featureItems = [];
			featureItems = self.createPrivilegesContainer(filteredData);
			navigationTPVisible = false;
			return featureItems;
		}
		//featureItems = self.createPrivilegesContainer(filteredData);
		var featureItemsTemp = [];
		var tempPageSize = granularTPageSize;
		if(featureItems.length<granularTPageSize)
			tempPageSize = featureItems.length;
		for(var k=0;k<tempPageSize;k++){
			featureItemsTemp.push(featureItems[k])
			totalNumberTPRecordsDisplayed++;
		}
		return featureItemsTemp;
	},loadGranularFeatursNew : function(){
		return granularTPrivfieldJsonTemp;
	},resetPaginationValues : function(){
		granularTPageNo = 1;
		granularTCount = 1;
		granularTPageSize = 10;
		granularTTotalPage = 1;
		granularTTotalNumberOfRecord = 1;
	},resetAll : function(){
		var thisClass = this;
		currentTPBunchOfPage = 0;
		granularTPOverAllTTotalPage = 1;
		granularTPOverAllTPageNo = 1;
		prevTPRecordMaxCount=0;
		nextTPMinRecordCount=0;
		numberTPRecordsToDisplay = 0;
		granularTPTotalRecordPage=0;
		totalTPRecordsDisplay = [];
		thisClass.resetPaginationValues();
	},showError : function(calledFrom){
		var errMsg ="Navigation not Allowed";
		if(calledFrom=='navigationNotAllowed')
			errMsg = "Navigation not Allowed" ;
		else if(calledFrom=='first')
			errMsg = "Navigation not Allowed, Already in First Page" ;
		else if(calledFrom=='last')
			errMsg = "Navigation not Allowed, Already in Last Page" ;
		else if(calledFrom=='next')
			errMsg = "Navigation not Allowed, Already in Last Page" ;
		else if(calledFrom=='previous')
			errMsg = "Navigation not Allowed, Already in First Page" ;
			
		Ext.MessageBox.show({
			title : getLabel(
			'granularNavigationError',
			'Error'),
			msg : errMsg,
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
		});
		
	},
	nextItems : function() {
		var thisClass = this;
		if(!navigationTPVisible)
		{
			thisClass.showError('navigationNotAllowed');
			return;
		}
		if((granularTTotalPage<granularTPageNo && granularTPOverAllTPageNo>granularTPOverAllTTotalPage) 
			|| totalNumberTPRecordsDisplayed==numberTPRecordsToDisplay)
		{
			thisClass.showError('next');
			return;
		}
		thisClass.saveItemsTemp();
		Ext.getCmp('templateGranPrivParametersSection').removeAll();
		if((granularTTotalPage<=granularTPageNo && granularTPOverAllTPageNo<=granularTPOverAllTTotalPage) 
					&& granularTPTotalRecordPage>granularTTotalPage)
		{
			prevTPRecordMaxCount = prevTPRecordMaxCount + totalTPRecordsDisplay[currentTPBunchOfPage];
			currentTPBunchOfPage = currentTPBunchOfPage+1;
			nextTPMinRecordCount = totalTPRecordsDisplay[currentTPBunchOfPage];
			thisClass.setTemplateGranularRightsNew('pagination',prevTPRecordMaxCount,prevTPRecordMaxCount+nextTPMinRecordCount);
			granularTPOverAllTPageNo = granularTPOverAllTPageNo + 1;
			granularTPageNo = 0;
		}
		else if(currentTPBunchOfPage==0)
			thisClass.setTemplateGranularRightsNew('onLoad','','');
		else{
			var tempPrevTP = totalTPRecordsDisplay[currentTPBunchOfPage]*(granularTPOverAllTPageNo-1);
			var tempNextTP = totalTPRecordsDisplay[currentTPBunchOfPage];
			thisClass.setTemplateGranularRightsNew('pagination',tempPrevTP,tempNextTP+tempPrevTP);
		}

		var temp1 = granularTPageSize*granularTPageNo;
		granularTPageNo = granularTPageNo+1;
		
		var featureItems = [];
		var temp = granularTPageSize*granularTPageNo;
		var granularPrivfieldJsonTempNew = thisClass.loadGranularFeatursNew();
		if(temp>granularPrivfieldJsonTempNew.length)
			temp = granularPrivfieldJsonTempNew.length;
		for(var k=temp1;k<temp;k++){
			featureItems.push(granularPrivfieldJsonTempNew[k]);
			totalNumberTPRecordsDisplayed++;
		}
		//featureItems = self.createPrivilegesContainer(featureItemsTemp);
		Ext.getCmp('templateGranPrivParametersSection').add(featureItems);
		
	},
	lastItems : function() {
		var thisClass = this;
		if(!navigationTPVisible)
		{
			thisClass.showError('navigationNotAllowed');
			return;
		}
		if((granularTTotalPage<granularTPageNo && granularTPOverAllTPageNo>granularTPOverAllTTotalPage) 
			|| totalNumberTPRecordsDisplayed==numberTPRecordsToDisplay)
		{
			thisClass.showError('last');
			return;
		}
		thisClass.saveItemsTemp();
		Ext.getCmp('templateGranPrivParametersSection').removeAll();
		thisClass.resetAll();
		thisClass.setSplitTemplateData();
		prevTPRecordMaxCount = totalTPDisplay * (granularTPOverAllTTotalPage-1);
		nextTPMinRecordCount = prevTPRecordMaxCount + totalTPRecordsDisplay[granularTPOverAllTTotalPage-1];
		currentTPBunchOfPage = granularTPOverAllTTotalPage-1;
		thisClass.setTemplateGranularRightsNew('pagination',prevTPRecordMaxCount,nextTPMinRecordCount);
		granularTPOverAllTPageNo = granularTPOverAllTTotalPage;
		//granularPageNo = 0;
		var granularPrivfieldJsonTempNew = thisClass.loadGranularFeatursNew();
		while(granularPrivfieldJsonTempNew.length==0 && granularTPOverAllTPageNo>1)
		{		
			granularTPOverAllTPageNo = currentTPBunchOfPage;
			currentTPBunchOfPage--;
			prevTPRecordMaxCount = totalTPDisplay * (currentTPBunchOfPage);
			nextTPMinRecordCount = prevTPRecordMaxCount + totalTPRecordsDisplay[currentTPBunchOfPage];
			thisClass.setTemplateGranularRightsNew('pagination',prevTPRecordMaxCount,nextTPMinRecordCount);
			granularPrivfieldJsonTempNew = thisClass.loadGranularFeatursNew();
		}
		granularTPageNo = Math.ceil(granularTTotalPage);
		var temp1 = granularTPageSize*(granularTPageNo-1);
		//granularPageNo = granularPageNo+1;
		var featureItems = [];
		var temp = granularTPageSize*granularTPageNo;
		if(temp>granularPrivfieldJsonTempNew.length)
			temp = granularPrivfieldJsonTempNew.length;
		for(var k=temp1;k<temp;k++){
			featureItems.push(granularPrivfieldJsonTempNew[k])
		}
		totalNumberTPRecordsDisplayed=numberTPRecordsToDisplay;
		Ext.getCmp('templateGranPrivParametersSection').add(featureItems);
		
	},
	firstItems : function(){
		var thisClass = this;
		if(!navigationTPVisible)
		{
			thisClass.showError('navigationNotAllowed');
			return;
		}
		if(granularTPageNo==1 && granularTPOverAllTPageNo==1)
		{
			thisClass.showError('first');
			return;
		}
		thisClass.saveItemsTemp();
		Ext.getCmp('templateGranPrivParametersSection').removeAll();
		thisClass.resetAll();
		thisClass.setSplitTemplateData();
		thisClass.setTemplateGranularRightsNew('onLoad');
		Ext.getCmp('templateGranPrivParametersSection').add(thisClass.setTemplateGranularRights() );
	},
	previousItems : function() {
		var self = this;
		if(!navigationTPVisible)
		{
			self.showError('navigationNotAllowed');
			return;
		}
		if(granularTPageNo==1 && granularTPOverAllTPageNo==1)
		{
			self.showError('previous');
			return;
		}
		self.saveItemsTemp();
		Ext.getCmp('templateGranPrivParametersSection').removeAll();
		if((granularTPageNo == 1 && granularTPOverAllTPageNo<=granularTPOverAllTTotalPage) 
					&& granularTPTotalRecordPage>granularTTotalPage)
		{
			//prevPaymentRecordMaxCount = totalPaymentRecordsDisplay[currentPaymentBunchOfPage]*(granularPaymentOverAllTPageNo-1);
			prevTPRecordMaxCount = totalTPDisplay*currentTPBunchOfPage;
			currentTPBunchOfPage = currentTPBunchOfPage-1;
			nextTPMinRecordCount = totalTPRecordsDisplay[currentTPBunchOfPage];
			self.setTemplateGranularRightsNew('pagination',prevTPRecordMaxCount-nextTPMinRecordCount,prevTPRecordMaxCount);
			granularTPOverAllTPageNo = granularTPOverAllTPageNo - 1;
			granularTPageNo = Math.ceil(granularTTotalPage)+1;
		}
		else if(prevTPRecordMaxCount==0)
			self.setTemplateGranularRightsNew('onLoad','','');
		else
		{
			//var tempPrevTP = totalTPRecordsDisplay[currentTPBunchOfPage]*(granularTPOverAllTPageNo);
			var tempPrevTP = totalTPDisplay*currentTPBunchOfPage;
			var tempNextTP = totalTPRecordsDisplay[currentTPBunchOfPage];
			self.setTemplateGranularRightsNew('pagination',tempPrevTP,tempPrevTP+tempNextTP);
		}
		
		if(granularTPageNo>1)
		{
			granularTPageNo = granularTPageNo-1;
		}
		var temp1 = granularTPageSize*granularTPageNo;
		var featureItems1 = [];
		var temp = temp1 - granularTPageSize;
		var granularPrivfieldJsonTempNew = self.loadGranularFeatursNew();
		for(var kk=temp;kk<temp1;kk++){
			featureItems1.push(granularPrivfieldJsonTempNew[kk])
		}
		if(granularTPageNo==1 && granularTPOverAllTPageNo==1)
		{
			prevTPRecordMaxCount = 0;
			nextTPMinRecordCount = 0;
			totalNumberTPRecordsDisplayed = temp+temp1;
		}
		Ext.getCmp('templateGranPrivParametersSection').add(featureItems1);
	},

	filterHandler : function() {
		var self = this;
		var filterCode = Ext.getCmp('templateAccountIDFilterItemId').getValue();
		var packageName = Ext.getCmp('templatePayPkgFilterItemId').getValue();

		Ext.getCmp('templateGranPrivParametersSection').removeAll();
		var filterResponse = [];
		// console.log("filterCode "+filterCode);
		var filteredData;
		if (filterCode && packageName) {
			templateGranularFeatureData.forEach(function(arrayElem) {

				if ((arrayElem.accountId === filterCode && arrayElem.packageId === packageName)
						|| ((arrayElem.accountId === filterCode)
								&& ((arrayElem.packageName.toUpperCase()
										.indexOf(packageName.toUpperCase()) > -1) || (arrayElem.packageId === packageName)))) {
					// console.log("arrayElem "+arrayElem);
					filterResponse.push(JSON.parse(JSON.stringify(arrayElem)));
					// break;
				}
			});
			filteredData = filterResponse;
			navigationTPVisible = false;
			isFilterApplied = true;
		} else if (packageName) {
			templateGranularFeatureData.forEach(function(arrayElem) {
						if ((arrayElem.packageId.toUpperCase() === packageName
								.toUpperCase())
								|| (arrayElem.packageName.toUpperCase()
										.indexOf(packageName.toUpperCase()) > -1)) {
							// console.log("arrayElem "+arrayElem);
							filterResponse.push(JSON.parse(JSON
									.stringify(arrayElem)));
							// break;
						}
					});

			filteredData = filterResponse;
			navigationTPVisible = false;
			isFilterApplied = true;

		} else if (filterCode) {
			templateGranularFeatureData.forEach(function(arrayElem) {
				if (arrayElem.accountId === filterCode) {
					// console.log("arrayElem "+arrayElem);
					filterResponse.push(JSON.parse(JSON.stringify(arrayElem)));
					// break;
				}
			});

			filteredData = filterResponse;
			navigationTPVisible = false;
			isFilterApplied = true;
		} else {
			filteredData = this.filterFeatures(templateGranularFeatureData);
			isFilterApplied = false;
		}
		var featureItems = [];
		if(!isFilterApplied)
			{
				var filteredDataTemp = this.getSplitTemplateData('onLoad',filteredData,'','');
				featureItems = self.createPrivilegesContainer(filteredDataTemp);
				if(featureItems.length<granularTPageSize || numberTPRecordsToDisplay<=100)
				{	
					var featureItemsTemp = [];
					featureItemsTemp = self.createPrivilegesContainer(filteredData);
					navigationTPVisible = false;
				}
				else
				{
					navigationTPVisible = true;
					self.resetPaginationValues();
					var featureItemsTemp = [];
					var temp = granularTPageSize;
					if(featureItems.length<granularTPageSize)
						temp = featureItems.length;
					for(var k=0;k<temp;k++){
						featureItemsTemp.push(featureItems[k])
					}
				}
				Ext.getCmp('templateGranPrivParametersSection').add(featureItemsTemp);
			}
			else{
				featureItems = self.createPrivilegesContainer(filteredData);
				Ext.getCmp('templateGranPrivParametersSection').add(featureItems);
			}
	},

	initComponent : function() {
		var thisClass = this;
		thisClass.setPaymentRights();
		thisClass.setPaymentPackagesData();
		thisClass.setPaymentAccounts();
		thisClass.setSplitTemplateData();
		thisClass.resetPaginationValues();
		thisClass.setTemplateGranularRightsNew('onLoad');
		thisClass.items = [{
			xtype : 'panel',
			width : 'auto',
			items : [{
				xtype : 'panel',
				width : 'auto',
				id : 'templateGranularPrivFilterBox',
				layout : 'column',
				cls : 'ft-padding-bottom',
				items : [{
					xtype : 'AutoCompleter',
					// cls : 'autoCmplete-field ux_paddingb ',
					fieldCls : 'xn-form-text xn-suggestion-box popup-searchBox',
					id : 'templateAccountIDFilterItemId',
					itemId : 'templateAccountIDFilterItemId',
					name : 'templateAccountIDFilterItemId',
					fieldLabel : getLabel('lbl.account', 'Account'),
					labelCls : 'ft-bold-font page-content-font',
					labelAlign : 'top',
					matchFieldWidth : true,
					labelSeparator : '',
					fieldLabel : getLabel('lbl.account', 'Account'),
					cfgUrl : 'services/userseek/accountPackagesSeekForSI.json',
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					cfgSeekId : 'templateAccountIDFilterItemId',
					cfgRootNode : 'd.preferences',
					cfgKeyNode : 'ID',
					cfgDataNode1 : 'DESCRIPTION',
					cfgStoreFields : ['ID', 'CODE', 'DESCRIPTION'],
					cfgExtraParams : [{
								key : '$filtercode1',
								value : catCorporationCode
							}],
					emptyText : getLabel('searchByAccNumberOrName',
							'Search by Account number or name'),
					listeners : {
						'select' : function() {
							thisClass.filterHandler();
							var selected = thisClass
									.down('component[itemId="accountClearLink"]');
							selected.show();
						},
						'change' : function() {
							var filterContainer = thisClass
									.down('[itemId="templateAccountIDFilterItemId"]');
							if (Ext.isEmpty(filterContainer.getValue())) {
								var selected = thisClass
										.down('component[itemId="accountClearLink"]');
								selected.hide();
								thisClass.filterHandler();
							}
						}
					}
				}, {
					xtype : 'component',
					layout : 'hbox',
					itemId : 'accountClearLink',
					hidden : true,
					style : {
						'line-height' : 4
					},
					cls : 'clearlink-a cursor_pointer page-content-font ft-padding-l',
					html : '<a>' + getLabel('clear', 'Clear') + '</a>',
					listeners : {
						'click' : function() {
							var filterContainer = thisClass
									.down('[itemId="templateAccountIDFilterItemId"]');
							filterContainer.setValue("");
							var selected = thisClass
									.down('component[itemId="accountClearLink"]');
							selected.hide();
							thisClass.filterHandler();
						},
						element : 'el',
						delegate : 'a'
					}
				}, {
					xtype : 'AutoCompleter',
					margin : '0 0 0 40',
					// cls : 'autoCmplete-field ux_paddingb ',
					fieldCls : 'xn-form-text xn-suggestion-box popup-searchBox',
					id : 'templatePayPkgFilterItemId',
					itemId : 'templatePayPkgFilterItemId',
					name : 'templatePayPkgFilterItemId',
					matchFieldWidth : true,
					labelSeparator : '',
					fieldLabel : getLabel('pmtPackage', 'Packages'),
					labelCls : 'ft-bold-font page-content-font',
					labelAlign : 'top',
					cfgUrl : 'services/userseek/packagesSeekForSI.json',
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					cfgSeekId : 'templatePayPkgFilterItemId',
					cfgRootNode : 'd.preferences',
					cfgKeyNode : 'PKGID',
					cfgDataNode1 : 'PKGNAME',
					cfgStoreFields : ['PKGID', 'PKGNAME'],
					cfgExtraParams : [{
								key : '$filtercode1',
								value : catCorporationCode
							}],
					emptyText : getLabel('searchByPmtPackage',
							'Search by Payment Package'),
					listeners : {
						'select' : function() {
							thisClass.filterHandler();
							var selected = thisClass
									.down('component[itemId="paypkgClearLink"]');
							selected.show();
						},
						'change' : function() {
							var filterContainer = thisClass
									.down('[itemId="templatePayPkgFilterItemId"]');
							if (Ext.isEmpty(filterContainer.getValue())) {
								var selected = thisClass
										.down('component[itemId="paypkgClearLink"]');
								selected.hide();
								thisClass.filterHandler();
							}
						}
					}
				}, {
					xtype : 'component',
					layout : 'hbox',
					itemId : 'paypkgClearLink',
					hidden : true,
					style : {
						'line-height' : 4
					},
					cls : 'clearlink-a cursor_pointer page-content-font ft-padding-l',
					html : '<a>' + getLabel('clear', 'Clear') + '</a>',
					listeners : {
						'click' : function() {
							var filterContainer = thisClass
									.down('[itemId="templatePayPkgFilterItemId"]');
							filterContainer.setValue("");
							var selected = thisClass
									.down('component[itemId="paypkgClearLink"]');
							selected.hide();
							thisClass.filterHandler();
						},
						element : 'el',
						delegate : 'a'
					}
				}
				/*
				 * { xtype : 'button', margin : '10 0 0 40', cls : 'xn-button
				 * ux_button-background-color ux_search-button', glyph :
				 * 'xf002@fontawesome', text : getLabel( 'btnSearch', 'Search' ),
				 * itemId :'searchBtnItemId', handler : function(btn,opts) {
				 * //var me =this; thisClass.filterHandler(); } }
				 */

				]

			}]
		}, {
			xtype : 'container',
			itemId : 'outerContainer',
			overflowX : 'auto',
			overflowY : 'hidden',
			cls : 'privilege',
			maxHeight : 1800,
			width : 'auto',
			items : [{
						xtype : 'panel',
						width : 'auto',
						id : 'templateGranularPrivColumnHeaderTop',
						// layout:'column',
						layout : {
							type : 'hbox'
						},
						// cls: 'alignLeft granularborder',
						cls : 'mainHeader',
						padding : '0 0 0 10',
						items : thisClass.setTemplateColumnHeader()
					}, {
						xtype : 'panel',
						width : 'auto',
						// cls : 'border',
						items : [{
									xtype : 'panel',
									width : 'auto',
									padding : '0 0 0 10',
									id : 'templateGranularPrivColumnHeader',
									// layout:'column',
									layout : {
										type : 'hbox'
									},
									cls : 'mainHeader',
									items : thisClass.setColumnHeader()
								}]
					}, {
						xtype : 'panel',
						width : 'auto',
						layout : {
							type : 'vbox'
						},
						maxHeight : 1800,
						items : [{
							xtype : 'panel',
							id : 'templateGranularPrivHeader',
							layout : 'column',
							cls : 'red-bg',
							width : 'auto',
							height : 50,
							items : thisClass.setPanelHeader(
									'templateGranularPrivHeader', getLabel(
											'lbl.account', 'Account'))
						}, {
							xtype : 'panel',
							// overflowY: 'auto',
							width : 'auto',
							maxHeight : 1800,
							layout : {
								type : 'vbox'
							},
							titleAlign : "left",
							// collapsible : true,
							cls : 'xn-ribbon',
							collapseFirst : true,
							itemId : 'templateGranPrivParametersSection',
							id : 'templateGranPrivParametersSection',
							// layout:'column',
							layout : {
								type : 'vbox'
							},
							items : thisClass.setTemplateGranularRights()

						}]
					}]
		}];
		if (mode === "VIEW") {
			thisClass.bbar = ['->', {
						text : getLabel('btnClose', 'Close'),
						cls : 'ft-button-primary',
						// cls : 'ux_button-padding ux_button-background-color',
						handler : function(btn, opts) {
							thisClass.close();
						}
					}];
		} else {
			thisClass.bbar = [{
						text : getLabel('btnCancel', 'Cancel'),
						cls : 'ft-button-light',
						// cls : 'ux_button-padding ux_button-background-color',
						handler : function(btn, opts) {
							thisClass.destroy();
							objTemplatesGranularPrivPriviligePopup = null;
							document.getElementById("templateGranularPermissions").value='';
							// thisClass.hide();
						}
					}, '->',{ 
			        	  text: getLabel('First','First'),
			        	  cls : 'ft-button-primary',
						  //hidden  : !isNavigationVisible(),
			        	  /*handler : function(btn,opts) {
			        	  	thisClass.saveItems();
			        		thisClass.close();
			        				}*/
						 listeners: {
						  click : function(){
						  thisClass.firstItems();
						  }
							}			
			          },
					  { 
			        	  text: getLabel('Previous','Previous'),
			        	  cls : 'ft-button-primary',
			        	  /*handler : function(btn,opts) {
			        	  	thisClass.saveItems();
			        		thisClass.close();
			        				}*/
						 listeners: {
						  click : function(){
						  thisClass.previousItems();
						  }
							}			
			          },
					  { 
			        	  text: getLabel('Next','Next'),
			        	  cls : 'ft-button-primary',
			        	  /*handler : function(btn,opts) {
			        	  	thisClass.saveItems();
			        		thisClass.close();
			        				}*/
						 listeners: {
						  click : function(){
						  thisClass.nextItems();
						  }
							}			
			          },{ 
			        	  text: getLabel('Last','Last'),
			        	  cls : 'ft-button-primary',
						  //hidden  : !isNavigationVisible(),
			        	  /*handler : function(btn,opts) {
			        	  	thisClass.saveItems();
			        		thisClass.close();
			        				}*/
						 listeners: {
						  click : function(){
						  thisClass.lastItems();
						  }
							}			
			          }, {
						text : getLabel('submit', 'Submit'),
						cls : 'ft-button-primary',
						// cls : 'ux_button-padding ux_button-background-color
						// ux_largemargin-right',
						handler : function(btn, opts) {
							thisClass.saveItems();
							thisClass.close();
						}
					}];
		}
		this.callParent(arguments);
	},

	saveItems : function() {
		var me = this;
		var jsonData = {};
		Ext.each(granularPrivfieldJson, function(field, index) {
			var featureId = field.itemId;
			var accountId = field.accountId;
			var pkgId = field.packageId;
			var element = me.down('checkboxfield[itemId=' + featureId + ']');
			var objectKey = accountId + '_' + pkgId;

			if (element != null && element != undefined && !element.hidden) {

				var mode = element.mode;
				// console.log("jsonData :"+JSON.stringify(jsonData));
				if (!(objectKey in jsonData)) {
					// console.log("accountiD adding for first time
					// :"+accountId);
					var newEntry = {};
					newEntry['accountId'] = accountId;
					newEntry['packageId'] = pkgId;
					newEntry['privileges'] = {};
					jsonData[objectKey] = newEntry;
				}

				if ('VIEW' == mode) {
					jsonData[objectKey]['privileges']['VIEW'] = element
							.getValue();
				}
				if ('EDIT' == mode) {
					jsonData[objectKey]['privileges']['EDIT'] = element
							.getValue();
				}
				if ('DELETE' == mode) {
					jsonData[objectKey]['privileges']['DELETE'] = element
							.getValue();
				}
				if ('AUTH' == mode) {
					jsonData[objectKey]['privileges']['AUTH'] = element
							.getValue();
				}
				if ('QUICKAPPROVE' == mode) {
					jsonData[objectKey]['privileges']['QUICKAPPROVE'] = element
							.getValue();
				}
				if ('IMPORT' === mode) {
					jsonData[objectKey]['privileges']['IMPORT'] = element
							.getValue();
				}
				if ('SRVIEW' == mode) {
					jsonData[objectKey]['privileges']['SRVIEW'] = element
							.getValue();
				}
				if ('SREDIT' == mode) {
					jsonData[objectKey]['privileges']['SREDIT'] = element
							.getValue();
				}
				if ('SRDELETE' == mode) {
					jsonData[objectKey]['privileges']['SRDELETE'] = element
							.getValue();
				}
				if ('SRAUTH' == mode) {
					jsonData[objectKey]['privileges']['SRAUTH'] = element
							.getValue();
				}
				if ('SRQUICKAPPROVE' == mode) {
					jsonData[objectKey]['privileges']['SRQUICKAPPROVE'] = element
							.getValue();
				}
				if ('SRIMPORT' === mode) {
					jsonData[objectKey]['privileges']['SRIMPORT'] = element
							.getValue();
				}
				if ('NRVIEW' == mode) {
					jsonData[objectKey]['privileges']['NRVIEW'] = element
							.getValue();
				}
				if ('NREDIT' == mode) {
					jsonData[objectKey]['privileges']['NREDIT'] = element
							.getValue();
				}
				if ('NRDELETE' == mode) {
					jsonData[objectKey]['privileges']['NRDELETE'] = element
							.getValue();
				}
				if ('NRAUTH' == mode) {
					jsonData[objectKey]['privileges']['NRAUTH'] = element
							.getValue();
				}
				if ('NRQUICKAPPROVE' == mode) {
					jsonData[objectKey]['privileges']['NRQUICKAPPROVE'] = element
							.getValue();
				}
				if ('NRIMPORT' === mode) {
					jsonData[objectKey]['privileges']['NRIMPORT'] = element
							.getValue();
				}
				for(var mode in jsonData[objectKey]['privileges']) {
					if( !jsonData[objectKey]['privileges']['VIEW'] && jsonData[objectKey]['privileges'][mode]){
					   	var TMPL_MODE = mode.startsWith("SR") ? "SRVIEW" : mode.startsWith("NR") ? "NRVIEW" : "VIEW";
					   	jsonData[objectKey]['privileges'][TMPL_MODE] = true;
					   	break;
					}
				}
			}
		});

		var jsonObj = {};
		jsonObj['serviceType'] = 'TEMP';
		jsonObj['moduleCode'] = '02';
		var jsonArray = [];
		// only add those records which are updated
		for (var index in templateGranularFeatureDataBackup) {
			var orginalObj = templateGranularFeatureDataBackup[index];
			var accountId = orginalObj.accountId;
			var pkgId = orginalObj.packageId;
			var objectKey = accountId + '_' + pkgId;
			var recordKeyNo = orginalObj.recordKeyNo;
			if ((objectKey in jsonData)) {
				var newObj = jsonData[objectKey];
				if (newObj['privileges']['VIEW'] == this
						.getBooleanvalue(orginalObj.viewFlag)
						&& newObj['privileges']['EDIT'] == this
								.getBooleanvalue(orginalObj.editFlag)
						&& newObj['privileges']['DELETE'] == this
								.getBooleanvalue(orginalObj.approveFlag)
						&& newObj['privileges']['AUTH'] == this
								.getBooleanvalue(orginalObj.deleteFlag)
						&& newObj['privileges']['QUICKAPPROVE'] == this
								.getBooleanvalue(orginalObj.quickApproveFlag)
						&& newObj['privileges']['IMPORT'] == this
								.getBooleanvalue(orginalObj.importFlag)
						&&

						newObj['privileges']['SRVIEW'] == this
								.getBooleanvalue(orginalObj.srViewFlag)
						&& newObj['privileges']['SREDIT'] == this
								.getBooleanvalue(orginalObj.srEditFlag)
						&& newObj['privileges']['SRDELETE'] == this
								.getBooleanvalue(orginalObj.srDeleteFlag)
						&& newObj['privileges']['SRAUTH'] == this
								.getBooleanvalue(orginalObj.srApproveFlag)
						&& newObj['privileges']['SRQUICKAPPROVE'] == this
								.getBooleanvalue(orginalObj.srQuickApproveFlag)
						&& newObj['privileges']['SRIMPORT'] == this
								.getBooleanvalue(orginalObj.srimportFlag)
						&&

						newObj['privileges']['NRVIEW'] == this
								.getBooleanvalue(orginalObj.nrViewFlag)
						&& newObj['privileges']['NREDIT'] == this
								.getBooleanvalue(orginalObj.nrEditFlag)
						&& newObj['privileges']['NRDELETE'] == this
								.getBooleanvalue(orginalObj.nrDeleteFlag)
						&& newObj['privileges']['NRAUTH'] == this
								.getBooleanvalue(orginalObj.nrApproveFlag)

						&& newObj['privileges']['NRQUICKAPPROVE'] == this
								.getBooleanvalue(orginalObj.nrQuickApproveFlag)
						&& newObj['privileges']['NRIMPORT'] == this
								.getBooleanvalue(orginalObj.nrimportFlag)

				) {
					// if none of the values are changed no need to push into
					// array
					//jsonArray.push(newObj)
				} else {
					jsonArray.push(newObj)
				}

			} else {

				// recordKeyNo of record means its saved in db and if its not
				// found in jsonData (i.e currently present in rows on screen)
				// then make all flag N for that account

				if (recordKeyNo !== undefined && recordKeyNo != null
						&& recordKeyNo) {

					if (false === this.getBooleanvalue(orginalObj.viewFlag)
							&& false === this
									.getBooleanvalue(orginalObj.editFlag)
							&& false === this
									.getBooleanvalue(orginalObj.approveFlag)
							&& false === this
									.getBooleanvalue(orginalObj.deleteFlag)
							&& false === this
									.getBooleanvalue(orginalObj.importFlag)
							&&
							false === this
									.getBooleanvalue(orginalObj.srViewFlag)
							&& false === this
									.getBooleanvalue(orginalObj.srEditFlag)
							&& false === this
									.getBooleanvalue(orginalObj.srDeleteFlag)
							&& false === this
									.getBooleanvalue(orginalObj.srApproveFlag)
							&& false === this
									.getBooleanvalue(orginalObj.srimportFlag)
							&&
							false === this
									.getBooleanvalue(orginalObj.nrViewFlag)
							&& false === this
									.getBooleanvalue(orginalObj.nrEditFlag)
							&& false === this
									.getBooleanvalue(orginalObj.nrDeleteFlag)
							&& false === this
									.getBooleanvalue(orginalObj.nrimportFlag)
							&& false === this
									.getBooleanvalue(orginalObj.nrApproveFlag)) {
						// if all flags are N means record is previously removed
						// no need to add into deleted array

					} else {
						if(!isFilterApplied && navigationTPVisible){
							var newEntry = {};
							newEntry['accountId'] = accountId;
							newEntry['packageId'] = pkgId;
							var privileges = {
								'VIEW' : false,
								'EDIT' : false,
								'DELETE' : false,
								'AUTH' : false,
								'QUICKAPPROVE' : false,
								'IMPORT' : false,
								'SRVIEW' : false,
								'SREDIT' : false,
								'SRDELETE' : false,
								'SRAUTH' : false,
								'SRQUICKAPPROVE' : false,
								'SRIMPORT' : false,
								'NRVIEW' : false,
								'NREDIT' : false,
								'NRDELETE' : false,
								'NRAUTH' : false,
								'NRQUICKAPPROVE' : false,
								'NRIMPORT' : false
							};

							newEntry['privileges'] = privileges;

							jsonArray.push(newEntry);
						}
					}
				}

			}

		}
		/*
		var v1 =true;
			Ext.each(jsonArray, function(field, index) {
					var accountId =field.accountId;
					var pkgId =field.packageId;
					var objectKey = accountId+'_'+pkgId;
					var newObj = jsonData[objectKey];
					Ext.each(jsonArrayTGlobal, function(fieldNew, indexNew) {
						var accountIdNew =fieldNew.accountId;
						var pkgIdNew =fieldNew.packageId;
						var objectKeyNew = accountIdNew+'_'+pkgIdNew;
						if(objectKeyNew in jsonData) {
							if(objectKeyNew==objectKey){ 
								v1=false;
								var newObj1 = jsonData[objectKeyNew];
							  if (newObj1['privileges']['VIEW']!= newObj['privileges']['VIEW']
								||newObj1['privileges']['EDIT']!= newObj['privileges']['EDIT']
								||newObj1['privileges']['AUTH']!= newObj['privileges']['AUTH']
								||newObj1['privileges']['QUICKAPPROVE']!= newObj['privileges']['QUICKAPPROVE']
								||newObj1['privileges']['RECALL']!= newObj['privileges']['RECALL']
								||newObj1['privileges']['CANCEL']!= newObj['privileges']['CANCEL']
								||newObj1['privileges']['CANCELAPPROVE']!= newObj['privileges']['CANCELAPPROVE']
								||newObj1['privileges']['DELETE']!= newObj['privileges']['DELETE']
								||newObj1['privileges']['SRVIEW']!= newObj['privileges']['SRVIEW']
								||newObj1['privileges']['SREDIT']!= newObj['privileges']['SREDIT']
								||newObj1['privileges']['SRDELETE']!= newObj['privileges']['SRDELETE']
								||newObj1['privileges']['SRAUTH']!= newObj['privileges']['SRAUTH']
								||newObj1['privileges']['SRQUICKAPPROVE']!= newObj['privileges']['SRQUICKAPPROVE']
								||newObj1['privileges']['SRIMPORT']!= newObj['privileges']['SRIMPORT']
								||newObj1['privileges']['NRVIEW']!= newObj['privileges']['NRVIEW']
								||newObj1['privileges']['NREDIT']!= newObj['privileges']['NREDIT']
								||newObj1['privileges']['NRDELETE']!= newObj['privileges']['NRDELETE']
								||newObj1['privileges']['NRAUTH']!= newObj['privileges']['NRAUTH']
								||newObj1['privileges']['NRQUICKAPPROVE']!= newObj['privileges']['NRQUICKAPPROVE']
								||newObj1['privileges']['NRIMPORT']!= newObj['privileges']['NRIMPORT']
								||newObj1['privileges']['IMPORT']!= newObj['privileges']['IMPORT'])
								{
									jsonArrayTGlobal[indexNew].privileges=jsonArray[index].privileges;
								}
							}
							/*else{
								jsonArrayGlobal.push(newObj);
								}
						}
					});
				});
		if (Ext.isEmpty(jsonArrayTGlobal)){
				jsonArrayTGlobal = jsonArray;
			}else if(v1){
				jsonArrayTGlobal = jsonArrayTGlobal.concat(jsonArray);
			}*/
		var v1 =true;
			Ext.each(jsonArray, function(field, index) {
					var accountId =field.accountId;
					var pkgId =field.packageId;
					var objectKey = accountId+'_'+pkgId;
					
				//if(objectKey in jsonData){
					var newObj = jsonData[objectKey];
					Ext.each(jsonArrayTGlobal, function(fieldNew, indexNew) {
						var accountIdNew =fieldNew.accountId;
						var pkgIdNew =fieldNew.packageId;
						var objectKeyNew = accountIdNew+'_'+pkgIdNew;
						//if(objectKeyNew in jsonArrayGlobal) {
							if(objectKeyNew==objectKey){ 
								v1=false;
								var newObj1 = jsonArrayTGlobal[indexNew];
						if(!Ext.isEmpty(newObj) && !Ext.isEmpty(newObj1))
						{
							  if (newObj1['privileges']['VIEW']!= newObj['privileges']['VIEW']
								||newObj1['privileges']['EDIT']!= newObj['privileges']['EDIT']
								||newObj1['privileges']['AUTH']!= newObj['privileges']['AUTH']
								||newObj1['privileges']['QUICKAPPROVE']!= newObj['privileges']['QUICKAPPROVE']
								||newObj1['privileges']['RECALL']!= newObj['privileges']['RECALL']
								||newObj1['privileges']['CANCEL']!= newObj['privileges']['CANCEL']
								||newObj1['privileges']['CANCELAPPROVE']!= newObj['privileges']['CANCELAPPROVE']
								||newObj1['privileges']['DELETE']!= newObj['privileges']['DELETE']
								||newObj1['privileges']['SRVIEW']!= newObj['privileges']['SRVIEW']
								||newObj1['privileges']['SREDIT']!= newObj['privileges']['SREDIT']
								||newObj1['privileges']['SRDELETE']!= newObj['privileges']['SRDELETE']
								||newObj1['privileges']['SRAUTH']!= newObj['privileges']['SRAUTH']
								||newObj1['privileges']['SRQUICKAPPROVE']!= newObj['privileges']['SRQUICKAPPROVE']
								||newObj1['privileges']['SRIMPORT']!= newObj['privileges']['SRIMPORT']
								||newObj1['privileges']['NRVIEW']!= newObj['privileges']['NRVIEW']
								||newObj1['privileges']['NREDIT']!= newObj['privileges']['NREDIT']
								||newObj1['privileges']['NRDELETE']!= newObj['privileges']['NRDELETE']
								||newObj1['privileges']['NRAUTH']!= newObj['privileges']['NRAUTH']
								||newObj1['privileges']['NRQUICKAPPROVE']!= newObj['privileges']['NRQUICKAPPROVE']
								||newObj1['privileges']['NRIMPORT']!= newObj['privileges']['NRIMPORT']
								||newObj1['privileges']['IMPORT']!= newObj['privileges']['IMPORT'])
								{
									jsonArrayTGlobal[indexNew].privileges=jsonArray[index].privileges;
								}
							
						}
						}
							/*else{
								jsonArrayGlobal.push(newObj);
								}*/
						//}
					});
				//}
			});
			if (Ext.isEmpty(jsonArrayTGlobal)){
				jsonArrayTGlobal = jsonArray;
			}else if(v1){
				jsonArrayTGlobal = jsonArrayTGlobal.concat(jsonArray);
			}
			if(!isFilterApplied && navigationTPVisible){
			
				var headerViewIcon = me.down('checkbox[itemId=templateGranularPrivHeader_viewIcon]');
				var headerEditIcon = me.down('checkbox[itemId=templateGranularPrivHeader_editIcon]');
				var headerDeleteIcon = me.down('checkbox[itemId=templateGranularPrivHeader_deleteIcon]');
				var headerApproveIcon = me.down('checkbox[itemId=templateGranularPrivHeader_authIcon]');
				var headerQuickApproveIcon = me.down('checkbox[itemId=templateGranularPrivHeader_quickApproveIcon]');
				var headerImportIcon = me.down('checkbox[itemId=templateGranularPrivHeader_importIcon]');
				
				var headerSrViewIcon = me.down('checkbox[itemId=templateGranularPrivHeader_srviewIcon]');
				var headerSrEditIcon = me.down('checkbox[itemId=templateGranularPrivHeader_sreditIcon]');
				var headerSrDeleteIcon = me.down('checkbox[itemId=templateGranularPrivHeader_srdeleteIcon]');
				var headerSrApproveIcon = me.down('checkbox[itemId=templateGranularPrivHeader_srauthIcon]');
				var headerSrQuickApproveIcon = me.down('checkbox[itemId=templateGranularPrivHeader_srquickApproveIcon]');
				var headerSrImportIcon = me.down('checkbox[itemId=templateGranularPrivHeader_srimportIcon]');
				
				var headerNrViewIcon = me.down('checkbox[itemId=templateGranularPrivHeader_nrviewIcon]');
				var headerNrEditIcon = me.down('checkbox[itemId=templateGranularPrivHeader_nreditIcon]');
				var headerNrDeleteIcon = me.down('checkbox[itemId=templateGranularPrivHeader_nrdeleteIcon]');
				var headerNrApproveIcon = me.down('checkbox[itemId=templateGranularPrivHeader_nrauthIcon]');
				var headerNrQuickApproveIcon = me.down('checkbox[itemId=templateGranularPrivHeader_nrquickApproveIcon]');
				var headerNrImportIcon = me.down('checkbox[itemId=templateGranularPrivHeader_nrimportIcon]');
				
				var newEntryJsonAll = [];
				for (var index  in templateGranularFeatureDataBackup){
					var orginalObj = templateGranularFeatureDataBackup[index];
					var accountId =orginalObj.accountId;
					var pkgId =orginalObj.packageId;
					var objectKey = accountId+'_'+pkgId;
					//var recordKeyNo = orginalObj.recordKeyNo;
					var tempFlag=true;
					Ext.each(jsonArrayTGlobal, function(fieldNew, indexNew) {
						var accountIdNew =fieldNew.accountId;
						var pkgIdNew =fieldNew.packageId;
						var objectKeyNew = accountIdNew+'_'+pkgIdNew;
						if(objectKeyNew==objectKey)
						{
							tempFlag = false;
							if(headerViewIcon && headerViewIcon.checked){
								jsonArrayTGlobal[indexNew].privileges.VIEW =true;
							}
							if(headerEditIcon && headerEditIcon.checked){
								jsonArrayTGlobal[indexNew].privileges.EDIT = true;
							}
							if(headerDeleteIcon && headerDeleteIcon.checked){
								jsonArrayTGlobal[indexNew].privileges.DELETE = true;
							}
							if(headerApproveIcon && headerApproveIcon.checked){
								jsonArrayTGlobal[indexNew].privileges.APPROVE = true;
							}
							if(headerQuickApproveIcon && headerQuickApproveIcon.checked){
								jsonArrayTGlobal[indexNew].privileges.QUICKAPPROVE = true;
							}
							if(headerImportIcon && headerImportIcon.checked){
								jsonArrayTGlobal[indexNew].privileges.IMPORT = true;
							}
							
							
							if(headerSrViewIcon && headerSrViewIcon.checked){
								jsonArrayTGlobal[indexNew].privileges.SRVIEW =true;
							}
							if(headerSrEditIcon && headerSrEditIcon.checked){
								jsonArrayTGlobal[indexNew].privileges.SREDIT = true;
							}
							if(headerSrDeleteIcon && headerSrDeleteIcon.checked){
								jsonArrayTGlobal[indexNew].privileges.SRDELETE = true;
							}
							if(headerSrApproveIcon && headerSrApproveIcon.checked){
								jsonArrayTGlobal[indexNew].privileges.SRAPPROVE = true;
							}
							if(headerSrQuickApproveIcon && headerSrQuickApproveIcon.checked){
								jsonArrayTGlobal[indexNew].privileges.SRQUICKAPPROVE = true;
							}
							if(headerSrImportIcon && headerSrImportIcon.checked){
								jsonArrayTGlobal[indexNew].privileges.SRIMPORT = true;
							}
							
							if(headerNrViewIcon && headerNrViewIcon.checked){
								jsonArrayTGlobal[indexNew].privileges.NRVIEW =true;
							}
							if(headerNrEditIcon && headerNrEditIcon.checked){
								jsonArrayTGlobal[indexNew].privileges.NREDIT = true;
							}
							if(headerNrDeleteIcon && headerNrDeleteIcon.checked){
								jsonArrayTGlobal[indexNew].privileges.NRDELETE = true;
							}
							if(headerNrApproveIcon && headerNrApproveIcon.checked){
								jsonArrayTGlobal[indexNew].privileges.NRAPPROVE = true;
							}
							if(headerNrQuickApproveIcon && headerNrQuickApproveIcon.checked){
								jsonArrayTGlobal[indexNew].privileges.NRQUICKAPPROVE = true;
							}
							if(headerNrImportIcon && headerNrImportIcon.checked){
								jsonArrayTGlobal[indexNew].privileges.NRIMPORT = true;
							}
						}
					});
					if(tempFlag)
					{
						var accountText = orginalObj.accountNo + '|' + orginalObj.accountName;
						var packageKey = orginalObj.productCategoryCode + '|'
										+ orginalObj.packageId;
							if (me.allPackagesSelectedFlag == 'Y'
							|| payPackageAssignedMap[packageKey] == true) {
								if (me.allAccountsSelectedFlag == 'Y'
									|| accountAssignedMap[accountText] == true)
								{
									var newEntryJson = {};
									newEntryJson['accountId'] = accountId;
									newEntryJson['packageId'] = pkgId;
									var view=false;
									var edit=false;
									var auth=false;
									var quickapprove=false;
									var vDelete=false;
									var vImport=false;
									
									var srview=false;
									var sredit=false;
									var srauth=false;
									var srquickapprove=false;
									var srvDelete=false;
									var srvImport=false;
									
									var nrview=false;
									var nredit=false;
									var nrauth=false;
									var nrquickapprove=false;
									var nrvDelete=false;
									var nrvImport=false;
									
									var flagUpdate = false;
									
									if(headerViewIcon && headerViewIcon.checked){
										view =true;
										flagUpdate = true;
									}
									if(headerEditIcon && headerEditIcon.checked){
										edit = true;
										flagUpdate = true;
									}
									if(headerDeleteIcon && headerDeleteIcon.checked){
										vDelete = true;
										flagUpdate = true;
									}
									if(headerApproveIcon && headerApproveIcon.checked){
										auth = true;
										flagUpdate = true;
									}
									if(headerQuickApproveIcon && headerQuickApproveIcon.checked){
										quickapprove = true;
										flagUpdate = true;
									}
									if(headerImportIcon && headerImportIcon.checked){
										vImport = true;
										flagUpdate = true;
									}
									
									
									if(headerSrViewIcon && headerSrViewIcon.checked){
										srview =true;
										flagUpdate = true;
									}
									if(headerSrEditIcon && headerSrEditIcon.checked){
										sredit = true;
										flagUpdate = true;
									}
									if(headerSrDeleteIcon && headerSrDeleteIcon.checked){
										srvDelete = true;
										flagUpdate = true;
									}
									if(headerSrApproveIcon && headerSrApproveIcon.checked){
										srauth = true;
										flagUpdate = true;
									}
									if(headerSrQuickApproveIcon && headerSrQuickApproveIcon.checked){
										srquickapprove = true;
										flagUpdate = true;
									}
									if(headerSrImportIcon && headerSrImportIcon.checked){
										srvImport = true;
										flagUpdate = true;
									}
									
									
									if(headerNrViewIcon && headerNrViewIcon.checked){
										nrview =true;
										flagUpdate = true;
									}
									if(headerNrEditIcon && headerNrEditIcon.checked){
										nredit = true;
										flagUpdate = true;
									}
									if(headerNrDeleteIcon && headerNrDeleteIcon.checked){
										nrvDelete = true;
										flagUpdate = true;
									}
									if(headerNrApproveIcon && headerNrApproveIcon.checked){
										nrauth = true;
										flagUpdate = true;
									}
									if(headerNrQuickApproveIcon && headerNrQuickApproveIcon.checked){
										nrquickapprove = true;
										flagUpdate = true;
									}
									if(headerNrImportIcon && headerNrImportIcon.checked){
										nrvImport = true;
										flagUpdate = true;
									}
									var privileges = {
											'VIEW' : view,
											'EDIT' : edit,
											'DELETE' : vDelete,
											'AUTH' : auth,
											'QUICKAPPROVE' : quickapprove,
											'IMPORT' : vImport,
											'SRVIEW' : srview,
											'SREDIT' : sredit,
											'SRDELETE' : srvDelete,
											'SRAUTH' : srauth,
											'SRQUICKAPPROVE' : srquickapprove,
											'SRIMPORT' : srvImport,
											'NRVIEW' : nrview,
											'NREDIT' : nredit,
											'NRDELETE' : nrvDelete,
											'NRAUTH' : nrauth,
											'NRQUICKAPPROVE' : nrquickapprove,
											'NRIMPORT' : nrvImport
											};
									newEntryJson['privileges'] = privileges;
									if(flagUpdate)
										newEntryJsonAll.push(newEntryJson);
								}
							}
					}
				}
			}
			if(!Ext.isEmpty(newEntryJsonAll))
				jsonArrayTGlobal = jsonArrayTGlobal.concat(newEntryJsonAll);
				
		jsonObj['accountPackagePrivileges'] = jsonArrayTGlobal;
		// console.log("length :"+jsonArray.length);
		// console.log("jsonData :"+JSON.stringify(jsonObj));
		if (!Ext.isEmpty(me.fnCallback) && typeof me.fnCallback == 'function') {
			me.fnCallback(jsonObj);
			me.close();
		}
	},setTempGranularOptionsTemp : function(jsonObj) {
				document.getElementById("templateGranularPermissions").value = JSON.stringify(jsonObj);
			},
		saveItemsTemp : function() {
		var me = this;
		var jsonData = {};
		Ext.each(granularPrivfieldJson, function(field, index) {
			var featureId = field.itemId;
			var accountId = field.accountId;
			var pkgId = field.packageId;
			var element = me.down('checkboxfield[itemId=' + featureId + ']');
			var objectKey = accountId + '_' + pkgId;

			if (element != null && element != undefined && !element.hidden) {

				var mode = element.mode;
				// console.log("jsonData :"+JSON.stringify(jsonData));
				if (!(objectKey in jsonData)) {
					// console.log("accountiD adding for first time
					// :"+accountId);
					var newEntry = {};
					newEntry['accountId'] = accountId;
					newEntry['packageId'] = pkgId;
					newEntry['privileges'] = {};
					jsonData[objectKey] = newEntry;
				}

				if ('VIEW' == mode) {
					jsonData[objectKey]['privileges']['VIEW'] = element
							.getValue();
				}
				if ('EDIT' == mode) {
					jsonData[objectKey]['privileges']['EDIT'] = element
							.getValue();
				}
				if ('DELETE' == mode) {
					jsonData[objectKey]['privileges']['DELETE'] = element
							.getValue();
				}
				if ('AUTH' == mode) {
					jsonData[objectKey]['privileges']['AUTH'] = element
							.getValue();
				}
				if ('QUICKAPPROVE' == mode) {
					jsonData[objectKey]['privileges']['QUICKAPPROVE'] = element
							.getValue();
				}
				if ('IMPORT' === mode) {
					jsonData[objectKey]['privileges']['IMPORT'] = element
							.getValue();
				}
				if ('SRVIEW' == mode) {
					jsonData[objectKey]['privileges']['SRVIEW'] = element
							.getValue();
				}
				if ('SREDIT' == mode) {
					jsonData[objectKey]['privileges']['SREDIT'] = element
							.getValue();
				}
				if ('SRDELETE' == mode) {
					jsonData[objectKey]['privileges']['SRDELETE'] = element
							.getValue();
				}
				if ('SRAUTH' == mode) {
					jsonData[objectKey]['privileges']['SRAUTH'] = element
							.getValue();
				}
				if ('SRQUICKAPPROVE' == mode) {
					jsonData[objectKey]['privileges']['SRQUICKAPPROVE'] = element
							.getValue();
				}
				if ('SRIMPORT' === mode) {
					jsonData[objectKey]['privileges']['SRIMPORT'] = element
							.getValue();
				}
				if ('NRVIEW' == mode) {
					jsonData[objectKey]['privileges']['NRVIEW'] = element
							.getValue();
				}
				if ('NREDIT' == mode) {
					jsonData[objectKey]['privileges']['NREDIT'] = element
							.getValue();
				}
				if ('NRDELETE' == mode) {
					jsonData[objectKey]['privileges']['NRDELETE'] = element
							.getValue();
				}
				if ('NRAUTH' == mode) {
					jsonData[objectKey]['privileges']['NRAUTH'] = element
							.getValue();
				}
				if ('NRQUICKAPPROVE' == mode) {
					jsonData[objectKey]['privileges']['NRQUICKAPPROVE'] = element
							.getValue();
				}
				if ('NRIMPORT' === mode) {
					jsonData[objectKey]['privileges']['NRIMPORT'] = element
							.getValue();
				}
				for(var mode in jsonData[objectKey]['privileges']) {
					if( !jsonData[objectKey]['privileges']['VIEW'] && jsonData[objectKey]['privileges'][mode]){
					   	var TMPL_MODE = mode.startsWith("SR") ? "SRVIEW" : mode.startsWith("NR") ? "NRVIEW" : "VIEW";
					   	jsonData[objectKey]['privileges'][TMPL_MODE] = true;
					   	break;
					}
				}
			}
		});
		var jsonObj = {};
			var jsonArray = [];
			jsonObj['serviceType'] = 'TEMP';
			jsonObj['moduleCode'] = '02';
			for (var index  in jsonData){
				var orginalObj = jsonData[index];
			    var accountId =orginalObj.accountId;
			    var pkgId =orginalObj.packageId;
				var objectKey = accountId+'_'+pkgId;
				var recordKeyNo = orginalObj.recordKeyNo;
			  	if((objectKey in jsonData)){ 
                       var newObj = jsonData[objectKey];
					   jsonArray.push(newObj);
					   
				}
			}
			var v1 =true;
			Ext.each(jsonArray, function(field, index) {
					var accountId =field.accountId;
					var pkgId =field.packageId;
					var objectKey = accountId+'_'+pkgId;
					var newObj = jsonData[objectKey];
					Ext.each(jsonArrayTGlobal, function(fieldNew, indexNew) {
						var accountIdNew =fieldNew.accountId;
						var pkgIdNew =fieldNew.packageId;
						var objectKeyNew = accountIdNew+'_'+pkgIdNew;
						if(objectKeyNew in jsonData) {
							if(objectKeyNew==objectKey){ 
								v1=false;
								var newObj1 = jsonData[objectKeyNew];
								if(!Ext.isEmpty(newObj) && !Ext.isEmpty(newObj1))
								{
								  if (newObj1['privileges']['VIEW']!= newObj['privileges']['VIEW']
									||newObj1['privileges']['EDIT']!= newObj['privileges']['EDIT']
									||newObj1['privileges']['AUTH']!= newObj['privileges']['AUTH']
									||newObj1['privileges']['QUICKAPPROVE']!= newObj['privileges']['QUICKAPPROVE']
									||newObj1['privileges']['RECALL']!= newObj['privileges']['RECALL']
									||newObj1['privileges']['CANCEL']!= newObj['privileges']['CANCEL']
									||newObj1['privileges']['CANCELAPPROVE']!= newObj['privileges']['CANCELAPPROVE']
									||newObj1['privileges']['DELETE']!= newObj['privileges']['DELETE']
									||newObj1['privileges']['SRVIEW']!= newObj['privileges']['SRVIEW']
									||newObj1['privileges']['SREDIT']!= newObj['privileges']['SREDIT']
									||newObj1['privileges']['SRDELETE']!= newObj['privileges']['SRDELETE']
									||newObj1['privileges']['SRAUTH']!= newObj['privileges']['SRAUTH']
									||newObj1['privileges']['SRQUICKAPPROVE']!= newObj['privileges']['SRQUICKAPPROVE']
									||newObj1['privileges']['SRIMPORT']!= newObj['privileges']['SRIMPORT']
									||newObj1['privileges']['NRVIEW']!= newObj['privileges']['NRVIEW']
									||newObj1['privileges']['NREDIT']!= newObj['privileges']['NREDIT']
									||newObj1['privileges']['NRDELETE']!= newObj['privileges']['NRDELETE']
									||newObj1['privileges']['NRAUTH']!= newObj['privileges']['NRAUTH']
									||newObj1['privileges']['NRQUICKAPPROVE']!= newObj['privileges']['NRQUICKAPPROVE']
									||newObj1['privileges']['NRIMPORT']!= newObj['privileges']['NRIMPORT']
									||newObj1['privileges']['IMPORT']!= newObj['privileges']['IMPORT'])
									{
										jsonArrayTGlobal[indexNew].privileges=jsonArray[index].privileges;
									}
								}
							/*else{
								jsonArrayGlobal.push(newObj);
								}*/
							}
						}
					});
				});
		if (Ext.isEmpty(jsonArrayTGlobal)){
				jsonArrayTGlobal = jsonArray;
			}else if(v1){
				jsonArrayTGlobal = jsonArrayTGlobal.concat(jsonArray);
			}
		jsonObj['accountPackagePrivileges'] = jsonData;
		// console.log("length :"+jsonArray.length);
		// console.log("jsonData :"+JSON.stringify(jsonObj));
		if (!Ext.isEmpty(me.fnCallback) && typeof me.fnCallback == 'function') {
			me.setTempGranularOptionsTemp(jsonObj);
			//me.close();
		}
	}
});
function checkTmplGranularViewIfNotSelected(isSelected,panelPointer,obj,TMPL_MODE){
	if(null != panelPointer && undefined != panelPointer){
		if (isSelected){
			var viewItemId =obj.accountId + "_" + obj.packageId +  "_" + TMPL_MODE;
			var view_chk_box = panelPointer.down('checkbox[itemId='+viewItemId+']');
			if(null != view_chk_box && undefined != view_chk_box && view_chk_box.value== false){
				view_chk_box.setValue(true);
			}
		}else{
			if("VIEW"===obj.mode){
				var editIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + "_" + obj.packageId + '_EDIT' +']');
				if( editIconItemId )
				{
					editIconItemId.setValue( false );
					editIconItemId.defVal = false;
				}
				var authIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + "_" + obj.packageId + '_AUTH' +']');
				if( authIconItemId )
				{
					authIconItemId.setValue( false );
					authIconItemId.defVal = false;
				}
				var quickauthIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + "_" + obj.packageId + '_QUICKAPPROVE' +']');
				if( quickauthIconItemId )
				{
					quickauthIconItemId.setValue( false );
					quickauthIconItemId.defVal = false;
				}
				var deleteIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + "_" + obj.packageId + '_DELETE' +']');
				if( deleteIconItemId )
				{
					deleteIconItemId.setValue( false );
					deleteIconItemId.defVal = false;
				}
				var importIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + "_" + obj.packageId + '_IMPORT' +']');
				if( importIconItemId )
				{
					importIconItemId.setValue( false );
					importIconItemId.defVal = false;
				}
			}
			if("SRVIEW"===obj.mode){
				var editIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + "_" + obj.packageId + '_SREDIT' +']');
				if( editIconItemId )
				{
					editIconItemId.setValue( false );
					editIconItemId.defVal = false;
				}
				var authIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + "_" + obj.packageId + '_SRAUTH' +']');
				if( authIconItemId )
				{
					authIconItemId.setValue( false );
					authIconItemId.defVal = false;
				}
				var quickauthIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + "_" + obj.packageId + '_SRQUICKAPPROVE' +']');
				if( quickauthIconItemId )
				{
					quickauthIconItemId.setValue( false );
					quickauthIconItemId.defVal = false;
				}
				var deleteIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + "_" + obj.packageId + '_SRDELETE' +']');
				if( deleteIconItemId )
				{
					deleteIconItemId.setValue( false );
					deleteIconItemId.defVal = false;
				}
				var importIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + "_" + obj.packageId + '_SRIMPORT' +']');
				if( importIconItemId )
				{
					importIconItemId.setValue( false );
					importIconItemId.defVal = false;
				}
				
			}
			if("NRVIEW"===obj.mode){
				var editIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + "_" + obj.packageId + '_NREDIT' +']');
				if( editIconItemId )
				{
					editIconItemId.setValue( false );
					editIconItemId.defVal = false;
				}
				var authIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + "_" + obj.packageId + '_NRAUTH' +']');
				if( authIconItemId )
				{
					authIconItemId.setValue( false );
					authIconItemId.defVal = false;
				}
				var quickauthIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + "_" + obj.packageId + '_NRQUICKAPPROVE' +']');
				if( quickauthIconItemId )
				{
					quickauthIconItemId.setValue( false );
					quickauthIconItemId.defVal = false;
				}
				var deleteIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + "_" + obj.packageId + '_NRDELETE' +']');
				if( deleteIconItemId )
				{
					deleteIconItemId.setValue( false );
					deleteIconItemId.defVal = false;
				}
				
				var importIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + "_" + obj.packageId + '_NRIMPORT' +']');
				if( importIconItemId )
				{
					importIconItemId.setValue( false );
					importIconItemId.defVal = false;
				}
			}
		}
	}

}