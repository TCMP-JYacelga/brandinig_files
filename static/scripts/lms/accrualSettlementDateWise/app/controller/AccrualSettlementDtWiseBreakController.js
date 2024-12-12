Ext
	.define(
		'GCP.controller.AccrualSettlementDtWiseBreakController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'Ext.ux.gcp.DateHandler', 'GCP.view.AccrualSettlementDtWiseBreakGridView'
			],
			views :
			[
				'GCP.view.AccrualSettlementDetailView'
			],
			refs :
			[
				{
					ref : 'accrualSettlementBreakupRef',
					selector : 'accrualSettlementDetailViewType accrualSettlementDtWiseBreakGridViewType grid[itemId="accrualSettlementBreakupItemId"]'
				},
				{
					ref : 'dateWiseBreakupItemIdRef',
					selector : 'accrualSettlementDetailViewType accrualSettlementDtWiseBreakGridViewType panel[itemId="dateWiseBreakupItemId"]'
				}
			],
			config :
			{
				dateHandler : null
			},
			init : function()
			{
				var me = this;
				this.dateHandler = Ext.create( 'Ext.ux.gcp.DateHandler' );

				GCP.getApplication().on(
				{
					callDateWisePage : function( selectedDate )
					{
						me.goToDateWisePage( selectedDate );
					}
				} );

				me.control(
				{
					'accrualSettlementDtWiseBreakGridViewType' :
					{
						render : function( panel )
						{
							me.handleSmartGridConfig();
						}
					},

					'accrualSettlementDtWiseBreakGridViewType smartgrid' :
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

				strUrl = strUrl + "&$viewState=" + viewState + "&$transactionId=" + transactionId;

				strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;

				grid.loadGridData( strUrl, null );
			},
			handleSmartGridConfig : function()
			{
				var me = this;
				var accrualPoolGrid = me.getAccrualSettlementBreakupRef();
				var objConfigMap = me.getAccrualSettlementGridConfig();

				if( !Ext.isEmpty( accrualPoolGrid ) )
					accrualPoolGrid.destroy( true );

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
			getObjWidthMap : function()
			{
				var objWidthMap = null;

				if( structureType == 'CP' )
				{
					objWidthMap =
					{
						"BREAKUP_DATE" : 160,
						"POOL_BALANCE" : 170,
						"CURRENCY" : 160,
						"APPLIED_RATE" : 180,
						"INTEREST_AMOUNT" : 180,
						"BENEFIT_AMOUNT" : 180,
						"BENEFIT_ALLOC_RATIO" : 180
					};
				}
				else if( structureType == 'TE' )
				{
					objWidthMap =
					{
						"BREAKUP_DATE" : 160,
						"POOL_BALANCE" : 170,
						"APPLICABLE_TIER" : 150,
						"APPLICABLE_RATE" : 150,
						"APPLIED_TIER" : 160,
						"APPLIED_RATE" : 180,
						"BENEFIT_NODE_CCY" : 180,
						"BENEFIT_POOL_CCY" : 150,
						"EXCHANGE_RATE" : 150,
						"CURRENCY" : 150
					};
				}
				else if( structureType == 'CB' )
				{
					// NET
					if( structureSubType == '1' )
					{
						objWidthMap =
						{
							"BREAKUP_DATE" : 160,
							"CURRENCY" : 160,
							"POOL_BALANCE" : 170,
							"APPLIED_RATE" : 180,
							"INTEREST_AMOUNT" : 180,
							"BENEFIT_AMOUNT" : 150
						};
					}
					// GROSS
					else if( structureSubType == '2' )
					{
						objWidthMap =
						{
							"BREAKUP_DATE" : 160,
							"CURRENCY" : 160,
							"GROSS_CR_BALANCE" : 180,
							"GROSS_DR_BALANCE" : 180,
							"CR_APPLIED_RATE" : 250,
							"CR_INTEREST_AMOUNT" : 280,
							"DR_APPLIED_RATE" : 220,
							"DR_INTEREST_AMOUNT" : 250,
							"CR_BENEFIT_AMOUNT" : 150,
							"DR_BENEFIT_AMOUNT" : 150
						};
					}
					// DEBIT GROSS
					else if( structureSubType == '3' )
					{
						
						// Query type : Accrual OR Settlement  and transactionType : Interest
						if( transactionType == '01' || transactionType == '03' )
						{
							if( groupOrAccount == agreementCodeVal )
							{
								objWidthMap =
								{
									"BREAKUP_DATE" : 250,
									"CURRENCY" : 210,
									"GROSS_DR_BALANCE" : 250,
									"DR_APPLIED_RATE" : 250,
									"DR_INTEREST_AMOUNT" : 250
								};
							}
							else
							{
								objWidthMap =
								{
									"BREAKUP_DATE" : 250,
									"CURRENCY" : 210,
									"GROSS_DR_BALANCE" : 250,
									"APPLIED_RATE" : 250,
									"INTEREST_AMOUNT" : 250
								};
							}
						}
						// Query type : Settlement  and transactionType : Apportionment
						else if( transactionType == '05' )
						{
							objWidthMap =
							{
								"BREAKUP_DATE" : 250,
								"CURRENCY" : 210,
								"GROSS_DR_BALANCE" : 250,
								"DR_APPORT_RATE" : 250,
								"DR_APPORT_AMOUNT" : 250
							};
						}
					}
					// CREDIT GROSS
					else if( structureSubType == '4' )
					{
						// Query type : Accrual OR Settlement  and transactionType : Interest
						if( transactionType == '01' || transactionType == '03' )
						{
							if( groupOrAccount == agreementCodeVal )
							{
								objWidthMap =
								{
									"BREAKUP_DATE" : 250,
									"CURRENCY" : 210,
									"GROSS_CR_BALANCE" : 250,
									"CR_APPLIED_RATE" : 250,
									"CR_INTEREST_AMOUNT" : 250
								};
							}
							else
							{
								objWidthMap =
								{
									"BREAKUP_DATE" : 250,
									"CURRENCY" : 210,
									"GROSS_CR_BALANCE" : 250,
									"APPLIED_RATE" : 250,
									"INTEREST_AMOUNT" : 250
								};
							}
						}
						// Query type : Settlement  and transactionType : Apportionment
						else if( transactionType == '05' )
						{
							objWidthMap =
							{
								"BREAKUP_DATE" : 250,
								"CURRENCY" : 210,
								"GROSS_CR_BALANCE" : 250,
								"CR_APPORT_RATE" : 250,
								"CR_APPORT_AMOUNT" : 250
							};
						}
					}
				}

				return objWidthMap;
			},
			getArrColsRef : function()
			{
				var arrColsPref = null;

				if( structureType == 'CP' )
				{
					arrColsPref =
					[
						{
							"colId" : "BREAKUP_DATE",
							"colDesc" : getLabel( 'lblDate', 'Date' )
						},
						{
							"colId" : "POOL_BALANCE",
							"colDesc" : getLabel( 'lblBalance', 'Balance' ),
							"colType" : "number"
						},
						{
							"colId" : "CURRENCY",
							"colDesc" : getLabel( 'lblCurrency', 'CCY' )
						},
						{
							"colId" : "APPLIED_RATE",
							"colDesc" : getLabel( 'lblAppliedInterest', 'Applied Rate' ),
							"colType" : "number"
						},
						{
							"colId" : "INTEREST_AMOUNT",
							"colDesc" : getLabel( 'lblInterestAmount', 'Interest Amount' ),
							"colType" : "number"
						},
						{
							"colId" : "BENEFIT_AMOUNT",
							"colDesc" : getLabel( 'lblBenefitAllocated', 'Benefit Allocated' ),
							"colType" : "number"
						},
						{
							"colId" : "BENEFIT_ALLOC_RATIO",
							"colDesc" : getLabel( 'lblBenefitAllocRatio', 'Allocation Ratio' ),
							"colType" : "number"
						}
					];
				}
				else if( structureType == 'TE' )
				{
					arrColsPref =
					[
						{
							"colId" : "BREAKUP_DATE",
							"colDesc" : getLabel( 'lblDate', 'Date' )
						},
						{
							"colId" : "POOL_BALANCE",
							"colDesc" : getLabel( 'lblBalance', 'Balance' ),
							"colType" : "number"
						},
						{
							"colId" : "APPLICABLE_TIER",
							"colDesc" : getLabel( 'lblApplicableTier', 'Applicable Tier' ),
							"colType" : "number"
						},
						{
							"colId" : "APPLICABLE_RATE",
							"colDesc" : getLabel( 'lblApplicableRate', 'Applicable Rate' ),
							"colType" : "number"
						},
						{
							"colId" : "APPLIED_TIER",
							"colDesc" : getLabel( 'lblAppliedTier', 'Applied Tier' ),
							"colType" : "number"
						},
						{
							"colId" : "APPLIED_RATE",
							"colDesc" : getLabel( 'lblAppliedRate', 'Applied Rate' ),
							"colType" : "number"
						},
						{
							"colId" : "INTEREST_AMOUNT",
							"colDesc" : getLabel( 'lblInterestAmount', 'Interest Amount' ),
							"colType" : "number"
						},
						{
							"colId" : "BENEFIT_NODE_CCY",
							"colDesc" : getLabel( 'lblenefitAmount', 'Benefit' ),
							"colType" : "number"
						},
						{
							"colId" : "BENEFIT_POOL_CCY",
							"colDesc" : getLabel( 'lblBenefitAmount', 'Benefit in Pool Currency' ),
							"colType" : "number"
						},
						{
							"colId" : "EXCHANGE_RATE",
							"colDesc" : getLabel( 'lblExchangeRate', 'Exchange Rate' ),
							"colType" : "number"
						},
						{
							"colId" : "CURRENCY",
							"colDesc" : getLabel( 'lblCurrency', 'CCY' )
						}
					];
				}
				else if( structureType == 'CB' )
				{
					// NET
					if( structureSubType == '1' )
					{
						arrColsPref =
						[
							{
								"colId" : "BREAKUP_DATE",
								"colDesc" : getLabel( 'lblDate', 'Date' )
							},
							{
								"colId" : "CURRENCY",
								"colDesc" : getLabel( 'lblCurrency', 'CCY' )
							},
							{
								"colId" : "POOL_BALANCE",
								"colDesc" : getLabel( 'lblGrossDebitPoolBalance', 'Net Pool Balance' ),
								"colType" : "number"
							},
							{
								"colId" : "APPLIED_RATE",
								"colDesc" : getLabel( 'lblAppliedRate', 'Applied Rate for Net Pool Balances' ),
								"colType" : "number"
							},
							{
								"colId" : "BENEFIT_AMOUNT",
								"colDesc" : getLabel( 'lblInterestAmount', 'Benefit' ),
								"colType" : "number"
							}
						];
					}
					// GROSS
					else if( structureSubType == '2' )
					{
						arrColsPref =
						[
							{
								"colId" : "BREAKUP_DATE",
								"colDesc" : getLabel( 'lblDate', 'Date' )
							},
							{
								"colId" : "CURRENCY",
								"colDesc" : getLabel( 'lblCurrency', 'CCY' )
							},
							{
								"colId" : "GROSS_CR_BALANCE",
								"colDesc" : getLabel( 'lblGrossCreditPoolBalance', 'Gross Credit Pool Balance' ),
								"colType" : "number"
							},
							{
								"colId" : "GROSS_DR_BALANCE",
								"colDesc" : getLabel( 'lblGrossDebitPoolBalance', 'Gross Debit Pool Balance' ),
								"colType" : "number"
							},
							{
								"colId" : "CR_APPLIED_RATE",
								"colDesc" : getLabel( 'lblAppliedGrossCrBalance',
									'Applied Rate For Gross Credit Balance' ),
								"colType" : "number"
							},
							{
								"colId" : "CR_INTEREST_AMOUNT",
								"colDesc" : getLabel( 'lblGrossCrPoolIntAmount', 'Pool Credit Interest Amount' ),
								"colType" : "number"
							},
							{
								"colId" : "DR_APPLIED_RATE",
								"colDesc" : getLabel( 'lblAppliedGrossCrBalance',
									'Applied Rate For Gross Debit Balance' ),
								"colType" : "number"
							},
							{
								"colId" : "DR_INTEREST_AMOUNT",
								"colDesc" : getLabel( 'lblGrossCrPoolIntAmount', 'Pool Debit Interest Amount' ),
								"colType" : "number"
							},
							{
								"colId" : "CR_BENEFIT_AMOUNT",
								"colDesc" : getLabel( 'lblGrossCrPoolIntAmount', 'Credit Benefit' ),
								"colType" : "number"
							},
							{
								"colId" : "DR_BENEFIT_AMOUNT",
								"colDesc" : getLabel( 'lblGrossCrPoolIntAmount', 'Debit Benefit' ),
								"colType" : "number"
							}
						]
					}
					// DEBIT GROSS
					else if( structureSubType == '3' )
					{
						// Query type : Accrual OR Settlement  and transactionType : Interest
						if( transactionType == '01' || transactionType == '03' )
						{
							if( groupOrAccount == agreementCodeVal )
							{
								arrColsPref =
								[
									{
										"colId" : "BREAKUP_DATE",
										"colDesc" : getLabel( 'lblDate', 'Date' )
									},
									{
										"colId" : "CURRENCY",
										"colDesc" : getLabel( 'lblCurrency', 'CCY' )
									},
									{
										"colId" : "POOL_BALANCE",
										"colDesc" : getLabel( 'lblGrossDebitPoolBalance', 'Balance' ),
										"colType" : "number"
									},
									{
										"colId" : "DR_APPLIED_RATE",
										"colDesc" : getLabel( 'lblAppliedRate', 'Applied Rate' ),
										"colType" : "number"
									},
									{
										"colId" : "DR_INTEREST_AMOUNT",
										"colDesc" : getLabel( 'lblInterestAmount', 'Interest Amount' ),
										"colType" : "number"
									}
								];
							}
							else
							{
								arrColsPref =
								[
									{
										"colId" : "BREAKUP_DATE",
										"colDesc" : getLabel( 'lblDate', 'Date' )
									},
									{
										"colId" : "CURRENCY",
										"colDesc" : getLabel( 'lblCurrency', 'CCY' )
									},
									{
										"colId" : "POOL_BALANCE",
										"colDesc" : getLabel( 'lblGrossDebitPoolBalance', 'Balance' ),
										"colType" : "number"
									},
									{
										"colId" : "APPLIED_RATE",
										"colDesc" : getLabel( 'lblAppliedRate', 'Applied Rate' ),
										"colType" : "number"
									},
									{
										"colId" : "INTEREST_AMOUNT",
										"colDesc" : getLabel( 'lblInterestAmount', 'Interest Amount' ),
										"colType" : "number"
									}
								];
							}
						}
						// Query type : Settlement  and transactionType : Apportionment
						else if( transactionType == '05' )
						{
							arrColsPref =
							[
								{
									"colId" : "BREAKUP_DATE",
									"colDesc" : getLabel( 'lblDate', 'Date' )
								},
								{
									"colId" : "CURRENCY",
									"colDesc" : getLabel( 'lblCurrency', 'CCY' )
								},
								{
									"colId" : "POOL_BALANCE",
									"colDesc" : getLabel( 'lblGrossDebitPoolBalance', 'Balance' ),
									"colType" : "number"
								},
								{
									"colId" : "DR_APPORT_RATE",
									"colDesc" : getLabel( 'lblAppliedRate', 'Applied Rate' ),
									"colType" : "number"
								},
								{
									"colId" : "DR_APPORT_AMOUNT",
									"colDesc" : getLabel( 'lblInterestAmount', 'Interest Amount' ),
									"colType" : "number"
								}
							];
						}
					}
					// CREDIT GROSS
					else if( structureSubType == '4' )
					{
						// Query type : Accrual OR Settlement  and transactionType : Interest
						if( transactionType == '01' || transactionType == '03' )
						{
							if( groupOrAccount == agreementCodeVal )
							{
								arrColsPref =
								[
									{
										"colId" : "BREAKUP_DATE",
										"colDesc" : getLabel( 'lblDate', 'Date' )
									},
									{
										"colId" : "CURRENCY",
										"colDesc" : getLabel( 'lblCurrency', 'CCY' )
									},
									{
										"colId" : "POOL_BALANCE",
										"colDesc" : getLabel( 'lblGrossCreditPoolBalance', 'Balance' ),
										"colType" : "number"
									},
									{
										"colId" : "CR_APPLIED_RATE",
										"colDesc" : getLabel( 'lblAppliedRate', 'Applied Rate' ),
										"colType" : "number"
									},
									{
										"colId" : "CR_INTEREST_AMOUNT",
										"colDesc" : getLabel( 'lblInterestAmount', 'Interest Amount' ),
										"colType" : "number"
									}
								];
							}
							else
							{
								arrColsPref =
								[
									{
										"colId" : "BREAKUP_DATE",
										"colDesc" : getLabel( 'lblDate', 'Date' )
									},
									{
										"colId" : "CURRENCY",
										"colDesc" : getLabel( 'lblCurrency', 'CCY' )
									},
									{
										"colId" : "POOL_BALANCE",
										"colDesc" : getLabel( 'lblGrossCreditPoolBalance', 'Balance' ),
										"colType" : "number"
									},
									{
										"colId" : "APPLIED_RATE",
										"colDesc" : getLabel( 'lblAppliedRate', 'Applied Rate' ),
										"colType" : "number"
									},
									{
										"colId" : "INTEREST_AMOUNT",
										"colDesc" : getLabel( 'lblInterestAmount', 'Interest Amount' ),
										"colType" : "number"
									}
								];
							}

						}
						// Query type : Settlement  and transactionType : Apportionment
						else if( transactionType == '05' )
						{
							arrColsPref =
							[
								{
									"colId" : "BREAKUP_DATE",
									"colDesc" : getLabel( 'lblDate', 'Date' )
								},
								{
									"colId" : "CURRENCY",
									"colDesc" : getLabel( 'lblCurrency', 'CCY' )
								},
								{
									"colId" : "POOL_BALANCE",
									"colDesc" : getLabel( 'lblGrossCreditPoolBalance', 'Balance' ),
									"colType" : "number"
								},
								{
									"colId" : "CR_APPORT_RATE",
									"colDesc" : getLabel( 'lblAppliedRate', 'Applied Rate' ),
									"colType" : "number"
								},
								{
									"colId" : "CR_APPORT_AMOUNT",
									"colDesc" : getLabel( 'lblInterestAmount', 'Interest Amount' ),
									"colType" : "number"
								}
							];
						}
					}
				}

				return arrColsPref;
			},
			getAccrualSettlementGridConfig : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;

				objWidthMap = me.getObjWidthMap();
				arrColsPref = me.getArrColsRef();

				storeModel =
				{
					fields :
					[
						'BREAKUP_DATE', 'POOL_BALANCE', 'CURRENCY', 'APPLIED_RATE', 'INTEREST_AMOUNT',
						'BENEFIT_AMOUNT', 'BENEFIT_ALLOC_RATIO', 'GROSS_CR_BALANCE', 'GROSS_DR_BALANCE',
						'APPLICABLE_TIER', 'APPLICABLE_RATE', 'APPLIED_TIER', 'BENEFIT_POOL_CCY', 'EXCHANGE_RATE',
						'CR_APPORT_RROFKEY', 'CR_INTEREST_PROFKEY', 'DR_APPORT_RROFKEY', 'DR_INTEREST_PROFKEY',
						'CR_APPLIED_RATE', 'CR_INTEREST_AMOUNT', 'DR_APPLIED_RATE', 'DR_INTEREST_AMOUNT',
						'CR_BENEFIT_AMOUNT', 'DR_BENEFIT_AMOUNT', 'CR_APPORT_RATE', 'CR_APPORT_AMOUNT',
						'BENEFIT_NODE_CCY'

					],
					proxyUrl : 'getAccrualSettlementDtwiseBreakup.srvc',
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
			columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
			{
				var strRetValue = value;
				var recKey = null;
				var strUrl = null;
				if( !Ext.isEmpty( value ) && value != '' )
				{
					if( colId === 'col_APPLIED_RATE' && "0.0000" != value && '0' == entityType )
					{

						if( structureType == 'CB' )
						{

							if( structureSubType == '1' )
							{
								var nodeBalance = record.get( 'POOL_BALANCE' );
								if( nodeBalance > 0 )
								{
									strRetValue = '<a href="#"  onclick="javascript:showInterestProfile('
										+ "'"
										+ record.get( 'CR_INTEREST_PROFKEY' )
										+ "', '"
										+ record.get( 'BREAKUP_DATE' )
										+ "', '"
										+ csrfTokenName
										+ "', '"
										+ csrfTokenValue + "'" + ')" ><u>' + value + '%</u></a>';
								}
								else
								{
									strRetValue = '<a href="#"  onclick="javascript:showInterestProfile('
										+ "'"
										+ record.get( 'DR_INTEREST_PROFKEY' )
										+ "', '"
										+ record.get( 'BREAKUP_DATE' )
										+ "', '"
										+ csrfTokenName
										+ "', '"
										+ csrfTokenValue + "'" + ')" ><u>' + value + '%</u></a>';
								}

							}
							else if( structureSubType == '3' )
							{
								if( queryType == '2' )
								{
									strRetValue = '<a href="#"  onclick="javascript:showInterestProfile('
										+ "'"
										+ record.get( 'DR_INTEREST_PROFKEY' )
										+ "', '"
										+ record.get( 'BREAKUP_DATE' )
										+ "', '"
										+ csrfTokenName
										+ "', '"
										+ csrfTokenValue + "'" + ')" ><u>' + value + '%</u></a>';
								}
								else if( queryType == '3' )
								{
									if( transactionType == '03' ) // Interest
									{
										strRetValue = '<a href="#"  onclick="javascript:showInterestProfile('
											+ "'"
											+ record.get( 'DR_INTEREST_PROFKEY' )
											+ "', '"
											+ record.get( 'BREAKUP_DATE' )
											+ "', '"
											+ csrfTokenName
											+ "', '"
											+ csrfTokenValue + "'" + ')" ><u>' + value + '%</u></a>';
									}
									else if( transactionType == '05' ) // Apportionment
									{
										strRetValue = '<a href="#"  onclick="javascript:showInterestProfile('
											+ "'"
											+ record.get( 'DR_APPORT_RROFKEY' )
											+ "', '"
											+ record.get( 'BREAKUP_DATE' )
											+ "', '"
											+ csrfTokenName
											+ "', '"
											+ csrfTokenValue + "'" + ')" ><u>' + value + '%</u></a>';
									}
								}
							}
							else if( structureSubType == '4' )
							{
								if( queryType == '2' )
								{
									strRetValue = '<a href="#"  onclick="javascript:showInterestProfile('
										+ "'"
										+ record.get( 'CR_INTEREST_PROFKEY' )
										+ "', '"
										+ record.get( 'BREAKUP_DATE' )
										+ "', '"
										+ csrfTokenName
										+ "', '"
										+ csrfTokenValue + "'" + ')" ><u>' + value + '%</u></a>';
								}
								else if( queryType == '3' )
								{
									if( transactionType == '03' ) // Interest
									{
										strRetValue = '<a href="#"  onclick="javascript:showInterestProfile('
											+ "'"
											+ record.get( 'CR_INTEREST_PROFKEY' )
											+ "', '"
											+ record.get( 'BREAKUP_DATE' )
											+ "', '"
											+ csrfTokenName
											+ "', '"
											+ csrfTokenValue + "'" + ')" ><u>' + value + '%</u></a>';
									}
									else if( transactionType == '05' ) // Apportionment
									{
										strRetValue = '<a href="#"  onclick="javascript:showInterestProfile('
											+ "'"
											+ record.get( 'CR_APPORT_RROFKEY' )
											+ "', '"
											+ record.get( 'BREAKUP_DATE' )
											+ "', '"
											+ csrfTokenName
											+ "', '"
											+ csrfTokenValue + "'" + ')" ><u>' + value + '%</u></a>';
									}
								}
							}

						}
						else if( structureType == 'CP' )
						{
							var nodeBalance = record.get( 'POOL_BALANCE' );

							if( nodeBalance > 0 )
							{
								strRetValue = '<a href="#"  onclick="javascript:showInterestProfile('
									+ "'" + record.get( 'CR_INTEREST_PROFKEY' ) + "', '" + record.get( 'BREAKUP_DATE' )
									+ "', '" + csrfTokenName + "', '" + csrfTokenValue + "'" + ')" ><u>' + value
									+ '%</u></a>';
							}
							else
							{
								strRetValue = '<a href="#"  onclick="javascript:showInterestProfile('
									+ "'" + record.get( 'DR_INTEREST_PROFKEY' ) + "', '" + record.get( 'BREAKUP_DATE' )
									+ "', '" + csrfTokenName + "', '" + csrfTokenValue + "'" + ')" ><u>' + value
									+ '%</u></a>';
							}
						}
						else if( structureType == 'TE' )
						{
							var nodeBalance = record.get( 'POOL_BALANCE' );

							if( nodeBalance > 0 )
							{
								strRetValue = '<a href="#"  onclick="javascript:showInterestProfile('
									+ "'" + record.get( 'CR_INTEREST_PROFKEY' ) + "', '" + record.get( 'BREAKUP_DATE' )
									+ "', '" + csrfTokenName + "', '" + csrfTokenValue + "'" + ')" ><u>' + value
									+ '%</u></a>';
							}
							else
							{
								strRetValue = '<a href="#"  onclick="javascript:showInterestProfile('
									+ "'" + record.get( 'DR_INTEREST_PROFKEY' ) + "', '" + record.get( 'BREAKUP_DATE' )
									+ "', '" + csrfTokenName + "', '" + csrfTokenValue + "'" + ')" ><u>' + value
									+ '%</u></a>';
							}
						}

					} // Following if statement for CB GROSS
					else if( colId === 'col_CR_APPLIED_RATE' && "0.0000" != value && '0' == entityType )
					{
						strRetValue = '<a href="#"  onclick="javascript:showInterestProfile(' + "'"
							+ record.get( 'CR_INTEREST_PROFKEY' ) + "', '" + record.get( 'BREAKUP_DATE' ) + "', '"
							+ csrfTokenName + "', '" + csrfTokenValue + "'" + ')" ><u>' + value + '%</u></a>';

					} // Following if statement for CB GROSS
					else if( colId === 'col_DR_APPLIED_RATE' && "0.0000" != value && '0' == entityType )
					{
						strRetValue = '<a href="#"  onclick="javascript:showInterestProfile(' + "'"
							+ record.get( 'DR_INTEREST_PROFKEY' ) + "', '" + record.get( 'BREAKUP_DATE' ) + "', '"
							+ csrfTokenName + "', '" + csrfTokenValue + "'" + ')" ><u>' + value + '%</u></a>';

					}
					else if( colId === 'col_BREAKUP_DATE' )
					{
						if( structureType == 'CB' )
						{
							if( structureSubType == '1' )
							{
								strUrl = 'getComputationDtWiseData.srvc';
								strRetValue = '<a href="#" style="text-decoration: underline" onclick="javascript:goToComputationDateWisePage(\''
									+ strUrl + '\',\'' + record.get( 'BREAKUP_DATE' ) + '\')">' + value + '</a>';
							}
							if( structureSubType == '2' )
							{
								strUrl = 'getCBGrossDateWiseData.srvc';
								strRetValue = '<a href="#" style="text-decoration: underline" onclick="javascript:goToComputationDateWisePage(\''
									+ strUrl + '\',\'' + record.get( 'BREAKUP_DATE' ) + '\')">' + value + '</a>';
							}
							else if( structureSubType == '3' )
							{
								strUrl = 'getCBDebitGrossDateWiseData.srvc';
								strRetValue = '<a href="#" style="text-decoration: underline" onclick="javascript:goToComputationDateWisePage(\''
									+ strUrl + '\',\'' + record.get( 'BREAKUP_DATE' ) + '\')">' + value + '</a>';
							}
							else if( structureSubType == '4' )
							{
								strUrl = 'getComputationDtWiseData.srvc';
								strRetValue = '<a href="#" style="text-decoration: underline" onclick="javascript:goToComputationDateWisePage(\''
									+ strUrl + '\',\'' + record.get( 'BREAKUP_DATE' ) + '\')">' + value + '</a>';
							}
						}
						else if( structureType == 'CP' )
						{
							if( structureSubType == '1' )
							{
								strUrl = 'getComputationDtWiseData.srvc';
								strRetValue = '<a href="#" style="text-decoration: underline" onclick="javascript:goToComputationDateWisePage(\''
									+ strUrl + '\',\'' + record.get( 'BREAKUP_DATE' ) + '\')">' + value + '</a>';
							}
						}
						else if( structureType == 'TE' )
						{
							if( structureSubType == '1' )
							{
								strUrl = 'getTENetComputationDateWiseData.srvc';
								strRetValue = '<a href="#" style="text-decoration: underline" onclick="javascript:goToComputationDateWisePage(\''
									+ strUrl + '\',\'' + record.get( 'BREAKUP_DATE' ) + '\')">' + value + '</a>';
							}
						}

					}// CB Credit Gross Apportionment Datewise Breakup
					else if( colId === 'col_CR_APPORT_RATE' && "0.0000" != value && '0' == entityType )
					{
						strRetValue = '<a href="#"  onclick="javascript:showInterestProfile(' + "'"
							+ record.get( 'CR_APPORT_RROFKEY' ) + "', '" + record.get( 'BREAKUP_DATE' ) + "', '"
							+ csrfTokenName + "', '" + csrfTokenValue + "'" + ')" ><u>' + value + '%</u></a>';
					}
				}
				return strRetValue;
			},

			handleSmartGridLoading : function( arrCols, storeModel )
			{
				var me = this;
				var pgSize = null;
				pgSize = 100;
				accrualSettlmentDtBreakupGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'accrualSettlementBreakupItemId',
					itemId : 'accrualSettlementBreakupItemId',
					pageSize : pgSize,
					autoDestroy : true,
					stateful : false,
					showEmptyRow : false,
					hideRowNumbererColumn : true,
					showSummaryRow : false,
					showPager : false,
					showCheckBoxColumn : false,
					cls:'t7-grid',
					headerDockedItems : null,
					rowList :
					[
						10, 25, 50, 100, 200, 500
					],
					minHeight : 10,
					maxHeight : 280,
					//margin : '18 0 0 0',
					enableColumnAutoWidth : _blnGridAutoColumnWidth,
					columnModel : arrCols,
					storeModel : storeModel
				} );
				var accraulSettlementBreakupView = me.getDateWiseBreakupItemIdRef();
				accraulSettlementBreakupView.add( accrualSettlmentDtBreakupGrid );
				accraulSettlementBreakupView.doLayout();
			}
		} );
function goToComputationDateWisePage( strUrl, selectedDate )
{
	var me = this;
	var form;

	strUrl = strUrl + "?$viewState=" + encodeURIComponent( viewState ) + "&$selectedDate=" + selectedDate
		+ "&$isAccrualSettlement=" + "Y" + "&" + csrfTokenName + "=" + csrfTokenValue;
	form = document.createElement( 'FORM' );
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.action = strUrl;
	document.body.appendChild(form);
	form.submit();
}
