Ext
	.define(
		'GCP.controller.InstrumentInquiryController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'GCP.view.InstrumentInquiryGroupView', 'Ext.ux.gcp.DateHandler'
			],
			views :
			[
				'GCP.view.InstrumentInquiryView','GCP.view.InstrumentInqViewInfo'
			],
			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[
				{
					ref : 'instrumentInquiryView',
					selector : 'instrumentInquiryView'
				},
				{
					ref : 'groupView',
					selector : 'instrumentInquiryView groupView'
				},
				{
					ref : 'instrumentInquiryGroupView',
					selector : 'instrumentInquiryView instrumentInquiryGroupView'
				},
				{
					ref : 'instrumentInquiryFilterView',
					selector : 'instrumentInquiryFilterView'
				},
				{
					ref : 'filterView',
					selector : 'filterView'
				},
				{
					ref : 'dateLabel',
					selector : 'instrumentInquiryFilterView label[itemId="dateLabel"]'
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
				objViewInfoPopup : null,
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
				urlGridPref : 'userpreferences/instrumentInq/gridView.srvc',
				//urlGridFilterPref : 'userpreferences/instrumentInq/gridViewFilter.srvc',
				urlGridFilterPref : 'services/userpreferences/instrumentInq.json',
				commonPrefUrl : 'services/userpreferences/instrumentInq.json',
				strGetModulePrefUrl : 'services/userpreferences/instrumentInq/{0}.json',
				dateHandler : null,
				customizePopup : null,
				reportOrderByURL : null,
				datePickerSelectedDate : [],
				clientFilterVal : 'all',
				clientFilterDesc : '',
				savedFilterVal : '',
				preferenceHandler : null,
				strPageName : 'instrumentInq',
				postingDateFilterVal : '1',
				postingDateFilterLabel : getLabel('today', 'Today'),
				showPrefDate : true,
				filtersAppliedFlag : 'N',
				sessionID :null
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
					callPopulateInstrumentImage : function( imageNmbr ,depositTicketNmbr, sessionId, checkSeqNmbr, side)
					{
						me.populateInstrumentImage( imageNmbr,depositTicketNmbr, sessionId, checkSeqNmbr, side );
					},
					callDepositPage : function( depSlipNmbr, sessionId )
					{
						me.goToDepositPage( depSlipNmbr,sessionId );
					},
					getDepositPage : function( depSlipNmbr )
					{
						me.getToDepositImagePage( depSlipNmbr);
					},
					handleCancelButtonAction : function() {
						me.handleCancelButtonAction('depositInquiry.srvc');
					}
				} );
				$(document).on('handleSavedFilterClick', function(event) {
					me.sessionID = null;
					me.handleSavedFilterClick();
				});
				$(document).on('deleteSavedFilterEvent', function(event, filterCode) {
					me.deleteSavedFilterSet(filterCode);
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
					if (filterType == "depDateAdvFilter") {
						me.datePickerSelectedDate = dates;
						me.postingDateFilterVal = me.dateRangeFilterVal;
						me.postingDateFilterLabel = "";
						me.handleDepositAdvDateChange(me.dateRangeFilterVal);
					}
				});
				$(document).on('handleClientChangeInQuickFilter',function(event,isSessionClientFilter) {
					me.handleClientChangeInQuickFilter(isSessionClientFilter);
				});
				$(document).on('searchActionClicked', function() {
					me.searchActionClicked(me);
				});
				$(document).on('saveAndSearchActionClicked', function() {
					me.sessionID = null;
					me.saveAndSearchActionClicked(me);
				});
				$(document).on('resetAllFieldsEvent', function() {
					me.resetAllFields();
					me.filterCodeValue=null;
				});
				$(document).on('deleteFilterEvent', function(event, grid, rowIndex) {
					me.deleteFilterSet(grid, rowIndex);
				});
				$(document).on('orderUpGridEvent',function(event, grid, rowIndex, direction) {
					me.orderUpDown(grid, rowIndex, direction)
				});
				$(document).on('viewFilterEvent', function(event, grid, rowIndex) {
					me.viewFilterData(grid, rowIndex);
				});
				$(document).on('editFilterEvent', function(event, grid, rowIndex) {
					me.editFilterData(grid, rowIndex);
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
					me.showPageSettingPopup();
				});	
				me.objViewInfoPopup = Ext.create( 'GCP.view.InstrumentInqViewInfo',
				{
					parent : 'instrumentInquiryView',
					itemId : 'viewInfoPopupId'
				} );

				this.dateHandler = Ext.create( 'Ext.ux.gcp.DateHandler' );
				var showClearFlag = false;
				me.updateFilterConfig();
				me
					.control(
					{
						'pageSettingPopUp' : {
							'applyPageSetting' : function(popup, data) {
								me.applyPageSetting(data);
							},
							'savePageSetting' : function(popup, data,strInvokedFrom) {
								me.savePageSetting(data,strInvokedFrom);
							},				
							'restorePageSetting' : function(popup) {
								me.restorePageSetting();
							}
						},
						'instrumentInquiryView' :
						{
							beforerender : function( panel, opts )
							{
							
							}
						},
						'instrumentInquiryGroupView groupView' : {
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
									me.setDataForFilter(filterData);
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
								if (objDepItemPref) {
									var objJsonData = Ext.decode(objDepItemPref);
									if (!Ext.isEmpty(objJsonData.d.preferences)  && 'Y' == isMenuClicked ) {
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
							afterrender : function() {
								/*if (objGridViewPref) {
									me.toggleSavePrefrenceAction(false);
									me.toggleClearPrefrenceAction(true);
								}*/
							}
						},						
						'instrumentInquiryFilterView' :
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
								me.handleDateChange(me.dateFilterVal);
							},
							handleSavedFilterItemClick : function(comboValue, comboDesc) {
								me.sessionID = null;
								me.doHandleSavedFilterItemClick(comboValue);
							},
							handleAccountChangeInQuickFilter : function(combo) {
								me.sessionID = null;
								me.handleAccountChangeInQuickFilter(combo);
							},
							handleClientChangeFilter : function( combo ) {
								me.sessionID = null;
								me.handleClientChangeFilter( combo );
							},
							dateChange : function( btn, opts )
							{
								me.sessionID = null;
								isMenuClicked = 'Y';
								me.dateFilterVal = btn.btnValue;
								me.dateFilterLabel = btn.text;
								me.advDateFilterVal = btn.btnValue;
								me.advDateFilterLabel = btn.text;									
								me.handleDateChange( btn.btnValue );
								if( btn.btnValue !== '7' )
								{
									me.setDataForFilter();
									me.applyQuickFilter();
									//me.toggleSavePrefrenceAction( true );
									//me.toggleClearPrefrenceAction( true );
								}

							}
							},
						'instrumentInquiryFilterView combo[itemId="quickFilterAccountCombo"]' : {
							'afterrender' : function(combo, newValue, oldValue, eOpts) {
								if (!Ext.isEmpty(me.typeFilterVal)  && me.typeFilterVal !== 'all' ) {
									combo.setValue(me.typeFilterVal);
								}else{
									combo.setValue(combo.getStore().getAt(0));
								}
							}
						},
						'instrumentInquiryFilterView combo[itemId="savedFiltersCombo"]' : {
							'afterrender' : function(combo, newValue, oldValue, eOpts) {
								if (!Ext.isEmpty(me.savedFilterVal)) {
									combo.setValue(me.savedFilterVal);
								}
							}
						},
						'instrumentInquiryFilterView component[itemId="itemDatePickerQuick"]' : {
							render : function() {
								$('#itemDatePickerQuickText').datepick({
									monthsToShow : 1,
									changeMonth : false,
									rangeSeparator : '  to  ',
								//	withoutRange : true,
									minDate : dtHistoryDate,
									changeMonth :true,
							        changeYear :true,									
							        rangeSelect: false,									
									onClose : function(dates) {
										me.sessionID = null;
										var errorSpan = $('#quickFilterErrorDiv');
										var quickFilterAccountCombo = me.getInstrumentInquiryFilterView().down('combo[itemId="quickFilterAccountCombo"]');
										if (!Ext.isEmpty(dates)) {
											me.datePickerSelectedDate = dates;
											me.dateFilterVal = '13';
											me.filtersAppliedFlag = 'Y';	
											if (dates.length == 2){
												me.dateFilterLabel = getLabel('daterange',
													'Date Range');
												}
												else{
												me.dateFilterLabel = '';
												}
											me.handleDateChange(me.dateFilterVal);
											me.handlePostingDateChange(me.dateFilterVal);
											me.setDataForFilter();
											//me.applyQuickFilter();
											me.refreshData();
												
											if(!Ext.isEmpty(quickFilterAccountCombo.getValue()) 
												&& quickFilterAccountCombo.getValue() != 'Select Account'){
													errorSpan.addClass('ui-helper-hidden');
											}else{
													errorSpan.removeClass('ui-helper-hidden');
													$('#quickFilterErrorMessage').text("Please select Deposit Account");												 
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
									}
									/*onChangeMonthYear: function(year, month) {
										$('.datepick-cmd.datepick-cmd-range').hide();
									},
									onShow: function(year, month) {
										$('.datepick-cmd.datepick-cmd-range').hide();
									}	*/
								});
							}
						},
						'filterView label[itemId="createAdvanceFilterLabel"]' : {
							'click' : function() {
								var me = this;
								showAdvanceFilterPopup('instrumentInqFilter');
								/*Setting default postingdate as Today(Application date)*/
						//		me.resetAllFields();
						//		me.postingDateFilterVal = '1';
						//		me.postingDateFilterLabel =  getLabel('today', 'Today');
						//		me.handleDepositAdvDateChange('1');
								$('label[for="PostingDateLabel"]').text(getLabel('postingDate',
								'Posting Date'));
							}
						},
						'filterView button[itemId="clearSettingsButton"]' : {
							'click' : function() {
								me.sessionID = null;
								me.handleClearSettings();
							}
						},
						'filterView' : {
							appliedFilterDelete : function(btn){
								me.sessionID = null;
								me.handleAppliedFilterDelete(btn);
							}	
						},
						'instrumentInquiryView groupView smartgrid' : {
							'cellclick' : me.handleGridRowClick
						}
						/*'instrumentInqViewInfo[itemId="viewInfoPopupId"]' :
						{
							closeInstrumentInqInfoPopup : function( btn )
							{
								me.closeInstrumentInqInfoPopup( btn );
							}
						}*/
					} );
			},
			assignSavedFilter: function(){
                var me= this;
                if(me.firstTime){
                       me.firstTime = false;
                       
                       if (objDepItemPref) {
                              var objJsonData = Ext.decode(objDepItemPref);
                              if (!Ext.isEmpty(objJsonData.d.preferences)  && 'Y' == isMenuClicked ) {
                                     if (!Ext
                                                   .isEmpty(objJsonData.d.preferences.GeneralSetting)) {
                                            if (!Ext
                                                          .isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
                                                   var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
                                                   if(advData === me.getInstrumentInquiryFilterView().down('combo[itemId="savedFiltersCombo"]').getValue()){
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
          },
			handlePostingDateChange:function(index){
				var me = this;
				var dateToField;
				var objDateParams = me.getDateParam(index,'postingDate');

				if (!Ext.isEmpty(me.postingDateFilterLabel)) {
					$('label[for="PostingDateLabel"]').text(getLabel('postingDate',
							'Posting Date'));
				}
					var vFromDate = Ext.util.Format.date(Ext.Date.parse(
									objDateParams.fieldValue1, 'Y-m-d'),
							strExtApplicationDateFormat);
					var vToDate = Ext.util.Format.date(Ext.Date.parse(
									objDateParams.fieldValue2, 'Y-m-d'),
							strExtApplicationDateFormat);
					var filterOperator=objDateParams.operator;
					
					if (index == '13') {
						if (filterOperator == 'eq') {
							$('#depositItemDateAdvFilter').setDateRangePickerValue(vFromDate);
						} else {
							$('#depositItemDateAdvFilter').setDateRangePickerValue([
									vFromDate, vToDate]);
						}
							dateToField=vToDate;
							
							selectedDepositDate = {
									operator : filterOperator,
									fromDate : vFromDate,
									toDate : dateToField
								};
					} else {
						if (index === '1' || index === '2' || index === '12') {
							if (index === '12') {
								$('#depositItemDateAdvFilter').val('Till' + '  ' + vFromDate);
							} else {
								$('#depositItemDateAdvFilter').setDateRangePickerValue(vFromDate);
							}
						} else {
							$('#depositItemDateAdvFilter').setDateRangePickerValue([
									vFromDate, vToDate]);
						}
							dateToField=vToDate;
							
						selectedDepositDate = {
								operator : filterOperator,
								fromDate : vFromDate,
								toDate : dateToField
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
					if( $('#serialNmbrOperator').val() == 'all' )
					{
						$('#serialNmbr').val('');
						$('#serialNmbr').attr("disabled", true);
					}
					if( $('#itemAmountOperator').val() == 'all' )
					{
						$('#itemAmount').val('');
						$('#itemAmount').attr("disabled", true);
					}
					if( $('#itemSeqNmbrOperator').val() == 'all' )
					{
						$('#itemSeqNmbr').val('');
						$('#itemSeqNmbr').attr("disabled", true);
					}					
				}
			},
			handleClientChangeFilter : function(combo) {
				var me = this;
				var clientComboToolBarRef = me.getInstrumentInquiryFilterView()
				.down('combo[itemId="clientFiltersCombo"]');
				
				var errorSpan = $('#quickFilterErrorDiv');
				var quickFilterAccountCombo = me.getInstrumentInquiryFilterView().down('combo[itemId="quickFilterAccountCombo"]');
				var quickFilterDatePick = $('#itemDatePickerQuickText');				
				me.clientFilterVal = combo.getValue();
				me.clientFilterDesc = combo.getRawValue();
				me.setDataForFilter();
				//me.applyFilter();
				me.refreshData();
				if(quickFilterAccountCombo.getValue() == 'Select Account' && !Ext.isEmpty(quickFilterDatePick.val()) ){
					  errorSpan.removeClass('ui-helper-hidden');
					  $('#quickFilterErrorMessage').text("Please select Deposit Account");												 
				 }else if( Ext.isEmpty(quickFilterDatePick.val()) 
						 && (quickFilterAccountCombo.getValue() != 'Select Account' && Ext.isEmpty(quickFilterAccountCombo.getValue()) ) ){
					  errorSpan.removeClass('ui-helper-hidden');
					  $('#quickFilterErrorMessage').text("Please select Posting Date");												 
				}				
			},			
			doHandleRowActions : function(actionName, grid, record) {
				var me = this;				
				if( actionName === 'btnView' )
				{
					//me.instrumentInqviewInfoPopUp( record );
					showInstrumentInquiryViewPopUp(record);
				}
				if( actionName === 'btnCheckImg' )
				{
					//getPopulateInstrumentImage( record.get( 'instrumentImgNmbr' ) );
					var side = 'F';
					var checkSeqNmbr = record.get( 'itemNmbr' ) +'|' + record.get( 'itemSeqNmbr' );
					getPopulateInstrumentImage(record.get( 'instrumentImgNmbr' ), record.get( 'depositTicketNmbr' ),  record.get( 'serviceId' ),  checkSeqNmbr, side );					
				}				
			},
			populateInstrumentImage : function( imageNmbr, depositTicketNmbr, sessionId, checkSeqNmbr, side)
			{
				var me = this;
				if(daejaViewONESupport)
				{
					me.showDepositImageDaejaViewONE(imageNmbr,depositTicketNmbr,sessionId, checkSeqNmbr, side);
				}
				else
				{
					me.showDepositImageJqueryPopup(imageNmbr,depositTicketNmbr,sessionId, checkSeqNmbr,side);
				}
			},
			showDepositImageJqueryPopup : function( imageNmbr,depositTicketNmbr, sessionId, checkSeqNmbr, side )
			{
				
				var me = this;
				me.getInstrumentInquiryGroupView().setLoading( true );
				var strUrl = 'instrumentInq/getInstrumentImage.srvc?'+csrfTokenName + '=' + csrfTokenValue+'&identifier=' +''+'&$hostImageKey='+imageNmbr+'&$side='+side+'&$imgType=I'+
							 '&$depositTicketNmbr='+depositTicketNmbr+'&$sessionId='+sessionId+'&$checkSeqNmbr='+checkSeqNmbr;

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
						me.getInstrumentInquiryGroupView().setLoading( false );
						var $response = $( data );

						if( $response.find( '#imageAppletDiv' ).length == 0 )
						{
							$( '#instrumentImageDiv' ).html( '<img src="data:image/jpeg;base64,' + data + '"/>' );
						}
						else
						{
							$( '#instrumentImageDiv' ).html( $response.find( '#imageAppletDiv' ) );
						}
						$( '#instrumentImageDiv' ).dialog(
						{
							bgiframe : true,
							autoOpen : false,
							height : "678",
							modal : true,
							width : "1200",
							title : 'Image',
							resizable : false,
							draggable: false,
							buttons :
							{
								"Close" : function()
								{
									$( this ).dialog( "close" );
								},
								"Print" : function()
								{
									var strFrontUrl = 'instrumentInq/getInstrumentImage.srvc?'+csrfTokenName + '=' + csrfTokenValue+
									'&identifier=' +''+'&$hostImageKey='+imageNmbr+'&$side=F'+'&$imgType=I'+
									 '&$depositTicketNmbr='+depositTicketNmbr+'&$sessionId='+sessionId+'&$checkSeqNmbr='+checkSeqNmbr;
									var strBackUrl = 'instrumentInq/getInstrumentImage.srvc?'+csrfTokenName + '=' + csrfTokenValue+
									'&identifier=' +''+'&$hostImageKey='+imageNmbr+'&$side=B'+'&$imgType=I'+
									 '&$depositTicketNmbr='+depositTicketNmbr+'&$sessionId='+sessionId+'&$checkSeqNmbr='+checkSeqNmbr;
									printFrontImage(strFrontUrl,strBackUrl);
								},
								"Flip Over" : function()
								{
									if(modelBytes=='Front')
									{
										$( this ).dialog( "close" );
										me.populateInstrumentImage( imageNmbr,depositTicketNmbr, sessionId, checkSeqNmbr,'B' );
										modelBytes = 'Back';
									 }
									 else
									 {
										$( this ).dialog( "close" );
										me.populateInstrumentImage(imageNmbr,depositTicketNmbr, sessionId, checkSeqNmbr,'F' );
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
								$('#instrumentImageDiv').parent().find(".ui-dialog-buttonpane").attr('id','instrumentImageButtonDiv');
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
								$('.ui-dialog-buttonpane').find('button:contains("Flip Over")').attr('tabindex','1').attr('onkeydown','autoFocusOnFirstElement(event, "instrumentImageButtonDiv", false);');								
                            }
						} );
						$( '#dialogMode' ).val( '1' );
						$( '#instrumentImageDiv' ).dialog( 'open' );
					},
					error : function( request, status, error )
					{
						//$.unblockUI();
						me.getInstrumentInquiryGroupView().setLoading( false );
						$( '#instrumentImageDiv' ).html( '<img src="./static/images/misc/no_image.jpg"/>' );
						var errMsg = "";
						$( '#instrumentImageDiv' ).dialog(
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
						$( '#instrumentImageDiv' ).dialog( 'open' );
					}
				} );
			},

			goToDepositPage : function( depSlipNmbr )
			{
				var me = this;
				var form;
				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'GET';
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'isMenuClicked', 'N' ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'depositTicket', depSlipNmbr ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'dateFilterVal', me.dateFilterVal ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'dateFilterLabel', me.dateFilterLabel ) );	
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'ticketFromDate', ticketFromDate ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'ticketToDate', ticketToDate ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'depositTicketOperator', ticketOperator ) );
				form.action = "depositInquiry.srvc";
				document.body.appendChild( form );
				form.submit();
				document.body.removeChild( form );
			},

			getToDepositImagePage : function( depSlipNmbr )
			{
				var me = this;
				var form;
				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'GET';
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'isMenuClicked', 'N' ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'depositTicket', depSlipNmbr ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'depositAccount', s_depositAccount) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'postingDate', s_postingDate) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'dateFilterVal', me.dateFilterVal ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'dateFilterLabel', me.dateFilterLabel ) );	
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'ticketFromDate', ticketFromDate ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'ticketToDate', ticketToDate ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'depositTicketOperator', ticketOperator ) );
				form.action = "depositInquiry.srvc";
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
			doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
					newCard, oldCard)
			{
				var me = this;
				var objGroupView = me.getGroupView();
				var strModule = '', strUrl = null, args = null, strFilterCode = null;
				groupInfo = groupInfo || {};
				subGroupInfo = subGroupInfo || {};
				if (groupInfo) 
				{
					if (groupInfo.groupTypeCode === 'DEPITEM_OPT_ADVFILTER') {
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

					}  else
					{				
						args = {
							scope : me
						};
						strModule = subGroupInfo.groupCode;
						strUrl = Ext.String.format(me.strGetModulePrefUrl, strModule);
						//strUrl = me.urlGridPref;					
						me.getSavedPreferences(strUrl, me.postHandleDoHandleGroupTabChange,
								args);
					}
				}
			},
			doHandleSavedFilterItemClick : function(filterCode) {
				var me = this;
				if (!Ext.isEmpty(filterCode)) {
					me.getSavedFilterData(filterCode, this.populateSavedFilter, true);
				}
				me.showAdvFilterCode = filterCode;
				var sel = document.getElementById("depositAccount");
				var depositAccountVal = sel.options[sel.selectedIndex].value; // or sel.value
				var depositAccountDesc = sel.options[sel.selectedIndex].text;
				var postingDateLableVal = $('label[for="PostingDateLabel"]').text();
				var postingDateField = $("#depositItemDateAdvFilter");
				me.handlePostingDateSync('A', postingDateLableVal, null, postingDateField, null);
				me.handleDepositAccFieldSync('A', 'depositAccount',depositAccountVal,depositAccountDesc );
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
		//objGroupView.reconfigureGrid(null);
		strUrl = Ext.String.format(me.strGetModulePrefUrl, 'ADVFILTER');				
		args = {
			scope : me
		};
		me.getSavedPreferences(strUrl,
				me.postHandleDoHandleGroupTabChange, args);
	},			
			postHandleDoHandleGroupTabChange : function(data, args) {
				var me = args.scope;
				var objGroupView = me.getGroupView();
				var objSummaryView = me.getInstrumentInquiryGroupView(), arrSortState = new Array(), objPref = null, gridModel = null, intPgSize = null, showPager = true;
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
				var arrOfParseQuickFilter = [], arrOfParseAdvFilter = [], arrOfFilteredApplied = [];
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );
				me.reportOrderByURL = strUrl;
			//	me.setDataForFilter();
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
							if(me.advFilterData[i].field === 'itemAmount') 
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

			},
			handleGridRowClick : function(view, td, cellIndex, record, tr, rowIndex, e, eOpts) {
				var me = this;
				var clickedColumn = view.getGridColumns()[cellIndex];
				var columnType = clickedColumn.colType;
				var objGroupView = me.getGroupView();
				var grid = objGroupView.getGrid();
				if(columnType !== 'actioncontent' && columnType !== 'checkboxColumn') {
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
			columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
			{
				var strRetValue = value;
				var isVisibleInstImg = isHidden( 'ViewInstrument' );
				if( value != '' )
				{
					if( colId === 'col_itemNmbr' && !isVisibleInstImg && !Ext.isEmpty(viewInstImgFeatureValue) &&  viewInstImgFeatureValue === 'Y' )
					{
						strRetValue = value;
						//	+ ' '
						//	+ '<a href="#" title="Image" class="grid-row-action-icon grid-row-check-icon" onclick="getPopulateInstrumentImage( \''
						//	+ record.get( 'instrumentImgNmbr' ) + '\' )"></a>';
					}
					else if( colId === 'col_itemType' )
					{
						if( value == 'P' )
						{
							//strRetValue = getLabel( 'lbl.paid', 'Paid' );
						}
						else
						{
							//strRetValue = getLabel( 'lbl.unpaid', 'Unpaid' );
						}
					}
					else if( colId === 'col_depSlipNmbr' )
					{
						strRetValue = '<a href="#" button_underline thePointer onclick="callToDepositPage( \'' + value
							+ '\' )"><u>' + value + '</u></a>';
					}
				}
				meta.tdAttr = 'title="' + strRetValue + '"';
				return strRetValue;
			},
			createActionColumn : function()
			{
				var me = this;
				var objActionCol =
				{
					colType : 'action',
					colId : 'action',
					width : 50,
					align : 'center',
					locked : true,
					items :
					[
						{
							itemId : 'btnView',
							itemCls : 'grid-row-action-icon icon-view',
							toolTip : getLabel( 'viewToolTip', 'View Record' ),
							maskPosition : 1
						}
					]
				};
				return objActionCol;
			},
			handleAppliedFilterDelete : function(btn){
				var me = this;
				var objData = btn.data;
				var advJsonData = me.advFilterData;
				var quickJsonData = me.filterData;
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
					me.setDataForFilter();
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
				var depItemfilterView = me.getInstrumentInquiryFilterView();
				if(!Ext.isEmpty(objData))
					strFieldName = objData.paramName || objData.field;
				
				if (strFieldName === 'clientId')
				{
					var companyComboRef = depItemfilterView.down('combo[itemId="clientFiltersCombo"]');
					companyComboRef.setValue('All Companies');
					me.clientFilterVal = null;
					me.clientFilterDesc = null;					
				}
				else if( strFieldName === 'depositAccount')
				{
					var quickFilterAccountCombo = depItemfilterView.down('combo[itemId="quickFilterAccountCombo"]');
					quickFilterAccountCombo.setValue(quickFilterAccountCombo.getStore().getAt(0));
					me.typeFilterVal = null;
					me.typeFilterDesc = null;
					$("#depositAccount").val('');
					$('#depositAccount').niceSelect('update');
				}
				
				else if(strFieldName === 'postingDate'){
					var datePickerRef = $('#entryDatePicker');
				//	me.dateFilterVal = '';
					me.getDateLabel().setText(getLabel('date', 'Posting Date'));
					datePickerRef.val('');
					
/*					selectedRequestDateFilter={};
					me.datePickerSelectedReqDate = [];
					$('#entryDatePicker').val("");
					$('label[for="requestDateLabel"]').text(getLabel('lblreqdate',
					'Request Date'));*/
				}
				else if( strFieldName ==='depositTicketNmbr' ){
					$("#depositTicketOperator").val($("#depositTicketOperator option:first").val());
					$('#depositTicketOperator').niceSelect('update');
					$("#depositTicket").val("");
					$("#depositTicket1").val("");
					$('#depositTicketTo').hide();
				}
				else if ( strFieldName === 'serialNmbr' )
				{
					$("#serialNmbrOperator").val($("#serialNmbrOperator option:first").val());
					$("#serialNmbrOperator").niceSelect('update');
					$("#serialNmbr").val("");
					$("#serialNmbr1").val("");
					$('#serialNmbrTo').hide();
				}
				else if ( strFieldName === 'itemAmount' )
				{
					$("#itemAmountOperator").val('');
					$("#itemAmountOperator").niceSelect('update');
					$("#itemAmount").val("");
					$("#itemAmount1").val("");
					$('#itemAmountTo').hide();
				}
				else if ( strFieldName === 'itemSeqNmbr' )
				{
					$("#itemSeqNmbrOperator").val($("#itemSeqNmbrOperator option:first").val());
					$("#itemSeqNmbrOperator").niceSelect('update');
					$("#itemSeqNmbr").val("");
					$("#itemSeqNmbr1").val("");
					$('#itemSeqNmbrTo').hide();
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
				var instrumentInqGridRef = groupView.getGrid();
				if (!Ext.isEmpty(instrumentInqGridRef)) {
					var dataStore = instrumentInqGridRef.store;
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
			handleDateChange : function( index )
			{
				var me = this;
				var filterView = me.getInstrumentInquiryFilterView();
				var objDateParams = me.getDateParam(index, null);
				var datePickerRef = $('#itemDatePickerQuickText');

				if (!Ext.isEmpty(me.dateFilterLabel)) {
				//	me.getDateLabel().setText(getLabel('date', 'Posting Date') + " ("
				//			+ me.dateFilterLabel + ")");
					me.getDateLabel().setText(getLabel('date', 'Posting Date'));
				}
				var vFromDate = Ext.util.Format.date(Ext.Date.parse(
								objDateParams.fieldValue1, 'Y-m-d'),
						strExtApplicationDateFormat);
				var vToDate = Ext.util.Format.date(Ext.Date.parse(
								objDateParams.fieldValue2, 'Y-m-d'),
						strExtApplicationDateFormat);
				var filterOperator=objDateParams.operator;
						
				if (index == '13') {
					if (objDateParams.operator == 'eq') {
						datePickerRef.setDateRangePickerValue(vFromDate);
					} else {
						datePickerRef.setDateRangePickerValue([vFromDate, vToDate]);
					}
				} else {
					if (index === '1' || index === '2' || index === '12') {
						if (index === '12') {
							datePickerRef.val('Till' + '  ' + vFromDate);
						} else {
							datePickerRef.setDateRangeMode('single');
							datePickerRef.setDateRangePickerValue(vFromDate);
						}
					} else {
						datePickerRef.setDateRangePickerValue([vFromDate, vToDate]);
					}
				}
				me.handlePostingDateSync('Q', me.getDateLabel().text, "", datePickerRef, filterOperator);
			},
			getDateParam : function( index )
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
					case '7':
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
					case '12':
						// Latest
						fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'le';
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
				}
				retObj.fieldValue1 = fieldValue1;
				retObj.fieldValue2 = fieldValue2;
				retObj.operator = operator;
				return retObj;
			},
			setGridInfoSummary : function( grid )
			{
				var me = this;
				var groupView = me.getGroupView();
				var instrumentInqGridRef = groupView.getGrid();
				if (!Ext.isEmpty(instrumentInqGridRef)) {
					var dataStore = instrumentInqGridRef.store;
					dataStore.on( 'load', function( store, records )
					{
						var summaryData = [];
						var ammount = "$0.00";
						var count = "0";
						var i = records.length - 1;
						if( i >= 0 )
						{
							if(!Ext.isEmpty(records[ i ].get( 'totalChecksSummaryTotalInfo' )))
								ammount = records[ i ].get( 'totalChecksSummaryTotalInfo' ) ;
								
							 summaryData.push({
								key: "Deposit Amount",
								value: ammount
								}) 
							
							
							if(!Ext.isEmpty(records[ i ].get( 'totalChecksSummaryCountInfo' )))
								count =  " ("+records[ i ].get( 'totalChecksSummaryCountInfo' )+")";
								
							 summaryData.push({
								key: "Item Count",
								value: count
								})
						}
						else
						{
							summaryData=[{
								key: "Deposit Amount",
								value:"$0.00"
							},{
								key: "Item Count",
								value:"#0"
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
			updateFilterConfig : function()
			{
				var me = this;
				var arrJsn = new Array();
				// TODO : Localization to be handled..
				var objDateLbl =
				{
					'12' : getLabel( 'latest', 'Latest' ),
					'1' : getLabel( 'today', 'Today' ),
					'2' : getLabel( 'yesterday', 'Yesterday' ),
					'3' : getLabel( 'thisweek', 'This Week' ),
					'4' : getLabel( 'lastweek', 'Last Week To Date' ),
					'5' : getLabel( 'thismonth', 'This Month' ),
					'6' : getLabel( 'lastmonth', 'Last Month To Date' ),
					'7' : getLabel( 'daterange', 'Date Range' ),
					'8' : getLabel( 'thisquarter', 'This Quarter' ),
					'9' : getLabel( 'lastQuarterToDate', 'Last Quarter To Date' ),
					'10' : getLabel( 'thisyear', 'This Year' ),
					'11' : getLabel( 'lastyeartodate', 'Last Year To Date' ),
					'12' : getLabel('latest', 'Latest'),
					'13' : getLabel('daterange', 'Date Range')
				};

				if( !Ext.isEmpty( objDepItemPref ) )
				{
					var objJsonData = Ext.decode(objDepItemPref);
					var data = objJsonData.d.preferences.groupViewFilterPref;
					
					if (!Ext.isEmpty(data)) {
						var strDtValue = data.quickFilter.requestDate;
						var strDtFrmValue = data.quickFilter.instrumentDateFrom;
						var strDtToValue = data.quickFilter.instrumentDateTo;
						var instrumentStatus = data.quickFilter.itemType;
						
						me.typeFilterVal = !Ext.isEmpty( instrumentStatus ) ? instrumentStatus : 'all';
						
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

							if( me.dateFilterVal != '12' )
							{
								arrJsn.push(
								{
									paramName : 'requestDate',
									paramValue1 : strVal1,
									paramValue2 : strVal2,
									operatorValue : strOpt,
									dataType : 'D'
								} );
							}
						}

						if( !Ext.isEmpty( me.typeFilterVal ) && me.typeFilterVal != 'all' )
						{
							arrJsn.push(
							{
								paramName : 'itemType',
								paramValue1 : encodeURIComponent(me.typeFilterVal.replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'eq',
								dataType : 'S'
							} );
						}
						me.filterData = arrJsn;
					}
					else
					{
						if('Y'== isMenuClicked){
							var me = this;
							var blnShowAdvFilter = true;
							if (objDepItemPref)
							{
	                              var objJsonData = Ext.decode(objDepItemPref);
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
								showAdvanceFilterPopup('instrumentInqFilter');
								blnShowAdvFilter = false;
							}
							/*Setting default postingdate as Today(Application date)*/
							me.postingDateFilterVal = '1';
							me.postingDateFilterLabel =  getLabel('today', 'Today');
							me.handleDepositAdvDateChange('1');
						}
					}
					
				}
			},
			setDataForFilter : function(filterData) {
				var me = this;
				me.advFilterData = {};
				me.filterData = {};
				me.filterData = me.getQuickFilterQueryJson();
				var objJson = (!Ext.isEmpty(filterData) ? filterData.filterBy : getInstAdvancedFilterQueryJson());
				
				reqJson = me.findInAdvFilterData(objJson, "postingDate");
				if (!Ext.isEmpty(reqJson)) {
					arrQuickJson = me.filterData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "postingDate");
					me.filterData = arrQuickJson;
				}
				
				var depositAccJSON = me.findInAdvFilterData(objJson, "depositAccount");
				if (!Ext.isEmpty(depositAccJSON)) {
					arrQuickJson = me.filterData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "depositAccount");
					me.filterData = arrQuickJson;
				}
				
				var depositTckJSON = me.findInAdvFilterData(objJson, "depositTicketNmbr");
				if (!Ext.isEmpty(depositTckJSON) ) {
					arrQuickJson = me.filterData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "depositTicketNmbr");
					me.filterData = arrQuickJson;
				}
				
				me.advFilterData = objJson;

				var filterCode = $("input[type='text'][id='filterCode']").val();
				if(!Ext.isEmpty(filterCode))
					me.advFilterCodeApplied = filterCode;
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
				
                selectedDepositDate = {
                        operator : 'eq',
                        fromDate : dateValue,
                        toDate : dateValue
                };
			},
			handleDepTckNmbrSyncDepositTckCall : function( depositTckNmbr )
			{
				$('#depositTicketOperator').val('eq');
				$('#depositTicketOperator').niceSelect('update');
				$('#depositTicket').val(depositTckNmbr);				
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
				if( index != '12' && index != '' )
				{	
					if('N' != isMenuClicked)
					{
						jsonArray.push(
						{
							paramName : 'postingDate',
							paramValue1 : objDateParams.fieldValue1,
							paramValue2 : objDateParams.fieldValue2,
							operatorValue : objDateParams.operator,
							dataType : 'D',
							paramFieldLable : getLabel('postingDatedate', 'Posting Date')
						} );
						ticketFromDate = objDateParams.fieldValue1;
						ticketToDate = objDateParams.fieldValue2;
						ticketOperator = objDateParams.operator;
					}
				}
				if('N' != isMenuClicked){
					if( typeFilterVal != null && typeFilterVal != "" && typeFilterVal != 'all' &&  
							typeFilterVal != 'All' && typeFilterVal != 'Select Account')
					{
						jsonArray.push(
						{
							paramName : 'depositAccount',
							paramValue1 : encodeURIComponent(typeFilterVal.replace(new RegExp("'", 'g'), "\''")),
							operatorValue : 'eq',
							dataType : 'S',
							displayType : 5,
							paramFieldLable : getLabel( 'lbldepacc', 'Deposit Account' ),
							displayValue1 : me.typeFilterDesc							
						} );
					}
				}
				if( depSlipNmbr != null && depSlipNmbr != "" && depSlipNmbr != "All"  && 'N' != isMenuClicked )
				{
					jsonArray.push(
					{
						paramName : 'depositTicketNmbr',
						paramValue1 : encodeURIComponent(depSlipNmbr.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				else if( 'N' == isMenuClicked && me.filtersAppliedFlag == 'N' )
				{
					me.handleDepTckNmbrSyncDepositTckCall( depSlipNmbr );					
				}
				
				if( 'N' != isMenuClicked && sessionId != null && sessionId != ""  )
				{
					jsonArray.push(
					{
						paramName : 'sessionId',
						paramValue1 : encodeURIComponent(sessionId.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				else if( isMenuClicked == 'N' &&  me.filtersAppliedFlag == 'Y' && sessionId != null && sessionId != "" )
				{
					jsonArray.push(
							{
								paramName : 'sessionId',
								paramValue1 : encodeURIComponent(sessionId.replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'eq',
								dataType : 'S'
							} );
				}
				if( index != '' && 'N' == isMenuClicked)
				{
					
					if( me.filtersAppliedFlag == 'Y' )
					{
						if( index != '12' && index != '' )
						{
							jsonArray.push(
									{
										paramName : 'postingDate',
										paramValue1 : objDateParams.fieldValue1,
										paramValue2 : objDateParams.fieldValue2,
										operatorValue : objDateParams.operator,
										dataType : 'D',
										paramFieldLable : getLabel('postingDatedate', 'Posting Date')
									} );
									ticketFromDate = objDateParams.fieldValue1;
									ticketToDate = objDateParams.fieldValue2;
									ticketOperator = objDateParams.operator;						
						}
					}
					else
					{
						jsonArray.push(
								{
									paramName : 'postingDate',
									paramValue1 : Ext.util.Format.date(s_postingDate, strExtApplicationDateFormat),
									paramValue2 : Ext.util.Format.date(s_postingDate, strExtApplicationDateFormat),
									operatorValue : 'eq',
									dataType : 'D',
									paramFieldLable : getLabel('postingDatedate', 'Posting Date')
								} );
						me.handlePostingDateSyncDepositTckCall( Ext.util.Format.date(s_postingDate, strExtApplicationDateFormat) );
					}

					
					if( me.filtersAppliedFlag == 'Y' )
					{
						if( typeFilterVal != null && typeFilterVal != "" && typeFilterVal != 'all' &&  
								typeFilterVal != 'All' && typeFilterVal != 'Select Account')
						{
							jsonArray.push(
							{
								paramName : 'depositAccount',
								paramValue1 : encodeURIComponent(typeFilterVal.replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'eq',
								dataType : 'S',
								displayType : 5,
								paramFieldLable : getLabel( 'lbldepacc', 'Deposit Account' ),
								displayValue1 : me.typeFilterDesc							
							} );
						}						
					}
					else
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

				}
				if (!Ext.isEmpty(me.clientFilterVal) &&  me.clientFilterVal !== null &&  me.clientFilterVal !== 'all') 
				{
					jsonArray.push({
							paramName : 'clientId',
							operatorValue : 'eq',
							paramValue1 : encodeURIComponent(me.clientFilterVal.replace(new RegExp("'", 'g'), "\''")),
							dataType :'S',
							displayType : 5,
							paramFieldLable : getLabel('company', 'Company Name'),
							displayValue1 : me.clientFilterDesc					
					});
				}				
				return jsonArray;
			},
			getDefaultFilterParam : function()
			{
				var me = this;
				var objJson = null, jsonArray = [];
				var defaultFilterQuery = '';
				//var multiAccounts = me.getSendingAccountTextField().getValue();
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

			applyQuickFilter : function()
			{
				var me = this;
				var groupView = me.getGroupView();
				var grid = groupView.getGrid();		
				var subGroupInfo = groupView.getSubGroupInfo() || {};
				me.filterApplied = 'Q';
				// TODO : Currently both filters are in sync
				if( !Ext.isEmpty( grid ))
				{
					var strDataUrl = grid.store.dataUrl;
					var store = grid.store;
					var strUrl = grid.generateUrl( strDataUrl, grid.pageSize, 1, 1, store.sorters );
					strUrl = strUrl + me.getFilterUrl(subGroupInfo) + '&' + csrfTokenName + '=' + csrfTokenValue;
					me.loadGridDataNew( strUrl, me.handleAfterGridDataLoad, null, null, null, grid );
				}
			},
			/*Page setting handling starts here*/
			applyPageSetting : function(arrPref) {
				var me = this;
				if (!Ext.isEmpty(arrPref)) {
					me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
							me.postHandlePageGridSetting, null, me, false);
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
			restorePageSetting : function() {
				var me = this;
					me.preferenceHandler.clearPagePreferences(me.strPageName, null,
							me.postHandlePageGridSetting, null, me, false);
			},
			postHandlePageGridSetting : function(data, args, isSuccess) {
				if (isSuccess === 'Y') {
					window.location.reload();
				} else {
					Ext.MessageBox.show({
								title : getLabel('instrumentErrorPopUpTitle', 'Error'),
								msg : getLabel('errorMsg',
										'Error while apply/restore setting'),
								buttons : Ext.MessageBox.OK,
								cls : 't7-popup',
								icon : Ext.MessageBox.ERROR
							});
				}
			},
			showPageSettingPopup : function() {
				var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
				var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeMaster;

				me.pageSettingPopup = null;

				if (!Ext.isEmpty(objDepItemPref)) {
					objPrefData = Ext.decode(objDepItemPref);
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
							: (INQUIRY_GENERIC_COLUMN_MODEL || '[]');

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
				objData["filterUrl"] = 'services/userfilterslist/' +'instrumentInqFilter';
				objData["rowPerPage"] = _AvailableGridSize;
				objData["groupByVal"] = objGroupByVal;
				objData["filterVal"] = objDefaultFilterVal;
				objData["gridSizeVal"] = objGridSizeVal;
				objData["rowPerPageVal"] = objRowPerPageVal;

				me.pageSettingPopup = Ext.create('Ext.ux.gcp.PageSettingPopUp', {
							cfgPopUpData : objData,
							cfgGroupView : objGroupView,
							cfgDefaultColumnModel : objColumnSetting
						});
				me.pageSettingPopup.show();
				me.pageSettingPopup.center();
			},
			
			/*Page setting handling ends here*/
			getFilterUrl : function(subGroupInfo)
			{
				var me = this;
				var strQuickFilterUrl = '', strActionStatusUrl = '', strAdvancedFilterUrl = '', strUrl = '', isFilterApplied = false;

				var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
						? subGroupInfo.groupQuery
						: '';
					strQuickFilterUrl = me.generateUrlWithQuickFilterParams( me );
					if( !Ext.isEmpty( strQuickFilterUrl ) )
					{
						strUrl += '&$filter=' + strQuickFilterUrl;
						isFilterApplied = true;
					}
					
					URLJson = me.generateUrlWithAdvancedFilterParams( me );
					
					/*if( !Ext.isEmpty( strAdvancedFilterUrl ) )
					{
						if( Ext.isEmpty( strUrl ) )
							strUrl += '&$filter=' + strAdvancedFilterUrl;
						else
							strUrl += ' and ' + strAdvancedFilterUrl;
						isFilterApplied = true;
					}*/
					
					/*var strDetailUrl = URLJson.detailFilter;
					if (!Ext.isEmpty(strDetailUrl) && strDetailUrl.indexOf(' and') == 0) {
						strDetailUrl = strDetailUrl.substring(4, strDetailUrl.length);
					}
					strAdvancedFilterUrl = URLJson.batchFilter;
					if (!Ext.isEmpty(strAdvancedFilterUrl)
							&& strAdvancedFilterUrl.indexOf(' and ') == strAdvancedFilterUrl.length
									- 5) {
						strAdvancedFilterUrl = strAdvancedFilterUrl.substring(0,
								strAdvancedFilterUrl.length - 5);
					}*/
					if (!Ext.isEmpty(URLJson)) {
						if (Ext.isEmpty(strUrl)) {
							strUrl += '&$filter=' + URLJson;
						}
						else
						{
							strUrl += ' and ' + URLJson;
						}
						isFilterApplied = true;
					}
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

				var filterData = me.filterData;
				var isFilterApplied = false;
				var strFilter = '';
				var strTemp = '';
				var strFilterParam = '';
				for( var index = 0 ; index < filterData.length ; index++ )
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
									+ filterData[ index ].operatorValue + ' ' + '\'' + filterData[ index ].paramValue1
									+ '\'';
										}
							}
							break;
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
							&& ( operator === 'bt' || operator === 'eq' || operator === 'lk' || operator === 'ge' || operator === 'le' ) )
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
								
								else if(filterData[ index ].dataType === 0)
								{
									strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator
										+ ' ' + '' + filterData[ index ].value1 + '' + ' and ' + ''
										+ filterData[ index ].value2 + '';
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
								isFilterApplied = true;
								isInCondition = this.isInCondition( filterData[ index ] );
								if( isInCondition )
								{
									var reg = new RegExp( /[\(\)]/g );
									var objValue = filterData[ index ].value1.toString();
									objValue = objValue.replace( reg, '' );
									var objArray = objValue.split( ',' );
									isFilterApplied = true;
									for( var i = 0 ; i < objArray.length ; i++ )
									{
										strTemp = strTemp + filterData[ index ].field + ' '
											+ filterData[ index ].operator + ' ' + '\'' + objArray[ i ] + '\'';
										if( i != objArray.length - 1 )
											strTemp = strTemp + ' or '
									}
									break;
								}
								if( filterData[ index ].dataType === 'D' )
								{
									isFilterApplied = true
									strTemp = strTemp + filterData[ index ].field + ' '
										+ filterData[ index ].operator + ' ' + 'date\''
										+ filterData[ index ].value1 + '\'';
								}else
								{
									strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator
										+ ' ' + '\'' + filterData[ index ].value1 + '\'' ;
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

/*			isInCondition : function( data )
			{
				var retValue = false;
				var displayType = data.displayType;
				var strValue = data.value1;
				var reg = new RegExp( /^\((\d\d*,)*\d\d*\)$/ );
				if( displayType && displayType === 4 && strValue && strValue.match( reg ) )
				{
					retValue = true;
				}

				return retValue;

			},*/
			isInCondition : function(data) {
				var retValue = false;
				var reg = new RegExp(/^\((\d\d*,)*\d\d*\)$/);
				var displayType = data.displayType;
				var strValue = data.value1;
				if (displayType
						&& (displayType === 4 || displayType === 3 || displayType === 5 || displayType === 12 || displayType === 13 || displayType === 6)
						&& strValue ) {
					retValue = true;
				}
				return retValue;
			},			
			orderUpDown : function( grid, rowIndex, direction )
			{
				var record = grid.getStore().getAt(rowIndex);

				var store = grid.getStore();
				if (!record) {
					return;
				}
				var index = rowIndex;

				if (direction < 0) {
					index--;
					if (index < 0) {
						return;
					}
					var beforeRecord = store.getAt(index);
					store.remove(beforeRecord);
					store.remove(record);

					store.insert(index, record);
					store.insert(index + 1, beforeRecord);
				} else {
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
				this.sendUpdatedOrederJsonToDb(store);
			},
			deleteFilterSet : function( grid, rowIndex )
			{

				var me = this;
				var record = grid.getStore().getAt( rowIndex );
				var objFilterName = record.data.filterName;
				grid.getStore().remove( record );

				if( this.advFilterCodeApplied == record.data.filterName )
				{
					this.advFilterData = [];
					me.filterApplied = 'A';
				}

				var store = grid.getStore();
				me.deleteFilterCodeFromDb( objFilterName, store );
				me.sendUpdatedOrederJsonToDb(store);
				me.reloadFilters(store);
			},
			deleteSavedFilterSet : function(filterCode) {
				var me = this;
				var objFilterName;
				var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
				var objComboStore=null;
				if (!Ext.isEmpty(filterCode))
					objFilterName = filterCode;
				me.filterCodeValue = null;

				if (me.savePrefAdvFilterCode == objFilterName) {
					me.advFilterData = [];
					me.filterApplied = 'A';
					me.setDataForFilter();
					me.refreshData();
				}
				if (savedFilterCombobox) {
					objComboStore = savedFilterCombobox.getStore();
					objComboStore.removeAt(objComboStore.find('filterName',objFilterName));
					savedFilterCombobox.setValue('');
				}
				me.deleteFilterCodeFromDb(objFilterName);
				me.sendUpdatedOrderJsonToDb();
				// store.reload();
			},			
			deleteFilterCodeFromDb : function( objFilterName )
			{
				var me = this;
				if( !Ext.isEmpty( objFilterName ) )
				{
					var strUrl = 'userfilters/instrumentInqFilter/{0}/remove.srvc?' + csrfTokenName + '=' + csrfTokenValue;
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
			sendUpdatedOrderJsonToDb : function() {
				var me = this;
				var objJson = {};
				var FiterArray = [];
				$("#msSavedFilter option").each(function() {
							FiterArray.push($(this).val());
						});
				objJson.filters = FiterArray;
				Ext.Ajax.request({
					url : 'userpreferences/instrumentInqList/instrumentInqAdvanceFilter.srvc?' + csrfTokenName + '='+ csrfTokenValue,
					method : 'POST',
					jsonData : objJson,
					async : false,
					success : function(response) {
						me.updateSavedFilterComboInQuickFilter();
						me.resetAllFields();
					},
					failure : function() {
						// console.log("Error Occured - Addition
						// Failed");

					}

				});
			},
			sendUpdatedOrederJsonToDb : function( store )
			{
				var me = this;
				var preferenceArray = [];

				store.each( function( rec )
				{
					var singleFilterSet = rec.raw;
					preferenceArray.push( singleFilterSet );
				} );
				var objJson = {};
				var FiterArray = [];
				for( i = 0 ; i < preferenceArray.length ; i++ )
				{
					FiterArray.push( preferenceArray[ i ].filterName );
				}
				objJson.filters = FiterArray;
				Ext.Ajax.request(
				{
					url : 'userpreferences/instrumentInqList/instrumentInqAdvanceFilter.srvc?' + csrfTokenName + '='
						+ csrfTokenValue,
					method : 'POST',
					jsonData : objJson,
					async : false,
					success : function( response )
					{
						me.updateSavedFilterComboInQuickFilter();
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
				me.getSavedFilterData(filterCode, this.populateAndDisableSavedFilter, applyAdvFilter);
				changeAdvancedFilterTab(1);
			},
			editFilterData : function( grid, rowIndex )
			{
				var me = this;
				me.resetAllFields();
				me.filterCodeValue=null;
				var record = grid.getStore().getAt(rowIndex);
				var filterCode = record.data.filterName;

				var filterCodeRef = $("input[type='text'][id='savedFilterAs']");
				if (!Ext.isEmpty(filterCodeRef)) {
					filterCodeRef.val(filterCode);
					filterCodeRef.prop('disabled', true);
				}
				var applyAdvFilter = false;

				me.filterCodeValue = filterCode;

				me.getSavedFilterData(filterCode, this.populateSavedFilter, applyAdvFilter);
				changeAdvancedFilterTab(1);

			},
			getSavedFilterData : function( filterCode, fnCallback, applyAdvFilter )
			{
				var me = this;
				var objJson;
				var strUrl = 'userfilters/instrumentInqFilter/{0}.srvc';
				strUrl = Ext.String.format( strUrl, filterCode );
				Ext.Ajax.request(
				{
					url : strUrl ,
					headers: objHdrCsrfParams,
					method : 'GET',
					async : false,
					success : function( response )
					{
						var responseData = Ext.decode( response.responseText );

						fnCallback.call( me, filterCode, responseData, applyAdvFilter );

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
						$("#depositAccount").multiselect("refresh");
						$('#depositAccount').niceSelect('update');
					} else if (fieldName === 'depositTicketNmbr') {
						if (!Ext.isEmpty(operatorValue)) {
							if (!Ext.isEmpty(fieldVal)) {
								$('#depositTicketOperator').val(operatorValue);
								$('#depositTicketOperator').niceSelect('update');
								$('#depositTicket').val(fieldVal);								
							}
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
					} else if (fieldName === 'itemAmount') {
						if (!Ext.isEmpty(operatorValue)) {
							if (!Ext.isEmpty(fieldVal)) {
								$('#itemAmountOperator').val(operatorValue);
								$('#itemAmountOperator').niceSelect('update');
								$('#itemAmount').val(fieldVal);								
							}
							if('bt'==operatorValue)
							{
								$('#itemAmountTo').show();	
								$('#itemAmount1').prop('disabled', true);
							}																
							if(!Ext.isEmpty(fieldVal2))
							{										
								$('#itemAmount1').val(fieldVal2);									
							}							
						}
					} else if (fieldName === 'serialNmbr') {
						if (!Ext.isEmpty(operatorValue)) {
							if (!Ext.isEmpty(fieldVal)) {
								$('#serialNmbrOperator').val(operatorValue);
								$('#serialNmbrOperator').niceSelect('update');
								$('#serialNmbr').val(fieldVal);								
							}
							if('bt'==operatorValue)
							{
								$('#serialNmbrTo').show();	
								$('#serialNmbr1').prop('disabled', true);
							}																
							if(!Ext.isEmpty(fieldVal2))
							{										
								$('#serialNmbr1').val(fieldVal2);									
							}							
						}
					}else if (fieldName === 'itemSeqNmbr') {
						if (!Ext.isEmpty(operatorValue)) {
							if (!Ext.isEmpty(fieldVal)) {
								$('#itemSeqNmbrOperator').val(operatorValue);
								$('#itemSeqNmbrOperator').niceSelect('update');
								$('#itemSeqNmbr').val(fieldVal);								
							}
							if('bt'==operatorValue)
							{
								$('#itemSeqNmbrTo').show();	
								$('#itemSeqNmbr1').prop('disabled', true);
							}																
							if(!Ext.isEmpty(fieldVal2))
							{										
								$('#itemSeqNmbr1').val(fieldVal2);									
							}								
						}
					}else if (fieldName === 'itemRtnNmbr') {
						if (!Ext.isEmpty(operatorValue)) {
							if (!Ext.isEmpty(fieldVal)) {
								$('#itemRtnNmbrOperator').val(operatorValue);
								$('#itemRtnNmbr').val(fieldVal);								
							}
						}
					}
					if (fieldName === 'postingDate') {
						me.setSavedFilterPostingDate(fieldName, currentFilterData);
					}
				}
				if(!Ext.isEmpty(filterCode)){
					$('#savedFilterAs').val(filterCode);
				}
				$("input[type='text'][id='depositAccount']").prop('disabled', true);
				$("select[id='depositTicketOperator']").prop('disabled', true);
				$("select[id='serialNmbrOperator']").prop('disabled', true);
				$("select[id='itemAmountOperator']").prop('disabled', true);
				$("select[id='itemSeqNmbrOperator']").prop('disabled', true);
				$("select[id='itemRtnNmbrOperator']").prop('disabled', true);
				$("input[type='text'][id='depositTicket']").prop('disabled', true);
				$("input[type='text'][id='serialNmbr']").prop('disabled', true);
				$("input[type='text'][id='itemAmount']").prop('disabled', true);
				$("input[type='text'][id='itemSeqNmbr']").prop('disabled', true);
				$("input[type='text'][id='itemRtnNmbr']").prop('disabled', true);
				$("input[type='text'][id='savedFilterAs']").prop('disabled', true);
			},
/*			postDoSaveAndSearch : function()
			{
				var me = this;
				me.doSearchOnly();
			},*/
			postDoSaveAndSearch : function() {
				var me = this, objGroupView = null, savedFilterCombobox = me
						.getFilterView().down('combo[itemId="savedFiltersCombo"]');
				var objAdvSavedFilterComboBox, blnOptionPresent = false, arrValues = [];
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
			doSearchOnly : function() {
				var me = this;
				var blnFilterSave = false;
				
				isValidSearch = handleFilterDataValidation(blnFilterSave,null);
				if(isValidSearch) {
					if (!$('#advancedFilterErrorDiv').hasClass('ui-helper-hidden')) {
						$('#advancedFilterErrorDiv').addClass('ui-helper-hidden');
					}
					var entryDateLableVal = $('label[for="PostingDateLabel"]').text();
					
					var sel = document.getElementById("depositAccount");
					var depositAccountVal = sel.options[sel.selectedIndex].value; // or sel.value
					var depositAccountDesc = sel.options[sel.selectedIndex].text;
					var postingDateLableVal = $('label[for="PostingDateLabel"]').text();
					var postingDateField = $("#depositItemDateAdvFilter");
					me.handlePostingDateSync('A', postingDateLableVal, '', postingDateField, '');
					me.handleDepositAccFieldSync('A', 'depositAccount',depositAccountVal,depositAccountDesc );
					me.applyAdvancedFilter();
					
				}
			},
			
			handleDepositAccFieldSync : function(type,statusData,code,desc){
				var me = this;
				if(!Ext.isEmpty(type)){
					if(type === 'Q'){
						var objField = $('#depositAccount');
						if(!Ext.isEmpty(statusData)){
							objField.val(desc);
						}
						else if(Ext.isEmpty(statusData)){
							objField.val('');
						}
						objField.multiselect("refresh");
						objField.niceSelect('update');
					}
					if(type === 'A'){
						var objStatusField = me.getFilterView().down('combo[itemId="quickFilterAccountCombo"]');
						if(!Ext.isEmpty(statusData)) {
							me.typeFilterVal = code;
							me.typeFilterDesc = desc;
							objStatusField.setValue(desc);
						} else {
							objStatusField.setValue(desc);
							me.typeFilterVal = null;
							me.typeFilterDesc = null;
						}
					}
				}
			},
			handlePostingDateSync : function(valueChangedAt, sourceLable, sourceToolTipText, sourceTextRef, filterOperator ) {
				var me = this, labelToChange, valueControlToChange, updatedDateValue;
				
				labelToChange = (valueChangedAt === 'Q') ? $('label[for="PostingDateLabel"]') : me.getDateLabel();
				valueControlToChange = (valueChangedAt === 'Q') ? $('#depositItemDateAdvFilter') : $('#itemDatePickerQuickText');
				updatedDateValue = sourceTextRef.getDateRangePickerValue();
				
				if(labelToChange && valueControlToChange && valueControlToChange.hasClass('is-datepick')) {
					if(valueChangedAt === 'Q') {
						labelToChange.text(sourceLable);
					} else {
						labelToChange.setText(sourceLable);
					}
					if(!Ext.isEmpty(updatedDateValue)) {
						// currently only singe date consideration 
						if(valueChangedAt === 'Q') {
							selectedDepositDate = {
									operator : filterOperator,
									fromDate : updatedDateValue,
									toDate : updatedDateValue
								};
						}
						valueControlToChange.setDateRangePickerValue(updatedDateValue);
					}
				}
			},			
			applyAdvancedFilter : function(filterData)
			{
				var me = this,objGroupView = me.getGroupView();
				me.filterApplied = 'A';
				me.setDataForFilter(filterData);
				me.refreshData();
				if (objGroupView)
					objGroupView.toggleFilterIcon(true);
				objGroupView.setFilterToolTip(me.showAdvFilterCode || '');
			},			
			handleSaveAndSearchAction : function(btn) {
				var me = this;
				var blnFilterSave = true;
				var callBack = this.postDoSaveAndSearch;
				var strFilterCodeVal = null;
				var FilterCode = $("#filterCode").val();
				strFilterCodeVal =FilterCode;
				me.savedFilterVal = strFilterCodeVal;
				isValidSearch = handleFilterDataValidation(blnFilterSave,strFilterCodeVal);
				if(isValidSearch) {
					if (!$('#advancedFilterErrorDiv').hasClass('ui-helper-hidden')) {
						$('#advancedFilterErrorDiv').addClass('ui-helper-hidden');
					}
				}					
				me.filterCodeValue = strFilterCodeVal;
				me.savePrefAdvFilterCode = strFilterCodeVal;
				if(isValidSearch) {
					me.postSaveFilterRequest(strFilterCodeVal, callBack);	
				}
			},			
			postSaveFilterRequest : function( FilterCodeVal, fncallBack )
			{
				var me = this;
				var strUrl = 'userfilters/instrumentInqFilter/{0}.srvc';
				strUrl = Ext.String.format( strUrl, FilterCodeVal );
				var objJson = getInstAdvancedFilterValueJson(FilterCodeVal);
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
							strMsg = responseData.d.error.errorMessage;
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

						if( FilterCodeVal && isSuccess && isSuccess === 'Y' )
						{
							$('#depItemAdvancedFilterPopup').dialog('close');
							fncallBack.call(me);
						//	me.reloadFilters(filterGrid.getStore());
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
						$("#depositAccount").niceSelect('update');
						$('#depositAccount').niceSelect('update');
						var objStatusField = me.getFilterView().down('combo[itemId="quickFilterAccountCombo"]');
						objStatusField.setValue(fieldVal);
					} else if (fieldName === 'depositTicketNmbr') {
						if (!Ext.isEmpty(operatorValue)) {
							if (!Ext.isEmpty(fieldVal)) {
								$('#depositTicketOperator').val(operatorValue);
								$("#depositTicketOperator").niceSelect('update');
								$('#depositTicket').val(fieldVal);								
							}
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
					} else if (fieldName === 'itemAmount') {
						if (!Ext.isEmpty(operatorValue)) {
							if (!Ext.isEmpty(fieldVal)) {
								$('#itemAmountOperator').val(operatorValue);
								$("#itemAmountOperator").niceSelect('update');
								$('#itemAmount').val(fieldVal);								
							}
							if('bt'==operatorValue)
							{
								$('#itemAmountTo').show();	
								$('#itemAmount1').prop('disabled', false);
							}																
							if(!Ext.isEmpty(fieldVal2))
							{										
								$('#itemAmount1').val(fieldVal2);									
							}							
						}
					} else if (fieldName === 'serialNmbr') {
						if (!Ext.isEmpty(operatorValue)) {
							if (!Ext.isEmpty(fieldVal)) {
								$('#serialNmbrOperator').val(operatorValue);
								$("#serialNmbrOperator").niceSelect('update');
								$('#serialNmbr').val(fieldVal);								
							}
							if('bt'==operatorValue)
							{
								$('#serialNmbrTo').show();	
								$('#serialNmbr1').prop('disabled', false);
							}																
							if(!Ext.isEmpty(fieldVal2))
							{										
								$('#serialNmbr1').val(fieldVal2);									
							}							
						}
					}else if (fieldName === 'itemSeqNmbr') {
						if (!Ext.isEmpty(operatorValue)) {
							if (!Ext.isEmpty(fieldVal)) {
								$('#itemSeqNmbrOperator').val(operatorValue);
								$("#itemSeqNmbrOperator").niceSelect('update');
								$('#itemSeqNmbr').val(fieldVal);								
							}
							if('bt'==operatorValue)
							{
								$('#itemSeqNmbrTo').show();	
								$('#itemSeqNmbr1').prop('disabled', false);
							}																
							if(!Ext.isEmpty(fieldVal2))
							{										
								$('#itemSeqNmbr1').val(fieldVal2);									
							}								
						}
					}else if (fieldName === 'itemRtnNmbr') {
						if (!Ext.isEmpty(operatorValue)) {
							if (!Ext.isEmpty(fieldVal)) {
								$('#itemRtnNmbrOperator').val(operatorValue);
								$("#itemRtnNmbrOperator").niceSelect('update');
								$('#itemRtnNmbr').val(fieldVal);								
							}
						}
					}
					if (fieldName === 'postingDate') {
						me.setSavedFilterPostingDate(fieldName, currentFilterData);
					}
				}
/*				if(!Ext.isEmpty(filterCode)){
					$('#savedFilterAs').val(filterCode);
				}*/
				
				if (!Ext.isEmpty(filterCode)) {
					$('#filterCode').val(filterCode);
					$("#msSavedFilter option[value='"+filterCode+"']").attr("selected",true);
					$("#msSavedFilter").multiselect("refresh");
					var saveFilterChkBox = $("input[type='checkbox'][id='saveFilterChkBox']");
					saveFilterChkBox.prop('checked', true);
				}
				$("input[type='text'][id='depositAccount']").prop('disabled', false);
				$("select[id='depositTicketOperator']").prop('disabled', false);
				$("select[id='serialNmbrOperator']").prop('disabled', false);
				$("select[id='itemAmountOperator']").prop('disabled', false);
				$("select[id='itemSeqNmbrOperator']").prop('disabled', false);
				$("select[id='itemRtnNmbrOperator']").prop('disabled', false);
				$("input[type='text'][id='depositTicket']").prop('disabled', false);
				$("input[type='text'][id='itemAmount']").prop('disabled', false);
				$("input[type='text'][id='itemSeqNmbr']").prop('disabled', false);
				$("input[type='text'][id='itemRtnNmbr']").prop('disabled', false);
				$("input[type='text'][id='savedFilterAs']").prop('disabled', false);
				
				if( $('#depositTicketOperator').val() != 'all' )
				{
					$('#depositTicket').removeAttr("disabled");
				}
				else
				{
					$('#depositTicket').val('');
					$('#depositTicket').attr("disabled", true);
				}
				if( $('#serialNmbrOperator').val() != 'all' )
				{
					$('#serialNmbr').removeAttr("disabled");
				}
				else
				{
					$('#serialNmbr').val('');
					$('#serialNmbr').attr("disabled", true);
				}
				
				if( $('#itemAmountOperator').val() != 'all' )
				{
					$('#itemAmount').removeAttr("disabled");
				}
				else
				{
					$('#itemAmount').val('');
					$('#itemAmount').attr("disabled", true);
				}
				
				if( $('#itemSeqNmbrOperator').val() != 'all' )
				{
					$('#itemSeqNmbr').removeAttr("disabled");
				}
				else
				{
					$('#itemSeqNmbr').val('');
					$('#itemSeqNmbr').attr("disabled", true);
				}
					
				if( applyAdvFilter )
					me.applyAdvancedFilter();
			},
			handleSavePreferences : function()
			{
				var me = this;
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
				//me.toggleSavePrefrenceAction(false);
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
						if(( groupInfo.groupTypeCode !== 'DEPITEM_OPT_ADVFILTER' || groupInfo.groupTypeCode == 'DEPITEM_OPT_ADVFILTER' && subGroupInfo.groupCode == 'all')) {	
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
				//quickPref.instrumentStatus = me.typeFilterVal;
				quickPref.requestDate = me.dateFilterVal;
				if (me.dateFilterVal === '13') {
					if (!Ext.isEmpty(me.dateFilterFromVal)
							&& !Ext.isEmpty(me.dateFilterToVal)) {
						quickPref.instrumentDateFrom = me.dateFilterFromVal;
						quickPref.instrumentDateTo = me.dateFilterToVal;					
					} else {
						var strSqlDateFormat = 'Y-m-d';
						var frmDate = me.getFromDepositDate().getValue();
						var toDate = me.getToDepositDate().getValue();
						fieldValue1 = Ext.util.Format.date(frmDate, 'Y-m-d');
						fieldValue2 = Ext.util.Format.date(toDate, 'Y-m-d');
						quickPref.instrumentDateFrom = fieldValue1;
						quickPref.instrumentDateTo = fieldValue2;
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
										//me.toggleClearPrefrenceAction(true);
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
			instrumentInqviewInfoPopUp : function( record )
			{
				var me = this;
				me.getInstrumentInqViewInfoPopupValue( record );
				if( !Ext.isEmpty( me.objViewInfoPopup ) )
				{
					me.objViewInfoPopup.show();
				}
				else
				{
					me.objViewInfoPopup = Ext.create( 'GCP.view.InstrumentInqViewInfo' );
					me.objViewInfoPopup.show();
				}
			},
			getInstrumentInqViewInfoPopupValue : function( record )
			{
				var me = this;
				var boolVal = true;
				var objCreateViewInfoPanel = me.getInstrumentInqViewInfoDtlRef();

				objCreateViewInfoPanel.down( 'textfield[itemId="itemNmbr"]' ).setValue(
					record.get( 'itemNmbr' ) );
				objCreateViewInfoPanel.down( 'textfield[itemId="itemAmount"]' ).setValue(
					record.get( 'itemAmount' ) );
				objCreateViewInfoPanel.down( 'textfield[itemId="instrumentDate"]' ).setValue(
					record.get( 'instrumentDate' ) );
				objCreateViewInfoPanel.down( 'textfield[itemId="depositTicket"]' ).setValue( record.get( 'depSlipNmbr' ) );
				objCreateViewInfoPanel.down( 'textfield[itemId="depositDate"]' ).setValue( record.get( 'depositDate' ) );
				objCreateViewInfoPanel.down( 'textfield[itemId="depositAccount"]' ).setValue(
					record.get( 'depositAccount' ) );
				
				objCreateViewInfoPanel.down( 'textfield[itemId="instrumentStatus"]' ).setValue( record.get( 'itemType' ) );
				objCreateViewInfoPanel.down( 'textfield[itemId="debitAccount"]' ).setValue( record.get( 'debitAccount' ) );
				objCreateViewInfoPanel.down( 'textfield[itemId="rtn"]' ).setValue( record.get( 'rtn' ) );
				/*if( record.get( 'instrumentStatus' ) == 'P' )
				{
					objCreateViewInfoPanel.down( 'textfield[itemId="instrumentStatus"]' ).setValue( 'Paid' );
				}
				else
				{
					objCreateViewInfoPanel.down( 'textfield[itemId="instrumentStatus"]' ).setValue( 'UnPaid' );
				}*/

				objCreateViewInfoPanel.down( 'textfield[itemId="itemNmbr"]' ).setReadOnly( boolVal );
				objCreateViewInfoPanel.down( 'textfield[itemId="itemAmount"]' ).setReadOnly( boolVal );
				objCreateViewInfoPanel.down( 'textfield[itemId="instrumentDate"]' ).setReadOnly( boolVal );
				objCreateViewInfoPanel.down( 'textfield[itemId="depositTicket"]' ).setReadOnly( boolVal );
				objCreateViewInfoPanel.down( 'textfield[itemId="depositDate"]' ).setReadOnly( boolVal );
				objCreateViewInfoPanel.down( 'textfield[itemId="depositAccount"]' ).setReadOnly( boolVal );
				objCreateViewInfoPanel.down( 'textfield[itemId="instrumentStatus"]' ).setReadOnly( boolVal );
				objCreateViewInfoPanel.down( 'textfield[itemId="debitAccount"]' ).setReadOnly( boolVal );
				objCreateViewInfoPanel.down( 'textfield[itemId="rtn"]' ).setReadOnly( boolVal );
			},
			closeInstrumentInqInfoPopup : function( btn )
			{
				var me = this;
				me.getInstrumentInqViewInfoRef().close();
			},
			handleReportAction : function( actionName )
			{
				var me = this;
				me.downloadReport( actionName );
			},
			handleCancelButtonAction : function(strUrl) {
					var me = this;
					var form, inputField;
					
					form = document.createElement('FORM');
					form.name = 'frmMain';
					form.id = 'frmMain';
					form.method = 'POST';
					form.appendChild(me.createFormField('INPUT', 'HIDDEN',
							csrfTokenName, tokenValue));
					
					form.action = strUrl;
					document.body.appendChild(form);
					form.submit();
			},
			downloadReport : function( actionName )
			{
				var me = this;
				var withHeaderFlag = document.getElementById("headerCheckbox").checked;
				var arrExtension =
				{
					downloadXls : 'xls',
					downloadCsv : 'csv',
					downloadPdf : 'pdf',
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
				strUrl = 'services/getInstrumentEnquiryList/getInstrumentEnquiryDynamicReport.' + strExtension;
				strUrl += '?$skip=1';
				var strQuickFilterUrl = me.generateUrlWithQuickFilterParams( this );
				strUrl += strQuickFilterUrl;
				strUrl += me.getFilterUrl(subGroupInfo);
				var strOrderBy = me.reportOrderByURL;
				if(!Ext.isEmpty(strOrderBy)){
					var orderIndex = strOrderBy.indexOf('orderby');
					if(orderIndex > 0){
						strOrderBy = strOrderBy.substring(orderIndex,strOrderBy.length);
						var indexOfamp = strOrderBy.indexOf('&$');
						if(indexOfamp > 0)
							strOrderBy = strOrderBy.substring(0,indexOfamp);
						strUrl += '&$'+strOrderBy;
					}
				}
				var grid = groupView.getGrid();
				viscols = grid.getAllVisibleColumns();
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
			handleAccountChangeInQuickFilter : function(combo) {
				var me = this;		
				var errorSpan = $('#quickFilterErrorDiv');
				var quickFilterDatePick = $('#itemDatePickerQuickText');
				me.typeFilterVal = combo.getValue();
				me.typeFilterDesc = combo.getRawValue();		
				
				me.handleDepositAccFieldSync('Q', 'depositAccount',me.typeFilterVal,me.typeFilterDesc );
				me.filterApplied = 'Q';
				me.filtersAppliedFlag = 'Y';
				me.setDataForFilter();
				me.refreshData();
				if(!Ext.isEmpty(quickFilterDatePick.val()) && (combo.getValue() != 'Select Account' && combo.getValue() != '')){
				 	errorSpan.addClass('ui-helper-hidden');
				}else if(combo.getValue() == 'Select Account'){
					  errorSpan.removeClass('ui-helper-hidden');
					  $('#quickFilterErrorMessage').text("Please select Deposit Account");												 
				}
				else{
					  errorSpan.removeClass('ui-helper-hidden');
					  $('#quickFilterErrorMessage').text("Please select Posting Date");												 
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
				me.filtersAppliedFlag = 'Y';
				me.setDataForFilter();
				if (me.clientFilterVal == 'all') {
					me.savedFilterVal = null;
					me.filterApplied = 'ALL';
					me.refreshData();
				} else {
					me.refreshData();
				}
			},
			handleClearSettings : function() {
				var me = this;
				var objGroupView = me.getGroupView();
				var datePickerRef = $('#entryDataPicker');
				var depItemfilterView = me.getInstrumentInquiryFilterView();
				
				var companyComboRef = depItemfilterView.down('combo[itemId="clientFiltersCombo"]');
				companyComboRef.setValue('All Companies');
				me.clientFilterVal = null;
				me.clientFilterDesc = null;
				
				if(!Ext.isEmpty(me.savedFilterVal))
					me.savedFilterVal = "";
				var savedFilterComboBox = me.getInstrumentInquiryFilterView().down('combo[itemId="savedFiltersCombo"]');
				savedFilterComboBox.setValue(me.savedFilterVal);				
				
				var quickFilterAccountCombo = depItemfilterView.down('combo[itemId="quickFilterAccountCombo"]');
				quickFilterAccountCombo.setValue('Select Account');
				me.typeFilterVal = null;
				me.typeFilterDesc = null;
				quickFilterAccountCombo.setValue(quickFilterAccountCombo.getStore().getAt(0));
		
				var entryDate = depItemfilterView.down('component[itemId="itemDatePickerQuickText"]');
				me.dateFilterVal = '1';
				me.dateFilterLabel = getLabel('today', 'Today'),
				me.handleDateChange(me.dateFilterVal);	
				me.getDateLabel().setText(getLabel('date', 'Posting Date'));
				datePickerRef.val('');
					
				me.advFilterData = null;				
				me.filterApplied = 'Q';
				if (objGroupView)
					objGroupView.toggleFilterIcon(false);
				objGroupView.setFilterToolTip('');
				
				me.filtersAppliedFlag = 'Y';
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
				objGroupView.refreshData();
			},
			searchActionClicked : function(me) {
				//me.doSearchOnly();
				
				var me = this, objGroupView = null, savedFilterCombobox = me
					.getFilterView().down('combo[itemId="savedFiltersCombo"]');
				var SaveFilterChkBoxVal = $("input[type='checkbox'][id='saveFilterChkBox']")
					.is(':checked');
				me.filtersAppliedFlag = 'Y';
				if (SaveFilterChkBoxVal === true) {
					me.handleSaveAndSearchAction();
				} else {
					me.doSearchOnly();
					if (savedFilterCombobox)
						savedFilterCombobox.setValue('');
					objGroupView = me.getGroupView();
					objGroupView.setFilterToolTip('');
				}
			},
			saveAndSearchActionClicked : function(me) {
				me.handleSaveAndSearchAction();
			},
			reloadFilters: function(store){
				store.load({
							callback : function() {
								var storeGrid = filterGridStore('instrumentInqFilter');
								store.loadRecords(
									storeGrid.getRange(0, storeGrid
													.getCount()), {
										addRecords : false
									});
							}
						});
			},
			updateSavedFilterComboInQuickFilter:function(){
				var me=this;
				var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
				if (!Ext.isEmpty(savedFilterCombobox)) {
					me.reloadFilters(savedFilterCombobox.getStore());
					if(me.filterCodeValue!=null){
						me.savedFilterVal=me.filterCodeValue;
					}else{
						me.savedFilterVal='';
					}
					savedFilterCombobox.setValue(me.savedFilterVal);
					me.filterCodeValue=null;
				}
			},
			resetAllFields : function() {
				var me = this;
				$("#depositAccount").val("");
				$('#depositAccount').niceSelect('update');	
				$('#depositAccount-niceSelect').bind('blur',function(){
					markRequired(this);
				});
				$('#depositAccount-niceSelect').bind('focus',function(){
					removeMarkRequired(this);
				});
				$("input[type='text'][id='depositTicket']").val("");
				$("#depositTicketOperator").val('all');
				$('#depositTicketOperator').niceSelect('update');
				$('#depositTicket').attr("disabled", true);
				
				$("input[type='text'][id='itemAmount']").val("");
				$("#itemAmountOperator").val('all');
				$('#itemAmountOperator').niceSelect('update');
				$('#itemAmount').attr("disabled", true);
				
				$("input[type='text'][id='serialNmbr']").val("");
				$("#serialNmbrOperator").val('all');				
				$('#serialNmbrOperator').niceSelect('update');
				$('#serialNmbr').attr("disabled", true);
				
				$("input[type='text'][id='itemSeqNmbr']").val("");
				$("#itemSeqNmbrOperator").val('all');
				$('#itemSeqNmbrOperator').niceSelect('update');
				$('#itemSeqNmbr').attr("disabled", true);
			
				me.dateFilterVal = '1';
				me.dateFilterLabel = getLabel('today', 'Today');
				me.handlePostingDateChange(me.dateFilterVal);
				
				$("#depositTicket1").val('');				
				$("#itemAmount1").val('');
				$("#itemSeqNmbr1").val('');	
				$('#depositTicketTo').hide();
				$('#itemAmountTo').hide();
				$('#itemSeqNmbrTo').hide();
				$('#serialNmbrTo').hide();
				$("#serialNmbr1").val('');
				$("input[type='text'][id='filterCode']").val("");
				$("#msSavedFilter").val("");
				$("#msSavedFilter").multiselect("refresh");
				$("#saveFilterChkBox").attr('checked', false);
				$('#tabs-2 :input:disabled').prop('disabled',false);
				markAdvFilterNameMandatory('saveFilterChkBox','filterName','filterCode')

			},
			setSavedFilterPostingDate : function(dateType, data) {
				if (!Ext.isEmpty(dateType) && !Ext.isEmpty(data)) {
					var me = this;
					var dateFilterRef = null;
					var dateOperator = data.operator;

					if (dateType === 'postingDate') {
						dateFilterRef = $('#depositItemDateAdvFilter');
					}

					if (dateOperator === 'eq') {
						var fromDate = data.value1;
						if (!Ext.isEmpty(fromDate)) {
							var formattedFromDate = Ext.util.Format.date(Ext.Date
											.parse(fromDate, 'Y-m-d'),
									strExtApplicationDateFormat);
							$(dateFilterRef).val(formattedFromDate);
						}

					} else if (dateOperator === 'bt') {
						var fromDate = data.value1;
						if (!Ext.isEmpty(fromDate)) {
							var formattedFromDate = Ext.util.Format.date(Ext.Date
											.parse(fromDate, 'Y-m-d'),
									strExtApplicationDateFormat);
							var toDate = data.value2;
							if (!Ext.isEmpty(toDate)) {
								var formattedToDate = Ext.util.Format.date(Ext.Date
												.parse(toDate, 'Y-m-d'),
										strExtApplicationDateFormat);
								$(dateFilterRef).setDateRangePickerValue([
										formattedFromDate, formattedToDate]);
							}
						}
					}
					selectedDepositDate = {
						operator : dateOperator,
						fromDate : formattedFromDate,
						toDate : formattedToDate
					};
					
				} else {
				}
			},
			handleDepositAdvDateChange : function(index) {
				var me = this;
				var dateToField;
				var objDateParams = me.getDateParam(index,null);

				if (!Ext.isEmpty(me.postingDateFilterLabel)) {
					$('label[for="PostingDateLabel"]').text(getLabel('postingDate',
							'Posting Date')
							+ " (" + me.postingDateFilterLabel + ")");
				}
				
				var vFromDate = Ext.util.Format.date(Ext.Date.parse(
								objDateParams.fieldValue1, 'Y-m-d'),
						strExtApplicationDateFormat);
				var vToDate = Ext.util.Format.date(Ext.Date.parse(
								objDateParams.fieldValue2, 'Y-m-d'),
						strExtApplicationDateFormat);
				var filterOperator=objDateParams.operator;
				
				if (index == '13') {
					if (filterOperator == 'eq') {
						$('#depositItemDateAdvFilter').setDateRangePickerValue(vFromDate);
					} else {
						$('#depositItemDateAdvFilter').setDateRangePickerValue([
								vFromDate, vToDate]);
					}
					//if(filterOperator=='eq')
					//	dateToField="";
					//else
						dateToField=vToDate;
					selectedDepositDate={
						operator:filterOperator,
						fromDate:vFromDate,
						toDate:dateToField
					};
				} else {
					if (index === '1' || index === '2' || index === '12') {
						if (index === '12') {
							$('#depositItemDateAdvFilter').val('Till' + '  ' + vFromDate);
						} else {
							$('#depositItemDateAdvFilter').setDateRangePickerValue(vFromDate);
						}
					} else {
						$('#depositItemDateAdvFilter').setDateRangePickerValue([
								vFromDate, vToDate]);
					}
					//if(filterOperator=='eq')
					//	dateToField="";
					//else
						dateToField=vToDate;
					selectedDepositDate={
						operator:filterOperator,
						fromDate:vFromDate,
						toDate:dateToField
					};
				}
			},
			disablePreferencesButton: function(btnId,boolVal){
				$("#"+btnId).attr("disabled",boolVal);
				if(boolVal)
					$("#"+btnId).css("color",'grey');
				else
					$("#"+btnId).css("color",'#FFF');
			},
			postingDateChange : function(btn, opts) {
				var me = this;
				me.postingDateFilterVal = btn.btnValue;
				me.postingDateFilterLabel = btn.text;
				me.handleDepositAdvDateChange(btn.btnValue);
			},
			showDepositImageDaejaViewONE : function( imageNmbr,depositTicketNmbr,sessionId, checkSeqNmbr,side)
			{
				$(document).ajaxStart($.blockUI({message: '<h2><class="middleAlign"/>&nbsp;Loading</h2>', timeout:2000,
					css:{ height:'32px',padding:'8px 0 0 0'}})).ajaxStop($.unblockUI);
				var me = this;
				var strUrl = 'instrumentInq/getInstrumentImage.srvc?$isDaejaViewer=Y&'+csrfTokenName + '=' + csrfTokenValue+'&identifier=' +''+'&$hostImageKey='+imageNmbr+'&$side='+side+'&$imgType=I'+
				 '&$depositTicketNmbr='+depositTicketNmbr+'&$sessionId='+sessionId+'&$checkSeqNmbr='+checkSeqNmbr;

				if(document.getElementById("viewONE"))
				{
					document.getElementById("viewONE").setView(3);
					document.getElementById("viewONE").openFile(strUrl, 1);
				}
				else
				{
					addViewer('instrumentImageDiv', strUrl);
				}
				$( '#instrumentImageDiv' ).dialog(
				{
					autoOpen : false,
					height : "678",
					modal : true,
					resizable : false,
					draggable: false,
					width : "1200",
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
                    },
        			close: function( event, ui ) {
        				$.unblockUI();
        			},
					open: function( event, ui ) {
						$.unblockUI();
    				}
				} );
				$( '#instrumentImageDiv' ).dialog( 'open' );
			}
		} );
function handleFilterDataValidation(blnFilterSave,strFilterCodeVal) 
{
	var arrError = new Array(),isValidSearch=true;
	var itemAmountOperator = $('#itemAmountOperator').val();
	var depositTicketOperator = $('#depositTicketOperator').val();
	var serialNmbrOperator = $('#serialNmbrOperator').val();
	var itemSeqNmbrOperator =$('#itemSeqNmbrOperator').val();
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
	if (Ext.isEmpty($('#depositItemDateAdvFilter').val())) {
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

	if(!Ext.isEmpty(serialNmbrOperator) && serialNmbrOperator !='bt' && serialNmbrOperator !='all' && Ext.isEmpty($('#serialNmbr').val()))
	{
		arrError.push({	"errorMessage" : "Please enter value for Item Check No."});		
	}
	else if(serialNmbrOperator == 'bt' && (Ext.isEmpty($('#serialNmbr').val()) || Ext.isEmpty($('#serialNmbr1').val())) )
	{
		arrError.push({	"errorMessage" : "Please enter valid values for Item Check No. and To Item Check No."});
	}
	else if(serialNmbrOperator != 'all')
	{
		if(!Ext.isEmpty($('#serialNmbr').val()))
		{
			var temp = $('#serialNmbr').val();
			var pattern = /^\d+$/;
			if(!pattern.test(temp))
			{
				arrError.push({	"errorMessage" : "Only numeric values allowed for Check No. field."});
			}
		}
		if(!Ext.isEmpty($('#serialNmbr1').val()))
		{
			var temp = $('#serialNmbr1').val();
			var pattern = /^\d+$/;
			if(!pattern.test(temp))
			{
				arrError.push({	"errorMessage" : "Only numeric values allowed for To Check No. field."});
			}
		}
	}
	
	if(!Ext.isEmpty(itemAmountOperator) && itemAmountOperator !='bt' && itemAmountOperator !='all'  && Ext.isEmpty($('#itemAmount').val())) {
		arrError.push({	"errorMessage" : "Please enter value for Item Amount"});		
	}else if(itemAmountOperator == 'bt' && (Ext.isEmpty($('#itemAmount').val()) || Ext.isEmpty($('#itemAmount1').val())) ) {
		arrError.push({	"errorMessage" : "Please enter valid values for Item Amount and To Item Amount"});
	}
	
	if(!Ext.isEmpty(itemSeqNmbrOperator) && itemSeqNmbrOperator !='bt'&& itemSeqNmbrOperator !='all' && Ext.isEmpty($('#itemSeqNmbr').val()))
	{
		arrError.push({	"errorMessage" : "Please enter value for Item Sequence Number"});		
	}
	else if(itemSeqNmbrOperator == 'bt' && (Ext.isEmpty($('#itemSeqNmbr').val()) || Ext.isEmpty($('#itemSeqNmbr1').val())) )
	{
		arrError.push({	"errorMessage" : "Please enter valid values for Item Sequence Number and To Item Sequence Number"});
	}
	else if(itemSeqNmbrOperator != 'all')
	{
		if(!Ext.isEmpty($('#itemSeqNmbr').val()))
		{
			var temp = $('#itemSeqNmbr').val();
			var pattern = /^\d+$/;
			if(!pattern.test(temp))
			{
				arrError.push({	"errorMessage" : "Only numeric values allowed for Check No. field."});
			}
		}
		if(!Ext.isEmpty($('#itemSeqNmbr1').val()))
		{
			var temp = $('#itemSeqNmbr1').val();
			var pattern = /^\d+$/;
			if(!pattern.test(temp))
			{
				arrError.push({	"errorMessage" : "Only numeric values allowed for To Check No. field."});
			}
		}
	}

	if(arrError.length>0)
		isValidSearch = false;
	paintAdvancedFilterErrors('#advancedFilterErrorDiv','#advancedFilterErrorMessage',arrError);
	return isValidSearch;
}		
		
function getPopulateInstrumentImage( imageNmbr , depositTicketNmbr, sessionId, checkSeqNmbr, side)
{
	GCP.getApplication().fireEvent( 'callPopulateInstrumentImage', imageNmbr,depositTicketNmbr, sessionId, checkSeqNmbr, side );
}
function callToDepositPage()
{
	GCP.getApplication().fireEvent( 'callDepositPage', depSlipNmbr, sessionId );
}
function getDepositItemPage()
{
	GCP.getApplication().fireEvent( 'getDepositPage', depSlipNmbr, sessionId );
}