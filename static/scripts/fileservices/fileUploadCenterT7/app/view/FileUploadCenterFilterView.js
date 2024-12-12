Ext.define('GCP.view.FileUploadCenterFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'fileUploadCenterFilterView',
	requires : ['Ext.form.RadioGroup','Ext.container.Container'],
	width : '100%',
	layout : {
		type : 'hbox'
	},
	entityType : entityType == 1 ? 'BANK_CLIENT' : 'BANK',   
	initComponent : function() {
		var me = this;
		clientStore = me.getClientStore();
		this.items = [me.createFilterPanelFields()];
		this.callParent(arguments);
	},
	createFilterPanelFields : function(){
		var me = this;
		var parentPanel = Ext.create( 'Ext.panel.Panel',
		{
			layout : 'vbox',
			itemId : 'filterLowerPanel',
			cls : 'ux_largepaddinglr ux_largepadding-bottom',
			width : '100%',
			items :
			[
				me.createUpperPanel(),me.createLowerPanel()
			]
		} );
		return parentPanel;
	},
	createUpperPanel : function(){		
		var me = this;
		var clientPanel = Ext.create( 'Ext.panel.Panel',
		{
			xtype : 'container',
			layout : 'vbox',
			hidden : ((clientStore.getCount() <= 2)) ? true : false,//If count is one or admin then hide
			width : '25%',
			padding : '0 30 0 0',
			items :
			[
				{
					xtype : 'label',
					itemId : 'savedFiltersLabel',
					text : getLabel('lblcompany', 'Company Name')
				}, {
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
							selectedClientDesc = combo.getRawValue();
							$('#msClient').val(selectedFilterClient);
							changeClientAndRefreshGrid(combo.getValue(), combo.getRawValue());
						},
						boxready : function(combo, width, height, eOpts) {
							combo.setValue(combo.getStore().getAt(0));
						}
					}
				}]
				
			
		} );
		return clientPanel;
	},
	createLowerPanel : function() {		
		var me = this;
		var lowerPanel = Ext.create( 'Ext.panel.Panel',
		{
			layout : 'hbox',
			itemId : 'filterLowerPanel',
			cls : 'ux_largepaddinglr ux_largepadding-bottom',
			width : '100%',
			items :[ me.createSavedFilterPanel(), me.createImportDatePanel()]
		} );
		return lowerPanel;
	},	
	createSavedFilterPanel : function() {
		var me = this;
		var savedFilterPanel = Ext.create( 'Ext.panel.Panel',
		{
			itemId : 'savedFiltersPanel',
			cls : 'xn-filter-toolbar',
			width : '25%',
			padding : '0 30 0 0',
//			flex : 1,
			hidden : isHidden('AdvanceFilter'),
			layout :
			{
				type : 'vbox'
			},
			items :
			[
				{
					xtype : 'label',
					itemId : 'savedFiltersLabel',
					text :  getLabel('lblSavedFilter', 'Saved Filters')
				}, {
					xtype : 'combo',
					valueField : 'filterName',
					displayField : 'filterName',
					queryMode : 'local',
					editable : false,
					triggerAction : 'all',
					itemId : 'savedFiltersCombo',
					mode : 'local',
					triggerBaseCls : 'xn-form-trigger',
					emptyText : getLabel('selectfilter', 'Select Filter'),
					store : me.savedFilterStore(),
					width : '100%',
					padding : '-4 0 0 0',
					listeners : {
						'select' : function(combo, record) {
							me.fireEvent("handleSavedFilterItemClick",
									combo.getValue(), combo.getRawValue());
						}
					}
				}]
				
		} );
		return savedFilterPanel;
	},
	createImportDatePanel : function(){
		var me = this;
		var importDateFilterPanel = Ext.create( 'Ext.panel.Panel',
		{
			itemId : 'importDateFilterPanel',
			cls : 'xn-filter-toolbar',
			width : '25%',
//			flex : 1,
			layout :
			{
				type : 'vbox'
			},
			items :
			[
				{
					xtype : 'panel',
					itemId : 'importDatePanel',
					layout : 'hbox',
					width : '100%',
					padding : '-4 0 0 0',
					items : [{
								xtype : 'label',
								itemId : 'importDateLabel',
								text : getLabel('importDate', 'Import Date')
							}, {
								xtype : 'button',
								border : 0,
								style: {
									'padding-bottom' : '0px !important'
								},
								filterParamName : 'importDate',
								itemId : 'importDatePicker',
								width : '100%',
								cls : 'ui-caret',
								listeners : {
											click:function(event){
													var menus=getDateDropDownItems("importDateQuickFilter",this);
													var xy=event.getXY();
													menus.showAt(xy[0],xy[1]+16);
													event.menu=menus;
											}
								}
							}]
			}, 
			{
				xtype : 'panel',								
				layout : 'hbox',
				width : '100%',
				items : [
				
					{
						xtype : 'component',
						width : '84%',
						itemId : 'fileServicesImportDatePicker',
						filterParamName : 'importDate',
						html : '<input type="text" id="importDateQuickPicker" class="ft-datepicker ui-datepicker-range-alignment">'
					},
					{
					xtype : 'component',
					cls : 'icon-calendar',
					margin : '1 0 0 0',
					html : '<span class=""><i class="fa fa-calendar"></i></span>'
				}
			]}
		]

		} );
		return importDateFilterPanel;
	},
	savedFilterStore : function() {
		var myStore = new Ext.data.ArrayStore({
					autoLoad : true,
					fields : ['filterName'],
					proxy : {
						type : 'ajax',
						url : 'services/userfilterslist/fileUploadCenter.json',
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
	},
	getClientStore:function(){
		var clientData=null;
		var objClientStore=null;
		Ext.Ajax.request({
			url : 'services/userseek/userclients.json',
			async : false,
			method : "POST",
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					if (data && data.d) {
						clientData = data.d.preferences;
						objClientStore = Ext.create('Ext.data.Store', {
									fields : ['CODE',
											'DESCR'],
									data : clientData,
									reader : {
										type : 'json',
										root : 'd.preferences'
									},
									autoLoad : true,
									listeners : {
										load : function() {
											this.insert(0, {
														CODE : 'all',
														DESCR : getLabel('allCompanies', 'All Companies')
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
	}
	
});