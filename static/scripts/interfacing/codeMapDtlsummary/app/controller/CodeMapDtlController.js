Ext.define( 'GCP.controller.CodeMapDtlController',
	{
		extend : 'Ext.app.Controller',
		requires :
		[
			'Ext.ux.gcp.DateHandler'
		],
		views :
		[
			'GCP.view.CodeMapDtlView'
		],
		refs :
		[

			{
				ref : 'codeMapDtlGridViewRef',
				selector : 'codeMapDtlViewType codeMapDtlGridViewType grid[itemId="gridViewMstItemId"]'
			},
			{
				ref : 'codeMapDtlGridRenderViewRef',
				selector : 'codeMapDtlGridViewType panel[itemId="gridViewDetailPanelItemId"]'
			},
			{
				ref : 'searchTxnTextInput',
				selector : 'codeMapDtlGridViewType textfield[itemId="searchTxnTextField"]'
			},
			{
				ref : 'matchCriteria',
				selector : 'codeMapDtlGridViewType radiogroup[itemId="matchCriteria"]'
			},
			{
				ref : 'actionBarSummDtl',
				selector : 'codeMapDtlViewType codeMapDtlGridViewType codeMapDtlGroupActionBarViewType'
			},
			{
				ref : 'codeMapDtlRequestItemIdRef',
				selector : 'codeMapDtlViewType codeMapDtlGridViewType button[itemId="codeMapDtlRequestItemId"]'
			}
			
		],
		config : {},
		init : function()
		{
			var me = this;
			
			GCP.getApplication().on(
				{
					disableEnableAddRecordButton : function( isSubmitMode )
					{
						me.disableEnableAddRecButton(isSubmitMode);
					
					}
				} );

			me.control(
			{

				'codeMapDtlViewType' :
				{
					render : function( panel )
					{
						me.handleSmartGridConfig();
					}
				},
				'codeMapDtlGridViewType button[itemId="codeMapDtlRequestItemId"]' :
				{
					click : function( btn, opts )
					{
						showCodeMapDetailsEntryPopup();
					}
				},

				'codeMapDtlGridViewType smartgrid' :
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
				'codeMapDtlGridViewType radiogroup[itemId="matchCriteria"]' :
				{
					change : function( btn, opts )
					{
						me.searchTrasactionChange();
					}
				},
				'codeMapDtlGridViewType textfield[itemId="searchTxnTextField"]' :
				{
					change : function( btn, opts )
					{
						me.searchTrasactionChange();
					}
				},
				'codeMapDtlViewType codeMapDtlGridViewType toolbar[itemId=codeMapDtlGroupActionBarViewItemId]' :
				{
					performGroupAction : function( btn, opts )
					{
						me.handleGroupActions( btn );
					}
				}

			} );
		},
		disableEnableAddRecButton : function( isSubmitMode )
		{
			var me =this;
			codeMapDtlRequestItem = me.getCodeMapDtlRequestItemIdRef();
			
			if(isSubmitMode == 'Y')
			{
				//codeMapDtlRequestItem.disable();
				codeMapDtlRequestItem.hide();
				
			}	
			else
			{
				//codeMapDtlRequestItem.enable();
				codeMapDtlRequestItem.show();
			}
		},
		handleLoadGridData : function( grid, url, pgSize, newPgNo, oldPgNo, sorter )
		{
			var me = this;
			var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );

			if( viewState )
			{
				strUrl = strUrl + "&$viewState=" + encodeURIComponent( viewState ) + "&" + csrfTokenName + "="
					+ csrfTokenValue;
				grid.loadGridData( strUrl, null );
			}

		},
		handleGroupActions : function( btn, record )
		{
			var me = this;
			var viewState = null;
			var grid = this.getCodeMapDtlGridViewRef();
			var records = grid.getSelectedRecords();
			var actionName = btn.actionName ;
			if(records.length == '1')
			{
				if(actionName == 'delete')
			    {
					viewState = records[0].get( 'viewState' );
					me.deleteCodeMapDtlRecord( viewState );
			    }
				else if(actionName == 'modify')
				{
					showCodeMapDetailsModifyPopup(records[0]);
				}
			}
		},
		
		deleteCodeMapDtlRecord : function( viewState )
		{
			var frm = document.getElementById( "codeMapMstNewForm" );
			var strUrl = 'deleteCodeMapDtlRecord.srvc';
			strUrl= strUrl + "?" + "&" + csrfTokenName + "=" + csrfTokenValue+ "&$viewState=" + encodeURIComponent( viewState );
			frm.action = strUrl;
			frm.target = "";
			frm.method = "POST";
			frm.submit();
		},
	/*	preHandleGroupActions : function( strUrl, remark, record )
		{
			var me = this;
			var grid = this.getCodeMapDtlGridViewRef();
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
						// TODO : Action Result handling to be done here
						me.enableDisableGroupActions( '0', true ); // mask size 1
						grid.refreshData();
					},
					failure : function()
					{
						var errMsg = "";
						Ext.MessageBox.show(
						{
							title : getLabel( 'codeMapDtlErrorPopUpTitle', 'Error' ),
							msg : getLabel( 'codeMapDtlErrorPopUpMsg', 'Error while fetching data..!' ),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						} );
					}
				} );
			}
		}, */
		handleSmartGridConfig : function()
		{
			var me = this;
			var codeMapDtlGrid = me.getCodeMapDtlGridViewRef();
			var objConfigMap = me.getCodeMapDetailGridConfig();

			if( !Ext.isEmpty( codeMapDtlGrid ) )
				codeMapDtlGrid.destroy( true );

			var arrColsPref = null;
			var data = null;

			arrCols = me.getColumns( objConfigMap.arrColsPref, objConfigMap.objWidthMap );
			me.handleSmartGridLoading( arrCols, objConfigMap.storeModel );
		},
		handleSmartGridLoading : function( arrCols, storeModel )
		{
			var me = this;
			var pgSize = null;
			var alertSummaryGrid = null;
			pgSize = 100;
			codeMapDtlGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
			{
				id : 'gridViewMstId',
				itemId : 'gridViewMstItemId',
				pageSize : pgSize,
				autoDestroy : true,
				stateful : false,
				showEmptyRow : false,
				hideRowNumbererColumn : true,
				showSummaryRow : true,
				showPager : true,
				showCheckBoxColumn : true,
				padding : '5 0 0 0',
				rowList :
				[
					10, 25, 50, 100, 200, 500
				],
				minHeight : 140,
				maxHeight : 280,
				columnModel : arrCols,
				storeModel : storeModel,
				isRowIconVisible : me.isRowIconVisible,
				//isRowMoreMenuVisible : me.isRowMoreMenuVisible,
				//handleRowMoreMenuClick : me.handleRowMoreMenuClick,

				handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
				{
					me.handleRowIconClick( tableView, rowIndex, columnIndex, btn, event, record );
				},
				handleRowMoreMenuItemClick : function( menu, event )
				{
					var dataParams = menu.ownerCt.dataParams;
					me.handleRowIconClick( dataParams.view, dataParams.rowIndex, dataParams.columnIndex, this, event,
						dataParams.record );
				}
			} );
			var codeMapDtlView = me.getCodeMapDtlGridRenderViewRef();
			codeMapDtlView.add( codeMapDtlGrid );
			codeMapDtlView.doLayout();
		},
		handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
		{
			var me = this;
			var actionName = btn.itemId;
			if( actionName === 'delete' )
			{
				me.handleGroupActions( btn, record );
			}
		},
		getCodeMapDetailGridConfig : function()
		{
			var me = this;
			var objConfigMap = null;
			var objWidthMap = null;
			var arrColsPref = null;
			var storeModel = null;

			objWidthMap =
			{
				"inValue" : 200,
				"outValue" : 200
			};

			arrColsPref =
			[
				{
					"colId" : "inValue",
					"colDesc" : getLabel( 'codeMapDtlInputValue', 'Input Value' )
				},
				{
					"colId" : "outValue",
					"colDesc" : getLabel( 'codeMapDtlOutputValue', 'Output Value' )
				}
			];

			storeModel =
			{
				fields :
				[
					'inValue', 'outValue', 'identifier', '__metadata', 'viewState'
				],
				proxyUrl : 'getCodeMapDetailsList.srvc',
				rootNode : 'd.codeMapDtlSummary'
			//	totalRowsNode : 'd.__count'
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

			//arrCols.push( me.createGroupActionColumn() );
			//arrCols.push( me.createActionColumn() );
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
			meta.tdAttr = 'title="' + strRetValue + '"';
			return strRetValue;
		},

		enableValidActionsForGrid : function( grid, record, recordIndex, selectedRecords, jsonData )
		{
			var me = this;
			var buttonMask = '0';
			var maskSize = 2;

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
				//maskArray.push( objData.raw.__metadata.__rightsMap )
				/*	if( objData.raw.makerId === USER )
					{
						isSameUser = false;
					} */
			}

			actionMask = doAndOperation( maskArray, maskSize );
			me.enableDisableGroupActions( actionMask, isSameUser );
		},
		enableDisableGroupActions : function( actionMask, isSameUser )
		{
			var actionBar = this.getActionBarSummDtl();
			var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
			if( !Ext.isEmpty( actionBar ) && !Ext.isEmpty( actionBar.items.items ) && isSubmitMode == 'N' && pageMode!= 'VIEW')
			{
				arrItems = actionBar.items.items;
				Ext.each( arrItems, function( item )
				{
					strBitMapKey = parseInt( item.maskPosition,10 ) - 1;
					if( strBitMapKey || strBitMapKey == 0 )
					{
						blnEnabled = isActionEnabled( actionMask, strBitMapKey );
						if( ( item.maskPosition === 1 && blnEnabled ) )
						{
							blnEnabled = blnEnabled && isSameUser;
						}
						else if( item.maskPosition === 2 && blnEnabled )
						{
							blnEnabled = blnEnabled && isSameUser;
						}
						item.setDisabled( !blnEnabled );
					}
				} );
			}
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

			var grid = me.getCodeMapDtlGridViewRef();
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
		}

	} );
function disableEnableAddRecord( isSubmitMode )
{
	GCP.getApplication().fireEvent( 'disableEnableAddRecordButton', isSubmitMode);
}