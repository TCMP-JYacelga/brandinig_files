(function($){$.fn.actionsmenu=function(options){return this.each(function(){var $wrappingElement=$(this);var o=$.extend({maxHeight:315,openLeft:false,width:180},options);$('body').attr('role','application');var menuTitle=$wrappingElement.children().eq(0).text();var $button=$('<button class="actions_menu_button ' + $wrappingElement.attr('class') + '" tabindex="' + $wrappingElement.attr('tabindex') + '" title="' + $wrappingElement.attr('title') + '" id="'+$wrappingElement.attr('id')+'_button" aria-haspopup="true" aria-owns="'+$wrappingElement.attr('id')+'_menu">'+menuTitle+'</button>');$button.insertAfter($wrappingElement);var $menu=$('<ul class="actions_menu" id="'+$wrappingElement.attr('id')+'_menu" role="menu" aria-hidden="true" aria-labelledby="'+$wrappingElement.attr('id')+'_button"></ul>');$wrappingElement.find('li > a').each(function(i){var $li=$('<li><a href="#" role="menuitem" tabindex="-1">'+$(this).text()+'</a>');if($(this).attr('class'))$li.find('a').eq(0).addClass($(this).attr('class'));if($(this).attr('id'))$li.find('a').eq(0).attr('id',$(this).attr('id'));if($(this).parent().is(':last-child')&&i<$wrappingElement.find('li > a').length-1)$li.addClass('separator');$li.appendTo($menu)});$menu.appendTo('body');if($menu.outerHeight()>o.maxHeight)$menu.height(o.maxHeight);$menu.css('width',o.width).addClass('actions_menu_hidden');$menu.bind('toggle',function(){if($(this).is(':hidden'))$(this).trigger('show');else $(this).trigger('hide')});$menu.bind('show',function(){$('ul[id$=_menu]:not(:hidden)').each(function(){$(this).addClass('actions_menu_hidden').attr('aria-hidden',true);$('button[id='+$(this).attr('aria-labelledby')+']').removeClass('actions_menu_button_active')});var positionLeft=$button.offset().left;if(o.openLeft)positionLeft-=$(this).outerWidth()-$button.outerWidth();$(this).appendTo('body').removeClass('actions_menu_hidden').attr('aria-hidden',false).css({left:positionLeft,top:$button.offset().top+$button.outerHeight()});$button.addClass('actions_menu_button_active')});$menu.bind('hide',function(){$(this).addClass('actions_menu_hidden').attr('aria-hidden',true);$button.removeClass('actions_menu_button_active')});$button.click(function(){return false});$button.mousedown(function(){$menu.trigger('toggle');$(this).focus();return false});$menu.click(function(){$(this).trigger('hide')});$(document).click(function(){$menu.trigger('hide')});$button.bind($.browser.opera?'keypress':'keydown',function(e){switch(e.keyCode){case 13:case 32:case 38:case 40:if(!$(this).hasClass('actions_menu_button_active'))$menu.trigger('toggle');$menu.find('a:first').focus();return false;break;case 27:$menu.trigger('hide');break;case 9:$menu.trigger('hide');break}});$menu.bind($.browser.opera?'keypress':'keydown',function(e){switch(e.keyCode){case 13:$(this).trigger('hide');break;case 32:$(this).trigger('click',[e]);$(this).trigger('hide');return false;break;case 38:if($(e.target).parent().prev().length)$(e.target).parent().prev().find('a').eq(0).focus();else $(e.target).parent().siblings('li:last').find('a').eq(0).focus();return false;break;case 40:if($(e.target).parent().next().length)$(e.target).parent().next().find('a').eq(0).focus();else $(e.target).parent().siblings('li:first').find('a').eq(0).focus();return false;break;case 27:$(this).trigger('hide');$button.focus();break;case 9:$(this).trigger('hide');break}});$wrappingElement.remove()})}})(jQuery);