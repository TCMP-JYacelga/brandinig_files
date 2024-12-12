var strQry = '';
Ext.define('Ext.ux.gcp.AutoCompleter', {
	extend : 'Ext.form.field.ComboBox',
	xtype : 'AutoCompleter',
	itemId : 'autoComplete',
	fieldCls : 'xn-form-text w24 xn-suggestion-box',
	triggerBaseCls : 'xn-form-trigger',
	editable : true,
	cfgTplCls : null,
	cfgStoreFields : null,
	cfgUrl : 'services/userseek/{0}.json',
	cfgQueryParamName : 'autofilter',
	cfgRecordCount : 10,
	cfgSeekId : null,
	cfgRootNode : null,
	cfgProxyMethodType : null,
	enableQueryParam : true,
	/**
	 * @cfg {String} cfgDelimiter is used for seprating cfgDataNodes
	 */
	cfgDelimiter : '',
	/**
	 * @cfg {Array} cfgExtraParams arra of json for extra query params e.g [{key :
	 *      'code', value : 'value'}]
	 */
	cfgExtraParams : null,
	/**
	 * @cfg {String} cfgDataNode1 predefined field name
	 */
	cfgDataNode1 : null,
	/**
	 * @cfg {String} cfgDataNode2 predefined field name
	 */
	cfgDataNode2 : null,
	/**
	 * @cfg {String} cfgDataNode3 predefined field name
	 */
	cfgDataNode3 : null,
	/**
	 * @cfg {String} cfgDataNode4 predefined field name
	 */
	cfgDataNode4 : null,
	/**
	 * @cfg {String} cfgKeyNode predefined field name
	 */
	cfgKeyNode : null,
	displayfieldIndex : null,
	/**
	 * @cfg {String} store store assigned to this component
	 */
	store : null,
	/**
	 * @cfg {number} width width of component in pixels.
	 */
	width : 'auto',
	/**
	 * @cfg {Boolean} typeAhead `true` to populate and autoselect the remainder
	 *      of the text being typed after a configurable delay
	 */
	typeAhead : false,
	/**
	 * @cfg {Number} queryDelay The length of time in milliseconds to delay
	 *      between the start of typing and sending the query to filter the
	 *      dropdown list.
	 */
	queryDelay : 2000,
	/**
	 * @cfg {String} queryMode The mode in which the ComboBox uses the
	 *      configured Store. Acceptable values are: - **`'remote'`** :
	 * 
	 * In `queryMode: 'remote'`, the ComboBox loads its Store dynamically based
	 * upon user interaction. - **`'local'`** :
	 * 
	 * ComboBox loads local data
	 * 
	 * var combo = new Ext.form.field.ComboBox({ renderTo: document.body,
	 * queryMode: 'local', store: new Ext.data.ArrayStore({ id: 0, fields: [
	 * 'myId', // numeric value is the key 'displayText' ], data: [[1, 'item1'],
	 * [2, 'item2']] // data is local }), valueField: 'myId', displayField:
	 * 'displayText', triggerAction: 'all' });
	 */
	queryMode : 'remote',
	/**
	 * @cfg {String} triggerAction The action to execute when the trigger is
	 *      clicked.
	 * 
	 */
	triggerAction : 'all',
	/**
	 * @cfg {Number} minChars The minimum number of characters the user must
	 *      type before autocompleter fires request.
	 * 
	 * Defaults to `4` if queryMode = 'remote' or `0` if queryMode = 'local',
	 * does not apply if Ext.form.field.Trigger editable = false.
	 */
	minChars : 1,
	/**
	 * @cfg {Boolean} hideTrigger true to hide the trigger element and display
	 *      only the base text field
	 */
	hideTrigger : true,
	/**
	 * @cfg {boolean} matchFieldWidth Wheather to match dropdown width to combo
	 *      width, defaults to true
	 */
	matchFieldWidth : false,
	/**
	 * @cfg {boolean} enableKeyEvents Wheather to enable key events, defaults to
	 *      false
	 */
	enableKeyEvents : true,
	/**
	 * @cfg {boolean} isQuickQuery Decides wheather to fire query immediately
	 *      defaults to false
	 */
	isQuickQuery : false,
	/**
	 * @cfg {string} emptyText Empty text for the field
	 */
	emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
	/**
	 * @cfg {Boolean} [queryCaching=true] When true, this prevents the combo
	 *      from re-querying (either locally or remotely) when the current query
	 *      is the same as the previous query.
	 */
	queryCaching : false,
	/**
	 * @cfg {Boolean} [fitToParent=true] When true, this will fit the listConfig
	 *  width to value given in width config.
	 */
	fitToParent : false,
	
	autoSelect : false,
	
	initComponent : function() {
		var arrayField = [];
		var me = this;
		me.cancelQueryFlag = false;
		if (!Ext.isEmpty(me.cfgStoreFields))
			arrayField = me.cfgStoreFields;
		else {
			if (!Ext.isEmpty(me.cfgDataNode1))
				arrayField.push(me.cfgDataNode1);
			if (!Ext.isEmpty(me.cfgDataNode2))
				arrayField.push(me.cfgDataNode2);
			if (!Ext.isEmpty(me.cfgDataNode3))
				arrayField.push(me.cfgDataNode3);
			if (!Ext.isEmpty(me.cfgDataNode4))
				arrayField.push(me.cfgDataNode4);
			if (!Ext.isEmpty(me.cfgKeyNode))
				arrayField.push(me.cfgKeyNode);
		}
		if(!Ext.isEmpty(me.displayfieldIndex))
		{			
			me.displayField = arrayField[me.displayfieldIndex];
		}
		else
		me.displayField = me.cfgDataNode1;
		
		if (!Ext.isEmpty(me.cfgKeyNode))
			me.valueField = me.cfgKeyNode;
		else
			me.valueField = me.cfgDataNode1;
		var strUrl = Ext.String.format(me.cfgUrl, me.cfgSeekId);
		me.store = Ext.create('Ext.data.Store', {
					fields : arrayField,
					proxy : {
						type : 'ajax',
						autoLoad : true,
						url : strUrl,
						noCache : false,
						pageParam : false, // to remove param "page"
						startParam : false, // to remove param "start"
						limitParam : false, // to remove param "limit"
						queryParam : false, // to remove param "query"
						reader : {
							type : 'json',
							root : me.cfgRootNode
						},
						actionMethods : {
							read : !Ext.isEmpty(me.cfgProxyMethodType)
									? me.cfgProxyMethodType
									: 'GET'
						}
					}
				});
		if (Ext.isEmpty(me.cfgTplCls)) {
			me.cfgTplCls = "xn-autocompleter";
		}
		if (Ext.isEmpty(me.cfgDelimiter)) {
			me.cfgDelimiter = " ";
		}
		me.listConfig = {
			loadingText : getLabel('suggestionBoxLoadingText', 'Searching...'),
			emptyText : getLabel('suggestionBoxEmptyText', 'No match found.'),
			ptScope : me,
			cls : me.cfgTplCls,
			getInnerTpl : function(displayString) {
				return me.handleInnerTpl(me.getValue());;
			}

		}
		if(me.fitToParent === true)
   			me.listConfig.width = me.width;	
		me.on('beforequery', me.handleBeforeQuery);
		me.on('keyup', function(combo, e) {
			var keyCode = e.keyCode || e.which;
			var strValue = combo.getValue();
			if(keyCode == 32) {
				combo.setValue((strValue != null)?strValue + ' ' : ' ');
			}
			if (!Ext.isEmpty(strValue)
					&& ((e.shiftKey && keyCode === 53) || (keyCode === 53 && strValue
							.indexOf('%') >= 0))) {
				if(strValue.indexOf('%') === 0)
					strValue = strValue.replace(/[%]/g, "");
				combo.suspendEvents();
				combo.setValue(strValue);
				combo.resumeEvents();
				combo.isQuickQuery = true;
				combo.cancelQueryFlag = false;
				combo.doQuery(strValue, true);
				combo.cancelQueryFlag = true;
			}
		});
		
		me.on('change', function (combo, newValue, oldValue, eOpts) {
			if(!Ext.isEmpty(newValue) && newValue.length >= combo.minChars) {
				if(combo.isExpanded) combo.collapse();
			} else if(Ext.isEmpty(newValue) && !Ext.isEmpty(oldValue) && oldValue.indexOf('%') === -1) {
				if(combo.isExpanded) combo.collapse();
			}
			if(!Ext.isEmpty(newValue) && !Ext.isEmpty(oldValue) && newValue.indexOf('%') === -1 && oldValue.indexOf('%') === -1) {
				combo.cancelQueryFlag = false;
			}
		});
		me.callParent(arguments);
	},
	/**
	 * Formats the dropdown fields display.
	 * 
	 * @return {String} returns formated template
	 */
	handleInnerTpl : function(strInput) {
		var me = this;
		var strRet = '';

		var strTpl1 = '<ol>' + '<ul title="{[Ext.String.htmlEncode(values.{0})]}">{[values.{0}]}</ul> </ol>';

		var strTpl2 = '<ol>' + '<ul title="{[Ext.String.htmlEncode(values.{0})]}">{[values.{0}]}</ul>'
				+ me.cfgDelimiter
				+ '<ul title="{[Ext.String.htmlEncode(values.{1})]}">{[values.{1}]}</ul></ol>';

		var strTpl3 = '<ol>' + '<ul title="{[Ext.String.htmlEncode(values.{0})]}">{[values.{0}]}</ul>'
				+ me.cfgDelimiter + '<ul title="{[Ext.String.htmlEncode(values.{1})]}">{[values.{1}]}</ul>'
				+ me.cfgDelimiter
				+ '<ul title="{[Ext.String.htmlEncode(values.{2})]}">{[values.{2}]}</ul></ol>';

		var strTpl4 = '<ol>' + '<ul title="{[Ext.String.htmlEncode(values.{0})]}">{[values.{0}]}</ul>'
				+ me.cfgDelimiter + '<ul title="{[Ext.String.htmlEncode(values.{1})]}">{[values.{1}]}</ul>'
				+ me.cfgDelimiter + '<ul title="{[Ext.String.htmlEncode(values.{2})]}">{[values.{2}]}</ul>'
				+ me.cfgDelimiter
				+ '<ul title="{[Ext.String.htmlEncode(values.{3})]}">{[values.{3}]}</ul></ol>';

		var dataField = [];
		var str1 = '', str2 = '', str3 = '', str4 = '';
		if (!Ext.isEmpty(me.cfgDataNode1))
			dataField.push(me.cfgDataNode1);
		if (!Ext.isEmpty(me.cfgDataNode2))
			dataField.push(me.cfgDataNode2);
		if (!Ext.isEmpty(me.cfgDataNode3))
			dataField.push(me.cfgDataNode3);
		if (!Ext.isEmpty(me.cfgDataNode4))
			dataField.push(me.cfgDataNode4);

		if (dataField && dataField.length > 0) {
			switch (dataField.length) {
				case 1 :
					str1 = dataField[0];
					strRet = Ext.String.format(strTpl1, str1);
					break;
				case 2 :
					str1 = dataField[0];
					str2 = dataField[1];
					strRet = Ext.String.format(strTpl2, str1, str2);
					break;
				case 3 :
					str1 = dataField[0];
					str2 = dataField[1];
					str3 = dataField[2];
					strRet = Ext.String.format(strTpl3, str1, str2, str3);
					break;
				case 4 :
					str1 = dataField[0];
					str2 = dataField[1];
					str3 = dataField[2];
					str4 = dataField[3];
					strRet = Ext.String.format(strTpl4, str1, str2, str3, str4);
					break;
			}
		}
		return strRet;
	},
	handleBeforeQuery : function(queryEvent) {
		var me = this;
		var combo = queryEvent.combo;
		if(!Ext.isEmpty(me.cancelQueryFlag)) queryEvent.cancel = me.cancelQueryFlag;
		strQry = me.getValue();
		var strUrl = null, strQuery = encodeURIComponent(queryEvent.query), objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
		if (combo.isQuickQuery || !Ext.isEmpty(queryEvent.query)) {
			strUrl = me.generateUrl(strQuery);
			if (me.enableQueryParam === false) {
				while (arrMatches = strRegex.exec(strUrl)) {
					objParam[arrMatches[1]] = decodeURIComponent(arrMatches[2]);
				}
				strGeneratedUrl = strUrl.substring(0, strUrl.indexOf('?'));
				strUrl = strGeneratedUrl;
				me.store.proxy.paramsAsJson = true;
				me.store.proxy.extraParams = objParam;
			}
			me.store.proxy.url = strUrl;
			combo.isQuickQuery = false;
		} else {
			return false;
		}
	},
	// Can be overriden
	generateUrl : function(strQuery) {
		var me = this;
		var strUrl = Ext.String.format(me.cfgUrl, me.cfgSeekId);
		if (strQuery)
			strUrl += Ext.String.format('?$top={0}&{1}={2}', me.cfgRecordCount,
					me.cfgQueryParamName, strQuery);
		else
			strUrl += Ext.String.format('?$top={0}', me.cfgRecordCount);
		if (!Ext.isEmpty(me.cfgExtraParams) && me.cfgExtraParams.length > 0) {
			Ext.each(me.cfgExtraParams, function(param) {
				strUrl += Ext.String.format('&{0}={1}', param.key, param.value);
			});

		}
		return strUrl;
	}
});
/**
 * Highlights the input string in the response.
 * 
 * @param {String}
 *            strInput the string in which input string is to be found n
 *            highlighted.
 * @returns {String} strInput Input highlighted string.
 */
function handleHighlight(strInput) {
	strInput = Ext.util.Format.htmlEncode(strInput);
	if (!Ext.isEmpty(strInput) && !Ext.isEmpty(strQry)) {
		var matchingString = strInput.match(new RegExp(strQry, 'i'));
		if(!Ext.isEmpty(matchingString)) {
			return (strInput).replace(new RegExp(matchingString, 'ig'), function(strMatch) {
				return "<em>" + strMatch + "</em>"
			});
		} else {
			return strInput;
       } 
	}
	else {
              //console.log(strInput);          
		return strInput;
	}
}