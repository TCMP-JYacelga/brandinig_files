/*global jQuery, RoleDetails */

(function ($) {
	'use strict';

	var BRItem = {
			

		
		
		toggleAcc : function(){
			if($(this).length == 1){
				var accId = $(this).attr('id').split("_");
				
				CommonUser.updateStore(this, 'Accounts', 'chkAccount_','BalanceReporting');

				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					UsersApp.trigger('AddUserAccounts', {
						commandName: "AddUserAccounts",
						path: '/userApi/BalanceReporting/Accounts',
						kv: {						
							subsidiaryId: $(this).attr('data-subsidiaryid'),
							accountName: $(this).data('accountname').toString(),
							accountId: $(this).data('accountid'),
							accountNo: $(this).attr('data-accountno'),
							subsidiaryName: $(this).data('subsidiaryname'),
							assetId: $(this).attr('data-assetid'),
							digest :  $(this).attr('data-digest'),
							assignedFlag : true,
					        commandVersion : cmdVersion
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif")
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					UsersApp.trigger('RemoveUserAccounts', {
						commandName: "RemoveUserAccounts",
						path: '/userApi/BalanceReporting/Accounts',
						kv: {						
							subsidiaryId: $(this).attr('data-subsidiaryid'),
							accountName: $(this).data('accountname').toString(),
							accountId: $(this).data('accountid'),
							accountNo: $(this).attr('data-accountno'),
							subsidiaryName: $(this).data('subsidiaryname'),
							assetId: $(this).attr('data-assetid'),
						    corpId : userWorkingData.corpId,
							assignedFlag : false,
							digest :  $(this).attr('data-digest'),
							commandVersion : cmdVersion	
						}
					});
				}
			}
			CommonUser.checkSelectAll('chkAccount_','accountAll');
		
		},
			
	
		
		
	
		
		toggleAccountsCaret: function () {
			$('#accountsInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#accountsInfoDiv').slideToggle(200);
			return false;

		},
		
		
		toggleExpandAll: function () {
			$('#accountsInfoCaret').removeClass("fa-caret-down");
			
			$('#accountsInfoCaret').addClass("fa-caret-up");
			
			$('#accountsInfoDiv').slideDown(200);
		return false;

		},
		
		toggleCollapseAll: function () {
			$('#accountsInfoCaret').removeClass("fa-caret-up");
			
			$('#accountsInfoCaret').addClass("fa-caret-down");
			
			$('#accountsInfoDiv').slideUp(200);
			return false;

		},
		
		toggleAccountAll : function(){
			if($(this).length == 1){
				if($(this).attr('src').search("unchecked") != -1){
			//		$("#accountsInfoDiv").addClass("disable");
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkAccount_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkAccount_"]').off('click');
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					UsersApp.trigger('ApplyAllUserAccounts', {
						commandName: "ApplyAllUserAccounts", 
						path: '/userApi/BalanceReporting/Accounts', 
						kv: {	
							assetId : "01",
							allAccounts : true,
							commandVersion : cmdVersion	
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					$('img[id^="chkAccount_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkAccount_"]').on('click',BRItem.toggleAcc);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					UsersApp.trigger('RemoveAllUserAccounts', {
						commandName: "RemoveAllUserAccounts", 
						path: '/userApi/BalanceReporting/Accounts', 
						kv: {	
							assetId : "01",
							allAccounts : false,
							commandVersion : cmdVersion	
						}
					});
				}
			}
		
		},
				
		
		init: function () {
			console.log("BR Service Controller recieved");		
			
			$('img[id^="chkAccount_"]').on('click',BRItem.toggleAcc);
			
			$('#accountsInfoCaret').on('click',BRItem.toggleAccountsCaret);	
			
			$('#expandAll').on('click',BRItem.toggleExpandAll);
			$('#collapseAll').on('click',BRItem.toggleCollapseAll);	
			
			$('#accountAll_01').on('click',BRItem.toggleAccountAll);
			
			$('#back').on('click',CommonUser.back);
			$('#btnCancelRoleEntry').on('click', CommonUser.cancel);
			$('#permissionNext, #saveAndVerify').on('click', CommonUser.next);
			
			$('label[id^="accountAll_01"]').on('click', CommonUser.toggleLabelCheckUncheck);
		}
	};

	UsersApp.bind('brServiceInit', BRItem.init);
	
})(jQuery);