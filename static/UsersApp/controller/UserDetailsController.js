/*global jQuery, User Details Controller */
var TT_UserAppItem;
var existingUserData =[], isTemplateOnly, superUser, requireMFA, allowConfidential, usrMobileEnble, rdcFlag, disableReject;
var isExpand = false; 
(function ($) {
	'use strict';

	TT_UserAppItem = {
		
		UserDetails: function() {
			
			
			if(mode == "new" && (null == userWorkingData.recordKeyNo)){
				var cmdVersion = commandVersion + 1 ;
				commandVersion += 1 ;
				$('input[id^="loginId"]').val($('#loginId').val().toUpperCase());
				toUpperWithoutLeadNTrailSpaces($('#firstName'));
				toUpperWithoutLeadNTrailSpaces($('#lastName'));
				
				
				if(userWorkingData.copyFromFlag){
					
					UsersApp.trigger('CopyUserDetail', {
						commandName: "CopyUserDetail",
						path: '/userApi/userDetails/CopyUser',
						kv: {
							firstName: $('#firstName').val(),
							lastName: $('#lastName').val(),
							loginId: $('#loginId').val().toUpperCase(),
							department: $('#department').val(),
							telephone: $('#telephone').val(),
							email: $('#email').val(),
							mobileNo: $('#mobileNo').val(),
							address: $('#usrAddress').val(),
							zipcode: $('#zipCode').val(),
							fax: $('#fax').val(),
							city: $('#city').val(),
							usrRoleId: $('#userCategory').val() == "Select" ? "" : $('#userCategory').val(),
							usrCountry: $('#usrCountry').val() == "Select" ? "" : $('#usrCountry').val(),
							usrCountryDesc : $( "#usrCountry option:selected" ).text(),
							activationDate : $('#activationDate').datepicker({ dateFormat: strUserDateFormat }).val(),
							lngActivationDate : Date.parse($('#activationDate' ).datepicker( "getDate" )),
							usrApprovalLevel : $('#approvalLevel').val() == getLabel("lbl.clientUser.select","Select") ? "" : $('#approvalLevel').val(),
							isTemplateOnly : userWorkingData.isTemplateOnly,
							superUser : userWorkingData.superUser,
							allowConfidential : userWorkingData.allowConfidential,
							disableReject : userWorkingData.disableReject,
							requireMFA : userWorkingData.requireMFA,
							usrMobileEnble : userWorkingData.usrMobileEnble,
							usrState :$('#usrState').val() == getLabel("lbl.clientUser.select","Select") ? "" : $('#usrState').val(),
							usrStateDesc : $( "#usrCountry option:selected" ).text() == "Select" ? "" : $( "#usrCountry option:selected" ).text(),
							usrLanguage :$('#usrLanguage').val() == "Select" ? "" : $('#usrLanguage').val(),
							usrLanguageDesc : $( "#usrLanguage option:selected" ).text() == "Select" ? "" : $( "#usrLanguage option:selected" ).text(),
							corpId : userWorkingData.corpId,
							usrClient :userWorkingData.usrClient,
							/*rdcFlag : userWorkingData.rdcFlag,
							rdcUserKey : $('#rdcUserKey').val(),*/
							usrSSOLoginId : $('#ssoLoginId').val(),
							srcCorpId : userWorkingData.srcCorpId,
							srcLoginId : userWorkingData.srcLoginId,
							srcRoleId : userWorkingData.srcRoleId,
							usrMfaTrigger :$('#usrMfaTrigger').val(),
							mfaTriggerDesc : $( "#usrMfaTrigger option:selected" ).text(),
							commandVersion : cmdVersion
						}
					  });

			
				}else{
					UsersApp.trigger('CreateUserDetail', {
						commandName: "CreateUserDetail",
						path: '/userApi/userDetails/CreateUser',
						kv: {
							firstName: $('#firstName').val(),
							lastName: $('#lastName').val(),
							loginId: $('#loginId').val().toUpperCase(),
							department: $('#department').val(),
							telephone: $('#telephone').val(),
							email: $('#email').val(),
							mobileNo: $('#mobileNo').val(),
							address: $('#usrAddress').val(),
							zipcode: $('#zipCode').val(),
							fax: $('#fax').val(),
							city: $('#city').val(),
							usrRoleId: $('#userCategory').val() == "Select" ? "" : $('#userCategory').val(),
							usrCountry: $('#usrCountry').val(),
							usrCountryDesc : $( "#usrCountry option:selected" ).text(),
							activationDate : $('#activationDate').datepicker({ dateFormat: strUserDateFormat }).val(),
							lngActivationDate : Date.parse($('#activationDate' ).datepicker( "getDate" )),
							usrApprovalLevel : $('#approvalLevel').val() == "Select" ? "" : $('#approvalLevel').val(),
							isTemplateOnly : isTemplateOnly,
							superUser : superUser,
							allowConfidential : allowConfidential,
							disableReject : disableReject,
							requireMFA : requireMFA,
							usrMobileEnble : usrMobileEnble,
							usrState :$('#usrState').val() == "Select" ? "" : $('#usrState').val(),
							usrStateDesc : $( "#usrState option:selected" ).text() == "Select" ? "" : $( "#usrState option:selected" ).text(),
							usrLanguage :$('#usrLanguage').val() == "Select" ? "" : $('#usrLanguage').val(),
							usrLanguageDesc : $( "#usrLanguage option:selected" ).text() == "Select" ? "" : $( "#usrLanguage option:selected" ).text(),
							corpId : userWorkingData.corpId,
							usrClient :userWorkingData.usrClient,
							/*rdcFlag : rdcFlag,
							rdcUserKey : $('#rdcUserKey').val(),*/
							usrSSOLoginId : $('#ssoLoginId').val(),
							usrMfaTrigger :$('#usrMfaTrigger').val(),
							mfaTriggerDesc : $( "#usrMfaTrigger option:selected" ).text(),
							commandVersion : cmdVersion
						}
					  });
				}			
			}else{

				var cmdVersion = commandVersion + 1 ;
				commandVersion += 1 ;
				$('input[id^="loginId"]').val($('#loginId').val().toUpperCase());
				toUpperWithoutLeadNTrailSpaces($('#firstName'));
				toUpperWithoutLeadNTrailSpaces($('#lastName'));
				
			UsersApp.trigger('UpdateUserDetail', {
				commandName: "UpdateUserDetail",
				path: '/userApi/userDetails/UpdateUser',
				kv: {
					firstName: $('#firstName').val(),
					lastName: $('#lastName').val(),
					//loginId: $('#loginId').val().toUpperCase(),
					department: $('#department').val(),
					telephone: $('#telephone').val(),
					email: $('#email').val(),
					mobileNo: $('#mobileNo').val(),
					address: $('#usrAddress').val(),
					zipcode: $('#zipCode').val(),
					fax: $('#fax').val(),
					city: $('#city').val(),
				//	usrRoleId: $('#userCategory').val(),
					usrCountry: $('#usrCountry').val(),
					usrCountryDesc : $( "#usrCountry option:selected" ).text(),
					activationDate : $('#activationDate').datepicker({ dateFormat: strUserDateFormat }).val(),
					lngActivationDate : Date.parse($('#activationDate' ).datepicker( "getDate" )),
					usrApprovalLevel : $('#approvalLevel').val() == "Select" ? "" : $('#approvalLevel').val(),
					isTemplateOnly : isTemplateOnly,
					superUser : superUser,
					allowConfidential : allowConfidential,
					disableReject : disableReject,
					requireMFA : requireMFA,
					usrMobileEnble :usrMobileEnble,
					usrState :$('#usrState').val() == "Select" ? "" : $('#usrState').val(),
					usrStateDesc : $( "#usrState option:selected" ).text() == "Select" ? "" : $( "#usrState option:selected" ).text(),
					usrLanguage :$('#usrLanguage').val() == "Select" ? "" : $('#usrLanguage').val(),
					usrLanguageDesc : $( "#usrLanguage option:selected" ).text() == "Select" ? "" : $( "#usrLanguage option:selected" ).text(),
					corpId : userWorkingData.corpId,
					usrClient :userWorkingData.usrClient,
					rdcFlag : userWorkingData.rdcFlag,
					rdcUserKey : userWorkingData.rdcUserKey,
					usrMfaTrigger :$('#usrMfaTrigger').val(),
					mfaTriggerDesc : $( "#usrMfaTrigger option:selected" ).text(),
					commandVersion : cmdVersion
					
				}
			  });
			
				
			}
			
		},
	
		toggleAdress: function () {
			$('#lnkChangeAddress').toggleClass("fa-caret-up fa-caret-down");
			$('#usrAddressDiv').slideToggle(200);
			if($('#lnkChangeAddress').hasClass('fa-caret-down'))
				isExpand = true;
			else
				isExpand = false; 
			return false;
		},
		
		changeRole : function(){
			if(userWorkingData.recordKeyNo){
				var  prevRole= userWorkingData.usrRoleId;
				$('#roleChangeMsgPopup').dialog({
					autoOpen : false,
					title: getLabel('lbl.message.title','Message'),
					height : 220,
					width : 430,
					modal : true,
					resizable: false,
					draggable: false,
					open: function() {
						  var msg = getLabel('errRevisit',' Please revisit all the user specific linkages as the linkages might have changed due to role change.');
						  $(this).html(msg);
					},
					buttons : [
					    {
						      text: getLabel("lbl.clientuser.btnOk","OK"),
						      click: function() {
									TT_UserAppItem.selectRoleDetails();
									$(this).dialog("close");
						      }
						    },
						    {
							      text: getLabel("lbl.clientUser.btnCancel","Cancel"),
							      click: function() {
										$('#userCategory').val(prevRole);
										$('#userCategory').niceSelect('update');
										$(this).dialog("close");
							      }
							    }
						  ]
				});
				$('#roleChangeMsgPopup').dialog("open");	
			}else
				TT_UserAppItem.selectRoleDetails();
		},
		
		selectRoleDetails : function() {
			$.blockUI();
			$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;Loading...</h2></div>',
			css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});
			
			var cmdVersion = commandVersion + 1 ;
			commandVersion += 1 ;
			
			var index = userWorkingData.roleList.findIndex(function(obj){
				return (obj.roleId == $('#userCategory').val());
			});
			prevDefaultSub = "";
			userWorkingData.approvalMatrix = [];
			if(index != -1){
				UsersApp.trigger('SwitchUserRole', {
					commandName: "SwitchUserRole",
					path: '/userApi/userDetails/UpdateRole',
					kv: {
						corpId :userWorkingData.roleList[index].roleCorpId,
						digest : userWorkingData.roleList[index].digest,
						usrRoleId: $('#userCategory').val() == "Select" ? "" : $('#userCategory').val(),
						loginId: $('#loginId').val(),
						commandVersion : cmdVersion
					}
				});
			}else{
				UsersApp.trigger('SwitchUserRole', {
					commandName: "SwitchUserRole",
					path: '/userApi/userDetails/UpdateRole',
					kv: {
						usrRoleId: $('#userCategory').val() == "Select" ? "" : $('#userCategory').val(),
						loginId: $('#loginId').val(),
						commandVersion : cmdVersion
					}
				});
				
			}
			
			if(userWorkingData.portalEnable){
				var cmdVersion = commandVersion + 1 ;
				commandVersion += 1 ;
				UsersApp.trigger('UpdatePortalDetails', {
					commandName: "UpdatePortalDetails",
					path: '/usersApi/Portal/Portals',
					kv: {	
						billPayID : userWorkingData.billPayID,
						remoteDepositID : userWorkingData.remoteDepositID,
						netCaptureAdmUsrId : userWorkingData.netCaptureAdmUsrId,
						assetId : "19",
			            commandVersion : cmdVersion
					}
				});
				
			}
			
			if(userWorkingData.mobileEnble){
				var cmdVersion = commandVersion + 1 ;
				commandVersion += 1 ;
				UsersApp.trigger('UpdateMobileDetails', {
					commandName: "UpdateMobileDetails",
					path: '/usersApi/Mobile/Mobiles',
					kv: {
						rdcFlag : userWorkingData.rdcFlag,
						rdcUserKey : userWorkingData.rdcUserKey,
						assetId : "20",
			            commandVersion : cmdVersion
					}
				});
				
			}
			
			if(userWorkingData.subsidiaries ? (userWorkingData.subsidiaries.length == 1 ? true : false) : false){
				
				var cmdVersion = commandVersion + 1 ;
    			commandVersion += 1 ;
				UsersApp.trigger('AddUserSubsidiary', {
					commandName: "AddUserSubsidiary",
					path: '/userApi/userDetails/Subsidiary',
					kv: {
						subsidiaryId :  userWorkingData.subsidiaries[0].subsidiaryId,
						subsidiaryName :  userWorkingData.subsidiaries[0].subsidiaryName,
						defaultFlag : true, 
						usrRoleId: $('#userCategory').val(),
						corpId : userWorkingData.corpId,
						assignedFlag : true,
						digest :  userWorkingData.subsidiaries[0].digest,
			            commandVersion : cmdVersion
					}
				});
				
				userWorkingData.usrClient = userWorkingData.subsidiaries[0].subsidiaryId;
				TT_UserAppItem.UserDetails();
			}
			
		},
		selectState : function() {
			var cmdVersion = commandVersion + 1 ;
			commandVersion += 1 ;
			TT_UserAppItem.UserDetails();
			UsersApp.trigger('UpdateCountry', {
				commandName: "UpdateCountry",
				path: '/userApi/userDetails/UpdateCountry',
				kv: {
					countryId : $('#usrCountry').val(),
					countryName : $('#usrCountry').find("option:selected").text(),
					commandVersion : cmdVersion
				}
			});
           
		},
		toggleSubsidiary : function(){
			if($(this).length == 1){
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('input[id=radioSubsidiary_'+ $(this).data('subsidiaryid') + ']').removeAttr('disabled');
					var cmdVersion = commandVersion + 1 ;
	    			commandVersion += 1 ;
					UsersApp.trigger('AddUserSubsidiary', {
						commandName: "AddUserSubsidiary",
						path: '/userApi/userDetails/Subsidiary',
						kv: {
							subsidiaryId :  $(this).attr('data-subsidiaryid'),
							subsidiaryName : $(this).data('subsidiaryname'),
							defaultFlag : false, 
							usrRoleId: $('#userCategory').val(),
							corpId : userWorkingData.corpId,
							assignedFlag : true,
							digest :  $(this).data('digest'),
				            commandVersion : cmdVersion
						}
					});
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif")
					$('input[id=radioSubsidiary_'+ $(this).data('subsidiaryid') + ']').attr('disabled','disabled');
					var defaultSub = $('input[type=radio][name=defaultClientRadio]:checked').data('subsidiaryid'); 
					if( defaultSub ==  $(this).data('subsidiaryid') ){
						$('input[type=radio][name=defaultClientRadio]:checked').prop('checked', false);
						prevDefaultSub = ""; 

					}
					
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					UsersApp.trigger('RemoveUserSubsidiary', {
						commandName: "RemoveUserSubsidiary",
						path: '/userApi/userDetails/Subsidiary',
						kv: {						
							subsidiaryId :  $(this).attr('data-subsidiaryid'),
							subsidiaryName : $(this).data('subsidiaryname'), 
							defaultFlag : false,
							corpId : userWorkingData.corpId,
							usrRoleId: $('#userCategory').val(),
							assignedFlag : false,
							digest :  $(this).data('digest'),
				            commandVersion : cmdVersion
						}
					});
				}
			}
		
		},
		toggleDefaultSubsidiary : function(){
			
			//Reset all default flags in store
			$.each(subsidiaryStore,function(index,subsidiaryCmd){
				if(subsidiaryCmd.commandName == "AddUserSubsidiary"){
					subsidiaryCmd.kv.defaultFlag = false;
				}
			});
			
			
			if(prevDefaultSub){
				var cmdVersion = commandVersion + 1 ;
				commandVersion += 1 ;
				//Set default flag to one subsidiary
				UsersApp.trigger('AddUserSubsidiary', {
					commandName: "AddUserSubsidiary",
					path: '/userApi/userDetails/Subsidiary',
					kv: {
						subsidiaryId :  prevDefaultSub,
						subsidiaryName : prevDefaultSubName,
						defaultFlag : false, 
						usrRoleId: $('#userCategory').val(),
						corpId : userWorkingData.corpId,
						assignedFlag : true,
						digest :  $(this).data('digest'),
			            commandVersion : cmdVersion
					},
					toggleDefault : true
				});				
			}
			
			
			var cmdVersion = commandVersion + 1 ;
			commandVersion += 1 ;
			//Set default flag to one subsidiary
			UsersApp.trigger('AddUserSubsidiary', {
				commandName: "AddUserSubsidiary",
				path: '/userApi/userDetails/Subsidiary',
				kv: {
					subsidiaryId :  $(this).attr('data-subsidiaryid'),
					subsidiaryName : $(this).data('subsidiaryname'),
					defaultFlag : true, 
					usrRoleId: $('#userCategory').val(),
					corpId : userWorkingData.corpId,
					assignedFlag : true,
					digest :  $(this).data('digest'),
		            commandVersion : cmdVersion
				},
				toggleDefault : true
			});
			
			userWorkingData.usrClient = $(this).attr('data-subsidiaryid');
			TT_UserAppItem.UserDetails();
			
			prevDefaultSub = $(this).attr('data-subsidiaryid');
			prevDefaultSubName = $(this).data('subsidiaryname');
		},
		toggleSubsidiaryAll : function(){
			if($(this).length == 1){
				
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkSubsidiary_"]').attr('src',"static/images/icons/icon_checked_grey.gif");
					$('img[id^="chkSubsidiary_"]').off('click');
										
				var eleSubsidiary = $('img[id^="chkSubsidiary_"]');
				for(var iTemp = 0 ; iTemp < eleSubsidiary.length; iTemp++ ) {
						var cmdVersion = commandVersion + 1 ;
		    			commandVersion += 1 ;
						UsersApp.trigger('AddUserSubsidiary', {
							commandName: "AddUserSubsidiary",
							path: '/userApi/userDetails/Subsidiary',
							kv: {
								subsidiaryId : eleSubsidiary[iTemp].dataset.subsidiaryid,
								subsidiaryName : eleSubsidiary[iTemp].dataset.subsidiaryname,
								defaultFlag : false, 
								usrRoleId: $('#userCategory').val(),
								corpId : userWorkingData.corpId,
								assignedFlag : true,
								digest :  eleSubsidiary[iTemp].dataset.digest,
					            commandVersion : cmdVersion
							}
						 });
					}
					
			
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					$('img[id^="chkSubsidiary_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					$('img[id^="chkSubsidiary_"]').off('click' );
					$('img[id^="chkSubsidiary_"]').on('click',TT_UserAppItem.toggleSubsidiary);
					var eleSubsidiary = $('img[id^="chkSubsidiary_"]');
					
					for(var iTemp= 0 ; iTemp < eleSubsidiary.length; iTemp++ ) {
						var cmdVersion = commandVersion + 1 ;
						commandVersion += 1 ;
						
						UsersApp.trigger('RemoveUserSubsidiary', {
							commandName: "RemoveUserSubsidiary",
							path: '/userApi/userDetails/Subsidiary',
							kv: {						
								subsidiaryId :  eleSubsidiary[iTemp].dataset.subsidiaryid,
								subsidiaryName : eleSubsidiary[iTemp].dataset.subsidiaryname,
								defaultFlag : false,
								corpId : userWorkingData.corpId,
								usrRoleId: $('#userCategory').val(),
								assignedFlag : false,
								digest :  $(this).data('digest'),
					            commandVersion : cmdVersion
							}
						});
				  }
				}
			}
		
		},
		saveUser : function(event){
			
			var validate = false, srvcValid=false;
			$('#errorPara').text("");
			$.blockUI();
			$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;Loading...</h2></div>',
				css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});

			if(userWorkingData.admin && ($('#corporation').val() == null || $('#corporation').val() == '' )){	
				$('#errorDiv').removeClass('hidden');
				$('#errorPara').append(getLabel("valCorpor","Company Name is required.")+" </br>");
				if(event)
		            event.preventDefault();
				validate =true;
	        	$.unblockUI();
			}

			if($('#firstName').val()==''){
				$('#errorDiv').removeClass('hidden');
	        	$('#errorPara').append(getLabel("valFirstNm","First Name is required.")+" </br> ");
	        	if(event)
	            	event.preventDefault();
	        	validate =true;
	        	$.unblockUI();
			}
			if($('#lastName').val()==''){
				$('#errorDiv').removeClass('hidden');
	        	$('#errorPara').append(getLabel("valLastNm","Last Name is required.")+" </br> ");
	        	if(event)
	            	event.preventDefault();
	        	validate =true;
	        	$.unblockUI();
			}
			if(userWorkingData.copyFromFlag && existingUserData.length == 0){
				$('#errorDiv').removeClass('hidden');
				$('#errorPara').append(getLabel("valUser","Existing User is required.")+" </br>");
				if(event)
		            event.preventDefault();
				validate =true;
	        	$.unblockUI();
			}
			if($('#loginId').val()=='' && userWorkingData.metaData.ssoClient == 'N'){	
				$('#errorDiv').removeClass('hidden');
				$('#errorPara').append(getLabel("valLoginId","Login Id is required.")+" </br>");
	        	if(event)
		            event.preventDefault();
				validate =true;
	        	$.unblockUI();
			}
			if($('#ssoLoginId').val()=='' && userWorkingData.metaData.ssoClient == 'Y'){	
				$('#errorDiv').removeClass('hidden');
				$('#errorPara').append(getLabel("valSsoId","SSO User Id is required.")+" </br>");
	        	if(event)
		            event.preventDefault();
				validate =true;
	        	$.unblockUI();
			}
			if($('#activationDate').val()== ''){	
				$('#errorDiv').removeClass('hidden');
				$('#errorPara').append(getLabel("valFirstNm","Activation Date is required.")+" </br>");
				if(event)
		            event.preventDefault();
				validate =true;
	        	$.unblockUI();
			}
						
			if($('#userCategory').val()== '' || $('#userCategory').val()=='Select'){	
				$('#errorDiv').removeClass('hidden');
				$('#errorPara').append(getLabel("valRole","Role is required.")+" </br>");
				if(event)
		            event.preventDefault();
				validate =true;
	        	$.unblockUI();
			}
						
			if($('#usrAddress').val()== ''){
				$('#errorDiv').removeClass('hidden');
				$('#errorPara').append(getLabel("valAddress","Address is required.")+" </br>")
				if(event)
		            event.preventDefault();
				validate =true;
	        	$.unblockUI();
			}
			if($('#usrCountry').val()== ''  || $('#usrCountry').val()=='Select'){
				$('#errorDiv').removeClass('hidden');
				$('#errorPara').append(getLabel("valCountry","At least one country should be selected.")+" </br>");
				if(event)
		            event.preventDefault();
				validate =true;
	        	$.unblockUI();
			}
			
			if ($('#zipCode-label').hasClass('required'))
			{	
			if($('#zipCode').val()== ''){
				$('#errorDiv').removeClass('hidden');
				$('#errorPara').append(getLabel("valZipCode","Zip code is required.")+" </br>");
				if(event)
		            event.preventDefault();
				validate =true;
	        	$.unblockUI();}
			}
			if("true"===emailValidationFlag)
            {
    			if($('#email').val()== ''){
    				$('#errorDiv').removeClass('hidden');
    				$('#errorPara').append(getLabel("valEmail","Email Id is required.")+" </br>");
    				if(event)
    		            event.preventDefault();
    				validate =true;
    	        	$.unblockUI();
    			}
    		}
    		if("true"===mobileValidationFlag)
            {
    			if($('#mobileNo').val()== ''){
    				$('#errorDiv').removeClass('hidden');
    				$('#errorPara').append(getLabel("valMobile","Mobile Number is required.")+" </br>")
    				if(event)
    		            event.preventDefault();
    				validate =true;
    	        	$.unblockUI();
    			}
    		}	
			if($('#mobileNo').val().length!= 0 && ($('#mobileNo').val().length< 10 || $('#mobileNo').val().length> 14)){
                $('#errorDiv').removeClass('hidden');
                $('#errorPara').append(getLabel("lenMobile","Mobile Number length should be 10 to 14 digits")+" </br>")
                if(event)
                    event.preventDefault();
                validate =true;
                $.unblockUI();
            }
			
            if($('#email').val().length!= 0 ){
            	let pattern=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,})+$/;
            	if ($('#email').val().indexOf(",") != -1 || $('#email').val().indexOf(";") != -1){	
            		var result = $('#email').val().split(/[,;]+/);
            		if (result.length > 0 && "Y" === isAllowMultiEmail){
		                for(var i = 0;i < result.length;i++)
		                {
		                	if (!pattern.test(result[i]))
		                	{
		                        $('#errorDiv').removeClass('hidden');
		                        $('#errorPara').append(getLabel("patEmail","Invalid Email")+" </br>")
		                        if(event)
		                            event.preventDefault();
		                        validate =true;
		                        $.unblockUI();
		                    }
		                }
                }
                else if (result.length > 0 && "N" === isAllowMultiEmail){
                	$('#errorDiv').removeClass('hidden');
                    $('#errorPara').append(getLabel("patEmail","Invalid Email")+" </br>")
                    if(event)
                        event.preventDefault();
                    validate =true;
                    $.unblockUI();
                	}
            	}
            	else{
            		if (!pattern.test($('#email').val()))
                    {
                        $('#errorDiv').removeClass('hidden');
                        $('#errorPara').append(getLabel("patEmail","Invalid Email")+" </br>")
                        if(event)
                            event.preventDefault();
                        validate =true;
                        $.unblockUI();
                    }
            	}
            }
            
			if(!($('input[type=radio][name=defaultClientRadio]:checked').length > 0)){
				$('#errorDiv').removeClass('hidden');
				$('#errorPara').append(getLabel("valDefSub","Default Subsidiary should be selected.")+" </br>");
				if(event)
		            event.preventDefault();
				validate =true;
	        	$.unblockUI();
			}
			
			if($('#errorPara').text().length == 0)
			{
				$('#fetchInfoDiv').hide();
			}
			/*else
			{
				var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            	var email = $('#email').val();
            	var result = pattern.test(email);
            	if (!result) {
            		$('#errorDiv').removeClass('hidden');
					$('#errorPara').append("Email Id Invalid.</br>")
					if(event)
			            event.preventDefault();
					validate =true;
		        	$.unblockUI();
            	}
			}*/
			

			if(!validate){
		        //	$.unblockUI();
					$('#errorDiv').addClass('hidden');
			userCommand = TT_UserAppItem.getDetailStore();	
			
			if(userCommand.length > 0){
				UsersApp.trigger('SaveUser');
				if($('#errorPara').length && $('#errorPara').text().length != 0 ) {
					return false;
				}
			}else{
				$.unblockUI();
			}
			
			}else
				 $("html,body").scrollTop(0);
		},
		
		toggleTempateUser : function(){
			if($(this).length == 1){
				
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					 isTemplateOnly = true;
					 userWorkingData.isTemplateOnly = isTemplateOnly;
					 TT_UserAppItem.UserDetails();
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					 isTemplateOnly = false;
					 userWorkingData.isTemplateOnly = isTemplateOnly;
					 TT_UserAppItem.UserDetails();
				}
			}
		
		},
		
		fetchSSOInfo : function(){
			
			var validate = false, srvcValid=false;
			$('#errorPara').text("");
			$.blockUI();
			$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;Loading...</h2></div>',
				css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});
			
			if($('#ssoLoginId').val()=='' && userWorkingData.metaData.ssoClient == 'Y'){	
				$('#errorDiv').removeClass('hidden');
				$('#errorPara').append(getLabel("valSsoId","SSO User Id is required.")+" </br>");
	        	if(event)
		            event.preventDefault();
				validate =true;
	        	$.unblockUI();
			}
			
			if(!validate){
					$('#errorDiv').addClass('hidden');
			userCommand = TT_UserAppItem.getDetailStore();	

				fetchClientUserDetails("frmMain");
				$.unblockUI();
			}else
				 $("html,body").scrollTop(0);
			
		},
		
		toggleCopyUserCheckBox : function(){
			if($(this).length == 1){
				
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('#copyFromUser').removeAttr('disabled');
					$('#lblCopyFrom').addClass('required');
					userWorkingData.copyFromFlag = true; 
					TT_UserAppItem.UserDetails();
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					$('#copyFromUser').attr("value","");
					$('#copyFromUser').attr( "placeholder", 'Search By Existing User' );
					$('#copyFromUser').attr('disabled','disabled');
					$('#lblCopyFrom').removeClass('required');
					userWorkingData.copyFromFlag = false; 
					userWorkingData.metaData = originalData.metaData;
					userWorkingData.roleList = originalData.roleList
					userWorkingData.subsidiaries = originalData.subsidiaries
					userWorkingData.approvalLevelList = originalData.approvalLevelList
					userWorkingData.approvalMatrix = originalData.approvalMatrix
					userWorkingData.isTemplateOnly = originalData.isTemplateOnly
					userWorkingData.superUser = originalData.superUser
					userWorkingData.languageList = originalData.languageList
					userWorkingData.mobileEnble = originalData.mobileEnble
					/*userWorkingData.rdcFlag = originalData.rdcFlag
					userWorkingData.rdcUserKey = originalData.rdcUserKey*/
					userWorkingData.requireMFA = originalData.requireMFA
					userWorkingData.usrMobileEnble = originalData.usrMobileEnble
					userWorkingData.allowConfidential = originalData.allowConfidential
					userWorkingData.disableReject = originalData.disableReject
					userWorkingData.usrRoleId = originalData.usrRoleId
					userWorkingData.usrApprovalLevel = originalData.usrApprovalLevel
					userWorkingData.srcUserDesc = originalData.srcUserDesc;
					userWorkingData.usrMfaList = originalData.usrMfaList;
					
					UsersApp.trigger('renderUserDetails', userWorkingData);
					//TT_UserAppItem.UserDetails();
					
				}
			}
		
		},
		
		toggleSuperUser : function(){
			if($(this).length == 1){
				
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					superUser = true;
					userWorkingData.superUser = superUser;
					 TT_UserAppItem.UserDetails();
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					superUser = false;
					userWorkingData.superUser = superUser;
					 TT_UserAppItem.UserDetails();
				}
			}
		
		},
		toggleViewConfidential : function(){
			if($(this).length == 1){
				
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					allowConfidential = true;
					userWorkingData.allowConfidential = allowConfidential;
					 TT_UserAppItem.UserDetails();
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					allowConfidential = false;
					userWorkingData.allowConfidential = allowConfidential;
					TT_UserAppItem.UserDetails();
				}
			}
		
		},
		toggleViewDisableReject : function(){
			if($(this).length == 1){
				
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					disableReject = true;
					userWorkingData.disableReject = disableReject;
					 TT_UserAppItem.UserDetails();
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					disableReject = false;
					userWorkingData.disableReject = disableReject;
					TT_UserAppItem.UserDetails();
				}
			}
		
		},
		toggleMultiFactor : function(){
			if($(this).length == 1){
				
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					requireMFA = true;
					userWorkingData.requireMFA = requireMFA;
					 TT_UserAppItem.UserDetails();
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					requireMFA = false;
					userWorkingData.requireMFA = requireMFA;
					 TT_UserAppItem.UserDetails();
				}
			}
		
		},
		/*toggleMobileService : function(){
			if($(this).length == 1){
				
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					usrMobileEnble = true;
					userWorkingData.usrMobileEnble = usrMobileEnble;
						
						$('img[id^="chkRdcFlag"]').attr('src',"static/images/icons/icon_unchecked.gif");
						$('img[id^="chkRdcFlag"]').off('click');
						$('img[id^="chkRdcFlag"]').on('click',TT_UserAppItem.toggleRDC);
					 TT_UserAppItem.UserDetails();
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					usrMobileEnble = false;
					userWorkingData.usrMobileEnble = usrMobileEnble;
					rdcFlag = false;
					userWorkingData.rdcFlag = rdcFlag;
					$('img[id^="chkRdcFlag"]').attr('src',"static/images/icons/icon_unchecked_grey.gif");
					$('img[id^="chkRdcFlag"]').off('click');
					$('#rdcUserKey').val('');
					$('#rdcUserKey').attr('disabled','disabled');
					 TT_UserAppItem.UserDetails();
				}
			}
		
		},
		toggleRDC : function(){
			if($(this).length == 1){
				
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					rdcFlag = true;
					userWorkingData.rdcFlag = rdcFlag;
					$('#rdcUserKey').removeAttr('disabled');
					 TT_UserAppItem.UserDetails();
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					rdcFlag = false;
					userWorkingData.rdcFlag = rdcFlag;
					$('#rdcUserKey').val('');
					$('#rdcUserKey').attr('disabled','disabled');
					TT_UserAppItem.UserDetails();
				}
			}
		
		},*/
		loginIdDetail : function(){
			$('#loginId').ForceNoSpecialSymbolWithSpace();
		},
		UpdateUserId : function() {
			
			var updatedloginId= $('#loginId').val().replace(/ /g, '').toUpperCase();
			$('#loginId').val(updatedloginId);
			TT_UserAppItem.UserDetails();
			 var index = userCommand.findIndex(function(obj){
					return (obj.commandName == "SwitchUserRole");
				});
			
			 var existObj = userCommand[index];
				
				if(undefined != existObj){
					userCommand[index].kv.loginId = updatedloginId;
					
				}
				console.log(userCommand);
			
		},
		toggleSubsidiaryInfoCaret: function () {
			$('#subsidiaryInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#subsidiaryInfoDiv').slideToggle(200);
			return false;

		},	
		viewRoleDetails: function(){
			var roleId = $('#userCategory').val();
			var corpId = userWorkingData.corpId;
			if(corpId != null && roleId != null)
			{	
				UsersApp.trigger('renderRoleDetailsVerify');
			}
		},  
		selectApprovalLevel : function() {
			
			$.each(userWorkingData.approvalLevelList,function(index,item){
        		if( item.optionId == $('#approvalLevel').val()){
        			item.assignedFlag = true;
        		}else{
        			item.assignedFlag = false;
        		}			        		
        	});
			TT_UserAppItem.UserDetails();
			
		},
		footerLinkRef : function() {
			if (userWorkingData.brEnable) {
				$('#Next').attr('href', '#/BalanceReporting');
			} else if (userWorkingData.forecastEnable) {
				$('#Next').attr('href', '#/Forecasting');
			} else if (userWorkingData.limitEnable) {
				$('#Next').attr('href', '#/Limit');
			} else if (userWorkingData.lmsEnable) {
				$('#Next').attr('href', '#/Liquidity');
			} else if (userWorkingData.payEnable) {
				$('#Next').attr('href', '#/Payments');
			} else if (userWorkingData.portalEnable) {
				$('#Next').attr('href', '#/Portal');
			} else if (userWorkingData.collectionEnable) {
				$('#Next').attr('href', '#/Collection');
			} else if (userWorkingData.fscEnable) {
				$('#Next').attr('href', '#/SCF');
			}else if (userWorkingData.mobileEnable) {
				$('#Next').attr('href', '#/MobileBanking');
			}
			else{
				$('#Next').attr('href', '#/Verify');
			}
		
		},
		
		getDetailStore : function(){
			return userCommand.concat(authMatrixStore, subsidiaryStore,portalStore);
		},
		
		toggleMobileCaret: function () {
			$('#mobileInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#mobileAssetBody').slideToggle(200);
			return false;

		},
		
		toggleFeaturesCaret: function () {
			$('#featuresInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#featuresAssetBody').slideToggle(200);
			return false;

		},
		
		toggleLabelCheckUncheck: function () {
			if ($(this).length == 1) {
				var chkBoxId = '#' + $(this).attr('for');
				$(chkBoxId).click();
			}
		},
		init: function () {
			if(typeof(defaultHight) != "undefined")
			{
                  $('.grid').css('max-height',defaultHight);
            }
            // start remove all listners
            			$('#chkCopyFrom').off('click',TT_UserAppItem.toggleCopyUserCheckBox);

            			$("#lnkChangeAddress").off('click' );
            			$('img[id^="chkTemplateOnlyFlag"]').off('click' );
            			$('img[id^="chkUsrSuperUser"]').off('click' );
            			$('img[id^="chkUsrAccessType"]').off('click' );
						$('img[id^="chkDisableReject"]').off('click' );
            			$('img[id^="chkUsrMultiFa"]').off('click' );
            			$('img[id^="chkMobileFlag"]').off('click' );
            			//$('img[id^="chkRdcFlag"]').off('click' );

            			$("#userCategory").off('change' );
            			$("#usrCountry").off('change' );
            			$("#approvalLevel").off('change' );

            			$("#firstName").off('change' );
            			$("#lastName").off('change' );
            			$("#loginId").off('change' );
            			$("#department").off('change' );
            			$("#telephone").off('change' );
            			$("#email").off('change' );
            			$("#mobileNo").off('change' );
            			$("#usrAddress").off('change' );
            			$("#zipCode").off('change' );
            			$("#fax").off('change' );
            			$("#city").off('change' );
            			$("#usrLanguage").off('change' );
            			$("#usrState").off('change' );
            			/*$("#rdcUserKey").off('change' );*/
            			$("#ssoLoginId").off('change' );
            			$("#usrMfaTrigger").off('change' );
            			
            			$("#fetchSSOIdInfo").off('click' );
            			$("#saveUpdate").off('click' );
            			$("#Next").off('click' );

            			$('img[id^="chkSubsidiary_"]').off('click' );
            			$('input[id^="radioSubsidiary_"]').off('click' );

            			$('#subsidiaryInfoCaret').off('click' );
            			$('#lnkRoleDetails').off('click' );

            			$('#btnCancel').off('click' );
            			$('#mobileInfoCaret').off('click' );
            			$('#featuresInfoCaret').off('click' );
            			$('#subsidiaryAll').off('click' );

            			$('label[id^="chkTemplateOnlyFlag"]').off('click' );
            			$('label[id^="chkUsrSuperUser"]').off('click' );
            			$('label[id^="chkUsrAccessType"]').off('click' );
						$('label[id^="chkDisableReject"]').off('click' );
            			$('label[id^="chkUsrMultiFa"]').off('click' );
            			$('label[id^="chkMobileFlag"]').off('click' );
            			//$('label[id^="chkRdcFlag"]').off('click' );
            			$('label[id^="subsidiaryAll"]').off('click' );
            			$('label[id^="lblCopyFrom"]').off('click' );

            // end of remvoe all listners
			$('#chkCopyFrom').on('click',TT_UserAppItem.toggleCopyUserCheckBox);
			
			$("#lnkChangeAddress").on('click', TT_UserAppItem.toggleAdress);
			$('img[id^="chkTemplateOnlyFlag"]').on('click',TT_UserAppItem.toggleTempateUser);
			$('img[id^="chkUsrSuperUser"]').on('click',TT_UserAppItem.toggleSuperUser);
			$('img[id^="chkUsrAccessType"]').on('click',TT_UserAppItem.toggleViewConfidential);
			$('img[id^="chkDisableReject"]').on('click',TT_UserAppItem.toggleViewDisableReject);
			$('img[id^="chkUsrMultiFa"]').on('click',TT_UserAppItem.toggleMultiFactor);
			$('img[id^="chkMobileFlag"]').on('click',TT_UserAppItem.toggleMobileService);
			//$('img[id^="chkRdcFlag"]').on('click',TT_UserAppItem.toggleRDC);
			
			$("#userCategory").on('change', TT_UserAppItem.changeRole);
			$("#usrCountry").on('change', TT_UserAppItem.selectState);
			$("#approvalLevel").on('change', TT_UserAppItem.selectApprovalLevel);
						
			$("#firstName").on('change', TT_UserAppItem.UserDetails);
			$("#lastName").on('change', TT_UserAppItem.UserDetails);
			$("#loginId").on('keydown', TT_UserAppItem.loginIdDetail);
			$("#loginId").on('change', TT_UserAppItem.UpdateUserId);
			$("#department").on('change', TT_UserAppItem.UserDetails);
			$("#telephone").on('change', TT_UserAppItem.UserDetails);
			$("#email").on('change', TT_UserAppItem.UserDetails);
			$("#mobileNo").on('change', TT_UserAppItem.UserDetails);
			$("#usrAddress").on('change', TT_UserAppItem.UserDetails);
			$("#zipCode").on('change', TT_UserAppItem.UserDetails);
			$("#fax").on('change', TT_UserAppItem.UserDetails);
			$("#city").on('change', TT_UserAppItem.UserDetails);
			$("#usrLanguage").on('change', TT_UserAppItem.UserDetails);
			$("#usrState").on('change', TT_UserAppItem.UserDetails);
			/*$("#rdcUserKey").on('change', TT_UserAppItem.UserDetails);*/
			$("#ssoLoginId").on('change', TT_UserAppItem.UserDetails);
			$("#usrMfaTrigger").on('change', TT_UserAppItem.UserDetails);
			
			$("#fetchSSOIdInfo").on('click', TT_UserAppItem.fetchSSOInfo);
			$("#saveUpdate").on('click', TT_UserAppItem.saveUser);
			$("#Next").on('click', TT_UserAppItem.saveUser);
			
			
			$('img[id^="chkSubsidiary_"]').on('click', TT_UserAppItem.toggleSubsidiary);
			$('input[id^="radioSubsidiary_"]').on('click', TT_UserAppItem.toggleDefaultSubsidiary);
			
			$('#subsidiaryInfoCaret').on('click',TT_UserAppItem.toggleSubsidiaryInfoCaret);	
			$('#lnkRoleDetails').on('click',TT_UserAppItem.viewRoleDetails);	
			
			$('#btnCancel').on('click', CommonUser.cancel);
			$('#mobileInfoCaret').on('click',TT_UserAppItem.toggleMobileCaret);
			$('#featuresInfoCaret').on('click',TT_UserAppItem.toggleFeaturesCaret);
			$('#subsidiaryAll').on('click', TT_UserAppItem.toggleSubsidiaryAll);
			
			$('label[id^="chkTemplateOnlyFlag"]').on('click', TT_UserAppItem.toggleLabelCheckUncheck);
			$('label[id^="chkUsrSuperUser"]').on('click', TT_UserAppItem.toggleLabelCheckUncheck);
			$('label[id^="chkUsrAccessType"]').on('click', TT_UserAppItem.toggleLabelCheckUncheck);
			$('label[id^="chkDisableReject"]').on('click', TT_UserAppItem.toggleLabelCheckUncheck);
			$('label[id^="chkUsrMultiFa"]').on('click', TT_UserAppItem.toggleLabelCheckUncheck);
			$('label[id^="chkMobileFlag"]').on('click', TT_UserAppItem.toggleLabelCheckUncheck);
			//$('label[id^="chkRdcFlag"]').on('click', TT_UserAppItem.toggleLabelCheckUncheck);
			$('label[id^="subsidiaryAll"]').on('click', TT_UserAppItem.toggleLabelCheckUncheck);
			$('label[id^="lblCopyFrom"]').on('click', TT_UserAppItem.toggleLabelCheckUncheck);
				
		}
	};

	UsersApp.bind('userDetailInit', TT_UserAppItem.init);

})(jQuery);
