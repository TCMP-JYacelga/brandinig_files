Ext.define('GCP.view.TaxRateMstFilterView',
{
	extend : 'Ext.panel.Panel',	
	xtype  : 'taxRateMstFilterView',
	requires :
		[
			'Ext.ux.gcp.AutoCompleter'
		],
	width : '50%',
	componentCls : 'gradiant_back',
	collapsible : true,
	cls : 'xn-ribbon',
	layout :
	{
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function()
	{
		if(entity_type === '0')
			{
			Ext.Ajax.request(
			{
			  url : 'services/sellerListFltr.json'+"?" + csrfTokenName + "=" + csrfTokenValue,
			  read :'POST',
			  async: false,
			  success : function( response )
				{
					var data = Ext.decode( response.responseText );
					var sellerData = data.filterList;
					if( !Ext.isEmpty( data ) ){
						storeData = data;
					}
				},
				failure : function(response)
				{
					// console.log("Ajax Get data Call Failed");
				}
			});
			
			var objStore = Ext.create('Ext.data.Store', {
				fields : ['sellerCode', 'description'],
				data : storeData,
				reader : {
					type : 'json',
					root : 'filterList'
				       }
				});
			if(objStore.getCount() > 1){
				multipleSellersAvailable = true;
			    }
			}
			var statusStore = Ext.create( 'Ext.data.Store',
					{
						fields :
						[
							"name", "value"
						],
						proxy :
						{
							type : 'ajax',
							autoLoad : true,
							url : 'cpon/statusList.json',
							actionMethods :
							{
								read : 'POST'
							},
							reader :
							{
								type : 'json',
								root : 'd.filter'
							}
						}
					} );
			
			this.items =
				[
					{
						xtype : 'panel',
						itemId : 'mainContainer',
						layout : 'hbox',
						items :
							[
								{
									//panel 1
									xtype : 'panel',
									itemId : 'firstRow',
									cls : 'xn-filter-toolbar',
									hidden : multipleSellersAvailable == true ? false : true,
									flex : 0.20,
							        layout :
							            {
								           type : 'vbox'
							            },
									    items :
										[
										  {
										    xtype : 'panel',
									       layout :
									               {
										           type : 'hbox'
									               },
										   items :
									              [
										            {
											        xtype : 'label',
											        text : getLabel( 'lbl.taxRateMst.seller', 'Financial Institution' ),
											        cls : 'tdfrmLabel',
											        padding : '6 0 0 0'
										            }
									              ]
										 },
											{
												xtype : 'combo',
												displayField : 'description',
												cls: 'w15',
												fieldCls : 'xn-form-field inline_block',
												triggerBaseCls : 'xn-form-trigger',
												filterParamName : 'sellerId',
												itemId : 'sellerFltId',
												valueField : 'sellerCode',
												name : 'sellerCombo',
												editable : false,
												value :strSellerId,
												store : objStore,
												padding : '6 0 0 0'
											}
											]
											},
											
											//Panel 2
											{
											  xtype : 'panel',
							                  cls : 'xn-filter-toolbar',
							                 flex : 0.20,
							                 layout :
							                   {
								                type : 'vbox'
							                   },
											  items :
											  [
											   {
											   xtype : 'panel',
									           layout :
									              {
										           type : 'hbox'
									               },
									           items :
									              [
										           {
											        xtype : 'label',
											        text : getLabel( 'lbl.taxRateMst.taxRateCode', 'Tax Rate Code' ),
											         cls : 'tdfrmLabel',
											        padding : '6 0 0 0'
										            }
									              ]
											  },
											  {
												  xtype : 'AutoCompleter',
													matchFieldWidth : true,
													width : '100%',
													fieldCls : 'xn-form-text w14 xn-suggestion-box',
													labelSeparator : '',
													name : 'taxRateCode',
													itemId : 'taxRateCode',
													cfgUrl : 'services/userseek/TaxRateCodeSeek.json',
													cfgQueryParamName : '$autofilter',
													cfgRecordCount : -1,
													cfgSeekId : 'TaxRateCodeSeek',
													cfgRootNode : 'd.preferences',
													cfgDataNode1 : 'CODE',
													cfgStoreFields : [ 'CODE',
															'DESCR' ],
													cfgExtraParams: [], 
													padding : '6 0 0 0'
											   }
											  ]
											},
											{
												//panel 3
											    xtype : 'panel',
							                     cls : 'xn-filter-toolbar',
							                    flex : 0.20,
							                    layout : 'vbox',
							                    columnWidth : 0.22,
												items :[
												        {
											            xtype : 'label',
											            text :getLabel('lms.notionalMst.status', 'Status'),
											            cls : 'tdfrmLabel',
											            flex : 0.20,
											            padding : '6 0 0 8'
										                },
														{
														    xtype : 'combobox',
												            fieldCls : 'xn-form-field inline_block',
												            triggerBaseCls : 'xn-form-trigger',
												             padding : '5 5 1 5',
													         matchFieldWidth : true,
												            //width : 163,
												            itemId : 'statusFilter',
												            filterParamName : 'requestState',
												            store : statusStore,
												            valueField : 'name',
												            displayField : 'value',
												            editable : false,
												            value : getLabel( 'all', 'ALL' )
												           //fieldLabel : getLabel( "lblprofileType", "Status" )
														}
												]
											},
											//panel 4
											{
											      xtype : 'panel',
							                      cls : 'xn-filter-toolbar',
												  flex : 0.30,
							                     layout : 'vbox',
							                     padding : '20 0 1 5',
												 items :
												 [
												      {
									                    xtype : 'button',
									                    itemId : 'btnFilter',
									                   text : getLabel( 'search', 'Search' ),
									                  cls : 'ux_button-padding ux_button-background ux_button-background-color'
								                      }
												 ]
											}
								          ]
								        }
								 
					];
			this.callParent( arguments );
	}
	
});