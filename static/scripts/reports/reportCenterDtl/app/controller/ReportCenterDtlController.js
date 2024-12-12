/**
 * @class ReportCenterDtlController
 * @extends Ext.app.Controller
 * @author Vaidehi
 */
Ext
	.define(
		'GCP.controller.ReportCenterDtlController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'GCP.view.ReportCenterDtlGridView','Ext.ux.gcp.SmartGridPager', 'GCP.view.HistoryPopup', 'GCP.view.ReportCenterDtlFilterView'
			],
			views :
			[
				'GCP.view.ReportCenterDtlView'
			],
			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[
				{
					ref : 'reportCenterDtlView',
					selector : 'reportCenterDtlView'
				},
				{
					ref : 'reportCenterDtlGridRef',
					selector : 'reportCenterDtlView reportCenterPopupGridView grid[itemId="gridScheduleItemId"]'
				},
				{
					ref : 'reportCenterDtlGridViewRef',
					selector : 'reportCenterDtlView reportCenterPopupGridView panel[itemId="reportCenterDtlPopupGridView"]'
				},
				{
					ref : 'actionBarSummDtl',
					selector : 'reportCenterDtlView reportCenterPopupGridView reportCenterDtlGroupActionBarView'
				},
				{
					ref : 'reportCenterDtlFilterView',
					selector : 'reportCenterDtlView reportCenterDtlFilterView'
				},
			],
			config :
			{
				selectedReportCenterSchedule : 'reportCenterSchedule',
				scheduleFilterData : [],
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
						'reportCenterDtlView' :
						{
							beforerender : function( panel, opts )
							{
							},
							afterrender : function( panel, opts )
							{
							}
						},
						'reportCenterPopupGridView' :
						{
							render : function( panel )
							{
								me.handleScheduleSmartGridConfig();
							}
						},
						'reportCenterPopupGridView smartgrid' :
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
						'reportCenterDtlView reportCenterPopupGridView toolbar[itemId=reportCenterDtlGroupActionBarView_summDtl]' :
						{
							performGroupScheduleAction : function( btn, opts,record )
							{
								me.handleScheduleGroupActions( btn, record );
							}
						},
						'reportCenterDtlView' : {				
							'btnView' : me.viewScheduleReport,
							'btnHistory' : me.showHistory
						},
						'reportCenterDtlView reportCenterDtlFilterView combo[itemId="statusFilter"]' :
						{
							'select' : function(combo, selectedRecords) {
								combo.isQuickStatusFieldChange = true;
							},
							'blur' : function(combo, record) {
								if (combo.isQuickStatusFieldChange) {
									me.applySeekFilter();
								}
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
					strUrl = "addScheduleDefination.srvc";
					
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schSrcId', record.get( 'reportCode' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schSrcName', record.get( 'reportName' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schSecurityProfileName', record.get( 'securityProfile' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schSecurityProfileID', record.get( 'SecurityProfileId' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schDelInfo', record.get( 'delInfo' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schDelMedium', /*record.get( 'medium' )*/'SMTP' ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schModuleCode', record.get( 'moduleCode' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schSrcType', record.get( 'srcType' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schEntityCode', record.get( 'entityCode' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'sellerId', record.get( 'sellerId' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'identifier', record
							.get( 'identifier' ) ) );
					form
						.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'version', 0 ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'recordKeyNo', record
						.get( 'recordKeyNo' ) ) );
				}
				else if( str == 'View' )
				{
					strUrl = "viewScheduleReport.srvc";
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'identifier', record.get( 'identifier' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'version', record.get( 'version' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'recordKeyNo', record.get( 'recordKeyNo' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schEntityType', entityType == '1' || entityType == "CLIENT" ? "CLIENT" : "ADMIN"));
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schChannel', channelName));
				}
				else if( str == 'Edit' )
				{
					strUrl = "editScheduleReport.srvc";
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'identifier', record
						.get( 'identifier' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'version', record
						.get( 'version' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'recordKeyNo', record
						.get( 'recordKeyNo' ) ) );
					
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
				strRetValue = value;
				meta.tdAttr = 'title="' + (value) + '"';
				return strRetValue;
			},
			handleScheduleSmartGridConfig : function( record )
			{
				var me = this;
				me.scheduleFilterData = me.getScheduleQuickFilterQueryJson(record);
				var scheduleGrid = me.getReportCenterDtlGridRef();
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
				var arrColsPref = null;
				var storeModel = null;
				objWidthMap =
				{
					"scheduleTypeDesc" : 110,
					"schDelOutput" : 85,
					//"schDelMedium" : 100,
					"formatSchNextGenDate" : 170,
					"schDelInfo" : 110,
					"requestStateDesc" : 80,
					"scheduleName" : 145,
					"scheduleStatus" : 170
				};
				arrColsPref =
				[
					{
						"colId" : "scheduleName",
						"colDesc" : getLabel("schName","Schedule Name"),
						"draggable":false,
						"sortable":true,
						"hideable":false,
						"menuDisabled":true
					},
					{
						"colId" : "scheduleTypeDesc",
						"colDesc" : getLabel("frequency","Frequency"),
						"draggable":false,
						"sortable":true,
						"hideable":false,
						"menuDisabled":true
					},
					{
						"colId" : "schDelOutput",
						"colDesc" : getLabel("fileformat","File Format"),
						"draggable":false,
						"sortable":true,
						"hideable":false,
						"menuDisabled":true
					},
					/*{
						"colId" : "schDelMedium",
						"colDesc" : "Delivery",
						"draggable":false,
						"sortable":true,
						"hideable":false,
						"menuDisabled":true
					},*/
					{
						"colId" : "formatSchNextGenDate",
						"colDesc" : getLabel("nextgendate","Next Generation On"),
						"draggable":false,
						"sortable":true,
						"hideable":false,
						"menuDisabled":true
					},
					{
						"colId" : "schDelInfo",
						"colDesc" : getLabel("emailId","Email Id"),
						"draggable":false,
						"sortable":true,
						"hideable":false,
						"menuDisabled":true
					},
					{
						"colId" : "requestStateDesc",
						"colDesc" : getLabel("status","Status"),
						"draggable":false,
						"sortable":false,
						"hideable":false,
						"menuDisabled":true
					},
					{
						"colId" : "scheduleStatus",
						"colDesc" : getLabel("scheduleStatus","Schedule Status"),
						"draggable":false,
						"sortable":false,
						"hideable":false,
						"menuDisabled":true
					}
				];

				storeModel =
				{
					fields :
					[
						'repDescription', 'schDelMedium', 'frequency', 'schNextGenDate','formatSchNextGenDate', 'requestState', 'identifier', 'version',
						'recordKeyNo', 'requestStateDesc', 'scheduleTypeDesc', '__metadata','schDelOutput','schDelInfo','scheduleName', 'scheduleStatus'
					],
					proxyUrl : 'getScheduledReportsList.srvc',
					rootNode : 'd.reportCenter',
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
			getScheduleColumns : function( arrColsPref, objWidthMap )
			{
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				//arrCols.push( me.createScheduleGroupActionColumn() );
				arrCols.push( me.createScheduleActionColumn() );
				if( !Ext.isEmpty( arrColsPref ) )
				{
					for( var i = 0 ; i < arrColsPref.length ; i++ )
					{
						objCol = arrColsPref[ i ];
						cfgCol = {};
						cfgCol.colHeader = objCol.colDesc;
						cfgCol.colId = objCol.colId;
						cfgCol.draggable=objCol.draggable;
						cfgCol.sortable=objCol.sortable;
						cfgCol.hideable=objCol.hideable;
						cfgCol.menuDisabled=objCol.menuDisabled;
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
			/*createScheduleActionColumn : function()
			{
				var me = this;
				var objActionCol =
				{
					colType : 'action',
					colId : 'scheduleActionId',
					width : 30,
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
			},*/
			createScheduleActionColumn : function() {
				var me = this;
				var colItems = [
					{
						itemId : 'btnEdit',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : getLabel('editToolTip', 'Edit Record'),
						itemLabel : getLabel('editToolTip', 'Edit Record'),
						maskPosition : 8,
						fnClickHandler : function( tableView, rowIndex, columnIndex, btn, event, record ){
							me.submitRequest( 'Edit', record );
						}
					},
					{
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : getLabel('viewToolTip', 'View Record'),
						itemLabel : getLabel('viewToolTip', 'View Record'),
						fnClickHandler : function( tableView, rowIndex, columnIndex, btn, event, record ){
							me.viewScheduleReport( record );
						},
						maskPosition : 7
					},
					{
						itemId : 'btnHistory',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : getLabel('viewHistory', 'View History'),
						itemLabel : getLabel('viewHistory', 'View History'),
						maskPosition : 9,
						fnClickHandler : function( tableView, rowIndex, columnIndex, btn, event, record ){
								me.showHistory( record );
						}
					},
					{
						itemId : 'btnApprove',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : getLabel( 'acceptToolTip', 'Approve Record' ),
						itemLabel : getLabel( 'acceptToolTip', 'Approve Record' ),
						maskPosition : 2,
						fnClickHandler : function( tableView, rowIndex, columnIndex, btn, event, record ){
							me.handleScheduleGridRowActions( 'accept' ,record);	
						}
					},
					{
						itemId : 'btnReject',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : getLabel( 'rejectToolTip', 'Reject Record' ),
						itemLabel : getLabel( 'rejectToolTip', 'Reject Record' ),
						maskPosition : 3,
						fnClickHandler : function( tableView, rowIndex, columnIndex, btn, event, record ){
							me.handleScheduleGridRowActions( 'reject' ,record);
						}
					}
				];
				
				var arrRowActions = [];
				var objActionCol = {
					colId : 'actioncontent',
					colType : 'actioncontent',
					colHeader : 'Actions',
					width : 108,
					locked : true,
					lockable : false,
					sortable : false,
					hideable : false,
					resizable : false,
					items : arrRowActions.concat(colItems || []),
					visibleRowActionCount : 1
				};
				return objActionCol;
			},
			handleScheduleSmartGridLoading : function( arrCols, storeModel, record )
			{
				var me = this;
				var pgSize = null;
				var reportCenterScheduleGrid = null;
				pgSize = 5;
				var reportCenterScheduleGrid = Ext.getCmp( 'gridScheduleItemId' );
		
				if( typeof reportCenterScheduleGrid == 'undefined' )
				{
					reportCenterScheduleGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
					{
						id : 'gridScheduleItemId',
						itemId : 'gridScheduleItemId',
						height : 'auto',
						pageSize : pgSize,
						autoDestroy : true,
						stateful : false,
						showEmptyRow : false,
						showSummaryRow : false,
						enableColumnAutoWidth : _blnGridAutoColumnWidth,
						hideRowNumbererColumn : true,
						enableColumnHeaderMenu : false,
						padding : '0 10 10 10',
						rowList :
						[
							5, 10, 15, 20, 25, 30
						],
						maxHeight:400,
						checkBoxColumnWidth:_GridCheckBoxWidth,
						columnModel : arrCols,
						storeModel : storeModel,
						isRowIconVisible : me.isRowIconVisibleSchedule,
						handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
						{
							me.handleRowIconClickSchedule( tableView, rowIndex, columnIndex, btn, event, record );
						}
					} );
					reportCenterScheduleGrid.view.refresh();
					
					var reportCenterDtlView = me.getReportCenterDtlGridViewRef();
					reportCenterDtlView.add( reportCenterScheduleGrid );
					reportCenterDtlView.doLayout();
				}

				//me.handleScheduleLoadGridData( bankScheduleScheduleGrid, 1, 1,record );
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
							var objArray = arrId.split(',');
							if(objArray.length > 0)
							{
								strTemp = strTemp + '(';
								for( var count = 0 ; count < objArray.length ; count++ )
								{
									strTemp = strTemp + filterData[ index ].paramName + ' eq ' + '\'' + objArray[ count ]
										+ '\'';
									if( count != objArray.length - 1 )
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
				var isPending = true;
				
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
						paramValue1 : entityType == '0' ? 'BANK' : 'CLIENT',
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
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
					jsonArray.push(
					{
						paramName : 'srcType',
						paramValue1 : sourceType,
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}

				var reportCenterDtlView = me.getReportCenterDtlView();
				
				var statusFltId = reportCenterDtlView
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
										operatorValue : 'in',
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
										operatorValue : 'in',
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
				var grid = this.getReportCenterDtlGridRef();
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
								buttonText: {
						            ok: getLabel('btnOk', 'OK')
									},
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
				if( actionName === 'btnView' )
				{
					me.submitRequest( 'View', record );
				}
				if( actionName === 'btnEdit' )
				{
					me.submitRequest( 'Edit', record );
				}
			},
			handleScheduleGridRowActions : function( actionName, record )
			{
				var me = this;
				var strUrl = Ext.String.format( 'reportCenterScheduleList/{1}.srvc?', me.selectedReportCenterSchedule, actionName );
				if( actionName === 'reject' )
				{
					this.showRejectVerifyPopUp( actionName, strUrl, record );
				}
				else
				{
					this.preHandleScheduleGroupActions( strUrl, '', record );
				}
			},
			handleScheduleGroupActions : function( btn, record )
			{
				var me = this;
				var strAction = !Ext.isEmpty( btn.actionName ) ? btn.actionName : btn.itemId;
				var strUrl = Ext.String.format( 'reportCenterScheduleList/{1}.srvc?', me.selectedReportCenterSchedule, strAction );
				if( strAction === 'reject' )
				{
					this.showRejectVerifyPopUp( strAction, strUrl, record );
				}
				else
				{
					this.preHandleScheduleGroupActions( strUrl, '', record );
				}
			},
			
			viewScheduleReport : function( record ){
				var me = this;
				me.submitRequest( 'View', record );
			},
			
			showHistory : function( record ){
				var me = this;
				//me.submitRequest( 'View', record );
				Ext.create('GCP.view.HistoryPopup', {
					//historyUrl : url+'?'+csrfTokenName+'='+csrfTokenValue,
					historyUrl:"history.srvc",
					identifier : record.get('identifier')
				}).show();
				Ext.getCmp('btnSchRptHistoryPopupClose').focus();
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
				var grid = me.getReportCenterDtlGridRef();
				grid.refreshData();
			},
			applySeekFilter : function() {
				var me = this;
				var grid = me.getReportCenterDtlGridRef();
				me.setDataForFilter();
				me.applyFilter();
			},
			setDataForFilter : function() {
				var me = this;
				me.scheduleFilterData = me.getScheduleQuickFilterQueryJson();
			},

		} );
