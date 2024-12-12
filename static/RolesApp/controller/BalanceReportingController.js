/*global jQuery, RoleDetails */

(function ($) {
	'use strict';

	var BRItem = {
			
		togglePriv : function(){
			if($(this).length == 1){
				var prevId = $(this).attr('id').split("_"),view;
				
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
				
					if(grBRColumnMap[$(this).data('featureid')]){
						var colIds = grBRColumnMap[$(this).data('featureid')].split(',');
						$.each(colIds,function(index,colId){
							$('#grBRCol_' + colId).removeClass('hidden');
							var elem = $('img[id^="chkGran_01_' + colId + '_"]');
						
							$.each(elem,function(index,item){
								$(this).parents().eq(1).removeClass('hidden');
							});
							
						});
						
					}
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					
					if(grBRColumnMap[$(this).data('featureid')]){
						var colIds = grBRColumnMap[$(this).data('featureid')].split(',');
						$.each(colIds,function(index,colId){
							$('#grBRCol_' + colId).addClass('hidden');
							var elem = $('img[id^="chkGran_01_' + colId + '_"]');
							$.each(elem,function(index,item){
								if($(this).attr('src') == "static/images/icons/icon_checked.gif"){
									$(this).attr('src',"static/images/icons/icon_unchecked.gif");
									//TODO : Duplicate code as like toggleGranular()
									if($(this).length == 1){
										var prevId = $(this).attr('id').split("_"),view;
										var mask = "";

										if(null != prevId){
											//TODO : Hardcoded Length 11 need to remove
											for(var i=0;i<11;i++){
												var flag = BRItem.isChecked($('#chkGran_01_'+i+'_'+prevId[3]).attr('src'));	
												
												if(flag){
													mask = mask + "1";
												}else{
													mask = mask + "0";
												}
											}
										}
										var cmdVersion = commandVersion + 1 ;
										commandVersion += 1 ;
										RolesApp.trigger('UpdateBRGRPermissions', {
											commandName: "UpdateBRGRPermissions",
											path: '/rolesApi/BalanceReporting/GRPermissions',
											kv: {
												mask: mask,
									            packageName : null,
									            packageId: null,
									            accountNo:$(this).attr('data-accountno'),
									            accountId: $(this).data('accountid'),
									            accountName: $(this).data('accountname'),
												assetId : $(this).attr('data-assetid'),
									            gpermissionType: $(this).data('gpermissiontype'),
									            obligatorId: $(this).data('obligatorid'),
									            digest :  $(this).data('digest'),
									            
												commandVersion : cmdVersion
											}
										});
									}
								}
								$(this).parents().eq(1).addClass('hidden');								
							});
						});
					}
				}
				
				if(null != prevId){
					view = BRItem.isChecked($('#chkPrevView_'+prevId[1]+'_'+prevId[2]).attr('src'));
				}
				var cmdVersion = commandVersion + 1 ;
				commandVersion += 1 ;
				RolesApp.trigger('UpdatePermission', {
					commandName: "UpdatePermission",
					path: '/rolesApi/BalanceReporting/Permissions',
					kv: {		
						   screenId: $(this).data('screenid'),
				           screenName: $(this).data('screenname'),
				           screenWeight:$(this).data('screenweight'),
				           module:$(this).data('module'),
			               subModule:$(this).data('submodule'),
			               featureId:$(this).data('featureid'),
			               tciRmParent: $(this).data('tcirmparent'),
			               assetId: $(this).attr('data-assetid'),
			               digest :  $(this).data('digest'),
			               view:view,
				           commandVersion : cmdVersion
					}
				});
			CommonRole.checkSelectAll('chkPrev','prevAll');
			}
},
		
		
		toggleAcc : function(){
			if($(this).length == 1){
				var accId = $(this).attr('id').split("_");
				CommonRole.updateStore(this, 'Accounts', 'chkAccount_','BalanceReporting');
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('AddAccounts', {
						commandName: "AddAccounts",
						path: '/rolesApi/BalanceReporting/Accounts',
						kv: {						
							subsidiaryId: $(this).attr('data-subsidiaryid'),
							accountName: $(this).data('accountname'),
							accountId: $(this).data('accountid'),
							accountNo: $(this).attr('data-accountno'),
							subsidiaryName: $(this).data('subsidiaryname'),
							assetId: $(this).attr('data-assetid'),
							digest :  $(this).data('digest'),
							assignedFlag : true,
					        commandVersion : cmdVersion
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif")
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveAccounts', {
						commandName: "RemoveAccounts",
						path: '/rolesApi/BalanceReporting/Accounts',
						kv: {						
							subsidiaryId: $(this).attr('data-subsidiaryid'),
							accountName: $(this).data('accountname'),
							accountId: $(this).data('accountid'),
							accountNo: $(this).attr('data-accountno'),
							subsidiaryName: $(this).data('subsidiaryname'),
							assetId: $(this).attr('data-assetid'),
							digest :  $(this).data('digest'),
							assignedFlag : false,
							commandVersion : cmdVersion	
						}
					});
				}
			}
		CommonRole.checkSelectAll('chkAccount_','accountAll');
		},
			
		toggleRep : function(){
			if($(this).length == 1){
				var repId = $(this).attr('id').split("_");
				CommonRole.updateStore(this, 'Reports', 'chkRep_','BalanceReporting');
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('AddReports', {
						commandName: "AddReports",
						path: '/rolesApi/BalanceReporting/Reports',
						kv: {
							reportId :  $(this).data('reportid'),
							reportType : $(this).data('reporttype'), 
							assetId : $(this).attr('data-assetid'),
							digest :  $(this).data('digest'),
							assignedFlag : true,
							commandVersion : cmdVersion	
						}
					});
										
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveReports', {
						commandName: "RemoveReports",
						path: '/rolesApi/BalanceReporting/Reports',
						kv: {
							reportId :  $(this).data('reportid'),
							reportType : $(this).data('reporttype'), 
							assetId : $(this).attr('data-assetid'),
							digest :  $(this).data('digest'),
							assignedFlag : true,
							commandVersion : cmdVersion	
						}
					});
				}
			CommonRole.checkSelectAll('chkRep_','reportsAll');
			}

		},
		
		
		toggleWidget : function(){
			if($(this).length == 1){
				var widgetId = $(this).attr('id').split("_");
				CommonRole.updateStore(this, 'Widgets', 'chkWidget_','BalanceReporting');
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('AddWidgets', {
						commandName: "AddWidgets",
						path: '/rolesApi/BalanceReporting/Widgets',
						kv: {	
							widgetId :  $(this).data('widgetid'),
							widgetType : $(this).data('widgettype'), 
							assetId : $(this).attr('data-assetid'),
							digest :  $(this).data('digest'),
							assignedFlag : true,
							commandVersion : cmdVersion	
						}
					});
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveWidgets', {
						commandName: "RemoveWidgets",
						path: '/rolesApi/BalanceReporting/Widgets',
						kv: {	
							widgetId :  $(this).data('widgetid'),
							widgetType : $(this).data('widgettype'), 
							assetId : $(this).attr('data-assetid'),
							digest :  $(this).data('digest'),
							assignedFlag : true,
							commandVersion : cmdVersion	
						}
					});
				}
			CommonRole.checkSelectAll('chkWidget_','widgetsAll');
			}
	
		},
		
		toggleGranular : function(){
			if($(this).length == 1){
				var prevId = $(this).attr('id').split("_"),view;
				var mask = "";

				if($(this).attr('src').search("unchecked") != -1)
					$(this).attr('src',"static/images/icons/icon_checked.gif");
				else
					$(this).attr('src',"static/images/icons/icon_unchecked.gif")
				
				if(null != prevId){
					//TODO : Hardcoded Length 11 need to remove
					for(var i=0;i<11;i++){
						var flag = BRItem.isChecked($('#chkGran_01_'+i+'_'+prevId[3]).attr('src'));	
						
						if(flag){
							mask = mask + "1";
						}else{
							mask = mask + "0";
						}
					}
				}
				var cmdVersion = commandVersion + 1 ;
				commandVersion += 1 ;
				RolesApp.trigger('UpdateBRGRPermissions', {
					commandName: "UpdateBRGRPermissions",
					path: '/rolesApi/BalanceReporting/GRPermissions',
					kv: {
						mask: mask,
			            packageName : null,
			            packageId: null,
			            accountNo: $(this).attr('data-accountno'),
			            accountId: $(this).data('accountid'),
			            accountName: $(this).data('accountname'),
						assetId : $(this).attr('data-assetid'),
			            gpermissionType: $(this).data('gpermissiontype'),
			            obligatorId: $(this).data('obligatorid'),
			            digest :  $(this).data('digest'),
						commandVersion : cmdVersion
					}
				});
				//CommonRole.checkSelectAll('chkGran_','gran');
			}
		
		},
		
		
		toggleAlert : function(){
			if($(this).length == 1){
				var alertId = $(this).attr('id').split("_"),view,edit,auth;
				CommonRole.updateStore(this, 'Alerts', 'chkAlert_','BalanceReporting');
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('AddAlerts', {
						commandName: "AddAlerts",
						path: '/rolesApi/BalanceReporting/Alerts',
						kv: {				
							alertId :  $(this).data('alertid'),
							alertType : $(this).data('alerttype'), 
							assetId : $(this).attr('data-assetid'),
							digest :  $(this).data('digest'),
							assignedFlag : true,
							commandVersion : cmdVersion	
						}
					});
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveAlerts', {
						commandName: "RemoveAlerts",
						path: '/rolesApi/BalanceReporting/Alerts',
						kv: {				
							alertId :  $(this).data('alertid'),
							alertType : $(this).data('alerttype'), 
							assetId : $(this).attr('data-assetid'),
							digest :  $(this).data('digest'),
							assignedFlag : true,
							commandVersion : cmdVersion	
						}
					});
				}
				CommonRole.checkSelectAll('chkAlert_','alertsAll');
			}
		},
		
		toggleAccountsCaret: function () {
			$('#accountsInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#accountsInfoDiv').slideToggle(200);
			return false;

		},
		togglePrivilegesCaret: function () {
			$('#privilegesInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#privilegesInfoDiv').slideToggle(200);
			return false;

		},
		toggleAlertsCaret: function () {
			$('#alertsInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#alertsInfoDiv').slideToggle(200);
			return false;

		},
		toggleReportsCaret: function () {
			$('#reportsInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#reportsInfoDiv').slideToggle(200);
			return false;

		},
		
		toggleWidgetsCaret: function () {
			$('#widgetsInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#widgetsInfoDiv').slideToggle(200);
			return false;

		},
		
		toggleGranularCaret: function () {
			$('#granularInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#granularInfoDiv').slideToggle(200);
			return false;
		},
		
		
		toggleExpandAll: function () {
			$('#accountsInfoCaret').removeClass("fa-caret-down");
			$('#privilegesInfoCaret').removeClass("fa-caret-down");
			$('#alertsInfoCaret').removeClass("fa-caret-down");
			$('#reportsInfoCaret').removeClass("fa-caret-down");
			$('#widgetsInfoCaret').removeClass("fa-caret-down");
			$('#granularInfoCaret').removeClass("fa-caret-down");
			
			$('#accountsInfoCaret').addClass("fa-caret-up");
			$('#privilegesInfoCaret').addClass("fa-caret-up");
			$('#alertsInfoCaret').addClass("fa-caret-up");
			$('#reportsInfoCaret').addClass("fa-caret-up");
			$('#widgetsInfoCaret').addClass("fa-caret-up");
			$('#granularInfoCaret').addClass("fa-caret-up");
			
			$('#accountsInfoDiv').slideDown(200);
			$('#privilegesInfoDiv').slideDown(200);
			$('#alertsInfoDiv').slideDown(200);
			$('#reportsInfoDiv').slideDown(200);
			$('#widgetsInfoDiv').slideDown(200);
			$('#granularInfoDiv').slideDown(200);
			return false;

		},
		
		toggleCollapseAll: function () {
			$('#accountsInfoCaret').removeClass("fa-caret-up");
			$('#privilegesInfoCaret').removeClass("fa-caret-up");
			$('#alertsInfoCaret').removeClass("fa-caret-up");
			$('#reportsInfoCaret').removeClass("fa-caret-up");
			$('#widgetsInfoCaret').removeClass("fa-caret-up");
			$('#granularInfoCaret').removeClass("fa-caret-up");

			$('#accountsInfoCaret').addClass("fa-caret-down");
			$('#privilegesInfoCaret').addClass("fa-caret-down");
			$('#alertsInfoCaret').addClass("fa-caret-down");
			$('#reportsInfoCaret').addClass("fa-caret-down");
			$('#widgetsInfoCaret').addClass("fa-caret-down");
			$('#granularInfoCaret').addClass("fa-caret-down");
			
			$('#accountsInfoDiv').slideUp(200);
			$('#privilegesInfoDiv').slideUp(200);
			$('#alertsInfoDiv').slideUp(200);
			$('#reportsInfoDiv').slideUp(200);
			$('#widgetsInfoDiv').slideUp(200);
			$('#granularInfoDiv').slideUp(200);
			return false;

		},
		
		toggleReportAll : function(){
			if($(this).length == 1){
				if($(this).attr('src').search("unchecked") != -1){
					//$("#reportsInfoDiv").addClass("disable");
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkRep_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkRep_"]').off('click');
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('ApplyAllReports', {
						commandName: "ApplyAllReports", 
						path: '/rolesApi/BalanceReporting/Reports', 
						kv: {	
							assetId : "01",
							assignAllReports : true,
							commandVersion : cmdVersion	
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
				//	$("#reportsInfoDiv").removeClass("disable");
					$('img[id^="chkRep_"]').attr('src',"static/images/icons/icon_unchecked.gif");
				    //$('img[id^="chkRep_"]').on('click',BRItem.toggleRep);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveAllReports', {
						commandName: "RemoveAllReports", 
						path: '/rolesApi/BalanceReporting/Reports', 
						kv: {	
							assetId : "01",
							assignAllReports : false,
							commandVersion : cmdVersion	
						}
					});
					
				}
			}
		
		},
		toggleWidgetAll : function(){
			if($(this).length == 1){
				if($(this).attr('src').search("unchecked") != -1){
					//$("#widgetsInfoDiv").addClass("disable");
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkWidget_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkWidget_"]').off('click');
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('ApplyAllWidgets', {
						commandName: "ApplyAllWidgets", 
						path: '/rolesApi/BalanceReporting/Widgets', 
						kv: {	
							assetId : "01",
							assignAllWidgets : true,
							commandVersion : cmdVersion
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
			//		$("#widgetsInfoDiv").removeClass("disable");
					$('img[id^="chkWidget_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkWidget_"]').on('click',BRItem.toggleWidget);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveAllWidgets', {
						commandName: "RemoveAllWidgets", 
						path: '/rolesApi/BalanceReporting/Widgets', 
						kv: {	
							assetId : "01",
							assignAllWidgets : false,
							commandVersion : cmdVersion	
						}
					});
					
				}
			}
		
		},
		toggleAlertAll : function(){
			if($(this).length == 1){
				if($(this).attr('src').search("unchecked") != -1){
			//		$("#alertsInfoDiv").addClass("disable");
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkAlert_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkAlert_"]').off('click');
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('ApplyAllAlerts', {
						commandName: "ApplyAllAlerts", 
						path: '/rolesApi/BalanceReporting/Alerts', 
						kv: {	
							assetId : "01",
							assignAllAlerts : true,
							commandVersion : cmdVersion	
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
			//		$("#alertsInfoDiv").removeClass("disable");
					$('img[id^="chkAlert_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkAlert_"]').on('click',BRItem.toggleAlert);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveAllAlerts', {
						commandName: "RemoveAllAlerts", 
						path: '/rolesApi/BalanceReporting/Alerts', 
						kv: {	
							assetId : "01",
							assignAllAlerts : false,
							commandVersion : cmdVersion
						}
					});
					
				}
			}
		
		},
		toggleAccountAll : function(){
			if($(this).length == 1){
				if($(this).attr('src').search("unchecked") != -1){
			//		$("#accountsInfoDiv").addClass("disable");
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkAccount_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkAccount_"]').off('click');
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('ApplyAllAccounts', {
						commandName: "ApplyAllAccounts", 
						path: '/rolesApi/BalanceReporting/Accounts', 
						kv: {	
							assetId : "01",
							assignAllAccounts : true,
							commandVersion : cmdVersion	
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
			//		$("#accountsInfoDiv").removeClass("disable");
					$('img[id^="chkAccount_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkAccount_"]').on('click',BRItem.toggleAcc);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveAllAccounts', {
						commandName: "RemoveAllAccounts", 
						path: '/rolesApi/BalanceReporting/Accounts', 
						kv: {	
							assetId : "01",
							assignAllAccounts : false,
							commandVersion : cmdVersion	
						}
					});
				}
			}
		
		},
		
		togglePrivilegeAll : function(){
			if($(this).length == 1){
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkPrevView"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkPrevView"]').off('click');
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					$.each($('img[id^="chkPrevView"]'),function(index, obj){
						RolesApp.trigger('UpdatePermission', {
							commandName: "UpdatePermission",
							path: '/rolesApi/BalanceReporting/Permissions',
							kv: {		
								   screenId: $(this).data('screenid'),
						           screenName: $(this).data('screenname'),
						           screenWeight:$(this).data('screenweight'),
						           module:$(this).data('module'),
					               subModule:$(this).data('submodule'),
					               tciRmParent: $(this).data('tcirmparent'),
					               assetId: $(this).attr('data-assetid'),
					               digest :  $(this).data('digest'),
					               view:true,
					               commandVersion : cmdVersion
					        }
						});
					});
					
					//Granular changes : display all granular columns
					$.each(workingData.assets,function(index,asset){
				if(asset.assetId == "01"){
					$.each(asset.permissions,function(index,permission){
													
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
						
					});
				}
			});//Granular ends
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					$('img[id^="chkPrevView"]').attr('src',"static/images/icons/icon_unchecked.gif");
					$('img[id^="chkPrevView"]').on('click',BRItem.togglePriv);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					$.each($('img[id^="chkPrevView"]'),function(index, obj){
						RolesApp.trigger('UpdatePermission', {
							commandName: "UpdatePermission",
							path: '/rolesApi/BalanceReporting/Permissions',
							kv: {		
								   screenId: $(this).data('screenid'),
						           screenName: $(this).data('screenname'),
						           screenWeight:$(this).data('screenweight'),
						           module:$(this).data('module'),
					               subModule:$(this).data('submodule'),
					               tciRmParent: $(this).data('tcirmparent'),
					               assetId: $(this).attr('data-assetid'),
					               digest :  $(this).data('digest'),
					               view:false,
					               commandVersion : cmdVersion
							}
						});
					});
				
				//Granular privileges changes
				$.each($('img[id^="chkPrevView"]'),function(index, obj){
					if(grBRColumnMap[$(this).data('featureid')]){
						var colIds = grBRColumnMap[$(this).data('featureid')].split(',');
						$.each(colIds,function(index,colId){
							$('#grBRCol_' + colId).addClass('hidden');
							var elem = $('img[id^="chkGran_01_' + colId + '_"]');
							$.each(elem,function(index,item){
								if($(this).attr('src') == "static/images/icons/icon_checked.gif"){
									$(this).attr('src',"static/images/icons/icon_unchecked.gif");
									//TODO : Duplicate code as like toggleGranular()
									if($(this).length == 1){
										var prevId = $(this).attr('id').split("_"),view;
										var mask = "";

										if(null != prevId){
											//TODO : Hardcoded Length 11 need to remove
											for(var i=0;i<11;i++){
												var flag = BRItem.isChecked($('#chkGran_01_'+i+'_'+prevId[3]).attr('src'));	
												
												if(flag){
													mask = mask + "1";
												}else{
													mask = mask + "0";
												}
											}
										}
										var cmdVersion = commandVersion + 1 ;
										commandVersion += 1 ;
										RolesApp.trigger('UpdateBRGRPermissions', {
											commandName: "UpdateBRGRPermissions",
											path: '/rolesApi/BalanceReporting/GRPermissions',
											kv: {
												mask: mask,
									            packageName : null,
									            packageId: null,
									            accountNo:$(this).attr('data-accountno'),
									            accountId: $(this).data('accountid'),
									            accountName: $(this).data('accountname'),
												assetId : $(this).attr('data-assetid'),
									            gpermissionType: $(this).data('gpermissiontype'),
									            obligatorId: $(this).data('obligatorid'),
									            digest :  $(this).data('digest'),
												commandVersion : cmdVersion
											}
										});
									}
								}
								$(this).parents().eq(1).addClass('hidden');								
							});
						});
					}
				});//Granular end
				}
			}
		
		},
		rightClick : function(e){
			    
            e.preventDefault();
            
            var menu = $(".menu");
            menu.attr('target',e.currentTarget.id);

            //hide menu if already shown
            menu.hide();
            
            //get x and y values of the click event
            var pageX = e.pageX;
            var pageY = e.pageY;

            //position menu div near mouse cliked area
            menu.css({top: pageY , left: pageX});

            var mwidth = menu.width();
            var mheight = menu.height();
            var screenWidth = $(window).width();
            var screenHeight = $(window).height();

            //if window is scrolled
            var scrTop = $(window).scrollTop();

            //if the menu is close to right edge of the window
            if(pageX+mwidth > screenWidth){
                     menu.css({left:pageX-mwidth +"px"});
            }

            //if the menu is close to bottom edge of the window
            if(pageY+mheight > screenHeight+scrTop){
                     menu.css({top:pageY-mheight +"px"});
            }
       
            //finally show the menu
            menu.show();
		},
		
		removeRightClickMenu : function(e){
			$(".menu").hide();
		},
		selectAll : function(e){
			var setBitPos = "";
			var targetPanelId = $(this).parents().eq(1).attr('target');
			if(targetPanelId == "granularInfoDiv"){
				for(var i=0;i<11;i++){
					if(!$("#grBRCol_" + i).hasClass('hidden')){
						setBitPos += i + "," 
						$('img[id^="chkGran_01_'+ i + '_"]').attr('src','static/images/icons/icon_checked.gif');
					}
				}
				
				
				if (setBitPos.endsWith(",")) {
					setBitPos = setBitPos.substring(0, setBitPos.length - 1);
				}
				console.log("Set Bits " + setBitPos);
				var cmdVersion = commandVersion + 1 ;
				commandVersion += 1 ;
				RolesApp.trigger('ApplyAllGRBR', {
					commandName: "ApplyAllGRBR",
					path: '/rolesApi/BalanceReporting/GRPermissions',
					kv: {
						roleId : workingData.roleId,
						corpId : workingData.corporationId,
						assetId : "01",
						setBitPos : setBitPos,
						action : "applyAll",
						commandVersion : cmdVersion
					}
				});
			}
		},
		deselectAll : function(e){
			var setBitPos = "";
			var targetPanelId = $(this).parents().eq(1).attr('target');
			if(targetPanelId == "granularInfoDiv"){
				for(var i=0;i<11;i++){
					if(!$("#grBRCol_" + i).hasClass('hidden')){
						setBitPos += i + "," 
						$('img[id^="chkGran_01_'+ i + '_"]').attr('src','static/images/icons/icon_unchecked.gif');
					}
				}
				
				if (setBitPos.endsWith(",")) {
					setBitPos = setBitPos.substring(0, setBitPos.length - 1);
				}
				console.log("Set Bits " + setBitPos);
				var cmdVersion = commandVersion + 1 ;
				commandVersion += 1 ;
				RolesApp.trigger('ApplyAllGRBR', {
					commandName: "ApplyAllGRBR",
					path: '/rolesApi/BalanceReporting/GRPermissions',
					kv: {
						roleId : workingData.roleId,
						corpId : workingData.corporationId,
						assetId : "01",
						setBitPos : setBitPos,
						action : "removeAll",
						commandVersion : cmdVersion
					}
				});
			}
		},
		
		isChecked : function(src){
			if(src.search("unchecked") != -1){
				return false;
			}else{
				return true;
			}
		},
		
		init: function () {
			console.log("Admin Service Controller recieved");		
			
			$('img[id^="chkPrevView_"]').on('click',BRItem.togglePriv);
			$('img[id^="chkAccount_"]').on('click',BRItem.toggleAcc);
			$('img[id^="chkAlert_"]').on('click',BRItem.toggleAlert);
			$('img[id^="chkRep_"]').on('click',BRItem.toggleRep);	
			$('img[id^="chkWidget_"]').on('click',BRItem.toggleWidget);
			$('img[id^="chkGran_"]').on('click',BRItem.toggleGranular);
			
			$('#accountsInfoCaret').on('click',BRItem.toggleAccountsCaret);	
			$('#privilegesInfoCaret').on('click',BRItem.togglePrivilegesCaret);	
			$('#alertsInfoCaret').on('click',BRItem.toggleAlertsCaret);	
			$('#reportsInfoCaret').on('click',BRItem.toggleReportsCaret);	
			$('#widgetsInfoCaret').on('click',BRItem.toggleWidgetsCaret);	
			$('#granularInfoCaret').on('click',BRItem.toggleGranularCaret);
			
			$('#expandAll').on('click',BRItem.toggleExpandAll);
			$('#collapseAll').on('click',BRItem.toggleCollapseAll);	
			
			$('#accountAll_01').on('click',BRItem.toggleAccountAll);
			$('#reportsAll_01').on('click',BRItem.toggleReportAll);
			$('#widgetsAll_01').on('click',BRItem.toggleWidgetAll);
			$('#alertsAll_01').on('click',BRItem.toggleAlertAll);
			$('#prevAll_01').on('click',BRItem.togglePrivilegeAll);
			
			$('#permissionNext, #saveAndVerify').on('click', CommonRole.next);
			$('#btnCancelRoleEntry').on('click', CommonRole.cancel);
			$('#granularInfoDiv').on( "contextmenu", BRItem.rightClick );
			$('html').on( "click", BRItem.removeRightClickMenu );
			$('#lblSelectAll').on( "click", BRItem.selectAll );
			$('#lblDeselectAll').on( "click", BRItem.deselectAll );			
			
			$('label[id^="accountAll_01"]').on('click', CommonRole.toggleLabelCheckUncheck);
			$('label[id^="reportsAll_01"]').on('click', CommonRole.toggleLabelCheckUncheck);
			
			$('label[id^="alertsAll_01"]').on('click', CommonRole.toggleLabelCheckUncheck);
			$('label[id^="widgetsAll_01"]').on('click', CommonRole.toggleLabelCheckUncheck);
			$('label[id^="prevAll_01"]').on('click', CommonRole.toggleLabelCheckUncheck);
		}
	};

	RolesApp.bind('brServiceInit', BRItem.init);
	
})(jQuery);