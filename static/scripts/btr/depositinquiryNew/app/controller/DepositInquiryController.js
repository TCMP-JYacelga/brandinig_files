Ext
	.define(
		'GCP.controller.DepositInquiryController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'GCP.view.DepositInquiryGroupView', 'GCP.view.DepositInquiryFilterView','Ext.ux.gcp.DateHandler','Ext.ux.gcp.PageSettingPopUp'
			],
			views :
			[
				'GCP.view.DepositInquiryView'
			],
			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[	{
					ref : 'pageSettingPopUp',
					selector : 'pageSettingPopUp'
				},
				{
					ref : 'depositInquiryView',
					selector : 'depositInquiryView'
				},
				{
					ref : 'groupView',
					selector : 'depositInquiryView groupView'
				},
				{
					ref : 'depositInquiryGroupView',
					selector : 'depositInquiryView depositInquiryGroupView'
				},
				{
					ref : 'depositFilterView',
					selector : 'depositInquiryFilterView'
				},
				{
					ref : 'filterView',
					selector : 'filterView'
				},
				{
					ref : 'dateLabel',
					selector : 'depositInquiryFilterView label[itemId="depositDateLabel"]'
				},
				{
					ref : "filterButton",
					selector : "groupView button[itemId=filterButton]"
				}
			],
			config :
			{
				filterData : [],
				isGridDataLoad : false,
				statusVal : null,
				moduleVal : null,
				categoryVal : null,
				subCategoryVal : null,
				copyByClicked : '',
				activeFilter : null,
				typeFilterVal : 'all',
				filterApplied : 'ALL',
				showAdvFilterCode : null,
				actionFilterVal : 'all',
				actionFilterDesc : 'all',
				typeFilterDesc : 'all',
				dateFilterVal : '1',
				dateRangeFilterVal : '13',
				advDateFilterVal : '1',
				dateFilterFromVal : '',
				dateFilterToVal : '',
				dateFilterLabel : getLabel('today', 'Today'),
				advDateFilterFromVal : '',
				advDateFilterToVal : '',				
				advDateFilterLabel : getLabel('today', 'Today'),
				filterCodeValue : null,
				savePrefAdvFilterCode : null,
				urlGridPref : 'userpreferences/depositInq/gridView.srvc',
				//urlGridFilterPref : 'userpreferences/depositInq/gridViewFilter.srvc',
				urlGridFilterPref : 'services/userpreferences/depositInq.json',
				//commonPrefUrl : 'services/userpreferences/depositInq.json',
				strGetModulePrefUrl : 'services/userpreferences/depositInq/{0}.json',
				dateHandler : null,
				customizePopup : null,
				reportGridOrder : null,
				deptAccList : [],
				showClientFlag : false,
				showClearFlag : false,
				previouGrouByCode : null,
				SearchOrSave : false,
				arrSorter:[],
				datePickerSelectedDate : [],
				clientFilterVal : 'all',
				clientFilterDesc : getLabel('allCompanies', 'All companies'),
				savedFilterVal : '',
				preferenceHandler : null,
				strPageName : 'depositInq',
				postingDateFilterVal : '1',
				postingDateFilterLabel : getLabel('today', 'Today'),
				strDefaultMask : '0000000000',
				showPrefDate : true,
				sessionID :null,
				saveFilterChangeFlag : false,
				applyPageSettingFlag : false,
				filterDeleted : false
			},
			/**
			 * A template method that is called when your application boots. It
			 * is called before the Application's launch function is executed so
			 * gives a hook point to run any code before your Viewport is
			 * created.
			 */
			init : function()
			{
				var me = this;
				
				me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
				var date = new Date(Ext.Date.parse(dtApplicationDate, strExtApplicationDateFormat));
				clientFromDate = me.dateHandler.getDateBeforeDays(date,filterDays);
				me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
				
				GCP.getApplication().on(
				{
					callPopulateDepositImage : function( imageNmbr,depositTicketNmbr,sessionId, side )
					{
						me.populateDepositImage( imageNmbr ,depositTicketNmbr,sessionId, side);
					},
					callInstrumentPage : function( depositTicketNmbr,  sessionId)
					{
						me.goToInstrumentPage( depositTicketNmbr , sessionId);
					},
					callGetItems : function( depositTicketNmbr, depositAccount, postingDate )
					{
						me.getItems(depositTicketNmbr, depositAccount, postingDate);
					}
				} );
				
				$(document).on('handleSavedFilterClick', function(event) {
					me.sessionID = null;
					me.handleSavedFilterClick();
				});
				$(document).on('filterDateChange',function(event, filterType, btn, opts) {
					if(filterType == "postingDate"){
						 me.postingDateChange(btn,opts);
					 }
				});	

				$(document).on('performReportAction', function(event,actionName) {
					 me.handleReportAction(actionName);
				});
				
				$(document).on("datePickPopupSelectedDate",function(event, filterType, dates) {
					if (filterType == "postingDatePicker") {
						me.datePickerSelectedDate=dates;
						me.postingDateFilterVal = me.dateRangeFilterVal;
						me.postingDateFilterLabel = "Date Range";
						me.handlePostingDateChange(me.dateRangeFilterVal);
					}
				});
				$(document).on('handleClientChangeInQuickFilter',function(event,isSessionClientFilter) {
					me.handleClientChangeInQuickFilter(isSessionClientFilter);
				});
				$(document).on('saveAndSearchActionClicked', function() {
					me.sessionID = null;
					me.saveAndSearchActionClicked(me);
				});
				$(document).on('searchActionClicked', function() {
					me.searchActionClicked(me);
				});
				$(document).on('resetAllFieldsEvent', function() {
					me.resetAllFields();
					me.filterCodeValue=null;
				});
				$(document).on('viewFilterEvent', function(event, grid, rowIndex) {
					me.viewFilterData(grid, rowIndex);
				});
				$(document).on('editFilterEvent', function(event, grid, rowIndex) {
					me.editFilterData(grid, rowIndex);
				});
				$(document).on('deleteFilterEvent', function(event, filterCode) {
					me.deleteFilterSet(filterCode);
				});
				$(document).on('orderUpGridEvent',function(event, grid, rowIndex, direction) {
					me.orderUpDown(grid, rowIndex, direction)
				});
				$(document).on('savePreference', function(event) {
					me.disablePreferencesButton("clearPrefMenuBtn",false);
					me.handleSavePreferences();
				});
				$(document).on('clearPreference', function(event) {
					me.disablePreferencesButton("savePrefMenuBtn",true);
					me.handleClearPreferences();
				});
				$(document).on('performPageSettings', function(event) {
					me.showPageSettingPopup('PAGE');
				});
				
				this.dateHandler = Ext.create( 'Ext.ux.gcp.DateHandler' );
				me.updateFilterConfig();
				//me.updateAdvFilterConfig();

				me
					.control(
					{	'pageSettingPopUp' : 
						 {
							'applyPageSetting' : function(popup, data,strInvokedFrom) {
								me.applyPageSetting(data,strInvokedFrom);
							},
							'savePageSetting' : function(popup, data,strInvokedFrom) {
								me.savePageSetting(data,strInvokedFrom);
							},
							'restorePageSetting' : function(popup,data,strInvokedFrom) {
								me.restorePageSetting(data,strInvokedFrom);
							}
						},
						'depositInquiryView' :
						{
							beforerender : function( panel, opts )
							{
								//				me.loadDetailCount();
							},
							performReportAction : function( btn, opts )
							{
								//me.handleReportAction( btn, opts );
							}
						},
						'depositInquiryGroupView groupView' : {
							'groupByChange' : function(menu, groupInfo) {
								// me.doHandleGroupByChange(menu, groupInfo);
							},
							'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
									newCard, oldCard) {
								me.disablePreferencesButton("savePrefMenuBtn",false);
								me.disablePreferencesButton("clearPrefMenuBtn",false);	
								me.doHandleGroupTabChange(groupInfo, subGroupInfo,
										tabPanel, newCard, oldCard);
								me.setGridInfoSummary();
							},
							'gridRender' : function(groupInfo, subGroupInfo, grid, url, pgSize,
										newPgNo, oldPgNo, sorter, filterData) {					
									me.doHandleLoadGridData(groupInfo, subGroupInfo, grid, url, pgSize,
										newPgNo, oldPgNo, sorter, filterData);
									me.setGridInfoSummary();
									me.setSessionId(grid);
							},
							//'gridRender' : me.doHandleLoadGridData,
							'gridPageChange' : me.doHandleLoadGridData,
							'gridSortChange' : me.doHandleLoadGridData,
							'gridPageSizeChange' : me.doHandleLoadGridData,
							'gridColumnFilterChange' : me.doHandleLoadGridData,
							'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
							'gridStateChange' : function(grid) {
								//me.toggleSavePrefrenceAction(true);
							},
							'gridRowActionClick' : function(grid, rowIndex, columnIndex,
									actionName, record) {
								me.doHandleRowActions(actionName, grid, record);
							},
							'groupActionClick' : function(actionName, isGroupAction,
									maskPosition, grid, arrSelectedRecords) {
								/*if (isGroupAction === true)
									me.doHandleGroupActions(actionName, grid,
											arrSelectedRecords, 'groupAction');*/
							},
							'render' : function() {
								populateAdvancedFilterFieldValue();
								me.firstTime = true;
								if (objDepTicketPref) {
									var objJsonData = Ext.decode(objDepTicketPref);
									if (!Ext.isEmpty(objJsonData.d.preferences) && 'Y' == isMenuClicked) {
										if (!Ext
												.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
											if (!Ext
													.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
												var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
												me.doHandleSavedFilterItemClick(advData);
												me.savedFilterVal = advData;
												me.showPrefDate = false;
											}
										}
									}
								}
							},
							'gridSettingClick' : function(){
								me.showPageSettingPopup('GRID');
							},
							afterrender : function() {
								if (objGridViewPref) {
									//me.toggleSavePrefrenceAction(false);
									//me.toggleClearPrefrenceAction(true);
								}
							}
						},	
						'depositInquiryFilterView' :
						{
							beforerender : function() {
								var useSettingsButton = me.getFilterView()
										.down('button[itemId="useSettingsbutton"]');
								if (!Ext.isEmpty(useSettingsButton)) {
									useSettingsButton.hide();
								}
							},
							afterrender : function( panel, opts )
							{
								if(me.showPrefDate)
									me.handleDateChange(me.dateFilterVal);
							},
							handleSavedFilterItemClick : function(comboValue, comboDesc) {
								me.sessionID = null;
								me.saveFilterChangeFlag =true;
								me.doHandleSavedFilterItemClick(comboValue);
							},
							handleAccountChangeInQuickFilter : function(combo) {
								me.sessionID = null;
								me.handleAccountChangeInQuickFilter(combo);
							},
							dateChange : function(btn, opts) {
								me.sessionID = null;
								isMenuClicked = 'Y';
								me.dateFilterVal = btn.btnValue;
								me.dateFilterLabel = btn.text;
								me.advDateFilterVal = btn.btnValue;
								me.advDateFilterLabel = btn.text;
								me.postingDateFilterVal = btn.btnValue;
								me.postingDateFilterLabel = btn.text;
								me.handleDateChange(btn.btnValue);
								var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
								if (savedFilterCombobox) {
									savedFilterCombobox.getStore().reload();
									savedFilterCombobox.setValue("");
								}
								$("#msSavedFilter").val("");
								$("#msSavedFilter").multiselect("refresh");
								$('#filterCode').val("");
								$("#filterCodeLabel").removeClass("required");
								var saveFilterChkBox = $("input[type='checkbox'][id='saveFilterChkBox']");
									saveFilterChkBox.prop('checked', false);
								if($('#filterCode').hasClass('requiredField'))
								{
									$('#filterCode').removeClass('requiredField');
								}
								var errorSpan = $('#quickFilterErrorDiv');
								var combo = me.getDepositFilterView().down('combo[itemId="quickFilterAccountCombo"]');
								if(combo.getValue() == 'Select Account' || combo.getValue() == '')
								 {
									  errorSpan.removeClass('ui-helper-hidden');
									  $('#quickFilterErrorMessage').text("Please select Deposit Account");												 
								 }
								else
								 {
									if (btn.btnValue !== '7') {
										me.filterApplied = 'Q';
										me.setDataForFilter();
										me.applyQuickFilter();
										//me.toggleSavePrefrenceAction(true);
									}
								 }
							}
						},						
						'depositInquiryFilterView  combo[itemId="clientCombo"]' : {
							'select' : function(combo, record) {
								var errorSpan = $('#quickFilterErrorDiv');
								var quickFilterAccountCombo = me.getDepositFilterView().down('combo[itemId="quickFilterAccountCombo"]');
								var quickFilterDatePick = $('#depositDatePickerQuickText');
								
								if(quickFilterAccountCombo.getValue() == 'Select Account' && !Ext.isEmpty(quickFilterDatePick.val()) ){
									 
									  errorSpan.removeClass('ui-helper-hidden');
									  $('#quickFilterErrorMessage').text("Please select Deposit Account");												 
									  
								 }else if( Ext.isEmpty(quickFilterDatePick.val()) 
										 && (quickFilterAccountCombo.getValue() != 'Select Account' && Ext.isEmpty(quickFilterAccountCombo.getValue()) ) ){
									  
									  errorSpan.removeClass('ui-helper-hidden');
									  $('#quickFilterErrorMessage').text("Please select Posting Date");												 
								 
								}
								selectedFilterClientDesc = combo.getRawValue();
								selectedFilterClient = combo.getValue();
								selectedClientDesc = combo.getRawValue();
								$('#msClient').val(selectedFilterClient);
								changeClientAndRefreshGrid(combo.getValue(), combo.getRawValue());
							},
							'boxready' : function(combo, width, height, eOpts) {
								combo.setValue(combo.getStore().getAt(0));
							}
						},
						'depositInquiryFilterView combo[itemId="quickFilterAccountCombo"]' : {
							'afterrender' : function(combo, newValue, oldValue, eOpts) {
								if (!Ext.isEmpty(me.typeFilterVal) && me.typeFilterVal !== 'all') {
									combo.setValue(me.typeFilterVal);
								}else{
									combo.setValue(combo.getStore().getAt(0));
								}
							}
						},
						'depositInquiryFilterView combo[itemId="savedFiltersCombo"]' : {
							'afterrender' : function(combo, newValue, oldValue, eOpts) {
								if (!Ext.isEmpty(me.savedFilterVal)) {
									combo.setValue(me.savedFilterVal);
								}
							}
						},
						'depositInquiryFilterView component[itemId="depositDatePickerQuick"]' : {
							render : function() {
								$('#depositDatePickerQuickText').datepick({
									monthsToShow : 1,
									changeMonth : true,
									changeYear : true,
									rangeSeparator : '  to  ',
								//	withoutRange : true,
									rangeSelect: false,
									minDate : dtHistoryDate,
									onClose : function(dates) {
										me.sessionID = null;
										if (!Ext.isEmpty(dates)) {
											 var errorSpan = $('#quickFilterErrorDiv');
											 var quickFilterAccountCombo = me.getDepositFilterView().down('combo[itemId="quickFilterAccountCombo"]');
											 var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
												if (savedFilterCombobox) {
													savedFilterCombobox.getStore().reload();
													savedFilterCombobox.setValue("");
												}
												$("#msSavedFilter").val("");
												$("#msSavedFilter").multiselect("refresh");
												$('#filterCode').val("");
												$("#filterCodeLabel").removeClass("required");
												var saveFilterChkBox = $("input[type='checkbox'][id='saveFilterChkBox']");
													saveFilterChkBox.prop('checked', false);
												if($('#filterCode').hasClass('requiredField'))
												{
													$('#filterCode').removeClass('requiredField');
												}

											 	me.datePickerSelectedDate = dates;
												me.dateFilterVal = '13';
												me.dateFilterLabel = getLabel('daterange','Date Range');
												me.handleDateChange(me.dateFilterVal);
												me.handlePostingDateChange(me.dateFilterVal);
												if(Ext.isEmpty(quickFilterAccountCombo.getValue()) || quickFilterAccountCombo.getValue() == 'Select Account')
												{
													  errorSpan.removeClass('ui-helper-hidden');
													  $('#quickFilterErrorMessage').text("Please select Deposit Account");												 
												 }
												else
												{
													me.setDataForFilter();
													me.applyQuickFilter();
												}
										}
									},
									onSelect : function(dates) {
										me.sessionID = null;
										var dateArray = $(this).datepick('getDate');
										var dtSelectedDate = new Date(dateArray[0]);
										dtSelectedDate.setDate((dtSelectedDate.getDate()+parseInt(DateRangeDays,10)));							
										if(new Date(dateArray[1])>dtSelectedDate)
										{
											dtSelectedDate = $.datepicker.formatDate(localeDatePickerFormat,dtSelectedDate);
											var arrError = new Array();
											arrError.push({	"errorMessage" : "To Date should be less than or equal to "+dtSelectedDate});
											paintAdvancedFilterErrors('#quickFilterErrorDiv','#quickFilterErrorMessage',arrError);	
											$(this).datepick('setDate',new Date(dateArray[0]));
											blnHasError = true;
										}
										else
										{							
											if (!$('#quickFilterErrorDiv').hasClass('ui-helper-hidden') && !blnHasError)
											{
												$('#quickFilterErrorDiv').addClass('ui-helper-hidden');
											}					
											blnHasError = false;							
										}
									}/*,
									onChangeMonthYear: function(year, month) {
										$('.datepick-cmd.datepick-cmd-range').hide();
									},
									onShow: function(year, month) {
										$('.datepick-cmd.datepick-cmd-range').hide();
									}*/
								});
								if(!Ext.isEmpty(me.savedFilterVal)) {
									var entryDateLableVal = $('label[for="PostingDateLabel"]').text();
									var entryDateField = $("#postingDatePicker");
									me.handleEntryDateSync('A', entryDateLableVal, null, entryDateField);
								}
							}
						},
						'filterView' : {
							appliedFilterDelete : function(btn){
								me.sessionID = null;
								me.handleAppliedFilterDelete(btn);
								}
						},
						'filterView label[itemId="createAdvanceFilterLabel"]' : {
							'click' : function() {
								showAdvanceFilterPopup('depositInqFilter');
								/*Setting default postingdate as Today(Application date)*/
								var me = this;
								//me.resetAllFields();
								//me.postingDateFilterVal = '1';
								//me.postingDateFilterLabel =  getLabel('today', 'Today');
								//me.handlePostingDateChange('1');
								/*$('label[for="PostingDateLabel"]').text(getLabel('postingDate',
								'Posting Date'));*/
								me.assignSavedFilter();
							}
						},
						'filterView button[itemId="clearSettingsButton"]' : {
							'click' : function() {
								me.sessionID = null;
								isMenuClicked ='Y';
								strDateFilterVal='';
								me.handleClearSettings();
							}
						}						
					} );
			},
			doHandleRowActions : function(actionName, grid, record) {
				var me = this;
				if( actionName === 'btnView' )
				{
					getItems(record.get('depositTicketNmbr'), record.get('depositAccount'), record.get( 'postingDate'))
				}
				if( actionName === 'btnCheckImg' )
				{
					var side= 'F';
					getPopulateDepositImage( record.get( 'depImgNmbr' ), record.get( 'depositTicketNmbr' ),record.get('sessionId'), side );
				}				
			},			
			populateDepositImage : function( imageNmbr,depositTicketNmbr,sessionId, side)
			{
				var me = this;
				if(daejaViewONESupport)
				{
					me.showDepositImageDaejaViewONE(imageNmbr,depositTicketNmbr,sessionId,side);
				}
				else
				{
					me.showDepositImageJqueryPopup(imageNmbr,depositTicketNmbr,sessionId, side);
				}
			},
			
			showDepositImageDaejaViewONE : function( imageNmbr,depositTicketNmbr,sessionId, side)
			{
				$(document).ajaxStart($.blockUI({message: '<h2><img src="static/images/backgrounds/busy.gif" class="middleAlign"/>&nbsp;Please wait...</h2>',
					css:{ height:'32px',padding:'8px 0 0 0'}})).ajaxStop($.unblockUI);
				
				var me = this;
				var strUrl = 'depositInq/getDepositImage.srvc?$isDaejaViewer=Y&'+csrfTokenName + '=' + csrfTokenValue+'&identifier=' +''+'&$hostImageKey='+imageNmbr+'&$side='+side+'&$imgType=T'+'&$depositTicketNmbr='+depositTicketNmbr+'&$sessionId='+sessionId;
				if(document.getElementById("viewONE"))
				{
					document.getElementById("viewONE").setView(3);
					document.getElementById("viewONE").openFile(strUrl, 1);
				}
				else
				{
					addViewer('depImageDiv', strUrl);
				}
				$( '#depImageDiv' ).dialog(
				{
					autoOpen : false,
					//height : "auto",
					height : "800",
					modal : true,
					resizable : false,
					draggable: false,
					//width : "auto",
					width : "1000",
					title : 'Image',
					position: 'center',
					buttons :
					{
						"Close" : function()
						{
							$( this ).dialog( "close" );
						}
					},
					open: function() {
						$("div[class*='ui-dialog-buttonset']").removeClass('ui-dialog-buttonset');
						$('.ui-dialog-buttonpane').find('button:contains("Close")').removeClass('ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only');
						$('.ui-dialog-buttonpane').find('button:contains("Close")').addClass('ft-button ft-button-primary');
						$('.ui-dialog-buttonpane').find('button:contains("Close")').attr('onkeydown','restrictTabKey(event)');
					},
					close: function( event, ui ) {
						$.unblockUI();
					},
					open: function( event, ui ) {
						$.unblockUI();
    				}
				} );
				$( '#depImageDiv' ).dialog( 'open' );
			},
			showDepositImageJqueryPopup : function( imageNmbr,depositTicketNmbr,sessionId, side )
			{
				/*$(document).ajaxStart($.blockUI({message:'<h2><class="middleAlign"/>&nbsp;Loading...</h2>', timeout:10000,css:{ height:'32px',padding:'8px 0 0 0'}})).ajaxStop($.unblockUI);*/
				var me = this;
				me.getDepositInquiryGroupView().setLoading( true );
				var strUrl = 'depositInq/getDepositImage.srvc?'+csrfTokenName + '=' + csrfTokenValue+'&identifier=' +''+'&$hostImageKey='+imageNmbr+'&$side='+side+'&$imgType=T'+'&$depositTicketNmbr='+depositTicketNmbr+'&$sessionId='+sessionId;
				//var strUrl = 'getDepositImage.srvc?$imageNmbr=' + imageNmbr + '&' + csrfTokenName + "="
				//	+ csrfTokenValue;
				$.ajax(
				{
					type : 'POST',
					//data : JSON.stringify( arrayJson ),
					url : strUrl,
					//contentType : "application/json",
					dataType : 'html',
					success : function( data )
					{
						//$.unblockUI();
						me.getDepositInquiryGroupView().setLoading( false );
						var $response = $( data );

						if( $response.find( '#imageAppletDiv' ).length == 0 )
						{
							$( '#depImageDiv' ).html( '<img src="data:image/jpeg;base64,' + data + '"/>' );
						}
						else
						{
							$( '#depImageDiv' ).html( $response.find( '#imageAppletDiv' ) );
						}

						$( '#depImageDiv' ).dialog(
						{
							bgiframe : true,
							autoOpen : false,
							//height : "auto",
							height : "700",
							modal : true,
							resizable : false,
							draggable: false,
							//width : "auto",
							width : "1200",
							title : 'Image',
							//dialogClass: 'ft-dialog',
							buttons :
							{
								"Close" : function()
								{
									$( this ).dialog( "close" );
								},
								"Print" : function()
								{
									var strFrontUrl = 'depositInq/getDepositImage.srvc?'+csrfTokenName + '=' + csrfTokenValue+
									'&identifier=' +''+'&$hostImageKey='+imageNmbr+'&$side=F'+'&$imgType=T'+
									'&$depositTicketNmbr='+depositTicketNmbr+'&$sessionId='+sessionId;
									var strBackUrl = 'depositInq/getDepositImage.srvc?'+csrfTokenName + '=' + csrfTokenValue+
									'&identifier=' +''+'&$hostImageKey='+imageNmbr+'&$side=B'+'&$imgType=T'+
									'&$depositTicketNmbr='+depositTicketNmbr+'&$sessionId='+sessionId;
									printFrontImage(strFrontUrl,strBackUrl);
								},
								"Flip Over" : function()
								{
									if(modelBytes=='Front')
									{
										$( this ).dialog( "close" );
										me.populateDepositImage(imageNmbr ,depositTicketNmbr,sessionId, 'B' );
										modelBytes = 'Back';
									 }
									 else
									 {
										$( this ).dialog( "close" );
										me.populateDepositImage(imageNmbr ,depositTicketNmbr,sessionId, 'F');
										modelBytes = 'Front';
									 }
								}
							},
							open: function() {
								$('.ui-dialog-buttonpane').find('button:contains("Flip Over")').css('color','#4a4a4a')
        						.css('background-color','#FFF').css('margin-left','10px').css('border','1px solid #4a4a4a')
								.css('float','right');
								$('.ui-dialog-buttonpane').find('button:contains("Print")').css('color','#4a4a4a')
        						.css('background-color','#FFF').css('margin-left','10px').css('border','1px solid #4a4a4a')
								.css('float','right');
								$('.ui-dialog-buttonpane').find('button:contains("Close")').css('float','left');
								
								$('.ui-dialog-buttonpane').find('button:contains("Close")').focus();
								$('.ui-dialog-buttonpane').find('button:contains("Close")').attr('tabindex','1');
								$('.ui-dialog-buttonpane').find('button:contains("Print")').attr('tabindex','1');
								$('#depImageDiv').parent().find(".ui-dialog-buttonpane").attr('id','depImageButtonDiv');
								$('.ui-dialog-buttonpane').find('button:contains("Print")').focus(function(){
									$(this).css('box-shadow','#4a4a4a 1px 1px 0px 0px');
								});
								$('.ui-dialog-buttonpane').find('button:contains("Print")').mouseover(function(){
									$(this).css('box-shadow','#4a4a4a 1px 1px 0px 0px');
								});
								$('.ui-dialog-buttonpane').find('button:contains("Print")').blur(function(){
									$(this).css('box-shadow','none');
								});
								$('.ui-dialog-buttonpane').find('button:contains("Print")').mouseout(function(){
									$(this).css('box-shadow','none');
								});
								$('.ui-dialog-buttonpane').find('button:contains("Flip Over")').attr('tabindex','1').attr('onkeydown','autoFocusOnFirstElement(event, "depImageButtonDiv", false);');								
							}
						} );
						$( '#dialogMode' ).val( '1' );
						$( '#depImageDiv' ).dialog( 'open' );
					},
					error : function( request, status, error )
					{
						//$.unblockUI();
						me.getDepositInquiryGroupView().setLoading( false );
						$( '#depImageDiv' ).html( '<img src="./static/images/misc/no_image.jpg"/>' );
						$( '#depImageDiv' ).dialog(
						{
							bgiframe : true,
							autoOpen : false,
							height : "340",
							modal : true,
							resizable : false,
							draggable: false,
							width : "300",
							zIndex: '29001',				
							title : 'Image',
							buttons : 
							{
								"Close" : function()
								{
									$( this ).dialog( "close" );
								}
							},
							open: function() {
								 $("div[class*='ui-dialog-buttonset']").removeClass('ui-dialog-buttonset');                                
								$('.ui-dialog-buttonpane').find('button:contains("Close")').removeClass('ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only');
                                $('.ui-dialog-buttonpane').find('button:contains("Close")').addClass('ft-button ft-button-primary');
								$('.ui-dialog-buttonpane').find('button:contains("Close")').attr('onkeydown','restrictTabKey(event)');
								$('.ui-dialog-buttonpane').find('button:contains("Close")').attr('tabindex','1');
								$('.ui-dialog-buttonpane').find('button:contains("Close")').css('float','left').focus();
							}
						} );
						$( '#dialogMode' ).val( '1' );
						$( '#depImageDiv' ).dialog( 'open' );					
					}
				} );
			},

			goToInstrumentPage : function( depositTicketNmbr, sessionId )
			{
				var me = this;
				var form;
				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'GET';
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'isMenuClicked', 'N' ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'depositTicketNmbr', depositTicketNmbr ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'sessionId', sessionId ) );				
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'dateFilterVal', me.dateFilterVal ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'dateFilterLabel', me.dateFilterLabel ) );				
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'ticketFromDate', ticketFromDate ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'ticketToDate', ticketToDate ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'depositTicketOperator', ticketOperator ) );
				form.action = "instrumentInquiry.srvc";
				document.body.appendChild( form );
				form.submit();
				document.body.removeChild( form );
			},
			getItems : function(depositTicketNmbr, depositAccount, postingDate)
			{
				var me = this;
				var form;
				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'GET';
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'isMenuClicked', 'N' ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'depositTicketNmbr', depositTicketNmbr ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'depositAccount', depositAccount) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'postingDate', postingDate) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'dateFilterVal', me.dateFilterVal ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'dateFilterLabel', me.dateFilterLabel ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'ticketFromDate', ticketFromDate ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'ticketToDate', ticketToDate ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'depositTicketOperator', ticketOperator ) );
				form.action = "instrumentInquiry.srvc";
				document.body.appendChild( form );
				form.submit();
				document.body.removeChild( form );
			},

			createFormField : function( element, type, name, value )
			{
				var inputField;
				inputField = document.createElement( element );
				inputField.type = type;
				inputField.name = name;
				inputField.value = value;
				return inputField;
			},			 
			doHandleSavedFilterItemClick : function(filterCode) {
				var me = this;
				if (!Ext.isEmpty(filterCode)) {
					me.resetAllFields();
					me.getSavedFilterData(filterCode, this.populateSavedFilter, true);
				}
				var postingDateLableVal = $('label[for="PostingDateLabel"]').text();
				var postingDateField = $("#postingDatePicker");		
				me.handleEntryDateSync('A', postingDateLableVal, null, postingDateField);
				var sel = document.getElementById("depositAccount");
				var depositAccountVal = sel.options[sel.selectedIndex].value; // or sel.value
				var depositAccountDesc = sel.options[sel.selectedIndex].text;
				me.handleAccountsFieldSync('A', 'depositAccount',depositAccountVal,depositAccountDesc );
				me.savePrefAdvFilterCode = filterCode;
				me.showAdvFilterCode = filterCode;
			},
			doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
					newCard, oldCard) {
				var me = this;
				var objGroupView = me.getGroupView();
				var strModule = '', strUrl = null, args = null, strFilterCode = null;
				groupInfo = groupInfo || {};
				subGroupInfo = subGroupInfo || {};
				if (groupInfo) {
					/*if (groupInfo.groupTypeCode === 'DEPINQ_OPT_ADVFILTER') {
						strFilterCode = subGroupInfo.groupCode;
						if (strFilterCode !== 'all') {
							if (!Ext.isEmpty(strFilterCode)) {
								me.savePrefAdvFilterCode = strFilterCode;
								me.showAdvFilterCode = strFilterCode;
								me.doHandleSavedFilterItemClick(strFilterCode);
							}
						} else {
							me.savePrefAdvFilterCode = null;
							me.showAdvFilterCode = null;
							me.filterApplied = 'ALL';
							me.advFilterData = [];
							var gridModel = {
								showCheckBoxColumn : false
							};
							objGroupView.reconfigureGrid(gridModel);
						}

					} else {*/
						args = {
							scope : me
						};
						strModule = subGroupInfo.groupCode;
						if(me.applyPageSettingFlag)
						{
							strUrl = Ext.String.format(me.strGetModulePrefUrl, strModule);
							me.getSavedPreferences(strUrl,me.postHandleDoHandleGroupTabChange, args);
						}
						else
						{
							var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
							if(strModule=='all')
							{
								//me.getSavedPreferences(strUrl,me.postHandleDoHandleGroupTabChange, args);
								me.resetAllFields();
								me.savePrefAdvFilterCode = null;
								me.showAdvFilterCode = null;
								me.filterApplied = 'ALL';
								me.advFilterData = [];
								if (savedFilterCombobox) {
									savedFilterCombobox.getStore().reload();
									savedFilterCombobox.setValue("");
								}
								me.handleAccountsFieldSync('A', 'depositAccount',"","" );
								me.dateFilterVal = "1";
								if(Ext.isEmpty(strDateFilterVal))
								{
									me.dateFilterVal = '1';
									me.dateFilterLabel = getLabel('today', 'Today');
								}
								else
								{
									me.filterApplied ='A';
									me.dateFilterVal = strDateFilterVal;
									me.dateFilterLabel = strDateFilterLabel;
								}
								me.handleDateChange(me.dateFilterVal);
								//populateAdvancedFilterFieldValue();
								var gridModel = {
									showCheckBoxColumn : false
								};
								objGroupView.reconfigureGrid(gridModel);
							}
							else
							{
								if (savedFilterCombobox) {
													savedFilterCombobox.getStore().reload();
													savedFilterCombobox.setValue(strModule);
												}
								if(!me.saveFilterChangeFlag)
									me.doHandleSavedFilterItemClick(strModule);
							}
						}
					}
				//}
			},
			getSavedPreferences : function(strUrl, fnCallBack, args) {
				var me = this;
				Ext.Ajax.request({
							url : strUrl,
							method : 'GET',
							success : function(response) {
								var data = null;
								if (response && response.responseText)
									data = Ext.decode(response.responseText);
								Ext.Function.bind(fnCallBack, me);
								if (fnCallBack)
									fnCallBack(data, args);
							},
							failure : function() {
							}

						});
			},
			postHandleAdvancedFilterTabChange : function(filterCode, filterData,
					applyAdvFilter) {
				var me = this;
				var objGroupView = me.getGroupView();
				var strUrl = null;

				me.populateSavedFilter(filterCode, filterData, false);
				me.filterApplied = 'A';
				me.setDataForFilter();
				strUrl = Ext.String.format(me.strGetModulePrefUrl, 'DEPINQ_OPT_ADVFILTER');				
				args = {
					scope : me
				};
				me.getSavedPreferences(strUrl,
						me.postHandleDoHandleGroupTabChange, args);
			},
			postHandleDoHandleGroupTabChange : function(data, args) {
				var me = args.scope;
				var objGroupView = me.getGroupView();
				var objSummaryView = me.getDepositInquiryGroupView(), arrSortState = new Array(), objPref = null, gridModel = null, intPgSize = null, showPager = true;
				var colModel = null, arrCols = null;
				if (data && data.preference) {
					objPref = Ext.decode(data.preference);
					arrCols = objPref.gridCols || null;
					intPgSize = objPref.pgSize || _GridSizeTxn;
					showPager = objPref.gridSetting
							&& !Ext.isEmpty(objPref.gridSetting.showPager)
							? objPref.gridSetting.showPager
							: true;
					colModel = objSummaryView.getColumnModel(arrCols);
					arrSortState = objPref.sortState;
					if (colModel) {
						gridModel = {
							columnModel : colModel,
							pageSize : intPgSize,
							showPagerForced : showPager,
							showCheckBoxColumn : false,
							storeModel : {
								sortState : arrSortState
							}
						};
					}
				} else {
					gridModel = {
						showCheckBoxColumn : false
					};
				}
				objGroupView.reconfigureGrid(gridModel);
			},
			doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
					newPgNo, oldPgNo, sorter, filterData) {
				var me = this;
				var objGroupView = me.getGroupView();
				var buttonMask = me.strDefaultMask;
				var arrOfParseQuickFilter = [], arrOfParseAdvFilter = [], arrOfFilteredApplied = [];
				objGroupView.handleGroupActionsVisibility(buttonMask);
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );
				me.reportGridOrder = strUrl;
				me.setDataForFilter();
				me.saveFilterChangeFlag =false;
				me.applyPageSettingFlag = false;
				if (!Ext.isEmpty(me.sessionID))
					strUrl = strUrl + me.getFilterUrl(subGroupInfo) + '&$sessionId='+ me.sessionID + "&" + csrfTokenName + "=" + csrfTokenValue;
				else
					strUrl = strUrl + me.getFilterUrl(subGroupInfo) + "&" + csrfTokenName + "=" + csrfTokenValue;
				if(!Ext.isEmpty(me.filterData)){
					if(!Ext.isEmpty(me.filterData) && me.filterData.length >= 1){
						arrOfParseQuickFilter = generateFilterArray(me.filterData);
					}
				}

				if (!Ext.isEmpty(me.advFilterData)) {
					if (!Ext.isEmpty(me.advFilterData) && me.advFilterData.length >= 1) {
						
						for (var i = 0; i < me.advFilterData.length; i++) 
						{
							if(me.advFilterData[i].field === 'depositAmount') 
							{
								if(me.advFilterData[i].operator === 'le')
									me.advFilterData[i].operator = 'lte';
								else if(me.advFilterData[i].operator === 'ge')
									me.advFilterData[i].operator = 'gte';
							}
						}
						
						arrOfParseAdvFilter = generateFilterArray(me.advFilterData);
					}
				}
				if (arrOfParseQuickFilter && arrOfParseAdvFilter) {
					arrOfFilteredApplied = arrOfParseQuickFilter
							.concat(arrOfParseAdvFilter);

					if (arrOfFilteredApplied)
						me.getFilterView().updateFilterInfo(arrOfFilteredApplied);
				}
				me.loadGridDataNew( strUrl, null, null, false, null, grid );
				grid.on('cellclick', function(tableView, td, cellIndex, record, tr, rowIndex, e) {
					var clickedColumn = tableView.getGridColumns()[cellIndex];
					var columnType = clickedColumn.colType;
					if(Ext.isEmpty(columnType)) {
						var containsCheckboxCss = (clickedColumn.cls.indexOf('x-column-header-checkbox') > -1)
						columnType = containsCheckboxCss ? 'checkboxColumn' : '';
					}
					me.handleGridRowClick(record, grid, columnType);
				});
			},
			doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
					objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
				var me = this;
				var objGroupView = me.getGroupView();
				var buttonMask = '0000000000';	
				var maskArray = new Array(), actionMask = '', objData = null;;
				if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask))
					buttonMask = jsonData.d.__buttonMask;
				maskArray.push(buttonMask);
				for (var index = 0; index < arrSelectedRecords.length; index++) {
					objData = arrSelectedRecords[index];	
					maskArray.push(objData.get('__metadata').__rightsMap);					
				}

				actionMask = doAndOperation(maskArray, 10);
				objGroupView.handleGroupActionsVisibility(actionMask);
			},
			handleDateChange : function( index )
			{
				var me = this;
				var filterView = me.getDepositFilterView();
				var objDateParams = me.getDateParam( index );
				var datePickerRef = $('#depositDatePickerQuickText');
				
				if (!Ext.isEmpty(me.dateFilterLabel)) {
					me.getDateLabel().setText(getLabel('date', 'Posting Date') + " ("
							+ me.dateFilterLabel + ")");
					//me.getDateLabel().setText(getLabel('date', 'Posting Date'));
				}
				var vFromDate = Ext.util.Format.date(Ext.Date.parse(
								objDateParams.fieldValue1, 'Y-m-d'),
						strExtApplicationDateFormat);
				var vToDate = Ext.util.Format.date(Ext.Date.parse(
								objDateParams.fieldValue2, 'Y-m-d'),
						strExtApplicationDateFormat);
				if (index == '13') {
					if (objDateParams.operator == 'eq') {
						datePickerRef.setDateRangePickerValue(vFromDate);
					} else {
						datePickerRef.setDateRangePickerValue([vFromDate, vToDate]);
					}
				} else {
					if (index === '1' || index === '2') {
							datePickerRef.setDateRangeMode('single');
							datePickerRef.setDateRangePickerValue(vFromDate);
					} else {
						datePickerRef.setDateRangePickerValue([vFromDate, vToDate]);
					}
				}
				selectedPostingDateFilter={
						operator:objDateParams.operator,
						fromDate:vFromDate,
						toDate:vToDate,
						label :me.dateFilterLabel,
						btnValue : index
					};
				me.handleEntryDateSync('Q', me.getDateLabel().text, " (" + me.dateFilterLabel + ")", datePickerRef);
				//me.handleEntryDateSync('Q', me.getDateLabel().text, '', datePickerRef);
			},
			getDateParam : function( index,dateType )
			{
				var me = this;
				var objDateHandler = me.getDateHandler();
				var strAppDate = dtApplicationDate;
				var dtFormat = strExtApplicationDateFormat;
				var date = new Date( Ext.Date.parse( strAppDate, dtFormat ) );
				var strSqlDateFormat = 'Y-m-d';
				var fieldValue1 = '', fieldValue2 = '', operator = '';
				var retObj = {};
				var dtJson = {};
				switch( index )
				{
					case '1':
						// Today
						fieldValue1 = Ext.Date.format( date, strSqlDateFormat );
						fieldValue2 = fieldValue1;
						operator = 'eq';
						break;
					case '2':
						// Yesterday
						fieldValue1 = Ext.Date.format( objDateHandler.getYesterdayDate( date ), strSqlDateFormat );
						fieldValue2 = fieldValue1;
						operator = 'eq';
						break;
					case '3':
						// This Week
						dtJson = objDateHandler.getThisWeekStartAndEndDate( date );
						fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
						fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
						operator = 'bt';
						break;
					case '4':
						// Last Week To Date
						dtJson = objDateHandler.getLastWeekToDate( date );
						fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
						fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
						operator = 'bt';
						break;
					case '5':
						// This Month
						dtJson = objDateHandler.getThisMonthToDate( date );
						fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
						fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
						operator = 'bt';
						break;
					case '6':
						// Last Month To Date
						dtJson = objDateHandler.getLastMonthToDate( date );
						fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
						fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
						operator = 'bt';
						break;
					case '8':
						// This Quarter
						dtJson = objDateHandler.getQuarterToDate( date );
						fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
						fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
						operator = 'bt';
						break;
					case '9':
						// Last Quarter To Date
						dtJson = objDateHandler.getLastQuarterToDate( date );
						fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
						fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
						operator = 'bt';
						break;
					case '10':
						// This Year
						dtJson = objDateHandler.getYearToDate( date );
						fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
						fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
						operator = 'bt';
						break;
					case '11':
						// Last Year To Date
						dtJson = objDateHandler.getLastYearToDate( date );
						fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
						fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
						operator = 'bt';
						break;
					case '12' :	
						// Latest
						var fromDate = new Date(Ext.Date.parse(latestFromDate, dtFormat));
					    var toDate = new Date(Ext.Date.parse(latestToDate, dtFormat));
					    
						fieldValue1 = Ext.Date.format(
									fromDate,
									strSqlDateFormat);
						fieldValue2 = Ext.Date.format(
									toDate,
									strSqlDateFormat);
						operator = 'bt';
						break;
					case '13' :
						// Date Range
						if (me.datePickerSelectedDate.length == 1) {
							fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],
									strSqlDateFormat);
							fieldValue2 = fieldValue1;
							operator = 'eq';
						} else if (me.datePickerSelectedDate.length == 2) {
							fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],
									strSqlDateFormat);
							fieldValue2 = Ext.Date.format(me.datePickerSelectedDate[1],
									strSqlDateFormat);
							operator = 'bt';
						}
						if('postingDate' === dateType &&!isEmpty(me.datePickerSelectedDate)){
							if (me.datePickerSelectedDate.length == 1) {
								fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],
										strSqlDateFormat);
								fieldValue2 = fieldValue1;
								operator = 'eq';
							} else if (me.datePickerSelectedDate.length == 2) {
								fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],
										strSqlDateFormat);
								fieldValue2 = Ext.Date.format(me.datePickerSelectedDate[1],
										strSqlDateFormat);
								operator = 'bt';
							}
						}
				}
				// comparing with client filter condition
				if (Ext.Date.parse(fieldValue1, strSqlDateFormat) < clientFromDate) {
					fieldValue1 = Ext.Date.format(clientFromDate, strSqlDateFormat);
				}
				if (Ext.Date.parse(fieldValue2, strSqlDateFormat) < clientFromDate) {
					fieldValue2 = Ext.Date.format(clientFromDate, strSqlDateFormat);
				}
				retObj.fieldValue1 = fieldValue1;
				retObj.fieldValue2 = fieldValue2;
				retObj.operator = operator;
				return retObj;
			},
			setGridInfoSummary : function( grid )
			{
				var me = this;
				me.isGridDataLoad = true;
				var groupView = me.getGroupView();
				var depositInqGridRef = groupView.getGrid();
				if (!Ext.isEmpty(depositInqGridRef)) {
					var dataStore = depositInqGridRef.store;
					dataStore.on( 'load', function( store, records )
					{
						var summaryData = [];
						var ammount = "$0.00";
						var count = "(#0)";
						var i = records.length - 1;
						if( i >= 0 )
						{
							if(!Ext.isEmpty(records[ i ].get( 'depositSummaryCountInfo' )))
								count =  " ("+records[ i ].get( 'depositSummaryCountInfo' )+")";
							if(!Ext.isEmpty(records[ i ].get( 'depositSummaryTotalInfo' )))
								ammount = records[ i ].get( 'depositSummaryTotalInfo' ) ;
								
							 summaryData.push({
								key: "Deposits",
								value: ammount + count
								}) 
							ammount = "$0.00";
							count = "(#0)";
							
							if(!Ext.isEmpty(records[ i ].get( 'instrumentSummaryCountInfo' )))
								count =  " ("+records[ i ].get( 'instrumentSummaryCountInfo' )+")";
							if(!Ext.isEmpty(records[ i ].get( 'instrumentSummaryTotalInfo' )))
								ammount = records[ i ].get( 'instrumentSummaryTotalInfo' ) ;
							 summaryData.push({
								key: "Items",
								value: ammount + count
								})
						}
						else
						{
							summaryData=[{
								key: "Deposits",
								value:"$0.00 (#0)"
							},{
								key: "Items",
								value:"$0.00 (#0)"
							}]		
						}
						$('#summaryCarousal').carousel({
								data : summaryData,
								titleNode : "key",
								contentRenderer: function(value) {
									return  value.value;
								}								
						});	
					} );
				}			
			},

			loadGridDataNew : function(strUrl, ptFunction, args, showLoadingIndicator,
			scope, grid) {
				var me = this;
				var blnLoad = true;
				if (!Ext.isEmpty(showLoadingIndicator)
						&& showLoadingIndicator === false)
					blnLoad = false;
				grid.setLoading(blnLoad);		
				Ext.Ajax.request({
					url : strUrl,
					method : 'POST',
					timeout: 300000,
					success : function(response) {
						var data = Ext.decode(response.responseText);
						// Escape Html character in Response Data (JSON)
						if (me.escapeHtml) {
							data = me.doEscapeHtmlJSONValues(data);
						}
						// TODO : Generate empty data based on configuration
						if (Ext.isEmpty(data))
							data = {
								d : {}
							};
						grid.store.loadRawData(data);
						if (!Ext.isEmpty(ptFunction) && typeof ptFunction == 'function') {
							// ptFunction(me, data, args);
							Ext.callback(ptFunction, (scope || me), [me, data, args,
											'Y']);
						}
						if (blnLoad)
							grid.setLoading(false);
					},
					failure : function() {
						if (blnLoad)
							grid.setLoading(false);
						
						data = {d : {} };
						grid.store.loadRawData(data);
					}
				});
			},
			
			updateAdvFilterConfig : function()
			{
				var me = this;
				if( !Ext.isEmpty( objGridViewFilter ) )
				{
					var data = Ext.decode( objGridViewFilter );
					if( !Ext.isEmpty( data.advFilterCode ) )
					{
						me.showAdvFilterCode = data.advFilterCode;
						me.savePrefAdvFilterCode = data.advFilterCode;
						var strUrl = 'userfilters/depositInqFilter/{0}.srvc';
						strUrl = Ext.String.format( strUrl, data.advFilterCode );
						Ext.Ajax.request(
						{
							url : strUrl ,
							headers: objHdrCsrfParams,
							async : false,
							method : 'GET',
							/*params :
							{
								csrfTokenName : tokenValue
							},*/
							success : function( response )
							{
								if(!Ext.isEmpty(response.responseText))
								{
									var responseData = Ext.decode( response.responseText );
	
									var applyAdvFilter = false;
									me.populateSavedFilter( data.advFilterCode, responseData, applyAdvFilter );
									var objOfCreateNewFilter = me.getCreateNewFilter();
									var objJson = objOfCreateNewFilter.getAdvancedFilterQueryJson( objOfCreateNewFilter );
	
									me.advFilterData = objJson;
								}

							},
							failure : function()
							{
								var errMsg = "";
								Ext.MessageBox.show(
								{
									title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
									msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								} );

							}
						} );
					}
				}
			},

			updateFilterConfig : function()
			{
				var me = this;
				var arrJsn = new Array();
				var objDateLbl =
				{
						'' : getLabel('latest', 'Latest'),
						'12' : getLabel( 'latest', 'Latest' ),
						'1' : getLabel( 'today', 'Today' ),
		                '2' : getLabel( 'yesterday', 'Yesterday' ),
		                '3' : getLabel( 'thisweek', 'This Week' ),
		                '4' : getLabel( 'lastweek', 'Last Week To Date' ),
		                '5' : getLabel( 'thismonth', 'This Month' ),
		                '6' : getLabel( 'lastmonth', 'Last Month To Date' ),
		               // '7' : getLabel( 'daterange', 'Date Range' ),
		                '8' : getLabel( 'thisquarter', 'This Quarter' ),
		                '9' : getLabel( 'lastQuarterToDate', 'Last Quarter To Date' ),
		                '10' : getLabel( 'thisyear', 'This Year' ),
		                '11' : getLabel( 'lastyeartodate', 'Last Year To Date' ),
						'13' : getLabel('daterange', 'Date Range')
				};

				if( !Ext.isEmpty( objDepTicketPref ) )
				{
					var objJsonData = Ext.decode(objDepTicketPref);
					var data = objJsonData.d.preferences.groupViewFilterPref;
					
					if (!Ext.isEmpty(data)) {
						var strDtValue = data.quickFilter.postingDate;
						var strDtFrmValue = data.quickFilter.depositDateFrom;
						var strDtToValue = data.quickFilter.depositDateTo;
						var depositAccount = data.quickFilter.depositAccount;
						
						me.typeFilterVal = !Ext.isEmpty( depositAccount ) ? depositAccount : 'all';
						
						if( !Ext.isEmpty( strDtValue ) )
						{
							me.dateFilterLabel = objDateLbl[ strDtValue ];
							me.dateFilterVal = strDtValue;
							
							if (strDtValue === '13') {
								if (!Ext.isEmpty(strDtFrmValue))
									me.dateFilterFromVal = strDtFrmValue;

								if (!Ext.isEmpty(strDtToValue))
									me.dateFilterToVal = strDtToValue;
							}
							else
							{
								var dtParams = me.getDateParam(strDtValue);
								if (!Ext.isEmpty(dtParams)
										&& !Ext.isEmpty(dtParams.fieldValue1)) {
									me.dateFilterFromVal = dtParams.fieldValue1;
									me.dateFilterToVal = dtParams.fieldValue2;
								}
							}
						}
						if( !Ext.isEmpty( me.dateFilterVal ) )
						{
							var strVal1 = '', strVal2 = '', strOpt = 'eq';
							if( me.dateFilterVal !== '7' )
							{
								var dtParams = me.getDateParam( me.dateFilterVal );
								if( !Ext.isEmpty( dtParams ) && !Ext.isEmpty( dtParams.fieldValue1 ) )
								{
									strOpt = dtParams.operator;
									strVal1 = dtParams.fieldValue1;
									strVal2 = dtParams.fieldValue2;
								}
							}
							else
							{
								if( !Ext.isEmpty( me.dateFilterVal ) && !Ext.isEmpty( me.dateFilterFromVal ) )
								{
									strVal1 = me.dateFilterFromVal;
	
									if( !Ext.isEmpty( me.dateFilterToVal ) )
									{
										strOpt = 'bt';
										strVal2 = me.dateFilterToVal;
									}
								}
							}
							//if( me.dateFilterVal != '12' )
							//{
								arrJsn.push(
								{
									paramName : 'postingDate',
									paramValue1 : strVal1,
									paramValue2 : strVal2,
									operatorValue : strOpt,
									paramIsMandatory : true,
									dataType : 'D',
									btnValue : me.dateFilterVal,
									btnValuelable :me.dateFilterlabel,
									paramFieldLable : getLabel('postingDate','Posting Date') 
								} );
							//}
						}
	
						if( !Ext.isEmpty( me.typeFilterVal ) && me.typeFilterVal != 'all' )
						{
							arrJsn.push(
							{
								paramName : 'depositAccount',
								paramValue1 : encodeURIComponent(me.typeFilterVal.replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'eq',
								dataType : 'S'
							} );
						}
						var advFilterCode = data.advFilterCode;
						me.savedFilterVal = advFilterCode;
						me.doHandleSavedFilterItemClick(advFilterCode);
						
						me.filterData = arrJsn;
					}
					else
					{
						if('Y'== isMenuClicked){
						var me = this;
						var blnShowAdvFilter = true;
						if (objDepTicketPref)
						{
                              var objJsonData = Ext.decode(objDepTicketPref);
                              if (!Ext.isEmpty(objJsonData.d.preferences))
                              {
                                     if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting))
                                     {
                                            if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode))
                                            {
                                            	blnShowAdvFilter = false;
                                            }
                                     }
                              }
						}
						if(blnShowAdvFilter)
						{
							showAdvanceFilterPopup('depositInqFilter');	
							blnShowAdvFilter = false;
						}							
						/*Setting default postingdate as Today(Application date)*/
						me.postingDateFilterVal = '1';
						me.postingDateFilterLabel =  getLabel('today', 'Today');
						me.handlePostingDateChange('1');
					}
						
					}
				}
			},
			setDataForFilter : function(filterData)
			{
				var me = this;
				me.advFilterData = {};
				me.filterData = {};
				me.filterData = me.getQuickFilterQueryJson();
				var objJson = (!Ext.isEmpty(filterData) ? filterData.filterBy : getAdvancedFilterQueryJson());
				reqJson = me.findInAdvFilterData(objJson, "depositAccount");
				if (!Ext.isEmpty(reqJson)) {
					arrQuickJson = me.filterData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,
							"depositAccount");
					me.filterData = arrQuickJson;
				}
				reqJson = me.findInAdvFilterData(objJson, "postingDate");
				if (!Ext.isEmpty(reqJson)) {
					arrQuickJson = me.filterData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "postingDate");
					me.filterData = arrQuickJson;
				}
				if(me.filterDeleted)
					me.filterData = {};
				me.advFilterData = objJson;
				var filterCode = $("input[type='text'][id='filterCode']").val();
				if(!Ext.isEmpty(filterCode))
					me.advFilterCodeApplied = filterCode;
				/*var me = this;	
				if( this.filterApplied === 'Q' )
				{
					this.filterData = this.getQuickFilterQueryJson();
				}
				else if( this.filterApplied === 'A' )
				{
					this.filterData = this.getQuickFilterQueryJson();
					var objJson = getAdvancedFilterQueryJson();
					this.advFilterData = objJson;
					var filterCode = $("input[type='text'][id='filterCode']").val();
					this.advFilterCodeApplied = filterCode;
				}
				if( this.filterApplied === 'ALL' || 'N'==isMenuClicked)
				{
					this.filterData = this.getQuickFilterQueryJson();
				}*/
			},
			getDefaultFilterParam : function()
			{
				var me = this;
				var objJson = null, jsonArray = [];
				var defaultFilterQuery = '';
				var typeFilterVal = me.typeFilterVal;
				var index = me.dateFilterVal;
				if( typeFilterVal != null && typeFilterVal != 'all' )
				{
					defaultFilterQuery+='&$acctNmbr='+typeFilterVal;
				}
				else if (null!= multiAccounts && 'Select'!=multiAccounts)
				{
					defaultFilterQuery+='&$acctNmbr='+multiAccounts;
				}
				else
				{
					defaultFilterQuery+='&$acctNmbr=ALL';
				}
				var objDateParams = me.getDateParam( index );
				defaultFilterQuery+='&$fromDate='+objDateParams.fieldValue1+'&$toDate='+objDateParams.fieldValue2;
				return defaultFilterQuery;
			},
			handlePostingDateSyncDepositTckCall : function( dateValue )
			{
				var me =this;
				var postingDateLableVal = $('label[for="PostingDateLabel"]').text();
				var labelAdvFilterChange =  $('label[for="PostingDateLabel"]');
				var labelQuickFilterChange =  me.getDateLabel();
				labelAdvFilterChange.text(postingDateLableVal);
				labelQuickFilterChange.setText(postingDateLableVal);
				
				var postingDateAdvValueChange = $('#depositItemDateAdvFilter');
				var postingDateFiltervalueChange = $('#itemDatePickerQuickText');
				
				postingDateAdvValueChange.setDateRangePickerValue(dateValue);				
				postingDateFiltervalueChange.setDateRangePickerValue(dateValue);
				
				selectedPostingDateFilter = {
                        operator : 'eq',
                        fromDate : dateValue,
                        toDate : dateValue,
                        label : postingDateLableVal,
						btnValue : me.postingDateFilterVal
                };
			},
			handleDepositAccSyncDepositTckCall : function( account )
			{
				var me = this;
				me.typeFilterVal = account;
				me.typeFilterDesc = account;
				var objStatusField = me.getFilterView().down('combo[itemId="quickFilterAccountCombo"]');
				objStatusField.setValue(account);
				var objField = $('#depositAccount');
				objField.val(account);
			},	
			getQuickFilterQueryJson : function()
			{
				var me = this;
				var typeFilterVal = me.typeFilterVal;
				var jsonArray = [];
				var index = me.dateFilterVal;
				var objDateParams = me.getDateParam( index );
				//if( index != '12' )
				//{
					if(!Ext.isEmpty(index)){
						if('N'==isMenuClicked)
						{
							jsonArray.push(
									{
										paramName : 'postingDate',
										paramValue1 : objDateParams.fieldValue1,
										paramValue2 : objDateParams.fieldValue2,
										operatorValue : objDateParams.operator,
										dataType : 'D',
										paramIsMandatory : true,
										btnValue :index,
										btnValuelable :me.dateFilterlabel,
										paramFieldLable : getLabel('postingDate','Posting Date') 
									} );
					//		me.handlePostingDateSyncDepositTckCall( Ext.util.Format.date(s_postingDate, strExtApplicationDateFormat) );		
						}
						else
						{					
							jsonArray.push(
							{
								paramName : 'postingDate',
								paramValue1 : objDateParams.fieldValue1,
								paramValue2 : objDateParams.fieldValue2,
								operatorValue : objDateParams.operator,
								paramIsMandatory : true,
								dataType : 'D',
								btnValue :index,
								btnValuelable :me.dateFilterlabel,
								paramFieldLable : getLabel('postingDate','Posting Date') 
							} );
							ticketFromDate = objDateParams.fieldValue1;
							ticketToDate = objDateParams.fieldValue2;
							ticketOperator = objDateParams.operator;
						}
					 }
				//}
				else
				{
					if('N'==isMenuClicked)
					{
						jsonArray.push(
								{
									paramName : 'postingDate',
									paramValue1 : Ext.util.Format.date(s_postingDate, strExtApplicationDateFormat),
									paramValue2 : Ext.util.Format.date(s_postingDate, strExtApplicationDateFormat),
									operatorValue : 'eq',
									dataType : 'D',
									paramIsMandatory : true,
									btnValue :index,
									btnValuelable :me.dateFilterlabel,
									paramFieldLable : getLabel('postingDatedate', 'Posting Date')
								} );
						me.handlePostingDateSyncDepositTckCall( Ext.util.Format.date(s_postingDate, strExtApplicationDateFormat) );
					}
				}
				if('N'==isMenuClicked)
				{
					jsonArray.push(
							{
								paramName : 'depositAccount',
								paramValue1 : encodeURIComponent(s_depositAccount.replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'eq',
								dataType : 'S',
								displayType : 5,
								paramFieldLable : getLabel( 'lbldepacc', 'Deposit Account' ),
								displayValue1 : s_depositAccount									
							} );
						if(!Ext.isEmpty( s_depositAccount ))
							me.handleDepositAccSyncDepositTckCall( s_depositAccount );		
				}
				else
				{
				if( !Ext.isEmpty(typeFilterVal) && typeFilterVal != 'all'  && typeFilterVal != 'Select Account')
				{
					jsonArray.push(
					{
						paramName : 'depositAccount',
						paramValue1 : encodeURIComponent(typeFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('depositAccount', 'Deposit Account'),
						displayValue1 : me.typeFilterDesc
					} );
				}
				}
				
				if (!Ext.isEmpty(me.clientFilterVal) && me.clientFilterVal !== null && me.clientFilterVal!='all') {
					jsonArray.push({
						paramName : 'clientId',
						operatorValue : 'eq',
						paramValue1 : encodeURIComponent(me.clientFilterVal.replace(new RegExp("'", 'g'), "\''")),
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('lblcompany', 'Company Name'),
						displayValue1 : me.clientFilterDesc
					});
				}
				return jsonArray;
			},
			applyFilter : function()
			{
				var me = this;
				var groupView = me.getGroupView();
				var grid = groupView.getGrid();		
				var subGroupInfo = groupView.getSubGroupInfo() || {};
				if( !Ext.isEmpty( grid ) && me.isGridDataLoad )
				{
					var strDataUrl = grid.store.dataUrl;
					var store = grid.store;
					var strUrl = grid.generateUrl( strDataUrl, grid.pageSize, 1, 1, store.sorters );
					strUrl = strUrl + me.getFilterUrl(subGroupInfo) + '&' + csrfTokenName + '=' + csrfTokenValue;					
					me.loadGridDataNew( strUrl, me.handleAfterGridDataLoad, null , null, null,grid);
				}
			},

			applyQuickFilter : function()
			{
				var me = this;
				var groupView = me.getGroupView();
				var groupInfo = groupView.getGroupInfo();
				var grid = groupView.getGrid();		
				var subGroupInfo = groupView.getSubGroupInfo() || {};
				me.filterApplied = 'Q';
				/*if( !Ext.isEmpty( grid ))
				{
					var strDataUrl = grid.store.dataUrl;
					var store = grid.store;
					var strUrl = grid.generateUrl( strDataUrl, grid.pageSize, 1, 1, store.sorters );
					strUrl = strUrl + me.getFilterUrl(subGroupInfo) + '&' + csrfTokenName + '=' + csrfTokenValue;					
					me.loadGridDataNew( strUrl, me.handleAfterGridDataLoad, null,null,null,grid );
				}*/
				me.refreshData();
			},

			getFilterUrl : function(subGroupInfo)
			{
				var me = this;
				var strQuickFilterUrl = '', strActionStatusUrl = '', strAdvancedFilterUrl = '', strUrl = '', isFilterApplied = false;

				var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
						? subGroupInfo.groupQuery
						: '';
				/*if( me.filterApplied === 'ALL' )
				{
					strQuickFilterUrl = me.generateUrlWithQuickFilterParams( me );
					if( !Ext.isEmpty( strQuickFilterUrl ) )
					{
						strUrl += '&$filter=' + strQuickFilterUrl;
						isFilterApplied = true;
					}
				}*/
				//else
				//{
					strQuickFilterUrl = me.generateUrlWithQuickFilterParams( me );
					if( !Ext.isEmpty( strQuickFilterUrl ) )
					{
						strUrl += '&$filter=' + strQuickFilterUrl;
						isFilterApplied = true;
					}
					if (me.filterApplied !== 'ALL')
					strAdvancedFilterUrl = me.generateUrlWithAdvancedFilterParams( me );
					
					if( !Ext.isEmpty( strAdvancedFilterUrl ) )
					{
						if( Ext.isEmpty( strUrl ) )
							strUrl += '&$filter=' + strAdvancedFilterUrl;
						else
							strUrl += ' and ' + strAdvancedFilterUrl;
						isFilterApplied = true;
					}
				//}
				strUrl+=me.getDefaultFilterParam();	
				if (!Ext.isEmpty(strGroupQuery)) {
					if (!Ext.isEmpty(strUrl))
						strUrl += ' and ' + strGroupQuery;
					else
						strUrl += '&$filter=' + strGroupQuery;
				}				
				return strUrl;
			},
			generateUrlWithQuickFilterParams : function( me )
			{
				var me = this;
				var filterData = me.filterData;
				var isFilterApplied = false;
				var strFilter = '';
				var strTemp = '';
				var strFilterParam = '';
				
				for( var index = 0 ; index < filterData.length ; index++ )
				{
					if(typeof  filterData[ index ].paramName !== "undefined")
					{
					if( isFilterApplied )
						strTemp = strTemp + ' and ';

					switch( filterData[ index ].operatorValue )
					{
						case 'bt':

							if( filterData[ index ].dataType === 'D' )
							{

								strTemp = strTemp + filterData[ index ].paramName + ' '
									+ filterData[ index ].operatorValue + ' ' + 'date\''
									+ filterData[ index ].paramValue1 + '\'' + ' and ' + 'date\''
									+ filterData[ index ].paramValue2 + '\'';
							}
							else
							{
								strTemp = strTemp + filterData[ index ].paramName + ' '
									+ filterData[ index ].operatorValue + ' ' + '\'' + filterData[ index ].paramValue1
									+ '\'' + ' and ' + '\'' + filterData[ index ].paramValue2 + '\'';
							}
							break;
						default:
							// Default opertator is eq
							if( filterData[ index ].dataType === 'D' )
							{

								strTemp = strTemp + filterData[ index ].paramName + ' '
									+ filterData[ index ].operatorValue + ' ' + 'date\''
									+ filterData[ index ].paramValue1 + '\'';
							}
							else
							{
								if(filterData[ index ].paramName == "depositAccount"  && (filterData[ index ].paramValue1 == 'all' ||
								 filterData[ index ].paramValue1 == 'ALL')){
									strTemp = strTemp + filterData[ index ].paramName + ' '
									+ 'lk' + ' ' + '\'' 
									+ '\'';
								}else{	
								strTemp = strTemp + filterData[ index ].paramName + ' '
									//+ filterData[ index ].operatorValue + ' ' + '\'' + filterData[ index ].displayValue1.split('|')[0]
									+ filterData[ index ].operatorValue + ' ' + '\'' + filterData[ index ].paramValue1								
									+ '\'';
								}
							}
							break;
					}
					}
					isFilterApplied = true;
				}
				if( isFilterApplied )
					strFilter = strFilter + strTemp;
				else
					strFilter = '';
				return strFilter;
			},
			generateUrlWithAdvancedFilterParams : function( me )
			{
				var thisClass = this;
				var filterData = thisClass.advFilterData;
				var isFilterApplied = false;
				var isOrderByApplied = false;
				var strFilter = '';
				var strTemp = '';
				var strFilterParam = '';
				var operator = '';
				var isInCondition = false;

				if( !Ext.isEmpty( filterData ) )
				{
					for( var index = 0 ; index < filterData.length ; index++ )
					{
						isInCondition = false;
						operator = filterData[ index ].operator;
						if( isFilterApplied
							&& ( operator === 'bt' || operator === 'lk' || operator === 'ge' || operator === 'le' ) )
							strTemp = strTemp + ' and ';
						switch( operator )
						{
							case 'bt':
								isFilterApplied = true;
								if( filterData[ index ].dataType === 'D' )
								{
									strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator
										+ ' ' + 'date\'' + filterData[ index ].value1 + '\'' + ' and ' + 'date\''
										+ filterData[ index ].value2 + '\'';
								}
								else
								{
									strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator
										+ ' ' + '\'' + filterData[ index ].value1 + '\'' + ' and ' + '\''
										+ filterData[ index ].value2 + '\'';
								}
								break;
							case 'st':
								if( !isOrderByApplied )
								{
									strTemp = strTemp + ' &$orderby=';
									isOrderByApplied = true;
								}
								else
								{
									strTemp = strTemp + ',';
								}
								strTemp = strTemp + filterData[ index ].value1 + ' ' + filterData[ index ].value2;
								break;
							case 'lk':
								isFilterApplied = true;
								strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator
									+ ' ' + '\'' + filterData[ index ].value1 + '\'';
								break;
							case 'eq':
								isInCondition = this.isInCondition( filterData[ index ] );
								if( isInCondition )
								{
									var reg = new RegExp( /[\(\)]/g );
									var objValue = filterData[ index ].value1;
									/*objValue = objValue.replace( reg, '' );
									var objArray = objValue.split( ',' );
									isFilterApplied = true;
									for( var i = 0 ; i < objArray.length ; i++ )
									{
										strTemp = strTemp + filterData[ index ].field + ' '
											+ filterData[ index ].operator + ' ' + '\'' + objArray[ i ] + '\'';
										if( i != objArray.length - 1 )
											strTemp = strTemp + ' or '
									}
									break;*/
									if (objValue != 'All') {
										if (isFilterApplied) {
											strTemp = strTemp + ' and ';
										} else {
											isFilterApplied = true;
										}
										if( filterData[ index ].dataType === 'D' )
										{
											isFilterApplied = true
											strTemp = strTemp + filterData[ index ].field + ' '
												+ filterData[ index ].operator + ' ' + 'date\''
												+ filterData[ index ].value1 + '\'';
										}else
										{
											isFilterApplied = true;
											strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator
												+ ' ' + '\'' + filterData[ index ].value1 + '\'' ;
										}
									}		
								}
								break;
							case 'ge':
							case 'le':
								isFilterApplied = true;
								if( filterData[ index ].dataType === 1 )
								{
									strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator
										+ ' ' + 'date\'' + filterData[ index ].value1 + '\'';
								}
								else
								{
									strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator
										+ ' ' + '\'' + filterData[ index ].value1 + '\'';
								}
								break;
							case 'in' :
								var reg = new RegExp(/[\(\)]/g);
								var objValue = filterData[index].value1;
								objValue = objValue.replace(reg, '');
								var objArray = objValue.split(',');
								if (objArray.length > 0) {
									if (objArray[0] != 'All') {
										if (isFilterApplied) {
											if (filterData[index].detailFilter
													&& filterData[index].detailFilter === 'Y') {
												strDetailUrl = strDetailUrl + ' and ';
											} else {
												strTemp = strTemp + ' and ';
											}
										} else {
											isFilterApplied = true;
										}

										if (filterData[index].detailFilter
												&& filterData[index].detailFilter === 'Y') {
											strDetailUrl = strDetailUrl + '(';
										} else {
											strTemp = strTemp + '(';
										}
										for (var i = 0; i < objArray.length; i++) {
											if (filterData[index].detailFilter
													&& filterData[index].detailFilter === 'Y') {
												strDetailUrl = strDetailUrl
														+ filterData[index].field
														+ ' eq ';
												strDetailUrl = strDetailUrl + '\''
														+ objArray[i] + '\'';
												if (i != objArray.length - 1)
													strDetailUrl = strDetailUrl
															+ ' or ';
											} else {
												strTemp = strTemp
														+ filterData[index].field
														+ ' eq ';
												strTemp = strTemp + '\'' + objArray[i]
														+ '\'';
												if (i != objArray.length - 1)
													strTemp = strTemp + ' or ';

											}
										}
										if (filterData[index].detailFilter
												&& filterData[index].detailFilter === 'Y') {
											strDetailUrl = strDetailUrl + ')';
										} else {
											strTemp = strTemp + ')';
										}
									}
								}
								break;
						}
					}
				}				
				if( isFilterApplied )
				{
					strFilter = strFilter + strTemp;
				}
				else if( isOrderByApplied )
					strFilter = strTemp;
				else
					strFilter = '';
				return strFilter;
			},

			isInCondition : function( data )
			{
				var retValue = false;
				var displayType = data.displayType;
				var strValue = data.value1;
				var reg = new RegExp( /^\((\d\d*,)*\d\d*\)$/ );
				if( displayType && (displayType === 4 || displayType === 3 || displayType === 5 || displayType === 6) && strValue /*&& strValue.match( reg )*/ )
				{
					retValue = true;
				}

				return retValue;

			},
			orderUpDown : function( grid, rowIndex, direction )
			{
				var record = grid.getStore().getAt( rowIndex );
				var store = grid.getStore();
				if( !record )
				{
					return;
				}
				var index = rowIndex;
				if( direction < 0 )
				{
					index--;
					if( index < 0 )
					{
						return;
					}
					var beforeRecord = store.getAt(index);
					store.remove(beforeRecord);
					store.remove(record);
					store.insert(index, record);
					store.insert(index + 1, beforeRecord);
				}
				else
				{
					if (index >= grid.getStore().getCount() - 1) {
						return;
					}
					var currentRecord = record;
					store.remove(currentRecord);
					var afterRecord = store.getAt(index);
					store.remove(afterRecord);
					store.insert(index, afterRecord);
					store.insert(index + 1, currentRecord);
				}
				this.sendUpdatedOrederJsonToDb( store );
			},
			deleteFilterSet : function( filterCode )
			{
				var me = this;
				var objFilterName;
				var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
				var objComboStore=null;
				if (!Ext.isEmpty(filterCode))
					objFilterName = filterCode;
				me.filterCodeValue = null;

				if( this.savePrefAdvFilterCode == objFilterName )
				{
					me.advFilterData = [];
					me.filterApplied = 'A';
					me.filterDeleted = true;
					me.resetAllFields();
					me.handleAccountsFieldSync('A', 'depositAccount',"","" );
					me.dateFilterVal = defaultDateIndex;
					me.handleDateChange(me.dateFilterVal);
					me.refreshData();
				}
				if (savedFilterCombobox) {
					objComboStore = savedFilterCombobox.getStore();
					objComboStore.removeAt(objComboStore.find('filterName',objFilterName));
					savedFilterCombobox.setValue('');
				}
				me.deleteFilterCodeFromDb( objFilterName );
				me.sendUpdatedOrederJsonToDb();
				//me.reloadFilters(store);
			},
			deleteFilterCodeFromDb : function( objFilterName )
			{
				var me = this;
				if( !Ext.isEmpty( objFilterName ) )
				{
					var strUrl = 'userfilters/depositInqFilter/{0}/remove.srvc?' + csrfTokenName + '=' + csrfTokenValue;
					strUrl = Ext.String.format( strUrl, objFilterName );

					Ext.Ajax.request(
					{
						url : strUrl,
						method : "POST",
						success : function( response )
						{
						},
						failure : function( response )
						{
							console.log( "Error Occured" );
						}
					} );
				}
			},
			sendUpdatedOrederJsonToDb : function( store )
			{
				var me = this;
				var objJson = {};
				var FiterArray = [];
				var preferenceArray = [];
				$("#msSavedFilter option").each(function() {
					FiterArray.push($(this).val());
				});
				objJson.filters = FiterArray;
				Ext.Ajax.request(
				{
					url : 'userpreferences/depositInqList/depInqAdvanceFilter.srvc?' + csrfTokenName + '='
						+ csrfTokenValue,
					method : 'POST',
					jsonData : objJson,
					async : false,
					success : function( response )
					{
						me.updateSavedFilterComboInQuickFilter();
						me.resetAllFields();
					},
					failure : function()
					{
						console.log( "Error Occured - Addition Failed" );

					}

				} );
			},
			viewFilterData : function( grid, rowIndex )
			{
				var me = this;
				me.resetAllFields();
				me.filterCodeValue=null;
				var record = grid.getStore().getAt(rowIndex);
				var filterCode = record.data.filterName;
				var applyAdvFilter = false;
				me.getSavedFilterData(filterCode, this.populateAndDisableSavedFilter,
				applyAdvFilter);
				changeAdvancedFilterTab(1);
			},
			editFilterData : function( grid, rowIndex )
			{
				var me = this;
				me.resetAllFields();
				me.filterCodeValue=null;
				var record = grid.getStore().getAt(rowIndex);
				var filterCode = record.data.filterName;
				var filterCodeRef = $("input[type='text'][id='filterCode']");
				if (!Ext.isEmpty(filterCodeRef)) {
					filterCodeRef.val(filterCode);
					filterCodeRef.prop('disabled', true);
				}
				var applyAdvFilter = false;
				me.filterCodeValue = filterCode;
				me.getSavedFilterData(filterCode, this.populateSavedFilter,
						applyAdvFilter);
				changeAdvancedFilterTab(1);
			},
			getSavedFilterData : function( filterCode, fnCallback, applyAdvFilter )
			{
				var me = this;
				var objJson;
				var strUrl = 'userfilters/depositInqFilter/{0}.srvc';
				strUrl = Ext.String.format( strUrl, filterCode );
				Ext.Ajax.request(
				{
					url : strUrl ,
					headers: objHdrCsrfParams,
					method : 'GET',
					async : false,
					success : function( response ){
						if (!Ext.isEmpty(response.responseText)) {
						var responseData = Ext.decode( response.responseText );
						fnCallback.call( me, filterCode, responseData, applyAdvFilter );
						}
					},
					failure : function()
					{
						var errMsg = "";
						Ext.MessageBox.show(
						{
							title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
							msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						} );
					}
				} );
			},

			populateAndDisableSavedFilter : function( filterCode, filterData, applyAdvFilter )
			{
				var me = this;
				for( i = 0 ; i < filterData.filterBy.length ; i++ )
				{
					var fieldName = filterData.filterBy[ i ].field;
					var fieldVal = filterData.filterBy[i].value1;
					var fieldVal2 = filterData.filterBy[i].value2;
					var fieldOper = filterData.filterBy[i].operator;
					
					currentFilterData = filterData.filterBy[i];
					operatorValue = filterData.filterBy[i].operator;
					
					if (fieldName === 'depositAccount') {
						$("#depositAccount").val(fieldVal);						
						$("#depositAccount").multiselect("refresh");
						$('#depositAccount').niceSelect('update');
					} else if (fieldName === 'postingDatePicker') {
						$("#postingDatePicker").val(fieldVal);
					} else if (fieldName === 'depositTicketNmbr') {
						if (!Ext.isEmpty(operatorValue)) {
							if (!Ext.isEmpty(fieldVal)) {
								$('#depositTicketOperator').val(operatorValue);
								$('#depositTicketOperator').niceSelect('update');
								$('#depositTicket').val(fieldVal);
								if('bt'==operatorValue)
								{
									$('#depositTicketTo').show();	
									$('#depositTicket1').prop('disabled', true);
								}																
								if(!Ext.isEmpty(fieldVal2))
								{										
									$('#depositTicket1').val(fieldVal2);									
								}	
							}
						}
					} else if (fieldName === 'depositAmount') {
						if (!Ext.isEmpty(operatorValue)) {
							if (!Ext.isEmpty(fieldVal)) {
								$('#depositAmountOperator').val(operatorValue);
								$('#depositAmountOperator').niceSelect('update');
								$('#depositAmount').val(fieldVal);	
								if('bt'==operatorValue)
								{
									$('#depositAmountTo').show();	
									$('#depositAmount1').prop('disabled', true);
								}								
								if(!Ext.isEmpty(fieldVal2))
								{
									$('#depositAmount1').val(fieldVal2);
								}
							}
						}
					} else if (fieldName === 'serial') {
						if (!Ext.isEmpty(operatorValue)) {
							if (!Ext.isEmpty(fieldVal)) {
								$('#serialOperator').val(operatorValue);
								$('#serial').val(fieldVal);		
								if('bt'==operatorValue)
								{
									$('#serialTo').show();	
									$('#serial1').prop('disabled', true);
								}								
								if(!Ext.isEmpty(fieldVal2))
								{
									$('#serial1').val(fieldVal2);
								}								
							}
						}
					}else if (fieldName === 'lockBoxNmbr') {
						if (!Ext.isEmpty(operatorValue)) {
							if (!Ext.isEmpty(fieldVal)) {
								$('#lockBoxNmbrOperator').val(operatorValue);
								$('#lockBoxNmbrOperator').niceSelect('update');
								$('#lockBoxNmbr').val(fieldVal);	
								if('bt'==operatorValue)
								{
									$('#lockBoxNmbrTo').show();	
									$('#lockBoxNmbr1').prop('disabled', true);
								}								
								if(!Ext.isEmpty(fieldVal2))
								{
									$('#lockBoxNmbr1').val(fieldVal2);
								}									
							}
						}
					}
					if (fieldName === 'postingDate') {
						me.setSavedFilterPostingDate(fieldName, currentFilterData);
					}
				}
				$("#filterCode").val(filterCode);
				$("input[type='text'][id='depositAccount']").prop('disabled', true);
				$("select[id='depositTicketOperator']").prop('disabled', true);
				$("select[id='depositAmountOperator']").prop('disabled', true);
				$("select[id='serialOperator']").prop('disabled', true);
				$("select[id='lockBoxNmbrOperator']").prop('disabled', true);
				$("input[type='text'][id='depositTicket']").prop('disabled', true);
				$("input[type='text'][id='depositAmount']").prop('disabled', true);
				$("input[type='text'][id='serial']").prop('disabled', true);
				$("input[type='text'][id='lockBoxNmbr']").prop('disabled', true);
				$("input[type='text'][id='filterCode']").prop('disabled', true);
			},
			postDoSaveAndSearch : function()
			{
				var me = this, objGroupView = null, savedFilterCombobox = me
				.getFilterView().down('combo[itemId="savedFiltersCombo"]');
				var objAdvSavedFilterComboBox, blnOptionPresent = false, arrValues = [];
				me.filterDeleted = false;
				if (savedFilterCombobox) {
					savedFilterCombobox.getStore().reload();
					savedFilterCombobox.setValue(me.filterCodeValue);
				}
				var objAdvSavedFilterComboBox = $("#msSavedFilter");
				if (objAdvSavedFilterComboBox) {
					blnOptionPresent = $("#msSavedFilter option[value='"
							+ me.filterCodeValue + "']").length > 0;
					if (blnOptionPresent === true) {
						objAdvSavedFilterComboBox.val(me.filterCodeValue);
					} else if (blnOptionPresent === false) {
						$(objAdvSavedFilterComboBox).append($('<option>', {
									value : me.filterCodeValue,
									text : me.filterCodeValue
								}));

						if (!Ext.isEmpty(me.filterCodeValue))
							arrValues.push(me.filterCodeValue);
						objAdvSavedFilterComboBox.val(arrValues);
						objAdvSavedFilterComboBox.multiselect("refresh");
					}
				}
				me.doSearchOnly();
				objGroupView = me.getGroupView();
				objGroupView.setFilterToolTip(me.filterCodeValue || '');
			},
			doSearchOnly : function()
			{
				var me = this;
				var blnFilterSave = false;
					me.filterDeleted = false;
				isValidSearch = handleFilterDataValidation(blnFilterSave,null);
				if(isValidSearch) {
					if (!$('#advancedFilterErrorDiv').hasClass('ui-helper-hidden')) {
						$('#advancedFilterErrorDiv').addClass('ui-helper-hidden');
					}
					var postingDateLableVal = $('label[for="PostingDateLabel"]').text();
					var postingDateField = $("#postingDatePicker");
					me.handleEntryDateSync('A', postingDateLableVal, null, postingDateField);
					
					var sel = document.getElementById("depositAccount");
					var depositAccountVal = sel.options[sel.selectedIndex].value; // or sel.value
					var depositAccountDesc = sel.options[sel.selectedIndex].text;
					me.handleAccountsFieldSync('A', 'depositAccount',depositAccountVal,depositAccountDesc );
					me.applyAdvancedFilter();
				}
			},
			applyAdvancedFilter : function(filterData)
			{
				var me = this,objGroupView = me.getGroupView();
				me.filterApplied = 'A';
				me.setDataForFilter(filterData);
				if (!Ext.isEmpty(me.getGroupView().cfgGroupByData) && !Ext.isEmpty(me.getGroupView().cfgGroupByData[0].groups) && me.saveFilterChangeFlag)
				{
					for( var index = 0 ; index < objGroupView.down('tabpanel[itemId="summaryTabPanel"]').items.length ; index++ )
					{
						if(objGroupView.down('tabpanel[itemId="summaryTabPanel"]').items.items[index].title==filterData.filterCode)
						{
							objGroupView.down('tabpanel[itemId="summaryTabPanel"]').setActiveTab(index)
						}
					}
				}
				if(Ext.isEmpty(me.getGroupView().cfgGroupByData))
					me.applyPageSettingFlag =true;
				me.refreshData();
				if (objGroupView)
					objGroupView.toggleFilterIcon(true);
				objGroupView.setFilterToolTip(me.showAdvFilterCode || '');
			},
			handleSaveAndSearchAction : function( btn )
			{
				var me = this;
				var callBack = this.postDoSaveAndSearch;
				var strFilterCodeVal = null,blnFilterSave = true;
				var FilterCode =  $("#filterCode").val();
					hideErrorPanel("advancedFilterErrorDiv");
					me.filterCodeValue = FilterCode;
					strFilterCodeVal = me.filterCodeValue;
				me.savePrefAdvFilterCode = strFilterCodeVal;
				isValidSearch = handleFilterDataValidation(blnFilterSave,strFilterCodeVal);
				if(isValidSearch){
					if (!$('#advancedFilterErrorDiv').hasClass('ui-helper-hidden')) {
						$('#advancedFilterErrorDiv').addClass('ui-helper-hidden');
					}
					me.postSaveFilterRequest(strFilterCodeVal, callBack);
				}
			},
			postSaveFilterRequest : function( FilterCodeVal, fncallBack )
			{
				var me = this;
				var strUrl = 'userfilters/depositInqFilter/{0}.srvc';
				strUrl = Ext.String.format( strUrl, FilterCodeVal );
				var objJson;
				objJson = getAdvancedFilterValueJson( FilterCodeVal);
				Ext.Ajax.request(
				{
					url : strUrl + '?' + csrfTokenName + '=' + csrfTokenValue,
					method : 'POST',
					jsonData : Ext.encode( objJson ),
					success : function( response )
					{
						var responseData = Ext.decode( response.responseText );
						var isSuccess;
						var title, strMsg, imgIcon;
						if( responseData.d.filters && responseData.d.filters.success )
							isSuccess = responseData.d.filters.success;

						if( isSuccess && isSuccess === 'N' )
						{
							title = getLabel( 'instrumentSaveFilterPopupTitle', 'Message' );
							strMsg = responseData.d.filters.error.errorMessage;
							imgIcon = Ext.MessageBox.ERROR;
							Ext.MessageBox.show(
							{
								title : title,
								msg : strMsg,
								width : 200,
								buttons : Ext.MessageBox.OK,
								icon : imgIcon
							} );

						}
						if (FilterCodeVal && isSuccess && isSuccess === 'Y') {
							$('#depAdvancedFilterPopup').dialog('close');
							fncallBack.call(me);
							//me.reloadFilters(filterGrid.getStore());
							me.updateSavedFilterComboInQuickFilter();
						}
					},
					failure : function()
					{
						var errMsg = "";
						Ext.MessageBox.show(
						{
							title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
							msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						} );
					}
				} );

			},
			handleFilterItemClick : function( filterCode, btn )
			{

				var me = this;
				var objToolbar = me.getAdvFilterActionToolBar();
				me.filterCodeValue = filterCode;
				objToolbar.items.each( function( item )
				{
					item.removeCls( 'xn-custom-heighlight' );
				} );
				if(!Ext.isEmpty(btn))
					btn.addCls( 'xn-custom-heighlight' );

				if( !Ext.isEmpty( filterCode ) )
				{
					var applyAdvFilter = true;
					this.getSavedFilterData( filterCode, this.populateSavedFilter, applyAdvFilter );
				}

				me.savePrefAdvFilterCode = filterCode;
				me.showAdvFilterCode = filterCode;
				//me.toggleSavePrefrenceAction( true );
				//me.toggleClearPrefrenceAction(true);
			},
			populateSavedFilter : function( filterCode, filterData, applyAdvFilter )
			{
				var me = this;
				var currentFilterData = '';
				var operatorValue = '';				
				for( i = 0 ; i < filterData.filterBy.length ; i++ )
				{
					var fieldName = filterData.filterBy[ i ].field;
					var fieldVal = filterData.filterBy[i].value1;
					var fieldVal2 = filterData.filterBy[i].value2;
					var fieldOper = filterData.filterBy[i].operator;
					
					currentFilterData = filterData.filterBy[i];
					operatorValue = filterData.filterBy[i].operator;
					
					if (fieldName === 'depositAccount') {
						$("#depositAccount").val(fieldVal);						
						$('#depositAccount').niceSelect('update');
						$('#depositAccount').niceSelect('update');
					} else if (fieldName === 'postingDatePicker') {
						$("#postingDatePicker").val(fieldVal);
					} else if (fieldName === 'depositTicketNmbr') {
						if (!Ext.isEmpty(operatorValue)) {
							if (!Ext.isEmpty(fieldVal)) {
								$('#depositTicketOperator').val(operatorValue);
								$('#depositTicketOperator').niceSelect('update');
								$('#depositTicket').val(fieldVal);
								if('bt'==operatorValue)
								{
									$('#depositTicketTo').show();	
									$('#depositTicket1').prop('disabled', false);
								}																
								if(!Ext.isEmpty(fieldVal2))
								{										
									$('#depositTicket1').val(fieldVal2);									
								}	
							}
						}
					} else if (fieldName === 'depositAmount') {
						if (!Ext.isEmpty(operatorValue)) {
							if (!Ext.isEmpty(fieldVal)) {
								$('#depositAmountOperator').val(operatorValue);
								$('#depositAmountOperator').niceSelect('update');
								$('#depositAmount').val(fieldVal);	
								if('bt'==operatorValue)
								{
									$('#depositAmountTo').show();	
									$('#depositAmount1').prop('disabled', false);
								}								
								if(!Ext.isEmpty(fieldVal2))
								{
									$('#depositAmount1').val(fieldVal2);
								}
							}
						}
					} else if (fieldName === 'serial') {
						if (!Ext.isEmpty(operatorValue)) {
							if (!Ext.isEmpty(fieldVal)) {
								$('#serialOperator').val(operatorValue);
								$('#serial').val(fieldVal);		
								if('bt'==operatorValue)
								{
									$('#serialTo').show();	
									$('#serial1').prop('disabled', false);
								}								
								if(!Ext.isEmpty(fieldVal2))
								{
									$('#serial1').val(fieldVal2);
								}								
							}
						}
					}else if (fieldName === 'lockBoxId') { // fieldName corrected as per JSON OUTPUT data
						if (!Ext.isEmpty(operatorValue)) {
							if (!Ext.isEmpty(fieldVal)) {
								$('#lockBoxNmbrOperator').val(operatorValue);
								$('#lockBoxNmbrOperator').niceSelect('update');
								$('#lockBoxNmbr').val(fieldVal);	
								if('bt'==operatorValue)
								{
									$('#lockBoxNmbrTo').show();	
									$('#lockBoxNmbr1').prop('disabled', false);
								}								
								if(!Ext.isEmpty(fieldVal2))
								{
									$('#lockBoxNmbr1').val(fieldVal2);
								}									
							}
						}
					}
					if (fieldName === 'postingDate') {
						me.setSavedFilterPostingDate(fieldName, currentFilterData);
					}
				}
				if(!Ext.isEmpty(filterCode)){
					$('#filterCode').val(filterCode);
				}
				$("input[type='text'][id='depositAccount']").prop('disabled', false);
				$("select[id='depositTicketOperator']").prop('disabled', false);
				$("select[id='depositAmountOperator']").prop('disabled', false);
				$("select[id='serialOperator']").prop('disabled', false);
				$("select[id='lockBoxNmbrOperator']").prop('disabled', false);
				$("input[type='text'][id='depositTicket']").prop('disabled', false);
				$("input[type='text'][id='depositAmount']").prop('disabled', false);
				
				if( $('#depositTicketOperator').val() != 'all' )
				{
					$('#depositTicket').removeAttr("disabled");
				}
				else
				{
					$('#depositTicket').val('');
					$('#depositTicket').attr("disabled", true);
				}
				if( $('#depositAmountOperator').val() != 'all' )
				{
					$('#depositAmount').removeAttr("disabled");
				}
				else
				{
					$('#depositAmount').val('');
					$('#depositAmount').attr("disabled", true);
				}
				
				if( $('#lockBoxNmbrOperator').val() != 'all' )
				{
					$('#lockBoxNmbr').removeAttr("disabled");
				}
				else
				{
					$('#lockBoxNmbr').val('');
					$('#lockBoxNmbr').attr("disabled", true);
				}
				$("input[type='text'][id='lockBoxNmbr']").prop('disabled', false);
				$("input[type='text'][id='filterCode']").prop('disabled', false);
				if (!Ext.isEmpty(filterCode)) {
					$('#filterCode').val(filterCode);
					$("#msSavedFilter option[value='"+filterCode+"']").attr("selected",true);
					$("#msSavedFilter").multiselect("refresh");
					var saveFilterChkBox = $("input[type='checkbox'][id='saveFilterChkBox']");
					saveFilterChkBox.prop('checked', true);
				}
				if( applyAdvFilter )
				{
					me.showAdvFilterCode = filterCode;
					me.applyAdvancedFilter(filterData);
				}
			},

			handleSavePreferences : function()
			{
				var me = this;
				var arrPref = me.getPreferencesToSave(false);
				if (arrPref) {
					me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
					me.postHandleSavePreferences, null, me, true);
					me.disablePreferencesButton("savePrefMenuBtn",true);
				}
				//me.savePreferences();
			},
			handleClearPreferences : function() {
				var me = this;
				//me.clearWidgetPreferences();
				me.disablePreferencesButton("savePrefMenuBtn",true);
				var arrPref = me.getPreferencesToSave(false);
				me.preferenceHandler.clearPagePreferences(me.strPageName, null,
						me.postHandleClearPreferences, null, me, true);
			},
			postHandleSavePreferences : function(data, args, isSuccess) {
				var me = this;
				me.disablePreferencesButton("savePrefMenuBtn",true);
				me.disablePreferencesButton("clearPrefMenuBtn",false);	
			},			
			getPreferencesToSave : function(localSave) {
				var me = this;
				var groupView = me.getGroupView();
				var grid = null;
				var arrCols = null, objCol = null, arrColPref = new Array(), arrPref = [], objFilterPref = null;
				var groupInfo = null, subGroupInfo = null;
				if (groupView) {
					grid = groupView.getGrid()
					var gridState = grid.getGridState();
					groupInfo = groupView.getGroupInfo() || '{}';
					subGroupInfo = groupView.getSubGroupInfo() || {};

					objFilterPref = me.getFilterPreferences();
					arrPref.push({
								"module" : "gridViewFilter",
								"jsonPreferences" : objFilterPref
							});
					if (groupInfo.groupTypeCode && subGroupInfo.groupCode) {
							if(( groupInfo.groupTypeCode !== 'DEPINQ_OPT_ADVFILTER' || groupInfo.groupTypeCode == 'DEPINQ_OPT_ADVFILTER' && subGroupInfo.groupCode == 'all')) {	
						arrPref.push({
							"module" : "groupByPref",
							"jsonPreferences" : {
								groupCode : groupInfo.groupTypeCode,
								subGroupCode : subGroupInfo.groupCode
							}
						});
						arrPref.push({
									"module" : subGroupInfo.groupCode,
									"jsonPreferences" : {
										'gridCols' : gridState.columns,
										'pgSize' : gridState.pageSize,
										'sortState' : gridState.sortState
									}
								});
						}
					}
				}
				return arrPref;
			},
			getFilterPreferences : function() {
				var me = this;
				var advFilterCode = null;
				var objFilterPref = {};				
				if (!Ext.isEmpty(me.savePrefAdvFilterCode)) {
					advFilterCode = me.savePrefAdvFilterCode;
				}
				var quickPref = {};
				quickPref.depositAccount = me.typeFilterVal;
				quickPref.depositDate = me.dateFilterVal;
				if (me.dateFilterVal === '13') {
					if (!Ext.isEmpty(me.dateFilterFromVal)
							&& !Ext.isEmpty(me.dateFilterToVal)) {
						quickPref.depositDateFrom = me.dateFilterFromVal;
						quickPref.depositDateTo = me.dateFilterToVal;					
					} else {
						var strSqlDateFormat = 'Y-m-d';
						var frmDate = me.getFromDepositDate().getValue();
						var toDate = me.getToDepositDate().getValue();
						fieldValue1 = Ext.util.Format.date(frmDate, 'Y-m-d');
						fieldValue2 = Ext.util.Format.date(toDate, 'Y-m-d');
						quickPref.depositDateFrom = fieldValue1;
						quickPref.depositDateTo = fieldValue2;
					}
				}
				objFilterPref.advFilterCode = advFilterCode;
				objFilterPref.quickFilter = quickPref;
				
				return objFilterPref;
			},
			savePreferences : function() {
				var me =this;
				var strUrl = me.urlGridFilterPref + '?' + csrfTokenName + '='
						+ csrfTokenValue;
				var arrPref = me.getPreferencesToSave(false);
				if (arrPref)
					Ext.Ajax.request({
								url :  strUrl,
								method : 'POST',
								jsonData : Ext.encode(arrPref),
								success : function(response) {
									var responseData = Ext
											.decode(response.responseText);
									var isSuccess;
									var title, strMsg, imgIcon;
									if (responseData.d.preferences
											&& responseData.d.preferences.success)
										isSuccess = responseData.d.preferences.success;
									if (isSuccess && isSuccess === 'N') {
										//if (!Ext.isEmpty(me.getBtnSavePreferences()))
										//	me.toggleSavePrefrenceAction(true);
										title = getLabel('SaveFilterPopupTitle',
												'Message');
										strMsg = responseData.d.preferences.error.errorMessage;
										imgIcon = Ext.MessageBox.ERROR;
										Ext.MessageBox.show({
													title : title,
													msg : strMsg,
													width : 200,
													cls : 'ux_popup',
													buttons : Ext.MessageBox.OK,
													icon : imgIcon
												});

									} else
									{
										me.toggleClearPrefrenceAction(true);
										Ext.MessageBox.show({
													title : title,
													msg : getLabel('prefSavedMsg',
															'Preferences Saved Successfully'),
													buttons : Ext.MessageBox.OK,
													cls : 'ux_popup',
													icon : Ext.MessageBox.INFO
										});
									}
								},
								failure : function() {
									var errMsg = "";
									Ext.MessageBox.show({
												title : getLabel(
														'instrumentErrorPopUpTitle',
														'Error'),
												msg : getLabel(
														'instrumentErrorPopUpMsg',
														'Error while fetching data..!'),
												buttons : Ext.MessageBox.OK,
												icon : Ext.MessageBox.ERROR
											});
								}
							});

			},
			saveFilterPreferences : function()
			{
				var me = this;
				var strUrl = me.urlGridFilterPref;
				var advFilterCode = null;
				var objFilterPref = {};
				var infoPanel = me.getDepositInquiryInformation();
				var filterViewCollapsed = (me.getFilterView().getCollapsed() === false) ? false : true; 
				var infoViewCollapsed = infoPanel.down('container[itemId="summInfoShowHideGridView"]').hasCls("icon_expand_summ");
				if( !Ext.isEmpty( me.savePrefAdvFilterCode ) )
				{
					advFilterCode = me.savePrefAdvFilterCode;
				}
				var objQuickFilterPref = {};
				objQuickFilterPref.depositAccount = me.typeFilterVal;
				objQuickFilterPref.depositDate = me.dateFilterVal;
				//objQuickFilterPref.filterPanelCollapsed = filterViewCollapsed;
				//objQuickFilterPref.infoPanelCollapsed = infoViewCollapsed;
				if( me.dateFilterVal === '7' )
				{

					if( !Ext.isEmpty( me.dateFilterFromVal ) && !Ext.isEmpty( me.dateFilterToVal ) )
					{

						objQuickFilterPref.depositDateFrom = me.dateFilterFromVal;
						objQuickFilterPref.depositDateTo = me.dateFilterToVal;
					}
					else
					{
						var strSqlDateFormat = 'Y-m-d';
						var frmDate = me.getFromDepositDate().getValue();
						var toDate = me.getToDepositDate().getValue();
						fieldValue1 = Ext.util.Format.date( frmDate, 'Y-m-d' );
						fieldValue2 = Ext.util.Format.date( toDate, 'Y-m-d' );
						objQuickFilterPref.depositDateFrom = fieldValue1;
						objQuickFilterPref.depositDateTo = fieldValue2;
					}
				}

				objFilterPref.advFilterCode = advFilterCode;
				objFilterPref.quickFilter = objQuickFilterPref;

				if( objFilterPref )
					Ext.Ajax.request(
					{
						url : strUrl + '?' + csrfTokenName + '=' + csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode( objFilterPref ),
						success : function( response )
						{
							var data = Ext.decode( response.responseText );
							var title = getLabel( 'SaveFilterPopupTitle', 'Message' );
							if( data.d.preferences && data.d.preferences.success === 'Y' )
							{
								Ext.MessageBox.show(
								{
									title : title,
									msg : getLabel( 'prefSavedMsg', 'Preferences Saved Successfully' ),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.INFO
								} );
							}
							else if( data.d.preferences && data.d.preferences.success === 'N' && data.d.error
								&& data.d.error.errorMessage )
							{
								//if( !Ext.isEmpty( me.getBtnSavePreferences() ) )
								//	me.toggleSavePrefrenceAction( true );
								//	me.toggleClearPrefrenceAction(false);
								Ext.MessageBox.show(
								{
									title : title,
									msg : data.d.error.errorMessage,
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								} );
							}
						},
						failure : function()
						{
							var errMsg = "";
							Ext.MessageBox.show(
							{
								title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
								msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							} );
						}
					} );
			},
			clearWidgetPreferences : function() {
				var me = this;
				//me.toggleSavePrefrenceAction(false);
				var strUrl = me.urlGridFilterPref + '?$clear=true' + '&'
						+ csrfTokenName + '=' + csrfTokenValue;
				var arrPref = me.getPreferencesToSave(false);
				if (arrPref) {
					Ext.Ajax.request({
								url : strUrl,
								method : 'POST',
								jsonData : Ext.encode(arrPref),
								success : function(response) {
									var responseData = Ext
											.decode(response.responseText);
									var isSuccess;
									var title, strMsg, imgIcon;
									if (responseData.d.preferences
											&& responseData.d.preferences.success)
									isSuccess = responseData.d.preferences.success;
									if (isSuccess && isSuccess === 'N') {
										title = getLabel('SaveFilterPopupTitle',
												'Message');
										strMsg = responseData.d.preferences.error.errorMessage;
										imgIcon = Ext.MessageBox.ERROR;
										Ext.MessageBox.show({
													title : title,
													msg : strMsg,
													width : 200,
													buttons : Ext.MessageBox.OK,
													icon : imgIcon
												});
			
									}
									else
									{
										//me.toggleSavePrefrenceAction(true);
										Ext.MessageBox.show(
										{
											title : title,
											msg : getLabel( 'prefClearedMsg', 'Preferences Cleared Successfully' ),
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.INFO
										} );
									}
			
								},
								failure : function() {
									var errMsg = "";
									Ext.MessageBox.show({
												title : getLabel(
														'instrumentErrorPopUpTitle',
														'Error'),
												msg : getLabel(
														'instrumentErrorPopUpMsg',
														'Error while fetching data..!'),
												buttons : Ext.MessageBox.OK,
												icon : Ext.MessageBox.ERROR
											});
								}
							});
				}
			},
			handleReportAction : function( actionName )
			{
				var me = this;
				me.downloadReport( actionName );
			},
			downloadReport : function( actionName )
			{
				var me = this;
				var withHeaderFlag = document.getElementById("headerCheckbox").checked;
				var arrExtension =
				{
					downloadXls : 'xls',
					downloadCsv : 'csv',
					loanCenterDownloadPdf : 'pdf',
					downloadTsv : 'tsv',
					downloadBAl2 : 'bai2'
				};
				var currentPage = 1;
				var strExtension = '';
				var strUrl = '';
				var strSelect = '';
				var activeCard = '';
				var viscols;
				var col = null;
				var visColsStr = "";
				var colMap = new Object();
				var colArray = new Array();
				var groupView = me.getGroupView();
				var subGroupInfo = groupView.getSubGroupInfo() || {};
				
				strExtension = arrExtension[ actionName ];
				strUrl = 'services/getDepositEnquiryList/getDepositEnquiryDynamicReport.' + strExtension;
				strUrl += '?$skip=1';
				var strQuickFilterUrl = me.getFilterUrl(subGroupInfo);
				strUrl += strQuickFilterUrl;
				var grid = groupView.getGrid();
				viscols = grid.getAllVisibleColumns();
				var strOrderBy = me.reportGridOrder;
				if(!Ext.isEmpty(strOrderBy)){
					var orderIndex = strOrderBy.indexOf('orderby');
					if(orderIndex > 0){
						strOrderBy = strOrderBy.substring(orderIndex-2,strOrderBy.length);	
						strUrl += strOrderBy;
					}					
				}
				for( var j = 0 ; j < viscols.length ; j++ )
				{
					col = viscols[ j ];
					if( col.dataIndex && arrSortColumnReport[ col.dataIndex ] )
					{
						if( colMap[ arrSortColumnReport[ col.dataIndex ] ] )
						{
							// ; do nothing
						}
						else
						{
							colMap[ arrSortColumnReport[ col.dataIndex ] ] = 1;
							colArray.push( arrSortColumnReport[ col.dataIndex ] );

						}
					}

				}
				if( colMap != null )
				{

					visColsStr = visColsStr + colArray.toString();
					strSelect = '&$select=[' + colArray.toString() + ']';
				}

				strUrl = strUrl + strSelect;
				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, tokenValue ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'txtCurrent', currentPage ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'txtCSVFlag', withHeaderFlag ) );
				form.action = strUrl;
				document.body.appendChild( form );
				form.submit();
				document.body.removeChild( form );
			},
			applySeekFilter : function()
			{
				var me = this;
				//me.toggleSavePrefrenceAction( true );
				//me.toggleClearPrefrenceAction(true);
				me.setDataForFilter();
				me.filterApplied = 'Q';
				me.applyQuickFilter();
			},			
			handleAccountChangeInQuickFilter : function(combo) {
				var me = this;
				s_depositAccount ='';
				isMenuClicked ='Y';
				var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
				var errorSpan = $('#quickFilterErrorDiv');
				var quickFilterDatePick = $('#depositDatePickerQuickText');
				if(!Ext.isEmpty(quickFilterDatePick.val()) && (combo.getValue() != 'Select Account' && combo.getValue() != '')){
				 	errorSpan.addClass('ui-helper-hidden');
				 }else if(combo.getValue() == 'Select Account' || combo.getValue() == ''){
					  errorSpan.removeClass('ui-helper-hidden');
					  $('#quickFilterErrorMessage').text("Please select Deposit Account");												 
				 }
				 else{
					  errorSpan.removeClass('ui-helper-hidden');
					  $('#quickFilterErrorMessage').text("Please select Posting Date");												 
				 }
				me.typeFilterVal = combo.getValue();
				me.typeFilterDesc = combo.getRawValue();
				if (savedFilterCombobox) {
					savedFilterCombobox.getStore().reload();
					savedFilterCombobox.setValue("");
				}
				$("#msSavedFilter").val("");
				$("#msSavedFilter").multiselect("refresh");
				$('#filterCode').val("");
				$("#filterCodeLabel").removeClass("required");
				var saveFilterChkBox = $("input[type='checkbox'][id='saveFilterChkBox']");
					saveFilterChkBox.prop('checked', false);
				if($('#filterCode').hasClass('requiredField'))
				{
					$('#filterCode').removeClass('requiredField');
				}
				me.handleAccountsFieldSync('Q', 'depositAccount',me.typeFilterVal,me.typeFilterDesc );
				me.filterApplied = 'Q';
				me.setDataForFilter();
				me.applyQuickFilter();
			},
			handleClearSettings : function() {
				var me = this;
				var objGroupView = me.getGroupView();
				me.typeFilterVal = '';
				if(isClientUser()){
					var clientComboBox = me.getDepositFilterView()
							.down('combo[itemId="clientCombo"]');
					me.clientFilterVal = 'all';
					selectedFilterClientDesc = "";
					selectedFilterClient = "";
					selectedClientDesc = "";
					clientComboBox.setValue(me.clientFilterVal);
				} else {
					var clientComboBox = me.getDepositFilterView()
							.down('combo[itemId="clientAuto]');
					clientComboBox.reset();
					me.clientFilterVal = '';
					selectedFilterClientDesc = "";
					selectedFilterClient = "";
					selectedClientDesc = "";
				}	
				if(!Ext.isEmpty(me.savedFilterVal))
					me.savedFilterVal = "";
				var quickFilterAccountCombo = me.getDepositFilterView()
						.down('combo[itemId="quickFilterAccountCombo"]');
				quickFilterAccountCombo.setValue(quickFilterAccountCombo.getStore().getAt(0));
				
				//me.savedFilterVal = '';
				var savedFilterComboBox = me.getDepositFilterView()
						.down('combo[itemId="savedFiltersCombo"]');
				savedFilterComboBox.setValue(me.savedFilterVal);
				me.dateFilterVal = '1';
				me.dateFilterLabel = getLabel('today', 'Today'),
				me.handleDateChange(me.dateFilterVal);	
				me.advFilterData = null;				
				me.filterApplied = 'Q';
				if (objGroupView)
					objGroupView.toggleFilterIcon(false);
				objGroupView.setFilterToolTip('');
				
				if(_availableClients> 1)
					$("#summaryClientFilterSpan").text('All Companies');
				$("#summaryClientFilter").val('');
				me.resetAllFields();
				me.setDataForFilter();
				me.refreshData();
				
				var errorSpan = $('#quickFilterErrorDiv');
				errorSpan.removeClass('ui-helper-hidden');
				$('#quickFilterErrorMessage').text("Please select Deposit Account");			
			},
			refreshData : function() {
				var me = this;
				var objGroupView = me.getGroupView();
				var grid = objGroupView.getGrid();
				if (grid) {
					if (!Ext.isEmpty(me.advSortByData)) {
						appliedSortByJson = me.getSortByJsonForSmartGrid();
						grid.removeAppliedSort();
						grid.applySort(appliedSortByJson);
					} else {
						grid.removeAppliedSort();
					}
				}
				objGroupView.refreshData();
			},
			handleAdvFilterEntryDateChange : function() {
				var me = this;
				var index = '13';
				var dateToField;
				var objDateParams = me.getDateParam(index);
				var vFromDate = Ext.util.Format.date(Ext.Date.parse(
								objDateParams.fieldValue1, 'Y-m-d'),
						strExtApplicationDateFormat);
				var vToDate = Ext.util.Format.date(Ext.Date.parse(
								objDateParams.fieldValue2, 'Y-m-d'),
						strExtApplicationDateFormat);
				var filterOperator = objDateParams.operator;

				if (index == '13') {
					if (filterOperator == 'eq') {
						$('#entryDatePicker').setDateRangePickerValue(vFromDate);
					} else {
						$('#entryDatePicker').setDateRangePickerValue([vFromDate, vToDate]);
					}
					if (filterOperator == 'eq')
						dateToField = "";
					else
						dateToField = vToDate;
					selectedPostingDateFilter = {
						operator : filterOperator,
						fromDate : vFromDate,
						toDate : dateToField,
						label : '',
						btnValue : index
					};
				}
			},
			handleClientChangeInQuickFilter : function(isSessionClientFilter) {
				var me = this;
				if (isSessionClientFilter)
					me.clientFilterVal = selectedFilterClient;
				else
					me.clientFilterVal = isEmpty(selectedClient)
							? 'all'
							: selectedClient;
				me.clientFilterDesc = selectedFilterClientDesc;					
				me.filterApplied = 'Q';
				me.setDataForFilter();
				if (me.clientFilterVal == 'all') {
					me.savedFilterVal = null;
					me.filterApplied = 'ALL';
					me.refreshData();
				} else {
					me.applyQuickFilter();
				}
			},
			setSavedFilterPostingDate : function(dateType, data) {
				if (!Ext.isEmpty(dateType) && !Ext.isEmpty(data)) {
					var me = this;
					var dateFilterRef = null;
					var dateOperator = data.operator;
					var dateLable = data.btnValuelable;
					var datebtnValue = data.btnValue;
					var objDateParams  = me.getDateParam( datebtnValue );
						me.dateFilterVal = datebtnValue;
						me.postingDateFilterVal = datebtnValue; 
						me.postingDateFilterLabel = dateLable;
						me.dateFilterLabel = dateLable;
					if (dateType === 'postingDate') {
						dateFilterRef = $('#postingDatePicker');
						$('label[for="PostingDateLabel"]').text(getLabel('postingDate',
						'Posting Date')
						+ " (" + dateLable + ")");
						updateToolTip('postingDate', getLabel('postingDate','Posting Date')+ " (" + dateLable + ")");
					}

					if (dateOperator === 'eq') {
						var fromDate = objDateParams.fieldValue1;
						if (!Ext.isEmpty(fromDate)) {
							var formattedFromDate = Ext.util.Format.date(Ext.Date
											.parse(fromDate, 'Y-m-d'),
									strExtApplicationDateFormat);
							$(dateFilterRef).val(formattedFromDate);
						}

					} else if (dateOperator === 'bt') {
						var fromDate = objDateParams.fieldValue1;
						if (!Ext.isEmpty(fromDate)) {
							var formattedFromDate = Ext.util.Format.date(Ext.Date
											.parse(fromDate, 'Y-m-d'),
									strExtApplicationDateFormat);
							var toDate = objDateParams.fieldValue2;
							if (!Ext.isEmpty(toDate)) {
								var formattedToDate = Ext.util.Format.date(Ext.Date
												.parse(toDate, 'Y-m-d'),
										strExtApplicationDateFormat);
								$(dateFilterRef).setDateRangePickerValue([
										formattedFromDate, formattedToDate]);
							}
						}
					}
					selectedPostingDateFilter = {
						operator : dateOperator,
						fromDate : formattedFromDate,
						toDate : formattedToDate,
						label : dateLable,
						btnValue : datebtnValue
					};
					
				} else {
				}
			},
			saveAndSearchActionClicked : function(me) {
				me.savedFilterVal = null;	
				me.handleSaveAndSearchAction();
			},
			searchActionClicked : function(me) {
				var me = this, objGroupView = null, savedFilterCombobox = me
				.getFilterView().down('combo[itemId="savedFiltersCombo"]');
				var SaveFilterChkBoxVal = $("input[type='checkbox'][id='saveFilterChkBox']")
				.is(':checked');
				if (SaveFilterChkBoxVal === true) {
					me.handleSaveAndSearchAction();
				} else {
					me.doSearchOnly();
					if (savedFilterCombobox)
						savedFilterCombobox.setValue('');
					objGroupView = me.getGroupView();
					objGroupView.setFilterToolTip('');
				}
				//var filterCode = $('#filterCode').val();
				//me.savedFilterVal = filterCode;
				//me.doSearchOnly();
				//me.updateSavedFilterComboInQuickFilter();
			},
			reloadFilters: function(store){
				store.reload({
								callback : function() {
									var storeGrid = filterGridStore();
									store.loadRecords(
											storeGrid.getRange(0, storeGrid
															.getCount()), {
												addRecords : false
											});

								}
							});
			},
			resetAllFields : function() {
				var me = this;
				$("input[type='text'][id='depositAccount']").val("");
				$("#depositAccount").val("");
				$('#depositAccount').niceSelect('update');
				if($('#depositAccount-niceSelect').hasClass('requiredField'))
				{
					$('#depositAccount-niceSelect').removeClass('requiredField');
				}
				//$("#depositAccount").multiselect("refresh");
				$("input[type='text'][id='depositTicket']").val("");
				$("#depositTicketOperator").val('');
				$("#depositTicketOperator").niceSelect('update');
				$("input[type='text'][id='depositAmount']").val("");
				$("#depositAmountOperator").val('all');
				$('#depositAmountOperator').niceSelect('update');
				$("#depositAmountOperator").niceSelect('update');
				$("input[type='text'][id='serial']").val("");
				$("#serialOperator").val('');
				$('#div_serialNmbr').hide();
				$("input[type='text'][id='lockBoxNmbr']").val("");
				$("#lockBoxNmbrOperator").val('');
				$("#lockBoxNmbrOperator").niceSelect('update');
				//$("#statusAdvFilter").val("All");
				if(Ext.isEmpty(strDateFilterVal))
				{
					me.dateFilterVal = '1';
					me.dateFilterLabel = getLabel('today', 'Today');
				}
				else
				{
					me.dateFilterVal = strDateFilterVal;
					me.dateFilterLabel = strDateFilterLabel;
				}
				me.handlePostingDateChange(me.dateFilterVal);	
				//$("#postingDatePicker").val("");
				//selectedPostingDateFilter={};
				$("input[type='text'][id='filterCode']").val("");
				$("input[type='text'][id='filterCode']").prop('disabled', false);
				if($('#filterCode').hasClass('requiredField'))
				{
					$('#filterCode').removeClass('requiredField');
				}
				$("#depositTicket1").val('');
				$("#depositAmount1").val('');				
				$("#serial1").val('');
				$("#lockBoxNmbr1").val('');				
				$('#depositTicketTo').hide();
				$('#depositAmountTo').hide();
				$('#lockBoxNmbrTo').hide();
				$('#serialTo').hide();
				$("#msSavedFilter").val("");
				$("#msSavedFilter").multiselect("refresh");
				$("#filterCodeLabel").removeClass("required");
				$("#saveFilterChkBox").attr('checked', false);
				$('#tabs-2 :input:disabled').prop('disabled',false);
				$('#depositAccount-niceSelect').bind('blur',function(){
					markRequired(this);
				});
				$('#depositAccount-niceSelect').bind('focus',function(){
					removeMarkRequired(this);
				});
				$("#filterCode").bind('blur',function(){
					if($("#saveFilterChkBox").is(":checked"))
					{
						markRequired(this);	
					}else
					{
						$("#filterCode").removeClass("requiredField");
					}
				});
			},
			updateSavedFilterComboInQuickFilter : function() {
				var me = this;
				var savedFilterCombobox = me.getFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
				if (!Ext.isEmpty(savedFilterCombobox)
						&& savedFilterCombobox.getStore().find('code',
								me.filterCodeValue) >= 0) {
					savedFilterCombobox.getStore().reload();
					if (me.filterCodeValue != null) {
						me.savedFilterVal = me.filterCodeValue;
					} else {
						me.savedFilterVal = '';
					}
					savedFilterCombobox.setValue(me.savedFilterVal);
					me.filterCodeValue = null;
				}
			},
			disablePreferencesButton: function(btnId,boolVal){
				$("#"+btnId).attr("disabled",boolVal);
				if(boolVal)
					$("#"+btnId).css("color",'grey');
				else
					$("#"+btnId).css("color",'#FFF');
			},
			closeFilterPopup : function(btn) {
				var me = this;
				$('#depAdvancedFilterPopup').dialog('close');
			},
			postingDateChange : function(btn, opts) {
				var me = this;
				me.postingDateFilterVal = btn.btnValue;
				me.postingDateFilterLabel = btn.text;
				me.dateFilterVal = btn.btnValue;
				me.dateFilterLabel = btn.text;
				me.handlePostingDateChange(btn.btnValue);
			},
			handlePostingDateChange:function(index){
				var me = this;
				var dateToField;
				var objDateParams = me.getDateParam(index,'postingDate');

				if (!Ext.isEmpty(me.postingDateFilterLabel)) {
					$('label[for="PostingDateLabel"]').text(getLabel('postingDate',
							'Posting Date')
							+ " (" + me.postingDateFilterLabel + ")");
					/*$('label[for="PostingDateLabel"]').text(getLabel('postingDate',
							'Posting Date'));*/
				}
					var vFromDate = Ext.util.Format.date(Ext.Date.parse(
									objDateParams.fieldValue1, 'Y-m-d'),
							strExtApplicationDateFormat);
					var vToDate = Ext.util.Format.date(Ext.Date.parse(
									objDateParams.fieldValue2, 'Y-m-d'),
							strExtApplicationDateFormat);
					var filterOperator=objDateParams.operator;
					updateToolTip('postingDate', getLabel('postingDate','Posting Date')+ " (" + me.postingDateFilterLabel + ")");
					if (index == '13') {
						if (filterOperator == 'eq') {
							$('#postingDatePicker').setDateRangePickerValue(vFromDate);
						} else {
							$('#postingDatePicker').setDateRangePickerValue([
									vFromDate, vToDate]);
						}
						//if(filterOperator=='eq')
						//	dateToField="";
						//else
							dateToField=vToDate;
						selectedPostingDateFilter={
							operator:filterOperator,
							fromDate:vFromDate,
							toDate:dateToField,
							label : me.postingDateFilterLabel,
							btnValue : index
						};
					} else {
						if (index === '1' || index === '2' ) {
								$('#postingDatePicker').setDateRangePickerValue(vFromDate);
						} else {
							$('#postingDatePicker').setDateRangePickerValue([
									vFromDate, vToDate]);
						}
						//if(filterOperator=='eq')
						//	dateToField="";
						//else
							dateToField=vToDate;
						selectedPostingDateFilter={
							operator:filterOperator,
							fromDate:vFromDate,
							toDate:dateToField,
							label : me.postingDateFilterLabel,
							btnValue : index
						};
					}
			},
			handleSavedFilterClick : function() {
				var me = this;
				var savedFilterVal = $("#msSavedFilter").val();
				me.resetAllFields();
				me.filterCodeValue = null;

				var filterCodeRef = $("input[type='text'][id='filterCode']");
				if (!Ext.isEmpty(filterCodeRef)) {
					filterCodeRef.val(savedFilterVal);
				}

				var saveFilterChkBoxRef = $("input[type='checkbox'][id='saveFilterChkBox']");
				if (!Ext.isEmpty(saveFilterChkBoxRef) && !Ext.isEmpty(savedFilterVal))
					saveFilterChkBoxRef.prop('checked', true);

				var applyAdvFilter = false;
				me.filterCodeValue = savedFilterVal;
				if(!Ext.isEmpty(me.filterCodeValue))
				{
				me.getSavedFilterData(savedFilterVal, this.populateSavedFilter,
						applyAdvFilter);
				}
				else
				{
					if( $('#depositTicketOperator').val() == 'all' )
					{
						$('#depositTicket').val('');
						$('#depositTicket').attr("disabled", true);
					}				
					if( $('#depositAmountOperator').val() == 'all' )
					{
						$('#depositAmount').val('');
						$('#depositAmount').attr("disabled", true);
					}
					if( $('#lockBoxNmbrOperator').val() == 'all' )
					{
						$('#lockBoxNmbr').val('');
						$('#lockBoxNmbr').attr("disabled", true);
					}
				}
				

			},
			findInQuickFilterData : function(arr, key) {
				var reqJson = null;
				for (var ai, i = arr.length; i--;) {
					if ((ai = arr[i]) && ai.paramName == key) {
						reqJson = ai;
					}
				}
				return reqJson;
			},
			removeFromQuickArrJson : function(arr, key) {
				for (var ai, i = arr.length; i--;) {
					if ((ai = arr[i]) && ai.paramName == key) {
						arr.splice(i, 1);
					}
				}
				return arr;
			},
			findInAdvFilterData : function(arr, key) {
				var reqJson = null;
				for (var ai, i = arr.length; i--;) {
					if ((ai = arr[i]) && ai.field == key) {
						reqJson = ai;
					}
				}
				return reqJson;
			},
			removeFromAdvanceArrJson : function(arr,key){
				for (var ai, i = arr.length; i--;) {
					if ((ai = arr[i]) && ai.field == key) {
						arr.splice(i, 1);
					}
				}
				return arr;
			},
			setSessionId : function( grid )
			{
				var me = this;
				var groupView = me.getGroupView();
				var depositInqGridRef = groupView.getGrid();
				if (!Ext.isEmpty(depositInqGridRef)) {
					var dataStore = depositInqGridRef.store;
					dataStore.on( 'load', function( store, records )
					{
						var i = records.length - 1;
						if( i >= 0 )
						{
							if(!Ext.isEmpty(records[ i ].get( 'sessionId' )))
								me.sessionID = 	records[ i ].get( 'sessionId' );	
						}
					} );
				}
			},			
			handleGridRowClick : function(record, grid,columnType) {
				if(columnType !== 'actioncontent' && columnType !== 'checkboxColumn') {
				var me = this;
				var columnModel = null;
				var columnAction = null;
				if (!Ext.isEmpty(grid.columnModel)) {
					columnModel = grid.columnModel;
					for (var index = 0; index < columnModel.length; index++) {
						if (columnModel[index].colId == 'actioncontent') {
							columnAction = columnModel[index].items;
							break;
						}
					}
				}
				var arrVisibleActions = [];
				var arrAvailableActions = [];
				if (!Ext.isEmpty(columnAction))
					arrAvailableActions = columnAction;
				var store = grid.getStore();
				var jsonData = store.proxy.reader.jsonData;
				if (!Ext.isEmpty(arrAvailableActions)) {
					for (var count = 0; count < arrAvailableActions.length; count++) {
						var btnIsEnabled = false;
						if (!Ext.isEmpty(grid) && !Ext.isEmpty(grid.isRowIconVisible)) {
							btnIsEnabled = grid.isRowIconVisible(store, record,
									jsonData, arrAvailableActions[count].itemId,
									arrAvailableActions[count].maskPosition);
							if (btnIsEnabled == true) {
								arrVisibleActions.push(arrAvailableActions[count]);
								btnIsEnabled = false;
							}
						}
					}
				}
				if (!Ext.isEmpty(arrVisibleActions)) {
					me.doHandleRowActions(arrVisibleActions[0].itemId, grid, record);
				}
				} else {
					
				}
			},
			/*Page setting handling ends here*/
			handleEntryDateSync : function(valueChangedAt, sourceLable, sourceToolTipText, sourceTextRef) {
				var me = this, labelToChange, valueControlToChange, updatedDateValue;
				
				labelToChange = (valueChangedAt === 'Q') ? $('label[for="PostingDateLabel"]') : me.getDateLabel();
				valueControlToChange = (valueChangedAt === 'Q') ? $('#postingDatePicker') : $('#depositDatePickerQuickText');
				updatedDateValue = sourceTextRef.getDateRangePickerValue();
				
				if(labelToChange && valueControlToChange && valueControlToChange.hasClass('is-datepick')) {
					if(valueChangedAt === 'Q') {
						labelToChange.text(sourceLable);
						updateToolTip('postingDate', sourceToolTipText);
					} else {
						labelToChange.setText(sourceLable);
					}
					if(!Ext.isEmpty(updatedDateValue)) {
						valueControlToChange.setDateRangePickerValue(updatedDateValue);
					}
				}
			},
			handleAppliedFilterDelete : function(btn){
				var me = this;
				var objData = btn.data;
				var advJsonData = me.advFilterData;
				var quickJsonData = me.filterData;
				var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
				if (savedFilterCombobox) {
					savedFilterCombobox.getStore().reload();
					savedFilterCombobox.setValue("");
				}
				$("#msSavedFilter").val("");
				$("#msSavedFilter").multiselect("refresh");
				$('#filterCode').val("");
				$("#filterCodeLabel").removeClass("required");
				var saveFilterChkBox = $("input[type='checkbox'][id='saveFilterChkBox']");
					saveFilterChkBox.prop('checked', false);
				if($('#filterCode').hasClass('requiredField'))
				{
					$('#filterCode').removeClass('requiredField');
				}
				if(!Ext.isEmpty(objData)){
					var paramName = objData.paramName || objData.field;
					var reqJsonInAdv = null;
					var arrAdvJson =null;
					//adv
					var reqJsonInAdv = me.findInAdvFilterData(advJsonData,paramName);
					if (!Ext.isEmpty(reqJsonInAdv)) {
						arrAdvJson = advJsonData;
						arrAdvJson = me
								.removeFromAdvanceArrJson(arrAdvJson,paramName);
						me.advFilterData = arrAdvJson;
					}
					// quick
					else {
						var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,paramName);
						if (!Ext.isEmpty(reqJsonInQuick)) {
							arrQuickJson = quickJsonData;
							arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,paramName);
							me.filterData = arrQuickJson;
						}
					}
					me.resetFieldInAdvAndQuickOnDelete(objData);
					me.refreshData();
					
					if(objData.field == "depositAccount"){
						var errorSpan = $('#quickFilterErrorDiv');
						errorSpan.removeClass('ui-helper-hidden');
						$('#quickFilterErrorMessage').text("Please select Deposit Account");												 
					}
					
				}
			},
			resetFieldInAdvAndQuickOnDelete : function(objData){
				var me = this,strFieldName;
				if(!Ext.isEmpty(objData))
					strFieldName = objData.paramName || objData.field;
				if (strFieldName === 'depositTicketNmbr')
					$("input[type='text'][id='depositTicket']").val("");
				else if (strFieldName === 'depositAmount')
					$("input[type='text'][id='depositAmount']").val("");
				else if (strFieldName === 'lockBoxId')
					$("input[type='text'][id='lockBoxNmbr']").val("");
				else if (strFieldName === 'serial')
					$("input[type='text'][id='lockBoxNmbr']").val("");
				else if (strFieldName === 'depositAccount')
				{
					$('#depositAccount option').prop('selected', true);
					$("#depositAccount").multiselect("refresh");
					$('#depositAccount').niceSelect('update');
					
					
					var quickFilterAccountCombo = me.getDepositFilterView().down('combo[itemId="quickFilterAccountCombo"]');
					//quickFilterAccountCombo.setValue('Select Account');
					quickFilterAccountCombo.setValue(quickFilterAccountCombo.getStore().getAt(0));
					me.typeFilterVal = null;
					me.typeFilterDesc = null;
					$("#depositAccount").val('');
					$('#depositAccount').niceSelect('update');
				}
				else if(strFieldName === 'postingDate'){
				    var datePickerRef = $('#depositDatePickerQuickText');
					datePickerRef.val('');
					me.dateFilterVal = '';
					selectedPostingDateFilter={};
					$('#postingDatePicker').val("");
				}
				else if(strFieldName ==='clientId'){
									
					if(isClientUser()){
						var clientComboBox = me.getDepositFilterView()
								.down('combo[itemId="clientCombo"]');
						me.clientFilterVal = 'all';
						selectedFilterClientDesc = "";
						selectedFilterClient = "";
						selectedClientDesc = "";
						clientComboBox.setValue(me.clientFilterVal);
					} else {
						var clientComboBox = me.getDepositFilterView()
								.down('combo[itemId="clientAuto]');
						clientComboBox.reset();
						me.clientFilterVal = '';
						selectedFilterClientDesc = "";
						selectedFilterClient = "";
					}
				}
			},
			handleAccountsFieldSync : function(type,statusData,code,statusDataDesc){
				var me = this;
				if(!Ext.isEmpty(type)){
					if(type === 'Q'){
						var objStatusField = $("#depositAccount");
						var objQuickStatusField = me.getDepositFilterView().down('combo[itemId="quickFilterAccountCombo"]');
						if(!Ext.isEmpty(statusData)){
							objStatusField.val(statusDataDesc);
						}
						else if(Ext.isEmpty(statusData)){
							objStatusField.val('');
						}
						objStatusField.multiselect("refresh");
						objStatusField.niceSelect('update');
					}
					if(type === 'A'){
						var objStatusField = me.getFilterView().down('combo[itemId="quickFilterAccountCombo"]');
						if(!Ext.isEmpty(statusData)) {
							me.typeFilterVal = code;
							me.typeFilterDesc = statusDataDesc;
							objStatusField.setValue(statusDataDesc);
						} else {							
							objStatusField.setValue(statusDataDesc);
							me.typeFilterVal = null;
							me.typeFilterDesc = null;
						}
					}
				}
			},
			applyPageSetting : function(arrPref, strInvokedFrom) {
				var me = this, args = {};
				me.applyPageSettingFlag =true;
				if (!Ext.isEmpty(arrPref)) {
					if (strInvokedFrom === 'GRID'
							&& _charCaptureGridColumnSettingAt === 'L') {
						/**
						 * This handling is required for non-us market
						 */
						var groupView = me.getGroupView(), subGroupInfo = groupView
								.getSubGroupInfo()
								|| {}, objPref = {}, groupInfo = groupView
								.getGroupInfo()
								|| '{}', strModule = subGroupInfo.groupCode;
						Ext.each(arrPref || [], function(pref) {
									if (pref.module === 'ColumnSetting') {
										objPref = pref.jsonPreferences;
									}
								});
						args['strInvokedFrom'] = strInvokedFrom;
						args['objPref'] = objPref;
						strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'
								+ strModule : strModule;
						me.preferenceHandler.saveModulePreferences(me.strPageName,
								strModule, objPref, me.postHandlePageGridSetting, args,
								me, false);
					} else {
						me.preferenceHandler.savePagePreferences(me.strPageName,
								arrPref, me.postHandlePageGridSetting, args, me, false);
					}
				}
			},
			postHandlePageGridSetting : function(data, args, isSuccess) {
				if (isSuccess === 'Y') {
					var me = this;
					if (args && args.strInvokedFrom === 'GRID'
							&& _charCaptureGridColumnSettingAt === 'L') {
						var objGroupView = me.getGroupView(), gridModel = null;
						if (args.objPref && args.objPref.gridCols)
							gridModel = {
								columnModel : args.objPref.gridCols
							}
						// TODO : Preferences and existing column model need to be
						// merged
						objGroupView.reconfigureGrid(gridModel);
					} else
						window.location.reload();
				} else {
					Ext.MessageBox.show({
						title : getLabel('instrumentErrorPopUpTitle', 'Error'),
						msg : getLabel('errorMsg', 'Error while apply/restore setting'),
						buttons : Ext.MessageBox.OK,
						cls : 't7-popup',
						icon : Ext.MessageBox.ERROR
					});
				}
			},
			restorePageSetting : function(arrPref, strInvokedFrom) {
				var me = this;
				if (strInvokedFrom === 'GRID'
						&& _charCaptureGridColumnSettingAt === 'L') {
					var groupView = me.getGroupView(), subGroupInfo = groupView
							.getSubGroupInfo()
							|| {}, objPref = {}, groupInfo = groupView.getGroupInfo()
							|| '{}', strModule = subGroupInfo.groupCode, args = {};
					strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'
							+ strModule : strModule;
					args['strInvokedFrom'] = strInvokedFrom;
					Ext.each(arrPref || [], function(pref) {
								if (pref.module === 'ColumnSetting') {
									pref.module = strModule;
									return false;
								}
							});
					me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref,
							me.postHandleRestorePageSetting, args, me, false);
				} else
					me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref,
							me.postHandleRestorePageSetting, null, me, false);
			},
			postHandleRestorePageSetting : function(data, args, isSuccess) {
				if (isSuccess === 'Y') {
					var me = this;
					if (args && args.strInvokedFrom === 'GRID'
							&& _charCaptureGridColumnSettingAt === 'L') {
						var objGroupView = me.getGroupView();
						if (objGroupView)
							objGroupView.reconfigureGrid(null);
					} else
						window.location.reload();
				} else {
					Ext.MessageBox.show({
						title : getLabel('instrumentErrorPopUpTitle', 'Error'),
						msg : getLabel('errorMsg', 'Error while apply/restore setting'),
						buttons : Ext.MessageBox.OK,
						cls : 't7-popup',
						icon : Ext.MessageBox.ERROR
					});
				}
			},
			savePageSetting : function(arrPref, strInvokedFrom) {
				/* This will be get invoked from page level setting always */
				var me = this, args = {};
				if (!Ext.isEmpty(arrPref)) {
					me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
							me.postHandleSavePageSetting, args, me, false);
				}
			},
			postHandleSavePageSetting : function(data, args, isSuccess) {
				if (isSuccess === 'N')  {
					Ext.MessageBox.show({
						title : getLabel('instrumentErrorPopUpTitle', 'Error'),
						msg : getLabel('errorMsg', 'Error while apply/restore setting'),
						buttons : Ext.MessageBox.OK,
						cls : 't7-popup',
						icon : Ext.MessageBox.ERROR
					});
				}
			},
			/*Page setting handling starts here*/
			showPageSettingPopup : function(strInvokedFrom) {
				var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
				var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeMaster,strTitle = null;

				me.pageSettingPopup = null;

				if (!Ext.isEmpty(objDepTicketPref)) {
					objPrefData = Ext.decode(objDepTicketPref);
					objGeneralSetting = objPrefData && objPrefData.d.preferences
							&& objPrefData.d.preferences.GeneralSetting
							? objPrefData.d.preferences.GeneralSetting
							: null;
					objGridSetting = objPrefData && objPrefData.d.preferences
							&& objPrefData.d.preferences.GridSetting
							? objPrefData.d.preferences.GridSetting
							: null;
					/**
					 * This default column setting can be taken from
					 * preferences/gridsets/uder defined( js file)
					 */
					objColumnSetting = objPrefData && objPrefData.d.preferences
							&& objPrefData.d.preferences.ColumnSetting
							&& objPrefData.d.preferences.ColumnSetting.gridCols
							? objPrefData.d.preferences.ColumnSetting.gridCols
							: (DEPOSIT_GENERIC_COLUMN_MODEL || '[]');

					if (!Ext.isEmpty(objGeneralSetting)) {
						objGroupByVal = objGeneralSetting.defaultGroupByCode;
						objDefaultFilterVal = objGeneralSetting.defaultFilterCode;
					}
					if (!Ext.isEmpty(objGridSetting)) {
						objGridSizeVal = objGridSetting.defaultGridSize;
						objRowPerPageVal = objGridSetting.defaultRowPerPage;
					}
				}

				objData["groupByData"] = objGroupView
						? objGroupView.cfgGroupByData
						: [];
				objData["filterUrl"] = 'services/userfilterslist/depositInqFilter';
				objData["rowPerPage"] = _AvailableGridSize;
				objData["groupByVal"] = objGroupByVal;
				objData["filterVal"] = objDefaultFilterVal;
				objData["gridSizeVal"] = objGridSizeVal;
				objData["rowPerPageVal"] = objRowPerPageVal;
				strTitle = (strInvokedFrom === 'GRID' ? getLabel("columnSettings",
						"Column Settings") + ' : ' + (subGroupInfo.groupDescription||'')  : getLabel("Settings", "Settings"));
				me.pageSettingPopup = Ext.create('Ext.ux.gcp.PageSettingPopUp', {
							cfgPopUpData : objData,
							cfgGroupView : objGroupView,
							cfgDefaultColumnModel : objColumnSetting,
							cfgViewOnly : _IsEmulationMode
						});
				me.pageSettingPopup.show();
				me.pageSettingPopup.center();
			},
			assignSavedFilter: function(){
				var me= this;
				if(me.firstTime){
					me.firstTime = false;
					
					if (objDepTicketPref) {
						var objJsonData = Ext.decode(objDepTicketPref);
						if (!Ext.isEmpty(objJsonData.d.preferences)  && 'Y' == isMenuClicked) {
							if (!Ext
									.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
								if (!Ext
										.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
									var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
									if(advData === me.getDepositFilterView().down('combo[itemId="savedFiltersCombo"]').getValue()){
										$("#msSavedFilter option[value='"+advData+"']").attr("selected",true);
										$("#msSavedFilter").multiselect("refresh");
										me.savedFilterVal = advData;
										me.handleSavedFilterClick();
									}
								}
							}
						}
					}
				}
			}
		} );
function handleFilterDataValidation(blnFilterSave,strFilterCodeVal) 
{
	var arrError = new Array(),isValidSearch=true;
	var depositAmountOperator = $('#depositAmountOperator').val();
	var depositTicketOperator = $('#depositTicketOperator').val();
	var lockBoxNmbrOperator =$('#lockBoxNmbrOperator').val();
	if (blnFilterSave && Ext.isEmpty(strFilterCodeVal)) {
		arrError.push({	"errorMessage" : "Please Enter Filter Name"});	
		$('#filterCode').addClass('requiredField');
	}
	if (Ext.isEmpty($('#depositAccount').val())) {
		arrError.push({	"errorMessage" : "Please select Deposit Account"});
		$('#depositAccount').addClass('requiredField');
		$('#depositAccount').niceSelect('update');
		$('#depositAccount-niceSelect').bind('blur',function(){
			markRequired(this);
		});		
		$('#depositAccount-niceSelect').bind('focus',function(){
			removeMarkRequired(this);
		});
	}
	if (Ext.isEmpty($('#postingDatePicker').val())) {
		arrError.push({	"errorMessage" : "Please select Posting Date"});
	}
     if(depositTicketOperator == 'bt' && (Ext.isEmpty($('#depositTicket').val()) || Ext.isEmpty($('#depositTicket1').val())) )
	{
		if (Ext.isEmpty($('#depositTicket').val())) {
			arrError.push({	"errorMessage" : "Please enter valid values for From Deposit Ticket"});
			$('#depositTicket').addClass('requiredField');
			$('#depositTicket').bind('blur',function(){
				markRequired(this);
			});		
			$('#depositTicket').bind('focus',function(){
				removeMarkRequired(this);
			});
		}
		if (Ext.isEmpty($('#depositTicket1').val())) {
			arrError.push({	"errorMessage" : "Please enter valid values for To Deposit Ticket"});
			$('#depositTicket1').addClass('requiredField');
			$('#depositTicket1').bind('blur',function(){
				markRequired(this);
			});		
			$('#depositTicket1').bind('focus',function(){
				removeMarkRequired(this);
			});
		}
	}
	else if(depositTicketOperator != 'all')
	{
		if(!Ext.isEmpty($('#depositTicket').val()))
		{
			var temp = $('#depositTicket').val();
			var pattern = /^\d+$/;
			if(!pattern.test(temp))
			{
				arrError.push({	"errorMessage" : "Only numeric values allowed for Deposit Ticket field."});
			}
		}
		if(!Ext.isEmpty($('#depositTicket1').val()))
		{
			var temp = $('#depositTicket1').val();
			var pattern = /^\d+$/;
			if(!pattern.test(temp))
			{
				arrError.push({	"errorMessage" : "Only numeric values allowed for To Deposit Ticket field."});
			}
		}
	}

    if(depositAmountOperator == 'bt' && (Ext.isEmpty($('#depositAmount').val()) || Ext.isEmpty($('#depositAmount1').val())) )
	{
		if (Ext.isEmpty($('#depositAmount').val())) {
			arrError.push({	"errorMessage" : "Please enter valid values for From Deposit Amount"});
			$('#depositAmount').addClass('requiredField');
			$('#depositAmount').bind('blur',function(){
				markRequired(this);
			});		
			$('#depositAmount').bind('focus',function(){
				removeMarkRequired(this);
			});
		}
		if (Ext.isEmpty($('#depositAmount1').val())) {
			arrError.push({	"errorMessage" : "Please enter valid values for To Deposit Amount"});
			$('#depositAmount1').addClass('requiredField');
			$('#depositAmount1').bind('blur',function(){
				markRequired(this);
			});		
			$('#depositAmount1').bind('focus',function(){
				removeMarkRequired(this);
			});
		}
	}

	 if(lockBoxNmbrOperator == 'bt' && (Ext.isEmpty($('#lockBoxNmbr').val()) || Ext.isEmpty($('#lockBoxNmbr1').val())) )
	{
		arrError.push({	"errorMessage" : "Please enter valid values for Store id/ lockbox and To Store id/lockbox"});
	}
	else if(lockBoxNmbrOperator != 'all')
	{
		if(!Ext.isEmpty($('#lockBoxNmbr').val()))
		{
			var temp = $('#lockBoxNmbr').val();
			var pattern = /^\d+$/;
			if(!pattern.test(temp))
			{
				arrError.push({	"errorMessage" : "Only numeric values allowed for Store Id/Lockbox field."});
			}
		}
		if(!Ext.isEmpty($('#lockBoxNmbr1').val()))
		{
			var temp = $('#lockBoxNmbr1').val();
			var pattern = /^\d+$/;
			if(!pattern.test(temp))
			{
				arrError.push({	"errorMessage" : "Only numeric values allowed for To Store Id/Lockbox field."});
			}
		}
	}
		
	if(arrError.length>0)
		isValidSearch = false;
	paintAdvancedFilterErrors('#advancedFilterErrorDiv','#advancedFilterErrorMessage',arrError);
	return isValidSearch;
}		
function getPopulateDepositImage( imageNmbr,depositTicketNmbr,sessionId, side )
{
	GCP.getApplication().fireEvent( 'callPopulateDepositImage', imageNmbr, depositTicketNmbr,sessionId, side);
}
function callToInstrumentPage( depositTicketNmbr,sessionId)
{
	GCP.getApplication().fireEvent( 'callInstrumentPage', depositTicketNmbr, sessionId );
}
function getItems( depositTicketNmbr, depositAccount, postingDate)
{
	GCP.getApplication().fireEvent( 'callGetItems', depositTicketNmbr, depositAccount, postingDate);
}