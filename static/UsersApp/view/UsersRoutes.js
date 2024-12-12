/*global UsersApp */

(function () {
	'use strict';
	UsersApp.route('get', '#/', function () {		
		UsersApp.trigger('renderUserDetails');
	});
	UsersApp.route('get', '#/BalanceReporting', function () {		
		console.log(" render Balance Reporting fired");
		UsersApp.trigger('renderBalanceReporting'); 
	});
	 
	UsersApp.route('get', '#/Payments', function () {		
		console.log(" render Payments fired");
		UsersApp.trigger('renderPayments'); 
	});
	
	UsersApp.route('get', '#/Collection', function () {		
		console.log(" render Collection fired");
		UsersApp.trigger('renderCollection'); 
	});
	
	UsersApp.route('get', '#/Forecasting', function () {		
		console.log(" render Forecasting fired");
		UsersApp.trigger('renderForecasting'); 
	});
	
	UsersApp.route('get', '#/Portal', function () {		
		console.log(" render Portal fired");
		UsersApp.trigger('renderPortal'); 
	});
	
	UsersApp.route('get', '#/Liquidity', function () {		
		console.log(" render Liquidity fired");
		UsersApp.trigger('renderLiquidity'); 
	});
	
	UsersApp.route('get', '#/SCF', function () {		
		console.log(" render SCF fired");
		UsersApp.trigger('renderSCF'); 
	});
	
	UsersApp.route('get', '#/Limit', function () {		
		console.log(" render Limit fired");
		UsersApp.trigger('renderLimit'); 
	});
	
	UsersApp.route('get', '#/UserEntry', function () {		
		console.log(" render UserEntry fired");
		UsersApp.trigger('renderUserEntry'); 
	});
	
	UsersApp.route('get', '#/Verify', function () {		
		console.log(" #/Verify fired");
		UsersApp.trigger('renderUserVerify');
	});
	
	UsersApp.route('get', '#/MobileBanking', function () {		
		console.log(" render Mobile fired");
		UsersApp.trigger('renderMobile'); 
	});
	
})();
