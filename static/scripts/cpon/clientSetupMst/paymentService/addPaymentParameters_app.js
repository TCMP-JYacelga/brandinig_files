var objPaymentParametersPopUp = null;
var objSelectAccountPopupE = null;
var objSelectAccountPopupT = null;
var objSelectAccountPopupN = null;
var objCashPosAccountsE = null;
var objCashPosAccountsT = null;
var objCashPosAccountsN = null;
var slotElement = null;
var viewElementId = null;
Ext.Loader.setConfig({
			enabled : true,
			setPath : {
				'Ext' : 'static/js/extjs4.2.1/src',
				'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
			}
		});
Ext.application({
			name : 'CPON',
			appFolder : 'static/scripts/cpon/clientSetupMst/paymentService/app',
			// appFolder : 'app',
			requires : ['CPON.view.PaymentParametersPopUp','CPON.view.CashPositionAccountsView','CPON.view.CashPositionAccountsViewT','CPON.view.CashPositionAccountsViewN'],
			launch : function() {
				objPaymentParametersPopUp = Ext.create(
						'CPON.view.PaymentParametersPopUp', {
							itemId : 'paymentParametersPopUpId',
							//fnCallback : saveParametersDtls,
							title : getLabel('pmtPrdParam', 'Payment Product Parameters')
						});
				objSelectAccountPopupE = Ext.create('CPON.view.SelectAccountPopup',{
							fnCallback : setSelecetdAccounts	
						});	
				
				objSelectAccountPopupT = Ext.create('CPON.view.SelectAccountPopupT',{
					fnCallback : setSelecetdAccounts	
				});	
				
				objSelectAccountPopupN = Ext.create('CPON.view.SelectAccountPopupN',{
					fnCallback : setSelecetdAccounts	
				});	
				
				objCashPosAccountsE = Ext.create('CPON.view.CashPositionAccountsView', {
					renderTo : 'cashPosAccsE'
				});
				
				var store = objCashPosAccountsE.down('grid').getStore();
				store.on('load',function(){
				if(store.getCount()===0){
					//$('#accInfoDivE').hide();
				}})
				
				objCashPosAccountsT = Ext.create('CPON.view.CashPositionAccountsViewT', {
					renderTo : 'cashPosAccsT'
				});
				
				var storeT = objCashPosAccountsT.down('grid').getStore();
				storeT.on('load',function(){
				if(storeT.getCount()===0){
					//$('#accInfoDivT').hide();
				}})
				
				objCashPosAccountsN = Ext.create('CPON.view.CashPositionAccountsViewN', {
					renderTo : 'cashPosAccsN'
				});
				
				var storeN = objCashPosAccountsN.down('grid').getStore();
				storeN.on('load',function(){
				if(storeN.getCount()===0){
					//$('#accInfoDivN').hide();
				}})
			}
		});

function getPaymentParametersPopUp() {
	if (null != objPaymentParametersPopUp) {
		objPaymentParametersPopUp.show();
	}
}

function getSelectAccountPopup(slot,elementId){
	frequencyRefTime = slot;
	slotElement=elementId;
	if(slotElement == 'E')
	{
		setAllSelected = allSelectedFlagE;
		objSelectAccountPopupE.show();
	}
	else if(slotElement == 'T')
	{
		setAllSelected = allSelectedFlagT;
		objSelectAccountPopupT.show();
	}
	else if(slotElement == 'N')
	{
		setAllSelected = allSelectedFlagN;
		objSelectAccountPopupN.show();
	}
}

function getCashPosAccountsPopUpE(slot) {
	frequencyRefTime = slot;
	if (null != objCashPosAccountsE) {
		objCashPosAccountsE.show();
	}
}

function getCashPosAccountsPopUpT(slot) {
	frequencyRefTime = slot;
	if (null != objCashPosAccountsT) {
		objCashPosAccountsT.show();
	}
}

function getCashPosAccountsPopUpN(slot) {
	frequencyRefTime = slot;
	if (null != objCashPosAccountsN) {
		objCashPosAccountsN.show();
	}
}

function setSelecetdAccounts(records) {
	
	if(slotElement == 'E')
	{
		var selectedAccountItemsE = "";
		
		for (var i = 0; i < records.length; i++) {
			var val = records[i].data.accountId;
			selectedAccountItemsE = selectedAccountItemsE + val;
			if (i < records.length - 1) {
				selectedAccountItemsE = selectedAccountItemsE + ',';
			}
		}
		var actionCount='('+records.length+')';
		selectedAccounIdListE = selectedAccountItemsE;
		popupAccountsSelectedValueE = 'Y';
	}
	else if(slotElement == 'T')
	{
		var selectedAccountItemsT = "";
		
		for (var i = 0; i < records.length; i++) {
			var val = records[i].data.accountId;
			selectedAccountItemsT = selectedAccountItemsT + val;
			if (i < records.length - 1) {
				selectedAccountItemsT = selectedAccountItemsT + ',';
			}
		}
		var actionCount='('+records.length+')';
		selectedAccounIdListT = selectedAccountItemsT;
		popupAccountsSelectedValueT = 'Y';
	}
	else if(slotElement == 'N')
	{
		var selectedAccountItemsN = "";
		
		for (var i = 0; i < records.length; i++) {
			var val = records[i].data.accountId;
			selectedAccountItemsN = selectedAccountItemsN + val;
			if (i < records.length - 1) {
				selectedAccountItemsN = selectedAccountItemsN + ',';
			}
		}
		var actionCount='('+records.length+')';
		selectedAccounIdListN = selectedAccountItemsN;
		popupAccountsSelectedValueN = 'Y';
	}

}

