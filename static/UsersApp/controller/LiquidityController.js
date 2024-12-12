/*global jQuery, RoleDetails */

(function ($) {
	'use strict';

	var LiquidityItem = {
			
			
			toggleNotionalAgreement : function(){
				if($(this).length == 1){
					
					CommonUser.updateStore(this, 'Notional', 'chkNotional_','Liquidity');
					
					if($(this).attr('src').search("unchecked") != -1){
						$(this).attr('src',"static/images/icons/icon_checked.gif");
						var cmdVersion = commandVersion + 1 ;
		    			commandVersion += 1 ;
						UsersApp.trigger('AddUserNotional', {
							commandName: "AddUserNotional",
							path: '/usersApi/Liquidity/Agreements',
							kv: {	
								agreementCode :  $(this).data('agreementcode'),
								agreementRecKey : $(this).data('agreementreckey'),
								agreementName : $(this).data('agreementname'), 
								subsidiaryId:$(this).attr('data-subsidairyid'),
								subsidiaryName:$(this).data('subsidairyname'),
								assetId : $(this).attr('data-assetid'),
								digest :  $(this).data('digest'),
								assignedFlag : true,
					            commandVersion : cmdVersion
							}
						});
					}else{
						$(this).attr('src',"static/images/icons/icon_unchecked.gif")
						var cmdVersion = commandVersion + 1 ;
						commandVersion += 1 ;
						UsersApp.trigger('RemoveUserNotional', {
							commandName: "RemoveUserNotional",
							path: '/usersApi/Liquidity/Agreements',
							kv: {						
								agreementCode :  $(this).data('agreementcode'),
								agreementRecKey : $(this).data('agreementreckey'),
								agreementName : $(this).data('agreementname'), 
								subsidiaryId:$(this).attr('data-subsidairyid'),
								subsidiaryName:$(this).data('subsidairyname'),
								assetId : $(this).attr('data-assetid'),
								corpId : userWorkingData.corpId,
								digest :  $(this).data('digest'),
								assignedFlag : false,
					            commandVersion : cmdVersion
							}
						});
					}
					CommonUser.checkSelectAll('chkNotional_','agreementAll');
				}
			
			},
			
			toggleSweepAgreement : function(){
				if($(this).length == 1){
					var widgetId = $(this).attr('id').split("_");
					
					CommonUser.updateStore(this, 'Sweep', 'chkSweepAgreements_','Liquidity');

					if($(this).attr('src').search("unchecked") != -1){
						$(this).attr('src',"static/images/icons/icon_checked.gif");
						var cmdVersion = commandVersion + 1 ;
		    			commandVersion += 1 ;
						UsersApp.trigger('AddUserSweep', {
							commandName: "AddUserSweep",
							path: '/usersApi/Liquidity/Agreements',
							kv: {	
								agreementCode :  $(this).data('agreementcode'),
								agreementRecKey : $(this).data('agreementreckey'),
								agreementName : $(this).data('agreementname'), 
								subsidiaryId:$(this).attr('data-subsidairyid'),
								subsidiaryName:$(this).data('subsidairyname'),
								assetId : $(this).attr('data-assetid'),
								digest :  $(this).data('digest'),
								assignedFlag : true,
					            commandVersion : cmdVersion
							}
						});
					}else{
						$(this).attr('src',"static/images/icons/icon_unchecked.gif")
						var cmdVersion = commandVersion + 1 ;
						commandVersion += 1 ;
						UsersApp.trigger('RemoveUserSweep', {
							commandName: "RemoveUserSweep",
							path: '/usersApi/Liquidity/Agreements',
							kv: {						
								agreementCode :  $(this).data('agreementcode'),
								agreementRecKey : $(this).data('agreementreckey'),
								agreementName : $(this).data('agreementname'),
								subsidiaryId:$(this).attr('data-subsidairyid'),
								subsidiaryName:$(this).data('subsidairyname'), 
								assetId : $(this).attr('data-assetid'),
								corpId : userWorkingData.corpId,
								digest :  $(this).data('digest'),
								assignedFlag : false,
					            commandVersion : cmdVersion
							}
						});
					}
					CommonUser.checkSelectAll('chkSweepAgreements_','sweepAgreementAll');
				}
			
			},
	
			toggleNotionalCaret: function () {
				$('#agreementInfoCaret').toggleClass("fa-caret-up fa-caret-down");
				$('#agreementInfoDiv').slideToggle(200);
				return false;

			},
			
			toggleSweepCaret: function () {
				$('#sweepAgreementInfoCaret').toggleClass("fa-caret-up fa-caret-down");
				$('#sweepAgreementInfoDiv').slideToggle(200);
				return false;

			},
			
			
	
			toggleExpandAll: function () {
				$("[id$='Caret']").addClass("fa-caret-up");
				$("[id$='Caret']").removeClass("fa-caret-down");
				$("[id$='InfoDiv']").slideDown(200);
				return false;
			},
			
			toggleCollapseAll: function () {
				$("[id$='Caret']").addClass("fa-caret-down");
				$("[id$='Caret']").removeClass("fa-caret-up");
				$("[id$='InfoDiv']").slideUp(200);
				return false;
			},
	
		toggleNotionalAgreementAll : function(){
			if($(this).length == 1){
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkNotional_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkNotional_"]').off('click');
					
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					
					UsersApp.trigger('ApplyAllUserNotional', {
						commandName: "ApplyAllUserNotional", 
						path: '/usersApi/Liquidity/Agreements', 
						kv: {	
							assetId : "04",
							allNotionalAgreements : true,
				            commandVersion : cmdVersion
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					$('img[id^="chkNotional_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkNotional_"]').on('click',LiquidityItem.toggleNotionalAgreement);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					UsersApp.trigger('RemoveAllUserNotional', {
						commandName: "RemoveAllUserNotional", 
						path: '/usersApi/Liquidity/Agreements', 
						kv: {	
							assetId : "04",
							allNotionalAgreements : false,
				            commandVersion : cmdVersion
						}
					});
				}
			}
		
		},
		
		toggleSweepAgreementAll : function(){
			if($(this).length == 1){
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkSweepAgreements_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkSweepAgreements_"]').off('click');
					
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					
					UsersApp.trigger('ApplyAllUserSweep', {
						commandName: "ApplyAllUserSweep", 
						path: '/usersApi/Liquidity/Agreements', 
						kv: {	
							assetId : "04",
							allSweepAgreements : true,
				            commandVersion : cmdVersion
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					$('img[id^="chkSweepAgreements_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkSweepAgreements_"]').on('click',LiquidityItem.toggleSweepAgreement);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					UsersApp.trigger('RemoveAllUserSweep', {
						commandName: "RemoveAllUserSweep", 
						path: '/usersApi/Liquidity/Agreements', 
						kv: {	
							assetId : "04",
							allSweepAgreements : false,
				            commandVersion : cmdVersion
						}
					});
				}
			}
		
		},
	
		
		init: function () {
			console.log("Liquidity Service Controller recieved");		
			
			
			$('#expandAll').on('click',LiquidityItem.toggleExpandAll);
			$('#collapseAll').on('click',LiquidityItem.toggleCollapseAll);	
			
			$('img[id^="chkNotional_"]').on('click',LiquidityItem.toggleNotionalAgreement);
			$('img[id^="chkSweepAgreements_"]').on('click',LiquidityItem.toggleSweepAgreement);
			$('#agreementAll_04').on('click',LiquidityItem.toggleNotionalAgreementAll);
			$('#sweepAgreementAll_04').on('click',LiquidityItem.toggleSweepAgreementAll);
			
			$('#agreementInfoCaret').on('click',LiquidityItem.toggleNotionalCaret);
			$('#sweepAgreementInfoCaret').on('click',LiquidityItem.toggleSweepCaret);
			
		
			$('#permissionNext, #saveAndVerify').on('click', CommonUser.next);
			
		//	$('#back').on('click',BRItem.back);
			$('#btnCancelRoleEntry').on('click', CommonUser.cancel);
			
			$('label[id^="agreementAll_04"]').on('click', CommonUser.toggleLabelCheckUncheck);
			$('label[id^="sweepAgreementAll_04"]').on('click', CommonUser.toggleLabelCheckUncheck);
		}
	};

	UsersApp.bind('liquidityServiceInit', LiquidityItem.init);
	
})(jQuery);