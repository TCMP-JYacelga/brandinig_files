/**
 * @class GCP.controller.TransactionInitiationController
 * @extends Ext.app.Controller
 * @author Shraddha Chauhan
 */
Ext.define('GCP.controller.TransactionInitiationController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.activity.TransactionInitiationView', 'Ext.ux.gcp.DateUtil',
			'Ext.ux.gcp.PreferencesHandler','GCP.view.activity.popup.PaymentPopupView','GCP.view.activity.AccountActivityView',
			'GCP.view.activity.popup.FundPopupView','GCP.view.activity.popup.LoanDrawPopupView','GCP.view.activity.popup.RepayPopupView',
			'GCP.view.activity.popup.PurchasePopupView','GCP.view.activity.popup.RedeemPopupView'],
	refs : [{
				ref : 'transactionInitiationView',
				selector : 'transactionInitiationView'
			}],
	config : {
		paymentPopup : null,
		purchasePopup : null,
		redeemPopup : null,
		fundPopup : null,
		loanPopup : null,
		repayPopup : null,
		accountFilter : null,
		accountCalDate : null,
		identifier : null,
		selectedAccCcy : null,
		currentAccountNumber : null,
		currentBalance : null
	},
	init : function() {
		var me = this;
		//me.createPopUps();
		GCP.getApplication().on({
			'handleTransactionInitiation' : function(accountFilter, accountCalDate,identifier,selectedAccCcy,currentAccountNumber,currentBalance) {
					me.accountFilter = accountFilter;
					me.accountCalDate = accountCalDate;
					me.identifier = identifier;
					me.selectedAccCcy = selectedAccCcy;
					me.currentAccountNumber = currentAccountNumber;
					me.urrentBalance = currentBalance;
			},
			'postTransactionInitiationVisibility' : function(paymentAccount, loanAccount,fundAccount, investmentAccount){
				var refTransactionInitiationView = me.getTransactionInitiationView();
				refTransactionInitiationView.doTransactionInitiationVisibility(paymentAccount, loanAccount,fundAccount, investmentAccount);
				
			}
		});
		me.control({
			'accountActivityView transactionInitiationView' : {
				'fromThisAccount' : function(btn) {
					me.getPaymentPopupData();
				},
				'toThisAccount': function(btn) {
					me.getFundPopupData();
				},
				'loanfromThisAccount' : function(btn) {
					me.getLoanPopupData();
				},
				'repayFromThisAccount' : function(btn) {
					me.getRepayPopupData();
				},
				'purchaseFromThisAccount' : function(btn){
					me.getPurchasePopupData();
				},
				'redeemFromThisAccount' : function(btn){
					me.getRedemPopupData();
				}
			},
			'paymentPopupView' : {
				'handleSendPaymentDetails' : function(postJsonData){
					me.doSendPaymentDetails(postJsonData);
				}
			},
			'fundPopupView' : {
				'handleSendFundDetails' : function(fundJsonData){
					me.doSendFundDetails(fundJsonData);
				}
			},
			'loanDrawPopupView' : {
				'handleLoanDrawDetails' : function(postJsonData){
					me.doSendLoanDrawDetails(postJsonData);
				}
			},
			'repayPopupView' :{
				'handleLoanRepayDetails' : function(postJsonData){
					me.doSendLoanRepayDetails(postJsonData);
				}
			},
			'purchasePopupView' : {
				'handleSendPurchaseDetails' : function(postJsonData){
					me.doSendPurchaseDetails(postJsonData);
				}
			},
			'redeemPopupView' : {
				'handleSendRedemDetails' : function(postJsonData){
					me.doSendRedemDetails(postJsonData);
				}
			}
		});
	},
	getPaymentPopupData : function() {
		var me = this;
		var accountNumber = me.currentAccountNumber;
		var currentAccountId = me.accountFilter;
		var accCurrentBalance = me.currentBalance;
		var currencyCode = me.selectedAccCcy;
		
		if (Ext.isEmpty(accCurrentBalance)) {
			accCurrentBalance = "0.00";
		}
		if (!Ext.isEmpty(accountNumber))
			var popupTitle = 'Payment | ' + accountNumber
					+ ' | Available Balance : ' + currencyCode + ' '
					+ accCurrentBalance;

		if (!Ext.isEmpty(currentAccountId)) {
			if (Ext.isEmpty(me.paymentPopup)) {
			me.paymentPopup = Ext.create(
					'GCP.view.activity.popup.PaymentPopupView', {
						itemId : 'activityPaymentPopup',title : popupTitle,
						buyCcy : currencyCode,
						accountFilter : currentAccountId,
						currentAccountNumber : accountNumber
					});
			}
			else{
				me.paymentPopup.setTitle(popupTitle);
				me.paymentPopup.buyCcy = currencyCode;
				me.paymentPopup.accountFilter = currentAccountId;
				me.paymentPopup.currentAccountNumber = accountNumber;
			}
		me.paymentPopup.show();
		}
	},
	doSendPaymentDetails : function(postJsonData){
		console.log(" in doSendPaymentDetails function");
		console.log(postJsonData);
		var me = this;
		Ext.Ajax.request({
			url : 'services/activities/addPayment',
			method : 'POST',
			jsonData : postJsonData,
			success : function(response) {
				var reponseData = Ext.decode(response.responseText);
				me.paymentPopup.close();
			},
			failure : function(response) {
				// console.log("Error Occured - while posting data for
				// activity PaymentDetails");
			}
		});
	},
	getFundPopupData : function() {
		var me = this;

		var accountNumber = me.currentAccountNumber;
		var currentAccountId = me.accountFilter;
		var accCurrentBalance = me.currentBalance;
		var currencyCode = me.selectedAccCcy;

		if (Ext.isEmpty(accCurrentBalance)) {
			accCurrentBalance = "0.00";
		}
		if (!Ext.isEmpty(accountNumber))
			var popupTitle = 'Fund | ' + accountNumber
					+ ' | Available Balance : ' + currencyCode + ' '
					+ accCurrentBalance;

		if (!Ext.isEmpty(currentAccountId)) {
			if (Ext.isEmpty(me.fundPopup)) {
				me.fundPopup = Ext.create(
						'GCP.view.activity.popup.FundPopupView', {
							itemId : 'activityFundPopup',
							title : popupTitle,
							buyCcy : currencyCode,
							accountFilter : currentAccountId,
							currentAccountNumber : accountNumber
					});
			} else {
				me.fundPopup.setTitle(popupTitle);
				me.fundPopup.buyCcy = currencyCode;
				me.fundPopup.accountFilter = currentAccountId;
				me.fundPopup.currentAccountNumber = accountNumber;
			}
		me.fundPopup.show();
		}
	},
	doSendFundDetails : function(fundJsonData) {
		var me = this;
		Ext.Ajax.request({
			url : 'services/activities/addFund',
			method : 'POST',
			jsonData : fundJsonData,
			success : function(response) {
			var responseData = Ext
				.decode(response.responseText);
				me.fundPopup.close();
			},
			failure : function(response) {
				
			}

		});
	},
	getLoanPopupData : function(){
		
		var me = this;
		var loanPopupRef = me.loanPopup;
		var accountNumber = me.currentAccountNumber;
		var accCurrentBalance = me.currentBalance;
		var currentAccountId = me.accountFilter;
		var currencyCode = me.selectedAccCcy;

		if (Ext.isEmpty(accCurrentBalance)) {
			accCurrentBalance = "0.00";
		}
		
		if (!Ext.isEmpty(accountNumber))
			var popupTitle = 'Loan Draw | ' + accountNumber
					+ ' | Available Balance : ' + currencyCode + ' '
					+ accCurrentBalance;
					
		
		if (!Ext.isEmpty(currentAccountId)) {
			if (Ext.isEmpty(me.loanPopup)) {
			me.loanPopup = Ext.create('GCP.view.activity.popup.LoanDrawPopupView',
						{
							itemId : 'activityLoanPopup',
							title : popupTitle,
							accountFilter : currentAccountId,
							ccy : currencyCode
						});
			}
			else{
				me.loanPopup.setTitle(popupTitle);
				me.loanPopup.accountFilter = currentAccountId;
				me.loanPopup.ccy = currencyCode;
			}
		me.loanPopup.show();
		}
	},
	doSendLoanDrawDetails : function(jsonData){
		var me=this;
		Ext.Ajax.request({
					url : 'services/activities/addLoanDraw',
					method : 'POST',
					jsonData : jsonData,
					success : function(response) {
						var reponseData = Ext.decode(response.responseText);
						me.loanPopup.close();

					},
					failure : function(response) {
						me.loanPopup.close();
						alert("Error: " + response);
					}

				});
	},
	getRepayPopupData : function(){
		var me = this;
		var accountNumber = me.currentAccountNumber;
		var accCurrentBalance = me.currentBalance;
		var currentAccountId = me.accountFilter;
		var currencyCode = me.selectedAccCcy;

		if (Ext.isEmpty(accCurrentBalance)) {
			accCurrentBalance = "0.00";
		}
		
		if (!Ext.isEmpty(accountNumber))
			var popupTitle = 'Loan Re-payment | ' + accountNumber
					+ ' | Available Balance : ' + currencyCode + ' '
					+ accCurrentBalance;

		if (!Ext.isEmpty(currentAccountId)) {
			if (Ext.isEmpty(me.repayPopup)) {
				me.repayPopup = Ext.create('GCP.view.activity.popup.RepayPopupView', {
							itemId : 'activityRepayPopup',
							title : popupTitle,
							currencyCode : currencyCode,
							currentAccountNumber : accountNumber

						});
			} else {
				me.repayPopup.setTitle(popupTitle);
				me.repayPopup.currencyCode = currencyCode;
				me.currentAccountNumber = accountNumber;
			}
			me.repayPopup.show();
		}
	},
	doSendLoanRepayDetails : function(jsonData){
		var me=this;
		Ext.Ajax.request({
					url : 'services/activities/addLoanRepayment',
					method : 'POST',
					jsonData : jsonData,
					success : function(response) {
						var reponseData = Ext.decode(response.responseText);
						me.getRepayPopup().close();

					},
					failure : function(response) {
						me.getRepayPopup.close();
						alert("Error: " + response);
					}

				});
	},
	getPurchasePopupData : function(){
		var me = this;
		var accountNumber = me.currentAccountNumber;
		var accCurrentBalance = me.currentBalance;
		var popupTitle = 'Purchase | ' + accountNumber
				+ ' | Available Balance :  USD ' + accCurrentBalance;
		if (Ext.isEmpty(me.purchasePopup)) {
			me.purchasePopup = Ext.create('GCP.view.activity.popup.PurchasePopupView',
					{
						itemId : 'activityPurchasePopup',
						title : popupTitle,
						accountFilter : me.accountFilter

					});
		} else {
			me.purchasePopup.setTitle(popupTitle);
		}
		
		me.purchasePopup.show();
	},
	doSendPurchaseDetails : function(jsonData) {
		var me = this;
		Ext.Ajax.request({
				url : 'services/activities/addInvestment',
				method : 'POST',
				jsonData : jsonData,
				success : function(response) {
				var responseData = Ext.decode(response.responseText);
				me.purchasePopup.close();
				},
				failure : function(response) {
				}

				});
	},
	getRedemPopupData : function() {
		var me = this;
		var accountNumber = me.currentAccountNumber;
		var accCurrentBalance = me.currentBalance;
		var popupTitle = 'Redemption | ' + accountNumber
				+ ' | Available Balance :  USD ' + accCurrentBalance;
		if (Ext.isEmpty(me.redeemPopup)) {
			me.redeemPopup = Ext.create('GCP.view.activity.popup.RedeemPopupView', {
						itemId : 'activityRedemPopup',
						title : popupTitle,
						accountFilter : me.accountFilter

					});

		} else {
			me.redeemPopup.setTitle(popupTitle);
			me.redeemPopup.accountFilter = me.accountFilter;
		}
		me.redeemPopup.show();
	},
	doSendRedemDetails : function(jsonData){
		var me = this;
		Ext.Ajax.request({
				url : 'services/activities/addRedemption',
				method : 'POST',
				jsonData : jsonData,
				success : function(response) {
				var responseData = Ext.decode(response.responseText);
						me.redeemPopup.close();
					},
					failure : function(response) {
					
					}

				});
	}
});
