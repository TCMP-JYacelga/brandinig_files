Ext.define('GCP.view.ClientAccountFilterView', {
			extend : 'Ext.panel.Panel',
			xtype : 'clientAccountFilterView',
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
			
				var bankTextfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
					padding : '1 0 0 0',
					fieldCls : 'xn-form-text xn-suggestion-box',
					width : 165,
					name : 'bankDesc',
					itemId : 'bankFilter',
					cfgUrl : 'cpon/cponseek/{0}.json',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : 20,
					cfgSeekId : 'bankSeek',
					enableQueryParam:false,
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name',
					cfgProxyMethodType : 'POST'	
				});
				
				var ccyTextfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
					padding : '1 0 0 0',
					fieldCls : 'xn-form-text xn-suggestion-box',
					width : 165,
					name : 'ccy',
					itemId : 'ccyFilter',
					cfgUrl : 'cpon/cponseek/{0}.json',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'ccySeek',
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name',
					enableQueryParam:false,
					cfgProxyMethodType : 'POST'						
				});
				
				var accountTextfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
					padding : '1 0 0 0',
					fieldCls : 'xn-form-text xn-suggestion-box',
					width : 300,
					name : 'cmstAccountNmbr',
					itemId : 'accountFilter',
					cfgUrl : 'cpon/cponseek/{0}.json',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'accountNmbrMstSeek',
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name',
					cfgProxyMethodType : 'POST',
					cfgExtraParams : [ {
						key : '$clientId',
						value : clientId
					} ]						
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
							columnWidth : 1,
							itemId : 'specificFilter',
							items :[{
										xtype : 'panel',
										cls : 'xn-filter-toolbar',
										columnWidth : 0.33,
										layout : 'vbox',
										items : [{
													xtype : 'label',
													text : getLabel('bank',
															'Bank'),
													cls : 'f13 ux_font-size14 ux_normalmargin-bottom',
													padding : '4 0 0 0'
												}, bankTextfield]
									}, {
										xtype : 'panel',
										cls : 'xn-filter-toolbar',
										layout : 'vbox',
										columnWidth :0.33,
										items : [{
													xtype : 'label',
													text : getLabel('ccy', 'CCY'),
													cls : 'f13 ux_font-size14 ux_normalmargin-bottom',
													padding : '4 0 0 0'
												},ccyTextfield]
										},
										
										{
											xtype : 'panel',
											cls : 'xn-filter-toolbar',
											layout : 'vbox',
											columnWidth : 0.34,
											items : [{
														xtype : 'label',
														text : getLabel('Account', 'Account'),
														cls : 'f13 ux_font-size14 ux_normalmargin-bottom',
														padding : '4 0 0 0'
													},accountTextfield]
											}]
						}, {
							xtype : 'panel',
							cls : 'xn-filter-toolbar',
							layout : 'vbox',
							columnWidth : 0.33,
	
							items : [{
										xtype : 'label',
										text : getLabel('status', 'Status'),
										cls : 'f13 ux_font-size14 ux_normalmargin-bottom',
										padding : '4 0 0 0'
									}, {
										xtype : 'combobox',
										fieldCls : 'xn-form-field inline_block',
										triggerBaseCls : 'xn-form-trigger',
										padding : '1 5 1 0',
										/*width : 165,*/
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
						columnWidth : 0.25,
						items : [{
									xtype : 'panel',
									layout : 'hbox',
									cls : 'ux_hide-image',
									padding : '27 0 1 5'
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