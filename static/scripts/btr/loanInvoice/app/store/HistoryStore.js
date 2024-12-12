/**
 * This store is provided to Batch center history pop-up grid,
 * It gets data by firing service provided and shows in appropriate format specified by view.
 */
Ext.define('GCP.store.HistoryStore', {

			extend : 'Ext.data.Store',
			/**
			 * @cfg {Object} fields
			 * This may be used in place of specifying a model configuration. The fields should be a set of 
			 * Ext.data.Field configuration objects. The store will automatically create a Ext.data.Model with 
			 * these fields. In general this configuration option should only be used for simple stores like a 
			 * two-field store of ComboBox. For anything more complicated, such as specifying a particular id 
			 * property or associations, a Ext.data.Model should be defined and specified for the model config.
			 */
			fields : ['zone', 'version', "recordKeyNo", "userCode", {
						name : "logDate",
						type : 'date',
						dateFormat : 'time'
					}, "requestState",'remarks',"__metadata"]
});

