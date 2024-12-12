/*global jQuery, RoleDetails */

(function ($) {
	'use strict';

	var chkManagementItem = {
		
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
						view = chkManagementItem.isChecked($('#chkPrevView_'+prevId[1]+'_'+prevId[2]).attr('src'));
					else
						view = false;
					
					if($('#chkPrevEdit_'+prevId[1]+'_'+prevId[2]).attr('src') != undefined)
						edit = chkManagementItem.isChecked($('#chkPrevEdit_'+prevId[1]+'_'+prevId[2]).attr('src'));
					else
						edit = false;
					
					if($('#chkPrevAuth_'+prevId[1]+'_'+prevId[2]).attr('src') != undefined)
						auth = chkManagementItem.isChecked($('#chkPrevAuth_'+prevId[1]+'_'+prevId[2]).attr('src'));
					else
						auth = false;
				}
				
				var cmdVersion = commandVersion + 1 ;
    			commandVersion += 1 ;
				RolesApp.trigger('UpdatePermission', {
					commandName: "UpdatePermission",
					path: '/rolesApi/CheckManagement/Permissions',
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
					
					if(grCheckColumnMap.hasOwnProperty([$(this).data('featureid')+"-"+$(this).data('screenweight')])){
						var colIds = [];
						var colObj = grCheckColumnMap[$(this).data('featureid')+"-"+$(this).data('screenweight')];
						
						if(!view && colObj.hasOwnProperty("view"))
							colIds.push(colObj.view);
						
						if(!edit && colObj.hasOwnProperty("edit"))
							colIds.push(colObj.edit);
						
						if(!auth && colObj.hasOwnProperty("auth"))
							colIds.push(colObj.auth);
						
						$.each(colIds,function(index,colId){
							$('#grCheckCol_' + colId).addClass('hidden');
							var elem = $('img[id^="chkCheckMgmtGran_14_' + colId + '_"]');
						
							$.each(elem,function(index,item){
								if($(this).attr('src') == "static/images/icons/icon_checked.gif"){
									$(this).attr('src',"static/images/icons/icon_unchecked.gif"); // Reset All CheckBoxes In that Column
									if($(this).length == 1){

										var granPrevId = $(this).attr('id').split("_"),view;
										var mask = "";

										//TODO : Hard coded Length 9 need to remove
										if(null != granPrevId){
											for(var i=0; i<11; i++){
												var flag = chkManagementItem.isChecked($('#chkCheckMgmtGran_14_'+ i +'_'+ granPrevId[3]).attr('src'));	
												
												if(flag){
													mask = mask + "1";
												}else{
													mask = mask + "0";
												}
											}
										}
										var cmdVersion = commandVersion + 1 ;
										commandVersion += 1 ;
										RolesApp.trigger('UpdateCKGRPermission', {
											commandName: "UpdateCKGRPermission",
											path: '/rolesApi/CheckManagement/GRPermissions',
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
				}else{
					if(grCheckColumnMap.hasOwnProperty([$(this).data('featureid')+"-"+$(this).data('screenweight')])){
						var colIds = [];
						var colObj = grCheckColumnMap[$(this).data('featureid')+"-"+$(this).data('screenweight')];
						
						if(view && colObj.hasOwnProperty("view"))
							colIds.push(colObj.view);
						
						if(edit && colObj.hasOwnProperty("edit"))
							colIds.push(colObj.edit);
						
						if(auth && colObj.hasOwnProperty("auth"))
							colIds.push(colObj.auth);
						
						$.each(colIds,function(index,colId){
							$('#grCheckCol_' + colId).removeClass('hidden');
							var elem = $('img[id^="chkCheckMgmtGran_14_' + colId + '_"]');
						
							$.each(elem,function(index,item){
								$(this).parents().eq(1).removeClass('hidden');
							});
						});
					}
				}
			CommonRole.checkSelectAll('chkPrev','prevAll');	
			}
		},
		
		toggleChkMgmtGranular : function(){
			if($(this).length == 1){
				var granPrevId = $(this).attr('id').split("_"),view;
				var mask = "";

				if($(this).attr('src').search("unchecked") != -1)
					$(this).attr('src',"static/images/icons/icon_checked.gif");
				else
					$(this).attr('src',"static/images/icons/icon_unchecked.gif")
				
				//TODO : Hard coded Length 9 need to remove
				if(null != granPrevId){
					for(var i=0; i<11; i++){
						var flag = chkManagementItem.isChecked($('#chkCheckMgmtGran_14_'+ i +'_'+ granPrevId[3]).attr('src'));	
						
						if(flag){
							mask = mask + "1";
							if( granPrevId[2] == 1 )
							{
								$('#chkCheckMgmtGran_14_0_'+ granPrevId[3]).attr('src',"static/images/icons/icon_checked.gif");
							}
							//  If View Paid Image is checked, then View Enq should checked automatically
							if( granPrevId[2] == 2 )
							{
								$('#chkCheckMgmtGran_14_0_'+ granPrevId[3]).attr('src',"static/images/icons/icon_checked.gif");
							}
						//  If View Cancel Stop Pay is checked then both View Inquiry and View Stop Pay should be checked automatically
							if( granPrevId[2] == 3 )
							{
								$('#chkCheckMgmtGran_14_0_'+ granPrevId[3]).attr('src',"static/images/icons/icon_checked.gif");
								$('#chkCheckMgmtGran_14_6_'+ granPrevId[3]).attr('src',"static/images/icons/icon_checked.gif");
							}
							//  If Create Cancel Stop Pay is checked then View Stop Pay should be checked automatically
							if( granPrevId[2] == 4 )
							{
								$('#chkCheckMgmtGran_14_3_'+ granPrevId[3]).attr('src',"static/images/icons/icon_checked.gif");
								$('#chkCheckMgmtGran_14_6_'+ granPrevId[3]).attr('src',"static/images/icons/icon_checked.gif");
							}							
							if( granPrevId[2] == 5 )
							{
								$('#chkCheckMgmtGran_14_3_'+ granPrevId[3]).attr('src',"static/images/icons/icon_checked.gif");
							}
							//  If View Stop Pay is checked then View Inquiry should be checked automatically
							if( granPrevId[2] == 6 )
							{
								$('#chkCheckMgmtGran_14_0_'+ granPrevId[3]).attr('src',"static/images/icons/icon_checked.gif");
							}							
							if( granPrevId[2] == 7 || granPrevId[2] == 8 )
							{
								$('#chkCheckMgmtGran_14_6_'+ granPrevId[3]).attr('src',"static/images/icons/icon_checked.gif");
							}
							//If Advance Stop Pay is checked, then Create Enq and View Enq both boxes should get checked automatically.
							if( granPrevId[2] == 10 )
							{
								$('#chkCheckMgmtGran_14_9_'+ granPrevId[3]).attr('src',"static/images/icons/icon_checked.gif");
								$('#chkCheckMgmtGran_14_0_'+ granPrevId[3]).attr('src',"static/images/icons/icon_checked.gif");
								$('#chkCheckMgmtGran_14_1_'+ granPrevId[3]).attr('src',"static/images/icons/icon_checked.gif");
								$('#chkCheckMgmtGran_14_6_'+ granPrevId[3]).attr('src',"static/images/icons/icon_checked.gif");
								$('#chkCheckMgmtGran_14_7_'+ granPrevId[3]).attr('src',"static/images/icons/icon_checked.gif");							
							}
						}else{
							mask = mask + "0";
							if( granPrevId[2] == 0 )
							{
								$('#chkCheckMgmtGran_14_1_'+ granPrevId[3]).attr('src',"static/images/icons/icon_unchecked.gif");
							}
							if( granPrevId[2] == 3 )
							{
								$('#chkCheckMgmtGran_14_5_'+ granPrevId[3]).attr('src',"static/images/icons/icon_unchecked.gif");
								$('#chkCheckMgmtGran_14_4_'+ granPrevId[3]).attr('src',"static/images/icons/icon_unchecked.gif");
							}
							if( granPrevId[2] == 6 )
							{
								$('#chkCheckMgmtGran_14_7_'+ granPrevId[3]).attr('src',"static/images/icons/icon_unchecked.gif");
								$('#chkCheckMgmtGran_14_8_'+ granPrevId[3]).attr('src',"static/images/icons/icon_unchecked.gif");
							}
							if( granPrevId[2] == 9 )
							{
								$('#chkCheckMgmtGran_14_10_'+ granPrevId[3]).attr('src',"static/images/icons/icon_unchecked.gif");
							}
						}
					}
					if( mask.charAt(1) == '1' )
					{
						mask = mask.replaceAt(0,"1");
					} // If View Paid Image is checked, then View Enq should checked automatically
					else if( mask.charAt(2) == '1' )
					{
						mask = mask.replaceAt(0,"1");
					}//  If View Cancel Stop Pay is checked then View Inquiry mask to be corrected
					else if( mask.charAt(3) == '1' )
					{
						mask = mask.replaceAt(0,"1");
					}
					else if( mask.charAt(4) == '1' || mask.charAt(5) == '1' )
					{
						mask = mask.replaceAt(3,"1");
					}
					else if( mask.charAt(6) == '1' )
					{
						mask = mask.replaceAt(0,"1");
					}					
					else if( mask.charAt(7) == '1' || mask.charAt(8) == '1' )
					{
						mask = mask.replaceAt(6,"1");
					}
					//If Advance Stop Pay is checked, then Create Enq and View Enq both boxes should get checked automatically.
					else if( mask.charAt(10) == '1'  )
					{
						mask = mask.replaceAt(0,"1");
						mask = mask.replaceAt(1,"1");
						mask = mask.replaceAt(6,"1");
						mask = mask.replaceAt(7,"1");
						mask = mask.replaceAt(9,"1");
					}
					else if( mask.charAt(0) == '0' )
					{
						mask = mask.replaceAt(1,"0");
					}
					else if( mask.charAt(3) == '0' )
					{
						mask = mask.replaceAt(4,"0");
						mask = mask.replaceAt(5,"0");
					}
					else if( mask.charAt(6) == '0' )
					{
						mask = mask.replaceAt(7,"0");
						mask = mask.replaceAt(8,"0");
					}
					else if( mask.charAt(9) == '0' )
					{
						mask = mask.replaceAt(10,"0");
					}
				}
				var cmdVersion = commandVersion + 1 ;
				commandVersion += 1 ;
				RolesApp.trigger('UpdateCKGRPermission', {
					commandName: "UpdateCKGRPermission",
					path: '/rolesApi/CheckManagement/GRPermissions',
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
			            digest :  $(this).data('digest'),
						commandVersion : cmdVersion
					}
				});
			}		
		},
		
		toggleAcc : function(){
			if($(this).length == 1){
				var accId = $(this).attr('id').split("_");
				CommonRole.updateStore(this, 'Accounts', 'chkAccount_','CheckManagement');
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('AddAccounts', {
						commandName: "AddAccounts",
						path: '/rolesApi/CheckManagement/Accounts',
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
						path: '/rolesApi/CheckManagement/Accounts',
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
				CommonRole.updateStore(this, 'Reports', 'chkRep_','CheckManagement');
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
	    			commandVersion += 1 ;
					RolesApp.trigger('AddReports', {
						commandName: "AddReports",
						path: '/rolesApi/CheckManagement/Reports',
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
						path: '/rolesApi/CheckManagement/Reports',
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
				CommonRole.updateStore(this, 'Alerts', 'chkAlert_','CheckManagement');
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
	    			commandVersion += 1 ;
					RolesApp.trigger('AddAlerts', {
						commandName: "AddAlerts",
						path: '/rolesApi/CheckManagement/Alerts',
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
						path: '/rolesApi/CheckManagement/Alerts',
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
		
		toggleChkMgmtCaret: function () {
			$('#chkMgmtGranularInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#chkMgmtGranularInfoDiv').slideToggle(200);
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
							path: '/rolesApi/CheckManagement/Permissions', 
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
				if(asset.assetId == "14"){
					$.each(asset.permissions,function(index,permission){
						var colIds = [];
						
						if(grCheckColumnMap.hasOwnProperty([permission.featureId+"-"+permission.screenWeight])){
							
							var colObj = grCheckColumnMap[permission.featureId+"-"+permission.screenWeight];
							colIds.push(colObj.view);
							colIds.push(colObj.edit);
							colIds.push(colObj.auth);
						}						
						
								
						$.each(colIds,function(index,colId){
							$('#grCheckCol_' + colId).removeClass('hidden');
							var elem = $('img[id^="chkCheckMgmtGran_14_' + colId + '_"]');
						
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
					$('img[id^="chkPrev"]').on('click',chkManagementItem.togglePrivi);
					
					$.each($('img[id^="chkPrevView"]'),function(index, obj){
						
						var cmdVersion = commandVersion + 1 ;
						commandVersion += 1 ;
						
						RolesApp.trigger('UpdatePermission', {
							commandName: "UpdatePermission", 
							path: '/rolesApi/CheckManagement/Permissions', 
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
						
						
						if(grCheckColumnMap.hasOwnProperty([$(this).data('featureid')+"-"+$(this).data('screenweight')])){
						var colIds = [];
						var colObj = grCheckColumnMap[$(this).data('featureid')+"-"+$(this).data('screenweight')];
						colIds.push(colObj.view);
						colIds.push(colObj.edit);
						colIds.push(colObj.auth);
						
						$.each(colIds,function(index,colId){
							$('#grCheckCol_' + colId).addClass('hidden');
							var elem = $('img[id^="chkCheckMgmtGran_14_' + colId + '_"]');
						
							$.each(elem,function(index,item){
								if($(this).attr('src') == "static/images/icons/icon_checked.gif"){
									$(this).attr('src',"static/images/icons/icon_unchecked.gif"); // Reset All CheckBoxes In that Column
									if($(this).length == 1){
										var granPrevId = $(this).attr('id').split("_"),view;
										var mask = "";
										
										//TODO : Hard coded Length 9 need to remove
										if(null != granPrevId){
											for(var i=0; i<11; i++){
												var flag = chkManagementItem.isChecked($('#chkCheckMgmtGran_14_'+ i +'_'+ granPrevId[3]).attr('src'));	
												
												if(flag){
													mask = mask + "1";
												}else{
													mask = mask + "0";
												}
											}
										}
										var cmdVersion = commandVersion + 1 ;
										commandVersion += 1 ;
										RolesApp.trigger('UpdateCKGRPermission', {
											commandName: "UpdateCKGRPermission",
											path: '/rolesApi/CheckManagement/GRPermissions',
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
						path: '/rolesApi/CheckManagement/Accounts', 
						kv: {	
							assetId : "14",
							assignAllAccounts : true,
							commandVersion : cmdVersion	
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					$('img[id^="chkAccount_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkAccount_"]').on('click',chkManagementItem.toggleAcc);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveAllAccounts', {
						commandName: "RemoveAllAccounts", 
						path: '/rolesApi/CheckManagement/Accounts', 
						kv: {	
							assetId : "14",
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
						path: '/rolesApi/CheckManagement/Reports', 
						kv: {	
							assetId : "14",
							assignAllReports : true,
				            commandVersion : cmdVersion
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					$('img[id^="chkRep_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkRep_"]').on('click',chkManagementItem.toggleRep);
					
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					
					RolesApp.trigger('RemoveAllReports', {
						commandName: "RemoveAllReports", 
						path: '/rolesApi/CheckManagement/Reports', 
						kv: {	
							assetId : "14",
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
						path: '/rolesApi/CheckManagement/Alerts', 
						kv: {	
							assetId : "14",
							assignAllAlerts : true,
				            commandVersion : cmdVersion
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					$('img[id^="chkAlert_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkAlert_"]').on('click',chkManagementItem.toggleAlert);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveAllAlerts', {
						commandName: "RemoveAllAlerts", 
						path: '/rolesApi/CheckManagement/Alerts', 
						kv: {	
							assetId : "14",
							assignAllAlerts : false,
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
			if(targetPanelId == "chkMgmtGranularInfoDiv"){
			
				for(var i=0;i<11;i++){
					if(!$("#grCheckCol_" + i).hasClass('hidden')){
						setBitPos += i + "," 
						$('img[id^="chkCheckMgmtGran_14_'+ i + '_"]').attr('src','static/images/icons/icon_checked.gif');
					}
				}
				
				
				if (setBitPos.endsWith(",")) {
					setBitPos = setBitPos.substring(0, setBitPos.length - 1);
				}
				console.log("Set Bits " + setBitPos);
				var cmdVersion = commandVersion + 1 ;
				commandVersion += 1 ;
				RolesApp.trigger('ApplyAllGRCK', {
					commandName: "ApplyAllGRCK",
					path: '/rolesApi/CheckManagement/GRPermissions',
					kv: {
						roleId : workingData.roleId,
						corpId : workingData.corporationId,
						assetId : "14",
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
			if(targetPanelId == "chkMgmtGranularInfoDiv"){
				for(var i=0;i<11;i++){
					if(!$("#grCheckCol_" + i).hasClass('hidden')){
						setBitPos += i + "," 
						$('img[id^="chkCheckMgmtGran_14_'+ i + '_"]').attr('src','static/images/icons/icon_unchecked.gif');
					}
				}
				
				if (setBitPos.endsWith(",")) {
					setBitPos = setBitPos.substring(0, setBitPos.length - 1);
				}
				console.log("Set Bits " + setBitPos);
				var cmdVersion = commandVersion + 1 ;
				commandVersion += 1 ;
				RolesApp.trigger('ApplyAllGRCheck', {
					commandName: "ApplyAllGRCheck",
					path: '/rolesApi/CheckManagement/GRPermissions',
					kv: {
						roleId : workingData.roleId,
						corpId : workingData.corporationId,
						assetId : "14",
						setBitPos : setBitPos,
						action : "removeAll",
						commandVersion : cmdVersion
					}
				});
			}
		},
		
		init: function () {
			console.log("CheckManagement Service Controller recieved");		
			
			$('img[id^="chkPrev"]').on('click',chkManagementItem.togglePrivi);
			$('img[id^="chkAccount_"]').on('click',chkManagementItem.toggleAcc);
			$('img[id^="chkCheckMgmtGran_"]').on('click',chkManagementItem.toggleChkMgmtGranular);
			
			$('img[id^="chkRep_"]').on('click',chkManagementItem.toggleRep);
			$('img[id^="chkAlert_"]').on('click',chkManagementItem.toggleAlert);
									
			$('#privilegesInfoCaret').on('click',chkManagementItem.togglePrivilegesCaret);	
			$('#reportsInfoCaret').on('click',chkManagementItem.toggleReportsCaret);	
			$('#alertsInfoCaret').on('click',chkManagementItem.toggleAlertsCaret);
			$('#accountsInfoCaret').on('click',chkManagementItem.toggleAccountsCaret);
			$('#chkMgmtGranularInfoCaret').on('click',chkManagementItem.toggleChkMgmtCaret);
			
			$('#expandAll').on('click',chkManagementItem.toggleExpandAll);
			$('#collapseAll').on('click',chkManagementItem.toggleCollapseAll);	

			$('#back').on('click',chkManagementItem.back);
			$('#reportsAll_14').on('click',chkManagementItem.toggleReportAll);
			$('#accountAll_14').on('click',chkManagementItem.toggleAccountAll);
			$('#alertsAll_14').on('click',chkManagementItem.toggleAlertAll);
			$('#prevAll_14').on('click',chkManagementItem.togglePermissionAll);		
			
			$('#permissionNext, #saveAndVerify').on('click', CommonRole.next);
			$('#btnCancelRoleEntry').on('click', CommonRole.cancel);
			$('#chkMgmtGranularInfoDiv').on( "contextmenu", chkManagementItem.rightClick );
			$('html').on( "click", chkManagementItem.removeRightClickMenu );
			$('#lblSelectAll').on( "click", chkManagementItem.selectAll );
			$('#lblDeselectAll').on( "click", chkManagementItem.deselectAll );
			
			$('label[id^="reportsAll_14"]').on('click', CommonRole.toggleLabelCheckUncheck);
			$('label[id^="accountAll_14"]').on('click', CommonRole.toggleLabelCheckUncheck);
			$('label[id^="alertsAll_14"]').on('click', CommonRole.toggleLabelCheckUncheck);
			$('label[id^="prevAll_14"]').on('click', CommonRole.toggleLabelCheckUncheck);
			
		}
	};

	RolesApp.bind('checkManagementServiceInit', chkManagementItem.init);
	
})(jQuery);