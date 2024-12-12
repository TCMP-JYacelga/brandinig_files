/*global jQuery, RoleDetails */

(function ($) {
	'use strict';

	var VerifyItem = {
		
		
		toggleAdminDetailsCaret: function () {
			$('#adminDetailsCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#adminAssetBody').slideToggle(200);
			return false;

		},
		
		toggleBankReportsCaret: function () {
			$('#bankReportsCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#bankReportsAssetBody').slideToggle(200);
			return false;

		},
		
		toggleBRCaret: function () {
			$('#brCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#brAssetBody').slideToggle(200);
			return false;

		},
		togglePaymentCaret: function () {
			$('#paymentCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#paymentAssetBody').slideToggle(200);
			return false;
		},
		
		toggleCheckMgmtCaret: function () {
			$('#checkMgmtCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#checkMgmtAssetBody').slideToggle(200);
			return false;
		},
		
		toggleForecastCaret: function () {
			$('#forecastCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#forecastAssetBody').slideToggle(200);
			return false;
		},
		
		toggleImagingViewCaret: function () {
			$('#imagingViewCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#imagingViewAssetBody').slideToggle(200);
			return false;
		},
		
		toggleLmsCaret: function () {
			$('#lmsCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#lmsAssetBody').slideToggle(200);
			return false;
		},
		
		toggleLoanCaret: function () {
			$('#loanCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#loanAssetBody').slideToggle(200);
			return false;
		},
		
		toggleMobileBankingCaret: function () {
			$('#mobileBankingCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#mobileBankingAssetBody').slideToggle(200);
			return false;
		},
		
		toggleTpfaCaret: function () {
			$('#tpfaCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#tpfaAssetBody').slideToggle(200);
			return false;
		},
		
		toggleSubAccountsDetailsCaret : function () {
			$('#subAccountsDetailsCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#subAccountsAssetBody').slideToggle(200);
			return false;
		},
		
		togglePositivePayCaret: function () {
			$('#positivePayCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#positivePayAssetBody').slideToggle(200);
			return false;
		},
		
		togglePortalCaret: function () {
			$('#portalCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#portalAssetBody').slideToggle(200);
			return false;
		},
		toggleCollectionCaret: function () {
			$('#collectionCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#collectionAssetBody').slideToggle(200);
			return false;
		},
		toggleSCFCaret: function () {
			$('#supplyChainCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#supplyChainAssetBody').slideToggle(200);
			return false;
		},
		
		/*toggleExpandAll: function () {         
			$('#adminDetailsCaret').removeClass("fa-caret-down");
			$('#bankReportsCaret').removeClass("fa-caret-down");
			$('#brCaret').removeClass("fa-caret-down");
			$('#paymentCaret').removeClass("fa-caret-down");
			$('#checkMgmtCaret').removeClass("fa-caret-down");
			$('#forecastCaret').removeClass("fa-caret-down");
			$('#imagingViewCaret').removeClass("fa-caret-down");
			$('#lmsCaret').removeClass("fa-caret-down");
			$('#loanCaret').removeClass("fa-caret-down");
			$('#mobileBankingCaret').removeClass("fa-caret-down");
			$('#positivePayCaret').removeClass("fa-caret-down");
			$('#portalCaret').removeClass("fa-caret-down");
			$('#collectionCaret').removeClass("fa-caret-down");
			$('#supplyChainCaret').removeClass("fa-caret-down");
			
			$('#adminDetailsCaret').addClass("fa-caret-up");
			$('#bankReportsCaret').addClass("fa-caret-up");
			$('#brCaret').addClass("fa-caret-up");
			$('#paymentCaret').addClass("fa-caret-up");
			$('#checkMgmtCaret').addClass("fa-caret-up");
			$('#forecastCaret').addClass("fa-caret-up");
			$('#imagingViewCaret').addClass("fa-caret-up");
			$('#lmsCaret').addClass("fa-caret-up");
			$('#loanCaret').addClass("fa-caret-up");
			$('#mobileBankingCaret').addClass("fa-caret-up");
			$('#positivePayCaret').addClass("fa-caret-up");
			$('#portalCaret').addClass("fa-caret-up");
			$('#collectionCaret').addClass("fa-caret-up");
			$('#supplyChainCaret').addClass("fa-caret-up");
			
			$('#adminAssetBody').slideDown(200);
			$('#bankReportsAssetBody').slideDown(200);
			$('#brAssetBody').slideDown(200);
			$('#paymentAssetBody').slideDown(200);
			$('#checkMgmtAssetBody').slideDown(200);
			$('#forecastAssetBody').slideDown(200);
			$('#imagingViewAssetBody').slideDown(200);
			$('#lmsAssetBody').slideDown(200);
			$('#loanAssetBody').slideDown(200);
			$('#mobileBankingAssetBody').slideDown(200);
			$('#positivePayAssetBody').slideDown(200);
			$('#portalAssetBody').slideDown(200);
			$('#collectionAssetBody').slideDown(200);
			$('#supplyChainAssetBody').slideDown(200);
			return false;

		},
		
		toggleCollapseAll: function () {
			$('#adminDetailsCaret').removeClass("fa-caret-up");
			$('#bankReportsCaret').removeClass("fa-caret-up");
			$('#brCaret').removeClass("fa-caret-up");
			$('#paymentCaret').removeClass("fa-caret-up");
			$('#checkMgmtCaret').removeClass("fa-caret-up");
			$('#forecastCaret').removeClass("fa-caret-up");
			$('#imagingViewCaret').removeClass("fa-caret-up");
			$('#lmsCaret').removeClass("fa-caret-up");
			$('#loanCaret').removeClass("fa-caret-up");
			$('#mobileBankingCaret').removeClass("fa-caret-up");
			$('#positivePayCaret').removeClass("fa-caret-up");
			$('#portalCaret').removeClass("fa-caret-up");
			$('#collectionCaret').removeClass("fa-caret-up");
			$('#supplyChainCaret').removeClass("fa-caret-up");

			$('#adminDetailsCaret').addClass("fa-caret-down");
			$('#bankReportsCaret').addClass("fa-caret-down");
			$('#brCaret').addClass("fa-caret-down");
			$('#paymentCaret').addClass("fa-caret-down");
			$('#checkMgmtCaret').addClass("fa-caret-down");
			$('#forecastCaret').addClass("fa-caret-down");
			$('#imagingViewCaret').addClass("fa-caret-down");
			$('#lmsCaret').addClass("fa-caret-down");
			$('#loanCaret').addClass("fa-caret-down");
			$('#mobileBankingCaret').addClass("fa-caret-down");
			$('#positivePayCaret').addClass("fa-caret-down");
			$('#portalCaret').addClass("fa-caret-down");
			$('#collectionCaret').addClass("fa-caret-down");
			$('#supplyChainCaret').addClass("fa-caret-down");
			
			$('#adminAssetBody').slideUp(200);
			$('#bankReportsAssetBody').slideUp(200);
			$('#brAssetBody').slideUp(200);
			$('#paymentAssetBody').slideUp(200);
			$('#checkMgmtAssetBody').slideUp(200);
			$('#forecastAssetBody').slideUp(200);
			$('#imagingViewAssetBody').slideUp(200);
			$('#lmsAssetBody').slideUp(200);
			$('#loanAssetBody').slideUp(200);
			$('#mobileBankingAssetBody').slideUp(200);
			$('#positivePayAssetBody').slideUp(200);
			$('#portalAssetBody').slideUp(200);
			$('#collectionAssetBody').slideUp(200);
			$('#supplyChainAssetBody').slideUp(200);
			return false;

		},*/
		
		
		toggleExpandAll: function () {
			$("[id$='Caret']").addClass("fa-caret-up");
			$("[id$='Caret']").removeClass("fa-caret-down");
			$("[id$='AssetBody']").slideDown(200);
			return false;
		},
		
		toggleCollapseAll: function () {
			$("[id$='Caret']").addClass("fa-caret-down");
			$("[id$='Caret']").removeClass("fa-caret-up");
			$("[id$='AssetBody']").slideUp(200);
			return false;
		},
		
		roleReport: function () { 
			var me = this;
			var form = document.createElement('FORM');
			var strUrl = "services/userCategoryDetailReport.pdf";
			form.name = 'frmMain';
			form.id = 'frmMain';
			form.method = 'POST';
			form.appendChild(createFormField('INPUT', 'HIDDEN',
					csrfTokenName, tokenValue));
			form.appendChild(createFormField('INPUT', 'HIDDEN',
					'userCategoryCode', workingData.roleId));
			form.appendChild(createFormField('INPUT', 'HIDDEN',
					'catCorporation', workingData.corporationId));
			form.action = strUrl;
			document.body.appendChild(form);
			form.submit();
			document.body.removeChild(form);
		},
		submitRole : function(){
			roleCommand.push({
				recordKey: workingData.recordKeyNo
			});
			$.blockUI();
			$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;'+getLabel("loading", "Loading")+'...</h2></div>',
				css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});
			RolesApp.trigger('SubmitRole');
		},
		
		back : function(){
			workingData.assets = [];
			//workingData.granPrivileges = [];
			workingData.subsidiaries = [];
			workingData.isVerify = false;
			if(window.prevMode != ""){
				window.mode = window.prevMode;				
			}
			window.prevMode = "";
		},
		
		viewChanges : function(){
			window.prevMode = window.mode;
			window.mode = "viewChanges";
			RolesApp.trigger('renderVerify');
		},
		
		viewBack : function(){
			window.mode = window.prevMode;
			window.prevMode = "";
			RolesApp.trigger('renderVerify');
		},
		
		init: function () {
									
			$('#adminDetailsCaret').on('click',VerifyItem.toggleAdminDetailsCaret);	
			$('#bankReportsCaret').on('click',VerifyItem.toggleBankReportsCaret);	
			$('#brCaret').on('click',VerifyItem.toggleBRCaret);	
			$('#paymentCaret').on('click',VerifyItem.togglePaymentCaret);
			$('#checkMgmtCaret').on('click',VerifyItem.toggleCheckMgmtCaret);	
			$('#forecastCaret').on('click',VerifyItem.toggleForecastCaret);	
			$('#imagingViewCaret').on('click',VerifyItem.toggleImagingViewCaret);	
			$('#lmsCaret').on('click',VerifyItem.toggleLmsCaret);
			$('#loanCaret').on('click',VerifyItem.toggleLoanCaret);	
			$('#mobileBankingCaret').on('click',VerifyItem.toggleMobileBankingCaret);	
			$('#tpfaCaret').on('click',VerifyItem.toggleTpfaCaret);
			$('#positivePayCaret').on('click',VerifyItem.togglePositivePayCaret);
			$('#portalCaret').on('click',VerifyItem.togglePortalCaret);	
			$('#collectionCaret').on('click',VerifyItem.toggleCollectionCaret);	
			$('#supplyChainCaret').on('click',VerifyItem.toggleSCFCaret);
			$('#subAccountsDetailsCaret').on('click',VerifyItem.toggleSubAccountsDetailsCaret);
			$('#expandAll').on('click',VerifyItem.toggleExpandAll);
			$('#collapseAll').on('click',VerifyItem.toggleCollapseAll);	
			
			$('#submit').on('click',VerifyItem.submitRole);	
			
			$('#verifyBack').on('click',VerifyItem.back);
			
			$('#viewChanges').on('click',VerifyItem.viewChanges);
			$('#viewBack').on('click',VerifyItem.viewBack);
			$('#roleReport').on('click',VerifyItem.roleReport);
			
		}
	};

	RolesApp.bind('verifyInit', VerifyItem.init);
	
})(jQuery);