/*global jQuery, RoleDetails */
var CommonUser;
(function ($) {
	'use strict';
	var errorMsg = "";
	CommonUser = {
		
		setQuickLink : function (e, data) {
			$('#quickLinkLists').children().each(function () {
				if($(this).attr('id') == data.id)
					$(this).children().addClass("active");
				else
					$(this).children().removeClass("active");							
			});
		},
		
		checkAssignAll : function(e, data){
			var index = data.details.assets.findIndex(function(obj){
				return obj.assetId == data.id;
        	})
        	
        	if(data.details.assets[index].allAccounts){
				$("#accountAll_"+data.id).attr('src',"static/images/icons/icon_checked.gif");
				$('img[id^="chkAccount_"]').attr('src',"static/images/icons/icon_checked.gif");
				//$('img[id^="chkAccount_"]').off('click');
				
			}
			if(data.details.assets[index].allPackages){
				$("#packagesAll_"+data.id).attr('src',"static/images/icons/icon_checked.gif");
				$('img[id^="chkPkg_"]').attr('src',"static/images/icons/icon_checked.gif");
				//$('img[id^="chkPkg_"]').off('click');
				
			}
			if(data.details.assets[index].allTemplates){
				$("#templateAll_"+data.id).attr('src',"static/images/icons/icon_checked.gif");
				$('img[id^="chkTemp_"]').attr('src',"static/images/icons/icon_checked.gif");
				//$('img[id^="chkTemp_"]').off('click');
				
			}
			if(data.details.assets[index].allNotionalAgreements){
				$("#agreementAll_"+data.id).attr('src',"static/images/icons/icon_checked.gif");
				$('img[id^="chkNotional_"]').attr('src',"static/images/icons/icon_checked.gif");
				//$('img[id^="chkNotional_"]').off('click');
				
			} 
			if(data.details.assets[index].allSweepAgreements){
				$("#sweepAgreementAll_"+data.id).attr('src',"static/images/icons/icon_checked.gif");
				$('img[id^="chkSweepAgreements_"]').attr('src',"static/images/icons/icon_checked.gif");
				//$('img[id^="chkSweepAgreements_"]').off('click');
				
			} 
		},
		

		checkAppMatrixAll : function(e, data) {
			var approveAll = false;
			if (data.details.approvalMatrix != null) {
					for (var iTemp = 0; iTemp < data.details.approvalMatrix.length; iTemp++) {
					if (!(data.details.approvalMatrix[iTemp].assignedFlag)) {
						approveAll = true;
						break;
					}
				}
			}

			if (data.details.approvalMatrix ? (data.details.approvalMatrix.length == 0 ? true : false) : false)
				approveAll = true;

			if (approveAll) {
				$("#approvalMatrixAll" + data.id).attr('src',
						"static/images/icons/icon_unchecked.gif");
			} else {
				$("#approvalMatrixAll").attr('src', "static/images/icons/icon_checked.gif");
				$('img[id^="chkApprovalMatrix_"]').attr('src', "static/images/icons/icon_checked.gif");
				//$('img[id^="chkApprovalMatrix_"]').off('click');
			}
		},
		
		checkSubsidiaryAll : function() {
			if(userWorkingData.subsidiaries ? (userWorkingData.subsidiaries.length > 1 ? true : false) : false){
				var allSubsidiary= false;
				$.each(userWorkingData.subsidiaries,function(index,subsidiary){
					if(!subsidiary.assignedFlag){
						allSubsidiary = true;
						//break;
					}
				});
				/*if(allSubsidiary){
					$('#subsidiaryAll').attr('src',"static/images/icons/icon_unchecked.gif");
				}
				else{
					$('#subsidiaryAll').attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkSubsidiary_"]').attr('src',"static/images/icons/icon_checked_grey.gif");
					$('img[id^="chkSubsidiary_"]').off('click');
				}*/
			}

			if( userWorkingData.subsidiaries ? (userWorkingData.subsidiaries.length == 1 ? true : false) : false )
			{
				if( (userWorkingData.requestState == '0' && userWorkingData.requestState == '7') || 
						userWorkingData.subsidiaries[0].assignedFlag ) {
					// allSubsideries is true
					$('#subsidiaryAll').attr('src',"static/images/icons/icon_checked_grey.gif");
	                $('img[id^="chkSubsidiary_"]').attr('src',"static/images/icons/icon_checked_grey.gif");
	                $('img[id^="chkSubsidiary_"]').off('click');
	                $('input[id^="radioSubsidiary_"]').off('click');
	                $('input[id^="radioSubsidiary_"]').prop('checked',true);
	                $('input[id^="radioSubsidiary_"]').attr('disabled', true);;
	                $('#subsidiaryAll').off('click');
				}
  }

            if(userWorkingData.languageList ? (userWorkingData.languageList.length == 1 ? true : false) : false){
                        				// allSubsideries is true
                        				$('#usrLanguage').val(userWorkingData.languageList[0].languageId);
                                        $('#usrLanguage').prop('disabled',true);
                                        $('#usrLanguage').niceSelect('update');
                                        userWorkingData.usrLanguage=userWorkingData.languageList[0].languageId;
            }

		},
		
		toggleLabelCheckUncheck: function () {
			if ($(this).length == 1) {
				var chkBoxId = '#' + $(this).attr('for');
				$(chkBoxId).click();
			}
		},
		
		next : function(){
			userCommand = CommonUserObj.getAssetStore();
			//console.log(this.getViewName());
			
			//Exception Case For Limit
			if(limitViewName && limitViewName.endsWith('Limit.hbs')){
				var path = ""
				if(userWorkingData.assets[0] &&  userWorkingData.assets[0].assetId == "18"){
					
					if(CommonUser.isValidLimit(userWorkingData.assets[0])){
						delete userWorkingData.assets[0].profileList;
						delete userWorkingData.assets[0].currencyList;
						delete userWorkingData.assets[0].isLimitChange;
						
						if(userWorkingData.assets[0].limitType == "D")
							path = '/userApi/Limits/DailyLimit'; 
						else
							path = '/userApi/Limits/MonthlyLimit';
						
						var limitObj = {
							commandName: "UserLimitsUpdateCommand",
							path: path,
							kv: {			
								userLimits : JSON.stringify(userWorkingData.assets[0]),
								userId : userWorkingData.loginId,
								assetId : userWorkingData.assets[0].assetId,
								corpId : userWorkingData.corpId,
								roleId : userWorkingData.usrRoleId,
								recordKeyNo : userWorkingData.recordKeyNo,
								commandVersion : CommonUser.getCommandVersion()
							}
						};
						
						limitStore =[];
						limitStore.push(limitObj);
						console.log("Limit Store Updated");
						console.log(limitStore);
						userCommand = CommonUserObj.getAssetStore();
						limitViewName = "";
						$('#errorPara').append("");
						$('#errorDiv').addClass('hidden');
					}else{						
						$('#errorDiv').removeClass('hidden');
						 $("html,body").scrollTop(0);
						if(event)
				            event.preventDefault();
					}
					
				}
			}
			
			if(userCommand.length > 0 ){
				var assetId = userCommand[0].kv.assetId;
				UsersApp.trigger('SaveAsset', {assetId: assetId} );				
			}			
		},	
		
		
		
		isValidLimit : function(limitNode){
			var validate = true;
			$('#errorPara').html("")
			
			if(limitNode.makerPaymentCategoryEnabled){
				var oneValueEnbaled = false;

				if(limitNode.makerPaymentCategory){
				var arrayLength = limitNode.makerPaymentCategory.length;
				for (var i = 0; i < arrayLength; i++) {
				    if(limitNode.makerPaymentCategory[i].profileCode != null && limitNode.makerPaymentCategory[i].profileCode !="" && limitNode.makerPaymentCategory[i].profileCode !="Select"){
					oneValueEnbaled = true;
					}
				}
				}
			if((null == limitNode.defaultMakerPaymentCategoryCode || undefined == limitNode.defaultMakerPaymentCategoryCode || limitNode.defaultMakerPaymentCategoryCode == "") && !oneValueEnbaled ){
				$('#errorPara').append(getLabel("errMakerDef","Maker Default Limit for Payment Category is required.")+" </br> ");
				validate = false;
			}
			}
			
			if(limitNode.checkerPaymentCategoryEnabled){
				var oneValueCheckerPC = false;
				var arrayLength = limitNode.checkerPaymentCategory.length;
				for (var i = 0; i < arrayLength; i++) {
				    if(limitNode.checkerPaymentCategory[i].profileCode != null && limitNode.checkerPaymentCategory[i].profileCode !="" && limitNode.checkerPaymentCategory[i].profileCode !="Select"){
				    	oneValueCheckerPC = true;
					}
				}
				if( (null == limitNode.defaultCheckerPaymentCategoryCode || undefined == limitNode.defaultCheckerPaymentCategoryCode || limitNode.defaultCheckerPaymentCategoryCode == "" ) && !oneValueCheckerPC ){
		        	$('#errorPara').append(getLabel("errCheckerDef","Checker Default Limit for Payment Category is required.")+" </br> ");
					validate = false;
				}
			}
			
			if(limitNode.makerPaymentTemplateEnabled){
				var oneValueMakerPTEnable = false; 
				var arrayLength = limitNode.makerPaymentTemplete.length;
				for (var i = 0; i < arrayLength; i++) {
				    if(limitNode.makerPaymentTemplete[i].profileCode != null && limitNode.makerPaymentTemplete[i].profileCode !="" && limitNode.makerPaymentTemplete[i].profileCode !="Select"){
				    	oneValueMakerPTEnable = true;
					}
				}
				if(( null == limitNode.defaultMakerPaymentTemplateCode || undefined == limitNode.defaultMakerPaymentTemplateCode || limitNode.defaultMakerPaymentTemplateCode == "") && !oneValueMakerPTEnable ){
					$('#errorPara').append(getLabel("errMakerDefPT","Maker Default Limit for Product Category-Template Type is required.")+" </br> ");
					validate = false;
				}
			}

			if(limitNode.checkerPaymentTemplateEnabled){
				var oneValueCheckerPTEnable = false;
				var arrayLength = limitNode.checkerPaymentTemplate.length;
				for (var i = 0; i < arrayLength; i++) {
				    if(limitNode.checkerPaymentTemplate[i].profileCode != null && limitNode.checkerPaymentTemplate[i].profileCode !="" && limitNode.checkerPaymentTemplate[i].profileCode !="Select"){
				    	oneValueCheckerPTEnable = true;
					}
				}
				if((null == limitNode.defaultCheckerPaymentTemplateCode || undefined == limitNode.defaultCheckerPaymentTemplateCode || limitNode.defaultCheckerPaymentTemplateCode == "") && !oneValueCheckerPTEnable ){
		        	$('#errorPara').append(getLabel("errcheckerDefPT","Checker Default Limit for Product Category-Template Type is required.")+" </br> ");
					validate = false;
				}
			}

			if(limitNode.makerSecCodeEnabled){
				var oneValueMakerSecEnable = false;
				var arrayLength = limitNode.makerSecCode.length;
				for (var i = 0; i < arrayLength; i++) {
				    if(limitNode.makerSecCode[i].profileCode != null && limitNode.makerSecCode[i].profileCode !="" && limitNode.makerSecCode[i].profileCode !="Select"){
				    	oneValueMakerSecEnable = true;
					}
				}
				if((null == limitNode.defaultMakerSecCode || undefined == limitNode.defaultMakerSecCode || limitNode.defaultMakerSecCode == "") && !oneValueMakerSecEnable ){
		        	$('#errorPara').append(getLabel("errMakerSec","Maker Default Limit for Sec Codes is required.")+" </br> ");
					validate = false;
				}
			}

			if(limitNode.checkerSecCodeEnabled){
				var oneValueCheckerSecEnable = false;
				var arrayLength = limitNode.checkerSecCode.length;
				for (var i = 0; i < arrayLength; i++) {
				    if(limitNode.checkerSecCode[i].profileCode != null && limitNode.checkerSecCode[i].profileCode !="" && limitNode.checkerSecCode[i].profileCode !="Select"){
				    	oneValueCheckerSecEnable = true;
					}
				}
				if(( null == limitNode.defaultCheckerSecCode || undefined == limitNode.defaultCheckerSecCode || limitNode.defaultCheckerSecCode == "") && !oneValueCheckerSecEnable){
		        	$('#errorPara').append(getLabel("errCheckerSec","Checker Default for Limit for Sec Codes is required.")+" </br> ");
					validate = false;
				}
			}

			if(limitNode.makerPackageEnabled){
				
				var oneValueMakerPackageEnable = false;
				if(undefined != limitNode.makerPackage)
				{
					var arrayLength = limitNode.makerPackage.length;
					for (var i = 0; i < arrayLength; i++) {
					    if(limitNode.makerPackage[i].profileCode != null && limitNode.makerPackage[i].profileCode !="" && limitNode.makerPackage[i].profileCode !="Select"){
					    	oneValueMakerPackageEnable = true;
						}
					}
				}
				
				if((null == limitNode.defaultMakerPackageCode || undefined == limitNode.defaultMakerPackageCode || limitNode.defaultMakerPackageCode == "")  && !oneValueMakerPackageEnable ){
		        	$('#errorPara').append(getLabel("errMakerDfPack","Maker Default Limit for Payment Packages is required.")+" </br> ");
					validate = false;
				}
			}

			if(limitNode.checkerPackageEnabled){
				
				var oneValueCheckerPackageEnable = false;
				
				if(undefined != limitNode.checkerPackage)
				{
					var arrayLength = limitNode.checkerPackage.length;
					for (var i = 0; i < arrayLength; i++) {
					    if(limitNode.checkerPackage[i].profileCode != null && limitNode.checkerPackage[i].profileCode !="" && limitNode.checkerPackage[i].profileCode !="Select"){
					    	oneValueCheckerPackageEnable = true;
						}
					}
				}
				
				if((null == limitNode.defaultCheckerPackageCode || undefined == limitNode.defaultCheckerPackageCode || limitNode.defaultCheckerPackageCode == "") && !oneValueCheckerPackageEnable ){
		        	$('#errorPara').append(getLabel("errChekerDfPack","Checker Default Limit for Payment Packages is required.")+" </br> ");
					validate = false;
				}
			}

			if(limitNode.makerAchReversalEnabled){
				if( null == limitNode.defaultMakerAchReversalCode || undefined == limitNode.defaultMakerAchReversalCode || limitNode.defaultMakerAchReversalCode == "" ){
		        	$('#errorPara').append(getLabel("errMakerDefACH","Maker Default Limit for ACH Reversal is required.")+" </br> ");
					validate = false;
				}
			}

			if(limitNode.checkerAchReversalEnabled){
				if( null == limitNode.defaultCheckerAchReversalCode || undefined == limitNode.defaultCheckerAchReversalCode || limitNode.defaultCheckerAchReversalCode == "" ){
		        	$('#errorPara').append(getLabel("errCheckerDefACH","Checker Default Limit for ACH Reversal is required.")+" </br> ");
					validate = false;
				}
			}

			if(limitNode.makerAchPassthruEnabled){
				if( null == limitNode.defaultMakerAchPassthruCCYCode || undefined == limitNode.defaultMakerAchPassthruCCYCode || limitNode.defaultMakerAchPassthruCCYCode == "" ){
		        	$('#errorPara').append(getLabel("errMakerPassth","Maker  For ACH PassThru is required.")+" </br> ");
					validate = false;
				}
				if( (null != limitNode.defaultMakerAchPassthruCCYCode && limitNode.defaultMakerAchPassthruCCYCode != "")
						&& !(((null != limitNode.makerFileLevelDebitLimitAmt && limitNode.makerFileLevelDebitLimitAmt != "") && undefined != limitNode.makerFileLevelDebitLimitAmt ) 
						/* || ((null != limitNode.makerBatchLevelCreditLimitAmt && limitNode.makerBatchLevelCreditLimitAmt != "")&& undefined != limitNode.makerBatchLevelCreditLimitAmt )
						 || ((null != limitNode.makerBatchLevelDebitLimitAmt && limitNode.makerBatchLevelDebitLimitAmt != "")&& undefined != limitNode.makerBatchLevelDebitLimitAmt )*/
						 || ((null != limitNode.makerCumulativeCreditLimitAmt && limitNode.makerCumulativeCreditLimitAmt != "")&& undefined != limitNode.makerCumulativeCreditLimitAmt )
						 || ((null != limitNode.makerCumulativeDebitLimitAmt && limitNode.makerCumulativeDebitLimitAmt != "")&& undefined != limitNode.makerCumulativeDebitLimitAmt )
						 || (( null != limitNode.makerFileLevelCreditLimitAmt && limitNode.makerFileLevelCreditLimitAmt != "")&& undefined != limitNode.makerFileLevelCreditLimitAmt ))
					  ){
							$('#errorPara').append(getLabel("errMakerOnePassth","Atleast one Maker Limit For ACH PassThru is required.")+"</br> ");
							validate = false;
					}
				
				if( (null != limitNode.defaultMakerAchPassthruCCYCode && limitNode.defaultMakerAchPassthruCCYCode != "")
					&& !(((null != limitNode.makerFileLevelDebitLimitAmt && limitNode.makerFileLevelDebitLimitAmt != "") && undefined != limitNode.makerFileLevelDebitLimitAmt ) ? limitNode.makerFileLevelDebitLimitAmt > "0" ? true : false : true
					 /*&& ((null != limitNode.makerBatchLevelCreditLimitAmt && limitNode.makerBatchLevelCreditLimitAmt != "")&& undefined != limitNode.makerBatchLevelCreditLimitAmt ) ? limitNode.makerBatchLevelCreditLimitAmt > "0" ? true : false : true
					 && ((null != limitNode.makerBatchLevelDebitLimitAmt && limitNode.makerBatchLevelDebitLimitAmt != "")&& undefined != limitNode.makerBatchLevelDebitLimitAmt ) ? limitNode.makerBatchLevelDebitLimitAmt > "0" ? true : false : true*/
					 && ((null != limitNode.makerCumulativeCreditLimitAmt && limitNode.makerCumulativeCreditLimitAmt != "")&& undefined != limitNode.makerCumulativeCreditLimitAmt ) ? limitNode.makerCumulativeCreditLimitAmt > "0" ? true : false : true
					 && ((null != limitNode.makerCumulativeDebitLimitAmt && limitNode.makerCumulativeDebitLimitAmt != "")&& undefined != limitNode.makerCumulativeDebitLimitAmt ) ? limitNode.makerCumulativeDebitLimitAmt > "0" ? true : false : true
					 && (( null != limitNode.makerFileLevelCreditLimitAmt && limitNode.makerFileLevelCreditLimitAmt != "")&& undefined != limitNode.makerFileLevelCreditLimitAmt )? limitNode.makerFileLevelCreditLimitAmt > "0" ? true : false : true)
				  ){
						$('#errorPara').append(getLabel("errMakergrezPassth","Maker Limit For ACH PassThru should be greater than zero.")+" </br> ");
						validate = false;
				}
			}

			if(limitNode.checkerAchPassthruEnabled){
				if( null == limitNode.defaultCheckerAchPassthruCCYCode || undefined == limitNode.defaultCheckerAchPassthruCCYCode || limitNode.defaultCheckerAchPassthruCCYCode == "" ){
		        	$('#errorPara').append(getLabel("errCheckerPassthReq","Checker  For ACH PassThru is required.")+" </br> ");
					validate = false;
				}
				if(( null != limitNode.defaultCheckerAchPassthruCCYCode && limitNode.defaultCheckerAchPassthruCCYCode != "" )
						&& !((null != limitNode.checkerFileLevelDebitLimitAmt && limitNode.checkerFileLevelDebitLimitAmt != "" && undefined != limitNode.checkerFileLevelDebitLimitAmt )
						 || (null != limitNode.checkerCumulativeCreditLimitAmt && undefined != limitNode.checkerCumulativeCreditLimitAmt && limitNode.checkerCumulativeCreditLimitAmt != "")
						 || (null != limitNode.checkerCumulativeDebitLimitAmt && undefined != limitNode.checkerCumulativeDebitLimitAmt && limitNode.checkerCumulativeDebitLimitAmt != "") 
						 || (null != limitNode.checkerFileLevelCreditLimitAmt && undefined != limitNode.checkerFileLevelCreditLimitAmt && limitNode.checkerFileLevelCreditLimitAmt != ""))
					){
						$('#errorPara').append(getLabel("errOneCheckerPassR","Atleast one Checker Limit For ACH PassThru is required.")+" </br> ");
						validate = false;
					}
				
				if(( null != limitNode.defaultCheckerAchPassthruCCYCode && limitNode.defaultCheckerAchPassthruCCYCode != "" )
					&& !((null != limitNode.checkerFileLevelDebitLimitAmt && limitNode.checkerFileLevelDebitLimitAmt != "" && undefined != limitNode.checkerFileLevelDebitLimitAmt ) ? limitNode.checkerFileLevelDebitLimitAmt > "0" ? true : false : true
					 && (null != limitNode.checkerCumulativeCreditLimitAmt && undefined != limitNode.checkerCumulativeCreditLimitAmt && limitNode.checkerCumulativeCreditLimitAmt != "") ? limitNode.checkerCumulativeCreditLimitAmt > "0" ? true : false : true
					 && (null != limitNode.checkerCumulativeDebitLimitAmt && undefined != limitNode.checkerCumulativeDebitLimitAmt && limitNode.checkerCumulativeDebitLimitAmt != "") ? limitNode.checkerCumulativeDebitLimitAmt > "0" ? true : false : true
					 && (null != limitNode.checkerFileLevelCreditLimitAmt && undefined != limitNode.checkerFileLevelCreditLimitAmt && limitNode.checkerFileLevelCreditLimitAmt != "") ? limitNode.checkerFileLevelCreditLimitAmt > "0" ? true : false : true)
				){
					$('#errorPara').append(getLabel("errCheckPassLim0","Checker Limit For ACH PassThru should be greater than zero.")+" </br> ");
					validate = false;
				}
			}
			return validate;
		},

		nextLinkRef : function(e, data) {
			var assetRefStore =[];

			if (data.details.brEnable) {
				assetRefStore.push('BalanceReporting');
			}
			
			if (data.details.forecastEnable) {
				assetRefStore.push('Forecasting');
			}
			if (data.details.limitEnable) {
				assetRefStore.push('Limit');
			}
			if (data.details.lmsEnable) {
				assetRefStore.push('Liquidity');
			}
			if (data.details.mobileEnble) {
				assetRefStore.push('MobileBanking');
			}
			if (data.details.payEnable) {
				assetRefStore.push('Payments');
			}
			if (data.details.portalEnable) {
				assetRefStore.push('Portal');
			}
			if (data.details.collectionEnable) {
				assetRefStore.push('Collection');
			}
			if (data.details.fscEnable) {
				assetRefStore.push('SCF');
			}

			var detailviewName = data.viewName.split("/")[3];
			var viewName;
        	var index;

			 for (var i = 0; i < assetRefStore.length; i++) {

				    if (assetRefStore[i] == detailviewName.split(".")[0]) {
				    		index = i;
				    	break;
				    }
			}
			 if((index+1) == assetRefStore.length){
				 viewName = "Verify";
				 var lblVerify = CommonUser.getLabel('lbl.clientUser.btnverify','Verify');
				 $('#saveAndVerify').hide();
				 $('#permissionNext').text(lblVerify);
			 }
			 else{
				 viewName = assetRefStore[index+1];
				 var lblNext = CommonUser.getLabel('lbl.clientUser.btnNext','Next');
				  $('#permissionNext').text(lblNext);
				 $('#saveAndVerify').show();
			 }

			var nextViewName ="#/" +(viewName);
        	$('#permissionNext').attr('href', nextViewName);

        	assetRefStore =[];

		},

		back: function () {
        	if(CommonUserObj.getAssetStore().length > 0){
				CommonUser.next();
			}
		},

		getCommandVersion : function(){
			var cmdVersion = commandVersion + 1 ;
			commandVersion += 1 ;
			return cmdVersion;
		},
		getLabel :  function (key, defaultText) {
			return (clientUserLabelsMap && clientUserLabelsMap[key]) ? clientUserLabelsMap[key]
				: defaultText
		},
		getStringWithSpecialChars :  function (key) {
			return key.replace(/&amp;/g, '&')
	        .replace(/&lt;/g, '<')
	        .replace(/&gt;/g, '>')
	        .replace(/&quot;/g, '"')
	        .replace(/&apos;/g, "'")
	        .replace(/&#39;/g, "'")
			.replace(/&#039;/g, "'")
			.replace(/&#034;/g,'"')
			.replace(/&#34;/g,'"');
		},
		cancel : function(){
			var buttonsOpts = {};
			buttonsOpts[CommonUser.getLabel('lbl.btncontinue','Continue')] = function() {
				window.location = 'userAdminList.form';
			};
			buttonsOpts[CommonUser.getLabel('lbl.clientUser.btnCancel','Cancel')] = function() {
				$(this).dialog("close");
			};
			$('#confirmMsgPopup').dialog({
				autoOpen : false,
				title: CommonUser.getLabel('lbl.clientUser.title','Message'),
				maxHeight: 550,
				minHeight:'auto',
				width : 400,
				modal : true,
				resizable: false,
				draggable: false,
				open: function() {
					  var msg = CommonUser.getLabel('lbl.conf.message','Any changes made by you will be lost, Do you want to continue?');
					  $(this).html(msg);
				},
				buttons : buttonsOpts
			});
			$( '#confirmMsgPopup' ).dialog( 'open' );
			if(event)			
			event.preventDefault();
		},
		
		checkSelectAll : function(checkBoxItemId, selectAllCheckBoxId) {
			var allChecked = true;

			$('img[id^="'+checkBoxItemId+'"]').each(function (){
				if($(this).attr('src').search("unchecked") != -1){
					allChecked = false;
					return;
				}	
			});
			
			if(allChecked) {
				$('img[id^="'+selectAllCheckBoxId+'"]').trigger('click')
				//$("#selectAllCheckBoxId").trigger('click');
			} else {
				$('img[id^="'+selectAllCheckBoxId+'"]').attr('src',"static/images/icons/icon_unchecked.gif");
			}
		},
		
		
		updateStore: function(element, roleCardType, checkBoxItemId, moduleName) {

			if ($(element).attr('src').search("unchecked") != -1) {
				return;
			}

			commandVersion += 1;

			if (roleCardType == 'Alerts' && alertCount == alertsAssignedCount) {
				UsersApp.trigger('RemoveAllAlerts', {
					commandName: "RemoveAllAlerts",
					path: '/userApi/' + moduleName + '/Alerts',
					kv: {
						assetId: "03",
						assignAllAlerts: false,
						commandVersion: commandVersion
					}
				});

				$('img[id^="' + checkBoxItemId + '"]').each(function(index, ele) {
					if (!($(ele).attr('src').search("unchecked") != -1)) {
						commandVersion += 1;
						UsersApp.trigger('AddAlerts', {
							commandName: "AddAlerts",
							path: '/userApi/' + moduleName + '/Alerts',
							kv: {
								alertId: $(ele).data('alertid'),
								alertType: $(ele).data('alerttype'),
								assetId: $(ele).attr('data-assetid'),
								digest: $(ele).data('digest'),
								assignedFlag: true,
								commandVersion: commandVersion
							}
						});
					}
				});
			} else if (roleCardType == 'Widgets' && widgetsCount == widgetsAssignedCount) {
				UsersApp.trigger('RemoveAllWidgets', {
					commandName: "RemoveAllWidgets",
					path: '/userApi/' + moduleName + '/Widgets',
					kv: {
						assetId: "03",
						assignAllWidgets: false,
						commandVersion: commandVersion
					}
				});

				$('img[id^="' + checkBoxItemId + '"]').each(function(index, ele) {
					if (!($(ele).attr('src').search("unchecked") != -1)) {
						commandVersion += 1;
						UsersApp.trigger('AddWidgets', {
							commandName: "AddWidgets",
							path: '/userApi/' + moduleName + '/Widgets',
							kv: {
								widgetId: $(ele).data('widgetid'),
								widgetType: $(ele).data('widgettype'),
								assetId: $(ele).attr('data-assetid'),
								digest: $(ele).data('digest'),
								assignedFlag: true,
								commandVersion: commandVersion
							}
						});
					}
				});
			} else if (roleCardType == 'Accounts' && accountsCount == accountsAssignedCount) {
				UsersApp.trigger('RemoveAllAccounts', {
					commandName: "RemoveAllUserAccounts",
					path: '/userApi/' + moduleName + '/Accounts',
					kv: {
						assetId: "02",
						assignAllAccounts: false,
						commandVersion: commandVersion
					}
				});

				$('img[id^="' + checkBoxItemId + '"]').each(function(index, ele) {
					if (!($(ele).attr('src').search("unchecked") != -1)) {
						commandVersion += 1;
						UsersApp.trigger('AddAccounts', {
							commandName: "AddUserAccounts",
							path: '/userApi/' + moduleName + '/Accounts',
							kv: {
								subsidiaryId: $(ele).attr('data-subsidiaryid'),
								accountName: $(ele).data('accountname'),
								accountId: $(ele).attr('data-accountid'),
								accountNo: $(ele).attr('data-accountno'),
								subsidiaryName: $(ele).data('subsidiaryname'),
								assetId: $(ele).attr('data-assetid'),
								digest: $(ele).data('digest'),
								assignedFlag: true,
								commandVersion: commandVersion
							}
						});
					}
				});
			} else if (roleCardType == 'Reports' && reportsCount == reportsAssignedCount) {
				UsersApp.trigger('RemoveAllReports', {
					commandName: "RemoveAllReports",
					path: '/userApi/' + moduleName + '/Reports',
					kv: {
						assetId: "03",
						assignAllReports: false,
						commandVersion: commandVersion
					}
				});

				$('img[id^="' + checkBoxItemId + '"]').each(function(index, ele) {
					if (!($(ele).attr('src').search("unchecked") != -1)) {
						commandVersion += 1;
						UsersApp.trigger('AddReports', {
							commandName: "AddReports",
							path: '/userApi/' + moduleName + '/Reports',
							kv: {
								reportId: $(ele).data('reportid'),
								reportType: $(ele).data('reporttype'),
								assetId: $(ele).attr('data-assetid'),
								digest: $(ele).data('digest'),
								assignedFlag: true,
								commandVersion: commandVersion
							}
						});
					}
				});
			} else if (roleCardType == 'Packages' && packagesCount == packagesAssignedCount) {

				UsersApp.trigger('RemoveAllPackages', {
					commandName: "RemoveAllUserPackages",
					path: '/userApi/' + moduleName + '/Packages',
					kv: {
						assetId: "02",
						assignAllPackages: false,
						commandVersion: commandVersion
					}
				});

				$('img[id^="' + checkBoxItemId + '"]').each(function(index, ele) {
					if (!($(ele).attr('src').search("unchecked") != -1)) {
						commandVersion += 1;
						UsersApp.trigger('AddPackages', {
							commandName: "AddUserPackages",
							path: '/userApi/' + moduleName + '/Packages',
							kv: {
								subsidiaryId: $(ele).attr('data-subsidiaryid'),
								packageName: $(ele).data('packagename'),
								packageId: $(ele).attr('data-packageid'),
								subsidiaryName: $(ele).data('subsidiaryname'),
								productCatType: $(ele).data('productcattype'),
								assetId: $(ele).attr('data-assetid'),
								digest: $(ele).data('digest'),
								assignedFlag: true,
								commandVersion: commandVersion
							}
						});
					}
				});
			} else if (roleCardType == 'Messages' && messagesCount == messagesAssignedCount) {

				UsersApp.trigger('RemoveAllMessages', {
					commandName: "RemoveAllMessages",
					path: '/userApi/' + moduleName + '/Messages',
					kv: {
						assetId: "03",
						assignAllMessages: false,
						commandVersion: commandVersion
					}
				});
				$('img[id^="' + checkBoxItemId + '"]').each(function(index, ele) {
					if (!($(ele).attr('src').search("unchecked") != -1)) {
						commandVersion += 1;
						UsersApp.trigger('AddMessages', {
							commandName: "AddMessages",
							path: '/userApi/' + moduleName + '/Messages',
							kv: {
								messageId: $(ele).data('messageid'),
								messageType: $(ele).data('messagetype'),
								assetId: $(ele).attr('data-assetid'),
								digest: $(ele).data('digest'),
								assignedFlag: true,
								commandVersion: commandVersion
							}
						});

					}
				});
			} else if (roleCardType == 'Notional' && notionalAgreementsCount == notionalAgreementsAssignedCount) {

				UsersApp.trigger('RemoveAllNotional', {
					commandName: "RemoveAllUserNotional", 
					path: '/userApi/' + moduleName + '/Agreements', 
					kv: {	
						assetId : "04",
						assignAllNotionals : false,
			            commandVersion : commandVersion
					}
				});
				
				$('img[id^="' + checkBoxItemId + '"]').each(function(index, ele) {
					if (!($(ele).attr('src').search("unchecked") != -1)) {
						commandVersion += 1;
						UsersApp.trigger('AddNotional', {
							commandName: "AddUserNotional",
							path: '/userApi/' + moduleName + '/Agreements',
							kv: {	
								agreementCode :  $(ele).data('agreementcode'),
								agreementName : $(ele).data('agreementname'), 
								assetId : $(ele).attr('data-assetid'),
								subsidiaryId:$(ele).attr('data-subsidairyid'),
								subsidiaryName:$(ele).data('subsidairyname'),
								digest :  $(ele).data('digest'),
								assignedFlag : true,
					            commandVersion : commandVersion
							}
						});

					}
				});
			} else if (roleCardType == 'Sweep' && sweepAgreementsCount == sweepAgreementsAssignedCount) {

				UsersApp.trigger('RemoveAllSweep', {
					commandName: "RemoveAllUserSweep", 
					path: '/userApi/' + moduleName + '/Agreements', 
					kv: {	
						assetId : "04",
						assignAllSweeps : false,
			            commandVersion : commandVersion
					}
				});
					
				$('img[id^="' + checkBoxItemId + '"]').each(function(index, ele) {
					if (!($(ele).attr('src').search("unchecked") != -1)) {
						commandVersion += 1;
						
						UsersApp.trigger('AddSweep', {
							commandName: "AddUserSweep",
							path: '/userApi/' + moduleName + '/Agreements',
							kv: {	
								agreementCode :  $(ele).data('agreementcode'),
								agreementName : $(ele).data('agreementname'), 
								assetId : $(ele).attr('data-assetid'),
								subsidiaryId:$(ele).attr('data-subsidairyid'),
								subsidiaryName:$(ele).data('subsidairyname'), 
								digest :  $(ele).data('digest'),
								assignedFlag : true,
					            commandVersion : commandVersion
							}
						});
					}
				});
			} else if (roleCardType == 'Templates' && templatesCount == templatesAssignedCount) {

				UsersApp.trigger('RemoveAllTemplates', {
					commandName: "RemoveAllUserTemplates", 
					path: '/userApi/' + moduleName + '/Templates', 
					kv: {	
						assetId : "02",
						assignAllTemplates : false,
						commandVersion : commandVersion
					}
				});
						
				$('img[id^="' + checkBoxItemId + '"]').each(function(index, ele) {
					if (!($(ele).attr('src').search("unchecked") != -1)) {
						commandVersion += 1;
						UsersApp.trigger('AddTemplates', {
							commandName: "AddUserTemplates",
							path: '/userApi/' + moduleName + '/Templates',
							kv: {						
									subsidiaryId:$(ele).attr('data-subsidiaryid'),
									templateId: $(ele).data('templateid'),
									subsidiaryName:$(ele).data('subsidiaryname'),
									templateName:$(ele).data('templatename'),
									assetId : $(ele).attr('data-assetid'),
									digest :  $(ele).data('digest'),
									assignedFlag : true,
									commandVersion : commandVersion
							}
						});
					}
				});
			} else if (roleCardType == 'CompanyId' && templatesCount == templatesAssignedCount) {

				UsersApp.trigger('RemoveAllCompanyID', {
					commandName: "RemoveAllCompanyIds", 
					path: '/userApi/' + moduleName + '/CompanyID', 
					kv: {	
						assetId : "02",
						assignAllCompanyIds : false,
						commandVersion : commandVersion
					}
				});
						
				$('img[id^="' + checkBoxItemId + '"]').each(function(index, ele) {
					if (!($(ele).attr('src').search("unchecked") != -1)) {
						commandVersion += 1;
						UsersApp.trigger('AddCompanyID', {
							commandName: "AddCompanyId",
							path: '/userApi/' + moduleName + '/CompanyID',
							kv: {						
									subsidiaryId:$(ele).attr('data-subsidiaryid'),
									accountName: $(ele).data('accountname'),
									accountId:$(ele).attr('data-accountid'),
									accountNo:$(ele).attr('data-accountno'),
									companyName:$(ele).data('companyname'),
									subsidiaryName:$(ele).data('subsidiaryname'),
									companyId:$(ele).data('companyid'),
									assetId : $(ele).attr('data-assetid'),
									digest :  $(ele).data('digest'),
									assignedFlag : true,
									commandVersion : commandVersion
							}
						});
					}
				});
			}
		}
	};

	UsersApp.bind('setQuickLink', CommonUser.setQuickLink);
	UsersApp.bind('NextLinkRef', CommonUser.nextLinkRef);
	UsersApp.bind('checkAssignAll', CommonUser.checkAssignAll);
	UsersApp.bind('CheckAppMatrixAll', CommonUser.checkAppMatrixAll);

})(jQuery);
