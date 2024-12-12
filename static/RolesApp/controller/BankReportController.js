/*global jQuery, RoleDetails */

(function ($) {
	'use strict';

	var BankReportsItem = {
		
		
		toggleBankReport : function(){
			if($(this).length == 1){
				var accId = $(this).attr('id').split("_");
                CommonRole.updateStore(this, 'BankReports', 'chkBankReports_','BankReports');
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('AddBankReports', {
						commandName: "AddBankReports",
						path: '/rolesApi/BankReports',
						kv: {						
							distributionId: $(this).attr('data-distributionid'),
							reportId: $(this).data('reportid'),
							reportName: $(this).data('reportname'),
							type: $(this).data('type'),
							assetId: $(this).attr('data-assetid'),
							clientId: $(this).attr('data-clientid'),
							digest :  $(this).data('digest'),
							assignedFlag : true,
					        commandVersion : cmdVersion
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif")
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveBankReports', {
						commandName: "RemoveBankReports",
						path: '/rolesApi/BankReports',
						kv: {						
							distributionId: $(this).attr('data-distributionid'),
							reportId: $(this).data('reportid'),
							reportName: $(this).data('reportname'),
							type: $(this).data('type'),
							assetId: $(this).attr('data-assetid'),
							clientId: $(this).attr('data-clientid'),
							digest :  $(this).data('digest'),
							assignedFlag : false,
							commandVersion : cmdVersion	
						}
					});
				}
				CommonRole.checkSelectAll('chkBankReports_','bankReportAll');
			}
		
		},
			
		
		toggleBankReportCaret: function () {
			$('#bankReportsInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#bankReportsInfoDiv').slideToggle(200);
			return false;

		},
		
		
		toggleExpandAll: function () {
			$('#bankReportsInfoCaret').removeClass("fa-caret-down");
			
			$('#bankReportsInfoCaret').addClass("fa-caret-up");
			
			$('#bankReportsInfoDiv').slideDown(200);
			return false;

		},
		
		toggleCollapseAll: function () {
			$('#bankReportsInfoCaret').removeClass("fa-caret-up");
			
			$('#bankReportsInfoCaret').addClass("fa-caret-down");
			
			$('#bankReportsInfoDiv').slideUp(200);
			return false;

		},
		
		back: function () {
			if(CommonRole.getAssetStore().length > 0){
				CommonRole.next();
			}
		},
	
		
		toggleBankReportsAll : function(){
			if($(this).length == 1){
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkBankReports_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkBankReports_"]').off('click');
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('ApplyAllBankReports', {
						commandName: "ApplyAllBankReports", 
						path: '/rolesApi/BankReports', 
						kv: {	
							assetId : "15",
							assignAllBR : true,
							commandVersion : cmdVersion	
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					$('img[id^="chkBankReports_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkBankReports_"]').on('click',BankReportsItem.toggleBankReport);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveAllBankReports', {
						commandName: "RemoveAllBankReports", 
						path: '/rolesApi/BankReports', 
						kv: {	
							assetId : "15",
							assignAllBR : false,
							commandVersion : cmdVersion	
						}
					});
				}
			}
		
		},
	
		init: function () {
			console.log("Bank reports Service Controller recieved");		
			
			$('img[id^="chkBankReports_"]').on('click',BankReportsItem.toggleBankReport);
			
			$('#bankReportsInfoCaret').on('click',BankReportsItem.toggleBankReportCaret);	
			
			$('#expandAll').on('click',BankReportsItem.toggleExpandAll);
			$('#collapseAll').on('click',BankReportsItem.toggleCollapseAll);	

			$('#back').on('click',BankReportsItem.back);
			$('#bankReportAll_15').on('click',BankReportsItem.toggleBankReportsAll);		
			
			$('#permissionNext, #saveAndVerify').on('click', CommonRole.next);
			$('#btnCancelRoleEntry').on('click', CommonRole.cancel);
			
			$('label[id^="bankReportAll_15"]').on('click', CommonRole.toggleLabelCheckUncheck);
			
		}
	};

	RolesApp.bind('BankReportsServiceInit', BankReportsItem.init);
	
})(jQuery);