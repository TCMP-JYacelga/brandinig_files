/**
 * @class GCP.view.BankAdminCategoryView
 * @extends Ext.window.Window
 * @author Alhad
 */

Ext.define( 'GCP.view.SellerLevelPrivilegePopup',
{
	extend : 'Ext.window.Window',
	xtype : 'sellerLevelPrivilegePopupType',
	width : 860,
	maxWidth : 975,
	minHeight : 156,
	maxHeight : 550,
	title : getLabel('sellerPrivileges','Fi Privileges'),
	rowCount : 0,
	cls : 'non-xn-popup',
	config :
	{
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
		allAdminPrivileges : null,
		servicesImgIds : [],
		servicesHeaderIds : [],
		accessTypesImgIds : [],
		accessTypesHeaderIds : [],
		accessTypesSectionIds : []
	},

	listeners :
	{
		resize : function(){
			this.center();
		}
	},

	getBankAdminMenuList : function( )
	{
		var me = this;
		var objParam = {};
		var menuData;
		var strUrl = 'userSellerPrivilege.srvc?'+ csrfTokenName + '=' + csrfTokenValue;
		objParam['$viewState']=document.getElementById('viewState').value;
		if (pageMode == "VIEW" || pageMode === "VERIFY")
		{
			objParam['$pageMode']="VIEW";
		}
		else
		{
			objParam['$selectedSeller']=document.getElementById('selectedSellerList').value;
		}
		if (pageMode == "VIEW")
		{
			objParam['$old'] = btnOldView;
		}
		
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

	loadFeaturs : function( accessType, sellerType, sellerCode )
	{
		var me = this;
		var featureData;
		var objParam = {};
		var strUrl = 'userSellerPrivilege.srvc?'+ csrfTokenName + '=' + csrfTokenValue;		
		objParam['$viewState']=document.getElementById('viewState').value;
		if (pageMode == "VIEW" || pageMode === "VERIFY")
		{
			objParam['$pageMode']="VIEW";
		}
		else
		{
			objParam['$selectedSeller']=document.getElementById('selectedSellerList').value;
		}
		if (pageMode == "VIEW")
		{
			objParam['$old'] = btnOldView;
		}
		
		Ext.Ajax.request(
		{
			url : strUrl,
			method : 'POST',
			params:objParam,
			async : false,
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
	},
	loadOldFeaturs : function( accessType, sellerType, sellerCode )
		{
			var me = this;
			var featureData;
			var objParam = {};
			var strUrl = 'oldUserSellerPrivilege.srvc?'+ csrfTokenName + '=' + csrfTokenValue;		
			objParam['$viewState']=document.getElementById('viewState').value;
			if (pageMode == "VIEW" || pageMode === "VERIFY")
			{
				objParam['$pageMode']="VIEW";
			}
			else
			{
				objParam['$selectedSeller']=document.getElementById('selectedSellerList').value;
			}
			if (pageMode == "VIEW")
			{
				objParam['$old'] = btnOldView;
			}
			Ext.Ajax.request(
			{
				url : strUrl,
				method : 'POST',
				params:objParam,
				async : false,
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

	setColumnHeader : function(output)
	{
		var featureItems = []; 
		featureItems.push(
		{
			xtype : 'label',
			columnWidth : 0.28,
			text : getLabel("",""),
			padding : '5 0 0 0',
			cls : 'non-t7-privilege-label non-t7-privilege-grid-main-header'
		} );
		
		Ext.each( output, function( opt, index )
		{
		featureItems.push(
		{
			xtype : 'label',
			columnWidth :0.12 ,
			text : getLabel('lbl_'+opt.key,"Reports & Interfaces"),
			style: 'font: bold 11px important',
			padding : '5 0 0 0',
			cls : 'non-t7-privilege-label non-t7-privilege-grid-main-header non-t7-alignCenter'
		} );
		});
		
		return featureItems;
	},

	setPanelHeader : function( id, title, sellerType,output,Wdth )
	{
		var me = this;
		me.rowCount++;
		var featureItems = [];
		featureItems.push(
		{
			xtype : 'label',
			columnWidth : 0.28,
			text : title,
			padding : '5 0 0 20',
			height : 30,
			cls : (me.rowCount%2) ? 'non-t7-privilege-grid-main-header  privilege-grid-even' :'non-t7-privilege-grid-main-header privilege-grid-odd' //panelHeaderText
		} );
		
		Ext.each( output, function( output, index )
		{
		featureItems.push({
		xtype: 'panel',
		columnWidth: 0.12,
		readOnly : (output.value == '1') ? false : true,
		cls :  (me.rowCount%2) ? 'non-t7-privilege-grid-main-header non-t7-alignCenter privilege-sub-label  privilege-grid-even' : 'non-t7-privilege-grid-main-header privilege-sub-label non-t7-alignCenter privilege-grid-odd',
		text: title,
		padding:'5 0 0 10',
		items : [{
			xtype : 'button',
			icon : "./static/images/icons/checkbox.png",
			margin : '2 20 2 25',
			width : 19,
			height : 21,
			itemId : id + "_viewIcon",
			border : 0,
			cls : (me.rowCount%2) ? 'privilege-grid-even non-t7-alignCenter' : 'privilege-grid-odd non-t7-alignCenter', //btn-header,
			disabled:(pageMode == "VIEW" || pageMode === "VERIFY")?true:false,
			handler : 
			function( btn, e, opts )
			{
				if(output.key == '01' && output.value == '1')
				{
					me.changeHeaderIcon( btn, sellerType, "accessType01" );
				}
				else if(output.key == '02' && output.value == '1')
				{
					me.changeHeaderIcon( btn, sellerType, "accessType02" );
				}
				else if(output.key == '03' && output.value == '1')
				{
					me.changeHeaderIcon( btn, sellerType, "accessType03" );
				}
				else if(output.key == '04' && output.value == '1')
				{
					me.changeHeaderIcon( btn, sellerType, "accessType04" );
				}
				else if(output.key == '05' && output.value == '1')
				{
					me.changeHeaderIcon( btn, sellerType, "accessType05" );
				}
				else if(output.key == '06' && output.value == '1')
				{
					me.changeHeaderIcon( btn, sellerType, "accessType06" );
				}
			}
		}]
		});
		});
		return featureItems;
	},
	
	setPriviligeMenu : function( feature, accessType, MODE, index,Wdth,hide, oldaccessType)
	{
		var me = this;
		var obj = new Object();		
		obj.xtype = 'panel',
		obj.columnWidth = 0.12
		if(oldaccessType!=""&& accessType!="" && accessType!= oldaccessType && feature.changeState==1)
		{
		obj.items  =  [{
		checked :(hide) ? false :  this.getBooleanvalue(accessType) ,
		xtype : "checkbox",
		columnWidth : '0.10',
		padding : '0 0 0 47',
		itemId : feature.sellerCode + "_" + MODE,
		sellerType : feature.sellerType,
		readOnly : ( pageMode === "VIEW" || pageMode === "VERIFY") ? true : hide,
		sellerCode : feature.sellerCode,
		mode : MODE
		},
		{
		checked :(hide) ? false :  this.getBooleanvalue(oldaccessType) ,
		xtype : "checkbox",
		columnWidth : '0.15',
		padding : '0 0 0 47',
		itemId : feature.sellerCode + "_VIEW_CHANGES",
		sellerType : feature.sellerType,
		readOnly : ( pageMode === "VIEW" || pageMode === "VERIFY") ? true : hide,
		hidden : (btnOldView != 'TRUE') ? true : false,
		sellerCode : feature.sellerCode,
		mode : MODE
		}]
		}
		else
		{
		obj.items  =  [{
		checked :(hide) ? false :  this.getBooleanvalue(accessType) ,
		xtype : "checkbox",
		columnWidth : '0.10',
		padding : '0 0 0 47',
		itemId : feature.sellerCode + "_" + MODE,
		sellerType : feature.sellerType,
		readOnly : ( pageMode === "VIEW" || pageMode === "VERIFY") ? true : hide,
		sellerCode : feature.sellerCode,
		mode : MODE
		}]
			
		}
		if( null != obj.checked && undefined != obj.checked )
		{
			obj.defVal = obj.checked;
		}
		fieldJson.push( obj );		
		return obj;
	},

	prepareSaveJson : function( feature)
	{
		var me = this;
		var obj = new Object();
		obj.sellerType = feature.sellerType;
		obj.sellerCode = feature.sellerCode;
		obj.sellerDescription = feature.sellerDescription;
		obj.accessType01 = feature.accessType01;
		obj.accessType02 = feature.accessType02;
		obj.accessType03 = feature.accessType03;
		obj.accessType04 = feature.accessType04;
		obj.accessType05 = feature.accessType05;
		obj.accessType06 = feature.accessType06;
		fieldsJson.push( obj );		
	},
	
	setMenuRow : function( sellerType ,output,Wdth)
	{
		var self = this;
		var featureItems = [];
		var admPriv = self.allAdminPrivileges.d.details;
		var admOldPriv = self.allAdminOldPrivileges.d.details;
		
		Ext.each( admPriv, function( feature, index )
		{
			if( feature.sellerType == sellerType )
			{
				var oldfeature = null;
				self.rowCount++;		
				var panel = Ext.create( 'Ext.panel.Panel',
				{
					columnWidth : 1,
					layout : 'column',
					cls  : (self.rowCount%2) ? 'non-t7-privilege-grid-main-header privilege-sub-label  privilege-grid-even' : 'non-t7-privilege-grid-main-header privilege-sub-label  privilege-grid-odd',
		
					bodyStyle :
					{
						background : ' #FAFAFA '
					}
				} );
					Ext.each( admOldPriv, function( feature1, oldindex )
					{
						if(feature.recordKeyNo === feature1.recordKeyNo)
						
					{
							oldfeature = feature1;
						}
					} );
			if(btnOldView == 'TRUE')//VIEW_CHANGES
				{
						//New Values
					if(feature.changeState=== 3){
						panel.insert(
					{
						xtype : 'label',
						columnWidth : 0.28,
						margin : '2 20 2 20',
						text : feature.sellerDescription,
						id : feature.sellerDescription+"Id",
						padding : '5 0 0 20',			
			      cls :'newFieldGridValue'
						
					} );
				}		
				else if(oldfeature!=null && (feature.accessType01 != oldfeature.accessType01 || feature.accessType02 != oldfeature.accessType02 || feature.accessType03 != oldfeature.accessType03 || feature.accessType04 != oldfeature.accessType04 || feature.accessType05 != oldfeature.accessType05 || feature.accessType06 != oldfeature.accessType06)&&btnOldView === 'TRUE')
          {
	              panel.insert(
					{
						xtype : 'label',
						columnWidth : 0.20,
						margin : '2 20 2 20',
						text : feature.sellerDescription,
						id : feature.sellerDescription+"Id",
						padding : '5 0 0 20'		                    						
					},
					{
					    xtype : 'label',
					    columnWidth : 0.08,
						  cls : 'fa fa-clock-o modifiedFieldValue ',
					    padding : '34 0 0 0'				
				  });
				}
				//Deleted Values
				else if(feature.changeState=== 2){
						panel.insert(
					{
						xtype : 'label',
						columnWidth : 0.28,
						margin : '2 20 2 20',
						text : feature.sellerDescription,
						id : feature.sellerDescription+"Id",
						padding : '5 0 0 20',			
			           cls :'deletedFieldValue'
						
					} );
				}
				//No Changes in View Changes also
				else
				{
				panel.insert(
					{
						xtype : 'label',
						columnWidth : 0.28,
						margin : '2 20 2 20',
						text : feature.sellerDescription,
						id : feature.sellerDescription+"Id",
						padding : '5 0 0 20'
						
					} );
			}
				}
			else if(btnOldView =='FALSE')			//VIEW MODE
			{
				panel.insert(
					{
						xtype : 'label',
						columnWidth : 0.28,
						margin : '2 20 2 20',
						text : feature.sellerDescription,
						id : feature.sellerDescription+"Id",
						padding : '5 0 0 20'
						
					} );
			}
			Ext.each( output, function( opt, index1 )
			{
				if(opt.key == '01')
				{
					var hide = (opt.value == '0') ? true : false;
				  if(oldfeature!=null)
					{
					panel.insert( self.setPriviligeMenu( feature, feature.accessType01, "accessType01",index,Wdth,hide, oldfeature.accessType01) );
					}
					else
					{
						panel.insert( self.setPriviligeMenu( feature, feature.accessType01, "accessType01",index,Wdth,hide) );
					}
					
					if(opt.value == '0')
					{
						feature.accessType01 = 'N';
					}
				}
				if(opt.key == '02' )
				{
					var hide = (opt.value == '0') ? true : false;
					
					if(oldfeature!=null)
					{
					panel.insert( self.setPriviligeMenu( feature, feature.accessType02, "accessType02",index,Wdth,hide, oldfeature.accessType02) );
					}
					else
					{
						panel.insert( self.setPriviligeMenu( feature, feature.accessType02, "accessType02",index,Wdth,hide) );
					}
					if(opt.value == '0')
					{
						feature.accessType02 = 'N';
					}
				}
				if(opt.key == '03' )
				{
					var hide = (opt.value == '0') ? true : false;
          if(oldfeature!=null)
					{
					 panel.insert( self.setPriviligeMenu( feature, feature.accessType03, "accessType03",index,Wdth,hide, oldfeature.accessType03) );
					}
					else
					{
						panel.insert( self.setPriviligeMenu( feature, feature.accessType03, "accessType03",index,Wdth,hide) );
					}
				
					if(opt.value == '0')
					{
						feature.accessType03 = 'N';
					}
				}
				if(opt.key == '04' )
				{
					var hide = (opt.value == '0') ? true : false;
				  if(oldfeature!=null)
					{
				   	panel.insert( self.setPriviligeMenu( feature, feature.accessType04, "accessType04",index,Wdth,hide, oldfeature.accessType04) );
					}
					else
					{
						panel.insert( self.setPriviligeMenu( feature, feature.accessType04, "accessType04",index,Wdth,hide) );
					}
					if(opt.value == '0')
					{
						feature.accessType04 = 'N';
					}
				}
				if(opt.key == '05' )
				{
					var hide = (opt.value == '0') ? true : false;
					if(oldfeature!=null)
					{
					panel.insert( self.setPriviligeMenu( feature, feature.accessType05, "accessType05",index,Wdth,hide, oldfeature.accessType05) );
					}
					else
					{
						panel.insert( self.setPriviligeMenu( feature, feature.accessType05, "accessType05",index,Wdth,hide) );
					}
					
					if(opt.value == '0')
					{
						feature.accessType05 = 'N';
					}
				}
				if(opt.key == '06' )
				{
					var hide = (opt.value == '0') ? true : false;
					
				  if(oldfeature!=null)
					{
					panel.insert( self.setPriviligeMenu( feature, feature.accessType06, "accessType06",index,Wdth,hide, oldfeature.accessType06) );
					}
					else
					{
						panel.insert( self.setPriviligeMenu( feature, feature.accessType06, "accessType01",index,Wdth,hide) );
					}
					if(opt.value == '0')
					{
						feature.accessType06 = 'N';
					}
				}
			
				featureItems.push( panel );
				
			});
			self.prepareSaveJson(feature);
			}
		} );
		
		return featureItems;
	},

	getPanelItems : function(output,Wdth)
	{
		var me = this;
		var item;
		var menuItems = [];
		var menuData = null;
		var sellerType = -1;
		var sellerCode = -1;
		var headerId = null;
		var headerName = null;
		var subHeaderId = null;
		var subHeaderName = null;
		var sectionId = null
		var servicesCount = -1;
		var accessTypesCount = -1;

		menuData = this.getBankAdminMenuList();
		var md = menuData.d.details ;
		Ext.each( md, function( moduleAccessMenu, index )
		{
			// if same level module menu
			if( sellerType == moduleAccessMenu.sellerType )
			{
				
			}
			else
			{
					servicesCount++;
					accessTypesCount++;
					sellerType = moduleAccessMenu.sellerType;
					headerName = getLabel('FI.'+ moduleAccessMenu.sellerType,'Fi');
					headerId = moduleAccessMenu.sellerCode + moduleAccessMenu.sellerType + 'Header';
					me.servicesImgIds[ servicesCount ] = sellerType + headerName;
					me.servicesHeaderIds[ servicesCount ] = headerId;
					// insert item for panel header
					item =
					{
						xtype : 'panel',
						id : headerId,
						layout : 'column',
						cls : 'non-t7-privilege-label',
						items : me.setPanelHeader( headerId, headerName, sellerType,output,Wdth)
					};
					menuItems.push( item );

					
					sectionId = moduleAccessMenu.sellerType + moduleAccessMenu.sellerType + moduleAccessMenu.sellerCode
						+ moduleAccessMenu.sellerDescription + 'Section';
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
						items : me.setMenuRow( moduleAccessMenu.sellerType,output,Wdth )
					};
					menuItems.push( item );
			}

		} );

		return menuItems;
	},

	getAccessTypeCodeMask : function()
	{
		var me = this;
		var accessCodeMask = "01|1,02|1,03|1,04|1,05|1,06|1";
		var objParam = {};
		var strUrl = 'getCatAccessTypeCodeMask.srvc?'+ csrfTokenName + '=' + csrfTokenValue;		
		objParam['$viewState']=document.getElementById('viewState').value;
		objParam['$category']=document.getElementById('usrCategory').value;
		
		Ext.Ajax.request(
		{
			url : strUrl,
			method : 'POST',
			params:objParam,
			async : false,
			success : function( response )
			{
				if( !Ext.isEmpty( response) && !Ext.isEmpty( response.responseText))
				{
					accessCodeMask = response.responseText;
				}				
				return accessCodeMask;
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
		return accessCodeMask;
	},
	
	initComponent : function()
	{
		var me = this;
		me.allAdminPrivileges = me.loadFeaturs();
		me.allAdminOldPrivileges = me.loadOldFeaturs();
		var categroyAccessTypeCode = null ; 
		var removeComma = 	me.getAccessTypeCodeMask();
		var lastChar = removeComma.slice(-1);
		if (lastChar == ',') {
			categroyAccessTypeCode = removeComma.slice(0, -1);
		}
		else{
			categroyAccessTypeCode = removeComma;
		}
		var arrItems = [];
		var allServiceCode = [];
		var parts = [];
		var output = [];
		var serviceArr = [];
	//	var admPriv = me.allAdminPrivileges.d.details;
		
		if( !Ext.isEmpty( categroyAccessTypeCode))
		{
			allServiceCode = categroyAccessTypeCode.split(",");
		}
		
		allServiceCode.forEach( function (arrayItem)
		{
			 serviceArr = arrayItem.split('|');
			if(serviceArr.length > 1 && serviceArr[1] == 1){
				arrItems.push(arrayItem);
			}
		});
		
		arrItems.forEach( function (arrayItem)
		{
			var hm = new Object();
			parts = arrayItem.split("|");
			var key=parts[0];
			var value=parts[1];
				hm.key=key;
				hm.value=value;
				output.push(hm);
		});
		var count=0 ;
		Ext.each( output, function( opt, index )
		{
			if(opt.value == '1')
			{
				count++;
			}
		});
		var tempwidth = 1 - 0.330 ;
		var Wdth = tempwidth/count;
		GCP.getApplication().on(
		{
			callAdminSaveItems : function( sellerType, sellerCode, checkBoxValue )
			{
				me.saveItems( sellerType, sellerCode, checkBoxValue );
			}
		} );

		me.items =
		[
			{
				xtype : 'container',
				cls : 'brprivilege',
				items :
				[
					{
						xtype:'panel',
						items:[{
								xtype : 'panel',
								id : 'columnHeader',
								layout : 'column',
								cls : 'non-t7-privilege-label', 
								items : me.setColumnHeader(output)
						}]
					},
					{
						xtype:'panel',
						overflowY:'auto',
						maxHeight : 400,
						items:[{
								xtype : 'panel',
								itemId : 'adminPrivilegePanelItemId',
								items : me.getPanelItems(output,Wdth)
						}]
					}
				]
			}
		];

		if( pageMode === "VIEW" || pageMode === "VERIFY" )
		{
			me.bbar =
			[
			'->',
				{
					text : getLabel('close','Close'),
					handler : function( btn, opts )
					{
						me.close();
					}
				}
			];
		}
		else
		{
			me.bbar =
			[
				{
					text : getLabel('cancel','Cancel'),
					handler : function( btn, opts )
					{
						me.close();
					}
				}, '->',
				{
					text : getLabel('submit','Submit'),
					handler : function( btn, opts )
					{
						me.saveItems( null, null, null );
						me.close();
					}
				}
			];
		}
		this.callParent( arguments );
		console.log(me.rowCount);
	},

	changeHeaderIcon : function( btn, sellerType, iconType )
	{
		if( true )
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

			if( btn.icon.match( 'checkbox.png' ) )
			{
				btn.setIcon( "./static/images/icons/checked_nont7.png" );
				flag = true;
			}
			else
			{
				btn.setIcon( "./static/images/icons/checkbox.png" );
				flag = false;
			}
			Ext.each( fieldJson, function( field, index )
			{
				
					Ext.each( field.items, function( field, index )
			{
				featureId = field.itemId;
				element = me.down( 'checkboxfield[itemId=' + featureId + ']' );
				if( element != null && element != undefined && !element.hidden )
				{
					if( sellerType == field.sellerType && iconType == element.mode )
					{
						element.setValue( flag );
						element.defVal = element.getValue();
					}
				}
			
			} );
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
									element.setIcon( "./static/images/icons/checked_nont7.png" );
								}
								else
								{
									element.setIcon( "./static/images/icons/checkbox.png" );
								}
							}
						}
					}
				}
			}
		}
	},
	
	saveItems : function( sellerType, sellerCode, checkBoxValue )
	{
		var me = this;
		var featureId = null;
		var element = null;
		Ext.each( fieldJson, function( field, index )
		{
			Ext.each( field.items, function( field, index )
		{
			featureId = field.itemId;
			element = me.down( 'checkboxfield[itemId=' + featureId + ']' );
			if( element != null && element != undefined && !element.hidden )
			{
				// if any service or access type is unchecked
				if( sellerType == field.sellerType || sellerCode == field.sellerCode )
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
				if( 'accessType01' == element.mode )
				{
					accessType01[ field.sellerCode ] = element.getValue();
				}
				if( 'accessType02' == element.mode )
				{
					accessType02[ field.sellerCode ] = element.getValue();
				}
				if( 'accessType03' == element.mode )
				{
					accessType03[ field.sellerCode ] = element.getValue();
				}
				if( 'accessType04' == element.mode )
				{
					accessType04[ field.sellerCode ] = element.getValue();
				}
				if( 'accessType05' == element.mode )
				{
					accessType05[ field.sellerCode ] = element.getValue();
				}
				if( 'accessType06' == element.mode )
				{
					accessType06[ field.sellerCode ] = element.getValue();
				}
			}
		} );
		});
		if( !Ext.isEmpty( me.fnCallback ) && typeof me.fnCallback == 'function' )
		{
			me.fnCallback( accessType01, accessType02, accessType03,accessType04,accessType05,accessType06 );
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
			iconItemId.setIcon( "./static/images/icons/checked_nont7.png" );
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
			iconItemId.setIcon( "./static/images/icons/checkbox.png" );
			//authIcon
			vfeatureId = btn.itemId.substr(0,btn.itemId.indexOf(lIconType)) +"authIcon";
			iconItemId = me.down( 'button[itemId=' + vfeatureId + ']' );
			iconItemId.setIcon( "./static/images/icons/checkbox.png" );
		}
	}	
} );