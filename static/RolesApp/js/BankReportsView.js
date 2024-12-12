/*global jQuery, RoleDetails */

(function ($) {
	'use strict';

	var BankReports = {

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
			     //   contentType: "application/json; charset=utf-8",
			        data:{
		        	"roleId" : workingData.roleId,
		        	"corpId" : workingData.corporationId,
		        	}
				}
				console.log(" rendering BankReport ");
				var viewName = this.getViewName();
				$.blockUI();
				$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;'+getLabel("loading", "Loading")+'...</h2></div>',
					css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});
				if ($('#MENUITEM_BANKREPORTS').length == 0) {
					this.load("services/rolesLookUpApi/BankReport", loadOptions).then(		
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
						        	"assetId" : "15" ,
						        	"corpId" : workingData.corporationId
						        },
						        async : false,
						    //    contentType: "application/json; charset=utf-8",
						        dataType: "json",
						        success: function (data) {
						        	var assetIndex = workingData.assets.findIndex(function(obj){
										return obj.assetId == "15";
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
							
							
						this.render('static/RolesApp/templates/RoleEntry.hbs', workingData, '', {
							RoleTitle: 'static/RolesApp/templates/RoleTitle.hbs',
							RoleEntryQuickLinks: 'static/RolesApp/templates/RoleEntryQuickLinks.hbs',
							AssetPanel: viewName,
							bankReports : 'static/RolesApp/templates/templateBankreports.hbs',
							
						}).then(
							function () {
							$.unblockUI();
							console.log("Rendering  full page " + viewName);
							var roleAppPanel = $(BankReports.elem.rolesapp);
							roleAppPanel.html(this.content);	
							RolesApp.trigger('BankReportsServiceInit');
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
							
							RolesApp.trigger('setQuickLink', {
								viewName : viewName,
								id : "MENUITEM_BANKREPORTS"
							});	
							RolesApp.trigger('checkAssignAll', {
								viewName : viewName,
								id : "15",
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
					this.load("services/rolesLookUpApi/BankReport", loadOptions).then(		
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
					        	"assetId" : "15" ,
					        	"corpId" : workingData.corporationId
					        },
					        async : false,
					    //    contentType: "application/json; charset=utf-8",
					        dataType: "json",
					        success: function (data) {
					        	var assetIndex = workingData.assets.findIndex(function(obj){
									return obj.assetId == "15";
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
						
						
						
					this.render(viewName, workingData, '', {
						bankReports : 'static/RolesApp/templates/templateBankreports.hbs',
						
					}).then(function () {
						$.unblockUI();
						var assetPanel = $(BankReports.elem.assetPanel);
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
						
						RolesApp.trigger('BankReportsServiceInit');
						
						RolesApp.trigger('setQuickLink', {
							viewName : viewName,
							id : "MENUITEM_BANKREPORTS"
						});	
						RolesApp.trigger('checkAssignAll', {
							viewName : viewName,
							id : "15",
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

	RolesApp.bind('renderBankReports', BankReports.render);	
	
})(jQuery);
