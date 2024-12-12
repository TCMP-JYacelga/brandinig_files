Ext
		.define(
				'GCP.view.BankScheduleDtlFilterView',
				{
					extend : 'Ext.panel.Panel',
					xtype : 'bankScheduleDtlFilterView',
					requires : [ 'Ext.menu.Menu', 'Ext.container.Container',
							'Ext.toolbar.Toolbar', 'Ext.button.Button',
							'Ext.panel.Panel', 'Ext.ux.gcp.AutoCompleter' ],
					width : '100%',
					componentCls : 'gradiant_back',
					collapsible : true,
					collapsed : true,
					cls : 'xn-ribbon',
					layout : {
						type : 'vbox',
						align : 'stretch'
					},
					initComponent : function() {
						var storeData = null;
						var firstSeller = null;
						var objStore = Ext.create('Ext.data.Store',
								{
									fields : [ 'CODE', 'DESCR' ],
									data : storeData,
									reader : {
										type : 'json',
										root : 'preferences'
									},
									listeners : {
										'load' : function(store) {
											if (!Ext.isEmpty(store)
													&& !Ext.isEmpty(store
															.first()))
												firstSeller = store.first()
														.get('CODE');
										}
									}
								});
						if (objStore.getCount() > 1) {
							multipleSellersAvailable = true;
						}

						if (!Ext.isEmpty(arrStatusFilterLst)) {
							arrStatusFilterLst.push({
								name : 'all',
								value : getLabel('all', 'ALL')
							});
						}

						var statusStore = Ext.create('Ext.data.Store', {
							fields : [ "name", "value" ],
							data : arrStatusFilterLst
						});

						this.items = [ {
							xtype : 'panel',
							itemId : 'mainContainer',
							layout : 'hbox',
							cls : 'ux_border-top ux_largepadding',
							items : [
									{
										// panel 3
										xtype : 'panel',
										cls : 'xn-filter-toolbar',
										flex : 0.05,
										layout : 'vbox',
										items : [
												{
													xtype : 'label',
													text : getLabel('status',
															'Status'),
													cls : 'frmLabel',
													flex : 0.20
												},
												{
													xtype : 'combo',
													fieldCls : 'xn-form-field inline_block',
													triggerBaseCls : 'xn-form-trigger',
													itemId : 'statusFilter',
													store : statusStore,
													valueField : 'name',
													displayField : 'value',
													name : 'requestState',
													editable : false,
													value : 'all',
													listeners : {
														afterrender : function() {
															var me = this;
															me.inputEl
																	.set({
																		onfocus : "this.blur();"
																	});
														}
													}
												} ]
									},
									// Panel 4
									{
										xtype : 'panel',
										cls : 'xn-filter-toolbar',
										layout : 'vbox',
										flex : 0.05,
										items : [ {
											xtype : 'panel',
											layout : 'hbox',
											padding : '23 0 1 0',
											items : [ {
												xtype : 'button',
												itemId : 'btnFilter',
												text : getLabel('search',
														'Search'),
												cls : 'ux_button-padding ux_button-background ux_button-background-color',
												height : 22
											} ]
										} ]
									} ]
						} ];
						this.callParent(arguments);
					}

				});