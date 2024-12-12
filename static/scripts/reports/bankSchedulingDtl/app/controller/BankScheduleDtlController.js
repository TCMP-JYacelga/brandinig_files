/**
 * @class BankScheduleDtlController
 * @extends Ext.app.Controller
 * @author Vaidehi
 */
Ext
	.define(
		'GCP.controller.BankScheduleDtlController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'GCP.view.BankScheduleDtlGridView'
			],
			views :
			[
				'GCP.view.BankScheduleDtlView','GCP.view.HistoryPopup'
			],
			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[
				{
					ref : 'bankScheduleDtlView',
					selector : 'bankScheduleDtlView'
				},
				{
					ref : 'bankScheduleDtlGridRef',
					selector : 'bankScheduleDtlView bankSchedulePopupGridView grid[itemId="gridScheduleItemId"]'
				},
				{
					ref : 'bankScheduleDtlGridViewRef',
					selector : 'bankScheduleDtlView bankSchedulePopupGridView panel[itemId="bankScheduleDtlPopupGridView"]'
				},
				{
					ref : 'actionBarSummDtl',
					selector : 'bankScheduleDtlView bankSchedulePopupGridView bankScheduleDtlGroupActionBarView'
				},

				{
					ref : 'bankScheduleDtlFilterView',
					selector : 'bankScheduleDtlView bankScheduleDtlFilterView'
				},
			],
			config :
			{
				selectedReportCenterSchedule : 'reportCenterSchedule',
				scheduleFilterData : []
				
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
				me
					.control(
					{
						'bankScheduleDtlView' :
						{
							beforerender : function( panel, opts )
							{
							},
							afterrender : function( panel, opts )
							{
							}
						},
						'bankSchedulePopupGridView' :
						{
							render : function( panel )
							{
								me.handleScheduleSmartGridConfig();
							}
						},
						'bankSchedulePopupGridView smartgrid' :
						{
							render : function( grid )
							{
								me.handleScheduleLoadGridData( grid, grid.store.dataUrl, grid.pageSize, 1, 1, null );
							},
							gridPageChange : me.handleScheduleLoadGridData,
							gridSortChange : me.handleScheduleLoadGridData,
							gridRowSelectionChange : function( grid, record, recordIndex, records, jsonData )
							{
								me.enableValidActionsForScheduleGrid( grid, record, recordIndex, records, jsonData );
							}
						},
						'bankScheduleDtlView bankSchedulePopupGridView toolbar[itemId=bankScheduleDtlGroupActionBarView_summDtl]' :
						{
							performGroupScheduleAction : function( btn, opts ,record)
							{
								me.handleScheduleGroupActions( btn, record );
							}
						},
						'bankScheduleDtlView bankScheduleDtlFilterView button[itemId="btnFilter"]' :
						{
							click : function( btn, opts )
							{
								me.applySeekFilter();
							}
						}
						
					} );
			},

			submitRequest : function( str, record )
			{
				var me = this;
				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				
				if( str == 'addSchedule' )
				{
					strUrl = "addBankScheduleDefination.srvc";

					form.appendChild( me
						.createFormField( 'INPUT', 'HIDDEN', 'schSrcId', record.get( 'reportCode' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schSrcName', record
						.get( 'reportName' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schSecurityProfileName', record
						.get( 'securityProfile' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schSecurityProfileID', record
						.get( 'SecurityProfileId' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schDelInfo', record.get( 'delInfo' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schDelMedium', record.get( 'medium' ) ) );
					form.appendChild( me
						.createFormField( 'INPUT', 'HIDDEN', 'schModuleCode', record.get( 'moduleCode' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schSrcType', record
						.get( 'srcType' ) ) );
					form.appendChild( me
						.createFormField( 'INPUT', 'HIDDEN', 'schEntityCode', record.get( 'entityCode' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'sellerId', record.get( 'sellerId' ) ) );
					form
						.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'identifier', record.get( 'identifier' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'version', 0 ) );
					form.appendChild( me
						.createFormField( 'INPUT', 'HIDDEN', 'recordKeyNo', record.get( 'recordKeyNo' ) ) );
				}
				else if( str == 'View' )
				{
					strUrl = "viewBankScheduleDefination.srvc";
					form
						.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'identifier', record.get( 'identifier' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'version', record.get( 'version' ) ) );
					form.appendChild( me
						.createFormField( 'INPUT', 'HIDDEN', 'recordKeyNo', record.get( 'recordKeyNo' ) ) );
					form.appendChild(me.createFormField('INPUT', 'HIDDEN', 
							'schEntityType', entityType));
					form.appendChild(me.createFormField('INPUT', 'HIDDEN', 
							'schChannel', channelName));

				}
				else if( str == 'Edit' )
				{
					strUrl = "editBankScheduleDefination.srvc";
					form
						.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'identifier', record.get( 'identifier' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'version', record.get( 'version' ) ) );
					form.appendChild( me
						.createFormField( 'INPUT', 'HIDDEN', 'recordKeyNo', record.get( 'recordKeyNo' ) ) );
					form.appendChild(me.createFormField('INPUT', 'HIDDEN', 
							'schEntityType', entityType));
					form.appendChild(me.createFormField('INPUT', 'HIDDEN', 
							'schChannel', channelName));
					

				}

				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue ) );
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
			columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
			{
				var strRetValue = "";
				if(colId == 'col_schFreqBasis')
				{
					strRetValue = getScheduleLabel('freqtype.'+record.data.schFreqBasis, record.data.schFreqBasis);
				}
				else
				{
					strRetValue = value;
				}
				return strRetValue;
			},
			handleScheduleSmartGridConfig : function( record )
			{
				var me = this;
				me.scheduleFilterData = me.getScheduleQuickFilterQueryJson(record);
				var scheduleGrid = me.getBankScheduleDtlGridRef();
				var objConfigMap = me.getScheduleConfiguration();
				var arrCols = new Array();
				arrCols = me.getScheduleColumns( objConfigMap.arrColsPref, objConfigMap.objWidthMap );
				if( !Ext.isEmpty( scheduleGrid ) )
					scheduleGrid.destroy( true );
				me.handleScheduleSmartGridLoading( arrCols, objConfigMap.storeModel, record );
			},
			getScheduleConfiguration : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var objWidthMapUpload = null;
				var arrColsPref = null;
				var arrColsUploadPref = null;
				var storeModel = null;

				objWidthMap =
				{
					"scheduleTypeDesc" : "10%",
					"schDelOutput" : "10%",
					//"schDelMedium" : "10%",
					"formatSchNextGenDate" : "15%",
					"schDelInfo" : "10%",					
					"requestStateDesc" : "15%",
					"schFreqBasis" : "14.9%",
					"scheduleName" : "20%",
					"scheduleStatus" : "15%"
				};				
				arrColsPref =
				[
					{
						"colId" : "scheduleName",
						"colDesc" : getLabel("scheduleName","Schedule Name")
					},
					{
						"colId" : "scheduleTypeDesc",
						"colDesc" : getLabel("frequency","Frequency")
					},
					{
						"colId" : "schDelOutput",
						"colDesc" : getLabel("fileFormat","File Format")
					},
					/*{
						"colId" : "schDelMedium",
						"colDesc" : getLabel("lbl.jobMonitoring.medium","Medium")
					},*/
					{
						"colId" : "formatSchNextGenDate",
						"colDesc" : getLabel("nextGenerationOn","Next Generation On")
					},
					{
						"colId" : "schDelInfo",
						"colDesc" : getLabel("mediaInfo","Email Id")
					},
					{
						"colId" : "schFreqBasis",
						"colDesc" : getLabel("frequencyType","Frequency Type")
					},
					{
						"colId" : "requestStateDesc",
						"colDesc" : getLabel("status","Status")
					},
					{
						"colId" : "scheduleStatus",
						"colDesc" : getLabel("scheduleStatus","Schedule Status")
					}
				];
				if (showValueDate == 'true') {
					arrColsPref =
						[
							{
								"colId" : "scheduleTypeDesc",
								"colDesc" :getLabel("frequency", "Frequency")
							},
							{
								"colId" : "schDelOutput",
								"colDesc" :getLabel("fileFormat","File Format")
							},
							/*{
								"colId" : "schDelMedium",
								"colDesc" : getLabel("lbl.jobMonitoring.medium","Medium")
							},*/
							{
								"colId" : "formatSchNextGenDate",
								"colDesc" :getLabel("nextGenerationOn","Next Generation On")
							},
							{
								"colId" : "formatSchValueDate",
								"colDesc" : getLabel("valueDate","Value Date")
							},
							{
								"colId" : "schDelInfo",
								"colDesc" : getLabel("mediaInfo","Email Id")
							},
							{
								"colId" : "schFreqBasis",
								"colDesc" :getLabel("frequencyType","Frequency Type")
							},
							{
								"colId" : "requestStateDesc",
								"colDesc" : getLabel("status","Status")
							},
							{
								"colId" : "scheduleStatus",
								"colDesc" : getLabel("scheduleStatus","Schedule Status")
							},
							{
								"colId" : "bankSubsidiaryId",
								"colDesc" : getLabel("bankSubsidiaryId","Bank Subsidiary Id")
							}
						];
				}
				arrColsUploadPref =
					[
						{
						"colId" : "scheduleName",
						"colDesc" : getLabel("scheduleName","Schedule Name")
						},
						{
							"colId" : "scheduleTypeDesc",
							"colDesc" : getLabel("frequency", "Frequency")
						},
						{
							"colId" : "schDelOutput",
							"colDesc" : getLabel("fileFormat","File Format")
						},
						/*{
							"colId" : "schDelMedium",
							"colDesc" :getLabel("lbl.jobMonitoring.medium","Medium")
						},*/
						{
							"colId" : "formatSchNextGenDate",
							"colDesc" :getLabel("nextGenerationOn","Next Generation On")
						},
						{
							"colId" : "schDelInfo",
							"colDesc" : getLabel("mediaInfo","Email Id")
						},
						{
							"colId" : "maxThreadCount",
							"colDesc" : getLabel("maxThreadCount","Max Thread Count")
						},
						{
							"colId" : "requestStateDesc",
							"colDesc" :getLabel("status", "Status")
						},
						{
							"colId" : "scheduleStatus",
							"colDesc" : getLabel("scheduleStatus","Schedule Status")
						}
					];

				storeModel =
				{
					fields :
					[
						'repDescription', 'schDelMedium', 'frequency', 'schNextGenDate', 'formatSchNextGenDate',
						'requestState', 'history', 'identifier', 'version', 'recordKeyNo', 'requestStateDesc', 'scheduleTypeDesc',
						'__metadata', 'schDelOutput','schDelInfo','maxThreadCount','schFreqBasis','scheduleName','formatSchValueDate','bankSubsidiaryId', 'scheduleStatus'
					],
					proxyUrl : 'getBankScheduledList.srvc',
					rootNode : 'd.reportCenter',
					totalRowsNode : 'd.__count'
				};

				objConfigMap =
				{
					"objWidthMap" : objWidthMap,
					"arrColsPref" : (sourceType == 'U' ? arrColsUploadPref : arrColsPref),
					"storeModel" : storeModel
				};
				return objConfigMap;
			},
			getScheduleColumns : function( arrColsPref, objWidthMap )
			{
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				arrCols.push( me.createScheduleGroupActionColumn() );
				arrCols.push( me.createScheduleActionColumn() );
				if( !Ext.isEmpty( arrColsPref ) )
				{
					for( var i = 0 ; i < arrColsPref.length ; i++ )
					{
						objCol = arrColsPref[ i ];
						cfgCol = {};
						cfgCol.colHeader = objCol.colDesc;
						cfgCol.colId = objCol.colId;
						// sorting disabled for schFreqBasis as per DHTTPRODMT-101
						if( objCol.colId == 'schFreqBasis' )
						{
							cfgCol.sortable = false;
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
			createScheduleActionColumn : function()
			{
				var me = this;
				var objActionCol =
				{
					colType : 'actioncontent',
					colId : 'scheduleActionId',
					width : 85,
					align : 'left',
					locked : true,
					lockable : false,
					sortable: false,
					hideable : false,
					resizable : false,
					draggable : false,
					items :
					[
						{
							itemId : 'btnView',
							itemCls : 'grid-row-action-icon icon-view',
							toolTip : getLabel( 'viewToolTip', 'View Record' ),
							itemLabel : getLabel('viewToolTip','View Record'),
							maskPosition : 7
						},
						{
							itemId : 'btnEdit',
							itemCls : 'grid-row-action-icon icon-edit',
							toolTip : getLabel( 'editToolTip', 'Edit Record' ),
							itemLabel : getLabel('edit','Edit'),
							maskPosition : 8
						},
						{
							itemId : 'btnHistory',
							itemCls : 'grid-row-action-icon icon-history',
							toolTip : getLabel( 'historyToolTip', 'View History' ),
							itemLabel : getLabel('historyToolTip','View History'),
							maskPosition : 9
						}
					]

				};
				return objActionCol;
			},
			handleScheduleSmartGridLoading : function( arrCols, storeModel, record )
			{
				var me = this;
				var pgSize = null;
				var bankScheduleScheduleGrid = null;
				pgSize = 5;
				var bankScheduleScheduleGrid = Ext.getCmp( 'gridScheduleItemId' );
		
				if( typeof bankScheduleScheduleGrid == 'undefined' )
				{
					bankScheduleScheduleGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
					{
						id : 'gridScheduleItemId',
						itemId : 'gridScheduleItemId',					
						pageSize : pgSize,
						autoDestroy : true,
						stateful : false,
						showEmptyRow : true,
						showSummaryRow : false,
						hideRowNumbererColumn : true,
						padding : '0 10 10 10',
						rowList :
						[
							5, 10, 15, 20, 25, 30
						],
						minHeight : 0,
						columnModel : arrCols,
						storeModel : storeModel,
						isRowIconVisible : me.isRowIconVisibleSchedule,
						isRowMoreMenuVisible : me.isRowMoreMenuVisible,
						handleRowMoreMenuClick : me.handleRowMoreMenuClick,
						handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
						{
							me.handleRowIconClickSchedule( tableView, rowIndex, columnIndex, btn, event, record );
						},
						handleMoreMenuItemClick : function(grid, rowIndex,
								 cellIndex, menu, event, record) {
							 var dataParams = menu.dataParams;
								 me.handleRowIconClickSchedule(dataParams.view,
									 dataParams.rowIndex, dataParams.columnIndex,
									 menu, null, dataParams.record);
						}
					} );
					bankScheduleScheduleGrid.view.refresh();
					
					var bankScheduleDtlView = me.getBankScheduleDtlGridViewRef();
					bankScheduleDtlView.add( bankScheduleScheduleGrid );
					bankScheduleDtlView.doLayout();
				}
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
			handleScheduleLoadGridData : function( grid, url, pgSize, newPgNo, oldPgNo, sorter )
			{
				var me = this;
				var store = grid.store;
				var strQuickFilterUrl = me.generateUrlWithQuickFilterParams( me.scheduleFilterData );
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );
				strUrl +=strQuickFilterUrl+ '&' + csrfTokenName + "=" + csrfTokenValue;
				grid.loadGridData( strUrl, null );
			},
			generateUrlWithQuickFilterParams : function( urlFilterData )
			{
				var filterData = urlFilterData;
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
						case 'in':
							var arrId = filterData[ index ].paramValue1;
							if( 0 != arrId.length )
							{
								strTemp = strTemp + '(';
								for( var count = 0 ; count < arrId.length ; count++ )
								{
									strTemp = strTemp + filterData[ index ].paramName + ' eq ' + '\'' + arrId[ count ]
										+ '\'';
									if( count != arrId.length - 1 )
									{
										strTemp = strTemp + ' or ';
									}
								}
								strTemp = strTemp + ' ) ';
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
			getScheduleQuickFilterQueryJson : function(record)
			{
				var me = this;
				var jsonArray = [];
				var statusVal = null;
			    var seller=$("#sellerId").val();
			    var isPending = true;
		        if (seller != null && seller != "undefined") {
                   jsonArray.push({
                          paramName: "seller",
                          paramValue1: seller,
                          operatorValue: "eq",
                          dataType: "S"
                    })
                  }
				if( sourceId != null && sourceId != 'undefined' )
				{
					jsonArray.push(
						{
							paramName : 'srcId',
							paramValue1 : sourceId,
							operatorValue : 'eq',
							dataType : 'S'
						} );
				}
				if( entityType != null && entityType != 'undefined' )
				{
					jsonArray.push(
					{
						paramName : 'entityType',
						paramValue1 : schentityType,
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				// Schdule list not visible on another User List
				if( entityCode != null && entityCode != 'undefined' )
				{
					jsonArray.push(
					{
						paramName : 'entityCode',
						paramValue1 : entityCode,
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				
				if( sourceType != null && sourceType != 'undefined' )
				{
					if(segmentationEnabled =='true')
					{
						jsonArray.push(
						{
							paramName : 'srcType',
							paramValue1 : 'SCH_SEGMENTED',
							operatorValue : 'eq',
							dataType : 'S'
						} );
					}
					else
					{
						jsonArray.push(
						{
							paramName : 'srcType',
							paramValue1 : sourceType,
							operatorValue : 'eq',
							dataType : 'S'
						} );
					}
				}
				
				var bankScheduleDtlFilterView = me.getBankScheduleDtlFilterView();
				
				var statusFltId = bankScheduleDtlFilterView
						.down('combobox[itemId=statusFilter]');
				
				if (!Ext.isEmpty(statusFltId)
						&& !Ext.isEmpty(statusFltId.getValue())
						&& ('all' != (statusFltId.getValue()).toLowerCase())) {
					statusVal = statusFltId.getValue();
				}
		 
		    if (!Ext.isEmpty(statusVal)) {
					if(statusVal == 13)
					{
					    statusVal  = new Array('5YN','4NN','0NY','1YY');
						isPending = false;
						jsonArray.push({
									paramName : 'statusFilter',
									paramValue1 : statusVal,
									operatorValue : 'in',
									dataType : 'S'
								} );
						jsonArray.push({
									paramName : 'user',
									paramValue1 :encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
									operatorValue : 'ne',
									dataType : 'S'
								});
					}
				   if (isPending)
					{
					    if (statusVal == 12 || statusVal == 3 || statusVal == 14) {
						if (statusVal == 12 || statusVal == 14) //12:New  Submitted //14:Modified Submitted
						{
							statusVal = (statusVal == 12) ? 0:1;
							jsonArray.push({
										paramName : 'is_submitted',
										paramValue1 : 'Y',
										operatorValue : 'eq',
										dataType : 'S'
									});
							strInFlag = true;
						} else // Valid/Authorized
						{
							jsonArray.push({
										paramName : 'validFlag',
										paramValue1 : 'Y',
										operatorValue : 'eq',
										dataType : 'S'
									});
						}
					} else if (statusVal == 11) // Disabled
					{
						statusVal = 3;
						jsonArray.push({
									paramName : 'validFlag',
									paramValue1 : 'N',
									operatorValue : 'eq',
									dataType : 'S'
								});
					} else if (statusVal == 0 || statusVal == 1) // New
					// and
					// Modified
					{
						jsonArray.push({
									paramName : 'is_submitted',
									paramValue1 : 'N',
									operatorValue : 'eq',
									dataType : 'S'
								});
					}
					    jsonArray.push({
										paramName : statusFltId.name,
										paramValue1 : statusVal,
										operatorValue : 'eq',
										dataType : 'S'
											});
					}
				}
				return jsonArray;
			},
			enableValidActionsForScheduleGrid : function( grid, record, recordIndex, selectedRecords, jsonData )
			{
				var me = this;
				var buttonMask = '0000000000';
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

				actionMask = doAndOperation( maskArray, 9 );
				me.enableDisableScheduleGroupActions( actionMask, isSameUser );
			},
			enableDisableScheduleGroupActions : function( actionMask, isSameUser )
			{
				var actionBar = this.getActionBarSummDtl();
				var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
				if( !Ext.isEmpty( actionBar ) && !Ext.isEmpty( actionBar.items.items ) )
				{
					arrItems = actionBar.items.items;
					Ext.each( arrItems, function( item )
					{
						strBitMapKey = parseInt( item.maskPosition,10 ) - 1;
						if( !isNaN(strBitMapKey) )
						{
							blnEnabled = isActionEnabled( actionMask, strBitMapKey );
							if( ( item.maskPosition === 2 && blnEnabled ) )
							{

								blnEnabled = blnEnabled && isSameUser;
							}
							else if( item.maskPosition === 3 && blnEnabled )
							{
								blnEnabled = blnEnabled && isSameUser;
							}
							item.setDisabled( !blnEnabled );
						}
					} );
				}
			},
			preHandleScheduleGroupActions : function( strUrl, remark, record )
			{
				var me = this;
				var grid = this.getBankScheduleDtlGridRef();
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
							me.enableDisableScheduleGroupActions( '000', true );
							var jsonRes = Ext.JSON.decode(response.responseText);
							var errorMessage = '';
							var record = jsonRes.d.instrumentActions[0].errors;
							if( record != null && record != 'undefined' )
							{
								for(var i=0;i<record.length;i++){
								 errorMessage = errorMessage + record[i].code +' : '+ record[i].errorMessage+"<br/>";
								}
							}
							
							if('' != errorMessage && null != errorMessage)
					        {
					         //Ext.Msg.alert("Error",errorMessage);
					        	Ext.MessageBox.show({
									title : getLabel('errorTitle','Error'),
									msg : errorMessage,
									buttons : Ext.MessageBox.OK,
									cls : 'ux_popup',
									icon : Ext.MessageBox.ERROR
								});
					        }
							grid.refreshData( record );
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
			isRowIconVisibleSchedule : function( store, record, jsonData, itmId, maskPosition )
			{
				var maskSize = 9;
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

				if( ( maskPosition === 2 && retValue ) )
				{
					retValue = retValue && isSameUser;
				}
				else if( maskPosition === 3 && retValue )
				{
					retValue = retValue && isSameUser;
				}
				return retValue;

			},
			handleRowIconClickSchedule : function( tableView, rowIndex, columnIndex, btn, event, record )
			{
				var me = this;
				var actionName = btn.itemId;
				if( actionName === 'accept' || actionName === 'reject' || actionName === 'discard'
					|| actionName === 'submit' || actionName === 'clearUser' || actionName === 'resetUser' || actionName === 'disable' || actionName === 'enable')
				{
					me.handleScheduleGroupActions( btn, record );
				}
				if( actionName === 'btnView' )
				{
					me.submitRequest( 'View', record );
				}
				if( actionName === 'btnEdit' )
				{
					me.submitRequest( 'Edit', record );
				}
				if( actionName === 'btnHistory' )
				{
					var recHistory = record.get('history');
					if (!Ext.isEmpty(recHistory)
							&& !Ext.isEmpty(recHistory.__deferred.uri)) {
						me.showHistory(record.get('scheduleName'),
								record.get( 'history' ).__deferred.uri, record
										.get('identifier'));
					}
				}
			},
			showHistory : function(scheduleDesc, url, id) {
				Ext.create('GCP.view.HistoryPopup', {
							historyUrl : url +"?"+ csrfTokenName + "=" + csrfTokenValue,
							scheduleDesc : scheduleDesc,
							identifier : id
						}).show();
			},
			handleScheduleGroupActions : function( btn, record )
			{
				var me = this;
				var strAction = !Ext.isEmpty( btn.actionName ) ? btn.actionName : btn.itemId;
				var strUrl = Ext.String.format( 'bankSchScheduleList/{0}.srvc?', strAction );
				if( strAction === 'reject' )
				{
					this.showRejectVerifyPopUp( strAction, strUrl, record );
				}
				else
				{
					this.preHandleScheduleGroupActions( strUrl, '', record );
				}
				
			},
			showRejectVerifyPopUp : function( strAction, strActionUrl, record )
			{
				var me = this;
				var titleMsg = '', fieldLbl = '';
				if( strAction === 'reject' )
				{
					fieldLbl = getLabel( 'rejectRemarkPopUpTitle', 'Please Enter Reject Remark' );
					titleMsg = getLabel( 'rejectRemarkPopUpFldLbl', 'Reject Remark' );
				}
				var msgbox = Ext.Msg.show(
				{
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					multiline : 4,
					cls:'t7-popup',
					width: 355,
					height : 270,
					bodyPadding : 0,
					fn : function( btn, text )
					{
						if( btn == 'ok' )
						{
							if(Ext.isEmpty(text))
							{
								Ext.Msg.alert(getLabel( 'lblerror', 'Error' ), getLabel( 'rejectEmptyErrorMsg', 'Reject Remarks cannot be blank' ));
							}
							else
							{
								me.preHandleScheduleGroupActions(strActionUrl, text, record);
							}
						}
					}
				} );
				msgbox.textArea.enforceMaxLength = true;
				msgbox.textArea.inputEl.set({
					maxLength : 255
				});
			},
			applyFilter : function() {
				var me = this;
				var grid = me.getBankScheduleDtlGridRef();
				grid.refreshData();
			},
			applySeekFilter : function() {
				var me = this;
				var grid = me.getBankScheduleDtlGridRef();
				me.setDataForFilter();
				me.applyFilter();
			},
			setDataForFilter : function() {
				var me = this;
				me.scheduleFilterData = me.getScheduleQuickFilterQueryJson();
			},
			createScheduleGroupActionColumn :  function()
			{
				var me = this;
				var objActionCol =
				{
						colType : 'actioncontent',
						colId : 'groupaction',
						width : 150,
						locked : true,
						lockable : false,
						sortable : false,
						hideable : false,
						resizable : false,
						draggable : false,
						items: [{
									text : getLabel('prfMstActionSubmit', 'Submit'),
									itemId : 'submit',
									actionName : 'submit',
									maskPosition : 1
								},
								{
									text : getLabel('prfMstActionApprove', 'Approve'),
									itemId : 'accept',
									actionName : 'accept',
									maskPosition : 2
								},{
									text : getLabel('prfMstActionReject', 'Reject'),
									itemId : 'reject',
									actionName : 'reject',
									maskPosition : 3
								},{
									text : getLabel('prfMstActionDiscard', 'Discard'),
									itemId : 'discard',
									actionName : 'discard',
									maskPosition : 6
								},{
									text : getLabel('prfMstActionEnable', 'Enable'),
									itemId : 'enable',
									actionName : 'enable',
									maskPosition : 4
								}, {
									text : getLabel('prfMstActionDisable',	'Suspend'),
									itemId : 'disable',
									actionName : 'disable',
									maskPosition : 5
								}
								]
					};
				return objActionCol;
			},
		} );