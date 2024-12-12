Ext.define( 'GCP.view.CurrencyRateMstFilterView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'currencyRateMstFilterViewType',
	requires :
	[
		'Ext.form.ComboBox', 'Ext.data.Store'
	],
	width : '100%',
	componentCls : 'gradiant_back',
	collapsible : true,
	collapsed : true,
	cls : 'xn-ribbon ux_border-bottom',
	layout :
	{
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function()
	{
		var me = this;
		pmtSummaryView = this;
		var orderingPartyNameSeekURL = null;
		var storeData = null;
		var filterContainerArr = new Array();
		var multipleSellersAvailable = false;
		var jsonArr = [];

		Ext.Ajax.request(
		{
			url : 'services/getSellerList.json' + "?" + csrfTokenName + "=" + csrfTokenValue,
			method : 'POST',
			async : false,
			success : function( response )
			{
				var data = Ext.decode( response.responseText );
				if( !Ext.isEmpty( data ) )
				{
					storeData = data;
				}
			},
			failure : function( response )
			{
				// console.log("Ajax Get data Call Failed");
			}

		} );
		var objStore = Ext.create( 'Ext.data.Store',
		{
			fields :
			[
				'sellerCode', 'description'
			],
			data : storeData,
			reader :
			{
				type : 'json',
				root : 'sellerList'
			}
		} );
		if( objStore.getCount() > 1 )
		{
			multipleSellersAvailable = true;
		}

		var currencyRateMstFilterContainer =
		{
			xtype : 'container',
			layout : 'hbox',
		//	columnWidth : 0.40,
		//	padding : '0px 0px 0px 0px',
			items :
			[
				
				{
					xtype : 'panel',
					layout : 'vbox',
					padding : '0 200 10 0',
					hidden : storeData.length > 1 ?  false : true,
					items :
					[
						{
							xtype : 'label',
							text : getLabel( 'financialInstitution', 'Financial Institution' ),
							cls : 'frmLabel'
						},
						{
							xtype : 'combo',
							displayField : 'description',
							cls : 'w15',
							fieldCls : 'xn-form-field inline_block',
							triggerBaseCls : 'xn-form-trigger',
							filterParamName : 'sellerCode',
							itemId : 'sellerCodeComboBox',
							valueField : 'sellerCode',
							name : 'sellerCombo',
							editable : false,
							value : sellerDesc,
							store : objStore,
							listeners : {
								'select' : function(combo, strNewValue, strOldValue) {
									setAdminSeller(combo.getValue());
								}
							}
						}

					]
				},
				{
					xtype : 'panel',
					layout : 'vbox',
					padding : '10px 80px 5px 0px',
					items :
					[
						{
							xtype : 'label',
							padding : '0px 0px 5px 0px',
							text : getLabel( 'lblUpLoadDate', 'Upload Date' ),
							cls : 'ux_font-size14'
						},
						{
							xtype : 'datefield',
							itemId : 'uploadDateFieldItemId',
							hideTrigger : true,
							width : 80,
							fieldCls : 'h2',
							format : !Ext.isEmpty( strExtApplicationDateFormat ) ? strExtApplicationDateFormat
								: 'm/d/Y',
							padding : '0 0 0 0',
							parent : me,
							vtype : '',
							editable : false,
							value : new Date( Ext.Date.parse( dtApplicationDate, strExtApplicationDateFormat ) )
						}
					]
				},
				{
					xtype : 'panel',
					padding : '5px 0px 0px 100px',
					cls : 'xn-filter-toolbar',
					layout : 'vbox',
					items : [{
								xtype : 'label',
								text : getLabel('status', 'Status'),
								cls : 'frmLabel'
							}, {
								xtype : 'combo',
								width : 150,
								displayField : 'value',
								valueField : 'name',
								value : getLabel('all','ALL'),
								fieldCls : 'xn-form-field inline_block',
								triggerBaseCls : 'xn-form-trigger',
								filterParamName : 'statusFilter',
								itemId : 'statusFilter',
								name : 'statusCombo',
								editable : false,
								store : me.getStatusStore()
							}]
				},
				{
					xtype : 'panel',
					cls : 'xn-filter-toolbar',
					layout : 'vbox',
					items : [{
								xtype : 'panel',
							//	layout : 'hbox',
								padding : '28px 0px 5px 150px',
								items : [{
											xtype : 'button',
											itemId : 'btnFilter',
											text : getLabel('search',
													'Search'),
											cls : 'ux_button-padding ux_button-background ux_button-background-color'
										}]
							}]
				}
			]
		};

		filterContainerArr.push( currencyRateMstFilterContainer );

		this.items =
		[
			{
				xtype : 'container',
				width : '100%',
				layout : 'column',
				cls : 'ux_largepadding',
				items : filterContainerArr
			}
		];

		this.callParent( arguments );

		var sellerCombo = me.down( 'combobox[itemId=sellerFltId]' );

	},
	getStatusStore : function(){
		var objStatusStore = null;
		if (!Ext.isEmpty(arrStatusFilterLst)) {
			
			arrStatusFilterLst.push({
				name : 'ALL',
				value : getLabel('all','ALL')
			});					
			objStatusStore = Ext.create('Ext.data.Store', {
						fields : ['name','value'],
						data : arrStatusFilterLst,
						autoLoad : true,
						listeners : {
							load : function() {
							}
						}
					});
			objStatusStore.load();
		}
		return objStatusStore;
	},
	
	tools : []
} );
