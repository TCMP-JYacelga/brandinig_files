var messageFormDtlLabelsMap =
{
	"alert" :
	[
		[
			{
				"showLabel" : "true",
"deleteToolTip":"Delete",
"editToolTip":"Edit Record",
"viewToolTip":"View Record",
				"label" : "profileName",
				"componentType" : "AutoCompleter",
				"name" : "profileName",
				"cfgUrl" : "services/cponseek/{0}.json",
				"itemId" : "profileNameFltId",
				"cfgSeekId" : "alertprofilenameseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
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
				"url" : "services/statusList.json",
				"cfgRootNode" : "d.filter"
			},
			{
				"showLabel" : "true",
				"label" : "module",
				"componentType" : "ComboBox",
				"itemId" : "profileModuleFltId",
				"fltParamName" : "module",
				"valueField" : "name",
				"displayField" : "value",
				"value" : "all",
				"url" : "services/moduleList.json",
				"cfgRootNode" : "d.filter"
			}
		],
		[
			{
				"showLabel" : "true",
				"label" : "category1",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "categoryCode",
				"itemId" : "profileCategoryFltId",
				"cfgSeekId" : "alertcatcodeseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "true",
				"label" : "category2",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "subCategoryCode",
				"itemId" : "profileSubCatFltId",
				"cfgSeekId" : "alertsubcatcodeseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "false",
				"label" : "search",
				"componentType" : "button"
			}
		]
	],
	"report" :
	[
		[
			{
				"showLabel" : "true",
				"label" : "profileName",
				"componentType" : "AutoCompleter",
				"name" : "profileName",
				"cfgUrl" : "services/cponseek/{0}.json",
				"itemId" : "profileNameFltId",
				"cfgSeekId" : "reportprofilenameseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
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
				"url" : "services/statusList.json",
				"cfgRootNode" : "d.filter"
			},
			{
				"showLabel" : "true",
				"label" : "module",
				"componentType" : "ComboBox",
				"itemId" : "profileModuleFltId",
				"fltParamName" : "module",
				"valueField" : "name",
				"displayField" : "value",
				"value" : "all",
				"url" : "services/moduleList.json",
				"cfgRootNode" : "d.filter"
			}
		],
		[
			{
				"showLabel" : "true",
				"label" : "category1",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "categoryCode",
				"itemId" : "profileCategoryFltId",
				"cfgSeekId" : "reportcatcodeseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "true",
				"label" : "category2",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "subCategoryCode",
				"itemId" : "profileSubCatFltId",
				"cfgSeekId" : "reportsubcatcodeseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "false",
				"label" : "search",
				"componentType" : "button"
			}
		]
	],
	"interface" :
	[
		[
			{
				"showLabel" : "true",
				"label" : "profileName",
				"componentType" : "AutoCompleter",
				"name" : "profileName",
				"cfgUrl" : "services/cponseek/{0}.json",
				"itemId" : "profileNameFltId",
				"cfgSeekId" : "interfaceprofilenameseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
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
				"url" : "services/statusList.json",
				"cfgRootNode" : "d.filter"
			},
			{
				"showLabel" : "true",
				"label" : "module",
				"componentType" : "ComboBox",
				"itemId" : "profileModuleFltId",
				"fltParamName" : "module",
				"valueField" : "name",
				"displayField" : "value",
				"value" : "all",
				"url" : "services/moduleList.json",
				"cfgRootNode" : "d.filter"
			}
		],
		[
			{
				"showLabel" : "true",
				"label" : "category1",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "categoryCode",
				"itemId" : "profileCategoryFltId",
				"cfgSeekId" : "interfacecatcodeseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "true",
				"label" : "category2",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "subCategoryCode",
				"itemId" : "profileSubCatFltId",
				"cfgSeekId" : "interfacesubcatcodeseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "false",
				"label" : "search",
				"componentType" : "button"
			}
		]
	],
	"billing" :
	[
		[
			{
				"showLabel" : "true",
				"label" : "profileName",
				"componentType" : "AutoCompleter",
				"name" : "profileName",
				"cfgUrl" : "services/cponseek/{0}.json",
				"itemId" : "profileNameFltId",
				"cfgSeekId" : "billingprofilenameseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
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
				"url" : "services/statusList.json",
				"cfgRootNode" : "d.filter"
			},
			{
				"showLabel" : "true",
				"label" : "module",
				"componentType" : "ComboBox",
				"itemId" : "profileModuleFltId",
				"fltParamName" : "module",
				"valueField" : "name",
				"displayField" : "value",
				"value" : "all",
				"url" : "services/moduleList.json",
				"cfgRootNode" : "d.filter"
			}
		],
		[
			{
				"showLabel" : "true",
				"label" : "category1",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "categoryCode",
				"itemId" : "profileCategoryFltId",
				"cfgSeekId" : "billingcatcodeseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "true",
				"label" : "category2",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "subCategoryCode",
				"itemId" : "profileSubCatFltId",
				"cfgSeekId" : "billingsubcatcodeseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "false",
				"label" : "search",
				"componentType" : "button"
			}
		]
	],
	"limit" :
	[
		[
			{
				"showLabel" : "true",
				"label" : "profileName",
				"componentType" : "AutoCompleter",
				"name" : "profileName",
				"cfgUrl" : "services/cponseek/{0}.json",
				"itemId" : "profileNameFltId",
				"cfgSeekId" : "limitprofilenameseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
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
				"url" : "services/statusList.json",
				"cfgRootNode" : "d.filter"
			},
			{
				"showLabel" : "true",
				"label" : "module",
				"componentType" : "ComboBox",
				"itemId" : "profileModuleFltId",
				"fltParamName" : "module",
				"valueField" : "name",
				"displayField" : "value",
				"value" : "all",
				"url" : "services/moduleList.json",
				"cfgRootNode" : "d.filter"
			}
		],
		[
			{
				"showLabel" : "true",
				"label" : "category1",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "categoryCode",
				"itemId" : "profileCategoryFltId",
				"cfgSeekId" : "limitcatcodeseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "true",
				"label" : "category2",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "subCategoryCode",
				"itemId" : "profileSubCatFltId",
				"cfgSeekId" : "limitsubcatcodeseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "false",
				"label" : "search",
				"componentType" : "button"
			}
		]
	],
	"cutoff" :
	[
		[
			{
				"showLabel" : "true",
				"label" : "profileName",
				"componentType" : "AutoCompleter",
				"name" : "profileName",
				"cfgUrl" : "services/cponseek/{0}.json",
				"itemId" : "profileNameFltId",
				"cfgSeekId" : "cutoffprofilenameseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
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
				"url" : "services/statusList.json",
				"cfgRootNode" : "d.filter"
			},
			{
				"showLabel" : "true",
				"label" : "module",
				"componentType" : "ComboBox",
				"itemId" : "profileModuleFltId",
				"fltParamName" : "module",
				"valueField" : "name",
				"displayField" : "value",
				"value" : "all",
				"url" : "services/moduleList.json",
				"cfgRootNode" : "d.filter"
			}
		],
		[
			{
				"showLabel" : "true",
				"label" : "category1",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "categoryCode",
				"itemId" : "profileCategoryFltId",
				"cfgSeekId" : "cutoffcatcodeseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "true",
				"label" : "category2",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "subCategoryCode",
				"itemId" : "profileSubCatFltId",
				"cfgSeekId" : "cutoffsubcatcodeseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "false",
				"label" : "search",
				"componentType" : "button"
			}
		]
	],
	"adminfeature" :
	[
		[
			{
				"showLabel" : "true",
				"label" : "profileName",
				"componentType" : "AutoCompleter",
				"name" : "profileName",
				"cfgUrl" : "services/cponseek/{0}.json",
				"itemId" : "profileNameFltId",
				"cfgSeekId" : "adminprofilenameseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
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
				"url" : "services/statusList.json",
				"cfgRootNode" : "d.filter"
			},
			{
				"showLabel" : "false",
				"label" : "search",
				"componentType" : "button"
			}
		]
	],
	"typecode" :
	[
		[
			{
				"showLabel" : "true",
				"label" : "profileName",
				"componentType" : "AutoCompleter",
				"name" : "profileName",
				"cfgUrl" : "services/cponseek/{0}.json",
				"itemId" : "profileNameFltId",
				"cfgSeekId" : "typecodeprofilenameseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
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
				"url" : "services/statusList.json",
				"cfgRootNode" : "d.filter"
			}
		],
		[
			{
				"showLabel" : "true",
				"label" : "category1",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "categoryCode",
				"itemId" : "profileCategoryFltId",
				"cfgSeekId" : "typecodecatcodeseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "true",
				"label" : "category2",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "subCategoryCode",
				"itemId" : "profileSubCatFltId",
				"cfgSeekId" : "typecodesubcatcodeseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
			},
			{
				"showLabel" : "false",
				"label" : "search",
				"componentType" : "button"
			}
		]
	],
	"brfeature" :
	[
		[
			{
				"showLabel" : "true",
				"label" : "profileName",
				"componentType" : "AutoCompleter",
				"name" : "profileName",
				"cfgUrl" : "services/cponseek/{0}.json",
				"itemId" : "profileNameFltId",
				"cfgSeekId" : "brfeatureprofilenameseek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
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
				"url" : "services/statusList.json",
				"cfgRootNode" : "d.filter"
			},
			{
				"showLabel" : "false",
				"label" : "search",
				"componentType" : "button"
			}
		]
	],
	"paymentWorkflow" :
	[
		[
			{
				"showLabel" : "true",
				"label" : "profileName",
				"componentType" : "AutoCompleter",
				"name" : "profileName",
				"cfgUrl" : "services/cponseek/{0}.json",
				"itemId" : "profileNameFltId",
				"cfgSeekId" : "paymentWorkflowProfileNameSeek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
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
				"url" : "services/statusList.json",
				"cfgRootNode" : "d.filter"
			}
		],
		[
			{
				"showLabel" : "true",
				"label" : "category1",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "categoryCode",
				"itemId" : "profileCategoryFltId",
				"cfgSeekId" : "paymentWorkflowCatCodeSeek",
				"cfgRootNode" : "d.filter",
				"cfgKeyNode" : "name",
				"cfgDataNode1" : "value"
			},
			{
				"showLabel" : "true",
				"label" : "category2",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "subCategoryCode",
				"itemId" : "profileSubCatFltId",
				"cfgSeekId" : "paymentWorkflowSubCatCodeSeek",
				"cfgRootNode" : "d.filter",
				"cfgKeyNode" : "name",
				"cfgDataNode1" : "value"
			},
			{
				"showLabel" : "false",
				"label" : "search",
				"componentType" : "button"
			}
		]
	],
	"systemBene" :
	[
		[
			{
				"showLabel" : "true",
				"label" : "profileName",
				"componentType" : "AutoCompleter",
				"name" : "profileName",
				"cfgUrl" : "services/cponseek/{0}.json",
				"itemId" : "profileNameFltId",
				"cfgSeekId" : "systemBeneProfileNameSeek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
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
				"url" : "services/statusList.json",
				"cfgRootNode" : "d.filter"
			}
		],
		[
			{
				"showLabel" : "true",
				"label" : "category1",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "categoryCode",
				"itemId" : "profileCategoryFltId",
				"cfgSeekId" : "systemBeneCatCodeSeek",
				"cfgRootNode" : "d.filter",
				"cfgKeyNode" : "name",
				"cfgDataNode1" : "value"
			},
			{
				"showLabel" : "true",
				"label" : "category2",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "subCategoryCode",
				"itemId" : "profileSubCatFltId",
				"cfgSeekId" : "systemBeneSubCatCodeSeek",
				"cfgRootNode" : "d.filter",
				"cfgKeyNode" : "name",
				"cfgDataNode1" : "value"
			},
			{
				"showLabel" : "false",
				"label" : "search",
				"componentType" : "button"
			}
		]
	],
	"fxSpread" :
	[
		[
			{
				"showLabel" : "true",
				"label" : "profileName",
				"componentType" : "AutoCompleter",
				"name" : "profileName",
				"cfgUrl" : "services/cponseek/{0}.json",
				"itemId" : "profileNameFltId",
				"cfgSeekId" : "fxSpreadProfileNameSeek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
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
				"url" : "services/statusList.json",
				"cfgRootNode" : "d.filter"
			}
		],
		[
			{
				"showLabel" : "true",
				"label" : "category1",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "categoryCode",
				"itemId" : "profileCategoryFltId",
				"cfgSeekId" : "fxSpreadCatCodeSeek",
				"cfgRootNode" : "d.filter",
				"cfgKeyNode" : "name",
				"cfgDataNode1" : "value"
			},
			{
				"showLabel" : "true",
				"label" : "category2",
				"componentType" : "AutoCompleter",
				"cfgUrl" : "services/cponseek/{0}.json",
				"name" : "subCategoryCode",
				"itemId" : "profileSubCatFltId",
				"cfgSeekId" : "fxSpreadSubCatCodeSeek",
				"cfgRootNode" : "d.filter",
				"cfgKeyNode" : "name",
				"cfgDataNode1" : "value"
			},
			{
				"showLabel" : "false",
				"label" : "search",
				"componentType" : "button"
			}
		]
	],
	"paymentFeature" :
	[
		[
			{
				"showLabel" : "true",
				"label" : "profileName",
				"componentType" : "AutoCompleter",
				"name" : "profileName",
				"cfgUrl" : "services/cponseek/{0}.json",
				"itemId" : "profileNameFltId",
				"cfgSeekId" : "paymentFeatureProfileNameSeek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
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
				"url" : "services/statusList.json",
				"cfgRootNode" : "d.filter"
			},
			{
				"showLabel" : "false",
				"label" : "search",
				"componentType" : "button"
			}
		]
	],
	"paymentPackage" :
	[
		[
			{
				"showLabel" : "true",
				"label" : "profileName",
				"componentType" : "AutoCompleter",
				"name" : "profileName",
				"cfgUrl" : "services/cponseek/{0}.json",
				"itemId" : "profileNameFltId",
				"cfgSeekId" : "paymentPackageProfileNameSeek",
				"cfgRootNode" : "d.filter",
				"cfgDataNode1" : "name"
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
				"url" : "services/statusList.json",
				"cfgRootNode" : "d.filter"
			}
		],
		[
			{
				"showLabel" : "true",
				"label" : "type",
				"componentType" : "ComboBox",
				"itemId" : "profileModuleFltId",
				"fltParamName" : "type",
				"valueField" : "name",
				"displayField" : "value",
				"value" : "all",
				"url" : "services/statusList.json",
				"cfgRootNode" : "d.filter"
			},
			{
				"showLabel" : "false",
				"label" : "search",
				"componentType" : "button"
			}
		]
	],
"newFormField":"Add New Form Field",
"lbl.messageForm.FormFields":"Form Fields",
"action":"Action",
"name":"Name",
"mandatory":"Mandatory",
"fieldMinLength":"Field Min Length",
"fieldMaxLength":"Field Max Length",
"sequence":"Sequence",
"type":"Type",
"fieldDisclaimerText":"Field Disclaimer Text",
"createNewDesc":"Create New Destination",
"destName":"Destination Name",
"selectRoles":"Select Roles",
"lblRoleDesc":"Role Description",
"lblRole":"Role",
"cancel":"Cancel",
"btnSave":"Save"
}
