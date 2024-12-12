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
	appFolder : 'static/scripts/reports/bankSchedulingDtl/app',
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
			disabled : JSON.parse(startDateDisable),
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
			allowBlank : true,
			minValue : dtApplicationDate,
			value : endDateValue,
			renderTo : 'schEndDateDiv',
			disabled : JSON.parse(endDateDisable),
			listeners :
			{
				change : function( datefield, newValue, oldValue, eOpts )
				{
				},
				select : function( datefield, newValue, oldValue, eOpts )
				{
					setDirtyBit();
				},
				specialKey : function (field,e)
				{
					if(e.keyCode == 8)
					{
					$('#'+field.inputId).val("");
					setDirtyBit();
					}
				}
			}
		} );
	}
} );
