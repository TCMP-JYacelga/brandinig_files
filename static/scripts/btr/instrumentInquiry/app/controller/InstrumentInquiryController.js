Ext
	.define(
		'GCP.controller.InstrumentInquiryController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'GCP.view.InstrumentInquiryGridView', 'Ext.ux.gcp.DateHandler'
			],
			views :
			[
				'GCP.view.InstrumentInquiryView', 'GCP.view.InstrumentInqAdvancedFilterPopup',
				'GCP.view.InstrumentInqViewInfo'
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
					ref : 'instrumentInqGrid',
					selector : 'instrumentInquiryView instrumentInquiryGridView grid[itemId="gridViewMstId"]'
				},
				{
					ref : 'instrumentInqDtlView',
					selector : 'instrumentInquiryView instrumentInquiryGridView panel[itemId="instrumentInqDtlView"]'
				},
				{
					ref : 'instrumentInquiryGridView',
					selector : 'instrumentInquiryView instrumentInquiryGridView'
				},
				{
					ref : 'matchCriteria',
					selector : 'instrumentInquiryGridView radiogroup[itemId="matchCriteria"]'
				},
				{
					ref : 'searchTxnTextInput',
					selector : 'instrumentInquiryGridView textfield[itemId="searchTxnTextField"]'
				},
				{
					ref : 'btnSavePreferences',
					selector : 'instrumentInquiryView instrumentInquiryFilterView button[itemId="btnSavePreferences"]'
				},
				{
					ref : 'btnClearPreferences',
					selector : 'instrumentInquiryView instrumentInquiryFilterView button[itemId="btnClearPreferences"]'
				},
				{
					ref : 'fromDateLabel',
					selector : 'instrumentInquiryView instrumentInquiryFilterView label[itemId="dateFilterFrom"]'
				},
				{
					ref : 'toDateLabel',
					selector : 'instrumentInquiryView instrumentInquiryFilterView label[itemId="dateFilterTo"]'
				},
				{
					ref : 'dateLabel',
					selector : 'instrumentInquiryView instrumentInquiryFilterView label[itemId="dateLabel"]'
				},
				{
					ref : 'fromInstrumentDate',
					selector : 'instrumentInquiryView instrumentInquiryFilterView datefield[itemId="fromDate"]'
				},
				{
					ref : 'toInstrumentDate',
					selector : 'instrumentInquiryView instrumentInquiryFilterView datefield[itemId="toDate"]'
				},
				{
					ref : 'dateRangeComponent',
					selector : 'instrumentInquiryView instrumentInquiryFilterView container[itemId="dateRangeComponent"]'
				},
				{
					ref : 'instrumentDateRef',
					selector : 'instrumentInquiryView instrumentInquiryFilterView button[itemId="instrumentDateItemId"]'
				},
				{
					ref : 'advFilterActionToolBar',
					selector : 'instrumentInquiryView instrumentInquiryFilterView toolbar[itemId="advFilterActionToolBar"]'
				},
				/*{
					ref : 'productActionToolBar',
					selector : 'instrumentInquiryGridView toolbar[itemId="paymentActionToolBar"]'
				},*/
				/*{
					ref : 'instrumentAccoutLabel',
					selector : 'instrumentInquiryView instrumentInquiryFilterView label[itemId="instrumentAccoutLabel"]'
				},*/
				{
					ref : 'instrumentInqStatusToolBar',
					selector : 'instrumentInquiryView instrumentInquiryFilterView toolbar[itemId="instrumentInqStatusToolBar"]'
				},
				{
					ref : 'instrumentInqStatusToolBar',
					selector : 'instrumentInquiryView instrumentInquiryFilterView toolbar[itemId="instrumentInqStatusToolBar"]'
				},
				{
					ref : 'instrumentInquiryInformation',
					selector : 'instrumentInquiryInformation'
				},
				{
					ref : 'infoSummaryLowerPanel',
					selector : 'instrumentInquiryInformation panel[itemId="infoSummaryLowerPanel"]'
				},
				{
					ref : 'depSlipBtnRef',
					selector : 'instrumentInquiryInformation button[itemId="depSlipBtnItemId"]'
				},
				{
					ref : 'depSlipMenuRef',
					selector : 'instrumentInquiryInformation menu[itemId="depSlipMenuItemId"]'
				},
				{
					ref : 'advanceFilterPopup',
					selector : 'instrumentInqAdvancedFilterPopup[itemId="stdViewAdvancedFilter"]'
				},
				{
					ref : 'advanceFilterTabPanel',
					selector : 'instrumentInqAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] tabpanel[itemId="advancedFilterTab"] '
				},
				{
					ref : 'filterDetailsTab',
					selector : 'instrumentInqAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] tabpanel[itemId="advancedFilterTab"] panel[itemId="filterDetailsTab"]'
				},
				{
					ref : 'createNewFilter',
					selector : 'instrumentInqAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] instrumentInqCreateNewAdvFilter'
				},
				{
					ref : 'advFilterGridView',
					selector : 'instrumentInqAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] instrumentInqAdvFilterGridView'
				},
				{
					ref : 'saveSearchBtn',
					selector : 'instrumentInqAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] instrumentInqCreateNewAdvFilter button[itemId="saveAndSearchBtn"]'
				},
				{
					ref : 'instrumentInqViewInfoDtlRef',
					selector : 'instrumentInqViewInfo[itemId="viewInfoPopupId"] panel[itemId="instrumentInqViewInfoItemId"]'
				},
				{
					ref : 'instrumentInqViewInfoRef',
					selector : 'instrumentInqViewInfo[itemId="viewInfoPopupId"]'
				},
				{
					ref : 'withHeaderCheckboxRef',
					selector : 'instrumentInquiryView menuitem[itemId="withHeaderId"]'
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
				dateFilterFromVal : '',
				dateFilterToVal : '',
				dateFilterLabel : getLabel( 'lblLatest', 'Latest' ),
				filterCodeValue : null,
				savePrefAdvFilterCode : null,
				urlGridPref : 'userpreferences/instrumentInq/gridView.srvc',
				urlGridFilterPref : 'userpreferences/instrumentInq/gridViewFilter.srvc',
				commonPrefUrl : 'services/userpreferences/instrumentInq.json',
				dateHandler : null,
				customizePopup : null,
				reportOrderByURL : null
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

				GCP.getApplication().on(
				{
					callPopulateInstrumentImage : function( imageNmbr )
					{
						me.populateInstrumentImage( imageNmbr );
					},
					callDepositPage : function( depSlipNmbr )
					{
						me.goToDepositPage( depSlipNmbr );
					},
					handleCancelButtonAction : function() {
								me.handleCancelButtonAction('depositInquiry.srvc');
							}
					
				} );

				me.objAdvFilterPopup = Ext.create( 'GCP.view.InstrumentInqAdvancedFilterPopup',
				{
					parent : 'instrumentInqStdView',
					itemId : 'stdViewAdvancedFilter',
					filterPanel :
					{
						xtype : 'instrumentInqCreateNewAdvFilter',
						margin : '4 0 0 0',
						callerParent : 'instrumentInqStdView'
					}
				} );

				me.objViewInfoPopup = Ext.create( 'GCP.view.InstrumentInqViewInfo',
				{
					parent : 'instrumentInquiryView',
					itemId : 'viewInfoPopupId'
				} );

				this.dateHandler = Ext.create( 'Ext.ux.gcp.DateHandler' );
				var showClearFlag = false;
				var btnClearPref = me.getBtnClearPreferences();
				if( !Ext.isEmpty( objGridViewPref ))
				{
					me.showClearFlag = true;
					if(btnClearPref)
						btnClearPref.setEnabled(true);
				}
				else
				{
					me.showClearFlag = false;
					if(btnClearPref)
						btnClearPref.setEnabled(false);
				}
				me.updateFilterConfig();
				me.updateAdvFilterConfig();

				me
					.control(
					{
						'instrumentInquiryView' :
						{
							beforerender : function( panel, opts )
							{
								//				me.loadDetailCount();
							},
							afterrender : function( panel, opts )
							{
								var objFilterPanel = me.getInstrumentInquiryInformation();
								var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="depSlipIdItemId"]' );

								if( entityType == '0' )
								{
									objAutocompleter.cfgUrl = 'services/userseek/bankDepositSlipNoSeek.json';
								}
							},
							performReportAction : function( btn, opts )
							{
								me.handleReportAction( btn, opts );
							}
						},
						'instrumentInquiryGridView' :
						{
							render : function( panel )
							{
								me.handleSmartGridConfig();
								// condition commented
								//if( isMenuClicked == 'N' )
								me.retrieveData();
							}
						},

						'instrumentInquiryGridView smartgrid' :
						{
							/*render : function(grid) {
								me.handleLoadGridData(grid, grid.store.dataUrl,
										grid.pageSize, 1, 1, null);
							},*/
							gridPageChange : me.handleLoadGridData,
							gridSortChange : me.handleLoadGridData,
							gridRowSelectionChange : function( grid, record, recordIndex, records, jsonData )
							{
								me.enableValidActionsForGrid( grid, record, recordIndex, records, jsonData );
							}

						},
						'instrumentInquiryGridView textfield[itemId="searchTxnTextField"]' :
						{
							change : function( btn, opts )
							{
								me.searchTrasactionChange();
							}
						},
						'instrumentInquiryGridView radiogroup[itemId="matchCriteria"]' :
						{
							change : function( btn, opts )
							{
								me.searchTrasactionChange();
							}
						},
						'instrumentInquiryView instrumentInquiryFilterView' :
						{
							render : function( panel, opts )
							{
								me.setInfoTooltip();
								me.handleAccountLoading( panel );
								me.getAllSavedAdvFilterCode( panel );
								me.renderTypeFilter();
							},
							filterType : function( btn, opts )
							{
								me.toggleSavePrefrenceAction( true );
								me.toggleClearPrefrenceAction( true );
								me.handleType( btn );
							},
							/*filterPaymentAction : function(btn, opts) {
								me.toggleSavePrefrenceAction(true);
								me.handleProductAction(btn);
							},*/
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
									me.toggleClearPrefrenceAction( true );
									me.onInstrumentInquiryInformationViewRender();
								}

							},
							doRetrieve : function( btn, opts )
							{
								me.retrieveData();
							}
						},
						'instrumentInquiryView instrumentInquiryFilterView toolbar[itemId="dateToolBar"]' :
						{
							afterrender : function( tbar, opts )
							{
								me.updateDateFilterView();
							}
						},
						'instrumentInquiryView instrumentInquiryFilterView button[itemId="goBtn"]' :
						{
							click : function( btn, opts )
							{
								var frmDate = me.getFromInstrumentDate().getValue();
								var toDate = me.getToInstrumentDate().getValue();

								if( !Ext.isEmpty( frmDate ) && !Ext.isEmpty( toDate ) )
								{
									var dtParams = me.getDateParam( '7' );
									me.dateFilterFromVal = dtParams.fieldValue1;
									me.dateFilterToVal = dtParams.fieldValue2;
									me.setDataForFilter();
									me.applyQuickFilter();
									me.toggleSavePrefrenceAction( true );
									me.toggleClearPrefrenceAction( true );
									me.onInstrumentInquiryInformationViewRender();
								}
							}
						},
						'instrumentInquiryView instrumentInquiryFilterView button[itemId="btnSavePreferences"]' :
						{
							click : function( btn, opts )
							{
								me.toggleSavePrefrenceAction( false );
								me.handleSavePreferences();
								me.toggleClearPrefrenceAction(true);
							}
						},
						'instrumentInquiryView instrumentInquiryFilterView button[itemId="btnClearPreferences"]' :
						{
							click : function( btn, opts )
							{
								me.toggleSavePrefrenceAction( false );
								me.handleClearPreferences();
								me.toggleClearPrefrenceAction(false);
							}
						},
						'instrumentInquiryInformation panel[itemId="instrumentInquiryInfoGridView"] image[itemId="summInfoShowHideGridView"]' :
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
						'instrumentInquiryInformation' :
						{
							render : this.onInstrumentInquiryInformationViewRender
						},
						'instrumentInqAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] instrumentInqCreateNewAdvFilter' :
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
							handleRangeFieldsShowHide : function( objShow )
							{
								me.handleRangeFieldsShowHide( objShow );
							}
						},
						'instrumentInqAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] instrumentInqAdvFilterGridView' :
						{
							orderUpEvent : me.orderUpDown,
							deleteFilterEvent : me.deleteFilterSet,
							viewFilterEvent : me.viewFilterData,
							editFilterEvent : me.editFilterData
						},
						'instrumentInquiryView instrumentInquiryFilterView button[itemId="newFilter"]' :
						{
							click : function( btn, opts )
							{
								me.advanceFilterPopUp( btn );
							}
						},
						/*'instrumentInqAdvancedFilterPopup instrumentInqAdvFilterGridView grid' : {
							render : function(grid) {
								me.handleAdvFltLoadGridData(grid);
							}
						},*/
						'instrumentInquiryView instrumentInquiryFilterView toolbar[itemId="advFilterActionToolBar"]' :
						{
							handleSavedFilterItemClick : me.handleFilterItemClick

						},
						'instrumentInqViewInfo[itemId="viewInfoPopupId"]' :
						{
							closeInstrumentInqInfoPopup : function( btn )
							{
								me.closeInstrumentInqInfoPopup( btn );
							}
						},
						'instrumentInquiryView instrumentInquiryFilterView AutoCompleter[itemId="depSlipIdItemId"]' :
						{
							select : function( combo, record, index )
							{
								me.handleDepSlipFilter( record[ 0 ].data.CODE );
							},
							change : function( combo, record, index )
							{
								if( record == null )
								{
									me.handleDepSlipFilter( "All" );
								}
							}
						}
					} );
			},

			handleDepSlipFilter : function( selectedValue )
			{
				var me = this;
				me.toggleSavePrefrenceAction( true );
				me.toggleClearPrefrenceAction( true );
				depSlipNmbr = selectedValue;
				me.setDataForFilter();
				if( depSlipNmbr === 'All' )
				{
					me.filterApplied = 'ALL';
					me.applyFilter();
				}
				else
				{
					me.applyQuickFilter();
				}
			},

			handleSmartGridConfig : function()
			{
				var me = this;
				var instrumentInqGrid = me.getInstrumentInqGrid();
				/*var objConfigMap = me.getNonCMSConfiguration();
				var arrCols = new Array();
				arrCols = me.getColumns(objConfigMap.arrColsPref,
						objConfigMap.objWidthMap);
				if (!Ext.isEmpty(nonCMSGrid))
					nonCMSGrid.destroy(true);
				me.handleSmartGridLoading(arrCols, objConfigMap.storeModel);
				*/
				if( Ext.isEmpty( instrumentInqGrid ) )
				{
					if( !Ext.isEmpty( objGridViewPref ) )
						me.loadSmartGrid( Ext.decode( objGridViewPref ) );
					else if( objDefaultGridViewPref )
						me.loadSmartGrid( objDefaultGridViewPref );
				}
				else
				{
					me.handleLoadGridData( grid, grid.store.dataUrl, grid.pageSize, 1, 1, null );
				}
			},

			loadSmartGrid : function( data )
			{
				var me = this;
				var objPref = null, arrCols = new Array(), arrColsPref = null, pgSize = null;
				var instrumentInqGrid = null;
				var objWidthMap =
				{
					"instrumentNmbr" : 120,
					"instrumentAmount" : 120,
					"instrumentDate" : 100,
					"depSlipNmbr" : 120,
					"depositDate" : 100,
					"depositAccount" : 140,
					"instrumentStatus" : 100
				};
				objPref = data[ 0 ];
				arrColsPref = objPref.gridCols;
				arrCols = me.getColumns( arrColsPref, objWidthMap );
				//pgSize = !Ext.isEmpty( objPref.pgSize ) ? parseInt( objPref.pgSize ) : 10;
				pgSize = 10;
				instrumentInqGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'gridViewMstId',
					itemId : 'gridViewMstId',
					pageSize : pgSize,
					autoDestroy : true,
					stateful : false,
					showEmptyRow : false,
					hideRowNumbererColumn : true,
					showSummaryRow : true,
					showCheckBoxColumn : false,
					padding : '5 10 10 10',
					rowList :
					[
						10, 25, 50, 100, 200, 500
					],
					minHeight : 140,
					//maxHeight : 280,
					columnModel : arrCols,
					storeModel :
					{
						fields :
						[
							 'clientDesc','instrumentNmbr', 'instrumentAmount', 'instrumentDate', 'depSlipNmbr', 'depositDate',
							'depositAccount', 'instrumentStatus', 'instrumentImgNmbr', 'identifier', '__metadata',
							'__subTotal', 'totalChecksSummaryCountInfo', 'totalChecksSummaryTotalInfo',
							'paidChecksSummaryCountInfo', 'paidChecksSummaryTotalInfo', 'unPaidChecksSummaryCountInfo',
							'unPaidChecksSummaryTotalInfo', 'instrumentSeqNmbr', 'draweeBankCode','debitAccount','rtn'
						],
						proxyUrl : 'instrumentInquiryGridList.srvc',
						rootNode : 'd.txnlist',
						totalRowsNode : 'd.__count'
					},
					isRowIconVisible : me.isRowIconVisible,
					isRowMoreMenuVisible : false,
					//			handleRowMoreMenuClick : me.handleRowMoreMenuClick,

					handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
					{
						me.handleRowIconClick( tableView, rowIndex, columnIndex, btn, event, record );
					}
				} );

				var instrumentInqDtlView = me.getInstrumentInqDtlView();
				instrumentInqDtlView.add( instrumentInqGrid );
				instrumentInqDtlView.doLayout();
			},

			handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
			{
				var me = this;
				var actionName = btn.itemId;
				if( actionName === 'btnView' )
				{
					me.instrumentInqviewInfoPopUp( record );
					//me.showResponseView( record.get( 'view' ).__deferred.uri, record.get( 'identifier' ) );
				}
				else
				{
					// view image action column removed
					//me.populateInstrumentImage( record.get( 'instrumentImgNmbr' ) );
				}
			},

			retrieveData : function()
			{
				var me = this;
				var grid = me.getInstrumentInqGrid();
				me.isGridDataLoad = true;
				me.handleLoadGridDataOnGO( grid, grid.store.dataUrl, grid.pageSize, 1, 1, null );
				me.onInstrumentInquiryInformationViewRender();
			},

			populateInstrumentImage : function( imageNmbr )
			{
				var me = this;
				var strUrl = 'getInstrumentImage.srvc?$imageNmbr=' + imageNmbr + '&' + csrfTokenName + "="
					+ csrfTokenValue;
				$.ajax(
				{
					type : 'POST',
					//data : JSON.stringify( arrayJson ),
					url : strUrl,
					//contentType : "application/json",
					dataType : 'html',
					success : function( data )
					{
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
							height : "auto",
							modal : true,
							resizable : true,
							width : "auto",
							title : 'Image',
							buttons :[
								{
									text:getLabel('btnOk','Ok'),
									click : function() {
										$(this).dialog("close");
									}
								}
							]
						} );
						$( '#dialogMode' ).val( '1' );
						$( '#instrumentImageDiv' ).dialog( 'open' );
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

			handleLoadGridData : function( grid, url, pgSize, newPgNo, oldPgNo, sorter )
			{
				var me = this;
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );
				me.setDataForFilter();
				strUrl = strUrl + me.getFilterUrl() + '&' + csrfTokenName + '=' + csrfTokenValue;
				me.reportOrderByURL = strUrl;
				grid.loadGridData( strUrl, null );
			},

			handleLoadGridDataOnGO : function( grid, url, pgSize, newPgNo, oldPgNo, sorter )
			{
				var me = this;
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );
				me.filterApplied = 'ALL';
				//this.filterData = me.setUserFilterData();
				this.filterData = me.getQuickFilterQueryJson();

				strUrl = strUrl + me.getFilterUrl() + '&' + csrfTokenName + '=' + csrfTokenValue;
				grid.loadGridData( strUrl, null );
			},

			enableValidActionsForGrid : function( grid, record, recordIndex, selectedRecords, jsonData )
			{
				var me = this;
				var buttonMask = '0000000000';
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

				var grid = me.getInstrumentInqGrid();
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
									// populate indexes array, set currentIndex, and
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
			getColumns : function( arrColsPref, objWidthMap )
			{
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				arrCols.push( me.createActionColumn() )
				if( !Ext.isEmpty( arrColsPref ) )
				{
					for( var i = 0 ; i < arrColsPref.length ; i++ )
					{
						objCol = arrColsPref[ i ];
						cfgCol = {};
						cfgCol.colHeader = objCol.colDesc;
						cfgCol.colId = objCol.colId;
						cfgCol.hidden = objCol.colHidden;
						if( !Ext.isEmpty( objCol.colType ) )
						{
							cfgCol.colType = objCol.colType;
							if( cfgCol.colType === "number" )
								cfgCol.align = 'right';
						}

						if( objCol.colId === 'instrumentNmbr' ) // to show the summary row description
						{
							cfgCol.fnSummaryRenderer = function( value, summaryData, dataIndex, colId )
							{
								var strRet = getLabel( 'lblsubtotal', 'Sub Total' );
								return strRet;
							}
						}

						if( objCol.colId === 'instrumentAmount' ) // to show subtotal value
						{
							cfgCol.fnSummaryRenderer = function( value, summaryData, dataIndex, colId )
							{
								var instrumentInqGrid = me.getInstrumentInqGrid();
								if( !Ext.isEmpty( instrumentInqGrid ) && !Ext.isEmpty( instrumentInqGrid.store ) )
								{
									var data = instrumentInqGrid.store.proxy.reader.jsonData;
									if( data && data.d && data.d.__subTotal )
									{
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
				var strRetValue = value;
				var isVisibleInstImg = isHidden( 'ViewInstrument' );
				if( value != '' )
				{
					if( colId === 'col_instrumentNmbr' && !isVisibleInstImg && !Ext.isEmpty(viewInstImgFeatureValue) &&  viewInstImgFeatureValue === 'Y' )
					{
						strRetValue = value
							+ ' '
							+ '<a href="#" title="Image" class="grid-row-action-icon grid-row-check-icon" onclick="getPopulateInstrumentImage( \''
							+ record.get( 'instrumentImgNmbr' ) + '\' )"></a>';
					}
					else if( colId === 'col_instrumentStatus' )
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
							var instrumentInqTypeVal = '';
							//							var chkMgmtActionVal = '';
							var dateFilter = me.dateFilterLabel;

							if( me.typeFilterVal == 'all' && me.filterApplied == 'ALL' )
							{
								instrumentInqTypeVal = 'All';
								me.showAdvFilterCode = null;
							}
							else
							{
								instrumentInqTypeVal = me.typeFilterDesc;
							}

							/*if (me.actionFilterVal == 'all') {
								chkMgmtActionVal = 'All';
							} else {
								chkMgmtActionVal = me.actionFilterDesc;
							}*/
							var advfilter = me.showAdvFilterCode;
							if( advfilter == '' || advfilter == null )
							{
								advfilter = getLabel( 'none', 'None' );
							}

							tip.update( 'Type' + ' : ' + instrumentInqTypeVal + '<br/>'
								+ getLabel( 'lblCheckDate', 'Item Date' ) + ' : ' + dateFilter + '<br/>'
								/*	+ getLabel('actions', 'Actions') + ' : '
									+ chkMgmtActionVal + '<br/>'*/
								+ getLabel( 'advancedFilter', 'Advanced Filter' ) + ':' + advfilter );
						}
					}
				} );
			},
			toggleSavePrefrenceAction : function( isVisible )
			{
				var me = this;
				var btnPref = me.getBtnSavePreferences();
				me.showClearFlag = true;
				if( !Ext.isEmpty( btnPref ) )
					btnPref.setDisabled( !isVisible );

			},
			toggleClearPrefrenceAction : function(isVisible) {
				var me = this;
				var btnPref = me.getBtnClearPreferences();
				if (!Ext.isEmpty(btnPref))
				{
					if( me.showClearFlag )
					{
						btnPref.setDisabled(false);
					}
					else
					{
						btnPref.setDisabled(true);
					}
				}
			},
			updateDateFilterView : function()
			{
				var me = this;
				var dtInstrumentDate = null;
				if( !Ext.isEmpty( me.dateFilterVal ) )
				{
					me.handleDateChange( me.dateFilterVal );
					if( me.dateFilterVal === '7' )
					{
						if( !Ext.isEmpty( me.dateFilterFromVal ) )
						{
							dtInstrumentDate = Ext.Date.parse( me.dateFilterFromVal, "Y-m-d" );
							me.getFromInstrumentDate().setValue( dtInstrumentDate );
						}
						if( !Ext.isEmpty( me.dateFilterToVal ) )
						{
							dtInstrumentDate = Ext.Date.parse( me.dateFilterToVal, "Y-m-d" );
							me.getToInstrumentDate().setValue( dtInstrumentDate );
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
						getLabel( 'lblCheckDate', 'Item Date' ) + "(" + me.dateFilterLabel + ")" );
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
						var frmDate = me.getFromInstrumentDate().getValue();
						var toDate = me.getToInstrumentDate().getValue();
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

			onInstrumentInquiryInformationViewRender : function()
			{
				var me = this;

				var infoLowerPanel = me.getInfoSummaryLowerPanel();
				var instrumentInfoViewRef = me.getInstrumentInquiryInformation();
				if( !Ext.isEmpty( instrumentInfoViewRef ) && !Ext.isEmpty( infoLowerPanel ) )
				{
					instrumentInfoViewRef.remove( infoLowerPanel );
				}

				if( !me.isGridDataLoad )
					return;

				var instrumentInqSummInfoViewRef = me.getInstrumentInquiryInformation();
				instrumentInqSummInfoViewRef.createSummaryLowerPanelView();
				me.setGridInfoSummary();
				//	me.populateDepSlipList();
			},

			populateDepSlipList : function()
			{
				var me = this;
				var depSlipBtnRef = me.getDepSlipBtnRef();
				var depSlipMenuRef = me.getDepSlipMenuRef();
				depSlipBtnRef.setText( '<span class="button_underline thePoniter ux_font-size14-normal">' + depSlipNmbr + '</span>' );

				moreItem =
				{
					text : getLabel( 'lbl.all', 'All' ),
					btnId : 'btnItem_all',
					btnValue : 'All',
					//cls : 'xn-account-filter-btnmenu',
					cls : 'f13 xn-custom',
					parent : this,
					handler : function( btn, opts )
					{
						me.handleDepositSlipFilter( btn, opts );
					}
				};
				depSlipMenuRef.add( moreItem );

				for( var i = 0 ; i < depSlipList.length ; i++ )
				{
					moreItem =
					{
						text : depSlipList[ i ],
						btnId : 'btnItem_' + depSlipList[ i ],
						btnValue : depSlipList[ i ],
						//cls : 'xn-account-filter-btnmenu',
						cls : 'f13 xn-custom',
						parent : this,
						handler : function( btn, opts )
						{
							me.handleDepositSlipFilter( btn, opts );
						}
					};
					depSlipMenuRef.add( moreItem );
				}
			},

			handleDepositSlipFilter : function( btn, opts )
			{
				var me = this;
				me.toggleSavePrefrenceAction( true );
				me.toggleClearPrefrenceAction( true );
				depSlipNmbr = btn.btnValue;
				var depSlipBtnRef = me.getDepSlipBtnRef();
				depSlipBtnRef.setText( '<span class="button_underline thePoniter ux_font-size14-normal">' + depSlipNmbr + '</span>' );
				me.setDataForFilter();
				if( depSlipNmbr === 'All' )
				{
					me.filterApplied = 'ALL';
					me.applyFilter();
				}
				else
				{
					me.applyQuickFilter();
				}
			},

			setGridInfoSummary : function( grid )
			{
				var me = this;

				var instrumentInqGridRef = me.getInstrumentInqGrid();
				var instrumentGridInfoRef = me.getInstrumentInquiryInformation();

				var totalChecksSummaryCountId = instrumentGridInfoRef
					.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="totalChecksCountItemId"]' );
				var totalChecksSummaryTotalId = instrumentGridInfoRef
					.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="totalChecksTotalItemId"]' );
				var paidChecksSummaryCountId = instrumentGridInfoRef
					.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="paidChecksCountItemId"]' );
				var paidChecksSummaryTotalId = instrumentGridInfoRef
					.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="paidChecksTotalItemId"]' );
				var unPaidChecksSummaryCountId = instrumentGridInfoRef
					.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="unPaidChecksCountItemId"]' );
				var unPaidChecksSummaryTotalId = instrumentGridInfoRef
					.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="unPaidChecksTotalItemId"]' );

				var dataStore = instrumentInqGridRef.store;
				dataStore.on( 'load', function( store, records )
				{
					var i = records.length - 1;
					if( i >= 0 )
					{
						totalChecksSummaryCountId.setText(  records[ i ].get( 'totalChecksSummaryCountInfo' ) );
						totalChecksSummaryCountId.setText(  records[ i ].get( 'totalChecksSummaryCountInfo' ) );
						totalChecksSummaryTotalId.setText( records[ i ].get( 'totalChecksSummaryTotalInfo' ) );
//						paidChecksSummaryCountId.setText( '(' + records[ i ].get( 'paidChecksSummaryCountInfo' ) + ')');
//						paidChecksSummaryTotalId.setText( records[ i ].get( 'paidChecksSummaryTotalInfo' ) );
//						unPaidChecksSummaryCountId.setText( '(' + records[ i ].get( 'unPaidChecksSummaryCountInfo' ) + ')' );
//						unPaidChecksSummaryTotalId.setText( records[ i ].get( 'unPaidChecksSummaryTotalInfo' ) );
					}
					else
					{
						totalChecksSummaryCountId.setText( "" );
						totalChecksSummaryTotalId.setText( "" );
//						paidChecksSummaryCountId.setText( "" );
//						paidChecksSummaryTotalId.setText( "" );
//						unPaidChecksSummaryCountId.setText( "" );
//						unPaidChecksSummaryTotalId.setText( "" );
					}
				} );
			},

			generateInformationUrl : function()
			{
				var me = this;
				var strUrl = 'instrumentInquiryInfo.srvc';
				var dtParams = me.getDateParam( me.dateFilterVal );
				var operator = dtParams.operator;
				var fieldValue1 = dtParams.fieldValue1;
				var fieldValue2 = dtParams.fieldValue2;

				if( !Ext.isEmpty( me.dateFilterVal ) )
				{
					if( Ext.isEmpty( dtParams.fieldValue1 ) )
					{
						fieldValue1 = me.dateFilterFromVal;
						fieldValue2 = me.dateFilterToVal;
					}
					if( !Ext.isEmpty( fieldValue1 ) || !Ext.isEmpty( fieldValue2 ) )
					{
						if( "eq" === dtParams.operator )
						{
							strUrl = strUrl + '?&$filter=' + 'instrumentDate' + ' ' + operator + ' ' + 'date\''
								+ fieldValue1 + '\'';
						}
						else
						{
							strUrl = strUrl + '?&$filter=' + 'instrumentDate' + ' ' + operator + ' ' + 'date\''
								+ fieldValue1 + '\'' + ' and ' + 'date\'' + fieldValue2 + '\'';
						}
					}
				}
				return strUrl;
			},

			// This function will called only once
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
						var strUrl = 'userfilters/instrumentInqFilter/{0}.srvc';
						strUrl = Ext.String.format( strUrl, data.advFilterCode );
						Ext.Ajax.request(
						{
							url : strUrl,
							headers: objHdrCsrfParams,
							async : false,
							method : 'GET',
							/*params :
							{
								csrfTokenName : tokenValue
							},*/
							success : function( response )
							{
								var responseData;
								if( response )
								{
									if( response.responseText != "" )
									{
										responseData = Ext.decode( response.responseText );
									}
									else
									{
										return;
									}
								}
								var applyAdvFilter = false;
								me.populateSavedFilter( data.advFilterCode, responseData, applyAdvFilter );
								var objOfCreateNewFilter = me.getCreateNewFilter();
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

				if( !Ext.isEmpty( objGridViewFilter ) )
				{
					var data = Ext.decode( objGridViewFilter );

					var strDtValue = data.quickFilter.requestDate;
					var strDtFrmValue = data.quickFilter.instrumentDateFrom;
					var strDtToValue = data.quickFilter.instrumentDateTo;
					var instrumentStatus = data.quickFilter.instrumentStatus;

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
					me.typeFilterVal = !Ext.isEmpty( instrumentStatus ) ? instrumentStatus : 'all';
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
						paramName : 'instrumentStatus',
						paramValue1 : me.typeFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}

				me.filterData = arrJsn;
			},

			getAllSavedAdvFilterCode : function( panel )
			{
				var me = this;
				Ext.Ajax.request(
				{
					url : 'userfilterslist/instrumentInqFilter.srvc' ,
					headers: objHdrCsrfParams,
					method : 'GET',
					/*params :
					{
						csrfTokenName : tokenValue
					},*/
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
						text : '<span class="button_underline">' + getLabel( 'moreText', 'more' )  + '&nbsp;>>' + '</span>',
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
				// Ext.create('GCP.view.PmtAdvancedFilterPopup', {
				// }).show();
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
					me.objAdvFilterPopup = Ext.create( 'GCP.view.InstrumentInqAdvancedFilterPopup' );
					var objTabPanel = me.getAdvanceFilterTabPanel();
					objTabPanel.setActiveTab( 0 );
					me.objAdvFilterPopup.show();
					var filterDetailsTab = me.getFilterDetailsTab();
					filterDetailsTab.setTitle( getLabel( 'filterDetails', 'Filter Details' ) );
				}
			},

			/*handleAdvFltLoadGridData : function(grid, isLoading) {
				var me = grid;
				var blnLoad = true;
				if (!Ext.isEmpty(isLoading))
					blnLoad = false;
				me.setLoading(blnLoad);
				Ext.Ajax.request({
							url : 'static/scripts/payments/paymentSummary/data/filterlst.json',
							method : 'GET',
							success : function(response) {
								var decodedJson = Ext.decode(response.responseText);
								me.store.loadRawData(decodedJson);
								me.setLoading(false);
							},
							failure : function() {
								me.setLoading(false);
								Ext.MessageBox.show({
											title : getLabel('errorPopUpTitle', 'Error'),
											msg : getLabel('errorPopUpMsg',
													'Error while fetching data..!'),
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.ERROR
										});
							}
						});
			},*/

			setDataForFilter : function()
			{
				var me = this;
				me.getSearchTxnTextInput().setValue( '' );
				if( this.filterApplied === 'Q' )
				{
					this.filterData = this.getQuickFilterQueryJson();
				}
				else if( this.filterApplied === 'A' )
				{
					var objOfCreateNewFilter = this.getCreateNewFilter();
					var objJson = objOfCreateNewFilter.getAdvancedFilterQueryJson( objOfCreateNewFilter );
					// this.filterData = objJson;
					this.advFilterData = objJson;
					var filterCode = objOfCreateNewFilter.down( 'textfield[itemId="filterCode"]' ).getValue();
					this.advFilterCodeApplied = filterCode;
				}
				if( this.filterApplied === 'ALL' )
				{
					this.filterData = this.getQuickFilterQueryJson();
				}
			},
			getQuickFilterQueryJson : function()
			{
				var me = this;
				var typeFilterVal = me.typeFilterVal;
				var jsonArray = [];
				var index = me.dateFilterVal;
				var objDateParams = me.getDateParam( index );
				if( index != '12' )
				{
					jsonArray.push(
					{
						paramName : me.getInstrumentDateRef().filterParamName,
						paramValue1 : objDateParams.fieldValue1,
						paramValue2 : objDateParams.fieldValue2,
						operatorValue : objDateParams.operator,
						dataType : 'D'
					} );
				}
				if( typeFilterVal != null && typeFilterVal != 'all' )
				{
					jsonArray.push(
					{
						paramName : me.getInstrumentInqStatusToolBar().filterParamName,
						paramValue1 : typeFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				if( depSlipNmbr != null && depSlipNmbr != "" && depSlipNmbr != "All" )
				{
					jsonArray.push(
					{
						paramName : 'depSlipNmbr',
						paramValue1 : depSlipNmbr,
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				return jsonArray;
			},

			setUserFilterData : function()
			{
				var me = this;
				var jsonArray = [];
				if( depSlipNmbr != null && depSlipNmbr != "" && depSlipNmbr != "All" )
				{
					jsonArray.push(
					{
						paramName : 'depSlipNmbr',
						paramValue1 : depSlipNmbr,
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				return jsonArray;
			},

			handleAccountLoading : function( panel )
			{
				var me = this;
				var strUrl = 'depositItemAccountList.srvc';
				/*var dtParams = me.getDateParam(me.dateFilterVal);
				var operator = dtParams.operator;
				var fieldValue1 = dtParams.fieldValue1;
				var fieldValue2 = dtParams.fieldValue2;

				if (!Ext.isEmpty(me.dateFilterVal)) {

					if (Ext.isEmpty(dtParams.fieldValue1)) {
						fieldValue1 = me.dateFilterFromVal;
						fieldValue2 = me.dateFilterToVal;
					}

					if(!Ext.isEmpty(fieldValue1) || !Ext.isEmpty(fieldValue2))
					{
						if ("eq" === dtParams.operator) {
							strUrl = strUrl + '?&$filter=' + 'instrumentDate' + ' ' + operator
									+ ' ' + 'date\'' + fieldValue1 + '\'';
						} else {
							strUrl = strUrl + '?&$filter=' + 'instrumentDate' + ' ' + operator
									+ ' ' + 'date\'' + fieldValue1 + '\'' + ' and '
									+ 'date\'' + fieldValue2 + '\'';
						}
					}
				}*/

				/*
				Ext.Ajax.request(
				{
					url : strUrl + '?' + csrfTokenName + '=' + csrfTokenValue,
					method : "POST",
					success : function( response )
					{
						me.loadInstrumentAccounts( Ext.decode( response.responseText ) );
					},
					failure : function( response )
					{
						console.log( 'Error Occured' );
					}
				} );
				*/
			},

			/*loadInstrumentAccounts : function( data )
			{
				var me = this;
				var objTbar = me.getInstrumentAccToolBar();
				var arrItem;
				me.getInstrumentAccoutLabel().setText( getLabel( 'lblinstrumentacc', 'Instrument Account' ) );
				if( !Ext.isEmpty( objTbar ) )
				{
					var tbarItems = objTbar.items;

					// remove the items
					if( !Ext.isEmpty( tbarItems ) )
					{
						if( tbarItems.length > 0 )
							tbarItems.each( function( item, index, length )
							{
								if( index > 0 )
									objTbar.remove( item );
							} );
					}

					if( data.d.txnlist )
					{
						var instrumentAccList = data.d.txnlist;

						if( instrumentAccList.length > 0 )
						{
							arrItem = new Array();
							for( var i = 0 ; i < instrumentAccList.length ; i++ )
							{
								arrItem.push(
								{
									text : instrumentAccList[ i ].instrumentAccount,
									btnId : instrumentAccList[ i ].instrumentAccount,
									code : instrumentAccList[ i ].instrumentAccount,
									btnDesc : instrumentAccList[ i ].instrumentAccount,
									handler : function( btn, opts )
									{
										me.handleInstrumentAccount( btn );
									}
								} );
							}
							var item = Ext.create( 'Ext.Button',
							{
								cls : 'xn-custom-arrow-button cursor_pointer w1',
								padding : '0 0 3 0',
								menu : Ext.create( 'Ext.menu.Menu',
								{
									items : arrItem
								} )
							} );
							objTbar.insert( 5, item );
						}
					}
				}
			},*/

			handleInstrumentAccount : function( btn )
			{
				/*
				var me = this;
				me.toggleSavePrefrenceAction( true );
				me.loadInstrumentInqAccount( btn.code );
				me.typeFilterVal = btn.code;
				me.typeFilterDesc = btn.btnDesc;
				me.setDataForFilter();
				me.applyQuickFilter();
				me.onInstrumentInquiryInformationViewRender();
				*/
			},

			/*loadInstrumentInqAccount : function( accountNo )
			{
				var me = this;
				var objTbar = me.getInstrumentInqAccToolBar();
				var arrItem;

				if( !Ext.isEmpty( objTbar ) )
				{
					var tbarItems = objTbar.items;

					// remove the items
					if( !Ext.isEmpty( tbarItems ) )
					{
						if( tbarItems.length > 0 )
							tbarItems.each( function( item, index, length )
							{
								if( index > 0 )
									objTbar.remove( item );
							} );
					}

					if( accountNo )
					{
						var strCls = '';
						if( me.typeFilterVal !== 'all' && me.typeFilterVal === accountNo )
						{
							if( objTbar.down( 'button[btnId="allInstrumentAccType"]' ) )
								objTbar.down( 'button[btnId="allInstrumentAccType"]' ).removeCls( 'xn-custom-heighlight' )

							strCls = 'xn-custom-heighlight';
						}
						else
						{
							if( objTbar.down( 'button[btnId="allInstrumentAccType"]' ) )
								objTbar.down( 'button[btnId="allInstrumentAccType"]' ).addCls( 'xn-account-filter-btnmenu' )

							strCls = 'xn-account-filter-btnmenu';
						}
						objTbar.add(
						{
							text : Ext.util.Format.ellipsis( accountNo, 16 ),
							btnId : accountNo,
							code : accountNo,
							btnDesc : accountNo,
							tooltip : accountNo,
							cls : strCls,
							handler : function( btn, opts )
							{
								me.handleType( btn );
							}
						} );

					}
				}
			},*/

			renderTypeFilter : function()
			{
				var me = this;
				
				if( !Ext.isEmpty(me.typeFilterVal) &&  me.typeFilterVal != 'all')
				{
					me.getInstrumentInqStatusToolBar().items.each( function( item )
					{
						item.removeCls( 'xn-custom-heighlight' );
						item.addCls( 'xn-account-filter-btnmenu' );
						
						if( item.btnValue == me.typeFilterVal)
						{
							item.addCls( 'xn-custom-heighlight xn-account-filter-btnmenu' );
						}
					} );
					me.setDataForFilter();
					
					if( me.typeFilterVal === 'all' )
					{
						me.filterApplied = 'ALL';
						me.applyFilter();
					}
					else
					{
						me.applyQuickFilter();
					}
				}
			},
			handleType : function( btn )
			{
				var me = this;
				me.toggleSavePrefrenceAction( true );
				me.toggleClearPrefrenceAction( true );
				me.getInstrumentInqStatusToolBar().items.each( function( item )
				{
					item.removeCls( 'xn-custom-heighlight' );
					item.addCls( 'xn-account-filter-btnmenu' );
				} );
				btn.addCls( 'xn-custom-heighlight xn-account-filter-btnmenu' );

				me.typeFilterVal = btn.btnValue;
				me.typeFilterDesc = btn.btnDesc;

				me.setDataForFilter();

				if( me.typeFilterVal === 'all' )
				{
					me.filterApplied = 'ALL';
					me.applyFilter();
				}
				else
				{
					me.applyQuickFilter();
				}
			},
			applyFilter : function()
			{
				var me = this;
				var grid = me.getInstrumentInqGrid();
				if( !Ext.isEmpty( grid ) && me.isGridDataLoad )
				{
					var strDataUrl = grid.store.dataUrl;
					var store = grid.store;
					var strUrl = grid.generateUrl( strDataUrl, grid.pageSize, 1, 1, store.sorters );
					strUrl = strUrl + me.getFilterUrl() + '&' + csrfTokenName + '=' + csrfTokenValue;
					me.getInstrumentInqGrid().setLoading( true );
					grid.loadGridData( strUrl, me.handleAfterGridDataLoad, null );
				}
			},

			applyQuickFilter : function()
			{
				var me = this;
				var grid = me.getInstrumentInqGrid();
				me.filterApplied = 'Q';
				// TODO : Currently both filters are in sync
				if( !Ext.isEmpty( grid ) && me.isGridDataLoad )
				{
					var strDataUrl = grid.store.dataUrl;
					var store = grid.store;
					var strUrl = grid.generateUrl( strDataUrl, grid.pageSize, 1, 1, store.sorters );
					strUrl = strUrl + me.getFilterUrl() + '&' + csrfTokenName + '=' + csrfTokenValue;
					me.getInstrumentInqGrid().setLoading( true );
					grid.loadGridData( strUrl, me.handleAfterGridDataLoad, null );
				}
			},

			getFilterUrl : function()
			{
				var me = this;
				var strQuickFilterUrl = '', strActionStatusUrl = '', strAdvancedFilterUrl = '', strUrl = '', isFilterApplied = false;

				//		strActionStatusUrl = me.generateActionStatusUrl(widget);

				if( me.filterApplied === 'ALL' )
				{
					strQuickFilterUrl = me.generateUrlWithQuickFilterParams( me );
					if( !Ext.isEmpty( strQuickFilterUrl ) )
					{
						strUrl += '&$filter=' + strQuickFilterUrl;
						isFilterApplied = true;
					}
					/*if (!Ext.isEmpty(strActionStatusUrl)) {
						if (isFilterApplied)
							strUrl += ' and ' + strActionStatusUrl;
						else
							strUrl += '&$filter=' + strActionStatusUrl;
					}*/
				}
				else
				{
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
					/*if (!Ext.isEmpty(strActionStatusUrl)) {
						if (isFilterApplied)
							strUrl += ' and ' + strActionStatusUrl;
						else
							strUrl += '&$filter=' + strActionStatusUrl;
					}*/
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
				// var strFilter = '&$filter=';
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
				if( !Ext.isEmpty( objFilterName ) )
				{
					var strUrl = 'userfilters/instrumentInqFilter/{0}/remove.srvc?' + csrfTokenName + '='
						+ csrfTokenValue;
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
					url : 'userpreferences/instrumentInqList/instrumentInqAdvanceFilter.srvc',
					headers: objHdrCsrfParams,
					method : 'GET',
					/*params :
					{
						csrfTokenName : tokenValue
					},*/
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
			closeFilterPopup : function( btn )
			{
				var me = this;
				me.getAdvanceFilterPopup().close();
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
				var strUrl = 'userfilters/instrumentInqFilter/{0}.srvc';
				strUrl = Ext.String.format( strUrl, filterCode );
				Ext.Ajax.request(
				{
					url : strUrl ,
					headers: objHdrCsrfParams,
					method : 'GET',
					/*params :
					{
						csrfTokenName : tokenValue
					},*/
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
				var objCreateNewFilterPanel = me.getCreateNewFilter();
				for( i = 0 ; i < filterData.filterBy.length ; i++ )
				{
					var fieldName = filterData.filterBy[ i ].field;

					var fieldVal = filterData.filterBy[ i ].value1;

					var fieldOper = filterData.filterBy[ i ].operator;

					if( fieldOper != 'eq' )
					{
						objCreateNewFilterPanel.down( 'combobox[itemId="rangeCombo"]' ).setValue( fieldOper );
					}
					if( fieldName === 'instrumentNmbr' || fieldName === 'depositAccount' || fieldName === 'debitAccount' || fieldName === 'rtn' 
						|| fieldName === 'instrumentStatus')
					{
						var fieldType = 'textfield';
					}
					else if( fieldName === 'instrumentAmount' )
					{
						var fieldType = 'numberfield';
					}
					else if( fieldName === 'depositDate' )
					{
						var fieldType = 'datefield';
					}

					var fieldObj = objCreateNewFilterPanel.down( '' + fieldType + '[itemId="' + fieldName + '"]' );

					fieldObj.setValue( fieldVal );

				}
				objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).setValue( filterCode );

				objCreateNewFilterPanel.down( 'textfield[itemId="instrumentNmbr"]' ).setReadOnly( true );
				objCreateNewFilterPanel.down( 'textfield[itemId="depositAccount"]' ).setReadOnly( true );
				objCreateNewFilterPanel.down( 'numberfield[itemId="instrumentAmount"]' ).setReadOnly( true );
				objCreateNewFilterPanel.down( 'textfield[itemId="depositAccount"]' ).setDisabled( true );
				objCreateNewFilterPanel.down( 'datefield[itemId="depositDate"]' ).setDisabled( true );
				objCreateNewFilterPanel.down( 'combobox[itemId="rangeCombo"]' ).setDisabled( true );
				objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).setReadOnly( true );
				objCreateNewFilterPanel.down( 'textfield[itemId="instrumentStatus"]' ).setReadOnly( true );
				objCreateNewFilterPanel.down( 'textfield[itemId="instrumentStatus"]' ).setDisabled( true );
				objCreateNewFilterPanel.down( 'textfield[itemId="debitAccount"]' ).setReadOnly( true );
				objCreateNewFilterPanel.down( 'textfield[itemId="debitAccount"]' ).setDisabled( true );
				objCreateNewFilterPanel.down( 'textfield[itemId="rtn"]' ).setReadOnly( true );
				objCreateNewFilterPanel.down( 'textfield[itemId="rtn"]' ).setDisabled( true );
				

			},
			handleSearchAction : function( btn )
			{
				var me = this;
				me.doSearchOnly();
			},
			postDoSaveAndSearch : function()
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
				me.closeFilterPopup();
				me.onInstrumentInquiryInformationViewRender();
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
				}
			},
			postSaveFilterRequest : function( FilterCodeVal, fncallBack )
			{
				var me = this;
				var strUrl = 'userfilters/instrumentInqFilter/{0}.srvc';
				strUrl = Ext.String.format( strUrl, FilterCodeVal );
				var objJson;
				var objOfCreateNewFilter = me.getCreateNewFilter();
				objJson = objOfCreateNewFilter.getAdvancedFilterValueJson( FilterCodeVal, objOfCreateNewFilter );
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
							title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
							msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						} );
					}
				} );

			},
			reloadGridRawData : function()
			{
				var me = this;
				var strUrl = 'userfilterslist/instrumentInqFilter.srvc?';
				var gridView = me.getAdvFilterGridView();
				Ext.Ajax.request(
				{
					url : strUrl ,
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
						gridView.store.loadRawData( arrJson );
						me.addAllSavedFilterCodeToView( decodedJson.d.filters );
					},
					failure : function( response )
					{
						// console.log("Ajax Get data Call Failed");
					}
				} );
			},
			handleRangeFieldsShowHide : function( objShow )
			{
				var me = this;

				var objCreateNewFilterPanel = me.getCreateNewFilter();
				var toobj = objCreateNewFilterPanel.down( 'numberfield[itemId="toAmt"]' );
				var tolabelObj = objCreateNewFilterPanel.down( 'label[itemId="Tolabel"]' );
				if( toobj && tolabelObj )
				{
					if( objShow )
					{
						toobj.show();
						tolabelObj.show();
					}
					else
					{
						toobj.hide();
						tolabelObj.hide();
					}
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
					me.objAdvFilterPopup.show();
					var objTabPanel = me.getAdvanceFilterTabPanel();
					objTabPanel.setActiveTab( 1 );
				}
				else
				{
					me.objAdvFilterPopup = Ext.create( 'GCP.view.PmtAdvancedFilterPopup' );
					var objTabPanel = me.getAdvanceFilterTabPanel();
					objTabPanel.setActiveTab( 1 );
					me.objAdvFilterPopup.show();

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
				me.toggleClearPrefrenceAction( true );
			},
			populateSavedFilter : function( filterCode, filterData, applyAdvFilter )
			{
				var me = this;

				var objCreateNewFilterPanel = me.getCreateNewFilter();
				objCreateNewFilterPanel.resetAllFields( objCreateNewFilterPanel );

				for( i = 0 ; i < filterData.filterBy.length ; i++ )
				{
					var fieldName = filterData.filterBy[ i ].field;

					var fieldOper = filterData.filterBy[ i ].operator;

					if( fieldOper != 'eq' )
					{
						objCreateNewFilterPanel.down( 'combobox[itemId="rangeCombo"]' ).setValue( fieldOper );
					}

					var fieldVal = filterData.filterBy[ i ].value1;

					if( fieldName === 'instrumentNmbr' || fieldName === 'depositAccount' || fieldName === 'debitAccount' || fieldName === 'rtn' 
						|| fieldName === 'instrumentStatus' )
					{
						var fieldType = 'textfield';
					}
					else if( fieldName === 'instrumentAmount' )
					{
						var fieldType = 'numberfield';
					}
					else if( fieldName === 'depositDate' )
					{
						var fieldType = 'datefield';
					}

					var fieldObj = objCreateNewFilterPanel.down( '' + fieldType + '[itemId="' + fieldName + '"]' );

					fieldObj.setValue( fieldVal );

				}
				if( applyAdvFilter )
					me.applyAdvancedFilter();
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
				var grid = me.getInstrumentInqGrid();
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
				var advFilterCode = null;
				var objFilterPref = {};
				if( !Ext.isEmpty( me.savePrefAdvFilterCode ) )
				{
					advFilterCode = me.savePrefAdvFilterCode;
				}
				var objQuickFilterPref = {};
				objQuickFilterPref.instrumentStatus = me.typeFilterVal;
				objQuickFilterPref.requestDate = me.dateFilterVal;
				if( me.dateFilterVal === '7' )
				{

					if( !Ext.isEmpty( me.dateFilterFromVal ) && !Ext.isEmpty( me.dateFilterToVal ) )
					{

						objQuickFilterPref.instrumentDateFrom = me.dateFilterFromVal;
						objQuickFilterPref.instrumentDateTo = me.dateFilterToVal;
					}
					else
					{
						var strSqlDateFormat = 'Y-m-d';
						var frmDate = me.getFromInstrumentDate().getValue();
						var toDate = me.getToInstrumentDate().getValue();
						fieldValue1 = Ext.util.Format.date( frmDate, 'Y-m-d' );
						fieldValue2 = Ext.util.Format.date( toDate, 'Y-m-d' );
						objQuickFilterPref.instrumentDateFrom = fieldValue1;
						objQuickFilterPref.instrumentDateTo = fieldValue2;
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
				var grid = me.getInstrumentInqGrid();
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

				objCreateViewInfoPanel.down( 'textfield[itemId="instrumentNmbr"]' ).setValue(
					record.get( 'instrumentNmbr' ) );
				objCreateViewInfoPanel.down( 'textfield[itemId="instrumentAmount"]' ).setValue(
					record.get( 'instrumentAmount' ) );
				objCreateViewInfoPanel.down( 'textfield[itemId="instrumentDate"]' ).setValue(
					record.get( 'instrumentDate' ) );
				objCreateViewInfoPanel.down( 'textfield[itemId="depSlipNmbr"]' ).setValue( record.get( 'depSlipNmbr' ) );
				objCreateViewInfoPanel.down( 'textfield[itemId="depositDate"]' ).setValue( record.get( 'depositDate' ) );
				objCreateViewInfoPanel.down( 'textfield[itemId="depositAccount"]' ).setValue(
					record.get( 'depositAccount' ) );
				
				objCreateViewInfoPanel.down( 'textfield[itemId="instrumentStatus"]' ).setValue( record.get( 'instrumentStatus' ) );
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

				objCreateViewInfoPanel.down( 'textfield[itemId="instrumentNmbr"]' ).setReadOnly( boolVal );
				objCreateViewInfoPanel.down( 'textfield[itemId="instrumentAmount"]' ).setReadOnly( boolVal );
				objCreateViewInfoPanel.down( 'textfield[itemId="instrumentDate"]' ).setReadOnly( boolVal );
				objCreateViewInfoPanel.down( 'textfield[itemId="depSlipNmbr"]' ).setReadOnly( boolVal );
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
			handleReportAction : function( btn, opts )
			{
				var me = this;
				me.downloadReport( btn.itemId );
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
				strUrl = 'services/getInstrumentEnquiryList/getInstrumentEnquiryDynamicReport.' + strExtension;
				strUrl += '?$skip=1';
				var strQuickFilterUrl = me.generateUrlWithQuickFilterParams( this );
				strUrl += strQuickFilterUrl;
				strUrl += me.getFilterUrl();
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
				var grid = me.getInstrumentInqGrid();
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
			}
		} );
function getPopulateInstrumentImage( imageNmbr )
{
	GCP.getApplication().fireEvent( 'callPopulateInstrumentImage', imageNmbr );
}
function callToDepositPage( depSlipNmbr )
{
	GCP.getApplication().fireEvent( 'callDepositPage', depSlipNmbr );
}
