class DynamicAdapt {
   constructor(type) {
      this.type = type;
   }

   init() {
      // массив объектов
      this.оbjects = [];
      this.daClassname = '_dynamic_adapt_';
      // массив DOM-элементов
      this.nodes = [...document.querySelectorAll('[data-da]')];

      // наполнение оbjects объктами
      this.nodes.forEach((node) => {
         const data = node.dataset.da.trim();
         const dataArray = data.split(',');
         const оbject = {};
         оbject.element = node;
         оbject.parent = node.parentNode;
         оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
         оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767';
         оbject.place = dataArray[2] ? dataArray[2].trim() : 'last';
         оbject.index = this.indexInParent(оbject.parent, оbject.element);
         this.оbjects.push(оbject);
      });

      this.arraySort(this.оbjects);

      // массив уникальных медиа-запросов
      this.mediaQueries = this.оbjects
         .map(({
            breakpoint
         }) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)
         .filter((item, index, self) => self.indexOf(item) === index);

      // навешивание слушателя на медиа-запрос
      // и вызов обработчика при первом запуске
      this.mediaQueries.forEach((media) => {
         const mediaSplit = media.split(',');
         const matchMedia = window.matchMedia(mediaSplit[0]);
         const mediaBreakpoint = mediaSplit[1];

         // массив объектов с подходящим брейкпоинтом
         const оbjectsFilter = this.оbjects.filter(
            ({
               breakpoint
            }) => breakpoint === mediaBreakpoint
         );
         matchMedia.addEventListener('change', () => {
            this.mediaHandler(matchMedia, оbjectsFilter);
         });
         this.mediaHandler(matchMedia, оbjectsFilter);
      });
   }

   // Основная функция
   mediaHandler(matchMedia, оbjects) {
      if (matchMedia.matches) {
         оbjects.forEach((оbject) => {
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.moveTo(оbject.place, оbject.element, оbject.destination);
         });
      } else {
         оbjects.forEach(
            ({
               parent,
               element,
               index
            }) => {
               if (element.classList.contains(this.daClassname)) {
                  this.moveBack(parent, element, index);
               }
            }
         );
      }
   }

   // Функция перемещения
   moveTo(place, element, destination) {
      element.classList.add(this.daClassname);
      if (place === 'last' || place >= destination.children.length) {
         destination.append(element);
         return;
      }
      if (place === 'first') {
         destination.prepend(element);
         return;
      }
      destination.children[place].before(element);
   }

   // Функция возврата
   moveBack(parent, element, index) {
      element.classList.remove(this.daClassname);
      if (parent.children[index] !== undefined) {
         parent.children[index].before(element);
      } else {
         parent.append(element);
      }
   }

   // Функция получения индекса внутри родителя
   indexInParent(parent, element) {
      return [...parent.children].indexOf(element);
   }

   // Функция сортировки массива по breakpoint и place 
   // по возрастанию для this.type = min
   // по убыванию для this.type = max
   arraySort(arr) {
      if (this.type === 'min') {
         arr.sort((a, b) => {
            if (a.breakpoint === b.breakpoint) {
               if (a.place === b.place) {
                  return 0;
               }
               if (a.place === 'first' || b.place === 'last') {
                  return -1;
               }
               if (a.place === 'last' || b.place === 'first') {
                  return 1;
               }
               return a.place - b.place;
            }
            return a.breakpoint - b.breakpoint;
         });
      } else {
         arr.sort((a, b) => {
            if (a.breakpoint === b.breakpoint) {
               if (a.place === b.place) {
                  return 0;
               }
               if (a.place === 'first' || b.place === 'last') {
                  return 1;
               }
               if (a.place === 'last' || b.place === 'first') {
                  return -1;
               }
               return b.place - a.place;
            }
            return b.breakpoint - a.breakpoint;
         });
         return;
      }
   }
}

const da = new DynamicAdapt("max");
da.init();

$(document).ready(function () {
   $(window).scroll(function () {
      if ($(window).scrollTop() > 10) {
         $('.header__top').addClass('hide');
      } else {
         $('.header__top').removeClass('hide');
      }
   });
   $(".header__drop-tab-content-item").not(":first").hide();
   $(".header__drop-tab").click(function () {
      $(".header__drop-tab").removeClass("active").eq($(this).index()).addClass("active");
      $(".header__drop-tab-content-item").hide().eq($(this).index()).fadeIn();
   }).eq(0).addClass("active");



   $(".info__tabs-body-item").not(":first").hide();
   $(".info__tabs-head-item").click(function () {
      $(".info__tabs-head-item").removeClass("active").eq($(this).index()).addClass("active");
      $(".info__tabs-body-item").hide().eq($(this).index()).fadeIn();
   }).eq(0).addClass("active");





   $('.header__drop-tab-content-item-head').not(this).removeClass('in').next().slideUp();
   $('.header__drop-tab-content-item-head').click(function () {
      $(this).toggleClass('in').next().slideToggle();
      $('.header__drop-tab-content-item-head').not(this).removeClass('in').next().slideUp();
   });

   $('.header__mob-wrap-head').not(this).removeClass('in').next().slideUp();
   $('.header__mob-wrap-head').click(function () {
      $(this).toggleClass('in').next().slideToggle();
      $('.header__mob-wrap-head').not(this).removeClass('in').next().slideUp();
   });



   $('.info__blok-more').click(function () {
      $('.info__blok-review').removeClass('hide');
      $('.info__blok-more').addClass('hide');
   });

    $('.info__buy-more').click(function () {
      $('.info__buy').removeClass('hide');
      $('.info__buy-more').addClass('hide');
   });


   

   $('.header__bottom-menu-open').click(function () {
      if ($(window).width() <= '734') {
         $('.icon-menu-x').toggleClass('icon-menu').toggleClass('icon-close');
         $('.header__mob').toggleClass('active');
         $('body').toggleClass('lock');
      } else {
         $('.header__drop, .header__drop-container, .header__drop-inner').toggleClass('active');
         $('body').toggleClass('lock');
      }
   });
   if ($(window).width() <= '734') {
      $('.descr__text-is').removeClass('icon-ok');
      $('.icon-cart-x').removeClass('icon-cart');
   }

   (function ($) {
      var defaults = {
         url: false,
         callback: false,
         target: false,
         duration: 120,
         on: 'mouseover', // other options: grab, click, toggle
         touch: true, // enables a touch fallback
         onZoomIn: false,
         onZoomOut: false,
         magnify: 1
      };

      // Core Zoom Logic, independent of event listeners.
      $.zoom = function (target, source, img, magnify) {
         var targetHeight,
            targetWidth,
            sourceHeight,
            sourceWidth,
            xRatio,
            yRatio,
            offset,
            $target = $(target),
            position = $target.css('position'),
            $source = $(source);

         // The parent element needs positioning so that the zoomed element can be correctly positioned within.
         target.style.position = /(absolute|fixed)/.test(position) ? position : 'relative';
         target.style.overflow = 'hidden';
         img.style.width = img.style.height = '';

         $(img)
            .addClass('zoomImg')
            .css({
               position: 'absolute',
               top: 0,
               left: 0,
               opacity: 0,
               width: img.width * 2,
               height: img.height * 2,
               border: 'none',
               maxWidth: 'none',
               maxHeight: 'none'
            })
            .appendTo(target);

         return {
            init: function () {
               targetWidth = $target.outerWidth();
               targetHeight = $target.outerHeight();

               if (source === target) {
                  sourceWidth = targetWidth;
                  sourceHeight = targetHeight;
               } else {
                  sourceWidth = $source.outerWidth();
                  sourceHeight = $source.outerHeight();
               }

               xRatio = (img.width - targetWidth) / sourceWidth;
               yRatio = (img.height - targetHeight) / sourceHeight;

               offset = $source.offset();
            },
            move: function (e) {
               var left = (e.pageX - offset.left),
                  top = (e.pageY - offset.top);

               top = Math.max(Math.min(top, sourceHeight), 0);
               left = Math.max(Math.min(left, sourceWidth), 0);

               img.style.left = (left * -xRatio) + 'px';
               img.style.top = (top * -yRatio) + 'px';
            }
         };
      };

      $.fn.zoom = function (options) {
         return this.each(function () {
            var
               settings = $.extend({}, defaults, options || {}),
               //target will display the zoomed image
               target = settings.target && $(settings.target)[0] || this,
               //source will provide zoom location info (thumbnail)
               source = this,
               $source = $(source),
               img = document.createElement('img'),
               $img = $(img),
               mousemove = 'mousemove.zoom',
               clicked = false,
               touched = false;

            // If a url wasn't specified, look for an image element.
            if (!settings.url) {
               var srcElement = source.querySelector('img');
               if (srcElement) {
                  settings.url = srcElement.getAttribute('data-src') || srcElement.currentSrc || srcElement.src;
               }
               if (!settings.url) {
                  return;
               }
            }

            $source.one('zoom.destroy', function (position, overflow) {
               $source.off(".zoom");
               target.style.position = position;
               target.style.overflow = overflow;
               img.onload = null;
               $img.remove();
            }.bind(this, target.style.position, target.style.overflow));

            img.onload = function () {
               var zoom = $.zoom(target, source, img, settings.magnify);

               function start(e) {
                  zoom.init();
                  zoom.move(e);

                  // Skip the fade-in for IE8 and lower since it chokes on fading-in
                  // and changing position based on mousemovement at the same time.
                  $img.stop()
                     .fadeTo($.support.opacity ? settings.duration : 0, 1, $.isFunction(settings.onZoomIn) ? settings.onZoomIn.call(img) : false);
               }

               function stop() {
                  $img.stop()
                     .fadeTo(settings.duration, 0, $.isFunction(settings.onZoomOut) ? settings.onZoomOut.call(img) : false);
               }

               // Mouse events
               if (settings.on === 'grab') {
                  $source
                     .on('mousedown.zoom',
                        function (e) {
                           if (e.which === 1) {
                              $(document).one('mouseup.zoom',
                                 function () {
                                    stop();

                                    $(document).off(mousemove, zoom.move);
                                 }
                              );

                              start(e);

                              $(document).on(mousemove, zoom.move);

                              e.preventDefault();
                           }
                        }
                     );
               } else if (settings.on === 'click') {
                  $source.on('click.zoom',
                     function (e) {
                        if (clicked) {
                           // bubble the event up to the document to trigger the unbind.
                           return;
                        } else {
                           clicked = true;
                           start(e);
                           $(document).on(mousemove, zoom.move);
                           $(document).one('click.zoom',
                              function () {
                                 stop();
                                 clicked = false;
                                 $(document).off(mousemove, zoom.move);
                              }
                           );
                           return false;
                        }
                     }
                  );
               } else if (settings.on === 'toggle') {
                  $source.on('click.zoom',
                     function (e) {
                        if (clicked) {
                           stop();
                        } else {
                           start(e);
                        }
                        clicked = !clicked;
                     }
                  );
               } else if (settings.on === 'mouseover') {
                  zoom.init(); // Preemptively call init because IE7 will fire the mousemove handler before the hover handler.

                  $source
                     .on('mouseenter.zoom', start)
                     .on('mouseleave.zoom', stop)
                     .on(mousemove, zoom.move);
               }

               // Touch fallback
               if (settings.touch) {
                  $source
                     .on('touchstart.zoom', function (e) {
                        e.preventDefault();
                        if (touched) {
                           touched = false;
                           stop();
                        } else {
                           touched = true;
                           start(e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]);
                        }
                     })
                     .on('touchmove.zoom', function (e) {
                        e.preventDefault();
                        zoom.move(e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]);
                     })
                     .on('touchend.zoom', function (e) {
                        e.preventDefault();
                        if (touched) {
                           touched = false;
                           stop();
                        }
                     });
               }

               if ($.isFunction(settings.callback)) {
                  settings.callback.call(img);
               }
            };

            img.setAttribute('role', 'presentation');
            img.alt = '';
            img.src = settings.url;
         });
      };

      $.fn.zoom.defaults = defaults;

   }(window.jQuery));
   if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // код для мобильных устройств
   } else {
      $('.swiper-zoom-container').zoom();
   }

});


var swiper_preview = new Swiper(".swiper-preview", {
   direction: 'vertical',
   slidesPerView: 4.5,
   navigation: {
      nextEl: '.swiper-preview-next',
      prevEl: '.swiper-preview-prev',
   },
   allowTouchMove: false,
});
var swiper_main = new Swiper(".swiper-main", {
   zoom: true,
   slidesPerView: 1.1,
   centeredSlides: true,
   thumbs: {
      swiper: swiper_preview
   },
   spaceBetween: 10,
   breakpoints: {
      735: {
         slidesPerView: 1,
         spaceBetween: 30,
      }
   },
   navigation: {
      nextEl: '.swiper-main-next',
      prevEl: '.swiper-main-prev',
   },
   pagination: {
      el: '.swiper-main-pagination',
      type: 'bullets',
      clickable: true
   },
});