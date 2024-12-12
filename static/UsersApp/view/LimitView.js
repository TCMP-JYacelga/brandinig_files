/*global jQuery, UserDetails */
var limitViewName = "";
(function ($) {
	'use strict';

	var Limit = {
		elem: {
			usersapp: '#ft-layout-container',
			assetPanel : '#assetPanel',
			footer: '#footer'
		},
		
		render: function (e, data) {
		var resetPeriod= 'N';
		var limitType = "";
		if(userWorkingData && userWorkingData.assets && userWorkingData.assets[0] && userWorkingData.assets[0].limitType === null){
			userWorkingData.assets[0].limitType = "D";
			limitType = "D"
		}
		
		if(userWorkingData && userWorkingData.assets && userWorkingData.assets[0] && userWorkingData.assets[0].isLimitChange){
			resetPeriod= 'Y';
		}else{
			resetPeriod= 'N';
		}
		
			var loadOptions = {
					type: 'POST',
					dataType: 'json',
					cache : false,
			        async : false,
			      //  contentType: "application/json; charset=utf-8",
			        data:{
			        	"userCode" : userWorkingData.loginId,
			        	"userCat" : userWorkingData.usrRoleId,
			        	"corpId" : userWorkingData.corpId,
			        	"limitPeriod" : limitType,
			        	"resetPeriod" : resetPeriod
			       }
			       
				}
			console.log(" rendering Limit ");
			$('#errorDiv').addClass('hidden');
			limitViewName = this.getViewName();
			/*$.blockUI();
			$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;Loading...</h2></div>',
				css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});*/
			// If the quick menu is already rendered render only the assetPanel
			if ($('#MENUITEM_LIMIT').length == 0) {
				if(data != undefined){
					userWorkingData = data;
					this.render('static/UsersApp/templates/UserEntry.hbs', userWorkingData, '', {
						UserTitle : 'static/UsersApp/templates/UserTitle.hbs',
						UserEntryQuickLinks : 'static/UsersApp/templates/UserEntryQuickLinks.hbs',
						AssetPanel : limitViewName,
						LimitTemplatePayCategory:'static/UsersApp/templates/LimitTemplatePayCategory.hbs',
						LimitTemplatePayPkg : 'static/UsersApp/templates/LimitTemplatePayPackage.hbs',
						LimitTemplateSecCode:'static/UsersApp/templates/LimitTemplateSecCode.hbs',
						LimitTemplatePayCategoryTempType:'static/UsersApp/templates/LimitTemplatePayCategoryTempType.hbs',
						LimitTemplateACHRev:'static/UsersApp/templates/LimitTemplateACHRev.hbs',
						LimitTemplateACHPassThru:'static/UsersApp/templates/LimitTemplateACHPassThru.hbs',
						LimitTemplateDetail:'static/UsersApp/templates/LimitTemplateDetail.hbs'
					}).then(function () {
							//$.unblockUI();
							console.log("Rendering  full page " + viewName);
							var userAppPanel = $(Limit.elem.usersapp);
							userAppPanel.html(this.content);
							//$("html,body").scrollTop(0);
							if($('div#PageTitle').length > 1){
								$('.ft-layout-header').empty();							
							}
							if($('div#PageTitle1').length > 0){
								$('.ft-layout-header').empty();							
							}
							$('div#PageTitle').prependTo('.ft-layout-header');
							$('span.ft-title').prependTo('#PageTitle');
							$('.ft-layout-header').removeAttr( 'style' );
						
							UsersApp.trigger('limitServiceInit');
							UsersApp.trigger('UpdateLimitProfileNiceSelect');
	 						UsersApp.trigger('UpdateLimitProfileList');
	 						$("[id$='Amt']").autoNumeric("init",
                                    {
						 							aSep: amountFormat.strGroupSeparator,
						 							dGroup: strAmountDigitGroup,
						 				 			aDec: amountFormat.strDecimalSeparator,
						 				 			mDec: amountFormat.strAmountMinFraction,
                                                    vMin:"0.00"
                                    });
	 						if(userWorkingData.limitEnable && userWorkingData.assets && userWorkingData.assets.length > 0){
	 							if( userWorkingData.assets[0].makerFileLevelDebitLimitAmt != undefined) 
	 								$('#makerFileLevelDebitLimitAmt').autoNumeric('set', userWorkingData.assets[0].makerFileLevelDebitLimitAmt );
	 							if( userWorkingData.assets[0].makerFileLevelCreditLimitAmt != undefined )
	 								$('#makerFileLevelCreditLimitAmt').autoNumeric('set', userWorkingData.assets[0].makerFileLevelCreditLimitAmt );
	 							if( userWorkingData.assets[0].makerBatchLevelCreditLimitAmt != undefined )
	 								$('#makerBatchLevelCreditLimitAmt').autoNumeric('set', userWorkingData.assets[0].makerBatchLevelCreditLimitAmt );
	 							 if(userWorkingData.assets[0].makerBatchLevelDebitLimitAmt != undefined) 
	 								 $('#makerBatchLevelDebitLimitAmt').autoNumeric('set', userWorkingData.assets[0].makerBatchLevelDebitLimitAmt );
	 							if( userWorkingData.assets[0].makerCumulativeCreditLimitAmt != undefined )
	 								$('#makerCumulativeCreditLimitAmt').autoNumeric('set', userWorkingData.assets[0].makerCumulativeCreditLimitAmt );
	 							 if(userWorkingData.assets[0].makerCumulativeDebitLimitAmt != undefined) 
	 								 $('#makerCumulativeDebitLimitAmt').autoNumeric('set', userWorkingData.assets[0].makerCumulativeDebitLimitAmt );
	 							 if(userWorkingData.assets[0].checkerFileLevelCreditLimitAmt != undefined)	
	 								 $('#checkerFileLevelCreditLimitAmt').autoNumeric('set', userWorkingData.assets[0].checkerFileLevelCreditLimitAmt );
	 							 if( userWorkingData.assets[0].checkerFileLevelDebitLimitAmt != undefined)
	 							 	$('#checkerFileLevelDebitLimitAmt').autoNumeric('set', userWorkingData.assets[0].checkerFileLevelDebitLimitAmt );
	 							if( userWorkingData.assets[0].checkerBatchLevelCreditLimitAmt != undefined)
	 							 	$('#checkerBatchLevelCreditLimitAmt').autoNumeric('set', userWorkingData.assets[0].checkerBatchLevelCreditLimitAmt );
	 							if( userWorkingData.assets[0].checkerBatchLevelDebitLimitAmt!= undefined )
	 							 	$('#checkerBatchLevelDebitLimitAmt').autoNumeric('set', userWorkingData.assets[0].checkerBatchLevelDebitLimitAmt );			 							
	 							if( userWorkingData.assets[0].checkerCumulativeCreditLimitAmt != undefined)
	 							 	$('#checkerCumulativeCreditLimitAmt').autoNumeric('set', userWorkingData.assets[0].checkerCumulativeCreditLimitAmt );
	 							if( userWorkingData.assets[0].checkerCumulativeDebitLimitAmt!= undefined )
	 							 	$('#checkerCumulativeDebitLimitAmt').autoNumeric('set', userWorkingData.assets[0].checkerCumulativeDebitLimitAmt );
	 							if( userWorkingData.assets[0].defaultMakerAchPassthruCCYCode!= undefined )
	 							 	$('#defaultMakerAchPassthruCCYCode').val(userWorkingData.assets[0].defaultMakerAchPassthruCCYCode );
	 							if( userWorkingData.assets[0].defaultCheckerAchPassthruCCYCode!= undefined )
	 							 	$('#defaultCheckerAchPassthruCCYCode').val(userWorkingData.assets[0].defaultCheckerAchPassthruCCYCode );
	 							
	 						}
							
							UsersApp.trigger('setQuickLink', {
								viewName : limitViewName,
								id : "MENUITEM_LIMIT"
							});	
							
							UsersApp.trigger('NextLinkRef',{
								viewName : limitViewName,
								details : userWorkingData
							});
							
					});
					
					
				}else{
					$.blockUI();
					$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;'+getLabel("loading", "Loading")+'...</h2></div>',
						css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});
					this.load("services/usersLookUpApi/userLimits", loadOptions).then(
							function (data) {
				        		var islimitChange = false,prevLimType;
				        		if(userWorkingData.assets && userWorkingData.assets[0] && userWorkingData.assets[0].assetId == "18"){
				        			islimitChange = userWorkingData.assets[0].isLimitChange;
									prevLimType = userWorkingData.assets[0].limitType;
				        		}
				        		userWorkingData['assets'] = [];
				        		userWorkingData.assets.push(data);
				        		if(prevLimType){
					        		userWorkingData.assets[0].limitType = prevLimType;	        			
				        		}
				        		
				        		if(!islimitChange){
				        		//Merging of Working JSON and undo buffer data 
								$.ajax({
							        url: "services/userCommandApi/loadChangeSet/",
							        type: "POST",
							        data: {
							        	"userId" : userWorkingData.loginId,
							        	"roleId" : userWorkingData.usrRoleId,
					                	"recKeyNo" : userWorkingData.recordKeyNo,
					                	"assetId" : "18" ,
							        	"corpId" : userWorkingData.corpId
							        },
							        async : false,
							       // contentType: "application/json; charset=utf-8",
							        dataType: "json",
							        success: function (data) {
							        	
							        	$.each(data,function(index,command){
							        		
							        		if( command.commandName == "CreateUserDetail" || command.commandName == "UpdateUserDetail" ||
						        				command.commandName == "SwitchUserRole" || command.commandName == "AddUserSubsidiary" ||
						        				command.commandName == "RemoveUserSubsidiary" || command.commandName == "AddApprovalMatrix" ||
						        				command.commandName == "RemoveApprovalMatrix" || command.commandName == "ApplyAllApprovalMatrix" ||
						        				command.commandName == "RemoveAllApprovalMatrix"){
							        			
								        		CommonUserObj.updateUserDetailsuserWorkingData(item);
							        		}else{
							        			var assetIndex = userWorkingData.assets.findIndex(function(obj){
													return obj.assetId == command.kv.assetId;
									        	});
							        			CommonUserObj.updateUserAssetInuserWorkingData(command,assetIndex);
							        		}
							        	});
							        	CommonUserObj.clearAssetStores();
							        },
							        error: function () {
							            $('#errorDiv').removeClass('hidden');
							        	$('#errorPara').text("An error has occured!!!");
							        	$.unblockUI();
							        	if(event)
								            event.preventDefault();
							        }
							    });	
				        		}	
				        		userWorkingData.assets[0].isLimitChange = false;
				        		if(userWorkingData.assets[0] && userWorkingData.assets[0].assetId == "18"){
					        		//Fetch Profile List 
									$.ajax({
								        url: "services/usersLookUpApi/limitProfiles",
								        type: "POST",
								        data: {
								        	"profilePeriod" : userWorkingData.assets[0].limitType,
								        	"userId" : userWorkingData.loginId,
								        	"roleId" : userWorkingData.usrRoleId,
						                	"recKeyNo" : userWorkingData.recordKeyNo,
								        	"corpId" : userWorkingData.corpId
								        },
								        async : false,
								       // contentType: "application/json; charset=utf-8",
								        dataType: "json",
								        success: function (profileList) {
								        	userWorkingData.assets[0].profileList = profileList;
								        },
								        error: function () {
								            $('#errorDiv').removeClass('hidden');
								        	$('#errorPara').text("An error has occured!!!");
								        	$.unblockUI();
								        	if(event)
									            event.preventDefault();
								        }
								    });
					        		
					        		//Fetch Currency List 
									$.ajax({
								        url: "services/usersLookUpApi/currencies",
								        type: "POST",
								        data: {
								        	"corpId" : userWorkingData.corpId
								        },
								        async : false,
								        contentType: "application/json; charset=utf-8",
								        dataType: "json",
								        success: function (currencyList) {
								        	userWorkingData.assets[0].currencyList = currencyList;
								        },
								        error: function () {
								            $('#errorDiv').removeClass('hidden');
								        	$('#errorPara').text("An error has occured!!!");
								        	$.unblockUI();
								        	if(event)
									            event.preventDefault();
								        }
								    });
								}
							this.render('static/UsersApp/templates/UserEntry.hbs', userWorkingData, '', {
								UserTitle : 'static/UsersApp/templates/UserTitle.hbs',
								UserEntryQuickLinks : 'static/UsersApp/templates/UserEntryQuickLinks.hbs',
								AssetPanel : limitViewName,
								LimitTemplatePayCategory:'static/UsersApp/templates/LimitTemplatePayCategory.hbs',
								LimitTemplatePayPkg : 'static/UsersApp/templates/LimitTemplatePayPackage.hbs',
								LimitTemplateSecCode:'static/UsersApp/templates/LimitTemplateSecCode.hbs',
								LimitTemplatePayCategoryTempType:'static/UsersApp/templates/LimitTemplatePayCategoryTempType.hbs',
								LimitTemplateACHRev:'static/UsersApp/templates/LimitTemplateACHRev.hbs',
								LimitTemplateACHPassThru:'static/UsersApp/templates/LimitTemplateACHPassThru.hbs',
								LimitTemplateDetail:'static/UsersApp/templates/LimitTemplateDetail.hbs'
							}).then(function () {
									$.unblockUI();
									console.log("Rendering  full page " + limitViewName);
									var userAppPanel = $(Limit.elem.usersapp);
									userAppPanel.html(this.content);
									//$("html,body").scrollTop(0);
									if($('div#PageTitle').length > 1){
										$('.ft-layout-header').empty();							
									}
									if($('div#PageTitle1').length > 0){
										$('.ft-layout-header').empty();							
									}
									$('div#PageTitle').prependTo('.ft-layout-header');
									$('span.ft-title').prependTo('#PageTitle');
									$('.ft-layout-header').removeAttr( 'style' );
								
									UsersApp.trigger('limitServiceInit');
									UsersApp.trigger('UpdateLimitProfileNiceSelect');
			 						UsersApp.trigger('UpdateLimitProfileList');
			 						$("[id$='Amt']").autoNumeric("init",
                                            {
								 							aSep: amountFormat.strGroupSeparator,
								 							dGroup: strAmountDigitGroup,
								 				 			aDec: amountFormat.strDecimalSeparator,
								 				 			mDec: amountFormat.strAmountMinFraction,
                                                            vMin:"0.00"
                                            });			 						
			 						if(userWorkingData.limitEnable && userWorkingData.assets && userWorkingData.assets.length > 0){
			 							if( userWorkingData.assets[0].makerFileLevelDebitLimitAmt != undefined) 
			 								$('#makerFileLevelDebitLimitAmt').autoNumeric('set', userWorkingData.assets[0].makerFileLevelDebitLimitAmt );
			 							if( userWorkingData.assets[0].makerFileLevelCreditLimitAmt != undefined )
			 								$('#makerFileLevelCreditLimitAmt').autoNumeric('set', userWorkingData.assets[0].makerFileLevelCreditLimitAmt );
			 							if( userWorkingData.assets[0].makerBatchLevelCreditLimitAmt != undefined )
			 								$('#makerBatchLevelCreditLimitAmt').autoNumeric('set', userWorkingData.assets[0].makerBatchLevelCreditLimitAmt );
			 							 if(userWorkingData.assets[0].makerBatchLevelDebitLimitAmt != undefined) 
			 								 $('#makerBatchLevelDebitLimitAmt').autoNumeric('set', userWorkingData.assets[0].makerBatchLevelDebitLimitAmt );
			 							if( userWorkingData.assets[0].makerCumulativeCreditLimitAmt != undefined )
			 								$('#makerCumulativeCreditLimitAmt').autoNumeric('set', userWorkingData.assets[0].makerCumulativeCreditLimitAmt );
			 							 if(userWorkingData.assets[0].makerCumulativeDebitLimitAmt != undefined) 
			 								 $('#makerCumulativeDebitLimitAmt').autoNumeric('set', userWorkingData.assets[0].makerCumulativeDebitLimitAmt );
			 							 if(userWorkingData.assets[0].checkerFileLevelCreditLimitAmt != undefined)	
			 								 $('#checkerFileLevelCreditLimitAmt').autoNumeric('set', userWorkingData.assets[0].checkerFileLevelCreditLimitAmt );
			 							 if( userWorkingData.assets[0].checkerFileLevelDebitLimitAmt != undefined)
			 							 	$('#checkerFileLevelDebitLimitAmt').autoNumeric('set', userWorkingData.assets[0].checkerFileLevelDebitLimitAmt );
			 							if( userWorkingData.assets[0].checkerBatchLevelCreditLimitAmt != undefined)
			 							 	$('#checkerBatchLevelCreditLimitAmt').autoNumeric('set', userWorkingData.assets[0].checkerBatchLevelCreditLimitAmt );
			 							if( userWorkingData.assets[0].checkerBatchLevelDebitLimitAmt!= undefined )
			 							 	$('#checkerBatchLevelDebitLimitAmt').autoNumeric('set', userWorkingData.assets[0].checkerBatchLevelDebitLimitAmt );
			 							if( userWorkingData.assets[0].checkerCumulativeCreditLimitAmt != undefined)
			 							 	$('#checkerCumulativeCreditLimitAmt').autoNumeric('set', userWorkingData.assets[0].checkerCumulativeCreditLimitAmt );
			 							if( userWorkingData.assets[0].checkerCumulativeDebitLimitAmt!= undefined )
			 							 	$('#checkerCumulativeDebitLimitAmt').autoNumeric('set', userWorkingData.assets[0].checkerCumulativeDebitLimitAmt );
			 							if( userWorkingData.assets[0].defaultMakerAchPassthruCCYCode!= undefined )
			 							 	$('#defaultMakerAchPassthruCCYCode').val(userWorkingData.assets[0].defaultMakerAchPassthruCCYCode );
			 							if( userWorkingData.assets[0].defaultCheckerAchPassthruCCYCode!= undefined )
			 							 	$('#defaultCheckerAchPassthruCCYCode').val(userWorkingData.assets[0].defaultCheckerAchPassthruCCYCode );
			 						}
									
									UsersApp.trigger('setQuickLink', {
										viewName : limitViewName,
										id : "MENUITEM_LIMIT"
									});	
									
									UsersApp.trigger('NextLinkRef',{
										viewName : limitViewName,
										details : userWorkingData
									});
									
							});
					});
				}
			} else {
				
				if(data != undefined){
					userWorkingData = data;
					this.render(limitViewName,userWorkingData,'', {
	        			LimitTemplatePayCategory:'static/UsersApp/templates/LimitTemplatePayCategory.hbs',
						LimitTemplatePayPkg : 'static/UsersApp/templates/LimitTemplatePayPackage.hbs',
						LimitTemplateSecCode:'static/UsersApp/templates/LimitTemplateSecCode.hbs',
						LimitTemplatePayCategoryTempType:'static/UsersApp/templates/LimitTemplatePayCategoryTempType.hbs',
						LimitTemplateACHRev:'static/UsersApp/templates/LimitTemplateACHRev.hbs',
						LimitTemplateACHPassThru:'static/UsersApp/templates/LimitTemplateACHPassThru.hbs',
						LimitTemplateDetail:'static/UsersApp/templates/LimitTemplateDetail.hbs'
					}).then(function () {
						//$.unblockUI();
						var assetPanel = $(Limit.elem.assetPanel);
						assetPanel.html(this.content);
						if($('div#PageTitle').length > 1){
							$('.ft-layout-header').empty();							
						}
						if($('div#PageTitle1').length > 0){
								$('.ft-layout-header').empty();							
						}
						$('div#PageTitle').prependTo('.ft-layout-header');
						$('span.ft-title').prependTo('#PageTitle');
						$('.ft-layout-header').removeAttr( 'style' );
						//$("html,body").scrollTop(0);
						
						UsersApp.trigger('limitServiceInit');
						UsersApp.trigger('UpdateLimitProfileNiceSelect');
 						UsersApp.trigger('UpdateLimitProfileList');
 						$("[id$='Amt']").autoNumeric("init",
                                {
					 							aSep: amountFormat.strGroupSeparator,
					 							dGroup: strAmountDigitGroup,
					 				 			aDec: amountFormat.strDecimalSeparator,
					 				 			mDec: amountFormat.strAmountMinFraction,
                                                vMin:"0.00"
                                });
 						if(userWorkingData.limitEnable && userWorkingData.assets && userWorkingData.assets.length > 0){
	 						$('#makerFileLevelDebitLimitAmt').autoNumeric('set', userWorkingData.assets[0].makerFileLevelDebitLimitAmt );
	 						$('#makerFileLevelCreditLimitAmt').autoNumeric('set', userWorkingData.assets[0].makerFileLevelCreditLimitAmt );
	 						$('#makerBatchLevelCreditLimitAmt').autoNumeric('set', userWorkingData.assets[0].makerBatchLevelCreditLimitAmt );
	 						$('#makerBatchLevelDebitLimitAmt').autoNumeric('set', userWorkingData.assets[0].makerBatchLevelDebitLimitAmt );
	 						$('#makerCumulativeCreditLimitAmt').autoNumeric('set', userWorkingData.assets[0].makerCumulativeCreditLimitAmt );
	 						$('#makerCumulativeDebitLimitAmt').autoNumeric('set', userWorkingData.assets[0].makerCumulativeDebitLimitAmt );
	 						$('#checkerFileLevelCreditLimitAmt').autoNumeric('set', userWorkingData.assets[0].checkerFileLevelCreditLimitAmt );
	 						$('#checkerFileLevelDebitLimitAmt').autoNumeric('set', userWorkingData.assets[0].checkerFileLevelDebitLimitAmt );
	 						$('#checkerBatchLevelCreditLimitAmt').autoNumeric('set', userWorkingData.assets[0].checkerBatchLevelCreditLimitAmt );
	 						$('#checkerBatchLevelDebitLimitAmt').autoNumeric('set', userWorkingData.assets[0].checkerBatchLevelDebitLimitAmt );
	 						$('#checkerCumulativeCreditLimitAmt').autoNumeric('set', userWorkingData.assets[0].checkerCumulativeCreditLimitAmt );
	 						$('#checkerCumulativeDebitLimitAmt').autoNumeric('set', userWorkingData.assets[0].checkerCumulativeDebitLimitAmt );
	 						if( userWorkingData.assets[0].defaultMakerAchPassthruCCYCode!= undefined )
 							 	$('#defaultMakerAchPassthruCCYCode').val(userWorkingData.assets[0].defaultMakerAchPassthruCCYCode );
 							if( userWorkingData.assets[0].defaultCheckerAchPassthruCCYCode!= undefined )
 							 	$('#defaultCheckerAchPassthruCCYCode').val(userWorkingData.assets[0].defaultCheckerAchPassthruCCYCode );
 						}

						 					
						UsersApp.trigger('setQuickLink', {
							viewName : limitViewName,
							id : "MENUITEM_LIMIT"
						});	
						UsersApp.trigger('NextLinkRef',{
							viewName : limitViewName,
							details : userWorkingData
						});
						
					
					});
				}else{
					
				$.blockUI();
				$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;'+getLabel("loading", "Loading")+'...</h2></div>',
					css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});	
				console.log(" Rendering  Asset Page " + limitViewName);
				this.load("services/usersLookUpApi/userLimits", loadOptions).then(
				function (limitData) {

					console.log("limitData" + limitData);
	        		
	        		if(CommonUserObj.getAssetStore().length > 0){
	        			CommonUser.next();
					}
	        		
	        		var islimitChange = false,prevLimType;
	        		if(userWorkingData.assets && userWorkingData.assets[0] && userWorkingData.assets[0].assetId == "18"){
	        			islimitChange = userWorkingData.assets[0].isLimitChange;
						prevLimType = userWorkingData.assets[0].limitType;
	        		}
	        		userWorkingData['assets'] = [];
	        		userWorkingData.assets.push(limitData);
	        		if(prevLimType){
		        		userWorkingData.assets[0].limitType = prevLimType;	        			
	        		}
	        		
	        		if(!islimitChange){
						//Merging of Working JSON and undo buffer data 
						$.ajax({
					        url: "services/userCommandApi/loadChangeSet/",
					        type: "POST",
					        data: {
					        	"userId" : userWorkingData.loginId,
					        	"roleId" : userWorkingData.usrRoleId,
			                	"recKeyNo" : userWorkingData.recordKeyNo,
			                	"assetId" : "18" ,
					        	"corpId" : userWorkingData.corpId
					        },
					        async : false,
					    //    contentType: "application/json; charset=utf-8",
					        dataType: "json",
					        success: function (data) {
					        	
					        	$.each(data,function(index,command){
					        		
					        		if( command.commandName == "CreateUserDetail" || command.commandName == "UpdateUserDetail" ||
				        				command.commandName == "SwitchUserRole" || command.commandName == "AddUserSubsidiary" ||
				        				command.commandName == "RemoveUserSubsidiary" || command.commandName == "AddApprovalMatrix" ||
				        				command.commandName == "RemoveApprovalMatrix" || command.commandName == "ApplyAllApprovalMatrix" ||
				        				command.commandName == "RemoveAllApprovalMatrix"){
					        			
						        		CommonUserObj.updateUserDetailsuserWorkingData(item);
					        		}else{
					        			var assetIndex = userWorkingData.assets.findIndex(function(obj){
											return obj.assetId == command.kv.assetId;
							        	});
					        			CommonUserObj.updateUserAssetInuserWorkingData(command,assetIndex);
					        		}
					        	});
					        	CommonUserObj.clearAssetStores();
					        },
					        error: function () {
					            $('#errorDiv').removeClass('hidden');
					        	$('#errorPara').text("An error has occured!!!");
					        	$.unblockUI();
					        	if(event)
						            event.preventDefault();
					        }
					    });
	        		}
	        		userWorkingData.assets[0].isLimitChange = false;
					
					if(userWorkingData.assets[0] && userWorkingData.assets[0].assetId == "18"){
		        		//Fetch Profile List 
						$.ajax({
					        url: "services/usersLookUpApi/limitProfiles",
					        type: "POST",
					        data: {
					        	"profilePeriod" : userWorkingData.assets[0].limitType,
					        	"userId" : userWorkingData.loginId,
					        	"roleId" : userWorkingData.usrRoleId,
			                	"recKeyNo" : userWorkingData.recordKeyNo,
					        	"corpId" : userWorkingData.corpId
					        },
					        async : false,
					        dataType: "json",
					        success: function (profileList) {
					        	userWorkingData.assets[0].profileList = profileList;
					        },
					        error: function () {
					            $('#errorDiv').removeClass('hidden');
					        	$('#errorPara').text("An error has occured!!!");
					        	$.unblockUI();
					        	if(event)
						            event.preventDefault();
					        }
					    });
		        		
		        		//Fetch Currency List 
						$.ajax({
					        url: "services/usersLookUpApi/currencies",
					        type: "POST",
					        data: {
					        	"corpId" : userWorkingData.corpId
					        },
					        async : false,
					        contentType: "application/json; charset=utf-8",
					        dataType: "json",
					        success: function (currencyList) {
					        	userWorkingData.assets[0].currencyList = currencyList;
					        },
					        error: function () {
					            $('#errorDiv').removeClass('hidden');
					        	$('#errorPara').text("An error has occured!!!");
					        	$.unblockUI();
					        	if(event)
						            event.preventDefault();
					        }
					    });
					}
	        		
	        		this.render(limitViewName,userWorkingData,'', {
	        			LimitTemplatePayCategory:'static/UsersApp/templates/LimitTemplatePayCategory.hbs',
						LimitTemplateSecCode:'static/UsersApp/templates/LimitTemplateSecCode.hbs',
						LimitTemplatePayPkg : 'static/UsersApp/templates/LimitTemplatePayPackage.hbs',
						LimitTemplatePayCategoryTempType:'static/UsersApp/templates/LimitTemplatePayCategoryTempType.hbs',
						LimitTemplateACHRev:'static/UsersApp/templates/LimitTemplateACHRev.hbs',
						LimitTemplateACHPassThru:'static/UsersApp/templates/LimitTemplateACHPassThru.hbs',
						LimitTemplateDetail:'static/UsersApp/templates/LimitTemplateDetail.hbs'
					}).then(function () {
						$.unblockUI();
						var assetPanel = $(Limit.elem.assetPanel);
						assetPanel.html(this.content);
						if($('div#PageTitle').length > 1){
							$('.ft-layout-header').empty();							
						}
						if($('div#PageTitle1').length > 0){
								$('.ft-layout-header').empty();							
						}
						$('div#PageTitle').prependTo('.ft-layout-header');
						$('span.ft-title').prependTo('#PageTitle');
						$('.ft-layout-header').removeAttr( 'style' );
					
						UsersApp.trigger('limitServiceInit');
 						UsersApp.trigger('UpdateLimitProfileNiceSelect');
 						UsersApp.trigger('UpdateLimitProfileList');
 						$("[id$='Amt']").autoNumeric("init",
                                {
					 							aSep: amountFormat.strGroupSeparator,
					 							dGroup: strAmountDigitGroup,
					 				 			aDec: amountFormat.strDecimalSeparator,
					 				 			mDec: amountFormat.strAmountMinFraction,
                                                vMin:"0.00"
                                });
 						if(userWorkingData.limitEnable && userWorkingData.assets && userWorkingData.assets.length > 0){
 						if(userWorkingData.assets[0].makerFileLevelDebitLimitAmt){
	 						$('#makerFileLevelDebitLimitAmt').autoNumeric('set', userWorkingData.assets[0].makerFileLevelDebitLimitAmt );}
	 					if(userWorkingData.assets[0].makerFileLevelCreditLimitAmt){
	 						$('#makerFileLevelCreditLimitAmt').autoNumeric('set', userWorkingData.assets[0].makerFileLevelCreditLimitAmt );
	 					}
	 					if(userWorkingData.assets[0].makerBatchLevelCreditLimitAmt){
	 						$('#makerBatchLevelCreditLimitAmt').autoNumeric('set', userWorkingData.assets[0].makerBatchLevelCreditLimitAmt );
	 						}
	 				    if(userWorkingData.assets[0].makerBatchLevelDebitLimitAmt){
	 						$('#makerBatchLevelDebitLimitAmt').autoNumeric('set', userWorkingData.assets[0].makerBatchLevelDebitLimitAmt );
	 					}
	 				   if(userWorkingData.assets[0].makerCumulativeCreditLimitAmt){
	 						$('#makerCumulativeCreditLimitAmt').autoNumeric('set', userWorkingData.assets[0].makerCumulativeCreditLimitAmt );
	 						}
	 				    if(userWorkingData.assets[0].makerCumulativeDebitLimitAmt){
	 						$('#makerCumulativeDebitLimitAmt').autoNumeric('set', userWorkingData.assets[0].makerCumulativeDebitLimitAmt );
	 					}
	 					if(userWorkingData.assets[0].checkerFileLevelCreditLimitAmt){
	 							$('#checkerFileLevelCreditLimitAmt').autoNumeric('set', userWorkingData.assets[0].checkerFileLevelCreditLimitAmt );
	 						}
	 						if(userWorkingData.assets[0].checkerFileLevelDebitLimitAmt){
	 						$('#checkerFileLevelDebitLimitAmt').autoNumeric('set', userWorkingData.assets[0].checkerFileLevelDebitLimitAmt );
	 						}
	 						if(userWorkingData.assets[0].checkerBatchLevelCreditLimitAmt){
	 						$('#checkerBatchLevelCreditLimitAmt').autoNumeric('set', userWorkingData.assets[0].checkerBatchLevelCreditLimitAmt );
	 						}
	 						if(userWorkingData.assets[0].checkerBatchLevelDebitLimitAmt){
	 						$('#checkerBatchLevelDebitLimitAmt').autoNumeric('set', userWorkingData.assets[0].checkerBatchLevelDebitLimitAmt );
                            }
	 						if(userWorkingData.assets[0].checkerCumulativeCreditLimitAmt){
		 						$('#checkerCumulativeCreditLimitAmt').autoNumeric('set', userWorkingData.assets[0].checkerCumulativeCreditLimitAmt );
		 						}
		 						if(userWorkingData.assets[0].checkerCumulativeDebitLimitAmt){
		 						$('#checkerCumulativeDebitLimitAmt').autoNumeric('set', userWorkingData.assets[0].checkerCumulativeDebitLimitAmt );
	                            }
		 						if( userWorkingData.assets[0].defaultMakerAchPassthruCCYCode!= undefined )
	 							 	$('#defaultMakerAchPassthruCCYCode').val(userWorkingData.assets[0].defaultMakerAchPassthruCCYCode );
	 							if( userWorkingData.assets[0].defaultCheckerAchPassthruCCYCode!= undefined )
	 							 	$('#defaultCheckerAchPassthruCCYCode').val(userWorkingData.assets[0].defaultCheckerAchPassthruCCYCode );	
 						}
						UsersApp.trigger('setQuickLink', {
							viewName : limitViewName,
							id : "MENUITEM_LIMIT"
						});	
						UsersApp.trigger('NextLinkRef',{
							viewName : limitViewName,
							details : userWorkingData
						});
						
					
					});
	        	});
			 }
			}
			
		},
		
		//Partials Rendering 
		
		renderPayCategory : function(e,data){
			this.render('static/UsersApp/templates/LimitTemplatePayCategory.hbs',userWorkingData,'', {
    			
			}).then(function () {
				$.unblockUI();
				$('#limPayCatRow').html(this.content);

				UsersApp.trigger('limitServiceInit');
				UsersApp.trigger('UpdatePayCatNiceSelect');
				UsersApp.trigger('UpdatePayCatProfileList');
					
				UsersApp.trigger('setQuickLink', {
					viewName : limitViewName,
					id : "MENUITEM_LIMIT"
				});	
				UsersApp.trigger('NextLinkRef',{
					viewName : limitViewName,
					details : userWorkingData
				});
				
			
			});
		},
		renderPayCategoryTemplate : function(e,data){
			this.render('static/UsersApp/templates/LimitTemplatePayCategoryTempType.hbs',userWorkingData,'', {
    			
			}).then(function () {
				$.unblockUI();
				$('#limPayCatTempRow').html(this.content);

				UsersApp.trigger('limitServiceInit');
				UsersApp.trigger('UpdatePayCatTempNiceSelect');
				UsersApp.trigger('UpdatePayCatTempProfileList');
					
				UsersApp.trigger('setQuickLink', {
					viewName : limitViewName,
					id : "MENUITEM_LIMIT"
				});	
				UsersApp.trigger('NextLinkRef',{
					viewName : limitViewName,
					details : userWorkingData
				});
				
			
			});
		},
		
		renderPaypackage : function(e,data){
			this.render('static/UsersApp/templates/LimitTemplatePayPackage.hbs',userWorkingData,'', {
    			
			}).then(function () {
				$.unblockUI();
				$('#limPayPackageRow').html(this.content);

				UsersApp.trigger('limitServiceInit');
				UsersApp.trigger('UpdatePayPackageNiceSelect');
				UsersApp.trigger('UpdatePayPackageProfileList');
					
				UsersApp.trigger('setQuickLink', {
					viewName : limitViewName,
					id : "MENUITEM_LIMIT"
				});	
				UsersApp.trigger('NextLinkRef',{
					viewName : limitViewName,
					details : userWorkingData
				});
				
			
			});
		},
		
		renderSecCode : function(e,data){
			this.render('static/UsersApp/templates/LimitTemplateSecCode.hbs',userWorkingData,'', {
    			
			}).then(function () {
				$.unblockUI();
				$('#limSecCodeRow').html(this.content);

				UsersApp.trigger('limitServiceInit');
				UsersApp.trigger('UpdateSecCodeNiceSelect');
				UsersApp.trigger('UpdateSecCodeProfileList');
					
				UsersApp.trigger('setQuickLink', {
					viewName : limitViewName,
					id : "MENUITEM_LIMIT"
				});	
				UsersApp.trigger('NextLinkRef',{
					viewName : limitViewName,
					details : userWorkingData
				});
				
			
			});
		},
		
		renderAchRev : function(e,data){
			this.render('static/UsersApp/templates/LimitTemplateACHRev.hbs',userWorkingData,'', {
    			
			}).then(function () {
				$.unblockUI();
				$('#limAchRevRow').html(this.content);

				UsersApp.trigger('limitServiceInit');
				UsersApp.trigger('UpdateAchRevNiceSelect');
				UsersApp.trigger('UpdateAchRevProfileList');
					
				UsersApp.trigger('setQuickLink', {
					viewName : limitViewName,
					id : "MENUITEM_LIMIT"
				});	
				UsersApp.trigger('NextLinkRef',{
					viewName : limitViewName,
					details : userWorkingData
				});
				
			
			});
		},
		
		renderAchPassThru : function(e,data){
			this.render('static/UsersApp/templates/LimitTemplateACHPassThru.hbs',userWorkingData,'', {
    			
			}).then(function () {
				$.unblockUI();
				$('#limAchPassThruRow').html(this.content);

				UsersApp.trigger('limitServiceInit');
				//UsersApp.trigger('UpdateAchPassThruNiceSelect');
				UsersApp.trigger('UpdateAchPassThruProfileList');
				$("[id$='Amt']").autoNumeric("init",
                        {
										aSep: amountFormat.strGroupSeparator,
										dGroup: strAmountDigitGroup,
							 			aDec: amountFormat.strDecimalSeparator,
							 			mDec: amountFormat.strAmountMinFraction,
                        	 			vMin:"0.00"
                        });
				if(userWorkingData.limitEnable && userWorkingData.assets && userWorkingData.assets.length > 0){
					if( userWorkingData.assets[0].makerFileLevelDebitLimitAmt != undefined) 
						$('#makerFileLevelDebitLimitAmt').autoNumeric('set', userWorkingData.assets[0].makerFileLevelDebitLimitAmt );
					if( userWorkingData.assets[0].makerFileLevelCreditLimitAmt != undefined )
						$('#makerFileLevelCreditLimitAmt').autoNumeric('set', userWorkingData.assets[0].makerFileLevelCreditLimitAmt );
					if( userWorkingData.assets[0].makerBatchLevelCreditLimitAmt != undefined )
						$('#makerBatchLevelCreditLimitAmt').autoNumeric('set', userWorkingData.assets[0].makerBatchLevelCreditLimitAmt );
					 if(userWorkingData.assets[0].makerBatchLevelDebitLimitAmt != undefined) 
						 $('#makerBatchLevelDebitLimitAmt').autoNumeric('set', userWorkingData.assets[0].makerBatchLevelDebitLimitAmt );
					 if( userWorkingData.assets[0].makerCumulativeCreditLimitAmt != undefined )
							$('#makerCumulativeCreditLimitAmt').autoNumeric('set', userWorkingData.assets[0].makerCumulativeCreditLimitAmt );
						 if(userWorkingData.assets[0].makerCumulativeDebitLimitAmt != undefined) 
							 $('#makerCumulativeDebitLimitAmt').autoNumeric('set', userWorkingData.assets[0].makerCumulativeDebitLimitAmt );
					 if(userWorkingData.assets[0].checkerFileLevelCreditLimitAmt != undefined)	
						 $('#checkerFileLevelCreditLimitAmt').autoNumeric('set', userWorkingData.assets[0].checkerFileLevelCreditLimitAmt );
					 if( userWorkingData.assets[0].checkerFileLevelDebitLimitAmt != undefined)
					 	$('#checkerFileLevelDebitLimitAmt').autoNumeric('set', userWorkingData.assets[0].checkerFileLevelDebitLimitAmt );
					if( userWorkingData.assets[0].checkerBatchLevelCreditLimitAmt != undefined)
					 	$('#checkerBatchLevelCreditLimitAmt').autoNumeric('set', userWorkingData.assets[0].checkerBatchLevelCreditLimitAmt );
					if( userWorkingData.assets[0].checkerBatchLevelDebitLimitAmt!= undefined )
					 	$('#checkerBatchLevelDebitLimitAmt').autoNumeric('set', userWorkingData.assets[0].checkerBatchLevelDebitLimitAmt );
					if( userWorkingData.assets[0].checkerCumulativeCreditLimitAmt != undefined)
					 	$('#checkerCumulativeCreditLimitAmt').autoNumeric('set', userWorkingData.assets[0].checkerCumulativeCreditLimitAmt );
					if( userWorkingData.assets[0].checkerCumulativeDebitLimitAmt!= undefined )
					 	$('#checkerCumulativeDebitLimitAmt').autoNumeric('set', userWorkingData.assets[0].checkerCumulativeDebitLimitAmt );
					if( userWorkingData.assets[0].defaultMakerAchPassthruCCYCode!= undefined )
						 	$('#defaultMakerAchPassthruCCYCode').val(userWorkingData.assets[0].defaultMakerAchPassthruCCYCode );
						if( userWorkingData.assets[0].defaultCheckerAchPassthruCCYCode!= undefined )
						 	$('#defaultCheckerAchPassthruCCYCode').val(userWorkingData.assets[0].defaultCheckerAchPassthruCCYCode );
 				}					
				UsersApp.trigger('setQuickLink', {
					viewName : limitViewName,
					id : "MENUITEM_LIMIT"
				});	
				UsersApp.trigger('NextLinkRef',{
					viewName : limitViewName,
					details : userWorkingData
				});
				
			
			});
		}
	};

	UsersApp.bind('renderLimit', Limit.render);	
	UsersApp.bind('renderPayCategory', Limit.renderPayCategory);	
	UsersApp.bind('renderPayCategoryTemplate', Limit.renderPayCategoryTemplate);	
	UsersApp.bind('renderPaypackage', Limit.renderPaypackage);	
	UsersApp.bind('renderSecCode', Limit.renderSecCode);
	UsersApp.bind('renderAchRev', Limit.renderAchRev);
	UsersApp.bind('renderAchPassThru', Limit.renderAchPassThru);

	
})(jQuery);
