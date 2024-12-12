var filterConfig = {
	"alert" : [[{
						"showLabel" : "true",
						"label" : "profileName",
						"componentType" : "AutoCompleter",
						"name" : "profileName",
						"cfgUrl" : "cpon/profileseek/{0}.json",
						"itemId" : "profileNameFltId",
						"cfgSeekId" : "alertprofilenameseek",
						"cfgRootNode" : "d.filter",
						"cfgDataNode1" : "name"
					}, {
						"showLabel" : "true",
						"label" : "status",
						"componentType" : "ComboBox",
						"itemId" : "profileStatusFltId",
						"fltParamName" : "requestState",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/statusList.json",
						"cfgRootNode" : "d.filter"
					}, {
						"showLabel" : "true",
						"label" : "module",
						"componentType" : "ComboBox",
						"itemId" : "profileModuleFltId",
						"fltParamName" : "module",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/moduleList.json",
						"cfgRootNode" : "d.filter"
					}], [{
						"showLabel" : "false",
						"label" : "search",
						"componentType" : "button"
					}]],
	"report" : [[{
						"showLabel" : "true",
						"label" : "profileName",
						"componentType" : "AutoCompleter",
						"name" : "profileName",
						"cfgUrl" : "cpon/profileseek/{0}.json",
						"itemId" : "profileNameFltId",
						"cfgSeekId" : "reportprofilenameseek",
						"cfgRootNode" : "d.filter",
						"cfgDataNode1" : "name"
					}, {
						"showLabel" : "true",
						"label" : "status",
						"componentType" : "ComboBox",
						"itemId" : "profileStatusFltId",
						"fltParamName" : "requestState",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/statusList.json",
						"cfgRootNode" : "d.filter"
					}, {
						"showLabel" : "true",
						"label" : "module",
						"componentType" : "ComboBox",
						"itemId" : "profileModuleFltId",
						"fltParamName" : "module",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/moduleList.json",
						"cfgRootNode" : "d.filter"
					}], [ {
						"showLabel" : "false",
						"label" : "search",
						"componentType" : "button"
					}]],
	"interface" : [[{
						"showLabel" : "true",
						"label" : "profileName",
						"componentType" : "AutoCompleter",
						"name" : "profileName",
						"cfgUrl" : "cpon/cponseek/{0}.json",
						"itemId" : "profileNameFltId",
						"cfgSeekId" : "interfaceprofilenameseek",
						"cfgRootNode" : "d.filter",
						"cfgDataNode1" : "name"
					}, {
						"showLabel" : "true",
						"label" : "status",
						"componentType" : "ComboBox",
						"itemId" : "profileStatusFltId",
						"fltParamName" : "requestState",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/statusList.json",
						"cfgRootNode" : "d.filter"
					}], [{
						"showLabel" : "false",
						"label" : "search",
						"componentType" : "button"
					}]],
	"enrichment" : [[{
						"showLabel" : "true",
						"label" : "profileName",
						"componentType" : "AutoCompleter",
						"name" : "profileName",
						"cfgUrl" : "cpon/cponseek/{0}.json",
						"itemId" : "profileNameFltId",
						"cfgSeekId" : "enrichmentprofilenameseek",
						"cfgRootNode" : "d.filter",
						"cfgDataNode1" : "name"
					}, {
						"showLabel" : "true",
						"label" : "status",
						"componentType" : "ComboBox",
						"itemId" : "profileStatusFltId",
						"fltParamName" : "requestState",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/statusList.json",
						"cfgRootNode" : "d.filter"
					}], [{
						"showLabel" : "true",
						"label" : "transactionType",
						"componentType" : "ComboBox",
						"itemId" : "profileTxnTypeFltId",
						"fltParamName" : "txnType",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/transactionTypeList.json",
						"cfgRootNode" : "d.filter"
					},{
						"showLabel" : "false",
						"label" : "search",
						"componentType" : "button"
					}]],
	"charge" : [[{
						"showLabel" : "true",
						"label" : "profileName",
						"componentType" : "AutoCompleter",
						"name" : "profileName",
						"cfgUrl" : "cpon/cponseek/{0}.json",
						"itemId" : "profileNameFltId",
						"cfgSeekId" : "chargeprofilenameseek",
						"cfgRootNode" : "d.filter",
						"cfgDataNode1" : "name"
					}, {
						"showLabel" : "true",
						"label" : "status",
						"componentType" : "ComboBox",
						"itemId" : "profileStatusFltId",
						"fltParamName" : "requestState",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/statusList.json",
						"cfgRootNode" : "d.filter"
					}],
					[{
						"showLabel" : "false",
						"label" : "search",
						"componentType" : "button"
					}]],
	"limit" : [[{
						"showLabel" : "true",
						"label" : "profileName",
						"componentType" : "AutoCompleter",
						"name" : "profileName",
						"cfgUrl" : "cpon/cponseek/{0}.json",
						"itemId" : "profileNameFltId",
						"cfgSeekId" : "limitprofilenameseek",
						"cfgRootNode" : "d.filter",
						"cfgDataNode1" : "name"
					}, {
						"showLabel" : "true",
						"label" : "status",
						"componentType" : "ComboBox",
						"itemId" : "profileStatusFltId",
						"fltParamName" : "requestState",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/statusList.json",
						"cfgRootNode" : "d.filter"
					}], [{
						"showLabel" : "false",
						"label" : "search",
						"componentType" : "button"
					}]],
	"cutoff" : [[{
						"showLabel" : "true",
						"label" : "profileName",
						"componentType" : "AutoCompleter",
						"name" : "profileName",
						"cfgUrl" : "cpon/cponseek/{0}.json",
						"itemId" : "profileNameFltId",
						"cfgSeekId" : "cutoffprofilenameseek",
						"cfgRootNode" : "d.filter",
						"cfgDataNode1" : "name"
					}, {
						"showLabel" : "true",
						"label" : "status",
						"componentType" : "ComboBox",
						"itemId" : "profileStatusFltId",
						"fltParamName" : "requestState",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/statusList.json",
						"cfgRootNode" : "d.filter"
					}], [{
						"showLabel" : "false",
						"label" : "search",
						"componentType" : "button"
					}]],
	"check" : [[{
						"showLabel" : "true",
						"label" : "profileName",
						"componentType" : "AutoCompleter",
						"name" : "profileName",
						"cfgUrl" : "cpon/cponseek/{0}.json",
						"itemId" : "profileNameFltId",
						"cfgSeekId" : "checksprofilenameseek",
						"cfgRootNode" : "d.filter",
						"cfgDataNode1" : "name"
					}, {
						"showLabel" : "true",
						"label" : "status",
						"componentType" : "ComboBox",
						"itemId" : "profileStatusFltId",
						"fltParamName" : "requestState",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/statusList.json",
						"cfgRootNode" : "d.filter"
					}], [{
						"showLabel" : "false",
						"label" : "search",
						"componentType" : "button"
					}]],
	"adminfeature" : [[{
				"showLabel" : "true",
				"label" : "profileName",
				"componentType" : "AutoCompleter",
				"name" : "profileName",
				"cfgUrl" : "cpon/cponseek/{0}.json",
				"itemId" : "profileNameFltId",
				"cfgSeekId" : "adminprofilenameseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			}, {
				"showLabel" : "true",
				"label" : "status",
				"componentType" : "ComboBox",
				"itemId" : "profileStatusFltId",
				"fltParamName" : "requestState",
				"valueField" : "name",
				"displayField" : "value",
				"value" : "all",
				"url" : "cpon/statusList.json",
				"cfgRootNode" : "d.filter"
			}, {
				"showLabel" : "false",
				"label" : "search",
				"componentType" : "button"
			}]],
	"typecode" : [[{
						"showLabel" : "true",
						"label" : "profileName",
						"componentType" : "AutoCompleter",
						"name" : "profileName",
						"cfgUrl" : "cpon/cponseek/{0}.json",
						"itemId" : "profileNameFltId",
						"cfgSeekId" : "typecodeprofilenameseek",
						"cfgRootNode" : "d.filter",
						"cfgDataNode1" : "name"
					}, {
						"showLabel" : "true",
						"label" : "status",
						"componentType" : "ComboBox",
						"itemId" : "profileStatusFltId",
						"fltParamName" : "requestState",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/statusList.json",
						"cfgRootNode" : "d.filter"
					}], [{
						"showLabel" : "false",
						"label" : "search",
						"componentType" : "button"
					}]],
	"brfeature" : [[{
				"showLabel" : "true",
				"label" : "profileName",
				"componentType" : "AutoCompleter",
				"name" : "profileName",
				"cfgUrl" : "cpon/cponseek/{0}.json",
				"itemId" : "profileNameFltId",
				"cfgSeekId" : "brfeatureprofilenameseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			}, {
				"showLabel" : "true",
				"label" : "status",
				"componentType" : "ComboBox",
				"itemId" : "profileStatusFltId",
				"fltParamName" : "requestState",
				"valueField" : "name",
				"displayField" : "value",
				"value" : "all",
				"url" : "cpon/statusList.json",
				"cfgRootNode" : "d.filter"
			}, {
				"showLabel" : "false",
				"label" : "search",
				"componentType" : "button"
			}]],
	"paymentWorkflow" : [[{
						"showLabel" : "true",
						"label" : "profileName",
						"componentType" : "AutoCompleter",
						"name" : "profileName",
						"cfgUrl" : "cpon/cponseek/{0}.json",
						"itemId" : "profileNameFltId",
						"cfgSeekId" : "paymentWorkflowProfileNameSeek",
						"cfgRootNode" : "d.filter",
						"cfgDataNode1" : "name"
					}, {
						"showLabel" : "true",
						"label" : "status",
						"componentType" : "ComboBox",
						"itemId" : "profileStatusFltId",
						"fltParamName" : "requestState",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/statusList.json",
						"cfgRootNode" : "d.filter"
					}], [  {
						"showLabel" : "false",
						"label" : "search",
						"componentType" : "button"
					}]],
	"systemBene" : [[{
						"showLabel" : "true",
						"label" : "profileName",
						"componentType" : "AutoCompleter",
						"name" : "profileName",
						"cfgUrl" : "cpon/cponseek/{0}.json",
						"itemId" : "profileNameFltId",
						"cfgSeekId" : "systemBeneProfileNameSeek",
						"cfgRootNode" : "d.filter",
						"cfgDataNode1" : "name"
					}, {
						"showLabel" : "true",
						"label" : "status",
						"componentType" : "ComboBox",
						"itemId" : "profileStatusFltId",
						"fltParamName" : "requestState",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/statusList.json",
						"cfgRootNode" : "d.filter"
					}], [ {
						"showLabel" : "false",
						"label" : "search",
						"componentType" : "button"
					}]],
	"achPassThru" : [[{
						"showLabel" : "true",
						"label" : "profileName",
						"componentType" : "AutoCompleter",
						"name" : "profileName",
						"cfgUrl" : "cpon/cponseek/{0}.json",
						"itemId" : "profileNameFltId",
						"cfgSeekId" : "achPassThruProfileNameSeek",
						"cfgRootNode" : "d.filter",
						"cfgDataNode1" : "name"
					}, {
						"showLabel" : "true",
						"label" : "status",
						"componentType" : "ComboBox",
						"itemId" : "profileStatusFltId",
						"fltParamName" : "requestState",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/statusList.json",
						"cfgRootNode" : "d.filter"
					}], [ {
						"showLabel" : "false",
						"label" : "search",
						"componentType" : "button"
					}]],					
	"fxSpread" : [[{
						"showLabel" : "true",
						"label" : "profileName",
						"componentType" : "AutoCompleter",
						"name" : "profileName",
						"cfgUrl" : "cpon/cponseek/{0}.json",
						"itemId" : "profileNameFltId",
						"cfgSeekId" : "fxSpreadProfileNameSeek",
						"cfgRootNode" : "d.filter",
						"cfgDataNode1" : "name"
					}, {
						"showLabel" : "true",
						"label" : "status",
						"componentType" : "ComboBox",
						"itemId" : "profileStatusFltId",
						"fltParamName" : "requestState",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/statusList.json",
						"cfgRootNode" : "d.filter"
					}], [{
						"showLabel" : "false",
						"label" : "search",
						"componentType" : "button"
					}]],
	"paymentFeature" : [[{
				"showLabel" : "true",
				"label" : "profileName",
				"componentType" : "AutoCompleter",
				"name" : "profileName",
				"cfgUrl" : "cpon/cponseek/{0}.json",
				"itemId" : "profileNameFltId",
				"cfgSeekId" : "paymentFeatureProfileNameSeek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			}, {
				"showLabel" : "true",
				"label" : "status",
				"componentType" : "ComboBox",
				"itemId" : "profileStatusFltId",
				"fltParamName" : "requestState",
				"valueField" : "name",
				"displayField" : "value",
				"value" : "all",
				"url" : "cpon/statusList.json",
				"cfgRootNode" : "d.filter"
			}, {
				"showLabel" : "false",
				"label" : "search",
				"componentType" : "button"
			}]],
	"paymentPackage" : [[{
						"showLabel" : "true",
						"label" : "packageName",
						"componentType" : "AutoCompleter",
						"name" : "packageName",
						"cfgUrl" : "cpon/cponseek/{0}.json",
						"itemId" : "profileNameFltId",
						"cfgSeekId" : "paymentPackageProfileNameSeek",
						"cfgRootNode" : "d.filter",
						"cfgDataNode1" : "name"
					}, {
						"showLabel" : "true",
						"label" : "status",
						"componentType" : "ComboBox",
						"itemId" : "profileStatusFltId",
						"fltParamName" : "requestState",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/statusList.json",
						"cfgRootNode" : "d.filter"
					}], [{
						"showLabel" : "true",
						"label" : "type",
						"componentType" : "ComboBox",
						"itemId" : "profileModuleFltId",
						"fltParamName" : "productCatType",
						"valueField" : "name",
						"displayField" : "name",
						"value" : "all",
						"url" : "cpon/productTypeList.json",
						"cfgRootNode" : "d.filter"
					}, {
						"showLabel" : "false",
						"label" : "search",
						"componentType" : "button"
					}]],
	"incomingPayment" : [[{
						"showLabel" : "true",
						"label" : "profileName",
						"componentType" : "AutoCompleter",
						"name" : "profileName",
						"cfgUrl" : "cpon/cponseek/{0}.json",
						"itemId" : "profileNameFltId",
						"cfgSeekId" : "incomingPaymentProfileNameSeek",
						"cfgRootNode" : "d.filter",
						"cfgDataNode1" : "name"
					}, {
						"showLabel" : "true",
						"label" : "status",
						"componentType" : "ComboBox",
						"itemId" : "profileStatusFltId",
						"fltParamName" : "requestState",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/statusList.json",
						"cfgRootNode" : "d.filter"
					}, {
						"showLabel" : "false",
						"label" : "search",
						"componentType" : "button"
					}]],
   "positivePay" : [[{
						"showLabel" : "true",
						"label" : "profileName",
						"componentType" : "AutoCompleter",
						"name" : "profileName",
						"cfgUrl" : "cpon/cponseek/{0}.json",
						"itemId" : "profileNameFltId",
						"cfgSeekId" : "positivePayProfileNameSeek",
						"cfgRootNode" : "d.filter",
						"cfgDataNode1" : "name"
					}, {
						"showLabel" : "true",
						"label" : "status",
						"componentType" : "ComboBox",
						"itemId" : "profileStatusFltId",
						"fltParamName" : "requestState",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/statusList.json",
						"cfgRootNode" : "d.filter"
					}], [{
						"showLabel" : "false",
						"label" : "search",
						"componentType" : "button"
					}]],
	"password" : [[{
						"showLabel" : "true",
						"label" : "profileName",
						"componentType" : "AutoCompleter",
						"name" : "profileName",
						"cfgUrl" : "cpon/cponseek/{0}.json",
						"itemId" : "profileNameFltId",
						"cfgSeekId" : "passwordprofilenameseek",
						"cfgRootNode" : "d.filter",
						"cfgDataNode1" : "name"
					}, {
						"showLabel" : "true",
						"label" : "status",
						"componentType" : "ComboBox",
						"itemId" : "profileStatusFltId",
						"fltParamName" : "requestState",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/statusList.json",
						"cfgRootNode" : "d.filter"
					}], [{
						"showLabel" : "false",
						"label" : "search",
						"componentType" : "button"
					}]],
	"systemBeneficiarySetup" : [[{
						"showLabel" : "true",
						"label" : "Beneficiary Name",
						"componentType" : "AutoCompleter",
						"name" : "beneDesc",
						"cfgUrl" : "cpon/cponseek/{0}.json",
						"itemId" : "profileNameFltId",
						"cfgSeekId" : "beneficiaryNameSeek",
						"cfgRootNode" : "d.filter",
						"cfgDataNode1" : "name"
					}, {
						"showLabel" : "true",
						"label" : "status",
						"componentType" : "ComboBox",
						"itemId" : "profileStatusFltId",
						"fltParamName" : "requestState",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/statusList.json",
						"cfgRootNode" : "d.filter"
					}, {
						"showLabel" : "false",
						"label" : "search",
						"componentType" : "button"
					}]]	,
	"others" : [[{
						"showLabel" : "true",
						"label" : "profileName",
						"componentType" : "AutoCompleter",
						"name" : "profileName",
						"cfgUrl" : "cpon/cponseek/{0}.json",
						"itemId" : "profileNameFltId",
						"cfgSeekId" : "othersprofilenameseek",
						"cfgRootNode" : "d.filter",
						"cfgDataNode1" : "name"
					}, {
						"showLabel" : "true",
						"label" : "status",
						"componentType" : "ComboBox",
						"itemId" : "profileStatusFltId",
						"fltParamName" : "requestState",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/statusList.json",
						"cfgRootNode" : "d.filter"
					}], [{
						"showLabel" : "false",
						"label" : "search",
						"componentType" : "button"
					}]],
		"chargeFrequency" : [[{
						"showLabel" : "true",
						"label" : "profileName",
						"componentType" : "AutoCompleter",
						"name" : "profileName",
						"cfgUrl" : "cpon/cponseek/{0}.json",
						"itemId" : "profileNameFltId",
						"cfgSeekId" : "chargeFreqProfilenameseek",
						"cfgRootNode" : "d.filter",
						"cfgDataNode1" : "name"
					}, {
						"showLabel" : "true",
						"label" : "status",
						"componentType" : "ComboBox",
						"itemId" : "profileStatusFltId",
						"fltParamName" : "requestState",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/statusList.json",
						"cfgRootNode" : "d.filter"
					}, {
						"showLabel" : "false",
						"label" : "search",
						"componentType" : "button"
					}]],					
		"liquidity" : [[{
						"showLabel" : "true",
						"label" : "profileName",
						"componentType" : "AutoCompleter",
						"name" : "profileName",
						"cfgUrl" : "cpon/cponseek/{0}.json",
						"itemId" : "profileNameFltId",
						"cfgSeekId" : "liquidityprofilenameseek",
						"cfgRootNode" : "d.filter",
						"cfgDataNode1" : "name"
					}, {
						"showLabel" : "true",
						"label" : "status",
						"componentType" : "ComboBox",
						"itemId" : "profileStatusFltId",
						"fltParamName" : "requestState",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/statusList.json",
						"cfgRootNode" : "d.filter"
					},	{
						"showLabel" : "false",
						"label" : "search",
						"componentType" : "button"
					}]],
		"workflow" : [[{
						"showLabel" : "true",
						"label" : "profileName",
						"componentType" : "AutoCompleter",
						"name" : "profileName",
						"cfgUrl" : "cpon/cponseek/{0}.json",
						"itemId" : "profileNameFltId",
						"cfgSeekId" : "fscWorkflowProfileNameSeek",
						"cfgRootNode" : "d.filter",
						"cfgDataNode1" : "name"
					}], [ {
						"showLabel" : "true",
						"label" : "status",
						"componentType" : "ComboBox",
						"itemId" : "profileStatusFltId",
						"fltParamName" : "requestState",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/statusList.json",
						"cfgRootNode" : "d.filter"
					},{
						"showLabel" : "false",
						"label" : "search",
						"componentType" : "button"
					}]]	,			
		"overdue" : [[{
						"showLabel" : "true",
						"label" : "profileName",
						"componentType" : "AutoCompleter",
						"name" : "profileName",
						"cfgUrl" : "cpon/cponseek/{0}.json",
						"itemId" : "profileNameFltId",
						"cfgSeekId" : "overdueprofilenameseek",
						"cfgRootNode" : "d.filter",
						"cfgDataNode1" : "name"
					}, {
						"showLabel" : "true",
						"label" : "scmProduct",
						"componentType" : "AutoCompleter",
						"name" : "productCode",
						"cfgUrl" : "cpon/cponseek/{0}.json",
						"itemId" : "scmProductFltId",
						"cfgSeekId" : "overduescmproductseek",
						"cfgRootNode" : "d.filter",
						"cfgDataNode1" : "name"
					}], [ {
						"showLabel" : "true",
						"label" : "status",
						"componentType" : "ComboBox",
						"itemId" : "profileStatusFltId",
						"fltParamName" : "requestState",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/statusList.json",
						"cfgRootNode" : "d.filter"
					},{
						"showLabel" : "false",
						"label" : "search",
						"componentType" : "button"
					}]],
		"fsc" : [[{
						"showLabel" : "true",
						"label" : "profileName",
						"componentType" : "AutoCompleter",
						"name" : "profileName",
						"cfgUrl" : "cpon/cponseek/{0}.json",
						"itemId" : "profileNameFltId",
						"cfgSeekId" : "fscprofilenameseek",
						"cfgRootNode" : "d.filter",
						"cfgDataNode1" : "name"
					}],[{
						"showLabel" : "true",
						"label" : "status",
						"componentType" : "ComboBox",
						"itemId" : "profileStatusFltId",
						"fltParamName" : "requestState",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/statusList.json",
						"cfgRootNode" : "d.filter"
					},	{
						"showLabel" : "false",
						"label" : "search",
						"componentType" : "button"
					}]],
			"financing" : [[{
						"showLabel" : "true",
						"label" : "profileName",
						"componentType" : "AutoCompleter",
						"name" : "profileName",
						"cfgUrl" : "cpon/cponseek/{0}.json",
						"itemId" : "profileNameFltId",
						"cfgSeekId" : "financeSetupNamesSeek",
						"cfgRootNode" : "d.filter",
						"cfgDataNode1" : "name"
					},
					{
						"showLabel" : "true",
						"label" : "scmProduct",
						"componentType" : "AutoCompleter",
						"name" : "productCode",
						"cfgUrl" : "cpon/cponseek/{0}.json",
						"itemId" : "scmProductFltId",
						"cfgSeekId" : "overduescmproductseek",
						"cfgRootNode" : "d.filter",
						"cfgDataNode1" : "name",
						"cfgKeyNode" : "value"
					},
					{
						"showLabel" : "true",
						"label" : "status",
						"componentType" : "ComboBox",
						"itemId" : "profileStatusFltId",
						"fltParamName" : "requestState",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/statusList.json",
						"cfgRootNode" : "d.filter"
					},{
						"showLabel" : "false",
						"label" : "search",
						"componentType" : "button"
					}]],
			"tax" : [[{
						"showLabel" : "true",
						"label" : "profileName",
						"componentType" : "AutoCompleter",
						"name" : "profileName",
						"cfgUrl" : "cpon/cponseek/{0}.json",
						"itemId" : "profileNameFltId",
						"cfgSeekId" : "taxProfileNameSeek",
						"cfgRootNode" : "d.filter",
						"cfgDataNode1" : "name"
					},{
						"showLabel" : "true",
						"label" : "status",
						"componentType" : "ComboBox",
						"itemId" : "profileStatusFltId",
						"fltParamName" : "requestState",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/statusList.json",
						"cfgRootNode" : "d.filter"
					},	{
						"showLabel" : "false",
						"label" : "search",
						"componentType" : "button"
					}]],		
					"Receivable" : [[{
						"showLabel" : "true",
						"label" : "profileName",
						"componentType" : "AutoCompleter",
						"name" : "profileName",
						"cfgUrl" : "cpon/cponseek/{0}.json",
						"itemId" : "profileNameFltId",
						"cfgSeekId" : "collectionWorkflowProfileNameSeek",
						"cfgRootNode" : "d.filter",
						"cfgDataNode1" : "name"
					}, {
						"showLabel" : "true",
						"label" : "status",
						"componentType" : "ComboBox",
						"itemId" : "profileStatusFltId",
						"fltParamName" : "requestState",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/statusList.json",
						"cfgRootNode" : "d.filter"
					}], [{
						"showLabel" : "false",
						"label" : "search",
						"componentType" : "button"
					}]],
					"token" : [[{
						"showLabel" : "true",
						"label" : "profileName",
						"componentType" : "AutoCompleter",
						"name" : "profileName",
						"cfgUrl" : "cpon/cponseek/{0}.json",
						"itemId" : "profileNameFltId",
						"cfgSeekId" : "tokenprofilenameseek",
						"cfgRootNode" : "d.filter",
						"cfgDataNode1" : "name"
					}, {
						"showLabel" : "true",
						"label" : "status",
						"componentType" : "ComboBox",
						"itemId" : "profileStatusFltId",
						"fltParamName" : "requestState",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/statusList.json",
						"cfgRootNode" : "d.filter"
					}], [{
						"showLabel" : "false",
						"label" : "search",
						"componentType" : "button"
					}]],
		"groupBy" : [[{
					"showLabel" : "true",
					"label" : "profileName",
					"componentType" : "AutoCompleter",
					"name" : "profileName",
					"cfgUrl" : "cpon/cponseek/{0}.json",
					"itemId" : "profileNameFltId",
					"cfgSeekId" : "groupByProfileNameSeek",
					"cfgRootNode" : "d.filter",
					"cfgDataNode1" : "name"
				}, {
					"showLabel" : "true",
					"label" : "status",
					"componentType" : "ComboBox",
					"itemId" : "profileStatusFltId",
					"fltParamName" : "requestState",
					"valueField" : "name",
					"displayField" : "value",
					"value" : "all",
					"url" : "cpon/statusList.json",
					"cfgRootNode" : "d.filter"
				}], [{
					"showLabel" : "false",
					"label" : "search",
					"componentType" : "button"
				}]],
		
		"schedule" : [[{
					"showLabel" : "true",
					"label" : "profileName",
					"componentType" : "AutoCompleter",
					"name" : "profileName",
					"cfgUrl" : "cpon/cponseek/{0}.json",
					"itemId" : "profileNameFltId",
					"cfgSeekId" : "scheduleProfileNameSeek",
					"cfgRootNode" : "d.filter",
					"cfgDataNode1" : "name"
				}, {
					"showLabel" : "true",
					"label" : "status",
					"componentType" : "ComboBox",
					"itemId" : "profileStatusFltId",
					"fltParamName" : "requestState",
					"valueField" : "name",
					"displayField" : "value",
					"value" : "all",
					"url" : "cpon/statusList.json",
					"cfgRootNode" : "d.filter"
				}],
				[{
					"showLabel" : "true",
					"label" : "scheduleStatus",
					"componentType" : "ComboBox",
					"name" : "scheduleStatus",
					"fltParamName" : "scheduleStatus",
					"url" : "cpon/scheduleStatus.json",
					"itemId" : "scheduleStatusFltId",
					"cfgRootNode" : "d.filter",
					"cfgDataNode1" : "name",
					"valueField" : "name",
					"displayField" : "value",
					"value" : "all"
				}, {
					"showLabel" : "true",
					"label" : "scheduleType",
					"name" : "scheduleType",
					"fltParamName" : "scheduleType",
					"componentType" : "ComboBox",
					"itemId" : "scheduleTypeFltId",
					"valueField" : "name",
					"displayField" : "value",
					"value" : "all",
					"url" : "cpon/scheduleType.json",
					"cfgRootNode" : "d.filter"
				},
				{
					"showLabel" : "false",
					"label" : "search",
					"componentType" : "button"
				}]],
				
		"arrangement" : [[{
					"showLabel" : "true",
					"label" : "profileName",
					"componentType" : "AutoCompleter",
					"name" : "profileName",
					"cfgUrl" : "cpon/cponseek/{0}.json",
					"itemId" : "profileNameFltId",
					"cfgSeekId" : "arrangementProfileNameSeek",
					"cfgRootNode" : "d.filter",
					"cfgDataNode1" : "name"
				}, {
					"showLabel" : "true",
					"label" : "status",
					"componentType" : "ComboBox",
					"itemId" : "profileStatusFltId",
					"fltParamName" : "requestState",
					"valueField" : "name",
					"displayField" : "value",
					"value" : "all",
					"url" : "cpon/statusList.json",
					"cfgRootNode" : "d.filter"
				}, {
						"showLabel" : "true",
						"label" : "module",
						"componentType" : "ComboBox",
						"itemId" : "profileModuleFltId",
						"fltParamName" : "module",
						"valueField" : "name",
						"displayField" : "value",
						"value" : "all",
						"url" : "cpon/moduleList.json",
						"cfgRootNode" : "d.filter"
					}], [{
					"showLabel" : "false",
					"label" : "search",
					"componentType" : "button"
				}]]
}