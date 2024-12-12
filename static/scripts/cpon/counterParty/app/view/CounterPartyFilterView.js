Ext.define('GCP.view.CounterPartyFilterView', {
			extend : 'Ext.panel.Panel',
			xtype : 'counterPartyFilterView',
			requires : ['Ext.ux.gcp.AutoCompleter'],
			width : '100%',
			componentCls : 'gradiant_back',
			collapsible : true,
			cls : 'xn-ribbon ux_border-bottom',
			padding : '0 0 12 0',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			initComponent : function() {
				var storeData = null;
				
				var statusStore = Ext.create('Ext.data.Store', {
					fields : ["name", "value"],
					proxy : {
						type : 'ajax',
						autoLoad : true,
						url : 'cpon/statusList.json',
						actionMethods : {
							read : 'POST'
						},
						reader : {
							type : 'json',
							root : 'd.filter'
						}
					}
				});
				
				Ext.Ajax.request({
						url : 'services/userseek/adminSellersListCommon.json',
						method : 'POST',
						async : false,
						success : function(response) {
							var data = Ext.decode(response.responseText);
							var sellerData = data.d.preferences;
							if (!Ext.isEmpty(data)) {
								storeData = sellerData;
							}
						},
						failure : function(response) {
							// console.log("Ajax Get data Call Failed");
						}
				});
				
				var objStore = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR'],
					data : storeData,
					reader : {
						type : 'json',
						root : 'preferences'
					}
				});
		
				var scmProductStore = Ext.create('Ext.data.Store', {
					fields : ['value'],
					proxy : {
						type : 'ajax',
						autoLoad : true,
						url : 'services/counterPartyMstSeek/scmproductseek.json',
						reader : {
							type : 'json',
							root : 'filterList'
						}								
					}
				});
				
				var freezeStore =[
				                 "ALL", "Yes", "No"];

				this.items = [{
					xtype : 'panel',
					cls : 'ux_largepadding',
					layout : 'column',
					width : '100%',
					items : [{
							xtype : 'panel',
							layout : {
								type:'vbox',
								align:'left'
							},
							columnWidth : 0.30,
							items :[
							{
								xtype : 'panel',
								cls : 'xn-filter-toolbar',
								layout : 'vbox',
								columnWidth : 0.5,
								items : [{
											xtype : 'label',
											text : getLabel('seller',
													'Seller'),
											cls : 'frmLabel'
										},{
											xtype : 'combo',
											padding : '1 5 1 5',
											width : 192,
											displayField : 'DESCR',
											fieldCls : 'xn-form-field inline_block',
											triggerBaseCls : 'xn-form-trigger',
											filterParamName : 'sellerId',
											itemId : 'sellerFltId',
											valueField : 'CODE',
											name : 'sellerCombo',
											editable : false,
											value : strSellerId,
											store : objStore,
											listeners : {
												'select' : function(combo, strNewValue, strOldValue) {
													setAdminSeller(combo.getValue());
												}
											}
								}]
						},
						{
								xtype : 'panel',
								cls : 'xn-filter-toolbar',
								layout : 'vbox',
								items : [
									{
								xtype : 'AutoCompleter',
								fieldCls : 'xn-form-text w14 xn-suggestion-box',
								padding : '2 6 0 5',
								fieldLabel : getLabel('counterpartyName','Counterparty Name'),
								labelCls : 'frmLabel',
								labelWidth: 50,
								labelSeparator: '',
								labelAlign : 'top',
								itemId : 'counterpartyName',
								name : 'counterpartyNameAutoCompleter',
								cfgProxyMethodType : 'POST',
								cfgUrl : 'services/counterPartyMstSeek/{0}.json',
								cfgRecordCount : -1,
								cfgRootNode : 'filterList',
								cfgSeekId : 'counterpartyNameSeek',
								cfgQueryParamName : 'qfilter',
								cfgDataNode1 : 'name',
//								cfgDataNode2 : 'name',
								cfgKeyNode : 'value'
								}]
						},{
							xtype : 'panel',
							layout : {
								type:'vbox',
								align:'left'
							}, 
							columnWidth : 0.30,
							items :[
							{
							xtype : 'panel',
								cls : 'xn-filter-toolbar',
								layout : 'vbox',
								items : [{
											xtype : 'label',
											text : getLabel('freeze', 'Relationship Freeze'),
											cls : 'ux_font-size14',
											padding : '2 0 1 5'
										}, {
											xtype : 'combobox',
											fieldCls : 'xn-form-field inline_block',
											triggerBaseCls : 'xn-form-trigger',
											padding : '1 5 1 5',
											width : 193,
											itemId : 'freezeFltId',
											filterParamName : 'freezeId',
											store : freezeStore,
											valueField : 'value',
											name : 'freezeCombo',
											editable : false,
											value : getLabel('all',
													'ALL')
													
										}]
						}]
						}
						]
						},{
							xtype : 'panel',
							layout : {
								type:'vbox',
								align:'left'
							}, 
							columnWidth : 0.30,
							items :[
							{
								xtype : 'panel',
								cls : 'xn-filter-toolbar',
								layout : 'vbox',
								items : [
									{
								xtype : 'AutoCompleter',
								fieldCls : 'xn-form-text w14 xn-suggestion-box',
								padding : '2 6 0 5',
								fieldLabel : getLabel('anchorCient','Anchor Client'),
								labelCls : 'frmLabel',
								labelWidth: 50,
								labelSeparator: '',
								labelAlign : 'top',
								itemId : 'anchorClient',
								name : 'anchorAutoCompleter',
								cfgProxyMethodType : 'POST',
								cfgUrl : 'services/counterPartyMstSeek/{0}.json',
								cfgRecordCount : -1,
								cfgRootNode : 'filterList',
								cfgSeekId : 'anchorClientSeek',
								cfgQueryParamName : 'qfilter',
								cfgDataNode1 : 'name',
//								cfgDataNode2 : 'name',
								cfgKeyNode : 'name'
							}]
						},
						{
							xtype : 'panel',
								cls : 'xn-filter-toolbar',
								layout : 'vbox',
								items : [
									{
								xtype : 'AutoCompleter',
								fieldCls : 'xn-form-text w14 xn-suggestion-box',
								padding : '2 6 0 5',
								fieldLabel :  getLabel('counterpartyClientName','Counterparty\'s Client Name'),
								labelCls : 'frmLabel',
								labelWidth: 50,
								labelSeparator: '',
								labelAlign : 'top',
								itemId : 'counterpartyClientName',
								name : 'counterpartyClientAutoCompleter',
								cfgProxyMethodType : 'POST',
								cfgUrl : 'services/counterPartyMstSeek/{0}.json',
								cfgRecordCount : -1,
								cfgRootNode : 'filterList',
								cfgSeekId : 'counterPartyClientSeek',
								cfgQueryParamName : 'qfilter',
								cfgDataNode1 : 'name',
//								cfgDataNode2 : 'name',
								cfgKeyNode : 'name'
							}]

					},{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						layout : 'vbox',
						items : [
						         {
									xtype : 'panel',
									layout : 'hbox',
									padding : '23 6 0 5',
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
					},
					{
							xtype : 'panel',
							layout : {
								type:'vbox',
								align:'left'
							},
							columnWidth : 0.30,
							items :[
							{
								xtype : 'panel',
								cls : 'xn-filter-toolbar',
								layout : 'vbox',
								items : [{
									xtype : 'AutoCompleter',
								fieldCls : 'xn-form-text w14 xn-suggestion-box',
								padding : '2 6 0 5',
								fieldLabel : getLabel('scmProduct','SCF Package'),
								labelCls : 'frmLabel',
								labelWidth: 50,
								labelSeparator: '',
								labelAlign : 'top',
								itemId : 'scmProductName',
								name : 'scmProductAutoCompleter',
								cfgProxyMethodType : 'POST',
								cfgUrl : 'services/counterPartyMstSeek/scmproductseek.json',
								cfgRecordCount : -1,
								cfgRootNode : 'filterList',
								cfgSeekId : 'scmProductNameSeek',
								cfgQueryParamName : 'qfilter',
								cfgDataNode1 : 'name',
//								cfgDataNode2 : 'name',
								cfgKeyNode : 'name'
								}]
						},{
						xtype : 'panel',
							cls : 'xn-filter-toolbar',
							layout : 'vbox',
							items : [{
										xtype : 'label',
										text : getLabel('status', 'Status'),
										cls : 'ux_font-size14',
										padding : '7 0 6 5'
									}, {
										xtype : 'combobox',
										fieldCls : 'xn-form-field inline_block',
										triggerBaseCls : 'xn-form-trigger',
										padding : '1 5 1 5',
										width : 193,
										itemId : 'statusFilter',
										filterParamName : 'requestState',
										store : statusStore,
										valueField : 'name',
										displayField : 'value',
										editable : false,
										value : getLabel('all',
												'ALL')
	
									}]
					}]
					}
					]
				}];
				this.callParent(arguments);
			}
		});