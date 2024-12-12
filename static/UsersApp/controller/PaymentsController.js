/*global jQuery, User Details */

(function ($) {
	'use strict';

	var PaymentsItem = {
			
			toggleAcc : function(){
				if($(this).length == 1){
					var accId = $(this).attr('id').split("_");
					
					CommonUser.updateStore(this, 'Accounts', 'chkAccount_','Payments');

					if($(this).attr('src').search("unchecked") != -1){
						$(this).attr('src',"static/images/icons/icon_checked.gif");
						var cmdVersion = commandVersion + 1 ;
						commandVersion += 1 ;
						UsersApp.trigger('AddUserAccounts', {
							commandName: "AddUserAccounts",
							path: '/usersApi/Payments/Accounts',
							kv: {						
								subsidiaryId: $(this).attr('data-subsidiaryid'),
								accountName: $(this).data('accountname').toString(),
								accountId: $(this).data('accountid'),
								accountNo: $(this).attr('data-accountno'),
								subsidiaryName: $(this).data('subsidiaryname'),
								assetId: $(this).attr('data-assetid'),
								corpId : userWorkingData.corpId,
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
							path: '/usersApi/Payments/Accounts',
							kv: {						
								subsidiaryId: $(this).attr('data-subsidiaryid'),
								accountName: $(this).data('accountname').toString(),
								accountId: $(this).data('accountid'),
								accountNo: $(this).attr('data-accountno'),
								subsidiaryName: $(this).data('subsidiaryname'),
								assetId: $(this).attr('data-assetid'),
								corpId : userWorkingData.corpId,
								digest : $(this).attr('data-digest'),
								assignedFlag : false,
								commandVersion : cmdVersion	
							}
						});
					}
					CommonUser.checkSelectAll('chkAccount_','accountAll');
				}
			
			},
				
			togglePackage : function(){
				if($(this).length == 1){
				
					CommonUser.updateStore(this, 'Packages', 'chkPkg_','Payments');
					
					if($(this).attr('src').search("unchecked") != -1){
						$(this).attr('src',"static/images/icons/icon_checked.gif");
						var cmdVersion = commandVersion + 1 ;
						commandVersion += 1 ;
						UsersApp.trigger('AddUserPackages', {
							commandName: "AddUserPackages",
							path: '/usersApi/Payments/Packages',
							kv: {						
									subsidiaryId:$(this).attr('data-subsidiaryid'),
									packageName: $(this).data('packagename'),
									packageId:$(this).attr('data-packageid'),
									subsidiaryName:$(this).data('subsidiaryname'),
									bankProduct:$(this).attr('data-bankproduct'),
									assetId : $(this).attr('data-assetid'),
									corpId : userWorkingData.corpId,
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
							path: '/usersApi/Payments/Packages',
							kv: {						
									subsidiaryId:$(this).attr('data-subsidiaryid'),
									packageName: $(this).data('packagename'),
									packageId:$(this).attr('data-packageid'),
									subsidiaryName:$(this).data('subsidiaryname'),
									bankProduct:$(this).attr('data-bankproduct'),
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
			
			toggleTemplate : function(){
				if($(this).length == 1){
				
					CommonUser.updateStore(this, 'Templates', 'chkTemp_','Payments');
					
					if($(this).attr('src').search("unchecked") != -1){
						$(this).attr('src',"static/images/icons/icon_checked.gif");
						var cmdVersion = commandVersion + 1 ;
						commandVersion += 1 ;
						UsersApp.trigger('AddUserTemplates', {
							commandName: "AddUserTemplates",
							path: '/usersApi/Payments/Templates',
							kv: {						
									subsidairyId:$(this).attr('data-subsidairyid'),
									templateId: $(this).data('templateid'),
									subsidairyName:$(this).data('subsidairyname'),
									templateName:$(this).data('templatename'),
									assetId : $(this).attr('data-assetid'),
									corpId : userWorkingData.corpId,
									digest :  $(this).data('digest'),
									assignedFlag : true,
									commandVersion : cmdVersion
							}
						});
					}else{
						$(this).attr('src',"static/images/icons/icon_unchecked.gif")
						var cmdVersion = commandVersion + 1 ;
						commandVersion += 1 ;
						UsersApp.trigger('RemoveUserTemplates', {
							commandName: "RemoveUserTemplates",
							path: '/usersApi/Payments/Templates',
							kv: {						
									subsidairyId:$(this).attr('data-subsidairyid'),
									templateId: $(this).data('templateid'),
									subsidairyName:$(this).data('subsidairyname'),
									templateName:$(this).data('templatename'),
									assetId : $(this).attr('data-assetid'),
									corpId : userWorkingData.corpId,
									digest :  $(this).data('digest'),
									assignedFlag : false,
									commandVersion : cmdVersion
							}
						});
					}
					CommonUser.checkSelectAll('chkTemp_','templateAll');
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
		toggleTemplatesCaret: function () {
			$('#templateInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#templateInfoDiv').slideToggle(200);
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
						path: '/usersApi/Payments/Accounts', 
						kv: {	
							assetId : "02",
							allAccounts : true,
							commandVersion : cmdVersion	
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					$('img[id^="chkAccount_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkAccount_"]').on('click',PaymentsItem.toggleAcc);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					UsersApp.trigger('RemoveAllUserAccounts', {
						commandName: "RemoveAllUserAccounts", 
						path: '/usersApi/Payments/Accounts', 
						kv: {	
							assetId : "02",
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
						path: '/usersApi/Payments/Packages', 
						kv: {	
							assetId : "02",
							allPackages : true,
							commandVersion : cmdVersion
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					$('img[id^="chkPkg_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkPkg_"]').on('click',PaymentsItem.togglePackage);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					UsersApp.trigger('RemoveAllUserPackages', {
						commandName: "RemoveAllUserPackages", 
						path: '/usersApi/Payments/Packages', 
						kv: {	
							assetId : "02",
							allPackages : false,
							commandVersion : cmdVersion
						}
					});
				}
			}
		
		},
		
		toggleTemplateAll : function(){
			if($(this).length == 1){
				if($(this).attr('src').search("unchecked") != -1){
				//	$("#templateInfoDiv").addClass("disable");
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkTemp_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkTemp_"]').off('click');
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					UsersApp.trigger('ApplyAllUserTemplates', {
						commandName: "ApplyAllUserTemplates", 
						path: '/usersApi/Payments/Templates', 
						kv: {	
							assetId : "02",
							allTemplates : true,
							commandVersion : cmdVersion
						}
					});
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
			//		$("#templateInfoDiv").removeClass("disable");
					$('img[id^="chkTemp_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkTemp_"]').on('click',PaymentsItem.toggleTemplate);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					UsersApp.trigger('RemoveAllUserTemplates', {
						commandName: "RemoveAllUserTemplates", 
						path: '/usersApi/Payments/Templates', 
						kv: {	
							assetId : "02",
							allTemplates : false,
							commandVersion : cmdVersion
						}
					});
				}
			}
		
		},
		
		init: function () {
			console.log("BR Service Controller recieved");		
			
			$('img[id^="chkAccount_"]').on('click',PaymentsItem.toggleAcc);
			$('img[id^="chkPkg_"]').on('click',PaymentsItem.togglePackage);
			$('img[id^="chkTemp_"]').on('click',PaymentsItem.toggleTemplate);
			
			$('#accountsInfoCaret').on('click',PaymentsItem.toggleAccountsCaret);	
			$('#packagesInfoCaret').on('click',PaymentsItem.togglePackagesCaret);	
			$('#templateInfoCaret').on('click',PaymentsItem.toggleTemplatesCaret);	
			
			$('#expandAll').on('click',PaymentsItem.toggleExpandAll);
			$('#collapseAll').on('click',PaymentsItem.toggleCollapseAll);	
			
			$('#accountAll_02').on('click',PaymentsItem.toggleAccountAll);
			$('#packagesAll_02').on('click',PaymentsItem.togglePackageAll);
			$('#templateAll_02').on('click',PaymentsItem.toggleTemplateAll);
			
			$('#permissionNext, #saveAndVerify').on('click', CommonUser.next);
			$('#btnCancelRoleEntry').on('click', CommonUser.cancel);
			
			$('label[id^="accountAll_02"]').on('click', CommonUser.toggleLabelCheckUncheck);
			$('label[id^="packagesAll_02"]').on('click', CommonUser.toggleLabelCheckUncheck);
			$('label[id^="templateAll_02"]').on('click', CommonUser.toggleLabelCheckUncheck);
			
		}
	};

	UsersApp.bind('paymentsServiceInit', PaymentsItem.init);
	
})(jQuery);