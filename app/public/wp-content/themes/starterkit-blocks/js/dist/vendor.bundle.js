/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.0-beta1): util/index.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
const MILLISECONDS_MULTIPLIER = 1000;
const TRANSITION_END = 'transitionend';

// Shoutout AngusCroll (https://goo.gl/pxwQGp)
const toType = object => {
  if (object === null || object === undefined) {
    return `${object}`
  }

  return Object.prototype.toString.call(object).match(/\s([a-z]+)/i)[1].toLowerCase()
};

const getSelector = element => {
  let selector = element.getAttribute('data-bs-target');

  if (!selector || selector === '#') {
    let hrefAttribute = element.getAttribute('href');

    // The only valid content that could double as a selector are IDs or classes,
    // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
    // `document.querySelector` will rightfully complain it is invalid.
    // See https://github.com/twbs/bootstrap/issues/32273
    if (!hrefAttribute || (!hrefAttribute.includes('#') && !hrefAttribute.startsWith('.'))) {
      return null
    }

    // Just in case some CMS puts out a full URL with the anchor appended
    if (hrefAttribute.includes('#') && !hrefAttribute.startsWith('#')) {
      hrefAttribute = `#${hrefAttribute.split('#')[1]}`;
    }

    selector = hrefAttribute && hrefAttribute !== '#' ? hrefAttribute.trim() : null;
  }

  return selector
};

const getSelectorFromElement = element => {
  const selector = getSelector(element);

  if (selector) {
    return document.querySelector(selector) ? selector : null
  }

  return null
};

const getElementFromSelector = element => {
  const selector = getSelector(element);

  return selector ? document.querySelector(selector) : null
};

const getTransitionDurationFromElement = element => {
  if (!element) {
    return 0
  }

  // Get transition-duration of the element
  let { transitionDuration, transitionDelay } = window.getComputedStyle(element);

  const floatTransitionDuration = Number.parseFloat(transitionDuration);
  const floatTransitionDelay = Number.parseFloat(transitionDelay);

  // Return 0 if element or transition duration is not found
  if (!floatTransitionDuration && !floatTransitionDelay) {
    return 0
  }

  // If multiple durations are defined, take the first
  transitionDuration = transitionDuration.split(',')[0];
  transitionDelay = transitionDelay.split(',')[0];

  return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER
};

const triggerTransitionEnd = element => {
  element.dispatchEvent(new Event(TRANSITION_END));
};

const isElement = object => {
  if (!object || typeof object !== 'object') {
    return false
  }

  if (typeof object.jquery !== 'undefined') {
    object = object[0];
  }

  return typeof object.nodeType !== 'undefined'
};

const getElement = object => {
  // it's a jQuery object or a node element
  if (isElement(object)) {
    return object.jquery ? object[0] : object
  }

  if (typeof object === 'string' && object.length > 0) {
    return document.querySelector(object)
  }

  return null
};

const isVisible = element => {
  if (!isElement(element) || element.getClientRects().length === 0) {
    return false
  }

  const elementIsVisible = getComputedStyle(element).getPropertyValue('visibility') === 'visible';
  // Handle `details` element as its content may falsie appear visible when it is closed
  const closedDetails = element.closest('details:not([open])');

  if (!closedDetails) {
    return elementIsVisible
  }

  if (closedDetails !== element) {
    const summary = element.closest('summary');
    if (summary && summary.parentNode !== closedDetails) {
      return false
    }

    if (summary === null) {
      return false
    }
  }

  return elementIsVisible
};

const isDisabled = element => {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return true
  }

  if (element.classList.contains('disabled')) {
    return true
  }

  if (typeof element.disabled !== 'undefined') {
    return element.disabled
  }

  return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false'
};

/**
 * Trick to restart an element's animation
 *
 * @param {HTMLElement} element
 * @return void
 *
 * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
 */
const reflow = element => {
  element.offsetHeight; // eslint-disable-line no-unused-expressions
};

const getjQuery = () => {
  if (window.jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
    return window.jQuery
  }

  return null
};

const DOMContentLoadedCallbacks = [];

const onDOMContentLoaded = callback => {
  if (document.readyState === 'loading') {
    // add listener on the first call when the document is in loading state
    if (!DOMContentLoadedCallbacks.length) {
      document.addEventListener('DOMContentLoaded', () => {
        for (const callback of DOMContentLoadedCallbacks) {
          callback();
        }
      });
    }

    DOMContentLoadedCallbacks.push(callback);
  } else {
    callback();
  }
};

const defineJQueryPlugin = plugin => {
  onDOMContentLoaded(() => {
    const $ = getjQuery();
    /* istanbul ignore if */
    if ($) {
      const name = plugin.NAME;
      const JQUERY_NO_CONFLICT = $.fn[name];
      $.fn[name] = plugin.jQueryInterface;
      $.fn[name].Constructor = plugin;
      $.fn[name].noConflict = () => {
        $.fn[name] = JQUERY_NO_CONFLICT;
        return plugin.jQueryInterface
      };
    }
  });
};

const execute = callback => {
  if (typeof callback === 'function') {
    callback();
  }
};

const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
  if (!waitForTransition) {
    execute(callback);
    return
  }

  const durationPadding = 5;
  const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;

  let called = false;

  const handler = ({ target }) => {
    if (target !== transitionElement) {
      return
    }

    called = true;
    transitionElement.removeEventListener(TRANSITION_END, handler);
    execute(callback);
  };

  transitionElement.addEventListener(TRANSITION_END, handler);
  setTimeout(() => {
    if (!called) {
      triggerTransitionEnd(transitionElement);
    }
  }, emulatedDuration);
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.0-beta1): dom/event-handler.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * Constants
 */

const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
const stripNameRegex = /\..*/;
const stripUidRegex = /::\d+$/;
const eventRegistry = {}; // Events storage
let uidEvent = 1;
const customEvents = {
  mouseenter: 'mouseover',
  mouseleave: 'mouseout'
};

const nativeEvents = new Set([
  'click',
  'dblclick',
  'mouseup',
  'mousedown',
  'contextmenu',
  'mousewheel',
  'DOMMouseScroll',
  'mouseover',
  'mouseout',
  'mousemove',
  'selectstart',
  'selectend',
  'keydown',
  'keypress',
  'keyup',
  'orientationchange',
  'touchstart',
  'touchmove',
  'touchend',
  'touchcancel',
  'pointerdown',
  'pointermove',
  'pointerup',
  'pointerleave',
  'pointercancel',
  'gesturestart',
  'gesturechange',
  'gestureend',
  'focus',
  'blur',
  'change',
  'reset',
  'select',
  'submit',
  'focusin',
  'focusout',
  'load',
  'unload',
  'beforeunload',
  'resize',
  'move',
  'DOMContentLoaded',
  'readystatechange',
  'error',
  'abort',
  'scroll'
]);

/**
 * Private methods
 */

function getUidEvent(element, uid) {
  return (uid && `${uid}::${uidEvent++}`) || element.uidEvent || uidEvent++
}

function getEvent(element) {
  const uid = getUidEvent(element);

  element.uidEvent = uid;
  eventRegistry[uid] = eventRegistry[uid] || {};

  return eventRegistry[uid]
}

function bootstrapHandler(element, fn) {
  return function handler(event) {
    event.delegateTarget = element;

    if (handler.oneOff) {
      EventHandler.off(element, event.type, fn);
    }

    return fn.apply(element, [event])
  }
}

function bootstrapDelegationHandler(element, selector, fn) {
  return function handler(event) {
    const domElements = element.querySelectorAll(selector);

    for (let { target } = event; target && target !== this; target = target.parentNode) {
      for (const domElement of domElements) {
        if (domElement !== target) {
          continue
        }

        event.delegateTarget = target;

        if (handler.oneOff) {
          EventHandler.off(element, event.type, selector, fn);
        }

        return fn.apply(target, [event])
      }
    }
  }
}

function findHandler(events, handler, delegationSelector = null) {
  return Object.values(events)
    .find(event => event.originalHandler === handler && event.delegationSelector === delegationSelector)
}

function normalizeParameters(originalTypeEvent, handler, delegationFunction) {
  const delegation = typeof handler === 'string';
  const originalHandler = delegation ? delegationFunction : handler;
  let typeEvent = getTypeEvent(originalTypeEvent);

  if (!nativeEvents.has(typeEvent)) {
    typeEvent = originalTypeEvent;
  }

  return [delegation, originalHandler, typeEvent]
}

function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
  if (typeof originalTypeEvent !== 'string' || !element) {
    return
  }

  if (!handler) {
    handler = delegationFunction;
    delegationFunction = null;
  }

  // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
  // this prevents the handler from being dispatched the same way as mouseover or mouseout does
  if (originalTypeEvent in customEvents) {
    const wrapFunction = fn => {
      return function (event) {
        if (!event.relatedTarget || (event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget))) {
          return fn.call(this, event)
        }
      }
    };

    if (delegationFunction) {
      delegationFunction = wrapFunction(delegationFunction);
    } else {
      handler = wrapFunction(handler);
    }
  }

  const [delegation, originalHandler, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
  const events = getEvent(element);
  const handlers = events[typeEvent] || (events[typeEvent] = {});
  const previousFunction = findHandler(handlers, originalHandler, delegation ? handler : null);

  if (previousFunction) {
    previousFunction.oneOff = previousFunction.oneOff && oneOff;

    return
  }

  const uid = getUidEvent(originalHandler, originalTypeEvent.replace(namespaceRegex, ''));
  const fn = delegation ?
    bootstrapDelegationHandler(element, handler, delegationFunction) :
    bootstrapHandler(element, handler);

  fn.delegationSelector = delegation ? handler : null;
  fn.originalHandler = originalHandler;
  fn.oneOff = oneOff;
  fn.uidEvent = uid;
  handlers[uid] = fn;

  element.addEventListener(typeEvent, fn, delegation);
}

function removeHandler(element, events, typeEvent, handler, delegationSelector) {
  const fn = findHandler(events[typeEvent], handler, delegationSelector);

  if (!fn) {
    return
  }

  element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
  delete events[typeEvent][fn.uidEvent];
}

function removeNamespacedHandlers(element, events, typeEvent, namespace) {
  const storeElementEvent = events[typeEvent] || {};

  for (const handlerKey of Object.keys(storeElementEvent)) {
    if (handlerKey.includes(namespace)) {
      const event = storeElementEvent[handlerKey];
      removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
    }
  }
}

function getTypeEvent(event) {
  // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
  event = event.replace(stripNameRegex, '');
  return customEvents[event] || event
}

const EventHandler = {
  on(element, event, handler, delegationFunction) {
    addHandler(element, event, handler, delegationFunction, false);
  },

  one(element, event, handler, delegationFunction) {
    addHandler(element, event, handler, delegationFunction, true);
  },

  off(element, originalTypeEvent, handler, delegationFunction) {
    if (typeof originalTypeEvent !== 'string' || !element) {
      return
    }

    const [delegation, originalHandler, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
    const inNamespace = typeEvent !== originalTypeEvent;
    const events = getEvent(element);
    const isNamespace = originalTypeEvent.startsWith('.');

    if (typeof originalHandler !== 'undefined') {
      // Simplest case: handler is passed, remove that listener ONLY.
      if (!events || !events[typeEvent]) {
        return
      }

      removeHandler(element, events, typeEvent, originalHandler, delegation ? handler : null);
      return
    }

    if (isNamespace) {
      for (const elementEvent of Object.keys(events)) {
        removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
      }
    }

    const storeElementEvent = events[typeEvent] || {};
    for (const keyHandlers of Object.keys(storeElementEvent)) {
      const handlerKey = keyHandlers.replace(stripUidRegex, '');

      if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
        const event = storeElementEvent[keyHandlers];
        removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
      }
    }
  },

  trigger(element, event, args) {
    if (typeof event !== 'string' || !element) {
      return null
    }

    const $ = getjQuery();
    const typeEvent = getTypeEvent(event);
    const inNamespace = event !== typeEvent;

    let jQueryEvent = null;
    let bubbles = true;
    let nativeDispatch = true;
    let defaultPrevented = false;

    if (inNamespace && $) {
      jQueryEvent = $.Event(event, args);

      $(element).trigger(jQueryEvent);
      bubbles = !jQueryEvent.isPropagationStopped();
      nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
      defaultPrevented = jQueryEvent.isDefaultPrevented();
    }

    const evt = new Event(event, { bubbles, cancelable: true });

    // merge custom information in our event
    if (typeof args !== 'undefined') {
      for (const key of Object.keys(args)) {
        Object.defineProperty(evt, key, {
          get() {
            return args[key]
          }
        });
      }
    }

    if (defaultPrevented) {
      evt.preventDefault();
    }

    if (nativeDispatch) {
      element.dispatchEvent(evt);
    }

    if (evt.defaultPrevented && jQueryEvent) {
      jQueryEvent.preventDefault();
    }

    return evt
  }
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.0-beta1): dom/selector-engine.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * Constants
 */

const SelectorEngine = {
  find(selector, element = document.documentElement) {
    return [].concat(...Element.prototype.querySelectorAll.call(element, selector))
  },

  findOne(selector, element = document.documentElement) {
    return Element.prototype.querySelector.call(element, selector)
  },

  children(element, selector) {
    return [].concat(...element.children).filter(child => child.matches(selector))
  },

  parents(element, selector) {
    const parents = [];
    let ancestor = element.parentNode.closest(selector);

    while (ancestor) {
      parents.push(ancestor);
      ancestor = ancestor.parentNode.closest(selector);
    }

    return parents
  },

  prev(element, selector) {
    let previous = element.previousElementSibling;

    while (previous) {
      if (previous.matches(selector)) {
        return [previous]
      }

      previous = previous.previousElementSibling;
    }

    return []
  },
  // TODO: this is now unused; remove later along with prev()
  next(element, selector) {
    let next = element.nextElementSibling;

    while (next) {
      if (next.matches(selector)) {
        return [next]
      }

      next = next.nextElementSibling;
    }

    return []
  },

  focusableChildren(element) {
    const focusables = [
      'a',
      'button',
      'input',
      'textarea',
      'select',
      'details',
      '[tabindex]',
      '[contenteditable="true"]'
    ].map(selector => `${selector}:not([tabindex^="-"])`).join(',');

    return this.find(focusables, element).filter(el => !isDisabled(el) && isVisible(el))
  }
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.0-beta1): dom/data.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * Constants
 */

const elementMap = new Map();

var Data = {
  set(element, key, instance) {
    if (!elementMap.has(element)) {
      elementMap.set(element, new Map());
    }

    const instanceMap = elementMap.get(element);

    // make it clear we only want one instance per element
    // can be removed later when multiple key/instances are fine to be used
    if (!instanceMap.has(key) && instanceMap.size !== 0) {
      // eslint-disable-next-line no-console
      console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
      return
    }

    instanceMap.set(key, instance);
  },

  get(element, key) {
    if (elementMap.has(element)) {
      return elementMap.get(element).get(key) || null
    }

    return null
  },

  remove(element, key) {
    if (!elementMap.has(element)) {
      return
    }

    const instanceMap = elementMap.get(element);

    instanceMap.delete(key);

    // free up element references if there are no instances left for an element
    if (instanceMap.size === 0) {
      elementMap.delete(element);
    }
  }
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.0-beta1): dom/manipulator.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

function normalizeData(value) {
  if (value === 'true') {
    return true
  }

  if (value === 'false') {
    return false
  }

  if (value === Number(value).toString()) {
    return Number(value)
  }

  if (value === '' || value === 'null') {
    return null
  }

  if (typeof value !== 'string') {
    return value
  }

  try {
    return JSON.parse(decodeURIComponent(value))
  } catch {
    return value
  }
}

function normalizeDataKey(key) {
  return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`)
}

const Manipulator = {
  setDataAttribute(element, key, value) {
    element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
  },

  removeDataAttribute(element, key) {
    element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
  },

  getDataAttributes(element) {
    if (!element) {
      return {}
    }

    const attributes = {};
    const bsKeys = Object.keys(element.dataset).filter(key => key.startsWith('bs') && !key.startsWith('bsConfig'));

    for (const key of bsKeys) {
      let pureKey = key.replace(/^bs/, '');
      pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
      attributes[pureKey] = normalizeData(element.dataset[key]);
    }

    return attributes
  },

  getDataAttribute(element, key) {
    return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`))
  }
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.0-beta1): util/config.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * Class definition
 */

class Config {
  // Getters
  static get Default() {
    return {}
  }

  static get DefaultType() {
    return {}
  }

  static get NAME() {
    throw new Error('You have to implement the static method "NAME", for each component!')
  }

  _getConfig(config) {
    config = this._mergeConfigObj(config);
    config = this._configAfterMerge(config);
    this._typeCheckConfig(config);
    return config
  }

  _configAfterMerge(config) {
    return config
  }

  _mergeConfigObj(config, element) {
    const jsonConfig = isElement(element) ? Manipulator.getDataAttribute(element, 'config') : {}; // try to parse

    return {
      ...this.constructor.Default,
      ...(typeof jsonConfig === 'object' ? jsonConfig : {}),
      ...(isElement(element) ? Manipulator.getDataAttributes(element) : {}),
      ...(typeof config === 'object' ? config : {})
    }
  }

  _typeCheckConfig(config, configTypes = this.constructor.DefaultType) {
    for (const property of Object.keys(configTypes)) {
      const expectedTypes = configTypes[property];
      const value = config[property];
      const valueType = isElement(value) ? 'element' : toType(value);

      if (!new RegExp(expectedTypes).test(valueType)) {
        throw new TypeError(
          `${this.constructor.NAME.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`
        )
      }
    }
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.0-beta1): base-component.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * Constants
 */

const VERSION = '5.2.0-beta1';

/**
 * Class definition
 */

class BaseComponent extends Config {
  constructor(element, config) {
    super();

    element = getElement(element);
    if (!element) {
      return
    }

    this._element = element;
    this._config = this._getConfig(config);

    Data.set(this._element, this.constructor.DATA_KEY, this);
  }

  // Public
  dispose() {
    Data.remove(this._element, this.constructor.DATA_KEY);
    EventHandler.off(this._element, this.constructor.EVENT_KEY);

    for (const propertyName of Object.getOwnPropertyNames(this)) {
      this[propertyName] = null;
    }
  }

  _queueCallback(callback, element, isAnimated = true) {
    executeAfterTransition(callback, element, isAnimated);
  }

  _getConfig(config) {
    config = this._mergeConfigObj(config, this._element);
    config = this._configAfterMerge(config);
    this._typeCheckConfig(config);
    return config
  }

  // Static
  static getInstance(element) {
    return Data.get(getElement(element), this.DATA_KEY)
  }

  static getOrCreateInstance(element, config = {}) {
    return this.getInstance(element) || new this(element, typeof config === 'object' ? config : null)
  }

  static get VERSION() {
    return VERSION
  }

  static get DATA_KEY() {
    return `bs.${this.NAME}`
  }

  static get EVENT_KEY() {
    return `.${this.DATA_KEY}`
  }

  static eventName(name) {
    return `${name}${this.EVENT_KEY}`
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.0-beta1): collapse.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * Constants
 */

const NAME = 'collapse';
const DATA_KEY = 'bs.collapse';
const EVENT_KEY = `.${ DATA_KEY }`;
const DATA_API_KEY = '.data-api';

const EVENT_SHOW = `show${ EVENT_KEY }`;
const EVENT_SHOWN = `shown${ EVENT_KEY }`;
const EVENT_HIDE = `hide${ EVENT_KEY }`;
const EVENT_HIDDEN = `hidden${ EVENT_KEY }`;
const EVENT_CLICK_DATA_API = `click${ EVENT_KEY }${ DATA_API_KEY }`;

const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_COLLAPSE = 'collapse';
const CLASS_NAME_COLLAPSING = 'collapsing';
const CLASS_NAME_COLLAPSED = 'collapsed';
const CLASS_NAME_DEEPER_CHILDREN = `:scope .${ CLASS_NAME_COLLAPSE } .${ CLASS_NAME_COLLAPSE }`;
const CLASS_NAME_HORIZONTAL = 'collapse-horizontal';

const WIDTH = 'width';
const HEIGHT = 'height';

const SELECTOR_ACTIVES = '.collapse.show, .collapse.collapsing';
const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="collapse"]';

const Default = {
	toggle: true,
	parent: null,
};

const DefaultType = {
	toggle: 'boolean',
	parent: '(null|element)',
};

/**
 * Class definition
 */

class Collapse extends BaseComponent {
	constructor(element, config) {
		super(element, config);

		this._isTransitioning = false;
		this._triggerArray = [];

		const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE);

		for (const elem of toggleList) {
			const selector = getSelectorFromElement(elem);
			const filterElement = SelectorEngine.find(selector)
				.filter((foundElement) => foundElement === this._element);

			if (selector !== null && filterElement.length) {
				this._triggerArray.push(elem);
			}
		}

		this._initializeChildren();

		if (! this._config.parent) {
			this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
		}

		if (this._config.toggle) {
			this.toggle();
		}
	}

	// Getters
	static get Default() {
		return Default;
	}

	static get DefaultType() {
		return DefaultType;
	}

	static get NAME() {
		return NAME;
	}

	// Public
	toggle() {
		if (this._isShown()) {
			this.hide();
		} else {
			this.show();
		}
	}

	show() {
		if (this._isTransitioning || this._isShown()) {
			return;
		}

		let activeChildren = [];

		// find active children
		if (this._config.parent) {
			activeChildren = this._getFirstLevelChildren(SELECTOR_ACTIVES)
				.filter((element) => element !== this._element)
				.map((element) => Collapse.getOrCreateInstance(element, { toggle: false }));
		}

		if (activeChildren.length && activeChildren[ 0 ]._isTransitioning) {
			return;
		}

		const startEvent = EventHandler.trigger(this._element, EVENT_SHOW);
		if (startEvent.defaultPrevented) {
			return;
		}

		for (const activeInstance of activeChildren) {
			activeInstance.hide();
		}

		const dimension = this._getDimension();

		this._element.classList.remove(CLASS_NAME_COLLAPSE);
		this._element.classList.add(CLASS_NAME_COLLAPSING);

		this._element.style[ dimension ] = 0;

		this._addAriaAndCollapsedClass(this._triggerArray, true);
		this._isTransitioning = true;

		const complete = () => {
			this._isTransitioning = false;

			this._element.classList.remove(CLASS_NAME_COLLAPSING);
			this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW);

			this._element.style[ dimension ] = '';

			EventHandler.trigger(this._element, EVENT_SHOWN);
		};

		const capitalizedDimension = dimension[ 0 ].toUpperCase() + dimension.slice(1);
		const scrollSize = `scroll${ capitalizedDimension }`;

		this._queueCallback(complete, this._element, true);
		this._element.style[ dimension ] = `${ this._element[ scrollSize ] }px`;
	}

	hide() {
		if (this._isTransitioning || ! this._isShown()) {
			return;
		}

		const startEvent = EventHandler.trigger(this._element, EVENT_HIDE);
		if (startEvent.defaultPrevented) {
			return;
		}

		const dimension = this._getDimension();

		this._element.style[ dimension ] = `${ this._element.getBoundingClientRect()[ dimension ] }px`;

		reflow(this._element);

		this._element.classList.add(CLASS_NAME_COLLAPSING);
		this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW);

		for (const trigger of this._triggerArray) {
			const element = getElementFromSelector(trigger);

			if (element && ! this._isShown(element)) {
				this._addAriaAndCollapsedClass([trigger], false);
			}
		}

		this._isTransitioning = true;

		const complete = () => {
			this._isTransitioning = false;
			this._element.classList.remove(CLASS_NAME_COLLAPSING);
			this._element.classList.add(CLASS_NAME_COLLAPSE);
			EventHandler.trigger(this._element, EVENT_HIDDEN);
		};

		this._element.style[ dimension ] = '';

		this._queueCallback(complete, this._element, true);
	}

	_isShown(element = this._element) {
		return element.classList.contains(CLASS_NAME_SHOW);
	}

	// Private
	_configAfterMerge(config) {
		config.toggle = Boolean(config.toggle); // Coerce string values
		config.parent = getElement(config.parent);
		return config;
	}

	_getDimension() {
		return this._element.classList.contains(CLASS_NAME_HORIZONTAL) ? WIDTH : HEIGHT;
	}

	_initializeChildren() {
		if (! this._config.parent) {
			return;
		}

		const children = this._getFirstLevelChildren(SELECTOR_DATA_TOGGLE);

		for (const element of children) {
			const selected = getElementFromSelector(element);

			if (selected) {
				this._addAriaAndCollapsedClass([element], this._isShown(selected));
			}
		}
	}

	_getFirstLevelChildren(selector) {
		const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
		// remove children if greater depth
		return SelectorEngine.find(selector, this._config.parent).filter((element) => ! children.includes(element));
	}

	_addAriaAndCollapsedClass(triggerArray, isOpen) {
		if (! triggerArray.length) {
			return;
		}

		for (const element of triggerArray) {
			element.classList.toggle(CLASS_NAME_COLLAPSED, ! isOpen);
			element.setAttribute('aria-expanded', isOpen);
		}
	}

	// Static
	static jQueryInterface(config) {
		const _config = {};
		if (typeof config === 'string' && /show|hide/.test(config)) {
			_config.toggle = false;
		}

		return this.each(function() {
			const data = Collapse.getOrCreateInstance(this, _config);

			if (typeof config === 'string') {
				if (typeof data[ config ] === 'undefined') {
					throw new TypeError(`No method named "${ config }"`);
				}

				data[ config ]();
			}
		});
	}
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function(event) {
	// preventDefault only for <a> elements (which change the URL) not inside the collapsible element
	if (event.target.tagName === 'A' || (event.delegateTarget && event.delegateTarget.tagName === 'A')) {
		event.preventDefault();
	}

	const selector = getSelectorFromElement(this);
	const selectorElements = SelectorEngine.find(selector);

	for (const element of selectorElements) {
		Collapse.getOrCreateInstance(element, { toggle: false }).toggle();
	}
});

/**
 * jQuery
 */

defineJQueryPlugin(Collapse);

document.addEventListener('DOMContentLoaded', function() {
	initCollapse();
});

function initCollapse() {
	const collapseElementList = [].slice.call(document.querySelectorAll('.collapse'));
	const collapseList = collapseElementList.map(function(collapseEl) {
		return new Collapse(collapseEl);
	});

	return collapseList;
}
