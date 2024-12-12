/**
 * The method getDayInitial is overridden to get Day's first 2 characters
 */
/**
 * @class Ext.ux.gcp.Override.PickerDate
 * @override Ext.grid.Panel
 * @author Vinay Thube
 */
Ext.define('Ext.ux.gcp.Override.PickerDate', {
			override : 'Ext.picker.Date',
			/**
			 * Gets a single character to represent the day of the week
			 * 
			 * @return {String} The character
			 */
			getDayInitial : function(value) {
				return value.substr(0, 2);
			}
		});