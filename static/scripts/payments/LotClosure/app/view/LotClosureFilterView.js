Ext
		.define(
				'GCP.view.LotClosureFilterView',
				{
					extend : 'Ext.panel.Panel',
					xtype : 'LotClosureFilterView',
					requires : [ 'Ext.ux.gcp.AutoCompleter',
							'Ext.menu.DatePicker', 'Ext.form.field.Date',
							'Ext.form.field.VTypes' ],
					width : '100%',
					componentCls : 'gradiant_back',
					collapsible : true,
					collapsed : true,
					cls : 'xn-ribbon ux_border-bottom',
					layout : {
						type : 'vbox',
						align : 'stretch'
					},
					title : getLabel('filterBy', 'Filter By: ')
							+ '<img id="imgFilterInfoStdView" class="largepadding icon-information"/>',
					initComponent : function() {
						var me = this;
						Ext.Ajax.request({
							url : 'services/sellerListFltr.json' + "?"
									+ csrfTokenName + "=" + csrfTokenValue,
							method : 'POST',
							async : false,
							success : function(response) {
								var data = Ext.decode(response.responseText);
								if (!Ext.isEmpty(data)) {
									storeData = data;
								}
							},
							failure : function(response) {
							}

						});
						var objStore = Ext.create('Ext.data.Store', {
							fields : [ 'sellerCode', 'description' ],
							data : storeData,
							reader : {
								type : 'json',
								root : 'filterList'
							}
						});
						
						Ext.Ajax.request({
							url : 'services/lotClosureStatusList.json'+ "?"
									+ csrfTokenName + "=" + csrfTokenValue,
							method : 'POST',
							async : false,
							success : function(response) {
								var data = Ext.decode(response.responseText);
								if (!Ext.isEmpty(data)) {
									storeData = data;
								}
							},
							failure : function(response) {
							}

						});
						
						var statusStore = Ext.create('Ext.data.Store', {
									fields : ["name", "value"],
									data : storeData,
									reader : {
										type : 'json',
										root : 'filterList'
									}									
								});
						
						if (objStore.getCount() > 1) {
							multipleSellersAvailable = true;
						}

						this.items = [
								{
									xtype : 'container',
									width : '100%',
									layout : 'hbox',
									cls : 'xn-filter-toolbar',
									margin : '10px',
									items : [
											{
												xtype : 'panel',
												cls : 'xn-filter-toolbar',
												hidden : multipleSellersAvailable == true ? false
														: true,
												width : '25%',
												layout : {
													type : 'vbox'
												},
												items : [
														{
															xtype : 'panel',
															layout : {
																type : 'hbox'
															},
															width : 150,
															items : [ {
																xtype : 'label',
																text : getLabel(
																		'lbl.payments.seller',
																		'Financial Institution'),
																cls : 'frmLabel'
															} ]
														},
														{
															xtype : 'combo',
															displayField : 'description',
															cls : 'w15',
															fieldCls : 'xn-form-field inline_block',
															triggerBaseCls : 'xn-form-trigger',
															filterParamName : 'sellerCode',
															itemId : 'entitledSellerIdItemId',
															valueField : 'sellerCode',
															name : 'sellerCombo',
															editable : false,
															value : strSellerId,
															store : objStore,
															listeners : {
																'select' : function(
																		combo,
																		strNewValue,
																		strOldValue) {
																	setAdminSeller(combo
																			.getValue());
																}
															}
														} ]
											},
											{
												xtype : 'container',
												layout : 'vbox',
												width : '25%',
												items : [
														{
															xtype : 'label',
															text : getLabel(
																	'lbl.lotClosure.companyname',
																	'Company Name'),
															cls : 'frmLabel'
														},
														{
															xtype : 'AutoCompleter',
															matchFieldWidth : true,
															width : '210px',
															fieldCls : 'xn-form-text xn-suggestion-box ux_font-size14-normal',
															cls : 'ux_font-size14-normal',
															name : 'clientCode',
															itemId : 'clientCode',
															cfgUrl : 'services/userseek/LotClosureCompanySeek.json',
															cfgProxyMethodType : 'POST',
															cfgQueryParamName : '$autofilter',
															cfgRecordCount : -1,
															cfgSeekId : 'LotClosureCompanySeek',
															enableQueryParam : false,
															cfgRootNode : 'd.preferences',
															cfgKeyNode : 'CODE',
															cfgDataNode1 : 'DESCRIPTION',
															cfgExtraParams : [ {
																key : '$filtercode1',
																value : strSellerId
															} ]
														} ]
											},
											{
												xtype : 'container',
												layout : 'vbox',
												width : '25%',
												items : [
														{
															xtype : 'label',
															text : getLabel(
																	'lbl.lotclosure.clientbranch',
																	'Client Linked Branch'),
															cls : 'frmLabel',
														},
														{
															xtype : 'AutoCompleter',
															matchFieldWidth : true,
															width : '210px',
															fieldCls : 'xn-form-text xn-suggestion-box ux_font-size14-normal',
															cls : 'ux_font-size14-normal',
															name : 'clientBranchCode',
															itemId : 'clientBranchCode',
															cfgUrl : 'services/userseek/LotClosureClientBranch.json',
															cfgProxyMethodType : 'POST',
															cfgQueryParamName : '$autofilter',
															cfgRecordCount : -1,
															cfgSeekId : 'LotClosureClientBranch',
															enableQueryParam : false,
															cfgRootNode : 'd.preferences',
															cfgKeyNode : 'CODE',
															cfgDataNode1 : 'DESCR',
															cfgDataNode2 : 'CODE',
															cfgExtraParams : [ {
																key : '$filtercode1',
																value : strSellerId
															} ]
														} ]
											},
											{
												xtype : 'container',
												layout : 'vbox',
												width : '25%',
												items : [
														{
															xtype : 'label',
															text : getLabel(
																	'lbl.lotclosure.Bank',
																	'Bank Name'),
															cls : 'frmLabel',
														},
														{
															xtype : 'AutoCompleter',
															matchFieldWidth : true,
															width : '210px',
															fieldCls : 'xn-form-text xn-suggestion-box ux_font-size14-normal',
															cls : 'ux_font-size14-normal',
															name : 'dispBankCode',
															itemId : 'dispBankCode',
															cfgUrl : 'services/userseek/LotClosureBank.json',
															cfgProxyMethodType : 'POST',
															cfgQueryParamName : '$autofilter',
															cfgRecordCount : -1,
															cfgSeekId : 'LotClosureBank',
															enableQueryParam : false,
															cfgRootNode : 'd.preferences',
															cfgKeyNode : 'CODE',
															cfgDataNode1 : 'DESCR',
															cfgDataNode2 : 'CODE',
															cfgExtraParams : [ {
																key : '$filtercode1',
																value : strSellerId
															} ]
														} ]
											}, ]
								},
								{
									xtype : 'container',
									itemId : 'filterParentContainer',
									width : '100%',
									layout : 'hbox',
									margin : '10px',

									items : [
											{
												xtype : 'container',
												layout : 'vbox',
												width : '25%',
												items : [
														{
															xtype : 'label',
															text : getLabel(
																	'lbl.lotclosure.branch',
																	'System Branch'),
															cls : 'frmLabel',
														},
														{
															xtype : 'AutoCompleter',
															matchFieldWidth : true,
															width : '210px',
															fieldCls : 'xn-form-text xn-suggestion-box ux_font-size14-normal',
															cls : 'ux_font-size14-normal',
															name : 'sysBranchCode',
															itemId : 'sysBranchCode',
															cfgUrl : 'services/userseek/LotClosureSysBranch.json',
															cfgProxyMethodType : 'POST',
															cfgQueryParamName : '$autofilter',
															cfgRecordCount : -1,
															cfgSeekId : 'LotClosureSysBranch',
															enableQueryParam : false,
															cfgRootNode : 'd.preferences',
															cfgKeyNode : 'CODE',
															cfgDataNode1 : 'DESCR',
															cfgDataNode2 : 'CODE',
															cfgExtraParams : [ {
																key : '$filtercode1',
																value : strSellerId
															} ]
														} ]
											},
											
											{
												xtype : 'container',
												itemId : 'statusContainer',
												layout : 'vbox',
												width : '25%',
												items : [
														{
															xtype : 'label',
															text : getLabel(
																	'lbl.lotclosure.product',
																	'Product'),
															cls : 'frmLabel'
														},
														{
															xtype : 'AutoCompleter',
															matchFieldWidth : true,
															width : '210px',
															fieldCls : 'xn-form-text xn-suggestion-box ux_font-size14-normal',
															cls : 'ux_font-size14-normal',
															name : 'productCode',
															itemId : 'productCode',
															cfgUrl : 'services/userseek/LotClosureProduct.json',
															cfgProxyMethodType : 'POST',
															cfgQueryParamName : '$autofilter',
															cfgRecordCount : -1,
															cfgSeekId : 'LotClosureProduct',
															enableQueryParam : false,
															cfgRootNode : 'd.preferences',
															cfgKeyNode : 'CODE',
															cfgDataNode1 : 'DESCR',
															cfgDataNode2 : 'CODE',
															cfgExtraParams : [ {
																key : '$filtercode1',
																value : strSellerId
															} ]
														} ]
											},
											{
												xtype : 'container',
												layout : 'vbox',
												width : '25%',
												items : [
														{
															xtype : 'label',
															text : getLabel(
																	'lblStatus','Status'),
															cls : 'frmLabel'
														},
														{
															xtype : 'combo',
															fieldCls : 'xn-form-field inline_block',
															triggerBaseCls : 'xn-form-trigger',
															width : 165,
															itemId : 'status',
															store : statusStore,
															valueField : 'name',
															displayField : 'value',
															name : 'status',
															editable : false,
															value :  getLabel('open', 'Open')															
														} ]
											},
											{
												xtype : 'panel',
												cls : 'xn-filter-toolbar',
												layout : 'vbox',
												weight : '25%',
												items : [ {
													xtype : 'panel',
													layout : 'hbox',
													padding : '23 0 1 0',
													items : [ {
														xtype : 'button',
														itemId : 'btnFilter',
														text : getLabel(
																'search',
																'Search'),
														cls : 'ux_button-padding ux_button-background ux_button-background-color',
														height : 22
													} ]
												} ]
											} ]
								} ];
						this.callParent(arguments);
					}
				});
