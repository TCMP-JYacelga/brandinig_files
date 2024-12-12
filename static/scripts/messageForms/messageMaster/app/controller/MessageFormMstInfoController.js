Ext
	.define(
		'GCP.controller.MessageFormMstInfoController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'GCP.view.MessageFormMstInfoView', 'Ext.ux.gcp.DateHandler'
			],
			views :
			[
				'GCP.view.MessageFormMstMainView'
			],

			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[
				{
					ref : 'requestDateLabelRef',
					selector : 'messageFormMstInfoViewType label[itemId="requestDateLabelItemId"]'
				},
				{
					ref : 'dateRangeComponentRef',
					selector : 'messageFormMstInfoViewType container[itemId="dateRangeComponentItemId"]'
				},
				{
					ref : 'fromDateLabelRef',
					selector : 'messageFormMstInfoViewType label[itemId="dateFilterFromLabelItemId"]'
				},
				{
					ref : 'toDateLabelRef',
					selector : 'messageFormMstInfoViewType label[itemId="dateFilterToLabelItemId"]'
				},
				{
					ref : 'fromDateFieldRef',
					selector : 'messageFormMstInfoViewType datefield[itemId="fromDateFieldItemId"]'
				},
				{
					ref : 'toDateFieldRef',
					selector : 'messageFormMstInfoViewType datefield[itemId="toDateFieldItemId"]'
				},
				{
					ref : 'infoSummaryPanelView',
					selector : 'messageFormMstInfoViewType panel[itemId="infoSummaryPanelView"]'
				},
				{
					ref : 'infoSummaryMostUsedFormPanel',
					selector : 'messageFormMstInfoViewType panel[itemId="infoSummaryMostUsedFormPanel"]'
				},
				{
					ref : 'infoSummaryLeastUsedFormPanel',
					selector : 'messageFormMstInfoViewType panel[itemId="infoSummaryLeastUsedFormPanel"]'
				}

			],
			config :
			{
				dateFilterVal : '12',
				dateFilterLabel : getLabel( 'thismonth', 'This Month' ),
				dateHandler : null,
				filterData : []
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

				me
					.control(
					{
						'messageFormMstInfoViewType' :
						{
							render : function( panel, opts )
							{
								me.updateDateFilterView( me.dateFilterVal );
								var task = new Ext.util.DelayedTask( function()
								{
									me.handleSummaryLoading();
								} );
								task.delay( 3000 );
							},
							dateChange : function( btn, opts )
							{
								var me = this;
								me.dateFilterVal = btn.btnValue;
								me.dateFilterLabel = btn.text;
								me.getRequestDateLabelRef().setText( me.dateFilterLabel );

								me.updateDateFilterView( me.dateFilterVal );
								if( me.dateFilterVal != '7' )
								{
									me.handleSummaryLoading();
								}

							}
						},

						'messageFormMstInfoViewType button[itemId="goBtnItemId"]' :
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
									me.handleSummaryLoading();
								}
							}
						},

						'messageFormMstInfoViewType panel[itemId="infoHeaderBarItemId"] image[itemId="summInfoShowHideGridItemId"]' :
						{
							click : function( image )
							{
								var objMsgSummInfoBar = me.getInfoSummaryPanelView();
								if( image.hasCls( "icon_collapse_summ" ) )
								{
									image.removeCls( "icon_collapse_summ" );
									image.addCls( "icon_expand_summ" );
									objMsgSummInfoBar.hide();
								}
								else
								{
									image.removeCls( "icon_expand_summ" );
									image.addCls( "icon_collapse_summ" );
									objMsgSummInfoBar.show();
								}
							}
						}

					} );
			},

			updateDateFilterView : function( index )
			{
				var me = this;
				var dtEntryDate = null;
				if( !Ext.isEmpty( index ) )
				{
					me.handleDateChange( index );
					if( index === '7' )
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
				var objDateParams = me.getDateParam( index )

				if( index == '7' )
				{
					me.getDateRangeComponentRef().show();
					me.getFromDateLabelRef().hide();
					me.getToDateLabelRef().hide();
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
				retObj.fieldValue1 = fieldValue1;
				retObj.fieldValue2 = fieldValue2;
				retObj.operator = operator;
				return retObj;

			},

			handleSummaryLoading : function()
			{
				var me = this;
				var strUrl = 'getMessageFormCounts.srvc?';
				me.setDataForFilter();
				var strParam = me.getFilterUrl();

				Ext.Ajax.request(
				{
					url : strUrl + strParam + "&" + csrfTokenName + '=' + csrfTokenValue,
					method : "POST",
					success : function( response )
					{
						// alert("AJAX Response : " + response);
						me.loadSummaryInfo( Ext.decode( response.responseText ) );
					},
					failure : function( response )
					{
						console.log( 'Error Occured' );
					}
				} );
			},
			getFilterUrl : function()
			{
				var me = this;
				var strQuickFilterUrl = '', strUrl = '', isFilterApplied = 'false';
				strQuickFilterUrl = me.generateUrlWithQuickFilterParams( this );
				if( !Ext.isEmpty( strQuickFilterUrl ) )
				{
					strUrl += strQuickFilterUrl;
					isFilterApplied = true;
				}
				return strUrl;

			},

			setDataForFilter : function()
			{

				this.filterData = this.getQuickFilterQueryJson();
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
						paramName : 'dateRange',
						paramValue1 : objDateParams.fieldValue1,
						paramValue2 : objDateParams.fieldValue2,
						operatorValue : objDateParams.operator,
						dataType : 'D'
					} );
				}

				return jsonArray;
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
							// Default operator is eq
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

			loadSummaryInfo : function( data )
			{
				var me = this;
				var infoSummaryMostUsedForm = me.getInfoSummaryMostUsedFormPanel();
				var infoSummaryLeastUsedForm = me.getInfoSummaryLeastUsedFormPanel();

				if( infoSummaryMostUsedForm != undefined && infoSummaryMostUsedForm.items.length == 2 )
				{
					infoSummaryMostUsedForm.remove( 1 );
				}
				if( infoSummaryLeastUsedForm != undefined && infoSummaryLeastUsedForm.items.length == 2 )
				{
					infoSummaryLeastUsedForm.remove( 1 );
				}

				if( data != '' )
				{
					var summaryList = data;
					for( var i = 0 ; i < summaryList.length ; i++ )
					{
						if( summaryList[ i ].filterCode == "MostUsedForm" )
						{
							addItem =
							{
								xtype : 'label',
								html : summaryList[ i ].filterValue
							}
							infoSummaryMostUsedForm.add( addItem );
						}
						if( summaryList[ i ].filterCode == "LeastUsedForm" )
						{
							addItem =
							{
								xtype : 'label',
								html : summaryList[ i ].filterValue
							};
							infoSummaryLeastUsedForm.add( addItem );
						}
					}
				}
			}

		} );
