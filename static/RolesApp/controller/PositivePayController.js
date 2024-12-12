/*global jQuery, RoleDetails */

(function ($) {
	'use strict';

	var PositivePayItem = {
		
		togglePrivi : function(){
			if($(this).length == 1){
				var prevId = $(this).attr('id').split("_"),view,edit,auth;

				if($(this).attr('src').search("unchecked") != -1){
					if(prevId[0] == "chkPrevEdit" || prevId[0] == "chkPrevAuth"){
						$('#chkPrevView_'+prevId[1]+'_'+prevId[2]).attr('src','static/images/icons/icon_checked.gif');
					}
					$(this).attr('src',"static/images/icons/icon_checked.gif");
				}else{
					if(prevId[0] == "chkPrevView"){
						$('#chkPrevEdit_'+prevId[1]+'_'+prevId[2]).attr('src','static/images/icons/icon_unchecked.gif');
						$('#chkPrevAuth_'+prevId[1]+'_'+prevId[2]).attr('src','static/images/icons/icon_unchecked.gif');
					}
					$(this).attr('src',"static/images/icons/icon_unchecked.gif")
				}
				
				if(null != prevId){
					if($('#chkPrevView_'+prevId[1]+'_'+prevId[2]).attr('src') != undefined)
						view = PositivePayItem.isChecked($('#chkPrevView_'+prevId[1]+'_'+prevId[2]).attr('src'));
					else
						view = false;
					
					if($('#chkPrevEdit_'+prevId[1]+'_'+prevId[2]).attr('src') != undefined)
						edit = PositivePayItem.isChecked($('#chkPrevEdit_'+prevId[1]+'_'+prevId[2]).attr('src'));
					else
						edit = false;
					
					if($('#chkPrevAuth_'+prevId[1]+'_'+prevId[2]).attr('src') != undefined)
						auth = PositivePayItem.isChecked($('#chkPrevAuth_'+prevId[1]+'_'+prevId[2]).attr('src'));
					else
						auth = false;
				}
				
				var cmdVersion = commandVersion + 1 ;
    			commandVersion += 1 ;
				RolesApp.trigger('UpdatePermission', {
					commandName: "UpdatePermission",
					path: '/rolesApi/PositivePay/Permissions',
					kv: {		
						   screenId: $(this).data('screenid'),
				           screenName: $(this).data('screenname'),
				           screenWeight:$(this).data('screenweight'),
				           module:$(this).data('module'),
			               subModule:$(this).data('submodule'),
			               tciRmParent: $(this).data('tcirmparent'),
			               assetId: $(this).attr('data-assetid'),
			               digest :  $(this).data('digest'),
			               view:view,
			               edit:edit,
			               auth:auth,
			               commandVersion : cmdVersion
					}
				});
				
				if($(this).attr('src').search("unchecked") != -1){
					
					if(grPPColumnMap.hasOwnProperty([$(this).data('featureid')+"-"+$(this).data('screenweight')])){
						var colIds = [];
						var colObj = grPPColumnMap[$(this).data('featureid')+"-"+$(this).data('screenweight')];
						
						if(!view && colObj.hasOwnProperty("view"))
							colIds.push(colObj.view);
						
						if(!edit && colObj.hasOwnProperty("edit"))
							colIds.push(colObj.edit);
						
						if(!auth && colObj.hasOwnProperty("auth"))
							colIds.push(colObj.auth);
						
						$.each(colIds,function(index,colId){
							$('#grPPCol_' + colId).addClass('hidden');
							var elem = $('img[id^="chkPosPayGran_13_' + colId + '_"]');
						
							$.each(elem,function(index,item){
								if($(this).attr('src') == "static/images/icons/icon_checked.gif"){
									$(this).attr('src',"static/images/icons/icon_unchecked.gif"); // Reset All CheckBoxes In that Column
									if($(this).length == 1){
										
										var granPrevId = $(this).attr('id').split("_"),view;
										var mask = "";

										//TODO : Hard coded Length 10 need to remove
										if(null != granPrevId){
											for(var i=0; i<7; i++){
												var flag = PositivePayItem.isChecked($('#chkPosPayGran_13_'+ i +'_'+ granPrevId[3]).attr('src'));	
												
												if(flag){
													mask = mask + "1";
												}else{
													mask = mask + "0";
												}
											}
										}
										var cmdVersion = commandVersion + 1 ;
										commandVersion += 1 ;
										RolesApp.trigger('UpdatePPGRPermission', {
											commandName: "UpdatePPGRPermission",
											path: '/rolesApi/PositivePay/GRPermissions',
											kv: {
												mask: mask,
									            packageName : $(this).data('packagename'),
									            packageId: $(this).data('packageid'),
									            accountNo: $(this).attr('data-accountno'),
									            accountId: $(this).data('accountid'),
									            accountName: $(this).data('accountname'),
												assetId : $(this).attr('data-assetid'),
									            gpermissionType: $(this).data('gpermissiontype'),
									            obligatorId: $(this).data('obligatorid'),
												commandVersion : cmdVersion
											}
										});
									
										
										
										
									}
								}
								$(this).parents().eq(1).addClass('hidden');
							});
						});
					}
				}else{
					if(grPPColumnMap.hasOwnProperty([$(this).data('featureid')+"-"+$(this).data('screenweight')])){
						var colIds = [];
						var colObj = grPPColumnMap[$(this).data('featureid')+"-"+$(this).data('screenweight')];
						
						if(view && colObj.hasOwnProperty("view"))
							colIds.push(colObj.view);
						
						if(edit && colObj.hasOwnProperty("edit"))
							colIds.push(colObj.edit);
						
						if(auth && colObj.hasOwnProperty("auth"))
							colIds.push(colObj.auth);
						
						$.each(colIds,function(index,colId){
							$('#grPPCol_' + colId).removeClass('hidden');
							var elem = $('img[id^="chkPosPayGran_13_' + colId + '_"]');
						
							$.each(elem,function(index,item){
								$(this).parents().eq(1).removeClass('hidden');
							});
						});
					}
				}
			CommonRole.checkSelectAll('chkPrev','prevAll');	
			}
		},
		
		
		togglePPGranular : function(){
			if($(this).length == 1){
				var granPrevId = $(this).attr('id').split("_"),view;
				var mask = "";

				if($(this).attr('src').search("unchecked") != -1)
					$(this).attr('src',"static/images/icons/icon_checked.gif");
				else
					$(this).attr('src',"static/images/icons/icon_unchecked.gif")
				
				//TODO : Hard coded Length 10 need to remove
				if(null != granPrevId){
					for(var i=0; i<7; i++){
						var flag = PositivePayItem.isChecked($('#chkPosPayGran_13_'+ i +'_'+ granPrevId[3]).attr('src'));	
						
						if(flag){
							mask = mask + "1";
							if( granPrevId[2] == 1 || granPrevId[2] == 2 )
							{
								$('#chkPosPayGran_13_0_'+ granPrevId[3]).attr('src',"static/images/icons/icon_checked.gif");
								mask = mask.replaceAt(0,"1");
							}
							if( granPrevId[2] == 4 || granPrevId[2] == 5 )
							{
								$('#chkPosPayGran_13_3_'+ granPrevId[3]).attr('src',"static/images/icons/icon_checked.gif");
								mask = mask.replaceAt(3,"1");
							}
							/*if( granPrevId[2] == 7 || granPrevId[2] == 8 )
							{
								$('#chkPosPayGran_13_6_'+ granPrevId[3]).attr('src',"static/images/icons/icon_checked.gif");
								mask = mask.replaceAt(6,"1");
							}*/
						}else{
							mask = mask + "0";
							if( granPrevId[2] == 0 )
							{
								$('#chkPosPayGran_13_1_'+ granPrevId[3]).attr('src',"static/images/icons/icon_unchecked.gif");
								$('#chkPosPayGran_13_2_'+ granPrevId[3]).attr('src',"static/images/icons/icon_unchecked.gif");
								mask = mask.replaceAt(1,"0");
								mask = mask.replaceAt(2,"0");
							}
							if( granPrevId[2] == 3 )
							{
								$('#chkPosPayGran_13_4_'+ granPrevId[3]).attr('src',"static/images/icons/icon_unchecked.gif");
								$('#chkPosPayGran_13_5_'+ granPrevId[3]).attr('src',"static/images/icons/icon_unchecked.gif");
								mask = mask.replaceAt(4,"0");
								mask = mask.replaceAt(5,"0");
							}/*
							if( granPrevId[2] == 6 )
							{
								$('#chkPosPayGran_13_7_'+ granPrevId[3]).attr('src',"static/images/icons/icon_unchecked.gif");
								$('#chkPosPayGran_13_8_'+ granPrevId[3]).attr('src',"static/images/icons/icon_unchecked.gif");
								mask = mask.replaceAt(7,"0");
								mask = mask.replaceAt(8,"0");
							}*/
						}
					}
				}
				var cmdVersion = commandVersion + 1 ;
				commandVersion += 1 ;
				RolesApp.trigger('UpdatePPGRPermission', {
					commandName: "UpdatePPGRPermission",
					path: '/rolesApi/PositivePay/GRPermissions',
					kv: {
						mask: mask,
			            packageName : $(this).data('packagename'),
			            packageId: $(this).data('packageid'),
			            accountNo: $(this).attr('data-accountno'),
			            accountId: $(this).data('accountid'),
			            accountName: $(this).data('accountname'),
						assetId : $(this).attr('data-assetid'),
			            gpermissionType: $(this).data('gpermissiontype'),
			            obligatorId: $(this).data('obligatorid'),
						commandVersion : cmdVersion
					}
				});
			}		
		},
		
		toggleAcc : function(){
			if($(this).length == 1){
				var accId = $(this).attr('id').split("_");
                CommonRole.updateStore(this, 'Accounts', 'chkAccount_','PositivePay');
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('AddAccounts', {
						commandName: "AddAccounts",
						path: '/rolesApi/PositivePay/Accounts',
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
						path: '/rolesApi/PositivePay/Accounts',
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
			CommonRole.checkSelectAll('chkAccount_','accountAll');
			}
		
		},
			
		toggleRep : function(){
			if($(this).length == 1){
				var repId = $(this).attr('id').split("_");
				CommonRole.updateStore(this, 'Reports', 'chkRep_','PositivePay');
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
	    			commandVersion += 1 ;
					RolesApp.trigger('AddReports', {
						commandName: "AddReports",
						path: '/rolesApi/PositivePay/Reports',
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
					$(this).attr('src',"static/images/icons/icon_unchecked.gif")
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveReports', {
						commandName: "RemoveReports",
						path: '/rolesApi/PositivePay/Reports',
						kv: {						
							reportId :  $(this).data('reportid'),
							reportType : $(this).data('reporttype'), 
							assetId : $(this).attr('data-assetid'),
							digest :  $(this).data('digest'),
							assignedFlag : false,
				            commandVersion : cmdVersion
						}
					});
				}
			CommonRole.checkSelectAll('chkRep_','reportsAll');
			}
		
		},
		
		
		toggleAlert : function(){
			if($(this).length == 1){
				var alertId = $(this).attr('id').split("_"),view,edit,auth;
         		CommonRole.updateStore(this, 'Alerts', 'chkAlert_','PositivePay');
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
	    			commandVersion += 1 ;
					RolesApp.trigger('AddAlerts', {
						commandName: "AddAlerts",
						path: '/rolesApi/PositivePay/Alerts',
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
					$(this).attr('src',"static/images/icons/icon_unchecked.gif")
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveAlerts', {
						commandName: "RemoveAlerts",
						path: '/rolesApi/PositivePay/Alerts',
						kv: {						
							alertId :  $(this).data('alertid'),
							alertType : $(this).data('alerttype'), 
							assetId : $(this).attr('data-assetid'),
							digest :  $(this).data('digest'),
							assignedFlag : false,
				            commandVersion : cmdVersion
						}
					});
				}
			CommonRole.checkSelectAll('chkAlert_','alertsAll');		
			}
		
		},
		
		
		toggleWidget : function(){
			if($(this).length == 1){
				var widgetId = $(this).attr('id').split("_");
				CommonRole.updateStore(this, 'Widgets', 'chkWidget_','PositivePay');
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
	    			commandVersion += 1 ;
					RolesApp.trigger('AddWidgets', {
						commandName: "AddWidgets",
						path: '/rolesApi/PositivePay/Widgets',
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
					$(this).attr('src',"static/images/icons/icon_unchecked.gif")
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveWidgets', {
						commandName: "RemoveWidgets",
						path: '/rolesApi/PositivePay/Widgets',
						kv: {						
							widgetId :  $(this).data('widgetid'),
							widgetType : $(this).data('widgettype'), 
							assetId : $(this).attr('data-assetid'),
							digest :  $(this).data('digest'),
							assignedFlag : false,
				            commandVersion : cmdVersion
						}
					});
				}
			CommonRole.checkSelectAll('chkWidget_','widgetsAll');
			}
		
		},
		
		isChecked : function(src){
			if(src.search("unchecked") != -1){
				return false;
			}else{
				return true;
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
		
		togglePPGRCaret: function () {
			$('#positivePayGranularInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#positivePayGranularInfoDiv').slideToggle(200);
			return false;
		},
		
		toggleExpandAll: function () {
			$("[id$='Caret']").addClass("fa-caret-up");
			$("[id$='Caret']").removeClass("fa-caret-down");
			$("[id$='InfoDiv']").slideDown(200);
			return false;
		},
		
		toggleCollapseAll: function () {
			$("[id$='Caret']").addClass("fa-caret-down");
			$("[id$='Caret']").removeClass("fa-caret-up");
			$("[id$='InfoDiv']").slideUp(200);
			return false;
		},
		
		back: function () {
			if(CommonRole.getAssetStore().length > 0){
				CommonRole.next();
			}
		},
		
		togglePermissionAll : function(){
			if($(this).length == 1){
				if($(this).attr('src').search("unchecked") != -1){
				//	$("#privilegesInfoDiv").addClass("disable");
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkPrev"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkPrev"]').off('click');
										
					$.each($('img[id^="chkPrevView"]'),function(index, obj){
						
						var cmdVersion = commandVersion + 1 ;
						commandVersion += 1 ;
						
						RolesApp.trigger('UpdatePermission', {
							commandName: "UpdatePermission", 
							path: '/rolesApi/PositivePay/Permissions', 
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
					               edit:true,
					               auth:true,
						           commandVersion : cmdVersion
							}
						});
					});
					
					//Display all Granular columns
					$.each(workingData.assets,function(index,asset){
				if(asset.assetId == "13"){
					$.each(asset.permissions,function(index,permission){
						var colIds = [];
						
						if(grPPColumnMap.hasOwnProperty([permission.featureId+"-"+permission.screenWeight])){
							
							var colObj = grPPColumnMap[permission.featureId+"-"+permission.screenWeight];
							colIds.push(colObj.view);
							colIds.push(colObj.edit);
							colIds.push(colObj.auth);
						}						
						
								
						$.each(colIds,function(index,colId){
							$('#grPPCol_' + colId).removeClass('hidden');
							var elem = $('img[id^="chkPosPayGran_13_' + colId + '_"]');
						
							$.each(elem,function(index,item){
								$(this).parents().eq(1).removeClass('hidden');
							});
						});
					});
				}
			});
			//Granular ends
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					$('img[id^="chkPrev"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkPrev"]').on('click',PositivePayItem.togglePrivi);
					
					$.each($('img[id^="chkPrevView"]'),function(index, obj){
						
						var cmdVersion = commandVersion + 1 ;
						commandVersion += 1 ;
						
						RolesApp.trigger('UpdatePermission', {
							commandName: "UpdatePermission", 
							path: '/rolesApi/PositivePay/Permissions', 
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
					               edit:false,
					               auth:false,
						           commandVersion : cmdVersion
							}
						});
						
					});
					
					//Hide all granular columns
					$.each($('img[id^="chkPrevView"]'),function(index, obj){
						
						
						if(grPPColumnMap.hasOwnProperty([$(this).data('featureid')+"-"+$(this).data('screenweight')])){
						var colIds = [];
						var colObj = grPPColumnMap[$(this).data('featureid')+"-"+$(this).data('screenweight')];
						colIds.push(colObj.view);
						colIds.push(colObj.edit);
						colIds.push(colObj.auth);
						
						$.each(colIds,function(index,colId){
							$('#grPPCol_' + colId).addClass('hidden');
							var elem = $('img[id^="chkPosPayGran_13_' + colId + '_"]');
						
							$.each(elem,function(index,item){
								if($(this).attr('src') == "static/images/icons/icon_checked.gif"){
									$(this).attr('src',"static/images/icons/icon_unchecked.gif"); // Reset All CheckBoxes In that Column
									if($(this).length == 1){
										var granPrevId = $(this).attr('id').split("_"),view;
										var mask = "";
										
										//TODO : Hard coded Length 10 need to remove
										if(null != granPrevId){
											for(var i=0; i<7; i++){
												var flag = PositivePayItem.isChecked($('#chkPosPayGran_13_'+ i +'_'+ granPrevId[3]).attr('src'));	
												
												if(flag){
													mask = mask + "1";
												}else{
													mask = mask + "0";
												}
											}
										}
										var cmdVersion = commandVersion + 1 ;
										commandVersion += 1 ;
										RolesApp.trigger('UpdatePPGRPermission', {
											commandName: "UpdatePPGRPermission",
											path: '/rolesApi/PositivePay/GRPermissions',
											kv: {
												mask: mask,
									            packageName : $(this).data('packagename'),
									            packageId: $(this).data('packageid'),
									            accountNo: $(this).attr('data-accountno'),
									            accountId: $(this).data('accountid'),
									            accountName: $(this).data('accountname'),
												assetId : $(this).attr('data-assetid'),
									            gpermissionType: $(this).data('gpermissiontype'),
									            obligatorId: $(this).data('obligatorid'),
												commandVersion : cmdVersion
											}
										});
									}
								}
								$(this).parents().eq(1).addClass('hidden');
							});
						});
					}		
					});
					//Granular ends
					
				}
			}
		
		},
		
		toggleAccountAll : function(){
			if($(this).length == 1){
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkAccount_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkAccount_"]').off('click');
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('ApplyAllAccounts', {
						commandName: "ApplyAllAccounts", 
						path: '/rolesApi/PositivePay/Accounts', 
						kv: {	
							assetId : "13",
							assignAllAccounts : true,
							commandVersion : cmdVersion	
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					$('img[id^="chkAccount_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkAccount_"]').on('click',PositivePayItem.toggleAcc);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveAllAccounts', {
						commandName: "RemoveAllAccounts", 
						path: '/rolesApi/PositivePay/Accounts', 
						kv: {	
							assetId : "13",
							assignAllAccounts : false,
							commandVersion : cmdVersion	
						}
					});
				}
			}
		
		},
		
		toggleReportAll : function(){
			if($(this).length == 1){
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkRep_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkRep_"]').off('click');
					
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					
					RolesApp.trigger('ApplyAllReports', {
						commandName: "ApplyAllReports", 
						path: '/rolesApi/PositivePay/Reports', 
						kv: {	
							assetId : "13",
							assignAllReports : true,
				            commandVersion : cmdVersion
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					$('img[id^="chkRep_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkRep_"]').on('click',PositivePayItem.toggleRep);
					
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					
					RolesApp.trigger('RemoveAllReports', {
						commandName: "RemoveAllReports", 
						path: '/rolesApi/PositivePay/Reports', 
						kv: {	
							assetId : "13",
							assignAllReports : false,
				            commandVersion : cmdVersion
						}
					});
				}
			}
		
		},
		toggleAlertAll : function(){
			if($(this).length == 1){
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkAlert_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkAlert_"]').off('click');
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('ApplyAllAlerts', {
						commandName: "ApplyAllAlerts", 
						path: '/rolesApi/PositivePay/Alerts', 
						kv: {	
							assetId : "13",
							assignAllAlerts : true,
				            commandVersion : cmdVersion
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					$('img[id^="chkAlert_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkAlert_"]').on('click',PositivePayItem.toggleAlert);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveAllAlerts', {
						commandName: "RemoveAllAlerts", 
						path: '/rolesApi/PositivePay/Alerts', 
						kv: {	
							assetId : "13",
							assignAllAlerts : false,
				            commandVersion : cmdVersion
						}
					});
				}
			}
		
		},
		toggleWidgetAll : function(){
			if($(this).length == 1){
				if($(this).attr('src').search("unchecked") != -1){
				//	$("#widgetsInfoDiv").addClass("disable");
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkWidget_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkWidget_"]').off('click');
					
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					
					RolesApp.trigger('ApplyAllWidgets', {
						commandName: "ApplyAllWidgets", 
						path: '/rolesApi/PositivePay/Widgets', 
						kv: {	
							assetId : "13",
							assignAllWidgets : true,
				            commandVersion : cmdVersion
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					//$("#widgetsInfoDiv").removeClass("disable");
					$('img[id^="chkWidget_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkWidget_"]').on('click',PositivePayItem.toggleWidget);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveAllWidgets', {
						commandName: "RemoveAllWidgets", 
						path: '/rolesApi/PositivePay/Widgets', 
						kv: {	
							assetId : "13",
							assignAllWidgets : false,
				            commandVersion : cmdVersion
						}
					});
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
			if(targetPanelId == "positivePayGranularInfoDiv"){
				for(var i=0;i<7;i++){
					if(!$("#grPPCol_" + i).hasClass('hidden')){
						setBitPos += i + "," 
						$('img[id^="chkPosPayGran_13_'+ i + '_"]').attr('src','static/images/icons/icon_checked.gif');
					}
				}
				
				
				if (setBitPos.endsWith(",")) {
					setBitPos = setBitPos.substring(0, setBitPos.length - 1);
				}
				console.log("Set Bits " + setBitPos);
				var cmdVersion = commandVersion + 1 ;
				commandVersion += 1 ;
				RolesApp.trigger('ApplyAllGRPP', {
					commandName: "ApplyAllGRPP",
					path: '/rolesApi/PositivePay/GRPermissions',
					kv: {
						roleId : workingData.roleId,
						corpId : workingData.corporationId,
						assetId : "13",
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
			if(targetPanelId == "positivePayGranularInfoDiv"){
				for(var i=0;i<7;i++){
					if(!$("#grPPCol_" + i).hasClass('hidden')){
						setBitPos += i + "," 
						$('img[id^="chkPosPayGran_13_'+ i + '_"]').attr('src','static/images/icons/icon_unchecked.gif');
					}
				}
				
				if (setBitPos.endsWith(",")) {
					setBitPos = setBitPos.substring(0, setBitPos.length - 1);
				}
				console.log("Set Bits " + setBitPos);
				var cmdVersion = commandVersion + 1 ;
				commandVersion += 1 ;
				RolesApp.trigger('ApplyAllGRPP', {
					commandName: "ApplyAllGRPP",
					path: '/rolesApi/PositivePay/GRPermissions',
					kv: {
						roleId : workingData.roleId,
						corpId : workingData.corporationId,
						assetId : "13",
						setBitPos : setBitPos,
						action : "removeAll",
						commandVersion : cmdVersion
					}
				});
			}
		},
		
		init: function () {
			console.log("PositivePay Service Controller recieved");		
			
			$('img[id^="chkPrev"]').on('click',PositivePayItem.togglePrivi);
			$('img[id^="chkAccount_"]').on('click',PositivePayItem.toggleAcc);
			$('img[id^="chkPosPayGran_"]').on('click',PositivePayItem.togglePPGranular);

			
			$('img[id^="chkRep_"]').on('click',PositivePayItem.toggleRep);
			$('img[id^="chkAlert_"]').on('click',PositivePayItem.toggleAlert);
			$('img[id^="chkWidget_"]').on('click',PositivePayItem.toggleWidget);
									
			$('#privilegesInfoCaret').on('click',PositivePayItem.togglePrivilegesCaret);	
			$('#reportsInfoCaret').on('click',PositivePayItem.toggleReportsCaret);	
			$('#alertsInfoCaret').on('click',PositivePayItem.toggleAlertsCaret);
			$('#accountsInfoCaret').on('click',PositivePayItem.toggleAccountsCaret);	
			$('#widgetsInfoCaret').on('click',PositivePayItem.toggleWidgetsCaret);
			$('#positivePayGranularInfoCaret').on('click',PositivePayItem.togglePPGRCaret);

			
			$('#expandAll').on('click',PositivePayItem.toggleExpandAll);
			$('#collapseAll').on('click',PositivePayItem.toggleCollapseAll);	

			$('#back').on('click',PositivePayItem.back);
			$('#reportsAll_13').on('click',PositivePayItem.toggleReportAll);
			$('#accountAll_13').on('click',PositivePayItem.toggleAccountAll);
			$('#alertsAll_13').on('click',PositivePayItem.toggleAlertAll);
			$('#prevAll_13').on('click',PositivePayItem.togglePermissionAll);	
			$('#widgetsAll_13').on('click',PositivePayItem.toggleWidgetAll);
			
			$('#permissionNext, #saveAndVerify').on('click', CommonRole.next);
			$('#btnCancelRoleEntry').on('click', CommonRole.cancel);
			$('#positivePayGranularInfoDiv').on( "contextmenu", PositivePayItem.rightClick );
			$('html').on( "click", PositivePayItem.removeRightClickMenu );
			$('#lblSelectAll').on( "click", PositivePayItem.selectAll );
			$('#lblDeselectAll').on( "click", PositivePayItem.deselectAll );	
			
			$('label[id^="reportsAll_13"]').on('click', CommonRole.toggleLabelCheckUncheck);
			$('label[id^="accountAll_13"]').on('click', CommonRole.toggleLabelCheckUncheck);
			$('label[id^="alertsAll_13"]').on('click', CommonRole.toggleLabelCheckUncheck);
			$('label[id^="prevAll_13"]').on('click', CommonRole.toggleLabelCheckUncheck);
			$('label[id^="widgetsAll_13"]').on('click', CommonRole.toggleLabelCheckUncheck);
			
		}
	};

	RolesApp.bind('positivePayServiceInit', PositivePayItem.init);
	
})(jQuery);