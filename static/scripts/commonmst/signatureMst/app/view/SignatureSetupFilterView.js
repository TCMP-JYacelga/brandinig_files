Ext
		.define(
				'GCP.view.SignatureSetupFilterView',
				{
					extend : 'Ext.panel.Panel',
					xtype : 'signatureSetupFilterView',
					requires : [ 'Ext.ux.gcp.AutoCompleter' ],
					width : '100%',
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
						var status = me.statusStore();
						var entityStore =me.entityStore();
						var filterContainerArr = new Array();
						var filterDownConatiner = new Array();
						var profileTextfield = {
							xtype : 'container',
							columnWidth : 0.25,
							padding : '1 0 0 10',
							items : [
									{
										xtype : 'label',
										text : getLabel('entityType',
												'Entity Type'),
										padding : '1 0 0 10',
										cls : 'frmLabel'
									},
									{
										xtype : 'combobox',
										width : 200,
										displayField : "value",
										cls : ' ux_no-margin',
										fieldCls : 'xn-form-field inline_block',
                                        triggerBaseCls : 'xn-form-trigger ux_width17',
                                        filterParamName : 'entityType',
                                        itemId : "entityTypeFltId",
                                        valueField : "name",
                                        name : "entityType",
                                        editable : false,
                                        value : getLabel('all', 'All'),
                                        store : entityStore,
                                        padding : '1 0 0 10'
									} ]
						};
						var entityCode = {
							xtype : 'container',
							columnWidth : 0.25,
							padding : '1 0 0 10',
							items : [
									{
										xtype : 'label',
										text : getLabel('entityCode',
												'Entity'),
										padding : '1 0 0 10',
										cls : 'frmLabel'
									},
									{
										xtype : 'AutoCompleter',
										padding : '1 0 0 10',
										cls : ' ux_no-margin',
										fieldCls : 'xn-form-text w10_3 xn-suggestion-box',
										width : 200,
										name : 'entityCode',
										itemId : 'entityCodeFltId',
										cfgUrl : 'services/userseek/{0}.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'signatureEntityCodeSeek',
										cfgRootNode : 'd.preferences',
										cfgProxyMethodType : 'POST',
										cfgDataNode1 : 'DESCRIPTION',
										cfgKeyNode : 'CODE'
										

									} ]
						};
						var accountNumber = {
							xtype : 'container',
							columnWidth : 0.25,
							padding : '1 0 0 10',
							items : [
									{
										xtype : 'label',
										text : getLabel(
												'accountNumber',
												'Account Number'),
										padding : '1 0 0 10',
										cls : 'frmLabel'
									},
									{
										xtype : 'AutoCompleter',
										padding : '1 0 0 10',
										cls : ' ux_no-margin',
										fieldCls : 'xn-form-text xn-suggestion-box',
										width : 290,
										name : 'sigAccNmbr',
										itemId : 'sigAccNmbrFltId',
										cfgUrl : 'services/userseek/{0}.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'signatureAccountNoSeek',
										cfgRootNode : 'd.preferences',
										cfgProxyMethodType : 'POST',
										cfgDataNode1 : 'CODE',
										cfgDataNode2 : 'DESCRIPTION',
										cfgKeyNode : 'CODE',
										cfgDelimiter: '|&nbsp'
										
									} ]
						};
						var signatoryCode = {
							xtype : 'container',
							columnWidth : 0.25,
							padding : '1 0 0 10',
							items : [
									{
										xtype : 'label',
										text : getLabel('signatoryCode',
												'Signatory Code'),
										padding : '1 0 0 10',
										cls : 'frmLabel'
									},
									{
										xtype : 'AutoCompleter',
										padding : '1 0 0 10',
										cls : ' ux_no-margin',
										fieldCls : 'xn-form-text w10_3 xn-suggestion-box',
										width : 200,
										name : 'signatoryCode',
										itemId : 'signatoryCodeFltId',
										cfgUrl : 'services/userseek/{0}.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'signatoryCodeSeek',
										cfgRootNode : 'd.preferences',
										cfgProxyMethodType : 'POST',
										cfgDataNode1 : 'DESCRIPTION',
										cfgKeyNode : 'CODE'
									} ]
						};
						var statusCombo = {
							xtype : 'container',
							columnWidth : 0.25,
							padding : '1 0 0 10',
							items : [ {
								xtype : 'label',
								text : getLabel('status', 'Status'),
								padding : '1 0 0 10',
								cls : 'frmLabel'
							}, {
								xtype : 'combobox',
								width : 200,
								displayField : "value",
								cls : ' ux_no-margin',
								fieldCls : 'xn-form-field inline_block',
								triggerBaseCls : 'xn-form-trigger ux_width17',
								filterParamName : 'module',
								itemId : "sigStatusFltId",
								valueField : "name",
								name : "requestState",
								editable : false,
								value : getLabel('all', 'All'),
								store : status,
								padding : '1 0 0 10'

							} ]
						};

						filterContainerArr.push({
							xtype : 'panel',
							padding : '1 0 0 10',
							layout : 'vbox',
							columnWidth : 0.25,
							itemId : 'sellerFilter',
							items : []
						});
						filterContainerArr.push(profileTextfield);
						filterContainerArr.push(entityCode);
						filterContainerArr.push(accountNumber);
						filterDownConatiner.push(signatoryCode);

						filterDownConatiner.push(statusCombo);
						filterDownConatiner
								.push({
									xtype : 'panel',
									columnWidth : 0.25,
									padding : '20 0 0 10',
									layout : 'vbox',
									items : [ {
										xtype : 'button',
										itemId : 'btnFilter',
										text : getLabel('search', 'Search'),
										cls : 'ux_button-padding ux_button-background ux_button-background-color'
									} ]
								});
						this.items = [ {
							xtype : 'container',
							width : '100%',
							layout : 'vbox',
							items : [ {
								xtype : 'container',
								width : '100%',
								layout : 'column',
								padding : '10 10 10 0',
								items : filterContainerArr

							}, {
								xtype : 'container',
								width : '100%',
								layout : 'column',
								padding : '10 10 10 0',
								items : filterDownConatiner

							} ]
						} ];

						this.callParent(arguments);
					},
					typeStore : function() {

						var typeStore = Ext.create('Ext.data.Store', {
							fields : [ "name", "value" ],
							proxy : {
								type : 'ajax',
								autoLoad : true,
								async : false,
								url : "commonmst/transactionTypeList.json",
								actionMethods : {
									read : 'POST'
								},
								reader : {
									type : 'json',
									root : "d.filter"
								}
							}
						});
						return typeStore;
					},
					statusStore : function() {

						var statusStore = Ext.create('Ext.data.Store', {
							fields : [ "name", "value" ],
							proxy : {
								type : 'ajax',
								autoLoad : true,
								url : 'cpon/statusList.json',
								noCache : false,
								actionMethods : {
									read : 'POST'
								},
								reader : {
									type : 'json',
									root : "d.filter"
								}
							}
						});
						return statusStore;
					},
					entityStore : function() {
                        var entityStore = Ext.create('Ext.data.Store', {
                            fields : [ "name", "value" ],
                            proxy : {
                                type : 'ajax',
                                autoLoad : true,
                                url : 'services/signatureMst/entityTypeList.json',
                                noCache : false,
                                actionMethods : {
                                    read : 'POST'
                                },
                                reader : {
                                    type : 'json',
                                    root : "d.filter"
                                }
                            }
                        });
                        return entityStore;
                    }
				});