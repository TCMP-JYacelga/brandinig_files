Ext
		.define(
				'GCP.view.ReportCenterDtlFilterView',
				{
					extend : 'Ext.panel.Panel',
					xtype : 'reportCenterDtlFilterView',
					requires : [ 'Ext.container.Container', 'Ext.panel.Panel',
							'Ext.ux.gcp.AutoCompleter' ],
					layout : 'vbox',
					initComponent : function() {
						var me = this;
						var storeLength = 0;
						rolesSummaryView = this;
						var statusStore = Ext.create('Ext.data.Store', {
							fields : [ "name", "value" ],
							data : arrStatusFilterLst
						});

						this.items = [ {
							xtype : 'container',
							itemId : 'statusContainer',
							layout : 'vbox',
							flex : 1,
							// width : '25%',
							// padding : '5 0 0 0',
							items : [
									{
										xtype : 'label',
										text : getLabel('status', 'Status')
									},
									Ext.create('Ext.ux.gcp.CheckCombo', {
										itemId : 'statusFilter',
										valueField : 'name',
										displayField : 'value',
										editable : false,
										addAllSelector : true,
										store : statusStore,
										name : 'requestState',
										emptyText : 'All',
										multiSelect : true,
										width : 240,
										padding : '-4 0 0 0',
										isQuickStatusFieldChange : false,
										listeners : {
											'select' : function(combo) {
											},
										},
									})]

						} ];
						this.callParent(arguments);
					},
				});