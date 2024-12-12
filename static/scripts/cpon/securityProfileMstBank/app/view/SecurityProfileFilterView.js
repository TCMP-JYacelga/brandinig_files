Ext.define('GCP.view.SecurityProfileFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'securityProfileFilterView',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	width : '100%',
	componentCls : 'gradiant_back',
	collapsible : true,
	collapsed : true,
	cls : 'xn-ribbon ux_border-bottom ux_extralargemargin-bottom',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		var me = this;
		var securitySummaryView = this;
		var receiverPartyNameSeek = null;
		var receiverAccountSeekUrl = null;
		var filterContainerArr = new Array();
		var securityProfileNamesList = null;
		var securityProfileNamesSeekId = null;
		var storeData;
		Ext.Ajax
		.request({
			url : 'services/userseek/adminSellersListCommon.json',
			method : "POST",
			async : false,
			success : function(
					response) {
				if (response
						&& response.responseText)
					storeData = Ext.decode(response.responseText);
			},
			failure : function(
					response) {
				// console.log('Error
				// Occured');
			}
		});	
		
		var objStore = Ext.create('Ext.data.Store', {
			fields : [ 'CODE', 'DESCR' ],
			data : storeData.d.preferences,
			reader : {
				type : 'json'
			}			
		});
		if (userType == '0') {
			securityProfileNamesSeekId = 'adminSecurityProfileNamesList';
			securityProfileNamesList = 'services/securityProfileSeek/adminSecurityProfileNamesList.json';
		} else {
			securityProfileNamesSeekId = 'clientSecurityProfileNamesList';
			securityProfileNamesList = 'services/securityProfileSeek/clientSecurityProfileNamesList.json';
		}

		var secPrfNameContainer = Ext.create('Ext.container.Container', {
			columnWidth : 0.70,
			items : [
			{
			xtype : 'panel',
			itemId : 'mainContainer',
			layout : 'hbox',
		//	cls: 'ux_border-top ux_largepadding',
			items :[{
				//panel 1
				xtype : 'panel',
				itemId : 'firstRow',
				cls : 'xn-filter-toolbar',
				flex : 0.25,
				hidden:(objStore.getCount()>1)?false:true,
				layout :
				{
				   type : 'vbox'
				},
				items :
				[{
					xtype : 'panel',
					flex: 1,
					layout :
					{
						type : 'hbox'
					},
					items :
					[{
						xtype : 'label',
						text : getLabel('financialInstitution', 'Financial Institution'),
						cls : 'frmLabel w12'
					}]
				},
				{
					xtype : 'combobox',
					margin : '0 0 0 10',
					width : 160,
					fieldCls : 'xn-form-field inline_block x-trigger-noedit',
					triggerBaseCls : 'xn-form-trigger',
					filterParamName : 'seller',
					editable : false,
					// autoSelect: false,
					name : 'seller',
					itemId : 'sellerIdItemId',
					displayField : 'DESCR',
					valueField : 'CODE',
					queryMode : 'local',
					store : objStore,
					value : strSellerId,
					listeners : {
						'select' : function(combo,
								record) {
							strSellerId = combo
									.getValue();
							setAdminSeller(combo.getValue());
							securitySummaryView.seller = strSellerId;
							var field = securitySummaryView
									.down('combobox[itemId="sellerIdItemId"]');
							field.setValue(strSellerId);
							field.setRawValue(combo.rawValue);

							field.cfgExtraParams = [ {
								key : '$filtercode1',
								value : strSellerId
							} ];
						}
					}
				}				
				]
			},
			//Panel 2
			{
				xtype : 'panel',
			//	cls : 'xn-filter-toolbar',
				flex : 0.25,
				//layout : 'vbox',
				padding : '0px 0px 0px 30px',
				//columnWidth : 0.25,
				items :
				[{
					xtype : 'label',
					text : getLabel('securityProfile', 'Security Profile'),
					cls : 'frmLabel w12'
				
				},{
				xtype : 'AutoCompleter',
				/*cls : 'ux_normalmargin-top ',*/
				fieldCls : 'xn-form-text xn-suggestion-box',
				name : 'profileName',
				matchFieldWidth : true,
				itemId : 'profileNameFltId',
				cfgUrl : securityProfileNamesList,
				cfgQueryParamName : 'qfilter',
				cfgRecordCount : -1,
				width:200,
				cfgSeekId : securityProfileNamesSeekId,
				cfgKeyNode : 'name',
				cfgRootNode : 'filterList',
				cfgDataNode1 : 'name',
				cfgProxyMethodType : 'POST'
				}]
			},{
				xtype : 'panel',
				padding : '0px 0px 0px 80px',
				cls : 'xn-filter-toolbar',
				layout : 'vbox',
				items : [{
							xtype : 'label',
							text : getLabel('status', 'Status'),
							cls : 'frmLabel'
						}, {
							xtype : 'combo',
							width : 150,
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
			}]
		   }
		  ]
		});
		
		var searchBtnConatiner = Ext.create('Ext.container.Container', {
					xtype : 'container',
					//columnWidth : 0.25,
				padding : '24 0 0 120',
					items : [{
								xtype : 'button',
								itemId : 'btnFilter',
								cls : 'xn-btn ux-button-s',
								text : getLabel('search', 'Search')
							}]
				});
		filterContainerArr.push(secPrfNameContainer);
		filterContainerArr.push(searchBtnConatiner);

		this.items = [{
					xtype : 'container',
					width : '100%',
					layout : 'column',
					items : filterContainerArr,
					cls : 'ux_border-top ux_largepadding'
				}];

		this.callParent(arguments);

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