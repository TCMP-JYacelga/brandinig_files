/*global jQuery, RoleDetails */
(function ($) {
	'use strict';
	var Payments = {
		elem: {
			rolesapp: '#ft-layout-container',
			assetPanel: '#assetPanel',
			footer: '#footer'
		},
		render: function () {
			var loadOptions = {
					type: 'POST',
					dataType: 'json',
			        async : false,
					cache : false,
			    //    contentType: "application/json; charset=utf-8",
			        data:{
		        	"roleId" : workingData.roleId,
		        	"corpId" : workingData.corporationId,
		        	},
				}
			
			console.log(" rendering Payments ");
			var viewName = this.getViewName();	
			$.blockUI();
			$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;'+getLabel("loading", "Loading")+'...</h2></div>',
				css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});	
			// If the quick menu is already rendered render only the assetPanel
			if ($('#MENUITEM_PAYMENTS').length == 0) {				
				
				this.load("services/rolesLookUpApi/Payments", loadOptions).then(
						function (data) {
							
							//Filter Permissions
							for(var i = 0; i < data.permissions.length; i++){
			        	        if(data.permissions[i].subModule == "PAYPRM" && data.permissions[i].featureType != "F" ) {
			        	        	data.permissions.splice(i,1);
			        	            i--; // Prevent skipping an item
			        	        }
							}
							
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
						        	"assetId" : "02" ,
						        	"corpId" : workingData.corporationId
						        },
						        async : false,
						    //    contentType: "application/json; charset=utf-8",
						        dataType: "json",
						        success: function (data) {
						        	/*var assetIndex = workingData.assets.findIndex(function(obj){
										return obj.assetId == "02";
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
							packagesCount = workingData.assets[0].packagesCount; 
							packagesAssignedCount = workingData.assets[0].packagesAssignedCount;							
							templatesCount = workingData.assets[0].templatesCount; 
							templatesAssignedCount = workingData.assets[0].templatesAssignedCount;							
							companyIdCount = workingData.assets[0].companyIdCount; 
							companyIdAssignedCount = workingData.assets[0].companyIdAssignedCount;							
					
						this.render('static/RolesApp/templates/RoleEntry.hbs', workingData, '', {
							RoleTitle: 'static/RolesApp/templates/RoleTitle.hbs',
							RoleEntryQuickLinks: 'static/RolesApp/templates/RoleEntryQuickLinks.hbs',
							AssetPanel: viewName,
							featureTemplate : 'static/RolesApp/templates/templateFeature.hbs',
							prevTemplate : 'static/RolesApp/templates/templatePrivileges.hbs',
							accountTemplate : 'static/RolesApp/templates/templateAccount.hbs',
							reportTemplate : 'static/RolesApp/templates/templateReport.hbs',
							widgetTemplate : 'static/RolesApp/templates/templateWidget.hbs',
							packageTemplate : 'static/RolesApp/templates/templatePackages.hbs',
							paymentTemplate: 'static/RolesApp/templates/templatePaymentTemplate.hbs',
							cmpIdTemplate : 'static/RolesApp/templates/templateCompanyId.hbs',
							alertTemplate : 'static/RolesApp/templates/templateAlert.hbs',							
							granPaymentTemplate : 'static/RolesApp/templates/templateGRPayment.hbs',
							granTempTemplate : 'static/RolesApp/templates/templateGRTemp.hbs',
							granSITemplate : 'static/RolesApp/templates/templateGRSI.hbs',
							granReversalTemplate : 'static/RolesApp/templates/templateGRReversal.hbs'
						}).then(
							function () {
							$.unblockUI();
							console.log("Rendering  full page " + viewName);
							var roleAppPanel = $(Payments.elem.rolesapp);
							//console.log(" this.content " + this.content);
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
								if(item.assignedFlag && item.granularPrivilegeId == "02"){
									$('#accountPanel').addClass('hidden');
									$('#packagePanel').addClass('hidden');
									$('#paymentGranularPanel').removeClass('hidden');
									$('#reversalGranularPanel').removeClass('hidden');
									if(workingData && workingData.sifeature)
									{
										$('#siGranularPanel').removeClass('hidden');
									}
									$('#templateGranularPanel').removeClass('hidden');
									
									if(workingData.assets[0].permissions != undefined)
									{
										$('#reversalGranularPanel').addClass('hidden');
										$('#siGranularPanel').addClass('hidden');
										$('#templateGranularPanel').addClass('hidden');
										$.each(workingData.assets[0].permissions, function(index, item) {
											if(item.tciRmParent && item.tciRmParent == "39"){
												$('#reversalGranularPanel').removeClass('hidden');
											}
											else if(item.tciRmParent && item.tciRmParent == "38")
											{
												$('#siGranularPanel').removeClass('hidden');
											}
											else if(item.tciRmParent && item.tciRmParent == "31")
											{
												$('#templateGranularPanel').removeClass('hidden');
											}
										  });
									}
								}
								
								if(!item.assignedFlag && item.granularPrivilegeId == "02"){
									$('#accountPanel').removeClass('hidden');
									$('#packagePanel').remove('hidden');
									$('#paymentGranularPanel').addClass('hidden');
									$('#reversalGranularPanel').addClass('hidden');
									$('#siGranularPanel').addClass('hidden');
									$('#templateGranularPanel').addClass('hidden');
								}
								
							  });
							}else{
								$('#accountPanel').removeClass('hidden');
								$('#packagePanel').remove('hidden');
								$('#paymentGranularPanel').addClass('hidden');
								$('#reversalGranularPanel').addClass('hidden');
								$('#siGranularPanel').addClass('hidden');
								$('#templateGranularPanel').addClass('hidden');
							}
							
							RolesApp.trigger('paymentServiceInit');
							Payments.hideShowPayGranColumn();
							Payments.hideShowSIGranColumn();
							Payments.hideShowReversalGranColumn();
							Payments.hideShowTemplateGranColumn();
							RolesApp.trigger('setQuickLink', {
								viewName : viewName,
								id : "MENUITEM_PAYMENTS"
							});
							RolesApp.trigger('checkAssignAll', {
								viewName : viewName,
								id : "02",
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
				this.load("services/rolesLookUpApi/Payments", loadOptions).then(
				function (data) {
					
					
					//Filter Permissions
					for(var i = 0; i < data.permissions.length; i++){
	        	        if(data.permissions[i].subModule == "PAYPRM" && (data.permissions[i].featureType != "F"&& data.permissions[i].featureType != "PO") ) {
	        	        	data.permissions.splice(i,1);
	        	            i--; // Prevent skipping an item
	        	        }
					}
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
				        	"assetId" : "02" ,
				        	"corpId" : workingData.corporationId
				        },
				        async : false,
				   //     contentType: "application/json; charset=utf-8",
				        dataType: "json",
				        success: function (data) {
				        	
				        	/*var assetIndex = workingData.assets.findIndex(function(obj){
								return obj.assetId == "02";
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
					packagesCount = workingData.assets[0].packagesCount; 
					packagesAssignedCount = workingData.assets[0].packagesAssignedCount;							
					templatesCount = workingData.assets[0].templatesCount; 
					templatesAssignedCount = workingData.assets[0].templatesAssignedCount;							
					companyIdCount = workingData.assets[0].companyIdCount; 
					companyIdAssignedCount = workingData.assets[0].companyIdAssignedCount;							
						
				this.render(viewName,workingData,'',{
					featureTemplate : 'static/RolesApp/templates/templateFeature.hbs',
					prevTemplate : 'static/RolesApp/templates/templatePrivileges.hbs',
					accountTemplate : 'static/RolesApp/templates/templateAccount.hbs',
					reportTemplate : 'static/RolesApp/templates/templateReport.hbs',
					widgetTemplate : 'static/RolesApp/templates/templateWidget.hbs',
					packageTemplate : 'static/RolesApp/templates/templatePackages.hbs',
					paymentTemplate: 'static/RolesApp/templates/templatePaymentTemplate.hbs',
					cmpIdTemplate : 'static/RolesApp/templates/templateCompanyId.hbs',
					alertTemplate : 'static/RolesApp/templates/templateAlert.hbs',
					
					granPaymentTemplate : 'static/RolesApp/templates/templateGRPayment.hbs',
					granTempTemplate : 'static/RolesApp/templates/templateGRTemp.hbs',
					granSITemplate : 'static/RolesApp/templates/templateGRSI.hbs',
					granReversalTemplate : 'static/RolesApp/templates/templateGRReversal.hbs'
				}).then(function () {
					$.unblockUI();
					var assetPanel = $(Payments.elem.assetPanel);
					assetPanel.html(this.content);
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
						if(item.assignedFlag && item.granularPrivilegeId == "02"){
							$('#accountPanel').addClass('hidden');
							$('#packagePanel').addClass('hidden');
							$('#paymentGranularPanel').removeClass('hidden');
							$('#reversalGranularPanel').removeClass('hidden');
							if(workingData.sifeature)
							{
								$('#siGranularPanel').removeClass('hidden');
							}
							$('#templateGranularPanel').removeClass('hidden');
							
							if(workingData.assets[0].permissions != undefined)
							{
								$('#reversalGranularPanel').addClass('hidden');
								$('#siGranularPanel').addClass('hidden');
								$('#templateGranularPanel').addClass('hidden');
								$.each(workingData.assets[0].permissions, function(index, item) {
									if(item.tciRmParent && item.tciRmParent == "39"){
										$('#reversalGranularPanel').removeClass('hidden');
									}
									else if(item.tciRmParent && item.tciRmParent == "38")
									{
										$('#siGranularPanel').removeClass('hidden');
									}
									else if(item.tciRmParent && item.tciRmParent == "31")
									{
										$('#templateGranularPanel').removeClass('hidden');
									}
								  });
							}
						}
						
						if(!item.assignedFlag && item.granularPrivilegeId == "02"){
							$('#accountPanel').removeClass('hidden');
							$('#packagePanel').remove('hidden');
							$('#paymentGranularPanel').addClass('hidden');
							$('#reversalGranularPanel').addClass('hidden');
							$('#siGranularPanel').addClass('hidden');
							$('#templateGranularPanel').addClass('hidden');
						}
						
					});
					}else{
						$('#accountPanel').removeClass('hidden');
						$('#packagePanel').remove('hidden');
						$('#paymentGranularPanel').addClass('hidden');
						$('#reversalGranularPanel').addClass('hidden');
						$('#siGranularPanel').addClass('hidden');
						$('#templateGranularPanel').addClass('hidden');
					}
					
					RolesApp.trigger('paymentServiceInit');
					Payments.hideShowPayGranColumn();
					Payments.hideShowSIGranColumn();
					Payments.hideShowReversalGranColumn();
					Payments.hideShowTemplateGranColumn();
					RolesApp.trigger('setQuickLink', {
						viewName : viewName,
						id : "MENUITEM_PAYMENTS"
					});
					RolesApp.trigger('checkAssignAll', {
						viewName : viewName,
						id : "02",
						details : workingData
					});	
					
					RolesApp.trigger('permissionNext',{
						viewName : viewName,
						details : workingData
					});
					});
				});
				
			}
		},
		
		hideShowPayGranColumn : function(){
			// Hide/Show Granular Panel Columns
			if(workingData.assets != undefined) {
			$.each(workingData.assets,function(index,asset){
				if(asset.assetId == "02" && asset.permissions != undefined){
					$.each(asset.permissions,function(index,permission){
						var colIds = [];
						
						if(grPaymentColumnMap.hasOwnProperty([permission.featureId+"-"+permission.screenWeight])){
							
							var colObj = grPaymentColumnMap[permission.featureId+"-"+permission.screenWeight];
							
							if(permission.view && colObj.hasOwnProperty("view"))
								colIds.push(colObj.view);
							
							if(permission.edit && colObj.hasOwnProperty("edit"))
								colIds.push(colObj.edit);
							
							if(permission.auth && colObj.hasOwnProperty("auth"))
								colIds.push(colObj.auth);
						}						
						
								
						$.each(colIds,function(index,colId){
							$('#grPayCol_' + colId).removeClass('hidden');
							var elem = $('img[id^="chkPayGran_02_' + colId + '_"]');
						
							$.each(elem,function(index,item){
								$(this).parents().eq(1).removeClass('hidden');
							});
						});
					});
				}
			});
			}
		},
		
		hideShowSIGranColumn : function(){
			// Hide/Show Granular Panel Columns
			if(workingData.assets != undefined){
			$.each(workingData.assets,function(index,asset){
				if(asset.assetId == "02" && asset.permissions != undefined){
					$.each(asset.permissions,function(index,permission){
						var colIds = [];
						
						if(grSIColumnMap.hasOwnProperty([permission.featureId+"-"+permission.screenWeight])){
							
							var colObj = grSIColumnMap[permission.featureId+"-"+permission.screenWeight];
							
							if(permission.view && colObj.hasOwnProperty("view"))
								colIds.push(colObj.view);
							
							if(permission.edit && colObj.hasOwnProperty("edit"))
								colIds.push(colObj.edit);
							
							if(permission.auth && colObj.hasOwnProperty("auth"))
								colIds.push(colObj.auth);
						}						
						
								
						$.each(colIds,function(index,colId){
							$('#grSICol_' + colId).removeClass('hidden');
							var elem = $('img[id^="chkSIGran_02_' + colId + '_"]');
						
							$.each(elem,function(index,item){
								$(this).parents().eq(1).removeClass('hidden');
							});
						});
					});
				}
			});
			}
		},
		
		hideShowReversalGranColumn : function(){
			// Hide/Show Granular Panel Columns
			if(workingData.assets != undefined){
			$.each(workingData.assets,function(index,asset){
				if(asset.assetId == "02" && asset.permissions != undefined){
					$.each(asset.permissions,function(index,permission){
						var colIds = [];
						
						if(grReversalColumnMap.hasOwnProperty([permission.featureId+"-"+permission.screenWeight])){
							
							var colObj = grReversalColumnMap[permission.featureId+"-"+permission.screenWeight];
							
							if(permission.view && colObj.hasOwnProperty("view"))
								colIds.push(colObj.view);
							
							if(permission.edit && colObj.hasOwnProperty("edit"))
								colIds.push(colObj.edit);
							
							if(permission.auth && colObj.hasOwnProperty("auth"))
								colIds.push(colObj.auth);
						}						
						
								
						$.each(colIds,function(index,colId){
							$('#grRevCol_' + colId).removeClass('hidden');
							var elem = $('img[id^="chkReversalGran_02_' + colId + '_"]');
						
							$.each(elem,function(index,item){
								$(this).parents().eq(1).removeClass('hidden');
							});
						});
					});
				}
			});
			}
		},
		
		hideShowTemplateGranColumn : function(){
			// Hide/Show Granular Panel Columns
			var semRepFlag = false,repFlag=false,nonRepFlag=false;
			if(workingData.assets != undefined){
			$.each(workingData.assets,function(index,asset){
				if(asset.assetId == "02"){
					if(asset.allowedFeatures != undefined){
					$.each(asset.allowedFeatures,function(index,feature){
						
						if(feature.featureId == "repetitiveFlag"){
							if(feature.assignedFlag)
								repFlag = true;
							else
								repFlag = false;
						}
						
						if(feature.featureId == "semiRepetitiveFlag"){
							if(feature.assignedFlag)
								semRepFlag = true;
							else
								semRepFlag = false;
						}
						
						if(feature.featureId == "nonRepetitiveFlag"){
							if(feature.assignedFlag)
								nonRepFlag = true;
							else
								nonRepFlag = false;
						}
					});
				    }
					
					var colIds = [];
					//Fetch Columns Positions From Working Data JSON
					if(asset.permissions != undefined){
					$.each(asset.permissions,function(index,permission){
						if(grTemplateColumnMap.hasOwnProperty([permission.featureId+"-"+permission.screenWeight])){
							var colObj = grTemplateColumnMap[permission.featureId+"-"+permission.screenWeight];
							if(permission.view && colObj.hasOwnProperty("view")){
								var colPos = colObj.view.split(',');
								$.each(colPos,function(index,pos){
									if(colIds.indexOf(pos) == -1)
										colIds.push(pos);
								});
							}
							
							if(permission.edit && colObj.hasOwnProperty("edit")){
								var colPos = colObj.edit.split(',');
								$.each(colPos,function(index,pos){
									if(colIds.indexOf(pos) == -1)
										colIds.push(pos);
								});
							}
							
							if(permission.auth && colObj.hasOwnProperty("auth")){
								var colPos = colObj.auth.split(',');
								$.each(colPos,function(index,pos){
									if(colIds.indexOf(pos) == -1)
										colIds.push(pos);
								});
							}
						}
					});
					}
					
					var semRepColSpanCnt = 0,repColSpanCnt=0,nonRepColSpanCnt=0;
					
					$.each(colIds,function(index,colId){
						if(repFlag && (colId == "3" || colId == "4" || colId == "5" || colId == "6" || colId == "7" || colId == "8")){
							repColSpanCnt++;
							$('#hdrType_' + colId).removeClass('hidden');
							var elem = $('img[id^="chkTemplateGran_02_' + colId + '_"]');
						
							$.each(elem,function(index,item){
								$(this).parents().eq(1).removeClass('hidden');
							});							
						}
						
						if(semRepFlag &&  (colId == "9" || colId == "10" || colId == "11" || colId == "12" || colId == "13" || colId == "14")){
							semRepColSpanCnt++;
							$('#hdrType_' + colId).removeClass('hidden');
							var elem = $('img[id^="chkTemplateGran_02_' + colId + '_"]');
						
							$.each(elem,function(index,item){
								$(this).parents().eq(1).removeClass('hidden');
							});							
						}
						
						if(nonRepFlag &&  (colId == "15" || colId == "16" || colId == "17" || colId == "18" || colId == "19" || colId == "20")){
							nonRepColSpanCnt++;
							$('#hdrType_' + colId).removeClass('hidden');
							var elem = $('img[id^="chkTemplateGran_02_' + colId + '_"]');
						
							$.each(elem,function(index,item){
								$(this).parents().eq(1).removeClass('hidden');
							});							
						}
					});
					
					if(repFlag && repColSpanCnt > 0){
						$('#repHdr').removeClass('hidden');
						$('#repHdr').attr('colspan',repColSpanCnt);
					}
					
					if(semRepFlag && semRepColSpanCnt > 0){
						$('#semRepHdr').removeClass('hidden');
						$('#semRepHdr').attr('colspan',semRepColSpanCnt);
					}
					
					if(nonRepFlag && nonRepColSpanCnt > 0){
						$('#nonRepHdr').removeClass('hidden');
						$('#nonRepHdr').attr('colspan',nonRepColSpanCnt);
					}
				}
			});
			}
		},
	};
	RolesApp.bind('renderPayments', Payments.render);	
})(jQuery);