var uploaddt = null;

Ext.Loader.setConfig(
{
	enabled : true,
	disableCaching : false,
	setPath :
	{
		'Ext' : 'static/js/extjs4.2.1/src',
		'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
	}
} );

Ext.application(
{
	name : 'GCP',
	appFolder : 'static/scripts/commonmst/currencyRateMst/app',
	// appFolder : 'app',
	controllers : [],
	requires :
	[
		'Ext.form.DateField'
	],
	launch : function()
	{

		if( pageMode == 'NEW' || pageMode == 'EDIT' )
		{
			var uploadDateValue = uploadDateModel == null || uploadDateModel == '' ? dtApplicationDate
				: uploadDateModel;
			uploaddt = Ext.create( 'Ext.form.DateField',
			{
				itemId : 'uploadDate',
				name : 'uploadDate',
				format : extJsDateFormat,
				editable : false,
				minValue : dtApplicationDate,
				value : uploadDateValue,
				renderTo : 'uploadDateDiv',
				listeners :
				{
					change : function( datefield, newValue, oldValue, eOpts )
					{
					},
					select : function( datefield, newValue, oldValue, eOpts )
					{
						setDirtyBit();
					}
				}
			} );
		}
	}
} );
