Ext.define('GCP.view.FxSpreadSetupFilterView', {
			extend : 'Ext.panel.Panel',
			xtype : 'fxSpreadSetupFilterView',
			requires : ['Ext.ux.gcp.AutoCompleter'],
			width : '100%',
			componentCls : 'gradiant_back',
			collapsible : true,
			collapsed :true,
			cls : 'xn-ribbon ux_extralargemargin-bottom',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			initComponent : function() {
				var me = this;
				pmtSummaryView = this;
				var status=me.statusStore();
				var receiverPartyNameSeek = null;
				var receiverAccountSeekUrl = null;
				var filterContainerArr = new Array();
						
				var profileTextfield = {
						xtype : 'container',
						columnWidth : 0.20,
						items : [{
							xtype : 'label',
							text : getLabel('profileName', 'Profile Name'),
							padding : '1 0 0 10',
							cls :'frmLabel'
						}, {
							xtype : 'AutoCompleter',
							padding : '1 0 0 10',
							cls: ' ux_no-margin',
							fieldCls : 'xn-form-text xn-suggestion-box',
							matchFieldWidth : true,
							width : 180,
							name : 'profileName',
							itemId : 'profileNameFltId',
							cfgUrl : 'cpon/cponseek/{0}.json',
							cfgQueryParamName : 'qfilter',
							cfgRecordCount : -1,
							cfgSeekId : 'fxSpreadProfileNameSeek',
							cfgRootNode : 'd.filter',
							cfgDataNode1 : 'name',
							cfgProxyMethodType : 'POST'
						}]
					};				
                  
             var statusCombo= {
						xtype : 'container',
						columnWidth : 0.20,
						items : [{
							xtype : 'label',
							text : getLabel('status', 'Status'),
							padding : '1 0 0 10',
							cls :'frmLabel'
						}, {
							xtype : 'combobox',
							displayField : "value",
							cls: ' ux_no-margin',
							fieldCls : 'xn-form-field inline_block',
							triggerBaseCls : 'xn-form-trigger ux_width17',
							filterParamName : 'module',
							itemId : "profileStatusFltId",
							valueField : "name",
							name : "requestState",
							editable : false,
							value : getLabel('all', 'ALL'),
							store : status,
							width : 'auto',
							padding : '1 0 0 10'
							
						}]
					};	
		   filterContainerArr.push({
								xtype : 'panel',
								padding : '1 0 0 10',
								layout : 'vbox',
								columnWidth : 0.20,
								itemId : 'sellerFilter',
								items : []
							  });	  
				filterContainerArr.push(profileTextfield);
				filterContainerArr.push(statusCombo);
                filterContainerArr.push({xtype : 'panel',
						                 columnWidth : 0.20,
										 padding : '25 0 0 10',
										 layout:'vbox',
										 items:[{
									        xtype : 'button',
										   itemId : 'btnFilter',
										   text : getLabel('search',
														'Search'),
											cls : 'ux_button-padding ux_button-background ux_button-background-color'}]
									});	
				this.items = [{
							xtype : 'container',
							width : '100%',
							layout : 'column',
							padding:'10 10 10 10',
							cls : 'ux_border-top',
							items : filterContainerArr
							
						}];

				this.callParent(arguments);
		},	
		
		statusStore:function(){
		
		statusStore = Ext.create('Ext.data.Store', {
							fields : ["name", "value"],
							proxy : {
								type : 'ajax',
								autoLoad : true,
								url : 'cpon/statusList.json',
								noCache: false,
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
		}
		
});