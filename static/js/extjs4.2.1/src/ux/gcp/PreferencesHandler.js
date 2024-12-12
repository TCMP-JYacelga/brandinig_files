/**
 * @class Ext.ux.gcp.PreferencesHandler
 * @author Vinay Thube
 */
Ext.define('Ext.ux.gcp.PreferencesHandler', {
	requires : ['Ext.state.LocalStorageProvider'],
	init : function(application) {
		if (localStorage) {
			Ext.state.Manager.setProvider(Ext
					.create('Ext.state.LocalStorageProvider'));
		}
	},
	setLocalPreferences : function(strKey, objValue) {
		Ext.state.Manager.set(strKey, objValue);
	},
	getLocalPreferences : function(strKey) {
		var objPref = null;
		if ((!Ext.isEmpty(strKey))) {
			objPref = Ext.state.Manager.get(strKey);
		}
		return objPref;
	},
	clearLocalPreferences : function(strKey) {
		Ext.state.Manager.clear(strKey);
	},

	/**
	 * 
	 */
	savePagePreferences : function(strPageName, arrPreferences, fnCallBack,
			args, scope, blnShowMsg) {
		var me = this;
		var strUrl = Ext.String.format('services/userpreferences/{0}.json?',
				strPageName);
		var objPref = arrPreferences ? Ext.encode(arrPreferences) : null;
		me.savePreference(strUrl, objPref, fnCallBack, args, scope, blnShowMsg);

	},
	saveModulePreferences : function(strPageName, strModuleName, preferences,
			fnCallBack, args, scope, blnShowMsg) {
		var me = this;
		var strUrl = Ext.String.format('services/userpreferences/{0}/{1}.json?',
				strPageName, strModuleName);
		var objPref = preferences ? Ext.encode(preferences) : null;
		me.savePreference(strUrl, objPref, fnCallBack, args, scope, blnShowMsg);

	},
	savePreference : function(strUrl, objPref, fnCallBack, args, scope,
			blnShowMsg) {
		Ext.Ajax.request({
					url : strUrl,
					method : 'POST',
					jsonData : objPref,
					async : false,
					success : function(response) {
						var data = Ext.decode(response.responseText);
						var isSuccess;
						var title, strMsg, imgIcon;
						title = getLabel('messageTitle',
										'Message');
						if (data.d.preferences && data.d.preferences.success)
							isSuccess = data.d.preferences.success;
						if (isSuccess && isSuccess === 'N') {
							if (blnShowMsg === true) {								
								strMsg = data.d.preferences.error.errorMessage;
								imgIcon = Ext.MessageBox.ERROR;
								Ext.MessageBox.show({
											title : title,
											msg : strMsg,
											width : 200,
											buttons : Ext.MessageBox.OK,
											buttonText: {
												ok: getLabel('btnOk', 'OK')
												} ,
											cls : 't7-popup',
											icon : imgIcon
										});
							}

						} else {
							if (blnShowMsg === true) {
								Ext.MessageBox.show({
											title : title,
											msg : getLabel('prefSavedMsg',
													'Preferences Saved Successfully'),
											buttons : Ext.MessageBox.OK,
											buttonText: {
												ok: getLabel('btnOk', 'OK')
												} ,
											cls : 't7-popup',
											icon : Ext.MessageBox.INFO
										});
							}
						}
						if (fnCallBack)
							Ext.callback(fnCallBack, scope, [data, args,
											isSuccess]);

					},
					failure : function() {
						if (blnShowMsg === true) {
							var errMsg = "";
							Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : getLabel(
												'instrumentErrorPopUpMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										buttonText: {
											ok: getLabel('btnOk', 'OK')
											} ,
										cls : 't7-popup',
										icon : Ext.MessageBox.ERROR
									});
						}
						if (fnCallBack)
							Ext.callback(fnCallBack, scope, [null, args, 'N']);
					}
				});
	},

	/**
	 * 
	 */
	clearPagePreferences : function(strPageName, arrPreferences, fnCallBack,
			args, scope, blnShowMsg) {
		var me = this;
		var strUrl = Ext.String.format(
				'services/userpreferences/{0}.json?$clear=true&', strPageName);
		var objPref = arrPreferences ? Ext.encode(arrPreferences) : null;
		me.clearPreferences(strUrl, objPref, fnCallBack, args, scope,
				blnShowMsg);
	},
	clearModulePreferences : function(strPageName, strModuleName, preferences,
			fnCallBack, args, scope, blnShowMsg) {
		var me = this;
		var strUrl = Ext.String.format(
				'services/userpreferences/{0}/{1}.json?$clear=true&',
				strPageName, strModuleName);
		var objPref = preferences ? Ext.encode(preferences) : null;
		me.clearPreferences(strUrl, objPref, fnCallBack, args, scope,
				blnShowMsg);
	},
	/**
	 * 
	 */
	clearPreferences : function(strUrl, objPref, fnCallBack, args, scope,
			blnShowMsg) {
		Ext.Ajax.request({
			url : strUrl,
			method : 'POST',
			jsonData : objPref,
			async : false,
			success : function(response) {
				var data = Ext.decode(response.responseText);
				var isSuccess;
				var title, strMsg, imgIcon;
				if (data.d.preferences && data.d.preferences.success)
					isSuccess = data.d.preferences.success;
				if (isSuccess && isSuccess === 'N') {
					if (blnShowMsg === true) {
						title = getLabel('SaveFilterPopupTitle', 'Message');
						strMsg = data.d.preferences.error.errorMessage;
						imgIcon = Ext.MessageBox.ERROR;
						Ext.MessageBox.show({
									title : title,
									msg : strMsg,
									width : 200,
									cls : 't7-popup',
									buttons : Ext.MessageBox.OK,
									buttonText: {
										ok: getLabel('btnOk', 'OK')
										} ,
									icon : imgIcon
								});
					}

				} else {
					if (blnShowMsg === true) {
						Ext.MessageBox.show({
									title : title,
									msg : getLabel('prefClearedMsg',
											'Preferences Cleared Successfully'),
									buttons : Ext.MessageBox.OK,
									buttonText: {
										ok: getLabel('btnOk', 'OK')
										} ,
									cls : 't7-popup',
									icon : Ext.MessageBox.INFO
								});
					}
				}
				if (fnCallBack)
					Ext.callback(fnCallBack, scope, [data, args, isSuccess]);

			},
			failure : function() {
				if (blnShowMsg === true) {
					var errMsg = "";
					Ext.MessageBox.show({
								title : getLabel('instrumentErrorPopUpTitle',
										'Error'),
								msg : getLabel('instrumentErrorPopUpMsg',
										'Error while fetching data..!'),
								buttons : Ext.MessageBox.OK,
								buttonText: {
									ok: getLabel('btnOk', 'OK')
									} ,
								cls : 't7-popup',
								icon : Ext.MessageBox.ERROR
							});
				}
				if (fnCallBack)
					Ext.callback(fnCallBack, scope, [null, args, 'N']);
			}
		});
	},
	/**
	 * 
	 */
	readPagePreferences : function(strPageName, fnCallBack, args, scope,
			blnShowMsg) {
		var me = this;
		var strUrl = Ext.String.format('services/userpreferences/{0}.json?',
				strPageName);
		me.readPreferences(strUrl, fnCallBack, args, scope, blnShowMsg);
	},
	readModulePreferences : function(strPageName, strModuleName, fnCallBack,
			args, scope, blnShowMsg) {
		var me = this;
		var strUrl = Ext.String.format('services/userpreferences/{0}/{1}.json?',
				strPageName, strModuleName);
		me.readPreferences(strUrl, fnCallBack, args, scope, blnShowMsg);
	},
	readPreferences : function(strUrl, fnCallBack, args, scope, blnShowMsg) {
		Ext.Ajax.request({
					url : strUrl,
					method : 'GET',
					async : false,
					success : function(response) {
						var data = null;
						if (response && response.responseText)
							data = Ext.decode(response.responseText);
						Ext.callback(fnCallBack, scope, [data, args, 'Y']);
					},
					failure : function() {
						if (blnShowMsg === true) {
							var errMsg = "";
							Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : getLabel(
												'instrumentErrorPopUpMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										buttonText: {
											ok: getLabel('btnOk', 'OK')
											} ,
										cls : 't7-popup',
										icon : Ext.MessageBox.ERROR
									});
						}
						if (fnCallBack)
							Ext.callback(fnCallBack, scope, [null, args, 'N']);
					}
				});
	},
	
	checkDefaultFilterCodeAvail : function (me, objJsonData)
	{
		var filterLenght = '';
		var savedFilterName = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
		if(objJsonData.d.preferences.groupViewAdvanceFilter)
		{
			filterLenght = objJsonData.d.preferences.groupViewAdvanceFilter.filters.length;	
			for(i=0; i<filterLenght; i++)
			{
				if (objJsonData.d.preferences.groupViewAdvanceFilter.filters[i] == savedFilterName)
				{
					me.doHandleSavedFilterItemClick(savedFilterName);
					me.savedFilterVal = savedFilterName;
				}
			}
			
		}
		else if(objJsonData.d.preferences.advanceFilterOrderList)
		{
			filterLenght = objJsonData.d.preferences.advanceFilterOrderList.filters.length;	
			for(i=0; i<filterLenght; i++)
			{
				if (objJsonData.d.preferences.advanceFilterOrderList.filters[i] == savedFilterName)
				{
					me.doHandleSavedFilterItemClick(savedFilterName);
					me.savedFilterVal = savedFilterName;
				}
			}
			
		}		
	}
});