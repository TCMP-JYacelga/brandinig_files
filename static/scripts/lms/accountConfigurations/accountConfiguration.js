var ACC_CONF_DEFAULT_COLUMN_MODEL = [{
			"colId" : "acmAccount",
			"colHeader" : getLabel('accountNumber1', 'Account'),
			"sortable" : true,
			"colDesc" : getLabel('accountNumber1', 'Account'),
			"colSequence" : 1,
			"width" : 170,
			"locked" : false,
			"hidden" : false,
			"hideable" : false
		}, {
			"colId" : "acmPreferredName",
			"colHeader" : getLabel('accountNickName', 'Account Nickname'),
			"sortable" : true,
			"colDesc" : getLabel('accountNickName', 'Account Nickname'),
			"colSequence" : 2,
			"width" : 190,
			"locked" : false,
			"hidden" : false,
			"hideable" : false
		}, {
			"colId" : "group",
			"colHeader" : getLabel('accountGroup', 'Account Group'),
			"sortable" : true,
			"colDesc" : getLabel('accountGroup', 'Account Group'),
			"colSequence" : 3,
			"width" : 160,
			"locked" : false,
			"hidden" : false,
			"hideable" : true
		}, {
			"colId" : "lowerWarnLimitAmt",
			"colType" : "number",
			"colHeader" : getLabel('lowerWarnAmtLimit', 'Lower Warning Limit Amount'),
			"sortable" : true,
			"colDesc" : getLabel('lowerWarnAmtLimit', 'Lower Warning Limit Amount'),
			"colSequence" : 4,
			"width" : 240,
			"locked" : false,
			"hidden" : false,
			"hideable" : true
		}, {
			"colId" : "higherWarnLimitAmt",
			"colType" : "number",
			"colHeader" : getLabel('higherWarnAmtLimit', 'Higher Warning Limit Amount'),
			"sortable" : true,
			"colDesc" : getLabel('higherWarnAmtLimit', 'Higher Warning Limit Amount'),
			"colSequence" : 5,
			"width" : 240,
			"locked" : false,
			"hidden" : false,
			"hideable" : true
		}, {
			"colId" : "requestStateDesc",
			"colHeader" : getLabel('status', 'Status'),
			"sortable" : false,
			"colDesc" : getLabel('status', 'Status'),
			"colSequence" : 6,
			"width" : 160,
			"locked" : false,
			"hidden" : false,
			"hideable" : false
		}];

var ACC_CONF_DEFAULT_ADMIN_COLUMN_MODEL = [{
			"colId" : "acmClientName",
			"colHeader" : getLabel('client', 'Company Name'),
			"sortable" : true,
			"colDesc" : getLabel('client', 'Company Name'),
			"colSequence" : 1,
			"width" : 140,
			"locked" : false,
			"hidden" : false,
			"hideable" : false
		}, {
			"colId" : "acmAccount",
			"colHeader" : getLabel('accountNumber', 'Account'),
			"sortable" : true,
			"colDesc" : getLabel('accountNumber', 'Account'),
			"colSequence" : 2,
			"width" : 170,
			"locked" : false,
			"hidden" : false,
			"hideable" : false
		}, {
			"colId" : "acmPreferredName",
			"colHeader" : getLabel('accountNickName', 'Account Nickname'),
			"sortable" : false,
			"colDesc" : getLabel('accountNickName', 'Account Nickname'),
			"colSequence" : 3,
			"width" : 190,
			"locked" : false,
			"hidden" : false,
			"hideable" : false
		}, /*
			 * { As Discussed with KK this Column to be made hidden "colId" :
			 * "enrichLink", "colDesc" : "Configure Notes" },
			 */
		{
			"colId" : "group",
			"colHeader" : getLabel('accountGroup', 'Account Group'),
			"sortable" : true,
			"colDesc" : getLabel('accountGroup', 'Account Group'),
			"colSequence" : 4,
			"width" : 160,
			"locked" : false,
			"hidden" : false,
			"hideable" : false
		}, {
			"colId" : "lowerWarnLimitAmt",
			"colType" : "number",
			"colHeader" : getLabel('lowerWarnAmtLimit', 'Lower Warning Limit Amount'),
			"sortable" : true,
			"colDesc" : getLabel('lowerWarnAmtLimit', 'Lower Warning Limit Amount'),
			"colSequence" : 5,
			"width" : 240,
			"locked" : false,
			"hidden" : false,
			"hideable" : false
		}, {
			"colId" : "higherWarnLimitAmt",
			"colType" : "number",
			"colHeader" : getLabel('higherWarnAmtLimit', 'Higher Warning Limit Amount'),
			"sortable" : true,
			"colDesc" : getLabel('higherWarnAmtLimit', 'Higher Warning Limit Amount'),
			"colSequence" : 6,
			"width" : 240,
			"locked" : false,
			"hidden" : false,
			"hideable" : false
		}, {
			"colId" : "requestStateDesc",
			"colHeader" : getLabel('status', 'Status'),
			"sortable" : false,
			"colDesc" : getLabel('status', 'Status'),
			"colSequence" : 7,
			"width" : 320,
			"locked" : false,
			"hidden" : false,
			"hideable" : false
		}];
		
var arrSortColumnReport = {
	'acmClientName' : 'acmClientName',	
	'acmAccount' : 'acmAccount',
	'acmPreferredName' : 'acmPreferredName',
	'group' : 'group',
	'lowerWarnLimitAmt' : 'lowerWarnLimitAmt',
	'higherWarnLimitAmt' : 'higherWarnLimitAmt',
	'requestStateDesc' : 'requestStateDesc'
};		