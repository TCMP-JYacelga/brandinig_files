Ext.define('GCP.view.HolidaySummaryFilterView',
{
	extend : 'Ext.panel.Panel',	
	xtype  : 'holidaySummaryFilterView',
	requires :
		[
			'Ext.ux.gcp.AutoCompleter'
		],
	width : '50%',
	componentCls : 'gradiant_back',
	collapsible : true,
	collapsed : true,
	cls : 'xn-ribbon',
	layout :
	{
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function()
	{
		var storeData = null;
		if(entity_type === '0')
			{
			var strUrl='services/sellerListFltr.json'+"?" + csrfTokenName + "=" + csrfTokenValue;
			var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
			while (arrMatches = strRegex.exec(strUrl)) {
					objParam[arrMatches[1]] = arrMatches[2];
				}
				strUrl = strUrl.substring(0, strUrl.indexOf('?'));
			Ext.Ajax.request(
			{
			  url : strUrl,
			  read :'POST',
			  async: false,
			  params:objParam,
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
						'key', 'value'
					],
					data :
					[
						
						{
							"key" : "all",
							"value" : getLabel( 'lblAll', 'All' )
						},
						{
							"key" : "0NN",
							"value" : getLabel( 'lblNew', 'New' )
							
						},
						{
							"key" : "0NY",
							"value" : getLabel( 'lblSubmitted', 'Submitted' )
							
						},
						{
							"key" : "3YN",
							"value" : getLabel( 'lblAuthorized', 'Approved' )
						},
						{
							"key" : "7NN",
							"value" : getLabel( 'lblNewRejected', 'New Rejected' )
						},
						{
							"key" : "1YN",
							"value" : getLabel( 'lblModified', 'Modified' )
						},
						{
							"key" : "8YN",
							"value" : getLabel( 'lblModifiedReject', 'Modified Rejected' )
						},
						{
							"key" : "5YY",
							"value" : getLabel( 'lblDisableRequest', 'Disable Request' )
						},
						{
							"key" : "9YN",
							"value" : getLabel( 'lblDisableReqRejected', 'Disable Request Rejected' )
						},
						{
							"key" : "3NN",
							"value" : getLabel( 'lblDeleted', 'Disabled' )
						},
						{
							"key" : "4NY",
							"value" : getLabel( 'lblAuthorized', 'Enable Request' )
						},
						{
							"key" : "10NN",
							"value" : getLabel( 'lblEnableReqRejected', 'Enable Request Rejected' )
						}
					]
				} );
			
			           var years = [];

                       y = yearFltrVal;
                      while (y<=2055){
                      years.push([y]);
                     y++;
                       }

                  var yearStore = new Ext.data.SimpleStore
                   ({
                        fields : ['years'],
                          data : years
                    });
			this.items =
				[
					{
						xtype : 'panel',
						itemId : 'mainContainer',
						layout : 'hbox',
						cls: 'ux_border-top ux_largepadding',
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
											        text : getLabel( 'lbl.notionalMst.seller', 'Financial Institution' ),
											        cls : 'frmLabel'
										            }
									              ]
										 },
											{
												xtype : 'combo',
												displayField : 'description',
												fieldCls : 'xn-form-field inline_block',
												triggerBaseCls : 'xn-form-trigger',
												filterParamName : 'sellerId',
												itemId : 'sellerFltId',
												valueField : 'sellerCode',
												name : 'sellerCombo',
												editable : false,
												value :strSellerId,
												store : objStore
											}
											]
											},
											
											//Panel 2
											{
												  xtype : 'panel',
								                     cls : 'xn-filter-toolbar',
								                    flex : 0.20,
								                    layout : 'vbox',
								                    columnWidth : 0.22,
												  items :
												  [
														{
												            xtype : 'label',
												            text :getLabel('', 'Year'),
												            cls : 'frmLabel',
												            flex : 0.20
											                },
														{
											
													   xtype : 'combobox',
													   fieldCls : 'xn-form-field inline_block',
													   triggerBaseCls : 'xn-form-trigger',
													   //padding : '5 5 1 5',
													   matchFieldWidth : true,		                                         
			                                           itemId : 'yearFltId',
			                                             name: 'year',
														 store : yearStore,
														 displayField  : 'years',
			                                            allowBlank: false,		                                           
														value : yearFltrVal
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
											            cls : 'frmLabel',
											            flex : 0.20
										                },
														{
															xtype : 'combobox',
															fieldCls : 'xn-form-field inline_block',
															triggerBaseCls : 'xn-form-trigger',
															width : 165,
															padding : '6 0 0 0',													
															itemId : 'statusFilter',													
															store : statusStore,
															valueField : 'key',
															displayField : 'value',
															editable : false,
															value : getLabel('all', 'All'),
															listeners :
															{
																select : function( combo, record, index )
																{
																	this.parent.fireEvent('filterStatusType', combo, record, index);
																}
															}	
														}
												]
											},
											//panel 4
											{
											      xtype : 'panel',
							                      cls : 'xn-filter-toolbar',
												  flex : 0.50,
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