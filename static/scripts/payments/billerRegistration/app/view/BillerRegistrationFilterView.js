Ext
		.define(
				'GCP.view.BillerRegistrationFilterView',
				{
					extend : 'Ext.panel.Panel',
					requires : [ 'Ext.ux.gcp.AutoCompleter' ],
					xtype : 'billerRegistrationFilterView',
					layout : 'vbox',
					initComponent : function() {
						var me = this;

						var clientStore = Ext.create('Ext.data.Store', {
							fields : [ 'CODE', 'DESCR' ]
						});
						Ext.Ajax.request({
							url : 'services/userseek/userclients.json',
							method : 'POST',
							async : false,
							success : function(response) {
								var responseData = Ext.decode(response.responseText);
								var data = responseData.d.preferences;
								if (clientStore) {
									clientStore.removeAll();
									var count = data.length;
									if (count > 1) {
										clientStore.add({
											'CODE' : 'all',
											'DESCR' : getLabel('allCompaniess', 'All Companies')
										});
									}
									for (var index = 0; index < count; index++) {
										var record = {
											'CODE' : data[index].CODE,
											'DESCR' : data[index].DESCR
										};
										clientStore.add(record);
									}
									clientCount = count;
								}
							},
							failure : function() {
							}
						});
						me.items = [
								{
									xtype : 'container',
									layout : 'vbox',
									// If count is one
									hidden : ((clientStore.getCount() < 2) || !isClientUser()) ? true : false,
									// or admin then
									// hide
									width : '25%',
									padding : '0 30 0 0',
									items : [ {
										xtype : 'label',
										itemId : 'lblcompanyname',
										text : getLabel('lblcompanyname', 'Company Name')
									}, {
										xtype : 'combo',
										displayField : 'DESCR',
										valueField : 'CODE',
										queryMode : 'local',
										editable : false,
										triggerAction : 'all',
										width : '100%',
										padding : '-4 0 0 0',
										itemId : 'clientCombo',
										mode : 'local',
										emptyText : getLabel('allCompaniess', 'All Companies'),
										store : clientStore
									} ]
								},
								{
									xtype : 'container',
									layout : 'vbox',
									// If not admin then hide
									hidden : (isClientUser()) ? true : false,
									width : '25%',
									padding : '0 30 0 0',
									items : [ {
										xtype : 'label',
										itemId : 'lblcompanyname',
										text : getLabel('lblcompanyname', 'Company Name')
									}, {
										xtype : 'AutoCompleter',
										width : '100%',
										matchFieldWidth : true,
										name : 'clientCombo',
										itemId : 'clientAuto',
										cfgUrl : 'services/userseek/userclients.json',
										padding : '-4 0 0 0',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'userclients',
										cfgKeyNode : 'CODE',
										cfgRootNode : 'd.preferences',
										cfgDataNode1 : 'DESCR',
										emptyText : getLabel('autoCompleterEmptyText','Enter Keyword or %'),
										enableQueryParam : false,
										cfgProxyMethodType : 'POST'
									} ]

								},
								{
									xtype : 'container',
									itemId : 'parentContainer',
									width : '100%',
									layout : 'hbox',
									items : [
											{

												xtype : 'container',
												itemId : 'accountContainer',
												layout : 'vbox',
												width : '25%',
												padding : '0 30 0 0',
												items : [ {
													xtype : 'label',
													text : getLabel('biller', 'Biller')
												}, {
													xtype : 'combo',
													displayField : 'SYS_BENE_DESC',
													valueField : 'SYS_BENE_CODE',
													queryMode : 'local',
													editable : false,
													triggerAction : 'all',
													width : '100%',
													padding : '-4 0 0 0',
													itemId : 'billerCombo',
													mode : 'local',
													emptyText : getLabel('selectbiller', 'Select Biller'),
													store : me.getBillerStore()

												} ]
											},
											, {
												xtype : 'container',
												layout : 'vbox',
												width : '25%',
												items : [ {
													xtype : 'label',
													text : getLabel('status', 'Status')
												}, Ext.create('Ext.ux.gcp.CheckCombo', {
													valueField : 'code',
													displayField : 'desc',
													editable : false,
													addAllSelector : true,
													emptyText : 'All',
													multiSelect : true,
													width : '100%',
													padding : '-4 30 0 0',
													itemId : 'statusCombo',
													isQuickStatusFieldChange : false,
													store : me.getStatusStore(),
													listeners : {
														'focus' : function() {
														}
													}
												}) ]

											},
											{
												xtype : 'container',
												itemId : 'registrationDateContainer',
												layout : 'vbox',
												width : '25%',
												padding : '0 30 0 0',
												items : [
														{
															xtype : 'panel',
															itemId : 'registrationDatePanel',
															height : 23,
															flex : 1,
															layout : 'hbox',
															items : [
																	{
																		xtype : 'label',
																		itemId : 'registrationDateLabel',
																		text : getLabel('regDate', 'Registration Date')
																	},
																	{
																		xtype : 'button',
																		border : 0,
																		filterParamName : 'RegistrationDate',
																		itemId : 'registrationDateBtn',
																		// cls : 'ui-caret-dropdown',
																		listeners : {
																			click : function(event) {
																				var menus = getDateDropDownItems(
																						'registrationDateQuickFilter', this);
																				var xy = event.getXY();
																				menus.showAt(xy[0], xy[1] + 16);
																				event.menu = menus;
																				// event.removeCls('ui-caret-dropdown'),
																				// event.addCls('action-down-hover');
																			}
																		}
																	} ]
														},
														{
															xtype : 'container',
															itemId : 'registrationDateToContainer',
															layout : 'hbox',
															width : '100%',
															items : [
																	{
																		xtype : 'component',
																		width : '82%',
																		itemId : 'registrationDatePicker',
																		filterParamName : 'RegistrationDate',
																		html : '<input type="text" readonly="readonly"  id="registrationDatePicker" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
																	},
																	{
																		xtype : 'component',
																		cls : 'icon-calendar',
																		margin : '1 0 0 0',
																		html : '<span class=""><i class="fa fa-calendar"></i></span>'
																	} ]
														} ]
											} ]
								}, {
									xtype : 'container',
									itemId : 'parentContainer1',
									width : '100%',
									layout : 'hbox',
									items : [ {

										xtype : 'container',
										itemId : 'accountContainer2',
										layout : 'vbox',
										width : '25%',
										padding : '0 30 0 0',
										hidden : ("Y" === ISBILLERAUTO) ? false : true,
										items : [ {
											xtype : 'label',
											text : getLabel('paymentAccount', 'Payment Account')
										}, {
											xtype : 'combo',
											displayField : 'CODE',
											valueField : 'CODE',
											queryMode : 'local',
											editable : false,
											triggerAction : 'all',
											width : '100%',
											padding : '-4 0 0 0',
											itemId : 'accountCombo',
											mode : 'local',
											emptyText : getLabel('selectPayAccount', 'Select Payment Account'),
											store : me.getAccountStore()
										} ]
									}, {

										xtype : 'container',
										itemId : 'accountContainer3',
										layout : 'vbox',
										width : '25%',
										padding : '0 30 0 0',
										hidden : ("Y" === ISBILLERAUTO) ? false : true,
										items : [ {
											xtype : 'label',
											text : getLabel('autoPay', 'Bill Pay Type')
										}, {
											xtype : 'fieldcontainer',
											defaultType : 'radiofield',
											itemId : 'autoPayRadio',
											layout : 'hbox',
											items : [ {
												boxLabel : getLabel('all', 'All'),
												name : 'payType',
												inputValue : 'All',
												id : 'radio1',
												checked : true
											}, {
												boxLabel : getLabel('automatic','Automatic'),
												name : 'payType',
												inputValue : 'A',
												id : 'radio2'
											}, {
												boxLabel : getLabel('manual','Manual'),
												name : 'payType',
												inputValue : 'M',
												id : 'radio3'
											} ]
										} ]
									}, {

										xtype : 'container',
										itemId : 'accountContainer4',
										layout : 'vbox',
										width : '25%',
										padding : '0 30 0 0',
										items : [ {
											xtype : 'label',
											text : getLabel('reference', 'Reference')
										}, {
											xtype : 'textfield',
											// displayField : 'DISPLAYFIELD',
											valueField : 'CODE',
											queryMode : 'local',
											// editable : false,
											triggerAction : 'all',
											width : '100%',
											padding : '-4 0 0 0',
											itemId : 'referenceText',
											mode : 'local',
											fieldCls : 'form-control'
										// emptyText : getLabel('account', 'Account'),
										// store : me.getBillerStore()
										} ]
									} ]

								}

						];

						this.callParent(arguments);
					},
					getStatusStore : function() {
						var objBillerStatusStore = null;
						if (!Ext.isEmpty(arrStatus)) {
							objBillerStatusStore = Ext.create('Ext.data.Store', {
								fields : [ 'code', 'desc' ],
								data : arrStatus,
								autoLoad : true,
								listeners : {
									load : function() {
									}
								}
							});
							objBillerStatusStore.load();
						}
						return objBillerStatusStore;
					},
					getBillerStore : function() {
						var accountData = null;
						Ext.Ajax.request({
							url : "services/userseek/billerList.json?$filtercode1="+strClient,
							async : false,
							method : 'GET',
							success : function(response) {
								if (!Ext.isEmpty(response.responseText)) {
									var data = Ext.decode(response.responseText);
									if (data && data.d) {
										accountData = data.d.preferences;
										objBillerStore = Ext.create('Ext.data.Store', {
											fields : [ 'SYS_BENE_CODE', 'SYS_BENE_DESC' ],
											data : accountData,
											reader : {
												type : 'json',
												root : 'd.preferences'
											},
											autoLoad : true,
											listeners : {
												load : function() {
												}
											}
										});
										objBillerStore.load();
									}
								}
							},
							failure : function(response) {
							}
						});
						return objBillerStore;
					},

					getAccountStore : function() {
						var accountData = null;
						Ext.Ajax.request({
							url : "services/userseek/acctList.json?$filtercode1="+strClient,
							async : false,
							method : 'GET',
							success : function(response) {
								if (!Ext.isEmpty(response.responseText)) {
									var data = Ext.decode(response.responseText);
									if (data && data.d) {
										accountData = data.d.preferences;
										objAcctStore = Ext.create('Ext.data.Store', {
											fields : [ 'CODE','CODE' ],
											data : accountData,
											reader : {
												type : 'json',
												root : 'd.preferences'
											},
											autoLoad : true,
											listeners : {
												load : function() {
												}
											}
										});
										objAcctStore.load();
									}
								}
							},
							failure : function(response) {
							}
						});
						return objAcctStore;
					}
				});
