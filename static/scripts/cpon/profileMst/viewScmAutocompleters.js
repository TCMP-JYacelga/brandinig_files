var objScmProductAutoCompleter = null;
Ext.Loader.setConfig({
			enabled : true,
			disableCaching : false,
			setPath : {
				'Ext' : 'static/js/extjs4.2.1/src',
				'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
			}
		});

Ext.application({
			name : 'GCP',
			appFolder : 'static/scripts/cpon/profileMst/app',
			// appFolder : 'app',
			controllers : [],
			requires : ['Ext.ux.gcp.AutoCompleter'],
			launch : function() {
				if (MODE == 'ADD') {
					objScmProductAutoCompleter = Ext.create(
							'Ext.ux.gcp.AutoCompleter', {
								padding : '1 0 0 0',
								width: screen.width > 1024 ? 208 : 224,
								fieldCls : 'xn-form-text xn-suggestion-box',
								name : 'name',
								itemId : 'scmProductFilter',
								cfgUrl : 'cpon/cponseek/{0}.json',
								cfgProxyMethodType : 'POST',
								cfgQueryParamName : 'qfilter',
								cfgRecordCount : -1,
								cfgSeekId : 'scmproductseek',
								cfgRootNode : 'd.filter',
								cfgDataNode1 : 'name',
								cfgKeyNode : 'value',
								minChars : 1,
								renderTo : 'scmProductDiv'
							});

					objScmProductAutoCompleter.on('collapse', function() {
								if (objScmProductAutoCompleter.valueModels) {
									var pcode = objScmProductAutoCompleter
											.getValue();
									productCode = pcode;
									$('#productCode').val(productCode);
								}
							});
				}
			}
		});
