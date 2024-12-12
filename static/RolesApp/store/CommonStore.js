/*global jQuery, RoleDetails */
var permissionStore = [],messageStore = [], reportStore = [], widgetStore = [], accountStore = [];
var interfaceStore = [], alertStore = [], allFlagStore = [], featureStore = [];
var packageStore = [], templateStore = [], companyIdStore = [], bankReport = [];
var notionalAgreementStore = [], sweepAgreementStore = [];
var granBRPrivilegesStore = [], granLoansPrivilegesStore = [],  granChkMgmtPrivilegesStore = [], granPosPayPrivilegesStore = [];
var granPayPrivilegesStore = [], granSIPrivilegesStore = [], granReversalPrivilegesStore = [], granTempPrivilegesStore = [] ;
var alertCount = 0, alertsAssignedCount = 0, companyIdCount = 0, companyIdAssignedCount = 0, messagesCount =0, messagesAssignedCount=0;
var widgetsCount =0, widgetsAssignedCount =0, reportsCount=0, reportsAssignedCount=0, templatesAssignedCount=0, templatesCount=0;
var accountsAssignedCount=0, accountsCount=0, notionalAgreementsAssignedCount =0, notionalAgreementsCount = 0;
var sweepAgreementsAssignedCount=0, sweepAgreementsCount=0, packagesAssignedCount=0, packagesCount=0;
var CommonObj;
(function ($) {
	'use strict';
	CommonObj = {
			
		addAccounts : function (e, data) {
			var index = accountStore.findIndex(function(obj){
					return obj.kv.accountId == data.kv.accountId;
			})
			var existObj = accountStore[index];
			
			if(undefined != existObj && existObj.commandName == "RemoveAccounts"){
				accountStore.splice(index, 1);
				accountsAssignedCount++
				$('#lblAccountCount').text(accountsAssignedCount + " of " + accountsCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}else{
				accountStore.push(data);	
				accountsAssignedCount++
				$('#lblAccountCount').text(accountsAssignedCount + " of " + accountsCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}
			console.log("Account Updated");
			console.log(accountStore);
		},
		
		removeAccounts : function (e, data) {
			var index = accountStore.findIndex(function(obj){
					return obj.kv.accountId == data.kv.accountId;
			});
			var existObj = accountStore[index];

			
			if(undefined != existObj && existObj.commandName == "AddAccounts"){
				accountStore.splice(index, 1);
				accountsAssignedCount--
				$('#lblAccountCount').text(accountsAssignedCount + " of " + accountsCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}else{
				accountStore.push(data);
				accountsAssignedCount--
				$('#lblAccountCount').text(accountsAssignedCount + " of " + accountsCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}
			console.log("Account Updated");
			console.log(accountStore);
		},	
		
		applyAllAccounts : function (e, data) {
			accountStore = [];
			accountStore.push(data);
			accountsAssignedCount = accountsCount;
			$('#lblAccountCount').text(accountsAssignedCount + " of " + accountsCount +" "+ getLabel('lbl.role.report2'," Selected"));
			
			console.log("Apply All Accounts ");
			console.log(accountStore);
		},
		
		removeAllAccounts : function (e, data) {
			accountStore = [];
			accountStore.push(data);
			accountsAssignedCount = 0;
			$('#lblAccountCount').text(accountsAssignedCount + " of " + accountsCount +" "+ getLabel('lbl.role.report2'," Selected"));
			
			console.log("removed All Accounts ");
			console.log(accountStore);
		},
		addFeatures : function (e, data) {
			var index = featureStore.findIndex(function(obj){
					return obj.kv.featureId == data.kv.featureId;
			})
			var existObj = featureStore[index];
	
			if(undefined != existObj && existObj.commandName == "RemoveFeatures"){
				featureStore.splice(index, 1);
			}else{
				featureStore.push(data);				
			}
			console.log("Feature Updated");
			console.log(featureStore);
		},
		
		removeFeatures : function (e, data) {
			var index = featureStore.findIndex(function(obj){
					return obj.kv.featureId == data.kv.featureId;
			});
			var existObj = featureStore[index];

			
			if(undefined != existObj && existObj.commandName == "AddFeatures"){
				featureStore.splice(index, 1);
			}else{
				featureStore.push(data);				
			}
			console.log("Feature Updated");
			console.log(featureStore);
		},
		
		addMessages : function (e, data) {
			var index = messageStore.findIndex(function(obj){
					return obj.kv.messageId == data.kv.messageId;
			});
			var existObj = messageStore[index];
			
			if(undefined != existObj && existObj.commandName == "RemoveMessages"){
				messageStore.splice(index, 1);
				messagesAssignedCount++
				$('#lblMsgCount').text(messagesAssignedCount + " of " + messagesCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}else{
				messageStore.push(data);	
				messagesAssignedCount++
				$('#lblMsgCount').text(messagesAssignedCount + " of " + messagesCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}
			console.log("Message Updated");
			console.log(messageStore);
		},
		
		removeMessages : function (e, data) {
			var index = messageStore.findIndex(function(obj){
					return obj.kv.messageId == data.kv.messageId;
			});
			var existObj = messageStore[index];
			
			if(undefined != existObj && existObj.commandName == "AddMessages"){
				messageStore.splice(index, 1);
				messagesAssignedCount--
				$('#lblMsgCount').text(messagesAssignedCount + " of " + messagesCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}else{
				messageStore.push(data);	
				messagesAssignedCount--
				$('#lblMsgCount').text(messagesAssignedCount + " of " + messagesCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}
			console.log("Message Updated");
			console.log(messageStore);
		},
		
		applyAllMessages : function (e, data) {
			
			messageStore = [];
			messageStore.push(data);
			messagesAssignedCount = messagesCount;
			$('#lblMsgCount').text(messagesAssignedCount + " of " + messagesCount +" "+ getLabel('lbl.role.report2'," Selected"));
		
			console.log("Apply All messages ");
			console.log(messageStore);
		},
		
		removeAllMessages : function (e, data) {
				
			messageStore = [];
			messageStore.push(data);
			messagesAssignedCount = 0;
			$('#lblMsgCount').text(messagesAssignedCount + " of " + messagesCount +" "+ getLabel('lbl.role.report2'," Selected"));
			
			console.log("Remove All messages ");
			console.log(messageStore);
		},
		
		
		addReports : function (e, data) {
			var index = reportStore.findIndex(function(obj){
					return obj.kv.reportId == data.kv.reportId;
			});
			var existObj = reportStore[index];

			if(undefined != existObj && existObj.commandName == "RemoveReports"){
				reportStore.splice(index, 1);
				reportsAssignedCount++
				$('#lblReportCount').text(reportsAssignedCount + " of " + reportsCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}else{
				reportStore.push(data);	
				reportsAssignedCount++
				$('#lblReportCount').text(reportsAssignedCount + " of " + reportsCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}
			console.log("Report Store Updated");
			console.log(reportStore);
		},
		
		removeReports : function (e, data) {
			var index = reportStore.findIndex(function(obj){
					return obj.kv.reportId == data.kv.reportId;
			});
			var existObj = reportStore[index];
			
			if(undefined != existObj && existObj.commandName == "AddReports"){
				reportStore.splice(index, 1);
				reportsAssignedCount--
				$('#lblReportCount').text(reportsAssignedCount + " of " + reportsCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}else{
				reportStore.push(data);	
				reportsAssignedCount--
				$('#lblReportCount').text(reportsAssignedCount + " of " + reportsCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}
			console.log("Report Store Updated");
			console.log(reportStore);
		},
		
		
		applyAllReports : function (e, data) {
			
			reportStore = [];
			reportStore.push(data);
			reportsAssignedCount = reportsCount;
			$('#lblReportCount').text(reportsAssignedCount + " of " + reportsCount +" "+ getLabel('lbl.role.report2'," Selected"));

			console.log("Apply All reports");
			console.log(reportStore);
		},
		
		removeAllReports : function (e, data) {
			reportStore = [];
			reportStore.push(data);
			reportsAssignedCount = 0;
			$('#lblReportCount').text(reportsAssignedCount + " of " + reportsCount +" "+ getLabel('lbl.role.report2'," Selected"));
			
			console.log("Remove All reports");
			console.log(reportStore);
		},
		
		addWidgets : function (e, data) {
			var index = widgetStore.findIndex(function(obj){
					return obj.kv.widgetId == data.kv.widgetId;
			});
			var existObj = widgetStore[index];
			
			if(undefined != existObj && existObj.commandName == "RemoveWidgets"){
				widgetStore.splice(index, 1);
				widgetsAssignedCount++
				$('#lblWidgetCount').text(widgetsAssignedCount + " of " + widgetsCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}else{
				widgetStore.push(data);	
				widgetsAssignedCount++
				$('#lblWidgetCount').text(widgetsAssignedCount + " of " + widgetsCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}
			console.log("Widget Store Updated");
			console.log(widgetStore);
		},
		
		removeWidgets : function (e, data) {
			var index = widgetStore.findIndex(function(obj){
					return obj.kv.widgetId == data.kv.widgetId;
			});
			var existObj = widgetStore[index];
			
			if(undefined != existObj && existObj.commandName == "AddWidgets"){
				widgetStore.splice(index, 1);
				widgetsAssignedCount--
				$('#lblWidgetCount').text(widgetsAssignedCount + " of " + widgetsCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}else{
				widgetStore.push(data);		
				widgetsAssignedCount--
				$('#lblWidgetCount').text(widgetsAssignedCount + " of " + widgetsCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}
			console.log("Report Store Updated");
			console.log(widgetStore);
		},
		
		
		applyAllWidgets : function (e, data) {
			widgetStore = [];
			widgetStore.push(data);
			widgetsAssignedCount = widgetsCount;
			$('#lblWidgetCount').text(widgetsAssignedCount + " of " + widgetsCount +" "+ getLabel('lbl.role.report2'," Selected"));

			console.log("Apply All widgets");
			console.log(widgetStore);
		},
		
		removeAllWidgets : function (e, data) {
			widgetStore = [];
			widgetStore.push(data);
			widgetsAssignedCount = 0;
			$('#lblWidgetCount').text(widgetsAssignedCount + " of " + widgetsCount +" "+ getLabel('lbl.role.report2'," Selected"));

			console.log("Removed All widgets ");
			console.log(widgetStore);
		},
		
		addAlerts : function (e, data) {
			var index = alertStore.findIndex(function(obj){
					return obj.kv.alertId == data.kv.alertId;
			});
			var existObj = alertStore[index];

			if(undefined != existObj && existObj.commandName == "RemoveAlerts"){
				alertStore.splice(index, 1);
				alertsAssignedCount++
				$('#lblAlertCount').text(alertsAssignedCount + " of " + alertCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}else{
				alertStore.push(data);
				alertsAssignedCount++
				$('#lblAlertCount').text(alertsAssignedCount + " of " + alertCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}
			console.log("Alert Store Updated");
			console.log(alertStore);
		},
		
		removeAlerts : function (e, data) {
			var index = alertStore.findIndex(function(obj){
					return obj.kv.alertId == data.kv.alertId;
			});
			var existObj = alertStore[index];
			
			if(undefined != existObj && existObj.commandName == "AddAlerts"){
				alertStore.splice(index, 1);
				alertsAssignedCount--
				$('#lblAlertCount').text(alertsAssignedCount + " of " + alertCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}else{
				alertStore.push(data);
				alertsAssignedCount--
				$('#lblAlertCount').text(alertsAssignedCount + " of " + alertCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}
			console.log("Alert Store Updated");
			console.log(alertStore);
		},
		
		applyAllAlerts : function (e, data) {
			alertStore = [];
			alertStore.push(data);
			alertsAssignedCount = alertCount;
			$('#lblAlertCount').text(alertsAssignedCount + " of " + alertCount +" "+ getLabel('lbl.role.report2'," Selected"));

			console.log("Apply All alerts");
			console.log(alertStore);
		},
		
		removeAllAlerts : function (e, data) {
			alertStore = [];
			alertStore.push(data);
			
			alertsAssignedCount = 0;
			$('#lblAlertCount').text(alertsAssignedCount + " of " + alertCount +" "+ getLabel('lbl.role.report2'," Selected"));

			console.log("removed All alerts ");
			console.log(alertStore);
		},
		
		
		updateInterfaces :  function(e,data){
			var index = interfaceStore.findIndex(function(obj){
					return obj.kv.interfaceId == data.kv.interfaceId;
			});
			var existObj = interfaceStore[index];
			
			if(undefined != existObj){
				interfaceStore.splice(index, 1);
				interfaceStore.push(data);				
			}else{
				interfaceStore.push(data);				
			}
			console.log("Interface store updated");
			console.log(interfaceStore);
		},
		
		applyAllInterfaces : function (e, data) {
			interfaceStore = [];
			interfaceStore.push(data);

			console.log("Apply All interfaces ");
			console.log(interfaceStore);
		},
		
		removeAllInterfaces : function (e, data) {
			interfaceStore = [];
			interfaceStore.push(data);

			console.log("removed All interfaces ");
			console.log(interfaceStore);
		},
		

		updatePermission :  function(e,data){
			var index = permissionStore.findIndex(function(obj){
					return obj.kv.tciRmParent == data.kv.tciRmParent;
			});
			var existObj = permissionStore[index];
			
			if(undefined != existObj){
				permissionStore.splice(index, 1);
				permissionStore.push(data);				
			}else{
				permissionStore.push(data);				
			}
			console.log(permissionStore);
		},
		
		addPackages : function (e, data) {
			var index = packageStore.findIndex(function(obj){
					return obj.kv.packageId == data.kv.packageId;
			});
			var existObj = packageStore[index];

			if(undefined != existObj && existObj.commandName == "RemovePackages"){
				packageStore.splice(index, 1);
				packagesAssignedCount++
				$('#lblPkgCount').text(packagesAssignedCount + " of " + packagesCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}else{
				packageStore.push(data);	
				packagesAssignedCount++
				$('#lblPkgCount').text(packagesAssignedCount + " of " + packagesCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}
			console.log("Package added");
			console.log(packageStore);
		},
		
		removePackages : function (e, data) {
			var index = packageStore.findIndex(function(obj){
					return obj.kv.packageId == data.kv.packageId;
			});
			var existObj = packageStore[index];
			
			if(undefined != existObj && existObj.commandName == "AddPackages"){
				packageStore.splice(index, 1);
				packagesAssignedCount--
				$('#lblPkgCount').text(packagesAssignedCount + " of " + packagesCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}else{
				packageStore.push(data);
				packagesAssignedCount--
				$('#lblPkgCount').text(packagesAssignedCount + " of " + packagesCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}
			console.log("Package removed");
			console.log(packageStore);
		},
		
		applyAllPackages : function (e, data) {
			packageStore = [];
			packageStore.push(data);
			packagesAssignedCount = packagesCount;
			$('#lblPkgCount').text(packagesAssignedCount + " of " + packagesCount +" "+ getLabel('lbl.role.report2'," Selected"));
			
			console.log("Apply All packages ");
			console.log(packageStore);
		},
		
		removeAllPackages : function (e, data) {
			packageStore = [];
			packageStore.push(data);
			packagesAssignedCount = 0;
			$('#lblPkgCount').text(packagesAssignedCount + " of " + packagesCount +" "+ getLabel('lbl.role.report2'," Selected"));

			console.log("removed All packages ");
			console.log(packageStore);
		},
		
		addTemplates : function (e, data) {
			var index = templateStore.findIndex(function(obj){
					return obj.kv.templateId == data.kv.templateId;
			});
			var existObj = templateStore[index];

			if(undefined != existObj && existObj.commandName == "RemoveTemplates"){
				templateStore.splice(index, 1);
				templatesAssignedCount++
				$('#lblTemplateCount').text(templatesAssignedCount + " of " + templatesCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}else{
				templateStore.push(data);	
				templatesAssignedCount++
				$('#lblTemplateCount').text(templatesAssignedCount + " of " + templatesCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}
			console.log("Template added");
			console.log(templateStore);
		},
		
		removeTemplates : function (e, data) {
			var index = templateStore.findIndex(function(obj){
					return obj.kv.templateId == data.kv.templateId;
			});
			var existObj = templateStore[index];
			
			if(undefined != existObj && existObj.commandName == "AddTemplates"){
				templateStore.splice(index, 1);
				templatesAssignedCount--
				$('#lblTemplateCount').text(templatesAssignedCount + " of " + templatesCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}else{
				templateStore.push(data);	
				templatesAssignedCount--
				$('#lblTemplateCount').text(templatesAssignedCount + " of " + templatesCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}
			console.log("Template removed");
			console.log(templateStore);
		},
		
		applyAllTemplates : function (e, data) {
			templateStore = [];
			templateStore.push(data);
			templatesAssignedCount = templatesCount;
			$('#lblTemplateCount').text(templatesAssignedCount + " of " + templatesCount +" "+ getLabel('lbl.role.report2'," Selected"));
			console.log("Apply All templates ");
			console.log(templateStore);
		},
		
		removeAllTemplates : function (e, data) {
			templateStore = [];
			templateStore.push(data);
			templatesAssignedCount =0;
			$('#lblTemplateCount').text(templatesAssignedCount + " of " + templatesCount +" "+ getLabel('lbl.role.report2'," Selected"));
			
			console.log("removed All template ");
			console.log(templateStore);
		},
		
		addCompanyID : function (e, data) {
			var index = companyIdStore.findIndex(function(obj){
					return obj.kv.companyId == data.kv.companyId;
			});
			var existObj = companyIdStore[index];

			if(undefined != existObj && existObj.commandName == "RemoveCompanyId"){
				companyIdStore.splice(index, 1);
				companyIdAssignedCount++
				$('#lblCmpIdCount').text(companyIdAssignedCount + " of " + companyIdCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}else{
				companyIdStore.push(data);	
				companyIdAssignedCount++
				$('#lblCmpIdCount').text(companyIdAssignedCount + " of " + companyIdCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}
			console.log("Company ID added");
			console.log(companyIdStore);
		},
		
		removeCompanyID : function (e, data) {
			var index = companyIdStore.findIndex(function(obj){
					return obj.kv.companyId == data.kv.companyId;
			});
			var existObj = companyIdStore[index];
			
			if(undefined != existObj && existObj.commandName == "AddCompanyId"){
				companyIdStore.splice(index, 1);
				companyIdAssignedCount--
				$('#lblCmpIdCount').text(companyIdAssignedCount + " of " + companyIdCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}else{
				companyIdStore.push(data);	
				companyIdAssignedCount--
				$('#lblCmpIdCount').text(companyIdAssignedCount + " of " + companyIdCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}
			console.log("Company ID removed");
			console.log(companyIdStore);
		},
		
		applyAllCompanyID : function (e, data) {
			companyIdStore = [];
			companyIdStore.push(data);
			companyIdAssignedCount = companyIdCount;
			$('#lblCmpIdCount').text(companyIdAssignedCount + " of " + companyIdCount +" "+ getLabel('lbl.role.report2'," Selected"));
			
			console.log("Apply All cmp id's ");
			console.log(companyIdStore);
		},
		
		removeAllCompanyID : function (e, data) {
			companyIdStore = [];
			companyIdStore.push(data);
			companyIdAssignedCount =0;
			$('#lblCmpIdCount').text(companyIdAssignedCount + " of " + companyIdCount +" "+ getLabel('lbl.role.report2'," Selected"));
			console.log("remove All cmp id's ");
			console.log(companyIdStore);
		},
		
		addBankReports : function (e, data) {
			var index = bankReport.findIndex(function(obj){
					return obj.kv.accountId == data.kv.accountId;
			})
			var existObj = bankReport[index];
			
			if(undefined != existObj && existObj.commandName == "RemoveBankReports"){
				bankReport.splice(index, 1);
			}else{
				bankReport.push(data);				
			}
			console.log("bank Report Updated");
			console.log(bankReport);
		},
		
		removeBankReports : function (e, data) {
			var index = bankReport.findIndex(function(obj){
					return obj.kv.accountId == data.kv.accountId;
			});
			var existObj = bankReport[index];

			
			if(undefined != existObj && existObj.commandName == "AddBankReports"){
				bankReport.splice(index, 1);
			}else{
				bankReport.push(data);				
			}
			console.log("bank Report Updated");
			console.log(bankReport);
		},	
		
		applyAllBankReports : function (e, data) {
			bankReport = [];
			bankReport.push(data);
		
			console.log("Apply All bank Report ");
			console.log(bankReport);
		},
		
		removeAllBankreports : function (e, data) {
			bankReport = [];
			bankReport.push(data);
		
			console.log("removed All bank Report ");
			console.log(bankReport);
		},
		
		addNotional : function (e, data) {
			var index = notionalAgreementStore.findIndex(function(obj){
					return obj.kv.agreementCode == data.kv.agreementCode;
			});
			var existObj = notionalAgreementStore[index];
			
			if(undefined != existObj && existObj.commandName == "removeNotional"){
				notionalAgreementStore.splice(index, 1);
				notionalAgreementsAssignedCount++
				$('#lblNotionalAgreementCount').text(notionalAgreementsAssignedCount + " of " + notionalAgreementsCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}else{
				notionalAgreementStore.push(data);		
				notionalAgreementsAssignedCount++
				$('#lblNotionalAgreementCount').text(notionalAgreementsAssignedCount + " of " + notionalAgreementsCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}
			console.log("Notional Store Updated");
			console.log(notionalAgreementStore);
		},
		
		removeNotional : function (e, data) {
			var index = notionalAgreementStore.findIndex(function(obj){
					return obj.kv.agreementCode == data.kv.agreementCode;
			});
			var existObj = notionalAgreementStore[index];
			
			if(undefined != existObj && existObj.commandName == "addNotional"){
				notionalAgreementStore.splice(index, 1);
				notionalAgreementsAssignedCount--
				$('#lblNotionalAgreementCount').text(notionalAgreementsAssignedCount + " of " + notionalAgreementsCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}else{
				notionalAgreementStore.push(data);	
				notionalAgreementsAssignedCount--
				$('#lblNotionalAgreementCount').text(notionalAgreementsAssignedCount + " of " + notionalAgreementsCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}
			console.log("Notional Store Updated");
			console.log(notionalAgreementStore);
		},
		
		
		applyAllNotional : function (e, data) {
			notionalAgreementStore = [];
			notionalAgreementStore.push(data);
			notionalAgreementsAssignedCount = notionalAgreementsCount;
			$('#lblNotionalAgreementCount').text(notionalAgreementsAssignedCount + " of " + notionalAgreementsCount +" "+ getLabel('lbl.role.report2'," Selected"));
			
			console.log("Apply All notional Agreement");
			console.log(notionalAgreementStore);
		},
		
		removeAllNotional : function (e, data) {
			notionalAgreementStore = [];
			notionalAgreementStore.push(data);
			notionalAgreementsAssignedCount =0;
			$('#lblNotionalAgreementCount').text(notionalAgreementsAssignedCount + " of " + notionalAgreementsCount +" "+ getLabel('lbl.role.report2'," Selected"));

			console.log("Removed All notional Agreement ");
			console.log(notionalAgreementStore);
		},
		
		
		addSweep : function (e, data) {
			var index = sweepAgreementStore.findIndex(function(obj){
					return obj.kv.agreementCode == data.kv.agreementCode;
			});
			var existObj = sweepAgreementStore[index];
			
			if(undefined != existObj && existObj.commandName == "removeSweep"){
				sweepAgreementStore.splice(index, 1);
				sweepAgreementsAssignedCount++
				$('#lblSweepAgreementCount').text(sweepAgreementsAssignedCount + " of " + sweepAgreementsCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}else{
				sweepAgreementStore.push(data);	
				sweepAgreementsAssignedCount++
				$('#lblSweepAgreementCount').text(sweepAgreementsAssignedCount + " of " + sweepAgreementsCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}
			console.log("sweep Store Updated");
			console.log(sweepAgreementStore);
		},
		
		removeSweep : function (e, data) {
			var index = sweepAgreementStore.findIndex(function(obj){
					return obj.kv.widgetId == data.kv.widgetId;
			});
			var existObj = sweepAgreementStore[index];
			
			if(undefined != existObj && existObj.commandName == "addSweep"){
				sweepAgreementStore.splice(index, 1);
				sweepAgreementsAssignedCount--
				$('#lblSweepAgreementCount').text(sweepAgreementsAssignedCount + " of " + sweepAgreementsCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}else{
				sweepAgreementStore.push(data);
				sweepAgreementsAssignedCount--
				$('#lblSweepAgreementCount').text(sweepAgreementsAssignedCount + " of " + sweepAgreementsCount +" "+ getLabel('lbl.role.report2'," Selected"));
			}
			console.log("sweep Store Updated");
			console.log(sweepAgreementStore);
		},
		
		
		applyAllSweep : function (e, data) {
			sweepAgreementStore = [];
			sweepAgreementStore.push(data);
			sweepAgreementsAssignedCount = sweepAgreementsCount;
			$('#lblSweepAgreementCount').text(sweepAgreementsAssignedCount + " of " + sweepAgreementsCount +" "+ getLabel('lbl.role.report2'," Selected"));

			console.log("Apply All sweep Agreements");
			console.log(sweepAgreementStore);
		},
		
		removeAllSweep : function (e, data) {
			sweepAgreementStore = [];
			sweepAgreementStore.push(data);
			sweepAgreementsAssignedCount =0;
			$('#lblSweepAgreementCount').text(sweepAgreementsAssignedCount + " of " + sweepAgreementsCount +" "+ getLabel('lbl.role.report2'," Selected"));

			console.log("Removed All sweep agreements");
			console.log(sweepAgreementStore);
		},
		
		
		
		updateBRGRPermissions :  function(e,data){
			var index = granBRPrivilegesStore.findIndex(function(obj){
					return obj.kv.accountId == data.kv.accountId;
			});
			var existObj = granBRPrivilegesStore[index];
			
			if(undefined != existObj){
				granBRPrivilegesStore.splice(index, 1);
				granBRPrivilegesStore.push(data);				
			}else{
				granBRPrivilegesStore.push(data);				
			}
			console.log(granBRPrivilegesStore);
		},
		
		applyAllGRBR :  function(e,data){
			granBRPrivilegesStore = [];
			granBRPrivilegesStore.push(data);
			console.log("ApplyAll BR Granular - Add/Remove");
			console.log(granBRPrivilegesStore);
		},
		
		updatePaymentGRPermission :  function(e,data){
			var index = granPayPrivilegesStore.findIndex(function(obj){
					return (obj.kv.accountId == data.kv.accountId && obj.kv.packageId == data.kv.packageId);
			});
			var existObj = granPayPrivilegesStore[index];
			
			if(undefined != existObj){
				granPayPrivilegesStore.splice(index, 1);
				granPayPrivilegesStore.push(data);				
			}else{
				granPayPrivilegesStore.push(data);				
			}
			console.log(granPayPrivilegesStore);
		},
		
		applyAllGRPay :  function(e,data){
			granPayPrivilegesStore = [];
			granPayPrivilegesStore.push(data);
			console.log("ApplyAll Payment Granular - Add/Remove");
			console.log(granPayPrivilegesStore);
		},
		
		updateSIGRPermission :  function(e,data){
			var index = granSIPrivilegesStore.findIndex(function(obj){
					return (obj.kv.accountId == data.kv.accountId && obj.kv.packageId == data.kv.packageId);
			});
			var existObj = granSIPrivilegesStore[index];
			
			if(undefined != existObj){
				granSIPrivilegesStore.splice(index, 1);
				granSIPrivilegesStore.push(data);				
			}else{
				granSIPrivilegesStore.push(data);				
			}
			console.log(granSIPrivilegesStore);
		},
		
		applyAllGRSI :  function(e,data){
			granSIPrivilegesStore = [];
			granSIPrivilegesStore.push(data);
			console.log("ApplyAll SI Granular - Add/Remove");
			console.log(granSIPrivilegesStore);
		},
		
		updateReversalGRPermission :  function(e,data){
			var index = granReversalPrivilegesStore.findIndex(function(obj){
					return (obj.kv.accountId == data.kv.accountId && obj.kv.packageId == data.kv.packageId);
			});
			var existObj = granReversalPrivilegesStore[index];
			
			if(undefined != existObj){
				granReversalPrivilegesStore.splice(index, 1);
				granReversalPrivilegesStore.push(data);				
			}else{
				granReversalPrivilegesStore.push(data);				
			}
			console.log(granReversalPrivilegesStore);
		},
		
		applyAllGRReversal :  function(e,data){
			granReversalPrivilegesStore = [];
			granReversalPrivilegesStore.push(data);
			console.log("ApplyAll Reversal Granular - Add/Remove");
			console.log(granReversalPrivilegesStore);
		},
		
		
		updateTemplateGRPermission :  function(e,data){
			var index = granTempPrivilegesStore.findIndex(function(obj){
					return (obj.kv.accountId == data.kv.accountId && obj.kv.packageId == data.kv.packageId);
			});
			var existObj = granTempPrivilegesStore[index];
			
			if(undefined != existObj){
				granTempPrivilegesStore.splice(index, 1);
				granTempPrivilegesStore.push(data);				
			}else{
				granTempPrivilegesStore.push(data);				
			}
			console.log(granTempPrivilegesStore);
		},
		
		
		applyAllGRTemplate :  function(e,data){
			granTempPrivilegesStore = [];
			granTempPrivilegesStore.push(data);
			console.log("ApplyAll Template Granular - Add/Remove");
			console.log(granTempPrivilegesStore);
		},
		
		
		updateLoansGRPermission :  function(e,data){
			var index = granLoansPrivilegesStore.findIndex(function(obj){
					return obj.kv.accountId == data.kv.accountId;
			});
			var existObj = granLoansPrivilegesStore[index];
			
			if(undefined != existObj){
				granLoansPrivilegesStore.splice(index, 1);
				granLoansPrivilegesStore.push(data);				
			}else{
				granLoansPrivilegesStore.push(data);				
			}
			console.log(granLoansPrivilegesStore);
		},
		
		applyAllGRLoans :  function(e,data){
			granLoansPrivilegesStore = [];
			granLoansPrivilegesStore.push(data);
			console.log("ApplyAll Add/Remove");
			console.log(granLoansPrivilegesStore);
		},
		
		updateCKGRPermission :  function(e,data){
			var index = granChkMgmtPrivilegesStore.findIndex(function(obj){
					return obj.kv.accountId == data.kv.accountId;
			});
			var existObj = granChkMgmtPrivilegesStore[index];
			
			if(undefined != existObj){
				granChkMgmtPrivilegesStore.splice(index, 1);
				granChkMgmtPrivilegesStore.push(data);				
			}else{
				granChkMgmtPrivilegesStore.push(data);				
			}
			console.log(granChkMgmtPrivilegesStore);
		},
		
		applyAllGRCK :  function(e,data){
			granChkMgmtPrivilegesStore = [];
			granChkMgmtPrivilegesStore.push(data);
			console.log("ApplyAll Add/Remove");
			console.log(granChkMgmtPrivilegesStore);
		},
		
		updatePPGRPermission :  function(e,data){
			var index = granPosPayPrivilegesStore.findIndex(function(obj){
					return obj.kv.accountId == data.kv.accountId;
			});
			var existObj = granPosPayPrivilegesStore[index];
			
			if(undefined != existObj){
				granPosPayPrivilegesStore.splice(index, 1);
				granPosPayPrivilegesStore.push(data);				
			}else{
				granPosPayPrivilegesStore.push(data);				
			}
			console.log(granPosPayPrivilegesStore);
		},
		
		applyAllGRPP :  function(e,data){
			granPosPayPrivilegesStore = [];
			granPosPayPrivilegesStore.push(data);
			console.log("ApplyAll Add/Remove");
			console.log(granPosPayPrivilegesStore);
		},
		
		updateWorkingData : function(command){
			//insert command in  workingData
			if(command.commandName == "CreateRoleDetail" || command.commandName == "UpdateRoleDetail"  || command.commandName == "CopyRoleDetail"){
				workingData.roleId = command.kv.roleId;
				if(command.commandName == "UpdateRoleDetail" && workingData.roleDesc != command.kv.roleDesc)
				{
					workingData.colorClass = 'M';
				}
				else
					{
					workingData.colorClass = 'B';
					}
				workingData.roleDesc = command.kv.roleDesc;
			}else if((command.commandName == "AddSubsidiary" || command.commandName == "RemoveSubsidiary")
					&& workingData.subsidiaries != undefined ){
				var index = workingData.subsidiaries.findIndex(function(obj){
					return obj.subsidiaryId == command.kv.subsidiaryId;
	        	});
	        	
	        	if(command.commandName == "AddSubsidiary")
	        		command.kv.colorClass = 'B';
	        	else
	        		command.kv.colorClass = 'R';
	        		
	        	if(index != -1){
	        		$.extend( workingData.subsidiaries[index], command.kv );	        		
	        	}else{
	        		workingData.subsidiaries.push(command.kv);
	        	}
	        		        	
			}else if((command.commandName == "AddServices" || command.commandName == "RemoveServices")
					&& workingData.services != undefined ){
				var index = workingData.services.findIndex(function(obj){
					return obj.serviceId == command.kv.serviceId;
	        	});
	        	
				if(index != -1){
					//Adding the colorClass property
					command.kv.colorClass = 'R';
					command.kv.digest = workingData.services[index].digest;
		        	$.extend( workingData.services[index], command.kv );
	        	}else{
	        		//Adding the colorClass property
					command.kv.colorClass = 'B';
	        		workingData.services.push(command.kv);
	        	}
				
			}else if((command.commandName == "AddGR" || command.commandName == "RemoveGR")
					&& workingData.granPrivileges != undefined ){
				var index = -1;
				if(workingData.granPrivileges != undefined){
				var index = workingData.granPrivileges.findIndex(function(obj){
					return obj.granularPrivilegeId == command.kv.granularPrivilegeId;
	        	});
				}
	        	if(command.commandName == "AddGR"){
	        		//Adding the colorClass property
					command.kv.colorClass = 'B';
	        	}
	        	else
	        		command.kv.colorClass = 'R';
	        	
				if(index != -1){
					command.kv.digest = workingData.granPrivileges[index].digest;
		        	$.extend( workingData.granPrivileges[index], command.kv );
	        	}else{
	        		workingData.granPrivileges.push(command.kv);
	        	}
				
				//Reset All Granular Privileges Masks
				if(command.commandName == "RemoveGR"){
					if(workingData.assets){
		        		if(command.kv.granularPrivilegeId == "02"){
		        			//Payment
		        			$.each(workingData.assets,function(index,asset){
		        				if(asset.assetId == "02"){
		        					
		        					$.each(asset.granularPermission.payments,function(index,grItem){
		        						grItem.mask = "000000000";
		        					});
		        					
		        					
		        					$.each(asset.granularPermission.reversals,function(index,grItem){
		        						grItem.mask = "000";
		        					});
		        					
		        					$.each(asset.granularPermission.standingInsts,function(index,grItem){
		        						grItem.mask = "000000";
		        					});
		        					
		        					$.each(asset.granularPermission.templates,function(index,grItem){
		        						var mask = grItem.mask.substring(0,3) + "000000000000000000";
		        						grItem.mask = mask;
		        					});
		        				}
		        			});
		        			
		        		}else if(command.kv.granularPrivilegeId == "01"){
		        			//BR
		        			$.each(workingData.assets,function(index,asset){
		        				if(asset.assetId == "01"){
		        					$.each(asset.granularPermission.balanceRpts,function(index,grItem){
		        						grItem.mask = "0000000000";
		        					});
		        				}
		        			});
		        			
		        		}else if(command.kv.granularPrivilegeId == "07"){
		        			//Loan
		        			$.each(workingData.assets,function(index,asset){
		        				if(asset.assetId == "07"){
		        					$.each(asset.granularPermission.loans,function(index,grItem){
		        						grItem.mask = "0000000000000";
		        					});
		        				}
		        			});
		        		}else if(command.kv.granularPrivilegeId == "13"){
		        			//PP
		        			$.each(workingData.assets,function(index,asset){
		        				if(asset.assetId == "13"){
		        					$.each(asset.granularPermission.positivePays,function(index,grItem){
		        						grItem.mask = "0000000";
		        					});
		        				}
		        			});
		        		}else if(command.kv.granularPrivilegeId == "14"){
		        			//Check
		        			$.each(workingData.assets,function(index,asset){
		        				if(asset.assetId == "14"){
		        					$.each(asset.granularPermission.checks,function(index,grItem){
		        						grItem.mask = "00000000000";
		        					});
		        				}
		        			});
		        			
		        		}
					}
	        	}
			}
			
		},
		
		
		updateAssetInWorkingData : function(command,assetIndex){
			//insert command in  workingData
			var index;
			if(command.commandName == "UpdatePermission"){
				if(null != workingData
					&& null != workingData.assets[assetIndex]
					&& null !=	workingData.assets[assetIndex].permissions){
					
					index = workingData.assets[assetIndex].permissions.findIndex(function(obj){
						return obj.tciRmParent == command.kv.tciRmParent;
		        	});
				}else{
					index = -1;
					if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].permissions){
					workingData.assets[assetIndex].permissions = [];
					}
				}
				
				if(index != -1){
					//Adding the colorClass property
					 if(!command.kv.auth && !command.kv.edit && !command.kv.execute && !command.kv.view)
					 {
					 	if (mode == "viewChanges")
					 	{
					 		$.extend( command.kv, workingData.assets[assetIndex].permissions[index] );
					 		command.kv.colorClass = 'R';
					 	}
					 	command.kv.digest = workingData.assets[assetIndex].permissions[index].digest;
						$.extend( workingData.assets[assetIndex].permissions[index], command.kv );	
					 }
					else
					{
						command.kv.colorClass = 'B';
						command.kv.digest = workingData.assets[assetIndex].permissions[index].digest;
						$.extend( workingData.assets[assetIndex].permissions[index], command.kv );
					}
		       }else{
	        		//Adding the colorClass property
					command.kv.colorClass = 'B';
					if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].permissions){
	        		workingData.assets[assetIndex].permissions.push(command.kv);
					}
	        	}
				
			}else if(command.commandName == "UpdateInterfaces"){
				
				if(null != workingData
						&& null != workingData.assets[assetIndex]
						&& null !=	workingData.assets[assetIndex].interfaces){
					
						index = workingData.assets[assetIndex].interfaces.findIndex(function(obj){
						return obj.interfaceId == command.kv.interfaceId;
		        	});
				}else{
					index = -1;
					if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].interfaces){
					workingData.assets[assetIndex].interfaces = [];
					}
				}
				
				if(index != -1){
					//Adding the colorClass property
					 if(!command.kv.auth && !command.kv.edit && !command.kv.execute && !command.kv.view )
					 {
					 	if (mode == "viewChanges")
					 	{
					 		$.extend(  command.kv,workingData.assets[assetIndex].interfaces[index]);
					 		command.kv.colorClass = 'R';
					 	}
					 	command.kv.digest = workingData.assets[assetIndex].interfaces[index].digest;
					 	$.extend( workingData.assets[assetIndex].interfaces[index], command.kv );
					 }
					else
					{
						command.kv.colorClass = 'B';
						command.kv.digest = workingData.assets[assetIndex].interfaces[index].digest;
		        		$.extend( workingData.assets[assetIndex].interfaces[index], command.kv );
					}
	        	}else{
	        		//Adding the colorClass property
					command.kv.colorClass = 'B';
					if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].interfaces){
	        		workingData.assets[assetIndex].interfaces.push(command.kv);
					}
	        	}
			}else if(command.commandName == "UpdateBRGRPermissions"){
				
				if(null != workingData
						&& null != workingData.assets[assetIndex]
						&& null !=	workingData.assets[assetIndex].granularPermission
						&& null !=	workingData.assets[assetIndex].granularPermission.balanceRpts){
					
						index = workingData.assets[assetIndex].granularPermission.balanceRpts.findIndex(function(obj){
						return obj.accountId == command.kv.accountId;
		        	});
				}else{
					index = -1;
					if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].granularPermission
							&& null !=	workingData.assets[assetIndex].granularPermission.balanceRpts){
					workingData.assets[assetIndex].granularPermission.balanceRpts = [];
					}
				}
				
				if(index != -1){
					if (workingData.assets[assetIndex].granularPermission.balanceRpts[index].mask == "0000000000"
					&& command.kv.mask != "0000000000")
					{
						command.kv.colorClass = 'B';
					}
					else if  (workingData.assets[assetIndex].granularPermission.balanceRpts[index].mask != "0000000000"
					&& command.kv.mask == "0000000000")
					{
						if (mode == "viewChanges")
					 		$.extend( command.kv,workingData.assets[assetIndex].granularPermission.balanceRpts[index]);
						command.kv.colorClass = 'R';
					}
					else if (workingData.assets[assetIndex].granularPermission.balanceRpts[index].mask != "0000000000"
					&& command.kv.mask != "0000000000")
					{
						command.kv.colorClass = 'B';
					}
					$.extend( workingData.assets[assetIndex].granularPermission.balanceRpts[index], command.kv );
	        	}else{
	        		command.kv.colorClass = 'B';
	        		if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].granularPermission
							&& null !=	workingData.assets[assetIndex].granularPermission.balanceRpts){
	        		workingData.assets[assetIndex].granularPermission.balanceRpts.push(command.kv);
	        		}
	        	}
			}else if(command.commandName == "ApplyAllGRBR"){
				if(null != workingData
						&& null != workingData.assets[assetIndex]
						&& null !=	workingData.assets[assetIndex].granularPermission
						&& null !=	workingData.assets[assetIndex].granularPermission.balanceRpts){
					
					var bitPos = command.kv.setBitPos.split(",");
					var mask = "0000000000";
					if(command.kv.action == "applyAll"){
						$.each(bitPos,function(index,bitNo){
							mask = mask.replaceAt(bitNo,"1");
						});
					}else{
						mask = "0000000000";
					}
					
					$.each(workingData.assets[assetIndex].granularPermission.balanceRpts,function(index,permission){
						permission.mask = mask;
					});
				}
			}
			else if(command.commandName == "ApplyAllGRCK"){
				if(null != workingData
						&& null != workingData.assets[assetIndex]
						&& null !=	workingData.assets[assetIndex].granularPermission
						&& null !=	workingData.assets[assetIndex].granularPermission.checks){
					
					var bitPos = command.kv.setBitPos.split(",");
					var mask = "00000000000";
					if(command.kv.action == "applyAll"){
						$.each(bitPos,function(index,bitNo){
							mask = mask.replaceAt(bitNo,"1");
						});
					}else{
						mask = "00000000000";
					}
					
					$.each(workingData.assets[assetIndex].granularPermission.checks,function(index,permission){
						permission.mask = mask;
					});
				}
			}
			else if(command.commandName == "ApplyAllGRPP"){
				if(null != workingData
						&& null != workingData.assets[assetIndex]
						&& null !=	workingData.assets[assetIndex].granularPermission
						&& null !=	workingData.assets[assetIndex].granularPermission.positivePays){
					
					var bitPos = command.kv.setBitPos.split(",");
					var mask = "0000000000";
					if(command.kv.action == "applyAll"){
						$.each(bitPos,function(index,bitNo){
							mask = mask.replaceAt(bitNo,"1");
						});
					}else{
						mask = "0000000000";
					}
					
					$.each(workingData.assets[assetIndex].granularPermission.positivePays,function(index,permission){
						permission.mask = mask;
					});
				}
			}
			else if(command.commandName == "ApplyAllGRLoans"){
				if(null != workingData
						&& null != workingData.assets[assetIndex]
						&& null !=	workingData.assets[assetIndex].granularPermission
						&& null !=	workingData.assets[assetIndex].granularPermission.loans){
					
					var bitPos = command.kv.setBitPos.split(",");
					var mask = "0000000000000";
					if(command.kv.action == "applyAll"){
						$.each(bitPos,function(index,bitNo){
							mask = mask.replaceAt(bitNo,"1");
						});
					}else{
						mask = "0000000000000";
					}
					
					$.each(workingData.assets[assetIndex].granularPermission.loans,function(index,permission){
						permission.mask = mask;
					});
				}
			}
			else if(command.commandName == "UpdateLoansGRPermission"){
				
				if(null != workingData
						&& null != workingData.assets[assetIndex]
						&& null !=	workingData.assets[assetIndex].granularPermission
						&& null !=	workingData.assets[assetIndex].granularPermission.loans){
					
						index = workingData.assets[assetIndex].granularPermission.loans.findIndex(function(obj){
						return (obj.accountId == command.kv.accountId);
		        	});
				}else{
					index = -1;
					if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].granularPermission
							&& null !=	workingData.assets[assetIndex].granularPermission.loans){
					workingData.assets[assetIndex].granularPermission.loans = [];
					}
				}
				
				if(index != -1){
					if (workingData.assets[assetIndex].granularPermission.loans[index].mask == "0000000000000"
					&& command.kv.mask != "0000000000000")
					{
						command.kv.colorClass = 'B';
					}
					else if  (workingData.assets[assetIndex].granularPermission.loans[index].mask != "0000000000000"
					&& command.kv.mask == "0000000000000")
					{
						if (mode == "viewChanges")
					 		$.extend( command.kv,workingData.assets[assetIndex].granularPermission.loans[index]);
						command.kv.colorClass = 'R';
					}
					else if (workingData.assets[assetIndex].granularPermission.loans[index].mask != "0000000000000"
					&& command.kv.mask != "0000000000000")
					{
						command.kv.colorClass = 'B';
					}
		        	$.extend( workingData.assets[assetIndex].granularPermission.loans[index], command.kv );
	        	}else{
	        		command.kv.colorClass = 'B';
	        		if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].granularPermission
							&& null !=	workingData.assets[assetIndex].granularPermission.loans){
	        		workingData.assets[assetIndex].granularPermission.loans.push(command.kv);
	        		}
	        	}
			}else if(command.commandName == "UpdateCKGRPermission"){
				
				if(null != workingData
						&& null != workingData.assets[assetIndex]
						&& null !=	workingData.assets[assetIndex].granularPermission
						&& null !=	workingData.assets[assetIndex].granularPermission.checks){
					
						index = workingData.assets[assetIndex].granularPermission.checks.findIndex(function(obj){
						return (obj.accountId == command.kv.accountId);
		        	});
				}else{
					index = -1;
					if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].granularPermission
							&& null !=	workingData.assets[assetIndex].granularPermission.checks){
					workingData.assets[assetIndex].granularPermission.checks = [];
					}
				}
				
				if(index != -1){
					if (workingData.assets[assetIndex].granularPermission.checks[index].mask == "00000000000"
					&& command.kv.mask != "00000000000")
					{
						command.kv.colorClass = 'B';
					}
					else if  (workingData.assets[assetIndex].granularPermission.checks[index].mask != "00000000000"
					&& command.kv.mask == "00000000000")
					{
						if (mode == "viewChanges")
							$.extend( command.kv,workingData.assets[assetIndex].granularPermission.checks[index]);
						command.kv.colorClass = 'R';
					}
					else if (workingData.assets[assetIndex].granularPermission.checks[index].mask != "00000000000"
					&& command.kv.mask != "00000000000")
					{
						command.kv.colorClass = 'B';
					}
		        	$.extend( workingData.assets[assetIndex].granularPermission.checks[index], command.kv );
	        	}else{
	        		command.kv.colorClass = 'B';
	        		if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].granularPermission
							&& null !=	workingData.assets[assetIndex].granularPermission.checks){
	        		workingData.assets[assetIndex].granularPermission.checks.push(command.kv);
	        		}
	        	}
			}else if(command.commandName == "UpdatePPGRPermission"){
				
				if(null != workingData
						&& null != workingData.assets[assetIndex]
						&& null !=	workingData.assets[assetIndex].granularPermission
						&& null !=	workingData.assets[assetIndex].granularPermission.positivePays){
					
						index = workingData.assets[assetIndex].granularPermission.positivePays.findIndex(function(obj){
						return (obj.accountId == command.kv.accountId);
		        	});
				}else{
					index = -1;
					if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].granularPermission
							&& null !=	workingData.assets[assetIndex].granularPermission.positivePays){
					workingData.assets[assetIndex].granularPermission.positivePays = [];
					}
				}
				
				if(index != -1){
					if (workingData.assets[assetIndex].granularPermission.positivePays[index].mask == "0000000000"
					&& command.kv.mask != "0000000000")
					{
						command.kv.colorClass = 'B';
					}
					else if  (workingData.assets[assetIndex].granularPermission.positivePays[index].mask != "0000000000"
					&& command.kv.mask == "0000000000")
					{
						if (mode == "viewChanges")
							$.extend( command.kv,workingData.assets[assetIndex].granularPermission.positivePays[index]);
						command.kv.colorClass = 'R';
					}
					else if (workingData.assets[assetIndex].granularPermission.positivePays[index].mask != "0000000000"
					&& command.kv.mask != "0000000000")
					{
						command.kv.colorClass = 'B';
					}
		        	$.extend( workingData.assets[assetIndex].granularPermission.positivePays[index], command.kv );
	        	}else{
	        		command.kv.colorClass = 'B';
	        		if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].granularPermission
							&& null !=	workingData.assets[assetIndex].granularPermission.positivePays){
	        		workingData.assets[assetIndex].granularPermission.positivePays.push(command.kv);
	        		}
	        	}
			}else if(command.commandName == "UpdatePaymentGRPermission"){
				
				if(null != workingData
						&& null != workingData.assets[assetIndex]
						&& null !=	workingData.assets[assetIndex].granularPermission
						&& null !=	workingData.assets[assetIndex].granularPermission.payments){
					
						index = workingData.assets[assetIndex].granularPermission.payments.findIndex(function(obj){
						return (obj.accountId == command.kv.accountId && obj.packageId == command.kv.packageId);
		        	});
				}else{
					index = -1;
					if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].granularPermission
							&& null !=	workingData.assets[assetIndex].granularPermission.payments){
					workingData.assets[assetIndex].granularPermission.payments = [];
					}
				}
				
				if(index != -1){
					if (workingData.assets[assetIndex].granularPermission.payments[index].mask == "000000000"
					&& command.kv.mask != "000000000")
					{
						command.kv.colorClass = 'B';
					}
					else if  (workingData.assets[assetIndex].granularPermission.payments[index].mask != "000000000"
					&& command.kv.mask == "000000000")
					{
						if (mode == "viewChanges")
							$.extend( command.kv,workingData.assets[assetIndex].granularPermission.payments[index]);
						command.kv.colorClass = 'R';
					}
					else if (workingData.assets[assetIndex].granularPermission.payments[index].mask != "000000000"
					&& command.kv.mask != "000000000")
					{
						command.kv.colorClass = 'B';
					}
		        	$.extend( workingData.assets[assetIndex].granularPermission.payments[index], command.kv );
	        	}else{
	        		command.kv.colorClass = 'B';
	        		if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].granularPermission
							&& null !=	workingData.assets[assetIndex].granularPermission.payments){
	        		workingData.assets[assetIndex].granularPermission.payments.push(command.kv);
	        		}
	        	}
			}else if(command.commandName == "ApplyAllGRPay"){
				if(null != workingData
						&& null != workingData.assets[assetIndex]
						&& null !=	workingData.assets[assetIndex].granularPermission
						&& null !=	workingData.assets[assetIndex].granularPermission.payments){
					
					var bitPos = command.kv.setBitPos.split(",");
					var mask = "000000000";
					if(command.kv.action == "applyAll"){
						$.each(bitPos,function(index,bitNo){
							mask = mask.replaceAt(bitNo,"1");
						});
					}else{
						mask = "000000000";
					}
					
					$.each(workingData.assets[assetIndex].granularPermission.payments,function(index,permission){
						permission.mask = mask;
					});
				}
			}else if(command.commandName == "UpdateSIGRPermission"){
				
				if(null != workingData
						&& null != workingData.assets[assetIndex]
						&& null !=	workingData.assets[assetIndex].granularPermission
						&& null !=	workingData.assets[assetIndex].granularPermission.standingInsts){
					
						index = workingData.assets[assetIndex].granularPermission.standingInsts.findIndex(function(obj){
						return (obj.accountId == command.kv.accountId && obj.packageId == command.kv.packageId);
		        	});
				}else{
					index = -1;
					if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].granularPermission
							&& null !=	workingData.assets[assetIndex].granularPermission.standingInsts){
					workingData.assets[assetIndex].granularPermission.standingInsts = [];
					}
				}
				
				if(index != -1){
					if (workingData.assets[assetIndex].granularPermission.standingInsts[index].mask == "000000"
					&& command.kv.mask != "000000")
					{
						command.kv.colorClass = 'B';
					}
					else if  (workingData.assets[assetIndex].granularPermission.standingInsts[index].mask != "000000"
					&& command.kv.mask == "000000")
					{
						if (mode == "viewChanges")
							$.extend( command.kv,workingData.assets[assetIndex].granularPermission.standingInsts[index]);
						command.kv.colorClass = 'R';
					}
					else if (workingData.assets[assetIndex].granularPermission.standingInsts[index].mask != "000000"
					&& command.kv.mask != "000000")
					{
						command.kv.colorClass = 'B';
					}
		        	$.extend( workingData.assets[assetIndex].granularPermission.standingInsts[index], command.kv );
	        	}else{
	        		command.kv.colorClass = 'B';
	        		if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].granularPermission
							&& null !=	workingData.assets[assetIndex].granularPermission.standingInsts){
	        		workingData.assets[assetIndex].granularPermission.standingInsts.push(command.kv);
	        		}
	        	}
			}else if(command.commandName == "ApplyAllGRSI"){
				if(null != workingData
						&& null != workingData.assets[assetIndex]
						&& null !=	workingData.assets[assetIndex].granularPermission
						&& null !=	workingData.assets[assetIndex].granularPermission.standingInsts){
					
					var bitPos = command.kv.setBitPos.split(",");
					var mask = "000000";
					if(command.kv.action == "applyAll"){
						$.each(bitPos,function(index,bitNo){
							mask = mask.replaceAt(bitNo,"1");
						});
					}else{
						mask = "000000";
					}
					
					$.each(workingData.assets[assetIndex].granularPermission.standingInsts,function(index,permission){
						permission.mask = mask;
					});
				}
			}else if(command.commandName == "UpdateReversalGRPermission"){
				
				if(null != workingData
						&& null != workingData.assets[assetIndex]
						&& null !=	workingData.assets[assetIndex].granularPermission
						&& null !=	workingData.assets[assetIndex].granularPermission.reversals){
					
						index = workingData.assets[assetIndex].granularPermission.reversals.findIndex(function(obj){
						return (obj.accountId == command.kv.accountId);
		        	});
				}else{
					index = -1;
					if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].granularPermission
							&& null !=	workingData.assets[assetIndex].granularPermission.reversals){
					workingData.assets[assetIndex].granularPermission.reversals = [];
					}
				}
				
				if(index != -1){
					if (workingData.assets[assetIndex].granularPermission.reversals[index].mask == "000"
					&& command.kv.mask != "000")
					{
						command.kv.colorClass = 'B';
					}
					else if  (workingData.assets[assetIndex].granularPermission.reversals[index].mask != "000"
					&& command.kv.mask == "000")
					{
						if (mode == "viewChanges")
							$.extend( command.kv,workingData.assets[assetIndex].granularPermission.reversals[index]);
						command.kv.colorClass = 'R';
					}
					else if (workingData.assets[assetIndex].granularPermission.reversals[index].mask != "000"
					&& command.kv.mask != "000")
					{
						command.kv.colorClass = 'B';
					}
		        	$.extend( workingData.assets[assetIndex].granularPermission.reversals[index], command.kv );
	        	}else{
	        		command.kv.colorClass = 'B';
	        		if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].granularPermission
							&& null !=	workingData.assets[assetIndex].granularPermission.reversals){
	        		workingData.assets[assetIndex].granularPermission.reversals.push(command.kv);
	        		}
	        	}
			}else if(command.commandName == "ApplyAllGRReversal"){
				if(null != workingData
						&& null != workingData.assets[assetIndex]
						&& null !=	workingData.assets[assetIndex].granularPermission
						&& null !=	workingData.assets[assetIndex].granularPermission.reversals){
					
					var bitPos = command.kv.setBitPos.split(",");
					var mask = "000";
					if(command.kv.action == "applyAll"){
						$.each(bitPos,function(index,bitNo){
							mask = mask.replaceAt(bitNo,"1");
						});
					}else{
						mask = "000";
					}
					
					$.each(workingData.assets[assetIndex].granularPermission.reversals,function(index,permission){
						permission.mask = mask;
					});
				}
			}else if(command.commandName == "UpdateTemplateGRPermission"){
				
				var templateCommandFlagBits = command.kv.mask.substring(0,3);
				var templateCommandGRBits = command.kv.mask.substring(3,21);
				if(null != workingData
						&& null != workingData.assets[assetIndex]
						&& null !=	workingData.assets[assetIndex].granularPermission
						&& null !=	workingData.assets[assetIndex].granularPermission.templates){
					
						index = workingData.assets[assetIndex].granularPermission.templates.findIndex(function(obj){
						return (obj.accountId == command.kv.accountId  && obj.packageId == command.kv.packageId);
		        	});
				}else{
					index = -1;
					if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].granularPermission
							&& null !=	workingData.assets[assetIndex].granularPermission.templates){
					workingData.assets[assetIndex].granularPermission.templates = [];
					}
				}
				
				if(index != -1){
					if (workingData.assets[assetIndex].granularPermission.templates[index].mask.substring(3,21) == "000000000000000000"
					&& templateCommandGRBits != "000000000000000000")
					{
						command.kv.colorClass = 'B';
					}
					else if  (workingData.assets[assetIndex].granularPermission.templates[index].mask.substring(3,21) != "000000000000000000"
					&& templateCommandGRBits == "000000000000000000")
					{
						if (mode == "viewChanges")
							$.extend( command.kv,workingData.assets[assetIndex].granularPermission.templates[index]);
						command.kv.colorClass = 'R';
						command.kv.mask = templateCommandFlagBits + "000000000000000000";
					}
					else if (workingData.assets[assetIndex].granularPermission.templates[index].mask.substring(3,21) != "000000000000000000"
					&& templateCommandGRBits != "000000000000000000")
					{
						command.kv.colorClass = 'B';
					}
		        	$.extend( workingData.assets[assetIndex].granularPermission.templates[index], command.kv );
	        	}else{
	        		command.kv.colorClass = 'B';
	        		if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].granularPermission
							&& null !=	workingData.assets[assetIndex].granularPermission.templates){
	        		workingData.assets[assetIndex].granularPermission.templates.push(command.kv);
	        		}
	        	}
			}else if(command.commandName == "ApplyAllGRTemplate"){
				if(null != workingData
						&& null != workingData.assets[assetIndex]
						&& null !=	workingData.assets[assetIndex].granularPermission
						&& null !=	workingData.assets[assetIndex].granularPermission.templates){
					
					var bitPos = command.kv.setBitPos.split(",");
					var mask = "000000000000000000";
					if(command.kv.action == "applyAll"){
						mask = "000000000000000000000";
						$.each(bitPos,function(index,bitNo){
							mask = mask.replaceAt(bitNo,"1");
						});
						mask = mask.substring(3,21);
					}else{
						mask = "000000000000000000";
					}
					
					$.each(workingData.assets[assetIndex].granularPermission.templates,function(index,permission){
						var templateCommandFlagBits = permission.mask.substring(0,3);						
						permission.mask = templateCommandFlagBits.concat(mask);
					});
				}
			}else if(command.commandName == "AddMessages" || command.commandName == "RemoveMessages" ){
				
				if(null != workingData
						&& null != workingData.assets[assetIndex]
						&& null !=	workingData.assets[assetIndex].messages){
					
						index = workingData.assets[assetIndex].messages.findIndex(function(obj){
						return obj.messageId == command.kv.messageId;
		        	});
				}else{
					index = -1;
					if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].messages){
					workingData.assets[assetIndex].messages = [];
					}
				}
				
				if(index != -1){
					if(command.commandName == "AddMessages"){
		        		workingData.assets[assetIndex].messagesAssignedCount++;
					}else{
		        		workingData.assets[assetIndex].messagesAssignedCount--;
					}
					command.kv.colorClass = 'R';
					command.kv.digest = workingData.assets[assetIndex].messages[index].digest;
		        	$.extend( workingData.assets[assetIndex].messages[index], command.kv );
	        	}else{
	        		//Adding the colorClass property
					command.kv.colorClass = 'B';
					if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].messages){
	        		workingData.assets[assetIndex].messages.push(command.kv);
					}
	        	}
			}else if(command.commandName == "AddReports" || command.commandName == "RemoveReports" ){
				
				if(null != workingData
						&& null != workingData.assets[assetIndex]
						&& null !=	workingData.assets[assetIndex].reports){
					
						index = workingData.assets[assetIndex].reports.findIndex(function(obj){
						return obj.reportId == command.kv.reportId;
		        	});
				}else{
					index = -1;
					if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].reports){
					workingData.assets[assetIndex].reports = [];
					}
				}
				
				if(index != -1){
					if(command.commandName == "AddReports"){
		        		command.kv.colorClass = 'B';
		        		workingData.assets[assetIndex].reportsAssignedCount++;
					}else{
		        		command.kv.colorClass = 'R';
		        		workingData.assets[assetIndex].reportsAssignedCount--;
					}
					command.kv.digest = workingData.assets[assetIndex].reports[index].digest;
					$.extend( workingData.assets[assetIndex].reports[index], command.kv );
	        	}else{
	        		if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].reports){
	        		workingData.assets[assetIndex].reports.push(command.kv);
	        		}
	        	}
			}else if(command.commandName == "AddWidgets" || command.commandName == "RemoveWidgets" ){
				
				if(null != workingData
						&& null != workingData.assets[assetIndex]
						&& null !=	workingData.assets[assetIndex].widgets){
					
					index = workingData.assets[assetIndex].widgets.findIndex(function(obj){
						return obj.widgetId == command.kv.widgetId;
		        	});
				}else{
					index = -1;
					if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].widgets){
					workingData.assets[assetIndex].widgets = [];
					}
				}
				
				if(index != -1){
					if(command.commandName == "AddWidgets"){
		        		command.kv.colorClass = 'B';
		        		workingData.assets[assetIndex].widgetsAssignedCount++;
					}else{
		        		command.kv.colorClass = 'R';
		        		workingData.assets[assetIndex].widgetsAssignedCount--;
					}
					command.kv.digest = workingData.assets[assetIndex].widgets[index].digest;
					$.extend( workingData.assets[assetIndex].widgets[index], command.kv );
	        	}else{
	        		if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].widgets){
	        		workingData.assets[assetIndex].widgets.push(command.kv);
	        		}
	        	}
				
			}else if(command.commandName == "AddAlerts" || command.commandName == "RemoveAlerts" ){
				
				if(null != workingData
						&& null != workingData.assets[assetIndex]
						&& null !=	workingData.assets[assetIndex].alerts){
					
						index = workingData.assets[assetIndex].alerts.findIndex(function(obj){
						return obj.alertId == command.kv.alertId;
		        	})
				}else{
					index = -1;
					if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].alerts){
					workingData.assets[assetIndex].alerts = [];
					}
				}
				
				if(index != -1){
					if(command.commandName == "AddAlerts")
					{
						command.kv.colorClass = 'B';
						workingData.assets[assetIndex].alertsAssignedCount++;
					}
					else
					{
						command.kv.colorClass = 'R';
						workingData.assets[assetIndex].alertsAssignedCount--;
					}
					command.kv.digest = workingData.assets[assetIndex].alerts[index].digest;
					$.extend( workingData.assets[assetIndex].alerts[index], command.kv );
	        	}else{
	        		if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].alerts){
	        		workingData.assets[assetIndex].alerts.push(command.kv);
	        		}
	        	}
				
			}else if(command.commandName == "AddAccounts" || command.commandName == "RemoveAccounts" ){
				
				if(null != workingData
						&& null != workingData.assets[assetIndex]
						&& null !=	workingData.assets[assetIndex].accounts){
					
						index = workingData.assets[assetIndex].accounts.findIndex(function(obj){
						return obj.accountId == command.kv.accountId;
		        	})
				}else{
					index = -1;
					if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].accounts){
					workingData.assets[assetIndex].accounts = [];
					}
				}
				console.log(command.commandName+"                           "+index);
				
	        	if(index != -1){
					if(command.commandName == "AddAccounts"){
		        		command.kv.colorClass = 'B';
		        		workingData.assets[assetIndex].accountsAssignedCount++;
					}
		        	else{
		        		command.kv.colorClass = 'R';
		        		workingData.assets[assetIndex].accountsAssignedCount--;
		        	}
	        		command.kv.digest = workingData.assets[assetIndex].accounts[index].digest;
	        		$.extend( workingData.assets[assetIndex].accounts[index], command.kv );
	        	}else{
	        		if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].accounts){
	        		workingData.assets[assetIndex].accounts.push(command.kv);
	        		}
	        	}
			}else if(command.commandName == "AddPackages" || command.commandName == "RemovePackages" ){
				
				if(null != workingData
						&& null != workingData.assets[assetIndex]
						&& null !=	workingData.assets[assetIndex].packages){
					
						index = workingData.assets[assetIndex].packages.findIndex(function(obj){
						return obj.packageId == command.kv.packageId;
		        	})
				}else{
					index = -1;
					if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].packages){
					workingData.assets[assetIndex].packages = [];
					}
				}
				
				if(index != -1){
					if(command.commandName == "AddPackages"){
		        		command.kv.colorClass = 'B';
		        		workingData.assets[assetIndex].packagesAssignedCount++;
					}else{
		        		command.kv.colorClass = 'R';
		        		workingData.assets[assetIndex].packagesAssignedCount--;
					}
					command.kv.digest = workingData.assets[assetIndex].packages[index].digest;
					$.extend( workingData.assets[assetIndex].packages[index], command.kv );
	        	}else{
	        		if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].packages){
	        		workingData.assets[assetIndex].packages.push(command.kv);
	        		}
	        	}
			}else if(command.commandName == "AddTemplates" || command.commandName == "RemoveTemplates" ){
				
				if(null != workingData
						&& null != workingData.assets[assetIndex]
						&& null !=	workingData.assets[assetIndex].templates){
					
						index = workingData.assets[assetIndex].templates.findIndex(function(obj){
						return obj.templateId == command.kv.templateId;
		        	})
				}else{
					index = -1;
					if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].templates){
					workingData.assets[assetIndex].templates = [];
					}
				}
				
				if(index != -1){
					if(command.commandName == "AddTemplates"){
		        		command.kv.colorClass = 'B';
		        		workingData.assets[assetIndex].templatesAssignedCount++;
					}else{
		        		command.kv.colorClass = 'R';
		        		workingData.assets[assetIndex].templatesAssignedCount--;
					}
					command.kv.digest = workingData.assets[assetIndex].templates[index].digest;
					$.extend( workingData.assets[assetIndex].templates[index], command.kv );
	        	}else{
	        		if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].templates){
	        		workingData.assets[assetIndex].templates.push(command.kv);
	        		}
	        	}
			}else if(command.commandName == "AddCompanyId" || command.commandName == "RemoveCompanyId" ){
				
				if(null != workingData
						&& null != workingData.assets[assetIndex]
						&& null !=	workingData.assets[assetIndex].companyIds){
					
						index = workingData.assets[assetIndex].companyIds.findIndex(function(obj){
						return obj.companyId == command.kv.companyId;
		        	})
				}else{
					index = -1;
					if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].companyIds){
					workingData.assets[assetIndex].companyIds = [];
					}
				}
				
				if(index != -1){
					if(command.commandName == "AddCompanyId"){
		        		command.kv.colorClass = 'B';
		        		workingData.assets[assetIndex].companyIdAssignedCount++;
					}else{
		        		command.kv.colorClass = 'R';
		        		workingData.assets[assetIndex].companyIdAssignedCount--;
					}
					command.kv.digest = workingData.assets[assetIndex].companyIds[index].digest;
					$.extend( workingData.assets[assetIndex].companyIds[index], command.kv );
	        	}else{
	        		if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].companyIds){
	        		workingData.assets[assetIndex].companyIds.push(command.kv);
	        		}
	        	}
			}else if(command.commandName == "AddBankReports" || command.commandName == "RemoveBankReports" ){
				
				if(null != workingData
						&& null != workingData.assets[assetIndex]
						&& null !=	workingData.assets[assetIndex].bankReports){
					
						index = workingData.assets[assetIndex].bankReports.findIndex(function(obj){
						return obj.distributionId == command.kv.distributionId;
		        	})
				}else{
					index = -1;
					if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].bankReports){
					workingData.assets[assetIndex].bankReports = [];
					}
				}
				
				if(command.commandName == "AddBankReports")
	        		command.kv.colorClass = 'B';
	        	else
	        		command.kv.colorClass = 'R';
				
				if(index != -1){
					command.kv.digest = workingData.assets[assetIndex].bankReports[index].digest;
					$.extend( workingData.assets[assetIndex].bankReports[index], command.kv );
	        	}else{
	        		if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].bankReports){
	        		workingData.assets[assetIndex].bankReports.push(command.kv);
	        		}
	        	}
			}else if(command.commandName == "AddNotional" || command.commandName == "RemoveNotional" ){
				
				if(null != workingData
						&& null != workingData.assets[assetIndex]
						&& null !=	workingData.assets[assetIndex].notionalAgreements){
					
						index = workingData.assets[assetIndex].notionalAgreements.findIndex(function(obj){
						return obj.agreementCode == command.kv.agreementCode;
		        	})
				}else{
					index = -1;
					if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].notionalAgreements){
					workingData.assets[assetIndex].notionalAgreements = [];
					}
				}
				
				if(index != -1){
					if(command.commandName == "AddNotional"){
		        		command.kv.colorClass = 'B';
		        		workingData.assets[assetIndex].notionalAgreementsAssignedCount++;
					}else{
		        		command.kv.colorClass = 'R';
		        		workingData.assets[assetIndex].notionalAgreementsAssignedCount--;
					}
					command.kv.digest = workingData.assets[assetIndex].notionalAgreements[index].digest;
					$.extend( workingData.assets[assetIndex].notionalAgreements[index], command.kv );
	        	}else{
					if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].notionalAgreements){
	        		workingData.assets[assetIndex].notionalAgreements.push(command.kv);
					}
	        	}
			}
			else if(command.commandName == "AddSweep" || command.commandName == "RemoveSweep" ){
				
				if(null != workingData
						&& null != workingData.assets[assetIndex]
						&& null !=	workingData.assets[assetIndex].sweepAgreements){
					
						index = workingData.assets[assetIndex].sweepAgreements.findIndex(function(obj){
						return obj.agreementCode == command.kv.agreementCode;
		        	})
				}else{
					index = -1;
					if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].sweepAgreements){
					workingData.assets[assetIndex].sweepAgreements = [];
					}
				}
				
				if(index != -1){
					if(command.commandName == "AddSweep"){
	        			command.kv.colorClass = 'B';
	        			workingData.assets[assetIndex].sweepAgreementsAssignedCount++;
					}else{
		        		command.kv.colorClass = 'R';
		        		workingData.assets[assetIndex].sweepAgreementsAssignedCount--;
					}
					command.kv.digest = workingData.assets[assetIndex].sweepAgreements[index].digest;
					$.extend( workingData.assets[assetIndex].sweepAgreements[index], command.kv );
	        	}else{
					if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].sweepAgreements){
	        		workingData.assets[assetIndex].sweepAgreements.push(command.kv);
					}
	        	}
			}
			else if(command.commandName == "AddFeatures" || command.commandName == "RemoveFeatures" ){
				
				if(null != workingData
						&& null != workingData.assets[assetIndex]
						&& null !=	workingData.assets[assetIndex].allowedFeatures){
					
						index = workingData.assets[assetIndex].allowedFeatures.findIndex(function(obj){
						return obj.featureId == command.kv.featureId;
		        	})
				}else{
					index = -1;
					if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].allowedFeatures){
						workingData.assets[assetIndex].allowedFeatures = [];
					}
				}
				
				if(command.commandName == "AddFeatures")
				{
					//Adding the colorClass property
					command.kv.colorClass = 'B';	
				}
				else
					command.kv.colorClass = 'R';
	        	if(index != -1){
	        		command.kv.digest = workingData.assets[assetIndex].allowedFeatures[index].digest;
	        		$.extend( workingData.assets[assetIndex].allowedFeatures[index],command.kv );
	        	}else{
					if(null != workingData
							&& null != workingData.assets[assetIndex]
							&& null !=	workingData.assets[assetIndex].allowedFeatures){
	        		workingData.assets[assetIndex].allowedFeatures.push(command.kv);
					}
				}
			}
			
			else if((command.commandName == "ApplyAllInterfaces" || command.commandName == "RemoveAllInterfaces" )
					&& (null != workingData && null != workingData.assets && null != workingData.assets[assetIndex]) ){
				if( null !=	workingData.assets[assetIndex].assignAllInterfaces){
					workingData.assets[assetIndex].assignAllInterfaces = command.kv.assignAllInterfaces;
				}
				if(command.commandName == "RemoveAllInterfaces"){
					if(workingData.assets[assetIndex].interfaces){
						$.each(workingData.assets[assetIndex].interfaces,function(index,item){
							item.edit =false;
							item.execute = false;
							item.assignedFlag = false;
							item.colorClass = 'R';
						});						
					}
				}else{
					if(workingData.assets[assetIndex].interfaces){
						$.each(workingData.assets[assetIndex].interfaces,function(index,item){
							item.edit =true;
							item.execute = true;
							item.assignedFlag = true;
							item.colorClass = 'B';
						});						
					}
				}
			}else if((command.commandName == "ApplyAllAlerts" || command.commandName == "RemoveAllAlerts" )
					&& (null != workingData && null != workingData.assets && null != workingData.assets[assetIndex]) ){
				if( null !=	workingData.assets[assetIndex].assignAllAlerts){
					workingData.assets[assetIndex].assignAllAlerts = command.kv.assignAllAlerts;
				}
				if(command.commandName == "RemoveAllAlerts"){
					if(workingData.assets[assetIndex].alerts){
						$.each(workingData.assets[assetIndex].alerts,function(index,item){
							item.assignedFlag = false;
							item.colorClass = 'R';
							workingData.assets[assetIndex].alertsAssignedCount = 0 ;
						});
					}					
				}else{
					if(workingData.assets[assetIndex].alerts){
						$.each(workingData.assets[assetIndex].alerts,function(index,item){
							item.assignedFlag = true;
							item.colorClass = 'B';
							workingData.assets[assetIndex].alertsAssignedCount = workingData.assets[assetIndex].alertsCount;
						});
					}					
				}
			}else if((command.commandName == "ApplyAllMessages" || command.commandName == "RemoveAllMessages" )
					&& (null != workingData && null != workingData.assets && null != workingData.assets[assetIndex]) ){
				if( null !=	workingData.assets[assetIndex].assignAllMessages){
					workingData.assets[assetIndex].assignAllMessages = command.kv.assignAllMessages;
				}
				if(command.commandName == "RemoveAllMessages"){
					if(workingData.assets[assetIndex].messages){
						$.each(workingData.assets[assetIndex].messages,function(index,item){
							item.assignedFlag = false;
							item.colorClass = 'R';
							workingData.assets[assetIndex].messagesAssignedCount = 0;
						});						
					}
				}else{
					if(workingData.assets[assetIndex].messages){
						$.each(workingData.assets[assetIndex].messages,function(index,item){
							item.assignedFlag = true;
							item.colorClass = 'B';
							workingData.assets[assetIndex].messagesAssignedCount = workingData.assets[assetIndex].messagesCount;
						});						
					}
				}
			}else if((command.commandName == "ApplyAllTemplates" || command.commandName == "RemoveAllTemplates" )
					&& (null != workingData && null != workingData.assets && null != workingData.assets[assetIndex]) ){
				if( null !=	workingData.assets[assetIndex].assignAllTemplates){
					workingData.assets[assetIndex].assignAllTemplates = command.kv.assignAllTemplates;
				}
				if(command.commandName == "RemoveAllTemplates"){
					if(workingData.assets[assetIndex].templates){
						$.each(workingData.assets[assetIndex].templates,function(index,item){
							item.assignedFlag = false;
							item.colorClass = 'R';
							workingData.assets[assetIndex].templatesAssignedCount = 0;
						});						
					}
				}else{
					if(workingData.assets[assetIndex].templates){
						$.each(workingData.assets[assetIndex].templates,function(index,item){
							item.assignedFlag = true;
							item.colorClass = 'B';
							workingData.assets[assetIndex].templatesAssignedCount = workingData.assets[assetIndex].templatesCount;
						});						
					}
				}
			}else if((command.commandName == "ApplyAllPackages" || command.commandName == "RemoveAllPackages" )
					&& (null != workingData && null != workingData.assets && null != workingData.assets[assetIndex]) ){
				if( null !=	workingData.assets[assetIndex].assignAllPackages){
					workingData.assets[assetIndex].assignAllPackages = command.kv.assignAllPackages;
				}
				if(command.commandName == "RemoveAllPackages"){
					if(workingData.assets[assetIndex].packages){
						$.each(workingData.assets[assetIndex].packages,function(index,item){
							item.assignedFlag = false;
							item.colorClass = 'R';
							workingData.assets[assetIndex].packagesAssignedCount = 0;
						});						
					}
				}else{
					if(workingData.assets[assetIndex].packages){
						$.each(workingData.assets[assetIndex].packages,function(index,item){
							item.assignedFlag = true;
							item.colorClass = 'B';
							workingData.assets[assetIndex].packagesAssignedCount = workingData.assets[assetIndex].packagesCount;
						});						
					}
				}
			}else if((command.commandName == "ApplyAllCompanyIds" || command.commandName == "RemoveAllCompanyIds" )
					&& (null != workingData && null != workingData.assets && null != workingData.assets[assetIndex]) ){
				if( null !=	workingData.assets[assetIndex].assignAllCompanyIds){
					workingData.assets[assetIndex].assignAllCompanyIds = command.kv.assignAllCompanyIds;
				}
				if(command.commandName == "RemoveAllCompanyIds"){
					if(workingData.assets[assetIndex].companyIds){
						$.each(workingData.assets[assetIndex].companyIds,function(index,item){
							item.assignedFlag = false;
							item.colorClass = 'R';
							workingData.assets[assetIndex].companyIdAssignedCount = 0;
						});						
					}
				}
				else
				{
					if(workingData.assets[assetIndex].companyIds){
						$.each(workingData.assets[assetIndex].companyIds,function(index,item){
							item.colorClass = 'B';
							workingData.assets[assetIndex].companyIdAssignedCount = workingData.assets[assetIndex].companyIdCount;
						});						
					}
				}
			}else if((command.commandName == "ApplyAllWidgets" || command.commandName == "RemoveAllWidgets" )
					&& (null != workingData && null != workingData.assets && null != workingData.assets[assetIndex]) ){
				if( null !=	workingData.assets[assetIndex].assignAllWidgets){
					workingData.assets[assetIndex].assignAllWidgets = command.kv.assignAllWidgets;
				}
				if(command.commandName == "RemoveAllWidgets"){
					if(workingData.assets[assetIndex].widgets){
						$.each(workingData.assets[assetIndex].widgets,function(index,item){
							item.assignedFlag = false;
							item.colorClass = 'R';
							workingData.assets[assetIndex].widgetsAssignedCount = 0 ;
						});						
					}
				}else{
					if(workingData.assets[assetIndex].widgets){
						$.each(workingData.assets[assetIndex].widgets,function(index,item){
							item.assignedFlag = true;
							item.colorClass = 'B';
							workingData.assets[assetIndex].widgetsAssignedCount = workingData.assets[assetIndex].widgetsCount;
						});						
					}
				}
			}else if((command.commandName == "ApplyAllReports" || command.commandName == "RemoveAllReports" )
					&& (null != workingData && null != workingData.assets && null != workingData.assets[assetIndex]) ){
				if( null !=	workingData.assets[assetIndex].assignAllReports){
					workingData.assets[assetIndex].assignAllReports = command.kv.assignAllReports;
				}
				if(command.commandName == "RemoveAllReports"){
					if(workingData.assets[assetIndex].reports){
						$.each(workingData.assets[assetIndex].reports,function(index,item){
							item.assignedFlag = false;
							item.colorClass = 'R';
							workingData.assets[assetIndex].reportsAssignedCount = 0;
						});						
					}
				}else{
					if(workingData.assets[assetIndex].reports){
						$.each(workingData.assets[assetIndex].reports,function(index,item){
							item.assignedFlag = true;
							item.colorClass = 'B';
							workingData.assets[assetIndex].reportsAssignedCount = workingData.assets[assetIndex].reportsCount;
						});						
					}
				}
			}else if((command.commandName == "ApplyAllBankReports" || command.commandName == "RemoveAllBankReports")
					&& (null != workingData && null != workingData.assets && null != workingData.assets[assetIndex]) ){
				if( null !=	workingData.assets[assetIndex].assignAllBR){
					workingData.assets[assetIndex].assignAllBR = command.kv.assignAllBR;
				}
				if(command.commandName == "RemoveAllBankReports"){
					if(workingData.assets[assetIndex].bankReports){
						$.each(workingData.assets[assetIndex].bankReports,function(index,item){
							item.assignedFlag = false;
							item.colorClass = 'R';
						});
					}					
				}else{
					if(workingData.assets[assetIndex].bankReports){
						$.each(workingData.assets[assetIndex].bankReports,function(index,item){
							item.assignedFlag = true;
							item.colorClass = 'B';
						});
					}					
				}
			}else if((command.commandName == "ApplyAllNotional" || command.commandName == "RemoveAllNotional")
					&& (null != workingData && null != workingData.assets && null != workingData.assets[assetIndex]) ){
				if( null !=	workingData.assets[assetIndex].assignAllNotionals){
					workingData.assets[assetIndex].assignAllNotionals = command.kv.assignAllNotionals;
				}
				if(command.commandName == "RemoveAllNotional"){
					if(workingData.assets[assetIndex].notionalAgreements){
						$.each(workingData.assets[assetIndex].notionalAgreements,function(index,item){
							item.assignedFlag = false;
							item.colorClass = 'R';
							workingData.assets[assetIndex].notionalAgreementsAssignedCount = 0;
						});
					}					
				}else{
					if(workingData.assets[assetIndex].notionalAgreements){
						$.each(workingData.assets[assetIndex].notionalAgreements,function(index,item){
							item.assignedFlag = true;
							item.colorClass = 'B';
							workingData.assets[assetIndex].notionalAgreementsAssignedCount = workingData.assets[assetIndex].notionalAgreementsCount;
						});
					}					
				}
			}else if((command.commandName == "ApplyAllSweep" || command.commandName == "RemoveAllSweep") 
					&& (null != workingData && null != workingData.assets && null != workingData.assets[assetIndex]) ){
				if( null !=	workingData.assets[assetIndex].assignAllSweeps){
					workingData.assets[assetIndex].assignAllSweeps = command.kv.assignAllSweeps;
				}
				if(command.commandName == "RemoveAllSweep"){
					if(workingData.assets[assetIndex].sweepAgreements){
						$.each(workingData.assets[assetIndex].sweepAgreements,function(index,item){
							item.assignedFlag = false;
							item.colorClass = 'R';
							workingData.assets[assetIndex].sweepAgreementsAssignedCount = 0;
						});
					}					
				}else{
					if(workingData.assets[assetIndex].sweepAgreements){
						$.each(workingData.assets[assetIndex].sweepAgreements,function(index,item){
							item.assignedFlag = true;
							item.colorClass = 'B';
							workingData.assets[assetIndex].sweepAgreementsAssignedCount = workingData.assets[assetIndex].sweepAgreementsCount;
						});
					}					
				}
			}else if((command.commandName == "ApplyAllAccounts" || command.commandName == "RemoveAllAccounts") 
					&& (null != workingData && null != workingData.assets && null != workingData.assets[assetIndex]) ){
				if( null !=	workingData.assets[assetIndex].assignAllAccounts){
					workingData.assets[assetIndex].assignAllAccounts = command.kv.assignAllAccounts;
				}
				if(command.commandName == "RemoveAllAccounts"){
					if(workingData.assets[assetIndex].accounts){
						$.each(workingData.assets[assetIndex].accounts,function(index,item){
							item.assignedFlag = false;
							item.colorClass = 'R';
							workingData.assets[assetIndex].accountsAssignedCount = 0;
						});						
					}
				}else{
					if(workingData.assets[assetIndex].accounts){
						$.each(workingData.assets[assetIndex].accounts,function(index,item){
							item.assignedFlag = true;
							item.colorClass = 'B';
							workingData.assets[assetIndex].accountsAssignedCount = workingData.assets[assetIndex].accountsCount;
						});						
					}
				}
			}
		},
		
		clearAssetStores : function(){
			permissionStore = [];
			messageStore = [];
			reportStore = [];
			widgetStore = [];
			accountStore = [];
			interfaceStore = [];
			alertStore = [];
			allFlagStore = [];
			featureStore = [];
			packageStore = [];
			templateStore = [];
			companyIdStore = []; 
			bankReport =[];
			notionalAgreementStore =[];
			sweepAgreementStore = [];
			granBRPrivilegesStore = [];
			granPayPrivilegesStore = [];
			granSIPrivilegesStore = [];
			granReversalPrivilegesStore = [];
			granTempPrivilegesStore = [] ;
			granLoansPrivilegesStore = [];
			granChkMgmtPrivilegesStore = [];
			granPosPayPrivilegesStore = [];
			alertCount = 0; 
			alertsAssignedCount = 0;
			companyIdCount = 0, companyIdAssignedCount = 0, messagesCount =0, messagesAssignedCount=0;
			widgetsCount =0, widgetsAssignedCount =0, reportsCount=0, reportsAssignedCount=0, templatesAssignedCount=0, templatesCount=0;
			accountsAssignedCount=0, accountsCount=0, notionalAgreementsAssignedCount =0, notionalAgreementsCount = 0;
			sweepAgreementsAssignedCount=0, sweepAgreementsCount=0, packagesAssignedCount=0, packagesCount=0;
		},
		
		saveAsset : function(e, assetId){
			var url;
			$.blockUI();
			$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;'+getLabel("loading", "Loading")+'...</h2></div>',
				css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});				
			url= "roleId=" + workingData.roleId  + "&corpId="+ workingData.corporationId +"&recordKeyNo=" + workingData.recordKeyNo; 
			$.ajax({
		        url: "services/rolesCommandApi/process/?" + url,
		        type: "POST",
		        data: JSON.stringify(roleCommand),
		        async : false,
		        contentType: "application/json; charset=utf-8",
		        success: function (data) {
		        	if(null != data)
		        		workingData.recordKeyNo = data;
		        	var assetIndex = workingData.assets.findIndex(function(obj){
						return obj.assetId == assetId.assetId;
		        	});
		        	
		        	if(assetIndex != -1){
			        	$.each(roleCommand, function(index, item) {
			        		CommonObj.updateAssetInWorkingData(item,assetIndex);
			        	})		        		
		        	}
		        	
		        	roleCommand = [];
		        	uiCommand = [];		        	
		        	CommonObj.clearAssetStores();
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
		},
		
		
		submitRole : function(e, assetId){
			var url;
			$.ajax({
		        url: "services/rolesCommandApi/submit",
		        type: "POST",
		        data: JSON.stringify(roleCommand),
		        async : false,
		        contentType: "application/json; charset=utf-8",
		        success: function (data) {
		        	roleCommand = [];
		        	if(data !=null && data[0] != undefined  && data[0].success === 'Y')
		        	window.location = 'userAdminCategoryList.form';
		        	//$.unblockUI();
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

	RolesApp.bind('ApplyAllMessages', CommonObj.applyAllMessages);
	RolesApp.bind('RemoveAllMessages', CommonObj.removeAllMessages);

	RolesApp.bind('ApplyAllReports', CommonObj.applyAllReports);
	RolesApp.bind('RemoveAllReports', CommonObj.removeAllReports);
	
	RolesApp.bind('ApplyAllWidgets', CommonObj.applyAllWidgets);
	RolesApp.bind('RemoveAllWidgets', CommonObj.removeAllWidgets);
	
	RolesApp.bind('ApplyAllAlerts', CommonObj.applyAllAlerts);
	RolesApp.bind('RemoveAllAlerts', CommonObj.removeAllAlerts);
	
	RolesApp.bind('ApplyAllInterfaces', CommonObj.applyAllInterfaces);
	RolesApp.bind('RemoveAllInterfaces', CommonObj.removeAllInterfaces);
	
	RolesApp.bind('ApplyAllAccounts', CommonObj.applyAllAccounts);
	RolesApp.bind('RemoveAllAccounts', CommonObj.removeAllAccounts);
	
	RolesApp.bind('ApplyAllCompanyID', CommonObj.applyAllCompanyID);
	RolesApp.bind('RemoveAllCompanyID', CommonObj.removeAllCompanyID);
	
	RolesApp.bind('ApplyAllPackages', CommonObj.applyAllPackages);
	RolesApp.bind('RemoveAllPackages', CommonObj.removeAllPackages);
	
	RolesApp.bind('ApplyAllTemplates', CommonObj.applyAllTemplates);
	RolesApp.bind('RemoveAllTemplates', CommonObj.removeAllTemplates);
	
	RolesApp.bind('ApplyAllBankReports', CommonObj.applyAllBankReports);
	RolesApp.bind('RemoveAllBankReports', CommonObj.removeAllBankreports);
	
	RolesApp.bind('ApplyAllNotional', CommonObj.applyAllNotional);
	RolesApp.bind('RemoveAllNotional', CommonObj.removeAllNotional);
	
	RolesApp.bind('ApplyAllSweep', CommonObj.applyAllSweep);
	RolesApp.bind('RemoveAllSweep', CommonObj.removeAllSweep);

	/*NEW HANDLERS*/
	
	RolesApp.bind('UpdatePermission', CommonObj.updatePermission);
	RolesApp.bind('UpdateInterfaces', CommonObj.updateInterfaces);

	RolesApp.bind('AddFeatures', CommonObj.addFeatures);
	RolesApp.bind('RemoveFeatures', CommonObj.removeFeatures);
	
	RolesApp.bind('AddMessages', CommonObj.addMessages);
	RolesApp.bind('RemoveMessages', CommonObj.removeMessages);
	
	RolesApp.bind('AddReports', CommonObj.addReports);
	RolesApp.bind('RemoveReports', CommonObj.removeReports);
	
	RolesApp.bind('AddWidgets', CommonObj.addWidgets);
	RolesApp.bind('RemoveWidgets', CommonObj.removeWidgets);

	RolesApp.bind('AddAlerts', CommonObj.addAlerts);
	RolesApp.bind('RemoveAlerts', CommonObj.removeAlerts);
	
	RolesApp.bind('AddAccounts', CommonObj.addAccounts);
	RolesApp.bind('RemoveAccounts', CommonObj.removeAccounts);
	
	RolesApp.bind('AddPackages', CommonObj.addPackages);
	RolesApp.bind('RemovePackages', CommonObj.removePackages);
	
	RolesApp.bind('AddTemplates', CommonObj.addTemplates);
	RolesApp.bind('RemoveTemplates', CommonObj.removeTemplates);
	
	RolesApp.bind('AddCompanyID', CommonObj.addCompanyID);
	RolesApp.bind('RemoveCompanyID', CommonObj.removeCompanyID);
	
	RolesApp.bind('AddBankReports', CommonObj.addBankReports);
	RolesApp.bind('RemoveBankReports', CommonObj.removeBankReports);
	
	RolesApp.bind('AddNotional', CommonObj.addNotional);
	RolesApp.bind('RemoveNotional', CommonObj.removeNotional);
	
	RolesApp.bind('AddSweep', CommonObj.addSweep);
	RolesApp.bind('RemoveSweep', CommonObj.removeSweep);
	
	RolesApp.bind('SaveAsset', CommonObj.saveAsset);
	RolesApp.bind('SubmitRole', CommonObj.submitRole);
	
	RolesApp.bind('UpdateBRGRPermissions', CommonObj.updateBRGRPermissions);
	RolesApp.bind('UpdatePaymentGRPermission', CommonObj.updatePaymentGRPermission);	
	RolesApp.bind('UpdateSIGRPermission', CommonObj.updateSIGRPermission);	
	RolesApp.bind('UpdateReversalGRPermission', CommonObj.updateReversalGRPermission);	
	RolesApp.bind('UpdateTemplateGRPermission', CommonObj.updateTemplateGRPermission);	
	RolesApp.bind('UpdateLoansGRPermission', CommonObj.updateLoansGRPermission);	
	RolesApp.bind('UpdateCKGRPermission', CommonObj.updateCKGRPermission);	
	RolesApp.bind('UpdatePPGRPermission', CommonObj.updatePPGRPermission);	
	
	RolesApp.bind('ApplyAllGRBR', CommonObj.applyAllGRBR);
	RolesApp.bind('ApplyAllGRCK', CommonObj.applyAllGRCK);
	RolesApp.bind('ApplyAllGRPP', CommonObj.applyAllGRPP);
	RolesApp.bind('ApplyAllGRLoans', CommonObj.applyAllGRLoans);
	RolesApp.bind('ApplyAllGRPay', CommonObj.applyAllGRPay);
	RolesApp.bind('ApplyAllGRSI', CommonObj.applyAllGRSI);
	RolesApp.bind('ApplyAllGRReversal', CommonObj.applyAllGRReversal);
	RolesApp.bind('ApplyAllGRTemplate', CommonObj.applyAllGRTemplate);
	
})(jQuery);