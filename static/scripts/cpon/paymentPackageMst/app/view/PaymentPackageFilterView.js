Ext.define('GCP.view.PaymentPackageFilterView', {
			extend : 'Ext.panel.Panel',
			xtype : 'paymentPackageFilterView',
			requires : ['Ext.ux.gcp.AutoCompleter'],
			width : '100%',
			componentCls : 'gradiant_back',
			collapsible : true,
			collapsed : true,
			cls : 'xn-ribbon ux_border-bottom',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			initComponent : function() {

				var statusStore = Ext.create('Ext.data.Store', {
							fields : ["name", "value"],
							proxy : {
								type : 'ajax',
								autoLoad : true,
								url : 'cpon/statusList.json',
								actionMethods : {
									read : 'POST'
								},
								reader : {
									type : 'json',
									root : 'd.filter'
								}
							}
						});

				this.items = [{
					xtype : 'panel',
					layout : 'column',
					cls : 'ux_largepadding',
					width : '100%',
					items : [{
								xtype : 'panel',
								layout : 'vbox',
								itemId : 'sellerFilter',
								items : []
							}, {
								xtype : 'panel',
								layout : 'column',
								cls : 'ux_verylargemargin-left',
								itemId : 'specificFilter',
								items : []
							}, {
								xtype : 'panel',
								cls : 'xn-filter-toolbar ux_verylargemargin-left',
								layout : 'vbox',
								items : [{
											xtype : 'label',
											text : getLabel('status', 'Status'),
											cls : 'frmLabel'
										}, {
											xtype : 'combobox',
											fieldCls : 'xn-form-field inline_block',
											labelCls : 'frmLabel',
											triggerBaseCls : 'xn-form-trigger',
											padding : '1 5 1 5',
											width : 163,
											itemId : 'statusFilter',
											filterParamName : 'requestState',
											store : statusStore,
											valueField : 'name',
											displayField : 'value',
											editable : false,
											value : getLabel('all', 'ALL')

										}]

							}, {
								xtype : 'panel',
								cls : 'xn-filter-toolbar ux_verylargemargin-left',
								layout : 'vbox',
								items : [{
									xtype : 'panel',
									layout : 'hbox',
									padding : '23 0 1 5',
									items : [{
												xtype : 'button',
												itemId : 'btnFilter',
												text : getLabel('search',
														'Search'),
												cls : 'search_button ux_button-background-color ux_button-padding',
												height : 22
											}]
								}]
							}]
				}];
				this.callParent(arguments);
			}
		});