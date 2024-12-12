Ext.define('GCP.view.UserLimitFilterView', {
			extend : 'Ext.panel.Panel',
			xtype : 'userLimitFilterView',
			requires : ['Ext.ux.gcp.AutoCompleter'],
			layout : {
				type : 'vbox'
			},
			initComponent : function() {
				var me = this;
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

				this.items = [{
					xtype : 'panel',
					layout : 'column',
					cls : 'ux_largepadding',
					width : '100%',
					items : [{
								xtype : 'panel',
								layout : 'vbox',
								itemId : 'sellerFilter',
								items : []
							}, {
								xtype : 'panel',
								layout : 'column',
								cls : 'ux_verylargemargin-left',
								itemId : 'specificFilter',
								items : []
							}, {
								xtype : 'panel',
								layout : 'vbox',
								items : [{
											xtype : 'label',
											text : getLabel('status', 'Status'),
											cls : 'frmLabel'
										}, /*{
											xtype : 'combobox',
											triggerBaseCls : 'xn-form-trigger',
											padding : '1 5 1 5',
											width : 200,
											itemId : 'statusFilter',
											filterParamName : 'requestState',
											store : statusStore,
											valueField : 'name',
											displayField : 'value',
											editable : false,
											value : getLabel('all', 'ALL'),
											listeners : {
												'blur' : function(combo)
												{
													$(document).trigger("handleClientChangeInQuickFilter", false);
												}
											}
										}*/
										Ext.create('Ext.ux.gcp.CheckCombo', {
											name : 'mandateStatusDescription',
											itemId : 'statusFilter',
											width: 200,
											valueField : 'code',
											displayField : 'desc',
											editable : false,
											matchFieldWidth : true,
											filterParamName : 'requestState',
											addAllSelector : true,
											emptyText : 'All',
											multiSelect : true,
											store :me.getStatusStore(),
											isQuickStatusFieldChange : false,
											listeners : {
												'blur' : function(combo)
												{
													$(document).trigger("handleClientChangeInQuickFilter", false);
												}
											}
										})
										]

							}, {
								xtype : 'panel',
								cls : 'xn-filter-toolbar ux_verylargemargin-left',
								layout : 'vbox',
								items : [{
									xtype : 'panel',
									layout : 'hbox',
									padding : '23 0 1 5',
									items : [{
												xtype : 'button',
												itemId : 'btnFilter',
												text : getLabel('search',
														'Search'),
												cls : 'search_button ux_button-background-color ux_button-padding',
												height : 22
											}]
								}]
							}]
				}];
				this.callParent(arguments);
			},
			getStatusStore : function()
			{
				/*var statusStore = Ext.create('Ext.data.Store', {
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
				});*/
				var objStatusStore;
				objStatusStore = Ext.create('Ext.data.Store', {
					fields : ['code','desc'],
					data : arrStatus,
					autoLoad : true,
					listeners : {
						load : function() {
						}
					}
				});
				objStatusStore.load();
				return objStatusStore;
			}
		});