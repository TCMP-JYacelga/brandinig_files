/*global jQuery, RoleDetails */

(function ($) {
	'use strict';
	var limitTypeId= "",limitVal="";
	var LimitItem = {

			toggleLimitType : function(){
				
				limitTypeId = $(this).attr('id');
				limitVal = $(this).val();
				$('#confirmLimitMsgPopup').dialog({
					autoOpen : false,
					title: 'Message',
					maxHeight: 550,
					minHeight:'auto',
					width : 400,
					modal : true,
					resizable: false,
					draggable: false,
					open: function() {
						  var msg = ' Defined Limit will be lost. Do you want to continue?';
						  $(this).html(msg);
					},
					buttons : {
						"Ok" : function() {
							userWorkingData.assets[0].limitType = limitVal;
							userWorkingData.assets[0].isLimitChange = true;
							$(this).dialog("close");
				        	UsersApp.trigger('renderLimit');
						},
						"Cancel" : function() {
							if(limitTypeId == "periodTypeM")
								$("#periodTypeD").prop("checked", true);
							else
								$("#periodTypeM").prop("checked", true);
							$(this).dialog("close");
						}
					}
				});
				$( '#confirmLimitMsgPopup' ).dialog( 'open' );				
			},
			
			toggleLimitEnabledFlag : function(){

				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var limId = $(this).attr('id').split("_");
					UsersApp.trigger('UpdateLimitFlag', {
						limitName: limId[1],
						defLimitType : limId[0] == "makerLimit" ? "maker" : "checker",
						limitType : $('input[name=limitType ]:checked').val(),
						status : true
					});
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif")
					var limId = $(this).attr('id').split("_");
					UsersApp.trigger('UpdateLimitFlag', {
						limitName: limId[1],
						defLimitType : limId[0] == "makerLimit" ? "maker" : "checker",
						limitType : $('input[name=limitType ]:checked').val(),
						status : false
					});

				}
			},
			
			
			changeDefaultLimit : function(){
				var defId = $(this).attr('id').split("_");
				UsersApp.trigger('UpdateDefLimit', {
					limitName: defId[1],
					limitType : $('input[name=limitType ]:checked').val(),
					defLimitType : defId[0] == "defMaker" ? "maker" : "checker",
					defLimitProfId : $( '#' + $(this).attr('id') + " option:selected" ).val() == "Select" ? null : $( '#' + $(this).attr('id') + " option:selected" ).val(),
					defLimitProfDesc  : $( '#' + $(this).attr('id') + " option:selected" ).text() == "Select" ? null : $( '#' + $(this).attr('id') + " option:selected" ).text()
				});
			},
			
			changeCustomLimitPay : function(){
				var custId = $(this).attr('id').split("_");
				UsersApp.trigger('UpdateCustLimit', {
					limitName: custId[0],
					limitType : $('input[name=limitType ]:checked').val(),
					defLimitType : custId[1],
					categorycode : $(this).attr('data-categorycode'),
					custLimitProfId : $( '#' + $(this).attr('id') + " option:selected" ).val() == "Select" ? null : $( '#' + $(this).attr('id') + " option:selected" ).val(),
					custLimitProfDesc  : $( '#' + $(this).attr('id') + " option:selected" ).text() == "Select" ? null : $( '#' + $(this).attr('id') + " option:selected" ).text(),
					custTempTypeCode : $( '#' + $(this).attr('id') + " option:selected" ).data('temptypecode'),
					custTempTypeDescription : $( '#' + $(this).attr('id') + " option:selected" ).data('temptypedesc')
				});
			},
			
			
			changeAchPassThruLimit :  function(){
				if(userWorkingData && userWorkingData.assets && userWorkingData.assets.length > 0 && userWorkingData.assets[0] && userWorkingData.assets[0].assetId == "18"){
					if($(this).attr('id') == 'makerFileLevelCreditLimitAmt')
						userWorkingData.assets[0].makerFileLevelCreditLimitAmt = $(this).autoNumeric('get');
					else if($(this).attr('id') == 'makerFileLevelDebitLimitAmt')
						userWorkingData.assets[0].makerFileLevelDebitLimitAmt = $(this).autoNumeric('get');
					else if($(this).attr('id') == 'makerBatchLevelCreditLimitAmt')
						userWorkingData.assets[0].makerBatchLevelCreditLimitAmt = $(this).autoNumeric('get');
					else if($(this).attr('id') == 'makerBatchLevelDebitLimitAmt')
						userWorkingData.assets[0].makerBatchLevelDebitLimitAmt = $(this).autoNumeric('get');
					else if($(this).attr('id') == 'makerCumulativeCreditLimitAmt')
						userWorkingData.assets[0].makerCumulativeCreditLimitAmt = $(this).autoNumeric('get');
					else if($(this).attr('id') == 'makerCumulativeDebitLimitAmt')
						userWorkingData.assets[0].makerCumulativeDebitLimitAmt = $(this).autoNumeric('get');
					
					if($(this).attr('id') == 'checkerFileLevelCreditLimitAmt')
						userWorkingData.assets[0].checkerFileLevelCreditLimitAmt = $(this).autoNumeric('get');
					else if($(this).attr('id') == 'checkerFileLevelDebitLimitAmt')
						userWorkingData.assets[0].checkerFileLevelDebitLimitAmt = $(this).autoNumeric('get');
					else if($(this).attr('id') == 'checkerBatchLevelCreditLimitAmt')
						userWorkingData.assets[0].checkerBatchLevelCreditLimitAmt = $(this).autoNumeric('get');
					else if($(this).attr('id') == 'checkerBatchLevelDebitLimitAmt')
						userWorkingData.assets[0].checkerBatchLevelDebitLimitAmt = $(this).autoNumeric('get');
					else if($(this).attr('id') == 'checkerCumulativeCreditLimitAmt')
						userWorkingData.assets[0].checkerCumulativeCreditLimitAmt = $(this).autoNumeric('get');
					else if($(this).attr('id') == 'checkerCumulativeDebitLimitAmt')
						userWorkingData.assets[0].checkerCumulativeDebitLimitAmt = $(this).autoNumeric('get');
				}
			},
			
			
			changeLimitDetail :  function(){
				
				if(userWorkingData.assets[0] &&  userWorkingData.assets[0].assetId == "18" && userWorkingData.assets[0].profileList){
					var selectedProfId = $(this).val();
					$.each(userWorkingData.assets[0].profileList,function(index,profile){
						if(profile.profileId  == selectedProfId){
							$('#currencyId').text(profile.ccyCode);
							$('#trfCrLimit').text((typeof profile.dly_trf_credit_limit_amt != 'undefined' && profile.dly_trf_credit_limit_amt)? setDigitAmtGroupFormat(profile.dly_trf_credit_limit_amt) :"");
							$('#trfDrLimit').text((typeof profile.dly_trf_debit_limit_amt != 'undefined' && profile.dly_trf_debit_limit_amt)? setDigitAmtGroupFormat(profile.dly_trf_debit_limit_amt) :"");
							$('#cmlTrfCrLimit').text((typeof profile.cl_trf_credit_limit_amt != 'undefined' && profile.cl_trf_credit_limit_amt)? setDigitAmtGroupFormat(profile.cl_trf_credit_limit_amt):"");
							$('#cmlTrfDrLimit').text((typeof profile.cl_trf_debit_limit_amt != 'undefined' && profile.cl_trf_debit_limit_amt)? setDigitAmtGroupFormat(profile.cl_trf_debit_limit_amt):"");
							$('#wrCrLimit').text((typeof profile.warn_credit_limit_amt != 'undefined' && profile.warn_credit_limit_amt)? setDigitAmtGroupFormat(profile.warn_credit_limit_amt):"");
							$('#wrDrLimit').text((typeof profile.warn_debit_limit_amt != 'undefined' && profile.warn_debit_limit_amt)? setDigitAmtGroupFormat(profile.warn_debit_limit_amt):"");
							$('#maxCountNo').text(profile.cl_max_no_trf_amt);
							return false;
						}else{
							$('#currencyId').text("");
							$('#trfCrLimit').text("");
							$('#trfDrLimit').text("");
							$('#cmlTrfCrLimit').text("");
							$('#cmlTrfDrLimit').text("");
							$('#wrCrLimit').text("");
							$('#wrDrLimit').text("");
							$('#maxCountNo').text("");
						}
					})
				}
			},
			
			updateLimitProfileNiceSelect : function(){
				if(userWorkingData.assets[0] &&  userWorkingData.assets[0].assetId == "18"){					
					$('select[id^="defMaker_"]').niceSelect('destroy');
					$('select[id^="defMaker_"]').niceSelect();
					
					$('select[id^="defChecker_"]').niceSelect('destroy');
					$('select[id^="defChecker_"]').niceSelect();

					$('select[id^="PaymentCategory_maker_"]').niceSelect('destroy');
					$('select[id^="PaymentCategory_maker_"]').niceSelect();
					$('select[id^="PaymentCategory_checker_"]').niceSelect('destroy');
					$('select[id^="PaymentCategory_checker_"]').niceSelect();
					
					$('select[id^="SecCode_maker_"]').niceSelect('destroy');
					$('select[id^="SecCode_maker_"]').niceSelect();
					$('select[id^="SecCode_checker_"]').niceSelect('destroy');
					$('select[id^="SecCode_checker_"]').niceSelect();
					
					$('select[id^="PaymentPackage_maker_"]').niceSelect('destroy');
					$('select[id^="PaymentPackage_maker_"]').niceSelect();
					$('select[id^="PaymentPackage_checker_"]').niceSelect('destroy');
					$('select[id^="PaymentPackage_checker_"]').niceSelect();
					
					$('select[id^="PaymentTemplate_maker_"]').niceSelect('destroy');
					$('select[id^="PaymentTemplate_maker_"]').niceSelect();
					$('select[id^="PaymentTemplate_checker_"]').niceSelect('destroy');
					$('select[id^="PaymentTemplate_checker_"]').niceSelect();
					
					$('#defLimitDetail').niceSelect('destroy');
					$('#defLimitDetail').niceSelect();
				}
			},
			
			updateLimitProfileList : function(){
				if(userWorkingData.assets[0] &&  userWorkingData.assets[0].assetId == "18"){
					$('#defLimitDetail').val("");

					$("#defMaker_PaymentCategory").val(userWorkingData.assets[0].defaultMakerPaymentCategoryCode);
					$("#defChecker_PaymentCategory").val(userWorkingData.assets[0].defaultCheckerPaymentCategoryCode);
					
					$("#defMaker_PaymentPackage").val(userWorkingData.assets[0].defaultMakerPackageCode);
					$("#defChecker_PaymentPackage").val(userWorkingData.assets[0].defaultCheckerPackageCode);
					
					$("#defMaker_PaymentTemplate").val(userWorkingData.assets[0].defaultMakerPaymentTemplateCode);
					$("#defChecker_PaymentTemplate").val(userWorkingData.assets[0].defaultCheckerPaymentTemplateCode);
					
					$("#defMaker_SecCode").val(userWorkingData.assets[0].defaultMakerSecCodeCode);
					$("#defChecker_SecCode").val(userWorkingData.assets[0].defaultCheckerSecCodeCode);
					
					$("#defMaker_AchRev").val(userWorkingData.assets[0].defaultMakerAchReversalCode);
					$("#defChecker_AchRev").val(userWorkingData.assets[0].defaultCheckerAchReversalCode);
					
					$("#defMaker_AchPassThruCurr").val(userWorkingData.assets[0].defaultMakerAchPassthruCCYCode);
					$("#defChecker_AchPassThruCurr").val(userWorkingData.assets[0].defaultCheckerAchPassthruCCYCode);
					
					$("#defaultMakerAchPassthruCCYCode").val(userWorkingData.assets[0].defaultMakerAchPassthruCCYCode);
					$("#defaultCheckerAchPassthruCCYCode").val(userWorkingData.assets[0].defaultCheckerAchPassthruCCYCode);
					
					if(userWorkingData.assets[0].makerPaymentCategory){
						$.each(userWorkingData.assets[0].makerPaymentCategory,function(index,cat){
							$("#PaymentCategory_maker_" + cat.categoryCode).val(cat.profileCode);
							$("#PaymentCategory_maker_" + cat.categoryCode).niceSelect('update');
						});
					}
					if(userWorkingData.assets[0].checkerPaymentCategory){
						$.each(userWorkingData.assets[0].checkerPaymentCategory,function(index,cat){
							$("#PaymentCategory_checker_" + cat.categoryCode).val(cat.profileCode);
							$("#PaymentCategory_checker_" + cat.categoryCode).niceSelect('update');
						});
					}
					
					if(userWorkingData.assets[0].makerPackage){
						$.each(userWorkingData.assets[0].makerPackage,function(index,cat){
							$("#PaymentPackage_maker_" + cat.categoryCode).val(cat.profileCode);
							$("#PaymentPackage_maker_" + cat.categoryCode).niceSelect('update');
						});						
					}
					if(userWorkingData.assets[0].checkerPackage){
						$.each(userWorkingData.assets[0].checkerPackage,function(index,cat){
							$("#PaymentPackage_checker_" + cat.categoryCode).val(cat.profileCode);
							$("#PaymentPackage_checker_" + cat.categoryCode).niceSelect('update');
						});
					}
					
					if(userWorkingData.assets[0].makerPaymentTemplete){
						$.each(userWorkingData.assets[0].makerPaymentTemplete,function(index,cat){
							$("#PaymentTemplate_maker_" + cat.categoryCode + "_" + cat.tempTypeCode).val(cat.profileCode);
							$("#PaymentTemplate_maker_" + cat.categoryCode + "_" + cat.tempTypeCode).niceSelect('update');
						});
					}
					if(userWorkingData.assets[0].checkerPaymentTemplate){
						$.each(userWorkingData.assets[0].checkerPaymentTemplate,function(index,cat){
							$("#PaymentTemplate_checker_" + cat.categoryCode + "_" + cat.tempTypeCode).val(cat.profileCode);
							$("#PaymentTemplate_checker_" + cat.categoryCode + "_" + cat.tempTypeCode).niceSelect('update');
						});
					}
					if(userWorkingData.assets[0].makerSecCode){
						$.each(userWorkingData.assets[0].makerSecCode,function(index,cat){
							$("#SecCode_maker_" + cat.categoryCode).val(cat.profileCode);
							$("#SecCode_maker_" + cat.categoryCode).niceSelect('update');
						});
					}
					if(userWorkingData.assets[0].checkerSecCode){
						$.each(userWorkingData.assets[0].checkerSecCode,function(index,cat){
							$("#SecCode_checker_" + cat.categoryCode).val(cat.profileCode);
							$("#SecCode_checker_" + cat.categoryCode).niceSelect('update');
						});
					}
					
					$('#defMaker_PaymentCategory').niceSelect('update');
					$("#defChecker_PaymentCategory").niceSelect('update');
					$('#defMaker_PaymentPackage').niceSelect('update');
					$("#defChecker_PaymentPackage").niceSelect('update');
					$('#defMaker_PaymentTemplate').niceSelect('update');
					$("#defChecker_PaymentTemplate").niceSelect('update');
					$("#defMaker_SecCode").niceSelect('update');
					$("#defChecker_SecCode").niceSelect('update');
					$("#defMaker_AchRev").niceSelect('update');
					$("#defChecker_AchRev").niceSelect('update');
					$("#defMaker_AchPassThruCurr").niceSelect('update');
					$("#defChecker_AchPassThruCurr").niceSelect('update');
					$('#defLimitDetail').niceSelect('update');
				}
			},
			
			updatePayCatNiceSelect : function(){
				$("#defMaker_PaymentCategory").niceSelect('destroy');
				$("#defMaker_PaymentCategory").niceSelect();

				$("#defChecker_PaymentCategory").niceSelect('destroy');
				$("#defChecker_PaymentCategory").niceSelect();
				
				$('select[id^="PaymentCategory_maker_"]').niceSelect('destroy');
				$('select[id^="PaymentCategory_maker_"]').niceSelect();
				$('select[id^="PaymentCategory_checker_"]').niceSelect('destroy');
				$('select[id^="PaymentCategory_checker_"]').niceSelect();
			},
			
			updatePayCatProfileList : function(){
				$("#defMaker_PaymentCategory").val(userWorkingData.assets[0].defaultMakerPaymentCategoryCode);
				$("#defChecker_PaymentCategory").val(userWorkingData.assets[0].defaultCheckerPaymentCategoryCode);
				if(userWorkingData.assets[0].makerPaymentCategory){
					$.each(userWorkingData.assets[0].makerPaymentCategory,function(index,cat){
						$("#PaymentCategory_maker_" + cat.categoryCode).val(cat.profileCode);
						$("#PaymentCategory_maker_" + cat.categoryCode).niceSelect('update');
					});
				}
				if(userWorkingData.assets[0].checkerPaymentCategory){
					$.each(userWorkingData.assets[0].checkerPaymentCategory,function(index,cat){
						$("#PaymentCategory_checker_" + cat.categoryCode).val(cat.profileCode);
						$("#PaymentCategory_checker_" + cat.categoryCode).niceSelect('update');
					});
				}
				
				
				$('#defMaker_PaymentCategory').niceSelect('update');
				$("#defChecker_PaymentCategory").niceSelect('update');
				
			},
			
			UpdatePayCatTempNiceSelect : function(){

				$("#defMaker_PaymentTemplate").niceSelect('destroy');
				$("#defMaker_PaymentTemplate").niceSelect();

				$("#defChecker_PaymentTemplate").niceSelect('destroy');
				$("#defChecker_PaymentTemplate").niceSelect();
				
				$('select[id^="PaymentTemplate_maker_"]').niceSelect('destroy');
				$('select[id^="PaymentTemplate_maker_"]').niceSelect();
				$('select[id^="PaymentTemplate_checker_"]').niceSelect('destroy');
				$('select[id^="PaymentTemplate_checker_"]').niceSelect();
			
				
			},
			
			UpdatePayCatTempProfileList : function(){
				$("#defMaker_PaymentTemplate").val(userWorkingData.assets[0].defaultMakerPaymentTemplateCode);
				$("#defChecker_PaymentTemplate").val(userWorkingData.assets[0].defaultCheckerPaymentTemplateCode);
				if(userWorkingData.assets[0].makerPaymentTemplete){
					$.each(userWorkingData.assets[0].makerPaymentTemplete,function(index,cat){
						$("#PaymentTemplate_maker_" + cat.categoryCode + "_" + cat.tempTypeCode).val(cat.profileCode);
						$("#PaymentTemplate_maker_" + cat.categoryCode + "_" + cat.tempTypeCode).niceSelect('update');
					});
				}
				if(userWorkingData.assets[0].checkerPaymentTemplate){
					$.each(userWorkingData.assets[0].checkerPaymentTemplate,function(index,cat){
						$("#PaymentTemplate_checker_" + cat.categoryCode + "_" + cat.tempTypeCode).val(cat.profileCode);
						$("#PaymentTemplate_checker_" + cat.categoryCode + "_" + cat.tempTypeCode).niceSelect('update');
					});
				}
				
				$('#defMaker_PaymentTemplate').niceSelect('update');
				$("#defChecker_PaymentTemplate").niceSelect('update');
			},
			
			UpdatePayPackageNiceSelect : function(){
				$("#defMaker_PaymentPackage").niceSelect('destroy');
				$("#defMaker_PaymentPackage").niceSelect();
				
				$("#defChecker_PaymentPackage").niceSelect('destroy');
				$("#defChecker_PaymentPackage").niceSelect();
				
				$('select[id^="PaymentPackage_maker_"]').niceSelect('destroy');
				$('select[id^="PaymentPackage_maker_"]').niceSelect();
				$('select[id^="PaymentPackage_checker_"]').niceSelect('destroy');
				$('select[id^="PaymentPackage_checker_"]').niceSelect();
			},
			
			UpdatePayPackageProfileList : function(){
				$("#defMaker_PaymentPackage").val(userWorkingData.assets[0].defaultMakerPackageCode);
				$("#defChecker_PaymentPackage").val(userWorkingData.assets[0].defaultCheckerPackageCode);
				
				if(userWorkingData.assets[0].makerPackage){
					$.each(userWorkingData.assets[0].makerPackage,function(index,cat){
						$("#PaymentPackage_maker_" + cat.categoryCode).val(cat.profileCode);
						$("#PaymentPackage_maker_" + cat.categoryCode).niceSelect('update');
					});						
				}
				if(userWorkingData.assets[0].checkerPackage){
					$.each(userWorkingData.assets[0].checkerPackage,function(index,cat){
						$("#PaymentPackage_checker_" + cat.categoryCode).val(cat.profileCode);
						$("#PaymentPackage_checker_" + cat.categoryCode).niceSelect('update');
					});
				}
				
				$('#defMaker_PaymentPackage').niceSelect('update');
				$("#defChecker_PaymentPackage").niceSelect('update');
			},
			
			UpdateSecCodeNiceSelect : function(){
				
				$("#defMaker_SecCode").niceSelect('destroy');
				$("#defMaker_SecCode").niceSelect();
				
				$("#defChecker_SecCode").niceSelect('destroy');
				$("#defChecker_SecCode").niceSelect();
				
				$('select[id^="SecCode_maker_"]').niceSelect('destroy');
				$('select[id^="SecCode_maker_"]').niceSelect();
				$('select[id^="SecCode_checker_"]').niceSelect('destroy');
				$('select[id^="SecCode_checker_"]').niceSelect();				
				
			},
			
			UpdateSecCodeProfileList : function(){
				$("#defMaker_SecCode").val(userWorkingData.assets[0].defaultMakerSecCodeCode);
				$("#defChecker_SecCode").val(userWorkingData.assets[0].defaultCheckerSecCodeCode);
				if(userWorkingData.assets[0].makerSecCode){
					$.each(userWorkingData.assets[0].makerSecCode,function(index,cat){
						$("#SecCode_maker_" + cat.categoryCode).val(cat.profileCode);
						$("#SecCode_maker_" + cat.categoryCode).niceSelect('update');
					});
				}
				if(userWorkingData.assets[0].checkerSecCode){
					$.each(userWorkingData.assets[0].checkerSecCode,function(index,cat){
						$("#SecCode_checker_" + cat.categoryCode).val(cat.profileCode);
						$("#SecCode_checker_" + cat.categoryCode).niceSelect('update');
					});	
				}
				
				$("#defMaker_SecCode").niceSelect('update');
				$("#defChecker_SecCode").niceSelect('update');
			},
			
			updateAchRevNiceSelect : function(){
				$("#defMaker_AchRev").niceSelect('destroy');
				$("#defMaker_AchRev").niceSelect();
				
				$("#defChecker_AchRev").niceSelect('destroy');
				$("#defChecker_AchRev").niceSelect();
			},
			
			updateAchRevProfileList : function(){
				$("#defMaker_AchRev").val(userWorkingData.assets[0].defaultMakerAchReversalCode);
				$("#defChecker_AchRev").val(userWorkingData.assets[0].defaultCheckerAchReversalCode);
				
				
				$("#defMaker_AchRev").niceSelect('update');
				$("#defChecker_AchRev").niceSelect('update');
			},
			
			
			/*updateAchPassThruNiceSelect : function(){
			},*/
			
			updateAchPassThruProfileList : function(){
				$("#defMaker_AchPassThruCurr").val(userWorkingData.assets[0].defaultMakerAchPassthruCCYCode);
				$("#defChecker_AchPassThruCurr").val(userWorkingData.assets[0].defaultCheckerAchPassthruCCYCode);
				
			},
			
			isChecked : function(src){
				if(src.search("unchecked") != -1){
					return false;
				}else{
					return true;
				}
			},
						
			togglePayCatMakerCaret: function () {
				$('#payCategoryMakerInfoCaret').toggleClass("fa-caret-up fa-caret-down");
				$('#payCategoryMakerInfoDiv').slideToggle(200);
				$('#payCategoryCheckerInfoCaret').toggleClass("fa-caret-up fa-caret-down");
                $('#payCategoryCheckerInfoDiv').slideToggle(200);
				return false;

			},
			
			togglePayCatCheckerCaret: function () {
				$('#payCategoryCheckerInfoCaret').toggleClass("fa-caret-up fa-caret-down");
				$('#payCategoryCheckerInfoDiv').slideToggle(200);
				 $('#payCategoryMakerInfoCaret').toggleClass("fa-caret-up fa-caret-down");
                 $('#payCategoryMakerInfoDiv').slideToggle(200);
				return false;

			},
			
			
			togglePayTemplateMakerCaret: function () {
				$('#payTemplateMakerInfoCaret').toggleClass("fa-caret-up fa-caret-down");
				$('#payTemplateMakerInfoDiv').slideToggle(200);
				$('#payTemplateCheckerInfoCaret').toggleClass("fa-caret-up fa-caret-down");
                $('#payTemplateCheckerInfoDiv').slideToggle(200);
				return false;

			},
			
			togglePayTemplateCheckerCaret: function () {
				$('#payTemplateCheckerInfoCaret').toggleClass("fa-caret-up fa-caret-down");
				$('#payTemplateCheckerInfoDiv').slideToggle(200);
				$('#payTemplateMakerInfoCaret').toggleClass("fa-caret-up fa-caret-down");
                $('#payTemplateMakerInfoDiv').slideToggle(200);
				return false;

			},
			
			toggleSecCodeMakerCaret: function () {
				$('#secCodeMakerInfoCaret').toggleClass("fa-caret-up fa-caret-down");
				$('#secCodeMakerInfoDiv').slideToggle(200);
				$('#secCodeCheckerInfoCaret').toggleClass("fa-caret-up fa-caret-down");
                $('#secCodeCheckerInfoDiv').slideToggle(200);
				return false;

			},
			
			toggleSecCodeCheckerCaret: function () {
				$('#secCodeCheckerInfoCaret').toggleClass("fa-caret-up fa-caret-down");
				$('#secCodeCheckerInfoDiv').slideToggle(200);
				$('#secCodeMakerInfoCaret').toggleClass("fa-caret-up fa-caret-down");
                $('#secCodeMakerInfoDiv').slideToggle(200);
				return false;

			},
			
			
			toggleAchRevMakerCaret: function () {
				$('#achRevMakerInfoCaret').toggleClass("fa-caret-up fa-caret-down");
				$('#achRevMakerInfoDiv').slideToggle(200);
				$('#achRevCheckerInfoCaret').toggleClass("fa-caret-up fa-caret-down");
                 $('#achRevCheckerInfoDiv').slideToggle(200);
				return false;

			},
			
			toggleAchRevCheckerCaret: function () {
				$('#achRevCheckerInfoCaret').toggleClass("fa-caret-up fa-caret-down");
				$('#achRevCheckerInfoDiv').slideToggle(200);
				$('#achRevMakerInfoCaret').toggleClass("fa-caret-up fa-caret-down");
                 $('#achRevMakerInfoDiv').slideToggle(200);
				return false;

			},
			
			
			toggleAchPassThruMakerCaret: function () {
				$('#achPassThruMakerInfoCaret').toggleClass("fa-caret-up fa-caret-down");
				$('#achPassThruMakerInfoDiv').slideToggle(200);
				$('#achPassThruCheckerInfoCaret').toggleClass("fa-caret-up fa-caret-down");
                 $('#achPassThruCheckerInfoDiv').slideToggle(200);
				return false;

			},
			
			toggleAchPassThruCheckerCaret: function () {
				$('#achPassThruCheckerInfoCaret').toggleClass("fa-caret-up fa-caret-down");
				$('#achPassThruCheckerInfoDiv').slideToggle(200);
				$('#achPassThruMakerInfoCaret').toggleClass("fa-caret-up fa-caret-down");
                $('#achPassThruMakerInfoDiv').slideToggle(200);
				return false;

			},
			
			togglePayPackageMakerCaret: function () {
				$('#payPackageMakerInfoCaret').toggleClass("fa-caret-up fa-caret-down");
				$('#payPackageMakerInfoDiv').slideToggle(200);
				$('#payPackageCheckerInfoCaret').toggleClass("fa-caret-up fa-caret-down");
                $('#payPackageCheckerInfoDiv').slideToggle(200);
				return false;

			},
			
			togglePayPackageCheckerCaret: function () {
				$('#payPackageCheckerInfoCaret').toggleClass("fa-caret-up fa-caret-down");
				$('#payPackageCheckerInfoDiv').slideToggle(200);
				$('#payPackageMakerInfoCaret').toggleClass("fa-caret-up fa-caret-down");
                 $('#payPackageMakerInfoDiv').slideToggle(200);
				return false;
			},
			
			
			toggleLimitTypeInfoCaret: function () {
				$('#limitTypeInfoCaret').toggleClass("fa-caret-up fa-caret-down");
				$('#limitTypeInfoDiv').slideToggle(200);
				return false;
			},
			
			
			toggleLimitDetailCaret: function () {
				$('#limitDetailInfoCaret').toggleClass("fa-caret-up fa-caret-down");
				$('#limitDetailInfoDiv').slideToggle(200);
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
		
		init: function () {
		    // start removing listners
		                $('#expandAll').off('click');
            			$('#collapseAll').off('click');
            			$('#limitTypeInfoCaret').off('click');
            			$('#payCategoryMakerInfoCaret').off('click' );
            			$('#payCategoryCheckerInfoCaret').off('click');
            			$('#payTemplateMakerInfoCaret').off('click' );
            			$('#payTemplateCheckerInfoCaret').off('click' );
            			$('#secCodeMakerInfoCaret').off('click' );
            			$('#secCodeCheckerInfoCaret').off('click' );
            			$('#achRevMakerInfoCaret').off('click' );
            			$('#achRevCheckerInfoCaret').off('click' );
            			$('#achPassThruMakerInfoCaret').off('click' );
            			$('#achPassThruCheckerInfoCaret').off('click' );
            			$('#payPackageMakerInfoCaret').off('click' );
            			$('#payPackageCheckerInfoCaret').off('click' );
            			$('#limitDetailInfoCaret').off('click' );

            			$('#periodTypeD, #periodTypeM').off('click');

            			$('img[id^="makerLimit_"]').off('click' );
            			$('img[id^="checkerLimit_"]').off('click' );

            			$('select[id^="defMaker_"]').off('change' );
            			$('select[id^="defChecker_"]').off('change' );
            			//$('#defMaker_AchPassThruCurr, #defChecker_AchPassThruCurr').off('change');

            			$('select[id^="PaymentCategory_"]').off('change' );
            			$('select[id^="PaymentPackage_"]').off('change' );
            			$('select[id^="PaymentTemplate_"]').off('change' );
            			$('select[id^="SecCode_"]').off('change' );

            			$('#defLimitDetail').off('change' );

            			$('#makerFileLevelDebitLimitAmt, #makerCumulativeCreditLimitAmt, #makerCumulativeDebitLimitAmt, #makerFileLevelCreditLimitAmt').off('change' );
            			$('#checkerFileLevelDebitLimitAmt, #checkerCumulativeCreditLimitAmt, #checkerCumulativeDebitLimitAmt, #checkerFileLevelCreditLimitAmt').off('change');
            			$('#permissionNext, #saveAndVerify').off('click' );
                        $('#btnCancelRoleEntry').off('click');
		    // end of remove listners
			console.log("Limit Service Controller recieved");		
			
			$('#expandAll').on('click',LimitItem.toggleExpandAll);
			$('#collapseAll').on('click',LimitItem.toggleCollapseAll);	
			
			$('#limitTypeInfoCaret').on('click',LimitItem.toggleLimitTypeInfoCaret);
			$('#payCategoryMakerInfoCaret').on('click',LimitItem.togglePayCatMakerCaret);
			$('#payCategoryCheckerInfoCaret').on('click',LimitItem.togglePayCatCheckerCaret);
			$('#payTemplateMakerInfoCaret').on('click',LimitItem.togglePayTemplateMakerCaret);
			$('#payTemplateCheckerInfoCaret').on('click',LimitItem.togglePayTemplateCheckerCaret);
			$('#secCodeMakerInfoCaret').on('click',LimitItem.toggleSecCodeMakerCaret);
			$('#secCodeCheckerInfoCaret').on('click',LimitItem.toggleSecCodeCheckerCaret);
			$('#achRevMakerInfoCaret').on('click',LimitItem.toggleAchRevMakerCaret);
			$('#achRevCheckerInfoCaret').on('click',LimitItem.toggleAchRevCheckerCaret);
			$('#achPassThruMakerInfoCaret').on('click',LimitItem.toggleAchPassThruMakerCaret);
			$('#achPassThruCheckerInfoCaret').on('click',LimitItem.toggleAchPassThruCheckerCaret);
			$('#payPackageMakerInfoCaret').on('click',LimitItem.togglePayPackageMakerCaret);
			$('#payPackageCheckerInfoCaret').on('click',LimitItem.togglePayPackageCheckerCaret);
			$('#limitDetailInfoCaret').on('click',LimitItem.toggleLimitDetailCaret);
			
			$('#periodTypeD, #periodTypeM').on('click',LimitItem.toggleLimitType);
			
			$('img[id^="makerLimit_"]').on('click',LimitItem.toggleLimitEnabledFlag);	
			$('img[id^="checkerLimit_"]').on('click',LimitItem.toggleLimitEnabledFlag);
			
			$('select[id^="defMaker_"]').on('change', LimitItem.changeDefaultLimit);
			$('select[id^="defChecker_"]').on('change', LimitItem.changeDefaultLimit);
			//$('#defMaker_AchPassThruCurr, #defChecker_AchPassThruCurr').on('change', LimitItem.changeDefaultCurrency);
			
			$('select[id^="PaymentCategory_"]').on('change', LimitItem.changeCustomLimitPay);
			$('select[id^="PaymentPackage_"]').on('change', LimitItem.changeCustomLimitPay);
			$('select[id^="PaymentTemplate_"]').on('change', LimitItem.changeCustomLimitPay);
			$('select[id^="SecCode_"]').on('change', LimitItem.changeCustomLimitPay);
			
			$('#defLimitDetail').on('change', LimitItem.changeLimitDetail);
			
			$('#makerFileLevelDebitLimitAmt, #makerFileLevelCreditLimitAmt, #makerBatchLevelCreditLimitAmt, #makerBatchLevelDebitLimitAmt, #makerCumulativeCreditLimitAmt, #makerCumulativeDebitLimitAmt').on('change', LimitItem.changeAchPassThruLimit);
			$('#checkerFileLevelDebitLimitAmt,#checkerFileLevelCreditLimitAmt,#checkerBatchLevelCreditLimitAmt, #checkerBatchLevelDebitLimitAmt, #checkerCumulativeCreditLimitAmt, #checkerCumulativeDebitLimitAmt').on('change', LimitItem.changeAchPassThruLimit);
			$('#permissionNext, #saveAndVerify').on('click', CommonUser.next);
            $('#btnCancelRoleEntry').on('click', CommonUser.cancel);

			$("[id$='Amt']").autoNumeric("init",
	 		{
	 			aSep: amountFormat.strGroupSeparator,
	 			dGroup: strAmountDigitGroup,
	 			aDec: amountFormat.strDecimalSeparator,
	 			mDec: amountFormat.strAmountMinFraction,
	 			vMin:"0.00"
	 		});


		}
	};

	UsersApp.bind('limitServiceInit', LimitItem.init);
	UsersApp.bind('UpdateLimitProfileList', LimitItem.updateLimitProfileList);
	UsersApp.bind('UpdateLimitProfileNiceSelect', LimitItem.updateLimitProfileNiceSelect);	
	UsersApp.bind('UpdatePayCatNiceSelect', LimitItem.updatePayCatNiceSelect);
	UsersApp.bind('UpdatePayCatProfileList', LimitItem.updatePayCatProfileList);	
	UsersApp.bind('UpdatePayCatTempNiceSelect', LimitItem.UpdatePayCatTempNiceSelect);
	UsersApp.bind('UpdatePayCatTempProfileList', LimitItem.UpdatePayCatTempProfileList);
	UsersApp.bind('UpdatePayPackageNiceSelect', LimitItem.UpdatePayPackageNiceSelect);
	UsersApp.bind('UpdatePayPackageProfileList', LimitItem.UpdatePayPackageProfileList);
	UsersApp.bind('UpdateSecCodeNiceSelect', LimitItem.UpdateSecCodeNiceSelect);
	UsersApp.bind('UpdateSecCodeProfileList', LimitItem.UpdateSecCodeProfileList);	
	UsersApp.bind('UpdateAchRevNiceSelect', LimitItem.updateAchRevNiceSelect);
	UsersApp.bind('UpdateAchRevProfileList', LimitItem.updateAchRevProfileList);	
	//UsersApp.bind('UpdateAchPassThruNiceSelect', LimitItem.updateAchPassThruNiceSelect);
	UsersApp.bind('UpdateAchPassThruProfileList', LimitItem.updateAchPassThruProfileList);	
	
})(jQuery);