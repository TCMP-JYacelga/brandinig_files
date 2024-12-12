Ext.define( 'GCP.view.LMSInterestProfileEntryDetailGridView',
{
	extend : 'Ext.grid.Panel',
	xtype : 'lmsInterestProfileEntryDetailGridViewType',
	requires :
	[
		'Ext.panel.Panel', 'Ext.button.Button', 'Ext.window.MessageBox','Ext.grid.plugin.CellEditing'
	],
	modal : true,
	height : 'auto',
	overflow : 'auto',
	closeAction : 'hide',
	width : '100%',
	layout : 'fit',
	cls : 'ux_largepadding ux_panel-transparent-background',
	parent : this,
	globalBaseRateCode :null ,
	plugins :
	[
		Ext.create( 'Ext.grid.plugin.CellEditing',
		{
			clicksToEdit : 1,
			parent : this,
			listeners :
			{
				beforeedit : function( e, editor )
				{
					if( pageMode == 'view')
						return false;
					if( e.context.field == 'frmAmt' )
					{
						return false;
					}
					else if( e.context.field == 'toAmt' )
					{
						var slabType = this.parent.GCP.getApplication().controllers.items[ 0 ].getLmsInterestProfileEntryView().down(
							'combobox[itemId="slabType"]' ).getValue();
						if( slabType != null && slabType == '1') // Direct
						{
							editor.record.get( 'toAmt', 0);
							return false;
						}
						return true;
					}
					else if( e.context.field == 'interestRate' )
					{
						/*
						 * Edit interest type in case of fixed only.
						 */
						if( editor.record.get( 'rateType' ) == 'F' || editor.record.get( 'rateType' ) == 'Fixed' )
						{
							return true;
						}
						else
						{
							return false;
						}
					}
					else if( e.context.field == 'baseRateCodeDesc' )
					{
						/*
						 * Edit Bench mark rate in case of variable only.
						 */
						if( editor.record.get( 'rateType' ) == 'V' || editor.record.get( 'rateType' ) == 'Variable' )
						{
							return true;
						}
						else
						{
							return false;
						}
					}
					else if( e.context.field == 'spread' )
					{
						if( editor.record.get( 'rateType' ) == 'V' || editor.record.get( 'rateType' ) == 'Variable' )
						{
							return true;
						}
						else
						{
							return false;
						}
					}
				},
				afteredit : function( e, editor )
				{
					$('#dirtyBit').val('1');
					if( e.context.field == 'toAmt' )
					{
						var toAmt = editor.record.get( 'toAmt' )
						var frmAmt = editor.record.get( 'frmAmt' )
						if( toAmt == 0 )
						{
							/*
							 * Need to disable the add slab button addSlabButton
							 * Here not getting the handle of button.
							 */
						}
						if( toAmt <= frmAmt && toAmt != 0 )
						{
							Ext.MessageBox.alert( 'Error',
								'\"To Amount\" can not be less than or equal to \"From Amount".' );
							editor.record.set( 'toAmt', null);
						}
					}
					else if( e.context.field == 'frmAmt' )
					{
						var toAmt = editor.record.get( 'toAmt' )
						var frmAmt = editor.record.get( 'frmAmt' )
						if( toAmt <= frmAmt && toAmt != 0 )
						{
							Ext.MessageBox.alert( 'Error',
								'\"To Amount\" can not be less than or equal to \"From Amount".' );
							editor.record.get( 'frmAmt' ) = null;
						}
					}
					else if( e.context.field == 'rateType' )
					{
						var rateTypeValue =  editor.record.get( 'rateType' );
						if( 'F' == rateTypeValue || 'Fixed' ==  rateTypeValue)
						{
							editor.record.set('baseRateCodeDesc',null);
							editor.record.set('baseRateCode',null);
							editor.record.set('spread',null);
						}
						else if( 'V' == rateTypeValue || 'Variable' ==  rateTypeValue)
						{
							editor.record.set('interestRate',null);
						}
					}
					else if(e.context.field == 'baseRateCodeDesc')
					{
						editor.record.set('baseRateCode',globalBaseRateCode);
					}
					else if(e.context.field == 'interestRate')
					{
						var interestRate =  editor.record.get( 'interestRate' );

						if(interestRate > 100)
						{
							Ext.MessageBox.alert( 'Error','\"Fixed Rate (%) \" exceeds maximum value of 100.0000 \".' );
							editor.record.set( 'interestRate' ) = null;
				}
			}
				}
			}
		} )
	],
	selModel :
	{
		selType : 'cellmodel'
	},
	initComponent : function()
	{
		var me = this;
		var entryForm = null;

		var url = 'lmsInterestProfileDtlList.srvc' + '?' + csrfTokenName + '=' + csrfTokenValue + '&$viewState='
			+ encodeURIComponent( document.getElementById( 'viewState' ).value)
			+ '&$showCancel=' + showCancel + '&$profileDate=' + profileDate;
		
		if( ! Ext.isEmpty( dtlParentRecKey ) )
		{
			url = url + '&$dtlParentRecKey=' + dtlParentRecKey + '&$dtlIsActive=' + dtlIsActive + '&$dtlLastChangedDate=' + dtlLastChangedDate;
		}
		
		var baseRateURL = 'getLMSBaseRates.srvc' + '?' + csrfTokenName + '=' + csrfTokenValue + '&$viewState='
			+ encodeURIComponent( document.getElementById( 'viewState' ).value ) + '&$currency='+ccyCode;
		this.store = Ext.create( 'Ext.data.Store',
		{
			storeId : 'detailStore',
			autoLoad : true,
			fields :
			[
				'frmAmt', 'toAmt', 'rateType', 'interestRate', 'baseRateCode', 'spread', 'viewState',
				'internalSeqNmbr', 'identifier', 'isDeleted','baseRateCodeDesc'
			],
			remoteSort : false,
			proxy :
			{
				type : "ajax",
				method : 'POST',
				url : url,
				reader :
				{
					type : 'json',
					root : 'd.profile',
					totalProperty : "count"
				}
			},
			filterOnLoad : true
		} );

		var benchMarkRateStore = Ext.create( 'Ext.data.Store',
		{
			storeId : 'benchMarkRateStore',
			autoLoad : true,
			fields :
			[
				'code', 'description'
			],
			remoteSort : false,			
			proxy :
			{
				type : "ajax",
				method : 'POST',
				url : baseRateURL,
				reader :
				{
					type : 'json',
					root : 'd.profile',
					totalProperty : "count"
				}
			}
		} );

		var rateTypeStore = Ext.create( 'Ext.data.Store',
		{
			fields :
			[
				'key', 'value'
			],
			data :
			[
				{
					"key" : "Fixed",
					"value" : getLabel("fixed","Fixed")
				},
				{
					"key" : "Variable",
					"value" : getLabel("variable","Variable")
				}
			]
		} );

		this.columns =
		[
			{
				xtype : 'checkcolumn',
				text : '',
				sortable : false,
				hideable: false,
				resizable: false,
				draggable: false,
				menuDisabled: true,
				dataIndex : 'isDeleted',
				width : '5%',
				hidden : !showCancel || pageMode == 'view'
			},
			{
				header : getLabel('amtFrom','Amount From'),
				dataIndex : 'frmAmt',
				width : '15%',
				align : 'right',
				editor :
				{
					xtype : 'numberfield',
					hideTrigger : true,
					align : 'right',
					minValue : 0,
					maxLength : 20,
					enforceMaxLength : true,
					allowDecimals:true,
			        alwaysDisplayDecimals: true
				},
				renderer : function( value, metaData, record, rowIndex )
				{
					Ext.util.Format.thousandSeparator = strGroupSeparator;
					Ext.util.Format.decimalSeparator = strDecimalSeparator;
					Ext.util.Format.currencyPrecision = strAmountMinFraction;
					var convertedZeroFormat = strAmountFormat.replace(/#/g,'0');
					value = Ext.util.Format.number(value, convertedZeroFormat);
					return value;
				}
			},
			{
				header : getLabel('amtTo','Amount To'),
				dataIndex : 'toAmt',
				width : '15%',
				align : 'right',
				editor :
				{
					xtype : 'numberfield',
					hideTrigger : true,
					align : 'right',
					minValue : 0,
					maxLength : 20,
					enforceMaxLength : true,
					allowDecimals:true,
			        alwaysDisplayDecimals: true
				},
				renderer : function( value, metaData, record, rowIndex )
				{
					Ext.util.Format.thousandSeparator = strGroupSeparator;
					Ext.util.Format.decimalSeparator = strDecimalSeparator;
					Ext.util.Format.currencyPrecision = strAmountMinFraction;
					var convertedZeroFormat = strAmountFormat.replace(/#/g,'0');
					value = Ext.util.Format.number(value, convertedZeroFormat); //output 123.4567
					return value;
				}
			},
			{
				header : getLabel('rateType','Rate Type'),
				dataIndex : 'rateType',
				width : '15%',
				editor :
				{
					xtype : 'combobox',
					store : rateTypeStore,
					queryMode : 'local',
					displayField : 'value',
					valueField : 'key',
					editable : false
				},
				renderer : function( value, metaData, record, rowIndex )
				{
					if( 'F' == value )
					{
						return 'Fixed';
					}
					else if( 'V' == value )
					{
						return 'Variable';
					}
					else
					{
						return value;
					}
				}

			},
			{
				header : getLabel('fixedRate','Fixed Rate')+' (%)',
				dataIndex : 'interestRate',
				width : '15%',
				align : 'right',
				editor :
				{
					xtype : 'numberfield',
					align : 'right',
					decimalPrecision : 4,
					minValue:0,
					hideTrigger : true,
					enableKeyEvents:true,
					listeners : {
						'keypress' : {
							fn : function(field, e) {
								var val = field.getValue();
								if (/\.[0-9]{4,}/.test(val)) {
									e.stopEvent();
								}
								return;
							}
						}
					}						
				},
				renderer : function( value, metaData, record, rowIndex )
				{//Format of Rate should be fixed irrespective of language master.
					Ext.util.Format.thousandSeparator = ",";
					Ext.util.Format.decimalSeparator = ".";				
					value = Ext.util.Format.number(value, '000.0000'); //output 123.4567
					return value;
				}
			},
			{
				header : getLabel('benchmarkRate','Benchmark Rate'),
				dataIndex : 'baseRateCodeDesc',
				width : '25%',
				editor :
				{
					xtype : 'combobox',
					store : benchMarkRateStore,
					queryMode : 'local',
					displayField : 'description',
					valueField : 'description',
					editable : false,
					listeners :
					{
						select : function( combo, record, index )
						{
							//record[ 0 ].data.CODE
							globalBaseRateCode = combo.displayTplData[0].code;
						}
					}
				}
			},
			{
				header : getLabel('spread','Spread')+' (%)',
				dataIndex : 'spread',
				width : '10%',
				align : 'right',
				editor :
				{
					xtype : 'numberfield',
					decimalPrecision : 4,
					maxValue : 999,
					align : 'right',
					hideTrigger : true
				}
			}
		];
		this.callParent( arguments );
	}
} );
