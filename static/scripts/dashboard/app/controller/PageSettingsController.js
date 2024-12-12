Ext.define('Cashweb.controller.PageSettingsController', {
	extend: 'Ext.app.Controller',
	requires: ['Cashweb.view.settings.HomePageSettings', 'Cashweb.view.settings.AccountPageSettings', 'Cashweb.view.settings.PaymentPageSettings'],
	refs : [ {
					ref : 'homePageSettings',
					selector : 'homePg'
			 }, {
					ref : 'payPageSettings',
					selector : 'paymentPg'
			 }, {
					ref : 'accountPageSettings',
					selector : 'accountPg'
			 }, {
						ref : 'homeWidgetSelector',
						selector : '#homeWidgetSelector'
			 }, {
						ref : 'payWidgetSelector',
						selector : '#payWidgetSelector'
			 },{
						ref : 'accountWidgetSelector',
						selector : '#accountWidgetSelector'
			 }, {
			 			ref: 'accountsView',
			 			selector: 'accountsettings'
			 } ],
			 init: function() {
			 	this.control({
			 				'homePg button[itemId=saveHomeSettings]' : {
								click : this.saveHomePageSettings
							},
							'paymentPg button[itemId=savePaySettings]' : {
								click : this.savePaymentPageSettings
							},
							'accountPg button[itemId=saveAccountSettings]' : {
								click : this.saveAccountPageSettings
							},
							'homePg button[itemId=closeHomeSettings]' : {
								click : this.closeHomePageSettings
							},
							'paymentPg button[itemId=closePaySettings]' : {
								click : this.closePaymentPageSettings
							},
							'accountPg button[itemId=closeAccountSettings]' : {
								click : this.closeAccountPageSettings
							},
							'accountsettings button[itemId=addAccount]' : {
								click: this.addNewAccount
							},
							'accountsettings button[itemId=removeAccount]' : {
								click: this.removeAccount
							}
			 	});
			 },
			 closeHomePageSettings: function() {
			 	var homeSettingsWindow = this.getHomePageSettings();
			 	this.closeSettingsWindow(homeSettingsWindow);	
			 },
			 closePaymentPageSettings: function() {
			 	var paySettingsWindow = this.getPayPageSettings();
			 	this.closeSettingsWindow(paySettingsWindow);	
			 },
			 closeAccountPageSettings: function() {
			 	var accountSettingsWindow = this.getAccountPageSettings();
			 	this.closeSettingsWindow(accountSettingsWindow);	
			 },
			 closeSettingsWindow : function(window) {
			 			var layoutType = window.down('radiogroup');
						layoutType.setValue({
							layoutType : globalLayoutType
						});
						window.close();
					},
					 
			handleBannerPosition: function(recordsCollection, widgetStore) {
						var widgets = new Array();
						var bannerWidget = null;
						for(var index = 0; index < recordsCollection.length; index ++) {
							var rec = widgetStore.findRecord('widgetCode', recordsCollection[index]);
							if(null != rec) {
								if(rec.get('widgetType') === 'BANNER') {
									bannerWidget = recordsCollection.splice(index, 1);
								}
							}
						}
						if(null == bannerWidget) {
							return recordsCollection;
						}
						widgets = Ext.Array.remove(recordsCollection, bannerWidget[0]);
						widgets.unshift(bannerWidget[0]);
						return widgets;
						
					},
			saveHomePageSettings : function(btn) {
							var newAccountPreferences = new Array();
							var flag=false;
							var filteredRecs = new Array();
							var homePgSettings = this.getHomePageSettings();
							if(undefined != this.getHomeWidgetSelector()){
						    var widgetSelector = this.getHomeWidgetSelector();
							var widgetStore = widgetSelector.getStore();
							var recordsCollection = new Array();
							recordsCollection = widgetSelector.getValue();
							if(recordsCollection.length<=5)
								{
								flag=true;
							filteredRecs = this.handleBannerPosition(recordsCollection, widgetStore);
							var acountSelectorStore = homePgSettings.getAccountSelector().getStore();
							var selectedAccountPreferences = acountSelectorStore.getRange(0, acountSelectorStore.getCount());
							//newAccountPreferences = new Array();
							for(var count = 0; count < selectedAccountPreferences.length; count++) {
								newAccountPreferences.push(selectedAccountPreferences[count].get('id'));
							}
								}
							else
								{
								var widgetpage=this.getHomePageSettings();
								var label =widgetpage.down("label[forId=errorlbl]");
								label.setText("Maximum 5 widgets required");
							
								}
							}		
							if(flag)
								{
							var layoutType = homePgSettings.down('radiogroup').getValue().layoutType;
							homePgSettings.close();
							submitPreferences(Ext.JSON.encode(newAccountPreferences), Ext.JSON.encode(filteredRecs), layoutType,
									window.location);
								}
					},
			saveAccountPageSettings: function(btn) {
							var newAccountPreferences = new Array();
							var filteredRecs = new Array();
							var accountPgSettings = this.getAccountPageSettings();
							if(undefined != this.getAccountWidgetSelector()){
						    var widgetSelector = this.getAccountWidgetSelector();
							var widgetStore = widgetSelector.getStore();
							var recordsCollection = new Array();
							recordsCollection = widgetSelector.getValue();
							filteredRecs = this.handleBannerPosition(recordsCollection, widgetStore);
							var acountSelectorStore = accountPgSettings.getAccountSelector().getStore();
							var selectedAccountPreferences = acountSelectorStore.getRange(0, acountSelectorStore.getCount());
							//var newAccountPreferences = new Array();
							for(var count = 0; count < selectedAccountPreferences.length; count++) {
								newAccountPreferences.push(selectedAccountPreferences[count].get('id'));
							}
							}
							var layoutType = accountPgSettings.down('radiogroup').getValue().layoutType;
							accountPgSettings.close();
							submitAccountPreferences(Ext.JSON.encode(newAccountPreferences), Ext.JSON.encode(filteredRecs), layoutType,
									window.location);
					},
			savePaymentPageSettings: function(btn) {
							var filteredRecs = new Array();
							if(undefined != this.getPayWidgetSelector()){
						    var widgetStore = this.getPayWidgetSelector().getStore();
							var recordsCollection = new Array();
							recordsCollection = this.getPayWidgetSelector().getValue();
							filteredRecs = this.handleBannerPosition(recordsCollection, widgetStore);
							}
							var layoutType = this.getPayPageSettings().down('radiogroup').getValue().layoutType;
							this.getPayPageSettings().close();
							submitPaymentPreferences(Ext.JSON.encode(filteredRecs), layoutType,
									window.location);
					},
			addNewAccount: function(btn) {
						showAvailableAccountSeek();
					},
			removeAccount: function() {
						var accountsView = this.getAccountsView();
						var pgSettingsWindow = accountsView.up('window');
						if(!Ext.isEmpty(pgSettingsWindow.accountSelector)){
							if(!Ext.isEmpty(pgSettingsWindow.accountSelector.getValue()))
								pgSettingsWindow.removeSelectedAccount(pgSettingsWindow.accountSelector.getValue());
						}
			}
});
//for adding account from dashboard seek to account selector list, called from seekHelper.js
function getSelectedAccount(json, elementId) {
	var myJSONObject = JSON.parse(json);
	var _jsonAccountArray = new Array();
	var accId = (JSON.parse(myJSONObject).columns[2].value).toString();
	_jsonAccountArray.push({
		id: accId,
		account_number: JSON.parse(myJSONObject).columns[0].value
	});
	var accountSelector = Ext.getCmp('accountSelector'); 
	var accountsStore = Ext.getCmp('accountSelector').getStore();
	if(accountsStore.find('id', accId) == -1) {
		accountsStore.add(_jsonAccountArray);
		accountSelector.clearInvalid();
	}
	else {
	 	accountSelector.setActiveError('Account already added!!');
	}
	accountSelector.up('window').doComponentLayout();
}