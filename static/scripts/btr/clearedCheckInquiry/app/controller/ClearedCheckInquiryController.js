Ext
	.define(
		'GCP.controller.ClearedCheckInquiryController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'GCP.view.ClearedCheckInquiryGroupView', 'Ext.ux.gcp.DateHandler'
			],
			views :
			[
				'GCP.view.ClearedCheckInquiryView', 'GCP.view.ClearedCheckInqAdvancedFilterPopup'				
			],
			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[
				{
					ref : 'clearedCheckInquiryView',
					selector : 'clearedCheckInquiryView'
				},
				{
					ref : 'groupView',
					selector : 'clearedCheckInquiryView groupView'
				},
				{
					ref : 'clearedCheckInquiryGroupView',
					selector : 'clearedCheckInquiryView clearedCheckInquiryGroupView'
				},
				{
					ref : 'clearedCheckInquiryFilterView',
					selector : 'clearedCheckInquiryFilterView'
				},
				{
					ref : 'filterView',
					selector : 'filterView'
				},
				{
					ref : 'dateLabel',
					selector : 'clearedCheckInquiryFilterView label[itemId="dateLabel"]'
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
				objAdvFilterPopup : null,
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
				dateFilterVal : '12',
				dateRangeFilterVal : '13',
				datePostingFilter : '14',
				dateFilterFromVal : '',
				dateFilterToVal : '',
				dateFilterLabel : getLabel('today', 'Today'),
				advDateFilterFromVal : '',
				advDateFilterToVal : '',				
				advDateFilterLabel : getLabel('today', 'Today'),				
				filterCodeValue : null,
				savePrefAdvFilterCode : null,
				urlGridPref : 'userpreferences/clearedCheckInq/gridView.srvc',
				urlGridFilterPref : 'services/userpreferences/clearedCheckInq.json',
				commonPrefUrl : 'services/userpreferences/clearedCheckInq.json',
				strGetModulePrefUrl : 'services/userpreferences/clearedCheckInq/{0}.json',
				dateHandler : null,
				customizePopup : null,
				reportOrderByURL : null,
				datePickerSelectedDate : [],
				clientFilterVal : 'all',
				clientFilterDesc : '',
				savedFilterVal : '',
				preferenceHandler : null,
				strPageName : 'clearedCheckInq',
				postingDateFilterVal : '1',
				postingDateFilterLabel : getLabel('today', 'Today'),
				strDefaultMask : '0000000000',
				showPrefDate : true,
				sessionID :null,
				ishostCall : false
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
					callPopulateClearedCheckImage : function( imageNmbr ,depositTicketNmbr, sessionId,side)
					{
						me.populateClearedCheckImage( imageNmbr, depositTicketNmbr, sessionId, side );
					},
					callDepositPage : function( depSlipNmbr )
					{
						me.goToDepositPage( depSlipNmbr );
					},
					handleCancelButtonAction : function() {
								//me.handleCancelButtonAction('depositInquiry.srvc');
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
				$(document).on('deleteFilterEvent', function(event, filterCode) {
					me.deleteFilterSet(filterCode);
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
				$(document).on('handleClientChangeInQuickFilter',function(event,isSessionClientFilter) {
					me.handleClientChangeInQuickFilter(isSessionClientFilter);
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

				me.objAdvFilterPopup = Ext.create( 'GCP.view.ClearedCheckInqAdvancedFilterPopup',
				{
					parent : 'clearedCheckInqStdView',
					itemId : 'stdViewAdvancedFilter',
					filterPanel :
					{
						xtype : 'clearedCheckInqCreateNewAdvFilter',
						margin : '4 0 0 0',
						callerParent : 'clearedCheckInqStdView'
					}
				} );

				this.dateHandler = Ext.create( 'Ext.ux.gcp.DateHandler' );
				var showClearFlag = false;
				//me.updateFilterConfig();
				//me.updateAdvFilterConfig();

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
						'clearedCheckInquiryView' :
						{
							afterrender : function( panel, opts )
							{
							}
						},
						'filterView' : {
							appliedFilterDelete : function(btn){
								me.sessionID = null;
								me.handleAppliedFilterDelete(btn);
							}
						},
						'clearedCheckInquiryGroupView groupView smartgrid' : {
							'cellclick' : me.handleGridRowClick
						},
						'clearedCheckInquiryGroupView groupView' : {
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
									me.retrieveData();
									me.setSessionId(grid);
							},
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
								if (objClearedChkPref) {
									var objJsonData = Ext.decode(objClearedChkPref);
									if (!Ext.isEmpty(objJsonData.d.preferences)) {
										if (!Ext
												.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
											if (!Ext
													.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
												var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
												me.doHandleSavedFilterItemClick(advData);
												me.savedFilterVal = advData;
												me.showPrefDate = false;
												//showAdvanceFilterPopup('clearedCheckInqFilter');
											}
											else
											{
												showAdvanceFilterPopup('clearedCheckInqFilter');
												/*Setting default postingdate as Today(Application date)*/
												me.postingDateFilterVal = '1';
												me.postingDateFilterLabel =  getLabel('today', 'Today');
												me.handlePostingDateChange('1');
											}
										}
										else
										{
											showAdvanceFilterPopup('clearedCheckInqFilter');
											/*Setting default postingdate as Today(Application date)*/
											me.postingDateFilterVal = '1';
											me.postingDateFilterLabel =  getLabel('today', 'Today');
											me.handlePostingDateChange('1');
										}
									}
								}
							},
							afterrender : function() {
								if (objGridViewPref) {
									//me.toggleSavePrefrenceAction(false);
									//me.toggleClearPrefrenceAction(true);
								}
							}
						},						
						'clearedCheckInquiryFilterView' :
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
							handleAccountChangeInQuickFilter : function(combo) {
								me.sessionID = null;
								me.handleAccountChangeInQuickFilter(combo);
							},
							handleSavedFilterItemClick : function(comboValue, comboDesc) {
								me.sessionID = null;
								me.doHandleSavedFilterItemClick(comboValue);
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
								me.handleDateChange( btn.btnValue );
								if( btn.btnValue !== '7' )
								{
									me.filterApplied = 'Q';
									me.setDataForFilter();
									me.applyQuickFilter();
								}

							}
						},
						'clearedCheckInquiryFilterView combo[itemId="quickFilterAccountCombo"]' : {
							'afterrender' : function(combo, newValue, oldValue, eOpts) {
								if (!Ext.isEmpty(me.typeFilterVal) && me.typeFilterVal !== 'all') {
									combo.setValue(me.typeFilterVal);
								}else{
									combo.setValue(combo.getStore().getAt(0));
								}
							},
							'boxready' : function(combo, newValue, oldValue, eOpts){
								var accountVal = $("select[id='clearedCheckAccount']").val();
								if(!Ext.isEmpty(accountVal)){
									combo.setValue(accountVal);
								}
							}
						},
						'clearedCheckInquiryFilterView combo[itemId="savedFiltersCombo"]' : {
							'afterrender' : function(combo, newValue, oldValue, eOpts) {
								if (!Ext.isEmpty(me.savedFilterVal)) {
									combo.setValue(me.savedFilterVal);
								}
							}
						},
						'clearedCheckInquiryFilterView component[itemId="clearedCheckDatePickerQuick"]' : {
							render : function() {
								$('#clearedCheckDatePickerQuickText').datepick({
									monthsToShow : 1,
									//withoutRange : true,
									rangeSeparator : '  to  ',
									minDate : dtHistoryDate,
									changeMonth :true,
							        changeYear :true,
							        rangeSelect: false,
									onClose : function(dates) {
										me.sessionID = null;
										var errorSpan = $('#quickFilterErrorDiv');
										var quickFilterAccountCombo = me.getClearedCheckInquiryFilterView().down('combo[itemId="quickFilterAccountCombo"]');
										if (!Ext.isEmpty(dates)) {
											me.datePickerSelectedDate = dates;
											me.dateFilterVal = '13';
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
											me.applyQuickFilter();											
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
								/*,
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
						'filterView label[itemId="createAdvanceFilterLabel"]' : {
							'click' : function() {
								var me = this;
								showAdvanceFilterPopup('clearedCheckInqFilter');
								/*Setting default postingdate as Today(Application date)*/
								//me.resetAllFields();
								//me.postingDateFilterVal = '1';
								//me.postingDateFilterLabel =  getLabel('today', 'Today');
								//me.handlePostingDateChange('1');
								me.assignSavedFilter();
								
							}
						},
						'filterView button[itemId="clearSettingsButton"]' : {
							'click' : function() {
								me.sessionID = null;
								me.handleClearSettings();
							}
						}
					} );
			},
			doHandleRowActions : function(actionName, grid, record) {
				var me = this;
				if( actionName === 'btnView' )
				{
					callToInstrumentPage(record.get( 'depositTicketNmbr' ),record.get('sessionId'));
				}
				if( actionName === 'btnCheckImg' )
				{
					var side = 'F';
					getPopulateClearedCheckImage( record.get( 'clearedCheckImgNmbr' ), record.get( 'depositTicketNmbr' ),record.get('sessionId'), side );
				}				
			},
			retrieveData : function()
			{
				var me = this;				
				me.isGridDataLoad = true;
				//me.onClearedCheckInquiryInformationViewRender();
			},
			populateClearedCheckImage : function( imageNmbr, depositTicketNmbr, sessionId, side)
			{
				var me = this;
				if(daejaViewONESupport)
				{
					me.showDepositImageDaejaViewONE(imageNmbr,depositTicketNmbr,sessionId, side);
				}
				else
				{
					me.showDepositImageJqueryPopup(imageNmbr,depositTicketNmbr,sessionId, side);
				}
			},
			showDepositImageJqueryPopup : function( imageNmbr,depositTicketNmbr,sessionId,side )
			{
				//$(document).ajaxStart($.blockUI({message:"Loading...", timeout:10000,css:{ height:'32px',padding:'8px 0 0 0'}})).ajaxStop($.unblockUI);
				var me = this;
				me.getClearedCheckInquiryGroupView().setLoading( true );
				var strUrl = 'clearedCheckInq/getDepositImage.srvc?'+csrfTokenName + '=' + csrfTokenValue+'&identifier=' +''+'&$hostImageKey='+imageNmbr+'&$side='+ side +'&$imgType=C'+'&$depositTicketNmbr='+depositTicketNmbr+'&$sessionId='+sessionId;
				$.ajax(
				{
					type : 'POST',
					url : strUrl,
					dataType : 'html',
					success : function( data )
					{
						//$.unblockUI();
						me.getClearedCheckInquiryGroupView().setLoading( false );
						/*var $response = $( data );

						if( $response.find( '#imageAppletDiv' ).length == 0 )
						{*/
							$( '#clearedCheckImageDiv' ).html( '<img width="1000" height="500" src="data:image/jpeg;base64,' + data + '"/>' );
						/*}
						else
						{
							$( '#clearedCheckImageDiv' ).html( $response.find( '#imageAppletDiv' ) );
						}*/
						$( '#clearedCheckImageDiv' ).dialog(
						{
							bgiframe : true,
							autoOpen : false,
							//height : "auto",
							height : "700",
							modal : true,
							resizable : true,
							//width : "auto",
							width : "1200",
							title : 'Image',
							buttons :
							{
								"Close" : function()
								{
									$( this ).dialog( "close" );
								},
								"Flip Over" : function()
								{
									if(modelBytes=='Front')
									{
										$( this ).dialog( "close" );
										me.populateClearedCheckImage( imageNmbr,depositTicketNmbr,sessionId,'B' );
										modelBytes = 'Back';
									 }
									 else
									 {
										$( this ).dialog( "close" );
										me.populateClearedCheckImage(imageNmbr,depositTicketNmbr,sessionId,'F' );
										modelBytes = 'Front';
									 }
								},
								"Print" : function()
								{
									var strFrontUrl = 'clearedCheckInq/getDepositImage.srvc?'+csrfTokenName + '=' + 
									csrfTokenValue+'&identifier=' +''+'&$hostImageKey='+imageNmbr+'&$side=F'+
									'&$imgType=C'+'&$depositTicketNmbr='+depositTicketNmbr+'&$sessionId='+sessionId;
									var strBackUrl = 'clearedCheckInq/getDepositImage.srvc?'+csrfTokenName + '=' + 
									csrfTokenValue+'&identifier=' +''+'&$hostImageKey='+imageNmbr+'&$side=B'+
									'&$imgType=C'+'&$depositTicketNmbr='+depositTicketNmbr+'&$sessionId='+sessionId;
									printFrontImage(strFrontUrl,strBackUrl);
								}
							},
						open: function() {
							$('.ui-dialog-buttonpane').find('button:contains("Print")').css('color','#4a4a4a')
								.css('background-color','#FFF').css('margin-left','10px').css('border','1px solid #4a4a4a');
							$('.ui-dialog-buttonpane').find('button:contains("Flip Over")').css('color','#4a4a4a')
							.css('background-color','#FFF').css('margin-left','10px').css('border','1px solid #4a4a4a');
							}
						} );
						$( '#dialogMode' ).val( '1' );
						$( '#clearedCheckImageDiv' ).dialog( 'open' );
					},
					error : function( request, status, error )
					{
						
						//$.unblockUI();
						me.getClearedCheckInquiryGroupView().setLoading( false );
						$( '#clearedCheckImageDiv' ).html( '<img src="./static/images/misc/no_image.jpg"/>' );
						$( '#clearedCheckImageDiv' ).dialog(
						{
							bgiframe : true,
							autoOpen : false,
							draggable: false,
							height : "340",
							modal : true,
							resizable : true,
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
                                $("div[class*='ui-dialog-buttonset']").removeClass('ui-dialog-buttonset').addClass('rightfloating');
                                $('.ui-dialog-buttonpane').find('button:contains("Close")').removeClass('ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only');
                                $('.ui-dialog-buttonpane').find('button:contains("Close")').addClass('ft-button ft-button-primary');
							}
						} );
						$( '#dialogMode' ).val( '1' );
						$( '#clearedCheckImageDiv' ).dialog( 'open' );	
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
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'depSlipNmbr', depSlipNmbr ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'dateFilterVal', me.dateFilterVal ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'dateFilterLabel', me.dateFilterLabel ) );	
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'ticketFromDate', ticketFromDate ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'ticketToDate', ticketToDate ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'ticketOperator', ticketOperator ) );
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
					newCard, oldCard) {
				var me = this;
				var objGroupView = me.getGroupView();
				var strModule = '', strUrl = null, args = null, strFilterCode = null;
				groupInfo = groupInfo || {};
				subGroupInfo = subGroupInfo || {};
				if (groupInfo) 
				{
					if (groupInfo.groupTypeCode === 'CLECHECK_OPT_ADVFILTER') 
					{
						strFilterCode = subGroupInfo.groupCode;
						if (strFilterCode !== 'all') 
						{
							if (!Ext.isEmpty(strFilterCode)) 
							{
								me.savePrefAdvFilterCode = strFilterCode;
								me.showAdvFilterCode = strFilterCode;
								me.doHandleSavedFilterItemClick(strFilterCode);
							}
						}
						else 
						{
							me.savePrefAdvFilterCode = null;
							me.showAdvFilterCode = null;
							me.filterApplied = 'ALL';
							me.advFilterData = [];
							var gridModel = {
								showCheckBoxColumn : false
							};
							objGroupView.reconfigureGrid(gridModel);
						}
					}
					else 
					{
						args = {
							scope : me
						};
						strModule = subGroupInfo.groupCode;
						strUrl = Ext.String.format(me.strGetModulePrefUrl, strModule);
						strUrl = strUrl;
						me.getSavedPreferences(strUrl, me.postHandleDoHandleGroupTabChange,
								args);
					}
				}
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
			postHandleDoHandleGroupTabChange : function(data, args) {
				var me = args.scope;
				var objGroupView = me.getGroupView();
				var objSummaryView = me.getClearedCheckInquiryGroupView(), arrSortState = new Array(), objPref = null, gridModel = null, intPgSize = null, showPager = true;
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
			handleEntryDateSync : function(valueChangedAt, sourceLable, sourceToolTipText, sourceTextRef) {
				var me = this, labelToChange, valueControlToChange, updatedDateValue;
				
				labelToChange = (valueChangedAt === 'Q') ? $('label[for="PostingDateLabel"]') : me.getDateLabel();
				valueControlToChange = (valueChangedAt === 'Q') ? $('#postingDatePicker') : $('#clearedCheckDatePickerQuickText');
				updatedDateValue = sourceTextRef.getDateRangePickerValue();
				
				if(labelToChange && valueControlToChange && valueControlToChange.hasClass('is-datepick')) {
					/*if(valueChangedAt === 'Q') {
						labelToChange.text(sourceLable);
						updateToolTip('postingDate', sourceToolTipText);
					} else {
						labelToChange.setText(sourceLable);
					}*/
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
					
					if( paramName == "clearedCheckAccount"){
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
					$("#depositTicketNmbr").val("");
				else if (strFieldName === 'clearedCheckAmount')
					$("#clearedCheckAmount").val("");
				else if (strFieldName === 'clearedCheckAccount')
				{
					me.typeFilterVal = '';
					var quickFilterAccountCombo = me.getClearedCheckInquiryFilterView().down('combo[itemId="quickFilterAccountCombo"]');
					quickFilterAccountCombo.setValue(quickFilterAccountCombo.getStore().getAt(0));
					
					$("#clearedCheckAccount").val("");
					$("#clearedCheckAccount").niceSelect('update');
				}
				if(strFieldName === 'postingDatePicker'){
					/*var datePickerRef = $('#postingDatePicker');
					me.dateFilterVal = '';
					me.getDateLabel().setText(getLabel('postingDate', 'Posting Date'));
					datePickerRef.val('');
					
					selectedPostingDateFilter={};
					me.datePickerSelectedDate = [];
					$('#postingDatePicker').val("");
					$('label[for="PostingDateLabel"]').text(getLabel(getLabel('postingDate', 'Posting Date')));*/
					me.dateFilterVal = '1';
					me.dateFilterLabel = getLabel('today', 'Today'),
					me.handlePostingDateChange(me.dateFilterVal);
					me.handleDateChange(me.dateFilterVal);
				}
				else if(strFieldName ==='clientId'){
									
					if(isClientUser()){
						var clientComboBox = me.getClearedCheckInquiryFilterView()
								.down('combo[itemId="clientComboItem"]');
						me.clientFilterVal = 'All Companies';
						selectedFilterClientDesc = "";
						selectedFilterClient = "";
						selectedClientDesc = "";
						clientComboBox.setValue(me.clientFilterVal);
					} else {
						var clientComboBox = me.getClearedCheckInquiryFilterView()
								.down('combo[itemId="clientAuto]');
						clientComboBox.reset();
						me.clientFilterVal = '';
						selectedFilterClientDesc = "";
						selectedFilterClient = "";
					}
				}
				else if (strFieldName === 'serialNmbr') {
					$("#serialNmbrOperator").val($("#serialNmbrOperator option:first").val());
					$("#serialNmbrOperator").niceSelect('update');
					$("#serialNmbr").val("");
					$("#serialNmbr1").val("");
					$('#div_serialNmbr').hide();
					$('#serialNmbrTo').hide();
				}	
				else if ( strFieldName === 'clearedCheckAmount' )
				{
					$("#clearedCheckAmountOperator").val('');
					$("#clearedCheckAmountOperator").niceSelect('update');
					$("#clearedCheckAmount").val("");
					$("#clearedCheckAmount1").val("");
					$('#clearedCheckAmountTo').hide();
				}
			},
			doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
					newPgNo, oldPgNo, sorter, filterData) {
				var me = this;
				var objGroupView = me.getGroupView();
				var buttonMask = me.strDefaultMask;
				var arrOfParseQuickFilter = [], arrOfParseAdvFilter = [], arrOfFilteredApplied = [];
				objGroupView.handleGroupActionsVisibility(buttonMask);
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );
				me.reportOrderByURL = strUrl;
				me.setDataForFilter();
				
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
				
				/*grid.on('cellclick', function(tableView, td, cellIndex, record, tr, rowIndex, e) {
					var clickedColumn = tableView.getGridColumns()[cellIndex];
					var columnType = clickedColumn.colType;
					if(Ext.isEmpty(columnType)) {
						var containsCheckboxCss = (clickedColumn.cls.indexOf('x-column-header-checkbox') > -1)
						columnType = containsCheckboxCss ? 'checkboxColumn' : '';
					}
					me.handleGridRowClick(record, grid, columnType);
				});	*/			
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
			updateDateFilterView : function()
			{
				var me = this;
				var dtClearedCheckDate = null;
				if('N'==isMenuClicked)
				{
					me.dateFilterVal = strDateFilterVal;
					me.handleDateChange( strDateFilterVal );					
				}	
				else if( !Ext.isEmpty( me.dateFilterVal ) )
				{
					me.handleDateChange( me.dateFilterVal );
					if( me.dateFilterVal === '7' )
					{
						if( !Ext.isEmpty( me.dateFilterFromVal ) )
						{
							dtClearedCheckDate = Ext.Date.parse( me.dateFilterFromVal, "Y-m-d" );
							me.getFromClearedCheckDate().setValue( dtClearedCheckDate );
						}
						if( !Ext.isEmpty( me.dateFilterToVal ) )
						{
							dtClearedCheckDate = Ext.Date.parse( me.dateFilterToVal, "Y-m-d" );
							me.getToClearedCheckDate().setValue( dtClearedCheckDate );
						}
					}
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

				if (!Ext.isEmpty(objClearedChkPref)) {
					objPrefData = Ext.decode(objClearedChkPref);
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
							: (CLEARED_CHECK_COLUMN_MODEL || '[]');

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
				objData["filterUrl"] = 'services/userfilterslist/clearedCheckInqFltr.json';
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
			updateAdvDateFilterView : function()
			{
				var me = this;
				var dtDepositDate = null;
				if('N'==isMenuClicked)
				{
					me.advDateFilterVal = strDateFilterVal;		
					me.handleAdvFilterDateChange(strDateFilterVal);
				}				
				else if( !Ext.isEmpty( me.advDateFilterVal ) )
				{				
					me.handleAdvFilterDateChange(me.advDateFilterVal);
					if( me.advDateFilterVal === '7' )
					{
						if( !Ext.isEmpty( me.advDateFilterFromVal ) )
						{
							dtDepositDate = Ext.Date.parse( me.advDateFilterFromVal, "Y-m-d" );
							me.getAdvFromDepositDate().setValue( dtDepositDate );
						}
						if( !Ext.isEmpty( me.advDateFilterToVal ) )
						{
							dtDepositDate = Ext.Date.parse( me.advFateFilterToVal, "Y-m-d" );
							me.getAdvToDepositDate().setValue( dtDepositDate );
						}
					}
				}			
			},
			handleDateChange : function( index )
			{
				var me = this;
				var filterView = me.getClearedCheckInquiryFilterView();
				var objDateParams = me.getDateParam( index );
				var datePickerRef = $('#clearedCheckDatePickerQuickText');
				
				if (!Ext.isEmpty(me.dateFilterLabel)) {
					/*me.getDateLabel().setText(getLabel('lblCheckDate', 'Posting Date') + " ("
							+ me.dateFilterLabel + ")");*/
					me.getDateLabel().setText(getLabel('date', 'Posting Date'));
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
					if (index === '1' || index === '2' || index === '12') {
						if (index === '12') {
							datePickerRef.val(vFromDate);
						} else {
							datePickerRef.setDateRangeMode('single');
							datePickerRef.setDateRangePickerValue(vFromDate);
						}
					} else {
						datePickerRef.setDateRangePickerValue([vFromDate, vToDate]);
					}
				}
				me.handleEntryDateSync('Q', me.getDateLabel().text, '', datePickerRef);
			},
			handleAdvFilterDateChange : function( index )
			{
				var me = this;
				var fromDateLabel = me.getAdvFromDateLabel();
				var toDateLabel = me.getAdvToDateLabel();
				var objDateParams = me.getAdvanceFilterDateParam( index );
				if( index == '7' )
				{
					var dtEntryDate = new Date( Ext.Date.parse( dtApplicationDate,
							strExtApplicationDateFormat ));
					me.getAdvDateRangeComponent().show();
					me.getAdvFromDateLabel().hide();
					me.getAdvToDateLabel().hide();
					if('N'==isMenuClicked)
					{
						me.getAdvFromDepositDate().setValue( ticketFromDate );
						me.getAdvToDepositDate().setValue( ticketToDate );
						me.advDateFilterLabel = strDateFilterLabel;
					}
					else
					{
						me.getAdvFromDepositDate().setValue( dtEntryDate );
						me.getAdvToDepositDate().setValue( dtEntryDate );
					}
					me.getAdvFromDepositDate().setMinValue(clientFromDate);
					me.getAdvToDepositDate().setMinValue(clientFromDate);
				}
				else if( index == '12' )
				{
					me.getAdvDateRangeComponent().hide();
					me.getAdvFromDateLabel().hide();
					me.getAdvToDateLabel().hide();
				}
				else
				{
					me.getAdvDateRangeComponent().hide();
					me.getAdvFromDateLabel().show();
					me.getAdvToDateLabel().show();
					if('N'==isMenuClicked)
					{
						me.getAdvFromDepositDate().setValue( ticketFromDate );
						me.getAdvToDepositDate().setValue( ticketToDate );
						me.advDateFilterLabel = strDateFilterLabel;
					}					
				}

				if( !Ext.isEmpty( me.advDateFilterLabel ) )
				{
					me.getPostingDateLabel().setText("(" + me.advDateFilterLabel + ")" );
				}
				if( index !== '7' && index !== '12' )
				{
					var vFromDate = Ext.util.Format.date( Ext.Date.parse( objDateParams.fieldValue1, 'Y-m-d' ),
						strExtApplicationDateFormat );
					var vToDate = Ext.util.Format.date( Ext.Date.parse( objDateParams.fieldValue2, 'Y-m-d' ),
						strExtApplicationDateFormat );
					if( index === '1' || index === '2' )
					{
						fromDateLabel.setText( vFromDate );
						toDateLabel.setText( "" );
					}
					else
					{
						fromDateLabel.setText( vFromDate + " - " );
						toDateLabel.setText( vToDate );
					}
				}
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
					case '7':
						// Date Range
						var frmDate = me.getAdvFromDepositDate().getValue();
						var toDate = me.getAdvToDepositDate().getValue();
						fieldValue1 = Ext.Date.format( frmDate, strSqlDateFormat );
						fieldValue2 = Ext.Date.format( toDate, strSqlDateFormat );
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
						break;
					case '14' :
						fieldValue1 = Ext.Date.format( date, strSqlDateFormat );
						fieldValue2 = '';
						operator = '';
						$("#postingDatePicker").val(fieldValue1);
						break;
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
			getAdvanceFilterDateParam : function( index )
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
						// Date Range
						var frmDate = me.getAdvFromDepositDate().getValue();
						var toDate = me.getAdvToDepositDate().getValue();
						fieldValue1 = Ext.Date.format( frmDate, strSqlDateFormat );
						fieldValue2 = Ext.Date.format( toDate, strSqlDateFormat );
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
					case '12':
						break;
				}
				// comparing with client filter condition
				if (Ext.Date.parse(fieldValue1, strSqlDateFormat) < clientFromDate) {
					fieldValue1 = Ext.Date.format(clientFromDate, strSqlDateFormat);
				}
				retObj.fieldValue1 = fieldValue1;
				retObj.fieldValue2 = fieldValue2;
				retObj.operator = operator;
				return retObj;
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

				if( !Ext.isEmpty( objClearedChkPref ) )
				{
					var objJsonData = Ext.decode(objClearedChkPref);
					var data = objJsonData.d.preferences.groupViewFilterPref;
					
					if (!Ext.isEmpty(data)) {
						var strDtValue = data.quickFilter.postingDate;
						var strDtFrmValue = data.quickFilter.clearedCheckDateFrom;
						var strDtToValue = data.quickFilter.clearedCheckDateTo;
						var clearedCheckAccount = data.quickFilter.clearedCheckAccount;
						me.typeFilterVal = !Ext.isEmpty( clearedCheckAccount ) ? clearedCheckAccount : 'all';
						
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
									paramName : 'postingDatePicker',
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
								paramName : 'clearedCheckAccount',
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
						var me = this;
						showAdvanceFilterPopup('clearedCheckInqFilter');
						/*Setting default postingdate as Today(Application date)*/
						me.postingDateFilterVal = '1';
						me.postingDateFilterLabel =  getLabel('today', 'Today');
						me.handlePostingDateChange('1');
					//	me.assignSavedFilter();
					}
				}
			},
			setDataForFilter : function(filterData)
			{
				var me = this;
				me.advFilterData = {};
				me.filterData = {};
				me.filterData = me.getQuickFilterQueryJson();
				var objJson = (!Ext.isEmpty(filterData) ? filterData.filterBy : getClearedChkAdvancedFilterQueryJson());
				reqJson = me.findInAdvFilterData(objJson, "clearedCheckAccount");
				if (!Ext.isEmpty(reqJson)) {
					arrQuickJson = me.filterData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,
							"clearedCheckAccount");
					me.filterData = arrQuickJson;
				}
				reqJson = me.findInAdvFilterData(objJson, "postingDatePicker");
				if (!Ext.isEmpty(reqJson)) {
					arrQuickJson = me.filterData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "postingDatePicker");
					me.filterData = arrQuickJson;
				}
				me.advFilterData = objJson;
				var filterCode = $("input[type='text'][id='filterCode']").val();
				if(!Ext.isEmpty(filterCode))
					me.advFilterCodeApplied = filterCode;
			},
			getQuickFilterQueryJson : function()
			{
				var me = this;
				var typeFilterVal = me.typeFilterVal;
				var jsonArray = [];
				var index = me.dateFilterVal;
				var objDateParams = me.getDateParam(index);
				if( index != '12' )
				{
					if('N'==isMenuClicked)
					{
						jsonArray.push(
								{
									paramName : 'postingDatePicker',
									paramValue1 : ticketFromDate,
									paramValue2 : ticketToDate,
									operatorValue : ticketOperator,
									dataType : 'D',
									paramFieldLable : getLabel('postingDate', 'Posting Date')
								});					
					}
					else
					{
						jsonArray.push(
						{
							paramName : 'postingDatePicker',
							paramValue1 : objDateParams.fieldValue1,
							paramValue2 : objDateParams.fieldValue2,
							operatorValue : objDateParams.operator,
							dataType : 'D',
							paramFieldLable : getLabel('postingDate', 'Posting Date')
						} );
						ticketFromDate = objDateParams.fieldValue1;
						ticketToDate = objDateParams.fieldValue2;
						ticketOperator = objDateParams.operator;
					}
				}
				if( !Ext.isEmpty(typeFilterVal) && typeFilterVal != 'all'  && typeFilterVal != 'Select Account')
				{
					jsonArray.push(
					{
						paramName : 'clearedCheckAccount',
						paramValue1 : encodeURIComponent(typeFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S',
						displayType : 5,
                        paramFieldLable : getLabel('depositAccount', 'Deposit Account'),
                        displayValue1 : me.typeFilterDesc
				} );
				}
				if (!Ext.isEmpty(me.clientFilterVal) && me.clientFilterVal !== null && me.clientFilterVal!='all' && me.clientFilterVal!='All Companies') {
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
				//var grid = me.getClearedCheckInqGrid();
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
				//var grid = me.getClearedCheckInqGrid();
				var groupView = me.getGroupView();
				var grid = groupView.getGrid();		
				var subGroupInfo = groupView.getSubGroupInfo() || {};
				me.filterApplied = 'Q';
				// TODO : Currently both filters are in sync
				/*if( !Ext.isEmpty( grid ) && me.isGridDataLoad )
				{
					var strDataUrl = grid.store.dataUrl;
					var store = grid.store;
					var strUrl = grid.generateUrl( strDataUrl, grid.pageSize, 1, 1, store.sorters );
					strUrl = strUrl + me.getFilterUrl(subGroupInfo) + '&' + csrfTokenName + '=' + csrfTokenValue;
					me.loadGridDataNew( strUrl, me.handleAfterGridDataLoad, null , null, null,grid);
				}*/
				me.refreshData();
			},

			getFilterUrl : function(subGroupInfo)
			{
				var me = this;
				var strQuickFilterUrl = '', strActionStatusUrl = '', strAdvancedFilterUrl = '', strUrl = '', isFilterApplied = false;

				//		strActionStatusUrl = me.generateActionStatusUrl(widget);

				var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
						? subGroupInfo.groupQuery
						: '';
						
				strQuickFilterUrl = me.generateUrlWithQuickFilterParams( me );
				if( !Ext.isEmpty( strQuickFilterUrl ) )
				{
					strUrl += '&$filter=' + strQuickFilterUrl;
					isFilterApplied = true;
				}

				strAdvancedFilterUrl = me.generateUrlWithAdvancedFilterParams( me );
				if( !Ext.isEmpty( strAdvancedFilterUrl ) )
				{
					if( Ext.isEmpty( strUrl ) )
						strUrl += '&$filter=' + strAdvancedFilterUrl;
					else
						strUrl += ' and ' + strAdvancedFilterUrl;
					isFilterApplied = true;
				}
				strUrl+=me.getDefaultFilterParam();

				if (!Ext.isEmpty(strGroupQuery)) 
				{
					if (!Ext.isEmpty(strUrl))
						strUrl += ' and ' + strGroupQuery;
					else
						strUrl += '&$filter=' + strGroupQuery;
				}
				return strUrl;
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
			generateUrlWithQuickFilterParams : function( me )
			{

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
								if(filterData[ index ].paramName == "clearedCheckAccount"  && (filterData[ index ].paramValue1 == 'all' ||
										filterData[ index ].paramValue1 == 'ALL'))
								{
									strTemp = strTemp + filterData[ index ].paramName + ' '
									+ 'lk' + ' ' + '\'' 
									+ '\'';
								}
								else
								{
									strTemp = strTemp + filterData[ index ].paramName + ' '
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
							&& ( operator === 'bt' || operator === 'eq' || operator === 'lk' || operator === 'gt' || operator === 'lt' ) )
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
								}
								else
								{
									isFilterApplied = true;
									strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator
										+ ' ' + '\'' + filterData[ index ].value1 + '\'' ;
								}	
								break;	
							case 'gt':
							case 'lt':
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
				/*if( displayType && displayType === 4 && strValue && strValue.match( reg ) )
				{
					retValue = true;
				}*/
				return retValue;
			},
			orderUpDown : function( grid, rowIndex, direction )
			{
				var record = grid.getStore().getAt( rowIndex );
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
				}
				else
				{

					index++;

					if( index >= grid.getStore().getCount() )
					{
						return;
					}
				}
				var store = grid.getStore();
				store.remove( record );
				store.insert( index, record );

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
					this.advFilterData = [];
					me.filterApplied = 'A';
					//me.applyFilter();
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
					var strUrl = 'userfilters/clearedCheckInqFltr/{0}/remove.srvc?' + csrfTokenName + '='
						+ csrfTokenValue;
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
					url : 'userpreferences/clearedCheckInqList/clearedCheckInqAdvanceFilter.srvc?' + csrfTokenName + '='
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
				var strUrl = 'userfilters/clearedCheckInqFltr/{0}.srvc';
				strUrl = Ext.String.format( strUrl, filterCode );
				Ext.Ajax.request(
				{
					url : strUrl,
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
							title : getLabel( 'clearedCheckErrorPopUpTitle', 'Error' ),
							msg : getLabel( 'clearedCheckErrorPopUpMsg', 'Error while fetching data..!' ),
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
					var fieldOper = filterData.filterBy[ i ].operator;
					
					currentFilterData = filterData.filterBy[i];
					operatorValue = filterData.filterBy[i].operator;
					
						if (fieldName === 'clearedCheckAccount') {
							$("#clearedCheckAccount").val(fieldVal);						
							$("#clearedCheckAccount").multiselect("refresh");	
							$("#clearedCheckAccount").niceSelect('update');
						} else if (fieldName === 'clearedCheckAmount') {
							if (!Ext.isEmpty(operatorValue)) {
								if (!Ext.isEmpty(fieldVal)) {
									$('#clearedCheckAmountOperator').val(operatorValue);
									$('#clearedCheckAmountOperator').niceSelect('update');
									$('#clearedCheckAmount').val(fieldVal);								
								}
								if('bt'==operatorValue)
								{
									$('#clearedCheckAmountTo').show();	
									$('#clearedCheckAmount1').prop('disabled', true);
								}																
								if(!Ext.isEmpty(fieldVal2))
								{										
									$('#clearedCheckAmount1').val(fieldVal2);									
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
						}	
						if (fieldName === 'postingDatePicker') {
							me.setSavedFilterPostingDate(fieldName, currentFilterData);
						}							
					}
			
				if(!Ext.isEmpty(filterCode)){
					$('#filterCode').val(filterCode);
				}
				$("input[type='text'][id='clearedCheckAccount']").prop('disabled', true);
				$("select[id='clearedCheckAmountOperator']").prop('disabled', true);
				$("select[id='serialNmbrOperator']").prop('disabled', true);
				$("input[type='text'][id='clearedCheckAmount']").prop('disabled', true);
				$("input[type='text'][id='serialNmbr']").prop('disabled', true);
				$("input[type='text'][id='filterCode']").prop('disabled', true);
			},
			searchActionClicked : function( btn )
			{
				var me = this, objGroupView = null, savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
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
				//me.doSearchOnly();
			},
			setSavedFilterPostingDate : function(dateType, data) {
				if (!Ext.isEmpty(dateType) && !Ext.isEmpty(data)) {
					var me = this;
					var dateFilterRef = null;
					var dateOperator = data.operator;

					if (dateType === 'postingDatePicker') {
						dateFilterRef = $('#postingDatePicker');
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
					selectedPostingDateFilter = {
						operator : dateOperator,
						fromDate : formattedFromDate,
						toDate : formattedToDate
					};
					
				} else {
				}
			},			
			saveAndSearchActionClicked : function(me) {
				me.handleSaveAndSearchAction();
			},
			postDoSaveAndSearch : function()
			{
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
			doSearchOnly : function()
			{
				var me = this;
				var blnFilterSave = false;
				isValidSearch = handleFilterDataValidation(blnFilterSave,null);
				if(isValidSearch)
				{
					if (!$('#advancedFilterErrorDiv').hasClass('ui-helper-hidden'))
					{
						$('#advancedFilterErrorDiv').addClass('ui-helper-hidden');
					}
					var postingDateLableVal = $('label[for="PostingDateLabel"]').text();
					var postingDateField = $("#postingDatePicker");
					me.handleEntryDateSync('A', postingDateLableVal, null, postingDateField);
					var accountVal = $("select[id='clearedCheckAccount']").val();
					me.handleAccountsFieldSync('A', 'clearedCheckAccount',accountVal);
					me.applyAdvancedFilter();
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
				//me.applyFilter();
			},
			handleSaveAndSearchAction : function( btn )
			{
				var me = this;
				var callBack = me.postDoSaveAndSearch;
				var strFilterCodeVal=null;
				var blnFilterSave = true;
				//var FilterCode = $("input[type='text'][id='filterCode']");
				var FilterCode = $('#filterCode').val();

					hideErrorPanel("advancedFilterErrorDiv");
					me.filterCodeValue = FilterCode;
					strFilterCodeVal = me.filterCodeValue;

				me.savePrefAdvFilterCode = strFilterCodeVal;
				isValidSearch = handleFilterDataValidation(blnFilterSave,strFilterCodeVal);
				if(isValidSearch)
				{
					if (!$('#advancedFilterErrorDiv').hasClass('ui-helper-hidden'))
					{
						$('#advancedFilterErrorDiv').addClass('ui-helper-hidden');
					}
					me.postSaveFilterRequest(strFilterCodeVal, callBack);
				}
			},
			postSaveFilterRequest : function( FilterCodeVal, fncallBack )
			{
				var me = this;
				var strUrl = 'userfilters/clearedCheckInqFltr/{0}.srvc';
				strUrl = Ext.String.format( strUrl, FilterCodeVal );
				var objJson = getClearedChkAdvancedFilterValueJson(FilterCodeVal);
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
							title = getLabel( 'clearedCheckSaveFilterPopupTitle', 'Message' );
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
							$('#clearedCheckAdvancedFilterPopup').dialog('close');
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
							title : getLabel( 'clearedCheckErrorPopUpTitle', 'Error' ),
							msg : getLabel( 'clearedCheckErrorPopUpMsg', 'Error while fetching data..!' ),
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
					var fieldOper = filterData.filterBy[ i ].operator;
					
					currentFilterData = filterData.filterBy[i];
					operatorValue = filterData.filterBy[i].operator;
					
						if (fieldName === 'clearedCheckAccount') {
							$("#clearedCheckAccount").val(fieldVal);						
							$("#clearedCheckAccount").multiselect("refresh");	
							$("#clearedCheckAccount").niceSelect('update');
						}
						else if (fieldName === 'postingDatePicker') {
							$("#postingDatePicker").val(fieldVal);
						}
						else if (fieldName === 'clearedCheckAmount') {
							if (!Ext.isEmpty(operatorValue)) {
								if (!Ext.isEmpty(fieldVal)) {
									$('#clearedCheckAmountOperator').val(operatorValue);
									$('#clearedCheckAmountOperator').niceSelect('update');
									$('#clearedCheckAmount').val(fieldVal);								
								}
								if('bt'==operatorValue)
								{
									$('#clearedCheckAmountTo').show();	
									$('#clearedCheckAmount1').prop('disabled', false);
								}																
								if(!Ext.isEmpty(fieldVal2))
								{										
									$('#clearedCheckAmount1').val(fieldVal2);									
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
									$('#serialNmbr1').prop('disabled', false);
								}																
								if(!Ext.isEmpty(fieldVal2))
								{										
									$('#serialNmbr1').val(fieldVal2);									
								}								
							}
						}	
						if (fieldName === 'postingDatePicker') {
							me.setSavedFilterPostingDate(fieldName, currentFilterData);
						}							
					}
				if (!Ext.isEmpty(filterCode)) {
					$('#filterCode').val(filterCode);
					$("#msSavedFilter option[value='"+filterCode+"']").attr("selected",true);
					$("#msSavedFilter").multiselect("refresh");
					var saveFilterChkBox = $("input[type='checkbox'][id='saveFilterChkBox']");
					saveFilterChkBox.prop('checked', true);
					}
				
					if( $('#clearedCheckAmountOperator').val() != 'all' )
					{
						$('#clearedCheckAmount').removeAttr("disabled");
					}
					else
					{
						$('#clearedCheckAmount').val('');
						$('#clearedCheckAmount').attr("disabled", true);
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
					
					$("input[type='text'][id='clearedCheckAccount']").prop('disabled', false);
					$("select[id='clearedCheckAmountOperator']").prop('disabled', false);
					$("select[id='serialNmbrOperator']").prop('disabled', false);
					$("input[type='text'][id='filterCode']").prop('disabled', false);
					if( applyAdvFilter ){
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
						if(( groupInfo.groupTypeCode !== 'CLECHECK_OPT_ADVFILTER' || groupInfo.groupTypeCode == 'CLECHECK_OPT_ADVFILTER' && subGroupInfo.groupCode == 'all')) {	
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
				quickPref.accountId = me.typeFilterVal;
				quickPref.requestDate = me.dateFilterVal;
				if (me.dateFilterVal === '13') {
					if (!Ext.isEmpty(me.dateFilterFromVal)
							&& !Ext.isEmpty(me.dateFilterToVal)) {
						quickPref.clearedCheckDateFrom = me.dateFilterFromVal;
						quickPref.clearedCheckDateTo = me.dateFilterToVal;					
					} else {
						var strSqlDateFormat = 'Y-m-d';
						var frmDate = me.getFromDepositDate().getValue();
						var toDate = me.getToDepositDate().getValue();
						fieldValue1 = Ext.util.Format.date(frmDate, 'Y-m-d');
						fieldValue2 = Ext.util.Format.date(toDate, 'Y-m-d');
						quickPref.clearedCheckDateFrom = fieldValue1;
						quickPref.clearedCheckDateTo = fieldValue2;
					}
				}
				objFilterPref.advFilterCode = advFilterCode;
				objFilterPref.quickFilter = quickPref;
				
				return objFilterPref;
			},
			/*savePreferences : function()
			{
				var me = this, objPref = {}, arrCols = null, objCol = null;
				var strUrl = me.urlGridPref;
				var grid = me.getClearedCheckInqGrid();
				var arrColPref = new Array();
				var arrPref = new Array();
				if( !Ext.isEmpty( grid ) )
				{
					arrCols = grid.headerCt.getGridColumns();
					for( var j = 0 ; j < arrCols.length ; j++ )
					{
						objCol = arrCols[ j ];
						if( !Ext.isEmpty( objCol ) && !Ext.isEmpty( objCol.itemId )
							&& objCol.itemId.startsWith( 'col_' ) && !Ext.isEmpty( objCol.xtype )
							&& objCol.xtype !== 'actioncolumn' )
							arrColPref.push(
							{
								colId : objCol.dataIndex,
								colDesc : objCol.text,
								colHidden : objCol.hidden,
								colType : objCol.type
							} );

					}
					objPref.pgSize = grid.pageSize;
					objPref.gridCols = arrColPref;
					arrPref.push( objPref );
				}

				if( arrPref )
					Ext.Ajax.request(
					{
						url : strUrl + '?' + csrfTokenName + '=' + csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode( arrPref ),
						success : function( response )
						{
							var responseData = Ext.decode( response.responseText );
							var isSuccess;
							var title, strMsg, imgIcon;
							if( responseData.d.preferences && responseData.d.preferences.success )
								isSuccess = responseData.d.preferences.success;
							if( isSuccess && isSuccess === 'N' )
							{
								if( !Ext.isEmpty( me.getBtnSavePreferences() ) )
									me.getBtnSavePreferences().setDisabled( false );
								title = getLabel( 'SaveFilterPopupTitle', 'Message' );
								strMsg = responseData.d.preferences.error.errorMessage;
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
							else
								me.saveFilterPreferences();
						},
						failure : function()
						{
							var errMsg = "";
							Ext.MessageBox.show(
							{
								title : getLabel( 'clearedCheckErrorPopUpTitle', 'Error' ),
								msg : getLabel( 'clearedCheckErrorPopUpMsg', 'Error while fetching data..!' ),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							} );
						}
					} );

			},*/
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
											//me.toggleSavePrefrenceAction(true);
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
														'clearedCheckErrorPopUpTitle',
														'Error'),
												msg : getLabel(
														'clearedCheckErrorPopUpMsg',
														'Error while fetching data..!'),
												buttons : Ext.MessageBox.OK,
												icon : Ext.MessageBox.ERROR
											});
								}
							});

			},
			/*saveFilterPreferences : function()
			{
				var me = this;
				var strUrl = me.urlGridFilterPref;
				var advFilterCode = null;
				var objFilterPref = {};
				if( !Ext.isEmpty( me.savePrefAdvFilterCode ) )
				{
					advFilterCode = me.savePrefAdvFilterCode;
				}
				var objQuickFilterPref = {};
				objQuickFilterPref.clearedCheckStatus = me.typeFilterVal;
				objQuickFilterPref.requestDate = me.dateFilterVal;
				if( me.dateFilterVal === '7' )
				{

					if( !Ext.isEmpty( me.dateFilterFromVal ) && !Ext.isEmpty( me.dateFilterToVal ) )
					{

						objQuickFilterPref.clearedCheckDateFrom = me.dateFilterFromVal;
						objQuickFilterPref.clearedCheckDateTo = me.dateFilterToVal;
					}
					else
					{
						var strSqlDateFormat = 'Y-m-d';
						var frmDate = me.getFromClearedCheckDate().getValue();
						var toDate = me.getToClearedCheckDate().getValue();
						fieldValue1 = Ext.util.Format.date( frmDate, 'Y-m-d' );
						fieldValue2 = Ext.util.Format.date( toDate, 'Y-m-d' );
						objQuickFilterPref.clearedCheckDateFrom = fieldValue1;
						objQuickFilterPref.clearedCheckDateTo = fieldValue2;
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
								if( !Ext.isEmpty( me.getBtnSavePreferences() ) )
									me.toggleSavePrefrenceAction( true );
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
								title : getLabel( 'clearedCheckErrorPopUpTitle', 'Error' ),
								msg : getLabel( 'clearedCheckErrorPopUpMsg', 'Error while fetching data..!' ),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							} );
						}
					} );
			},
			clearWidgetPreferences : function() {
				var me = this, objPref = {}, arrCols = null, objCol = null,objWdgtPref = null;
				var strUrl = me.commonPrefUrl+"?$clear=true";
				var grid = me.getClearedCheckInqGrid();
				var arrColPref = new Array();
				var arrPref = new Array();
				if (!Ext.isEmpty(grid)) {
					arrCols = grid.getView().getGridColumns();
					for (var j = 0; j < arrCols.length; j++) {
						objCol = arrCols[j];
						if (!Ext.isEmpty(objCol) && !Ext.isEmpty(objCol.itemId)
								&& objCol.itemId.startsWith('col_')
								&& !Ext.isEmpty(objCol.xtype)
								&& objCol.xtype !== 'actioncolumn')
							arrColPref.push({
										colId : objCol.dataIndex,
										colDesc : objCol.text
									});

					}
					objWdgtPref = {};
					objWdgtPref.pgSize = grid.pageSize;
					objWdgtPref.gridCols = arrColPref;
					arrPref.push({
									"module" : "",
									"jsonPreferences" : objWdgtPref
								});
				}
				if (arrPref) {
					Ext.Ajax.request({
								url : strUrl,
								method : 'POST',
								//jsonData : Ext.encode(arrPref),
								success : function(response) {
									var responseData = Ext
											.decode(response.responseText);
									var isSuccess;
									var title, strMsg, imgIcon;
									if (responseData.d.preferences
											&& responseData.d.preferences.success)
									isSuccess = responseData.d.preferences.success;
									if (isSuccess && isSuccess === 'N') {
										if (!Ext.isEmpty(me.getBtnSavePreferences()))
											me.toggleSavePrefrenceAction(true);
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
														'clearedCheckErrorPopUpTitle',
														'Error'),
												msg : getLabel(
														'clearedCheckErrorPopUpMsg',
														'Error while fetching data..!'),
												buttons : Ext.MessageBox.OK,
												icon : Ext.MessageBox.ERROR
											});
								}
							});
				}
			},*/
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
														'clearedCheckErrorPopUpTitle',
														'Error'),
												msg : getLabel(
														'clearedCheckErrorPopUpMsg',
														'Error while fetching data..!'),
												buttons : Ext.MessageBox.OK,
												icon : Ext.MessageBox.ERROR
											});
								}
							});
				}
			},
			handleReportAction : function( btn, opts )
			{
				var me = this;
				me.downloadReport( btn );
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
				strUrl = 'services/getClearedCheckEnquiryList/getClearedCheckEnquiryDynamicReport.' + strExtension;
				strUrl += '?$skip=1';
				//var strQuickFilterUrl = me.generateUrlWithQuickFilterParams( this );
				//strUrl += strQuickFilterUrl;
				var strQuickFilterUrl = me.getFilterUrl(subGroupInfo);
				strUrl += strQuickFilterUrl;
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
					if( col.dataIndex && arrSortReportColumn[ col.dataIndex ] )
					{
						if( colMap[ arrSortReportColumn[ col.dataIndex ] ] )
						{
							// ; do nothing
						}
						else
						{
							colMap[ arrSortReportColumn[ col.dataIndex ] ] = 1;
							colArray.push( arrSortReportColumn[ col.dataIndex ] );

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
				var quickFilterDatePick = $('#clearedCheckDatePickerQuickText');
				me.typeFilterVal = combo.getValue();
				me.typeFilterDesc = combo.getRawValue();
				me.handleAccountsFieldSync('Q', 'clearedCheckAccount',me.typeFilterVal,me.typeFilterDesc );
				me.filterApplied = 'Q';
				me.setDataForFilter();
				me.applyQuickFilter();
				//me.refreshData();
				//me.handleAccountsFieldSync('Q', 'clearedCheckAccount',combo.getValue());
				
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
			doHandleSavedFilterItemClick : function(filterCode) {
				var me = this;
				if (!Ext.isEmpty(filterCode)) {
					me.resetAllFields();
					me.getSavedFilterData(filterCode, this.populateSavedFilter, true);
				}
				var postingDateLableVal = $('label[for="PostingDateLabel"]').text();
				var postingDateField = $("#postingDatePicker");		
				me.handleEntryDateSync('A', postingDateLableVal, null, postingDateField);
				var accountVal = $("select[id='clearedCheckAccount']").val();
				me.handleAccountsFieldSync('A', 'clearedCheckAccount',accountVal);
				me.savePrefAdvFilterCode = filterCode;
				me.showAdvFilterCode = filterCode;
			},
			handleClearSettings : function() {
				var me = this;
				var objGroupView = me.getGroupView();
				me.typeFilterVal = '';
				if(isClientUser()){
					var clientComboBox = me.getClearedCheckInquiryFilterView()
							.down('combo[itemId="clientComboItem"]');
					me.clientFilterVal = 'All Companies';
					selectedFilterClientDesc = "";
					selectedFilterClient = "";
					selectedClientDesc = "";
					clientComboBox.setValue(me.clientFilterVal);
				} else {
					var clientComboBox = me.getClearedCheckInquiryFilterView()
							.down('combo[itemId="clientAuto]');
					clientComboBox.reset();
					me.clientFilterVal = '';
					selectedFilterClientDesc = "";
					selectedFilterClient = "";
					selectedClientDesc = "";
				}	
				if(!Ext.isEmpty(me.savedFilterVal))
					me.savedFilterVal = "";
				var quickFilterAccountCombo = me.getClearedCheckInquiryFilterView()
						.down('combo[itemId="quickFilterAccountCombo"]');
				quickFilterAccountCombo.setValue(quickFilterAccountCombo.getStore().getAt(0));
				
				//me.savedFilterVal = '';
				var savedFilterComboBox = me.getClearedCheckInquiryFilterView()
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
			handleAccountsFieldSync : function(type,statusData,statusDataDesc){
				var me = this;
				if(!Ext.isEmpty(type)){
					if(type === 'Q'){
						var objStatusField = $("#clearedCheckAccount");
						var objQuickStatusField = me.getClearedCheckInquiryFilterView().down('combo[itemId="quickFilterAccountCombo"]');
						if(!Ext.isEmpty(statusData)){
							objStatusField.val(statusDataDesc);
						}
						else if(Ext.isEmpty(statusData)){
							objStatusField.val('');
						}
						objStatusField.multiselect("refresh");
						objStatusField.niceSelect('update');
						// setting Quick filter value to Adv filter Account Dropdown
						$('#clearedCheckAccount').val(statusDataDesc);
					}
					if(type === 'A'){
						var objStatusField = me.getClearedCheckInquiryFilterView().down('combo[itemId="quickFilterAccountCombo"]');
						if(!Ext.isEmpty(statusData)) {
							me.typeFilterVal = 'all';
							objStatusField.setValue(statusDataDesc);
						} else {
							objStatusField.setValue(statusDataDesc);
							me.typeFilterVal = 'Select Account';
						}
					}
				}
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

			reloadFilters: function(store){
				store.load({
							callback : function() {
								var storeGrid = filterGridStore('clearedCheckInqFilter');
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
			handleDepositAdvDateChange : function(index) {
				var me = this;
				var dateToField;
				var objDateParams = me.getDateParam(index);
				var vFromDate = Ext.util.Format.date(Ext.Date.parse(
								objDateParams.fieldValue1, 'Y-m-d'),
						strExtApplicationDateFormat);
				var vToDate = Ext.util.Format.date(Ext.Date.parse(
								objDateParams.fieldValue2, 'Y-m-d'),
						strExtApplicationDateFormat);
				var filterOperator=objDateParams.operator;
				
				if (index == '13') {
					if (filterOperator == 'eq') {
						$('#postingDatePicker').setDateRangePickerValue(vFromDate);
					} else {
						$('#postingDatePicker').setDateRangePickerValue([
								vFromDate, vToDate]);
					}
					if(filterOperator=='eq')
						dateToField="";
					else
						dateToField=vToDate;
					selectedItemDateFilter={
						operator:filterOperator,
						fromDate:vFromDate,
						toDate:dateToField
					};
				}
				else if(index == '14')
				{
				$('#postingDatePicker').val(vFromDate);
				}
				else {
					if (index === '1' || index === '2' || index === '12') {
						if (index === '12') {
							$('#postingDatePicker').val(vFromDate);
						} else {
							$('#postingDatePicker').setDateRangePickerValue(vFromDate);
						}
					} else {
						$('#postingDatePicker').setDateRangePickerValue([
								vFromDate, vToDate]);
					}
					if(filterOperator=='eq')
						dateToField="";
					else
						dateToField=vToDate;
					selectedItemDateFilter={
						operator:filterOperator,
						fromDate:vFromDate,
						toDate:dateToField
					};
				}
			},
			resetAllFields : function() {
				var me = this;
				$("input[type='text'][id='clearedCheckAmount']").val("");
				$("#clearedCheckAmountOperator").val('all');
				$("#clearedCheckAmountOperator").niceSelect('update');
				$("input[type='text'][id='serialNmbr']").val("");
				$("#serialNmbrOperator").val('all');
				//$("#postingDatePicker").val("");
				$("input[type='text'][id='clearedCheckAccount']").val("");
				$('#clearedCheckAccount').niceSelect('update');
				//selectedItemDateFilter={};
				me.dateFilterVal = '1';
				me.dateFilterLabel = getLabel('today', 'Today'),
				me.handlePostingDateChange(me.dateFilterVal);
				$("input[type='text'][id='filterCode']").val("");
				$("input[type='text'][id='filterCode']").prop('disabled', false);
				$("input[type='text'][id='clearedCheckAmount1']").val("");
				$("input[type='text'][id='serialNmbr1']").val("");
				$("#clearedCheckAmountTo").hide();
				$("#serialNmbrTo").hide();
				$("#msSavedFilter").val("");
				$("#msSavedFilter").multiselect("refresh");
				$("#clearedCheckAccount").val("");
				$("#clearedCheckAccount").niceSelect('update');
				$("#saveFilterChkBox").attr('checked', false);
				$("#msSavedFilter").multiselect("refresh");
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
			handleClientChangeFilter : function(combo) {
				var me = this;
				var clientComboToolBarRef = me.getClearedCheckInquiryFilterView()
				.down('combo[itemId="clientComboItem"]');
				var errorSpan = $('#quickFilterErrorDiv');
				var quickFilterAccountCombo = me.getClearedCheckInquiryFilterView().down('combo[itemId="quickFilterAccountCombo"]');
				var quickFilterDatePick = $('#clearedCheckDatePickerQuickText');				
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
				me.handlePostingDateChange(btn.btnValue);
			},
			handlePostingDateChange:function(index)
			{
				var me = this;
				var dateToField;
				var objDateParams = me.getDateParam(index,null);
				if (!Ext.isEmpty(me.postingDateFilterLabel)) 
				{
					$('label[for="PostingDateLabel"]').text(getLabel('postingDate',
							'Posting Date')
							/*+ " (" + me.postingDateFilterLabel + ")"*/);
				}
				var vFromDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue1, 'Y-m-d'),
						strExtApplicationDateFormat);
				var vToDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue2, 'Y-m-d'),
						strExtApplicationDateFormat);
				var filterOperator=objDateParams.operator;
				if (index == '13') 
				{
					if (filterOperator == 'eq')
					{
						$('#postingDatePicker').setDateRangePickerValue(vFromDate);
					}
					else
					{
						$('#postingDatePicker').setDateRangePickerValue([vFromDate, vToDate]);
					}
					dateToField = vToDate;
					selectedPostingDateFilter =
					{
						operator:filterOperator,
						fromDate:vFromDate,
						toDate:dateToField
					};
				}
				else
				{
					if (index === '1' || index === '2' || index === '12')
					{
						if (index === '12')
						{
							$('#postingDatePicker').val('Till' + '  ' + vFromDate);
						}
						else
						{
							$('#postingDatePicker').setDateRangePickerValue(vFromDate);
						}
					}
					else
					{
						$('#postingDatePicker').setDateRangePickerValue([vFromDate, vToDate]);
					}

					dateToField = vToDate;
					selectedPostingDateFilter =
					{
						operator:filterOperator,
						fromDate:vFromDate,
						toDate:dateToField
					};
				}
			},
			closeFilterPopup : function(btn) {
				var me = this;
				$('#clearedCheckAdvancedFilterPopup').dialog('close');
			},
			loadGridDataNew : function(strUrl, ptFunction, args, showLoadingIndicator, 
					scope, grid) 
			{
				var me = this;
				var blnLoad = true;
				if (!Ext.isEmpty(showLoadingIndicator) && showLoadingIndicator === false)
				{
					blnLoad = false;
				}
				grid.setLoading(blnLoad);		
				Ext.Ajax.request(
				{
					url : strUrl,
					method : 'POST',
					timeout: 300000,
					success : function(response)
					{
						var data = Ext.decode(response.responseText);
						// Escape Html character in Response Data (JSON)
						if (me.escapeHtml)
						{
							data = me.doEscapeHtmlJSONValues(data);
						}
						// Generate empty data based on configuration
						if (Ext.isEmpty(data))
							data = {
										d : {}
									};
						grid.store.loadRawData(data);
						if (!Ext.isEmpty(ptFunction) && typeof ptFunction == 'function')
						{
						// ptFunction(me, data, args);
							Ext.callback(ptFunction, (scope || me), [me, data, args, 'Y']);
						}
						if (blnLoad)
						grid.setLoading(false);
					},
					failure : function()
					{
						if (blnLoad)
							grid.setLoading(false);
						data = {d : {} };
						grid.store.loadRawData(data);
					}
				});
			},
			assignSavedFilter: function(){
				var me= this;
				if(me.firstTime){
					me.firstTime = false;
					
					if (objClearedChkPref) {
						var objJsonData = Ext.decode(objClearedChkPref);
						if (!Ext.isEmpty(objJsonData.d.preferences)) {
							if (!Ext
									.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
								if (!Ext
										.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
									var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
									if(advData === me.getClearedCheckInquiryFilterView().down('combo[itemId="savedFiltersCombo"]').getValue()){
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
			showDepositImageDaejaViewONE : function( imageNmbr,depositTicketNmbr,sessionId, side)
			{
				//$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
				$(document).ajaxStart($.blockUI({message: '<h2><img src="static/images/backgrounds/busy.gif" class="middleAlign"/>&nbsp;Please wait...</h2>',
					css:{ height:'32px',padding:'8px 0 0 0'}})).ajaxStop($.unblockUI);
				
				var me = this;
				var strUrl = 'clearedCheckInq/getDepositImage.srvc?$isDaejaViewer=Y&'+csrfTokenName + '=' + csrfTokenValue
							+'&identifier=' +''+'&$hostImageKey='+imageNmbr+'&$side='+side+
							'&$imgType=C'+'&$depositTicketNmbr='+depositTicketNmbr+'&$sessionId='+sessionId;
				if(document.getElementById("viewONE"))
				{
					document.getElementById("viewONE").setView(3);
					document.getElementById("viewONE").openFile(strUrl, 1);
				}
				else
				{
					addViewer('clearedCheckImageDiv', strUrl);
				}
				$( '#clearedCheckImageDiv' ).dialog(
				{
					autoOpen : false,
					height : "auto",
					modal : true,
					resizable : true,
					width : "auto",
					title : 'Image',
					position: 'center',
					buttons :
					{
						"Close" : function()
						{
							$( this ).dialog( "close" );
						}
					},
					close: function( event, ui ) {
						$.unblockUI();
					},
					open: function( event, ui ) {
						$.unblockUI();
    				}
				} );
				$( '#clearedCheckImageDiv' ).dialog( 'open' );
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
					if( $('#clearedCheckAmountOperator').val() == 'all' )
					{
						$('#clearedCheckAmount').val('');
						$('#clearedCheckAmount').attr("disabled", true);
					}				
					if( $('#serialNmbrOperator').val() == 'all' )
					{
						$('#serialNmbr').val('');
						$('#serialNmbr').attr("disabled", true);
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
			}
		});
function handleFilterDataValidation(blnFilterSave,strFilterCodeVal) 
{
	var arrError = new Array(),isValidSearch=true;
	var amountOperator = $('#clearedCheckAmountOperator').val();
	var serialNmbrOperator = $('#serialNmbrOperator').val();

	if (blnFilterSave && Ext.isEmpty(strFilterCodeVal)) {
		arrError.push({	"errorMessage" : "Please Enter Filter Name"});	
		$('#filterCode').addClass('requiredField');
	}
	if (Ext.isEmpty($('#clearedCheckAccount').val())) {
		arrError.push({	"errorMessage" : "Please select Deposit Account"});
		$('#clearedCheckAccount').addClass('requiredField');
		$('#clearedCheckAccount').niceSelect('update');
		$('#clearedCheckAccount-niceSelect').bind('blur',function(){
			markRequired(this);
		});		
		$('#clearedCheckAccount-niceSelect').bind('focus',function(){
			removeMarkRequired(this);
		});
	}
	if (Ext.isEmpty($('#postingDatePicker').val())) {
		arrError.push({	"errorMessage" : "Please select Posting Date"});
	}

    if(amountOperator == 'bt' && (Ext.isEmpty($('#clearedCheckAmount').val()) || Ext.isEmpty($('#clearedCheckAmount1').val())) )
	{
		if (Ext.isEmpty($('#clearedCheckAmount').val())) {
			arrError.push({	"errorMessage" : "Please enter valid values for From Deposit Amount"});
			$('#clearedCheckAmount').addClass('requiredField');
			$('#clearedCheckAmount').bind('blur',function(){
				markRequired(this);
			});		
			$('#clearedCheckAmount').bind('focus',function(){
				removeMarkRequired(this);
			});
		}
		if (Ext.isEmpty($('#clearedCheckAmount1').val())) {
			arrError.push({	"errorMessage" : "Please enter valid values for To Deposit Amount"});
			$('#clearedCheckAmount1').addClass('requiredField');
			$('#clearedCheckAmount1').bind('blur',function(){
				markRequired(this);
			});		
			$('#clearedCheckAmount1').bind('focus',function(){
				removeMarkRequired(this);
			});
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
	if(serialNmbrOperator == 'bt' && ( !Ext.isEmpty( $('#serialNmbr').val() ) || !Ext.isEmpty( $('#serialNmbr1').val() ) ) )
	{
		var from = parseInt( $('#serialNmbr').val(),10 );
		var to = parseInt( $('#serialNmbr1').val(),10 );
		if( to < from )
		{
			arrError.push({	"errorMessage" : "Check No. Range is invalid."});
		}
	}
	if(arrError.length>0)
		isValidSearch = false;
	paintAdvancedFilterErrors('#advancedFilterErrorDiv','#advancedFilterErrorMessage',arrError);
	return isValidSearch;
}
function getPopulateClearedCheckImage( imageNmbr, depositTicketNmbr, sessionId, side)
{
	GCP.getApplication().fireEvent( 'callPopulateClearedCheckImage', imageNmbr, depositTicketNmbr, sessionId, side);
}
function callToDepositPage( depSlipNmbr )
{
	GCP.getApplication().fireEvent( 'callDepositPage', depSlipNmbr );
}