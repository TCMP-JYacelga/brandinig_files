/*global RolesApp */

(function () {
	'use strict';
	RolesApp.route('get', '#/', function () {		
		RolesApp.trigger('renderRoleDetails');
	});
	RolesApp.route('get', '#/Admin', function () {		
		console.log(" renderAdmin fired");
		RolesApp.trigger('renderAdmin');
	});
	
	RolesApp.route('get', '#/RoleEntry', function () {		
		console.log(" renderRoleEntry fired");
		RolesApp.trigger('renderRoleEntry');
	});
	
	RolesApp.route('get', '#/Verify', function () {		
		console.log(" #/Verify fired");
		RolesApp.trigger('renderVerify');
	});
	
	RolesApp.route('get', '#/BalanceReporting', function () {		
		console.log(" #/BalanceReporting fired");
		RolesApp.trigger('renderBalanceReporting');
	});
	
	RolesApp.route('get', '#/Payments', function () {		
		console.log(" #/Payments fired");
		RolesApp.trigger('renderPayments');
	});
	
	RolesApp.route('get', '#/Imaging', function () {		
		console.log(" #/Imaging	 fired");
		RolesApp.trigger('renderImaging');
	});
	
	RolesApp.route('get', '#/Loans', function () {		
		console.log(" #/Loans fired");
		RolesApp.trigger('renderLoans');
	});
	
	RolesApp.route('get', '#/PositivePay', function () {		
		console.log(" #/PositivePay fired");
		RolesApp.trigger('renderPositivePay');
	});
	
	RolesApp.route('get', '#/CheckManagement', function () {		
		console.log(" #/CheckManagement fired");
		RolesApp.trigger('renderCheckManagement');
	});
	
	RolesApp.route('get', '#/BankReports', function () {		
		console.log(" #/BankReports` fired");
		RolesApp.trigger('renderBankReports');
	});
	
	RolesApp.route('get', '#/SCF', function () {		
		console.log(" #/SupplyChain fired");
		RolesApp.trigger('renderSupplyChain');
	});
	
	RolesApp.route('get', '#/Liquidity', function () {		
		console.log(" #/Liquidity fired");
		RolesApp.trigger('renderLiquidity');
	});
	
	RolesApp.route('get', '#/Forecasting', function () {		
		console.log(" #/Forecasting fired");
		RolesApp.trigger('renderForecasting');
	});
	
	RolesApp.route('get', '#/Collection', function () {		
		console.log(" #/Recievables fired");
		RolesApp.trigger('renderRecievables');
	});
	RolesApp.route('get', '#/Portal', function () {		
		console.log(" #/Portals fired");
		RolesApp.trigger('renderPortals');
	});
	
	RolesApp.route('get', '#/MobileBanking', function () {		
		console.log(" #/MobileBanking fired");
		RolesApp.trigger('renderMobileBanking');
	});
	RolesApp.route('get', '#/SubAccounts', function() {
		RolesApp.trigger('renderSubAccounts');
	});
	RolesApp.route('get', '#/TPFA', function () {
		console.log(" #/TPFA fired");		
		RolesApp.trigger('renderTPFA');
	});
	
	RolesApp.route('get', '#/Next', function () {		
		console.log(" #/Next fired");
		// TODO find the next route to be executed		
		var oldURL = window.document.referrer;
		this.redirect('#/MobileBanking');		
	});
	 
})();
