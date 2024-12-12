Ext.define( 'GCP.controller.FieldMappingZeroProofController',
{
	extend : 'Ext.app.Controller',
	requires :
	[
		'GCP.view.FieldMappingZeroProofGrid'
	],
	views :
	[
		'GCP.view.FieldMappingZeroProofView'
	],

	/**
	 * Array of configs to build up references to views on page.
	 */
	refs :
	[
		{
			ref : 'fieldMappingZeroProofViewRef',
			selector : 'fieldMappingZeroProofView'
		},
		{
			ref : 'fieldMappingZPGridRef',
			selector : 'fieldMappingZeroProofGridType grid[itemId="zeroProofGridId"]'
		},
		{
			ref : 'fieldMappingZeroProofGridRef',
			selector : 'fieldMappingZeroProofGridType panel[itemId="zeroProofGridViewItemId"]'
		}
	],
	config :
	{
		listURL : 'getUploadInterfaceZeroProofingList.srvc'
	},

	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */

	init : function()
	{
		var me = this;
		$(document).on('openZeroFieldEntryPopup', function(event, actionName) {
			if (pageMode != 'View')
				showAddZPPopUp();
		});	
		me.control(
		{
			'fieldMappingZeroProofGridType' :
			{
				render : function( panel )
				{
					me.handleSmartGridConfig();
				},
				performGroupAction : function( btn, opts )
				{
					me.handleGroupActions( btn );
				},
				openZeroFieldEntryPopup : function(btn) {
					//Entry Popup for Zero fields.
					if (pageMode != 'View')
						showAddZPPopUp();
				}
			},

			'fieldMappingZeroProofGridType smartgrid' :
			{
				render : function( grid )
				{
					me.handleLoadGridData( grid, grid.store.dataUrl, grid.pageSize, 1, 1, null );
				},
				gridRowSelectionChange : function( grid, record, recordIndex, records, jsonData )
				{
				}
			}
		} );
	},

	handleSmartGridConfig : function()
	{
		var me = this;
		var fieldMapZPGrid = me.getFieldMappingZPGridRef();
		if( Ext.isEmpty( fieldMapZPGrid ) )
		{
			if( objDefaultZPGridViewPref )
			{
				me.loadSmartGrid( objDefaultZPGridViewPref );
			}
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
		var zpGrid = null;
		var url;
		if( selectedBand != null )
			var url = me.listURL + '?$bandName=' + selectedBand + '&$fieldTypes=' + me.fieldTypes;
		else
			var url = me.listURL + '?$fieldTypes=' + me.fieldTypes;

		var objWidthMap =
		{
			"primeBand" : 150,
			"primeField" : 150,
			"type" : 90,
			"sumBand" : 150,
			"sumField" : 150
		};
		objPref = data[ 0 ];
		arrColsPref = objPref.gridCols;
		arrCols = me.getColumns( arrColsPref, objWidthMap );
		pgSize = !Ext.isEmpty( objPref.pgSize ) ? parseInt( objPref.pgSize,10 ) : 5;

		zpGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
		{
			id : 'zeroProofGridId',
			itemId : 'zeroProofGridId',
			pageSize : pgSize,
			autoDestroy : true,
			stateful : false,
			showEmptyRow : false,
			showCheckBoxColumn : false,
			hideRowNumbererColumn : false,
			enableCellEditing : true,
			cls:'t7-grid',
			showPager : false,			
			rowList :
			[
				5, 10, 15, 20, 25, 30
			],
			minHeight : 140,
			columnModel : arrCols,
			storeModel :
			{
				fields :
				[
					'interfaceCode', 'processCode', 'sequenceNmbr', 'type', 'primeBand', 'primeField', 'sumBand',
					'sumField', 'identifier', '__metadata'
				],
				proxyUrl : url,
				rootNode : 'd.fieldMappingZP'
			},
			isRowIconVisible : me.isRowIconVisible,
			handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
			{
				me.handleRowIconClick( tableView, rowIndex, columnIndex, btn, event, record );
			}
		} );
		var fieldMappingZeroProofGridViewRef = me.getFieldMappingZeroProofGridRef();
		fieldMappingZeroProofGridViewRef.add( zpGrid );
		fieldMappingZeroProofGridViewRef.doLayout();
	},

	handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
	{
		var me = this;
		var actionName = btn.itemId;
		if( actionName === 'btnZeroProofing' )
		{
			showEditZPPopUp( record );
		}
		else if( actionName === 'btnDelete' )
		{
			me.deleteZeroProofRecord(record);
		}
	},
	
	deleteZeroProofRecord : function(record)
	{
		var me = this;
		var frm = document.forms["frmMain"]; 
		frm.action = 'deleteZeroProofingRecord.srvc';
		frm.method = "POST";
		document.getElementById("dtlViewState").value = record.data.identifier;
		frm.submit();
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	deleteZeroProof : function(record)
	{
		var me = this;
		var grid = me.getFieldMappingZPGridRef();
		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
			var records = grid.getSelectedRecords();
			records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
					? records
					: [record];
			for (var index = 0; index < records.length; index++) {
				arrayJson.push({
							serialNo : grid.getStore().indexOf(records[index])
									+ 1,
							identifier : records[index].data.identifier,
							userMessage : encodeURIComponent( interfaceMapMasterViewState ),
							viewState : viewState
						});
				
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});

			Ext.Ajax.request({
						url : 'services/zeroProofing/delete.srvc',
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							// TODO : Action Result handling to be done here
							
							grid.refreshData();
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
										cls : 'ux_popup',
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}
	},
	
	handleGroupActions : function()
	{
		// implementation for reset link
		var me = this;
		var grid = this.getFieldMappingEditGrid();
		if( !Ext.isEmpty( grid ) )
		{
			var arrayJson = new Array();
			//			var records = grid.getSelectedRecords();
			var records = grid.store.data.items;
			for( var index = 0 ; index < records.length ; index++ )
			{
				arrayJson.push(
				{
					interfaceCode : records[ index ].data.interfaceCode,
					processCode : records[ index ].data.processCode,
					checkMapping : records[ index ].data.checkMapping,
					bandName : records[ index ].data.bandName,
					mandatory : records[ index ].data.mandatory,
					interfaceField : records[ index ].data.interfaceField,
					mappingType : records[ index ].data.mappingType,
					columnFormat : records[ index ].data.columnFormat,
					decimalValue : records[ index ].data.decimalValue,
					seqNmbr : records[ index ].data.seqNmbr,
					size : records[ index ].data.size,
					dataType : records[ index ].data.dataType,
					length : records[ index ].data.length,
					absoluteXpath1 : records[ index ].data.absoluteXpath1,
					relativeXpath : records[ index ].data.relativeXpath
				} );
			}
			Ext.Ajax.request(
			{
				url : 'updateInterfaceFieldMappingList.srvc?$viewState=' + encodeURIComponent( viewState ) 
				+ '&?interfaceMapMasterViewState=' + encodeURIComponent( interfaceMapMasterViewState )
				+ '&' + csrfTokenName + '=' + csrfTokenValue,
				method : 'POST',
				jsonData : Ext.encode( arrayJson ),
				success : function( response )
				{
					// TODO : Action Result handling to be done here							
					grid.refreshData();
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

	getColumns : function( arrColsPref, objWidthMap )
	{
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		arrCols.push( me.createDeleteActionColumn() );
		arrCols.push( me.createActionColumn() );
		if( !Ext.isEmpty( arrColsPref ) )
		{
			for( var i = 0 ; i < arrColsPref.length ; i++ )
			{
				objCol = arrColsPref[ i ];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				if( !Ext.isEmpty( objCol.colType ) )
				{
					cfgCol.colType = objCol.colType;
					if( cfgCol.colType === "number" )
						cfgCol.align = 'right';
				}

				if( objCol.colId === 'requestReference' ) // to show the summary row description
				{
					cfgCol.fnSummaryRenderer = function( value, summaryData, dataIndex, colId )
					{
						var strRet = getLabel( 'lblsubtotal', 'Sub Total' );
						return strRet;
					}
				}

				if( objCol.colId === 'requestedAmnt' ) // to show subtotal value
				{
					cfgCol.fnSummaryRenderer = function( value, summaryData, dataIndex, colId )
					{
						var loanCenterGrid = me.getLoanCenterGridRef();
						if( !Ext.isEmpty( loanCenterGrid ) && !Ext.isEmpty( loanCenterGrid.store ) )
						{
							var data = loanCenterGrid.store.proxy.reader.jsonData;
							if( data && data.d && data.d.__subTotal )
							{
								strRet = data.d.__subTotal;
							}
						}
						return strRet;
					}
				}

				cfgCol.width = !Ext.isEmpty( objWidthMap[ objCol.colId ] ) ? objWidthMap[ objCol.colId ] : 120;
				cfgCol.sortable = false;
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push( cfgCol );
			}
		}
		return arrCols;
	},

	createDeleteActionColumn : function()
	{
		var me = this;
		var objActionCol =
		{
			colType : 'actioncontent',
			colId : 'deleteActionDtl',
			width : 60,
			sortable : false,
			align : 'center',
			locked : true,
			items :
			[
				{
					itemId : 'btnDelete',
					text : getLabel( 'lblDelete', 'Delete' ),
					itemLabel : getLabel( 'lblDelete', 'Delete' )
				}
			]
		};
		return objActionCol;
	},

	createActionColumn : function()
	{
		var me = this;
		var objActionCol =
		{
			colType : 'action',
			colId : 'action',
			sortable : false,
			width : 40,
			locked : true,
			items :
			[
				{
					itemId : 'btnZeroProofing',
					itemCls : 'grid-row-action-icon icon-edit',
					toolTip : getLabel( 'lblToolTipeditZeroProffing', 'Edit Zero Proofing' )
				}
			]
		};
		return objActionCol;
	},

	columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
	{
		var strRetValue = "";
		if( colId === 'col_type' )
		{
			if( value == 'S' )
			{
				strRetValue = getLabel( 'lblSum', 'Sum' );
			}
			else
			{
				strRetValue = getLabel( 'lblCount', 'Count' );
			}
		}
		else
		{
			strRetValue = value;
		}

		return strRetValue;
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
		return retValue;
	},

	handleLoadGridData : function( grid, url, pgSize, newPgNo, oldPgNo, sorter )
	{
		var me = this;
		var strUrl = url;
		var fieldMappingZPGridRef = me.getFieldMappingZPGridRef();
		strUrl = url + '&$viewState=' + encodeURIComponent( viewState ) 
		+ '&?interfaceMapMasterViewState=' + encodeURIComponent( interfaceMapMasterViewState )
		+ '&' + csrfTokenName + '=' + csrfTokenValue;
		grid.loadGridData( strUrl );
	}

} );
