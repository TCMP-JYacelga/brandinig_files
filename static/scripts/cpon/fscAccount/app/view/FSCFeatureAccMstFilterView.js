Ext.define('CPON.view.FSCFeatureAccMstFilterView', {
			extend : 'Ext.panel.Panel',
			xtype : 'fscFeatureAccMstFilterView',
			requires : ['Ext.ux.gcp.AutoCompleter','Ext.data.Store','Ext.panel.Panel','Ext.form.Label',
			'Ext.form.field.ComboBox','Ext.button.Button','Ext.layout.container.VBox'],
			width : '100%',
			componentCls : 'gradiant_back',
			collapsible : true,
			cls : 'xn-ribbon ux_border-bottom',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			initComponent : function() {
				
				var ccyStore = Ext.create('Ext.data.Store', {
					fields : ['name', 'value'],
					proxy : {
						type : 'ajax',
						url : 'cpon/scmProductMasterSeek/ccySeek.json',
						reader : {
							type : 'json',
							root : 'filterList'
						}
					},
					 listeners: {
						       load: function(store, records, options) {
									store.insert(0,{name:getLabel('all','All'), value:'All'});
						       }
						    }
				});
				
			this.items = [{
					xtype : 'panel',
					layout : 'column',
					width : '100%',
					cls : 'ux_largepadding',
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
	
							items : [{
										xtype : 'label',
										text : getLabel('currency','Currency'),
										cls : 'f13 ux_font-size14',
										padding : '4 0 0 5'
									}, {
										xtype : 'combo',
										displayField : 'name',
										valueField : 'value',
										editable : false,
										fieldCls : 'xn-form-field inline_block',
										triggerBaseCls : 'xn-form-trigger',
										padding : '1 5 1 5',
										width : 155,
										itemId : 'currencyCombo',
										filterParamName : 'requestState',
										store : ccyStore,
										value:'All'
									}]

					}, {
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						layout : 'vbox',
						columnWidth : 0.20,
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