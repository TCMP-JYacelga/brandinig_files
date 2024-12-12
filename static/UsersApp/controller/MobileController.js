/*global jQuery, RoleDetails */
var MobileItem;
var rdcFlag;
(function ($) {
	'use strict';

	MobileItem = {
			

		updateMobileDetails:  function () {
			rdcFlag = (isEmpty($('#rdcUserKey').val().trim()) == false) ? true : false;
			var validFlag = false; 
			var field = $(this);
			
			var cmdVersion = commandVersion + 1 ;
			commandVersion += 1 ;
			UsersApp.trigger('UpdateMobileDetails', {
				commandName: "UpdateMobileDetails",
				path: '/usersApi/Mobile/Mobiles',
				kv: {	
					rdcFlag : rdcFlag,
					rdcUserKey : $('#rdcUserKey').val().trim(),
					assetId : "20",
		            commandVersion : cmdVersion
				}
			});
		},
		trimUserKey : function(){
			$('#rdcUserKey').val($('#rdcUserKey').val().trim());
		},
		
		toggleRDC : function(){
			if($(this).length == 1){
				
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					rdcFlag = true;
					userWorkingData.rdcFlag = rdcFlag;
					$('#rdcUserKeyLbl').addClass('required');
					$('#rdcUserKey').removeAttr('disabled');
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					rdcFlag = false;
					userWorkingData.rdcFlag = rdcFlag;
					$('#rdcUserKey').val('');
					$('#rdcUserKey').attr('disabled','disabled');
					$('#rdcUserKey').removeClass('requiredField');
					$('#rdcUserKeyLbl').removeClass('required');
				}
				//MobileItem.updateMobileDetails();
			}
		
		},
		toggleLabelCheckUncheck: function () {
			if ($(this).length == 1) {
				var chkBoxId = '#' + $(this).attr('for');
				$(chkBoxId).click();
			}
		},
		validateAndVerify : function() {
			if (mobileViewName && mobileViewName.endsWith('MobileBanking.hbs')) {
				if(userWorkingData.assets[0] &&  userWorkingData.assets[0].assetId == "20"){
					if ((!isEmpty($('#rdcFlag').val()) && $('#rdcFlag').val() == 'Y')
							&& isEmpty($('#rdcUserKey').val())) {
						$( '#mobileDetailsPopup' ).dialog( 'destroy' );
						MobileItem.mobileDetails();
						return false;
					}
				}
			}
			mobileViewName ="";
			CommonUser.next();
		},
		
		init: function () {
			console.log("Mobile Service Controller recieved");		
			
			$('img[id^="chkRdcFlag"]').off('click' );
			$('label[id^="chkRdcFlag"]').off('click' );
			$("#rdcUserKey").on('blur', MobileItem.trimUserKey);
		
			$('#permissionNext, #saveAndVerify').on('click', MobileItem.validateAndVerify);
			
			$('#back').on('click',MobileItem.back);
			$('#btnCancelRoleEntry').on('click', CommonUser.cancel);
			
			$('img[id^="chkRdcFlag"]').on('click',MobileItem.toggleRDC);
			$('label[id^="chkRdcFlag"]').on('click', MobileItem.toggleLabelCheckUncheck);
			$('#rdcUserKey').on('focusout',MobileItem.updateMobileDetails);
		}
	};

	UsersApp.bind('mobileServiceInit', MobileItem.init);
	
})(jQuery);