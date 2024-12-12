/**
 * @class BankProcessingQueueFilterView
 * @extends Ext.panel.Panel
 * @author Vaidehi
 */
Ext.define('GCP.view.BankProcessingQueueFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'bankProcessingQueueFilterView',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	width : '100%',
	margin : '0 0 10 0',
	componentCls : 'gradiant_back',
	collapsible : true,
	cls : 'xn-ribbon',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		var moreBtn = Ext.create('Ext.Button', {
					cls : 'cursor_pointer xn-account-filter-btnmenu',
					text : '<span class="button_underline">'
							+ getLabel('moreText', 'more') + '</span>' + '>>',
					itemId : 'AdvMoreBtn',
					handler : function(btn, opts) {
						// to do
					}
				});

		this.items = [{
						xtype : 'panel',
						layout : 'hbox',
						items : [{
									xtype : 'panel',
									cls : 'xn-filter-toolbar',
									layout : 'vbox',
									flex : 0.8,
									items : [{
												xtype : 'label',
												text : getLabel('grid.column.company',
														'Company Name'),
												cls : 'f13',
												flex : 1,
												padding : '6 0 0 8'
											},{
												xtype : 'panel',
												layout : 'hbox',
												padding : '6 0 0 5',
												items : [{
														xtype : 'AutoCompleter',
														matchFieldWidth : true,
														cls : 'autoCmplete-field',
														labelSeparator : '',
														name : 'client',
														itemId : 'bankProcessingQueueClientId',
														cfgUrl : 'migrationSummaryClientSeek.srvc',
														cfgQueryParamName : '$autofilter',
														cfgRecordCount : -1,
														cfgSeekId : 'clientSeek',
														//cfgRootNode : '',
														cfgKeyNode : 'CODE',
														cfgDataNode1 : 'DESCR',
														cfgExtraParams : [{key : csrfTokenName, value : csrfTokenValue}]
													}]
											}]
								}/*,{
									xtype : 'panel',
									cls : 'xn-filter-toolbar',
									layout : 'vbox',
									flex : 0.8,
									items : [{
												xtype : 'label',
												text : getLabel('client1', 'Service Package'),
												cls : 'f13',
												flex : 1,
												padding : '6 0 0 8'
											},{
												xtype : 'panel',
												layout : 'hbox',
												padding : '6 0 0 5',
												items : [{
													xtype : 'AutoCompleter',
													matchFieldWidth : true,
													cls : 'autoCmplete-field',
													labelSeparator : '',
													name : 'client',
													itemId : 'bankProcessingQueueClientId',
													cfgUrl : 'services/userseek/BankProcessingQueueClient.json',
													cfgQueryParamName : '$autofilter',
													cfgRecordCount : -1,
													cfgSeekId : 'clientSeek',
													cfgRootNode : 'd.preferences',
													cfgKeyNode : 'CODE',
													cfgDataNode1 : 'DESCR',
													cfgExtraParams : [{key : csrfTokenName, value : csrfTokenValue}]
												}]
											}]
								},{
									xtype : 'panel',
									cls : 'xn-filter-toolbar',
									layout : 'vbox',
									flex : 0.8,
									items : [{
												xtype : 'label',
												text : getLabel('client1', 'Status For Client'),
												cls : 'f13',
												flex : 1,
												padding : '6 0 0 8'
											},{
												xtype : 'panel',
												layout : 'hbox',
												padding : '6 0 0 5',
												items : [{
													xtype : 'AutoCompleter',
													matchFieldWidth : true,
													cls : 'autoCmplete-field',
													labelSeparator : '',
													name : 'client',
													itemId : 'bankProcessingQueueClientId',
													cfgUrl : 'services/userseek/BankProcessingQueueClient.json',
													cfgQueryParamName : '$autofilter',
													cfgRecordCount : -1,
													cfgSeekId : 'clientSeek',
													cfgRootNode : 'd.preferences',
													cfgKeyNode : 'CODE',
													cfgDataNode1 : 'DESCR',
													cfgExtraParams : [{key : csrfTokenName, value : csrfTokenValue}]
												}]
											}]
								} */]
		}, {
			xtype : 'panel',
			layout : 'hbox',
			items : [{

				xtype : 'panel',
				itemId : 'advFilterPanel',
				cls : 'xn-filter-toolbar',
				flex : 0.8,
				layout : {
					type : 'vbox'
				},
				items : [ {
					xtype : 'toolbar',
					itemId : 'advFilterActionToolBar',
					cls : 'xn-toolbar-small',
					padding : '5 0 0 1',
					width : '100%',
					enableOverflow : true,
					border : false,
					items : []

				}]
			}]
		}

		];
		this.callParent(arguments);
	}
});
