/**
 * @class Ext.ux.gcp.vtypes.CustomVTypes
 * @author Vinay Thube
 */
Ext.define('Ext.ux.gcp.vtypes.CustomVTypes', {
	requires : ['Ext.form.field.VTypes'],
	singleton : true,
	applyDateRange : function() {
		Ext.apply(Ext.form.field.VTypes, {
			daterange : function(val, field) {
				var date = field.parseDate(val);
				var parentCt = field.parent;
				if (!date && !parentCt) {
					// return false;
				} else {
					if (field.startDateField
							&& (!this.dateRangeMax || Ext.isEmpty(date) || (date
									.getTime() != this.dateRangeMax.getTime()))) {
						var start = parentCt.down('datefield[itemId="'
								+ field.startDateField + '"]');
						var startDate = start.getValue();
						start.setMaxValue(date);
						start.validate();
						this.dateRangeMax = date;
					} else if (field.endDateField
							&& (!this.dateRangeMin || Ext.isEmpty(date) || (date
									.getTime() != this.dateRangeMin.getTime()))) {
						var end = parentCt.down('datefield[itemId="'
								+ field.endDateField + '"]');
						end.setMinValue(date);
						end.validate();
						this.dateRangeMin = date;
					}
				}
				return true;
			},
			daterangeText : 'Start date must be less than end date'
		});
	}
});
