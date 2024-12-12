Ext.define('Cashweb.store.UserActivityStore', {
			extend : 'Ext.data.Store',
			model : 'Cashweb.model.UserActivityModel',
			autoLoad : false,
			fields : ['USER_NAME','USER_CODE','USRCATEGORY','USRCORPORATION','SESSION_ID','REQUEST_STATE','VALID_FLAG','LOGIN_DATETIME',
			          'LOGOUT_DATETIME','ACTIVITY_TIMESTAMP','CORPORATION_NAME','CLIENT_DESC','CURRENTLOGINTIME','SSO_USERID']
		});