/*global jQuery, UserDetails */

var VerifyItem;
(function ($) {
	'use strict';

	 VerifyItem = {
			
		submitUser : function(){
			
			userCommand = [];
			userCommand.push({
				recordKey: userWorkingData.recordKeyNo
			});
			$.blockUI();
			$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;Loading...</h2></div>',
				css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});
			UsersApp.trigger('SubmitUser');						
			$.unblockUI();
		},
		
		back : function(){
			userCommand = [];
			userWorkingData.assets = [];
			userWorkingData.isVerify = false;
			if(window.prevMode != ""){
				window.mode = window.prevMode;				
			}
			window.prevMode = "";
		},
		
		viewChanges : function(){
			window.prevMode = window.mode;
			window.mode = "viewChanges";
			UsersApp.trigger('renderUserVerify');
		},
		
		viewBack : function(){
			window.mode = window.prevMode;
			window.prevMode = "";
			UsersApp.trigger('renderUserVerify');
		},
		
		toggleBRCaret: function () {
			$('#brCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#brAssetBody').slideToggle(200);
			return false;

		},
		toggleForecastCaret: function () {
			$('#forecastCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#forecastAssetBody').slideToggle(200);
			return false;
		},
		
		toggleLmsCaret: function () {
			$('#lmsCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#lmsAssetBody').slideToggle(200);
			return false;
		},
		togglePortalCaret: function () {
			$('#portalCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#portalAssetBody').slideToggle(200);
			return false;
		},
		toggleMobileCaret: function () {
			$('#mobileCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#mobileAssetBody').slideToggle(200);
			return false;
		},
		toggleLimitCaret: function () {
        			$('#limitCaret').toggleClass("fa-caret-up fa-caret-down");
        			$('#limitAssetBody').slideToggle(200);
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
		togglePaymentCaret: function () {
			$('#paymentCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#paymentAssetBody').slideToggle(200);
			return false;
		},
		
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
			var strUrl = "services/userMasterDetailReport.pdf";
			form.name = 'frmMain';
			form.id = 'frmMain';
			form.method = 'POST';
			form.appendChild(createFormField('INPUT', 'HIDDEN',
					csrfTokenName, tokenValue));
			form.appendChild(createFormField('INPUT', 'HIDDEN',
					'userCode', userWorkingData.loginId));
			form.appendChild(createFormField('INPUT', 'HIDDEN',
					'userCorporation', userWorkingData.corpId));
			form.action = strUrl;
			document.body.appendChild(form);
			form.submit();
			document.body.removeChild(form);
		},
		
		footerBackLinkRef : function() {
			
			if (userWorkingData.fscEnable) {
				$('#verifyBack').attr('href', '#/SCF');
			}else if (userWorkingData.collectionEnable) {
				$('#verifyBack').attr('href', '#/Collection');
			} else if (userWorkingData.portalEnable) {
				$('#verifyBack').attr('href', '#/Portal');
			} else if (userWorkingData.payEnable) {
				$('#verifyBack').attr('href', '#/Payments');
			} else if (userWorkingData.lmsEnable) {
				$('#verifyBack').attr('href', '#/Liquidity');
			} else if (userWorkingData.limitEnable) {
				$('#verifyBack').attr('href', '#/Limit');
			} else if (userWorkingData.forecastEnable) {
				$('#verifyBack').attr('href', '#/Forecasting');
			} else if (userWorkingData.brEnable) {
				$('#verifyBack').attr('href', '#/BalanceReporting');
			}else if (userWorkingData.mobileEnable) {
				$('#verifyBack').attr('href', '#/MobileBanking');
			}else{
				$('#verifyBack').attr('href', '#/');
			}
					
		},
			
		init: function () {
			
			$('#brCaret').on('click',VerifyItem.toggleBRCaret);	
			$('#paymentCaret').on('click',VerifyItem.togglePaymentCaret);
			$('#forecastCaret').on('click',VerifyItem.toggleForecastCaret);	
			$('#lmsCaret').on('click',VerifyItem.toggleLmsCaret);
			$('#portalCaret').on('click',VerifyItem.togglePortalCaret);
			$('#mobileCaret').on('click',VerifyItem.toggleMobileCaret);	
			$('#limitCaret').on('click',VerifyItem.toggleLimitCaret);
			$('#collectionCaret').on('click',VerifyItem.toggleCollectionCaret);
			$('#supplyChainCaret').on('click',VerifyItem.toggleSCFCaret);
			
			$('#expandAll').on('click',VerifyItem.toggleExpandAll);
			$('#collapseAll').on('click',VerifyItem.toggleCollapseAll);	
			
			$('#submit').on('click',VerifyItem.submitUser);			
			$('#verifyBack').on('click',VerifyItem.back);
			
			$('#viewChanges').on('click',VerifyItem.viewChanges);
			$('#viewBack').on('click',VerifyItem.viewBack);
			$('#userReport').on('click',VerifyItem.roleReport);
		}
	};

	UsersApp.bind('UserVerifyInit', VerifyItem.init);
	
})(jQuery);