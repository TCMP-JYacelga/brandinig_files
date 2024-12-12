/**
 * @class InvestmentCenterController
 * @extends Ext.app.Controller
 * @author Vaidehi
 */
Ext
	.define(
		'GCP.controller.InvestmentCenterController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'GCP.view.InvestmentCenterView', 'GCP.view.AddNewInvestmentPopup', 'GCP.view.AddNewRedemptionPopup',
				'GCP.view.InvestmentCenterAdvancedFilterPopup', 'GCP.view.InvestmentCenterHistoryPopup','Ext.ux.gcp.DateHandler'
			],
			views :
			[
				'GCP.view.InvestmentCenterView'
			],
			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[
				{
					ref : 'investmentCenterView',
					selector : 'investmentCenterView'
				},
				{
					ref : 'investmentCenterGrid',
					selector : 'investmentCenterView investmentCenterGridView grid[itemId="gridViewMstId"]'
				},
				{
					ref : 'investmentCenterDtlView',
					selector : 'investmentCenterView investmentCenterGridView panel[itemId="investmentCenterDtlView"]'
				},
				{
					ref : 'investmentCenterGridView',
					selector : 'investmentCenterView investmentCenterGridView'
				},
				{
					ref : 'matchCriteria',
					selector : 'investmentCenterGridView radiogroup[itemId="matchCriteria"]'
				},
				{
					ref : 'searchTxnTextInput',
					selector : 'investmentCenterGridView textfield[itemId="searchTxnTextField"]'
				},
				{
					ref : 'actionBarSummDtl',
					selector : 'investmentCenterView investmentCenterGridView investmentCenterGroupActionBarView'
				},
				{
					ref : 'btnSavePreferences',
					selector : 'investmentCenterView investmentCenterFilterView button[itemId="btnSavePreferences"]'
				},
				{
					ref : 'btnClearPreferences',
					selector : 'investmentCenterView investmentCenterFilterView button[itemId="btnClearPreferences"]'
				},
				{
					ref : 'requestDate',
					selector : 'investmentCenterView investmentCenterFilterView button[itemId="requestDate"]'
				},
				{
					ref : 'fromDateLabel',
					selector : 'investmentCenterView investmentCenterFilterView label[itemId="dateFilterFrom"]'
				},
				{
					ref : 'toDateLabel',
					selector : 'investmentCenterView investmentCenterFilterView label[itemId="dateFilterTo"]'
				},
				{
					ref : 'dateLabel',
					selector : 'investmentCenterView investmentCenterFilterView label[itemId="dateLabel"]'
				},
				{
					ref : 'fromEntryDate',
					selector : 'investmentCenterView investmentCenterFilterView datefield[itemId="fromDate"]'
				},
				{
					ref : 'toEntryDate',
					selector : 'investmentCenterView investmentCenterFilterView datefield[itemId="toDate"]'
				},
				{
					ref : 'dateRangeComponent',
					selector : 'investmentCenterView investmentCenterFilterView container[itemId="dateRangeComponent"]'
				},
				{
					ref : 'entryDate',
					selector : 'investmentCenterView investmentCenterFilterView button[itemId="entryDate"]'
				},
				{
					ref : 'investmentTypeToolBar',
					selector : 'investmentCenterView investmentCenterFilterView toolbar[itemId="investmentTypeToolBar"]'
				},
				{
					ref : 'investmentStatusToolBar',
					selector : 'investmentCenterView investmentCenterFilterView toolbar[itemId="investmentStatusToolBar"]'
				},
				{
					ref : 'investmentCenterGridInformationView',
					selector : 'investmentCenterGridInformationView'
				},
				{
					ref : 'infoSummaryLowerPanel',
					selector : 'investmentCenterGridInformationView panel[itemId="infoSummaryLowerPanel"]'
				},
				{
					ref : 'addNewInvestmentPopup',
					selector : 'addNewInvestmentPopup'
				},
				{
					ref : 'createNewInvestment',
					selector : 'addNewInvestmentPopup[itemId=newInvestmentPopup] newInvestment[itemId="newInvestmentId"]'
				},
				{
					ref : 'submitInvestmentBtn',
					selector : 'addNewInvestmentPopup[itemId=newInvestmentPopup] button[itemId="submitInvestmentBtn"]'
				},
				{
					ref : 'addNewRedemptionPopup',
					selector : 'addNewRedemptionPopup'
				},
				{
					ref : 'createNewRedemption',
					selector : 'addNewRedemptionPopup[itemId=newRedemptionPopup] newRedemption[itemId="newRedemptionId"]'
				},
				{
					ref : 'submitRedemptionBtn',
					selector : 'addNewRedemptionPopup[itemId=newRedemptionPopup] button[itemId="submitRedemptionBtn"]'
				},
				{
					ref : 'advanceFilterPopup',
					selector : 'investmentCenterAdvancedFilterPopup[itemId="stdViewAdvancedFilter"]'
				},
				{
					ref : 'advanceFilterTabPanel',
					selector : 'investmentCenterAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] tabpanel[itemId="advancedFilterTab"] '
				},
				{
					ref : 'filterDetailsTab',
					selector : 'investmentCenterAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] tabpanel[itemId="advancedFilterTab"] panel[itemId="filterDetailsTab"]'
				},
				{
					ref : 'createNewFilter',
					selector : 'investmentCenterAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] investmentCenterCreateNewAdvFilter[itemId=stdViewAdvFilter]'
				},
				{
					ref : 'advFilterGridView',
					selector : 'investmentCenterAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] investmentCenterAdvFilterGridView'
				},
				{
					ref : 'saveSearchBtn',
					selector : 'investmentCenterAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] investmentCenterCreateNewAdvFilter[itemId=stdViewAdvFilter] button[itemId="saveAndSearchBtn"]'
				},
				{
					ref : 'advFilterActionToolBar',
					selector : 'investmentCenterView investmentCenterFilterView toolbar[itemId="advFilterActionToolBar"]'
				},
				{
					ref : 'withHeaderCheckboxRef',
					selector : 'investmentCenterView menuitem[itemId="withHeaderId"]'
				}

			],
			config :
			{
				selectedInvestmentCenter : 'investments',
				filterData : [],
				copyByClicked : '',
				activeFilter : null,
				showAdvFilterCode : null,
				savePrefAdvFilterCode : null,
				investmentTypeFilterVal : 'all',
				investmentTypeFilterDesc : 'all',
				investmentStatusFilterVal : 'all',
				investmentStatusFilterDesc : 'all',
				filterApplied : 'ALL',
				objAddNewInvestmentPopup : null,
				objAddNewRedemptionPopup : null,
				objAdvFilterPopup : null,
				dateFilterVal : '1',
				dateFilterFromVal : '',
				dateFilterToVal : '',
				dateFilterLabel : getLabel( 'today', 'Today' ),
				urlOfGridViewPref : 'userpreferences/investCenterFilter/investmentCenterViewPref.srvc?',
				urlGridViewFilterPref : 'userpreferences/investCenterFilter/investmentCenterViewFilter.srvc?',
				commonPrefUrl : 'services/userpreferences/investCenterFilter.json',
				dateHandler : null
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
				this.dateHandler = Ext.create( 'Ext.ux.gcp.DateHandler' );
				var btnClearPref = me.getBtnClearPreferences();
				if(btnClearPref)
				{
					btnClearPref.setEnabled(false);
				}
				me.objAddNewInvestmentPopup = Ext.create( 'GCP.view.AddNewInvestmentPopup',
				{
					parent : 'investmentCenterView',
					itemId : 'newInvestmentPopup',
					callerParent : 'investmentCenterView'
				} );

				me.objAddNewRedemptionPopup = Ext.create( 'GCP.view.AddNewRedemptionPopup',
				{
					parent : 'investmentCenterView',
					itemId : 'newRedemptionPopup',
					callerParent : 'investmentCenterView'
				} );
				me.objAdvFilterPopup = Ext.create( 'GCP.view.InvestmentCenterAdvancedFilterPopup',
				{
					parent : 'investmentCenterView',
					itemId : 'stdViewAdvancedFilter',
					filterPanel :
					{
						xtype : 'investmentCenterCreateNewAdvFilter',
						itemId : 'stdViewAdvFilter',
						margin : '4 0 0 0',
						callerParent : 'investmentCenterView'
					}
				} );
				me.updateFilterConfig();
				me.updateAdvFilterConfig();
				me
					.control(
					{
						'investmentCenterView' :
						{
							beforerender : function( panel, opts )
							{
								// me.loadDetailCount();
							},
							afterrender : function( panel, opts )
							{

							},
							performReportAction : function( btn, opts )
							{
								me.handleReportAction( btn, opts );
							}							
						},
						'investmentCenterGridView' :
						{
							render : function( panel )
							{
								me.handleSmartGridConfig();
								me.setGridInfo();

							}
						},

						'investmentCenterGridView smartgrid' :
						{
							render : function( grid )
							{
								me.handleLoadGridData( grid, grid.store.dataUrl, grid.pageSize, 1, 1, null );
							},
							gridPageChange : me.handleLoadGridData,
							gridSortChange : me.handleLoadGridData,
							gridRowSelectionChange : function( grid, record, recordIndex, records, jsonData )
							{
								me.enableValidActionsForGrid( grid, record, recordIndex, records, jsonData );
							}

						},
						'investmentCenterGridView textfield[itemId="searchTxnTextField"]' :
						{
							change : function( btn, opts )
							{
								me.searchTrasactionChange();
							}
						},
						'investmentCenterGridView radiogroup[itemId="matchCriteria"]' :
						{
							change : function( btn, opts )
							{
								me.searchTrasactionChange();
							}
						},
						'investmentCenterView investmentCenterGridView toolbar[itemId=investmentCenterGroupActionBarView_summDtl]' :
						{
							performGroupAction : function( btn, opts )
							{
								me.handleGroupActions( btn );
							}
						},
						'investmentCenterView  button[itemId="investmentRequestId"]' :
						{
							click : function( btn, opts )
							{
								me.addNewRequest( 'Investment' );
							}

						},
						'investmentCenterView  button[itemId="redemptionRequestId"]' :
						{
							click : function( btn, opts )
							{
								me.addNewRequest( 'Redemption' );
							}

						},
						' addNewInvestmentPopup[itemId=newInvestmentPopup] radiogroup[itemId="investmentRadioId"]' :
						{
							change : function( btn, opts )
							{
								var me = this;
								var objCreateInvestmentPanel = me.getCreateNewInvestment();
								objCreateInvestmentPanel.handleInvestment( objCreateInvestmentPanel );
							}
						},
						' addNewInvestmentPopup[itemId=newInvestmentPopup] radiogroup[itemId="purchaseRadioId"]' :
						{
							change : function( btn, opts )
							{
								var me = this;
								var objCreateInvestmentPanel = me.getCreateNewInvestment();
								objCreateInvestmentPanel.handlePurchase( objCreateInvestmentPanel );
							}
						},
						' addNewInvestmentPopup[itemId=newInvestmentPopup] AutoCompleter[itemId="investmentAccNmbr"]' :
						{
							select : function( combo, record, index )
							{
								var me = this;
								var objCreateInvestmentPanel = me.getCreateNewInvestment();
								objCreateInvestmentPanel.handleInvestmentAccNmbr( objCreateInvestmentPanel, combo, record, index );
							}
						},
						' addNewInvestmentPopup[itemId=newInvestmentPopup] AutoCompleter[itemId="fundName"]' :
						{
							select : function( combo, record, index )
							{
								var me = this;
								var objCreateInvestmentPanel = me.getCreateNewInvestment();
								objCreateInvestmentPanel.handleFundCode( objCreateInvestmentPanel, combo, record, index );
							}
						},
						' addNewInvestmentPopup[itemId=newInvestmentPopup] AutoCompleter[itemId="debitAccNmbr"]' :
						{
							select : function( combo, record, index )
							{
								var me = this;
								var objCreateInvestmentPanel = me.getCreateNewInvestment();
								objCreateInvestmentPanel.handleDebitCCY( objCreateInvestmentPanel, combo, record, index );
							}
						},
						' addNewInvestmentPopup[itemId=newInvestmentPopup] button[itemId="cancelInvestmentBtn"]' :
						{
							cancelInvestment : function( btn )
							{
								me.closeInvestmentPopup( btn );
							}
						},
						' addNewRedemptionPopup[itemId=newRedemptionPopup] AutoCompleter[itemId="investmentAccNmbr"]' :
						{
							select : function( combo, record, index )
							{
								var me = this;
								var objCreateRedemptionPanel = me.getCreateNewRedemption();
								objCreateRedemptionPanel.handleInvestmentAccNmbr( objCreateRedemptionPanel, combo, record, index );
							}
						},
						' addNewRedemptionPopup[itemId=newRedemptionPopup] radiogroup[itemId="redemptionRadioId"]' :
						{
							change : function( btn, opts )
							{
								var me = this;
								var objCreateRedemptionPanel = me.getCreateNewRedemption();
								objCreateRedemptionPanel.handleRedemption( objCreateRedemptionPanel );
							}
						},
						' addNewRedemptionPopup[itemId=newRedemptionPopup] AutoCompleter[itemId="debitAccNmbr"]' :
						{
							select : function( combo, record, index )
							{
								var me = this;
								var objCreateRedemptionPanel = me.getCreateNewRedemption();
								objCreateRedemptionPanel.handleDebitCCY( objCreateRedemptionPanel, combo, record, index );
							}
						},
						' addNewRedemptionPopup[itemId=newRedemptionPopup] button[itemId="cancelRedemptionBtn"]' :
						{
							cancleRedemption : function( btn )
							{
								me.closeRedemptionPopup( btn );
							}
						},
						'investmentCenterView investmentCenterFilterView' :
						{
							render : function( panel, opts )
							{
								me.setInfoTooltip();
								me.setDataForFilter();
								me.getAllSavedAdvFilterCode( panel );
							},
							filterType : function( btn, opts )
							{
								me.toggleSavePreferencesAction( true );
								me.handleInvestmentType( btn );
							},
							filterStatus : function( btn, opts )
							{
								me.toggleSavePreferencesAction( true );
								me.handleInvetstmentStatus( btn );
							},
							dateChange : function( btn, opts )
							{
								me.dateFilterVal = btn.btnValue;
								me.dateFilterLabel = btn.text;
								me.handleDateChange( btn.btnValue );
								this.filterApplied = 'Q';
								if( btn.btnValue !== '7' )
								{
									me.setDataForFilter();
									me.applyQuickFilter();
									me.toggleSavePreferencesAction( true );
								}

							}
						},
						'investmentCenterView investmentCenterFilterView toolbar[itemId="dateToolBar"]' :
						{
							afterrender : function( tbar, opts )
							{
								me.updateDateFilterView();
							}
						},
						'investmentCenterView investmentCenterFilterView button[itemId="goBtn"]' :
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
									this.filterApplied = 'Q';
									me.setDataForFilter();
									me.applyQuickFilter();
									me.toggleSavePreferencesAction( true );
									// me.handleProductTypeLoading();
								}
							}
						},
						'investmentCenterView investmentCenterFilterView button[itemId="btnSavePreferences"]' :
						{
							click : function( btn, opts )
							{
								me.toggleSavePreferencesAction( false );
								me.handleSavePreferences();
								me.toggleClearPrefrenceAction(true);
							}
						},
						'investmentCenterView investmentCenterFilterView button[itemId="btnClearPreferences"]' : {
							click : function(btn, opts) {
								me.toggleSavePreferencesAction(false);
								me.handleClearPreferences();
								me.toggleClearPrefrenceAction(false);
							}
						},
						'investmentCenterView investmentCenterFilterView button[itemId="newFilter"]' :
						{
							click : function( btn, opts )
							{
								me.advanceFilterPopUp( btn );
							}
						},
						'investmentCenterView investmentCenterGridInformationView toolbar[itemId="gridInfodateToolBar"]' :
						{
							afterrender : function( tbar, opts )
							{
								me.updateDateFilterView();
							}
						},
						'investmentCenterView investmentCenterGridInformationView panel[itemId="investmentCenterSummInfoHeaderBarGridView"] container[itemId="summInfoShowHideGridView"]' :
						{
							click : function( image )
							{
								var objAccSummInfoBar = me.getInfoSummaryLowerPanel();
								/*
								 * var objAccSummInfoRefStdFil = me
								 * .getInfoSummaryReflectFilterStd();
								 */
								if( image.hasCls( "icon_collapse_summ" ) )
								{
									image.removeCls( "icon_collapse_summ" );
									image.addCls( "icon_expand_summ" );
									objAccSummInfoBar.hide();
									// objAccSummInfoRefStdFil.hide();
								}
								else
								{
									image.removeCls( "icon_expand_summ" );
									image.addCls( "icon_collapse_summ" );
									objAccSummInfoBar.show();
									// objAccSummInfoRefStdFil.show();
								}
							}
						},
						'investmentCenterGridInformationView' :
						{
							render : this.onInvestmentCenterSummaryInformationViewRender
						},
						'investmentCenterAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] investmentCenterCreateNewAdvFilter' :
						{
							handleSearchAction : function( btn )
							{
								me.handleSearchAction( btn );
							},
							handleSaveAndSearchAction : function( btn )
							{
								me.handleSaveAndSearchAction( btn );
							},
							closeFilterPopup : function( btn )
							{
								me.closeFilterPopup( btn );
							},
							filterDateChange : function( btn, opts )
							{
								var objOfCreateNewFilter = me.getCreateNewFilter();
								objOfCreateNewFilter.filterDateChange( btn, opts );
							}
						},
						'investmentCenterAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] investmentCenterAdvFilterGridView' :
						{
							orderUpEvent : me.orderUpDown,
							deleteFilterEvent : me.deleteFilterSet,
							viewFilterEvent : me.viewFilterData,
							editFilterEvent : me.editFilterData
						},
						'investmentCenterView investmentCenterFilterView toolbar[itemId="advFilterActionToolBar"]' :
						{
							handleSavedFilterItemClick : me.handleFilterItemClick

						}

					} );
			},
			closeFilterPopup : function( btn )
			{
				var me = this;
				me.getAdvanceFilterPopup().close();
			},
			handleSearchAction : function( btn )
			{
				var me = this;
				me.doSearchOnly();
			},
			doSearchOnly : function()
			{
				var me = this;
				me.applyAdvancedFilter();
			},
			applyAdvancedFilter : function()
			{
				var me = this;
				me.filterApplied = 'A';
				me.setDataForFilter();
				me.applyFilter();
				me.updateAdvFilterToolbar();
				me.closeFilterPopup();
			},
			handleSaveAndSearchAction : function( btn )
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
					me.getAllSavedAdvFilterCode();
				}
			},
			postDoSaveAndSearch : function()
			{
				var me = this;
				me.doSearchOnly();
			},
			postSaveFilterRequest : function( FilterCodeVal, fncallBack )
			{
				var me = this;
				var strUrl = 'userfilters/investCenterFilter/{0}.srvc?';
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
							title = getLabel( 'investCenterFilterPopupTitle', 'Message' );
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
							// .setValue(filterCode);
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
							title : getLabel( 'investCenterErrorPopUpTitle', 'Error' ),
							msg : getLabel( 'investCenterErrorPopUpMsg', 'Error while fetching data..!' ),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						} );
					}
				} );

			},
			getAllSavedAdvFilterCode : function( panel )
			{
				var me = this;
				Ext.Ajax.request(
				{
					url : 'userfilterslist/investCenterFilter.srvc',
					headers: objHdrCsrfParams,
					method : 'GET',
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

					var toolBarItems = [];
					var item;
					for( var i = 0 ; i < 2 ; i++ )
					{

						item = Ext.create( 'Ext.Button',
						{
							cls : 'cursor_pointer xn-account-filter-btnmenu',
							text : arrFilters[ i ],
							itemId : arrFilters[ i ],
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
						text : '<span class="button_underline">' + getLabel( 'moreText', 'more' ) + '</span>' + '>>',
						itemId : 'AdvMoreBtn',
						handler : function( btn, opts )
						{
							me.handleMoreAdvFilterSet( btn.itemId );
						}
					} );
					toolBarItems.push( '-' );
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
					me.objAdvFilterPopup = Ext.create( 'GCP.view.InvestmentCenterAdvancedFilterPopup' );
					var objTabPanel = me.getAdvanceFilterTabPanel();
					objTabPanel.setActiveTab( 0 );
					me.objAdvFilterPopup.show();
					var filterDetailsTab = me.getFilterDetailsTab();
					filterDetailsTab.setTitle( getLabel( 'filterDetails', 'Filter Details' ) );
				}
			},
			addNewRequest : function( str )
			{
				var me = this;
				if( str == 'Investment' )
				{
					me.objAddNewInvestmentPopup.show();
					me.getSubmitInvestmentBtn().show();
					var objCreateNewInvestmentPanel = me.getCreateNewInvestment()
					objCreateNewInvestmentPanel.resetAllFields( objCreateNewInvestmentPanel );
					objCreateNewInvestmentPanel.down( 'AutoCompleter[itemId="fundName"]' ).hide();
					objCreateNewInvestmentPanel.down( 'textfield[itemId="requestedAmntId"]' ).hide();
				}

				else
					if( str == 'Redemption' )
					{
						me.objAddNewRedemptionPopup.show();
						me.getSubmitRedemptionBtn().show();
						var objCreateNewRedemptionPanel = me.getCreateNewRedemption()
						objCreateNewRedemptionPanel.resetAllFields( objCreateNewRedemptionPanel );
						objCreateNewRedemptionPanel.down( 'textfield[itemId="requestedAmntId"]' ).hide();
					}

			},

			closeInvestmentPopup : function( btn )
			{
				var me = this;
				me.getAddNewInvestmentPopup().close();
			},
			closeRedemptionPopup : function( btn )
			{
				var me = this;
				me.getAddNewRedemptionPopup().close();
			},

			handleInvestmentType : function( btn )
			{
				var me = this;
				me.toggleSavePreferencesAction( true );
				me.getInvestmentTypeToolBar().items.each( function( item )
				{
					item.removeCls( 'xn-custom-heighlight' );
					item.addCls( 'xn-account-filter-btnmenu' );
				} );
				btn.addCls( 'xn-custom-heighlight xn-account-filter-btnmenu' );
				me.investmentTypeFilterVal = btn.code;
				me.investmentTypeFilterDesc = btn.btnDesc;

				if( me.investmentTypeFilterVal === 'all' )
					me.filterApplied = 'ALL';
				else
					me.filterApplied = 'Q';
				me.setDataForFilter();
				me.applyQuickFilter();
			},
			setDataForFilter : function()
			{
				var me = this;
				me.getSearchTxnTextInput().setValue( '' );
				if( this.filterApplied === 'Q' )
				{
					var objToolbar = me.getAdvFilterActionToolBar();

					objToolbar.items.each( function( item )
					{
						item.removeCls( 'xn-custom-heighlight' );
					} );
					this.filterData = this.getQuickFilterQueryJson();
				}
				else
					if( this.filterApplied === 'A' )
					{
						me.getInvestmentTypeToolBar().items.each( function( item )
						{
							item.removeCls( 'xn-custom-heighlight' );
							item.addCls( 'xn-account-filter-btnmenu' );
						} );
						var objOfCreateNewFilter = this.getCreateNewFilter();
						var objJson = objOfCreateNewFilter.getAdvancedFilterQueryJson( objOfCreateNewFilter );
						this.advFilterData = objJson;

						var filterCode = objOfCreateNewFilter.down( 'textfield[itemId="filterCode"]' ).getValue();
						this.advFilterCodeApplied = filterCode;
					}
				if( this.filterApplied === 'ALL' )
				{
					this.advFilterData = [];
					var str = "allInvestmentType";
					if( me.investmentTypeFilterVal == 'P' )
						str = "investmentType";
					else
						if( me.investmentTypeFilterVal == 'R' )
							str = "redemptionType";
						else
							str = "allInvestmentType";
					me.getInvestmentTypeToolBar().items.each( function( item )
					{
						item.removeCls( 'xn-custom-heighlight' );
						item.addCls( 'xn-account-filter-btnmenu' );
						if( str == item.btnId )
							item.addCls( 'xn-custom-heighlight xn-account-filter-btnmenu' );
					} );

					this.filterData = this.getQuickFilterQueryJson();
				}
			},
			getQuickFilterQueryJson : function()
			{
				var me = this;
				var jsonArray = [];
				var index = me.dateFilterVal;
				var investmentTypeFilterVal = me.investmentTypeFilterVal;
				var objDateParams = me.getDateParam( index );
				if(index != '12')
				{
					jsonArray.push(
						{
							paramName : me.getRequestDate().filterParamName,
							paramValue1 : objDateParams.fieldValue1,
							paramValue2 : objDateParams.fieldValue2,
							operatorValue : objDateParams.operator,
							dataType : 'D'
						} );
				}
				if( me.investmentTypeFilterVal != null && me.investmentTypeFilterVal != 'all' )
				{
					jsonArray.push(
					{
						paramName : me.getInvestmentTypeToolBar().filterParamName,
						paramValue1 : me.investmentTypeFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}

				return jsonArray;
			},
			applyQuickFilter : function()
			{

				var me = this;
				var grid = me.getInvestmentCenterGrid();
				me.filterApplied = 'Q';

				if( !Ext.isEmpty( grid ) )
				{
					var strDataUrl = grid.store.dataUrl;
					var store = grid.store;
					var strUrl = grid.generateUrl( strDataUrl, grid.pageSize, 1, 1, store.sorters );
					strUrl = strUrl + me.getFilterUrl() + "&" + csrfTokenName + "=" + csrfTokenValue;
					me.getInvestmentCenterGrid().setLoading( true );
					grid.loadGridData( strUrl, me.handleAfterGridDataLoad, null );
				}
			},
			applyFilter : function()
			{
				var me = this;
				var grid = me.getInvestmentCenterGrid();
				if( !Ext.isEmpty( grid ) )
				{
					var strDataUrl = grid.store.dataUrl;
					var store = grid.store;
					var strUrl = grid.generateUrl( strDataUrl, grid.pageSize, 1, 1, store.sorters );
					strUrl = strUrl + me.getFilterUrl() + "&" + csrfTokenName + "=" + csrfTokenValue;
					me.getInvestmentCenterGrid().setLoading( true );
					grid.loadGridData( strUrl, me.handleAfterGridDataLoad, null );
				}
			},

			handleSmartGridConfig : function()
			{
				var me = this;
				var investmentCenterGrid = me.getInvestmentCenterGrid();
				var objPref = null, arrCols = new Array(), arrColsPref = null, pgSize = null;
				var objConfigMap = me.getInvestmentCenterConfiguration();

				if( Ext.isEmpty( investmentCenterGrid ) )
				{
					if( !Ext.isEmpty( objGridViewPref ) )
					{
						var data = Ext.decode( objGridViewPref );
						objPref = data[ 0 ];
						arrColsPref = objPref.gridCols;
						arrCols = me.getColumns( arrColsPref, objConfigMap.objWidthMap );
						pgSize = !Ext.isEmpty( objPref.pgSize ) ? parseInt( objPref.pgSize,10 ) : 100;
						me.handleSmartGridLoading( arrCols, objConfigMap.storeModel, pgSize );
					}

					else
						if( objConfigMap.arrColsPref )
						{
							arrCols = me.getColumns( objConfigMap.arrColsPref, objConfigMap.objWidthMap );
							pgSize = 100;
							me.handleSmartGridLoading( arrCols, objConfigMap.storeModel, pgSize );
						}

				}
				else
				{
					me.handleLoadGridData( grid, grid.store.dataUrl, grid.pageSize, 1, 1, null );
				}
			},

			handleSmartGridLoading : function( arrCols, storeModel, pgSize )
			{
				var me = this;
				var pgSize = pgSize;
				var investmentCenterGrid = null;
				investmentCenterGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'gridViewMstId',
					padding : '0 10 10 10',
					itemId : 'gridViewMstId',
					pageSize : pgSize,
					autoDestroy : true,
					showCheckBoxColumn : true,
					hideRowNumbererColumn : true,
					stateful : false,
					showEmptyRow : false,
					showSummaryRow : true,
					rowList :
					[
					 	10,25,50,100,200,500
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
						me.handleRowIconClick( dataParams.view, dataParams.rowIndex, dataParams.columnIndex, this, event,
							dataParams.record );
					}
				} );
				var investmentCenterDtlView = me.getInvestmentCenterDtlView();
				investmentCenterDtlView.add( investmentCenterGrid );
				investmentCenterDtlView.doLayout();
			},

			handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
			{
				var me = this;
				var actionName = btn.itemId;
				if( actionName === 'accept' || actionName === 'reject' || actionName === 'discard' )
					me.handleGroupActions( btn, record );
				else
					if( actionName === 'btnHistory' )
					{
						var recHistory = record.get( 'history' );

						if( !Ext.isEmpty( recHistory ) && !Ext.isEmpty( recHistory.__deferred.uri ) )
						{
							me.showHistory( record.get( 'investmentType' ), record.get( 'history' ).__deferred.uri, record
								.get( 'identifier' ) );
						}
					}
					else
						if( actionName === 'btnView' )
						{
							var str = record.get( 'investmentType' );
							if( str == 'P' )
							{
								me.objAddNewInvestmentPopup.show();
								me.getSubmitInvestmentBtn().hide();
								me.PopulateData( record, str );
							}
							else
								if( str == 'R' )
								{
									me.objAddNewRedemptionPopup.show();
									me.getSubmitRedemptionBtn().hide();
									me.PopulateData( record, str );
								}
						}
						else
						{

						}
			},

			PopulateData : function( record, str )
			{
				var me = this;
				if( str == 'P' )
				{
					var objCreateInvestmentPanel = me.getCreateNewInvestment();

					objCreateInvestmentPanel.down( 'radiogroup[itemId="investmentRadioId"]' ).setValue(
					{
						purchaseNewOrFromAccount : record.get( 'purchaseNewOrFromAccount' )
					} );

					objCreateInvestmentPanel.down( 'AutoCompleter[itemId="investmentAccNmbr"]' ).setValue(
						record.get( 'investmentAccNmbr' ) );
					objCreateInvestmentPanel.down( 'AutoCompleter[itemId="fundName"]' ).setValue( record.get( 'fundName' ) );
					objCreateInvestmentPanel.down( 'textfield[itemId="requestReference"]' ).setValue(
						record.get( 'requestReference' ) );

					objCreateInvestmentPanel.down( 'AutoCompleter[itemId="debitAccNmbr"]' )
						.setValue( record.get( 'drcrAccNmbr' ) );
					objCreateInvestmentPanel.down( 'datefield[itemId="paymentDateId"]' ).setValue( record.get( 'scheduledDate' ) );
					if( record.get( 'purchaseType' ) == 'unit' )
					{
						objCreateInvestmentPanel.down( 'textfield[itemId="requestedUnitId"]' ).setValue(
							record.get( 'requestedUnit' ) );
						objCreateInvestmentPanel.down( 'textfield[itemId="requestedAmntId"]' ).hide();
					}

					else
					{
						objCreateInvestmentPanel.down( 'textfield[itemId="requestedAmntId"]' ).setValue(
							'$' + record.get( 'requestedAmnt' ) );
						objCreateInvestmentPanel.down( 'textfield[itemId="requestedUnitId"]' ).hide();
					}

					objCreateInvestmentPanel.down( 'radiogroup[itemId="purchaseRadioId"]' ).setValue(
					{
						purchaseType : record.get( 'purchaseType' )
					} );

					objCreateInvestmentPanel.down( 'radiogroup[itemId="investmentRadioId"]' ).setDisabled( true );
					objCreateInvestmentPanel.down( 'AutoCompleter[itemId="investmentAccNmbr"]' ).setReadOnly( true );
					objCreateInvestmentPanel.down( 'AutoCompleter[itemId="fundName"]' ).setReadOnly( true );
					objCreateInvestmentPanel.down( 'textfield[itemId="requestedUnitId"]' ).setReadOnly( true );
					objCreateInvestmentPanel.down( 'textfield[itemId="requestedAmntId"]' ).setReadOnly( true );
					objCreateInvestmentPanel.down( 'textfield[itemId="requestReference"]' ).setReadOnly( true );
					objCreateInvestmentPanel.down( 'AutoCompleter[itemId="debitAccNmbr"]' ).setReadOnly( true );
					objCreateInvestmentPanel.down( 'datefield[itemId="paymentDateId"]' ).setReadOnly( true );
					objCreateInvestmentPanel.down( 'radiogroup[itemId="purchaseRadioId"]' ).setDisabled( true );
				}
				else
				{
					var objCreateRedemptionPanel = me.getCreateNewRedemption();
					objCreateRedemptionPanel.down( 'AutoCompleter[itemId="investmentAccNmbr"]' ).setValue(
						record.get( 'investmentAccNmbr' ) );
					objCreateRedemptionPanel.down( 'textfield[itemId="requestReference"]' ).setValue(
						record.get( 'requestReference' ) );
					objCreateRedemptionPanel.down( 'AutoCompleter[itemId="debitAccNmbr"]' )
						.setValue( record.get( 'drcrAccNmbr' ) );
					objCreateRedemptionPanel.down( 'datefield[itemId="redemptionDateId"]' ).setValue(
						record.get( 'scheduledDate' ) );
					if( record.get( 'redeemType' ) == 'unit' || record.get( 'redeemType' ) == 'Allunit' )
					{
						objCreateRedemptionPanel.down( 'textfield[itemId="requestedUnitId"]' ).setValue(
							record.get( 'requestedUnit' ) );
						objCreateRedemptionPanel.down( 'textfield[itemId="requestedAmntId"]' ).hide();
					}

					else
					{
						objCreateRedemptionPanel.down( 'textfield[itemId="requestedAmntId"]' ).setValue(
							'$' + record.get( 'requestedAmnt' ) );
						objCreateRedemptionPanel.down( 'textfield[itemId="requestedUnitId"]' ).hide();
					}
					objCreateRedemptionPanel.down( 'radiogroup[itemId="redemptionRadioId"]' ).setValue(
					{
						redeemType : record.get( 'redeemType' )
					} );

					objCreateRedemptionPanel.down( 'AutoCompleter[itemId="investmentAccNmbr"]' ).setReadOnly( true );
					objCreateRedemptionPanel.down( 'textfield[itemId="requestReference"]' ).setReadOnly( true );
					objCreateRedemptionPanel.down( 'AutoCompleter[itemId="debitAccNmbr"]' ).setReadOnly( true );
					objCreateRedemptionPanel.down( 'textfield[itemId="requestedUnitId"]' ).setReadOnly( true );
					objCreateRedemptionPanel.down( 'textfield[itemId="requestedAmntId"]' ).setReadOnly( true );
					objCreateRedemptionPanel.down( 'datefield[itemId="redemptionDateId"]' ).setReadOnly( true );
					objCreateRedemptionPanel.down( 'radiogroup[itemId="redemptionRadioId"]' ).setDisabled( true );
				}

			},

			showHistory : function( str, url, id )
			{
				if( str == 'P' )
					investmentType = 'Investment';
				else
					investmentType = 'Redemption';
				Ext.create( 'GCP.view.InvestmentCenterHistoryPopup',
				{
					historyUrl : url + "?" + csrfTokenName + "=" + csrfTokenValue,
					investmentType : investmentType,
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

			orderUpDown : function( grid, rowIndex, direction )
			{
				var record = grid.getStore().getAt( rowIndex );
				var filtername = record.data.filterName;
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

				// this.sendUpdatedOrederJsonToDb( store ,filtername );
			},
			deleteFilterSet : function( grid, rowIndex )
			{

				var me = this;
				var record = grid.getStore().getAt( rowIndex );
				var filtername = record.data.filterName;
				grid.getStore().remove( record );

				if( this.advFilterCodeApplied == record.data.filterName )
				{
					this.advFilterData = [];
					me.filterApplied = 'A';
					me.applyFilter();
					me.closeFilterPopup();
				}

				var store = grid.getStore();
				me.sendUpdatedOrederJsonToDb( store, filtername );
			},
			sendUpdatedOrederJsonToDb : function( store, filtername )
			{
				var me = this;
				var preferenceArray = [];
				var strUrl;
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
				strUrl = 'userfilters/investCenterFilter/{0}/remove.srvc?';
				strUrl = Ext.String.format( strUrl, filtername );
				Ext.Ajax.request(
				{
					url : strUrl + csrfTokenName + "=" + csrfTokenValue,
					jsonData : objJson,
					method : 'POST',
					async : false,
					success : function( response )
					{
						me.updateAdvFilterToolbar();
					},
					failure : function()
					{
						console.log( "Error Occured - Addition Failed" );

					}

				} );
			},

			updateAdvFilterToolbar : function()
			{
				var me = this;
				Ext.Ajax.request(
				{
					url : 'userfilterslist/investCenterFilter.srvc',
					headers: objHdrCsrfParams,
					method : 'GET',
					success : function( response )
					{
						var responseData = Ext.decode( response.responseText );
						var filter;
						if( typeof responseData != 'object' )
						{
							filter = JSON.parse( responseData.d );
						}
						else
						{
							filter = responseData.d;
						}

						me.addAllSavedFilterCodeToView( filter.filters );

					},
					failure : function()
					{
						console.log( "Error Occured - Addition Failed" );

					}

				} );
			},
			getInvestmentCenterConfiguration : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;

				objWidthMap =
				{
					"requestReference" : 70,
					"fundName" : 100,
					"investmentAccNmbr" : 70,
					"nav" : 50,
					"requestedUnit" : 50,
					"requestedAmnt" : 100,
					"investmentType" : 100,
					"requestDate" : 100,
					"scheduledDate" : 100,
					"requestStatus" : 170
				};
				arrColsPref =
				[
					{
						"colId" : "requestReference",
						"colDesc" : "Reference",
						"colType" : "number"
					},
					{
						"colId" : "fundName",
						"colDesc" : "Fund Name"
					},
					{
						"colId" : "investmentAccNmbr",
						"colDesc" : "Investment Account"
					},
					{
						"colId" : "nav",
						"colDesc" : "NAV",
						"colType" : "number"
					},
					{
						"colId" : "requestedUnit",
						"colDesc" : "Units",
						"colType" : "number"
					},
					{
						"colId" : "requestedAmnt",
						"colDesc" : "Amount",
						"colType" : "number"
					},
					{
						"colId" : "investmentTypeDesc",
						"colDesc" : "Type"
					},
					{
						"colId" : "requestDate",
						"colDesc" : "Request Date"
					},
					{
						"colId" : "scheduledDate",
						"colDesc" : "Instruction Date",
						hidden : true
					},
					{
						"colId" : "requestStateDesc",
						"colDesc" : "Status"
					}
				];

				storeModel =
				{
					fields :
					[
						'history', 'requestReference', 'fundName', 'investmentAccNmbr', 'nav', 'requestedUnit', 'requestedAmnt',
						'investmentType', 'requestDate', 'scheduledDate', 'requestStatus', 'dtlCount', 'requestStateDesc',
						'drcrAccNmbr', 'purchaseType', 'redeemType', 'investmentTypeDesc', 'purchaseNewOrFromAccount',
						'identifier', '__metadata', '__subTotal', 'investmentCount', 'investmentSummary', 'redemptionCount',
						'redemptionSummary'
					],
					proxyUrl : 'investmentsList.srvc',
					rootNode : 'd.investments',
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
				var investmentGrid = me.getInvestmentCenterGrid();
				var investmentGridInfo = me.getInvestmentCenterGridInformationView();
				var investCountId = investmentGridInfo
					.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="investmentCountId"]' );
				var investmentCommaLbl = investmentGridInfo
					.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="investmentCommaLbl"]' );
				var investmentAmtLbl = investmentGridInfo
					.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="investmentAmtLbl"]' );
				var investInfoId = investmentGridInfo
					.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="investmentSummaryId"]' );
				var redemCountId = investmentGridInfo
					.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="redemptionCountId"]' );
				var redemptionCommaLbl = investmentGridInfo
					.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="redemptionCommaLbl"]' );
				var redemptionAmtLbl = investmentGridInfo
					.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="redemptionAmtLbl"]' );
				var redemInfoId = investmentGridInfo
					.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="redemptionSummaryId"]' );
				var dataStore = investmentGrid.store;
				dataStore.on( 'load', function( store, records )
				{
					var i = records.length - 1;
					if( i >= 0 )
					{
						investCount = records[ i ].get( 'investmentCount' );
						investCountId.setText( investCount );
						investmentCommaLbl.setText( "," );
						investmentAmtLbl.setText( "Amt" );
						investInfo = records[ i ].get( 'investmentSummary' );
						investInfoId.setText( investInfo );
						redemCount = records[ i ].get( 'redemptionCount' );
						redemCountId.setText( redemCount );
						redemptionCommaLbl.setText( "," );
						redemptionAmtLbl.setText( "Amt" );
						redemInfo = records[ i ].get( 'redemptionSummary' );
						redemInfoId.setText( redemInfo );
					}
					else
					{
						investCountId.setText( "" );
						investmentCommaLbl.setText( "" );
						investmentAmtLbl.setText( "" );
						investInfoId.setText( "" );
						redemCountId.setText( "" );
						redemptionCommaLbl.setText( "" );
						redemptionAmtLbl.setText( "" );
						redemInfoId.setText( "" );
					}
				} );
			},

			handleLoadGridData : function( grid, url, pgSize, newPgNo, oldPgNo, sorter )
			{
				var me = this;
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );
				me.setDataForFilter();
				strUrl = strUrl + me.getFilterUrl() + "&" + csrfTokenName + "=" + csrfTokenValue;
				grid.loadGridData( strUrl, null );
			},
			getFilterUrl : function()
			{

				var me = this;
				var strQuickFilterUrl = '', strActionStatusUrl = '', strAdvancedFilterUrl = '', strUrl = '', isFilterApplied = false;
				if( me.filterApplied === 'ALL' || me.filterApplied === 'Q' )
				{
					strQuickFilterUrl = me.generateUrlWithQuickFilterParams( me );
					if( !Ext.isEmpty( strQuickFilterUrl ) )
					{
						strUrl = strQuickFilterUrl;
						isFilterApplied = true;
					}
				}
				else
					if( me.filterApplied === 'A' )
					{
						strAdvancedFilterUrl = me.generateUrlWithAdvancedFilterParams( me );
						if( !Ext.isEmpty( strAdvancedFilterUrl ) )
						{
							strUrl = strAdvancedFilterUrl;
							isFilterApplied = true;
						}
					}

				return strUrl;
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
								strTemp = strTemp + filterData[ index ].paramName + ' ' + filterData[ index ].operatorValue + ' '
									+ 'date\'' + filterData[ index ].paramValue1 + '\'' + ' and ' + 'date\''
									+ filterData[ index ].paramValue2 + '\'';
							}
							else
							{
								strTemp = strTemp + filterData[ index ].paramName + ' ' + filterData[ index ].operatorValue + ' '
									+ '\'' + filterData[ index ].paramValue1 + '\'' + ' and ' + '\''
									+ filterData[ index ].paramValue2 + '\'';
							}
							break;
						default:
							// Default opertator is eq
							if( filterData[ index ].dataType === 'D' )
							{
								strTemp = strTemp + filterData[ index ].paramName + ' ' + filterData[ index ].operatorValue + ' '
									+ 'date\'' + filterData[ index ].paramValue1 + '\'';
							}
							else
							{
								strTemp = strTemp + filterData[ index ].paramName + ' ' + filterData[ index ].operatorValue + ' '
									+ '\'' + filterData[ index ].paramValue1 + '\'';
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
									strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator + ' '
										+ 'date\'' + filterData[ index ].value1 + '\'' + ' and ' + 'date\''
										+ filterData[ index ].value2 + '\'';
								}
								else
								{
									strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator + ' '
										+ '\'' + filterData[ index ].value1 + '\'' + ' and ' + '\'' + filterData[ index ].value2
										+ '\'';
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
								strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator + ' ' + '\''
									+ filterData[ index ].value1 + '\'';
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
										strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator + ' '
											+ '\'' + objArray[ i ] + '\'';
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
									strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator + ' '
										+ 'date\'' + filterData[ index ].value1 + '\'';
								}
								else
								{
									strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator + ' '
										+ '\'' + filterData[ index ].value1 + '\'';
								}
								break;
						}
					}
				}
				if( isFilterApplied )
				{
					strFilter = strFilter + strTemp;
				}
				else
					if( isOrderByApplied )
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
				if( displayType && displayType === 4 && strValue && strValue.match( reg ) )
				{
					retValue = true;
				}

				return retValue;

			},

			viewFilterData : function( grid, rowIndex )
			{
				var me = this;
				var objCreateNewFilterPanel = me.getCreateNewFilter();

				var filterDetailsTab = me.getFilterDetailsTab();
				filterDetailsTab.setTitle( getLabel( 'filterDetails', 'Filter Details' ) );

				objCreateNewFilterPanel.resetAllFields( objCreateNewFilterPanel );
				objCreateNewFilterPanel.enableDisableFields( objCreateNewFilterPanel, false );

				var record = grid.getStore().getAt( rowIndex );
				var filterCode = record.data.filterName;
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

					if( fieldName === 'requestReference' )
						var fieldType = 'textfield';

					else
						if( fieldName === 'investmentAccNmbr' || fieldName === 'fundName' )
							var fieldType = 'AutoCompleter';

						else
							if( fieldName === 'requestStatus' || fieldName === 'investmentType' )
								var fieldType = 'combobox';

					var fieldObj = objCreateNewFilterPanel.down( '' + fieldType + '[itemId="' + fieldName + '"]' );

					fieldObj.setValue( fieldVal );

				}
				objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).setValue( filterCode );

				objCreateNewFilterPanel.down( 'textfield[itemId="requestReference"]' ).setReadOnly( true );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="fundName"]' ).setReadOnly( true );
				objCreateNewFilterPanel.down( 'combobox[itemId="requestStatus"]' ).setDisabled( true );
				objCreateNewFilterPanel.down( 'AutoCompleter[itemId="investmentAccNmbr"]' ).setDisabled( true );
				objCreateNewFilterPanel.down( 'combobox[itemId="investmentType"]' ).setDisabled( true );
				objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).setReadOnly( true );

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
			getSavedFilterData : function( filterCode, fnCallback, applyAdvFilter )
			{
				var me = this;
				var objOfCreateNewFilter = me.getCreateNewFilter();
				var objJson;
				var strUrl = 'userfilters/investCenterFilter/{0}.srvc?';

				strUrl = Ext.String.format( strUrl, filterCode );
				Ext.Ajax.request(
				{
					url : strUrl ,
					headers: objHdrCsrfParams,
					method : 'GET',
					success : function( response )
					{
						var responseData = Ext.decode( response.responseText );
						if( typeof responseData != 'object' )
						{
							responseData = JSON.parse( responseData );
						}
						fnCallback.call( me, filterCode, responseData, applyAdvFilter );

					},
					failure : function()
					{
						var errMsg = "";
						Ext.MessageBox.show(
						{
							title : getLabel( 'errorTitle', 'Error' ),
							msg : getLabel( 'investCenterErrorPopUpMsg', 'Error while fetching data..!' ),
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

				objToolbar.items.each( function( item )
				{
					item.removeCls( 'xn-custom-heighlight' );
				} );
				btn.addCls( 'xn-custom-heighlight' );

				if( !Ext.isEmpty( filterCode ) )
				{
					var applyAdvFilter = true;
					this.getSavedFilterData( filterCode, this.populateSavedFilter, applyAdvFilter );
				}

				me.savePrefAdvFilterCode = filterCode;
				me.showAdvFilterCode = filterCode;
				me.toggleSavePreferencesAction( true );
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

					if( fieldName === 'requestReference' )
						var fieldType = 'textfield';

					else
						if( fieldName === 'investmentAccNmbr' || fieldName === 'fundName' )
							var fieldType = 'AutoCompleter';

						else
							if( fieldName === 'requestStatus' || fieldName === 'investmentType' )
								var fieldType = 'combobox';

					var fieldObj = objCreateNewFilterPanel.down( '' + fieldType + '[itemId="' + fieldName + '"]' );

					fieldObj.setValue( fieldVal );

				}
				if( applyAdvFilter )
					me.applyAdvancedFilter();
			},
			enableValidActionsForGrid : function( grid, record, recordIndex, selectedRecords, jsonData )
			{
				var me = this;
				var buttonMask = '00000000';
				var maskArray = new Array(), actionMask = '', objData = null;
				;

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

				actionMask = doAndOperation( maskArray, 8 );
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

				var grid = me.getInvestmentCenterGrid();
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
									// populate indexes
									// array, set
									// currentIndex, and
									// replace
									// wrap matched
									// string in a span
									cellHTML = cellHTML.replace( searchRegExp, function( m )
									{
										return '<span class="xn-livesearch-match">' + m + '</span>';
									} );
									// restore protected
									// tags
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
			handleGroupActions : function( btn, record )
			{
				var me = this;
				var strAction = !Ext.isEmpty( btn.actionName ) ? btn.actionName : btn.itemId;
				var strUrl = Ext.String.format( '{0}List/{1}.srvc?', me.selectedInvestmentCenter, strAction );
				if( strAction === 'reject' )
				{
					this.showRejectVerifyPopUp( strAction, strUrl, record );

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
							me.preHandleGroupActions( strActionUrl, text, record );
						}
					}
				} );
			},

			preHandleGroupActions : function( strUrl, remark, record )
			{

				var me = this;
				var grid = this.getInvestmentCenterGrid();
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
						url : strUrl + csrfTokenName + "=" + csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode( arrayJson ),
						success : function( response )
						{
							// TODO : Action Result handling to
							// be done here
							me.enableDisableGroupActions( '00000000', true );
							grid.refreshData();
						},
						failure : function()
						{
							var errMsg = "";
							Ext.MessageBox.show(
							{
								title : getLabel( 'errorTitle', 'Error' ),
								msg : getLabel( 'investCenterErrorPopUpMsg', 'Error while fetching data..!' ),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							} );
						}
					} );
				}

			},
			isRowIconVisible : function( store, record, jsonData, itmId, maskPosition )
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
					bitPosition = parseInt( maskPosition,10 ) - 1;
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
				else
					if( maskPosition === 7 && retValue )
					{
						retValue = retValue && isSameUser;
					}
				return retValue;
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
						blnRetValue = me.isRowIconVisible( store, record, jsonData, itmId, arrMenuItems[ a ].maskPosition );
						isMenuVisible = ( isMenuVisible || blnRetValue ) ? true : false;
					}
				}
				return isMenuVisible;
			},
			enableDisableGroupActions : function( actionMask, isSameUser )
			{
				var actionBar = this.getActionBarSummDtl();
				var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
				if( !Ext.isEmpty( actionBar ) && !Ext.isEmpty( actionBar.items.items ) )
				{
					arrItems = actionBar.items.items;
					Ext.each( arrItems, function( item )
					{
						strBitMapKey = parseInt( item.maskPosition,10 ) - 1;
						if( strBitMapKey )
						{
							blnEnabled = isActionEnabled( actionMask, strBitMapKey );
							if( ( item.maskPosition === 6 && blnEnabled ) )
							{

								blnEnabled = blnEnabled && isSameUser;
							}
							else
								if( item.maskPosition === 7 && blnEnabled )
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
				arrCols.push( me.createGroupActionColumn() );
				arrCols.push( me.createActionColumn() )
				if( !Ext.isEmpty( arrColsPref ) )
				{
					for( var i = 0 ; i < arrColsPref.length ; i++ )
					{
						objCol = arrColsPref[ i ];
						cfgCol = {};
						cfgCol.colHeader = objCol.colDesc;
						cfgCol.colId = objCol.colId;
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
						if( objCol.colId === 'nav' || objCol.colId === 'requestedUnit' || objCol.colId === 'requestedAmnt' )
						{
							cfgCol.align = 'right';
						}
						if( objCol.colId === 'requestReference' )
						{
							cfgCol.width = 190;
							cfgCol.fnSummaryRenderer = function( value, summaryData, dataIndex, colId )
							{
								var strRet = '';
								var grid = me.getInvestmentCenterGrid();
								if( !Ext.isEmpty( grid ) && !Ext.isEmpty( grid.store ) )
								{
									var data = grid.store.proxy.reader.jsonData;
									if( data && data.d && data.d.__subTotal )
									{
										strSubTotal = data.d.__subTotal;
									}
								}
								if(null != strSubTotal && strSubTotal != '$0.00')
								{
									strRet = getLabel( 'subTotal', 'Sub Total' );
								}
								return strRet;
							}
						}
						if( objCol.colId === 'requestedAmnt' )
						{
							cfgCol.width = 190;
							cfgCol.fnSummaryRenderer = function( value, summaryData, dataIndex, colId )
							{
								var strRet = '';
								var grid = me.getInvestmentCenterGrid();
								if( !Ext.isEmpty( grid ) && !Ext.isEmpty( grid.store ) )
								{
									var data = grid.store.proxy.reader.jsonData;
									if( data && data.d && data.d.__subTotal )
									{
										if(data.d.__subTotal != '$0.00')
										strRet = data.d.__subTotal;
									}
								}
								return strRet;
							}
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
				if( colId === 'col_requestedAmnt' )
				{

					strRetValue =  value;
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
					colType : 'action',
					colId : 'groupaction',
					width : 50,
					align : 'right',
					locked : true,
					items :
					[
						{
							itemId : 'discard',
							itemCls : 'grid-row-text-icon icon-discard-text',
							toolTip : getLabel( 'prfMstActionDiscard', 'Discard' ),
							maskPosition : 5
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
								itemId : 'accept',
								itemCls : 'grid-row-text-icon icon-approve-text',
								itemLabel : getLabel( 'prfMstActionApprove', 'Approve' ),
								maskPosition : 3
							},
							{
								itemId : 'reject',
								itemLabel : getLabel( 'prfMstActionReject', 'Reject' ),
								maskPosition : 4
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
					colType : 'action',
					colId : 'action',
					width : 60,
					align : 'right',
					locked : true,
					items :
					[

						{
							itemId : 'btnView',
							itemCls : 'grid-row-action-icon icon-view',
							toolTip : getLabel( 'viewToolTip', 'View Record' ),
							maskPosition : 1
						},
						{
							itemId : 'btnHistory',
							itemCls : 'grid-row-action-icon icon-history',
							toolTip : getLabel( 'historyToolTip', 'View History' ),
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
						blnRetValue = me.isRowIconVisible( store, record, jsonData, null, arrMenuItems[ a ].maskPosition );
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
						// Change content dynamically
						// depending on which element
						// triggered the show.
						beforeshow : function( tip )
						{
							var paymentTypeVal = '';

							var dateFilter = me.dateFilterLabel;

							if( me.investmentTypeFilterVal == 'all' && me.filterApplied == 'ALL' )
							{
								paymentTypeVal = 'All';
								me.showAdvFilterCode = null;
							}
							else
							{
								paymentTypeVal = me.investmentTypeFilterDesc;
							}
							var advfilter = me.showAdvFilterCode;
							if( advfilter == '' || advfilter == null )
							{
								advfilter = getLabel( 'none', 'None' );
							}

							tip.update( 'Type' + ' : ' + paymentTypeVal + '<br/>' + getLabel( 'date', 'Date' ) + ' : '
								+ dateFilter + '<br/>' + getLabel( 'advancedFilter', 'Advance Filter' ) + ':' + advfilter );
						}
					}
				} );
			},
			toggleSavePreferencesAction : function( isVisible )
			{
				var me = this;
				var btnPreferences = me.getBtnSavePreferences();
				if( !Ext.isEmpty( btnPreferences ) )
					btnPreferences.setDisabled( !isVisible );

			},
			toggleClearPrefrenceAction : function(isVisible) {
				var me = this;
				var btnPref = me.getBtnClearPreferences();
				if (!Ext.isEmpty(btnPref))
					btnPref.setDisabled(!isVisible);
			},
			handleSavePreferences : function()
			{
				var me = this;
				me.savePreferences();
			},
			handleClearPreferences : function() {
				var me = this;
				me.toggleSavePreferencesAction(false);
				me.clearWidgetPreferences();
			},
			savePreferences : function()
			{
				var me = this, objPref = {}, arrCols = null, objCol = null;
				var strUrl = me.urlOfGridViewPref;
				var grid = me.getInvestmentCenterGrid();
				var arrColPref = new Array();
				var arrPref = new Array();
				if( !Ext.isEmpty( grid ) )
				{
					arrCols = grid.getView().getGridColumns();
					for( var j = 0 ; j < arrCols.length ; j++ )
					{
						objCol = arrCols[ j ];
						if( !Ext.isEmpty( objCol ) && !Ext.isEmpty( objCol.itemId ) && objCol.itemId.startsWith( 'col_' )
							&& !Ext.isEmpty( objCol.xtype ) && objCol.xtype !== 'actioncolumn' )
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
				}

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
								title = getLabel( 'messageTitle', 'Message' );
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
								title : getLabel( 'errorTitle', 'Error' ),
								msg : getLabel( 'investCenterErrorPopUpMsg', 'Error while fetching data..!' ),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							} );
						}
					} );

			},
			saveFilterPreferences : function()
			{
				var me = this;
				var strUrl = me.urlGridViewFilterPref;
				var advFilterCode = null;
				var objFilterPref = {};
				if( !Ext.isEmpty( me.savePrefAdvFilterCode ) )
				{
					advFilterCode = me.savePrefAdvFilterCode;
				}
				var objQuickFilterPref = {};
				objQuickFilterPref.investmentType = me.investmentTypeFilterVal;
				objQuickFilterPref.entryDate = me.dateFilterVal;

				objQuickFilterPref.operator = me.operator;
				fieldValue1 = Ext.Date.format( me.fromDateFilter, me.strSqlDateFormat );
				fieldValue2 = Ext.Date.format( me.toDateFilter, me.strSqlDateFormat );
				objQuickFilterPref.entryDateFrom = fieldValue1;
				objQuickFilterPref.entryDateTo = fieldValue2;
				objQuickFilterPref.dateFilterLabel = me.dateFilterLabel;

				if( me.dateFilterVal === '7' )
				{
					if( !Ext.isEmpty( me.fromDateFilter ) && !Ext.isEmpty( me.toDateFilter ) )
					{
						objQuickFilterPref.entryDateFrom = Ext.util.Format.date( me.fromDateFilter, me.strSqlDateFormat );
						objQuickFilterPref.entryDateTo = Ext.util.Format.date( me.toDateFilter, me.strSqlDateFormat );
					}
					else
					{
						var frmDate = me.getFromEntryDate().getValue();
						var toDate = me.getToEntryDate().getValue();
						fieldValue1 = Ext.util.Format.date( frmDate, me.strSqlDateFormat );
						fieldValue2 = Ext.util.Format.date( toDate, me.strSqlDateFormat );
						objQuickFilterPref.entryDateFrom = fieldValue1;
						objQuickFilterPref.entryDateTo = fieldValue2;
					}
				}

				objFilterPref.advFilterCode = advFilterCode;
				objFilterPref.quickFilter = objQuickFilterPref;
				if( objFilterPref )
					Ext.Ajax.request(
					{
						url : strUrl + csrfTokenName + "=" + csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode( objFilterPref ),
						success : function( response )
						{
							var data = Ext.decode( response.responseText );
							var title = getLabel( 'messageTitle', 'Message' );
							if( data.d.preferences && data.d.preferences.success === 'Y' )
							{
								Ext.MessageBox.show(
								{
									title : title,
									msg : getLabel( 'prefSaveSuccMsg', 'Preferences Saved Successfully' ),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.INFO
								} );
							}
							else
								if( data.d.preferences && data.d.preferences.success === 'N' && data.d.error
									&& data.d.error.errorMessage )
								{
									if( !Ext.isEmpty( me.getBtnSavePreferences() ) )
										me.toggleSavePreferencesAction( true );
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
								title : getLabel( 'errorTitle', 'Error' ),
								msg : getLabel( 'investCenterErrorPopUpMsg', 'Error while fetching data..!' ),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							} );
						}
					} );
			},
			clearWidgetPreferences : function() {
				var me = this, objPref = {}, arrCols = null, objCol = null,objWdgtPref = null;
				var strUrl = me.commonPrefUrl+"?$clear=true";
				var grid = me.getInvestmentCenterGrid();
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
										colDesc : objCol.text,
										colHidden : objCol.hidden
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
											me.toggleSavePreferencesAction(true);
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
			advanceFilterPopUp : function( btn )
			{
				var me = this;
				var objCreateNewFilterPanel = me.getCreateNewFilter();
				var filterDetailsTab = me.getFilterDetailsTab();
				filterDetailsTab.setTitle( getLabel( 'createNewFilter', 'Create New Filter' ) );

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
					/*
					 * me.objAdvFilterPopup.processFromDate =
					 * me.getProcessFromDateLabel();
					 * me.objAdvFilterPopup.processToDate =
					 * me.getProcessToDateLabel();
					 */
					me.objAdvFilterPopup.show();

					var objTabPanel = me.getAdvanceFilterTabPanel();
					objTabPanel.setActiveTab( 1 );
				}
				else
				{
					me.objAdvFilterPopup = Ext.create( 'GCP.view.InvestmentCenterAdvancedFilterPopup' );
					var objTabPanel = me.getAdvanceFilterTabPanel();
					objTabPanel.setActiveTab( 1 );
					/*
					 * me.objAdvFilterPopup.processFromDate =
					 * me.getProcessFromDateLabel();
					 * me.objAdvFilterPopup.processToDate =
					 * me.getProcessToDateLabel();
					 */
					me.objAdvFilterPopup.show();
				}
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
					me.getDateRangeComponent().show();
					me.getFromDateLabel().hide();
					me.getToDateLabel().hide();
				}
				else if(index == '12')
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
					me.getDateLabel().setText( getLabel( 'date', 'Request Date' ) + "(" + me.dateFilterLabel + ")" );
				}
				if( index !== '7' && index !== '12')
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
				retObj.fieldValue1 = fieldValue1;
				retObj.fieldValue2 = fieldValue2;
				retObj.operator = operator;
				return retObj;
			},
			onInvestmentCenterSummaryInformationViewRender : function()
			{
				var me = this;
				var accSummInfoViewRef = me.getInvestmentCenterGridInformationView();
				accSummInfoViewRef.createSummaryLowerPanelView();
			},

			updateFilterConfig : function()
			{
				var me = this;
				var arrJsn = new Array();
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
				if( !Ext.isEmpty( objGridViewFilterPref ) )
				{
					var data = Ext.decode( objGridViewFilterPref );
					var strDtValue = data.quickFilter.entryDate;
					var strDtFrmValue = data.quickFilter.fromDate;
					var strDtToValue = data.quickFilter.toDate;
					var strInvestmentType = data.quickFilter.investmentType;

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
						me.investmentTypeFilterVal = !Ext.isEmpty( strInvestmentType ) ? strInvestmentType : 'all';
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
					if(me.dateFilterVal != '12')
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

				if( !Ext.isEmpty( me.investmentTypeFilterVal ) && me.investmentTypeFilterVal != 'all' )
				{
					arrJsn.push(
					{
						paramName : "investmentType",
						paramValue1 : me.investmentTypeFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}

				me.filterData = arrJsn;
			},
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
						var strUrl = 'userfilters/investCenterFilter/{0}.srvc';
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
								this.advFilterCodeApplied = data.advFilterCode;
								me.savePrefAdvFilterCode = '';
								me.filterApplied = 'A';
							},
							failure : function()
							{
								var errMsg = "";
								Ext.MessageBox.show(
								{
									title : getLabel( 'errorTitle', 'Error' ),
									msg : getLabel( 'investCenterErrorPopUpMsg', 'Error while fetching data..!' ),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								} );
							}
						} );
					}
				}
			},
			reloadGridRawData : function() {
				var me = this;
				var gridView = me.getAdvFilterGridView();
				Ext.Ajax.request({
							url : 'userfilterslist/investCenterFilter.srvc',
							headers: objHdrCsrfParams,
							method : 'GET',
							success : function(response) {
								var decodedJson = Ext.decode(response.responseText);
								var arrJson = new Array();

								if (!Ext.isEmpty(decodedJson.d.filters)) {
									for (i = 0; i < decodedJson.d.filters.length; i++) {
										arrJson.push({
													"filterName" : decodedJson.d.filters[i]
												});
									}
								}
								gridView.loadRawData(arrJson);
								me.addAllSavedFilterCodeToView(decodedJson.d.filters);
							},
							failure : function(response) {
								// console.log("Ajax Get data Call Failed");
							}
						});
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
				strUrl = 'services/getInvestmentCenterList/getInvestmentCenterDynamicReport.' + strExtension;
				strUrl += '?$skip=1';
				var strQuickFilterUrl = me.generateUrlWithQuickFilterParams( this );
				strUrl += strQuickFilterUrl;
				var grid = me.getInvestmentCenterGrid();
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
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'txtCurrent', currentPage ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'txtCSVFlag', withHeaderFlag ) );
				form.action = strUrl;
				document.body.appendChild( form );
				form.submit();
				document.body.removeChild( form );
			}			
		} );
