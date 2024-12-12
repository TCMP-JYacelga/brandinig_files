/*global jQuery, RoleDetails */

(function ($) {
	'use strict';

	var BalanceReporting = {
		elem: {
			rolesapp: '#ft-layout-container',
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
		        	"roleId" : workingData.roleId,
		        	"corpId" : workingData.corporationId
		        	}
				}
			console.log(" rendering BalanceReporting ");
			var viewName = this.getViewName();
			$.blockUI();
			$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;'+getLabel("loading", "Loading")+'...</h2></div>',
				css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});
			// If the quick menu is already rendered render only the assetPanel
			if ($('#MENUITEM_BR').length == 0) {
				
				this.load("services/rolesLookUpApi/BalanceReporting", loadOptions).then(
						function (data) {

							workingData['assets'] = [];
			        		workingData.assets.push(data);
			        		
							if(CommonRole.getAssetStore().length > 0){
								CommonRole.next();
							}
														
							//Merging of Working JSON and undo buffer data 
							$.ajax({
								url: "services/rolesCommandApi/loadChangeSet/",
						        type: "POST",
						        data: {
						        	"roleId" : workingData.roleId,
						        	"assetId" : "01" ,
						        	"corpId" : workingData.corporationId
						        },
						        async : false,
						        //contentType: "application/json; charset=utf-8",
						        dataType: "json",
						        success: function (data) {
						        	/*var assetIndex = workingData.assets.findIndex(function(obj){
										return obj.assetId == "01";
						        	});
						        	
						        	if(null != data){
							        	$.each(data, function(index, item) {
							        		CommonObj.updateAssetInWorkingData(item,assetIndex);
							        	});
							        	CommonObj.clearAssetStores();				        		
						        	}*/
						        	
						        	$.each(data,function(index,command){
						        		
						        		if( command.commandName == "CreateRoleDetail" || command.commandName == "UpdateRoleDetail" ||
					        				command.commandName == "AddSubsidiary" || command.commandName == "RemoveSubsidiary" ||
					        				command.commandName == "AddServices" || command.commandName == "RemoveServices" ||
					        				command.commandName == "AddGR" || command.commandName == "RemoveGR" ){
						        			
						        				CommonObj.updateWorkingData(command);
						        		}else{
						        			var assetIndex = workingData.assets.findIndex(function(obj){
												return obj.assetId == command.kv.assetId;
								        	});
							        		CommonObj.updateAssetInWorkingData(command,assetIndex);
						        		}
						        	});
						        	CommonObj.clearAssetStores();
						        },
						        error: function () {
						            $('#errorDiv').removeClass('hidden');
						        	$('#errorPara').text("An error has occured!!!");
						        	$.unblockUI();
						        	if(event)
							            event.preventDefault();
						        }
						    });	
							alertCount = workingData.assets[0].alertsCount; 
							alertsAssignedCount = workingData.assets[0].alertsAssignedCount;
							reportsCount = workingData.assets[0].reportsCount; 
							reportsAssignedCount = workingData.assets[0].reportsAssignedCount;
							widgetsCount = workingData.assets[0].widgetsCount; 
							widgetsAssignedCount = workingData.assets[0].widgetsAssignedCount;
							accountsCount = workingData.assets[0].accountsCount; 
							accountsAssignedCount = workingData.assets[0].accountsAssignedCount;
							
						this.render('static/RolesApp/templates/RoleEntry.hbs', workingData, '', {
							RoleTitle : 'static/RolesApp/templates/RoleTitle.hbs',
							RoleEntryQuickLinks : 'static/RolesApp/templates/RoleEntryQuickLinks.hbs',
							AssetPanel : viewName,
							accountTemplate : 'static/RolesApp/templates/templateAccount.hbs',
							prevTemplate : 'static/RolesApp/templates/templateViewPrivileges.hbs',
							alertTemplate : 'static/RolesApp/templates/templateAlert.hbs',
							reportTemplate : 'static/RolesApp/templates/templateReport.hbs',
							widgetTemplate : 'static/RolesApp/templates/templateWidget.hbs',
							granTemplate : 'static/RolesApp/templates/templateGranular.hbs'
						}).then(function () {
								$.unblockUI();
								console.log("Rendering  full page " + viewName);
								var roleAppPanel = $(BalanceReporting.elem.rolesapp);
								roleAppPanel.html(this.content);
								$("html,body").scrollTop(0);
								if(typeof(defaultHight) != "undefined"){
									$('.grid').css('max-height',defaultHight); 
									$('.gridGran').css('max-height',defaultHight);
								}
								if($('div#PageTitle').length > 1){
									$('.ft-layout-header').empty();							
								}
								$('div#PageTitle').prependTo('.ft-layout-header');
								$('span.ft-title').prependTo('#PageTitle');
								$('.ft-layout-header').removeAttr( 'style' );
								
								if(workingData.granPrivileges != undefined){								
								$.each(workingData.granPrivileges, function(index, item) {
									if(item.assignedFlag && item.granularPrivilegeId == "01"){
										$('#accountPanel').addClass('hidden');
										$('#brGranularPanel').removeClass('hidden');
									}
									
									if(!item.assignedFlag && item.granularPrivilegeId == "01"){
										$('#accountPanel').removeClass('hidden');
										$('#brGranularPanel').addClass('hidden');
									}
									
								});
								}else{
									$('#accountPanel').removeClass('hidden');
									$('#brGranularPanel').addClass('hidden');
								}
								BalanceReporting.hideShowGranColumn();
								RolesApp.trigger('brServiceInit');
								RolesApp.trigger('setQuickLink', {
									viewName : viewName,
									id : "MENUITEM_BR"
								});	
							
							RolesApp.trigger('checkAssignAll', {
								viewName : viewName,
								id : "01",
								details : workingData
							});	
							
							RolesApp.trigger('permissionNext',{
								viewName : viewName,
								details : workingData
							});
						});
				});
			} else {
				console.log(" Rendering  Asset Page " + viewName);
				this.load("services/rolesLookUpApi/BalanceReporting", loadOptions).then(
				function (data) {
					
					workingData['assets'] = [];
	        		workingData.assets.push(data);
					
					if(CommonRole.getAssetStore().length > 0){
						CommonRole.next();
					}
						
					//Merging of Working JSON and undo buffer data 
					$.ajax({
				        url: "services/rolesCommandApi/loadChangeSet/",
				        type: "POST",
				        data: {
				        	"roleId" : workingData.roleId,
				        	"assetId" : "01" ,
				        	"corpId" : workingData.corporationId
				        },
				        async : false,
				       // contentType: "application/json; charset=utf-8",
				        dataType: "json",
				        success: function (data) {
				        	/*var assetIndex = workingData.assets.findIndex(function(obj){
								return obj.assetId == "01";
				        	});
				        	if(null != data){
					        	$.each(data, function(index, item) {
					        		CommonObj.updateAssetInWorkingData(item,assetIndex);
					        	});
					        	CommonObj.clearAssetStores();				        		
				        	}*/
				        	
				        	
				        	$.each(data,function(index,command){
				        		
				        		if( command.commandName == "CreateRoleDetail" || command.commandName == "UpdateRoleDetail" ||
			        				command.commandName == "AddSubsidiary" || command.commandName == "RemoveSubsidiary" ||
			        				command.commandName == "AddServices" || command.commandName == "RemoveServices" ||
			        				command.commandName == "AddGR" || command.commandName == "RemoveGR" ){
				        			
				        				CommonObj.updateWorkingData(command);
				        		}else{
				        			var assetIndex = workingData.assets.findIndex(function(obj){
										return obj.assetId == command.kv.assetId;
						        	});
					        		CommonObj.updateAssetInWorkingData(command,assetIndex);
				        		}
				        	});
				        	CommonObj.clearAssetStores();
				        	
				         },
				        error: function () {
				            $('#errorDiv').removeClass('hidden');
				        	$('#errorPara').text("An error has occured!!!");
				        	$.unblockUI();
				        	if(event)
					            event.preventDefault();
				        }
				    });		
					alertCount = workingData.assets[0].alertsCount; 
					alertsAssignedCount = workingData.assets[0].alertsAssignedCount;
					reportsCount = workingData.assets[0].reportsCount; 
					reportsAssignedCount = workingData.assets[0].reportsAssignedCount;
					widgetsCount = workingData.assets[0].widgetsCount; 
					widgetsAssignedCount = workingData.assets[0].widgetsAssignedCount;
					accountsCount = workingData.assets[0].accountsCount; 
					accountsAssignedCount = workingData.assets[0].accountsAssignedCount;
				this.render(viewName,workingData,'', {
						accountTemplate : 'static/RolesApp/templates/templateAccount.hbs',
						prevTemplate : 'static/RolesApp/templates/templateViewPrivileges.hbs',
						alertTemplate : 'static/RolesApp/templates/templateAlert.hbs',
						reportTemplate : 'static/RolesApp/templates/templateReport.hbs',
						widgetTemplate : 'static/RolesApp/templates/templateWidget.hbs',
						granTemplate : 'static/RolesApp/templates/templateGranular.hbs'
				}).then(function () {
					$.unblockUI();
					var assetPanel = $(BalanceReporting.elem.assetPanel);
					assetPanel.html(this.content);
					if($('div#PageTitle').length > 1){
						$('.ft-layout-header').empty();							
					}
					$('div#PageTitle').prependTo('.ft-layout-header');
					$('span.ft-title').prependTo('#PageTitle');
					$('.ft-layout-header').removeAttr( 'style' );
					$("html,body").scrollTop(0);
					if(typeof(defaultHight) != "undefined"){
						$('.grid').css('max-height',defaultHight); 
						$('.gridGran').css('max-height',defaultHight);
					}
					if(workingData.granPrivileges != undefined){
					$.each(workingData.granPrivileges, function(index, item) {
						if(item.assignedFlag && item.granularPrivilegeId == "01"){
							$('#accountPanel').addClass('hidden');
							$('#brGranularPanel').removeClass('hidden');
						}
						
						if(!item.assignedFlag && item.granularPrivilegeId == "01"){
							$('#accountPanel').removeClass('hidden');
							$('#brGranularPanel').addClass('hidden');
						}
						
					});
					}else{
						$('#accountPanel').removeClass('hidden');
						$('#brGranularPanel').addClass('hidden');
					}
					BalanceReporting.hideShowGranColumn();
					RolesApp.trigger('brServiceInit');
					 					
					RolesApp.trigger('setQuickLink', {
						viewName : viewName,
						id : "MENUITEM_BR"
					});	
					
					RolesApp.trigger('checkAssignAll', {
						viewName : viewName,
						id : "01",
						details : workingData
					});	
					
					/*$('html, body').animate({
						scrollTop : (assetPanel.offset().top)
					}, 120);*/
				  RolesApp.trigger('permissionNext',{
						viewName : viewName,
						details : workingData
					});
				});
				});
			}
			
		},
		
		hideShowGranColumn : function(){
			//Hide/Show Granular Panel Columns
			if (workingData.assets != undefined){
			$.each(workingData.assets,function(index,asset){
				if(asset.assetId == "01"){
					if (asset.permissions != undefined){
					$.each(asset.permissions,function(index,permission){
						if(permission.view){
							
							if(grBRColumnMap[permission.featureId]){
								var colIds = grBRColumnMap[permission.featureId].split(',');
								$.each(colIds,function(index,colId){
									$('#grBRCol_' + colId).removeClass('hidden');
									var elem = $('img[id^="chkGran_01_' + colId + '_"]');
								
									$.each(elem,function(index,item){
										$(this).parents().eq(1).removeClass('hidden');
									});
								});
							}
						}
					});
					}
				}
			});	
			}
		}
	};

	RolesApp.bind('renderBalanceReporting', BalanceReporting.render);	
	
})(jQuery);
