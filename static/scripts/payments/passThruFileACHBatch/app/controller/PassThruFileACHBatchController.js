Ext
	.define(
		'GCP.controller.PassThruFileACHBatchController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'GCP.view.PassThruFileACHBatchHeaderGridView','GCP.view.PassThruFileACHBatchDetailGridView'
			],
			views :
			[
				'GCP.view.PassThruFileACHBatchView', 'GCP.view.PassThruFileACHBatchAdvancedFilterPopup'
			],
			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[
				{
					ref : 'passThruFileACHViewRef',
					selector : 'passThruFileACHBatchViewType'
				},
				{
					ref : 'passThruFileACHBatchHeaderGridView',
					selector : 'passThruFileACHBatchViewType passThruFileACHBatchHeaderGridType'
				},
				{
					ref : 'passThruFileACHBatchDtlViewRef',
					selector : 'passThruFileACHBatchViewType passThruFileACHBatchDetailGridType panel[itemId="passThruFileACHBatchDtlViewItemId"]'
				},
				{
					ref : 'passThruFileACHBatchDetailGridRef',
					selector : 'passThruFileACHBatchViewType passThruFileACHBatchDetailGridType grid[itemId="gridBatchViewItemId"]'
				},
				{
					ref : 'passThruFileHeaderViewRef',
					selector : 'passThruFileACHBatchViewType passThruFileACHBatchHeaderGridType panel[itemId="passThruFileBatchHeaderViewItemId"]'
				},
				{
					ref : 'passThruFileHeaderGridRef',
					selector : 'passThruFileACHBatchViewType passThruFileACHBatchHeaderGridType grid[itemId="gridHeaderViewItemId"]'
				},
				{
					ref : 'matchCriteria',
					selector : 'passThruFileACHBatchDetailGridType radiogroup[itemId="matchCriteria"]'
				},
				{
					ref : 'searchTxnTextInput',
					selector : 'passThruFileACHBatchDetailGridType textfield[itemId="searchTxnTextField"]'
				},
				{
					ref : 'btnSavePreferences',
					selector : 'passThruFileACHBatchViewType passThruFileACHBatchFilterViewType button[itemId="btnSavePreferences"]'
				},
				{
					ref : 'fromDateLabel',
					selector : 'passThruFileACHBatchViewType passThruFileACHBatchFilterViewType label[itemId="dateFilterFrom"]'
				},
				{
					ref : 'toDateLabel',
					selector : 'passThruFileACHBatchViewType passThruFileACHBatchFilterViewType label[itemId="dateFilterTo"]'
				},
				{
					ref : 'dateLabel',
					selector : 'passThruFileACHBatchViewType passThruFileACHBatchFilterViewType label[itemId="dateLabel"]'
				},
				{
					ref : 'fromEntryDate',
					selector : 'passThruFileACHBatchViewType passThruFileACHBatchFilterViewType datefield[itemId="fromDate"]'
				},
				{
					ref : 'toEntryDate',
					selector : 'passThruFileACHBatchViewType passThruFileACHBatchFilterViewType datefield[itemId="toDate"]'
				},
				{
					ref : 'dateRangeComponent',
					selector : 'passThruFileACHBatchViewType passThruFileACHBatchFilterViewType container[itemId="dateRangeComponent"]'
				},
				{
					ref : 'taskStatusItemId',
					selector : 'passThruFileACHBatchViewType passThruFileACHBatchFilterViewType button[itemId="taskStatusItemId"]'
				},
				{
					ref : 'entryDate',
					selector : 'passThruFileACHBatchViewType passThruFileACHBatchFilterViewType button[itemId="entryDate"]'
				},
				{
					ref : 'advFilterActionToolBar',
					selector : 'passThruFileACHBatchViewType passThruFileACHBatchFilterViewType toolbar[itemId="advFilterActionToolBar"]'
				},
				{
					ref : 'advanceFilterPopup',
					selector : 'passThruFileACHBatchAdvancedFilterPopupType[itemId="gridViewAdvancedFilter"]'
				},
				{
					ref : 'advanceFilterTabPanel',
					selector : 'passThruFileACHBatchAdvancedFilterPopupType[itemId="gridViewAdvancedFilter"] tabpanel[itemId="advancedFilterTab"] '
				},
				{
					ref : 'createNewFilter',
					selector : 'passThruFileACHBatchAdvancedFilterPopupType[itemId="gridViewAdvancedFilter"] passThruFileACHBatchCreateNewAdvFilterType'
				},
				{
					ref : 'advFilterGridView',
					selector : 'passThruFileACHBatchAdvancedFilterPopupType[itemId="gridViewAdvancedFilter"] passThruFileACHBatchSumAdvFilterGridViewType'
				},
				{
					ref : 'saveSearchBtn',
					selector : 'passThruFileACHBatchAdvancedFilterPopupType[itemId="gridViewAdvancedFilter"] passThruFileACHBatchCreateNewAdvFilterType button[itemId="saveAndSearchBtn"]'
				},
				{
					ref : 'filterDetailsTab',
					selector : 'passThruFileACHBatchAdvancedFilterPopupType[itemId="gridViewAdvancedFilter"] tabpanel[itemId="advancedFilterTab"] panel[itemId="filterDetailsTab"]'
				}
			],
			config :
			{
				savePrefAdvFilterCode : null,
				filterCodeValue : null,
				objAdvFilterPopup : null,
				advFilterCodeApplied : null,
				filterData : [],
				advFilterData : [],
				filterApplied : 'ALL',
				urlGridPref : 'userpreferences/{0}/gridView.srvc?',
				urlGridFilterPref : 'userpreferences/{0}/gridViewFilter.srvc?',
				showAdvFilterCode : null,
				dateFilterVal : '1',
				dateFilterFromVal : '',
				dateFilterToVal : '',
				dateFilterLabel : getLabel( 'today', 'Today' ),
				dateHandler : null,
				screenTypeFileACH : 'passThruFileACHBatch',
				screenTypePositivePay : 'passThruPositivePayBatch',
				screenName : ''
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
				if(screenType == 'FileACHBatch')
				{
					me.screenName = me.screenTypeFileACH ;
				}
				else
				{
					me.screenName = me.screenTypePositivePay ;
				}
				
				me.objAdvFilterPopup = Ext.create( 'GCP.view.PassThruFileACHBatchAdvancedFilterPopup',
				{
					parent : 'passThruFileACHBatchViewType',
					itemId : 'gridViewAdvancedFilter',
					filterPanel :
					{
						xtype : 'passThruFileACHBatchCreateNewAdvFilterType',
						margin : '4 0 0 0',
						callerParent : 'passThruFileACHBatchViewType'
					}
				} );

				this.dateHandler = Ext.create( 'Ext.ux.gcp.DateHandler' );  
				me.updateFilterConfig();
				me.updateAdvFilterConfig();
				me
					.control(
					{
						'passThruFileACHBatchViewType' :
						{
							beforerender : function( panel, opts )
							{
							},
							afterrender : function( panel, opts )
							{
							}
						},
						'passThruFileACHBatchViewType button[itemId="backBtnId"]' :
						{
							click : function( btn, opts )
							{
								var strUrl = '';
								if(screenType == 'FileACHBatch')
								{
									strUrl = 'passThruFileACH.srvc' ;
								}
								else
								{
									strUrl = 'passThruPositivePay.srvc' ;
								}
								me.submitForm(strUrl);
							}
						},
						'passThruFileACHBatchHeaderGridType' :
						{
							render : function( panel )
							{
								me.handleHeaderSmartGridConfig();
							}
						},
						'passThruFileACHBatchDetailGridType' :
						{
							render : function( panel )
							{
								me.handleSmartGridConfig();
							}
						},
						'passThruFileACHBatchViewType passThruFileACHBatchFilterViewType button[itemId="newFilter"]' :
						{
							click : function( btn, opts )
							{
								me.advanceFilterPopUp( btn );
							}
						},
						'passThruFileACHBatchAdvancedFilterPopupType[itemId="gridViewAdvancedFilter"] passThruFileACHBatchCreateNewAdvFilterType' :
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
						'passThruFileACHBatchAdvancedFilterPopupType[itemId="gridViewAdvancedFilter"] passThruFileACHBatchCreateNewAdvFilterType AutoCompleter[itemId="companyId"]' :
						{
							select : function( combo, record, index )
							{
								var objOfCreateNewFilter = this.getCreateNewFilter();
								var objAutocompleter = objOfCreateNewFilter.down( 'AutoCompleter[itemId="companyName"]' );
								objAutocompleter.cfgExtraParams = [{key : '$filtercode1', value : record[ 0 ].data.CODE }];
							}
						},
						'passThruFileACHBatchViewType passThruFileACHBatchFilterViewType toolbar[itemId="advFilterActionToolBar"]' :
						{
							handleSavedFilterItemClick : me.handleFilterItemClick
						},
						'passThruFileACHBatchAdvancedFilterPopupType[itemId="gridViewAdvancedFilter"] passThruFileACHBatchSumAdvFilterGridViewType' :
						{
							orderUpGridEvent : me.orderUpDown,
							deleteGridFilterEvent : me.deleteFilterSet,
							viewGridFilterEvent : me.viewFilterData,
							editGridFilterEvent : me.editFilterData
						},
						'passThruFileACHBatchHeaderGridType smartgrid' :
						{
							render : function( grid )
							{
								me.handleHeaderLoadGridData( grid, grid.store.dataUrl, grid.pageSize, 1, 1, null );
							},
							gridPageChange : me.handleHeaderLoadGridData,
							gridSortChange : me.handleHeaderLoadGridData
						},
						'passThruFileACHBatchDetailGridType smartgrid' :
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
						'passThruFileACHBatchDetailGridType textfield[itemId="searchTxnTextField"]' :
						{
							change : function( btn, opts )
							{
								me.searchTrasactionChange();
							}
						},
						'passThruFileACHBatchDetailGridType radiogroup[itemId="matchCriteria"]' :
						{
							change : function( btn, opts )
							{
								me.searchTrasactionChange();
							}
						},
						'passThruFileACHBatchViewType passThruFileACHBatchFilterViewType' :
						{
							render : function( panel, opts )
							{
								me.setInfoTooltip();
								me.getAllSavedAdvFilterCode( panel );
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
								}
							}
						},
						'passThruFileACHBatchViewType passThruFileACHBatchFilterViewType toolbar[itemId="dateToolBar"]' :
						{
							afterrender : function( tbar, opts )
							{
								me.updateDateFilterView();
							}
						},
						'passThruFileACHBatchViewType passThruFileACHBatchFilterViewType button[itemId="goBtn"]' :
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
								}
							}
						},
						'passThruFileACHBatchViewType passThruFileACHBatchFilterViewType button[itemId="btnSavePreferences"]' :
						{
							click : function( btn, opts )
							{
								me.toggleSavePrefrenceAction( false );
								me.handleSavePreferences();
							}
						}
					} );
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
			postSaveFilterRequest : function( FilterCodeVal, fncallBack )
			{
				var me = this;
				var strUrl = 'userfilters/{0}/{1}.srvc?';
				strUrl = Ext.String.format( strUrl, me.screenName,FilterCodeVal );
				var objJson;
				var objOfCreateNewFilter = me.getCreateNewFilter();
				objJson = objOfCreateNewFilter.getAdvancedFilterValueJson( FilterCodeVal, objOfCreateNewFilter );
				Ext.Ajax.request(
				{
					url : strUrl+ csrfTokenName + "=" + csrfTokenValue,
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
							// objFilterCode.setValue(filterCode);
							// me.setAdvancedFilterTitle(filterCode);
							fncallBack.call( me );
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

				var grid = me.getPassThruFileACHBatchDetailGridRef();
				// TODO : Currently both filters are in sync
				if( !Ext.isEmpty( grid ) )
				{
					var strDataUrl = grid.store.dataUrl;
					var store = grid.store;
					var strUrl = grid.generateUrl( strDataUrl, grid.pageSize, 1, 1, store.sorters );
					strUrl = strUrl + me.getFilterUrl() + "&" + csrfTokenName + "=" + csrfTokenValue+ "&$fileId" + "=" + fileId;
					me.getPassThruFileACHBatchDetailGridRef().setLoading( true );
					grid.loadGridData( strUrl, me.handleAfterGridDataLoad, null );
				}
				me.getAllSavedAdvTooBarCode();
				me.closeGridViewFilterPopup();
			},
			handleAfterGridDataLoad : function( grid, jsonData )
			{
				var me = grid.ownerCt;
				me.setLoading( false );
			},
			setDataForFilter : function()
			{
				var me = this;
				me.getSearchTxnTextInput().setValue( '' );
				if( this.filterApplied === 'Q' || this.filterApplied === 'ALL' )
				{
					this.filterData = this.getQuickFilterQueryJson();
				}
				else if( this.filterApplied === 'A' )
				{
					var objOfCreateNewFilter = this.getCreateNewFilter();
					var objJson = objOfCreateNewFilter.getAdvancedFilterQueryJson( objOfCreateNewFilter );
					this.advFilterData = objJson;
					// this.filterData = objJson;
					var filterCode = objOfCreateNewFilter.down( 'textfield[itemId="filterCode"]' ).getValue();
					this.advFilterCodeApplied = filterCode;
					//objOfCreateNewFilter.resetAllFields( objOfCreateNewFilter );
				}
			},
			getQuickFilterQueryJson : function()
			{
				var me = this;
				var jsonArray = [];
				var index = me.dateFilterVal;
				var objDateParams = me.getFilterDateParam( index );
				if(index != '12')
				{
					jsonArray.push(
					{
						paramName : me.getEntryDate().filterParamName,
						paramValue1 : objDateParams.fieldValue1,
						paramValue2 : objDateParams.fieldValue2,
						operatorValue : objDateParams.operator,
						dataType : 'S'
					} );
				}
				return jsonArray;
			},
			applyQuickFilter : function()
			{
				var me = this;
				me.getPassThruFileACHBatchDetailGridRef().refreshData();
			},
			handleSmartGridConfig : function()
			{
				var me = this;
				var passThruFileACHBatchDetailGrid = me.getPassThruFileACHBatchDetailGridRef();
				var objConfigMap = me.getPassThruFileACHBatchConfiguration();
				var arrCols = new Array();
				var objPref = null, arrColsPref = null, pgSize = null;
				var data ;
				if( Ext.isEmpty( passThruFileACHBatchDetailGrid ) )
				{
					if( !Ext.isEmpty( objGridViewPref ) )
					{
						data = Ext.decode( objGridViewPref );
						objPref = data[ 0 ];
						arrColsPref = objPref.gridCols;
						arrCols = me.getColumns( arrColsPref, objConfigMap.objWidthMap );
						pgSize = !Ext.isEmpty( objPref.pgSize ) ? parseInt( objPref.pgSize,10 ) : 5;
						me.handleSmartGridLoading( arrCols, objConfigMap.storeModel, pgSize );
					}
					else 
						if( objConfigMap.arrColsPref )
						{
							arrCols = me.getColumns( objConfigMap.arrColsPref, objConfigMap.objWidthMap );
							pgSize = 5;
							me.handleSmartGridLoading( arrCols, objConfigMap.storeModel, pgSize );
						}
				}
				else
				{
					me.handleLoadGridData( grid, grid.store.dataUrl, grid.pageSize, 1, 1, null );
				}
			},
			handleHeaderSmartGridConfig : function()
			{
				var me = this;
				var passThruFileHeaderGrid = me.getPassThruFileHeaderGridRef();
				var objConfigMap = me.getPassThruFileHeaderConfiguration();
				var arrCols = new Array();
				var pgSize = null;
				if( Ext.isEmpty( passThruFileHeaderGrid ) )
				{
					arrCols = me.getColumns( objConfigMap.arrColsPref, objConfigMap.objWidthMap );
					pgSize = 1;
					me.handleHeaderSmartGridLoading( arrCols, objConfigMap.storeModel, pgSize );
				}
				else
				{
					me.handleHeaderLoadGridData( grid, grid.store.dataUrl, grid.pageSize, 1, 1, null );
				}
			},
			handleSmartGridLoading : function( arrCols, storeModel,pgSize )
			{
				var me = this;
				var pgSize = null;
				var alertSummaryGrid = null;
				pgSize = 100;
				passThruFileACHBatchGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'gridViewMstId',
					itemId : 'gridBatchViewItemId',
					pageSize : pgSize,
					autoDestroy : true,
					stateful : false,
					showEmptyRow : false,
					showCheckBoxColumn : false,
					hideRowNumbererColumn : true,
					padding : '5 10 10 10',
					componentCls : 'ux_panel-transparent-background',
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
				
				var passThruFileACHBatchDtlView = me.getPassThruFileACHBatchDtlViewRef();
				passThruFileACHBatchDtlView.add( passThruFileACHBatchGrid );
				passThruFileACHBatchDtlView.doLayout();
			},
			handleHeaderSmartGridLoading : function( arrCols, storeModel,pgSize )
			{
				var me = this;
				var pgSize = null;
				var alertSummaryGrid = null;
				pgSize = 1;
				passThruFileACHBatchHeaderGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'gridHeaderViewMstId',
					itemId : 'gridHeaderViewItemId',
					pageSize : pgSize,
					autoDestroy : true,
					stateful : false,
					showEmptyRow : false,
					showPager : false,
					showCheckBoxColumn : false,
					hideRowNumbererColumn : true,
					padding : '5 10 10 10',
					componentCls : 'ux_panel-transparent-background',
					rowList :
					[
						5, 10, 15, 20, 25, 30
					],
					minHeight : 60,
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
				
				var passThruFileHeaderDtlView = me.getPassThruFileHeaderViewRef();
				passThruFileHeaderDtlView.add( passThruFileACHBatchHeaderGrid );
				passThruFileHeaderDtlView.doLayout();
			},
			handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
			{
				var me = this;
				var actionName = btn.itemId;
			},
			getPassThruFileACHBatchConfiguration : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;
				var strUrl = 'getBatchList/{0}.srvc';
				strUrl = Ext.String.format( strUrl,me.screenName);
				
				objWidthMap =
				{
					"companyId" : 100,
					"companyName" : 100,
					"batchType" : 100,
					"transactionType" : 100,
					"effectiveEntryDate" : 100,
					"processDate" : 100,
					"totalCrAmt" : 100,
					"totalDrAmt" : 100,
					"batchId" : 100,
					"sendingAccount":100,
					"sendingAccCCy":100,
					"transactionCount":130,
					"customerName" : 100
				};
				arrColsPref =
				[
					{
						"colId" : "companyId",
						"colDesc" : "Company ID"
					},
					{
						"colId" : "companyName",
						"colDesc" : "ComapnyName"
					},
					{
						"colId" : "batchType",
						"colDesc" : "Batch Type"
					},
					{
						"colId" : "transactionType",
						"colDesc" : "Transaction Type"
					},
					{
						"colId" : "effectiveEntryDate",
						"colDesc" : "Effective EntryDate"
					},
					{
						"colId" : "processDate",
						"colDesc" : "Process Date"
					},
					{
						"colId" : "totalCrAmt",
						"colDesc" : "Total Cr Amt",
						"colType" : "number"
					},
					{
						"colId" : "totalDrAmt",
						"colDesc" : "Total Dr Amt",
						"colType" : "number"
					},
					{
						"colId" : "batchId",
						"colDesc" : "Batch Id",
						hidden:true
					},
					{
						"colId" : "customerName",
						"colDesc" : "Customer Name",
						hidden:true
					},
					{
						"colId" : "sendingAccount",
						"colDesc" : "Sending Account",
						hidden:true
					},
					{
						"colId" : "sendingAccCCy",
						"colDesc" : "Sending Account CCY",
						hidden:true
					},
					{
						"colId" : "transactionCount",
						"colDesc" : "Transaction Count",
						"colType" : "number"
					}
					
				];

				storeModel =
				{
					fields :
					[
						'companyId', 'companyName', 'batchType', 'transactionType', 'effectiveEntryDate', 'processDate',
						'totalCrAmt', 'totalDrAmt','batchId', 'identifier', '__metadata','customerName','fileId','sendingAccount',
						'sendingAccCCy','transactionCount'
					],
					proxyUrl : strUrl,
					rootNode : 'd.passThruFileBatch',
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
			getPassThruFileHeaderConfiguration : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;
				var strUrl = 'getHeaderBatchView/{0}.srvc';
				strUrl = Ext.String.format( strUrl,me.screenName);
				
				objWidthMap =
				{
					"fileName" : 115,
					"financialInst" : 100,
					"uploadDate" : 100,
					"totalCrAmt" : 100,
					"totalDrAmt" : 100,
					"totalCrCount" : 100,
					"totalDrCount" : 100,
					"batchCount" : 100,
					"companyCount" : 100,
					"status" : 150
				};
				arrColsPref =
				[
					{
						"colId" : "fileName",
						"colDesc" : getLabel('fileName', 'File Name')
					},
					{
						"colId" : "financialInst",
						"colDesc" : getLabel('financialInst', 'Financial Institution')
					},
					{
						"colId" : "uploadDate",
						"colDesc" : getLabel('uploadDate', 'Upload Date Time')
					},
					{
						"colId" : "totalCrAmt",
						"colDesc" : getLabel('totalCrAmt', 'Total Cr. Amt'),
						"colType" : "number"
					},
					{
						"colId" : "totalDrAmt",
						"colDesc" : getLabel('totalDrAmt', 'Total Dr. Amt'),
						"colType" : "number"
					},
					{
						"colId" : "totalCrCount",
						"colDesc" : getLabel('totalCrCount', 'Total Cr. Count'),
						"colType" : "number"
					},
					{
						"colId" : "totalDrCount",
						"colDesc" : getLabel('totalDrCount', 'Total Dr. Count'),
						"colType" : "number"
					},
					{
						"colId" : "batchCount",
						"colDesc" : getLabel('batchCount', 'Batch Count'),
						"colType" : "number"
					},
					{
						"colId" : "companyCount",
						"colDesc" : getLabel('companyCount', 'No. Of Companies'),
						"colType" : "number"
					},
					{
						"colId" : "status",
						"colDesc" : getLabel('status', 'Status')
					}
				];

				storeModel =
				{
					fields :
					[
						'fileName', 'financialInst', 'financialInst', 'uploadDate', 'totalCrAmt', 'totalDrAmt',
						'totalCrCount', 'totalDrCount','batchCount','companyCount','status','srNo'
					],
					proxyUrl : strUrl,
					rootNode : 'd.passThruFileACH',
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
			handleLoadGridData : function( grid, url, pgSize, newPgNo, oldPgNo, sorter )
			{
				var me = this;
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );
				me.setDataForFilter();
				strUrl = strUrl + me.getFilterUrl() + "&" + csrfTokenName + "=" + csrfTokenValue+ "&$fileId" + "=" + fileId;
				grid.loadGridData( strUrl, null );
			},
			handleHeaderLoadGridData : function( grid, url, pgSize, newPgNo, oldPgNo, sorter )
			{
				var me = this;
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );
				strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue+ "&$srNo" + "=" + srNo;
				grid.loadGridData( strUrl, null );
			},
			getFilterUrl : function()
			{
				var me = this;
				var strQuickFilterUrl = '', strAdvFilterUrl = '', strUrl = '', isFilterApplied = 'false';

				if( me.filterApplied === 'ALL' || me.filterApplied === 'Q' )
				{
					strQuickFilterUrl = me.generateUrlWithQuickFilterParams( this );
					if( !Ext.isEmpty( strQuickFilterUrl ) )
					{
						strUrl += strQuickFilterUrl;
						isFilterApplied = true;
					}
					return strUrl;
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
					if( !Ext.isEmpty( strAdvFilterUrl ) )
					{
						strUrl += strAdvFilterUrl;
						isFilterApplied = true;
					}
					
					return strUrl;
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
				var strUrl = 'userpreferences/{0}/gridViewAdvanceFilter.srvc?';
				strUrl = Ext.String.format( strUrl,me.screenName);
				Ext.Ajax.request(
				{
					url : strUrl+ csrfTokenName + "=" + csrfTokenValue,
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
				var strUrl = 'userpreferences/{0}/gridViewAdvanceFilter.srvc?';
				strUrl = Ext.String.format( strUrl,me.screenName);
				Ext.Ajax.request(
				{
					url : strUrl,
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
				var strUrl = 'userfilterslist/{0}.srvc?';
				strUrl = Ext.String.format( strUrl,me.screenName);
				Ext.Ajax.request(
				{
					url : strUrl+ csrfTokenName + "=" + csrfTokenValue,
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
				var strUrl = 'userfilterslist/{0}.srvc?';
				strUrl = Ext.String.format( strUrl,me.screenName);
				Ext.Ajax.request(
				{
					url : strUrl+ csrfTokenName + "=" + csrfTokenValue,
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
						item = Ext.create( 'Ext.Button',
						{
							cls : 'cursor_pointer xn-account-filter-btnmenu',
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
						text : getLabel( 'moreText', 'more' ) + '<span class="extrapadding">' + '>>' + '</span>',
						itemId : 'AdvMoreBtn',
						handler : function( btn, opts )
						{
							me.handleMoreAdvFilterSet( btn.itemId );
						}
					} );
					var imgItem = Ext.create( 'Ext.Img',
					{
						src : 'static/images/icons/icon_spacer.gif',
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
					me.objAdvFilterPopup = Ext.create( 'GCP.view.PassThruFileACHAdvancedFilterPopup' );
					var objTabPanel = me.getAdvanceFilterTabPanel();
					objTabPanel.setActiveTab( 0 );
					me.objAdvFilterPopup.show();
					var filterDetailsTab = me.getFilterDetailsTab();
					filterDetailsTab.setTitle( getLabel( 'filterDetails', 'Filter Details' ) );
				}
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
				me.toggleSavePrefrenceAction( true );
			},
			getSavedFilterData : function( filterCode, fnCallback, applyAdvFilter )
			{
				var me = this;
				var objOfCreateNewFilter = me.getCreateNewFilter();
				var objJson;
				var strUrl = 'userfilters/{0}/{1}.srvc?'+ csrfTokenName + "=" + csrfTokenValue ;
				strUrl = Ext.String.format( strUrl,me.screenName, filterCode );
				Ext.Ajax.request(
				{
					url : strUrl ,
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

				var objCreateNewFilterPanel = me.getCreateNewFilter();

				for( i = 0 ; i < filterData.filterBy.length ; i++ )
				{
					var fieldName = filterData.filterBy[ i ].field;

					var fieldOper = filterData.filterBy[ i ].operator;

					if( fieldOper != 'eq' )
					{
						objCreateNewFilterPanel.down( 'combobox[itemId="batchType"]' ).setValue( fieldOper );
					}
					if( fieldOper != 'eq' )
					{
						objCreateNewFilterPanel.down( 'combobox[itemId="transactionType"]' ).setValue( fieldOper );
					}
					var fieldVal = filterData.filterBy[ i ].value1;

					if( fieldName === 'companyId' || fieldName === 'totalCrAmt' || fieldName === 'sendingAccount'
						|| fieldName === 'customerName' || fieldName === 'companyName' || fieldName === 'totalDrAmt' )
					{
						var fieldType = 'textfield';
					}
					else if( fieldName === 'transactionType' || fieldName === 'batchType' )
					{
						var fieldType = 'combobox';
					}
					else if( fieldName === 'effectiveEntryDate' || fieldName === 'processDate' )
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

				if( this.advFilterCodeApplied == record.data.filterName )
				{
					this.advFilterData = [];
					me.filterApplied = 'A';
					me.applyAdvancedFilter();
				}

				var store = grid.getStore();
				me.sendUpdatedOrederJsonToDb( store );
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

					if( fieldName === 'companyId' || fieldName === 'totalCrAmt' || fieldName === 'totalDrAmt'
						|| fieldName === 'customerName' || fieldName === 'companyName' || fieldName === 'sendingAccount')
					{
						var fieldType = 'textfield';
					}
					else if( fieldName === 'transactionType' || fieldName === 'batchType' )
					{
						var fieldType = 'combobox';
					}
					else if( fieldName === 'effectiveEntryDate' || fieldName === 'processDate' )
					{
						var fieldType = 'datefield';
					}
					var fieldObj = objCreateNewFilterPanel.down( '' + fieldType + '[itemId="' + fieldName + '"]' );

					fieldObj.setValue( fieldVal );

				}
				objCreateNewFilterPanel.down( 'textfield[itemId="companyId"]' ).setReadOnly( true );
				objCreateNewFilterPanel.down( 'combobox[itemId="batchType"]' ).setReadOnly( true );
				objCreateNewFilterPanel.down( 'datefield[itemId="effectiveEntryDate"]' ).setReadOnly( true );
				objCreateNewFilterPanel.down( 'textfield[itemId="totalCrAmt"]' ).setReadOnly( true );
				objCreateNewFilterPanel.down( 'textfield[itemId="customerName"]' ).setReadOnly( true);
				objCreateNewFilterPanel.down( 'textfield[itemId="companyName"]' ).setReadOnly( true );
				objCreateNewFilterPanel.down( 'combobox[itemId="transactionType"]' ).setReadOnly( true);
				objCreateNewFilterPanel.down( 'datefield[itemId="processDate"]' ).setReadOnly( true );
				objCreateNewFilterPanel.down( 'textfield[itemId="totalDrAmt"]' ).setReadOnly( true );
				objCreateNewFilterPanel.down( 'textfield[itemId="sendingAccount"]' ).setReadOnly( true);
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
					me.objAdvFilterPopup = Ext.create( 'GCP.view.PassThruFileACHBatchAdvancedFilterPopup' );
					var objTabPanel = me.getAdvanceFilterTabPanel();
					objTabPanel.setActiveTab( 1 );
					me.objAdvFilterPopup.show();
				}
			},
			enableValidActionsForGrid : function( grid, record, recordIndex, selectedRecords, jsonData )
			{
				var me = this;
				var buttonMask = '000000';
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

				var grid = me.getPassThruFileACHGridRef();
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
			showRejectVerifyPopUp : function( strAction, strActionUrl, record )
			{
				var me = this;
				var titleMsg = '', fieldLbl = '';
				if( strAction === 'reject' )
				{
					fieldLbl = getLabel( 'prfRejectRemarkPopUpTitle', 'Please Enter Reject Remark' );
					titleMsg = getLabel( 'prfRejectRemarkPopUpFldLbl', 'Reject Remark' );
				}
				var msgbox = Ext.Msg.show({
						title : titleMsg,
						msg : fieldLbl,
						buttons : Ext.Msg.OKCANCEL,
						multiline : 4,
						cls : 't7-popup',
						width: 355,
						height : 270,
						bodyPadding : 0,
						fn : function( btn, text )
						{
							if( btn == 'ok' )
							{
								me.preHandleGroupActions( strActionUrl, text, record );
							}
						}
					} );
				msgbox.textArea.enforceMaxLength = true;
				msgbox.textArea.inputEl.set({
					maxLength : 255
				});
			},
			preHandleGroupActions : function( strUrl, remark, record )
			{
				var me = this;
				var grid = this.getPassThruFileACHGridRef();
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
							me.enableDisableGroupActions( '000000', true );
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
				else if( maskPosition === 7 && retValue )
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
						blnRetValue = me.isRowIconVisible( store, record, jsonData, itmId,
							arrMenuItems[ a ].maskPosition );
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
							else if( item.maskPosition === 7 && blnEnabled )
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

							var advfilter = me.showAdvFilterCode;
							if( advfilter == '' || advfilter == null )
							{
								advfilter = getLabel( 'none', 'None' );
							}

							tip.update( getLabel( 'date', 'Effective Entry Date' )
								+ ' : ' + dateFilter + '<br/>' + getLabel( 'advancedFilter', 'Advanced Filter' ) + ':'
								+ advfilter );
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
					me.getDateLabel().setText(
						getLabel( 'uploadDate', 'Effective Entry Date' ) + "(" + me.dateFilterLabel + ")" );
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
			getFilterDateParam : function( index )
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
						//fieldValue1 = Ext.Date.format( date, strSqlDateFormat );
						fieldValue1 = me.dateToStringFilterParam( date );
						fieldValue2 = fieldValue1;
						operator = 'eq';
						break;
					case '2':
						// Yesterday
						//fieldValue1 = Ext.Date.format( objDateHandler.getYesterdayDate( date ), strSqlDateFormat );
						fieldValue1 = me.dateToStringFilterParam( objDateHandler.getYesterdayDate( date ) );
						fieldValue2 = fieldValue1;
						operator = 'eq';
						break;
					case '3':
						// This Week
						dtJson = objDateHandler.getThisWeekStartAndEndDate( date );
						//fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
						fieldValue1 = me.dateToStringFilterParam( dtJson.fromDate );
						//fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
						fieldValue2 = me.dateToStringFilterParam(dtJson.toDate );
						operator = 'bt';
						break;
					case '4':
						// Last Week
						dtJson = objDateHandler.getLastWeekStartAndEndDate( date );
						//fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
						fieldValue1 = me.dateToStringFilterParam( dtJson.fromDate );
						//fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
						fieldValue2 = me.dateToStringFilterParam( dtJson.toDate );
						operator = 'bt';
						break;
					case '5':
						// This Month
						dtJson = objDateHandler.getThisMonthStartAndEndDate( date );
						//fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
						fieldValue1 = me.dateToStringFilterParam( dtJson.fromDate );
						//fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
						fieldValue2 = me.dateToStringFilterParam( dtJson.toDate );
						operator = 'bt';
						break;
					case '6':
						// Last Month
						dtJson = objDateHandler.getLastMonthStartAndEndDate( date );
						//fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
						fieldValue1 = me.dateToStringFilterParam( dtJson.fromDate );
						//fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
						fieldValue2 = me.dateToStringFilterParam( dtJson.toDate );
						operator = 'bt';
						break;
					case '7':
						// Date Range
						var frmDate = me.getFromEntryDate().getValue();
						var toDate = me.getToEntryDate().getValue();
						//fieldValue1 = Ext.Date.format( frmDate, strSqlDateFormat );
						fieldValue1 = me.dateToStringFilterParam( frmDate );
						//fieldValue2 = Ext.Date.format( toDate, strSqlDateFormat );
						fieldValue2 = me.dateToStringFilterParam( toDate );
						operator = 'bt';
						break;
					case '8':
						// This Quarter
						dtJson = objDateHandler.getQuarterToDate( date );
						fieldValue1 = me.dateToStringFilterParam( dtJson.fromDate );
						fieldValue2 = me.dateToStringFilterParam( dtJson.toDate );
						operator = 'bt';
						break;
					case '9':
						// Last Quarter To Date
						dtJson = objDateHandler.getLastQuarterToDate( date );
						fieldValue1 = me.dateToStringFilterParam( dtJson.fromDate );
						fieldValue2 = me.dateToStringFilterParam( dtJson.toDate );
						operator = 'bt';
						break;
					case '10':
						// This Year
						dtJson = objDateHandler.getYearToDate( date );
						fieldValue1 = me.dateToStringFilterParam( dtJson.fromDate );
						fieldValue2 = me.dateToStringFilterParam( dtJson.toDate );
						operator = 'bt';
						break;
					case '11':
						// Last Year To Date
						dtJson = objDateHandler.getLastYearToDate( date );
						fieldValue1 = me.dateToStringFilterParam( dtJson.fromDate );
						fieldValue2 = me.dateToStringFilterParam( dtJson.toDate );
						operator = 'bt';
						break;
				}
				retObj.fieldValue1 = fieldValue1;
				retObj.fieldValue2 = fieldValue2;
				retObj.operator = operator;
				return retObj;
			},
			dateToStringFilterParam :function(fieldValue1)
			{
				var year , month , date ;
				var formatedDate ;
				date = fieldValue1.getDate();
				month = fieldValue1.getMonth()+1;
				year = ""+fieldValue1.getFullYear();
				year = year.substring(2,4);
				if(month != 10 || month != 11 || month != 12)
				{
					formatedDate = year +'0'+month + date ;
				}
				else
				{
					formatedDate = year + month + date ;
				}
				return formatedDate ; 
			},
			handleSavePreferences : function()
			{
				var me = this;
				me.savePreferences();
			},
			savePreferences : function()
			{
				var me = this, objPref = {}, arrCols = null, objCol = null;
				var strUrl = me.urlGridPref;
				strUrl = Ext.String.format( strUrl,me.screenName);
				var grid = me.getPassThruFileACHBatchDetailGridRef();
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
							&& objCol.xtype !== 'actioncolumn' && objCol.itemId !== 'col_textaction' )
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
						url : strUrl+ csrfTokenName + "=" + csrfTokenValue,
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
								title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
								msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
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
				strUrl = Ext.String.format( strUrl,me.screenName);
				var advFilterCode = null;
				var objFilterPref = {};
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

				if( objFilterPref )
					Ext.Ajax.request(
					{
						url : strUrl+ csrfTokenName + "=" + csrfTokenValue,
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
								title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
								msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							} );
						}
					} );
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

				
				if (!Ext.isEmpty(objDefaultGridViewPref)) {
					var data = Ext.decode(objDefaultGridViewPref);

					var strDtValue = data.quickFilter.entryDate;
					var strDtFrmValue = data.quickFilter.fromDate;
					var strDtToValue = data.quickFilter.toDate;
					var strStatus = data.quickFilter.status;

					if (!Ext.isEmpty(strDtValue)) {
						me.dateFilterLabel = objDateLbl[strDtValue];
						me.dateFilterVal = strDtValue;
						if (strDtValue === '7') {
							if (!Ext.isEmpty(strDtFrmValue))
								me.dateFilterFromVal = strDtFrmValue;

							if (!Ext.isEmpty(strDtToValue))
								me.dateFilterToVal = strDtToValue;
						}
					}

				}
				 
				if( !Ext.isEmpty( me.dateFilterVal ) )
				{
					var strVal1 = '', strVal2 = '', strOpt = 'eq';
					if( me.dateFilterVal !== '7' )
					{
						var dtParams = me.getFilterDateParam( me.dateFilterVal );
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
							paramName : 'effectiveEntryDate',
							paramValue1 : strVal1,
							paramValue2 : strVal2,
							operatorValue : strOpt,
							dataType : 'S'
						} );
					}
				}
				me.filterData = arrJsn;
			},
			// This function will called only once
			updateAdvFilterConfig : function() {
				var me = this;
				if (!Ext.isEmpty(objDefaultGridViewPref)) 
				{
					var data = Ext.decode(objDefaultGridViewPref);
					if (!Ext.isEmpty(data.advFilterCode)) {
						me.showAdvFilterCode = data.advFilterCode;
						me.savePrefAdvFilterCode = data.advFilterCode;
						var strUrl = 'userfilters/{0}/{1}.srvc';
						strUrl = Ext.String.format(strUrl,me.screenName ,data.advFilterCode);
						Ext.Ajax.request({
							url : strUrl+'?'+csrfTokenName+'='+csrfTokenValue,
							async : false,
							method : 'GET',
							success : function(response) {
								var responseData = Ext.decode(response.responseText);
								var applyAdvFilter = false;
								me.populateSavedFilter(data.advFilterCode,
										responseData, applyAdvFilter);
								var objOfCreateNewFilter = me.getCreateNewFilter();
								var objJson = objOfCreateNewFilter
										.getAdvancedFilterQueryJson(objOfCreateNewFilter);

								me.advFilterData = objJson;
								this.advFilterCodeApplied = data.advFilterCode;
								me.savePrefAdvFilterCode ='';
								me.filterApplied = 'A';
							},
							failure : function() {
								var errMsg = "";
								Ext.MessageBox.show({
											title : getLabel(
													'instrumentErrorPopUpTitle',
													'Error'),
											msg : getLabel('instrumentErrorPopUpMsg',
													'Error while fetching data..!'),
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.ERROR
								});
							}
						});
					}
				}
			},
			submitForm : function( strUrl)
			{
				var me = this;
				var form, inputField;
				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'GET';
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue ) );
				form.action = strUrl;
				document.body.appendChild( form );
				form.submit();
			},
			createFormField : function( element, type, name, value )
			{
				var inputField;
				inputField = document.createElement( element );
				inputField.type = type;
				inputField.name = name;
				inputField.value = value;
				return inputField;
			}
		} );
