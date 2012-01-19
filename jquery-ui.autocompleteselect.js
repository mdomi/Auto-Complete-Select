/*
 * Copyright 2012 Michael Dominice
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function ($) {
	'use strict';
	$.widget('select.autocompleteselect', {
		options : {
			delay: 0,
			minLength: 0
		},
		_create : function () {
			var self = this;
			this.optionValues = this.element.find('option').map(function () {
				var $option = $(this);
				return {
					label : $option.text(),
					value : $option.attr('value')
				};
			});
			this.element.hide();
			this.textInput = $('<input type="text" />').autocomplete({
				delay: this.options.delay,
				minLength: this.options.minLength,
				source : function (request, response) {
					response($.ui.autocomplete.filter(self.optionValues, request.term));
				},
				change: function(event, ui) {
					return false;
				},
				select: function(event, ui) {
					// TODO: add the value correctly
					self.textInput.val(ui.item.label).blur();
					return false;
				}
			}).on({
				focus: function() {
					console.log(this);
					$(this).val('').autocomplete('search');
				}
			}).appendTo(this.element.parent());
			
			console.log(this.element.parent());
		}
	});
})(jQuery);
