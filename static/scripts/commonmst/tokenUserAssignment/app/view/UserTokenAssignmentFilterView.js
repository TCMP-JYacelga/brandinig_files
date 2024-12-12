Ext.define('GCP.view.UserTokenAssignmentFilterView', {
			extend : 'Ext.panel.Panel',
			xtype : 'userTokenAssignmentFilterView',
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
				tokenAssignView = this;				
				 var objTokenStatusStore = Ext.create('Ext.data.Store', {
					 fields : ['tokenStatus', 'tokenStatusDesc'],
					 data : [
							 { tokenStatus: null, tokenStatusDesc: getLabel('tokenall', 'All')},
					         { tokenStatus: 'A', tokenStatusDesc: getLabel('assigned', 'Assigned')},
					         { tokenStatus: 'U', tokenStatusDesc: getLabel('unassigned', 'Not Assigned')}
					        ]
		         });	
				 var objUserStatusStore = Ext.create('Ext.data.Store', {
					 fields : ['userStatus', 'userStatusDesc'],
					 data : [
							 { userStatus: null, userStatusDesc: getLabel('tokenall', 'All')},					         
					         { userStatus: '3', userStatusDesc: getLabel('lbl.userstatus.3', 'Approved')},
					         { userStatus: '1', userStatusDesc: getLabel('lbl.userstatus.1', 'Modified')},					         
					         { userStatus: '2', userStatusDesc: getLabel('lbl.userstatus.2', 'Submitted')},
					         { userStatus: '4', userStatusDesc: getLabel('lbl.userstatus.4', 'Enable Request')},
					         { userStatus: '5', userStatusDesc: getLabel('lbl.userstatus.5', 'Disable Request')},
					         { userStatus: '11', userStatusDesc: getLabel('lbl.userstatus.11', 'Disabled')},
					         { userStatus: '8', userStatusDesc: getLabel('lbl.userstatus.8', 'Modified Rejected')},
					         { userStatus: '9', userStatusDesc: getLabel('lbl.userstatus.9', 'Disable Request Rejected')},					         
					         { userStatus: '10', userStatusDesc: getLabel('lbl.userstatus.10', 'Enable Request Rejected')}
					        ]
		         });
				 
				var userListStore = Ext.create('Ext.data.Store', {
					fields : ["CODE", "USRDESC"],
					proxy : {
						type : 'ajax',
						autoLoad : true,
						url : 'cpon/userIdSeek.json',
						actionMethods : {
							read : 'POST'
						},
						reader : {
							type : 'json'
						}
					}
				});	
				
				var corpListStore = Ext.create('Ext.data.Store', {
					fields : ["CODE", "CLDESC"],
					proxy : {
						type : 'ajax',
						autoLoad : true,
						url : 'cpon/userCorporationSeek.json',
						actionMethods : {
							read : 'POST'
						},
						reader : {
							type : 'json'
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
										flex:0.5,
										itemId : 'specificFilter',
											items :[{
												xtype : 'panel',
												cls : 'xn-filter-toolbar',
												layout : 'vbox',
												itemId : 'tokenTypePanel',
											    items : [{
												xtype : 'label',
												text : getLabel('lblTokenType', 'Token Type'),
												cls : 'f13 ux_payment-type',
												padding : '4 0 0 5',
												flex : 0.4
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
							},{
								xtype : 'panel',
								cls : 'xn-filter-toolbar ux_extralargemargin-left',
								layout : 'hbox',
								flex:0.5,
								items : [{
											xtype : 'label',
											text : getLabel('lblUserID', 'User ID'),
											cls : 'frmLabel',
											padding : '4 0 0 5'
										},{
											padding : '1 0 0 0',
											xtype : 'AutoCompleter',
											width : 180,
											fieldCls : 'xn-form-text w165 xn-suggestion-box',
											name : 'userDesc',
											itemId : 'userId',
											cfgUrl : 'cpon/{0}.json',
											cfgProxyMethodType : 'POST',
											cfgQueryParamName : 'userIdFilter',
											enableQueryParam:false,											
											cfgRecordCount : -1,
											cfgSeekId : 'userIdSeek',
											cfgDataNode1 : 'CODE',
											cfgKeyNode : 'CODE'
										}]
						},{
							xtype : 'panel',
							cls : 'xn-filter-toolbar ',
							layout : 'hbox',
							flex:0.5,
							items : [{
										xtype : 'label',
										text : getLabel('lblTokenStatus', 'Token Status'),
										cls : 'frmLabel',
										padding : '4 0 0 5'
									},{
										xtype : 'combo',
										width : 130,
										padding : '1 0 0 0',
										displayField : 'tokenStatusDesc',
										fieldCls : 'xn-form-field inline_block x-trigger-noedit',
										triggerBaseCls : 'xn-form-trigger',
										filterParamName : 'tokenStatus',
										itemId : 'tokenStatus',
										valueField : 'tokenStatus',
										name : 'tokenStatus',
										editable : false,
										value: getLabel('all','All'),
										store : objTokenStatusStore
									}]
						},{
							xtype : 'panel',
							cls : 'xn-filter-toolbar ',
							layout : 'hbox',
							flex:0.5,
							items : [{
										xtype : 'label',
										text : getLabel('lblUserStatus', 'User Status'),
										cls : 'frmLabel',
										padding : '4 0 0 5'
									},{
										xtype : 'combo',
										width : 130,
										padding : '1 0 0 0',
										displayField : 'userStatusDesc',
										fieldCls : 'xn-form-field inline_block x-trigger-noedit',
										triggerBaseCls : 'xn-form-trigger',
										filterParamName : 'userStatus',
										itemId : 'userStatus',
										valueField : 'userStatus',
										name : 'userStatus',
										editable : false,
										value: getLabel('all','All'),
										store : objUserStatusStore
							}]
						},{
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
		itemId : 'filterCorporationContainer',
		cls : 'paymentqueuespacer',
		padding : '0 0 0 20',
		width : '30%',
		layout : {
			type : 'hbox'
		},
		items : [{
			xtype : 'AutoCompleter',
			margin : '0 0 0 20',
			fieldCls : 'xn-form-text xn-suggestion-box',
			itemId : 'corporation',
			name : 'corporation',
			cfgUrl : 'cpon/userCorporationSeek.json',
			cfgRecordCount : -1,
			cfgStoreFields : ['CLDESC','CLDESC'],
			cfgProxyMethodType : 'POST',
			cfgDataNode1 : 'CLDESC',
			cfgKeyNode : 'CLDESC',
			cfgQueryParamName : 'userCorporationFilter',
			listeners : {
				'select' : function(combo, record) {
					tokenAssignView.fireEvent('handleCorportationChange');
			}
			}
		}]
	},{
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
			objTbar.items.each(function(item) {
						item.removeCls('xn-custom-heighlight');					
					});
		btn.addCls('xn-custom-heighlight ');
	}
		});