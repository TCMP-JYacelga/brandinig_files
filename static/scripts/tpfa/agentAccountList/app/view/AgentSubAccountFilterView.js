Ext.define('GCP.view.AgentSubAccountFilterView', {
			extend : 'Ext.panel.Panel',
			xtype : 'agentSubAccountFilterView',
			requires : ['Ext.ux.gcp.AutoCompleter'],
			width : '100%',
			componentCls : 'gradiant_back',
			collapsible : true,
			cls : 'xn-ribbon ux_border-bottom',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			initComponent : function() {
			
				var accountStyleAutoComp = Ext.create('Ext.ux.gcp.AutoCompleter', {
					padding : '1 0 0 0',
					fieldCls : 'xn-form-text xn-suggestion-box',
					width : 165,
					name : 'accountStyleDesc',
					itemId : 'accountStyleFilter',
					cfgUrl : 'services/userseek/{0}.json',
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					cfgSeekId : 'accountStyleFilterSeek',
					enableQueryParam:false,
					cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'CODE',
					cfgDataNode2 : 'DESCRIPTION',
					cfgProxyMethodType : 'POST'	,
					cfgStoreFields :
					[
						'CODE', 'DESCRIPTION'
					]
				
				});
				
				var accountNumberAutoComp = Ext.create('Ext.ux.gcp.AutoCompleter', {
					padding : '1 0 0 0',
					fieldCls : 'xn-form-text xn-suggestion-box',
					width : 165,
					name : 'accountNumber',
					itemId : 'accountNumberFilter',
					cfgUrl : 'services/userseek/{0}.json',
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					cfgSeekId : 'accountNumberFilterSeek',
					cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'CODE',
					cfgDataNode2 : 'DESCRIPTION',
					cfgProxyMethodType : 'POST'	,
					cfgStoreFields :
					[
						'CODE', 'DESCRIPTION'
					],
					cfgExtraParams: 
					[
					  {
						key : '$filtercode1',
						value : parentRecordKey
					  } 
					]
				});
				
				
				var statusStore = Ext.create('Ext.data.Store', {
					fields: ['state', 'desc'],
					data : [{"state" : "", "desc" : getLabel('all','ALL')},
					{"state" : "Y", "desc" : getLabel('active','Active')},
					{"state" : "N", "desc" : getLabel('inactive','Inactive')}]
				});
				
				this.items = [{
					xtype : 'panel',
					layout : 'column',
					width : '100%',
					cls : 'ux_largepadding',
					items : [{
							xtype : 'panel',
							layout : 'column',
							columnWidth : 0.56,
							itemId : 'specificFilter',
							items :[ {
								xtype : 'panel',
								cls : 'xn-filter-toolbar',
								layout : 'vbox',
								columnWidth : 0.5,
								items : [{
											xtype : 'label',
											text : getLabel('accountNumber', 'Account Number'),
											cls : 'f13 ux_font-size14 ux_normalmargin-bottom',
											padding : '4 0 0 0'
										},accountNumberAutoComp]
								},{
										xtype : 'panel',
										cls : 'xn-filter-toolbar',
										columnWidth : 0.5,
										layout : 'vbox',
										items : [{
													xtype : 'label',
													text : getLabel('accountStyle',
															'Account Style'),
													cls : 'f13 ux_font-size14 ux_normalmargin-bottom',
													padding : '4 0 0 0'
												}, accountStyleAutoComp]
									}]
						}, {
							xtype : 'panel',
							cls : 'xn-filter-toolbar',
							layout : 'vbox',
							columnWidth : 0.28,
	
							items : [{
										xtype : 'label',
										text : getLabel('lblstatus', 'Status'),
										cls : 'f13 ux_font-size14 ux_normalmargin-bottom',
										padding : '4 0 0 5'
									}, {
										xtype : 'combobox',
										fieldCls : 'xn-form-field inline_block',
										triggerBaseCls : 'xn-form-trigger',
										padding : '1 5 1 5',
										width : 165,
										itemId : 'statusFilter',
										filterParamName : 'activeflag',
										store : statusStore,
										valueField : 'state',
										displayField : 'desc',
										editable : false,
										value : getLabel('all',
												'ALL')
	
									}]

					}, {
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						layout : 'vbox',
						columnWidth : 0.15,
						items : [{
									xtype : 'panel',
									layout : 'hbox',
									cls : 'ux_hide-image',
									padding : '23 0 1 5'
									}, {
										xtype : 'button',
										cls : 'ux_button-background-color ux_button-padding',
												itemId : 'btnFilter',
												text : getLabel('search',
														'Search'),
												//width : 60,
												height : 22	
									}]
					}]
				}];
				this.callParent(arguments);
			}
		});