/**
 * @class InvestmentCenterCreateNewAdvFilter
 * @extends Ext.panel.Panel
 * @author Vaidehi
 */

Ext.define( 'GCP.view.InvestmentCenterCreateNewAdvFilter',
{
	extend : 'Ext.panel.Panel',
	xtype : 'investmentCenterCreateNewAdvFilter',
	requires :
	[
		'Ext.ux.gcp.DateHandler', 'Ext.ux.gcp.AutoCompleter'
	],
	callerParent : null,
	config :
	{
		dateHandler : null,
		requestDateFilterVal : null,
		requestDateFilterLabel : null,
		instructionDateFilterVal : null,
		instructionDateFilterLabel : null

	},
	layout :
	{
		type : 'vbox'
	},
	initComponent : function()
	{
		var me = this;
		var arrInvestmentType =
		[
			{
				"key" : "All",
				"value" : "All"
			},
			{
				"key" : "P",
				"value" : "Investment"
			},
			{
				"key" : "R",
				"value" : "Redemption"
			}
		];
		var arrInvestmentRequestStatus =
		[
			{
				"key" : "All",
				"value" : "All"
			},
			{
				"key" : "1A",
				"value" : "For Auth"
			},
			{
				"key" : "1M",
				"value" : "For MyAuth"
			},
			{
				"key" : "2",
				"value" : "Authorized"
			},
			{
				"key" : "4",
				"value" : "Rejected"
			},
			{
				"key" : "8",
				"value" : "Deleted"
			}
		];

		var statusComboStore = Ext.create( 'Ext.data.Store',
		{
			fields :
			[
				'key', 'value'
			],
			data : arrInvestmentRequestStatus
		} );

		var typeComboStore = Ext.create( 'Ext.data.Store',
		{
			fields :
			[
				'key', 'value'
			],
			data : arrInvestmentType
		} );

		var dateHandlerController = Ext.create( 'Ext.ux.gcp.DateHandler' );
		if( !Ext.isEmpty( dateHandlerController ) )
			this.dateHandler = dateHandlerController;

		var menuItems =
		[
			{
				text : getLabel( 'today', 'Today' ),
				btnId : 'btnToday',
				btnValue : '1',
				parent : this,
				handler : function( btn, opts )
				{
					if( me.callerParent == 'investmentCenterView' )
						this.parent.fireEvent( 'filterDateChange', btn, opts );

				}
			},
			{
				text : getLabel( 'yesterday', 'Yesterday' ),
				btnId : 'btnYesterday',
				btnValue : '2',
				parent : this,
				handler : function( btn, opts )
				{
					if( me.callerParent == 'investmentCenterView' )
						this.parent.fireEvent( 'filterDateChange', btn, opts );
				}
			},
			{
				text : getLabel( 'thisweek', 'This Week' ),
				btnId : 'btnThisweek',
				btnValue : '3',
				parent : this,
				handler : function( btn, opts )
				{
					if( me.callerParent == 'investmentCenterView' )
						this.parent.fireEvent( 'filterDateChange', btn, opts );
				}
			},
			{
				text : getLabel( 'lastweektodate', 'Last Week To Date' ),
				btnId : 'btnLastweek',
				parent : this,
				btnValue : '4',
				handler : function( btn, opts )
				{
					if( me.callerParent == 'investmentCenterView' )
						this.parent.fireEvent( 'filterDateChange', btn, opts );
				}
			},
			{
				text : getLabel( 'thismonth', 'This Month' ),
				btnId : 'btnThismonth',
				parent : this,
				btnValue : '5',
				handler : function( btn, opts )
				{
					if( me.callerParent == 'investmentCenterView' )
						this.parent.fireEvent( 'filterDateChange', btn, opts );
				}
			},
			{
				text : getLabel( 'lastMonthToDate', 'Last Month To Date' ),
				btnId : 'btnLastmonth',
				btnValue : '6',
				parent : this,
				handler : function( btn, opts )
				{
					if( me.callerParent == 'investmentCenterView' )
						this.parent.fireEvent( 'filterDateChange', btn, opts );
				}
			},
			{
				text : getLabel( 'thisquarter', 'This Quarter' ),
				btnId : 'btnLastMonthToDate',
				btnValue : '8',
				parent : this,
				handler : function( btn, opts )
				{
					if( me.callerParent == 'investmentCenterView' )
						this.parent.fireEvent( 'filterDateChange', btn, opts );
				}
			},
			{
				text : getLabel( 'lastQuarterToDate', 'Last Quarter To Date' ),
				btnId : 'btnQuarterToDate',
				btnValue : '9',
				parent : this,
				handler : function( btn, opts )
				{
					if( me.callerParent == 'investmentCenterView' )
						this.parent.fireEvent( 'filterDateChange', btn, opts );
				}
			},
			{
				text : getLabel( 'thisyear', 'This Year' ),
				btnId : 'btnLastQuarterToDate',
				btnValue : '10',
				parent : this,
				handler : function( btn, opts )
				{
					if( me.callerParent == 'investmentCenterView' )
						this.parent.fireEvent( 'filterDateChange', btn, opts );
				}
			},
			{
				text : getLabel( 'lastyeartodate', 'Last Year To Date' ),
				btnId : 'btnYearToDate',
				parent : this,
				btnValue : '11',
				handler : function( btn, opts )
				{
					if( me.callerParent == 'investmentCenterView' )
						this.parent.fireEvent( 'filterDateChange', btn, opts );
				}
			},
			{
				text : getLabel( 'daterange', 'Date Range' ),
				btnId : 'btnDateRange',
				parent : this,
				btnValue : '7',
				handler : function( btn, opts )
				{
					if( me.callerParent == 'investmentCenterView' )
						this.parent.fireEvent( 'filterDateChange', btn, opts );
				}
			}
		];

		this.items =
		[
			{
				xtype : 'container',
				padding : '0 0 0 10',
				cls : 'filter-container-cls',
				width : 'auto',
				itemId : 'parentContainer',
				layout : 'column',
				items :
				[
					{
						xtype : 'container',
						cls : 'ux_div-padding',
						columnWidth : 0.43,
						layout : 'vbox',
						defaults :
						{
							labelAlign : 'top',
							labelSeparator : ''
						},
						items :
						[
							{
								xtype : 'textfield',
								fieldLabel : getLabel( 'lblreference', 'Reference' ),
								cls : 'ux_paddingb',
								fieldCls : 'w10_3',
								itemId : 'requestReference',
								name : 'Reference'
							},
							{
								xtype : 'AutoCompleter',
								matchFieldWidth : true,
								cls : 'autoCmplete-field ux_paddingb',
								margin : '18 0 0 0',
								labelSeparator : '',
								fieldLabel : getLabel( 'fundName', 'Fund Name' ),
								fieldCls : 'w10_3',
								name : 'fundName',
								itemId : 'fundName',
								cfgUrl : 'services/userseek/fundName.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'investmentAccountSeek',
								cfgRootNode : 'd.preferences',
								cfgKeyNode : 'DESCR',
								cfgDataNode1 : 'DESCR'
							},
							{
								xtype : 'container',
								cls : 'ux_div-padding',
								layout : 'hbox',
								items :
								[
									{
										xtype : 'label',
										itemId : 'requestDateFilterLbl',
										text : getLabel( 'requestDate', 'Request Date' ),
										cls : 'f13 ux_font-size14',
										padding : '6 0 0 3'
									},
									{
										xtype : 'button',
										border : 0,
										itemId : 'requestDateFilterId',
										//cls : 'xn-custom-arrow-button cursor_pointer w1',
										cls: 'menu-disable xn-custom-arrow-button cursor_pointer',
										glyph:'xf0d7@fontawesome',
										margin : '6 0 0 3',
										menu : Ext.create( 'Ext.menu.Menu',
										{
											itemId : 'requestDateFilterMenu',
											items : menuItems
										} )

									}
								]
							},
							{
								xtype : 'container',
								itemId : 'requestDateFilter',
								height : 25,
								layout : 'vbox',
								padding : '0 0 0 0',
								items :
								[
									{
										xtype : 'container',
										itemId : 'dateRangeComponentFilter',
										name : 'requestDateFilterRange',
										layout : 'hbox',
										hidden : true,
										items :
										[
											{
												xtype : 'datefield',
												itemId : 'requestFromDateFilter',
												name : 'requestFromDateFilter',
												hideTrigger : true,
												width : 70,
												fieldCls : 'h2',
												cls : 'date-range-font-size',
												padding : '0 3 0 0',
												editable : false,
												fieldIndex : '7',
												listeners :
												{
													change : function( cmp, newVal )
													{
														if( me.callerParent == 'investmentCenterView' )
															this.parent.fireEvent( 'filterDateChange', btn, opts );
													}
												}
											},
											{
												xtype : 'datefield',
												itemId : 'requestToDateFilter',
												name : 'requestToDateFilter',
												hideTrigger : true,
												padding : '0 3 0 0',
												editable : false,
												width : 70,
												fieldCls : 'h2',
												cls : 'date-range-font-size',
												fieldIndex : '7',
												listeners :
												{
													change : function( cmp, newVal )
													{
														if( me.callerParent == 'investmentCenterView' )
															this.parent.fireEvent( 'filterDateChange', btn, opts );
													}
												}
											}
										]
									}, ,
									{
										xtype : 'container',
										layout : 'hbox',
										itemId : 'requestDate',
										padding : '0 0 0 3',
										items :
										[
											{
												xtype : 'label',
												itemId : 'requestDateFilterFrom',
												name : 'requestDateFilterFrom'
											},
											{
												xtype : 'label',
												itemId : 'requestDateFilterTo',
												name : 'requestDateFilterTo'
											}
										]
									}
								]
							},
							{
								xtype : 'combobox',
								margin : '9 0 0 0',
								displayField : 'value',
								fieldLabel : getLabel( 'status', 'Status' ),
								valueField : 'key',
								cls : 'ux_paddingb',
								width : 200,
								fieldCls : 'xn-form-field inline_block ',
								//padding : '0 8 0 0',
								triggerBaseCls : 'xn-form-trigger',
								value : '',
								store : statusComboStore,
								editable : false,
								labelWidth : 10,
								itemId : 'requestStatus',
								listConfig : {

								}
							}
						]
					},

					{
						xtype : 'container',
						cls : 'ux_div-padding',
						columnWidth : 0.43,
						margin : '0 0 0 40',
						layout : 'vbox',
						defaults :
						{
							labelAlign : 'top',
							labelSeparator : ''
						},
						items :
						[
							{
								xtype : 'textfield',
								fieldLabel : getLabel( 'filterName', 'Filter Name' ),
								cls : 'ux_paddingb',
								itemId : 'filterCode',
								fieldCls : 'w10_3',
								name : 'filterCode'
							},

							{
								xtype : 'AutoCompleter',
								margin : '18 0 0 0',
								matchFieldWidth : true,
								cls : 'autoCmplete-field ux_paddingb',
								labelSeparator : '',
								fieldLabel : getLabel( 'investmentAccount', 'Investment Account' ),
								fieldCls : 'w10_3',
								name : 'investmentAccNmbr',
								itemId : 'investmentAccNmbr',
								cfgUrl : 'services/userseek/investmentAccount.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'investmentAccountSeek',
								cfgRootNode : 'd.preferences',
								cfgKeyNode : 'CODE',
								cfgDataNode1 : 'DESCR'
							},
							{
								xtype : 'container',
								cls : 'ux_div-padding',
								layout : 'hbox',
								items :
								[
									{
										xtype : 'label',
										itemId : 'instrctionDateFilterLbl',
										text : getLabel( 'instrctionDate', 'Instruction Date' ),
										cls : 'f13 ux_font-size14',
										padding : '6 0 0 3'
									},
									{
										xtype : 'button',
										border : 0,
										itemId : 'instrctionDateFilterId',
										cls: 'menu-disable xn-custom-arrow-button cursor_pointer',
										glyph:'xf0d7@fontawesome',
										margin : '6 0 0 3',
										menu : Ext.create( 'Ext.menu.Menu',
										{
											itemId : 'instrctionDateFilterMenu',
											items : menuItems
										} )

									}
								]
							},
							{
								xtype : 'container',
								itemId : 'instrctionDateFilter',
								height : 25,
								layout : 'vbox',
								padding : '0 0 0 0',
								items :
								[
									{
										xtype : 'container',
										itemId : 'dateRangeComponentFilterInstrction',
										name : 'instrctionDateFilterRange',
										layout : 'hbox',
										hidden : true,
										items :
										[
											{
												xtype : 'datefield',
												itemId : 'instrctionFromDateFilter',
												name : 'instrctionFromDateFilter',
												hideTrigger : true,
												width : 70,
												fieldCls : 'h2',
												cls : 'date-range-font-size',
												padding : '0 3 0 0',
												editable : false,
												fieldIndex : '7',
												listeners :
												{
													change : function( cmp, newVal )
													{
														if( me.callerParent == 'investmentCenterView' )
															this.parent.fireEvent( 'filterDateChange', btn, opts );
													}
												}
											},
											{
												xtype : 'datefield',
												itemId : 'instrctionToDateFilter',
												name : 'instrctionToDateFilter',
												hideTrigger : true,
												padding : '0 3 0 0',
												editable : false,
												width : 70,
												fieldCls : 'h2',
												cls : 'date-range-font-size',
												fieldIndex : '7',
												listeners :
												{
													change : function( cmp, newVal )
													{
														if( me.callerParent == 'investmentCenterView' )
															this.parent.fireEvent( 'filterDateChange', btn, opts );
													}
												}
											}
										]
									}, ,
									{
										xtype : 'container',
										layout : 'hbox',
										itemId : 'scheduledDate',
										padding : '0 0 0 3',
										items :
										[
											{
												xtype : 'label',
												itemId : 'instrctionDateFilterFrom',
												name : 'instrctionDateFilterFrom'
											},
											{
												xtype : 'label',
												itemId : 'instrctionDateFilterTo',
												name : 'instrctionDateFilterTo'
											}
										]
									}
								]
							},
							{
								xtype : 'combobox',
								margin : '9 0 0 0',
								width : 200,
								displayField : 'value',
								fieldLabel : getLabel( 'type', 'Type' ),
								cls : 'ux_paddingb',
								valueField : 'key',
								fieldCls : 'xn-form-field inline_block',
								triggerBaseCls : 'xn-form-trigger',
								value : '',
								store : typeComboStore,
								editable : false,
								labelWidth : 10,
								itemId : 'investmentType',
								listConfig : {

								}
							}
						]
					}

				]
			}
		];

		this.dockedItems =
		[
			{
				xtype : 'toolbar',
				padding : '20 0 0 0',
				dock : 'bottom',
				items :
				[
					'->',
					{
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_search-button',
						glyph : 'xf002@fontawesome',
						text : getLabel( 'btnSearch', 'Search' ),
						itemId : 'searchBtn',
						handler : function( btn )
						{
							if( me.callerParent == 'investmentCenterView' )
							{
								me.fireEvent( 'handleSearchAction', btn );
							}
						}
					},
					{
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_save-search-button',
						glyph : 'xf00e@fontawesome',
						text : getLabel( 'btnSaveAndSearch', 'Submit' ),
						itemId : 'saveAndSearchBtn',
						handler : function( btn )
						{
							if( me.callerParent == 'investmentCenterView' )
							{
								me.fireEvent( 'handleSaveAndSearchAction', btn );
							}

						}
					},
					{
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_cancel-button',
						glyph : 'xf056@fontawesome',
						text : getLabel( 'btnCancel', 'Cancel' ),
						itemId : 'cancelBtn',
						handler : function( btn )
						{
							if( me.callerParent == 'investmentCenterView' )
							{
								me.fireEvent( 'closeFilterPopup', btn );
							}

						}
					},'->','->','->'
				]
			}
		];

		this.callParent( arguments );
	},

	filterDateChange : function( btn, opts )
	{
		var me = this;
		if( btn.parentMenu.itemId == "instrctionDateFilterMenu" )
			me.processFilterDateChange( btn, opts );
		if( btn.parentMenu.itemId == "requestDateFilterMenu" )
			me.requestFilterDateChange( btn, opts );

	},
	processFilterDateChange : function( btn, opts )
	{
		var me = this;
		me.instructionDateFilterVal = btn.btnValue;
		me.instructionDateFilterLabel = btn.text;
		me.handleProcessDateChange( btn.btnValue );
	},
	requestFilterDateChange : function( btn, opts )
	{
		var me = this;
		me.requestDateFilterVal = btn.btnValue;
		me.requestDateFilterLabel = btn.text;
		me.handleRequestDateChange( btn.btnValue );
	},
	handleProcessDateChange : function( index )
	{
		var me = this;
		var processDateRangeComponent = me
			.down( 'container[itemId=instrctionDateFilter] container[itemId="dateRangeComponentFilterInstrction"]' );
		var processDateLabel = me.down( 'label[itemId=instrctionDateFilterLbl]' );
		var fromDateLabel = me.down( 'container[itemId=instrctionDateFilter] label[itemId="instrctionDateFilterFrom"]' );
		var toDateLabel = me.down( 'container[itemId=instrctionDateFilter] label[itemId=instrctionDateFilterTo]' );

		var dateRangeFromDateRef = me.down( 'datefield[itemId="instrctionFromDateFilter"]' );
		var dateRangeToDateRef = me.down( 'datefield[itemId="instrctionToDateFilter"]' );
		var objDateParams = me.getDateFilterParam( index, dateRangeFromDateRef, dateRangeToDateRef );

		if( index == '7' )
		{
			fromDateLabel.hide();
			toDateLabel.hide();
			processDateRangeComponent.show();
		}
		else
		{
			processDateRangeComponent.hide();
			fromDateLabel.show();
			toDateLabel.show();
		}

		if( !Ext.isEmpty( me.dateFilterLabel ) )
		{
			processDateLabel.setText( getLabel( 'instructionDate', 'Instruction Date' ) + " (" + me.dateFilterLabel + ")" );
		}

		if( index !== '7' )
		{
			var vFromDate = Ext.util.Format.date( Ext.Date.parse( objDateParams.fieldValue1, 'Y-m-d' ),
				strExtApplicationDateFormat );
			var vToDate = Ext.util.Format
				.date( Ext.Date.parse( objDateParams.fieldValue2, 'Y-m-d' ), strExtApplicationDateFormat );

			if( index === '1' || index === '2' )
			{
				fromDateLabel.setText( vFromDate );
				toDateLabel.setText( "" );

				me.ribbonFromDate = vFromDate;
				me.ribbonToDate = vToDate;
			}
			else
			{
				fromDateLabel.setText( vFromDate + " - " );
				toDateLabel.setText( vToDate );

				me.ribbonFromDate = vFromDate + " - ";
				me.ribbonToDate = vToDate;
			}
		}
	},
	handleRequestDateChange : function( index )
	{
		var me = this;
		var requestDateRangeComponent = me
			.down( 'container[itemId=requestDateFilter] container[itemId="dateRangeComponentFilter"]' );
		var requestDateLabel = me.down( 'label[itemId=requestDateFilterLbl]' );
		var fromDateLabel = me.down( 'container[itemId=requestDateFilter] label[itemId="requestDateFilterFrom"]' );
		var toDateLabel = me.down( 'container[itemId=requestDateFilter] label[itemId=requestDateFilterTo]' );

		var dateRangeFromDateRef = me.down( 'datefield[itemId="requestFromDateFilter"]' );
		var dateRangeToDateRef = me.down( 'datefield[itemId="requestToDateFilter"]' );
		var objDateParams = me.getDateFilterParam( index, dateRangeFromDateRef, dateRangeToDateRef );

		if( index == '7' )
		{
			fromDateLabel.hide();
			toDateLabel.hide();
			requestDateRangeComponent.show();
		}
		else
		{
			requestDateRangeComponent.hide();
			fromDateLabel.show();
			toDateLabel.show();
		}

		if( !Ext.isEmpty( me.dateFilterLabel ) )
		{
			requestDateLabel.setText( getLabel( 'requestDate', 'Request Date' ) + " (" + me.dateFilterLabel + ")" );
		}

		if( index !== '7' )
		{
			var vFromDate = Ext.util.Format.date( Ext.Date.parse( objDateParams.fieldValue1, 'Y-m-d' ),
				strExtApplicationDateFormat );
			var vToDate = Ext.util.Format
				.date( Ext.Date.parse( objDateParams.fieldValue2, 'Y-m-d' ), strExtApplicationDateFormat );

			if( index === '1' || index === '2' )
			{
				fromDateLabel.setText( vFromDate );
				toDateLabel.setText( "" );

				me.ribbonFromDate = vFromDate;
				me.ribbonToDate = vToDate;
			}
			else
			{
				fromDateLabel.setText( vFromDate + " - " );
				toDateLabel.setText( vToDate );

				me.ribbonFromDate = vFromDate + " - ";
				me.ribbonToDate = vToDate;
			}
		}
	},
	getDateFilterParam : function( index, dateRangeFromDateRef, dateRangeToDateRef )
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
				// Last Week
				dtJson = objDateHandler.getLastWeekStartAndEndDate( date );
				fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
				fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
				operator = 'bt';
				break;
			case '5':
				// This Month
				dtJson = objDateHandler.getThisMonthStartAndEndDate( date );
				fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
				fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
				operator = 'bt';
				break;
			case '6':
				// Last Month
				dtJson = objDateHandler.getLastMonthStartAndEndDate( date );
				fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
				fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
				operator = 'bt';
				break;
			case '7':
				// Date Range

				if( !Ext.isEmpty( dateRangeFromDateRef ) && !Ext.isEmpty( dateRangeToDateRef ) )
				{
					var frmDate = dateRangeFromDateRef.getValue();
					var toDate = dateRangeToDateRef.getValue();
					fieldValue1 = Ext.Date.format( frmDate, strSqlDateFormat );
					fieldValue2 = Ext.Date.format( toDate, strSqlDateFormat );
					operator = 'bt';
				}
				break;
			case '8':
				// Last Month To Date
				dtJson = objDateHandler.getLastMonthToDate( date );
				fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
				fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
				operator = 'bt';
				break;
			case '9':
				// Quarter To Date
				dtJson = objDateHandler.getQuarterToDate( date );
				fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
				fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
				operator = 'bt';
				break;
			case '10':
				// Last Quarter To Date
				dtJson = objDateHandler.getLastQuarterToDate( date );
				fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
				fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
				operator = 'bt';
				break;
			case '11':
				// Year To Date
				dtJson = objDateHandler.getYearToDate( date );
				fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
				fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
				operator = 'bt';
				break;
			case '12':
				// Last Year
				dtJson = objDateHandler.getLastYear( date );
				fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
				fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
				operator = 'bt';
				break;
			case '13':
				// Last Quarter
				dtJson = objDateHandler.getLastQuarter( date );
				fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
				fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
				operator = 'bt';
				break;
		}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		return retObj;
	},
	getAdvancedFilterValueJson : function( FilterCodeVal, objOfCreateNewFilter )
	{
		var objJson = null;
		var jsonArray = [];

		var Ref = objOfCreateNewFilter.down( 'textfield[itemId="requestReference"]' ).getValue();
		if( !Ext.isEmpty( Ref ) )
		{
			jsonArray.push(
			{
				field : 'requestReference',
				operator : 'lk',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="requestReference"]' ).getValue(),
				value2 : ''
			} );
		}

		var CheckNum = objOfCreateNewFilter.down( 'AutoCompleter[itemId="fundName"]' ).getValue();
		if( !Ext.isEmpty( CheckNum ) )
		{
			jsonArray.push(
			{
				field : 'fundName',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'AutoCompleter[itemId="fundName"]' ).getValue(),
				value2 : ''
			} );
		}
		// Investment Acc
		var investmentAcc = objOfCreateNewFilter.down( 'AutoCompleter[itemId="investmentAccNmbr"]' ).getValue();
		if( !Ext.isEmpty( investmentAcc ) )
		{
			jsonArray.push(
			{
				field : 'investmentAccNmbr',
				operator : 'eq',
				value1 : investmentAcc,
				value2 : '',
				dataType : 0,
				displayType : 6
			} );
		}

		var status = objOfCreateNewFilter.down( 'combobox[itemId="requestStatus"]' ).getValue();
		if( !Ext.isEmpty( status ) )
		{ 
			if( status == '1A' || status == '1M' )
			{
				jsonArray.push(
				{
					field : 'requestStatus',
					operator : 'eq',
					value1 : '1',
					value2 : ''
				} );
				if( status == '1A' )
				{
					jsonArray.push(
					{
						field : 'makerId',
						operator : 'eq',
						value1 : USER
					} );
				}
				else
				{
					jsonArray.push(
					{
						field : 'makerId',
						operator : 'ne',
						value1 : USER
					} );
				}
			}
			else
			{
				jsonArray.push(
				{
					field : 'requestStatus',
					operator : 'eq',
					value1 : objOfCreateNewFilter.down( 'combobox[itemId="requestStatus"]' ).getValue(),
					value2 : ''
				} );
			}

		}
		var type = objOfCreateNewFilter.down( 'combobox[itemId="investmentType"]' ).getValue();
		if( !Ext.isEmpty( type ) )
		{
			jsonArray.push(
			{
				field : 'investmentType',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'combobox[itemId="investmentType"]' ).getValue(),
				value2 : ''
			} );
		}
		var filterCode = '';
		objJson = {};
		objJson.filterBy = jsonArray;
		if( FilterCodeVal && !Ext.isEmpty( FilterCodeVal ) )
			objJson.filterCode = filterCode;
		return objJson;
	},

	getAdvancedFilterQueryJson : function( objOfCreateNewFilter )
	{
		var objJson = null;

		var jsonArray = [];

		var Ref = objOfCreateNewFilter.down( 'textfield[itemId="requestReference"]' ).getValue();
		if( !Ext.isEmpty( Ref ) )
		{
			jsonArray.push(
			{
				field : 'requestReference',
				operator : 'lk',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="requestReference"]' ).getValue(),
				value2 : ''
			} );
		}

		var CheckNum = objOfCreateNewFilter.down( 'AutoCompleter[itemId="fundName"]' ).getValue();
		if( !Ext.isEmpty( CheckNum ) )
		{
			jsonArray.push(
			{
				field : 'fundName',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'AutoCompleter[itemId="fundName"]' ).getValue(),
				value2 : ''
			} );
		}
		// Investment Acc
		var investmentAcc = objOfCreateNewFilter.down( 'AutoCompleter[itemId="investmentAccNmbr"]' ).getValue();
		if( !Ext.isEmpty( investmentAcc ) )
		{
			jsonArray.push(
			{
				field : 'investmentAccNmbr',
				operator : 'eq',
				value1 : investmentAcc,
				value2 : '',
				dataType : 0,
				displayType : 6
			} );
		}
		var status = objOfCreateNewFilter.down( 'combobox[itemId="requestStatus"]' ).getValue();
		if( !Ext.isEmpty( status ) && status != 'All' )
		{
			if( status == '1A' || status == '1M' )
			{
				jsonArray.push(
				{
					field : 'requestStatus',
					operator : 'eq',
					value1 : '1',
					value2 : ''
				} );
				if( status == '1A' )
				{
					jsonArray.push(
					{
						field : 'makerId',
						operator : 'eq',
						value1 : USER,
						value2 : ''
					} );
				}
				else
				{
					jsonArray.push(
					{
						field : 'makerId',
						operator : 'ne',
						value1 : USER,
						value2 : ''
					} );
				}
			}
			else
			{
				jsonArray.push(
				{
					field : 'requestStatus',
					operator : 'eq',
					value1 : objOfCreateNewFilter.down( 'combobox[itemId="requestStatus"]' ).getValue(),
					value2 : ''
				} );
			}

		}

		var type = objOfCreateNewFilter.down( 'combobox[itemId="investmentType"]' ).getValue();
		if( !Ext.isEmpty( type ) && type != 'All' )
		{
			jsonArray.push(
			{
				field : 'investmentType',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'combobox[itemId="investmentType"]' ).getValue(),
				value2 : ''
			} );
		}
		// Request Date
		var fromField = objOfCreateNewFilter.down( 'container[itemId=requestDateFilter] label[itemId="requestDateFilterFrom"]' );
		var toField = objOfCreateNewFilter.down( 'container[itemId=requestDateFilter] label[itemId="requestDateFilterTo"]' );
		var requestFromDate = ( !Ext.isEmpty( fromField.text ) ) ? ( fromField.text.substring( 0, fromField.text.length - 3 ) )
			: objOfCreateNewFilter.down( 'container[itemId=requestDateFilter] datefield[itemId="requestFromDateFilter"]' )
				.getValue();
		var requestToDate = ( !Ext.isEmpty( toField.text ) ) ? toField.text : objOfCreateNewFilter.down(
			'container[itemId=requestDateFilter] datefield[itemId="requestToDateFilter"]' ).getValue();
		if( !Ext.isEmpty( requestFromDate ) )
		{
			jsonArray.push(
			{
				field : 'requestDate',
				operator : ( !Ext.isEmpty( requestToDate ) ) ? 'bt' : 'eq',
				value1 : Ext.util.Format.date( requestFromDate, 'Y-m-d' ),
				value2 : ( !Ext.isEmpty( requestToDate ) ) ? Ext.util.Format.date( requestToDate, 'Y-m-d' ) : '',
				dataType : 1,
				displayType : 5
			} );
		}

		// Instruction Date
		var fromEffective = objOfCreateNewFilter
			.down( 'container[itemId=instrctionDateFilter] label[itemId="instrctionDateFilterFrom"]' );
		var toEffective = objOfCreateNewFilter
			.down( 'container[itemId=instrctionDateFilter] label[itemId="instrctionDateFilterTo"]' );

		var effectiveFromDate = ( !Ext.isEmpty( fromEffective.text ) ) ? ( fromEffective.text.substring( 0,
			fromEffective.text.length - 3 ) ) : objOfCreateNewFilter.down(
			'container[itemId=instrctionDateFilter] datefield[itemId="instrctionFromDateFilter"]' ).getValue();
		var effectiveToDate = ( !Ext.isEmpty( toEffective.text ) ) ? toEffective.text : objOfCreateNewFilter.down(
			'container[itemId=instrctionDateFilter] datefield[itemId="instrctionToDateFilter"]' ).getValue();
		if( !Ext.isEmpty( effectiveFromDate ) )
		{
			jsonArray.push(
			{
				field : 'scheduledDate',
				operator : ( !Ext.isEmpty( effectiveToDate ) ) ? 'bt' : 'eq',
				value1 : Ext.util.Format.date( effectiveFromDate, 'Y-m-d' ),
				value2 : ( !Ext.isEmpty( effectiveToDate ) ) ? Ext.util.Format.date( effectiveToDate, 'Y-m-d' ) : '',
				dataType : 1,
				displayType : 5
			} );
		}

		objJson = jsonArray;
		return objJson;
	},
	resetAllFields : function( objCreateNewFilterPanel )
	{

		objCreateNewFilterPanel.down( 'textfield[itemId="requestReference"]' ).reset();
		objCreateNewFilterPanel.down( 'AutoCompleter[itemId="fundName"]' ).reset();
		objCreateNewFilterPanel.down( 'AutoCompleter[itemId="investmentAccNmbr"]' ).reset();
		objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).reset();
		objCreateNewFilterPanel.down( 'combobox[itemId="requestStatus"]' ).reset();
		objCreateNewFilterPanel.down( 'combobox[itemId="investmentType"]' ).reset();
	},
	enableDisableFields : function( objCreateNewFilterPanel, boolVal )
	{
		objCreateNewFilterPanel.down( 'textfield[itemId="requestReference"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'AutoCompleter[itemId="fundName"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'AutoCompleter[itemId="investmentAccNmbr"]' ).setDisabled( boolVal );

		objCreateNewFilterPanel.down( 'combobox[itemId="requestStatus"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'combobox[itemId="investmentType"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).setDisabled( boolVal );
	},
	removeReadOnly : function( objCreateNewFilterPanel, boolVal )
	{
		objCreateNewFilterPanel.down( 'textfield[itemId="requestReference"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'AutoCompleter[itemId="fundName"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'AutoCompleter[itemId="investmentAccNmbr"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'combobox[itemId="requestStatus"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'combobox[itemId="investmentType"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).setReadOnly( boolVal );
	}
} );
