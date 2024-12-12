/*global jQuery, RoleDetails */
(function($) {
	'use strict';
	var SubAccounts = {
		elem : {
			rolesapp : '#ft-layout-container',
			assetPanel : '#assetPanel',
			footer : '#footer'
		},
		render : function() {
			var loadOptions = {
				type : 'POST',
				dataType : 'json',
				async : false,
				cache : false,
				//    contentType: "application/json; charset=utf-8",
				data : {
					"roleId" : workingData.roleId,
					"corpId" : workingData.corporationId
				}
			};
			var viewName = this.getViewName();
			$.blockUI();
			$.blockUI({
						overlayCSS : {
							opacity : 0.5
						},
						baseZ : 2000,
						message : '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;'+getLabel("loading", "Loading")+'...</h2></div>',
						css : {
							width : '400px',
							height : '64px',
							padding : '20px 0 0 0'
						}
					});
			// If the quick menu is already rendered render only the assetPanel
			if ($('#MENUITEM_SUB_ACCOUNTS').length === 0) {

				this.load("services/rolesLookUpApi/SubAccounts", loadOptions).then(
						function(data) {

							workingData['assets'] = [];
							workingData.assets.push(data);

							if (CommonRole.getAssetStore().length > 0) {
								CommonRole.next();
							}
							//Merging of Working JSON and undo buffer data
							$.ajax({
								url : "services/rolesCommandApi/loadChangeSet/",
								type : "POST",
								data : {
									"roleId" : workingData.roleId,
									"assetId" : "21",
									"corpId" : workingData.corporationId
								},
								async : false,
								//    contentType: "application/json; charset=utf-8",
								dataType : "json",
								success : function(data) {

									$.each(data, function(index, command) {

										if (command.commandName === "CreateRoleDetail" || command.commandName === "UpdateRoleDetail"
												|| command.commandName === "AddSubsidiary"
												|| command.commandName === "RemoveSubsidiary"
												|| command.commandName === "AddServices" || command.commandName === "RemoveServices"
												|| command.commandName === "AddGR" || command.commandName === "RemoveGR") {

											CommonObj.updateWorkingData(command);
										}
										else {
											var assetIndex = workingData.assets.findIndex(function(obj) {
												return obj.assetId === command.kv.assetId;
											});
											CommonObj.updateAssetInWorkingData(command, assetIndex);
										}
									});
									CommonObj.clearAssetStores();
								},
								error : function() {
									$('#errorDiv').removeClass('hidden');
									$('#errorPara').text("An error has occured!!!");
									$.unblockUI();
									if (event) {
										event.preventDefault();
									}
								}
							});
							alertCount = workingData.assets[0].alertsCount;
							alertsAssignedCount = workingData.assets[0].alertsAssignedCount;
							reportsCount = workingData.assets[0].reportsCount;
							reportsAssignedCount = workingData.assets[0].reportsAssignedCount;
							accountsCount = workingData.assets[0].accountsCount;
							accountsAssignedCount = workingData.assets[0].accountsAssignedCount;

							this.render('static/RolesApp/templates/RoleEntry.hbs', workingData, '', {
								RoleTitle : 'static/RolesApp/templates/RoleTitle.hbs',
								RoleEntryQuickLinks : 'static/RolesApp/templates/RoleEntryQuickLinks.hbs',
								AssetPanel : viewName,
								featureTemplate : 'static/RolesApp/templates/templateFeature.hbs',
								prevTemplate : 'static/RolesApp/templates/templatePrivileges.hbs',
								accountTemplate : 'static/RolesApp/templates/templateAccount.hbs',
								reportTemplate : 'static/RolesApp/templates/templateReport.hbs',
								alertTemplate : 'static/RolesApp/templates/templateAlert.hbs'
							}).then(function() {
								$.unblockUI();
								var roleAppPanel = $(SubAccounts.elem.rolesapp);
								roleAppPanel.html(this.content);
								$("html,body").scrollTop(0);
								if (typeof (defaultHight) != "undefined") {
									$('.grid').css('max-height', defaultHight);
									$('.gridGran').css('max-height', defaultHight);
								}
								if ($('div#PageTitle').length > 1) {
									$('.ft-layout-header').empty();
								}
								$('div#PageTitle').prependTo('.ft-layout-header');
								$('span.ft-title').prependTo('#PageTitle');
								$('.ft-layout-header').removeAttr('style');

								RolesApp.trigger('subAccountsServiceInit');

								RolesApp.trigger('setQuickLink', {
									viewName : viewName,
									id : "MENUITEM_SUB_ACCOUNTS"
								});
								RolesApp.trigger('checkAssignAll', {
									viewName : viewName,
									id : "21",
									details : workingData
								});

								RolesApp.trigger('permissionNext', {
									viewName : viewName,
									details : workingData
								});
							});
						});
			}
			else {
				this.load("services/rolesLookUpApi/SubAccounts", loadOptions).then(
						function(data) {

							workingData['assets'] = [];
							workingData.assets.push(data);

							if (CommonRole.getAssetStore().length > 0) {
								CommonRole.next();
							}
							$.ajax({
								url : "services/rolesCommandApi/loadChangeSet/",
								type : "POST",
								data : {
									"roleId" : workingData.roleId,
									"assetId" : "21",
									"corpId" : workingData.corporationId
								},
								async : false,
								//     contentType: "application/json; charset=utf-8",
								dataType : "json",
								success : function(data) {

									$.each(data, function(index, command) {

										if (command.commandName === "CreateRoleDetail" || command.commandName === "UpdateRoleDetail"
												|| command.commandName === "AddSubsidiary"
												|| command.commandName === "RemoveSubsidiary"
												|| command.commandName === "AddServices" || command.commandName === "RemoveServices"
												|| command.commandName === "AddGR" || command.commandName === "RemoveGR") {

											CommonObj.updateWorkingData(command);
										}
										else {
											var assetIndex = workingData.assets.findIndex(function(obj) {
												return obj.assetId === command.kv.assetId;
											});
											CommonObj.updateAssetInWorkingData(command, assetIndex);
										}
									});
									CommonObj.clearAssetStores();
								},
								error : function() {
									$('#errorDiv').removeClass('hidden');
									$('#errorPara').text("An error has occured!!!");
									$.unblockUI();
									if (event) {
										event.preventDefault();
									}
								}
							});
							alertCount = workingData.assets[0].alertsCount;
							alertsAssignedCount = workingData.assets[0].alertsAssignedCount;
							reportsCount = workingData.assets[0].reportsCount;
							reportsAssignedCount = workingData.assets[0].reportsAssignedCount;
							accountsCount = workingData.assets[0].accountsCount;
							accountsAssignedCount = workingData.assets[0].accountsAssignedCount;

							this.render(viewName, workingData, '', {
								featureTemplate : 'static/RolesApp/templates/templateFeature.hbs',
								prevTemplate : 'static/RolesApp/templates/templatePrivileges.hbs',
								accountTemplate : 'static/RolesApp/templates/templateAccount.hbs',
								reportTemplate : 'static/RolesApp/templates/templateReport.hbs',
								alertTemplate : 'static/RolesApp/templates/templateAlert.hbs'

							}).then(function() {
								$.unblockUI();
								var assetPanel = $(SubAccounts.elem.assetPanel);
								assetPanel.html(this.content);
								$("html,body").scrollTop(0);
								if (typeof (defaultHight) != "undefined") {
									$('.grid').css('max-height', defaultHight);
									$('.gridGran').css('max-height', defaultHight);
								}
								if ($('div#PageTitle').length > 1) {
									$('.ft-layout-header').empty();
								}
								$('div#PageTitle').prependTo('.ft-layout-header');
								$('span.ft-title').prependTo('#PageTitle');
								$('.ft-layout-header').removeAttr('style');

								RolesApp.trigger('subAccountsServiceInit');

								RolesApp.trigger('setQuickLink', {
									viewName : viewName,
									id : "MENUITEM_SUB_ACCOUNTS"
								});
								RolesApp.trigger('checkAssignAll', {
									viewName : viewName,
									id : "21",
									details : workingData
								});

								RolesApp.trigger('permissionNext', {
									viewName : viewName,
									details : workingData
								});
							});
						});

			}
		}

	};
	RolesApp.bind('renderSubAccounts', SubAccounts.render);
})(jQuery);