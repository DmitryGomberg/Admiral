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
})