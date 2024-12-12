Ext.define('GCP.view.eventLog.EventLogFilterView',{
	extend:'Ext.panel.Panel',
	xtype : 'eventLogFilterView',
	requires : [  'Ext.data.Store', 'Ext.form.field.Number',
					'Ext.form.RadioGroup', 'Ext.container.Container',
					'Ext.layout.container.VBox', 'Ext.layout.container.HBox',
					'Ext.form.Label', 'Ext.form.field.Text', 'Ext.button.Button',
					'Ext.menu.Menu', 'Ext.form.field.Date',
					'Ext.layout.container.Column', 'Ext.form.field.ComboBox',
					'Ext.toolbar.Toolbar', 'Ext.ux.gcp.AutoCompleter'],
	layout:'hbox',
	clientData : null,
	padding: 10,
	initComponent : function() {
		var me=this;
		var struserUrl = 'services/userActivityMstSeek/userIDListSeek.json';
		if (entityType == '0')
			struserUrl = 'services/userActivityMstSeek/userAIDListSeek.json';
		var storeData;
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
		var comboSellerStore = Ext.create('Ext.data.Store', {
			fields : ['CODE', 'DESCR'],
			data : storeData,
			reader : {
				type : 'json',
				root : 'preferences'
			}
		});	
		me.items = [{
				xtype : 'container',
				layout : 'vbox',
				width : '20%',
				itemId : 'filterClientContainerWrapper',
				//columnWidth : 0.25,
				padding : '0 15 0 0',
				items : [
				         
				         {xtype : 'container',
								itemId : 'filterSellerContainer',
								layout : 'vbox',
								items : [
								{
									xtype : 'label',
									text : getLabel('lblSeller', 'Financial Institute'),
									cls : 'f13 ux_font-size14' 
								},
								{
									xtype : 'combo',
									fieldCls : 'xn-form-field inline_block ux_font-size14-normal ',
									valueField : 'CODE',
									displayField : 'DESCR',
									width: 175,
									editable : false,
									itemId : 'sellerCode_id',
									store : comboSellerStore,
									triggerAction : 'all',
									triggerBaseCls : 'xn-form-trigger',
									filterParamName : 'sellerCode',
									value : strSellerId,
									listeners : {
										'select' : function(combo, record) {
											var code = combo.getValue();
											setAdminSeller(code);
											me.fireEvent("handleSellerChange", code);
										}
									}
								}
								]
						},{
				xtype : 'container',
				itemId : 'filterClientMenuContainer',
				layout : 'vbox',
				padding : '0 0 0 10',
				hidden : !isClientUser(),
				items : [
				{
				xtype : 'label',
				text : getLabel('userName', 'Company')
				},{
						xtype : 'combo',
						valueField : 'CODE',
						displayField : 'DESCR',
						width: 175,
						queryMode : 'local',
						editable : false,
						triggerAction : 'all',
						itemId : 'quickFilterClientCombo',
						mode : 'local',
						store : me.getClientStore(),
						listeners:{
							'select':function(combo,record){
								me.fireEvent("handleClientChange",combo,record);
							}
						}
				}]
				},{
					xtype : 'container',
					itemId : 'filterClientAutoContainer',
					layout : 'vbox',
					hidden : isClientUser(),
					items : [{
						xtype : 'label',
						text : getLabel('client', 'Company')
						},
						{
						xtype : 'AutoCompleter',
						width: 175,
						fieldCls : 'xn-form-text w10 xn-suggestion-box',
						itemId : 'clientAutoCompleter',
						name : 'clientAutoCompleter',
						enableQueryParam : false,
						hidden : isClientUser(),
						cfgUrl : 'services/userseek/userclients.json',
						cfgRecordCount : -1,
						cfgRootNode : 'd.preferences',
						cfgDataNode1 : 'DESCR',
						cfgDataNode2 : 'CODE',
						cfgKeyNode : 'CODE',
						cfgQueryParamName : '$autofilter',
						listeners : {
							'select' : function(combo, record) {
								var strClientId = combo.getValue();
								var strClientDesc = combo.getRawValue();
								me.fireEvent('handleClientChange',combo,record);
							},
							'change' : function(combo, record) {
								selectedQuickFiletrClient = '';
								selectedQuickFiletrClient = combo.getValue();
								if(Ext.isEmpty(combo.getValue())){
									var strClientId = combo.getValue();
									var strClientDesc = combo.getRawValue();
									me.fireEvent('handleClientChange',combo,record);
								}
							}
							/*'render' : function(combo) {
								combo.listConfig.width = 250;
								
							}*/
							
						}
						}]
			}],
			listeners : {
				afterrender : function(cont,opts){
					if(me.clientData && me.clientData.length <=1){
						cont.hide();
					}
					else
						cont.show();
				}
			}
		}, {
			xtype : 'container',
			itemId : 'entryDateContainer',
			layout : 'vbox',
			width : '20%',
			padding : '0 15 0 0',
			items : [{
						xtype : 'panel',
						itemId : 'entryDatePanel',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									itemId : 'dateLabel',
									text : getLabel('dateToday', 'Last Login(Today)')
								}, {
									xtype : 'button',
									border : 0,
									filterParamName : 'dateTime',
									itemId : 'entryDate',
									cls : 'ui-caret',
									listeners : {
										click:function(event){
												var menus=geteventLogDateDropDownItems("eventEntryDateQuickFilter",this);
												var xy=event.getXY();
												menus.showAt(xy[0],xy[1]+16);
												event.menu=menus;
										}
									}
								}]
					}, {
						xtype : 'component',
						width: 180,
						itemId : 'eventQuickEntryDataPicker',
						filterParamName : 'EntryDate',
						html :'<input type="text" style="width: 100%;" id="entryDataPicker" class="ft-datepicker ui-datepicker-range-alignment">'
					}]
		},{
			xtype : 'container',
			itemId : 'userFiltersContainer',
			layout : 'vbox',
			width : '20%',
			padding : '0 15 0 0',
			items : [{
				xtype : 'label',
				text : getLabel('userId', 'User Id')
				}, {
					xtype : 'AutoCompleter',
					fieldCls : 'xn-form-text w10 xn-suggestion-box',
					name : 'userDescription',
					itemId : 'userNameFltId',
					cfgUrl : struserUrl,
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					width: 175,
					enableQueryParam : false,
					cfgSeekId : 'userNamesList',
					cfgKeyNode : 'name',
					cfgRootNode : 'filterList',
					cfgDataNode1 : 'value',
					cfgDataNode2 : 'name',
					cfgProxyMethodType : 'POST',
					emptyText:getLabel('autoCompleterEmptyText','Enter Keyword or %'),
					listeners : {
						'select' : function(combo, record) {
							var strUserId = combo.getValue();
							var strUserDesc = combo.getRawValue();
							me.fireEvent('handleUserChange',
									strUserId, strUserDesc);
						}
					}
				}]
		},{
			xtype : 'container',
			itemId : 'bankusercontainer',
			layout : 'vbox',
			width : '10%',
			hidden : isClientUser(),
			items : [{
				xtype : 'label',
				text : getLabel('bankuser','Bank User'),
				width : '52px'
				},{
					xtype : 'checkbox',
					padding : '0 0 0 16',
					itemId:'eventBankUserCheckbox',
					handler:function(){
						me.fireEvent('handlebankuser');
					}
			}]
		},{
			xtype : 'container',
			itemId : 'savedFiltersContainer',
			layout : 'vbox',
			width : '20%',
			items : [{
						xtype : 'label',
						itemId : 'savedFiltersLabel',
						text : getLabel('lblsavedFilters','Saved Filters')
					}, {
						xtype : 'combo',
						valueField : 'filterName',
						displayField : 'filterName',
						queryMode : 'local',
						editable : false,
						width: 175,
						triggerAction : 'all',
						itemId : 'savedFiltersCombo',
						mode : 'local',
						emptyText : getLabel('selectfilter','Select Filter'),
						store : me.savedFilterStore(),
						listeners:{
							'select':function(combo,record){
								me.fireEvent("handleSavedFilterItemClick",combo.getValue(),combo.getRawValue());
								}
						}
			 }]
		}]
		this.callParent(arguments);	
	},
	getClientStore:function(){
		var me = this;
		//var clientData=null;
		var objClientStore=null;
		Ext.Ajax.request({
			url : 'services/userseek/userclients.json',
			async : false,
			method : "POST",
			params:{$sellerCode : strSellerId},
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					if (data && data.d) {
						me.clientData = data.d.preferences;
						objClientStore = Ext.create('Ext.data.Store', {
									fields : ['CODE','DESCR'],
									data : me.clientData,
									reader : {
										type : 'json',
										root : 'd.preferences'
									},
									autoLoad : true,
									listeners : {
										load : function() {
											this.insert(0, {
														CODE : 'all',
														DESCR : getLabel('allCompanies', 'All companies')
													});
										}
									}
								});
						objClientStore.load();
					}
				}
			},
			failure : function(response) {
				// console.log('Error Occured');
			}
		});
		return objClientStore;
	},
	savedFilterStore : function() {
		var myStore = new Ext.data.ArrayStore({
					autoLoad : true,
					fields : ['filterName'],
					proxy : {
						type : 'ajax',
						url : 'services/userfilterslist/eventGrpViewFilter.json',
						reader : {
							type : 'json',
							root : 'd.filters'
						}
					},
					listeners : {
						load : function(store, records, success, opts) {
							store.each(function(record) {
										record.set('filterName', record.raw);
									});
						}
					}
				})
		return myStore;
	}
});