/*global jQuery, User Details */

(function ($) {
	'use strict';

	var collectionItem = {
			

		toggleAcc : function(){
			if($(this).length == 1){
				var accId = $(this).attr('id').split("_");
				
				CommonUser.updateStore(this, 'Accounts', 'chkAccount_','Receivable');

				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					UsersApp.trigger('AddUserAccounts', {
						commandName: "AddUserAccounts",
						path: '/usersApi/Receivable/Accounts',
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
						path: '/usersApi/Receivable/Accounts',
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
			}
			CommonUser.checkSelectAll('chkAccount_','accountAll');
		
		},
			
		togglePackage : function(){
			if($(this).length == 1){
				
				CommonUser.updateStore(this, 'Packages', 'chkPkg_','Receivable');
				
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					UsersApp.trigger('AddUserPackages', {
						commandName: "AddUserPackages",
						path: '/usersApi/Receivable/Packages',
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
						path: '/usersApi/Receivable/Packages',
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
						path: '/usersApi/Receivable/Accounts', 
						kv: {	
							assetId : "05",
							allAccounts : true,
							commandVersion : cmdVersion	
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					$('img[id^="chkAccount_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkAccount_"]').on('click',collectionItem.toggleAcc);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					UsersApp.trigger('RemoveAllUserAccounts', {
						commandName: "RemoveAllUserAccounts", 
						path: '/usersApi/Receivable/Accounts', 
						kv: {	
							assetId : "05",
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
						path: '/usersApi/Receivable/Packages', 
						kv: {	
							assetId : "05",
							allPackages : true,
							commandVersion : cmdVersion
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					$('img[id^="chkPkg_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkPkg_"]').on('click',collectionItem.togglePackage);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					UsersApp.trigger('RemoveAllUserPackages', {
						commandName: "RemoveAllUserPackages", 
						path: '/usersApi/Receivable/Packages', 
						kv: {	
							assetId : "05",
							allPackages : false,
							commandVersion : cmdVersion
						}
					});
				}
			}
		
		},
		
		
	
		
		init: function () {
			console.log("collection Service Controller recieved");		
			
			$('img[id^="chkAccount_"]').on('click',collectionItem.toggleAcc);
			$('img[id^="chkPkg_"]').on('click',collectionItem.togglePackage);

			$('#accountsInfoCaret').on('click',collectionItem.toggleAccountsCaret);	
			$('#packagesInfoCaret').on('click',collectionItem.togglePackagesCaret);
			
			$('#expandAll').on('click',collectionItem.toggleExpandAll);
			$('#collapseAll').on('click',collectionItem.toggleCollapseAll);	
			
			$('#accountAll_05').on('click',collectionItem.toggleAccountAll);
			$('#packagesAll_05').on('click',collectionItem.togglePackageAll);
			$('#permissionNext, #saveAndVerify').on('click', CommonUser.next);
			
			$('#back').on('click',collectionItem.back);
			$('#btnCancelRoleEntry').on('click', CommonUser.cancel);
			
			$('label[id^="accountAll_05"]').on('click', CommonUser.toggleLabelCheckUncheck);
			$('label[id^="packagesAll_05"]').on('click', CommonUser.toggleLabelCheckUncheck);
			
		}
	};

	UsersApp.bind('collectionServiceInit', collectionItem.init);
	
})(jQuery);