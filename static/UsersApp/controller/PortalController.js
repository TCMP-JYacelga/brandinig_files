/*global jQuery, RoleDetails */
var PortalItem;
(function ($) {
	'use strict';

	PortalItem = {
			
			
		toggleAcc : function(){
			if($(this).length == 1){
				var accId = $(this).attr('id').split("_");
				
				CommonUser.updateStore(this, 'Accounts', 'chkAccount_','Portal');

				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					UsersApp.trigger('AddUserAccounts', {
						commandName: "AddUserAccounts",
						path: '/userApi/Portal/Accounts',
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
						path: '/userApi/Portal/Accounts',
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
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkAccount_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkAccount_"]').off('click');
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					UsersApp.trigger('ApplyAllUserAccounts', {
						commandName: "ApplyAllUserAccounts", 
						path: '/userApi/Portal/Accounts', 
						kv: {	
							assetId : "19",
							allAccounts : true,
							commandVersion : cmdVersion	
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					$('img[id^="chkAccount_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkAccount_"]').on('click',PortalItem.toggleAcc);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					UsersApp.trigger('RemoveAllUserAccounts', {
						commandName: "RemoveAllUserAccounts", 
						path: '/userApi/Portal/Accounts', 
						kv: {	
							assetId : "19",
							allAccounts : false,
							commandVersion : cmdVersion	
						}
					});
				}
			}
		
		},		
		updatePortalDetails:  function () {
			var validFlag = false; 
			var field = $(this);
			
			
			if(isEmpty(field.val())){
				PortalItem.portalDetails(field.attr('id'));
				var assetIndex = userWorkingData.assets.findIndex(function(obj){
					return obj.assetId == "19";
				});
				var fieldId =field.attr('id');
				if("billPayId" === fieldId){
					field.val(userWorkingData.assets[assetIndex].billPayID);
				}else if("remoteDepositeTd" === fieldId){
					field.val(userWorkingData.assets[assetIndex].remoteDepositID);
				}else if("netCaptureAdmUsrId" === fieldId){
					field.val(userWorkingData.assets[assetIndex].netCaptureAdmUsrId);
				}
				return false;
			}

				$('#errorDiv').addClass('hidden');
				var cmdVersion = commandVersion + 1 ;
				commandVersion += 1 ;
				UsersApp.trigger('UpdatePortalDetails', {
					commandName: "UpdatePortalDetails",
					path: '/usersApi/Portal/Portals',
					kv: {	
						billPayID : $('#billPayId').val(),
						remoteDepositID : $('#remoteDepositeTd').val(),
						netCaptureAdmUsrId:$('#netCaptureAdmUsrId').val(),
						assetId : "19",
			            commandVersion : cmdVersion
					}
				});
		},
		
		portalDetails : function(fieldId){
			$('#portalDetailsPopup').dialog({
				autoOpen : false,
				title: 'Message',
				maxHeight: 550,
				minHeight:'auto',
				width : 400,
				modal : true,
				resizable: false,
				draggable: false,
				open: function() {
					if (fieldId == 'billPayId') {
					  var msg = 'Bill Pay ID is required'
					}
					else if	(fieldId == 'remoteDepositeTd') {
							  var msg = 'Remote Deposit ID is required'
					}
					else if (fieldId == 'netCaptureAdmUsrId') {
							  var msg = 'NetCapture Admin User Id is required'
					}
					  $(this).html(msg);
				},
				buttons : {					
					"OK" : function() {
						$(this).dialog("close");
					},
					"Cancel" : function() {
						$(this).dialog("close");
					}
				}
			});
			$( '#portalDetailsPopup' ).dialog( 'open' );
		},
		
		validateAndVerify : function() {
			if (portalViewName && portalViewName.endsWith('Portal.hbs')) {
				if(userWorkingData.assets[0] &&  userWorkingData.assets[0].assetId == "19"){					
					
					
					if  ( $('#billPayId').is(":visible") && isEmpty( $('#billPayId').val() ) ) {
						$( '#portalDetailsPopup' ).dialog( 'destroy' );
						PortalItem.portalDetails('billPayId');
						return false;
					}
					else if ( $('#remoteDepositeTd').is(":visible") && isEmpty( $('#remoteDepositeTd').val() ) ) {
						$( '#portalDetailsPopup' ).dialog( 'destroy' );
						PortalItem.portalDetails('remoteDepositeTd');
						return false;
					}
					else if  ( $('#netCaptureAdmUsrId').is(":visible") && isEmpty( $('#netCaptureAdmUsrId').val() ) ) {
						$( '#portalDetailsPopup' ).dialog( 'destroy' );
						PortalItem.portalDetails('netCaptureAdmUsrId');
						return false;
					}
					
				}
			}
			portalViewName ="";
			CommonUser.next();
		},
		
		init: function () {
			console.log("portal Service Controller recieved");		
			
			$('img[id^="chkAccount_"]').on('click',PortalItem.toggleAcc);
			$('#accountsInfoCaret').on('click',PortalItem.toggleAccountsCaret);
			
			$('#expandAll').on('click',PortalItem.toggleExpandAll);
			$('#collapseAll').on('click',PortalItem.toggleCollapseAll);	
			
			$('#accountAll_19').on('click',PortalItem.toggleAccountAll);
		
			$('#billPayId').on('focusout',PortalItem.updatePortalDetails);
			$('#remoteDepositeTd').on('focusout',PortalItem.updatePortalDetails);
			$('#netCaptureAdmUsrId').on('focusout',PortalItem.updatePortalDetails);
		
			$('#permissionNext, #saveAndVerify').on('click', PortalItem.validateAndVerify);
			
			$('#back').on('click',PortalItem.back);
			$('#btnCancelRoleEntry').on('click', CommonUser.cancel);
			
		}
	};

	UsersApp.bind('portalServiceInit', PortalItem.init);
	
})(jQuery);