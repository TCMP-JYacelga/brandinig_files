/*global jQuery, RoleDetails */

(function ($) {
	'use strict';
	var semRepFlag = false,repFlag=false,nonRepFlag=false;
	var paymentItem = {

	
		
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
						view = paymentItem.isChecked($('#chkPrevView_'+prevId[1]+'_'+prevId[2]).attr('src'));
					else
						view = false;
					
					if($('#chkPrevEdit_'+prevId[1]+'_'+prevId[2]).attr('src') != undefined)
						edit = paymentItem.isChecked($('#chkPrevEdit_'+prevId[1]+'_'+prevId[2]).attr('src'));
					else
						edit = false;
					
					if($('#chkPrevAuth_'+prevId[1]+'_'+prevId[2]).attr('src') != undefined)
						auth = paymentItem.isChecked($('#chkPrevAuth_'+prevId[1]+'_'+prevId[2]).attr('src'));
					else
						auth = false;
				}
				
				var cmdVersion = commandVersion + 1 ;
				commandVersion += 1 ;
				RolesApp.trigger('UpdatePermission', {
					commandName: "UpdatePermission",
					path: '/rolesApi/Payments/Permissions',
					kv: {		
						   screenId: $(this).data('screenid'),
				           screenName: $(this).data('screenname'),
				           screenWeight:$(this).data('screenweight'),
				           featureid: $(this).data('featureid'),
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
				
				var isPayPriv = false,isTempPriv = false, isSIPri = false, isReversalPriv = false;
				
				if(grPaymentColumnMap.hasOwnProperty([$(this).data('featureid')+"-"+$(this).data('screenweight')]))
					isPayPriv= true;
				if(grSIColumnMap.hasOwnProperty([$(this).data('featureid')+"-"+$(this).data('screenweight')]))
					isSIPri = true;
				if(grReversalColumnMap.hasOwnProperty([$(this).data('featureid')+"-"+$(this).data('screenweight')]))
					isReversalPriv = true;
				if(grTemplateColumnMap.hasOwnProperty([$(this).data('featureid')+"-"+$(this).data('screenweight')]))
					isTempPriv = true;
				
				if(isPayPriv){
					paymentItem.showHidePayGranColumn($(this).data('featureid'),$(this).data('screenweight'),$(this).attr('src'),view,edit,auth);
				}
				
				if(isSIPri){
					paymentItem.showHideSIGranColumn($(this).data('featureid'),$(this).data('screenweight'),$(this).attr('src'),view,edit,auth);
				}
				
				if(isReversalPriv){
					paymentItem.showHideReversalGranColumn($(this).data('featureid'),$(this).data('screenweight'),$(this).attr('src'),view,edit,auth);
				}
				if(isTempPriv){
					paymentItem.showHideTemplateGranColumn($(this).data('featureid'),$(this).data('screenweight'),$(this).attr('src'),view,edit,auth);
				}
			CommonRole.checkSelectAll('chkPrev','prevAll');	
			}
		},		
		
		
		showHidePayGranColumn : function(featureid,screenweight,chkSrc,view,edit,auth){
			if(chkSrc.search("unchecked") != -1){
				
				if(grPaymentColumnMap.hasOwnProperty([featureid+"-"+screenweight])){
					var colIds = [];
					var colObj = grPaymentColumnMap[featureid+"-"+screenweight];
					
					if(!view && colObj.hasOwnProperty("view"))
						colIds.push(colObj.view);
					
					if(!edit && colObj.hasOwnProperty("edit"))
						colIds.push(colObj.edit);
					
					if(!auth && colObj.hasOwnProperty("auth"))
						colIds.push(colObj.auth);
					
					$.each(colIds,function(index,colId){
						$('#grPayCol_' + colId).addClass('hidden');
						var elem = $('img[id^="chkPayGran_02_' + colId + '_"]');
					
						$.each(elem,function(index,item){
							if($(this).attr('src') == "static/images/icons/icon_checked.gif"){
								$(this).attr('src',"static/images/icons/icon_unchecked.gif"); // Reset All CheckBoxes In that Column
								if($(this).length == 1){
									
									var granPrevId = $(this).attr('id').split("_"),view;
									var mask = "";

									//TODO : Hardcoded Length 09 need to remove
									if(null != granPrevId){
										for(var i=0; i<9; i++){
											var flag = paymentItem.isChecked($('#chkPayGran_02_'+i+'_'+ granPrevId[3] + '_' + granPrevId[4]).attr('src'));	
											
											if(flag){
												mask = mask + "1";
											}else{
												mask = mask + "0";
											}
										}
									}
									var cmdVersion = commandVersion + 1 ;
									commandVersion += 1 ;
									RolesApp.trigger('UpdatePaymentGRPermission', {
										commandName: "UpdatePaymentGRPermission",
										path: '/rolesApi/Payments/GRPermissions',
										kv: {
											mask: mask,
								            packageName : $(this).data('packagename'),
								            packageId: $(this).attr('data-packageid'),
								            accountNo: $(this).attr('data-accountno'),
								            accountId: $(this).attr('data-accountid'),
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
				if(grPaymentColumnMap.hasOwnProperty([featureid+"-"+screenweight])){
					var colIds = [];
					var colObj = grPaymentColumnMap[featureid+"-"+screenweight];
					
					if(view && colObj.hasOwnProperty("view"))
						colIds.push(colObj.view);
					
					if(edit && colObj.hasOwnProperty("edit"))
						colIds.push(colObj.edit);
					
					if(auth && colObj.hasOwnProperty("auth"))
						colIds.push(colObj.auth);
					
					$.each(colIds,function(index,colId){
						$('#grPayCol_' + colId).removeClass('hidden');
						var elem = $('img[id^="chkPayGran_02_' + colId + '_"]');
					
						$.each(elem,function(index,item){
							$(this).parents().eq(1).removeClass('hidden');
						});
					});
				}
			}
		
		},
		
		showHideSIGranColumn : function(featureid,screenweight,chkSrc,view,edit,auth){
			if(chkSrc.search("unchecked") != -1){
				
				if(grSIColumnMap.hasOwnProperty([featureid+"-"+screenweight])){
					var colIds = [];
					var colObj = grSIColumnMap[featureid+"-"+screenweight];
					
					if(!view && colObj.hasOwnProperty("view"))
						colIds.push(colObj.view);
					
					if(!edit && colObj.hasOwnProperty("edit"))
						colIds.push(colObj.edit);
					
					if(!auth && colObj.hasOwnProperty("auth"))
						colIds.push(colObj.auth);
					
					$.each(colIds,function(index,colId){
						$('#grSICol_' + colId).addClass('hidden');
						var elem = $('img[id^="chkSIGran_02_' + colId + '_"]');
					
						$.each(elem,function(index,item){
							if($(this).attr('src') == "static/images/icons/icon_checked.gif"){
								$(this).attr('src',"static/images/icons/icon_unchecked.gif"); // Reset All CheckBoxes In that Column
								if($(this).length == 1){
									
									var granPrevId = $(this).attr('id').split("_"),view;
									var mask = "";

									//TODO : Hardcoded Length 09 need to remove
									if(null != granPrevId){
										for(var i=0; i<6; i++){
											var flag = paymentItem.isChecked($('#chkSIGran_02_'+i+'_'+ granPrevId[3] + '_' + granPrevId[4]).attr('src'));	
											
											if(flag){
												mask = mask + "1";
											}else{
												mask = mask + "0";
											}
										}
									}
									var cmdVersion = commandVersion + 1 ;
									commandVersion += 1 ;
									RolesApp.trigger('UpdateSIGRPermission', {
										commandName: "UpdateSIGRPermission",
										path: '/rolesApi/Payments/SIGRPermissions',
										kv: {
											mask: mask,
								            packageName : $(this).data('packagename'),
								            packageId: $(this).attr('data-packageid'),
								            accountNo:$(this).attr('data-accountno'),
								            accountId: $(this).attr('data-accountid'),
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
				if(grSIColumnMap.hasOwnProperty([featureid+"-"+screenweight])){
					var colIds = [];
					var colObj = grSIColumnMap[featureid+"-"+screenweight];
					
					if(view && colObj.hasOwnProperty("view"))
						colIds.push(colObj.view);
					
					if(edit && colObj.hasOwnProperty("edit"))
						colIds.push(colObj.edit);
					
					if(auth && colObj.hasOwnProperty("auth"))
						colIds.push(colObj.auth);
					
					$.each(colIds,function(index,colId){
						$('#grSICol_' + colId).removeClass('hidden');
						var elem = $('img[id^="chkSIGran_02_' + colId + '_"]');
					
						$.each(elem,function(index,item){
							$(this).parents().eq(1).removeClass('hidden');
						});
					});
				}
			}
		
		},
		
		showHideReversalGranColumn : function(featureid,screenweight,chkSrc,view,edit,auth){
			if(chkSrc.search("unchecked") != -1){
				
				if(grReversalColumnMap.hasOwnProperty([featureid+"-"+screenweight])){
					var colIds = [];
					var colObj = grReversalColumnMap[featureid+"-"+screenweight];
					
					if(!view && colObj.hasOwnProperty("view"))
						colIds.push(colObj.view);
					
					if(!edit && colObj.hasOwnProperty("edit"))
						colIds.push(colObj.edit);
					
					if(!auth && colObj.hasOwnProperty("auth"))
						colIds.push(colObj.auth);
					
					$.each(colIds,function(index,colId){
						$('#grRevCol_' + colId).addClass('hidden');
						var elem = $('img[id^="chkReversalGran_02_' + colId + '_"]');
					
						$.each(elem,function(index,item){
							if($(this).attr('src') == "static/images/icons/icon_checked.gif"){
								$(this).attr('src',"static/images/icons/icon_unchecked.gif"); // Reset All CheckBoxes In that Column
								if($(this).length == 1){

									var granPrevId = $(this).attr('id').split("_"),view;
									var mask = "";

									//TODO : Hardcoded Length 03 need to remove
									if(null != granPrevId){
										for(var i=0; i<3; i++){
											var flag = paymentItem.isChecked($('#chkReversalGran_02_'+i+'_'+ granPrevId[3]).attr('src'));	
											
											if(flag){
												mask = mask + "1";
											}else{
												mask = mask + "0";
											}
										}
									}
									var cmdVersion = commandVersion + 1 ;
									commandVersion += 1 ;
									RolesApp.trigger('UpdateReversalGRPermission', {
										commandName: "UpdateReversalGRPermission",
										path: '/rolesApi/Payments/ReversalGRPermissions',
										kv: {
											mask: mask,
								            packageName : $(this).data('packagename'),
								            packageId: $(this).attr('data-packageid'),
								            accountNo: $(this).attr('data-accountno'),
								            accountId: $(this).attr('data-accountid'),
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
				if(grReversalColumnMap.hasOwnProperty([featureid+"-"+screenweight])){
					var colIds = [];
					var colObj = grReversalColumnMap[featureid+"-"+screenweight];
					
					if(view && colObj.hasOwnProperty("view"))
						colIds.push(colObj.view);
					
					if(edit && colObj.hasOwnProperty("edit"))
						colIds.push(colObj.edit);
					
					if(auth && colObj.hasOwnProperty("auth"))
						colIds.push(colObj.auth);
					
					$.each(colIds,function(index,colId){
						$('#grRevCol_' + colId).removeClass('hidden');
						var elem = $('img[id^="chkReversalGran_02_' + colId + '_"]');
					
						$.each(elem,function(index,item){
							$(this).parents().eq(1).removeClass('hidden');
						});
					});
				}
			}		
		},
		
		showHideTemplateGranColumn : function(featureid,screenweight,chkSrc,view,edit,auth){
			
			if($('#chkImgFeature_02_semiRepetitiveFlag').attr('src') == "static/images/icons/icon_checked.gif")
				semRepFlag = true;
			else
				semRepFlag = false;
			
			if($('#chkImgFeature_02_repetitiveFlag').attr('src') == "static/images/icons/icon_checked.gif")
				repFlag = true;
			else
				repFlag = false;
			
			if($('#chkImgFeature_02_nonRepetitiveFlag').attr('src') == "static/images/icons/icon_checked.gif")
				nonRepFlag = true;
			else
				nonRepFlag = false;
			
			if(chkSrc.search("unchecked") != -1){
				
				if(grTemplateColumnMap.hasOwnProperty([featureid+"-"+screenweight])){
					var colIds = [];
					var colObj = grTemplateColumnMap[featureid + "-" + screenweight];
					
					if(!view && colObj.hasOwnProperty("view")){
						var colPos = colObj.view.split(',');
						$.each(colPos,function(index,pos){
							if(colIds.indexOf(pos) == -1)
								colIds.push(pos);
						});
					}
					
					if(!edit && colObj.hasOwnProperty("edit")){
						var colPos = colObj.edit.split(',');
						$.each(colPos,function(index,pos){
							if(colIds.indexOf(pos) == -1)
								colIds.push(pos);
						});
					}
					
					if(!auth && colObj.hasOwnProperty("auth")){
						var colPos = colObj.auth.split(',');
						$.each(colPos,function(index,pos){
							if(colIds.indexOf(pos) == -1)
								colIds.push(pos);
						});
					}
					
					$.each(colIds,function(index,colId){
						if(repFlag && (colId == "3" || colId == "4" || colId == "5" || colId == "6" || colId == "7" || colId == "8")){
							$('#hdrType_' + colId).addClass('hidden');
							var elem = $('img[id^="chkTemplateGran_02_' + colId + '_"]');
						
							$.each(elem,function(index,item){
								if($(this).attr('src') == "static/images/icons/icon_checked.gif"){
									paymentItem.triggerTemplateGran($(this));
								}
								$(this).parents().eq(1).addClass('hidden');
							});							
						}
						
						if(semRepFlag &&  (colId == "9" || colId == "10" || colId == "11" || colId == "12" || colId == "13" || colId == "14")){
							$('#hdrType_' + colId).addClass('hidden');
							var elem = $('img[id^="chkTemplateGran_02_' + colId + '_"]');
						
							$.each(elem,function(index,item){
								if($(this).attr('src') == "static/images/icons/icon_checked.gif"){
									paymentItem.triggerTemplateGran($(this));
								}
								$(this).parents().eq(1).addClass('hidden');
							});							
						}
						
						if(nonRepFlag &&  (colId == "15" || colId == "16" || colId == "17" || colId == "18" || colId == "19" || colId == "20")){
							$('#hdrType_' + colId).addClass('hidden');
							var elem = $('img[id^="chkTemplateGran_02_' + colId + '_"]');
						
							$.each(elem,function(index,item){
								if($(this).attr('src') == "static/images/icons/icon_checked.gif"){
									paymentItem.triggerTemplateGran($(this));
								}
								$(this).parents().eq(1).addClass('hidden');
							});							
						}
					});
					
					var semRepColSpanCnt = 0,repColSpanCnt=0,nonRepColSpanCnt=0;
					var hdrElems = $('th[id^="hdrType_"]');
					
					$.each(hdrElems,function(index,hdrElem){
						if($(this).data('templatetype') == "rep" && !$(this).hasClass('hidden'))
							repColSpanCnt++;
						
						if($(this).data('templatetype') == "semiRep" && !$(this).hasClass('hidden'))
							semRepColSpanCnt++;
						
						if($(this).data('templatetype') == "nonRep" && !$(this).hasClass('hidden'))
							nonRepColSpanCnt++;

					});
					
					
					if(repFlag && repColSpanCnt > 0){
						$('#repHdr').addClass('hidden');
						$('#repHdr').attr('colspan',repColSpanCnt);
					}
					
					if(semRepFlag && semRepColSpanCnt > 0){
						$('#semRepHdr').addClass('hidden');
						$('#semRepHdr').attr('colspan',semRepColSpanCnt);
					}
					
					if(nonRepFlag && nonRepColSpanCnt > 0){
						$('#nonRepHdr').addClass('hidden');
						$('#nonRepHdr').attr('colspan',nonRepColSpanCnt);
					}
					
				}
			}else{
				if(grTemplateColumnMap.hasOwnProperty([featureid+"-"+screenweight])){
					var colIds = [];
					var colObj = grTemplateColumnMap[featureid+"-"+screenweight];
					
					if(view && colObj.hasOwnProperty("view")){
						var colPos = colObj.view.split(',');
						$.each(colPos,function(index,pos){
							if(colIds.indexOf(pos) == -1)
								colIds.push(pos);
						});
					}
					
					if(edit && colObj.hasOwnProperty("edit")){
						var colPos = colObj.edit.split(',');
						$.each(colPos,function(index,pos){
							if(colIds.indexOf(pos) == -1)
								colIds.push(pos);
						});
					}
					
					if(auth && colObj.hasOwnProperty("auth")){
						var colPos = colObj.auth.split(',');
						$.each(colPos,function(index,pos){
							if(colIds.indexOf(pos) == -1)
								colIds.push(pos);
						});
					}
					
					$.each(colIds,function(index,colId){
						if(repFlag && (colId == "3" || colId == "4" || colId == "5" || colId == "6" || colId == "7" || colId == "8")){
							$('#hdrType_' + colId).removeClass('hidden');
							var elem = $('img[id^="chkTemplateGran_02_' + colId + '_"]');
						
							$.each(elem,function(index,item){
								$(this).parents().eq(1).removeClass('hidden');
							});							
						}
						
						if(semRepFlag &&  (colId == "9" || colId == "10" || colId == "11" || colId == "12" || colId == "13" || colId == "14")){
							$('#hdrType_' + colId).removeClass('hidden');
							var elem = $('img[id^="chkTemplateGran_02_' + colId + '_"]');
						
							$.each(elem,function(index,item){
								$(this).parents().eq(1).removeClass('hidden');
							});							
						}
						
						if(nonRepFlag &&  (colId == "15" || colId == "16" || colId == "17" || colId == "18" || colId == "19" || colId == "20")){
							$('#hdrType_' + colId).removeClass('hidden');
							var elem = $('img[id^="chkTemplateGran_02_' + colId + '_"]');
						
							$.each(elem,function(index,item){
								$(this).parents().eq(1).removeClass('hidden');
							});							
						}
					});
					
					var semRepColSpanCnt = 0,repColSpanCnt=0,nonRepColSpanCnt=0;
					var hdrElems = $('th[id^="hdrType_"]');
					
					$.each(hdrElems,function(index,hdrElem){
						if($(this).data('templatetype') == "rep" && !$(this).hasClass('hidden'))
							repColSpanCnt++;
						
						if($(this).data('templatetype') == "semiRep" && !$(this).hasClass('hidden'))
							semRepColSpanCnt++;
						
						if($(this).data('templatetype') == "nonRep" && !$(this).hasClass('hidden'))
							nonRepColSpanCnt++;

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
			}		
		},
		
		triggerTemplateGran : function(ref){
			ref.attr('src',"static/images/icons/icon_unchecked.gif"); // Reset All CheckBoxes In that Column
			if(ref.length == 1){

				var granPrevId = ref.attr('id').split("_"),view;
				var mask = "";

				
				//TODO : Hardcoded Length 21 need to remove
				if(null != granPrevId){

					mask = mask + ref.data('mask').toString().substring(0,3);
					for(var i=3; i<21; i++){
						var flag = paymentItem.isChecked($('#chkTemplateGran_02_'+i+'_'+ granPrevId[3] + '_' + granPrevId[4]).attr('src'));	
						
						if(flag){
							mask = mask + "1";
						}else{
							mask = mask + "0";
						}
					}
				}
				var cmdVersion = commandVersion + 1 ;
				commandVersion += 1 ;
				RolesApp.trigger('UpdateTemplateGRPermission', {
					commandName: "UpdateTemplateGRPermission",
					path: '/rolesApi/Payments/TemplateGRPermissions',
					kv: {
						mask: mask,
			            packageName : ref.data('packagename'),
			            packageId: ref.attr('data-packageid'),
			            accountNo:ref.attr('data-accountno'),
			            accountId: ref.attr('data-accountid'),
			            accountName: ref.data('accountname'),
						assetId : ref.attr('data-assetid'),
			            gpermissionType: ref.data('gpermissiontype'),
			            obligatorId: ref.data('obligatorid'),
			            digest :  $(this).data('digest'),
						commandVersion : cmdVersion
					}
				});				
			}
		},		
		togglePaymentGranular : function(){
			if($(this).length == 1){
				var granPrevId = $(this).attr('id').split("_"),view;
				var mask = "";

				if($(this).attr('src').search("unchecked") != -1)
					$(this).attr('src',"static/images/icons/icon_checked.gif");
				else
					$(this).attr('src',"static/images/icons/icon_unchecked.gif")
				
				//TODO : Hardcoded Length 09 need to remove
				if(null != granPrevId){
					for(var i=0; i<9; i++){
						var flag = paymentItem.isChecked($('#chkPayGran_02_'+i+'_'+ granPrevId[3] + '_' + granPrevId[4]).attr('src'));	
						
						if(flag)
						{
							mask = mask + "1";
							mask = mask.replaceAt(0,"1");
							if( granPrevId[2] != "0" )
								$('#chkPayGran_02_0_'+granPrevId[3]+'_'+granPrevId[4]).attr('src',"static/images/icons/icon_checked.gif");
							if(i == 3)
							{
								mask = mask.replaceAt(1,"1");
								if( granPrevId[2] != "0" )
									$('#chkPayGran_02_1_'+granPrevId[3]+'_'+granPrevId[4]).attr('src',"static/images/icons/icon_checked.gif");
							}							
						}
						else
						{
							mask = mask + "0";
							if( granPrevId[2] == 0 )
							{
								for(var j=1;j<9;j++)
								{
									$('#chkPayGran_02_'+j+'_'+granPrevId[3]+'_'+granPrevId[4]).attr('src',"static/images/icons/icon_unchecked.gif");
									mask = mask.replaceAt(j,"0");
								}
							}
						}
					}
				}
				var cmdVersion = commandVersion + 1 ;
				commandVersion += 1 ;
				RolesApp.trigger('UpdatePaymentGRPermission', {
					commandName: "UpdatePaymentGRPermission",
					path: '/rolesApi/Payments/GRPermissions',
					kv: {
						mask: mask,
			            packageName : $(this).data('packagename'),
			            packageId: $(this).attr('data-packageid'),
			            accountNo: $(this).attr('data-accountno'),
			            accountId: $(this).attr('data-accountid'),
			            accountName: $(this).data('accountname'),
						assetId : $(this).attr('data-assetid'),
			            gpermissionType: $(this).data('gpermissiontype'),
			            obligatorId: $(this).data('obligatorid'),
						commandVersion : cmdVersion
					}
				});
			}		
		},
		
		
		toggleSIGranular : function(){
			if($(this).length == 1){
				var granPrevId = $(this).attr('id').split("_"),view;
				var mask = "";

				if($(this).attr('src').search("unchecked") != -1)
					$(this).attr('src',"static/images/icons/icon_checked.gif");
				else
					$(this).attr('src',"static/images/icons/icon_unchecked.gif")
				
				//TODO : Hardcoded Length 09 need to remove
				if(null != granPrevId){
					for(var i=0; i<6; i++){
						var flag = paymentItem.isChecked($('#chkSIGran_02_'+i+'_'+ granPrevId[3] + '_' + granPrevId[4]).attr('src'));	
						
						if(flag)
						{
							mask = mask + "1";
							mask = mask.replaceAt(0,"1");
							$('#chkSIGran_02_0_'+granPrevId[3]+'_'+granPrevId[4]).attr('src',"static/images/icons/icon_checked.gif");
						}
						else
						{
							mask = mask + "0";
							if( granPrevId[2] == 0 )
							{
								for(var j=1;j<6;j++)
								{
									$('#chkSIGran_02_'+j+'_'+granPrevId[3]+'_'+granPrevId[4]).attr('src',"static/images/icons/icon_unchecked.gif");
									mask = mask.replaceAt(j,"0");
								}
							}
						}
					}
				}
				var cmdVersion = commandVersion + 1 ;
				commandVersion += 1 ;
				RolesApp.trigger('UpdateSIGRPermission', {
					commandName: "UpdateSIGRPermission",
					path: '/rolesApi/Payments/SIGRPermissions',
					kv: {
						mask: mask,
			            packageName : $(this).data('packagename'),
			            packageId: $(this).attr('data-packageid'),
			            accountNo: $(this).attr('data-accountno'),
			            accountId: $(this).attr('data-accountid'),
			            accountName: $(this).data('accountname'),
						assetId : $(this).attr('data-assetid'),
			            gpermissionType: $(this).data('gpermissiontype'),
			            obligatorId: $(this).data('obligatorid'),
						commandVersion : cmdVersion
					}
				});
			}		
		},
		
		toggleReversalGranular : function(){
			if($(this).length == 1){
				var granPrevId = $(this).attr('id').split("_"),view;
				var mask = "";

				if($(this).attr('src').search("unchecked") != -1)
					$(this).attr('src',"static/images/icons/icon_checked.gif");
				else
					$(this).attr('src',"static/images/icons/icon_unchecked.gif")
				
				//TODO : Hardcoded Length 09 need to remove
				if(null != granPrevId){
					for(var i=0; i<3; i++){
						var flag = paymentItem.isChecked($('#chkReversalGran_02_'+i+'_'+ granPrevId[3]).attr('src'));	
						
						if(flag)
						{
							mask = mask + "1";
							if( granPrevId[2] == 1 || granPrevId[2] == 2 )
							{
								$('#chkReversalGran_02_0_'+granPrevId[3]).attr('src',"static/images/icons/icon_checked.gif");
								mask = mask.replaceAt(0,"1");
							}
						}else{
							mask = mask + "0";
							if( granPrevId[2] == 0 )
							{
								$('#chkReversalGran_02_1_'+granPrevId[3]).attr('src',"static/images/icons/icon_unchecked.gif");
								$('#chkReversalGran_02_2_'+granPrevId[3]).attr('src',"static/images/icons/icon_unchecked.gif");
								mask = mask.replaceAt(1,"0");
								mask = mask.replaceAt(2,"0");
							}
						}
					}
				}
				var cmdVersion = commandVersion + 1 ;
				commandVersion += 1 ;
				RolesApp.trigger('UpdateReversalGRPermission', {
					commandName: "UpdateReversalGRPermission",
					path: '/rolesApi/Payments/ReversalGRPermissions',
					kv: {
						mask: mask,
			            packageName : $(this).data('packagename'),
			            packageId: $(this).attr('data-packageid'),
			            accountNo: $(this).attr('data-accountno'),
			            accountId: $(this).attr('data-accountid'),
			            accountName: $(this).data('accountname'),
						assetId : $(this).attr('data-assetid'),
			            gpermissionType: $(this).data('gpermissiontype'),
			            obligatorId: $(this).data('obligatorid'),
						commandVersion : cmdVersion
					}
				});
			}		
		},
		
		toggleTemplateGranular : function(){

			if($(this).length == 1){
				var granPrevId = $(this).attr('id').split("_"),view;
				var mask = "";

				if($(this).attr('src').search("unchecked") != -1)
					$(this).attr('src',"static/images/icons/icon_checked.gif");
				else
					$(this).attr('src',"static/images/icons/icon_unchecked.gif")
				
				//TODO : Hardcoded Length 21 need to remove
				if(null != granPrevId){
					var start=22,end=0;
					mask = mask + $(this).data('mask').toString().substring(0,3);
					for(var i=3; i<21; i++){
						var flag = paymentItem.isChecked($('#chkTemplateGran_02_'+i+'_'+ granPrevId[3] + '_' + granPrevId[4]).attr('src'));	
						
						if(flag)
						{
							mask = mask + "1";
							if( granPrevId[2] >= 4 && granPrevId[2] <= 8 )
							{
								$('#chkTemplateGran_02_3_'+ granPrevId[3] + '_' + granPrevId[4]).attr('src',"static/images/icons/icon_checked.gif");
								mask = mask.replaceAt(3,"1");
							}
							else
							if( granPrevId[2] >= 10 && granPrevId[2] <= 14 )
							{
								$('#chkTemplateGran_02_9_'+ granPrevId[3] + '_' + granPrevId[4]).attr('src',"static/images/icons/icon_checked.gif");
								mask = mask.replaceAt(9,"1");
							}
							else
							if( granPrevId[2] >= 16 && granPrevId[2] <= 20 )
							{
								$('#chkTemplateGran_02_15_'+ granPrevId[3] + '_' + granPrevId[4]).attr('src',"static/images/icons/icon_checked.gif");
								mask = mask.replaceAt(15,"1");
							}
						}
						else
						{
							mask = mask + "0";
							start = 22,end=0;
							if( granPrevId[2] == 3 )
							{
								start = 4;
								end = 8;
							}
							else
							if( granPrevId[2] == 9 )
							{
								start = 10;
								end = 14;
							}
							else
							if( granPrevId[2] == 15 )
							{
								start = 16;
								end = 20;
							}
						}
					}
					for(var j=start;j<=end;j++)
					{
						$('#chkTemplateGran_02_'+j+'_'+ granPrevId[3] + '_' + granPrevId[4]).attr('src',"static/images/icons/icon_unchecked.gif");
						mask = mask.replaceAt(j,"0");
					}
				}
				var cmdVersion = commandVersion + 1 ;
				commandVersion += 1 ;
				RolesApp.trigger('UpdateTemplateGRPermission', {
					commandName: "UpdateTemplateGRPermission",
					path: '/rolesApi/Payments/TemplateGRPermissions',
					kv: {
						mask: mask,
			            packageName : $(this).data('packagename'),
			            packageId: $(this).attr('data-packageid'),
			            accountNo:$(this).attr('data-accountno'),
			            accountId: $(this).attr('data-accountid'),
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
                CommonRole.updateStore(this, 'Accounts', 'chkAccount_','Payments');
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('AddAccounts', {
						commandName: "AddAccounts",
						path: '/rolesApi/Payments/Accounts',
						kv: {						
							subsidiaryId: $(this).attr('data-subsidiaryid'),
							accountName: $(this).data('accountname'),
							accountId: $(this).attr('data-accountid'),
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
						path: '/rolesApi/Payments/Accounts',
						kv: {						
							subsidiaryId: $(this).attr('data-subsidiaryid'),
							accountName: $(this).data('accountname'),
							accountId: $(this).attr('data-accountid'),
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
                CommonRole.updateStore(this, 'Reports', 'chkRep_','Payments');
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('AddReports', {
						commandName: "AddReports",
						path: '/rolesApi/Payments/Reports',
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
						path: '/rolesApi/Payments/Report',
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
          		CommonRole.updateStore(this, 'Widgets', 'chkWidget_','Payments');
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('AddWidgets', {
						commandName: "AddWidgets",
						path: '/rolesApi/Payments/Widgets',
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
						path: '/rolesApi/Payments/Widgets',
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
		
		
		toggleAlert : function(){
			if($(this).length == 1){
				var alertId = $(this).attr('id').split("_"),view,edit,auth;
  				CommonRole.updateStore(this, 'Alerts', 'chkAlert_','Payments');
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('AddAlerts', {
						commandName: "AddAlerts",
						path: '/rolesApi/Payments/Alerts',
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
						path: '/rolesApi/Payments/Alerts',
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
		
		togglePackage : function(){
			if($(this).length == 1){
				var alertId = $(this).attr('id').split("_"),view,edit,auth;
                CommonRole.updateStore(this, 'Packages', 'chkPkg_','Payments');
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('AddPackages', {
						commandName: "AddPackages",
						path: '/rolesApi/Payments/Packages',
						kv: {						
								subsidiaryId:$(this).attr('data-subsidiaryid'),
								packageName: $(this).data('packagename'),
								packageId:$(this).attr('data-packageid'),
								subsidiaryName:$(this).data('subsidiaryname'),
								productCatType:$(this).data('productcattype'),
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
					RolesApp.trigger('RemovePackages', {
						commandName: "RemovePackages",
						path: '/rolesApi/Payments/Packages',
						kv: {						
								subsidiaryId:$(this).attr('data-subsidiaryid'),
								packageName: $(this).data('packagename'),
								packageId:$(this).attr('data-packageid'),
								subsidiaryName:$(this).data('subsidiaryname'),
								productCatType:$(this).data('productcattype'),
								assetId : $(this).attr('data-assetid'),
								digest :  $(this).data('digest'),
								assignedFlag : false,
								commandVersion : cmdVersion
						}
					});
				}
			CommonRole.checkSelectAll('chkPkg_','packagesAll');		
			}
		},
		
		toggleTemplate : function(){
			if($(this).length == 1){
				var alertId = $(this).attr('id').split("_"),view,edit,auth;
                CommonRole.updateStore(this, 'Templates', 'chkTemp_','Payments');
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('AddTemplates', {
						commandName: "AddTemplates",
						path: '/rolesApi/Payments/Templates',
						kv: {						
								subsidiaryId:$(this).attr('data-subsidiaryid'),
								templateId: $(this).data('templateid'),
								subsidiaryName:$(this).data('subsidiaryname'),
								templateName:$(this).data('templatename'),
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
					RolesApp.trigger('RemoveTemplates', {
						commandName: "RemoveTemplates",
						path: '/rolesApi/Payments/Templates',
						kv: {						
								subsidiaryId:$(this).attr('data-subsidiaryid'),
								templateId: $(this).data('templateid'),
								subsidiaryName:$(this).data('subsidiaryname'),
								templateName:$(this).data('templatename'),
								assetId : $(this).attr('data-assetid'),
								digest :  $(this).data('digest'),
								assignedFlag : false,
								commandVersion : cmdVersion
						}
					});
				}
			CommonRole.checkSelectAll('chkTemp_','templateAll');
			}
		
		},
		
		toggleCmpId : function(){
			if($(this).length == 1){
				var alertId = $(this).attr('id').split("_"),view,edit,auth;
	            CommonRole.updateStore(this, 'CompanyID', 'chkcmpId_','Payments');
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('AddCompanyID', {
						commandName: "AddCompanyId",
						path: '/rolesApi/Payments/CompanyID',
						kv: {						
								subsidiaryId:$(this).attr('data-subsidiaryid'),
								accountName: $(this).data('accountname'),
								accountId:$(this).attr('data-accountid'),
								accountNo:$(this).attr('data-accountno'),
								companyName:$(this).data('companyname'),
								subsidiaryName:$(this).data('subsidiaryname'),
								companyId:$(this).data('companyid'),
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
					RolesApp.trigger('RemoveCompanyID', {
						commandName: "RemoveCompanyId",
						path: '/rolesApi/Payments/CompanyID',
						kv: {						
								subsidiaryId:$(this).attr('data-subsidiaryid'),
								accountName: $(this).data('accountname'),
								accountId:$(this).attr('data-accountid'),
								accountNo:$(this).attr('data-accountno'),
								companyName:$(this).data('companyname'),
								subsidiaryName:$(this).data('subsidiaryname'),
								companyId:$(this).data('companyid'),
								assetId : $(this).attr('data-assetid'),
								digest :  $(this).data('digest'),
								assignedFlag : false,
								commandVersion : cmdVersion
						}
					});
					
				}
			CommonRole.checkSelectAll('chkcmpId_','companyIdAll');	
			}
		
		},
		
		toggleFeature : function(){
			if($(this).length == 1){
				var featureId = $(this).attr('id').split("_");

				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('AddFeatures', {
						commandName: "AddFeatures",
						path: '/rolesApi/Payments/Features',
						kv: {						
							featureId : $(this).data('featureid'),
							featureName : $(this).data('featurename'), 
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
					RolesApp.trigger('RemoveFeatures', {
						commandName: "RemoveFeatures",
						path: '/rolesApi/Payments/Features',
						kv: {						
							featureId : $(this).data('featureid'),
							featureName : $(this).data('featurename'), 
							assetId : $(this).attr('data-assetid'),
							digest :  $(this).data('digest'),
							assignedFlag : false,
							commandVersion : cmdVersion
						}
					});
				}
				
				if($('#chkImgFeature_02_semiRepetitiveFlag').attr('src') == "static/images/icons/icon_checked.gif")
					semRepFlag = true;
				else
					semRepFlag = false;
				
				if($('#chkImgFeature_02_repetitiveFlag').attr('src') == "static/images/icons/icon_checked.gif")
					repFlag = true;
				else
					repFlag = false;
				
				if($('#chkImgFeature_02_nonRepetitiveFlag').attr('src') == "static/images/icons/icon_checked.gif")
					nonRepFlag = true;
				else
					nonRepFlag = false;
				
				//Handling of template Granular 
				
				if(repFlag){
					var bits;
					var colIds = paymentItem.getColIds(grTemplateColumnMap);
					
					var colSpanCnt = 0;
					$.each(colIds,function(index,colId){
						if(colId == "3" || colId == "4" || colId == "5" || colId == "6" || colId == "7" || colId == "8"){
							colSpanCnt++;
							$('#hdrType_' + colId).removeClass('hidden');
							var elem = $('img[id^="chkTemplateGran_02_' + colId + '_"]');
						
							$.each(elem,function(index,item){
								$(this).parents().eq(1).removeClass('hidden');
							});							
						}
						
					});
					if(colSpanCnt > 1){
						$('#repHdr').removeClass('hidden');
						$('#repHdr').attr('colspan',colSpanCnt);
					}
				}else{
					$('#repHdr').addClass('hidden');
					$('#repHdr').attr('colspan','6'); //Setting it to default
					for(var colId=3;colId<9;colId++){
						$('#hdrType_' + colId).addClass('hidden');
						var elem = $('img[id^="chkTemplateGran_02_' + colId + '_"]');
						$.each(elem,function(index,item){
							$(this).parents().eq(1).addClass('hidden');
							
							if($(this).attr('src') == "static/images/icons/icon_checked.gif"){
								$(this).attr('src',"static/images/icons/icon_unchecked.gif");
								if($(this).attr('src') == "static/images/icons/icon_unchecked.gif"){
									//Trigger Update GR Command for that row
									
									var granPrevId = $(this).attr('id').split("_"),view;
									var mask = "";

									//TODO : Hardcoded Length 21 need to remove
									if(null != granPrevId){

										mask = mask + $(this).data('mask').toString().substring(0,3);
										for(var i=3; i<21; i++){
											var flag = paymentItem.isChecked($('#chkTemplateGran_02_'+i+'_'+ granPrevId[3] + '_' + granPrevId[4]).attr('src'));	
											
											if(flag){
												mask = mask + "1";
											}else{
												mask = mask + "0";
											}
										}
									}
									var cmdVersion = commandVersion + 1 ;
									commandVersion += 1 ;
									RolesApp.trigger('UpdateTemplateGRPermission', {
										commandName: "UpdateTemplateGRPermission",
										path: '/rolesApi/Payments/TemplateGRPermissions',
										kv: {
											mask: mask,
								            packageName : $(this).data('packagename'),
								            packageId: $(this).attr('data-packageid'),
								            accountNo:$(this).attr('data-accountno'),
								            accountId: $(this).attr('data-accountid'),
								            accountName: $(this).data('accountname'),
											assetId : $(this).attr('data-assetid'),
								            gpermissionType: $(this).data('gpermissiontype'),
								            obligatorId: $(this).data('obligatorid'),
								            digest :  $(this).data('digest'),
											commandVersion : cmdVersion
										}
									});
									//End of Command Trigger
								}
							}else{
								$(this).attr('src',"static/images/icons/icon_unchecked.gif");
							}
							
						});		
					}
				}
				
				if(semRepFlag){
					var bits;
					var colIds = paymentItem.getColIds(grTemplateColumnMap);
					var colSpanCnt = 0;
					$.each(colIds,function(index,colId){
						if(colId == "9" || colId == "10" || colId == "11" || colId == "12" || colId == "13" || colId == "14"){
							colSpanCnt++;
							$('#hdrType_' + colId).removeClass('hidden');
							var elem = $('img[id^="chkTemplateGran_02_' + colId + '_"]');
						
							$.each(elem,function(index,item){
								$(this).parents().eq(1).removeClass('hidden');
							});							
						}
						
					});
					
					if(colSpanCnt > 1){
						$('#semRepHdr').removeClass('hidden');
						$('#semRepHdr').attr('colspan',colSpanCnt);
					}
				}else{
					$('#semRepHdr').addClass('hidden');
					$('#semRepHdr').attr('colspan','6'); //Setting it to default
					for(var colId=9;colId<15;colId++){
						$('#hdrType_' + colId).addClass('hidden');
						var elem = $('img[id^="chkTemplateGran_02_' + colId + '_"]');
						$.each(elem,function(index,item){
							$(this).parents().eq(1).addClass('hidden');
							
							if($(this).attr('src') == "static/images/icons/icon_checked.gif"){
								$(this).attr('src',"static/images/icons/icon_unchecked.gif");
								if($(this).attr('src') == "static/images/icons/icon_unchecked.gif"){
									//Trigger Update GR Command for that row
									
									var granPrevId = $(this).attr('id').split("_"),view;
									var mask = "";

									//TODO : Hardcoded Length 21 need to remove
									if(null != granPrevId){

										mask = mask + $(this).data('mask').toString().substring(0,3);
										for(var i=3; i<21; i++){
											var flag = paymentItem.isChecked($('#chkTemplateGran_02_'+i+'_'+ granPrevId[3] + '_' + granPrevId[4]).attr('src'));	
											
											if(flag){
												mask = mask + "1";
											}else{
												mask = mask + "0";
											}
										}
									}
									var cmdVersion = commandVersion + 1 ;
									commandVersion += 1 ;
									RolesApp.trigger('UpdateTemplateGRPermission', {
										commandName: "UpdateTemplateGRPermission",
										path: '/rolesApi/Payments/TemplateGRPermissions',
										kv: {
											mask: mask,
								            packageName : $(this).data('packagename'),
								            packageId: $(this).attr('data-packageid'),
								            accountNo:$(this).attr('data-accountno'),
								            accountId: $(this).attr('data-accountid'),
								            accountName: $(this).data('accountname'),
											assetId : $(this).attr('data-assetid'),
								            gpermissionType: $(this).data('gpermissiontype'),
								            obligatorId: $(this).data('obligatorid'),
								            digest :  $(this).data('digest'),
											commandVersion : cmdVersion
										}
									});
									//End of Command Trigger
								}
							}else{
								$(this).attr('src',"static/images/icons/icon_unchecked.gif");
							}
							
						});		
					}
				}
				
				
				if(nonRepFlag){
					var bits;
					var colIds = paymentItem.getColIds(grTemplateColumnMap);
					
					var colSpanCnt = 0;
					$.each(colIds,function(index,colId){
						if(colId == "15" || colId == "16" || colId == "17" || colId == "18" || colId == "19" || colId == "20"){
							colSpanCnt++;
							$('#hdrType_' + colId).removeClass('hidden');
							var elem = $('img[id^="chkTemplateGran_02_' + colId + '_"]');
						
							$.each(elem,function(index,item){
								$(this).parents().eq(1).removeClass('hidden');
							});							
						}
						
					});
					if(colSpanCnt > 1){
						$('#nonRepHdr').removeClass('hidden');
						$('#nonRepHdr').attr('colspan',colSpanCnt);
					}
				}else{
					$('#nonRepHdr').addClass('hidden');
					$('#nonRepHdr').attr('colspan','6'); //Setting it to default
					for(var colId=15;colId<21;colId++){
						$('#hdrType_' + colId).addClass('hidden');
						var elem = $('img[id^="chkTemplateGran_02_' + colId + '_"]');
						$.each(elem,function(index,item){
							$(this).parents().eq(1).addClass('hidden');
							
							if($(this).attr('src') == "static/images/icons/icon_checked.gif"){
								$(this).attr('src',"static/images/icons/icon_unchecked.gif");
								if($(this).attr('src') == "static/images/icons/icon_unchecked.gif"){
									//Trigger Update GR Command for that row
									
									var granPrevId = $(this).attr('id').split("_"),view;
									var mask = "";

									//TODO : Hardcoded Length 21 need to remove
									if(null != granPrevId){

										mask = mask + $(this).data('mask').toString().substring(0,3);
										for(var i=3; i<21; i++){
											var flag = paymentItem.isChecked($('#chkTemplateGran_02_'+i+'_'+ granPrevId[3] + '_' + granPrevId[4]).attr('src'));	
											
											if(flag){
												mask = mask + "1";
											}else{
												mask = mask + "0";
											}
										}
									}
									var cmdVersion = commandVersion + 1 ;
									commandVersion += 1 ;
									RolesApp.trigger('UpdateTemplateGRPermission', {
										commandName: "UpdateTemplateGRPermission",
										path: '/rolesApi/Payments/TemplateGRPermissions',
										kv: {
											mask: mask,
								            packageName : $(this).data('packagename'),
								            packageId: $(this).attr('data-packageid'),
								            accountNo:$(this).attr('data-accountno'),
								            accountId: $(this).attr('data-accountid'),
								            accountName: $(this).data('accountname'),
											assetId : $(this).attr('data-assetid'),
								            gpermissionType: $(this).data('gpermissiontype'),
								            obligatorId: $(this).data('obligatorid'),
								            digest :  $(this).data('digest'),
											commandVersion : cmdVersion
										}
									});
									//End of Command Trigger
								}
							}else{
								$(this).attr('src',"static/images/icons/icon_unchecked.gif");
							}
							
						});		
					}
				}
			}
		},
		
		getColIds : function(map){
			var colIds = [];

			//Fetch Columns Positions From Working Data JSON
			$.each(workingData.assets[0].permissions,function(index,permission){
				if(map.hasOwnProperty([permission.featureId+"-"+permission.screenWeight])){
					
					var colObj = map[permission.featureId+"-"+permission.screenWeight];
					
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
			
			//Fetch Columns Positions From Recently Changed Privileges
			$.each(permissionStore,function(index,currentPermission){
				if(map.hasOwnProperty([currentPermission.kv.featureid+"-"+currentPermission.kv.screenWeight])){
					var colObj = map[currentPermission.kv.featureid+"-"+currentPermission.kv.screenWeight];
					if(colObj.hasOwnProperty("view")){
						var colPos = colObj.view.split(',');
						if(currentPermission.kv.view){
							$.each(colPos,function(index,pos){
								if(colIds.indexOf(pos) == -1)
									colIds.push(pos);
							});									
						}else{
							//If permission removed then remove column index which are previously added
	        				for(var i = 0; i < colPos.length; i++){
			        	        if(colPos.indexOf(colIds[i]) != -1) {
			        	        	colIds.splice(i,1);
			        	            i--; // Prevent skipping an item
			        	        }
	        				}
						}
					}
					
					if(colObj.hasOwnProperty("edit")){
						var colPos = colObj.edit.split(',');
						if(currentPermission.kv.edit){
							$.each(colPos,function(index,pos){
								if(colIds.indexOf(pos) == -1)
									colIds.push(pos);
							});
						}else{
							//If permission removed then remove column index which are previously added
	        				for(var i = 0; i < colPos.length; i++){
			        	        if(colPos.indexOf(colIds[i]) != -1) {
			        	        	colIds.splice(i,1);
			        	            i--; // Prevent skipping an item
			        	        }
	        				}
						}
					}
					
					if(colObj.hasOwnProperty("auth")){
						var colPos = colObj.auth.split(',');
						if(currentPermission.kv.auth){
							$.each(colPos,function(index,pos){
								if(colIds.indexOf(pos) == -1)
									colIds.push(pos);
							});
						}else{
							//If permission removed then remove column index which are previously added
	        				for(var i = 0; i < colPos.length; i++){
			        	        if(colPos.indexOf(colIds[i]) != -1) {
			        	        	colIds.splice(i,1);
			        	            i--; // Prevent skipping an item
			        	        }
	        				}
						}
						
					}
				}
			});
			return colIds;
		},
		
		
		togglePrivilegesCaret: function () {
			$('#privilegesInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#privilegesInfoDiv').slideToggle(200);
			return false;

		},
		
		togglePackagesCaret: function () {
			$('#packagesInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#packagesInfoDiv').slideToggle(200);
			return false;

		},

		toggleTemplatesCaret: function () {
			$('#templateInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#templateInfoDiv').slideToggle(200);
			return false;

		},
		
		toggleAccountsCaret: function () {
			$('#accountsInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#accountsInfoDiv').slideToggle(200);
			return false;

		},
		
		toggleCmpIdCaret: function () {
			$('#cmpIdInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#cmpIdInfoDiv').slideToggle(200);
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
		
		toggleFeatureCaret: function () {
			$('#featureInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#featureInfoDiv').slideToggle(200);
			return false;

		},
		
		togglePayGranularCaret: function () {
			$('#payGranularInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#payGranularInfoDiv').slideToggle(200);
			return false;
		},
		
		
		toggleSIGranularCaret: function () {
			$('#siGranularInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#siGranularInfoDiv').slideToggle(200);
			return false;
		},


		toggleReversalGranularCaret: function () {
			$('#reversalGranularInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#reversalGranularInfoDiv').slideToggle(200);
			return false;
		},
		
		toggleTemplateGranularCaret: function () {
			$('#templateGranularInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#templateGranularInfoDiv').slideToggle(200);
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
		
		toggleReportAll : function(){
			if($(this).length == 1){
				if($(this).attr('src').search("unchecked") != -1){
				//	$("#reportsInfoDiv").addClass("disable");
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkRep_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkRep_"]').off('click');
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('ApplyAllReports', {
						commandName: "ApplyAllReports", 
						path: '/rolesApi/Payments/Reports', 
						kv: {	
							assetId : "02",
							assignAllReports : true,
							commandVersion : cmdVersion
						}
					});
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
				//	$("#reportsInfoDiv").removeClass("disable");
					$('img[id^="chkRep_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkRep_"]').on('click',paymentItem.toggleRep);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveAllReports', {
						commandName: "RemoveAllReports", 
						path: '/rolesApi/Payments/Reports', 
						kv: {	
							assetId : "02",
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
			//		$("#widgetsInfoDiv").addClass("disable");
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkWidget_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkWidget_"]').off('click');
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('ApplyAllWidgets', {
						commandName: "ApplyAllWidgets", 
						path: '/rolesApi/Payments/Widgets', 
						kv: {	
							assetId : "02",
							assignAllWidgets : true,
							commandVersion : cmdVersion
						}
					});
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
				//	$("#widgetsInfoDiv").removeClass("disable");
					$('img[id^="chkWidget_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkWidget_"]').on('click',paymentItem.toggleWidget);
					
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveAllWidgets', {
						commandName: "RemoveAllWidgets", 
						path: '/rolesApi/Payments/Widgets', 
						kv: {	
							assetId : "02",
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
						path: '/rolesApi/Payments/Alerts', 
						kv: {	
							assetId : "02",
							assignAllAlerts : true,
							commandVersion : cmdVersion
						}
					});
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
		//			$("#alertsInfoDiv").removeClass("disable");
					$('img[id^="chkAlert_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkAlert_"]').on('click',paymentItem.toggleAlert);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveAllAlerts', {
						commandName: "RemoveAllAlerts", 
						path: '/rolesApi/Payments/Alerts', 
						kv: {	
							assetId : "02",
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
		//			$("#accountsInfoDiv").addClass("disable");
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkAccount_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkAccount_"]').off('click');
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('ApplyAllAccounts', {
						commandName: "ApplyAllAccounts", 
						path: '/rolesApi/Payments/Accounts', 
						kv: {	
							assetId : "02",
							assignAllAccounts : true,
							commandVersion : cmdVersion
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
				//	$("#accountsInfoDiv").removeClass("disable");
					$('img[id^="chkAccount_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkAccount_"]').on('click',paymentItem.toggleAcc);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveAllAccounts', {
						commandName: "RemoveAllAccounts", 
						path: '/rolesApi/Payments/Accounts', 
						kv: {	
							assetId : "02",
							assignAllAccounts : false,
							commandVersion : cmdVersion
						}
					});
				}
			}
		
		},
		
		toggleCmpIdAll : function(){
			if($(this).length == 1){
				if($(this).attr('src').search("unchecked") != -1){
			//		$("#cmpIdInfoDiv").addClass("disable");
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkcmpId_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkcmpId_"]').off('click');
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('ApplyAllCompanyID', {
						commandName: "ApplyAllCompanyIds", 
						path: '/rolesApi/Payments/CompanyID', 
						kv: {	
							assetId : "02",
							assignAllCompanyIds : true,
							commandVersion : cmdVersion
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
				//	$("#cmpIdInfoDiv").removeClass("disable");
					$('img[id^="chkcmpId_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkcmpId_"]').on('click',paymentItem.toggleCmpId);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveAllCompanyID', {
						commandName: "RemoveAllCompanyIds", 
						path: '/rolesApi/Payments/CompanyID', 
						kv: {	
							assetId : "02",
							assignAllCompanyIds : false,
							commandVersion : cmdVersion
						}
					});
				}
			}
		
		},
		togglePackageAll : function(){
			if($(this).length == 1){
				if($(this).attr('src').search("unchecked") != -1){
				//	$("#packagesInfoDiv").addClass("disable");
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkPkg_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkPkg_"]').off('click');
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('ApplyAllPackages', {
						commandName: "ApplyAllPackages", 
						path: '/rolesApi/Payments/Packages', 
						kv: {	
							assetId : "02",
							assignAllPackages : true,
							commandVersion : cmdVersion
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
			//		$("#packagesInfoDiv").removeClass("disable");
					$('img[id^="chkPkg_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkPkg_"]').on('click',paymentItem.togglePackage);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveAllPackages', {
						commandName: "RemoveAllPackages", 
						path: '/rolesApi/Payments/Packages', 
						kv: {	
							assetId : "02",
							assignAllPackages : false,
							commandVersion : cmdVersion
						}
					});
				}
			}
		
		},
		toggleTemplateAll : function(){
			if($(this).length == 1){
				if($(this).attr('src').search("unchecked") != -1){
				//	$("#templateInfoDiv").addClass("disable");
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkTemp_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkTemp_"]').off('click');
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('ApplyAllTemplates', {
						commandName: "ApplyAllTemplates", 
						path: '/rolesApi/Payments/Templates', 
						kv: {	
							assetId : "02",
							assignAllTemplates : true,
							commandVersion : cmdVersion
						}
					});
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
			//		$("#templateInfoDiv").removeClass("disable");
					$('img[id^="chkTemp_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkTemp_"]').on('click',paymentItem.toggleTemplate);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveAllTemplates', {
						commandName: "RemoveAllTemplates", 
						path: '/rolesApi/Payments/Templates', 
						kv: {	
							assetId : "02",
							assignAllTemplates : false,
							commandVersion : cmdVersion
						}
					});
				}
			}
		
		},
		
		togglePrivilegeAll : function(){
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
							path: '/rolesApi/Payments/Permissions',
							kv: {		
								   screenId: $(this).data('screenid'),
						           screenName: $(this).data('screenname'),
						           screenWeight:$(this).data('screenweight'),
						           featureid: $(this).data('featureid'),
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
					
					//display all granular columns
					$.each($('img[id^="chkPrevView"]'),function(index, obj){
					var isPayPriv = false,isTempPriv = false, isSIPri = false, isReversalPriv = false;
				
					if(grPaymentColumnMap.hasOwnProperty([$(this).data('featureid')+"-"+$(this).data('screenweight')]))
						isPayPriv= true;
					if(grSIColumnMap.hasOwnProperty([$(this).data('featureid')+"-"+$(this).data('screenweight')]))
						isSIPri = true;
					if(grReversalColumnMap.hasOwnProperty([$(this).data('featureid')+"-"+$(this).data('screenweight')]))
						isReversalPriv = true;
					if(grTemplateColumnMap.hasOwnProperty([$(this).data('featureid')+"-"+$(this).data('screenweight')]))
						isTempPriv = true;
					
					if(isPayPriv){
						paymentItem.showHidePayGranColumn($(this).data('featureid'),$(this).data('screenweight'),"static/images/icons/icon_checked.gif",true,true,true);
					}
					
					if(isSIPri){
						paymentItem.showHideSIGranColumn($(this).data('featureid'),$(this).data('screenweight'),"static/images/icons/icon_checked.gif",true,true,true);
					}
					
					if(isReversalPriv){
						paymentItem.showHideReversalGranColumn($(this).data('featureid'),$(this).data('screenweight'),"static/images/icons/icon_checked.gif",true,true,true);
					}
					if(isTempPriv){
						paymentItem.showHideTemplateGranColumn($(this).data('featureid'),$(this).data('screenweight'),"static/images/icons/icon_checked.gif",true,true,true);
					}					
					});
					//Granular ends
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
			//		$("#privilegesInfoDiv").removeClass("disable");
					$('img[id^="chkPrev"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkPrev"]').on('click',paymentItem.togglePrivi);
					
					$.each($('img[id^="chkPrevView"]'),function(index, obj){
						var cmdVersion = commandVersion + 1 ;
						commandVersion += 1 ;
						RolesApp.trigger('UpdatePermission', {
							commandName: "UpdatePermission",
							path: '/rolesApi/Payments/Permissions',
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
					
					//hide all granular columns
					$.each($('img[id^="chkPrevView"]'),function(index, obj){
					var isPayPriv = false,isTempPriv = false, isSIPri = false, isReversalPriv = false;
				
					if(grPaymentColumnMap.hasOwnProperty([$(this).data('featureid')+"-"+$(this).data('screenweight')]))
						isPayPriv= true;
					if(grSIColumnMap.hasOwnProperty([$(this).data('featureid')+"-"+$(this).data('screenweight')]))
						isSIPri = true;
					if(grReversalColumnMap.hasOwnProperty([$(this).data('featureid')+"-"+$(this).data('screenweight')]))
						isReversalPriv = true;
					if(grTemplateColumnMap.hasOwnProperty([$(this).data('featureid')+"-"+$(this).data('screenweight')]))
						isTempPriv = true;
					
					if(isPayPriv){
						paymentItem.showHidePayGranColumn($(this).data('featureid'),$(this).data('screenweight'),"static/images/icons/icon_unchecked.gif",false,false,false);
					}
					
					if(isSIPri){
						paymentItem.showHideSIGranColumn($(this).data('featureid'),$(this).data('screenweight'),"static/images/icons/icon_unchecked.gif",false,false,false);
					}
					
					if(isReversalPriv){
						paymentItem.showHideReversalGranColumn($(this).data('featureid'),$(this).data('screenweight'),"static/images/icons/icon_unchecked.gif",false,false,false);
					}
					if(isTempPriv){
						paymentItem.showHideTemplateGranColumn($(this).data('featureid'),$(this).data('screenweight'),"static/images/icons/icon_unchecked.gif",false,false,false);
					}
					});
					//Granular ends
				}
			}
		
		},
		
		isChecked : function(src){
			if(src.search("unchecked") != -1){
				return false;
			}else{
				return true;
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
			
			if(targetPanelId == "payGranularInfoDiv"){
				//Payment Granular Panel
				
				for(var i=0;i<9;i++){
					if(!$("#grPayCol_" + i).hasClass('hidden')){
						setBitPos += i + "," 
						$('img[id^="chkPayGran_02_'+ i + '_"]').attr('src','static/images/icons/icon_checked.gif');
					}
				}
				
				
				if (setBitPos.endsWith(",")) {
					setBitPos = setBitPos.substring(0, setBitPos.length - 1);
				}
				console.log("Set Bits " + setBitPos);
				var cmdVersion = commandVersion + 1 ;
				commandVersion += 1 ;
				RolesApp.trigger('ApplyAllGRPay', {
					commandName: "ApplyAllGRPay",
					path: '/rolesApi/Payments/GRPermissions',
					kv: {
						roleId : workingData.roleId,
						corpId : workingData.corporationId,
						assetId : "02",
						setBitPos : setBitPos,
						action : "applyAll",
						commandVersion : cmdVersion
					}
				});
				
				
			}else if(targetPanelId == "siGranularInfoDiv"){
				//SI Granular Panel  grSICol_0
				for(var i=0;i<6;i++){
					if(!$("#grSICol_" + i).hasClass('hidden')){
						setBitPos += i + "," 
						$('img[id^="chkSIGran_02_'+ i + '_"]').attr('src','static/images/icons/icon_checked.gif');
					}
				}
				
				if (setBitPos.endsWith(",")) {
					setBitPos = setBitPos.substring(0, setBitPos.length - 1);
				}
				console.log("Set Bits " + setBitPos);
				var cmdVersion = commandVersion + 1 ;
				commandVersion += 1 ;
				RolesApp.trigger('ApplyAllGRSI', {
					commandName: "ApplyAllGRSI",
					path: '/rolesApi/Payments/GRPermissions',
					kv: {
						roleId : workingData.roleId,
						corpId : workingData.corporationId,
						assetId : "02",
						setBitPos : setBitPos,
						action : "applyAll",
						commandVersion : cmdVersion
					}
				});
			}else if(targetPanelId == "reversalGranularInfoDiv"){
				//Reversal Granular Panel
				
				for(var i=0;i<3;i++){
					if(!$("#grRevCol_" + i).hasClass('hidden')){
						setBitPos += i + "," 
						$('img[id^="chkReversalGran_02_'+ i + '_"]').attr('src','static/images/icons/icon_checked.gif');
					}
				}
				
				if (setBitPos.endsWith(",")) {
					setBitPos = setBitPos.substring(0, setBitPos.length - 1);
				}
				console.log("Set Bits " + setBitPos);
				var cmdVersion = commandVersion + 1 ;
				commandVersion += 1 ;
				RolesApp.trigger('ApplyAllGRReversal', {
					commandName: "ApplyAllGRReversal",
					path: '/rolesApi/Payments/GRPermissions',
					kv: {
						roleId : workingData.roleId,
						corpId : workingData.corporationId,
						assetId : "02",
						setBitPos : setBitPos,
						action : "applyAll",
						commandVersion : cmdVersion
					}
				});
				
			}else if(targetPanelId == "templateGranularInfoDiv"){
				//Template Granular Panel
				for(var i=3;i<21;i++){
					if(!$("#hdrType_" + i).hasClass('hidden')){
						setBitPos += i + "," 
						$('img[id^="chkTemplateGran_02_'+ i + '_"]').attr('src','static/images/icons/icon_checked.gif');
					}
				}
				
				if (setBitPos.endsWith(",")) {
					setBitPos = setBitPos.substring(0, setBitPos.length - 1);
				}
				console.log("Set Bits " + setBitPos);
				var cmdVersion = commandVersion + 1 ;
				commandVersion += 1 ;
				RolesApp.trigger('ApplyAllGRTemplate', {
					commandName: "ApplyAllGRTemplate",
					path: '/rolesApi/Payments/GRPermissions',
					kv: {
						roleId : workingData.roleId,
						corpId : workingData.corporationId,
						assetId : "02",
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
			
			if(targetPanelId == "payGranularInfoDiv"){
				//Payment Granular Panel
				
				for(var i=0;i<9;i++){
					if(!$("#grPayCol_" + i).hasClass('hidden')){
						setBitPos += i + "," 
						$('img[id^="chkPayGran_02_'+ i + '_"]').attr('src','static/images/icons/icon_unchecked.gif');
					}
				}
				
				
				if (setBitPos.endsWith(",")) {
					setBitPos = setBitPos.substring(0, setBitPos.length - 1);
				}
				console.log("Set Bits " + setBitPos);
				var cmdVersion = commandVersion + 1 ;
				commandVersion += 1 ;
				RolesApp.trigger('ApplyAllGRPay', {
					commandName: "ApplyAllGRPay",
					path: '/rolesApi/Payments/GRPermissions',
					kv: {
						roleId : workingData.roleId,
						corpId : workingData.corporationId,
						assetId : "02",
						setBitPos : setBitPos,
						action : "removeAll",
						commandVersion : cmdVersion
					}
				});
				
				
			}else if(targetPanelId == "siGranularInfoDiv"){
				//SI Granular Panel  grSICol_0
				for(var i=0;i<6;i++){
					if(!$("#grSICol_" + i).hasClass('hidden')){
						setBitPos += i + "," 
						$('img[id^="chkSIGran_02_'+ i + '_"]').attr('src','static/images/icons/icon_unchecked.gif');
					}
				}
				
				if (setBitPos.endsWith(",")) {
					setBitPos = setBitPos.substring(0, setBitPos.length - 1);
				}
				console.log("Set Bits " + setBitPos);
				var cmdVersion = commandVersion + 1 ;
				commandVersion += 1 ;
				RolesApp.trigger('ApplyAllGRSI', {
					commandName: "ApplyAllGRSI",
					path: '/rolesApi/Payments/GRPermissions',
					kv: {
						roleId : workingData.roleId,
						corpId : workingData.corporationId,
						assetId : "02",
						setBitPos : setBitPos,
						action : "removeAll",
						commandVersion : cmdVersion
					}
				});
			}else if(targetPanelId == "reversalGranularInfoDiv"){
				//Reversal Granular Panel
				
				for(var i=0;i<3;i++){
					if(!$("#grRevCol_" + i).hasClass('hidden')){
						setBitPos += i + "," 
						$('img[id^="chkReversalGran_02_'+ i + '_"]').attr('src','static/images/icons/icon_unchecked.gif');
					}
				}
				
				if (setBitPos.endsWith(",")) {
					setBitPos = setBitPos.substring(0, setBitPos.length - 1);
				}
				console.log("Set Bits " + setBitPos);
				var cmdVersion = commandVersion + 1 ;
				commandVersion += 1 ;
				RolesApp.trigger('ApplyAllGRReversal', {
					commandName: "ApplyAllGRReversal",
					path: '/rolesApi/Payments/GRPermissions',
					kv: {
						roleId : workingData.roleId,
						corpId : workingData.corporationId,
						assetId : "02",
						setBitPos : setBitPos,
						action : "removeAll",
						commandVersion : cmdVersion
					}
				});
				
			}else if(targetPanelId == "templateGranularInfoDiv"){
				//Template Granular Panel
				for(var i=3;i<21;i++){
					if(!$("#hdrType_" + i).hasClass('hidden')){
						setBitPos += i + "," 
						$('img[id^="chkTemplateGran_02_'+ i + '_"]').attr('src','static/images/icons/icon_unchecked.gif');
					}
				}
				
				if (setBitPos.endsWith(",")) {
					setBitPos = setBitPos.substring(0, setBitPos.length - 1);
				}
				console.log("Set Bits " + setBitPos);
				var cmdVersion = commandVersion + 1 ;
				commandVersion += 1 ;
				RolesApp.trigger('ApplyAllGRTemplate', {
					commandName: "ApplyAllGRTemplate",
					path: '/rolesApi/Payments/GRPermissions',
					kv: {
						roleId : workingData.roleId,
						corpId : workingData.corporationId,
						assetId : "02",
						setBitPos : setBitPos,
						action : "removeAll",
						commandVersion : cmdVersion
					}
				});
				
			}	
		},
		
		init: function () {
			console.log("Admin Service Controller recieved");		
			
			$('img[id^="chkPrev"]').on('click',paymentItem.togglePrivi);
			$('img[id^="chkImgFeature"]').on('click',paymentItem.toggleFeature);
			$('img[id^="chkAccount_"]').on('click',paymentItem.toggleAcc);
			$('img[id^="chkAlert_"]').on('click',paymentItem.toggleAlert);
			$('img[id^="chkRep_"]').on('click',paymentItem.toggleRep);	
			$('img[id^="chkWidget_"]').on('click',paymentItem.toggleWidget);
			$('img[id^="chkPkg_"]').on('click',paymentItem.togglePackage);
			$('img[id^="chkTemp_"]').on('click',paymentItem.toggleTemplate);	
			$('img[id^="chkcmpId_"]').on('click',paymentItem.toggleCmpId);
			
			$('img[id^="chkPayGran_"]').on('click',paymentItem.togglePaymentGranular);
			$('img[id^="chkSIGran_"]').on('click',paymentItem.toggleSIGranular);
			$('img[id^="chkReversalGran_"]').on('click',paymentItem.toggleReversalGranular);
			$('img[id^="chkTemplateGran_"]').on('click',paymentItem.toggleTemplateGranular);
			
					
			$('#privilegesInfoCaret').on('click',paymentItem.togglePrivilegesCaret);	
			$('#packagesInfoCaret').on('click',paymentItem.togglePackagesCaret);	
			$('#templateInfoCaret').on('click',paymentItem.toggleTemplatesCaret);	
			$('#accountsInfoCaret').on('click',paymentItem.toggleAccountsCaret);	
			$('#cmpIdInfoCaret').on('click',paymentItem.toggleCmpIdCaret);	
			$('#alertsInfoCaret').on('click',paymentItem.toggleAlertsCaret);	
			$('#reportsInfoCaret').on('click',paymentItem.toggleReportsCaret);	
			$('#widgetsInfoCaret').on('click',paymentItem.toggleWidgetsCaret);	
			$('#featureInfoCaret').on('click',paymentItem.toggleFeatureCaret);
			$('#payGranularInfoCaret').on('click',paymentItem.togglePayGranularCaret);
			$('#siGranularInfoCaret').on('click',paymentItem.toggleSIGranularCaret);
			$('#reversalGranularInfoCaret').on('click',paymentItem.toggleReversalGranularCaret);
			$('#templateGranularInfoCaret').on('click',paymentItem.toggleTemplateGranularCaret);

			
			$('#expandAll').on('click',paymentItem.toggleExpandAll);
			$('#collapseAll').on('click',paymentItem.toggleCollapseAll);	
			
			$('#accountAll_02').on('click',paymentItem.toggleAccountAll);
			$('#reportsAll_02').on('click',paymentItem.toggleReportAll);
			$('#widgetsAll_02').on('click',paymentItem.toggleWidgetAll);
			$('#alertsAll_02').on('click',paymentItem.toggleAlertAll);
			
			$('#companyIdAll_02').on('click',paymentItem.toggleCmpIdAll);
			$('#packagesAll_02').on('click',paymentItem.togglePackageAll);
			$('#templateAll_02').on('click',paymentItem.toggleTemplateAll);
			$('#prevAll_02').on('click',paymentItem.togglePrivilegeAll);
			
			$('#permissionNext, #saveAndVerify').on('click', CommonRole.next);
			
			$('#payGranularInfoDiv').on( "contextmenu", paymentItem.rightClick );
			$('#siGranularInfoDiv').on( "contextmenu", paymentItem.rightClick );
			$('#reversalGranularInfoDiv').on( "contextmenu", paymentItem.rightClick );
			$('#templateGranularInfoDiv').on( "contextmenu", paymentItem.rightClick );
			$('html').on( "click", paymentItem.removeRightClickMenu );
			$('#lblSelectAll').on( "click", paymentItem.selectAll );
			$('#lblDeselectAll').on( "click", paymentItem.deselectAll );
			
			$('label[id^="templateAll_02"]').on('click', CommonRole.toggleLabelCheckUncheck);
			$('label[id^="companyIdAll_02"]').on('click', CommonRole.toggleLabelCheckUncheck);
			$('label[id^="reportsAll_02"]').on('click', CommonRole.toggleLabelCheckUncheck);
			
			$('label[id^="prevAll_02"]').on('click', CommonRole.toggleLabelCheckUncheck);
			$('label[id^="packagesAll_02"]').on('click', CommonRole.toggleLabelCheckUncheck);
			$('label[id^="widgetsAll_02"]').on('click', CommonRole.toggleLabelCheckUncheck);
			$('label[id^="alertsAll_02"]').on('click', CommonRole.toggleLabelCheckUncheck);
			$('label[id^="accountAll_02"]').on('click', CommonRole.toggleLabelCheckUncheck);
			$('label[id^="lblImgSrvc_"]').on('click', CommonRole.toggleLabelCheckUncheck);
		}
	};
	
	RolesApp.bind('paymentServiceInit', paymentItem.init);
	
})(jQuery);