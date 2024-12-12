/*global jQuery, UserDetails */

(function ($) {
	'use strict';

	var UserDetails = {
		elem: {
			usersapp: '#ft-layout-container',
			main: '#main',
			footer: '#footer'
		},

		render: function (e, data) {
			
			var loadOptions, loginId, usrRoleId, corp, recordKeyNo,subsidairies="",screenType;
			if(null == strUserDateFormat || undefined == strUserDateFormat || strUserDateFormat == ""){
				strUserDateFormat = 'mm/dd/yy';
			}
			
			if(mode == "edit"){
				loginId = userWorkingData.loginId;
				usrRoleId = userWorkingData.usrRoleId;
				corp = userWorkingData.corpId;
				recordKeyNo = userWorkingData.recordKeyNo;
				
				if(userWorkingData.subsidiaries){
					$.each(userWorkingData.subsidiaries,function(index,subsidiary){
						if(subsidiary.assignedFlag)
							subsidairies += subsidiary.subsidiaryId +",";
					});
					if(subsidairies.length > 1)
						subsidairies = subsidairies.substring(0, subsidairies.length - 1);					
				}
			}else{
				var strRegex =  /[?&]([^=#]+)=([^&#]*)/g,objParam = {},arrMatches = [];
				while (arrMatches = strRegex.exec(window.location.hash)) {
					objParam[arrMatches[1]] = arrMatches[2];
				}
					
				if(user_id || role_id){
					loginId = user_id;
					usrRoleId = role_id;
					corp = corp_id;
					recordKeyNo = recKey_No;
					screenType = screen_type;
					mode = "edit";
					userCommand = [];
				}else{
					
					if(undefined != userWorkingData && userWorkingData.length != 0){
						if(userWorkingData.copyFromFlag){
							loginId = (null === userWorkingData.srcUserId ) ? "" : userWorkingData.srcUserId;
							corp = (null === userWorkingData.srcUserComapany ) ? "" : userWorkingData.srcUserComapany;
							usrRoleId = (null === userWorkingData.usrRoleId ) ? "" : userWorkingData.usrRoleId;
							recordKeyNo = (null === userWorkingData.recordKeyNo ) ? "" : userWorkingData.recordKeyNo;		
							
							if(userWorkingData.subsidiaries){
								$.each(userWorkingData.subsidiaries,function(index,subsidiary){
									if(subsidiary.assignedFlag)
										subsidairies += subsidiary.subsidiaryId +",";
								});
								if(subsidairies.length > 1)
									subsidairies = subsidairies.substring(0, subsidairies.length - 1);					
							}else{
								subsidairies = "";
							}
							
							
						}else{
							loginId = (null === userWorkingData.loginId ) ? "" : userWorkingData.loginId;
							usrRoleId = (null === userWorkingData.usrRoleId ) ? "" : userWorkingData.usrRoleId;
							recordKeyNo = (null === userWorkingData.recordKeyNo ) ? "" : userWorkingData.recordKeyNo;							
							corp = (null === userWorkingData.corpId ) ? "" : userWorkingData.corpId;	
							
							if(userWorkingData.subsidiaries){
								$.each(userWorkingData.subsidiaries,function(index,subsidiary){
									if(subsidiary.assignedFlag)
										subsidairies += subsidiary.subsidiaryId +",";
								});
								if(subsidairies.length > 1)
									subsidairies = subsidairies.substring(0, subsidairies.length - 1);					
							}else{
								subsidairies = "";
							}
						}
					}else{
						loginId = "", 
						usrRoleId = "",
						recordKeyNo ="",
						subsidairies = "",
						corp = "";
					}
					mode = "new";
			}
		
			}
			loadOptions =  {
	                type: 'POST', 
	                dataType: 'JSON',
	                cache : false,
			        async : false,
	                data: {
	                	"userId" : loginId,
	                	"roleId" : usrRoleId,
	                	"recordKeyNo" : recordKeyNo,
	                	"subsidairies" : subsidairies,
	                	"corpId" : corp,
	                	"screenType" : screenType
	                }
            };
			
			if(undefined != data){
				userWorkingData = data;
				userWorkingData.mode = mode;
				commandVersion =  data.commandVersion ? (isNaN(data.commandVersion) ? data.commandVersion  :  parseInt(data.commandVersion) ): 0
				UserDetails.elem.usersapp = $(UserDetails.elem.usersapp);				
		
				if(mode == "new" && (null == userWorkingData.recordKeyNo) && userWorkingData.isCorpChange){
					this.load("services/usersLookUpApi/userDetails",loadOptions).then(
							function(userDetails){
								userWorkingData = userDetails;			
								userWorkingData.mode = mode;
								if(userWorkingData.subsidiaries){
									subsidiaryAssignedCount = 0;
									$.each(userWorkingData.subsidiaries, function(index,obj) {
										if(obj.assignedFlag)
											subsidiaryAssignedCount++
									});
								}
								userWorkingData.subsidiaryAssignedCount = subsidiaryAssignedCount;
								subsidiayCount = userWorkingData.subsidiaryCount; 
								//subsidiaryAssignedCount = userWorkingData.subsidiaryAssignedCount;
								allowConfidential = userWorkingData.allowConfidential;
								disableReject = userWorkingData.disableReject;
							    requireMFA = userWorkingData.requireMFA;
							    superUser = userWorkingData.superUser;
							    isTemplateOnly= userWorkingData.isTemplateOnly;
								usrMobileEnble = userWorkingData.usrMobileEnble;
								rdcFlag = userWorkingData.rdcFlag;
								authMatrixCount = userWorkingData.authMatrixCount; 
								authMatrixAssignedCount = userWorkingData.authMatrixAssignedCount;
								this.render('static/UsersApp/templates/UserDetails.hbs',userWorkingData).then(function () {
									UserDetails.elem.usersapp.html(this.content);
						        	var minDate = $.datepick.formatDate(strUserDateFormat,$.datepick.parseDate('dd/mm/yy', userWorkingData.metaData.applicationDate.split(' ')[0]));
						        	
						        		$('#activationDate' ).datepicker({
						        			dateFormat : strUserDateFormat,
						        			changeMonth: true,
						        		    changeYear: true,
						        			appendText : '',
						        			minDate : userWorkingData.activationDate ? userWorkingData.activationDate : minDate,
						        			onClose: function(dateText) {
						        				var obj = $(this);
						        				setTimeout(function(){obj.trigger('blur');},300);
						        	  		},
						        		onSelect: function( selectedDate ) {
						        			var obj = $(this);
						        				setTimeout(function(){obj.trigger('blur');},300);
						        				lngActivationDate = Date.parse($('#activationDate' ).datepicker( "getDate" ));
						        				TT_UserAppItem.UserDetails();
						        		}
						        		
						        		}).attr('readOnly',true);
									if(userWorkingData.metaData.autoUsrCode != 'PRODUCT')
										$('input[id^="loginId"]').val(userWorkingData.loginId)

//									$('#userCategory').val(userWorkingData.usrRoleId);
									$("#corporation").CorporationAutoComplete();
									if(userWorkingData.corpDesc != undefined){
										var corpDescValue = new String(userWorkingData.corpDesc);
										corpDescValue =  corpDescValue.replace(/&quot;/g, '"');
										userWorkingData.corpDesc = corpDescValue.replace(/amp;/g, '');
									}
									$("#corporation").val(userWorkingData.corpDesc);
									$('#approvalLevel').val(userWorkingData.usrApprovalLevel);
									$('#userCategory').val(userWorkingData.usrRoleId);
									$('#usrLanguage').val(userWorkingData.usrLanguage);
									$('#usrState').val(userWorkingData.usrState);
									$('#usrCountry').val(userWorkingData.usrCountry);
									$('#usrMfaTrigger').val(userWorkingData.usrMfaTrigger);
									$('#userCategory').niceSelect('destroy');
                                    $('#userCategory').niceSelect();
                                    $('#approvalLevel').niceSelect('destroy');
                                    $('#approvalLevel').niceSelect();
                                    $('#usrLanguage').niceSelect('destroy');
                                    $('#usrLanguage').niceSelect();
                                    $('#usrCountry').niceSelect('destroy');
                                    $('#usrCountry').niceSelect();
                                    $('#usrState').niceSelect('destroy');
                                    $('#usrState').niceSelect();
                                    $('#usrMfaTrigger').niceSelect('destroy');
                                    $('#usrMfaTrigger').niceSelect();




									if($('div#PageTitle1').length > 1){
										$('.ft-layout-header').empty();							
									}
									if($('div#PageTitle').length > 0){
										$('.ft-layout-header').empty();							
									}
									
									if(null !=  userWorkingData.recordKeyNo){
										$('#corporation').removeClass('ui-suggestion-box');
										$('#corporation').attr('disabled','disabled');
										$('#loginId').attr('disabled','disabled');
									}
									
									if(userWorkingData.activationDate){
							    		if(userWorkingData.activationDate.includes(' '))
						    			{
					    					var activationDate = $.datepick.formatDate(strUserDateFormat, $.datepick.parseDate('yy-mm-dd', userWorkingData.activationDate.split(' ')[0]));
											$('#activationDate').val(activationDate);			
							    		}
							    		else
						    				$('#activationDate').datepicker('setDate', userWorkingData.activationDate);			
									}else{
										var activationDate =$.datepick.formatDate(strUserDateFormat, $.datepick.parseDate('dd/mm/yy', userWorkingData.metaData.applicationDate.split(' ')[0]));
										$('#activationDate').val(activationDate);
									}
									
									UsersApp.trigger('userDetailInit');
									$('div#PageTitle1').prependTo('.ft-layout-header');
									$('span.ft-title').prependTo('#PageTitle1');
									$('.ft-layout-header').removeAttr( 'style' );
									$('.fa-refresh').hide();
									$('.t-update-text').hide();
									$("#copyFromUser").CopyFromAutoComplete();
									$("#copyFromUser").val(userWorkingData.srcUserDesc);
									$('#copyFromUser').attr('disabled','disabled');
									//To Keep Address Section Bydefault Collapsed
									/*if(!isExpand){
										$('#lnkChangeAddress').toggleClass("fa-caret-up fa-caret-down");
										$('#usrAddressDiv').hide();
									}*/							
									/*if(!userWorkingData.usrMobileEnble){
						        		$('img[id^="chkRdcFlag"]').attr('src',"static/images/icons/icon_unchecked_grey.gif");
										$('img[id^="chkRdcFlag"]').off('click');
						        	}*/
									
									$('#telephone, #mobileNo, #fax').OnlyNumbers();
									UsersApp.trigger('CheckAppMatrixAll', {
										id : "00",
										details : userWorkingData
									});	
									CommonUser.checkSubsidiaryAll();
									TT_UserAppItem.footerLinkRef();
									$.unblockUI();
								});
						});
				}else{
					if(userWorkingData.subsidiaries){
									subsidiaryAssignedCount = 0;
									$.each(userWorkingData.subsidiaries, function(index,obj) {
										if(obj.assignedFlag)
											subsidiaryAssignedCount++
									});
					}
					userWorkingData.subsidiaryAssignedCount = subsidiaryAssignedCount;
					subsidiayCount = userWorkingData.subsidiaryCount; 
					//subsidiaryAssignedCount = userWorkingData.subsidiaryAssignedCount;
					allowConfidential = userWorkingData.allowConfidential;
					disableReject = userWorkingData.disableReject;
				    requireMFA = userWorkingData.requireMFA;
				    superUser = userWorkingData.superUser;
				    isTemplateOnly= userWorkingData.isTemplateOnly;
					usrMobileEnble = userWorkingData.usrMobileEnble;
					rdcFlag = userWorkingData.rdcFlag;
					authMatrixCount = userWorkingData.authMatrixCount; 
					authMatrixAssignedCount = userWorkingData.authMatrixAssignedCount;
					this.render('static/UsersApp/templates/UserDetails.hbs',userWorkingData).then(function () {
						UserDetails.elem.usersapp.html(this.content);
			        	var minDate = $.datepick.formatDate(strUserDateFormat,$.datepick.parseDate('dd/mm/yy', userWorkingData.metaData.applicationDate.split(' ')[0]));
			        	
			        		$('#activationDate' ).datepicker({
			        			dateFormat : strUserDateFormat,
			        			changeMonth: true,
			        		    changeYear: true,
			        			appendText : '',
			        			minDate : userWorkingData.activationDate ? userWorkingData.activationDate : minDate ,
			        			onClose: function(dateText) {
			        				var obj = $(this);
			        				setTimeout(function(){obj.trigger('blur');},300);
			        	  		},
			        		onSelect: function( selectedDate ) {
			        			var obj = $(this);
			        				setTimeout(function(){obj.trigger('blur');},300);
			        				lngActivationDate = Date.parse($('#activationDate' ).datepicker( "getDate" ));
			        				TT_UserAppItem.UserDetails();
			        		}
			        		
			        		}).attr('readOnly',true);
			        		
						if(userWorkingData.metaData.autoUsrCode != 'PRODUCT')
							$('input[id^="loginId"]').val(userWorkingData.loginId)

						$('#usrLanguage').val(userWorkingData.usrLanguage);
						$('#usrState').val(userWorkingData.usrState);
						$('#usrCountry').val(userWorkingData.usrCountry);
						$('#usrMfaTrigger').val(userWorkingData.usrMfaTrigger);
//						$('#userCategory').val(userWorkingData.usrRoleId);
						$("#corporation").CorporationAutoComplete();
						if(userWorkingData.corpDesc != undefined){
							var corpDescValue = new String(userWorkingData.corpDesc);
						    corpDescValue =  corpDescValue.replace(/quot;/g, '');
							userWorkingData.corpDesc = corpDescValue.replace(/amp;/g, '');
						}
						$("#corporation").val(userWorkingData.corpDesc);
						$('#approvalLevel').val(userWorkingData.usrApprovalLevel);
						$('#userCategory').val(userWorkingData.usrRoleId);
                        $('#userCategory').niceSelect('destroy');
                         $('#userCategory').niceSelect();
						$('#approvalLevel').niceSelect('destroy');
                         $('#approvalLevel').niceSelect();
                       $('#usrLanguage').niceSelect('destroy');
                         $('#usrLanguage').niceSelect();
                          $('#usrCountry').niceSelect('destroy');
                            $('#usrCountry').niceSelect();
                            $('#usrState').niceSelect('destroy');
                            $('#usrState').niceSelect();
                            $('#usrMfaTrigger').niceSelect('destroy');
                            $('#usrMfaTrigger').niceSelect();

						if($('div#PageTitle').length > 0){
							$('.ft-layout-header').empty();							
						}
						if($('div#PageTitle1').length > 1){
							$('.ft-layout-header').empty();							
						}
						
						if(userWorkingData.copyFromFlag){
							if(!(userWorkingData.recordKeyNo)){
								var cmdVersion = commandVersion + 1 ;
				    			commandVersion += 1 ;
								TT_UserAppItem.UserDetails();
							}
						}
						
						if(null !=  userWorkingData.recordKeyNo){
							$('#corporation').removeClass('ui-suggestion-box');
							$('#corporation').attr('disabled','disabled');
							$('#loginId').attr('disabled','disabled');
						}
						
						if(userWorkingData.activationDate){
				    		if(userWorkingData.activationDate.includes(' '))
				    		{
				    			var activationDate = $.datepick.formatDate(strUserDateFormat, $.datepick.parseDate('yy-mm-dd', userWorkingData.activationDate.split(' ')[0]));
								$('#activationDate').val(activationDate);			
				    		}
				    		else
				    			$('#activationDate').datepicker('setDate', userWorkingData.activationDate);			
						}else{
							var activationDate =$.datepick.formatDate(strUserDateFormat, $.datepick.parseDate('dd/mm/yy', userWorkingData.metaData.applicationDate.split(' ')[0]));
							$('#activationDate').val(activationDate);
						}
						
						$('div#PageTitle1').prependTo('.ft-layout-header');
						$('span.ft-title').prependTo('#PageTitle1');
						$('.ft-layout-header').removeAttr( 'style' );
						$('.fa-refresh').hide();
						$('.t-update-text').hide();
						$("#copyFromUser").CopyFromAutoComplete();
						$("#copyFromUser").val(userWorkingData.srcUserDesc);
						//To Keep Address Section Bydefault Collapsed
						/*if(!isExpand){
							$('#lnkChangeAddress').toggleClass("fa-caret-up fa-caret-down");
							$('#usrAddressDiv').hide();
						}*/
						if(!userWorkingData.copyFromFlag)
							$('#copyFromUser').attr('disabled','disabled');

						UsersApp.trigger('userDetailInit');
						
						/*if(!userWorkingData.usrMobileEnble){
			        		$('img[id^="chkRdcFlag"]').attr('src',"static/images/icons/icon_unchecked_grey.gif");
							$('img[id^="chkRdcFlag"]').off('click');
			        	}*/
						
						$('#telephone, #mobileNo, #fax').OnlyNumbers();
						UsersApp.trigger('CheckAppMatrixAll', {
							id : "00",
							details : userWorkingData
						});	
						CommonUser.checkSubsidiaryAll();
						
						TT_UserAppItem.footerLinkRef();

						$.unblockUI();
					});
				}
			
			}else{
				this.load("services/usersLookUpApi/userDetails",loadOptions).then(
				function(data){
					userWorkingData = data;
					userWorkingData.mode = mode;
					userWorkingData.copyFromFlag = false;
					if(undefined !=  userWorkingData.subsidiaries){
					$.each(userWorkingData.subsidiaries,function(index,item){
		        		var subName = new String(item.subsidiaryName);
		        		subName = subName.replace(/&quot;/g, '"');
		        		item.subsidiaryName = subName.replace(/amp;/g,'');
		        	});
					}
					if(userWorkingData.corpDesc != undefined){
						var corpDescValue = new String(userWorkingData.corpDesc);
						corpDescValue =  corpDescValue.replace(/&quot;/g, '"');
						userWorkingData.corpDesc = corpDescValue.replace(/amp;/g, '');
					}
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
					if(userWorkingData.activationDate && userWorkingData.activationDate.includes(' ')){
		    			var activationDate = $.datepick.formatDate(strUserDateFormat, $.datepick.parseDate('yy-mm-dd', userWorkingData.activationDate.split(' ')[0]));
		    			userWorkingData.activationDate = activationDate;			
		    		}
						
					originalData =$.extend(true, {}, data);
				    commandVersion =  data.commandVersion ? (isNaN(data.commandVersion) ? data.commandVersion  :  parseInt(data.commandVersion) ): 0
						UserDetails.elem.usersapp = $(UserDetails.elem.usersapp);				
			
				    if(null != userWorkingData.loginId && undefined !=  userWorkingData.recordKeyNo ){
						 
						//Merging of Working JSON and undo buffer data 
						$.ajax({
					        url: "services/userCommandApi/loadChangeSet/",
					        type: "POST",
					        data: {
					        	"userId" : userWorkingData.loginId,
					        	"roleId" : userWorkingData.usrRoleId,
			                	"recKeyNo" : userWorkingData.recordKeyNo,
			                	"assetId" : "00" ,
					        	"corpId" : userWorkingData.corpId
					        },
					        async : false,
					//        contentType: "application/json; charset=utf-8",
					        dataType: "json",
					        success: function (data) {
					        	$.each(data, function(index, item) {
					        		if(item != null && (item.commandName == "UpdateUserDetail" || item.commandName == "SwitchUserRole")
					        			&& item.kv && item.kv.activationDate && item.kv.activationDate.includes(' ')){
											var formattedActDate = $.datepick.formatDate(strUserDateFormat, $.datepick.parseDate('yy-mm-dd', item.kv.activationDate.split(' ')[0]));
											item.kv.activationDate = formattedActDate;
					        		}
					        		CommonUserObj.updateUserDetailsuserWorkingData(item);
					        	});
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
					if(userWorkingData.subsidiaries){
									subsidiaryAssignedCount = 0;
									$.each(userWorkingData.subsidiaries, function(index,obj) {
										if(obj.assignedFlag)
											subsidiaryAssignedCount++
									});
					}
					userWorkingData.subsidiaryAssignedCount = subsidiaryAssignedCount;
				    subsidiayCount = userWorkingData.subsidiaryCount; 
					//subsidiaryAssignedCount = userWorkingData.subsidiaryAssignedCount;
				    allowConfidential = userWorkingData.allowConfidential;
					disableReject = userWorkingData.disableReject;
				    requireMFA = userWorkingData.requireMFA;
				    superUser = userWorkingData.superUser;
				    isTemplateOnly= userWorkingData.isTemplateOnly;
				    usrMobileEnble = userWorkingData.usrMobileEnble;
					rdcFlag = userWorkingData.rdcFlag;
					authMatrixCount = userWorkingData.authMatrixCount; 
					authMatrixAssignedCount = userWorkingData.authMatrixAssignedCount;
					this.render('static/UsersApp/templates/UserDetails.hbs',userWorkingData).then(function () {
						UserDetails.elem.usersapp.html(this.content);
			        	$("html,body").scrollTop(0);
			        	if(typeof(defaultHight) != "undefined"){
                                                                    $('.grid').css('max-height',defaultHight);
                                          }
			        	var minDate = $.datepick.formatDate(strUserDateFormat,$.datepick.parseDate('dd/mm/yy', userWorkingData.metaData.applicationDate.split(' ')[0]));
			        	$('#activationDate' ).datepicker({
			        			dateFormat : strUserDateFormat,
			        			changeMonth: true,
			        		    changeYear: true,
			        			appendText : '',
			        			minDate : userWorkingData.activationDate ? userWorkingData.activationDate : minDate,
			        		onClose: function(dateText) {
			        				var obj = $(this);
			        				setTimeout(function(){obj.trigger('blur');},300);
			        	  		},
			        		onSelect: function( selectedDate ) {
			        			var obj = $(this);
			        				setTimeout(function(){obj.trigger('blur');},300);
			        				lngActivationDate = Date.parse($('#activationDate' ).datepicker( "getDate" ));
			        				TT_UserAppItem.UserDetails();
			        		}
			        		}).attr('readOnly',true);

						if(userWorkingData.activationDate){
							if(userWorkingData.activationDate.includes(' '))
				    		{
				    			var activationDate = $.datepick.formatDate(strUserDateFormat, $.datepick.parseDate('yy-mm-dd', userWorkingData.activationDate.split(' ')[0]));
								$('#activationDate').val(activationDate);			
				    		}
				    		else
				    			$('#activationDate').datepicker('setDate', userWorkingData.activationDate);		
							
						}else{
							var activationDate =$.datepick.formatDate(strUserDateFormat, $.datepick.parseDate('dd/mm/yy', userWorkingData.metaData.applicationDate.split(' ')[0]));
							$('#activationDate').val(activationDate);
						}
						if(userWorkingData.subsidiaries ? (userWorkingData.subsidiaries.length > 1 ? true : false) : false){
							$.each(userWorkingData.subsidiaries, function(index,obj) {
				                     if(obj.defaultFlag){
				                    	prevDefaultSub = obj.subsidiaryId;
				             			prevDefaultSubName = obj.subsidiaryName;
				                     }
				             });
						}
						if(lngActivationDate == 0)
							lngActivationDate = Date.parse($('#activationDate' ).datepicker( "getDate" ));
							
						if(userWorkingData.metaData.autoUsrCode != 'PRODUCT')
							$('input[id^="loginId"]').val(userWorkingData.loginId)
						
						$("#corporation").CorporationAutoComplete();
						$("#corporation").val(userWorkingData.corpDesc);
						$('#approvalLevel').val(userWorkingData.usrApprovalLevel);
						$('#usrLanguage').val(userWorkingData.usrLanguage);
						$('#usrState').val(userWorkingData.usrState);
						$('#usrCountry').val(userWorkingData.usrCountry);
						$('#usrMfaTrigger').val(userWorkingData.usrMfaTrigger);
						$('#userCategory').val(userWorkingData.usrRoleId);
                        $('#userCategory').niceSelect('destroy');
						$('#userCategory').niceSelect();
						$('#approvalLevel').niceSelect('destroy');
						$('#approvalLevel').niceSelect();
                        $('#usrLanguage').niceSelect('destroy');
                        $('#usrLanguage').niceSelect();
                        $('#usrCountry').niceSelect('destroy');
                        $('#usrCountry').niceSelect();
                        $('#usrState').niceSelect('destroy');
                        $('#usrState').niceSelect();
                        $('#usrMfaTrigger').niceSelect('destroy');
                        $('#usrMfaTrigger').niceSelect();
                        
						
						if(null !=  userWorkingData.recordKeyNo){
							$('#corporation').removeClass('ui-suggestion-box');
							$('#corporation').attr('disabled','disabled');
							$('#loginId').attr('disabled','disabled');
						}
						
						$("#copyFromUser").CopyFromAutoComplete();
						$("#copyFromUser").val(userWorkingData.srcUserDesc);
						$('#copyFromUser').attr('disabled','disabled');
						//To Keep Address Section Bydefault Collapsed
						/*if(!isExpand){
							$('#lnkChangeAddress').toggleClass("fa-caret-up fa-caret-down");
							$('#usrAddressDiv').hide();
						}*/
			        	UsersApp.trigger('userDetailInit');
			        	
			        	/*if(!userWorkingData.usrMobileEnble){
			        		$('img[id^="chkRdcFlag"]').attr('src',"static/images/icons/icon_unchecked_grey.gif");
							$('img[id^="chkRdcFlag"]').off('click');
			        	}*/
			        	CommonUser.checkSubsidiaryAll();
			        	TT_UserAppItem.footerLinkRef();
						
						if($('div#PageTitle1').length > 1){
							$('.ft-layout-header').empty();							
						}
						if($('div#PageTitle').length > 0){
							$('.ft-layout-header').empty();							
						}
					
						$('div#PageTitle1').prependTo('.ft-layout-header');
						$('span.ft-title').prependTo('#PageTitle1');
						$('.ft-layout-header').removeAttr( 'style' );
						$('.fa-refresh').hide();
						$('.t-update-text').hide();
						$('#telephone, #mobileNo, #fax').OnlyNumbers();
						UsersApp.trigger('CheckAppMatrixAll', {
							id : "00",
							details : userWorkingData
						});	
						//$('#copyFromRole').CopyFromUserAutoComplete();
						$.unblockUI();
						
					});
				});
			  }
			},


         renderState: function(e,data){
                    // reset the select drop down
                    var $el = $("#usrState");
                    $el.empty(); // remove old options
                    $el.append($("<option></option>")
                          .text(getLabel ("lbl.clientUser.select","Select")));
                    $.each(data, function(key,value) {
                      $el.append($("<option></option>")
                         .attr("value", value.stateId).text(getStateMstLabel(userWorkingData.usrCountry+"."+value.stateId,value.stateName)));
                    });
                    $("#usrState").niceSelect('destroy');
                    $("#usrState").niceSelect();
        }

	};
	
	UsersApp.bind('renderUserDetails', UserDetails.render);	
	UsersApp.bind('renderState', UserDetails.renderState);

})(jQuery);
