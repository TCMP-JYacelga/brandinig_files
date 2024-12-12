var startDate = null;
var endDate = null;

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
	// appFolder : 'app',
	controllers : [],
	requires :
	[
		'Ext.form.DateField'
	],
	launch : function()
	{

		var startDateValue = startDateModel == null || startDateModel == '' ? dtApplicationDate : startDateModel;
		startDate = Ext.create( 'Ext.form.DateField',
		{
			itemId : 'schStartDate',
			name : 'schStartDate',
			format : extJsDateFormat,
			editable : false,
			minValue : dtApplicationDate,
			value : startDateValue,
			renderTo : 'schStartDateDiv',
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

		var endDateValue = null;
		if( !Ext.isEmpty( endDateModel ) && endDateModel != '' )
		{
			endDateValue = endDateModel
		}
		endDate = Ext.create( 'Ext.form.DateField',
		{
			itemId : 'schEndDate',
			name : 'schEndDate',
			format : extJsDateFormat,
			editable : false,
			minValue : dtApplicationDate,
			value : endDateValue,
			renderTo : 'schEndDateDiv',
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
} );
