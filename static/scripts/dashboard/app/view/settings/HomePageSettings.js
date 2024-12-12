Ext.define('Cashweb.view.settings.HomePageSettings',{

	extend : 'Ext.window.Window',
	xtype : 'homePg',
	requires : ['Cashweb.store.WidgetStore', 'Cashweb.store.UserAccountsStore', 'Ext.form.Panel', 'Ext.form.RadioGroup', 
				 'Cashweb.store.AvailableWidgetStore', 'Ext.form.field.Radio', 'Ext.form.field.Checkbox', 'Cashweb.view.settings.Accounts'],
	config :{
		widgetStore : null,
		widgetSelector : null,
		accountsStore : null,
		resizable : false,
		accountSelector : null,
		closable : true
	},
	componentCls: 'settings-header-cls',
	initComponent : function (){
		if(null != this.widgetStore||undefined != this.widgetStore){
			this.loadWidgetsData();
			this.loadDashboardAccounts();
		}
		this.defineItemsForWindow();
		Ext.apply(this,{
			width : 450,
			height : 300,
			modal : true,
			title : label_map.dashboardSettings,
			layout : {
				type : 'fit'
			},
			bbar : {
				layout : {
					type:'hbox',
					align : 'middle',
					pack : 'end'
				},
				items: [{
					text : label_map.save,
					itemId : 'saveHomeSettings',
					cls :'ux_button-padding ux_button-background-color',
					glyph: 'xf0c7@fontawesome'
				},{
					text : label_map.cancel,
					itemId : 'closeHomeSettings',
					cls :'ux_button-padding ux_button-background-color',
					glyph: 'xf056@fontawesome'
				}] 
			}
		});
		this.callParent();
	},
	loadWidgetsData : function (){
	var me = this;
		var widgetStore = this.widgetStore;
		var availableWidgetStore = Ext.getStore('available-widget-store');
		this.widgetSelector = Ext.create('Ext.ux.form.ItemSelector',{
			cls : 'widget-selector',
			id : 'homeWidgetSelector',
			store : availableWidgetStore,
			autoScroll : true,
			displayField: 'widgetName',
            valueField: 'widgetCode',
            value: this.getWidgetsInSelector(),
            fromTitle: label_map.available,
            toTitle: label_map.selected,
            flag: true,
			maxSelections : 5
		});
		me.widgetSelector.fromField.store.on('remove',function(store, records, index, eOpts){
			me.intPrevIndex = index;
		});
		me.widgetSelector.toField.store.on('add',function(store, records, index, eOpts){
		if(store.getCount()>5){
		var prevIndex = Ext.isEmpty(me.intPrevIndex) ? me.widgetSelector.fromField.store.getCount() : me.intPrevIndex;
		store.remove(records);
			me.widgetSelector.fromField.store.insert(prevIndex,records);
			}
		}); 	
	},
	loadDashboardAccounts : function(){
		this.accountStore = new Cashweb.store.UserAccountsStore();
		this.accountStore.loadData(globalDashboardAccountsStore.getRange(0, globalDashboardAccountsStore.getCount()));
		
		this.accountSelector = Ext.create('Ext.ux.form.MultiSelect', {
			id : 'accountSelector',
			autoScroll : true,
			autoHeight : true,
			store : this.accountStore,
			allowBlank: true,
			displayField: 'account_number',
            valueField: 'id',
            msgTarget: 'under',
			ddReorder: true
		});
		
	},
	getWidgetsInSelector: function() {
		
		var widgets = [];
		globalWidgetsStore.sort('position','ASC');
		for(var index = 0; index < globalWidgetsStore.getCount(); index ++){
			widgets.push(globalWidgetsStore.getAt(index).get('widgetCode'));
		}
		return widgets;
	
	},
	defineItemsForWindow : function (){
		var pgSettingsWindow = this;
		var layoutRadio = new Ext.form.RadioGroup({
			fieldLabel: label_map.layoutTitle,
			cls : 'layoutLbl',
			vertical: false,
			items: [{ 
		              boxLabel: '<img src="static/images/misc/leftPanel.gif" style="vertical-align:top;"> </img>',
		              name: 'layoutType',
		              height: 120,
		              inputValue: 'L',
		              checked: (globalLayoutType == 'L') ? true : false
		           },{
		        	  boxLabel: '<img src="static/images/misc/rightPanel.gif" style="vertical-align:top;"> </img>',
		        	  name: 'layoutType', 
		        	  inputValue: 'R',
		        	  height: 120,
		        	  checked: (globalLayoutType == 'R' || undefined == globalLayoutType) ? true : false
		           }]
		});
		var layoutPanel = new Ext.form.Panel({
			layout: 'fit',
			bodyStyle: 'padding:10px;',
			items: [layoutRadio]
		});
		this.items = [{
			xtype : 'tabpanel',
			height:300,
			items : [{
				title : label_map.widgetTitle,
				layout : {
					type : 'fit'
				},
				items: [{
							xtype : 'label',
							text : "Note : Max 5 widegets can be selected ",
							cls : 'xn-account-filter-btnmenu',
							padding : '10 0 0 0',
							margin : '8 0 0 0'
						},this.widgetSelector]
			},{
				title : label_map.accountsTitle,
				xtype: 'accountsettings',
				items :[this.accountSelector]
			}, {
				title : label_map.layoutTitle,
				layout : {
					type : 'fit'
				},
				items: [layoutPanel]
			}]
		},{
							xtype : 'label',
							forId : 'errorlbl',
							text : '',
							cls: 'color: red',
							padding : '10 0 0 0',
							margin :'-4 0 0 0'
						}];
	},
	
	removeSelectedAccount: function(accountToRemove) {
		var record = this.accountStore.findRecord('id', accountToRemove[0]);
		this.accountStore.remove(record);
	}
});