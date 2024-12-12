Ext.define('GCP.view.EnrichmentSetupFilterView', {
			extend : 'Ext.panel.Panel',
			xtype : 'enrichmentSetupFilterView',
			requires : ['Ext.ux.gcp.AutoCompleter'],
			width : '100%',
			componentCls : 'gradiant_back',
			collapsible : true,
			collapsed :true,
			cls : 'xn-ribbon ux_extralargemargin-bottom ux_border-bottom',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			initComponent : function() {
				var me = this;
				pmtSummaryView = this;
				var type=me.typeStore();
				var status=me.statusStore();
				var receiverPartyNameSeek = null;
				var receiverAccountSeekUrl = null;
				var filterContainerArr = new Array();
			    var filterDownConatiner=new Array();	
				var profileTextfield = {
						xtype : 'container',
						columnWidth : 0.33,
						padding : '1 0 0 10',
						items : [{
							xtype : 'label',
							text : getLabel('profileName', 'Profile Name'),
							padding : '1 0 0 10',
							cls :'frmLabel'
						}, {
							xtype : 'AutoCompleter',
							padding : '1 0 0 10',
							cls: ' ux_no-margin',
							fieldCls : 'xn-form-text w10_3 xn-suggestion-box',
							width : 200,
							name : 'profileName',
							itemId : 'profileNameFltId',
							cfgUrl : 'cpon/cponseek/{0}.json',
							cfgQueryParamName : 'qfilter',
							cfgRecordCount : -1,
							cfgSeekId : 'enrichmentprofilenameseek',
							cfgRootNode : 'd.filter',
							cfgDataNode1 : 'name',
							cfgProxyMethodType : 'POST'
						}]
					};				
				  var transactionCombo= {
						xtype : 'container',
						columnWidth : 0.33,
						padding : '1 0 0 10',
						items : [{
							xtype : 'label',
							text : getLabel('transactionType', 'Transaction Type'),
							cls :'frmLabel'
						}, {
							xtype : 'combobox',
							displayField : "value",
							cls: ' ux_no-margin',
							fieldCls : 'xn-form-field inline_block',
							triggerBaseCls : 'xn-form-trigger',
							filterParamName : 'module',
							itemId : "profileTxnTypeFltId",
							valueField : "name",
							name : "name",
							editable : false,
							value : "ALL",
							store : type,
							width : 200,
							padding : '1 0 0 10'
							
						}]
					};
             var statusCombo= {
						xtype : 'container',
						columnWidth : 0.33,
						padding : '1 0 0 10',
						items : [{
							xtype : 'label',
							text : getLabel('status', 'Status'),
							padding : '1 0 0 10',
							cls :'frmLabel'
						}, {
							xtype : 'combobox',
							width : 200,
							displayField : "value",
							cls: ' ux_no-margin',
							fieldCls : 'xn-form-field inline_block',
				         	triggerBaseCls : 'xn-form-trigger',
							filterParamName : 'module',
							itemId : "profileStatusFltId",
							valueField : "name",
							name : "requestState",
							editable : false,
							value : getLabel('all','All'),
							store : status,
							padding : '1 0 0 10'
							
						}]
					};	
		   filterContainerArr.push({
								xtype : 'panel',
								padding : '1 0 0 10',
								layout : 'vbox',
								columnWidth : 0.33,
								itemId : 'sellerFilter',
								items : []
							  });					
				filterContainerArr.push(profileTextfield);
				filterDownConatiner.push(transactionCombo);
				filterDownConatiner.push(statusCombo);
                filterDownConatiner.push({xtype : 'panel',
						                 columnWidth : 0.33,
										 padding : '20 0 0 10',
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
						      layout : 'vbox',
				      items:[{
							xtype : 'container',
							 width : '100%',
							layout : 'column',
							padding:'10 10 10 0',
							items : filterContainerArr
							
						},{
							xtype : 'container',
							 width : '100%',
							layout : 'column',
							padding:'10 10 10 0',
							items : filterDownConatiner
							
						}]
						}];

				this.callParent(arguments);
		},	
		typeStore:function(){
		
		 typeStore = Ext.create('Ext.data.Store', {
							fields : ["name", "value"],
							proxy : {
								type : 'ajax',
								autoLoad : true,
								async:false,
								url : "cpon/transactionTypeList.json",
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