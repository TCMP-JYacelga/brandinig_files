Ext.define('GCP.view.ContractSetupFilterView', {
			extend : 'Ext.panel.Panel',
			xtype : 'contractSetupFilterView',
			requires : ['Ext.ux.gcp.AutoCompleter'],
			width : '100%',
			componentCls : 'gradiant_back',
			collapsible : true,
			collapsed : true,
			cls : 'xn-ribbon ux_extralargemargin-bottom',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			initComponent : function() {
				var me = this;
	
		var filterContainerArr = new Array();	
		
			var contractTextfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
					padding : '1 0 0 10',
					fieldCls : 'xn-form-text w10_3 xn-suggestion-box',
					name : 'contractName',
					itemId : 'contractNameFltId',
					cfgUrl : 'cpon/cponseek/{0}.json',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : 'qfilter',
					enableQueryParam:false,
					cfgRecordCount : -1,
					cfgSeekId : 'fxContractNameSeek',
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name'
				});
				var templateTextfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
					padding : '1 0 0 10',
				//	cls:'ux_largepadding-left',
					fieldCls : 'xn-form-text w10_3 xn-suggestion-box',
					name : 'ContractClientName',
					itemId : 'clientNameFltId',
					cfgUrl : 'cpon/cponseek/{0}.json',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : 'qfilter',
					enableQueryParam:false,
					cfgRecordCount : -1,
					cfgSeekId : 'fxClientNameSeek',
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name'
				});
				var buyCurrencyTextfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
					padding : '1 0 0 10',
					fieldCls : 'xn-form-text w10_3 xn-suggestion-box',
					name : 'buyCurrency',
					itemId : 'buyCurrencyFltId',
					cfgUrl : 'cpon/cponseek/{0}.json',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : 'qfilter',
					enableQueryParam:false,
					cfgRecordCount : -1,
					cfgSeekId : 'fxBuyCurrencySeek',
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name'
				});
				var sellCurrencyTextfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
					padding : '1 10 0 10',
					fieldCls : 'xn-form-text w10_3 xn-suggestion-box',
					name : 'sellCurrency',
					itemId : 'sellCurrencyFltId',
					cfgUrl : 'cpon/cponseek/{0}.json',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : 'qfilter',
					enableQueryParam:false,
					cfgRecordCount : -1,
					cfgSeekId : 'fxSellCurrencySeek',
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name'
				});
				this.items = [{
					xtype : 'panel',
					layout : 'column',
					width : '100%',
					cls:'ux_border-top ux_largepadding',
					items : [{
							xtype : 'panel',
							layout : 'column',
							columnWidth : 0.25,
							itemId : 'specificFilter',
							items :[]
						    },{
						        xtype : 'panel',
							//	cls : 'xn-filter-toolbar',
								layout : 'vbox',
								columnWidth : 0.30,
								items : [{
											xtype : 'label',
											text : getLabel('companyName', 'Company Name'),
											cls : 'ux_normalpadding-bottom ux_font-size14 ux_largepadding-left'
										}, templateTextfield]
					},{
						        xtype : 'panel',
							//	cls : 'xn-filter-toolbar',
								layout : 'vbox',
								columnWidth : 0.35,
								items : [{
											xtype : 'label',
											text : getLabel('contractName', 'Contract Name'),
											cls : 'ux_font-size14  ux_normalpadding-bottom ux_largepadding-left'
										}, contractTextfield]
					}]
				},{
				  xtype : 'panel',
					layout : 'column',
					width : '100%',
					cls:'ux_largepadding',
					items : [{
						        xtype : 'panel',
							//	cls : 'xn-filter-toolbar',
								layout : 'vbox',
								columnWidth : 0.25,
								items : [{
											xtype : 'label',
											text : getLabel('buyCurrency', 'Buy Currency'),
											cls : 'ux_font-size14  ux_normalpadding-bottom ux_largepadding-left'
										}, buyCurrencyTextfield]
					},{
						        xtype : 'panel',
							//	cls : 'xn-filter-toolbar',
								layout : 'vbox',
								columnWidth : 0.23,
								items : [{
											xtype : 'label',
											text : getLabel('sellCurrency', 'Sell Currency'),
											cls : 'ux_font-size14  ux_normalpadding-bottom ux_largepadding-left'
										}, sellCurrencyTextfield]
					},{
						xtype : 'panel',
						padding : '0px 0px 0px 100px',
						columnWidth : 0.29,
						cls : 'xn-filter-toolbar',
						layout : 'vbox',
						items : [{
									xtype : 'label',
									text : getLabel('status', 'Status'),
									cls : 'frmLabel'
								}, {
									xtype : 'combo',
									width : 200,
									displayField : 'value',
									valueField : 'name',
									value : getLabel('all','ALL'),
									fieldCls : 'xn-form-field inline_block',
									triggerBaseCls : 'xn-form-trigger',
									filterParamName : 'statusFilter',
									itemId : 'statusFilter',
									name : 'statusCombo',
									editable : false,
									store : me.getStatusStore()
								}]
					},{
						xtype : 'panel',
					//	cls : 'xn-filter-toolbar',
						layout : 'vbox',
						columnWidth : 0.10,
						items : [{
									xtype : 'panel',
									layout : 'hbox',
									padding : '25 10 10 40',
									items : [{
												xtype : 'button',
												itemId : 'btnFilter',
												text : getLabel('search',
														'Search'),
												cls : 'xn-btn ux-button-s',		
												width : 60,
												height : 22
											}]
								}]
					}]
					}];
				this.callParent(arguments);
			},
			handleSellerChange : function(selectedSeller) {
				var me = this;
				var form;
				var strUrl = 'clientServiceChangeSeller.form';
				var errorMsg = null;
				if (!Ext.isEmpty(strUrl)) {
					form = document.createElement('FORM');
					form.name = 'frmMain';
					form.id = 'frmMain';
					form.method = 'POST';
					form.appendChild(me.createFormField('INPUT', 'HIDDEN',
							csrfTokenName, tokenValue));
					form.appendChild(me.createFormField('INPUT', 'HIDDEN',
							'selectedSellerCode', selectedSeller));

					form.action = strUrl;
					document.body.appendChild(form);
					form.submit();
					document.body.removeChild(form);
				}
			},		
			createFormField : function(element, type, name, value) {
				var inputField;
				inputField = document.createElement(element);
				inputField.type = type;
				inputField.name = name;
				inputField.value = value;
				return inputField;
			},
			getStatusStore : function(){
				var objStatusStore = null;
				if (!Ext.isEmpty(arrStatusFilterLst)) {
					
					arrStatusFilterLst.push({
						name : 'ALL',
						value : getLabel('all','ALL')
					});					
					objStatusStore = Ext.create('Ext.data.Store', {
								fields : ['name','value'],
								data : arrStatusFilterLst,
								autoLoad : true,
								listeners : {
									load : function() {
									}
								}
							});
					objStatusStore.load();
				}
				return objStatusStore;
			}
		});