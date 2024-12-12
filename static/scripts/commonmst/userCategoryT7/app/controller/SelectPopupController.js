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
			},{
				ref : 'accountGridEst',
				selector : 'filterPopUpView smartgrid[itemId=summaryGrid_estaccount_view]'
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
			},
			{
				ref : 'widgetGrid',
				selector : 'filterPopUpView smartgrid[itemId=summaryGrid_widget_view]'
			}			
			],
	strUrl : '',
	saveMethod:null,
	serviceUrl:null,
	cancelMethod:null,
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
	userCategoryPortalEstAccountPopup:null,
	userCategoryPositivePayAccountPopup:null,
	userCategoryChecksAccountPopup:null,
	userCategoryDepositViewAccountPopup:null,
	userCategoryLoanAccountPopup:null,
	userCategoryLMSAccountPopup : null,
	userMstSelectPopup : null,
	userLMSReportMstSelectPopup : null,
	userLMSAlertMstSelectPopup : null,
	userFSCReportMstSelectPopup : null,
	userFSCAlertMstSelectPopup : null,
	userTradePackageMstSelectPopup : null,
	userForecastPackageMstSelectPopup : null,
	userLoanAlertMstSelectPopup : null,
	userLoanReportMstSelectPopup : null,
	userInvestmentAlertMstSelectPopup : null,
	userInvestmentReportMstSelectPopup : null,
	userDepositAlertMstSelectPopup : null,
	userDepositReportMstSelectPopup : null,
	userCategoryWidgetPopup:null,
	userCategoryBRWidgetPopup : null,
	userCategoryPayWidgetPopup : null,
	userCategoryAdminWidgetPopup : null,
	userCategoryDepositViewWidgetPopup:null,
	userCategoryLoanViewWidgetPopup:null,
	userCategoryPositiveViewWidgetPopup:null,
	userCategoryCheckViewWidgetPopup:null,
	userCategoryLiquidityViewWidgetPopup:null,
	userCategoryCollectionViewWidgetPopup:null,
	userCategoryFscViewWidgetPopup:null,
	userCategoryTradeViewWidgetPopup:null,
	
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
			 case 'widget' :
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
					else if (popup.itemId === 'estaccount_view')
						{
							//me.accountGrid = me.getAccountGridEst();
							me.handleAccountPopupClose();
						}
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
					else if (popup.itemId === 'widget_view')
						me.handleWidgetPopupClose();
					else if (popup.itemId === 'agreement_view')
						me.handleAgreementClose();
					else if (popup.itemId === 'sweep_view')
						me.handleSweepAgreementClose();
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
					fetchestaccounts : function(module) {
						me.showEstAccountPopup(module);
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
					},
					fetchbrwidgets : function(module) {
						me.showWidgtesPopup(module);
					}

				});
		me.control({
			
		})
	},

	toggleCheckUncheckAllImage : function(grid, imgElmId, allSelectionFlagId,record) {
		/*var usermstselectpopup = grid.up("usermstselectpopup");
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
			chkBoxId = 'chkallAlertSelectedFlag';
			break;
		case '02' :
			hiddenValueFld = 'selectedRecordsForAlert';
			hiddenValuePopUpFld = 'popupAlertSelectedFlag';
			chkBoxId = 'chkallAlertSelectedFlag';
			break;
		case '05' :
			hiddenValueFld = 'selectedRecordsForAlert';
			hiddenValuePopUpFld = 'popupAlertSelectedFlag';
			chkBoxId = 'chkallAlertSelectedFlag';
			break;
	 case '06' :
			hiddenValueFld = 'selectedRecordsForAlert';
			hiddenValuePopUpFld = 'popupAlertSelectedFlag';
			chkBoxId = 'chkallAlertSelectedFlag';
			break;
		case '03' :
			hiddenValueFld = 'selectedRecordsForAlert';
			hiddenValuePopUpFld = 'popupAlertSelectedFlag';
			chkBoxId = 'chkallAlertSelectedFlag';
			break;
		case '06' :
			hiddenValueFld = 'selectedRecordsForAlert';
			hiddenValuePopUpFld = 'popupAlertSelectedFlag';
			chkBoxId = 'chkAllAlertSelectedFlag';
			break;
		case '07' :
			hiddenValueFld = 'selectedRecordsForAlert';
			hiddenValuePopUpFld = 'popupAlertSelectedFlag';
			chkBoxId = 'chkallAlertSelectedFlag';
			break;
		case '11' :
			hiddenValueFld = 'selectedRecordsForAlert';
			hiddenValuePopUpFld = 'popupAlertSelectedFlag';
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
			chkBoxId = 'chkallAlertSelectedFlag';
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
						colHeader : getLabel('alert','Alert'),
						sortable : true,
						width : 275
						
					}, {
						colId : 'assignmentStatus',
						colDesc : 'Status',
						colHeader : getLabel('status','Status'),
						sortable : false,
						width : 275
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
				title :getLabel("selectAlert","Select Alert"),
				isAllSelected : localIsAllAssigned,
				keyNode : 'subscriptionCode',
				itemId : 'alert_view',
				service : 'alert',
				checkboxId : chkBoxId,
				cls:'xn-popup',
				resizable : false,
				draggable : false,
				autoHeight : false,
				//y : 280,
				width : 735,
				//maxWidth : 735,
				minHeight : 156,
				maxHeight : 550,
				displayCount : false,
				cfgModel : {
				     pageSize : 5,
					storeModel : storeModel,
					columnModel : colModel
				   },
				   //cfgFilterLabel: 'Alerts',
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
							key:'module',value: module
						}],
				   autoCompleterEmptyText : getLabel('searchByAlert','Search by Alert'),
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
		userMstSelectPopup.center();
		var filterContainer = userMstSelectPopup.down('container[itemId="filterContainer"] AutoCompleter');
    	 filterContainer.focus();
	},
 showWidgtesPopup : function(module) {
		var me = this;
		var userMstSelectPopupBRwidget = null;
		var localIsAllAssigned;
		var hiddenValueFld = '';
		var hiddenValuePopUpFld = '';
		var chkBoxId = '';
		
		switch (module) {
		case '02' :
			hiddenValueFld = 'selectedWidgets';
			hiddenValuePopUpFld = 'popupWidgetsSelectedFlag';
			chkBoxId = 'chkAllbRWidgetsSelectedFlag';
			localIsAllAssigned = $('#allbRWidgetsSelectedFlag').val();
			break;
		case '01' :
			hiddenValueFld = 'selectedWidgets';
			hiddenValuePopUpFld = 'popupWidgetsSelectedFlag';
			chkBoxId = 'chkAllbalRWidgetsSelectedFlag';
			localIsAllAssigned = $('#chkAllbalRWidgetsSelectedFlag').val();
			break;
		case '03' :
			hiddenValueFld = 'selectedWidgets';
			hiddenValuePopUpFld = 'popupWidgetsSelectedFlag';
			chkBoxId = 'chkAllAdminWidgetsSelectedFlag';
			localIsAllAssigned = $('#chkAllAdminWidgetsSelectedFlag').val();
			break;
		case '16' :
			hiddenValueFld = 'selectedWidgets';
			hiddenValuePopUpFld = 'popupWidgetsSelectedFlag';
			chkBoxId = 'chkAllDepositWidgetsSelectedFlag';
			localIsAllAssigned = $('#chkAllDepositWidgetsSelectedFlag').val();
			break;
		case '07' :
			hiddenValueFld = 'selectedWidgets';
			hiddenValuePopUpFld = 'popupWidgetsSelectedFlag';
			chkBoxId = 'chkAllloanWidgetsSelectedFlag';
			localIsAllAssigned = $('#chkAllloanWidgetsSelectedFlag').val();
			break;
			
		case '13' :
			hiddenValueFld = 'selectedWidgets';
			hiddenValuePopUpFld = 'popupWidgetsSelectedFlag';
			chkBoxId = 'chkAllPositiveWidgetsSelectedFlag';
			localIsAllAssigned = $('#chkAllPositiveWidgetsSelectedFlag').val();
			break;
	  case '14' :
			hiddenValueFld = 'selectedWidgets';
			hiddenValuePopUpFld = 'popupWidgetsSelectedFlag';
			chkBoxId = 'chkAllCheckWidgetsSelectedFlag';
			localIsAllAssigned = $('#chkAllCheckWidgetsSelectedFlag').val();
			break;
	 case '04' :
			hiddenValueFld = 'selectedWidgets';
			hiddenValuePopUpFld = 'popupWidgetsSelectedFlag';
			chkBoxId = 'chkAllLiquidityWidgetsSelectedFlag';
			localIsAllAssigned = $('#chkAllLiquidityWidgetsSelectedFlag').val();
			break;
	 case '05' :
			hiddenValueFld = 'selectedWidgets';
			hiddenValuePopUpFld = 'popupWidgetsSelectedFlag';
			chkBoxId = 'chkAllbRWidgetsSelectedFlag';
			localIsAllAssigned = $('#allbRWidgetsSelectedFlag').val();
			break;
	case '06' :
			hiddenValueFld = 'selectedWidgets';
			hiddenValuePopUpFld = 'popupWidgetsSelectedFlag';
			chkBoxId = 'chkAllFscWidgetsSelectedFlag';
			localIsAllAssigned = $('#allFscWidgetsSelectedFlag').val();
			break;
	case '09' :
			hiddenValueFld = 'selectedWidgets';
			hiddenValuePopUpFld = 'popupWidgetsSelectedFlag';
			chkBoxId = 'chkAllTradeWidgetsSelectedFlag';
			localIsAllAssigned = $('#allTradeWidgetsSelectedFlag').val();
			break;
   case '10' :
			hiddenValueFld = 'selectedWidgets';
			hiddenValuePopUpFld = 'popupWidgetsSelectedFlag';
			chkBoxId = 'chkAllForecastWidgetsSelectedFlag';
			localIsAllAssigned = $('#allForecastWidgetsSelectedFlag').val();
			break;
		}
		
		me.Module = module;
		if (module === "02") 
		userMstSelectPopupWidget = me.userCategoryPayWidgetPopup;
		else if (module === '01')
		userMstSelectPopupWidget = me.userCategoryBRWidgetPopup;
		else if (module === '03')
		userMstSelectPopupWidget = me.userCategoryAdminWidgetPopup;
	   else if (module === '16')
		userMstSelectPopupWidget = me.userCategoryDepositViewWidgetPopup;
		else if (module === '07')
		userMstSelectPopupWidget = me.userCategoryLoanViewWidgetPopup;
		else if (module === '14')
		userMstSelectPopupWidget = me.userCategoryCheckViewWidgetPopup;
		else if (module === '13')
		userMstSelectPopupWidget = me.userCategoryPositiveViewWidgetPopup;
		else if (module === '04')
		userMstSelectPopupWidget = me.userCategoryLiquidityViewWidgetPopup;
		else if (module === '05')
		userMstSelectPopupWidget = me.userCategoryCollectionViewWidgetPopup;
		else if (module === '06')
		userMstSelectPopupWidget = me.userCategoryFscViewWidgetPopup;
		else if (module === '09')
		userMstSelectPopupWidget = me.userCategoryTradeViewWidgetPopup;
		else if (module === '10')
		userMstSelectPopupWidget = me.userCategoryForcastViewWidgetPopup;
		
		if (Ext.isEmpty(userMstSelectPopupWidget)) {
		
			var colModel = [{
				colId : 'featureDesc',
				colDesc : 'Widget Description',
				colHeader : getLabel('widgetDesc','Widget Description'),
				sortable : true,
				width : 275
			}, {
				colId : 'assignmentStatus',
				colDesc : 'Status',
				colHeader : getLabel('status','Status'),
				sortable : false,
				width:275
			}];
			var storeModel = {
				fields : ['featureDesc','featureId','clientName','identifier','corporationCode','assignmentStatus'],
				proxyUrl : 'services/userCategory/widgets.json',
				rootNode : 'd.details',
				totalRowsNode : 'd.__count'
			};
			userMstSelectPopupWidget = Ext.create('Ext.ux.gcp.FilterPopUpView',
					{
				title :  getLabel('selectWidget','Select Widget'),
				isAllSelected : localIsAllAssigned,
				keyNode : 'featureId,corporationCode',
				itemId : 'widget_view',
				service:'widget',
				checkboxId : chkBoxId,
				displayCount : false,
				cls:'xn-popup',
				resizable : false,
				draggable : false,
				autoHeight : false,
				//y : 280,
				width : 735,
				//maxWidth : 735,
				minHeight : 156,
				maxHeight : 550,
				cfgModel : {
				     pageSize : 5,
					storeModel : storeModel,
					columnModel : colModel
				   },
				
				   //cfgFilterLabel: 'Widgets',
				   cfgAutoCompleterUrl:'widgets',
				   autoCompleterEmptyText : getLabel('searchByWidget','Search by Widget'),
				   cfgUrl : 'services/userCategory/{0}.json',
				    paramName:'featureId',
					dataNode:'featureDesc',
					rootNode : 'd.details',
					autoCompleterExtraParam:
						[{
							key:'categoryId',value: userCategory
						},{
							key:'module',value: module
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
					me.userCategoryBRWidgetPopup = userMstSelectPopupWidget;
				if (module === "03")	
					me.userCategoryAdminWidgetPopup = userMstSelectPopupWidget;
				if (module === "02")
					me.userCategoryPayWidgetPopup = userMstSelectPopupWidget;
				if (module === "16")
					me.userCategoryDepositViewWidgetPopup = userMstSelectPopupWidget;
				if (module === "07")
					me.userCategoryLoanViewWidgetPopup = userMstSelectPopupWidget;
				if (module === "13")
				 	me.userCategoryPositiveViewWidgetPopup = userMstSelectPopupWidget;
				 if (module === "14")
				 	me.userCategoryCheckViewWidgetPopup = userMstSelectPopupWidget;
				if (module === "04")
				 	me.userCategoryLiquidityViewWidgetPopup = userMstSelectPopupWidget;
				 if (module === "05")
				 	me.userCategoryCollectionViewWidgetPopup = userMstSelectPopupWidget;
				 if (module === "06")
				 	me.userCategoryFscViewWidgetPopup = userMstSelectPopupWidget;
				 if (module === "09")
				 	me.userCategoryTradeViewWidgetPopup = userMstSelectPopupWidget;
				 if (module === "10")
				 me.userCategoryForcastViewWidgetPopup = userMstSelectPopupWidget;
					
			}
		
		} 
		userMstSelectPopupWidget.show();
		userMstSelectPopupWidget.center();
		var filterContainer = userMstSelectPopupWidget.down('container[itemId="filterContainer"] AutoCompleter');
    	 filterContainer.focus();
	},
	showEstAccountPopup :function(module)
	{
		var me = this;
		var userMstSelectPopupEstAcc = null;
		var localIsAllAssigned = $('#allEstAccountsSelectedFlag').val();
          
		var hiddenValueFld = '';
		var hiddenValuePopUpFld = '';
		var chkBoxId = '';
		switch (module) {
	case 'EST' :
		hiddenValueFld = 'selectedEstAccounts';
		hiddenValuePopUpFld = 'popupEstAccountsSelectedFlag';
		chkBoxId = 'chkallEstAccountsSelectedFlag';
		break;
		}
		me.Module = module;
		if (module === "EST") {
			userMstSelectPopupEstAcc = me.userCategoryPortalEstAccountPopup;
		}

		if (Ext.isEmpty(userMstSelectPopupEstAcc)) {
		
			var colModel = [{
						colId : 'accountNumber',
						colDesc :  getLabel('accountNo','Account No'),
						colHeader : getLabel('accountNo','Account No'),
						width : 110
					},
					{
						colId : 'accountName',
						colDesc : getLabel('accountName','Account Name'),
						colHeader : getLabel('accountName','Account Name'),
						width : 140
					},		
					 {
						colId : 'assignmentStatus',
						colDesc : getLabel('status','Status'),
						colHeader : getLabel('status','Status'),
						width : 100
					}, {
						colId : 'clientDescription',
						colDesc : getLabel('clientName','Client Name'),
						colHeader : getLabel('clientName','Client Name'),
						width : 90
					}];
			var storeModel = {
				fields : ['accountNumber','accountName', 'assigned', 'clientDescription',
						'assignmentStatus', 'adminEnable', 'brEnable',
						'bankRepEnable', 'checksEnable', 'collectionEnable',
						'incomingAchEnable', 'incomingWireEnable',
						'paymentEnable', 'positivePayEnable',
						'subscriptionCode', 'clientCode', 'isAssigned','identifier','subsidiaries'],
				proxyUrl : 'services/userCategory/accounts.json',
				rootNode : 'd.details',
				totalRowsNode : 'd.__count'
			};
			userMstSelectPopupEstAcc = Ext.create('Ext.ux.gcp.FilterPopUpView',
					{
				title :  getLabel('selectAccount','Select Account'),
				isAllSelected : localIsAllAssigned,
				keyNode : 'accountNumber',
				closeAction : (mode === "VIEW") ? 'destroy' : 'hide',
				itemId : 'estaccount_view',
				service:'account',
				checkboxId : chkBoxId,
				displayCount : false,
				cls:'xn-popup',
				draggable : false,
				resizable : false,
				autoHeight : false,
				//y : 280,
				width : 600,
				maxWidth : 735,
				minHeight : 156,
				maxHeight : 550,
				cfgModel : {
				     pageSize : 5,
					storeModel : storeModel,
					columnModel : colModel,
					checkBoxColumnWidth:_GridCheckBoxWidth
				   },
					autoCompleterEmptyText : getLabel('searchByAccNoOrName','Search by Account No Or Name'),
				   //cfgFilterLabel: 'Accounts',
				   cfgAutoCompleterUrl:'accounts',
				   cfgUrl : 'services/userCategory/{0}.json',
				      paramName:'filterName',
					dataNode:'accountNumber',
					dataNode2:'accountName',
					rootNode : 'd.details',
					delimiter:'|&nbsp&nbsp&nbsp',
					cfgListCls:'xn-autocompleter-t7',
					autoCompleterExtraParam:
						[{
							key:'categoryId',value: userCategory
						},{
							key:'module',value: module
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
				
				if (module === "EST")
					me.userCategoryPortalEstAccountPopup = userMstSelectPopupEstAcc;
								
			}
		
		} 
		userMstSelectPopupEstAcc.show();
		userMstSelectPopupEstAcc.center();
		var filterContainer = userMstSelectPopupEstAcc.down('container[itemId="filterContainer"] AutoCompleter');
    	 filterContainer.focus();
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
			chkBoxId = 'chkallbRAccountsSelectedFlag';
			break;
		case '02' :
			hiddenValueFld = 'selectedAccounts';
			hiddenValuePopUpFld = 'popupAccountsSelectedFlag';
			chkBoxId = 'chkallbRAccountsSelectedFlag';
			break;
		case '05' :
			hiddenValueFld = 'selectedAccounts';
			hiddenValuePopUpFld = 'popupAccountsSelectedFlag';
			chkBoxId = 'chkallbRAccountsSelectedFlag';
			break;
		case '19' :
			hiddenValueFld = 'selectedAccounts';
			hiddenValuePopUpFld = 'popupAccountsSelectedFlag';
			chkBoxId = 'chkallbRAccountsSelectedFlag';
			break;
		case '13' :
			hiddenValueFld = 'selectedPositivePayAccounts';
			hiddenValuePopUpFld = 'popupAccountsSelectedFlag';
			chkBoxId = 'chkAllPositivePayAccountsSelectedFlag';
			break;
		case '14' :
			hiddenValueFld = 'selectedAccounts';
			hiddenValuePopUpFld = 'popupAccountsSelectedFlag';
			chkBoxId = 'chkAllChecksAccountsSelectedFlag';
			break;	
		case '16' :
			hiddenValueFld = 'selectedAccounts';
			hiddenValuePopUpFld = 'popupAccountsSelectedFlag';
			chkBoxId = 'chkAllDepositViewAccountsSelectedFlag';
			break;	
		case '07' :
			hiddenValueFld = 'selectedAccounts';
			hiddenValuePopUpFld = 'popupAccountsSelectedFlag';
			chkBoxId = 'chkAllLoanAccountsSelectedFlag';
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
		else if (module === "13") {
			userMstSelectPopupBRAcc = me.userCategoryPositivePayAccountPopup;
		}
		else if (module === "14") {
			userMstSelectPopupBRAcc = me.userCategoryChecksAccountPopup;
		}
		else if (module === "16") {
			userMstSelectPopupBRAcc = me.userCategoryDepositViewAccountPopup;
		}
		else if (module === "07") {
			userMstSelectPopupBRAcc = me.userCategoryLoanAccountPopup;
		}
		
		if (Ext.isEmpty(userMstSelectPopupBRAcc)) {
		
			var colModel = [{
						colId : 'accountNumber',
						colDesc :  getLabel('accountNo','Account No'),
						colHeader : getLabel('accountNo','Account No'),
						sortable: true,
						width : 150
					},
					{
						colId : 'accountName',
						colDesc : getLabel('accountName','Account Name'),
						colHeader : getLabel('accountName','Account Name'),
						sortable: true,
						width : 150
					},		
					 {
						colId : 'assignmentStatus',
						colDesc : getLabel('status','Status'),
						colHeader : getLabel('status','Status'),
						sortable: false,
						width : 140
					}, {
						colId : 'clientDescription',
						colDesc : getLabel('clientName','Company Name'),
						colHeader : getLabel('clientName','Company Name'),
						sortable: true,
						width : 140
					}];
			var storeModel = {
				fields : ['accountNumber','accountName', 'assigned', 'clientDescription',
						'assignmentStatus', 'adminEnable', 'brEnable',
						'bankRepEnable', 'checksEnable', 'collectionEnable',
						'incomingAchEnable', 'incomingWireEnable',
						'paymentEnable', 'positivePayEnable',
						'subscriptionCode', 'clientCode', 'isAssigned','identifier','subsidiaries'],
				proxyUrl : 'services/userCategory/accounts.json',
				rootNode : 'd.details',
				totalRowsNode : 'd.__count'
			};
			userMstSelectPopupBRAcc = Ext.create('Ext.ux.gcp.FilterPopUpView',
					{
				title :  getLabel('selectAccount','Select Account'),
				isAllSelected : localIsAllAssigned,
				keyNode : 'accountNumber',
				itemId : 'account_view',
				service:'account',
				checkboxId : chkBoxId,
				displayCount : false,
				cls:'xn-popup',
				draggable : false,
				resizable : false,
				autoHeight : false,
				//y : 280,
				width : 735,
				//maxWidth : 735,
				minHeight : 156,
				maxHeight : 550,
				cfgModel : {
				     pageSize : 5,
					storeModel : storeModel,
					columnModel : colModel,
					checkBoxColumnWidth:_GridCheckBoxWidth
				   },
					autoCompleterEmptyText : getLabel('searchByAccNoOrName','Search by Account No Or Name'),
				   //cfgFilterLabel: 'Accounts',
				   cfgAutoCompleterUrl:'accounts',
				   cfgUrl : 'services/userCategory/{0}.json',
				      paramName:'filterName',
					dataNode:'accountNumber',
					dataNode2:'accountName',
					rootNode : 'd.details',
					delimiter:'|&nbsp&nbsp&nbsp',
					cfgListCls:'xn-autocompleter-t7',
					autoCompleterExtraParam:
						[{
							key:'categoryId',value: userCategory
						},{
							key:'module',value: module
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
				else if (module === "13")
					me.userCategoryPositivePayAccountPopup = userMstSelectPopupBRAcc;
				else if (module === "14")
					me.userCategoryChecksAccountPopup = userMstSelectPopupBRAcc;
				else if (module === "16")
					me.userCategoryDepositViewAccountPopup = userMstSelectPopupBRAcc;
				else if (module === "07")
					me.userCategoryLoanAccountPopup = userMstSelectPopupBRAcc;
					
			}
		
		} 
		userMstSelectPopupBRAcc.show();
		userMstSelectPopupBRAcc.center();
		var filterContainer = userMstSelectPopupBRAcc.down('container[itemId="filterContainer"] AutoCompleter');
    	 filterContainer.focus();
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
				colDesc : getLabel('lbl.schedule.agreementcode','Agreement Code'),
				colHeader : getLabel('lbl.schedule.agreementcode','Agreement Code'),
				width : 275
			}, {
				colId : 'agreementName',
				colDesc : getLabel('lbl.schedule.agreementname','Agreement Name'),
				colHeader : getLabel('lbl.schedule.agreementname','Agreement Name'),
				width : 275
			}];
			
			var storeModel = {
				fields : [ 'agreementCode', 'agreementName', 'agreementRecKey', 'validFlag', 'isAssigned',
				           'categoryCode', 'corporationCode', 'sellerCode', 'identifier' ],
				proxyUrl : 'getAgreementList.srvc',
				rootNode : 'd.details',
				totalRowsNode : 'd.__count'
			};
			
			userMstSelectPopup = Ext.create('Ext.ux.gcp.FilterPopUpView', {
				title : getLabel('selectAgreement','Select Agreement'),
				isAllSelected : localIsAllAssigned,
				keyNode : 'agreementRecKey',
				itemId : 'agreement_view',
				service : 'notionalAgreement',
				cls:'xn-popup',
				resizable : false,
				draggable : false,
				autoHeight : false,
				//y : 280,
				width : 735,
				//maxWidth : 735,
				minHeight : 156,
				maxHeight : 550,
				checkboxId : 'chkallNotionalSelectedFlag',
				displayCount : false,
				autoCompleterEmptyText : getLabel('searchByAgreementCode','Search by Agreement Code'),
				cfgModel : {
				     pageSize : 5,
					storeModel : storeModel,
					columnModel : colModel
				   },
				
				   //cfgFilterLabel:'Agreement',
				     cfgAutoCompleterUrl:'getAgreementList',
				   cfgUrl : '{0}.srvc',
				   	autoCompleterExtraParam:
						[{
							key:'$agreementType',value: agreementType
						},{
							key:'$sellerCode',value: seller
						},{
							key:'$categoryCode',value: categoryCode
						},{
							key:'$corporationCode',value: corporationCode
						},{
							key:'$categoryId',value: userCategory
						},{
							key: csrfTokenName ,value: csrfTokenValue
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
		userMstSelectPopup.center();
		var filterContainer = userMstSelectPopup.down('container[itemId="filterContainer"] AutoCompleter');
    	 filterContainer.focus();
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
				colDesc : getLabel('lbl.schedule.agreementcode','Agreement Code'),
				colHeader : getLabel('lbl.schedule.agreementcode','Agreement Code'),
				width : 275
			}, {
				colId : 'agreementName',
				colDesc : getLabel('lbl.schedule.agreementname','Agreement Name'),
				colHeader : getLabel('lbl.schedule.agreementname','Agreement Name'),
				width : 275
			}];
			
			var storeModel = {
				fields : [ 'agreementCode', 'agreementName', 'agreementRecKey', 'validFlag', 'isAssigned',
				           'categoryCode', 'corporationCode', 'sellerCode', 'identifier' ],
				proxyUrl : 'getAgreementList.srvc',
				rootNode : 'd.details',
				totalRowsNode : 'd.__count'
			};		
			userMstSelectPopup = Ext.create('Ext.ux.gcp.FilterPopUpView', {
				title :getLabel('selectSweepAgreement','Select Sweep Agreement'),
				isAllSelected : localIsAllAssigned,
				keyNode : 'agreementRecKey',
				itemId : 'sweep_view',
				service : 'sweepAgreement',
				cls:'xn-popup',
				checkboxId : 'chkallSweepSelectedFlag',
				width : 735,
				//maxWidth : 735,
				displayCount : false,
				cfgModel : {
				     pageSize : 5,
					storeModel : storeModel,
					columnModel : colModel
				   },
				  autoCompleterEmptyText : getLabel('searchByAgreementCode','Search by Agreement Code'),
				   //cfgFilterLabel: 'Sweep Agreement',
				    cfgAutoCompleterUrl:'getAgreementList',
				   cfgUrl : '{0}.srvc',
				   	autoCompleterExtraParam:
						[{
							key:'$agreementType',value: agreementType
						},{
							key:'$sellerCode',value: seller
						},{
							key:'$categoryCode',value: categoryCode
						},{
							key:'$corporationCode',value: corporationCode
						},{
							key:'$categoryId',value: userCategory
						},{
							key:csrfTokenName ,value: csrfTokenValue
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
		userMstSelectPopup.center();
		var filterContainer = userMstSelectPopup.down('container[itemId="filterContainer"] AutoCompleter');
    	 filterContainer.focus();
	},
	setAllAssigned : function(userMstSelectPopupRef, isAllAssignedFlagVal) {
		var me = this;
		var smartgridRef = userMstSelectPopupRef.down('smartgrid');
		userMstSelectPopupRef.isAllAssigned=isAllAssignedFlagVal;
		
		me.updateSelectionForAll(userMstSelectPopupRef,smartgridRef,false);
		/*var store = grid.getStore();
		var records = store.data;

		if (!Ext.isEmpty(records)) {
			var items = records.items;
			var assignedRecords = new Array();
			if (!Ext.isEmpty(items)) {
				for (var i = 0; i < items.length; i++) {
					var record = items[i];

					if (!Ext.isEmpty(localIsAllAssigned)
							&& localIsAllAssigned == 'Y') {
						assignedRecords.push(record);
					} else if (record.get('assigned') == true
							|| record.get('isAssigned') == true) {
						assignedRecords.push(record);
					}
				}
			}

			//grid.getSelectionModel().deselectAll();

			if (assignedRecords.length > 0)
				grid.getSelectionModel().select(assignedRecords);
		}
		*/
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
	fetchAccountList : function(module) {
		var me = this;
		if (module != undefined && module != null && module.length>2) {
			moduleCode = module;
			module = "";
		}
		else
		{
			moduleCode=me.Module;
		}
		var accountGrid = me.getAccountGrid();
		if (!Ext.isEmpty(accountGrid)) {
			var url = "services/userCategory/accounts.json";
			var searchField = '';
			if (!Ext.isEmpty(me.getAccountSearchField())) {
				searchField = me.getAccountSearchField().getValue();
				if(searchField!='')
					searchField ='acctNumber lk \''+searchField.toUpperCase() +'\'';
			}
			url = accountGrid.generateUrl(url, accountGrid.pageSize, 1, 1);
			var strUrl = url + '&categoryId=' + userCategory + '&module='
					+ moduleCode + '&$filter=' + searchField;
			accountGrid.url = strUrl;
			accountGrid.setLoading(true);
			accountGrid.loadGridData(strUrl, me.handleAfterGridDataLoad, false);
		}
	},
	fetchAgreementList : function( agreementType ) {
		var me = this;
		var strUrl = 'getAgreementList.srvc';
		var searchField = null;
		
		if( agreementType == 'NOTIONAL' )
		{
			var agreementGrid = me.getAgreementGrid();
			
			if (!Ext.isEmpty(agreementGrid)) {
				
				strUrl = agreementGrid.generateUrl(strUrl, agreementGrid.pageSize, 1, 1);
				strUrl = strUrl + '&$agreementType=' + agreementType;
				strUrl = strUrl + '&$sellerCode=' + seller ;
				strUrl = strUrl + '&$categoryCode=' + categoryCode;
				strUrl = strUrl + '&$corporationCode=' + corporationCode;
				strUrl = strUrl + '&$categoryId=' + userCategory;
				
				if (!Ext.isEmpty(me.getNotionalSearchField())) {
					searchField = me.getNotionalSearchField().getValue();
					if( searchField != null  && searchField!='')
					{
						document.getElementById("notionalSearchField").value = searchField;
						strUrl = strUrl + '&$agreementCode=' + searchField;
					}
					
				}
				strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;
				
				agreementGrid.url = strUrl;
				agreementGrid.setLoading(true);
				agreementGrid.loadGridData(strUrl, me.handleAfterGridAgreementDataLoad, false);
			}
		}
		else if( agreementType == 'SWEEP' )
		{
			var sweepAgreementGrid = me.getSweepAgreementGrid();
			
			if (!Ext.isEmpty(sweepAgreementGrid)) {
				
				strUrl = sweepAgreementGrid.generateUrl(strUrl, sweepAgreementGrid.pageSize, 1, 1);
				strUrl = strUrl + '&$agreementType=' + agreementType;
				strUrl = strUrl + '&$sellerCode=' + seller ;
				strUrl = strUrl + '&$categoryCode=' + categoryCode;
				strUrl = strUrl + '&$corporationCode=' + corporationCode;
				strUrl = strUrl + '&$categoryId=' + userCategory;
				
				if (!Ext.isEmpty(me.getSweepSearchField())) {
					searchField = me.getSweepSearchField().getValue();
					if( searchField != null  && searchField!='')
					{
						document.getElementById("sweepSearchField").value = searchField;
						strUrl = strUrl + '&$agreementCode=' + searchField;
					}
				}
				strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;
				
				sweepAgreementGrid.url = strUrl;
				sweepAgreementGrid.setLoading(true);
				sweepAgreementGrid.loadGridData(strUrl, me.handleAfterGridSweepAgreementDataLoad, false);
			}
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
	fetchAlertList : function(module) {
		var me = this;
		if (module != undefined && module != null && module.length>2) {
			moduleCode = module;
			module = "";
		}
		else
		{
			moduleCode=me.Module;
		}
		var alertGrid = me.getAlertGrid();
		if (!Ext.isEmpty(alertGrid)) {
			var url = "services/userCategory/alerts.json";
			var searchField = '';
			if (!Ext.isEmpty(me.getSearchField())) {
				searchField = me.getSearchField().getValue();
				if(searchField!='')
					searchField ='subdesc lk \''+searchField.toUpperCase() +'\'';
			}
			url = alertGrid.generateUrl(url, alertGrid.pageSize, 1, 1);
			var selectedPackages = '';
			if (undefined != document.getElementById("selectedPackagesId")
					&& null != document.getElementById("selectedPackagesId")) {
				selectedPackages = document
						.getElementById("selectedPackagesId").value;
			}

			var strUrl = url + '&categoryId=' + userCategory + '&module='
					+ moduleCode + '&$filter=' + searchField
					+ '&selectedpackages=' + selectedPackages;
			alertGrid.url = strUrl;
			alertGrid.loadGridData(strUrl, me.handleAfterGridDataLoad, false);
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
			chkBoxId = 'chkallReportsSelectedFlag';
			break;
		case '02' :
			hiddenValueFld = 'selectedRecordsForReport';
			hiddenValuePopUpFld = 'popupReportSelectedFlag';
			chkBoxId = 'chkallReportsSelectedFlag';
			break;
		case '05' :
			hiddenValueFld = 'selectedRecordsForReport';
			hiddenValuePopUpFld = 'popupReportSelectedFlag';
			chkBoxId = 'chkallReportsSelectedFlag';
			break;
		case '06' :
			hiddenValueFld = 'selectedRecordsForReport';
			hiddenValuePopUpFld = 'popupReportSelectedFlag';
			chkBoxId = 'chkallReportsSelectedFlag';
			break;
		case '03' :
			hiddenValueFld = 'selectedRecordsForReport';
			hiddenValuePopUpFld = 'popupReportSelectedFlag';
			chkBoxId = 'chkallReportsSelectedFlag';
			break;
		case '04' :
			hiddenValueFld = 'selectedRecordsForReport';
			hiddenValuePopUpFld = 'popupReportSelectedFlag';
			chkBoxId = 'chkallReportsSelectedFlag';
			break;
		case '06' :
			hiddenValueFld = 'selectedRecordsForReport';
			hiddenValuePopUpFld = 'popupReportSelectedFlag';
			chkBoxId = 'chkAllReportsSelectedFlag';
			break;
		case '07' :
			hiddenValueFld = 'selectedRecordsForReport';
			hiddenValuePopUpFld = 'popupReportSelectedFlag';
			chkBoxId = 'chkallReportsSelectedFlag';
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
			chkBoxId = 'chkallReportsSelectedFlag';
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
						colHeader : getLabel('report','Report'),
						sortable : true,
						width : 275
					}, {
						colId : 'assignmentStatus',
						colDesc : 'Status',
						colHeader : getLabel('status','Status'),
						sortable : false,
						width : 275
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
				title :  getLabel('selectReport','Select Report'),
				isAllSelected : localIsAllAssigned,
				keyNode : 'reportId',
				itemId : 'report_view',
				service:'report',
				checkboxId : chkBoxId,
				cls : 'xn-popup',
				autoHeight : false,
				draggable : false,
				resizable : false,
				//y : 280,
				width : 735,
				//maxWidth : 735,
				minHeight : 156,
				maxHeight : 550,
				displayCount : false,
				cfgModel : {
				     pageSize : 5,
					storeModel : storeModel,
					columnModel : colModel
				   },
				
				  // cfgFilterLabel: 'Report',
				   autoCompleterEmptyText : getLabel('searchByReport','Search by Report'),
				   cfgAutoCompleterUrl:'reports',
				   cfgUrl : 'services/userCategory/{0}.json',					
					paramName:'filterName',
					dataNode:'reportName',
					rootNode : 'd.details',
					autoCompleterExtraParam:
						[{
							key:'categoryId',value: userCategory
						},{
							key:'module',value: strModule
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
		userMstSelectPopup.center();
		var filterContainer = userMstSelectPopup.down('container[itemId="filterContainer"] AutoCompleter');
    	 filterContainer.focus();
	},
	fetchReportsList : function(module) {
		var me = this;
		if (module != undefined && module != null && module.length>2) {
			moduleCode = module;
			module = "";
		}
		else
		{
			moduleCode=me.Module;
		}
		var reportGrid = me.getReportGrid();
		if (!Ext.isEmpty(reportGrid)) {
			var url = "services/userCategory/reports.json";
			var searchField = '';
			var filterParam = "";
			if (!Ext.isEmpty(me.getReportSearchField())) {
				searchField = me.getReportSearchField().getValue();
				if(searchField!='')
					searchField ='reportsearch lk \''+searchField.toUpperCase() +'\'';
			}
			url = reportGrid.generateUrl(url, reportGrid.pageSize, 1, 1);
			 var selectedPackages = '';
			if (undefined != document.getElementById("selectedPackagesId")
					&& null != document.getElementById("selectedPackagesId")) {
				selectedPackages = document
						.getElementById("selectedPackagesId").value;
			}
			var strUrl = url + '&categoryId=' + userCategory + '&module='
					+ moduleCode + '&filterParam=' + filterParam + '&$filter='
					+ searchField + '&selectedpackages=' + selectedPackages;
			reportGrid.url = strUrl;
			reportGrid.loadGridData(strUrl, me.handleAfterGridDataLoad, false);
		}
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
						colDesc :  getLabel('messageType','Message Type'),
						colHeader : getLabel('messageType','Message Type'),
						width : 275
					}, {
						colId : 'assignmentStatus',
						colDesc : getLabel('status','Status'),
						colHeader : getLabel('status','Status'),
						sortable : false,
						width : 275
					}];
			var storeModel = {
				fields : ['formCode', 'formName', 'isAssigned',
						'clientDescription', 'assignmentStatus', 'clientCode','subsidiaries'],
				proxyUrl : 'services/userCategory/messages.json',
				rootNode : 'd.details',
				totalRowsNode : 'd.__count'
			};
			userMstSelectPopup = Ext.create('Ext.ux.gcp.FilterPopUpView', {
				title :getLabel('selectMessageType','Select Message Type'),
				cls:'xn-popup',
				draggable : false,
				resizable : false,
				autoHeight : false,
				//y : 280,
				width : 735,
				//maxWidth : 735,
				minHeight : 156,
				maxHeight : 550,
				isAllSelected : localIsAllAssigned,
				keyNode : 'formCode',
				itemId : 'messageType_view',
				service : 'messageType',
				checkboxId : 'chkallMessagesSelectedFlag',
				displayCount : false,
				cfgModel : {
				     pageSize : 5,
					storeModel : storeModel,
					columnModel : colModel
				   },
				
				   //cfgFilterLabel: 'Message Types',
				   cfgAutoCompleterUrl:'messages',
				   cfgUrl : 'services/userCategory/{0}.json',
				   autoCompleterEmptyText : getLabel('searchByMsgType','Search by Message Type'),
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
		userMstSelectPopup.center();
		var filterContainer = userMstSelectPopup.down('container[itemId="filterContainer"] AutoCompleter');
    	 filterContainer.focus();
		/*var me = this;
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
	
			userMstSelectPopup = Ext.create('GCP.view.UserMstSelectPopup', {
						title : locMessages.MESSAGETYPE_TITLE,
						searchFlag : true,
						itemId : 'messageType_view',
						colModel : colModel,
						storeModel : storeModel,
						mode : mode,
						isAllAssigned : localIsAllAssigned,
						module : module,
						keyNode : 'formCode',
						cls:'t7-popup',
					});
			me.userMessageMstSelectPopup = userMstSelectPopup;
			me.fetchMessageTypeList();
		} else {
			var smartgridRef = userMstSelectPopup.down('smartgrid');
			me.setAllAssigned(userMstSelectPopup, localIsAllAssigned);
		}
		userMstSelectPopup.show();*/
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
						colDesc :  getLabel('pmtPackage','Payment Package'),
						colHeader : getLabel('pmtPackage','Payment Package'),
						sortable:true,
						width : 150
					}, {
						colId : 'productCategoryCode',
						colDesc :  getLabel('productCatType','Product Cat Type'),
						colHeader : getLabel('productCatType','Product Cat Type'),
						sortable:true,
						width : 150
					}, {
						colId : 'assignmentStatus',
						colDesc :  getLabel('status','Status'),
						colHeader : getLabel('status','Status'),
						sortable:false,
						width : 140
					}, {
						colId : 'clientDescription',
						colDesc : getLabel('grid.column.company','Company Name'),
						colHeader : getLabel('grid.column.company','Company Name'),
						sortable:true,
						width : 130
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
				title :  getLabel('selectPackage','Select Package'),
				isAllSelected : localIsAllAssigned,
				keyNode : 'productCode,clientCode',
				itemId : 'package_view',
				smartGridMaxHeight : 500,
				service : 'package',
				checkboxId:'chkallPackageSelectedFlag',
				displayCount : false,
				cls:'xn-popup',
				resizable : false,
				draggable : false,
				autoHeight : false,
				//y : 280,
				width : 735,
				//maxWidth : 735,
				minHeight : 156,
				maxHeight : 550,
				cfgModel : {
				     pageSize : 5,
					storeModel : storeModel,
					columnModel : colModel
				   },
				  autoCompleterEmptyText : getLabel('searchByPmtPackage','Search by Payment Package'),
				  // cfgFilterLabel:'Packages',
				   cfgAutoCompleterUrl:'catPackageList',
				   cfgUrl : 'services/userCategory/{0}.json',
				   paramName:'filterName',
					dataNode:'productDescription',
					rootNode : 'd.details',
					autoCompleterExtraParam:
						[{
							key:'categoryId',value: userCategory
						},{
							key:'module',value: module
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
		userMstSelectPopup.center();
		var filterContainer = userMstSelectPopup.down('container[itemId="filterContainer"] AutoCompleter');
    	 filterContainer.focus();
	},
	showColPackagePopup : function(module) {
			var me = this;
		me.Module = module;
		var localIsAllAssigned = $('#allPackagesSelectedFlag').val();
		var userMstSelectPopup = me.userPackageMstSelectPopup;
		if (Ext.isEmpty(userMstSelectPopup)) {
			var colModel = [{
						colId : 'productDescription',
						colDesc : getLabel('paymentPackage', 'Payment Package'),
						colHeader : getLabel('receivablesMethod', 'Receivables Method'),
						width : 150
					}, {
						colId : 'productCategoryCode',
						colDesc : getLabel('productCatType', 'Product Cat Type'),
						colHeader : getLabel('productCatType', 'Product Cat Type'),
						width : 150
					}, {
						colId : 'assignmentStatus',
						colDesc : getLabel('status','Status'),
						colHeader : getLabel('status','Status'),
						sortable : false,
						width : 140
					}, {
						colId : 'clientDescription',
						colDesc : getLabel('grid.column.company','Company Name'),
						colHeader : getLabel('grid.column.company','Company Name'),
						width : 140
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
				title : getLabel('selectPackage','Select Package'),
				isAllSelected : localIsAllAssigned,
				keyNode : 'productCode,clientCode',
				itemId : 'collection_view',
				service : 'package',
				checkboxId:'chkallPackageSelectedFlag',
				displayCount : false,
				cls:'xn-popup',
				resizable : false,
				draggable : false,
				autoHeight : false,
				//y : 280,
				width : 735,
				//maxWidth : 735,
				minHeight : 156,
				maxHeight : 550,
				cfgModel : {
				     pageSize : 5,
					storeModel : storeModel,
					columnModel : colModel
				   },
				  autoCompleterEmptyText : getLabel('searchReceivableMethod', 'Search by Receivables Method'),
				   cfgFilterLabel:getLabel('package','Package'),
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
		userMstSelectPopup.center();
		var filterContainer = userMstSelectPopup.down('container[itemId="filterContainer"] AutoCompleter');
    	 filterContainer.focus();
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
						colDesc : getLabel('eTradePackage','eTrade Package'),
						colHeader : getLabel('eTradePackage','eTrade Package'),
						width : 180
					},{
						colId : 'clientDescription',
						colDesc : getLabel('grid.column.company','Company Name'),
						colHeader : getLabel('grid.column.company','Company Name'),
						width : 180
					},{
						colId : 'assignmentStatus',
						colDesc : getLabel('status','Status'),
						colHeader : getLabel('status','Status'),
						sortable : false,
						width : 180
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
				title :  getLabel('selectTradePackage','Select Trade Package'),
				isAllSelected : localIsAllAssigned,
				keyNode : 'productCode',
				itemId : 'trade_Package_view',
				service : 'tradePackage',
				checkboxId : 'chkallPackageSelectedFlag',
				displayCount : false,
				cls:'xn-popup',
				resizable : false,
				draggable : false,
				autoHeight : false,
				//width : 550,
				//y : 280,
				width : 735,
				//maxWidth : 735,
				minHeight : 156,
				maxHeight : 550,
				cfgModel : {
				     pageSize : 5,
					storeModel : storeModel,
					columnModel : colModel
				   },
				autoCompleterEmptyText : getLabel('searchByeTradePackage','Search by eTrade Package'),
				   cfgFilterLabel:getLabel('package','Package'),
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
		userMstSelectPopup.center();
		var filterContainer = userMstSelectPopup.down('container[itemId="filterContainer"] AutoCompleter');
    	 filterContainer.focus();
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
						colDesc : getLabel('forecastPackage','Forecast Package'),
						colHeader : getLabel('forecastPackage','Forecast Package'),
						width : 180
					},{
						colId : 'clientDescription',
						colDesc : getLabel('grid.column.company','Company Name'),
						colHeader : getLabel('grid.column.company','Company Name'),
						width : 180
					},{
						colId : 'assignmentStatus',
						colDesc : getLabel('status','Status'),
						colHeader :getLabel('status','Status'),
						sortable : false,
						width : 180						
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
				title :getLabel('selectForecastPackage','Select Forecast Package'),
				isAllSelected : localIsAllAssigned,
				keyNode : 'productCode',
				itemId : 'forecast_Package_view',
				service : 'forecastPackages',
				checkboxId : 'chkAllPackageSelectedFlag',
				cls:'xn-popup',
				displayCount : false,
				resizable : false,
				draggable : false,
				autoHeight : false,
				//y : 280,
				width : 735,
				//maxWidth : 735,
				minHeight : 156,
				maxHeight : 550,
				cfgModel : {
				     pageSize : 5,
					storeModel : storeModel,
					columnModel : colModel
				   },
				 autoCompleterEmptyText : getLabel('searchByForecastPackage','Search by Forecast Package'),
				   cfgFilterLabel:getLabel('package','Package'),
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
		userMstSelectPopup.center();
		var filterContainer = userMstSelectPopup.down('container[itemId="filterContainer"] AutoCompleter');
    	 filterContainer.focus();
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
						colDesc : 'SCM Product',
						colHeader : getLabel('scmProduct','SCF Package'),
						width : 180
					}, {
						colId : 'anchorClientDescription',
						colDesc : 'Anchor Client',
						colHeader : getLabel('anchorClient','Anchor Client'),
						width : 180
					}, {
						colId : 'assignmentStatus',
						colDesc : getLabel('status','Status'),
						colHeader : getLabel('status','Status'),
						sortable : false,
						width : 180
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
				title :getLabel('selectProduct','Select Product'),
				isAllSelected : localIsAllAssigned,
				keyNode : 'productCode',
				itemId : 'scmproduct_view',
				service : 'scmProduct',
				checkboxId : 'chkallSCMProductSelectedFlag',
				resizable : false,
				draggable : false,
				autoHeight : false,
				//y : 280,
				cls : 'xn-popup',
				width : 735,
				//maxWidth : 735,
				minHeight : 156,
				maxHeight : 550,
				displayCount : false,
				cfgModel : {
				     pageSize : 5,
					storeModel : storeModel,
					columnModel : colModel
				   },
				 autoCompleterEmptyText : getLabel('searchBySCMProduct','Search by SCF Package'),
				   cfgFilterLabel:getLabel('products','Products'),
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
		scmProductSelectPopup.center();
		var filterContainer = scmProductSelectPopup.down('container[itemId="filterContainer"] AutoCompleter');
    	 filterContainer.focus();
	},
	fetchPackageList : function(module) {
		var me = this;
		if (module != undefined && module != null && module.length>2) {
			moduleCode = module;
			module = "";
		}
		else
		{
			moduleCode=me.Module;
		}
		var messageTypeGrid = me.getPackageGrid();
		if (!Ext.isEmpty(messageTypeGrid)) {
			var url = "services/userCategory/packages.json";
			var searchField = '';
			if (!Ext.isEmpty(me.getPackageSearchField())) {
				searchField = me.getPackageSearchField().getValue();
				if(searchField!='')
					searchField ='myprddesc lk \''+searchField.toUpperCase() +'\'';
				
			}
			url = messageTypeGrid.generateUrl(url, messageTypeGrid.pageSize, 1,
					1);
			var strUrl = url + '&categoryId=' + userCategory + '&module='
					+ moduleCode + '&$filter=' + searchField;
			messageTypeGrid.url = strUrl;
			messageTypeGrid.loadGridData(strUrl, me.handleAfterGridDataLoad,
					false);
		}
	},
	
	fetchColPackageList : function(module) {
		var me = this;
		if (module != undefined && module != null && module.length>2) {
			moduleCode = module;
			module = "";
		}
		else
		{
			moduleCode=me.Module;
		}
		var messageTypeGrid = me.getCollectionGrid();
		if (!Ext.isEmpty(messageTypeGrid)) {
			var url = "services/userCategory/collection.json";
			var searchField = '';
			if (!Ext.isEmpty(me.getCollectionSearchField())) {
				searchField = me.getCollectionSearchField().getValue();
				if(searchField!='')
					searchField ='myprddesc lk \''+searchField.toUpperCase() +'\'';
			}
			url = messageTypeGrid.generateUrl(url, messageTypeGrid.pageSize, 1,
					1);
			var strUrl = url + '&categoryId=' + userCategory + '&module='
					+ moduleCode + '&$filter=' + searchField;
			messageTypeGrid.url = strUrl;
			messageTypeGrid.loadGridData(strUrl, me.handleAfterGridDataLoad,
					false);
		}
	},
	fetchSCMProductList : function(module) {
		var me = this;
		if (module != undefined && module != null && module.length>2) {
			moduleCode = module;
			module = "";
		}
		else
		{
			moduleCode=me.Module;
		}
		var messageTypeGrid = me.getScmProductGrid();
		if (!Ext.isEmpty(messageTypeGrid)) {
			var url = "services/userCategory/scmproducts.json";
			var searchField = '';
			if (!Ext.isEmpty(me.getScmproductSearchField())) {
				searchField = me.getScmproductSearchField().getValue();
				if(searchField!='')
					searchField ='reportsearch lk \''+searchField.toUpperCase() +'\'';
			}
			url = messageTypeGrid.generateUrl(url, messageTypeGrid.pageSize, 1,
					1);
			var strUrl = url + '&categoryId=' + userCategory + '&module='
					+ moduleCode + '&$filter=' + searchField;
			messageTypeGrid.url = strUrl;
			messageTypeGrid.loadGridData(strUrl, me.handleAfterGridDataLoad,
					false);
		}
	},
	fetchTradePackageList : function(module) {
		var me = this;
		if (module != undefined && module != null && module.length>2) {
			moduleCode = module;
			module = "";
		}
		else
		{
			moduleCode=me.Module;
		}
		var tradePackageGrid = me.getTradePackageGrid();
		if (!Ext.isEmpty(tradePackageGrid)) {
			var url = "services/userCategory/tradePackages.json";
			var searchField = '';
			if (!Ext.isEmpty(me.getTradePackageSearchField())) {
				searchField = me.getTradePackageSearchField().getValue();
				if(searchField!='')
					searchField ='myprddesc lk \''+searchField.toUpperCase() +'\'';
				
			}
			url = tradePackageGrid.generateUrl(url, tradePackageGrid.pageSize, 1,
					1);
			var strUrl = url + '&categoryId=' + userCategory + '&module='
					+ moduleCode + '&$filter=' + searchField;
			tradePackageGrid.url = strUrl;
			tradePackageGrid.loadGridData(strUrl, me.handleAfterGridDataLoad,
					false);
		}
	},
	fetchForecastPackageList : function(module) {
		var me = this;
		if (module != undefined && module != null && module.length>2) {
			moduleCode = module;
			module = "";
		}
		else
		{
			moduleCode=me.Module;
		}
		var forecastPackageGrid = me.getForecastPackageGrid();
		if (!Ext.isEmpty(forecastPackageGrid)) {
			var url = "services/userCategory/forecastPackages.json";
			var searchField = '';
			if (!Ext.isEmpty(me.getForecastPackageSearchField())) {
				searchField = me.getForecastPackageSearchField().getValue();
				if(searchField!='')
					searchField ='myprddesc lk \''+searchField.toUpperCase() +'\'';
				
			}
			url = forecastPackageGrid.generateUrl(url, forecastPackageGrid.pageSize, 1,
					1);
			var strUrl = url + '&categoryId=' + userCategory + '&module='
					+ moduleCode + '&$filter=' + searchField;
			forecastPackageGrid.url = strUrl;
			forecastPackageGrid.loadGridData(strUrl, me.handleAfterGridDataLoad,
					false);
		}
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
						colDesc : getLabel('companyName','Company Name'),
						colHeader : getLabel('companyName','Company Name'),
						sortable : true,
						width : 275
					}, {
						colId : 'assignmentStatus',
						colDesc : getLabel('status','Status'),
						colHeader : getLabel('status','Status'),
						sortable : false,
						width : 275
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
				title :getLabel('selectCompany','Select Company'),
				isAllSelected : localIsAllAssigned,
				keyNode : 'companyId',
				itemId : 'company_view',
				service : 'companyId',
				checkboxId:'chkallCompanyIdSelectedFlag',
				displayCount : false,
				cls:'xn-popup',
				resizable : false,
				draggable : false,
				autoHeight : false,
				width : 735,
				//maxWidth : 735,
				minHeight : 156,
				maxHeight : 550,
				cfgModel : {
				     pageSize : 5,
					storeModel : storeModel,
					columnModel : colModel
				   },
				  autoCompleterEmptyText : getLabel('searchByCompanyName','Search by Company Name'),
				   //cfgFilterLabel:'Company',
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
		userMstSelectPopup.center();
		var filterContainer = userMstSelectPopup.down('container[itemId="filterContainer"] AutoCompleter');
    	 filterContainer.focus();
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
						colHeader : getLabel('templateName','Template Name'),
						sortable : true,
						width : 180
					}, {
						colId : 'assignmentStatus',
						colDesc : getLabel('status','Status'),
						colHeader : getLabel('status','Status'),
						sortable : false,
						width : 180
					}, {
						colId : 'clientDescription',
						colDesc : getLabel('clientName','Company Name'),
						colHeader : getLabel('clientName','Company Name'),
						sortable : true,
						width : 180
					}];
			var storeModel = {
				fields : ['isAssigned', 'templateName', 'templateReference',
						'assignmentStatus', 'companyId', 'clientDescription','clientCode','identifier'],
				proxyUrl : 'services/userCategory/templates.json',
				rootNode : 'd.details',
				totalRowsNode : 'd.__count'
			};
			userMstSelectPopup = Ext.create('Ext.ux.gcp.FilterPopUpView', {
				title :getLabel('selectTemplate','Select Template'),
				isAllSelected : localIsAllAssigned,
				keyNode : 'templateReference',
				itemId : 'template_view',
				service : 'template',
				checkboxId:'chkallTemplatesSelectedFlag',
				displayCount : false,
				cls:'xn-popup',
				resizable : false,
				draggable : false,
				autoHeight : false,
				//y : 280,
				width : 735,
				//maxWidth : 735,
				minHeight : 156,
				maxHeight : 550,
				cfgModel : {
				     pageSize : 5,
					storeModel : storeModel,
					columnModel : colModel
				   },
				   //cfgFilterLabel:'Templates',
				   autoCompleterEmptyText : getLabel('searchByTemplateName','Search by Template Name'),
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
		userMstSelectPopup.center();
		var filterContainer = userMstSelectPopup.down('container[itemId="filterContainer"] AutoCompleter');
    	 filterContainer.focus();
	},
	fetchTemplatesList : function(module) {
		var me = this;
		if (module != undefined && module != null) {
			moduleCode = '02';
			module = "";
		}
		
		var messageTypeGrid = me.getTemplateGrid();
		if (!Ext.isEmpty(messageTypeGrid)) {
			var url = "services/userCategory/templates.json";
			var searchField = '';
			if (!Ext.isEmpty(me.getTemplateSearchField())) {
				searchField = me.getTemplateSearchField().getValue();
			}
			url = messageTypeGrid.generateUrl(url, messageTypeGrid.pageSize, 1,
					1);
			var strUrl = url + '&categoryId=' + userCategory + '&module='
					+ moduleCode  ;
			if(searchField !='')
			{
				var instQuery = Ext.String.format(
					"tplName lk '{0}' ", searchField);
				strUrl = strUrl + '&$filter=' + instQuery;
			}
					
			messageTypeGrid.url = strUrl;
			messageTypeGrid.loadGridData(strUrl, me.handleAfterGridDataLoad,
					false);
		}
	},
	fetchCompnayList : function() {
		var me = this;
		var messageTypeGrid = me.getCompanyGrid();
		if (!Ext.isEmpty(messageTypeGrid)) {
			var url = "services/userCategory/company.json";
			var searchField = '';
			if (!Ext.isEmpty(me.getCompanySearchField())) {
				searchField = me.getCompanySearchField().getValue();
				if(searchField!='')
					searchField ='company lk \''+searchField.toUpperCase() +'\'';
			}
			url = messageTypeGrid.generateUrl(url, messageTypeGrid.pageSize, 1,
					1);
			var strUrl = url + '&categoryId=' + userCategory + '&$filter='
					+ searchField;
			messageTypeGrid.url = strUrl;
			messageTypeGrid.loadGridData(strUrl, me.handleAfterGridDataLoad,
					false);
		}
	},
	fetchMessageTypeList : function() {
		var me = this;
		var messageTypeGrid = me.getMessageTypeGrid();
		if (!Ext.isEmpty(messageTypeGrid)) {
			var url = "services/userCategory/messages.json";
			var searchField = '';
			if (!Ext.isEmpty(me.getMessageSearchField())) {
				searchField = me.getMessageSearchField().getValue();
				if(searchField!='')
					searchField ='formname lk \''+searchField.toUpperCase() +'\'';
			}
			url = messageTypeGrid.generateUrl(url, messageTypeGrid.pageSize, 1,
					1);
			var strUrl = url + '&categoryId=' + userCategory + '&$filter='
					+ searchField;
			messageTypeGrid.url = strUrl;
			messageTypeGrid.loadGridData(strUrl, me.handleAfterGridDataLoad,
					false);
		}
	},

	handleAfterGridDataLoad : function(grid, jsonData) {
		var me = this;
		grid.enableCheckboxColumn(false);
		var usermstselectpopup = grid.up("usermstselectpopup");
		if(grid.itemId == 'grid_scmproduct_view')
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
			else if (popup.itemId === 'estaccount_view')
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
		handleSelectedRecordsForWidget : function(records) {
		var me = this;
		var objSelectedRecords= me.getWidgetGrid().selectedRecordList;
		var deSelectedRecord=me.getWidgetGrid().deSelectedRecordList;
		var objArray = new Array();
		for (var index = 0; index < objSelectedRecords.length; index++) {
			var objArrayTemp = new Array();			
			var accountNumber = objSelectedRecords[index]['featureId'];
			var corpcode = objSelectedRecords[index]['corporationCode'];
			var identifier = objSelectedRecords[index]['identifier'];
			var assigned = true;
			objArrayTemp.push({
				"featureId" : accountNumber,
				"identifier" : identifier,
				"corporationCode" : corpcode,
				"assigned" : assigned
			});
			objArray.push(objArrayTemp);
		}
		for (var index = 0; index < deSelectedRecord.length; index++) {
			var objArrayTemp = new Array();			
			var accountNumber = deSelectedRecord[index]['featureId'];
			var corpcode = deSelectedRecord[index]['corporationCode'];
			var identifier = deSelectedRecord[index]['identifier'];
			var assigned = false;
			objArrayTemp.push({
				"featureId" : accountNumber,
				"identifier" : identifier,
				"corporationCode" : corpcode,
				"assigned" : assigned
			});
			objArray.push(objArrayTemp);
		}
		
		if (!Ext.isEmpty(objArray)) {
			
			if (undefined != document.getElementById('selectedWidgets')) {
				document.getElementById('selectedWidgets').value = Ext.encode(objArray);
			}
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
			if (!Ext.isEmpty(me.getAccountGridEst())  ) {
				var gridRecords = me.getAccountGridEst().selectedRecordList;
			me.handleSelectedRecordsForAccount(gridRecords);
		}
	},
	
	handleAgreementClose : function() {
		var me = this;
		if (!Ext.isEmpty(me.getAgreementGrid())) {
			var gridRecords = me.getAgreementGrid().store.data.items;
			me.handleSelectedRecordsForAgreement(gridRecords);
		}
	},
	
	handleSweepAgreementClose : function() {
		var me = this;
		if (!Ext.isEmpty(me.getSweepAgreementGrid())) {
			var gridRecords = me.getSweepAgreementGrid().store.data.items;
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
		//var usermstselectpopup = me.getSweepAgreementGrid().up("sweepAgreementSelectPopupType");
		//var objSelectedRecords = usermstselectpopup.getTotalModifiedRecordList(me.getSweepAgreementGrid());
		var objSelectedRecords= me.getSweepAgreementGrid().selectedRecordList;
		var deSelectedRecord=me.getSweepAgreementGrid().deSelectedRecordList;
		var objArray = new Array();
		var packageIds = '';
		for (var index = 0; index < objSelectedRecords.length; index++) {
			var objArrayTemp = new Array();
			var agreementRecKey = objSelectedRecords[index].agreementRecKey;
			var agreementCode = objSelectedRecords[index].agreementCode;
			var sellerCode = objSelectedRecords[index].sellerCode;
			var identifier = objSelectedRecords[index].identifier;
			
			
			var assigned = true;
			
			//var isSelected = usermstselectpopup.checkIfRecordIsSelected(me.getSweepAgreementGrid(),objSelectedRecords[index]);
			//var isDeSelected = usermstselectpopup.checkIfRecordIsDeSelected(me.getSweepAgreementGrid(),objSelectedRecords[index]);
			/*if(isSelected){
				assigned = true;
			}
			else if(isDeSelected){
				assigned = false;
			}*/
			if(assigned != null){
					objArrayTemp.push({
						"agreementRecKey" : agreementRecKey,
						"agreementCode" : agreementCode,
						"sellerCode" : sellerCode,
						"assigned" : assigned,
						"identifier" : identifier
						});
						objArray.push(objArrayTemp);
			}
		}
		
		for (var index = 0; index < deSelectedRecord.length; index++) {
			var objArrayTemp = new Array();
			var agreementRecKey = deSelectedRecord[index].agreementRecKey;
			var agreementCode = deSelectedRecord[index].agreementCode;
			var sellerCode = deSelectedRecord[index].sellerCode;
			var identifier = deSelectedRecord[index].identifier;
			
			
			var assigned = false;
			
			//var isSelected = usermstselectpopup.checkIfRecordIsSelected(me.getSweepAgreementGrid(),objSelectedRecords[index]);
			//var isDeSelected = usermstselectpopup.checkIfRecordIsDeSelected(me.getSweepAgreementGrid(),objSelectedRecords[index]);
			/*if(isSelected){
				assigned = true;
			}
			else if(isDeSelected){
				assigned = false;
			}*/
			if(assigned != null){
					objArrayTemp.push({
						"agreementRecKey" : agreementRecKey,
						"agreementCode" : agreementCode,
						"sellerCode" : sellerCode,
						"assigned" : assigned,
						"identifier" : identifier
						});
						objArray.push(objArrayTemp);
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
		/*if (isDeSelected) { // CHECK AGREEMENT_TYPE
		document.getElementById('allSweepSelectedFlag').value = "N";
		var imgElement = document.getElementById('chkallSweepSelectedFlag');
		imgElement.src = "static/images/icons/icon_unchecked.gif";
		}*/
	},

	
	handleSelectedRecordsForAgreement : function(records) {
		var me = this;
		//var usermstselectpopup = me.getAgreementGrid().up("agreementSelectPopupType");
		//var objSelectedRecords = usermstselectpopup.getTotalModifiedRecordList(me.getAgreementGrid());
		var objSelectedRecords= me.getAgreementGrid().selectedRecordList;
		var deSelectedRecord=me.getAgreementGrid().deSelectedRecordList;
		var objArray = new Array();
		var packageIds = '';
		for (var index = 0; index < objSelectedRecords.length; index++) {
			var objArrayTemp = new Array();
			var agreementRecKey = objSelectedRecords[index].agreementRecKey;
			var agreementCode = objSelectedRecords[index].agreementCode;
			var sellerCode = objSelectedRecords[index].sellerCode;
			var identifier = objSelectedRecords[index].identifier;
			
			
			var assigned = true;
			//var isSelected = usermstselectpopup.checkIfRecordIsSelected(me.getAgreementGrid(),objSelectedRecords[index]);
			//var isDeSelected = usermstselectpopup.checkIfRecordIsDeSelected(me.getAgreementGrid(),objSelectedRecords[index]);
			/*if(isSelected){
				assigned = true;
			}
			else if(isDeSelected){
				assigned = false;
			}*/
			if(assigned != null){
				objArrayTemp.push({
					"agreementRecKey" : agreementRecKey,
					"agreementCode" : agreementCode,
					"sellerCode" : sellerCode,
					"assigned" : assigned,
					"identifier" : identifier
					});
				objArray.push(objArrayTemp);
			}
		}
		
		for (var index = 0; index < deSelectedRecord.length; index++) {
			var objArrayTemp = new Array();
			var agreementRecKey = deSelectedRecord[index].agreementRecKey;
			var agreementCode = deSelectedRecord[index].agreementCode;
			var sellerCode = deSelectedRecord[index].sellerCode;
			var identifier = deSelectedRecord[index].identifier;
			var assigned = false;
			//var isSelected = usermstselectpopup.checkIfRecordIsSelected(me.getAgreementGrid(),objSelectedRecords[index]);
			//var isDeSelected = usermstselectpopup.checkIfRecordIsDeSelected(me.getAgreementGrid(),objSelectedRecords[index]);
			/*if(isSelected){
				assigned = true;
			}
			else if(isDeSelected){
				assigned = false;
			}*/
			if(assigned != null){
				objArrayTemp.push({
						"agreementRecKey" : agreementRecKey,
						"agreementCode" : agreementCode,
						"sellerCode" : sellerCode,
						"assigned" : assigned,
						"identifier" : identifier
						});
				objArray.push(objArrayTemp);
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
		/*if (isDeSelected) { // CHECK AGREEMENT_TYPE
		document.getElementById('allNotionalSelectedFlag').value = "N";
		var imgElement = document.getElementById('chkallNotionalSelectedFlag');
		imgElement.src = "static/images/icons/icon_unchecked.gif";
		}*/
	},
	handleSelectedRecordsForAccount : function(records) {
		var me = this;
		var objSelectedRecords= !Ext.isEmpty(me.getAccountGrid()) ? me.getAccountGrid().selectedRecordList : me.getAccountGridEst().selectedRecordList ;
		var deSelectedRecord= !Ext.isEmpty(me.getAccountGrid()) ? me.getAccountGrid().deSelectedRecordList :me.getAccountGridEst().deSelectedRecordList;
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
			if(me.Module != 'EST')
			{
			if (undefined != document.getElementById('selectedAccounts')) {
				document.getElementById('selectedAccounts').value = Ext.encode(objArray);
				}
			}
			else
			if(me.Module == 'EST')
			{			
				if (undefined != document.getElementById('selectedEstAccounts')) {
				document.getElementById('selectedEstAccounts').value = Ext.encode(objArray);
				}	
			}
			if (undefined != document.getElementById('selectedPositivePayAccounts')) {
				document.getElementById('selectedPositivePayAccounts').value = Ext.encode(objArray);
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
	handleWidgetPopupClose:function(){
	var me = this;
	
		if (!Ext.isEmpty(me.getWidgetGrid())) {
		    
			var gridRecords = me.getWidgetGrid().selectedRecordList;
			me.handleSelectedRecordsForWidget(gridRecords);
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
			document.getElementById('selectedRecordsForAlert').value = Ext.encode(objArray);
		}
	}
});