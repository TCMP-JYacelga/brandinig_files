Ext.Loader.setConfig({
	enabled : true,
	disableCaching : false,
	setPath : {
		'Ext' : 'static/js/extjs4.2.1/src',
		'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
	}
});

Ext
		.application({
			name : 'GCP',			
			appFolder : 'static/scripts/commonmst/holidaySummary/app',			
			controllers : [],
			requires : [ 'Ext.form.DateField'],
			launch : function() {				
				if(pageMode == 'ADD' || requestState == '0')
				{				
					var holidayDtValue = holidayDateModel == null || holidayDateModel == '' ? applicationDate
							: holidayDateModel;
					var holidayDt = Ext.create('Ext.form.DateField', {
						name : 'holidayDate',
						itemId : 'holidayDate',
						width: 165,
						format : extJsDateFormat,
						editable : false,
						minValue : applicationDate, 
						value : holidayDtValue
					});
					holidayDt.render(Ext.get('holidayDateDiv'));
				}
				}
		});