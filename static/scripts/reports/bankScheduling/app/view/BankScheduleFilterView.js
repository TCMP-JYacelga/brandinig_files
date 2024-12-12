/**
 * @class BankScheduleFilterView
 * @extends Ext.panel.Panel
 * @author Vaidehi
 */
Ext.define('GCP.view.BankScheduleFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'bankScheduleFilterView',
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
			// layout:'vbox',
			items : [{
				xtype : 'panel',
				layout : 'hbox',
				items : [{
					xtype : 'panel',
					cls : 'xn-filter-toolbar',
					layout : 'vbox',
					padding : '0 0 0 10',
					flex : 0.8,
					items : [{
								xtype : 'label',
								text : getLabel('seller',
										'Financial Institution'),
								// itemId : 'sellerLabelId',
								cls : 'f13',
								flex : 1,
								padding : '6 0 0 8'
							}, {
								xtype : 'panel',
								layout : 'hbox',
								padding : '6 0 0 5',
								items : [{
									xtype : 'AutoCompleter',
									matchFieldWidth : true,
									cls : 'ux_largepadding-left ux_extralargepadding-bottom',
									fieldCls : 'xn-form-text w10_3 xn-suggestion-box',
									labelSeparator : '',
									name : 'seller',
									itemId : 'bankScheduleSellerId',
									cfgUrl : 'services/userseek/bankSchedulingSellerSeek.json',
									cfgQueryParamName : '$autofilter',
									cfgRecordCount : -1,
									cfgSeekId : 'bankSchedulingSellerSeek',
									cfgRootNode : 'd.preferences',
									cfgKeyNode : 'CODE',
									cfgDataNode1 : 'DESCR',
									cfgDataNode2 : 'CODE',
									cfgExtraParams : [{
												key : '$filtercode1',
												value : USER
											}]

								}]
							}]
				},

				{
					xtype : 'panel',
					cls : 'xn-filter-toolbar',
					layout : 'vbox',
					flex : 0.8,
					items : [{
								xtype : 'label',
								text : getLabel('client', 'Client'),
								cls : 'f13',
								flex : 1,
								padding : '6 0 0 8'
							}, {
								xtype : 'panel',
								layout : 'hbox',
								padding : '6 0 0 5',
								items : [{
									xtype : 'AutoCompleter',
									matchFieldWidth : true,
									cls : 'ux_largepadding-left ux_extralargepadding-bottom',
									fieldCls : 'xn-form-text w10_3 xn-suggestion-box',
									labelSeparator : '',
									name : 'client',
									itemId : 'bankScheduleClientId',
									cfgUrl : 'services/userseek/bankSchedulingClientSeek.json',
									cfgQueryParamName : '$autofilter',
									cfgRecordCount : -1,
									cfgSeekId : 'bankSchedulingClientSeek',
									cfgRootNode : 'd.preferences',
									cfgKeyNode : 'CODE',
									cfgDataNode1 : 'DESCR',
									cfgExtraParams : [{
												key : '$filtercode1',
												value : ''
											}]
								}]
							}]
				}, {
					xtype : 'panel',
					cls : 'xn-filter-toolbar',
					flex : 0.8,
					layout : {
						type : 'vbox'
					},
					items : [{
								xtype : 'label',
								text : getLabel('schType', 'Scheduling Type'),
								cls : 'f13',
								flex : 1,
								padding : '6 0 0 8'
							}, {
								xtype : 'toolbar',
								padding : '6 0 0 3',
								itemId : 'schTypeToolBar',
								cls : 'xn-toolbar-small',
								filterParamName : 'repOrDwnld',
								width : '100%',
								enableOverflow : true,
								border : false,
								componentCls : 'xn-btn-default-toolbar-small xn-custom-more-toolbar',
								items : [{
									text : getLabel('all', 'All'),
									code : 'All',
									btnDesc : 'All',
									btnId : 'allSchType',
									parent : this,
									cls : 'f13 xn-custom-heighlight',
									handler : function(btn, opts) {
										this.parent.fireEvent('filterSchType',
												btn, opts);
									}
								}, {
									text : getLabel('report', 'Report'),
									code : 'R',
									btnDesc : 'Report',
									btnId : 'Report',
									parent : this,
									handler : function(btn, opts) {
										this.parent.fireEvent('filterSchType',
												btn, opts);
									}
								}, {
									text : getLabel('upload', 'Imports'),
									code : 'U',
									btnDesc : 'Upld',
									btnId : 'Upld',
									parent : this,
									handler : function(btn, opts) {
										this.parent.fireEvent('filterSchType',
												btn, opts);
									}
								}, {
									text : getLabel('dwnld', 'Uploads'),
									code : 'D',
									btnDesc : 'Dwnld',
									btnId : 'Dwnld',
									parent : this,
									handler : function(btn, opts) {
										this.parent.fireEvent('filterSchType',
												btn, opts);
									}
								}]
							}]
				}, {
					xtype : 'panel',
					cls : 'xn-filter-toolbar',
					flex : 0.8,
					layout : {
						type : 'vbox'
					},
					items : [{
								xtype : 'label',
								text : getLabel('reportStatus', 'Status'),
								cls : 'f13',
								flex : 1,
								padding : '6 0 0 8'
							}, {
								xtype : 'toolbar',
								padding : '6 0 0 3',
								itemId : 'reportStatusToolBar',
								cls : 'xn-toolbar-small',
								filterParamName : 'reportStatus',
								width : '100%',
								enableOverflow : true,
								border : false,
								componentCls : 'xn-btn-default-toolbar-small xn-custom-more-toolbar',
								items : [{
									text : getLabel('all', 'All'),
									code : 'All',
									btnDesc : 'All',
									btnId : 'allReportStatus',
									parent : this,
									cls : 'f13 xn-custom-heighlight',
									handler : function(btn, opts) {
										this.parent.fireEvent('filterStatus',
												btn, opts);
									}
								}, {
									text : getLabel('active', 'Active'),
									code : 'ACTIVE',
									btnDesc : 'active',
									btnId : 'active',
									parent : this,
									handler : function(btn, opts) {
										this.parent.fireEvent('filterStatus',
												btn, opts);
									}
								}, {
									text : getLabel('draft', 'Draft'),
									code : 'DRAFT',
									btnDesc : 'Draft',
									btnId : 'Draft',
									parent : this,
									handler : function(btn, opts) {
										this.parent.fireEvent('filterStatus',
												btn, opts);
									}
								}]
							}]
				}]
			}, {
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				padding : '20 0 10 10',
				margin : '8px',
				layout : 'vbox',
				flex : 0.8,
				items : [{
							xtype : 'button',
							itemId : 'filterBtnId',
							cls : 'xn-button',
							text : 'Search',
							width : 60,
							height : 22
						}]
			}]
		}

		];
		this.callParent(arguments);
	},
	tools : [{
				xtype : 'label',
				text : getLabel('preferences', 'Preferences : '),
				cls : 'xn-account-filter-btnmenu'
			}, {
				xtype : 'button',
				itemId : 'btnClearPreferences',
				disabled : false,
				text : getLabel('clearFilter', 'Clear'),
				cls : 'xn-account-filter-btnmenu',
				textAlign : 'right',
				width : 40
			}, {
				xtype : 'image',
				src : 'static/images/icons/icon_spacer.gif',
				height : 18
			}, {
				xtype : 'button',
				itemId : 'btnSavePreferences',
				disabled : true,
				text : getLabel('savePreferences', 'Save'),
				cls : 'xn-account-filter-btnmenu',
				textAlign : 'right',
				width : 30
			}]
});
