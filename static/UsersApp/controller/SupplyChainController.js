/*global jQuery, User Details */

(function ($) {
	'use strict';

	var SCFItem = {
			
			togglePackage : function(){
				if($(this).length == 1){
					
					CommonUser.updateStore(this, 'Packages', 'chkPkg_','SCF');
					
					if($(this).attr('src').search("unchecked") != -1){
						$(this).attr('src',"static/images/icons/icon_checked.gif");
						var cmdVersion = commandVersion + 1 ;
						commandVersion += 1 ;
						UsersApp.trigger('AddUserPackages', {
							commandName: "AddUserPackages",
							path: '/usersApi/SCF/Packages',
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
							path: '/usersApi/SCF/Packages',
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
						path: '/usersApi/SCF/Packages', 
						kv: {	
							assetId : "06",
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
						path: '/usersApi/SCF/Packages', 
						kv: {	
							assetId : "06",
							allPackages : false,
							commandVersion : cmdVersion
						}
					});
				}
			}
		
		},
		
		init: function () {
			console.log("Forecasting Service Controller recieved");		
			
			$('img[id^="chkPkg_"]').on('click',SCFItem.togglePackage);

			$('#packagesInfoCaret').on('click',SCFItem.togglePackagesCaret);
			
			$('#expandAll').on('click',SCFItem.toggleExpandAll);
			$('#collapseAll').on('click',SCFItem.toggleCollapseAll);	
			
			$('#packagesAll_06').on('click',SCFItem.togglePackageAll);
	
			$('#btnCancelRoleEntry').on('click', CommonUser.cancel);
			$('#permissionNext, #saveAndVerify').on('click', CommonUser.next);
			$('label[id^="packagesAll_06"]').on('click', CommonUser.toggleLabelCheckUncheck);
		}
	};

	UsersApp.bind('SCFServiceInit', SCFItem.init);
	
})(jQuery);