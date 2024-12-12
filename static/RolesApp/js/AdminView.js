/*global jQuery, AdminView */
(function ($) {
	'use strict';
	var Admin = {
		elem: {
			rolesapp: '#ft-layout-container',
			assetPanel: '#assetPanel',
			footer: '#footer'
		},
		render: function () {
			var loadOptions = {
				type: 'POST',
				dataType: 'json',
				cache : false,
		        async : false,
		     //   contentType: "application/json; charset=utf-8",
		        data:{
	        	"roleId" : workingData.roleId,
	        	"corpId" : workingData.corporationId,
	        	}
			}
			console.log(" rendering Admin ");
			var viewName = this.getViewName();
			$.blockUI();
			$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;'+getLabel("loading", "Loading")+'...</h2></div>',
				css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});
			if ($('#MENUITEM_ADMIN').length == 0) {
				this.load("services/rolesLookUpApi/Admin", loadOptions).then(		
					function (data) {

						workingData['assets'] = [];
		        		workingData.assets.push(data);
						
						if(CommonRole.getAssetStore().length > 0){
							CommonRole.next();
						}
						
						//Merging of Working JSON and undoo buffer data 
						$.ajax({
					        url: "services/rolesCommandApi/loadChangeSet/",
					        type: "POST",
					        data: {
					        	"roleId" : workingData.roleId,
					        	"assetId" : "03" ,
					        	"corpId" : workingData.corporationId
					        },
					        async : false,
					     //   contentType: "application/json; charset=utf-8",
					        dataType: "json",
					        success: function (data) {
					        	var assetIndex = workingData.assets.findIndex(function(obj){
									return obj.assetId == "03";
					        	});
					        	if(null != data){
						        	$.each(data, function(index, item) {
						        		CommonObj.updateAssetInWorkingData(item,assetIndex);
						        	});
						        	CommonObj.clearAssetStores();				        		
					        	}
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
						messagesCount = workingData.assets[0].messagesCount; 
						messagesAssignedCount = workingData.assets[0].messagesAssignedCount;
						reportsCount = workingData.assets[0].reportsCount; 
						reportsAssignedCount = workingData.assets[0].reportsAssignedCount;
						widgetsCount = workingData.assets[0].widgetsCount; 
						widgetsAssignedCount = workingData.assets[0].widgetsAssignedCount;
						
						
					this.render('static/RolesApp/templates/RoleEntry.hbs', workingData, '', {
						RoleTitle: 'static/RolesApp/templates/RoleTitle.hbs',
						RoleEntryQuickLinks: 'static/RolesApp/templates/RoleEntryQuickLinks.hbs',
						AssetPanel: viewName,
						featureTemplate : 'static/RolesApp/templates/templateFeature.hbs',
						prevTemplate : 'static/RolesApp/templates/templatePrivileges.hbs',
						msgTemplate : 'static/RolesApp/templates/templateMsg.hbs',
						reportTemplate : 'static/RolesApp/templates/templateReport.hbs',
						widgetTemplate : 'static/RolesApp/templates/templateWidget.hbs',
						alertTemplate : 'static/RolesApp/templates/templateAlert.hbs',
						interfacePriviTemplate : 'static/RolesApp/templates/templateInterfacePrivi.hbs'
					}).then(
						function () {
						$.unblockUI();
						console.log("Rendering  full page " + viewName);
						var roleAppPanel = $(Admin.elem.rolesapp);
						roleAppPanel.html(this.content);	
						RolesApp.trigger('adminServiceInit');
						$("html,body").scrollTop(0);
						if($('div#PageTitle').length > 1){
							$('.ft-layout-header').empty();							
						}
						$('div#PageTitle').prependTo('.ft-layout-header');
						$('span.ft-title').prependTo('#PageTitle');
						$('.ft-layout-header').removeAttr( 'style' );
						
						RolesApp.trigger('setQuickLink', {
							viewName : viewName,
							id : "MENUITEM_ADMIN"
						});	
						RolesApp.trigger('checkAssignAll', {
							viewName : viewName,
							id : "03",
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
				this.load("services/rolesLookUpApi/Admin", loadOptions).then(		
				function (data) {
					
		        	workingData['assets'] = [];
	        		workingData.assets.push(data);
					
					if(CommonRole.getAssetStore().length > 0){
						CommonRole.next();
					}
												
					//Merging of Working JSON and undoo buffer data 
					$.ajax({
				        url: "services/rolesCommandApi/loadChangeSet/",
				        type: "POST",
				        data: {
				        	"roleId" : workingData.roleId,
				        	"assetId" : "03" ,
				        	"corpId" : workingData.corporationId
				        },
				        async : false,
				     //   contentType: "application/json; charset=utf-8",
				        dataType: "json",
				        success: function (data) {
				        	var assetIndex = workingData.assets.findIndex(function(obj){
								return obj.assetId == "03";
				        	});
				        	
				        	if(null != data){
					        	$.each(data, function(index, item) {
					        		CommonObj.updateAssetInWorkingData(item,assetIndex);
					        	});
					        	CommonObj.clearAssetStores();				        		
				        	}
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
				messagesCount = workingData.assets[0].messagesCount; 
				messagesAssignedCount = workingData.assets[0].messagesAssignedCount;
				reportsCount = workingData.assets[0].reportsCount; 
				reportsAssignedCount = workingData.assets[0].reportsAssignedCount;
				widgetsCount = workingData.assets[0].widgetsCount; 
				widgetsAssignedCount = workingData.assets[0].widgetsAssignedCount;
					
				this.render(viewName, workingData, '', {
					featureTemplate : 'static/RolesApp/templates/templateFeature.hbs',
					prevTemplate : 'static/RolesApp/templates/templatePrivileges.hbs',
					msgTemplate : 'static/RolesApp/templates/templateMsg.hbs',
					reportTemplate : 'static/RolesApp/templates/templateReport.hbs',
					widgetTemplate : 'static/RolesApp/templates/templateWidget.hbs',
					alertTemplate : 'static/RolesApp/templates/templateAlert.hbs',
					interfacePriviTemplate : 'static/RolesApp/templates/templateInterfacePrivi.hbs'
				}).then(function () {
					$.unblockUI();
					var assetPanel = $(Admin.elem.assetPanel);
					assetPanel.html(this.content);
					$("html,body").scrollTop(0);
					if(typeof(defaultHight) != "undefined"){
						$('.grid').css('max-height',defaultHight);
					}
					if($('div#PageTitle').length > 1){
						$('.ft-layout-header').empty();							
					}
					$('div#PageTitle').prependTo('.ft-layout-header');
					$('span.ft-title').prependTo('#PageTitle');
					$('.ft-layout-header').removeAttr( 'style' );
					
					RolesApp.trigger('adminServiceInit');
					
					RolesApp.trigger('setQuickLink', {
						viewName : viewName,
						id : "MENUITEM_ADMIN"
					});	
					RolesApp.trigger('checkAssignAll', {
						viewName : viewName,
						id : "03",
						details : workingData
					});	
					
					RolesApp.trigger('permissionNext',{
						viewName : viewName,
						details : workingData
					});
					
				});
				});
			}
		}
	};
	RolesApp.bind('renderAdmin', Admin.render);
})(jQuery);
