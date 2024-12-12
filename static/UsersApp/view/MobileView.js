/*global jQuery, UserDetails */
var mobileViewName = "";
(function ($) {
	'use strict';

	var Mobile = {
		elem: {
			usersapp: '#ft-layout-container',
			assetPanel : '#assetPanel',
			footer: '#footer'
		},
		
		render: function () {
			var loadOptions = {
					type: 'POST',
					dataType: 'json',
					cache : false,
			        async : false,
			        //contentType: "application/json; charset=utf-8",
			        data:{
			        	"userId" : userWorkingData.loginId,
			        	"roleId" : userWorkingData.usrRoleId,
			        	"corpId" : userWorkingData.corpId
			       }
			       
				}
			console.log(" rendering Mobile ");
			var viewName = this.getViewName();
			mobileViewName = this.getViewName();
			$.blockUI();
			$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;Loading...</h2></div>',
				css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});
			// If the quick menu is already rendered render only the assetPanel
			if ($('#MENUITEM_MOBILE').length == 0) {
				
				this.load("services/usersLookUpApi/Mobile", loadOptions).then(
						function (data) {
							userWorkingData['assets'] = [];
			        		userWorkingData.assets.push(data);
							
			        		//Merging of Working JSON and undo buffer data 
							$.ajax({
						        url: "services/userCommandApi/loadChangeSet/",
						        type: "POST",
						        data: {
						        	"userId" : userWorkingData.loginId,
						        	"roleId" : userWorkingData.usrRoleId,
				                	"recKeyNo" : userWorkingData.recordKeyNo,
				                	"assetId" : "20" ,
						        	"corpId" : userWorkingData.corpId
						        },
						        async : false,
						        //contentType: "application/json; charset=utf-8",
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
						this.render('static/UsersApp/templates/UserEntry.hbs', userWorkingData, '', {
							UserTitle : 'static/UsersApp/templates/UserTitle.hbs',
							UserEntryQuickLinks : 'static/UsersApp/templates/UserEntryQuickLinks.hbs',
							AssetPanel : viewName
						}).then(function () {
								$.unblockUI();
								console.log("Rendering  full page " + viewName);
								var userAppPanel = $(Mobile.elem.usersapp);
								userAppPanel.html(this.content);
								$("html,body").scrollTop(0);
								if(typeof(defaultHight) != "undefined"){
                                            $('.grid').css('max-height',defaultHight);
                                }
								if($('div#PageTitle').length > 1){
									$('.ft-layout-header').empty();							
								}
								if($('div#PageTitle1').length > 0){
									$('.ft-layout-header').empty();							
								}
								$('div#PageTitle').prependTo('.ft-layout-header');
								$('span.ft-title').prependTo('#PageTitle');
								$('.ft-layout-header').removeAttr( 'style' );
							
								UsersApp.trigger('mobileServiceInit');
								
								UsersApp.trigger('setQuickLink', {
									viewName : viewName,
									id : "MENUITEM_MOBILE"
								});	
							
								UsersApp.trigger('NextLinkRef',{
									viewName : viewName,
									details : userWorkingData
								});
								
						});
				});
			} else {
				console.log(" Rendering  Asset Page " + viewName);
				CommonUser.next();
				this.load("services/usersLookUpApi/Mobile", loadOptions).then(
				function (data) {
					userWorkingData['assets'] = [];
	        		userWorkingData.assets.push(data);
	        		
	        		/*if(CommonUserObj.getAssetStore().length > 0){
	        			CommonUser.next();
					}*/
					
					//Merging of Working JSON and undo buffer data 
					$.ajax({
				        url: "services/userCommandApi/loadChangeSet/",
				        type: "POST",
				        data: {
				        	"userId" : userWorkingData.loginId,
				        	"roleId" : userWorkingData.usrRoleId,
		                	"recKeyNo" : userWorkingData.recordKeyNo,
		                	"assetId" : "20" ,
				        	"corpId" : userWorkingData.corpId
				        },
				        async : false,
				        //contentType: "application/json; charset=utf-8",
				        dataType: "json",
				        success: function (data) {
				        	
				        	$.each(data,function(index,command){
				        		
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
					
					
				this.render(viewName,userWorkingData,'', {
						
				}).then(function () {
					$.unblockUI();
					var assetPanel = $(Mobile.elem.assetPanel);
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
					$("html,body").scrollTop(0);
				if(typeof(defaultHight) != "undefined"){
                                                            $('.grid').css('max-height',defaultHight);
                                                }
					UsersApp.trigger('mobileServiceInit');
					 					
					UsersApp.trigger('setQuickLink', {
						viewName : viewName,
						id : "MENUITEM_MOBILE"
					});	
					
					UsersApp.trigger('NextLinkRef',{
						viewName : viewName,
						details : userWorkingData
					});
					});
				});
			}
			
		}
	
	};

	UsersApp.bind('renderMobile', Mobile.render);	
	
})(jQuery);
