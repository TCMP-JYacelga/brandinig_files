Ext
	.define(
		'GCP.controller.MessageSentController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'GCP.view.MessageSentGridView'
			],
			views :
			[
				'GCP.view.MessageSentView'
			],
			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[
				{
					ref : 'messageSentView',
					selector : 'messageSentView'
				},
				{
					ref : 'messageSentGrid',
					selector : 'messageSentView messageSentGridView grid[itemId="gridViewMstId"]'
				},
				{
					ref : 'messageSentGridViewRef',
					selector : 'messageSentView messageSentGridView'
				},
				{
					ref : 'messageSentDtlView',
					selector : 'messageSentView messageSentGridView panel[itemId="messageSentDtlView"]'
				},
				{
					ref : 'messageSentGridView',
					selector : 'messageSentView messageSentGridView'
				},
				{
					ref : 'messageSentFilterView',
					selector : 'messageSentFilterView'
				},
				{
					ref : 'btnSavePreferences',
					selector : 'messageSentView messageSentFilterView button[itemId="btnSavePreferences"]'
				},
				{
					ref : 'btnClearPreferences',
					selector : 'messageSentView messageSentFilterView button[itemId="btnClearPreferences"]'
				},
				{
					ref : 'actionBarSummDtl',
					selector : 'messageSentView messageSentGridView messageSentGroupActionBarView'
				},
				{
					ref : 'messageSentStatusToolBar',
					selector : 'messageSentView messageSentFilterView toolbar[itemId="messageSentStatusToolBar"]'
				},
				{
					ref : 'statusLabel',
					selector : 'messageSentView messageSentFilterView label[itemId="statusLabel"]'
				},
				{
					ref : 'fromDateLabel',
					selector : 'messageSentView messageSentFilterView label[itemId="dateFilterFrom"]'
				},
				{
					ref : 'toDateLabel',
					selector : 'messageSentView messageSentFilterView label[itemId="dateFilterTo"]'
				},
				{
					ref : 'dateLabel',
					selector : 'messageSentView messageSentFilterView label[itemId="dateLabel"]'
				},
				{
					ref : 'fromEntryDate',
					selector : 'messageSentView messageSentFilterView datefield[itemId="fromDate"]'
				},
				{
					ref : 'toEntryDate',
					selector : 'messageSentView messageSentFilterView datefield[itemId="toDate"]'
				},
				{
					ref : 'dateRangeComponent',
					selector : 'messageSentView messageSentFilterView container[itemId="dateRangeComponent"]'
				},
				{
					ref : 'messageDate',
					selector : 'messageSentView messageSentFilterView button[itemId="messageDate"]'
				},
				{
					ref : 'messageSentGridInformationView',
					selector : 'messageSentGridInformationView'
				},
				{
					ref : 'infoSummaryLowerPanel',
					selector : 'messageSentGridInformationView panel[itemId="infoSummaryLowerPanel"]'
				},
				{
					ref : 'searchTxnTextInput',
					selector : 'messageSentGridView textfield[itemId="searchTxnTextField"]'
				},
				{
					ref : 'matchCriteria',
					selector : 'messageSentGridView radiogroup[itemId="matchCriteria"]'
				},
				{
					ref : 'formGroupFilterActionToolBarRef',
					selector : 'messageSentFilterView toolbar[itemId="formGroupFilterActionToolBarItemId"]'
				},
				{
					ref : 'moreFormGroupRef',
					selector : 'messageSentFilterView button[itemId="moreFormGroupItemId"]'
				},
				{
					ref : 'withHeaderCheckbox',
					selector : 'messageSentView menuitem[itemId="withHeaderId"]'
				},
				{
					ref : 'sellerClientMenuBar',
					selector : 'messageSentView messageSentFilterView panel[itemId="sellerClientMenuBar"]'
				},
				{
					ref : 'sellerMenuBar',
					selector : 'messageSentView messageSentFilterView panel[itemId="sellerMenuBar"]'
				},
				{
					ref : 'clientMenuBar',
					selector : 'messageSentView messageSentFilterView panel[itemId="clientMenuBar"]'
				},
				{
					ref : 'clientLoginMenuBar',
					selector : 'messageSentView messageSentFilterView panel[itemId="clientLoginMenuBar"]'
				},
				{
					ref : 'filterBtn',
					selector : 'messageSentView messageSentFilterView button[itemId="filterBtnId"]'
				},
				{
					ref : 'manageAlertsTab',
					selector : 'messageSentView messageSentTitleViewType button[itemId="loanCenterSiTabItemId"]'
				},
				{
				ref : 'groupView',
				selector : 'messageSentGridView groupView'
				}
			],
			config :
			{
				selectedMessageSent : 'alert',
				filterData : [],
				formGroupFilterVal : 'all',
				messageStatusFilterVal : 'All',
				messageStatusFilterDesc : 'All',
				filterApplied : 'ALL',
				urlGridPref : 'services/userpreferences/messageSent/gridView.srvc?',
				urlGridFilterPref : 'services/userpreferences/messageSent/gridViewFilter.srvc?',
				commonPrefUrl : 'services/userpreferences/messageSent.json',
				dateFilterVal : '12',
				dateFilterFromVal : '',
				dateFilterToVal : '',
				dateFilterLabel : getLabel( 'latest', 'Latest' ),
				clientFilterVal : null,
				clientFilterDesc : null,
				dateHandler : null,
				arrSorter:[],
				reportGridOrder : null,
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

				this.dateHandler = Ext.create( 'Ext.ux.gcp.DateHandler' );  
				me.updateFilterConfig();
				var btnClearPref = me.getBtnClearPreferences();
				if(btnClearPref)
				{
					btnClearPref.setEnabled(false);
				}
				me
					.control(
					{
						'messageSentView' :
						{
							beforerender : function( panel, opts )
							{
							},
							afterrender : function( panel, opts )
							{
							}
						},
						

						
						'messageSentGridView groupView' :
						{
							
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
									me.toggleSavePrefrenceAction( true );
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
						'messageSentGridView textfield[itemId="searchTxnTextField"]' :
						{
							change : function( btn, opts )
							{
								me.searchTrasactionChange();
							}
						},
						'messageSentGridView radiogroup[itemId="matchCriteria"]' :
						{
							change : function( btn, opts )
							{
								me.searchTrasactionChange();
							}
						},
						'messageSentView button[itemId="inboxItemId"]' :
						{
							click : function( btn, opts )
							{
								me.goToInbox();
							}
						},
						'messageSentView messageSentGridView toolbar[itemId=messageSentGroupActionBarView_summDtl]' :
						{
							performGroupAction : function( btn, opts )
							{
								me.handleGroupActions( btn );
							}
						},
						'messageSentView messageSentFilterView' :
						{
							render : function( panel, opts )
							{
								//me.loadFormGroupDynamicFilters();
								me.setInfoTooltip();
								//me.renderFormGroupFilter();
								if(entity_type == 0) 
								{
									me.getStatusLabel().hide();
									me.getMessageSentStatusToolBar().hide();
								}
								else
								{
									me.getStatusLabel().show();
									me.getMessageSentStatusToolBar().show();
								}
								me.showHideSellerClientMenuBar(entity_type);
							},
							filterMessageStatus : function( btn, opts )
							{
								me.toggleSavePrefrenceAction( true );
								me.handleMessageStatusType(btn);
							},
							filterFormGroup : function( btn, opts )
							{
								me.handleFormGroupFilter( btn, opts );
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
							},
							'handleClientChange' : function(client, clientDesc) {
								me.handleClientChange(client, clientDesc);
								if(client === 'all')
								{
									me.clientFilterVal  = '';
									me.clientFilterDesc = '';
								}
								else
								{
									me.clientFilterVal  = client;
									me.clientFilterDesc = clientDesc;
								}
								me.applySeekFilter();
							}
						},
						'messageSentView messageSentFilterView toolbar[itemId="dateToolBar"]' :
						{
							afterrender : function( tbar, opts )
							{
								me.updateDateFilterView();
							}
						},
						'messageSentView messageSentFilterView button[itemId="goBtn"]' :
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
						'messageSentView messageSentFilterView button[itemId="btnSavePreferences"]' :
						{
							click : function( btn, opts )
							{
								me.toggleSavePrefrenceAction( false );
								me.handleSavePreferences();
							}
						},
						'messageSentView messageSentFilterView button[itemId="btnClearPreferences"]' :
						{
							click : function( btn, opts )
							{
								me.toggleSavePrefrenceAction( false );
								me.handleClearPreferences();
							}
						},
						'messageSentView messageSentGridInformationView panel[itemId="messageSentHeaderBarGridView"] image[itemId="summInfoShowHideGridView"]' :
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
						'messageSentGridInformationView' :
						{
							render : this.onMessageSentSummaryInformationViewRender
						},
						'messageSentTitleViewType' :
						{
							performReportAction : function( btn, opts )
							{
								me.handleReportAction( btn, opts );
							}
						},
						'messageSentFilterView combo[itemId="sellerCodeID"]' : 
						{
							select : function( combo, record, index )
							{
								/*var objFilterPanel = me.getSellerClientMenuBar();
								var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="clientCodeId"]' );
								objAutocompleter.cfgUrl = 'services/userseek/adminMsgCentrClientSeek.json';
								objAutocompleter.setValue( '' );
								objAutocompleter.cfgExtraParams = [{key : '$filtercode1', value : record[0].data.CODE }];
								me.applySeekFilter();*/
							},
							change : function( combo, record, index )
							{
								if( record == null )
								{
									//me.messageStatusFilterVal = 'All';
									//me.formGroupFilterVal = 'all';
									me.filterApplied = 'ALL';
									me.applySeekFilter();
								}
								var objFilterPanel = me.getSellerClientMenuBar();
								var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="clientCodeId"]' );
								objAutocompleter.cfgUrl = 'services/userseek/adminMsgCentrClientSeek.json';
								objAutocompleter.setValue( '' );
								objAutocompleter.cfgExtraParams = [{key : '$sellerCode', value : record }];
								//me.applySeekFilter();
							}
						},
						'messageSentFilterView AutoCompleter[itemId="clientCodeId"]' : 
						{
							select : function( combo, record, index )
							{
								var objFilterPanel = me.getSellerClientMenuBar();
								me.clientFilterVal  = record[0].data.CODE;
								me.clientFilterDesc = record[0].data.DESCR;
								me.applySeekFilter();
							},
							change : function( combo, record, index )
							{
								if( record == null )
								{
									me.clientFilterVal  = record;
									 me.clientFilterDesc = record;
									me.filterApplied = 'ALL';
									me.applySeekFilter();
									//me.messageStatusFilterVal = 'All';
									//me.formGroupFilterVal = 'all';
									//me.filterApplied = 'ALL';
									//me.applySeekFilter();
								}
							}
						},
						'messageSentView messageSentFilterView button[itemId="filterBtnId"]' : {
							click : function(btn, opts) {
								me.setDataForFilter();
								me.applyQuickFilter();
							}
						},
						'messageSentView messageSentTitleViewType' : {
						render : function(btn, opts) {
							me.preHandleTabPermissions(btn);
						}
					}
					} );
			},
			
			doHandleGroupByChange : function(menu, groupInfo) {
					var me = this;
					if (me.previouGrouByCode === 'ADVFILTER') {
						me.savePrefAdvFilterCode = null;
						me.showAdvFilterCode = null;
						me.filterApplied = 'ALL';
					}
					if (groupInfo && groupInfo.groupTypeCode === 'ADVFILTER') {
			//			me.previouGrouByCode = groupInfo.groupTypeCode;
					} 
			//			me.previouGrouByCode = null;
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

						} else {
							args = {
								scope : me
							};
							strModule = subGroupInfo.groupCode;
							me.postHandleDoHandleGroupTabChange(null,args);
						}
					}

				},
				postHandleDoHandleGroupTabChange : function(data, args) {
						var me = args.scope;
				var objGroupView = me.getGroupView();
				var objSummaryView = me.getMessageSentGridViewRef(), arrSortState = new Array(), objPref = null, gridModel = null, intPgSize = null, showPager = true;
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
			handleClientChange : function(client, clientDesc) {
				var me = this;
			},
		
			handleMessageStatusType : function( btn )
			{
				var me = this;
				me.toggleSavePrefrenceAction( true );
				me.getMessageSentStatusToolBar().items.each( function( item )
				{
					item.removeCls( 'xn-custom-heighlight' );
					item.addCls( 'xn-account-filter-btnmenu' );
				} );
				btn.addCls( 'xn-custom-heighlight xn-account-filter-btnmenu' );
				me.messageStatusFilterVal = btn.btnValue;
				me.messageStatusFilterDesc = btn.btnDesc;
				me.setDataForFilter();
				me.filterApplied = 'Q';
				me.applyQuickFilter();
			},
		
			setGridInfo : function( grid )
			{
				var me = this;
				var objGroupView = me.getGroupView();
				var grid = objGroupView.getGrid();	
				var messageSentGridInfo = me.getMessageSentGridInformationView();
				var mailSent = messageSentGridInfo
					.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="mailSent"]' );
				var mailReplied = messageSentGridInfo
					.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="mailReplied"]' );
				var dataStore = grid.store;
				dataStore.on( 'load', function( store, records)
				{
					var i = records.length - 1;
					if( i >= 0 )
					{
						mailSent.setText( records[ i ].get('mailSent') );
						mailReplied.setText( records[ i ].get('mailReplied') );
					}
					else
					{
						mailSent.setText( "" );
						mailReplied.setText( "" );
					}
				} );
			},
			getFilterUrl : function(subGroupInfo, groupInfo)
			{
				var me = this;
				var strQuickFilterUrl = '', strUrl = '', isFilterApplied = 'false';
				var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
									? subGroupInfo.groupQuery
									: '';
				if( me.filterApplied === 'ALL' || me.filterApplied === 'Q' )
				{
					strQuickFilterUrl = me.generateUrlWithQuickFilterParams( this );
					if (!Ext.isEmpty(strGroupQuery)) {
						if( !Ext.isEmpty( strQuickFilterUrl ) )
						{
							strQuickFilterUrl += ' and ' + strGroupQuery;
							strUrl += strQuickFilterUrl;
							isFilterApplied = true;
						}
					}
					else
					{
						if (!Ext.isEmpty(strQuickFilterUrl))
							strUrl += strQuickFilterUrl;
					}
					return strUrl;
				}
			},
			goToInbox : function()
			{
				var me = this;
				var strUrl = 'messageInboxCenter.srvc';
				var form;
				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'GET';
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue ) );
				form.action = strUrl;
				document.body.appendChild( form );
				form.submit();
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
			/*handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
			{
				var me = this;
				var actionName = btn.itemId;
				if( actionName === 'delete')
					me.handleGroupActions( btn, record );
				else if( actionName === 'btnView' )
				{
					viewResponseMessage(record,'Sent');
				}
			},*/
			doHandleRowActions : function( actionName, grid, record,rowIndex )
			{
				var me = this;				
				if( actionName === 'delete')
					me.handleGroupActions( actionName, grid, [record], 'rowAction' );
				else if( actionName === 'btnView' )
				{
					viewResponseMessage(record,'Sent');
				}
			},
			getMessageSentConfiguration : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;
				var expVal = null;
				if( !Ext.isEmpty( objGridViewPref ) )
				{
					var data = Ext.decode( objGridViewPref );
					var objPref = data[ 0 ];
					me.arrSorter = objPref.sortState;
				}
				if(entity_type === '0' || client_count > 1)
				{
					expVal = '0'
					objWidthMap =
					{
						"clientDesc" : 150,
						"sentDateTxt" : 150,
						"subject" : 250,
						"trackingNo" : 200,
						"formGroup" : 250,
						"messageStatus" : 200
					};
				}
				else
				{
					expVal = '1'
						objWidthMap =
						{
							"sentDateTxt" : 150,
							"subject" : 250,
							"trackingNo" : 200,
							"formGroup" : 250,
							"messageStatus" : 200
						};
				}
						
			switch (expVal) 
			{
				case '0' :
					arrColsPref =
						[
							{
								"colId" : "clientDesc",
								"colHeader" : "Client"
							},
							{
								"colId" : "sentDateTxt",
								//"colDesc" : "Date(Time)"
								"colHeader" : "Message Date Time"
							},
							{
								"colId" : "subject",
								"colHeader" : "Subject"
							},
							{
								"colId" : "trackingNo",
								"colHeader" : "Ref #"
							},
							{
								"colId" : "formGroup",
								"colHeader" : "Form Group"
							}
						];
					break;
				case '1' :
					arrColsPref =
						[
							{
								"colId" : "sentDateTxt",
								"colHeader" : "Date(Time)"
							},
							{
								"colId" : "subject",
								"colHeader" : "Subject"
							},
							{
								"colId" : "trackingNo",
								"colHeader" : "Ref #"
							},
							{
								"colId" : "formGroup",
								"colHeader" : "Form Group"
							},
							{
								"colId" : "messageStatus",
								"colHeader" : "Status"
							}
						];
					break;	
			}
				storeModel =
				{
					fields :
					[
						'sentDateTxt','subject', 'trackingNo', 'repliedBy', 'messageStatus', 'identifier','formGroup',
						'__metadata', 'mailSent', 'mailReplied','makerId','formCode','formType','reply','messageRead','recordKeyNo','clientDesc'
					],
					proxyUrl : 'getMessageSentList.srvc',
					rootNode : 'd.sent',
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
			handleLoadGridData : function(groupInfo, subGroupInfo,grid, url, pgSize, newPgNo, oldPgNo, sorter,filterData)
			{
				var me = this;
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );
				me.setDataForFilter();
				strUrl = strUrl + me.getFilterUrl(subGroupInfo, groupInfo) + "&" + csrfTokenName + "=" + csrfTokenValue;
				me.reportGridOrder = strUrl;
				grid.loadGridData( strUrl, null );
				me.setGridInfo(grid); 
			},
			setDataForFilter : function()
			{
				var me = this;
				//me.getSearchTxnTextInput().setValue( '' );
				if( this.filterApplied === 'Q' || this.filterApplied === 'ALL' )
				{
					this.filterData = this.getQuickFilterQueryJson();
				}
			},
			applyQuickFilter : function()
			{
				var me = this;
				 var objGroupView = me.getGroupView();
				 objGroupView.refreshData();
			},
			getQuickFilterQueryJson : function()
			{
				var me = this;
				var jsonArray = [];
				var index = me.dateFilterVal;
				var messageSentStatusFilterVal = me.messageStatusFilterVal;
				var objDateParams = me.getDateParam( index );
				if(index != '12')
				{
					jsonArray.push(
							{
								paramName : me.getMessageDate().filterParamName,
								paramValue1 : objDateParams.fieldValue1,
								paramValue2 : objDateParams.fieldValue2,
								operatorValue : objDateParams.operator,
								dataType : 'D'
							} );
				}
				
				if( messageSentStatusFilterVal != null && messageSentStatusFilterVal != 'All' )
				{
					if(messageSentStatusFilterVal == 1)
					{
						jsonArray.push(
						{
							paramName : me.getMessageSentStatusToolBar().filterParamName,
							paramValue1 : messageSentStatusFilterVal,
							operatorValue : 'eq',
							dataType : 'S'
						} );
					}
					else
					{
						jsonArray.push(
						{
							paramName : me.getMessageSentStatusToolBar().filterParamName,
							paramValue1 : 1,
							operatorValue : 'ne',
							dataType : 'S'
						} );
					}
				}
				if( me.formGroupFilterVal != null && me.formGroupFilterVal != 'all' )
				{
					jsonArray.push(
					{
						paramName : 'formGroup',
						paramValue1 : me.formGroupFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				var objOfCreateNewFilter = me.getSellerClientMenuBar();
				if (!Ext.isEmpty(objOfCreateNewFilter)){
					var sellerCode = objOfCreateNewFilter.down('combo[itemId="sellerCodeID"]');
					if (!Ext.isEmpty(sellerCode)) 
					{
						var sellerCodeValue = objOfCreateNewFilter.down('combo[itemId="sellerCodeID"]').getValue();
						if (!Ext.isEmpty(sellerCodeValue) && sellerCodeValue !== null) 
						{
							jsonArray.push({
								    paramName : 'sellerCode',
								    operatorValue : 'eq',
									paramValue1 : sellerCodeValue,
									dataType :'S'
							});
							me.sellerFilterVal = sellerCodeValue;
						}
					}/*
					var clientCode = objOfCreateNewFilter.down('AutoCompleter[itemId="clientCodeId"]');
					if (!Ext.isEmpty(clientCode)) 
					{
						var clientCodeCalue = objOfCreateNewFilter.down('AutoCompleter[itemId="clientCodeId"]').getValue();
						if (!Ext.isEmpty(clientCodeCalue) && clientCodeCalue !== null) 
						{
							jsonArray.push({
									paramName : 'clientCode',
									operatorValue : 'eq',
									paramValue1 : clientCodeCalue,
									dataType :'S'
							});
						}
					}*/
					
					//var clientCodeComboId = objOfCreateNewFilter.down('combo[itemId="clientCodeComboId"]');
					//if (!Ext.isEmpty(clientCodeComboId)) 
					{
						//var clientCodeComboIdValue = objOfCreateNewFilter.down('combo[itemId="clientCodeComboId"]').getValue();
						if (!Ext.isEmpty(me.clientFilterVal) &&  me.clientFilterVal !== null) 
						{
							jsonArray.push({
									paramName : 'clientCode',
									operatorValue : 'eq',
									paramValue1 : me.clientFilterVal,
									dataType :'S'
							});
						}
					}
				}
				return jsonArray;
			},
			enableValidActionsForGrid : function( grid, record, recordIndex, selectedRecords, jsonData )
			{
				var me = this;
				var buttonMask = '00';
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

				var grid = me.getMessageSentGrid();

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
			handleGroupActions : function(strAction, grid, arrSelectedRecords,strActionType)
			{
				var me = this;
				//var strAction = !Ext.isEmpty( btn.actionName ) ? btn.actionName : btn.itemId;
				var strUrl = Ext.String.format( 'MessageSent/{0}.srvc?',strAction );
				strUrl= strUrl+ csrfTokenName + "=" + csrfTokenValue;
				this.preHandleGroupActions(strUrl, '',  grid, arrSelectedRecords,
								strActionType, strAction);
			},
			preHandleGroupActions : function(strUrl, remark, grid, arrSelectedRecords,
								strActionType, strAction) 
			{

				var me = this;
				//var grid = this.getMessageSentGrid();
				var groupView = me.getGroupView();
				
				if( !Ext.isEmpty( groupView ) )
				{
					var arrayJson = new Array();
					var records = (arrSelectedRecords || []);
					/*records = ( !Ext.isEmpty( records ) && Ext.isEmpty( record ) ) ? records :
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
					Ext.Ajax.request(
					{
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode( arrayJson ),
						success : function( response )
						{
							// TODO : Action Result handling to
							// be done here
							me.enableDisableGroupActions( '00', true );
							groupView.refreshData();
						
						},
						failure : function()
						{
							var errMsg = "";
							Ext.MessageBox.show(
							{
								title : getLabel( 'messageErrorPopUpTitle', 'Error' ),
								msg : getLabel( 'messageErrorPopUpMsg', 'Error while fetching data..!' ),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							} );
						}
					} );
				}

			},
		
			
			doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
					objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
					var me = this;
					var objGroupView = me.getGroupView();
					var buttonMask = me.strDefaultMask;
					
					var maskArray = new Array(), actionMask = '', objData = null;;

					if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask)) {
						buttonMask = jsonData.d.__buttonMask;
					}
					var isSameUser = true;
					var isDisabled = false;
					var isSubmit = false;
					maskArray.push(buttonMask);
					for (var index = 0; index < arrSelectedRecords.length; index++) {
						objData = arrSelectedRecords[index];
						maskArray.push(objData.get('__metadata').__rightsMap);
						if (objData.raw.makerId === USER) {
							isSameUser = false;
						}
						if (objData.raw.validFlag != 'Y') {
							isDisabled = true;
						}
						if (objData.raw.isSubmitted == 'Y' && objData.raw.requestState == 0) {
							isSubmit = true;
						}
					}
					actionMask = doAndOperation(maskArray, 10);
					me.enableDisableGroupActions(actionMask, isSameUser, isDisabled,
							isSubmit);
			},
			enableDisableGroupActions : function( actionMask, isSameUser, isDisabled,
							isSubmit )
			{
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
		
		
			
			setInfoTooltip : function()
			{
				var me = this;
				var infotip = Ext.create( 'Ext.tip.ToolTip',
				{
					target : 'imgFilterInfoGridView',
					listeners :
					{
						beforeshow : function( tip )
						{
							var messageStatusVal = '';
							var dateFilter = me.dateFilterLabel;

							if( me.messageStatusFilterVal == 'All' && me.filterApplied == 'ALL' )
							{
								messageStatusVal = 'All';
							}
							else
							{
								messageStatusVal = me.messageStatusFilterDesc;
							}

							tip.update( 'Type' + ' : ' + messageStatusVal + '<br/>' + getLabel( 'date', 'Date' )
								+ ' : ' + dateFilter );
						}
					}
				} );
			},
			loadFormGroupDynamicFilters : function()
			{
				var me = this;
				var formGroupFilterActionToolBarRef = me.getFormGroupFilterActionToolBarRef();
				var moreFormGroupRef = me.getMoreFormGroupRef();
				var baseItem;
				var moreItem;

				for( var i = 0 ; i < formGroupList.length ; i++ )
				{
					if( i < 1 )
					{
						baseItem =
						{
							text : formGroupList[ i ][ 1 ],
							btnId : 'btnItem_' + formGroupList[ i ][ 0 ],
							btnValue : formGroupList[ i ][ 1 ],
							parent : this,
							cls : 'f13 xn-custom',
							handler : function( btn, opts )
							{
								me.handleFormGroupFilter( btn, opts );
							}
						};
						formGroupFilterActionToolBarRef.insert( i + 2, baseItem );
					}
					else
					{
						moreItem =
						{
							text : formGroupList[ i ][ 1 ],
							btnId : 'btnItem_' + formGroupList[ i ][ 0 ],
							btnValue : formGroupList[ i ][ 1 ],
							parent : this,
							handler : function( btn, opts )
							{
								me.handleFormGroupFilter( btn, opts );
							}
						};
						moreFormGroupRef.menu.add( moreItem );
					}
				}
			},
			handleFormGroupFilter : function( btn, opts )
			{
				var me = this;
				me.toggleSavePrefrenceAction( true );
				me.getFormGroupFilterActionToolBarRef().items.each( function( item )
				{
					item.removeCls( 'f13 xn-custom-heighlight' );
					item.addCls( 'f13 xn-custom' );
				} );
				me.getMoreFormGroupRef().menu.items.each( function( item )
				{
					item.removeCls( 'f13 xn-custom-heighlight' );
					item.addCls( 'f13 xn-custom' );
				} );
				btn.addCls( 'xn-custom-heighlight' );

				me.formGroupFilterVal = btn.btnValue;
				me.setDataForFilter();
				me.filterApplied = 'Q';
				me.applyQuickFilter();
			},
			renderFormGroupFilter : function()
			{
				var me = this;
				var temp = me.filterData;
				var formGroupFilterActionToolBarRef = me.getFormGroupFilterActionToolBarRef();
				var moreFormGroupRef = me.getMoreFormGroupRef();

				if( temp.length > 0 )
				{
					for(var i=0; i< temp.length ; i++ )
					{
						if(temp[ i ].paramName === 'formGroup' && temp[ i ].paramValue1 != 'all' )
						{
							me.formGroupFilterVal = temp[ i ].paramValue1;
						}
					}
				}
				
				formGroupFilterActionToolBarRef.items.each( function( item )
				{
					if(item.btnValue === me.formGroupFilterVal )
					{
						item.addCls( 'f13 xn-custom-heighlight' );
					}
					else
					{
						item.removeCls( 'f13 xn-custom-heighlight' );
						item.addCls( 'f13 xn-custom' );
					}
				} );

				moreFormGroupRef.menu.items.each( function( item )
				{
					if(item.btnValue === me.formGroupFilterVal )
					{
						item.addCls( 'f13 xn-custom-heighlight' );	
					}
					else
					{
						item.removeCls( 'f13 xn-custom-heighlight' );
						item.addCls( 'f13 xn-custom' );
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
				var me = this;
				var strUrl = me.urlGridPref;				
				var  objPref = {};
				var arrCols = null, objCol = null, arrColPref = null, arrPref = [],objFilterPref = null;
				var objGroupView = me.getGroupView();
				var grid = objGroupView.getGrid();
				var gridState=grid.getGridState();
				
				var arrPref = new Array();				
				/*if( !Ext.isEmpty( grid ) )
				{
					//arrCols = grid.headerCt.getGridColumns();
					//for( var j = 0 ; j < arrCols.length ; j++ )
					//{
					//	objCol = arrCols[ j ];
					//	if( !Ext.isEmpty( objCol ) && !Ext.isEmpty( objCol.itemId )
					//		&& objCol.itemId.startsWith( 'col_' ) && !Ext.isEmpty( objCol.xtype )
					//		&& objCol.xtype !== 'actioncolumn' && objCol.itemId !== 'col_textaction' && objCol.dataIndex != null)
					//		arrColPref.push(
					//		{
					//			colId : objCol.dataIndex,
					//			colHeader : objCol.text
					//		} );

					//	}
					objPref.pgSize = gridState.pageSize;
					objPref.gridCols = gridState.columns;
					objPref.sortState = gridState.sortState;	
					arrPref.push( objPref );
				}*/
					objPref.pgSize = gridState.pageSize;
					objPref.gridCols = gridState.columns;
					objPref.sortState = gridState.sortState;	
					arrPref.push( objPref );

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
							me.toggleClearPrefrenceAction(true);	
						},
						failure : function()
						{
							var errMsg = "";
							Ext.MessageBox.show(
							{
								title : getLabel( 'messageErrorPopUpTitle', 'Error' ),
								msg : getLabel( 'messageErrorPopUpMsg', 'Error while fetching data..!' ),
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
				var objFilterPref = {};
				var infoPanel = me.getMessageSentGridInformationView();
				var filterViewCollapsed = (me.getMessageSentFilterView().getCollapsed() === false) ? false : true; 
				var infoViewCollapsed = infoPanel.down('image[itemId="summInfoShowHideGridView"]').hasCls("icon_expand_summ");
				if( !Ext.isEmpty( me.savePrefAdvFilterCode ) )
				{
					advFilterCode = me.savePrefAdvFilterCode;
				}
				var objQuickFilterPref = {};
				objQuickFilterPref.messageStatus = me.messageStatusFilterVal;
				objQuickFilterPref.messageDate = me.dateFilterVal;
				objQuickFilterPref.formGroup = me.formGroupFilterVal;
				objQuickFilterPref.filterPanelCollapsed = filterViewCollapsed;
				objQuickFilterPref.infoPanelCollapsed = infoViewCollapsed;
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
								title : getLabel( 'messageErrorPopUpTitle', 'Error' ),
								msg : getLabel( 'messageErrorPopUpMsg', 'Error while fetching data..!' ),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							} );
						}
					} );
			},
			clearWidgetPreferences : function() {
				var me = this, objPref = {}, arrCols = null, objCol = null,objWdgtPref = null;
				var strUrl = me.commonPrefUrl+"?$clear=true";
				var grid = me.getMessageSentGrid();
				var arrColPref = new Array();
				var arrPref = new Array();
				if (!Ext.isEmpty(grid)) {
					arrCols = grid.headerCt.getGridColumns();
					for( var j = 0 ; j < arrCols.length ; j++ )
					{
						objCol = arrCols[ j ];
						if( !Ext.isEmpty( objCol ) && !Ext.isEmpty( objCol.itemId )
							&& objCol.itemId.startsWith( 'col_' ) && !Ext.isEmpty( objCol.xtype )
							&& objCol.xtype !== 'actioncolumn' && objCol.itemId !== 'col_textaction' && objCol.dataIndex != null)
							arrColPref.push(
							{
								colId : objCol.dataIndex,
								colHeader : objCol.text
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
										me.toggleClearPrefrenceAction(false);
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
					me.getDateLabel().setText( getLabel( 'messageDate', 'Message Date' ) + "(" + me.dateFilterLabel + ")" );
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
			onMessageSentSummaryInformationViewRender : function()
			{
				var me = this;
				var accSummInfoViewRef = me.getMessageSentGridInformationView();
				accSummInfoViewRef.createSummaryLowerPanelView();
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

					var strDtValue = data.quickFilter.messageDate;
					var strDtFrmValue = data.quickFilter.fromDate;
					var strDtToValue = data.quickFilter.toDate;
					var strmessageStatus = data.quickFilter.messageStatus;
					var strFormGroup = data.quickFilter.formGroup;
					filterPanelCollapsed = !Ext.isEmpty(data.quickFilter.filterPanelCollapsed) ? data.quickFilter.filterPanelCollapsed : true;
					infoPanelCollapsed = !Ext.isEmpty(data.quickFilter.infoPanelCollapsed) ? data.quickFilter.infoPanelCollapsed : true;
					
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
						me.messageStatusFilterVal = !Ext.isEmpty( strmessageStatus ) ? strmessageStatus : 'All';
						me.formGroupFilterVal = !Ext.isEmpty( strFormGroup ) ? strFormGroup : 'all';
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
							paramName : 'MessageDate',
							paramValue1 : strVal1,
							paramValue2 : strVal2,
							operatorValue : strOpt,
							dataType : 'D'
						} );
					}
					
				}

				if( !Ext.isEmpty( me.messageStatusFilterVal ) && me.messageStatusFilterVal != 'All' )
				{
					arrJsn.push(
					{
						paramName : 'messageStatus',
						paramValue1 : me.messageStatusFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				if( !Ext.isEmpty( me.formGroupFilterVal ) && me.formGroupFilterVal != 'all' )
				{
					arrJsn.push(
					{
						paramName : 'formGroup',
						paramValue1 : me.formGroupFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				me.filterData = arrJsn;
			},
			handleReportAction : function( btn, opts )
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
				strUrl = 'services/sent/getDynamicReport.' + strExtension;
				strUrl += '?$skip=1';
				var strQuickFilterUrl = me.generateUrlWithQuickFilterParams( this );
				strUrl += strQuickFilterUrl;
				var strOrderBy = me.reportGridOrder;
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
			createFormField : function( element, type, name, value )
			{
				var inputField;
				inputField = document.createElement( element );
				inputField.type = type;
				inputField.name = name;
				inputField.value = value;
				return inputField;
			},
			showHideSellerClientMenuBar : function(entity_type)
			{
				var me = this;
				if(entity_type === '0')
				{
					me.getClientMenuBar().show();
					me.getSellerMenuBar().show();
					me.getClientLoginMenuBar().hide();
					//me.getClientLoginMenuBar().hide();
				}
				else
				{
					me.getSellerMenuBar().hide();
					me.getClientMenuBar().hide();
					if(client_count >= 1)
					{
						me.getClientLoginMenuBar().show();
						me.getFilterBtn().show();
					}
					else
					{
						me.getClientLoginMenuBar().hide();
						me.getFilterBtn().hide();
					}
					
				}
			},
			applySeekFilter : function()
			{
				var me = this;
				me.toggleSavePrefrenceAction( true );
				me.setDataForFilter();
				me.filterApplied = 'Q';
				me.applyQuickFilter();
			},
			preHandleTabPermissions : function() {
			var me = this;
			Ext.Ajax
						.request({
							url : 'services/sent/getUserEventTemplateCode.json',
							method : 'POST',
							success : function(response) {
								var errorMessage = '';
								//if (response.responseText== '') 
								//	me.getManageAlertsTab().setVisible(false); //giving error- Existing issue
							},
							failure : function() {
								var errMsg = "";
								Ext.MessageBox
										.show({
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
		});	
