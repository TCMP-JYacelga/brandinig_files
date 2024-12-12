/*global jQuery, User Details */

(function ($) {
	'use strict';

	var ForecastingItem = {
		
			toggleAcc : function(){
			if($(this).length == 1){
				var accId = $(this).attr('id').split("_");
				
				CommonUser.updateStore(this, 'Accounts', 'chkAccount_','Forecasting');

				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					UsersApp.trigger('AddUserAccounts', {
						commandName: "AddUserAccounts",
						path: '/userApi/Forecasting/Accounts',
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
						path: '/userApi/Forecasting/Accounts',
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
				CommonUser.checkSelectAll('chkAccount_','accountAll');
			}
		
		},
			
			togglePackage : function(){
				if($(this).length == 1){
				
				CommonUser.updateStore(this, 'Packages', 'chkPkg_','Forecasting');
					
					if($(this).attr('src').search("unchecked") != -1){
						$(this).attr('src',"static/images/icons/icon_checked.gif");
						var cmdVersion = commandVersion + 1 ;
						commandVersion += 1 ;
						UsersApp.trigger('AddUserPackages', {
							commandName: "AddUserPackages",
							path: '/usersApi/Forecasting/Packages',
							kv: {						
									subsidiaryId:$(this).attr('data-subsidiaryid'),
									packageName: $(this).data('packagename'),
									packageId:$(this).data('packageid'),
									subsidiaryName:$(this).data('subsidiaryname'),
									bankProduct:$(this).data('bankproduct'),
									assetId : $(this).attr('data-assetid'),
									digest :  $(this).data('digest'),
									assignedFlag : true,
									commandVersion : cmdVersion
							}
						});
					}else{
						$(this).attr('src',"static/images/icons/icon_unchecked.gif");
						var cmdVersion = commandVersion + 1 ;
						commandVersion += 1 ;
						UsersApp.trigger('RemoveUserPackages', {
							commandName: "RemoveUserPackages",
							path: '/usersApi/Forecasting/Packages',
							kv: {						
									subsidiaryId:$(this).attr('data-subsidiaryid'),
									packageName: $(this).data('packagename'),
									packageId:$(this).data('packageid'),
									subsidiaryName:$(this).data('subsidiaryname'),
									bankProduct:$(this).data('bankproduct'),
									assetId : $(this).attr('data-assetid'),
									corpId : userWorkingData.corpId,
									digest :  $(this).data('digest'),
									assignedFlag : false,
									commandVersion : cmdVersion
							}
						});
					}
					CommonUser.checkSelectAll('chkPkg_','packagesAll');
				}
			},	
		toggleAccountsCaret: function () {
			$('#accountsInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#accountsInfoDiv').slideToggle(200);
			return false;
		},
			
		togglePackagesCaret: function () {
				$('#packagesInfoCaret').toggleClass("fa-caret-up fa-caret-down");
				$('#packagesInfoDiv').slideToggle(200);
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
						path: '/userApi/Forecasting/Accounts', 
						kv: {	
							assetId : "10",
							allAccounts : true,
							commandVersion : cmdVersion	
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					$('img[id^="chkAccount_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkAccount_"]').on('click',ForecastingItem.toggleAcc);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					UsersApp.trigger('RemoveAllUserAccounts', {
						commandName: "RemoveAllUserAccounts", 
						path: '/userApi/Forecasting/Accounts', 
						kv: {	
							assetId : "10",
							allAccounts : false,
							commandVersion : cmdVersion	
						}
					});
				}
			}
		
		},
	
		togglePackageAll : function(){
			if($(this).length == 1){
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkPkg_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkPkg_"]').off('click');
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					UsersApp.trigger('ApplyAllUserPackages', {
						commandName: "ApplyAllUserPackages", 
						path: '/usersApi/Forecasting/Packages', 
						kv: {	
							assetId : "10",
							allPackages : true,
							commandVersion : cmdVersion
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					$('img[id^="chkPkg_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkPkg_"]').on('click',SCFItem.togglePackage);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					UsersApp.trigger('RemoveAllUserPackages', {
						commandName: "RemoveAllUserPackages", 
						path: '/usersApi/Forecasting/Packages', 
						kv: {	
							assetId : "10",
							allPackages : false,
							commandVersion : cmdVersion
						}
					});
				}
			}
		
		},
		
		init: function () {
			console.log("Forecasting Service Controller recieved");		
			
			$('img[id^="chkAccount_"]').on('click',ForecastingItem.toggleAcc);
			$('img[id^="chkPkg_"]').on('click',ForecastingItem.togglePackage);

			$('#accountsInfoCaret').on('click',ForecastingItem.toggleAccountsCaret);
			$('#packagesInfoCaret').on('click',ForecastingItem.togglePackagesCaret);
			
			$('#expandAll').on('click',ForecastingItem.toggleExpandAll);
			$('#collapseAll').on('click',ForecastingItem.toggleCollapseAll);	
			
			$('#packagesAll_10').on('click',ForecastingItem.togglePackageAll);
			$('#accountAll_10').on('click',ForecastingItem.toggleAccountAll);
			
			$('#btnCancelRoleEntry').on('click', CommonUser.cancel);
			$('#permissionNext, #saveAndVerify').on('click', CommonUser.next);
			
			$('label[id^="packagesAll_10"]').on('click', CommonUser.toggleLabelCheckUncheck);
			$('label[id^="accountAll_10"]').on('click', CommonUser.toggleLabelCheckUncheck);
		}
	};

	UsersApp.bind('forecastingServiceInit', ForecastingItem.init);
	
})(jQuery);