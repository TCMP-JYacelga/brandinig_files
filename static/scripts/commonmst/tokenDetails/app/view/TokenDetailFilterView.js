Ext.define('GCP.view.TokenDetailFilterView', {
			extend : 'Ext.panel.Panel',
			xtype : 'tokenDetailFilterView',
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
				var me=this;
				 var objTokenStatusStore = Ext.create('Ext.data.Store', {
					 fields : ['tokenStatus', 'tokenStatusDesc'],
					 data : [
							 { tokenStatus: null, tokenStatusDesc: getLabel('tokenall', 'All')},
					         { tokenStatus: 'A', tokenStatusDesc: getLabel('assigned', 'Assigned')},
					         { tokenStatus: 'U', tokenStatusDesc: getLabel('unassigned', 'Not Assigned')}
					        ]
		         });				
				this.items = [{
					xtype : 'panel',
					cls : 'ux_largepadding',
					layout : 'hbox',
					width : '100%',
					items : [{
								xtype : 'panel',
								layout : 'hbox',
								flex:0.5,
								itemId : 'specificFilter',
								items :[{
											xtype : 'panel',
											cls : 'xn-filter-toolbar',
											layout : 'vbox',
											itemId : 'sellerPanel',
										    items : [{
											xtype : 'label',
											text : getLabel('lblTokenType', 'Token Type'),
											cls : 'f13 ux_payment-type',
											padding : '4 0 0 5',
											flex : 1
											},{
												xtype : 'toolbar',
												border : false,
												itemId:'paymentTypeToolBar',
												componentCls : 'xn-btn-default-toolbar-small xn-custom-more-toolbar',
												items : [{
													text : getLabel('tokenall', 'All'),
													code : 'all',
													btnId : 'allTokens',
													btnDesc : 'All',
													parent : this,
													cls : 'f13 xn-custom-heighlight',
													handler : function(btn, opts) {
														me.dohandlePaymentTypeClick(btn);
														me.fireEvent('handleTypeClick', btn,
																opts);
													}
												},{
													text : getLabel('importSoftToken', 'Soft'),
													code : 'all',
													btnId : 'softTokens',
													btnDesc : 'S',
													parent : this,
													handler : function(btn, opts) {
														me.dohandlePaymentTypeClick(btn);
														me.fireEvent('handleTypeClick', btn,
																opts);
													}
												},{
													text : getLabel('importHardToken', 'Hard'),
													code : 'all',
													btnId : 'hardTokens',
													btnDesc : 'H',
													parent : this,
													//cls : 'f13 xn-custom-heighlight',
													handler : function(btn, opts) {
														me.dohandlePaymentTypeClick(btn);
														me.fireEvent('handleTypeClick', btn,
																opts);
													}
												}]
											}]
										}]	
						}, {
							xtype : 'panel',
							cls : 'xn-filter-toolbar ux_extralargemargin-left',
							layout : 'hbox',
							flex:0.5,
							items : [{
										xtype : 'label',
										text : getLabel('tokenstatus', 'Status'),
										cls : 'frmLabel',
										padding : '4 0 0 5'
									},{
										xtype : 'combo',
										width : 130,
										padding : '1 0 0 0',
										displayField : 'tokenStatusDesc',
										fieldCls : 'xn-form-field inline_block x-trigger-noedit',
										triggerBaseCls : 'xn-form-trigger',
										filterParamName : 'tokenType',
										itemId : 'tokenStatus',
										valueField : 'tokenStatus',
										name : 'tokenStatus',
										editable : false,
										value: getLabel('all','All'),
										store : objTokenStatusStore
							}]

					},{
							xtype : 'panel',
							cls : 'xn-filter-toolbar ux_extralargemargin-left',
							layout : 'hbox',
							flex:0.5,
							itemId:'benePanel',
							items : [{
											xtype : 'panel',
											cls : 'xn-filter-toolbar',
											layout : 'vbox',
											itemId : 'benePanel',
											columnWidth : 0.5,
											items : []
										}]

					}, {
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						layout : 'hbox',
						flex:0.3,
						items : [{
									xtype : 'panel',
									layout : 'vbox',
									margin : '0 0 1 35',
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
			},
	tools : [{
		xtype : 'container',
		padding : '0 9 0 0',
		layout : 'hbox',
		items : [
			{
				xtype : 'label',
				text : getLabel('preferences', 'Preferences : '),
				padding : '2 0 0 0'
			}, {
				xtype : 'button',
				itemId : 'btnClearPreferences',
				disabled : true,
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
				text : getLabel('saveFilter', 'Save'),
				cls : 'xn-account-filter-btnmenu',
				textAlign : 'right',
				width : 30
			}     
		]
	}
     ],
	 dohandlePaymentTypeClick : function(btn) {
		var me = this;
		var objTbar = me.down('toolbar[itemId="paymentTypeToolBar"]');
		if (objTbar)
		{
			objTbar.items.each(function(item) {
						item.removeCls('xn-custom-heighlight');
					});
	}
		btn.addCls('xn-custom-heighlight');
	}
		});