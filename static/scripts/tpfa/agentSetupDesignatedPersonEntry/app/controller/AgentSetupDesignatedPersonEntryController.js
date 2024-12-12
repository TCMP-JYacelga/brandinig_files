Ext
	.define(
		'GCP.controller.AgentSetupDesignatedPersonEntryController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'GCP.view.AgentSetupDesignatedPersonEntryDetailGridView'
			],
			views :
			[
				'GCP.view.AgentSetupDesignatedPersonEntryDetailGridView','GCP.view.AgentSetupDesignatedPersonEntryMainView'
			],
			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[
				{
					ref : 'agentSetupDesignatedPersonEntryMainViewRef',
					selector : 'agentSetupDesignatedPersonEntryMainViewType'
				},
				{
					ref : 'agentSetupDesignatedPersonEntryDetailGridViewRef',
					selector : 'agentSetupDesignatedPersonEntryMainViewType agentSetupDesignatedPersonEntryDetailGridViewType'
				},
				{
					ref : 'agentSetupDtlViewRef',
					selector : 'agentSetupDesignatedPersonEntryMainViewType agentSetupDesignatedPersonEntryDetailGridViewType panel[itemId="designatedPersonDtlViewItemId"]'
				},
				{
					ref : 'agentSetupDtlGridRef',
					selector : 'agentSetupDesignatedPersonEntryMainViewType agentSetupDesignatedPersonEntryDetailGridViewType grid[itemId="gridViewMstItemId"]'
				},
				{
					ref : 'agentSetupDesignatedPersonEntryDtlToolBarViewType',
					selector : 'agentSetupDesignatedPersonEntryDtlToolBarViewType'
				}				
			],
			config :
			{
				selectedRecords : null
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
				var emptyStore;				
				me.control(
				{
								
					'agentSetupDesignatedPersonEntryMainViewType' :
					{
						render : function( panel )
						{
							me.handleSmartGridConfig();
						}
					},
					'agentSetupDesignatedPersonEntryMainViewType agentSetupDesignatedPersonEntryDtlToolBarViewType' :
					{
						addNewRow : function()
						{
							console.log('[AgentDesignatedPersonApplication] : Add Person is clicked.');
							if( isUpdate )
								me.addNewRow();
						},
						deleteDetailAction : function( btn, opts )
						{
							console.log('[AgentDesignatedPersonApplication] : Delete Person is clicked.');
							if( isUpdate )
							{					
								var detailGrid = me.getAgentSetupDtlGridRef();
								
								var detailRecords = me.selectedRecords;
								var isSelectedForDelete = false;					
								if(null!= detailRecords && detailRecords.length > 0){
									isSelectedForDelete = true;
								}							
								if( !isSelectedForDelete )
								{
									Ext.Msg.show({
									       title      : 'Error',
									       width : 350,
									       msg        : getLabel('warn.interestPrf.leastOnePersonToDelete','Please select at least one person to delete.'),
									       buttons    : Ext.MessageBox.OK,		      
									       icon       : Ext.MessageBox.ERROR
									    });								
									console.log('[AgentDesignatedPersonApplication] : Please select at least one person to delete.');
									return;
								}
								me.deletePersonAndUpdateAgentMaster('updateAgentMasterSetup.srvc','frmDetail')
							}						
						}
					},						
					'agentSetupDesignatedPersonEntryDetailGridViewType smartgrid' :
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
						statechange : function( grid )
						{
							//me.toggleSavePrefrenceAction( true );
						},
						pagechange : function( pager, current, oldPageNum )
						{
							//me.toggleSavePrefrenceAction( true );
						}
					}
				
				} );
			},		
			handleSmartGridConfig : function()
			{
				var me = this;
				var agentSetupDesignatedPersonEntryGrid = me.getAgentSetupDtlGridRef();
				var objConfigMap = me.getAgentSetupDesignatedPersonEntryNewConfiguration();
				var arrCols = new Array();
				var objPref = null, arrColsPref = null, pgSize = null;
				var data;
				if( Ext.isEmpty( agentSetupDesignatedPersonEntryGrid ) )
				{
					arrCols = me.getColumns( objConfigMap.arrColsPref, objConfigMap.objWidthMap );
					pgSize = 5;
					me.handleSmartGridLoading( arrCols, objConfigMap.storeModel, pgSize );					
				}
				else
				{
					me.handleLoadGridData( grid, grid.store.dataUrl, grid.pageSize, 1, 1, null );
				}
			},			
			

			handleSmartGridLoading : function( arrCols, storeModel, pgSize )
			{
				var me = this;
				var pgSize = null;			
				pgSize = 100;
				agentSetupDesignatedPersonEntryGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'gridViewMstId',
					itemId : 'gridViewMstItemId',
					pageSize : pgSize,
					autoDestroy : true,
					stateful : false,
					showEmptyRow : false,
					hideRowNumbererColumn : true,
					showSummaryRow : false,
					padding : '5 0 0 0',
					rowList :
					[
						10, 25, 50, 100, 200, 500
					],
					minHeight : 140,
					maxHeight : 400,
					columnModel : arrCols,
					storeModel : storeModel,
					isRowIconVisible : me.isRowIconVisible,
					isRowMoreMenuVisible : me.isRowMoreMenuVisible,
					handleRowMoreMenuClick : me.handleRowMoreMenuClick,

					handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
					{
						me.handleRowIconClick( tableView, rowIndex, columnIndex, btn, event, record );
					},
			/*		handleMoreMenuItemClick : function( menu, event )
					{
						var dataParams = menu.ownerCt.dataParams;
						me.handleRowIconClick( dataParams.view, dataParams.rowIndex, dataParams.columnIndex, this,
							event, dataParams.record );
					}*/
					handleMoreMenuItemClick : function( grid, rowIndex, cellIndex,menu, event, record )
					{
						var dataParams = menu.dataParams;
						me.handleRowIconClick(dataParams.view,dataParams.rowIndex,dataParams.columnIndex,menu, null,dataParams.record);
					}
				} );

				var agentSetupDesignatedPersonEntryMainView = me.getAgentSetupDtlViewRef();			
				agentSetupDesignatedPersonEntryMainView.add( agentSetupDesignatedPersonEntryGrid );
				agentSetupDesignatedPersonEntryMainView.doLayout();
			},
			handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
			{
				var me = this;
				var actionName = btn.itemId;
				if(actionName === 'btnDelete') {
					
				}
				if( actionName === 'accept' || actionName === 'reject' || actionName === 'discard'
					|| actionName === 'enable' || actionName === 'disable' || actionName === 'submit' )
					me.handleGroupActions( btn, record );
				else if( actionName === 'btnHistory' )
				{
					var recHistory = record.get( 'history' );
					if( !Ext.isEmpty( recHistory ) && !Ext.isEmpty( recHistory.__deferred.uri ) )
					{
						me.showHistory( record.get( 'history' ).__deferred.uri, record.get( 'identifier' ) );
					}
				}
				else if( actionName === 'btnView' )
				{
					showAgentDesignatedPersonPopup( record,"VIEW" );
				}			
				else if( actionName === 'btnEdit' )
				{
					showAgentDesignatedPersonPopup( record,"EDIT" );
				}
				
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
			getAgentSetupDesignatedPersonEntryNewConfiguration : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;
				objWidthMap =
				{
						"firstNameWithTitle" : '20%',
						"surName" : '20%',
						"residentFlagDesc" : '15%',
						"landlineNumber" : '20%',
						"email" :'21.1%'					
				};
				arrColsPref = [{
					"colId" : "firstNameWithTitle",
					"colDesc" : getLabel( 'lblfirstName', 'First Name' )
					
				},{
					"colId" : "surName",
					"colDesc" : getLabel( 'lblSurname', 'Surname' )
				},
				{
					"colId" : "residentFlagDesc",
					"colDesc" : getLabel( 'lblResident', 'Resident' )
				},
				{
					"colId" : "landlineNumber",
					"colDesc" : getLabel( 'lbltelephone', 'Landline' )
				},
				{
					"colId" : "email",
					"colDesc" : getLabel( 'lblEmail', 'Email' )
				}];

				storeModel = {
						fields :
							[
									'agentCode','personType','personTitle','firstName' ,'surName','residentFlag','residentFlagDesc','landlineNumber','faxNumber','taxNumber','passportNumber','prefCommunication','mobileNumber','residentId','email','identifier', '__metadata','viewState','firstNameWithTitle'
							],
					proxyUrl : 'agentSetupDesignatedPersonList.srvc',
					rootNode : 'd.agentSetupDesignatedPersonList',
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
			callHandleLoadGridData : function()
			{
				var me = this;
				var gridObj = me.getAgreementSweepDtlGridRef();
				me.handleLoadGridData( gridObj, gridObj.store.dataUrl, gridObj.pageSize, 1, 1, null );
			},
			handleLoadGridData : function( grid, url, pgSize, newPgNo, oldPgNo, sorter )
			{
				var me = this;
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );				
				strUrl = strUrl + '&id=' + encodeURIComponent( document.getElementById( 'viewState' ).value) + '&' + csrfTokenName + "=" + csrfTokenValue;				
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
			enableValidActionsForGrid : function( grid, record, recordIndex, selectedRecords, jsonData )
			{
				var me = this;
				me.selectedRecords = selectedRecords;
			},			
			isRowIconVisible : function( store, record, jsonData, itmId, maskPosition )
			{				
				return true;
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
				
			},
			getColumns : function( arrColsPref, objWidthMap )
			{
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				//arrCols.push( me.createGroupActionColumn() );
				if(pageMode === 'ADD' || pageMode === 'EDIT')
				arrCols.push( me.createActionColumn() );  // Allow all edits
				else if (pageMode === 'EDIT')
				arrCols.push( me.createViewActionColumn() );	
				else if(pageMode === 'VIEW')
				arrCols.push( me.createViewActionColumn() );
				else if(requestState != '0' && interAccountPosFlag == 'N' )
				arrCols.push( me.createActionColumn() );	
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
			createActionColumn : function()
			{
				var me = this;
				var objActionCol =
				{
					colType : 'actioncontent',
					colId : 'actioncontent',
					width : 80,
					locked : true,
					sortable : false,
					items :
					[
						// Do not show View button in case user has come from EDIT mode like done in 4.1
						{
							itemId : 'btnView',
							itemCls : 'grid-row-action-icon icon-view',
							toolTip : getLabel( 'viewToolTip', 'View Record' ),
							maskPosition : 7
						},
						{
							itemId : 'btnEdit',
							itemCls : 'grid-row-action-icon icon-edit',
							toolTip : getLabel( 'editToolTip', 'Modify Record' ),
							maskPosition : 8
						}
					]

				};
				return objActionCol;
			},
			createViewActionColumn : function()
			{
				var me = this;
				var objActionCol =
				{
					colType : 'actioncontent',
					colId : 'actioncontent',
					sortable : false,
					align : 'left',
					width : 150,
					locked : true,
					items :
					[
						{
							itemId : 'btnView',
							itemCls : 'grid-row-action-icon icon-view',
							toolTip : getLabel( 'viewToolTip', 'View Record' ),
							maskPosition : 7
						}
					]

				};
				return objActionCol;
			},
			createViewEditActionColumn : function()
			{
				var me = this;				
				var objActionCol =
				{
					colType : 'action',
					colId : 'action',
					sortable : false,
					align : 'left',
					width : 150,
					locked : true,
					items :
					[	
					 	{
							itemId : 'btnView',
							itemCls : 'grid-row-action-icon icon-view',
							toolTip : getLabel( 'viewToolTip', 'View Record' ),
							maskPosition : 7
						},
						{
							itemId : 'btnEdit',
							itemCls : 'grid-row-action-icon icon-edit',
							toolTip : getLabel( 'editToolTip', 'Modify Record' ),
							maskPosition : 8
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
						blnRetValue = me.isRowIconVisible( store, record, jsonData, null,
							arrMenuItems[ a ].maskPosition );
						arrMenuItems[ a ].setVisible( blnRetValue );
					}
				}
				menu.showAt( event.xy[ 0 ] + 5, event.xy[ 1 ] + 5 );
			},
			setInfoTooltip : function()
			{
				
			},
			toggleSavePrefrenceAction : function( isVisible )
			{
				
			},
			toggleClearPrefrenceAction : function( isVisible )
			{
				
			},
			handleSavePreferences : function()
			{
				var me = this;
				//me.savePreferences();
			},
			handleClearPreferences : function()
			{
				var me = this;
				//me.toggleSavePrefrenceAction( false );
				//me.clearWidgetPreferences();
			},
			savePreferences : function()
			{
				
			},
			saveFilterPreferences : function()
			{
				
			},
			clearWidgetPreferences : function()
			{
				
			},
			updateFilterConfig : function()
			{
				
			},
			addNewRow : function()
			{
				var me = this;
				showAgentDesignatedPersonPopup( null,"ADD" );
			},
			deletePersonAndUpdateAgentMaster : function (strUrl , frmId) {
				
				var me = this;
				var parentForm = document.forms[ "frmMain" ];
				var childForm = frmId;
				var url = strUrl;
				 $('input:disabled').each( 
					    	function()
					    	{
					    		$(this).removeAttr( " disabled " );    	
					    });

					    $('textarea:disabled').each( 
					    	function()
					    	{
					    		$(this).removeAttr( " disabled " );    		
					    });

					    $('select:disabled').each( 
					    	function()
					    	{
					    		$(this).removeAttr( " disabled " );    		
					    });
					    
					   var selectedForDeleteRecords = me.selectedRecords;
					   
					   for( var index = 0 ; index < selectedForDeleteRecords.length ; index++ )
						{ 
				parentForm.appendChild( createFormField( 'INPUT', 'HIDDEN',
								'agentDesignatedPersonDtlBeans[' + index + '].agentCode', selectedForDeleteRecords[index].data.agentCode) );	
				parentForm.appendChild( createFormField( 'INPUT', 'HIDDEN',
						'agentDesignatedPersonDtlBeans[' + index + '].personType', selectedForDeleteRecords[index].data. personType) );
				parentForm.appendChild( createFormField( 'INPUT', 'HIDDEN',
						'agentDesignatedPersonDtlBeans[' + index + '].personTitle', selectedForDeleteRecords[index].data. personTitle ) );
				parentForm.appendChild( createFormField( 'INPUT', 'HIDDEN',
						'agentDesignatedPersonDtlBeans[' + index + '].firstName', selectedForDeleteRecords[index].data. firstName) );
				parentForm.appendChild( createFormField( 'INPUT', 'HIDDEN',
						'agentDesignatedPersonDtlBeans[' + index + '].surName', selectedForDeleteRecords[index].data. surName) );
				parentForm.appendChild(createFormField( 'INPUT', 'HIDDEN',
						'agentDesignatedPersonDtlBeans[' + index + '].prefCommunication',selectedForDeleteRecords[index].data. prefCommunication) );
				parentForm.appendChild( createFormField( 'INPUT', 'HIDDEN',
						'agentDesignatedPersonDtlBeans[' + index + '].landlineNumber',selectedForDeleteRecords[index].data. landlineNumber ) );
				parentForm.appendChild(createFormField( 'INPUT', 'HIDDEN',
						'agentDesignatedPersonDtlBeans[' + index + '].faxNumber', selectedForDeleteRecords[index].data. faxNumber ) );
				parentForm.appendChild(createFormField( 'INPUT', 'HIDDEN',
						'agentDesignatedPersonDtlBeans[' + index + '].email', selectedForDeleteRecords[index].data. email ) );
				parentForm.appendChild(createFormField( 'INPUT', 'HIDDEN',
						'agentDesignatedPersonDtlBeans[' + index + '].mobileNumber', selectedForDeleteRecords[index].data. mobileNumber ) );
				parentForm.appendChild(createFormField( 'INPUT', 'HIDDEN',
						'agentDesignatedPersonDtlBeans[' + index + '].residentFlag', selectedForDeleteRecords[index].data. residentFlag ) );
				parentForm.appendChild(createFormField( 'INPUT', 'HIDDEN',
						'agentDesignatedPersonDtlBeans[' + index + '].residentId',selectedForDeleteRecords[index].data. residentId) );
				parentForm.appendChild(createFormField( 'INPUT', 'HIDDEN',
						'agentDesignatedPersonDtlBeans[' + index + '].passportNumber',selectedForDeleteRecords[index].data. passportNumber) );
				parentForm.appendChild( createFormField( 'INPUT', 'HIDDEN',
						'agentDesignatedPersonDtlBeans[' + index + '].viewState',selectedForDeleteRecords[index].data. viewState ) );
				parentForm.appendChild( createFormField( 'INPUT', 'HIDDEN',
						'agentDesignatedPersonDtlBeans[' + index + '].isDeleted',true ) );				
			}
				
				parentForm.method = 'POST';
				parentForm.action = url;
				parentForm.submit();
				
			}
			
			
			
		} );
