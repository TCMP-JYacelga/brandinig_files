Ext.define('GCP.controller.SelectPopupController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.form.field.Checkbox','Ext.ux.gcp.FilterPopUpView'],
	refs : [{
				ref : 'alertView',
				selector : 'filterPopUpView[itemId=alert_view]'
			}, {
				ref : 'alertGrid',
				selector : 'filterPopUpView smartgrid[itemId=summaryGrid_alert_view]'
			}, {
				ref : 'messageTypeView',
				selector : 'filterPopUpView[itemId=messageType_view]'
			}, {
				ref : 'messageTypeGrid',
				selector : 'filterPopUpView smartgrid[itemId=summaryGrid_messageType_view]'
			}, {
				ref : 'searchField',
				selector : 'filterPopUpView[itemId=alert_view] textfield[itemId=text_alert_view]'
			}, {
				ref : 'messageSearchField',
				selector : 'filterPopUpView[itemId=messageType_view] textfield[itemId=text_messageType_view]'
			}, {
				ref : 'reportView',
				selector : 'filterPopUpView[itemId=report_view]'
			}, {
				ref : 'reportGrid',
				selector : 'filterPopUpView smartgrid[itemId=summaryGrid_report_view]'
			}, {
				ref : 'reportSearchField',
				selector : 'filterPopUpView[itemId=report_view] textfield[itemId=text_report_view]'
			}, {
				ref : 'packageView',
				selector : 'filterPopUpView[itemId=package_view]'
			}, {
				ref : 'collectionView',
				selector : 'filterPopUpView[itemId=collection_view]'
			},{
				ref : 'scmProductView',
				selector : 'scmProductSelectPopup[itemId=scmproduct_view]'
			},{
				ref : 'packageGrid',
				selector : 'filterPopUpView smartgrid[itemId=summaryGrid_package_view]'
			},{
				ref : 'collectionGrid',
				selector : 'filterPopUpView smartgrid[itemId=summaryGrid_collection_view]'
			},{
				ref : 'scmProductGrid',
				selector : 'filterPopUpView smartgrid[itemId=summaryGrid_scmproduct_view]'
			}, {
				ref : 'tradePackageGrid',
				selector : 'filterPopUpView smartgrid[itemId=summaryGrid_trade_Package_view]'
			},{
				ref : 'tradePackageSearchField',
				selector : 'filterPopUpView[itemId=summaryGrid_trade_Package_view] textfield[itemId=text_trade_Package_view]'
			}, {
				ref : 'forecastPackageGrid',
				selector : 'filterPopUpView smartgrid[itemId=summaryGrid_forecast_Package_view]'
			},{
				ref : 'forecastPackageSearchField',
				selector : 'filterPopUpView[itemId=forecast_Package_view] textfield[itemId=text_forecast_Package_view]'
			},
				 {
				ref : 'scmproductSearchField',
				selector : 'scmProductSelectPopup[itemId=scmproduct_view] textfield[itemId=text_scmproduct_view]'
			}, {
				ref : 'companyView',
				selector : 'filterPopUpView[itemId=company_view]'
			}, {
				ref : 'companyGrid',
				selector : 'filterPopUpView smartgrid[itemId=summaryGrid_company_view]'
			}, {
				ref : 'templateView',
				selector : 'filterPopUpView[itemId=template_view]'
			}, {
				ref : 'templateGrid',
				selector : 'filterPopUpView smartgrid[itemId=summaryGrid_template_view]'
			}, {
				ref : 'templateSearchField',
				selector : 'usermstselectpopup[itemId=template_view] textfield[itemId=text_template_view]'
			}, {
				ref : 'accountView',
				selector : 'filterPopUpView[itemId=account_view]'
			},
			{
				ref : 'filterAccountView',
				selector : 'filterPopUpView[itemId=account_view]'
			}
			,{
				ref : 'agreementView',
				selector : 'filterPopUpView[itemId=agreement_view]'
			},{
				ref : 'sweepAgreementView',
				selector : 'sweepAgreementSelectPopupType[itemId=sweep_view]'
			},{
				ref : 'accountGrid',
				selector : 'filterPopUpView smartgrid[itemId=summaryGrid_account_view]'
			},
			{
				ref : 'widgetGrid',
				selector : 'filterPopUpView smartgrid[itemId=summaryGrid_widget_view]'
			},{
				ref : 'agreementGrid',
				selector : 'filterPopUpView smartgrid[itemId=summaryGrid_agreement_view]'
			},{
				ref : 'sweepAgreementGrid',
				selector : 'filterPopUpView smartgrid[itemId=summaryGrid_sweep_view]'
			},{
				ref : 'notionalSearchField',
				selector : 'filterPopUpView[itemId=agreement_view] textfield[itemId=text_agreement_view]'
			},{
				ref : 'sweepSearchField',
				selector : 'filterPopUpView[itemId=sweep_view] textfield[itemId=text_sweep_view]'
			}],
	strUrl : '',
	userBrAlertMstSelectPopup : null,
	userAdminAlertMstSelectPopup : null,
	userPayAlertMstSelectPopup : null,
	userColAlertMstSelectPopup : null,
	userMessageMstSelectPopup : null,
	userBrReportMstSelectPopup : null,
	userAdminReportMstSelectPopup : null,
	userPayReportMstSelectPopup : null,
	userColReportMstSelectPopup : null,
	userPackageMstSelectPopup : null,
	userSCMProductSelectPopup : null,
	userCompanyMstSelectPopup : null,
	userTemplatesMstSelectPopup : null,
	userCategoryBRAccountPopup : null,
	notionalAccountPopup : null,
	sweepAccountPopup : null,
	userCategoryPayAccountPopup : null,
	userCategoryColAccountPopup : null,
	userCategoryPortalAccountPopup:null,
	userCategoryLMSAccountPopup : null,
	userMstSelectPopup : null,
	userLMSReportMstSelectPopup : null,
	userLMSAlertMstSelectPopup : null,
	userFSCReportMstSelectPopup : null,
	userFSCAlertMstSelectPopup : null,
	userTradePackageMstSelectPopup : null,
	userForecastPackageMstSelectPopup : null,
	userCategoryBRWidgetPopup:null,
	saveMethod:null,
	serviceUrl:null,
	cancelMethod:null,
	userLoanAlertMstSelectPopup : null,
	userLoanReportMstSelectPopup : null,
	
	userPositivePayAlertMstSelectPopup : null,
	userPositivePayReportMstSelectPopup : null,
	
	userCheckAlertMstSelectPopup : null,
	userCheckReportMstSelectPopup : null,
	
	userIncomingAchAlertMstSelectPopup : null,
	userIncomingAchReportMstSelectPopup : null,
	
	userInvestmentAlertMstSelectPopup : null,
	userInvestmentReportMstSelectPopup : null,
	userDepositAlertMstSelectPopup : null,
	userDepositReportMstSelectPopup : null,
	config : {
		Module : null
	},
	init : function() {
		var me = this;
		serviceUrl =function (popupHandler) {
		  	var strUrl="";
		  	switch (popupHandler.service) {
		  	case 'account' :
		  		strUrl = '&categoryId=' + popupHandler.userCategory + '&module='
					+ popupHandler.module ;
					break;
		  case 'widget' :
		  		strUrl = '&categoryId=' + popupHandler.userCategory + '&module='
					+ popupHandler.module ;
					break;
		  	case 'alert' :
		  		strUrl = '&categoryId=' + popupHandler.userCategory + '&module='
					+ popupHandler.module ;
					break;
		  	case 'report' :
		  		strUrl = '&categoryId=' + popupHandler.userCategory + '&module='
					+ popupHandler.module ;
		  		break;
		  	case 'package' :
		  		strUrl = '&categoryId=' + popupHandler.userCategory + '&module='
					+ popupHandler.module ;
		  		break;
		  	case 'companyId' :
		  		strUrl = '&categoryId=' + popupHandler.userCategory ;
		  		break;
		  	case 'template' :
		  		strUrl = '&categoryId=' + popupHandler.userCategory + '&module='
					+ popupHandler.module ;
		  		break;
		  	case 'messageType' :
		  		strUrl = '&categoryId=' + popupHandler.userCategory ;
		  		break;
		  	case 'notionalAgreement' :
		  		strUrl = '&$agreementType=' + agreementType;
					strUrl = strUrl + '&$sellerCode=' + seller ;
					strUrl = strUrl + '&$categoryCode=' + categoryCode;
					strUrl = strUrl + '&$corporationCode=' + corporationCode;
					strUrl = strUrl + '&$categoryId=' + userCategory;
					strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;
		  		break;
		  	case 'sweepAgreement' :
		  		strUrl = '&$agreementType=' + agreementType;
					strUrl = strUrl + '&$sellerCode=' + seller ;
					strUrl = strUrl + '&$categoryCode=' + categoryCode;
					strUrl = strUrl + '&$corporationCode=' + corporationCode;
					strUrl = strUrl + '&$categoryId=' + userCategory;
					strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;
					break;
		  	case 'scmProduct' :
		  		strUrl = '&categoryId=' + popupHandler.userCategory + '&module='
					+ popupHandler.module
		  		break;
		  	case 'tradePackage' :
		  		strUrl = '&categoryId=' + popupHandler.userCategory + '&module='
					+ popupHandler.module
		  		break;
		  	case 'forecastPackages' :
		  		strUrl = '&categoryId=' + popupHandler.userCategory + '&module='
					+ popupHandler.module ;
		  		break;
		  	}
		  	return strUrl;
		  };
		  saveMethod=function (popupHandler) {
			var popup = popupHandler;
			if (!Ext.isEmpty(popup)) {
				if (mode != "VIEW")
					{
					if (popup.itemId === 'alert_view')
						me.handleAlertClose();
					else if (popup.itemId === 'messageType_view')
						me.handleMessageTypeClose();
					else if (popup.itemId === 'report_view')
						me.handleReportClose();
					else if (popup.itemId === 'account_view')
						me.handleAccountPopupClose();
					else if (popup.itemId === 'widget_view')
						me.handleWidgetPopupClose();
					else if (popup.itemId === 'package_view')
						me.handlePackageClose();
					else if (popup.itemId === 'collection_view')
						me.handlePackageClose();
					else if (popup.itemId === 'company_view')
						me.handleCompanyClose();
					else if (popup.itemId === 'template_view')
						me.handleTemplateClose();
					else if (popup.itemId === 'scmproduct_view')
						me.handleScmProductClose();
					else if (popup.itemId === 'trade_Package_view')
						me.handleTradePackageClose();
					else if (popup.itemId === 'forecast_Package_view')
						me.handleForecastPackageClose();
					
					if (null != document
							.getElementById(popup.hiddenValuePopUpField)
							&& undefined != document
									.getElementById(popup.hiddenValuePopUpField)) {
						document
								.getElementById(popup.hiddenValuePopUpField).value = 'Y';
					}
					
					var checkValue=document.getElementById(popup.checkboxId);
					if(checkValue !=null && checkValue.getAttribute('src').indexOf('/icon_unchecked')!=-1){
				var grid = popup.down('smartgrid');
				var records = grid.selectedRecordList;
				var blnIsUnselected = records.length < grid.store
						.getTotalCount() ? true : false;
				
				if (popup.displayCount && !Ext.isEmpty(popup.fnCallback)
						&& typeof popup.fnCallback == 'function') {
					popup.fnCallback(records, blnIsUnselected);
					selectedr = [];
					
				}
				}
					
						popup.hide();
			
					}
				if (mode === "VIEW")
					 {
					popup.destroy();
				} 

				}
			};
		cancelMethod=function (popupHandler) {
			var popup = popupHandler;
			if (!Ext.isEmpty(popup)) {
				popup.destroy();
			}
			};
		GCP.getApplication().on({
					showcategoryalert : function(module) {
						me.showAlertPopup(module);
					},
					showcategorymessagetype : function() {
						me.showMessageTypePopup();
					},
					showcategoryreport : function(module) {
						me.showReportPopup(module);
					},
					fetchbraccounts : function(module) {
						me.showBRAccountPopup(module);
					},
					fetchbrwidgets : function(module) {
						me.showBRAwidgtesPopup(module);
					},
					fetchNotionalAgreements : function() {
						me.showNotionalAgreementPopup();
					},
					fetchSweepAgreements : function() {
						me.showSweepAgreementPopup();
					},
					showcategorypackages : function(module) {
						me.showPackagePopup(module);
					},
					showcategorycolpackages : function(module) {
						me.showColPackagePopup(module);
					},
					showcategoryscmproducts : function(module) {
						me.showSCMProductPopup(module);
					},
					showCategoryTradePackages : function(module){
						me.showTradePackagesPopup(module);
					},
					showCategoryForecastPackages : function(module){
						me.showForecastPackagesPopup(module);
					},
					showcompnayids : function() {
						me.showCompanyIdPopup();
					},
					showtemplates : function(module) {
						me.showTemplatesPopup(module);
					},
					fetchbralerts : function(module) {
						me.showAlertPopup(module);
					},
					fetchbrreports : function(module) {
						me.showReportPopup(module);
					},
					fetchlmsalerts : function(module) {
						me.showAlertPopup(module);
					},
					fetchlmsreports : function(module) {
						me.showReportPopup(module);
					},
					fetchfscalerts : function(module) {
						me.showAlertPopup(module);
					},
					fetchfscreports : function(module) {
						me.showReportPopup(module);
					}
					

				});
	},

	toggleCheckUncheckAllImage : function(grid, imgElmId, allSelectionFlagId,record) {
		/*var usermstselectpopup = grid.up("filterPopUpView");
		console.log(record);
		if(undefined != record && record.data['assigned'] === false && null != imgElement && undefined != imgElement){
			imgElement.src = "static/images/icons/icon_unchecked.gif";
			$('#' + allSelectionFlagId).val('N');
			usermstselectpopup.isAllAssigned = 'N';
		}
		*/
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter,
			module) {
		var me = this;
		if (!Ext.isEmpty(grid)) {
			url = grid.generateUrl(url, grid.pageSize, newPgNo, oldPgNo);
			if (me.Module != "") {
				var strUrl = url + '&categoryId=' + userCategory + '&module='
						+ me.Module;
			} else {
				var strUrl = url + '&categoryId=' + userCategory;
			}
			me.strUrl = strUrl;
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, false);
		}
	},
	showAlertPopup : function(module) {
		var me = this;
		var userMstSelectPopup = null;
		var localIsAllAssigned = $('#allAlertSelectedFlag').val();
		me.Module = module;
		
		var hiddenValueFld = '';
		var hiddenValuePopUpFld = '';
		var chkBoxId = '';
		
		switch(module){
		case '01' :
			hiddenValueFld = 'selectedRecordsForAlert';
			hiddenValuePopUpFld = 'popupAlertSelectedFlag';
			chkBoxId = 'chkAllAlertSelectedFlag';
			break;
		case '02' :
			hiddenValueFld = 'selectedRecordsForAlert';
			hiddenValuePopUpFld = 'popupAlertSelectedFlag';
			chkBoxId = 'chkAllAlertSelectedFlag';
			break;
		case '05' :
			hiddenValueFld = 'selectedRecordsForAlert';
			hiddenValuePopUpFld = 'popupAlertSelectedFlag';
			chkBoxId = 'chkAllAlertSelectedFlag';
			break;
		case '03' :
			hiddenValueFld = 'selectedRecordsForAlert';
			hiddenValuePopUpFld = 'popupAlertSelectedFlag';
			chkBoxId = 'chkAllAlertSelectedFlag';
			break;
		case '06' :
			hiddenValueFld = 'selectedRecordsForAlert';
			hiddenValuePopUpFld = 'popupAlertSelectedFlag';
			chkBoxId = 'chkAllAlertSelectedFlag';
			break;
		case '07' :
			hiddenValueFld = 'selectedRecordsForAlert';
			hiddenValuePopUpFld = 'popupAlertSelectedFlag';
			chkBoxId = 'chkAllAlertSelectedFlag';
			break;
		case '11' :
			hiddenValueFld = 'popupAlertSelectedFlag';
			hiddenValuePopUpFld = 'selectedRecordsForAlert';
			chkBoxId = 'chkAllAlertSelectedFlag';
			break;
		case '13' :
			hiddenValueFld = 'selectedRecordsForAlert';
			hiddenValuePopUpFld = 'popupAlertSelectedFlag';
			chkBoxId = 'chkAllAlertSelectedFlag';
			break;
		case '14' :
			hiddenValueFld = 'selectedRecordsForAlert';
			hiddenValuePopUpFld = 'popupAlertSelectedFlag';
			chkBoxId = 'chkAllAlertSelectedFlag';
			break;
		case '16' :
			hiddenValueFld = 'selectedRecordsForAlert';
			hiddenValuePopUpFld = 'popupAlertSelectedFlag';
			chkBoxId = 'chkAllAlertSelectedFlag';
			break;
		}
		
		
		if (module === "01") {
			userMstSelectPopup = me.userBrAlertMstSelectPopup;
		} else if (module === "02") {
			userMstSelectPopup = me.userPayAlertMstSelectPopup;
		} else if (module === "03") {
			userMstSelectPopup = me.userAdminAlertMstSelectPopup;
		}else if (module === "04") {
			userMstSelectPopup = me.userLMSAlertMstSelectPopup;
		} else if (module === "05") {
			userMstSelectPopup = me.userColAlertMstSelectPopup;
		}else if (module === "06") {
			userMstSelectPopup = me.userFSCAlertMstSelectPopup;
		}else if (module === "07") {
			userMstSelectPopup = me.userLoanAlertMstSelectPopup;
		}else if (module === "11") {
						userMstSelectPopup = me.userIncomingAchAlertMstSelectPopup;
		}else if (module === "08") {
			userMstSelectPopup = me.userInvestmentAlertMstSelectPopup;
		}
		else if (module === "13") {
			userMstSelectPopup = me.userPositivePayAlertMstSelectPopup;
		}
		else if (module === "14") {
			userMstSelectPopup = me.userCheckAlertMstSelectPopup;
		}
		else if (module === "16") {
			userMstSelectPopup = me.userDepositAlertMstSelectPopup;
		}
		if (Ext.isEmpty(userMstSelectPopup)) {
			var colModel = [{
						colId : 'subscriptionDesc',
						colDesc : 'Alert',
						colHeader : 'Alert'
					}, {
						colId : 'assignmentStatus',
						colDesc : 'Status',
						colHeader : 'Status'
					}];
			var storeModel = {
				fields : ['alert', 'isAssigned', 'clientDescription',
						'assignmentStatus', 'profileName', 'subscriptionDesc',
						'subscriptionCode', 'eventTemplateCode','identifier'],
				proxyUrl : 'services/userCategory/alerts.json',
				rootNode : 'd.details',
				totalRowsNode : 'd.__count'
			};

			userMstSelectPopup = Ext.create('Ext.ux.gcp.FilterPopUpView', {
				title :locMessages.ALERT_TITLE,
				isAllSelected : localIsAllAssigned,
				keyNode : 'subscriptionCode',
				itemId : 'alert_view',
				service : 'alert',
				checkboxId : chkBoxId,
				displayCount : false,
				cfgModel : {
				     pageSize : 5,
					storeModel : storeModel,
					columnModel : colModel
				   },
				   cfgFilterLabel: 'Alerts',
				   cfgAutoCompleterUrl:'alerts',
				   cfgUrl : 'services/userCategory/{0}.json',
				   cfgShowFilter : true,
				   paramName:'filterName',
					dataNode:'subscriptionDesc',
					rootNode : 'd.details',
					autoCompleterExtraParam:
						[{
							key:'categoryId',value: userCategory
						},{
							key:'&module',value: module
						}],
				   userMode :mode,
				   userCategory : userCategory,
				   module : module,
				   hiddenValueField : hiddenValueFld,
				   hiddenValuePopUpField : hiddenValuePopUpFld,
				   savefnCallback :saveMethod,
				   urlCallback :serviceUrl,
				   cancelfnCallback :cancelMethod
			});
			
			if (mode != "VIEW") {
				if (module === "01")
					me.userBrAlertMstSelectPopup = userMstSelectPopup;
				else if (module === "02")
					me.userPayAlertMstSelectPopup = userMstSelectPopup;
				else if (module === "03")
					me.userAdminAlertMstSelectPopup = userMstSelectPopup;
				else if (module === "04")
					me.userLMSAlertMstSelectPopup = userMstSelectPopup;
				else if (module === "05")
					me.userColAlertMstSelectPopup = userMstSelectPopup;
			else if (module === "06")
					me.userFSCAlertMstSelectPopup = userMstSelectPopup;
			else if (module === "07")
					me.userLoanAlertMstSelectPopup = userMstSelectPopup;
			else if (module === "08")
					me.userInvestmentAlertMstSelectPopup = userMstSelectPopup;		
			else if (module === "16") 
			     me.userDepositAlertMstSelectPopup = userMstSelectPopup ;
			else if (module === "13") 
			     me.userPositivePayAlertMstSelectPopup = userMstSelectPopup ;
			else if (module === "14") 
			     me.userCheckAlertMstSelectPopup = userMstSelectPopup ;
			else if (module === "11")
				me.userIncomingAchAlertMstSelectPopup = userMstSelectPopup;
							
			}
		
		} 
		userMstSelectPopup.show();
	},
	showBRAccountPopup : function(module) {
		var me = this;
		var userMstSelectPopupBRAcc = null;
		var localIsAllAssigned = $('#allbRAccountsSelectedFlag').val();

		var hiddenValueFld = '';
		var hiddenValuePopUpFld = '';
		var chkBoxId = '';
		
		switch (module) {
		case '01' :
			hiddenValueFld = 'selectedBRAccounts';
			hiddenValuePopUpFld = 'popupAccountsSelectedFlag';
			chkBoxId = 'chkAllbRAccountsSelectedFlag';
			break;
		case '02' :
			hiddenValueFld = 'selectedAccounts';
			hiddenValuePopUpFld = 'popupAccountsSelectedFlag';
			chkBoxId = 'chkAllbRAccountsSelectedFlag';
			break;
		case '05' :
			hiddenValueFld = 'selectedAccounts';
			hiddenValuePopUpFld = 'popupAccountsSelectedFlag';
			chkBoxId = 'chkAllbRAccountsSelectedFlag';
			break;
		case '19' :
			hiddenValueFld = 'selectedAccounts';
			hiddenValuePopUpFld = 'popupAccountsSelectedFlag';
			chkBoxId = 'chkAllbRAccountsSelectedFlag';
			break;
		}
		
		me.Module = module;
		if (module === "01") {
			userMstSelectPopupBRAcc = me.userCategoryBRAccountPopup;
		} else if (module === "02") {
			userMstSelectPopupBRAcc = me.userCategoryPayAccountPopup;
		}else if (module === "04") {
			userMstSelectPopupBRAcc = me.userCategoryLMSAccountPopup;
		}else if (module === "05") {
			userMstSelectPopupBRAcc = me.userCategoryColAccountPopup;
		}
		else if (module === "19") {
			userMstSelectPopupBRAcc = me.userCategoryPortalAccountPopup;
		}
		
		if (Ext.isEmpty(userMstSelectPopupBRAcc)) {
		
			var colModel = [{
						colId : 'accountNumber',
						colDesc : 'Account Number',
						colHeader : 'Account Number'
					},
					{
						colId : 'accountName',
						colDesc : 'Account Name',
						colHeader : 'Account Name'
					},		
					 {
						colId : 'assignmentStatus',
						colDesc : 'Status',
						colHeader : 'Status'
					}, {
						colId : 'clientDescription',
						colDesc : 'Company Name',
						colHeader : 'Company Name'
					}];
			var storeModel = {
				fields : ['accountNumber','accountName', 'assigned', 'clientDescription',
						'assignmentStatus', 'adminEnable', 'brEnable',
						'bankRepEnable', 'checksEnable', 'collectionEnable','incomingWireEnable',
						'paymentEnable', 'positivePayEnable',
						'subscriptionCode', 'clientCode', 'isAssigned','identifier','subsidiaries'],
				proxyUrl : 'services/userCategory/accounts.json',
				rootNode : 'd.details',
				totalRowsNode : 'd.__count'
			};
			userMstSelectPopupBRAcc = Ext.create('Ext.ux.gcp.FilterPopUpView',
					{
				title :  'Select Account',
				isAllSelected : localIsAllAssigned,
				keyNode : 'accountNumber',
				itemId : 'account_view',
				service:'account',
				checkboxId : chkBoxId,
				displayCount : false,
				cfgModel : {
				     pageSize : 5,
					storeModel : storeModel,
					columnModel : colModel
				   },
				
				   cfgFilterLabel: 'Accounts',
				   cfgAutoCompleterUrl:'accounts',
				   cfgUrl : 'services/userCategory/{0}.json',
				      paramName:'filterName',
					dataNode:'accountNumber',
					dataNode2:'accountName',
					rootNode : 'd.details',
					delimiter:'| ',
					autoCompleterExtraParam:
						[{
							key:'categoryId',value: userCategory
						},{
							key:'&module',value: module
						}],
				   cfgShowFilter : true,
				   userMode : mode,
				   userCategory : userCategory,
				   module : module,
				   hiddenValueField : hiddenValueFld,
				   hiddenValuePopUpField :hiddenValuePopUpFld,
				   savefnCallback :saveMethod,
				   urlCallback :serviceUrl,
				   cancelfnCallback :cancelMethod
			});
			
			if (mode != "VIEW") {
				if (module === "01")
					me.userCategoryBRAccountPopup = userMstSelectPopupBRAcc;
				else if (module === "02")
					me.userCategoryPayAccountPopup = userMstSelectPopupBRAcc;
				else if (module === "05")
					me.userCategoryColAccountPopup = userMstSelectPopupBRAcc;
				else if (module === "04")
					me.userCategoryLMSAccountPopup = userMstSelectPopupBRAcc;
				else if (module === "19")
					me.userCategoryPortalAccountPopup = userMstSelectPopupBRAcc;
			}
		
		} 
		userMstSelectPopupBRAcc.show();
	},
	showBRAwidgtesPopup : function(module) {
		var me = this;
		var userMstSelectPopupBRwidget = null;
		var localIsAllAssigned = $('#allbRWidgetsSelectedFlag').val();
		var hiddenValueFld = '';
		var hiddenValuePopUpFld = '';
		var chkBoxId = '';
		
		switch (module) {
		case '02' :
			hiddenValueFld = 'selectedWidgets';
			hiddenValuePopUpFld = 'popupWidgetsSelectedFlag';
			chkBoxId = 'chkAllbRWidgetsSelectedFlag';
			break;
	
		}
		
		me.Module = module;
		if (module === "02") {
		userMstSelectPopupBRwidget = me.userCategoryBRWidgetPopup;
		} 
		if (Ext.isEmpty(userMstSelectPopupBRwidget)) {
		
			var colModel = [{
						colId : 'clientName',
						colDesc : 'Company Name',
						colHeader : 'Company Name',
						width:200
					},{
						colId : 'featureDesc',
						colDesc : 'Widget Description',
						colHeader : 'Widget Description',
						width:200
					}];
			var storeModel = {
				fields : ['featureDesc','featureId','clientCode','clientName','identifier'],
				proxyUrl : 'services/userCategory/widgets.json',
				rootNode : 'd.details',
				totalRowsNode : 'd.__count'
			};
			userMstSelectPopupBRwidget = Ext.create('Ext.ux.gcp.FilterPopUpView',
					{
				title :  'Select Widget',
				isAllSelected : localIsAllAssigned,
				keyNode : 'featureId,clientCode',
				itemId : 'widget_view',
				service:'widget',
				checkboxId : chkBoxId,
				displayCount : false,
				cfgModel : {
				     pageSize : 5,
					storeModel : storeModel,
					columnModel : colModel
				   },
				
				   cfgFilterLabel: 'Widgets',
				   cfgAutoCompleterUrl:'widgets',
				   cfgUrl : 'services/userCategory/{0}.json',
				    paramName:'featureId',
					dataNode:'featureDesc',
					rootNode : 'd.details',
					autoCompleterExtraParam:
						[{
							key:'categoryId',value: userCategory
						},{
							key:'&module',value: module
						}],
				   cfgShowFilter : true,
				   userMode : mode,
				   userCategory : userCategory,
				   module : module,
				   hiddenValueField : hiddenValueFld,
				   hiddenValuePopUpField :hiddenValuePopUpFld,
				   savefnCallback :saveMethod,
				   urlCallback :serviceUrl,
				   cancelfnCallback :cancelMethod
			});
			
			if (mode != "VIEW") {
				if (module === "02")
					me.userCategoryBRWidgetPopup = userMstSelectPopupBRwidget;
				
			}
		
		} 
		userMstSelectPopupBRwidget.show();
	},
	showNotionalAgreementPopup : function() {
		var me = this;
		var userMstSelectPopup = null;
		var localIsAllAssigned = null;
		
		if( agreementType == 'NOTIONAL' )
		{
			userMstSelectPopup = me.notionalAccountPopup;
			localIsAllAssigned = $('#allNotionalSelectedFlag').val();
		}

		if (Ext.isEmpty(userMstSelectPopup)) {
			var colModel = [{
				colId : 'agreementCode',
				colDesc : 'Agreement Code',
				colHeader : 'Agreement Code',
				width : 130
			}, {
				colId : 'agreementName',
				colDesc : 'Agreement Name',
				colHeader : 'Agreement Name',
				width : 260
			}];
			
			var storeModel = {
				fields : [ 'agreementCode', 'agreementName', 'agreementRecKey', 'validFlag', 'isAssigned',
				           'categoryCode', 'corporationCode', 'sellerCode', 'identifier' ],
				proxyUrl : 'getAgreementList.srvc',
				rootNode : 'd.details',
				totalRowsNode : 'd.__count'
			};
			
			userMstSelectPopup = Ext.create('Ext.ux.gcp.FilterPopUpView', {
				title : 'Select Agreement',
				isAllSelected : localIsAllAssigned,
				keyNode : 'agreementRecKey',
				itemId : 'agreement_view',
				service : 'notionalAgreement',
				checkboxId : 'chkAllNotionalSelectedFlag',
				displayCount : false,
				cfgModel : {
				     pageSize : 5,
					storeModel : storeModel,
					columnModel : colModel
				   },
				
				   cfgFilterLabel:'Agreement',
				     cfgAutoCompleterUrl:'getAgreementList',
				   cfgUrl : '{0}.srvc',
				   	autoCompleterExtraParam:
						[{
							key:'$agreementType',value: agreementType
						},{
							key:'&$sellerCode',value: seller
						},{
							key:'&$categoryCode',value: categoryCode
						},{
							key:'&$corporationCode',value: corporationCode
						},{
							key:'&$categoryId',value: userCategory
						},{
							key:"&" + csrfTokenName ,value: csrfTokenValue
						}],
				   paramName : 'filterName',
				   	dataNode:'agreementCode',
					rootNode : 'd.details',
				   cfgShowFilter : true,
				   userMode : mode,
				   userCategory : userCategory,
				   module : '',
				   hiddenValueField : 'selectedNotionalAgreements',
				   hiddenValuePopUpField : 'popupNOTAgreementSelectedFlag',
				   savefnCallback :saveMethod,
				   urlCallback :serviceUrl,
				   cancelfnCallback :cancelMethod
			});
			
			if( agreementType == 'NOTIONAL' && mode!="VIEW")
			{
				 me.notionalAccountPopup = userMstSelectPopup;
			}
			
		} 
		userMstSelectPopup.show();
	},
	showSweepAgreementPopup : function() {
		var me = this;
		var userMstSelectPopup = null;
		var localIsAllAssigned = null;
		
		if( agreementType == 'SWEEP' )
		{
			userMstSelectPopup = me.sweepAccountPopup;
			localIsAllAssigned = $('#allSweepSelectedFlag').val();
		}

		if (Ext.isEmpty(userMstSelectPopup)) {
			var colModel = [{
				colId : 'agreementCode',
				colDesc : 'Agreement Code',
				colHeader : 'Agreement Code',
				width : 130
			}, {
				colId : 'agreementName',
				colDesc : 'Agreement Name',
				colHeader : 'Agreement Name',
				width : 260
			}];
			
			var storeModel = {
				fields : [ 'agreementCode', 'agreementName', 'agreementRecKey', 'validFlag', 'isAssigned',
				           'categoryCode', 'corporationCode', 'sellerCode', 'identifier' ],
				proxyUrl : 'getAgreementList.srvc',
				rootNode : 'd.details',
				totalRowsNode : 'd.__count'
			};		
			userMstSelectPopup = Ext.create('Ext.ux.gcp.FilterPopUpView', {
				title :'Select Sweep Agreement',
				isAllSelected : localIsAllAssigned,
				keyNode : 'agreementRecKey',
				itemId : 'sweep_view',
				service : 'sweepAgreement',
				checkboxId : 'chkAllSweepSelectedFlag',
				displayCount : false,
				cfgModel : {
				     pageSize : 5,
					storeModel : storeModel,
					columnModel : colModel
				   },
				
				   cfgFilterLabel: 'Sweep Agreement',
				    cfgAutoCompleterUrl:'getAgreementList',
				   cfgUrl : '{0}.srvc',
				   	autoCompleterExtraParam:
						[{
							key:'$agreementType',value: agreementType
						},{
							key:'&$sellerCode',value: seller
						},{
							key:'&$categoryCode',value: categoryCode
						},{
							key:'&$corporationCode',value: corporationCode
						},{
							key:'&$categoryId',value: userCategory
						},{
							key:"&" + csrfTokenName ,value: csrfTokenValue
						}],
					dataNode:'agreementCode',
					rootNode : 'd.details',
				   paramName : 'filterName',
				   cfgShowFilter : true,
				   userMode : mode,
				   userCategory : userCategory,
				   module : '04',
				   hiddenValueField : 'selectedSweepAgreements',
				   hiddenValuePopUpField : 'popupSWEAgreementSelectedFlag',
				   savefnCallback :saveMethod,
				   urlCallback :serviceUrl,
				   cancelfnCallback :cancelMethod
			});
			
			if( agreementType == 'SWEEP' && mode!="VIEW" )
			{
				me.sweepAccountPopup = userMstSelectPopup;
			}
	    	
		} 
	
		userMstSelectPopup.show();
	},
	setAllAssigned : function(userMstSelectPopupRef, isAllAssignedFlagVal) {
		var me = this;
		var smartgridRef = userMstSelectPopupRef.down('smartgrid');
		userMstSelectPopupRef.isAllAssigned=isAllAssignedFlagVal;
		
		me.updateSelectionForAll(userMstSelectPopupRef,smartgridRef,false);

	},
	fetchGridData : function(url, grid, searchField) {
		var me = this;
		if (!Ext.isEmpty(grid)) {
			url = grid.generateUrl(url, grid.pageSize, 1, 1);
			var strUrl = url + '&categoryId=' + userCategory + '&module='
					+ moduleCode + '&$filter=' + searchField;
			grid.url = strUrl;

			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, false);
		}
	},
	
	handleAgreementLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter, module)
	{
	var me = this;
	var strUrl = null;
		if (!Ext.isEmpty(grid)) {
			url = grid.generateUrl(url, grid.pageSize, newPgNo, oldPgNo);
			
			strUrl = '&$agreementType=' + agreementType;
			strUrl = strUrl + '&$sellerCode=' + seller ;
			strUrl = strUrl + '&$categoryCode=' + categoryCode;
			strUrl = strUrl + '&$corporationCode=' + corporationCode;
			strUrl = strUrl + '&$categoryId=' + userCategory;
			
			if( agreementType == 'NOTIONAL'  )
			{
				if (!Ext.isEmpty(me.getNotionalSearchField())) {
					searchField = me.getNotionalSearchField().getValue();
					if( searchField != null  && searchField!='')
					{
						document.getElementById("notionalSearchField").value = searchField;
						strUrl = strUrl + '&$agreementCode=' + searchField;
					}
					
				}
				strUrl = url + strUrl;
				strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;
				me.strUrl = strUrl;
				grid.loadGridData(strUrl, me.handleAfterGridAgreementDataLoad, false);
				
			}
			else if( agreementType == 'SWEEP' )
			{
				if (!Ext.isEmpty(me.getSweepSearchField())) {
					searchField = me.getSweepSearchField().getValue();
					if( searchField != null  && searchField!='')
					{
						document.getElementById("sweepSearchField").value = searchField;
						strUrl = strUrl + '&$agreementCode=' + searchField;
					}
				}
				strUrl = url + strUrl;
				strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;
				me.strUrl = strUrl;
				grid.loadGridData(strUrl, me.handleAfterGridSweepAgreementDataLoad, false);
				
			}
		}
	},
	showReportPopup : function(strModule) {
		var me = this;
		var userMstSelectPopup = null;
		var localIsAllAssigned = $('#allReportsSelectedFlag').val();
		me.Module = strModule;
		
		var hiddenValueFld = '';
		var hiddenValuePopUpFld = '';
		var chkBoxId = '';
		
		switch(strModule) {
		case '01' :
			hiddenValueFld = 'selectedRecordsForReport';
			hiddenValuePopUpFld ='popupReportSelectedFlag';
			chkBoxId = 'chkAllReportsSelectedFlag';
			break;
		case '02' :
			hiddenValueFld = 'selectedRecordsForReport';
			hiddenValuePopUpFld = 'popupReportSelectedFlag';
			chkBoxId = 'chkAllReportsSelectedFlag';
			break;
		case '05' :
			hiddenValueFld = 'selectedRecordsForReport';
			hiddenValuePopUpFld = 'popupReportSelectedFlag';
			chkBoxId = 'chkAllReportsSelectedFlag';
			break;
		case '03' :
			hiddenValueFld = 'selectedRecordsForReport';
			hiddenValuePopUpFld = 'popupReportSelectedFlag';
			chkBoxId = 'chkAllReportsSelectedFlag';
			break;
		case '04' :
			hiddenValueFld = 'selectedRecordsForReport';
			hiddenValuePopUpFld = 'popupReportSelectedFlag';
			chkBoxId = 'chkAllReportsSelectedFlag';
			break;
		case '06' :
			hiddenValueFld = 'selectedRecordsForReport';
			hiddenValuePopUpFld = 'popupReportSelectedFlag';
			chkBoxId = 'chkAllReportsSelectedFlag';
			break;
		case '07' :
			hiddenValueFld = 'selectedRecordsForReport';
			hiddenValuePopUpFld = 'popupReportSelectedFlag';
			chkBoxId = 'chkAllReportsSelectedFlag';
			break;
		case '11' :
			hiddenValueFld = 'selectedRecordsForReport';
			hiddenValuePopUpFld = 'popupReportSelectedFlag';
			chkBoxId = 'chkAllReportsSelectedFlag';
			break;
		case '13' :
			hiddenValueFld = 'selectedRecordsForReport';
			hiddenValuePopUpFld = 'popupReportSelectedFlag';
			chkBoxId = 'chkAllReportsSelectedFlag';
			break;
		case '14' :
			hiddenValueFld = 'selectedRecordsForReport';
			hiddenValuePopUpFld = 'popupReportSelectedFlag';
			chkBoxId = 'chkAllReportsSelectedFlag';
			break;
		case '16' :
			hiddenValueFld = 'selectedRecordsForReport';
			hiddenValuePopUpFld = 'popupReportSelectedFlag';
			chkBoxId = 'chkAllReportsSelectedFlag';
			break;
		}
		
		
		if (strModule === "01") {
			userMstSelectPopup = me.userBrReportMstSelectPopup;
		} else if (strModule === "02") {
			userMstSelectPopup = me.userPayReportMstSelectPopup;
		}else if (strModule === "05") {
			userMstSelectPopup = me.userColReportMstSelectPopup;
		}else if (strModule === "03") {
			userMstSelectPopup = me.userAdminReportMstSelectPopup;
		}else if (strModule === "04") {
			userMstSelectPopup = me.userLMSReportMstSelectPopup;
		}else if (strModule === "06") {
			userMstSelectPopup = me.userFSCReportMstSelectPopup;
		}else if (strModule === "07") {
			userMstSelectPopup = me.userLoanReportMstSelectPopup;
		}
		else if (strModule === "08") {
			userMstSelectPopup = me.userInvestmentReportMstSelectPopup;
		}
		else if (strModule === "16") {
			userMstSelectPopup = me.userDepositReportMstSelectPopup;
		}
		else if (strModule === "13") {
			userMstSelectPopup = me.userPositivePayReportMstSelectPopup;
		}
		else if (strModule === "14") {
			userMstSelectPopup = me.userCheckReportMstSelectPopup;
		}else if (strModule === "11") {
			userMstSelectPopup = me.userIncomingAchReportMstSelectPopup;
 		}

		if (Ext.isEmpty(userMstSelectPopup)) {
			var colModel = [{
						colId : 'reportName',
						colDesc : 'Report',
						colHeader : 'Report'
					}, {
						colId : 'assignmentStatus',
						colDesc : 'Status',
						colHeader : 'Status'
					}];
			var storeModel = {
				fields : ['reportId', 'reportName', 'assigned',
						'clientDescription', 'subsidiaries',
						'assignmentStatus', 'isAssigned','identifier'],
				proxyUrl : 'services/userCategory/reports.json',
				rootNode : 'd.details',
				totalRowsNode : 'd.__count'
			};
			userMstSelectPopup = Ext.create('Ext.ux.gcp.FilterPopUpView', {
				title :  'Select Report',
				isAllSelected : localIsAllAssigned,
				keyNode : 'reportId',
				itemId : 'report_view',
				service:'report',
				checkboxId : chkBoxId,
				displayCount : false,
				cfgModel : {
				     pageSize : 5,
					storeModel : storeModel,
					columnModel : colModel
				   },
				
				   cfgFilterLabel: 'Report',
				   cfgAutoCompleterUrl:'reports',
				   cfgUrl : 'services/userCategory/{0}.json',

					paramName:'filterName',
					dataNode:'reportName',
					rootNode : 'd.details',
					autoCompleterExtraParam:
						[{
							key:'categoryId',value: userCategory
						},{
							key:'&module',value: strModule
						}],
						
				   cfgShowFilter : true,
				   userMode : mode,
				   userCategory : userCategory,
				   module : strModule,
				   hiddenValueField : hiddenValueFld,
				   hiddenValuePopUpField : hiddenValuePopUpFld,
				   savefnCallback :saveMethod,
				   urlCallback :serviceUrl,
				   cancelfnCallback :cancelMethod									
			});
			
			if (mode != "VIEW") {
				if (strModule === "01") // hidden field verified
					me.userBrReportMstSelectPopup = userMstSelectPopup;
				else if (strModule === "02")
					me.userPayReportMstSelectPopup = userMstSelectPopup;
				else if (strModule === "05")
					me.userColReportMstSelectPopup = userMstSelectPopup;
				else if (strModule === "03")
					me.userAdminReportMstSelectPopup = userMstSelectPopup;
					else if (strModule === "04")
					me.userLMSReportMstSelectPopup = userMstSelectPopup;
				else if (strModule === "06")
					me.userFSCReportMstSelectPopup = userMstSelectPopup;
				else if (strModule === "07")
					me.userLoanReportMstSelectPopup = userMstSelectPopup;
				else if (strModule === "08")
					me.userInvestmentReportMstSelectPopup = userMstSelectPopup;	
				else if (strModule === "16")
					me.userDepositReportMstSelectPopup = userMstSelectPopup;
				else if (strModule === "13")
					me.userPositivePayReportMstSelectPopup = userMstSelectPopup;
				else if (strModule === "14")
					me.userCheckReportMstSelectPopup = userMstSelectPopup;
				else if (strModule === "11")
					me.userIncomingAchReportMstSelectPopup = userMstSelectPopup;
			} 
			
		} 
		userMstSelectPopup.show();
	},
	showMessageTypePopup : function() {
		var me = this;
		me.Module = "";
		var localIsAllAssigned = $('#allMessagesSelectedFlag').val();
		var module = '';
		var userMstSelectPopup = me.userMessageMstSelectPopup;
		if (Ext.isEmpty(userMstSelectPopup)) {
			var colModel = [{
						colId : 'formName',
						colDesc : 'Message Type',
						colHeader : 'Message Type'
					}, {
						colId : 'assignmentStatus',
						colDesc : 'Status',
						colHeader : 'Status'
					}];
			var storeModel = {
				fields : ['formCode', 'formName', 'isAssigned',
						'clientDescription', 'assignmentStatus', 'clientCode','subsidiaries'],
				proxyUrl : 'services/userCategory/messages.json',
				rootNode : 'd.details',
				totalRowsNode : 'd.__count'
			};
			userMstSelectPopup = Ext.create('Ext.ux.gcp.FilterPopUpView', {
				title :'Select Message Type',
				isAllSelected : localIsAllAssigned,
				keyNode : 'formCode',
				itemId : 'messageType_view',
				service : 'messageType',
				checkboxId : 'chkAllMessagesSelectedFlag',
				displayCount : false,
				cfgModel : {
				     pageSize : 5,
					storeModel : storeModel,
					columnModel : colModel
				   },
				
				   cfgFilterLabel: 'Message Types',
				     cfgAutoCompleterUrl:'messages',
				   cfgUrl : 'services/userCategory/{0}.json',
				   paramName:'filterName',
					dataNode:'formName',
					rootNode : 'd.details',
					autoCompleterExtraParam:
						[{
							key:'categoryId',value: userCategory
						},{
							key:'$skip',value: -1
						},{
							key:'$inlinecount',value: 'allpages'
						}],

				   cfgShowFilter : true,
				   userMode : mode,
				   userCategory : userCategory,
				   module : module,
				   hiddenValueField : 'selectedRecordsForMessagetype',
				   hiddenValuePopUpField :'popupMessageTypes',
				   savefnCallback :saveMethod,
				   urlCallback :serviceUrl,
				   cancelfnCallback :cancelMethod
			});
			if(mode != "VIEW" )
			me.userMessageMstSelectPopup = userMstSelectPopup;
			
		} 
		userMstSelectPopup.show();
	},
	showPackagePopup : function(module) {
		var me = this;
		me.Module = module;
		var localIsAllAssigned = $('#allPackagesSelectedFlag').val();
		/*var module = '';*/
		var userMstSelectPopup = me.userPackageMstSelectPopup;
		if (Ext.isEmpty(userMstSelectPopup)) {
			var colModel = [{
						colId : 'productDescription',
						colDesc : 'Payment Package',
						colHeader : 'Payment Package'
					}, {
						colId : 'productCategoryCode',
						colDesc : 'Product Cat Type',
						colHeader : 'Product Cat Type'
					}, {
						colId : 'assignmentStatus',
						colDesc : 'Status',
						colHeader : 'Status'
					}, {
						colId : 'clientDescription',
						colDesc : 'Company Name',
						colHeader : 'Company Name'
					}];
			var storeModel = {
				fields : ['isAssigned', 'clientDescription',
						'assignmentStatus', 'productDescription',
						'productCategoryCode', 'productCode', 'clientCode',
						'clients'],
				proxyUrl : 'services/userCategory/catPackageList.json',
				rootNode : 'd.details',
				totalRowsNode : 'd.__count'
			};
			userMstSelectPopup = Ext.create('Ext.ux.gcp.FilterPopUpView', {
				title :  'Select Package',
				isAllSelected : localIsAllAssigned,
				keyNode : 'productCode,clientCode',
				itemId : 'package_view',
				service : 'package',
				checkboxId:'chkAllPackageSelectedFlag',
				displayCount : false,
				cfgModel : {
				     pageSize : 5,
					storeModel : storeModel,
					columnModel : colModel
				   },
				
				   cfgFilterLabel:'Packages',
				   cfgAutoCompleterUrl:'catPackageList',
				   cfgUrl : 'services/userCategory/{0}.json',
				   paramName:'filterName',
					dataNode:'productDescription',
					rootNode : 'd.details',
					autoCompleterExtraParam:
						[{
							key:'categoryId',value: userCategory
						},{
							key:'&module',value: module
						}],
				
				   cfgShowFilter : true,
				   userMode : mode,
				   userCategory : userCategory,
				   module : module,
				   hiddenValueField : 'selectedPackages',
				   hiddenValuePopUpField :'popupPackageSelectedFlag',
				   savefnCallback :saveMethod,
				   urlCallback :serviceUrl,
				   cancelfnCallback :cancelMethod
			});
			if(mode != "VIEW")
				me.userPackageMstSelectPopup = userMstSelectPopup;
		}
		userMstSelectPopup.show();
	},
	showColPackagePopup : function(module) {
		var me = this;
		me.Module = module;
		var localIsAllAssigned = $('#allPackagesSelectedFlag').val();
		var userMstSelectPopup = me.userPackageMstSelectPopup;
		if (Ext.isEmpty(userMstSelectPopup)) {
			var colModel = [{
						colId : 'productDescription',
						colDesc : 'Payment Package',
						colHeader : 'Receivables Method'
					}, {
						colId : 'productCategoryCode',
						colDesc : 'Product Cat Type',
						colHeader : 'Product Cat Type'
					}, {
						colId : 'assignmentStatus',
						colDesc : 'Status',
						colHeader : 'Status'
					}, {
						colId : 'clientDescription',
						colDesc : 'Company Name',
						colHeader : 'Company Name'
					}];
			var storeModel = {
				fields : ['isAssigned', 'clientDescription',
						'assignmentStatus', 'productDescription',
						'productCategoryCode', 'productCode', 'clientCode',
						'clients'],
				proxyUrl : 'services/userCategory/catPackageList.json',
				rootNode : 'd.details',
				totalRowsNode : 'd.__count'
			};
			userMstSelectPopup = Ext.create('Ext.ux.gcp.FilterPopUpView', {
				title : 'Select Package',
				isAllSelected : localIsAllAssigned,
				keyNode : 'productCode,clientCode',
				itemId : 'collection_view',
				service : 'package',
				checkboxId:'chkAllPackageSelectedFlag',
				displayCount : false,
				cfgModel : {
				     pageSize : 5,
					storeModel : storeModel,
					columnModel : colModel
				   },
				
				   cfgFilterLabel:'Packages',
				   cfgAutoCompleterUrl:'catPackageList',
				   cfgUrl : 'services/userCategory/{0}.json',
				   paramName:'filterName',
					dataNode:'productDescription',
					rootNode : 'd.details',
					autoCompleterExtraParam:
						[{
							key:'categoryId',value: userCategory
						},{
							key:'&module',value: module
						}],
				
				   cfgShowFilter : true,

				   userMode : mode,
				   userCategory : userCategory,
				   module : module,
				   hiddenValueField : 'selectedPackages',
				   hiddenValuePopUpField :'popupPackageSelectedFlag',
				   savefnCallback :saveMethod,
				   urlCallback :serviceUrl,
				   cancelfnCallback :cancelMethod
			});
			
			if(mode != "VIEW")
				me.userPackageMstSelectPopup = userMstSelectPopup;
		} 
		userMstSelectPopup.show();
	},
	
	showTradePackagesPopup : function(module){
		var me = this;
		me.Module = module;
		var localIsAllAssigned = $('#allPackagesSelectedFlag').val();
		/*var module = '';*/
		var userMstSelectPopup = me.userTradePackageMstSelectPopup;
		if (Ext.isEmpty(userMstSelectPopup)) {
			var colModel = [{
						colId : 'productDescription',
						colDesc : 'eTrade Package',
						colHeader : 'eTrade Package'
					},{
						colId : 'clientDescription',
						colDesc : 'Company Name',
						colHeader : 'Company Name'
					},{
						colId : 'assignmentStatus',
						colDesc : 'Status',
						colHeader : 'Status'
					}];
			var storeModel = {
				fields : ['isAssigned', 'clientDescription',
						'assignmentStatus', 'productDescription',
						'productCategoryCode', 'productCode', 'clientCode',
						'clients'],
				proxyUrl : 'services/userCategory/catPackageList.json',
				rootNode : 'd.details',
				totalRowsNode : 'd.__count'
			};
			userMstSelectPopup = Ext.create('Ext.ux.gcp.FilterPopUpView', {
				title :  'Select Trade Package',
				isAllSelected : localIsAllAssigned,
				keyNode : 'productCode',
				itemId : 'trade_Package_view',
				service : 'tradePackage',
				checkboxId : 'chkAllPackageSelectedFlag',
				displayCount : false,
				cfgModel : {
				     pageSize : 5,
					storeModel : storeModel,
					columnModel : colModel
				   },
				
				   cfgFilterLabel:'Package',
				    cfgAutoCompleterUrl:'catPackageList',
				   cfgUrl : 'services/userCategory/{0}.json',
				   paramName:'filterName',
					dataNode:'productDescription',
					rootNode : 'd.details',
					autoCompleterExtraParam:
						[{
							key:'categoryId',value: userCategory
						},{
							key:'&module',value: module
						}],
				
				   cfgShowFilter : true,
				   userMode : mode,
				   userCategory : userCategory,
				   module : module,
				   hiddenValueField : 'selectedPackages',
				   hiddenValuePopUpField :'popupPackageSelectedFlag',
				   savefnCallback :saveMethod,
				   urlCallback :serviceUrl,
				   cancelfnCallback :cancelMethod
			});
			if(mode != "VIEW")
				me.userTradePackageMstSelectPopup = userMstSelectPopup;
			
		} 
		userMstSelectPopup.show();
	},
	
	showForecastPackagesPopup : function(module){
		var me = this;
		me.Module = module;
		var localIsAllAssigned = $('#allPackagesSelectedFlag').val();
		/*var module = '';*/
		var userMstSelectPopup = me.userForecastPackageMstSelectPopup;
		if (Ext.isEmpty(userMstSelectPopup)) {
			var colModel = [{
						colId : 'productDescription',
						colDesc : 'Forecast Package',
						colHeader : 'Forecast Package'
					},{
						colId : 'clientDescription',
						colDesc : 'Company Name',
						colHeader : 'Company Name'
					},{
						colId : 'assignmentStatus',
						colDesc : 'Status',
						colHeader : 'Status'
					}];
			var storeModel = {
				fields : ['isAssigned', 'clientDescription',
						'assignmentStatus', 'productDescription',
						'productCategoryCode', 'productCode', 'clientCode',
						'clients'],
				proxyUrl : 'services/userCategory/catPackageList.json',
				rootNode : 'd.details',
				totalRowsNode : 'd.__count'
			};
			userMstSelectPopup = Ext.create('Ext.ux.gcp.FilterPopUpView', {
				title :'Select Forecast Package',
				isAllSelected : localIsAllAssigned,
				keyNode : 'productCode',
				itemId : 'forecast_Package_view',
				service : 'forecastPackages',
				checkboxId : 'chkAllPackageSelectedFlag',
				displayCount : false,
				cfgModel : {
				     pageSize : 5,
					storeModel : storeModel,
					columnModel : colModel
				   },
				
				   cfgFilterLabel:'Package',
				     cfgAutoCompleterUrl:'catPackageList',
				   cfgUrl : 'services/userCategory/{0}.json',
				   paramName:'filterName',
					dataNode:'productDescription',
					rootNode : 'd.details',
					autoCompleterExtraParam:
						[{
							key:'categoryId',value: userCategory
						},{
							key:'&module',value: module
						}],
				   cfgShowFilter : true,
				   userMode : mode,
				   userCategory : userCategory,
				   module : module,
				   hiddenValueField : 'selectedPackages',
				   hiddenValuePopUpField :'popupPackageSelectedFlag',
				   savefnCallback :saveMethod,
				   urlCallback :serviceUrl,
				   cancelfnCallback :cancelMethod
			});
			if(mode != "VIEW")
			me.userForecastPackageMstSelectPopup = userMstSelectPopup;
			
		} 
		userMstSelectPopup.show();
	},
	
	showSCMProductPopup : function(module) {
		var me = this;
		me.Module = module;
		var localIsAllAssigned = $('#allSCMProductSelectedFlag').val();
		var module = '06';
		var scmProductSelectPopup = me.userSCMProductSelectPopup;
		if (Ext.isEmpty(scmProductSelectPopup)) {
			var colModel = [{
						colId : 'productDescription',
						colDesc : 'SCF Package',
						colHeader : 'SCF Package'
					}, {
						colId : 'anchorClientDescription',
						colDesc : 'Anchor Client',
						colHeader : 'Anchor Client'
					}, {
						colId : 'assignmentStatus',
						colDesc : 'Status',
						colHeader : 'Status'
					}];
			var storeModel = {
				fields : ['isAssigned', 'clientDescription',
						'assignmentStatus', 'productDescription',
						'productCategoryCode', 'productCode', 'clientCode',
						'clients' , 'recordKeyNo','mypRelClient','anchorClientDescription'],
				proxyUrl : 'services/userCategory/catPackageList.json',
				rootNode : 'd.details',
				totalRowsNode : 'd.__count'
			};

			scmProductSelectPopup = Ext.create('Ext.ux.gcp.FilterPopUpView', {
				title :'Select Product',
				isAllSelected : localIsAllAssigned,
				keyNode : 'productCode',
				itemId : 'scmproduct_view',
				service : 'scmProduct',
				checkboxId : 'chkAllSCMProductSelectedFlag',
				displayCount : false,
				cfgModel : {
				     pageSize : 5,
					storeModel : storeModel,
					columnModel : colModel
				   },
				
				   cfgFilterLabel:'Products',
				      cfgAutoCompleterUrl:'catPackageList',
				   cfgUrl : 'services/userCategory/{0}.json',
				   paramName:'filterName',
					dataNode:'productDescription',
					rootNode : 'd.details',
					autoCompleterExtraParam:
						[{
							key:'categoryId',value: userCategory
						},{
							key:'&module',value: module
						}],
				   cfgShowFilter : true,
				   userMode : mode,
				   userCategory : userCategory,
				   module : module,
				   hiddenValueField : 'selectedSCMProduct',
				   hiddenValuePopUpField :'popupSCMProductSelectedFlag',
				   savefnCallback :saveMethod,
				   urlCallback :serviceUrl,
				   cancelfnCallback :cancelMethod
			});
			if(mode != "VIEW")
			me.userSCMProductSelectPopup = scmProductSelectPopup;
		
		} 
		scmProductSelectPopup.show();
	},
	showCompanyIdPopup : function() {
		var me = this;
		me.Module = "";
		var localIsAllAssigned = $('#allCompanyIdSelectedFlag').val();
		var module = '';
		var userMstSelectPopup = me.userCompanyMstSelectPopup;
		if (Ext.isEmpty(userMstSelectPopup)) {
			var colModel = [{
						colId : 'companyName',
						colDesc : 'Company Name',
						colHeader : 'Company Name'
					}, {
						colId : 'assignmentStatus',
						colDesc : 'Status',
						colHeader : 'Status'
					}];
			var storeModel = {
				fields : ['isAssigned', 'assignmentStatus',
						'clientDescription', 'companyName', 'companyId',
						'clientCode','identifier'],
				proxyUrl : 'services/userCategory/company.json',
				rootNode : 'd.details',
				totalRowsNode : 'd.__count'
			};
			userMstSelectPopup = Ext.create('Ext.ux.gcp.FilterPopUpView', {
				title :'Select Company',
				isAllSelected : localIsAllAssigned,
				keyNode : 'companyId',
				itemId : 'company_view',
				service : 'companyId',
				checkboxId:'chkAllCompanyIdSelectedFlag',
				displayCount : false,
				cfgModel : {
				     pageSize : 5,
					storeModel : storeModel,
					columnModel : colModel
				   },
				
				   cfgFilterLabel:'Company',
				       cfgAutoCompleterUrl:'company',
				   cfgUrl : 'services/userCategory/{0}.json',
				   paramName:'filterName',
					dataNode:'companyName',
					rootNode : 'd.details',
					autoCompleterExtraParam:
						[{
							key:'categoryId',value: userCategory
						},{
							key:'&module',value: module
						}],
				

				   cfgShowFilter : true,
				   userMode : mode,
				   userCategory : userCategory,
				   module : module,
				   hiddenValueField : 'selectedCompanyIds',
				   hiddenValuePopUpField :'popupCompanyIdsSelectedFlag',
				   savefnCallback :saveMethod,
				   urlCallback :serviceUrl,
				   cancelfnCallback :cancelMethod
			});
			if(mode != "VIEW")
			me.userCompanyMstSelectPopup = userMstSelectPopup;
		} 
		userMstSelectPopup.show();
	},
	showTemplatesPopup : function(module) {
		var me = this;
		me.Module = module;
		var localIsAllAssigned = $('#allTemplatesSelectedFlag').val();
		/*module = '';*/
		var userMstSelectPopup = me.userTemplatesMstSelectPopup;
		if (Ext.isEmpty(userMstSelectPopup)) {
			var colModel = [{
						colId : 'templateName',
						colDesc : 'Template Name',
						colHeader : 'Template Name'
					}, {
						colId : 'assignmentStatus',
						colDesc : 'Status',
						colHeader : 'Status'
					}, {
						colId : 'clientDescription',
						colDesc : 'Company Name',
						colHeader : 'Company Name'
					}];
			var storeModel = {
				fields : ['isAssigned', 'templateName', 'templateReference',
						'assignmentStatus', 'companyId', 'clientDescription','clientCode','identifier'],
				proxyUrl : 'services/userCategory/templates.json',
				rootNode : 'd.details',
				totalRowsNode : 'd.__count'
			};
			userMstSelectPopup = Ext.create('Ext.ux.gcp.FilterPopUpView', {
				title :'Select Template',
				isAllSelected : localIsAllAssigned,
				keyNode : 'templateReference',
				itemId : 'template_view',
				service : 'template',
				checkboxId:'chkAllTemplatesSelectedFlag',
				displayCount : false,
				cfgModel : {
				     pageSize : 5,
					storeModel : storeModel,
					columnModel : colModel
				   },
				   cfgFilterLabel:'Templates',
				    cfgAutoCompleterUrl:'templates',
				   cfgUrl : 'services/userCategory/{0}.json',
				   paramName:'filterName',
					dataNode:'templateName',
					rootNode : 'd.details',
					autoCompleterExtraParam:
						[{
							key:'categoryId',value: userCategory
						},{
							key:'&module',value: module
						}],
				
				   cfgShowFilter : true,
				   userMode : mode,
				   userCategory : userCategory,
				   module : module,
				   hiddenValueField : 'selectedTemplates',
				   hiddenValuePopUpField :'popupTemplatesSelectedFlag',
				   savefnCallback :saveMethod,
				   urlCallback :serviceUrl,
				   cancelfnCallback :cancelMethod
			});
			if(mode != "VIEW")
			me.userTemplatesMstSelectPopup = userMstSelectPopup;

			
		} 
		userMstSelectPopup.show();
	},

	handleAfterGridDataLoad : function(grid, jsonData) {
		var me = this;
		grid.enableCheckboxColumn(false);
		var usermstselectpopup = grid.up("filterPopUpView");
		if(grid.itemId == 'summaryGrid_scmproduct_view')
		{
			usermstselectpopup = grid.up("scmProductSelectPopup");
		}
		var isAllAssigned = usermstselectpopup.isAllAssigned;
		var store = grid.getStore();
		var records = store.data;
		var keyNode = grid.keyNode;
		if (!Ext.isEmpty(records)) {
			var items = records.items;
			var assignedRecords = new Array();
			if (!Ext.isEmpty(items)) {
				for (var i = 0; i < items.length; i++) {
					var record = items[i];
					if (!Ext.isEmpty(isAllAssigned) && isAllAssigned == 'Y') 
					{
						assignedRecords.push(record);
					} 
					else if ((record.get('assigned') == true || record.get('isAssigned') == true) 
						&& (!usermstselectpopup.checkIfRecordIsDeSelected(grid,record))) 
					{
						assignedRecords.push(record);
					}
					else if(usermstselectpopup.checkIfRecordIsSelected(grid,record))
					{
						assignedRecords.push(record);
					}
				}
			}
			grid.setSelectedRecords(assignedRecords,false,true);
		}
		
		if (grid.mode == 'VIEW') {
			grid.enableCheckboxColumn(true);
		}
		else
		{
			if (!Ext.isEmpty(isAllAssigned))
			{ 
				if(isAllAssigned == 'Y')
				{
					grid.enableCheckboxColumn(true);
				}	
				else if (isAllAssigned == 'N') 
					grid.enableCheckboxColumn(false);
			} 
		}
	},
	handleAfterGridAgreementDataLoad : function(grid, jsonData) {
		var me = this;
		var usermstselectpopup = grid.up("agreementSelectPopupType");
		var isAllAssigned = usermstselectpopup.isAllAssigned;
		var store = grid.getStore();
		var records = store.data;
		var keyNode = grid.keyNode;
		if (!Ext.isEmpty(records)) {
			var items = records.items;
			var assignedRecords = new Array();
			if (!Ext.isEmpty(items)) {
				for (var i = 0; i < items.length; i++) {
					var record = items[i];
					if (!Ext.isEmpty(isAllAssigned) && isAllAssigned == 'Y') 
					{
						assignedRecords.push(record);
					} 
					else if ((record.get('assigned') == true || record.get('isAssigned') == true) 
						&& (!usermstselectpopup.checkIfRecordIsDeSelected(grid,record))) 
					{
						assignedRecords.push(record);
					}
					else if(usermstselectpopup.checkIfRecordIsSelected(grid,record))
					{
						assignedRecords.push(record);
					}
				}
			}
			//grid.getSelectionModel().deselectAll();
			grid.getSelectionModel().setLocked(false);
			//if (grid.selectedRecordList.length > 0)
			grid.getSelectionModel().select(assignedRecords);
		}
		
		if (grid.mode == 'VIEW') {
			grid.getSelectionModel().setLocked(true);
		}
	},
	handleAfterGridSweepAgreementDataLoad : function(grid, jsonData) {
		var me = this;
		var usermstselectpopup = grid.up("sweepAgreementSelectPopupType");
		var isAllAssigned = usermstselectpopup.isAllAssigned;
		var store = grid.getStore();
		var records = store.data;
		var keyNode = grid.keyNode;
		if (!Ext.isEmpty(records)) {
			var items = records.items;
			var assignedRecords = new Array();
			if (!Ext.isEmpty(items)) {
				for (var i = 0; i < items.length; i++) {
					var record = items[i];
					if (!Ext.isEmpty(isAllAssigned) && isAllAssigned == 'Y') 
					{
						assignedRecords.push(record);
					} 
					else if ((record.get('assigned') == true || record.get('isAssigned') == true) 
						&& (!usermstselectpopup.checkIfRecordIsDeSelected(grid,record))) 
					{
						assignedRecords.push(record);
					}
					else if(usermstselectpopup.checkIfRecordIsSelected(grid,record))
					{
						assignedRecords.push(record);
					}
				}
			}
			//grid.getSelectionModel().deselectAll();
			grid.getSelectionModel().setLocked(false);
			//if (grid.selectedRecordList.length > 0)
			grid.getSelectionModel().select(assignedRecords);
		}
		
		if (grid.mode == 'VIEW') {
			grid.getSelectionModel().setLocked(true);
		}
	}, 
	handleAgreementPopupClose : function(btn)
	{
		var me = this;
		var popup = btn.up('agreementSelectPopupType');
		
		if (!Ext.isEmpty(popup)) {
			if (popup.itemId === 'agreement_view')
			{
				me.handleAgreementClose();
				popup.hide();
			}
		}
	},
	
	handleSweepAgreementPopupClose : function(btn)
	{
		var me = this;
		var popup = btn.up('sweepAgreementSelectPopupType');
		
		if (!Ext.isEmpty(popup)) {
			if (popup.itemId === 'sweep_view')
			{
				me.handleSweepAgreementClose();
				popup.hide();
			}
		}
	},
	handlePopupClose : function(btn) {
		var me = this;
		var popup = btn.up('usermstselectpopup');
		if (!Ext.isEmpty(popup)) {
			if (popup.itemId === 'alert_view')
				me.handleAlertClose();
			else if (popup.itemId === 'messageType_view')
				me.handleMessageTypeClose();
			else if (popup.itemId === 'report_view')
				me.handleReportClose();
			else if (popup.itemId === 'account_view')
				me.handleAccountPopupClose();
			else if (popup.itemId === 'package_view')
				me.handlePackageClose();
			else if (popup.itemId === 'collection_view')
				me.handlePackageClose();
			else if (popup.itemId === 'company_view')
				me.handleCompanyClose();
			else if (popup.itemId === 'template_view')
				me.handleTemplateClose();
			else if (popup.itemId === 'scmproduct_view')
				me.handleScmProductClose();
			else if (popup.itemId === 'trade_Package_view')
				me.handleTradePackageClose();
			else if (popup.itemId === 'forecast_Package_view')
				me.handleForecastPackageClose();	
			if ((mode === "VIEW")
					&& (popup.itemId === 'alert_view'
							|| popup.itemId === 'report_view' )) {
				popup.destroy();
			} else {
				popup.hide();
			}
		}
	},
	handleScmProductPopupClose : function(btn){
		var me = this;
		var popup = btn.up('scmProductSelectPopup');
		if (!Ext.isEmpty(popup)) {
			if (popup.itemId === 'scmproduct_view')
				me.handleScmProductClose();
				
			if ((mode === "VIEW")
					&& (popup.itemId === 'alert_view'
							|| popup.itemId === 'report_view' )) {
				popup.destroy();
			} else {
				popup.hide();
			}
		}
	},
	handleCompanyClose : function() {
		var me = this;
		if (!Ext.isEmpty(me.getCompanyGrid())) {
			var gridRecords = me.getCompanyGrid().selectedRecordList;
			me.handleSelectedRecordsForCompany(gridRecords);
		}
	},
	handleSelectedRecordsForCompany : function(records) {
		var me = this;
		var objSelectedRecords= me.getCompanyGrid().selectedRecordList;
		var deSelectedRecord=me.getCompanyGrid().deSelectedRecordList;
		var objArray = new Array();
		var packageIds = '';
		for (var index = 0; index < objSelectedRecords.length; index++) {
			var objArrayLocal = new Array();
			var companyId = objSelectedRecords[index]['companyId'];
			var clientCode = objSelectedRecords[index]['clientCode'];
			var identifier = objSelectedRecords[index]['identifier'];
			var assigned = true;
			if(assigned != null){
					objArrayLocal.push({
						"companyId": companyId,
						"clientCode": clientCode,
						"identifier": identifier,
						"assigned": assigned
					});
			}
			objArray.push(objArrayLocal);
		}
		for (var index = 0; index < deSelectedRecord.length; index++) {
			var objArrayLocal = new Array();
			var companyId = deSelectedRecord[index]['companyId'];
			var clientCode = deSelectedRecord[index]['clientCode'];
			var identifier = deSelectedRecord[index]['identifier'];
			var assigned = false;
			if(assigned != null){
					objArrayLocal.push({
						"companyId": companyId,
						"clientCode": clientCode,
						"identifier": identifier,
						"assigned": assigned
					});
			}
			objArray.push(objArrayLocal);
		}
		if (!Ext.isEmpty(objArray)) {
			if (!Ext.isEmpty(document.getElementById('selectedCompanyIds')))
				document.getElementById('selectedCompanyIds').value = Ext.encode(objArray);			
		}
	},
	handleTemplateClose : function() {
		var me = this;
		if (!Ext.isEmpty(me.getTemplateGrid())) {
			var gridRecords = me.getTemplateGrid().store.data.items;
			if (!Ext.isEmpty(gridRecords))
				me.handleSelectedRecordsForTemplate(gridRecords);
		}
	},
	handleSelectedRecordsForTemplate : function(records) {
		var me = this;
		var objSelectedRecords= me.getTemplateGrid().selectedRecordList;
		var deSelectedRecord=me.getTemplateGrid().deSelectedRecordList;
		var objArray = new Array();
		
		for (var index = 0; index < objSelectedRecords.length; index++) {
			var objArrayTemp = new Array();			
			var templateName = objSelectedRecords[index]['templateName'];
			var templateReference = objSelectedRecords[index]['templateReference'];
			var clientCode = objSelectedRecords[index]['clientCode'];
			var identifier = objSelectedRecords[index]['identifier'];
			var assigned = true;
			objArrayTemp.push({
				"templateName" : templateName,
				"identifier" : identifier,
				"templateReference" : templateReference,
				"clientCode" : clientCode,
				"assigned" : assigned
			});
			objArray.push(objArrayTemp);
		}
		for (var index = 0; index < deSelectedRecord.length; index++) {
			var objArrayTemp = new Array();			
			var templateName = deSelectedRecord[index]['templateName'];
			var templateReference = deSelectedRecord[index]['templateReference'];
			var clientCode = deSelectedRecord[index]['clientCode'];
			var identifier = deSelectedRecord[index]['identifier'];
			var assigned = false;
			objArrayTemp.push({
				"templateName" : templateName,
				"identifier" : identifier,
				"templateReference" : templateReference,
				"clientCode" : clientCode,
				"assigned" : assigned
			});
			objArray.push(objArrayTemp);
		}
		if (!Ext.isEmpty(objArray)) {
				document.getElementById('selectedTemplates').value = Ext.encode(objArray);
		}	
	},
	handleAccountPopupClose : function() {
		var me = this;
		if (!Ext.isEmpty(me.getAccountGrid())) {
		
			var gridRecords = me.getAccountGrid().selectedRecordList;
			me.handleSelectedRecordsForAccount(gridRecords);
		}
	},
	handleWidgetPopupClose:function(){
	var me = this;
	
		if (!Ext.isEmpty(me.getWidgetGrid())) {
		    
			var gridRecords = me.getWidgetGrid().selectedRecordList;
			me.handleSelectedRecordsForWidget(gridRecords);
		}
	},
	handleAgreementClose : function() {
		var me = this;
		if (!Ext.isEmpty(me.getAgreementGrid())) {
			var gridRecords = me.getAgreementGrid().selectedRecordList;
			me.handleSelectedRecordsForAgreement(gridRecords);
		}
	},
	
	handleSweepAgreementClose : function() {
		var me = this;
		if (!Ext.isEmpty(me.getSweepAgreementGrid())) {
			var gridRecords = me.getSweepAgreementGrid().selectedRecordList;
			me.handleSelectedRecordsForSweepAgreement(gridRecords);
		}
	},
	existsRecord : function(fieldValue, fieldName, selectedRecords) {
		var found = false;
		for (var index = 0; index < selectedRecords.length; index++) {

			if (undefined != selectedRecords[index].get(fieldName)
					&& fieldValue == selectedRecords[index].get(fieldName)) {
				return true;
			}
		}
		return false;
	},
	handleSelectedRecordsForSweepAgreement : function(records) {
		var me = this;
		var usermstselectpopup = me.getSweepAgreementGrid().up("sweepAgreementSelectPopupType");
		var objSelectedRecords = usermstselectpopup.getTotalModifiedRecordList(me.getSweepAgreementGrid());
		var objArray = new Array();
		var packageIds = '';
		for (var index = 0; index < objSelectedRecords.length; index++) {
			
			var agreementRecKey = objSelectedRecords[index].data.agreementRecKey;
			var agreementCode = objSelectedRecords[index].data.agreementCode;
			var sellerCode = objSelectedRecords[index].data.sellerCode;
			var identifier = objSelectedRecords[index].data.identifier;
			
			
			var assigned = null;
			
			var isSelected = usermstselectpopup.checkIfRecordIsSelected(me.getSweepAgreementGrid(),objSelectedRecords[index]);
			var isDeSelected = usermstselectpopup.checkIfRecordIsDeSelected(me.getSweepAgreementGrid(),objSelectedRecords[index]);
			if(isSelected){
				assigned = true;
			}
			else if(isDeSelected){
				assigned = false;
			}
			if(assigned != null){
					objArray.push({
						"agreementRecKey" : agreementRecKey,
						"agreementCode" : agreementCode,
						"sellerCode" : sellerCode,
						"assigned" : assigned,
						"identifier" : identifier
						});
			}
		}
		if (!Ext.isEmpty(objArray)) {

			if (undefined != document.getElementById('selectedSweepAgreements')) {
				document.getElementById('selectedSweepAgreements').value = Ext
						.encode(objArray);
			}
		}
		if (undefined != document.getElementById('popupSWEAgreementSelectedFlag')) {
		document.getElementById('popupSWEAgreementSelectedFlag').value = "Y";
		}
		if (isDeSelected) { // CHECK AGREEMENT_TYPE
		document.getElementById('allSweepSelectedFlag').value = "N";
		var imgElement = document.getElementById('chkAllSweepSelectedFlag');
		imgElement.src = "static/images/icons/icon_unchecked.gif";
		}
	},

	
	handleSelectedRecordsForAgreement : function(records) {
		var me = this;
		var usermstselectpopup = me.getAgreementGrid().up("agreementSelectPopupType");
		var objSelectedRecords = usermstselectpopup.getTotalModifiedRecordList(me.getAgreementGrid());
		var objArray = new Array();
		var packageIds = '';
		for (var index = 0; index < objSelectedRecords.length; index++) {
			
			var agreementRecKey = objSelectedRecords[index].data.agreementRecKey;
			var agreementCode = objSelectedRecords[index].data.agreementCode;
			var sellerCode = objSelectedRecords[index].data.sellerCode;
			var identifier = objSelectedRecords[index].data.identifier;
			
			
			var assigned = null;
			
			var isSelected = usermstselectpopup.checkIfRecordIsSelected(me.getAgreementGrid(),objSelectedRecords[index]);
			var isDeSelected = usermstselectpopup.checkIfRecordIsDeSelected(me.getAgreementGrid(),objSelectedRecords[index]);
			if(isSelected){
				assigned = true;
			}
			else if(isDeSelected){
				assigned = false;
			}
			if(assigned != null){
					objArray.push({
						"agreementRecKey" : agreementRecKey,
						"agreementCode" : agreementCode,
						"sellerCode" : sellerCode,
						"assigned" : assigned,
						"identifier" : identifier
						});
			}
		}
		if (!Ext.isEmpty(objArray)) {

			if (undefined != document.getElementById('selectedNotionalAgreements')) {
				document.getElementById('selectedNotionalAgreements').value = Ext
						.encode(objArray);
			}
		}
		if (undefined != document.getElementById('popupNOTAgreementSelectedFlag')) {
		document.getElementById('popupNOTAgreementSelectedFlag').value = "Y";
		}
		if (isDeSelected) { // CHECK AGREEMENT_TYPE
		document.getElementById('allNotionalSelectedFlag').value = "N";
		var imgElement = document.getElementById('chkAllNotionalSelectedFlag');
		imgElement.src = "static/images/icons/icon_unchecked.gif";
		}
	},
	handleSelectedRecordsForAccount : function(records) {
		var me = this;
		var objSelectedRecords= me.getAccountGrid().selectedRecordList;
		var deSelectedRecord=me.getAccountGrid().deSelectedRecordList;
		var objArray = new Array();
		
		for (var index = 0; index < objSelectedRecords.length; index++) {
			var objArrayTemp = new Array();			
			var accountNumber = objSelectedRecords[index]['accountNumber'];
			var clientCode = objSelectedRecords[index]['clientCode'];
			var identifier = objSelectedRecords[index]['identifier'];
			var assigned = true;
			objArrayTemp.push({
				"accountNumber" : accountNumber,
				"identifier" : identifier,
				"clientCode" : clientCode,
				"assigned" : assigned
			});
			objArray.push(objArrayTemp);
		}
		for (var index = 0; index < deSelectedRecord.length; index++) {
			var objArrayTemp = new Array();			
			var accountNumber = deSelectedRecord[index]['accountNumber'];
			var clientCode = deSelectedRecord[index]['clientCode'];
			var identifier = deSelectedRecord[index]['identifier'];
			var assigned = false;
			objArrayTemp.push({
				"accountNumber" : accountNumber,
				"identifier" : identifier,
				"clientCode" : clientCode,
				"assigned" : assigned
			});
			objArray.push(objArrayTemp);
		}
		if (!Ext.isEmpty(objArray)) {
			if (undefined != document.getElementById('selectedBRAccounts')) {
				document.getElementById('selectedBRAccounts').value = Ext.encode(objArray);
			}
			if (undefined != document.getElementById('selectedAccounts')) {
				document.getElementById('selectedAccounts').value = Ext.encode(objArray);
			}
		}	
	},
	handleSelectedRecordsForWidget : function(records) {
		var me = this;
		var objSelectedRecords= me.getWidgetGrid().selectedRecordList;
		var deSelectedRecord=me.getWidgetGrid().deSelectedRecordList;
		var objArray = new Array();
		
		for (var index = 0; index < objSelectedRecords.length; index++) {
			var objArrayTemp = new Array();			
			var accountNumber = objSelectedRecords[index]['featureId'];
			var clientCode = objSelectedRecords[index]['clientCode'];
			var identifier = objSelectedRecords[index]['identifier'];
			var assigned = true;
			objArrayTemp.push({
				"featureId" : accountNumber,
				"identifier" : identifier,
				"clientCode" : clientCode,
				"assigned" : assigned
			});
			objArray.push(objArrayTemp);
		}
		for (var index = 0; index < deSelectedRecord.length; index++) {
			var objArrayTemp = new Array();			
			var accountNumber = deSelectedRecord[index]['featureId'];
			var clientCode = deSelectedRecord[index]['clientCode'];
			var identifier = deSelectedRecord[index]['identifier'];
			var assigned = false;
			objArrayTemp.push({
				"featureId" : accountNumber,
				"identifier" : identifier,
				"clientCode" : clientCode,
				"assigned" : assigned
			});
			objArray.push(objArrayTemp);
		}
		
		if (!Ext.isEmpty(objArray)) {
			if (undefined != document.getElementById('selectedBRAccounts')) {
				document.getElementById('selectedBRAccounts').value = Ext.encode(objArray);
			}
			if (undefined != document.getElementById('selectedWidgets')) {
				document.getElementById('selectedWidgets').value = Ext.encode(objArray);
			}
		}	
	},
	handleAlertClose : function() {
		var me = this;
		if (!Ext.isEmpty(me.getAlertGrid())) {
			var gridRecords = me.getAlertGrid().selectedRecordList;
			me.handleSelectedRecordsForAlert(gridRecords);
		}
	},
	handleMessageTypeClose : function() {
		var me = this;
		if (!Ext.isEmpty(me.getMessageTypeGrid())) {
			var gridRecords = me.getMessageTypeGrid().selectedRecordList;
			me.handleSelectedRecordsForMessagetype(gridRecords);
		}
	},
	handleSelectedRecordsForMessagetype : function(records) {
		var me = this;
		var objSelectedRecords= me.getMessageTypeGrid().selectedRecordList;
		var deSelectedRecord=me.getMessageTypeGrid().deSelectedRecordList;
		var objArray = new Array();
		var packageIds = '';
		for (var index = 0; index < objSelectedRecords.length; index++) {
			var objArrayLocal = new Array();
			var formCode = objSelectedRecords[index]['formCode'];
			var formName = objSelectedRecords[index]['formName'];
			var clientCode = objSelectedRecords[index]['clientCode'];
			var subsidiaries = objSelectedRecords[index]['subsidiaries'];
			var assigned = true;
					objArrayLocal.push({
						"formCode": formCode,
						"formName": formName,
						"clientCode": clientCode,
						"subsidiaries": subsidiaries,
						"assigned": assigned
					});
			objArray.push(objArrayLocal);
		}
		for (var index = 0; index < deSelectedRecord.length; index++) {
			var objArrayLocal = new Array();
			var formCode = deSelectedRecord[index]['formCode'];
			var formName = deSelectedRecord[index]['formName'];
			var clientCode = deSelectedRecord[index]['clientCode'];
			var subsidiaries = deSelectedRecord[index]['subsidiaries'];
			var assigned = false;
					objArrayLocal.push({
						"formCode": formCode,
						"formName": formName,
						"clientCode": clientCode,
						"subsidiaries": subsidiaries,
						"assigned": assigned
					});
			objArray.push(objArrayLocal);
		}
		if (!Ext.isEmpty(objArray)) {
			if (!Ext.isEmpty(document
					.getElementById('selectedRecordsForMessagetype')))
				document.getElementById('selectedRecordsForMessagetype').value = Ext
						.encode(objArray);
			
		}
	
		},
	handleReportClose : function() {
		var me = this;
		if (!Ext.isEmpty(me.getReportGrid())) {
			me.handleSelectedRecordsForReport();
		}
	},
	updateSelectionForAll:function(usermstselectpopupRef,grid,onLoadFlag){
				var me = this;
				var selectionModel = grid.getSelectionModel();
				if (selectionModel && !onLoadFlag)
				{
					var totalRec = usermstselectpopupRef.getTotalModifiedRecordList(grid);
					if(usermstselectpopupRef.isAllAssigned=='Y')
					{
						grid.selectAllRecords(true);
						grid.enableCheckboxColumn(true);
					}
					else if(usermstselectpopupRef.isAllAssigned=='N')
					{
						grid.enableCheckboxColumn(false);
						var isPrevAssigned = usermstselectpopupRef.isPrevAllAssigned;
						if(totalRec.length>0 || selectionModel.selected.length>=0)
						{
							if(isPrevAssigned=='Y'){
								grid.refreshData();
							}
							else
							{
								grid.setSelectedRecords(grid.getSelectedRecords(),false,true);
							}
						}
						
					}
				}
				
				if(usermstselectpopupRef.isAllAssigned=='Y')
					{
						usermstselectpopupRef.isPrevAllAssigned='Y';
					}
				else if(usermstselectpopupRef.isAllAssigned=='N')
					{	
						usermstselectpopupRef.isPrevAllAssigned='N';
					}
			},
	handlePackageClose : function() {
		var me = this;
		if (!Ext.isEmpty(me.getPackageGrid())) {
			var gridRecords = me.getPackageGrid().selectedRecordList;
			me.handleSelectedRecordsForPackage(gridRecords);
		}
		else if (!Ext.isEmpty(me.getCollectionGrid())) 
		{
			var gridRecords = me.getCollectionGrid().selectedRecordList;
			me.handleSelectedRecordsForPackage(gridRecords);
		}
	},
	handleScmProductClose : function() {
		var me = this;
		if (!Ext.isEmpty(me.getScmProductGrid())) {
			var gridRecords = me.getScmProductGrid().selectedRecordList;
			me.handleSelectedRecordsForScmProduct(gridRecords);
		}
	},
	
	handleTradePackageClose : function(){
		var me = this;
		if (!Ext.isEmpty(me.getTradePackageGrid())) {
			var gridRecords = me.getTradePackageGrid().selectedRecordList;
			me.handleSelectedRecordsForTradePackage(gridRecords);
		}
	},
	handleForecastPackageClose : function(){
		var me = this;
		if (!Ext.isEmpty(me.getForecastPackageGrid())) {
			var gridRecords = me.getForecastPackageGrid().selectedRecordList;
			me.handleSelectedRecordsForForecastPackage(gridRecords);
		}
	},
	handleSelectedRecordsForPackage : function(records) {
		var me = this;
		var grid;
		if(!Ext.isEmpty(me.getPackageGrid()))
		{
			grid=me.getPackageGrid();			
		}
		else if (!Ext.isEmpty(me.getCollectionGrid()))
		{
			grid=me.getCollectionGrid();
		}
			
		var objSelectedRecords= grid.selectedRecordList;
		var deSelectedRecord=grid.deSelectedRecordList;
		var objArray = new Array();
		
		for (var index = 0; index < objSelectedRecords.length; index++) {
			var objArrayTemp = new Array();			
			var productCategoryCode = objSelectedRecords[index]['productCategoryCode'];
			var productCode = objSelectedRecords[index]['productCode'];
			var subsidiaries = objSelectedRecords[index]['clients'];
			var clientCode = objSelectedRecords[index]['clientCode'];
			var assigned = true;
			objArrayTemp.push({
				"productCategoryCode" : productCategoryCode,
				"productCode" : productCode,
				"clientCode" : clientCode,
				"assigned" : assigned,
				"subsidiaries" : subsidiaries
			});
			objArray.push(objArrayTemp);
		}
		for (var index = 0; index < deSelectedRecord.length; index++) {
			var objArrayTemp = new Array();			
			var productCategoryCode = deSelectedRecord[index]['productCategoryCode'];
			var productCode = deSelectedRecord[index]['productCode'];
			var subsidiaries = deSelectedRecord[index]['clients'];
			var clientCode = deSelectedRecord[index]['clientCode'];
			var assigned = false;
			objArrayTemp.push({
				"productCategoryCode" : productCategoryCode,
				"productCode" : productCode,
				"clientCode" : clientCode,
				"assigned" : assigned,
				"subsidiaries" : subsidiaries
			});
			objArray.push(objArrayTemp);
		}
		if (!Ext.isEmpty(objArray)) {
			document.getElementById('selectedPackages').value = Ext.encode(objArray);
		}	
	},
	handleSelectedRecordsForScmProduct : function(records) {
		var me = this;
		var objSelectedRecords= me.getScmProductGrid().selectedRecordList;
		var deSelectedRecord=me.getScmProductGrid().deSelectedRecordList;
		var objArray = new Array();
		
		for (var index = 0; index < objSelectedRecords.length; index++) {
			var objArrayTemp = new Array();			
			var productCategoryCode = objSelectedRecords[index]['productCategoryCode'];
			var productCode = objSelectedRecords[index]['productCode'];
			var subsidiaries = objSelectedRecords[index]['clients'];
			var clientCode = objSelectedRecords[index]['clientCode'];
			var recordKeyNo = objSelectedRecords[index]['recordKeyNo'];
			var mypRelClient =  objSelectedRecords[index]['mypRelClient'];
			var assigned = true;
			objArrayTemp.push({
				"productCategoryCode" : productCategoryCode,
				"productCode" : productCode,
				"clientCode" : clientCode,
				"recordKeyNo" : recordKeyNo,
				"mypRelClient" : mypRelClient,
				"assigned" : assigned,
				"subsidiaries" : subsidiaries
			});
			objArray.push(objArrayTemp);
		}
		for (var index = 0; index < deSelectedRecord.length; index++) {
			var objArrayTemp = new Array();
			var productCategoryCode = deSelectedRecord[index]['productCategoryCode'];
			var productCode = deSelectedRecord[index]['productCode'];
			var subsidiaries = deSelectedRecord[index]['clients'];
			var clientCode = deSelectedRecord[index]['clientCode'];
			var recordKeyNo = deSelectedRecord[index]['recordKeyNo'];
			var mypRelClient =  deSelectedRecord[index]['mypRelClient'];
			var assigned = false;
			objArrayTemp.push({
				"productCategoryCode" : productCategoryCode,
				"productCode" : productCode,
				"clientCode" : clientCode,
				"recordKeyNo" : recordKeyNo,
				"mypRelClient" : mypRelClient,
				"assigned" : assigned,
				"subsidiaries" : subsidiaries
			});
			objArray.push(objArrayTemp);
		}
		if (!Ext.isEmpty(objArray)) {
			document.getElementById('selectedSCMProduct').value = Ext.encode(objArray);
		}	
	},
	handleSelectedRecordsForTradePackage : function(records){
		var me = this;
		var objSelectedRecords= me.getTradePackageGrid().selectedRecordList;
		var deSelectedRecord=me.getTradePackageGrid().deSelectedRecordList;
		var objArray = new Array();
		
		for (var index = 0; index < objSelectedRecords.length; index++) {
			var objArrayTemp = new Array();
			var productCategoryCode = objSelectedRecords[index]['productCategoryCode'];
			var productCode = objSelectedRecords[index]['productCode'];
			var subsidiaries = objSelectedRecords[index]['clients'];
			var clientCode = objSelectedRecords[index]['clientCode'];
			var assigned = true;
			objArrayTemp.push({
				"productCategoryCode" : productCategoryCode,
				"productCode" : productCode,
				"clientCode" : clientCode,
				"assigned" : assigned,
				"subsidiaries" : subsidiaries
			});
			objArray.push(objArrayTemp);	
		}
		for (var index = 0; index < deSelectedRecord.length; index++) {
			var objArrayTemp = new Array();
			var productCategoryCode = deSelectedRecord[index]['productCategoryCode'];
			var productCode = deSelectedRecord[index]['productCode'];
			var subsidiaries = deSelectedRecord[index]['clients'];
			var clientCode = deSelectedRecord[index]['clientCode'];
			var assigned = false;
			objArrayTemp.push({
				"productCategoryCode" : productCategoryCode,
				"productCode" : productCode,
				"clientCode" : clientCode,
				"assigned" : assigned,
				"subsidiaries" : subsidiaries
			});
			objArray.push(objArrayTemp);	
		}
		if (!Ext.isEmpty(objArray)) {
			document.getElementById('selectedPackages').value = Ext.encode(objArray);
		}	
	
	},
		handleSelectedRecordsForForecastPackage : function(records){			
			var me = this;
			var objSelectedRecords= me.getForecastPackageGrid().selectedRecordList;
			var deSelectedRecord=me.getForecastPackageGrid().deSelectedRecordList;
			var objArray = new Array();
			
			for (var index = 0; index < objSelectedRecords.length; index++) {
				var objArrayTemp = new Array();
				var productCategoryCode = objSelectedRecords[index]['productCategoryCode'];
				var productCode = objSelectedRecords[index]['productCode'];
				var subsidiaries = objSelectedRecords[index]['clients'];
				var clientCode = objSelectedRecords[index]['clientCode'];
				var assigned = true;
				
				objArrayTemp.push({
							"productCategoryCode" : productCategoryCode,
							"productCode" : productCode,
							"clientCode" : clientCode,
							"assigned" : assigned,
							"subsidiaries" : subsidiaries
						});
				
				objArray.push(objArrayTemp);				
			}
			
			for (var index = 0; index < deSelectedRecord.length; index++) {
				var objArrayTemp = new Array();
				var productCategoryCode = deSelectedRecord[index]['productCategoryCode'];
				var productCode = deSelectedRecord[index]['productCode'];
				var subsidiaries = deSelectedRecord[index]['clients'];
				var clientCode = deSelectedRecord[index]['clientCode'];
				var assigned = false;
				
				objArrayTemp.push({
							"productCategoryCode" : productCategoryCode,
							"productCode" : productCode,
							"clientCode" : clientCode,
							"assigned" : assigned,
							"subsidiaries" : subsidiaries
						});
				
				objArray.push(objArrayTemp);				
			}
		if (!Ext.isEmpty(objArray)) {
			document.getElementById('selectedPackages').value = Ext.encode(objArray);
		}	
	},
	handleSelectedRecordsForReport : function(records) {
		var me = this;
		var objSelectedRecords= me.getReportGrid().selectedRecordList;
		var deSelectedRecord=me.getReportGrid().deSelectedRecordList;
		var objArray = new Array();
		
		for (var index = 0; index < objSelectedRecords.length; index++) {
			var objArrayTemp = new Array();
			var reportCode = objSelectedRecords[index]['reportId'];
			var reportName = objSelectedRecords[index]['reportName'];
			var subsidiaries = objSelectedRecords[index]['subsidiaries'];
			var identifier = objSelectedRecords[index]['identifier'];
			var assigned = true;

					objArrayTemp.push({
						"reportCode" : reportCode,
						"reportName" : reportName,
						"subsidiaries" : subsidiaries,
						"assigned" : assigned,
						"identifier" : identifier
					});
			objArray.push(objArrayTemp);		

		}
		for (var index = 0; index < deSelectedRecord.length; index++) {
			var objArrayTemp = new Array();
			var reportCode = deSelectedRecord[index]['reportId'];
			var reportName = deSelectedRecord[index]['reportName'];
			var subsidiaries = deSelectedRecord[index]['subsidiaries'];
			var identifier = deSelectedRecord[index]['identifier'];
			var assigned = false;

					objArrayTemp.push({
						"reportCode" : reportCode,
						"reportName" : reportName,
						"subsidiaries" : subsidiaries,
						"assigned" : assigned,
						"identifier" : identifier
					});
			objArray.push(objArrayTemp);		

		}
		if (!Ext.isEmpty(objArray)) {
			
			document.getElementById('selectedRecordsForReport').value = Ext
					.encode(objArray);
		
			}	
	},
	
	handleSelectedRecordsForAlert : function(records) {
		var me = this;


		var objSelectedRecords= me.getAlertGrid().selectedRecordList;
		var deSelectedRecord=me.getAlertGrid().deSelectedRecordList;
		var objArray = new Array();
		var packageIds = '';
		for (var index = 0; index < objSelectedRecords.length; index++) {
			var objArrayLocal = new Array();
			var subscriptionCode = objSelectedRecords[index]['subscriptionCode'];
			var templateCode = objSelectedRecords[index]['eventTemplateCode'];
			var subsidiaries = objSelectedRecords[index]['subsidiaries'];
			var identifier = objSelectedRecords[index]['identifier'];
			var assigned = true;
					objArrayLocal.push({
						"subscriptionCode": subscriptionCode,
						"templateCode": templateCode,
						"subsidiaries": subsidiaries,
						"assigned": assigned,
						"identifier": identifier
					});
			
			objArray.push(objArrayLocal);			
		}
		for (var index = 0; index < deSelectedRecord.length; index++) {
			var objArrayLocal = new Array();
			var subscriptionCode = deSelectedRecord[index]['subscriptionCode'];
			var templateCode = deSelectedRecord[index]['eventTemplateCode'];
			var subsidiaries = deSelectedRecord[index]['subsidiaries'];
			var identifier = deSelectedRecord[index]['identifier'];
			var assigned = false;
					objArrayLocal.push({
						"subscriptionCode": subscriptionCode,
						"templateCode": templateCode,
						"subsidiaries": subsidiaries,
						"assigned": assigned,
						"identifier": identifier
					});
			
			objArray.push(objArrayLocal);			
		}
		
		if (!Ext.isEmpty(objArray)) {
			document.getElementById('selectedRecordsForAlert').value = Ext
			.encode(objArray);
		}		
	}
	
});
