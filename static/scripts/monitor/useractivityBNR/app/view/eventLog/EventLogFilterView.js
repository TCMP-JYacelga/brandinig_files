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
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	clientData : null,
	isSelectUserName  : false,
	oldUserName : '',
	initComponent : function() {
		var me=this;
		var clientStore = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR']
				});
		Ext.Ajax.request({
					url : 'services/userseek/userclients.json',
					method : 'POST',
					async : false,
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var data = responseData.d.preferences;
						if (clientStore) {
							clientStore.removeAll();
							var count = data.length;
							if (count > 1) {
								clientStore.add({
											'CODE' : 'all',
											'DESCR' : getLabel('allCompanies', 'All companies')
										});
							}
							for (var index = 0; index < count; index++) {
								var record = {
									'CODE' : data[index].CODE,
									'DESCR' : data[index].DESCR
								}
								clientStore.add(record);
							}
						}
					},
					failure : function() {
					}
				});
		
		me.items = [
		{
			xtype : 'container',
			width : '100%',
			items : [
			    {
					  xtype: 'container',
					  layout : 'vbox',
					  width : '25%',
					  padding: '0 30 0 0',
					  hidden: ((clientStore.getCount() < 2) || !isClientUser()) ? true : false,//If count is one or admin then hide
					  items:[
					     {
					    	 xtype: 'label',
					    	 text : getLabel('lblcompany', 'Company Name')
					     },{
						 xtype : 'combo',			            	        	 
						 displayField : 'DESCR',
						 valueField : 'CODE',
						 queryMode : 'local',
						 editable : false,
						 triggerAction : 'all',
						 width : '100%',
						 padding : '-4 0 0 0',
						 itemId : 'clientCombo',
						 mode : 'local',
						 emptyText : getLabel('selectCompany', 'Select Company Name'),
						 store : clientStore,
						 listeners : {
						 	'select' : function(combo, record) {
							selectedFilterClientDesc = combo.getRawValue();
							selectedFilterClient = combo.getValue();
							$(document).trigger("handleClientChangeInQuickFilter", false);
										},
										boxready : function(combo, width, height, eOpts) {
											if (Ext.isEmpty(combo.getValue())) {										
												combo.setValue(combo.getStore().getAt(0));
											}
										}
									 }
						         }
						      ]
				},
				{
				  xtype: 'container',
				  layout : 'vbox',
				  width : '25%',
				  padding: '0 30 0 0',
				  hidden: (isClientUser()) ? true : false,// If not admin then hide
				  items:[
				         {
				        	 xtype: 'label',
				        	 text : getLabel('lblcompany', 'Company Name')
				         },{
				        	 xtype : 'AutoCompleter',
				        	 width : '100%',
				        	 matchFieldWidth : true,
				        	 name : 'clientCombo',			            	        		
				        	 itemId : 'clientComboAuto',
				        	 cfgUrl : "services/userseek/userclients.json",
				        	 padding : '-4 0 0 0',
				        	 cfgQueryParamName : '$autofilter',
				        	 cfgRecordCount : -1,
				        	 cfgSeekId : 'userclients',
				        	 cfgKeyNode : 'CODE',
				        	 cfgRootNode : 'd.preferences',
				        	 cfgDataNode1 : 'DESCR',
				        	 emptyText : getLabel('searchByCompany', 'Enter Keyword or %'),
				        	 enableQueryParam:false,
				        	 cfgProxyMethodType : 'POST',
				        	 listeners : {
				        		 'select' : function(combo, record) {
				        			 selectedFilterClientDesc = combo.getRawValue();
				        			 selectedFilterClient = combo.getValue();
				        			 $(document).trigger("handleClientChangeInQuickFilter",false);
				        		 },
				        		 'change' : function(combo, record) {
				        			 if (Ext.isEmpty(combo.getValue())) {
				        				 selectedFilterClientDesc = "";
				        				 selectedFilterClient = "";
				        				 $(document).trigger("handleClientChangeInQuickFilter",false);
				        			 }
				        		 }
				        	 }
				         }
				         ]
				}]
		}, {
			xtype : 'container',
			itemId : 'filterParentContainer',
			width : '100%',
			layout : 'hbox',
			items : [{
					xtype : 'container',
					itemId : 'savedFiltersContainer',
					layout : 'vbox',
					width : '25%',
					padding : '0 30 0 0',
					items : [{
								xtype : 'label',
								itemId : 'savedFiltersLabel',
								text : getLabel('lblsavedFilters','Saved Filters'),
								padding: '-4 0 0 0'
							}, {
								xtype : 'combo',
								valueField : 'filterName',
								displayField : 'filterName',
								queryMode : 'local',
								editable : false,
								triggerAction : 'all',
								itemId : 'savedFiltersCombo',
								width: '100%',
								mode : 'local',
								emptyText : getLabel('selectfilter','Select Filter'),
								store : me.savedFilterStore(),
								listeners:{
									'select':function(combo,record){
										me.fireEvent("handleSavedFilterItemClick",combo.getValue(),combo.getRawValue());
										}
								}
					 }]
				},
		{
			xtype : 'container',
			itemId : 'userFiltersContainer',
			layout : 'vbox',
			width : '25%',
			padding : '0 30 0 0',
			items : [{
				xtype : 'label',
				text : getLabel('userId', 'User Id')
				//padding : '0 0 0 0'
				}, {
					xtype : 'AutoCompleter',
					fieldCls : 'xn-form-text w10 xn-suggestion-box',
					name : 'userDescription',
					itemId : 'userNameFltId',
					cfgUrl : 'services/userActivityMstSeek/userNamesListSeek.json',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					width: '100%',
					enableQueryParam : false,
					cfgSeekId : 'userNamesList',
					cfgKeyNode : 'value',
					cfgRootNode : 'filterList',
					cfgDataNode1 : 'value',
					cfgDataNode2 : 'name',
					cfgProxyMethodType : 'POST',
					emptyText:getLabel('autoCompleterEmptyText','Enter Keword or %'),
					listeners : {
						'select' : function(combo, record) {
							var strUserId = combo.getValue();
							var strUserDesc = combo.getRawValue();
							me.isSelectUserName = true;
							me.fireEvent('handleUserChange',
									strUserId, strUserDesc);
						},
						'change' : function(combo, record, oldVal) {
							me.oldUserName = oldVal;
							if(isClientUser()){
								combo.cfgExtraParams=[{
									key : '$filterseller',
									value : sessionSellerCode								
								}]
							}
							else {
								if(Ext.isEmpty(selectedQuickFiletrClient) && selectedQuickFiletrClient != 'null')
									selectedQuickFiletrClient ='';
								combo.cfgExtraParams = [{
									key : '$filterseller',
									value : sessionSellerCode
								}];
							}
							if(Ext.isEmpty(combo.getValue())){
								var strUserId = combo.getValue();
								var strUserDesc = combo.getRawValue();
								me.isSelectUserName  = true;	
								me.oldUserName = "";
								me.fireEvent('handleUserChange',
										strUserId, strUserDesc);
							}
						},
						keyup : function(combo, e, eOpts){
							me.isSelectUserName = false;
						},
						blur : function(combo, record){
							var strUserId = combo.getValue();
							var strUserDesc = combo.getRawValue();
							if (me.isSelectUserName == false && me.oldUserName != combo.getRawValue()){
								me.fireEvent('handleUserChange',
										strUserId, strUserDesc);
							}	
							me.oldUserName = strUserDesc;
						}
					}
				}]
		},
		{
			xtype : 'container',
			itemId : 'entryDateContainer',
			layout : 'vbox',
			width : '50%',
			padding : '0 30 0 0',
			items : [{
						xtype : 'panel',
						itemId : 'entryDatePanel',
						layout : 'hbox',
						height : 27,
						flex : 1,
						items : [{
									xtype : 'label',
									itemId : 'dateLabel',
									text : getLabel('dateToday', 'Last Login'),
									padding : '0 0 0 0'
								}, {
									xtype : 'button',
									border : 0,
									filterParamName : 'dateTime',
									itemId : 'creationDate',
									cls : 'ui-caret-dropdown',
									listeners : {
										click:function(event){
												var menus=geteventLogDateDropDownItems("eventEntryDateQuickFilter",this);
												var xy=event.getXY();
												menus.showAt(xy[0],xy[1]+16);
												event.menu=menus;
										}
									}
								}]
					},
						
					{
					xtype : 'container',
					itemId : 'entryDateToContainer',
					layout : 'hbox',
					width : '50%',
					items : [{
						xtype : 'component',
						width : '84%',
						itemId : 'eventQuickEntryDataPicker',
						filterParamName : 'creationDate',
						html : '<input type="text"  id="entryDataPicker" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
					}, {
						xtype : 'component',
						cls : 'icon-calendar',
						margin : '1 0 0 0',
						html : '<span class=""><i class="fa fa-calendar"></i></span>'
					}]
				 }]
		},
		{
			xtype : 'container',
			itemId : 'bankusercontainer',
			layout : 'vbox',
			width : '25%',
			hidden : isClientUser(),
			items : [{
				xtype : 'label',
				text : getLabel('bankuser','Bank User'),
				width : '52px'
				},{
					xtype : 'checkbox',
					padding : '-4 0 0 0',
					itemId:'eventBankUserCheckbox',
					handler:function(){
						me.fireEvent('handlebankuser');
					}
			}]
		}]}]
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