Ext
	.define(
		'GCP.controller.LoanCenterController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'GCP.view.LoanCenterGridView', 'Ext.ux.gcp.DateHandler'
			],
			views :
			[
				'GCP.view.LoanCenterView', 'GCP.view.LoanCenterLoanRepaymentPopupView',
				'GCP.view.LoanCenterLoanDrawdownPopupView'
			],
			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[
				{
					ref : 'loanCenterViewRef',
					selector : 'loanCenterViewType'
				},
				{
					ref : 'loanCenterGridViewRef',
					selector : 'loanCenterViewType loanCenterGridViewType'
				},
				{
					ref : 'groupView',
					selector : 'loanCenterGridViewType groupView'
				},
				{
					ref : 'loanCenterFilterView',
					selector : 'loanCenterViewType loanCenterFilterViewType' 
				},			
				{
					ref : 'loanCenterDtlViewRef',
					selector : 'loanCenterViewType loanCenterGridViewType panel[itemId="loanCenterDtlViewItemId"]'
				},
				{
					ref : 'loanCenterGridRef',
					selector : 'loanCenterViewType loanCenterGridViewType grid[itemId="gridViewMstItemId"]'
				},
				{
					ref : 'matchCriteria',
					selector : 'loanCenterGridViewType radiogroup[itemId="matchCriteria"]'
				},
				{
					ref : 'searchTxnTextInput',
					selector : 'loanCenterGridViewType textfield[itemId="searchTxnTextField"]'
				},
				{
					ref : 'actionBarSummDtl',
					selector : 'loanCenterViewType loanCenterGridViewType loanCenterGroupActionBarViewType'
				},
				{
					ref : 'btnSavePreferencesRef',
					selector : 'loanCenterViewType loanCenterFilterViewType button[itemId="btnSavePreferencesItemId"]'
				},
				{
					ref : 'btnClearPreferences',
					selector : 'loanCenterViewType loanCenterFilterViewType button[itemId="btnClearPreferences"]'
				},
				{
					ref : 'requestDateRef',
					selector : 'loanCenterViewType loanCenterFilterViewType button[itemId="requestDateItemId"]'
				},
				{
					ref : 'fromDateLabelRef',
					selector : 'loanCenterViewType loanCenterFilterViewType label[itemId="dateFilterFromLabelItemId"]'
				},
				{
					ref : 'toDateLabelRef',
					selector : 'loanCenterViewType loanCenterFilterViewType label[itemId="dateFilterToLabelItemId"]'
				},
				{
					ref : 'requestDateLabelRef',
					selector : 'loanCenterViewType loanCenterFilterViewType label[itemId="requestDateLabelItemId"]'
				},
				{
					ref : 'fromDateFieldRef',
					selector : 'loanCenterViewType loanCenterFilterViewType datefield[itemId="fromDateFieldItemId"]'
				},
				{
					ref : 'toDateFieldRef',
					selector : 'loanCenterViewType loanCenterFilterViewType datefield[itemId="toDateFieldItemId"]'
				},
				{
					ref : 'dateRangeComponentRef',
					selector : 'loanCenterViewType loanCenterFilterViewType container[itemId="dateRangeComponentItemId"]'
				},
				/*
				 * { ref : 'entryDate', selector : 'loanCenterViewType
				 * loanCenterFilterViewType button[itemId="entryDate"]' },
				 */
				{
					ref : 'advFilterActionToolBarRef',
					selector : 'loanCenterViewType loanCenterFilterViewType toolbar[itemId="advFilterActionToolBarItemId"]'
				},
				{
					ref : 'loanCenterTypeToolBarRef',
					selector : 'loanCenterViewType loanCenterFilterViewType toolbar[itemId="loanCenterTypeToolBarItemId"]'
				},
				{
					ref : 'loanCenterObligationIdButtonRef',
					selector : 'loanCenterViewType loanCenterFilterViewType button[itemId="loanCenterObligationIdButtonItemId"]'
				},
				{
					ref : 'loanCenterGridInformationViewRef',
					selector : 'loanCenterGridInformationViewType'
				},
				{
					ref : 'infoSummaryLowerPanel',
					selector : 'loanCenterGridInformationViewType panel[itemId="infoSummaryLowerPanel"]'
				},
				{
					ref : 'advanceFilterPopupRef',
					selector : 'loanCenterAdvFilterPopupViewType[itemId="gridViewAdvancedFilterItemId"]'
				},
				{
					ref : 'advanceFilterTabPanelRef',
					selector : 'loanCenterAdvFilterPopupViewType[itemId="gridViewAdvancedFilterItemId"] tabpanel[itemId="advancedFilterTabItemId"] '
				},
				{
					ref : 'createNewFilterRef',
					selector : 'loanCenterAdvFilterPopupViewType[itemId="gridViewAdvancedFilterItemId"] loanCenterAdvFilterCreateViewType'
				},
				{
					ref : 'advFilterGridViewRef',
					selector : 'loanCenterAdvFilterPopupViewType[itemId="gridViewAdvancedFilterItemId"] loanCenterAdvFilterGridViewType'
				},
				{
					ref : 'saveSearchBtnRef',
					selector : 'loanCenterAdvFilterPopupViewType[itemId="gridViewAdvancedFilterItemId"] loanCenterAdvFilterCreateViewType button[itemId="saveAndSearchBtnItemId"]'
				},
				{
					ref : 'filterDetailsTabRef',
					selector : 'loanCenterAdvFilterPopupViewType[itemId="gridViewAdvancedFilterItemId"] tabpanel[itemId="advancedFilterTabItemId"] panel[itemId="filterDetailsTabItemId"]'
				},
				{
					ref : 'loanCenterLoanRepaymentPopupViewRef',
					selector : 'loanCenterLoanRepaymentPopupViewType[itemId="loanCenterLoanRepaymentCreateViewItemId"]'
				},
				{
					ref : 'loanCenterLoanDrawdownPopupViewRef',
					selector : 'loanCenterLoanDrawdownPopupViewType[itemId="loanCenterLoanDrawdownCreateViewItemId"]'
				},
				{
					ref : 'withHeaderCheckboxRef',
					selector : 'loanCenterViewType menuitem[itemId="withHeaderId"]'
				},
				{
					ref : 'loanCenterTxnTabRef',
					selector : 'loanCenterViewType loanCenterTitleViewType button[itemId="loanCenterTxnTabItemId"]'
				},
				{
					ref : 'loanCenterSiTabRef',
					selector : 'loanCenterViewType loanCenterTitleViewType button[itemId="loanCenterSiTabItemId"]'
				}
			],
			config :
			{
				isEditMode : true,
				savePrefAdvFilterCode : null,
				reportOrderURL : null,				
				filterCodeValue : null,
				objCreateNewRepaymentPopup : null,
				objCreateNewDrawdownPopup : null,
				objAdvFilterPopup : null,
				advFilterCodeApplied : null,
				selectedLoanCenter : 'alert',
				filterData : [],
				copyByClicked : '',
				activeFilter : null,
				advFilterData : [],
				filterApplied : 'ALL',
				strGetModulePrefUrl : isSiTabSelected == 'Y' ? 'services/userpreferences/loanCenterSiSummary/{0}.json'
					: 'services/userpreferences/loanCenterTxnSummary/{0}.json',
				urlGridPref : isSiTabSelected == 'Y' ? 'userpreferences/loanCenterSiGridFilter/gridView.srvc?'
					: 'userpreferences/loanCenterTxnGridFilter/gridView.srvc?',
				urlGridFilterPref : isSiTabSelected == 'Y' ? 'userpreferences/loanCenterSiGridFilter/gridViewFilter.srvc?'
					: 'userpreferences/loanCenterTxnGridFilter/gridViewFilter.srvc?',
				commonPrefUrl : isSiTabSelected == 'Y' ? 'services/userpreferences/loanCenterSiGridFilter.json'
					: 'services/userpreferences/loanCenterTxnGridFilter.json',
				showAdvFilterCode : null,
				loanCenterTypeFilterVal : 'all',
				loanCenterTypeFilterDesc : 'all',
				dateFilterVal : '12',
				dateFilterFromVal : '',
				dateFilterToVal : '',
				dateFilterLabel : getLabel( 'latest', 'Latest' ),
				gridInfoDateFilterLabel : getLabel( 'latest', 'Latest' ),
				dateHandler : null,
				clientCode : null,
				clientDesc : '',
				arrSorter:[]
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
				me.updateFilterConfig();
				var btnClearPref = me.getBtnClearPreferences();
				if(btnClearPref)
				{
					btnClearPref.setEnabled(false);
				}
				me.objCreateNewRepaymentPopup = Ext.create( 'GCP.view.LoanCenterLoanRepaymentPopupView',
				{
					parent : 'loanCenterViewType',
					itemId : 'loanCenterLoanRepaymentCreateViewItemId',
					filterPanel :
					{
						xtype : 'loanCenterLoanRepaymentCreateViewType',
						margin : '4 0 0 0',
						callerParent : 'loanCenterViewType'
				}
				});

				me.objCreateNewDrawdownPopup = Ext.create( 'GCP.view.LoanCenterLoanDrawdownPopupView',
				{
					parent : 'loanCenterViewType',
					itemId : 'loanCenterLoanDrawdownCreateViewItemId',
					filterPanel :
					{
						xtype : 'loanCenterLoanDrawdownCreateViewType',
						margin : '4 0 0 0',
						callerParent : 'loanCenterViewType'
					}
				} );

				me.objAdvFilterPopup = Ext.create( 'GCP.view.LoanCenterAdvFilterPopupView',
				{
					parent : 'loanCenterViewType',
					itemId : 'gridViewAdvancedFilterItemId',
					filterPanel :
					{
						xtype : 'loanCenterAdvFilterCreateViewType',
						margin : '4 0 0 0',
						callerParent : 'loanCenterViewType'
					}
				} );

				me
					.control(
					{
						'loanCenterViewType' :
						{
							beforerender : function( panel, opts )
							{
								// me.loadDetailCount();
							},
							addAlertEvent : function( btn )
							{
								me.handleAddNewProfileMaster( btn );
							}
						},
						
						'loanCenterGridViewType groupView' : {
							/**
							 * This is to be handled if grid model changes as per group by
							 * category. Otherewise no need to catch this event. If captured
							 * then GroupView.reconfigureGrid(gridModel) should be called
							 * with gridModel as a parameter
							 */
							'groupByChange' : function(menu, groupInfo) {
								me.doHandleGroupByChange(menu, groupInfo);
							},
							'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
									newCard, oldCard) {
								me.doHandleGroupTabChange(groupInfo, subGroupInfo,
										tabPanel, newCard, oldCard);
							},
							'gridRender' : me.handleLoadGridData,
							'gridPageChange' : me.handleLoadGridData,
							'gridSortChange' : me.handleLoadGridData,
							'gridPageSizeChange' : me.handleLoadGridData,
							'gridColumnFilterChange' : me.handleLoadGridData,
						//	'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
							'gridStateChange' : function(grid) {
								me.toggleSavePrefrenceAction(true);
							},
							'gridRowActionClick' : function(grid, rowIndex, columnIndex,
									actionName, record) {
								me.doHandleRowActions(actionName, grid, record,rowIndex);
							},
							'groupActionClick' : function(actionName, isGroupAction,
									maskPosition, grid, arrSelectedRecords) {
								if (isGroupAction === true)
									me.handleGroupActions(actionName, grid,
											arrSelectedRecords, 'groupAction');
							},
							'gridRowSelectionChange' : me.enableValidActionsForGrid
						},
						
						
						/*'loanCenterGridViewType' :
						{
							render : function( panel )
							{
								//me.handleSmartGridConfig();
								//me.handleTabAction();
								//me.setGridInfoSummary();
							}
						},*/
						'loanCenterLoanRepaymentPopupViewType[itemId="loanCenterLoanRepaymentCreateViewItemId"] loanCenterLoanRepaymentCreateViewType' :
						{
							/*
							 * handleSaveRepaymentAction : function( btn ) {
							 * me.handleSaveRepaymentAction( btn ); },
							 */
							closeLoanRepaymentViewPopup : function( btn )
							{
								me.closeLoanRepaymentViewPopup( btn );
							}
						},
						'loanCenterLoanRepaymentPopupViewType[itemId="loanCenterLoanRepaymentCreateViewItemId"] AutoCompleter[itemId="loanAccNmbrFieldItemId"]' :
						{
							select : function( combo, record, index )
							{
								var objCreateNewRepaymentPanel = me.getLoanCenterLoanRepaymentPopupViewRef();
								objCreateNewRepaymentPanel.down( 'hidden[itemId="paymentCcyFieldItemId"]' ).setValue(
									record[ 0 ].data.CURRENCY );
								me.populateLoanRepaymentAmount( record[ 0 ].data.CODE );
							}
						},
						'loanCenterLoanRepaymentPopupViewType[itemId="loanCenterLoanRepaymentCreateViewItemId"] AutoCompleter[itemId="debitAccNmbrFieldItemId"]' :
						{
							select : function( combo, record, index )
							{
								var objCreateNewRepaymentPanel = me.getLoanCenterLoanRepaymentPopupViewRef();
								objCreateNewRepaymentPanel.down( 'hidden[itemId="debitCcyFieldItemId"]' ).setValue(
									record[ 0 ].data.CURRENCY );
							}
						},

						'loanCenterLoanRepaymentPopupViewType[itemId="loanCenterLoanRepaymentCreateViewItemId"] radiogroup[itemId="amountRadioItemId"]' :
						{
							change : function( btn, opts )
							{
								if( me.isEditMode )
								{
									var objCreateNewRepaymentPanel = me.getLoanCenterLoanRepaymentPopupViewRef();
									me.setLoanRepaymentAmountField( objCreateNewRepaymentPanel );
								}
							}
						},

						'loanCenterLoanDrawdownPopupViewType[itemId="loanCenterLoanDrawdownCreateViewItemId"] radiogroup[itemId="productTypeRadioItemId"]' :
						{
							change : function( btn, opts )
							{
								if( me.isEditMode )
								{
									var objCreateNewDrawdownPanel = me.getLoanCenterLoanDrawdownPopupViewRef();
									var objAutocompleter = objCreateNewDrawdownPanel
										.down( 'AutoCompleter[itemId="productCodeFieldItemId"]' );
									objAutocompleter.setValue( '' );
									objAutocompleter.cfgExtraParams =
									[
										{
											key : '$filtercode1',
											value : opts.productType
										}
									];
								}
							}
						},
						'loanCenterLoanDrawdownPopupViewType[itemId="loanCenterLoanDrawdownCreateViewItemId"] loanCenterLoanDrawdownCreateViewType' :
						{
							/*
							 * handleSaveDrawdownAction : function( btn ) {
							 * me.handleSaveDrawdownAction( btn ); },
							 */
							closeLoanDrawdownViewPopup : function( btn )
							{
								me.closeLoanDrawdownViewPopup( btn );
							}
						},
						'loanCenterLoanDrawdownPopupViewType[itemId="loanCenterLoanDrawdownCreateViewItemId"] AutoCompleter[itemId="loanAccNmbrFieldItemId"]' :
						{
							select : function( combo, record, index )
							{
								var objCreateNewDrawdownPanel = me.getLoanCenterLoanDrawdownPopupViewRef();
								objCreateNewDrawdownPanel.down( 'hidden[itemId="paymentCcyFieldItemId"]' ).setValue(
									record[ 0 ].data.CURRENCY );
							}
						},
						'loanCenterLoanDrawdownPopupViewType[itemId="loanCenterLoanDrawdownCreateViewItemId"] AutoCompleter[itemId="debitAccNmbrFieldItemId"]' :
						{
							select : function( combo, record, index )
							{
								var objCreateNewDrawdownPanel = me.getLoanCenterLoanDrawdownPopupViewRef();
								objCreateNewDrawdownPanel.down( 'hidden[itemId="debitCcyFieldItemId"]' ).setValue(
									record[ 0 ].data.CURRENCY );
							}
						},

						'loanCenterViewType loanCenterFilterViewType button[itemId="newFilterItemId"]' :
						{
							click : function( btn, opts )
							{
								me.advanceFilterPopUp( btn );
							}
						},
						'loanCenterAdvFilterPopupViewType[itemId="gridViewAdvancedFilterItemId"] loanCenterAdvFilterCreateViewType' :
						{
							handleSearchActionGridView : function( btn )
							{
								me.handleSearchActionGridView( btn );
							},
							handleSaveAndSearchGridAction : function( btn )
							{
								me.handleSaveAndSearchGridAction( btn );
							},
							closeGridViewAdvFilterPopup : function( btn )
							{
								me.closeGridViewAdvFilterPopup( btn );
							}
						},
						'loanCenterViewType loanCenterFilterViewType toolbar[itemId="advFilterActionToolBarItemId"]' :
						{
							handleSavedFilterItemClick : me.handleFilterItemClick
						},
						'loanCenterAdvFilterPopupViewType[itemId="gridViewAdvancedFilterItemId"] loanCenterAdvFilterGridViewType' :
						{
							orderUpGridEvent : me.orderUpDown,
							deleteGridFilterEvent : me.deleteFilterSet,
							viewGridFilterEvent : me.viewFilterData,
							editGridFilterEvent : me.editFilterData
						},
						
						'loanCenterViewType loanCenterFilterViewType' :
						{
							render : function( panel, opts )
							{
								me.setInfoTooltip();
								// me.handleProductTypeLoading(panel);
								me.getAllSavedAdvFilterCode( panel );
							},
							filterType : function( btn, opts )
							{
								me.toggleSavePrefrenceAction( true );
								me.toggleClearPrefrenceAction(true);
							},
							dateChange : function( btn, opts )
							{
								me.dateFilterVal = btn.btnValue;
								me.dateFilterLabel = btn.text;
								me.handleDateChange( btn.btnValue );
								if( btn.btnValue !== '7' )
								{
									me.setDataForFilter();
									me.applyQuickFilter();
									me.toggleSavePrefrenceAction( true );
									me.toggleClearPrefrenceAction(true);
									// me.handleProductTypeLoading();
								}

							},
							handleClientChange : function(clientCode, clientDesc){
									me.clientCode = clientCode;
									me.clientDesc = clientDesc;
									me.setDataForFilter();
									me.applyQuickFilter();
									me.toggleSavePrefrenceAction( true );
									me.toggleClearPrefrenceAction(true);
							},
							afterrender : function( panel, opts )
							{
								if(me.filterCodeValue != null) { 	
									me.handleFilterItemClick( me.filterCodeValue, null );
									panel.highlightSavedFilter(me.filterCodeValue);
								}
							}
						},
						'loanCenterViewType loanCenterFilterViewType toolbar[itemId="dateToolBarItemId"]' :
						{
							afterrender : function( tbar, opts )
							{
								me.updateDateFilterView();
							}
						},
						'loanCenterViewType loanCenterFilterViewType button[itemId="goBtnItemId"]' :
						{
							click : function( btn, opts )
							{
								var frmDate = me.getFromDateFieldRef().getValue();
								var toDate = me.getToDateFieldRef().getValue();

								if( !Ext.isEmpty( frmDate ) && !Ext.isEmpty( toDate ) )
								{
									var dtParams = me.getDateParam( '7' );
									me.dateFilterFromVal = dtParams.fieldValue1;
									me.dateFilterToVal = dtParams.fieldValue2;
									me.setDataForFilter();
									me.applyQuickFilter();
									me.toggleSavePrefrenceAction( true );
									me.toggleClearPrefrenceAction(true);
									// me.handleProductTypeLoading();
								}
							}
						},
						'loanCenterViewType loanCenterFilterViewType button[itemId="btnSavePreferencesItemId"]' :
						{
							click : function( btn, opts )
							{
								me.toggleSavePrefrenceAction( false );
								me.handleSavePreferences();
								me.toggleClearPrefrenceAction(true);
							}
						},
						'loanCenterViewType loanCenterFilterViewType button[itemId="btnClearPreferences"]' :
						{
							click : function( btn, opts )
							{
								me.toggleSavePrefrenceAction( false );
								me.handleClearPreferences();
								me.toggleClearPrefrenceAction(false);
							}
						},
						'loanCenterGridInformationViewType panel[itemId="loanCenterSummInfoHeaderBarGridViewItemId"] container[itemId="summInfoShowHideGridView"]' :
						{
							click : function( image )
							{
								var objAccSummInfoBar = me.getInfoSummaryLowerPanel();
								if( image.hasCls( "icon_collapse_summ" ) )
								{
									image.removeCls( "icon_collapse_summ" );
									image.addCls( "icon_expand_summ" );
									objAccSummInfoBar.hide();
								//	 objAccSummInfoRefStdFil.hide();
								}
								else
								{
									image.removeCls( "icon_expand_summ" );
									image.addCls( "icon_collapse_summ" );
									objAccSummInfoBar.show();
								//	objAccSummInfoRefStdFil.show();
								}
							}
						},
						'loanCenterGridInformationViewType' :
						{
							render : this.onLoanCenterInformationViewRender
						},
						'loanCenterViewType button[itemId="loanRepaymentRequestItemId"]' :
						{
							click : function( btn, opts )
							{
								me.isEditMode = true;
								//checkCutOffTime("LNPAYDOWN,", "", "", "", "N");
								me.showLoanCenterLoanRepaymentPopupView( btn );
							}
						},
						'loanCenterViewType button[itemId="loanDrawdownRequestItemId"]' :
						{
							click : function( btn, opts )
							{
								me.isEditMode = true;
								//checkCutOffTime("LNADVANCE,", "", "", "", "N");
								me.showLoanCenterLoanDrawdownPopupView( btn );
							}
						},
						'loanCenterViewType' :
						{
							performReportAction : function( btn, opts )
							{
								me.handleReportAction( btn, opts );
							}
						}

					} );
					
					GCP.getApplication().on(
					{
					showLoanCenterLoanRepaymentPopupView : function( yes )
					{
						me.showLoanCenterLoanRepaymentPopupView( yes );
					},
					showLoanCenterLoanDrawdownPopupView : function( yes )
					{
						me.showLoanCenterLoanDrawdownPopupView( yes );
					},
					showInvoiceCenterPopupView : function( url, record, remark )
					{
						//me.showInvoiceCenterPopupView( url, record, remark );
					}
					});
					
					$(document).on('showInvoiceCenterPopupView',function(event, url, record, remark) {
						me.showInvoiceCenterPopupView(url, record, remark)
					});
			},

			/*
			 * handleSaveRepaymentAction : function( btn ) { var me = this;
			 * 
			 * var form, inputField; form = document.createElement( 'FORM' );
			 * form.name = 'frmMain'; form.id = 'frmMain'; form.method = 'POST';
			 * form.appendChild( me.createFormField( 'INPUT', 'HIDDEN',
			 * csrfTokenName, tokenValue ) ); //form.appendChild(
			 * me.createFormField( 'INPUT', 'HIDDEN', 'viewState', parentkey ) );
			 * //form.action = me.actionUrl; form.action =
			 * 'newLoanRepaymentRequest.form'; document.body.appendChild( form );
			 * form.submit(); //parent.close();
			 * me.getLoanCenterLoanRepaymentPopupViewRef().close(); },
			 */

			handleTabAction : function()
			{
				var me = this;
				var btn;
				if( isSiTabSelected == 'Y' )
				{
					btn = me.getLoanCenterSiTabRef();
				}
				else
				{
					btn = me.getLoanCenterTxnTabRef();
				}
				//btn.addCls( 'xn-custom-heighlight button_underline' );
			},
			
			doHandleGroupByChange : function(menu, groupInfo) {
				var me = this;
				if (me.previouGrouByCode === 'ADVFILTER') {
					me.savePrefAdvFilterCode = null;
					me.showAdvFilterCode = null;
					me.filterApplied = 'ALL';
				}
				if (groupInfo && groupInfo.groupTypeCode === 'ADVFILTER') {
					me.previouGrouByCode = groupInfo.groupTypeCode;
				} else
					me.previouGrouByCode = null;
			},
			
			doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) { 	
				var me = this;
				var objGroupView = me.getGroupView();
				var strModule = '', strUrl = null, args = null, strFilterCode = null;
				groupInfo = groupInfo || {};
				subGroupInfo = subGroupInfo || {};
				if (groupInfo) {
					if (groupInfo.groupTypeCode === 'ADVFILTER') {
						strFilterCode = subGroupInfo.groupCode;
						if (strFilterCode !== 'all') {
							if (!Ext.isEmpty(strFilterCode)) {
								me.savedFilterVal = strFilterCode;
								me.showAdvFilterCode = strFilterCode;
								me.doHandleSavedFilterItemClick(strFilterCode);
							}
						} else {
							me.savedFilterVal = null;
							me.showAdvFilterCode = null;
							me.filterApplied = 'ALL';
							var gridModel = {
								showCheckBoxColumn : true
							};
							objGroupView.reconfigureGrid(gridModel);
						}

					} else {
						args = {
							scope : me
						};
						strModule = (subGroupInfo.groupCode === 'all') ? (groupInfo.groupTypeCode + subGroupInfo.groupCode) : subGroupInfo.groupCode;
						strUrl = Ext.String.format(me.strGetModulePrefUrl, strModule);
						me.getSavedPreferences(strUrl,
								 me.postHandleDoHandleGroupTabChange, args);
					}
				}
			},
			doHandleSavedFilterItemClick : function(filterCode) {
				var me = this;
				if (!Ext.isEmpty(filterCode)) {
					me.getSavedFilterData(filterCode, this.populateSavedFilter, true);
				}
				me.showAdvFilterCode = filterCode;
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
				var objSummaryView = me.getLoanCenterGridViewRef(), arrSortState = new Array(), objPref = null, gridModel = null, intPgSize = null, showPager = true;
				var colModel = null, arrCols = null;

				if (objGridViewPref ) {
					data = Ext.decode( objGridViewPref );
					objPref = data[ 0 ];
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
							showCheckBoxColumn : true,
							storeModel : {
								sortState : arrSortState
							}
						};
					}
				} else {
					gridModel = {
						showCheckBoxColumn : true
					};
				}
				
				objGroupView.reconfigureGrid(gridModel);
		},
	
			
			handleReportAction : function( btn, opts )
			{
				var me = this;
				me.downloadReport( btn.itemId );
			},
			downloadReport : function( actionName )
			{
				var me = this;
				var withHeaderFlag = me.getWithHeaderCheckboxRef().checked;
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

				strExtension = arrExtension[ actionName ];
				strUrl = 'services/getLoanCenterList/getDynamicReport.' + strExtension;
				strUrl += '?$skip=1';
				var strQuickFilterUrl = me.getFilterUrl();
				strUrl += strQuickFilterUrl;
				var strOrderBy = me.reportOrderURL;
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
				var objGroupView = me.getGroupView();
				var grid = objGroupView.getGrid();
				viscols = grid.getAllVisibleColumns();
				for( var j = 0 ; j < viscols.length ; j++ )
				{
					col = viscols[ j ];
					if( col.dataIndex && arrSortColumn[ col.dataIndex ] )
					{
						if( colMap[ arrSortColumn[ col.dataIndex ] ] )
						{
							// ; do nothing
						}
						else
						{
							colMap[ arrSortColumn[ col.dataIndex ] ] = 1;
							colArray.push( arrSortColumn[ col.dataIndex ] );

						}
					}

				}
				if( colMap != null )
				{

					visColsStr = visColsStr + colArray.toString();
					strSelect = '&$select=[' + colArray.toString() + ']';
				}
				strUrl = strUrl + "&" + "$isSiTabSelected" + "=" + isSiTabSelected;	
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
			populateLoanRepaymentAmount : function( loanAccNmbr )
			{
				var me = this;
				var strUrl = 'getLoanCenterLoanAccAmount.srvc?$loanAccNmbr=' + loanAccNmbr + '&' + csrfTokenName + '='
					+ csrfTokenValue;
				Ext.Ajax.request(
				{
					url : strUrl,
					method : 'POST',
					success : function( response )
					{
						var responseData = Ext.decode( response.responseText );
						// fnCallback.call( me, filterCode, responseData,
						// applyAdvFilter );
						me.setLoanRepaymentAmountValue( responseData );

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

			setLoanRepaymentAmountValue : function( loanAmnt )
			{
				var me = this;
				var objCreateNewRepaymentPanel = me.getLoanCenterLoanRepaymentPopupViewRef();
				objCreateNewRepaymentPanel.down( 'hidden[itemId="loanAmntFieldItemId"]' ).setValue( loanAmnt );
				me.setLoanRepaymentAmountField( objCreateNewRepaymentPanel );
			},

			setLoanRepaymentAmountField : function( objCreateNewRepaymentPanel )
			{
				var amountPaymentType = objCreateNewRepaymentPanel.down( 'radiogroup[itemId="amountRadioItemId"]' )
					.getValue();
				if( 'F' === amountPaymentType.paymentType )
				{
					objCreateNewRepaymentPanel.down( 'textfield[itemId="requestedAmntFieldItemId"]' )
						.setReadOnly( true );
				}
				else
				{
					objCreateNewRepaymentPanel.down( 'textfield[itemId="requestedAmntFieldItemId"]' ).setReadOnly(
						false );
				}
				objCreateNewRepaymentPanel.down( 'textfield[itemId="requestedAmntFieldItemId"]' ).setValue(
					objCreateNewRepaymentPanel.down( 'hidden[itemId="loanAmntFieldItemId"]' ).getValue() );
			},

			closeLoanRepaymentViewPopup : function( btn )
			{
				var me = this;
				me.getLoanCenterLoanRepaymentPopupViewRef().close();
			},

			closeLoanDrawdownViewPopup : function( btn )
			{
				var me = this;
				me.getLoanCenterLoanDrawdownPopupViewRef().close();
			},

			handleSaveAndSearchGridAction : function( btn )
			{
				var me = this;
				var objCreateNewFilterPanel = me.getCreateNewFilterRef();
				if( me.filterCodeValue === null )
				{
					var filterCode = objCreateNewFilterPanel.down( 'textfield[itemId="filterCodeFilterItemId"]' );
					var filterCodeVal = filterCode.getValue();
				}
				else
				{
					var filterCodeVal = me.filterCodeValue;
				}

				var callBack = this.postDoSaveAndSearch;
				if( Ext.isEmpty( filterCodeVal ) )
				{
					var errorlabel = objCreateNewFilterPanel.down( 'label[itemId="errorLabelItemId"]' );
					errorlabel.setText( getLabel( 'filternameMsg', 'Please Enter Filter Name' ) );
					errorlabel.show();
				}
				else
				{
					me.postSaveFilterRequest( filterCodeVal, callBack );
				}
			},
			closeGridViewAdvFilterPopup : function( btn )
			{
				var me = this;
				me.getAdvanceFilterPopupRef().close();
			},
			postSaveFilterRequest : function( filterCodeVal, fncallBack )
			{
				var me = this;
				var strUrl = isSiTabSelected == 'Y' ? 'userfilters/loanCenterSiAdvFltr/{0}.srvc'
					: 'userfilters/loanCenterTxnAdvFltr/{0}.srvc';
				strUrl = Ext.String.format( strUrl, filterCodeVal );
				var objJson;
				var objOfCreateNewFilter = me.getCreateNewFilterRef();
				objJson = objOfCreateNewFilter.getAdvancedFilterValueJson( filterCodeVal, objOfCreateNewFilter );
				Ext.Ajax.request(
				{
					url : strUrl + "?" + csrfTokenName + "=" + csrfTokenValue,
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
						if( filterCodeVal && isSuccess && isSuccess === 'Y' )
						{
							fncallBack.call( me );
							me.reloadGridRawData();
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
			postDoSaveAndSearch : function()
			{
				var me = this;
				me.doAdvSearchOnly();
			},
			handleSearchActionGridView : function( btn )
			{
				var me = this;
				me.doAdvSearchOnly();
			},
			doAdvSearchOnly : function()
			{
				var me = this;
				me.filterApplied = 'A';
				me.setDataForFilter();
				me.applyAdvancedFilter();
			},
			applyAdvancedFilter : function()
			{
				var me = this;
				//refresh();
				me.refreshData();
				/*var grid = me.getLoanCenterGridRef();
				// TODO : Currently both filters are in sync
				if( !Ext.isEmpty( grid ) )
				{
					var strDataUrl = grid.store.dataUrl;
					var store = grid.store;
					var strUrl = grid.generateUrl( strDataUrl, grid.pageSize, 1, 1, store.sorters );
					strUrl = strUrl + me.getFilterUrl() + "&" + "$isSiTabSelected" + "=" + isSiTabSelected + "&"
						+ csrfTokenName + "=" + csrfTokenValue;
					me.getLoanCenterGridRef().setLoading( true );
					grid.loadGridData( strUrl, me.handleAfterGridDataLoad, null );
				}*/
				me.getAllSavedAdvTooBarCode();
				me.closeGridViewAdvFilterPopup();
			},
			handleAfterGridDataLoad : function( grid, jsonData )
			{
				var me = grid.ownerCt;
				me.setLoading( false );
			},
			showLoanCenterLoanRepaymentPopupView : function( btn )
			{
				goToPage( 'addPayDown.srvc', 'frmMain', 'P', 'Y', btn );
			},

			showLoanCenterLoanDrawdownPopupView : function( btn )
			{
				goToPage( 'addAdvance.srvc', 'frmMain', 'D', 'Y', btn );
				// showAdvancePopup();
			},

			/*
			 * setDataForFilter : function() { var me = this; var jsonArray =
			 * []; var index = me.dateFilterVal; var loanCenterTypeFilterVal =
			 * me.loanCenterTypeFilterVal; var loanCenterObligationIdFilterVal =
			 * me.loanCenterObligationIdFilterVal; var objDateParams =
			 * me.getDateParam( index ); jsonArray.push( { paramName :
			 * me.getRequestDateRef().filterParamName, paramValue1 :
			 * objDateParams.fieldValue1, paramValue2 :
			 * objDateParams.fieldValue2, operatorValue :
			 * objDateParams.operator, dataType : 'D' } ); if(
			 * loanCenterTypeFilterVal != null && loanCenterTypeFilterVal !=
			 * 'all' ) { jsonArray.push( { paramName :
			 * me.getLoanCenterTypeToolBarRef().filterParamName, paramValue1 :
			 * me.loanCenterTypeFilterVal, operatorValue : 'eq', dataType : 'S' } ); }
			 * me.filterData = jsonArray; },
			 */

			setDataForFilter : function()
			{
				var me = this;
				//me.getSearchTxnTextInput().setValue( '' );
				if( this.filterApplied === 'Q' || this.filterApplied === 'ALL' )
				{
					this.filterData = this.getQuickFilterQueryJson();
				}
				else if( this.filterApplied === 'A' )
				{
					var objOfCreateNewFilter = this.getCreateNewFilterRef();
					var objJson = objOfCreateNewFilter.getAdvancedFilterQueryJson( objOfCreateNewFilter );
					if(me.clientCode != null && !Ext.isEmpty(me.clientCode) && me.clientCode != 'all' && 'undefined' != me.clientCode)
					objJson.push(
					{
						paramName : 'clientCode',
						paramValue1 : me.clientCode,
						operatorValue : 'eq',
						dataType : 'S'
					} );
					this.advFilterData = objJson;
					// this.filterData = objJson;
					var filterCode = objOfCreateNewFilter.down( 'textfield[itemId="filterCodeFilterItemId"]' )
						.getValue();
					this.advFilterCodeApplied = filterCode;
				}
			},
			
			getQuickFilterQueryJson : function()
			{
				var me = this;
				var jsonArray = [];
				var index = me.dateFilterVal;
				var loanCenterTypeFilterVal = me.loanCenterTypeFilterVal;
				var objDateParams = me.getDateParam( index );

				if( index != '12' )
				{
					jsonArray.push(
					{
						paramName : isSiTabSelected == 'Y' ? 'effectiveDate' : 'requestDate',
						paramValue1 : objDateParams.fieldValue1,
						paramValue2 : objDateParams.fieldValue2,
						operatorValue : objDateParams.operator,
						dataType : 'D'
					} );
				}

				if( loanCenterTypeFilterVal != null && loanCenterTypeFilterVal != 'all' )
				{
					jsonArray.push(
					{
						paramName : 'paymentType',
						paramValue1 : me.loanCenterTypeFilterVal,
						operatorValue : 'in',
						dataType : 'A'
					} );
				}

				if( isSiTabSelected == 'Y' )
				{
					jsonArray.push(
					{
						paramName : 'siEnabled',
						paramValue1 : 'Y',
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				else
				{
					jsonArray.push(
					{
						paramName : 'txnType',
						paramValue1 : 1,
						operatorValue : 'ne',
						dataType : 'S'
					} );
				}
				
				if(me.clientCode != null && !Ext.isEmpty(me.clientCode) && me.clientCode != 'all' && 'undefined' != me.clientCode)
				jsonArray.push(
					{
						paramName : 'clientCode',
						paramValue1 : me.clientCode,
						operatorValue : 'eq',
						dataType : 'S'
					} );

				// me.filterData = jsonArray;
				return jsonArray;
			},
			applyQuickFilter : function() {
				var me = this;
				var objGroupView = me.getGroupView();
				var groupInfo = objGroupView.getGroupInfo();
				me.filterApplied = 'Q';
				if (groupInfo && groupInfo.groupTypeCode === 'ADVFILTER') {
					objGroupView.setActiveTab('all');
				} else
					me.refreshData();
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
			doHandleRowActions : function (actionName, grid, record,rowIndex)
			{
				var me = this;
				if( actionName === 'accept' || actionName === 'reject' || actionName === 'discard'
					|| actionName === 'enable' || actionName === 'disable' )
				{
					me.handleGroupActions(actionName, grid, [record], 'rowAction');
				}
				else if( actionName === 'btnHistory' )
				{
					var recHistory = record.get( 'history' );
					if( !Ext.isEmpty( recHistory ) && !Ext.isEmpty( recHistory.__deferred.uri ) )
					{
						me.showHistory( record.get( 'history' ).__deferred.uri, record.get( 'identifier' ) );
					}
				}
				else if( actionName === 'btnView' )
				{
					var me = this;
					me.submitForm( 'viewLoanCenterRecord.srvc', record, rowIndex );
				}
				else if( actionName === 'btnEdit' )
				{
					var me = this;
					me.submitForm( 'editLoanCenterRecord.srvc', record, rowIndex );
				}
				else if( actionName === 'btnClone' )
				{
					var me = this;
					me.submitForm( 'cloneLoanPayment.srvc', record, rowIndex );
				}				
			},
			populateDataInViewPopup : function( record, strPaymentType )
			{
				var me = this;
				if( strPaymentType == 'D' )
				{
					var objCreateNewDrawdownPanel = me.getLoanCenterLoanDrawdownPopupViewRef();

					objCreateNewDrawdownPanel.down( 'AutoCompleter[itemId="loanAccNmbrFieldItemId"]' ).setValue(
						record.get( 'loanAccNmbr' ) );
					objCreateNewDrawdownPanel.down( 'AutoCompleter[itemId="beneCodeFilterItemId"]' ).setValue(
						record.get( 'beneCode' ) );
					objCreateNewDrawdownPanel.down( 'textfield[itemId="requestedAmntFieldItemId"]' ).setValue(
						record.get( 'requestedAmnt' ) );
					objCreateNewDrawdownPanel.down( 'textfield[itemId="requestReferenceFieldItemId"]' ).setValue(
						record.get( 'requestReference' ) );
					objCreateNewDrawdownPanel.down( 'AutoCompleter[itemId="productCodeFieldItemId"]' ).setValue(
						record.get( 'productCode' ) );
					objCreateNewDrawdownPanel.down( 'textfield[itemId="scheduledDateFieldItemId"]' ).setValue(
						record.get( 'scheduledDate' ) );
					objCreateNewDrawdownPanel.down( 'radiogroup[itemId="productTypeRadioItemId"]' ).setValue(
					{
						productType : record.get( 'productType' )
					} );

					objCreateNewDrawdownPanel.down( 'AutoCompleter[itemId="loanAccNmbrFieldItemId"]' ).setReadOnly(
						true );
					objCreateNewDrawdownPanel.down( 'AutoCompleter[itemId="beneCodeFilterItemId"]' ).setReadOnly( true );
					objCreateNewDrawdownPanel.down( 'textfield[itemId="requestedAmntFieldItemId"]' ).setReadOnly( true );
					objCreateNewDrawdownPanel.down( 'textfield[itemId="requestReferenceFieldItemId"]' ).setReadOnly(
						true );
					objCreateNewDrawdownPanel.down( 'AutoCompleter[itemId="productCodeFieldItemId"]' ).setReadOnly(
						true );
					objCreateNewDrawdownPanel.down( 'datefield[itemId="scheduledDateFieldItemId"]' ).setReadOnly( true );
					objCreateNewDrawdownPanel.down( 'radiogroup[itemId="productTypeRadioItemId"]' ).setReadOnly( true );
					objCreateNewDrawdownPanel.down( 'button[itemId="saveBtnItemId"]' ).hide();
				}
				else
				{
					var objCreateNewRepaymentPanel = me.getLoanCenterLoanRepaymentPopupViewRef();

					objCreateNewRepaymentPanel.down( 'AutoCompleter[itemId="loanAccNmbrFieldItemId"]' ).setValue(
						record.get( 'loanAccNmbr' ) );
					objCreateNewRepaymentPanel.down( 'AutoCompleter[itemId="debitAccNmbrFieldItemId"]' ).setValue(
						record.get( 'debitAccNmbr' ) );
					objCreateNewRepaymentPanel.down( 'textfield[itemId="requestedAmntFieldItemId"]' ).setValue(
						record.get( 'requestedAmnt' ) );
					objCreateNewRepaymentPanel.down( 'textfield[itemId="requestReferenceFieldItemId"]' ).setValue(
						record.get( 'requestReference' ) );
					objCreateNewRepaymentPanel.down( 'AutoCompleter[itemId="productCodeFieldItemId"]' ).setValue(
						record.get( 'productCode' ) );
					objCreateNewRepaymentPanel.down( 'textfield[itemId="scheduledDateFieldItemId"]' ).setValue(
						record.get( 'scheduledDate' ) );
					objCreateNewRepaymentPanel.down( 'radiogroup[itemId="amountRadioItemId"]' ).setValue(
					{
						paymentType : record.get( 'paymentType' )
					} );

					objCreateNewRepaymentPanel.down( 'AutoCompleter[itemId="loanAccNmbrFieldItemId"]' ).setReadOnly(
						true );
					objCreateNewRepaymentPanel.down( 'AutoCompleter[itemId="debitAccNmbrFieldItemId"]' ).setReadOnly(
						true );
					objCreateNewRepaymentPanel.down( 'textfield[itemId="requestedAmntFieldItemId"]' )
						.setReadOnly( true );
					objCreateNewRepaymentPanel.down( 'textfield[itemId="requestReferenceFieldItemId"]' ).setReadOnly(
						true );
					objCreateNewRepaymentPanel.down( 'AutoCompleter[itemId="productCodeFieldItemId"]' ).setReadOnly(
						true );
					objCreateNewRepaymentPanel.down( 'datefield[itemId="scheduledDateFieldItemId"]' )
						.setReadOnly( true );
					objCreateNewRepaymentPanel.down( 'radiogroup[itemId="amountRadioItemId"]' ).setReadOnly( true );
					objCreateNewRepaymentPanel.down( 'button[itemId="saveBtnItemId"]' ).hide();
				}
			},

			submitForm : function( strUrl, record, rowIndex )
			{
				var me = this;
				var paymentType = record.get( 'paymentType' );
				if( paymentType == 'F' )
					paymentType = 'P';
				var form;
				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue ) );
				// form.appendChild( me.createFormField( 'INPUT', 'HIDDEN',
				// 'txtRecordIndex', rowIndex ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'selectedPayType', paymentType ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'isOpenPopup', 'Y' ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', '$isSiTabSelected', isSiTabSelected ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'identifier', record.get( 'identifier' ) ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'recordKeyNo', record.get( 'recordKeyNo' ) ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'version', record.get( 'version' ) ) );
				form.action = strUrl;
				document.body.appendChild( form );
				form.submit();
			},

			showHistory : function( url, id )
			{
				Ext.create(
					'GCP.view.LoanCenterHistoryPopupView',
					{
						historyUrl : url + "?" + csrfTokenName + "=" + csrfTokenValue + "&" + "$isSiTabSelected" + "="
							+ isSiTabSelected,
						identifier : id
					} ).show();
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

			loadDetailCount : function( sortOrder )
			{
				var me = this;
				Ext.Ajax.request(
				{
					url : 'prfCountDetails.srvc',
					async : false,
					method : "GET",
					success : function( response )
					{
						var data = Ext.decode( response.responseText );
						prfMstCnt = data;
					},
					failure : function( response )
					{
						console.log( 'Error Occured' );
					}
				} );
			},

			getLoanCenterGridConfig : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;
				
				if( !Ext.isEmpty( objGridViewPref ) )
					{
						var data = Ext.decode( objGridViewPref );
						var objPref = data[ 0 ];
						me.arrSorter = objPref.sortState;
					}
				if( isSiTabSelected == 'Y' )
				{
					objWidthMap =
					{
						"requestReference" : 90,
						"obligorID" : 100,
						"obligationID" : 120,
						"accountName" : 120,
						"requestedAmnt" : 100,
						"effectiveDate" : 90,
						"paymentTypeDesc" : 90,
						"siRequestStatusDesc" : 90
					};
				}
				else
				{
					objWidthMap =
					{
						"requestReference" : 90,
						"obligorID" : 90,
						"obligationID" : 120,
						"accountName" : 120,
						"requestedAmnt" : 90,
						"requestDate" : 100,
						"paymentTypeDesc" : 90,
						"requestStatusDesc" : 90,
						"hostResponseMsg" : 120
					};
				}

				if( isSiTabSelected == 'Y' )
				{
					arrColsPref =
					[
						{
							"colId" : "requestReference",
							"colHeader" : getLabel( 'reference', 'Reference' )
						},
						{
							"colId" : "obligorID",
							"colHeader" : getLabel( 'obligorNumber', 'Obligor Id' )
						},
						{
							"colId" : "obligationID",
							"colHeader" : getLabel( 'obligationNumber', 'Obligation Id' )
						},
						{
							"colId" : "accountName",
							"colHeader" : getLabel( 'accountName', 'Account Name' )
						},
						{
							"colId" : "requestedAmnt",
							"colHeader" : getLabel( 'requestedAmnt', 'Amount' ),
							"colType" : "number"
						},
						{
							"colId" : "effectiveDate",
							"colHeader" : getLabel( 'effectiveDate', 'Effective Date' )
						},
						{
							"colId" : "paymentTypeDesc",
							"colHeader" : getLabel( 'paymentTypeDesc', 'Type' )
						},
						{
							"colId" : "siRequestStatusDesc",
							"colHeader" : getLabel( 'statusDesc', 'Status' )
						}
					];
				}
				else
				{
					arrColsPref =
					[
						{
							"colId" : "requestReference",
							"colHeader" : getLabel( 'reference', 'Reference' )
						},
						{
							"colId" : "obligorID",
							"colHeader" : getLabel( 'obligorID', 'Obligor Id' )
						},
						{
							"colId" : "obligationID",
							"colHeader" : getLabel( 'obligationID', 'Obligation Id' )
						},
						{
							"colId" : "accountName",
							"colHeader" : getLabel( 'accountName', 'Account Name' )
						},
						{
							"colId" : "requestedAmnt",
							"colHeader" : getLabel( 'requestedAmnt', 'Amount' ),
							"colType" : "number"
						},
						{
							"colId" : "requestDate",
							"colHeader" : getLabel( 'requestDate', 'Request Date' )
						},
						{
							"colId" : "paymentTypeDesc",
							"colHeader" : getLabel( 'paymentTypeDesc', 'Type' )
						},
						{
							"colId" : "requestStatusDesc",
							"colHeader" : getLabel( 'statusDesc', 'Status' )
						},
						{
							"colId" : "hostResponseMsg",
							"colHeader" : getLabel( 'hostResponseMsg', 'Host Message' )
						}
					];
				}

				storeModel =
				{
					fields :
					[
						'requestReference', 'obligorID', 'obligationID', 'accountName', 'requestedAmnt', 'requestDate',
						'effectiveDate', 'paymentTypeDesc', 'requestStatusDesc', 'siRequestStatusDesc',
						'hostResponseMsg', 'paymentType', 'recordKeyNo', 'version', 'history', 'identifier',
						'countPaydown','countAdvance','countInvoice','bdAmountPaydown','bdAmountAdvance','bdAmountInvoice',
						'__metadata', '__subTotal'
					],
					proxyUrl : 'getLoanCenterList.srvc',
					rootNode : 'd.loanCenterTxn',
					sortState : me.arrSorter,
					totalRowsNode : 'd.__count'
				};

				objConfigMap =
				{
					"objWidthMap" : objWidthMap,
					"arrColsPref" : arrColsPref,
					"storeModel" : storeModel
				};
				return objConfigMap;
			},

			setGridInfoSummary : function( grid )
			{
				var me = this;
				var objGroupView = me.getGroupView();
				var grid = objGroupView.getGrid();
				//var loanCenterGridItem = me.getGroupView();
				var loanCenterGridInfo = me.getLoanCenterGridInformationViewRef();
				
				var loanPaydownCountId = loanCenterGridInfo
						.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="loanPaydownCountItemId"]' );
				var loanPaydownAmntId = loanCenterGridInfo
						.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="loanPaydownAmntItemId"]' );
				var loanAdvanceCountId = loanCenterGridInfo
						.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="loanAdvanceCountItemId"]' );
				var loanAdvanceAmntId = loanCenterGridInfo
						.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="loanAdvanceAmntItemId"]' );
				var loanInvoicesCountId = loanCenterGridInfo
					    .down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="loanInvoicesCountItemId"]' );
				var loanInvoicesAmntId = loanCenterGridInfo
					   .down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="loanInvoicesAmntItemId"]' );
				var dataStore = grid.store;
				dataStore.on( 'load', function( store, records )
				{
					var i = records.length - 1;
					if( i >= 0 )
					{
						if(!Ext.isEmpty( loanPaydownCountId ))
							loanPaydownCountId.setText( records[ i ].get( 'countPaydown' ) );
						if(!Ext.isEmpty( loanAdvanceCountId ))
							loanAdvanceCountId.setText( records[ i ].get( 'countAdvance' ) );
						if(!Ext.isEmpty( loanInvoicesCountId ))
							loanInvoicesCountId.setText( records[ i ].get( 'countInvoice' ) );
						if(!Ext.isEmpty( loanPaydownAmntId ))
							loanPaydownAmntId.setText( records[ i ].get( 'bdAmountPaydown' ) );
						if(!Ext.isEmpty( loanAdvanceAmntId ))
							loanAdvanceAmntId.setText(records[ i ].get( 'bdAmountAdvance' ) );
						if(!Ext.isEmpty( loanInvoicesAmntId ))
							loanInvoicesAmntId.setText( records[ i ].get( 'bdAmountInvoice' ) );
					}
					else
					{
						if(!Ext.isEmpty( loanPaydownCountId ))
							loanPaydownCountId.setText( "0" );
						if(!Ext.isEmpty( loanAdvanceCountId ))
							loanAdvanceCountId.setText( "0" );
						if(!Ext.isEmpty( loanInvoicesCountId ))
							loanInvoicesCountId.setText( "0" );
						if(!Ext.isEmpty( loanPaydownAmntId ))
							loanPaydownAmntId.setText( "$0.00" );
						if(!Ext.isEmpty( loanAdvanceAmntId ))
							loanAdvanceAmntId.setText( "$0.00" );
						if(!Ext.isEmpty( loanInvoicesAmntId ))
							loanInvoicesAmntId.setText( "$0.00" );
					}
				} );
			},			
			handleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
					newPgNo, oldPgNo, sorter, filterData) {
				var me = this;
				var objGroupView = me.getGroupView();
				//var buttonMask = me.strDefaultMask;
				//objGroupView.handleGroupActionsVisibility(buttonMask);
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
				//me.reportGridOrder = strUrl;
				me.setDataForFilter();
				strUrl = strUrl + "&" + "$isSiTabSelected" + "=" + isSiTabSelected;
				strUrl = strUrl + me.generateFilterUrl(subGroupInfo, groupInfo);
				strUrl = strUrl + '&' + csrfTokenName + '=' + csrfTokenValue;
				strUrl += me.generateColumnFilterUrl(filterData,strUrl);
				grid.loadGridData(strUrl, null, null, false);
				me.setGridInfoSummary();
				/*grid.on('itemdblclick', function(dataView, record, item, rowIndex,
								eventObj) {
							me.handleGridRowDoubleClick(record, grid);
						});*/
						
			},
			
			generateColumnFilterUrl : function(filterData,url) {
				var strUrl = '', strTempUrl = '';
				var obj = null, arrValues = null;
				var arrNested = null
				if (filterData) {
					for (var key in filterData) {
						obj = filterData[key] || {};
						arrValues = obj.value || [];
						if (obj.type === 'list') {
							Ext.each(arrValues, function(item) {
										if (item) {
											arrNested = item.split(',');
											Ext.each(arrNested, function(value) {
														strTempUrl += strTempUrl
																? ' or '
																: '';
														strTempUrl += arrSortColumn[key]
																+ ' eq \''
																+ value
																+ '\'';
													});
										}
									});
							if (strTempUrl)
								strTempUrl = '( ' + strTempUrl + ' )';
						}
					}
				}
				if (strTempUrl)
				{
				 if(!Ext.isEmpty(url) && url.indexOf('$filter')> -1)
				   {
					strUrl = ' and ' + strTempUrl;
					}
					else
					{
					  strUrl ='&$filter=' + strTempUrl;
					}
					
				}
				return strUrl;
			},
			generateFilterUrl : function(subGroupInfo, groupInfo) {
				var me = this;
				var strQuickFilterUrl = '', strAdvancedFilterUrl = '', strUrl = '', isFilterApplied = false;
				var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
						? subGroupInfo.groupQuery
						: '';
				if (me.filterApplied === 'ALL') {
					strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
					if (!Ext.isEmpty(strQuickFilterUrl)) {
						strUrl += '&$filter=' + strQuickFilterUrl;
						isFilterApplied = true;
					}
				} else {
					strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
					if (!Ext.isEmpty(strQuickFilterUrl)) {
						strUrl += '&$filter=' + strQuickFilterUrl;
						isFilterApplied = true;
					}
					strAdvancedFilterUrl = me
							.generateUrlWithAdvancedFilterParams(isFilterApplied);
					if (!Ext.isEmpty(strAdvancedFilterUrl)) {
						if (Ext.isEmpty(strUrl)) {
							strUrl = "&$filter=";
						}
						strUrl += strAdvancedFilterUrl;
						isFilterApplied = true;
					}
				}
				if (!Ext.isEmpty(strGroupQuery)) {
					if (!Ext.isEmpty(strUrl))
						strUrl += ' and ' + strGroupQuery;
					else
						strUrl += '&$filter=' + strGroupQuery;
				}
				return strUrl;
			},
			/*
			 * getFilterUrl : function() { var me = this; var strQuickFilterUrl =
			 * ''; strQuickFilterUrl = me.generateUrlWithFilterParams( this );
			 * return strQuickFilterUrl; },
			 */

			getFilterUrl : function()
			{
				var me = this;
				var strQuickFilterUrl = '', strAdvFilterUrl = '', strUrl = '', strActionStatusUrl = '', isFilterApplied = 'false';
				// strActionStatusUrl = me.generateActionStatusUrl();

				if( me.filterApplied === 'ALL' || me.filterApplied === 'Q' )
				{
					strQuickFilterUrl = me.generateUrlWithQuickFilterParams( this );
					if( !Ext.isEmpty( strQuickFilterUrl ) )
					{
						strUrl += strQuickFilterUrl;
						isFilterApplied = true;
					}
					if( !Ext.isEmpty( strActionStatusUrl ) )
					{
						if( isFilterApplied )
							strUrl += ' and ' + strActionStatusUrl;
						else
							strUrl += '&$filter=' + strActionStatusUrl;
					}
					return strUrl;
				}
				else
				{
					/*
					 * strQuickFilterUrl = me.generateUrlWithQuickFilterParams(
					 * this ); if( !Ext.isEmpty( strQuickFilterUrl ) ) { strUrl +=
					 * strQuickFilterUrl; isFilterApplied = true; }
					 */
					strAdvFilterUrl = me.generateUrlWithAdvancedFilterParams( me );
					if( !Ext.isEmpty( strAdvFilterUrl ) )
					{
						strUrl += strAdvFilterUrl;
						isFilterApplied = true;
					}
					/*
					 * if( !Ext.isEmpty( strActionStatusUrl ) ) { if(
					 * isFilterApplied ) strUrl += ' and ' + strActionStatusUrl;
					 * else strUrl += '&$filter=' + strActionStatusUrl; }
					 */
					return strUrl;
				}
			},

			generateUrlWithQuickFilterParams : function( thisClass )
			{
				var filterData = thisClass.filterData;
				var isFilterApplied = false;
				var strFilter = '';//'&$filter=';
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
						case 'in':
							var arrId = filterData[ index ].paramValue1;
							if( 0 != arrId.length )
							{
								strTemp = strTemp + '(';
								for( var count = 0 ; count < arrId.length ; count++ )
								{
									strTemp = strTemp + filterData[ index ].paramName + ' eq ' + '\'' + arrId[ count ]
										+ '\'';
									if( count != arrId.length - 1 )
									{
										strTemp = strTemp + ' or ';
									}
								}
								strTemp = strTemp + ' )';
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
								strTemp = strTemp + filterData[ index ].paramName + ' '
									+ filterData[ index ].operatorValue + ' ' + '\'' + filterData[ index ].paramValue1
									+ '\'';
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
				// var filterData = thisClass.filterData;
				var filterData = thisClass.advFilterData;
				var isFilterApplied = me;
				var isOrderByApplied = false;
				var strFilter = '';	//'&$filter=';
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
							&& ( operator === 'bt' || operator === 'eq' || operator === 'lk' || operator === 'gt'
								|| operator === 'lt' || operator === 'ne' ) )
							strTemp = strTemp + ' and ';
						switch( operator )
						{
							case 'bt':
								isFilterApplied = true;
								if( filterData[ index ].dataType === 1 )
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
							case 'ne':
								strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator
									+ ' ' + '\'' + filterData[ index ].value1 + '\'';
								break;
						}
					}
				}
				if( isFilterApplied )
				{
					strFilter = strFilter + strTemp;
				}
				else if( isOrderByApplied )
				{
					strFilter = strTemp;
				}
				else
				{
					strFilter = '';
				}
				return strFilter;
			},
			isInCondition : function( data )
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
			},
			generateActionStatusUrl : function()
			{
				var me = this;
				var strRetValue = '';
				var arrActionStatus = me.arrActionStatus;
				if( !Ext.isEmpty( arrActionStatus ) )
				{
					for( var i = 0 ; i < arrActionStatus.length ; i++ )
					{
						if( i == 0 )
							strRetValue += Ext.String.format( "ActionStatus eq '{0}'", arrActionStatus[ i ] );
						else
							strRetValue += Ext.String.format( " or ActionStatus eq '{0}'", arrActionStatus[ i ] );
					}
				}
				if( !Ext.isEmpty( strRetValue ) )
					strRetValue = '(' + strRetValue + ')';
				return strRetValue;
			},

			/*
			 * generateUrlWithFilterParams : function( thisClass ) { var
			 * filterData = thisClass.filterData; var isFilterApplied = false;
			 * var strFilter = '&$filter='; var strTemp = ''; var strFilterParam =
			 * ''; for( var index = 0 ; index < filterData.length ; index++ ) {
			 * if( isFilterApplied ) strTemp = strTemp + ' and '; switch(
			 * filterData[ index ].operatorValue ) { case 'bt': if( filterData[
			 * index ].dataType === 'D' ) { strTemp = strTemp + filterData[
			 * index ].paramName + ' ' + filterData[ index ].operatorValue + ' ' +
			 * 'date\'' + filterData[ index ].paramValue1 + '\'' + ' and ' +
			 * 'date\'' + filterData[ index ].paramValue2 + '\''; } else {
			 * strTemp = strTemp + filterData[ index ].paramName + ' ' +
			 * filterData[ index ].operatorValue + ' ' + '\'' + filterData[
			 * index ].paramValue1 + '\'' + ' and ' + '\'' + filterData[ index
			 * ].paramValue2 + '\''; } break; default: // Default opertator is
			 * eq if( filterData[ index ].dataType === 'D' ) { strTemp = strTemp +
			 * filterData[ index ].paramName + ' ' + filterData[ index
			 * ].operatorValue + ' ' + 'date\'' + filterData[ index
			 * ].paramValue1 + '\''; } else { strTemp = strTemp + filterData[
			 * index ].paramName + ' ' + filterData[ index ].operatorValue + ' ' +
			 * '\'' + filterData[ index ].paramValue1 + '\''; } break; }
			 * isFilterApplied = true; } if( isFilterApplied ) strFilter =
			 * strFilter + strTemp; else strFilter = ''; return strFilter; },
			 */
		/*	orderUpDown : function( grid, rowIndex, direction )
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
			},*/
				orderUpDown : function(grid, rowIndex, direction) {
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
			sendUpdatedOrederJsonToDb : function( store )
			{
				var me = this;
				var preferenceArray = [];
				var strURL = isSiTabSelected == 'Y' ? 'userpreferences/loanCenterSiAdvFltr/gridViewAdvanceFilter.srvc?'
					: 'userpreferences/loanCenterTxnAdvFltr/gridViewAdvanceFilter.srvc?';

				store.each( function( rec )
				{
					var singleFilterSet = rec.raw;
					preferenceArray.push( singleFilterSet );
				} );

				var objJson = {};
				var fiterArray = [];
				for( i = 0 ; i < preferenceArray.length ; i++ )
				{
					fiterArray.push( preferenceArray[ i ].filterName );
				}
				objJson.filters = fiterArray;
				Ext.Ajax.request(
				{
					url : strURL + csrfTokenName + "="
						+ csrfTokenValue,
					method : 'POST',
					jsonData : objJson,
					success : function( response )
					{
						me.updateAdvActionToolbar();
					},
					failure : function()
					{
						console.log( "Error Occured - Addition Failed" );
					}
				} );
			},
			updateAdvActionToolbar : function()
			{
				var me = this;
				var strURL = isSiTabSelected == 'Y' ? 'userpreferences/loanCenterSiAdvFltr/gridViewAdvanceFilter.srvc?'
						: 'userpreferences/loanCenterTxnAdvFltr/gridViewAdvanceFilter.srvc?';
				
				Ext.Ajax.request(
				{
					url : strURL,
					method : 'GET',
					headers: objHdrCsrfParams,
					success : function( response )
					{
						var responseData = Ext.decode( response.responseText );
						var filters = JSON.parse( responseData.preference );
						me.addAllSavedFilterCodeToView( filters.filters );
					},
					failure : function()
					{
						console.log( "Error Occured - Addition Failed" );
					}
				} );
			},

			getAllSavedAdvFilterCode : function( panel )
			{
				var me = this;
				var strUrl = isSiTabSelected == 'Y' ? 'userfilterslist/loanCenterSiAdvFltr.srvc?'
					: 'userfilterslist/loanCenterTxnAdvFltr.srvc?';
				Ext.Ajax.request(
				{
					url : strUrl ,
					headers: objHdrCsrfParams,
					async : false,
					success : function( response )
					{
						var responseData = Ext.decode( response.responseText );
						var arrFilters = [];
						var filterData = responseData.d.filters;
						if( filterData )
						{
							arrFilters = filterData;
						}
						me.addAllSavedFilterCodeToView( arrFilters );
					},
					failure : function( response )
					{
						console.log( 'Bad : Something went wrong with your request' );
					}
				} );
			},
			getAllSavedAdvTooBarCode : function()
			{
				var me = this;
				var strUrl = isSiTabSelected == 'Y' ? 'userfilterslist/loanCenterSiAdvFltr.srvc?'
					: 'userfilterslist/loanCenterTxnAdvFltr.srvc?';
				Ext.Ajax.request(
				{
					url : strUrl ,
					headers: objHdrCsrfParams,
					success : function( response )
					{
						var responseData = Ext.decode( response.responseText );
						var arrFilters = [];
						var filterData = responseData.d.filters;
						if( filterData )
						{
							arrFilters = filterData;
						}
						me.addAllSavedFilterCodeToView( arrFilters );
					},
					failure : function( response )
					{
						console.log( 'Bad : Something went wrong with your request' );
					}
				} );
			},
			addAllSavedFilterCodeToView : function( arrFilters )
			{
				var me = this;
				var objToolbar = this.getAdvFilterActionToolBarRef();

				if( objToolbar.items && objToolbar.items.length > 0 )
				{
					objToolbar.removeAll();
				}

				if( arrFilters && arrFilters.length > 0 )
				{
					var count = arrFilters.length;
					if( count > 2 )
						count = 2;
					var toolBarItems = [];
					var item;
					for( var i = 0 ; i < count ; i++ )
					{
						var btnCls = 'cursor_pointer xn-account-filter-btnmenu';
						if(arrFilters[ i ] === me.filterCodeValue)
							btnCls = 'xn-custom-heighlight';
						item = Ext.create( 'Ext.Button',
						{
							cls : btnCls,
							itemId : arrFilters[ i ],
							tooltip : arrFilters[ i ],
							text : Ext.util.Format.ellipsis( arrFilters[ i ], 11 ),
							handler : function( btn, opts )
							{
								/*
								 * objSavedFilter.fireEvent(
								 * 'handleSavedFilterItemClick', btn.itemId);
								 */

								// me.handleFilterItemClick(btn.itemId);
								objToolbar.fireEvent( 'handleSavedFilterItemClick', btn.itemId, btn );
							}
						} );
						toolBarItems.push( item );
					}
					item = Ext.create( 'Ext.Button',
					{
						cls : 'cursor_pointer button_underline',
						padding : '4 0 0 0',
						text : getLabel( 'moreText', 'more' ) + '<span class="button_underline">' + '&nbsp;>>' + '</span>',
						itemId : 'advMoreBtnItemId',
						handler : function( btn, opts )
						{
							me.handleMoreAdvFilterSet( btn.itemId );
						}
					} );
					var imgItem = Ext.create( 'Ext.Img',
					{
						src : 'static/images/icons/icon_spacer.gif',
						height : 16,
						cls :'ux_hide-image'
					} );

					toolBarItems.push( imgItem );
					toolBarItems.push( item );
					objToolbar.removeAll();
					objToolbar.add( toolBarItems );
				}
			},
			handleMoreAdvFilterSet : function( btnId )
			{
				var me = this;
				if( !Ext.isEmpty( me.objAdvFilterPopup ) )
				{
					me.objAdvFilterPopup.show();
					var objTabPanel = me.getAdvanceFilterTabPanelRef();
					objTabPanel.setActiveTab( 0 );
					var filterDetailsTab = me.getFilterDetailsTabRef();
					filterDetailsTab.setTitle( getLabel( 'filterDetails', 'Filter Details' ) );
				}
				else
				{
					me.objAdvFilterPopup = Ext.create( 'GCP.view.LoanCenterAdvFilterPopupView' );
					var objTabPanel = me.getAdvanceFilterTabPanelRef();
					objTabPanel.setActiveTab( 0 );
					me.objAdvFilterPopup.show();
					var filterDetailsTab = me.getFilterDetailsTabRef();
					filterDetailsTab.setTitle( getLabel( 'filterDetails', 'Filter Details' ) );
				}
			},
			handleFilterItemClick : function( filterCode, btn )
			{
				var me = this;
				var objToolbar = me.getAdvFilterActionToolBarRef();
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
				me.toggleSavePrefrenceAction( true );
				me.toggleClearPrefrenceAction(true);
			},
			getSavedFilterData : function( filterCode, fnCallback, applyAdvFilter )
			{
				var me = this;
				var objOfCreateNewFilter = me.getCreateNewFilterRef();
				var objJson;
				var urlForm = isSiTabSelected == 'Y' ? 'userfilters/loanCenterSiAdvFltr/{0}.srvc?'
					: 'userfilters/loanCenterTxnAdvFltr/{0}.srvc?';
				var strUrl = urlForm ;
				strUrl = Ext.String.format( strUrl, filterCode );
				Ext.Ajax.request(
				{
					url : strUrl,
					headers: objHdrCsrfParams,
					jsonData : objJson,
					method : 'GET',
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
			populateSavedFilter : function( filterCode, filterData, applyAdvFilter )
			{
				var me = this;
				var objCreateNewFilterPanel = me.getCreateNewFilterRef();
				objCreateNewFilterPanel.resetAllFields( objCreateNewFilterPanel );

				for( i = 0 ; i < filterData.filterBy.length ; i++ )
				{
					var fieldName = filterData.filterBy[ i ].field;

					var fieldOper = filterData.filterBy[ i ].operator;

					var fieldVal = filterData.filterBy[ i ].value1;

					if( fieldName === 'requestReference' || fieldName === 'accountName'
						|| fieldName === 'requestedAmnt' || fieldName === 'filterCode' )
					{
						var fieldType = 'textfield';
					}
					else if( fieldName === 'obligorID' || fieldName === 'obligationID' || fieldName === 'requestStatus' || fieldName === 'operatorAmntFilterItemId' || fieldName === 'requestStatusFilterItemId' )
					{
						var fieldType = 'combobox';
					}
					
					if ( fieldOper != 'eq' )
					{
						objCreateNewFilterPanel.down('combobox[itemId="operatorAmntFilterItemId"]')
								.setValue(fieldOper);
					}

					var fieldObj = objCreateNewFilterPanel.down( '' + fieldType + '[itemId="' + fieldName
						+ 'FilterItemId"]' );

					fieldObj.setValue( fieldVal );
				}
				if( applyAdvFilter )
				{
					me.filterApplied = 'A';
					me.setDataForFilter();
					me.applyAdvancedFilter();
				}
			},
			editFilterData : function( grid, rowIndex )
			{
				var me = this;
				var objCreateNewFilterPanel = me.getCreateNewFilterRef();
				var filterDetailsTab = me.getFilterDetailsTabRef();
				filterDetailsTab.setTitle( getLabel( 'filterDetails', 'Filter Details' ) );

				var saveSearchBtn = me.getSaveSearchBtnRef();

				if( saveSearchBtn )
				{
					saveSearchBtn.show();
				}
				objCreateNewFilterPanel.resetAllFields( objCreateNewFilterPanel );
				objCreateNewFilterPanel.enableDisableFields( objCreateNewFilterPanel, false );
				objCreateNewFilterPanel.removeReadOnly( objCreateNewFilterPanel, false );
				var record = grid.getStore().getAt( rowIndex );
				var filterCode = record.data.filterName;

				objCreateNewFilterPanel.down( 'textfield[itemId="filterCodeFilterItemId"]' ).setValue( filterCode );
				objCreateNewFilterPanel.down( 'textfield[itemId="filterCodeFilterItemId"]' ).setDisabled( true );
				var objTabPanel = me.getAdvanceFilterTabPanelRef();
				var applyAdvFilter = false;

				me.getSaveSearchBtnRef().show();

				me.filterCodeValue = filterCode;

				me.getSavedFilterData( filterCode, this.populateSavedFilter, applyAdvFilter );

				objTabPanel.setActiveTab( 1 );
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
				me.deleteFilterCodeFromDb( objFilterName );
			},
			deleteFilterCodeFromDb : function( objFilterName )
			{
				var me = this;
				var urlForm = isSiTabSelected == 'Y' ? 'userfilters/loanCenterSiAdvFltr/{0}/remove.srvc?'
					: 'userfilters/loanCenterTxnAdvFltr/{0}/remove.srvc?';
				if( !Ext.isEmpty( objFilterName ) )
				{
					var strUrl = urlForm + csrfTokenName + '=' + csrfTokenValue;
					strUrl = Ext.String.format( strUrl, objFilterName );

					Ext.Ajax.request(
					{
						url : strUrl,
						method : "POST",
						success : function( response )
						{
							me.getAllSavedAdvFilterCode();
						},
						failure : function( response )
						{
							console.log( "Error Occured" );
						}
					} );
				}
			},
			viewFilterData : function( grid, rowIndex )
			{
				var me = this;
				var objCreateNewFilterPanel = me.getCreateNewFilterRef();

				var filterDetailsTab = me.getFilterDetailsTabRef();
				filterDetailsTab.setTitle( getLabel( 'filterDetails', 'Filter Details' ) );

				objCreateNewFilterPanel.resetAllFields( objCreateNewFilterPanel );
				objCreateNewFilterPanel.enableDisableFields( objCreateNewFilterPanel, false );
				objCreateNewFilterPanel.removeReadOnly( objCreateNewFilterPanel, true );

				var record = grid.getStore().getAt( rowIndex );
				var filterCode = record.data.filterName;
				var objTabPanel = me.getAdvanceFilterTabPanelRef();
				var applyAdvFilter = false;

				me.getSaveSearchBtnRef().hide();

				me.getSavedFilterData( filterCode, this.populateAndDisableSavedFilter, applyAdvFilter );

				objTabPanel.setActiveTab( 1 );
			},
			populateAndDisableSavedFilter : function( filterCode, filterData, applyAdvFilter )
			{
				var me = this;
				var objCreateNewFilterPanel = me.getCreateNewFilterRef();
				for( i = 0 ; i < filterData.filterBy.length ; i++ )
				{
					var fieldName = filterData.filterBy[ i ].field;

					var fieldVal = filterData.filterBy[ i ].value1;

					var fieldOper = filterData.filterBy[ i ].operator;

					if( fieldName === 'requestReference' || fieldName === 'accountName'
						|| fieldName === 'requestedAmnt' || fieldName === 'filterCode' )
					{
						var fieldType = 'textfield';
						if(fieldName === 'requestedAmnt'){
								var operatorField = objCreateNewFilterPanel.down( 'combo[itemId="operatorAmntFilterItemId"]' );
								operatorField.setValue(fieldOper);
						}
					}
					else if( fieldName === 'obligorID' || fieldName === 'obligationID' || fieldName === 'requestStatus' || fieldName === 'operatorAmntFilterItemId' || fieldName === 'requestStatusFilterItemId' )
					{
						var fieldType = 'combobox';
					}

					var fieldObj = objCreateNewFilterPanel.down( '' + fieldType + '[itemId="' + fieldName
						+ 'FilterItemId"]' );

					fieldObj.setValue( fieldVal );
				}

				objCreateNewFilterPanel.down( 'textfield[itemId="requestReferenceFilterItemId"]' ).setReadOnly( true );
				objCreateNewFilterPanel.down( 'combobox[itemId="obligorIDFilterItemId"]' ).setReadOnly( true );
				objCreateNewFilterPanel.down( 'textfield[itemId="accountNameFilterItemId"]' ).setReadOnly( true );
				objCreateNewFilterPanel.down( 'combobox[itemId="obligationIDFilterItemId"]' ).setReadOnly( true );
				objCreateNewFilterPanel.down( 'textfield[itemId="filterCodeFilterItemId"]' ).setReadOnly( true );
				objCreateNewFilterPanel.down( 'textfield[itemId="requestedAmntFilterItemId"]' ).setReadOnly( true );
				objCreateNewFilterPanel.down( 'combobox[itemId="operatorAmntFilterItemId"]' ).setDisabled( true );
				objCreateNewFilterPanel.down( 'combobox[itemId="requestStatusFilterItemId"]' ).setDisabled( true );
				objCreateNewFilterPanel.down( 'textfield[itemId="filterCodeFilterItemId"]' ).setReadOnly( true );
			},
			advanceFilterPopUp : function( btn )
			{
				var me = this;
				var objCreateNewFilterPanel = me.getCreateNewFilterRef();
				var filterDetailsTab = me.getFilterDetailsTabRef();
				filterDetailsTab.setTitle( 'Create New Filter' );

				var saveSearchBtn = me.getSaveSearchBtnRef();
				if( saveSearchBtn )
				{
					saveSearchBtn.show();
				}
				objCreateNewFilterPanel.resetAllFields( objCreateNewFilterPanel );
				objCreateNewFilterPanel.enableDisableFields( objCreateNewFilterPanel, false );
				objCreateNewFilterPanel.removeReadOnly( objCreateNewFilterPanel, false );

				me.filterCodeValue = null;

				if( !Ext.isEmpty( me.objAdvFilterPopup ) )
				{
					me.objAdvFilterPopup.show();
					var objTabPanel = me.getAdvanceFilterTabPanelRef();
					objTabPanel.setActiveTab( 1 );
				}
				else
				{
					me.objAdvFilterPopup = Ext.create( 'GCP.view.LoanCenterAdvFilterPopupView' );
					var objTabPanel = me.getAdvanceFilterTabPanelRef();
					objTabPanel.setActiveTab( 1 );
					me.objAdvFilterPopup.show();
				}
			},
			// This function will called only once
			updateAdvFilterConfig : function()
			{
				var me = this;
				if( !Ext.isEmpty( objGridViewFilterPref ) )
				{
					var data = Ext.decode( objGridViewFilterPref );
					if( !Ext.isEmpty( data.advFilterCode ) )
					{
						me.showAdvFilterCode = data.advFilterCode;
						me.savePrefAdvFilterCode = data.advFilterCode;
						var strUrl = isSiTabSelected == 'Y' ? 'userfilters/loanCenterSiAdvFltr/{0}.srvc'
							: 'userfilters/loanCenterTxnAdvFltr/{0}.srvc';
						strUrl = Ext.String.format( strUrl, data.advFilterCode );
						Ext.Ajax.request(
						{
							url : strUrl + "?" + csrfTokenName + "=" + csrfTokenValue,
							async : false,
							method : 'POST',
							success : function( response )
							{
								var responseData = Ext.decode( response.responseText );

								var applyAdvFilter = false;
								me.populateSavedFilter( data.advFilterCode, responseData, applyAdvFilter );
								var objOfCreateNewFilter = me.getCreateNewFilterRef();
								var objJson = objOfCreateNewFilter.getAdvancedFilterQueryJson( objOfCreateNewFilter );

								me.advFilterData = objJson;

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
			enableValidActionsForGrid : function(groupInfo, subGroupInfo, objGrid,objRecord, intRecordIndex, arrSelectedRecords, jsonData) 
			{
				var me = this;
				var buttonMask = '000000';
				var maskSize = 6;
				if( isSiTabSelected == 'Y' )
				{
					buttonMask = '00000000';
					maskSize = 8;
				}

				var maskArray = new Array(), actionMask = '', objData = null;

				if( !Ext.isEmpty( jsonData ) && !Ext.isEmpty( jsonData.d.__buttonMask ) )
				{
					buttonMask = jsonData.d.__buttonMask;
				}
				var isSameUser = true;
				maskArray.push( buttonMask );
				for( var index = 0 ; index < arrSelectedRecords.length ; index++ )
				{
					objData = arrSelectedRecords[ index ];
					maskArray.push( objData.get( '__metadata' ).__rightsMap );
					if( objData.raw.makerId === USER )
					{
						isSameUser = false;
					}
				}
				actionMask = doAndOperation( maskArray, maskSize );
				me.enableDisableGroupActions( actionMask, isSameUser );
			},

			searchTrasactionChange : function()
			{
				var me = this;
				var searchValue = me.getSearchTxnTextInput().value;
				var anyMatch = me.getMatchCriteria().getValue();
				if( 'anyMatch' === anyMatch.searchOnPage )
				{
					anyMatch = false;
				}
				else
				{
					anyMatch = true;
				}

				var objGroupView = me.getGroupView();
				var grid = objGroupView.getGrid();
				grid.view.refresh();

				// detects html tag
				var tagsRe = /<[^>]*>/gm;
				// DEL ASCII code
				var tagsProtect = '\x0f';
				// detects regexp reserved word
				var regExpProtect = /\\|\/|\+|\\|\.|\[|\]|\{|\}|\?|\$|\*|\^|\|/gm;

				if( searchValue !== null )
				{
					searchRegExp = new RegExp( searchValue, 'g' + ( anyMatch ? '' : 'i' ) );

					if( !Ext.isEmpty( grid ) )
					{
						var store = grid.store;

						store.each( function( record, idx )
						{
							var td = Ext.fly( grid.view.getNode( idx ) ).down( 'td' ), cell, matches, cellHTML;
							while( td )
							{
								cell = td.down( '.x-grid-cell-inner' );
								matches = cell.dom.innerHTML.match( tagsRe );
								cellHTML = cell.dom.innerHTML.replace( tagsRe, tagsProtect );

								if( cellHTML === '&nbsp;' )
								{
									td = td.next();
								}
								else
								{
									// populate indexes array, set
									// currentIndex, and
									// replace
									// wrap matched string in a span
									cellHTML = cellHTML.replace( searchRegExp, function( m )
									{
										return '<span class="xn-livesearch-match">' + m + '</span>';
									} );
									// restore protected tags
									Ext.each( matches, function( match )
									{
										cellHTML = cellHTML.replace( tagsProtect, match );
									} );
									// update cell html
									cell.dom.innerHTML = cellHTML;
									td = td.next();
								}
							}
						}, me );
					}
				}
			},
			handleGroupActions : function(actionName, grid, arrSelectedRecords,strActionType, fxType)
			{
				var me = this;
				var strAction = actionName; //!Ext.isEmpty( actionName ) ? actionName : btn.itemId;
				var strUrl = Ext.String.format( 'getLoanCenterList/{0}.srvc?', strAction );
				strUrl = strUrl + csrfTokenName + "=" + csrfTokenValue;

				strUrl = strUrl + "&" + "$isSiTabSelected" + "=" + isSiTabSelected;

				if( strAction === 'reject' )
				{
					this.showRejectVerifyPopUp(strAction, strUrl, grid,arrSelectedRecords, strActionType);
				}
				else
				{
					this.preHandleGroupActions(strUrl, '', grid, arrSelectedRecords,strActionType, strAction);
				}
			},

			showRejectVerifyPopUp : function(strAction, strActionUrl, grid,
			arrSelectedRecords, strActionType)
			{
				var me = this;
				var titleMsg = '', fieldLbl = '';
				if( strAction === 'reject' )
				{
					titleMsg = getLabel( 'prfRejectRemarkPopUpTitle', 'Please Enter Reject Remark' );
					fieldLbl = getLabel( 'prfRejectRemarkPopUpFldLbl', 'Reject Remark' );
				}
				Ext.Msg.show(
				{
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					multiline : 4,
					style :
					{
						height : 400
					},
					bodyPadding : 0,
					fn : function( btn, text )
					{
						if( btn == 'ok' )
						{
							me.preHandleGroupActions(strActionUrl, text, grid,arrSelectedRecords, strActionType,strAction);
						}
					}
				} );
			},

			preHandleGroupActions : function(strUrl, remark, grid, arrSelectedRecords,strActionType, strAction)
			{
				var me = this;
				var objGroupView = me.getGroupView();
			//	var grid = objGroupView.getGrid();
				if( !Ext.isEmpty( grid ) )
				{
					var arrayJson = new Array();
					var eventList = "";
					var records=arrSelectedRecords;
				//	var records = grid.getSelectedRecords();
					var fromGrid = "Y";
				/*	records = ( !Ext.isEmpty( records ) && Ext.isEmpty( record ) ) ? records :
					[
						record
					];*/
					for( var index = 0 ; index < records.length ; index++ )
					{
						
						if("Paydown"==records[ index ].data.paymentTypeDesc)
						{
							eventList = eventList + 'LNPAYDOWN,';
						}
						if("Pay Invoice"==records[ index ].data.paymentTypeDesc)
						{
							eventList = eventList + 'LNINVPAY,';
						}
						if("Advance"==records[ index ].data.paymentTypeDesc)
						{
							eventList = eventList + 'LNADVANCE,';
						}
						arrayJson.push(
						{
							serialNo : grid.getStore().indexOf( records[ index ] ) + 1,
							identifier : records[ index ].data.identifier,
							userMessage : remark
						} );
					}
					if( arrayJson )
						arrayJson = arrayJson.sort( function( valA, valB )
						{
							return valA.serialNo - valB.serialNo
						} );
					checkCutOffTime(eventList,strUrl,records,remark,fromGrid);
				}
			},

			showInvoiceCenterPopupView : function( url, records, remark )
			{
				var me = this;
				var objGroupView = me.getGroupView();
				var grid = objGroupView.getGrid();
				if( !Ext.isEmpty( grid ) )
				{
					var arrayJson = new Array();
					var eventList = "";
				/*	var records = grid.getSelectedRecords();
					records = ( !Ext.isEmpty( records ) ) ? records :
					[
						record
					];*/
					for( var index = 0 ; index < records.length ; index++ )
					{
						arrayJson.push(
						{
							serialNo : grid.getStore().indexOf( records[ index ] ) + 1,
							identifier : records[ index ].data.identifier,
							userMessage : remark
						} );
					}
					if( arrayJson )
						arrayJson = arrayJson.sort( function( valA, valB )
						{
							return valA.serialNo - valB.serialNo
						} );
				}
				
				Ext.Ajax.request(
					{
						url : url,
						method : 'POST',
						jsonData : Ext.encode( arrayJson ),
						success : function( response )
						{
							// TODO : Action Result handling to be done here
												
							var responseData = Ext.decode(response.responseText);
							callRealTimeresponse(responseData,url, null);
							if( isSiTabSelected == 'Y' )
								me.enableDisableGroupActions( '000000', true );
							else
								me.enableDisableGroupActions( '0000000', true );
							grid.refreshData();
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
			isRowMoreMenuVisible : function( store, record, jsonData, itmId, menu )
			{
				var me = this;
				if( !Ext.isEmpty( record.get( 'isEmpty' ) ) && record.get( 'isEmpty' ) === true )
					return false;
				var arrMenuItems = null;
				var isMenuVisible = false;
				var blnRetValue = true;
				if( !Ext.isEmpty( menu.items ) && !Ext.isEmpty( menu.items.items ) )
					arrMenuItems = menu.items.items;

				if( !Ext.isEmpty( arrMenuItems ) )
				{
					for( var a = 0 ; a < arrMenuItems.length ; a++ )
					{
						blnRetValue = me.isRowIconVisible( store, record, jsonData, itmId,
							arrMenuItems[ a ].maskPosition );
						isMenuVisible = ( isMenuVisible || blnRetValue ) ? true : false;
					}
				}
				return isMenuVisible;
			},
			enableDisableGroupActions : function( actionMask, isSameUser )
			{
				//var actionBar = this.getActionBarSummDtl();
				var me = this;
				var objGroupView = me.getGroupView();
				var actionBar = objGroupView.down('toolbar[itemId="groupActionToolBar"]');
				var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
				if( !Ext.isEmpty( actionBar ) && !Ext.isEmpty( actionBar.items.items ) )
				{
					arrItems = actionBar.items.items;
					Ext.each( arrItems, function( item )
					{
						strBitMapKey = parseInt( item.maskPosition,10 ) - 1;
						if( strBitMapKey || strBitMapKey == 0 )
						{
							blnEnabled = isActionEnabled( actionMask, strBitMapKey );
							if( ( item.maskPosition === 1 && blnEnabled ) )
							{
								blnEnabled = blnEnabled && isSameUser;
							}
							else if( item.maskPosition === 2 && blnEnabled )
							{
								blnEnabled = blnEnabled && isSameUser;
							}
							item.setDisabled( !blnEnabled );
						}
					} );
				}
			},
			getColumns : function( arrColsPref, objWidthMap )
			{
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				if( isSiTabSelected == 'Y' )
				{
					arrCols.push( me.createSiGroupActionColumn() );
				}
				else
				{
					arrCols.push( me.createGroupActionColumn() );
				}

				arrCols.push( me.createActionColumn() );
				if( !Ext.isEmpty( arrColsPref ) )
				{
					for( var i = 0 ; i < arrColsPref.length ; i++ )
					{
						objCol = arrColsPref[ i ];
						cfgCol = {};
						cfgCol.colHeader = objCol.colHeader;
						cfgCol.colId = objCol.colId;
						cfgCol.hidden = objCol.hidden;
						cfgCol.locked = objCol.locked;
						cfgCol.width = objCol.width;
						if( !Ext.isEmpty( objCol.colType ) )
						{
							cfgCol.colType = objCol.colType;
							if( cfgCol.colType === "number" )
								cfgCol.align = 'right';
						}
						else if( objCol.colId === 'requestedAmnt' )
						{
							cfgCol.align = 'right';
						}

						if( objCol.colId === 'requestReference' ) // to show
						// the
						// summary
						// row
						// description
						{
							cfgCol.fnSummaryRenderer = function( value, summaryData, dataIndex, colId )
							{
								var strRet = '';
								var strSubTotal;
								var objGroupView = me.getGroupView();
								var grid = objGroupView.getGrid();
								if( !Ext.isEmpty( grid ) && !Ext.isEmpty( grid.store ) )
								{
									var data = grid.store.proxy.reader.jsonData;
									if( data && data.d && data.d.__subTotal )
									{
										strSubTotal = data.d.__subTotal;
									}
								}
								if( null != strSubTotal && strSubTotal != '$0.00' )
								{
									strRet = getLabel( 'subTotal', 'Sub Total' );
								}
								return strRet;
							}
						}

						if( objCol.colId === 'requestedAmnt' ) // to show
						// subtotal
						// value
						{
							cfgCol.fnSummaryRenderer = function( value, summaryData, dataIndex, colId )
							{
								var strRet = '';
								var objGroupView = me.getGroupView();
								var loanCenterGrid = objGroupView.getGrid();
								if( !Ext.isEmpty( loanCenterGrid ) && !Ext.isEmpty( loanCenterGrid.store ) )
								{
									var data = loanCenterGrid.store.proxy.reader.jsonData;
									if( data && data.d && data.d.__subTotal )
									{
										if( data.d.__subTotal != '$0.00' )
											strRet = data.d.__subTotal;
									}
								}
								return strRet;
							}
						}
						cfgCol.width = !Ext.isEmpty( objCol.width ) ? objCol.width : 120;
						if(cfgCol.width === 120)
							cfgCol.width = !Ext.isEmpty( objWidthMap[ objCol.colId ] ) ? objWidthMap[ objCol.colId ] : 120;
						cfgCol.fnColumnRenderer = me.columnRenderer;
						arrCols.push( cfgCol );
					}
				}
				return arrCols;
			},
			columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
			{
				var strRetValue = "";
				if( colId === 'col_copyTo' )
				{
					if( value > 0 )
					{
						strRetValue = '<a class="underlined cursor_pointer" onclick="showClientPopup(\''
							+ record.get( 'profileId' ) + '\')">' + value + '</a>';
					}
					else
					{
						strRetValue = value;
					}
				}
				else
				{
					strRetValue = value;
				}
				return strRetValue;
			},

			createGroupActionColumn : function()
			{
				var me = this;
				var objActionCol =
				{
					colType : 'actioncontent',
					colId : 'groupaction',
					width : 130,
					align : 'right',
					locked : true,
					items :
					[
						{
							itemId : 'accept',
							//itemCls : 'grid-row-text-icon icon-auth-text',
							text : getLabel( 'auth', 'Approve' ),
							hidden : isHidden( 'approvalRequired' ),
							maskPosition : 1
						},
						{
							itemId : 'reject',
							//itemCls : 'grid-row-text-icon icon-reject-text',
							text : getLabel( 'reject', 'Reject' ),
							hidden : isHidden( 'approvalRequired' ),
							maskPosition : 2
						}
					],
					moreMenu :
					{
						fnMoreMenuVisibilityHandler : function( store, record, jsonData, itmId, menu )
						{
							return me.isRowMoreMenuVisible( store, record, jsonData, itmId, menu );
						},
						fnMoreMenuClickHandler : function( tableView, rowIndex, columnIndex, btn, event, record )
						{
							me.handleRowMoreMenuClick( tableView, rowIndex, columnIndex, btn, event, record );
						},
						items :
						[
							{
								itemId : 'discard',
								// itemCls : 'grid-row-text-icon
								// icon-discard-text',
								itemLabel : getLabel( 'discard', 'Discard' ),
								maskPosition : 3
							}, {
								itemId : 'btnClone',
								itemCls : 'grid-row-action-icon icon-clone',
								itemLabel : getLabel('lblclone',
										'Copied Record'),
								maskPosition : 6
							}
						]
					}
				};
				return objActionCol;
			},

			createSiGroupActionColumn : function()
			{
				var me = this;
				var objActionCol =
				{
					colType : 'actioncontent',
					colId : 'groupaction',
					width : 120,
					align : 'right',
					locked : true,
					items :
					[
						{
							itemId : 'accept',
							itemCls : 'grid-row-text-icon icon-auth-text',
							itemLabel : getLabel( 'auth', 'Auth' ),
							hidden : isHidden( 'approvalRequired' ),
							maskPosition : 1
						},
						{
							itemId : 'reject',
							itemCls : 'grid-row-text-icon icon-reject-text',
							itemLabel : getLabel( 'reject', 'Reject' ),
							hidden : isHidden( 'approvalRequired' ),
							maskPosition : 2
						}
					],
					moreMenu :
					{
						fnMoreMenuVisibilityHandler : function( store, record, jsonData, itmId, menu )
						{
							return me.isRowMoreMenuVisible( store, record, jsonData, itmId, menu );
						},
						fnMoreMenuClickHandler : function( tableView, rowIndex, columnIndex, btn, event, record )
						{						
							me.handleRowMoreMenuClick( tableView, rowIndex, columnIndex, btn, event, record );
						},
						items :
						[
							{
								itemId : 'discard',
								// itemCls : 'grid-row-text-icon
								// icon-discard-text',
								itemLabel : getLabel( 'discard', 'Discard' ),
								maskPosition : 3
							},
							{
								itemId : 'enable',
								// itemCls : 'grid-row-text-icon
								// icon-enable-text',
								itemLabel : getLabel( 'enable', 'Enable' ),
								maskPosition : 6
							},
							{
								itemId : 'disable',
								// itemCls : 'grid-row-text-icon
								// icon-disable-text',
								itemLabel : getLabel( 'disable', 'Disable' ),
								maskPosition : 7
							},
							{
								itemId : 'btnEdit',
								// itemCls : 'grid-row-text-icon
								itemCls : 'grid-row-action-icon icon-edit',
								toolTip : getLabel('editToolTip', 'Edit'),
								maskPosition : 8
							}
						]
					}
				};
				return objActionCol;
			},

			createActionColumn : function()
			{
				var me = this;
				var objActionCol =
				{
					colType : 'actioncontent',
					colId : 'action',
					width : 80,
					align : 'center',
					locked : true,
					items :
					[
						{
							itemId : 'btnHistory',
							itemCls : 'grid-row-action-icon icon-history',
							toolTip : getLabel( 'historyToolTip', 'View History' ),
							maskPosition : 4
						},
						{
							itemId : 'btnView',
							itemCls : 'grid-row-action-icon icon-view',
							toolTip : getLabel( 'viewToolTip', 'View Record' ),
							maskPosition : 5
						}
					]
				};
				return objActionCol;
			},

			handleRowMoreMenuClick : function( tableView, rowIndex, columnIndex, btn, event, record )
			{
				var me = this;
				var menu = btn.menu;
				var arrMenuItems = null;
				var blnRetValue = true;
				var store = tableView.store;
				var jsonData = store.proxy.reader.jsonData;

				btn.menu.dataParams =
				{
					'record' : record,
					'rowIndex' : rowIndex,
					'columnIndex' : columnIndex,
					'view' : tableView
				};
				if( !Ext.isEmpty( menu.items ) && !Ext.isEmpty( menu.items.items ) )
					arrMenuItems = menu.items.items;
				if( !Ext.isEmpty( arrMenuItems ) )
				{
					for( var a = 0 ; a < arrMenuItems.length ; a++ )
					{
						blnRetValue = me.isRowIconVisible( store, record, jsonData, null,
							arrMenuItems[ a ].maskPosition );
						arrMenuItems[ a ].setVisible( blnRetValue );
					}
				}
				menu.showAt( event.xy[ 0 ] + 5, event.xy[ 1 ] + 5 );
			},
			setInfoTooltip : function()
			{
				var me = this;
				var infotip = Ext.create( 'Ext.tip.ToolTip',
				{
					target : 'imgFilterInfoGridView',
					listeners :
					{
						// Change content dynamically depending on which element
						// triggered the show.
						beforeshow : function( tip )
						{
							var loanCenterTypeVal = '';
							var dateFilter = me.dateFilterLabel;
							var client = '';
							if( me.loanCenterTypeVal == 'all' && me.filterApplied == 'ALL' )
							{
								loanCenterTypeVal = 'All';
								me.showAdvFilterCode = null;
							}
							else
							{
								loanCenterTypeVal = me.loanCenterTypeFilterDesc;
							}

							var advfilter = me.showAdvFilterCode;
							if( advfilter == '' || advfilter == null )
							{
								advfilter = getLabel( 'none', 'None' );
							}
							if((me.clientDesc == "" || me.clientDesc == null) && entityType == 1)
								client = 'All Companies'
							else 
							if((me.clientDesc == "" || me.clientDesc == null) && entityType == 0)
								client = 'None'
							else
								client = me.clientDesc;
							tip.update( getLabel('clientName','Client Name')+" : "+client+'<br>'+'Type' + ' : ' + loanCenterTypeVal + '<br/>' + getLabel( 'date', 'Date' )
								+ ' : ' + dateFilter + '<br/>' + getLabel( 'advancedFilter', 'Advanced Filter' ) + ':'
								+ advfilter );
						}
					}
				} );
			},
			toggleSavePrefrenceAction : function( isVisible )
			{
				var me = this;
				var btnPref = me.getBtnSavePreferencesRef();
				if( !Ext.isEmpty( btnPref ) )
					btnPref.setDisabled( !isVisible );

			},
			toggleClearPrefrenceAction : function(isVisible) {
				var me = this;
				var btnPref = me.getBtnClearPreferences();
				if (!Ext.isEmpty(btnPref))
					btnPref.setDisabled(!isVisible);
			},
			updateDateFilterView : function()
			{
				var me = this;
				var dtEntryDate = null;
				if( !Ext.isEmpty( me.dateFilterVal ) )
				{
					me.handleDateChange( me.dateFilterVal );
					if( me.dateFilterVal === '7' )
					{
						if( !Ext.isEmpty( me.dateFilterFromVal ) )
						{
							dtEntryDate = Ext.Date.parse( me.dateFilterFromVal, "Y-m-d" );
							me.getFromDateFieldRef().setValue( dtEntryDate );
						}
						if( !Ext.isEmpty( me.dateFilterToVal ) )
						{
							dtEntryDate = Ext.Date.parse( me.dateFilterToVal, "Y-m-d" );
							me.getToDateFieldRef().setValue( dtEntryDate );
						}
					}
				}

			},

			handleDateChange : function( index )
			{
				var me = this;
				var fromDateLabel = me.getFromDateLabelRef();
				var toDateLabel = me.getToDateLabelRef();
				var objDateParams = me.getDateParam( index );

				if( index == '7' )
				{
				var dtEntryDate = new Date( Ext.Date.parse( dtApplicationDate,
							strExtApplicationDateFormat ));					
							
					me.getDateRangeComponentRef().show();
					me.getFromDateLabelRef().hide();
					me.getToDateLabelRef().hide();
					
					me.getFromDateFieldRef().setValue( dtEntryDate );
					me.getToDateFieldRef().setValue( dtEntryDate );
					me.getFromDateFieldRef().setMinValue(clientFromDate);
					me.getToDateFieldRef().setMinValue(clientFromDate);
				}
				else if( index == '12' )
				{
					me.getDateRangeComponentRef().hide();
					me.getFromDateLabelRef().hide();
					me.getToDateLabelRef().hide();
				}
				else
				{
					me.getDateRangeComponentRef().hide();
					me.getFromDateLabelRef().show();
					me.getToDateLabelRef().show();
				}

				if( !Ext.isEmpty( me.dateFilterLabel ) )
				{
					if( isSiTabSelected == 'Y' )
					{
						me.getRequestDateLabelRef().setText(
							getLabel( 'effectiveDate', 'Effective Date' ) + " (" + me.dateFilterLabel + ")" );
					}
					else
					{
						me.getRequestDateLabelRef().setText(
							getLabel( 'requestDate', 'Request Date' ) + " (" + me.dateFilterLabel + ")" );
					}
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
						// Date Range
						var frmDate = me.getFromDateFieldRef().getValue();
						var toDate = me.getToDateFieldRef().getValue();
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
				if (Ext.Date.parse(fieldValue1, strSqlDateFormat) < clientFromDate) {
					fieldValue1 = Ext.Date.format(clientFromDate, strSqlDateFormat);
				}
				retObj.fieldValue1 = fieldValue1;
				retObj.fieldValue2 = fieldValue2;
				retObj.operator = operator;
				return retObj;
			},
			onLoanCenterInformationViewRender : function()
			{
				var me = this;
				if( isSiTabSelected == 'N' )
				{
					var accSummInfoViewRef = me.getLoanCenterGridInformationViewRef();
					accSummInfoViewRef.createSummaryLowerPanelView();
				//	me.setGridInfoSummary();
				}
			},

			handleSavePreferences : function()
			{
				var me = this;
				me.savePreferences();
			},
			handleClearPreferences : function() {
				var me = this;
				me.toggleSavePrefrenceAction(false);
				me.clearWidgetPreferences();
			},
			savePreferences : function()
			{
				var me = this, objPref = {}, arrCols = null, objCol = null;
				var strUrl = me.urlGridPref;
				var objGroupView = me.getGroupView();
				var grid = objGroupView.getGrid();
				var gridState=grid.getGridState();
				//var arrColPref = new Array();
				var arrPref = new Array();
				//if( !Ext.isEmpty( grid ) )
				//{
				//	arrCols = grid.headerCt.getGridColumns();
					/*for( var j = 0 ; j < arrCols.length ; j++ )
					{
						objCol = arrCols[ j ];
						if( !Ext.isEmpty( objCol ) && !Ext.isEmpty( objCol.itemId )
							&& objCol.itemId.startsWith( 'col_' ) && !Ext.isEmpty( objCol.xtype )
							&& objCol.xtype !== 'actioncolumn' && objCol.itemId !== 'col_textaction' 
							&& objCol.itemId !== 'col_groupaction')
							arrColPref.push(
							{
								colId : objCol.dataIndex,
								colDesc : objCol.text,
								colHidden : objCol.hidden,
								colType : objCol.type
							} );

					}*/
					objPref.pgSize = gridState.pageSize;
					objPref.gridCols = gridState.columns;
					objPref.sortState = gridState.sortState;
					arrPref.push( objPref );
				//}

				if( arrPref )
					Ext.Ajax.request(
					{
						url : strUrl + csrfTokenName + "=" + csrfTokenValue,
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
								if( !Ext.isEmpty( me.getBtnSavePreferencesRef() ) )
									me.getBtnSavePreferencesRef().setDisabled( false );
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
								title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
								msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							} );
						}
					} );
			},
			getPreferencesToSave : function(localSave) {
				var me = this;
				var groupView = me.getGroupView();
				var grid = null;
				var arrCols = null, objCol = null, arrColPref = new Array(), arrPref = [], objFilterPref = null;
				var groupInfo = null, subGroupInfo = null;
				  if(groupView){
					grid=groupView.getGrid()
					var gridState=grid.getGridState();				
					groupInfo = groupView.getGroupInfo() || '{}';
					subGroupInfo = groupView.getSubGroupInfo() || {};
					var colPrefModuleName = (subGroupInfo.groupCode === 'all') ? (groupInfo.groupTypeCode + subGroupInfo.groupCode) : subGroupInfo.groupCode;
					objFilterPref = me.getFilterPreferences();
					arrPref.push({
								"module" : "groupViewFilterPref",
								"jsonPreferences" : objFilterPref
							});
					// TODO : Save Active tab for group by "Advanced Filter" to be
					// discuss
					if (groupInfo.groupTypeCode && subGroupInfo.groupCode
							&& groupInfo.groupTypeCode !== 'ADVFILTER') {
						arrPref.push({
									"module" : "groupByPref",
									"jsonPreferences" : {
										groupCode : groupInfo.groupTypeCode,
										subGroupCode : subGroupInfo.groupCode
									}
								});
						arrPref.push({
									"module" : colPrefModuleName,
									"jsonPreferences" : {
										 'gridCols' : gridState.columns,
										 'pgSize' : gridState.pageSize,
										 'sortState':gridState.sortState
									}
								});
					}else if(groupInfo.groupTypeCode && subGroupInfo.groupCode
							&& groupInfo.groupTypeCode === 'ADVFILTER'){
						arrPref.push({
									"module" : "groupByPref",
									"jsonPreferences" : {
										groupCode : groupInfo.groupTypeCode,
										subGroupCode : 'all'
									}
								});				
						arrPref.push({
									"module" : 'ADVFILTER',
									"jsonPreferences" : {
										 'gridCols' : gridState.columns,
										 'pgSize' : gridState.pageSize,
										 'sortState':gridState.sortState
									}
								});		
					}
				}
				return arrPref;
			},
			getFilterPreferences : function() {
				var me = this;
				//var strUrl = me.urlGridFilterPref;
				var advFilterCode = null;
				var objFilterPref = {};
				var infoPanel = me.getLoanCenterGridInformationViewRef();
				var filterViewCollapsed = (me.getLoanCenterFilterView().getCollapsed() === false) ? false : true; 
				var infoViewCollapsed = infoPanel.down('container[itemId="summInfoShowHideGridView"]').hasCls("icon_expand_summ");
				if( !Ext.isEmpty( me.savePrefAdvFilterCode ) )
				{
					advFilterCode = me.savePrefAdvFilterCode;
				}
				var objQuickFilterPref = {};
				objQuickFilterPref.paymentType = me.loanCenterTypeFilterVal;
				objQuickFilterPref.entryDate = me.dateFilterVal;
				if( me.dateFilterVal === '7' )
				{
					if( !Ext.isEmpty( me.dateFilterFromVal ) && !Ext.isEmpty( me.dateFilterToVal ) )
					{
						objQuickFilterPref.fromEntryDate = me.dateFilterFromVal;
						objQuickFilterPref.toEntryDate = me.dateFilterToVal;
					}
					else
					{
						var strSqlDateFormat = 'Y-m-d';
						var frmDate = me.getFromEntryDate().getValue();
						var toDate = me.getToEntryDate().getValue();
						fieldValue1 = Ext.util.Format.date( frmDate, 'Y-m-d' );
						fieldValue2 = Ext.util.Format.date( toDate, 'Y-m-d' );
						objQuickFilterPref.fromEntryDate = fieldValue1;
						objQuickFilterPref.toEntryDate = fieldValue2;
					}
				}

				objFilterPref.advFilterCode = advFilterCode;
				objFilterPref.quickFilter = objQuickFilterPref;
				objFilterPref.filterSelectedClientCode = me.clientCode; 
				objFilterPref.filterSelectedClientDesc = me.clientDesc;
				objFilterPref.filterPanelCollapsed = filterViewCollapsed;
				objFilterPref.infoPanelCollapsed = infoViewCollapsed;
				return objFilterPref;
			},
			saveFilterPreferences : function()
			{
				var me = this;
				var strUrl = me.urlGridFilterPref;
				var advFilterCode = null;
				var objFilterPref = {};
				var infoPanel = me.getLoanCenterGridInformationViewRef();
				var filterViewCollapsed = (me.getLoanCenterFilterView().getCollapsed() === false) ? false : true; 
				var infoViewCollapsed = infoPanel.down('container[itemId="summInfoShowHideGridView"]').hasCls("icon_expand_summ");
				if( !Ext.isEmpty( me.savePrefAdvFilterCode ) )
				{
					advFilterCode = me.savePrefAdvFilterCode;
				}
				var objQuickFilterPref = {};
				objQuickFilterPref.paymentType = me.loanCenterTypeFilterVal;
				objQuickFilterPref.entryDate = me.dateFilterVal;
				if( me.dateFilterVal === '7' )
				{
					if( !Ext.isEmpty( me.dateFilterFromVal ) && !Ext.isEmpty( me.dateFilterToVal ) )
					{
						objQuickFilterPref.fromEntryDate = me.dateFilterFromVal;
						objQuickFilterPref.toEntryDate = me.dateFilterToVal;
					}
					else
					{
						var strSqlDateFormat = 'Y-m-d';
						var frmDate = me.getFromEntryDate().getValue();
						var toDate = me.getToEntryDate().getValue();
						fieldValue1 = Ext.util.Format.date( frmDate, 'Y-m-d' );
						fieldValue2 = Ext.util.Format.date( toDate, 'Y-m-d' );
						objQuickFilterPref.fromEntryDate = fieldValue1;
						objQuickFilterPref.toEntryDate = fieldValue2;
					}
				}

				objFilterPref.advFilterCode = advFilterCode;
				objFilterPref.quickFilter = objQuickFilterPref;
				objFilterPref.filterSelectedClientCode = me.clientCode; 
				objFilterPref.filterSelectedClientDesc = me.clientDesc;
				objFilterPref.filterPanelCollapsed = filterViewCollapsed;
				objFilterPref.infoPanelCollapsed = infoViewCollapsed;

				if( objFilterPref )
					Ext.Ajax.request(
					{
						url : strUrl + csrfTokenName + "=" + csrfTokenValue,
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
								if( !Ext.isEmpty( me.getBtnSavePreferencesRef() ) )
									me.toggleSavePrefrenceAction( true );
									me.toggleClearPrefrenceAction(false);
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
				var me = this, objPref = {}, arrCols = null, objCol = null,objWdgtPref = null;
				var strUrl = me.commonPrefUrl+"?$clear=true";
				var objGroupView = me.getGroupView();
				var grid = objGroupView.getGrid();
				var arrColPref = new Array();
				var arrPref = new Array();
				if (!Ext.isEmpty(grid)) {
					arrCols = grid.headerCt.getGridColumns();
					for (var j = 0; j < arrCols.length; j++) 
					{
						objCol = arrCols[ j ];
						if( !Ext.isEmpty( objCol ) && !Ext.isEmpty( objCol.itemId )
							&& objCol.itemId.startsWith( 'col_' ) && !Ext.isEmpty( objCol.xtype )
							&& objCol.xtype !== 'actioncolumn' && objCol.itemId !== 'col_textaction' && objCol.dataIndex != null)
							arrColPref.push(
							{
								colId : objCol.dataIndex,
								colHeader : objCol.text,
								hidden : objCol.hidden,
								colType : objCol.type
							} );

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
					'11' : getLabel( 'lastyeartodate', 'Last Year To Date' )
				};

				if( !Ext.isEmpty( objDefaultGridViewPref ) )
				{
					var data = Ext.decode( objDefaultGridViewPref );

					var strDtValue = data.quickFilter.entryDate;
					var strDtFrmValue = data.quickFilter.fromEntryDate;
					var strDtToValue = data.quickFilter.toEntryDate;
					var strPaymentType = data.quickFilter.paymentType;
					if(!Ext.isEmpty(data.filterSelectedClientCode) && data.filterSelectedClientCode !='all'){
						me.clientCode = data.filterSelectedClientCode;
						strClientCode = data.filterSelectedClientCode;
						strClientDescr = data.filterSelectedClientDesc;
					}			
					me.filterCodeValue = data.advFilterCode;		
					filterPanelCollapsed = data.filterPanelCollapsed;
					infoPanelCollapsed = data.infoPanelCollapsed;
					
					if( !Ext.isEmpty( strDtValue ) )
					{
						me.dateFilterLabel = objDateLbl[ strDtValue ];
						me.dateFilterVal = strDtValue;
						if( strDtValue === '7' )
						{
							if( !Ext.isEmpty( strDtFrmValue ) )
								me.dateFilterFromVal = strDtFrmValue;

							if( !Ext.isEmpty( strDtToValue ) )
								me.dateFilterToVal = strDtToValue;
						}
						me.loanCenterTypeFilterVal = !Ext.isEmpty( strPaymentType ) ? strPaymentType : 'all';
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

				if( !Ext.isEmpty( me.loanCenterTypeFilterVal ) && me.loanCenterTypeFilterVal != 'all' )
				{
					arrJsn.push(
					{
						paramName : 'paymentType',
						paramValue1 : me.loanCenterTypeFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}

				me.filterData = arrJsn;
			},
			reloadGridRawData : function()
			{
				var me = this;
				var strUrl = isSiTabSelected == 'Y' ? 'userfilterslist/loanCenterSiAdvFltr.srvc?'
					: 'userfilterslist/loanCenterTxnAdvFltr.srvc?';
				var gridView = me.getAdvFilterGridViewRef();
				Ext.Ajax.request(
				{
					url : strUrl ,
					method : 'GET',
					headers: objHdrCsrfParams,
					success : function( response )
					{
						var decodedJson = Ext.decode( response.responseText );
						var arrJson = new Array();

						if( !Ext.isEmpty( decodedJson.d.filters ) )
						{
							for( i = 0 ; i < decodedJson.d.filters.length ; i++ )
							{
								arrJson.push(
								{
									"filterName" : decodedJson.d.filters[ i ]
								} );
							}
						}
						gridView.loadRawData( arrJson );
						me.addAllSavedFilterCodeToView( decodedJson.d.filters );
					},
					failure : function( response )
					{
						// console.log("Ajax Get data Call Failed");
					}
				} );
			}

		} );
		
	function loanPayDown( yes )
	{
		//GCP.getApplication().fireEvent( 'showLoanCenterLoanRepaymentPopupView', yes );
		//goToPage("loanCenterNew.srvc", "frmMain", "P", "Y", yes);
		if(yes == 'yes')
		strNextDay = 'Y';		
		disable();
	}
	function loanAdvance( yes )
	{
		//GCP.getApplication().fireEvent( 'showLoanCenterLoanDrawdownPopupView', yes );
		//goToPage( 'loanCenterNew.srvc', 'frmMain', 'D', 'Y', yes );
		if(yes == 'yes')
			strNextDay = 'Y';
		advanceDisable();
	}
	function invoicePay( url, record, remark )
	{
		if(url.indexOf("payDown") < 0) {url = url+'&$payDown=N';}
		if(url.indexOf("advance") < 0) {url = url+'&$advance=N';}
		if(url.indexOf("loanInvoice") < 0) {url = url+'&$loanInvoice=N';}
		
		//GCP.getApplication().fireEvent( 'showInvoiceCenterPopupView', url, record, remark );
		$(document).trigger('showInvoiceCenterPopupView',[url, record, remark]);
	}