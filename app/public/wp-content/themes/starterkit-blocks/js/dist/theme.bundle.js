import { openBlock, createElementBlock, toDisplayString, createApp } from 'vue';

var script = {
	data() {
		return {
			count: 0,
		};
	},
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("button", {
    class: "test",
    onClick: _cache[0] || (_cache[0] = $event => ($data.count++))
  }, "You clicked me " + toDisplayString($data.count) + " times.", 1 /* TEXT */))
}

script.render = render;
script.__file = "blocks/custom/call-to-action/call-to-action.vue";

// WP_VARS brings PHP variables into JS and is defined in inc/frontend/class-frontend.php

const vue = createApp(script);

if (document.getElementById('app')) {
	vue.mount('#app');
}

export { vue };

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJqcy90aGVtZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBXUF9WQVJTIGJyaW5ncyBQSFAgdmFyaWFibGVzIGludG8gSlMgYW5kIGlzIGRlZmluZWQgaW4gaW5jL2Zyb250ZW5kL2NsYXNzLWZyb250ZW5kLnBocFxyXG4vKiBnbG9iYWwgV1BfVkFSUyAqL1xyXG5cclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXHJcbi8vaW1wb3J0IHsgYW5pbWF0ZUludG9WaWV3IH0gZnJvbSAnLi4vbm9kZV9tb2R1bGVzL0Bkb3VibGVlZGVzaWduL2FuaW1hdGUtaW50by12aWV3L2Rpc3QvYW5pbWF0ZS1pbnRvLXZpZXcuanMnO1xyXG4vLyBub2luc3BlY3Rpb24gRVM2VW51c2VkSW1wb3J0c1xyXG4vL2ltcG9ydCB7IGluaXREcm9wZG93bk1lbnUsIGluaXRNb2JpbGVNZW51IH0gZnJvbSAnLi90aGVtZS9uYXZpZ2F0aW9uLmpzJztcclxuLy9pbXBvcnQgeyBpbml0R29vZ2xlTWFwIH0gZnJvbSAnLi90aGVtZS9nbWFwcy5qcyc7XHJcblxyXG4vL2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcclxuLy8ndXNlIHN0cmljdCc7XHJcblxyXG4vL2luaXRNb2JpbGVNZW51KCk7XHJcbi8vaW5pdERyb3Bkb3duTWVudSgpO1xyXG4vL2luaXRHb29nbGVNYXAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFjZi1tYXAnKSk7XHJcbi8vfSk7XHJcblxyXG5pbXBvcnQgeyBjcmVhdGVBcHAgfSBmcm9tICd2dWUnO1xyXG5pbXBvcnQgQ2FsbFRvQWN0aW9uIGZyb20gJy4uL2Jsb2Nrcy9jdXN0b20vY2FsbC10by1hY3Rpb24vY2FsbC10by1hY3Rpb24udnVlJztcclxuXHJcbmV4cG9ydCBjb25zdCB2dWUgPSBjcmVhdGVBcHAoQ2FsbFRvQWN0aW9uKTtcclxuXHJcbmlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJykpIHtcclxuXHR2dWUubW91bnQoJyNhcHAnKTtcclxufVxyXG5cclxuIl0sImZpbGUiOiJ0aGVtZS5idW5kbGUuanMifQ==
