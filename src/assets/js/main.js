// JavaScript Document
jQuery(function($) {'use strict',

	//#main-slider
	//Animated WOW JS
	new WOW().init();
	//Fancybox Popup
	// $(document).ready(function() {
	// 	$('.fancybox').fancybox({
	// 		wrapCSS    : 'fancybox-custom',
	// 		closeClick : true,
	// 		openEffect : 'none',
	// 		helpers : {
	// 			title : {
	// 				type : 'inside'
	// 			},
	// 			overlay : {
	// 				css : {
	// 					'background' : 'rgba(238,238,238,0.85)'
	// 				}
	// 			}
	// 		}
	// 	});

	// 		/*for fixed size*/
	// 		/*$('a.fxsize').fancybox({
	// 		autoDimensions: false,
	// 		height: 300,
	// 		width: 400
	// 		});*/
		
			
	// 	});
		
		
	
	/* Responsive Fade Gallery */
	
      // Banner Gallery
    //   $("#banner").responsiveSlides({
    //     maxwidth: 1170,
    //     speed: 800,
	// 	auto: true,
    //     pager: false,
    //     nav: true,
    //     namespace: "callbacks"
    //   });
	  
	//   // Slideshow simple fade (slider1)
    //   $("#slider1").responsiveSlides({
    //     maxwidth: 800,
    //     speed: 800,
	// 	 auto: true
	//  });
	 
	//  // Slideshow with bullet
    //   $("#slider2").responsiveSlides({
    //     maxwidth: 800,
    //     speed: 800,
	// 	 auto: true,             // Boolean: Animate automatically, true or false
	// 	 pager: true,           // Boolean: Show pager, true or false
	// 	 pauseControls: true    // Boolean: Pause when hovering controls, true or false

	//  });
	
	//  $(function () {
	// 	$('[data-toggle="tooltip"]').tooltip()
	//   });


	
	  (function ($) {
		//password validator
		var Validate = {
			config: {
				minLen: 8,
				bothCase: true,
				alphNum: true,
				classContainer: '.formContainer',
				classPassword: '.pass1',
				classConfirm: '.pass2',
				classMsgBox: '.msgBox'
			},
			init: function (config) {
				$.extend(Validate.config, config);
				this.elPassword = $(this.config.classPassword);
				this.elConfirm = $(this.config.classConfirm);
				this.elMsgBox = $(this.config.classMsgBox);
	
				var objInput = this.elPassword;
				this.elMsgBox.hide();
				this.elConfirm.on('click', Validate.setFocus);
				$('body').on('focus.password', this.config.classPassword, Validate.validate);
				$('body').on('blur.password', this.config.classPassword, Validate.validate);
				$('body').on('keyup.password', this.config.classPassword, Validate.validate);
	
			},
			setFocus: function () {
				var container = Validate.config.classContainer,
					msg = $(this).closest(container).find(Validate.config.classMsgBox).text();
				(msg !== 'passed') && $(this).closest(container).find(Validate.config.classPassword).focus();
			},
			showError: function (msg, objInput) {
				var container = Validate.config.classContainer,
					msgBox = objInput.closest(container).find('.passwordValidator'),
					objConfirm = objInput.closest(container).find(Validate.config.classConfirm);
				if (msg === "<b style='color:#4c6ef5'>Password is Set <i class='fa fa-unlock-alt fa-2x'></i></b>") {
					msgBox.html(msg).delay(1000).slideUp();
				} else {
					msgBox.is(':hidden') ? msgBox.html(msg).slideDown() : msgBox.html(msg);
					objConfirm.val('');
				}
				return false
			},
			validate: function () {
				var objInput = $(this),
				regExp = /[a-zA-Z0-9]/;
				
	
				if (Validate.config.bothCase && !regExp.test(objInput.val())) {
				
					Validate.showError("<p>1. Password must contain at least one lowercase letter (a-z)<br/>2. Password must contain at least one uppercase letter (A-Z) <br/>3. Password must contain at least one number (0-9)<br/>4. Password must contain at least " + Validate.config.minLen + " alpha-numeric characters</p>", objInput);
					return false;
					
				}
	
				regExp = /[a-zA-Z]/;
				if (Validate.config.bothCase && !regExp.test(objInput.val())) {
				
					Validate.showError("<p  style='color:red;'>1. Password must contain at least one lowercase letter (a-z) <i class='fa fa-times fa-lg'></i><br/>2. Password must contain at least one uppercase letter (A-Z) <i class='fa fa-times fa-lg'></i><br/><b style='color:green;'>3. Password must contain at least one number (0-9) <i class='fa fa-check fa-lg'></i></b> <br/>4. Password must contain at least " + Validate.config.minLen + " alpha-numeric characters <i class='fa fa-times fa-lg'></i></p>", objInput);
					return false;
					
				}
				{
	
					regExp = /[a-z]/;
					if (Validate.config.bothCase && !regExp.test(objInput.val())) {
						Validate.showError("<p style='color:red;'>1. Password must contain at least one lowercase letter (a-z) <i class='fa fa-times fa-lg'></i><br/><b style='color:green;'>2. Password must contain at least one uppercase letter (A-Z) <i class='fa fa-check fa-lg'></i></b> <br/>3. Password must contain at least one number (0-9) <i class='fa fa-times fa-lg'></i><br/>4. Password must contain at least " + Validate.config.minLen + " alpha-numeric characters <i class='fa fa-times fa-lg'></i></p>", objInput);
						return false;
					}
	
					regExp = /[A-Z]/;
					if (Validate.config.bothCase && !regExp.test(objInput.val())) {
						Validate.showError("<p style='color:red;'><b style='color:green;'>1. Password must contain at least one lowercase letter (a-z) <i class='fa fa-check fa-lg'></i></b><br/>2. Password must contain at least one uppercase letter (A-Z) <i class='fa fa-times fa-lg'></i><br/>3. Password must contain at least one number (0-9) <i class='fa fa-times fa-lg'></i><br/>4. Password must contain at least " + Validate.config.minLen + " alpha-numeric characters <i class='fa fa-times fa-lg'></i></p>", objInput);
						return false;
					}
	
					regExp = /[0-9]/;
					if (Validate.config.alphNum && !regExp.test(objInput.val())) {
						Validate.showError("<p style='color:red;'><b style='color:green;'>1. Password must contain at least one lowercase letter (a-z) <i class='fa fa-check fa-lg'></i><br/>2. Password must contain at least one uppercase letter (A-Z) <i class='fa fa-check fa-lg'></i></b><br/>3. Password must contain at least one number (0-9) <i class='fa fa-times fa-lg'></i><br/>4. Password must contain at least " + Validate.config.minLen + " alpha-numeric characters <i class='fa fa-times fa-lg'></i></p>", objInput);
						return false;
					}
	
					if (objInput.val().length < Validate.config.minLen) {
						Validate.showError("<b style='color:green;'>1. Password must contain at least one lowercase letter (a-z) <i class='fa fa-check fa-lg'></i><br/>2. Password must contain at least one uppercase letter (A-Z) <i class='fa fa-check fa-lg'></i><br/>3. Password must contain at least one number (0-9) <i class='fa fa-check fa-lg'></i><br/></b><p style='color:red;'>4. Password must contain at least " + Validate.config.minLen + " alpha-numeric characters <i class='fa fa-times fa-lg'></i></p>", objInput);
						return false;	
					}
	
	
					Validate.showError("<b style='color:#4c6ef5'>Password is Set <i class='fa fa-unlock-alt fa-2x'></i></b>", objInput)
					return false;
				}
			}
		}
	
		// console.clear();
	
		Validate.init({
			classPassword: '.textPassword',
			classConfirm: '.textConfirmPassword',
			classMsgBox: '.passwordValidator'
		})
	
	
	})(jQuery);
	
		  
		
	
	



	});
