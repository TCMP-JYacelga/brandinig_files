Ext.define( 'GCP.view.AgreementSweepQueryFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'agreementSweepQueryFilterView',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	width : '100%',
	layout :  'vbox',
	initComponent : function()
	{
		me = this;
		var noPostStructureIdStore;
		noPostStructureIdStore = Ext.create( 'Ext.data.Store',
		{
			fields :
			[
				'noPostStructureKey', 'noPostStructureValue'
			],
			data :
			[
				{
					"noPostStructureKey" : "all",
					"noPostStructureValue" : getLabel( 'lblAll', 'All' )
				},
				{
					"noPostStructureKey" : "N",
					"noPostStructureValue" : getLabel( 'lblLive', 'Live' )
				},
				{
					"noPostStructureKey" : "Y",
					"noPostStructureValue" : getLabel( 'lblNonLive', 'Non Live' )
				}
			]
		} );
		if( entity_type === '0' )
		{
			Ext.Ajax.request(
			{
				url : 'services/sellerListFltr.json' + "?" + csrfTokenName + "=" + csrfTokenValue,
				method : 'POST',
				async : false,
				success : function( response )
				{
					var data = Ext.decode( response.responseText );
					var sellerData = data.filterList;
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
					root : 'filterList'
				}
			} );
			if( objStore.getCount() > 1 )
			{
				multipleSellersAvailable = true;
			}
		}
		var corporationStore = Ext.create('Ext.data.Store', {
			fields : ['CODE', 'DESCR']
		});
		if(entity_type != '0') {
			Ext.Ajax.request({
				url : 'services/userseek/sweepQueryClientIdSeek.json',
				params : {
					$filtercode1 : strUserCode
				},
				method : 'GET',
				async : false,
				success : function(response) {
					var responseData = Ext.decode(response.responseText);
					var data = responseData.d.preferences;
					if(corporationStore) {
						corporationStore.removeAll();
						var count = data.length;
						if(count > 1) {
							corporationStore.add({
								'CODE' : 'all',
								'DESCR' : 'All Companies'
							});
						}
						for(var i=0; i<count; i++) {
							var record = {
								'CODE' : data[i].CODE,
								'DESCR' : data[i].DESCRIPTION
							}
							corporationStore.add(record);
						}
					}
				},
				failure : function() {
					
				}
			});
		}
		var clientAutoCompleterSeekId;
		var agreementAutoCompleterSeekId;
		if( entity_type === '0' ) {
			clientAutoCompleterSeekId = 'sweepQueryClientBankIdSeek';
			agreementAutoCompleterSeekId = 'sweepQueryAgreementIdSeekAll';
		}
		else {
			clientAutoCompleterSeekId = 'sweepQueryClientIdSeek';
			agreementAutoCompleterSeekId = 'sweepQueryAgreementIdSeekClient';
		}
		this.items = [{
				xtype : 'container',
				layout : 'hbox',
				width : '100%',
				items :	[{
							xtype : 'container',
							layout : 'vbox',
							hidden : multipleSellersAvailable == true  && entity_type === '0' ? false : true,
							padding : '0 30 0 0',
							width : '25%',
							items :	[{
										xtype : 'label',
										text : getLabel( 'financialinstitution', 'Financial Institution')
									},{
										xtype : 'combo',
										displayField : 'description',
										width : '100%',
										padding : '-4 0 0 0',
										filterParamName : 'sellerId',
										itemId : 'sweepQuerySellerIdItemId',
										valueField : 'sellerCode',
										name : 'sellerCombo',
										editable : false,
										value : strSellerId,
										store : objStore
									}]
						},{
							xtype : 'container',
							hidden : multipleClientsAvailable === true ? false : true,
							layout : 'vbox',
							padding : '0 30 0 0',
							width : '25%',
							items :	[{
										xtype : 'label',
										text : getLabel('lblcompany', 'Company')
									},{
										xtype : 'combo',
										hidden : entity_type === '0' ? true : false,
										displayField : 'DESCR',
										valueField : 'CODE',
										queryMode : 'local',
										editable : false,
										width : '100%',
										padding : '-4 0 0 0',
										itemId : 'clientCombo',
										emptyText : getLabel('selectCompany', 'Select Company'),
										store : corporationStore,
										listeners : {
											boxready : function(combo, width, height, eOpts) {
												combo.setValue(combo.getStore().getAt(0));
											}
										}
									}, {
										xtype : 'AutoCompleter',								
										//labelCls : 'ux_font-size14',
										//fieldCls : 'xn-form-text w14 xn-suggestion-box',
										labelSeparator : '',
										name : 'clientCode',
										hidden : entity_type === '0' ? false : true,
										padding : '-4 0 0 0',
										width : '100%',
										itemId : 'clientCodeItemId',
										emptyText : getLabel('autoCompleterEmptyText','Enter Keyword or %'),
										cfgUrl : 'services/userseek/{0}.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : clientAutoCompleterSeekId,
										cfgRootNode : 'd.preferences',
										cfgDataNode1 : 'DESCRIPTION',
										cfgDataNode2 :'SHORTNAME',
										cfgStoreFields :
										[
											'CODE', 'DESCRIPTION','SHORTNAME'
										],
										cfgExtraParams : entity_type == '1' ? [{
											key : '$filtercode1',
											value : strUserCode
										}] :[{
											key : '$filtercode1',
											value : strSellerId
										}]
									}/*{
										xtype : 'AutoCompleter',								
										labelCls : 'ux_font-size14',
										fieldCls : 'xn-form-text w14 xn-suggestion-box',
										labelSeparator : '',
										name : 'clientCode',
										padding : '-4 0 0 0',
										width : '100%',
										itemId : 'clientCodeItemId',
										cfgUrl : 'services/userseek/{0}.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : clientAutoCompleterSeekId,
										cfgRootNode : 'd.preferences',
										cfgDataNode1 : 'DESCRIPTION',
										cfgDataNode2 :'SHORTNAME',
										cfgStoreFields :
										[
											'CODE', 'DESCRIPTION','SHORTNAME'
										],
										cfgExtraParams : [ {
											key : '$filtercode1',
											value : strSellerId
										} ]
									}*/]
							}]
					},{
						xtype : 'container',
						itemId : 'mainContainer',
						layout : 'hbox',
						width : '100%',
						items :	[
						       	 /*{
						       		 xtype : 'container',
						       		 hidden : entity_type == 0 ? true : false,
						       		 layout : 'vbox',
						       		 padding : '0 30 0 0',
						       		 width : '25%',
						       		 items : [{
											xtype : 'label',
											text : getLabel('lblcompany', 'Company')
										},{
										xtype : 'AutoCompleter',								
										//labelCls : 'ux_font-size14',
										//fieldCls : 'xn-form-text w14 xn-suggestion-box',
										labelSeparator : '',
										name : 'clientCode',
										padding : '-4 0 0 0',
										width : '100%',
										itemId : 'clientCodeItemId',
										emptyText : getLabel('searchByCompany', 'Search By Company'),
										cfgUrl : 'services/userseek/{0}.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : clientAutoCompleterSeekId,
										cfgRootNode : 'd.preferences',
										cfgDataNode1 : 'DESCRIPTION',
										cfgDataNode2 :'SHORTNAME',
										cfgStoreFields :
										[
											'CODE', 'DESCRIPTION','SHORTNAME'
										],
										cfgExtraParams : [ {
											key : '$filtercode1',
											value : strSellerId
										} ]
									}]
						       	 },*/
						       	 {
									xtype : 'container',
									layout : 'vbox',
									padding : '0 30 0 0',
									width : '25%',
									items :	[{
												xtype : 'label',
												text : getLabel( 'agreementCode', 'Agreement Code' )
											},{
												xtype : 'AutoCompleter',							
												labelSeparator : '',
												matchFieldWidth : true,
												padding : '-4 0 0 0',
												width : '100%',
												name : 'AgreementCode',
												itemId : 'agreementCodeItemId',
												emptyText: getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
												cfgUrl : 'services/userseek/{0}.json',														
												cfgQueryParamName : '$autofilter',
												cfgRecordCount : -1,
												cfgSeekId : agreementAutoCompleterSeekId,
												cfgRootNode : 'd.preferences',
												cfgDataNode1 : 'CODE',
												cfgDataNode2 : 'DESCRIPTION',						
												cfgStoreFields :
												[
													'CODE', 'DESCRIPTION', 'RECKEY','RECORD_KEY_NO'
												],
												cfgExtraParams : entity_type == '1' ? [{
														key : '$filtercode1',
														value : strUserCode
													}] :[{
														key : '$filtercode1',
														value : strSellerId
													}]
												}]
							}, 
							   {	xtype : 'container',
									layout : 'vbox',
									padding : '0 30 0 0',
									width : '25%',
									items :	[{
												xtype : 'label',
												text : getLabel( 'noPostStructureId', 'Live / Non Live' )
											},{
												xtype : 'combobox',							
												labelSeparator : '',
												matchFieldWidth : true,
												padding : '-4 0 0 0',
												width : '100%',
												name : 'NoPostStructure',
												itemId : 'noPostStructureId',
												store : noPostStructureIdStore,
												valueField : 'noPostStructureKey',
												displayField : 'noPostStructureValue',
												editable : false,
												value : getLabel('all','ALL'),
												parent : this			
												}]
							}, {
									xtype : 'container',
									itemId : 'entryDateContainer',
									layout : 'vbox',
									width : '52%',
									padding : '0 30 0 0',
									items : [{
										xtype : 'panel',
										itemId : 'entryDatePanel',
										height : 23,
										padding : '-4 0 0 0',
										flex : 1,
										layout : 'hbox',
										items : [{
													xtype : 'label',
													itemId : 'entryDateLabel',
													text : getLabel('date', 'Date')
												}, {
													xtype : 'button',
													border : 0,
													filterParamName : 'EntryDate',
													itemId : 'entryDateBtn',
													cls : 'ui-caret-dropdown',
													listeners : {
														click : function(event) {
															var menus = getDateDropDownItems(
																	"entryDateQuickFilter", this);
															var xy = event.getXY();
															menus.showAt(xy[0], xy[1] + 16);
															event.menu = menus;
														}
													}
												}]
									}, {
										xtype : 'container',
										itemId : 'entryDateToContainer',
										layout : 'hbox',
										width : '50%',
										items : [{
											xtype : 'component',
											width : '85%',
											itemId : 'paymentEntryDataPicker',
											filterParamName : 'EntryDate',
											html : '<input type="text"  id="entryDataPicker" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
										}, {
											xtype : 'component',
											cls : 'icon-calendar',
											margin : '1 0 0 0',
											html : '<span class=""><i class="fa fa-calendar"></i></span>'
										}]
									}]
					}/*,
					{
						xtype : 'container',
						itemId : 'secondrow',
						width : 'auto',
						layout : 'hbox',					
						//cls : 'filter-container-cls',
						//margin : '5 0 0 17',
						defaults :
						{
							//padding : '6 0 0 10',
							height:45,
							labelAlign : 'top',
							labelSeparator : ''
						},
						items :
						[
														{
								xtype : 'datefield',
								name : 'fromDate',
								itemId : 'fromDate',
								fieldCls : 'ux_normalmargin-top',
								labelCls : 'ux_font-size14 required',
								fieldCls: 'ft-datepicker ui-datepicker-range-alignment is-datepick',
								format : strExtApplicationDateFormat,
								//fieldLabel : getLabel( 'frmDate', 'From Date' ),
								editable : false,
								allowBlank : true,
								minValue : dtLmsRetentionDate,
								maxValue : dtApplicationDate,
								//value : (dtFilterFromDate == null || dtFilterFromDate == "") ? dtApplicationDate : dtFilterFromDate,
								//padding : '2 0 0 15',
								parent : this,
								hideTrigger: 'true',
								value : dtApplicationDate,
								width:200,
								height:40,
								listeners :
								{
									change : function( oldvalue, newValue )
									{
										this.parent.fireEvent( 'filterChangeFromDate', oldvalue, newValue );
									}
								}
							},
							{
								xtype : 'datefield',
								name : 'toDate',
								itemId : 'toDate',
								fieldCls : 'ux_normalmargin-top',
								labelCls : 'ux_font-size14 required',
								fieldCls: 'ft-datepicker ui-datepicker-range-alignment is-datepick',
								format : strExtApplicationDateFormat,
								//fieldLabel : getLabel( 'toDate', 'To Date' ),
								editable : false,
								allowBlank : true,
								
								hideTrigger: 'true',
								minValue : dtLmsRetentionDate,
								maxValue : dtApplicationDate,
								value : dtApplicationDate,
								//value : (dtFilterToDate == null  ||  dtFilterToDate == "" )? dtApplicationDate : dtFilterToDate ,
								parent : this,
								width:200,
								height:40,
								listeners :
								{
									change : function( oldvalue, newValue )
									{
										this.parent.fireEvent( 'filterChangeToDate', oldvalue, newValue );
									}
								}
							}
								
						]
					}*//*,
					{
						xtype : 'container',
						itemId : 'thirdContainer',
						layout : 'hbox',						
						cls : 'filter-container-cls',
						items :
							[
								{
									xtype : 'button',
									itemId : 'btnFilter',
									text : getLabel( 'querySearch', 'Search' ),
									cls : 'searchBtn'
								}
							]
					}*/
				]
			},{

				xtype : 'container',
				layout : 'hbox',
				width : '100%',
				items :	[{
							xtype : 'container',
							layout : 'vbox',
							padding : '0 30 0 0',
							width : '25%',
							items :	[{
								xtype : 'label',
								text : getLabel('status', 'Status'),
										cls : 'frmLabel',
										flex : 1
								},
								Ext.create('Ext.ux.gcp.CheckCombo', {
									name : 'status',
									itemId : 'status',
									width : screen.width > 1024 ? 220 : 160,
									valueField : 'code',
									displayField : 'desc',
									editable : false,
									matchFieldWidth : true,
									addAllSelector : true,
									emptyText : 'All',
									multiSelect : true,
									store :  me.getStatusStore(),
									isQuickStatusFieldChange : false
									})]
						}]
	}];
		this.callParent( arguments );
	},
	getStatusStore : function(){
		var objStatusStore = null;
		if (!Ext.isEmpty(arrActionColumnStatus)) {
			objStatusStore = Ext.create('Ext.data.Store', {
						fields : ['code','desc'],
						data : arrActionColumnStatus,
						autoLoad : true,
						listeners : {
							load : function() {
							}
						}
					});
			objStatusStore.load();
		}
		return objStatusStore;
	}
} );
