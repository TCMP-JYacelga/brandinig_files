Ext.define( 'GCP.view.BalanceAdjustmentDtlGridView',
{
	extend : 'Ext.grid.Panel',
	xtype : 'balanceAdjustmentDetailGridViewType',
	requires :
	[
		'Ext.panel.Panel', 'Ext.button.Button', 'Ext.window.MessageBox','Ext.grid.plugin.CellEditing','Ext.ux.gcp.AutoCompleter'
	],
	modal : true,
	height : 'auto',
	overflow : 'auto',
	closeAction : 'hide',
	width : '100%',
	layout : 'fit',
	padding : 16,
	parent : this,
	autoScroll: true,
	cls : 'ux_largepadding ux_panel-transparent-background',
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
					if( pageMode == 'VIEW')
						return false;
				},
				afteredit : function( e, editor )
				{
					if( pageMode == 'VIEW')
						return false;
					if( e.context.field == 'accountName' )
					{
						return true ;
					}
					else if( e.context.field == 'fromDate' )
					{
						var fromDateTemp = editor.record.get( 'fromDate' );
						var toDateTemp = editor.record.get( 'toDate' );
						var fromDateStr = Ext.util.Format.date( editor.record.get( 'fromDate' ), extJsDateFormat );
						var toDateStr = Ext.util.Format.date( editor.record.get( 'toDate' ), extJsDateFormat );
						var fromDate = Ext.Date.parse( editor.record.get( 'fromDate' ), extJsDateFormat );
						var toDate =  Ext.Date.parse( editor.record.get( 'toDate' ), extJsDateFormat );
						var effectiveFromDate =  Ext.Date.parse(document.getElementsByName( "effectiveFromDate" )[0].value,extJsDateFormat) ;
						var errorMessage = null ;
						if (fromDate < effectiveFromDate) 
						{
							errorMessage = "From Date should be Greater than or Equal to Effctive From Date";
						}
						else if(fromDate > toDate )
						{
							errorMessage = "From Date should be less than or Equal to To Date";
						}
						if(errorMessage != null)
						{
							Ext.MessageBox.show(
									{
										title : getLabel('errorlbl', 'Error'),
										msg : errorMessage,
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									} );
						}
						editor.record.set( 'fromDate',fromDateStr );
						return true ;
					}
					else if( e.context.field == 'toDate' )
					{
						var fromDateTemp = editor.record.get( 'fromDate' );
						var toDateTemp = editor.record.get( 'toDate' );
						var fromDateStr = Ext.util.Format.date( editor.record.get( 'fromDate' ), extJsDateFormat );
						var toDateStr = Ext.util.Format.date( editor.record.get( 'toDate' ), extJsDateFormat );
						var fromDate = Ext.Date.parse( editor.record.get( 'fromDate' ), extJsDateFormat );
						var toDate = Ext.Date.parse( editor.record.get( 'toDate' ), extJsDateFormat );
						var effectiveToDate = Ext.Date.parse( document.getElementsByName( "effectiveToDate" )[0].value,extJsDateFormat);
						var errorMessage = null ;
						if (toDate > effectiveToDate) 
						{
							errorMessage = "To Date should be less than or Equal to Effctive To Date";
						}
						else if(fromDate > toDate)
						{
							errorMessage = "To Date should be greater than or Equal to From Date";
						}
						if(errorMessage != null)
						{
							Ext.MessageBox.show(
									{
										title : getLabel('errorlbl', 'Error'),
										msg : errorMessage,
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									} );
						}
						editor.record.set( 'toDate',toDateStr );
						return true ;
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
		var url = 'getBalanceAdjustmentDtlList.srvc' + '?' + csrfTokenName + '=' + csrfTokenValue + '&$viewState='
			+ encodeURIComponent( document.getElementById( 'viewState' ).value);
		this.store = Ext.create( 'Ext.data.Store',
		{
			storeId : 'detailStore',
			autoLoad : true,
			fields :
			[
				'nodeId', 'accountName', 'fromDate', 'toDate', 'ccyCode', 'balanceDelta', 'viewState','isDeleted'
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
					root : 'd.balanceAdjustmentDtlList',
					totalProperty : "count"
				}
			},
			filterOnLoad : true
		} );

		this.columns =
		[
			{
				xtype : 'checkcolumn',
				text : '',
				dataIndex : 'isDeleted',
				width : '4.8%',
				sortable: false,
				draggable: false,
				resizable: false,
				hideable: false,
				hidden : pageMode == 'VIEW' ? true : false
			},
			{
				xtype : 'actioncolumn',
				width : '5%',
				sortable: false,
				draggable: false,
				resizable: false,
				hideable: false,
				menuDisabled: true,
				align : 'center',
				items: 
					[
						{
							itemId : 'btnAttachAccount',
							//iconCls: 'linkbox seeklink',
							icon: 'static/images/icons/icon_search_1.png',
							tooltip : getLabel('viewToolTip', 'Attach Account'),
							getClass: function(value, metaData, record) {
								if (rowPageMode == 'VIEW' || rowPageMode == 'EDIT')
								{
									return 'xn-hide';
								}
								else
								{
									return ;
									//return 'linkbox seeklink';
								}
							},							
							handler: function(grid, rowIndex, colIndex, btn, event, record) {
								getAccountSeekWindow(record);
							}
						}
					]
			},
			{
				header : getLabel('accountNumber','Account Number'),
				dataIndex : 'accountName',
				width : '25%',
				align : 'left',
				editor :
					{
						xtype : 'textfield',
						hideTrigger : true,
						readOnly :	true ,
						minValue : 0
					},
					renderer : function( value, metaData, record, rowIndex )
					{
						var accountName = record.get('accountName');
						return accountName;
					}
			},
			{
				header : getLabel('fromDate','From Date'),
				dataIndex : 'fromDate',
				width : '20%',
				editor :
				{
					xtype : 'datefield',
					hideTrigger : true,
					editable : false,
					fieldCls : 'xn-form-text w14',
					itemId : 'fromDate',
					format : extJsDateFormat,
					readOnly :pageMode == 'VIEW' ? true : false
				}
			},
			{
				header : getLabel('toDate','To Date'),
				dataIndex : 'toDate',
				width : '20%',
				editor :
				{
					xtype : 'datefield',
					hideTrigger : true,
					editable : false,
					fieldCls : 'xn-form-text w14',
					itemId : 'toDate',
					format : extJsDateFormat,
					readOnly :pageMode == 'VIEW' ? true : false
				}
			},
			{
				header : getLabel('amount','+/- Amount'),
				dataIndex : 'balanceDelta',
				width : '25%',
				align : 'right',
				editor :
				{
					xtype : 'numberfield',
					hideTrigger : true,
					align : 'right',
					//minValue : 0,
					decimalPrecision : 2,
					maxLength : 20,
					enforceMaxLength : true,
			        readOnly :pageMode == 'VIEW' ? true : false,
			        enableKeyEvents:true,
			        listeners : {
						'keypress' : {
							fn : function(field, e) {
								var val = field.getValue();
								if (/\.[0-9]{2,}/.test(val)) {
									e.stopEvent();
								}
								return;
							}
						}
					}		
				},
				renderer : function( value, metaData, record, rowIndex )
				{
					Ext.util.Format.thousandSeparator = strGroupSeparator;
					Ext.util.Format.decimalSeparator = strDecimalSeparator;
					Ext.util.Format.currencyPrecision = strAmountMinFraction;
					var convertedZeroFormat = strAmountFormat.replace(/#/g,'0');
					value = Ext.util.Format.number(value, convertedZeroFormat);
					return value+ ' ' + '<font style="font-weight:bold">'+record.get('ccyCode')+'</font>';
				}
			}
		];
		this.callParent( arguments );
	}
} );
