Ext
	.define(
		'GCP.controller.LoanInvoiceController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'GCP.view.LoanInvoiceGridView'
			],
			views :
			[
				'GCP.view.LoanInvoiceView', 'GCP.view.LoanInvoiceAdvancedFilterPopup',
				'GCP.view.LoanInvoiceViewPayment', 'GCP.view.LoanInvoicePayPayment', 'GCP.view.LoanInvoiceViewInfo'
			],
			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[
				{
					ref : 'loanInvoiceNewViewRef',
					selector : 'loanInvoiceNewViewType'
				},
				{
					ref : 'loanInvoiceNewFilterViewType',
					selector : 'loanInvoiceNewViewType loanInvoiceNewFilterViewType' 
				},
				{
					ref : 'loanInvoiceNewGridViewRef',
					selector : 'loanInvoiceNewViewType loanInvoiceNewGridViewType'
				},
				{
					ref : 'loanInvoiceNewDtlViewRef',
					selector : 'loanInvoiceNewViewType loanInvoiceNewGridViewType panel[itemId="loanInvoiceNewDtlViewItemId"]'
				},
				{
					ref : 'loanInvoiceViewPayDtlRef',
					selector : 'loanInvoiceViewPaymentType panel[itemId="loanInvoiceViewPaymentItemId"]'
				},
				{
					ref : 'loanInvoiceNewGridRef',
					selector : 'loanInvoiceNewViewType loanInvoiceNewGridViewType grid[itemId="gridViewMstItemId"]'
				},
				{
					ref : 'loanInvoiceViewPaymentGridRef',
					selector : 'loanInvoiceViewPaymentType grid[itemId="gridViewPayItemId"]'
				},
				{
					ref : 'matchCriteria',
					selector : 'loanInvoiceNewGridViewType radiogroup[itemId="matchCriteria"]'
				},
				{
					ref : 'searchTxnTextInput',
					selector : 'loanInvoiceNewGridViewType textfield[itemId="searchTxnTextField"]'
				},
				{
					ref : 'actionBarSummDtl',
					selector : 'loanInvoiceNewViewType loanInvoiceNewGridViewType loanInvoiceNewGroupActionBarViewType'
				},
				{
					ref : 'btnSavePreferences',
					selector : 'loanInvoiceNewViewType loanInvoiceNewFilterViewType button[itemId="btnSavePreferences"]'
				},
				{
					ref : 'btnClearPreferences',
					selector : 'loanInvoiceNewViewType loanInvoiceNewFilterViewType button[itemId="btnClearPreferences"]'
				},
				{
					ref : 'fromDateLabel',
					selector : 'loanInvoiceNewViewType loanInvoiceNewFilterViewType label[itemId="dateFilterFrom"]'
				},
				{
					ref : 'toDateLabel',
					selector : 'loanInvoiceNewViewType loanInvoiceNewFilterViewType label[itemId="dateFilterTo"]'
				},
				{
					ref : 'dateLabel',
					selector : 'loanInvoiceNewViewType loanInvoiceNewFilterViewType label[itemId="dateLabel"]'
				},
				{
					ref : 'fromEntryDate',
					selector : 'loanInvoiceNewViewType loanInvoiceNewFilterViewType datefield[itemId="fromDate"]'
				},
				{
					ref : 'toEntryDate',
					selector : 'loanInvoiceNewViewType loanInvoiceNewFilterViewType datefield[itemId="toDate"]'
				},
				{
					ref : 'dateRangeComponent',
					selector : 'loanInvoiceNewViewType loanInvoiceNewFilterViewType container[itemId="dateRangeComponent"]'
				},
				{
					ref : 'loanInvoiceTypeToolBar',
					selector : 'loanInvoiceNewViewType loanInvoiceNewFilterViewType toolbar[itemId="loanInvoiceTypeToolBar"]'
				},
				{
					ref : 'entryDate',
					selector : 'loanInvoiceNewViewType loanInvoiceNewFilterViewType button[itemId="entryDate"]'
				},
				{
					ref : 'advFilterActionToolBar',
					selector : 'loanInvoiceNewViewType loanInvoiceNewFilterViewType toolbar[itemId="advFilterActionToolBar"]'
				},
				{
					ref : 'productActionToolBar',
					selector : 'loanInvoiceNewGridViewType toolbar[itemId="paymentActionToolBar"]'
				},
				{
					ref : 'loanInvoiceNewGridInformationViewRef',
					selector : 'loanInvoiceNewGridInformationViewType'
				},
				{
					ref : 'infoSummaryLowerPanel',
					selector : 'loanInvoiceNewGridInformationViewType panel[itemId="infoSummaryLowerPanel"]'
				},
				{
					ref : 'advanceFilterPopup',
					selector : 'loanInvoiceAdvancedFilterPopupType[itemId="gridViewAdvancedFilter"]'
				},
				{
					ref : 'loanInvoiceNewPaymentRef',
					selector : 'loanInvoiceNewPaymentPopupType[itemId="gridNewPayment"]'
				},
				{
					ref : 'loanInvoiceViewInfoDtlRef',
					selector : 'loanInvoiceViewInfoType[itemId="viewInfoPopupId"] panel[itemId="loanInvoiceViewInfoItemId"]'
				},
				{
					ref : 'loanInvoiceViewInfoRef',
					selector : 'loanInvoiceViewInfoType[itemId="viewInfoPopupId"]'
				},
				{
					ref : 'loanInvoiceViewPaymentRef',
					selector : 'loanInvoiceViewPaymentType[itemId="gridViewPayment"]'
				},
				{
					ref : 'advanceFilterTabPanel',
					selector : 'loanInvoiceAdvancedFilterPopupType[itemId="gridViewAdvancedFilter"] tabpanel[itemId="advancedFilterTab"] '
				},
				{
					ref : 'createNewFilter',
					selector : 'loanInvoiceAdvancedFilterPopupType[itemId="gridViewAdvancedFilter"] loanInvoiceCreateNewAdvFilterType'
				},
				{
					ref : 'advFilterGridView',
					selector : 'loanInvoiceAdvancedFilterPopupType[itemId="gridViewAdvancedFilter"] loanInvoiceSummaryAdvFilterGridViewType'
				},
				{
					ref : 'saveSearchBtn',
					selector : 'loanInvoiceAdvancedFilterPopupType[itemId="gridViewAdvancedFilter"] loanInvoiceCreateNewAdvFilterType button[itemId="saveAndSearchBtn"]'
				},
				{
					ref : 'filterDetailsTab',
					selector : 'loanInvoiceAdvancedFilterPopupType[itemId="gridViewAdvancedFilter"] tabpanel[itemId="advancedFilterTab"] panel[itemId="filterDetailsTab"]'
				},
				{
					ref : 'createNewPayment',
					selector : 'loanInvoiceNewPaymentPopupType[itemId="gridNewPayment"] loanInvoiceNewPaymentType'
				},
				{
					ref : 'loanAccountLabel',
					selector : 'loanInvoiceNewPaymentPopupType loanInvoiceNewPaymentType label[itemId="loanAccountLbl"]'
				},
				{
					ref : 'invoiceLabel',
					selector : 'loanInvoiceNewPaymentPopupType loanInvoiceNewPaymentType label[itemId="invoiceLbl"]'
				},
				{
					ref : 'withHeaderCheckbox',
					selector : 'loanInvoiceNewViewType menuitem[itemId="withHeaderId"]'
				},
				{
					ref : 'loanCenterInvoiceTabRef',
					selector : 'loanInvoiceNewViewType loanInvoiceTitleViewType button[itemId="loanCenterInvoiceTabItemId"]'
				},
				{
				ref : 'groupView',
				selector : 'loanInvoiceNewGridViewType groupView'
				}
			],
			config :
			{
				savePrefAdvFilterCode : null,
				filterCodeValue : null,
				objAdvFilterPopup : null,
				objViewPayPopup : null,
				objNewPayPopup : null,
				objViewInfoPopup : null,
				advFilterCodeApplied : null,
				filterData : [],
				advFilterData : [],
				filterApplied : 'ALL',
				urlGridPref : 'userpreferences/invoiceGridFilter/gridView.srvc?',
				urlGridFilterPref : 'userpreferences/invoiceGridFilter/gridViewFilter.srvc?',
				commonPrefUrl : 'services/userpreferences/invoiceGridFilter.json',
				strGetModulePrefUrl : 'services/userpreferences/invoiceGridFilter/{0}.json',
				showAdvFilterCode : null,
				dateFilterVal : '12',
				dateFilterFromVal : '',
				dateFilterToVal : '',
				dateFilterLabel : getLabel( 'latest', 'Latest' ),
				dateHandler : null,
				clientCode : null,
				clientDesc : '',
				arrSorter:[],
				reportOrderByURL : null,
				strDefaultMask : '000000000000000000'
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
				var tbarSubTotal = null;
				var btnClearPref = me.getBtnClearPreferences();
				me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
				var date = new Date(Ext.Date.parse(dtApplicationDate, strExtApplicationDateFormat));
				clientFromDate = me.dateHandler.getDateBeforeDays(date,filterDays);
				
				if(btnClearPref)
				{
					btnClearPref.setEnabled(false);
				}
				me.objAdvFilterPopup = Ext.create( 'GCP.view.LoanInvoiceAdvancedFilterPopup',
				{
					parent : 'loanInvoiceNewViewType',
					itemId : 'gridViewAdvancedFilter',
					filterPanel :
					{
						xtype : 'loanInvoiceCreateNewAdvFilterType',
						margin : '4 0 0 0',
						callerParent : 'loanInvoiceNewViewType'
					}
				} );

				me.objViewPayPopup = Ext.create( 'GCP.view.LoanInvoiceViewPayment',
				{
					parent : 'loanInvoiceNewViewType',
					itemId : 'gridViewPayment'

				} );
				me.objNewPayPopup = Ext.create( 'GCP.view.LoanInvoicePayPaymentPopup',
				{
					parent : 'loanInvoiceNewViewType',
					itemId : 'gridNewPayment'
				} );

				me.objViewInfoPopup = Ext.create( 'GCP.view.LoanInvoiceViewInfo',
				{
					parent : 'loanInvoiceNewViewType',
					itemId : 'viewInfoPopupId'
				} );

				this.dateHandler = Ext.create( 'Ext.ux.gcp.DateHandler' );
				me.updateFilterConfig();
				me.updateAdvFilterConfig();
				me
					.control(
					{
						'loanInvoiceNewViewType' :
						{
							beforerender : function( panel, opts )
							{
							},
							afterrender : function( panel, opts )
							{
							},
							performReportAction : function( btn, opts )
							{
								me.handleReportAction( btn, opts );
							}
						},
						'loanInvoiceNewGridViewType' :
						{
							render : function( panel )
							{
								//me.handleSmartGridConfig();
//								//me.handleTabAction();
								//me.setGridInfo();
							}
						},

						'loanInvoiceNewViewType loanInvoiceNewFilterViewType button[itemId="newFilter"]' :
						{
							click : function( btn, opts )
							{
								me.advanceFilterPopUp( btn );
							}
						},
						'loanInvoiceAdvancedFilterPopupType[itemId="gridViewAdvancedFilter"] loanInvoiceCreateNewAdvFilterType' :
						{
							handleSearchActionGridView : function( btn )
							{
								me.handleSearchActionGridView( btn );
							},
							handleSaveAndSearchGridAction : function( btn )
							{
								me.handleSaveAndSearchGridAction( btn );
							},
							closeGridViewFilterPopup : function( btn )
							{
								me.closeGridViewFilterPopup( btn );
							}
						},
						'loanInvoiceNewPaymentPopupType[itemId="gridNewPayment"] loanInvoiceNewPaymentType' :
						{
							closeNewPaymentPopup : function( btn )
							{
								me.closeNewPaymentPopup( btn );
							}
						},
						'loanInvoiceViewPaymentType[itemId="gridViewPayment"]' :
						{
							closeViewPayPopup : function( btn )
							{
								me.closeViewPayPopup( btn );
							}
						},
						'loanInvoiceViewInfoType[itemId="viewInfoPopupId"]' :
						{
							closeViewInfoPopup : function( btn )
							{
								me.closeViewInfoPopup( btn );
							}
						},
						'loanInvoiceNewViewType loanInvoiceNewFilterViewType toolbar[itemId="advFilterActionToolBar"]' :
						{
							handleSavedFilterItemClick : me.handleFilterItemClick
						},
						'loanInvoiceAdvancedFilterPopupType[itemId="gridViewAdvancedFilter"] loanInvoiceSummaryAdvFilterGridViewType' :
						{
							orderUpGridEvent : me.orderUpDown,
							deleteGridFilterEvent : me.deleteFilterSet,
							viewGridFilterEvent : me.viewFilterData,
							editGridFilterEvent : me.editFilterData
						},
				'loanInvoiceNewGridViewType groupView' : {
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
				'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
				'gridStateChange' : function(grid) {
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
				}
			},
				/*		'loanInvoiceNewGridViewType smartgrid' :
						{
							render : function( grid )
							{
								me.handleLoadGridData( grid, grid.store.dataUrl, grid.pageSize, 1, 1, grid.store.sorters );
							},
							gridPageChange : me.handleLoadGridData,
							gridSortChange : me.handleLoadGridData,
							gridRowSelectionChange : function( grid, record, recordIndex, records, jsonData )
							{
								me.enableValidActionsForGrid( grid, record, recordIndex, records, jsonData );
							},
							statechange : function(grid) {
								me.toggleSavePrefrenceAction(true);
								me.toggleClearPrefrenceAction(true);
							},
							pagechange : function(pager, current, oldPageNum) {
								me.toggleSavePrefrenceAction(true);
								me.toggleClearPrefrenceAction(true);
							}
						},*/
						'loanInvoiceNewGridViewType textfield[itemId="searchTxnTextField"]' :
						{
							change : function( btn, opts )
							{
								me.searchTrasactionChange();
							}
						},
						'loanInvoiceNewGridViewType radiogroup[itemId="matchCriteria"]' :
						{
							change : function( btn, opts )
							{
								me.searchTrasactionChange();
							}
						},
						'loanInvoiceNewViewType loanInvoiceNewGridViewType toolbar[itemId=loanInvoiceNewGroupActionBarView_summDtlItemId]' :
						{
							performGroupAction : function( btn, opts )
							{
								me.handleGroupActions( btn );
							}
						},
						'loanInvoiceNewViewType loanInvoiceNewFilterViewType' :
						{
							render : function( panel, opts )
							{
								me.setInfoTooltip();
								me.getAllSavedAdvFilterCode( panel );
							},
							expand : function(panel) {
								me.toggleSavePrefrenceAction(true);
								me.toggleClearPrefrenceAction(true);
							},
							collapse : function(panel) {
								me.toggleSavePrefrenceAction(true);
								me.toggleClearPrefrenceAction(true);
							},
							dateChange : function( btn, opts )
							{
								me.dateFilterVal = btn.btnValue;
								me.dateFilterLabel = btn.text;
								me.handleDateChange( btn.btnValue );
								if( btn.btnValue !== '7' )
								{
									me.filterApplied = 'Q';
									me.setDataForFilter();
									me.applyQuickFilter();
									me.toggleSavePrefrenceAction( true );
									me.toggleClearPrefrenceAction(true);
								}
							},
							handleClientChange : function(clientCode, clientDesc){
									me.clientCode = clientCode;
									me.clientDesc = clientDesc;
									me.filterApplied = 'Q';
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
						'loanInvoiceNewViewType loanInvoiceNewFilterViewType toolbar[itemId="dateToolBar"]' :
						{
							afterrender : function( tbar, opts )
							{
								me.updateDateFilterView();
							}
						},
						'loanInvoiceNewViewType loanInvoiceNewFilterViewType button[itemId="goBtn"]' :
						{
							click : function( btn, opts )
							{
								var frmDate = me.getFromEntryDate().getValue();
								var toDate = me.getToEntryDate().getValue();

								if( !Ext.isEmpty( frmDate ) && !Ext.isEmpty( toDate ) )
								{
									var dtParams = me.getDateParam( '7' );
									me.dateFilterFromVal = dtParams.fieldValue1;
									me.dateFilterToVal = dtParams.fieldValue2;
									me.setDataForFilter();
									me.applyQuickFilter();
									me.toggleSavePrefrenceAction( true );
									me.toggleClearPrefrenceAction(true);
								}
							}
						},
						'loanInvoiceNewViewType loanInvoiceNewFilterViewType button[itemId="btnSavePreferences"]' :
						{
							click : function( btn, opts )
							{
								me.toggleSavePrefrenceAction( false );
								me.handleSavePreferences();
								me.toggleClearPrefrenceAction(true);
							}
						},
						'loanInvoiceNewViewType loanInvoiceNewFilterViewType button[itemId="btnClearPreferences"]' :
						{
							click : function( btn, opts )
							{
								me.toggleSavePrefrenceAction( false );
								me.handleClearPreferences();
								me.toggleClearPrefrenceAction(false);
							}
						},
						'loanInvoiceNewViewType loanInvoiceNewGridInformationViewType panel[itemId="loanInvoiceNewSummInfoHeaderBarGridViewItemId"] container[itemId="summInfoShowHideGridView"]' :
						{
							click : function( image )
							{
								var objAccSummInfoBar = me.getInfoSummaryLowerPanel();
								if( image.hasCls( "icon_collapse_summ" ) )
								{
									image.removeCls( "icon_collapse_summ" );
									image.addCls( "icon_expand_summ" );
									objAccSummInfoBar.hide();
								}
								else
								{
									image.removeCls( "icon_expand_summ" );
									image.addCls( "icon_collapse_summ" );
									objAccSummInfoBar.show();
								}
							}
						},
						'loanInvoiceNewGridInformationViewType' :
						{
							render : this.onLoanInvoiceNewInformationViewRender
						}					
					} );
			},
			   	doHandleGroupByChange : function(menu, groupInfo) 
				{
						var me = this;
						if (me.previouGrouByCode === 'ADVFILTER') {
							me.savePrefAdvFilterCode = null;
							me.showAdvFilterCode = null;
							me.filterApplied = 'ALL';
						}
						if (groupInfo && groupInfo.groupTypeCode === 'ADVFILTER') {
							me.previouGrouByCode = groupInfo.groupTypeCode;
						} 
				//			me.previouGrouByCode = null;
				},
			doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,newCard, oldCard) 
			{
					var me = this;
					var objGroupView = me.getGroupView();
					var strModule = '', strUrl = null, args = null, strFilterCode = null;
					groupInfo = groupInfo || {};
					subGroupInfo = subGroupInfo || {};
					if (groupInfo) {
						if (groupInfo.groupTypeCode === 'ADVFILTER') 
						{
						strFilterCode = subGroupInfo.groupCode;
						if (strFilterCode !== 'all') 
							{
								if (!Ext.isEmpty(strFilterCode)) {
									me.savedFilterVal = strFilterCode;
									me.showAdvFilterCode = strFilterCode;
									me.handleFilterItemClick(strFilterCode);
								}
							//	me.toggleSavePrefrenceAction(true);
							} 
						else
							{		
								me.savePrefAdvFilterCode = null;
								me.showAdvFilterCode = null;
								me.filterApplied = 'ALL';
								//objGroupView.reconfigureGrid(null);
								strUrl = Ext.String.format(me.strGetModulePrefUrl, 'ADVFILTER');				
								args = {
									scope : me
								};
								me.getSavedPreferences(strUrl,
										me.postHandleDoHandleGroupTabChange, args);
							}

						}
						else {
							args = {
								scope : me
							};
							var colPrefModuleName = (subGroupInfo.groupCode === 'all') ? (groupInfo.groupTypeCode + 												subGroupInfo.groupCode) : subGroupInfo.groupCode;
							strModule = colPrefModuleName;
							strUrl = Ext.String.format(me.strGetModulePrefUrl, strModule);
							me.getSavedPreferences(strUrl,
									me.postHandleDoHandleGroupTabChange, args);
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
		var objPref = null, gridModel = null, intPgSize = null;
		var colModel = null, arrCols = null;
		objGroupView.reconfigureGrid(gridModel);
	},
			handleTabAction : function()
			{
				var me = this;
				var btn;
				btn = me.getLoanCenterInvoiceTabRef();
				//btn.addCls( 'xn-custom-heighlight' );
			},

			handleSaveAndSearchGridAction : function( btn )
			{
				var me = this;
				var objCreateNewFilterPanel = me.getCreateNewFilter();
				if( me.filterCodeValue === null )
				{
					var FilterCode = objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' );
					var FilterCodeVal = FilterCode.getValue();
				}
				else
				{
					var FilterCodeVal = me.filterCodeValue;
				}

				var callBack = this.postDoSaveAndSearch;
				if( Ext.isEmpty( FilterCodeVal ) )
				{
					var errorlabel = objCreateNewFilterPanel.down( 'label[itemId="errorLabel"]' );
					errorlabel.setText( getLabel( 'filternameMsg', 'Please Enter Filter Name' ) );
					errorlabel.show();
				}
				else
				{
					me.postSaveFilterRequest( FilterCodeVal, callBack );
				}
			},
			closeGridViewFilterPopup : function( btn )
			{
				var me = this;
				me.getAdvanceFilterPopup().close();
			},
			closeViewPayPopup : function( btn )
			{
				var me = this;
				me.getLoanInvoiceViewPaymentRef().close();
			},
			closeViewInfoPopup : function( btn )
			{
				var me = this;
				me.getLoanInvoiceViewInfoRef().close();
			},
			closeNewPaymentPopup : function( btn )
			{
				var me = this;
				me.getLoanInvoiceNewPaymentRef().close();
			},
			postSaveFilterRequest : function( FilterCodeVal, fncallBack )
			{
				var me = this;
				var strUrl = 'userfilters/invoiceGridFilter/{0}.srvc?';
				strUrl = Ext.String.format( strUrl, FilterCodeVal );
				var objJson;
				var objOfCreateNewFilter = me.getCreateNewFilter();
				objJson = objOfCreateNewFilter.getAdvancedFilterValueJson( FilterCodeVal, objOfCreateNewFilter );
				Ext.Ajax.request(
				{
					url : strUrl + csrfTokenName + "=" + csrfTokenValue,
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
							title = getLabel( 'filterPopupTitle', 'Message' );
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
							// objFilterCode.setValue(filterCode);
							// me.setAdvancedFilterTitle(filterCode);
							fncallBack.call( me );
							me.reloadGridRawData();
						}
					},
					failure : function()
					{
						var errMsg = "";
						Ext.MessageBox.show(
						{
							title : getLabel( 'filterPopupTitle', 'Error' ),
							msg : getLabel( 'filterPopupMsg', 'Error while fetching data..!' ),
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
				me.filterApplied = 'A';
				me.setDataForFilter();
				me.getGroupView().refreshData();
				me.getAllSavedAdvTooBarCode();
				me.closeGridViewFilterPopup();
				
			//	var grid = me.getLoanInvoiceNewGridRef();
				// TODO : Currently both filters are in sync
			/*	if( !Ext.isEmpty( grid ) )
				{
					var strDataUrl = grid.store.dataUrl;
					var store = grid.store;
					var strUrl = grid.generateUrl( strDataUrl, grid.pageSize, 1, 1, store.sorters );
					strUrl = strUrl + me.getFilterUrl() + "&" + csrfTokenName + "=" + csrfTokenValue;
					me.getLoanInvoiceNewGridRef().setLoading( true );
					grid.loadGridData( strUrl, me.handleAfterGridDataLoad, null );
				}
				me.getAllSavedAdvTooBarCode();
				me.closeGridViewFilterPopup();*/
			},
			handleAfterGridDataLoad : function( grid, jsonData )
			{
				var me = grid.ownerCt;
				me.setLoading( false );
			},
			setDataForFilter : function()
			{
				var me = this;
			//	me.getSearchTxnTextInput().setValue( '' );
				if( this.filterApplied === 'Q' || this.filterApplied === 'ALL' )
				{
					if( this.filterApplied === 'ALL' )
					{
						var str = "allType";
					}
					this.filterData = this.getQuickFilterQueryJson();
				}
				else if( this.filterApplied === 'A' )
				{
					var objOfCreateNewFilter = this.getCreateNewFilter();
					var objJson = objOfCreateNewFilter.getAdvancedFilterQueryJson( objOfCreateNewFilter );
					this.advFilterData = objJson;
					var filterCode = objOfCreateNewFilter.down( 'textfield[itemId="filterCode"]' ).getValue();
					this.advFilterCodeApplied = filterCode;
				}
			},
			getQuickFilterQueryJson : function()
			{
				var me = this;
				var jsonArray = [];
				var index = me.dateFilterVal;
				var objDateParams = me.getDateParam( index );
				if( index != '12' )
				{
					jsonArray.push(
					{
						paramName : me.getEntryDate().filterParamName,
						paramValue1 : objDateParams.fieldValue1,
						paramValue2 : objDateParams.fieldValue2,
						operatorValue : objDateParams.operator,
						dataType : 'D'
					} );
				}
				if(me.clientCode != null && !Ext.isEmpty(me.clientCode) && me.clientCode != 'all')
				jsonArray.push(
					{
						paramName : 'clientCode',
						paramValue1 : me.clientCode,
						operatorValue : 'eq',
						dataType : 'S'
					} );
				return jsonArray;
			},
			applyQuickFilter : function()
			{
				var me = this;
				var objGroupView = me.getGroupView();
				var groupInfo = objGroupView.getGroupInfo();
				me.filterApplied = 'Q';
				if (groupInfo && groupInfo.groupTypeCode === 'ADVFILTER') {
					objGroupView.setActiveTab('all');
				} else
					objGroupView.refreshData();
			},
		/*	handleSmartGridConfig : function()
			{
				arrSortState=new Array();
				var me = this;
				var loanInvoiceNewGrid = me.getLoanInvoiceNewGridRef();
				var objConfigMap = me.getLoanInvoiceNewConfiguration();
				var arrCols = new Array();
				var objPref = null, arrColsPref = null, pgSize = 10;
				var data;
				if( Ext.isEmpty( loanInvoiceNewGrid ) )
				{
					if( !Ext.isEmpty( objGridViewPref ) )
					{
						data = Ext.decode( objGridViewPref );
						objPref = data[ 0 ];
						arrColsPref = objPref.gridCols;
						arrSortState=objPref.sortState;
						arrCols = me.getColumns( arrColsPref, objConfigMap.objWidthMap );
						pgSize = objPref.pageSize || 10;;
						me.handleSmartGridLoading( arrCols, objConfigMap.storeModel, pgSize );
					}
					else if( objConfigMap.arrColsPref )
					{
						arrCols = me.getColumns( objConfigMap.arrColsPref, objConfigMap.objWidthMap );
						pgSize = 10;
						me.handleSmartGridLoading( arrCols, objConfigMap.storeModel, pgSize );
					}
				}
				else
				{
					me.handleLoadGridData( grid, grid.store.dataUrl, grid.pageSize, 1, 1, null );
				}
			},
*/
		/*	handleSmartGridLoading : function( arrCols, storeModel, pageSize )
			{
				var me = this;
				var pgSize = pageSize || 10;
				var alertSummaryGrid = null;
				loanInvoiceNewGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'gridViewMstId',
					itemId : 'gridViewMstItemId',
					pageSize : pgSize,
					autoDestroy : true,
					stateful : false,
					showEmptyRow : false,
					hideRowNumbererColumn : true,
					showSummaryRow : true,
					padding : '5 10 10 10',
					rowList :
					[
						10, 25, 50, 100, 200, 500
					],
					minHeight : 140,
					columnModel : arrCols,
					storeModel : storeModel,
					isRowIconVisible : me.isRowIconVisible,
					isRowMoreMenuVisible : me.isRowMoreMenuVisible,
					handleRowMoreMenuClick : me.handleRowMoreMenuClick,

					handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
					{
						me.handleRowIconClick( tableView, rowIndex, columnIndex, btn, event, record );
					},
					handleRowMoreMenuItemClick : function( menu, event )
					{
						var dataParams = menu.ownerCt.dataParams;
						me.handleRowIconClick( dataParams.view, dataParams.rowIndex, dataParams.columnIndex, this,
							event, dataParams.record );
					}
				} );

				/*var loanInvoiceNewDtlView = me.getLoanInvoiceNewDtlViewRef();
				loanInvoiceNewDtlView.add( loanInvoiceNewGrid );
				loanInvoiceNewDtlView.doLayout();* /
			},*/
			handleViewPaySmartGridConfig : function( record )
			{
				var me = this;
				var loanInvoiceViewPayGrid = me.getLoanInvoiceViewPaymentGridRef();
				var objConfigMap = me.getLoanInvoiceViewPaymentConfiguration();
				var arrCols = new Array();
				arrCols = me.getViewPaymentColumns( objConfigMap.arrColsPref, objConfigMap.objWidthMap );
				if( !Ext.isEmpty( loanInvoiceViewPayGrid ) )
					loanInvoiceViewPayGrid.destroy( true );
				me.handleViewPaySmartGridLoading( arrCols, objConfigMap.storeModel, record );
			},
			handleViewPaySmartGridLoading : function( arrCols, storeModel, record )
			{
				var me = this;
				var pgSize = null;
				var alertSummaryGrid = null;
				var invoiceNmbr = record.get( 'invoiceNumber' );
				pgSize = 10;
				loanInvoiceViewPayGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'gridViewPayItemId',
					itemId : 'gridViewPayItemId',
					//height : 200,
					pageSize : pgSize,
					autoDestroy : true,
					stateful : false,
					showEmptyRow : false,
					showSummaryRow : true,
					padding : '5 0 0 0',
					showCheckBoxColumn : false,
					hideRowNumbererColumn : true,
					enableActionMenu : false,
					showPager : true,
					showAllRecords : false,
					rowList :
					[
					 	10, 25, 50, 100, 200, 500
					],
					minHeight : 140,
					columnModel : arrCols,
					storeModel : storeModel,
					isRowIconVisible : me.isRowIconVisible,
					isRowMoreMenuVisible : me.isRowMoreMenuVisible,
					handleRowMoreMenuClick : me.handleRowMoreMenuClick,

					handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
					{
						me.handleRowIconClick( tableView, rowIndex, columnIndex, btn, event, record );
					},
					handleRowMoreMenuItemClick : function( menu, event )
					{
						var dataParams = menu.ownerCt.dataParams;
						me.handleRowIconClick( dataParams.view, dataParams.rowIndex, dataParams.columnIndex, this,
							event, dataParams.record );
					},
					listeners :
					{
						render : function( loanInvoiceViewPayGrid )
						{
							me.handleViewPaymentLoadGridData( loanInvoiceViewPayGrid, invoiceNmbr,loanInvoiceViewPayGrid.store.dataUrl, loanInvoiceViewPayGrid.pageSize, 1, 1, null );
						},
						gridSortChange : function( loanInvoiceViewPayGrid, strDataUrl, intPgSize, intNewPgNo,
							intOldPgNo, jsonSorter, record )
						{
							me.handleViewPaymentLoadGridData( loanInvoiceViewPayGrid, invoiceNmbr,loanInvoiceViewPayGrid.store.dataUrl, loanInvoiceViewPayGrid.pageSize, intNewPgNo, intOldPgNo, jsonSorter );
						},
						gridPageChange : function(loanInvoiceViewPayGrid, strDataUrl, intPgSize, intNewPgNo, 
								intOldPgNo, jsonSorter)
						{	
							me.handleViewPaymentLoadGridData( loanInvoiceViewPayGrid, invoiceNmbr,loanInvoiceViewPayGrid.store.dataUrl, loanInvoiceViewPayGrid.pageSize, intNewPgNo, intOldPgNo, jsonSorter );
						},
						statechange : function(loanInvoiceViewPayGrid) {
							me.toggleSavePrefrenceAction(true);
							me.toggleClearPrefrenceAction(true);
						},
						pagechange : function(pager, current, oldPageNum) {
							me.toggleSavePrefrenceAction(true);
							me.toggleClearPrefrenceAction(true);
						}
					}
				} );

				var loanInvoiceViewPayDtl = me.getLoanInvoiceViewPayDtlRef();
				loanInvoiceViewPayDtl.add( loanInvoiceViewPayGrid );
				loanInvoiceViewPayDtl.doLayout();
				//me.handleViewPaymentLoadGridData( loanInvoiceViewPayGrid, invoiceNmbr, null );
			},
		/*	handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
			{
				var me = this;
				var actionName = btn.itemId;
				if( actionName === 'accept' || actionName === 'reject' || actionName === 'discard'
					|| actionName === 'pay' )
					me.handleGroupActions( btn, record );
				else if( actionName === 'btnHistory' )
				{
					var recHistory = record.get( 'history' );
					if( !Ext.isEmpty( recHistory ) && !Ext.isEmpty( recHistory.__deferred.uri ) )
					{
						me.showHistory( record.get( 'invoiceNumber' ), record.get( 'history' ).__deferred.uri, record
							.get( "identifier" ) );
					}
				}
				else if( actionName === 'btnView' )
				{
					me.viewInfoPopUp( record );
				}
				else if( actionName === 'btnViewPayment' )
				{
					me.viewPaymentPopUp( record );
				}
			},*/
			doHandleRowActions : function(actionName, grid, record,rowIndex) {
					var me = this;				
				if( actionName === 'accept' || actionName === 'reject' || actionName === 'discard'
					|| actionName === 'pay' )
					me.handleGroupActions( actionName, grid, record, 'rowAction' );
				else if( actionName === 'btnHistory' )
				{
					var recHistory = record.get( 'history' );
					if( !Ext.isEmpty( recHistory ) && !Ext.isEmpty( recHistory.__deferred.uri ) )
					{
						me.showHistory( record.get( 'invoiceNumber' ), record.get( 'history' ).__deferred.uri, record
							.get( "identifier" ) );
					}
				}
				else if( actionName === 'btnView' )
				{
					me.viewInfoPopUp( record );
				}
				else if( actionName === 'btnViewPayment' )
				{
					me.viewPaymentPopUp( record );
				}
	},
			submitForm : function( strUrl, record, rowIndex )
			{
				var me = this;
				var viewState = record.data.identifier;
				var updateIndex = rowIndex;
				var form, inputField;
				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, tokenValue ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'txtRecordIndex', rowIndex ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'viewState', viewState ) );
				form.action = strUrl;
				document.body.appendChild( form );
				form.submit();
			},
			showHistory : function( invoiceNumber, url, id )
			{
				/*url = url + '?$invoiceNmbr='+ invoiceNumber;*/
				Ext.create( 'GCP.view.HistoryPopup',
				{
					historyUrl : url + '?'+csrfTokenName+'=' + tokenValue,
					invoiceNumber : invoiceNumber,
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
			  handleReportAction: function( btn, opts )
			{
				var me = this;
				me.downloadReport( btn.itemId );
			},
			downloadReport : function( actionName )
			{
				var me = this;
				var withHeaderFlag = me.getWithHeaderCheckbox().checked;
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

				strExtension = arrExtension[ actionName ];
				strUrl = 'services/loanInvoice/getDynamicReport.' + strExtension;
				strUrl += '?$skip=1';
				var objGroupView = me.getGroupView();
				var strQuickFilterUrl = me.getFilterUrl();
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
			getLoanInvoiceNewConfiguration : function()
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
				objWidthMap =
				{
					"invoiceNumber" : 115,
					"clientId" : 100,
					"accountNumber" : 200,
					"dueDate" : 100,
					"amountDueDesc" : 150,
					"paidAmount" : 150,
					"loanStatus" : 115
				};
				arrColsPref =
				[
					{
						"colId" : "invoiceNumber",
						"colHeader" : getLabel( 'invoiceNumber', 'Invoice Number' )
					},
					{
						"colId" : "clientId",
						"colHeader" : getLabel( 'obligorNumber', 'Obligor ID' )
					},
					{
						"colId" : "accountNumber",
						"colHeader" : getLabel( 'ObligationId', 'Obligation ID' )
					},
					{
						"colId" : "dueDate",
						"colHeader" : getLabel( 'paymentDue', 'Payment Due' )
					},
					{
						"colId" : "amountDueDesc",
						"colHeader" : getLabel( 'obligationPaymentDue', 'Obligation Payment Due' ),
						"colType" : "number"
					},
					{
						"colId" : "paidAmount",
						"colHeader" : getLabel( 'totalInvoiceDue', 'Total Invoice Due' ),
						"colType" : "number"
					},
					{
						"colId" : "loanStatus",
						"colHeader" : getLabel( 'status', 'Status' )
					}
				];

				storeModel =
				{
					fields :
					[
						'invoiceNumber', 'accountNumber', 'totalAmtDue', 'paidAmount', 'noteType', 'dateOfNote',
						'paymentDate', 'loanStatus', 'identifier', '__metadata', 'dueDate', 'amountDue', 'amtPastDue',
						'history', 'routingNumber', 'outStandingSum', 'overDueSum', 'pendingSum', 'totalAmtDueDesc',
						'clientId', 'outStandingCount', 'overDueCount', 'pendingCount', 'obligorNumber', 'interestDue','accountId',
						'feeDue','clientDesc','sellerId','amountDueDesc','interestDueDesc','feeDueDesc','closestDueDateAfter','closestDueDateBefore'
					],
					proxyUrl : 'getLoanInvoiceNewList.srvc',
					rootNode : 'd.invoice',
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
			getLoanInvoiceViewPaymentConfiguration : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;

				objWidthMap =
				{
					"debitAccNo" : 150,
					"requestedAmnt" : 150,
					"requestDate" : 150,
					"makerId" : 150,
					"requestStatusDesc" : 150
				};
				arrColsPref =
				[
					{
						"colId" : "debitAccNo",
						"colHeader" : getLabel( 'PaymentAcct', 'Payment Account Number' )
					},
					{
						"colId" : "requestedAmnt",
						"colHeader" : getLabel( 'amount', 'Amount' ),
						"colType" : "number"
					},
					{
						"colId" : "requestDate",
						"colHeader" : getLabel( 'date', 'Date' )
					},
					{
						"colId" : "makerId",
						"colHeader" : getLabel( 'HistoryMstMaker', 'Maker' )
					},
					{
						"colId" : "requestStatusDesc",
						"colHeader" : getLabel( 'Status', 'Status' )
					}
				];

				storeModel =
				{
					fields :
					[
						'debitAccNo', 'requestedAmnt', 'requestDate', 'makerId', 'requestStatusDesc'
					],
					proxyUrl : 'getLoanInvoiceViewPayList.srvc',
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
			setGridInfo : function( grid )
			{
				var me = this;
				var ObjGroupView=me.getGroupView();
				var grid=ObjGroupView.getGrid();
				var loanInvoiceGridInfo = me.getLoanInvoiceNewGridInformationViewRef();

				var outstandingCountId = loanInvoiceGridInfo
					.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="outstandingCountId"]' );
				var overdueCountId = loanInvoiceGridInfo
					.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="overdueCountId"]' );
				var pendingCountId = loanInvoiceGridInfo
					.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="pendingCountId"]' );
				var outstandingSummaryId = loanInvoiceGridInfo
					.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="outstandingSummaryId"]' );
				var overdueSummaryId = loanInvoiceGridInfo
					.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="overdueSummaryId"]' );
				var pendingSummaryId = loanInvoiceGridInfo
					.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="pendingSummaryId"]' );
			//	var dataStore = loanInvoiceGrid.store;
				var dataStore=grid.getStore();
				dataStore.on( 'load', function( store, records )
				{
					var i = records.length - 1;
					if( i >= 0 )
					{
						outstandingCountId.setText( records[ i ].get( 'outStandingCount' ) );
						overdueCountId.setText( records[ i ].get( 'overDueCount' ) );
						pendingCountId.setText( records[ i ].get( 'pendingCount' ) );
						outstandingSummaryId.setText( records[ i ].get( 'outStandingSum' ) );
						overdueSummaryId.setText(records[ i ].get( 'overDueSum' ) );
						pendingSummaryId.setText( records[ i ].get( 'pendingSum' ) );
					}
					else
					{
						outstandingCountId.setText( "0" );
						overdueCountId.setText( "0" );
						pendingCountId.setText( "0" );
						outstandingSummaryId.setText( "$0.00" );
						overdueSummaryId.setText( "$0.00" );
						pendingSummaryId.setText( "$0.00" );
					}
				} );
			},
			handleLoadGridData : function( groupInfo, subGroupInfo,grid, url, pgSize, newPgNo, oldPgNo, sorter ,filterData)
			{
				var me = this;
				var objGroupView = me.getGroupView();
				var buttonMask = me.strDefaultMask;
				objGroupView.handleGroupActionsVisibility(buttonMask);
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );
				me.setDataForFilter();
				strUrl = strUrl + me.getFilterUrl(subGroupInfo, groupInfo) + "&" + csrfTokenName + "=" + csrfTokenValue;
				
				me.reportOrderByURL = strUrl;
				grid.loadGridData( strUrl, null,null, false );
				me.setGridInfo();
			},
			getFilterUrl : function(subGroupInfo, groupInfo)
			{
				var me = this;
				var strQuickFilterUrl = '', strAdvFilterUrl = '', strUrl = '', isFilterApplied = 'false';
				var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
									? subGroupInfo.groupQuery
									: '';
				if( me.filterApplied === 'ALL' || me.filterApplied === 'Q' )
				{
					strQuickFilterUrl = me.generateUrlWithQuickFilterParams( this );
					if (!Ext.isEmpty(strGroupQuery)) {
						if (!Ext.isEmpty(strQuickFilterUrl))
							strQuickFilterUrl += ' and ' + strGroupQuery;
						else
							strQuickFilterUrl += '&$filter=' + strGroupQuery;
					}
				
					return strQuickFilterUrl;
				}
				else
				{
					/*strQuickFilterUrl = me.generateUrlWithQuickFilterParams( this );
					if( !Ext.isEmpty( strQuickFilterUrl ) )
					{
						strUrl += strQuickFilterUrl;
						isFilterApplied = true;
					}*/
					strAdvFilterUrl = me.generateUrlWithAdvancedFilterParams( me );
					if (!Ext.isEmpty(strGroupQuery)) {
						if (!Ext.isEmpty(strAdvFilterUrl))
							strAdvFilterUrl += ' and ' + strGroupQuery;
						else
							strAdvFilterUrl += '&$filter=' + strGroupQuery;
					}
				
					return strAdvFilterUrl;					
				}
			},
			generateUrlWithQuickFilterParams : function( thisClass )
			{
				var filterData = thisClass.filterData;
				var isFilterApplied = false;
				var strFilter = '&$filter=';
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
				var isFilterApplied = false;
				var isOrderByApplied = false;
				var strFilter = '&$filter=';
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
			generateUrlWithFilterParams : function( thisClass )
			{
				var filterData = thisClass.filterData;
				var isFilterApplied = false;
				var strFilter = '&$filter=';
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
					url : 'userpreferences/invoiceGridFilter/gridViewAdvanceFilter.srvc?' + csrfTokenName + "="
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
				Ext.Ajax.request(
				{
					url : 'userpreferences/invoiceGridFilter/gridViewAdvanceFilter.srvc',
					headers: objHdrCsrfParams,
					method : 'GET',
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
				var advFilterCode = me.advFilterCodeApplied ;
				Ext.Ajax.request(
				{
					url : 'userfilterslist/invoiceGridFilter.srvc',
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
						me.advFilterCodeApplied = advFilterCode ;
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
				Ext.Ajax.request(
				{
					url : 'userfilterslist/invoiceGridFilter.srvc',
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
				var objToolbar = this.getAdvFilterActionToolBar();
				
				if( objToolbar.items && objToolbar.items.length > 0 )
					objToolbar.removeAll();
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
						cls : 'cursor_pointer xn-account-filter-btnmenu',
						text :  '<span class="button_underline">' + getLabel( 'moreText', 'more' ) +  '&nbsp;>>' + '</span>',
						itemId : 'AdvMoreBtn',
						handler : function( btn, opts )
						{
							me.handleMoreAdvFilterSet( btn.itemId );
						}
					} );
					var imgItem = Ext.create( 'Ext.Img',
					{
						src : 'static/images/icons/icon_spacer.gif',
						cls : 'ux_hide-image',
						height : 16,
						padding : '0 3 0 3'
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
					var objTabPanel = me.getAdvanceFilterTabPanel();
					objTabPanel.setActiveTab( 0 );
					var filterDetailsTab = me.getFilterDetailsTab();
					filterDetailsTab.setTitle( getLabel( 'filterDetails', 'Filter Details' ) );
				}
				else
				{
					me.objAdvFilterPopup = Ext.create( 'GCP.view.LoanInvoiceAdvancedFilterPopup' );
					var objTabPanel = me.getAdvanceFilterTabPanel();
					objTabPanel.setActiveTab( 0 );
					me.objAdvFilterPopup.show();
					var filterDetailsTab = me.getFilterDetailsTab();
					filterDetailsTab.setTitle( getLabel( 'filterDetails', 'Filter Details' ) );
				}
			},
			handleFilterItemClick : function( filterCode )
			{
				var me = this;
				var objToolbar = me.getAdvFilterActionToolBar();
				me.filterCodeValue = filterCode;
				objToolbar.items.each( function( item )
				{
					item.removeCls( 'xn-custom-heighlight' );
				} );
				//if(!Ext.isEmpty(btn))
				//	btn.addCls( 'xn-custom-heighlight' );
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
				var objOfCreateNewFilter = me.getCreateNewFilter();
				var objJson;
				var strUrl = 'userfilters/invoiceGridFilter/{0}.srvc';
				strUrl = Ext.String.format( strUrl, filterCode );
				Ext.Ajax.request(
				{
					url : strUrl,
					headers: objHdrCsrfParams,
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
							title : getLabel( 'filterPopupTitle', 'Error' ),
							msg : getLabel( 'filterPopupMsg', 'Error while fetching data..!' ),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						} );
					}
				} );
			},
			populateSavedFilter : function( filterCode, filterData, applyAdvFilter )
			{
				var me = this;

				var objCreateNewFilterPanel = me.getCreateNewFilter();

				for( i = 0 ; i < filterData.filterBy.length ; i++ )
				{
					var fieldName = filterData.filterBy[ i ].field;

					var fieldOper = filterData.filterBy[ i ].operator;

					var fieldVal = filterData.filterBy[ i ].value1;

					if(fieldName === 'filterCode')
					{
						var fieldType = 'textfield';
					}
					else if( fieldName === 'Status' || fieldName === 'InvoiceNumber' || fieldName === 'ObligationIdAct')
					{
						var fieldType = 'combobox';
					}
					else if( fieldName === 'InvoiceDueDate' )
					{
						var fieldType = 'datefield';
					}

					var fieldObj = objCreateNewFilterPanel.down( '' + fieldType + '[itemId="' + fieldName + '"]' );
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
				var objCreateNewFilterPanel = me.getCreateNewFilter();
				var filterDetailsTab = me.getFilterDetailsTab();
				filterDetailsTab.setTitle( getLabel( 'filterDetails', 'Filter Details' ) );

				var saveSearchBtn = me.getSaveSearchBtn();

				if( saveSearchBtn )
				{
					saveSearchBtn.show();
				}
				objCreateNewFilterPanel.resetAllFields( objCreateNewFilterPanel );
				objCreateNewFilterPanel.enableDisableFields( objCreateNewFilterPanel, false );
				objCreateNewFilterPanel.removeReadOnly( objCreateNewFilterPanel, false );
				var record = grid.getStore().getAt( rowIndex );
				var filterCode = record.data.filterName;

				objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).setValue( filterCode );
				objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).setDisabled( true );
				var objTabPanel = me.getAdvanceFilterTabPanel();
				var applyAdvFilter = false;

				me.getSaveSearchBtn().show();

				me.filterCodeValue = filterCode;

				me.getSavedFilterData( filterCode, this.populateSavedFilter, applyAdvFilter );

				objTabPanel.setActiveTab( 1 );

			},
			deleteFilterSet : function( grid, rowIndex )
			{
				var me = this;
				var record = grid.getStore().getAt( rowIndex );
				grid.getStore().remove( record );
				var objFilterName = record.data.filterName;

				if( this.advFilterCodeApplied == record.data.filterName )
				{
					this.advFilterData = [];
					me.filterApplied = 'A';
					me.applyAdvancedFilter();
				}

				me.deleteFilterCodeFromDb( objFilterName );
			},
			deleteFilterCodeFromDb : function( objFilterName )
			{
				var me = this;
				var strURL = 'userfilters/invoiceGridFilter/{0}/remove.srvc?';
				if( !Ext.isEmpty( objFilterName ) )
				{
					var strUrl = strURL + csrfTokenName + '=' + csrfTokenValue;
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
				var objCreateNewFilterPanel = me.getCreateNewFilter();

				var filterDetailsTab = me.getFilterDetailsTab();
				filterDetailsTab.setTitle( getLabel( 'filterDetails', 'Filter Details' ) );

				objCreateNewFilterPanel.resetAllFields( objCreateNewFilterPanel );
				objCreateNewFilterPanel.enableDisableFields( objCreateNewFilterPanel, false );
				objCreateNewFilterPanel.removeReadOnly( objCreateNewFilterPanel, true );
				var record = grid.getStore().getAt( rowIndex );
				var filterCode = record.data.filterName;

				objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).setValue( filterCode );
				objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).setDisabled( true );

				var objTabPanel = me.getAdvanceFilterTabPanel();
				var applyAdvFilter = false;

				me.getSaveSearchBtn().hide();

				me.getSavedFilterData( filterCode, this.populateAndDisableSavedFilter, applyAdvFilter );

				objTabPanel.setActiveTab( 1 );
			},
			populateAndDisableSavedFilter : function( filterCode, filterData, applyAdvFilter )
			{
				var me = this;
				var objCreateNewFilterPanel = me.getCreateNewFilter();
				for( i = 0 ; i < filterData.filterBy.length ; i++ )
				{
					var fieldName = filterData.filterBy[ i ].field;

					var fieldVal = filterData.filterBy[ i ].value1;

					var fieldOper = filterData.filterBy[ i ].operator;

					if(fieldName === 'filterCode')
					{
						var fieldType = 'textfield';
					}
					else if( fieldName === 'Status' || fieldName === 'InvoiceNumber' || fieldName === 'ObligationIdAct')
					{
						var fieldType = 'combobox';
					}
					else if( fieldName === 'InvoiceDueDate' )
					{
						var fieldType = 'datefield';
					}
					var fieldObj = objCreateNewFilterPanel.down( '' + fieldType + '[itemId="' + fieldName + '"]' );

					fieldObj.setValue( fieldVal );

				}
				objCreateNewFilterPanel.down( 'datefield[itemId="InvoiceDueDate"]' ).setReadOnly( true );
				objCreateNewFilterPanel.down( 'textfield[itemId="InvoiceNumber"]' ).setReadOnly( true );
				objCreateNewFilterPanel.down( 'textfield[itemId="ObligationIdAct"]' ).setReadOnly( true );
				objCreateNewFilterPanel.down( 'combobox[itemId="Status"]' ).setReadOnly( true );
				objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).setReadOnly( true );
			},
			advanceFilterPopUp : function( btn )
			{
				var me = this;
				var objCreateNewFilterPanel = me.getCreateNewFilter();
				var filterDetailsTab = me.getFilterDetailsTab();
				filterDetailsTab.setTitle( 'Create New Filter' );

				var saveSearchBtn = me.getSaveSearchBtn();
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
					var objTabPanel = me.getAdvanceFilterTabPanel();
					objTabPanel.setActiveTab( 1 );
				}
				else
				{
					me.objAdvFilterPopup = Ext.create( 'GCP.view.LoanInvoiceAdvancedFilterPopup' );
					var objTabPanel = me.getAdvanceFilterTabPanel();
					objTabPanel.setActiveTab( 1 );
					me.objAdvFilterPopup.show();
				}
			},
			handleViewPaymentLoadGridData : function( grid, invoiceNmbr,url, pgSize, newPgNo, oldPgNo, sorter  )
			{
				var me = this;
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );
				strUrl += '&$argString=' + invoiceNmbr + "&" + csrfTokenName + "=" + csrfTokenValue;
				grid.loadGridData( strUrl, null );
			},
			viewPaymentPopUp : function( record )
			{
				var me = this;
				me.handleViewPaySmartGridConfig( record );
				if( !Ext.isEmpty( me.objViewPayPopup ) )
				{
					me.objViewPayPopup.show();
				}
				else
				{
					me.objViewPayPopup = Ext.create( 'GCP.view.LoanInvoiceViewPayment' );
					me.objViewPayPopup.show();
				}
			},
			viewInfoPopUp : function( record )
			{
				var me = this;
				me.getViewInfoPopupValue( record );
				if( !Ext.isEmpty( me.objViewInfoPopup ) )
				{
					me.objViewInfoPopup.show();
				}
				else
				{
					me.objViewInfoPopup = Ext.create( 'GCP.view.LoanInvoiceViewInfo' );
					me.objViewInfoPopup.show();
				}
			},
			getViewInfoPopupValue : function( record )
			{
				var me = this;
				var boolVal = true;
				var objCreateViewInfoPanel = me.getLoanInvoiceViewInfoDtlRef();

				objCreateViewInfoPanel.down( 'textfield[itemId="ViewLoanAccount"]' ).setValue(
					record.get( 'accountNumber' ) );
				objCreateViewInfoPanel.down( 'textfield[itemId="ViewLoanAccountName"]' ).setValue(
					record.get( 'accountNumber' ) );
				objCreateViewInfoPanel.down( 'textfield[itemId="ViewInvoiceNumber"]' ).setValue(
					record.get( 'invoiceNumber' ) );
				objCreateViewInfoPanel.down( 'textfield[itemId="ViewDueDate"]' ).setValue( record.get( 'dueDate' ) );
				objCreateViewInfoPanel.down( 'textfield[itemId="ViewRouting"]' )
					.setValue( record.get( 'routingNumber' ) );
				objCreateViewInfoPanel.down( 'textfield[itemId="ViewCurrentAmountDue"]' ).setValue( record.get( 'amountDue' ) );
				objCreateViewInfoPanel.down( 'textfield[itemId="ViewPastAmountDue"]' ).setValue(record.get( 'amtPastDue' ) );
				objCreateViewInfoPanel.down( 'textfield[itemId="ViewTotalAmountDue"]' ).setValue(record.get( 'paidAmount' ) );

				objCreateViewInfoPanel.down( 'textfield[itemId="ViewLoanAccount"]' ).setReadOnly( boolVal );
				objCreateViewInfoPanel.down( 'textfield[itemId="ViewLoanAccountName"]' ).setReadOnly( boolVal );
				objCreateViewInfoPanel.down( 'textfield[itemId="ViewInvoiceNumber"]' ).setReadOnly( boolVal );
				objCreateViewInfoPanel.down( 'textfield[itemId="ViewDueDate"]' ).setReadOnly( boolVal );
				objCreateViewInfoPanel.down( 'textfield[itemId="ViewRouting"]' ).setReadOnly( boolVal );
				objCreateViewInfoPanel.down( 'textfield[itemId="ViewCurrentAmountDue"]' ).setReadOnly( boolVal );
				objCreateViewInfoPanel.down( 'textfield[itemId="ViewPastAmountDue"]' ).setReadOnly( boolVal );
				objCreateViewInfoPanel.down( 'textfield[itemId="ViewTotalAmountDue"]' ).setReadOnly( boolVal );
			},
			newPaymentPopUp : function( record )
			{
				var me = this;
				me.getNewPaymentPopupValue( record );
				if( !Ext.isEmpty( me.objNewPayPopup ) )
				{
					me.objNewPayPopup.show();
				}
				else
				{
					me.objNewPayPopup = Ext.create( 'GCP.view.LoanInvoicePayPaymentPopup' );
					me.objNewPayPopup.show();
				}
			},
			getNewPaymentPopupValue : function( record )
			{
				var me = this;
				var objCreateNewPaymentPanel = me.getCreateNewPayment();
				me.getLoanAccountLabel().setText( "Loan A/C :\t\t" + record.get( 'accountNumber' ) );
				me.getInvoiceLabel().setText(
					"Invoice For Installmet/Interest# : " + record.get( 'invoiceNumber' ) + " , Dated :"
						+ record.get( 'dateOfNote' ) + " , Due Date :" + record.get( 'dueDate' ) );
				objCreateNewPaymentPanel.down( 'textfield[itemId="currentAmt"]' ).setValue( record.get( 'amountDue' ) );
				objCreateNewPaymentPanel.down( 'textfield[itemId="pastAmountDue"]' ).setValue(
					record.get( 'amtPastDue' ) );
				objCreateNewPaymentPanel.down( 'textfield[itemId="totalAmount"]' )
					.setValue( record.get( 'totalAmtDue' ) );
				objCreateNewPaymentPanel.down( 'textfield[itemId="accountNumber"]' ).setValue(
					record.get( 'accountNumber' ) );
				objCreateNewPaymentPanel.down( 'textfield[itemId="invoiceNumber"]' ).setValue(
					record.get( 'invoiceNumber' ) );
				objCreateNewPaymentPanel.down( 'textfield[itemId="routingNumber"]' ).setValue(
					record.get( 'routingNumber' ) );
			},
		doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
				objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
						var me = this;
						var objGroupView = me.getGroupView();
						var buttonMask = me.strDefaultMask;
						var blnAuthInstLevel = false;
						var maskArray = new Array(), actionMask = '', objData = null;;

						if (!Ext.isEmpty(jsonData)
								&& !Ext.isEmpty(jsonData.d.__buttonMask))
							buttonMask = jsonData.d.__buttonMask;

						var isSameUser = true;
						var isDisabled = false;
						var isSubmitted = false;
						maskArray.push(buttonMask);
						for (var index = 0; index < arrSelectedRecords.length; index++) {
							objData = arrSelectedRecords[index];
							maskArray.push(objData.get('__metadata').__rightsMap);
							if (objData.raw.makerId === USER) {
								isSameUser = false;
							}
						}
				actionMask = doAndOperation(maskArray, 10);
				me.enableDisableGroupActions(actionMask, isSameUser, isDisabled,
						isSubmitted);
				//objGroupView.handleGroupActionsVisibility(actionMask);
	},
			/*enableValidActionsForGrid : function( grid, record, recordIndex, selectedRecords, jsonData )
			{
				var me = this;
				var buttonMask = '000';
				var maskArray = new Array(), actionMask = '', objData = null;

				if( !Ext.isEmpty( jsonData ) && !Ext.isEmpty( jsonData.d.__buttonMask ) )
				{
					buttonMask = jsonData.d.__buttonMask;
				}
				var isSameUser = true;
				maskArray.push( buttonMask );
				for( var index = 0 ; index < selectedRecords.length ; index++ )
				{
					objData = selectedRecords[ index ];
					maskArray.push( objData.get( '__metadata' ).__rightsMap );
					if( objData.raw.makerId === USER )
					{
						isSameUser = false;
					}
				}
				actionMask = doAndOperation( maskArray, 10 );
				me.enableDisableGroupActions( actionMask, isSameUser );
			},*/
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

				var grid = me.getLoanInvoiceNewGridRef();
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
			handleGroupActions : function( strAction, grid, record,
			strActionType )
			{
				var me = this;
				//var strAction = !Ext.isEmpty( btn.actionName ) ? btn.actionName : btn.itemId;
				var strUrl = Ext.String.format( 'LoanInvoice/{0}.srvc?', strAction );
				strUrl = strUrl + csrfTokenName + "=" + csrfTokenValue;
				if( strAction === 'reject' )
				{
					this.showRejectVerifyPopUp( strAction, strUrl, record );
				}
				else if( strAction === 'pay' )
				{
					payInvoice( record );
				}
				else
				{
					this.preHandleGroupActions( strUrl, '', record );
				}
			},

			showRejectVerifyPopUp : function( strAction, strActionUrl, record )
			{
				var me = this;
				var titleMsg = '', fieldLbl = '';
				if( strAction === 'reject' )
				{
					titleMsg = getLabel( 'rejectRemarkPopUpTitle', 'Please Enter Reject Remark' );
					fieldLbl = getLabel( 'rejectRemarkPopUpFldLbl', 'Reject Remark' );
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
							me.preHandleGroupActions( strActionUrl, text, record );
						}
					}
				} );
			},

			preHandleGroupActions : function( strUrl, remark, record )
			{

				var me = this;
				var grid = this.getLoanInvoiceNewGridRef();
				if( !Ext.isEmpty( grid ) )
				{
					var arrayJson = new Array();
					var records = grid.getSelectedRecords();
					records = ( !Ext.isEmpty( records ) && Ext.isEmpty( record ) ) ? records :
					[
						record
					];
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

					Ext.Ajax.request(
					{
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode( arrayJson ),
						success : function( response )
						{
							// TODO : Action Result handling to be done
							// here
							me.enableDisableGroupActions( '000', true );
							grid.refreshData();
						},
						failure : function()
						{
							var errMsg = "";
							Ext.MessageBox.show(
							{
								title : getLabel( 'filterPopupTitle', 'Error' ),
								msg : getLabel( 'filterPopupMsg', 'Error while fetching data..!' ),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							} );
						}
					} );
				}

			},
			/*isRowIconVisible : function( store, record, jsonData, itmId, maskPosition )
			{
				var maskSize = 11;
				var maskArray = new Array();
				var actionMask = '';
				var rightsMap = record.data.__metadata.__rightsMap;
				var buttonMask = '';
				var retValue = true;
				var bitPosition = '';
				if( !Ext.isEmpty( maskPosition ) )
				{
					bitPosition = parseInt( maskPosition ) - 1;
					maskSize = maskSize;
				}
				if( !Ext.isEmpty( jsonData ) && !Ext.isEmpty( jsonData.d.__buttonMask ) )
					buttonMask = jsonData.d.__buttonMask;
				maskArray.push( buttonMask );
				maskArray.push( rightsMap );
				actionMask = doAndOperation( maskArray, maskSize );

				var isSameUser = true;
				if( record.raw.makerId === USER )
				{
					isSameUser = false;
				}
				if( Ext.isEmpty( bitPosition ) )
					return retValue;
				retValue = isActionEnabled( actionMask, bitPosition );

				if( ( maskPosition === 6 && retValue ) )
				{
					retValue = retValue && isSameUser;
				}
				else if( maskPosition === 7 && retValue )
				{
					retValue = retValue && isSameUser;
				}
				return retValue;
			},*/
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
		/*	enableDisableGroupActions : function( actionMask, isSameUser )
			{
				var actionBar = this.getActionBarSummDtl();
				var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
				if( !Ext.isEmpty( actionBar ) && !Ext.isEmpty( actionBar.items.items ) )
				{
					arrItems = actionBar.items.items;
					Ext.each( arrItems, function( item )
					{
						strBitMapKey = parseInt( item.maskPosition ) - 1;
						if( strBitMapKey )
						{
							blnEnabled = isActionEnabled( actionMask, strBitMapKey );
							if( ( item.maskPosition === 6 && blnEnabled ) )
							{
								blnEnabled = blnEnabled && isSameUser;
							}
							else if( item.maskPosition === 7 && blnEnabled )
							{
								blnEnabled = blnEnabled && isSameUser;
							}
							item.setDisabled( !blnEnabled );
						}
					} );
				}
			},*/
		enableDisableGroupActions : function(actionMask, isSameUser, isDisabled,
					isSubmitted) {
			var me = this;
			var objGroupView = me.getGroupView();
			var actionBar = objGroupView.down('toolbar[itemId="groupActionToolBar"]');
			var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
			if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
				arrItems = actionBar.items.items;
				Ext.each(arrItems, function(item) {
						strBitMapKey = parseInt(item.maskPosition,10) - 1;
						if (strBitMapKey) {
							blnEnabled = isActionEnabled(actionMask,
									strBitMapKey);
							if ((item.maskPosition === 6 && blnEnabled)) {
								blnEnabled = blnEnabled && isSameUser;
							} else if (item.maskPosition === 7 && blnEnabled) {
								blnEnabled = blnEnabled && isSameUser;
							} else if (item.maskPosition === 8 && blnEnabled) {
								blnEnabled = blnEnabled && isDisabled;
							} else if (item.maskPosition === 9 && blnEnabled) {
								blnEnabled = blnEnabled && !isDisabled;
							} else if (item.maskPosition === 10 && blnEnabled) {
								blnEnabled = blnEnabled
										&& (isSubmitted != undefined && !isSubmitted);
							}
							item.setDisabled(!blnEnabled);
						}
					});
		}
	},
			/*getColumns : function( arrColsPref, objWidthMap )
			{
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				arrCols.push( me.createGroupActionColumn() );
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
						if( !Ext.isEmpty( objCol.hidden ) )
						{
							cfgCol.hidden = objCol.hidden;
						}

						if( !Ext.isEmpty( objCol.colType ) )
						{
							cfgCol.colType = objCol.colType;
							if( cfgCol.colType === "number" )
								cfgCol.align = 'right';
						}
						if( objCol.colId === 'invoiceNumber' )
						{
							cfgCol.width = 190;
							cfgCol.fnSummaryRenderer = function( value, summaryData, dataIndex, colId )
							{
								var strRet = '';
								var grid = me.getLoanInvoiceNewGridRef();
								if( !Ext.isEmpty( grid ) && !Ext.isEmpty( grid.store ) )
								{
									var data = grid.store.proxy.reader.jsonData;
									if( data && data.d && data.d.__subTotal )
									{
										strSubTotal = data.d.__subTotal;
									}
								}
								if( null != strSubTotal && strSubTotal != ' ' )
								{
									strRet = getLabel( 'subTotal', 'Sub Total' );
								}
								return strRet;
							}
						}
						if( objCol.colId === 'paidAmount' )
						{
							cfgCol.align = 'right';
							cfgCol.width = 100;
							cfgCol.fnSummaryRenderer = function( value, summaryData, dataIndex, colId )
							{
								var grid = me.getLoanInvoiceNewGridRef();
								if( !Ext.isEmpty( grid ) && !Ext.isEmpty( grid.store ) )
								{
									var data = grid.store.proxy.reader.jsonData;
									if( data && data.d && data.d.__subTotal )
									{
										if( data.d.__subTotal != ' ' )
											strRet = data.d.__subTotal;
									}
								}
								return strRet;
							}
						}
						if( objCol.colId === 'amountDue' )
						{
							cfgCol.align = 'right';
						}
						cfgCol.width = !Ext.isEmpty( objCol.width ) ? objCol.width : 120;
						if(cfgCol.width === 120)
							cfgCol.width = !Ext.isEmpty( objWidthMap[ objCol.colId ] ) ? objWidthMap[ objCol.colId ] : 120;

						cfgCol.fnColumnRenderer = me.columnRenderer;
						arrCols.push( cfgCol );
					}
				}
				return arrCols;
			},*/
			getViewPaymentColumns : function( arrColsPref, objWidthMap )
			{
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				if( !Ext.isEmpty( arrColsPref ) )
				{
					for( var i = 0 ; i < arrColsPref.length ; i++ )
					{
						objCol = arrColsPref[ i ];
						cfgCol = {};
						cfgCol.colHeader = objCol.colHeader;
						cfgCol.colId = objCol.colId;
						if( !Ext.isEmpty( objCol.colType ) )
						{
							cfgCol.colType = objCol.colType;
							if( cfgCol.colType === "number" )
								cfgCol.align = 'right';
						}

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
				strRetValue = value;
				return strRetValue;
			},
			createGroupActionColumn : function()
			{
				var me = this;
				var objActionCol =
				{
					colType : 'actioncontent',
					colId : 'groupaction',
					width : 80,
					align : 'right',
					locked : true,
					items :
					[
						{
							itemId : 'pay',
							text : 'Pay Invoice',
							toolTip : getLabel( 'actionPay', 'Pay Invoice' ),
							maskPosition : 1
						}
					]
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
					align : 'right',
					locked : true,
					sortable : false,
					items :
					[
						{
							itemId : 'btnView',
							itemCls : 'grid-row-action-icon icon-view',
							toolTip : getLabel( 'viewRecordToolTip', 'View Record' ),
							maskPosition : 2
						},
						{
							itemId : 'btnViewPayment',
							itemCls : 'grid-row-action-icon icon-clone',
							itemLabel : getLabel( 'actionViewPayment', 'View Payment' ),
							toolTip : getLabel( 'viewPaymentToolTip', 'View Payment' ),
							maskPosition : 2
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
						// Change content dynamically depending on which
						// element
						// triggered the show.
						beforeshow : function( tip )
						{
							var dateFilter = me.dateFilterLabel;
							var client = '';
							var advfilter = me.showAdvFilterCode;
							if( advfilter == '' || advfilter == null )
							{
								advfilter = getLabel( 'none', 'None' );
							}
							if((me.clientDesc == "" || me.clientDesc == null) && entityType == 0)
								client = 'None';
							else
							if((me.clientDesc == "" || me.clientDesc == null) && entityType == 1)
								client = 'All Companies';
							else
								client = me.clientDesc;
							tip.update(getLabel('clientName','Client Name')+' : '+client+'<br>'+getLabel( 'date', 'Date' ) + ' : ' + dateFilter + '<br/>'
								+ getLabel( 'advancedFilter', 'Advance Filter' ) + ':' + advfilter );
						}
					}
				} );
			},
			toggleSavePrefrenceAction : function( isVisible )
			{
				var me = this;
				var btnPref = me.getBtnSavePreferences();
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
							me.getFromEntryDate().setValue( dtEntryDate );
						}
						if( !Ext.isEmpty( me.dateFilterToVal ) )
						{
							dtEntryDate = Ext.Date.parse( me.dateFilterToVal, "Y-m-d" );
							me.getToEntryDate().setValue( dtEntryDate );
						}
					}
				}

			},
			handleDateChange : function( index )
			{
				var me = this;
				var fromDateLabel = me.getFromDateLabel();
				var toDateLabel = me.getToDateLabel();
				var objDateParams = me.getDateParam( index );

				if( index == '7' )
				{
					
					var dtEntryDate = new Date( Ext.Date.parse( dtApplicationDate,
							strExtApplicationDateFormat ));					
							
					me.getDateRangeComponent().show();
					me.getFromDateLabel().hide();
					me.getToDateLabel().hide();
					
					 
					me.getFromEntryDate().setValue( dtEntryDate );
					me.getToEntryDate().setValue( dtEntryDate );
					me.getFromEntryDate().setMinValue(clientFromDate);
					me.getToEntryDate().setMinValue(clientFromDate);
				}
				else if( index == '12' )
				{
					me.getDateRangeComponent().hide();
					me.getFromDateLabel().hide();
					me.getToDateLabel().hide();
				}
				else
				{
					me.getDateRangeComponent().hide();
					me.getFromDateLabel().show();
					me.getToDateLabel().show();
				}

				if( !Ext.isEmpty( me.dateFilterLabel ) )
				{
					me.getDateLabel().setText(
						getLabel( 'invoiceDate', 'Payment Due' ) + "(" + me.dateFilterLabel + ")" );
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
						var frmDate = me.getFromEntryDate().getValue();
						var toDate = me.getToEntryDate().getValue();
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
			onLoanInvoiceNewInformationViewRender : function()
			{
				var me = this;
				var accSummInfoViewRef = me.getLoanInvoiceNewGridInformationViewRef();
				accSummInfoViewRef.createSummaryLowerPanelView();
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
				var objGroupView=me.getGroupView();
				var grid = objGroupView.getGrid();
				var gridState=grid.getGridState();
				//var arrColPref = new Array();
				var arrPref = new Array();
				/*if( !Ext.isEmpty( grid ) )
				{
					arrCols = grid.headerCt.getGridColumns();
					for( var j = 0 ; j < arrCols.length ; j++ )
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
								colHidden : objCol.hidden
							} );

					}
					objPref.pgSize = grid.pageSize;
					objPref.gridCols = arrColPref;
					arrPref.push( objPref );
				}*/
				
				objPref.pgSize = gridState.pageSize;
				objPref.gridCols = gridState.columns;
				objPref.sortState = gridState.sortState;
				arrPref.push( objPref );
				
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
								title : getLabel( 'filterPopupTitle', 'Error' ),
								msg : getLabel( 'filterPopupMsg', 'Error while fetching data..!' ),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							} );
						}
					} );

			},
			saveFilterPreferences : function()
			{
				var me = this;
				var strUrl = me.urlGridFilterPref;
				var advFilterCode = null;
				var infoPanel = me.getLoanInvoiceNewGridInformationViewRef();
				var objFilterPref = {};
				var filterViewCollapsed = (me.getLoanInvoiceNewFilterViewType().getCollapsed() === false) ? false : true; 
				var infoViewCollapsed = infoPanel.down('container[itemId="summInfoShowHideGridView"]').hasCls("icon_expand_summ");
				if( !Ext.isEmpty( me.savePrefAdvFilterCode ) )
				{
					advFilterCode = me.savePrefAdvFilterCode;
				}
				var objQuickFilterPref = {};
				objQuickFilterPref.entryDate = me.dateFilterVal;
				if( me.dateFilterVal === '7' )
				{
					if( !Ext.isEmpty( me.dateFilterFromVal ) && !Ext.isEmpty( me.dateFilterToVal ) )
					{

						objQuickFilterPref.fromDate = me.dateFilterFromVal;
						objQuickFilterPref.toDate = me.dateFilterToVal;
					}
					else
					{
						var strSqlDateFormat = 'Y-m-d';
						var frmDate = me.getFromEntryDate().getValue();
						var toDate = me.getToEntryDate().getValue();
						fieldValue1 = Ext.util.Format.date( frmDate, 'Y-m-d' );
						fieldValue2 = Ext.util.Format.date( toDate, 'Y-m-d' );
						objQuickFilterPref.fromDate = fieldValue1;
						objQuickFilterPref.toDate = fieldValue2;
					}
				}

				objFilterPref.advFilterCode = advFilterCode;
				objFilterPref.quickFilter = objQuickFilterPref;
				objFilterPref.filterClientSelected = me.clientCode;
				objFilterPref.filterClientDesc = me.clientDesc;
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
								title : getLabel( 'filterPopupTitle', 'Error' ),
								msg : getLabel( 'filterPopupMsg', 'Error while fetching data..!' ),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							} );
						}
					} );
			},
			clearWidgetPreferences : function() {
				var me = this, objPref = {}, arrCols = null, objCol = null,objWdgtPref = null;
				var strUrl = me.commonPrefUrl+"?$clear=true";
				var objGroupView=me.getGroupView();
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
								colHidden : objCol.hidden
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
					var strDtFrmValue = data.quickFilter.fromDate;
					var strDtToValue = data.quickFilter.toDate;
					filterRibbonCollapsed = !Ext.isEmpty(data.filterPanelCollapsed) ? data.filterPanelCollapsed : true;
					infoRibbonCollapsed = !Ext.isEmpty(data.infoPanelCollapsed) ? data.infoPanelCollapsed : true;
					if(!Ext.isEmpty(data.filterClientSelected) && data.filterClientSelected !='all'){
						me.clientCode = data.filterClientSelected;
						me.clientDesc = data.filterClientDesc;
					}					
					me.filterCodeValue = data.advFilterCode;	
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
							paramName : 'dueDate',
							paramValue1 : strVal1,
							paramValue2 : strVal2,
							operatorValue : strOpt,
							dataType : 'D'
						} );
					}

				}

				me.filterData = arrJsn;
				}
			},
			// This function will called only once
			updateAdvFilterConfig : function()
			{
				var me = this;
				if( !Ext.isEmpty( objDefaultGridViewPref ) )
				{
					var data = Ext.decode( objDefaultGridViewPref );
					if( !Ext.isEmpty( data.advFilterCode ) )
					{
						me.showAdvFilterCode = data.advFilterCode;
						me.savePrefAdvFilterCode = data.advFilterCode;
						var strUrl = 'userfilters/invoiceGridFilter/{0}.srvc';
						strUrl = Ext.String.format( strUrl, data.advFilterCode );
						Ext.Ajax.request(
						{
							url : strUrl ,
							headers: objHdrCsrfParams,
							async : false,
							method : 'GET',
							success : function( response )
							{
								var responseData = Ext.decode( response.responseText );
								var applyAdvFilter = false;
								me.populateSavedFilter( data.advFilterCode, responseData, applyAdvFilter );
								var objOfCreateNewFilter = me.getCreateNewFilter();
								var objJson = objOfCreateNewFilter.getAdvancedFilterQueryJson( objOfCreateNewFilter );

								me.advFilterData = objJson;
								me.advFilterCodeApplied = data.advFilterCode;
								me.savePrefAdvFilterCode = '';
								me.filterApplied = 'A';
							},
							failure : function()
							{
								var errMsg = "";
								Ext.MessageBox.show(
								{
									title : getLabel( 'filterPopupTitle', 'Error' ),
									msg : getLabel( 'filterPopupMsg', 'Error while fetching data..!' ),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								} );
							}
						} );
					}
				}
			},
			reloadGridRawData : function()
			{
				var me = this;
				var gridView = me.getAdvFilterGridView();
				Ext.Ajax.request(
				{
					url : 'userfilterslist/invoiceGridFilter.srvc' ,
					headers: objHdrCsrfParams,
					method : 'GET',
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
