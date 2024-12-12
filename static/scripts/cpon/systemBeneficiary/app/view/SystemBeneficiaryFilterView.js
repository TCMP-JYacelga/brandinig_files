Ext.define('GCP.view.SystemBeneficiaryFilterView', {
			extend : 'Ext.panel.Panel',
			xtype : 'systemBeneficiaryViewFilterView',
			requires : ['Ext.ux.gcp.AutoCompleter'],
			width : '100%',
			componentCls : 'gradiant_back',
			collapsible : true,
			collapsed :true,
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
					cls : 'ux_largepadding',
					layout : 'hbox',
					width : '100%',
					items : [{
								xtype : 'panel',
								layout : 'hbox',
								//columnWidth : 0.45,
								flex : 1,
								itemId : 'specificFilter',
								items :[{
											xtype : 'panel',
											cls : 'xn-filter-toolbar',
											layout : 'vbox',
											itemId : 'sellerPanel',
											flex :1,
											//columnWidth : 0.5,
											items : []
										},{
											xtype : 'panel',
											cls : 'xn-filter-toolbar',
											layout : 'vbox',
											itemId : 'benePanel',
											flex : 1,
											//columnWidth : 0.5,
											items : []
										}]	
						}, {
							xtype : 'panel',
							cls : 'xn-filter-toolbar ux_extralargemargin-left',
							layout : 'vbox',
							//columnWidth : 0.30,
							flex : 0.5,
	
							items : [{
										xtype : 'label',
										text : getLabel('status', 'Status'),
										cls : 'frmLabel',
										padding : '4 0 0 5'
									}, {
										xtype : 'combobox',
										fieldCls : 'xn-form-field inline_block',
										triggerBaseCls : 'xn-form-trigger',
										padding : '1 5 1 5',
										width : 163,
										itemId : 'statusFilter',
										filterParamName : 'requestState',
										labelCls : 'frmLabel',
										store : statusStore,
										valueField : 'name',
										displayField : 'value',
										editable : false,
										value : getLabel('all',
												'ALL')
	
									}]

					}, {
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						layout : 'vbox',
						//columnWidth : 0.20,
						flex : 0.5,
						items : [{
									xtype : 'panel',
									layout : 'hbox',
									padding : '23 0 1 5',
									items : [{
												xtype : 'button',
												itemId : 'btnFilter',
												text : getLabel('search',
														'Search'),
												cls : 'ux_button-background-color ux_button-padding',
												height : 22
											}]
								}]
					}]
				}];
				this.callParent(arguments);
			}
		});