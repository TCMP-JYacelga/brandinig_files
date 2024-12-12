Ext.define('GCP.controller.FxSpreadPrfController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.FxSpreadPrfEntryGridView',
			'GCP.view.HeaderOrderGridView', 'GCP.view.HeaderOrderPopUp'],
	views : ['GCP.view.FxSpreadPrfEntryGridView',
			'GCP.view.HeaderOrderGridView', 'GCP.view.HeaderOrderPopUp'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'fxSpreadPrfEntryGridView',
				selector : 'fxSpreadPrfEntryGridView'
			}, {
				ref : 'headerOrderPopUp',
				selector : 'fxSpreadPrfEntryGridView headerOrderPopUp[itemId="gridTypeCodePopup"]'
			}, {
				ref : 'headerOrderGridView',
				selector : 'fxSpreadPrfEntryGridView headerOrderPopUp headerOrderGridView'
			}],
	config : {
		selectedPrfMst : '',
		orderArrJson:'',
		orderViewSetFor:''
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		me.control({
			'fxSpreadPrfEntryGridView' : {
				render : function(panel, opts) {
				},
				afterrender : function(panel, opts) {
				},
				getTypeCodeOrderPopUp: function(panel, firedFor) {
					me.orderViewSetFor=firedFor;
					this.setStoreTypeCodePopUp(firedFor);
				}
			},
			'fxSpreadPrfEntryGridView button[itemId="viewInformationPopup"]' : {
				click : function() {
					this.setStoreTypeCodePopUp();
				}
			},
			'headerOrderPopUp headerOrderGridView' : {
				orderUpEvent : this.orderUpDown
			},
			'headerOrderPopUp button[itemId="savebtn"]' : {
				click : this.performSaveAction
			}
		});
	},
	setStoreTypeCodePopUp : function(firedFor) {
		var me = this;
		var strUrl = 'cpon/fxSpreadProfileDetails.json';
		strUrl = strUrl + '?&$filter=' + mstProfileId;
		strUrl = strUrl + '&$qparam=Y';
		
		if(firedFor=='grid')
						{
						strUrl = strUrl + '&$gridEnable=Y';
						}
						else
						{
						strUrl = strUrl + '&$headerEnable=Y';
						}
		
		Ext.Ajax.request({
					url : strUrl,
					method : "GET",
					async : false,
					success : function(response) {
						var data = Ext.decode(response.responseText);
						if(firedFor=='grid')
						{
						me.openTypeCodeGridPopUpWindow(data.d.profileDetails);
						}
						else
						{
						me.openTypeCodeHeaderPopUpWindow(data.d.profileDetails);
						}
					},
					failure : function(response) {
						// console.log('Error Occured-addAllAccountSet');
					}
				});
	},
	openTypeCodeGridPopUpWindow : function(storeData) {
		var accountSetPopup = Ext.create('GCP.view.HeaderOrderPopUp', {
					itemId : 'gridFxSpreadCodePopup',
					storeData : storeData,
					title:'Grid Order'
				
				});
		accountSetPopup.show();
	},
	openTypeCodeHeaderPopUpWindow : function(storeData) {
		var accountSetPopup = Ext.create('GCP.view.HeaderOrderPopUp', {
					itemId : 'gridTypeHeaderCodePopup',
					storeData : storeData,
					title:'Header Order'
				});
		accountSetPopup.show();
	},
	orderUpDown : function(grid, rowIndex, direction) {
		var record = grid.getStore().getAt(rowIndex);
		var me = this;
		if ((rowIndex == 0 && direction == 1)
				|| (rowIndex == 1 && direction == -1)
				|| (rowIndex == 0 && direction == 1)
				|| (rowIndex == 2 && direction == -1)) {
			// me.accSetChangeFlag = true;
		}
		if (!record) {
			return;
		}
		var index = rowIndex;
		if (direction < 0) {
			index--;
			if (index < 0) {
				return;
			}
		} else {

			index++;

			if (index >= grid.getStore().getCount()) {
				return;
			}
		}
		var store = grid.getStore();
		
		store.remove(record);
		store.insert(index, record);
		me.refreshDataInStore(store);
		me.orderArrJson=store;
		},
	refreshDataInStore : function(store) {
		var orderVal = 1;
		var me= this;
		store.each(function(record) {
				if(me.orderViewSetFor=='grid')
						{
						record.set('gridOrder', orderVal);
						}
						else
						{
						record.set('headerOrder', orderVal);
						}
					
					orderVal++;
				});
	
	},
	performSaveAction:function(btn)
	{
	var me= this;
	var store= me.orderArrJson;
	me.postDataToServer(store);
	me.orderViewSetFor='';
	btn.parent.close();
	},
	postDataToServer : function(store) {
		var me= this;
		var arrayJson = new Array();
				
		store.each(function(record) {
						arrayJson.push({
									serialNo : record.data.gridOrder,
									identifier : record.data.identifier,
									userMessage : excryptedParentId,
									typeDescription : record.data.typeDescription,
									typecodeLevel : record.data.typecodeLevel,
									sign : record.data.sign,
									gridOrder : record.data.gridOrder,
									headerOrder : record.data.headerOrder,
									grid : record.data.grid,
									header : record.data.header
								});
					});
			Ext.Ajax.request({
						url : 'cpon/typeCodeProfileMst/updateTypeCodeDetails',
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							// TODO : Action Result handling to be done here
						},
						failure : function() {
							var errMsg = "";
							Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : getLabel(
												'instrumentErrorPopUpMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										cls : 'ux_popup',
										icon : Ext.MessageBox.ERROR
									});
						}
					});		
		
	}

});
