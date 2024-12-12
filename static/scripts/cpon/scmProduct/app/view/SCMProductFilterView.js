Ext.define('GCP.view.SCMProductFilterView', {
			extend : 'Ext.panel.Panel',
			xtype : 'scmProductFilterView',
			requires : ['Ext.ux.gcp.AutoCompleter'],
			width : '100%',
			componentCls : 'gradiant_back ux_border-bottom',
			collapsible : true,
			collapsed : true,
			cls : 'xn-ribbon ',
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
							layout : 'column',
							columnWidth : 0.45,
							itemId : 'specificFilter',
							items :[]
						}, {
							xtype : 'panel',
							cls : 'xn-filter-toolbar',
							layout : 'vbox',
							columnWidth : 0.30,
							width : 270,
	
							items : [{
										xtype : 'label',
										text : getLabel('status', 'Status'),
										cls : 'f13 ux_font-size14',
										padding : '4 0 0 5'
									}, {
										xtype : 'combobox',
										fieldCls : 'xn-form-field inline_block',
										triggerBaseCls : 'xn-form-trigger',
										padding : '1 5 1 5',
										width : 163,
										itemId : 'statusFilter',
										filterParamName : 'requestState',
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
						columnWidth : 0.20,
						items : [{
									xtype : 'panel',
									layout : 'hbox',
									padding : '23 0 1 0',
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