/*global jQuery, RoleDetails */

(function ($) {
	'use strict';

	var LiquidityItem = {
		
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
						view = LiquidityItem.isChecked($('#chkPrevView_'+prevId[1]+'_'+prevId[2]).attr('src'));
					else
						view = false;
					
					if($('#chkPrevEdit_'+prevId[1]+'_'+prevId[2]).attr('src') != undefined)
						edit = LiquidityItem.isChecked($('#chkPrevEdit_'+prevId[1]+'_'+prevId[2]).attr('src'));
					else
						edit = false;
					
					if($('#chkPrevAuth_'+prevId[1]+'_'+prevId[2]).attr('src') != undefined)
						auth = LiquidityItem.isChecked($('#chkPrevAuth_'+prevId[1]+'_'+prevId[2]).attr('src'));
					else
						auth = false;
				}
				
				var cmdVersion = commandVersion + 1 ;
    			commandVersion += 1 ;
				RolesApp.trigger('UpdatePermission', {
					commandName: "UpdatePermission",
					path: '/rolesApi/Liquidity/Permissions',
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
			CommonRole.checkSelectAll('chkPrev','prevAll');
			}
		},
				
		toggleRep : function(){
			if($(this).length == 1){
				var repId = $(this).attr('id').split("_");
                CommonRole.updateStore(this, 'Reports', 'chkRep_','Liquidity');
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
	    			commandVersion += 1 ;
					RolesApp.trigger('AddReports', {
						commandName: "AddReports",
						path: '/rolesApi/Liquidity/Reports',
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
						path: '/rolesApi/Liquidity/Reports',
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
		
		toggleWidget : function(){
			if($(this).length == 1){
				var widgetId = $(this).attr('id').split("_");
                CommonRole.updateStore(this, 'Widgets', 'chkWidget_','Liquidity');
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
	    			commandVersion += 1 ;
					RolesApp.trigger('AddWidgets', {
						commandName: "AddWidgets",
						path: '/rolesApi/Liquidity/Widgets',
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
						path: '/rolesApi/Liquidity/Widgets',
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
		
		toggleNotionalAgreement : function(){
			if($(this).length == 1){
				var widgetId = $(this).attr('id').split("_");
    			CommonRole.updateStore(this, 'Notional', 'chkNotional_','Liquidity');
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
	    			commandVersion += 1 ;
					RolesApp.trigger('AddNotional', {
						commandName: "AddNotional",
						path: '/rolesApi/Liquidity/Agreements',
						kv: {	
							agreementCode :  $(this).data('agreementcode'),
							agreementName : $(this).data('agreementname'), 
							assetId : $(this).attr('data-assetid'),
							subsidiaryId:$(this).attr('data-subsidairyid'),
							subsidiaryName:$(this).data('subsidairyname'),
							digest :  $(this).data('digest'),
							assignedFlag : true,
				            commandVersion : cmdVersion
						}
					});
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif")
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveNotional', {
						commandName: "RemoveNotional",
						path: '/rolesApi/Liquidity/Agreements',
						kv: {						
							agreementCode :  $(this).data('agreementcode'),
							agreementName : $(this).data('agreementname'), 
							assetId : $(this).attr('data-assetid'),
							subsidiaryId:$(this).attr('data-subsidairyid'),
							subsidiaryName:$(this).data('subsidairyname'),
							digest :  $(this).data('digest'),
							assignedFlag : false,
				            commandVersion : cmdVersion
						}
					});
				}
			CommonRole.checkSelectAll('chkNotional_','agreementAll');
			}
		
		},
		
		toggleSweepAgreement : function(){
			if($(this).length == 1){
				var widgetId = $(this).attr('id').split("_");
                CommonRole.updateStore(this, 'Sweep', 'chkSweepAgreements_','Liquidity');
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
	    			commandVersion += 1 ;
					RolesApp.trigger('AddSweep', {
						commandName: "AddSweep",
						path: '/rolesApi/Liquidity/Agreements',
						kv: {	
							agreementCode :  $(this).data('agreementcode'),
							agreementName : $(this).data('agreementname'), 
							assetId : $(this).attr('data-assetid'),
							subsidiaryId:$(this).attr('data-subsidairyid'),
							subsidiaryName:$(this).data('subsidairyname'), 
							digest :  $(this).data('digest'),
							assignedFlag : true,
				            commandVersion : cmdVersion
						}
					});
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif")
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveSweep', {
						commandName: "RemoveSweep",
						path: '/rolesApi/Liquidity/Agreements',
						kv: {						
							agreementCode :  $(this).data('agreementcode'),
							agreementName : $(this).data('agreementname'),
							subsidiaryId:$(this).attr('data-subsidairyid'),
							subsidiaryName:$(this).data('subsidairyname'), 
							assetId : $(this).attr('data-assetid'),
							digest :  $(this).data('digest'),
							assignedFlag : false,
				            commandVersion : cmdVersion
						}
					});
				}
			CommonRole.checkSelectAll('chkSweepAgreements_','sweepAgreementAll');
			}
		
		},
		
		isChecked : function(src){
			if(src.search("unchecked") != -1){
				return false;
			}else{
				return true;
			}
		},
		
		
		
		togglePrivilegesCaret: function () {
			$('#privilegesInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#privilegesInfoDiv').slideToggle(200);
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
		
		toggleNotionalCaret: function () {
			$('#agreementInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#agreementInfoDiv').slideToggle(200);
			return false;

		},
		
		toggleSweepCaret: function () {
			$('#sweepAgreementInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#sweepAgreementInfoDiv').slideToggle(200);
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
							path: '/rolesApi/Liquidity/Permissions', 
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
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					$('img[id^="chkPrev"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkPrev"]').on('click',LiquidityItem.togglePrivi);
					
					$.each($('img[id^="chkPrevView"]'),function(index, obj){
						
						var cmdVersion = commandVersion + 1 ;
						commandVersion += 1 ;
						
						RolesApp.trigger('UpdatePermission', {
							commandName: "UpdatePermission", 
							path: '/rolesApi/Liquidity/Permissions', 
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
						path: '/rolesApi/Liquidity/Reports', 
						kv: {	
							assetId : "04",
							assignAllReports : true,
				            commandVersion : cmdVersion
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					$('img[id^="chkRep_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkRep_"]').on('click',LiquidityItem.toggleRep);
					
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					
					RolesApp.trigger('RemoveAllReports', {
						commandName: "RemoveAllReports", 
						path: '/rolesApi/Liquidity/Reports', 
						kv: {	
							assetId : "04",
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
				//	$("#widgetsInfoDiv").addClass("disable");
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkWidget_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkWidget_"]').off('click');
					
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					
					RolesApp.trigger('ApplyAllWidgets', {
						commandName: "ApplyAllWidgets", 
						path: '/rolesApi/Liquidity/Widgets', 
						kv: {	
							assetId : "04",
							assignAllWidgets : true,
				            commandVersion : cmdVersion
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					//$("#widgetsInfoDiv").removeClass("disable");
					$('img[id^="chkWidget_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkWidget_"]').on('click',LiquidityItem.toggleWidget);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveAllWidgets', {
						commandName: "RemoveAllWidgets", 
						path: '/rolesApi/Liquidity/Widgets', 
						kv: {	
							assetId : "04",
							assignAllWidgets : false,
				            commandVersion : cmdVersion
						}
					});
				}
			}
		
		},
		
		toggleNotionalAgreementAll : function(){
			if($(this).length == 1){
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkNotional_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkNotional_"]').off('click');
					
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					
					RolesApp.trigger('ApplyAllNotional', {
						commandName: "ApplyAllNotional", 
						path: '/rolesApi/Liquidity/Agreements', 
						kv: {	
							assetId : "04",
							assignAllNotionals : true,
				            commandVersion : cmdVersion
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					$('img[id^="chkNotional_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkNotional_"]').on('click',LiquidityItem.toggleNotionalAgreement);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveAllNotional', {
						commandName: "RemoveAllNotional", 
						path: '/rolesApi/Liquidity/Agreements', 
						kv: {	
							assetId : "04",
							assignAllNotionals : false,
				            commandVersion : cmdVersion
						}
					});
				}
			}
		
		},
		
		toggleSweepAgreementAll : function(){
			if($(this).length == 1){
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkSweepAgreements_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkSweepAgreements_"]').off('click');
					
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					
					RolesApp.trigger('ApplyAllSweep', {
						commandName: "ApplyAllSweep", 
						path: '/rolesApi/Liquidity/Agreements', 
						kv: {	
							assetId : "04",
							assignAllSweeps : true,
				            commandVersion : cmdVersion
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					$('img[id^="chkSweepAgreements_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkSweepAgreements_"]').on('click',LiquidityItem.toggleSweepAgreement);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveAllSweep', {
						commandName: "RemoveAllSweep", 
						path: '/rolesApi/Liquidity/Agreements', 
						kv: {	
							assetId : "04",
							assignAllSweeps : false,
				            commandVersion : cmdVersion
						}
					});
				}
			}
		
		},
		
		init: function () {
			console.log("Liquidity Service Controller recieved");		
			
			$('img[id^="chkPrev"]').on('click',LiquidityItem.togglePrivi);
			
			$('img[id^="chkRep_"]').on('click',LiquidityItem.toggleRep);
			$('img[id^="chkWidget_"]').on('click',LiquidityItem.toggleWidget);
			$('img[id^="chkNotional_"]').on('click',LiquidityItem.toggleNotionalAgreement);
			$('img[id^="chkSweepAgreements_"]').on('click',LiquidityItem.toggleSweepAgreement);
									
			$('#privilegesInfoCaret').on('click',LiquidityItem.togglePrivilegesCaret);	
			$('#reportsInfoCaret').on('click',LiquidityItem.toggleReportsCaret);	
			$('#widgetsInfoCaret').on('click',LiquidityItem.toggleWidgetsCaret);
			$('#agreementInfoCaret').on('click',LiquidityItem.toggleNotionalCaret);
			$('#sweepAgreementInfoCaret').on('click',LiquidityItem.toggleSweepCaret);
			
			$('#expandAll').on('click',LiquidityItem.toggleExpandAll);
			$('#collapseAll').on('click',LiquidityItem.toggleCollapseAll);	

			$('#back').on('click',LiquidityItem.back);
			$('#reportsAll_04').on('click',LiquidityItem.toggleReportAll);
			$('#prevAll_04').on('click',LiquidityItem.togglePermissionAll);	
			$('#widgetsAll_04').on('click',LiquidityItem.toggleWidgetAll);
			$('#agreementAll_04').on('click',LiquidityItem.toggleNotionalAgreementAll);
			$('#sweepAgreementAll_04').on('click',LiquidityItem.toggleSweepAgreementAll);
			
			$('#permissionNext, #saveAndVerify').on('click', CommonRole.next);
			$('#btnCancelRoleEntry').on('click', CommonRole.cancel);
			
			$('label[id^="reportsAll_04"]').on('click', CommonRole.toggleLabelCheckUncheck);
			$('label[id^="agreementAll_04"]').on('click', CommonRole.toggleLabelCheckUncheck);
			$('label[id^="sweepAgreementAll_04"]').on('click', CommonRole.toggleLabelCheckUncheck);
			
			$('label[id^="prevAll_04"]').on('click', CommonRole.toggleLabelCheckUncheck);
			$('label[id^="widgetsAll_04"]').on('click', CommonRole.toggleLabelCheckUncheck);
			
		}
	};

	RolesApp.bind('liquidityServiceInit', LiquidityItem.init);
	
})(jQuery);