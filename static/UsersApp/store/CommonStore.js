/*global jQuery, User Details */
var CommonUserObj;
var accountStore = [], packageStore =[], templateStore = [], notionalAgreementStore=[], sweepAgreementStore=[], portalStore =[], mobileStore =[], limitStore = [];

var templatesAssignedCount=0, templatesCount=0;
var accountsAssignedCount=0, accountsCount=0, notionalAgreementsAssignedCount =0, notionalAgreementsCount = 0;
var sweepAgreementsAssignedCount=0, sweepAgreementsCount=0, packagesAssignedCount=0, packagesCount=0;
var lngActivationDate= 0;
(function ($) {
	
	'use strict';
	CommonUserObj = {
	
			addUserAccounts : function (e, data) {
				var index = accountStore.findIndex(function(obj){
						return obj.kv.accountId == data.kv.accountId;
				})
				var existObj = accountStore[index];
				
				if(undefined != existObj && existObj.commandName == "RemoveUserAccounts"){
					accountStore.splice(index, 1);
					accountsAssignedCount++
					$('#lblAccountCount').text(accountsAssignedCount + " of " + accountsCount + "  " + getLabel("lbl.clientUser.selected"," Selected"));
				}else{
					accountStore.push(data);	
					accountsAssignedCount++
					$('#lblAccountCount').text(accountsAssignedCount + " of " + accountsCount + "  " + getLabel("lbl.clientUser.selected"," Selected"));
				}
				console.log("Account Updated");
				console.log(accountStore);
			},
			
			removeUserAccounts : function (e, data) {
				var index = accountStore.findIndex(function(obj){
						return obj.kv.accountId == data.kv.accountId;
				});
				var existObj = accountStore[index];

				
				if(undefined != existObj && existObj.commandName == "AddUserAccounts"){
					accountStore.splice(index, 1);
					accountsAssignedCount--
					$('#lblAccountCount').text(accountsAssignedCount + " of " + accountsCount + "  " + getLabel("lbl.clientUser.selected"," Selected"));
				}else{
					accountStore.push(data);
					accountsAssignedCount--
					$('#lblAccountCount').text(accountsAssignedCount + " of " + accountsCount + "  " + getLabel("lbl.clientUser.selected"," Selected"));
				}
				console.log("Account Updated");
				console.log(accountStore);
			},	
			
			applyAllUserAccounts : function (e, data) {
				accountStore = [];
				accountStore.push(data);
				accountsAssignedCount = accountsCount;
				$('#lblAccountCount').text(accountsAssignedCount + " of " + accountsCount + "  " + getLabel("lbl.clientUser.selected"," Selected"));
				
				console.log("Apply All Accounts ");
				console.log(accountStore);
			},
			
			removeAllUserAccounts : function (e, data) {
				accountStore = [];
				accountStore.push(data);
				accountsAssignedCount = 0;
				$('#lblAccountCount').text(accountsAssignedCount + " of " + accountsCount + "  " + getLabel("lbl.clientUser.selected"," Selected"));
				
				console.log("removed All Accounts ");
				console.log(accountStore);
			},
			
			addUserPackages : function (e, data) {
				var index = packageStore.findIndex(function(obj){
						return obj.kv.packageId == data.kv.packageId;
				});
				var existObj = packageStore[index];

				if(undefined != existObj && existObj.commandName == "RemoveUserPackages"){
					packageStore.splice(index, 1);
					packagesAssignedCount++
					$('#lblPkgCount').text(packagesAssignedCount + " of " + packagesCount + "  " + getLabel("lbl.clientUser.selected"," Selected"));					
				}else{
					packageStore.push(data);	
					packagesAssignedCount++
					$('#lblPkgCount').text(packagesAssignedCount + " of " + packagesCount + "  " + getLabel("lbl.clientUser.selected"," Selected"));					
				}
				console.log("Package added");
				console.log(packageStore);
			},
			
			removeUserPackages : function (e, data) {
				var index = packageStore.findIndex(function(obj){
						return obj.kv.packageId == data.kv.packageId;
				});
				var existObj = packageStore[index];
				
				if(undefined != existObj && existObj.commandName == "AddUserPackages"){
					packageStore.splice(index, 1);
					packagesAssignedCount--
					$('#lblPkgCount').text(packagesAssignedCount + " of " + packagesCount + "  " + getLabel("lbl.clientUser.selected"," Selected"));					
				}else{
					packageStore.push(data);
					packagesAssignedCount--
					$('#lblPkgCount').text(packagesAssignedCount + " of " + packagesCount + "  " + getLabel("lbl.clientUser.selected"," Selected"));				}
				console.log("Package removed");
				console.log(packageStore);
			},
			
			applyAllUserPackages : function (e, data) {
				packageStore = [];
				packageStore.push(data);
				packagesAssignedCount = packagesCount;
				$('#lblPkgCount').text(packagesAssignedCount + " of " + packagesCount + "  " + getLabel("lbl.clientUser.selected"," Selected"));
				
				console.log("Apply All packages ");
				console.log(packageStore);
			},
			
			removeAllUserPackages : function (e, data) {
				packageStore = [];
				packageStore.push(data);
				packagesAssignedCount = 0;
				$('#lblPkgCount').text(packagesAssignedCount + " of " + packagesCount + "  " + getLabel("lbl.clientUser.selected"," Selected"));
				
				console.log("removed All packages ");
				console.log(packageStore);
			},
			
			addTemplates : function (e, data) {
				var index = templateStore.findIndex(function(obj){
						return obj.kv.templateId == data.kv.templateId;
				});
				var existObj = templateStore[index];

				if(undefined != existObj && existObj.commandName == "RemoveUserTemplates"){
					templateStore.splice(index, 1);
					templatesAssignedCount++
					$('#lblTemplateCount').text(templatesAssignedCount + " of " + templatesCount + "  " + getLabel("lbl.clientUser.selected"," Selected"));
				}else{
					templateStore.push(data);	
					templatesAssignedCount++
					$('#lblTemplateCount').text(templatesAssignedCount + " of " + templatesCount + "  " + getLabel("lbl.clientUser.selected"," Selected"));
				}
				console.log("Template added");
				console.log(templateStore);
			},
			
			removeTemplates : function (e, data) {
				var index = templateStore.findIndex(function(obj){
						return obj.kv.templateId == data.kv.templateId;
				});
				var existObj = templateStore[index];
				
				if(undefined != existObj && existObj.commandName == "AddUserTemplates"){
					templateStore.splice(index, 1);
					templatesAssignedCount--
					$('#lblTemplateCount').text(templatesAssignedCount + " of " + templatesCount + "  " + getLabel("lbl.clientUser.selected"," Selected"));
				}else{
					templateStore.push(data);	
					templatesAssignedCount--
					$('#lblTemplateCount').text(templatesAssignedCount + " of " + templatesCount + "  " + getLabel("lbl.clientUser.selected"," Selected"));
				}
				console.log("Template removed");
				console.log(templateStore);
			},
			
			applyAllTemplates : function (e, data) {
				templateStore = [];
				templateStore.push(data);
				templatesAssignedCount = templatesCount;
				$('#lblTemplateCount').text(templatesAssignedCount + " of " + templatesCount + "  " + getLabel("lbl.clientUser.selected"," Selected"));
				console.log("Apply All templates ");
				console.log(templateStore);
			},
			
			removeAllTemplates : function (e, data) {
				templateStore = [];
				templateStore.push(data);
				templatesAssignedCount =0;
				$('#lblTemplateCount').text(templatesAssignedCount + " of " + templatesCount + "  " + getLabel("lbl.clientUser.selected"," Selected"));
				
				console.log("removed All template ");
				console.log(templateStore);
			},
			
			addNotional : function (e, data) {
				var index = notionalAgreementStore.findIndex(function(obj){
						return obj.kv.agreementCode == data.kv.agreementCode;
				});
				var existObj = notionalAgreementStore[index];
				
				if(undefined != existObj && existObj.commandName == "RemoveUserNotional"){
					notionalAgreementStore.splice(index, 1);
					notionalAgreementsAssignedCount++
					$('#lblNotionalAgreementCount').text(notionalAgreementsAssignedCount + " of " + notionalAgreementsCount + "  " + getLabel("lbl.clientUser.selected"," Selected"));
				}else{
					notionalAgreementStore.push(data);		
					notionalAgreementsAssignedCount++
					$('#lblNotionalAgreementCount').text(notionalAgreementsAssignedCount + " of " + notionalAgreementsCount + "  " + getLabel("lbl.clientUser.selected"," Selected"));
				}
				console.log("Notional Store Updated");
				console.log(notionalAgreementStore);
			},
			
			removeNotional : function (e, data) {
				var index = notionalAgreementStore.findIndex(function(obj){
						return obj.kv.agreementCode == data.kv.agreementCode;
				});
				var existObj = notionalAgreementStore[index];
				
				if(undefined != existObj && existObj.commandName == "AddUserNotional"){
					notionalAgreementStore.splice(index, 1);
					notionalAgreementsAssignedCount--
					$('#lblNotionalAgreementCount').text(notionalAgreementsAssignedCount + " of " + notionalAgreementsCount + "  " + getLabel("lbl.clientUser.selected"," Selected"));
				}else{
					notionalAgreementStore.push(data);	
					notionalAgreementsAssignedCount--
					$('#lblNotionalAgreementCount').text(notionalAgreementsAssignedCount + " of " + notionalAgreementsCount + "  " + getLabel("lbl.clientUser.selected"," Selected"));
				}
				console.log("Notional Store Updated");
				console.log(notionalAgreementStore);
			},
			
			
			applyAllNotional : function (e, data) {
				notionalAgreementStore = [];
				notionalAgreementStore.push(data);
				notionalAgreementsAssignedCount = notionalAgreementsCount;
				$('#lblNotionalAgreementCount').text(notionalAgreementsAssignedCount + " of " + notionalAgreementsCount + "  " + getLabel("lbl.clientUser.selected"," Selected"));
				
				console.log("Apply All notional Agreement");
				console.log(notionalAgreementStore);
			},
			
			removeAllNotional : function (e, data) {
				notionalAgreementStore = [];
				notionalAgreementStore.push(data);
				notionalAgreementsAssignedCount =0;
				$('#lblNotionalAgreementCount').text(notionalAgreementsAssignedCount + " of " + notionalAgreementsCount + "  " + getLabel("lbl.clientUser.selected"," Selected"));

				console.log("Removed All notional Agreement ");
				console.log(notionalAgreementStore);
			},
			
			
			addSweep : function (e, data) {
				var index = sweepAgreementStore.findIndex(function(obj){
						return obj.kv.agreementCode == data.kv.agreementCode;
				});
				var existObj = sweepAgreementStore[index];
				
				if(undefined != existObj && existObj.commandName == "RemoveUserSweep"){
					sweepAgreementStore.splice(index, 1);
					sweepAgreementsAssignedCount++
					$('#lblSweepAgreementCount').text(sweepAgreementsAssignedCount + " of " + sweepAgreementsCount + "  " + getLabel("lbl.clientUser.selected"," Selected"));
				}else{
					sweepAgreementStore.push(data);	
					sweepAgreementsAssignedCount++
					$('#lblSweepAgreementCount').text(sweepAgreementsAssignedCount + " of " + sweepAgreementsCount + "  " + getLabel("lbl.clientUser.selected"," Selected"));
				}
				console.log("sweep Store Updated");
				console.log(sweepAgreementStore);
			},
			
			removeSweep : function (e, data) {
				var index = sweepAgreementStore.findIndex(function(obj){
						return obj.kv.widgetId == data.kv.widgetId;
				});
				var existObj = sweepAgreementStore[index];
				
				if(undefined != existObj && existObj.commandName == "AddUserSweep"){
					sweepAgreementStore.splice(index, 1);
					sweepAgreementsAssignedCount--
					$('#lblSweepAgreementCount').text(sweepAgreementsAssignedCount + " of " + sweepAgreementsCount + "  " + getLabel("lbl.clientUser.selected"," Selected"));
				}else{
					sweepAgreementStore.push(data);
					sweepAgreementsAssignedCount--
    				$('#lblSweepAgreementCount').text(sweepAgreementsAssignedCount + " of " + sweepAgreementsCount + "  " + getLabel("lbl.clientUser.selected"," Selected"));
				}
				console.log("sweep Store Updated");
				console.log(sweepAgreementStore);
			},
			
			
			applyAllSweep : function (e, data) {
				sweepAgreementStore = [];
				sweepAgreementStore.push(data);
				sweepAgreementsAssignedCount = sweepAgreementsCount;
				$('#lblSweepAgreementCount').text(sweepAgreementsAssignedCount + " of " + sweepAgreementsCount + "  " + getLabel("lbl.clientUser.selected"," Selected"));

				console.log("Apply All sweep Agreements");
				console.log(sweepAgreementStore);
			},
			
			removeAllSweep : function (e, data) {
				sweepAgreementStore = [];
				sweepAgreementStore.push(data);
				sweepAgreementsAssignedCount =0;
				$('#lblSweepAgreementCount').text(sweepAgreementsAssignedCount + " of " + sweepAgreementsCount + "  " + getLabel("lbl.clientUser.selected"," Selected"));

				console.log("Removed All sweep agreements");
				console.log(sweepAgreementStore);
			},
			
			updatePortalDetails : function (e, data) {
				portalStore =[];
				portalStore.push(data);
				console.log("portal Store Updated");
				console.log(portalStore);
			},
			
			updateMobileDetails : function (e, data) {
				mobileStore =[];
				mobileStore.push(data);
				console.log("mobile Store Updated");
				console.log(mobileStore);
			},
			
			userLimitsUpdate  :function(e,data){
				limitStore =[];
				limitStore.push(data);
				console.log("Limit Store Updated");
				console.log(limitStore);
				CommonUser.next();
			},
			
			resetCustomProfiles : function(profileRef){
				$.each(profileRef,function(index,cat){
						cat.profileCode = "";
						cat.profileDescription = "";
				});
			},
			
			updateLimitFlag : function(e,data){
				
				if(data.limitName == "PaymentCategory"){
					if(data.defLimitType == "maker"){
						userWorkingData.assets[0].makerPaymentCategoryEnabled = data.status;
						userWorkingData.assets[0].limitType = data.limitType;
						//If Enable Flag False then reset all fields in panel
						if(!data.status){
							userWorkingData.assets[0].defaultMakerPaymentCategoryCode = "" ;
							userWorkingData.assets[0].defaultMakerPaymentCategory  = "";
							CommonUserObj.resetCustomProfiles(userWorkingData.assets[0].makerPaymentCategory);
						}
					}else{
						userWorkingData.assets[0].checkerPaymentCategoryEnabled = data.status;
						userWorkingData.assets[0].limitType = data.limitType;
						//If Enable Flag False then reset all fields in panel
						if(!data.status){
							userWorkingData.assets[0].defaultCheckerPaymentCategoryCode = "" ;
							userWorkingData.assets[0].defaultCheckerPaymentCategory  = "";
							CommonUserObj.resetCustomProfiles(userWorkingData.assets[0].checkerPaymentCategory);
						}
					}
					UsersApp.trigger('renderPayCategory', userWorkingData);
					
				}else if(data.limitName == "PaymentTemplate"){
					if(data.defLimitType == "maker"){
						userWorkingData.assets[0].makerPaymentTemplateEnabled = data.status;
						userWorkingData.assets[0].limitType = data.limitType;
						//If Enable Flag False then reset all fields in panel
						if(!data.status){
							userWorkingData.assets[0].defaultMakerPaymentTemplateCode = "" ;
							userWorkingData.assets[0].defaultMakerPaymentTemplate  = "";
							CommonUserObj.resetCustomProfiles(userWorkingData.assets[0].makerPaymentTemplete);
						}
					}else{
						userWorkingData.assets[0].checkerPaymentTemplateEnabled = data.status;
						userWorkingData.assets[0].limitType = data.limitType;
						//If Enable Flag False then reset all fields in panel
						if(!data.status){
							userWorkingData.assets[0].defaultCheckerPaymentTemplateCode = "" ;
							userWorkingData.assets[0].defaultCheckerPaymentTemplate  = "";
							CommonUserObj.resetCustomProfiles(userWorkingData.assets[0].checkerPaymentTemplate);
						}
					}
					UsersApp.trigger('renderPayCategoryTemplate', userWorkingData);

				}else if(data.limitName == "SecCode"){
					if(data.defLimitType == "maker"){
						userWorkingData.assets[0].makerSecCodeEnabled = data.status;
						userWorkingData.assets[0].limitType = data.limitType;		
						//If Enable Flag False then reset all fields in panel
						if(!data.status){
							userWorkingData.assets[0].defaultMakerSecCodeCode = "" ;
							userWorkingData.assets[0].defaultMakerSecCode  = "";
							CommonUserObj.resetCustomProfiles(userWorkingData.assets[0].makerSecCode);
						}
					}else{
						userWorkingData.assets[0].checkerSecCodeEnabled = data.status;
						userWorkingData.assets[0].limitType = data.limitType;		
						//If Enable Flag False then reset all fields in panel
						if(!data.status){
							userWorkingData.assets[0].defaultCheckerSecCodeCode = "" ;
							userWorkingData.assets[0].defaultCheckerSecCode  = "";
							CommonUserObj.resetCustomProfiles(userWorkingData.assets[0].checkerSecCode);
						}
					}
					UsersApp.trigger('renderSecCode', userWorkingData);
				}else if(data.limitName == "AchRev"){
					if(data.defLimitType == "maker"){
						userWorkingData.assets[0].makerAchReversalEnabled = data.status;
						userWorkingData.assets[0].limitType = data.limitType;		
						//If Enable Flag False then reset all fields in panel
						if(!data.status){
							userWorkingData.assets[0].defaultMakerAchReversalCode = "" ;
							userWorkingData.assets[0].defaultMakerAchReversal  = "";
						}
					}else{
						userWorkingData.assets[0].checkerAchReversalEnabled = data.status;
						userWorkingData.assets[0].limitType = data.limitType;		
						//If Enable Flag False then reset all fields in panel
						if(!data.status){
							userWorkingData.assets[0].defaultCheckerAchReversalCode = "" ;
							userWorkingData.assets[0].defaultCheckerAchReversal  = "";
						}
					}
					UsersApp.trigger('renderAchRev', userWorkingData);
				}else if(data.limitName == "AchPassThru"){
					if(data.defLimitType == "maker"){
						userWorkingData.assets[0].makerAchPassthruEnabled = data.status;
						userWorkingData.assets[0].limitType = data.limitType;	
						//If Enable Flag False then reset all fields in panel
						if(!data.status){
							userWorkingData.assets[0].defaultMakerAchPassthruCCYCode = "" ;
							userWorkingData.assets[0].defaultMakerAchPassthruCCY  = "";
							userWorkingData.assets[0].makerFileLevelCreditLimitAmt = "";
							userWorkingData.assets[0].makerFileLevelDebitLimitAmt = "";
							userWorkingData.assets[0].makerBatchLevelCreditLimitAmt = "";
							userWorkingData.assets[0].makerBatchLevelDebitLimitAmt = "";
							userWorkingData.assets[0].makerCumulativeCreditLimitAmt = "";
							userWorkingData.assets[0].makerCumulativeDebitLimitAmt = "";
						}
					}else{
						userWorkingData.assets[0].checkerAchPassthruEnabled = data.status;
						userWorkingData.assets[0].limitType = data.limitType;		
						//If Enable Flag False then reset all fields in panel
						if(!data.status){
							userWorkingData.assets[0].defaultCheckerAchPassthruCCYCode = "" ;
							userWorkingData.assets[0].defaultCheckerAchPassthruCCY  = "";
							userWorkingData.assets[0].checkerFileLevelCreditLimitAmt = "";
							userWorkingData.assets[0].checkerFileLevelDebitLimitAmt = "";
							userWorkingData.assets[0].checkerBatchLevelCreditLimitAmt = "";
							userWorkingData.assets[0].checkerBatchLevelDebitLimitAmt = "";
							userWorkingData.assets[0].checkerCumulativeCreditLimitAmt = "";
							userWorkingData.assets[0].checkerCumulativeDebitLimitAmt = "";
						}
					}
					UsersApp.trigger('renderAchPassThru', userWorkingData);
				}else if(data.limitName == "PaymentPackage"){
					if(data.defLimitType == "maker"){
						userWorkingData.assets[0].makerPackageEnabled = data.status;
						userWorkingData.assets[0].limitType = data.limitType;
						//If Enable Flag False then reset all fields in panel
						if(!data.status){
							userWorkingData.assets[0].defaultMakerPackageCode = "" ;
							userWorkingData.assets[0].defaultMakerPackage  = "";
							if(userWorkingData.assets[0].makerPackage){
								CommonUserObj.resetCustomProfiles(userWorkingData.assets[0].makerPackage);								
							}
						}
					}else{
						userWorkingData.assets[0].checkerPackageEnabled = data.status;
						userWorkingData.assets[0].limitType = data.limitType;
						//If Enable Flag False then reset all fields in panel
						if(!data.status){
							userWorkingData.assets[0].defaultCheckerPackageCode = "" ;
							userWorkingData.assets[0].defaultCheckerPackage  = "";
							if(userWorkingData.assets[0].checkerPackage){
								CommonUserObj.resetCustomProfiles(userWorkingData.assets[0].checkerPackage);								
							}
						}
					}
					UsersApp.trigger('renderPaypackage', userWorkingData);
				}
			},
			
			updateDefLimit : function(e,data){
				if(data.limitName == "PaymentCategory"){
					userWorkingData.assets[0].limitType = data.limitType;
					if(data.defLimitType == "maker"){
						userWorkingData.assets[0].defaultMakerPaymentCategoryCode = data.defLimitProfId ;
						userWorkingData.assets[0].defaultMakerPaymentCategory  = data.defLimitProfDesc;
						CommonUserObj.resetCustonToDefault(userWorkingData.assets[0].makerPaymentCategory,data.defLimitProfId,data.defLimitProfDesc);
					}else{
						userWorkingData.assets[0].defaultCheckerPaymentCategoryCode = data.defLimitProfId ;
						userWorkingData.assets[0].defaultCheckerPaymentCategory  = data.defLimitProfDesc;
						CommonUserObj.resetCustonToDefault(userWorkingData.assets[0].checkerPaymentCategory,data.defLimitProfId,data.defLimitProfDesc);
					}
					UsersApp.trigger('renderPayCategory', userWorkingData);
				}else if(data.limitName == "PaymentTemplate"){
					userWorkingData.assets[0].limitType = data.limitType;
					if(data.defLimitType == "maker"){
						userWorkingData.assets[0].defaultMakerPaymentTemplateCode = data.defLimitProfId ;
						userWorkingData.assets[0].defaultMakerPaymentTemplate  = data.defLimitProfDesc;
						CommonUserObj.resetCustonToDefault(userWorkingData.assets[0].makerPaymentTemplete,data.defLimitProfId,data.defLimitProfDesc);
					}else{
						userWorkingData.assets[0].defaultCheckerPaymentTemplateCode = data.defLimitProfId ;
						userWorkingData.assets[0].defaultCheckerPaymentTemplate  = data.defLimitProfDesc;
						CommonUserObj.resetCustonToDefault(userWorkingData.assets[0].checkerPaymentTemplate,data.defLimitProfId,data.defLimitProfDesc);
					}
					UsersApp.trigger('renderPayCategoryTemplate', userWorkingData);
				}else if(data.limitName == "PaymentPackage"){
					userWorkingData.assets[0].limitType = data.limitType;
					if(data.defLimitType == "maker"){
						userWorkingData.assets[0].defaultMakerPackageCode = data.defLimitProfId ;
						userWorkingData.assets[0].defaultMakerPackage  = data.defLimitProfDesc;
						CommonUserObj.resetCustonToDefault(userWorkingData.assets[0].makerPackage,data.defLimitProfId,data.defLimitProfDesc);
					}else{
						userWorkingData.assets[0].defaultCheckerPackageCode = data.defLimitProfId ;
						userWorkingData.assets[0].defaultCheckerPackage  = data.defLimitProfDesc;
						CommonUserObj.resetCustonToDefault(userWorkingData.assets[0].checkerPackage,data.defLimitProfId,data.defLimitProfDesc);
					}
					UsersApp.trigger('renderPaypackage', userWorkingData);
				}else if(data.limitName == "SecCode"){
					userWorkingData.assets[0].limitType = data.limitType;
					if(data.defLimitType == "maker"){
						userWorkingData.assets[0].defaultMakerSecCodeCode = data.defLimitProfId ;
						userWorkingData.assets[0].defaultMakerSecCode  = data.defLimitProfDesc;
						CommonUserObj.resetCustonToDefault(userWorkingData.assets[0].makerSecCode,data.defLimitProfId,data.defLimitProfDesc);
					}else{
						userWorkingData.assets[0].defaultCheckerSecCodeCode = data.defLimitProfId ;
						userWorkingData.assets[0].defaultCheckerSecCode  = data.defLimitProfDesc;
						CommonUserObj.resetCustonToDefault(userWorkingData.assets[0].checkerSecCode,data.defLimitProfId,data.defLimitProfDesc);
					}
					UsersApp.trigger('renderSecCode', userWorkingData);
				}else if(data.limitName == "AchRev"){
					userWorkingData.assets[0].limitType = data.limitType;
					if(data.defLimitType == "maker"){
						userWorkingData.assets[0].defaultMakerAchReversalCode = data.defLimitProfId ;
						userWorkingData.assets[0].defaultMakerAchReversal  = data.defLimitProfDesc;
					}else{
						userWorkingData.assets[0].defaultCheckerAchReversalCode = data.defLimitProfId ;
						userWorkingData.assets[0].defaultCheckerAchReversal  = data.defLimitProfDesc;
					}
					UsersApp.trigger('renderAchRev', userWorkingData);
				}else if(data.limitName == "AchPassThruCurr"){
					userWorkingData.assets[0].limitType = data.limitType;
					if(data.defLimitType == "maker"){
						userWorkingData.assets[0].defaultMakerAchPassthruCCYCode = data.defLimitProfId ;
						userWorkingData.assets[0].defaultMakerAchPassthruCCY  = data.defLimitProfDesc;
					}else{
						userWorkingData.assets[0].defaultCheckerAchPassthruCCYCode = data.defLimitProfId ;
						userWorkingData.assets[0].defaultCheckerAchPassthruCCY  = data.defLimitProfDesc;
					}
					UsersApp.trigger('renderAchPassThru', userWorkingData);
				}
	        	//UsersApp.trigger('renderLimit', userWorkingData);
			},
			
			//Resets all Custom Drop-down to default profile
			resetCustonToDefault : function(profileRef,defProfCode,defProfDesc){
				$.each(profileRef,function(index,cat){
						cat.profileCode = (defProfCode == "Select" ? "" : defProfCode );
						cat.profileDescription = (defProfDesc == "Select" ? "" : defProfDesc );
				});
			},
			
						
			updateCustLimit : function(e,data){
				if(data.limitName == "PaymentCategory"){
					userWorkingData.assets[0].limitType = data.limitType;
					if(data.defLimitType == "maker"){
						$.each(userWorkingData.assets[0].makerPaymentCategory,function(index,cat){
							if(cat.categoryCode == data.categorycode){
								cat.profileCode = data.custLimitProfId;
								cat.profileDescription = data.custLimitProfDesc;
							}
						});
					}else{
						$.each(userWorkingData.assets[0].checkerPaymentCategory,function(index,cat){
							if(cat.categoryCode == data.categorycode){
								cat.profileCode = data.custLimitProfId;
								cat.profileDescription = data.custLimitProfDesc;
							}
						});
					}
				}else if(data.limitName == "PaymentTemplate"){
					userWorkingData.assets[0].limitType = data.limitType;
					if(data.defLimitType == "maker"){
						$.each(userWorkingData.assets[0].makerPaymentTemplete,function(index,cat){
							if(cat.categoryCode == data.categorycode && cat.tempTypeCode == data.custTempTypeCode){
								cat.profileCode = data.custLimitProfId;
								cat.profileDescription = data.custLimitProfDesc;
							}
						});
					}else{
						$.each(userWorkingData.assets[0].checkerPaymentTemplate,function(index,cat){
							if(cat.categoryCode == data.categorycode && cat.tempTypeCode == data.custTempTypeCode){
								cat.profileCode = data.custLimitProfId;
								cat.profileDescription = data.custLimitProfDesc;
							}
						});
					}
				}else if(data.limitName == "PaymentPackage"){
					userWorkingData.assets[0].limitType = data.limitType;
					if(data.defLimitType == "maker"){
						if(userWorkingData.assets[0].makerPackage){
							$.each(userWorkingData.assets[0].makerPackage,function(index,cat){
								if(cat.categoryCode == data.categorycode){
									cat.profileCode = data.custLimitProfId;
									cat.profileDescription = data.custLimitProfDesc;
								}
							});
						}
					}else{
						if(userWorkingData.assets[0].checkerPackage){
							$.each(userWorkingData.assets[0].checkerPackage,function(index,cat){
								if(cat.categoryCode == data.categorycode){
									cat.profileCode = data.custLimitProfId;
									cat.profileDescription = data.custLimitProfDesc;
								}
							});
						}
					}
					
				}else if(data.limitName == "SecCode"){
					userWorkingData.assets[0].limitType = data.limitType;
					if(data.defLimitType == "maker"){
						$.each(userWorkingData.assets[0].makerSecCode,function(index,cat){
							if(cat.categoryCode == data.categorycode){
								cat.profileCode = data.custLimitProfId;
								cat.profileDescription = data.custLimitProfDesc;
							}
						});
					}else{
						$.each(userWorkingData.assets[0].checkerSecCode,function(index,cat){
							if(cat.categoryCode == data.categorycode){
								cat.profileCode = data.custLimitProfId;
								cat.profileDescription = data.custLimitProfDesc;
							}
						});
					}
				}
			},
			
			
			//Merging Logic
			updateUserDetailsuserWorkingData : function(command){
				if(command.commandName == "CreateUserDetail" || command.commandName == "UpdateUserDetail" || command.commandName == "CopyUserDetail"){
					
					userWorkingData.firstName = command.kv.firstName;
		        	userWorkingData.lastName = command.kv.lastName;
		        	userWorkingData.activationDate = command.kv.activationDate;
		        	userWorkingData.department = command.kv.department;
		        	userWorkingData.telephone = command.kv.telephone;
		        	userWorkingData.email = command.kv.email.replace(/amp;/g,'');
		        	userWorkingData.mobileNo = command.kv.mobileNo;
		        	
		        	if(command.commandName == "CopyUserDetail"){
			        	userWorkingData.address.addressLine1 = command.kv.address.addressLine1;
			        	userWorkingData.address.zipCode = command.kv.address.zipCode;
			        	userWorkingData.address.fax = command.kv.address.fax;
			        	userWorkingData.address.city = command.kv.address.city;

		        	}else{
			        	userWorkingData.address.addressLine1 = command.kv.address;
			        	userWorkingData.address.zipCode = command.kv.zipcode;
			        	userWorkingData.address.fax = command.kv.fax;
			        	userWorkingData.address.city = command.kv.city;
		        	}
		        	
		        	userWorkingData.usrCountry = command.kv.usrCountry,	
		        	userWorkingData.usrCountryDesc = command.kv.usrCountryDesc,
		        	userWorkingData.usrApprovalLevel = command.kv.usrApprovalLevel;
		        	
		        	userWorkingData.isTemplateOnly = command.kv.isTemplateOnly;
		        	userWorkingData.superUser  = command.kv.superUser;
		        	userWorkingData.allowConfidential  = command.kv.allowConfidential;
					userWorkingData.disableReject  = command.kv.disableReject;
		        	userWorkingData.requireMFA  = command.kv.requireMFA;
		        	userWorkingData.usrState  = command.kv.usrState;
		        	userWorkingData.usrStateDesc  = command.kv.usrStateDesc;
		        	userWorkingData.usrLanguage  = command.kv.usrLanguage;
		        	userWorkingData.usrLanguageDesc  = command.kv.usrLanguageDesc;
		        	userWorkingData.usrMfaTrigger  = command.kv.usrMfaTrigger;
		        	userWorkingData.mfaTriggerDesc  = command.kv.mfaTriggerDesc;
		        	
		        	userWorkingData.usrClient  = command.kv.usrClient;				
		        	
		        	if(!userWorkingData.copyFromFlag && userWorkingData.recordKeyNo){
			        	var cmdVersion = commandVersion + 1 ;
						commandVersion += 1 ;
						UsersApp.trigger('UpdateUserDetail', {
							commandName: "UpdateUserDetail",
							path: '/userApi/userDetails/UpdateUser',
							kv: {
									firstName: userWorkingData.firstName,
									lastName: userWorkingData.lastName,
									department: userWorkingData.department,
									telephone: userWorkingData.telephone,
									email: userWorkingData.email,
									mobileNo: userWorkingData.mobileNo,
									address: userWorkingData.address.addressLine1,
									zipcode: userWorkingData.address.zipCode,
									fax: userWorkingData.address.fax,
									city: userWorkingData.address.city,
									usrCountry: userWorkingData.usrCountry,
									usrCountryDesc: userWorkingData.usrCountryDesc,
									activationDate : userWorkingData.activationDate,
									usrApprovalLevel : userWorkingData.usrApprovalLevel,
									isTemplateOnly : userWorkingData.isTemplateOnly,
									superUser : userWorkingData.superUser,
									allowConfidential : userWorkingData.allowConfidential,
									disableReject : userWorkingData.disableReject,
									requireMFA : userWorkingData.requireMFA,
									usrState : userWorkingData.usrState,
									usrStateDesc : userWorkingData.usrStateDesc,
									usrLanguage : userWorkingData.usrLanguage,
									usrLanguageDesc : userWorkingData.usrLanguageDesc,
									corpId : userWorkingData.corpId,
									usrClient : userWorkingData.usrClient,
									lngActivationDate :lngActivationDate,
									usrMfaTrigger : userWorkingData.usrMfaTrigger,
									mfaTriggerDesc : userWorkingData.mfaTriggerDesc,
									commandVersion : cmdVersion
								}
						  });
		        	}
		        	
				}else if(command.commandName == "SwitchUserRole"){
					var strUrl= "";
					userWorkingData.usrRoleId = command.kv.usrRoleId;
					if(userWorkingData.recordKeyNo){
						
						if(userWorkingData.copyFromFlag){
							strUrl =  "services/usersLookUpApi/userDetails/?roleId=" + command.kv.usrRoleId + "&corpId=" + command.kv.corpId + "&recordKeyNo=" + userWorkingData.recordKeyNo + "&userId=" +  userWorkingData.srcLoginId;
					 	}else{
					 		strUrl =  "services/usersLookUpApi/userDetails/?roleId=" + command.kv.usrRoleId + "&corpId=" + command.kv.corpId + "&recordKeyNo=" + userWorkingData.recordKeyNo + "&userId=" +  userWorkingData.loginId;
					 	}
						$.blockUI();
						$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;Loading...</h2></div>',
						css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});

						 $.ajax({			
							 	url: strUrl,
						        type: "POST",
						        async : false,
						        contentType: "application/json; charset=utf-8",
						        success: function (data) {
						        	userWorkingData.subsidiaries = data.subsidiaries;
						        	userWorkingData.approvalLevelList = data.approvalLevelList;
						        	userWorkingData.brEnable  = data.brEnable;
						        	userWorkingData.collectionEnable = data.collectionEnable;
						        	userWorkingData.fscEnable = data.fscEnable;
						        	userWorkingData.forecastEnable = data.forecastEnable;
						        	userWorkingData.limitEnable = data.limitEnable;
						        	userWorkingData.mobileEnble = data.mobileEnble;
						        	userWorkingData.lmsEnable = data.lmsEnable;
						        	userWorkingData.payEnable = data.payEnable;
						        	userWorkingData.portalEnable = data.portalEnable;
						        	/*userWorkingData.usrMobileEnble = data.usrMobileEnble;
						        	userWorkingData.rdcFlag = data.rdcFlag;
						        	userWorkingData.rdcUserKey = data.rdcUserKey;*/
						        	userWorkingData.subsidiaryCount =data.subsidiaryCount
						        	userWorkingData.metaData = data.metaData;
						        	userWorkingData.usrLanguage =data.usrLanguage
						        	
						        	if(!userWorkingData.copyFromFlag){
							        	var cmdVersion = commandVersion + 1 ;
										commandVersion += 1 ;
										UsersApp.trigger('UpdateUserDetail', {
											commandName: "UpdateUserDetail",
											path: '/userApi/userDetails/UpdateUser',
											kv: {
													firstName: userWorkingData.firstName,
													lastName: userWorkingData.lastName,
													department: userWorkingData.department,
													telephone: userWorkingData.telephone,
													email: userWorkingData.email,
													mobileNo: userWorkingData.mobileNo,
													address: userWorkingData.address.addressLine1,
													zipcode: userWorkingData.address.zipCode,
													fax: userWorkingData.address.fax,
													city: userWorkingData.address.city,
													usrCountry: userWorkingData.usrCountry,
													usrCountryDesc: userWorkingData.usrCountryDesc,
													activationDate : userWorkingData.activationDate,
													usrApprovalLevel : userWorkingData.usrApprovalLevel,
													isTemplateOnly : userWorkingData.isTemplateOnly,
													superUser : userWorkingData.superUser,
													allowConfidential : userWorkingData.allowConfidential,
													disableReject : userWorkingData.disableReject,
													requireMFA : userWorkingData.requireMFA,
													usrState : userWorkingData.usrState,
													usrStateDesc : userWorkingData.usrStateDesc,
													usrLanguage : userWorkingData.usrLanguage,
													usrLanguageDesc : userWorkingData.usrLanguageDesc,
													corpId : userWorkingData.corpId,
													usrClient : userWorkingData.usrClient,
													lngActivationDate :lngActivationDate,
													usrMfaTrigger : userWorkingData.usrMfaTrigger,
													mfaTriggerDesc : userWorkingData.mfaTriggerDesc,
													commandVersion : cmdVersion
												}
										  });
						        	}
						        	
						        	
						        },
						        error: function (request, status, error) {
						            $('#errorDiv').removeClass('hidden');
						            
						            var er = JSON.parse(request.responseText);
						            if(er.length > 0){
						            	$.each(er,function(index,item){
						            		$('#errorPara').text(item.errorMessage);
						            	});
						            }
						            
						            if(event)
						            	event.preventDefault();
						        	$.unblockUI();
						        }
						    });
				        	$.unblockUI();
						}
					 
				}else if(command.commandName == "AddUserSubsidiary" || command.commandName == "RemoveUserSubsidiary" ){
					
					var index = userWorkingData.subsidiaries.findIndex(function(obj){
						return obj.subsidiaryId == command.kv.subsidiaryId;
		        	});
					var subValue
		        	
					if(command.commandName == "AddUserSubsidiary"){
		        		command.kv.colorClass = 'B';
		        		subValue = new String(command.kv.subsidiaryName);
						subValue = subValue.replace(/quot;/g, '');
		        		command.kv.subsidiaryName = subValue.replace(/amp;/g, '');
						//userWorkingData.subsidiaryAssignedCount++;
					}
		        	else{
		        		command.kv.colorClass = 'R';
		        		//userWorkingData.subsidiaryAssignedCount--;
		        	}
					
					if($('#userCategory').val() && ($('#userCategory').val() != 'Select')){
						if($('#userCategory').val() == command.kv.usrRoleId){
				        	if(index != -1){
				        		if(!userWorkingData.copyFromFlag && userWorkingData.recordKeyNo)
				        			command.kv.digest = userWorkingData.subsidiaries[index].digest;
				        		$.extend( userWorkingData.subsidiaries[index], command.kv );	        		
				        	}else{
				        		userWorkingData.subsidiaries.push(command.kv);
				        	}						
						}
					}else{
						if(userWorkingData.usrRoleId == command.kv.usrRoleId){
							if(index != -1){
								if(!userWorkingData.copyFromFlag && userWorkingData.recordKeyNo)
									command.kv.digest = userWorkingData.subsidiaries[index].digest;
				        		$.extend( userWorkingData.subsidiaries[index], command.kv );	        		
				        	}else{
				        		userWorkingData.subsidiaries.push(command.kv);
				        	}
						}					
					}
					// Get Updated Approval Matrix
					var  subsidairies ="";
					$.each(userWorkingData.subsidiaries,function(index,subsidiary){
						if(subsidiary.assignedFlag){
							subsidairies += subsidiary.subsidiaryId +",";
						}
					});
					subsidairies = subsidairies.substring(0, subsidairies.length - 1);
					
					$.blockUI();
					$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;Loading...</h2></div>',
					css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});
					$.ajax({
				        url: "services/usersLookUpApi/approvalMatrix",
				        type: "POST",
				        data: {
				        	"roleId" : userWorkingData.usrRoleId,
				        	"userId" : userWorkingData.loginId,
				        	"corpId" : userWorkingData.corpId,
				        	"subsidairies" : subsidairies
				        },
				        async : false,
				        contentType: "application/json; charset=utf-8",
				        dataType: "json",
				        success: function (approvalMatrix) {
				        	userWorkingData.approvalMatrix = approvalMatrix;
				        	userWorkingData.authMatrixAssignedCount = 0;
				        	userWorkingData.authMatrixCount = approvalMatrix.length;
				        	$.unblockUI();
				        },
				        error: function () {
				            $('#errorDiv').removeClass('hidden');
				        	$('#errorPara').text("An error has occured!!!");
				        	$.unblockUI();
				        	if(event)
					            event.preventDefault();
				        }
				    });	
					
					
					
				}else if(command.commandName == "AddApprovalMatrix" || command.commandName == "RemoveApprovalMatrix" ){
					
					if(userWorkingData.approvalMatrix){
						var index = userWorkingData.approvalMatrix.findIndex(function(obj){
							return obj.authMatrixId == command.kv.authMatrixId;
						});
						
						if(command.commandName == "AddApprovalMatrix"){
			        		userWorkingData.authMatrixAssignedCount++;
						}
			        	else{
			        		userWorkingData.authMatrixAssignedCount--;
			        	}
						
						if(index != -1){
							command.kv.digest = userWorkingData.approvalMatrix[index].digest;
							$.extend( userWorkingData.approvalMatrix[index], command.kv );
			        	}else{
			        		userWorkingData.approvalMatrix.push(command.kv);
			        	}
					}
					
				}else if(command.commandName == "ApplyAllApprovalMatrix" || command.commandName == "RemoveAllApprovalMatrix" ){
					
					userWorkingData.assignAllApprovalMatrix = command.kv.assignAllApprovalMatrix;
					if(command.commandName == "RemoveAllApprovalMatrix"){
						if(userWorkingData.approvalMatrix){
							$.each(userWorkingData.approvalMatrix,function(index,item){
								item.assignedFlag = false;
								userWorkingData.authMatrixAssignedCount = 0;
							});
							
						}					
					}else{
						if(userWorkingData.approvalMatrix){
							$.each(userWorkingData.approvalMatrix,function(index,item){
								item.assignedFlag = true;
								userWorkingData.authMatrixAssignedCount = userWorkingData.authMatrixCount;
					    	});
							
						}					
					}
				
				}
			},
			
			
			updateUserAssetInuserWorkingData : function(command,assetIndex){
				var index;
				if(command.commandName == "AddUserAccounts" || command.commandName == "RemoveUserAccounts" ){
					
					if(null != userWorkingData
							&& null != userWorkingData.assets[assetIndex]
							&& null !=	userWorkingData.assets[assetIndex].accounts){
						
						index = userWorkingData.assets[assetIndex].accounts.findIndex(function(obj){
							return obj.accountId == command.kv.accountId;
			        	})
					}else{
						index = -1;
						userWorkingData.assets[assetIndex].accounts = [];
					}
					console.log(command.commandName+" "+index);
					
					if(command.commandName == "AddUserAccounts"){
		        		command.kv.colorClass = 'B';
		        		userWorkingData.assets[assetIndex].accountsAssignedCount++;
					}
		        	else{
		        		command.kv.colorClass = 'R';
		        		userWorkingData.assets[assetIndex].accountsAssignedCount--;
		        	}
		        		
		        	if(index != -1){
		        		command.kv.digest = userWorkingData.assets[assetIndex].accounts[index].digest;
		        		$.extend( userWorkingData.assets[assetIndex].accounts[index], command.kv );
		        	}else{
		        		userWorkingData.assets[assetIndex].accounts.push(command.kv);
		        	}
				}else if(command.commandName == "ApplyAllUserAccounts" || command.commandName == "RemoveAllUserAccounts" ){
					userWorkingData.assets[assetIndex].allAccounts = command.kv.allAccounts;
					if(command.commandName == "RemoveAllUserAccounts"){
						if(userWorkingData.assets[assetIndex].accounts){
							$.each(userWorkingData.assets[assetIndex].accounts,function(index,item){
								item.assignedFlag = false;
								item.colorClass = 'R';
								userWorkingData.assets[assetIndex].accountsAssignedCount = 0;
							});						
						}
					}else{
						if(userWorkingData.assets[assetIndex].accounts){
							$.each(userWorkingData.assets[assetIndex].accounts,function(index,item){
								item.assignedFlag = true;
								item.colorClass = 'B';
								userWorkingData.assets[assetIndex].accountsAssignedCount = userWorkingData.assets[assetIndex].accountsCount;
							});						
						}
					}
				}else if(command.commandName == "AddUserPackages" || command.commandName == "RemoveUserPackages" ){
					
					if(null != userWorkingData
							&& null != userWorkingData.assets[assetIndex]
							&& null !=	userWorkingData.assets[assetIndex].packages){
						
						index = userWorkingData.assets[assetIndex].packages.findIndex(function(obj){
							return obj.packageId == command.kv.packageId && obj.subsidiaryId == command.kv.subsidiaryId;
			        	})
					}else{
						index = -1;
						userWorkingData.assets[assetIndex].packages = [];
					}
					
					if(command.commandName == "AddUserPackages"){
		        		command.kv.colorClass = 'B';
		        		userWorkingData.assets[assetIndex].packagesAssignedCount++;
					}else{
		        		command.kv.colorClass = 'R';
		        		userWorkingData.assets[assetIndex].packagesAssignedCount--;
					}
					
					if(index != -1){
						command.kv.digest = userWorkingData.assets[assetIndex].packages[index].digest;
						$.extend( userWorkingData.assets[assetIndex].packages[index], command.kv );
		        	}else{
		        		userWorkingData.assets[assetIndex].packages.push(command.kv);
		        	}
				}else if(command.commandName == "ApplyAllUserPackages" || command.commandName == "RemoveAllUserPackages" ){
					userWorkingData.assets[assetIndex].allPackages = command.kv.allPackages;
					if(command.commandName == "RemoveAllUserPackages"){
						if(userWorkingData.assets[assetIndex].packages){
							$.each(userWorkingData.assets[assetIndex].packages,function(index,item){
								item.assignedFlag = false;
								item.colorClass = 'R';
								userWorkingData.assets[assetIndex].packagesAssignedCount = 0;
							});						
						}
					}else{
						if(userWorkingData.assets[assetIndex].packages){
							$.each(userWorkingData.assets[assetIndex].packages,function(index,item){
								item.assignedFlag = true;
								item.colorClass = 'B';
								userWorkingData.assets[assetIndex].packagesAssignedCount = userWorkingData.assets[assetIndex].packagesCount;
							});						
						}
					}
				}else if(command.commandName == "AddUserTemplates" || command.commandName == "RemoveUserTemplates" ){
					
					if(null != userWorkingData
							&& null != userWorkingData.assets[assetIndex]
							&& null !=	userWorkingData.assets[assetIndex].templates){
						
						index = userWorkingData.assets[assetIndex].templates.findIndex(function(obj){
							return obj.templateId == command.kv.templateId;
			        	})
					}else{
						index = -1;
						userWorkingData.assets[assetIndex].templates = [];
					}
					
					if(command.commandName == "AddUserTemplates"){
		        		command.kv.colorClass = 'B';
		        		userWorkingData.assets[assetIndex].templatesAssignedCount++;
					}else{
		        		command.kv.colorClass = 'R';
		        		userWorkingData.assets[assetIndex].templatesAssignedCount--;
					}
					
					if(index != -1){
						command.kv.digest = userWorkingData.assets[assetIndex].templates[index].digest;
						$.extend( userWorkingData.assets[assetIndex].templates[index], command.kv );
		        	}else{
		        		userWorkingData.assets[assetIndex].templates.push(command.kv);
		        	}
				}else if(command.commandName == "ApplyAllUserTemplates" || command.commandName == "RemoveAllUserTemplates" ){
					userWorkingData.assets[assetIndex].allTemplates = command.kv.allTemplates;
					if(command.commandName == "RemoveAllUserTemplates"){
						if(userWorkingData.assets[assetIndex].templates){
							$.each(userWorkingData.assets[assetIndex].templates,function(index,item){
								item.assignedFlag = false;
								item.colorClass = 'R';
								userWorkingData.assets[assetIndex].templatesAssignedCount = 0;
							});						
						}
					}else{
						if(userWorkingData.assets[assetIndex].templates){
							$.each(userWorkingData.assets[assetIndex].templates,function(index,item){
								item.assignedFlag = true;
								item.colorClass = 'B';
								userWorkingData.assets[assetIndex].templatesAssignedCount = userWorkingData.assets[assetIndex].templatesCount;
							});						
						}
					}
				}else if(command.commandName == "AddUserNotional" || command.commandName == "RemoveUserNotional" ){
					
					if(null != userWorkingData
							&& null != userWorkingData.assets[assetIndex]
							&& null !=	userWorkingData.assets[assetIndex].notionalAgreements){
						
						index = userWorkingData.assets[assetIndex].notionalAgreements.findIndex(function(obj){
							return obj.agreementCode == command.kv.agreementCode;
			        	})
					}else{
						index = -1;
						userWorkingData.assets[assetIndex].notionalAgreements = [];
					}
					
					if(command.commandName == "AddUserNotional"){
		        		command.kv.colorClass = 'B';
		        		userWorkingData.assets[assetIndex].notionalAgreementsAssignedCount++;
					}else{
		        		command.kv.colorClass = 'R';
		        		userWorkingData.assets[assetIndex].notionalAgreementsAssignedCount--;
					}
					
					if(index != -1){
						command.kv.digest = userWorkingData.assets[assetIndex].notionalAgreements[index].digest;
						$.extend( userWorkingData.assets[assetIndex].notionalAgreements[index], command.kv );
		        	}else{
		        		userWorkingData.assets[assetIndex].notionalAgreements.push(command.kv);
		        	}
				}
				else if(command.commandName == "AddUserSweep" || command.commandName == "RemoveUserSweep" ){
					
					if(null != userWorkingData
							&& null != userWorkingData.assets[assetIndex]
							&& null !=	userWorkingData.assets[assetIndex].sweepAgreements){
						
						index = userWorkingData.assets[assetIndex].sweepAgreements.findIndex(function(obj){
							return obj.agreementCode == command.kv.agreementCode;
			        	})
					}else{
						index = -1;
						userWorkingData.assets[assetIndex].sweepAgreements = [];
					}
					
						if(command.commandName == "AddUserSweep"){
		        			command.kv.colorClass = 'B';
		        			userWorkingData.assets[assetIndex].sweepAgreementsAssignedCount++;
						}else{
		            	command.kv.colorClass = 'R';
		        		userWorkingData.assets[assetIndex].sweepAgreementsAssignedCount--;
						}
					
					if(index != -1){
						command.kv.digest = userWorkingData.assets[assetIndex].sweepAgreements[index].digest;
						$.extend( userWorkingData.assets[assetIndex].sweepAgreements[index], command.kv );
		        	}else{
		        		userWorkingData.assets[assetIndex].sweepAgreements.push(command.kv);
		        	}
				}else if(command.commandName == "ApplyAllUserNotional" || command.commandName == "RemoveAllUserNotional" ){
					userWorkingData.assets[assetIndex].allNotionalAgreements = command.kv.allNotionalAgreements;
					if(command.commandName == "RemoveAllUserNotional"){
						if(userWorkingData.assets[assetIndex].notionalAgreements){
							$.each(userWorkingData.assets[assetIndex].notionalAgreements,function(index,item){
								item.assignedFlag = false;
								item.colorClass = 'R';
								userWorkingData.assets[assetIndex].notionalAgreementsAssignedCount = 0;
							});
							
						}					
					}else{
						if(userWorkingData.assets[assetIndex].notionalAgreements){
							$.each(userWorkingData.assets[assetIndex].notionalAgreements,function(index,item){
								item.assignedFlag = true;
								item.colorClass = 'B';
								userWorkingData.assets[assetIndex].notionalAgreementsAssignedCount = userWorkingData.assets[assetIndex].notionalAgreementsCount;
							});
							
						}					
					}
				}else if(command.commandName == "ApplyAllUserSweep" || command.commandName == "RemoveAllUserSweep" ){
					userWorkingData.assets[assetIndex].allSweepAgreements = command.kv.allSweepAgreements;
					if(command.commandName == "RemoveAllUserSweep"){
						if(userWorkingData.assets[assetIndex].sweepAgreements){
							$.each(userWorkingData.assets[assetIndex].sweepAgreements,function(index,item){
								item.assignedFlag = false;
								item.colorClass = 'R';
								userWorkingData.assets[assetIndex].sweepAgreementsAssignedCount = 0;
							});
							
						}					
					}else{
						if(userWorkingData.assets[assetIndex].sweepAgreements){
							$.each(userWorkingData.assets[assetIndex].sweepAgreements,function(index,item){
								item.assignedFlag = true;
								item.colorClass = 'B';
								userWorkingData.assets[assetIndex].sweepAgreementsAssignedCount = userWorkingData.assets[assetIndex].sweepAgreementsCount;
							});
							
						}					
					}
				} else if (command.commandName == "UpdatePortalDetails") {
				if (mode == 'viewChanges') {
					if (command.kv.billPayID) {
						if (userWorkingData.assets[assetIndex].billPayID != undefined) {
							if (command.kv.billPayID != userWorkingData.assets[assetIndex].billPayID) {
								userWorkingData.assets[assetIndex].billPayID = command.kv.billPayID;
								userWorkingData.assets[assetIndex].billPayIDClass = 'modifiedField';
							}
						} else {
							userWorkingData.assets[assetIndex].billPayID = command.kv.billPayID;
							userWorkingData.assets[assetIndex].billPayIDClass = 'newField';
						}
					} else {

						userWorkingData.assets[assetIndex].billPayIDClass = 'removedField';
					}
					
					if (command.kv.remoteDepositID) {
						if (userWorkingData.assets[assetIndex].remoteDepositID != undefined) {
							if (command.kv.remoteDepositID != userWorkingData.assets[assetIndex].remoteDepositID) {
								userWorkingData.assets[assetIndex].remoteDepositID = command.kv.remoteDepositID;
								userWorkingData.assets[assetIndex].remoteDepositIDClass = 'modifiedField';
							}
						} else {
							userWorkingData.assets[assetIndex].remoteDepositID = command.kv.billPayID;
							userWorkingData.assets[assetIndex].remoteDepositIDClass = 'newField';
						}
					} else {

						userWorkingData.assets[assetIndex].remoteDepositIDClass = 'removedField';
					}
					if (command.kv.netCaptureAdmUsrId) {
						if (userWorkingData.assets[assetIndex].netCaptureAdmUsrId != undefined) {
							if (command.kv.netCaptureAdmUsrId != userWorkingData.assets[assetIndex].netCaptureAdmUsrId) {
								userWorkingData.assets[assetIndex].netCaptureAdmUsrId = command.kv.netCaptureAdmUsrId;
								userWorkingData.assets[assetIndex].netCaptureAdmUsrIdClass = 'modifiedField';
							}
						} else {
							userWorkingData.assets[assetIndex].netCaptureAdmUsrId = command.kv.netCaptureAdmUsrId;
							userWorkingData.assets[assetIndex].netCaptureAdmUsrIdClass = 'newField';
						}
					} else {

						userWorkingData.assets[assetIndex].netCaptureAdmUsrIdClass = 'removedField';
					}
				} 
				else {
					userWorkingData.assets[assetIndex].billPayID = command.kv.billPayID;
					userWorkingData.assets[assetIndex].remoteDepositID = command.kv.remoteDepositID;
					userWorkingData.assets[assetIndex].netCaptureAdmUsrId = command.kv.netCaptureAdmUsrId;
				}
			}else if(command.commandName == "UpdateMobileDetails"){
					if (mode == 'viewChanges') 
					{
						if (command.kv.rdcFlag != userWorkingData.assets[assetIndex].rdcFlag) {
							userWorkingData.assets[assetIndex].rdcFlag = command.kv.rdcFlag;
							userWorkingData.assets[assetIndex].rdcFlagClass = 'modifiedField';
						}
						if (command.kv.rdcUserKey) {
							if (userWorkingData.assets[assetIndex].rdcUserKey != undefined) {
								if (command.kv.rdcUserKey != userWorkingData.assets[assetIndex].rdcUserKey) {
									userWorkingData.assets[assetIndex].rdcUserKey = command.kv.rdcUserKey;
									userWorkingData.assets[assetIndex].rdcUserKeyClass = 'modifiedField';
									}
							} else {
								userWorkingData.assets[assetIndex].rdcUserKey = command.kv.rdcUserKey;
								userWorkingData.assets[assetIndex].rdcUserKeyClass = 'newField';
						}
					} else {

						userWorkingData.assets[assetIndex].rdcUserKeyClass = 'removedField';
					}
				}
				else{
						userWorkingData.assets[assetIndex].rdcFlag = command.kv.rdcFlag;	
						userWorkingData.assets[assetIndex].rdcUserKey = command.kv.rdcUserKey;
				}
				}else if(command.commandName == "UserLimitsUpdateCommand") {
					userWorkingData.assets[assetIndex] = [];
					userWorkingData.assets[assetIndex] = JSON.parse(command.kv.userLimits.replace(/&quot;/g,'"'));
				}
			},
			
			clearAssetStores :  function(){
				accountStore = [];
				packageStore =[];
				templateStore = [];
				notionalAgreementStore=[];
				sweepAgreementStore=[];
				portalStore =[];
				mobileStore =[];
				limitStore = [];
				templatesAssignedCount=0, templatesCount=0;
				accountsAssignedCount=0, accountsCount=0, notionalAgreementsAssignedCount =0, notionalAgreementsCount = 0;
				sweepAgreementsAssignedCount=0, sweepAgreementsCount=0, packagesAssignedCount=0, packagesCount=0;
			},
			
			getAssetStore : function(){
				return userCommand.concat(accountStore,packageStore,templateStore,notionalAgreementStore,sweepAgreementStore,portalStore,mobileStore,limitStore);
			},
			
			
			saveAsset : function(e, assetId){
				var url;
				$.blockUI();
				$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;Loading...</h2></div>',
					css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});				
				url= "loginId=" + userWorkingData.loginId + "&recordKeyNo=" + userWorkingData.recordKeyNo + "&usrRoleId="+ userWorkingData.usrRoleId;			
				$.ajax({
			        url: "services/userCommandApi/process/?" + url,
			        type: "POST",
			        data: JSON.stringify(userCommand),
			        async : false,
			        contentType: "application/json; charset=utf-8",
			        success: function (data) {
			        	if(null != data)
			        		userWorkingData.recordKeyNo = data;
			        	var assetIndex = userWorkingData.assets.findIndex(function(obj){
							return obj.assetId == assetId.assetId;
			        	});
			        	
			        	if(assetIndex != -1){
				        	$.each(userCommand, function(index, command) {
			        			CommonUserObj.updateUserAssetInuserWorkingData(command,assetIndex);
				        	})		        		
			        	}
			        	
			        	userCommand = [];
			        	CommonUserObj.clearAssetStores();
			        	$.unblockUI();
			        },
			        error: function () {
			            $('#errorDiv').removeClass('hidden');
			        	$('#errorPara').text("An error has occured!!!");
			        	if(event)
				            event.preventDefault();
			        	$.unblockUI();
			        }
			    });
			}
	};
	UsersApp.bind('SaveAsset', CommonUserObj.saveAsset);
	
	UsersApp.bind('AddUserAccounts', CommonUserObj.addUserAccounts);
	UsersApp.bind('RemoveUserAccounts', CommonUserObj.removeUserAccounts);
	UsersApp.bind('ApplyAllUserAccounts', CommonUserObj.applyAllUserAccounts);
	UsersApp.bind('RemoveAllUserAccounts', CommonUserObj.removeAllUserAccounts);
	
	UsersApp.bind('AddUserPackages', CommonUserObj.addUserPackages);
	UsersApp.bind('RemoveUserPackages', CommonUserObj.removeUserPackages);
	UsersApp.bind('ApplyAllUserPackages', CommonUserObj.applyAllUserPackages);
	UsersApp.bind('RemoveAllUserPackages', CommonUserObj.removeAllUserPackages);
	
	UsersApp.bind('AddUserTemplates', CommonUserObj.addTemplates);
	UsersApp.bind('RemoveUserTemplates', CommonUserObj.removeTemplates);
	UsersApp.bind('ApplyAllUserTemplates', CommonUserObj.applyAllTemplates);
	UsersApp.bind('RemoveAllUserTemplates', CommonUserObj.removeAllTemplates);
	
	UsersApp.bind('ApplyAllUserNotional', CommonUserObj.applyAllNotional);
	UsersApp.bind('RemoveAllUserNotional', CommonUserObj.removeAllNotional);
	
	UsersApp.bind('ApplyAllUserSweep', CommonUserObj.applyAllSweep);
	UsersApp.bind('RemoveAllUserSweep', CommonUserObj.removeAllSweep);
	
	UsersApp.bind('AddUserNotional', CommonUserObj.addNotional);
	UsersApp.bind('RemoveUserNotional', CommonUserObj.removeNotional);
	
	UsersApp.bind('AddUserSweep', CommonUserObj.addSweep);
	UsersApp.bind('RemoveUserSweep', CommonUserObj.removeSweep);
	
	UsersApp.bind('UpdatePortalDetails', CommonUserObj.updatePortalDetails);
	UsersApp.bind('UpdateMobileDetails', CommonUserObj.updateMobileDetails);
	UsersApp.bind('UserLimitsUpdate', CommonUserObj.userLimitsUpdate);
	UsersApp.bind('UpdateLimitFlag', CommonUserObj.updateLimitFlag);
	UsersApp.bind('UpdateDefLimit', CommonUserObj.updateDefLimit);
	UsersApp.bind('UpdateCustLimit', CommonUserObj.updateCustLimit);

})(jQuery);