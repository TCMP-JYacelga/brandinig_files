Ext
	.define(
		'GCP.controller.NotionalQryBVFilterController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'Ext.ux.gcp.DateHandler', 'GCP.view.NotionalQryBVFilterGridView'
			],
			views :
			[
				'GCP.view.NotionalQryBVFilterView'
			],
			refs :
			[
				{
					ref : 'summaryGridViewRef',
					selector : 'notionalQryBVFilterViewType notionalQryBVFilterGridViewType grid[itemId="summaryGridViewItemId"]'
				},
				{
					ref : 'summaryViewItemRef',
					selector : 'notionalQryBVFilterViewType notionalQryBVFilterGridViewType panel[itemId="agreementChangeSummaryViewItemId"]'
				}
			],
			config :
			{
				filterData : [],
				dateHandler : null
			},
			init : function()
			{
				var me = this;
				this.dateHandler = Ext.create( 'Ext.ux.gcp.DateHandler' );
				
				GCP.getApplication().on(
					{
						getAgreementSummaryData : function()
						{
							me.handleSmartGridConfig();
							me.getSummaryViewItemRef().setVisible(true);
							me.callHandleLoadGridData();
						},
						changeSummaryDetails : function( changeId )
						{
							me.goTochangeSummaryDetails( changeId );
						}
					} );

				me.control(
				{
					'notionalQryBVFilterGridViewType' :
					{
						render : function( panel )
						{
							me.handleSmartGridConfig();
						}
					},

					'notionalQryBVFilterGridViewType smartgrid' :
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
			callHandleLoadGridData : function()
			{
				var me = this;
				var gridObj = me.getSummaryGridViewRef();
				me.handleLoadGridData( gridObj, gridObj.store.dataUrl, gridObj.pageSize, 1, 1, null );
			},
			goTochangeSummaryDetails : function( changeId )
			{
				var me = this;
				var strUrl = 'getBVChangeSummaryDetails.srvc';

				strUrl = strUrl + "?$changeId=" + changeId + "&" + csrfTokenName + "=" 	+ csrfTokenValue;
				var frm = document.getElementById( "frmNotionalBVQuery" );
				frm.action = strUrl
				frm.target = "";
				frm.method = "POST";
				frm.submit();
			},
			handleLoadGridData : function( grid, url, pgSize, newPgNo, oldPgNo, sorter )
			{
				var me = this;
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );

					if( agreementKey == null )
					{
						strUrl = strUrl + "&$agreementReckKey=" + '';	
					}
					else
					{
						strUrl = strUrl + "&$agreementReckKey=" + agreementKey;
					}
					
					if( fromTimestamp == null )
					{
						strUrl = strUrl + "&$fromDate=" + '';
					}
					else
					{
						strUrl = strUrl + "&$fromDate=" + fromTimestamp;
					}
					
					if( toTimestamp == null )
					{
						strUrl = strUrl + "&$toDate=" + '';
					}
					else
					{
						strUrl = strUrl + "&$toDate=" +  toTimestamp;
					}
					
					if( changeType == null)
					{
						strUrl = strUrl + "&$changeType=" + '';
					}
					else
					{
						strUrl = strUrl + "&$changeType=" + changeType;	
					}
				
				strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;

				grid.loadGridData( strUrl, null );
			},
			handleSmartGridConfig : function()
			{
				var me = this;
				var summaryGrid = me.getSummaryGridViewRef();
				var objConfigMap = me.getSummaryGridConfig();

				if( !Ext.isEmpty( summaryGrid ) )
					summaryGrid.destroy( true );

				var arrColsPref = null;
				var data = null;

				if( !Ext.isEmpty( objGridViewPref ) )
				{
					data = Ext.decode( objGridViewPref );
					objPref = data[ 0 ];
					arrColsPref = objPref.gridCols;
					arrCols = me.getColumns( arrColsPref, objConfigMap );
				}
				else
					if( objDefaultGridViewPref )
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

			getSummaryGridConfig : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;

				objWidthMap =
				{
						"ENTRY_DATE" : '10%',
						"AGREEMENT_CODE" : '20%',
						"AGREEMENT_DESC" : '20%',
						"CHANGE_ID" : '20%',
						"REASON_FOR_CHANGE" : '19.7%'

				};

				arrColsPref =
				[
					{
						"colId" : "ENTRY_DATE",
						"colDesc" : getLabel( 'lblEntryDate', 'Entry Date' )
					},
					{
						"colId" : "AGREEMENT_CODE",
						"colDesc" : getLabel( 'lblAgreementCode', 'Agreement Code' )
					},
					{
						"colId" : "AGREEMENT_DESC",
						"colDesc" : getLabel( 'lblAgreementDesc', 'Agreement Description' )
					},
					{
						"colId" : "CHANGE_ID",
						"colDesc" : getLabel( 'lblChangeId', 'Change ID' )
					},
					{
						"colId" : "REASON_FOR_CHANGE",
						"colDesc" : getLabel( 'lblReasonForChange', 'Reason For Change' )
					}
				];

				storeModel =
				{
					fields :
					[
						'ENTRY_DATE', 'AGREEMENT_CODE', 'AGREEMENT_DESC', 'CHANGE_ID', 'REASON_FOR_CHANGE', 'AGREEMENT_RECKEY'
					],
					proxyUrl : 'getBVAgreementSummary.srvc',
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
					for( var i = 0 ; i < arrColsPref.length ; i++ )
					{
						objCol = arrColsPref[ i ];
						cfgCol = {};
						cfgCol.colHeader = objCol.colDesc;
						cfgCol.colId = objCol.colId;
						cfgCol.hidden = objCol.colHidden;
						cfgCol.sortable = false;
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
				var strRetValue = value;
				var recKey = null;
				if( !Ext.isEmpty( value ) && value != ''  )
				{
					if( colId === 'col_CHANGE_ID' )
					{
						strRetValue = '<a href="#" onclick="callChangeSummaryDetails( \''
							+ record.get( 'CHANGE_ID' ) + '\'    )"><u>'+ value + ' </u></a>';
					} 
					
				}
				return strRetValue;
			},
			handleSmartGridLoading : function( arrCols, storeModel )
			{
				var me = this;
				var pgSize = null;
				pgSize = 100;
				summaryGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'summaryGridViewItemId',
					itemId : 'summaryGridViewItemId',
					pageSize : pgSize,
					autoDestroy : true,
					cls:'t7-grid',
					stateful : false,
					showEmptyRow : false,
					hideRowNumbererColumn : true,
					showSummaryRow : false,
					showPager : false,
					showCheckBoxColumn : false,
					headerDockedItems : null,
					enableColumnAutoWidth : _blnGridAutoColumnWidth,
					enableColumnHeaderMenu : false,
					rowList :
					[
						10, 25, 50, 100, 200, 500
					],
					minHeight : 10,
					maxHeight : 280,
					margin : '0 0 0 0',
					columnModel : arrCols,
					storeModel : storeModel
				} );
				var summaryView = me.getSummaryViewItemRef();
				summaryView.add( summaryGrid );
				summaryView.doLayout();
			}
		} );
function getAgreementSummary()
{
	doClearMessageSection();
	var arrError = [];
	var dateFlag = false;
	arrError = validateData();
	var element = null, strMsg = null, strTargetDivId = 'messageArea';
	//dateFlag = validateDate();
	/*if( mandatoryString != null )
	{
		var errorMessage = mandatoryString + ' fields are empty.';
		
		Ext.MessageBox.show(
		{
			title : 'Error',
			msg : errorMessage,
			buttons : Ext.MessageBox.OK,
			icon : Ext.MessageBox.ERROR
		} );
	}
	else if( dateFlag == true )
	{

		var errorMessage = 'From Date should be less than To Date.';
		
		Ext.MessageBox.show(
		{
			title : 'Error',
			msg : errorMessage,
			buttons : Ext.MessageBox.OK,
			icon : Ext.MessageBox.ERROR
		} );
	}*/
	if (arrError && arrError.length > 0) {
		$('#' + strTargetDivId).empty();
		$.each(arrError, function(index, error) {
			strMsg = error.errorMessage;
			element = $('<p>').text(strMsg);
			element.appendTo($('#' + strTargetDivId));
			$('#' + strTargetDivId + ', #messageContentDiv')
					.removeClass('hidden');
		});
	}
	else
	{
		assignData();
		handleFilterSenctionVisisbility();
		
		
		$('#summaryDiv').attr("style","height:auto");
		GCP.getApplication().fireEvent( 'getAgreementSummaryData' );
	}
}

function callChangeSummaryDetails( changeId )
{
	GCP.getApplication().fireEvent( 'changeSummaryDetails', changeId );
}