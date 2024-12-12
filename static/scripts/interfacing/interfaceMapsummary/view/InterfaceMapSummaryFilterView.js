Ext.define('GCP.view.InterfaceMapSummaryFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'interfaceMapSummaryFilterView',
	requires : ['Ext.ux.gcp.AutoCompleter', 'Ext.layout.container.VBox',
			'Ext.layout.container.HBox', 'Ext.form.Label', 'Ext.panel.Panel',
			'Ext.ux.gcp.AutoCompleter', 'Ext.toolbar.Toolbar',
			'Ext.button.Button'],
	width : '100%',
	margin : '0 0 10 0',
	componentCls : 'gradiant_back',
	collapsible : true,
	collapsed : true,
	cls : 'xn-ribbon ux_extralargemargin-bottom ux_border-bottom',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		var me = this;
		interfaceSummary = this;
		me.on('afterrender', function(panel) {
			Ext.Ajax.request({
						url : 'services/sellerListFltr.json',
						method : "POST",
						async : false,
						success : function(response) {
							if (response && response.responseText)
								me.populateSellerMenu(Ext
										.decode(response.responseText));
						},
						failure : function(response) {
							// console.log('Error Occured');
						}
					});
		});	
		/*var objSellerStore = Ext.create('Ext.data.Store', {
					fields : ['sellerCode', 'description'],
					proxy : {
						type : 'ajax',
						autoLoad : true,
						url : 'services/sellerListFltr.json'
					}
				});
		if(objSellerStore.getCount() > 1){
			multipleSellersAvailable = true;
		}*/
		var objClientStore = Ext.create('Ext.data.Store', {
					fields : ['clientId', 'clientDescription'],
					proxy : {
						type : 'ajax',
						autoLoad : true,
						url : 'services/clientList.json'
					}
				});
		this.items = [{
			xtype : 'panel',
			layout : 'hbox',
			padding : '10px',
			items : [{
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				flex : 0.8,
				layout : {
					type : 'vbox'
				},
				items : [{
							xtype : 'label',
							text : 'Interface Type',
							cls : 'ux_font-size14',
							flex : 1,
							padding : '0 0 0 6'
						}, {
							xtype : 'toolbar',
							itemId : 'interfaceTypeToolBar',
							cls : 'xn-toolbar-small ux_no-padding',
							filterParamName : 'interfaceType',
							width : '100%',
							border : false,
							items : [{
								text : getLabel('all', 'All'),
								code : 'All',
								btnDesc : 'All',
								btnId : 'allInterfaceType',
								parent : this,
								cls : 'f13 xn-custom-heighlight',
								handler : function(btn, opts) {
									this.parent.fireEvent('filterType', btn,
											opts);
								}
							}, {
								text : getLabel('uploads', 'Imports'),
								code : 'U',
								btnDesc : 'Imports',
								btnId : 'uploadsType',
								parent : this,
								handler : function(btn, opts) {
									this.parent.fireEvent('filterType', btn,
											opts);
								}
							}, {
								text : getLabel('downloads', 'Uploads'),
								code : 'D',
								btnDesc : 'Uploads',
								btnId : 'downloadsType',
								parent : this,
								handler : function(btn, opts) {
									this.parent.fireEvent('filterType', btn,
											opts);
								}
							}]

						}]
			}, {
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				layout : 'vbox',
				flex : 0.8,
				items : [{
							xtype : 'label',
							text : 'Flavor',
							cls : 'ux_font-size14',
							flex : 1,
							padding : '0 0 0 8'
						}, {
							xtype : 'toolbar',
							padding : '0 0 0 3',
							itemId : 'flavorTypeToolBar',
							cls : 'xn-toolbar-small',
							filterParamName : 'flavorType',
							width : '100%',
							border : false,
							items : [{
								text : getLabel('all', 'All'),
								code : 'All',
								btnDesc : 'All',
								btnId : 'allFlavorType',
								parent : this,
								cls : 'f13 xn-custom-heighlight',
								handler : function(btn, opts) {
									this.parent.fireEvent('filterFlavorType',
											btn, opts);
								}
							}, {
								text : getLabel('standard', 'Standard'),
								code : 'Standard',
								btnDesc : 'Standard',
								btnId : 'standardType',
								parent : this,
								handler : function(btn, opts) {
									this.parent.fireEvent('filterFlavorType',
											btn, opts);
								}
							}, {
								text : getLabel('custom', 'Custom'),
								code : 'Custom',
								btnDesc : 'Custom',
								btnId : 'customType',
								parent : this,
								handler : function(btn, opts) {
									this.parent.fireEvent('filterFlavorType',
											btn, opts);
								}
							}]

						}]
			}, {
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				layout : 'vbox',
				flex : 0.8,
				items : [{
					xtype : 'panel',
					layout : 'hbox',
					items : [{
								xtype : 'label',
								text : getLabel('status', 'Status'),
								cls : 'ux_font-size14',
								flex : 1,
								padding : '0 0 0 8'
							}, {
								xtype : 'button',
								border : 0,
								filterParamName : 'taskStatus',
								itemId : 'taskStatusItemId',// Required
								cls : 'menu-disable xn-custom-arrow-button cursor_pointer',
								glyph : 'xf0d7@fontawesome',
								padding : '0 0 0 0',
								menu : Ext.create('Ext.menu.Menu', {
											items : [{
												text : getLabel('AllStatus',
														'All'),
												btnId : 'btnAll',
												btnValue : 'All',
												parent : this,
												handler : function(btn, opts) {
													this.parent.fireEvent(
															'filterStatusType',
															btn, opts);
												}
											}, {
												text : getLabel('newStatus',
														'New / Draft'),
												btnId : 'btnNew',
												btnValue : '0',
												parent : this,
												handler : function(btn, opts) {
													this.parent.fireEvent(
															'filterStatusType',
															btn, opts);
												}
											}, {
												text : getLabel(
														'modifiedStatus',
														'Modified'),
												btnId : 'btnModified',
												btnValue : '1',
												parent : this,
												handler : function(btn, opts) {
													this.parent.fireEvent(
															'filterStatusType',
															btn, opts);
												}
											}, {
												text : getLabel('deleteStatus',
														'Delete Request'),
												btnId : 'btnDeleteRequest',
												btnValue : '2',
												parent : this,
												handler : function(btn, opts) {
													this.parent.fireEvent(
															'filterStatusType',
															btn, opts);
												}
											}, {
												text : getLabel(
														'authorizedStatus',
														'Authorized'),
												btnId : 'btnAuthorized',
												parent : this,
												btnValue : '3',
												handler : function(btn, opts) {
													this.parent.fireEvent(
															'filterStatusType',
															btn, opts);
												}
											}, {
												text : getLabel('enableStatus',
														'Enable Request'),
												btnId : 'btnEnableRequest',
												parent : this,
												btnValue : '4',
												handler : function(btn, opts) {
													this.parent.fireEvent(
															'filterStatusType',
															btn, opts);
												}
											}, {
												text : getLabel(
														'disableStatus',
														'Disable Request'),
												btnId : 'btnDisableRequest',
												parent : this,
												btnValue : '5',
												handler : function(btn, opts) {
													this.parent.fireEvent(
															'filterStatusType',
															btn, opts);
												}
											}, {
												text : getLabel(
														'disabledStatus',
														'Disabled'),
												btnId : 'btnDisabled',
												parent : this,
												btnValue : '6',
												handler : function(btn, opts) {
													this.parent.fireEvent(
															'filterStatusType',
															btn, opts);
												}
											}, {
												text : getLabel(
														'rejectedStatus',
														'Rejected'),
												btnId : 'btnRejected',
												parent : this,
												btnValue : '7',
												handler : function(btn, opts) {
													this.parent.fireEvent(
															'filterStatusType',
															btn, opts);
												}
											}

											]
										})
							}]
				}, {
					xtype : 'panel',
					layout : 'hbox',
					padding : '0 0 0 8',
					items : [{
								xtype : 'toolbar',
								itemId : 'statusToolBar',
								width : '100%',
								cls : 'xn-toolbar-small',
								padding : '2 0 0 1',
								items : [{
											xtype : 'label',
											cls : 'ux_heighlight',
											itemId : 'strStatusValue',
											text : 'All'
										}]
							   },{
								xtype : 'panel',
								layout : 'hbox',
								cls : 'xn-filter-toolbar',
								itemId : 'sellerClientMenuBar',
								items : [{
									xtype : 'panel',
									cls : 'xn-filter-toolbar',
									margin : '0 0 0 80px',
									layout : 'vbox',
									items : [{
												xtype : 'button',
												itemId : 'filterBtnId',
												cls : 'xn-button ux_button-padding ux_button-background-color',
												text : 'Search',
												height : 22
											}]
								}]
							}]
				}]
			}]
		}];

		this.callParent(arguments);
	},	
	populateSellerMenu : function(data) {
		var me = this;
		var sellerDrop = me.down('combobox[itemId="interfaceSellerId"]');
		var clientAutoCompleter = me.down('combobox[itemId="clientCodeId"]');
		var sellerArray = data || [];
		
		var objStore = Ext.create('Ext.data.Store', {
			fields : ['sellerCode', 'description'],
			data : data,
			reader : {
				type : 'json'
			}
		});
		sellerDrop.store = objStore;
		if(objStore.getCount()==1)
		{
			sellerDrop.hide();
		}
			
		clientAutoCompleter.cfgExtraParams = [{
			key : '$filtercode1',
			value : sellerDrop.getValue()
		}];
	},	
	tools : [{
			xtype : 'container',
			itemId : 'filterClientAutoCmplterCnt',
			cls : 'paymentqueuespacer',
			padding : '0 0 0 5',
			hidden :  entityType == 1 ? true : false,
			layout : {
				type : 'hbox'
			},
			items : [{
				xtype : 'combobox',
				margin : '0 0 0 10',
				width : 160,
				fieldCls : 'xn-form-field inline_block x-trigger-noedit',
				triggerBaseCls : 'xn-form-trigger',
				filterParamName : 'seller',
				editable : false,
				name : 'sellerCombo',
				itemId : 'interfaceSellerId',
				displayField : 'description',
				valueField : 'sellerCode',
				queryMode : 'local',
				value : SESVAR_SELLER,
				listeners : {
					'select' : function(combo, record) {
						strSeller = combo.getValue();
						interfaceSummary.seller = strSeller;
						var field = interfaceSummary.down('combobox[itemId="clientCodeId"]');
						field.setValue('');
						field.setRawValue('');
						
						field.cfgExtraParams = [{
							key : '$filtercode1',
							value : strSeller
						}];
						
					}
			}
		   },{
				xtype : 'label',
				html : '<img id="imgFilterInfo" class="icon-company"/>'
			}, 
			{
				xtype : 'AutoCompleter',
				fieldCls : 'xn-form-text w12 xn-suggestion-box',
				name : 'clientCode',
				itemId : 'clientCodeId',
				cfgUrl : 'services/userseek/userclients.json',
				cfgQueryParamName : '$autofilter',
				cfgStoreFields:['SELLER_CODE','CODE','DESCR'],
				cfgRecordCount : -1,
				cfgSeekId : 'clientCodeSeek',
				cfgRootNode : 'd.preferences',
				cfgDataNode1 : 'DESCR',
				cfgKeyNode : 'CODE',
				cfgProxyMethodType : 'POST',
				listeners : {
					'render' : function(combo) {
						if(!Ext.isEmpty(strPreClientCode) && !Ext.isEmpty(strPrefClientDesc))
						combo.store.loadRawData({
									"d" : {
										"preferences" : [{
													"CODE" : strPreClientCode,
													"DESCR" : strPrefClientDesc
												}]
									}
								});
						combo.listConfig.width = 200;
						combo.suspendEvents();
						combo.setValue(strPreClientCode);
						combo.resumeEvents();
					}
				}
			}]
		},{
				xtype : 'label',
				text : getLabel('preferences', 'Preferences : '),
				cls : 'xn-account-filter-btnmenu'
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
			}]
});