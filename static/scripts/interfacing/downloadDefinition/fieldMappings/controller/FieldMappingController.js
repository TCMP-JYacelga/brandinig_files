Ext.define( 'GCP.controller.FieldMappingController',
{
	extend : 'Ext.app.Controller',
	requires :
	[
		'GCP.view.FieldMappingEditGrid','Ext.ux.gcp.AutoCompleter'
	],
	views :
	[
		'GCP.view.FieldMappingView'
	],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs :
	[
		{
			ref : 'fieldMappingView',
			selector : 'fieldMappingView'
		},
		{
			ref : 'fieldMappingEditGrid',
			selector : 'fieldMappingView fieldMappingEditGrid grid[itemId="fieldMappingEditGridId"]'
		},
		{
			ref : 'fieldInfoEditGrid',
			selector : 'fieldMappingView fieldMappingEditGrid panel[itemId="fieldMappingEditGridView"]'
		},		
		{
			ref : 'fieldMappingBandDetails',
			selector : 'fieldMappingBandDetails'
		}
	],
	config :
	{
		listURL : 'getDownloadInterfaceFieldMappingList.srvc',
		mapBandDetails : null,
		fieldTypes : 'ALL'
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function()
	{
		var me = this;

		$(document).on('openCustomerFieldEntryPopup', function(event, actionName) {
			if (pageMode != 'View')
				showAddCFieldPopUp();
		});	
		$(document).on('openFilterFieldsGrid', function(event, btn) {
			me.openFilterFieldsGrid(btn);
		});
		$(document).on('openFieldMappingGrid', function(event, btn) {
			me.openFieldMappingGrid(btn);
		});
		$(document).on('openBandDetailGrid', function(event, btn) {
			me.openBandDetailGrid(btn);
		});	

		GCP.getApplication().on(
		{
			updateInterfaceFieldMapping : function()
			{
				me.updateInterfaceFieldMappingList();
			},
			updateInterfaceFieldMappingAndNext : function()
			{
				me.updateInterfaceFieldMappingListAndNext();
			}
		} );

		me.control(
		{
			'fieldMappingView' :
			{
				render : this.loadDownloadInterfaceBandDetailList,
				beforerender : function( panel, opts )
				{
				},
				afterrender : function( panel, opts )
				{
				}
			},			
			'fieldMappingEditGrid' :
			{
				render : function( panel )
				{
					me.handleSmartGridConfig();
				}
			},
			'fieldMappingEditGrid smartgrid' :
			{
				render : function( grid )
				{
					me.handleLoadGridData( grid, grid.store.dataUrl, grid.pageSize, 1, 1, null );
				},
				//gridPageChange : me.handleLoadGridData,
				//gridSortChange : me.handleLoadGridData,
				gridRowSelectionChange : function( grid, record, recordIndex, records, jsonData )
				{
				}
			}
		} );
	},

	loadDownloadInterfaceBandDetailList : function()
	{
		var me = this;
		/*var lowerPanel = me.getFieldBandListPanelRef();
		var fieldMappingBandDtl = me.getFieldMappingBandDetails();
		if( !Ext.isEmpty( fieldMappingBandDtl ) && !Ext.isEmpty( lowerPanel ) )
		{
			fieldMappingBandDtl.remove( lowerPanel );
		}*/
		var strUrl = 'getDownloadInterfaceBandDetailList.srvc?$viewState=' + encodeURIComponent( viewState )
			+ '&?interfaceMapMasterViewState=' + encodeURIComponent( interfaceMapMasterViewState )
			+ '&$inlinecount=none' + '&$top=20' + '&$skip=1' + '&' + csrfTokenName + '=' + csrfTokenValue;
		Ext.Ajax.request(
		{
			url : strUrl,
			method : "POST",
			success : function( response )
			{
				var data = Ext.decode( response.responseText );
				if( !Ext.isEmpty( data ) )
				{
					var lstBandInfo = data.d.bandInfo;
					me.getBandAbsoluteXpath( lstBandInfo );
					//fieldMappingBandDtl.createBandListPanelView( lstBandInfo );
					me.populateBandList(lstBandInfo);
				}
			},
			failure : function( response )
			{
				console.log( 'Error Occured' );
			}
		} );

	},

	populateBandList : function(jsonData) 
	{
		/*for (var i = 0; i < jsonData.length; i++) 
		{			
			$("#divBandName").append('<a data-bandName="'+jsonData[i].bandName+'" class="t7-action-link">'+jsonData[i].bandName+'</a>&nbsp;');			
		}
		$('#divBandName a').on("click", function(event) {
			var actionName = $(event.target).attr("data-bandName");
			var btn = {
				'itemId' : actionName,
				'name' : actionName			
				}; 
			$(document).trigger("openBandDetailGrid", [btn]);			
		});*/
		
		$('#summaryCarousal').fieldMappingCarousel({
			data : jsonData,
			slidesToShow: 1,
			//titleNode : "bandName",
			titleRenderer: function(value) {
				return "<a class='cursor_pointer' style='color:#fff;' data-bandName="+value.bandName+">"+ value.bandName+"</a>";
			}								
		});
		
		$('.ft-carousel-slick-item a').on("click", function(event) {				
			var slickList = document.getElementsByClassName("slick-track")
			for(var i=0;i<slickList.length;i++){		
				var activeClass=slickList[i].getElementsByClassName("ft-carousel-slick-active");
				$(activeClass).removeClass('ft-carousel-slick-active');
			}
			$(event.target).closest('.ft-carousel-slick-item').addClass('ft-carousel-slick-active');
			
			var actionName = $(event.target).attr("data-bandName");
			var btn = {
				'itemId' : actionName,
				'name' : actionName			
				}; 
			
			$(document).trigger("openBandDetailGrid", [btn]);			
		});
		
	},

	loadFieldMappDynamicFieldItem : function()
	{
		var me = this;
		/*var fieldItemToolbar = me.getFieldMappingFieldsToolBar();
		var fildMapItemPanel = me.getFieldMappingCreateItemPanel();
		var fieldMappingInfoToolBar = me.getFieldMappingInfoToolBar();

		if( fieldItemToolbar.getComponent( 'btnDynamicFields' ) )
			fieldItemToolbar.remove( 'btnDynamicFields' );
		if( fildMapItemPanel.getComponent( 'doAddRefresh' ) )
			fildMapItemPanel.remove( 'doAddRefresh' );*/

		if( selectedBand in mapBandNames )
		{
			// Adding Dynamic field option			
			$("#viewFieldsGrid").append('<li class="ui-state-default ui-corner-top"><a id="btnDynamicFields" fieldsType="DYNAMIC">'+getLabel('lbldynamicfields', ' Dynamic Fields')+'</a></li>');			
			$('#btnDynamicFields').on("click", function(event) {
				$('#editFieldsGrid li').removeClass('ui-tabs-selected ui-state-active');
				$('#viewFieldsGrid li').removeClass('ui-tabs-selected ui-state-active');
				$(event.target).closest('li').addClass('ui-tabs-selected ui-state-active');
				
				var actionName = $(event.target).attr("fieldsType");
				var btn = {
					'code' : actionName,
					'name' : actionName			
					}; 
				$(document).trigger("openFilterFieldsGrid", [btn]);			
			});
			// Adding Add & Refresh option	
			$("#viewFieldsGrid").append('<li class="ui-state-default ui-corner-top"><a id="doAddRefresh" fieldsType="addRefresh">'+getLabel('lbladdrefresh','  Add & Refresh')+'</a></li>');			
			$('#doAddRefresh').on("click", function(event) {
				$('#editFieldsGrid li').removeClass('ui-tabs-selected ui-state-active');
				$('#viewFieldsGrid li').removeClass('ui-tabs-selected ui-state-active');
				$(event.target).closest('li').addClass('ui-tabs-selected ui-state-active');
				
				if (pageMode != 'View')
					me.doAddRefreshField(mapBandNames[selectedBand]);	
			});

			/*var item = Ext.create( 'Ext.Button',
			{
				itemId : 'btnDynamicFields',
				name : 'DYNAMIC',
				text : '<span class="button_underline thePointer">' + getLabel( 'lbldynamicfields', ' Dynamic Fields' ) + '</span>',
				cls : 'xn-account-filter-btnmenu xn-small-button',
				margin : '8 0 0 0',
				handler : function()
				{
					me.openFilterFieldsGrid( this );
				}
			} );
			//fieldItemToolbar.insert(3, item);
			fieldMappingInfoToolBar.insert( 3, item );

			// Adding Add & Refresh option			
			var itemBtn = Ext.create( 'Ext.Button',
			{
				itemId : 'doAddRefresh',
				name : 'addRefresh',
				margin : '7 0 5 0',
				text : '<span class="button_underline thePointer">' + getLabel( 'lbladdrefresh', ' Add & Refresh' ) + '</span>',
				cls : 'xn-account-filter-btnmenu',
				handler : function()
				{
					if( pageMode != 'View' )
						me.doAddRefreshField( mapBandNames[ selectedBand ] );
				}
			} );

			fildMapItemPanel.insert( 5, itemBtn );*/
		}

	},
	handleSmartGridConfig : function()
	{
		var me = this;
		var fieldMapEditGrid = me.getFieldMappingEditGrid();
		if( Ext.isEmpty( fieldMapEditGrid ) )
		{
			if( objDefaultGridViewPref )
				me.loadSmartGrid( objDefaultGridViewPref );
		}
		else
		{
			me.handleLoadGridData( grid, grid.store.dataUrl, grid.pageSize, 1, 1, null );
		}
	},
	loadSmartGrid : function( data )
	{
		var me = this;
		var objPref = null, pgSize = null;
		var cellEditGrid = null;
		var arrItems;
		var url;
		if( selectedBand != null )
			var url = me.listURL + '?$bandName=' + selectedBand + '&$fieldTypes=' + me.fieldTypes;
		else
			var url = me.listURL + '?$fieldTypes=' + me.fieldTypes;

		var blnIsPathVisible = ( formatType === FormatType.XML || formatType === FormatType.SWIFT
			|| formatType === FormatType.FEDWIRE || formatType === FormatType.BIGBATCH ) ? true : false;
		
		if( blnIsPathVisible )
		{
			arrItems =
			[
				{
					itemId : 'btnAdvMapping',
					tooltip : pageMode == 'View' ? getLabel( 'viewAdvMappingToolTip', 'View Advanced Mapping' ) : getLabel( 'advMappingToolTip', 'Define Advanced Mapping' ),
					//getClass : 'grid-row-action-icon icon-edit',					
					getClass : function( value, metaData, record )
					{
						if( pageMode == 'View' )
						{
							return 'grid-row-action-icon icon-view cursor_pointer';
						}
						else
						{
							return 'grid-row-action-icon icon-edit cursor_pointer';
						}
					},
					handler : function( grid, rowIndex, colIndex, btn, event, record )
					{
						me.handleRowIconClick( grid, rowIndex, colIndex, btn, event, record );
					}
				},
				{
					itemId : 'btnAttachPath',
					tooltip : getLabel( 'viewToolTip', 'Attach Path' ),
					//getClass : 'grid-row-action-icon icon-view cursor_pointer',	
					getClass : function( value, metaData, record )
					{
						/*
						FTGCPPRD-1175 For Download, XPATH should not empty irrepsective of Mapping Type
						if( record.get( 'mappingType' ) == '1' || record.get( 'mappingType' ) == '4'
							|| record.get( 'mappingType' ) == '9' || record.get( 'mappingType' ) == '13' )
							return 'xn-hide';
						else
						*/
							return 'grid-row-action-icon icon-file cursor_pointer';
					},
					handler : function( grid, rowIndex, colIndex, btn, event, record )
					{
						me.handleRowIconClick( grid, rowIndex, colIndex, btn, event, record );
					}
				}
			];
		}
		else
		{
			arrItems =
			[
				{
					itemId : 'btnAdvMapping',
					tooltip : pageMode == 'View' ? getLabel( 'viewAdvMappingToolTip', 'View Advanced Mapping' ) : getLabel( 'advMappingToolTip', 'Define Advanced Mapping' ),
					//getClass : 'grid-row-action-icon icon-edit cursor_pointer',
					getClass : function( value, metaData, record )
					{
						if( pageMode == 'View' )
						{
							return 'grid-row-action-icon icon-view cursor_pointer';
						}
						else
						{
							return 'grid-row-action-icon icon-edit cursor_pointer';
						}
					},
					handler : function( grid, rowIndex, colIndex, btn, event, record )
					{
						me.handleRowIconClick( grid, rowIndex, colIndex, btn, event, record );
					}
				}
			];
		}

		var cellEditPlugin = Ext.create( 'Ext.grid.plugin.CellEditing',
		{
			clicksToEdit : 1,
			listeners :
			{
				'beforeedit' : function( edit, e )
				{
					if( edit.context.field === 'columnFormat' )
					{
						return me.columnFormatBeforeEdit( edit, e );
					}
					if( edit.context.field === 'decimalValue' )
					{
						if( e.record.get( 'dataType' ) != 'DECIMAL' || e.record.get( 'mappingType' ) == '6' )
							return false;
						else
							return true;
					}
					if( edit.context.field === 'seqNmbr' )
					{
						if( formatType === FormatType.XML)
						{
								/*
								 * For XML Sequence number will be calculated from XML Tree
								 */
								return false;
						}//if
						else if( formatType === FormatType.DELIMITTER )
						{
							if(e.record.get( 'mappingType' ) == '12' || e.record.get( 'mappingType' ) == '8' || e.record.get( 'mappingType' ) == '1' ) // XML Namespace
							{
								return false;
							}//if
							else
							{
								return true;
							}//else
						}//else if
						else if( formatType === FormatType.FIXEDWIDTH )
						{
							if(e.record.get( 'mappingType' ) == '8') // Internal
							{
								return false;
							}//if
							else
							{
								return true;
							}//else							
						}//else if
						else
							return true;
					}
					if( edit.context.field === 'mandatoryDesc' )
					{
						if( e.record.get( 'mappingType' ) == '8' || e.record.get( 'fieldType' ) == '1'
							|| e.record.get( 'fieldType' ) == '3' )
							return false;
						else
							return true;
					}
					if(edit.context.field === 'alignment')
					{
						if(e.record.get( 'mappingType' ) == '8') // Internal
						{
							return false;
						}//if
						else
						{
							return true;
						}//else		
					}
					if(edit.context.field === 'filler')
					{
						if(e.record.get( 'mappingType' ) == '8') // Internal
						{
							return false;
						}//if
						else
						{
							return true;
						}//else		
					}
				}
			}

		} );

		var mandateStore = new Ext.data.SimpleStore(
		{
			fields :
			[
				"code", "description"
			],
			data :
			[
				[
					"NO", "NO"
				],
				[
					"YES", "YES"
				]
			]
		} );

		var alignmentStore = Ext.create( 'Ext.data.Store',
				{
					fields :
					[
						'key', 'value'
					],
					data :
					[
						{
							"key" : "R",
							"value" : "Right"
						},
						{
							"key" : "L",
							"value" : "Left"
						}
					]
				} );
		var fillerStore = Ext.create( 'Ext.data.Store',
				{
					fields :
					[
						'key', 'value'
					],
					data :
					[
						{
							"key" : " ",
							"value" : "Space"
						},
						{
							"key" : "0",
							"value" : "Zero"
						},
						{
							"key" : "*",
							"value" : "Asteric(*)"
						}
					]
				} );
		var arrCols =
		[
			{
				width : 40,
				sortable : false,
				hideable : false,
				dataIndex : 'checkMapping',
				renderer : function( value, metaData, record, rowIndex )
				{
					var mandatoryStyle = "";
					if( record.get( 'fieldType' ) == '1' )
						mandatoryStyle = "border-style:solid BLACK 1px;outline:1px solid BLACK;"
					
					if( pageMode == 'View' )
					{
						if( value == 'Y' )
							strRetValue = '<input type="checkbox" style="' + mandatoryStyle
								+ '" disabled id="' + rowIndex
								+ '_checkId" name="' + rowIndex + '_checkName" value="' + value + '" checked/>';
						else
							strRetValue = '<input type="checkbox" style="' + mandatoryStyle
								+ '" disabled id="' + rowIndex
								+ '_checkId" name="' + rowIndex + '_checkName" value="' + value + '"/>';
					}
					else
					{
						if( value == 'Y' )
							strRetValue = '<input type="checkbox" style="' + mandatoryStyle
								+ '" onclick="javascript:setCheckBoxValue(' + rowIndex + ',this)" id="' + rowIndex
								+ '_checkId" name="' + rowIndex + '_checkName" value="' + value + '" checked/>';
						else
							strRetValue = '<input type="checkbox" style="' + mandatoryStyle
								+ '" onclick="javascript:setCheckBoxValue(' + rowIndex + ',this)" id="' + rowIndex
								+ '_checkId" name="' + rowIndex + '_checkName" value="' + value + '"/>';
					}
					return strRetValue;
				}
			},
			{
				xtype : 'actioncolumn',
				width : 60,
				sortable : false,
				hideable : false,
				align : 'center',
				//locked : true,  				
				renderer : function( value, metaData, record, rowIndex )
				{
					var strRetValue = '';
					if( pageMode == 'View' )
					{
						strRetValue = '<span>' + getLabel( 'lblreset', 'Reset' ) + '</span>';
					}
					else
					{
						strRetValue = '<a class="grey cursor_pointer action-link-align action-link"'
							+ 'name="btnReset">' + getLabel( 'lblreset', 'Reset' ) + '&nbsp &nbsp</a> ';
					}
					
					return strRetValue;
				}
			},
			{
				width : 60,
				sortable : false,
				hideable : false,
				align : 'center',
				items : arrItems,
				renderer : function(value, metaData, record, rowIndex) {
                	var strRetValue = "";
                	var itms = metaData.column.items;
                	for( i=0 ; i<metaData.column.items.length ; i++ ) {
                		strRetValue = strRetValue + '<a class="' + itms.items[i].getClass(value, metaData, record) + '" title="' + itms.items[i].tooltip + '"></a>';
                	}
                	return strRetValue;
                }
			},
			{
				text : getLabel('sourceField','Source Field'),
				width : 200,
				sortable : false,
				dataIndex : 'interfaceField'
			},
			{
				text : getLabel('dataType','Data Type'),
				width : 80,
				sortable : false,
				dataIndex : 'dataType'
			},
			{
				text :getLabel('maxSize', 'Max Size'),
				width : 60,
				sortable : false,
				dataIndex : 'length'
			},
			{
				text : getLabel('mapping','Mapping'),
				width : 80,
				sortable : false,
				dataIndex : 'bandMappingDesc'
			},
			{
                text     : getLabel('destinationField','Destination Field'),
                width    : 80,
                sortable : false,                
                dataIndex: 'destField',
                renderer: function(value, metaData, record, rowIndex)
				{
                	if(!Ext.isEmpty(record) && !Ext.isEmpty(record.get('bandMappingDesc')))
                	{	
                		if (record.get('bandMappingDesc')=='Referenced' )
							value = record.get('fieldIdRef');						
						else if(record.get('bandMappingDesc') == 'Constant')
                			value = record.get('constantValue');	
                		else
                			value = record.get('fieldRemarks');
                	}
                	return value;	
				}
            },
            {
                text     : getLabel('defaultValue','Default Value'),
                width    : 80,
                sortable : false,                
                dataIndex: 'defValue',
                renderer: function(value, metaData, record, rowIndex)
				{
                	if(!Ext.isEmpty(record) && !Ext.isEmpty(record.get('defaultValue')) && !Ext.isEmpty(record.get('bandMappingDesc')) && (record.get('bandMappingDesc') != 'Constant'))
                	{	
                		
                		 	value = record.get('defaultValue');	
                		 	metaData.tdAttr = 'title="' + value + '"';
						               		
                	}
                	return value;	
				}
            },
			{
				text :getLabel('format', 'Format'),
				width : 120,
				sortable : false,
				dataIndex : 'columnFormat',
				editor :
				{
					xtype : 'combobox',
					lazyRender : true,
					listClass : 'x-combo-list-small'
				},
				renderer : function( value, metaData )
				{
					metaData.style = "border: 1px gray solid;";
					return value;
				}
			},
			{
				text : getLabel('precision','Precision'),
				width : 60,
				sortable : false,
				dataIndex : 'decimalValue',
				align : 'right',
				editor :
				{
					xtype : 'textfield',
					allowBlank : true,
					itemId : 'decimalValue',
					name : 'decimalValue'
				},
				renderer : function( value, metaData )
				{
					metaData.style = "border: 1px gray solid;";
					return value;
				}
			},
			{
				text : getLabel('sequence','Sequence'),
				width : 80,
				hidden : (formatType == 'Database'),
				sortable : false,
				dataIndex : 'seqNmbr',
				align : 'right',
				editor :
				{
					xtype : 'textfield',
					allowBlank : true,
					itemId : 'seqNmbr',
					name : 'seqNmbr'
				},
				renderer : function( value, metaData )
				{
					metaData.style = "border: 1px gray solid;";
					return value;
				}
			},
			{
				text : getLabel('actualSize','Actual Size'),
				width : 80,
				sortable : false,
				dataIndex : 'size',
				align : 'right',
				editor :
				{
					xtype : 'textfield',
					allowBlank : true,
					itemId : 'size',
					name : 'size'
				},
				renderer : function( value, metaData, record )
				{
					metaData.style = "border: 1px gray solid;";
					if( Ext.isEmpty( value ) )
						value = record.get( 'length' );

					return value;
				}
			},
			{
				text :getLabel('alignment', 'Alignment'),
				sortable : false,
				dataIndex : 'alignment',
				hidden : formatType === FormatType.FIXEDWIDTH ? false : true,
				width : 100,
				editor :
				{
					xtype : 'combobox',
					store : alignmentStore,
					queryMode : 'local',
					displayField : 'value',
					valueField : 'key',
					editable : false
				},
				renderer : function( value, metaData, record, rowIndex )
				{
					if( 'R' == value )
					{
						return 'Right';
					}
					else if( 'L' == value )
					{
						return 'Left';
					}
					else
					{
						return value;
					}
				}
			},
			{
				text : getLabel('filler','Filler'),
				dataIndex : 'filler',
				hidden : formatType === FormatType.FIXEDWIDTH ? false : true,
				width : 100,
				editor :
				{
					xtype : 'combobox',
					store : fillerStore,
					queryMode : 'local',
					displayField : 'value',
					valueField : 'key',
					editable : false
				},
				renderer : function( value, metaData, record, rowIndex )
				{
					if( ' ' == value )
					{
						return 'Space';
					}
					else if( '0' == value )
					{
						return 'Zero';
					}
					else if( '*' == value )
					{
						return 'Asteric(*)';
					}
					else
					{
						return value;
					}
				}
			},
			{
				text : getLabel('path','Path'),
				width : 100,
				sortable : false,
				dataIndex : 'displayPath',
				hidden : !blnIsPathVisible,
				renderer : function( value, metaData )
				{
					metaData.style = "border: 1px gray solid;";
					return value;
				}
			},
			{
				text : getLabel('targetColumn','Target Column'),
				width : 120,
				sortable : false,
				dataIndex : 'absoluteXpath1',
				hidden : (formatType != 'Database'),
				editor :
				{
					xtype: 'AutoCompleter',
                    fieldCls : 'xn-form-text w12 xn-suggestion-box',
					//itemId : 'fileClientCodeId',
					cfgUrl : 'services/downloadTargetColumnList.json',
					cfgQueryParamName : '$autofilter',
					cfgStoreFields:['featureValue'],
					cfgRecordCount : -1,
					//cfgSeekId : 'clientCodeSeek',
					//cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'featureValue',
					cfgKeyNode : 'featureValue',
					cfgProxyMethodType : 'POST',
					forceSelection:true,
					listeners : {
					'render' : function(combo, record) {
							this.cfgExtraParams =
							[
								{
									key : '$viewState',
									value :  viewState
								},
								{
									key : '$bandName',
									value :  selectedBand
								}
									
							];
						
						}
					}
				},
				renderer : function( value, metaData, record, rowIndex )
				{
					metaData.style = "border: 1px gray solid;";
					return value;
				}
			}
		];

		var fieldMappingStore = Ext.create( 'Ext.data.Store',
		{
			fields :
			[
				'interfaceCode', 'processCode', 'bandName', 'checkMapping', 'mappingType', 'interfaceField',
				'sourceFieldName', 'dataType', 'length', 'mandatory', 'mandatoryDesc', 'columnFormat', 'decimalValue',
				'seqNmbr', 'size', 'bandMappingDesc', 'relativeXpath', 'absoluteXpath1', 'displayPath', 'dynamicFlag',
				'fieldType', 'bandType', 'recordKeyNo', 'fieldRemarks', 'defaultValue', 'constantValue', 'xmlNamespace',
				'xmlNamespaceURI', 'order', 'priority','alignment','filler',
				'translationFunctionName', 'resetRunningNoBand','batchTotalType', 'bandNameRef', 'fieldIdRef', 'codeMapRef', 'identifier',
				'__metadata'
			],
			autoLoad : false,
			dataUrl : url,
			remoteSort : true,
			proxy :
			{
				// url : strUrl,
				type : "memory",
				reader :
				{
					type : "json",
					root : "d.fieldMapping"
				}
			}
		} );

		cellEditGrid = Ext.create( 'Ext.grid.Panel',
		{
			id : 'fieldMappingEditGridId',
			itemId : 'fieldMappingEditGridId',
			minHeight : 140,
			maxHeight : 280,
			height : 'auto',
			autoScroll : true,
			autoDestroy : true,
			stateful : false,
			cls:'t7-grid bandInfoGrid',
			padding : '4 0 0 0',
			columns : arrCols,
			store : fieldMappingStore,
			plugins : pageMode === 'View' ? [] :
			[
				cellEditPlugin
			],
			loadGridData : me.loadGridData,
			listeners :
			{
				render : function( grid )
				{
					me.handleLoadGridData( grid, grid.store.dataUrl, grid.pageSize, 1, 1, null );
				},
				cellclick : function( gridView, td, cellIndex, record, tr, rowIndex, eventObj )
				{
					var IconLinkClicked = (eventObj.target.tagName == 'A');
					if(IconLinkClicked){
						var className = eventObj.target.className;
						if(className=='grid-row-action-icon icon-edit cursor_pointer'){
							addAdvanceMapping(record);
						} else if (className=='grid-row-action-icon icon-view cursor_pointer') {
							addAdvanceMapping(record);
						} else if (className=='grid-row-action-icon icon-file cursor_pointer') {
							me.showAttachPath(record, rowIndex);
						}else{
						var targetObj = {};
						targetObj.name = eventObj.target.name;
						targetObj.itemId = eventObj.target.name;
						targetObj.action = eventObj.target.name;
						me.handleRowIconClick( gridView, rowIndex, cellIndex, targetObj, eventObj, record );
						}
					}
				}
			}
		} );
		var editGirdView = me.getFieldInfoEditGrid();
		editGirdView.add( cellEditGrid );
		editGirdView.doLayout();
	},

	// Smart Grid code copied here : To load the data
	loadGridData : function( strUrl, ptFunction, args, isLoading )
	{
		var me = this;
		var blnLoad = true;
		if( !Ext.isEmpty( isLoading ) )
			blnLoad = false;
		me.setLoading( blnLoad );
		Ext.Ajax.request(
		{
			url : strUrl,
			method : 'POST',
			success : function( response )
			{
				var decodedJson = Ext.decode( response.responseText );
				me.store.loadRawData( decodedJson );
				if( !Ext.isEmpty( ptFunction ) && typeof ptFunction == 'function' )
				{
					//ptFunction( me, decodedJson, args );
				}
				me.setLoading( false );
			},
			failure : function()
			{
				me.setLoading( false );
				Ext.MessageBox.show(
				{
					title : getLabel( 'errorPopUpTitle', 'Error' ),
					msg : getLabel( 'errorPopUpMsg', 'Error while fetching data..!' ),
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				} );
			}
		} );
	},
	handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
	{
		var me = this;
		var actionName = btn.itemId;
		if( actionName === 'btnAdvMapping' )
		{
			// Advanced Mapping implementation
			addAdvanceMapping( record );
		}
		else if( actionName === 'btnAttachPath' )
		{
			//me.setAttachPath(record, rowIndex);
			me.showAttachPath( record, rowIndex );
		}
		else if( actionName === 'btnReset' )
		{
			var arrCols = objDefaultGridViewPref[ 0 ].gridCols;
			var modVal;
			if( !Ext.isEmpty( arrCols ) )
			{
				for( var i = 1 ; i < arrCols.length ; i++ )
				{
					var fieldId = arrCols[ i ].colId;
					if( !Ext.isEmpty( fieldId ) && record.isModified( fieldId ) )
					{
						if( fieldId == "mandatoryDesc" )
							modVal = record.modified.mandatoryDesc;
						else if( fieldId == "columnFormat" )
							modVal = record.modified.columnFormat;
						else if( fieldId == "decimalValue" )
							modVal = record.modified.decimalValue;
						else if( fieldId == "seqNmbr" )
							modVal = record.modified.seqNmbr;
						else if( fieldId == "size" )
							modVal = record.modified.size;
						else if( fieldId == "displayPath" )
							modVal = record.modified.displayPath;

						record.set( arrCols[ i ].colId, modVal );
					}
				}
			}
		}
	},
	showAttachPath : function( record, rowIndex )
	{
		var me = this;
		var url = 'showXMLTreeView.popup';
		var frm = document.getElementById( "frmMain" );
		if( formatType === FormatType.XML )
			url = 'showXMLTreeView.popup';
		else if( formatType === FormatType.SWIFT )
			url = 'showSwiftTreeView.popup';
		else if( formatType === FormatType.FEDWIRE )
			url = 'showFedFileTreeView.popup';
		else if( formatType === FormatType.BIGBATCH )
			url = 'showBatchWireFileTreeView.popup';

		/*if (formatType === FormatType.XML)
		{
			record.set('absoluteXpath1', record.get('displayPath'));
			record.set('relativeXpath', '');
		}			
		else 
		{
			if(record.get('mappingType')=='1' || record.get('mappingType')=='4' || record.get('mappingType')=='5' || 
					record.get('mappingType')=='6' || record.get('mappingType')=='8' || record.get('mappingType')=='9')
			{
				record.set('absoluteXpath1', record.get('displayPath'));
				record.set('relativeXpath', '');
			}				
			else
			{
				record.set('relativeXpath', record.get('displayPath'));
			}				
		}*/

		var strUrl = url + '?' + csrfTokenName + "=" + csrfTokenValue;
		recordRef = record;
		var bandAbolutePath = "";
		if( !Ext.isEmpty( me.mapBandDetails ) && !Ext.isEmpty( me.mapBandDetails.get( record.get( 'bandName' ) ) ) )
			bandAbolutePath = me.mapBandDetails.get( record.get( 'bandName' ) );

		document.getElementById( 'txtMapPathComponent' ).value = 'displayPath';
		document.getElementById( 'txtPathComponent' ).value = "";
		document.getElementById( 'txtSequenceNumberComponent' ).value = "";
		document.getElementById( 'txtMapBandPath' ).value = bandAbolutePath;
		document.getElementById( 'txtPathEntered1' ).value = record.get( 'absoluteXpath1' );
		document.getElementById( 'mappedDatatype' ).value = record.get( 'dataType' );

		document.getElementById( 'relativeComponent' ).value = 'relativeXpath';
		if( !Ext.isEmpty( record.get( 'relativeXpath' ) ) )
			document.getElementById( 'relativexpathmapping' ).value = record.get( 'relativeXpath' );

		frm.action = strUrl;
		frm.target = "hWinSeek";
		frm.method = "POST";
		var strAttr;
		var intTop = ( screen.availHeight - 300 ) / 2;
		var intLeft = ( screen.availWidth - 600 ) / 2;
		strAttr = "dependent=yes,scrollbars=yes,";
		strAttr = strAttr + "left=" + intLeft + ",";
		strAttr = strAttr + "top=" + intTop + ",";
		strAttr = strAttr + "width=600,height=400,resizable=1";
		window.open( "", "hWinSeek", strAttr );
		frm.submit();
		frm.target = "";

	},
	/* It is alternate of above function...It needs to be removed
	setAttachPath : function(record, rowIndex)
	{		
		var strUrl = 'showXMLTreeView.srvc?$txtPathComponent=absoluteXpath1&txtMapPathComponent=1&txtPathEntered=test&relativeComponent1=relativeXpath&interfaceCodeSeek=CU_PAYMENTS&processCodeSeek=TESTV4&sampleFileTypeSeek=XML&' + csrfTokenName + "="	+ csrfTokenValue;
		var me = this;
		//var strUrl = 'getDepositImage.srvc?$imageNmbr=' + imageNmbr + '&' + csrfTokenName + "="	+ csrfTokenValue;
		$.ajax(
		{
			type : 'POST',
			//data : JSON.stringify( arrayJson ),
			url : strUrl,
			//contentType : "application/json",
			dataType : 'html',
			success : function(data)
			{
				var $response = $(data);
				$('#pathPopup').html($response.find('#popupContainer'));	
				$('#pathPopup').dialog(
				{
					bgiframe : true,
					autoOpen : false,
					height : "auto",
					modal : true,
					resizable : true,
					width : "auto",
					title : 'Deposit Image'
					
				} );
				$( '#dialogMode' ).val( '1' );
				$( '#pathPopup' ).dialog( 'open' );
			},
			error : function( request, status, error )
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
	},
	*/
	createFormField : function( element, type, name, value )
	{
		var inputField;
		inputField = document.createElement( element );
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	updateInterfaceFieldMappingList : function()
	{
		var me = this;
		var form = document.forms[ "frmMain" ];
		var url = 'updateDownloadInterfaceFieldMappingList.srvc?$viewState=' + encodeURIComponent( viewState )
			+ '&?interfaceMapMasterViewState=' + encodeURIComponent( interfaceMapMasterViewState ) + '&'
			+ csrfTokenName + '=' + csrfTokenValue;
		var grid = this.getFieldMappingEditGrid();
		var isCheckedRemoved = false;

		if( !Ext.isEmpty( grid ) )
		{
			var mandatoryVal = 'N';
			var records = grid.store.data.items;
			var t0 = new Date().getTime();
			for( var index = 0 ; index < records.length ; index++ )
			{
				if( records[ index ].raw.fieldType == 1 || records[ index ].raw.fieldType == 3 )
					mandatoryVal = 'Y';
				else
				{
					if( null != records[ index ].data.mandatoryDesc )
					{
						if( "YES" == records[ index ].data.mandatoryDesc )
						{
							mandatoryVal = 'Y';
						}
					}
				}
				
				// For Database
				if(formatType == 'Database'){
					if(null != records[ index ].data.absoluteXpath1 && '' != records[ index ].data.absoluteXpath1){
						records[ index ].data.seqNmbr = index +1;
					}
					else{
						records[ index ].data.seqNmbr = null;
					}
				}
				
				if( !isCheckedRemoved && records[index].data.checkMapping == 'N' && records[ index ].data.bandType != 'CUSTOM' )
				{
					isCheckedRemoved = true;
				}

				form.appendChild(me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails['+index+'].mandatory', mandatoryVal));
				createFormFields(index,records,form);
				
			}
			if( records.length > 0 )
			{
				form.method = 'POST';
				form.action = url;
				
				if( isCheckedRemoved && cloneRestrictedFlag == 'RESTRICTED_ENABLE')
				{
					Ext.Msg.confirm( 'Delete Band', 'You are about to Field Mapping(s) for Clone restricted Interface. Later you cannot add Interface Field. Do you want to Continue.....? ',
					function( id, value )
					{
						if( id === 'yes' )
						{
							form.submit();
						}
						else
						{
							form.action = 'showDownloadInterfaceFieldMapping.srvc';
							form.submit();
						}
					}, this );
				}
				else
				{
					form.submit();
				}
			}
			else
			{
				form.submit();
			}

		}
	},
    updateInterfaceFieldMappingListAndNext : function()
	{
		var me = this;
		var form = document.forms[ "frmMain" ];
		var url = 'downloadInterfaceHooksInfo.srvc?$viewState=' + encodeURIComponent( viewState )
			+ '&?interfaceMapMasterViewState=' + encodeURIComponent( interfaceMapMasterViewState ) + '&'
			+ csrfTokenName + '=' + csrfTokenValue;
		var grid = this.getFieldMappingEditGrid();
		var isCheckedRemoved = false;

		if( !Ext.isEmpty( grid ) )
		{
			var mandatoryVal = 'N';
			var records = grid.store.data.items;
			var t0 = new Date().getTime();
			for( var index = 0 ; index < records.length ; index++ )
			{
				if( records[ index ].raw.fieldType == 1 || records[ index ].raw.fieldType == 3 )
					mandatoryVal = 'Y';
				else
				{
					if( null != records[ index ].data.mandatoryDesc )
					{
						if( "YES" == records[ index ].data.mandatoryDesc )
						{
							mandatoryVal = 'Y';
						}
					}
				}
				
				// For Database
				if(formatType == 'Database'){
					if(null != records[ index ].data.absoluteXpath1 && '' != records[ index ].data.absoluteXpath1){
						records[ index ].data.seqNmbr = index +1;
					}
					else{
						records[ index ].data.seqNmbr = null;
					}
				}
				
				if( !isCheckedRemoved && records[index].data.checkMapping == 'N' && records[ index ].data.bandType != 'CUSTOM' )
				{
					isCheckedRemoved = true;
				}

				
				form.appendChild(me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails['+index+'].mandatory', mandatoryVal));
				createFormFields(index,records,form);
				var t1 = new Date().getTime();
				if((navigator.userAgent.indexOf('Trident')||navigator.userAgent.indexOf('Chrome') > -1) && (t1-t0) > 1000 )
					break;
			}
			if( records.length > 0 )
			{
				form.method = 'POST';
				form.action = url;
				
				if( isCheckedRemoved && cloneRestrictedFlag == 'RESTRICTED_ENABLE')
				{
					Ext.Msg.confirm( 'Delete Band', 'You are about to Field Mapping(s) for Clone restricted Interface. Later you cannot add Interface Field. Do you want to Continue.....? ',
					function( id, value )
					{
						if( id === 'yes' )
						{
							form.submit();
						}
						else
						{
							form.action = 'showDownloadInterfaceFieldMapping.srvc';
							form.submit();
						}
					}, this );
				}
				else
				{
					form.submit();
				}
			}
			else
			{
			  var url = 'downloadInterfaceHooksInfo.srvc?$viewState=' + encodeURIComponent( viewState )
						+ '&?interfaceMapMasterViewState=' + encodeURIComponent( interfaceMapMasterViewState ) + '&'
						+ csrfTokenName + '=' + csrfTokenValue;
						showNextTab(url);
			}

		}
	},

	createComboField : function( fieldId, defaultValue, optionsValue )
	{
		var objStore = null;
		var strDisplayField, strValueField;
		if( optionsValue && optionsValue.length > 0 )
		{
			objStore = Ext.create( 'Ext.data.Store',
			{
				fields :
				[
					'code', 'description'
				],
				autoLoad : true,
				data : optionsValue && optionsValue.length > 0 ? optionsValue : []
			} );
			strDisplayField = 'description';
			strValueField = 'code';
		}
		var field = Ext.create( 'Ext.form.field.ComboBox',
		{
			displayField : strDisplayField,
			fieldCls : 'xn-form-field',
			triggerBaseCls : 'xn-form-trigger',
			valueField : strValueField,
			itemId : fieldId,
			name : fieldId,
			editable : false,
			value : defaultValue ? defaultValue : '',
			defValue : defaultValue ? defaultValue : '',
			store : objStore
		} );
		return field;
	},

	handleLoadGridData : function( grid, url, pgSize, newPgNo, oldPgNo, sorter )
	{
		var me = this;
		var strUrl = url;
		fieldMappingGridRef = me.getFieldMappingEditGrid();
		//		strUrl = strUrl + '?$viewState='+encodeURIComponent(viewState)+'&$bandName='+bandName+'&$fieldTypes='+me.fieldTypes+'&'+csrfTokenName+'='+csrfTokenValue;
		strUrl = url + '&$viewState=' + encodeURIComponent( viewState ) + '&?interfaceMapMasterViewState='
			+ encodeURIComponent( interfaceMapMasterViewState ) + '&' + csrfTokenName + '=' + csrfTokenValue;
		grid.loadGridData( strUrl );
	},
	/*setBandName : function(grid, data, args)
	{
		var me = this;
		if(!Ext.isEmpty(data) && !Ext.isEmpty(data.d) && !Ext.isEmpty(data.d.fieldMapping))
			selectedBand = data.d.fieldMapping[0].bandName
	},*/
	openBandDetailGrid : function( btn )
	{
		var me = this;
		var fieldMappingGrid = me.getFieldMappingEditGrid();
		var strUrl = me.listURL;
		if( !Ext.isEmpty( btn.name ) && !Ext.isEmpty( fieldMappingGrid ) )
		{
			selectedBand = btn.name;
			me.loadFieldMappDynamicFieldItem();
			strUrl = strUrl + '?$viewState=' + encodeURIComponent( viewState ) + '&?interfaceMapMasterViewState='
				+ encodeURIComponent( interfaceMapMasterViewState ) + '&$bandName=' + selectedBand + '&$fieldTypes='
				+ me.fieldTypes + '&' + csrfTokenName + '=' + csrfTokenValue;
			fieldMappingGrid.loadGridData( strUrl, null );
		}

		/*me.getFieldBandListPanelRef().items.each( function( item )
		{
			item.removeCls( 'xn-custom-heighlight' );
			item.addCls( 'xn-account-filter-btnmenu' );
		} );
		btn.addCls( 'xn-custom-heighlight xn-account-filter-btnmenu' );*/
	},
	openFilterFieldsGrid : function( btn )
	{
		var me = this;
		var strUrl = me.listURL + '?$bandName=' + selectedBand + '&$fieldTypes=' + btn.name;
		var editGrid = me.getFieldMappingEditGrid();
		editGrid.destroy( true );
		if( objDefaultGridViewPref )
			me.loadFieldsGrid( objDefaultGridViewPref, strUrl );

		/*me.getFieldMappingInfoToolBar().items.each( function( item )
		{
			item.removeCls( 'xn-custom-heighlight' );
			item.addCls( 'xn-account-filter-btnmenu' );
			if( item.code === 'view' )
				item.addCls( 'xn-custom-heighlight xn-account-filter-btnmenu' );
		} );

		me.getFieldMappingFieldsToolBar().items.each( function( item )
		{
			item.removeCls( 'xn-custom-heighlight' );
			item.addCls( 'xn-account-filter-btnmenu' );
		} );
		if( !btn.code )
			btn.addCls( 'xn-custom-heighlight xn-account-filter-btnmenu' );
		
		me.getFieldMappingCreateItemPanel().hide();*/
	},
	openFieldMappingGrid : function( btn )
	{
		var me = this;
		/*me.getFieldMappingInfoToolBar().items.each( function( item )
		{
			item.removeCls( 'xn-custom-heighlight' );
		} );

		me.getFieldMappingFieldsToolBar().items.each( function( item )
		{
			item.removeCls( 'xn-custom-heighlight' );
		} );
		if( !btn.code )
			btn.addCls( 'xn-custom-heighlight xn-account-filter-btnmenu' );*/
		var editGrid = me.getFieldMappingEditGrid();
		editGrid.destroy( true );
		me.handleSmartGridConfig();
		
		//me.getFieldMappingCreateItemPanel().show();
	},
	getFieldColumns : function( arrColsPref, objWidthMap )
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
				cfgCol.sortable = false;

				if( objCol.colId === 'displayPath'
					&& !( formatType === FormatType.XML || formatType === FormatType.SWIFT
						|| formatType === FormatType.FEDWIRE || formatType === FormatType.BIGBATCH ) )
					cfgCol.hidden = true;

				if( objCol.colId === 'checkMapping' )
					cfgCol.hidden = true;
				

				cfgCol.width = !Ext.isEmpty( objWidthMap[ objCol.colId ] ) ? objWidthMap[ objCol.colId ] : 120;
				arrCols.push( cfgCol );
			}
		}
		return arrCols;
	},
	loadFieldsGrid : function( data, url )
	{
		var me = this;
		var objPref = null, arrCols = new Array(), arrColsPref = null, pgSize = null;
		var cellEditGrid = null;
		var objWidthMap =
		{
			"checkMapping" : 40,
			"interfaceField" : 200,
			"dataType" : 80,
			"length" : 60,
			"bandMappingDesc" : 80,
			"destField": 80,
			"defValue": 80,
			"mandatoryDesc" : 80,
			"columnFormat" : 120,
			"decimalValue" : 60,
			"seqNmbr" : 80,
			"size" : 80,
			"alignment" : 100,
			"filler" : 100,
			"displayPath" : 100
		};
		objPref = data[ 0 ];
		arrColsPref = objPref.gridCols;
		arrCols = me.getFieldColumns( arrColsPref, objWidthMap );
		pgSize = !Ext.isEmpty( objPref.pgSize ) ? parseInt( objPref.pgSize,10 ) : 5;

		cellEditGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
		{
			id : 'fieldMappingEditGridId',
			itemId : 'fieldMappingEditGridId',
			pageSize : pgSize,
			cls : 't7-grid',
			autoDestroy : true,
			stateful : false,
			showEmptyRow : false,
			hideRowNumbererColumn : false,
			enableCellEditing : false,
			showCheckBoxColumn : false,
			padding : '10 10 10 10',
			showPager : false,
			rowList :
			[
				5, 10, 15, 20, 25, 30
			],
			minHeight : 140,
			maxHeight : 280,
			height : 'auto',
			columnModel : arrCols,
			storeModel :
			{
				fields :
				[
					'interfaceCode', 'processCode', 'bandName', 'mappingType', 'interfaceField', 'sourceFieldName',
					'dataType', 'length', 'mandatoryDesc', 'columnFormat', 'decimalValue', 'seqNmbr', 'size','alignment','filler',
					'bandMappingDesc', 'relativeXpath', 'absoluteXpath1', 'displayPath', 'identifier', '__metadata'
				],
				proxyUrl : url,
				rootNode : 'd.fieldMapping'
			},
			//isRowIconVisible : me.isRowIconVisible,
			handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
			{
				me.handleRowIconClick( tableView, rowIndex, columnIndex, btn, event, record );
			}
		} );

		var editGirdView = me.getFieldInfoEditGrid();
		editGirdView.add( cellEditGrid );
		editGirdView.doLayout();
	},
	handleType : function( btn )
	{
		var me = this;
		/*me.getFieldMappingInfoToolBar().items.each( function( item )
		{
			item.removeCls( 'xn-custom-heighlight' );
			item.addCls( 'xn-account-filter-btnmenu' );
		} );
		btn.addCls( 'xn-custom-heighlight xn-account-filter-btnmenu' );*/

		if( btn.code === 'view' )
		{
			me.openFilterFieldsGrid( btn );
			/*me.getFieldMappingFieldsToolBar().items.each( function( item )
			{
				item.removeCls( 'xn-custom-heighlight' );
				item.addCls( 'xn-account-filter-btnmenu' );
				if( item.name === 'FILE' )
					item.addCls( 'xn-custom-heighlight xn-account-filter-btnmenu' );
			} );*/
		}
		else
		{
			/*me.getFieldMappingFieldsToolBar().items.each( function( item )
			{
				item.removeCls( 'xn-custom-heighlight' );
				item.addCls( 'xn-account-filter-btnmenu' );
			} );*/
			var editGrid = me.getFieldMappingEditGrid();
			editGrid.destroy( true );
			me.handleSmartGridConfig();
		}

	},
	getBandAbsoluteXpath : function( jsonData )
	{
		var me = this;
		me.mapBandDetails = new Ext.util.HashMap();
		for( var i = 0 ; i < jsonData.length ; i++ )
		{
			if(selectedBand == null || selectedBand == '' || selectedBand == undefined){
				selectedBand = jsonData[0].bandName;
			}
			me.mapBandDetails.add( jsonData[ i ].bandName, jsonData[ i ].absoluteXpath1 );
		}
		me.loadFieldMappDynamicFieldItem();
	},

	columnFormatBeforeEdit : function( edit, e )
	{
		var me = this;
		var field = edit.context.field;
		var value = e.record.data.columnFormat;

		if( e.record.get( 'dataType' ) === 'DATE' )
		{
			e.column.setEditor( me.createComboField( field, value, arrDateFormat ) );
			return true;
		}
		else if( e.record.get( 'dataType' ) === 'DATETIME' )
		{
			e.column.setEditor( me.createComboField( field, value, arrDateTimeFormats ) );
			return true;
		}
		else if( e.record.get( 'dataType' ) === 'DECIMAL' )
		{
			e.column.setEditor( me.createComboField( field, value, arrDecimalFormats ) );
			return true;
		}
		else
			return false;
	},
	doAddRefreshField : function( bandIdPosition )
	{
		if( !Ext.isEmpty( bandIdPosition ) )
		{
			var me = this;
			var form = document.forms[ "frmMain" ];
			var url = 'getCustomFields.srvc?$viewState=' + encodeURIComponent( viewState )
				+ '&?interfaceMapMasterViewState=' + encodeURIComponent( interfaceMapMasterViewState )
				+ '&$idPosition=' + bandIdPosition + '&$currentbandName=' + selectedBand + '&' + csrfTokenName + '='
				+ csrfTokenValue;
			var grid = this.getFieldMappingEditGrid();

			if( !Ext.isEmpty( grid ) )
			{
				var mandatoryVal = 'N';
				var records = grid.store.data.items;
				for( var index = 0 ; index < records.length ; index++ )
				{
					if( records[ index ].raw.fieldType == 1 || records[ index ].raw.fieldType == 3 )
						mandatoryVal = 'Y';
					else
						mandatoryVal = 'N';

					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index
						+ '].interfaceCode', records[ index ].data.interfaceCode ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index
						+ '].processCode', records[ index ].data.processCode ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index
						+ '].checkMapping', records[ index ].data.checkMapping ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].bandName',
						records[ index ].data.bandName ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].bandType',
						records[ index ].data.bandType ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index
						+ '].recordKeyNo', records[ index ].data.recordKeyNo ) );// This should pass in encrypted format(in veiw state)
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].mandatory',
						mandatoryVal ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index
						+ '].interfaceField', records[ index ].data.interfaceField ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index
						+ '].mappingType', records[ index ].data.mappingType ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index
						+ '].columnFormat', records[ index ].data.columnFormat ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index
						+ '].decimalValue', records[ index ].data.decimalValue ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].seqNmbr',
						records[ index ].data.seqNmbr ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].alignment',
							records[ index ].data.alignment ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].filler',
							records[ index ].data.filler ) );
					if( "Y" == records[ index ].data.checkMapping
						&& ( "" == records[ index ].data.size || null == records[ index ].data.size ) )
					{
						records[ index ].data.size = records[ index ].data.length;
					}
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].size',
						records[ index ].data.size ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].dataType',
						records[ index ].data.dataType ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].length',
						records[ index ].data.length ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index
						+ '].absoluteXpath1', records[ index ].data.absoluteXpath1 ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index
						+ '].relativeXpath', records[ index ].data.relativeXpath ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index
						+ '].displayPath', records[ index ].data.displayPath ) );
					//Setting Additional Advance Mapping Fields
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index
						+ '].fieldRemarks', records[ index ].data.fieldRemarks ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index
						+ '].defaultValue', records[ index ].data.defaultValue ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index
						+ '].constantValue', records[ index ].data.constantValue ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index
						+ '].translationFunctionName', records[ index ].data.translationFunctionName ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index
						+ '].resetRunningNoBand', records[ index ].data.resetRunningNoBand ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index
							+ '].batchTotalType', records[ index ].data.batchTotalType ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index
						+ '].bandNameRef', records[ index ].data.bandNameRef ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN',
						'mappingDetails[' + index + '].fieldIdRef', records[ index ].data.fieldIdRef ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN',
						'mappingDetails[' + index + '].codeMapRef', records[ index ].data.codeMapRef ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].fieldType',
						records[ index ].raw.fieldType ) );

				}
			}

			form.method = 'POST';
			form.action = url;
			form.submit();
		}
	}
} );

function setBandPath( xpath, pathComponent, txtSequenceNumberComponent, sequenceNumber )
{
	var record = recordRef;
	if( record != null && xpath != null && xpath != "" )
	{
		record.set( 'displayPath', xpath );
		if( formatType === FormatType.XML )
		{
			record.set( 'absoluteXpath1', record.get( 'displayPath' ) );
			record.set( 'relativeXpath', '' );
			if( null != sequenceNumber && 'undefined' != sequenceNumber )
			{
				record.set( 'seqNmbr', sequenceNumber );
			}
		}
		else if( formatType === FormatType.FEDWIRE )
		{
			record.set( 'displayPath', txtSequenceNumberComponent );
			record.set( 'relativeXpath', txtSequenceNumberComponent );
			record.set( 'absoluteXpath1', xpath );
		}
		else if( formatType == FormatType.BIGBATCH )
		{
			record.set( 'displayPath', txtSequenceNumberComponent );
			record.set( 'relativeXpath', txtSequenceNumberComponent );
			record.set( 'absoluteXpath1', xpath );
		}
		else
		{
			if( record.get( 'mappingType' ) == '1' || record.get( 'mappingType' ) == '4'
				|| record.get( 'mappingType' ) == '5' || record.get( 'mappingType' ) == '6'
				|| record.get( 'mappingType' ) == '8' || record.get( 'mappingType' ) == '9' )
			{
				record.set( 'absoluteXpath1', record.get( 'displayPath' ) );
				record.set( 'relativeXpath', '' );
			}
			else
			{
				record.set( 'relativeXpath', record.get( 'displayPath' ) );
			}
		}
	}
}

function setCheckBoxValue( rowIndex, checkbox )
{
	if( checkbox.checked == true )
		fieldMappingGridRef.store.data.items[ rowIndex ].data.checkMapping = "Y";
	else
		fieldMappingGridRef.store.data.items[ rowIndex ].data.checkMapping = "N";
}

function callUpdateInterfaceFieldMapping()
{
	GCP.getApplication().fireEvent( 'updateInterfaceFieldMapping' );
}
function callUpdateInterfaceFieldMappingAndNext()
{
	GCP.getApplication().fireEvent( 'updateInterfaceFieldMappingAndNext' );
}
function createFormFields(index,records,form)
{
	var me = this;
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].interfaceCode',
			records[ index ].data.interfaceCode ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].processCode',
			records[ index ].data.processCode ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].checkMapping',
			records[ index ].data.checkMapping ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].bandName',
			records[ index ].data.bandName ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].bandType',
			records[ index ].data.bandType ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].recordKeyNo',
			records[ index ].data.recordKeyNo ) );// This should pass in encrypted format(in veiw state)
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN',
			'mappingDetails[' + index + '].interfaceField', records[ index ].data.interfaceField ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].mappingType',
			records[ index ].data.mappingType ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].columnFormat',
			records[ index ].data.columnFormat ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].decimalValue',
			records[ index ].data.decimalValue ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].seqNmbr',
			records[ index ].data.seqNmbr ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].filler',
				records[ index ].data.filler ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].alignment',
				records[ index ].data.alignment ) );
		if( "Y" == records[ index ].data.checkMapping
			&& ( "" == records[ index ].data.size || null == records[ index ].data.size ) )
		{
			records[ index ].data.size = records[ index ].data.length;
		}
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].size',
			records[ index ].data.size ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].dataType',
			records[ index ].data.dataType ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].length',
			records[ index ].data.length ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN',
			'mappingDetails[' + index + '].absoluteXpath1', records[ index ].data.absoluteXpath1 ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].relativeXpath',
			records[ index ].data.relativeXpath ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].displayPath',
			records[ index ].data.displayPath ) );
		//Setting Additional Advance Mapping Fields
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].fieldRemarks',
			records[ index ].data.fieldRemarks ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].defaultValue',
			records[ index ].data.defaultValue ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].constantValue',
			records[ index ].data.constantValue ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index
			+ '].translationFunctionName', records[ index ].data.translationFunctionName ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].resetRunningNoBand',
			records[ index ].data.resetRunningNoBand ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].batchTotalType',
				records[ index ].data.batchTotalType ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].bandNameRef',
			records[ index ].data.bandNameRef ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].fieldIdRef',
			records[ index ].data.fieldIdRef ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].codeMapRef',
			records[ index ].data.codeMapRef ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].fieldType',
			records[ index ].raw.fieldType ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].xmlNamespace',
			records[ index ].data.relativeXpath ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].xmlNamespaceURI',
			records[ index ].data.constantValue ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].order',
			records[ index ].data.order ) );
		if( records[ index ].data.priority != null && records[ index ].data.priority != '' )
		{
			form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'mappingDetails[' + index + '].priority',
				records[ index ].data.priority ) );
		}
}
