/**
 * @class MigrationSummaryController
 * @extends Ext.app.Controller
 * @author CHPL
 */

  				//Add More Timeout Globally (6 min = 360000)
				//---------------------------
				Ext.override(Ext.data.Connection, {
							timeout: 360000
				});

				Ext.Ajax.timeout = 360000;
				Ext.override(Ext.data.proxy.Ajax, { timeout: 360000 });
				Ext.override(Ext.form.action.Action, { timeout: 360 });
				//---------------------------


 
 Ext
	.define(
		'GCP.controller.MigrationSummaryController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'GCP.view.BankProcessingQueueView', 'Ext.ux.gcp.DateHandler', 'Ext.Img', 'Ext.util.Point', 'GCP.view.EntityListPopup','GCP.view.MigEntityGridView'
			],
			views :
			[
				'GCP.view.BankProcessingQueueView', 'GCP.view.EntityListPopup','GCP.view.MigEntityGridView'
			],
			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[
				{
					ref : 'bankProcessingQueueView',
					selector : 'bankProcessingQueueView'
				},
				{
					ref : 'bankProcessingQueueFilterView',
					selector : 'bankProcessingQueueView bankProcessingQueueFilterView'
				},
				{
					ref : 'bankProcessingQueueGrid',
					selector : 'bankProcessingQueueView bankProcessingQueueGridView grid[itemId="gridViewMstId"]'
				},
				{
					ref : 'bankProcessingQueueDtlView',
					selector : 'bankProcessingQueueView bankProcessingQueueGridView panel[itemId="bankProcessingQueueDtlView"]'
				},
{
				   ref : 'bankProcessingQueueClientId',
				   selector : 'bankProcessingQueueView bankProcessingQueueFilterView AutoCompleter[itemId="bankProcessingQueueClientId"]' 
				},				{
					ref : 'bankProcessingQueueGridView',
					selector : 'bankProcessingQueueView bankProcessingQueueGridView'
				},
				{
					ref : 'transactionsByCombo',
					selector : 'bankProcessingQueueView bankProcessingQueueGridView combo[itemId="transactionsByCombo"]'
				},
				{
					ref : 'matchCriteria',
					selector : 'bankProcessingQueueGridView radiogroup[itemId="bankProcessingQueueView"]'
				},
				{
					ref : 'searchTxnTextInput',
					selector : 'bankProcessingQueueGridView textfield[itemId="searchTxnTextField"]'
				},
				{
					ref : 'actionBarSummDtl',
					selector : 'bankProcessingQueueView bankProcessingQueueGridView bankProcessingQueueGroupActionBarView'
				},
				{
					ref : 'groupActionsToolBar',
					selector : 'bankProcessingQueueView bankProcessingQueueGridView toolbar[itemId="bankProcessingQueueGroupActionBarView_summDtl"]'
				},
				{
					ref : 'advanceFilterPopup',
					selector : 'bankProcessingQueueAdvancedFilterPopup[itemId="stdViewAdvancedFilter"]'
				},

				{
					ref : 'advanceFilterTabPanel',
					selector : 'bankProcessingQueueAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] tabpanel[itemId="advancedFilterTab"] '
				},
				{
					ref : 'filterDetailsTab',
					selector : 'bankProcessingQueueAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] tabpanel[itemId="advancedFilterTab"] panel[itemId="filterDetailsTab"]'
				},
				{
					ref : 'createNewFilter',
					selector : 'bankProcessingQueueAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] bankProcessingQueueCreateNewAdvFilter[itemId=stdViewAdvFilter]'
				},
				{
					ref : 'advFilterGridView',
					selector : 'bankProcessingQueueAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] bankProcessingQueueCreateNewAdvFilter'
				},
				{
					ref : 'saveSearchBtn',
					selector : 'bankProcessingQueueAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] bankProcessingQueueCreateNewAdvFilter[itemId=stdViewAdvFilter] button[itemId="saveAndSearchBtn"]'
				},
				{
					ref : 'advFilterActionToolBar',
					selector : 'bankProcessingQueueView bankProcessingQueueFilterView toolbar[itemId="advFilterActionToolBar"]'
				},
				{
					ref : 'batchStatusFilterRef',
					selector : 'bankProcessingQueueAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] bankProcessingQueueCreateNewAdvFilter combo[itemId="statusFilterItemId"]'
				},
				{
					ref : 'withHeaderCheckboxRef',
					selector : 'migrationSummaryTitleView menuitem[itemId="withHeaderId"]'
				}				
			],
			config :
			{
				filterData : [],
				copyByClicked : '',
				activeFilter : null,
				showAdvFilterCode : null,
				savePrefAdvFilterCode : null,
				processingQueueTypeFilterVal : 'V',
				processingQueueTypeFilterDesc : 'Verify',
				processingQueueSubTypeFilterVal : '1',
				processingQueueSubTypeFilterDesc : 'Verify',
				processingQueueStatusFilterVal : '',
				processingQueueStatusFilterDesc : 'ALL',
				processingQueueSellerVal : 'All',
				processingQueueClientVal : 'All',
				processingQueueSourceType : 'B',
				filterApplied : 'Q',
				objAdvFilterPopup : null,
				dateFilterVal : '1',
				dateFilterFromVal : '',
				dateFilterToVal : '',
				dateFilterLabel : getLabel( 'today', 'Today' ),
				urlOfGridViewPref : 'userpreferences/bankProcessingQueue/bankProcessingQueueViewPref.srvc?',
				urlGridViewFilterPref : 'userpreferences/bankProcessingQueue/bankProcessingQueueViewFilter.srvc?',
				commonPrefUrl : 'services/userpreferences/bankProcessingQueue.json',
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
				
				this.dateHandler = Ext.create( 'Ext.ux.gcp.DateHandler' );
				
				GCP.getApplication().on(
				{
					callPreHandleGroupActions : function( remark, changedDate )
					{
						me.preHandleGroupActions( passedUrl, remark, changedDate, passedRecordObj );
					}	
				} );

				me.objAdvFilterPopup = Ext.create( 'GCP.view.BankProcessingQueueAdvancedFilterPopup',
				{
					parent : 'bankProcessingQueueView',
					itemId : 'stdViewAdvancedFilter',
					filterPanel :
					{
						xtype : 'bankProcessingQueueCreateNewAdvFilter',
						itemId : 'stdViewAdvFilter',
						margin : '4 0 0 0',
						callerParent : 'bankProcessingQueueView'
					}
				} );
				me.updateFilterConfig();
				me.updateAdvFilterConfig();
				me
					.control(
					{
						'bankProcessingQueueView' :
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
						'migrationSummaryTitleView' :
						{
							performReportAction : function( btn, opts )
							{
								me.handleReportAction( btn, opts );
							}							
						},
						'bankProcessingQueueGridView' :
						{
							render : function( panel )
							{
								me.handleSmartGridConfig();
							}
						},

						'bankProcessingQueueGridView smartgrid' :
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
							},
							clientAccountsList : me.clientAccPopup
						},
						'bankProcessingQueueGridView combo[itemId="transactionsByCombo"]' :
						{
							change : function( combo, newValue, oldValue, eOpts )
							{
								switch( newValue )
								{
									case 'B':
										this.addSourceType( 'B' );
										break;
									case 'I':
										this.addSourceType( 'I' );
										break;
								}
							}
						},
						'bankProcessingQueueGridView textfield[itemId="searchTxnTextField"]' :
						{
							change : function( btn, opts )
							{
								me.searchTrasactionChange();
							}
						},
						'bankProcessingQueueGridView radiogroup[itemId="matchCriteria"]' :
						{
							change : function( btn, opts )
							{
								me.searchTrasactionChange();
							}
						},
						
						'bankProcessingQueueAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] radiogroup[itemId="branchRadioFilterItemId"]' :
						{
							change : function( btn, opts )
							{
								var objAdvanceFilterPopup = me.getAdvanceFilterPopup();
								if(opts.branchTypeFilter === 'seek')
								{
									objAdvanceFilterPopup.down('AutoCompleter[itemId="branchSeekFilterItemId"]').setReadOnly( false );
									objAdvanceFilterPopup.down('AutoCompleter[itemId="branchSeekFilterItemId"]').setEditable( true );
								}
								else
								{
									objAdvanceFilterPopup.down('AutoCompleter[itemId="branchSeekFilterItemId"]').setValue( '' );
									objAdvanceFilterPopup.down('AutoCompleter[itemId="branchSeekFilterItemId"]').setReadOnly( true );
									objAdvanceFilterPopup.down('AutoCompleter[itemId="branchSeekFilterItemId"]').setEditable( false );
								}
							}
						},
						
						'bankProcessingQueueView bankProcessingQueueGridView toolbar[itemId=bankProcessingQueueGroupActionBarView_summDtl]' :
						{
							performGroupAction : function( btn, opts )
							{
								me.handleGroupActions( btn );
							},
							refreshMigrationData : function( btn, opts )
							{
								me.handlerefreshMigrationData( btn );
							},
							createMigClient : function( btn, opts )
							{
								me.handlecreateMigClient( btn, opts);
							},
							alignClient : function( btn, opts )
							{
								me.handlealignClient( btn, opts);
							}
						},
						
						'entityListPopup Window[itemId=entityListPopupId]' :
						{
							switchMatchCriteria : function( cb, nv, ov , id)
							{
								me.switchMatchCriteria( cb, nv, ov ,id);
							}
						},
						
						'bankProcessingQueueView bankProcessingQueueFilterView' :
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
								me.handleProcessingQueueType( btn );
							},
							filterStatus : function( btn, opts )
							{
								me.handleProcessingQueueSubType( btn );
							}
						},
						 'bankProcessingQueueView bankProcessingQueueFilterView combo[itemId="bankProcessingQueueSellerId"]' :
						 {
							 render : function(combo, record) {
								 var sellerIdcomboStore = Ext.create('Ext.data.Store', {
										fields: ['seller']
								 });
								 combo.bindStore(sellerIdcomboStore);
								 for( var i = 0 ; i < entitledSellerCodesList.length ; i++ )
									 combo.getStore().add({seller: entitledSellerCodesList[i]});
								combo.select(sellerIdcomboStore.getAt(0).data.seller); 
								me.processingQueueSellerVal=sellerIdcomboStore.getAt(0).data.seller;
							},
							select : function(combo, record) {
									me.processingQueueSellerVal = combo.getValue();
									me.toggleSavePreferencesAction( true );
									me.filterApplied = 'Q';
									me.processingQueueClientVal = record[ 0 ].data.CODE;
									me.setDataForFilter();
									me.applyQuickFilter();
							}
						},
						'bankProcessingQueueView bankProcessingQueueFilterView AutoCompleter[itemId="bankProcessingQueueClientId"]' :
						{
							select : function( combo, record, index )
							{
								me.toggleSavePreferencesAction( true );
								me.filterApplied = 'Q';
								me.processingQueueClientVal = record[ 0 ].data.DESCR;
								me.setDataForFilter();
								me.applyQuickFilter();
							},
							change : function( xyz, newValue, oldValue, eOpts) 
							{
								if(newValue == null || newValue == ''){
									me.filterApplied = 'Q';
									me.processingQueueClientVal = null;
									me.setDataForFilter();
									me.applyQuickFilter();
								}
							}
						},
						'bankProcessingQueueAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] bankProcessingQueueCreateNewAdvFilter' :
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
						'bankProcessingQueueAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] bankProcessingQueueAdvFilterGridView' :
						{
							orderUpEvent : me.orderUpDown,
							deleteFilterEvent : me.deleteFilterSet,
							viewFilterEvent : me.viewFilterData,
							editFilterEvent : me.editFilterData
						}
					} );
				me.setBatchStatusOnAdvFltr(me.processingQueueTypeFilterVal);
			},
			
			setBatchStatusOnAdvFltr :function( str )
			{
				var me = this;
				
				var arrRepairStatus =
					[
						{
							"key" : "1",
							"value" : "Pending Repair"
						},
						{
							"key" : "2",
							"value" : "Pending Submit"
						},
						{
							"key" : "4",
							"value" : "Repaired"
						},
						{
							"key" : "5",
							"value" : "Rejected"
						},
						{
							"key" : "6",
							"value" : "Pending Repair Auth"
						},
						{
							"key" : "3",
							"value" : "Pending Reject Auth"
						}
					];
				var comboStoreRepairStatus = Ext.create( 'Ext.data.Store',
					{
						fields :
						[
							'key', 'value'
						],
						data : arrRepairStatus
					} );
				
				var arrDebitStatus =
					[
						{
							"key" : "1",
							"value" : "Pending Debit"
						},
						{
							"key" : "2",
							"value" : "Debit Failed"
						},
						{
							"key" : "6",
							"value" : "Date Changed"
						},
						{
							"key" : "11",
							"value" : "Confirmed"
						},
						{
							"key" : "13",
							"value" : "Debit Enforced"
						},
						{
							"key" : "4",
							"value" : "Rejected"
						},
						{
							"key" : "8",
							"value" : "Payment Cancelled"
						},
						{
							"key" : "10",
							"value" : "Pending Confirm Auth"
						},
						{
							"key" : "12",
							"value" : "Pending Enforce Debit Auth"
						},
						{
							"key" : "5",
							"value" : "Pending Date Change Auth"
						},
						{
							"key" : "3",
							"value" : "Pending Reject Auth"
						},
						{
							"key" : "7",
							"value" : "Pending Cancel Auth"
						}
					];
				var comboStoreDebitStatus = Ext.create( 'Ext.data.Store',
					{
						fields :
						[
							'key', 'value'
						],
						data : arrDebitStatus
					} );
				
				var arrClearingStatus =
					[
						{
							"key" : "1",
							"value" : "Debitted"
						},
						{
							"key" : "2",
							"value" : "On Hold"
						},
						{
							"key" : "7",
							"value" : "Ready for Download"
						},
						{
							"key" : "6",
							"value" : "Date Changed"
						},
						{
							"key" : "4",
							"value" : "Cancelled"
						},
						{
							"key" : "3",
							"value" : "Pending Cancel Auth"
						},
						{
							"key" : "5",
							"value" : "Pending Date Change Auth"
						}
					];
				var comboStoreClearingStatus = Ext.create( 'Ext.data.Store',
					{
						fields :
						[
							'key', 'value'
						],
						data : arrClearingStatus
					} );
				var arrWarehouseStatus =
						[
							{
								"key" : "1",
								"value" : "Pending Repair"
							},
							{
								"key" : "2",
								"value" : "Pending Submit"
							},
							{
								"key" : "4",
								"value" : "Repaired"
							},
							{
								"key" : "5",
								"value" : "Rejected"
							},
							{
								"key" : "6",
								"value" : "Pending Repair Auth"
							},
							{
								"key" : "3",
								"value" : "Pending Reject Auth"
							}
						];
				 var comboStoreWarehouseStatus = Ext.create( 'Ext.data.Store',
						{
						fields :
						[
							'key', 'value'
						],
						data : arrWarehouseStatus
					} );
				 
				 var arrVerificationStatus =
						[
							{
								"key" : "1",
								"value" : "Pending Repair"
							},
							{
								"key" : "2",
								"value" : "Pending Submit"
							},
							{
								"key" : "4",
								"value" : "Repaired"
							},
							{
								"key" : "5",
								"value" : "Rejected"
							},
							{
								"key" : "6",
								"value" : "Pending Repair Auth"
							},
							{
								"key" : "3",
								"value" : "Pending Reject Auth"
							}
						];
				 
				 var comboStoreVerificationStatus = Ext.create( 'Ext.data.Store',
						{
						fields :
						[
							'key', 'value'
						],
						data : arrVerificationStatus
					} );
				
				
				var comboField = me.getBatchStatusFilterRef();
				comboField.store.removeAll();
				if(str == 'R')
					comboField.bindStore(comboStoreRepairStatus);
				else if(str == 'D')
					comboField.bindStore(comboStoreDebitStatus);
				else if (str == 'C')
					comboField.bindStore(comboStoreClearingStatus);
				else if (str == 'W')
					comboField.bindStore(comboStoreWarehouseStatus);
				else if (str == 'V')
					comboField.bindStore(comboStoreVerificationStatus);
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
				var strUrl = 'userfilters/bankProcessingQueue/{0}.srvc?';
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
							title = getLabel( 'bankProcessingQueuePopupTitle', 'Message' );
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
						}
					},
					failure : function()
					{
						var errMsg = "";
						Ext.MessageBox.show(
						{
							title : getLabel( 'bankProcessingQueueErrorPopUpTitle', 'Error' ),
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
					url : 'userfilterslist/bankProcessingQueue.srvc?' + csrfTokenName + "=" + csrfTokenValue,
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
					me.objAdvFilterPopup = Ext.create( 'GCP.view.BankProcessingQueueAdvancedFilterPopup' );
					var objTabPanel = me.getAdvanceFilterTabPanel();
					objTabPanel.setActiveTab( 0 );
					me.objAdvFilterPopup.show();
					var filterDetailsTab = me.getFilterDetailsTab();
					filterDetailsTab.setTitle( getLabel( 'filterDetails', 'Filter Details' ) );
				}
			},
			addSourceType : function( str )
			{
				var me = this;
				me.filterApplied = 'Q';
				me.processingQueueSourceType = str;
				me.setDataForFilter();
				me.applyQuickFilter();
			},
			handleProcessingQueueType : function( btn )
			{
				var me = this;
				me.toggleSavePreferencesAction( true );
				//me.getAuthStatusToolBar().removeAll();
				/*me.getProcessingQueuesToolBar().items.each( function( item )
				{
					item.removeCls( 'xn-custom-heighlight' );
					item.addCls( 'xn-account-filter-btnmenu' );
				} );*/
				btn.addCls( 'xn-custom-heighlight xn-account-filter-btnmenu' );
				me.processingQueueStatusFilterVal = '';
				me.processingQueueTypeFilterVal = btn.code;
				me.processingQueueTypeFilterDesc = btn.btnDesc;
				me.setQueueSubType( btn );
				me.setBatchStatusOnAdvFltr(me.processingQueueTypeFilterVal);
				me.setGroupActionBar( btn );
				me.filterApplied = 'Q';
				me.setDataForFilter();
				me.applyQuickFilter();
			},
			setQueueSubType : function( btn )
			{
				var me = this;
				//me.getAuthStatusToolBarLbl().setText( '' );
				//me.getQueueSubTypeToolBar().removeAll();
				if( me.processingQueueTypeFilterVal == 'R' )
				{

					me.processingQueueSubTypeFilterVal = '1';
					me.processingQueueSubTypeFilterDesc = 'Repair';
					/*me.getQueueSubTypeToolBar().add(
					{
						text : getLabel( 'repairStatus', 'Repair' ),
						code : '1',
						btnDesc : 'Repair',
						btnId : 'repairStatus',
						parent : this,
						cls : 'f13 xn-custom-heighlight',
						handler : function( btn, opts )
						{
							me.handleProcessingQueueSubType( btn );
						}
					},
					{
						text : getLabel( 'pendingAuth', 'Pending Auth' ),
						code : '2',
						btnDesc : 'Pending Auth',
						btnId : 'pendingAuthStatus',
						parent : this,
						handler : function( btn, opts )
						{
							me.handleProcessingQueueSubType( btn );
						}
					} );*/
				
				}
				else if( me.processingQueueTypeFilterVal == 'D' )
				{
					me.processingQueueSubTypeFilterVal = '1';
					me.processingQueueSubTypeFilterDesc = 'Debit';
					/*me.getQueueSubTypeToolBar().add(
					{
						text : getLabel( 'debitStatus', 'Debit' ),
						code : '1',
						btnDesc : 'Debit',
						btnId : 'debitStatus',
						parent : this,
						cls : 'f13 xn-custom-heighlight',
						handler : function( btn, opts )
						{
							me.handleProcessingQueueSubType( btn );
						}
					},
					{
						text : getLabel( 'pendingAuth', 'Pending Auth' ),
						code : '2',
						btnDesc : 'Pending Auth',
						btnId : 'pendingAuthStatus',
						parent : this,
						handler : function( btn, opts )
						{
							me.handleProcessingQueueSubType( btn );
						}
					} );*/
				}
				else
					if( me.processingQueueTypeFilterVal == 'C' )
					{
						me.processingQueueSubTypeFilterVal = '1';
						me.processingQueueSubTypeFilterDesc = 'Debited';
						/*me.getQueueSubTypeToolBar().add(
						{
							text : getLabel( 'debitedStatus', 'Debited' ),
							code : '1',
							btnDesc : 'Debited',
							btnId : 'debitedStatus',
							parent : this,
							cls : 'f13 xn-custom-heighlight',
							handler : function( btn, opts )
							{
								me.handleProcessingQueueSubType( btn );
							}
						},
						{
							text : getLabel( 'holdStatus', 'Hold' ),
							code : '3',
							btnDesc : 'Hold',
							btnId : 'holdStatus',
							parent : this,
							handler : function( btn, opts )
							{
								me.handleProcessingQueueSubType( btn );
							}
						},
						{
							text : getLabel( 'pendingAuth', 'Pending Auth' ),
							code : '2',
							btnDesc : 'Pending Auth',
							btnId : 'pendingAuthStatus',
							parent : this,
							handler : function( btn, opts )
							{
								me.handleProcessingQueueSubType( btn );
							}
						} );*/
					}
					else if( me.processingQueueTypeFilterVal == 'W' )
					{
						me.processingQueueSubTypeFilterVal = '1';
						me.processingQueueSubTypeFilterDesc = 'Warehouse';
						/*me.getQueueSubTypeToolBar().add(
						{
							text : getLabel( 'warehouseStatus', 'Warehouse' ),
							code : '1',
							btnDesc : 'Warehouse',
							btnId : 'warehouseStatus',
							parent : this,
							cls : 'f13 xn-custom-heighlight',
							handler : function( btn, opts )
							{
								me.handleProcessingQueueSubType( btn );
							}
						},
						{
							text : getLabel( 'pendingAuth', 'Pending Auth' ),
							code : '2',
							btnDesc : 'Pending Auth',
							btnId : 'pendingAuthStatus',
							parent : this,
							handler : function( btn, opts )
							{
								me.handleProcessingQueueSubType( btn );
							}
						});*/
					}
					else
					{
						me.processingQueueSubTypeFilterVal = '1';
						me.processingQueueSubTypeFilterDesc = 'Verification';
						/*me.getQueueSubTypeToolBar().add(
						{
							text : getLabel( 'verificationStatus', 'Verification' ),
							code : '1',
							btnDesc : 'Verification',
							btnId : 'verificationStatus',
							parent : this,
							cls : 'f13 xn-custom-heighlight',
							handler : function( btn, opts )
							{
								me.handleProcessingQueueSubType( btn );
							}
						},
						{
							text : getLabel( 'pendingAuth', 'Pending Auth' ),
							code : '2',
							btnDesc : 'Pending Auth',
							btnId : 'pendingAuthStatus',
							parent : this,
							handler : function( btn, opts )
							{
								me.handleProcessingQueueSubType( btn );
							}
						});*/
					}
			},
			handleProcessingQueueSubType : function( btn )
			{
				var me = this;
				me.toggleSavePreferencesAction( true );
				/*me.getQueueSubTypeToolBar().items.each( function( item )
				{
					item.removeCls( 'xn-custom-heighlight' );
					item.addCls( 'xn-account-filter-btnmenu' );
				} );*/
				btn.addCls( 'xn-custom-heighlight xn-account-filter-btnmenu' );
				me.processingQueueStatusFilterVal = '';
				me.processingQueueSubTypeFilterVal = btn.code;
				me.processingQueueSubTypeFilterDesc = btn.btnDesc;
				me.setAuthStatusBar( btn );
				me.setGroupActionBar( btn );
				me.filterApplied = 'Q';
				me.setDataForFilter();
				me.applyQuickFilter();
			},
			setAuthStatusBar : function( btn )
			{
				var me = this;
				//me.getAuthStatusToolBarLbl().setText( '' );
				//me.getAuthStatusToolBar().removeAll();
				if( me.processingQueueTypeFilterVal == 'R' && me.processingQueueSubTypeFilterVal == '2' )
				{
					//me.getAuthStatusToolBarLbl().setText( getLabel( 'authstatus', 'Auth Status' ) );
					/*me.getAuthStatusToolBar().add(
					{
						text : getLabel( 'repairAuthStatus', 'Repair' ),
						code : '4',
						btnDesc : 'Repair',
						btnId : 'repairAuthStatus',
						parent : this,
						handler : function( btn, opts )
						{
							me.handleProcessingQueueStatus( btn );
						}
					},
					{
						text : getLabel( 'rejectAuthStatus', 'Reject' ),
						code : '5',
						btnDesc : 'Reject',
						btnId : 'rejectAuthStatus',
						parent : this,
						handler : function( btn, opts )
						{
							me.handleProcessingQueueStatus( btn );
						}
					} );*/
				}
				if( me.processingQueueTypeFilterVal == 'D' && me.processingQueueSubTypeFilterVal == '2' )
				{
					//me.getAuthStatusToolBarLbl().setText( getLabel( 'authstatus', 'Auth Status' ) );
					/*me.getAuthStatusToolBar().add(
					{
						xtype : 'button',
						text : getLabel( 'manualConfirmAuthStatus', 'Manual Confirm' ),
						code : '11',
						btnDesc : 'Manual Confirm',
						btnId : 'manualConfirmAuthStatus',
						parent : this,
						handler : function( btn, opts )
						{
							me.handleProcessingQueueStatus( btn );
						}
					},
					{
						xtype : 'button',
						text : getLabel( 'manualRejectAuthStatus', 'Manual Reject' ),
						code : '4',
						btnDesc : 'Manual Reject',
						btnId : 'manualRejectAuthStatus',
						parent : this,
						handler : function( btn, opts )
						{
							me.handleProcessingQueueStatus( btn );
						}
					},
					{
						xtype : 'button',
						text : getLabel( 'manualResendAuthStatus', 'Resend' ),
						code : '14',
						btnDesc : 'Resend',
						btnId : 'manualResendAuthStatus',
						parent : this,
						handler : function( btn, opts )
						{
							me.handleProcessingQueueStatus( btn );
						}
					},
					{
						xtype : 'button',
						text : getLabel( 'dateChageAuthStatus', 'Date Change' ),
						code : '6',
						btnDesc : 'Date Change',
						btnId : 'dateChageAuthStatus',
						parent : this,
						handler : function( btn, opts )
						{
							me.handleProcessingQueueStatus( btn );
						}
					},
					{
						xtype : 'button',
						text : getLabel( 'cancelAuthStatus', 'Cancel' ),
						code : '8',
						btnDesc : 'Cancel',
						btnId : 'cancelAuthStatus',
						parent : this,
						handler : function( btn, opts )
						{
							me.handleProcessingQueueStatus( btn );
						}
					},
					{
						xtype : 'button',
						text : getLabel( 'btnEnforceDebit', 'Enforce Debit' ),
						code : '13',
						btnDesc : 'Enforce Debit',
						btnId : 'enforceDebitAuthStatus',
						parent : this,
						handler : function( btn, opts )
						{
							me.handleProcessingQueueStatus( btn );
						}
					} );*/
				}
				if( me.processingQueueTypeFilterVal == 'C' && me.processingQueueSubTypeFilterVal == '2' )
				{
					//me.getAuthStatusToolBarLbl().setText( getLabel( 'authstatus', 'Auth Status' ) );
					/*me.getAuthStatusToolBar().add(
					{
						xtype : 'button',
						text : getLabel( 'dateChageAuthStatus', 'Date Change' ),
						code : '6',
						btnDesc : 'Date Change',
						btnId : 'dateChageAuthStatus',
						parent : this,
						handler : function( btn, opts )
						{
							me.handleProcessingQueueStatus( btn );
						}
					},
					{
						xtype : 'button',
						text : getLabel( 'cancelAuthStatus', 'Cancel' ),
						code : '4',
						btnDesc : 'Cancel',
						btnId : 'cancelAuthStatus',
						parent : this,
						handler : function( btn, opts )
						{
							me.handleProcessingQueueStatus( btn );
						}
					} );*/
				}
			},
			setGroupActionBar : function( btn )
			{
				var me = this;
				me.getGroupActionsToolBar().removeAll();
				if( me.processingQueueSubTypeFilterVal == '2')
				{
					me.getGroupActionsToolBar().add(
					{
						text : getLabel( 'approve', 'Approve' ),
						disabled : true,
						actionName : 'accept',
						maskPosition : 7,
						handler : function( btn, opts )
						{
							me.handleGroupActions( btn );
						}
					},
					{
						text : getLabel( 'reject', 'Reject' ),
						disabled : true,
						actionName : 'reject',
						maskPosition : 8,
						handler : function( btn, opts )
						{
							me.handleGroupActions( btn );
						}
					} );
				}
				else
				{
					if( me.processingQueueTypeFilterVal == 'D' )
					{
						me.getGroupActionsToolBar().add(
						{
							text : getLabel( 'changeDate', 'ChangeDate' ),
							disabled : true,
							actionName : 'changeDate',
							maskPosition : 1,
							handler : function( btn, opts )
							{
								me.handleGroupActions( btn );
							}
						},						
						{
							text : getLabel( 'cancelPayment', 'Cancel Payment' ),
							disabled : true,
							actionName : 'cancelPayment',
							maskPosition : 2,
							handler : function( btn, opts )
							{
								me.handleGroupActions( btn );
							}
						},
						{
							text : getLabel( 'resend', 'ReSend' ),
							disabled : true,
							actionName : 'reSend',
							maskPosition : 3,
							handler : function( btn, opts )
							{
								me.handleGroupActions( btn );
							}
						},
						{
							text : getLabel( 'confirm', 'Confirm' ),
							disabled : true,
							actionName : 'confirm',
							maskPosition : 4,
							handler : function( btn, opts )
							{
								me.handleGroupActions( btn );
							}
						},
						{
							text : getLabel( 'reject', 'Reject' ),
							disabled : true,
							actionName : 'debitReject',
							maskPosition : 6,
							handler : function( btn, opts )
							{
								me.handleGroupActions( btn );
							}
						},
						{
							text : getLabel( 'enforceDebit', 'EnforceDebit' ),
							disabled : true,
							actionName : 'enforceDebit',
							maskPosition : 5,
							handler : function( btn, opts )
							{
								me.handleGroupActions( btn );
							}
						} );
					}
					else if(me.processingQueueTypeFilterVal == 'C' )
					{
						me.getGroupActionsToolBar().add(
						{
							text : getLabel( 'changeDate', 'ChangeDate' ),
							disabled : true,
							actionName : 'changeDate',
							maskPosition : 1,
							handler : function( btn, opts )
							{
								me.handleGroupActions( btn );
							}
						},
						{
							text : getLabel( 'cancelPayment', 'Cancel' ),
							disabled : true,
							actionName : 'cancel',
							maskPosition : 2,
							handler : function( btn, opts )
							{
								me.handleGroupActions( btn );
							}
						},
						{
							text : getLabel( 'hold', 'Hold' ),
							disabled : true,
							actionName : 'hold',
							maskPosition : 3,
							handler : function( btn, opts )
							{
								me.handleGroupActions( btn );
							}
						},
						{
							text : getLabel( 'release', 'Release' ),
							disabled : true,
							actionName : 'release',
							maskPosition : 4,
							handler : function( btn, opts )
							{
								me.handleGroupActions( btn );
							}
						},
						{
							text : getLabel( 'download', 'Download' ),
							disabled : true,
							actionName : 'download',
							maskPosition : 5,
							handler : function( btn, opts )
							{
								me.handleGroupActions( btn );
							}
						} );
					}
					else if (me.processingQueueTypeFilterVal == 'R')
					{
						me.getGroupActionsToolBar().add(
						{
							text : getLabel( 'chnageDate', 'ChangeDate' ),
							disabled : true,
							actionName : 'changeRepairDate',
							maskPosition : 1,
							handler : function( btn, opts )
							{
								me.handleGroupActions( btn );
							}
						},
						{
							text : getLabel( 'reject', 'Reject' ),
							disabled : true,
							actionName : 'repairReject',
							maskPosition : 2,
							handler : function( btn, opts )
							{
								me.handleGroupActions( btn );
							}
						},
						{
							text : getLabel( 'validate', 'Validate' ),
							disabled : true,
							actionName : 'repairValidate',
							maskPosition : 3,
							handler : function( btn, opts )
							{
								me.handleGroupActions( btn );
							}
						},
						{
							text : getLabel( 'submit', 'Submit' ),
							disabled : true,
							actionName : 'repairSubmit',
							maskPosition : 4,
							handler : function( btn, opts )
							{
								me.handleGroupActions( btn );
							}
						} );
					}
					else if (me.processingQueueTypeFilterVal == 'W')
						{

						me.getGroupActionsToolBar().add(
							
						{
							text : getLabel( 'cancle', 'Cancel' ),
							disabled : true,
							actionName : 'warehouseCancle',
							maskPosition : 2,
							handler : function( btn, opts )
							{
								me.handleGroupActions( btn );
							}
						},
						{
							text : getLabel( 'chnageDate', 'ChangeDate' ),
							disabled : true,
							actionName : 'changeDate',
							maskPosition : 1,
							handler : function( btn, opts )
							{
								me.handleGroupActions( btn );
							}
						},
						{
							text : getLabel( 'advance', 'Advance' ),
							disabled : true,
							actionName : 'warehouseAdvance',
							maskPosition : 3,
							handler : function( btn, opts )
							{
								me.handleGroupActions( btn );
							}
						},
						{
							text : getLabel( 'dealChange', 'DealChange' ),
							disabled : true,
							actionName : 'dealChange',
							maskPosition : 4,
							handler : function( btn, opts )
							{
								me.handleGroupActions( btn );
							}
						},
						{
							text : getLabel( 'submit', 'Submit' ),
							disabled : true,
							actionName : 'warehouseSubmit',
							maskPosition : 5,
							handler : function( btn, opts )
							{
								me.handleGroupActions( btn );
							}
						} );
					
						}
					else
					{
						me.getGroupActionsToolBar().add(
						{
							text : getLabel( 'cancle1', 'Cancel' ),
							disabled : true,
							actionName : 'verificationCancle',
							maskPosition : 1,
							handler : function( btn, opts )
							{
								me.handleGroupActions( btn );
							}
						},
						{
							text : getLabel( 'verify', 'Verify' ),
							disabled : true,
							actionName : 'verificationVerify',
							maskPosition : 2,
							handler : function( btn, opts )
							{
								me.handleGroupActions( btn );
							}
						},
						{
							text : getLabel( 'submit', 'Submit' ),
							disabled : true,
							actionName : 'verifiySubmit',
							maskPosition : 3,
							handler : function( btn, opts )
							{
								me.handleGroupActions( btn );
							}
						} );
					}
				}
			},
			handleProcessingQueueStatus : function( btn )
			{
				var me = this;
				me.toggleSavePreferencesAction( true );
				/*me.getAuthStatusToolBar().items.each( function( item )
				{
					item.removeCls( 'xn-custom-heighlight' );
					item.addCls( 'xn-account-filter-btnmenu' );
				} );*/
				btn.addCls( 'xn-custom-heighlight xn-account-filter-btnmenu' );
				me.processingQueueStatusFilterVal = btn.code;
				me.processingQueueStatusFilterDesc = btn.btnDesc;
				me.filterApplied = 'Q';
				me.setDataForFilter();
				me.applyQuickFilter();
			},
			setDataForFilter : function()
			{
				var me = this;
				me.getSearchTxnTextInput().setValue( '' );

				if( this.filterApplied === 'A' )
				{
					/*me.getProcessingQueuesToolBar().items.each( function( item )
					{
						item.removeCls( 'xn-custom-heighlight' );
						item.addCls( 'xn-account-filter-btnmenu' );
					} );*/
					var objOfCreateNewFilter = this.getCreateNewFilter();
					var objJson = objOfCreateNewFilter.getAdvancedFilterQueryJson( objOfCreateNewFilter );
					this.advFilterData = objJson;

					var filterCode = objOfCreateNewFilter.down( 'textfield[itemId="filterCode"]' ).getValue();
					this.advFilterCodeApplied = filterCode;
				}
				if( this.filterApplied === 'Q' )
				{
					var objToolbar = me.getAdvFilterActionToolBar();
					objToolbar.items.each( function( item )
					{
						item.removeCls( 'xn-custom-heighlight' );
					} );
					this.advFilterData = [];
					var str = "verificationQueue";
					if( me.processingQueueTypeFilterVal == 'D' )
						str = "debitQueue";
					else
						if( me.processingQueueTypeFilterVal == 'C' )
							str = "clearingQueue";
						else
							if( me.processingQueueTypeFilterVal == 'R' )
							str = "repairQueue";
							else
								if( me.processingQueueTypeFilterVal == 'W' )
								str = "warehouseQueue";
								else
									str = "verificationQueue";
					/*me.getProcessingQueuesToolBar().items.each( function( item )
					{
						item.removeCls( 'xn-custom-heighlight' );
						item.addCls( 'xn-account-filter-btnmenu' );
						if( str == item.btnId )
							item.addCls( 'xn-custom-heighlight xn-account-filter-btnmenu' );
					} );*/

					this.filterData = this.getQuickFilterQueryJson();
				}
			},
			getQuickFilterQueryJson : function()
			{
				var me = this;
				var jsonArray = [];
				var index = me.dateFilterVal;
				var processingQueueTypeFilterVal = me.processingQueueTypeFilterVal;
				var processingQueueSubTypeFilterVal = me.processingQueueSubTypeFilterVal;
				if( me.processingQueueTypeFilterVal != null )
				{
					//jsonArray.push(
					//{
					//	paramName : 't', //me.getProcessingQueuesToolBar().filterParamName,
					//	paramValue1 : me.processingQueueTypeFilterVal,
					//	operatorValue : 'eq',
					//	dataType : 'S'
					//} );
				}
				if( me.processingQueueSubTypeFilterVal != null)
				{
					//jsonArray.push(
					//{
					//	paramName : 't', //me.getQueueSubTypeToolBar().filterParamName,
					//	paramValue1 : me.processingQueueSubTypeFilterVal,
					//	operatorValue : 'eq',
					//	dataType : 'S'
					//} );
				}
				if( me.processingQueueStatusFilterVal != null && me.processingQueueStatusFilterVal != '' )
				{
					//jsonArray.push(
					//{
					//	paramName : 't',//me.getAuthStatusToolBar().filterParamName,
					//	paramValue1 : me.processingQueueStatusFilterVal,
					//	operatorValue : 'eq',
					//	dataType : 'S'
					//} );
				}
				if( me.processingQueueSellerVal != null && me.processingQueueSellerVal != 'All' )
				{
					//jsonArray.push(
					//{
					//	paramName : 'seller',
					//	paramValue1 : me.processingQueueSellerVal,
					//	operatorValue : 'eq',
					//	dataType : 'S'
					//} );
				}
				if( me.processingQueueClientVal != null && me.processingQueueClientVal != 'All' )
				{
					jsonArray.push(
					{
						paramName : 'client_name',
						paramValue1 : me.processingQueueClientVal,
						operatorValue : '=',
						dataType : 'S'
					} );
				}
				if( me.processingQueueSourceType != null )
				{
					//jsonArray.push(
					//{
					//	paramName : 'sourceType',
					//	paramValue1 : me.processingQueueSourceType,
					//	operatorValue : 'eq',
					//	dataType : 'S'
					//} );
				}

				return jsonArray;
			},
			applyQuickFilter : function()
			{
				var me = this;
				me.handleSmartGridConfig();
				me.filterApplied = 'Q';
				me.requestAllCounts();
			},

			requestAllCounts : function()
			{
				var me = this;
				var extraFilters = '$sourceType=' + me.processingQueueSourceType;
				
				if( me.processingQueueSellerVal != null && me.processingQueueSellerVal != 'All' )
				{
					extraFilters = extraFilters + '&$seller=' + me.processingQueueSellerVal;
				}
				if( me.processingQueueClientVal != null && me.processingQueueClientVal != 'All' )
				{
					extraFilters = extraFilters + '&$clientName=' + me.processingQueueClientVal;
				}
				var strUrl = 'getBankProcessingQueueStatusCounts.srvc?' + extraFilters + '&' + csrfTokenName + '=' + csrfTokenValue;
				$.ajax(
				{
					type : 'POST',
					// data : JSON.stringify( arrayJson ),
					url : strUrl,
					// contentType : "application/json",
					dataType : 'html',
					success : function( data )
					{
						var $response = $( data );
						me.setAllCounts( $response );
					},
					error : function( request, status, error )
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

			setAllCounts : function(responseData)
			{
				var me = this;
				
				/*me.getProcessingQueuesToolBar().items.each( function( item )
				{
					if( item.btnId == 'verificationQueue' )
						item.setText( getLabel( 'verificationQueue', 'Verification' ) + ' (' + responseData.find( '#verificationCnt' )[0].value + ')' );
				    else if( item.btnId == 'warehouseQueue' )
						item.setText( getLabel( 'warehouseQueue', 'Warehouse' ) + ' (' + responseData.find( '#warehouseCnt' )[0].value + ')' );
					else if( item.btnId == 'repairQueue' )
						item.setText( getLabel( 'repairQueue', 'Repair' ) + ' (' + responseData.find( '#repairCnt' )[0].value + ')' );
					else if( item.btnId == 'debitQueue' )
						item.setText( getLabel( 'debitQueue', 'Debit' ) + ' (' + responseData.find( '#debitCnt' )[0].value + ')' );
					else if( item.btnId == 'clearingQueue' )
						item.setText( getLabel( 'clearingQueue', 'Clearing Download' ) + ' (' + responseData.find( '#clrDwnldCnt' )[0].value + ')' );
				} );*/
				
				/*me.getQueueSubTypeToolBar().items.each( function( item )
				{
					if( me.processingQueueTypeFilterVal == 'V' )
					{
						if( item.btnId == 'verificationStatus' )
							item.setText( getLabel( 'verificationStatus', 'Verification' ) + ' (' + responseData.find( '#verificationVerificationCnt' )[0].value + ')' );
						else if( item.btnId == 'pendingAuthStatus' )
							item.setText( getLabel( 'pendingAuth', 'Pending Auth' ) + ' (' + responseData.find( '#verificationAuthCnt' )[0].value + ')' );
					}
					else if( me.processingQueueTypeFilterVal == 'W' )
					{
						if( item.btnId == 'warehouseStatus' )
							item.setText( getLabel( 'warehouseStatus', 'Warehouse' ) + ' (' + responseData.find( '#warehouseWarehouseCnt' )[0].value + ')' );
						else if( item.btnId == 'pendingAuthStatus' )
							item.setText( getLabel( 'pendingAuth', 'Pending Auth' ) + ' (' + responseData.find( '#warehouseAuthCnt' )[0].value + ')' );
					}
					else if( me.processingQueueTypeFilterVal == 'R' )
					{
						if( item.btnId == 'repairStatus' )
							item.setText( getLabel( 'repairStatus', 'Repair' ) + ' (' + responseData.find( '#repairRepairCnt' )[0].value + ')' );
						else if( item.btnId == 'pendingAuthStatus' )
							item.setText( getLabel( 'pendingAuth', 'Pending Auth' ) + ' (' + responseData.find( '#repairPendingAuthCnt' )[0].value + ')' );
					}
					else if( me.processingQueueTypeFilterVal == 'D' )
					{
						if( item.btnId == 'debitStatus' )
							item.setText( getLabel( 'debitStatus', 'Debit' ) + ' (' + responseData.find( '#debitDebitCnt' )[0].value + ')' );
						else if( item.btnId == 'pendingAuthStatus' )
							item.setText( getLabel( 'pendingAuth', 'Pending Auth' ) + ' (' + responseData.find( '#debitPendingAuthCnt' )[0].value + ')' );
					}
					else if( me.processingQueueTypeFilterVal == 'C' )
					{
						if( item.btnId == 'debitedStatus' )
							item.setText( getLabel( 'debitedStatus', 'Debited' ) + ' (' + responseData.find( '#clrDwnldDebitCnt' )[0].value + ')' );
						else if( item.btnId == 'holdStatus' )
							item.setText( getLabel( 'holdStatus', 'Hold' ) + ' (' + responseData.find( '#clrDwnldHoldCnt' )[0].value + ')' );
						else if( item.btnId == 'pendingAuthStatus' )
							item.setText( getLabel( 'pendingAuth', 'Pending Auth' ) + ' (' + responseData.find( '#clrDwnldPendingAuthCnt' )[0].value + ')' );
					}
				} );
				
				me.getAuthStatusToolBar().items.each( function( item )
				{
					if( me.processingQueueTypeFilterVal == 'R' && me.processingQueueSubTypeFilterVal == '2' )
					{
						if( item.btnId == 'repairAuthStatus' )
							item.setText( getLabel( 'repairAuthStatus', 'Repair' ) + ' (' + responseData.find( '#repairPendingAuthRepairCnt' )[0].value + ')' );
						else if( item.btnId == 'rejectAuthStatus' )
							item.setText( getLabel( 'rejectAuthStatus', 'Reject' ) + ' (' + responseData.find( '#repairPendingAuthRejectCnt' )[0].value + ')' );
					}
					else if( me.processingQueueTypeFilterVal == 'D' && me.processingQueueSubTypeFilterVal == '2' )
					{
						if( item.btnId == 'manualConfirmAuthStatus' )
							item.setText( getLabel( 'manualConfirmAuthStatus', 'Manual Confirm' ) + ' (' + responseData.find( '#debitPendingAuthManulCnfrmCnt' )[0].value + ')' );
						else if( item.btnId == 'manualRejectAuthStatus' )
							item.setText( getLabel( 'manualRejectAuthStatus', 'Manual Reject' ) + ' (' + responseData.find( '#debitPendingAuthManulRjctCnt' )[0].value + ')' );
						else if( item.btnId == 'dateChageAuthStatus' )
							item.setText( getLabel( 'dateChageAuthStatus', 'Date Change' ) + ' (' + responseData.find( '#debitPendingAuthChangeDtCnt' )[0].value + ')' );
						else if( item.btnId == 'cancelAuthStatus' )
							item.setText( getLabel( 'cancelAuthStatus', 'Cancel' ) + ' (' + responseData.find( '#debitPendingAuthTxnCancelCnt' )[0].value + ')' );
						else if( item.btnId == 'manualResendAuthStatus' )
							item.setText( getLabel( 'manualResendAuthStatus', 'Resend' ) + ' (' + responseData.find( '#debitPendingAuthTxnResendCnt' )[0].value + ')' );
						else if( item.btnId == 'enforceDebitAuthStatus' )
							item.setText( getLabel( 'btnEnforceDebit', 'Enforce Debit' ) + ' (' + responseData.find( '#debitPendingAuthEnforceDebitCnt' )[0].value + ')' );
						
					}
					else if( me.processingQueueTypeFilterVal == 'C' && me.processingQueueSubTypeFilterVal == '2' )
					{
						if( item.btnId == 'dateChageAuthStatus' )
							item.setText( getLabel( 'dateChageAuthStatus', 'Date Change' ) + ' (' + responseData.find( '#clrDwnldPendingAuthChangeDtCnt' )[0].value + ')' );
						else if( item.btnId == 'cancelAuthStatus' )
							item.setText( getLabel( 'cancelAuthStatus', 'Cancel' ) + ' (' + responseData.find( '#clrDwnldPendingAuthCancelCnt' )[0].value + ')' );
					}
				} );*/
			},

			applyFilter : function()
			{
				var me = this;
				me.handleSmartGridConfig();
				me.filterApplied = 'A';
				me.requestAllCounts();
			},
			handleSmartGridConfig : function()
			{
				var me = this;
				var bankProcessingQueueGrid = me.getBankProcessingQueueGrid();
				var objPref = null, arrCols = new Array(), arrColsPref = null, pgSize = null;
				var objConfigMap = me.getBankProcessingQueueConfiguration();
				var bankProcessingQueueDtlView = me.getBankProcessingQueueDtlView();
				if( !Ext.isEmpty( bankProcessingQueueGrid ) )
					bankProcessingQueueGrid.destroy( true );
				if( !Ext.isEmpty( objGridViewPref ) )
				{
					var data = Ext.decode( objGridViewPref );
					objPref = data[ 0 ];
					arrColsPref = objPref.gridCols;
					arrCols = me.getColumns( arrColsPref, objConfigMap.objWidthMap );
					pgSize = !Ext.isEmpty( objPref.pgSize ) ? parseInt( objPref.pgSize,10 ) : parseInt(_GridSizeTxn,10);
					me.handleSmartGridLoading( arrCols, objConfigMap.storeModel, pgSize );
				}
				else
					if( objConfigMap.arrColsPrefRepair && me.processingQueueTypeFilterVal == 'R' )
					{
						arrCols = me.getColumns( objConfigMap.arrColsPrefRepair, objConfigMap.objWidthMap );
						pgSize = parseInt(_GridSizeTxn,10);
						//bankProcessingQueueDtlView.setTitle( getLabel( 'repairTxns', 'Repair' ) )
						me.handleSmartGridLoading( arrCols, objConfigMap.storeModel, pgSize );
					}
				else
					if( objConfigMap.arrColsPrefDebit && me.processingQueueTypeFilterVal == 'D' )
					{
						arrCols = me.getColumns( objConfigMap.arrColsPrefDebit, objConfigMap.objWidthMap );
						pgSize = 10;
						//bankProcessingQueueDtlView.setTitle( getLabel( 'debitTxns', 'Debit' ) )
						me.handleSmartGridLoading( arrCols, objConfigMap.storeModel, pgSize );
					}
				else
					if( objConfigMap.arrColsPrefClearing && me.processingQueueTypeFilterVal == 'C' )
					{
						arrCols = me.getColumns( objConfigMap.arrColsPrefClearing, objConfigMap.objWidthMap );
						pgSize = 10;
						//bankProcessingQueueDtlView.setTitle( getLabel( 'clearingDownloadTxns', 'Clearing Download' ) )
						me.handleSmartGridLoading( arrCols, objConfigMap.storeModel, pgSize );
					}
				else
					if( objConfigMap.arrColsPrefWarehouse && me.processingQueueTypeFilterVal == 'W' )
					{
						arrCols = me.getColumns( objConfigMap.arrColsPrefWarehouse, objConfigMap.objWidthMap );
						pgSize = 10;
						//bankProcessingQueueDtlView.setTitle( getLabel( 'warehouseTxns', 'Warehouse' ) )
						me.handleSmartGridLoading( arrCols, objConfigMap.storeModel, pgSize );
					}
				else
					if( objConfigMap.arrColsPrefVerification && me.processingQueueTypeFilterVal == 'V' )
					{
						arrCols = me.getColumns( objConfigMap.arrColsMigrationSummary, objConfigMap.objWidthMapMigration );
						pgSize = 10;
						//bankProcessingQueueDtlView.setTitle( getLabel( 'lblSummary', 'Verification' ) )
						me.handleSmartGridLoading( arrCols, objConfigMap.storeModelMigration, pgSize );
					}
							

			},

			handleSmartGridLoading : function( arrCols, storeModel, pgSize )
			{
				var me = this;
				var pgSize = pgSize;
				//var bankProcessingQueueGrid = null;
				bankProcessingQueueGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'gridViewMstId',
					itemId : 'gridViewMstId',
					pageSize : pgSize,
					autoDestroy : true,
					showCheckBoxColumn : true,
					hideRowNumbererColumn : false,
					stateful : false,
					showEmptyRow : false,
					showSummaryRow : false,
					rowList :_AvailableGridSize,
					minHeight : 140,
					rowNumbererColumnWidth : 50,
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
				var bankProcessingQueueDtlView = me.getBankProcessingQueueDtlView();
				bankProcessingQueueDtlView.add( bankProcessingQueueGrid );
				bankProcessingQueueDtlView.doLayout();
				bankProcessingQueueGrid.on( 'cellclick', function( view, td, cellIndex, record, tr, rowIndex, e, eOpts )
				{ 
					var linkClicked = ( e.target.tagName == 'SPAN' );
					var generateClicked = ( e.target.tagName == 'A' );
					var imgClicked = ( e.target.tagName == 'IMG' );
					var strClient = record.get('clientName');
					var strClientId = record.get('clientId');
					var clickedId = e.target.id ; 
					
					//if( clickedId == 'seeAccounts'  && cellIndex == 6){
					//	me.objPreGenPopup = Ext.create( 'GCP.view.EntityListPopup' );
					//	me.objPreGenPopup.show();
					//}
					//else 
					if( clickedId == 'seeServicePackages'  && cellIndex == 1){
							me.objPreGenPopup = Ext.create( 'GCP.view.EntityListPopup', {
							strFilter : strClient,
							strFilterId : strClientId,
							items: [{
								xtype: 'radiogroup',
								itemId: 'myMatchSelection',
								items: [
										{
											xtype: 'radiofield',
											boxLabel: 'Automatch',
											name: 'framework',
											checked: true,
											inputValue: 'Automatch',
											width: 100
										},
										{
											xtype: 'radiofield',
											boxLabel: 'All',
											name: 'framework',
											inputValue: 'All'
										}
								],
								listeners: {
									change: function (cb, nv, ov) {
										var elemGrid = Ext.getCmp( 'migEntityGridViewId' );
										if (nv.framework == 'Automatch') {
											me.switchMatchCriteria('Automatch',elemGrid,strClient,strClientId);
										}
										else{
											me.switchMatchCriteria('All',elemGrid,strClient,strClientId);
										}
									}
								}					
							},
							{
								xtype : 'migEntityGridView',
								itemId: 'migEntityGridViewItem',
								//loadMask: true,
								strFilterClient : strClient,
								strFilterClientId : strClientId
							}]
						} );
						//var myMask = new Ext.LoadMask(me.objPreGenPopup, {msg:"Please wait..."});
						me.objPreGenPopup.show();
                                                var svcGrid = Ext.getCmp( 'migEntityGridViewId' );
                                                svcGrid.setLoading('Loading...');
                                                var strUrl = 'migrationBrandingPackageList.srvc?';
                                                var nv = 'Automatch';
                                                Ext.Ajax.request(
                                                {
                                                        url : strUrl+csrfTokenName+"="+csrfTokenValue+"&$clientName="+strClient+"&$matchCriteria="+nv+"&$clientId="+strClientId,
                                                        method : 'GET',
                                                        success : function( response )
                                                        {
                                                                var decodedJson = Ext.decode( response.responseText );
                                                                var arrJson = new Array();
                                                                for( i = 0 ; i < decodedJson.length ; i++ )
                                                                {				   					
                                                                        arrJson.push(
                                                                        {
                                                                                                                
                                                                                "brandingPackage" : decodedJson[i].BRANDINGPACKAGE,
                                                                                "servicesGCP"	: decodedJson[i].SERVICESGCP,
                                                                                "servicesCP"	: decodedJson[i].SERVICESCP
                                                                        } );
                                                                }
                                                                svcGrid.store.loadRawData( arrJson );
                                                                svcGrid.setLoading( false );
                                                        },
                                                        failure : function()
                                                        {
                                                                svcGrid.setLoading( false );
                                                                Ext.MessageBox.show(
                                                                {
                                                                        title : getLabel( 'errorTitle', 'Error' ),
                                                                        msg : getLabel( 'investCenterErrorPopUpMsg', 'Error while fetching data..!' ),
                                                                        buttons : Ext.MessageBox.OK,
                                                                        icon : Ext.MessageBox.ERROR
                                                                } );
                                                        }
                                                } );                                               
						//myMask.show();
						//emulate 5 sec work
						//var task = new Ext.util.DelayedTask(function(){myMask.hide();});      
						//task.delay(5000);    
					}
					//if( clickedId == 'seeUsers'  && cellIndex == 8){
					//	alert(' Users will get displayed here!');
					//}
				});
			},

			handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
			{
				var me = this;
				var actionName = btn.itemId;
				if( actionName === 'btnHistory' )
				{
					var recHistory = record.get('history');
					if (!Ext.isEmpty(recHistory)
							&& !Ext.isEmpty(recHistory.__deferred.uri)) {
						me.showHistory(record.get('history').__deferred.uri, record.get('identifier'));
					}
				}
				else
				{
					if( actionName === 'btnView' )
						me.viewMirgationClient(record,rowIndex);
					else
						me.handleGroupActions( btn, record );
				}
			},
			showHistory : function(url, id) {
				Ext.create('GCP.view.HistoryPopup', {
							historyUrl : url+'?'+csrfTokenName+'='+csrfTokenValue,
							identifier : id
						}).show();
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
				strUrl = 'userfilters/bankProcessingQueue/{0}/remove.srvc?';
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
					url : 'userfilterslist/bankProcessingQueue.srvc?' + csrfTokenName + "=" + csrfTokenValue,
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
			getBankProcessingQueueConfiguration : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPrefRepair = null;
				var arrColsPrefDebit = null;
				var arrColsPrefClearing = null;
				var arrColsPrefWarehouse = null;
				var arrColsPrefVerification = null;
				var arrColsMigrationSummary = null;
				var objWidthMapMigration = null
				var storeModel = null;
				var storeModelMigration = null;

				objWidthMap =
				{
					"clientName" : 90,
					"reference" : 100,
					"sendingAcc" : 100,
					"productDescription" : 220,
					"receivedDate" : 80,
					"processDate" : 80,
					"effectiveDate" : 100,
					"totalInstAmount" : 80,
					"totalTxns" : 50,
//					"scheduledDate" : 100,
					"hostErrorReason" : 100,
					"NextDownloadSchedule" : 100,
					"statusDesc" : 170
				};
				
				objWidthMapMigration =
				{
					"clientName" : 200,
					"brandingPackages" : 200,
					"servicePackage" : 200,
					"status" : 200,
					"gaps" : 90,
					"newGaps" : 90,
					"positive" : 90,
					"accounts" : 90,
					"services" : 90,
					"users" : 90,
					"roles" : 90,
					"reports" : 90,
					"pmtProfiles" : 100,
					"imports" : 90
				};
				
				arrColsMigrationSummary =
				[
					{
						"colId" : "clientName",
						"colDesc" : "Company Name"
					},
					{
						"colId" : "brandingPackages",
						"colDesc" : "Matching Service Packages",
						"colType" : "number"
					},
					{
						"colId" : "servicePackage",
						"colDesc" : "Service Package Name"
					},
					{
						"colId" : "status",
						"colDesc" : "Status"
					},
					/*{
						"colId" : "gaps",
						"colDesc" : "Gaps",
						"colType" : "number"
					},
					{
						"colId" : "newGaps",
						"colDesc" : "New Gaps",
						"colType" : "number"
					},
					{
						"colId" : "positive",
						"colDesc" : "Positive",
						"colType" : "number"
					},*/
					{
						"colId" : "accounts",
						"colDesc" : "Accounts",
						"colType" : "number"
					},
					{
						"colId" : "services",
						"colDesc" : "Services",
						"colType" : "number"
					}/*,
					{
						"colId" : "users",
						"colDesc" : "Users",
						"colType" : "number"
					},
					{
						"colId" : "roles",
						"colDesc" : "Roles",
						"colType" : "number"
					},
					{
						"colId" : "reports",
						"colDesc" : "Reports",
						"colType" : "number"
					},
					{
						"colId" : "pmtProfiles",
						"colDesc" : "Pmt Profiles",
						"colType" : "number"
					},
					{
						"colId" : "imports",
						"colDesc" : "Imports",
						"colType" : "number"
					}*/
				];
				
				arrColsPrefVerification =
				[
					{
						"colId" : "clientName",
						"colDesc" : "Company Name",
						hidden : true
					},
					{
						"colId" : "reference",
						"colDesc" : "Payement ref"
					},
					{
						"colId" : "sendingAcc",
						"colDesc" : "Debit Account",
						hidden : true
					},
					{
						"colId" : "productDescription",
						"colDesc" : "Payment Product",
						hidden : true			
					},
					{
						"colId" : "receivedDate",
						"colDesc" : "Received On",
						hidden : true
					},
					{
						"colId" : "totalInstAmount",
						"colDesc" : "Amount",
						"colType" : "number"
					},
					{
						"colId" : "totalTxns",
						"colDesc" : "Count",
						"colType" : "number"
					},
					{
						"colId" : "receiverId",
						"colDesc" : "Receiver ID"
					},
					{
						"colId" : "paymentPkgName",
						"colDesc" : "Payment Package Name"
					},
					{
						"colId" : "effectiveDate",
						"colDesc" : "Effective Date"
					},
					{
						"colId" : "makerAction",
						"colDesc" : "Change type"
					},
					{
						"colId" : "changeDate",
						"colDesc" : "New Value"
					},
					{
						"colId" : "statusDesc",
						"colDesc" : "Status"
					},
					{
						"colId" : "amountType",
						"colDesc" : "Amount",
						hidden : true
					},
					{
						"colId" : "bankIdType",
						"colDesc" : "Bank Id",
						hidden : true
					},
					{
						"colId" : "bankRoutingNumber",
						"colDesc" : "Bank Routing Number",
						hidden : true
					},
					{
						"colId" : "glAction",
						"colDesc" : "GL Action",
						hidden : true
					},
					{
						"colId" : "hostErrorCode",
						"colDesc" : "Host ErrorCode",
						hidden : true
					},
					{
						"colId" : "nextDownloadSchedule",
						"colDesc" : "Next Download Schedule",
						hidden : true
					},
					{
						"colId" : "seller",
						"colDesc" : "Office",
						hidden : true
					},
					{
						"colId" : "processDate",
						"colDesc" : "Process Date",
						hidden : true
					},
					{
						"colId" : "receiverAcc",
						"colDesc" : "Receiver Account",
						hidden : true
					},
					{
						"colId" : "receiverBank",
						"colDesc" : "Receiver Bank",
						hidden : true
					},
					{
						"colId" : "receiverBranch",
						"colDesc" : "Receiver Branch",
						hidden : true
					},
					{
						"colId" : "receiverName",
						"colDesc" : "Receiver Name",
						hidden : true
					},
/*					{
						"colId" : "sendingAcc",
						"colDesc" : "Sending Account",
						hidden : true
					},
*/					{
						"colId" : "sourceType",
						"colDesc" : "Source Type",
						hidden : true
					},
					/*{
						"colId" : "totalInstAmount",
						"colDesc" : "Total Instruction Amount",
						hidden : true
					},*/
					{
						"colId" : "transactionType",
						"colDesc" : "Transaction Type",
						hidden : true
					}
				
				 ];
				arrColsPrefWarehouse =
				[
					{
						"colId" : "clientName",
						"colDesc" : "Company Name",
						hidden : true
					},
					{
						"colId" : "reference",
						"colDesc" : "Payement ref"
					},
					{
						"colId" : "sendingAcc",
						"colDesc" : "Debit Account",
						hidden : true
					},
					{
						"colId" : "productDescription",
						"colDesc" : "Payment Product",
						hidden : true
					},
					{
						"colId" : "receivedDate",
						"colDesc" : "Received On",
						hidden : true
					},
					{
						"colId" : "totalInstAmount",
						"colDesc" : "Amount",
						"colType" : "number"
					},
					{
						"colId" : "totalTxns",
						"colDesc" : "Count",
						"colType" : "number"
					},
					{
						"colId" : "receiverId",
						"colDesc" : "Receiver ID"
					},
					{
						"colId" : "paymentPkgName",
						"colDesc" : "Payment Package Name"
					},
					{
						"colId" : "effectiveDate",
						"colDesc" : "Effective Date"
					},
					{
						"colId" : "makerAction",
						"colDesc" : "Change type"
					},
					{
						"colId" : "changeDate",
						"colDesc" : "New Value"
					},
					{
						"colId" : "statusDesc",
						"colDesc" : "Status"
					},
					{
						"colId" : "amountType",
						"colDesc" : "Amount",
						hidden : true
					},
					{
						"colId" : "bankIdType",
						"colDesc" : "Bank Id",
						hidden : true
					},
					{
						"colId" : "bankRoutingNumber",
						"colDesc" : "Bank Routing Number",
						hidden : true
					},
					{
						"colId" : "glAction",
						"colDesc" : "GL Action",
						hidden : true
					},
					{
						"colId" : "hostErrorCode",
						"colDesc" : "Host ErrorCode",
						hidden : true
					},
					{
						"colId" : "nextDownloadSchedule",
						"colDesc" : "Next Download Schedule",
						hidden : true
					},
					{
						"colId" : "seller",
						"colDesc" : "Office",
						hidden : true
					},
					
					{
						"colId" : "processDate",
						"colDesc" : "Process Date",
						hidden : true
					},
					{
						"colId" : "receiverAcc",
						"colDesc" : "Receiver Account",
						hidden : true
					},
					{
						"colId" : "receiverBank",
						"colDesc" : "Receiver Bank",
						hidden : true
					},
					{
						"colId" : "receiverBranch",
						"colDesc" : "Receiver Branch",
						hidden : true
					},
					
					{
						"colId" : "receiverName",
						"colDesc" : "Receiver Name",
						hidden : true
					},
/*					{
						"colId" : "sendingAcc",
						"colDesc" : "Sending Account",
						hidden : true
					},
*/					{
						"colId" : "sourceType",
						"colDesc" : "Source Type",
						hidden : true
					},
					/*{
						"colId" : "totalInstAmount",
						"colDesc" : "Total Instruction Amount",
						hidden : true
					},*/
					{
						"colId" : "transactionType",
						"colDesc" : "Transaction Type",
						hidden : true
					}
				];
				arrColsPrefRepair =
				[
					{
						"colId" : "clientName",
						"colDesc" : "Company Name"
					},
					{
						"colId" : "reference",
						"colDesc" : "Payement ref"
					},
					{
						"colId" : "sendingAcc",
						"colDesc" : "Debit Account"
					},
					{
						"colId" : "productDescription",
						"colDesc" : "Payment Product"
					},
					{
						"colId" : "receivedDate",
						"colDesc" : "Received On"
					},
					{
						"colId" : "effectiveDate",
						"colDesc" : "Effective Date"
					},
					{
						"colId" : "totalInstAmount",
						"colDesc" : "Amount",
						"colType" : "number"
					},
					{
						"colId" : "totalTxns",
						"colDesc" : "Count",
						"colType" : "number"
					},
					{
						"colId" : "statusDesc",
						"colDesc" : "Status"
					},
					{
						"colId" : "amountType",
						"colDesc" : "Amount",
						hidden : true
					},
					{
						"colId" : "bankIdType",
						"colDesc" : "Bank Id",
						hidden : true
					},
					{
						"colId" : "bankRoutingNumber",
						"colDesc" : "Bank Routing Number",
						hidden : true
					},
					{
						"colId" : "glAction",
						"colDesc" : "GL Action",
						hidden : true
					},
					{
						"colId" : "hostErrorCode",
						"colDesc" : "Host ErrorCode",
						hidden : true
					},
					{
						"colId" : "nextDownloadSchedule",
						"colDesc" : "Next Download Schedule",
						hidden : true
					},
					{
						"colId" : "seller",
						"colDesc" : "Office",
						hidden : true
					},
					{
						"colId" : "paymentPkgName",
						"colDesc" : "Payment Package Name",
						hidden : true
					},
					{
						"colId" : "processDate",
						"colDesc" : "Process Date",
						hidden : true
					},
					{
						"colId" : "receiverAcc",
						"colDesc" : "Receiver Account",
						hidden : true
					},
					{
						"colId" : "receiverBank",
						"colDesc" : "Receiver Bank",
						hidden : true
					},
					{
						"colId" : "receiverBranch",
						"colDesc" : "Receiver Branch",
						hidden : true
					},
					{
						"colId" : "receiverId",
						"colDesc" : "Receiver ID",
						hidden : true
					},
					{
						"colId" : "receiverName",
						"colDesc" : "Receiver Name",
						hidden : true
					},
/*					{
						"colId" : "sendingAcc",
						"colDesc" : "Sending Account",
						hidden : true
					},
*/					{
						"colId" : "sourceType",
						"colDesc" : "Source Type",
						hidden : true
					},
					/*{
						"colId" : "totalInstAmount",
						"colDesc" : "Total Instruction Amount",
						hidden : true
					},*/
					{
						"colId" : "transactionType",
						"colDesc" : "Transaction Type",
						hidden : true
					}

				];
				arrColsPrefDebit =
				[
					{
						"colId" : "clientName",
						"colDesc" : "Company Name"
					},
					{
						"colId" : "reference",
						"colDesc" : "Payement ref"
					},
					{
						"colId" : "sendingAcc",
						"colDesc" : "Debit Account"
					},
					{
						"colId" : "productDescription",
						"colDesc" : "Payment Product"
					},
					{
						"colId" : "processDate",
						"colDesc" : "Debit Date"
					},
					{
						"colId" : "effectiveDate",
						"colDesc" : "Effective Date"
					},
					{
						"colId" : "totalInstAmount",
						"colDesc" : "Amount",
						"colType" : "number"
					},
					{
						"colId" : "totalTxns",
						"colDesc" : "Count",
						"colType" : "number"
					},
					{
						"colId" : "hostErrorReason",
						"colDesc" : "Host Error"
					},
					{
						"colId" : "statusDesc",
						"colDesc" : "Status"
					},
					{
						"colId" : "amountType",
						"colDesc" : "Amount Type",
						hidden : true
					},
					{
						"colId" : "bankIdType",
						"colDesc" : "Bank Id",
						hidden : true
					},
					{
						"colId" : "bankRoutingNumber",
						"colDesc" : "Bank Routing Number",
						hidden : true
					},
					{
						"colId" : "glAction",
						"colDesc" : "GL Action",
						hidden : true
					},
					{
						"colId" : "nextDownloadSchedule",
						"colDesc" : "Next Download Schedule",
						hidden : true
					},
					{
						"colId" : "seller",
						"colDesc" : "Office",
						hidden : true
					},
					{
						"colId" : "paymentPkgName",
						"colDesc" : "Payment Package Name",
						hidden : true
					},
					{
						"colId" : "receivedDate",
						"colDesc" : "Received On",
						hidden : true
					},
					{
						"colId" : "receiverAcc",
						"colDesc" : "Receiver Account",
						hidden : true
					},
					{
						"colId" : "receiverBank",
						"colDesc" : "Receiver Bank",
						hidden : true
					},
					{
						"colId" : "receiverBranch",
						"colDesc" : "Receiver Branch",
						hidden : true
					},
					{

						"colId" : "receiverId",
						"colDesc" : "Receiver ID",
						hidden : true
					},
					{
						"colId" : "receiverName",
						"colDesc" : "Receiver Name",
						hidden : true
					},
					/*{
						"colId" : "sendingAcc",
						"colDesc" : "Sending Account",
						hidden : true
					},*/
					{
						"colId" : "sourceType",
						"colDesc" : "Source Type",
						hidden : true
					},
					/*{
						"colId" : "totalInstAmount",
						"colDesc" : "Total Instruction Amount",
						hidden : true
					},*/
					{
						"colId" : "transactionType",
						"colDesc" : "Transaction Type",
						hidden : true
					}

				];
				arrColsPrefClearing =
				[
					{
						"colId" : "clientName",
						"colDesc" : "Company Name"
					},
					{
						"colId" : "reference",
						"colDesc" : "Payement ref"
					},
					{
						"colId" : "sendingAcc",
						"colDesc" : "Debit Account"
					},
					{
						"colId" : "productDescription",
						"colDesc" : "Payment Product"
					},
					{
						"colId" : "processDate",
						"colDesc" : "Process Date"
					},
					{
						"colId" : "effectiveDate",
						"colDesc" : "Effective Date"
					},
					{
						"colId" : "totalInstAmount",
						"colDesc" : "Amount",
						"colType" : "number"
					},
					{
						"colId" : "totalTxns",
						"colDesc" : "Count",
						"colType" : "number"
					},
					{
						"colId" : "nextDownloadSchedule",
						"colDesc" : "Next Download Schedule"
					},
					{
						"colId" : "statusDesc",
						"colDesc" : "Status"
					},
					{
						"colId" : "amountType",
						"colDesc" : "Amount Type",
						hidden : true
					},
					{
						"colId" : "bankIdType",
						"colDesc" : "Bank Id",
						hidden : true
					},
					{
						"colId" : "bankRoutingNumber",
						"colDesc" : "Bank Routing Number",
						hidden : true
					},
					{
						"colId" : "glAction",
						"colDesc" : "GL Action",
						hidden : true
					},
					{
						"colId" : "hostErrorCode",
						"colDesc" : "Host ErrorCode",
						hidden : true

					},
					{
						"colId" : "seller",
						"colDesc" : "Office",
						hidden : true
					},
					{
						"colId" : "PaymentPkgName",
						"colDesc" : "Payment Package Name",
						hidden : true
					},
					{
						"colId" : "receivedDate",
						"colDesc" : "Received On",
						hidden : true
					},
					{
						"colId" : "receiverAcc",
						"colDesc" : "Receiver Account",
						hidden : true
					},
					{
						"colId" : "receiverBank",
						"colDesc" : "Receiver Bank",
						hidden : true
					},
					{
						"colId" : "receiverBranch",
						"colDesc" : "Receiver Branch",
						hidden : true
					},
					{
						"colId" : "receiverId",
						"colDesc" : "Receiver ID",
						hidden : true
					},
					{
						"colId" : "receiverName",
						"colDesc" : "Receiver Name",
						hidden : true
					},
				/*	{
						"colId" : "sendingAcc",
						"colDesc" : "Sending Account",
						hidden : true
					},*/
					{
						"colId" : "sourceType",
						"colDesc" : "Source Type",
						hidden : true
					},
					/*{
						"colId" : "totalInstAmount",
						"colDesc" : "Total Instruction Amount",
						hidden : true
					},*/
					{
						"colId" : "transactionType",
						"colDesc" : "Transaction Type",
						hidden : true
					}

				];
				storeModel =
				{
					fields :
					[
						'history', 'clientName', 'reference', 'sendingAcc', 'productDescription', 'processDate', 'receivedDate',
						'effectiveDate', 'totalInstAmount', 'totalTxns', 'nextDownloadSchedule', 'hostErrorCode', 'hostErrorReason','queueType','transactionType',
						'statusDesc', 'status','makerAction','changeDate', 'identifier','cwPirNmbr','repairQueue','debitQueue', 'clearingQueue', 'myProduct', 'pirNmbr', 'clientId', '__metadata', '__subTotal'
					],
					proxyUrl : 'getBankProcessingQueueList.srvc',
					rootNode : 'd.bankProcessingQueue',
					totalRowsNode : 'd.__count'
				};

				storeModelMigration =
				{
					fields :
					[
						'history', 'clientName', 'servicePackage', 'gaps', 'newGaps', 'positive', 'accounts', 'isSubmitted',
						'services', 'users', 'roles', 'reports', 'pmtProfiles', 'imports','queueType','transactionType',
						'statusDesc', 'status', 'brandingPackages','makerAction','changeDate', 'identifier','cwPirNmbr','repairQueue','debitQueue', 'clearingQueue', 'myProduct', 'pirNmbr', 'clientId', '__metadata', '__subTotal'
					],
					proxyUrl : 'getMigrationSummaryList.srvc',
					rootNode : 'd.bankProcessingQueue',
					totalRowsNode : 'd.__count'
				};
				
				objConfigMap =
				{
					"objWidthMap" : objWidthMap,
					"objWidthMapMigration" : objWidthMapMigration,
					"arrColsPrefVerification" :arrColsPrefVerification,
					"arrColsMigrationSummary" :arrColsMigrationSummary,
					"arrColsPrefWarehouse" : arrColsPrefWarehouse,
					"arrColsPrefRepair" : arrColsPrefRepair,
					"arrColsPrefDebit" : arrColsPrefDebit,
					"arrColsPrefClearing" : arrColsPrefClearing,
					"storeModel" : storeModel,
					"storeModelMigration" : storeModelMigration
				};
				
				/*objConfigMap =
				{
					"objWidthMap" : objWidthMap,
					"arrColsPrefVerification" :arrColsPrefVerification,
					"arrColsPrefWarehouse" : arrColsPrefWarehouse,
					"arrColsPrefRepair" : arrColsPrefRepair,
					"arrColsPrefDebit" : arrColsPrefDebit,
					"arrColsPrefClearing" : arrColsPrefClearing,
					"storeModel" : storeModel
				};*/
				
				return objConfigMap;
			},
			clientAccPopup : function( record )
			{
				var me = this;
				me.objPreGenPopup = Ext.create( 'GCP.view.BankProcessingQueueAdvancedFilterPopup' );
				me.objPreGenPopup.show();
				//alert('I am Inside');
				//var me = this;
				//me.handlePreGenSmartGridConfig( record );
				//if( !Ext.isEmpty( me.objPreGenPopup ) )
				//{
				//	me.objPreGenPopup.show();
				//}
				//else
				//{
				//	me.objPreGenPopup = Ext.create( 'GCP.view.ReportCenterPreGenPopup' );
				//	me.objPreGenPopup.show();
				//}
			},
			handleLoadGridData : function( grid, url, pgSize, newPgNo, oldPgNo, sorter )
			{
				var me = this;
				var strUrl = url;
				me.setDataForFilter();
				if( !Ext.isEmpty(me.processingQueueTypeFilterVal) && 'R'==me.processingQueueTypeFilterVal )
				{
					strUrl = 'getBankProcessingRepairQueueList.srvc'; 				
				}
				strUrl = grid.generateUrl(strUrl, pgSize, newPgNo, oldPgNo, sorter );				
				strUrl = strUrl + me.getFilterUrl() + "&$batchInstFltr=" 
                                + me.processingQueueSourceType + "&" + csrfTokenName + "=" + csrfTokenValue;
				grid.loadGridData( strUrl, null );
				me.enableDisableGroupActions( null, null, false, false, false, false);
			},
			getFilterUrl : function()
			{

				var me = this;
				var strQuickFilterUrl = '', strActionStatusUrl = '', strAdvancedFilterUrl = '', strUrl = '', isFilterApplied = false;
				// Always taking Quick filter hence condition commented
				/*if( me.filterApplied === 'ALL' || me.filterApplied === 'Q' )
				{*/
					strQuickFilterUrl = me.generateUrlWithQuickFilterParams( me );
					if( !Ext.isEmpty( strQuickFilterUrl ) )
					{
						strUrl = strQuickFilterUrl;
						isFilterApplied = true;
					}
				/*}
				else*/
					// if advance filter applied then append it with quick filter in the final url
					if( me.filterApplied === 'A' )
					{
						strAdvancedFilterUrl = me.generateUrlWithAdvancedFilterParams( me );
						if( !Ext.isEmpty( strAdvancedFilterUrl ) )
						{
							strUrl = strQuickFilterUrl + ' and ' + strAdvancedFilterUrl;
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
				// advance filter will always get combined with quick filter hence commented $filter
				//var strFilter = '&$filter=';
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
				objCreateNewFilterPanel.enableDisableFields( objCreateNewFilterPanel, true );
				var record = grid.getStore().getAt( rowIndex );
				var filterCode = record.data.filterName;
				
				objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).setValue( filterCode );
				objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).setDisabled( true );
				var objTabPanel = me.getAdvanceFilterTabPanel();
				var applyAdvFilter = false;

				me.getSaveSearchBtn().hide();

				me.getSavedFilterData( filterCode, this.populateSavedFilter, applyAdvFilter );

				objTabPanel.setActiveTab( 1 );
			},					
			getSavedFilterData : function( filterCode, fnCallback, applyAdvFilter )
			{
				var me = this;
				var objOfCreateNewFilter = me.getCreateNewFilter();
				var objJson;
				var strUrl = 'userfilters/bankProcessingQueue/{0}.srvc?';

				strUrl = Ext.String.format( strUrl, filterCode );
				Ext.Ajax.request(
				{
					url : strUrl + csrfTokenName + "=" + csrfTokenValue,
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
				var fieldName;
				var fieldOper;
				var fieldVal;
				var fieldType;

				for( i = 0 ; i < filterData.filterBy.length ; i++ )
				{
					fieldName = filterData.filterBy[ i ].field;

					fieldOper = filterData.filterBy[ i ].operator;

					fieldVal = filterData.filterBy[ i ].value1;

					if( fieldName === 'branchRadio' )
						fieldType = 'radiogroup';
					else if( fieldName === 'fileName' || fieldName === 'batchAmount' || fieldName === 'totalTxns' 
								|| fieldName === 'debitAccountName' || fieldName === 'reference')
						fieldType = 'textfield';
					else if( fieldName === 'branchSeek' || fieldName === 'paymentPkgName' || fieldName === 'productCode'
								|| fieldName === 'debitAccount' || fieldName === 'makerId')
						fieldType = 'AutoCompleter';
					else if( fieldName === 'creationDate' || fieldName === 'effectiveDate' || fieldName === 'processDate' )
						fieldType = 'datefield';
					else
						fieldType = 'combobox';

					var fieldObj = objCreateNewFilterPanel.down( '' + fieldType + '[itemId="' + fieldName + 'FilterItemId"]' );

					fieldObj.setValue( fieldVal );

				}
				if( applyAdvFilter )
					me.applyAdvancedFilter();
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
			enableValidActionsForGrid : function( grid, record, recordIndex, selectedRecords, jsonData )
			{
				var me = this;
				var buttonMask = '00000000';
				var maskArray = new Array(), actionMask = '', objData = null;

				//if( !Ext.isEmpty( jsonData ) && !Ext.isEmpty( jsonData.d.__buttonMask ) )
				//{
				//	buttonMask = jsonData.d.__buttonMask;
				//}
				var isSameUser = true;
				var isRefresh = true;
				var isCreateClient = true;
				var isMigrate = true;
				var isAlign = true;
				if(!Ext.isEmpty( selectedRecords )){
					for( var index = 0 ; index < selectedRecords.length ; index++ )
					{
						objData = selectedRecords[ index ];
						if( objData.data.status == 'New' || objData.data.status == 'N')
						{
							isCreateClient = false;
							isMigrate = false;
							isAlign = false;
						}else if( objData.data.status == 'Client Created' || objData.data.status == 'C')
						{
							isRefresh = false;
							isCreateClient = false;
							isMigrate = false;
						}else if( objData.data.status == 'Service Package Assigned' || objData.data.status == 'A')
						{
							isRefresh = false;
							isMigrate = false;
							isAlign = false;
						}else if( objData.data.status == 'Client Aligned' || objData.data.status == 'L')
						{
							isRefresh = false;
							isCreateClient = false;
							isAlign = false;
						}
					}
				}else{
					isRefresh = false;
					isCreateClient = false;
					isMigrate = false;
					isAlign = false;					
				}

				//actionMask = doAndOperation( maskArray, 37 );
				//me.enableDisableGroupActions( actionMask, isSameUser );
				me.enableDisableGroupActions( actionMask, isSameUser, isRefresh, isCreateClient, isMigrate, isAlign);
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

				var grid = me.getBankProcessingQueueGrid();
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
			
			switchMatchCriteria : function(  nv, svcGrid , strClient, strClientId){
				svcGrid.setLoading('Loading...');
				var strUrl = 'migrationBrandingPackageList.srvc?';
				Ext.Ajax.request(
				{
					url : strUrl+csrfTokenName+"="+csrfTokenValue+"&$clientName="+strClient+"&$matchCriteria="+nv+"&$clientId="+strClientId,
					method : 'GET',
					success : function( response )
					{
						var decodedJson = Ext.decode( response.responseText );
						var arrJson = new Array();
						for( i = 0 ; i < decodedJson.length ; i++ )
						{				   					
							arrJson.push(
							{
												
								"brandingPackage" : decodedJson[i].BRANDINGPACKAGE,
								"servicesGCP"	: decodedJson[i].SERVICESGCP,
								"servicesCP"	: decodedJson[i].SERVICESCP
							} );
						}
						svcGrid.store.loadRawData( arrJson );
						svcGrid.setLoading( false );
					},
					failure : function()
					{
						svcGrid.setLoading( false );
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

			handlealignClient : function( btn, record ){			
				var strSelectedClientRecords = "";
				var selectedClientLbl = "";
				var arrSelectedClientRecords = new Array();
				var strUrl = 'alignMigrationClient.srvc?';
				var grid = Ext.getCmp( 'gridViewMstId' );
				var records = grid.getSelectedRecords();
				for( var index = 0 ; index < records.length ; index++ )
				{
					var strRecordClientId = records[ index ].get('clientId');
					if(!Ext.isEmpty(strRecordClientId)){
						arrSelectedClientRecords.push(
						{
							clientId : strRecordClientId
						} );
						if(index==records.length-1)
							strSelectedClientRecords += strRecordClientId;
						else
							strSelectedClientRecords += strRecordClientId+',';
					}
					selectedClientLbl += strRecordClientId+' \r\n';
				}
				grid.setLoading("Loading...");        
				Ext.Ajax.request(
					{
						url : strUrl+csrfTokenName+"="+csrfTokenValue+"&$selectedRecords="+Ext.encode( arrSelectedClientRecords),
						method : 'GET',
						success : function( response )
						{
							if(null != response && response.responseText === '["Failed"]'){
								Ext.MessageBox.show(
								{
									title : getLabel( 'errorTitle', 'Error' ),
									msg : getLabel( 'migrError1', 'Error while aligning client data..!' ),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								} );								
							}
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
			},
			
			handlecreateMigClient : function( btn, record ){			
				var strSelectedClientRecords = "";
				var selectedClientLbl = "";
				var arrSelectedClientRecords = new Array();
				var strUrl = 'createMigrationClient.srvc?';
				var grid = Ext.getCmp( 'gridViewMstId' );
				var records = grid.getSelectedRecords();
				for( var index = 0 ; index < records.length ; index++ )
				{
					var strRecordClientName = records[ index ].get('clientId');
					if(!Ext.isEmpty(strRecordClientName)){
						arrSelectedClientRecords.push(
						{
							clientName : strRecordClientName
						} );
						if(index==records.length-1)
							strSelectedClientRecords += strRecordClientName;
						else
							strSelectedClientRecords += strRecordClientName+',';
					}
					selectedClientLbl += strRecordClientName+' \r\n';
				}
                grid.setLoading("Loading...");        
				Ext.Ajax.request(
					{
						url : strUrl+csrfTokenName+"="+csrfTokenValue+"&$selectedRecords="+Ext.encode( arrSelectedClientRecords),
						method : 'GET',
						success : function( response )
						{
							if(null != response && response.responseText === '["Failed"]'){
								Ext.MessageBox.show(
								{
									title : getLabel( 'errorTitle', 'Error' ),
									msg : getLabel( 'migrError1', 'Error while creating client..!' ),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								} );								
							}							
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
			},

			handlerefreshMigrationData : function( btn, record ){
								var strClientName = "";
								var strClientId = "";
								var strSelectedClientRecords = "";
								var arrSelectedClientRecords = new Array();
								var strUrl = 'refreshMigrationData.srvc?';
								var grid = this.getBankProcessingQueueGrid();

								/*
								Handle Below:
								List: Clear All and Get List (Id, name) Only
								Refresh All: Clear All and Get Client List with Details (Summary Info as well)
								Refresh : Above action for "Selected" records
								*/
								
								if(!Ext.isEmpty( record )){
									strClientName = record.get('clientName');
									strClientId = record.get('clientId');
								}else if(btn.actionName == 'refreshAction'){
									strClientName = this.getBankProcessingQueueClientId().getValue();
									if(strClientName == null) 
										strClientName = "";
									else 
										strClientName="%25"+strClientName+"%25";
									var records = grid.getSelectedRecords();
									for( var index = 0 ; index < records.length ; index++ )
									{
										var strRecordClientId = records[ index ].get('clientId');
										if(!Ext.isEmpty(strRecordClientId)){
											arrSelectedClientRecords.push(
											{
												clientId : strRecordClientId
											} );
											if(index==records.length-1)
												strSelectedClientRecords += strRecordClientId;
											else
												strSelectedClientRecords += strRecordClientId+',';
										}
									}	
								}
								else{
									strClientName = "";
									strClientId = "";
								}
								grid.setLoading('Loading...');
								Ext.Ajax.request(
								{
									url : strUrl+csrfTokenName+"="+csrfTokenValue+"&$clientName="+strClientName+"&$selectedRecords="+Ext.encode( arrSelectedClientRecords)+"&$actionName="+btn.actionName+"&$clientId="+strClientId,
									method : 'GET',
									success : function( response )
									{
										if(null != response && response.responseText === '["Failed"]'){
											Ext.MessageBox.show(
											{
												title : getLabel( 'errorTitle', 'Error' ),
												msg : getLabel( 'migrError1', 'Error while refreshing client..!' ),
												buttons : Ext.MessageBox.OK,
												icon : Ext.MessageBox.ERROR
											} );								
										}											
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
			},
			
			handleGroupActions : function( btn, record )
			{
				var me = this;
				var queueType = "verificationQueue";
				
				if( me.processingQueueTypeFilterVal == 'D' )
					queueType = "debitQueue";
				else if( me.processingQueueTypeFilterVal == 'C' )
					queueType = "clearingQueue";
				else if( me.processingQueueTypeFilterVal == 'R' )
					queueType = "repairQueue";
				else if( me.processingQueueTypeFilterVal == 'W' )
					queueType = "warehouseQueue";
				else
					queueType = "verificationQueue";
				
				var strAction = !Ext.isEmpty( btn.actionName ) ? btn.actionName : btn.itemId;
				var strUrl = Ext.String.format( '{0}List/{1}.srvc?', queueType, strAction );
				
				if( strAction === 'reject')
				{
					this.showAurhorizerRejectPopUp(strAction, strUrl, record )
				}
				else if( strAction === 'repairReject' || strAction === 'debitReject' )
				{
					showMakerRejectPopUp( strUrl, record );
				}
				else if( strAction === 'changeDate' || strAction === 'changeRepairDate')
				{
					showChangeDatePopUp( strUrl, record );
				}
				else if( strAction === 'refreshMigrationDataRow' && (record.get('status')=='New' || record.get('status')=='N'))
				{
					this.handlerefreshMigrationData(btn, record);
				}				
				else
				{
					//this.preHandleGroupActions( strUrl, '', null, record );
				}
			},

			showAurhorizerRejectPopUp : function(strAction, strActionUrl, record) {
				var me = this;
				var titleMsg = '', fieldLbl = '';
				if (strAction === 'reject') {
					titleMsg = getLabel('lblrejectremarkpopUptitle',
							'Please Enter Reject Remark');
					fieldLbl = getLabel('lblrejectremark', 'Reject Remark');
				}
				Ext.Msg.show({
							title : titleMsg,
							msg : fieldLbl,
							buttons : Ext.Msg.OKCANCEL,
							multiline : 4,
							style : {
								height : 400
							},
							bodyPadding : 0,
							fn : function(btn, text) {
								if (btn == 'ok') {
									me
											.preHandleGroupActions(strActionUrl, text, null,
													record);
								}
							}
						});
			},
			
			preHandleGroupActions : function( strUrl, remark, changedDate, record )
			{
				var me = this;
				var grid = this.getBankProcessingQueueGrid();
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
						if( !Ext.isEmpty( changedDate ) )
						{
							arrayJson.push(
							{
								serialNo : grid.getStore().indexOf( records[ index ] ) + 1,
								identifier : records[ index ].data.identifier,
								userMessage : remark,
								recalcOffsetDateFlag : changedDate
							} );
						}
						else
						{
							arrayJson.push(
							{
								serialNo : grid.getStore().indexOf( records[ index ] ) + 1,
								identifier : records[ index ].data.identifier,
								userMessage : remark
							} );
						}
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
						success : function( jsonData )
						{

							var jsonRes = Ext.JSON.decode(jsonData.responseText);
							var errors = '';
							for (var i in jsonRes.d.instrumentActions) {
								if (jsonRes.d.instrumentActions[i].errors) {
									for (var j in jsonRes.d.instrumentActions[i].errors) {
										errors += jsonRes.d.instrumentActions[i].errors[j].errorMessage
												+ "\n";
									}

								}

							}
							if (errors != '') {
								alert("Error in bank processing queue action : " + errors);
							}
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
				var maskSize = record.data.__metadata.__rightsMap.length;
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

				if( ( maskPosition === 7 && retValue ) )
				{
					retValue = retValue && isSameUser;
				}
				else
					if( maskPosition === 8 && retValue )
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
			enableDisableGroupActions : function( actionMask, isSameUser, isRefresh, isCreateClient, isMigrate, isAlign )
			{
				var actionBar = this.getActionBarSummDtl();
				var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
				if( !Ext.isEmpty( actionBar ) && !Ext.isEmpty( actionBar.items.items ) )
				{
					arrItems = actionBar.items.items;
					Ext.each( arrItems, function( item )
					{
						if(item.text == 'Refresh')
							item.setDisabled( !isRefresh );
						if(item.text == 'Create Client')
							item.setDisabled( !isCreateClient );
						if(item.text == 'OK to Migrate')
							item.setDisabled( !isMigrate )	;
						if(item.text == 'Align Services')
							item.setDisabled( !isAlign )	;		
						//strBitMapKey = parseInt( item.maskPosition ) - 1;
						//if( strBitMapKey > -1)
						//{
						//	blnEnabled = isActionEnabled( actionMask, strBitMapKey );
						//	if( ( item.maskPosition === 7 && blnEnabled ) )
						//	{

						//		blnEnabled = blnEnabled && isSameUser;
						//	}
						//	else
						//		if( item.maskPosition === 8 && blnEnabled )
						//		{
						//			blnEnabled = blnEnabled && isSameUser;
						//		}
						//	item.setDisabled( !blnEnabled );
						//}
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
						if( objCol.colId === 'totalInstAmount' || objCol.colId === 'totalTxns' )
						{
							cfgCol.align = 'right';
						}
						if( objCol.colId === 'clientName' )
						{
							cfgCol.width = 500;
							cfgCol.fnSummaryRenderer = function( value, summaryData, dataIndex, colId )
							{
								var strRet = '';
								var grid = me.getBankProcessingQueueGrid();
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
						if( objCol.colId === 'totalInstAmount' )
						{
							cfgCol.width = 500;
							cfgCol.fnSummaryRenderer = function( value, summaryData, dataIndex, colId )
							{
								var strRet = '';
								var grid = me.getBankProcessingQueueGrid();
								if( !Ext.isEmpty( grid ) && !Ext.isEmpty( grid.store ) )
								{
									var data = grid.store.proxy.reader.jsonData;
									if( data && data.d && data.d.__subTotal )
									{
										if( data.d.__subTotal != '$0.00' )
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
				strRetValue = value;
				if( colId === 'col_brandingPackages')
				{
					if( (!Ext.isEmpty( record.get( 'isEmpty' ) ) && record.get( 'isEmpty' ) === true) 
						|| (record.get('status') == 'Client Created') || (record.get('status') == 'C') 
						|| (record.get('isSubmitted') == 'Y') || (record.get('status') == 'L') || (record.get('status') == 'Client Aligned'))
						return value;
					else 
					{
						strRetValue = '<u><a style="color:blue" href="#2" id="seeServicePackages">'+value+'</a></u>';
					}
				}
				if( colId === 'col_status')
				{
					if(value == 'N' || value == 'New')
						strRetValue = 'New';
					else if(value == 'A' || value == 'Service Package Assigned')
						strRetValue = 'Service Package Assigned';
					else if(value == 'C' || value == 'Client Created')
						strRetValue = 'Client Created';
					else if(value == 'L' || value == 'Client Aligned')
						strRetValue = 'Client Aligned';
					else
						strRetValue = '';
				}
				
				return strRetValue;
			},

			createGroupActionColumn : function()
			{
				var me = this;
				var objActionColAuth =
				{
					colType : 'actioncontent',
					colId : 'groupActionRepair',
					width : 50,
					align : 'right',
					locked : true,
					items :
					[
						{
							itemId : 'accept',
							text : 'Approve',
							itemLabel : getLabel( 'actionApprove', 'Approve' ),
							maskPosition : 7
						},
						{
							itemId : 'reject',
							text : 'Reject',
							itemLabel : getLabel( 'actionReject', 'Reject' ),
							maskPosition : 8
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
						items : []
					}
				};
				var objActionColVerification = 
				{
					colType : 'actioncontent',
					colId : 'groupActionRepair',
					width : 100,
					align : 'right',
					locked : true,
					items :
					[
						{
							itemId : 'refreshMigrationDataRow',
							text : getLabel( 'cancle1', 'Refresh' ),
							toolTip : getLabel( 'cancle1', 'Refresh' ),
							maskPosition : 2
						}
					]
				
				};
				var objActionColWarehouse = 
				{
					colType : 'actioncontent',
					colId : 'groupActionRepair',
					width : 140,
					align : 'right',
					locked : true,
					items :
					[
						{
							itemId : 'warehouseCancle',
							text : getLabel( 'cancle', 'Cancel' ),
							toolTip : getLabel( 'cancle', 'Cancel' ),
							maskPosition : 2
						},
						{
							itemId : 'changeDate',
							text : getLabel( 'changeDate', 'ChangeDate' ),
							toolTip : getLabel( 'changeDate', 'ChangeDate' ),
							maskPosition : 1
						},
						{
							itemId : 'warehouseAdvance',
							text : getLabel( 'advance', 'Advance' ),
							itemLabel : getLabel( 'advance', 'Advance' ),
							maskPosition : 3
						},
						{
							itemId : 'warehouseDealChange',
							text : getLabel( 'dealChange', 'DealChange' ),
							itemLabel : getLabel( 'dealChange', 'DealChange' ),
							maskPosition : 4
						},
						{
							itemId : 'warehouseSubmit',
							text : getLabel( 'submit', 'Submit' ),
							itemLabel : getLabel( 'submit', 'Submit' ),
							maskPosition : 5
						}
					]
				
				};
				var objActionColRepair =
				{
					colType : 'actioncontent',
					colId : 'groupActionRepair',
					width : 140,
					align : 'right',
					locked : true,
					items :
					[
						{
							itemId : 'repairReject',
							text : getLabel( 'reject', 'Reject' ),
							toolTip : getLabel( 'reject', 'Reject' ),
							maskPosition : 2
						},
						{
							itemId : 'changeRepairDate',
							text : getLabel( 'changeDate', 'ChangeDate' ),
							toolTip : getLabel( 'changeDate', 'ChangeDate' ),
							maskPosition : 1
						},
						{
							itemId : 'repairValidate',
							text : getLabel( 'validate', 'Validate' ),
							itemLabel : getLabel( 'validate', 'Validate' ),
							maskPosition : 3
						},
						{
							itemId : 'repairSubmit',
							text : getLabel( 'submit', 'Submit' ),
							itemLabel : getLabel( 'submit', 'Submit' ),
							maskPosition : 4
						}
					]
				};
				var objActionColDebit =
				{
					colType : 'actioncontent',
					colId : 'groupActionDebit',
					width : 150,
					align : 'right',
					locked : true,
					items :
					[

						{
							itemId : 'debitReject',
							text : getLabel( 'reject', 'Reject' ),
							itemLabel : getLabel( 'reject', 'Reject' ),
							maskPosition : 6
						},
						{
							itemId : 'changeDate',
							text : getLabel( 'changeDate', 'ChangeDate' ),
							toolTip : getLabel( 'changeDate', 'ChangeDate' ),
							maskPosition : 1
						},
						{
							itemId : 'cancelPayment',
							text : getLabel( 'cancelPayment', 'Cancel Payment' ),
							toolTip : getLabel( 'cancelPayment', 'Cancel Payment' ),
							maskPosition : 2
						},
						{
							itemId : 'reSend',
							text : getLabel( 'reSend', 'ReSend' ),
							itemLabel : getLabel( 'reSend', 'ReSend' ),
							maskPosition : 3
						},
						{
							itemId : 'confirm',
							text : getLabel( 'confirm', 'confirm' ),
							itemLabel : getLabel( 'confirm', 'confirm' ),
							maskPosition : 4
						},
						{
							itemId : 'enforceDebit',
							text :getLabel( 'enforceDebit', 'EnforceDebit' ),
							itemLabel : getLabel( 'enforceDebit', 'EnforceDebit' ),
							maskPosition : 5
						}
					]
				};
				var objActionColClearing =
				{
					colType : 'actioncontent',
					colId : 'groupActionClearing',
					width : 150,
					align : 'right',
					locked : true,
					items :
					[
						{
							itemId : 'cancel',
							text : getLabel( 'cancel', 'Cancel' ),
							toolTip : getLabel( 'cancel', 'Cancel' ),
							maskPosition : 2
						},
						{
							itemId : 'changeDate',
							text :getLabel( 'changeDate', 'ChangeDate' ),
							toolTip : getLabel( 'changeDate', 'ChangeDate' ),
							maskPosition : 1
						},
						{
							itemId : 'hold',
							text : getLabel( 'hold', 'Hold' ),
							itemLabel : getLabel( 'hold', 'Hold' ),
							maskPosition : 3
						},
						{
							itemId : 'release',
							text : getLabel( 'release', 'Release' ),
							itemLabel : getLabel( 'release', 'Release' ),
							maskPosition : 4
						},
						{
							itemId : 'download',
							text : getLabel( 'download', 'Download' ),
							itemLabel : getLabel( 'download', 'Download' ),
							maskPosition : 5
						}
					]
				};
				switch( me.processingQueueTypeFilterVal )
				{
					case 'R':
						if( me.processingQueueSubTypeFilterVal == '2' )
							return objActionColAuth;
						else
							return objActionColRepair;
						break;
					case 'D':
						if( me.processingQueueSubTypeFilterVal == '2' )
							return objActionColAuth;
						else
							return objActionColDebit;
						break;
					case 'C':
						if( me.processingQueueSubTypeFilterVal == '2' )
							return objActionColAuth;
						else
							return objActionColClearing;
						break;
					case 'W':
						if( me.processingQueueSubTypeFilterVal == '2' )
							return objActionColAuth;
						else
							return objActionColWarehouse;
						break;
					case 'V':
						if( me.processingQueueSubTypeFilterVal == '2' )
							return objActionColAuth;
						else
							return objActionColVerification;
						break;
				}

			},
			createActionColumn : function()
			{
				var me = this;
				var objActionCol =
				{
					colType : 'actioncontent',
					colId : 'action',
					width : 55,
					align : 'center',
					locked : true,
					items :
					[

						{
							itemId : 'btnView',
							itemCls : 'grid-row-action-icon icon-view',
							toolTip : getLabel( 'viewToolTip', 'View Record' )
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
			viewMirgationClient : function(record,rowIndex)
			{
				if(record.data.status == "New" || record.data.status == "N" 
				|| record.data.status == "A" || record.data.status == "Service Package Assigned")
					return;
				else
					this.submitForm('viewClientServiceSetup.form', record, rowIndex);
			},
			submitForm : function(strUrl, record, rowIndex) {
				var me = this;
				var viewState = record.data.identifier;
				var strClientName = record.get('clientName');
				var strClientID = record.get('clientId');
				var strCPONClientID = record.raw.cponClientId;
				var clientStatus = record.get('status');
				var updateIndex = rowIndex;
				var form, inputField;
				
				form = document.createElement('FORM');
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.appendChild(me.createFormField('INPUT', 'HIDDEN',
						csrfTokenName, csrfTokenValue));
				form.appendChild(me.createFormField('INPUT', 'HIDDEN',
						'txtRecordIndex', rowIndex));
				form.appendChild(me.createFormField('INPUT', 'HIDDEN',
						'clientStatus', clientStatus));
				form.appendChild(me.createFormField('INPUT', 'HIDDEN',
						'strClientName', strClientName));		
				form.appendChild(me.createFormField('INPUT', 'HIDDEN',
						'strCPClientID', strClientID));		
				form.appendChild(me.createFormField('INPUT', 'HIDDEN',
						'strCPONClientID', strCPONClientID));								
				form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
						viewState));
				form.appendChild(me.createFormField('INPUT', 'HIDDEN',
						'isMigratedClient','Y'));			

				form.action = strUrl;
				document.body.appendChild(form);
				form.submit();
			},
			doSubmitForm : function(strUrl, formData) 
			{
				var me = this;
				var form = null;
				form = document.createElement('FORM');
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue));
				form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtBankProcessingQuee', "Y"));
				form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtQueueType', formData.queueType));
//				form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtLayout', formData.strLayoutType));
				//form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtActionStaus', "EDIT"));
				form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtIdentifier', formData.viewState));
				form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtProduct', formData.strProduct));
				form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtPaymentType', formData.strPaymentType));
				form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtPhdNumber', formData.strPhdnumber));
				form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtClientId', formData.strClientId));
				if(formData.queueType == 'V')
					{
					form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtEntryType', 'QUEUE'));
					form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtLayout', 'QUEUELAYOUT'));
					}
				else
					form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtEntryType', 'PAYMENT'));	
				
				form.action = strUrl;
				document.body.appendChild(form);
				form.submit();
				document.body.removeChild(form);
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
							var processingQueueType = '';
							var seller = me.processingQueueSellerVal;
							var client = me.processingQueueClientVal;
							var processingQueueSubType = me.processingQueueSubTypeFilterDesc;
							var processingQueueAuthStatus = me.processingQueueStatusFilterDesc;

							if( me.processingQueueTypeFilterVal == 'R' )
							{
								processingQueueType = 'Repair';
								me.showAdvFilterCode = null;
							}
							else
							{
								processingQueueType = me.processingQueueTypeFilterDesc;
							}
							var advfilter = me.showAdvFilterCode;
							if( advfilter == '' || advfilter == null )
							{
								advfilter = getLabel( 'none', 'None' );
							}
							var strClientName = me.getBankProcessingQueueClientId().getValue();
							if( strClientName == '' || strClientName == null )
							{
								strClientName = getLabel( 'all', '(ALL)' );
							}							
							//tip.update( 'Processing Queue' + ' : ' + processingQueueType + '<br/>'
							//	+ getLabel( 'seller', 'Seller' ) + ' : ' + seller + '<br/>' + getLabel( 'client', 'Client' )
							//	+ ' : ' + client + '<br/>' + getLabel( 'status', 'Status' ) + ' : ' + processingQueueSubType
							//	+ '<br/>' + getLabel( 'authStatus', 'Auth Status' ) + ' : ' + processingQueueAuthStatus + '<br/>'
							//	+ getLabel( 'advancedFilter', 'Advance Filter' ) + ':' + advfilter );
								
							tip.update( 'Company Name' + ' : ' + strClientName );
						}
					}
				} );
			},
			toggleSavePreferencesAction : function( isVisible )
			{
				var me = this;
				//var btnPreferences = me.getBtnSavePreferences();
				//if( !Ext.isEmpty( btnPreferences ) )
				//	btnPreferences.setDisabled( !isVisible );

			},
			toggleClearPrefrenceAction : function(isVisible) {
				var me = this;
				//var btnPref = me.getBtnClearPreferences();
				//if (!Ext.isEmpty(btnPref))
				//	btnPref.setDisabled(!isVisible);
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
				var grid = me.getBankProcessingQueueGrid();
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
								//if( !Ext.isEmpty( me.getBtnSavePreferences() ) )
								//	me.getBtnSavePreferences().setDisabled( false );
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
				objQuickFilterPref.processingQueueType = me.processingQueueTypeFilterVal;
				// objQuickFilterPref.entryDate = me.dateFilterVal;

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
									//if( !Ext.isEmpty( me.getBtnSavePreferences() ) )
									//	me.toggleSavePreferencesAction( true );
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
				var me = this, objPref = {}, arrCols = null, objCol = null;
				var strUrl = me.commonPrefUrl+"?$clear=true";
				var grid = me.getBankProcessingQueueGrid();
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
					me.objAdvFilterPopup = Ext.create( 'GCP.view.BankProcessingQueueAdvancedFilterPopup' );
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
				else
					if( index == '12' )
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
					var strProcessingQueueType = data.quickFilter.processingQueueType;

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
						me.processingQueueTypeFilterVal = !Ext.isEmpty( strProcessingQueueType ) ? strProcessingQueueType : 'R';
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

				if( !Ext.isEmpty( me.processingQueueTypeFilterVal ) )
				{
					arrJsn.push(
					{
						paramName : "sourceType",
						paramValue1 : me.processingQueueTypeFilterVal,
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
						var strUrl = 'userfilters/bankProcessingQueue/{0}.srvc';
						strUrl = Ext.String.format( strUrl, data.advFilterCode );
						Ext.Ajax.request(
						{
							url : strUrl + '?' + csrfTokenName + '=' + csrfTokenValue,
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
				if( !Ext.isEmpty(me.processingQueueTypeFilterVal) && 'R'==me.processingQueueTypeFilterVal )
					strUrl = 'services/getBankProcessingQueueList/getBankProcessingRepairQueueDynamicReport.' + strExtension;
				else
					strUrl = 'services/getBankProcessingQueueList/getBankProcessingQueueDynamicReport.' + strExtension;
				strUrl += '?$skip=1';
				strUrl += "&$batchInstFltr=" + me.processingQueueSourceType; 
				var strQuickFilterUrl = me.generateUrlWithQuickFilterParams( this );
				strUrl += strQuickFilterUrl;
				var grid = me.getBankProcessingQueueGrid();
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

function showChangeDatePopUp( strUrl, record )
{
	var records = bankProcessingQueueGrid.getSelectedRecords();
	var noOfInstrument = 0 ;
	
	if( records.length == 0 )
	{
		noOfInstrument = record.get("totalTxns") ;
		records.length = 1 ;
	}
	else
	{
		for( var index = 0 ; index < records.length ; index++ )
		{
			noOfInstrument = noOfInstrument + records[index].get("totalTxns");
		}
	}
	document.getElementById("noOfInstrumentsDt").value = noOfInstrument;
	document.getElementById("noOfBactchDt").value = records.length;
	document.getElementById("newEffectiveDate").value = "";
	document.getElementById("remarksDt").value = "";
	passedUrl = strUrl;
	passedRecordObj = record;
    $( '#paymentChangeDatePopup' ).dialog(
      {
            autoOpen : false,
            height : 'auto',
            width : 'auto',
            modal : true,
            resizable : false,
            title : 'Change Effective Date of all Batch(es)'
      } );
      $( '#paymentChangeDatePopup' ).dialog( "open" );
}

function closePopup( dlgId )
{
	$( '#' + dlgId + '' ).dialog( "close" );
}

function showMakerRejectPopUp( strUrl, record )
{
	var records = bankProcessingQueueGrid.getSelectedRecords();
	var noOfInstrument = 0;
	
	if( records.length == 0 )
	{
		noOfInstrument = record.get( "totalTxns" );
		records.length = 1;
	}
	else
	{
		for( var index = 0 ; index < records.length ; index++ )
		{
			noOfInstrument = noOfInstrument + records[ index ].get( "totalTxns" );
		}
	}
	document.getElementById( "noOfInstruments" ).value = noOfInstrument;
	document.getElementById( "noOfBatch" ).value = records.length;
	document.getElementById( "rejectReason" ).value = "";
	passedUrl = strUrl;
	passedRecordObj = record;
	$( '#paymentRejectReasonPopup' ).dialog(
	{
		autoOpen : false,
		height : 'auto',
		width : 'auto',
		modal : true,
		resizable : false,
		title : 'Enter Rejection reason for Batch(es)'
	} );
	$( '#paymentRejectReasonPopup' ).dialog( "open" );
}

function saveMakerRejectRemarks( remark )
{
	GCP.getApplication().fireEvent( 'callPreHandleGroupActions', remark, null );
}

function saveChangedDate( remark, changedDate )
{
	GCP.getApplication().fireEvent( 'callPreHandleGroupActions', remark, changedDate );
}
