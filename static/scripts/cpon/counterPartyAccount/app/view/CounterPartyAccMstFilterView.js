Ext.define('CPON.view.CounterPartyAccMstFilterView', {
			extend : 'Ext.panel.Panel',
			xtype : 'counterPartyAccMstFilterView',
			requires : ['Ext.ux.gcp.AutoCompleter','Ext.data.Store','Ext.panel.Panel','Ext.form.Label',
			'Ext.form.field.ComboBox','Ext.button.Button','Ext.layout.container.VBox'],
			width : '100%',
			componentCls : 'gradiant_back',
			collapsible : true,
			cls : 'xn-ribbon',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			initComponent : function() {
				
			this.items = [{
					xtype : 'panel',
					layout : 'column',
					width : '100%',
					items : [{
							xtype : 'panel',
							layout : 'column',
							columnWidth : 0.56,
							itemId : 'specificFilter',
							items :[]
						}, {
							xtype : 'panel',
							cls : 'xn-filter-toolbar',
							layout : 'vbox',
							columnWidth : 0.28, 
							items : [
									{
								xtype : 'AutoCompleter',
								fieldCls : 'xn-form-text w14 xn-suggestion-box',
								padding : '2 6 0 5',
								fieldLabel :getLabel('branch','Branch'),
								labelPad: 2,
								labelWidth: 50,
								labelSeparator: '',
								labelAlign : 'top',
								itemId : 'branchCombo',
								name : 'branchAutoCompleter',
								cfgUrl : 'services/counterPartyMstSeek/counterPartyBranchNameSeek.json',
								cfgRecordCount : -1,
								cfgRootNode : 'filterList',
								cfgDataNode1 : 'name',
								cfgKeyNode : 'name'
							}
									
									]

					}, {
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						layout : 'vbox',
						columnWidth : 0.15,
						items : [{
									xtype : 'panel',
									layout : 'hbox',
									padding : '23 0 1 5',
									items : [{
												xtype : 'button',
												itemId : 'btnFilter',
												text : getLabel('search',
														'Search'),
												cls : 'search_button',		
												width : 60,
												height : 22
											}]
								}]
					}]
				}];
				this.callParent(arguments);
			}
		});