Ext
	.define( 'GCP.controller.CBCreditGrossAppliedAccBankIntController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'Ext.ux.gcp.DateHandler','GCP.view.CBCreditGrossAppliedAccBankIntGridView'
			],
			views :
			[
				'GCP.view.CBCreditGrossDateWiseView'
			],
			refs :
			[
				{
					ref : 'appliedAccountLevelBankInterestSummaryGridViewRef',
					selector : 'cbCreditGrossDateWiseViewType cbCreditGrossAppliedAccBankIntGridViewType grid[itemId="appliedAccBankIntGridViewMstItemId"]'
				},
				{
					ref : 'appliedAccountLevelBankInterestSummaryGridViewItemRef',
					selector : 'cbCreditGrossDateWiseViewType cbCreditGrossAppliedAccBankIntGridViewType panel[itemId="appliedAccountLevelBankInterestItemId"]'
				}
			],
			config :
			{

			},
			init : function()
			{
				var me = this;
				
				me.control(
					{
						'cbCreditGrossAppliedAccBankIntGridViewType' :
						{
							render : function( panel )
							{
								me.handleSmartGridConfig();
							}
						},
						'cbCreditGrossAppliedAccBankIntGridViewType smartgrid' :
						{
							render : function( grid )
							{
								me.handleLoadGridData( grid, grid.store.dataUrl, grid.pageSize, 1, 1, null );
							},
							gridPageChange : me.handleLoadGridData,
							gridSortChange : me.handleLoadGridData,
							gridRowSelectionChange : function( grid, record, recordIndex, records, jsonData )
							{
							}
						}
					} );
			},
			
			handleLoadGridData : function( grid, url, pgSize, newPgNo, oldPgNo, sorter )
			{
				var me = this;
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );

				strUrl = strUrl + "&$viewState=" + viewState + "&$selectedDate=" + selectedDate ;
				strUrl = strUrl + "&$isAccrualSettlement=" + isAccrualSettlement;
				strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;

				grid.loadGridData( strUrl, null );
			},
			handleSmartGridConfig : function()
			{
				var me = this;
				var bankInterestSummaryGrid = me.getAppliedAccountLevelBankInterestSummaryGridViewRef()
				var objConfigMap = me.getBankInterestSummaryGridConfig();

				if( !Ext.isEmpty( bankInterestSummaryGrid ) )
					bankInterestSummaryGrid.destroy( true );

				var arrColsPref = null;
				var data = null;

				if( !Ext.isEmpty( objGridViewPref ) )
				{
					data = Ext.decode( objGridViewPref );
					objPref = data[ 0 ];
					arrColsPref = objPref.gridCols;
					arrCols = me.getColumns( arrColsPref, objConfigMap );
				}
				else if( objDefaultGridViewPref )
				{
					data = objDefaultGridViewPref;
					objPref = data[ 0 ];
					arrColsPref = objPref.gridCols;
					arrCols = me.getColumns( arrColsPref, objConfigMap );
				}
				else
				{
					arrCols = me.getColumns( objConfigMap.arrColsPref, objConfigMap.objWidthMap );
				}
				me.handleSmartGridLoading( arrCols, objConfigMap.storeModel );
			},
			
			getBankInterestSummaryGridConfig : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;

				objWidthMap =
				{
					"ACCOUNT" : 181,
					"BALANCE" : 181,
					"APPLIED_RATE" : 181,
					"APPLIED_INTEREST" : 181,
					"APPORT_APPLICABLE" : 181
				};

				arrColsPref =
				[
					{
						"colId" : "ACCOUNT",
						"colDesc" : getLabel( 'summaryAccount', 'Account' )
					},
					{
						"colId" : "BALANCE",
						"colDesc" : getLabel( 'summaryBalance', 'Balance' ),
						"colType" : "number"
					},
					{
						"colId" : "APPLIED_RATE",
						"colDesc" : getLabel( 'summaryAppliedRate', 'Applied Rate' ),
						"colType" : "number"
					},
					{
						"colId" : "APPLIED_INTEREST",
						"colDesc" : getLabel( 'summaryAppliedInterest', 'Applied Interest' ),
						"colType" : "number"
					},
					{
						"colId" : "APPORT_APPLICABLE",
						"colDesc" : getLabel( 'summaryApportApplicable', 'Apportionment Applicable' )
					}
				];

				storeModel =
				{
					fields :
					[
						'ACCOUNT', 'BALANCE', 'APPLIED_RATE','APPLIED_INTEREST','APPORT_APPLICABLE','DR_INT_PROF_RECKEY', 'DATE'
					],
					proxyUrl : 'getCBCreditGrossDteWiseApplActBankInt.srvc',
					rootNode : 'd.commonDataTable'
				};

				objConfigMap =
				{
					"objWidthMap" : objWidthMap,
					"arrColsPref" : arrColsPref,
					"storeModel" : storeModel
				};
				return objConfigMap;
			},		
			columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
			{
				var strRetValue = value;
				if( !Ext.isEmpty( value ) && value != '' )
				{
					if (colId == 'col_APPLIED_RATE' &&  "0.0000" != value && '0' == entityType)
					{
						if(record.get( 'DR_INT_PROF_RECKEY' ) != 'null' )
						{
							strRetValue = '<a href="#" onclick="javascript:showInterestProfile(' + "'" + record.get( 'DR_INT_PROF_RECKEY' ) + "', '" + record.get( 'DATE' ) + "', '" + csrfTokenName + "', '" + csrfTokenValue + "'" + ');"><u>' + value + '%</u></a>';
						}
					}
				}
				return strRetValue;
			},
			getColumns : function( arrColsPref, objWidthMap )
			{
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;

				if( !Ext.isEmpty( arrColsPref ) )
				{
					
					if(arrColsPref.length > 0) {
						arrColsPref.splice(0, 0, {
							colType : 'emptyColumn',
							colId : 'emptyCol',
							colDesc : '',
							locked : true,
							resizable : false,
							draggable : false,
							width : 0.1,
							minWidth : 0.1
						});
					}
					
					for( var i = 0 ; i < arrColsPref.length ; i++ )
					{
						objCol = arrColsPref[ i ];
						cfgCol = {};
						cfgCol.colHeader = objCol.colDesc;
						cfgCol.colId = objCol.colId;
						cfgCol.hidden = objCol.colHidden;
						cfgCol.sortable = false;
						cfgCol.locked = Ext.isEmpty(objCol.locked) ? false : objCol.locked;
						cfgCol.resizable = Ext.isEmpty(objCol.resizable) ? true : objCol.resizable;
						cfgCol.draggable = Ext.isEmpty(objCol.draggable) ? true : objCol.draggable;
						if( !Ext.isEmpty( objCol.colType ) )
						{
							cfgCol.colType = objCol.colType;
							if( cfgCol.colType === "number" )
								cfgCol.align = 'right';
						}

						cfgCol.width = !Ext.isEmpty( objWidthMap[ objCol.colId ] ) ? objWidthMap[ objCol.colId ] : Ext.isEmpty(objCol.width) ? 120 : objCol.width;
						if(!Ext.isEmpty(objCol.minWidth)) {
							cfgCol.minWidth = objCol.minWidth;
						}
						cfgCol.fnColumnRenderer = me.columnRenderer;
						arrCols.push( cfgCol );
					}
				}
				return arrCols;
			},

			handleSmartGridLoading : function( arrCols, storeModel )
			{
				var me = this;
				var pgSize = null;
				var alertSummaryGrid = null;
				pgSize = 100;
				appliedbankInterestSummaryGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'appliedAccBankIntGridViewMstItemId',
					itemId : 'appliedAccBankIntGridViewMstItemId',
					pageSize : pgSize,
					autoDestroy : true,
					stateful : false,
					showEmptyRow : false,
					cls : 't7-grid',
					hideRowNumbererColumn : true,
					enableColumnHeaderMenu : false,
					showSummaryRow : false,
					showPager : false,
					showCheckBoxColumn : false,
					autoExpandLastColumn : false,
					rowList :
					[
						10, 25, 50, 100, 200, 500
					],
					minHeight : 10,
					maxHeight : 280,
					enableColumnAutoWidth : _blnGridAutoColumnWidth,
					//margin : '21 0 0 0',
					columnModel : arrCols,
					storeModel : storeModel
				} );
				var bankInterestSummaryView = me.getAppliedAccountLevelBankInterestSummaryGridViewItemRef();
				bankInterestSummaryView.add( appliedbankInterestSummaryGrid );
				bankInterestSummaryView.doLayout();
			}
		});
