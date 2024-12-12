Ext.Loader.setConfig({
			enabled : true,
			disableCaching : false,
			setPath : {
				'Ext' : 'static/js/extjs4.2.1/src',
				'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
			}
		});
Ext.application({
			name : 'BANKUSER',
			appFolder : 'static/scripts/commonmst/bankAdminUser/app',
			// appFolder : 'app',
			requires : ['BANKUSER.view.BankAdminUserSellerPopup','Ext.window.MessageBox','BANKUSER.view.UserPrinterPrivilegePopUp'],
			controllers : ['BankAdminUserSellerController','BankAdminUserPrinterController']
		});

