/**
 * @class GCP.view.BankAdminCategoryView
 * @extends Ext.window.Window
 * @author Nilesh Shinde
 */

Ext.define( 'GCP.view.BankAdminPrivilegeView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'bankAdminPrivilegeViewPopupType',
	width : 700,
	height : 400,
//	resizable : false,
	//title : 'Bank Admin Privileges',
	//layout : 'fit',
//	overflowY : 'auto',
	config :
	{
	//	layout : 'fit',
		modal : true,
		resizable:false,
		draggable : false,
		closeAction : 'hide',
		autoScroll : true,
		fnCallback : null,
		profileId : null,
		featureType : null,
		module : null,
		title : null,
		tcwAdminPrivileges : null,
		tciAdminPrivileges : null,
		servicesImgIds : [],
		servicesHeaderIds : [],
		accessTypesImgIds : [],
		accessTypesHeaderIds : [],
		accessTypesSectionIds : [],
		tciServicesImgIds : [],
		tciServicesHeaderIds : [],
		tciAccessTypesImgIds : [],
		tciAccessTypesHeaderIds : [],
		tciAccessTypesSectionIds : [],
		menuMode : null
	},

	listeners :
	{
		show : function()
		{
			this.showCheckedSection();
			//this.render();
		}
	},

	/*getBankAdminMenuList : function( accessType )
	{
		var me = this;
		var menuData;

		var strUrl = 'getBankAdminMenuList.srvc?';
		
		var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
		
		strUrl = strUrl + '$accessType=' + accessType;
		strUrl = strUrl + "&" +'$menuMode=' + me.menuMode;
		strUrl = strUrl + '&' + csrfTokenName + '=' + csrfTokenValue;
         while (arrMatches = strRegex.exec(strUrl)) {
					objParam[arrMatches[1]] = arrMatches[2];
				}
		var strGeneratedUrl = strUrl.substring(0, strUrl.indexOf('?'));
				strUrl = strGeneratedUrl;

		Ext.Ajax.request(
		{
			url : strUrl,
			method : 'POST',
			async : false,
			params:objParam,
			success : function( response )
			{
				menuData = Ext.JSON.decode( response.responseText );
				return menuData;
			},
			failure : function()
			{
				var errMsg = "";
				Ext.MessageBox.show(
				{
					title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
					msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				} );
			}
		} );
		return menuData;
	},

	loadFeaturs : function( accessType, moduleCode, accessTypeCode )
	{
		var me = this;
		var featureData;
      var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
		var strUrl = 'getBankAdminPrevilegeList.srvc?';
		strUrl = strUrl + "$accessType=" + accessType;
		strUrl = strUrl + "&" + "$moduleCode=" + moduleCode;
		strUrl = strUrl + "&" + "$menuMode=" + me.menuMode;
		strUrl = strUrl + "&" + "$accessTypeCode=" + accessTypeCode;
		strUrl = strUrl + "&" + "$viewState=" + encodeURIComponent( viewState );
		strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;
        while (arrMatches = strRegex.exec(strUrl)) {
					objParam[arrMatches[1]] = arrMatches[2];
				}
		var strGeneratedUrl = strUrl.substring(0, strUrl.indexOf('?'));
				strUrl = strGeneratedUrl;
		Ext.Ajax.request(
		{
			url : strUrl,
			method : 'POST',
			async : false,
			params:objParam,
			success : function( response )
			{
				featureData = Ext.JSON.decode( response.responseText );
				return featureData;
			},
			failure : function()
			{
				var errMsg = "";
				Ext.MessageBox.show(
				{
					title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
					msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				} );
			}
		} );
		return featureData;
	},*/

	filterFeatures : function( data, subsetCode )
	{
		var allFeatures = new Ext.util.MixedCollection();
		allFeatures.addAll( data );
		var featureFilter = new Ext.util.Filter(
		{
			filterFn : function( item )
			{
				//console.log( 'item.rmSerial= ' + item.rmSerial );
				//return item.rmDescription == subsetCode;
				return true;
			}
		} );
		var featurs = allFeatures.filter( featureFilter );
		return featurs.items;
	},

	getBooleanvalue : function( strValue )
	{
		if( strValue == 'Y' || strValue == true )
		{
			return true;
		}
		else
		{
			return false;
		}
	},

	setColumnHeader : function()
	{
		var featureItems = [];
		featureItems.push(
		{
			xtype : 'label',
			columnWidth : 0.40,
			text : getLabel("type","Type"),
			padding : '0 0 0 0',
			cls : 'panelHeaderText background'
		} );
		featureItems.push(
		{
			xtype : 'label',
			columnWidth : 0.20,
			text : getLabel("view","View"),
			padding : '0 0 0 5',
			cls : 'panelHeaderText background'
		} );
		featureItems.push(
		{
			xtype : 'label',
			columnWidth : 0.20,
			text : getLabel('edit','Edit'),
			padding : '0 0 0 5',
			cls : 'panelHeaderText background'
		} );
		featureItems.push(
		{
			xtype : 'label',
			columnWidth : 0.20,
			text :getLabel('auth','Auth'),
			padding : '0 0 0 5',
			cls : 'panelHeaderText background'
		} );
		return featureItems;
	},

	setPanelHeader : function( id, title, moduleCode )
	{
		var me = this;
		var featureItems = [];
		featureItems.push(
		{
			xtype : 'label',
			columnWidth : 0.40,
			text : title,
			padding : '5 0 0 10',
			cls : 'panelHeaderText'
		} );
		featureItems.push(
		{
			xtype : 'button',
			columnWidth : 0.20,
			icon : "./static/images/icons/icon_uncheckmulti.gif",
			margin : '2 5 2 60',
			width : 10,
			height : 21,
			itemId : id + "_viewIcon",
			border : 0,
			cls : 'btn-header',
			handler : function( btn, e, opts )
			{
				me.changeHeaderIcon( btn, moduleCode, "VIEW" );
			}
		} );
		featureItems.push(
		{
			xtype : 'button',
			columnWidth : 0.20,
			icon : "./static/images/icons/icon_uncheckmulti.gif",
			margin : '2 5 2 115',
			width : 15,
			height : 21,
			itemId : id + "_editIcon",
			border : 0,
			cls : 'btn-header',
			handler : function( btn, e, opts )
			{
				me.changeHeaderIcon( btn, moduleCode, "EDIT" );
			}
		} );
		featureItems.push(
		{
			xtype : 'button',
			columnWidth : 0.20,
			icon : "./static/images/icons/icon_uncheckmulti.gif",
			margin : '2 5 2 115',
			width : 15,
			height : 21,
			itemId : id + "_authIcon",
			border : 0,
			cls : 'btn-header',
			handler : function( btn, e, opts )
			{
				me.changeHeaderIcon( btn, moduleCode, "AUTH" );
			}
		} );
		return featureItems;
	},

	setSubPanelHeader : function( id, title, moduleCode, accessTypeCode )
	{
		var me = this;
		var featureItems = [];
		featureItems.push(
		{
			xtype : 'label',
			columnWidth : 0.40,
			text : title,
			padding : '5 0 0 20',
			cls : 'subPanelHeaderText'
		} );
		featureItems.push(
		{
			xtype : 'button',
			columnWidth : 0.20,
			icon : "./static/images/icons/icon_uncheckmulti.gif",
			margin : '2 5 2 60',
			width : 10,
			height : 21,
			itemId : id + "_viewIcon",
			border : 0,
			cls : 'btn',
			text : moduleCode + "-"+accessTypeCode,
			handler : function( btn, e, opts )
			{
				me.changeSubHeaderIcon( btn, moduleCode, accessTypeCode, "VIEW" );
			}
		} );
		featureItems.push(
		{
			xtype : 'button',
			columnWidth : 0.20,
			icon : "./static/images/icons/icon_uncheckmulti.gif",
			margin : '2 5 2 115',
			width : 15,
			height : 21,
			itemId : id + "_editIcon",
			border : 0,
			cls : 'btn',
			text : moduleCode + "-"+accessTypeCode,
			handler : function( btn, e, opts )
			{
				me.changeSubHeaderIcon( btn, moduleCode, accessTypeCode, "EDIT" );
			}
		} );
		featureItems.push(
		{
			xtype : 'button',
			columnWidth : 0.20,
			icon : "./static/images/icons/icon_uncheckmulti.gif",
			margin : '2 5 2 115',
			width : 15,
			height : 21,
			itemId : id + "_authIcon",
			border : 0,
			cls : 'btn',
			text : moduleCode + "-"+accessTypeCode,
			handler : function( btn, e, opts )
			{
				me.changeSubHeaderIcon( btn, moduleCode, accessTypeCode, "AUTH" );
			}
		} );
		return featureItems;
	},

	setPriviligeMenu : function( feature, MODE )
	{
		var me = this;
		var obj = new Object();
		if( MODE == 'VIEW' )
		{
			var i = !this.getBooleanvalue( feature.rmForView );
			//obj.hidden = !this.getBooleanvalue(feature.rmForView);
			obj.checked = this.getBooleanvalue( feature.canView );
		}
		else if( MODE == 'EDIT' )
		{
			var i = !this.getBooleanvalue( feature.rmForEdit );
			//obj.hidden = !this.getBooleanvalue(feature.rmForEdit);
			obj.checked = this.getBooleanvalue( feature.canEdit );
		}
		else if( MODE == 'AUTH' )
		{
			var i = !this.getBooleanvalue( feature.rmForAuth );
			//obj.hidden = !this.getBooleanvalue(feature.rmForAuth);
			obj.checked = this.getBooleanvalue( feature.canAuth );
		}
		if( i === false )
		{
			obj.xtype = "checkbox";
			obj.cls = 'cellContent';
		}
		else
		{
			obj.xtype = "label";
			obj.text = ".";
			obj.cls = 'whitetext';
			//obj.hidden = true;
		}
		obj.columnWidth = '0.20';
		obj.padding = '0 0 0 0';
		obj.itemId = feature.rmSerial + "_" + feature.rmWeight + "_" + MODE;
		obj.rmWeight = feature.rmWeight;
		obj.moduleCode = feature.moduleCode;
		obj.accessTypeCode = feature.accessTypeCode;
		obj.mode = MODE;
		obj.rmSerial = feature.rmSerial;
		obj.border = 1;
		if( null != obj.checked && undefined != obj.checked )
		{
			obj.defVal = obj.checked;
		}
		if( pageMode === "VIEW" || pageMode === "verifySubmit" )
		{
			obj.readOnly = true;
		}

		if( pageMode === "EDIT" )
		{
			obj.handler = function( btn, e, opts )
			{
				me.checkRowIcon( btn, MODE, feature.rmSerial, feature.rmWeight );
			}
		}

		fieldJson.push( obj );
		return obj;
	},

	setMenuRow : function( moduleCode, accessTypeCode )
	{
		var self = this;
		var menuPrivileges;
		var featureItems = [];
		if(self.menuMode === 'CI')
			menuPrivileges = self.tciAdminPrivileges;
		else
			menuPrivileges = self.tcwAdminPrivileges;
		Ext.each( menuPrivileges, function( feature, index )
		{
			if( feature.moduleCode == moduleCode && feature.accessTypeCode == accessTypeCode )
			{
			var panel = Ext.create( 'Ext.panel.Panel',
			{
				columnWidth : 1,
				layout : 'column',
				bodyStyle :
				{
					background : ' #FAFAFA '
				}
			} );

			panel.insert(
			{
				xtype : 'label',
				columnWidth : 0.40,
				//text : feature.rmDescription,
				text : getLabel(feature.tciRmParent,feature.rmDescription),
				padding : '5 0 0 30'
			} );

			panel.insert( self.setPriviligeMenu( feature, "VIEW" ) );
			panel.insert( self.setPriviligeMenu( feature, "EDIT" ) );
			panel.insert( self.setPriviligeMenu( feature, "AUTH" ) );
			featureItems.push( panel );
			}
		} );

		return featureItems;
	},

	showCheckedSection : function()
	{
		var me = this;
		var chkServicesImgId = null;
		var chkaccessTypesImgId = null;
		var headerId = null;
		var headerImgId = null;
		var subHeaderId = null;
		var subHeaderImgId = null;
		var sectionId = null;

		/*
		 * Check for check/uncheck of Access Types checkboxes
		 */

		for( var i = 0 ; i < me.accessTypesImgIds.length ; i++ )
		{
			subHeaderImgId = me.accessTypesImgIds[ i ];
			chkaccessTypesImgId = document.getElementById( "chkAccessTypesImg_" + subHeaderImgId );

			subHeaderId = Ext.getCmp( me.accessTypesHeaderIds[ i ] );
			subHeaderId.show();
			sectionId = Ext.getCmp( me.accessTypesSectionIds[ i ] );
			sectionId.show();

			if( chkaccessTypesImgId.src.indexOf( "icon_unchecked.gif" ) > -1 )
			{
				subHeaderId.hide();
				sectionId.hide();
			}
		}

		/*
		 * Check for check/uncheck of Services checkboxes
		 */
		for( var i = 0 ; i < me.servicesImgIds.length ; i++ )
		{
			headerImgId = me.servicesImgIds[ i ];
			chkServicesImgId = document.getElementById( "chkServicesImg_" + headerImgId );

			headerId = Ext.getCmp( me.servicesHeaderIds[ i ] );
			headerId.show();

			if( chkServicesImgId.src.indexOf( "icon_unchecked.gif" ) > -1 )
			{
				headerId.hide();
				for( var j = 0 ; j < me.accessTypesImgIds.length ; j++ )
				{
					subHeaderId = Ext.getCmp( me.accessTypesHeaderIds[ j ] );
					sectionId = Ext.getCmp( me.accessTypesSectionIds[ j ] );
					if( subHeaderId.id.indexOf( headerImgId ) > -1 )
					{
						subHeaderId.hide();
						sectionId.hide();
					}
				}
			}
		}

	},

	getPanelItems : function()
	{
		var me = this;
		var item;
		var menuItems = [];
		var menuData = null;
		var moduleCode = -1;
		var accessTypeCode = -1;
		var headerId = null;
		var headerName = null;
		var subHeaderId = null;
		var subHeaderName = null;
		var sectionId = null;
		var servicesCount = -1;
		var accessTypesCount = -1;

		// insert item for main header
	/*	item =
		{
			xtype : 'panel',
			id : 'columnHeader',
			layout : 'column',
			cls : 'alignCenter',
			margin : '5 5 5 5',
			padding : '5 5 5 5',
			items : me.setColumnHeader()
		};
		menuItems.push( item );*/

		// get module menus
		me.menuMode = 'CW';
		menuData = menuDataa;
		Ext.each( menuData, function( moduleAccessMenu, index )
		{
			if(moduleAccessMenu.rmaccesstype === 'A' && Ext.isEmpty(moduleAccessMenu.formId) && Ext.isEmpty(moduleAccessMenu.typeId))
			{
			// if same level module menu
			if( moduleCode == moduleAccessMenu.moduleCode )
			{
				if( accessTypeCode == moduleAccessMenu.accessTypeCode )
				{
					// this case will not come
				}
				else
				{
					accessTypesCount++;
					accessTypeCode = moduleAccessMenu.accessTypeCode;
					subHeaderName = moduleAccessMenu.accessTypeName;
					subHeaderId = moduleAccessMenu.moduleCode + moduleAccessMenu.moduleName
						+ moduleAccessMenu.accessTypeCode + moduleAccessMenu.accessTypeName + me.menuMode + 'SubHeader';

					me.accessTypesImgIds[ accessTypesCount ] = accessTypeCode + subHeaderName;
					me.accessTypesHeaderIds[ accessTypesCount ] = subHeaderId;
					// insert item for sub panel header
					item =
					{
						xtype : 'panel',
						id : subHeaderId,
						layout : 'column',
						cls : 'red-bg',
						margin : '4 0 0 0',
						items : me.setSubPanelHeader( subHeaderId, subHeaderName, moduleCode, accessTypeCode )
					};
					menuItems.push( item );

					sectionId = moduleAccessMenu.moduleCode + moduleAccessMenu.moduleName
						+ moduleAccessMenu.accessTypeCode + moduleAccessMenu.accessTypeName + me.menuMode + 'Section';
					me.accessTypesSectionIds[ accessTypesCount ] = sectionId;
					// insert item for menu
					item =
					{
						xtype : 'panel',
						titleAlign : "left",
						cls : 'xn-ribbon',
						collapseFirst : true,
						id : sectionId,
						layout : 'column',
						items : me.setMenuRow( moduleAccessMenu.moduleCode, moduleAccessMenu.accessTypeCode )
					};
					menuItems.push( item );
				}
			}
			else
			{
				servicesCount++;
				accessTypesCount++;
				moduleCode = moduleAccessMenu.moduleCode;
				headerName = moduleAccessMenu.moduleName;
				headerId = moduleAccessMenu.moduleCode + moduleAccessMenu.moduleName + 'Header';
				me.servicesImgIds[ servicesCount ] = moduleCode + headerName;
				me.servicesHeaderIds[ servicesCount ] = headerId;
				// insert item for panel header
				item =
				{
					xtype : 'panel',
					id : headerId,
					layout : 'column',
					cls : 'red-bg-header',
					margin : '4 0 0 0',
					items : me.setPanelHeader( headerId, headerName, moduleCode )
				};
				menuItems.push( item );

				accessTypeCode = moduleAccessMenu.accessTypeCode;
				subHeaderName = moduleAccessMenu.accessTypeName;
				subHeaderId = moduleAccessMenu.moduleCode + moduleAccessMenu.moduleName
					+ moduleAccessMenu.accessTypeCode + moduleAccessMenu.accessTypeName + me.menuMode + 'SubHeader';

				me.accessTypesImgIds[ accessTypesCount ] = accessTypeCode + subHeaderName;
				me.accessTypesHeaderIds[ accessTypesCount ] = subHeaderId;
				// insert item for sub panel header
				item =
				{
					xtype : 'panel',
					id : subHeaderId,
					layout : 'column',
					cls : 'red-bg',
					margin : '4 0 0 0',
					items : me.setSubPanelHeader( subHeaderId, subHeaderName, moduleCode, accessTypeCode )
				};
				menuItems.push( item );

				sectionId = moduleAccessMenu.moduleCode + moduleAccessMenu.moduleName + moduleAccessMenu.accessTypeCode
					+ moduleAccessMenu.accessTypeName + me.menuMode + 'Section';
				me.accessTypesSectionIds[ accessTypesCount ] = sectionId;
				// insert item for menu
				item =
				{
					xtype : 'panel',
					titleAlign : "left",
					cls : 'xn-ribbon',
					collapseFirst : true,
					id : sectionId,
					layout : 'column',
					items : me.setMenuRow( moduleAccessMenu.moduleCode, moduleAccessMenu.accessTypeCode )
				};
				menuItems.push( item );
			}
			}
		} );

		return menuItems;
	},
	getTCIPanelItems : function()
	{
		var me = this;
		var item;
		var menuItems = [];
		var menuData = null;
		var moduleCode = -1;
		var accessTypeCode = -1;
		var headerId = null;
		var headerName = null;
		var subHeaderId = null;
		var subHeaderName = null;
		var sectionId = null
		var servicesCount = -1;
		var accessTypesCount = -1;

		// insert item for main header
	/*	item =
		{
			xtype : 'panel',
			id : 'columnHeader',
			layout : 'column',
			cls : 'alignCenter',
			margin : '5 5 5 5',
			padding : '5 5 5 5',
			items : me.setColumnHeader()
		};
		menuItems.push( item );*/

		// get module menus
		me.menuMode = 'CI';
		menuData = menuDataa;
		Ext.each( menuData, function( moduleAccessMenu, index )
		{
			if(moduleAccessMenu.rmaccesstype === 'A' && !Ext.isEmpty(moduleAccessMenu.formId) 
					&& !Ext.isEmpty(moduleAccessMenu.typeId) && moduleAccessMenu.typeId.charAt(0) > 0)
			{
			// if same level module menu
			if( moduleCode == moduleAccessMenu.moduleCode )
			{
				if( accessTypeCode == moduleAccessMenu.accessTypeCode )
				{
					// this case will not come
				}
				else
				{
					accessTypesCount++;
					accessTypeCode = moduleAccessMenu.accessTypeCode;
					subHeaderName = moduleAccessMenu.accessTypeName;
					subHeaderId = moduleAccessMenu.moduleCode + moduleAccessMenu.moduleName
						+ moduleAccessMenu.accessTypeCode + moduleAccessMenu.accessTypeName + me.menuMode + 'SubHeader';

					me.tciAccessTypesImgIds[ accessTypesCount ] = accessTypeCode + subHeaderName;
					me.tciAccessTypesHeaderIds[ accessTypesCount ] = subHeaderId;
					// insert item for sub panel header
					item =
					{
						xtype : 'panel',
						id : subHeaderId,
						layout : 'column',
						cls : 'red-bg',
						margin : '4 0 0 0',
						items : me.setSubPanelHeader( subHeaderId, subHeaderName, moduleCode, accessTypeCode )
					};
					menuItems.push( item );

					sectionId = moduleAccessMenu.moduleCode + moduleAccessMenu.moduleName
						+ moduleAccessMenu.accessTypeCode + moduleAccessMenu.accessTypeName + me.menuMode + 'Section';
					me.tciAccessTypesSectionIds[ accessTypesCount ] = sectionId;
					// insert item for menu
					item =
					{
						xtype : 'panel',
						titleAlign : "left",
						cls : 'xn-ribbon',
						collapseFirst : true,
						id : sectionId,
						layout : 'column',
						items : me.setMenuRow( moduleAccessMenu.moduleCode, moduleAccessMenu.accessTypeCode )
					};
					menuItems.push( item );
				}
			}
			else
			{
				servicesCount++;
				accessTypesCount++;
				moduleCode = moduleAccessMenu.moduleCode;
				headerName = moduleAccessMenu.moduleName;
				headerId = moduleAccessMenu.moduleCode + moduleAccessMenu.moduleName + 'Header_' + me.menuMode;
				me.tciServicesImgIds[ servicesCount ] = moduleCode + headerName;
				me.tciServicesHeaderIds[ servicesCount ] = headerId;
				// insert item for panel header
				item =
				{
					xtype : 'panel',
					id : headerId,
					layout : 'column',
					cls : 'red-bg-header',
					margin : '4 0 0 0',
					items : me.setPanelHeader( headerId, headerName, moduleCode )
				};
				menuItems.push( item );

				accessTypeCode = moduleAccessMenu.accessTypeCode;
				subHeaderName = moduleAccessMenu.accessTypeName;
				subHeaderId = moduleAccessMenu.moduleCode + moduleAccessMenu.moduleName
					+ moduleAccessMenu.accessTypeCode + moduleAccessMenu.accessTypeName + me.menuMode + 'SubHeader';

				me.tciAccessTypesImgIds[ accessTypesCount ] = accessTypeCode + subHeaderName;
				me.tciAccessTypesHeaderIds[ accessTypesCount ] = subHeaderId;
				// insert item for sub panel header
				item =
				{
					xtype : 'panel',
					id : subHeaderId,
					layout : 'column',
					cls : 'red-bg',
					margin : '4 0 0 0',
					items : me.setSubPanelHeader( subHeaderId, subHeaderName, moduleCode, accessTypeCode )
				};
				menuItems.push( item );

				sectionId = moduleAccessMenu.moduleCode + moduleAccessMenu.moduleName + moduleAccessMenu.accessTypeCode
					+ moduleAccessMenu.accessTypeName + me.menuMode + 'Section';
				me.tciAccessTypesSectionIds[ accessTypesCount ] = sectionId;
				// insert item for menu
				item =
				{
					xtype : 'panel',
					titleAlign : "left",
					cls : 'xn-ribbon',
					collapseFirst : true,
					id : sectionId,
					layout : 'column',
					items : me.setMenuRow( moduleAccessMenu.moduleCode, moduleAccessMenu.accessTypeCode )
				};
				menuItems.push( item );
			}
			}
		} );

		return menuItems;
	},

	initComponent : function()
	{
		var me = this;
		me.menuMode = 'CW';
		me.tcwAdminPrivileges = (featureDataa).filter(function(v) {
			if (v.rmaccesstype === 'A' && Ext.isEmpty(v.formId) && Ext.isEmpty(v.typeId)) {
				return v;
			}
		});
		GCP.getApplication().on(
		{
			callAdminSaveItems : function( moduleCode, accessTypeCode, checkBoxValue )
			{
				me.saveItems( moduleCode, accessTypeCode, checkBoxValue );
			}
		} );
		me.menuMode = 'CI';
		me.tciAdminPrivileges = (featureDataa).filter(function(v) {
			if (v.rmaccesstype === 'A' && !Ext.isEmpty(v.formId) && !Ext.isEmpty(v.typeId) && (v.typeId.charAt(0)) > 0) {
				return v;
			}
		});
		me.menuMode = '';
		me.items =
		[
			{
				xtype : 'container',
				cls : 'border',
				items :
				[
					{
						xtype:'panel',
						items:[{
								xtype : 'panel',
								id : 'columnHeader',
								layout : 'column',
								cls : 'alignCenter',
								margin : '5 5 5 5',
								padding : '5 5 5 5',
								items : me.setColumnHeader()
						}]
					},
					{
						xtype:'panel',
						overflowY:'auto',
						height:350,
						items:[{
								xtype : 'panel',
								title:  'Cashweb',
								margin : '5 0 0 0',
								itemId : 'adminPrivilegePanelItemId',
								items : me.getPanelItems()
						},
						{
							xtype : 'panel',
							title:  'Cashin',
							margin : '5 0 0 0',
							itemId : 'adminPrivilegeTCIPanelItemId',
							items : me.getTCIPanelItems()
						}]
					}
				]
			}
		];
		this.callParent( arguments );
	},

	checkRowIcon : function( btn, mode, rmSerial, rmWeight )
	{
		var me = this;
		var rmWeightSerialArray;
		var otherIconItemId;
		var lIconType = mode.toLowerCase()+"Icon";
		var allOtherSubHeaderCheckedCount = 0;
		var allSubHeaderCount = 0;
		var isAllOtherSubHeaderChecked = false;
		var allOtherRowCheckedCount = 0;
		var allRowCount = 0;
		var isAllOtherRowChecked = false;
		var accessTypeHeaderId = null;
		var servicesHeaderId = null;
		var indoxOfModuleCode = null;
		var indoxOfAccessCode = null;
		var headerId = null;
		var allItems = null;
		var field  = null;
		var featureId = null;
		var element = null;
		
		if( btn.checked )
		{
			if( mode == 'EDIT' || mode == 'AUTH' )
			{
				var viewIconItemId = me.down( 'checkboxfield[itemId=' + rmSerial + '_' + rmWeight + '_VIEW' + ']' );
				if( viewIconItemId )
				{
					viewIconItemId.setValue( true );
					viewIconItemId.defVal = true;
				}
			}
			
			if( adminDupWeights[ rmWeight ] )
			{
				rmWeightSerialArray = adminDupWeights[ rmWeight ];
				for( i = 0 ; i < rmWeightSerialArray.length ; i++ )
				{
					if( rmSerial != rmWeightSerialArray[ i ] )
					{
						otherIconItemId = me.down( 'checkboxfield[itemId=' + rmWeightSerialArray[ i ] + '_' + rmWeight
							+ '_' + mode + ']' );
						otherIconItemId.setValue( true );
						otherIconItemId.defVal = true;
					}
				}
			}
		}
		else
		{
			if( mode == 'VIEW' )
			{
				var editIconItemId = me.down( 'checkboxfield[itemId=' + rmSerial + '_' + rmWeight + '_EDIT' + ']' );
				if( editIconItemId )
				{
					editIconItemId.setValue( false );
					editIconItemId.defVal = false;
				}
				var authIconItemId = me.down( 'checkboxfield[itemId=' + rmSerial + '_' + rmWeight + '_AUTH' + ']' );
				if( authIconItemId )
				{
					authIconItemId.setValue( false );
					authIconItemId.defVal = false;
				}
			}
			if( adminDupWeights[ rmWeight ] )
			{
				rmWeightSerialArray = adminDupWeights[ rmWeight ];
				for( i = 0 ; i < rmWeightSerialArray.length ; i++ )
				{
					if( rmSerial != rmWeightSerialArray[ i ] )
					{
						otherIconItemId = me.down( 'checkboxfield[itemId=' + rmWeightSerialArray[ i ] + '_' + rmWeight
							+ '_' + mode + ']' );
						otherIconItemId.setValue( false );
						otherIconItemId.defVal = false;
					}
				}
			}
			//uncheck subheader for rowIcon
			for( var j = 0 ; j < me.accessTypesHeaderIds.length ; j++ )				
			{
				indoxOfModuleCode = me.accessTypesHeaderIds[ j ].indexOf(btn.moduleCode);
				indoxOfAccessCode = me.accessTypesHeaderIds[ j ].indexOf(btn.accessTypeCode);
				if(me.accessTypesHeaderIds[ j ].startsWith(btn.moduleCode) 
						&& indoxOfModuleCode>=0 && indoxOfAccessCode >=0 
						&& indoxOfAccessCode >indoxOfModuleCode )
				{
					//sub header uncheck gif
					headerId = Ext.getCmp( me.accessTypesHeaderIds[ j ] );
					allItems = headerId.items.items;
					for( var k = 0 ; k <allItems.length ; k++ )
					{	field  = allItems[k];
						featureId = field.itemId;
						if( featureId != null && featureId != undefined && featureId.endsWith(lIconType))
						{
							element = me.down( 'button[itemId=' + featureId + ']' );
							if( element != null && element != undefined && !element.hidden )
							{
								element.setIcon( "./static/images/icons/icon_uncheckmulti.gif" );
								//me.uncheckMultiIcon(element, mode);
							}
						}
					}
				}
			}
			//uncheck header for rowIcon
			for( var j = 0 ; j < me.servicesHeaderIds.length ; j++ )
			{
				if(me.servicesHeaderIds[ j ].startsWith(btn.moduleCode))
				{
					//header uncheck gif				
					headerId = Ext.getCmp( me.servicesHeaderIds[ j ] );
					allItems = headerId.items.items;
					for( var k = 0 ; k <allItems.length ; k++ )
					{	field  = allItems[k];
						featureId = field.itemId;
						if( featureId != null && featureId != undefined && featureId.endsWith(lIconType))
						{
							element = me.down( 'button[itemId=' + featureId + ']' );
							if( element != null && element != undefined && !element.hidden )
							{								
								element.setIcon( "./static/images/icons/icon_uncheckmulti.gif" );
								//me.uncheckMultiIcon(element, mode);
							}
						}
					}
				}
			}
		}
	},

	changeHeaderIcon : function( btn, moduleCode, iconType )
	{
		if( pageMode === "EDIT" )
		{
			var me = this;
			var flag = true;
			var lIconType = iconType.toLowerCase()+"Icon";
			var serviceHeader = null;
			var allItems = null;
			var element = null;
			var field  = null;
			var featureId = null;
			var subHeaderId = null;

			if( btn.icon.match( 'icon_uncheckmulti.gif' ) )
			{
				btn.setIcon( "./static/images/icons/icon_checkmulti.gif" );
				flag = true;
				//me.checkMultiIcon(btn, iconType);
			}
			else
			{
				btn.setIcon( "./static/images/icons/icon_uncheckmulti.gif" );
				flag = false;
				//me.uncheckMultiIcon(btn, iconType);
			}
			Ext.each( fieldJson, function( field, index )
			{
				featureId = field.itemId;
				element = me.down( 'checkboxfield[itemId=' + featureId + ']' );
				if( element != null && element != undefined && !element.hidden )
				{
					if( moduleCode == field.moduleCode && iconType == element.mode )
					{
						element.setValue( flag );
						element.defVal = element.getValue();
					}
				}
			} );
			// changes for subheader check/uncheck
			serviceHeader = btn.itemId.substr(0,btn.itemId.indexOf( "Header_"));
			for( var j = 0 ; j < me.accessTypesHeaderIds.length ; j++ )
			{
				if(me.accessTypesHeaderIds[ j ].startsWith(serviceHeader))
				{
					subHeaderId = Ext.getCmp( me.accessTypesHeaderIds[ j ] );
					allItems = subHeaderId.items.items;
					for( var k = 0 ; k <allItems.length ; k++ )
					{
						field  = allItems[k];
						featureId = field.itemId;
						if( featureId != null && featureId != undefined && featureId.endsWith(lIconType))
						{
							element = me.down( 'button[itemId=' + featureId + ']' );
							if( element != null && element != undefined && !element.hidden )
							{
								if( flag )
								{
									element.setIcon( "./static/images/icons/icon_checkmulti.gif" );
									//me.checkMultiIcon(element, iconType);
								}
								else
								{
									element.setIcon( "./static/images/icons/icon_uncheckmulti.gif" );
									//me.uncheckMultiIcon(element, iconType);
								}
							}
						}
					}
				}
			}
		}
	},

	changeSubHeaderIcon : function( btn, moduleCode, accessTypeCode, iconType )
	{
		if( pageMode === "EDIT" )
		{
			var me = this;
			var flag = true;
			var lIconType = iconType.toLowerCase()+"Icon";
			var subHeaderCheckedViewCount = 0;
			var subHeaderTotalViewCount = 0;
			var allOtherSubHeaderCheckedCount = 0;
			var allSubHeaderCount = 0;
			var isAllOtherSubHeaderChecked = false;
			var accessTypeHeaderId = null;
			var servicesHeaderId = null;
			var allItems = null;
			var element = null;
			var field  = null;
			var featureId = null;
			if( btn.icon.match( 'icon_uncheckmulti.gif' ) )
			{
				btn.setIcon( "./static/images/icons/icon_checkmulti.gif" );
				flag = true;
				//me.checkMultiIcon(btn, iconType);
			}
			else
			{
				btn.setIcon( "./static/images/icons/icon_uncheckmulti.gif" );
				flag = false;
				//me.uncheckMultiIcon(btn, iconType);
			}
			Ext.each( fieldJson, function( field, index )
			{
				featureId = field.itemId;
				element = me.down( 'checkboxfield[itemId=' + featureId + ']' );
				if( element != null && element != undefined && !element.hidden )
				{
					if( moduleCode == field.moduleCode && accessTypeCode == field.accessTypeCode )
					{
						if( iconType == element.mode )
						{
							element.setValue( flag );
							element.defVal = element.getValue();
						}
					}
				}
			} );

			if( flag )
			{
				if( iconType == 'EDIT' || iconType == 'AUTH' )
				{
					Ext.each( fieldJson, function( field, index )
					{
						featureId = field.itemId;
						element = me.down( 'checkboxfield[itemId=' + featureId + ']' );
						if( element != null && element != undefined && !element.hidden )
						{
							if( moduleCode == field.moduleCode && accessTypeCode == field.accessTypeCode )
							{
								if( 'VIEW' == element.mode )
								{
									subHeaderTotalViewCount++;
									//console.log(element.getValue());
									if( element.getValue() )
									{
										subHeaderCheckedViewCount++;
									}
								}
							}
						}
					} );
					if( subHeaderCheckedViewCount == subHeaderTotalViewCount )
					{
						me.checkMultiIcon( btn, iconType );
					}
				}
				
				// check for all other subheader check/uncheck within the header
				for( var j = 0 ; j < me.accessTypesHeaderIds.length ; j++ )
				{
					if( me.accessTypesHeaderIds[ j ].startsWith( moduleCode ) )
					{
						accessTypeHeaderId = Ext.getCmp( me.accessTypesHeaderIds[ j ] );
						allItems = accessTypeHeaderId.items.items;
						for( var k = 0 ; k < allItems.length ; k++ )
						{
							field  = allItems[k];
							featureId = field.itemId;
							if( featureId != null && featureId != undefined && featureId.endsWith( lIconType ) )
							{
								element = me.down( 'button[itemId=' + featureId + ']' );
								if( element != null && element != undefined && !element.hidden )
								{
									if( element.icon.match( 'icon_checkmulti.gif' ) )
									{
										allOtherSubHeaderCheckedCount++;
									}
								}
							}
							
							if( iconType == 'EDIT' || iconType == 'AUTH' )
							{
								if( subHeaderCheckedViewCount == subHeaderTotalViewCount )
								{
									if( featureId != null && featureId != undefined && featureId.endsWith( "viewIcon" ) )
									{
									}
								}
							}							
						}
						allSubHeaderCount++;
					}
				}
				if( allSubHeaderCount != allOtherSubHeaderCheckedCount )
				{
					flag = false;
				}
			}
			
			// changes for header check/uncheck
			for( var j = 0 ; j < me.servicesHeaderIds.length ; j++ )
			{
				if( me.servicesHeaderIds[ j ].startsWith( moduleCode ) )
				{
					servicesHeaderId = Ext.getCmp( me.servicesHeaderIds[ j ] );
					allItems = servicesHeaderId.items.items;
					for( var k = 0 ; k <allItems.length ; k++ )
					{
						field  = allItems[k];
						featureId = field.itemId;
						if( featureId != null && featureId != undefined && featureId.endsWith( lIconType ) )
						{
							element = me.down( 'button[itemId=' + featureId + ']' );
							if( element != null && element != undefined && !element.hidden )
							{
								if( flag )
								{
									element.setIcon( "./static/images/icons/icon_checkmulti.gif" );
									//me.checkMultiIcon(element, iconType);
								}
								else
								{
									element.setIcon( "./static/images/icons/icon_uncheckmulti.gif" );
									//me.uncheckMultiIcon(element, iconType);
								}
							}
						}
					}
				}
			}
		}
	},
	
	saveItems : function( moduleCode, accessTypeCode, checkBoxValue )
	{
		var me = this;
		var featureId = null;
		var element = null;
		Ext.each( fieldJson, function( field, index )
		{
			featureId = field.itemId;
			element = me.down( 'checkboxfield[itemId=' + featureId + ']' );
			if( element != null && element != undefined && !element.hidden )
			{
				//element.boxLabelCls =element.boxLabelCls+" newFieldValue";
				// if any service or access type is unchecked
				if( moduleCode == field.moduleCode || accessTypeCode == field.accessTypeCode )
				{
					if( !checkBoxValue )
					{
						element.setValue( false );
					}
				}
				else
				{
					element.defVal = element.getValue();
				}
				if( 'VIEW' == element.mode )
				{
					viewSerials[ field.rmSerial ] = element.getValue();
				}
				if( 'EDIT' == element.mode )
				{
					editSerials[ field.rmSerial ] = element.getValue();
				}
				if( 'AUTH' == element.mode )
				{
					authSerials[ field.rmSerial ] = element.getValue();
				}
			}
		} );
		if( !Ext.isEmpty( me.fnCallback ) && typeof me.fnCallback == 'function' )
		{
			me.fnCallback( viewSerials, authSerials, editSerials );
			me.close();
		}
	},

	checkMultiIcon: function( btn, iconType )
	{
		var me = this;
		var vfeatureId = null;
		var iconItemId = null;
		var lIconType = iconType.toLowerCase()+"Icon";
		if( iconType == 'EDIT' || iconType == 'AUTH' )
		{
			//viewIcon
			vfeatureId = btn.itemId.substr(0,btn.itemId.indexOf(lIconType)) +"viewIcon";
			iconItemId = me.down( 'button[itemId=' + vfeatureId + ']' );
			iconItemId.setIcon( "./static/images/icons/icon_checkmulti.gif" );
		}
	},
	
	uncheckMultiIcon: function( btn, iconType )
	{
		var me = this;
		var vfeatureId = null;
		var iconItemId = null;
		var lIconType = iconType.toLowerCase()+"Icon";
		if( iconType == 'VIEW' )
		{
			//editIcon
			vfeatureId = btn.itemId.substr(0,btn.itemId.indexOf(lIconType)) +"editIcon";
			iconItemId = me.down( 'button[itemId=' + vfeatureId + ']' );
			iconItemId.setIcon( "./static/images/icons/icon_uncheckmulti.gif" );
			//authIcon
			vfeatureId = btn.itemId.substr(0,btn.itemId.indexOf(lIconType)) +"authIcon";
			iconItemId = me.down( 'button[itemId=' + vfeatureId + ']' );
			iconItemId.setIcon( "./static/images/icons/icon_uncheckmulti.gif" );
		}
	}	
} );

function callInnerAdminSaveItems( moduleCode, accessTypeCode, checkBoxValue )
{
	GCP.getApplication().fireEvent( 'callAdminSaveItems', moduleCode, accessTypeCode, checkBoxValue );
}