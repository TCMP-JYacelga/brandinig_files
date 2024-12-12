Ext.define('Cashweb.model.AccountsGraphModel', {
	extend : 'Ext.data.Model',
	fields : ['dates', {name:'balances', type : 'float'}, {name:'opening_bal', type : 'float'}, 
	          {name:'closing_bal', type : 'float'}, {name:'current_bal', type : 'float'},
	          {name:'debits', type : 'float'}, {name:'credits', type : 'float'}]
});