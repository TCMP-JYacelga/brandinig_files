/*global jQuery, User Details */

(function ($) {
	'use strict';
	var tempGranPriv= [];
	var queryAPIData ;
	var isGran = false;
	var Verify = {
		elem : {
			usersApp : '#ft-layout-container',
			main : '#main',
			footer : '#footer'
		},
		render : function () {
			var loadOptions;
			var userId = userWorkingData.loginId;
			var corpId = userWorkingData.corpId;
			var roleId = userWorkingData.usrRoleId;
			var recordKeyNo = userWorkingData.recordKeyNo;

			var strRegex =  /[?&]([^=#]+)=([^&#]*)/g,objParam = {},arrMatches = [];
			while (arrMatches = strRegex.exec(window.location.hash)) {
				objParam[arrMatches[1]] = arrMatches[2];
			}
			
			if((user_id || role_id)  && mode != "edit"){
				loadOptions =  {
	                type: 'POST', 
	                cache : false,
	                aync : false,
	                dataType: 'json',
	                data: {
	                	"userId" : user_id,
						"roleId" : role_id,
						"corpId" : corp_id,
						"recordKeyNo" : recKey_No
						}
				};
				
				if (window.prevMode != "view")
					mode = "view";
				
			}else{
				loadOptions =  {
							type: 'POST', 
			                cache : false,
			                aync : false,
			                dataType: 'json',
			                data: {
			                	"userId" : userId,
								"roleId" : roleId,
								"corpId" : corpId,
								"recordKeyNo" : recordKeyNo
			                }
	            };
			}
			
			
			console.log(" rendering Verify ");
			
			$.blockUI();
			$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;Loading...</h2></div>',
				css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});
			
			//UserDetail_json.json
			this.load("services/usersApi",loadOptions).then(
			function(data){
				userWorkingData = data;
				queryAPIData = $.extend(true, {}, data);
				
				 var limitsIndex =  queryAPIData.assets.findIndex(function(obj){
                     return obj.assetId == "18";
                 });
				 var corpDescValue = new String(userWorkingData.corporationDesc);
				 corpDescValue = corpDescValue.replace(/quot;/g, '');
				 userWorkingData.corporationDesc = corpDescValue.replace(/amp;/g, '');
				 if(userWorkingData.email != undefined){
                     var email = new String(userWorkingData.email);
                    userWorkingData.email = email.replace(/amp;/g, '');
                    }
				 if(userWorkingData.department != undefined){
                        var department = new String(userWorkingData.department);
                        userWorkingData.department = department.replace(/amp;/g, '');
                    }
                    if(userWorkingData.address.addressLine1 != undefined)
                    {
                        var addressLine1 = new String(userWorkingData.address.addressLine1);
                        userWorkingData.address.addressLine1 = addressLine1.replace(/amp;/g, '');
                    }
                    if(userWorkingData.address.city != undefined)
                    {
                        var city = new String(userWorkingData.address.city);
                        userWorkingData.address.city = city.replace(/amp;/g, '');
                    }
                 if(limitsIndex != -1){
                    var userLimits = queryAPIData.userLimits;
                    queryAPIData.assets[limitsIndex]=(userLimits);
                 }
				
			    $.ajax({
			        url: "services/userCommandApi/loadChangeSet/",
			        type: "POST",
			        data: {
			        	"userId" : userWorkingData.loginId,
			        	"roleId" : userWorkingData.usrRoleId,
	                	"recKeyNo" : userWorkingData.recordKeyNo,
			        	"corpId" : userWorkingData.corpId			        	
			        },
			        async : false,
			  //      contentType: "application/json; charset=utf-8",
			        dataType: "json",
			        success: function (commands) {
			        	$.each(commands,function(index,command){
			        		
			        		if( command.commandName == "CreateUserDetail" || command.commandName == "UpdateUserDetail" ||
		        				command.commandName == "SwitchUserRole" || command.commandName == "AddUserSubsidiary" ||
		        				command.commandName == "RemoveUserSubsidiary" || command.commandName == "AddApprovalMatrix" ||
		        				command.commandName == "RemoveApprovalMatrix" || command.commandName == "ApplyAllApprovalMatrix" ||
		        				command.commandName == "RemoveAllApprovalMatrix"){
			        			
				        		CommonUserObj.updateUserDetailsuserWorkingData(command);
			        		}else{
			        			var assetIndex = userWorkingData.assets.findIndex(function(obj){
									return obj.assetId == command.kv.assetId;
					        	});
			        			CommonUserObj.updateUserAssetInuserWorkingData(command,assetIndex);
			        		}
			        	});
			        	// start limits
                          var limitIndex = commands.findIndex(function(obj){
                                      return obj.commandName == "UserLimitsUpdateCommand";
                                       });
                           var emptyLimitsIndex =  userWorkingData.assets.findIndex(function(obj){
                             return obj.assetId == "18";
                                });
                                                   //TODO deep copy
                             if(limitIndex == -1){
                            var userLimits = userWorkingData.userLimits;
                           userWorkingData.assets[emptyLimitsIndex]=(userLimits);
                                                  }
                                                  // end limits


			        },
			        error: function () {
			            $('#errorDiv').removeClass('hidden');
			        	$('#errorPara').text("An error has occured!!!");
			        	$.unblockUI();
			        	if(event)
				            event.preventDefault();
			        }
			    });    
			    
			    userWorkingData.mode = mode;
		        userWorkingData.prevMode = window.prevMode;
		        
			    if(userWorkingData.activationDate){
			    	//var activationDate = $.datepick.formatDate("mm/dd/yy", $.datepick.parseDate('yy-mm-dd', userWorkingData.activationDate.split(' ')[0]));
			    	userWorkingData.activationDate = userWorkingData.activationDate;
			    }

			    
			    // Create and Update details changes
			    if( mode == 'viewChanges' )
			    {
			    	// firstName
			    	if( userWorkingData.firstName )
			    	{
				    	if( queryAPIData.firstName != userWorkingData.firstName )
				    	{
				    		userWorkingData.firstNameClass = 'modifiedField';
				    	}
			    	}
			    	else
			    	{
			    		userWorkingData.firstName = queryAPIData.firstName;
			    		userWorkingData.firstNameClass = 'removedField';
			    	}
			    	
			    	// lastName
			    	if( userWorkingData.lastName )
			    	{
				    	if( queryAPIData.lastName != userWorkingData.lastName )
				    	{
				    		userWorkingData.lastNameClass = 'modifiedField';
				    	}
			    	}
			    	else
			    	{
			    		userWorkingData.lastName = queryAPIData.lastName;
			    		userWorkingData.lastNameClass = 'removedField';
			    	}
			    	
			    	
			    	// usrRoleId
			    	if( userWorkingData.usrRoleId )
			    	{
				    	if( queryAPIData.usrRoleId != userWorkingData.usrRoleId )
				    	{
				    		userWorkingData.usrRoleIdClass = 'modifiedField';
				    	}
			    	}
			    	else
			    	{
			    		userWorkingData.usrRoleId = queryAPIData.usrRoleId;
			    		userWorkingData.usrRoleIdClass = 'removedField';
			    	}
			    	
			    	// department
			    	if( userWorkingData.department )
			    	{
						if( queryAPIData.department != undefined)
						{	
							if( queryAPIData.department != userWorkingData.department )
							{
								userWorkingData.departmentClass = 'modifiedField';
							}
						}
						else
						{
							userWorkingData.departmentClass = 'newField';
						}
			    	}
			    	else
			    	{
			    		userWorkingData.department = queryAPIData.department;
			    		userWorkingData.departmentClass = 'removedField';
			    	}
			    	
			    	// telephone
			    	if( userWorkingData.telephone )
			    	{
						if( queryAPIData.telephone != undefined)
						{
							if( queryAPIData.telephone != userWorkingData.telephone )
							{
								userWorkingData.telephoneClass = 'modifiedField';
							}
						}
						else
						{
							userWorkingData.telephoneClass = 'newField';
						}
			    	}
			    	else
			    	{
			    		userWorkingData.telephone = queryAPIData.telephone;
			    		userWorkingData.telephoneClass = 'removedField';
			    	}
			    	
			    	// addressLine1
			    	if( userWorkingData.address.addressLine1 )
			    	{
				    	if( queryAPIData.address.addressLine1 != userWorkingData.address.addressLine1 )
				    	{
				    		userWorkingData.addressLine1Class = 'modifiedField';
				    	}
			    	}
			    	else
			    	{
			    		userWorkingData.address.addressLine1 = queryAPIData.address.addressLine1;
			    		userWorkingData.addressLine1Class = 'removedField';
			    	}
			    	
			    	// usrCountry
			    	if( userWorkingData.usrCountry )
			    	{
				    	if( queryAPIData.usrCountry != userWorkingData.usrCountry )
				    	{
				    		userWorkingData.usrCountryClass = 'modifiedField';
				    	}
			    	}
			    	else
			    	{
			    		userWorkingData.usrCountry = queryAPIData.usrCountry;
			    		userWorkingData.usrCountryClass = 'removedField';
			    	}
			    	
			    	// usrState
			    	if( userWorkingData.usrState )
			    	{
				    	if( queryAPIData.usrState != userWorkingData.usrState )
				    	{
				    		userWorkingData.usrStateClass = 'modifiedField';
				    	}
			    	}
			    	else
			    	{
			    		userWorkingData.usrState = queryAPIData.usrState;
			    		userWorkingData.usrStateClass = 'removedField';
			    	}
			    	
			    	// fax
			    	if( userWorkingData.address.fax )
			    	{
						if( queryAPIData.address.fax != undefined)
						{
							if( queryAPIData.address.fax != userWorkingData.address.fax )
							{
								userWorkingData.faxClass = 'modifiedField';
							}
						}
						else
						{
							userWorkingData.faxClass = 'newField';
						}
				    	
			    	}
			    	else
			    	{
			    		userWorkingData.address.fax = queryAPIData.address.fax;
			    		userWorkingData.faxClass = 'removedField';
			    	}
			    	
			    	// city
			    	if( userWorkingData.address.city )
			    	{
						if( queryAPIData.address.city != undefined)
						{
							if( queryAPIData.address.city != userWorkingData.address.city )
							{
								userWorkingData.cityClass = 'modifiedField';
							}
						}
						else
						{
							userWorkingData.cityClass = 'newField';
						}
				    	
			    	}
			    	else
			    	{
			    		userWorkingData.address.city = queryAPIData.address.city;
			    		userWorkingData.cityClass = 'removedField';
			    	}
			    	
			    	// zipCode
			    	if( userWorkingData.address.zipCode )
			    	{
						if( queryAPIData.address.zipCode != undefined)
						{
							if( queryAPIData.address.zipCode != userWorkingData.address.zipCode )
							{
								userWorkingData.zipCodeClass = 'modifiedField';
							}
						}
						else
						{
							userWorkingData.zipCodeClass = 'newField';
						}
				    	
			    	}
			    	else
			    	{
			    		userWorkingData.address.zipCode = queryAPIData.address.zipCode;
			    		userWorkingData.zipCodeClass = 'removedField';
			    	}
			    	
			    	// email
			    	if( userWorkingData.email )
			    	{
				    	if( queryAPIData.email != userWorkingData.email )
				    	{
				    		userWorkingData.emailClass = 'modifiedField';
				    	}
			    	}
			    	else
			    	{
			    		userWorkingData.email = queryAPIData.email;
			    		userWorkingData.emailClass = 'removedField';
			    	}
			    	
			    	// mobileNo
			    	if( userWorkingData.mobileNo )
			    	{
			    		if( queryAPIData.mobileNo != undefined)
						{
							if( queryAPIData.mobileNo != userWorkingData.mobileNo )
							{
								userWorkingData.mobileNoClass = 'modifiedField';
							}
						}
						else
						{
							userWorkingData.mobileNoClass = 'newField';
						}
				    	
			    	}
			    	else
			    	{
			    		userWorkingData.mobileNo = queryAPIData.mobileNo;
			    		userWorkingData.mobileNoClass = 'removedField';
			    	}
			    	
			    	// usrLanguage
			    	if( userWorkingData.usrLanguage )
			    	{
				    	if( queryAPIData.usrLanguage != userWorkingData.usrLanguage )
				    	{
				    		userWorkingData.usrLanguageClass = 'modifiedField';
				    	}
			    	}
			    	else
			    	{
			    		userWorkingData.usrLanguage = queryAPIData.usrLanguage;
			    		userWorkingData.usrLanguageClass = 'removedField';
			    	}
			    	
			    	// isTemplateOnly
			    	if( typeof userWorkingData.isTemplateOnly !== "undefined")
			    	{
				    	if( userWorkingData.isTemplateOnly )
				    	{
					    	if( queryAPIData.isTemplateOnly != userWorkingData.isTemplateOnly )
					    	{
					    		userWorkingData.isTemplateOnlyClass = 'modifiedField';
					    	}
				    	}
				    	else if( ! userWorkingData.isTemplateOnly )
				    	{
				    		if( queryAPIData.isTemplateOnly != userWorkingData.isTemplateOnly )
					    	{
					    		userWorkingData.isTemplateOnlyClass = 'removedField';
					    	}
				    	}
			    	}
			    	
			    	// isSuperUser
			    	if( typeof userWorkingData.superUser !== "undefined")
			    	{
				    	if( userWorkingData.superUser )
				    	{
					    	if( queryAPIData.superUser != userWorkingData.isSuperUser )
					    	{
					    		userWorkingData.isSuperUserClass = 'modifiedField';
					    	}
				    	}
				    	else if( ! userWorkingData.superUser )
				    	{
				    		//userWorkingData.isSuperUserClass = 'removedField';
				    		if( queryAPIData.superUser != userWorkingData.superUser )
					    	{
					    		userWorkingData.isSuperUserClass = 'removedField';
					    	}
				    	}
			    	}
			    	
			    	// allowConfidential
			    	if( typeof userWorkingData.allowConfidential !== "undefined")
			    	{
				    	if( userWorkingData.allowConfidential )
				    	{
					    	if( queryAPIData.allowConfidential != userWorkingData.allowConfidential )
					    	{
					    		userWorkingData.allowConfidentialClass = 'modifiedField';
					    	}
				    	}
				    	else if( ! userWorkingData.allowConfidential )
				    	{
				    		//userWorkingData.allowConfidentialClass = 'removedField';
				    		if( queryAPIData.allowConfidential != userWorkingData.allowConfidential )
					    	{
					    		userWorkingData.allowConfidentialClass = 'removedField';
					    	}
				    	}
			    	}
			    	
			    	// requireMFA
			    	if( typeof userWorkingData.requireMFA !== "undefined")
			    	{
				    	if( userWorkingData.requireMFA )
				    	{
					    	if( queryAPIData.requireMFA != userWorkingData.requireMFA )
					    	{
					    		userWorkingData.requireMFAClass = 'modifiedField';
					    	}
				    	}
				    	else if( ! userWorkingData.requireMFA )
				    	{
				    		//userWorkingData.requireMFAClass = 'removedField';
				    		if( queryAPIData.requireMFA != userWorkingData.requireMFA )
					    	{
					    		userWorkingData.requireMFAClass = 'removedField';
					    	}
				    	}
			    	}
			    	
			    	//MFA Trigger Level
			    	if( userWorkingData.usrMfaTrigger )
			    	{
				    	if( queryAPIData.usrMfaTrigger != userWorkingData.usrMfaTrigger )
				    	{
				    		userWorkingData.usrMfaTriggerClass = 'modifiedField';
				    	}
			    	}
			    	else
			    	{
			    		userWorkingData.usrMfaTrigger = queryAPIData.usrMfaTrigger;
			    		userWorkingData.usrMfaTriggerClass = 'removedField';
			    	}
			    	
			    	// usrApprovalLevel
			    	if( userWorkingData.usrApprovalLevel )
			    	{
						if( (queryAPIData.usrApprovalLevel != userWorkingData.usrApprovalLevel) && queryAPIData.usrApprovalLevel == 0)
				    	{
				    		userWorkingData.usrApprovalLevelClass = 'newField';
				    	}
				    	else if( queryAPIData.usrApprovalLevel != userWorkingData.usrApprovalLevel )
				    	{
				    		userWorkingData.usrApprovalLevelClass = 'modifiedField';
				    	}
			    	}
					else if (userWorkingData.usrApprovalLevel =="" && queryAPIData.usrApprovalLevel == 0)
					{
						userWorkingData.usrApprovalLevel=0;
					}
			    	else
			    	{
			    		userWorkingData.usrApprovalLevel = queryAPIData.usrApprovalLevel;
			    		userWorkingData.usrApprovalLevelClass = 'removedField';
			    	}
			    	
			    	// Limit start here
			    	
			    	var limitIndex = userWorkingData.assets.findIndex(function(obj){
						return obj.assetId == "18";
					})
					if(limitIndex != -1){
						// maker Limit
				    	//defaultMakerPaymentCategory
				    	if( userWorkingData.assets[limitIndex].defaultMakerPaymentCategory )
				    	{
					    	if( queryAPIData.assets[limitIndex].defaultMakerPaymentCategory != userWorkingData.assets[limitIndex].defaultMakerPaymentCategory )
					    	{
					    		userWorkingData.assets[limitIndex].defaultMakerPaymentCategoryClass = 'modifiedField';
					    	}
				    	}
				    	else
				    	{
				    		userWorkingData.assets[limitIndex].defaultMakerPaymentCategory = queryAPIData.assets[limitIndex].defaultMakerPaymentCategory;
				    		userWorkingData.assets[limitIndex].defaultMakerPaymentCategoryClass = 'removedField';
				    	}
				    	//defaultMakerSecCode
				    	if( userWorkingData.assets[limitIndex].defaultMakerSecCode )
				    	{
					    	if( queryAPIData.assets[limitIndex].defaultMakerSecCode != userWorkingData.assets[limitIndex].defaultMakerSecCode )
					    	{
					    		userWorkingData.assets[limitIndex].defaultMakerSecCodeClass = 'modifiedField';
					    	}
				    	}
				    	else
				    	{
				    		userWorkingData.assets[limitIndex].defaultMakerSecCode = queryAPIData.assets[limitIndex].defaultMakerSecCode;
				    		userWorkingData.assets[limitIndex].defaultMakerSecCodeClass = 'removedField';
				    	}
				    	//defaultMakerPackage
				    	if( userWorkingData.assets[limitIndex].defaultMakerPackage )
				    	{
					    	if( queryAPIData.assets[limitIndex].defaultMakerPackage != userWorkingData.assets[limitIndex].defaultMakerPackage )
					    	{
					    		userWorkingData.assets[limitIndex].defaultMakerPackageClass = 'modifiedField';
					    	}
				    	}
				    	else
				    	{
				    		userWorkingData.assets[limitIndex].defaultMakerPackage = queryAPIData.assets[limitIndex].defaultMakerPackage;
				    		userWorkingData.assets[limitIndex].defaultMakerPackageClass = 'removedField';
				    	}
				    	//defaultMakerPaymentTemplate
				    	if( userWorkingData.assets[limitIndex].defaultMakerPaymentTemplate )
				    	{
					    	if( queryAPIData.assets[limitIndex].defaultMakerPaymentTemplate != userWorkingData.assets[limitIndex].defaultMakerPaymentTemplate )
					    	{
					    		userWorkingData.assets[limitIndex].defaultMakerPaymentTemplateClass = 'modifiedField';
					    	}
				    	}
				    	else
				    	{
				    		userWorkingData.assets[limitIndex].defaultMakerPaymentTemplate = queryAPIData.assets[limitIndex].defaultMakerPaymentTemplate;
				    		userWorkingData.assets[limitIndex].defaultMakerPaymentTemplateClass = 'removedField';
				    	}
				    	
				    	//defaultMakerAchReversal
				    	if( userWorkingData.assets[limitIndex].defaultMakerAchReversal )
				    	{
					    	if( queryAPIData.assets[limitIndex].defaultMakerAchReversal != userWorkingData.assets[limitIndex].defaultMakerAchReversal )
					    	{
					    		userWorkingData.assets[limitIndex].defaultMakerAchReversalClass = 'modifiedField';
					    	}
				    	}
				    	else
				    	{
				    		userWorkingData.assets[limitIndex].defaultMakerAchReversal = queryAPIData.assets[limitIndex].defaultMakerAchReversal;
				    		userWorkingData.assets[limitIndex].defaultMakerAchReversalClass = 'removedField';
				    	}
				    	//defaulMakerAchPassthruCCY
				    	if( userWorkingData.assets[limitIndex].defaultMakerAchPassthruCCY )
				    	{
					    	if( queryAPIData.assets[limitIndex].defaultMakerAchPassthruCCY != userWorkingData.assets[limitIndex].defaultMakerAchPassthruCCY )
					    	{
					    		userWorkingData.assets[limitIndex].defaultMakerAchPassthruCCYClass = 'modifiedField';
					    	}
				    	}
				    	else
				    	{
				    		userWorkingData.assets[limitIndex].defaultMakerAchPassthruCCY = queryAPIData.assets[limitIndex].defaultMakerAchPassthruCCY;
				    		userWorkingData.assets[limitIndex].defaultMakerAchPassthruCCYClass = 'removedField';
				    	}
				    	//makerFileLevelCreditLimitAmt
				    	if( userWorkingData.assets[limitIndex].makerFileLevelCreditLimitAmt )
				    	{
					    	if( queryAPIData.assets[limitIndex].makerFileLevelCreditLimitAmt != userWorkingData.assets[limitIndex].makerFileLevelCreditLimitAmt )
					    	{
					    		userWorkingData.assets[limitIndex].makerFileLevelCreditLimitAmtClass = 'modifiedField';
					    	}
				    	}
				    	else
				    	{
				    		userWorkingData.assets[limitIndex].makerFileLevelCreditLimitAmt = queryAPIData.assets[limitIndex].makerFileLevelCreditLimitAmt;
				    		userWorkingData.assets[limitIndex].makerFileLevelCreditLimitAmtClass = 'removedField';
				    	}
				    	//makerFileLevelDebitLimitAmt
				    	if( userWorkingData.assets[limitIndex].makerFileLevelDebitLimitAmt )
				    	{
					    	if( queryAPIData.assets[limitIndex].makerFileLevelDebitLimitAmt != userWorkingData.assets[limitIndex].makerFileLevelDebitLimitAmt )
					    	{
					    		userWorkingData.assets[limitIndex].makerFileLevelDebitLimitAmtClass = 'modifiedField';
					    	}
				    	}
				    	else
				    	{
				    		userWorkingData.assets[limitIndex].makerFileLevelDebitLimitAmt = queryAPIData.assets[limitIndex].makerFileLevelDebitLimitAmt;
				    		userWorkingData.assets[limitIndex].makerFileLevelDebitLimitAmtClass = 'removedField';
				    	}
				    	/*//makerBatchLevelCreditLimitAmt
				    	if( userWorkingData.assets[limitIndex].makerBatchLevelCreditLimitAmt )
				    	{
					    	if( queryAPIData.assets[limitIndex].makerBatchLevelCreditLimitAmt != userWorkingData.assets[limitIndex].makerBatchLevelCreditLimitAmt )
					    	{
					    		userWorkingData.assets[limitIndex].makerBatchLevelCreditLimitAmtClass = 'modifiedField';
					    	}
				    	}
				    	else
				    	{
				    		userWorkingData.assets[limitIndex].makerBatchLevelCreditLimitAmt = queryAPIData.assets[limitIndex].makerBatchLevelCreditLimitAmt;
				    		userWorkingData.assets[limitIndex].makerBatchLevelCreditLimitAmtClass = 'removedField';
				    	}
				    	//makerBatchLevelDebitLimitAmt
				    	if( userWorkingData.assets[limitIndex].makerBatchLevelDebitLimitAmt )
				    	{
					    	if( queryAPIData.assets[limitIndex].makerBatchLevelDebitLimitAmt != userWorkingData.assets[limitIndex].makerBatchLevelDebitLimitAmt )
					    	{
					    		userWorkingData.assets[limitIndex].makerBatchLevelDebitLimitAmtClass = 'modifiedField';
					    	}
				    	}
				    	else
				    	{
				    		userWorkingData.assets[limitIndex].makerBatchLevelDebitLimitAmt = queryAPIData.assets[limitIndex].makerBatchLevelDebitLimitAmt;
				    		userWorkingData.assets[limitIndex].makerBatchLevelDebitLimitAmtClass = 'removedField';
				    	}*/
				    	//makerCumulativeCreditLimitAmt
				    	if( userWorkingData.assets[limitIndex].makerCumulativeCreditLimitAmt )
				    	{
					    	if( queryAPIData.assets[limitIndex].makerCumulativeCreditLimitAmt != userWorkingData.assets[limitIndex].makerCumulativeCreditLimitAmt )
					    	{
					    		userWorkingData.assets[limitIndex].makerCumulativeCreditLimitAmtClass = 'modifiedField';
					    	}
				    	}
				    	else
				    	{
				    		userWorkingData.assets[limitIndex].makerCumulativeCreditLimitAmt = queryAPIData.assets[limitIndex].makerCumulativeCreditLimitAmt;
				    		userWorkingData.assets[limitIndex].makerCumulativeCreditLimitAmtClass = 'removedField';
				    	}
				    	//makerCumulativeDebitLimitAmt
				    	if( userWorkingData.assets[limitIndex].makerCumulativeDebitLimitAmt )
				    	{
					    	if( queryAPIData.assets[limitIndex].makerCumulativeDebitLimitAmt != userWorkingData.assets[limitIndex].makerCumulativeDebitLimitAmt )
					    	{
					    		userWorkingData.assets[limitIndex].makerCumulativeDebitLimitAmtClass = 'modifiedField';
					    	}
				    	}
				    	else
				    	{
				    		userWorkingData.assets[limitIndex].makerCumulativeDebitLimitAmt = queryAPIData.assets[limitIndex].makerCumulativeDebitLimitAmt;
				    		userWorkingData.assets[limitIndex].makerCumulativeDebitLimitAmtClass = 'removedField';
				    	}
				    	//Checker Limits
				    	
				    	//defaultMakerPaymentCategory
				    	if( userWorkingData.assets[limitIndex].defaultCheckerPaymentCategory )
				    	{
					    	if( queryAPIData.assets[limitIndex].defaultCheckerPaymentCategory != userWorkingData.assets[limitIndex].defaultCheckerPaymentCategory )
					    	{
					    		userWorkingData.assets[limitIndex].defaultCheckerPaymentCategoryClass = 'modifiedField';
					    	}
				    	}
				    	else
				    	{
				    		userWorkingData.assets[limitIndex].defaultCheckerPaymentCategory = queryAPIData.assets[limitIndex].defaultCheckerPaymentCategory;
				    		userWorkingData.assets[limitIndex].defaultCheckerPaymentCategoryClass = 'removedField';
				    	}
				    	//defaultCheckerSecCode
				    	if( userWorkingData.assets[limitIndex].defaultCheckerSecCode )
				    	{
					    	if( queryAPIData.assets[limitIndex].defaultCheckerSecCode != userWorkingData.assets[limitIndex].defaultCheckerSecCode )
					    	{
					    		userWorkingData.assets[limitIndex].defaultCheckerSecCodeClass = 'modifiedField';
					    	}
				    	}
				    	else
				    	{
				    		userWorkingData.assets[limitIndex].defaultCheckerSecCode = queryAPIData.assets[limitIndex].defaultCheckerSecCode;
				    		userWorkingData.assets[limitIndex].defaultCheckerSecCodeClass = 'removedField';
				    	}
				    	//defaultCheckerPackage
				    	if( userWorkingData.assets[limitIndex].defaultCheckerPackage )
				    	{
					    	if( queryAPIData.assets[limitIndex].defaultCheckerPackage != userWorkingData.assets[limitIndex].defaultCheckerPackage )
					    	{
					    		userWorkingData.assets[limitIndex].defaultCheckerPackageClass = 'modifiedField';
					    	}
				    	}
				    	else
				    	{
				    		userWorkingData.assets[limitIndex].defaultCheckerPackage = queryAPIData.assets[limitIndex].defaultCheckerPackage;
				    		userWorkingData.assets[limitIndex].defaultCheckerPackageClass = 'removedField';
				    	}
				    	//defaultCheckerPaymentTemplate
				    	if( userWorkingData.assets[limitIndex].defaultCheckerPaymentTemplate)
				    	{
					    	if( queryAPIData.assets[limitIndex].defaultCheckerPaymentTemplate != userWorkingData.assets[limitIndex].defaultCheckerPaymentTemplate )
					    	{
					    		userWorkingData.assets[limitIndex].defaultCheckerPaymentTemplateClass = 'modifiedField';
					    	}
				    	}
				    	else
				    	{
				    		userWorkingData.assets[limitIndex].defaultCheckerPaymentTemplate = queryAPIData.assets[limitIndex].defaultCheckerPaymentTemplate;
				    		userWorkingData.assets[limitIndex].defaultCheckerPaymentTemplateClass = 'removedField';
				    	}
				    	
				    	//defaultCheckerAchReversal
				    	if( userWorkingData.assets[limitIndex].defaultCheckerAchReversal )
				    	{
					    	if( queryAPIData.assets[limitIndex].defaultCheckerAchReversal != userWorkingData.assets[limitIndex].defaultCheckerAchReversal )
					    	{
					    		userWorkingData.assets[limitIndex].defaultCheckerAchReversalClass = 'modifiedField';
					    	}
				    	}
				    	else
				    	{
				    		userWorkingData.assets[limitIndex].defaultCheckerAchReversal = queryAPIData.assets[limitIndex].defaultCheckerAchReversal;
				    		userWorkingData.assets[limitIndex].defaultCheckerAchReversalClass = 'removedField';
				    	}
				    	//defaultCheckerAchPassthruCCY
				    	if( userWorkingData.assets[limitIndex].defaultCheckerAchPassthruCCY )
				    	{
					    	if( queryAPIData.assets[limitIndex].defaultCheckerAchPassthruCCY != userWorkingData.assets[limitIndex].defaultCheckerAchPassthruCCY )
					    	{
					    		userWorkingData.assets[limitIndex].defaultCheckerAchPassthruCCYClass = 'modifiedField';
					    	}
				    	}
				    	else
				    	{
				    		userWorkingData.assets[limitIndex].defaultCheckerAchPassthruCCY = queryAPIData.assets[limitIndex].defaultCheckerAchPassthruCCY;
				    		userWorkingData.assets[limitIndex].defaultCheckerAchPassthruCCYClass = 'removedField';
				    	}
				    	//checkerFileLevelCreditLimitAmt
				    	if( userWorkingData.assets[limitIndex].checkerFileLevelCreditLimitAmt )
				    	{
					    	if( queryAPIData.assets[limitIndex].checkerFileLevelCreditLimitAmt != userWorkingData.assets[limitIndex].checkerFileLevelCreditLimitAmt )
					    	{
					    		userWorkingData.assets[limitIndex].checkerFileLevelCreditLimitAmtClass = 'modifiedField';
					    	}
				    	}
				    	else
				    	{
				    		userWorkingData.assets[limitIndex].checkerFileLevelCreditLimitAmt = queryAPIData.assets[limitIndex].checkerFileLevelCreditLimitAmt;
				    		userWorkingData.assets[limitIndex].checkerFileLevelCreditLimitAmtClass = 'removedField';
				    	}
				    	//checkerFileLevelDebitLimitAmt
				    	if( userWorkingData.assets[limitIndex].checkerFileLevelDebitLimitAmt )
				    	{
					    	if( queryAPIData.assets[limitIndex].checkerFileLevelDebitLimitAmt != userWorkingData.assets[limitIndex].checkerFileLevelDebitLimitAmt )
					    	{
					    		userWorkingData.assets[limitIndex].checkerFileLevelDebitLimitAmtClass = 'modifiedField';
					    	}
				    	}
				    	else
				    	{
				    		userWorkingData.assets[limitIndex].checkerFileLevelDebitLimitAmt = queryAPIData.assets[limitIndex].checkerFileLevelDebitLimitAmt;
				    		userWorkingData.assets[limitIndex].checkerFileLevelDebitLimitAmtClass = 'removedField';
				    	}
				    	/*//checkerBatchLevelCreditLimitAmt
				    	if( userWorkingData.assets[limitIndex].checkerBatchLevelCreditLimitAmt )
				    	{
					    	if( queryAPIData.assets[limitIndex].checkerBatchLevelCreditLimitAmt != userWorkingData.assets[limitIndex].checkerBatchLevelCreditLimitAmt )
					    	{
					    		userWorkingData.assets[limitIndex].checkerBatchLevelCreditLimitAmtClass = 'modifiedField';
					    	}
				    	}
				    	else
				    	{
				    		userWorkingData.assets[limitIndex].checkerBatchLevelCreditLimitAmt = queryAPIData.assets[limitIndex].checkerBatchLevelCreditLimitAmt;
				    		userWorkingData.assets[limitIndex].checkerBatchLevelCreditLimitAmtClass = 'removedField';
				    	}
				    	//checkerBatchLevelDebitLimitAmt
				    	if( userWorkingData.assets[limitIndex].checkerBatchLevelDebitLimitAmt )
				    	{
					    	if( queryAPIData.assets[limitIndex].checkerBatchLevelDebitLimitAmt != userWorkingData.assets[limitIndex].checkerBatchLevelDebitLimitAmt )
					    	{
					    		userWorkingData.assets[limitIndex].checkerBatchLevelDebitLimitAmtClass = 'modifiedField';
					    	}
				    	}
				    	else
				    	{
				    		userWorkingData.assets[limitIndex].checkerBatchLevelDebitLimitAmt = queryAPIData.assets[limitIndex].checkerBatchLevelDebitLimitAmt;
				    		userWorkingData.assets[limitIndex].checkerBatchLevelDebitLimitAmtClass = 'removedField';
				    	}*/
				    	
				    	//checkerCumulativeCreditLimitAmt
				    	if( userWorkingData.assets[limitIndex].checkerCumulativeCreditLimitAmt )
				    	{
					    	if( queryAPIData.assets[limitIndex].checkerCumulativeCreditLimitAmt != userWorkingData.assets[limitIndex].checkerCumulativeCreditLimitAmt )
					    	{
					    		userWorkingData.assets[limitIndex].checkerCumulativeCreditLimitAmtClass = 'modifiedField';
					    	}
				    	}
				    	else
				    	{
				    		userWorkingData.assets[limitIndex].checkerCumulativeCreditLimitAmt = queryAPIData.assets[limitIndex].checkerCumulativeCreditLimitAmt;
				    		userWorkingData.assets[limitIndex].checkerCumulativeCreditLimitAmtClass = 'removedField';
				    	}
				    	//checkerCumulativeDebitLimitAmt
				    	if( userWorkingData.assets[limitIndex].checkerCumulativeDebitLimitAmt )
				    	{
					    	if( queryAPIData.assets[limitIndex].checkerCumulativeDebitLimitAmt != userWorkingData.assets[limitIndex].checkerCumulativeDebitLimitAmt )
					    	{
					    		userWorkingData.assets[limitIndex].checkerCumulativeDebitLimitAmtClass = 'modifiedField';
					    	}
				    	}
				    	else
				    	{
				    		userWorkingData.assets[limitIndex].checkerCumulativeDebitLimitAmt = queryAPIData.assets[limitIndex].checkerCumulativeDebitLimitAmt;
				    		userWorkingData.assets[limitIndex].checkerCumulativeDebitLimitAmtClass = 'removedField';
				    	}
				    	
				    	// View Changes in Customized Limit Grids
				    	if(userWorkingData.assets[limitIndex].makerPaymentCategory){
				    		$.each(userWorkingData.assets[limitIndex].makerPaymentCategory,function(index,workObj){
				    			
				    			if(queryAPIData && queryAPIData.assets[limitIndex] && queryAPIData.assets[limitIndex].makerPaymentCategory && queryAPIData.assets[limitIndex].makerPaymentCategory[index]){
					    		if(workObj.profileCode != queryAPIData.assets[limitIndex].makerPaymentCategory[index].profileCode){
					    			if(null == workObj.profileCode || undefined == workObj.profileCode  || workObj.profileCode == ""){
						    			workObj.custLimitClass = 'removedField';
						    			workObj.profileCode = queryAPIData.assets[limitIndex].makerPaymentCategory[index].profileCode;
						    			workObj.profileDescription = queryAPIData.assets[limitIndex].makerPaymentCategory[index].profileDescription;						    				
					    			}else{
						    			workObj.custLimitClass = 'modifiedField';				    				
					    			}
					    		}
				    			}
					    	});
				    	}
				    	
				    	
				    	if(userWorkingData.assets[limitIndex].checkerPaymentCategory){
				    		$.each(userWorkingData.assets[limitIndex].checkerPaymentCategory,function(index,workObj){
				    			if(queryAPIData && queryAPIData.assets[limitIndex] && queryAPIData.assets[limitIndex].checkerPaymentCategory && queryAPIData.assets[limitIndex].checkerPaymentCategory[index]){
						    		if(workObj.profileCode != queryAPIData.assets[limitIndex].checkerPaymentCategory[index].profileCode){
						    			if(null == workObj.profileCode || undefined == workObj.profileCode  || workObj.profileCode == ""){
							    			workObj.custLimitClass = 'removedField';	
							    			workObj.profileCode = queryAPIData.assets[limitIndex].checkerPaymentCategory[index].profileCode;
							    			workObj.profileDescription = queryAPIData.assets[limitIndex].checkerPaymentCategory[index].profileDescription;						    				
						    			}else{
							    			workObj.custLimitClass = 'modifiedField';				    				
						    			}
						    		}
				    			}
					    	});
				    	}
				    	
				    	
				    	if(userWorkingData.assets[limitIndex].makerSecCode){
				    		$.each(userWorkingData.assets[limitIndex].makerSecCode,function(index,workObj){
				    			if(queryAPIData && queryAPIData.assets[limitIndex] && queryAPIData.assets[limitIndex].makerSecCode && queryAPIData.assets[limitIndex].makerSecCode[index]){
						    		if(workObj.profileCode != queryAPIData.assets[limitIndex].makerSecCode[index].profileCode){
						    			if(null == workObj.profileCode || undefined == workObj.profileCode  || workObj.profileCode == ""){
							    			workObj.custLimitClass = 'removedField';	
							    			workObj.profileCode = queryAPIData.assets[limitIndex].makerSecCode[index].profileCode;
							    			workObj.profileDescription = queryAPIData.assets[limitIndex].makerSecCode[index].profileDescription;						    				
						    			}else{
							    			workObj.custLimitClass = 'modifiedField';				    				
						    			}
						    		}
				    			}
					    	});
				    	}
				    	
				    	if(userWorkingData.assets[limitIndex].checkerSecCode){
				    		$.each(userWorkingData.assets[limitIndex].checkerSecCode,function(index,workObj){
				    			if(queryAPIData && queryAPIData.assets[limitIndex] && queryAPIData.assets[limitIndex].checkerSecCode && queryAPIData.assets[limitIndex].checkerSecCode[index]){
						    		if(workObj.profileCode != queryAPIData.assets[limitIndex].checkerSecCode[index].profileCode){
						    			if(null == workObj.profileCode || undefined == workObj.profileCode  || workObj.profileCode == ""){
							    			workObj.custLimitClass = 'removedField';	
							    			workObj.profileCode = queryAPIData.assets[limitIndex].checkerSecCode[index].profileCode;
							    			workObj.profileDescription = queryAPIData.assets[limitIndex].checkerSecCode[index].profileDescription;						    				
						    			}else{
							    			workObj.custLimitClass = 'modifiedField';				    				
						    			}
						    		}
				    			}
					    	});
				    	}
				    	
				    	
				    	if(userWorkingData.assets[limitIndex].makerPackage){
				    		$.each(userWorkingData.assets[limitIndex].makerPackage,function(index,workObj){
				    			if(queryAPIData && queryAPIData.assets[limitIndex] && queryAPIData.assets[limitIndex].makerPackage && queryAPIData.assets[limitIndex].makerPackage[index]){
						    		if(workObj.profileCode != queryAPIData.assets[limitIndex].makerPackage[index].profileCode){
						    			if(null == workObj.profileCode || undefined == workObj.profileCode  || workObj.profileCode == ""){
							    			workObj.custLimitClass = 'removedField';
							    			workObj.profileCode = queryAPIData.assets[limitIndex].makerPackage[index].profileCode;
							    			workObj.profileDescription = queryAPIData.assets[limitIndex].makerPackage[index].profileDescription;						    				
						    			}else{
							    			workObj.custLimitClass = 'modifiedField';				    				
						    			}
						    		}
				    			}
					    	});
				    	}
				    	
				    	if(userWorkingData.assets[limitIndex].checkerPackage){
				    		$.each(userWorkingData.assets[limitIndex].checkerPackage,function(index,workObj){
				    			if(queryAPIData && queryAPIData.assets[limitIndex] && queryAPIData.assets[limitIndex].checkerPackage && queryAPIData.assets[limitIndex].checkerPackage[index]){
						    		if(workObj.profileCode != queryAPIData.assets[limitIndex].checkerPackage[index].profileCode){
						    			if(null == workObj.profileCode || undefined == workObj.profileCode  || workObj.profileCode == ""){
							    			workObj.custLimitClass = 'removedField';
								    		workObj.profileCode = queryAPIData.assets[limitIndex].checkerPackage[index].profileCode;
								    		workObj.profileDescription = queryAPIData.assets[limitIndex].checkerPackage[index].profileDescription;						    				
						    			}else{
							    			workObj.custLimitClass = 'modifiedField';				    				
						    			}
						    		}
				    			}
					    	});
				    	}
				    	
				    	
				    	
				    	if(userWorkingData.assets[limitIndex].makerPaymentTemplete){
				    		$.each(userWorkingData.assets[limitIndex].makerPaymentTemplete,function(index,workObj){
				    			if(queryAPIData && queryAPIData.assets[limitIndex] && queryAPIData.assets[limitIndex].makerPaymentTemplete && queryAPIData.assets[limitIndex].makerPaymentTemplete[index]){
						    		if(workObj.profileCode != queryAPIData.assets[limitIndex].makerPaymentTemplete[index].profileCode){
						    			if(null == workObj.profileCode || undefined == workObj.profileCode  || workObj.profileCode == ""){
							    			workObj.custLimitClass = 'removedField';	
							    			workObj.profileCode = queryAPIData.assets[limitIndex].makerPaymentTemplete[index].profileCode;
							    			workObj.profileDescription = queryAPIData.assets[limitIndex].makerPaymentTemplete[index].profileDescription;						    				
						    			}else{
							    			workObj.custLimitClass = 'modifiedField';				    				
						    			}
						    		}
				    			}
					    	});
				    	}
				    	
				    	if(userWorkingData.assets[limitIndex].checkerPaymentTemplate){
				    		$.each(userWorkingData.assets[limitIndex].checkerPaymentTemplate,function(index,workObj){
				    			if(queryAPIData && queryAPIData.assets[limitIndex] && queryAPIData.assets[limitIndex].checkerPaymentTemplate && queryAPIData.assets[limitIndex].checkerPaymentTemplate[index]){
						    		if(workObj.profileCode != queryAPIData.assets[limitIndex].checkerPaymentTemplate[index].profileCode){
						    			if(null == workObj.profileCode || undefined == workObj.profileCode  || workObj.profileCode == ""){
							    			workObj.custLimitClass = 'removedField';
							    			workObj.profileCode = queryAPIData.assets[limitIndex].checkerPaymentTemplate[index].profileCode;
							    			workObj.profileDescription = queryAPIData.assets[limitIndex].checkerPaymentTemplate[index].profileDescription;						    				
						    			}else{
							    			workObj.custLimitClass = 'modifiedField';				    				
						    			}
						    		}
				    			}
					    	});
				    	}
				    	
				    	
					}
			    	
			    }
			    else
			    {
			    $.each(userWorkingData.assets,function(index,asset){
			    	if(asset.notionalAgreements){
		        		 for(var i = 0; i < asset.notionalAgreements.length; i++){
			        	        if(!asset.notionalAgreements[i].assignedFlag) {
			        	        	asset.notionalAgreements.splice(i,1);
			        	            i--; // Prevent skipping an item
			        	        }
			        	  }
		        	}
		        	if(asset.sweepAgreements){
		        		 for(var i = 0; i < asset.sweepAgreements.length; i++){
			        	        if(!asset.sweepAgreements[i].assignedFlag) {
			        	        	asset.sweepAgreements.splice(i,1);
			        	            i--; // Prevent skipping an item
			        	        }
			        	  }
		        	}
		        	if(asset.packages){
		        		 for(var i = 0; i < asset.packages.length; i++){
			        	        if(!asset.packages[i].assignedFlag) {
			        	        	asset.packages.splice(i,1);
			        	            i--; // Prevent skipping an item
			        	        }
			        	  }
		        	}
		        	if(asset.accounts){
                    for (var i = 0; i < asset.accounts.length; i++) {
						asset.accounts[i].accountName = asset.accounts[i].accountName.replace(/amp;/g, '');
						asset.accounts[i].accountName = asset.accounts[i].accountName.replace(/&quot;/g, '');
			        	        if(!asset.accounts[i].assignedFlag) {
			        	        	asset.accounts.splice(i,1);
			        	            i--; // Prevent skipping an item
			        	        }
			        	  }
		        	}
		        	if(asset.templates){
		        		 for(var i = 0; i < asset.templates.length; i++){
			        	        if(!asset.templates[i].assignedFlag) {
			        	        	asset.templates.splice(i,1);
			        	            i--; // Prevent skipping an item
			        	        }
			        	  }
		        	}
		        	
		        	//Limits - Remove Unassigned/Null Entries
		        	if(asset.makerPaymentCategory){
		        		 for(var i = 0; i < asset.makerPaymentCategory.length; i++){
		        			 if(null == asset.makerPaymentCategory[i].profileCode || undefined ==  asset.makerPaymentCategory[i].profileCode || 
		        				asset.makerPaymentCategory[i].profileCode == ""){
		        				 asset.makerPaymentCategory.splice(i,1);
			        	         i--; 
		        			 }
			        	  }
		        	}
		        	
		        	
		        	if(asset.checkerPaymentCategory){
		        		 for(var i = 0; i < asset.checkerPaymentCategory.length; i++){
		        			 if(null == asset.checkerPaymentCategory[i].profileCode || undefined ==  asset.checkerPaymentCategory[i].profileCode || 
		        				asset.checkerPaymentCategory[i].profileCode == ""){
		        				 asset.checkerPaymentCategory.splice(i,1);
			        	         i--; 
		        			 }
			        	  }
		        	}
		        	
		        	if(asset.makerSecCode){
		        		 for(var i = 0; i < asset.makerSecCode.length; i++){
		        			 if(null == asset.makerSecCode[i].profileCode || undefined ==  asset.makerSecCode[i].profileCode || 
		        				asset.makerSecCode[i].profileCode == ""){
		        				 asset.makerSecCode.splice(i,1);
			        	         i--; 
		        			 }
			        	  }
		        	}
		        	
		        	
		        	if(asset.checkerSecCode){
		        		 for(var i = 0; i < asset.checkerSecCode.length; i++){
		        			 if(null == asset.checkerSecCode[i].profileCode || undefined ==  asset.checkerSecCode[i].profileCode || 
		        				asset.checkerSecCode[i].profileCode == ""){
		        				 asset.checkerSecCode.splice(i,1);
			        	         i--; 
		        			 }
			        	  }
		        	}
		        	
		        	if(asset.makerPackage){
		        		 for(var i = 0; i < asset.makerPackage.length; i++){
		        			 if(null == asset.makerPackage[i].profileCode || undefined ==  asset.makerPackage[i].profileCode || 
		        				asset.makerPackage[i].profileCode == ""){
		        				 asset.makerPackage.splice(i,1);
			        	         i--; 
		        			 }
			        	  }
		        	}
		        	
		        	
		        	if(asset.checkerPackage){
		        		 for(var i = 0; i < asset.checkerPackage.length; i++){
		        			 if(null == asset.checkerPackage[i].profileCode || undefined ==  asset.checkerPackage[i].profileCode || 
		        				asset.checkerPackage[i].profileCode == ""){
		        				 asset.checkerPackage.splice(i,1);
			        	         i--; 
		        			 }
			        	  }
		        	}
		        	
		        	
		        	if(asset.makerPaymentTemplete){
		        		 for(var i = 0; i < asset.makerPaymentTemplete.length; i++){
		        			 if(null == asset.makerPaymentTemplete[i].profileCode || undefined ==  asset.makerPaymentTemplete[i].profileCode || 
		        				asset.makerPaymentTemplete[i].profileCode == ""){
		        				 asset.makerPaymentTemplete.splice(i,1);
			        	         i--; 
		        			 }
			        	  }
		        	}
		        	
		        	
		        	if(asset.checkerPaymentTemplate){
		        		 for(var i = 0; i < asset.checkerPaymentTemplate.length; i++){
		        			 if(null == asset.checkerPaymentTemplate[i].profileCode || undefined ==  asset.checkerPaymentTemplate[i].profileCode || 
		        				asset.checkerPaymentTemplate[i].profileCode == ""){
		        				 asset.checkerPaymentTemplate.splice(i,1);
			        	         i--; 
		        			 }
			        	  }
		        	}
			    });
		        	
			    }
			    // Create and Update details changes
			    
			    
				this.render('static/UsersApp/templates/Verify.hbs',userWorkingData,'',{
					VerifyUserDetails:'static/UsersApp/templates/VerifyUserDetails.hbs',
					VerifyBRPanel:'static/UsersApp/templates/VerifyBRPanel.hbs',
					VerifyPaymentsPanel:'static/UsersApp/templates/VerifyPaymentsPanel.hbs',
					VerifyLiquidityPanel:'static/UsersApp/templates/VerifyLiquidityPanel.hbs',
					VerifyMobilePanel:'static/UsersApp/templates/VerifyMobilePanel.hbs',
					VerifyForecastPanel:'static/UsersApp/templates/VerifyForecastPanel.hbs',
					VerifySCFPanel:'static/UsersApp/templates/VerifySupplyChainPanel.hbs',
					VerifyPortalPanel:'static/UsersApp/templates/VerifyPortalPanel.hbs',
					VerifyCollectionPanel:'static/UsersApp/templates/VerifyCollectionPanel.hbs',
					VerifyLimitPanel:'static/UsersApp/templates/VerifyLimitPanel.hbs'
				}).then(function () {
					
						var userApp = $(Verify.elem.usersApp);
						userApp.html(this.content);
						$("html,body").scrollTop(0);
						if(typeof(defaultHight) != "undefined"){
                                                                    $('.grid').css('max-height',defaultHight);
                                                        }
						$.unblockUI();
					
						//ToDo	
						/*for(var i=userWorkingData.services.length-1; i>=0; i--){
							if(userWorkingData.services[i].assignedFlag){
								var backAsset = userWorkingData.services[i].serviceName.replace(/ /g, '');
								$('#verifyBack').attr('href', '#/'+backAsset);
								break;
							}
						}*/
			        
						VerifyItem.footerBackLinkRef();
						var limitIndex = userWorkingData.assets.findIndex(function(obj){
							return obj.assetId == "18";
						})
						
						if(limitIndex != -1){
							var isMakerCompleteEmpty = false;
							var isCheckerCompleteEmpty = false;
							
							if(!(userWorkingData.assets[limitIndex].defaultMakerPaymentCategory != undefined ? userWorkingData.assets[limitIndex].defaultMakerPaymentCategory != ""? true: false:false ||
									userWorkingData.assets[limitIndex].defaultMakerSecCode != undefined ? userWorkingData.assets[limitIndex].defaultMakerSecCode != "" ? true: false:false ||
									userWorkingData.assets[limitIndex].defaultMakerPackage != undefined? userWorkingData.assets[limitIndex].defaultMakerPackage != "" ? true: false:false||
									userWorkingData.assets[limitIndex].defaultMakerPaymentTemplate != undefined ? userWorkingData.assets[limitIndex].defaultMakerPaymentTemplate != "" ? true: false:false || 
									userWorkingData.assets[limitIndex].defaultMakerAchReversal != undefined ? userWorkingData.assets[limitIndex].defaultMakerAchReversal != "" ? true: false:false ||
									userWorkingData.assets[limitIndex].defaultMakerAchPassthruCCY != undefined ? userWorkingData.assets[limitIndex].defaultMakerAchPassthruCCY != "" ? true: false:false ||
									userWorkingData.assets[limitIndex].makerFileLevelCreditLimitAmt != undefined ? userWorkingData.assets[limitIndex].makerFileLevelCreditLimitAmt != "" ? true: false:false || 
									userWorkingData.assets[limitIndex].makerFileLevelDebitLimitAmt  != undefined ? userWorkingData.assets[limitIndex].makerFileLevelDebitLimitAmt  != "" ? true: false:false ||
									/*userWorkingData.assets[limitIndex].makerBatchLevelCreditLimitAmt != undefined ?  userWorkingData.assets[limitIndex].makerBatchLevelCreditLimitAmt != ""? true: false:false||
									userWorkingData.assets[limitIndex].makerBatchLevelDebitLimitAmt != undefined ? 	userWorkingData.assets[limitIndex].makerBatchLevelDebitLimitAmt != ""? true: false:false ||*/
									userWorkingData.assets[limitIndex].makerCumulativeCreditLimitAmt != undefined ?  userWorkingData.assets[limitIndex].makerCumulativeCreditLimitAmt != ""? true: false:false||
									userWorkingData.assets[limitIndex].makerCumulativeDebitLimitAmt != undefined ? 	userWorkingData.assets[limitIndex].makerCumulativeDebitLimitAmt != ""? true: false:false ||
									userWorkingData.assets[limitIndex].defaultCheckerAchPassthruCCY != undefined  ? userWorkingData.assets[limitIndex].defaultCheckerAchPassthruCCY != ""? true: false:false)){
									
									    if(!((userWorkingData.assets[limitIndex].makerPaymentCategory != undefined && userWorkingData.assets[limitIndex].makerPaymentCategory.length > 0) ||
											 (userWorkingData.assets[limitIndex].makerSecCode != undefined && userWorkingData.assets[limitIndex].makerSecCode.length > 0) ||
											 (userWorkingData.assets[limitIndex].makerPackage != undefined && userWorkingData.assets[limitIndex].makerPackage.length > 0) ||
											 (userWorkingData.assets[limitIndex].makerPaymentTemplete != undefined && userWorkingData.assets[limitIndex].makerPaymentTemplete.length > 0))){
									    	
												$('#makerLimitSpan').hide();
											    isMakerCompleteEmpty = true;

									    }else{
									    	isMakerCompleteEmpty = false;
									    }
								}else{
									isMakerCompleteEmpty = false;
								}
								if(!(userWorkingData.assets[limitIndex].defaultCheckerPaymentCategory != undefined ? userWorkingData.assets[limitIndex].defaultCheckerPaymentCategory != ""? true: false:false || 
									userWorkingData.assets[limitIndex].defaultCheckerSecCode != undefined ? userWorkingData.assets[limitIndex].defaultCheckerSecCode != ""? true: false:false ||
									userWorkingData.assets[limitIndex].defaultCheckerPackage != undefined ? userWorkingData.assets[limitIndex].defaultCheckerPackage != ""? true: false:false || 
									userWorkingData.assets[limitIndex].defaultCheckerPaymentTemplate != undefined ? userWorkingData.assets[limitIndex].defaultCheckerPaymentTemplate != ""? true: false:false ||
									userWorkingData.assets[limitIndex].defaultCheckerAchReversal != undefined ?userWorkingData.assets[limitIndex].defaultCheckerAchReversal != ""? true: false:false ||
									userWorkingData.assets[limitIndex].defaultCheckerAchPassthruCCY != undefined ? userWorkingData.assets[limitIndex].defaultCheckerAchPassthruCCY != ""? true: false:false || 
									userWorkingData.assets[limitIndex].checkerFileLevelCreditLimitAmt!= undefined ? userWorkingData.assets[limitIndex].checkerFileLevelCreditLimitAmt!= ""? true: false:false  ||
									userWorkingData.assets[limitIndex].checkerFileLevelDebitLimitAmt != undefined ? userWorkingData.assets[limitIndex].checkerFileLevelDebitLimitAmt != ""? true: false:false ||
/*									userWorkingData.assets[limitIndex].checkerBatchLevelCreditLimitAmt != undefined ? userWorkingData.assets[limitIndex].checkerBatchLevelCreditLimitAmt != ""? true: false:false || 
									userWorkingData.assets[limitIndex].checkerBatchLevelDebitLimitAmt != undefined ? userWorkingData.assets[limitIndex].checkerBatchLevelDebitLimitAmt != ""? true: false:false ||*/
									userWorkingData.assets[limitIndex].checkerCumulativeCreditLimitAmt != undefined ? userWorkingData.assets[limitIndex].checkerCumulativeCreditLimitAmt != ""? true: false:false || 
									userWorkingData.assets[limitIndex].checkerCumulativeDebitLimitAmt != undefined ? userWorkingData.assets[limitIndex].checkerCumulativeDebitLimitAmt != ""? true: false:false ||		
									userWorkingData.assets[limitIndex].defaultMakerAchPassthruCCY != undefined ?userWorkingData.assets[limitIndex].defaultMakerAchPassthruCCY != ""? true: false:false)){
									
										if(!((userWorkingData.assets[limitIndex].checkerPaymentCategory != undefined && userWorkingData.assets[limitIndex].checkerPaymentCategory.length > 0) ||
											 (userWorkingData.assets[limitIndex].checkerSecCode != undefined && userWorkingData.assets[limitIndex].checkerSecCode.length > 0) ||
											 (userWorkingData.assets[limitIndex].checkerPackage != undefined && userWorkingData.assets[limitIndex].checkerPackage.length > 0) ||
											 (userWorkingData.assets[limitIndex].checkerPaymentTemplate != undefined && userWorkingData.assets[limitIndex].checkerPaymentTemplate.length > 0))){
									    	
												$('#checkerLimitSpan').hide();
											    isCheckerCompleteEmpty = true;

									    }else{
									    	isCheckerCompleteEmpty = false;
									    }

								}else{
									isCheckerCompleteEmpty = false;
								}

								if(isMakerCompleteEmpty && isCheckerCompleteEmpty)
									$('#limitAssetBody').html('');
						}
						
						$('.ft-layout-header').empty()
						$('div#PageTitle').prependTo('.ft-layout-header');
						$('span.ft-title').prependTo('#PageTitle');
						$('.ft-layout-header').removeAttr( 'style' );
						$('.fa-refresh').hide();
						$('.t-update-text').hide();
						$("[id$='lblAmt']").autoNumeric("init",
                                {
                            aSep: ",",
                            dGroup: strAmountDigitGroup,
                            aDec: ".",
                            mDec: "2",
                            vMin:"0.00"
                                		});			
						$('makerFileLevelCreditLimitAmt_lblAmt').autoNumeric('set', userWorkingData.assets[limitIndex].makerFileLevelCreditLimitAmt);
						$('makerFileLevelDebitLimitAmt_lblAmt').autoNumeric('set', userWorkingData.assets[limitIndex].makerFileLevelDebitLimitAmt);
						/*$('makerBatchLevelCreditLimitAmt_lblAmt').autoNumeric('set', userWorkingData.assets[limitIndex].makerBatchLevelCreditLimitAmt);
						$('makerBatchLevelDebitLimitAmt_lblAmt').autoNumeric('set', userWorkingData.assets[limitIndex].makerBatchLevelDebitLimitAmt);*/
						$('makerCumulativeCreditLimitAmt_lblAmt').autoNumeric('set', userWorkingData.assets[limitIndex].makerCumulativeCreditLimitAmt);
						$('makerCumulativeDebitLimitAmt_lblAmt').autoNumeric('set', userWorkingData.assets[limitIndex].makerCumulativeDebitLimitAmt);
						
						$('checkerFileLevelCreditLimitAmt_lblAmt').autoNumeric('set', userWorkingData.assets[limitIndex].checkerFileLevelCreditLimitAmt);
						$('checkerFileLevelDebitLimitAmt_lblAmt').autoNumeric('set', userWorkingData.assets[limitIndex].checkerFileLevelDebitLimitAmt);
						/*$('checkerBatchLevelCreditLimitAmt_lblAmt').autoNumeric('set', userWorkingData.assets[limitIndex].checkerBatchLevelCreditLimitAmt);
						$('checkerBatchLevelDebitLimitAmt_lblAmt').autoNumeric('set', userWorkingData.assets[limitIndex].checkerBatchLevelDebitLimitAmt);*/
						$('checkerCumulativeCreditLimitAmt_lblAmt').autoNumeric('set', userWorkingData.assets[limitIndex].checkerCumulativeCreditLimitAmt);
						$('checkerCumulativeDebitLimitAmt_lblAmt').autoNumeric('set', userWorkingData.assets[limitIndex].checkerCumulativeDebitLimitAmt);
						UsersApp.trigger('UserVerifyInit');
						onAnchorKeydown();
				});
			});
		}
		
	};

	UsersApp.bind('renderUserVerify', Verify.render);

})(jQuery);
